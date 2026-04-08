using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/admin/statistics
    [HttpGet("statistics")]
    public async Task<ActionResult<object>> GetStatistics()
    {
        var totalStudents = await _context.Users.CountAsync(u => u.Role == "Student");
        var totalCourses = await _context.Courses.CountAsync();
        var totalEnrollments = await _context.Enrollments.CountAsync();
        var activeEnrollments = await _context.Enrollments.CountAsync(e => e.Status == "Active");
        var completedEnrollments = await _context.Enrollments.CountAsync(e => e.Status == "Completed");
        var totalRevenue = await _context.Payments.Where(p => p.Status == "Completed").SumAsync(p => p.Amount);
        var averageRating = await _context.Ratings.AnyAsync() 
            ? await _context.Ratings.AverageAsync(r => r.RatingValue) 
            : 0;

        // Recent enrollments
        var recentEnrollments = await _context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Course)
            .OrderByDescending(e => e.EnrollmentDate)
            .Take(10)
            .Select(e => new
            {
                e.EnrollmentId,
                StudentName = e.Student.FirstName + " " + e.Student.LastName,
                CourseName = e.Course.Title,
                e.EnrollmentDate,
                e.Status
            })
            .ToListAsync();

        // Course popularity
        var coursePopularity = await _context.Enrollments
            .GroupBy(e => e.CourseId)
            .Select(g => new
            {
                CourseId = g.Key,
                CourseName = g.First().Course.Title,
                EnrollmentCount = g.Count()
            })
            .OrderByDescending(x => x.EnrollmentCount)
            .Take(5)
            .ToListAsync();

        // Monthly enrollment trend (last 6 months)
        var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
        var monthlyEnrollments = await _context.Enrollments
            .Where(e => e.EnrollmentDate >= sixMonthsAgo)
            .GroupBy(e => new { e.EnrollmentDate.Year, e.EnrollmentDate.Month })
            .Select(g => new
            {
                Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                Count = g.Count()
            })
            .OrderBy(x => x.Month)
            .ToListAsync();

        return Ok(new
        {
            totalStudents,
            totalCourses,
            totalEnrollments,
            activeEnrollments,
            completedEnrollments,
            totalRevenue,
            averageRating = Math.Round(averageRating, 2),
            recentEnrollments,
            coursePopularity,
            monthlyEnrollments
        });
    }

    // GET: api/admin/students
    [HttpGet("students")]
    public async Task<ActionResult<IEnumerable<object>>> GetAllStudents()
    {
        var students = await _context.Users
            .Where(u => u.Role == "Student")
            .Select(u => new
            {
                u.UserId,
                u.FirstName,
                u.LastName,
                u.Email,
                u.CreatedAt,
                EnrolledCoursesCount = u.Enrollments.Count,
                CompletedCoursesCount = u.Enrollments.Count(e => e.Status == "Completed")
            })
            .ToListAsync();

        return Ok(students);
    }

    // GET: api/admin/students/5/progress
    [HttpGet("students/{studentId}/progress")]
    public async Task<ActionResult<object>> GetStudentProgress(int studentId)
    {
        var student = await _context.Users
            .Include(u => u.Enrollments)
                .ThenInclude(e => e.Course)
            .FirstOrDefaultAsync(u => u.UserId == studentId && u.Role == "Student");

        if (student == null)
        {
            return NotFound(new { message = "Student not found" });
        }

        var enrollments = student.Enrollments.Select(e => new
        {
            e.EnrollmentId,
            e.CourseId,
            CourseName = e.Course.Title,
            e.EnrollmentDate,
            e.CompletionPercentage,
            e.Status,
            e.CompletedAt
        }).ToList();

        var averageProgress = enrollments.Any() 
            ? enrollments.Average(e => e.CompletionPercentage) 
            : 0;

        return Ok(new
        {
            studentId = student.UserId,
            studentName = $"{student.FirstName} {student.LastName}",
            student.Email,
            totalCourses = enrollments.Count,
            completedCourses = enrollments.Count(e => e.Status == "Completed"),
            averageProgress = Math.Round(averageProgress, 2),
            enrollments
        });
    }

    // PUT: api/admin/students/5/status
    [HttpPut("students/{studentId}/status")]
    public async Task<IActionResult> UpdateStudentStatus(int studentId, [FromBody] UpdateStudentStatusDto dto)
    {
        var student = await _context.Users.FindAsync(studentId);

        if (student == null || student.Role != "Student")
        {
            return NotFound(new { message = "Student not found" });
        }

        // You can add IsActive field to User model and update it here
        // For now, we'll just return success
        return Ok(new { message = "Student status updated successfully" });
    }

    // DELETE: api/admin/students/5
    [HttpDelete("students/{studentId}")]
    public async Task<IActionResult> DeleteStudent(int studentId)
    {
        var student = await _context.Users
            .Include(u => u.Enrollments)
            .Include(u => u.Ratings)
            .FirstOrDefaultAsync(u => u.UserId == studentId && u.Role == "Student");

        if (student == null)
        {
            return NotFound(new { message = "Student not found" });
        }

        // Remove related enrollments and ratings
        _context.Enrollments.RemoveRange(student.Enrollments);
        _context.Ratings.RemoveRange(student.Ratings);
        _context.Users.Remove(student);

        await _context.SaveChangesAsync();

        return Ok(new { message = "Student deleted successfully" });
    }

    // GET: api/admin/revenue/summary
    [HttpGet("revenue/summary")]
    public async Task<ActionResult<object>> GetRevenueSummary()
    {
        var totalRevenue = await _context.Payments
            .Where(p => p.Status == "Completed")
            .SumAsync(p => p.Amount);

        var monthlyRevenue = await _context.Payments
            .Where(p => p.Status == "Completed" && p.PaymentDate >= DateTime.UtcNow.AddMonths(-12))
            .GroupBy(p => new { p.PaymentDate.Year, p.PaymentDate.Month })
            .Select(g => new
            {
                Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                Revenue = g.Sum(p => p.Amount)
            })
            .OrderBy(x => x.Month)
            .ToListAsync();

        var revenueByCourse = await _context.Payments
            .Where(p => p.Status == "Completed")
            .GroupBy(p => p.CourseId)
            .Select(g => new
            {
                CourseId = g.Key,
                CourseName = g.First().Course.Title,
                Revenue = g.Sum(p => p.Amount),
                Transactions = g.Count()
            })
            .OrderByDescending(x => x.Revenue)
            .Take(10)
            .ToListAsync();

        return Ok(new
        {
            totalRevenue,
            monthlyRevenue,
            revenueByCourse
        });
    }
}

public class UpdateStudentStatusDto
{
    public string Status { get; set; } = string.Empty;
}

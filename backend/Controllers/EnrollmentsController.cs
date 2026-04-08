using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EnrollmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EnrollmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/enrollments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetEnrollments()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        IQueryable<Enrollment> query = _context.Enrollments
            .Include(e => e.Course)
            .Include(e => e.Student);

        // Students see only their enrollments, admins see all
        if (userRole != "Admin")
        {
            query = query.Where(e => e.StudentId == userId);
        }

        var enrollments = await query
            .Select(e => new
            {
                e.EnrollmentId,
                e.StudentId,
                StudentName = e.Student.FirstName + " " + e.Student.LastName,
                e.CourseId,
                CourseName = e.Course.Title,
                e.EnrollmentDate,
                e.CompletionPercentage,
                e.Status,
                e.CompletedAt
            })
            .ToListAsync();

        return Ok(enrollments);
    }

    // GET: api/enrollments/5
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetEnrollment(int id)
    {
        var enrollment = await _context.Enrollments
            .Include(e => e.Course)
                .ThenInclude(c => c.Modules)
                    .ThenInclude(m => m.Lessons)
            .Include(e => e.Student)
            .FirstOrDefaultAsync(e => e.EnrollmentId == id);

        if (enrollment == null)
        {
            return NotFound(new { message = "Enrollment not found" });
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        // Students can only view their own enrollments
        if (userRole != "Admin" && enrollment.StudentId != userId)
        {
            return Forbid();
        }

        return Ok(new
        {
            enrollment.EnrollmentId,
            enrollment.StudentId,
            StudentName = enrollment.Student.FirstName + " " + enrollment.Student.LastName,
            enrollment.CourseId,
            Course = new
            {
                enrollment.Course.Title,
                enrollment.Course.Description,
                Modules = enrollment.Course.Modules.Select(m => new
                {
                    m.ModuleId,
                    m.Title,
                    Lessons = m.Lessons.Select(l => new
                    {
                        l.LessonId,
                        l.Title,
                        l.OrderIndex
                    })
                })
            },
            enrollment.EnrollmentDate,
            enrollment.CompletionPercentage,
            enrollment.Status,
            enrollment.CompletedAt
        });
    }

    // POST: api/enrollments
    [HttpPost]
    public async Task<ActionResult<Enrollment>> CreateEnrollment([FromBody] CreateEnrollmentDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // Check if course exists
        var courseExists = await _context.Courses.AnyAsync(c => c.CourseId == dto.CourseId);
        if (!courseExists)
        {
            return BadRequest(new { message = "Course not found" });
        }

        // Check if already enrolled
        var existingEnrollment = await _context.Enrollments
            .FirstOrDefaultAsync(e => e.StudentId == userId && e.CourseId == dto.CourseId);

        if (existingEnrollment != null)
        {
            return BadRequest(new { message = "Already enrolled in this course" });
        }

        var enrollment = new Enrollment
        {
            StudentId = userId,
            CourseId = dto.CourseId,
            EnrollmentDate = DateTime.UtcNow,
            CompletionPercentage = 0,
            Status = "Active"
        };

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEnrollment), new { id = enrollment.EnrollmentId }, enrollment);
    }

    // PUT: api/enrollments/5/progress
    [HttpPut("{id}/progress")]
    public async Task<IActionResult> UpdateProgress(int id, [FromBody] UpdateProgressDto dto)
    {
        var enrollment = await _context.Enrollments.FindAsync(id);

        if (enrollment == null)
        {
            return NotFound(new { message = "Enrollment not found" });
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        // Students can only update their own progress
        if (userRole != "Admin" && enrollment.StudentId != userId)
        {
            return Forbid();
        }

        enrollment.CompletionPercentage = dto.CompletionPercentage;

        if (dto.CompletionPercentage >= 100)
        {
            enrollment.Status = "Completed";
            enrollment.CompletedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Progress updated successfully", enrollment });
    }

    // DELETE: api/enrollments/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEnrollment(int id)
    {
        var enrollment = await _context.Enrollments.FindAsync(id);

        if (enrollment == null)
        {
            return NotFound(new { message = "Enrollment not found" });
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        // Students can only delete their own enrollments, admins can delete any
        if (userRole != "Admin" && enrollment.StudentId != userId)
        {
            return Forbid();
        }

        _context.Enrollments.Remove(enrollment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Enrollment deleted successfully" });
    }

    // GET: api/enrollments/course/5/students
    [HttpGet("course/{courseId}/students")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<object>>> GetCourseStudents(int courseId)
    {
        var enrollments = await _context.Enrollments
            .Where(e => e.CourseId == courseId)
            .Include(e => e.Student)
            .Select(e => new
            {
                e.EnrollmentId,
                e.StudentId,
                StudentName = e.Student.FirstName + " " + e.Student.LastName,
                e.Student.Email,
                e.EnrollmentDate,
                e.CompletionPercentage,
                e.Status,
                e.CompletedAt
            })
            .ToListAsync();

        return Ok(enrollments);
    }
}

public class CreateEnrollmentDto
{
    public int CourseId { get; set; }
}

public class UpdateProgressDto
{
    public int CompletionPercentage { get; set; }
}

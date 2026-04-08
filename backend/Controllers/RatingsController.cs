using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RatingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RatingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/ratings/course/5
    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<object>> GetCourseRatings(int courseId)
    {
        var ratings = await _context.Ratings
            .Where(r => r.CourseId == courseId)
            .Include(r => r.Student)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.RatingId,
                r.StudentId,
                StudentName = r.Student.FirstName + " " + r.Student.LastName,
                r.RatingValue,
                r.Review,
                r.CreatedAt
            })
            .ToListAsync();

        var averageRating = ratings.Any() ? ratings.Average(r => r.RatingValue) : 0;
        var totalRatings = ratings.Count;

        return Ok(new
        {
            averageRating = Math.Round(averageRating, 2),
            totalRatings,
            ratings
        });
    }

    // GET: api/ratings/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Rating>> GetRating(int id)
    {
        var rating = await _context.Ratings
            .Include(r => r.Student)
            .Include(r => r.Course)
            .FirstOrDefaultAsync(r => r.RatingId == id);

        if (rating == null)
        {
            return NotFound(new { message = "Rating not found" });
        }

        return Ok(rating);
    }

    // POST: api/ratings
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Rating>> CreateRating([FromBody] CreateRatingDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // Check if course exists
        var courseExists = await _context.Courses.AnyAsync(c => c.CourseId == dto.CourseId);
        if (!courseExists)
        {
            return BadRequest(new { message = "Course not found" });
        }

        // Check if student is enrolled in the course
        var isEnrolled = await _context.Enrollments
            .AnyAsync(e => e.StudentId == userId && e.CourseId == dto.CourseId);

        if (!isEnrolled)
        {
            return BadRequest(new { message = "You must be enrolled in the course to rate it" });
        }

        // Check if already rated
        var existingRating = await _context.Ratings
            .FirstOrDefaultAsync(r => r.StudentId == userId && r.CourseId == dto.CourseId);

        if (existingRating != null)
        {
            return BadRequest(new { message = "You have already rated this course. Use PUT to update." });
        }

        // Validate rating value
        if (dto.RatingValue < 1 || dto.RatingValue > 5)
        {
            return BadRequest(new { message = "Rating must be between 1 and 5" });
        }

        var rating = new Rating
        {
            StudentId = userId,
            CourseId = dto.CourseId,
            RatingValue = dto.RatingValue,
            Review = dto.Review,
            CreatedAt = DateTime.UtcNow
        };

        _context.Ratings.Add(rating);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRating), new { id = rating.RatingId }, rating);
    }

    // PUT: api/ratings/5
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRating(int id, [FromBody] UpdateRatingDto dto)
    {
        var rating = await _context.Ratings.FindAsync(id);

        if (rating == null)
        {
            return NotFound(new { message = "Rating not found" });
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // Only the student who created the rating can update it
        if (rating.StudentId != userId)
        {
            return Forbid();
        }

        // Validate rating value
        if (dto.RatingValue < 1 || dto.RatingValue > 5)
        {
            return BadRequest(new { message = "Rating must be between 1 and 5" });
        }

        rating.RatingValue = dto.RatingValue;
        rating.Review = dto.Review;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Rating updated successfully", rating });
    }

    // DELETE: api/ratings/5
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRating(int id)
    {
        var rating = await _context.Ratings.FindAsync(id);

        if (rating == null)
        {
            return NotFound(new { message = "Rating not found" });
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        // Students can only delete their own ratings, admins can delete any
        if (userRole != "Admin" && rating.StudentId != userId)
        {
            return Forbid();
        }

        _context.Ratings.Remove(rating);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Rating deleted successfully" });
    }

    // GET: api/ratings/statistics/5
    [HttpGet("statistics/{courseId}")]
    public async Task<ActionResult<object>> GetRatingStatistics(int courseId)
    {
        var ratings = await _context.Ratings
            .Where(r => r.CourseId == courseId)
            .ToListAsync();

        if (!ratings.Any())
        {
            return Ok(new
            {
                averageRating = 0,
                totalRatings = 0,
                distribution = new Dictionary<int, int>
                {
                    { 1, 0 }, { 2, 0 }, { 3, 0 }, { 4, 0 }, { 5, 0 }
                }
            });
        }

        var averageRating = ratings.Average(r => r.RatingValue);
        var distribution = ratings
            .GroupBy(r => r.RatingValue)
            .ToDictionary(g => g.Key, g => g.Count());

        // Fill in missing rating values
        for (int i = 1; i <= 5; i++)
        {
            if (!distribution.ContainsKey(i))
            {
                distribution[i] = 0;
            }
        }

        return Ok(new
        {
            averageRating = Math.Round(averageRating, 2),
            totalRatings = ratings.Count,
            distribution = distribution.OrderBy(kv => kv.Key)
        });
    }
}

public class CreateRatingDto
{
    public int CourseId { get; set; }
    public int RatingValue { get; set; }
    public string? Review { get; set; }
}

public class UpdateRatingDto
{
    public int RatingValue { get; set; }
    public string? Review { get; set; }
}

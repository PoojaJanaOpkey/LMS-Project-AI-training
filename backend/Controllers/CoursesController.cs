using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CoursesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses([FromQuery] string? category, [FromQuery] string? level)
        {
            var query = _context.Courses.AsQueryable();

            if (!string.IsNullOrEmpty(category))
                query = query.Where(c => c.Category == category);

            if (!string.IsNullOrEmpty(level))
                query = query.Where(c => c.Level == level);

            return await query.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Modules)
                    .ThenInclude(m => m.Lessons)
                .FirstOrDefaultAsync(c => c.CourseId == id);

            if (course == null)
                return NotFound();

            return course;
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult<Course>> CreateCourse(Course course)
        {
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCourse), new { id = course.CourseId }, course);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, Course course)
        {
            if (id != course.CourseId)
                return BadRequest();

            course.UpdatedAt = DateTime.UtcNow;
            _context.Entry(course).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
                return NotFound();

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Course>>> SearchCourses([FromQuery] string q)
        {
            return await _context.Courses
                .Where(c => c.Title.Contains(q) || c.Description.Contains(q))
                .ToListAsync();
        }

        private bool CourseExists(int id)
        {
            return _context.Courses.Any(e => e.CourseId == id);
        }
    }
}

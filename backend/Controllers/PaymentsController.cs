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
public class PaymentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PaymentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/payments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetPayments()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        IQueryable<Payment> query = _context.Payments
            .Include(p => p.Student)
            .Include(p => p.Course);

        // Students see only their payments, admins see all
        if (userRole != "Admin")
        {
            query = query.Where(p => p.StudentId == userId);
        }

        var payments = await query
            .OrderByDescending(p => p.PaymentDate)
            .Select(p => new
            {
                p.PaymentId,
                p.StudentId,
                StudentName = p.Student.FirstName + " " + p.Student.LastName,
                p.CourseId,
                CourseName = p.Course.Title,
                p.Amount,
                p.PaymentMethod,
                p.TransactionId,
                p.Status,
                p.PaymentDate
            })
            .ToListAsync();

        return Ok(payments);
    }

    // GET: api/payments/5
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetPayment(int id)
    {
        var payment = await _context.Payments
            .Include(p => p.Student)
            .Include(p => p.Course)
            .FirstOrDefaultAsync(p => p.PaymentId == id);

        if (payment == null)
        {
            return NotFound(new { message = "Payment not found" });
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        // Students can only view their own payments
        if (userRole != "Admin" && payment.StudentId != userId)
        {
            return Forbid();
        }

        return Ok(new
        {
            payment.PaymentId,
            payment.StudentId,
            StudentName = payment.Student.FirstName + " " + payment.Student.LastName,
            payment.CourseId,
            CourseName = payment.Course.Title,
            payment.Amount,
            payment.PaymentMethod,
            payment.TransactionId,
            payment.Status,
            payment.PaymentDate
        });
    }

    // POST: api/payments/create
    [HttpPost("create")]
    public async Task<ActionResult<object>> CreatePayment([FromBody] CreatePaymentDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // Check if course exists
        var course = await _context.Courses.FindAsync(dto.CourseId);
        if (course == null)
        {
            return BadRequest(new { message = "Course not found" });
        }

        // Check if already enrolled (and paid)
        var existingEnrollment = await _context.Enrollments
            .FirstOrDefaultAsync(e => e.StudentId == userId && e.CourseId == dto.CourseId);

        if (existingEnrollment != null)
        {
            return BadRequest(new { message = "Already enrolled in this course" });
        }

        // Create payment record
        var payment = new Payment
        {
            StudentId = userId,
            CourseId = dto.CourseId,
            Amount = course.Price,
            PaymentMethod = dto.PaymentMethod,
            TransactionId = Guid.NewGuid().ToString(), // In real app, this would come from payment gateway
            Status = "Pending",
            PaymentDate = DateTime.UtcNow
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            payment.PaymentId,
            payment.TransactionId,
            payment.Amount,
            payment.Status,
            message = "Payment initiated. Please complete payment to enroll in the course."
        });
    }

    // POST: api/payments/verify
    [HttpPost("verify")]
    public async Task<ActionResult<object>> VerifyPayment([FromBody] VerifyPaymentDto dto)
    {
        var payment = await _context.Payments
            .Include(p => p.Course)
            .FirstOrDefaultAsync(p => p.TransactionId == dto.TransactionId);

        if (payment == null)
        {
            return NotFound(new { message = "Payment not found" });
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        if (payment.StudentId != userId)
        {
            return Forbid();
        }

        // In a real application, you would verify with payment gateway (Stripe, PayPal, etc.)
        // For now, we'll just mark it as completed

        payment.Status = "Completed";
        await _context.SaveChangesAsync();

        // Create enrollment
        var enrollment = new Enrollment
        {
            StudentId = userId,
            CourseId = payment.CourseId,
            EnrollmentDate = DateTime.UtcNow,
            CompletionPercentage = 0,
            Status = "Active"
        };

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Payment verified successfully. You are now enrolled in the course.",
            payment.PaymentId,
            payment.TransactionId,
            EnrollmentId = enrollment.EnrollmentId,
            CourseName = payment.Course.Title
        });
    }

    // GET: api/payments/student/history
    [HttpGet("student/history")]
    public async Task<ActionResult<object>> GetStudentPaymentHistory()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var payments = await _context.Payments
            .Where(p => p.StudentId == userId)
            .Include(p => p.Course)
            .OrderByDescending(p => p.PaymentDate)
            .Select(p => new
            {
                p.PaymentId,
                p.CourseId,
                CourseName = p.Course.Title,
                p.Amount,
                p.PaymentMethod,
                p.TransactionId,
                p.Status,
                p.PaymentDate
            })
            .ToListAsync();

        var totalSpent = payments.Where(p => p.Status == "Completed").Sum(p => p.Amount);

        return Ok(new
        {
            totalSpent,
            totalTransactions = payments.Count,
            payments
        });
    }

    // PUT: api/payments/5/refund
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/refund")]
    public async Task<IActionResult> RefundPayment(int id)
    {
        var payment = await _context.Payments.FindAsync(id);

        if (payment == null)
        {
            return NotFound(new { message = "Payment not found" });
        }

        if (payment.Status != "Completed")
        {
            return BadRequest(new { message = "Only completed payments can be refunded" });
        }

        payment.Status = "Refunded";

        // Remove enrollment if exists
        var enrollment = await _context.Enrollments
            .FirstOrDefaultAsync(e => e.StudentId == payment.StudentId && e.CourseId == payment.CourseId);

        if (enrollment != null)
        {
            _context.Enrollments.Remove(enrollment);
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Payment refunded successfully" });
    }
}

public class CreatePaymentDto
{
    public int CourseId { get; set; }
    public string PaymentMethod { get; set; } = string.Empty; // "Stripe", "PayPal", etc.
}

public class VerifyPaymentDto
{
    public string TransactionId { get; set; } = string.Empty;
}

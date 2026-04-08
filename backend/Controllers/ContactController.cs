using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public ContactController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // POST: api/contact
    [HttpPost]
    public async Task<ActionResult<object>> SubmitContactForm([FromBody] ContactFormDto dto)
    {
        if (string.IsNullOrEmpty(dto.Name) || string.IsNullOrEmpty(dto.Email) || 
            string.IsNullOrEmpty(dto.Subject) || string.IsNullOrEmpty(dto.Message))
        {
            return BadRequest(new { message = "All fields are required" });
        }

        // Validate email format
        if (!IsValidEmail(dto.Email))
        {
            return BadRequest(new { message = "Invalid email format" });
        }

        try
        {
            // Get email configuration from appsettings.json
            var smtpHost = _configuration["EmailSettings:SmtpHost"];
            var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
            var smtpUser = _configuration["EmailSettings:SmtpUser"];
            var smtpPassword = _configuration["EmailSettings:SmtpPassword"];
            var adminEmail = _configuration["EmailSettings:AdminEmail"];

            // If email settings are not configured, just log the message
            if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUser))
            {
                // In development, just return success without actually sending
                Console.WriteLine("=== Contact Form Submission ===");
                Console.WriteLine($"From: {dto.Name} <{dto.Email}>");
                Console.WriteLine($"Subject: {dto.Subject}");
                Console.WriteLine($"Message: {dto.Message}");
                Console.WriteLine("===============================");

                return Ok(new { 
                    message = "Thank you for contacting us! We will get back to you soon.",
                    note = "Email not sent (SMTP not configured)"
                });
            }

            // Send email
            using (var client = new SmtpClient(smtpHost, smtpPort))
            {
                client.EnableSsl = true;
                client.Credentials = new NetworkCredential(smtpUser, smtpPassword);

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(smtpUser, "LMS Contact Form"),
                    Subject = $"Contact Form: {dto.Subject}",
                    Body = $@"
                        <h3>New Contact Form Submission</h3>
                        <p><strong>Name:</strong> {dto.Name}</p>
                        <p><strong>Email:</strong> {dto.Email}</p>
                        <p><strong>Subject:</strong> {dto.Subject}</p>
                        <p><strong>Message:</strong></p>
                        <p>{dto.Message.Replace("\n", "<br>")}</p>
                        <hr>
                        <p><small>Sent from LMS Contact Form</small></p>
                    ",
                    IsBodyHtml = true
                };

                mailMessage.To.Add(adminEmail ?? smtpUser);
                mailMessage.ReplyToList.Add(new MailAddress(dto.Email, dto.Name));

                await client.SendMailAsync(mailMessage);
            }

            return Ok(new { message = "Thank you for contacting us! We will get back to you soon." });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending email: {ex.Message}");
            
            // Log but don't expose error details to client
            return Ok(new { 
                message = "Thank you for contacting us! We will get back to you soon.",
                note = "Message received but email delivery pending"
            });
        }
    }

    private bool IsValidEmail(string email)
    {
        try
        {
            var addr = new MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
}

public class ContactFormDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

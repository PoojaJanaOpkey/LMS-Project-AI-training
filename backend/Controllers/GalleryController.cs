using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GalleryController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public GalleryController(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    // GET: api/gallery
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetGalleryItems([FromQuery] string? type = null)
    {
        var query = _context.GalleryItems.AsQueryable();

        if (!string.IsNullOrEmpty(type))
        {
            query = query.Where(g => g.Type == type);
        }

        var items = await query
            .OrderByDescending(g => g.UploadedAt)
            .Select(g => new
            {
                g.GalleryItemId,
                g.Title,
                g.Description,
                g.Type,
                g.FilePath,
                g.ThumbnailPath,
                g.UploadedAt
            })
            .ToListAsync();

        return Ok(items);
    }

    // GET: api/gallery/5
    [HttpGet("{id}")]
    public async Task<ActionResult<GalleryItem>> GetGalleryItem(int id)
    {
        var item = await _context.GalleryItems.FindAsync(id);

        if (item == null)
        {
            return NotFound(new { message = "Gallery item not found" });
        }

        return Ok(item);
    }

    // POST: api/gallery
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<GalleryItem>> CreateGalleryItem([FromForm] CreateGalleryItemDto dto)
    {
        if (dto.File == null || dto.File.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded" });
        }

        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".mp4", ".pdf", ".doc", ".docx" };
        var extension = Path.GetExtension(dto.File.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Invalid file type" });
        }

        // Determine type
        string type = "Document";
        if (new[] { ".jpg", ".jpeg", ".png", ".gif" }.Contains(extension))
        {
            type = "Image";
        }
        else if (extension == ".mp4")
        {
            type = "Video";
        }

        // Create uploads directory if it doesn't exist
        var uploadsPath = Path.Combine(_environment.ContentRootPath, "uploads", "gallery");
        Directory.CreateDirectory(uploadsPath);

        // Generate unique filename
        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsPath, fileName);

        // Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await dto.File.CopyToAsync(stream);
        }

        var galleryItem = new GalleryItem
        {
            Title = dto.Title,
            Description = dto.Description,
            Type = type,
            FilePath = $"/uploads/gallery/{fileName}",
            ThumbnailPath = type == "Image" ? $"/uploads/gallery/{fileName}" : null,
            UploadedAt = DateTime.UtcNow
        };

        _context.GalleryItems.Add(galleryItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGalleryItem), new { id = galleryItem.GalleryItemId }, galleryItem);
    }

    // PUT: api/gallery/5
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGalleryItem(int id, [FromBody] UpdateGalleryItemDto dto)
    {
        var item = await _context.GalleryItems.FindAsync(id);

        if (item == null)
        {
            return NotFound(new { message = "Gallery item not found" });
        }

        item.Title = dto.Title;
        item.Description = dto.Description;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Gallery item updated successfully", item });
    }

    // DELETE: api/gallery/5
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGalleryItem(int id)
    {
        var item = await _context.GalleryItems.FindAsync(id);

        if (item == null)
        {
            return NotFound(new { message = "Gallery item not found" });
        }

        // Delete physical file
        if (!string.IsNullOrEmpty(item.FilePath))
        {
            var fullPath = Path.Combine(_environment.ContentRootPath, item.FilePath.TrimStart('/'));
            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
            }
        }

        _context.GalleryItems.Remove(item);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Gallery item deleted successfully" });
    }

    // GET: api/gallery/types
    [HttpGet("types")]
    public ActionResult<IEnumerable<string>> GetGalleryTypes()
    {
        return Ok(new[] { "Image", "Video", "Document" });
    }
}

public class CreateGalleryItemDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public IFormFile File { get; set; } = null!;
}

public class UpdateGalleryItemDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
}

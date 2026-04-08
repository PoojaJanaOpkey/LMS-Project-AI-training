using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Course
    {
        public int CourseId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string Level { get; set; } = string.Empty; // Beginner, Intermediate, Advanced
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        public int Duration { get; set; } // in hours
        
        [StringLength(500)]
        public string? ImageUrl { get; set; }
        
        [Required]
        [StringLength(100)]
        public string InstructorName { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public ICollection<Module> Modules { get; set; } = new List<Module>();
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
    
    public class Module
    {
        public int ModuleId { get; set; }
        public int CourseId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        public int OrderIndex { get; set; }
        
        // Navigation properties
        public Course Course { get; set; } = null!;
        public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    }
    
    public class Lesson
    {
        public int LessonId { get; set; }
        public int ModuleId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        public string? Content { get; set; }
        public string? VideoUrl { get; set; }
        public int Duration { get; set; } // in minutes
        public int OrderIndex { get; set; }
        
        // Navigation properties
        public Module Module { get; set; } = null!;
    }
}

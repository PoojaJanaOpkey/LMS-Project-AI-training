using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Enrollment
    {
        public int EnrollmentId { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public int CompletionPercentage { get; set; } // 0-100
        public string Status { get; set; } = "Active"; // Active, Completed, Dropped
        public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;
        public DateTime? LastAccessedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        
        // Navigation properties
        [ForeignKey("StudentId")]
        public User Student { get; set; } = null!;
        public Course Course { get; set; } = null!;
    }
    
    public class Rating
    {
        public int RatingId { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public int RatingValue { get; set; } // 1-5
        public string? Review { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        [ForeignKey("StudentId")]
        public User Student { get; set; } = null!;
        public Course Course { get; set; } = null!;
    }
    
    public class Payment
    {
        public int PaymentId { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        
        public string PaymentMethod { get; set; } = string.Empty; // Stripe, PayPal
        public string Status { get; set; } = "Pending"; // Pending, Completed, Failed, Refunded
        public string? TransactionId { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        [ForeignKey("StudentId")]
        public User Student { get; set; } = null!;
        public Course Course { get; set; } = null!;
    }
    
    public class GalleryItem
    {
        public int GalleryItemId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Type { get; set; } = string.Empty; // Image, Video, Document
        
        [Required]
        [StringLength(500)]
        public string FilePath { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? ThumbnailPath { get; set; }
        
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}

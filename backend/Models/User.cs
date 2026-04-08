using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        public int UserId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string Role { get; set; } = "Student"; // Student or Admin
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}

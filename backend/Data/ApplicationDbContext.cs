using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<GalleryItem> GalleryItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Course configuration
            modelBuilder.Entity<Course>()
                .Property(c => c.Price)
                .HasPrecision(18, 2);

            // Enrollment configuration
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Student)
                .WithMany(u => u.Enrollments)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(e => e.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Rating configuration
            modelBuilder.Entity<Rating>()
                .HasOne(r => r.Student)
                .WithMany(u => u.Ratings)
                .HasForeignKey(r => r.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.Course)
                .WithMany(c => c.Ratings)
                .HasForeignKey(r => r.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Payment configuration
            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Student)
                .WithMany(u => u.Payments)
                .HasForeignKey(p => p.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Course)
                .WithMany(c => c.Payments)
                .HasForeignKey(p => p.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Module-Lesson relationship
            modelBuilder.Entity<Lesson>()
                .HasOne(l => l.Module)
                .WithMany(m => m.Lessons)
                .HasForeignKey(l => l.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Course-Module relationship
            modelBuilder.Entity<Module>()
                .HasOne(m => m.Course)
                .WithMany(c => c.Modules)
                .HasForeignKey(m => m.CourseId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

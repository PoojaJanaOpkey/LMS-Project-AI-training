import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  stats = {
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    activeStudents: 0,
    completionRate: 0
  };
  
  recentEnrollments: any[] = [];
  topCourses: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.stats = {
        totalStudents: 1250,
        totalCourses: 45,
        totalEnrollments: 3200,
        totalRevenue: 89500,
        activeStudents: 890,
        completionRate: 68
      };
      
      this.recentEnrollments = [
        { studentName: 'Alice Johnson', courseName: 'Full Stack Web Development', enrolledAt: new Date(), amount: 99.99 },
        { studentName: 'Bob Smith', courseName: 'UI/UX Design', enrolledAt: new Date(), amount: 79.99 },
        { studentName: 'Carol White', courseName: 'Data Science', enrolledAt: new Date(), amount: 119.99 },
        { studentName: 'David Brown', courseName: 'Digital Marketing', enrolledAt: new Date(), amount: 89.99 },
        { studentName: 'Emily Davis', courseName: 'Business Strategy', enrolledAt: new Date(), amount: 69.99 }
      ];
      
      this.topCourses = [
        { name: 'Full Stack Web Development', enrollments: 450, revenue: 44955, rating: 4.8 },
        { name: 'Data Science with Python', enrollments: 380, revenue: 45580, rating: 4.9 },
        { name: 'UI/UX Design Mastery', enrollments: 320, revenue: 25596, rating: 4.9 },
        { name: 'Digital Marketing', enrollments: 280, revenue: 25197, rating: 4.7 },
        { name: 'Mobile App Development', enrollments: 250, revenue: 23747, rating: 4.8 }
      ];
      
      this.loading = false;
    }, 500);
  }
}

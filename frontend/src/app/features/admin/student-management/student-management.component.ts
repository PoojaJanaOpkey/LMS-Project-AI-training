import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models/auth.model';

@Component({
  selector: 'app-student-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.css'
})
export class StudentManagementComponent implements OnInit {
  private adminService = inject(AdminService);

  students: any[] = [];
  filteredStudents: any[] = [];
  searchQuery = '';
  loading = true;
  selectedStudent: any = null;

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    
    // Mock data
    setTimeout(() => {
      this.students = [
        {
          id: 1,
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice@example.com',
          enrolledCourses: 3,
          completedCourses: 1,
          totalProgress: 65,
          joinedAt: new Date('2024-01-15')
        },
        {
          id: 2,
          firstName: 'Bob',
          lastName: 'Smith',
          email: 'bob@example.com',
          enrolledCourses: 2,
          completedCourses: 2,
          totalProgress: 100,
          joinedAt: new Date('2024-01-20')
        },
        {
          id: 3,
          firstName: 'Carol',
          lastName: 'White',
          email: 'carol@example.com',
          enrolledCourses: 4,
          completedCourses: 1,
          totalProgress: 45,
          joinedAt: new Date('2024-02-01')
        }
      ];
      this.filteredStudents = this.students;
      this.loading = false;
    }, 500);
  }

  searchStudents(): void {
    if (!this.searchQuery) {
      this.filteredStudents = this.students;
      return;
    }
    this.filteredStudents = this.students.filter(s =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  viewStudent(student: any): void {
    this.selectedStudent = student;
  }

  closeModal(): void {
    this.selectedStudent = null;
  }
}

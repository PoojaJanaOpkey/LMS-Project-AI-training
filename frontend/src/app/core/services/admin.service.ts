import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../models/auth.model';
import { Course, Enrollment } from '../models/course.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;

  // Statistics
  getStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`).pipe(
      catchError(this.handleError)
    );
  }

  // Student Management
  getAllStudents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/students`).pipe(
      catchError(this.handleError)
    );
  }

  getStudentById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/students/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateStudent(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/students/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/students/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Course Management
  getAllEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/enrollments`).pipe(
      catchError(this.handleError)
    );
  }

  getEnrollmentsByCourse(courseId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/courses/${courseId}/enrollments`).pipe(
      catchError(this.handleError)
    );
  }

  getStudentProgress(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/students/${studentId}/progress`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Admin service error:', error);
    return throwError(() => error);
  }
}

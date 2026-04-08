import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Enrollment, CourseProgress } from '../models/course.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/enrollments`;

  enrollInCourse(courseId: number): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.apiUrl, { courseId }).pipe(
      catchError(this.handleError)
    );
  }

  getMyEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/my`).pipe(
      catchError(this.handleError)
    );
  }

  getCourseProgress(courseId: number): Observable<CourseProgress> {
    return this.http.get<CourseProgress>(`${this.apiUrl}/${courseId}/progress`).pipe(
      catchError(this.handleError)
    );
  }

  updateProgress(courseId: number, lessonId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${courseId}/progress`, { lessonId }).pipe(
      catchError(this.handleError)
    );
  }

  unenrollFromCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courseId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Enrollment service error:', error);
    return throwError(() => error);
  }
}

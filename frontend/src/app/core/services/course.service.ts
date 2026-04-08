import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Course, Module, Lesson } from '../models/course.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/courses`;

  getAllCourses(filters?: any): Observable<Course[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    
    return this.http.get<Course[]>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course).pipe(
      catchError(this.handleError)
    );
  }

  updateCourse(id: number, course: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course).pipe(
      catchError(this.handleError)
    );
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getModulesByCourse(courseId: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.apiUrl}/${courseId}/modules`).pipe(
      catchError(this.handleError)
    );
  }

  getLessonsByModule(courseId: number, moduleId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/${courseId}/modules/${moduleId}/lessons`).pipe(
      catchError(this.handleError)
    );
  }

  searchCourses(query: string): Observable<Course[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Course[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Course service error:', error);
    return throwError(() => error);
  }
}

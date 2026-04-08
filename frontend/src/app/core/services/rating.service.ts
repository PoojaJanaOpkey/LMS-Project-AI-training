import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Rating } from '../models/common.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ratings`;

  getRatingsByCourse(courseId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/course/${courseId}`).pipe(
      catchError(this.handleError)
    );
  }

  addRating(rating: Partial<Rating>): Observable<Rating> {
    return this.http.post<Rating>(this.apiUrl, rating).pipe(
      catchError(this.handleError)
    );
  }

  updateRating(id: number, rating: Partial<Rating>): Observable<Rating> {
    return this.http.put<Rating>(`${this.apiUrl}/${id}`, rating).pipe(
      catchError(this.handleError)
    );
  }

  deleteRating(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Rating service error:', error);
    return throwError(() => error);
  }
}

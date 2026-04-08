import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { GalleryItem } from '../models/common.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/gallery`;

  getAllItems(): Observable<GalleryItem[]> {
    return this.http.get<GalleryItem[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getItemById(id: number): Observable<GalleryItem> {
    return this.http.get<GalleryItem>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  uploadItem(formData: FormData): Observable<GalleryItem> {
    return this.http.post<GalleryItem>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Gallery service error:', error);
    return throwError(() => error);
  }
}

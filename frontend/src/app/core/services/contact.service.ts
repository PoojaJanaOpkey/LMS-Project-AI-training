import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ContactFormData } from '../models/common.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/contact`;

  submitContactForm(data: ContactFormData): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Contact service error:', error);
    return throwError(() => error);
  }
}

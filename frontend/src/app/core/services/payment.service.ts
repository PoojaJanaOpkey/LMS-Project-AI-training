import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Payment } from '../models/common.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  createPayment(courseId: number, amount: number): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, { courseId, amount }).pipe(
      catchError(this.handleError)
    );
  }

  getPaymentHistory(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/history`).pipe(
      catchError(this.handleError)
    );
  }

  verifyPayment(transactionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, { transactionId }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Payment service error:', error);
    return throwError(() => error);
  }
}

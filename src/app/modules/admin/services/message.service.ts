import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { TokenStorageService } from '../../auth/services/tokenStorage.service';
import { environment } from '../../../../environments/environment';
import { Mensaje, MessageReq, MessagesRes } from '../interfaces';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);
  private apiUrl = environment.apiUrl;
  public authToken: string | null;

  readonly isLoading = signal<boolean>(false);
  readonly messages = signal<Mensaje[]>([]);

  constructor() {
    this.authToken = this.tokenStorage.getToken();
  }

  createMessage(message: string, images: string[], sendOn: Date): Observable<Mensaje> {
    const registerData: MessageReq = {
      message,
      images,
      sendOn
    };

    return this.http.post<Mensaje>(`${this.apiUrl}messages`, registerData, {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    })
      .pipe(
        tap(response => {
          this.messages.set([...this.messages(), response]);
        }),
        catchError(error => {
          return throwError(() => ({
            error: error.error
          }));
        })
      );
  }

  getAllMessages(): Observable<Mensaje[]> {

    this.isLoading.set(true);

    return this.http.get<Mensaje[]>(`${this.apiUrl}messages`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    })
      .pipe(
        tap(response => {
          this.messages.set(response);
        }),
        catchError(error => {
          return throwError(() => ({
            error: error.error
          }))
        }),
        tap(() => this.isLoading.set(false))
      );
  }
}

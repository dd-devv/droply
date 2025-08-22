import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { TokenStorageService } from '../../auth/services/tokenStorage.service';
import { environment } from '../../../../environments/environment';
import { DataRegs, RegUsers, RegUsersReq, UserByAdmin } from '../interfaces';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);
  private apiUrl = environment.apiUrl;
  public authToken: string | null;

  readonly isLoading = signal<boolean>(false);
  readonly UsersRegGraph = signal<DataRegs[]>([]);
  readonly UsersByADmin = signal<UserByAdmin[]>([]);

  constructor() {
    this.authToken = this.tokenStorage.getToken();
  }

  getUsersGraph(startDate: Date, endDate: Date): Observable<RegUsers> {
    const registerData: RegUsersReq = {
      startDate,
      endDate
    };

    return this.http.post<RegUsers>(`${this.apiUrl}users/regs-by-date`, registerData, {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    })
      .pipe(
        tap(response => {
          this.UsersRegGraph.set(response.data);
        }),
        catchError(error => {
          return throwError(() => ({
            error: error.error
          }));
        })
      );
  }

  getAllUsers(): Observable<UserByAdmin[]> {

    this.isLoading.set(true);

    return this.http.get<UserByAdmin[]>(`${this.apiUrl}users/all`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    })
      .pipe(
        tap(response => {
          this.UsersByADmin.set(response);
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

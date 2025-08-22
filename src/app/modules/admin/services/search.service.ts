import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { TokenStorageService } from '../../auth/services/tokenStorage.service';
import { environment } from '../../../../environments/environment';
import { SearchAdminReq, SearchesRes } from '../interfaces';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);
  private apiUrl = environment.apiUrl;
  public authToken: string | null;

  readonly isLoading = signal<boolean>(false);
  readonly SearchesGraph = signal<any[]>([]);
  readonly SearchesByADmin = signal<SearchesRes[]>([]);

  constructor() {
    this.authToken = this.tokenStorage.getToken();
  }

  getSearchesGraph(startDate: Date, endDate: Date): Observable<any> {
    const registerData: SearchAdminReq = {
      startDate,
      endDate
    };

    return this.http.post<any>(`${this.apiUrl}search/by-date`, registerData, {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    })
      .pipe(
        tap(response => {
          this.SearchesGraph.set(response.data);
        }),
        catchError(error => {
          return throwError(() => ({
            error: error.error
          }));
        })
      );
  }

  getAllSearches(): Observable<SearchesRes[]> {

    this.isLoading.set(true);

    return this.http.get<SearchesRes[]>(`${this.apiUrl}search`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    })
      .pipe(
        tap(response => {
          this.SearchesByADmin.set(response);
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

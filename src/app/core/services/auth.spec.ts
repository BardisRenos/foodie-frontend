import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  fullName: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) {}

  loginUser(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/user`, request).pipe(
      tap(response => this.saveSession(response))
    );
  }

  loginFarmer(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/farmer`, request).pipe(
      tap(response => this.saveSession(response))
    );
  }

  logout(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.clearSession())
    );
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem('foodie_token', response.token);
    localStorage.setItem('foodie_user', JSON.stringify({
      id: response.id,
      fullName: response.fullName,
      role: response.role
    }));
  }

  private clearSession(): void {
    localStorage.removeItem('foodie_token');
    localStorage.removeItem('foodie_user');
  }

  getToken(): string | null {
    return localStorage.getItem('foodie_token');
  }

  getUser(): any {
    const user = localStorage.getItem('foodie_user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return this.getUser()?.role ?? null;
  }
}
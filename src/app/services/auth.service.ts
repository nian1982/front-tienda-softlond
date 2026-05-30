import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private baseUrl = 'http://localhost:8081';

  user = signal<{ username: string; role: string } | null>(null);

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem(this.userKey);
    if (stored) {
      this.user.set(JSON.parse(stored));
    }
  }

  login(username: string, password: string): Observable<boolean> {
    const token = btoa(`${username}:${password}`);
    return this.http.get<ApiResponse<{ username: string; roles: string[] }>>(
      `${this.baseUrl}/auth/me`,
      { headers: { Authorization: `Basic ${token}` } }
    ).pipe(
      map(res => {
        if (!res.success) { return false; }
        const role = (res.data.roles[0] || 'ROLE_USER').replace('ROLE_', '');
        localStorage.setItem(this.tokenKey, token);
        const user = { username: res.data.username, role };
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.user.set(user);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.user.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  isAdmin(): boolean {
    return this.user()?.role === 'ADMIN';
  }
}

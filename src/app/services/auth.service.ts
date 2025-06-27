import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usernameSubject = new BehaviorSubject<string | null>(null);
  public username$ = this.usernameSubject.asObservable();

  public isLoggedIn = false;

  constructor() {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const storedUsername = this.loadStoredUsername();
        this.usernameSubject.next(storedUsername);
      }, 0);
    }
  }

  private loadStoredUsername(): string | null {
    if (typeof window !== 'undefined' && localStorage.getItem('loggedInUsername')) {
      return localStorage.getItem('loggedInUsername');
    }
    return null;
  }

  registerUser(username: string, email: string, password: string): boolean {
    if (typeof window === 'undefined') return false;

    let users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some((user: any) => user.email === email || user.username === username)) {
      return false;
    }

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  login(email: string, password: string): boolean {
    if (typeof window === 'undefined') return false;

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('loggedInUser', email);
      localStorage.setItem('loggedInUsername', user.username);

      this.usernameSubject.next(user.username);
      this.isLoggedIn = true;
      return true;
    }
    return false;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('loggedInUsername');
    }

    this.usernameSubject.next(null);
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem('token') !== null;
  }
}

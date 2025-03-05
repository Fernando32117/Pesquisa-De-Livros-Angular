import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private usernameSubject = new BehaviorSubject<string | null>(null);
  public username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUsername();
  }

  private loadStoredUsername(): string | null {
    if (typeof window === 'undefined') return null; // Garante que está rodando no navegador
  
    return localStorage.getItem('loggedInUsername') || null;
  }
  

  registerUser(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password }, { observe: 'response' })
      .pipe(
        tap(response => console.log('Resposta da API:', response))
      );
  }
  

  login(email: string, password: string): Observable<{ token: string; username: string }> {
    return this.http.post<{ token: string; username: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('loggedInUsername', response.username);
        this.usernameSubject.next(response.username);
      })
    );
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }
  
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}




















////////////////////////////////////////////////////////////////////////////////////////

// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private usernameSubject = new BehaviorSubject<string | null>(null);
//   public username$ = this.usernameSubject.asObservable();

//   public isLoggedIn = false;

//   constructor() {
//     if (typeof window !== 'undefined') {
//       setTimeout(() => {
//         const storedUsername = this.loadStoredUsername();
//         this.usernameSubject.next(storedUsername);
//       }, 0);
//     }
//   }

//   private loadStoredUsername(): string | null {
//     if (typeof window !== 'undefined' && localStorage.getItem('loggedInUsername')) {
//       return localStorage.getItem('loggedInUsername');
//     }
//     return null;
//   }

//   registerUser(username: string, email: string, password: string): boolean {
//     if (typeof window === 'undefined') return false;

//     let users = JSON.parse(localStorage.getItem('users') || '[]');

//     if (users.some((user: any) => user.email === email || user.username === username)) {
//       return false;
//     }

//     users.push({ username, email, password });
//     localStorage.setItem('users', JSON.stringify(users));
//     return true;
//   }

//   login(email: string, password: string): boolean {
//     if (typeof window === 'undefined') return false;

//     let users = JSON.parse(localStorage.getItem('users') || '[]');
//     const user = users.find((u: any) => u.email === email && u.password === password);

//     if (user) {
//       localStorage.setItem('token', 'fake-jwt-token');
//       localStorage.setItem('loggedInUser', email);
//       localStorage.setItem('loggedInUsername', user.username);

//       this.usernameSubject.next(user.username);
//       this.isLoggedIn = true;
//       return true;
//     }
//     return false;
//   }

//   logout(): void {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('token');
//       localStorage.removeItem('loggedInUser');
//       localStorage.removeItem('loggedInUsername');
//     }

//     this.usernameSubject.next(null);
//     this.isLoggedIn = false;
//   }

//   isAuthenticated(): boolean {
//     return typeof window !== 'undefined' && localStorage.getItem('token') !== null;
//   }
// }

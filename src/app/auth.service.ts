import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn = false;

  // Registrar um novo usuário
  registerUser(username: string, email: string, password: string): boolean {
    if (typeof window !== 'undefined') {
      let users = JSON.parse(localStorage.getItem('users') || '[]');

      // Verifica se o usuário ou e-mail já existem
      if (users.some((user: any) => user.email === email || user.username === username)) {
        return false; // Usuário já existe
      }

      users.push({ username, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      return true; // Registro bem-sucedido
    }
    return false;
  }

  // Login do usuário
  login(email: string, password: string): boolean {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('loggedInUser', email); // Salva usuário logado
      localStorage.setItem('loggedInUsername', user.username); // Salva nome do usuário logado
      this.isLoggedIn = true;
      return true;
    }
    return false;
  }

  getUser(): any {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('currentUser') || '{}');
    }
    return null;
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
  }

  isAuthenticated(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem('token') !== null;
  }
}

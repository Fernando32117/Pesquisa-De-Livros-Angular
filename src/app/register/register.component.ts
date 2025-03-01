import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  showSuccessModal: boolean = false;

  constructor(private router: Router) {}


  register(): void {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Todos os campos são obrigatórios!';
      return;
    }
  
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem!';
      return;
    }
  
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((user: any) => user.email === this.email || user.username === this.username)) {
      this.errorMessage = 'Usuário ou e-mail já cadastrados!';
      return;
    }
  
    users.push({ username: this.username, email: this.email, password: this.password });
    localStorage.setItem('users', JSON.stringify(users));
  
    this.showSuccessModal = true;
  }
  
  closeModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }
  

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

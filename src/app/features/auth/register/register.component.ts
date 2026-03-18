import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  showSuccessModal = false;
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  async register(): Promise<void> {
    if (
      !this.username ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'Todos os campos são obrigatórios!';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const result = await this.authService.registerUser(
      this.username,
      this.email,
      this.password,
    );

    this.isLoading = false;

    if (result.success) {
      if (result.sessionCreated) {
        // Supabase fez login automático (sem confirmação de e-mail)
        this.router.navigate(['/book-search']);
      } else {
        // Confirmação de e-mail ativa — pedir para o usuário confirmar
        this.showSuccessModal = true;
      }
    } else {
      this.errorMessage = result.error ?? 'Erro ao cadastrar usuário.';
    }
  }

  closeModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

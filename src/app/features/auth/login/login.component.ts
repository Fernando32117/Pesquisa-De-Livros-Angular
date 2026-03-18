import { AuthService } from '../../../core/services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async login(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    const result = await this.authService.login(this.username, this.password);

    this.isLoading = false;

    if (result.success) {
      this.router.navigate(['/book-search']);
    } else {
      this.errorMessage = result.error ?? 'Credenciais inválidas!';
    }
  }

  goToRegister(): void {
    this.router.navigate(['./register']);
  }
}

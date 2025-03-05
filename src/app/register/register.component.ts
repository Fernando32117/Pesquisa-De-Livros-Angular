import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

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

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Todos os campos são obrigatórios!';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem!';
      return;
    }

    this.authService.registerUser(this.username, this.email, this.password).subscribe({
      next: () => {
        this.showSuccessModal = true;
      },
      error: (err) => {
        console.error("Erro ao registrar:", err);
        this.errorMessage = 'Erro ao registrar usuário. Tente novamente.';
      }
    });
  }

  closeModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}











////////////////////////////////////////////////////////////////////

// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css'],
//   standalone: true,
//   imports: [CommonModule, FormsModule]
// })
// export class RegisterComponent {
//   username = '';
//   email = '';
//   password = '';
//   confirmPassword = '';
//   errorMessage = '';
//   showSuccessModal: boolean = false;

//   constructor(private router: Router) {}

//   register(): void {
//     if (!this.username || !this.email || !this.password || !this.confirmPassword) {
//       this.errorMessage = 'Todos os campos são obrigatórios!';
//       return;
//     }
  
//     if (this.password !== this.confirmPassword) {
//       this.errorMessage = 'As senhas não coincidem!';
//       return;
//     }
  
//     let users = JSON.parse(localStorage.getItem('users') || '[]');
  
//     if (users.some((user: any) => user.email === this.email || user.username === this.username)) {
//       this.errorMessage = 'Usuário ou e-mail já cadastrados!';
//       return;
//     }
  
//     // Formatando o nome: todas as palavras começam com maiúscula
//     const formattedName = this.username
//       .split(' ')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//       .join(' ');
  
//     // Pegando apenas o primeiro nome
//     const firstName = formattedName.split(' ')[0];
  
//     users.push({ username: firstName, email: this.email, password: this.password });
//     localStorage.setItem('users', JSON.stringify(users));
  
//     this.showSuccessModal = true;
//   }

  
//   closeModal(): void {
//     this.showSuccessModal = false;
//     this.router.navigate(['/login']);
//   }
  

//   goToLogin(): void {
//     this.router.navigate(['/login']);
//   }
// }

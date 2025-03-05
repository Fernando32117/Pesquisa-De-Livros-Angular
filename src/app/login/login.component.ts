import { AuthService } from '../auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        console.log("Login bem-sucedido! Redirecionando...");
        this.router.navigate(['/book-search']);
      },
      error: (err) => {
        console.error("Erro no login:", err);
        this.errorMessage = 'Credenciais inválidas!';
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}









////////////////////////////////////////////////////////////////

// import { AuthService } from '../auth.service';
// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
//   imports: [CommonModule, FormsModule],
// })
// export class LoginComponent {
//   username = '';
//   password = '';
//   errorMessage = '';

//   constructor(private authService: AuthService, private router: Router) {}

//   login(): void {
//     console.log("Tentando logar com:", this.username, this.password);
  
//     if (this.authService.login(this.username, this.password)) {
//       console.log("Login bem-sucedido! Redirecionando...");
//       this.router.navigate(['/book-search']);
//     } else {
//       console.log("Falha no login.");
//       this.errorMessage = 'Credenciais inválidas!';
//     }
//   }  

//   goToRegister() {
//     console.log("Tentando ir para tela de registro");
//     this.router.navigate(['./register']);
//   }
  
  
// }

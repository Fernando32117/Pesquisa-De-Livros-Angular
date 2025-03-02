import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  imports: [CommonModule]
})
export class NavigationComponent {
  dropdownOpen = false;
  username: string | null = null; // Armazena o nome do usuário logado

  constructor(private authService: AuthService, private router: Router) {
    this.loadUsername(); // Carrega o nome do usuário ao iniciar o componente
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
    this.username = null; // Limpa o nome do usuário ao deslogar
    this.router.navigate(['/login']); // Redireciona após logout
  }

  goBook() {
    this.router.navigate(['/book-search']);
  }

  goFavorite() {
    this.router.navigate(['/favorites']);
  }

  private loadUsername() {
    if (typeof localStorage !== 'undefined') {
      const fullName = localStorage.getItem('loggedInUsername');
      if (fullName) {
        const firstName = fullName.split(' ')[0]; // Pegando o primeiro nome
        this.username = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(); // Formatando com a primeira letra maiúscula
      } else {
        this.username = null;
      }
    }
  }  
  
  
}

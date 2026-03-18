import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  imports: [CommonModule],
})
export class NavigationComponent implements OnInit, OnDestroy {
  dropdownOpen = false;
  username: string | null = null;
  private usernameSubscription!: Subscription; // Para limpar a inscrição ao destruir o componente

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.usernameSubscription = this.authService.username$.subscribe((name) => {
      this.username = name ? this.formatName(name) : null;
    });
  }

  ngOnDestroy() {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  goBook() {
    this.router.navigate(['/book-search']);
  }

  goFavorite() {
    this.router.navigate(['/favorites']);
  }

  private formatName(name: string): string {
    const firstName = name.split(' ')[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  }
}

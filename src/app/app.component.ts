import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <app-navigation></app-navigation>
    <router-outlet></router-outlet>
  `,
  imports: [CommonModule, NavigationComponent, RouterModule]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}

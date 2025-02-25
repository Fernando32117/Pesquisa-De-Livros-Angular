
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';

@Component({
  selector: 'app-root',
  template: `
    <app-navigation></app-navigation>
    <router-outlet></router-outlet>
  `,
  standalone: true,
  imports: [CommonModule, NavigationComponent, RouterModule]
})
export class AppComponent {
  title(_title: any) {
    throw new Error('Method not implemented.');
  }
}


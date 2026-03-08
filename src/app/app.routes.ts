import { Routes } from '@angular/router';
import { BookSearchComponent } from './features/books/book-search/book-search.component';
import { BookFavoritesComponent } from './features/books/book-favorites/book-favorites.component';
import { AboutComponent } from './features/about/about.component';
import { LoginComponent } from './features/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
  { path: 'book-search', component: BookSearchComponent },
  { path: 'favorites', component: BookFavoritesComponent, canActivate: [AuthGuard] }, // Protegido
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: 'book-search', pathMatch: 'full' },
];

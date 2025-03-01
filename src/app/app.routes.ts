import { Routes } from '@angular/router';
import { BookSearchComponent } from './book-search/book-search.component';
import { BookFavoritesComponent } from './book-favorites/book-favorites.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: 'book-search', component: BookSearchComponent },
  { path: 'favorites', component: BookFavoritesComponent, canActivate: [AuthGuard] }, // Protegido
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: 'book-search', pathMatch: 'full' },
];

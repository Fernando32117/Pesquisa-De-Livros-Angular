import { Routes } from '@angular/router';
import { BookSearchComponent } from './book-search/book-search.component';
import { BookFavoritesComponent } from './book-favorites/book-favorites.component';
import { AboutComponent } from './about/about.component';
import { NavigationComponent } from './navigation/navigation.component';

export const routes: Routes = [
  { path: '', component: BookSearchComponent },
  { path: 'favorites', component: BookFavoritesComponent },
  { path: 'about', component: AboutComponent },
  { path: 'navigation', component: NavigationComponent }
];

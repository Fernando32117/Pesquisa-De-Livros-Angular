import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookStorageService {
  private favoritesSubject = new BehaviorSubject<any[]>(this.loadFavorites());
  favorites$ = this.favoritesSubject.asObservable();
  private favorites: any[] = this.loadFavorites();
  notificationMessage: string | null = null;
  // 🔹 Criando um BehaviorSubject para notificações
  private notificationSubject = new BehaviorSubject<string | null>(null);
  notification$ = this.notificationSubject.asObservable();

  private getLoggedInUser(): string | null {
    return localStorage.getItem('loggedInUser'); // Obtém o usuário logado
  }

  private getUserFavoritesKey(): string {
    const user = this.getLoggedInUser();
    return user ? `favorites_${user}` : 'favorites_guest';
  }

  getFavorites(): any[] {
    return this.favorites;
  }

  addFavorite(updatedBook: any): void {
    if (!this.isFavorite(updatedBook.id)) {
      this.favorites = [...this.favorites, updatedBook];
      this.saveFavorites();
      this.favoritesSubject.next(this.favorites);
      this.showNotification('Livro favoritado com sucesso!');
    }
  }

  updateFavorite(updatedBook: any): void {
    this.favorites = this.favorites.map((book) =>
      book.id === updatedBook.id ? updatedBook : book
    );
    this.saveFavorites();
    this.favoritesSubject.next(this.favorites);
    this.showNotification('Livro editado com sucesso!');
  }

  removeFavorite(bookId: string): void {
    this.favorites = this.favorites.filter((book) => book.id !== bookId);
    this.saveFavorites();
    this.favoritesSubject.next(this.favorites);
    this.showNotification('Livro removido dos favoritos com sucesso!');
  }

  private showNotification(message: string): void {
    console.log('🔔 Exibindo notificação:', message); // Debug no console
    this.notificationSubject.next(message); // Atualiza a notificação

    setTimeout(() => {
      this.notificationSubject.next(null); // Apaga depois de 3s
    }, 3000);
  }

  isFavorite(bookId: string): boolean {
    return this.favorites.some((book) => book.id === bookId);
  }

  private saveFavorites(): void {
    const key = this.getUserFavoritesKey();
    localStorage.setItem(key, JSON.stringify(this.favorites));
    this.showNotification('Livro favoritado com sucesso!');
  }

  private loadFavorites(): any[] {
    const key = this.getUserFavoritesKey();
    const favorites = localStorage.getItem(key);
    return favorites ? JSON.parse(favorites) : [];
  }
}

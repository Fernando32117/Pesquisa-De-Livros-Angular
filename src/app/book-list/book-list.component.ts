import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookStorageService } from '../book-storage.service';
import { AuthService } from '../auth.service'; // Importa o AuthService
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  imports: [CommonModule, FormsModule],
})
export class BookListComponent {
  @Input() books: any[] = [];
  selectedBook: any = null;
  notificationMessage: string | null = null;
  showLoginModal: boolean = false;

  constructor(
    private bookStorage: BookStorageService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  openModal(book: any): void {
    const favorite = this.bookStorage
      .getFavorites()
      .find((fav) => fav.id === book.id);
    this.selectedBook = favorite
      ? { ...book, ...favorite }
      : { ...book, notes: '', rating: 0, tags: [] };
  }

  closeModal(): void {
    this.selectedBook = null;
  }

  toggleFavorite(book: any): void {
    if (!this.authService.isAuthenticated()) {
      console.log("Usuário não está logado! Exibindo modal...");
      this.showLoginModal = true;
      return;
    }
  
    if (this.bookStorage.isFavorite(book.id)) {
      this.bookStorage.removeFavorite(book.id);
      console.log("Livro removido dos favoritos.");
      this.showNotification("Livro removido dos favoritos.");
    } else {
      this.bookStorage.addFavorite(book);
      console.log("Livro adicionado aos favoritos.");
      this.showNotification("Livro adicionado aos favoritos.");
    }
  }
  

  saveFavorite(book: any): void {
    if (!this.authService.isAuthenticated()) {
      console.log('Usuário não está logado! Exibindo modal...');
      this.showLoginModal = true;
      return;
    }
  
    this.showNotification('Livro favoritado com sucesso!');
    this.bookStorage.addFavorite(book);
    this.closeModal();
  }
  


  updateFavorite(book: any): void {
    this.bookStorage.updateFavorite(book);
    this.showNotification('Livro atualizado com sucesso!');
    this.closeModal();
  }

  showNotification(message: string): void {
    this.notificationMessage = message;
    setTimeout(() => (this.notificationMessage = null), 4500);
  }

  isFavorite(book: any): boolean {
    return this.bookStorage.isFavorite(book.id);
  }

  navigateToLogin(): void {
    this.showLoginModal = false;
    this.router.navigate(['/login']);
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }
}

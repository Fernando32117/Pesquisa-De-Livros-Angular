import { Component } from '@angular/core';  
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';  
import { GoogleBooksService } from '../google-books.service';  
import { BookListComponent } from '../book-list/book-list.component';  
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-book-search',
    templateUrl: './book-search.component.html',
    styleUrls: ['./book-search.component.css'],
    imports: [CommonModule, FormsModule, BookListComponent]
})  
export class BookSearchComponent {  
  query: string = '';  
  books: any[] = [];  
  isLoggedIn: boolean = false;

  constructor(private booksService: GoogleBooksService, private authService: AuthService) {   
    console.log('BookSearchComponent construtor chamado');  
    this.isLoggedIn = this.authService.isAuthenticated(); // Verifica se o usuário está logado
  }  

  searchBooks(): void {  
    this.booksService.searchBooks(this.query).subscribe(response => {  
      console.log('Resposta da API:', response);  
      this.books = response;  
    }, error => {  
      console.error('Erro ao buscar livros:', error);  
    });  
  } 
  
  canFavorite(): boolean {
    return this.authService.isAuthenticated();
  }
}
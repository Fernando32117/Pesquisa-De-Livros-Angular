import { Component } from '@angular/core';  
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';  
import { GoogleBooksService } from '../google-books.service';  
import { BookListComponent } from '../book-list/book-list.component';  

@Component({  
  selector: 'app-book-search',  
  templateUrl: './book-search.component.html',  
  styleUrls: ['./book-search.component.css'],  
  standalone: true,  
  imports: [CommonModule, FormsModule, BookListComponent]  
})  
export class BookSearchComponent {  
  query: string = '';  
  books: any[] = [];  

  constructor(private booksService: GoogleBooksService) {   
    console.log('BookSearchComponent construtor chamado');  
  }  

  searchBooks(): void {  
    this.booksService.searchBooks(this.query).subscribe(response => {  
      console.log('Resposta da API:', response);  
      this.books = response;  
    }, error => {  
      console.error('Erro ao buscar livros:', error);  
    });  
  }  
}
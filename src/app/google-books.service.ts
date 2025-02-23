import { Injectable } from '@angular/core';  
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';  
import { map, filter, debounceTime } from 'rxjs/operators';  

@Injectable({  
  providedIn: 'root'  
})  
export class GoogleBooksService {  
  private apiUrl = 'https://www.googleapis.com/books/v1/volumes';  

  constructor(private http: HttpClient) { }  

  searchBooks(query: string): Observable<any> {  
    console.log('Buscando livros com a consulta:', query); // Log para verificar a consulta  
    return this.http.get<any>(`${this.apiUrl}?q=${query}`).pipe(  
      debounceTime(300),  
      map(response => {  
        console.log('Resposta da API recebida:', response); // Log para resposta da API  
        return response.items || [];  
      }),  
      filter(items => items.length > 0)  
    );  
  }  
}
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites-empty-state',
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites-empty-state.component.html',
  styleUrls: ['./favorites-empty-state.component.css'],
})
export class FavoritesEmptyStateComponent {
  @Input() filter = '';

  get title(): string {
    return this.filter ? 'Nenhum favorito encontrado' : 'Sua lista esta vazia';
  }

  get subtitle(): string {
    return this.filter
      ? 'Tente buscar com outras palavras-chave'
      : 'Comece a adicionar seus livros favoritos!';
  }
}

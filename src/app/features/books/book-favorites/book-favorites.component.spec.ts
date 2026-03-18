import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BookFavoritesComponent } from './book-favorites.component';
import { BookStorageService } from '../../../core/services/book-storage.service';
import { Book } from '../../../models/book.model';

describe('BookFavoritesComponent', () => {
  let component: BookFavoritesComponent;
  let fixture: ComponentFixture<BookFavoritesComponent>;
  let bookStorageService: BookStorageService;

  const createBook = (
    id: string,
    title: string,
    tags: string[] = [],
  ): Book => ({
    id,
    title,
    authors: ['Test Author'],
    notes: '',
    rating: 0,
    tags,
  });

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [BookFavoritesComponent, FormsModule, BrowserAnimationsModule],
      providers: [BookStorageService],
    }).compileComponents();

    fixture = TestBed.createComponent(BookFavoritesComponent);
    component = fixture.componentInstance;
    bookStorageService = TestBed.inject(BookStorageService);
    fixture.detectChanges();
  });

  it('deveria criar', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir livros favoritos', () => {
    const book = createBook('1', 'Test Book', ['tag1']);
    bookStorageService.addFavorite(book);

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.filteredFavorites).toContain(
      jasmine.objectContaining({ id: '1' }),
    );
  });

  it('deve filtrar livros por tag ou titulo', () => {
    const book1 = createBook('1', 'Test Book 1', ['tag1']);
    const book2 = createBook('2', 'Another Book', ['tag2']);

    bookStorageService.addFavorite(book1);
    bookStorageService.addFavorite(book2);

    component.ngOnInit();
    fixture.detectChanges();

    component.filter = 'Test';
    component.applyFilter();
    fixture.detectChanges();
    expect(component.filteredFavorites).toContain(
      jasmine.objectContaining({ id: '1' }),
    );
    expect(component.filteredFavorites).not.toContain(
      jasmine.objectContaining({ id: '2' }),
    );

    component.filter = 'tag2';
    component.applyFilter();
    fixture.detectChanges();
    expect(component.filteredFavorites).toContain(
      jasmine.objectContaining({ id: '2' }),
    );
    expect(component.filteredFavorites).not.toContain(
      jasmine.objectContaining({ id: '1' }),
    );
  });

  it('deve abrir e fechar o modal', () => {
    const book = createBook('1', 'Test Book', ['tag1']);

    component.openModal(book);
    expect(component.selectedBook).toEqual(
      jasmine.objectContaining({ id: '1', title: 'Test Book' }),
    );

    component.closeModal();
    expect(component.selectedBook).toBeNull();
  });

  it('deveria remover um livro dos favoritos', () => {
    const book = createBook('1', 'Test Book');
    bookStorageService.addFavorite(book);

    component.ngOnInit();
    fixture.detectChanges();

    component.removeFavorite(book.id);
    fixture.detectChanges();

    expect(component.filteredFavorites).not.toContain(
      jasmine.objectContaining({ id: '1' }),
    );
  });
});

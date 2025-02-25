import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BookListComponent } from './book-list.component';
import { BookStorageService } from '../book-storage.service';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let bookStorageService: BookStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookListComponent ],
      imports: [ FormsModule ],
      providers: [ BookStorageService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    bookStorageService = TestBed.inject(BookStorageService);
    fixture.detectChanges();
  });

  it('deveria criar', () => {
    expect(component).toBeTruthy();
  });

  it('deve abrir o modal com o livro selecionado', () => {
    const book = { id: '1', volumeInfo: { title: 'Test Book' } };
    component.openModal(book);
    expect(component.selectedBook).toEqual(book);
  });

  it('deveria fechar o modal', () => {
    const book = { id: '1', volumeInfo: { title: 'Test Book' } };
    component.openModal(book);
    component.closeModal();
    expect(component.selectedBook).toBeNull();
  });

  it('deve alternar um livro como favorito', () => {
    const book = { id: '1', volumeInfo: { title: 'Test Book' } };
    component.toggleFavorite(book);
    expect(bookStorageService.isFavorite(book.id)).toBeTrue();
    component.toggleFavorite(book);
    expect(bookStorageService.isFavorite(book.id)).toBeFalse();
  });

  it('deveria salvar um livro como favorito', () => {
    const book = { id: '1', volumeInfo: { title: 'Test Book', tags: 'tag1,tag2' } };
    component.saveFavorite(book);
    expect(bookStorageService.getFavorites()).toContain(jasmine.objectContaining({ id: '1' }));
  });
});

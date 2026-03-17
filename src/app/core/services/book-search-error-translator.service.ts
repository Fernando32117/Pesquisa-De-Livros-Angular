import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookSearchErrorTranslatorService {
  toSearchError(error: unknown): Error {
    if (this.isRateLimited(error)) {
      return new Error(
        'A API de livros esta temporariamente limitada. Tente novamente em alguns minutos.',
      );
    }

    return new Error(
      'Nao foi possivel buscar livros agora. Verifique sua conexao e tente novamente.',
    );
  }

  toExploreError(error: unknown): Error {
    if (this.isRateLimited(error)) {
      return new Error(
        'A API de livros esta temporariamente limitada. Tente novamente em alguns minutos.',
      );
    }

    return new Error(
      'Nao foi possivel carregar sugestoes agora. Verifique sua conexao e tente novamente.',
    );
  }

  private isRateLimited(error: unknown): boolean {
    const status = (error as { status?: number } | null)?.status;
    return status === 429 || status === 403;
  }
}

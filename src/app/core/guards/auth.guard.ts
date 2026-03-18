import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean> {
    // Aguarda a inicialização do Supabase (getSession) antes de verificar o auth.
    // Sem isso, o BehaviorSubject retorna false imediatamente e bloqueia a rota.
    return this.authService.ready$.pipe(
      filter((ready) => ready),
      take(1),
      switchMap(() => this.authService.authenticated$),
      take(1),
      map((isAuth) => {
        if (!isAuth) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }),
    );
  }
}

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [AuthGuard, AuthService, provideRouter([])],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should block access when user is not authenticated', () => {
    expect(guard.canActivate()).toBeFalse();
  });

  it('should allow access when user is authenticated', () => {
    localStorage.setItem('token', 'fake-jwt-token');

    expect(guard.canActivate()).toBeTrue();
  });
});
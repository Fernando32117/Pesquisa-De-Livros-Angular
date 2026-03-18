import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usernameSubject = new BehaviorSubject<string | null>(null);
  public username$ = this.usernameSubject.asObservable();

  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  public authenticated$ = this.authenticatedSubject.asObservable();

  private userIdSubject = new BehaviorSubject<string | null>(null);
  public userId$ = this.userIdSubject.asObservable();

  // Emite true após getSession() resolver — usado pelo AuthGuard para não bloquear na inicialização
  private readySubject = new BehaviorSubject<boolean>(false);
  public ready$ = this.readySubject.asObservable();

  constructor(private supabaseService: SupabaseService) {
    if (this.supabaseService.isBrowser) {
      this.initAuthListener();
    }
  }

  private async initAuthListener(): Promise<void> {
    const supabase = this.supabaseService.client;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      await this.setUserFromSession(session.user.id);
    }
    this.readySubject.next(true);

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await this.setUserFromSession(session.user.id);
      } else {
        this.usernameSubject.next(null);
        this.authenticatedSubject.next(false);
        this.userIdSubject.next(null);
      }
    });
  }

  private async setUserFromSession(userId: string): Promise<void> {
    this.userIdSubject.next(userId);
    this.authenticatedSubject.next(true);

    const { data } = await this.supabaseService.client
      .from('user_profiles')
      .select('username')
      .eq('id', userId)
      .single();

    this.usernameSubject.next(data?.username ?? null);
  }

  async registerUser(
    username: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; sessionCreated: boolean; error?: string }> {
    const firstName = username
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
      .split(' ')[0];

    const { data, error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
      options: {
        data: { username: firstName },
      },
    });

    if (error) {
      return { success: false, sessionCreated: false, error: error.message };
    }

    // Se não há confirmação de e-mail, o Supabase retorna uma session imediatamente
    return { success: true, sessionCreated: !!data.session };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabaseService.client.auth.signInWithPassword(
      {
        email,
        password,
      },
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  async logout(): Promise<void> {
    await this.supabaseService.client.auth.signOut();
    this.usernameSubject.next(null);
    this.authenticatedSubject.next(false);
    this.userIdSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.authenticatedSubject.value;
  }

  getUserId(): string | null {
    return this.userIdSubject.value;
  }
}

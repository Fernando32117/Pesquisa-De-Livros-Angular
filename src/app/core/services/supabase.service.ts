import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private platformId = inject(PLATFORM_ID);

  get client(): SupabaseClient {
    if (!this.supabase) {
      if (!isPlatformBrowser(this.platformId)) {
        throw new Error('Supabase client is only available in the browser');
      }
      this.supabase = createClient(
        environment.supabaseUrl,
        environment.supabaseKey,
      );
    }
    return this.supabase;
  }

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}

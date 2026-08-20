import { computed, Injectable, signal } from '@angular/core';
import { Provider } from '@core/models/media-model';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  readonly STORAGE_KEY = 'selectedProviders';

  readonly selectedProviders = signal<Provider[]>(this.loadFromStorage());
  readonly selectedProvidersIds = computed(() => this.selectedProviders().map(sp => sp.provider_id).join('|'));

  loadFromStorage(): Provider[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) as Provider[] : [];
  }

  setSelectedProviders(providers: Provider[]): void {
    this.selectedProviders.set(providers);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(providers));
  }

}

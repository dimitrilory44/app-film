import { computed, effect, Injectable, signal } from '@angular/core';
import { Genre, Provider, UserPreferences } from '@core/models/media-model';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  readonly STORAGE_KEY = 'data';

  readonly selectedData = signal<UserPreferences>(this.#loadFromStorage());

  readonly selectedProviders = computed(() => this.selectedData().selectedProviders ?? []);
  readonly selectedProvidersIds = computed(() => this.selectedProviders().map(sp => sp.provider_id).join('|'));

  readonly selectedTitlesGenre = computed(() => this.selectedData().selectedTitlesGenre ?? []);
  readonly selectedTitlesGenreIds = computed(() => this.selectedTitlesGenre().map(sp => sp.id).join('|'));

  #loadFromStorage(): UserPreferences {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    try {
      return raw ? JSON.parse(raw) as UserPreferences : {};
    } catch (error) {
      console.error(error);
      localStorage.removeItem(this.STORAGE_KEY);
      return {};
    }
  }

  setSelectedProviders(providers: Provider[]): void {
    this.selectedData.update(current => ({...current, selectedProviders: providers}));
  }

  setSelectedTitlesGenre(genres: Genre[]): void {
    this.selectedData.update(current => ({...current, selectedTitlesGenre: genres}));
  }

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.selectedData()));
    });
  }

}

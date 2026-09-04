import { computed, effect, Injectable, signal } from '@angular/core';
import { Criteria, Provider, UserPreferences } from '@core/models/media-model';
import { makeRangeHelpers, makeSelectionHelpers } from '@shared/helpers/collection.helpers';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  readonly STORAGE_KEY = 'data';
  readonly defaultReleaseDate = { startYear: 1900, endYear: new Date().getFullYear() };

  readonly selectedData = signal<UserPreferences>(this.#loadFromStorage());

  readonly selectedProviders = computed(() => this.selectedData().selectedProviders ?? []);
  readonly selectedCountProviders = computed(() => this.selectedProviders().length ?? 0);

  readonly selectedCriteria = computed(() => this.selectedData().selectedCriteria);

  readonly genreHelpers = makeSelectionHelpers('genders', this.selectedCriteria);
  readonly releaseDateHelpers = makeRangeHelpers('release', this.selectedCriteria, this.defaultReleaseDate, (a, b) => a.startYear === b.startYear && a.endYear === b.endYear);

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

  setCriteria<K extends keyof Criteria>(key: K, value: Criteria[K]) {
    this.selectedData.update(current => ({...current, selectedCriteria: { ...current.selectedCriteria, [key]: value }}))
  }

  setAllCriteria(criteria: Criteria) {
    this.selectedData.update(current => ({...current, selectedCriteria: criteria}));
  }

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.selectedData()));
    });
  }

}

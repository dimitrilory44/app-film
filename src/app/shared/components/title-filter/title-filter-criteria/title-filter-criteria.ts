import { Component, inject, linkedSignal, signal } from '@angular/core';
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { CriteriaList, Genre } from '@core/models/media-model';
import { UserPreferencesService } from '@core/services/user-preferences-service';
import { MatButtonModule } from '@angular/material/button';
import { TmdbApiService } from '@core/services/tmdb-api';

@Component({
  selector: 'title-filter-criteria',
  imports: [MatMenuModule, MatCheckbox, MatButtonModule, MatIconModule],
  templateUrl: './title-filter-criteria.html',
  styleUrl: './title-filter-criteria.scss',
})
export class TitleFilterCriteriaComponent {
  readonly #userPreferencesService = inject(UserPreferencesService);
  readonly #tmdbApiService = inject(TmdbApiService);

  readonly isOpened = signal(false);

  readonly criterias = [
    { label: 'Genres', hasOpened: false, value: this.#tmdbApiService.allGenders() },
    { label: 'Année de sortie', hasOpened: false, value: [] }
  ];

  readonly selectedGenres = linkedSignal<Genre[]>(() => this.#userPreferencesService.selectedTitlesGenre());
  readonly hasSelectedGenres = this.#userPreferencesService.hasSelectedTitlesGenre;

  onGenresMenuOpened() { this.isOpened.set(true); }

  onGenresMenuClosed() { this.isOpened.set(false); }

  isSelected(id: number): boolean {
    return this.selectedGenres().some(g => g.id === id);
  }

  toggleItem(item: Genre): void {
    const current = this.selectedGenres();
    const exists = current.some(g => g.id === item.id);
    const updated = exists
      ? current.filter(g => g.id !== item.id)
      : [...current, item];
    this.selectedGenres.set(updated.sort((a, b) => a.id - b.id));
    this.#userPreferencesService.setSelectedTitlesGenre(this.selectedGenres());
  }

  reset() {
    this.selectedGenres.set([]);
    this.#userPreferencesService.setSelectedTitlesGenre([]);
  }

}

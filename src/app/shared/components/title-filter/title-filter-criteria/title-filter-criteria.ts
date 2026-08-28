import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { Genre } from '@core/models/media-model';
import { UserPreferencesService } from '@core/services/user-preferences-service';
import { TmdbApiService } from '@core/services/tmdb-api';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'title-filter-criteria',
  imports: [MatMenuModule, MatCheckbox, MatButtonModule, MatIconModule],
  templateUrl: './title-filter-criteria.html',
  styleUrl: './title-filter-criteria.scss',
})
export class TitleFilterCriteriaComponent {
  readonly #userPreferencesService = inject(UserPreferencesService);
  readonly #tmdbApiService = inject(TmdbApiService);

  readonly selectedGenres = linkedSignal<Genre[]>(() => this.#userPreferencesService.selectedTitlesGenre());
  readonly isSelectedGenres = computed(() => this.selectedGenres().length > 0);

  readonly isOpened = signal(false);

  readonly genresMovies = this.#tmdbApiService.getGenderByMedia(signal('movie'));
  readonly genresSeries = this.#tmdbApiService.getGenderByMedia(signal('tv'));

  readonly allGenres = computed(() => {
    const moviesResults = this.genresMovies.value()?.genres ?? [];
    const seriesResults = this.genresSeries.value()?.genres ?? [];
    return Array.from(
      new Map(
        [...moviesResults, ...seriesResults].map
        (genre => [
          genre.id,
          genre
        ])
      ).values()
    );
  })

  onGenresMenuOpened() {
    this.isOpened.set(true);
  }

  onGenresMenuClosed() {
    this.isOpened.set(false);
  }

  isSelected(id: number): boolean {
    return this.selectedGenres().some(g => g.id === id);
  }

  toggleGenre(genre: Genre): void {
    const current = this.selectedGenres();
    const exists = current.some(g => g.id === genre.id);
    const updated = exists
      ? current.filter(g => g.id !== genre.id)
      : [...current, genre];
    this.selectedGenres.set(this.sortById(updated));
    this.#userPreferencesService.setSelectedTitlesGenre(this.selectedGenres());
  }

  sortById<T extends { id: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => a.id - b.id);
  }

  reset() {
    this.selectedGenres.set([]);
    this.#userPreferencesService.setSelectedTitlesGenre([]);
  }

}

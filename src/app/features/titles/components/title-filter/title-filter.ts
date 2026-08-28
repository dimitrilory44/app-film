import { Component, computed, effect, inject, input, linkedSignal, model, signal} from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';

import { Router } from '@angular/router';
import { Genre, Media } from '@core/models/media-model';
import { UserPreferencesService } from '@core/services/user-preferences-service';
import { TmdbImagePipe } from '@shared/pipes/tmdb-image.pipe';
import { ImgFallbackDirective } from '@shared/directives/img-fallback.directive';
import { TitleFilterProvidersComponent } from "@shared/components/title-filter/title-filter-providers/title-filter-providers";
import { TitleFilterCriteriaComponent } from '@shared/components/title-filter/title-filter-criteria/title-filter-criteria';

@Component({
  selector: 'title-filter',
  imports: [TmdbImagePipe, MatButtonToggleModule, DecimalPipe, MatButtonModule, MatIconModule, MatExpansionModule, MatMenuModule, ImgFallbackDirective, TitleFilterProvidersComponent, TitleFilterCriteriaComponent],
  templateUrl: './title-filter.html',
  styleUrl: './title-filter.scss',
})
export class TitleFilterComponent {
  readonly #router = inject(Router);
  readonly #userPreferencesService = inject(UserPreferencesService);
  
  readonly items = input<Media[]>([]);
  readonly count = input<number>(0);
  readonly currentMediaType = input<'all' | 'movie' | 'tv'>('movie');

  readonly selectedFilter = model<'all' | 'movie' | 'tv'>('movie');
  readonly selectedSort = signal<'popularity' | 'trending' | 'release_date'>('popularity');

  readonly sortOptions = [
    { value: 'popularity' as const, label: 'Popularité' },
    { value: 'trending' as const, label: 'Trending' },
    { value: 'release_date' as const, label: 'Année de sortie' }
  ];

  readonly isFilterCriteriaPanelExpanded = signal(false);
  readonly isFilterProviderPanelExpanded = signal(false);
  readonly isSortExpanded = signal(false);
  readonly countFilter = signal<number>(this.#userPreferencesService.selectedTitlesGenre().length);
  
  readonly selectedProviders = this.#userPreferencesService.selectedProviders;
  readonly selectedGenres = linkedSignal<Genre[]>(() => this.#userPreferencesService.selectedTitlesGenre());
  
  readonly isSelectedGenres = computed(() => this.selectedGenres().length > 0);
  readonly countFilters = computed(() => {
    const total = this.selectedGenres().length;
    return total;
  });
  readonly selectedProvidersCount = computed(() => this.selectedProviders().length);
  readonly previewProviders = computed(() => this.selectedProviders().slice(0, 5));

  constructor() {
    effect(() => {
      switch (this.currentMediaType()) {
        case 'movie': return this.selectedFilter.set('movie');
        case 'tv': return this.selectedFilter.set('tv');
        default: return this.selectedFilter.set('all');
      }
    });
  }

  getMediaTitle(value: 'all' | 'movie' | 'tv') {
    switch (value) {
      case 'movie': return this.#router.navigate(['/popular/movies']);
      case 'tv': return this.#router.navigate(['/popular/series']);
      default : return this.#router.navigate(['/popular/all']);
    }
  }

  onFilterChange(value: 'all' | 'movie' | 'tv'):void {
    this.selectedFilter.set(value);
    this.getMediaTitle(value);
  }

  selectSort(value: 'popularity' | 'trending' | 'release_date'): void {
    this.selectedSort.set(value);
  }

  sortById<T extends { id: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => a.id - b.id);
  }

  reset() {
    this.selectedGenres.set([]);
    this.#userPreferencesService.setSelectedTitlesGenre([]);
  }

}

import { Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { DecimalPipe, SlicePipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';

import { Router } from '@angular/router';
import { Media } from '@core/models/media-model';
import { UserPreferencesService } from '@core/services/user-preferences-service';
import { TmdbImagePipe } from '@shared/pipes/tmdb-image.pipe';
import { ImgFallbackDirective } from '@shared/directives/img-fallback.directive';
import { TitleFilterProvidersComponent } from "@shared/components/title-filter/title-filter-providers/title-filter-providers";
import { TitleFilterCriteriaComponent } from '@shared/components/title-filter/title-filter-criteria/title-filter-criteria';

@Component({
  selector: 'title-filter',
  imports: [TmdbImagePipe, MatButtonToggleModule, DecimalPipe, SlicePipe, MatButtonModule, MatIconModule, MatExpansionModule, MatMenuModule, ImgFallbackDirective, TitleFilterProvidersComponent, TitleFilterCriteriaComponent],
  templateUrl: './title-filter.html',
  styleUrl: './title-filter.scss',
})
export class TitleFilterComponent {
  readonly #router = inject(Router);
  readonly #userPreferencesService = inject(UserPreferencesService);
  
  readonly items = input<Media[]>([]);
  readonly countTitles = input<number>(0);
  readonly currentMediaType = input<'all' | 'movie' | 'tv'>('movie');

  readonly selectedFilter = model<'all' | 'movie' | 'tv'>('movie');
  readonly selectedSort = signal<'popularity' | 'trending' | 'release_date'>('popularity');

  readonly isFilterCriteriaPanelExpanded = signal(false);
  readonly isFilterProviderPanelExpanded = signal(false);
  readonly isSortExpanded = signal(false);
  
  readonly countProviders = this.#userPreferencesService.selectedCountProviders;
  readonly selectedProviders = this.#userPreferencesService.selectedProviders;
  
  readonly sortOptions = [
    { value: 'popularity' as const, label: 'Popularité' },
    { value: 'trending' as const, label: 'Trending' },
    { value: 'release_date' as const, label: 'Année de sortie' }
  ];

  readonly activeCountFilters = computed(() => {
    let count = 0;
    count += this.#userPreferencesService.selectedCountTitlesGenre();
    // autres : count += this.selectedYear() ? 1 : 0;
    return count;
  });

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

}

import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, input, model, signal} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';

import { Router } from '@angular/router';
import { Media, Provider } from '@core/models/media-model';
import { UserPreferencesService } from '@core/services/user-preferences-service';
import { TmdbImagePipe } from '@shared/pipes/tmdb-image.pipe';

@Component({
  selector: 'title-filter',
  imports: [ TmdbImagePipe, MatButtonToggleModule, DecimalPipe, MatButtonModule, MatIconModule, MatExpansionModule, MatMenuModule ],
  templateUrl: './title-filter.html',
  styleUrl: './title-filter.scss',
})
export class TitleFilterComponent {
  readonly #router = inject(Router);
  readonly #userPreferencesService = inject(UserPreferencesService);

  readonly items = input<Media[]>([]);
  readonly count = input<number>(0);
  readonly currentMediaType = input<'movie' | 'tv'>('movie');

  readonly selectedFilter = model<'movies' | 'series'>('movies');

  readonly isFilterExpanded = signal(false);
  readonly isPlatformsExpanded = signal(false);
  readonly isSortExpanded = signal(false);
  
  readonly selectedProviders = this.#userPreferencesService.selectedProviders;
  readonly selectedProvidersCount = computed(() => this.selectedProviders().length);

  constructor() {
    effect(() => {
      this.selectedFilter.set(this.currentMediaType() === 'movie' ? 'movies' : 'series');
      console.log('selectedFilter updated to:', this.selectedProviders());
    });
  }

  onFilterChange(value: 'movies' | 'series'):void {
    this.selectedFilter.set(value);
    this.#router.navigate([value === 'movies' ? '/popular/movies' : '/popular/series']);
  }

}

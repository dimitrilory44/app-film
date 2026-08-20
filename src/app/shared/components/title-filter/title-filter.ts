import { DecimalPipe, SlicePipe } from '@angular/common';
import { Component, computed, effect, inject, input, model, signal} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';

import { Router } from '@angular/router';
import { Media, MovieMedia, SeriesMedia } from '@core/models/media-model';
import { UserPreferencesService } from '@core/services/user-preferences-service';
import { TmdbImagePipe } from '@shared/pipes/tmdb-image.pipe';
import { ImgFallbackDirective } from '@shared/directives/img-fallback.directive';

@Component({
  selector: 'title-filter',
  imports: [ TmdbImagePipe, SlicePipe, MatButtonToggleModule, DecimalPipe, MatButtonModule, MatIconModule, MatExpansionModule, MatMenuModule, ImgFallbackDirective ],
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

  readonly isFilterExpanded = signal(false);
  readonly isPlatformsExpanded = signal(false);
  readonly isSortExpanded = signal(false);
  
  readonly selectedProviders = this.#userPreferencesService.selectedProviders;
  readonly selectedProvidersCount = computed(() => this.selectedProviders().length);

  constructor() {
    effect(() => {
      switch (this.currentMediaType()) {
        case 'movie':
          return this.selectedFilter.set('movie');
        case 'tv':
          return this.selectedFilter.set('tv');
        default: 
          return this.selectedFilter.set('all');
      }
    });
  }

  getMediaTitle(value: 'all' | 'movie' | 'tv') {
    switch (value) {
      case 'movie':
        return this.#router.navigate(['/popular/movies']);
      case 'tv':
        return this.#router.navigate(['/popular/series']);
      default :
        return this.#router.navigate(['/popular/all']);
    }
  }

  onFilterChange(value: 'all' | 'movie' | 'tv'):void {
    this.selectedFilter.set(value);
    this.getMediaTitle(value);
  }

}

import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { TitleFilterComponent } from '@features/titles/components/title-filter/title-filter';
import { TitleListComponent } from '@features/titles/components/title-list/title-list';
import { TmdbApiService } from '@core/services/tmdb-api';
import { Media, MovieMedia, SeriesMedia } from '@core/models/media-model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserPreferencesService } from '@core/services/user-preferences-service';
import { StateMessage } from "@shared/components/state-message/state-message";

@Component({
  selector: 'popular-page',
  imports: [TitleFilterComponent, TitleListComponent, MatProgressSpinnerModule, StateMessage],
  templateUrl: './popular-titles.html',
  styleUrl: './popular-titles.scss',
})
export class PopularTitlesComponent {
  readonly #tmdbApiService = inject(TmdbApiService);
  readonly #userPreferencesService = inject(UserPreferencesService);

  readonly mediaType = input.required<'all' | 'movie' | 'tv'>();
  readonly titles = signal<Media[]>([]);
  readonly currentPage = signal(1);
  readonly isLoadingMore = signal(false);
  readonly loadMoreError = signal(false);

  readonly selectedProviderIds = this.#userPreferencesService.selectedProvidersIds;
  readonly selectedGenresIds = this.#userPreferencesService.selectedTitlesGenreIds;

  readonly moviesPopular = this.#tmdbApiService.getPopularMovies(this.currentPage);
  readonly seriesPopular = this.#tmdbApiService.getPopularSeries(this.currentPage);

  readonly allPopular = computed(() => {
    const moviesResults = (this.moviesPopular.value()?.results ?? []).map(m => ({
      ...m,
      media_type: 'movie' as const
    }) as MovieMedia);
    const tvResults = (this.seriesPopular.value()?.results ?? []).map(m => ({
      ...m,
      media_type: 'tv' as const
    }) as SeriesMedia);
    return [...moviesResults, ...tvResults].sort((a, b) => b.popularity - a.popularity);
  });

  readonly results = computed(() => {
    const type = this.mediaType();
    if (type === 'all') return this.allPopular();
    if (this.hasError()) return [];
    const response = type === 'movie' ? this.moviesPopular.value() : this.seriesPopular.value();
    if (!response) return [];
    return response.results.map(item => ({ ...item, media_type: this.mediaType() })) as Media[];
  });

  readonly totalResults = computed(() => {
    if (this.hasError()) return 0;
    return this.pick(
      this.moviesPopular.value()?.total_results ?? 0,
      this.seriesPopular.value()?.total_results ?? 0,
      (this.moviesPopular.value()?.total_results ?? 0) + (this.seriesPopular.value()?.total_results ?? 0)
    );
  });

  readonly hasError = computed(() => {
    return this.pick(!!this.moviesPopular.error(), !!this.seriesPopular.error(), !!(this.moviesPopular.error() || this.seriesPopular.error()))
  });

  readonly isInitialLoading = computed(() => {
    return this.pick(this.moviesPopular.isLoading(), this.seriesPopular.isLoading(), this.moviesPopular.isLoading() || this.seriesPopular.isLoading());;
  });

  constructor() {
    effect(() => {
      this.selectedGenresIds();
      this.selectedProviderIds();
      this.titles.set([]);
      this.currentPage.set(1);
      this.loadMoreError.set(false);
    });

    effect(() => {
      if (this.hasError()) {
        this.isLoadingMore.set(false);
        if (this.titles().length > 0) {
          this.loadMoreError.set(true);
        }
        return;
      }
 
      if (this.isInitialLoading()) return;

      this.loadMoreError.set(false);

      this.titles.update(titles => {
        const existingIds = new Set(titles.map(m => m.id));
        const newItems = this.results().filter(item => !existingIds.has(item.id));
        return [...titles, ...newItems];
      });
      this.isLoadingMore.set(false);
    });
  }

  onLoadMore(): void {
    this.isLoadingMore.set(true);
    this.loadMoreError.set(false);
    this.currentPage.update(p => p + 1);
  }

  onRetry(): void {
    const type = this.mediaType();
    if (type === 'all' || type === 'movie') this.moviesPopular.reload();
    if (type === 'all' || type === 'tv') this.seriesPopular.reload();
  }

  pick<T>(movieVal: T, tvVal: T, allVal: T): T {
    const type = this.mediaType();
    if (type === 'all') return allVal;
    return type === 'movie' ? movieVal : tvVal;
  }
}

import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { TitleFilterComponent } from '@shared/components/title-filter/title-filter';
import { TitleListComponent } from '@shared/components/title-list/title-list';
import { TmdbApiService } from '@core/services/tmdb-api';
import { Media, MovieMedia, SeriesMedia } from '@core/models/media-model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserPreferencesService } from '@core/services/user-preferences-service';

@Component({
  selector: 'popular-page',
  imports: [TitleFilterComponent, TitleListComponent, MatProgressSpinnerModule],
  templateUrl: './popular-titles.html',
  styleUrl: './popular-titles.scss',
})
export class PopularTitlesComponent {
  readonly #tmdbApiService = inject(TmdbApiService);
  readonly #userPreferencesService = inject(UserPreferencesService);

  readonly mediaType = input.required<'all' | 'movie' | 'tv'>();
  readonly titles = signal<Media[]>([]);
  readonly currentPage = signal(1);
  readonly loading = signal(false);
  readonly loadMoreError = signal(false);

  readonly selectedProviderIds = this.#userPreferencesService.selectedProvidersIds;

  readonly moviesPopular = this.#tmdbApiService.getPopularByMedia(signal('movie'), this.currentPage);
  readonly seriesPopular = this.#tmdbApiService.getPopularByMedia(signal('tv'), this.currentPage);

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
    if (this.moviesPopular.error() || this.seriesPopular.error()) return [];
    const response = type === 'movie' ? this.moviesPopular.value() : this.seriesPopular.value();
    if (!response) return [];
    return response.results.map(item => ({ ...item, media_type: this.mediaType() })) as Media[];
  });

  readonly totalResults = computed(() => {
    const type = this.mediaType();
    const totalMedia = (this.moviesPopular.value()?.total_results ?? 0) + (this.seriesPopular.value()?.total_results ?? 0);
    if (type === 'all') return totalMedia;
    if (this.moviesPopular.error() || this.seriesPopular.error()) return 0;
    return type === 'movie' ? (this.moviesPopular.value()?.total_results ?? 0) : (this.seriesPopular.value()?.total_results ?? 0);
  });

  readonly hasError = computed(() => {
    const type = this.mediaType();
    if (type === 'all') return this.moviesPopular.error() || this.seriesPopular.error();
    return type === 'movie' ? this.moviesPopular.error() : this.seriesPopular.error();
  });

  readonly isLoadingInitial = computed(() => {
    const type = this.mediaType();
    if (type === 'all') return this.moviesPopular.isLoading() || this.seriesPopular.isLoading();
    return type === 'movie' ? this.moviesPopular.isLoading() : this.seriesPopular.isLoading();
  });

  constructor() {
    effect(() => {
      this.#tmdbApiService.mediaType.set(this.mediaType());
      this.selectedProviderIds();
      this.titles.set([]);
      this.currentPage.set(1);
      this.loadMoreError.set(false);
    });

    effect(() => {
      const isAll = this.mediaType() === 'all';

      const hasError = isAll
        ? this.moviesPopular.error() || this.seriesPopular.error()
        : this.mediaType() === 'movie' ? this.moviesPopular.error() : this.seriesPopular.error();

      if (hasError) {
        this.loading.set(false);
        if (this.titles().length > 0) {
          this.loadMoreError.set(true);
        }
        return;
      }

      const isReady = isAll
        ? !this.moviesPopular.isLoading() && !this.seriesPopular.isLoading()
        : this.mediaType() === 'movie' ? !this.moviesPopular.isLoading() : !this.seriesPopular.isLoading();

      if (!isReady) return;

      this.loadMoreError.set(false);

      this.titles.update(titles => {
        const existingIds = new Set(titles.map(m => m.id));
        const newItems = this.results().filter(item => !existingIds.has(item.id));
        return [...titles, ...newItems];
      });
      this.loading.set(false);
    });
  }

  onLoadMore(): void {
    this.loading.set(true);
    this.loadMoreError.set(false);
    this.currentPage.update(p => p + 1);
  }

  reload(): void {
    const type = this.mediaType();
    if (type === 'all' || type === 'movie') this.moviesPopular.reload();
    if (type === 'all' || type === 'tv') this.seriesPopular.reload();
  }
}

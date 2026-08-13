import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { TitleFilterComponent } from '@shared/components/title-filter/title-filter';
import { TitleListComponent } from '@shared/components/title-list/title-list';
import { TmdbApiService } from '@core/services/tmdb-api';
import { Media } from '@core/models/media-model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'popular-page',
  imports: [TitleFilterComponent, TitleListComponent, MatProgressSpinnerModule],
  templateUrl: './popular-titles.html',
  styleUrl: './popular-titles.scss',
})
export class PopularTitlesComponent {
  readonly #tmdbApiService = inject(TmdbApiService);

  readonly mediaType = input.required<'movie' | 'tv'>();
  readonly currentPage = signal(1);
  readonly loading = signal(false);

  readonly titlePopular = this.#tmdbApiService.getPopular(this.mediaType, this.currentPage);
  readonly titles = signal<Media[]>([]);
  
  readonly results = computed<Media[]>(() => {
    const response = this.titlePopular.value();
    if (!response) return [];
    return response.results.map(item => ({ ...item, media_type: this.mediaType() })) as Media[];
  })
  readonly totalResults = computed(() => this.titlePopular.value()?.total_results ?? 0);

  constructor() {
    effect(() => {
      const type = this.mediaType();
      
      this.#tmdbApiService.mediaType.set(type);
      this.titles.set([]);
      this.currentPage.set(1);
    });

    effect(() => {
      const response = this.titlePopular.value();
      if (!response) return;

      this.titles.update(titles => {
        const existingIds = new Set(titles.map(m => m.id));
        const newItems = this.results().filter(item => !existingIds.has(item.id));
        return [...titles, ...newItems];
      });
      this.loading.set(false);
    })
  }

  onLoadMore(): void {
    this.loading.set(true);
    this.currentPage.update(p => p + 1);
  }
}

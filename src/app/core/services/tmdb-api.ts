import { Injectable, Signal, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Providers, TitleCollection, TitleDiscover } from '@core/models/media-model';
import { httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TmdbApiService {
  readonly #MOVIE_API_URL = environment.tmdbUrl;
  readonly mediaType = signal<'movie' | 'tv'>('movie');

  readonly movieCollection = httpResource<TitleCollection>(() => `${this.#MOVIE_API_URL}/list/1`);

  getPopular(mediaType: Signal<'movie' | 'tv'>, page: Signal<number>) {
    return httpResource<TitleDiscover>(() =>
      `${this.#MOVIE_API_URL}/discover/${mediaType()}?language=fr&page=${page()}&sort_by=popularity.desc&watch_region=FR&with_watch_providers=8|119|337`
    );
  }

  getProviders(mediaType: Signal<'movie' | 'tv'>) {
    return httpResource<Providers>(() =>
      `${this.#MOVIE_API_URL}/watch/providers/${mediaType()}?language=fr-FR&watch_region=FR`
    );
  }
  
}

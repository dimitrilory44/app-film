import { effect, inject, Injectable, Injector, Signal, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Providers, ProvidersState, TitleCollection, TitleDiscover } from '@core/models/media-model';
import { HttpClient, httpResource } from '@angular/common/http';
import { UserPreferencesService } from './user-preferences-service';
import { catchError, timeout } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TmdbApiService {
  readonly #http = inject(HttpClient);
  readonly #injector = inject(Injector);
  readonly #userPreferencesService = inject(UserPreferencesService);

  readonly #MOVIE_API_URL = environment.tmdbUrl;
  readonly mediaType = signal<'all' | 'movie' | 'tv'>('movie');
  readonly providersIds = this.#userPreferencesService.selectedProvidersIds;

  readonly movieCollection = httpResource<TitleCollection>(() => `${this.#MOVIE_API_URL}/list/1`);

  getPopularByMedia(mediaType: Signal<'all' | 'movie' | 'tv'>, page: Signal<number>) {
    return httpResource<TitleDiscover>(() => {
      if (mediaType() === 'all') return undefined;
      return {
        url: `${this.#MOVIE_API_URL}/discover/${mediaType()}`,
        params: {
          language: 'fr',
          page: page(),
          sort_by: 'popularity.desc',
          watch_region: 'FR',
          with_watch_providers: this.providersIds()
        }
      }
    });
  }

  // Contournement manuel afin de pouvoir ajouter une erreur lorsque les resources ne sont pas chargé (ou hors-ligne)
  getProviders(mediaType: Signal<'all' | 'movie' | 'tv'>): ProvidersState<Providers> {
    const value = signal<Providers | undefined>(undefined);
    const isLoading = signal(false);
    const error = signal<Error | undefined>(undefined);

    const fetch = () => {
      const type = mediaType();

      if (type === 'all') {
        value.set(undefined);
        isLoading.set(false);
        error.set(undefined);
        return;
      }

      const url = `${this.#MOVIE_API_URL}/watch/providers/${type}?language=fr-FR&watch_region=FR`;

      isLoading.set(true);
      error.set(undefined);

      this.#http
        .get<Providers>(url)
        .pipe(
          timeout(8000),
          catchError((err) => {
            error.set(err instanceof Error ? err : new Error('Impossible de charger les services de streaming', { cause: err }));
            return of(undefined);
          })
        )
        .subscribe((result) => {
          isLoading.set(false);
          if (result !== undefined) {
            value.set(result);
          }
        });
    };

    effect(() => {
      mediaType(); 
      fetch();
    }, { injector: this.#injector }); 

    return {
      value: value.asReadonly(),
      isLoading: isLoading.asReadonly(),
      error: error.asReadonly(),
      reload: fetch,
    };
  }

}

import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TmdbApiService } from '@core/services/tmdb-api';
import { TmdbImagePipe } from '@shared/pipes/tmdb-image.pipe';

import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IconChipComponent } from '../icon-chip/icon-chip';
import { DecimalPipe } from '@angular/common';
import { UserPreferencesService } from '@core/services/user-preferences-service';
import { SwiperDirective } from '@shared/directives/swiper.directive';
import { Provider } from '@core/models/media-model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImgFallbackDirective } from '@shared/directives/img-fallback.directive';
import { LoadingBar } from '../loading-bar/loading-bar';
import { OnlineStatusService } from '@core/services/online-status.service';
import { MatInputModule } from '@angular/material/input';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-provider-settings',
  imports: [TmdbImagePipe, MatDialogModule, MatButtonModule, MatChipsModule, MatIconModule, MatCheckboxModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, IconChipComponent, DecimalPipe, SwiperDirective, MatProgressSpinnerModule, ImgFallbackDirective, LoadingBar, MatInputModule],
  templateUrl: './provider-settings.html',
  styleUrl: './provider-settings.scss',
})
export class ProviderSettings {
  readonly #dialogRef = inject(MatDialogRef<ProviderSettings>);
  readonly #tmdbApiService = inject(TmdbApiService);
  readonly #userPreferencesService = inject(UserPreferencesService);
  readonly #onlineStatus = inject(OnlineStatusService);

  readonly isOnline = this.#onlineStatus.isOnline;
  readonly mediaType = this.#tmdbApiService.mediaType;

  readonly providersMovies = this.#tmdbApiService.getProviders(signal('movie'));
  readonly providersSeries = this.#tmdbApiService.getProviders(signal('tv'));

  readonly providerResults = computed(() => {
    return (this.providersMovies.value()?.results ?? []) || (this.providersMovies.value()?.results ?? []);
  });
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly searchTerm = toSignal(this.searchControl.valueChanges,{ initialValue: '' });

  readonly selectedProviders = linkedSignal(() => this.#userPreferencesService.selectedProviders());
  readonly countProvidersSelected = computed(() => this.selectedProviders().length);

  readonly areAllProvidersSelected = computed(() => {
    const response = this.providerResults();
    if (response.length === 0) return false;
    return response.every(p => this.selectedProviders().some(sp => sp.provider_id === p.provider_id));
  });

  readonly partiallyComplete = computed(() => {
    return this.selectedProviders().length > 0 && !this.areAllProvidersSelected();
  });

  readonly filteredProviders = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.providersMovies.value() || this.providersSeries.value();
    if (!data) return [];
    return data.results.filter(p => p.provider_name.toLowerCase().includes(term));
  });

  readonly hasError = computed(() => {
    const type = this.mediaType();
    if (type === 'all') return this.providersMovies.error() || this.providersSeries.error();
    return type === 'movie' ? this.providersMovies.error() : this.providersSeries.error();
  });

  readonly isLoadingInitial = computed(() => {
    const type = this.mediaType();
    if (type === 'all') return this.providersMovies.isLoading() || this.providersSeries.isLoading();
    return type === 'movie' ? this.providersMovies.isLoading() : this.providersSeries.isLoading();
  });

  readonly swiperConfig = {
    slidesPerView: 'auto' as const,
    spaceBetween: 16,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  };

  constructor() {
    this.#dialogRef.beforeClosed().subscribe(() => {
      this.#userPreferencesService.setSelectedProviders(this.selectedProviders());
    });
  }

  isSelected(id: number): boolean {
    return this.selectedProviders().some(p => p.provider_id === id);
  }

  toggleProvider(provider: Provider): void {
    const current = this.selectedProviders();
    const exists = current.some(p => p.provider_id === provider.provider_id);
    const updated = exists
      ? current.filter(p => p.provider_id !== provider.provider_id)
      : [...current, provider];
    this.selectedProviders.set(updated.sort((a, b) => a.provider_id - b.provider_id));
  }

  toggleAllProviders(): void {
    const response = this.providerResults();
    if (response.length === 0) return;
    this.selectedProviders.set(this.areAllProvidersSelected() ? [] : response);
  }

  removeProvider(id: number): void {
    this.selectedProviders.set(this.selectedProviders().filter(p => p.provider_id !== id));
  }

  save(): void {
    this.#dialogRef.close();
  }

  reload(): void {
    const type = this.mediaType();
    if (type === 'all' || type === 'movie') this.providersMovies.reload();
    if (type === 'all' || type === 'tv') this.providersSeries.reload();
  }
}

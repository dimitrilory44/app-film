import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TmdbApiService } from '@core/services/tmdb-api';
import { TmdbImagePipe } from '@shared/pipes/tmdb-image.pipe';

import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IconChipComponent } from '../icon-chip/icon-chip';
import { DecimalPipe } from '@angular/common';
import { UserPreferencesService } from '@core/services/user-preferences-service';
import { Provider } from '@core/models/media-model';

@Component({
  selector: 'app-provider-settings',
  imports: [TmdbImagePipe, MatDialogModule, MatButtonModule, MatChipsModule, MatIconModule, MatCheckboxModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, IconChipComponent, DecimalPipe],
  templateUrl: './provider-settings.html',
  styleUrl: './provider-settings.scss',
})
export class ProviderSettings {
  readonly #tmdbApiService = inject(TmdbApiService);
  readonly #userPreferencesService = inject(UserPreferencesService);

  readonly providers = this.#tmdbApiService.getProviders(this.#tmdbApiService.mediaType);

  readonly selectedProviders = signal<Provider[]>(structuredClone(this.#userPreferencesService.selectedProviders()));
  readonly countProvidersSelected = computed(() => this.selectedProviders().length);
  readonly partiallyComplete = computed(() => {
    const providers = this.selectedProviders();
    return providers.length > 0 && providers.some(p => p.provider_id);
  });

  constructor(
    private dialogRef: MatDialogRef<ProviderSettings>
  ) {
    effect(() => {
      this.dialogRef.beforeClosed().subscribe(() => {
        this.#userPreferencesService.setSelectedProviders(
          this.selectedProviders()
        );
      });
    });
  }

  isSelected(id: number): boolean {
    return this.selectedProviders().some(p => p.provider_id === id);
  }

  toggleProvider(providerId: number, providerName: string, logoPath: string): void {
    const current = this.selectedProviders();
    const exists = current.some(p => p.provider_id === providerId);
    const updated = exists
      ? current.filter(p => p.provider_id !== providerId)
      : [...current, { provider_id: providerId, provider_name: providerName, logo_path: logoPath}];
    
    this.selectedProviders.set(updated.sort((a, b) => a.provider_id - b.provider_id));
  }

  removeProvider(id: number): void {
    const updated = this.selectedProviders().filter(p => p.provider_id !== id);
    this.selectedProviders.set(updated);
  }

  save(): void {
    this.dialogRef.close();
  }
}

import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserPreferencesService } from '@core/services/user-preferences-service';
import { IconChipComponent } from "@shared/components/icon-chip/icon-chip";
import { ProviderSettings } from '@shared/components/provider-settings/provider-settings';
import { SwiperDirective } from '@shared/directives/swiper.directive';
import { TmdbImagePipe } from '@shared/pipes/tmdb-image.pipe';

@Component({
  selector: 'title-filter-providers',
  imports: [IconChipComponent, SwiperDirective, TmdbImagePipe, DecimalPipe],
  templateUrl: './title-filter-providers.html',
  styleUrl: './title-filter-providers.scss',
})
export class TitleFilterProvidersComponent {
  readonly #userPreferencesService = inject(UserPreferencesService);
  readonly #dialog = inject(MatDialog);

  readonly selectedProviders = this.#userPreferencesService.selectedProviders;
  readonly selectedProvidersCount = computed(() => this.selectedProviders().length);

  readonly swiperConfig = {
    slidesPerView: 'auto' as const,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  };

  openDialog() {
    const dialogRef = this.#dialog.open(ProviderSettings, {
      panelClass: 'dialog-panel',
      width: '600px',
      height: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

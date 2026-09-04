import { DecimalPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Provider } from '@core/models/media-model';
import { IconChipComponent } from "@shared/components/icon-chip/icon-chip";
import { SwiperDirective } from '@shared/directives/swiper.directive';
import { TmdbImagePipe } from '@shared/pipes/tmdb-image.pipe';
import { TitleFilterProviderConfigComponent } from './title-filter-provider-config/title-filter-provider-config';

@Component({
  selector: 'title-filter-providers',
  imports: [IconChipComponent, SwiperDirective, TmdbImagePipe, DecimalPipe],
  templateUrl: './title-filter-providers.html',
  styleUrl: './title-filter-providers.scss',
})
export class TitleFilterProvidersComponent {
  readonly #dialog = inject(MatDialog);

  readonly providers = input<Provider[]>([]);
  readonly count = input<number>(1);

  readonly swiperConfig = {
    slidesPerView: 'auto' as const,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  };

  openDialog() {
    const dialogRef = this.#dialog.open(TitleFilterProviderConfigComponent, {
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

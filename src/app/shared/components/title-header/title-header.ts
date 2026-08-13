import { Component, inject, model } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProviderSettings } from '../provider-settings/provider-settings';
import { TmdbApiService } from '@core/services/tmdb-api';

@Component({
  selector: 'title-header',
  imports: [ MatToolbarModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, RouterLink, RouterLinkActive ],
  templateUrl: './title-header.html',
  styleUrl: './title-header.scss',
})
export class TitleHeaderComponent {
  readonly dialog = inject(MatDialog);

  readonly search = model('');

  readonly menus = [
    { label: 'Accueil', path: null, exact: true },
    { label: 'Nouveautés', path: null, exact: false },
    { label: 'Populaires', path: '/popular', exact: false },
    { label: 'Listes', path: null, exact: false }
  ];

  openDialog() {
    const dialogRef = this.dialog.open(ProviderSettings, {
      panelClass: 'dialog-panel',
      width: '600px',
      height: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

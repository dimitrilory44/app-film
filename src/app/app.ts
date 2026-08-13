import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleHeaderComponent } from '@shared/components/title-header/title-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TitleHeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('app-film');
}

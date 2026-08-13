import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'icon-chip',
  imports: [MatIconModule],
  templateUrl: './icon-chip.html',
  styleUrl: './icon-chip.scss',
})
export class IconChipComponent {
  readonly iconUrl = input.required<string>();
  readonly label = input.required<string>();

  readonly removed = output<void>();

  onRemove(event: Event): void {
    event.stopPropagation();
    this.removed.emit();
  }
}

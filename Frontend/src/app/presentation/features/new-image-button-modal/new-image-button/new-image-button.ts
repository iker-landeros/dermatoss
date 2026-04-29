import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-new-image-button',
  imports: [],
  templateUrl: './new-image-button.html',
  styleUrl: './new-image-button.css',
})
export class NewImageButton {
  @Output() open = new EventEmitter<void>();

  openModal() {
    this.open.emit();
  }
}
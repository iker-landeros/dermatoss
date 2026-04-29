import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-new-image-modal',
  imports: [],
  templateUrl: './new-image-modal.html',
  styleUrl: './new-image-modal.css',
})
export class NewImageModal {
  @Output() close = new EventEmitter<void>();
  @Output() submitImage = new EventEmitter<any>();

  @Input() errorMessage = signal<string | null>(null);

  isLoading = signal<boolean>(false);

  selectedFile = signal<File | null>(null);
  hypothesis = signal<string>('');

  onFileChange(event: any) {
    this.selectedFile.set(event.target.files[0]);
  }

  submit() {
    this.isLoading.set(true);
    this.submitImage.emit({
      file: this.selectedFile(),
      hypothesis: this.hypothesis()
    });
    this.close.emit();
  }

  closeModal() {
    this.close.emit();
  }
}

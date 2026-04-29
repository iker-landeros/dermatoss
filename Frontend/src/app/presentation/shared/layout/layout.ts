import { Component, inject, signal } from '@angular/core';
import { DiagnosticsResult } from '../../features/diagnostics-result/diagnostics-result';
import { AnalyzedImage } from '../../features/analyzed-image/analyzed-image';
import { DiagnosisVsPrediction } from '../../features/diagnosis-vs-prediction/diagnosis-vs-prediction';
import { DiagnosticCertainty } from '../../features/diagnostic-certainty/diagnostic-certainty';
import { KeyFeatures } from '../../features/key-features/key-features';
import { KeyLearnings } from '../../features/key-learnings/key-learnings';
import { NewImageButton } from '../../features/new-image-button-modal/new-image-button/new-image-button';
import { NewImageModal } from '../../features/new-image-button-modal/new-image-modal/new-image-modal';
import { ApiService } from '../../../services/api.service';
import { AnalysisService } from '../../../services/analysis.service';

@Component({
  selector: 'app-layout',
  imports: [DiagnosticsResult,
            AnalyzedImage,
            DiagnosisVsPrediction,
            DiagnosticCertainty,
            KeyFeatures,
            KeyLearnings,
            NewImageButton,
            NewImageModal
          ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

  isLoading = signal<boolean>(false);
  
  errorMessage = signal<string | null>(null);

  showModal = signal<boolean>(false);

  api = inject(ApiService);
  analysis = inject(AnalysisService);

  result: any = null;

  openModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleSubmit(data: any) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const file = data.file;

    // 🔹 Convert image to base64 (for original preview)
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      // ✅ Store original image
      this.analysis.setOriginalImage(base64);

      // 🔹 Call API
      this.api.predictImage(file).subscribe({
        next: (res) => {
          this.result = res;

          // ✅ Store API result (this triggers analyzed-image update)
          this.analysis.setResult(res);

          this.showModal.set(false);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Error analyzing image. Please try again.');
          this.isLoading.set(false);
        }
      });
    };

    reader.readAsDataURL(file);
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { AnalysisService } from '../../../services/analysis.service';

@Component({
  selector: 'app-analyzed-image',
  imports: [],
  templateUrl: './analyzed-image.html',
  styleUrl: './analyzed-image.css',
})
export class AnalyzedImage implements OnInit {

  originalImage = signal<string | null>(null);
  gradcamImage = signal<string | null>(null);

  showGradcam = false;

  constructor(private analysisService: AnalysisService) {}

  ngOnInit() {
    this.analysisService.originalImage$.subscribe(img => {
      this.originalImage.set(img);
    });

    this.analysisService.result$.subscribe(result => {
      if (result) {
        this.gradcamImage.set('data:image/jpeg;base64,' + result.gradcam_image);
      }
    });
  }

  toggleView() {
    this.showGradcam = !this.showGradcam;
  }
}
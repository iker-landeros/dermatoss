import { Component, computed, OnInit, signal } from '@angular/core';
import { AnalysisService } from '../../../services/analysis.service';

@Component({
  selector: 'app-diagnosis-vs-prediction',
  imports: [],
  templateUrl: './diagnosis-vs-prediction.html',
  styleUrl: './diagnosis-vs-prediction.css',
})
export class DiagnosisVsPrediction implements OnInit {

  hypothesis = signal<string | null>(null);
  prediction = signal<string | null>(null);

  isMatch = computed<boolean>(() => {
    return this.hypothesis() === this.prediction() && this.hypothesis() !== null && this.prediction() !== null;
  });

  constructor(private analysis: AnalysisService) {}

  ngOnInit() {
    this.analysis.hypothesis$.subscribe(h => {
      this.hypothesis.set(h);
    });

    this.analysis.result$.subscribe(res => {
      if (res) {
        this.prediction.set(res.class_name);
      }
    });
  }
}
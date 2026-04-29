import { Component, computed, OnInit, signal } from '@angular/core';
import { AnalysisService } from '../../../services/analysis.service';

@Component({
  selector: 'app-diagnostic-certainty',
  imports: [],
  templateUrl: './diagnostic-certainty.html',
  styleUrl: './diagnostic-certainty.css',
})
export class DiagnosticCertainty implements OnInit {

  confidence = signal<number | null>(null);
  prediction = signal<string | null>(null);

  // Convert to percentage
  confidencePercent = computed(() => {
    return this.confidence() ? Math.round(this.confidence()! * 100) : 0;
  });

  constructor(private analysis: AnalysisService) {}

  ngOnInit() {
    this.analysis.result$.subscribe(res => {
      if (res) {
        this.confidence.set(res.confidence);
        this.prediction.set(res.class_name);
      }
    });
  }

  labelMap: Record<string, string> = {
    BKL: 'Queratosis benigna',
    MEL: 'Melanoma',
    NV: 'Nevo melanocítico',
    BCC: 'Carcinoma basocelular',
    AK: 'Queratosis actínica',
    DF: 'Dermatofibroma',
    VASC: 'Lesión vascular',
    SCC: 'Carcinoma escamoso'
  };

  fullLabel = computed(() => {
    return this.labelMap[this.prediction() ?? ''] || this.prediction();
  });
}
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-diagnostics-result',
  imports: [],
  templateUrl: './diagnostics-result.html',
  styleUrl: './diagnostics-result.css',
})
export class DiagnosticsResult {
  diagnosisResult = signal<boolean | null>(null);
}

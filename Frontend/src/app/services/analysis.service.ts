import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnalysisResult } from '../interfaces/analysis-result.interface';

@Injectable({ providedIn: 'root' })
export class AnalysisService {
  private resultSubject = new BehaviorSubject<AnalysisResult | null>(null);
  result$ = this.resultSubject.asObservable();

  private hypothesisSubject = new BehaviorSubject<string | null>(null);
  hypothesis$ = this.hypothesisSubject.asObservable();
  
  private originalImageSubject = new BehaviorSubject<string | null>(null);
  originalImage$ = this.originalImageSubject.asObservable();

  setResult(result: AnalysisResult) {
    this.resultSubject.next(result);
  }

  setHypothesis(hypothesis: string) {
    this.hypothesisSubject.next(hypothesis);
  }

  setOriginalImage(base64: string) {
    this.originalImageSubject.next(base64);
  }
}
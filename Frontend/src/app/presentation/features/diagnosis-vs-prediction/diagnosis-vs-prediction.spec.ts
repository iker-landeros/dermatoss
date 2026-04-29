import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisVsPrediction } from './diagnosis-vs-prediction';

describe('DiagnosisVsPrediction', () => {
  let component: DiagnosisVsPrediction;
  let fixture: ComponentFixture<DiagnosisVsPrediction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosisVsPrediction],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosisVsPrediction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

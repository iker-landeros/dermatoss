import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticCertainty } from './diagnostic-certainty';

describe('DiagnosticCertainty', () => {
  let component: DiagnosticCertainty;
  let fixture: ComponentFixture<DiagnosticCertainty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticCertainty],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosticCertainty);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticsResult } from './diagnostics-result';

describe('DiagnosticsResult', () => {
  let component: DiagnosticsResult;
  let fixture: ComponentFixture<DiagnosticsResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticsResult],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosticsResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

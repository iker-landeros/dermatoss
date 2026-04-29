import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzedImage } from './analyzed-image';

describe('AnalyzedImage', () => {
  let component: AnalyzedImage;
  let fixture: ComponentFixture<AnalyzedImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyzedImage],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyzedImage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

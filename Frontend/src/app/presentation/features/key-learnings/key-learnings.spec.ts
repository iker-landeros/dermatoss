import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyLearnings } from './key-learnings';

describe('KeyLearnings', () => {
  let component: KeyLearnings;
  let fixture: ComponentFixture<KeyLearnings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyLearnings],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyLearnings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

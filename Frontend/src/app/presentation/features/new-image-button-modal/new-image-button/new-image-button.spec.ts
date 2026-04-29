import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewImageButton } from './new-image-button';

describe('NewImageButton', () => {
  let component: NewImageButton;
  let fixture: ComponentFixture<NewImageButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewImageButton],
    }).compileComponents();

    fixture = TestBed.createComponent(NewImageButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

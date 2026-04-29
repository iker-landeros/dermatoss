import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewImageModal } from './new-image-modal';

describe('NewImageModal', () => {
  let component: NewImageModal;
  let fixture: ComponentFixture<NewImageModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewImageModal],
    }).compileComponents();

    fixture = TestBed.createComponent(NewImageModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialForm } from './trial-form';

describe('TrialForm', () => {
  let component: TrialForm;
  let fixture: ComponentFixture<TrialForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrialForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TrialForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

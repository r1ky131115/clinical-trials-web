import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialCard } from './trial-card';

describe('TrialCard', () => {
  let component: TrialCard;
  let fixture: ComponentFixture<TrialCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrialCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TrialCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

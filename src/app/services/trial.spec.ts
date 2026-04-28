import { TestBed } from '@angular/core/testing';

import { Trial } from './trial';

describe('Trial', () => {
  let service: Trial;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Trial);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

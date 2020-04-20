import { TestBed } from '@angular/core/testing';

import { SuggesterService } from './suggester.service';

describe('SuggesterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuggesterService = TestBed.get(SuggesterService);
    expect(service).toBeTruthy();
  });
});

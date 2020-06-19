import { TestBed } from '@angular/core/testing';

import { MilesService } from './miles.service';

describe('MilesService', () => {
  let service: MilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

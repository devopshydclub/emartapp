import { TestBed } from '@angular/core/testing';

import { BackendConfigService } from './backend-config.service';

describe('BackendConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackendConfigService = TestBed.get(BackendConfigService);
    expect(service).toBeTruthy();
  });
});

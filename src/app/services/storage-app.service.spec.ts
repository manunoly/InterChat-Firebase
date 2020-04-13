import { TestBed } from '@angular/core/testing';

import { StorageAppService } from './storage-app.service';

describe('StorageAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorageAppService = TestBed.get(StorageAppService);
    expect(service).toBeTruthy();
  });
});

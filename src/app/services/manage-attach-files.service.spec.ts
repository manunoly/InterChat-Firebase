import { TestBed } from '@angular/core/testing';

import { ManageAttachFilesService } from './manage-attach-files.service';

describe('ManageAttachFilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageAttachFilesService = TestBed.get(ManageAttachFilesService);
    expect(service).toBeTruthy();
  });
});

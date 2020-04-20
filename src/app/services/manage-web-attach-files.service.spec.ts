import { TestBed } from '@angular/core/testing';

import { ManageWebAttachFilesService } from './manage-web-attach-files.service';

describe('ManageWebAttachFilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageWebAttachFilesService = TestBed.get(ManageWebAttachFilesService);
    expect(service).toBeTruthy();
  });
});

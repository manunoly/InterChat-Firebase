import { TestBed } from '@angular/core/testing';

import { PlaySoundService } from './play-sound.service';

describe('PlaySoundService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlaySoundService = TestBed.get(PlaySoundService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { AudioUrlService } from './audio-url.service';

describe('AudioUrlService', () => {
  let service: AudioUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

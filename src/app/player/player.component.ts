import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { AudioUrlService } from '../audio-url.service';
import { PlayerService } from '../player.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
})
export class PlayerComponent implements AfterViewInit {
  @ViewChild('playerProgressBar') progressBarRef!: ElementRef;
  @ViewChild('audioElement') audioElementRef!: ElementRef;
  @ViewChild('playButton') playButtonRef!: ElementRef;
  @ViewChild('playerContainer') playerContainerRef!: ElementRef;
  audioName!: string;
  audioElement!: HTMLAudioElement;
  progressBar!: HTMLElement;
  playButton!: HTMLElement;
  playerContainer!: HTMLElement;
  audioDuration: String = '00:00';
  audioProgress: String = '00:00';
  constructor(
    private searchService: SearchService,
    private playerService: PlayerService,
    private audioUrlService: AudioUrlService
  ) {}

  convertTime(duration: number): String {
    let minutes = Math.floor(duration / 60)
      .toString()
      .padStart(2, '0');
    let seconds = Math.floor(duration % 60)
      .toString()
      .padStart(2, '0');
    if (minutes == 'NaN' || seconds == 'NaN') {
      return this.audioDuration;
    }
    return minutes + ':' + seconds;
  }

  adjustProgressBar(percent: Number, once: boolean): void {
    (this.progressBar as HTMLElement).style.width = percent + '%';
    if (!this.audioElement.paused && !once) {
      setTimeout(() => {
        let percent = Math.min(
          (10 / this.audioElement.duration) *
            this.audioElement.currentTime *
            10,
          100
        );
        this.audioProgress = this.convertTime(this.audioElement.currentTime);
        this.adjustProgressBar(percent, once);
      }, 100);
    }
  }

  ngAfterViewInit(): void {
    this.audioElement = this.audioElementRef.nativeElement;
    this.progressBar = this.progressBarRef.nativeElement;
    this.playButton = this.playButtonRef.nativeElement;
    this.playerContainer = this.playerContainerRef.nativeElement;
    this.audioUrlService.url.subscribe((url) => {
      let wasPaused = this.audioElement.paused;
        if (this.playerContainer.classList.contains('d-none')) {
          this.playerContainer.classList.remove('d-none');
          wasPaused = false;
          this.togglePlayButton();
        }
        this.audioElement.src = url;
        this.audioDuration = this.convertTime(this.audioElement.duration);
        if (!wasPaused) {
          this.audioElement.play();
        } else {
          this.adjustProgressBar(0, true);
          this.audioProgress = '00:00';
        }
    });
    this.playerService.audioName.subscribe((name) => (this.audioName = name));
    this.playerService.selected.subscribe((selected) => {
      if (selected) {
        let wasPaused = this.audioElement.paused;
        if (this.playerContainer.classList.contains('d-none')) {
          this.playerContainer.classList.remove('d-none');
          wasPaused = false;
          this.togglePlayButton();
        }
        this.audioDuration = this.convertTime(this.audioElement.duration);
        if (!wasPaused) {
          this.audioElement.play();
        } else {
          this.adjustProgressBar(0, true);
          this.audioProgress = '00:00';
        }
      }
    });
  }

  controlProgress(event: MouseEvent): void {
    let target = event.currentTarget as HTMLElement;
    let percent =
      ((event.clientX - target.getBoundingClientRect().left) * 100) /
      target.offsetWidth;
    (target.firstChild as HTMLElement).style.width = percent + '%';
    this.audioElement.currentTime =
      (this.audioElement.duration * percent) / 100;
    this.audioProgress = this.convertTime(this.audioElement.currentTime);
  }

  togglePlayButton(): void {
    if (this.playButton.classList.contains('bi-play-fill')) {
      this.playButton.classList.remove('bi-play-fill');
      this.playButton.classList.add('bi-pause-fill');
    } else if (this.playButton.classList.contains('bi-pause-fill')) {
      this.playButton.classList.remove('bi-pause-fill');
      this.playButton.classList.add('bi-play-fill');
    }
  }

  togglePlay(): void {
    this.togglePlayButton();
    if (this.audioElement.paused) {
      this.audioElement.play();
    } else {
      this.audioElement.pause();
    }
  }

  whilePlaying(event: Event): void {
    let audioElement = event.target as HTMLAudioElement;
    let duration = audioElement.duration;
    let percent = Math.min(
      (10 / duration) * audioElement.currentTime * 10,
      100
    );
    this.adjustProgressBar(percent, false);
  }

  onCanPlay(event: Event): void {
    this.audioDuration = this.convertTime(this.audioElement.duration);
  }

  onEnded(event: Event): void {
    this.togglePlayButton();
  }

  closePlayer(event: MouseEvent): void {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.playButton.classList.add('bi-play-fill');
    this.playButton.classList.remove('bi-pause-fill');
    this.playerContainer.classList.add('d-none');
    this.adjustProgressBar(0, true);
    this.audioProgress = '00:00';
    this.searchService.unSelectResult.next(true);
  }
}

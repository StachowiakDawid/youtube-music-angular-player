import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { PlayerService } from '../player.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
})
export class PlayerComponent implements AfterViewInit {
  @ViewChild('audioElement') audioElementRef!: ElementRef;
  audioName!: string;
  audioElement!: HTMLAudioElement;
  progressBarWidth: number = 0;
  audioDuration: String = '00:00';
  audioProgress: String = '00:00';
  audioIsLoading = true;
  audioIsPlaying = false;
  showPlayerContainer = false;
  constructor(
    private searchService: SearchService,
    private playerService: PlayerService
  ) {}

  convertTime(duration: number): String {
    const convert = (d: number) => Math.floor(d).toString().padStart(2, '0');
    const durationStr = `${convert(duration / 60)}:${convert(duration % 60)}`;
    return durationStr.includes('NaN') ? this.audioDuration : durationStr;
  }

  adjustProgressBar(percent: number, once: boolean): void {
    if (percent === 0) {
      this.audioProgress = '00:00';
    }
    this.progressBarWidth = percent;
    if (this.audioElement.paused || once) return;
    setTimeout(() => {
      this.audioProgress = this.convertTime(this.audioElement.currentTime);
      this.adjustProgressBar(this.getDurationPercent(), false);
    }, 100);
  }

  ngAfterViewInit(): void {
    this.audioElement = this.audioElementRef.nativeElement;
    this.playerService.selected.subscribe((selected) => {
      if (!selected) return;
      this.audioIsLoading = true;
      const wasPaused = this.audioElement.paused && this.showPlayerContainer;
      this.audioElement.pause();
      this.adjustProgressBar(0, true);
      this.audioName = selected.snippet.title;
      this.showPlayerContainer = true;
      this.playerService.loadAudio(selected.id.videoId).subscribe((url) => {
        this.audioElement.src = url;
        this.audioDuration = this.convertTime(this.audioElement.duration);
        !wasPaused ? this.audioElement.play() : this.adjustProgressBar(0, true);
        this.audioIsLoading = false;
      });
    });
  }

  controlProgress(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const percent =
      ((event.clientX - target.getBoundingClientRect().left) * 100) /
      target.offsetWidth;
    this.progressBarWidth = percent;
    this.audioElement.currentTime =
      (this.audioElement.duration * percent) / 100;
    this.audioProgress = this.convertTime(this.audioElement.currentTime);
  }

  togglePlay(): void {
    this.audioElement.paused
      ? this.audioElement.play()
      : this.audioElement.pause();
  }

  whilePlaying(): void {
    this.audioIsPlaying = true;
    this.adjustProgressBar(this.getDurationPercent(), false);
  }

  onCanPlay(): void {
    this.audioDuration = this.convertTime(this.audioElement.duration);
  }

  audioIsNotPlaying(): void {
    this.audioIsPlaying = false;
  }

  closePlayer(): void {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.adjustProgressBar(0, true);
    this.showPlayerContainer = false;
    this.searchService.unSelectResult.next(true);
  }

  getDurationPercent(): number {
    const duration = this.audioElement.duration;
    const currentTime = this.audioElement.currentTime;
    return Math.min((10 / duration) * currentTime * 10, 100);
  }
}

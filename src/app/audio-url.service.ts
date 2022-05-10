import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioUrlService {
  private counter = 0;
  constructor() { }
  getAudioUrl(): string {
    let songs = ["SoundHelix-Song-1.mp3", "Sample2.mp3"];
    this.counter++;
    return "assets/" + songs[this.counter%2];
  }
}

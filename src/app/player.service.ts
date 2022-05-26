import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  audioName = new Subject<string>();
  selected = new Subject<boolean>();
  audioSrc = new Subject<string>();
  constructor() { }
}

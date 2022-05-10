import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { AUDIO_API_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  selected = new Subject<any>();
  constructor(private http: HttpClient) { }
  loadAudio(id: number): Observable<string> {
    return of(`${AUDIO_API_URL}?${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BACKEND_URL } from 'src/constants';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  selected = new Subject<any>();
  constructor(private http: HttpClient) { }
  loadAudioUrl(id: string): Observable<string> {
    return this.http.get(`${BACKEND_URL}?id=${id}`, {responseType: 'text'});
  }
}

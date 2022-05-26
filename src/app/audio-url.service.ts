import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BACKEND_URL } from 'src/constants';
@Injectable({
  providedIn: 'root'
})
export class AudioUrlService {
  public url = new Subject<string>();
  constructor(private http: HttpClient) { }
  loadAudioUrl(id: string): Observable<string> {
    let result = this.http.get(`${BACKEND_URL}?id=${id}`, {responseType: 'text'});
    result.subscribe(url => this.url.next(url));
    return result;
  }
}

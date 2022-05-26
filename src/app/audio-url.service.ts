import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_URL } from 'src/constants';
@Injectable({
  providedIn: 'root'
})
export class AudioUrlService {
  private url: string = '';
  constructor(private http: HttpClient) { }
  getAudioUrl(id: string): Observable<string> {
    let result = this.http.get(`${BACKEND_URL}?id=${id}`, {responseType: 'text'}).pipe();
    return result;
  }
}

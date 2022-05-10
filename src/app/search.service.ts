import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Observable, of } from 'rxjs';
import { SearchHistoryService } from './search-history.service';
import { YT_API_KEY, YT_API_URL } from 'src/constants';
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private nextPageToken: string = '';
  private latestPhrase: string = '';
  public searchPhrase = new Subject<string>();
  public unSelectResult = new Subject<boolean>();
  private options: any;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient, private searchHistoryService: SearchHistoryService) {
    this.options = {
      params: new HttpParams()
      .append('part', 'id')
      .append('part', 'snippet')
      .append('maxResults', '25')
      .append('type', 'video')
      .append('key', YT_API_KEY)
    };
  };

  getSearchResults(phrase: string): Observable<Object> {
    this.options.params = this.options.params.set('q', phrase);
    let results = this.http.get(YT_API_URL, this.options).pipe();
    this.latestPhrase = phrase;
    this.searchHistoryService.addItem(phrase);
    results.subscribe((searchResults: any) => this.nextPageToken = searchResults.nextPageToken);
    return results;
  };

  loadMoreSearchResults(): Observable<Object> {
    let options = this.options;
    options.params = options.params.append('pageToken', this.nextPageToken);
    let results = this.http.get(YT_API_URL, options).pipe();
    results.subscribe((searchResults: any) => this.nextPageToken = searchResults.nextPageToken);
    return results;
  };
}

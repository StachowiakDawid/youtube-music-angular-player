import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Observable, of } from 'rxjs';
import { SearchHistoryService } from './search-history.service';
import { YT_API_URL } from '../constants';
import urlJoin from 'url-join';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private nextPageToken: string = '';
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
    };
  };

  getSearchResults(phrase: string): Observable<Object> {
    this.options.params = this.options.params.set('q', phrase);
    const results = this.http.get(urlJoin(YT_API_URL, 'search'), this.options);
    this.searchHistoryService.addItem(phrase);
    results.subscribe((searchResults: any) => this.nextPageToken = searchResults.nextPageToken);
    return results;
  };

  loadMoreSearchResults(): Observable<Object> {
    const options = this.options;
    options.params = options.params.append('pageToken', this.nextPageToken);
    const results = this.http.get(urlJoin(YT_API_URL, 'search'), options);
    results.subscribe((searchResults: any) => this.nextPageToken = searchResults.nextPageToken);
    return results;
  };
}

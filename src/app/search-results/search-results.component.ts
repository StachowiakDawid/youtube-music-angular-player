import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params, Data } from '@angular/router';
import { combineLatest } from 'rxjs';
import { PlayerService } from '../player.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
})
export class SearchResultsComponent implements OnInit {
  throttle = 300;
  scrollDistance = 1;
  phrase!: string | null;
  searchResults: Array<any> = [];
  selectedResult?: Element;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private playerService: PlayerService,
  ) { }

  ngOnInit(): void {
    combineLatest(
      [this.route.params,
      this.route.data],
      (params: Params, data: Data) => ({
        params,
        data,
      })
    ).subscribe((res: { params: Params; data: Data }) => {
      const { params, data } = res;
      this.phrase = params['phrase'];
      this.searchService.searchPhrase.next(params['phrase']);
      this.searchService.getSearchResults(params['phrase']).subscribe((searchResults: any) => this.searchResults = searchResults.items);
    });
    this.searchService.unSelectResult.subscribe(unSelect => {
      if (unSelect) {
        this.selectedResult?.classList.remove("bg-light");
        this.selectedResult = undefined;
      }
    });
  }

  loadMore(): void {
    this.searchService.loadMoreSearchResults().subscribe((searchResults: any) => this.searchResults = this.searchResults.concat(searchResults.items));
  }

  onScrollDown(): void {
    this.loadMore();
  }
  
  onClick(event: MouseEvent, i: number): void {
    let target = (event.currentTarget as Element);
    if ((this.selectedResult && this.selectedResult !== target) || !this.selectedResult) {
      if (this.selectedResult) {
        this.selectedResult.classList.remove("bg-light");
      }
      this.selectedResult = target;
      this.selectedResult.classList.add("bg-light");
      this.playerService.audioSrc = this.searchResults[i].id.videoId;
      this.playerService.audioName.next(this.searchResults[i].snippet.title);
      this.playerService.selected.next(true);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Data } from '@angular/router';
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
  selectedResult?: Number;
  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private playerService: PlayerService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      [this.route.params, this.route.data],
      (params: Params, data: Data) => ({
        params,
        data,
      })
    ).subscribe((res: { params: Params; data: Data }) => {
      const { params, data } = res;
      this.phrase = params['phrase'];
      this.searchService.searchPhrase.next(params['phrase']);
      this.searchService
        .getSearchResults(params['phrase'])
        .subscribe(
          (searchResults: any) => (this.searchResults = searchResults.items)
        );
    });
    this.searchService.unSelectResult.subscribe((unSelect) => {
      if (unSelect) {
        this.selectedResult = undefined;
      }
    });
  }

  loadMore(): void {
    this.searchService
      .loadMoreSearchResults()
      .subscribe(
        (searchResults: any) =>
          (this.searchResults = this.searchResults.concat(searchResults.items))
      );
  }

  onClick(event: MouseEvent, i: number): void {
    if (
      (this.selectedResult && this.selectedResult !== i) ||
      !this.selectedResult
    ) {
      this.selectedResult = i;
      this.playerService.selected.next(this.searchResults[i]);
    }
  }
}

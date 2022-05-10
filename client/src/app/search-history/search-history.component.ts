import { Component, OnInit } from '@angular/core';
import { SearchHistoryService } from '../search-history.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-history',
  templateUrl: './search-history.component.html',
})

export class SearchHistoryComponent implements OnInit {
  searchHistory: Array<string> = this.searchHistoryService.getSearchHistory();
  inputPhrase!: string;
  constructor(private searchHistoryService: SearchHistoryService, private searchService: SearchService) { }

  ngOnInit(): void {
    this.searchService.searchPhrase.subscribe((data) => this.inputPhrase = data);
  }

  deleteItem (index: number): void {
    this.searchHistoryService.removeItem(index);
    this.searchHistory = this.searchHistoryService.getSearchHistory();
  }

}

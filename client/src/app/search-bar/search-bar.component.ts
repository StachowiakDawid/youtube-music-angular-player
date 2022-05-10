import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent implements OnInit {
  searchPhrase: string = '';
  constructor (private searchService: SearchService, private router: Router, private location: Location) {}

  onInputChange(): void {
    this.searchService.searchPhrase.next(this.searchPhrase);
  }

  ngOnInit(): void {
    this.searchService.searchPhrase.subscribe((phrase) => this.searchPhrase = phrase);
  }

  isHomeRoute(): boolean {
    return this.router.url === '/';
  }

  goBack(): void {
    this.location.back();
  }

  search(phrase: string) {
    this.router.navigate(['search', phrase]);
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchHistoryService {
  constructor() { 
    if (!localStorage['searchHistory']) {
      localStorage['searchHistory'] = JSON.stringify([]);
    }
  }

  getSearchHistory(): Array<any> {
    let history = JSON.parse(localStorage['searchHistory']);
    history = history.map((el: any) => {return el.phrase});
    return history;
  }

  addItem(item: string): void {
    let history = JSON.parse(localStorage['searchHistory']);
    let contains = false;
    item = item.trim();
    history.forEach((element: any) => {
      if (element.phrase == item) {
        contains = true;
        element.timestamp = Date.now();
      }
    });
    if (!contains) {
      history.push({phrase: item, timestamp: Date.now()});
    }
    history = history.sort((a: any, b: any) => {
      return b.timestamp-a.timestamp;
    });
    localStorage['searchHistory'] = JSON.stringify(history);
  }

  removeItem (index: number): void {
    let history = JSON.parse(localStorage['searchHistory']);
    history.splice(index, 1);
    localStorage['searchHistory'] = JSON.stringify(history);
  }
}

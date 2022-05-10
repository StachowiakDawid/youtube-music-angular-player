import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchHistoryService {
  constructor() {
    if (!localStorage['searchHistory']) {
      this.saveHistory([]);
    }
  }

  getSearchHistory(): Array<any> {
    return this.getHistory().map((el: any) => el.phrase);
  }

  addItem(item: string): void {
    item = item.trim();
    const history = this.getHistory();
    const existingElement = history.find((x: any) => x.phrase === item);
    if (existingElement) {
      existingElement.timestamp = Date.now();
    } else {
      history.push({ phrase: item, timestamp: Date.now() });
    }
    this.saveHistory(
      history.sort((a: any, b: any) => b.timestamp - a.timestamp)
    );
  }

  removeItem(index: number): void {
    const history = this.getHistory();
    history.splice(index, 1);
    this.saveHistory(history);
  }

  getHistory(): any[] {
    return JSON.parse(localStorage['searchHistory']);
  }

  saveHistory(history: any[]) {
    localStorage['searchHistory'] = JSON.stringify(history);
  }
}

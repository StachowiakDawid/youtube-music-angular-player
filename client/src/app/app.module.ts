import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchHistoryComponent } from './search-history/search-history.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@NgModule({ declarations: [
        AppComponent,
        PlayerComponent,
        SearchBarComponent,
        SearchHistoryComponent,
        SearchResultsComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        InfiniteScrollModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }

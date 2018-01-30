import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ItemComponent } from './item/item.component';
import { PriorityItemComponent } from './priority-item/priority-item.component';


@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    PriorityItemComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

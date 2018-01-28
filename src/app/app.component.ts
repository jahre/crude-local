import { Component, OnInit, DoCheck } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataService]
})
export class AppComponent implements OnInit, DoCheck {
  title = 'app';
  sourcedata = {};
  constructor(private dataService: DataService){ }
  ngOnInit(){
    this.sourcedata = this.dataService.getItems(this.dataService.ignite());
  } 
  ngDoCheck(){
    //console.log('check was done');
    this.sourcedata = this.dataService.getItems(this.dataService.ignite());
  }
}

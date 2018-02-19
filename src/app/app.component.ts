import { Component, OnInit, DoCheck, HostListener, Renderer} from '@angular/core';
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
  constructor(private dataService: DataService){}

  // @HostListener('document:mousemove', ['$event'])
  // handleMouseUp(event: Event) {
  //   console.log(event)
  // }


  ngOnInit(){
    let ignitionArray = this.dataService.ignite();
    //this.sourcedata = this.dataService.getItems(ignitionArray);  
    this.sourcedata = ignitionArray;
    console.log('app component init');    
  } 
  ngDoCheck(){
    let ignitionArray = this.dataService.ignite();
    //this.sourcedata = this.dataService.getItems(ignitionArray);  
    this.sourcedata = ignitionArray;
  }

  testMove(){
    this.dataService.moveInsideAnother('item34_473', 'item35_708');
    //item32_153 - target
    //item33_487 - source
  }
}

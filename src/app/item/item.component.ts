import { Component, OnInit, Input, DoCheck, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, DoCheck {
  @Input() condition;
  @Input() object;
  @Input() info;
  @ViewChild('textarea') textarea: ElementRef;
  // objectInside = {
  //   text: 'Do Something',
  //   items: ['inner', 'inner2', 'inner3']
  // }
  sourcedata = {};
  constructor(private dataService: DataService) { }

  ngOnInit() {
    if(this.info.children){
      this.sourcedata = this.dataService.getItems(this.info.children);
    }
  }

  ngDoCheck(){
    if(this.info.children){
      this.sourcedata = this.dataService.getItems(this.info.children);
    }
  }

  getValue(id){
    this.dataService.updateTextValue(id, this.textarea.nativeElement.innerText)
    console.dir(this.textarea.nativeElement.innerText);
  }

}

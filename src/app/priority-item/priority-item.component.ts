import { Component, OnInit, DoCheck } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-priority-item',
  templateUrl: './priority-item.component.html',
  styleUrls: ['./priority-item.component.scss']
})
export class PriorityItemComponent implements OnInit, DoCheck {
  priority:any;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.priority = this.dataService.priority;
  }
  ngDoCheck(){
    this.priority = this.dataService.priority;
  }
  priorityDone(id, event){
    this.dataService.markDone(id, event);
    this.dataService.priority = null;
  }
  
}

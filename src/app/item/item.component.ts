import { Component, OnInit, Input, DoCheck, ViewChild, ElementRef, Renderer, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../data.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnInit, DoCheck{
  @Input() condition;
  @Input() object;
  @Input() currentId;
  @Input() parentId;
  @ViewChild('textarea') textarea: ElementRef;
  info;
  offset;
  sourcedata = {};

  constructor(private dataService: DataService, private renderer: Renderer, private zone: NgZone) {}

  ngOnInit() {
    this.info = this.dataService.allData[this.currentId];  
    if(this.info.children){
      this.sourcedata = this.info.children;
    }    
    //console.log('init');
  }

  ngDoCheck(){
    this.info = this.dataService.allData[this.currentId];  
    if(this.info.children){
      this.sourcedata = this.info.children;
    }
  }

  showTruth(id){
    console.log(this.dataService.allData[id]);
  }

  addInside(id, sourceId){
    
  }

  getValue(id){
    this.dataService.updateTextValue(id, this.textarea.nativeElement.innerText)
  }

  calculateReadiness(id){
    return this.dataService.calculateReadiness(id) * 100;
  }

  bindMouse(ev){
    this.mouseMove(ev);
  }

  countOffset(node){
    let result;
    if(node.offsetParent.className == "subItemContainer"){
      result = node.offsetTop + this.countOffset(node.offsetParent);
    }else{
      result = node.offsetTop;
    }
    return result;
  }

  mouseMove(event) {
    event.preventDefault();
    this.dataService.global.style.top = event.clientY - this.offset + window.pageYOffset + 5 + 'px';
  }
  
  

  onMouseDown(event: any, isCopy, immediateParent){
    this.dataService.global = event.target.closest('.item');   
    this.dataService.moveInfo.source = event.target.closest('.item').id;
    this.dataService.moveInfo.isCopy = isCopy;
    this.dataService.moveInfo.immediateParent = immediateParent;
     // console.log('mouse down', this.dataService.moveInfo);
    let newOffset = this.countOffset(this.dataService.global);
    this.offset = newOffset;
    this.zone.runOutsideAngular(() => {
      let trigger = this.bindMouse.bind(this);
      let glob = this.dataService.global;
      glob.classList.add("invisibleForMouse");//this if for the event not trigger on draggable item , which is under cursor at the moment
      document.addEventListener('mousemove', trigger);
      function clearEvents(){
        document.removeEventListener('mousemove', trigger);
        glob.style.top = '0px';
        glob.classList.remove("invisibleForMouse");
        document.removeEventListener('mouseup', clearEvents);
      };
      document.addEventListener('mouseup', clearEvents);
    });
  }

  onMouseUp(event: any, id, zone){
    event.stopPropagation();

    //this is for continue propagation of mouseUp to the document, but skipping other items reacting to the default mouseup
    let mEvent = document.createEvent("MouseEvent");
    mEvent.initMouseEvent("mouseup",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
    document.dispatchEvent(mEvent);
    if(zone == 'zone'){
      //console.log(id);
      if(id && this.dataService.moveInfo.source){
        this.dataService.moveBelowAnother(id, this.dataService.moveInfo.source);
      }
    }else{

      if(id && this.dataService.moveInfo.source){
        this.dataService.moveInsideAnother_extended(id, this.dataService.moveInfo.source, this.dataService.moveInfo.isCopy, this.dataService.moveInfo.immediateParent);
      }
    }


    this.zone.run(() => {
      // there will be handler for end of drag'n'drop
      // console.log(event.target, 'zone.run');
    });   
  }

  onMouseOver(event: any){
    //event.target.style.border = "1px solid red";
    event.target.classList.add("hovered")
    //console.log('over', event.target);
  }

  onMouseOut(event: any){
    //event.target.style.border = "1px solid red";
    event.target.classList.remove("hovered")
    //console.log('over', event.target);
  }
}

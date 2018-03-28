import { Component, OnInit, Input, DoCheck, ViewChild, ElementRef, Renderer, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../data.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnInit, DoCheck{
  @Input() condition;
  @Input() object;
  @Input() currentId;
  @Input() parentId;
  @ViewChild('textarea') textarea: ElementRef;
  @ViewChild('item') item: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('itemholder') itemholder: ElementRef;
  info;
  offset;
  sourcedata = {};
  itemHoverListener;
  third:number;  

  constructor(private dataService: DataService, private renderer: Renderer, private zone: NgZone) {}

  ngOnInit() {
    this.info = this.dataService.allData[this.currentId];  
    if(this.info.children){
      this.sourcedata = this.info.children;
    }    
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
    this.dataService.global.style.top = event.clientY - this.offset + window.pageYOffset - 15 + 'px';
  }
  
  

  onMouseDown(event: any, immediateParent){
    let isCopy = event.altKey;
    this.dataService.global = event.target.closest('.zoneContainer');   
    this.dataService.moveInfo.source = event.target.closest('.item').id;
    this.dataService.moveInfo.isCopy = isCopy;
    this.dataService.moveInfo.immediateParent = immediateParent;
  
    let newOffset = this.countOffset(this.dataService.global);
    this.offset = newOffset;
    this.zone.runOutsideAngular(() => {
      let trigger = this.bindMouse.bind(this);
      let glob = this.dataService.global;
      let dataService = this.dataService;
      glob.classList.add("invisibleForMouse");//this if for the event not trigger on draggable item , which is under cursor at the moment
      document.addEventListener('mousemove', trigger);
      function clearEvents(){
        document.removeEventListener('mousemove', trigger);
        glob.style.top = '0px';
        glob.classList.remove("invisibleForMouse");
        document.removeEventListener('mouseup', clearEvents);
        dataService.moveInfo = {};//cleaning up condition for onMouseOverMove and others
      };
      document.addEventListener('mouseup', clearEvents);
    });


  }

  onMouseUp(event: any, id){
    event.stopPropagation();
    
    
    if(id && this.dataService.moveInfo.source && !(id == this.dataService.moveInfo.source)){
      if(this.third < 0.33){
        this.dataService.moveBelowAnother_extended(id, this.dataService.moveInfo.source, this.dataService.moveInfo.isCopy, this.dataService.moveInfo.immediateParent, this.third);
      }else if(this.third > 0.66){
        this.dataService.moveBelowAnother_extended(id, this.dataService.moveInfo.source, this.dataService.moveInfo.isCopy, this.dataService.moveInfo.immediateParent, this.third);

      }else{
        if(id && this.dataService.moveInfo.source){
          this.dataService.moveInsideAnother_extended(id, this.dataService.moveInfo.source, this.dataService.moveInfo.isCopy, this.dataService.moveInfo.immediateParent);
        }

      }
      this.closeMenu();
    }else if(id == this.dataService.moveInfo.source){
      if(this.item.nativeElement.classList.contains('isOpen')){
        this.closeMenu();
      }else{
        this.contextMenu(event);
      }
    }


    //this is for continue propagation of mouseUp to the document, but skipping other items reacting to the default mouseup
    let mEvent = document.createEvent("MouseEvent");
    mEvent.initMouseEvent("mouseup",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
    document.dispatchEvent(mEvent);

    this.zone.run(() => {
      // there will be handler for end of drag'n'drop
      // console.log(event.target, 'zone.run');
    });   

  }

  onMouseOver(event: any){
    if(this.dataService.moveInfo.source){
      event.currentTarget.classList.add("hovered");
    }
    
  }

  onMouseOverMove(event: any){

    
    if(this.dataService.moveInfo.source){
      let item = event.currentTarget;
      let y = event.pageY - this.countOffset(item); 
      this.third = y / item.clientHeight;
      if(this.third < 0.33){

        //remove later!
        event.currentTarget.classList.remove("one-third");
        event.currentTarget.classList.remove("three-third");
        event.currentTarget.classList.remove("two-third");

        item.classList.add("one-third");
      }else if(this.third > 0.66){

         //remove later!
         event.currentTarget.classList.remove("one-third");
         event.currentTarget.classList.remove("three-third");
         event.currentTarget.classList.remove("two-third");

        item.classList.add("three-third");
      }else{

         //remove later!
         event.currentTarget.classList.remove("one-third");
         event.currentTarget.classList.remove("three-third");
         event.currentTarget.classList.remove("two-third");

        item.classList.add("two-third");
      }
    }

  }

  onMouseOut(event: any){
    event.currentTarget.classList.remove("hovered");
    event.currentTarget.classList.remove("one-third");
    event.currentTarget.classList.remove("three-third");
    event.currentTarget.classList.remove("two-third");
  }

  contextMenu(event:any){
    let allContextMenus = document.getElementsByClassName('isOpen');
    for(let i=0; i<allContextMenus.length; i++){
      let menu:any = allContextMenus[i];
      menu.classList.remove("isOpen");
    }
    this.item.nativeElement.classList.add("isOpen");
  }
  addBelow(id, $event){
    this.dataService.addBelow(id, $event);
    this.closeMenu();
  }
  removeItem(id, parentId, $event){
    this.dataService.removeItem(id, parentId, $event);
    this.closeMenu();
  }
  setPriorityItem(id, $event){
    this.dataService.setPriorityItem(id, $event);
    this.closeMenu();
  }
  markDone(id, $event){
    this.dataService.markDone(id, $event);
    this.closeMenu();
  }
  closeMenu(){
    this.item.nativeElement.classList.remove("isOpen");
  }
  
}

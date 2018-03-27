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
    //console.clear();
    event.preventDefault();
    this.dataService.global.style.top = event.clientY - this.offset + window.pageYOffset + 5 + 'px';
    //console.log('this.dataService.global.style.top', this.dataService.global.style.top);
    //console.log('params', event.clientY, this.offset, window.pageYOffset);
  }
  
  

  onMouseDown(event: any, isCopy, immediateParent){
    this.dataService.global = event.target.closest('.zoneContainer');   
    this.dataService.moveInfo.source = event.target.closest('.item').id;
    this.dataService.moveInfo.isCopy = isCopy;
    this.dataService.moveInfo.immediateParent = immediateParent;
    
  
     // console.log('mouse down', this.dataService.moveInfo);
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

  onMouseUp(event: any, id, zone){
    event.stopPropagation();
    


    // if(zone == 'zone'){

    //   if(id && this.dataService.moveInfo.source){
    //     this.dataService.moveBelowAnother(id, this.dataService.moveInfo.source);
    //   }
    // }else{

    //   if(id && this.dataService.moveInfo.source){
    //     this.dataService.moveInsideAnother_extended(id, this.dataService.moveInfo.source, this.dataService.moveInfo.isCopy, this.dataService.moveInfo.immediateParent);
    //   }
    // }
    if(id && this.dataService.moveInfo.source){

      if(this.third < 0.33){
        console.log(this.third, '1/3');
        this.dataService.moveBelowAnother_extended(id, this.dataService.moveInfo.source, this.dataService.moveInfo.isCopy, this.dataService.moveInfo.immediateParent, this.third);
      }else if(this.third > 0.66){
        console.log(this.third, '3/3');
        this.dataService.moveBelowAnother_extended(id, this.dataService.moveInfo.source, this.dataService.moveInfo.isCopy, this.dataService.moveInfo.immediateParent, this.third);

      }else{
        console.log(this.third, '2/3');
        if(id && this.dataService.moveInfo.source){
          this.dataService.moveInsideAnother_extended(id, this.dataService.moveInfo.source, this.dataService.moveInfo.isCopy, this.dataService.moveInfo.immediateParent);
        }

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

    //this.itemHoverListener();
  }

  onMouseOver(event: any){
    //event.target.style.border = "1px solid red";
    //event.target.classList.add("hovered")
    //let func = this.onMouseOverMove.bind(this);
    //console.log('this.itemholder.nativeElement', this.itemholder.nativeElement.id);
    //this.itemHoverListener = this.renderer.listen(this.itemholder.nativeElement, 'mousemove', func);
    if(this.dataService.moveInfo.source){
      event.currentTarget.classList.add("hovered");
    }
    
  }

  onMouseOverMove(event: any){

    
    if(this.dataService.moveInfo.source){
      //console.clear();
      let item = event.currentTarget;
      //let x = event.pageX - item.offsetLeft; 
      let y = event.pageY - this.countOffset(item); 
      this.third = y / item.clientHeight;
      if(this.third < 0.33){
        //console.log(this.third, '1/3');

        //remove later!
        event.currentTarget.classList.remove("one-third");
        event.currentTarget.classList.remove("three-third");
        event.currentTarget.classList.remove("two-third");

        item.classList.add("one-third");
      }else if(this.third > 0.66){
        //console.log(this.third, '3/3');

         //remove later!
         event.currentTarget.classList.remove("one-third");
         event.currentTarget.classList.remove("three-third");
         event.currentTarget.classList.remove("two-third");

        item.classList.add("three-third");
      }else{
        //console.log(this.third, '2/3');

         //remove later!
         event.currentTarget.classList.remove("one-third");
         event.currentTarget.classList.remove("three-third");
         event.currentTarget.classList.remove("two-third");

        item.classList.add("two-third");
      }

      //console.log('item params', y, item.clientHeight);
      //console.dir(item);
    }

  }

  onMouseOut(event: any){
    event.currentTarget.classList.remove("hovered");
    event.currentTarget.classList.remove("one-third");
    event.currentTarget.classList.remove("three-third");
    event.currentTarget.classList.remove("two-third");
    //event.target.style.border = "1px solid red";
    //event.target.classList.remove("hovered");
    //this.itemHoverListener;
    //console.log('over', event.target);
  }
}

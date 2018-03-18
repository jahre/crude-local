import { NgZone as zone} from '@angular/core';
export class DataService {
    //constructor(private zone: NgZone) {}
    //counter:number = 0;
    allData:any = {};
    priority:any;
    global:any;
    moveInfo: any = {};
    // allData:any = {
    //     item0: {
    //         id: 'item0',
    //         children: ['item1', 'item2']
    //     },
    //     item1: {
    //         id: 'item1',
    //         text: 'Do Something',
    //         children: ['item3'],
    //         parent: 'item0'
    //     },
    //     item2: {
    //         id: 'item2',
    //         text: 'Do Something',
    //         children: [],
    //         parent: 'item0'
    //     },
    //     item3: {
    //         id: 'item3',
    //         text: 'Do Something',
    //         children: [],
    //         parent: 'item1'
    //     }
    // };

    getDataLength(){
        return Object.keys(this.allData).length;
    }

    init(){
        let ls = window.localStorage;
        var re = /^item/;
        for(let item in ls){
            if(item.match(re)){
                this.allData[item] = JSON.parse(ls[item]);
            }
            
        }
      
        //if localstorage is empty - initialize the root element
        if(this.getDataLength() == 0){

            this.allData['item0'] = {
                id: 'item0',
                children: []
            }
            //this.createItem('item0', null); this won't work because of parent
            localStorage.setItem('item0', JSON.stringify(this.allData['item0']));

        }
    }

    updateTextValue(id, text){
        this.allData[id].text = text;
        localStorage.setItem(id, JSON.stringify(this.allData[id]));
    }

    createItem(id, parentId){
        
        let namedId = 'item' + id + '_' + Math.floor(Math.random() * 10000);
        let newItem = {
            id: namedId,
            text: namedId,
            children: [],
            parent: [parentId]
        }
        this.allData[namedId] = newItem;
        this.allData[parentId].children.push(namedId);
        
        localStorage.setItem(namedId, JSON.stringify(this.allData[namedId]));
        localStorage.setItem(parentId, JSON.stringify(this.allData[parentId]));        
    }
    addToRoot(){
        this.createItem(this.getDataLength(), 'item0');
    }

    addBelow(id){
        this.createItem(this.getDataLength(), id);
    }  

    moveInsideAnother(targetId, sourceId, isCopy){
        let sourceParent =  this.allData[sourceId].parent;
        let targetParent =  this.allData[targetId].parent;
        if(!(targetParent == sourceId)){
            let parentIndex = this.allData[sourceParent].children.indexOf(sourceId);
            if (parentIndex !== -1) {
                this.allData[sourceParent].children.splice(parentIndex, 1);
            }

            this.allData[sourceId].parent = targetId;
            this.allData[targetId].children.push(sourceId);
            localStorage.setItem(sourceParent, JSON.stringify(this.allData[sourceParent]));
            localStorage.setItem(sourceId, JSON.stringify(this.allData[sourceId]));
            localStorage.setItem(targetId, JSON.stringify(this.allData[targetId]));     
        }
        this.moveInfo = {};           
    }  

    moveInsideAnother_extended(targetId:string, sourceId:string, isCopy, immediateParent){
        let sourceParent =  this.allData[sourceId].parent;
        let targetParent =  this.allData[targetId].parent;
        let isElemExistsAlready = this.allData[targetId].children.indexOf(sourceId) > -1;

        if(isCopy){
            //make conditions as separate variables, as isElemExistsAlready
            if(!(targetId == sourceParent) && !(sourceId == targetId) && !(sourceParent == targetParent) && !isElemExistsAlready){
                this.allData[sourceId].parent.push(targetId);
                this.allData[targetId].children.push(sourceId);
            }
        }else{
            //remove Source from its parent
            let elemIndex = this.allData[immediateParent].children.indexOf(sourceId);
            if (elemIndex !== -1) {
                this.allData[immediateParent].children.splice(elemIndex, 1);
            }
            //remove old parent form Source
            let parentIndex = this.allData[sourceId].parent.indexOf(immediateParent);
            if (parentIndex !== -1) {
                this.allData[sourceId].parent.splice(parentIndex, 1);
            }
            //add Target as a new parent to Source
            this.allData[sourceId].parent.push(targetId);
            //add SourceId to children of Target
            this.allData[targetId].children.push(sourceId);
        }
        localStorage.setItem(immediateParent, JSON.stringify(this.allData[immediateParent]));
        localStorage.setItem(sourceId, JSON.stringify(this.allData[sourceId]));
        localStorage.setItem(targetId, JSON.stringify(this.allData[targetId]));     
        this.moveInfo = {};           
    }

    moveBelowAnother(targetId, sourceId){
        let sourceParent =  this.allData[sourceId].parent;
        let targetParent =  this.allData[targetId].parent;

        let parentIndex = this.allData[sourceParent].children.indexOf(sourceId);
        let parentIndex2;
        for(let i = 0; i < this.allData[sourceParent].children.length; i++){

            if(this.allData[sourceParent].children[i] == sourceId){
                parentIndex2 = i;
            }

        }
        let targetIndex = this.allData[targetParent].children.indexOf(targetId);

        if (parentIndex !== -1) {
            this.allData[sourceParent].children.splice(parentIndex, 1);
        }

        this.allData[targetParent].children.splice(targetIndex + 1, 0, sourceId);
        this.allData[sourceId].parent = this.allData[targetId].parent;

        localStorage.setItem(sourceParent, JSON.stringify(this.allData[sourceParent]));
        localStorage.setItem(targetParent, JSON.stringify(this.allData[targetParent]));
        localStorage.setItem(sourceId, JSON.stringify(this.allData[sourceId]));
        localStorage.setItem(targetId, JSON.stringify(this.allData[targetId]));   

        this.moveInfo = {};
        console.log('moveBelowAnother fired')
    }

    ignite(){
        this.init();
        return this.allData['item0'].children;        
    }

    getItems(items: string[]){
        let array = [];
        for(let i=0; i< items.length; i++){
            array.push(this.allData[items[i]]);
        }
        return array;
    }

    removeItem(id: string, immediateParentId: string){
        let parentIds = this.allData[id].parent;
        
        if(parentIds.length > 1){
            let elemIndex = this.allData[immediateParentId].children.indexOf(id);
            if (elemIndex !== -1) {
                console.log('elem index in parent', this.allData[immediateParentId].children, id, elemIndex);
                this.allData[immediateParentId].children.splice(elemIndex, 1);
            }
            let parentIndex = this.allData[id].parent.indexOf(immediateParentId);
            if (parentIndex !== -1) {
                console.log('parent index in elem', this.allData[id].parent, immediateParentId, parentIndex);
                this.allData[id].parent.splice(parentIndex, 1);
            }
            localStorage.setItem(immediateParentId, JSON.stringify(this.allData[immediateParentId]));
            localStorage.setItem(id, JSON.stringify(this.allData[id]));
            return;
        }
        let allParentItems = [];
        for(let parentId of parentIds){
            //this.allData[id] = null;
            let parentIndex = this.allData[parentId].children.indexOf(id);
            if (parentIndex !== -1) {
                this.allData[parentId].children.splice(parentIndex, 1);
            }
            console.log('this.allData[parentId]',this.allData[parentId]);
            //allParentItems.push(parentId);
            localStorage.setItem(parentId, JSON.stringify(this.allData[parentId]));
        }
        // zone.runOutsideAngular(() => {
        //     for(let parentId of allParentItems){
        //         localStorage.setItem(parentId, JSON.stringify(this.allData[parentId]));
        //     }
        // });

        localStorage.removeItem(id);
    }

    markDone(id, deep=false){
        this.allData[id].isDone = !this.allData[id].isDone;
        localStorage.setItem(id, JSON.stringify(this.allData[id]));
    }

    setPriorityItem(id:string){
        this.priority = this.allData[id];
        this.priority.children = [];
    }

    toggleExpand(id){
        this.allData[id].isCollapsed = !this.allData[id].isCollapsed;
        localStorage.setItem(id, JSON.stringify(this.allData[id]));
    }

    calculateReadiness(id){
        let doneChildren;
        if(this.allData[id].children.length) {   
            doneChildren = 0;
        }else {
            return;
        }
        
        for(let i=0; i<this.allData[id].children.length; i++){
            let childId = this.allData[id].children[i]
            if(this.allData[childId].isDone == true ){
                doneChildren++
            }
            
            if(this.allData[childId].children.length > 0 && !(this.allData[childId].isDone == true)){
                doneChildren += this.calculateReadiness(childId);
            }
        }
        if(this.allData[id].children.length){
            if(doneChildren /  this.allData[id].children.length === 1){
                this.allData[id].isDone = true;
            }else if(this.allData[id].isDone == true){
                this.allData[id].isDone = false;
            }
        }
        return doneChildren /  this.allData[id].children.length;
    }
}
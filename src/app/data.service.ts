export class DataService {
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
            parent: parentId
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

    moveInsideAnother(targetId, sourceId){
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
        console.log('moveInsideAnother fired');
           
    }  

    moveBelowAnother(targetId, sourceId){
        let sourceParent =  this.allData[sourceId].parent;
        let targetParent =  this.allData[targetId].parent;
        //console.log(1,'source', sourceId);
        //console.log(2,'this.allData[sourceParent]', this.allData[sourceParent]);
        let parentIndex = this.allData[sourceParent].children.indexOf(sourceId);
        let parentIndex2;
        for(let i = 0; i < this.allData[sourceParent].children.length; i++){
            //console.log(3,'length', this.allData[sourceParent].children.length);
            //console.log(4,this.allData[sourceParent].children[i]);
            if(this.allData[sourceParent].children[i] == sourceId){
                parentIndex2 = i;
            }
            //console.log(5,parentIndex2, sourceId);
        }
        let targetIndex = this.allData[targetParent].children.indexOf(targetId);
        
        //console.log(6,'original', parentIndex);
        //console.log(this.allData[sourceParent]);
        if (parentIndex !== -1) {
            this.allData[sourceParent].children.splice(parentIndex, 1);
            //console.log(7,this.allData[sourceParent]);
        }

        this.allData[targetParent].children.splice(targetIndex + 1, 0, sourceId);
        this.allData[sourceId].parent = this.allData[targetId].parent;
        // if(this.allData[targetId].children){
        //     this.allData[targetId].children
        // }

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

    removeItem(id: string){    
        let parentId = this.allData[id].parent;
        this.allData[id] = null;
        let parentIndex = this.allData[parentId].children.indexOf(id);
        if (parentIndex !== -1) {
            this.allData[parentId].children.splice(parentIndex, 1);
        }
        localStorage.removeItem(id);
        localStorage.setItem(parentId, JSON.stringify(this.allData[parentId]));
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
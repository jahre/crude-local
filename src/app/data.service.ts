export class DataService {
    //counter:number = 0;
    allData:any = {};
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
      //console.log('init is called');

        for(let i=0; i < window.localStorage.length; i++){
            let item = localStorage.getItem('item' + i);
            if(item){
                this.allData['item' + i] = JSON.parse(item);
                //console.log('item ' + i + ' was taken form localstorage')
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
        // let localitem0 = JSON.parse(localStorage.getItem('item0'));
        // let newitem0 = {
        //     id: 'item0',
        //     children: [],
        //     totalCount: 0
        // };

        // if(localitem0){
        //   //console.log('item0 is taken from localstorage');
        //   //console.log(localitem0);
        //     //this.allData[0] = localitem0;
        //     //this.counter = localitem0.totalCount;
        // }else {
        //     // this.allData.push(newitem0);
        //     // localStorage.setItem('item0', JSON.stringify(newitem0));
        // }
        // this.allData.push(newitem0);
        // this.counter = this.allData[0].totalCount;
        // localStorage.setItem('item0', JSON.stringify(newitem0));
      //console.log(this.allData);
    }

    updateTextValue(id, text){
        this.allData[id].text = text;
        localStorage.setItem(id, JSON.stringify(this.allData[id]));
    }

    createItem(id, parentId){
        
        let namedId = 'item' + id;
        let newItem = {
            id: namedId,
            text: 'child of ' + parentId,
            children: [],
            parent: parentId
        }
        this.allData[namedId] = newItem;
        this.allData[parentId].children.push(namedId);
        
        localStorage.setItem(namedId, JSON.stringify(this.allData[namedId]));
        localStorage.setItem(parentId, JSON.stringify(this.allData[parentId]));        
    }
    addToRoot(){
      //console.log(this.counter)
        // let counter = this.counter;
        // let item0 = this.getItem('item0');
        // let localitem0 = JSON.parse(localStorage.getItem('item0'));
        this.createItem(this.getDataLength(), 'item0');

        // function findFirstLargeNumber(element) {
        //     return element == counter;
        // };
        // let isExists = item0.children.findIndex(findFirstLargeNumber);
      //console.log(isExists < 0)
        // if(isExists < 0){
        //   //console.log('item0 was pushed' + this.counter);
        //     item0.children.push(this.counter);
        //     localitem0.children.push(this.counter);
        // }
        // localStorage.setItem('item0', JSON.stringify(item0));
        //this.counter++;
    }
    addBelow(id){
        this.createItem(this.getDataLength(), id);
        // let item = this.getItem(id);
        // if(!item.children){
        //     item.children = [];
        // }
        //item.children.push(this.counter);

       // this.counter++;
    }  

    ignite(){
        // if(!this.allData.length){
        //     this.init();
        // }
        //return this.allData.[find((item)=>item.id == 'item0')].children;
        this.init();
        console.log(this.getDataLength())
        return this.allData['item0'].children;
    }

    getItems(items: [string]){
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

    markDone(id){
        this.allData[id].isDone = !this.allData[id].isDone;
        console.log(this.allData[id]);
        localStorage.setItem(id, JSON.stringify(this.allData[id]));
    }
}
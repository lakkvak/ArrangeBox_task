import  ListElement  from "./ListElement.js"
import Control from "./Control.js"
import Buttons from "./Buttons.js"
export default class ArrangeBox{
    
    #availableControl
    #selectedControl
    #mainCont
    #boxCont
    #selectedList
    #availableList
    constructor() {
        
        this.#selectedList = []
       
        this.#availableList = this.#fillRandList(7,15)
        this.#createField()
        this.#availableControl = new Control([...this.#availableList], 'available', this.#boxCont)
        this.#addButtons()
        this.#selectedControl = new Control([...this.#selectedList], 'select', this.#boxCont)
        
        
    }
    #fillRandList(min, max) {
        const list=[]
        const count = Math.round(min + Math.random() * (max + 1 - min))        
        for (let i = 0; i <count; i++) {           
            const chrs = 'abdehkmnpswxzABDEFGHKMNPQRSTWXZ';
            let str = '';
            for (let i = 0; i < 7; i++) {
                let pos = Math.floor(Math.random() * chrs.length);
                str += chrs.substring(pos,pos+1);
            }           
            let price= Math.round(100 + Math.random() * (300 + 1 - 100))
            list.push(new ListElement(str, price, i))           
        }
        
        return list
    }
    #createField() {
        this.#mainCont = document.querySelector('.cont')
        this.#boxCont = document.createElement('div')
        this.#boxCont.classList.add('cont-box')
        this.#mainCont.append(this.#boxCont)
        
    }
    #addButtons() {
        const buttons = [
            {
                hexCode: 0x2039,
                func: this.#moveLeft.bind(this)
            },
            {
                hexCode: 0x203A,
                func: this.#moveRight.bind(this)
            },
            {
                hexCode: 0xab,
                func: this.#moveAllLeft.bind(this)
            },
            {
                hexCode: 0xbb,
                func: this.#moveAllRight.bind(this)
            },
            {
                hexCode: 0x21ba,
                func: this.reset.bind(this)
            }
        ]
           
        const allB = new Buttons(buttons)
         this.#boxCont.append(allB.allButtons)
    }

    #moveRight() {
        const selectedItems = this.#availableControl.getSelectedList()
        this.#selectedControl.addElementList(selectedItems)      
    }
    #moveAllRight() {      
        const allSearched = this.#availableControl.getSearchedList()
        this.#selectedControl.addElementList(allSearched)
    }
    #moveLeft() {
        const selectedItems = this.#selectedControl.getSelectedList()
        this.#availableControl.addElementList(selectedItems)
    }
    #moveAllLeft() {
        const allSearched = this.#selectedControl.getSearchedList()
        this.#availableControl.addElementList(allSearched)
    }

    setAvailableList(list) {
        this.#availableControl.setNewList([...list])
        this.#selectedControl.setNewList([])
    }
    setSelectedItems(...selectedItemsID) {
        this.#availableControl.selectedElements = selectedItemsID
        this.#moveRight()
        
    }
    reset() {        
        this.#availableControl.setNewList([...this.#availableList])
        this.#selectedControl.setNewList([...this.#selectedList])
    }
   
    getCurrentValues() {
        const result = {
            'available': this.#availableControl.currentValues,
            'selected': this.#selectedControl.currentValues
        }
        console.log(result)
        return JSON.stringify(result)
    }

}
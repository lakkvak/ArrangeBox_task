import Buttons from "./Buttons.js"

export default class Control{
    #controlDiv
    #mainDiv
    #nameControl
    #searchInput
    #fieldList
    #searchedList
    #visibleList
    #selectedItems 
    #state
    #listElements
    constructor(listEl, state, commonDiv) {
        this.commonDiv = commonDiv
        this.#state = state
        this.#listElements = [...listEl]
        this.#searchedList = [...listEl]
        
        this.#selectedItems = new Set()
        this.#visibleList = new Set()
        this.#createMain()
        this.#addEvent()
    }
    #createMain() {
        this.#controlDiv = document.createElement('div')
        this.#controlDiv.classList.add('control-cont', this.#state)
        this.#mainDiv = document.createElement('div');
        this.#nameControl = document.createElement('div')
        this.#nameControl.classList.add('title')
        const searchCont = document.createElement('div')
        searchCont.classList.add('input-cont')
        this.#searchInput = document.createElement('input')
        searchCont.append(this.#searchInput);

        this.#fieldList = document.createElement('ul')
        this.#render(this.#listElements)
        this.#mainDiv.append(this.#nameControl,searchCont,this.#fieldList)
        this.#mainDiv.classList.add('main-cont')
        this.#addButtons()
        this.#controlDiv.append(this.#mainDiv)
        if (this.#state == 'select')           
            this.#nameControl.innerText = 'Selected'
        
        else            
            this.#nameControl.innerText = 'Available'
        
        this.commonDiv.append( this.#controlDiv )

    }
   #addEvent() {
       this.#searchInput.addEventListener('input', e => this.#search()) // element search      
                       
       this.#fieldList.addEventListener('click', e => {   //selecting element and remembering           
           let currentEl = e.target.closest('.li-cont');            
           if (currentEl) {
            this.#selectedItems.add(+currentEl.dataset.id)            
               if(!e.ctrlKey) 
               {
                   this.#selectedItems.forEach(el => {
                       const notSelected =  this.#fieldList.querySelector(`.${this.#state} [data-id="${el}"]`).classList.remove('selected')
                   })
                   this.#selectedItems.clear()
                  
               }
               this.#selectedItems.add(+currentEl.dataset.id)
                currentEl.classList.add('selected')
                
           }
       })
       
    }
    #search() {
        let serchValue = this.#searchInput.value.trim();
        if (serchValue == '') {                         
            this.#searchedList = [...this.#listElements]
             for (const value of this.#fieldList.children)                    
                value.classList.remove('hiden') 
            this.#visibleList.clear()
        }
        else {
            let reg = new RegExp(serchValue, 'i')
            this.#searchedList = this.#listElements.filter((el, i) => {
                const hideElement =  this.#fieldList.querySelector(`.${this.#state} [data-id="${el.id}"]`).parentElement
                const idElement = + this.#fieldList.querySelector(`.${this.#state} [data-id="${el.id}"]`).dataset.id
                
                if (reg.test(el.title))
                {
                    if (hideElement.classList.contains('hiden') == true) {
                        hideElement.classList.toggle('hiden')
                        this.#visibleList.delete(idElement)                        
                    }
                    return true
                 }
                else {                                           
                    hideElement.classList.add('hiden')
                    this.#visibleList.add(idElement)                   
                }
                return false
            })           
        }           
   }
    #addButtons() { // creating all buttons
    
        const buttons = [
            {
                hexCode: 0x2191,
                func: this.#moveUp.bind(this)
            },
            {
                hexCode: 0x21c8,
                func: this.#moveUpAll.bind(this)
            },
            {
                hexCode: 0x21cA,
                func: this.#moveDownAll.bind(this)
            },
            {
                hexCode: 0x2193,
                func: this.#moveDown.bind(this)
            }
        ]
           
        const allB = new Buttons(buttons)
        this.#controlDiv.append(allB.allButtons)

    }
    #getSortedId(option) {
        const sortSelectedItems = Array.from(this.#selectedItems)
        sortSelectedItems.sort((a, b) => {
                switch (option) {
                    case 'inc':
                        return this.#listElements.findIndex((listEl) => listEl.id == a) - this.#listElements.findIndex((listEl) => listEl.id == b)
                    case 'dec':
                        return this.#listElements.findIndex((listEl) => listEl.id == b) - this.#listElements.findIndex((listEl) => listEl.id == a)
                    default:
                        break;
                }
            })
        return sortSelectedItems
    }
    #moveUp() {
        
        if (this.#selectedItems.size != 0)
        {
           const sortSelectedItems = this.#getSortedId('inc')
            let hasChange = false
            sortSelectedItems.forEach(el => {
               
                let indexFrom = this.#listElements.findIndex((listEl) => listEl.id == el)
                
                const isHiden = this.#visibleList.has(el)
                if (indexFrom != 0 && !isHiden) {
                    for (let i = indexFrom - 1; i >= 0; i--) {
                        console.log(i)
                        if (!this.#visibleList.has(this.#listElements[i].id)) {
                            this.#listElements.splice(i, 0, this.#listElements.splice(indexFrom, 1)[0])
                            hasChange = true;
                            break
                        }
                    }
                                      
                }
             
            })
            console.log(this.#listElements)
            if(hasChange)
                this.#render(this.#listElements)
        }
    }
    #moveUpAll() {
        if (this.#selectedItems.size != 0) {
            const sortSelectedItems = this.#getSortedId('dec')
            let hasChange = false
            sortSelectedItems.forEach(el => {
               
                let indexFrom = this.#listElements.findIndex((listEl) => listEl.id == el)
                
                  const isHiden = this.#visibleList.has(el)
                if (indexFrom != 0 && !isHiden) {
                    hasChange = true;
                    this.#listElements.unshift(this.#listElements.splice(indexFrom, 1)[0])
                }
             
            })
            if(hasChange)
                this.#render(this.#listElements)
        }
    }
    #moveDown() {
        if (this.#selectedItems.size != 0)
        {
            const sortSelectedItems = this.#getSortedId('dec')
            let hasChange = false
            sortSelectedItems.forEach(el => {
               
                let indexFrom = this.#listElements.findIndex((listEl) => listEl.id == el)

                const isHiden = this.#visibleList.has(el)
                if (indexFrom != this.#listElements.length && !isHiden) {
                    for (let i = indexFrom +1; i < this.#listElements.length; i++) {
                        
                        if (!this.#visibleList.has(this.#listElements[i].id)) {
                            this.#listElements.splice(i, 0, this.#listElements.splice(indexFrom, 1)[0])
                            hasChange = true;
                            break
                        }
                    }
                }
             
            })
            
            if(hasChange)
                this.#render(this.#listElements)
        }
    }
    #moveDownAll() {
        if (this.#selectedItems.size != 0) {
            const sortSelectedItems = this.#getSortedId('inc')
            let hasChange = false
            sortSelectedItems.forEach(el => {
               
                let indexFrom = this.#listElements.findIndex((listEl) => listEl.id == el)
                const isHiden = this.#visibleList.has(el)

                if (indexFrom != this.#listElements.length-1 && !isHiden) {
                    this.#listElements.push(this.#listElements.splice(indexFrom, 1)[0])
                    hasChange = true;
                }             
            })
            if(hasChange)
                this.#render(this.#listElements)
        }
    }
    #render(list) { 
        
        
        this.#fieldList.innerHTML = ''
        
        list.forEach((element,i) => {
            const tmpLi = document.createElement('li')
            
            if (this.#visibleList.has(element.id))
                tmpLi.classList.add("hiden")
            tmpLi.innerHTML = `<div class="li-cont ${(this.#selectedItems.has(element.id)?"selected ":"")}" data-id="${element.id}"><div class="li-title">${element.title}</div><div class="li-price">$${element.price}</div></div>`
            this.#fieldList.append(tmpLi)
        }); 
    }
    getSelectedList() {//removes selected elements and return 
        let passedList=[]
        const newList = []
     
        if (this.#selectedItems.size != 0) {
            
            passedList = this.#listElements.filter((el) => {
                
                if (this.#selectedItems.has(el.id))
                    return true
                newList.push(el)
                return false           
            })
            this.#selectedItems.clear()
            this.#listElements = newList
            this.#searchedList = [...newList]
            this.#render(this.#listElements)
        }
        return passedList
    }
    getSearchedList() {//removes searched elements and return 
        
        this.#selectedItems.clear()
        this.#searchedList.forEach(el => {
            let deleteIndex = this.#listElements.findIndex((listEl) => listEl.id == el.id)
            this.#listElements.splice(deleteIndex, 1)
        })
        this.#render(this.#listElements)
        const passedList = [...this.#searchedList]
        this.#search()
        return passedList
    }
     addElementList(list) { //adds new elements in list
        
        this.#listElements.push(...list)
        
        this.#render(this.#listElements)
        this.#search()
    }
    setNewList(list) { //recreates list
        this.#selectedItems.clear()
        this.#listElements = list
        this.#render(this.#listElements)
        this.#search()
    }
    set selectedElements(idElements) { //replaces selected elements
        this.#selectedItems = new Set(idElements)
    }
    get currentValues() {

        return  [...this.#listElements]
    }
}

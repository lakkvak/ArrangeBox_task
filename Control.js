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
    constructor(listEl, state, commonDiv) {
        this.commonDiv = commonDiv
        this.#state = state
        this.listElement = [...listEl]
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
        this.#render(this.listElement)
        this.#mainDiv.append(this.#nameControl,searchCont,this.#fieldList)
        this.#mainDiv.classList.add('main-cont')
        
        if (this.#state == 'select') {
           
            this.#controlDiv.append(this.#mainDiv)
            this.#addButtons()
            this.#nameControl.innerText = 'Selected'
        }
        else {
            this.#addButtons()
            this.#controlDiv.append(this.#mainDiv)
            this.#nameControl.innerText = 'Available'
        }
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
            this.#searchedList = [...this.listElement]
             for (const value of this.#fieldList.children)                    
                value.classList.remove('hiden') 
            this.#visibleList.clear()
        }
        else {
            let reg = new RegExp(serchValue, 'i')
            this.#searchedList = this.listElement.filter((el, i) => {
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
                        return this.listElement.findIndex((listEl) => listEl.id == a) - this.listElement.findIndex((listEl) => listEl.id == b)
                    case 'dec':
                        return this.listElement.findIndex((listEl) => listEl.id == b) - this.listElement.findIndex((listEl) => listEl.id == a)
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
               
                let indexFrom = this.listElement.findIndex((listEl) => listEl.id == el)
                
                const isHiden = this.#visibleList.has(el)
                if (indexFrom != 0 && !isHiden) {
                    for (let i = indexFrom - 1; i >= 0; i--) {
                        console.log(i)
                        if (!this.#visibleList.has(this.listElement[i].id)) {
                            this.listElement.splice(i, 0, this.listElement.splice(indexFrom, 1)[0])
                            hasChange = true;
                            break
                        }
                    }
                                      
                }
             
            })
            console.log(this.listElement)
            if(hasChange)
                this.#render(this.listElement)
        }
    }
    #moveUpAll() {
        if (this.#selectedItems.size != 0) {
            const sortSelectedItems = this.#getSortedId('dec')
            let hasChange = false
            sortSelectedItems.forEach(el => {
               
                let indexFrom = this.listElement.findIndex((listEl) => listEl.id == el)
                
                  const isHiden = this.#visibleList.has(el)
                if (indexFrom != 0 && !isHiden) {
                    hasChange = true;
                    this.listElement.unshift(this.listElement.splice(indexFrom, 1)[0])
                }
             
            })
            if(hasChange)
                this.#render(this.listElement)
        }
    }
    #moveDown() {
        if (this.#selectedItems.size != 0)
        {
            const sortSelectedItems = this.#getSortedId('dec')
            let hasChange = false
            sortSelectedItems.forEach(el => {
               
                let indexFrom = this.listElement.findIndex((listEl) => listEl.id == el)

                const isHiden = this.#visibleList.has(el)
                if (indexFrom != this.listElement.length && !isHiden) {
                    for (let i = indexFrom +1; i < this.listElement.length; i++) {
                        
                        if (!this.#visibleList.has(this.listElement[i].id)) {
                            this.listElement.splice(i, 0, this.listElement.splice(indexFrom, 1)[0])
                            hasChange = true;
                            break
                        }
                    }
                }
             
            })
            
            if(hasChange)
                this.#render(this.listElement)
        }
    }
    #moveDownAll() {
        if (this.#selectedItems.size != 0) {
            const sortSelectedItems = this.#getSortedId('inc')
            let hasChange = false
            sortSelectedItems.forEach(el => {
               
                let indexFrom = this.listElement.findIndex((listEl) => listEl.id == el)
                const isHiden = this.#visibleList.has(el)

                if (indexFrom != this.listElement.length-1 && !isHiden) {
                    this.listElement.push(this.listElement.splice(indexFrom, 1)[0])
                    hasChange = true;
                }             
            })
            if(hasChange)
                this.#render(this.listElement)
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
            
            passedList = this.listElement.filter((el) => {
                
                if (this.#selectedItems.has(el.id))
                    return true
                newList.push(el)
                return false           
            })
            this.#selectedItems.clear()
            this.listElement = newList
            this.#searchedList = [...newList]
            this.#render(this.listElement)
        }
        return passedList
    }
    getSearchedList() {//removes searched elements and return 
        
        this.#selectedItems.clear()
        this.#searchedList.forEach(el => {
            let deleteIndex = this.listElement.findIndex((listEl) => listEl.id == el.id)
            this.listElement.splice(deleteIndex, 1)
        })
        this.#render(this.listElement)
        const passedList = [...this.#searchedList]
        this.#search()
        return passedList
    }
     addElementList(list) { //adds new elements in list
        
        this.listElement.push(...list)
        
        this.#render(this.listElement)
        this.#search()
    }
    setNewList(list) { //recreates list
        this.#selectedItems.clear()
        this.listElement = list
        this.#render(this.listElement)
        this.#search()
    }
    set selectedElements(idElements) {
        this.#selectedItems = new Set(idElements)
    }
    get currentValues() {

        return  [...this.listElement]
    }
}

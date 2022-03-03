export default class Buttons{
    constructor(buttons)
    {
        
        this.contButton = document.createElement('div')
        this.contButton.classList.add('button-cont')
        buttons.forEach(el => {
            
            const tmp = document.createElement('button')
            tmp.innerText = String.fromCharCode(el.hexCode)
            tmp.addEventListener('click', el.func)
            console.log(tmp,el)
            this.contButton.append(tmp)
        })
        
    }
    get allButtons() {
        return this.contButton
    }
}
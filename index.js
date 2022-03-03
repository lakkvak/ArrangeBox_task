
import ArrangeBox from "./ArrangeBox.js"
import ListElement from "./ListElement.js"


const ab = new ArrangeBox()





//for test 

const addB = document.createElement('button')
addB.innerText = 'Add new ArrangeBox'
const listBox=[]
addB.onclick=e=>{
    listBox.push(new ArrangeBox())
}

const changeAvailableListB = document.createElement('button')
const newList = [
    new ListElement('Aaa', 93, 34),
    new ListElement('Ddd', 32, 23),
    new ListElement('bbbb', 832, 932),
    new ListElement('Vvv', 6372, 2923)
]
changeAvailableListB.innerText = 'Change available list'
changeAvailableListB.onclick = e => {
    ab.setAvailableList(newList)
}
const setSelectedListB = document.createElement('button')
setSelectedListB.innerText = 'Set selected list(id: 2 5 6)'
setSelectedListB.onclick = e => {
    ab.setSelectedItems(2, 5, 6) 
}
const resultB = document.createElement('button')
resultB.innerText='Current values'
resultB.onclick = e => {
   alert( ab.getCurrentValues())
}
document.querySelector('.cont').append(addB, changeAvailableListB, setSelectedListB, resultB)
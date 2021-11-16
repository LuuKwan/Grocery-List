//********SELECT ITEMS**************/
const alert = document.querySelector(`.alert`);
const form = document.querySelector(`.grocery-form`);
const inputGrocery = document.getElementById(`grocery`)
const submitBtn = document.querySelector(`.submit-btn`);

const groceryContainer = document.querySelector(`.grocery-container`);
const groceryList = document.querySelector(`.grocery-list`);
const clearBtn = document.querySelector(`.clear-btn`);


//edit option
let editFlag = false;
let editID = ``
let editElement;
let deleteBtns;
let editBtns;

window.addEventListener(`DOMContentLoaded`,setUpItem)
//EVENT LISTENER
// submit form
form.addEventListener(`submit`,(e)=>{
 e.preventDefault()
 // 1. add Item
 if(!editFlag && inputGrocery.value){
  addItem()
  displayAlert(`Item is added`,`success`)
 }
 //2. edit Item
 editBtns.forEach(btn=>{
  btn.addEventListener(`click`,editItem)
 })
 if(editFlag && inputGrocery.value){
  if(editElement.textContent !== inputGrocery.value){
   editElement.textContent = inputGrocery.value;
   displayAlert(`Edit successfully`,`success`)
   editLocalStorage(editID,editElement.textContent);
  }
  else{
   displayAlert(`Item is not editted`,`danger`);
  }
  setBackToDeFault()
 }
 // 3. delete Item
 deleteBtns.forEach(btn=>{
  btn.addEventListener(`click`,deleteItem)
 })
})
clearBtn.addEventListener(`click`,clearItems) // 4. clear all item // clear items btn


//FUNCTIONS
function displayAlert(text,action){
 alert.classList.add(`alert-${action}`)
 alert.textContent = text
 
 //remove alert
 setTimeout(function (){
  alert.classList.remove(`alert-${action}`);
  alert.textContent = ``;
 },3000)
}
function addItem(){ // return editBtn and deleteBtn
 const value = inputGrocery.value;
 const id = new Date().getTime().toString();
 createListItem(id,value)
 addToLocalStorage(id,value);  
 //set back to default
 setBackToDeFault()
}

// clear items
function clearItems(){
 const items = document.querySelectorAll(`.grocery-item`);
 if(items.length > 0){
  items.forEach( item =>{
   groceryList.removeChild(item);
  })
 }
 groceryContainer.classList.remove(`show-container`)
 displayAlert(`empty list`, `success`)
 setBackToDeFault()
   //clear local storage
   // clear all item in the list
 localStorage.removeItem('list')
}

// Edit item
function editItem(item){
 const article = item.currentTarget.parentElement.parentElement;
 let article_tile = article.querySelector(`.title`);
 editElement = article_tile //store the current edit item into editElement
 inputGrocery.value = article_tile.textContent;
 editFlag = true;
 editID = article.dataset.id;
 submitBtn.textContent = `Edit`
 return article_tile
}

 //DeleteItem function
function deleteItem(item){
 const article = item.currentTarget.parentElement.parentElement;
 const articleID = article.dataset.id;
  groceryList.removeChild(article);
  if(groceryList.children.length === 0){
   displayAlert(`Empty list`,`success`)
   groceryContainer.classList.remove(`show-container`)
  }
  else{
   displayAlert(`item is remove`,`success`)
  }
  setBackToDeFault()
  //remove from local storage
  removeFromLocalStorage(articleID)
}

 // set back to default
function setBackToDeFault(){
 inputGrocery.value = ``;
 editFlag = false;
 editID =``
 submitBtn.textContent = `submit`;
}

//LOCAL STORAGE
function addToLocalStorage(id,value){
 const newItem = {id,value}
 let itemsList = getLocalStorage()
 itemsList.push(newItem);
 localStorage.setItem('list',JSON.stringify(itemsList));

}
function removeFromLocalStorage(id){
 //console.log(`All items are clear`)
 let itemsList = getLocalStorage();
 if(itemsList){
  itemsList = itemsList.filter( item=>{
   if(item.id !== id){
    return item.id;
   }
  })
 }
 localStorage.setItem("list",JSON.stringify(itemsList));
}
function editLocalStorage(id,value){
 console.log(`edit item in local storage`)
 let itemsList = getLocalStorage()
 itemsList.forEach(item=>{
  if(item.id === id){
   item.value = value
  }
 })
 localStorage.setItem('list',JSON.stringify(itemsList));

}

function getLocalStorage(){
 return localStorage.getItem("list")? JSON.parse(localStorage.getItem('list')):[];
}



///////////// setup function//////////////////
function setUpItem(){
 let items = getLocalStorage()
 if(items.length > 0){
  items.forEach(item =>{
   createListItem(item.id,item.value)
  })
  groceryContainer.classList.add(`show-container`)
  displayAlert(`All items are successfully loaded`,`success`)
  // deleteBtns  = document.querySelectorAll(`.delete-btn`)
  editBtns.forEach(btn=>{
   btn.addEventListener(`click`,editItem)
  })
  deleteBtns.forEach(btn=>{
   btn.addEventListener(`click`,deleteItem)
  })
 }
}
function createListItem(id,value){
 if(value && editFlag === false){
  const element = document.createElement(`article`)
  // add class
  element.classList.add(`grocery-item`);
  // add id
  const attr = document.createAttribute(`data-id`);
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML=` <p class="title">${value}</p>
  <div class="button-container">
   <button class="edit-btn">
    <i class="fas fa-edit"></i>
   </button>
   <button class="delete-btn">
    <i class="fas fa-trash"></i>
   </button>
  </div>`;
  //append child
  groceryList.append(element);
  groceryContainer.classList.add(`show-container`)
  deleteBtns  = document.querySelectorAll(`.delete-btn`)
  editBtns = document.querySelectorAll(`.edit-btn`)
 }
}
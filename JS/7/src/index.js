'use strict';

const MAX_SUGGEST = 10 //number of cities to show
let NUMBER = 0
const SOFT_WAIT = 200 //special for user - don`t make too much moves while typing

async function makeSuggest() {
  if (NUMBER === 0){
    document.getElementById("search").addEventListener("keydown", swipe);
  }
  //clean old suggests to not confuse id numbers
  const curNumber = NUMBER
  await deleteSuggest()
  NUMBER += 1
  let inputText = document.getElementById('search').value;
  if (inputText.length === 0) {
    return
  }
  //first for russian, second for english locale
  let resp = await fetch(`https://autocomplete.travelpayouts.com/places2?term=${inputText}&locale=ru&types[]=airport`)
  let resp2 = await fetch(`https://autocomplete.travelpayouts.com/places2?term=${inputText}&locale=en&types[]=airport`)
  if (resp.ok && resp2.ok) {
    let respJSON = await resp.json()
    let respJSON2 = await resp2.json()
    setTimeout(() => {
      if (curNumber + 1 === NUMBER){
        let curID = 0
        let filtered = filterJSON(respJSON, respJSON2, inputText)
        let count = MAX_SUGGEST >  filtered.length ? filtered.length : MAX_SUGGEST
        for (let i = 0; i < count; i++){
          let curCity = filtered[i]
          let newElement = createBlock(curCity, curID)
          document.getElementsByClassName("suggests-wrapper")[0].appendChild(newElement)
          curID += 1
        }
      }
    }, SOFT_WAIT)
  }
}

function filterJSON(arr, arr2, text) {
  let ans = []
  for (let i = 0; i < arr.length; i++){
    let city = arr[i]
    let name = city.city_name.toUpperCase()
    let code = city.code.toUpperCase()
    text = text.toUpperCase()
    if (name.startsWith(text) || code.startsWith(text)) {
      ans.push(city)
    }
  }
  for (let i = 0; i < arr2.length; i++){
    let city = arr2[i]
    let name = city.city_name.toUpperCase()
    let code = city.code.toUpperCase()
    text = text.toUpperCase()
    if (name.startsWith(text) || code.startsWith(text)) {
      ans.push(city)
    }
  }
  return ans
}

function deleteSuggest() {
  let oldSuggests = document.getElementsByClassName('suggest')
  let counter = oldSuggests.length
  for (let i = 0; i < counter; i++){
    oldSuggests.item(0).remove()
  }
}

function createBlock(city, index){
  let name = city.city_name
  let code = city.code
  let elem = document.createElement('button')
  elem.textContent = name + ", " + code
  elem.id = index
  elem.className = "suggest"

  elem.onclick = () => {
    document.getElementById("search").value = elem.innerText
    makeSuggest()
    NUMBER += 1
  }

  elem.onkeydown = (e) => {
    alert(name)
    let suggests = document.getElementsByClassName('suggest')
    let len = suggests.length
    let elemID = parseInt(e.target.id)
    switch (e.key) {
      case "Enter":
        document.getElementById("search").value = elem.innerText
        makeSuggest()
        NUMBER += 1
        document.getElementById('search').focus()
        break;
      case "ArrowDown":
        if (elemID < len - 1){
          suggests.item(elemID + 1).focus()
        } else {
          suggests.item(0).focus()
        }
        break;
      case "ArrowUp":
        if (elemID > 0){
          suggests.item(elemID - 1).focus()
        } else {
          suggests.item(len - 1).focus()
        }
        break;
    }
  }

  return elem
}

function searchContent() {
  document.getElementById("search").value = "В этом редакторе запрещен переход по ссылкам(("
  makeSuggest()
  NUMBER += 1
  /* OLD VERSION:
  let inputText = document.getElementById('search').value;
  let href = "https://yandex.ru/search/?lr=2&text=" + inputText
  if (inputText.length > 0) {
    window.location.href = href;
  }*/
}

function swipe (e){
  let suggests = document.getElementsByClassName('suggest')
  let len = suggests.length
  switch (e.key) {
    case "Enter":
      searchContent()
      break;
    case "ArrowUp":
      suggests.item(len - 1).focus()
      break;
    case "ArrowDown":
      suggests.item(0).focus()
      break;
    default:
      return
  }
}

document.onkeydown = function(evt) {
  evt = evt || window.event;
  let keyCode = evt.keyCode;
  if (keyCode >= 37 && keyCode <= 40) {
    return false;
  }
};


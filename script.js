
function getRandomIntInclusive(min, max) {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  return Math.floor(Math.random() * (newMax - newMin) + newMin); // The maximum is exclusive and the minimum is inclusive
}
function injectCarouselHTML(list) {
  const target = document.querySelector('#pictures_caro');
  let itemState = "";
  let counter = 0;
  list.forEach((item) => {
    itemState = item.states;
     //target.innerHTML = '';
  let divBlock = document.createElement('div');
  if(counter == 0) {
    divBlock.classList.add('carousel_item', 'visible');
  } else {
    divBlock.classList.add('carousel_item', 'hidden');
  }
 
  //Creating an image element
  var img = document.createElement('img');
  let arrayOfImages= item.images;
  let dictAtArray0 = arrayOfImages[0]
  let imageUrl = dictAtArray0['url']
  console.log(imageUrl, 'IMAGEs URL');
  //Assiging the URL for images
  img.src = imageUrl;
  img.id = 'slide'
  divBlock.appendChild(img);
  target.appendChild(divBlock);
  counter ++;
  });
 

}

function injectHTML(list) {
  console.log('fired injectHTML');
  const target = document.querySelector('#parks_list');
  let itemState = "";
  list.forEach((item) => {
    itemState = item.states;
  });
  target.innerHTML = '';
  const listEl = document.createElement('ol');
  target.appendChild(listEl);

  list.forEach((item) => {
    itemState = item.states;
    const el = document.createElement('li');
    el.innerText = item.fullName;
    listEl.appendChild(el);

    var a = document.createElement('a'); 
    var link = document.createTextNode(item.states);
    a.appendChild(link); 
    a.title = item.states; 
    a.href = "secondPage.html"; 
    listEl.appendChild(a); 
  });
 
}

function processParks(list) {
  console.log('fired parks list');
  const range = [...Array(15).keys()];
  const newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length);
    return list[index];
  });
  /* newArray.forEach((item) => {

      }); */
  return newArray;


}

function filterList(list, filterInputValue) {
  return list.filter((item) => {
    if (!item.fullName) {
      return;
    }

    const lowerCaseName = item.fullName.toLowerCase();
    const lowerCaseQuery = filterInputValue.toLowerCase();
    const lowerCaseState = item.states.toLowerCase();
    return lowerCaseState.includes(lowerCaseQuery) & item.fullName.includes('Park');
  });
}

function initMap() {
  console.log('initMap');
  const map = L.map('map').setView([41.4925, -95.7129], 3);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  return map;
}

function markerPlace(array, map) {
  console.log('markerPlace', array);
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });
  array.forEach((item, index) => {
    const coordin = [];
    coordin[0] = item.latitude;
    console.log(coordin[0], " COORDINATES")
    coordin[1] = item.longitude;
    L.marker([coordin[0], coordin[1]]).addTo(map);
    if (index === 0) {
      map.setView([coordin[0], coordin[1]], 3);
    }
  });
}


async function getData() {
  const url = 'https://developer.nps.gov/api/v1/parks?limit=400&api_key=CmhsFh8PrYpbQG2jmRIqjSZdhG8LnY0yy10nhguh'; // remote URL! you can test it in your browser
  const data = await fetch(url); // We're using a library that mimics a browser 'fetch' for simplicity
  const json = await data.json(); // the data isn't json until we access it using dot notation
  
  const reply = json.data.filter((item) => Boolean(item.fullName));
  console.log(json.data, ' THIS IS THE reply');
  return reply;
}

async function mainEvent() {
   const pageMap = initMap();
  // the async keyword means we can make API requests
  const form = document.querySelector('.main_form'); // get your main form so you can do JS with it
  const submit = document.querySelector('#get-parks'); // get a reference to your submit button
  const loadAnimation = document.querySelector('.lds-ellipsis'); // get a reference to our loading animation
  const chartTarget = document.querySelector('#myChart');
  submit.style.display = 'none'; // let your submit button disappear
  const chartData = await getData();
  let currentList = [];
  submit.style.display = 'block'; 
  loadAnimation.classList.remove('lds-ellipsis');
  loadAnimation.classList.add('lds-ellipsis_hidden');

  form.addEventListener('input', (event) => {
    console.log(event.target.value, "in the event listener!");
    const newFilteredList = filterList(chartData, event.target.value);
    injectHTML(newFilteredList);
    markerPlace(newFilteredList, pageMap);
  });
 

  form.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
      currentList = processParks(chartData);
      console.log(currentList);
      injectHTML(currentList);
      markerPlace(currentList, pageMap);
    });
  }
  


document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests

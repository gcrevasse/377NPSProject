
function getRandomIntInclusive(min, max) {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  return Math.floor(Math.random() * (newMax - newMin) + newMin); // The maximum is exclusive and the minimum is inclusive
}

function injectCarouselHTML(list) {
  const target = document.querySelector('#pictures_caro');
  let itemState = "";
  list.forEach((item) => {
    itemState = item.states;
  });
  //target.innerHTML = '';
  let divBlock = document.createElement('div');
  divBlock.classList.add('slides');

  target.appendChild(divBlock);

}

function injectHTML(list) {
  console.log('fired injectHTML');
  const target = document.querySelector('#restaurant_list');
  let itemState = "";
  list.forEach((item) => {
    itemState = item.states;
  });
  target.innerHTML = '';
  
  //target.appendChild(itemState);
  const listEl = document.createElement('ol');
  target.appendChild(listEl);
  
  
  list.forEach((item) => {
    itemState = item.states;
    const el = document.createElement('li');
    const spanForText = document.createElement('span');
    spanForText.setAttribute('class', 'parkNameFont');
    const parkName = document.createTextNode(item.fullName);
    spanForText.appendChild(parkName);
    //parkName.classList.add('parkNameFont');
    el.appendChild(spanForText);
    listEl.appendChild(el);
    const spanForDescription = document.createElement('span');
    spanForDescription.setAttribute('class', 'parkDescriptionFormatting');
    
    const text = document.createTextNode(item.description);
    spanForDescription.appendChild(text);
    listEl.appendChild(spanForDescription);
    //Creating a divider
    let divBlock = document.createElement('div');
    //Adding the class for the div to format in CSS
    divBlock.classList.add('boxForJS');
    //Appending the div into the list
    listEl.appendChild(divBlock);
    //Creating an image element
    var img = document.createElement('img');
    let arrayOfImages= item.images;
    let dictAtArray0 = arrayOfImages[0]
    let imageUrl = dictAtArray0['url']
    console.log(imageUrl, 'IMAGEs URL');
    //Assiging the URL for images
    img.src = imageUrl;
    //Getting the caption for the image
    let imageCaption = dictAtArray0['caption'];
    //Creating text element
    let caption = document.createTextNode(imageCaption);
    img.classList.add("addedinJS");
    divBlock.appendChild(img);
    divBlock.appendChild(caption);
  });
 
}

function processRestaurants(list) {
  console.log('fired restaurants list');
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
    console.log(item.fullName.includes('Park'), 'what is going on here')
    if (!item.fullName) {
      return;
    }
    if(item.fullName.includes('Baltimore')) {
      return;
    }
    
    
    const lowerCaseName = item.fullName.toLowerCase();
    const lowerCaseQuery = filterInputValue.toLowerCase();
    const lowerCaseState = item.states.toLowerCase();
    console.log(lowerCaseState, 'THE STATE')
    console.log(lowerCaseName.includes(lowerCaseQuery), 'HERES THE RETURN')
    //omfg im so stupid ok now its searching for the state
  
    return lowerCaseState.includes(lowerCaseQuery) & item.fullName.includes('Park');
    //return lowerCaseName.includes(lowerCaseQuery);
  });
}

function filterState(list, filterInputValue) {
  return list.filter((item) => {
    if (!item.fullName.includes('Park')) {
      return;
    }
    
    const lowerCaseName = item.fullName.toLowerCase();
    const lowerCaseQuery = filterInputValue.toLowerCase();
    const lowerCaseState = item.states
    console.log(lowerCaseState, 'THE STATE')
    console.log(lowerCaseName.includes(lowerCaseQuery), 'HERES THE RETURN')
    return lowerCaseState.includes(lowerCaseQuery);
  });
}

function initMap() {
  console.log('initMap');
  const map = L.map('map').setView([39.0458, -76.6413], 7);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  return map;
}

function markerPlace(array, map) {
  console.log('markerPlace', array);
  // const marker = L.marker([51.5, -0.09]).addTo(map);
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
      map.setView([coordin[0], coordin[1]], 7);
    }
  });
}



function shapeDataForLineChart(array) {
  return array.reduce((collection, item) => {
    if(!collection[item.is_potentially_hazardous_asteroid]) {
      collection[item.is_potentially_hazardous_asteroid] = [item]
    } else {
      collection[item.is_potentially_hazardous_asteroid].push(item);
    }
    return collection;
  }, {})
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
 
  const chartData = await getData();
 
  const newFilteredList = filterList(chartData, 'MD');
  // And this function call will perform the "side effect" of injecting the HTML list for you
  injectHTML(newFilteredList);
  markerPlace(newFilteredList, pageMap);
  let currentList = [];
  
}


document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests

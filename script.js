
function getRandomIntInclusive(min, max) {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  return Math.floor(Math.random() * (newMax - newMin) + newMin); // The maximum is exclusive and the minimum is inclusive
}

function injectState(list) {
  let itemState = "";
  list.forEach((item) => {
    //we needx to f
    itemState = item.states;
  });
  target.innerHTML = itemState;
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
    el.innerText = item.fullName;
    listEl.appendChild(el);
    
                
    // Create anchor element.
    var a = document.createElement('a'); 
      
    // Create the text node for anchor element.
    var link = document.createTextNode(item.states);
      
    // Append the text node to anchor element.
    a.appendChild(link); 
      
    // Set the title.
    a.title = item.states; 
      
    // Set the href property.
    a.href = "secondPage.html"; 
      
    // Append the anchor element to the body.
    
    console.log(a, "WHAT DOES A ACTUALLY LOOK LIKE")
    listEl.appendChild(a); 
    // const description = document.createTextNode('\n\n' + item.description);
    // listEl.appendChild(description);
   
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
  const map = L.map('map').setView([41.4925, -95.7129], 3);
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
      map.setView([coordin[0], coordin[1]], 3);
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
    //right here we need to do
    //const newFilteredList = filterList(chartData, event.target.value);
    console.log(newFilteredList, 'ok so when it is being filtered and called we need to call states with this result')
    injectHTML(newFilteredList);
    markerPlace(newFilteredList, pageMap);
  });

  form.addEventListener('submit', (submitEvent) => {
    // This is needed to stop our page from changing to a new URL even though it heard a GET request
    submitEvent.preventDefault();
      
      // This constant will have the value of your 15-restaurant collection when it processes
      currentList = processRestaurants(chartData);
      //const parksList = filterParks(currentList);
      console.log(currentList);
  
      // And this function call will perform the "side effect" of injecting the HTML list for you
      injectHTML(currentList);
      markerPlace(currentList, pageMap);
    });
  }
  


document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests

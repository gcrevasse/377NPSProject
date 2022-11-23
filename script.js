
function getRandomIntInclusive(min, max) {
    const newMin = Math.ceil(min);
    const newMax = Math.floor(max);
    return Math.floor(Math.random() * (newMax - newMin) + newMin); // The maximum is exclusive and the minimum is inclusive
  }
  
  function injectHTML(list) {
    console.log('fired injectHTML');
    const target = document.querySelector('#restaurant_list');
    target.innerHTML = '';
  
    const listEl = document.createElement('ol');
    target.appendChild(listEl);
  
    list.forEach((item) => {
      const el = document.createElement('li');
      el.innerText = item.name;
      listEl.appendChild(el);
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
      if (!item.name) {
        return;
      }
      const lowerCaseName = item.name.toLowerCase();
      const lowerCaseQuery = filterInputValue.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery);
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
    const submit = document.querySelector('#get-resto'); // get a reference to your submit button
    const loadAnimation = document.querySelector('.lds-ellipsis'); // get a reference to our loading animation
    const chartTarget = document.querySelector('#myChart');
    submit.style.display = 'none'; // let your submit button disappear
    const chartData = await getData();
   
  
    let currentList = [];
  
    submit.style.display = 'block'; 
    loadAnimation.classList.remove('lds-ellipsis');
    loadAnimation.classList.add('lds-ellipsis_hidden');
  
    form.addEventListener('input', (event) => {
      console.log(event.target.value);
      const newFilteredList = filterList(currentList, event.target.value);
      injectHTML(newFilteredList);
      markerPlace(newFilteredList, pageMap);
    });
  
    form.addEventListener('submit', (submitEvent) => {
      // This is needed to stop our page from changing to a new URL even though it heard a GET request
      submitEvent.preventDefault();
  
      // This constant will have the value of your 15-restaurant collection when it processes
      currentList = processRestaurants(chartData);
      console.log(currentList);
  
      // And this function call will perform the "side effect" of injecting the HTML list for you
      injectHTML(currentList);
      markerPlace(currentList, pageMap);
    });
  }
  

  document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
  
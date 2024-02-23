let address = '';
let radius = 0;
let cuisine_out = '';

let ingredients = '';
let restrictions = '';
let cuisine_home = '';

const APP_ID = '[ADD YOUR OWN EDAMAM API ID]';
const APP_KEY = '[ADD YOUR OWN EDAMAM API KEY]';

const YELP_AUTH = 'Bearer [ADD YOUR OWN YELP API KEY]';
const YELP_ORIGIN = '[ADD YOUR OWN BROSWER ORIGIN]'; //example: http://127.0.0.1:8800/index.html

const eat_out_form = document.querySelector('#eating-out');
const stay_home_form = document.querySelector('#staying-home');

let results1_home = { name: "Recipe name", image: "URL for recipe image", link: "URL for recipe"};
let results2_home = { name: "Recipe name", image: "URL for recipe image", link: "URL for recipe"};
let results3_home = { name: "Recipe name", image: "URL for recipe image", link: "URL for recipe"};
let results4_home = { name: "Recipe name", image: "URL for recipe image", link: "URL for recipe"};
let results5_home = { name: "Recipe name", image: "URL for recipe image", link: "URL for recipe"};

let results1_eatout = { name: "Place name", image: "URL for place image", address: "Address", yelpLink: "URL for yelp" };
let results2_eatout = { name: "Place name", image: "URL for place image", address: "Address", yelpLink: "URL for yelp" };
let results3_eatout = { name: "Place name", image: "URL for place image", address: "Address", yelpLink: "URL for yelp" };
let results4_eatout = { name: "Place name", image: "URL for place image", address: "Address", yelpLink: "URL for yelp" };
let results5_eatout = { name: "Place name", image: "URL for place image", address: "Address", yelpLink: "URL for yelp" };


window.addEventListener('load', () => {
    eat_out_form.addEventListener('submit', eatout);
    stay_home_form.addEventListener('submit', stayhome);
});



function eatout(e){
    e.preventDefault();
    address = document.getElementById('address').value;
    radius = parseInt(document.getElementById('radius').value);
    cuisine_out = document.getElementById('cuisine_out').value;
    api_call_eatout()
}

function stayhome(e){
    e.preventDefault();
    ingredients = document.getElementById('ingredients').value;
    restrictions = document.getElementById('restrictions').value;
    cuisine_home = document.getElementById('cuisine_home').value;
    api_call_home()
}

function api_call_home(){
    let api_ingr = ingredients.replace(/,\s*/g, '%2C');
    let api_health = '&health=' + restrictions.replace(/,\s*/g, '&health=').replace(/\s+/g, '');
    let API_ENDPOINT = `https://api.edamam.com/api/recipes/v2?type=public&q=${api_ingr}&app_id=${APP_ID}&app_key=${APP_KEY}${api_health}&cuisineType=${cuisine_home}&mealType=Breakfast&mealType=Dinner&mealType=Lunch&random=true`;
    if (cuisine_home === 'any'){
        API_ENDPOINT = `https://api.edamam.com/api/recipes/v2?type=public&q=${api_ingr}&app_id=${APP_ID}&app_key=${APP_KEY}${api_health}&mealType=Breakfast&mealType=Dinner&mealType=Lunch&random=true`;
    }
    else if (restrictions === 'none'){
        API_ENDPOINT = `https://api.edamam.com/api/recipes/v2?type=public&q=${api_ingr}&app_id=${APP_ID}&app_key=${APP_KEY}&cuisineType=${cuisine_home}&mealType=Breakfast&mealType=Dinner&mealType=Lunch&random=true`;
    }
    else if(ingredients === ''){
        API_ENDPOINT = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${APP_ID}&app_key=${APP_KEY}${api_health}&cuisineType=${cuisine_home}&mealType=Breakfast&mealType=Dinner&mealType=Lunch&random=true`;
    }

    else if (cuisine_home == 'any' && ingredients === ''){
        API_ENDPOINT = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${APP_ID}&app_key=${APP_KEY}&cuisineType=${cuisine_home}&mealType=Breakfast&mealType=Dinner&mealType=Lunch&random=true`;
    }
    else if(cuisine_home == 'any' && restrictions === 'none'){
        API_ENDPOINT = `https://api.edamam.com/api/recipes/v2?type=public&q=${api_ingr}&app_id=${APP_ID}&app_key=${APP_KEY}&mealType=Breakfast&mealType=Dinner&mealType=Lunch&random=true`;
    }
    else if(ingredients === '' && restrictions === 'none'){
        API_ENDPOINT = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${APP_ID}&app_key=${APP_KEY}&cuisineType=${cuisine_home}&mealType=Breakfast&mealType=Dinner&mealType=Lunch&random=true`;
    }
    
    fetch(API_ENDPOINT)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response error');
        }
        return response.json();
    })
    .then(data => {
        const recipes = data.hits.slice(0, 5).map((hit, index) => {
            return {
                name: hit.recipe.label,
                image: hit.recipe.image,
                link: hit.recipe.url,
            };
        });

        results1_home = recipes[0];
        results2_home = recipes[1];
        results3_home = recipes[2];
        results4_home = recipes[3];
        results5_home = recipes[4];
        Displayresults_stayhome();

    })
    .catch(error => {
        console.error('Error fetching recipes:', error);
        alert('Failed to fetch recipes.');
    });
}


function api_call_eatout(){
    let location = address.replace(/\s+/g, '%20');
    let API_ENDPOINT = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${location}&term=restaurants&radius=${radius}&categories=${cuisine_out}&open_now=true&sort_by=best_match&limit=20`;
    if (cuisine_out == 'any'){
        API_ENDPOINT = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${location}&term=restaurants&radius=${radius}&open_now=true&sort_by=best_match&limit=20`;
    }
    fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
            'Authorization': YELP_AUTH,
          'Origin': YELP_ORIGIN,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => {
        if (!response.ok) {
            throw new Error('Network response error');
        }
        return response.json();
    })
      .then(data => {
        const shuffledPlaces_eating_out = shuffleArray_eatingout(data.businesses);
        const places = shuffledPlaces_eating_out.slice(0, 5).map((business, index) => {
            return {
                name: business.name,
                image: business.image_url,
                address: business.location.display_address.join(', '),
                yelpLink: business.url
            };
        });
        results1_eatout = places[0];
        results2_eatout = places[1];
        results3_eatout = places[2];
        results4_eatout = places[3];
        results5_eatout = places[4];
        Displayresults_eatout();

        
        
      })
      .catch(error => {
        console.error('Error fetching places:', error);
        alert('Failed to fetch places. (May have not put in your full address)');
      });
    }

    function shuffleArray_eatingout(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function Displayresults_eatout() {
        const resultslist = document.querySelector('#results_list');
        resultslist.innerHTML = '';
    
        const resultsContainer = document.createElement('div');
        resultsContainer.classList.add('results-container');
    
        const result1 = createResultElement_eatout(results1_eatout);
        const result2 = createResultElement_eatout(results2_eatout);
        const result3 = createResultElement_eatout(results3_eatout);
        const result4 = createResultElement_eatout(results4_eatout);
        const result5 = createResultElement_eatout(results5_eatout);
    
        resultsContainer.appendChild(result1);
        resultsContainer.appendChild(result2);
        resultsContainer.appendChild(result3);
        resultsContainer.appendChild(result4);
        resultsContainer.appendChild(result5);
    
        resultslist.appendChild(resultsContainer);
    }
    
    function createResultElement_eatout(result) {
        const resultElement = document.createElement('div');
        resultElement.classList.add('result');
    
        const name = document.createElement('a');
        name.textContent = result.name;
        name.href = result.yelpLink;
    
        const image = document.createElement('img');
        image.src = result.image;
    
        const address = document.createElement('p');
        address.textContent = 'Address: ' + result.address;
    
        resultElement.appendChild(image);
        resultElement.appendChild(name);
        resultElement.appendChild(address);
    
        return resultElement;
    }

//////////////////////////////////////////////////////////////
    function Displayresults_stayhome() {
        const resultslist = document.querySelector('#results_list');
        resultslist.innerHTML = '';
    
        const resultsContainer = document.createElement('div');
        resultsContainer.classList.add('results-container');
    
        const result1 = createResultElement_stayhome(results1_home);
        const result2 = createResultElement_stayhome(results2_home);
        const result3 = createResultElement_stayhome(results3_home);
        const result4 = createResultElement_stayhome(results4_home);
        const result5 = createResultElement_stayhome(results5_home);
    
        resultsContainer.appendChild(result1);
        resultsContainer.appendChild(result2);
        resultsContainer.appendChild(result3);
        resultsContainer.appendChild(result4);
        resultsContainer.appendChild(result5);
    
        resultslist.appendChild(resultsContainer);
    }
    
    function createResultElement_stayhome(result) {
        const resultElement = document.createElement('div');
        resultElement.classList.add('result');
    
        const name = document.createElement('a');
        name.textContent = result.name;
        name.href = result.link;
    
        const image = document.createElement('img');
        image.src = result.image;
    
        resultElement.appendChild(image);
        resultElement.appendChild(name);
    
        return resultElement;
    }

/* Used to read in from json file, but was blocked in browser, now loading into local storage from being declared here
url's and paths here are relative to site root. Cannot use root directory as changes not running via VS-code */
const json_info = {
    "recipe-of-the-week":"Lamb Tikka Masala",

    "popular recipes":[
        "Vegetarian Margherita", "Chinese Chilli Chicken", "Lamb Tikka Masala"
    ],
    "cuisine":[ 
        {
            "name":"Indian", "img-path":"img/cuisines/indian.jpg", "url":"html/cuisines/indian-cuisine.html"
        },
        {
            "name":"Italian", "img-path":"img/cuisines/italian.jpg", "url":"html/cuisines/italian-cuisine.html"
        },
        {
            "name":"Chinese", "img-path":"img/cuisines/chinese.jpg", "url":"html/cuisines/chinese-cuisine.html"
        }
    ],
    "courses":[
        {
            "name":"Dinner", "img-path":"img/courses/dinner.jpg", "url":"html/courses/dinner.html"
        }
    ],
    "diet":[
        {
            "name":"Vegetarian", "img-path":"img/diets/vegetarian.jpg", "url":"html/diets/vegetarian.html"
        },
        {
            "name":"Vegan", "img-path":"img/diets/vegan.jpg", "url":"html/diets/vegan.html"
        }
    ],
    "recipes":[
        {
            "name":"Lamb Tikka Masala", "img-path":"img/recipes/lamb-tikka-masala.jpg", "url":"html/recipes/lamb-tikka-masala.html", "cuisine":"Indian", "breakfast":false, "lunch":false, "dinner":true, "dessert":false, "vegetarian":false, "vegan":false, "required_recipes":[{"name":"Curry Base Sauce"}]
        },
        {
            "name":"Vegetarian Margherita", "img-path":"img/recipes/vegetarian-margherita.jpg", "url":"html/recipes/vegetarian-margherita.html", "cuisine":"Italian", "breakfast":false, "lunch":false, "dinner":true, "dessert":false, "vegetarian":true, "vegan":false, "required_recipes":[{"name":"Pizza Dough"}]
        },
        {
            "name":"Pizza Dough", "img-path":"img/recipes/pizza-dough.jpg", "url":"html/recipes/pizza-dough.html", "cuisine":"Italian", "breakfast":false, "lunch":false, "dinner":false, "dessert":false, "vegetarian":true, "vegan":true, "required_recipes":[]
        },
        {
            "name":"Chinese Chilli Chicken", "img-path":"img/recipes/chinese-chilli-chicken.jpg", "url":"html/recipes/chinese-chilli-chicken.html", "cuisine":"Chinese", "breakfast":false, "lunch":false, "dinner":true, "dessert":false, "vegetarian":false, "vegan":false, "required_recipes":[]
        },
        {
            "name":"Curry Base Sauce", "img-path":"img/recipes/curry-base-sauce.jpg", "url":"html/recipes/curry-base-sauce.html", "cuisine":"Indian", "breakfast":false, "lunch":false, "dinner":false, "dessert":false, "vegetarian":true, "vegan":true, "required_recipes":[]
        }
    ]
}


if(storageAvailiable('localStorage')) {

    localStorage.setItem("directory", JSON.stringify(json_info));
} else {
    console.log('DOM storage NOT availiable');
}


function storageAvailiable(){
    try {
        var storage = window['localStorage'],
            x = '__storage_test__';
        storage.setItem(x,x);
        storage.removeItem(x);
        return true;
    } catch {
        return e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            storage.length !== 0;
    }
}


/* OLD when was reading in from json file running via VS-code it worked, but through browser both type="module" and import statements are blocked */

// type="module"
// import directory from './directory.json' assert {type: 'json'};


// if(storageAvailiable('localStorage')) {

//     localStorage.setItem("directory", JSON.stringify(directory));

// } else {
//     console.log('DOM storage NOT availiable');
// }


// function storageAvailiable(){
//     try {
//         var storage = window['localStorage'],
//             x = '__storage_test__';
//         storage.setItem(x,x);
//         storage.removeItem(x);
//         return true;
//     } catch {
//         return e instanceof DOMException && (
//             e.code === 22 ||
//             e.code === 1014 ||
//             e.name === 'QuotaExceededError' ||
//             e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
//             storage.length !== 0;
//     }
// }
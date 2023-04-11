/* Used to read in from json file, but was blocked in browser, now loading into local storage from being declared here
url's and paths here are relative to site root. Cannot use root directory as changes not running via VS-code */
const json_info = {
    "recipe-of-the-week":[
        {
            "name":"Lamb Tikka Masala", "img-path":"img/recipes/lamb-tikka-masala.jpg", "url":"html/recipes/lamb-tikka-masala.html"
        }
    ],
    "popular recipes":[
        {
            "name":"Lamb Tikka Masala", "img-path":"img/recipes/lamb-tikka-masala.jpg", "url":"html/recipes/lamb-tikka-masala.html"
        }
    ],
    "cuisine":[ 
        {
            "name":"Indian", "img-path":"img/cuisines/indian.jpg", "url":"html/cuisines/indian-cuisine.html"
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
            "name":"Lamb Tikka Masala", "img-path":"img/recipes/lamb-tikka-masala.jpg", "url":"html/recipes/lamb-tikka-masala.html", "cuisine":"Indian", "breakfast":false, "lunch":false, "dinner":true, "dessert":false, "vegetarian":false, "vegan":false, "prep-time":30, "cook-time":30, "total-time":60, "ingredients":{"scale-info":{"portions":4, "units":"metric", "course":"dinner"}, "ingredients":[{"quantity":3, "unit":"tsp", "name":"Cinnamon"}, {"quantity":5, "unit":"Tbsp", "name":"Cumin"}]}
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
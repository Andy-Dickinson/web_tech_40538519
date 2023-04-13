var original_portions_selected;
var original_ingredient_quantities = [];
var original_ingedient_units = [];
var original_unit;

/* Creates a list of clickable images from the list in directory.json file.
Attribute and filter are optional parameters, if passed, will build from only those 
items which have the attribute of value filter */
function create_list_page_imgs(list, path_index_directory, attribute, filter) { 
    var directory_list = get_correct_list(list, attribute, filter);

    populate_list_section(directory_list, path_index_directory);
}


/* populates list-section id element using directory_list passed. 
path_index_directory is the optional path to the directory in which the index.html file is located. 
Used to modify paths from json obj contained within the directory_list*/
function populate_list_section(directory_list, path_index_directory) {
    if(path_index_directory == undefined){
        path_index_directory = "";
    }
    
    if (directory_list.length > 0) {

        var list_section = document.getElementById('list-section');

        // removes element with class 'remove-when-content'
        var elements = list_section.getElementsByClassName('remove-when-content');
        if (elements.length != 0) {
            list_section.removeChild(elements[0]);
        }

        // creates new list
        var newNode = document.createElement("ul");
        newNode.setAttribute("class", "container");

        /* creates a new list item containing anchor to recipe, image and h3 with name of recipe for every item (recipe found) in directory list */
        for (var i = 0; i < directory_list.length; i++) {
            var new_item_node = document.createElement("li");
            new_item_node.setAttribute("class", "box");

            var new_anchor_node = document.createElement("a");
            new_anchor_node.setAttribute("href", path_index_directory + directory_list[i]["url"]);

            var new_img_node = document.createElement("img");
            new_img_node.setAttribute("src", path_index_directory + directory_list[i]["img-path"]);
            var name = directory_list[i]["name"];
            name = name.charAt(0).toUpperCase() + name.slice(1);
            new_img_node.setAttribute("alt", name);

            new_anchor_node.appendChild(new_img_node);

            var new_h3_node = document.createElement("h3");
            new_h3_node.innerHTML = name;

            new_anchor_node.appendChild(new_h3_node);

            new_item_node.appendChild(new_anchor_node);

            newNode.appendChild(new_item_node);
        }

        list_section.appendChild(newNode);
    }
    else {
        console.log("0 items in JSON object list - check read-json.js");
    }
}


// Gets relevant list from local storage and turns into json obj
function get_correct_list(list, attribute, filter) {
    var directory = JSON.parse(localStorage.getItem('directory'));
    var directory_list = directory[list];
    
    // filters list if required
    if(filter != undefined) {
        directory_list = filter_list(directory_list, attribute, filter);
    }
    
    return directory_list;
}


/* Filters directory_list keeping items where the attribute value equals get */
function filter_list(directory_list, attribute, get) {
    var filtered_list = [];

    for(item in directory_list){
        var found_attribute_value = directory_list[item][attribute];
        
        if(typeof(found_attribute_value) != "boolean" ){
            found_attribute_value = found_attribute_value.toUpperCase();
            get = get.toUpperCase();
        }

        if(found_attribute_value == get){
            filtered_list.push(directory_list[item]);
        }
    }

    return filtered_list;
}


function set_popular_recipes() {
    var popular_names = JSON.parse(localStorage.getItem('directory'))["popular recipes"];
    var list_of_popular = [];
    
    for(var i=0; i<popular_names.length; i++){
        list_of_popular.push(get_correct_list('recipes', 'name', popular_names[i])[0]);
    }
    populate_list_section(list_of_popular, "");
}


function set_recipe_of_the_week() {
    var recipe_name = JSON.parse(localStorage.getItem('directory'))["recipe-of-the-week"];

    var recipe = get_correct_list("recipes", "name", recipe_name)[0];
    document.getElementById("recipe-of-the-week-header").innerHTML = recipe["name"];
    document.getElementById("recipe-of-the-week-anchor").setAttribute("href", recipe["url"]);
    document.getElementById("recipe-of-the-week-img").setAttribute("src", recipe["img-path"]);
}
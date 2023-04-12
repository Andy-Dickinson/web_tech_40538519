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


/* Sets recipe image path, href for anchor to ingredients from other recipes, and 
variable storing current selections from json obj data */
function set_recipe_variables(name, path_index_directory) {
    
    var recipe = get_correct_list("recipes", "name", name);
    
    if(path_index_directory == undefined){
        path_index_directory = "";
    }
    
    // if recipe found, should be a json object with the recipe found
    if(recipe.length>0){
        // extracts recipe object 
        recipe = recipe[0];

        document.getElementById("recipe-img").setAttribute("src", path_index_directory + recipe["img-path"]);

        // sets path for any ingredients required from other recipes. Path stored in json obj
        for(var i=0; i<recipe["required_recipes"].length; i++) {
            var ex_recipe_name = recipe["required_recipes"][i]["name"];
            var exter_recipe = get_correct_list("recipes", "name", ex_recipe_name)[0];

            // protects against receipe not being created yet
            if(exter_recipe != undefined){
                // add href path to other recipe on anchor tag
                document.getElementsByClassName("external " + i)[0].setAttribute("href", path_index_directory + exter_recipe["url"]);
            }
        }

        // store selections to be used when changing values
        original_portions_selected = document.getElementById("portions").value;
        var radios = document.getElementsByName("units");

        for(var i=0; i<radios.length; i++){
            if(radios[i].checked){
                original_unit = radios[i].id;
            }
        }

        var ingredient_units = document.getElementsByClassName("unit");
        var ingredients_quantity = document.getElementsByClassName("quantity");

        for(var i=0; i<ingredients_quantity.length; i++) {
            original_ingredient_quantities.push(ingredients_quantity[i].innerHTML);
            original_ingedient_units.push(ingredient_units[i].innerHTML);
        }

    } else {
        console.log("0 items in JSON object list - check read-json.js");
    }

    

     /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        if course is not undefined AND does not match set course, adjust course and ingredients++++++++++++++++++++++++++++++++++ */
}


// checks if units need to be converted after changing portions based on original values
function check_unit_portions_change() {

    if((document.getElementById(original_unit).checked)) {
        change_portions();
    } else if(original_unit == "imperial") {
        change_portions();
        reset_ingredient_units();
        change_to_metric();
    } else {
        change_portions();
        reset_ingredient_units();
        change_to_imperial();
    }
}


/* Converts all ingredient quantities based on portion selection and original 
portions/quantities */
function change_portions() {
    var new_portions = document.getElementById("portions").value;
    var num_ingredients = original_ingredient_quantities.length;
    var multiplier = new_portions / original_portions_selected;

    for(var i=0; i<num_ingredients; i++){
        var new_value = original_ingredient_quantities[i] * multiplier;

        change_quantity(i, new_value);
    }
}


// Changes current quantity at class "quantity index" by multiplier
function change_quantity(index, new_value) {
    var curr_quantity = document.getElementsByClassName("quantity " + index)[0];

    // 2 decimal places unless whole number
    curr_quantity.innerHTML = +(new_value).toFixed(2);
}


// Changes unit at class "unit index"
function change_unit(index, unit) {
    var curr_unit = document.getElementsByClassName("unit " + index)[0];

    curr_unit.innerHTML = unit;
}


// Resets each ingredients unit to original value
function reset_ingredient_units() {
    var curr_units = document.getElementsByClassName("unit");

    for(var i=0; i<original_ingedient_units.length; i++){
        curr_units[i].innerHTML = original_ingedient_units[i];
    }
}


/* Changes quantities and units to imperial
Resets based on original values if originally imperial (avoids loss) */
function change_to_imperial() {
    if(original_unit == "imperial"){
        change_portions();
        reset_ingredient_units();
    } else {
        var quantities = document.getElementsByClassName("quantity");
        var units = document.getElementsByClassName("unit");

        for(var i=0; i<quantities.length; i++) {
            var conversion_list = get_conversion_to_imperial(quantities[i].innerHTML, units[i].innerHTML);

            change_unit(i, conversion_list[0]);
            change_quantity(i, conversion_list[1]);
        }
    }
}


/* Changes quantities and units to metric
Resets based on original values if originally metric (avoids loss) */
function change_to_metric() {
    
    if(original_unit == "metric") {
        change_portions();
        reset_ingredient_units();
    }else {
        var quantities = document.getElementsByClassName("quantity");
        var units = document.getElementsByClassName("unit");

        for(var i=0; i<quantities.length; i++) {
            var conversion_list = get_conversion_to_metric(quantities[i].innerHTML, units[i].innerHTML);
            
            change_unit(i, conversion_list[0]);
            change_quantity(i, conversion_list[1]);
        }
    }
}


/* imperial conversion lookup
Returns list containing the unit_to and new_value respectively */
function get_conversion_to_imperial(quantity, curr_unit) {
    var convert_list = [];

    switch(curr_unit) {
        case "ml":
            if(quantity<18){
                convert_list.push("tsp");
                convert_list.push(quantity/5.919);
            }else if(quantity<230){
                convert_list.push("Tbsp");
                convert_list.push(quantity/17.758);
            }else if(quantity<270){
                convert_list.push("cup");
                convert_list.push(quantity/236.6);
            }else if(quantity<800){
                convert_list.push("cups");
                convert_list.push(quantity/236.6);
            }else {
                convert_list.push("pints");
                convert_list.push(quantity/568.3);
            }
            break;
            
        case "ltr":
            convert_list.push("pints");
            convert_list.push(quantity*1.76);
            break;
        
        case "g":
            if(quantity>543){
                convert_list.push("Ibs");
                convert_list.push(quantity/453.6);
            }else {
                convert_list.push("oz");
                convert_list.push(quantity/28.35);
            }
            break;
            
        case "kg":
            if(quantity>0.5) {
                convert_list.push("Ibs");
                convert_list.push(quantity*2.205);
            }else {
                convert_list.push("oz");
                convert_list.push(quantity*35.274);
            }
            break;
            
        case "cm":
            convert_list.push("inch");
            convert_list.push(quantity/2.54);
            break;

        case "cloves":
            convert_list.push("cloves");
            convert_list.push(+(quantity));
            break;

        default:
            console.log("unit not recognised when converting to imperial: ", curr_unit);
    }

    return convert_list;
}


/* metric conversion lookup
Returns list containing the unit to and new_value respectively */
function get_conversion_to_metric(quantity, curr_unit) {
    var convert_list = [];

    switch(curr_unit) {
        case "tsp":
            if(quantity>168){
                convert_list.push("ltr");
                convert_list.push(quantity/168.9);
            }else {
                convert_list.push("ml");
                convert_list.push(quantity*5.919);
            }
            break;

        case "Tbsp":
            if(quantity>56) {
                convert_list.push("ltr");
                convert_list.push(quantity/56.312);
            }else {
                convert_list.push("ml");
                convert_list.push(quantity*17.758);
            }
            break;

        case "pint":
            if(quantity>1){
                convert_list.push("ltr");
                convert_list.push(quantity/1.76);
            }else {
                convert_list.push("ml");
                convert_list.push(quantity*568.3);
            }

        case "cups":
            if(quantity>4) {
                convert_list.push("ltr");
                convert_list.push(quantity/4.227);
            }else {
                convert_list.push("ml");
                convert_list.push(quantity*236.6);
            }
            break;

        case "cup":
            convert_list.push("ml");
            convert_list.push(quantity*236.6);
            break;

        case "oz":
            if(quantity>35){
                convert_list.push("kg");
                convert_list.push(quantity/35.274);
            }else {
                convert_list.push("g");
                convert_list.push(quantity*28.35);
            }
            break;

        case "Ibs":
            if(quantity>2){
                convert_list.push("kg");
                convert_list.push(quantity/2.205);
            }else {
                convert_list.push("g");
                convert_list.push(quantity*453.6);
            }
            break;

        case "cloves":
            convert_list.push("cloves");
            convert_list.push(+(quantity));
            break;
            
        case "inch":
            convert_list.push("cm");
            convert_list.push(quantity*2.54);
            break;
        
        default:
            console.log("unit not recognised when converting to metric: ", curr_unit);
    }

    return convert_list;
}
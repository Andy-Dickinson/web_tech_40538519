/* Creates a list of clickable images from the list in directory.json file.
Attribute and filter are optional parameters, if passed, will build from only those 
items which have the attribute of value filter */
function create_clickable_img_list(list, path_index_directory, attribute, filter) { 
    
    if(path_index_directory == undefined){
        path_index_directory = "";
    }

    var directory_list = get_correct_list(list, attribute, filter);

    if(directory_list.length>0){

        var list_section = document.getElementById('list-section');
        
        // removes element with class 'remove-when-content'
        var elements = list_section.getElementsByClassName('remove-when-content');
        if(elements.length != 0 ){
            list_section.removeChild(elements[0]);
        }

        // creates new list
        var newNode = document.createElement("ul");
        newNode.setAttribute("class", "container");

        /* creates a new list item containing anchor to recipe, image and h3 with name of recipe for every item (recipe found) in directory list */
        for(var i=0; i<directory_list.length;i++){
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
        console.log("0 items in JSON file list");
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
        var attribute = directory_list[item][attribute];
        
        if(typeof(attribute) != "boolean" ){
            attribute = attribute.toUpperCase();
            get = get.toUpperCase();
        }
        if(attribute == get){
            filtered_list.push(directory_list[item]);
        }
    }

    return filtered_list;
}


function set_recipe_of_the_week() {
    var recipe = get_correct_list("recipe-of-the-week")[0];

    document.getElementById("recipe-of-the-week-header").innerHTML = recipe["name"];
    document.getElementById("recipe-of-the-week-anchor").setAttribute("href", recipe["url"]);
    document.getElementById("recipe-of-the-week-img").setAttribute("src", recipe["img-path"]);
}


function set_recipe_information(name, path_index_directory) {
    var recipe = get_correct_list("recipes", "name", name)

    if(path_index_directory == undefined){
        path_index_directory = "";
    }

    // if recipe found, should be a json object with the recipe found
    if(recipe.length>0){
        // extracts recipe object 
        recipe = recipe[0];
        var ingredients_info = recipe["ingredients-info"];

        document.getElementById("recipe-img").setAttribute("src", path_index_directory + recipe["img-path"]);

        // sets units radio button
        if(ingredients_info["scale-info"]["imperial"]){
            document.getElementById("imperial").checked = true;
        } else {
            document.getElementById("metric").checked = true;
        }

        // sets course displayed
        var course = ingredients_info["scale-info"]["course"];
        course = "Course: " + course[0].toUpperCase() + course.slice(1,);
        document.getElementById("course").innerHTML = course;
        
        // sets portion dropdown selected value
        var portion = ingredients_info["scale-info"]["portions"];
        document.getElementById("portions").value = portion;

        // sets times
        var prep = document.createElement("h4");
        prep.innerHTML = "Prep time: " + recipe["prep-time"];
        document.getElementById("description").appendChild(prep);

        var cook = document.createElement("h4");
        cook.innerHTML = "Cook time: " + recipe["cook-time"];
        document.getElementById("description").appendChild(cook);

        var total = document.createElement("h4");
        total.innerHTML = "Total time: " + recipe["total-time"];
        document.getElementById("description").appendChild(total);

        var label_counter = ingredients_info["recipe_required"].length;

        // Adds ingredients which comes from other recipes (styled differently)
        for(var i=0; i<label_counter; i++) {
            var other_recipe_info = ingredients_info["recipe_required"][i];

            var recipe_ingredient = document.createElement("li");
            var recipe_link = document.createElement("a");
            recipe_link.setAttribute("href", path_index_directory + other_recipe_info["url"]);
            recipe_link.setAttribute("class", "external");

            var link_quantity = document.createElement("span");
            link_quantity.setAttribute("id", "quantity" + i);
            link_quantity.innerHTML = other_recipe_info["quantity"] + " ";
            recipe_link.appendChild(link_quantity);

            var link_unit = document.createElement("span");
            link_unit.setAttribute("id", "unit" + i);
            link_unit.innerHTML = other_recipe_info["unit"] + " ";
            recipe_link.appendChild(link_unit);

            var link_text = document.createElement("span");
            link_text.setAttribute("id", "item" + i);
            link_text.innerHTML = other_recipe_info["name"] + " - see link";
            recipe_link.appendChild(link_text);

            recipe_ingredient.appendChild(recipe_link);

            document.getElementById("ingredients").appendChild(recipe_ingredient);
        }
        

        var ingredients = ingredients_info["ingredients"];

        // adds all ingredients from json obj
        for(var i=0; i<ingredients.length; i++) {
            label_counter++;

            var quantity = ingredients[i]["quantity"];
            var unit = ingredients[i]["unit"];
            var item = ingredients[i]["name"];
            
            var ingredient = document.createElement("li");

            var quantity_span = document.createElement("span");
            quantity_span.setAttribute("id", "quantity" + label_counter);
            quantity_span.innerHTML = quantity + " ";
            ingredient.appendChild(quantity_span);

            var unit_span = document.createElement("span");
            unit_span.setAttribute("id", "unit" + label_counter);
            unit_span.innerHTML = unit + " ";
            ingredient.appendChild(unit_span);

            var item_span = document.createElement("span");
            item_span.setAttribute("id", "item" + label_counter);
            item_span.innerHTML = item;
            ingredient.appendChild(item_span);

            document.getElementById("ingredients").appendChild(ingredient);
        }

        /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        if course is not undefined AND does not match set course, adjust course and ingredients++++++++++++++++++++++++++++++++++ */


    } else {
        console.log("0 items in JSON file list");
    }
}
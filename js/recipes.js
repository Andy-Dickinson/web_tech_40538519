/* Note default.js is also required as this file makes use of functions within */

var original_portions_selected;
var original_ingredient_quantities = [];
var original_ingedient_units = [];
var original_unit;

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

    check_plurals();
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

    check_plurals();
    temperatures_to_f();
}


/* Converts temperatures to fahrenheit */
function temperatures_to_f() {
    var temps = document.getElementsByClassName("temp");
    var temp_units = document.getElementsByClassName("temp-unit");

    for(var i=0; i<temps.length; i++){
        if(temp_units[i].innerHTML == "C") {
            temps[i].innerHTML = (+(temps[i].innerHTML) * 1.8) + 32;
            temp_units[i].innerHTML = "F";
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

    check_plurals();
    temperatures_to_c();
}


/* Converts temperatures to celsius */
function temperatures_to_c() {
    var temps = document.getElementsByClassName("temp");
    var temp_units = document.getElementsByClassName("temp-unit");

    for(var i=0; i<temps.length; i++){
        if(temp_units[i].innerHTML == "F") {
            temps[i].innerHTML = (+(temps[i].innerHTML) - 32) * (5/9);
            temp_units[i].innerHTML = "C";
        }
    }
}


/* Checks and modifies any units which should be singular or plural */
function check_plurals() {
    var quantities = document.getElementsByClassName("quantity");
    var units = document.getElementsByClassName("unit");

    for(var i=0; i<quantities.length; i++){
        if(+(quantities[i].innerHTML)>1){
            make_plural(units[i]);
        } else {
            make_singular(units[i]);
        }
    }
}


/* Changes unit to plural if not already */
function make_plural(unit) {
    switch(unit.innerHTML){
        case "Cup":
            unit.innerHTML = "Cups";
            break;
        
        case "Clove":
            unit.innerHTML = "Cloves";
            break;
        
        case "Inch":
            unit.innerHTML = "Inches";
            break;

        case "Ib":
            unit.innerHTML = "Ibs";
            break;
            
        case "Handful":
            unit.innerHTML = "Handfuls";
            break;

        case "Pint":
            unit.innerHTML = "Pints";
            break;

        default:
            console.log("Unit either not recognised or not requireing made plural - ", unit.innerHTML);
    }
} 


/* Changes unit to singular if not already */
function make_singular(unit) {
    switch(unit.innerHTML){
        case "Cups":
            unit.innerHTML = "Cup";
            break;
        
        case "Cloves":
            unit.innerHTML = "Clove";
            break;
        
        case "Inches":
            unit.innerHTML = "Inch";
            break;

        case "Ibs":
            unit.innerHTML = "Ib";
            break;
            
        case "Handfuls":
            unit.innerHTML = "Handful";
            break;

        case "Pints":
            unit.innerHTML = "Pint";
            break;

        default:
            console.log("Unit either not recognised or not requireing made singular - ", unit.innerHTML);
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
                convert_list.push("Cup");
                convert_list.push(quantity/236.6);
            }else if(quantity<800){
                convert_list.push("Cups");
                convert_list.push(quantity/236.6);
            }else {
                convert_list.push("Pints");
                convert_list.push(quantity/568.3);
            }
            break;
            
        case "ltr":
            convert_list.push("Pints");
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
            convert_list.push("Inch");
            convert_list.push(quantity/2.54);
            break;

        case "Clove":
            convert_list.push("Clove");
            convert_list.push(+(quantity));
            break;

        case "Cloves":
            convert_list.push("Cloves");
            convert_list.push(+(quantity));
            break;
        
        case "Bulb":
            convert_list.push("Bulb");
            convert_list.push(+(quantity));
            break;

        case "Large":
            convert_list.push("Large");
            convert_list.push(+(quantity));
            break;

        case "Medium":
            convert_list.push("Medium");
            convert_list.push(+(quantity));
            break;

        case "Can":
            convert_list.push("Can");
            convert_list.push(+(quantity));
            break;

        case "Handful":
            convert_list.push("Handful");
            convert_list.push(+(quantity));
            break;
            
        case "":
            convert_list.push("");
            convert_list.push(+(quantity));
            break;

        default:
            console.log("unit not recognised when converting to imperial: ", curr_unit);
            break;
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

        case "Pint":
            if(quantity>1){
                convert_list.push("ltr");
                convert_list.push(quantity/1.76);
            }else {
                convert_list.push("ml");
                convert_list.push(quantity*568.3);
            }
            break;

        case "Cups":
            if(quantity>4) {
                convert_list.push("ltr");
                convert_list.push(quantity/4.227);
            }else {
                convert_list.push("ml");
                convert_list.push(quantity*236.6);
            }
            break;

        case "Cup":
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

        case "Clove":
            convert_list.push("Clove");
            convert_list.push(+(quantity));
            break;

        case "Cloves":
            convert_list.push("Cloves");
            convert_list.push(+(quantity));
            break;
        
        case "Bulb":
            convert_list.push("Bulb");
            convert_list.push(+(quantity));
            break;

        case "Large":
            convert_list.push("Large");
            convert_list.push(+(quantity));
            break;

        case "Medium":
            convert_list.push("Medium");
            convert_list.push(+(quantity));
            break;

        case "Can":
            convert_list.push("Can");
            convert_list.push(+(quantity));
            break;
        
        case "Handful":
            convert_list.push("Handful");
            convert_list.push(+(quantity));
            break;

        case "Inch":
            convert_list.push("cm");
            convert_list.push(quantity*2.54);
            break;

        case "":
            convert_list.push("");
            convert_list.push(+(quantity));
            break;
        
        default:
            console.log("unit not recognised when converting to metric: ", curr_unit);
            break;
    }

    return convert_list;
}
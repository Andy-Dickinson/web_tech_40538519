var next_appended = false;
var finished_questions = false;
var number_correct = 0;



// last element in answers list is the index of the correct answer
var questions = {"bank":[
    {
        "question":"What is the process of submerging veg or fruits quickly in boiling water called?", 
        "answers":["Soaking", "Blanching", "Shocking", "Flecking", 1]
    },
    {
        "question":"A 'roux' is often added while cooking to help thicken sauces or soups. What are the main ingredients of this sauce?", 
        "answers":["Flour & Butter", "Flour & Eggs", "Flour & Water", "Eggs & Butter", 0]
    },
    {
        "question":"Which of the following kind of pasta has its name meaning 'little worms' in Italian?", 
        "answers":["Spaghetti", "Fidelini", "Vermicelli", "Orzo", 2]
    },
    {
        "question":"Which dish do we have when cooking beef in puff pastry?", 
        "answers":["Baklava", "Beef Wellington", "Shepherd's Pie", "Pot-au-Feu", 1]
    },
    {
        "question":"What were carrots original colour before they were orange?", 
        "answers":["Red", "Green", "Purple", "Blue", 2]
    },
    {
        "question":"Which of the following additives consists of the skin and bones of animals?", 
        "answers":["Custard Powder", "Carrageenan", "Guar Gum", "Gelatin", 3]
    },
    {
        "question":"What are the caramelised juices remaining in the pan after meat is browned called?", 
        "answers":["Vignettes", "Fusilli", "Fond", "Deglace", 2]
    },
    {
        "question":"What shape do we have when 'Julienning' vegetables or fruits?", 
        "answers":["Pentagons", "Round shapes", "Cubes", "Matchsticks", 3]
    },
    {
        "question":"Which of the following seafood is also known as the 'Norwegian Lobster'?", 
        "answers":["Scallops", "Red Mullet", "Plaice", "Scampi", 3]
    },
    {
        "question":"Who is the God of food and drink in the ancient Greek myths?", 
        "answers":["Ambrosia", "Dionysus", "Hera", "Hercules", 0]
    },
    {
        "question":"What does it mean when we 'Macerate' slightly underripe fruits?", 
        "answers":["Heat slightly and soak", "Soak in a mixture of alcohol and sugar", "Soak in a mixture of water and vinegar or lemon juice", "To pull that 'sour' face", 1]
    },
    {
        "question":"Pecorino cheese originally comes from which country?", 
        "answers":["UK", "Italy", "Germany", "France", 1]
    },
    {
        "question":"In French, 'Bouillabaisse' is the name of which kind of stew?", 
        "answers":["Fish", "Beef", "Chicken", "Lamb", 0]
    },
    {
        "question":"To cook pasta 'al dente' perfectly, the texture should be?", 
        "answers":["Crunchy and Crispy", "Moist and Soft", "Tender and Firm", "Charred", 2]
    },
    {
        "question":"'Au jus' is a culinary term originated from France. It loosely means 'cooked in' what?", 
        "answers":["Wine", "Honey", "Natural Juices", "Flour and Water", 2]
    },
    {
        "question":"What is done when zesting a citrus fruit?", 
        "answers":["Squeeze Juice", "Cut the Membranes", "Scrape off the Rind", "Chop into Segments", 2]
    },
    {
        "question":"What is the process called of mixing droplets of vinegar and oil to make them not separate?", 
        "answers":["Extracting", "Emulsifying", "Clarifying", "Mingle", 1]
    },
    {
        "question":"What is a 'Mandoline' used for?", 
        "answers":["Slice Ingredients Thinly", "Puree Ingredients", "Slow-Cook Ingredients", "Crush Ingredients", 0]
    },
    {
        "question":"'Beurre Blanc' is a sauce made from what main ingredients?", 
        "answers":["Butter and Flour", "White Wine, Shallots, and Butter", "Vinegar, Sugar, and Flour", "Cream and Butter", 1]
    },
    {
        "question":"What is the culinary term for improving the presentation of a dish by decorating with ingredients?", 
        "answers":["Dress", "Décor", "Decorate", "Garnish", 3]
    }
]};


/* When answer is wrong, colours green and changes font */
function right(container, button) {
    
    var id = container + "-" + button;
    var selected = document.getElementById(id);
    
    
    var selected_class = "selected" + container;

    // if one in answer container has already been selected
    if(document.getElementsByClassName(selected_class).length >0){
        reset_colour(selected_class);
    } else {
        number_correct++;
        
        build_go_to_next();
    }

    selected.setAttribute("class", selected_class);

    selected.setAttribute("class", selected_class);

    selected.style.background = "green";
    selected.style.fontWeight = "900";
    selected.style.fontSize = "1.5em";

}


/* When answer is wrong, colours red and changes font */
function wrong(container, button) {
    var id = container + "-" + button;
    var selected = document.getElementById(id);
    
    var selected_container = "selected" + container;

    // if one in answer container has already been selected
    if(document.getElementsByClassName(selected_container).length >0){
        reset_colour(selected_container);
    } else {
        build_go_to_next();
    }

    selected.setAttribute("class", selected_container);

    selected.setAttribute("class", selected_container);

    selected.style.background = "#cd0101";
    selected.style.fontWeight = "larger";
    selected.style.fontSize = "1.5em";

}


/* resets colour of button when another button of the same answer container
has been selected. */
function reset_colour(selected_container) {
    var reset = document.getElementsByClassName(selected_container)[0];
    
    // removes "selected" class attribute
    reset.classList.remove(selected_container);
    
    reset.style.background = "#ededed";
    reset.style.fontWeight = "700";
    reset.style.fontSize = "1.2em";
}


/* Builds next button and appends to quiz-container.
If all questions finished, appends a header message to user */
function build_go_to_next() {
    if(!next_appended && !finished_questions) {
        var button = document.createElement("button");
        button.setAttribute("class", "next");
        button.setAttribute("onclick", "add_another_question();");
        button.innerHTML = "Next >";

        document.getElementsByClassName("quiz-container")[0].appendChild(button);
        
        next_appended = true;
    } else if (!next_appended) {
        no_more = document.createElement("h4");

        var percentage = ((number_correct/questions["bank"].length)*100).toFixed(0);
        var message;

        if(percentage>=70){
            message = "Very well done! you got " + percentage + "%";
        } else if(percentage>=40) {
            message = "Congratulations, you got " + percentage + "%";
        } else {
            message = "Better luck next time, you got " + percentage + "%";
        }

        no_more.innerHTML = message;
        document.getElementsByClassName("quiz-container")[0].appendChild(no_more);
        next_appended = true;
    }

}


/* Called when next button pressed.
Checks if questions left to add. Adds question and scrolls window down to new question */
function add_another_question() {

    var new_question;

    var question_bank = questions["bank"];
  
    var quiz_container = document.getElementsByClassName("quiz-container")[0];

    var question_index = document.getElementsByClassName("answer-container").length;

    if(question_index < question_bank.length){
        new_question = document.createElement("h4");
        var question = (question_index+1) + " (of " + question_bank.length + ") " + question_bank[question_index]["question"];

        new_question.innerHTML = question;
        quiz_container.appendChild(new_question);

        new_answer = document.createElement("div");
        new_answer.setAttribute("class", "answer-container");

        build_answer_block(new_answer, question_bank[question_index]["answers"], question_index);
        if(question_index>0){
            quiz_container.removeChild(document.getElementsByClassName("next")[0]);
        }

        quiz_container.appendChild(new_answer);
        next_appended = false;
    } else {
        return;
    }

    // last question
    if((question_bank.length-1 == question_index)) {
        finished_questions = true;
    }

    // scrolls down for question (unless first question)
    if(question_index != 0){
        // scroll down to new question
        window.scrollBy({
            top: screen.height,
            behavior: "smooth"
          });
    }
}


/* Creates buttons for each answer */
function build_answer_block(answer_container, answer_obj, new_index) {
    // last element in answer_obj is the correct answer obj
    var correct_ans_index = answer_obj.length-1;


    for(var i=0; i<=correct_ans_index-1; i++) {
        var new_button = document.createElement("button");
        
        var button_id = new_index + "-" + i;

        new_button.setAttribute("id", button_id);

        if(i == answer_obj[correct_ans_index]){
            var attribute = "right(" + new_index + ", " + i + ")";
        }else {
            var attribute = "wrong(" + new_index + ", " + i + ")";
        }
        
        new_button.setAttribute("onclick", attribute);

        new_button.innerHTML = answer_obj[i];

        answer_container.appendChild(new_button);
    } 
}
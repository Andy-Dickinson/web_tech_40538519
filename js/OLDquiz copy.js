var next_appended = false;
var finished_questions = false;


// last element in answers list is the index of the correct answer
var questions = {"bank":[
    {
        "question":"2. A test question number ", 
        "answers":["2answer1", "2Correct answeer2", "2answer3", "2answer4", 1]
    },
    {
        "question":"3. A test question number ", 
        "answers":["3answer1", "3answeer2", "3Correct answer3", "3answer4", 2]
    }
]};


function right(container, button) {

    if(next_appended){
        reset_colour(container);
    }
    
    var cl_name = "answer " + container + " " + button;
    var selected = document.getElementsByClassName(cl_name)[0];

    selected.setAttribute("class", cl_name + " selected");

    selected.style.background = "green";
    selected.style.fontWeight = "900";
    selected.style.fontSize = "1.5em";

    build_go_to_next();
}


function wrong(container, button) {
    if(next_appended){
        reset_colour(container);
    }
    
    var cl_name = "answer " + container + " " + button;
    var selected = document.getElementsByClassName(cl_name)[0];

    selected.setAttribute("class", cl_name + " selected");

    selected.style.background = "#cd0101";
    selected.style.fontWeight = "larger";
    selected.style.fontSize = "1.5em";

    build_go_to_next();
}


function reset_colour(container) {
    var reset = document.getElementsByClassName(container + " selected")[0];
    var cl_name = reset.getAttribute("class");

    // removes "selected" from classname
    cl_name = cl_name.slice(0,-9);
    
    reset.setAttribute("class", cl_name);
    reset.style.background = "#ededed";
    reset.style.fontWeight = "700";
    reset.style.fontSize = "1.2em";
}


function build_go_to_next() {
    if(!next_appended) {
        var button = document.createElement("button");
        button.setAttribute("class", "next");
        button.setAttribute("onclick", "add_another_question();");
        button.innerHTML = "Next >";

        document.getElementsByClassName("quiz-container")[0].appendChild(button);
    }

    next_appended = true;
}


function add_another_question() {

    var new_question;

    var question_bank = questions["bank"];
  
    var quiz_container = document.getElementsByClassName("quiz-container")[0];

    var question_index = document.getElementsByClassName("answer-container").length-1;

    new_question = document.createElement("h4");
    if(question_index < question_bank.length){
        new_question.innerHTML = question_bank[question_index]["question"];
        quiz_container.appendChild(new_question);

        new_question = document.createElement("div");
        new_question.setAttribute("class", "answer-container");

        build_answer_block(new_question, question_bank[question_index]["answers"], question_index+1);

        next_appended = false;
    } else if ((question_bank.length == question_index) && finished_questions == false) {
        new_question.innerHTML = "There are no more questions.";
        finished_questions = true;
    } else {
        return;
    }

    quiz_container.appendChild(new_question);
}


function build_answer_block(answer_container, answer_obj, new_index) {
    // last element in answer_obj is the correct answer obj
    var correct_ans_index = answer_obj.length-1;


    for(var i=0; i<=correct_ans_index-1; i++) {
        var new_button = document.createElement("button");
        
        var button_class = "answer " + new_index + " " + i;

        new_button.setAttribute("class", button_class);

        if(i == answer_obj[correct_ans_index]){
            var attribute = "right(" + new_index + ", " + i + ")";
        }else {
            var attribute = "wrong(" + new_index + ", " + i + ")";
        }
        
        new_button.setAttribute("onclick", attribute);

        new_button.innerHTML = answer_obj[i];
console.log("new_button: ", new_button);
        answer_container.appendChild(new_button);
    } 
}
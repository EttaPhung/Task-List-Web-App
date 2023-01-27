//Note to console.log that this js page is linked.
console.log("index.js is linked.");

const tm = new TaskManager();
//this checks if the local storage have anything before loading
if (localStorage.getItem('tasks') !==null && localStorage.getItem('currentId') !==null) {
    tm.load();
    //remember that render needs an argument if you want to load from a certain place in the array. So to render the entire list, you need the argument of 0.
    tm.render(0);
}

//new taskform pointer
const newTaskForm = document.querySelector("#taskForm"); 

//Pointer to status buttons in index.html task list
const taskList = document.querySelector('#taskCardsSection');

//Task list form variables
const submitButton = document.querySelector("#submitButton");

const newTaskName = document.querySelector('#newTaskNameInput');
const newPerson = document.querySelector('#newPersonInput');
const newDate = document.querySelector('#newDateInput');
const newDescription = document.querySelector('#newDescriptionInput');
const newTaskStatus = document.querySelector('#newTaskStatusInput');
const formInputs = document.querySelectorAll('.newTaskFormInput');

//alert variables
const nameAlert = document.querySelector('.nameAlert');
const personAlert = document.querySelector('.personAlert');
const dateAlert = document.querySelector('.dateAlert');
const descriptionAlert = document.querySelector('.descriptionAlert');
const allAlerts = (document.getElementsByClassName("alert"));

//function to validate the form fields as required in Task 4
let validFormFieldInput = (data) => {
    //Task 4 asks that the Task Name be printed out to console as a test
    const newTaskNameInput = document.querySelector('#newTaskNameInput');
    const name = newTaskNameInput.value;

    //Not required in Task 4, but just to test if other fields give correct information
    // console.log(`Date: ${document.querySelector('#newDateInput').value} Person: ${document.querySelector('#newPersonInput').value} Desc: ${document.querySelector('#newDescriptionInput').value} Status: ${document.querySelector('#newTaskStatusInput').value}`);

    //Task 4: Code to show errors to users if the forms are not filled out. Note that the "Task Status" is not included as it will always have a status
    if (newTaskName.value == "") {
        nameAlert.hidden = false;
    } else {
        nameAlert.hidden = true;
    }

    if (newPerson.value == "") {
        personAlert.hidden = false;
    } else {
        personAlert.hidden = true;
    }

    if (newDate.value == "") {
        dateAlert.hidden = false;
    } else {
        dateAlert.hidden = true;
    }

    if (newDescription.value == "") {
        descriptionAlert.hidden = false;
    } else {
        descriptionAlert.hidden = true;
    }

    //Task 5: If all alerts are hidden = true, then push new task into task list. This means that if no alerts are shown, then the information on the task form will be added onto the task array
    if (descriptionAlert.hidden && nameAlert.hidden && personAlert.hidden && dateAlert.hidden) {
        console.log("No alerts are shown. Will push task into task array");
        //adding current values in the new task form into the task list
        tm.addTask(newTaskName.value, newDescription.value, newPerson.value, newDate.value, newTaskStatus.value);
        tm.save();

        //this calls the render() after the new task is added under the task list
        tm.render();

        //for loop for clearing out the form after a push to new task list
        for (let i = 0; i < formInputs.length; i++) {
            formInputs[i].value = "";
        }

        //setting the status back to "To Do"
        newTaskStatus.value = "To Do";

        //setting the date back to tomorrow's date
        defaultDate();

    } else {

        //this shows up on the console log when there are errors. Just for troubleshooting purposes
        console.log("Alerts are shown. No pushing the task to the Task List. Please check for errors")
    };
    
    // return false;
}





//submit button listening for the mouse click event
submitButton.addEventListener("click", validFormFieldInput);

//function that moves tasks to the done column and change their color to match
const changeStatus = (data) => {

    console.log(`The data.target.getAttribute("value") is: ${data.target.getAttribute("value")}`)
    //there are errors in the console when the moues isn't clicking something with a value. Not sure if it affects anything to leave it, but just in case, I will add this that exits the function when the value isn't anything we are looking for
    if (data.target.getAttribute("value") == null) {
        return;
    }

    // console.log(`The card's entire HTML is: ${data.target.parentNode.parentNode.parentNode.parentNode.outerHTML}`);
    //This points to the card's html. It is pointing to the parent div of the task card
    let parentTask = data.target.parentNode.parentNode.parentNode.parentNode;

    //checking if the button is clicked
    if (data.target.getAttribute("value").match("Done")) {

        //changing the color of the card into the done column color, gray
        parentTask.querySelector('p').className = "bg-secondary";


        //changing the status of the task card to done
        data.target.parentNode.parentNode.setAttribute("task-status", "Done");

        //hide Status button.
        data.target.parentNode.querySelector('.done-button').setAttribute("hidden", true);

        //changes done/status button into an x.
        data.target.parentNode.querySelector('.done-button').outerHTML = `<button type="button" class="btn-close" aria-label="Close" value="Delete"></button>`;
        
        //hide drop down list
        data.target.setAttribute("hidden", true);

        //This gets the id of the task having their status changed
        let id = Number(parentTask.getAttribute("data-task-id"));

        //This checks the id of the task's status being changed and changes the status of the task list array item as well.
        changeStatusOnList(id, "Done");

        //This appends the task card into the Done column
        document.querySelector("#DoneColumn").appendChild(parentTask);

    } else if (data.target.getAttribute("value").match("Review")) {

        //changing the color of the card into the review column color, red
        parentTask.querySelector('p').className = "bg-danger";

        //changing the status of the task card to Review
        data.target.parentNode.parentNode.setAttribute("task-status", "Review");

        //This gets the id of the task having their status changed
        let id = Number(parentTask.getAttribute("data-task-id"));

        //This checks the id of the task's status being changed and changes the status of the task list array item as well.
        changeStatusOnList(id, "Review");

        //This appends the task card into the review column
        document.querySelector("#ReviewColumn").appendChild(parentTask);

    } else if (data.target.getAttribute("value").match("Doing")) {

        //changing the color of the card into the Doing column color, yellow
        parentTask.querySelector('p').className = "bg-warning";

        //changing the status of the task card to done
        data.target.parentNode.parentNode.setAttribute("task-status", "Doing");

        //This gets the id of the task having their status changed
        let id = Number(parentTask.getAttribute("data-task-id"));

        //This checks the id of the task's status being changed and changes the status of the task list array item as well.
        changeStatusOnList(id, "Doing");

        //This appends the task card into the Doing column
        document.querySelector("#DoingColumn").appendChild(parentTask);

    } else if (data.target.getAttribute("value").match("To Do")) {

        //changing the color of the card into the To Do column color, green
        parentTask.querySelector('p').className = "bg-success";

        //changing the status of the task card to done
        data.target.parentNode.parentNode.setAttribute("task-status", "To Do");

        //This gets the id of the task having their status changed
        let id = Number(parentTask.getAttribute("data-task-id"));

        //This checks the id of the task's status being changed and changes the status of the task list array item as well.
        changeStatusOnList(id, "To Do");

        //adding the task card back into the To Do column of the task list
        document.querySelector("#ToDoColumn").appendChild(parentTask);

    //this checks if the option selected was "Delete". There will be a pop up box asking if the user really wanted to delete the task item.
    } else if (data.target.getAttribute("value").match("Delete")) {

        if (window.confirm("Are you positive you want to delete this task? It cannot be undone.")) {
            let toDelete = data.target.parentNode.parentNode.parentNode.outerHTML;
            let id = Number(toDelete.getAttribute("data-task-id"));
            console.log(`Delete task id: ${toDelete}`);
            console.log(`The id: ${id}`);
            tm.deleteTask(id);

            //this removes the deleted task from the web page
            parentTask.remove();

        } else {
            return;

        }

    } else {

        return;
    }

    //this change the default in the popup status box to empty and hide th dropdown-menu once it is moved.
    // console.log(data.target.className);
    if (data.target.className = "dropdown-menu show") {
        data.target.className = "dropdown-menu";
        data.target.value = "";
    }
    
    //console.log to check to make sure the status attribute of the moved task card is changed
    // setTimeout(console.log(`This is the newly updated task status: ${data.target.parentNode.parentNode.getAttribute("task-status")}`), 10000);

    tm.save();
}

//This function checks the id of the task's status being changed and changes the status of the task list array item as well.
const changeStatusOnList = (id, status) => {
    let task = tm.getTaskById(id);
    task.status = status;
}



//This listens to a change in the drop down menu of the individual tasks in the task list
taskList.addEventListener("click", changeStatus);
// taskList.querySelector("#DoneColumn").addEventListener("click", changeStatus);


//this is a function that sets the form date to tomorrow's date. This will be the default value of our Task form due value.
let defaultDate = () => {
    //this sets it up that tomorrowDate will equal to tomorrow
    let systemDate =  new Date();
    let day = systemDate.getDate() + 1;
    let month = systemDate.getMonth() + 1;
    let year = systemDate.getFullYear();
    let tomorrowDate = `${year}-${month}-${day}`;
    // console.log(`This is the value of date: ${newDate.value}`);
    // console.log(`This is the value of system: ${tomorrowDate}`);
    //this makes it so that the date field of the input field equals to tomorrow's date
    newDate.value = tomorrowDate;
}

//This sets the due date to tomorrow's date on loading
document.addEventListener("load", defaultDate());



const tasks = tm.tasks;
if(tasks.length > 0)
{
    const task = tasks[0];
    const taskHtml = createTaskHtml(task.name, task.description, task.assignedTo, 
        task.dueDate, task.status, task.id);
    
    // console.log(taskHtml);
}

// this was to troubleshoot. This will activate both render and statusColor
// tm.render(0);
// tm.statusColor();
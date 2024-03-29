//Note to console.log that this js page is linked.
console.log("taskManager.js is linked.");


//create Task in HTML
const createTaskHtml = (name, description, assignedTo, dueDate, status, id) => {
    const html = 
`    <div class="card border-0 task-card" data-task-id="${id}" task-status="${status}">
        <div class="d-grid gap-2 d-md-flex justify-content-between">
            <h6 class="card-title text-warning">Due: ${dueDate}</h6>

            <div class="btn-group">
            <button type="button" class="btn btn-primary btn-sm dropdown-toggle done-button" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem; background-color: #a51fff;" data-bs-toggle="dropdown" aria-expanded="false">Status</button>

            <ul class="dropdown-menu select-dropdown">
            <li class="dropdown-item" value=""></li>
            <li class="dropdown-item" value="To Do">To Do</li>
            <li class="dropdown-item" value="Doing">Doing</li>
            <li class="dropdown-item" value="Review">Review</li>
            <li class="dropdown-item" value="Done">Done</li>
            <li class="dropdown-item" value="Delete">Delete</li>
            </ul>
        </div>

        </div>
        <h4 class="card-subtitle">${name}</h4>
        <h6 class="card-subtitle">Person: ${assignedTo}</h6>
        <p class="bg-danger">${description}<br><br><br></p>
    </div>`

    return html;
}

//Task Manager class
class TaskManager {

    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;

    }

    addTask (name, description, assignedTo, dueDate, status = 'To Do')
    {
        this.currentId++;

        const task = {
            id: this.currentId,
            name: name,
            description: description,
            assignedTo: assignedTo,
            dueDate: dueDate,
            status: status
        };
        
        this.tasks.push(task);
        //console lot to troubleshoot. To check what is pushed into the task array
        // console.log(`A new task is pushed into the array: ${task}`);
        
    }

    //Task 7, Step 4. Method to use the id to find the correct task. Will compare an id to ids of all tasks and find matching task, and return it. NOTE: At the moment, it only checks the items on the task list, which is pre-html rendered. That means if you change status with the button, it does not reflect that. Only the original status.
    getTaskById (taskID) {
        let foundTask = "";

        for (let i = 0; i < this.tasks.length; i++) {
            let task = this.tasks[i];

            if (task.id == taskID) {
                let foundTask = task;
                return foundTask;
            }
        }
    }

    //This will render a task into the task list. This will take an parameter x for where in the tasks array (our task list) to start rendering (remember, the arrays starts counting from 0 and up. giving it a 0 will make it render from the beginning). If it starts rendering from a spot where there is already a task rendered, then there will be duplicates. If no arguments are given, then it will render from the last task that was submitted
    render (x = this.tasks.length-1) {
        //local variables representing each of the separate columns of tasks
        let tasksHtmlListToDo = [];
        let tasksHtmlListDoing = [];
        let tasksHtmlListReview = [];
        let tasksHtmlListDone = [];

        //for loop to change the date format. It only does the latest added task list item.
        for (let i = x; i < this.tasks.length; i++) {

            //this is necessary so that a deleted task will not render. If this isn't here, the program breaks because it will try to render a null item.
            if (this.tasks[i] == null) {
                continue;
            }

            //variable to hold the current task object
            let taskVariable = this.tasks[i];

            //setting a variable "date" to equal a formatted date variable from the taskVariable object
            let date = new Date(taskVariable.dueDate);


            //The format done in Task 6 has an error where the due date is in utc and the actual due date becomes your local time zone due date, and so it doesn't match up. So this part is changed to a solution found online and the original is commented out

            
            // console.log(`time3: ${date}`);
            //changing the date variable to a string (From a previous task, buggy)
            // let formattedDate = date.toDateString();

            //found a better solution to the buggy task due date
            let formattedDate = date.toLocaleString('en-US', {timeZone: "UTC", day: "2-digit", month: "short", year: "numeric", weekday: "short"});

            // console.log(`time: ${taskVariable.dueDate}`);
            // console.log(`time2: ${formattedDate}`);
            //changing the object's date into the formatted version of date
            taskVariable.dueDate = formattedDate;

            

            //creating the html string version of the task list object
            let taskHtml = createTaskHtml(taskVariable.name, taskVariable.description, taskVariable.assignedTo, taskVariable.dueDate, taskVariable.status, taskVariable.id);
            
            //if to check if status of task matches "To Do", "Doing", "Review", or "Done", then it gets pushed into that respective taskHtmlList. Have to use taskVariable because it is an object with the status variable and not taskHtml because the latter is just a string with html, it doesn't have a single variable called status
            if (taskVariable.status == "To Do") {
                tasksHtmlListToDo.push(taskHtml);
            }else if (taskVariable.status == "Doing") {
                tasksHtmlListDoing.push(taskHtml);
            } else if (taskVariable.status == "Review") {
                tasksHtmlListReview.push(taskHtml);
            } else if (taskVariable.status == "Done") {
                tasksHtmlListDone.push(taskHtml);
            } else {
                console.log("Error in the status of the tasklist item")
            }
        }

        //setting the arrays with each ID from the task column in index.html
        let columnID = ["ToDoColumn", "DoingColumn", "ReviewColumn", "DoneColumn"];

        //create array that have the 4 column objects as items
        let columnVariable = [tasksHtmlListToDo, tasksHtmlListDoing, tasksHtmlListReview, tasksHtmlListDone];

        //a for loop that loops through all our column IDs and put int their respective task in that column.
        for (let i = 0; i < columnID.length; i++) {

            //joining \n in between each task item
            let tasksHtml = columnVariable[i].join("\n\n");
            
            //console log to check if tasksHtml works
            // console.log(`This will be added into the html of the columns: ${tasksHtml}`);
            
            //create a variable pointing to the task's relative column that they will be put into
            let pointer = document.getElementById(columnID[i]);

            //creating element with the objects being added
            let newCardHTML = document.createElement("div");

            //setting our string tasksHtml into the newCardHTML. Have to do this because appending our string straight onto the columns result in errors
            newCardHTML.innerHTML = tasksHtml;
            
            //now we append our HTML into their respective task columns
            pointer.appendChild(newCardHTML);
        }
        //this calls the color function to make sure the cards are of the right color via boostrap
        this.statusColor();

        this.changeDoneButton();

    }

    statusColor () {

        //setting the arrays with each ID from the task column in index.html
        let columnID = ["ToDoColumn", "DoingColumn", "ReviewColumn", "DoneColumn"];
        //array with the boostrap background color in order of status
        let colorArray = ["bg-success", "bg-warning", "bg-danger", "bg-secondary"]

        //a for loop to change the cards under
        for (let i = 0; i < columnID.length; i++) {
            
            //a pointer for all the p elements in the status card column
            let taskDesc = document.getElementById(columnID[i]).querySelectorAll('p');

            //another for loop to cycle through each of the cards for their p element and changing the class so that it is the right color via boostrap;
            for (let j = 0; j < taskDesc.length; j++){
                taskDesc[j].className = colorArray[i];
            }
        }
    }

    //this goes and changes the done button when the item renders into the done column. It turns into an x
    changeDoneButton () {
        //This only happens for tasks going into the done column, this is to hide the task change button
        let buttons = document.querySelector('#DoneColumn').querySelectorAll('.done-button');
        //console.log(buttons);
        for (let i = 0; i < buttons.length; i++) {
            //changes the done button into an x that will allow the user to delete the task
            buttons[i].outerHTML = `<button type="button" class="btn-close" aria-label="Close" value="Delete"></button>`;
        }
    }
    
    //task 8 save method
    save () {
        const tasksJson = JSON.stringify(this.tasks);
        localStorage.setItem('tasks', tasksJson);
        
        const currentId = this.currentId.toString();
        localStorage.setItem('currentId', currentId);
    }
    
    //load method
    load () {

        if(localStorage.getItem('tasks'))
        {
            const tasksJson = localStorage.getItem('tasks');
            this.tasks = JSON.parse(tasksJson);
        }

        if(localStorage.getItem('currentId'))
        {
            const currentId = localStorage.getItem('currentId');
            this.currentId = parseInt(currentId);
        }
    }

    //deletes a task using their ID
    deleteTask (taskID) {
        //create an array to hold the new list of task
        let newTasks = [];
        //array to hold the current version of the task list
        let task = this.tasks;
        //for loop to cycle through each task item, checks for their id, and if it matches, remove that from the this.task array
        for (let i = 0; i < task.length; i++) {

            //this is necessary so that the for loop will not bother with a deleted task. If this isn't here, the program breaks because it will try to copy a null item.
            if (this.tasks[i] == null) {
                continue;
            }

            //this checks if the task id of the deleted item matches the id of the task being cycled through
            if (task[i].id !== taskID) {
                newTasks.push(task[i]);
            }
        }

        //new task list overwrites the original task list
        this.tasks = newTasks;
    }
}


//export module for test.js
module.exports = TaskManager;
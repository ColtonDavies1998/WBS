//main task object declaration
const task = {
  taskId: null,
  taskName: null,
  subTasks: null,
  toString: function () {
    return this.taskId + ") " + this.taskName;
  }
}
//sub task object declaration
const subTask = {
  taskId: null,
  taskName: null,
  subTasks: null,
  parentTaskId: null,
  toString: function () {
    return this.parentTaskId + "." + this.taskId + ") " + this.taskName;
  }
}

//array of object tasks
const taskList = [];

//global counter
var counter = 1;

//old string for edit
var tempTaskName = '';

//temp for event
var tempEvent = null;


// temp holder for id
var tempId = '';


//task input event listener
document.getElementById("newTaskSubmitButton").addEventListener("click", submitTask);
document.getElementById("editTaskSubmitButton").addEventListener("click", editTaskSubmit);
document.getElementById("addSubTaskSubmitButton").addEventListener("click", addSubTaskSubmit);


//functions

/*The submitTask() function is called with the user clicks the submit button, This function
creates a new task object and sets its name id and subtask attributes. This function then creates
an LI tag and stores the taskName attribute as the LI value along with an add sub task and delete buttons.
At the end this function appends that LI tag to the UL in the html file.
*/
function submitTask() {
  let newTaskName = document.getElementById("taskInput").value;
  //creates objects and assigns values to its attributes
  let newTask = Object.create(task);
  newTask.taskId = counter;
  newTask.taskName = newTaskName.toString();
  newTask.subTasks = [];
  taskList.push(newTask);
  counter++;
  document.getElementById("taskInput").value = "";

  //creates the LI element
  let node = document.createElement("LI");

  //creates the delete button INPUT and adds attributes, a class and an event listener
  let deleteNode = document.createElement("input");
  deleteNode.setAttribute("type", "submit");
  deleteNode.setAttribute("value", "delete");
  deleteNode.className = "delete";
  deleteNode.addEventListener("click", deleteTask);

  //creates the addSubTask button INPUT and adds attributes, a class and an event listener
  let addSubTaskNode = document.createElement("input");
  addSubTaskNode.setAttribute("type", "submit");
  addSubTaskNode.setAttribute("value", "add");
  addSubTaskNode.className = "add";
  addSubTaskNode.addEventListener("click", addSubTask);

  //creates the edit button and adds the attributes and a class and an event listener
  let editTaskNode = document.createElement("input");
  editTaskNode.setAttribute("type", "submit");
  editTaskNode.setAttribute("value", "edit");
  editTaskNode.className = "edit";
  editTaskNode.addEventListener("click", editTaskMode);

  //creates the text node for the written content inside the LI
  let textNode = document.createTextNode(newTask.toString());

  //appends the text first then the addSub button and then the delete button to the LI tag
  node.appendChild(textNode);
  node.appendChild(editTaskNode);
  node.appendChild(addSubTaskNode);
  node.appendChild(deleteNode);

  //gives a class name to the LI element and adds an event listener then appends it to the UL
  node.className = 'task';
  document.getElementById("mainList").appendChild(node);


}

/*The editTaskMode() function is called when the user clicks the text in the task LI.
This function turns off the disable for the edit text field and button. Then sends the content
of what was clicked into the value part of the input. but before this, i have to remove the task id and ). From here the user can change the value to what they want.

Parameter: e -> event parameter, passes the contents of the tag that was clicked.
*/
function editTaskMode(e) {
  //display the input section
  document.getElementById("editPanel").style.display = "inline";
  //breaks down the string splits the id into a temp holder and same for the task name
  var goodString = e.target.parentElement.innerText.toString();
  goodString = goodString.substring(goodString.indexOf(' ') + 1);
  document.getElementById("editInput").value = goodString;
  tempTaskName = goodString;
  tempId = e.target.parentElement.innerText.substr(0, e.target.parentElement.innerText.indexOf(')'));

}

/*The editTaskSubmit() function is called when the edit button has been clicked, the 
new task name from the edit input is then put into the proper object and then the LI
element on the screen is correctly edited.


NOTE MUST ADD: must add a way to validate user input, cant be done on HTML side, must
make sure that the edit input field is not empty
*/
function editTaskSubmit() {
  //grabs the value from the input tag
  let newStr = document.getElementById("editInput").value;
  //resets the input tag
  document.getElementById("editInput").value = "";
  //creates a temp variable of all the tasks
  let tempTaskList = document.getElementsByClassName("task");
  //created temp object
  let tempObj = {};

  //This loop runs through the official object array of tasks and looks for a match from the 
  //temp id
  for (var b = 0; b < taskList.length; b++) {
    if (taskList[b].taskId === parseInt(tempId)) {
      taskList[b].taskName = newStr;
      tempObj = taskList[b];
      break;
    }
  }

  //This loop goes through an array of items from the LI tags on the screen and changes the correct LI
  for (var a = 0; a < tempTaskList.length; a++) {
    if (tempTaskList[a].innerText.toString().includes(tempTaskName)) {
      tempTaskList[a].childNodes[0].nodeValue = tempObj.toString();
      break;
    }
  }

  //hide the input section
  document.getElementById("editPanel").style.display = "none";

  //resets the global temp name and id
  tempTaskName = "";
  tempId = 0;

}

/*The deleteTask() function is called when the user hits the delete button of an LI element.
This function removes the LI element which when clicked is the parent element. Since the parent
gets deleted so does everything inside it.

Parameter: e -> event parameter, passes the contents of the tag that was clicked.

*/
function deleteTask(e) {
  //sets the task name and id of the item that is being deleted
  let deleteTaskName = e.target.parentElement.innerText.toString();
  let deleteTaskId = deleteTaskName.substring(0, deleteTaskName.indexOf(")"))

  //converts task id from string to int
  deleteTaskId = parseInt(deleteTaskId);
  //removes the id and ) from the name of the task to be deleted
  deleteTaskName = deleteTaskName.substring(deleteTaskName.indexOf(' ') + 1);

  //This loop goes through the main task list comparing the name and id of the item that has been 
  //chosen to be deleted, when the item is found it is removed from the array.
  for (var a = 0; a < taskList.length; a++) {
    if (taskList[a].taskName == deleteTaskName && taskList[a].taskId == deleteTaskId) {
      taskList.splice(a);
      break;
    }
  }
  //This removes the targeted item from the UL, by removing the parent of the delete button that was clicked
  e.target.parentElement.remove();
}

/*The addSubTask() function is called when the users clicks the "add" button on one of the tasks.
This function holds the event and stores it in a temp variable which will later be used to help
append sub tasks to the task clicked. This function displays the form, and gets the name and id
of the item clicked and stores them into different temp variables.

Parameter: e -> event parameter, passes the contents of the tag that was clicked.

*/
function addSubTask(e) {
  //stores the click event in the tempEvent variable
  tempEvent = e;
  //displays the form
  document.getElementById("addSubTaskPanel").style.display = "inline";
  //this gets the name of the task that has been clicked and stores it in a temp variable
  let tempString = e.target.parentElement.innerText.toString();
  tempString = tempString.substring(tempString.indexOf(' ') + 1);
  tempTaskName = tempString;
  //this grabs the id of the task clicked and stores it in a temp variable
  tempId = e.target.parentElement.innerText.substr(0, e.target.parentElement.innerText.indexOf(')'));

}

/*The addSubTaskSubmit() function is called When the user clicks the add button on the subTask submit
form. This function takes what the user has input and creates a new object of the type "subTask".
What the user has input is then taken and put into the object. That object is then stored in the
SubTask array of the proper task. After that it is then displayed onto the string under the correct task.
*/
function addSubTaskSubmit() {
  //grabs the input from the user
  let subTaskName = document.getElementById("subTaskInput").value;

  //goes through the array of taskLists
  for (var a = 0; a < taskList.length; a++) {

    //looks for the task list that matches not only the name but the id
    if (taskList[a].taskId == tempId && taskList[a].taskName == tempTaskName) {
      //once found creates a new object of subTask and fills out all of its attributes
      let newTask = Object.create(subTask);
      newTask.taskId = taskList[a].subTasks.length + 1;
      newTask.taskName = subTaskName.toString();
      newTask.subTasks = [];
      newTask.parentTaskId = taskList[a].taskId;

      /*If the attribute subTask of taskList[a] is 0, it means there are no sub tasks.
      This makes us have to create a new UL and add the information to an li which appends
      to that UL */
      if (taskList[a].subTasks === undefined || taskList[a].subTasks.length === 0) {
        //creates UL and gives it a class name
        let listNode = document.createElement("UL");
        listNode.className = "subList";
        //creates LI and gives it a class anme
        let subTaskNode = document.createElement("LI");
        subTaskNode.className = "task";

        //creates the delete button INPUT and adds attributes, a class and an event listener
        let deleteNode = document.createElement("input");
        deleteNode.setAttribute("type", "submit");
        deleteNode.setAttribute("value", "delete");
        deleteNode.className = "delete";
        deleteNode.addEventListener("click", deleteTask);

        //creates the addSubTask button INPUT and adds attributes, a class and an event listener
        let addSubTaskNode = document.createElement("input");
        addSubTaskNode.setAttribute("type", "submit");
        addSubTaskNode.setAttribute("value", "add");
        addSubTaskNode.className = "add";
        addSubTaskNode.addEventListener("click", addSubTask);

        //creates the edit button and adds the attributes and a class and an event listener
        let editTaskNode = document.createElement("input");
        editTaskNode.setAttribute("type", "submit");
        editTaskNode.setAttribute("value", "edit");
        editTaskNode.className = "edit";
        editTaskNode.addEventListener("click", editTaskMode);

        //creates textnode
        let textNode = document.createTextNode(newTask.toString());

        //appends everything together
        subTaskNode.appendChild(textNode);
        subTaskNode.appendChild(editTaskNode);
        subTaskNode.appendChild(addSubTaskNode);
        subTaskNode.appendChild(deleteNode);
        listNode.appendChild(subTaskNode);
        //appends the ul to the Task that was clicked
        tempEvent.target.parentElement.appendChild(listNode);

      }
      /*This else is if the subTask array length is greater than 0, which means it already has a subtask and a UL created, so we dont need to create the ul again just append the LI to the existing UL */
      else {
        /*NOTE: Not finished yet all the create of the LI does not need to be done twice.
         move that code out if this set of if statements when this else is finished*/
      }
      //push the new created subtask into the object
      taskList[a].subTasks.push(newTask);
    }
  }

  //gets rid of the value in the subtask input and hides the sub task box
  document.getElementById("subTaskInput").value = "";
  document.getElementById("addSubTaskPanel").style.display = "none";

  //rests the tempEvent back to null
  tempEvent = null;
}

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
    return this.taskId + ") " + this.taskName;
  }
}

//array of object tasks
const taskList = [];

//global counter
var counter = 1;

//old string for edit
var oldTaskName = '';

// temp holder for id
var tempId = '';



//task input event listener
document.getElementById("newTaskSubmitButton").addEventListener("click", submitTask);
document.getElementById("editTaskSubmitButton").addEventListener("click", editTaskSubmit);


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
  //creates the text node for the written content inside the LI
  let textNode = document.createTextNode(newTask.toString());

  //appends the text first then the addSub button and then the delete button to the LI tag
  node.appendChild(textNode);
  node.appendChild(addSubTaskNode);
  node.appendChild(deleteNode);

  //gives a class name to the LI element and adds an event listener then appends it to the UL
  node.className = 'task';
  node.addEventListener("click", editTaskMode);
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

  //breakdowns the string splits the id into a temp holder and same for the task name
  var goodString = e.target.innerText;
  goodString = goodString.substring(goodString.indexOf(' ') + 1);
  document.getElementById("editInput").value = goodString;
  oldTaskName = e.target.innerText.split(")").pop();
  tempId = e.target.innerText.substr(0, e.target.innerText.indexOf(')'));
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
    if (tempTaskList[a].innerText.toString().includes(oldTaskName)) {
      tempTaskList[a].childNodes[0].nodeValue = tempObj.toString();
      break;
    }
  }

  //hide the input section
  document.getElementById("editPanel").style.display = "none";

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


function addSubTask() {
  console.log("node added");
}
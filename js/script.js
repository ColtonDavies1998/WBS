//main task object declaration
const task = {
  taskId: null,
  taskName: null,
  subTasks: null,
  level: null,
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
var tempTaskName = '';

// temp holder for id
var tempId = '';

//task input event listener
document.getElementById("newTaskSubmitButton").addEventListener("click", submitTask);
document.getElementById("editTaskSubmitButton").addEventListener("click", editTaskSubmit);
document.getElementById("addSubTaskSubmitButton").addEventListener("click", addSubTaskSubmit);
document.getElementById("exitButtonSubTask").addEventListener("click", hideSubTask)
document.getElementById("exitButtonEdit").addEventListener("click", hideEditTask)

//functions

/*The hideEditTask() function is called when the button with the "X" in the edit task form is clicked. This is for 
when the user wants to hid the form, it cleans the value and hides the form
*/
function hideEditTask() {
  document.getElementById("editInput").value = '';
  document.getElementById("editPanel").style.display = "none";
}

/*The hideSubTask() function is called when the button with the "X" in the sub task form is clicked. This is for 
when the user wants to hid the form, it cleans the value and hides the form
*/
function hideSubTask() {
  document.getElementById("subTaskInput").value = '';
  document.getElementById("addSubTaskPanel").style.display = "none";
}

/*The submitTask() function is called with the user clicks the submit button, This function
creates a new task object and sets its name id and subtask attributes. This function then creates
an LI tag and stores the taskName attribute as the LI value along with an add sub task and delete buttons.
At the end this function appends that LI tag to the UL in the html file.
*/
function submitTask() {

  var validateResult = validateForm(document.getElementById("taskInput").value);

  if (validateResult == "Success") {
    document.getElementById("taskSubmitError").innerText = "";

    let newTaskName = document.getElementById("taskInput").value;
    //creates objects and assigns values to its attributes
    let newTask = Object.create(task);
    newTask.taskId = counter.toString();
    newTask.taskName = newTaskName.toString();
    newTask.subTasks = [];
    newTask.level = 1;
    taskList.push(newTask);
    counter++;
    document.getElementById("taskInput").value = "";

    removeList();
    displayList();

  } else {
    document.getElementById("taskSubmitError").innerText = validateResult;
  }

}

/*The editTaskMode() function is called when the users clicks the "edit" button on a task. This displays the edit
form and gets the task that the user wants to changes and stores its information

Parameter: e -> event parameter, passes the contents of the tag that was clicked.
*/
function editTaskMode(e) {
  document.getElementById("editPanel").style.display = "inline";

  let tempEditId = e.target.parentElement.innerText.toString();
  let EditArray = tempEditId.split(")");
  tempEditId = EditArray[0];
  let editObj = {};
  for (var a = 0; a < taskList.length; a++) {
    if (taskList[a].taskId == tempEditId) {
      editObj = taskList[a];
      break;
    }
  }
  tempTaskName = editObj.taskName;
  tempId = editObj.taskId;
  document.getElementById("editInput").value = editObj.taskName;
}


/*The editTaskSubmit() function is called when the users clicks the "edit" button on the edit form. This takes
the changes that the user has made and goes through the Task list array and searches from the object that matches,
the original id and task name and then replaces the task name with what the user has entered into the field.
removeList and displayList functions are called to display the corrected list to the screen.

*/
function editTaskSubmit() {

  var validateResult = validateForm(document.getElementById("editInput").value);

  if (validateResult == "Success") {
    for (var a = 0; a < taskList.length; a++) {
      if (taskList[a].taskId == tempId && taskList[a].taskName == tempTaskName) {
        taskList[a].taskName = document.getElementById("editInput").value;
        break;
      }
    }

    document.getElementById("editInput").value = '';
    document.getElementById("editPanel").style.display = "none";

    tempTaskName = '';
    tempId = '';

    removeList();
    displayList();

  } else {
    document.getElementById("editError").innerText = validateResult;
  }

}

/*The deleteTheTask() function is called when the users clicks the "delete" button on one of the tasks.
This function gets the id and task name of the item that has been clicked. The function then goes through the array to get the proper object from the array, then goes through the array again to delete. At the end of the function the
removeList and displayList functions are called to display the corrected list to the screen.

Parameter: e -> event parameter, passes the contents of the tag that was clicked.

*/
function deleteTheTask(e) {

  let tempDeleteId = e.target.parentElement.innerText.toString();
  let deleteArray = tempDeleteId.split(")");
  tempDeleteId = deleteArray[0];


  let deleteObj = {};
  for (var a = 0; a < taskList.length; a++) {
    if (taskList[a].taskId == tempDeleteId) {
      deleteObj = taskList[a];
      break;
    }
  }


  for (var b = 0; b < taskList.length; b++) {
    if (taskList[b].taskId == deleteObj.taskId) {
      taskList.splice(b, 1);
      break;
    }
  }


  removeList();
  displayList();


}

/*The addSubTask() function is called when the users clicks the "add" button on one of the tasks.
This function displays the form, and gets the name and id of the item clicked and stores them into different temp variables to later be used to change the data in the taskList array

Parameter: e -> event parameter, passes the contents of the tag that was clicked.

*/
function addSubTask(e) {
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
form. This function takes what the user has input and creates a new object of the type "task".
What the user has input is then taken and put into the object. That object is then stored in the
taskList array. After that it is then displayed to the screen.
*/
function addSubTaskSubmit() {

  var validateResult = validateForm(document.getElementById("subTaskInput").value);

  if (validateResult == "Success") {
    //grabs the input from the user
    let subTaskName = document.getElementById("subTaskInput").value;
    //goes through the array of taskLists
    for (var a = 0; a < taskList.length; a++) {
      //looks for the task list that matches not only the name but the id
      if (taskList[a].taskId == tempId && tempTaskName.includes(taskList[a].taskName) == true) {
        //once found creates a new object of subTask and fills out all of its attributes
        let newTask = Object.create(task);
        newTask.parentTaskId = taskList[a].taskId;
        newTask.taskId = newTask.parentTaskId;
        newTask.taskId = newTask.taskId.toString() + "." + (taskList[a].subTasks.length + 1);
        newTask.taskName = subTaskName.toString();
        newTask.subTasks = [];
        newTask.level = taskList[a].level + 1;



        //push the new created subtask into the object
        taskList[a].subTasks.push(newTask.taskId);

        taskList.push(newTask);

        break;

      }
    }

    //gets rid of the value in the subtask input and hides the sub task box
    document.getElementById("subTaskInput").value = "";
    document.getElementById("addSubTaskPanel").style.display = "none";

    tempId = '';
    tempTaskName = '';

    removeList();
    displayList();

  } else {
    document.getElementById("addSubTaskError").innerText = validateResult;
  }

}


/*The removeList() function is called anytime there is a change in the array list of tasks. For example 
if the user edits or deletes an item, this function is called after the removeList function is called. This function
re displays the correct information to the screen, with the changes made. It also removes the objects that have been deleted from the taskList array.
*/
function displayList() {

  //This loop runs through and displays all level 1 tasks
  for (var a = 0; a < taskList.length; a++) {
    if (taskList[a].level == 1) {

      //creates the LI element
      let node = document.createElement("LI");

      //creates the delete button INPUT and adds attributes, a class and an event listener
      let deleteNode = document.createElement("input");
      deleteNode.setAttribute("type", "submit");
      deleteNode.setAttribute("value", "delete");
      deleteNode.className = "delete";
      deleteNode.addEventListener("click", deleteTheTask);

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
      let textNode = document.createTextNode(taskList[a].toString());

      //subtask UL
      let taskListNode = document.createElement("UL");
      taskListNode.id = "subTaskList" + taskList[a].taskId;

      //appends the text first then the addSub button and then the delete button to the LI tag
      node.appendChild(textNode);
      node.appendChild(editTaskNode);
      node.appendChild(addSubTaskNode);
      node.appendChild(deleteNode);
      node.appendChild(taskListNode);

      node.className = 'task';
      document.getElementById("mainList").appendChild(node);

    }
  }

  //gets all the level one tasks that have been printed onto the screen
  let tempDisplayTaskList = document.getElementsByClassName("task");

  //this loop goes through the tasks that are already displayed on screen and appends the rest of the tasks, which are subtasks, to them.
  for (var c = 0; c < tempDisplayTaskList.length; c++) {
    //once all the sub tasks of a level are appended then this loop gets a list of everything new that is
    //displayed on the screen and see if they have sub tasks to display
    tempDisplayTaskList = document.getElementsByClassName("task");

    let tempString = tempDisplayTaskList[c];
    //This loop runs through the taskList object displaying out all the tasks.
    for (var b = 0; b < taskList.length; b++) {
      //as long as the task is not a level 1 task (which is the first things to be displayed on the screen) then attempt to place its sub tasks to the screen
      if (taskList[b].level != 1) {
        let tempObj = taskList[b];
        tempId = tempDisplayTaskList[c].innerText.substr(0, tempDisplayTaskList[c].innerText.indexOf(')'));

        var goodString = tempDisplayTaskList[c].innerText.toString();
        goodString = goodString.substring(goodString.indexOf(' ') + 1);
        tempTaskName = goodString;

        if (taskList[b].parentTaskId == tempId) {

          //creates the LI element
          let subNode = document.createElement("LI");

          //creates the delete button INPUT and adds attributes, a class and an event listener
          let subDeleteNode = document.createElement("input");
          subDeleteNode.setAttribute("type", "submit");
          subDeleteNode.setAttribute("value", "delete");
          subDeleteNode.className = "delete";
          subDeleteNode.addEventListener("click", deleteTheTask);

          //creates the addSubTask button INPUT and adds attributes, a class and an event listener
          let subAddSubTaskNode = document.createElement("input");
          subAddSubTaskNode.setAttribute("type", "submit");
          subAddSubTaskNode.setAttribute("value", "add");
          subAddSubTaskNode.className = "add";
          subAddSubTaskNode.addEventListener("click", addSubTask);

          //creates the edit button and adds the attributes and a class and an event listener
          let subEditTaskNode = document.createElement("input");
          subEditTaskNode.setAttribute("type", "submit");
          subEditTaskNode.setAttribute("value", "edit");
          subEditTaskNode.className = "edit";
          subEditTaskNode.addEventListener("click", editTaskMode);

          //creates the text node for the written content inside the LI
          let subTextNode = document.createTextNode(taskList[b].toString());

          //subtask UL
          let subTaskListNode = document.createElement("UL");
          subTaskListNode.id = "subTaskList" + taskList[b].taskId;

          //appends the text first then the addSub button and then the delete button to the LI tag
          subNode.appendChild(subTextNode);
          subNode.appendChild(subEditTaskNode);
          subNode.appendChild(subAddSubTaskNode);
          subNode.appendChild(subDeleteNode);
          subNode.appendChild(subTaskListNode);

          subNode.className = 'task';
          tempString.lastChild.appendChild(subNode);

        }
      }
    }
  }

  //This last section is for when the user has deleted an item. This section compares the length of the array of all the tasks displayed on the screen to the array length of the object list. If the object array is bigger than the task display list than that means items have been deleted.
  var listDisplay = document.getElementsByClassName("task");

  if (listDisplay.length != taskList.length) {
    for (var a = 0; a < taskList.length; a++) {
      var found = false
      for (var b = 0; b < listDisplay.length; b++) {
        var tempDisplayTask = listDisplay[b].innerText;
        tempId = tempDisplayTask.substr(0, tempDisplayTask.indexOf(')'));
        tempTaskName = tempDisplayTask.substring(tempDisplayTask.indexOf(' ') + 1);
        //if the item is found by checking the id and the task name then found = true and the loop breaks.
        if (taskList[a].taskId == tempId && taskList[a].taskName == tempTaskName) {
          found = true;
          break;
        }
      }
      //if found is not equal to true it means it was not displayed on the screen, which means it must be deleted.
      if (found != true) {
        taskList.splice(a);
      }
    }
  }

}

/*The removeList() function is called anytime there is a change in the array list of tasks. For example 
if the user edits or deletes an item, this function is called to remove everything off the screen, so it can be 
re displayed later with the correct information. All this function does is gets the element with id #mainList and
deletes all of its child nodes until the the UL is empty.
*/
function removeList() {
  var myNode = document.getElementById("mainList");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
}


/*The validateForm() function is called whenever the user is required to enter in data. This function wil be used to validate and make sure the user enters in the proper data.
*/
function validateForm(input) {
  if (input.replace(/^\s+|\s+$/g, '').length == 0) {
    return "input box cannot be empty";
  } else {
    return "Success";
  }
}
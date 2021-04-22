/*
 ** 04-20-21 jdj: js to support todo list aplication.
 **
 **
 **
 */


/*
 **                       Routines controlled from HTML
 */

/*
 ** .onloadEnvInit() called when body is loaded.
 ** .could prepare local storage but "get" is setup to create an empty dataset
 **  if it doesn't exist so the first call from any level would work.
 ** .Jason example has trigger tool tips on hover.  Don't know what that is nor does requirements doc state.
 ** .Jason lesson has "CURRENT TASKS ##" from a screen shot I grabbed.  Don't see it in the specs.
 */
function onloadEnvInit() {

    displayTaskList();

    return null;

}

/*
 ** .add a new task to the dataset.
 ** .called from table header button
 */
function tblCreateTask(formData) {
    let newTaskData = createTaskFormDataToObj();

    validateNewTask(newTaskData);
    if (newTaskData.dataOK == false) {
        return;
    }
    tblStoreNewTask(newTaskData);

    displayTaskList();
} /* end of tblCreateTask */


/*
 ** .called from the table header button
 **
 ** .using sweet alert for yes,no, cancel prompt to delete all data.
 ** .found out control is threaded.  Once called this js exits even
 **  before the swal window is shown.
 **
 **
 */
function tblClearAllTasks() {

    let ans = swalYesNoPrompt("Delete All Data !?");

    if (ans == false) {
        return;
    }
    //   showDebugMsg("clearalltasks called: ans to delete ");

    return null;
} /* end of tblClearAllTasks() */


/*
 ** .called from table row control icon to mark the row complete and strike through
 **
 ** .html: :::::::::::::::::::::::::::::::::
 **  pnode.pnode.pnode   template
 **        pnode.pnode     tr
 **                        td
 **                        td
 **                        etc.
 **              pnode    td class=btn-group
 **                           button
 **                  (this)   button
 **                           button
 ** ::::::::::::::::::::::::::::::::::::::::
 ** 
 ** rowItem.parentElement.parentElement   : gets the tr row array with the cells
 **     td taskid    .child[0]
 **     td title     .child[1]
 **     td created   .child[2]
 **     td dueDate   .child[3]
 **     td db_id     .child[4]
 **     td icons     .child[5]
 **
 */

/* leaving this here as reference and cutpaste when needed.
       rowItem;
       let test = rowItem.parentNode;
       let test2 = rowItem.parentNode.parentNode;
       let test5 = test.parentNode;
       let test3 = rowItem.parentElement;
       let test4 = rowItem.parentElement.parentElement;
       let test6 = test3.parentElement;
       let test7 = rowItem.parentElement.parentElement.children[0].innerText;
*/

function tblRowMarkComplete(rowItem) {

    let dataSet = getDataFromStorage();


    let rowTaskId = rowItem.parentElement.parentElement.children[0].innerText;
    let tstrowTaskId = getTaskIdFromElement(rowItem);

    let rowtask = dataSet.find(t => t.id == rowTaskId);
    rowtask.completed = true;

    putDataToStorage(dataSet);

    displayTaskList()
    //  showDebugMsg("mark complete called");
    return null;
} /* end of tblRowMarkComplete */

/*
 ** .called from table row control icon to edit update the current task item
 */
function tblRowEditTask(rowItem) {

    let modal = document.getElementById("editTaskModal");

    $('#editTaskModal').modal('show');
    //    modal.style.display = "block";

    let test = 0;
    return null;
} /* end of tblRowMarkComplete */

/*
 ** .called from table row control to delete the current task item.
 */


/*
 ** .see further notes within swalConfirmTaskDelete control logic.
 ** .This is called from html onclick to delete a task.
 ** .swal will confirm the action.
 ** .swal will call back to DeleteTaskByElement
 **
 */
function tblRowDeleteTask(rowItem) {

    swalConfirmTaskDelete("Delete this item?", rowItem);
    //  DeleteTaskByElement(rowItem);  testig only
    return null;

} /* end of tblRowDeleteTask() */


function DeleteTaskByElement(rowItem) {

    let dataSet = getDataFromStorage();
    let newDataSet = [];
    let rowTaskId = rowItem.parentElement.parentElement.children[0].innerText;
    let tstrowTaskId = getTaskIdFromElement(rowItem);

    for (let x = 0; x < dataSet.length; x++) {
        if (dataSet[x].id == rowTaskId) {
            continue;
        }
        newDataSet.push(dataSet[x]);
    }

    putDataToStorage(newDataSet);

    displayTaskList()

    return null;
} /* end of tblRowMarkComplete */


/*
 **
 **                       end of Routines html controlled routines
 */





/*
 ** .called from table row control icon to mark the row complete and strike through
 **
 ** .html: :::::::::::::::::::::::::::::::::
 **  pnode.pnode.pnode   template
 **        pnode.pnode     tr
 **                        td
 **                        td
 **                        etc.
 **              pnode    td class=btn-group
 **                           button
 **                  (this)   button
 **                           button
 ** ::::::::::::::::::::::::::::::::::::::::
 ** 
 ** rowItem.parentElement.parentElement   : gets the tr row array with the cells
 **     td taskid    .child[0]
 **     td title     .child[1]
 **     td created   .child[2]
 **     td dueDate   .child[3]
 **     td db_id     .child[4]
 **     td icons     .child[5]
 **
 */

/* leaving this here as reference and cutpaste when needed.
       rowItem;
       let test = rowItem.parentNode;
       let test2 = rowItem.parentNode.parentNode;
       let test5 = test.parentNode;
       let test3 = rowItem.parentElement;
       let test4 = rowItem.parentElement.parentElement;
       let test6 = test3.parentElement;
       let test7 = rowItem.parentElement.parentElement.children[0].innerText;
*/

function getTaskIdFromElement(currElement) {

    let rowTaskId = currElement.parentElement.parentElement.children[0].innerText;
    let rowDBId = currElement.parentElement.parentElement.children[4].innerText;

    return rowTaskId;
}

/*
 ** .called from apptodo.html table head button.
 */
function displayTaskList() {
    const template = document.getElementById("TaskList-Table-Template");
    const resultsBody = document.getElementById("resultsBody");

    let dataSet = getDataFromStorage();

    setTaskTitleCount();

    resultsBody.innerHTML = "";

    for (let x = 0; x < dataSet.length; x++) {
        let dataRow = document.importNode(template.content, true);

        /* throwing an error. */
        if (dataSet[x].completed == true) {
            dataRow.getElementById("TaskListRow").setAttribute("class", "completed");
        }
        /* */

        dataRow.getElementById("taskid").textContent = dataSet[x].id;
        dataRow.getElementById("title").textContent = dataSet[x].title;
        dataRow.getElementById("created").textContent = formatDateMMDDYYYY(dataSet[x].created);
        dataRow.getElementById("dueDate").textContent = formatDateMMDDYYYY(dataSet[x].dueDate);
        dataRow.getElementById("db_id").textContent = dataSet[x].id;

        resultsBody.appendChild(dataRow);


    }

    return null;

} /* end of displaytaskList */


function setTaskTitleCount() {
    let titleMsg = document.getElementById("TasksTitleCount");
    let taskCount = 0;

    titleMsg.innerText = "";

    taskCount = getTaskTitleCount();
    titleMsg.innerText = `Current Tasks (${taskCount})`;

    return null;
}

function getTaskTitleCount() {

    let dataset = getDataFromStorage();
    // don't yet have defined the datalayout; return 0
    return dataset.length;
}




function validateNewTask(formData) {

    if (formData.taskNameStr == "") {
        showErrorMsg("Please enter a Task Name");
        return formData.dataOK;
    }

    formData.dataOK = true;
    return formData.dataOK;
} /* end of validateNewTask */


/*
 ** .capture new task form data into an object
 */
function createTaskFormDataToObj() {

    let newTaskFormData = {
        taskNameStr: document.getElementById("newTaskName").value,
        taskDueDateStr: document.getElementById("newDueDate").value,
        dataOK: false
    }
    return newTaskFormData;
} /* end of createTaskFormDataToObj */



function tblStoreNewTask(formData) {
    //  showDebugMsg("createtask called");

    let dataSet = getDataFromStorage();


    // task object definition
    let taskItem = {
        id: createUniqueTaskId(),
        created: new Date(),
        completed: false,
        title: formData.taskNameStr,
        dueDate: formData.taskDueDateStr
    }
    dataSet.push(taskItem);

    putDataToStorage(dataSet);
    return taskItem;
} /* end of tablStoreTask */





/* generate a unique id as a string: guid */
function createUniqueTaskId() {

    // taken from stackoverflow exampe: matches Jason's screenshot.
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });


} /* end of createTaskId() */

/*
 ** Data Access Routines:
 **
 ** .Application calls will use getSDataFromStorage() and putDataToStorage() for access.
 ** .consolidate logic for JSON storage to omit multiple application references.
 ** .this allows for flexibility in replacing the data access layer if needed.
 ** .isolate the occurence of the dataset name into a single function.
 ** 
 ** .Note: the static array and storage share the same name "eventArray"
 */

function getDataStorageName() {
    let datasetName = "todolistapp";
    return datasetName;
}


function getDataFromStorage() {

    /*
     ** .return the existing datastore or an empty array if it doesn't exist.
     ** .error handling wasn't discussed at this point.  Might be assumed to always work.
     ** .if there are errors then perhaps the system has larger file system problems.
     */
    let dataSet = JSON.parse(localStorage.getItem(getDataStorageName())) || [];

    return dataSet;

} /* end of getDataFromStorage */

function putDataToStorage(dataSet) {

    /**
     ** .future lessons yet to be had regarding error i/o handling best practices
     ** .error logic would be added to respective data access errors.
     */
    localStorage.setItem(getDataStorageName(), JSON.stringify(dataSet));

    return true;

} /* end of putDataToStorage */

/*
 ** .this nukes all storage.  Caller is responsible for user prompts.
 */
function purgeDataStorage() {
    localStorage.setItem(getDataStorageName(), JSON.stringify([]));
    return null;
} /* end of purgeDataStorage */

/*
 ** Messaging-Logging functions.  Might extract to separate utility .js in the future
 */
function showErrorMsg(errMsgStr) {
    //   alert(errMsgStr);
    //   alert("windows alert is temporary until I can debug sweetalert");


    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        /*    html: `<ol>${errorMessage}</ol>`, */
        html: `${errMsgStr}`,
    })

} /* end of showErrorMsg() */


function showDebugMsg(msgStr) {

    alert(`${msgStr}`);
    return null;
}


/*
 ** .When the parent calls sweet alert control isn't returned.
 ** .Decision below swal() is where I'm placing the call.
 ** .Ideally I would create an generic swalyn function and pass it function 
 **  pointers depending on the answer...not time to spend any longer.
 ** .created this confirmdelete spefically to call the js delete task 
 ** function when the user confirms the action.
 **
 */
function swalConfirmTaskDelete(msgStr, taskElement) {
    Swal.fire({
        title: `${msgStr}`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
        customClass: {
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Deleted!', '', '');
            DeleteTaskByElement(taskElement);
            displayTaskList();
            returnAns = true;
        } else if (result.isDenied) {
            Swal.fire('Cancelled', '', 'info');
        }
    })
}


/*
 ** 04-20-21 jdj:.sweet alert cance, yes, no decision.
 ** .css required.  Check for .order???
 */
function swalYesNoPrompt(msgStr) {

    Swal.fire({
        title: `${msgStr}`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
        customClass: {
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Complete!', '', 'success');
            purgeDataStorage();
            displayTaskList();
            returnAns = true;
        } else if (result.isDenied) {
            Swal.fire('Action Cancelled', '', 'info');
        }
    })
}


/*
 **  end of Messaging-Logging functions
 */

/*
 ** .Formats the passed date string into a date object to return a string showwing mm/dd/yyyy
 ** .The passed string from the initial array or internal storage load shows "mm/dd/yyyy"
 ** .Strings grabbed from the form input date type show "yyyy/mm/dd"
 ** .Turn the string into a date object and use the js methods to individually acess the date 
 **  components to build the current string in a consistent format.
 ** .use individual date component variables to test individuall for NaN.
 ** 
 ** 
 */
function formatDateMMDDYYYY(dateString) {


    let dateObj = new Date(dateString);

    let mm = dateObj.getMonth(dateObj);
    let dd = dateObj.getDay(dateObj);
    let ccyy = dateObj.getFullYear(dateObj);


    if (isNaN(mm) == true) {
        mm = "00";
    }
    if (isNaN(dd) == true) {
        dd = "00";
    }
    if (isNaN(ccyy) == true) {
        ccyy = "00";
    }

    let dateStrmmddyy = `${mm}/${dd}/${ccyy}`;

    return dateStrmmddyy;

} // end of formatDateMMDDYYYY()


/*
 ** end of site.js
 */
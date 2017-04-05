function getLastWorkflowTaskStatusDate(){
	//get workflow tasks from record
	var taskArray = loadTasks(capId);
	logDebug("taskArray: "+taskArray)
	
}

var capId = myCapId;
logDebug("capId: "+capId);
var taskArray = loadTasks(capId);
var taskArray = new Array();
var workflowResult = aa.workflow.getTasks(capId);
	var wfObj = workflowResult.getOutput();
	var fTask;
var stepnumber;
var tStatus;
var statusDate;
var activeFlag;
var closedTaskArray = [];

for (i in wfObj){
	fTask = wfObj[i];
	wftask = fTask.getTaskDescription();
	stepnumber = fTask.getStepNumber();
	tStatus = fTask.getDisposition();
	statusDate = fTask.getDispositionDate();
	completeFlag = fTask.getCompleteFlag();
	activeFlag = fTask.getActiveFlag();
	logDebug(" New Task:: ");
	logDebug("fTask: "+fTask);
	logDebug("wftask: "+wftask);
	logDebug("stepnumber: "+stepnumber);
	logDebug("tStatus: "+tStatus);
	logDebug("statusDate: "+statusDate);
	logDebug("completeFlag: "+completeFlag);
	logDebug("activeFlag: "+activeFlag);
	//aa.workflow.adjustTask(itemCap,stepnumber,"N", completeFlag, null, null);//updates task
}
function closeWorkflow(){ //optional capId
	var itemCap = capId;
	if (arguments.length > 0)
		itemCap = arguments[0];

	// closes all tasks of a workflow. DOES NOT handleDisposition.
	var taskArray = new Array();
	var workflowResult = aa.workflow.getTasks(itemCap);
 	if(workflowResult.getSuccess()){
 		var wfObj = workflowResult.getOutput();
 	}else{ 
		return false;
	}
 	var fTask;
	var stepnumber;
	var wftask;
	var activeFlag;
	var closedTaskArray = [];
	
	for (i in wfObj){
		fTask = wfObj[i];
		wftask = fTask.getTaskDescription();
		stepnumber = fTask.getStepNumber();
		completeFlag = fTask.getCompleteFlag();
		activeFlag = fTask.getActiveFlag();
		if(completeFlag == "N" && activeFlag == "Y"){
			if(closedTaskArray.length == 0){
				closedTaskArray.push(wftask);
			}else{
				closedTaskArray.push(" "+wftask);
			}
		}
		aa.workflow.adjustTask(itemCap,stepnumber,"N", completeFlag, null, null);
	}
	return closedTaskArray;
}


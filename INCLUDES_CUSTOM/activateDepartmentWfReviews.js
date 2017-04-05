//activates department Review for each TSI department selected and updates the workflows intake task
function activateDepartmentWfReviews(){
	var tsiArray = [];
	loadThisTaskTsi(tsiArray);
	if(isTaskActive("Application Submittal")){
		updateTask("Application Submittal","Approved","Documents Received","Updated via Script");
		setTask("Application Submittal","N","Y");
	}else if(isTaskActive("Intake / Distribution")){
		updateTask("Intake / Distribution","Accepted","Documents Received","Updated via Script");
		setTask("Intake / Distribution","N","Y");
	}
	for(x in tsiArray){
		if(matches(tsiArray[x],"CHECKED")){
			var wfTaskName = x + " Review"
			activateTask(wfTaskName);
			logDebug(" ^^^" + x + " Review was activated for document: " + wfNote)
		}
	}
}
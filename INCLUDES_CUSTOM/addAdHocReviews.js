//adds adHoc Review for each TSI department selected and adds the Addt'l Review Status adHoc if any Review is added
function addAdHocReviews(){
	var addAdHocAddtlReviewStatus = false;
	var tsiArray = [];
	loadThisTaskTsi(tsiArray);
	var workflowResult = aa.workflow.getTasks(capId);
	if(workflowResult.getSuccess()){
		var wfObj = workflowResult.getOutput();
		for(i in wfObj){
			var fTask = wfObj[i];
			var thisStepNumber = fTask.getStepNumber();
			if(thisStepNumber == currentWfTaskStepNumber){
				var thisDispositionNote = fTask.getDispositionNote(); logDebug(" thisDispositionNote: "+thisDispositionNote);
			}
		}
	}
	for(x in tsiArray){
		if(matches(tsiArray[x],"CHECKED")){
			var genericUserId = "";
			switch(x){
				case 'Building':
					genericUserId = "GENERIC.PLANSEXAMINERS";
					break;
				case 'Concurrency':
					genericUserId = "GENERIC.ZONING";
					break;
				case 'Fire':
					genericUserId = "GENERIC.FIREPREVENTION";
					break;
				case 'Impact Fee':
					genericUserId = "GENERIC.IMPACTFEE";
					break;
				case 'Land':
					genericUserId = "GENERIC.PLANSEXAMINERS";
					break;
				case 'Natural Resources':
					genericUserId = "GENERIC.NATURALRESOURCES";
					break;
				case 'Water Resources':
					genericUserId = "GENERIC.WATERRESOURCES";
					break;
				case 'Zoning':
					genericUserId = "GENERIC.ZONING";
					break;
			}
			addAdHocTask("ADHOC_WORKFLOW", x + " Addtl Review", thisDispositionNote, genericUserId);
			logDebug(" ^^^AdHoc Task: " + x + " Review was added for document: " + thisDispositionNote)
			addAdHocAddtlReviewStatus = true;
		}
	}
	if(addAdHocAddtlReviewStatus){
		addAdHocTask("ADHOC_WORKFLOW", "Addtl Review Status", thisDispositionNote, "GENERIC.PERMITTECH");
		logDebug(" ^^^AdHoc Task: Addtl Review Status was added for document: " + thisDispositionNote);
	}
	else{
		logDebug(" No Departments were selected for Document Review");
		logDebug(" ^^^AdHoc Task: Addt'l Review Status not added");
	}
}
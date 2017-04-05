//Returns the Task Specific Info for current task
//Specify array to save TSI field names and values to for thisArr
function loadThisTaskTsi(thisArr){
	var thisTsiResult = aa.taskSpecificInfo.getTaskSpecificInfoByTask(capId, wfProcessID, wfStep);
	if(thisTsiResult.getSuccess()){
		var thisTsi = thisTsiResult.getOutput();
		if(thisTsi.length > 0){
			logDebug(" Storing TSI field names and values to "+thisArr);
			for(a1 in thisTsi){
				thisArr[thisTsi[a1].getCheckboxDesc()] = thisTsi[a1].getChecklistComment();
				logDebug(" *** TSI ::: "+thisTsi[a1].getCheckboxDesc()+" = "+thisTsi[a1].getChecklistComment());
			}
		}
		else{
			logDebug(" Task has no TSI");
		}
	}
}
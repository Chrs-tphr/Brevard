//checks TSI for selected reviews
//Needs to only check current task TSI, standard loadTaskSpecific() loads TSI for all tasks
function validateAdHocReviewSelected(){
	var allowStatus = false;
	var tsiList = [];
	loadThisTaskTsi(tsiList);
	for(x in tsiList){
		var thisTsiValue = tsiList[x]; logDebug(" TSI: "+x+" / Value: "+thisTsiValue);
		if(matches(thisTsiValue,"CHECKED")){
			allowStatus = true;
		}
	}
	return allowStatus;
}
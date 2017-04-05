//create an array of statuses and pass array to function as param
//returns most recent status date of qualifying inspection, returns null if no qualifying inspection
function getLastInspectionStatusDateByStatus(statusArr){
	var inspLastStatusDate = null; logDebug("inspLastStatusDate: "+inspLastStatusDate);
	var inspResultObj = aa.inspection.getInspections(capId);
	if(inspResultObj.getSuccess()){
		var inspList = inspResultObj.getOutput();
	}
	for(xx in inspList){
		var iStatus = inspList[xx].getInspectionStatus(); logDebug("iStatus: "+iStatus);
		var iStatusDate = convertDate(inspList[xx].getInspectionStatusDate()); logDebug("iStatusDate: "+iStatusDate);
		for(i=0; i < statusArr.length; i++){
			if(iStatus == statusArr[i]){
				inspLastStatusDate = iStatusDate; logDebug("Last Pass Inspection Date has been Stored");
			}
		}
	}
	return inspLastStatusDate;
}
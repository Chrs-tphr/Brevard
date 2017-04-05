//If document is uploaded by a public user or staff in BuildingTech user group, adds adHoc Document Intake and updates the document status
function addAdHocDocumentIntake(){
	//get array of document objects
	var docListArray = new Array();
	
	docListResult = aa.document.getCapDocumentList(capId,currentUserID);
	if(docListResult != null && docListResult.getSuccess()){
		docListArray = docListResult.getOutput();
		
		//get last uploaded document
		var docCount = docListArray.length;
		logDebug("There are "+docCount+" documents attached to the record");
		
		var posLastDoc = docCount - 1;
		var lastUploadedDoc = docListArray[posLastDoc];
		var currentDocStatus = lastUploadedDoc.getDocStatus();
		logDebug("Document status: "+currentDocStatus);
		
		//validate upload by a Public User or staff in BuildingTech user group
		if(lastUploadedDoc.getFileUpLoadBy().slice(0,10) == "PUBLICUSER"){
			logDebug("Last document upload qualifies for Document Intake");
			
			//get info from document
			var docGroup = lastUploadedDoc.getDocGroup();//logDebug(" docGroup = " + docGroup);
			var docCategory = lastUploadedDoc.getDocCategory();//logDebug(" docCategory = " + docCategory);
			var docFileName = lastUploadedDoc.getFileName();//logDebug(" docFileName = " + docFileName);

			//build uploaded document info
			var docInfoString = docGroup+"/"+docCategory+"/"+docFileName;//logDebug(" docInfoString = " + docInfoString);
			
			//add AdHoc Document Intake
			addAdHocTask("ADHOC_WORKFLOW", "Document Intake", docInfoString, "GENERIC.PERMITTECH");logDebug("Added: AdHoc Document Intake");

			//set doc status to Pending Review
			lastUploadedDoc.setDocStatus("Pending Review");
			var newDocStatus = lastUploadedDoc.getDocStatus();
			logDebug("Document status was updated from: "+currentDocStatus+" to: "+newDocStatus);
		}else{
			logDebug("Last document uploaded does not qualify");
		}
	}
}
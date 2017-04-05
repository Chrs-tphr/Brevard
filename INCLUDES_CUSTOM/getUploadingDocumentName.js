//get document names of documents being uploaded through this event and return an array of strings of those names

//get array of document objects
var docListArray = new Array();
docListResult = aa.document.getCapDocumentList(capId,currentUserID);
if(docListResult != null && docListResult.getSuccess()){
	docListArray = docListResult.getOutput();
	
	//get last uploaded document
	docListArray = docListResult.getOutput();
	var positionOfLastDoc = docListArray.length - 1;
	logDebug("There are "+docListArray.length+" documents attached to record");
	var lastUploadedDoc = docListArray[positionOfLastDoc];
	
	//validate ACA upload
	if(lastUploadedDoc.getFileUploadBy().slice(0,10) == "PUBLICUSER"){
		logDebug("last upload was done through ACA");
		
		//get last uploaded document status date for comparison
		var lastUploadStatusDate = lastUploadedDoc.getDocStatusDate();
		logDebug("The last document was uploaded: "+lastUploadStatusDate+" by: "+lastUploadedDoc.getFileUploadBy());
		
		//get document count for upload
		var docCount = 0;
		for(i in docListArray){
			var thisDoc = docListArray[i];
			//compare last document status date for other documents uploaded with this save
			if(thisDoc.getDocStatusDate() == lastUploadStatusDate){
				docCount++;
			}
		}
		logDebug(docCount+" docments uploaded together.");
		
		//evaluate each document
		for(i in docListArray){
			var thisDoc = docListArray[i];
			//compare last document status date for other documents uploaded with this save
			if(thisDoc.getDocStatusDate() == lastUploadStatusDate){
				
				//get info from document
				var docGroup = objArray[i].getDocGroup();logDebug(" docGroup = " + docGroup);
	            var docCategory = objArray[i].getDocCategory();logDebug(" docCategory = " + docCategory);
	            var docFileName = objArray[i].getFileName();logDebug(" docFileName = " + docFileName);
	            logDebug("----------------------------");
	            if(docArray.length > 0) docArray.push(", ");
	            docArray.push(docGroup+"/"+docCategory+"/"+docFileName);
			}
		}
		logDebug(docArray);
	}
}


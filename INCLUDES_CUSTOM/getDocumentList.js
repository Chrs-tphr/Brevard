//Returns an array of documentmodels if any
//Returns an empty array if no documents
function getDocumentList(){
	var docListArray = new Array();
	docListResult = aa.document.getCapDocumentList(capId,currentUserID);
	if (docListResult != null && docListResult.getSuccess()) {		
		docListArray = docListResult.getOutput();
	}
	return docListArray;
}
/*------------------------------------------------------------------------------------------------------/
| Accela Automation
| Accela, Inc.
| Copyright (C): 2012
|
| Program : INCLUDES_CUSTOM.js
| Event   : N/A
| Version : 17.8.21
|
| Usage   : Custom Script Include.  Insert custom EMSE Function below and they will be 
|	    available to all master scripts
|
| Notes   :
|			01/19/2017 - updated addAdHocDocumentIntake()
|			01/20/2017 - added function doesStatusExistInTaskHistory()
|			02/07/2017 - added updated function addAdHocReviews()
|			02/08/2017 - added function validateAdHocReviewSelected()
|			02/09/2017 - added function loadThisTaskTsi()
|			02/09/2017 - updated function addAdHocReviews() to use function loadThisTaskTsi() instead of wfObj
|			02/09/2017 - updated function validateAdHocReviewSelected() to use function loadThisTaskTsi() instead of wfObj
|			02/15/2017 - updated function addAdHocDocumentIntake() to include BuildingTech2
|			02/21/2017 - updated function addAdHocDocReview() updated staff assignments and added "Addtl" to task names to match updated configuration
|			02/21/2017 - added function activateDepartmentWfReviews()
|			03/06/2017 - updated function addAdHocDocumentIntake() removed BuildingTech and BuildingTech2, Doc Intake should only be added when Public User uploads a document
|			03/20/2017 - updated function activateDepartmentWfReviews() app intake task status and flags are updated
|			08/18/2017 - updated function activateDepartmentWfReviews() to set assigned date to current date
|			08/18/2017 - added function updateBuildingPermitExpirationDate() to populate and update ASI Expiration Date on Building permits.
|			08/21/2017 - added function testIncludesCustomCall()
|			08/28/2017 - updated addAdHocDocumentIntake to only run if the current user is a public user
|
/------------------------------------------------------------------------------------------------------*/

function validateMillageCode(pMillageCode)
{

	/* Custom Function
		- INPUT: Millage Code
		- OUTPUT: Empty String or Millage Code City Description Text.
		
		Description: If the Millage Code is found for a City, return the name of the City (record CANNOT be created, otherwise return empty string (record can be created).
		
	*/

    var returnMessage = '';

	switch(pMillageCode)
	{
		case '14A0':
			returnMessage = "City of Titusville";
			break;
		case '14D0':
		case '23D0':
		case '25D0':
			returnMessage = "City of Cocoa";
			break;
		case '13E0':
		case '43E0':
			returnMessage = "City of Rockledge";
			break;
		case '26G0':
			returnMessage = "City of Cape Canaveral";
			break;
		case '26H0':
			returnMessage = "City of Cocoa Beach";
			break;
		case '43J0':
			returnMessage = "Town of Palm Shores";
			break;
		case '34K0':
		case '43K0':
		case '51K0':
		case '53K0':
			returnMessage = "City of Melbourne";
			break;
		case '41M0':
			returnMessage = "City of Satellite Beach";
			break;
		case '41P0':
		case '51P0':
		case '52P0':
					returnMessage = "City of Indian Harbour Beach";
					break;
		case '51R0':
					returnMessage = "Town of Melbourne Village";
					break;
		case '34S0':
					returnMessage = "Town of Indialantic";
					break;
		case '34U0':
		case '54U0':
					returnMessage = "City of Palm Bay";
					break;
		case '34V0':
		case '52V0':
					returnMessage = "City of West Melbourne";
					break;			
		case '34X0':
					returnMessage = "Town of Melbourne Beach";
					break;			
		case '34Z0':
					returnMessage = "Town of Malabar";
					break;								
	
	}
	
	return returnMessage;
}


/*------------------------------------------------------------------------------------------------------/
|  EDR Document Upload Functions (Start)
/------------------------------------------------------------------------------------------------------*/
//added 20151124 - bcorey
function getDocumentList() 
{
	//Introduced 09/23/2015 by Jaime S.
	// Returns an array of documentmodels if any
	// returns an empty array if no documents

	var docListArray = new Array();

	docListResult = aa.document.getCapDocumentList(capId,currentUserID);

	if (docListResult.getSuccess()) {		
		docListArray = docListResult.getOutput();
	}
	return docListArray;
}
//end 20151124


function getDocOperation(docModelList)
{
	var docModel = docModelList.get(0);
	if(docModel == null)
	{
		return false;
	}
	
	if(docModel.getCategoryByAction() == null || "".equals(docModel.getCategoryByAction()))
	{
		return "UPLOAD";
	}
	//Judging it's check in
	else if("CHECK-IN".equals(docModel.getCategoryByAction()))
	{
		return "CHECK_IN";
	}
	//Judging it's resubmit or normal upload.
	else if("RESUBMIT".equals(docModel.getCategoryByAction()))
	{
		return "RESUBMIT";
	}
}

/*------------------------------------------------------------------------------------------------------/
|  EDR Document Upload Functions (End)
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
|  AdHoc Functions (Start)
/------------------------------------------------------------------------------------------------------*/

//If document is uploaded by a public user, adds adHoc Document Intake and updates the document status
function addAdHocDocumentIntake(){
	if(currentUserID.slice(0,10) == "PUBLICUSER"){
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
			
			//validate upload by a Public User
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
}
//checks TSI for selected reviews
//If no TSI are selected reactivate the task, update status comment and display a message
function validateAdHocReviewSelected(){
	var allowStatus = false;
	var tsiList = [];
	loadThisTaskTsi(tsiList);
	for(x in tsiList){
		if(matches(tsiList[x],"CHECKED")){
			allowStatus = true;
			break;
		}
	}
	if(allowStatus == false){
//		activateTask("Document Intake");
		showMessage = true;
		comment("You must select at least one reviewing department Please open the 'Document Intake' task again, set the the status and select the reviewing departments.")
		cancel = true;
	}
}

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
			updateTaskAssignedDate(wfTaskName,new Date());
		}
	}
}

/*------------------------------------------------------------------------------------------------------/
|  AdHoc Functions (End)
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
|  Supporting AdHoc Functions (Start)
/------------------------------------------------------------------------------------------------------*/

//adHocProcess must be same as one defined in R1SERVER_CONSTANT
//adHocTask must be same as Task Name defined in AdHoc Process
//adHocNote can be variable
//Optional 4 parameters = Assigned to User ID must match an AA user
//Optional 5 parameters = CapID
function addAdHocTask(adHocProcess, adHocTask, adHocNote){
	var thisCap = capId;
	var thisUser = currentUserID;
	if (arguments.length > 3) thisUser = arguments[3];
	if (arguments.length > 4) thisCap = arguments[4];
	var userObj = aa.person.getUser(thisUser);
	if (!userObj.getSuccess()){
		logDebug("Could not find user to assign to");
		return false;
	}
	var taskObj = aa.workflow.getTasks(thisCap).getOutput()[0].getTaskItem()
	taskObj.setProcessCode(adHocProcess);
	taskObj.setTaskDescription(adHocTask);
	taskObj.setDispositionNote(adHocNote);
	taskObj.setProcessID(0);
	taskObj.setAssignmentDate(aa.util.now());
	taskObj.setDueDate(aa.util.now());
	taskObj.setAssignedUser(userObj.getOutput());
	wf = aa.proxyInvoker.newInstance("com.accela.aa.workflow.workflow.WorkflowBusiness").getOutput();
	wf.createAdHocTaskItem(taskObj);
	return true;
}

/*------------------------------------------------------------------------------------------------------/
|  Supporting AdHoc Functions (End)
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
|  Supporting Workflow Functions (Start)
/------------------------------------------------------------------------------------------------------*/

function deactivateAllTasks() {
	var taskList = []
	taskListObj = aa.workflow.getTasks(capId)
	if (taskListObj.getSuccess()) taskList = taskListObj.getOutput()
	for (t in taskList) deactivateTask(""+taskList[t].getTaskDescription())
}

function doesStatusExistInTaskHistory(tName, tStatus){
	histResult = aa.workflow.getWorkflowHistory(capId, tName, null);
	if(histResult.getSuccess()){
		var taskHistArr = histResult.getOutput();
		for(var xx in taskHistArr){
			taskHist = taskHistArr[xx];
			if(tStatus.equals(taskHist.getDisposition())) return true;
		}
		return false;
	}else{
		logDebug("Error getting task history : " + histResult.getErrorMessage());
	}
	return false;
}

//Returns the Task Specific Info for current task
//Specify array to save TSI field names and values to for thisArr
function loadThisTaskTsi(thisArr){
	currentWfTaskStepNumber = aa.env.getValue("SD_STP_NUM");
	logDebug(" currentWfTaskStepNumber: "+currentWfTaskStepNumber);
	var workflowResult = aa.workflow.getTasks(capId);
	if(workflowResult.getSuccess()){
		var wfObj = workflowResult.getOutput();
		for(i in wfObj){
			var fTask = wfObj[i];
			var thisStepNumber = fTask.getStepNumber();
			if(thisStepNumber == currentWfTaskStepNumber){
				logDebug(" ***FOUND MATCHING WORKFLOW TASK***");
				var thisDispositionNote = fTask.getDispositionNote(); logDebug(" thisDispositionNote: "+thisDispositionNote);
				var thisProcessID = fTask.getProcessID(); logDebug(" thisProcessID: "+thisProcessID);
				var thisTsiResult = aa.taskSpecificInfo.getTaskSpecificInfoByTask(capId, thisProcessID, thisStepNumber);
				if(thisTsiResult.getSuccess()){
					var thisTsi = thisTsiResult.getOutput();
					if(thisTsi.length > 0){
						logDebug(" Storing TSI field names and values to thisArr");
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
		}
	}
}

/*------------------------------------------------------------------------------------------------------/
|  Supporting Workflow Functions (End)
/------------------------------------------------------------------------------------------------------*/


function updateBuildingPermitExpirationDate(numDays){//numDays = number of days to expiration from today.
	var currentExpDate = AInfo["Expiration Date"];
	var tDay = new Date();
	var today = dateFormatted(tDay.getMonth()+1,tDay.getDate(),tDay.getFullYear());
	var newExpDate = dateAdd(today,numDays);
	editAppSpecific("Expiration Date", newExpDate);
	logDebug("Updated Expiration Date from: "+currentExpDate+" to: "+AInfo["Expiration Date"]);
}

function testIncludesCustomCall(){
	logDebug("Includes_Custom call successfull");
	comment("Includes_Custom call successfull");
}

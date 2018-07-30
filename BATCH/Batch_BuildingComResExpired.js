/*------------------------------------------------------------------------------------------------------/
| Program: Batch Expire Building Record with 190 days of no activity
|
| Version 1.0 - Base Version. 
|
| 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var emailText = "";
var debugText = "";
var showDebug = false;
var showMessage = false;
var message = "";
var maxSeconds = 4.5 * 60;
var br = "<br>";
var agncyNme = "BREVARD";

/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID();
batchJobName = "" + aa.env.getValue("BatchJobName");
wfObjArray = null;


eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_BATCH"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));


function getScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
	return emseScript.getScriptText() + "";
}

function getMasterScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(),vScriptName);
	return emseScript.getScriptText() + "";
}


batchJobID = 0;
if (batchJobResult.getSuccess()){
	batchJobID = batchJobResult.getOutput();
	logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
}
else
  logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());


/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

/* test parameters 
aa.env.setValue("appGroup", "Building");
//aa.env.setValue("appTypeType", "");
//aa.env.setValue("appSubType", "");
//aa.env.setValue("appCategory", "");
aa.env.setValue("emailAddress", "chris.godwin@woolpert.com");
aa.env.setValue("asiGroup", "INVOICES");
aa.env.setValue("asiField", "Extension Expiration Date");
aa.env.setValue("lookAheadDays", "-190");
aa.env.setValue("daySpan", "1");
aa.env.setValue("skipAppStatus","Expired");
aa.env.setValue("appStatus", "Expired");
*/


var appGroup = getParam("appGroup");
var appTypeType = getParam("appTypeType");			
var appSubtype = getParam("appSubType");
var appCategory = getParam("appCategory");
var emailAddress = getParam("emailAddress");		
var asiField = getParam("asiField");
var asiFieldGroup = getParam("asiGroup")
var skipAppStatusArray = getParam("skipAppStatus").split(",");
var lookAheadDays = getParam("lookAheadDays");
var daySpan = getParam("daySpan");
var appStatus = getParam("appStatus");


/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startJSDate = new Date();
startJSDate.setHours(0,0,0,0);
var timeExpired = false;
var useAppSpecificGroupName = false;
var showDebug = true;

var startTime = startDate.getTime();			// Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
if (appGroup=="")
	appGroup="*";
if (appTypeType=="")
	appTypeType="*";
if (appSubtype=="")
	appSubtype="*";
if (appCategory=="")
	appCategory="*";
var appType = appGroup+"/"+appTypeType+"/"+appSubtype+"/"+appCategory;	
logDebug("appType = " + appType);


var fromDate = dateAdd(null,parseInt(lookAheadDays));
var toDate = dateAdd(null,parseInt(lookAheadDays)+parseInt(daySpan));
fromJSDate = new Date(fromDate);
toJSDate = new Date(toDate);
var dFromDate = aa.date.parseDate(fromDate);
var dToDate = aa.date.parseDate(toDate);
logDebug("fromDate: " + fromDate + "  toDate: " + toDate)

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

logDebug("Start of Job");

mainProcess();

logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");

if (emailAddress.length)
	aa.sendMail("noreply@accela.com", emailAddress, "", agncyNme + " " + batchJobName + " Results", emailText);

if (showDebug) 
	aa.eventLog.createEventLog("DEBUG", "Batch Process", agncyNme +" "+ batchJobName, aa.date.getCurrentDate(), aa.date.getCurrentDate(),"", emailText ,batchJobID);
//aa.print(emailText);
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function mainProcess() {
	var capFilterType = 0;
	var capFilterStatus = 0;
	var capCount = 0;

	var capResult = aa.cap.getCapIDsByAppSpecificInfoDateRange(asiFieldGroup, asiField, dFromDate, dToDate);

	if (capResult.getSuccess()) {
		myCaps = capResult.getOutput();
	}
	else { 
		logDebug("ERROR: Getting records, reason is: " + capResult.getErrorMessage()) ;
		return false
	} 

	for (myCapsXX in myCaps) {
		if (elapsed() > maxSeconds) { // only continue if time hasn't expired
			logDebug("WARNING","A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.") ;
			timeExpired = true ;
			break; 
		}

     	var thisCapId = myCaps[myCapsXX].getCapID();
   		capId = getCapId(thisCapId.getID1(), thisCapId.getID2(), thisCapId.getID3()); 
		altId = capId.getCustomID();
     	

		if (!capId) {
			logDebug("Could not get Cap ID");
			continue;
		}
		cap = aa.cap.getCap(capId).getOutput();		
		appTypeResult = cap.getCapType();	
		appTypeString = appTypeResult.toString();	
		appTypeArray = appTypeString.split("/");

		if ( !( (appGroup == "*" || appGroup.indexOf(appTypeArray[0]) >= 0) && (appTypeType == "*" || appTypeType.indexOf(appTypeArray[1]) >= 0) &&
			 (appSubtype == "*" || appSubtype.indexOf(appTypeArray[2]) >= 0) && (appCategory == "*" || appCategory.indexOf(appTypeArray[3]) >= 0) )) {
			logDebug(altId + ": skipping due to record type of " + appTypeString)
			capFilterType++;
			continue;
		}
		
		var capStatus = cap.getCapStatus();
		if (exists(capStatus,skipAppStatusArray)) {
			capFilterStatus++;
			logDebug(altId + ": skipping due to application status of " + capStatus)
			continue;
		}

		capCount++;
		logDebug(altId);
		
		//get ASI Expiration Extension dates
		//get workflow status dates
		//get last pass inspection status date
		var inspLPDate = getLastInspectionStatusDateByStatus(skipAppStatusArray);
		
		//close wfTasks and generate capStatus comment
		var tasksClosed = closeWorkflow();
		var recStatCmnt;
		if(tasksClosed.length == 1){
			recStatCmnt = "This record was Expired by 190 day batch. The following workflow task was active prior to expiration: "+tasksClosed+".";
		}else if(tasksClosed.length > 1){
			recStatCmnt = "This record was Expired by 190 day batch. The following workflow tasks were active prior to expiration: "+tasksClosed+".";
		}else{
			recStatCmnt = "This record was Expired by 190 day batch.";
		}
		
		//update record status
		if (appStatus) updateAppStatus(appStatus, recStatCmnt, capId);
	}

 	logDebug("Total CAPS qualified : " + myCaps.length);
	logDebug("Ignored due to CAP type : " + capFilterType);
 	logDebug("Total CAPS processed: " + capCount);

}



updateAppStatus("Expired", recStatCmnt);

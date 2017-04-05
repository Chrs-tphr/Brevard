function doesStatusExistInTaskHistory(tName, tStatus) {

       histResult = aa.workflow.getWorkflowHistory(capId, tName, null);
       if (histResult.getSuccess()) {
              var taskHistArr = histResult.getOutput();
              for (var xx in taskHistArr) {
                     taskHist = taskHistArr[xx];
                     if (tStatus.equals(taskHist.getDisposition()))
                           return true;
              }
              return false;
              
       }
       else {
              logDebug("Error getting task history : " + histResult.getErrorMessage());
       }
       return false;

}
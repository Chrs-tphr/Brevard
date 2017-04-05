--Param 2: if more than 1 module is to be updated, comma seperate with no spaces each module name the procedure should update.
--Param 2 example: 'Building' or 'Building,Planning,Enforcement'

exec ACA_INSP_HIST_CMNTS_VISIBLE ('31-MAY-2016', 'Building') ;

exec ACA_INSP_COMMENTS_VISIBLE ('31-MAY-2016', 'Building') ;
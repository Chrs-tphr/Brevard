create or replace PROCEDURE          aca_wf_comments_visible
(FOR_RECS_AFTER_DATE IN VARCHAR2 DEFAULT '31-MAY-2016', MODULE_NAME IN VARCHAR2)
AUTHID CURRENT_USER AS

-- input module variables
MODULE_NAME:= select replace(MODULE_NAME,',','','') from dual --need to test this  'Building,Planning,Enforce'
-- Working variables
vRecordCount number := 0; -- control commit
-- Error processing variables
vErrorMsg varchar2(100);
v_code number;
v_errm varchar (100);
v_who varchar(25);
v_err_val1 varchar2(100);
v_err_val2 varchar2(100);

tmpVar NUMBER;
/******************************************************************************/
BEGIN

--  Allow aca visibility to review comments
   begin

     UPDATE(
            select g.restrict_comment_for_aca, g.restrict_role
            from accela.gprocess g
            inner join accela.b1permit b on g.serv_prov_code=b.serv_prov_code 
              and g.b1_per_id1=b.b1_per_id1 and g.b1_per_id2=b.b1_per_id2 
              and g.b1_per_id3=b.b1_per_id3 
            where g.rec_date > to_date(FOR_RECS_AFTER_DATE) 
              and (restrict_comment_for_aca IS NULL OR restrict_comment_for_aca != 'Y') 
              and b.B1_PER_GROUP in (MODULE_NAME)
              --and b.B1_PER_GROUP in ('Building','Development','License') -- ABOVE want to convert to parameter entered in exec PROCEDURE that can take multiple module names
           ) t 
     SET t.restrict_comment_for_aca = 'Y' 
     	--,t.restrict_role = '1111100000'  --use to display to all ACA user roles
     	;
     COMMIT ;  
     exception
     when others then
       v_who := 'aca_wf_comments_visible';
       v_code := SQLCODE;
       v_errm := substr(SQLERRM,1,100);
       v_err_val1 := 'allow gprocess';
       v_err_val2 := '';
       insert into A1_TEST_PL_SQL_ERRORS (code, message,happened, by_who, value1, value2)
       values (v_code, v_errm, sysdate, v_who, v_err_val2, v_err_val2);  
   end;


-- General exception handling
  EXCEPTION
     WHEN OTHERS THEN
       v_who := 'aca_wf_comments_visible';
       v_code := SQLCODE;
       v_errm := substr(SQLERRM,1,100);
       v_err_val1 := 'allow gprocess';
       v_err_val2 := '';
       insert into A1_TEST_PL_SQL_ERRORS (code, message,happened, by_who, value1, value2)
       values (v_code, v_errm, sysdate, v_who, v_err_val2, v_err_val2);  
END aca_wf_comments_visible ; 
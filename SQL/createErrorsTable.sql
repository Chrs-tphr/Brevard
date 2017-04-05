select * from A1_TEST_PL_SQL_ERRORS

DROP TABLE A1_TEST_PL_SQL_ERRORS ;
CREATE TABLE A1_TEST_PL_SQL_ERRORS
(
  code number, 
  message varchar (100), 
  happened date, 
  by_who varchar(25), 
  value1 varchar2(100), 
  value2 varchar2(100) 
) ;
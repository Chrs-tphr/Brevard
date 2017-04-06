--returns counts of inspections grouped by restrict role, restrict comment and display in aca
select
	b.B1_PER_GROUP
  ,g.restrict_role
	, g.RESTRICT_COMMENT_FOR_ACA
	, g.DISPLAY_IN_ACA
	, count(*) Rec_Cnt
from ACCELA.g6action g
inner join accela.b1permit b on g.serv_prov_code=b.serv_prov_code
	and g.b1_per_id1=b.b1_per_id1
	and g.b1_per_id2=b.b1_per_id2
	and g.b1_per_id3=b.b1_per_id3
where g.rec_date > to_date('1-APR-2016')
	and b.B1_PER_GROUP in ('Building') 
group by b.B1_PER_GROUP, g.RESTRICT_COMMENT_FOR_ACA, g.DISPLAY_IN_ACA ,g.restrict_role
order by b.B1_PER_GROUP, g.RESTRICT_COMMENT_FOR_ACA, g.DISPLAY_IN_ACA ,g.restrict_role






--returns inspection and comment for a specific record
select b.comment_type
  ,b.text
  ,g.*

from ACCELA.g6action g

inner join ACCELA.bactivity_comment b on g.serv_prov_code=b.serv_prov_code and g.g6_act_num=b.g6_act_num
	and g.b1_per_id1=b.b1_per_id1
	and g.b1_per_id2=b.b1_per_id2
	and g.b1_per_id3=b.b1_per_id3

	where g.restrict_role <> '1111100000'
	
where g.b1_per_id1 = '16RES'
and g.b1_per_id2 = '00000'
and g.b1_per_id3 = '06783'





--list of inspections with a specific restrict role
select * from ACCELA.g6action g
where g.restrict_role = '1'
  and g.restrict_comment_for_aca = 'Y'
  and g.display_in_aca = 'Y'
  
  
  
 
--returns altids where inspection is not Pass and comment restrict role is not valid
select 
  b.b1_alt_id
  ,bac.comment_type
  ,bac.text
  ,g.g6_status
  ,g.g6_status_dd
  ,g.display_in_aca
  ,g.restrict_comment_for_aca
  ,g.restrict_role

from ACCELA.g6action g

inner join ACCELA.bactivity_comment bac on g.serv_prov_code=bac.serv_prov_code 
  and g.g6_act_num=bac.g6_act_num
	and g.b1_per_id1=bac.b1_per_id1
	and g.b1_per_id2=bac.b1_per_id2
	and g.b1_per_id3=bac.b1_per_id3
  
inner join ACCELA.b1permit b on bac.serv_prov_code=b.serv_prov_code
	and b.b1_per_id1=bac.b1_per_id1
	and b.b1_per_id2=bac.b1_per_id2
	and b.b1_per_id3=bac.b1_per_id3

	where g.restrict_role <> '1111100000'
	and g.g6_status <> 'Pass'
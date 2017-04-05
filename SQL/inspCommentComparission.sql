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

where g.b1_per_id1 = '16RES'
and g.b1_per_id2 = '00000'
and g.b1_per_id3 = '06783'





--list of inspections with a specific restrict role
select * from ACCELA.g6action g
where g.restrict_role = '1'
  and g.restrict_comment_for_aca = 'Y'
  and g.display_in_aca = 'Y'
  
  
  
  
  
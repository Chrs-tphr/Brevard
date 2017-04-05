select
	b.B1_PER_GROUP
	, g.RESTRICT_COMMENT_FOR_ACA
	, g.DISPLAY_IN_ACA
	, count(*) Rec_Cnt
from ACCELA.g6action g
inner join accela.b1permit b on g.serv_prov_code=b.serv_prov_code
	and g.b1_per_id1=b.b1_per_id1
	and g.b1_per_id2=b.b1_per_id2
	and g.b1_per_id3=b.b1_per_id3 
where g.rec_date > to_date('1-APR-2016')
	and g.rec_date < to_date('30-JUN-2016')
	and b.B1_PER_GROUP in ('Building') 
group by b.B1_PER_GROUP, g.RESTRICT_COMMENT_FOR_ACA, g.DISPLAY_IN_ACA 
order by b.B1_PER_GROUP, g.RESTRICT_COMMENT_FOR_ACA, g.DISPLAY_IN_ACA ;
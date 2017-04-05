select b.B1_PER_GROUP, g.RESTRICT_COMMENT_FOR_ACA, count(*) Rec_Cnt 
--from accela.gprocess_history g 
from accela.gprocess g
inner join accela.b1permit b on g.serv_prov_code=b.serv_prov_code 
  and g.b1_per_id1=b.b1_per_id1 and g.b1_per_id2=b.b1_per_id2 
  and g.b1_per_id3=b.b1_per_id3 
where g.rec_date > to_date('31-MAY-2016') 
  --and (restrict_comment_for_aca IS NULL OR restrict_comment_for_aca != 'Y') 
  --and b.B1_PER_GROUP in ('Building','Development','License')
  --vv For internal testing...
  and b.B1_PER_GROUP in ('Building') 
group by b.B1_PER_GROUP, g.RESTRICT_COMMENT_FOR_ACA 
order by b.B1_PER_GROUP, g.RESTRICT_COMMENT_FOR_ACA ; 

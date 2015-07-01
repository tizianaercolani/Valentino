select 
    distinct *	
from
	valentino_looks l
	join valentino_static_links s on l.imageId=s.imageId
	 
where  
l.collection_id='${collection_id}'
and l.season_id='${season_id}'
and l.line_id='${line_id}'
and s.size ='${size_}'
 
order by look_order

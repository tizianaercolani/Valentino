select 
    distinct *
	
from
	valentino_navigation n
	join valentino_static_links s on n.imageId=s.imageId
	 
where 
n.collection_id='${collection_id}'
and n.season_id='${season_id}'
and n.brand='${brand}'
and n.line_id<>'MASTER'
and s.size ='${size_}'
 


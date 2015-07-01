select 
   distinct *	
from
	valentino_products p
	join valentino_static_links s on p.imageId=s.imageId	 
where  
s.size ='${size_}'
AND
p.sapid_full like '${mat}%'


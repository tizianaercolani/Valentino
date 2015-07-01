select 
  distinct p.line,p.collection,p.season
from
	valentino_products p
where  
p.sapid='${mat}'

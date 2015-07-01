select 
    distinct
    v.model,
    v.fabric,
    v.color,
    v.url
from
	valentino_360 v 
	join valentino_products p 
	on p.model=v.model and p.fabric=v.fabric and p.color=v.color
where p.sapid ='${sapid!}'


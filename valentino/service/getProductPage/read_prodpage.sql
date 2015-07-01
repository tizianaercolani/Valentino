select 
  distinct p.*
from
valentino_products p
where  
p.sapid='${sapid}'
order by p.color
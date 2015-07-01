select 
DISTINCT SUBSTRING(title, 1, 1) as letter
from 
valentino_contacts
where store='${store}'
and SUBSTRING(title, 1, 1)<>' '
order by letter
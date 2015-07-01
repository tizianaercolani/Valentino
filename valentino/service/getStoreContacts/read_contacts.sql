select 
	c.store,
	c.code,
	c.title,
	c.associate
from
	valentino_contacts c 

where c.store = '${store}'	
[#if title??]		
  and c.title like '${title}%'
[/#if]
[#if associate??]		
  and c.associate = '${associate}'
[/#if]

order by title LIMIT 1000;

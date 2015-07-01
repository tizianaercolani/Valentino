select 
   distinct *	
from
	valentino_products p
	join valentino_static_links s on p.imageId=s.imageId	 
where  
s.size ='${size_}'
AND
p.sapid_full in (
[#list mat as m]
[#if m_index>0],[/#if]
'${m}'
[/#list]
)


select 
    distinct *
	
from
	valentino_navigation n
	join valentino_static_links s on n.imageId=s.imageId
	 
where 
n.brand in (
[#list brands as b]
[#if b_index>0],[/#if]
'${b}'
[/#list]
)
and n.line_id='MASTER'
and s.size ='${size_}'
 


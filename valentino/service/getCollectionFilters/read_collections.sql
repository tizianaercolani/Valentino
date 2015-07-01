select 
    distinct
	f.collection
	
from
	valentino_filters f 
where f.brand in (
[#list brands as b]
[#if b_index>0],[/#if]
'${b}'
[/#list]
)	
and f.collection <>''
and f.season <> 'FW 15/16'
[#if season??]		
  and f.season like '${season}%'
[/#if]
[#if line??]		
  and f.line = '${line}'
[/#if]
order by collection;

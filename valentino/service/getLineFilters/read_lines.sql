select 
    distinct
	f.line
	
from
	valentino_filters f 
where f.brand in (
[#list brands as b]
[#if b_index>0],[/#if]
'${b}'
[/#list]
)
and f.line <>''
and f.season <> 'FW 15/16'
[#if season??]		
  and f.season like '${season}%'
[/#if]
[#if collection??]		
  and f.collection = '${collection}'
[/#if]
order by line;

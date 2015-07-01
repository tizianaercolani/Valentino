select 
    distinct
	f.season
	
from
	valentino_filters f 
where f.brand in (
[#list brands as b]
[#if b_index>0],[/#if]
'${b}'
[/#list]
)
and f.season <> 'FW 15/16'
and f.season <>''
[#if collection??]		
  and f.collection like '${collection}%'
[/#if]
[#if line??]		
  and f.line = '${line}'
[/#if]
order by replace(replace(season, 'SS', ''), 'FW', '') desc;

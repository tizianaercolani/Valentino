select 
sapid,  fabric, color, l.staticUrl
from valentino_products p
join valentino_static_links l
on p.imageId= l.imageId
where l.size='${size_}'
and p.season <> 'FW 15/16'
[#if season?? && season?has_content]
and p.season='${season}'
[/#if]
[#if collection?? && collection?has_content]
and p.collection='${collection}'
[/#if]
[#if line?? && line?has_content]
and p.line='${line}'
[#else]
and p.line in (
select distinct line from valentino_filters 
where brand in (
[#list brands as b]
[#if b_index>0],[/#if]
'${b}'
[/#list]
))
[/#if]
[#if model?? && model?has_content]
and p.model like '%${model}%'
[/#if]
[#if color?? && color?has_content]
and p.color like '%${color}%'
[/#if]
[#if fabric?? && fabric?has_content]
and p.fabric like '%${fabric}%'
[/#if]
group by  sapid,  fabric, color
limit ${limit}
offset ${index} 


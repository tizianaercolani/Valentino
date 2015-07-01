select 
   distinct s.*
from
valentino_static_links s 
where  s.size in
(
[#list sizes as s]
[#if s_index>0],[/#if]
'${s}'
[/#list]
)
AND
imageId in
(
[#list ids as id]
[#if id_index>0],[/#if]
'${id}'
[/#list]
)
order by imageId
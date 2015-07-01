select sapid, color from valentino_products p where p.ean='${ean}' and brand in (
[#list brands as b]
[#if b_index>0],[/#if]
'${b}'
[/#list]
             )
 UNION
select sapid, color from valentino_eancodes e where e.ean='${ean}' and sapid in 
(select distinct sapid from valentino_products
where brand in (
[#list brands as b]
[#if b_index>0],[/#if]
'${b}'
[/#list]
             )
)



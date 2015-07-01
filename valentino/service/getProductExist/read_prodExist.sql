select distinct sapid from valentino_products 
where
(sapid='${code}'
OR sapid_full='${code}'
OR ean='${code}')
and brand in (
[#list brands as b]
[#if b_index>0],[/#if]
'${b}'
[/#list]
)
UNION
select sapid from valentino_eancodes e where e.ean='${code}' and sapid in 
(select distinct sapid from valentino_products
where brand in (
[#list brands as b]
[#if b_index>0],[/#if]
'${b}'
[/#list]
             )
)

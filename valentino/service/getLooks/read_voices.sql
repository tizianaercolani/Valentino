select(Select count( sapid) from `valentino_products` where sapid like '${skey}%' ) as allitem,
(Select count( sapid) from `valentino_products` where sapid like '${skey}B%' ) as bags,
(Select count( sapid) from `valentino_products` where sapid like '${skey}T%' ) as belts,
(Select count( sapid) from `valentino_products` where sapid like '${skey}J%' ) as jewelry,
(Select count( sapid) from `valentino_products` where sapid like '${skey}G%' ) as gloves,
(Select count( sapid) from `valentino_products` where sapid like '${skey}P%' ) as small,
(Select count( sapid) from `valentino_products` where sapid like '${skey}S%' ) as shoes,
(Select count( sapid) from `valentino_products` where sapid like '${skey}V%' ) as soft,
(Select count( sapid) from `valentino_products` where sapid like '${skey}H%' ) as hats,
(Select count( sapid) from `valentino_products` where sapid like '${skey}Z%' ) as others


insert into valentino_trace set
			time = ${current_timestamp} ,
			trace_time = ${current_timestamp} ,
--			synch_id = 1,
--			item_id = 5,
			user_id = 6,			
			action = '${action}',
--			device_id ='1413208359482.29.908003933282078',
--			device_type='ios',
			payload = '${payload}'


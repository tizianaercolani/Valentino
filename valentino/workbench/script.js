var scriptVersion="1.0";



function testCreateCustomer()
{
	var callparams = {
			action : 'createCustomer',
			IAssociate : "28597", // prendere sapcrm field
			ICreateStore : "0040000052",
			IDedicStore : "0040000052",
			ImBirthDd : "05",
			ImBirthMm : "06",
			ImBirthYyyy : "1984",
			ImCity : 'Salerno',
			ImEstAge :  '',
			ImMainEmail :  '',
			ImMktPermiss :  '1',
			ImPrfPermiss :  'Z1',
			ImRegion : 'MI', 
			ImSource :  'Z001',
			ImSourceDesc :  'my little test',
			ImStrSuppl1 :  '123', 			
			ImStreet :  'via diaz',
			ImTelNumpreMa :  '+397777777777777777777777777',
			ImTelNumpreMo :  '+38',
			ImTitle : '0001',
			Language : '',
			ProcType : '2',
			SiBrand : "Z001",
			SimCompName :  '',
			SimCountry :  'IT',
			SimNameFirst   : 'Claudia',
			SimNameLast :  'Grieco',
			SimTelNumberMa :  '',
			SimTelNumberMo :  '',
			SimZipcode :  '',
			SmNamemiddle :  'lol'
		};	
	
		htmlRequest("service.app", callparams);

}


function testSearchCustomers()
{
	htmlRequest("service.app",
	{
		action : 'searchCustomers',
		clientId:"",
		"companyName":"" ,       
        "country":"" ,        
        "firstName":"" ,
        "lastName":"miamn" ,
        "phone":"" ,
        "mobile":"" ,
        "zip":"" ,
        "card":"" ,
        "otherAlphabet":"" ,     
		brand:"Z001"
	}
	      		
	
	);

}

function testSearchStock_SAP_Retail()
{
	htmlRequest("service.app",
	{
		action : 'searchProductStockSapRetail',
		MATERIAL:getById("material").value, //"XR30A200-V10880R", 
//		MATERIAL:"FWS00376-ABLV01", 
        STORE:getById("store").value,  //"H001"
        entiretable:"YES"
	});
}

function testSearchStock_Retail_Pro()
{
	htmlRequest("service.app",
	{
		action : 'searchProductStockRetailPro',
		MATERIALRPRO:getById("materialRPro").value, //"XR30A200-V10880R", 
//		MATERIAL:"FWS00376-ABLV01", 
        STORERPRO:getById("storeRPro").value,  //"H001"
        entiretable:"YES"
	});
}
function testGetClientData()
{
	htmlRequest("service.app",
	{
		action : 'getClientData',
		
		clientId:getById("clientId").value,
		brand:"Z001"
	}
	      		
	
	);

}



function testPurchaseSummary()
{
	htmlRequest("service.app",
	{
		action : 'getPurchaseSummary',
		
		clientId:getById("clientId").value
		
	}
	      		
	
	);

}

function testPurchaseDetail()
{
	htmlRequest("service.app",
	{
		action : 'getPurchaseDetail',
		
		clientId:getById("clientId").value
		
	}
	      		
	
	);

}



function testFourMeClient()
{
	htmlRequest("service.app",
	{
		action : 'getFourMeClient',
		clientId:"0000031966",
		_brand:"Z001"
	}
	      		
	
	);

}



//sovrascrive funzione globale
function goBack()
{
	if($("#product360-Element").is(':visible'))
	{
		productHandler.prod360Hide();
	}
	else
	{
		history.back();
	}
	
	
	
	
}


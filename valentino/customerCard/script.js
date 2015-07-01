



//sovrascrive funzione globale
function goBack()
{
	if(cardHandler.somethingChanged)
	{
		//faccio vedere dialog
		showYesNoCancelDialog({
			message:"Customer data have been changed. Do you wish to save and exit?",
			yesCallback:"cardHandler.onEditConfirmed(true)",
			noCallback:"closeCard()"
			
		})
		
	}
	else 
	{
		closeCard()
	}
	
}


function closeCard()
{
	
		history.back();
		
	
}




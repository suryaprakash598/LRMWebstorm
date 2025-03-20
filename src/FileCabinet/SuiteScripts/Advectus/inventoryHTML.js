//******************************************************************************************/
function suitelet(request, response)
{
	try
	{				
		 
		 
		var contentId=4951;
		var contentIdhead=4953;
		 	
			
			var header	=	nlapiLoadFile(contentIdhead).getValue();	 
			var content	=	nlapiLoadFile(contentId).getValue();	 
			var html='<!DOCTYPE html>';
				html+='<html>';
				html+='<title>Inventory</title>';
				html+='<head>';			
				html+=	header; 
				html+='</head>';
				html+='<body>';
				html+='<div class="sub-body">'; 
				html+=	content; 
                html+=' <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.7/underscore-min.js" integrity="sha512-dvWGkLATSdw5qWb2qozZBRKJ80Omy2YN/aF3wTUVC5+D1eqbA+TjWpPpoj8vorK5xGLMa2ZqIeWCpDZP/+pQGQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>';
				html+='<script src="https://8760954.app.netsuite.com/core/media/media.nl?id=4954&c=8760954&h=u2eY_FrpWsfFsPQt2sj4bZIFrGS5T0MFKGa_5sUD-34-UY0F&_xt=.js"></script><!--Fabrics.js-->';
				html+='<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';
                html+='</div>';
				html+='</body>';
				html+='</html>';
				response.write(html);		
		 
		
	 }
		catch(e)
		{
			nlapiLogExecution('Debug', 'Errors', e);
		}
	}

	
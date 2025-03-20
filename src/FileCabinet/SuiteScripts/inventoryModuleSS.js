/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/file', 'N/record', 'N/ui/serverWidget','N/runtime'], function(file, record, serverWidget,runtime) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
			var request = context.request;
            var response = context.response;
            var flag = request.parameters.flag;
			var currScriptObj = runtime.getCurrentScript();
			var UserObj = runtime.getCurrentUser();
			var UserSubsidiary = UserObj.subsidiary;
			var UserLocation = UserObj.location;
			var Userid = UserObj.id;
		
			 
         var content = file.load({ id: 'SuiteScripts/inventoryModuleHTML.js' }).getContents();
         var header = file.load({ id: 'SuiteScripts/externallinks.js' }).getContents();
         var headercss = file.load({ id: 'SuiteScripts/inventoryModuleCSS.css' }).getContents();
		  
		  var html='<!DOCTYPE html>';
				html+='<html>';
				html+='<title>Inventory</title>';
				html+='<head>';			
				html+=	header;
				html+=	'<style>'+headercss+'</style>';
				//html+='<input type="hidden" value="'+context+'" id="employee">'; 
			    html +='<input type="hidden" value="'+Userid+'" id="employee">';
				html+='</head>';
				html+='<body>';
				html+='<div class="sub-body">'; 
				html+=	content;  
				html+='</div>';
				html+='</body>';
				html+='</html>';
				
            context.response.write(html);
        }
    }

    return { onRequest: onRequest };
});

/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/runtime', 'N/file', 'N/encode','N/url', 'N/redirect', 'N/url', 'N/format','N/email'],
		/**
		 * @param {record} record
		 * @param {search} search
		 * @param {serverWidget} serverWidget
		 */
		function(record, search, serverWidget, runtime, file, encode,ur, redirect, url, format,email) {

	/**
	 * Definition of the Suitelet script trigger point.
	 *
	 * @param {Object} context
	 * @param {ServerRequest} context.request - Encapsulation of the incoming request
	 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
	 * @Since 2015.2
	 */
	function onRequest(scriptContext) {
		var request = scriptContext.request;
		var response = scriptContext.response;
		if(request.method == "GET") {
			var form        = serverWidget.createForm({title:"Email",hideNavBar:true}); 
			  var vin = scriptContext.request.parameters.vin;
					 var customerid = scriptContext.request.parameters.customer;	 
           var customername = scriptContext.request.parameters.customername;	
						var operationVin =  form.addField({id:'operation_service_vin',label:'VIN',type:'text'}); 
						operationVin.defaultValue = vin; 
						operationVin.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
					   var operationhtml =  form.addField({id:'operation_service_email',label:' ',type:'inlinehtml'});
						var fileobj = file.load({id:16297});
						var htmlcode = fileobj.getContents();
						operationhtml.defaultValue = htmlcode;
						scriptContext.response.writePage(form);

			/* var Customerfld = form.addField({id:"custpage_receipinet", label:"Receipient", type:serverWidget.FieldType.SELECT, source: "customer"});
			Customerfld.isMandatory = true;
			 
			Customerfld.updateBreakType({
				breakType: serverWidget.FieldBreakType.STARTROW
			});


			var templatefld      = form.addField({id:"custpage_template", label:"Template", type:serverWidget.FieldType.SELECT, source: "customrecord_operation_authorization_tem"});
			var templatesubfld      = form.addField({id:"custpage_template_subject", label:"Subject", type:serverWidget.FieldType.TEXT});
			var templatemsgfld      = form.addField({id:"custpage_template_message", label:"Message", type:serverWidget.FieldType.TEXTAREA});
			  
			var requestauthfld      = form.addField({id:"custpage_request_authroization", label:"Request Authorization", type:serverWidget.FieldType.CHECKBOX});
			var requestsignfld      = form.addField({id:"custpage_request_esignature", label:"Request Esigature", type:serverWidget.FieldType.CHECKBOX});
			var displaymsgfld      = form.addField({id:"custpage_display_msg", label:"Display Message", type:serverWidget.FieldType.CHECKBOX});
			
			form.addSubmitButton({id: 'custpage_sendemail', label: 'EMAIL'});
			 form.clientScriptModulePath = "./cs_customer_emailauthorization.js"; */
			//response.writePage(form);
		}else{

					var receipient = scriptContext.request.parameters.custpage_receipinet ;
					var subject = scriptContext.request.parameters.custpage_template_subject;
					var body = scriptContext.request.parameters.custpage_template_message;
					log.debug('receipient',receipient);
				email.send({
					author:-5,
					recipients:receipient,
					subject:subject,
					body:body
					});

			var onclickScript = " <html><body> <script type='text/javascript'>";

			onclickScript += "try{";

			//onclickScript += "window.opener.location.reload();"
				onclickScript += "window.close()"; //window.close();
			onclickScript += "}catch(e){}</script></body></html>";



			response.write(onclickScript);
		}
	}

	 function getEmailTemplate()
	 {
		
	 }
	return {
		onRequest: onRequest
	};

});



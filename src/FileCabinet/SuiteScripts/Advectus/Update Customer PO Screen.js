/*******************************************************************************
{{ScriptHeader}} *
 * Company:                  {{Company}}
 * Author:                   {{Name}} - {{Email}}
 * File:                     {{ScriptFileName}}
 * Script:                   {{ScriptTitle}}
 * Script ID:                {{ScriptID}}
 * Version:                  1.0
 *
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 *
 ******************************************************************************/

define(['N/runtime',  'N/record', 'N/search', 'N/log','N/ui/serverWidget'], function(
  /** @type {import('N/runtime')} 		**/ runtime,
  /** @type {import('N/record')}  		**/ record,
  /** @type {import('N/search')}  		**/ search,
  /** @type {import('N/log')}     		**/ log,
  /** @type {import('N/serverWidget')}  **/ serverWidget
) {

  /**
   * context.request
   * context.response
   *
   * @type {import('N/types').EntryPoints.Suitelet.onRequest}
   */
  function onRequest(context) {
    // no return value
	try{
		if(context.request.method=='GET'){
			var recid =  context.request.parameters.recid;
			var form = serverWidget.createForm({
				title : 'Customer PO'
			});
			var field = form.addField({
				id : 'custpage_otherref',
				type : serverWidget.FieldType.TEXT,
				label : 'PO #'
			});
			var field1 = form.addField({
				id : 'custpage_workorderid',
				type : serverWidget.FieldType.TEXT,
				label : 'Workorder'
			});
			field1.defaultValue=recid;
			field1.updateDisplayType({
					displayType : serverWidget.FieldDisplayType.HIDDEN
				});
			form.addSubmitButton({
				label : 'Submit'
			});
			context.response.writePage(form);
		}else{
			var po = context.request.parameters.custpage_otherref;
			var recid = context.request.parameters.custpage_workorderid;
			log.debug('recid',recid);
			log.debug('po',po);
			if(recid)
			{
				record.submitFields({type:record.Type.SALES_ORDER,id:recid,values:{otherrefnum:po},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
			}
			var onclickScript=" <html><body> <script type='text/javascript'>" +
			"try{debugger;" ; 
			//onclickScript+="window.parent.getActive();";			
			onclickScript+="window.opener.location.reload();";	
			 		
			onclickScript+="window.close();;";
			onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";
			context.response.write(onclickScript);
		}
		
	}catch(e)
	{
		log.debug('error',e.toString())
	}
  }

  return {
    'onRequest': onRequest
  };

});

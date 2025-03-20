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
	 var form = serverWidget.createForm({
                title: "Approval Estimate Jobs"
            });
	var sublist = form.addSublist({
                        id: "custpage_sublist",
                        type: serverWidget.SublistType.LIST,
                        label: "List"
                    });
                    sublist.addMarkAllButtons();
                    addFields(sublist);
					addData(sublist);
					 context.response.writePage(form);
  }
  function addFields(sublist) {
		
        sublist.addField({
            id: "cust_mark",
            type: serverWidget.FieldType.CHECKBOX,
            label: "Mark"
        });
        sublist.addField({
            id: "cust_job_item",
            type: serverWidget.FieldType.TEXT,
            label: "Item"
        })
         
       var jobval =  sublist.addField({
            id: "cust_job_jobval",
            type: serverWidget.FieldType.TEXT,
            label: "File 1"
        }) 
         jobval.defaultValue = '<input type="file"/>'

    }
	 function addData(sublist) {
        try {
			var data=[1,2,3];
            for (var i = 0; i < data.length; i++) {
				 sublist.setSublistValue({
                    id: "cust_job_item",
                    line: i,
                    value: data[i]
                });
                sublist.setSublistValue({
                    id: "cust_job_jobval",
                    line: i,
                    value: '<input type="file"/>'
                });
                 
				 
            }
        } catch (e) {
            log.debug('error', e.toString());
			 
        }
    }

  return {
    'onRequest': onRequest
  };

});

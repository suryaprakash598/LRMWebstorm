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
 * @NScriptType UserEventScript
 *
 ******************************************************************************/

define(['N/runtime', 'N/task', 'N/record', 'N/search', 'N/log'], function(
  /** @type {import('N/runtime')} **/ runtime,
  /** @type {import('N/task')}    **/ task,
  /** @type {import('N/record')}  **/ record,
  /** @type {import('N/search')}  **/ search,
  /** @type {import('N/log')}     **/ log
) {

  /**
   * context.newRecord
   * context.oldRecord
   * context.type
   *
   * @type {import('N/types').EntryPoints.UserEvent.afterSubmit}
   */
  function afterSubmit(context) {
     try{
		var rec = context.newRecord;  //create mode
		var rectype = rec.type;
		var recId = rec.id;
		 
		
	 }catch(e)
	 {
		 log.debug('Error',e.toString());
	 }
  }

  /**
   * context.newRecord
   * context.type
   * context.form
   * context.request
   *
   * @type {import('N/types').EntryPoints.UserEvent.beforeLoad}
   */
  function beforeLoad(context) {
    try{
		var form = context.form;
		var RecObjs				=	context.newRecord;    		
				var RecordTypes			=	RecObjs.type;
				var RecordIDD			=	RecObjs.id;
				var otherrefnum		=	RecObjs.getValue({fieldId:'otherrefnum'});
				var customer		=	RecObjs.getValue({fieldId:'entity'});
				var isPorequired = false;
				if(customer!='')
				{
					var customerObj = search.lookupFields({type:'customer',id:customer,columns:['custentity_vel_po_required']});
					isPorequired = customerObj.custentity_vel_po_required;
				}
				log.debug('isPorequired',isPorequired);
				//custentity_vel_po_required
			if(isPorequired && otherrefnum=='' && RecordTypes=='salesorder')
			{
				form.addButton({
						id : 'custpage_addotherref',
						label : 'CustomerPO',
						functionName:'updateCustomerPO('+RecordIDD+')'
					});
					form.clientScriptModulePath = "./advs_cs_validations_lib.js";
			}
			
			
	}catch(e)
	{
		log.debug('error',e.toString());
	}
  }

  /**
   * context.newRecord
   * context.oldRecord
   * context.type
   *
   * @type {import('N/types').EntryPoints.UserEvent.beforeSubmit}
   */
  function beforeSubmit(context) {
    // no return value
  }

  return {
   // 'afterSubmit':  afterSubmit,
    'beforeLoad':   beforeLoad,
    'beforeSubmit': beforeSubmit
  };

});

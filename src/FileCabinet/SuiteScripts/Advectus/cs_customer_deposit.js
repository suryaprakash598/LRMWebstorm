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
 * @NScriptType ClientScript
 *
 ******************************************************************************/

define(['N/runtime', 'N/ui/dialog', 'N/record', 'N/search', 'N/log'], function(
  /** @type import('N/runtime')}   **/ runtime,
  /** @type import('N/ui/dialog')} **/ dialog,
  /** @type import('N/record')}    **/ record,
  /** @type import('N/search')}    **/ search,
  /** @type import('N/log')}       **/ log
) {

  /**
   * context.currentRecord
   * context.sublistId
   * context.fieldId
   * context.line
   * context.column
   *
   * @type {import('N/types').EntryPoints.Client.fieldChanged}
   */
  function fieldChanged(context) {
    // no return value
	try{
		var currentRecord = context.currentRecord;
		if(context.fieldId=='custpage_create_deposit_registrationfee' ||
			context.fieldId=='custpage_create_deposit_titlefee' ||
			context.fieldId=='custpage_create_deposit_pickupfee' ||
			context.fieldId=='custpage_create_deposit_amount' 
		)
		{
			var regFee = currentRecord.getValue({fieldId:'custpage_create_deposit_registrationfee'})||0;
			var titleFee = currentRecord.getValue({fieldId:'custpage_create_deposit_titlefee'})||0;
			var pickupFee = currentRecord.getValue({fieldId:'custpage_create_deposit_pickupfee'})||0;
			var depAmount = currentRecord.getValue({fieldId:'custpage_create_deposit_amount'})||0;
			var DepositIncp = currentRecord.getValue({fieldId:'custpage_create_deposit_inception'})||0;
			var PaymentIncp = currentRecord.getValue({fieldId:'custpage_create_payment_inception'})||0;
			var remainbal = currentRecord.getValue({fieldId:'custpage_create_depo_remaining_bal'})||0;
			var delbaordid = currentRecord.getValue({fieldId:'custpage_create_depo_devbrecid'})||0;
			if(!DepositIncp){DepositIncp = 0}
			if(!PaymentIncp){PaymentIncp = 0}
			var totalInceptionValue = (DepositIncp*1)+(PaymentIncp*1);
			
			//var incepAmount = currentRecord.getValue({fieldId:'custpage_create_depo_total_inception'})||0;
			
			if(delbaordid!=0){
				var rembal = remainbal - depAmount;
			}else {
				var total = (regFee*1)+(titleFee*1)+(pickupFee*1);//+(incepAmount*1);
				var incpTotal = (regFee*1)+(titleFee*1)+(pickupFee*1)+(totalInceptionValue*1);
				var rembal = depAmount - incpTotal;
				currentRecord.setValue({fieldId:'custpage_create_depo_total_inception',value:incpTotal,ignoreFieldChange:true});
			} 
			
			currentRecord.setValue({fieldId:'custpage_create_depo_remaining_bal',value:rembal,ignoreFieldChange:true});
		}
	}catch(e)
	{
		log.debug('error',e.toString());
	}
  }

   
  return {
    'fieldChanged':   fieldChanged 
  };

});

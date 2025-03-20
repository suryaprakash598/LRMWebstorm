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

define(['N/runtime',  'N/record', 'N/search', 'N/log','N/ui/message','N/redirect'], function(
  /** @type {import('N/runtime')} **/ runtime, 
  /** @type {import('N/record')}  **/ record,
  /** @type {import('N/search')}  **/ search,
  /** @type {import('N/log')}     **/ log,
  /** @type {import('N/log')}     **/ message,
  /** @type {import('N/log')}     **/ redirect 
  
  // /** @type {import('N/log')}     **/ libUtil,
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
    // no return value
    var curRec  =   context.newRecord;
    var form    =   context.form;
	var recid   =   curRec.id;
    var status  =   curRec.getValue({fieldId:"custrecord_advs_l_h_status"});
	var cpcEnable   =   curRec.getValue({fieldId:"custrecord_advs_l_a_cpc"});
    var cpcid   =   curRec.getValue({fieldId:"custrecord_advs_l_a_curr_cps"});
	var vinBodyFld   =   curRec.getValue({fieldId:"custrecord_advs_la_vin_bodyfld"});
    
	if(( status==5) ){//libUtil.leaseStatus.active
					if(cpcEnable == true || cpcEnable == "true"){
						form.addButton({id:"custpage_cpc_close",label:"END CPC",functionName:"removeCPC("+recid+","+cpcid+")"});

						context.form.addPageInitMessage({
							type: message.Type.ERROR,
							title: "<b style='display:none;'>!</b>",
							message: "<b style='font-size:18px;color:black;'>This Customer is on CPC.</b>"
						});
					}else{
						form.addButton({id:"custpage_cpc_add",label:"Start CPC",functionName:"addCPC1("+recid+")"});
					}

					//form.addButton({id:"custpage_return",label:"Return",functionName:"returnCall("+recid+")"});
					var model = ""; var brand = ""; var location = "";
					if(vinBodyFld){
						var fields = ['custrecord_advs_vm_model', 'custrecord_advs_vm_vehicle_brand', 'custrecord_advs_vm_location_code','internalid'];
						var SearchObj = search.lookupFields({
							type: 'customrecord_advs_vm',
							id: vinBodyFld,
							columns: fields
						});
						model = SearchObj['custrecord_advs_vm_model'][0].value;
						brand = SearchObj['custrecord_advs_vm_vehicle_brand'][0].value;
						location = SearchObj['custrecord_advs_vm_location_code'][0].value;
					}
					//form.addButton({id:"custpage_swap",label:"Swap",functionName:"swapBtn("+recid+","+vinBodyFld+","+model+","+brand+","+location+")"});

					/* if(!repoLink){
						form.addButton({id:"custpage_repo",label:"Repo",functionName:"createRepo("+recid+","+vinBodyFld+")"});

					}else{
						scriptContext.form.addPageInitMessage({
							type: message.Type.INFORMATION,
							title: "<b style='display:none;'>!</b>",
							message: "<b style='font-size:18px;color:black;'>This Vehicle is on OFR.</b>"
						});
					} */
				}
				form.clientScriptModulePath = "./addcpclib.js";
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
    'afterSubmit':  afterSubmit,
    'beforeLoad':   beforeLoad,
    'beforeSubmit': beforeSubmit
  };

});
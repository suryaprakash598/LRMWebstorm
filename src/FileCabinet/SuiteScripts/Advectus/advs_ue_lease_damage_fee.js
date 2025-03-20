/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/format','./advs_lib_rental_leasing','./advs_lib_util'], 
function (serverWidget, record, search, format, lib_rental, libUtil) {
  function beforeLoad(context) {
    }
  function beforeSubmit(context){
    }
  function afterSubmit(context){
    if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
    var  recordID      = context.newRecord.id;
    var  recordType    = context.newRecord.type;
    var  DamageFeeRec  = context.newRecord;
    
    var LeaseID        =  DamageFeeRec.getValue('custrecord_advs_lea_d_f_lease_link');
    var InvoiceExist   =  DamageFeeRec.getValue('custrecord_advs_lea_d_f_invoice');
    var DamageFeeDate   = DamageFeeRec.getValue('custrecord_advs_lea_d_f_date');
    var DamageFeeAmnt   = DamageFeeRec.getValue('custrecord_advs_lea_d_f_amount');
    

    var setupData   = lib_rental.invoiceTypeSearch();

if(LeaseID){
  if(InvoiceExist){}else{
    var LeaseFlds   = ['custrecord_advs_l_h_location', 'custrecord_advs_l_h_subsidiary', 'custrecord_advs_l_h_customer_name', 'custrecord_advs_la_vin_bodyfld'];
    var LeaseData   = search.lookupFields({type:"customrecord_advs_lease_header", id: LeaseID, columns: LeaseFlds});

    var LeaseLoc    = LeaseData["custrecord_advs_l_h_location"][0].value;
    var LeaseSubsi  = LeaseData["custrecord_advs_l_h_subsidiary"][0].value;
    var LeaseEntity = LeaseData["custrecord_advs_l_h_customer_name"][0].value;
    var LeaseVin    = LeaseData["custrecord_advs_la_vin_bodyfld"][0].value;
  
  
    try {  
      var invoiceRecord = record.create({type: record.Type.INVOICE, isDynamic: true});
      invoiceRecord.setText({fieldId: "customform", text: "ADVS Lease Invoice"});
      invoiceRecord.setValue({fieldId: "entity", value: LeaseEntity});
      invoiceRecord.setValue({fieldId: "subsidiary", value: LeaseSubsi});
      invoiceRecord.setValue({fieldId: "trandate", value: DamageFeeDate});
      invoiceRecord.setValue({fieldId: "duedate", value: DamageFeeDate});
      invoiceRecord.setValue({fieldId: "location", value: LeaseLoc});
      invoiceRecord.setValue({fieldId:"custbody_advs_lease_head", value: LeaseID});
      invoiceRecord.setValue({fieldId:"custbody_advs_invoice_type",value: setupData[libUtil.rentalinvoiceType.lease_damage]["id"]});

  
      invoiceRecord.selectNewLine({sublistId:"item"});
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId: "item", value: setupData[libUtil.rentalinvoiceType.lease_damage]["damageitem"]});
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId: "quantity", value:1});
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId: "memo",value: "Damage Charge"});
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId: "description", value: "Damage Charge"});
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId: "rate", value: DamageFeeAmnt});
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId: "amount", value: DamageFeeAmnt});  
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId: "custcol_advs_st_applied_to_vin", value: LeaseVin});
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId: "custcol_advs_st_lease_line_link", value: LeaseID});
      invoiceRecord.commitLine({sublistId:"item"});

      var invoiceId = invoiceRecord.save({enableSourcing: true,ignoreMandatoryFields: true});
    
      log.debug('Invoice Created', invoiceId);
      if(invoiceId){
      var id = record.submitFields({type: recordType, id: recordID, values: {'custrecord_advs_lea_d_f_invoice': invoiceId}, 
        options: {enableSourcing: true, ignoreMandatoryFields : true} });
        }
    } catch (e) {
        log.error('Error Creating Invoice');
           }
      }
    }
  }
}

 
  return {
    beforeLoad: beforeLoad,
    beforeSubmit: beforeSubmit,
    afterSubmit: afterSubmit
  };
});

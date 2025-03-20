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
    if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
          var TollchargeRec = context.newRecord;
          
          var TollDate          = TollchargeRec.getValue('custrecord_advs_lea_t_p_c_tran_dt');
          var TrimTolldate      = TollDate.trim();
          var NTollDate         = new Date(TrimTolldate);
          var FormatedTolldate  = format.format({value: NTollDate, type: format.Type.DATE});
          var ParseDateValue    = format.parse({value: FormatedTolldate, type: format.Type.DATE});

          var setDate = TollchargeRec.getValue('custrecord_advs_lea_t_p_c_date'); 

            if(setDate){}else{
              if(ParseDateValue){
                TollchargeRec.setValue({fieldId: 'custrecord_advs_lea_t_p_c_date', value: ParseDateValue});
              }
          }

        var LeaseData = TollchargeRec.getValue('custrecord_advs_lea_tol_parking_charge');
        
        if(LeaseData){}else{
        var Trackcode = TollchargeRec.getValue('custrecord_advs_lea_t_p_c_tra_cod');
        
        if(Trackcode){
          var VinID   = getvinid(Trackcode);
          if(VinID){
            var LeaseIdSearch = getleaseid(ParseDateValue, VinID);
            try{
              TollchargeRec.setValue({fieldId: 'custrecord_advs_lea_tol_parking_charge', value: LeaseIdSearch});
            }catch(e) {
              log.error('Check LeaseID Value');
                 }
              }
            }
         }
    }
}
  function afterSubmit(context){
    if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
    var  recordID      = context.newRecord.id;
    var  recordType    = context.newRecord.type;
    var  TollchargeRec = context.newRecord;
    
    var LeaseID        =  TollchargeRec.getValue('custrecord_advs_lea_tol_parking_charge');
    var InvoiceExist   =  TollchargeRec.getValue('custrecord_advs_lea_t_p_c_invoice');
    var TollParkDate   =  TollchargeRec.getValue('custrecord_advs_lea_t_p_c_date');
    var TollParkAmnt   =  TollchargeRec.getValue('custrecord_advs_lea_t_p_c_amount');
    var TollParkVin    =  TollchargeRec.getValue('custrecord_advs_lea_t_p_c_vin');
    var processFee     =  TollchargeRec.getValue('custrecord_advs_t_p_c_proc_fee')*1;


    var setupData   = lib_rental.invoiceTypeSearch();


if(LeaseID){
  if(InvoiceExist){}else{
    var LeaseFlds   = ['custrecord_advs_l_h_location', 'custrecord_advs_l_h_subsidiary', 'custrecord_advs_l_h_customer_name'];
    var LeaseData   = search.lookupFields({type:"customrecord_advs_lease_header", id: LeaseID, columns: LeaseFlds});

    var LeaseLoc    = LeaseData["custrecord_advs_l_h_location"][0].value;
    var LeaseSubsi  = LeaseData["custrecord_advs_l_h_subsidiary"][0].value;
    var LeaseEntity = LeaseData["custrecord_advs_l_h_customer_name"][0].value;
  
  
    try {  
      var invoiceRecord = record.create({type: record.Type.INVOICE, isDynamic: true});
      invoiceRecord.setText({fieldId: "customform", text: "ADVS Lease Invoice"});
      invoiceRecord.setValue({fieldId: 'entity', value: LeaseEntity});
      invoiceRecord.setValue({fieldId: 'subsidiary', value: LeaseSubsi});
      invoiceRecord.setValue({fieldId: 'trandate', value: TollParkDate});
      invoiceRecord.setValue({fieldId: 'duedate', value: TollParkDate});
      invoiceRecord.setValue({fieldId: 'location', value: LeaseLoc});
      invoiceRecord.setValue({fieldId:"custbody_advs_lease_head", value: LeaseID});
      invoiceRecord.setValue({fieldId:"custbody_advs_invoice_type",value: setupData[libUtil.rentalinvoiceType.lease_toll]["id"]});

  
      invoiceRecord.selectNewLine({sublistId:"item"});
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"item", value: setupData[libUtil.rentalinvoiceType.lease_toll]["tollItem"]});
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"quantity", value:1});
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"memo",value: "Toll charge"});
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"description", value: "Toll charge"});
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"rate", value: TollParkAmnt});
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"amount", value: TollParkAmnt});  
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"custcol_advs_st_applied_to_vin", value: TollParkVin});
      invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"custcol_advs_st_lease_line_link", value: LeaseID});
      invoiceRecord.commitLine({sublistId:"item"});

      if(processFee>0){
          invoiceRecord.selectNewLine({sublistId:"item"});
          invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"item", value: setupData[libUtil.rentalinvoiceType.lease_toll]["tollItem"]});
          invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"quantity", value:1});
          invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"memo",value: "Processing charge"});
          invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"description", value: "Processing charge"});
          invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"rate", value: processFee});
          invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"amount", value: processFee});
          invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"custcol_advs_st_applied_to_vin", value: TollParkVin});
          invoiceRecord.setCurrentSublistValue({sublistId:"item", fieldId:"custcol_advs_st_lease_line_link", value: LeaseID});
          invoiceRecord.commitLine({sublistId:"item"});
      }

      var invoiceId = invoiceRecord.save({enableSourcing: true,ignoreMandatoryFields: true});
    
      log.debug('Invoice Created', invoiceId);
      if(invoiceId){
      var id = record.submitFields({type: recordType, id: recordID, values: {'custrecord_advs_lea_t_p_c_invoice': invoiceId}, 
        options: {enableSourcing: true, ignoreMandatoryFields : true} });
        }
    } catch (e) {
        log.error('Error Creating Invoice',e);
           }
      }
    }
  }
}

  var LeaseId = "";
  function getleaseid(ParseDate, ViNValue){
     var LeaseDate = format.format({value: ParseDate, type: format.Type.DATE});
        if(LeaseDate && ViNValue){
            var leaseidsrch= search.create({
                type: "customrecord_advs_lease_header",
                filters:
                [
                  ["custrecord_advs_la_vin_bodyfld","anyof", ViNValue], 
                  "AND", 
                  ["custrecord_advs_l_h_start_date","onorbefore", LeaseDate], 
                  "AND", 
                  ["custrecord_advs_l_h_end_date","onorafter", LeaseDate]
                ],
                columns:
                [
                   search.createColumn({name: "internalid", label: "Internal ID"})       
                ]
              });
              leaseidsrch.run().each(function(result){
                var InterID = result.getValue("internalid");
                LeaseId = InterID;
                return true;
                    }); 
        }
       return LeaseId;
  }

  var VinData = "";
  function getvinid(TrackCode){

    var Vinsearch = search.create({type: "customrecord_advs_vm",
        filters:
        [
          [ ["name","is", TrackCode],"OR", ["custrecord_advs_em_serial_number","is", TrackCode],"OR", ["custrecord_advs_vm_engine_number","is", TrackCode]]
          ,"AND",
          ["isinactive","is","F"]
        ],
        columns:
        [
           search.createColumn({
              name: "internalid", sort: search.Sort.ASC, label: "Internal ID"})
        ]
     });
     Vinsearch.run().each(function(result){
        var VinInternalId = result.getValue("internalid");
        VinData = VinInternalId;
        return true;
    }); 
    return VinData;
  }


  return {
    beforeLoad: beforeLoad,
    beforeSubmit: beforeSubmit,
    afterSubmit: afterSubmit,
    getleaseid: getleaseid,
    getvinid: getvinid
  };
});

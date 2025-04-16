/*******************************************************************************
{{ScriptHeader}} *
 * Company:                  {{Company}}
 * Author:                   {{Name}} - {{Email}}
 * File:                     {{ScriptFileName}}
 * Script:                   {{ScriptTitle}}
 * Script ID:                {{ScriptID}}
 * Version:                  1.0
 *
 * @NApiVersion 2.1
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
       try {
           // if (context.type === context.UserEventType.EDIT) {
        if (context.type === context.UserEventType.CREATE) {
           let rec = context.newRecord;  //create mode
           let rectype = rec.type;
           let DepositRecId = rec.id;
           let vin = rec.getValue({fieldId: 'custbody_advs_vin_create_deposit'});
           let LocId = rec.getValue({fieldId: 'location'});
           let AmountValue = rec.getValue({fieldId: 'payment'});
           if (!AmountValue) {
               AmountValue = 0
           }
           let Customerid = rec.getValue({fieldId: 'customer'});
           let SalesrepID = rec.getValue({fieldId: 'custbody_advs_st_out_side_sal_rep'});
           if (vin) {
               let depositbalance = getDepositBalance(vin);
               let customerdepositSearchObj = search.create({
                   type: "customerdeposit",
                   filters:
                       [
                           ["type", "anyof", "CustDep"],
                           "AND",
                           ["custbody_advs_vin_create_deposit", "anyof", vin],
                           "AND",
                           ["mainline", "is", "T"]
                       ],
                   columns:
                       [
                           "tranid"
                       ]
               });
               let searchResultCount = customerdepositSearchObj.runPaged().count;
               customerdepositSearchObj.run().each(function (result) {
                   record.submitFields({
                       type: 'customrecord_advs_vm',
                       id: vin,
                       values: {
                           custrecord_is_deposit_created: true,
                           custrecord_deposit_count: searchResultCount,
                           custrecord_deposit_balance: depositbalance,
                           custrecord_reservation_date: new Date()
                       },
                       options: {enableSourcing: !1, ignoreMandatoryFields: !0}
                   });
               });
               let DelBoardId = getDeliveryBoardData(vin);
               let DataObj = getSoftHoldData(vin);
               let DataObj1 = getSoftholdsalesrep(vin);
               let RecordId = DataObj.RecordId;
               let TotalInceptionValue = DataObj.TotIncep;
               let SalesQuote = DataObj.SalesQuote;
               let TruckReady = DataObj.TruckReady;
               let SalesrepID = DataObj1.Salesrep;
               log.debug(" SalesQuote => "+SalesQuote+""," TruckReady => "+TruckReady);
               if(SalesQuote == "T" || SalesQuote == true || SalesQuote == "true"){
                  SalesQuote = true;
               }
               else{
                  SalesQuote = false;
               }
               if(TruckReady == "T" || TruckReady == true || TruckReady == "true"){
                  TruckReady = true;
               }
               else{
                    TruckReady = false;
               }
               let DepositValue = 0;
               let DepoRecord = '',ReservationStatus = '';
               var Fields = {};
			   log.debug('DepoRecord',DepoRecord);
               if (DelBoardId) {
                   DepoRecord = record.load({
                       type: 'customrecord_advs_vm_inv_dep_del_board',
                       id: DelBoardId,
                       isDynamic: true
                   });
                   DepositValue = DepoRecord.getValue({fieldId: 'custrecord_advs_in_dep_deposit'});
                   TotalInceptionValue = DepoRecord.getValue({fieldId: 'custrecord_advs_in_dep_tot_lease_incepti'});
                   log.debug('TotalInceptionValue:-->',TotalInceptionValue);
                   ReservationStatus = getOldValuefromVehicle(vin);
               }
               else if(SalesQuote==true){
				   TotalInceptionValue = DataObj.TotIncep;
                   DepoRecord = record.create({type: 'customrecord_advs_vm_inv_dep_del_board', isDynamic: true});
                   if (vin) {
                       DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_vin', value: vin});
                   }
                   if (LocId) {
                       DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_location', value: LocId});
                   }
                   if (DataObj.DepIncep) {
                       DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_inception', value: DataObj.DepIncep});
                   }
                   if (DataObj.PaymentIncep) {
                       DepoRecord.setValue({
                           fieldId: 'custrecord_advs_in_payment_inception',
                           value: DataObj.PaymentIncep
                       });
                   }
                   if (SalesrepID) {
                       DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_sales_rep', value: SalesrepID});
                   }
                   
                   DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_tot_lease_incepti', value: TotalInceptionValue}); //DataObj.TotIncep
                   DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_registration_fee', value: DataObj.RegFee});
                   DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_title_fee', value: DataObj.TitleFee});
                   DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_pickup_fee', value: DataObj.PickupFee});
                   DepoRecord.setValue({fieldId: 'custrecord_advs_personal_prop_tax', value: DataObj.ppTax});
               }else{
                  // return  true;
               }

               let TotalDeposit = (DepositValue * 1) + (AmountValue * 1);
               TotalDeposit = TotalDeposit * 1;
               TotalDeposit = TotalDeposit.toFixed(2);

               //ADDING FEES

               log.debug('TotalDeposit', TotalDeposit);
               log.debug('TotalInceptionValue', TotalInceptionValue);
               let BalanceValue = (TotalInceptionValue * 1) - (TotalDeposit * 1);
               BalanceValue = BalanceValue * 1;
               BalanceValue = BalanceValue.toFixed(2);
               log.debug('BalanceValue', BalanceValue);

               if(DepoRecord!=''){
                   DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_sales_quote', value: SalesQuote});
                   DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_truck_ready', value: TruckReady});

                   if (Customerid) {
                       DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_name', value: Customerid});
                   }
                   if (TotalDeposit) {
                       DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_deposit', value: TotalDeposit});
                   }
                   if (DepositRecId) {
                       DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_trans_link', value: DepositRecId});
                   }
                   DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_balance', value: BalanceValue});
                   let DepoRecordID = DepoRecord.save({enableSourcing: true, ignoreMandatoryFields: true});
                   log.debug('DepoRecordID',DepoRecordID);
                   if (DepoRecordID) {
                       if (RecordId) {
                           //NOT SURE WHY WE ARE DELETING THIS LINE SO SURYA IS COMMENTING ON 080425
                           /*record.delete({
                               type: 'customrecord_advs_inventory_soft_hold_lo',
                               id: RecordId
                           });*/

                       }
                   }
               }

              if(DepositRecId){
                  Fields['custrecord_advs_lease_inventory_delboard'] = true;
                  if(ReservationStatus){
                      Fields['custrecord_advs_vm_reservation_status'] = ReservationStatus;
                  }
                  var vinholdstatus = search.lookupFields({type:"customrecord_advs_vm",id:vin,columns:["custrecord_reservation_hold"]});
                  var vinholdstatusval =  vinholdstatus.custrecord_reservation_hold[0].value;
                  if(vinholdstatusval==4){

                  }else{
                      Fields['custrecord_reservation_hold'] = 3; //on hold on deposit to vin
                  }

                  if(BalanceValue){
                      Fields['custrecord_deposit_balance'] = BalanceValue;
                  }
                  record.submitFields({
                      type: 'customrecord_advs_vm',
                      id: vin,
                      values: Fields,
                      options: {
                          enableSourcing: true,
                          ignoreMandatoryFields: true
                      }
                  });
              }

           }
       }
       }catch(e)
       {
           log.debug('Error',e.toString());
       }
    }
    function getDepositBalance(vin) {
        try{
            var customrecord_advs_vm_inv_dep_del_boardSearchObj = search.create({
                 type: "customrecord_advs_vm_inv_dep_del_board",
                 filters:
                 [
                    ["custrecord_advs_in_dep_vin","anyof",vin], 
                    "AND", 
                    ["isinactive","is","F"], 
                    "AND", 
                    ["custrecord_advs_in_dep_trans_link","noneof","@NONE@"]
                 ],
                 columns:
                 [
                    search.createColumn({ name: "custrecord_advs_in_dep_balance", summary: "SUM" })
                 ]
              });
              var searchResultCount = customrecord_advs_vm_inv_dep_del_boardSearchObj.runPaged().count; 
              var balance=0;
              customrecord_advs_vm_inv_dep_del_boardSearchObj.run().each(function(result){
                  balance =  result.getValue({ name: "custrecord_advs_in_dep_balance", summary: "SUM" });
                 return true;
              });
               return balance;
        }catch(e)
        {
            log.debug('error',e.toString());
        }
    }
  
      function getDeliveryBoardData(VinId){
          let RecordId = '';
          let SearchObj = search.create({
              type: 'customrecord_advs_vm_inv_dep_del_board',
              filters:[
                  ['isinactive','is','F'],
                  'AND',
                  ['custrecord_advs_in_dep_balance','greaterthan',0],
                  'AND',
                  ['custrecord_advs_in_dep_vin','anyof',VinId]
              ],
              columns: [
                  'internalid'
              ]
          });
          SearchObj.run().each(function (result) {
              RecordId = result.getValue('internalid');
              return true;
          });
          return RecordId;
      }
  
      function getSoftHoldData(VinId){
          let RecordId = '';
          let DataObj = {};
          let SearchObj = search.create({
              type: 'customrecord_advs_inventory_soft_hold_lo',
              filters:[
                  ['isinactive','is','F'],
                  'AND',
                  ['custrecord_advs_ishlf_vin','anyof',VinId]
              ],
              columns: [
                  'internalid',
                  'custrecord_advs_ishlf_registration_fee',
                  'custrecord_advs_ishlf_title_fee',
                  'custrecord_advs_ishlf_pickup_fee',
                  'custrecord_advs_ishlf_deposit_inception',
                  'custrecord_advs_ishlf_payment_inception',
                  'custrecord_advs_ishlf_total_inception',
                  'custrecord_advs_soft_hold_log_sales_quot',
                  'custrecord_advs_ishlf_truck_ready',
                  'custrecord_personal_property_tax',
				//  'custrecord_advs_soft_hold_salesrep'
              ]
          });
          SearchObj.run().each(function (result) {
              let RecordId = result.getValue('internalid');
              let RegFee = result.getValue('custrecord_advs_ishlf_registration_fee');
              let TitleFee = result.getValue('custrecord_advs_ishlf_title_fee');
              let PickupFee = result.getValue('custrecord_advs_ishlf_pickup_fee');
              let DepIncep = result.getValue('custrecord_advs_ishlf_deposit_inception');
              let PaymentIncep = result.getValue('custrecord_advs_ishlf_payment_inception');
              let TotIncep = result.getValue('custrecord_advs_ishlf_total_inception');
              let SalesQuote = result.getValue('custrecord_advs_soft_hold_log_sales_quot');
              let TruckReady = result.getValue('custrecord_advs_ishlf_truck_ready');
              let ppTax = result.getValue('custrecord_personal_property_tax');
             // let Salesrep = result.getValue('custrecord_advs_soft_hold_salesrep');
    
              DataObj.RecordId = RecordId;
              DataObj.RegFee = RegFee;
              DataObj.TitleFee = TitleFee;
              DataObj.PickupFee = PickupFee;
              DataObj.DepIncep = DepIncep;
              DataObj.PaymentIncep = PaymentIncep;
              DataObj.TotIncep = TotIncep;
              DataObj.SalesQuote = SalesQuote;
              DataObj.TruckReady = TruckReady;
              DataObj.ppTax = ppTax;
             // DataObj.Salesrep = Salesrep;
              return true;
          });
          return DataObj;
      }
	  function getSoftholdsalesrep(VinId)	  {
		   
          let DataObj = {};
		  let SearchObj = search.create({
              type: 'customrecord_advs_soft_hold_status_inven',
              filters:[
                  ['isinactive','is','F'],
                  'AND',
                  ['custrecord_advs_vm_soft_hold_status','anyof',VinId]
              ],
              columns: [
                  'internalid', 
				  'custrecord_advs_soft_hold_salesrep'
              ]
          });
          SearchObj.run().each(function (result) {
              let RecordId = result.getValue('internalid'); 
              let Salesrep = result.getValue('custrecord_advs_soft_hold_salesrep');
    
              DataObj.RecordId = RecordId; 
              DataObj.Salesrep = Salesrep;
              return true;
          });
          return DataObj;
		  
	  }
      function getOldValuefromVehicle(vin){
          let vmSearchObj = search.create({
              type: "customrecord_advs_vm",
              filters:
                  [
                      ["systemnotes.field","anyof","CUSTRECORD_ADVS_VM_RESERVATION_STATUS"],
                      "AND",
                      ["systemnotes.type","is","F"],
                      "AND",
                      ["internalid","anyof",vin]
                  ],
              columns:
                  [
                      search.createColumn({ name: "newvalue", join: "systemNotes", label: "New Value" }),
                      search.createColumn({ name: "oldvalue", join: "systemNotes", label: "Old Value" }),
                      search.createColumn({ name: "date", join: "systemNotes", label: "Date" })
                  ]
          });
          let ResStatus = '';
          vmSearchObj.run().each(function(result){
              ResStatus = result.getValue({name:'oldvalue',join: "systemNotes"});
              return false;
          });
          return ResStatus;
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
	  var formobj = context.form;
	    
	   formobj.addButton({
                    id: 'custpage_addvin',
                    label: 'Select VIN',
                    functionName : 'openvinselectpopup()'
                });
				
    }
  
    /**
     * context.newRecord
     * context.oldRecord
     * context.type
     *
     * @type {import('N/types').EntryPoints.UserEvent.beforeSubmit}
     */
    function beforeSubmit(context) {
        if (context.type === context.UserEventType.CREATE) {
            let RecObj = context.newRecord;
            let DepositVin = RecObj.getValue({fieldId : 'custbody_advs_vin_create_deposit'});
            if(DepositVin){
                RecObj.setValue({fieldId: 'custbody_advs_st_vin_invoice',value: DepositVin});
            }
        }
    }
  
    return {
      'afterSubmit':  afterSubmit,
      'beforeLoad':   beforeLoad,
      'beforeSubmit': beforeSubmit
    };
  
  });
  
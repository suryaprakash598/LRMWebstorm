/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url','N/https'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (record, runtime, search, serverWidget, url,https) => {
    /**
     * Defines the Suitelet script trigger point.
     * @param {Object} scriptContext
     * @param {ServerRequest} scriptContext.request - Incoming request
     * @param {ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    const onRequest = (scriptContext) => {

        var request = scriptContext.request;
        var response = scriptContext.response;

        if (request.method == "GET") {
            var form = serverWidget.createForm({ title: "Delivery Board", hideNavBar: true });
            
            var DeliveryBoardId = request.parameters.custparam_id;
            var Object;
            if (DeliveryBoardId) {
                Object = DeliveryData(DeliveryBoardId);
            }
            
            var RecID = form.addField({ id: "custpage_recid", type: serverWidget.FieldType.TEXT, label: "Delivery Board Log"  });
                RecID.defaultValue=DeliveryBoardId;
                RecID.updateDisplayType({ displayType : serverWidget.FieldDisplayType.HIDDEN });
            
            
            var LocationFld = form.addField({ id: "custpage_location_fld",  type: serverWidget.FieldType.SELECT, label: "Location", source: "location"  });
            if(Object[0].dellocation != null && Object[0].dellocation != undefined){
                LocationFld.defaultValue = Object[0].dellocation;
            }
            LocationFld.updateDisplayType({ displayType : serverWidget.FieldDisplayType.INLINE });
             
            var CustomerFld = form.addField({ id: "custpage_customer_fld", type: serverWidget.FieldType.SELECT,  label: "Customer", source: "customer"  });
            if(Object[0].deldepname != null && Object[0].deldepname != undefined){
                CustomerFld.defaultValue=Object[0].deldepname;
            }
            CustomerFld.updateDisplayType({ displayType : serverWidget.FieldDisplayType.INLINE });
            
            var salesrepFld = form.addField({ id: "custpage_sales_rep_fld", type: serverWidget.FieldType.SELECT, label: "Sales Rep", source: "employee" });
            if(Object[0].delsalesrep != null && Object[0].delsalesrep != undefined){
                salesrepFld.defaultValue=Object[0].delsalesrep;
            }
            salesrepFld.updateDisplayType({ displayType : serverWidget.FieldDisplayType.INLINE });
            

            var EtaFld = form.addField({ id: "custpage_eta_fld", type: serverWidget.FieldType.DATE, label: "ETA"  });
            if(Object[0].deleta != null && Object[0].deleta != undefined){
                EtaFld.defaultValue=Object[0].deleta;
            }
                
         	var dateFldObj = form.addField({ id: "custpage_date_to_close_deal", type: serverWidget.FieldType.TEXT, label: "Days To Close Deal"  });
            if(Object[0].delcloasedeal != null && Object[0].delcloasedeal != undefined){
                dateFldObj.defaultValue=Object[0].delcloasedeal;
            }
                        
			var Insurancefld = form.addField({ id: "custpage_insurance_application", type: serverWidget.FieldType.CHECKBOX, label: "Insurance Application" });
            if(Object[0].delinsuranceapplication != null || Object[0].delinsuranceapplication != undefined || Object[0].delinsuranceapplication != ""){
                if(Object[0].delinsuranceapplication == true || Object[0].delinsuranceapplication == "true"){
                    Insurancefld.defaultValue = "T"
                }
                // Insurancefld.defaultValue=Object[0].delinsuranceapplication;
            }

            var ClearedDelFld = form.addField({ id: "custpage_cleared_delivery", type: serverWidget.FieldType.CHECKBOX, label: "Cleared For Delivery" });
            if(Object[0].delclear != null || Object[0].ddelclear != undefined || Object[0].delinsuranceapplication != ""){
                if(Object[0].delclear == true || Object[0].delclear == "true"){
                    ClearedDelFld.defaultValue = "T"
                }
                // ClearedDelFld.defaultValue=Object[0].delclear;
            }

		    var VinFlObj = form.addField({ id: "custpage_vin", type: serverWidget.FieldType.SELECT,  label: "Vin", source: "customrecord_advs_vm" });
            if(Object[0].delVin != null || Object[0].delVin != undefined || Object[0].delinsuranceapplication != ""){
                VinFlObj.defaultValue=Object[0].delVin;
            }
            VinFlObj.updateDisplayType({ displayType : serverWidget.FieldDisplayType.INLINE });

             
			var truckReadyFldObj = form.addField({ id: "custpage_truck_ready", type: serverWidget.FieldType.CHECKBOX, label: "Truck Ready" });
           
            if(Object[0].delTruckready != null || Object[0].delTruckready != undefined || Object[0].delinsuranceapplication != ""){
             if(Object[0].delTruckready == true || Object[0].delTruckready == "true"){
                truckReadyFldObj.defaultValue = "T";
             }
            }

			var washFldObj = form.addField({ id: "custpage_washed_fld", type: serverWidget.FieldType.CHECKBOX, label: "Washed"  });
            if(Object[0].deliveryWash != null || Object[0].deliveryWash != undefined || Object[0].deliveryWash != ""){
                log.debug("Object[0].deliveryWash_163", Object[0].deliveryWash);
                if(Object[0].deliveryWash == true || Object[0].deliveryWash == "true"){
                    washFldObj.defaultValue = "T";
                }
            }

            var salequoteFldObj = form.addField({ id: "custpage_sales_quote", type: serverWidget.FieldType.CHECKBOX, label: "Sales Quote" });
            if(Object[0].deliverysalesquote != null || Object[0].deliverysalesquote != undefined || Object[0].deliverysalesquote != ""){
                log.debug("Object[0].deliverysalesquote_176", Object[0].deliverysalesquote);
                if(Object[0].deliverysalesquote == true || Object[0].deliverysalesquote == "true"){
                    salequoteFldObj.defaultValue = "T";
                }
            }
            var TotalIncp = '';
            if(Object[0].deliverydepositiInc != null || Object[0].deliverydepositiInc != undefined || Object[0].deliverydepositiInc != ""){
               var DeliveryInc = Object[0].deliverydepositiInc *1;
            }
            if(Object[0].deliverypaymentInc != null || Object[0].deliverypaymentInc != undefined || Object[0].deliverypaymentInc != ""){
                var PaymentInc = Object[0].deliverypaymentInc *1;
             }
             TotalIncp = DeliveryInc +  PaymentInc;
            if(DeliveryBoardId)
			{
				TotalIncp = Object[0].delivetotalInception;
			}

            var TotalLeaseFldObj = form.addField({ id: "custpage_total_inception",  type: serverWidget.FieldType.CURRENCY,  label: "Total lease Inception"  });
            if(TotalIncp){
                TotalLeaseFldObj.defaultValue=TotalIncp;  
            }

		    var DepositFldObj = form.addField({ id: "custpage_deposit",type: serverWidget.FieldType.CURRENCY, label: "Deposit"  });
            var depositvalue = '';
            if(Object[0].delivedeposit != null || Object[0].delivedeposit != undefined || Object[0].delivedeposit != ""){
                DepositFldObj.defaultValue=Object[0].delivedeposit;
                depositvalue = Object[0].delivedeposit;
            }
            DepositFldObj.updateDisplayType({ displayType : serverWidget.FieldDisplayType.INLINE });
            
            var balancevalue = DeliveryInc - depositvalue;
            log.debug("balancevalue", balancevalue)
            
		    var puPaymentFldObj = form.addField({ id: "custpage_pu_payment", type: serverWidget.FieldType.CURRENCY, label: "P/U Payment"  });
            if(Object[0].deliveryPayment != null || Object[0].deliveryPayment != undefined || Object[0].deliveryPayment != ""){
                puPaymentFldObj.defaultValue=Object[0].deliveryPayment;
            }
            
		    var balanceFldObj = form.addField({ id: "custpage_title_balance", type: serverWidget.FieldType.CURRENCY, label: "BALANCE" });
//            balanceFldObj.defaultValue = balancevalue;
             if(Object[0].depositPayment != null || Object[0].depositPayment != undefined || Object[0].depositPayment != ""){
                 balanceFldObj.defaultValue=Object[0].depositPayment;
             }
            
            var mcooFldObj = form.addField({
                id: "custpage_mcoo_fld",
                type: serverWidget.FieldType.SELECT,
                label: "MC/OO",
                source: "customlist_advs_delivery_board_mcoo"
            });
            if(Object[0].deliveymcoo != null || Object[0].deliveymcoo != undefined || Object[0].deliveymcoo != ""){
                mcooFldObj.defaultValue=Object[0].deliveymcoo;
            }
        
            var contractFldObj = form.addField({
                id: "custpage_sales_contract",
                type: serverWidget.FieldType.SELECT,
                label: "Contract",
                source: "customlist_advs_ss_deli_contract_field"
            });
            
            // contractFldObj.addSelectOption({ value: "", text: "" });
            // contractFldObj.addSelectOption({ value: "1", text: "Signed" });
            // contractFldObj.addSelectOption({ value: "2", text: "Prep" });

            if(Object[0].deliverydepcontract != null || Object[0].deliverydepcontract != undefined || Object[0].deliverydepcontract != ""){
                contractFldObj.defaultValue=Object[0].deliverydepcontract;
            }

            var NOtesFldObj = form.addField({ id: "custpage_sales_notes", type: serverWidget.FieldType.TEXTAREA, label: "Notes"  });
            
            if(Object[0].deliveryNotes != null || Object[0].deliveryNotes != undefined || Object[0].deliveryNotes != ""){
                NOtesFldObj.defaultValue=Object[0].deliveryNotes;
            }
            
            // var exceptionFldObj = form.addField({ id: "custpage_sales_exceptions", type: serverWidget.FieldType.TEXT, label: "Exceptions"  });
            // if(Object[0].deliveryExceptions != null || Object[0].deliveryExceptions != undefined || Object[0].deliveryExceptions != ""){
            //     exceptionFldObj.defaultValue=Object[0].deliveryExceptions;
            // }
     	       var deplinkFldObj = form.addField({
                id: "custpage_deposit_link",
                type: serverWidget.FieldType.SELECT,
                label: "Transaction Link",
                source: "transaction"
            });
            if(Object[0].deliverylink != null || Object[0].deliverylink != undefined || Object[0].deliverylink != ""){
                deplinkFldObj.defaultValue=Object[0].deliverylink;
            }

            deplinkFldObj.updateDisplayType({displayType : serverWidget.FieldDisplayType.INLINE});

            form.addSubmitButton('Update'); 
            form.clientScriptModulePath = './advs_cs_delivery_board.js';
            response.writePage(form);
          
        }else{
            
			var RecordID = scriptContext.request.parameters.custpage_recid;
			var LocationID = scriptContext.request.parameters.custpage_location_fld;
			var CustomerID = scriptContext.request.parameters.custpage_customer_fld;
			var SalesrePID = scriptContext.request.parameters.custpage_sales_rep_fld;
			var ETA = scriptContext.request.parameters.custpage_eta_fld;
			var CloseDeal = scriptContext.request.parameters.custpage_date_to_close_deal;
			var InsuranceApp = scriptContext.request.parameters.custpage_insurance_application;
            // log.debug("InsuranceApp315", InsuranceApp)
			var ClearDelivery = scriptContext.request.parameters.custpage_cleared_delivery;
			var VinID = scriptContext.request.parameters.custpage_vin;
			var TruckRerady = scriptContext.request.parameters.custpage_truck_ready;
            
			var TruckWash = scriptContext.request.parameters.custpage_washed_fld;
			var TotalInception = scriptContext.request.parameters.custpage_total_inception;
			var dposit = scriptContext.request.parameters.custpage_deposit;
            var Payment = scriptContext.request.parameters.custpage_pu_payment;
            var TitleBalance = scriptContext.request.parameters.custpage_title_balance;
            var McooFld = scriptContext.request.parameters.custpage_mcoo_fld;
            var SalesQuote = scriptContext.request.parameters.custpage_sales_quote;
            var salesContract = scriptContext.request.parameters.custpage_sales_contract;
            var salesNotes = scriptContext.request.parameters.custpage_sales_notes;
            var salesException = scriptContext.request.parameters.custpage_sales_exceptions;
            var salesDpolink = scriptContext.request.parameters.custpage_deposit_link;
            // log.debug("TruckRerady", TruckRerady+ "==>" +TruckWash+ "==>"+SalesQuote)
            // log.debug("salesContract",salesContract)
            if(InsuranceApp == "T"){
                InsuranceApp = true;
            }else{
                InsuranceApp = false;
            }
            if(TruckRerady == "T"){
                TruckRerady = true;
            }else{
                TruckRerady = false;
            }
            if(TruckWash == "T"){
                TruckWash = true;
            }else{
                TruckWash = false;
            }
            if(SalesQuote == "T"){
                SalesQuote = true;
            }else{
                SalesQuote = false;
            }
         
            // if(VinID) {
            //     var fields = ['custrecord_advs_vm_lea_hea'];
            //     var SearchObj = search.lookupFields({ type: 'customrecord_advs_vm', id:VinID , columns: fields });

            //     var leaseLink;
            //     if (SearchObj['custrecord_advs_vm_lea_hea'] && Array.isArray(SearchObj['custrecord_advs_vm_lea_hea']) && SearchObj['custrecord_advs_vm_lea_hea'].length > 0) {
            //         var leaseLink = SearchObj['custrecord_advs_vm_lea_hea'][0].value;
            //     }
            //     var SubmitId;
            //     if(McooFld=="1"){
            //       SubmitId= "1"
            //     }
            //     if(McooFld=="2"){
            //       SubmitId="2"   
            //     }

            //  if(leaseLink){
            //     record.submitFields({ type:'customrecord_advs_lease_header', id:leaseLink , values:{ 'custrecord_advs_liability_type_f': SubmitId }, });
            //  }
            // }

            var objj={
                "custrecord_advs_in_dep_location": LocationID,
                "custrecord_advs_in_dep_name": CustomerID,
                "custrecord_advs_in_dep_sales_rep": SalesrePID,
                "custrecord_advs_in_dep_eta": ETA,
                "custrecord_advs_in_dep_days_close_deal": CloseDeal,
                "custrecord_advs_in_dep_insur_application": InsuranceApp,
                "custrecord_advs_in_dep_clear_delivery": ClearDelivery,
                "custrecord_advs_in_dep_vin": VinID,
                "custrecord_advs_in_dep_truck_ready": TruckRerady,
                "custrecord_advs_in_dep_washed": TruckWash,
                "custrecord_advs_in_dep_tot_lease_incepti": TotalInception,
                "custrecord_advs_in_dep_deposit": dposit,
                "custrecord_advs_in_dep_pu_payment": Payment,
                "custrecord_advs_in_dep_balance": TitleBalance,
                "custrecord_advs_in_dep_mc_oo": McooFld,
                "custrecord_advs_in_dep_sales_quote": SalesQuote, 
                "custrecord_advs_in_dep_contract": salesContract,
                "custrecord_advs_in_dep_notes": salesNotes,
                "custrecord_advs_in_dep_exceptions": salesException,
                "custrecord_advs_in_dep_trans_link": salesDpolink
	
				};
				// log.debug('objj',objj);
			// try{
				var recid = record.submitFields({type:'customrecord_advs_vm_inv_dep_del_board',
                                                id:RecordID, values:objj,
						                        options:{
                                                    enableSourcing:false,
                                                    ignoreMandatoryFields:true}
                                                });
                //   log.debug("recid_373", recid);
             var fieldToUpdate = {};
            fieldToUpdate['custrecord_advs_tm_truck_ready'] = TruckRerady;
            fieldToUpdate['custrecord_advs_tm_washed'] = TruckWash;
            fieldToUpdate['custrecord_advs_vm_sales_quote_from_inv'] = SalesQuote;
            record.submitFields({ type: 'customrecord_advs_vm', id: VinID, values: fieldToUpdate, });
			// }catch(e)
			// {
			// 	log.debug('error',e.toString());
			// }
		
			var onclickScript=" <html><body> <script type='text/javascript'>" +
			"try{debugger;" ; 
			//onclickScript+="window.parent.getActive();";			
			onclickScript+="window.opener.location.reload();";	
			//onclickScript+="window.parent.closePopup();";		
			onclickScript+="window.close();;";
			onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";
			scriptContext.response.write(onclickScript);
			
		}
    }

    function DeliveryData(DelId) {
        var customrecord_lms_ofr_SearchObj = search.create({
            type: "customrecord_advs_vm_inv_dep_del_board",
            filters:
            [
                ["internalid", "anyof", DelId]
            ],
            columns:
            [
                "custrecord_advs_in_dep_location",
                "custrecord_advs_in_dep_name",
                "custrecord_advs_in_dep_sales_rep",
                "custrecord_advs_in_dep_eta",
                "custrecord_advs_in_dep_days_close_deal",
                "custrecord_advs_in_dep_insur_application",
                "custrecord_advs_in_dep_clear_delivery",
                "custrecord_advs_in_dep_vin",
                /* "custrecord_advs_in_dep_truck_ready",
                "custrecord_advs_in_dep_washed", */
                search.createColumn({name: 'custrecord_advs_tm_truck_ready', join: 'custrecord_advs_in_dep_vin', label: 'Truck Ready'}),
                search.createColumn({name: 'custrecord_advs_tm_washed', join: 'custrecord_advs_in_dep_vin', label: 'Washed'}),
                "custrecord_advs_in_dep_tot_lease_incepti" ,
                "custrecord_advs_in_dep_deposit",
                "custrecord_advs_in_dep_pu_payment",
                "custrecord_advs_in_dep_balance",
                "custrecord_advs_in_dep_mc_oo",
                /* "custrecord_advs_in_dep_sales_quote", */ 
                search.createColumn({name: 'custrecord_advs_vm_sales_quote_from_inv', join: 'custrecord_advs_in_dep_vin', label: 'Sales Quote Inventory'}),
                "custrecord_advs_in_dep_contract",
                "custrecord_advs_in_dep_notes",
                "custrecord_advs_in_dep_exceptions",
                "custrecord_advs_in_dep_trans_link",
                "custrecord_advs_in_dep_inception",
                "custrecord_advs_in_payment_inception"
            ]
        });
        var searchResultCount = customrecord_lms_ofr_SearchObj.runPaged().count;
        var arr = [];
        customrecord_lms_ofr_SearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            var obj = {};
            obj.dellocation = result.getValue({ name: 'custrecord_advs_in_dep_location' });
			obj.deldepname = result.getValue({ name: 'custrecord_advs_in_dep_name'  });
             
			obj.delsalesrep = result.getValue({ name: 'custrecord_advs_in_dep_sales_rep' });
            obj.deleta = result.getValue({ name: 'custrecord_advs_in_dep_eta' });
            obj.delcloasedeal = result.getValue({ name: 'custrecord_advs_in_dep_days_close_deal' });
            
            obj.delinsuranceapplication = result.getValue({name: 'custrecord_advs_in_dep_insur_application' });
            log.debug("obj.delinsuranceapplication", obj.delinsuranceapplication)
			obj.delclear = result.getValue({ name: 'custrecord_advs_in_dep_clear_delivery' });
            obj.delVin = result.getValue({ name: 'custrecord_advs_in_dep_vin' });
         /* obj.delTruckready = result.getValue({ name: 'custrecord_advs_in_dep_truck_ready' });
            obj.deliveryWash = result.getValue({ name: 'custrecord_advs_in_dep_washed' }); */
            obj.delTruckready = result.getValue({ name: 'custrecord_advs_tm_truck_ready', join: 'custrecord_advs_in_dep_vin' }) || ''; 
            obj.deliveryWash = result.getValue({ name: 'custrecord_advs_tm_washed', join: 'custrecord_advs_in_dep_vin' }) || '';
            obj.delivetotalInception = result.getValue({ name: 'custrecord_advs_in_dep_tot_lease_incepti' });
            obj.delivedeposit = result.getValue({ name: 'custrecord_advs_in_dep_deposit' });
            
            obj.deliveryPayment = result.getValue({ name: 'custrecord_advs_in_dep_pu_payment' });
            obj.depositPayment = result.getValue({ name: 'custrecord_advs_in_dep_balance' });
            obj.deliveymcoo = result.getValue({ name: 'custrecord_advs_in_dep_mc_oo' });
            /* obj.deliverysalesquote = result.getValue({ name: 'custrecord_advs_in_dep_sales_quote' }); */
            obj.deliverysalesquote = result.getValue({ name: 'custrecord_advs_vm_sales_quote_from_inv', join: 'custrecord_advs_in_dep_vin' }); 
            obj.deliverydepcontract = result.getValue({ name: 'custrecord_advs_in_dep_contract' });
            obj.deliveryNotes = result.getValue({ name: 'custrecord_advs_in_dep_notes' });
            obj.deliveryExceptions = result.getValue({ name: 'custrecord_advs_in_dep_exceptions' });
            obj.deliverylink = result.getValue({ name: 'custrecord_advs_in_dep_trans_link' });
            obj.deliverydepositiInc = result.getValue({name: 'custrecord_advs_in_dep_inception'});
            obj.deliverypaymentInc = result.getValue({name: 'custrecord_advs_in_payment_inception'});
			 
            arr.push(obj);
            return true;
        });

        return arr;
    }

    return {
        onRequest
    }

});
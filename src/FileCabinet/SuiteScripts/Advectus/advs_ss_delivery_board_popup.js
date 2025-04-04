/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url','N/https','N/format'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (record, runtime, search, serverWidget, url,https,format) => {
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
                        
			var Insurancefld = form.addField({ id: "custpage_insurance_application", type: serverWidget.FieldType.CHECKBOX, label: "Insurance Application Received" });
            if(Object[0].delinsuranceapplication != null || Object[0].delinsuranceapplication != undefined || Object[0].delinsuranceapplication != ""){
                if(Object[0].delinsuranceapplication == true || Object[0].delinsuranceapplication == "true"){
                    Insurancefld.defaultValue = "T"
                }
                // Insurancefld.defaultValue=Object[0].delinsuranceapplication;
            }

            var ClearedDelFld = form.addField({ id: "custpage_cleared_delivery", type: serverWidget.FieldType.SELECT, label: "Approved For Delivery",source:'customlist_advs_app_del' });
            if(Object[0].delclear != null || Object[0].ddelclear != undefined || Object[0].ddelclear != ""){
                    ClearedDelFld.defaultValue = Object[0].delclear;
            }

		    var VinFlObj = form.addField({ id: "custpage_vin", type: serverWidget.FieldType.SELECT,  label: "Vin", source: "customrecord_advs_vm" });
            if(Object[0].delVin != null || Object[0].delVin != undefined || Object[0].delVin != ""){
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
            //NEW FIELDS
            var gpsx2FldObj = form.addField({
                id: "custpage_gpsx2",
                type: serverWidget.FieldType.SELECT,
                label: "GPS X2",
                source:'customlist_advs_gps_x2'

            });
            if(Object[0].deliverygps != null || Object[0].deliverygps != undefined || Object[0].deliverygps != ""){
                gpsx2FldObj.defaultValue=Object[0].deliverygps;
            }

            var newLesseeFld = form.addField({ id: "custpage_new_lessee", type: serverWidget.FieldType.CHECKBOX, label: "New Lessee" });
             if(Object[0].deliverynewlessee != null || Object[0].deliverynewlessee != undefined || Object[0].deliverynewlessee != ""){
                if(Object[0].deliverynewlessee == true || Object[0].deliverynewlessee == "true"){
                    newLesseeFld.defaultValue = "T"
                }
                // ClearedDelFld.defaultValue=Object[0].delclear;
             }
            var registrationStateFldObj = form.addField({
                id: "custpage_regestration_state",
                type: serverWidget.FieldType.SELECT,
                label: "Registration State",
                source: "state"
            });
            if(Object[0].deliveryregstate != null || Object[0].deliveryregstate != undefined || Object[0].deliveryregstate != ""){
                registrationStateFldObj.defaultValue=Object[0].deliveryregstate;
            }
            var driverLicenseStateFldObj = form.addField({
                id: "custpage_driver_license_state",
                type: serverWidget.FieldType.SELECT,
                label: "State of Driver's License",
                source: "state"
            });
            if(Object[0].deliverydriverlicensestate != null || Object[0].deliverydriverlicensestate != undefined || Object[0].deliverydriverlicensestate != ""){
                driverLicenseStateFldObj.defaultValue=Object[0].deliverydriverlicensestate;
            }
            var ppTaxAmountFldObj = form.addField({
                id: "custpage_pp_tax_amount",
                type: serverWidget.FieldType.TEXT,
                label: "Personal Property Tax Amount"
            });
            if(Object[0].deliverypptax != null || Object[0].deliverypptax != undefined || Object[0].deliverypptax != ""){
                ppTaxAmountFldObj.defaultValue=Object[0].deliverypptax;
            }
            var titleFeeAmountFldObj = form.addField({
                id: "custpage_title_fee_amount",
                type: serverWidget.FieldType.TEXT,
                label: "Title Fee Amount"
            });
            if(Object[0].deliverytitlefee != null || Object[0].deliverytitlefee != undefined || Object[0].deliverytitlefee != ""){
                titleFeeAmountFldObj.defaultValue=Object[0].deliverytitlefee;
            }

            var SublistObj = populateNotesSublist(form);
            if (DeliveryBoardId) {
                populateNotesData(SublistObj,DeliveryBoardId);
            }
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

            var gpsx2 = scriptContext.request.parameters.custpage_gpsx2;
            var new_lessee = scriptContext.request.parameters.custpage_new_lessee;
            var regestration_state = scriptContext.request.parameters.custpage_regestration_state;
            var driver_license_state = scriptContext.request.parameters.custpage_driver_license_state;
            var pp_tax_amount = scriptContext.request.parameters.custpage_pp_tax_amount;
            var title_fee_amount = scriptContext.request.parameters.custpage_title_fee_amount;
            log.debug('gpsx2',gpsx2);
            log.debug('new_lessee',new_lessee);
           // if(gpsx2 == "T"){gpsx2 = true;}else{gpsx2 = false;}
            if(new_lessee == "T"){new_lessee = true;}else{new_lessee = false;}
            log.debug('gpsx2nex',gpsx2);
            log.debug('new_lesseenex',new_lessee);


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

            var objj={
                "custrecord_advs_in_dep_location": LocationID,
                "custrecord_advs_in_dep_name": CustomerID,
                "custrecord_advs_in_dep_sales_rep": SalesrePID,
                "custrecord_advs_in_dep_eta": ETA,
                "custrecord_advs_in_dep_days_close_deal": CloseDeal,
                "custrecord_advs_in_dep_insur_application": InsuranceApp,
                // "custrecord_advs_in_dep_clear_delivery": ClearDelivery,
                "custrecord_advs_approved_for_del_db": ClearDelivery,
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
                "custrecord_advs_in_dep_trans_link": salesDpolink,
                "custrecord_advs_reg_state":regestration_state,
                "custrecord_advs_personal_prop_tax":pp_tax_amount,
                "custrecord_advs_sate_of_dv_licen":driver_license_state,
                "custrecord_advs_in_dep_title_fee":title_fee_amount,
                "custrecord_advs_gps_x2_db":gpsx2,
                "custrecord_new_lessee":new_lessee

	
				};

				var recid = record.submitFields({type:'customrecord_advs_vm_inv_dep_del_board',
                                                id:RecordID, values:objj,
						                        options:{
                                                    enableSourcing:false,
                                                    ignoreMandatoryFields:true}
                                                });

             var fieldToUpdate = {};
            fieldToUpdate['custrecord_advs_tm_truck_ready'] = TruckRerady;
            fieldToUpdate['custrecord_advs_tm_washed'] = TruckWash;
            fieldToUpdate['custrecord_advs_vm_sales_quote_from_inv'] = SalesQuote;
            record.submitFields({ type: 'customrecord_advs_vm', id: VinID, values: fieldToUpdate, });

            var rec = record.load({
                type: 'customrecord_advs_vm_inv_dep_del_board',
                id: RecordID,
                isDynamic:true
            });
            var SublistId_suite = 'custpage_notes_sublist';
            var LineCount = scriptContext.request.getLineCount({
                group: SublistId_suite
            });
            var childRec = 'recmachcustrecord_advs_db_note_parent_link';

            var childLineCount = rec.getLineCount('recmachcustrecord_advs_db_note_parent_link') * 1;
            log.debug(' childLineCount =>', childLineCount);
            log.debug(' LineCount =>', LineCount);
            if (childLineCount > 0) {
                /* for (var j = childLineCount - 1; j >= 0; j--) {
                   rec.removeLine({
                     sublistId: childRec,
                     line: j
                   });
                 }*/
            }
            if (LineCount > 0) {
                for (var k = LineCount-1; k < LineCount; k++) {
                    var DateTime = scriptContext.request.getSublistValue({
                        group: SublistId_suite,
                        name: 'custsublist_date',
                        line: k
                    });
                    var Notes = scriptContext.request.getSublistValue({
                        group: SublistId_suite,
                        name: 'custsublist_notes',
                        line: k
                    });
                    log.debug(" DateTime => " + DateTime, " Notes =>" + Notes);
                    if (DateTime && Notes) {
                        rec.selectNewLine({
                            sublistId: childRec
                        });
                        rec.setCurrentSublistValue({
                            sublistId: childRec,
                            fieldId: 'custrecord_advs_db_note_date_time',
                            value: DateTime
                        });
                        rec.setCurrentSublistValue({
                            sublistId: childRec,
                            fieldId: 'custrecord_advs_db_note_notes',
                            value: Notes
                        });
                        rec.commitLine({
                            sublistId: childRec
                        });
                    }
                }
            }
            rec.save();
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
                "custrecord_advs_in_payment_inception",
                "custrecord_advs_reg_state",
                "custrecord_advs_personal_prop_tax",
                "custrecord_advs_sate_of_dv_licen",
                "custrecord_advs_in_dep_title_fee",
                "custrecord_advs_gps_x2_db",
                "custrecord_new_lessee"
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
            obj.deliveryregstate = result.getValue({name: 'custrecord_advs_reg_state'});
            obj.deliverypptax = result.getValue({name: 'custrecord_advs_personal_prop_tax'});
            obj.deliverydriverlicensestate = result.getValue({name: 'custrecord_advs_sate_of_dv_licen'});
            obj.deliverytitlefee = result.getValue({name: 'custrecord_advs_in_dep_title_fee'});
            obj.deliverygps = result.getValue({name: 'custrecord_advs_gps_x2_db'});
            obj.deliverynewlessee = result.getValue({name: 'custrecord_new_lessee'});

            arr.push(obj);
            return true;
        });

        return arr;
    }
    function populateNotesSublist(form) {
            var SublistObj = form.addSublist({
                id: 'custpage_notes_sublist',
                type: serverWidget.SublistType.LIST,
                label: 'User Notes'
            });
            SublistObj.addField({
                id: 'custsublist_date',
                type: serverWidget.FieldType.TEXT,
                label: 'Date & Time'
            });
            SublistObj.addField({
                id: 'custsublist_notes',
                type: serverWidget.FieldType.TEXTAREA,
                label: 'Notes'
            }).updateDisplayType({
                displayType: "entry"
            });
            SublistObj.addField({
                id: 'custsublist_record_id',
                type: serverWidget.FieldType.SELECT,
                source: 'customrecord_advs_transport_notes',
                label: 'RECORD Id'
            }).updateDisplayType({
                displayType: "hidden"
            });
            return SublistObj;
        }
    function populateNotesData(SublistObj, dbId) {
            var Line = 0;
            var CurDate = new Date();
            var hours = CurDate.getHours(); // 0-23
            var minutes = CurDate.getMinutes(); // 0-59
            var seconds = CurDate.getSeconds(); // 0-59
            var timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            var DateValue = format.format({
                value: CurDate,
                type: format.Type.DATE
            })
            var dateTimeValue = DateValue + ' ' + timeString;
            if (dbId) {
                var SearchObj = search.create({
                    type: 'customrecord_delivery_board_notes',
                    filters: [
                        ['isinactive', 'is', 'F'],
                        'AND',
                        ['custrecord_advs_db_note_parent_link', 'anyof', dbId]
                    ],
                    columns: [
                        'custrecord_advs_db_note_date_time',
                        'custrecord_advs_db_note_notes'
                    ]
                });
                SearchObj.run().each(function (result) {
                    SublistObj.setSublistValue({
                        id: "custsublist_date",
                        line: Line,
                        value: result.getValue('custrecord_advs_db_note_date_time') || ' '
                    });
                    SublistObj.setSublistValue({
                        id: "custsublist_notes",
                        line: Line,
                        value: result.getValue('custrecord_advs_db_note_notes') || ' '
                    });
                    SublistObj.setSublistValue({
                        id: "custsublist_record_id",
                        line: Line,
                        value: result.id
                    });

                    Line++;
                    return true;
                });
            }

            SublistObj.setSublistValue({
                id: "custsublist_date",
                line: Line,
                value: dateTimeValue
            });
        }
    return {
        onRequest
    }

});
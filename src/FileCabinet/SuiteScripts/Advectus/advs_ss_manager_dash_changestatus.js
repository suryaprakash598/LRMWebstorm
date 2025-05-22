/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/record', 'N/search','N/ui/serverWidget'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    (log, record, search,serverWidget) => {
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
            var vin = request.parameters.vinid;

            if (request.method == "GET") { 
                // var loadvinRec = record.load({ type: 'customrecord_advs_vm', id: vin, isDynamic: true  }); 
                // var status = loadvinRec.getValue({ fieldId: 'custrecord_advs_vm_reservation_status' });

                var vinRecLookUp = search.lookupFields({ type:'customrecord_advs_vm', id: vin, columns: ['custrecord_advs_vm_reservation_status','custrecord_advs_tm_washed'] });
                var status = vinRecLookUp.custrecord_advs_vm_reservation_status[0].value; 
                var washed = vinRecLookUp.custrecord_advs_tm_washed; 

                log.error("status and washed => ",status+washed); 

                var form = serverWidget.createForm({ title: "Change Status", hideNavBar: true, hideURL: true }); 
                var vinFldObj = form.addField({
                    id: "custpage_vin",
                    type: serverWidget.FieldType.TEXT,
                    label: "Vin",
                }).updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN}); 
                if (vin) {
                    vinFldObj.defaultValue = vin;
                }

                var CurrentstatusFldObj = form.addField({
                    id: "custpage_currstatus",
                    type: serverWidget.FieldType.SELECT,
                    label: "Current Status",
                    source: "customlist_advs_reservation_status"
                }).updateDisplayType({ displayType: serverWidget.FieldDisplayType.INLINE}); 
                
                if (status) {
                    CurrentstatusFldObj.defaultValue = status;
                }
                CurrentstatusFldObj.updateDisplaySize({ height: 1, width: 58 }); 
                var statusFldObj = form.addField({ id: "custpage_changestatus", type: serverWidget.FieldType.SELECT, label: "Select Status", source: "customlist_advs_reservation_status" });
                 statusFldObj.updateBreakType({breakType: serverWidget.FieldBreakType.STARTCOL});
                 statusFldObj.updateDisplaySize({ height: 1, width: 135 }); 
                var washedFldObj = form.addField({ id: "custpage_is_washed", type: serverWidget.FieldType.CHECKBOX, label: "Washed"}); 
                 washedFldObj.updateDisplaySize({ height: 1, width: 30 }); // Adjust checkbox size
                if(washed == "true" || washed == true || washed == "T"){
                    washedFldObj.defaultValue = "T";
                }

                form.addSubmitButton({ label: 'Submit', });
                response.writePage(form);
            }else{
               
                var changedstatus = request.parameters.custpage_changestatus;
                var vinId = request.parameters.custpage_vin;
                var iswashed = request.parameters.custpage_is_washed;

               /*  record.submitFields({
                    type: "customrecord_advs_vm",
                    id: vinId,
                    values: {
                        'custrecord_advs_vm_reservation_status': changedstatus,
                    }
                }); */
                var fieldToUpdate = {};
                fieldToUpdate['custrecord_advs_vm_reservation_status'] = changedstatus;
                var currentdate = new Date()
                if(changedstatus == 19 || changedstatus == "19"){
                  fieldToUpdate['custrecord_advs_tm_truck_ready'] = true;
                  fieldToUpdate['custrecord_advs_vm_date_truck_ready'] = currentdate;
                }

                if(changedstatus == 28 || changedstatus == "28"){
                    fieldToUpdate['custrecord_advs_vm_date_on_site'] = currentdate;
                }
                if(iswashed == "T" || iswashed == true || iswashed == "true"){
                  fieldToUpdate['custrecord_advs_tm_washed'] = true;
                }
                record.submitFields({ type: 'customrecord_advs_vm', id: vinId, values: fieldToUpdate, });

            }

            var onclickScript=" <html><body> <script type='text/javascript'>" +
                "try{" ;	
    
               // onclickScript+="window.parent.location.reload();" ;
               onclickScript+="window.opener.location.reload();";	
                onclickScript+="window.close();";
                onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";

            response.write(onclickScript);
            
        }

        return {onRequest}

    });

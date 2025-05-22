/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/runtime', 'N/url', 'N/redirect'],
    function(serverWidget, record, runtime, url, redirect) {

        function onRequest(context) {
            if (context.request.method === 'GET') {
                let form = serverWidget.createForm({
                    title: 'Change Reservation Status'
                });
                var _vinid = context.request.parameters.vinid;
                var _from = context.request.parameters.from;
				if(_from==1){
					// Create a select field
					let selectField = form.addField({
						id: 'custpage_select_field',
						type: serverWidget.FieldType.SELECT,
						label: 'Reservation Status',
						source: 'customlist_advs_reservation_hold' // Change this to your List/Record
					});
				}
				else if(_from==2){
					// Create a select field
					let selectField = form.addField({
						id: 'custpage_select_field',
						type: serverWidget.FieldType.SELECT,
						label: 'Truck Status',
						source: 'customlist_advs_truck_master_status' // Change this to your List/Record
					});
				}
                

                // Hidden field for record ID (if updating an existing record)
                let recordIdField = form.addField({
                    id: 'custpage_record_id',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Record ID'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                recordIdField.defaultValue = _vinid;

				let fromIdField = form.addField({
                    id: 'custpage_from_id',
                    type: serverWidget.FieldType.TEXT,
                    label: 'From ID'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                fromIdField.defaultValue = _from;
                form.addSubmitButton({
                    label: 'Submit'
                });

                context.response.writePage(form);
            } else {
                let request = context.request;
                let selectedValue = request.parameters.custpage_select_field;
                let vinid = request.parameters.custpage_record_id;
                let from = request.parameters.custpage_from_id;

                try {
					if(from==1){
						// Create or update the custom record
					   record.submitFields({type:'customrecord_advs_vm',id:vinid, values: {
							custrecord_reservation_hold: selectedValue
						}});
					}
					else if(from==2)
					{
						// Create or update the custom record
					   record.submitFields({type:'customrecord_advs_vm',id:vinid, values: {
							custrecord_advs_truck_master_status: selectedValue
						}});
					}
                    

                    var onclickScript = " <html><body> <script type='text/javascript'>" +
                        "try{";
                    onclickScript += "window.opener.location.reload();";
                    onclickScript += "window.close();";
                    onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";
                    context.response.write(onclickScript);
                } catch (e) {
                    log.error('Error Saving Record', e);
                }
            }
        }

        return { onRequest };
    });

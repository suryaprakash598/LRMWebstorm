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
                // Create a select field
                let selectField = form.addField({
                    id: 'custpage_select_field',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Reservation Status',
                    source: 'customlist_advs_reservation_hold' // Change this to your List/Record
                });

                // Hidden field for record ID (if updating an existing record)
                let recordIdField = form.addField({
                    id: 'custpage_record_id',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Record ID'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                recordIdField.defaultValue = _vinid;
                form.addSubmitButton({
                    label: 'Submit'
                });

                context.response.writePage(form);
            } else {
                let request = context.request;
                let selectedValue = request.parameters.custpage_select_field;
                let vinid = request.parameters.custpage_record_id;

                try {
                    // Create or update the custom record
                   record.submitFields({type:'customrecord_advs_vm',id:vinid, values: {
                        custrecord_reservation_hold: selectedValue
                    }});

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

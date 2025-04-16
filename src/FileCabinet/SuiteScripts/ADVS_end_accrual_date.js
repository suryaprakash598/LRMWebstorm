/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/redirect'], function(ui, record, redirect) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            var form = ui.createForm({ title: 'Set End Accrual Date',hideNavBar:true });
            form.addField({
                id: 'custpage_end_accrual_date',
                type: ui.FieldType.DATE,
                label: 'End Accrual Date'
            }).isMandatory=true;


            form.addSubmitButton('Submit');
            context.response.writePage(form);
        } else {
            var request = context.request;
            var endDate = request.parameters.custpage_end_accrual_date;
            context.response.write(`
                <script>debugger;
                    try{
                        var endDate = '${endDate}';
                        if (window.parent && !window.parent.closed) {
                            var field = window.parent.nlapiGetField('custrecord_advs_l_h_end_date');
                            if (field) {
                                window.parent.nlapiSetFieldValue('custrecord_advs_l_h_end_date', endDate);
                            } else {
                                // Fallback using SuiteScript 2.0 client-side API
                                var currentRecord = window.parent.require('N/currentRecord');
                                var rec = currentRecord.get();
                                rec.setValue({
                                    fieldId: 'custrecord_advs_l_h_end_date',
                                    value: endDate
                                });
                            }
                        }
                        window.parent.closePopup();
                    }catch (e){
                        console.log('error',e.toString());
                        alert(e);
                    }
                    
                </script>
            `);

        }
    }

    return {
        onRequest: onRequest
    };
});

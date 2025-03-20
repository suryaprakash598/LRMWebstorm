/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/runtime'], function (serverWidget, record, runtime) {
    function onRequest(context) {
        if (context.request.method === 'GET') {

            var CutomerId = context.request.parameters.custparam_cust;
            var TruckMasterId = context.request.parameters.custparam_truckmaster;
            var LeaseLink = context.request.parameters.custparam_leaselink;

            if (CutomerId && TruckMasterId) {

                var form = serverWidget.createForm({
                    title: 'Notes'
                });
                var notesFld = form.addField({
                    id: 'custpage_title',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Notes'
                });
                notesFld.isMandatory = true;
                notesFld.updateDisplaySize({
                    height: 75,
                    width: 75
                });
                form.addField({
                    id: 'custpage_title_memo',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'Memo'
                });
                form.addField({
                    id: 'custpage_customer',
                    type: serverWidget.FieldType.TEXT,
                    label: 'customer'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                }).defaultValue = CutomerId;
                
                form.addField({
                    id: 'custpage_truckmaster',
                    type: serverWidget.FieldType.TEXT,
                    label: 'TruckMaster'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                }).defaultValue = TruckMasterId;

                form.addField({
                    id: 'custpage_leaselink',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Lease'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                }).defaultValue = LeaseLink;

                

                form.addSubmitButton({
                    label: 'Submit'
                });

                context.response.writePage(form);
            }
        } else {
            var customer = context.request.parameters.custpage_customer;
            var LeaseLink = context.request.parameters.custpage_leaselink;
            var title = context.request.parameters.custpage_title;
            var message = context.request.parameters.custpage_title_memo;

            var taskRecord = record.create({
                type: record.Type.TASK
            });
            taskRecord.setValue({
                fieldId: 'title',
                value: title
            });
            var emp = runtime.getCurrentUser();
            taskRecord.setValue({
                fieldId: 'assigned',
                value: emp.id
            });
            taskRecord.setValue({
                fieldId: 'status',
                value: 'COMPLETE'
            });
            var currentDate = new Date();
            taskRecord.setValue({
                fieldId: 'startdate',
                value: currentDate
            });
            taskRecord.setValue({
                fieldId: 'duedate',
                value: currentDate
            });
            taskRecord.setValue({
                fieldId: 'company',
                value: customer
            });
            taskRecord.setValue({
                fieldId: 'custevent_advs_lease_link',
                value: LeaseLink
            });
            taskRecord.setValue({
                fieldId: 'message',
                value: message
            });

            try {
                var taskId = taskRecord.save();
                log.error('task_id', taskId);
            } catch (e) {
                log.error('LOGGED MESSAGE', e.message);
            }

            // var onclickScript = " <html><body> <script type='text/javascript'>" +
            //     "try{" +
            //     "";
            // onclickScript += "" +
            //     "";
            // onclickScript += "" +
            //     "window.parent.location.reload();" +
            //     "";
            // onclickScript+="window.parent.closePopup();";
 
            // onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";

            // context.response.write(onclic+++kScript);
        }
    }

    return {
        onRequest: onRequest
    };
});
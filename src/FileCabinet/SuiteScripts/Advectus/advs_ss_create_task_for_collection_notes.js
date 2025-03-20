/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/runtime'], function(serverWidget, record, runtime) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            var cust_param = context.request.parameters.custparam_cust;
            var cust_deal_id = context.request.parameters.deal_id;
            if (cust_param && cust_deal_id) {
                var form = serverWidget.createForm({
                    title: 'Notes'
                });
               var notesFld =  form.addField({
                    id: 'custpage_title',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Notes'
                });
				notesFld.isMandatory=true;
				notesFld.updateDisplaySize({
								height : 75,
								width : 75
							}) ;
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
                }).defaultValue = cust_param;
                form.addField({
                    id: 'custpage_deal_id',
                    type: serverWidget.FieldType.TEXT,
                    label: 'customer'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                }).defaultValue = cust_deal_id;
/*
                // Add a sublist to the form
                var sublist = form.addSublist({
                    id: 'custpage_sublist_id',
                    type: serverWidget.SublistType.LIST,
                    label: 'Your Sublist Label'
                });
                sublist.addField({
                    id: 'custpage_sublist_field_1',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Sublist Field 1'
                });
                sublist.addField({
                    id: 'custpage_sublist_field_2',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'Sublist Field 2'
                });*/

                form.addSubmitButton({
                    label: 'Submit'
                });

                context.response.writePage(form);
            }
        } else {
            var customer = context.request.parameters.custpage_customer;
            var dealId = context.request.parameters.custpage_deal_id;
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
                value: dealId
            });
            taskRecord.setValue({
                fieldId: 'message',
                value: message
            });
            try {
                var taskId = taskRecord.save();
                log.debug('task_id', taskId);
            } catch (e) {
                log.debug('LOGGED MESSAGE', e.message);
            }
            var html = "<script>window.close();</script>";
            context.response.write(html);
        }
    }

    return {
        onRequest: onRequest
    };
});

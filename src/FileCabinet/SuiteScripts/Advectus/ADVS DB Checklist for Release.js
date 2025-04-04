/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/redirect'], (serverWidget, record, search, redirect) => {

    /**
     * Fetch checklist items for a given quote.
     */
    const getQuoteChecklist = (dbid) => {
        let checklistItems = [];
        let checklistSearch = search.create({
            type: 'customrecord_delivery_board_cklist_ans',
            filters: [['custrecord_db_parent_link', 'anyof', dbid]],
            columns: ['custrecord_name',  'custrecord_completed','custrecord_description']
        });

        checklistSearch.run().each((result) => {
            checklistItems.push({
                recid:result.getValue('custrecord_name'),
                name: result.getValue('custrecord_name'),
                nametext: result.getValue('custrecord_description'),
                mandatory:  'F',
                completed: result.getValue('custrecord_completed'),
                recordId: result.id
            });
            return true;
        });
       return checklistItems;
    };

    /**
     * Fetch default checklist template (if no records exist for quote).
     */
    const getDefaultChecklist = () => {
        let checklistItems = [];
        let checklistSearch = search.create({
            type: 'customrecord_advs_dlvry_chklist',
            filters: [
                ['isinactive', 'is', 'F'],
                'AND',
                ['custrecord_advs_dlvry_display', 'is', 'T']
            ],
            columns: ['custrecord_advs_name_chklist', 'custrecord_advs_mandatory_chklist']
        });

        checklistSearch.run().each((result) => {
            checklistItems.push({
                recid:result.id,
                name: result.getValue('custrecord_advs_name_chklist'),
                nametext: result.getText('custrecord_advs_name_chklist'),
                mandatory: result.getValue('custrecord_advs_mandatory_chklist') === 'T',
                completed: false,
                recordId: null
            });
            return true;
        });

        return checklistItems;
    };

    /**
     * Handles Suitelet request.
     */
    const onRequest = (context) => {
        let request = context.request;
        let dbId = request.parameters.dbid;

      /*  if (!quoteId) {
            context.response.write('Missing Quote ID');
            return;
        }*/

        if (request.method === 'GET') {
            let form = serverWidget.createForm({ title: `Checklist for Delivery Board #${dbId}` });
            var parentfld = form.addField({id:'custpage_db_parent',label:'DB parent',type:'TEXT'}).updateDisplayType({displayType:serverWidget.FieldDisplayType.HIDDEN})
            parentfld.defaultValue = dbId;
            let sublist = form.addSublist({
                id: 'custpage_checklist',
                type: serverWidget.SublistType.LIST,
                label: 'Checklist Items'
            });

            sublist.addField({ id: 'custpage_name_qs', type: serverWidget.FieldType.TEXT, label: 'Checklist ItemQs'})
                .updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
            sublist.addField({ id: 'custpage_name', type: serverWidget.FieldType.SELECT, label: 'Checklist Item',source:'customrecord_advs_dlvry_chklist' })
                .updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
            sublist.addField({ id: 'custpage_name_text', type: serverWidget.FieldType.TEXT, label: 'Checklist Item' });

            sublist.addField({ id: 'custpage_mandatory', type: serverWidget.FieldType.TEXT, label: 'Mandatory' })
                .updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });

            sublist.addField({ id: 'custpage_completed', type: serverWidget.FieldType.CHECKBOX, label: 'Completed' });

            sublist.addField({ id: 'custpage_recordid', type: serverWidget.FieldType.TEXT, label: 'Record ID' })
                .updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });

            let checklistItems = getQuoteChecklist(dbId);
            if (checklistItems.length === 0) {
                checklistItems = getDefaultChecklist();
            }

            checklistItems.forEach((item, index) => {
               // log.debug('item',item);
                sublist.setSublistValue({ id: 'custpage_name_qs', line: index, value: item.recid });
                sublist.setSublistValue({ id: 'custpage_name', line: index, value: item.name });
                sublist.setSublistValue({ id: 'custpage_name_text', line: index, value: item.nametext });
                sublist.setSublistValue({
                    id: 'custpage_mandatory',
                    line: index,
                    value: item.mandatory ? '⚠️' : ' '
                });
                if (item.completed) {
                    sublist.setSublistValue({ id: 'custpage_completed', line: index, value: 'T' });
                }
                //log.debug('item.recordId',item.recordId);
                if (item.recordId) {
                    sublist.setSublistValue({ id: 'custpage_recordid', line: index, value: item.recordId });
                }
            });

            form.addSubmitButton({ label: 'Save Checklist' });

            context.response.writePage(form);
        }
        else {
            let request = context.request;
            let response = context.response;
            let dbId = request.parameters.custpage_db_parent;
            let lineCount = request.getLineCount({ group: 'custpage_checklist' });

            for (let i = 0; i < lineCount; i++) {
                let nameid = request.getSublistValue({ group: 'custpage_checklist', name: 'custpage_name_qs', line: i });
                let name = request.getSublistValue({ group: 'custpage_checklist', name: 'custpage_name', line: i });
                let mandatory =''// request.getSublistValue({ group: 'custpage_checklist', name: 'custpage_mandatory', line: i }) === '⚠️';
                let completed = request.getSublistValue({ group: 'custpage_checklist', name: 'custpage_completed', line: i }) === 'T';
                let recordId = request.getSublistValue({ group: 'custpage_checklist', name: 'custpage_recordid', line: i });
               if (recordId) {
                    record.submitFields({
                        type: 'customrecord_delivery_board_cklist_ans',
                        id: recordId,
                        values: { 'custrecord_completed': completed }
                    });
                } else {
                    let newRecord = record.create({
                        type: 'customrecord_delivery_board_cklist_ans',
                        isDynamic: true
                    });

                    newRecord.setValue({ fieldId: 'custrecord_db_parent_link', value: dbId });
                    newRecord.setValue({ fieldId: 'custrecord_name', value: nameid });
                    // newRecord.setValue({ fieldId: 'custrecord_mandatory', value: mandatory });
                    newRecord.setValue({ fieldId: 'custrecord_completed', value: completed });

                    newRecord.save();
                }
            }
            let onclickScript = " <html><body> <script type='text/javascript'>" +
                "try{";
            onclickScript += "window.opener.location.reload();";
            onclickScript += "window.close();";
            onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";
            response.write(onclickScript);
            //redirect.toSuitelet({ scriptId: 'customscript_advs_db_checklist_release', deploymentId: 'customdeploy_advs_db_checklist_release', parameters: { dbid: dbId } });
        }
    };

    return { onRequest };
});

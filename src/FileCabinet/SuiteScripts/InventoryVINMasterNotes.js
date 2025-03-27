/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/url','N/format'], function (serverWidget, record, search, url,format) {

    function onRequest(context) {
        if (context.request.method === 'GET') {
           var parentlink =  context.request.parameters.vin;
            var form = serverWidget.createForm({ title: 'Truck Master Notes' });
            var field = form.addField({
                id: 'custpage_vin',
                type: serverWidget.FieldType.TEXT,
                label: 'VIN'
            });
            field.defaultValue = parentlink;
            field.updateDisplayType({ displayType: "hidden" });
            var SublistObj =populateNotesSublist(form);
            if (parentlink) {
                populateNotesData(SublistObj,parentlink);
            }
            form.addSubmitButton({ label: 'Save Notes' });
            form.clientScriptModulePath = './Advectus/ADVS_CS_VIN_Master_Notes.js';
            context.response.writePage(form);

        }
        else if (context.request.method === 'POST') {
            var request = context.request;
            var recordId = request.parameters.custpage_vin; // Assume record ID is passed in Edit field

            if (recordId) {
                var rec = record.load({
                    type: 'customrecord_advs_vm',
                    id: recordId,
                    isDynamic:true
                });

                var SublistId_suite = 'custpage_notes_sublist';
                var LineCount = context.request.getLineCount({
                    group: SublistId_suite
                });
                var childRec = 'recmachcustrecord_advs_inv_note_parent_link';
                var childLineCount = rec.getLineCount('recmachcustrecord_advs_inv_note_parent_link') * 1;
                if (childLineCount > 0) {
                    for (var j = childLineCount - 1; j >= 0; j--) {
                        rec.removeLine({
                            sublistId: childRec,
                            line: j
                        });
                    }
                }
                if (LineCount > 0) {
                    for (var k = 0; k < LineCount; k++) {
                        var DateTime = context.request.getSublistValue({
                            group: SublistId_suite,
                            name: 'custsublist_date',
                            line: k
                        });
                        var Notes = context.request.getSublistValue({
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
                                fieldId: 'custrecord_advs_inv_note_date_time',
                                value: DateTime
                            });
                            rec.setCurrentSublistValue({
                                sublistId: childRec,
                                fieldId: 'custrecord_advs_inv_note_notes',
                                value: Notes
                            });
                            rec.commitLine({
                                sublistId: childRec
                            });
                        }
                    }
                }
                rec.save();

                var onclickScript = " <html><body> <script type='text/javascript'>" +
                    "try{";
                onclickScript += "window.opener.location.reload();";
                onclickScript += "window.close();";
                onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";
                context.response.write(onclickScript);
                //context.response.write('Record updated successfully');
            } else {
                context.response.write('No record ID provided');
            }
        }

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
            source: 'customrecord_advs_truck_master',
            label: 'RECORD ID'
        }).updateDisplayType({
            displayType: "hidden"
        });
        return SublistObj;
    }
    function populateNotesData(SublistObj, vinId) {
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
        if (vinId) {
            var SearchObj = search.create({
                type: 'customrecord_advs_truck_master_notes',
                filters: [
                    ['isinactive', 'is', 'F'],
                    'AND',
                    ['custrecord_advs_inv_note_parent_link', 'anyof', vinId]
                ],
                columns: [
                    'custrecord_advs_inv_note_date_time',
                    'custrecord_advs_inv_note_notes'
                ]
            });
            SearchObj.run().each(function (result) {
                SublistObj.setSublistValue({
                    id: "custsublist_date",
                    line: Line,
                    value: result.getValue('custrecord_advs_inv_note_date_time') || ' '
                });
                SublistObj.setSublistValue({
                    id: "custsublist_notes",
                    line: Line,
                    value: result.getValue('custrecord_advs_inv_note_notes') || ' '
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
        onRequest: onRequest
    };
});

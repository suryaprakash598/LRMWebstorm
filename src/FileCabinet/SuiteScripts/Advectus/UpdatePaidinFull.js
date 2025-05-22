/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/url', 'N/redirect', 'N/runtime','N/format'],
    function(ui, record, search, url, redirect, runtime,format) {

        function onRequest(context) {
            var request = context.request;
            var response = context.response;

            if (request.method === 'GET') {
                var form = ui.createForm({ title: 'Paid in Full' });

                // Add a field to capture the PaidInFull Record ID (hidden)
                var paidInFullId = request.parameters.pifid;
                form.addField({
                    id: 'custpage_pif_id',
                    type: ui.FieldType.TEXT,
                    label: 'Paid In Full ID'
                }).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN }).defaultValue = paidInFullId;

                if (!paidInFullId) {
                    form.addField({
                        id: 'custpage_missing_id',
                        type: ui.FieldType.INLINEHTML,
                        label: 'Error'
                    }).defaultValue = '<div style="color:red;">Missing Paid In Full record ID.</div>';
                    response.writePage(form);
                    return;
                }

                var pifRecord = record.load({
                    type: 'customrecord_advs_paid_in_full',
                    id: paidInFullId
                });

                // Define fields
                var fields = [
                    { display:'NORMAL',id: 'custrecord_advs_status_pif', label: 'Status', type: ui.FieldType.SELECT, source: 'customlist_paid_in_full_status' },
                    { display:'DISABLED',id: 'custrecord_advs_pif_vin', label: 'VIN', type: ui.FieldType.SELECT, source: 'customrecord_advs_vm' },
                    { display:'DISABLED',id: 'custrecord_advs_lessee_name_pif', label: 'Lessee Name', type: ui.FieldType.SELECT, source: 'customer' },
                    { display:'DISABLED',id: 'custrecord_advs_pif_lease', label: 'Lease #', type: ui.FieldType.SELECT, source: 'customrecord_advs_lease_header' },
                    { display:'NORMAL',id: 'custrecord_advs_pif_bos', label: 'Bill Of Sales Date', type: ui.FieldType.DATE },
                    { display:'NORMAL',id: 'custrecord_advs_purchase_pif', label: 'Purchase Price', type: ui.FieldType.CURRENCY },
                    { display:'NORMAL',id: 'custrecord_advs_sales_tax_pif', label: 'Sales Tax amt', type: ui.FieldType.FLOAT },
                    { display:'DISABLED',id: 'custrecord_advs_catalog_numb_pif', label: 'Catalog #', type: ui.FieldType.SELECT, source: 'customrecord_advs_title_dashboard' },
                    { display:'NORMAL',id: 'custrecord_advs_title_res_pif', label: 'Title Restriction', type: ui.FieldType.SELECT, source: 'customlist_advs_title_restriction_list' },
                    { display:'NORMAL',id: 'custrecord_advs_date_sent_pif', label: 'Date Sent to Customer', type: ui.FieldType.DATE },
                    { display:'NORMAL',id: 'custrecord_advs_transfer_type_pif', label: 'Transfer Type', type: ui.FieldType.SELECT, source: 'customlist_advs_transfer_type' },
                    { display:'NORMAL',id: 'custrecord_advs_track_num_pif', label: 'Tracking #', type: ui.FieldType.TEXT }
                ];

                // Add fields to form and set default values
                fields.forEach(function(fieldInfo) {
                    var field = form.addField({
                        id: fieldInfo.id,
                        type: fieldInfo.type,
                        label: fieldInfo.label,
                        source: fieldInfo.source || null
                    });
                    if(fieldInfo.id=='custrecord_advs_sales_tax_pif'){
                        var pamount = pifRecord.getValue('custrecord_advs_purchase_pif');
                        var Customer = pifRecord.getValue('custrecord_advs_lessee_name_pif');
                        var taxamount = getCustomerTaxRate(Customer,pamount);
                        field.updateDisplayType({ displayType: ui.FieldDisplayType[fieldInfo.display] })
                        field.defaultValue = taxamount;
                    }else{
                        field.updateDisplayType({ displayType: ui.FieldDisplayType[fieldInfo.display] })
                        field.defaultValue = pifRecord.getValue(fieldInfo.id);
                    }


                });
                var SublistObj = populateNotesSublist(form);
                if (paidInFullId) {
                    populateNotesData(SublistObj,paidInFullId);
                }
                form.clientScriptModulePath = './updatePaidinfullValidation.js';
                form.addSubmitButton('Save');
                response.writePage(form);

            }
            else {
                // POST: Save updates
                var id = request.parameters.custpage_pif_id;
                var rec = record.load({
                    type: 'customrecord_advs_paid_in_full',
                    id: id,
                    isDynamic: true
                });

                var fieldIds = [
                    'custrecord_advs_status_pif',
                    'custrecord_advs_pif_bos',
                    'custrecord_advs_purchase_pif',
                    'custrecord_advs_sales_tax_pif',
                    'custrecord_advs_title_res_pif',
                    'custrecord_advs_date_sent_pif',
                    'custrecord_advs_transfer_type_pif',
                    'custrecord_advs_track_num_pif'
                ];
              //  M/D/YYYY
                log.debug('dates',request.parameters['custrecord_advs_pif_bos']);

                fieldIds.forEach(function(fid) {
                    if(fid == 'custrecord_advs_pif_bos' || fid == 'custrecord_advs_date_sent_pif') {
                        if(request.parameters[fid]){
                            var _value = format.parse({
                                value: request.parameters[fid],
                                type: format.Type.DATE
                            });
                            rec.setValue({
                                fieldId: fid,
                                value: _value
                            });
                        }

                    }else{
                        rec.setValue({
                            fieldId: fid,
                            value: request.parameters[fid]
                        });

                    }

                });
                //
                if(request.parameters['custrecord_advs_status_pif'] == '4'){
                    var vin = request.parameters['custrecord_advs_pif_vin']
                    if(vin){
                        record.submitFields({type:'customrecord_advs_vm',id:vin,values:{"custrecord_advs_truck_master_status":7}})

                    }
                }
                var SublistId_suite = 'custpage_notes_sublist';
                var LineCount = context.request.getLineCount({
                    group: SublistId_suite
                });
                var childRec = 'recmachcustrecord_advs_pif_note_parent_link';

                var childLineCount = rec.getLineCount('recmachcustrecord_advs_pif_note_parent_link') * 1;
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
                                fieldId: 'custrecord_advs_pif_note_date_time',
                                value: DateTime
                            });
                            rec.setCurrentSublistValue({
                                sublistId: childRec,
                                fieldId: 'custrecord_advs_pif_note_notes',
                                value: Notes
                            });
                            rec.commitLine({
                                sublistId: childRec
                            });
                        }
                    }
                }
                rec.save();
                //<h3>Record Updated Successfully.</h3><a href="' + url.resolveScript({
                //                     scriptId: runtime.getCurrentScript().id,
                //                     deploymentId: runtime.getCurrentScript().deploymentId,
                //                     params: { id: id }
                //                 }) + '">Go back</a>
                response.write('<html><body><script>window.opener.location.reload();window.close();</script></body></html>');
            }
        }
        function populateNotesSublist(form) {
            var SublistObj = form.addSublist({
                id: 'custpage_notes_sublist',
                type: ui.SublistType.LIST,
                label: 'User Notes'
            });
            SublistObj.addField({
                id: 'custsublist_date',
                type: ui.FieldType.TEXT,
                label: 'Date & Time'
            });
            SublistObj.addField({
                id: 'custsublist_notes',
                type: ui.FieldType.TEXTAREA,
                label: 'Notes'
            }).updateDisplayType({
                displayType: "entry"
            });
            SublistObj.addField({
                id: 'custsublist_record_id',
                type: ui.FieldType.SELECT,
                source: 'customrecord_advs_paidinfull_notes',
                label: 'RECORD Id'
            }).updateDisplayType({
                displayType: "hidden"
            });
            return SublistObj;
        }

        function populateNotesData(SublistObj, tptId) {
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
            if (tptId) {
                var SearchObj = search.create({
                    type: 'customrecord_advs_paidinfull_notes',
                    filters: [
                        ['isinactive', 'is', 'F'],
                        'AND',
                        ['custrecord_advs_pif_note_parent_link', 'anyof', tptId]
                    ],
                    columns: [
                        'custrecord_advs_pif_note_date_time',
                        'custrecord_advs_pif_note_notes'
                    ]
                });
                SearchObj.run().each(function (result) {
                    SublistObj.setSublistValue({
                        id: "custsublist_date",
                        line: Line,
                        value: result.getValue('custrecord_advs_pif_note_date_time') || ' '
                    });
                    SublistObj.setSublistValue({
                        id: "custsublist_notes",
                        line: Line,
                        value: result.getValue('custrecord_advs_pif_note_notes') || ' '
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

        function getCustomerTaxRate(Customer,pamount)
        {
            if(Customer){
                var SearchObj = search.lookupFields({
                    type: 'customer',
                    id: Customer,
                    columns: ['taxitem']
                });
                var TaxCode = SearchObj.taxitem && SearchObj.taxitem.length > 0 ? SearchObj.taxitem[0].value : null;
                if(TaxCode){
                    var lookupObj = search.lookupFields({
                        type: 'taxgroup',
                        id: TaxCode,
                        columns: ['rate']
                    });
                    var taxRate = lookupObj.rate;

                    if(pamount > 0 && taxRate){
                        var TaxPercent = taxRate / 100;
                        TaxPercent = TaxPercent*1;
                        var TaxAmount = (pamount*1)*(TaxPercent*1);
                        TaxAmount = TaxAmount*1;
                        TaxAmount = TaxAmount.toFixed(2);
                        return TaxAmount;
                    }
                    else {return 0;}
                }
            }
        }
        return {
            onRequest: onRequest
        };
    });

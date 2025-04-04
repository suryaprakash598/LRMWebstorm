/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/format'], function (serverWidget, record, search, format) {
  function onRequest(context) {
    if (context.request.method === 'GET') {
      try {
        var transportId = context.request.parameters.transport;
        var form = serverWidget.createForm({
          title: 'Transport',
          hideNavBar: true
        });

        var fieldsArray = getFields();
        var _defaultValues = getValues(transportId);

        fieldsArray.forEach(function (fieldObj) {
          var field = form.addField({
            id: fieldObj.fieldid,
            type: serverWidget.FieldType[fieldObj.fieldtype],
            label: fieldObj.fieldlabel,
            source: fieldObj.source
          });

          if (fieldObj.displaytype === 'HIDDEN') {
            field.updateDisplayType({
              displayType: serverWidget.FieldDisplayType.HIDDEN
            });
          }
          if (fieldObj.displaytype === 'DISABLED') {
            field.updateDisplayType({
              displayType: serverWidget.FieldDisplayType.DISABLED
            });
          }
          if (fieldObj.fieldid == 'custpage_tpt_edit_id') {
            field.defaultValue = transportId;
          }
          if (fieldObj.recfieldid != '') {
            if (fieldObj.fieldtype == 'SELECT') {
              if (_defaultValues[fieldObj.recfieldid].length) {
                field.defaultValue = _defaultValues[fieldObj.recfieldid][0].value;
              }
            }
            if (fieldObj.fieldtype == 'TEXT') {
              field.defaultValue = _defaultValues[fieldObj.recfieldid];
            }
            if (fieldObj.fieldtype == 'DATE') {
              if (_defaultValues[fieldObj.recfieldid]) {
                var _value = format.parse({
                  value: _defaultValues[fieldObj.recfieldid],
                  type: format.Type.DATE
                });
                field.defaultValue = _value;
              }

            }

          }

        });
        var SublistObj = populateNotesSublist(form);
		 if (transportId) {
                populateNotesData(SublistObj,transportId);
            }
        form.addSubmitButton({
          label: 'Submit'
        });
        form.clientScriptModulePath = './updateTransportValidation.js';
        context.response.writePage(form);
      } catch (e) {
        log.debug('errpr', e.toString());
      }

    }
    else if (context.request.method === 'POST') {
      var request = context.request;
      var recordId = request.parameters.custpage_tpt_edit_id; // Assume record ID is passed in Edit field

      if (recordId) {
        var rec = record.load({
          type: 'customrecord_advs_transport_dashb',
          id: recordId,
		  isDynamic:true
        });
        var fieldsArray = getFields();
        // M/D/YYYY
        fieldsArray.forEach(function (fieldObj) {
          if (fieldObj.recfieldid != '' && request.parameters[fieldObj.fieldid]) {

            if (fieldObj.fieldtype == 'DATE') {
              var _value = format.parse({
                value: request.parameters[fieldObj.fieldid],
                type: format.Type.DATE
              });
              rec.setValue({
                fieldId: fieldObj.recfieldid, // Adjust field ID if necessary
                value: _value
              });
            } else {
              rec.setValue({
                fieldId: fieldObj.recfieldid, // Adjust field ID if necessary
                value: request.parameters[fieldObj.fieldid]
              });
            }
            if (fieldObj.fieldid == 'custpage_tpt_truckstatus') {
              //var vinid = request.parameters.custpage_tpt_vin;
              var vinid = rec.getValue({
                fieldId: 'custrecord_vin_link'
              });
              var truckstatus = request.parameters.custpage_tpt_truckstatus;
              var modulestatus = request.parameters.custpage_tpt_modulestatus;
              if (vinid) {

                record.submitFields({
                  type: 'customrecord_advs_vm',
                  id: vinid,
                  values: {
                    custrecord_advs_vm_reservation_status: truckstatus,
                    custrecord_advs_tpt_stts: modulestatus
                  },
                  options: {
                    enableSourcing: !1,
                    ignoreMandatoryFields: !0
                  }
                });
              }
            }
            var _modulestatus = request.parameters.custpage_tpt_modulestatus;
            var _truckstatus = request.parameters.custpage_tpt_truckstatus;
            var tolocation = request.parameters.custpage_tpt_locationto;
            var _stock = request.parameters.custpage_tpt_stock;
            if (_modulestatus == 11) //complete //_modulestatus==10
            {

              var vinid = rec.getValue({
                fieldId: 'custrecord_vin_link'
              });
            /*  var tolocation = rec.getValue({
                fieldId: 'custpage_tpt_locationto'
              });*/
              if (vinid) {
                record.submitFields({
                  type: 'customrecord_advs_vm',
                  id: vinid,
                  values: {
                    custrecord_advs_physical_loc_ma: tolocation
                  },
                  options: {
                    enableSourcing: !1,
                    ignoreMandatoryFields: !0
                  }
                })
              }

            }

          }
        });
        var _truckstatus = request.parameters.custpage_tpt_truckstatus;
        //CREATE AUCTION LINE IF TRUCK STATUS IS INVENTORY HELD FOR SALE
        if (_truckstatus == 57) //complete //_modulestatus==10
        {
          try{
            var _vinid = rec.getValue({
              fieldId: 'custrecord_vin_link'
            });
            var objRecord = record.create({type:'customrecord_advs_vehicle_auction',isDynamic:!0});
            //objRecord.setValue({fieldId:'custrecord_auction_lease',value:sobj.custrecord_ofr_stock_no[0].value,ignoreFieldChange:true});
            objRecord.setValue({fieldId:'custrecord_auction_vin',value:_vinid,ignoreFieldChange:true});
            objRecord.setValue({fieldId:'custrecord_auction_status',value:12,ignoreFieldChange:true});
            objRecord.save();

          }catch(e) {
            log.debug('error in auction creation',e.toString());
          }
        }
        var SublistId_suite = 'custpage_notes_sublist';
        var LineCount = context.request.getLineCount({
          group: SublistId_suite
        });
        var childRec = 'recmachcustrecord_advs_tpt_note_parent_link';

        var childLineCount = rec.getLineCount('recmachcustrecord_advs_tpt_note_parent_link') * 1;
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
                fieldId: 'custrecord_advs_tpt_note_date_time',
                value: DateTime
              });
              rec.setCurrentSublistValue({
                sublistId: childRec,
                fieldId: 'custrecord_advs_tpt_note_notes',
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

  function getFields() {
    var _fieldsArray = [
      // { fieldlabel: 'Truck Status Text', fieldid: 'custpage_tpt_truckstatus_text', fieldtype: 'SELECT', displaytype: 'NORMAL' },
      // { fieldlabel: 'Status Text', fieldid: 'custpage_tpt_modulestatus_text', fieldtype: 'TEXT', displaytype: 'HIDDEN' },
      {
        recfieldid: '',
        fieldlabel: 'Edit',
        fieldid: 'custpage_tpt_edit_id',
        fieldtype: 'TEXT',
        source: '',
        displaytype: 'HIDDEN'
      },
      {
        recfieldid: 'custrecord_advs_truck_status_transport',
        fieldlabel: 'Truck Status',
        fieldid: 'custpage_tpt_truckstatus',
        fieldtype: 'SELECT',
        source: 'customlist_advs_reservation_status',
        displaytype: 'NORMAL'
      },
      {
        recfieldid: 'custrecord_advs_transport_status_dash',
        fieldlabel: 'Status',
        fieldid: 'custpage_tpt_modulestatus',
        fieldtype: 'SELECT',
        source: 'customlist_advs_transport_status_list',
        displaytype: 'NORMAL'
      },
      {
        recfieldid: 'custrecord_advs_stock_number_transport',
        fieldlabel: 'Stock #',
        fieldid: 'custpage_tpt_stock',
        fieldtype: 'TEXT',
        source: '',
        displaytype: 'DISABLED'
      },
      {
        recfieldid: 'custrecord_advs_transport_notes',
        fieldlabel: 'Notes',
        fieldid: 'custpage_tpt_notes',
        fieldtype: 'TEXT',
        source: '',
        displaytype: 'NORMAL'
      },
      {
        recfieldid: 'custrecord_advs_transport_comp',
        fieldlabel: 'Transport Company',
        fieldid: 'custpage_tpt_transport_company',
        fieldtype: 'SELECT',
        source: 'vendor',
        displaytype: 'NORMAL'
      },
      {
        recfieldid: 'custrecord_advs_transport_fromlocation',
        fieldlabel: 'Location From',
        fieldid: 'custpage_tpt_locationfrom',
        fieldtype: 'SELECT',
        source: 'customrecord_advs_loct_from_transport',
        displaytype: 'NORMAL'
      },
      {
        recfieldid: 'custrecord_advs_transport_location_to',
        fieldlabel: 'Location To',
        fieldid: 'custpage_tpt_locationto',
        fieldtype: 'SELECT',
        source: 'customrecord_advs_transport_loc_to',
        displaytype: 'NORMAL'
      },
      {
        recfieldid: 'custrecord_advs_date_assigned_transport',
        fieldlabel: 'Date Assigned',
        fieldid: 'custpage_tpt_dateassigned',
        fieldtype: 'DATE',
        source: '',
        displaytype: 'NORMAL'
      },
      {
        recfieldid: 'custrecord_advs_date_on_site_transpo',
        fieldlabel: 'Date Onsite',
        fieldid: 'custpage_tpt_onsite',
        fieldtype: 'DATE',
        source: '',
        displaytype: 'NORMAL'
      },
      {
        recfieldid: '',
        fieldlabel: 'VIN',
        fieldid: 'custpage_tpt_vin',
        fieldtype: 'TEXT',
        source: '',
        displaytype: 'HIDDEN'
      }
    ];
    return _fieldsArray;
  }

  function getValues(transportId) {
    try {
      var lookupFields = [
        'custrecord_advs_truck_status_transport',
        'custrecord_advs_transport_status_dash',
        'custrecord_advs_stock_number_transport',
        'custrecord_advs_transport_notes',
        'custrecord_advs_transport_fromlocation',
        'custrecord_advs_transport_location_to',
        'custrecord_advs_date_assigned_transport',
        'custrecord_advs_date_on_site_transpo',
          'custrecord_advs_transport_comp'

      ];

      if (transportId) {
        var transpobj = search.lookupFields({
          type: 'customrecord_advs_transport_dashb',
          id: transportId,
          columns: lookupFields
        });
        return transpobj;
      }
    } catch (e) {
      log.debug('error', e.toString())
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
      source: 'customrecord_advs_transport_notes',
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
        type: 'customrecord_advs_transport_notes',
        filters: [
          ['isinactive', 'is', 'F'],
          'AND',
          ['custrecord_advs_tpt_note_parent_link', 'anyof', tptId]
        ],
        columns: [
          'custrecord_advs_tpt_note_date_time',
          'custrecord_advs_tpt_note_notes'
        ]
      });
      SearchObj.run().each(function (result) {
        SublistObj.setSublistValue({
          id: "custsublist_date",
          line: Line,
          value: result.getValue('custrecord_advs_tpt_note_date_time') || ' '
        });
        SublistObj.setSublistValue({
          id: "custsublist_notes",
          line: Line,
          value: result.getValue('custrecord_advs_tpt_note_notes') || ' '
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
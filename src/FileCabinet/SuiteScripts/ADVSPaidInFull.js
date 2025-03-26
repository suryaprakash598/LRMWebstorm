/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/dialog', 'N/ui/message', 'N/ui/serverWidget', 'SuiteScripts/Advectus/inventorymodulelib.js'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     * @param{dialog} dialog
     * @param{message} message
     * @param{serverWidget} serverWidget
     */
    (record, runtime, search, dialog, message, serverWidget, inventorymodulelib) => {
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

            if (request.method == "GET") {
                var form = serverWidget.createForm({
                    title: " "
                });
                var currScriptObj = runtime.getCurrentScript();
                var scriptId = currScriptObj.id; 
                log.debug('scriptId',scriptId);
                var UserObj = runtime.getCurrentUser();
                var UserSubsidiary = UserObj.subsidiary;
                var UserLocation = UserObj.location;
                var Userid = UserObj.id;

                //PARAMETERS
                var filtersparam = request.parameters.filters || '[]';
                var tpttstatus, tptstatus, tptfloc, tpttloc, tptstock = '';
                tpttstatus = request.parameters.tpttstatus || '';
                tptstatus = request.parameters.tptstatus || '';
                tptfloc = request.parameters.tptfloc || '';
                tpttloc = request.parameters.tpttloc || '';
                tptstock = request.parameters.tptstock || '';

                 var _inventorymodulelib = inventorymodulelib.jsscriptlib(form);
                //FIELD GROUP
               

                //FITLERS DATA AND HIDING FIELD
              

                //////////////////////TRANSPORT FILTERS///////////////////////
               
                //////////////////////TRANSPORT FILTERS///////////////////////

                var transportDboardFields = transportFields();
                var TransportsublistObj = renderFields(transportDboardFields, 'custpage_fil_gp_tpt', form);
               
                var transportdata = getTransportLines(tpttstatus, tptstatus, tptfloc, tpttloc, tptstock);
                setTransportSublistData(transportdata, TransportsublistObj, transportDboardFields);

                //BUTTONS ON THE DASHBOARD
               
                response.writePage(form);
            }

            function transportFields() {
                try {
                    var arr = [{
                        "fieldlabel": "Edit",
                        "fieldid": "custpage_tpt_edit",
                        "fieldtype": "TEXT",
                        "fieldsource": "",
                        "rolerestiction": "",
                        "displaytype": "NORMAL",

                    }, 
                        {
                            "fieldlabel": "Status id",
                            "fieldid": "custpage_tpt_statusid",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "HIDDEN",

                        },
                        {
                            "fieldlabel": "Status",
                            "fieldid": "custpage_tpt_status",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                       
                        {
                            "fieldlabel": "Notes",
                            "fieldid": "custpage_tpt_notes_icon",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "VIN",
                            "fieldid": "custpage_tpt_vin",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Lessee Name",
                            "fieldid": "custpage_tpt_lessee",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Lease #",
                            "fieldid": "custpage_tpt_lease",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Bill of Sale Date",
                            "fieldid": "custpage_tpt_bsd",
                            "fieldtype": "DATE",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Purchase Price",
                            "fieldid": "custpage_tpt_price",
                            "fieldtype": "CURRENCY",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Sales Tax Amt",
                            "fieldid": "custpage_tpt_amt",
                            "fieldtype": "CURRENCY",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Catalog #",
                            "fieldid": "custpage_tpt_catalog",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Title Restriction",
                            "fieldid": "custpage_tpt_restriction",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Date Sent to Customer",
                            "fieldid": "custpage_tpt_dsc",
                            "fieldtype": "DATE",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Transfer Type",
                            "fieldid": "custpage_tpt_transfertype",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Tracking #",
                            "fieldid": "custpage_tpt_tracking",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                       
                      
                       
                      
                    ];
                    return arr;
                } catch (e) {
                    log.debug('error in fields array object', e.toString());
                }
            }
            var FieldIDARR = [];

            function renderFields(fieldsarr, fieldgroup, form) {

                try {
                    var Transportsublist = form.addSublist({
                        id: "custpage_sublist_transport",
                        type: serverWidget.SublistType.LIST,
                        label: "List"
                    });
                    for (var i = 0; i < fieldsarr.length; i++) {
                        try {

                            if (fieldsarr[i].rolerestiction == '' || role == fieldsarr[i].rolerestiction) {
                                var fieldsobja = Transportsublist.addField({
                                    id: fieldsarr[i].fieldid,
                                    type: serverWidget.FieldType[fieldsarr[i].fieldtype],
                                    label: fieldsarr[i].fieldlabel,
                                    source: fieldsarr[i].fieldsource,
                                    //container: fieldgroup
                                });


                              
                                if (fieldsarr[i].displaytype == 'HIDDEN') {
                                    fieldsobja.updateDisplayType({
                                        displayType: serverWidget.FieldDisplayType.HIDDEN
                                    });
                                }
                                if (fieldsarr[i].displaytype == 'DISABLED') {
                                    fieldsobja.updateDisplayType({
                                        displayType: serverWidget.FieldDisplayType.DISABLED
                                    });
                                }


                            }

                        } catch (e) {
                            log.debug('error in render' + fieldsarr[i].fieldid, e.toString());
                        }
                    }

                    // return FieldIDARR;
                    return Transportsublist;
                } catch (e) {
                    log.debug('errr in render fields', e.toString())
                }
            }

            function setTransportSublistData(data, sublist, fields, transportNotes) {
                try {
                    //log.debug('data', data);
                    var arrkeys = Object.keys(data[0]);
                    var count = 0;

                    for (var f = 0; f < data.length; f++) {
                        for (var t = 0; t < arrkeys.length; t++) {
                            if (data[f][arrkeys[t]] != '') {
                                if (arrkeys[t] == 'custpage_tpt_notes') {
                                    var tptid = data[f]['custpage_tpt_id'];

                                    var NotestptArr = [];
                                    if (transportNotes[tptid] != null && transportNotes[tptid] != undefined) {
                                        var Length = transportNotes[tptid].length;
                                        for (var Len = 0; Len < Length; Len++) {
                                            if (transportNotes[tptid][Len] != null && transportNotes[tptid][Len] != undefined) {
                                                var DateTime = transportNotes[tptid][Len]['DateTime'];
                                                var Notes = transportNotes[tptid][Len]['Notes'];
                                                var DataStore = DateTime + '-' + Notes;
                                                NotestptArr.push(DataStore);
                                            }
                                        }
                                    }
                                    sublist.setSublistValue({
                                        id: arrkeys[t],
                                        line: count,
                                        value: NotestptArr
                                    });
                                } else {
                                    sublist.setSublistValue({
                                        id: arrkeys[t],
                                        line: count,
                                        value: data[f][arrkeys[t]]
                                    });
                                }

                            }

                        }

                        count++;
                    }


                } catch (e) {
                    log.debug('error in setTransportSublistData', e.toString());
                }
            }

            function getTransportLines(tpttstatus, tptstatus, tptfloc, tpttloc, tptstock) {
                try {
                    var transportSObj = search.create({
                        type: "customrecord_advs_paid_in_full",
                        filters: [
                            ["isinactive", "is", "F"]
                            /*"AND",
                            ["custrecord_advs_transport_status_dash", "noneof", "11"]*/
                        ],
                        columns: [
                            "custrecord_advs_status_pif",
                            "custrecord_advs_pif_notes",
                            "custrecord_advs_pif_vin",
                            "custrecord_advs_lessee_name_pif",
                            "custrecord_advs_pif_lease",
                            "custrecord_advs_pif_bos",
                            "custrecord_advs_purchase_pif",
                            "custrecord_advs_sales_tax_pif",
                            "custrecord_advs_catalog_numb_pif",
                            "custrecord_advs_title_res_pif",
                            "custrecord_advs_date_sent_pif",
                            "custrecord_advs_transfer_type_pif",
                            "custrecord_advs_track_num_pif"
                        ]
                    });
                    log.debug('tpttstatus', tpttstatus);
                    if (tpttstatus != '') {
                        transportSObj.filters.push(search.createFilter({
                            name: "custrecord_advs_status_pif",
                            operator: search.Operator.ANYOF,
                            values: tpttstatus
                        }))
                    }
                   
                   
                    
                    var searchResultCount = transportSObj.runPaged().count;
                    log.debug("transportSObj result count", searchResultCount);
                    var transarr = [];
                    transportSObj.run().each(function (result) {
                        // .run().each has a limit of 4,000 results
                        var obj = {};

                        obj.custpage_tpt_edit = '<a href="#" onclick="edittransportsheet(' + result.id + ')"> <i class="fa fa-edit" style="color:blue;"</i></a>';
                       
                       
                        obj.custpage_tpt_statusid = result.getValue({
                            name: 'custrecord_advs_status_pif'
                        }) || '';
                        obj.custpage_tpt_status = result.getText({
                            name: 'custrecord_advs_status_pif'
                        }) || '';
                      
                        obj.custpage_tpt_notes_icon =  '<a href="#" onclick="shownotestransportsheet(' + result.id + ')"> <i class="fa fa-comment" style="color:blue;"</i></a>';
                      
                        obj.custpage_tpt_vin = result.getValue({
                            name: 'custrecord_advs_pif_vin'
                        }) || '';

                        obj.custpage_tpt_lessee = result.getValue({
                            name: 'custrecord_advs_lessee_name_pif'
                        }) || '';
                        obj.custpage_tpt_lease = result.getValue({
                            name: 'custrecord_advs_pif_lease'
                        }) || '';
                        obj.custpage_tpt_bsd = result.getValue({
                            name: 'custrecord_advs_pif_bos'
                        }) || '';
                        obj.custpage_tpt_price = result.getValue({
                            name: 'custrecord_advs_purchase_pif'
                        }) || '';
                        obj.custpage_tpt_amt = result.getValue({
                            name: 'custrecord_advs_sales_tax_pif'
                        }) || '';
                        obj.custpage_tpt_catalog = result.getValue({
                            name: 'custrecord_advs_catalog_numb_pif'
                        }) || '';
                        obj.custpage_tpt_restriction = result.getValue({
                            name: 'custrecord_advs_title_res_pif'
                        }) || '';
                        obj.custpage_tpt_dsc = result.getValue({
                            name: 'custrecord_advs_date_sent_pif'
                        }) || '';

                        obj.custpage_tpt_transfertype = result.getValue({
                            name: 'custrecord_advs_transfer_type_pif'
                        }) || '';
                        obj.custpage_tpt_tracking = result.getValue({
                            name: 'custrecord_advs_track_num_pif'
                        }) || '';
                       
                       
                       
                        transarr.push(obj);
                        return true;
                    });
                    // log.debug('transarr', transarr);
                    return transarr;
                } catch (e) {
                    log.debug('error in getTransportLines', e.toString());
                }
            }

         

        }
      
        return {
            onRequest
        }

    });
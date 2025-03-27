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
                    title: "Transport"
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
                var filterGptpt = form.addFieldGroup({
                    id: "custpage_fil_gp_tpt",
                    label: "Filters"
                });
                var summaryGptpt = form.addFieldGroup({
                    id: "custpage_fil_gp_tpt_smry",
                    label: "Summary"
                });
                var pendingpickupresults = getSummaryPendingPickup();
                var pendingintransitresults = getSummaryintransit();
                var pendingpickuphtml = generateHTML(pendingpickupresults,pendingintransitresults);
                //var pendingintransithtml = generateHTML(pendingintransitresults,'Pending Intransit');
                addSummaryField(form, 'summary1', 'Pending Pickup',pendingpickuphtml,'custpage_fil_gp_tpt_smry');
                //addSummaryField(form, 'summary2', 'In-Transit',pendingintransithtml,'custpage_fil_gp_tpt_smry');


                //FITLERS DATA AND HIDING FIELD
                var filterFldObj = form.addField({
                    id: "custpage_filter_params",
                    type: serverWidget.FieldType.TEXT,
                    label: "filtersparam",
                    container: "custpage_fil_gp_tpt"
                });
                filterFldObj.defaultValue = filtersparam;
                filterFldObj.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.HIDDEN
                });

                //////////////////////TRANSPORT FILTERS///////////////////////
                transportFilters(form, tpttstatus, tptstatus, tptfloc, tpttloc, tptstock,filtersparam);
                //////////////////////TRANSPORT FILTERS///////////////////////

                var transportDboardFields = transportFields();
                var TransportsublistObj = renderFields(transportDboardFields, 'custpage_fil_gp_tpt', form);
                var transportNotes = getTransportNotesData();
                var transportdata = getTransportLines(tpttstatus, tptstatus, tptfloc, tpttloc, tptstock);
                setTransportSublistData(transportdata, TransportsublistObj, transportDboardFields, transportNotes);

                //BUTTONS ON THE DASHBOARD
                form.addButton({
                    id: 'custpage_open_filtersetup',
                    label: 'Filters',
                    functionName: 'openfiltersetup(' + Userid + ',"' + scriptId + '")'
                });
                form.addButton({
                    id: 'custpage_clear_filters',
                    label: 'Clear Filters',
                    functionName: 'resetFilters(' + Userid + ')'
                });

              log.debug('userid',Userid)
                form.clientScriptModulePath = "SuiteScripts/Advectus/advs_cs_transport_dashboard.js";
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

                    }, {
                        "fieldlabel": "Truck Status id",
                        "fieldid": "custpage_tpt_truckstatus",
                        "fieldtype": "TEXT",
                        "fieldsource": "",
                        "rolerestiction": "",
                        "displaytype": "HIDDEN",

                    },
                        {
                            "fieldlabel": "Truck Status",
                            "fieldid": "custpage_tpt_truckstatus_text",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Status id",
                            "fieldid": "custpage_tpt_modulestatus",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "HIDDEN",

                        },
                        {
                            "fieldlabel": "Status",
                            "fieldid": "custpage_tpt_modulestatus_text",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Stock #",
                            "fieldid": "custpage_tpt_stock",
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
                            "fieldlabel": "Transport Company",
                            "fieldid": "custpage_tpt_transport_company",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Location From",
                            "fieldid": "custpage_tpt_locationfrom",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Location To",
                            "fieldid": "custpage_tpt_locationto",
                            "fieldtype": "TEXT",
                            "fieldsource": "location",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Date Assigned",
                            "fieldid": "custpage_tpt_dateassigned",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Date Onsite",
                            "fieldid": "custpage_tpt_onsite",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "History",
                            "fieldid": "custpage_tpt_history",
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
                            "displaytype": "HIDDEN",

                        },
                        {
                            "fieldlabel": "TPTID",
                            "fieldid": "custpage_tpt_id",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "HIDDEN",

                        }
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


                                //FieldIDARR.push(fieldsobja);

                                /* if (fieldsarr[i].displaytype != '') {
                                  fieldsobja.updateDisplayType({
                                    displayType: serverWidget.FieldDisplayType[fieldsarr[i].displaytype]
                                  }); //displaytype
                                } */
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
                        type: "customrecord_advs_transport_dashb",
                        filters: [
                            ["isinactive", "is", "F"]
                            /*"AND",
                            ["custrecord_advs_transport_status_dash", "noneof", "11"]*/
                        ],
                        columns: [
                            "custrecord_advs_truck_status_transport",
                            "custrecord_advs_transport_status_dash",
                            "custrecord_advs_stock_number_transport",
                            "custrecord_advs_transport_notes",
                            "custrecord_advs_transport_fromlocation",
                            "custrecord_advs_transport_location_to",
                            "custrecord_advs_date_assigned_transport",
                            "custrecord_advs_date_on_site_transpo",
                            "custrecord_vin_link",
                            "internalid",
                            "custrecord_advs_transport_comp"
                        ]
                    });
                    log.debug('tpttstatus', tpttstatus);
                    if (tpttstatus != '') {
                        transportSObj.filters.push(search.createFilter({
                            name: "custrecord_advs_truck_status_transport",
                            operator: search.Operator.ANYOF,
                            values: tpttstatus
                        }))
                    }
                    if (tptstatus != '') {
                        transportSObj.filters.push(search.createFilter({
                            name: "custrecord_advs_transport_status_dash",
                            operator: search.Operator.ANYOF,
                            values: tptstatus
                        }))
                    }
                    if (tptfloc != '') {
                        transportSObj.filters.push(search.createFilter({
                            name: "custrecord_advs_transport_fromlocation",
                            operator: search.Operator.ANYOF,
                            values: tptfloc
                        }))
                    }
                    if (tpttloc != '') {
                        transportSObj.filters.push(search.createFilter({
                            name: "custrecord_advs_transport_location_to",
                            operator: search.Operator.ANYOF,
                            values: tpttloc
                        }))
                    }
                    if (tptstock != '') {
                        transportSObj.filters.push(search.createFilter({
                            name: "custrecord_advs_stock_number_transport",
                            operator: search.Operator.IS,
                            values: tptstock
                        }))
                    }
                    var searchResultCount = transportSObj.runPaged().count;
                    log.debug("transportSObj result count", searchResultCount);
                    var transarr = [];
                    transportSObj.run().each(function (result) {
                        // .run().each has a limit of 4,000 results
                        var obj = {};

                        obj.custpage_tpt_edit = '<a href="#" onclick="edittransportsheet(' + result.id + ')"> <i class="fa fa-edit" style="color:blue;"</i></a>';
                        obj.custpage_tpt_truckstatus = result.getValue({
                            name: 'custrecord_advs_truck_status_transport'
                        }) || '';
                        obj.custpage_tpt_truckstatus_text = result.getText({
                            name: 'custrecord_advs_truck_status_transport'
                        }) || '';
                        obj.custpage_tpt_modulestatus = result.getValue({
                            name: 'custrecord_advs_transport_status_dash'
                        }) || '';
                        obj.custpage_tpt_modulestatus_text = result.getText({
                            name: 'custrecord_advs_transport_status_dash'
                        }) || '';
                        obj.custpage_tpt_stock = result.getValue({
                            name: 'custrecord_advs_stock_number_transport'
                        }) || '';
                        obj.custpage_tpt_notes_icon =  '<a href="#" onclick="shownotestransportsheet(' + result.id + ')"> <i class="fa fa-comment" style="color:blue;"</i></a>';
                        obj.custpage_tpt_locationfrom = result.getText({
                            name: 'custrecord_advs_transport_fromlocation'
                        }) || '';
                        obj.custpage_tpt_locationto = result.getText({
                            name: 'custrecord_advs_transport_location_to'
                        }) || '';
                        obj.custpage_tpt_dateassigned = result.getValue({
                            name: 'custrecord_advs_date_assigned_transport'
                        }) || '';
                        obj.custpage_tpt_onsite = result.getValue({
                            name: 'custrecord_advs_date_on_site_transpo'
                        }) || '';
                        obj.custpage_tpt_vin = result.getValue({
                            name: 'custrecord_vin_link'
                        }) || '';
                        obj.custpage_tpt_transport_company = result.getText({
                            name: 'custrecord_advs_transport_comp'
                        }) || '';
                        obj.custpage_tpt_history ='<a href="#" onclick="showhistorytransportsheet(' + result.id + ')"> <i class="fa fa-history" style="color:blue;"</i></a>';
                        obj.custpage_tpt_id = result.id || '';
                        transarr.push(obj);
                        return true;
                    });
                    // log.debug('transarr', transarr);
                    return transarr;
                } catch (e) {
                    log.debug('error in getTransportLines', e.toString());
                }
            }

            function transportFilters(form, tpttstatus, tptstatus, tptfloc, tpttloc, tptstock,filtersparam) {
                try {
                    if(filtersparam.includes(61)){
                        var tptTruckStatusFldObj = form.addField({
                            id: "custpage_tpt_truckstatusf",
                            type: serverWidget.FieldType.SELECT,
                            label: "Truck Status",
                            source: "customlist_advs_reservation_status",
                            container: "custpage_fil_gp_tpt"
                        });
                        if (tpttstatus != "" && tpttstatus != undefined && tpttstatus != null) {
                            log.debug('tpttstatus',tpttstatus);
                            tptTruckStatusFldObj.defaultValue = tpttstatus
                        }
                    }
                    if(filtersparam.includes(62)){
                        var tptStatusFldObj = form.addField({
                            id: "custpage_tpt_statusf",
                            type: serverWidget.FieldType.SELECT,
                            label: "Status",
                            source: "customlist_advs_transport_status_list",
                            container: "custpage_fil_gp_tpt"
                        });
                        if (tptstatus != "" && tptstatus != undefined && tptstatus != null) {
                            tptStatusFldObj.defaultValue = tptstatus
                        }
                    }

                    if(filtersparam.includes(63)){
                        var tptfromlocFldObj = form.addField({
                            id: "custpage_tpt_flocf",
                            type: serverWidget.FieldType.SELECT,
                            label: "From Location",
                            source: "customrecord_advs_loct_from_transport",
                            container: "custpage_fil_gp_tpt"
                        });
                        if (tptfloc != "" && tptfloc != undefined && tptfloc != null) {
                            tptfromlocFldObj.defaultValue = tptfloc
                        }
                    }

                    if(filtersparam.includes(64)){
                        var tpttolocFldObj = form.addField({
                            id: "custpage_tpt_tlocf",
                            type: serverWidget.FieldType.SELECT,
                            label: "To Location",
                            source: "customrecord_advs_transport_loc_to",
                            container: "custpage_fil_gp_tpt"
                        });
                        if (tpttloc != "" && tpttloc != undefined && tpttloc != null) {
                            tpttolocFldObj.defaultValue = tpttloc
                        }
                    }

                    if(filtersparam.includes(65)){
                        var tptstockFldObj = form.addField({
                            id: "custpage_tpt_stockf",
                            type: serverWidget.FieldType.TEXT,
                            label: "Stock",
                            source: "",
                            container: "custpage_fil_gp_tpt"
                        });
                        if (tptstock != "" && tptstock != undefined && tptstock != null) {
                            tptstockFldObj.defaultValue = tptstock
                        }
                    }


                    var tptECFldObj = form.addField({
                        id: "custpage_tpt_excludecomplete",
                        type: serverWidget.FieldType.CHECKBOX,
                        label: "Exclude Complete",
                        source: "",
                        container: "custpage_fil_gp_tpt"
                    });

                } catch (e) {
                    log.debug('error in transportFilters', e.toString());
                }
            }

            function getTransportNotesData() {
                try {
                    var NoteDataforRep = [];
                    var InsuranceNotesSearchObj = search.create({
                        type: "customrecord_advs_transport_notes",
                        filters: [
                            ["isinactive", "is", "F"],
                            "AND",
                            ["custrecord_advs_tpt_note_parent_link", "noneof", "@NONE@"]
                        ],
                        columns: [
                            search.createColumn({
                                name: "custrecord_advs_tpt_note_date_time"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_tpt_note_notes"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_tpt_note_parent_link"
                            })
                        ]
                    });
                    var Len = 0;
                    InsuranceNotesSearchObj.run().each(function (result) {
                        var tptId = result.getValue('custrecord_advs_tpt_note_parent_link');
                        var DateTime = result.getValue('custrecord_advs_tpt_note_date_time');
                        var Notes = result.getValue('custrecord_advs_tpt_note_notes');
                        if (NoteDataforRep[tptId] != null && NoteDataforRep[tptId] != undefined) {
                            Len = NoteDataforRep[tptId].length;
                        } else {
                            NoteDataforRep[tptId] = new Array();
                            Len = 0;
                        }
                        NoteDataforRep[tptId][Len] = new Array();
                        NoteDataforRep[tptId][Len]['DateTime'] = DateTime;
                        NoteDataforRep[tptId][Len]['Notes'] = Notes;
                        return true;
                    });
                    // log.debug('NoteDataforRep',NoteDataforRep);
                    return NoteDataforRep;
                } catch (e) {
                    log.debug('error in getTransportNotesData', e.toString())
                }

            }

        }
        function addSummaryField(form, id, label, value, group) {
            var field = form.addField({
                id: id,
                type: serverWidget.FieldType.INLINEHTML,
                label: label,
                container: group
            });
            field.defaultValue = value;

        }
        function getSummaryPendingPickup()
        {
            var results = [];
            try{
                var customrecord_advs_transport_dashbSearchObj = search.create({
                    type: "customrecord_advs_transport_dashb",
                    filters:
                        [
                            ["isinactive","is","F"],
                            "AND",
                            ["custrecord_advs_transport_status_dash","anyof","1","2","13"]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "custrecord_advs_transport_fromlocation",
                                summary: "GROUP"
                            }),
                            search.createColumn({
                                name: "internalid",
                                summary: "COUNT"
                            })
                        ]
                });

                customrecord_advs_transport_dashbSearchObj.run().each(function(result){
                    // .run().each has a limit of 4,000 results
                    results.push({
                        location: result.getText({ name: "custrecord_advs_transport_fromlocation", summary: "GROUP" }),
                        count: result.getValue({ name: "internalid", summary: "COUNT" })
                    });
                    return true;
                });
        return results;

            }catch (e)
            {
                log.debug('error in getSummaryPendingPickup',e.toString());
            }
        }
        function getSummaryintransit()
        {
            var results = [];
            var customrecord_advs_transport_dashbSearchObj = search.create({
                type: "customrecord_advs_transport_dashb",
                filters:
                    [
                        ["isinactive","is","F"],
                        "AND",
                        ["custrecord_advs_transport_status_dash","anyof","10","11","12"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_advs_transport_location_to",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "internalid",
                            summary: "COUNT"
                        })
                    ]
            });
             customrecord_advs_transport_dashbSearchObj.run().each(function(result){
                 results.push({
                     location: result.getText({ name: "custrecord_advs_transport_location_to", summary: "GROUP" }),
                     count: result.getValue({ name: "internalid", summary: "COUNT" })
                 });
                return true;
            });

return results;
        }

        function generateHTML(searchResults,searchResults2) {
            var html = '';

            html += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">';
            html+='<style>.custom-table-container { display: inline-flex; margin: 0px; }</style>';
            html += '<div class=" container  mt-4 custom-table-container">';
            html+='<div class="col-md-6">';
            html += '<h2 class="mb-3">Pending Pickup</h2>';
            html += '<table class="table table-bordered table-striped">';
            html += '<thead class="table-dark"><tr><th>Location</th><th>Count</th></tr></thead><tbody>';

            if (searchResults.length > 0) {
                for (var i = 0; i < searchResults.length; i++) {
                    html += '<tr>';
                    if(searchResults[i].location=='- None -'){
                        html += '<td>All Other</td>';
                    }else{
                        html += '<td>' + searchResults[i].location + '</td>';
                    }

                    html += '<td>' + searchResults[i].count + '</td>';
                    html += '</tr>';
                }
            } else {
                html += '<tr><td colspan="2" class="text-center">No data available</td></tr>';
            }

            html += '</tbody></table>';
            html+='</div>';
            html+='<div class="col-md-6" style="margin-left: 4px;">';
            html += '<h2 class="mb-3">In-Transit</h2>';
            html += '<table class="table table-bordered table-striped">';
            html += '<thead class="table-dark"><tr><th>Location</th><th>Count</th></tr></thead><tbody>';

            if (searchResults2.length > 0) {
                for (var i = 0; i < searchResults2.length; i++) {
                    html += '<tr>';
                    if(searchResults2[i].location=='- None -'){
                        html += '<td>All Other</td>';
                    }else{
                        html += '<td>' + searchResults2[i].location + '</td>';
                    }

                    html += '<td>' + searchResults2[i].count + '</td>';
                    html += '</tr>';
                }
            } else {
                html += '<tr><td colspan="2" class="text-center">No data available</td></tr>';
            }

            html += '</tbody></table>';
            html+='</div>';
            html += '</div>';

            return html;
        }
        return {
            onRequest
        }

    });
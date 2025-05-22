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
                    title: "Paid in Full"
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
                var piftstatus, pifstatus, piffloc, piftloc, pifstock = '';
                piftstatus = request.parameters.piftstatus || '';
                pifstatus = request.parameters.pifstatus || '';
                piffloc = request.parameters.piffloc || '';
                piftloc = request.parameters.piftloc || '';
                pifstock = request.parameters.pifstock || '';

                 var _inventorymodulelib = inventorymodulelib.jsscriptlib(form);
                //FIELD GROUP
                var filterGppif = form.addFieldGroup({
                    id: "custpage_fil_gp_pif",
                    label: "Filters"
                });
                var summaryGppif = form.addFieldGroup({
                    id: "custpage_fil_gp_pif_smry",
                    label: "Summary"
                });
                //var pendingpickupresults = getSummaryPendingPickup();
                //var pendingintransitresults = getSummaryintransit();
                //var pendingpickuphtml = generateHTML(pendingpickupresults,pendingintransitresults);
                //var pendingintransithtml = generateHTML(pendingintransitresults,'Pending Intransit');
                //addSummaryField(form, 'summary1', 'Pending Pickup',pendingpickuphtml,'custpage_fil_gp_pif_smry');
                //addSummaryField(form, 'summary2', 'In-Transit',pendingintransithtml,'custpage_fil_gp_pif_smry');


               

                //FITLERS DATA AND HIDING FIELD
                var filterFldObj = form.addField({
                    id: "custpage_filter_params",
                    type: serverWidget.FieldType.TEXT,
                    label: "filtersparam",
                    container: "custpage_fil_gp_pif"
                });
                filterFldObj.defaultValue = filtersparam;
                filterFldObj.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.HIDDEN
                });

                //////////////////////paidinfull FILTERS///////////////////////
                paidinfullFilters(form, piftstatus, pifstatus, piffloc, piftloc, pifstock,filtersparam);
               
                //////////////////////paidinfull FILTERS///////////////////////

                var paidinfullDboardFields = paidinfullFields();
                var paidinfullsublistObj = renderFields(paidinfullDboardFields, 'custpage_fil_gp_pif', form);
                var paidinfullNotes = getpaidinfullNotesData();
                var paidinfulldata = getpaidinfullLines(piftstatus, pifstatus, piffloc, piftloc, pifstock);
                setpaidinfullSublistData(paidinfulldata, paidinfullsublistObj, paidinfullDboardFields, paidinfullNotes);

                //BUTTONS ON THE DASHBOARD
               /* form.addButton({
                    id: 'custpage_open_filtersetup',
                    label: 'Filters',
                    functionName: 'openfiltersetup(' + Userid + ',"' + scriptId + '")'
                });
                form.addButton({
                    id: 'custpage_clear_filters',
                    label: 'Clear Filters',
                    functionName: 'resetFilters(' + Userid + ')'
                });*/
                log.debug('userid',Userid)
               // form.clientScriptModulePath = "SuiteScripts/Advectus/advs_cs_paidinfull_dashboard.js";
               
                response.writePage(form);
            }

            function paidinfullFields() {
                try {
                    var arr = [{
                        "fieldlabel": "Edit",
                        "fieldid": "custpage_pif_edit",
                        "fieldtype": "TEXT",
                        "fieldsource": "",
                        "rolerestiction": "",
                        "displaytype": "NORMAL",

                    }, 
                        {
                            "fieldlabel": "Email",
                            "fieldid": "custpage_pif_email",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Status id",
                            "fieldid": "custpage_pif_statusid",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "HIDDEN",

                        },
                        {
                            "fieldlabel": "Status",
                            "fieldid": "custpage_pif_status",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                       
                        {
                            "fieldlabel": "Notes",
                            "fieldid": "custpage_pif_notes_icon",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "VIN",
                            "fieldid": "custpage_pif_vin",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Lessee Name",
                            "fieldid": "custpage_pif_lessee",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Lease #",
                            "fieldid": "custpage_pif_lease",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Bill of Sale Date",
                            "fieldid": "custpage_pif_bsd",
                            "fieldtype": "DATE",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Purchase Price",
                            "fieldid": "custpage_pif_price",
                            "fieldtype": "CURRENCY",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Sales Tax Amt",
                            "fieldid": "custpage_pif_amt",
                            "fieldtype": "CURRENCY",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Catalog #",
                            "fieldid": "custpage_pif_catalog",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Title Restriction",
                            "fieldid": "custpage_pif_restriction",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Date Sent to Customer",
                            "fieldid": "custpage_pif_dsc",
                            "fieldtype": "DATE",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Transfer Type",
                            "fieldid": "custpage_pif_transfertype",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Tracking #",
                            "fieldid": "custpage_pif_tracking",
                            "fieldtype": "TEXT",
                            "fieldsource": "",
                            "rolerestiction": "",
                            "displaytype": "NORMAL",

                        },
                        {
                            "fieldlabel": "Truck Master Status",
                            "fieldid": "custpage_pif_truck_status",
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
                    var paidinfullsublist = form.addSublist({
                        id: "custpage_sublist_paidinfull",
                        type: serverWidget.SublistType.LIST,
                        label: "List"
                    });
                    for (var i = 0; i < fieldsarr.length; i++) {
                        try {

                            if (fieldsarr[i].rolerestiction == '' || role == fieldsarr[i].rolerestiction) {
                                var fieldsobja = paidinfullsublist.addField({
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
                    return paidinfullsublist;
                } catch (e) {
                    log.debug('errr in render fields', e.toString())
                }
            }
            function setpaidinfullSublistData(data, sublist, fields, paidinfullNotes) {
                try {
                    //log.debug('data', data);
                    var arrkeys = Object.keys(data[0]);
                    var count = 0;

                    for (var f = 0; f < data.length; f++) {
                        for (var t = 0; t < arrkeys.length; t++) {
                            if (data[f][arrkeys[t]] != '') {
                                if (arrkeys[t] == 'custpage_pif_notes') {
                                    var pifid = data[f]['custpage_pif_id'];

                                    var NotespifArr = [];
                                    if (paidinfullNotes[pifid] != null && paidinfullNotes[pifid] != undefined) {
                                        var Length = paidinfullNotes[pifid].length;
                                        for (var Len = 0; Len < Length; Len++) {
                                            if (paidinfullNotes[pifid][Len] != null && paidinfullNotes[pifid][Len] != undefined) {
                                                var DateTime = paidinfullNotes[pifid][Len]['DateTime'];
                                                var Notes = paidinfullNotes[pifid][Len]['Notes'];
                                                var DataStore = DateTime + '-' + Notes;
                                                NotespifArr.push(DataStore);
                                            }
                                        }
                                    }
                                    sublist.setSublistValue({
                                        id: arrkeys[t],
                                        line: count,
                                        value: NotespifArr
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
                    log.debug('error in setpaidinfullSublistData', e.toString());
                }
            }
            function getpaidinfullLines(piftstatus, pifstatus, piffloc, piftloc, pifstock) {
                try {
                    var paidinfullSObj = search.create({
                        type: "customrecord_advs_paid_in_full",
                        filters: [
                            ["isinactive", "is", "F"]
                            /*"AND",
                            ["custrecord_advs_paidinfull_status_dash", "noneof", "11"]*/
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
                            "custrecord_advs_track_num_pif",
                            search.createColumn({
                                name: "custrecord_advs_truck_master_status",
                                join: "CUSTRECORD_ADVS_PIF_VIN"
                            })
                        ]
                    });
                    log.debug('piftstatus', piftstatus);
                    if (piftstatus != '') {
                        paidinfullSObj.filters.push(search.createFilter({
                            name: "custrecord_advs_status_pif",
                            operator: search.Operator.ANYOF,
                            values: piftstatus
                        }))
                    }
                   
                   
                    
                    var searchResultCount = paidinfullSObj.runPaged().count;
                    log.debug("paidinfullSObj result count", searchResultCount);
                    var transarr = [];
                    paidinfullSObj.run().each(function (result) {
                        // .run().each has a limit of 4,000 results
                        var obj = {};

                        obj.custpage_pif_edit = '<a href="#" onclick="editpaidinfullsheet(' + result.id + ')"> <i class="fa fa-edit" style="color:blue;"</i></a>';
                       
                       
                        obj.custpage_pif_statusid = result.getValue({
                            name: 'custrecord_advs_status_pif'
                        }) || '';
                        obj.custpage_pif_status = result.getText({
                            name: 'custrecord_advs_status_pif'
                        }) || '';
                        obj.custpage_pif_truck_status = result.getText({
                            name: "custrecord_advs_truck_master_status",
                            join: "CUSTRECORD_ADVS_PIF_VIN"
                        }) || '';
                      
                        obj.custpage_pif_email =  '<a href="#" onclick="showemailpaidinfullsheet(' + result.id + ')"> <i class="fa fa-envelope" style="color:blue;"</i></a>';
                        obj.custpage_pif_notes_icon =  '<a href="#" onclick="shownotespaidinfullsheet(' + result.id + ')"> <i class="fa fa-comment" style="color:blue;"</i></a>';

                        obj.custpage_pif_vin = result.getText({
                            name: 'custrecord_advs_pif_vin'
                        }) || '';

                        obj.custpage_pif_lessee = result.getText({
                            name: 'custrecord_advs_lessee_name_pif'
                        }) || '';
                        obj.custpage_pif_lease = result.getText({
                            name: 'custrecord_advs_pif_lease'
                        }) || '';
                        obj.custpage_pif_bsd = result.getValue({
                            name: 'custrecord_advs_pif_bos'
                        }) || '';
                        obj.custpage_pif_price = result.getValue({
                            name: 'custrecord_advs_purchase_pif'
                        }) || '';
                        obj.custpage_pif_amt = result.getValue({
                            name: 'custrecord_advs_sales_tax_pif'
                        }) || '';
                        obj.custpage_pif_catalog = result.getValue({
                            name: 'custrecord_advs_catalog_numb_pif'
                        }) || '';
                        obj.custpage_pif_restriction = result.getText({
                            name: 'custrecord_advs_title_res_pif'
                        }) || '';
                        obj.custpage_pif_dsc = result.getValue({
                            name: 'custrecord_advs_date_sent_pif'
                        }) || '';

                        obj.custpage_pif_transfertype = result.getText({
                            name: 'custrecord_advs_transfer_type_pif'
                        }) || '';
                        obj.custpage_pif_tracking = result.getValue({
                            name: 'custrecord_advs_track_num_pif'
                        }) || '';
                       
                       
                       
                        transarr.push(obj);
                        return true;
                    });
                    // log.debug('transarr', transarr);
                    return transarr;
                } catch (e) {
                    log.debug('error in getpaidinfullLines', e.toString());
                }
            }
            function paidinfullFilters(form, piftstatus, pifstatus, piffloc, piftloc, pifstock,filtersparam) {
                try {
                    if(filtersparam.includes(1)){
                        var pifTruckStatusFldObj = form.addField({
                            id: "custpage_pif_truckstatusf",
                            type: serverWidget.FieldType.SELECT,
                            label: "PIF Status",
                            source: "",
                            container: "custpage_fil_gp_pif"
                        });
                       
                    }
                    if(filtersparam.includes(2)){
                        var pifStatusFldObj = form.addField({
                            id: "custpage_pif_statusf",
                            type: serverWidget.FieldType.SELECT,
                            label: "VIN",
                            source: "",
                            container: "custpage_fil_gp_pif"
                        });
                        if (pifstatus != "" && pifstatus != undefined && pifstatus != null) {
                            pifStatusFldObj.defaultValue = pifstatus
                        }
                    }

                    if(filtersparam.includes(3)){
                        var piffromlocFldObj = form.addField({
                            id: "custpage_pif_flocf",
                            type: serverWidget.FieldType.SELECT,
                            label: "Lessee",
                            source: "",
                            container: "custpage_fil_gp_pif"
                        });
                        // if (piffloc != "" && piffloc != undefined && piffloc != null) {
                        //     piffromlocFldObj.defaultValue = piffloc
                        // }
                    }

                    if(filtersparam.includes(4)){
                        var piftolocFldObj = form.addField({
                            id: "custpage_pif_tlocf",
                            type: serverWidget.FieldType.SELECT,
                            label: "Transfer Type",
                            source: "",
                            container: "custpage_fil_gp_pif"
                        });
                        // if (piftloc != "" && piftloc != undefined && piftloc != null) {
                        //     piftolocFldObj.defaultValue = piftloc
                        // }
                    }

                    // if(filtersparam.includes(65)){
                    //     var pifstockFldObj = form.addField({
                    //         id: "custpage_pif_stockf",
                    //         type: serverWidget.FieldType.TEXT,
                    //         label: "Stock",
                    //         source: "",
                    //         container: "custpage_fil_gp_pif"
                    //     });
                    //     if (pifstock != "" && pifstock != undefined && pifstock != null) {
                    //         pifstockFldObj.defaultValue = pifstock
                    //     }
                    // }


                    // var pifECFldObj = form.addField({
                    //     id: "custpage_pif_excludecomplete",
                    //     type: serverWidget.FieldType.CHECKBOX,
                    //     label: "Exclude Complete",
                    //     source: "",
                    //     container: "custpage_fil_gp_pif"
                    // });

                } catch (e) {
                    log.debug('error in paidinfullFilters', e.toString());
                }
            }
            function getpaidinfullNotesData() {
                try {
                    var NoteDataforRep = [];
                    var InsuranceNotesSearchObj = search.create({
                        type: "customrecord_advs_paidinfull_notes",
                        filters: [
                            ["isinactive", "is", "F"],
                            "AND",
                            ["custrecord_advs_pif_note_parent_link", "noneof", "@NONE@"]
                        ],
                        columns: [
                            search.createColumn({
                                name: "custrecord_advs_pif_note_date_time"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_pif_note_notes"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_pif_note_parent_link"
                            })
                        ]
                    });
                    var Len = 0;
                    InsuranceNotesSearchObj.run().each(function (result) {
                        var pifId = result.getValue('custrecord_advs_pif_note_parent_link');
                        var DateTime = result.getValue('custrecord_advs_pif_note_date_time');
                        var Notes = result.getValue('custrecord_advs_pif_note_notes');
                        if (NoteDataforRep[pifId] != null && NoteDataforRep[pifId] != undefined) {
                            Len = NoteDataforRep[pifId].length;
                        } else {
                            NoteDataforRep[pifId] = new Array();
                            Len = 0;
                        }
                        NoteDataforRep[pifId][Len] = new Array();
                        NoteDataforRep[pifId][Len]['DateTime'] = DateTime;
                        NoteDataforRep[pifId][Len]['Notes'] = Notes;
                        return true;
                    });
                    // log.debug('NoteDataforRep',NoteDataforRep);
                    return NoteDataforRep;
                } catch (e) {
                    log.debug('error in getpaidinfullNotesData', e.toString())
                }

            }

        }

      
        return {
            onRequest
        }

    });
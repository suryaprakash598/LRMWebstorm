/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget','N/url', 'N/format','N/runtime','SuiteScripts/Advectus/inventorymodulelib.js'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget, url, format,runtime,inventorymodulelib) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                var request = scriptContext.request;
                var response = scriptContext.response;

                if (request.method == "GET") {

                    var form = serverWidget.createForm({
                        title: "Insurance Claim Sheet "
                    });
                    var _inventorymodulelib = inventorymodulelib.jsscriptlib(form);
                    var currScriptObj = runtime.getCurrentScript();
                    var UserObj = runtime.getCurrentUser();
                    var UserSubsidiary = UserObj.subsidiary;
                    var UserLocation = UserObj.location;
                    var Userid = UserObj.id;

                    var ins_sts = request.parameters.ins_sts || '';
                    var vinID = request.parameters.unitvin || '';
                    var _vinText = request.parameters.unitvintext || '';

                    var insclaimsublist = createInsClaimSublist(form);
                    searchForclaimData(insclaimsublist, vinID, _vinText, ins_sts);
                    getInsClaimColCodes();
                    form.clientScriptModulePath = "./Advectus/advs_cs_insurance_claim.js";
                    response.writePage(form);
                }
            }catch (e)
            {
                log.debug('error',e.toString());
            }
        }
        var InsClaimColorArr = new Array();

        function getInsClaimColCodes() {
            var customrecord_auction_statusSearchObj = search.create({
                type: "customrecord_advs_claim_status",
                filters: [
                    ["isinactive", "is", "F"]
                ],
                columns: [
                    search.createColumn({
                        name: "internalid",
                        label: "Internal ID"
                    }),
                    search.createColumn({
                        name: "name",
                        label: "Name"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_claim_st_bg_color",
                        label: "Background color"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_claim_st_text_color",
                        label: "Text color"
                    })
                ]
            });

            customrecord_auction_statusSearchObj.run().each(function (result) {
                var StatusID = result.getValue('internalid');
                var name = result.getValue('name');
                var bgcolor = result.getValue('custrecord_advs_claim_st_bg_color');
                var textcolor = result.getValue('custrecord_advs_claim_st_text_color');
                if (InsClaimColorArr[StatusID] != undefined && InsClaimColorArr[StatusID] != null) {} else {
                    InsClaimColorArr[StatusID] = new Array;
                    InsClaimColorArr[StatusID]['name'] = name;
                    InsClaimColorArr[StatusID]['bgcolor'] = bgcolor;
                    InsClaimColorArr[StatusID]['textcolor'] = textcolor;
                }
                return true;
            });
        }
        function createInsClaimSublist(form) {
            try {
                var sublistclaim = form.addSublist({
                    id: "custpage_sublist_custpage_subtab_insur_claim",
                    type: serverWidget.SublistType.LIST,
                    label: "List",
                    tab: "custpage_claim_tab"
                });
                sublistclaim.addButton({
                    id: 'claimform',
                    label: 'Claim',
                    functionName: 'opennewclaim()'
                });
                sublistclaim.addField({
                    id: 'cust_fi_editclaim',
                    type: serverWidget.FieldType.TEXT,
                    label: 'EDIT'
                });

                sublistclaim.addField({
                    id: 'cust_fi_truckstatus_claim',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Truck Status'
                });
                sublistclaim.addField({
                    id: 'cust_fi_status_claim',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Claim Status'
                });
                sublistclaim.addField({
                    id: 'cust_fi_f_l_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Lesse Name'
                });
                sublistclaim.addField({
                    id: 'cust_fi_list_stock_number',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Stock #'
                });
                sublistclaim.addField({
                    id: 'cust_fi_notes',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'Notes'
                });
                sublistclaim.addField({
                    id: 'cust_fi_list_lease_no',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Lease #'
                }).updateDisplayType({
                    displayType: "hidden"
                });
                sublistclaim.addField({
                    id: 'cust_fi_dateofloss',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Date of Loss'
                });
                sublistclaim.addField({
                    id: 'cust_fi_desc_accident',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Description of Claim'
                });
                sublistclaim.addField({
                    id: 'cust_fi_insurance_company',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Insurance Company'
                });
                sublistclaim.addField({
                    id: 'cust_fi_claim_filed',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Claim Filed'
                });

                sublistclaim.addField({
                    id: 'cust_fi_ins_doc',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Claim #'
                });
                sublistclaim.addField({
                    id: 'cust_fi_adjuster_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Adjuster Name'
                });
                sublistclaim.addField({
                    id: 'cust_fi_adjuster_phone',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Adjuster Phone'
                });
                sublistclaim.addField({
                    id: 'cust_fi_adjuster_email',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Adjuster Email'
                });
                sublistclaim.addField({
                    id: 'cust_fi_repairable',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Unit Condition'
                });
                sublistclaim.addField({
                    id: 'cust_fi_veh_loc',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Unit Location'
                });
                sublistclaim.addField({
                    id: 'cust_fi_in_tow_yard',
                    type: serverWidget.FieldType.TEXT,
                    label: 'In Tow Yard'
                });
                sublistclaim.addField({
                    id: 'cust_fi_shop_contact',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Shop Contact'
                });
                sublistclaim.addField({
                    id: 'cust_fi_folowup',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Next Followup'
                });
                // sublistclaim.addField({ id: 'cust_fi_ins_from',  type: serverWidget.FieldType.TEXT, label: 'Insurance From' });

                return sublistclaim;
            } catch (e) {
                log.debug('error in createInsClaimSublist', e.toString());
            }
        }

        function searchForclaimData(insueclaim_sublist, vinID, _vinText, ins_sts) {
            try {
                getInsuaranceNotesData();
                var ClaimSheetSearchObj = search.create({
                    type: "customrecord_advs_insurance_claim_sheet",
                    filters: [
                        ["isinactive", "is", "F"],
                        /* "AND",
                         ["custrecord_claim_settled","is","F"]*/
                    ],
                    columns: [
                        "custrecord_advs_ic_name",
                        "custrecord_advs_claim_status",
                        search.createColumn({
                            name: 'custrecord_advs_em_serial_number',
                            join: 'custrecord_advs_ic_vin_number'
                        }),
                        search.createColumn({
                            name: 'custrecord_advs_vm_reservation_status',
                            join: 'custrecord_advs_ic_vin_number'
                        }),
                        "custrecord_ic_date_of_loss",
                        "custrecord_ic_description_accident",
                        "custrecord_ic_claim_field",
                        "custrecord_advs_ic_insurance_company",
                        "custrecord_ic_adj_name_number",
                        "custrecord_advs_ic_adjuster_phone",
                        "custrecord_advs_ic_adjuster_email",
                        "custrecord_ic_repairable_type",
                        "custrecord_ic_location_vehicle",
                        "custrecord_advs_ic_in_tow_yard",
                        "custrecord_advs_ic_shop_contact_info",
                        "custrecord_tickler_followup",
                        "custrecord_ic_lease",
                        "name"
                    ]
                });
                if (vinID != "" && vinID != undefined && vinID != null) {
                    ClaimSheetSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_ic_vin_number",
                        operator: search.Operator.ANYOF,
                        values: vinID
                    }))
                }
                if (_vinText != "" && _vinText != undefined && _vinText != null) {
                    ClaimSheetSearchObj.filters.push(search.createFilter({
                        name: "name",
                        join: "custrecord_advs_ic_vin_number",
                        operator: search.Operator.CONTAINS,
                        values: _vinText
                    }))
                }
                if (ins_sts != "" && ins_sts != undefined && ins_sts != null) {
                    ClaimSheetSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_claim_status",
                        operator: search.Operator.ANYOF,
                        values: ins_sts
                    }))
                }
                var count = 0;
                ClaimSheetSearchObj.run().each(function (result) {

                    var Stock_link = url.resolveRecord({
                        recordType: 'customrecord_advs_lease_header',
                        isEditMode: false
                    });
                    var claim_link = url.resolveRecord({
                        recordType: 'customrecord_advs_insurance_claim_sheet',
                        isEditMode: false
                    });

                    var stock_carr = Stock_link + '&id=' + result.getValue({
                        name: 'custrecord_ic_lease'
                    });
                    var claim_carr = claim_link + '&id=' + result.id;
                    var stockREcLink = '<a href="' + encodeURI(stock_carr) + '" target="_blank">' + encodeURI(result.getText({
                        name: 'custrecord_ic_lease'
                    })) + '</a>';
                    var claimREcLink = '<a href="' + encodeURI(claim_carr) + '" target="_blank">' + encodeURI(result.getValue({
                        name: 'name'
                    })) + '</a>';

                    var NotesArr = [];
                    var ClaimId = result.id;
                    if (NoteData[ClaimId] != null && NoteData[ClaimId] != undefined) {
                        var Length = NoteData[ClaimId].length;
                        for (var Len = 0; Len < Length; Len++) {
                            if (NoteData[ClaimId][Len] != null && NoteData[ClaimId][Len] != undefined) {
                                var DateTime = NoteData[ClaimId][Len]['DateTime'];
                                var Notes = NoteData[ClaimId][Len]['Notes'];
                                var DataStore = DateTime + '-' + Notes;
                                NotesArr.push(DataStore);
                            }
                        }
                    }

                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_f_l_name",
                        line: count,
                        value: result.getText('custrecord_advs_ic_name') || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_status_claim",
                        line: count,
                        value: result.getText({
                            name: 'custrecord_advs_claim_status'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_list_stock_number",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_advs_em_serial_number',
                            join: 'custrecord_advs_ic_vin_number'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_truckstatus_claim",
                        line: count,
                        value: result.getText({
                            name: 'custrecord_advs_vm_reservation_status',
                            join: 'custrecord_advs_ic_vin_number'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_list_lease_no",
                        line: count,
                        value: stockREcLink
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_dateofloss",
                        line: count,
                        value: result.getValue('custrecord_ic_date_of_loss') || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_desc_accident",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_ic_description_accident'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_claim_filed",
                        line: count,
                        value: result.getText({
                            name: 'custrecord_ic_claim_field'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_insurance_company",
                        line: count,
                        value: result.getText({
                            name: 'custrecord_advs_ic_insurance_company'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_ins_doc",
                        line: count,
                        value: claimREcLink
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_adjuster_name",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_ic_adj_name_number'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_adjuster_phone",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_advs_ic_adjuster_phone'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_adjuster_email",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_advs_ic_adjuster_email'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_repairable",
                        line: count,
                        value: result.getText({
                            name: 'custrecord_ic_repairable_type'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_veh_loc",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_ic_location_vehicle'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_in_tow_yard",
                        line: count,
                        value: result.getText({
                            name: 'custrecord_advs_ic_in_tow_yard'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_folowup",
                        line: count,
                        value: result.getValue({
                            name: 'custrecord_tickler_followup'
                        }) || ' '
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_notes",
                        line: count,
                        value: NotesArr
                    });
                    insueclaim_sublist.setSublistValue({
                        id: "cust_fi_editclaim",
                        line: count,
                        value: '<a href="#" onclick="editclaimsheet(' + result.id + ')"> <i class="fa fa-edit" style="color:blue;"</i></a>'
                    });

                    count++;
                    return true;
                });

            } catch (e) {
                log.debug('error in searchForclaimData', e.toString())
            }
        }
        var NoteData = [];

        function getInsuaranceNotesData() {
            var InsuranceNotesSearchObj = search.create({
                type: "customrecord_advs_insurance_notes",
                filters: [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custrecord_advs_inf_parent_link", "noneof", "@NONE@"],
                    "AND",
                    ["custrecord_advs_inf_parent_link.custrecord_claim_settled", "is", "F"]
                ],
                columns: [
                    search.createColumn({
                        name: "custrecord_advs_inf_date_time"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_inf_notes"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_inf_parent_link"
                    })
                ]
            });
            var Len = 0;
            InsuranceNotesSearchObj.run().each(function (result) {
                var ClaimId = result.getValue('custrecord_advs_inf_parent_link');
                var DateTime = result.getValue('custrecord_advs_inf_date_time');
                var Notes = result.getValue('custrecord_advs_inf_notes');
                if (NoteData[ClaimId] != null && NoteData[ClaimId] != undefined) {
                    Len = NoteData[ClaimId].length;
                } else {
                    NoteData[ClaimId] = new Array();
                    Len = 0;
                }
                NoteData[ClaimId][Len] = new Array();
                NoteData[ClaimId][Len]['DateTime'] = DateTime;
                NoteData[ClaimId][Len]['Notes'] = Notes;
                return true;
            });
        }

        return {onRequest}

    });

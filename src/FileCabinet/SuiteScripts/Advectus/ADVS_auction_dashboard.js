/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/format', 'N/runtime', 'SuiteScripts/Advectus/inventorymodulelib.js'],
    /**
     * @param{record} record
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (record, search, serverWidget, url, format, runtime, inventorymodulelib) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try {
                var request = scriptContext.request;
                var response = scriptContext.response;

                if (request.method == "GET") {

                    var form = serverWidget.createForm({
                        title: "Auction Sheet "
                    });
                    var currScriptObj = runtime.getCurrentScript();
                    var UserObj = runtime.getCurrentUser();
                    var UserSubsidiary = UserObj.subsidiary;
                    var UserLocation = UserObj.location;
                    var Userid = UserObj.id;
                    var filtersparam = request.parameters.filters || '[]';
                    var _inventorymodulelib = inventorymodulelib.jsscriptlib(form);

                    var vinID = request.parameters.unitvin || '';
                    var _vinText = request.parameters.unitvintext || '';
                    var locatId = request.parameters.locat;
                    var auc_sts = request.parameters.auc_sts || '';
                    var auc_condition = request.parameters.auc_condition || '';
                    var auc_date = request.parameters.auc_date || '';
                    var auc_cleaned = request.parameters.auc_cleaned || '';
                    var auc_vin = request.parameters.auc_vin || '';
                    var auc_loc = request.parameters.auc_loc || '';
                    var auc_ttlsent = request.parameters.auc_ttlsent || '';
                    var auc_ttlrest = request.parameters.auc_ttlrest || '';

                    var filterGpauc = form.addFieldGroup({
                        id: "custpage_fil_gp_auc",
                        label: "Filters"
                    });
                    //BUTTONS ON THE DASHBOARD
                    form.addButton({
                        id: 'custpage_open_filtersetup',
                        label: 'Filters',
                        functionName: 'openfiltersetup(' + Userid + ')'
                    });
                    form.addButton({
                        id: 'custpage_clear_filters',
                        label: 'Clear Filters',
                        functionName: 'resetFilters(' + Userid + ')'
                    });
                    //FITLERS DATA AND HIDING FIELD
                    var filterFldObj = form.addField({
                        id: "custpage_filter_params",
                        type: serverWidget.FieldType.TEXT,
                        label: "filtersparam",
                        container: "custpage_fil_gp_auc"
                    });
                    filterFldObj.defaultValue = filtersparam;
                    filterFldObj.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });


                    //AUCTION FILTERS
                    var filterObj = auctionFilters(form,filtersparam,auc_condition, auc_date, auc_cleaned,
                        auc_loc, auc_vin, vinID, locatId, _vinText, auc_sts, auc_ttlsent, auc_ttlrest);
                    //CREATE FEILDS FOR AUCTION SUBLIST
                    var auctionsublist = createAuctionSublist(form);
                   addDatatoAuction(auctionsublist, auc_condition, auc_date, auc_cleaned,
                        auc_loc, auc_vin, vinID, locatId, _vinText, auc_sts, auc_ttlsent, auc_ttlrest
                        );

                    form.clientScriptModulePath = "./advs_cs_auction_dashboard.js";
                    response.writePage(form);
                }
            } catch (e) {
                log.debug('error', e.toString());
            }
        }

        function auctionFilters(form,param,auc_condition, auc_date, auc_cleaned,
                                auc_loc, auc_vin, vinID, locatId, _vinText, auc_sts, auc_ttlsent, auc_ttlrest) {
            try {
                var obj = {};
                if(param.includes(40)){
                    var AuctionStatusFldObj = form.addField({
                        id: "custpage_auc_status",
                        type: serverWidget.FieldType.SELECT,
                        label: "Auction status",
                        source: "customrecord_auction_status",
                        container: "custpage_fil_gp_auc"
                    })
                    AuctionStatusFldObj.defaultValue = auc_sts;
                }
                if(param.includes(41)){
                    var AuctionLocationFldObj = form.addField({
                        id: "custpage_auc_location",
                        type: serverWidget.FieldType.SELECT,
                        label: "Location",
                        source: "location",
                        container: "custpage_fil_gp_auc"
                    })
                    AuctionLocationFldObj.defaultValue = auc_loc;
                }
                if(param.includes(39)){
                    var AuctionVinFldObj = form.addField({
                        id: "custpage_auc_vin",
                        type: serverWidget.FieldType.SELECT,
                        label: "VIN",
                        source: "customrecord_advs_vm",
                        container: "custpage_fil_gp_auc"
                    });
                    AuctionVinFldObj.defaultValue = auc_vin
                }
                if(param.includes(42)){
                    var AuctionDateFldObj = form.addField({
                        id: "custpage_auc_date",
                        type: serverWidget.FieldType.DATE,
                        label: "Date",
                        source: null,
                        container: "custpage_fil_gp_auc"
                    });
                    AuctionDateFldObj.defaultValue = auc_date;

                }
                if(param.includes(43)){
                    var AuctionCondtionFldObj = form.addField({
                        id: "custpage_auc_condition",
                        type: serverWidget.FieldType.SELECT,
                        label: "CONDITION",
                        source: "customlist_advs_cond_list",
                        container: "custpage_fil_gp_auc"
                    });
                    AuctionCondtionFldObj.defaultValue = auc_condition;
                }
                if(param.includes(44)){
                    var AuctionCleanedFldObj = form.addField({
                        id: "custpage_auc_cleaned",
                        type: serverWidget.FieldType.SELECT,
                        label: "CLEANED",
                        source: "customlist_advs_cleaned_list",
                        container: "custpage_fil_gp_auc"
                    });
                    AuctionCleanedFldObj.defaultValue = auc_cleaned;
                }
                if(param.includes(46)){
                    var AuctionTtleSentFldObj = form.addField({
                        id: "custpage_auc_ttl_sent",
                        type: serverWidget.FieldType.SELECT,
                        label: "Title Sent",
                        source: "customlist_advs_title_sent_list",
                        container: "custpage_fil_gp_auc"
                    });
                    AuctionTtleSentFldObj.defaultValue = auc_ttlsent;
                }
                if(param.includes(47)){
                    var AuctionttlRestrFldObj = form.addField({
                        id: "custpage_auc_ttl_restriction",
                        type: serverWidget.FieldType.SELECT,
                        label: "Title Restriction",
                        source: "customlist_advs_title_restriction_list",
                        container: "custpage_fil_gp_auc"
                    });
                    AuctionttlRestrFldObj.defaultValue = auc_ttlrest;
                }

                /* if (auc_sts != "" && auc_sts != undefined && auc_sts != null) {
                  AuctionStatusFldObj.defaultValue = auc_sts
                } */


                /* if (auc_sts != "" && auc_sts != undefined && auc_sts != null) {
                  AuctionTtleSentFldObj.defaultValue = auc_sts
                } */

                /*  if (auc_sts != "" && auc_sts != undefined && auc_sts != null) {
                   AuctionttlRestrFldObj.defaultValue = auc_sts
                 } */

                obj.AuctionStatusFldObj = AuctionStatusFldObj;
                obj.AuctionLocationFldObj = AuctionLocationFldObj;
                obj.AuctionVinFldObj = AuctionVinFldObj;
                obj.AuctionDateFldObj = AuctionDateFldObj;
                obj.AuctionCondtionFldObj = AuctionCondtionFldObj;
                obj.AuctionCleanedFldObj = AuctionCleanedFldObj;
                obj.AuctionTtleSentFldObj = AuctionTtleSentFldObj;
                obj.AuctionttlRestrFldObj = AuctionttlRestrFldObj;
                return obj;
            } catch (e) {
                log.debug('error', e.toString())
            }
        }

        function createAuctionSublist(form) {
            var sublistauction = form.addSublist({
                id: "custpage_sublist_auction",
                type: serverWidget.SublistType.LIST,
                label: "List"
            });
            sublistauction.addField({
                id: "custpage_auction_truckstatus",
                type: serverWidget.FieldType.TEXT,
                label: "Truck Status"
            })
            sublistauction.addField({
                id: "custpage_auction_status",
                type: serverWidget.FieldType.TEXT,
                label: " Auction Status"
            });
            sublistauction.addField({
                id: "custpage_location_of_unit",
                type: serverWidget.FieldType.TEXT,
                label: "Location Of Unit"
            });
            sublistauction.addField({
                id: "custpage_auction_notes",
                type: serverWidget.FieldType.TEXT,
                label: "Notes"
            })
            sublistauction.addField({
                id: "custpage_auction_year",
                type: serverWidget.FieldType.TEXT,
                label: "Year"
            });
            sublistauction.addField({
                id: "custpage_auction_make",
                type: serverWidget.FieldType.TEXT,
                label: "Make"
            });

            sublistauction.addField({
                id: "custpage_auction_stock_no",
                type: serverWidget.FieldType.TEXT,
                label: "Stock #"
            });
            sublistauction.addField({
                id: "custpage_auction_locations",
                type: serverWidget.FieldType.TEXT,
                label: "Auction Location"
            })
             sublistauction.addField({
                id: "custpage_auction_date",
                type: serverWidget.FieldType.TEXT,
                label: "Date of Auction"
            })
            sublistauction.addField({
                id: "custpage_days_till_action",
                type: serverWidget.FieldType.TEXT,
                label: "Days Untill Action"
            }) ;
            sublistauction.addField({
                id: "custpage_eta_action",
                type: serverWidget.FieldType.TEXT,
                label: "ETA to Auction"
            })
            sublistauction.addField({
                id: "custpage_date_site",
                type: serverWidget.FieldType.TEXT,
                label: "Date on Site"
            })
            sublistauction.addField({
                id: "custpage_auction_runner",
                type: serverWidget.FieldType.TEXT,
                label: "Runner/Non Runner"
            });
            sublistauction.addField({
                id: "custpage_auction_acodes",
                type: serverWidget.FieldType.TEXT,
                label: "Active Codes"
            });
            sublistauction.addField({
                id: "custpage_auction_cleaned",
                type: serverWidget.FieldType.TEXT,
                label: "Cleaned"
            });
            sublistauction.addField({
                id: "custpage_auction_haskey",
                type: serverWidget.FieldType.TEXT,
                label: "Has Key"
            });
            sublistauction.addField({
                id: "custpage_auction_cont_signed",
                type: serverWidget.FieldType.TEXT,
                label: "Contract Signed"
            });
            sublistauction.addField({
                id: "custpage_auction_title_restriction",
                type: serverWidget.FieldType.TEXT,
                label: "Title Restriction"
            });
            sublistauction.addField({
                id: "custpage_auction_title_sent",
                type: serverWidget.FieldType.TEXT,
                label: "Title Sent"
            });

            sublistauction.addField({
                id: "custpage_auction_location",
                type: serverWidget.FieldType.TEXT,
                label: "Location"
            }).updateDisplayType({
                displayType: "hidden"
            })
            sublistauction.addField({
                id: "custpage_auction_vin",
                type: serverWidget.FieldType.TEXT,
                label: "VIN"
            }).updateDisplayType({
                displayType: "hidden"
            });
            sublistauction.addField({
                id: "custpage_auction_history",
                type: serverWidget.FieldType.TEXT,
                label: "History"
            });
            sublistauction.addField({
                id: "custpage_auction_edit",
                type: serverWidget.FieldType.TEXT,
                label: "Edit"
            })

            return sublistauction;
        }

        function addDatatoAuction(sublistauction, auc_condition, auc_date, auc_cleaned,
                                  auc_loc, auc_vin, vinID, locatId, _vinText, auc_sts, auc_ttlsent, auc_ttlrest,
                                  AuctionCondtionFldObj, AuctionDateFldObj, AuctionStatusFldObj,
                                  AuctionCleanedFldObj, AuctionLocationFldObj, AuctionVinFldObj,
                                  AuctionTtleSentFldObj, AuctionttlRestrFldObj

        ) {
            try {
                /* log.debug('auc_vin in addDatatoAuction',auc_vin);
                log.debug('auc_ttlsent in addDatatoAuction',auc_ttlsent);
                log.debug('auc_ttlrest in addDatatoAuction',auc_ttlrest); */
                var vehicle_auctionSearchObj = search.create({
                    type: "customrecord_advs_vehicle_auction",
                    filters: [
                        ["isinactive", "is", "F"]
                    ],
                    columns: [
                        "custrecord_auction_lease",
                        "custrecord_auction_vin",
                        "custrecord_auction_status",
                        "custrecord_auction_notes",
                        "custrecord_data_of_auction",
                        "custrecord_auction_location",
                        "custrecord_auction_name",
                        "custrecord_auction_runner",
                        "custrecord_auction_cleaned",
                        "custrecord_auction_title_sent",
                        "custrecord_auction_starts",
                        "custrecord_auction_drives",
                        "custrecord_auction_active_codes",
                        "custrecord_advs_days_till_auct",
                        "custrecord_advs_has_key",
                        "custrecord_advs_cont_sgined",
                        "custrecord_advs_title_res_auct",
                        "custrecord_advs_loc_unit",
                        "custrecord_advs_cond_",
                        "custrecord_advs_auc_loc_veh",
                        "custrecord_vehicle_auc_eta",
                        "custrecord_vehicle_auc_dateonsite",
                        search.createColumn({
                            name: "custrecord_advs_em_serial_number",
                            join: "custrecord_auction_vin"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_vm_reservation_status",
                            join: "custrecord_auction_vin"
                        }),
                    ]
                });
                var searchResultCount = vehicle_auctionSearchObj.runPaged().count;
                var count = 0;

                if (auc_vin != "" && auc_vin != undefined && auc_vin != null) {
                    vehicle_auctionSearchObj.filters.push(search.createFilter({
                        name: "custrecord_auction_vin",
                        operator: search.Operator.ANYOF,
                        values: auc_vin
                    }))

                }
                //log.debug('auc_loc inside function for filter',auc_loc)
                if (auc_loc != "" && auc_loc != undefined && auc_loc != null) {
                    vehicle_auctionSearchObj.filters.push(search.createFilter({
                        name: "custrecord_auction_location",
                        operator: search.Operator.ANYOF,
                        values: auc_loc
                    }));


                }

                if (auc_sts != "" && auc_sts != undefined && auc_sts != null) {
                    vehicle_auctionSearchObj.filters.push(search.createFilter({
                        name: "custrecord_auction_status",
                        operator: search.Operator.ANYOF,
                        values: auc_sts
                    }))

                }


                if (auc_condition != "" && auc_condition != undefined && auc_condition != null) {
                    vehicle_auctionSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_cond_",
                        operator: search.Operator.ANYOF,
                        values: auc_condition
                    }))


                }
                if (auc_cleaned != "" && auc_cleaned != undefined && auc_cleaned != null) {
                    vehicle_auctionSearchObj.filters.push(search.createFilter({
                        name: "custrecord_auction_cleaned",
                        operator: search.Operator.ANYOF,
                        values: auc_cleaned
                    }))


                }
                if (auc_date != "" && auc_date != undefined && auc_date != null) {
                    //log.debug("auc_date",auc_date);
                    vehicle_auctionSearchObj.filters.push(search.createFilter({
                        name: "custrecord_data_of_auction",
                        operator: search.Operator.ON,
                        values: auc_date
                    }))


                }
                if (auc_ttlsent != "" && auc_ttlsent != undefined && auc_ttlsent != null) {
                    vehicle_auctionSearchObj.filters.push(search.createFilter({
                        name: "custrecord_auction_title_sent",
                        operator: search.Operator.ANYOF,
                        values: auc_ttlsent
                    }))


                }
                if (auc_ttlrest != "" && auc_ttlrest != undefined && auc_ttlrest != null) {
                    vehicle_auctionSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_title_res_auct",
                        operator: search.Operator.ANYOF,
                        values: auc_ttlrest
                    }))


                }
                //log.debug('vehicle_auctionSearchObj',vehicle_auctionSearchObj.filters)

                vehicle_auctionSearchObj.run().each(function (result) {
                  //  log.debug('result',result);
                    var acutName = result.getValue({
                        name: 'custrecord_auction_name'
                    }) || ' ';
                    //log.debug('acutName',acutName);
                    var leaseName = result.getText({
                        name: 'custrecord_auction_lease'
                    }) || ' ';
                    var leaseVal = result.getValue({
                        name: 'custrecord_auction_lease'
                    }) || ' ';
                    var auctstock = result.getValue({
                        name: "custrecord_advs_em_serial_number",
                        join: "custrecord_auction_vin"
                    }) || '';
                    var aucttruckstatus = result.getText({
                        name: "custrecord_advs_vm_reservation_status",
                        join: "custrecord_auction_vin"
                    }) || '';

                    var vinName = result.getText({
                        name: 'custrecord_auction_vin'
                    }) || ' ';
                    var vinVal = result.getValue({
                        name: 'custrecord_auction_vin'
                    }) || ' ';
                    var statusName = result.getText({
                        name: 'custrecord_auction_status'
                    }) || ' ';
                    var statusVal = result.getValue({
                        name: 'custrecord_auction_status'
                    }) || ' ';
                    var notesVal = result.getValue({
                        name: 'custrecord_auction_notes'
                    }) || ' ';

                    var dateofauction = result.getValue({
                        name: 'custrecord_data_of_auction'
                    }) || ' ';
                    var locationval = result.getValue({
                        name: 'custrecord_auction_location'
                    }) || ' ';
                    var locationText = result.getText({
                        name: 'custrecord_auction_location'
                    }) || ' ';
                    var runner = result.getText({
                        name: 'custrecord_auction_runner'
                    }) || ' ';
                    var Cleaned = result.getText({
                        name: 'custrecord_auction_cleaned'
                    }) || ' ';
                    var tsent = result.getText({
                        name: 'custrecord_auction_title_sent'
                    }) || ' ';
                    var starts = result.getValue({
                        name: 'custrecord_auction_starts'
                    }) || ' ';
                    var drives = result.getValue({
                        name: 'custrecord_auction_drives'
                    }) || ' ';
                    var activecodes = result.getText({
                        name: 'custrecord_auction_active_codes'
                    }) || ' ';

                    var daystillaction = result.getValue({
                        name: 'custrecord_advs_days_till_auct'
                    }) || ' ';
                    var haskey = result.getText({
                        name: 'custrecord_advs_has_key'
                    }) || ' ';
                    var contsigned = result.getText({
                        name: 'custrecord_advs_cont_sgined'
                    }) || ' ';
                    var titlerestriction = result.getText({
                        name: 'custrecord_advs_title_res_auct'
                    }) || ' ';
                    var locationunit = result.getValue({
                        name: 'custrecord_advs_loc_unit'
                    }) || ' ';
                    var condition = result.getText({
                        name: 'custrecord_advs_cond_'
                    }) || ' ';
                    var actionlocation = result.getText({
                        name: 'custrecord_advs_auc_loc_veh'
                    }) || ' ';
                    var etadate = result.getValue({
                        name: 'custrecord_vehicle_auc_eta'
                    }) || ' ';

                    var onsitedate = result.getValue({
                        name: 'custrecord_vehicle_auc_dateonsite'
                    }) || ' ';

                    var auctionid = result.id;
                    sublistauction.setSublistValue({
                        id: "custpage_auction_edit",
                        line: count,
                        value: '<a href="#" onclick=openauction(' + auctionid + ')> <i class="fa fa-edit" style="color:blue;"></i></a>'
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_status",
                        line: count,
                        value: statusName
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_truckstatus",
                        line: count,
                        value: aucttruckstatus
                    });
                    // sublistauction.setSublistValue({ id: "custpage_auction_name", line: count, value: acutName });
                    /* sublistauction.setSublistValue({ id: "custpage_auction_leseedoc", line: count, value: leaseName //'<a href="' + leaseagrement + '">' + stock + '</a>' }); */
                    sublistauction.setSublistValue({
                        id: "custpage_auction_vin",
                        line: count,
                        value: vinName
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_stock_no",
                        line: count,
                        value: auctstock
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_date",
                        line: count,
                        value: dateofauction
                    });

                    sublistauction.setSublistValue({
                        id: "custpage_days_till_action",
                        line: count,
                        value: daystillaction
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_location_of_unit",
                        line: count,
                        value: locationunit
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_condition",
                        line: count,
                        value: condition
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_acodes",
                        line: count,
                        value: activecodes
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_cleaned",
                        line: count,
                        value: Cleaned
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_haskey",
                        line: count,
                        value: haskey
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_cont_signed",
                        line: count,
                        value: contsigned
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_title_restriction",
                        line: count,
                        value: titlerestriction
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_title_sent",
                        line: count,
                        value: tsent
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_notes",
                        line: count,
                        value: '<a href="#" onclick=openAuctionNotes('+auctionid+')><i class="fa fa-comment" style="color: blue"></i></a>'//notesVal
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_location",
                        line: count,
                        value: locationText
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_locations",
                        line: count,
                        value: actionlocation
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_eta_action",
                        line: count,
                        value: etadate
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_date_site",
                        line: count,
                        value: onsitedate
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_runner",
                        line: count,
                        value: condition
                    });
                    sublistauction.setSublistValue({
                        id: "custpage_auction_history",
                        line: count,
                        value: '<a href="#" onclick=openauctionHistory(' + auctionid + ')> <i class="fa fa-history" style="color:blue;"></i></a>'
                    });


                   count++;
                    return true;
                });
            } catch (e) {
                log.debug('error in addDatatoAuction', e.toString())
            }
        }

        function addCommasnew(x) {
            x = x.toString();
            var pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(x))
                x = x.replace(pattern, "$1,$2");
            return x;
        }
        // Function to calculate the difference in days
        function calculateDays(startDate, Newdate) {
            const start = new Date(startDate);
            var end = new Date(Newdate);
            const differenceInMs = end - start;
            const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
            return differenceInDays;
        }

        return {
            onRequest
        }

    });
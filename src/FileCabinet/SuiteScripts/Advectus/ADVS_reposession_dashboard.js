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
                        title: "Repossession "
                    });
                    var currScriptObj = runtime.getCurrentScript();
                    var UserObj = runtime.getCurrentUser();
                    var UserSubsidiary = UserObj.subsidiary;
                    var UserLocation = UserObj.location;
                  var scriptid = currScriptObj.id
                    var Userid = UserObj.id;
                  log.debug('Userid',Userid);
                   log.debug('scriptid',scriptid)
                    var filtersparam = request.parameters.filters || '[]';
                    var _inventorymodulelib = inventorymodulelib.jsscriptlib(form);

                    var vinID = request.parameters.unitvin || '';
                    var _vinText = request.parameters.unitvintext || '';
                    var locatId = request.parameters.locat;
                    var repo_sts = request.parameters.repo_sts || '';
                    var repo_vin = request.parameters.repo_vin || '';
                    var repo_loc = request.parameters.repo_loc || '';
                    var repo_model = request.parameters.repo_model || '';
                    var repo_mil = request.parameters.repo_mil || '';
                    var repo_com = request.parameters.repo_com || '';
                    var repo_date = request.parameters.repo_date || '';
                    var repo_cust = request.parameters.repo_cust || '';
                    var repo_stock = request.parameters.repo_stock || '';
                    var repo_year = request.parameters.repo_year || '';
                    var repo_collec = request.parameters.repo_collec || '';
                    var repo_dest = request.parameters.repo_dest || '';

                    var filterGprepo = form.addFieldGroup({
                        id: "custpage_fil_gp_repo",
                        label: "Filters"
                    });
                    //FITLERS DATA AND HIDING FIELD
                    var filterFldObj = form.addField({
                        id: "custpage_filter_params",
                        type: serverWidget.FieldType.TEXT,
                        label: "filtersparam",
                        container: "custpage_fil_gp_repo"
                    });
                    filterFldObj.defaultValue = filtersparam;
                    filterFldObj.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });

                    var summaryGptpt = form.addFieldGroup({
                        id: "custpage_fil_gp_tpt_smry",
                        label: "Summary"
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

                    
                    var pendingpickupresults = getSummaryPendingPickup();
                    var pendingpickuphtml = generateHTML(pendingpickupresults);
                    addSummaryField(form, 'summary1', 'Pending Pickup',pendingpickuphtml,'custpage_fil_gp_tpt_smry');
    
    
         
                    //AUCTION FILTERS
                    var filterObj = repoFilters(filtersparam,form,repo_vin,repo_model, repo_loc, repo_mil, repo_sts, repo_cust, repo_stock, repo_year, repo_collec, repo_dest, repo_com, repo_date);
                    var sublistrepo = createReposessionSublist(form, repo_sts);

                    setRepoSublistData(sublistrepo, repo_vin,repo_model, repo_loc, repo_mil, repo_sts, repo_cust, repo_stock, repo_year, repo_collec, repo_dest, repo_com, repo_date);
                       form.clientScriptModulePath = "./advs_cs_reposession_dashboard.js";
                    response.writePage(form);
                }
            } catch (e) {
                log.debug('error', e.toString());
            }
        }

        function repoFilters(param,form,repo_vin,repo_model, repo_loc, repo_mil, repo_sts, repo_cust, repo_stock, repo_year, repo_collec, repo_dest, repo_com, repo_date) {
            try {
                if(param.includes(28)){
                    var RepostatusFldObj = form.addField({
                        id: "custpage_repo_status_fld",
                        type: serverWidget.FieldType.SELECT,
                        label: "Repo Status",
                        source: "customrecord_advs_ofr_status",
                        container: "custpage_fil_gp_repo"
                    });

                    if (repo_sts != "" && repo_sts != undefined && repo_sts != null) {
                        RepostatusFldObj.defaultValue = repo_sts
                    }
                }
                if(param.includes(27)){
                    var RepoVinFldObj = form.addField({
                        id: "custpage_repo_vin",
                        type: serverWidget.FieldType.SELECT,
                        label: "VIN",
                        source: "customrecord_advs_vm",
                        container: "custpage_fil_gp_repo"
                    });
                    if (repo_vin != "" && repo_vin != undefined && repo_vin != null) {
                        RepoVinFldObj.defaultValue = repo_vin
                    }
                }
                if(param.includes(29)){
                    var RepoLocFldObj = form.addField({
                        id: "custpage_repo_location",
                        type: serverWidget.FieldType.SELECT,
                        label: "LOCATION",
                        source: "location",
                        container: "custpage_fil_gp_repo"
                    });
                    if (repo_loc != "" && repo_loc != undefined && repo_loc != null) {
                        RepoLocFldObj.defaultValue = repo_loc
                    }

                }
                if(param.includes(30)){
                    var RepoModelFldObj = form.addField({
                        id: "custpage_repo_model",
                        type: serverWidget.FieldType.SELECT,
                        label: "MODEL",
                        source: "item",
                        container: "custpage_fil_gp_repo"
                    });
                    if (repo_model != "" && repo_model != undefined && repo_model != null) {
                        RepoModelFldObj.defaultValue = repo_model
                    }

                }
                if(param.includes(31)){
                    var RepoMileageFldObj = form.addField({
                        id: "custpage_repo_mileage",
                        type: serverWidget.FieldType.TEXT,
                        label: "MILEAGE",
                        container: "custpage_fil_gp_repo"
                    });
                    if (repo_mil != "" && repo_mil != undefined && repo_mil != null) {
                        RepoMileageFldObj.defaultValue = repo_mil
                    }
                }
                if(param.includes(32)){
                    var RepoCompanyFldObj = form.addField({
                        id: "custpage_repo_company",
                        type: serverWidget.FieldType.SELECT,
                        label: "COMPANY",
                        source: 'customrecord_repo_company',
                        container: "custpage_fil_gp_repo"
                    });
                    if (repo_com != "" && repo_com != undefined && repo_com != null) {
                        RepoCompanyFldObj.defaultValue = repo_com
                    }
                }
                if(param.includes()){
                    var RepoDateFldObj = form.addField({
                        id: "custpage_repo_dateassigned",
                        type: serverWidget.FieldType.DATE,
                        label: "DATE ASSIGNED",
                        container: "custpage_fil_gp_repo"
                    });
                    if (repo_date != "" && repo_date != undefined && repo_date != null) {
                        RepoDateFldObj.defaultValue = repo_date
                    }

                }
                if(param.includes(34)){
                    var RepoLesseFldObj = form.addField({
                        id: "custpage_repo_lessee",
                        type: serverWidget.FieldType.SELECT,
                        label: "Lesse",
                        source: "customer",
                        container: "custpage_fil_gp_repo"
                    });
                    if (repo_cust != "" && repo_cust != undefined && repo_cust != null) {
                        RepoLesseFldObj.defaultValue = repo_cust
                    }
                }
                if(param.includes(35)){
                    var RepoStockFldObj = form.addField({
                        id: "custpage_repo_stock",
                        type: serverWidget.FieldType.TEXT,
                        label: "Stock #",
                        //source: null,//'customrecord_advs_lease_header',
                        container: "custpage_fil_gp_repo"
                    });
                    if (repo_stock != "" && repo_stock != undefined && repo_stock != null) {
                        RepoStockFldObj.defaultValue = repo_stock
                    }
                }
                if(param.includes(36)){
                    var RepoYearFldObj = form.addField({
                        id: "custpage_repo_year",
                        type: serverWidget.FieldType.SELECT,
                        label: "Year",
                        // source: "customlist_advs_truck_year",
                        source: "customrecord_advs_model_year",
                        container: "custpage_fil_gp_repo"
                    });
                    if (repo_year != "" && repo_year != undefined && repo_year != null) {
                        RepoYearFldObj.defaultValue = repo_year
                    }
                }
                if(param.includes(37)){
                    var RepoCollectionsFldObj = form.addField({
                        id: "custpage_repo_collections",
                        type: serverWidget.FieldType.SELECT,
                        label: "Collections",
                        source: null,
                        container: "custpage_fil_gp_repo"
                    });
                    RepoCollectionsFldObj.addSelectOption({
                        value: '',
                        text: ''
                    });
                    RepoCollectionsFldObj.addSelectOption({
                        value: 2,
                        text: 'No'
                    });
                    RepoCollectionsFldObj.addSelectOption({
                        value: 1,
                        text: 'Yes'
                    });
                    if (repo_collec != "" && repo_collec != undefined && repo_collec != null) {
                        RepoCollectionsFldObj.defaultValue = repo_collec
                    }
                }
                if(param.includes(38)){
                    var RepoDestinationFldObj = form.addField({
                        id: "custpage_repo_destination",
                        type: serverWidget.FieldType.SELECT,
                        label: "Destination",
                        source: "customlist_advs_destination",
                        container: "custpage_fil_gp_repo"
                    });
                    if (repo_dest != "" && repo_dest != undefined && repo_dest != null) {
                        RepoDestinationFldObj.defaultValue = repo_dest
                    }
                }
                var tptECFldObj = form.addField({
                    id: "custpage_repo_excludeclosedout",
                    type: serverWidget.FieldType.CHECKBOX,
                    label: "Exclude Closed Out",
                    source: "",
                    container: "custpage_fil_gp_repo"
                });

            } catch (e) {
                log.debug('error', e.toString())
            }
        }

        function createReposessionSublist(form) {

            var sublistrepo = form.addSublist({
                id: "custpage_sublist_repo",
                type: serverWidget.SublistType.LIST,
                label: "List",
                tab: "custpage_repo_tab"
            });
            sublistrepo.addField({
                id: "custpage_repo_edit",
                type: serverWidget.FieldType.TEXT,
                label: "Edit"
            });
           
            sublistrepo.addField({
                id: "custpage_repo_status",
                type: serverWidget.FieldType.SELECT,
                label: "Repo Status",
                source: 'customrecord_advs_ofr_status'
            }).updateDisplayType({
                displayType: "inline"
            });

            sublistrepo.addField({
                id: "custpage_repo_hold_email",
                type: serverWidget.FieldType.TEXT,
                label: "Hold Harmless"
            });
            sublistrepo.addField({
                id: "custpage_repo_leseedoc",
                type: serverWidget.FieldType.TEXT,
                label: "Lesse#"
            }).updateDisplayType({
                displayType: "hidden"
            });
            sublistrepo.addField({
                id: "custpage_repo_lesee",
                type: serverWidget.FieldType.TEXT,
                label: "Lesse Name"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_stock_no",
                type: serverWidget.FieldType.TEXT,
                label: "Stock #"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_vin",
                type: serverWidget.FieldType.TEXT,
                label: "VIN"
            }).updateDisplayType({
                displayType: "hidden"
            });
            sublistrepo.addField({
                id: "custpage_repo_termination_notes",
                type: serverWidget.FieldType.TEXTAREA,
                label: "Termination Notes"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_location_for_transport",
                type: serverWidget.FieldType.TEXT,
                label: "Staged Location From" //Location For Transport
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_notes_time",
                type: serverWidget.FieldType.TEXTAREA,
                label: "Notes (Time stamp)"
            }).updateDisplayType({
                displayType: "inline"
            });




            sublistrepo.addField({
                id: "custpage_repo_lastlocation",
                type: serverWidget.FieldType.TEXT,
                label: "Last Known Location"
            });
            sublistrepo.addField({
                id: "custpage_repo_repocompany",
                type: serverWidget.FieldType.SELECT,
                label: "Repo Company",
                source: "customrecord_repo_company"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_dateoutput",
                type: serverWidget.FieldType.TEXT,
                label: "Date Assigned (Output)"
            });
            sublistrepo.addField({
                id: "custpage_repo_terminationdate",
                type: serverWidget.FieldType.TEXT,
                label: "Termination Date"
            });
            sublistrepo.addField({
                id: "custpage_repo_terminate_email",
                type: serverWidget.FieldType.TEXT,
                label: "Send Termination Email"
            });
            sublistrepo.addField({
                id: "custpage_repo_followupletter",
                type: serverWidget.FieldType.TEXT,
                label: "FollowUp Letter"
            });
            sublistrepo.addField({
                id: "custpage_repo_collections_d",
                type: serverWidget.FieldType.TEXT,
                label: "Collections"
            });
            sublistrepo.addField({
                id: "custpage_repo_year",
                type: serverWidget.FieldType.TEXT,
                label: "Year"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_make",
                type: serverWidget.FieldType.TEXT,
                label: "Make"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_model",
                type: serverWidget.FieldType.TEXT,
                label: "Model"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_current_odometer",
                type: serverWidget.FieldType.TEXT,
                label: "Last Recorded Mileage"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_net_investment",
                type: serverWidget.FieldType.TEXT,
                label: "New Investment"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_notes",
                type: serverWidget.FieldType.TEXT,
                label: "Notes"
            }).updateDisplayType({
                displayType: "hidden"
            });
            sublistrepo.addField({
                id: "custpage_repo_current_coordinates",
                type: serverWidget.FieldType.TEXT,
                label: "Vehicle Coordinates"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_destination",
                type: serverWidget.FieldType.TEXT,
                label: "Destination"
            }).updateDisplayType({
                displayType: "inline"
            });

            sublistrepo.addField({
                id: "custpage_repo_truckstatus",
                type: serverWidget.FieldType.SELECT,
                label: "Truck Master Status",
                source: 'customlist_advs_truck_master_status'
            }).updateDisplayType({
                displayType: "inline"
            });

            sublistrepo.addField({
                id: "custpage_repo_history",
                type: serverWidget.FieldType.TEXT,
                label: "History"
            }).updateDisplayType({
                displayType: "inline"
            });


            /* sublistrepo.addButton({ id : 'custpage_hold_email', label : 'Hold Email', functionName : 'openholdpop()' });
                sublistrepo.addButton({ id : 'custpage_termination_email', label : 'Termination Email', functionName : 'openterminationpop()' }); */
            return sublistrepo;
        }

        function setRepoSublistData(sublistrepo, repo_vin,repo_model, repo_loc, repo_mil, repo_sts, repo_cust, repo_stock, repo_year, repo_collec, repo_dest, repo_com, repo_date) {
            try {
                var customrecord_lms_ofr_SearchObj = search.create({
                    type: "customrecord_lms_ofr_",
                    filters: [
                        ["isinactive", "is", "F"]
                    ],
                    columns: [
                        "custrecord_chek_from_repo",
                        "custrecord_collections",
                        "custrecord_advs_ofr_color",
                        "custrecord_destination",
                        "custrecord_followup_letter",
                        "custrecord_ofr_make",
                        "custrecord_ofr_model",
                        "custrecord_ofr_customer",
                        "custrecord_ofr_date",
                        // "custrecord_advs_ofr_ofrstatus",
                        search.createColumn({
                            name: "custrecord_advs_ofr_ofrstatus",
                            label: "OFR Status",
                            sort: search.Sort.ASC
                        }),
                        "custrecord_advs_repo_company",
                        "custrecord_ofr_stock_no",
                        "custrecord_termination_date",
                        "custrecord_ofr_vin",
                        "custrecord_ofr_year",
                        "custrecord_location_for_transport",
                        "custrecord_last_location",
                        "custrecord_date_putout",
                        "custrecord_additional_info_remarks",
                        "custrecord_transport_company",
                        "custrecord_goldstar_odometer",
                        "custrecord_goldstar_vehicle_coordinates",
                        "custrecord_repo_new_investment",
                        search.createColumn({
                            name: "custrecord_advs_em_serial_number",
                            join: "custrecord_ofr_vin"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_vm_reservation_status",
                            join: "custrecord_ofr_vin"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_truck_master_status",
                            join: "custrecord_ofr_vin"
                        })
                    ]
                });
                if (repo_vin != "" && repo_vin != undefined && repo_vin != null) {
                    customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
                        name: "custrecord_ofr_vin",
                        operator: search.Operator.ANYOF,
                        values: repo_vin
                    }))
                }
                if (repo_loc != "" && repo_loc != undefined && repo_loc != null) {
                    customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
                        name: "custrecord_location_for_transport",
                        operator: search.Operator.ANYOF,
                        values: repo_loc
                    }))
                }

                if (repo_mil != "" && repo_mil != undefined && repo_mil != null) {
                    customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
                        name: "custrecord_goldstar_odometer",
                        operator: search.Operator.IS,
                        values: repo_mil
                    }))
                }

                if (repo_sts != "" && repo_sts != undefined && repo_sts != null) {
                    customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_ofr_ofrstatus",
                        operator: search.Operator.ANYOF,
                        values: repo_sts
                    }))
                }
                if (repo_cust != "" && repo_cust != undefined && repo_cust != null) {
                    customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
                        name: "custrecord_ofr_customer",
                        operator: search.Operator.ANYOF,
                        values: repo_cust
                    }))
                }

                if (repo_stock != "" && repo_stock != undefined && repo_stock != null) {
                    customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_em_serial_number",
                        join: 'custrecord_ofr_vin',
                        operator: search.Operator.CONTAINS,
                        values: repo_stock
                    }))
                }
                if (repo_year != "" && repo_year != undefined && repo_year != null) {
                    customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
                        name: "custrecord_ofr_year",
                        operator: search.Operator.ANYOF,
                        values: repo_year
                    }))
                }
                if (repo_collec != "" && repo_collec != undefined && repo_collec != null) {
                    customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
                        name: "custrecord_collections",
                        operator: search.Operator.ANYOF,
                        values: repo_collec
                    }))
                }
                if (repo_dest != "" && repo_dest != undefined && repo_dest != null) {
                    customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
                        name: "custrecord_destination",
                        operator: search.Operator.ANYOF,
                        values: repo_dest
                    }))
                }

                if (repo_com != "" && repo_com != undefined && repo_com != null) {
                    customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_repo_company",
                        operator: search.Operator.ANYOF,
                        values: repo_com
                    }))
                }
                if (repo_date != "" && repo_date != undefined && repo_date != null) {
                    customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
                        name: "custrecord_date_putout",
                        operator: search.Operator.ON,
                        values: repo_date
                    }))
                }

                var searchResultCount = customrecord_lms_ofr_SearchObj.runPaged().count;
                var arr = [];
                var count = 0;
                customrecord_lms_ofr_SearchObj.run().each(function (result) {
                    var name = result.getText({
                        name: 'custrecord_ofr_customer'
                    }) || ' ';
                    var Custo_name = result.getValue({
                        name: 'custrecord_ofr_customer'
                    }) || ' ';
                    var destination = result.getText({
                        name: 'custrecord_destination'
                    }) || ' ';
                    var make = result.getText({
                        name: 'custrecord_ofr_make'
                    }) || ' ';
                    var model = result.getText({
                        name: 'custrecord_ofr_model'
                    }) || ' ';
                    var ofrdate = result.getValue({
                        name: 'custrecord_ofr_date'
                    }) || ' ';
                    var stock = result.getText({
                        name: 'custrecord_ofr_stock_no'
                    }) || ' ';
                    var stockval = result.getValue({
                        name: 'custrecord_ofr_stock_no'
                    }) || ' ';
                    var tdate = result.getValue({
                        name: 'custrecord_termination_date'
                    }) || ' ';
                    var tdpdate = result.getValue({
                        name: 'custrecord_date_putout'
                    }) || ' ';
                    var vin = result.getText({
                        name: 'custrecord_ofr_vin'
                    }) || ' ';
                    var vinval = result.getValue({
                        name: 'custrecord_ofr_vin'
                    }) || ' ';
                    var year = result.getText({
                        name: 'custrecord_ofr_year'
                    }) || ' ';
                    var repocompany = result.getText({
                        name: 'custrecord_advs_repo_company'
                    }) || '';
                    var repocompanyval = result.getValue({
                        name: 'custrecord_advs_repo_company'
                    }) || '';
                    var Followup = result.getValue({
                        name: 'custrecord_followup_letter'
                    }) || ' ';
                    var Collections = result.getText({
                        name: 'custrecord_collections'
                    }) || ' ';
                    var Status = result.getText({
                        name: 'custrecord_advs_ofr_ofrstatus'
                    }) || ' ';
                    var Statusval = result.getValue({
                        name: 'custrecord_advs_ofr_ofrstatus'
                    }) || '';
                    var newinvestment = result.getValue({
                        name: 'custrecord_repo_new_investment'
                    }) || '';
                    var locationTransport = result.getText({
                        name: 'custrecord_location_for_transport'
                    }) || ' ';
                    var lastlocation = result.getText({
                        name: 'custrecord_last_location'
                    }) || ' ';
                    var transportCompany = result.getText({
                        name: 'custrecord_transport_company'
                    }) || ' ';
                    var notes = result.getValue({
                        name: 'custrecord_additional_info_remarks'
                    }) || ' ';
                    var goldstar_odometer = result.getValue({
                        name: 'custrecord_goldstar_odometer'
                    }) || ' ';
                    var goldstar_coordinates = result.getValue({
                        name: 'custrecord_goldstar_vehicle_coordinates'
                    }) || ' ';
                    var TruckSerial = result.getValue({
                        name: "custrecord_advs_em_serial_number",
                        join: "custrecord_ofr_vin"
                    }) || ' ';
                    var TruckStatus = result.getValue({
                        name: "custrecord_advs_vm_reservation_status",
                        join: "custrecord_ofr_vin"
                    }) || '';

                    var MasterStatus = result.getValue({
                        name: "custrecord_advs_truck_master_status",
                        join: "custrecord_ofr_vin"
                    }) || '';
                    var ofrid = result.id;
                    var leaseagrement = '';
                    var vinlink = '';

                    /* var vinlink = url.resolveRecord({ recordType: 'customrecord_advs_vm', recordId: vinval }); */
                    vinlink = 'https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=129&id=' + vinval;
                    leaseagrement = 'https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=675&id=' + stockval;
                    var CustomerLink = 'https://8760954.app.netsuite.com/app/common/entity/custjob.nl?id=' + Custo_name;

                    var NotesRepArr = [];
                    if (NoteDataforRep[ofrid] != null && NoteDataforRep[ofrid] != undefined) {
                        var Length = NoteDataforRep[ofrid].length;
                        for (var Len = 0; Len < Length; Len++) {
                            if (NoteDataforRep[ofrid][Len] != null && NoteDataforRep[ofrid][Len] != undefined) {
                                var DateTime = NoteDataforRep[ofrid][Len]['DateTime'];
                                var Notes = NoteDataforRep[ofrid][Len]['Notes'];
                                var DataStore = DateTime + '-' + Notes;
                                NotesRepArr.push(DataStore);
                            }
                        }
                    }

                    sublistrepo.setSublistValue({
                        id: "custpage_repo_edit",
                        line: count,
                        value: '<a href="#" onclick=popupCenter(' + stockval + ')> <i class="fa fa-edit" style="color:blue;"></i></a>'
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_termination_notes",
                        line: count,
                        value: '<a href="#" onclick=openTerminationNotes(' + ofrid + ')> <i class="fa fa-comment" style="color:blue;"></i></a>'
                    });
                    if (tdate != ' ') {
                        sublistrepo.setSublistValue({
                            id: "custpage_repo_terminate_email",
                            line: count,
                            value: '<a href="#" onclick=openterminationpop(' + ofrid + ')> <i class="fa fa-envelope" aria-hidden="true" style="color:red"></i></a>'
                        });
                    }
                    if (repocompany != '') {
                        sublistrepo.setSublistValue({
                            id: "custpage_repo_hold_email",
                            line: count,
                            value: '<a href="#" onclick=openholdpop(' + ofrid + ')> <i class="fa fa-envelope" aria-hidden="true" style="color:orange"></i></a>'
                        });
                    }
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_truckstatus",
                        line: count,
                        value: MasterStatus
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_status",
                        line: count,
                        value: Statusval
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_lesee",
                        line: count,
                        value: '<a href="' + CustomerLink + '">' + name + '</a>'
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_stock_no",
                        line: count,
                        value: TruckSerial
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_leseedoc",
                        line: count,
                        value: stock
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_vin",
                        line: count,
                        value: vin
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_notes",
                        line: count,
                        value: notes
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_notes_time",
                        line: count,
                        value: '<a href="#" onclick=openRepoNotes(' + ofrid + ')> <i class="fa fa-comment" style="color:blue;"></i></a>'//NotesRepArr
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_lastlocation",
                        line: count,
                        value: lastlocation
                    });
                    if (repocompanyval != '') {
                        sublistrepo.setSublistValue({
                            id: "custpage_repo_repocompany",
                            line: count,
                            value: repocompanyval
                        });
                    }
                    if (Collections) {
                        sublistrepo.setSublistValue({
                            id: "custpage_repo_collections_d",
                            line: count,
                            value: Collections
                        });
                    }
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_dateoutput",
                        line: count,
                        value: tdpdate
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_terminationdate",
                        line: count,
                        value: tdate
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_destination",
                        line: count,
                        value: destination
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_location_for_transport",
                        line: count,
                        value: locationTransport
                    });
                    if (Followup == true) {
                        var FollowUpImg = '<img src="https://8760954.app.netsuite.com/core/media/media.nl?id=4644&c=8760954&h=EL8p2LAO88T5YeyN8HcQ1ZtGg-8KmScu4V05TJWCW0vuQX_I" width=30px; height=30px;/>'
                        sublistrepo.setSublistValue({
                            id: "custpage_repo_followupletter",
                            line: count,
                            value: FollowUpImg
                        });
                    } else {
                        sublistrepo.setSublistValue({
                            id: "custpage_repo_followupletter",
                            line: count,
                            value: Followup
                        });
                    }

                    sublistrepo.setSublistValue({
                        id: "custpage_repo_year",
                        line: count,
                        value: year
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_make",
                        line: count,
                        value: make
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_model",
                        line: count,
                        value: model
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_current_odometer",
                        line: count,
                        value: goldstar_odometer || ' '
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_current_coordinates",
                        line: count,
                        value: goldstar_coordinates || ' '
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_transport_company",
                        line: count,
                        value: transportCompany
                    });
                    if(newinvestment){
                        sublistrepo.setSublistValue({
                            id: "custpage_repo_net_investment",
                            line: count,
                            value: newinvestment
                        });
                    }

                    sublistrepo.setSublistValue({
                        id: "custpage_repo_history",
                        line: count,
                        value: '<a href="#" onclick=openRepoHistory(' + ofrid + ')> <i class="fa fa-history" style="color:blue;"></i></a>'
                    });
                    var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1644&deploy=1&repo=' + stockval;

                    // sublistrepo.setSublistValue({id:"custpage_repo_terminate_email",line:count,value:'<a href="#" onclick="openemailpopup("'+stockval+'")"><i class="fa fa-envelope" style="font-size:24px"></i></a>'});

                    count++;
                    return true;
                });
            } catch (e) {
                log.debug('err', e.toString());
            }
        }
        var NoteDataforRep = [];
function getReposessionNotesData() {
    var InsuranceNotesSearchObj = search.create({
        type: "customrecord_advs_repo_notes",
        filters: [
            ["isinactive", "is", "F"],
            "AND",
            ["custrecord_advs_repo_note_parent_link", "noneof", "@NONE@"]
        ],
        columns: [
            search.createColumn({
                name: "custrecord_advs_repo_note_date_time"
            }),
            search.createColumn({
                name: "custrecord_advs_repo_note_notes"
            }),
            search.createColumn({
                name: "custrecord_advs_repo_note_parent_link"
            })
        ]
    });
    var Len = 0;
    InsuranceNotesSearchObj.run().each(function (result) {
        var RepoId = result.getValue('custrecord_advs_repo_note_parent_link');
        var DateTime = result.getValue('custrecord_advs_repo_note_date_time');
        var Notes = result.getValue('custrecord_advs_repo_note_notes');
        if (NoteDataforRep[RepoId] != null && NoteDataforRep[RepoId] != undefined) {
            Len = NoteDataforRep[RepoId].length;
        } else {
            NoteDataforRep[RepoId] = new Array();
            Len = 0;
        }
        NoteDataforRep[RepoId][Len] = new Array();
        NoteDataforRep[RepoId][Len]['DateTime'] = DateTime;
        NoteDataforRep[RepoId][Len]['Notes'] = Notes;
        return true;
    });

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
            type: "customrecord_lms_ofr_",
            filters:
                [
                    ["isinactive","is","F"],
                    
                ],
            columns:
                [
                    search.createColumn({
                        name: "custrecord_advs_ofr_ofrstatus",
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
                repoStatus: result.getText({ name: "custrecord_advs_ofr_ofrstatus", summary: "GROUP" }),
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


function generateHTML(searchResults) {
    var html = '';

    html += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">';
    html+='<style>.custom-table-container { width: 50%; margin: 0px; }</style>';
    html += '<div class=" container  mt-4 custom-table-container">';
    html += '<h2 class="mb-3">Pending Pickup</h2>';
    html += '<table class="table table-bordered table-striped">';
    html += '<thead class="table-dark"><tr><th>Repo Status</th><th>Count</th></tr></thead><tbody>';

    if (searchResults.length > 0) {
        for (var i = 0; i < searchResults.length; i++) {
            html += '<tr>';
            if(searchResults[i].repoStatus=='- None -'){
                html += '<td>All Other</td>';
            }else{
                html += '<td>' + searchResults[i].repoStatus + '</td>';
            }

            html += '<td>' + searchResults[i].count + '</td>';
            html += '</tr>';
        }
    } else {
        html += '<tr><td colspan="2" class="text-center">No data available</td></tr>';
    }

    html += '</tbody></table>';
    html += '</div>';

    return html;
}

return {
    onRequest
}

});
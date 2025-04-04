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
                        title: "Delivery Board Sheet "
                    });
                    var _inventorymodulelib = inventorymodulelib.jsscriptlib(form);
                    var currScriptObj = runtime.getCurrentScript();
                    var scriptId = currScriptObj.id;
                    log.debug('scriptId',scriptId);
                    var UserObj = runtime.getCurrentUser();
                    var UserSubsidiary = UserObj.subsidiary;
                    var UserLocation = UserObj.location;
                    var Userid = UserObj.id;

                    //PARAMETERS
                    var paramsasobj={};
                    var filtersparam = request.parameters.filters || '[]';
                    var vinID = request.parameters.unitvin || '';
                    var _vinText = request.parameters.unitvintext || '';
                    var locatId = request.parameters.locat;
                    var DBVin = request.parameters.DBVin || '';
                    var DBCustomer = request.parameters.DBCustomer || '';
                    var DBSalesRep = request.parameters.DBSalesRep || '';
                    var DBTruckReady = request.parameters.DBTruckReady || '';
                    var DBWashed = request.parameters.DBWashed || '';
                    var DBmc00 = request.parameters.DBmc00 || '';
                    var DBClaim = request.parameters.DBClaim || '';
                    var DBStock = request.parameters.DBStock || '';
                    var DBUnitCondition = request.parameters.DBUnitCondition || '';
                    var DBLocation = request.parameters.DBLocation || '';
                    var DBContract = request.parameters.DBContract || '';
                    var DBsalesQuote = request.parameters.DBsalesQuote || '';

                    paramsasobj.vinID = vinID;
                    paramsasobj._vinText = _vinText;
                    paramsasobj.locatId = locatId;
                    paramsasobj.DBVin = DBVin;
                    paramsasobj.DBCustomer = DBCustomer;
                    paramsasobj.DBSalesRep = DBSalesRep;
                    paramsasobj.DBTruckReady = DBTruckReady;
                    paramsasobj.DBWashed = DBWashed;
                    paramsasobj.DBmc00 = DBmc00;
                    paramsasobj.DBClaim = DBClaim;
                    paramsasobj.DBStock = DBStock;
                    paramsasobj.DBUnitCondition = DBUnitCondition;
                    paramsasobj.DBLocation = DBLocation;
                    paramsasobj.DBContract = DBContract;
                    paramsasobj.DBsalesQuote = DBsalesQuote;
                    paramsasobj.filtersparam = filtersparam;
                    //FIELD GROUP
                    var filterGpdb = form.addFieldGroup({
                        id: "custpage_fil_gp_db",
                        label: "Filters"
                    });
                    //FITLERS DATA AND HIDING FIELD
                    var filterFldObj = form.addField({
                        id: "custpage_filter_params",
                        type: serverWidget.FieldType.TEXT,
                        label: "filtersparam",
                        container: "custpage_fil_gp_db"
                    });
                    filterFldObj.defaultValue = filtersparam;
                    filterFldObj.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    ////////////////DELIVERY BOARD FILTERS/////////////////////////////
                    deliveryBoardFilters(form,DBContract,DBLocation,paramsasobj)
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

                    form.clientScriptModulePath = "./advs_cs_delivery_dashboard.js";
                    response.writePage(form);
                }
            }catch (e)
            {
                log.debug('error',e.toString());
            }
        }

        function deliveryBoardFilters(form,DBContract,DBLocation,paramsasobj){
            try{
                var param = paramsasobj.filtersparam;
                var DboardStockFldObj = '';
                if(param.includes(602)){
                    var DboardVinFldObj = form.addField({
                        id: "custpage_db_vin",
                        type: serverWidget.FieldType.SELECT,
                        label: "VIN",
                        source: "customrecord_advs_vm",
                        container: "custpage_fil_gp_db"
                    })
                }
                if(param.includes(49)){
                    var DboardCustomerFldObj = form.addField({
                        id: "custpage_db_customer",
                        type: serverWidget.FieldType.SELECT,
                        label: "CUSTOMER",
                        source: "customer",
                        container: "custpage_fil_gp_db"
                    })
                }
                if(param.includes(54)){
                    var DboardClaimFldObj = form.addField({
                        id: "custpage_db_claim",
                        type: serverWidget.FieldType.SELECT,
                        label: "CLAIM",
                        source: "customrecord_advs_insurance_claim_sheet",
                        container: "custpage_fil_gp_db"
                    })
                }
                if(param.includes(48)){
                     DboardStockFldObj = form.addField({
                        id: "custpage_db_stock",
                        type: serverWidget.FieldType.SELECT,
                        label: "STOCK",
                        source: "customrecord_advs_vm",
                        container: "custpage_fil_gp_db"
                    });
                    if(paramsasobj.DBStock){
                        DboardStockFldObj.defaultValue = paramsasobj.DBStock;
                    }
                    DboardStockFldObj.updateDisplaySize({
                        height : 60,
                        width : 38
                    })
                }
                if(param.includes(56)){
                    var DboardUnitConditionFldObj = form.addField({
                        id: "custpage_db_unit_condition",
                        type: serverWidget.FieldType.SELECT,
                        label: "UNIT CONDITION",
                        source: "customlist_repairable_type",
                        container: "custpage_fil_gp_db"
                    })
                }
                if(param.includes(50)){
                    var DboardSalesrepFldObj = form.addField({
                        id: "custpage_db_salesrep",
                        type: serverWidget.FieldType.SELECT,
                        label: "SALESREP",
                        source: "employee",
                        container: "custpage_fil_gp_db"
                    })
                }
                if(param.includes(51)){
                    var DboardTruckReadyFldObj = form.addField({
                        id: "custpage_db_truckready",
                        type: serverWidget.FieldType.SELECT,
                        label: "TRUCK READY",
                        source: null,
                        container: "custpage_fil_gp_db"
                    })
                    DboardTruckReadyFldObj.addSelectOption({
                        value: '',
                        text: ''
                    });
                    DboardTruckReadyFldObj.addSelectOption({
                        value: '1',
                        text: 'YES'
                    });
                    DboardTruckReadyFldObj.addSelectOption({
                        value: '0',
                        text: 'NO'
                    });
                }
                if(param.includes(52)){
                    var DboardWashedFldObj = form.addField({
                        id: "custpage_db_washed",
                        type: serverWidget.FieldType.SELECT,
                        label: "Washed",
                        source: null,
                        container: "custpage_fil_gp_db"
                    })
                    DboardWashedFldObj.addSelectOption({
                        value: '',
                        text: ''
                    });
                    DboardWashedFldObj.addSelectOption({
                        value: '1',
                        text: 'YES'
                    });
                    DboardWashedFldObj.addSelectOption({
                        value: '0',
                        text: 'NO'
                    });
                }
                if(param.includes(53)){
                    var DboardMCOOFldObj = form.addField({
                        id: "custpage_db_mcoo",
                        type: serverWidget.FieldType.SELECT,
                        label: "MC/OO",
                        source: "customlist_advs_delivery_board_mcoo",
                        container: "custpage_fil_gp_db"
                    })
                }
                if(param.includes(57)){
                    var DboardSalesQuoteFldObj = form.addField({
                        id: "custpage_db_sales_quote",
                        type: serverWidget.FieldType.SELECT,
                        label: "Sales Quote",
                        source: null,
                        container: "custpage_fil_gp_db"
                    })
                    DboardSalesQuoteFldObj.addSelectOption({
                        value: '',
                        text: ''
                    });
                    DboardSalesQuoteFldObj.addSelectOption({
                        value: '1',
                        text: 'YES'
                    });
                    DboardSalesQuoteFldObj.addSelectOption({
                        value: '0',
                        text: 'NO'
                    });
                    // log.debug('paramsasobj',paramsasobj);
                    if(paramsasobj.DBsalesQuote){
                        DboardSalesQuoteFldObj.defaultValue = paramsasobj.DBsalesQuote;
                    }
                }
                if(param.includes(600)){
                    var DboardContractFldObj = form.addField({
                        id: "custpage_db_contract",
                        type: serverWidget.FieldType.SELECT,
                        label: "Contract",
                        source: "customlist_advs_ss_deli_contract_field",
                        container: "custpage_fil_gp_db"
                    });
                    if (DBContract != "" && DBContract != undefined && DBContract != null) {
                        DboardContractFldObj.defaultValue = DBContract
                    }
                }
                if(param.includes(59)){
                    var _DboardLocationFldObj = form.addField({
                        id: "custpage_db_location",
                        type: serverWidget.FieldType.SELECT,
                        label: "Location",
                        source: "location",
                        container: "custpage_fil_gp_db"
                    });
                    if (DBLocation != "" && DBLocation != undefined && DBLocation != null) {
                        _DboardLocationFldObj.defaultValue = DBLocation
                    }
                }





                //CREATING DELIVERY SUBLIST
                var deliverysublist = createdeliverysublist(paramsasobj,form, paramsasobj.vinID, paramsasobj.locatId, paramsasobj._vinText, DboardVinFldObj, DboardCustomerFldObj,
                    DboardSalesrepFldObj, DboardTruckReadyFldObj, DboardWashedFldObj, DboardMCOOFldObj,
                    paramsasobj.DBVin, paramsasobj.DBCustomer, paramsasobj.DBSalesRep, paramsasobj.DBTruckReady, paramsasobj.DBWashed, paramsasobj.DBmc00, paramsasobj.DBClaim,
                    paramsasobj.DBStock,
                    paramsasobj.DBUnitCondition, DBContract, DBLocation, DboardClaimFldObj, DboardStockFldObj,
                    DboardUnitConditionFldObj, DboardContractFldObj, _DboardLocationFldObj,paramsasobj.DBsalesQuote);

            }catch (e)
            {
                log.debug('error',e.toString());
            }
        }
        function createdeliverysublist(paramsasobj,form, vinID, locatId, _vinText, DboardVinFldObj, DboardCustomerFldObj,
                                       DboardSalesrepFldObj, DboardTruckReadyFldObj, DboardWashedFldObj,
                                       DboardMCOOFldObj, DBVin, DBCustomer, DBSalesRep, DBTruckReady,
                                       DBWashed, DBmc00, DBClaim, DBStock, DBUnitCondition, DBContract,
                                       DBLocation, DboardClaimFldObj, DboardClaimFldObj, DboardStockFldObj,
                                       DboardUnitConditionFldObj, DboardContractFldObj, _DboardLocationFldObj,DBsalesQuote) {

            var DepositDeliverysublist = form.addSublist({
                id: "custpage_sublist_deposit_delivery",
                type: serverWidget.SublistType.LIST,
                label: "List",
                tab: "custpage_delivery_tab"
            });

            var Editfld = DepositDeliverysublist.addField({
                id: "cust_delivery_edit",
                type: serverWidget.FieldType.TEXT,
                label: "Edit",
            });
            var salerepfld = DepositDeliverysublist.addField({
                id: "cust_delivery_salesrep",
                type: serverWidget.FieldType.SELECT,
                label: "Salesman",
                source: "employee"
            });
            salerepfld.updateDisplayType({
                displayType: "inline"
            });

            var Locationfld = DepositDeliverysublist.addField({
                id: "cust_delivery_location",
                type: serverWidget.FieldType.SELECT,
                label: "Location",
                source: "location"
            });
            Locationfld.updateDisplayType({
                displayType: "inline"
            });
            var etadays = DepositDeliverysublist.addField({
                id: "cust_delivery_date",
                type: serverWidget.FieldType.TEXT,
                label: "ETA"
            });
            etadays.updateDisplayType({
                displayType: "inline"
            });

            var customerfld = DepositDeliverysublist.addField({
                id: "cust_delivery_custname",
                type: serverWidget.FieldType.SELECT,
                label: "Name",
                source: "customer"
            });
            customerfld.updateDisplayType({
                displayType: "inline"
            });
            var truckunitfld = DepositDeliverysublist.addField({
                id: "cust_delivery_truck_unit",
                type: serverWidget.FieldType.TEXT,
                label: "Truck Unit #"
            });
            truckunitfld.updateDisplayType({
                displayType: "inline"
            });

            var gpsx2fld = DepositDeliverysublist.addField({
                id: "cust_delivery_gpsx2",
                type: serverWidget.FieldType.SELECT,
                label: "GPS X2",
                source:'customlist_advs_gps_x2'
            });
            gpsx2fld.updateDisplayType({
                displayType: "inline"
            });

            var truckreadyfld = DepositDeliverysublist.addField({
                id: "cust_delivery_truck_ready",
                type: serverWidget.FieldType.CHECKBOX,
                label: "Truck Ready"
            });
            truckreadyfld.updateDisplayType({
                displayType: "inline"
            });

            DepositDeliverysublist.addField({
                id: "cust_delivery_truck_wash",
                type: serverWidget.FieldType.CHECKBOX,
                label: "Washed"
            }).updateDisplayType({
                displayType: "inline"
            });

            var approveddeliveryfld = DepositDeliverysublist.addField({
                id: "cust_delivery_clear_deliver",
                type: serverWidget.FieldType.SELECT,
                label: "Approved For Delivery",
                source:'customlist_advs_app_del'
            });
            approveddeliveryfld.updateDisplayType({
                displayType: "inline"
            });
            var clearedReleasefld = DepositDeliverysublist.addField({
                id: "cust_delivery_clear_release",
                type: serverWidget.FieldType.TEXT,
                label: "Cleared for Release"
            });
            clearedReleasefld.updateDisplayType({
                displayType: "inline"
            });

           var leaseQuote =  DepositDeliverysublist.addField({
                id: "cust_delivery_sales_quote",
                type: serverWidget.FieldType.CHECKBOX,
                label: "Lease Quote"
            }).updateDisplayType({
                displayType: "inline"
            });

            var stateDriverLicensefld = DepositDeliverysublist.addField({
                id: "cust_delivery_state_driver_license",
                type: serverWidget.FieldType.TEXT,
                label: "State of Driver's License"
            });
            stateDriverLicensefld.updateDisplayType({
                displayType: "inline"
            });

            var personalPropertyTaxAmtfld = DepositDeliverysublist.addField({
                id: "cust_delivery_pp_tax_amount",
                type: serverWidget.FieldType.TEXT,
                label: "Personal Property Tax Amount"
            });
            personalPropertyTaxAmtfld.updateDisplayType({
                displayType: "inline"
            });

            DepositDeliverysublist.addField({
                id: "cust_delivery_title_fee",
                type: serverWidget.FieldType.TEXT,
                label: "Title Fee Amount"
            }).updateDisplayType({
                displayType: "inline"
            });
            var insapplyFld = DepositDeliverysublist.addField({
                id: "cust_delivery_insurance_deal",
                type: serverWidget.FieldType.CHECKBOX,
                label: "Insurance Application Received"
            });
            insapplyFld.updateDisplayType({
                displayType: "inline"
            });

            DepositDeliverysublist.addField({
                id: "cust_delivery_registration_state",
                type: serverWidget.FieldType.TEXT,
                label: "Registration State"
            }).updateDisplayType({
                displayType: "inline"
            });
            DepositDeliverysublist.addField({
                id: "cust_delivery_new_lessee",
                type: serverWidget.FieldType.CHECKBOX,
                label: "New Lessee"
            }).updateDisplayType({
                displayType: "inline"
            });
            DepositDeliverysublist.addField({
                id: "cust_delivery_total_lease",
                type: serverWidget.FieldType.TEXT,
                label: "Total Lease Inception"
            }).updateDisplayType({
                displayType: "inline"
            });

            DepositDeliverysublist.addField({
                id: "cust_delivery_deposit",
                type: serverWidget.FieldType.TEXT,
                label: "Deposit"
            }).updateDisplayType({
                displayType: "inline"
            });

            DepositDeliverysublist.addField({
                id: "cust_delivery_pu_payment",
                type: serverWidget.FieldType.TEXT,
                label: "P/U Payment"
            }).updateDisplayType({
                displayType: "inline"
            });

            DepositDeliverysublist.addField({
                id: "cust_delivery_balance",
                type: serverWidget.FieldType.TEXT,
                label: "Balance"
            }).updateDisplayType({
                displayType: "inline"
            });
            DepositDeliverysublist.addField({
                id: "cust_delivery_truck_contract",
                type: serverWidget.FieldType.TEXT,
                label: "Contract"
            }).updateDisplayType({
                displayType: "inline"
            });
            DepositDeliverysublist.addField({ //mc/oo
                id: "cust_delivery_truck_mcoo",
                type: serverWidget.FieldType.SELECT,
                label: "Operating Status",
                source: "customlist_advs_delivery_board_mcoo"
            }).updateDisplayType({
                displayType: "inline"
            });

            var closedealfld = DepositDeliverysublist.addField({
                id: "cust_delivery_close_deal",
                type: serverWidget.FieldType.TEXT,
                label: "Days To Close Deal"
            });
            closedealfld.updateDisplayType({
                displayType: "inline"
            });

            var deliveryvinfld = DepositDeliverysublist.addField({
                id: "cust_delivery_vin",
                type: serverWidget.FieldType.SELECT,
                label: "VIN",
                source: "customrecord_advs_vm"
            });
            deliveryvinfld.updateDisplayType({
                displayType: "inline"
            });

            DepositDeliverysublist.addField({
                id: "cust_delivery_stock",
                type: serverWidget.FieldType.SELECT,
                label: "STOCK",
                source: "customrecord_advs_vm"
            }).updateDisplayType({
                displayType: "hidden"
            });



            DepositDeliverysublist.addField({
                id: "cust_delivery_truck_notes",
                type: serverWidget.FieldType.TEXT,
                label: "Notes"
            }).updateDisplayType({
                displayType: "inline"
            });
            // DepositDeliverysublist.addField({ id: "cust_delivery_truck_exception", type: serverWidget.FieldType.TEXT, label: "Exceptions" }).updateDisplayType({ displayType: "inline" });
            DepositDeliverysublist.addField({
                id: "cust_delivery_deposit_id",
                type: serverWidget.FieldType.TEXT,
                label: "Deposit"
            }).updateDisplayType({
                displayType: "hidden"
            });

            var Deliveryboardsearch = search.create({
                type: "customrecord_advs_vm_inv_dep_del_board",
                filters: [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custrecord_advs_in_dep_vin.custrecord_advs_vm_reservation_status", "noneof", "13"],
                    "AND",
                    //["custrecord_advs_in_dep_sales_quote","is","T"],
                    //"AND",
                    ["custrecord_advs_in_dep_trans_link", "noneof", "@NONE@"],
                    "AND",
                    ["custrecord_advs_in_dep_trans_link.mainline", "is", "T"]
                ],
                columns: [
                    search.createColumn({
                        name: "internalid"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_location",
                        label: "Location"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_name",
                        label: "Name"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_sales_rep",
                        label: "SALESMAN"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_eta",
                        label: "ETA"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_days_close_deal",
                        label: "Days To Close Deal "
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_insur_application",
                        label: "Insurance Application"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_clear_delivery",
                        label: "Cleared For Delivery"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_vin",
                        label: "VIN"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_truck_ready",
                        label: "Truck Ready"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_washed",
                        label: "Washed"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_tot_lease_incepti",
                        label: "Total lease Inception"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_deposit",
                        label: "Deposit"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_pu_payment",
                        label: "P/U Payment"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_balance",
                        label: "Balance"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_mc_oo",
                        label: "MC/OO"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_sales_quote",
                        label: "Sales Quote"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_contract",
                        label: "Contract"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_notes",
                        label: "Notes"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_exceptions",
                        label: "Exceptions"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_trans_link",
                        label: "Deposit Link"
                    }),
                    search.createColumn({
                        name: 'custbody_advs_st_out_side_sal_rep',
                        join: 'custrecord_advs_in_dep_trans_link',
                        label: 'Sales Rep'
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_inception",
                        label: "Deposit Inception"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_payment_inception",
                        label: "Payment Inception"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_registration_fee",
                        label: "Registartion Fee"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_title_fee",
                        label: "Title Fee"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_in_dep_pickup_fee",
                        label: "Pickup Fee"
                    }),
                    search.createColumn({
                        name: 'custrecord_advs_tm_truck_ready',
                        join: 'custrecord_advs_in_dep_vin',
                        label: 'Truck Ready'
                    }),
                    search.createColumn({
                        name: 'custrecord_advs_tm_washed',
                        join: 'custrecord_advs_in_dep_vin',
                        label: 'Washed'
                    }),
                    search.createColumn({
                        name: 'custrecord_advs_vm_sales_quote_from_inv',
                        join: 'custrecord_advs_in_dep_vin',
                        label: 'Sales Quote Inventory'
                    }),
                    search.createColumn({
                        name: "custrecord_advs_vm_soft_hld_sale_rep",
                        join: "CUSTRECORD_ADVS_IN_DEP_VIN"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_em_serial_number",
                        join: "CUSTRECORD_ADVS_IN_DEP_VIN"
                    }),
                    search.createColumn({
                        name: 'custrecord__advs_in_dep_claim',
                        label: 'Claim'
                    }),
                    search.createColumn({
                        name: 'custrecord_advs_in_dep_stock',
                        label: 'Stock'
                    }),
                    search.createColumn({
                        name: 'custrecord_advs_in_dep_unit_condition',
                        label: 'Unit Condition'
                    }),
                    "custrecord_advs_reg_state",
                    "custrecord_advs_personal_prop_tax",
                    "custrecord_advs_sate_of_dv_licen",
                    "custrecord_advs_in_dep_title_fee",
                    "custrecord_advs_gps_x2_db",
                    "custrecord_new_lessee",
                    "custrecord_advs_approved_for_del_db"

                ]
            });

            if (DBVin != "" && DBVin != undefined && DBVin != null) {
                Deliveryboardsearch.filters.push(search.createFilter({
                    name: "custrecord_advs_in_dep_vin",
                    operator: search.Operator.ANYOF,
                    values: DBVin
                }))
                DboardVinFldObj.defaultValue = DBVin;
            }

            if (DBCustomer != "" && DBCustomer != undefined && DBCustomer != null) {
                Deliveryboardsearch.filters.push(search.createFilter({
                    name: "custrecord_advs_in_dep_name",
                    operator: search.Operator.ANYOF,
                    values: DBCustomer
                }))
                DboardCustomerFldObj.defaultValue = DBCustomer;
            }
            if (DBSalesRep != "" && DBSalesRep != undefined && DBSalesRep != null) {
                Deliveryboardsearch.filters.push(search.createFilter({
                    name: "custrecord_advs_vm_soft_hld_sale_rep",
                    join: "CUSTRECORD_ADVS_IN_DEP_VIN",
                    operator: search.Operator.ANYOF,
                    values: DBSalesRep
                }))
                DboardSalesrepFldObj.defaultValue = DBSalesRep;
            }
            if (DBTruckReady != "" && DBTruckReady != undefined && DBTruckReady != null) {
                if (DBTruckReady == 1) {
                    Deliveryboardsearch.filters.push(search.createFilter({
                        name: 'custrecord_advs_tm_truck_ready',
                        join: 'custrecord_advs_in_dep_vin',
                        operator: search.Operator.IS,
                        values: true
                    }))
                } else {
                    Deliveryboardsearch.filters.push(search.createFilter({
                        name: 'custrecord_advs_tm_truck_ready',
                        join: 'custrecord_advs_in_dep_vin',
                        operator: search.Operator.IS,
                        values: false
                    }))
                }
                DboardTruckReadyFldObj.defaultValue = DBTruckReady;
            }
            if (DBWashed != "" && DBWashed != undefined && DBWashed != null) {
                if (DBWashed == 1) {
                    Deliveryboardsearch.filters.push(search.createFilter({
                        name: 'custrecord_advs_tm_washed',
                        join: 'custrecord_advs_in_dep_vin',
                        operator: search.Operator.IS,
                        values: true
                    }))
                } else {
                    Deliveryboardsearch.filters.push(search.createFilter({
                        name: 'custrecord_advs_tm_washed',
                        join: 'custrecord_advs_in_dep_vin',
                        operator: search.Operator.IS,
                        values: false
                    }))
                }

                DboardWashedFldObj.defaultValue = DBWashed;
            }
            if (DBmc00 != "" && DBmc00 != undefined && DBmc00 != null) {
                Deliveryboardsearch.filters.push(search.createFilter({
                    name: "custrecord_advs_in_dep_mc_oo",
                    operator: search.Operator.ANYOF,
                    values: DBmc00
                }))
                DboardMCOOFldObj.defaultValue = DBmc00;
            }

            if (DBClaim != "" && DBClaim != undefined && DBClaim != null) {
                Deliveryboardsearch.filters.push(search.createFilter({
                    name: "custrecord__advs_in_dep_claim",
                    operator: search.Operator.ANYOF,
                    values: DBClaim
                }))
                DboardClaimFldObj.defaultValue = DBClaim;
            }
            log.debug('paramsasobj',paramsasobj);
            log.debug('paramsasobj.DBStock',paramsasobj.DBStock);
            if (paramsasobj.DBStock != "" && paramsasobj.DBStock != undefined && paramsasobj.DBStock != null) {
                Deliveryboardsearch.filters.push(search.createFilter({
                    name: "custrecord_advs_in_dep_vin",//"custrecord_advs_in_dep_stock",
                    operator: search.Operator.ANYOF,
                    values: paramsasobj.DBStock
                }))
               // DboardStockFldObj.defaultValue = paramsasobj.DBStock;
            }
            if (DBUnitCondition != "" && DBUnitCondition != undefined && DBUnitCondition != null) {
                Deliveryboardsearch.filters.push(search.createFilter({
                    name: "custrecord_advs_in_dep_unit_condition",
                    operator: search.Operator.ANYOF,
                    values: DBUnitCondition
                }))
                DboardUnitConditionFldObj.defaultValue = DBUnitCondition;
            }
            //log.debug('DBContract',DBContract);
            if (DBContract != "" && DBContract != undefined && DBContract != null) {
                Deliveryboardsearch.filters.push(search.createFilter({
                    name: "custrecord_advs_in_dep_contract",
                    operator: search.Operator.ANYOF,
                    values: DBContract
                }))
                //log.debug('DboardContractFldObj',DboardContractFldObj);
                //DboardContractFldObj.defaultValue = DBContract;
            }
            // log.debug('DBLocation',DBLocation);
            if (DBLocation != "" && DBLocation != undefined && DBLocation != null) {
                Deliveryboardsearch.filters.push(search.createFilter({
                    name: "custrecord_advs_in_dep_location",
                    operator: search.Operator.ANYOF,
                    values: DBLocation
                }))
                //log.debug('_DboardLocationFldObj',_DboardLocationFldObj);
                // _DboardLocationFldObj.defaultValue = DBLocation;
            }
            log.debug('DBsalesQuote',paramsasobj.DBsalesQuote);
            if (paramsasobj.DBsalesQuote != "" && paramsasobj.DBsalesQuote != undefined && paramsasobj.DBsalesQuote != null) {
                var salesquotefil = 'F';
                if(paramsasobj.DBsalesQuote == 1){
                    salesquotefil ='T';
                }else if(paramsasobj.DBsalesQuote == 0){
                    salesquotefil ='F';
                }
                Deliveryboardsearch.filters.push(search.createFilter({
                    name: "custrecord_advs_in_dep_sales_quote",
                    operator: search.Operator.IS,
                    values: salesquotefil
                }))

            }

            var searchResultCount = Deliveryboardsearch.runPaged().count;
            var count = 0;
            Deliveryboardsearch.run().each(function (result) {

                var deliverylocation = result.getValue({
                    name: 'custrecord_advs_in_dep_location'
                }) || '';
                var deliverycustomer = result.getValue({
                    name: 'custrecord_advs_in_dep_name'
                }) || '';
                var deliverysalesrep = result.getValue({
                    name: 'custrecord_advs_in_dep_sales_rep'
                }) || '';
                var deliveryDate = result.getValue({
                    name: 'custrecord_advs_in_dep_eta'
                }) || '';
                var deliveryclosedeal = result.getValue({
                    name: 'custrecord_advs_in_dep_days_close_deal'
                }) || ' ';
                var deliveryinsurance = result.getValue({
                    name: 'custrecord_advs_in_dep_insur_application'
                }) || '';
                var depcleardelivery = result.getValue({
                    name: 'custrecord_advs_in_dep_clear_delivery'
                }) || '';
                var deliveryVin = result.getValue({
                    name: 'custrecord_advs_in_dep_vin'
                }) || '';
                var deliverytruckready = result.getValue({
                    name: 'custrecord_advs_tm_truck_ready',
                    join: 'custrecord_advs_in_dep_vin'
                }) || ''; //result.getValue({ name: 'custrecord_advs_in_dep_truck_ready' }) || '';
                var deliveryWashed = result.getValue({
                    name: 'custrecord_advs_tm_washed',
                    join: 'custrecord_advs_in_dep_vin'
                }) || ''; //result.getValue({ name: 'custrecord_advs_in_dep_washed' }) || '';
                var deliverytotlease = result.getValue({
                    name: 'custrecord_advs_in_dep_tot_lease_incepti'
                }) || '';
                var deliverydeposit = result.getValue({
                    name: 'custrecord_advs_in_dep_deposit'
                }) || '';
                var deliverypupayment = result.getValue({
                    name: 'custrecord_advs_in_dep_pu_payment'
                }) || '';
                var deliverybalance = result.getValue({
                    name: 'custrecord_advs_in_dep_balance'
                }) || '';
                var deliverymcoo = result.getValue({
                    name: 'custrecord_advs_in_dep_mc_oo'
                }) || '';
                var deliverymsalesquote = result.getValue({
                    name: 'custrecord_advs_vm_sales_quote_from_inv',
                    join: 'custrecord_advs_in_dep_vin'
                }) || ''; //result.getValue({ name: 'custrecord_advs_in_dep_sales_quote' }) || '';
                var deliverycontract = result.getText({
                    name: 'custrecord_advs_in_dep_contract'
                }) || '';
                var deliverynotes = result.getValue({
                    name: 'custrecord_advs_in_dep_notes'
                }) || '';
                var deliveryexception = result.getValue({
                    name: 'custrecord_advs_in_dep_exceptions'
                }) || '';
                var deliverydepolink = result.getValue({
                    name: 'custrecord_advs_in_dep_trans_link'
                }) || '';
                var deliverydepotext = result.getText({
                    name: 'custrecord_advs_in_dep_trans_link'
                }) || '';
                // var custDepositSalesrep  = result.getValue({name: 'custbody_advs_st_out_side_sal_rep',join: "custrecord_advs_in_dep_trans_link",})||"";
                var custDepositSalesrep = result.getValue({
                    name: "custrecord_advs_vm_soft_hld_sale_rep",
                    join: "CUSTRECORD_ADVS_IN_DEP_VIN"
                }) || "";
                var serialNumberTruckUnit = result.getValue({
                    name: "custrecord_advs_em_serial_number",
                    join: "CUSTRECORD_ADVS_IN_DEP_VIN"
                }) || "";
                var Depinternalid = result.getValue({
                    name: 'internalid'
                });
                var DepopsitInception = result.getValue({
                    name: 'custrecord_advs_in_dep_inception'
                }) * 1;
                var PayemntInception = result.getValue({
                    name: 'custrecord_advs_in_payment_inception'
                }) * 1;
                var registrationFee = result.getValue({
                    name: 'custrecord_advs_in_dep_registration_fee'
                }) * 1;
                var TitleFee = result.getValue({
                    name: 'custrecord_advs_in_dep_title_fee'
                }) * 1;
                var PickupFee = result.getValue({
                    name: 'custrecord_advs_in_dep_pickup_fee'
                }) * 1;
                var DepClaim = result.getValue({
                    name: 'custrecord__advs_in_dep_claim'
                });
                var DepStock = result.getValue({
                    name: 'custrecord_advs_in_dep_stock'
                });
                var DepUnitCondition = result.getValue({
                    name: 'custrecord_advs_in_dep_unit_condition'
                });

                var Depregstate = result.getText({
                    name: 'custrecord_advs_reg_state'
                });
                var Depdlstate = result.getText({
                    name: 'custrecord_advs_sate_of_dv_licen'
                });
                var Deppptax = result.getValue({
                    name: 'custrecord_advs_personal_prop_tax'
                });
                var Deptitlefee = result.getValue({
                    name: 'custrecord_advs_in_dep_title_fee'
                });
                var Depgpsx2 = result.getValue({
                    name: 'custrecord_advs_gps_x2_db'
                });
                var Depnewlessee = result.getValue({
                    name: 'custrecord_new_lessee'
                });
                var DepApprovedForDelivery = result.getValue({
                    name: 'custrecord_advs_approved_for_del_db'
                });


                var TotalLeaseIncep = DepopsitInception + PayemntInception;

                if (deliverylocation) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_location",
                        line: count,
                        value: deliverylocation
                    });
                }
                if (deliverycustomer) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_custname",
                        line: count,
                        value: deliverycustomer
                    });
                }
                if (custDepositSalesrep) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_salesrep",
                        line: count,
                        value: custDepositSalesrep
                    });
                }
                /* log.debug("deliveryDate", deliveryDate);
                if(deliveryDate){
                    var formattedFromDate = format.format({value: new Date(deliveryDate), type: format.Type.DATE});
                    // log.debug("formattedFromDate", formattedFromDate)
                }*/
                if (deliveryDate) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_date",
                        line: count,
                        value: deliveryDate
                    });
                }

                if (deliveryclosedeal) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_close_deal",
                        line: count,
                        value: deliveryclosedeal
                    });
                }
                if (deliveryinsurance == true || deliveryinsurance == "true") {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_insurance_deal",
                        line: count,
                        value: 'T'
                    });
                }
                // if (depcleardelivery == true || depcleardelivery == "true") {
                if (DepApprovedForDelivery) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_clear_deliver",
                        line: count,
                        value: DepApprovedForDelivery
                    });
                }
                if (deliveryVin) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_vin",
                        line: count,
                        value: deliveryVin
                    });
                }
                if (deliverytruckready) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_truck_ready",
                        line: count,
                        value: 'T'
                    });
                }
                if (deliveryWashed) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_truck_wash",
                        line: count,
                        value: 'T'
                    });
                }
                if (TotalLeaseIncep) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_lease_inception",
                        line: count,
                        value: "$" + addCommasnew(TotalLeaseIncep.toFixed(2))
                    });
                }
                var totalleincep = deliverytotlease; //(TotalLeaseIncep*1)+(registrationFee*1)+(TitleFee*1)+(PickupFee*1);
                //log.debug('totalleincep',totalleincep);
                if (totalleincep) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_total_lease",
                        line: count,
                        value: "$" + addCommasnew(totalleincep)
                    });
                }
                if (deliverydeposit) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_deposit",
                        line: count,
                        value: "$" + addCommasnew((deliverydeposit * 1).toFixed(2))
                    });
                }
                log.debug('deliverypupayment',deliverypupayment);
                if (deliverypupayment!='') {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_pu_payment",
                        line: count,
                        value: "$" + addCommasnew(deliverypupayment) //.toFixed(2)
                    });
                }
                // var balancevalue = TotalLeaseIncep - deliverydeposit;
                var balancevalue = deliverybalance;
                if (balancevalue) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_balance",
                        line: count,
                        value: "$" + addCommasnew((balancevalue * 1).toFixed(2))
                    });
                }
                if (deliverymcoo) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_truck_mcoo",
                        line: count,
                        value: deliverymcoo
                    });
                }
                if (DepClaim) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_claim",
                        line: count,
                        value: DepClaim
                    });
                }
                if (DepStock) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_stock",
                        line: count,
                        value: DepStock
                    });
                }
                if (DepUnitCondition) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_unit_condition",
                        line: count,
                        value: DepUnitCondition
                    });
                }
                if (deliverymsalesquote) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_sales_quote",
                        line: count,
                        value: 'T'
                    });
                }


                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_truck_notes",
                        line: count,
                        value: '<a href="#" onclick=opendeliveryboardNotes(' + Depinternalid + ')> <i class="fa fa-comment" style="color:blue;"></i></a>'//deliverynotes
                    });


                if (deliverycontract) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_truck_contract",
                        line: count,
                        value: deliverycontract
                    });
                }
                log.debug('Depgpsx2',Depgpsx2);
                if(Depgpsx2){
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_gpsx2",
                        line: count,
                        value: Depgpsx2
                    });
                }
               var countofcompletedchecklist =  getChecklistDetails(Depinternalid);
                if(countofcompletedchecklist==18){
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_clear_release",
                        line: count,
                        value: '<a href="#" onclick=opendeliveryboardChecklist(' + Depinternalid + ')> <i class="fa fa-edit" style="color:green;"></i></a>'
                    });
                }else{
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_clear_release",
                        line: count,
                        value: '<a href="#" onclick=opendeliveryboardChecklist(' + Depinternalid + ')> <i class="fa fa-edit" style="color:red;"></i></a>'
                    });
                }

                if(Depregstate){
                    if(Depregstate == 'New Jersey' || Depregstate == 'Illinois' ||Depregstate == 'Kansas' ){
                        Depregstate = '<span style="color: red">'+Depregstate+'</span>'
                    }
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_state_driver_license",
                        line: count,
                        value: Depregstate
                    });
                }

                if(Deppptax){
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_pp_tax_amount",
                        line: count,
                        value: Deppptax
                    });
                }
               if(Depdlstate){
                   DepositDeliverysublist.setSublistValue({
                       id: "cust_delivery_registration_state",
                       line: count,
                       value: Depdlstate
                   });
               }

                if(Depnewlessee){
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_new_lessee",
                        line: count,
                        value: 'T'
                    });
                }
                if(Deptitlefee){
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_title_fee",
                        line: count,
                        value: Deptitlefee
                    });
                }

                // if(deliveryexception){
                //     DepositDeliverysublist.setSublistValue({ id: "cust_delivery_truck_exception", line: count, value: deliveryexception  });
                // }
                DepositDeliverysublist.setSublistValue({
                    id: "cust_delivery_edit",
                    line: count,
                    value: '<a href="#" onclick=opendeliveryboard(' + Depinternalid + ')> <i class="fa fa-edit" style="color:blue;"></i></a>'
                });

                var depurl = 'https://8760954.app.netsuite.com/app/accounting/transactions/transaction.nl?id=' + deliverydepolink;

                DepositDeliverysublist.setSublistValue({
                    id: "cust_delivery_deposit_id",
                    line: count,
                    value: '<a href="' + depurl + '" target="_blank">' + deliverydepotext + '</a>'
                });
                if (registrationFee) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_registration_fee",
                        line: count,
                        value: registrationFee
                    });
                }
                if (TitleFee) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_title_fee",
                        line: count,
                        value: TitleFee
                    });
                }
                if (PickupFee) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_pickup_fee",
                        line: count,
                        value: PickupFee
                    });
                }
                if (serialNumberTruckUnit ) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_truck_unit",
                        line: count,
                        value: serialNumberTruckUnit
                    });
                }

                count++;
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
        function  getChecklistDetails(dbid)
        {
            try{
                var customrecord_delivery_board_cklist_ansSearchObj = search.create({
                    type: "customrecord_delivery_board_cklist_ans",
                    filters:
                        [
                            ["custrecord_db_parent_link","anyof",dbid],
                            "AND",
                            ["custrecord_completed","is","T"]
                        ],
                    columns:
                        [
                            "custrecord_name",
                            "custrecord_description",
                            "custrecord_completed",
                            "custrecord_db_parent_link"
                        ]
                });
                var searchResultCount = customrecord_delivery_board_cklist_ansSearchObj.runPaged().count;
                log.debug("customrecord_delivery_board_cklist_ansSearchObj result count",searchResultCount);
                return searchResultCount;
            }catch (e)
            {
                log.debug('error in checklist',e.toString())
            }
        }
        return {onRequest}

    });

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
                    var UserObj = runtime.getCurrentUser();
                    var UserSubsidiary = UserObj.subsidiary;
                    var UserLocation = UserObj.location;
                    var Userid = UserObj.id;

                    //PARAMETERS
                    var paramsasobj={};
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
                    //FIELD GROUP
                    var filterGpdb = form.addFieldGroup({
                        id: "custpage_fil_gp_db",
                        label: "Filters"
                    });

                    ////////////////DELIVERY BOARD FILTERS/////////////////////////////
                    deliveryBoardFilters(form,DBContract,DBLocation,paramsasobj)

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

                var DboardVinFldObj = form.addField({
                    id: "custpage_db_vin",
                    type: serverWidget.FieldType.SELECT,
                    label: "VIN",
                    source: "customrecord_advs_vm",
                    container: "custpage_fil_gp_db"
                })

                var DboardCustomerFldObj = form.addField({
                    id: "custpage_db_customer",
                    type: serverWidget.FieldType.SELECT,
                    label: "CUSTOMER",
                    source: "customer",
                    container: "custpage_fil_gp_db"
                })

                var DboardClaimFldObj = form.addField({
                    id: "custpage_db_claim",
                    type: serverWidget.FieldType.SELECT,
                    label: "CLAIM",
                    source: "customrecord_advs_insurance_claim_sheet",
                    container: "custpage_fil_gp_db"
                })

                var DboardStockFldObj = form.addField({
                    id: "custpage_db_stock",
                    type: serverWidget.FieldType.SELECT,
                    label: "STOCK",
                    source: "customrecord_advs_vm",
                    container: "custpage_fil_gp_db"
                })

                var DboardUnitConditionFldObj = form.addField({
                    id: "custpage_db_unit_condition",
                    type: serverWidget.FieldType.SELECT,
                    label: "UNIT CONDITION",
                    source: "customlist_repairable_type",
                    container: "custpage_fil_gp_db"
                })

                var DboardSalesrepFldObj = form.addField({
                    id: "custpage_db_salesrep",
                    type: serverWidget.FieldType.SELECT,
                    label: "SALESREP",
                    source: "employee",
                    container: "custpage_fil_gp_db"
                })
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
                var DboardMCOOFldObj = form.addField({
                    id: "custpage_db_mcoo",
                    type: serverWidget.FieldType.SELECT,
                    label: "MC/OO",
                    source: "customlist_advs_delivery_board_mcoo",
                    container: "custpage_fil_gp_db"
                })


                var DboardSalesQuoteFldObj = form.addField({
                    id: "custpage_db_sales_quote",
                    type: serverWidget.FieldType.SELECT,
                    label: "Sales Quote",
                    source: null,
                    container: "custpage_fil_gp_db"
                })
                DboardSalesQuoteFldObj.addSelectOption({
                    value: '1',
                    text: 'YES'
                });
                DboardSalesQuoteFldObj.addSelectOption({
                    value: '0',
                    text: 'NO'
                });

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

                //CREATING DELIVERY SUBLIST
                var deliverysublist = createdeliverysublist(form, paramsasobj.vinID, paramsasobj.locatId, paramsasobj._vinText, DboardVinFldObj, DboardCustomerFldObj,
                    DboardSalesrepFldObj, DboardTruckReadyFldObj, DboardWashedFldObj, DboardMCOOFldObj,
                    paramsasobj.DBVin, paramsasobj.DBCustomer, paramsasobj.DBSalesRep, paramsasobj.DBTruckReady, paramsasobj.DBWashed, paramsasobj.DBmc00, paramsasobj.DBClaim, paramsasobj.DBStock,
                    paramsasobj.DBUnitCondition, DBContract, DBLocation, DboardClaimFldObj, DboardStockFldObj,
                    DboardUnitConditionFldObj, DboardContractFldObj, _DboardLocationFldObj);

            }catch (e)
            {
                log.debug('error',e.toString());
            }
        }
        function createdeliverysublist(form, vinID, locatId, _vinText, DboardVinFldObj, DboardCustomerFldObj,
                                       DboardSalesrepFldObj, DboardTruckReadyFldObj, DboardWashedFldObj,
                                       DboardMCOOFldObj, DBVin, DBCustomer, DBSalesRep, DBTruckReady,
                                       DBWashed, DBmc00, DBClaim, DBStock, DBUnitCondition, DBContract,
                                       DBLocation, DboardClaimFldObj, DboardClaimFldObj, DboardStockFldObj,
                                       DboardUnitConditionFldObj, DboardContractFldObj, _DboardLocationFldObj) {

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

            var Locationfld = DepositDeliverysublist.addField({
                id: "cust_delivery_location",
                type: serverWidget.FieldType.SELECT,
                label: "Location",
                source: "location"
            });
            Locationfld.updateDisplayType({
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

            var salerepfld = DepositDeliverysublist.addField({
                id: "cust_delivery_salesrep",
                type: serverWidget.FieldType.SELECT,
                label: "Sales Rep",
                source: "employee"
            });
            salerepfld.updateDisplayType({
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

            var closedealfld = DepositDeliverysublist.addField({
                id: "cust_delivery_close_deal",
                type: serverWidget.FieldType.TEXT,
                label: "Days To Close Deal"
            });
            closedealfld.updateDisplayType({
                displayType: "inline"
            });

            var insapplyFld = DepositDeliverysublist.addField({
                id: "cust_delivery_insurance_deal",
                type: serverWidget.FieldType.CHECKBOX,
                label: "Insurance Application"
            });
            insapplyFld.updateDisplayType({
                displayType: "inline"
            });

            var cleardeliveryfld = DepositDeliverysublist.addField({
                id: "cust_delivery_clear_deliver",
                type: serverWidget.FieldType.CHECKBOX,
                label: "Cleared For Delivery"
            });
            cleardeliveryfld.updateDisplayType({
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
            DepositDeliverysublist.addField({
                id: "cust_delivery_lease_inception",
                type: serverWidget.FieldType.TEXT,
                label: "Lease Inception"
            }).updateDisplayType({
                displayType: "inline"
            });
            DepositDeliverysublist.addField({
                id: "cust_delivery_registration_fee",
                type: serverWidget.FieldType.TEXT,
                label: "Registartion Fee"
            }).updateDisplayType({
                displayType: "inline"
            });
            DepositDeliverysublist.addField({
                id: "cust_delivery_title_fee",
                type: serverWidget.FieldType.TEXT,
                label: "Title Fee"
            }).updateDisplayType({
                displayType: "inline"
            });
            DepositDeliverysublist.addField({
                id: "cust_delivery_pickup_fee",
                type: serverWidget.FieldType.TEXT,
                label: "Pickup Fee"
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
                id: "cust_delivery_truck_mcoo",
                type: serverWidget.FieldType.SELECT,
                label: "MC/OO",
                source: "customlist_advs_delivery_board_mcoo"
            }).updateDisplayType({
                displayType: "inline"
            });
            DepositDeliverysublist.addField({
                id: "cust_delivery_claim",
                type: serverWidget.FieldType.SELECT,
                label: "CLAIM",
                source: "customrecord_advs_insurance_claim_sheet"
            }).updateDisplayType({
                displayType: "inline"
            });
            DepositDeliverysublist.addField({
                id: "cust_delivery_stock",
                type: serverWidget.FieldType.SELECT,
                label: "STOCK",
                source: "customrecord_advs_vm"
            }).updateDisplayType({
                displayType: "inline"
            });
            DepositDeliverysublist.addField({
                id: "cust_delivery_unit_condition",
                type: serverWidget.FieldType.SELECT,
                label: "UNIT CONDITION",
                source: "customlist_repairable_type"
            }).updateDisplayType({
                displayType: "inline"
            });

            DepositDeliverysublist.addField({
                id: "cust_delivery_sales_quote",
                type: serverWidget.FieldType.CHECKBOX,
                label: "Sales Quote"
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
            if (DBStock != "" && DBStock != undefined && DBStock != null) {
                Deliveryboardsearch.filters.push(search.createFilter({
                    name: "custrecord_advs_in_dep_stock",
                    operator: search.Operator.ANYOF,
                    values: DBStock
                }))
                DboardStockFldObj.defaultValue = DBStock;
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
                    name: '	custrecord_advs_in_dep_unit_condition'
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
                if (depcleardelivery == true || depcleardelivery == "true") {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_clear_deliver",
                        line: count,
                        value: 'T'
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
                if (deliverypupayment) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_pu_payment",
                        line: count,
                        value: "$" + addCommasnew(deliverypupayment.toFixed(2))
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

                if (deliverynotes) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_truck_notes",
                        line: count,
                        value: deliverynotes
                    });
                }

                if (deliverycontract) {
                    DepositDeliverysublist.setSublistValue({
                        id: "cust_delivery_truck_contract",
                        line: count,
                        value: deliverycontract
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

        return {onRequest}

    });

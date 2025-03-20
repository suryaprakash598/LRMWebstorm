/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/record', 'N/runtime', 'N/search','./advs_lib_rental_leasing','./advs_lib_util','N/format'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (record, runtime, search,lib_rental,libUtil,format) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
            var searhResult;
            try{
                searhResult =   search.create({
                    type: "customrecord_advs_lm_lease_card_child",
                    filters:
                        [
                            ["custrecord_advs_lm_lc_c_link.custrecord_advs_l_h_status","anyof","5"],
                            "AND",
                            ["custrecord_advs_r_p_invoice.mainline","is","T"],
                            "AND",
                            ["custrecord_advs_r_p_invoice.amountpaid","equalto","0.00"],
                            "AND",
                            ["custrecord_late_charge_invoice_ref","anyof","@NONE@"],
                            "AND",
                            ["formulanumeric: ROUND({today}-{custrecord_advs_r_p_invoice.trandate})","greaterthanorequalto","10"]
                        ],
                    columns:
                        [
                            search.createColumn({name: "internalid", label: "Internal ID"}),
                            search.createColumn({name: "custrecord_advs_lm_lc_c_link", label: "Lease Card Link"}),
                            search.createColumn({
                                name: "custrecord_advs_l_h_customer_name",
                                join: "CUSTRECORD_ADVS_LM_LC_C_LINK",
                                label: "Customer Name"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_l_h_subsidiary",
                                join: "CUSTRECORD_ADVS_LM_LC_C_LINK",
                                label: "Customer Subsidiary"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_l_h_location",
                                join: "CUSTRECORD_ADVS_LM_LC_C_LINK",
                                label: "Location."
                            }),
                            search.createColumn({
                                name: "custrecord_advs_l_h_sale_rep",
                                join: "CUSTRECORD_ADVS_LM_LC_C_LINK",
                                label: "Sales Rep"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_la_vin_bodyfld",
                                join: "CUSTRECORD_ADVS_LM_LC_C_LINK",
                                label: "Sales Rep"
                            }),
                            search.createColumn({
                                name: "amount",
                                join: "CUSTRECORD_ADVS_R_P_INVOICE",
                                label: "Amount"
                            }),
                            search.createColumn({name: "custrecord_advs_r_p_invoice"})


                        ]
                });

                return searhResult;
            }catch(e){
                searhResult =   null;
                log.error("getInputData",e.message);
            }
        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            try {

                var data = JSON.parse(mapContext.value);
                log.error("datadata", data);
                var recId       = data.values["internalid"].value;
                var leaseid  = data.values["custrecord_advs_lm_lc_c_link"].value;
                var custID     = data.values["custrecord_advs_l_h_customer_name.CUSTRECORD_ADVS_LM_LC_C_LINK"].value;
                var subsiID     = data.values["custrecord_advs_l_h_subsidiary.CUSTRECORD_ADVS_LM_LC_C_LINK"].value;
                var locId     = data.values["custrecord_advs_l_h_location.CUSTRECORD_ADVS_LM_LC_C_LINK"].value;
                var salesrep     = data.values["custrecord_advs_l_h_sale_rep.CUSTRECORD_ADVS_LM_LC_C_LINK"].value;
                var vinid     = data.values["custrecord_advs_la_vin_bodyfld.CUSTRECORD_ADVS_LM_LC_C_LINK"].value;
                var amount     = data.values["amount.CUSTRECORD_ADVS_R_P_INVOICE"];


                var invoiceID     = data.values["custrecord_advs_r_p_invoice"].value;


                var setupData   = lib_rental.invoiceTypeSearch();

                var invoiceType = setupData[libUtil.rentalinvoiceType.lease_latefee]["id"];
                var latefeeItem = setupData[libUtil.rentalinvoiceType.lease_latefee]["regularitem"];
                var latefeePer = setupData[libUtil.rentalinvoiceType.lease_latefee]["latefeeper"];

                var LateFee =   0;
                if(latefeePer){
                    latefeePer  =   parseFloat(latefeePer);latefeePer   =   latefeePer*1;
                    LateFee =   ((amount*latefeePer)/100);
                    LateFee =   LateFee*1;LateFee=LateFee.toFixed(2);LateFee=LateFee*1;
                }

                log.debug("LateFee",amount+"=>"+latefeePer+"=>"+LateFee+"=>"+invoiceID);


                var response_object = {};
                response_object.id                    = recId;
                response_object.leaseid               = leaseid;
                response_object.customer              = custID;
                response_object.subsidiary            = subsiID;
                response_object.location              = locId;
                response_object.salesrep              = salesrep||"";
                response_object.amount                = amount;
                response_object.invoiceid             = invoiceID;
                response_object.vinid                 = vinid;


                response_object.invoicetype           = invoiceType;
                response_object.latefeeitem           = latefeeItem;
                response_object.latefee               = LateFee;
                mapContext.write(recId,response_object);

            }catch(e){
                log.error("map_error",e.message);
            }
        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {
            try {
                var reduce_key = reduceContext.key;

                for (var i = 0; i < reduceContext.values.length; i++) {
                    var jsonData = JSON.parse(reduceContext.values[i]);

                    var recId = jsonData.id;
                    var leaseId = jsonData.leaseid;
                    var customerId = jsonData.customer;
                    var subsidiaryId = jsonData.subsidiary;
                    var locationId = jsonData.location;
                    var salesRep = jsonData.salesrep;
                    var amount = jsonData.amount;
                    var invoiceId = jsonData.invoiceid;
                    var invoiceType = jsonData.invoicetype;
                    var lateFeeItem = jsonData.latefeeitem;
                    var lateFee = jsonData.latefee;
                    var nsfCharge = jsonData.nsfcharge;
                    var nsfItem = jsonData.nsfitem;
                    var vinid = jsonData.vinid;

                    var today   =   new Date();

                    var tranDate    =   format.parse({
                        value:today,
                        type: format.Type.DATE
                    });
                    log.debug("tranDate",tranDate+"=>"+lateFeeItem+"=>"+lateFee);

                    var InvoiceREc	=	record.create({type:"invoice",isDynamic:true});
                    InvoiceREc.setText({fieldId:"customform", text:libUtil.TransactionForm.leaseInvoice});
                    InvoiceREc.setValue({fieldId:"entity", value:customerId});
                    InvoiceREc.setValue({fieldId:"subsidiary", value:subsidiaryId});
                    InvoiceREc.setValue({fieldId:"trandate", value:tranDate});
                    InvoiceREc.setValue({fieldId:"location", value:locationId});
                    // InvoiceREc.setValue({fieldId:"approvalstatus", value:2});
                    InvoiceREc.setValue({fieldId:"salesrep", value:salesRep||""});
                    InvoiceREc.setValue({fieldId:"custbody_advs_lease_head", value:leaseId});
                    InvoiceREc.setValue({fieldId:"custbody_advs_invoice_type",value: invoiceType});
                    InvoiceREc.setValue({fieldId:"custbody_advs_created_from",value: invoiceId});


                    if(lateFee >0){
                        InvoiceREc.selectNewLine({sublistId:"item"});
                        InvoiceREc.setCurrentSublistValue({sublistId:"item", fieldId:"item", value:lateFeeItem});
                        InvoiceREc.setCurrentSublistValue({sublistId:"item", fieldId:"quantity", value:1});
                        InvoiceREc.setCurrentSublistValue({sublistId:"item", fieldId:"rate", value:lateFee});
                        InvoiceREc.setCurrentSublistValue({sublistId:"item", fieldId:"description", value:"Late Fee"});
                        InvoiceREc.setCurrentSublistValue({sublistId:"item", fieldId:"amount", value:lateFee});
                        InvoiceREc.setCurrentSublistValue({sublistId:"item", fieldId:"custcol_advs_st_applied_to_vin",value:vinid});
                        InvoiceREc.commitLine({sublistId:"item"});
                    }

                    var LateFeInvID = InvoiceREc.save({enableSourcing:true,ignoreMandatoryFields:true});

                    record.submitFields({type:"customrecord_advs_lm_lease_card_child",id:recId,values:{
                        "custrecord_late_charge_invoice_ref":LateFeInvID
                        }});

                }
            }catch(e){
                log.error("reduce",e.message);
            }
        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {
       /*     summaryContext.errors.iterator().each((key, error) => {
                log.error({
                    title: 'Map/Reduce Error',
                    details: error
                });
                // Continue processing other errors
                return true;
            });*/
        }

        return {getInputData, map, reduce, summarize}

    });

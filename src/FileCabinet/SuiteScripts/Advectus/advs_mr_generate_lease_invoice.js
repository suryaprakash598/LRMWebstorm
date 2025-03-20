/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/format', 'N/record', 'N/runtime', 'N/search','./advs_lib_rental_leasing.js','./advs_lib_util.js'],
    /**
     * @param{format} format
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     */
    (format, record, runtime, search,lib_rental,libUtil) => {
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
            var searchRegular;
            try{
                searchRegular = search.create({
                    type: "customrecord_advs_lm_lease_card_child",
                    filters:
                        [
                            ["custrecord_advs_lm_lc_c_link","noneof","@NONE@"],
                            "AND",
                            ["custrecord_advs_lm_lc_c_date","onorbefore","today"],
                            "AND",
                            ["custrecord_advs_r_p_invoice","anyof","@NONE@"]
                            ,"AND",
                            ["custrecord_advs_lm_lc_c_link.custrecord_advs_l_h_status","anyof",libUtil.leaseStatus.active]
                            // ,"AND",
                            // ["internalid","anyof",12947]
                             ,"AND",
                              ["custrecord_advs_lm_lc_c_link","anyof","283"]
                        ],
                    columns:
                        [
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
                            search.createColumn({name: "custrecord_advs_lm_lc_c_date", label: "Date"}),
                            search.createColumn({name: "custrecord_advs_r_p_sche_pay", label: "Scheduled Payment"}),
                            search.createColumn({name: "internalid", label: "Scheduled Payment"}),
                            search.createColumn({name: "custrecord_advs_lm_lc_c_link", label: "Scheduled Payment"}),
                            search.createColumn({name: "custrecord_advs_l_a_actual_mil",join: "CUSTRECORD_ADVS_LM_LC_C_LINK"}),
                            search.createColumn({name: "custrecord_advs_l_a_driven_mileage",join: "CUSTRECORD_ADVS_LM_LC_C_LINK"}),
                            search.createColumn({name: "custrecord_advs_l_a_l_m_limit",join: "CUSTRECORD_ADVS_LM_LC_C_LINK"}),
                            search.createColumn({name: "custrecord_advs_l_a_cur_mnth_used",join: "CUSTRECORD_ADVS_LM_LC_C_LINK"}),
                            search.createColumn({name: "custrecord_advs_la_vin_bodyfld",join: "CUSTRECORD_ADVS_LM_LC_C_LINK"})
                        ]
                });
                log.error("searchRegular",searchRegular);
                return searchRegular;
            }catch(e){
                log.error("getInputData_ERROR",e.message);
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
                var locationID  = data.values["custrecord_advs_l_h_location.CUSTRECORD_ADVS_LM_LC_C_LINK"].value;
                var subsiID     = data.values["custrecord_advs_l_h_subsidiary.CUSTRECORD_ADVS_LM_LC_C_LINK"].value;
                var custID      = data.values["custrecord_advs_l_h_customer_name.CUSTRECORD_ADVS_LM_LC_C_LINK"].value;

                var RegularDate      = data.values["custrecord_advs_lm_lc_c_date"];
                var LeaseLink      = data.values["custrecord_advs_lm_lc_c_link"].value;
                var amount      = data.values["custrecord_advs_r_p_sche_pay"];

                var stMileage           = data.values["custrecord_advs_l_a_mileage.CUSTRECORD_ADVS_LM_LC_C_LINK"];
                var actualMile          = data.values["custrecord_advs_l_a_actual_mil.CUSTRECORD_ADVS_LM_LC_C_LINK"];
                var DrivenMile          = data.values["custrecord_advs_l_a_driven_mileage.CUSTRECORD_ADVS_LM_LC_C_LINK"];
                var Balance             = data.values["custrecord_advs_l_a_cur_mnth_used.CUSTRECORD_ADVS_LM_LC_C_LINK"];
                var Limit               = data.values["custrecord_advs_l_a_l_m_limit.CUSTRECORD_ADVS_LM_LC_C_LINK"];
                var vinId               = data.values["custrecord_advs_la_vin_bodyfld.CUSTRECORD_ADVS_LM_LC_C_LINK"].value;



                var response_object = {};
                response_object.recid               = recId;
                response_object.custid              = custID;
                response_object.subsiid             = subsiID;
                response_object.locid               = locationID;
                response_object.date                = RegularDate;
                response_object.leaselink           = LeaseLink;
                response_object.amount              = amount;

                response_object.stMileage               = stMileage;
                response_object.actualMile              = actualMile;
                response_object.DrivenMile              = DrivenMile;
                response_object.Balance                 = Balance;
                response_object.Limit                   = Limit;
                response_object.vinId                   = vinId;



                mapContext.write(recId,response_object);

            }catch(e){
                log.error("Map_ERROR",e.message);
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
                    var Json_data_A = JSON.parse(reduceContext.values[i]);

                    var recid = Json_data_A.recid;
                    var custid = Json_data_A.custid;
                    var subsiid = Json_data_A.subsiid;
                    var locid = Json_data_A.locid;

                    var date        = Json_data_A.date;
                    var leaselink   = Json_data_A.leaselink;
                    var amount   = Json_data_A.amount;

                    var stMileage      = Json_data_A.stMileage;
                    var actualMile     = Json_data_A.actualMile;
                    var DrivenMile     = Json_data_A.DrivenMile;
                    var Balance        = Json_data_A.Balance;
                    var Limit          = Json_data_A.Limit;
                    var vinId          = Json_data_A.vinId;


                    stMileage = stMileage*1;actualMile = actualMile*1;DrivenMile = DrivenMile*1;
                    Balance = Balance*1;Limit = Limit*1;



                    log.debug("date",date);

                    var setupData   = lib_rental.invoiceTypeSearch();
                    var stockData   = lib_rental.getLeaseStockLines(leaselink);

                    var tranDate    =   format.parse({
                        value:date,
                        type: format.Type.DATE
                    });
                    log.debug("DEARED",custid+"=>"+subsiid+"=>"+locid+"=>"+leaselink);

                    var InvoiceREc	=	record.create({type:"invoice",isDynamic:true});
                    InvoiceREc.setText({fieldId:"customform", text:"ADVS Lease Invoice"});

                    InvoiceREc.setValue({fieldId:"entity", value:custid});
                    InvoiceREc.setValue({fieldId:"subsidiary", value:subsiid});
                    InvoiceREc.setValue({fieldId:"trandate", value:tranDate});
                    InvoiceREc.setValue({fieldId:"location", value:locid});
                    InvoiceREc.setValue({fieldId:"custbody_advs_lease_head", value:leaselink});
                    InvoiceREc.setValue({fieldId:"custbody_advs_invoice_type",value: setupData[libUtil.rentalinvoiceType.lease_reqular]["id"]});


                    InvoiceREc.selectNewLine({sublistId:"item"});
                    InvoiceREc.setCurrentSublistValue({sublistId:"item", fieldId:"item", value:setupData[libUtil.rentalinvoiceType.lease_reqular]["principalItem"]});
                    InvoiceREc.setCurrentSublistValue({sublistId:"item", fieldId:"quantity", value:1});
                    InvoiceREc.setCurrentSublistValue({sublistId:"item", fieldId:"rate", value:amount});
                    InvoiceREc.setCurrentSublistValue({sublistId:"item", fieldId:"description", value:"Regular Lease"});
                    InvoiceREc.setCurrentSublistValue({sublistId:"item", fieldId:"amount", value:amount});
                    InvoiceREc.setCurrentSublistValue({sublistId:"item", fieldId:"custcol_advs_st_applied_to_vin",value:vinId});
                    InvoiceREc.setCurrentSublistValue({sublistId:"item", fieldId:"custcol_advs_st_lease_line_link",value:leaselink});
                    InvoiceREc.commitLine({sublistId:"item"});


                    var invoiceID	=	InvoiceREc.save({ignoreMandatoryFields:true,enableSourcing:true});
                    record.submitFields({type:"customrecord_advs_lm_lease_card_child",id:recid,values:{"custrecord_advs_r_p_invoice":invoiceID}});

                    log.debug("Created Invoice",invoiceID);

                    var getRemainginSche    =   findRemainingSched(leaselink);

                    var remingingSchedule   =   getRemainginSche.remainingSchedule;
                    var outstanding   =   getRemainginSche.outstanding;

                    var MileageBalance  =   (actualMile-DrivenMile);

                    record.submitFields({
                        type:"customrecord_advs_lease_header",
                        id:leaselink,
                        values:{"custrecord_advs_l_h_lst_inv_date":tranDate,
                            "custrecord_advs_l_a_remaing_schedule":remingingSchedule,
                            "custrecord_advs_l_a_outstand_sche":outstanding,
                            // "custrecord_advs_l_a_cur_mnth_used":MileageBalance,
                            // "custrecord_advs_l_a_driven_mileage":actualMile
                        }

                    });
                }

            }catch(e){
                log.error("Reduce_error",e);
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

        }

        function findRemainingSched(leaseId){
            var outStanding = 0;var remainSche  =   0;
            var searchRegular = search.create({
                type: "customrecord_advs_lm_lease_card_child",
                filters:
                    [
                        ["custrecord_advs_r_p_invoice","anyof","@NONE@"],
                        "AND",
                        ["custrecord_advs_lm_lc_c_link","anyof",leaseId]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "COUNT",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_r_p_sche_pay",
                            summary: "SUM",
                            label: "Scheduled Payment"
                        })
                    ]
            });
            searchRegular.run().each(function(result){
                remainSche =   result.getValue({name: "internalid",summary: "COUNT"});
                outStanding =   result.getValue({name: "custrecord_advs_r_p_sche_pay",summary: "SUM"});
                return true;
            });
            var postData = {};
            postData.remainingSchedule = remainSche;
            postData.outstanding = outStanding;
            return postData;
        }
        return {getInputData, map, reduce, summarize}

    });

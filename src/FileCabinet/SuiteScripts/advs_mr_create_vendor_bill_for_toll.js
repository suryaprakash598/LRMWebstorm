/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/https', 'N/record', 'N/search','N/file'],
    /**
     * @param{https} https
     * @param{record} record
     * @param{search} search
     */
    (https, record, search, file) => {
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

            var SearchObj = search.create({
                type: 'customrecord_advs_toll_import',
                filters: [
                    ['isinactive','is','F']
                    ,"AND",
                    ["custrecord_advs_ti_veh_vendor_bill_link","anyof","@NONE@"]
                    ,"AND",
                    ["custrecord_advs_ti_transaction_date","onorbefore","today"],
                    "AND",
                    ["custrecord_advs_ti_veh_invoice_link", "noneof","@NONE@"]
                ],
                columns:[
                    search.createColumn({name:'custrecord_advs_ti_transaction_date'}),
                    search.createColumn({name:'custrecord_advs_ti_cash_cost'}),
                    search.createColumn({name:'custrecord_advs_ti_our_cost'}),
                    search.createColumn({name:'internalid'}),
                    search.createColumn({name:'custrecordcustrecord_advs_ti_vehicle_mas'}),
                    search.createColumn({name:'custrecord_advs_ti_veh_lease_card_link'}),
                    search.createColumn({name:'custrecord_advs_ti_id'}),


                ]

            });
            var searchResults = SearchObj.run().getRange({
                start: 0,
                end: 1000
            });
            log.debug('searchResults',searchResults.length);
            let dataMap = {};
            let results = [];

            if (searchResults.length > 0){
                for (var j = 0; j < searchResults.length; j++){

                    let internalId =  searchResults[j].getValue({name: 'internalid'});
                    let cost = searchResults[j].getValue({name: 'custrecord_advs_ti_cash_cost'});
                    let postdate = searchResults[j].getValue({name: 'custrecord_advs_ti_transaction_date'});
                    let customer = searchResults[j].getValue({name: 'custrecordcustrecord_advs_ti_customer_li'});
                    let ourcost =  searchResults[j].getValue({name: 'custrecord_advs_ti_our_cost'});
                    let vinNumber =  searchResults[j].getValue({name: 'custrecordcustrecord_advs_ti_vehicle_mas'});
                    let leaseNumber =  searchResults[j].getValue({name: 'custrecord_advs_ti_veh_lease_card_link'});
                    let tollId =  searchResults[j].getValue({name: 'custrecord_advs_ti_id'});

                    if (!dataMap[postdate]) {
                        dataMap[postdate] = { id: internalId,ourcost:ourcost,postdate:postdate,customer:customer, toll: [{ internalId,ourcost, postdate,vinNumber,leaseNumber,tollId}] };
                    } else {
                        dataMap[postdate].toll.push({ internalId,ourcost,postdate,vinNumber,leaseNumber,tollId});
                    }
                }

                for (let key in dataMap) {
                    results.push(dataMap[key]);
                }
            }

            log.debug(' results ' , JSON.stringify(results));

            return results;
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

            var data = JSON.parse(mapContext.value);
            var internal_id = data.id;
            var cost = data.cost;
            var postdate = data.postdate;
            var customer = data.customer

            var tollDataArray = new Array()
            if(internal_id){
                try{
                    var globalSettingRecord = record.load({
                        type: 'customrecord_advs_global_setting',
                        id: 1,
                        isDynamic: true
                    });

                    var tollVendor = globalSettingRecord.getValue({
                        fieldId: 'custrecord_advs_toll_vendor'
                    });

                    var tollExpenseAccount = globalSettingRecord.getValue({
                        fieldId: 'custrecord_advs_toll_expense_account'
                    });

                    log.debug(' Creating Vendor Bill For Record' , internal_id)
                    var billRecord = record.create({type: 'vendorbill', isDynamic: true})
                    billRecord.setText({fieldId: 'trandate', text: postdate})
                    billRecord.setValue({fieldId: 'entity', value: tollVendor})

                    for (var j = 0; j < data.toll.length; j++) {
                        var tollData = data.toll[j];
                        tollDataArray.push(tollData.internalId)

                        log.debug('tollData.internalId ' , tollData.internalId + '  tollData.cost >> ' + tollData.ourcost)
                        log.debug('tollData.vinNumber ' , tollData.vinNumber + '  tollData.leaseNumber >> ' + tollData.leaseNumber + ' tollId internalId ' + tollData.internalId)

                        billRecord.selectNewLine({sublistId: 'expense'})
                        billRecord.setCurrentSublistValue({sublistId: 'expense', fieldId: 'account', value: tollExpenseAccount})
                        billRecord.setCurrentSublistValue({sublistId: 'expense', fieldId: 'amount', value: tollData.ourcost})
                        billRecord.setCurrentSublistValue({sublistId: 'expense', fieldId: 'custcol_advs_vehicle_toll_vin_prucahs', value: tollData.vinNumber})
                        billRecord.setCurrentSublistValue({sublistId: 'expense', fieldId: 'custcol_advs_toll_lease_id', value: tollData.leaseNumber})
                        billRecord.setCurrentSublistValue({sublistId: 'expense', fieldId: 'custcol_advs_vehicle_toll_id_purchase', value: tollData.internalId})

                        billRecord.commitLine({sublistId: 'expense'});
                    }
                    try {
                        var billId = billRecord.save({
                            ignoreMandatoryFields: true
                        });
                        log.debug('Bill Created', 'Bill ID: ' + billId);
                    }catch (e){
                        log.debug( ' Error Creating Bill ID: ', e);
                    }
                }catch(e){
                    log.debug(' Error Creating Vendor Bill' , e);
                }

                if(billId){
                    //Load array and set bill link in toll record
                    for(i=0;i<tollDataArray.length;i++){
                        var tollId = tollDataArray[i];

                        var submittedTollValue = record.submitFields({
                            type: 'customrecord_advs_toll_import',
                            id: tollId,
                            values: {
                                'custrecord_advs_ti_veh_vendor_bill_link': billId
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields : true
                            }
                        });
                        log.debug( ' Submitted Toll Id ' , submittedTollValue)
                    }
                }
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

        return {getInputData, map, reduce, summarize}

    });
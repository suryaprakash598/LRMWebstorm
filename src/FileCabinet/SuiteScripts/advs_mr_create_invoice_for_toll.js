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
                    ['isinactive','is','F'],
                    "AND",
                    ["custrecord_advs_ti_veh_invoice_link", "anyof","@NONE@"]
                    //Check Invoice Link Is Not Empty
                ],
                columns:[
                    search.createColumn({name:'custrecordcustrecord_advs_ti_vehicle_mas'}),
                    search.createColumn({name:'custrecordcustrecord_advs_ti_customer_li'}),
                    search.createColumn({name:'custrecordcustrecord_advs_ti_vehicle_loc'}),
                    search.createColumn({name:'custrecord_advs_ti_cash_cost'}),
                    search.createColumn({name:'custrecord_advs_ti_transaction_date'}),
                    search.createColumn({name:'custrecord_advs_ti_veh_lease_card_link'}),
                    search.createColumn({name:'internalid'}),
                    search.createColumn({name:'custrecord_advs_ti_customer_subsidiary'}),
                    search.createColumn({name:'custrecord_advs_ti_id'})

                ]

            });

            var searchResults = [];
            var start = 0;
            var pageSize = 1000;
            var moreResults = true;

            // var searchResults = SearchObj.run().getRange({start: 0, end: 1000});
            while (moreResults) {
                var tempResults = SearchObj.run().getRange({
                    start: start,
                    end: start + pageSize
                });

                log.debug('Fetched records', tempResults.length);

                if (tempResults.length === 0) {
                    moreResults = false;
                } else {
                    searchResults = searchResults.concat(tempResults);
                    start += pageSize;
                }
            }

            log.debug('Total records fetched: ',searchResults.length);

            let dataMap = {};
            let results = [];

            if (searchResults.length > 0){

                for (var j = 0; j < searchResults.length; j++){

                    let internalId =  searchResults[j].getValue({name: 'internalid'});
                    let customer = searchResults[j].getValue({name: 'custrecordcustrecord_advs_ti_customer_li'});
                    let vinNo = searchResults[j].getValue({name: 'custrecordcustrecord_advs_ti_vehicle_mas'});
                    let location = searchResults[j].getValue({name: 'custrecordcustrecord_advs_ti_vehicle_loc'});
                    let cost = searchResults[j].getValue({name: 'custrecord_advs_ti_cash_cost'});
                    let trandate = searchResults[j].getValue({name: 'custrecord_advs_ti_transaction_date'});
                    let leasecard = searchResults[j].getValue({name:'custrecord_advs_ti_veh_lease_card_link'})
                    let subsidiary = searchResults[j].getValue({name:'custrecord_advs_ti_customer_subsidiary'})
                    let toll_id = searchResults[j].getValue({name:'custrecord_advs_ti_id'})

                    if (!dataMap[leasecard]) {
                        dataMap[leasecard] = { id: parseInt(customer),customer:customer,location:location,trandate:trandate,subsidiary:subsidiary, toll: [{ internalId,cost, vinNo,location,trandate,toll_id }] };
                    } else {
                        dataMap[leasecard].toll.push({ internalId,cost,vinNo,location,trandate,toll_id });
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
            var leaseId = data.id;
            var customer = data.customer;
            var location = data.location;
            var trandate = data.trandate;
            var subsidiary = data.subsidiary
            log.debug(' Toll data array ' , customer)

            var tollDataArray = new Array()
            if(customer){
                log.debug(' Creating Invoice For Customer' , customer)
                var invoiceRecord = record.create({type: 'invoice', isDynamic: true,});
                invoiceRecord.setValue({fieldId: 'entity', value: customer});
                invoiceRecord.setText({fieldId: 'trandate', text: trandate});
                invoiceRecord.setValue({fieldId: 'subsidiary', value: subsidiary});
                invoiceRecord.setValue({fieldId: 'location', value: location});
                invoiceRecord.setValue({fieldId: 'custbody_advs_invoice_type', value: 4});
                var totalCostLine = 0
                for (var j = 0; j < data.toll.length; j++) {

                    var globalSettingRecord = record.load({type: 'customrecord_advs_global_setting', id: 1, isDynamic: true});
                    var tollItem = globalSettingRecord.getValue({fieldId: 'custrecord_advs_g_s_tol_inv_item'});
                    var tollItemlrm = globalSettingRecord.getValue({fieldId: 'custrecord_advs_toll_inv_itm'});
                    var tollrate = globalSettingRecord.getValue({fieldId: 'custrecord_advs_g_s_tol_lrm_rate'});

                    var tollData = data.toll[j];
                    //Push InternalId to array to set invoice link
                    tollDataArray.push(tollData.internalId)
                    log.debug('tollData.internalId ' , tollData.internalId)
                    log.debug('tollData.internalId ' , tollData.cost)
                    invoiceRecord.selectNewLine({sublistId: 'item'});
                    invoiceRecord.setCurrentSublistValue({sublistId: 'item', fieldId: 'item', value: tollItem});
                    invoiceRecord.setCurrentSublistValue({sublistId: 'item', fieldId: 'quantity', value: 1});
                    invoiceRecord.setCurrentSublistValue({sublistId: 'item', fieldId: 'rate', value: parseFloat(tollData.cost)});
                    log.debug(' tollData.toll_id.toString() ' , tollData.toll_id.toString())
                    invoiceRecord.setCurrentSublistValue({sublistId: 'item', fieldId: 'custcol_advs_vehicle_toll_id', value: tollData.internalId});
                    invoiceRecord.commitLine({sublistId: 'item'});
                    totalCostLine++
                }

                var finalTotalCostLine = (tollrate*1)*(totalCostLine)
                //CREATE ITEM LINE FOR LRM TOLL CHARGES
                invoiceRecord.selectNewLine({sublistId: 'item'});
                invoiceRecord.setCurrentSublistValue({sublistId: 'item', fieldId: 'item', value: tollItemlrm});
                invoiceRecord.setCurrentSublistValue({sublistId: 'item', fieldId: 'quantity', value: 1});
                invoiceRecord.setCurrentSublistValue({sublistId: 'item', fieldId: 'rate', value: parseFloat(finalTotalCostLine)});
                invoiceRecord.commitLine({sublistId: 'item'});

                try {
                    var invoiceId = invoiceRecord.save();
                    log.debug('Invoice Created', 'Invoice ID: ' + invoiceId);
                }catch (e){
                    log.debug( ' Error Creating Invoice ID: ', e);
                }

                if(invoiceId){
                    //Load array and set invoice link in toll record
                    for(i=0;i<tollDataArray.length;i++){
                        var tollId = tollDataArray[i];

                        var submittedTollValue = record.submitFields({
                            type: 'customrecord_advs_toll_import',
                            id: tollId,
                            values: {
                                'custrecord_advs_ti_veh_invoice_link': invoiceId
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields : true
                            }
                        });
                        log.debug( ' Submitted Toll Id ' , submittedTollValue)
                    }
                }
            }else{
                log.debug(' Customer is empty, So not creating Invoice For', data)
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
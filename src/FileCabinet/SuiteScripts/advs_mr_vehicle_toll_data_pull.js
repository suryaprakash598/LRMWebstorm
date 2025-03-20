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

        var processedData = [];

        const getInputData = (inputContext) => {
            var SearchObj = search.create({
                type: 'customrecord_advs_intergation_credential',
                filters: [
                    ['isinactive','is','F'],
                    'AND',
                    ['internalid','anyof','1']
                ],
                columns:[
                    search.createColumn({name:'custrecord_advs_api_user_name'}),
                    search.createColumn({name:'custrecord_advs_api_user_pass'}),
                    search.createColumn({name:'custrecord_advs_api_req_folder'}),
                    search.createColumn({name:'custrecord_advs_api_res_folder'}),
                    search.createColumn({name:'custrecord_advs_api_auth_tkn_url'}),
                    search.createColumn({name:'custrecord_advs_api_toll_data_url'})
                ]
            });
            return SearchObj;
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
            try{
                let data =	JSON.parse(mapContext.value)
                let userName = data.values['custrecord_advs_api_user_name']
                let password = data.values['custrecord_advs_api_user_pass']
                let reqfolder = data.values['custrecord_advs_api_req_folder']
                let resfolder = data.values['custrecord_advs_api_res_folder']
                let tokenurl = data.values['custrecord_advs_api_auth_tkn_url']
                let tollurl = data.values['custrecord_advs_api_toll_data_url']

                let RecordId = data.id

                let AuthTokenURL =tokenurl
                let TollDataURL  = tollurl
                let currentDate = new Date()

                currentDate.setDate(currentDate.getDate())
                let year = currentDate.getFullYear()
                let month = String(currentDate.getMonth() + 1).padStart(2, '0')
                let day = String(currentDate.getDate()).padStart(2, '0')
                let formattedDate = year+'-'+month+'-'+day
                let formattedNetsuiteDate = month+'/'+day+'/'+year

                //Get Last Trigger Date from Global setting and run the script to date
                var globalSettingRecord = record.load({
                    type: 'customrecord_advs_global_setting',
                    id: 1,
                    isDynamic: true
                });

                var lastPullDate = globalSettingRecord.getText({
                    fieldId: 'custrecord_advs_g_s_toll_last_pull_date'
                });


                //ADD ONE DAY TO LAST PULL DATE
                let  addDay= new Date(lastPullDate)
                addDay.setDate(addDay.getDate() + 1)
                let addedYear = addDay.getFullYear()
                let addedMonth = String(addDay.getMonth() + 1).padStart(2, '0')
                let addedDay = String(addDay.getDate()).padStart(2, '0')
                let lastPullDayPlusOne =  `${addedYear}-${addedMonth}-${addedDay}`

                let finalTollDataURL = TollDataURL+"?limit=900&offset=0&transaction_date_gte="+lastPullDayPlusOne+"&transaction_date_lte="+formattedDate
                log.debug( ' finalTollDataURL ' , finalTollDataURL)

                var bodyObj   =   {
                    "username":userName,
                    "password":password
                };

                let headerObj   = {
                    "Content-Type":"application/json",
                    "Accept":"*/*",
                    "Accept-Encoding":"gzip, deflate, br"
                };

                let responseData = https.post({
                    url: AuthTokenURL,
                    headers: headerObj,
                    body: JSON.stringify(bodyObj)
                });

                let ResponseCode = JSON.parse(responseData.code)
                log.debug(' ResponseCode ' , ResponseCode)
                //Store Get Token API Request with Response
                var dateObj    =   new Date();
                var tollRequestFolder = reqfolder
                var tollResponseFolder = resfolder
                //Save Request Data in cabinet
                let requestFileNameToSave      =  "TOLL_GET_TOKEN_"+dateObj.getFullYear()+"-"+dateObj.getMonth()+"-"+dateObj.getDate()+"-"+dateObj.getHours()+"-"+dateObj.getMinutes()+"-"+dateObj.getSeconds()+"-"+dateObj.getMilliseconds();

                let FileSentRequestObjNew =  file.create({
                    name : requestFileNameToSave+"_REQUEST",
                    folder  :   tollRequestFolder,
                    fileType    :   file.Type.PLAINTEXT,
                    contents    :   JSON.stringify(bodyObj)
                });

                var fileIdRequest = FileSentRequestObjNew.save();

                if(ResponseCode == 200){
                    //Set last pull date/time in global setting
                    record.submitFields({
                        type: 'customrecord_advs_global_setting',
                        id: 1,
                        values: {
                            custrecord_advs_g_s_toll_last_pull_date: formattedNetsuiteDate
                        }
                    });

                    let ResponseCodeBody = JSON.parse(responseData.body)

                    let FileSentResponseObjNew =  file.create({
                        name : requestFileNameToSave+"_RESPONSE",
                        folder  :   tollResponseFolder,
                        fileType    :   file.Type.PLAINTEXT,
                        contents    :   JSON.stringify(ResponseCodeBody)
                    });

                    var fileIdResponse = FileSentResponseObjNew.save();

                    let ResponseCodeAccessToken = ResponseCodeBody.access
                    if(ResponseCodeAccessToken){
                        //Get Response Access Token and hit toll data
                        let SecretKey = "Bearer "+ResponseCodeAccessToken;

                        let tollHeaderObj   = {
                            "Content-Type":"application/json",
                            "Accept":"*/*",
                            "Accept-Encoding":"gzip, deflate, br",
                            "Authorization":SecretKey
                        };

                        let requestTollFileNameToSave      =  "TOLL_GET_TOLL_DATA_"+dateObj.getFullYear()+"-"+dateObj.getMonth()+"-"+dateObj.getDate()+"-"+dateObj.getHours()+"-"+dateObj.getMinutes()+"-"+dateObj.getSeconds()+"-"+dateObj.getMilliseconds();
                        let FileSentRequestTollObjNew =  file.create({
                            name : requestTollFileNameToSave+"_REQUEST",
                            folder  :   tollRequestFolder,
                            fileType    :   file.Type.JSON,
                            contents    :   JSON.stringify(tollHeaderObj)
                        });

                        var fileIdTollRequest = FileSentRequestTollObjNew.save();

                        let responseTollData = https.get({
                            url: finalTollDataURL,
                            headers: tollHeaderObj
                        });

                        let TollResponseCodeBody = JSON.parse(responseTollData.body)

                        let FileSentResponseTollObjNew =  file.create({
                            name : requestTollFileNameToSave+"_RESPONSE",
                            folder  :   tollResponseFolder,
                            fileType    :   file.Type.JSON,
                            contents    :   JSON.stringify(TollResponseCodeBody)
                        });

                        var fileIdTollResponse = FileSentResponseTollObjNew.save();

                        //Save toll data req response in table
                        var tollRequestData	=	record.create({type:'customrecord_advs_toll_data_log', isDynamic:true});
                        tollRequestData.setValue({fieldId: 'custrecord_toll_data_request_file', value:fileIdTollRequest});
                        tollRequestData.setValue({fieldId: 'custrecord_toll_data_response_file', value:fileIdTollResponse});
                        let tollSavedId   =   tollRequestData.save({enableSourcing:true,ignoreMandatoryFields:true});

                        log.debug(' fileIdTollResponse Map ' , fileIdTollResponse + ' Saved Log Id' + tollSavedId)

                        mapContext.write(fileIdTollResponse);

                    }else{
                        log.debug(' ResponseCode ' , ResponseCode)
                    }
                }

            }catch(e){
                log.error('Map Error',e.message);
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
            var fileId = reduceContext.key;
            log.debug(' * File Id In Reduce Data * ' , fileId)

            var file_object = file.load({id: fileId});
            var file_content = file_object.getContents();
            var fileObjectData  = JSON.parse(file_content);
            var results = fileObjectData.results;

            for (var i = 0; i < results.length; i++) {
                var result = results[i];

                log.debug( ' Creating Record' ,result.id)

                try {
                    //Load result and set data into custom record
                    var CustomRec	=	record.create({type:'customrecord_advs_toll_import', isDynamic:true});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_id', value:result.id});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_veh_id', value:result.vehicle.id});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_veh_pla_num', value:result.vehicle.plate_number});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_veh_state', value:result.vehicle.plate_state});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_veh_num', value:result.vehicle.vehicle_number});

                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_veh_make', value:result.vehicle.vehicle_make});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_veh_model', value:result.vehicle.vehicle_model});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_veh_year', value:result.vehicle.year});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_veh_less_renter', value:result.vehicle.lessee_renter});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_vehicle_type_code', value:result.vehicle.vehicle_type_code});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_veh_active', value:result.vehicle.active});

                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_transponder', value:result.transponder});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_driver', value:result.driver});
                    CustomRec.setValue({fieldId: 'custrecord_advs_exit_plaza', value:result.exit_plaza});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_billing_status', value:result.billing_status});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_cash_cost', value:result.cash_cost});

                    let postingDate = formatDate(result.posting_date)
                    let transactionDate = formatDate(result.transaction_date)

                    log.debug(' postingDate ' , postingDate + ' transactionDate ' + transactionDate);

                    CustomRec.setText({fieldId: 'custrecord_advs_ti_posting_date', text:postingDate});
                    CustomRec.setText({fieldId: 'custrecord_advs_ti_transaction_date', text:transactionDate});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_agency', value:result.agency});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_exit_time', value:result.exit_time});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_entry_plaza', value:result.entry_plaza});

                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_amount', value:result.amount});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_our_cost', value:result.our_cost});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_is_billed', value:result.is_billed});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_billed_on', value:result.billed_on});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_confirmation_id', value:result.confirmation_id});

                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_system_remarks', value:result.system_remarks});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_violation', value:result.violation});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_violation_fee', value:result.violation_fee});
                    CustomRec.setValue({fieldId: 'custrecord_advs_ti_inclu_in_driver_inv', value:result.included_in_driver_invoice});

                    let logId   =   CustomRec.save({enableSourcing:true,ignoreMandatoryFields:true});
                    log.debug( ' Log Id' , logId)

                }catch (e){
                    log.debug(' Error Creating Record' , e)
                }

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

        function formatDate(dateValue){
            const originalDate = new Date(dateValue);
            const day = originalDate.getDate().toString().padStart(2, '0');
            const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
            const year = originalDate.getFullYear();
            const formattedDateString = `${month}/${day}/${year}`;
            return formattedDateString;
        }

        return {getInputData, map, reduce, summarize}

    });
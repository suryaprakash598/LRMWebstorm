/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/search', 'N/log','N/redirect'],

    function(record, runtime, search, log,redirect) {

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type
         * @param {Form} scriptContext.form - Current form
         * @Since 2015.2
         */
        function beforeLoad(scriptContext) {
        }

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type
         * @Since 2015.2
         */
        function beforeSubmit(scriptContext) {

        }

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type
         * @Since 2015.2
         */
        function afterSubmit(scriptContext) {
            var Type = scriptContext.type;
            var RecordObj = scriptContext.newRecord;
            var RecordId			=	RecordObj.id;
            var RecordType			=	RecordObj.type;
            log.debug(" RecordId ",RecordId + ' RecordType ' + RecordType);

            if(Type == 'create' || Type == 'edit'){
                //Load Record and populate lease data
                var tollRecord = record.load({
                    type: RecordType,
                    id: RecordId,
                    isDynamic: true
                });

                var vehiclePlate = tollRecord.getValue({fieldId: 'custrecord_advs_ti_veh_pla_num'})
                var vehicleVin = tollRecord.getValue({fieldId: 'custrecord_advs_ti_veh_num'})
                var vehicleId = tollRecord.getValue({fieldId: 'custrecord_advs_ti_veh_id'})
                var postingDate = tollRecord.getText({fieldId: 'custrecord_advs_ti_posting_date'})
                var transactionDate = tollRecord.getText({fieldId: 'custrecord_advs_ti_transaction_date'})
                var isValidVinResult = isValidVin(vehicleVin)
                log.debug('isValidVinResult' , isValidVinResult)
                if(isValidVinResult == true){
                    var stockDetail = getStockDetails(vehiclePlate, transactionDate,vehicleVin)
                    log.debug('stockDetail ', stockDetail)
                    if (stockDetail.length > 0) {
                        var obj = stockDetail[0];
                        //Sourced from lease card in record
                        // tollRecord.setValue({fieldId: 'custrecordcustrecord_advs_ti_vehicle_mas', value: obj.vinId});
                        // tollRecord.setValue({fieldId: 'custrecordcustrecord_advs_ti_customer_li', value: obj.customer});
                        // tollRecord.setValue({fieldId: 'custrecordcustrecord_advs_ti_vehicle_loc', value: obj.location});
                        tollRecord.setValue({fieldId: 'custrecord_advs_ti_veh_lease_card_link', value: obj.recordId});
                        tollRecord.setValue({fieldId: 'custrecord_advs_is_vin_valid', value: true});
                    }
                    tollRecord.save();
                }else{
                    log.debug('Vin Is Not Valid So Setting is invalid in toll table')
                    tollRecord.setValue({fieldId: 'custrecordcustrecord_advs_ti_vehicle_mas', value: ''});
                    tollRecord.setValue({fieldId: 'custrecordcustrecord_advs_ti_customer_li', value: ''});
                    tollRecord.setValue({fieldId: 'custrecordcustrecord_advs_ti_vehicle_loc', value: ''});
                    tollRecord.setValue({fieldId: 'custrecord_advs_ti_veh_lease_card_link', value: ''});

                    tollRecord.setValue({fieldId: 'custrecord_advs_is_vin_valid', value: false});
                    tollRecord.save();

                }

            }
        }

        function isValidVin(vehicleVin){

            var vinSearch = search.create({
                type: "customrecord_advs_vm",
                filters:
                    [
                        ["isinactive","is","F"]
                        ,"AND",
                        ["name","is",vehicleVin]

                    ],
                columns:
                    [
                        search.createColumn({name: "internalid"})
                    ]
            });
            var searchCount = vinSearch.runPaged().count;
            log.debug('searchCount',searchCount);
            if(searchCount > 0){
                return true
            }else{
                return false
            }
        }

        function getStockDetails(vehiclePlate, transactionDate,vehicleVin) {
            log.debug(' * Getting Stock Details *',transactionDate + ' vehiclePlate ' + vehiclePlate + 'vehicleVin' + vehicleVin);
            var stockDetailArray = new Array()
            var dateSplit  = transactionDate.split('-');
            const year = dateSplit[0];
            const month = dateSplit[1];
            const day = dateSplit[2];
            const formattedDate = day+'/'+month+'/'+year

            var leeseSearch = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                    [
                        ["custrecord_advs_la_vin_bodyfld.name","is",vehicleVin]
                        ,"AND",
                        ["custrecord_advs_l_h_start_date","onorbefore",transactionDate],
                        "AND",
                        [["custrecord_advs_l_h_end_date","isempty",""],"OR",["custrecord_advs_l_h_end_date","onorafter",transactionDate]]
                    ],
                columns:
                    [
                        search.createColumn({name: "internalid"}),
                        search.createColumn({name: "custrecord_advs_la_vin_bodyfld"}),
                        search.createColumn({name: "custrecord_advs_l_h_customer_name"}),
                        search.createColumn({name: "custrecord_advs_l_h_location"}),
                    ]
            });

            var searchCount = leeseSearch.runPaged().count;

            leeseSearch.run().each(function(result){
                var	InternalId = result.getValue({name: "internalid"});
                var obj ={}
                obj.recordId = InternalId
                obj.vinId = result.getValue({name: "custrecord_advs_la_vin_bodyfld"});
                obj.customer = result.getValue({name: "custrecord_advs_l_h_customer_name"});
                obj.location = result.getValue({name: "custrecord_advs_l_h_location"});
                obj.stock_avail = true
                stockDetailArray.push(obj)
                return true;
            });

            return stockDetailArray

        }

        return {
            beforeLoad: beforeLoad,
            beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit
        };

    });
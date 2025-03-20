/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/search', 'N/url'],
    /**
     * @param{currentRecord} currentRecord
     * @param{record} record
     * @param{search} search
     */
    function (record, runtime, search, url) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {
            var CurrentRecord = scriptContext.currentRecord;
            var fieldId = scriptContext.fieldId;
            var LineNum = scriptContext.line;

        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {
            try{
                var name = scriptContext.fieldId;
                if(  name == "custpage_db_location"|| name == "custpage_db_contract" || name == "custpage_db_vin" || name == "custpage_db_customer"  || name == "custpage_db_salesrep"  || name == "custpage_db_truckready" || name == "custpage_db_washed" || name == "custpage_db_mcoo"|| name == "custpage_db_claim" || name == "custpage_db_stock" || name == "custpage_db_unit_condition")
                {
                    var curRec = scriptContext.currentRecord;
                    var paramfilters = curRec.getValue({fieldId: 'custpage_filter_params'});
                    var DBVin = curRec.getValue({fieldId: 'custpage_db_vin'});
                    var DBCustomer = curRec.getValue({fieldId: 'custpage_db_customer'});
                    var DBSalesRep = curRec.getValue({fieldId: 'custpage_db_salesrep'});
                    var DBTruckReady = curRec.getValue({fieldId: 'custpage_db_truckready'});
                    var DBWashed = curRec.getValue({fieldId: 'custpage_db_washed'});
                    var DBmc00 = curRec.getValue({fieldId: 'custpage_db_mcoo'});
                    var DBClaim = curRec.getValue({fieldId: 'custpage_db_claim'});
                    var DBStock = curRec.getValue({fieldId: 'custpage_db_stock'});
                    var DBUnitCondition = curRec.getValue({fieldId: 'custpage_db_unit_condition'});
                    var DBLocation = curRec.getValue({fieldId: 'custpage_db_location'});
                    var DBContract = curRec.getValue({fieldId: 'custpage_db_contract'});

                    setWindowChanged(window, false);
                    document.location = url.resolveScript({
                        scriptId: getParameterFromURL('script'),
                        deploymentId: getParameterFromURL('deploy'),
                        params: {
                            'filters':paramfilters,
                            'DBVin':DBVin,
                            'DBCustomer':DBCustomer,
                            'DBSalesRep':DBSalesRep,
                            'DBTruckReady':DBTruckReady,
                            'DBWashed':DBWashed,
                            'DBmc00':DBmc00,
                            'DBClaim':DBClaim,
                            'DBStock':DBStock,
                            'DBUnitCondition':DBUnitCondition,
                            'DBLocation':DBLocation,
                            'DBContract':DBContract

                        }
                    });
                }


            }catch (e)
            {
                log.debug('error',e.toString());
            }

        }
        function getParameterFromURL(param) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == param) {
                    return decodeURIComponent(pair[1]);
                }
            }
            return (false);
        }
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged
        };

    });
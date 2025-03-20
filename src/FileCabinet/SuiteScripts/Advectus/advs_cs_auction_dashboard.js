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
                if( name == "custpage_auc_ttl_restriction"|| name == "custpage_auc_ttl_sent"|| name == "custpage_auc_status"  || name == "custpage_auc_condition"  || name == "custpage_auc_date" || name == "custpage_auc_cleaned" || name == "custpage_auc_vin" || name == "custpage_auc_location")

                {
                    var curRec = scriptContext.currentRecord;
                    var paramfilters = curRec.getValue({fieldId: 'custpage_filter_params'});
                    var AucCondition = curRec.getValue({fieldId:'custpage_auc_condition'});
                    var AucDate =  curRec.getText({fieldId:'custpage_auc_date'});
                    var AucCleaned =  curRec.getValue({fieldId:'custpage_auc_cleaned'});
                    var AucVin = curRec.getValue({fieldId:'custpage_auc_vin'});
                    var AucLoc = curRec.getValue({fieldId:'custpage_auc_location'});
                    var Aucstatus =  curRec.getValue({fieldId: 'custpage_auc_status'});
                    var Aucttlsent =  curRec.getValue({fieldId: 'custpage_auc_ttl_sent'});
                    var Aucttlrest =  curRec.getValue({fieldId: 'custpage_auc_ttl_restriction'});


                    setWindowChanged(window, false);
                    document.location = url.resolveScript({
                        scriptId: getParameterFromURL('script'),
                        deploymentId: getParameterFromURL('deploy'),
                        params: {
                            'filters':paramfilters,
                            'auc_condition':AucCondition,
                            'auc_date':AucDate,
                            'auc_cleaned':AucCleaned,
                            'auc_vin':AucVin,
                            'auc_loc':AucLoc,
                            'auc_ttlsent':Aucttlsent,
                            'auc_ttlrest':Aucttlrest

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
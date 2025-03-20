/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/search','N/format'], //,'./advs_lib_rental_leasing'
/**
 * @param{runtime} runtime
 * @param{search} search
 */
function(runtime, search,format) { //liblease
    
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
        var name    =   scriptContext.fieldId;
        if(name == "custrecord_advs_cpc_date" || name == "custrecord_advs_cpc_exp_date" || name == "custrecord_advs_cpc_late_fee"){
            var curRec  =   scriptContext.currentRecord;
            var stdate          =   curRec.getValue({fieldId:"custrecord_advs_cpc_date"});
            var edDate          =   curRec.getValue({fieldId:"custrecord_advs_cpc_exp_date"});
            var days             =   curRec.getValue({fieldId:"custrecord_advs_cpc_no_days"})*1;
            var lateFee          =   curRec.getValue({fieldId:"custrecord_advs_cpc_late_fee"})*1;
            if(stdate && edDate){
                var difference = getDateDifference(stdate,edDate);
                curRec.setValue("custrecord_advs_cpc_no_days",difference);

                var Amount  =   (difference*lateFee);
                Amount=Amount*1;
                curRec.setValue("custrecord_advs_cpc_amount",Amount);


            }
        }
    }
   function getDateDifference(date1, date2) {
            try {
                // Parse the input dates
                var parsedDate1 = format.parse({ value: date1, type: format.Type.DATE });
                var parsedDate2 = format.parse({ value: date2, type: format.Type.DATE });

                // Calculate the difference in milliseconds
                var differenceMs = parsedDate2.getTime() - parsedDate1.getTime();

                // Convert milliseconds to days
                var differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

                return differenceDays;
            } catch (e) {
                log.error({
                    title: 'Error Calculating Date Difference',
                    details: e
                });
                return null;
            }
        }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {

    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        // validateLine: validateLine,
        // validateInsert: validateInsert,
        // validateDelete: validateDelete,
        // saveRecord: saveRecord
    };
    
});

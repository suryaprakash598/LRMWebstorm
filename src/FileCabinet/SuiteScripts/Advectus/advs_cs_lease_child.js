/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/runtime','./advs_lib_rental_leasing.js'],
/**
 * @param{currentRecord} currentRecord
 * @param{runtime} runtime
 */
function(currentRecord, runtime,libFile) {
    
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
        var name = scriptContext.fieldId;
        var curRec  =   scriptContext.currentRecord;
        if (name == "custrecord_advs_lea_sales_price" || name == "custrecord_advs_l_c_dep_down_pay" || name == "custrecord_advs_l_c_admin_fee") {
            var TotalEquip = curRec.getValue("custrecord_advs_lea_sales_price")*1;
            var DownPayment = curRec.getValue("custrecord_advs_l_c_dep_down_pay")*1;
            var adminFee = curRec.getValue("custrecord_advs_l_c_admin_fee")*1;
            TotalEquip = TotalEquip * 1;
            TotalEquip = (TotalEquip+adminFee);
            TotalEquip = TotalEquip * 1;

            var LoanAmount = (TotalEquip - DownPayment);
            LoanAmount = LoanAmount * 1;
            curRec.setValue({fieldId:"custrecord_advs_l_c_loa_amnt_tot", value:LoanAmount});
        }
        if (name == "custrecord_advs_l_c_an_interest" || name == "custrecord_advs_l_c_number_of_pay_per_yr"
            || name == "custrecord_advs_l_c_loan_p_yr" || name == "custrecord_advs_l_c_loa_amnt_tot") {
            doLoanAmountCalcProcess(scriptContext);
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
    function doLoanAmountCalcProcess(scriptContext){
        var curRec  =   scriptContext.currentRecord;

        var loanAmount = curRec.getValue("custrecord_advs_l_c_loa_amnt_tot") * 1;
        var annualIntere = curRec.getValue("custrecord_advs_l_c_an_interest");
        var PayPerYr = curRec.getValue("custrecord_advs_l_c_number_of_pay_per_yr") * 1;
        var PayinYr = curRec.getValue("custrecord_advs_l_c_loan_p_yr") * 1;
        var adminfee = curRec.getValue("custrecord_advs_l_c_admin_fee") * 1;



        if (loanAmount && annualIntere  && PayinYr) {

           var dataCalc =  libFile.clientcalcamount(loanAmount,annualIntere,12,PayinYr);

           if(dataCalc != null && dataCalc != undefined){
               var amount                       =   dataCalc.amount;
               var totalpayments       =   dataCalc.totalpayments;
               curRec.setValue({fieldId:"custrecord_advs_l_c_sched_paym",value:amount});
               curRec.setValue({fieldId:"custrecord_advs_l_c_schd_no_pay",value:totalpayments});
           }

        }
    }

    return {
        // pageInit: pageInit,
        fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        // validateLine: validateLine,
        // validateInsert: validateInsert,
        // validateDelete: validateDelete,
        // saveRecord: saveRecord,
        doLoanAmountCalcProcess:doLoanAmountCalcProcess,

    };
    
});

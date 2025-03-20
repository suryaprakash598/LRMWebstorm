/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/search'],
/**
 * @param{search} search
 */
function(search) {
    
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
        var FieldId = scriptContext.fieldId;
        var RecordObj = scriptContext.currentRecord;
        var ClaimId = RecordObj.getValue('cust_fi_ins_doc');
        if(FieldId == 'cust_fi_list_stock_no'){
            if(!ClaimId){
                var LeaseNum = RecordObj.getValue('cust_fi_list_stock_no');
                if(LeaseNum){
                    var ResultCount = getInsClaimCount(LeaseNum);
                    if(ResultCount > 0){
                        alert('Insurance Claim already exist for the selected Lease #.Please choose a different Lease # to Proceed further.');
                        RecordObj.setValue({
                            fieldId:'cust_fi_list_stock_no',
                            value: '',
                            ignoreFieldChanged: true
                        });
                    }
                }
            }
        }
        if(FieldId == 'cust_fi_claim_settled'){
            var ClaimSettled = RecordObj.getValue('cust_fi_claim_settled');
            if(ClaimSettled == true){
                var ResolutionFld = RecordObj.getField('cust_fi_resolution_fld');
                ResolutionFld.isMandatory = true;
				RecordObj.setValue({fieldId:'cust_fi_claimstatus',value:3,ignoreFieldChange:true});
            }else{
				RecordObj.setValue({fieldId:'cust_fi_claimstatus',value:'',ignoreFieldChange:true});
			}
        }
    }

    function getInsClaimCount(LeaseNum){
        var SearchObj = search.create({
            type: "customrecord_advs_insurance_claim_sheet",
            filters:
                [
                    ["custrecord_ic_lease","anyof",LeaseNum],
                    "AND",
                    ["isinactive","is","F"]
                ],
            columns:
                [
                    search.createColumn({name: "internalid"})
                ]
        });
        var ResultCount = SearchObj.runPaged().count;
        return ResultCount;
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
      var RecordObj = scriptContext.currentRecord;
        var ClaimSettled = RecordObj.getValue('cust_fi_claim_settled');
        if(ClaimSettled == true){
            var Resolution = RecordObj.getValue('cust_fi_resolution_fld');
            if(!Resolution){
                alert('Please enter Resolution for the Claim Settled');
                return false;
            }
        }
        return true;
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
/*        postSourcing: postSourcing,
        sublistChanged: sublistChanged,
        lineInit: lineInit,
        validateField: validateField,
        validateLine: validateLine,
        validateInsert: validateInsert,
        validateDelete: validateDelete,
        */
    };
    
});

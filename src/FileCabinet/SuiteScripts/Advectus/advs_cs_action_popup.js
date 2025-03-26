/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord','N/format','N/search'],
    /**
     * @param{currentRecord} currentRecord
     */
    function(currentRecord,format,search) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        var oldValue = {}; // Store old values when form loads
        function pageInit(scriptContext) {
            var currentRecord = scriptContext.currentRecord;

            // Store initial values of relevant fields
            oldValue.truckStatus = currentRecord.getValue({ fieldId: 'custpage_auction_truckstatus' });
            oldValue.modulestatus = currentRecord.getValue({ fieldId: 'custpage_status' });

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
            var name    =   scriptContext.fieldId
            var currentRecord  =   scriptContext.currentRecord
            if(name == "custpage_date_auction"){
                const today = new Date()
                var actionDate   =   currentRecord.getText({fieldId:"custpage_date_auction"})
                const futureDate = new Date(actionDate)
                if (futureDate < today) {
                    alert("Error: The future date cannot be earlier than today.")
                    return false
                } else {
                    const timeDifference = futureDate - today
                    const daysDifference = timeDifference / (1000 * 3600 * 24)
                    currentRecord.setValue({fieldId:"custpage_till_date_auction",value:Math.ceil(daysDifference)});
                }
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
            var currentRecord = context.currentRecord;

            var newTruckStatus = currentRecord.getValue({ fieldId: 'custpage_auction_truckstatus' });
            var newModuleStatus = currentRecord.getValue({ fieldId: 'custpage_status' });

            // Check if truck status changed and if "Location To" is updated accordingly
            if (newModuleStatus ==11) {  //newModuleStatus ==10 ||
                if (oldValue.truckStatus == newTruckStatus ) {
                    dialog.alert({
                        title: 'Validation Error',
                        message: 'You must change "Truck Status" to Disposed when "Status" is changed to  Closed Out.'
                    });
                    return false; // Prevents form submission
                }
            }
            return true;
        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged
        };

    });
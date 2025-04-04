/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/search','N/url', 'N/format'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     */
    function(record, runtime, search,url,format) {
        
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
            var currentRecord = scriptContext.currentRecord;
            let lineCount = currentRecord.getLineCount({ sublistId: 'custpage_notes_sublist' });

            for (let i = 0; i < lineCount - 1; i++) { // Exclude last row (new row)
                let col1 = currentRecord.getSublistValue({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_date', line: i });
                let col2 = currentRecord.getSublistValue({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_notes', line: i });

                if (col2!='') {
                    // Disable existing lines if they have data
                    // currentRecord.getSublistField({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_date', line: i }).isDisabled = true;
                    currentRecord.getSublistField({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_notes', line: i }).isDisabled = true;
                }
            }
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
            var CurrentRecord = scriptContext.currentRecord;
            var fieldId = scriptContext.fieldId;
            
            
              if(fieldId == "custpage_eta_fld"){
                var Today = new Date();
                var ETADateValue = scriptContext.currentRecord.getValue({
                    fieldId : 'custpage_eta_fld'});
                    if(ETADateValue){
                        var formattedFromDate = format.format({value: new Date(ETADateValue), type: format.Type.DATE});
                    }
                    formattedFromDate = new Date(formattedFromDate);
						Today.setHours(0, 0, 0, 0);
						formattedFromDate.setHours(0, 0, 0, 0);

						// Calculate the difference in days
						const diffInMilliseconds = formattedFromDate - Today;
						const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

                    /* var dayscount = Today.getTime()-formattedFromDate.getTime();
                    var diffdays = Math.ceil(dayscount / (1000 * 3600 * 24));
					diffdays =Math.abs(diffdays); */
                
                   if(diffInDays){
                    CurrentRecord.setValue("custpage_date_to_close_deal", diffInDays)
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
            
        }
    
        
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
  
        };
        
    });
    
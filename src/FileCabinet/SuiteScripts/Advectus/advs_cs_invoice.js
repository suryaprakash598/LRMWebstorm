/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord','N/url','N/https','N/record'],
    /**
     * @param{currentRecord} currentRecord
     * @param{runtime} runtime
     * @param{search} search
     */
    function(currentRecord,url,https,record) {

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

        function printTollTicket(){
            alert("Toll Ticket");
        }

        return {
            pageInit: pageInit,
            printTollTicket:printTollTicket
        };

    });
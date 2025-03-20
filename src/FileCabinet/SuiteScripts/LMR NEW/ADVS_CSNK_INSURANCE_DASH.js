/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/runtime', 'N/url', 'N/https', 'N/record'],
    /**
     * @param{currentRecord} currentRecord
     * @param{runtime} runtime
     */
    function (currentRecord, runtime, url, https, record) {

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
            colorStatus(scriptContext);
            
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

            return true;
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

            return true;
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

            return true;
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

            return true;
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

            return true;
        }


        function colorStatus(context) {
            // try{
            var record = context.currentRecord;
            var sublist = "custpage_sublist_custpage_subtab_insur_claim";
            var lineCount = record.getLineCount({ sublistId: sublist });
            var obj = colorsForInventory();
            var colsToColor = 2;
            for (var L = 0; L < lineCount; L++) {
                var status = record.getSublistValue({ sublistId: sublist, fieldId: "cust_fi_status_claim", line: L });//custpabe_m_status
                if (status == "Pending Claim") {
                    applycolor(obj.BackGroundColPendingClaim, obj.TextCol, L, sublist, colsToColor);
                }
                else if (status == "Open Claim") {
                    applycolor(obj.BackGroundColOpenClaim, obj.TextCol, L, sublist, colsToColor);
                } else if (status == "Closed Claim") {
                    applycolor(obj.BackGroundColClaimClosed, obj.TextCol, L, sublist, colsToColor);
                }
            }
            for (var L = 0; L < lineCount; L++) {
                var yard = record.getSublistValue({ sublistId: sublist, fieldId: "cust_fi_in_tow_yard", line: L });
                if (yard == "Yes") {
                    colsToColor = 15
                    applycolor(obj.yard, obj.TextCol, L, sublist, colsToColor);
                }
            }
            // }catch(e)
            //{
            ////    log.debug('error',e.toString())
            // }
        }
        function colorsForInventory() {
            var obj = {};
            obj.BackGroundColPendingClaim = "#ffc6ce"; // Light Pink
            obj.BackGroundColOpenClaim = "#d5eaf8"; // Light Orange
            obj.BackGroundColWaitingForRepair = "#ffff00"; // Yellow
            obj.BackGroundColPendingPayment = "#d5eaf8"; // Light Blue
            obj.BackGroundColClaimClosed = "#d0cece"; // Grey

            obj.TextCol = "#000000"; // Default Text Color
            obj.yard = "#FF0000";
            return obj;
        }
        function applycolor(BackGroundCol, TextCol, L, elementid, colsToColor) {
            var trDom = document.getElementById(elementid + 'row' + L);
            var trDomChild = trDom.children;
            for (var t = 0; t < (trDomChild.length); t++) {
                var tdDom = trDomChild[t];
                var CheckField = tdDom.style.display;
                if (CheckField != 'none') {
                    var StringToSet = "";
                    if (BackGroundCol != "" && BackGroundCol != " ") {
                        StringToSet += "background-color:" + BackGroundCol + "!important;font-weight:bold !important;";
                    }
                    if (TextCol != "" && TextCol != " ") {
                        //StringToSet += "color:" + TextCol + "!important; font-weight:bold !important;";
                    }
                    if (StringToSet != "" && StringToSet != " ") {
                        if (t == colsToColor) {
                            tdDom.setAttribute('style', '' + StringToSet + '');
                        }
                    }
                }
            }
        }
        function IncuranceEmailPopup() {


            var URL = url.resolveScript({
                scriptId: "customscript_advs_ssnk_insurance_email_p",
                deploymentId: "customdeploy_advs_ssnk_insurance_email_p",
                params: {
                    "custparam_labtab": "0",
                    "ifrmcntnr": "T"
                }
            });

            window.open(URL, '_blank', "width=800,height=500");

        }
        function searchhistoy(id) {
            debugger;
            var suiteletURL = url.resolveScript({
                scriptId: 'customscript_advs_lease_agree_history',
                deploymentId: 'customdeploy_advs_lease_agree_history',

            });
            suiteletURL += "&curREc=" + id;
            window.open(suiteletURL, "_blank", "width=1000, height=500");
        }
        function opennewclaim()        {
            debugger;
            var suiteletURL = url.resolveScript({
                scriptId:'customscript_advs_claim_entry_sheet',
                deploymentId: 'customdeploy_advs_claim_entry_sheet',

            });
            window.open(suiteletURL, "_blank",  "width=1000, height=500" );
        }


        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            postSourcing: postSourcing,
            sublistChanged: sublistChanged,
            lineInit: lineInit,
            validateField: validateField,
            validateLine: validateLine,
            validateInsert: validateInsert,
            validateDelete: validateDelete,
            saveRecord: saveRecord,
            IncuranceEmailPopup: IncuranceEmailPopup,
            searchhistoy: searchhistoy,
            opennewclaim: opennewclaim


        };

    });
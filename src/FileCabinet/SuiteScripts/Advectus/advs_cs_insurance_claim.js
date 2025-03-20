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

            //advsObj.showProcessingMessage();
            //wrapsublistheaders();
            // advsObj.hideProcessingMessage();
            colorInsStatus(CurrentRecord,"custpage_sublist_custpage_subtab_insur_claim","cust_fi_status_claim");
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

        function colorInsStatus(CurrentRecord,SublistId,FieldId){ // ABDUL
            var lineCount = CurrentRecord.getLineCount({sublistId: SublistId });
            var colsToColor = 2;
            for (var L = 0; L < lineCount; L++) {
                var InsStatus = CurrentRecord.getSublistValue({sublistId: SublistId,fieldId: FieldId,line: L});

                if(InsStatus == "Pending Claim"){
                    applyColorTitleRes("#ea3a3a","#000000",L,SublistId,colsToColor);
                }
                else if(InsStatus == "Open Claim"){
                    applyColorTitleRes("#e0c9c9","#000000",L,SublistId,colsToColor);
                }
                else if(InsStatus == "Closed Claim"){
                    applyColorTitleRes("#FFFFFF",null,L,SublistId,colsToColor);
                }
                else if(InsStatus == "Waiting for Repair"){
                    applyColorTitleRes("#ffff12","#000000",L,SublistId,colsToColor);
                }
                else if(InsStatus == "Pending Payment"){
                    applyColorTitleRes("#17c2cf","#000000",L,SublistId,colsToColor);
                }
            }
        }
        function applyColorTitleRes(BackGroundCol,TextCol,L,elementid,colsToColor){   // ABDUL
            var trDom = document.getElementById(elementid+'row' + L);
            var trDomChild = trDom.children;
            for (var t = 0; t < (trDomChild.length); t++) {
                var tdDom = trDomChild[t];
                var CheckField = tdDom.style.display;
                if (CheckField != 'none') {
                    var StringToSet = "";
                    if (BackGroundCol != "" && BackGroundCol != " ") {
                        StringToSet += "background-color:" + BackGroundCol + "!important;";
                    }
                    if (TextCol != "" && TextCol != " ") {
                        //StringToSet += "color:" + TextCol + "!important; font-weight:bold !important;";
                    }
                    if (StringToSet != "" && StringToSet != " ") {
                        if(t==colsToColor){
                            tdDom.setAttribute('style', '' + StringToSet + '');
                        }
                    }
                }
            }
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
            opennewclaim: opennewclaim,
        };

    });
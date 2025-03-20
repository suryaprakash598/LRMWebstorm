/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord','N/url','N/https','N/format'],
/**
 * @param{currentRecord} currentRecord
 */
function(currentRecord,url,https,format) {
    
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
        var lineNum    =   scriptContext.line;
        if(name == "custpage_ed_mile"){
            var curRec  =   scriptContext.currentRecord;
            var stMile  =   curRec.getSublistValue({sublistId:"custpage_sublist",fieldId:"custpage_st_mile",line:lineNum})*1;
            var EdMile  =   curRec.getSublistValue({sublistId:"custpage_sublist",fieldId:"custpage_ed_mile",line:lineNum})*1;

            if(EdMile>0){
                if(EdMile<stMile){
                    alert("Cannot enter less than Start Mileage");
                    curRec.setSublistValue({sublistId:"custpage_sublist",fieldId:"custpage_ed_mile",line:lineNum,value:""});
                }else{
                    var MilCharged  =   curRec.getSublistValue({sublistId:"custpage_sublist",fieldId:"custpage_mileage_tot",line:lineNum})*1;
                    var HrsCharged  =   curRec.getSublistValue({sublistId:"custpage_sublist",fieldId:"custpage_hrs_tot",line:lineNum})*1;
                    var milsPerMn   =   curRec.getSublistValue({sublistId:"custpage_sublist",fieldId:"custpage_mile_per",line:lineNum})*1;

                    var UsedMil = (EdMile-stMile);
                    UsedMil =   UsedMil*1;


                    if(MilCharged>UsedMil){
                        var FinalMileage  =   (MilCharged-UsedMil);
                        FinalMileage  =   FinalMileage*1;
                        FinalMileage  =   FinalMileage*-1;
                    }else{
                        var FinalMileage  =   (UsedMil-MilCharged);
                        FinalMileage    =   FinalMileage*1;
                    }
                    var NetTot  =   (FinalMileage*milsPerMn);

                    // curRec.setSublistValue({sublistId:"custpage_sublist",fieldId:"custpage_net_amnt",line:lineNum,value:NetVal});
                    var lineNum = curRec.selectLine({
                        sublistId: 'custpage_sublist',
                        line: lineNum
                    });

                    curRec.setCurrentSublistValue({
                        sublistId: 'custpage_sublist',
                        fieldId: 'custpage_net_amnt',
                        value: NetTot,
                        ignoreFieldChange: true
                    });
                    curRec.commitLine({
                        sublistId: 'custpage_sublist'
                    });
                }
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

    function addAddonsCs(stockID){
        var curRec  =   currentRecord.get();

        var ReqIDrent		=	curRec.getValue("custpage_recobj");
        var ReqIDtemprent	=	curRec.getValue("custpage_temp_recid");
        var returnDate     	=	curRec.getValue("custpage_date_fld");
        var returnDateT    =   format.format({
            value:returnDate,
            type: format.Type.DATE
        });
   /*     var url	=	nlapiResolveURL("SUITELET", "customscript_advs_ss_rental_return_addon", "customdeploy_advs_ss_rental_return_addon");
        url+="&requestID="+ReqIDrent;
        url+="&requestexistID="+ReqIDtemprent;
        url+="&stockID="+stockID;
        url+="&ifrmcntrl=T";*/
        var PArabObj = {
            "requestID": ReqIDrent,
            "requestexistID":ReqIDtemprent,
            "stockID":stockID,
            "returnDate":returnDateT,
            "ifrmcntrl":"T"
        };

        var urlop = url.resolveScript({
            scriptId: "customscript_advs_ss_rental_return_addon",
            deploymentId: "customdeploy_advs_ss_rental_return_addon",
            params: PArabObj
        });

        var Title = "Addons";
        var w = screen.width - 400, h = 450;

        openModalDialog(urlop, Title, w, h);
    }
    function openModalDialog(urlop,Title,w,h){
        Ext.onReady(function() {
            Ext.create('Ext.window.Window', {
                title: Title,
                /* height: Ext.getBody().getViewSize().height*(-100),
                 width: Ext.getBody().getViewSize().width*0.8,*/
                height: h,
                width: w,
//            minWidth:'730',
//            minHeight:'450',
                layout: 'fit',
                itemId : 'popUpWin',
                modal:true,
                shadow:true,
                resizable:true,
                constrainHeader:true,
                items: [{
                    xtype: 'box',
                    autoEl: {
                        tag: 'iframe',
                        src: urlop,
                        frameBorder:'0'
                    }
                }]
            }).show();
        });

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
        addAddonsCs:addAddonsCs,
        openModalDialog:openModalDialog
    };
    
});

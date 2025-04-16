/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord','N/url','N/https','/SuiteBundles/Bundle 555729/advs_lib/src/advs_lib_default_funtions_v2.js'],
/**
 * @param{currentRecord} currentRecord
 * @param{runtime} runtime
 * @param{search} search
 */
function(currentRecord,url,https,advsObj) {
    
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
        var type = scriptContext.sublistId;
        var flexiMac    =   "recmachcustrecord_advs_f_l_s_cnt_head";

        if(type == flexiMac){
         /*   var curRec      =   scriptContext.currentRecord;
              var schedules         =    curRec.getLineCount({sublistId:flexiMac});
              var getCurSchedule    =    curRec.getCurrentSublistValue({sublistId:flexiMac,fieldId:"custrecord_advs_f_l_s_schedules"})*1;
            var getCurrentAmount    =    curRec.getCurrentSublistValue({sublistId:flexiMac,fieldId:"custrecord_advs_f_l_s_amount"})*1;
            var curLine             =   curRec.getCurrentSublistIndex({sublistId:flexiMac});

            var CurrentLineamount = (getCurSchedule*getCurrentAmount);
            // alert(schedules+"=>"+getCurSchedule+"=>"+getCurrentAmount+"=>"+curLine+"=>"+CurrentLineamount);
            var allSchedules = 0;
                for(var m=0;m<schedules;m++){
                    var lineSchedule    = curRec.getSublistValue({sublistId:flexiMac,fieldId:"custrecord_advs_f_l_s_schedules",line:m})*1;
                    var lineamount      = curRec.getSublistValue({sublistId:flexiMac,fieldId:"custrecord_advs_f_l_s_amount",line:m})*1;
                    if(curLine != m){
                        var tempTotal =   lineSchedule*lineamount;
                        allSchedules+=tempTotal;
                    }
                    // alert("Loop=>"+m+"curLine=>"+curLine+"lineSchedule=>"+lineSchedule+"lineamount=>"+lineamount+"allSchedules=>"+allSchedules);
                }

                var finalAmount =   (allSchedules+CurrentLineamount);
                curRec.setValue({fieldId:"custrecord_advs_l_a_loan_amount",value:finalAmount});*/

            setTimeout(function(){
                calcFlexitotal();
            },1000);

        }

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
        var type = scriptContext.sublistId;
        var flexiMac    =   "recmachcustrecord_advs_f_l_s_cnt_head";
        if(type == flexiMac){
            setTimeout(function(){
                calcFlexitotal();
            },1000);
        }


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


    function openModalDialog(urlop,Title,w,h){

        advsObj.injectModal();
        advsObj. openpopUpModal(urlop, Title, h , w);
        return true;
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

   

    function addCPC1(id){
         var curRec  =   currentRecord.get();
        var PArabObj = {
            "ifrmcntnr":"T",
            "recordid":id,
            "screentype":"add",

        };

        var urlop = url.resolveScript({
            scriptId: "customscript_advs_ss_add_cpc",
            deploymentId: "customdeploy_advs_ss_add_cpc",
            params: PArabObj
        });

        var Title = "Start CPC";
        var w = screen.width - 100, h = 400;

        openModalDialog(urlop, Title, w, h);
    }
    function removeCPC(id,cpcid){
        var curRec      =   currentRecord.get();
        var PArabObj = {
            "ifrmcntnr":"T",
            "recordid":id,
            "screentype":"remove",
            "currentCpc":cpcid

        };

        var urlop = url.resolveScript({
            scriptId: "customscript_advs_ss_add_cpc",
            deploymentId: "customdeploy_advs_ss_add_cpc",
            params: PArabObj
        });

        var Title = "Close CPC";
        var w = screen.width - 300, h = 550;

        openModalDialog(urlop, Title, w, h);
    }
     

    return {
        pageInit: pageInit,
       
        openModalDialog:openModalDialog,
        
        addCPC1:addCPC1,
        removeCPC:removeCPC
    };
    
});
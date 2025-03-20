/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/runtime','./advs_lib_dashboard','N/url','N/record','./advs_lib_util.js'],
/**
 * @param{currentRecord} currentRecord
 * @param{runtime} runtime
 */
function(currentRecord, runtime,libDash,url,record,libUtil) {
    
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
       /* setTimeout(function() {
            var element =   document.getElementById("callClientFirstLevel");
            console.log(element);
            element.addEventListener("click", callClientFunction);

        }, 500);*/
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
    function callFirstClientFunction(id,custId){
        var RunSearch	=	document.getElementById("SHA_RUN_"+id).value;

        if(RunSearch == 1){
            document.getElementById("SHA_RUN_"+id).value	=	0;
            document.getElementById("DIVARJ_TR_"+id+"").style.display	=	"block";
            libDash.expandFirstLevel(id,custId);
            var spanID  =   "span_"+id+"";
            changeofSpan(1,id,spanID);

        }else{
            document.getElementById("SHA_RUN_"+id).value	=	1;
            document.getElementById("DIVARJ_TR_"+id).style.display	=	"none";
            var spanID  =   "span_"+id+"";
            changeofSpan(0,id,spanID);
        }



    }

    function changeofSpan(plus,id,spanID){
        if(plus == 1){
            var element =   document.getElementById(spanID);
            document.getElementById(spanID).textContent="remove";
        }else{
            var element =   document.getElementById(spanID);
            document.getElementById(spanID).textContent="add_circle";
        }

    }

    function callsecondClientFunction(id,custId){
        var RunSearch	=	document.getElementById("SHA_RUN_F_"+id).value;

        if(RunSearch == 1){
            document.getElementById("SHA_RUN_F_"+id).value	=	0;
            document.getElementById("DIVARJ_TR_F_"+id+"").style.display	=	"block";
            libDash.expand_secLevel(id,custId);
            var spanID  =   "span_F_"+id+"";
            changeofSpan(1,id,spanID);

        }else{
            document.getElementById("SHA_RUN_F_"+id).value	=	1;
            document.getElementById("DIVARJ_TR_F_"+id).style.display	=	"none";
            var spanID  =   "span_F_"+id+"";
            changeofSpan(0,id,spanID);
        }

    }
    function callThirdClientFunction(id,custId,leaseId){
        var RunSearch	=	document.getElementById("SHA_RUN_S_"+id+"_"+custId+"").value;

        if(RunSearch == 1){
            document.getElementById("SHA_RUN_S_"+id+"_"+custId+"").value	=	0;
            document.getElementById("DIVARJ_TR_S_"+id+"_"+custId+"").style.display	=	"block";
            libDash.expand_thrdLevel(id,custId,leaseId);

            var spanID  =   "span_s_"+id+"_"+custId+"";
            changeofSpan(1,id,spanID);
        }else{
            document.getElementById("SHA_RUN_S_"+id+"_"+custId+"").value	=	1;
            document.getElementById("DIVARJ_TR_S_"+id+"_"+custId+"").style.display	=	"none";
            var spanID  =   "span_s_"+id+"_"+custId+"";
            changeofSpan(0,id,spanID);
        }

    }

    function onClickButton(btnid,leaseid,custid,subsId){

        // alert(btnid);
        if(btnid == 1){

            var openUrl = url.resolveScript({
                scriptId: 'customscript_advs_staa_open_new_screen',
                deploymentId: 'customdeploy_advs_staa_open_new_screen',
                params: {
                    custparam_type: 4,
                    entity:custid,
                    leaseid:leaseid,
                    ifrmcntnr:"T"
                    
                }
            });
            var Title = "Activity";
            var w = screen.width - 100, h = 500;
            openModalDialog(openUrl, Title, w, h);
            // customsearch_advs_collection_task_detail
        }else if(btnid == 2){
            var urlRec  =   url.resolveRecord({recordType:record.Type.CUSTOMER_PAYMENT});
            urlRec+="&ifrmcntnr=T";
            urlRec+="&entity="+custid+"";
            urlRec+="&leaseid="+leaseid+"";
            urlRec+="&subsidiary="+subsId+"";
            urlRec+="&cf="+libUtil.forms.paymenform+"";
            urlRec+="&isdashb=T";
            var Title = "Create Payment";
            var w = screen.width - 100, h = 500;
            openModalDialog(urlRec, Title, w, h);
        }else if(btnid == 3){

            var MainUrl	=	url.resolveScript({
                scriptId: 'customscript_advs_staa_lease_buyout_scre',
                deploymentId: 'customdeploy_advs_staa_lease_buyout_scre',
                params: {"Custparam_stockID":leaseid}
            });
            window.open(MainUrl,"_blank");
        }else if(btnid == 4){
            var urlRec  =   url.resolveRecord({recordType:record.Type.TASK});
            urlRec+="&ifrmcntnr=T";
            urlRec+="&company="+custid+"";
            urlRec+="&leaseid="+leaseid+"";
            urlRec+="&subsidiary="+subsId+"";
            urlRec+="&cf="+libUtil.forms.ptpform+"";
            urlRec+="&isdashb=T";
            urlRec+="&tasktype="+libUtil.tasktype.ptp+"";


            var Title = "Create PTP";
            var w = screen.width - 100, h = 500;
            openModalDialog(urlRec, Title, w, h);
        }else if(btnid == 5){
            var urlRec  =   url.resolveRecord({recordType:record.Type.TASK});
            urlRec+="&ifrmcntnr=T";
            urlRec+="&company="+custid+"";
            urlRec+="&leaseid="+leaseid+"";
            urlRec+="&subsidiary="+subsId+"";
            urlRec+="&cf="+libUtil.forms.ptpform+"";
            urlRec+="&isdashb=T";
            urlRec+="&tasktype="+libUtil.tasktype.brokenpromise+"";


            var Title = "Create B.Promise";
            var w = screen.width - 100, h = 500;
            openModalDialog(urlRec, Title, w, h);
        }else if(btnid == 6){
            var MainUrl	=	url.resolveScript({
                scriptId: 'customscript_advs_ss_dashboard_notes',
                deploymentId: 'customdeploy_advs_ss_dashboard_notes',
                params: {"custparam_type":"customer","custparam_id":custid,"ifrmcntnr":"T"}
            });



            var Title = "Add Notes";
            var w = screen.width - 700, h = 250;
            openModalDialog(MainUrl, Title, w, h);
        //     customdeploy_advs_ss_dashboard_notes
        }else if(btnid == 7){
            var urlRec  =   url.resolveRecord({recordType:record.Type.TASK});
            urlRec+="&ifrmcntnr=T";
            urlRec+="&company="+custid+"";
            urlRec+="&leaseid="+leaseid+"";
            urlRec+="&subsidiary="+subsId+"";
            urlRec+="&cf="+libUtil.forms.ptpform+"";
            urlRec+="&isdashb=T";
            // urlRec+="&tasktype="+libUtil.tasktype.brokenpromise+"";


            var Title = "Follow Up";
            var w = screen.width - 100, h = 500;
            openModalDialog(urlRec, Title, w, h);
        }else if(btnid == 8){
            var urlRec  =   url.resolveRecord({recordType:record.Type.TASK});
            urlRec+="&ifrmcntnr=T";
            urlRec+="&company="+custid+"";
            urlRec+="&leaseid="+leaseid+"";
            urlRec+="&subsidiary="+subsId+"";
            urlRec+="&cf="+libUtil.forms.ptpform+"";
            urlRec+="&isdashb=T";
            urlRec+="&tasktype="+libUtil.tasktype.ofr+"";


            var Title = "OFR";
            var w = screen.width - 100, h = 500;
            openModalDialog(urlRec, Title, w, h);
        }


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
    function RefreshScreen(id,from,to,custid){
            var urlsu   =   url.resolveScript({scriptId:"customscript_advs_ss_collection_dashboar",
            deploymentId:"customdeploy_advs_ss_collection_dashboar",params:{from:from,to:to,custid:custid}});

            setWindowChanged(window,false);
            window.location=urlsu;
    }
    function refreshforTaskD(id,custid){
        var urlsu   =   url.resolveScript({scriptId:"customscript_advs_ss_collection_dashboar",
            deploymentId:"customdeploy_advs_ss_collection_dashboar",params:{tasktype:id,custid:custid}});

        setWindowChanged(window,false);
        window.location=urlsu;
    }
    return {
        pageInit: pageInit,
        // fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        // validateLine: validateLine,
        // validateInsert: validateInsert,
        // validateDelete: validateDelete,
        // saveRecord: saveRecord,
        callFirstClientFunction:callFirstClientFunction,
        callsecondClientFunction:callsecondClientFunction,
        callThirdClientFunction:callThirdClientFunction,
        onClickButton:onClickButton,
        openModalDialog:openModalDialog,
        RefreshScreen:RefreshScreen,
        refreshforTaskD:refreshforTaskD
    };
    
});

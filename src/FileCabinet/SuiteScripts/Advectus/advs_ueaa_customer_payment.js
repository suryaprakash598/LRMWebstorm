/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/currentRecord', 'N/log', 'N/record', 'N/runtime', 'N/search', 'N/url','N/ui/message','N/redirect',
            '/SuiteScripts/Advectus/advs_lib_util.js','N/format'],
    /**
     * @param{currentRecord} currentRecord
     * @param{log} log
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     * @param{url} url
     */
    (currentRecord, log, record, runtime, search, url,message,redirect,libUtil,format) => {
            /**
             * Defines the function definition that is executed before record is loaded.
             * @param {Object} scriptContext
             * @param {Record} scriptContext.newRecord - New record
             * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
             * @param {Form} scriptContext.form - Current form
             * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
             * @since 2015.2
             */
            const beforeLoad = (scriptContext) => {
                    var request =   scriptContext.request;
                    var type =   scriptContext.type;
                    var newRec  =   scriptContext.newRecord;

                    if(type == "create" || type == "copy"){
                            if(request != null && request != undefined && request != ""){

                                    var invID = scriptContext.request.parameters.inv;
                                    if(invID != null && invID != undefined && invID !=""){
                                            var invoiceFld  = ["custbody_advs_created_from"];
                                            var invoiceRec  =   search.lookupFields({
                                                    type:"invoice",
                                                    id:invID,
                                                    columns:invoiceFld
                                            });
                                            if(invoiceRec["custbody_advs_created_from"]){
                                                    var CredtedFrom =       invoiceRec["custbody_advs_created_from"][0].value;

                                                    if(CredtedFrom){

                                                            var credFld  = ["type","tranid","total"];
                                                            var CredRec  =   search.lookupFields({
                                                                    type:"transaction",
                                                                    id:CredtedFrom,
                                                                    columns:credFld
                                                            });
                                                            log.debug("CredRec",CredRec);
                                                            var MEmoType    =   ""; var tranID  =   "";
                                                            var totalTr =   0;
                                                            if(CredRec["type"]) {
                                                                    MEmoType    =   CredRec["type"][0].value;
                                                            }
                                                            if(CredRec["tranid"]) {
                                                                    tranID    =   CredRec["tranid"];
                                                            }if(CredRec["total"]) {
                                                                    totalTr    =   CredRec["total"];

                                                                    totalTr =   totalTr*-1;
                                                            }

                                                            if( MEmoType== "CustCred"){

                                                                    // var CredMessage	=	"Credit Memo:"+tranID+" Value: "+totalTr+"";
                                                                    var CredMessage	=	"Please apply Credit Memo#"+tranID+" of value $"+totalTr+".";


                                                                    scriptContext.form.addPageInitMessage({
                                                                            type: message.Type.WARNING,
                                                                            title: "<b style='display:none;'>!</b>",
                                                                            message: "<b style='font-size:18px;color:black;'>"+CredMessage+"</b>"
                                                                    });

                                                                    var line_count = newRec.getLineCount({
                                                                            sublistId:"apply"
                                                                    });
                                                                    for(var lineL=0;lineL<line_count;lineL++){
                                                                            var line_ref_no = newRec.getSublistValue({
                                                                                    sublistId:"apply",fieldId:"refnum",line:lineL
                                                                            });
                                                                            log.debug("line_ref_no",line_ref_no+"=>>"+tranID)
                                                                            if(CredtedFrom == line_ref_no){//amount
                                                                                    newRec.setSublistValue({
                                                                                            sublistId:"apply",
                                                                                            fieldId:"apply",
                                                                                            line:lineL,
                                                                                            value:false
                                                                                    });
                                                                                    newRec.setSublistValue({
                                                                                            sublistId:"apply",
                                                                                            fieldId:"apply",
                                                                                            line:lineL,
                                                                                            value:true
                                                                                    });
                                                                                    //setLineItemValue('apply', 'apply', line, 'F');
                                                                                    // transform.setLineItemValue('apply', 'apply', line, 'T');
                                                                            }
                                                                    }
                                                            }

                                                            // log.debug("CredtedFrom",CredRec+"=>"+CredtedFrom+"=>"+MEmoType);
                                                    }
                                            }



                                    }
                                    var leaseid = scriptContext.request.parameters.leaseid;
                                    var isDashbOr = scriptContext.request.parameters.isdashb;
                                    if(leaseid != null && leaseid != undefined && leaseid !=""){
                                            var newRec  =scriptContext.newRecord;
                                            newRec.setValue({fieldId:"custbody_advs_lease_head",value:leaseid});
                                            if(isDashbOr == true || isDashbOr == "T"){
                                                    newRec.setValue({fieldId:"custbody_advs_tbf_is_frm_dash",value:true});
                                            }



                                    }
                            }


                    }
            }

            /**
             * Defines the function definition that is executed before record is submitted.
             * @param {Object} scriptContext
             * @param {Record} scriptContext.newRecord - New record
             * @param {Record} scriptContext.oldRecord - Old record
             * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
             * @since 2015.2
             */
            const beforeSubmit = (scriptContext) => {

            }

            /**
             * Defines the function definition that is executed after record is submitted.
             * @param {Object} scriptContext
             * @param {Record} scriptContext.newRecord - New record
             * @param {Record} scriptContext.oldRecord - Old record
             * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
             * @since 2015.2
             */
            const afterSubmit = (scriptContext) => {
                    var type    =       scriptContext.type;
                    var newRec          =       scriptContext.newRecord;
                    if(type == "create"){
                            var leaseID =       newRec.getValue({fieldId:"custbody_advs_lease_head"});
                            var isFrmDash =       newRec.getValue({fieldId:"custbody_advs_tbf_is_frm_dash"});

                            if((leaseID) && (isFrmDash == true || isFrmDash == "T")){
                                    redirect.toSuitelet({
                                            scriptId: 'customscript_advs_ss_dahb_open_new_scree',
                                            deploymentId: 'customdeploy_advs_ss_dahb_open_new_scree',
                                            parameters: {
                                                    custparam_type: 1
                                            }
                                    });
                                    // customdeploy_advs_ss_dahb_open_new_scree
                            }



                    }

                    if(type == "create" || type == "edit"){

                            validateABPPAyment(scriptContext);
                    }



            }

            function validateABPPAyment(scriptContext){
                    var newrec  =       scriptContext.newRecord;
                    var recid   =       newrec.id;
                    var taskid  = newrec.getValue("custbody_advs_task_info");
                    var leaseid = newrec.getValue("custbody_advs_lease_head");
                    var abppayment = newrec.getValue("custbody_fd_abp_sc_select_pay");
                    var paymentsuccess = false;
                    if(leaseid && abppayment){
                            findandunapplyFailedPayment(recid,paymentsuccess);
                    }
                    log.debug("paymentsuccess",paymentsuccess+"=>"+leaseid+"=>"+taskid);
                    if(leaseid && taskid){
                            var fields = ['custevent_advs_mm_task_type','custevent_advs_pay_tried','startdate'];
                            var SearchObj = search.lookupFields({
                                    type: search.Type.TASK,
                                    id: taskid,
                                    columns: fields
                            });

                            var tasktype  =   SearchObj.custevent_advs_mm_task_type.length ? SearchObj.custevent_advs_mm_task_type[0].value : '';
                            var paymenttried  =   SearchObj.custevent_advs_pay_tried;
                            var ptptaskdate  =   SearchObj.startdate;

                            paymenttried = paymenttried*1;
                            paymenttried++;

                            var taskDateObj = format.parse({
                                    value: ptptaskdate,
                                    type: format.Type.DATE
                            });

                            // Get today's date and subtract 2 days
                            var today = new Date();
                            today.setDate(today.getDate() - 2); // Two days before today

                            log.debug("libUtil.tasktype.ptp",tasktype+"=>"+libUtil.tasktype.ptp+"=>"+paymentsuccess);
                            if (libUtil.tasktype.ptp == tasktype){
                                    if (libUtil.tasktype.ptp == tasktype && paymentsuccess !=true){
                                            if ((paymenttried >= 4) || (taskDateObj.getTime() === today.getTime())) {
                                                    var paramObj = {
                                                            "status" : "COMPLETE",
                                                            "custevent_advs_ptp_status" : libUtil.ptpstatus.rejected,
                                                            "transaction":"",
                                                            "custevent_advs_pay_tried": paymenttried
                                                    };
                                                    record.submitFields({type:"task",id:taskid,values: paramObj})
                                            }else{
                                                    log.debug("ELSEEE","ELSEEEE");
                                                    record.submitFields({type:"task",id:taskid,values: {
                                                                    status: "PROGRESS",
                                                                    custevent_advs_ptp_status: libUtil.ptpstatus.notstarted,
                                                                    transaction: "",
                                                                    custevent_advs_pay_tried: paymenttried,
                                                            }})
                                            }

                                    }else{
                                            record.submitFields({
                                                    type: 'task', // Replace with your Task record type
                                                    id: taskid,
                                                    values: {
                                                            transaction: recid,
                                                            custevent_advs_ptp_status: libUtil.ptpstatus.processed,
                                                            status: "COMPLETE",
                                                            custevent_advs_ptp_payment_date:new Date(),
                                                            custevent_advs_pay_tried: paymenttried,
                                                    }
                                            });
                                    }



                            }

                    }



            }
            function findandunapplyFailedPayment(recid,paymentsuccess){
                    var abpTransLogsearch = search.create({
                            type: "customrecord_fd_abp_transaction_log",
                            filters:
                                [
                                        ["custrecord_tl_status_code","is","A"]
                                        ,"AND",
                                        ["custrecord_tl_transaction","anyof",recid]
                                ],
                            columns:
                                [
                                        search.createColumn({name: "internalid", label: "Script ID"}),
                                ]
                    });

                    abpTransLogsearch.run().each(function(result){
                            paymentsuccess = true;
                            return true;
                    });
                    if(paymentsuccess != true){
                            try{
                                    var paymentRec = record.load({
                                            type: record.Type.CUSTOMER_PAYMENT,
                                            id: recid,
                                            isDynamic: true
                                    });
                                    var lineCount = paymentRec.getLineCount({ sublistId: 'apply' });
                                    // Loop through applied invoices and unapply them
                                    for (var i = 0; i < lineCount; i++) {
                                            paymentRec.selectLine({ sublistId: 'apply', line: i });

                                            var isApplied = paymentRec.getCurrentSublistValue({
                                                    sublistId: 'apply',
                                                    fieldId: 'apply'
                                            });

                                            if (isApplied) {
                                                    log.debug('Unapplying Invoice at Line', i);
                                                    paymentRec.setCurrentSublistValue({
                                                            sublistId: 'apply',
                                                            fieldId: 'apply',
                                                            value: false
                                                    });

                                                    paymentRec.commitLine({ sublistId: 'apply' });
                                            }
                                    }

                                    // Save the updated payment record
                                    var paymentId = paymentRec.save();
                            }catch(e){

                            }
                    }
            }

            return {beforeLoad, beforeSubmit, afterSubmit}

    });

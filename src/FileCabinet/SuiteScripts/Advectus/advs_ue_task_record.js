/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/runtime', 'N/search','N/redirect','./advs_lib_util.js','N/task'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (record, runtime, search,redirect,libutil,task) => {
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
            var type = scriptContext.type;
            if(type == "create") {
                var newRec = scriptContext.newRecord;

                var request = scriptContext.request;

                if (request != null && request != undefined && request != "") {

                var leaseid = request.parameters.leaseid;
                var isDashbOr = request.parameters.isdashb;
                var tasktype = request.parameters.tasktype;

                if (leaseid != null && leaseid != undefined && leaseid != "") {
                    newRec.setValue({fieldId: "custevent_advs_lease_link", value: leaseid});
                    if (isDashbOr == true || isDashbOr == "T") {
                        newRec.setValue({fieldId: "custevent_advs_tbf_is_frm_dash", value: true});
                    }
                }
                if (tasktype) {
                    newRec.setValue({fieldId: "custevent_advs_mm_task_type", value: tasktype});
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
                var leaseID =       newRec.getValue({fieldId:"custevent_advs_lease_link"});
                var isFrmDash =       newRec.getValue({fieldId:"custevent_advs_tbf_is_frm_dash"});
                var tasktype =       newRec.getValue({fieldId:"custevent_advs_mm_task_type"});

                if(leaseID && tasktype){
                    updateLeaseCard(newRec,leaseID,tasktype);


                }
				//TRIGGER MAP REDUCE TO CREATE PAYMENTS
				var mrTask = task.create({
					taskType: task.TaskType.MAP_REDUCE
				});
				mrTask.scriptId = 'customscript_advs_mr_gen_ptp_payment';
				mrTask.deploymentId = 'customdeploy_advs_mr_gen_ptp_payment';
				var mrTaskId = mrTask.submit();
				//TRIGGER MAP REDUCE TO CREATE PAYMENTS
                if((leaseID) && (isFrmDash == true)){
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

        }

        function   updateLeaseCard(newRec,leaseID,tasktype) {
            var taskid  =   newRec.id;

            log.debug("tasktype",libutil.tasktype.ptp+"=>"+tasktype)
            if (libutil.tasktype.ptp == tasktype) {
                var ptpAmount   =   newRec.getValue("custevent_advs_ptp_amount");
                record.submitFields({type:libutil.customrecordtype.leasecard,id:leaseID, values:{
                        "custrecord_advs_pro_to_pay_tas":taskid,
                        "custrecord_advs_ptp_amount":ptpAmount
                    }});
            }else if (libutil.tasktype.brokenpromise == tasktype) {
                record.submitFields({type:libutil.customrecordtype.leasecard,id:leaseID, values:{
                        "custrecord_advs_bro_pro_link":taskid,
                    }});
            }else{
                record.submitFields({type:libutil.customrecordtype.leasecard,id:leaseID, values:{
                        "custrecord_advs_task_link":taskid,
                    }});
            }
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });

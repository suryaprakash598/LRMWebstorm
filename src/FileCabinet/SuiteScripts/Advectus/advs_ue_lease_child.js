/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/search','./advs_lib_util.js','N/format','./advs_lib_rental_leasing'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (record, runtime, search,libUtil,format,liblease) => {
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
            var type = scriptContext.type;
            if(type == "create" || type == "edit"){
                var newRec  =   scriptContext.newRecord;
                var status  =   newRec.getValue({fieldId:"custrecord_advs_lea_stock_status"});


                if(libUtil.leasechildstatus.assigned == status){
                    liblease.calcLeaseLines(scriptContext);
                }
            }
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
            var type    =   scriptContext.type;
            var newRec    =   scriptContext.newRecord;
            if(type == "create"){
                var vinId   =   newRec.getValue({fieldId:"custrecord_advs_lea_vin_stk_stock"});
                var rentalId   =   newRec.getValue({fieldId:"custrecord_advs_lea_header_link"});
                if(vinId){
                    record.submitFields({type:"customrecord_advs_vm",id:vinId,values:{
                            "custrecord_advs_vm_lea_hea":rentalId,
                            "custrecord_advs_vm_reservation_status":libUtil.vmstatus.rent
                        }});
                }
            }
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });

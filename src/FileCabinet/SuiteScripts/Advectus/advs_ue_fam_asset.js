/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/runtime', 'N/search'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     */
    (record, runtime, search) => {
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
            var type = scriptContext.type;
          log.debug('Typeeee',type);
            if(type != "delete"){

            	var newRec = scriptContext.newRecord;
            	var RecId = newRec.id;
            	var VinId = getVinInfo(RecId);
            	if(VinId){
            		var fieldsToUpdate = {}
            		fieldsToUpdate['custrecord_advs_fam_asset_link'] = RecId;
            		record.submitFields({
            			type: 'customrecord_advs_vm',
            			id: VinId,
            			values: fieldsToUpdate
            		});
            		var fieldToUpdate = {}
            		fieldToUpdate['custrecord_vin'] = VinId;
            		record.submitFields({
            			type: 'customrecord_ncfar_asset',
            			id: RecId,
            			values: fieldToUpdate
            		});
            	}
            }
        }

        function getVinInfo(RecId){
        	var SearchObj = search.create({
        		type: 'customrecord_ncfar_asset',
        		filters: [
        			['isinactive','is','F'],
        			'AND',
        			['internalid','anyof',RecId],
        			'AND',
        			['custrecord_vin','anyof','@NONE@'],
        			'AND',
        			['custrecord_assetsourcetrn','noneof','@NONE@']
        		],
        		columns:[
        			search.createColumn({name:'custbody_advs_st_vin_invoice',join: 'custrecord_assetsourcetrn'})
        		]
        	});
        	var VinNum = '';
        	SearchObj.run().each(function(result){
        		VinNum = result.getValue({name:'custbody_advs_st_vin_invoice',join: 'custrecord_assetsourcetrn'});
                return true;
            });
        	return VinNum;
        }
        

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
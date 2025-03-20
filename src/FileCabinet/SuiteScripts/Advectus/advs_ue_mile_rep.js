/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript

 */
define(['N/currentRecord', 'N/log', 'N/record', 'N/task','N/search','N/runtime','N/email','N/url'],
		/**
		 * @param {currentRecord} currentRecord
		 * @param {log} log
		 * @param {record} record
		 * @param {task} task
		 */
		function(currentRecord,log, record, task,search,runtime,email,url) {

	/**
	 * Function definition to be triggered before record is loaded.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.newRecord - New record
	 * @param {string} scriptContext.type - Trigger type
	 * @param {Form} scriptContext.form - Current form
	 * @Since 2015.2
	 */
	function beforeLoad(scriptContext) {
     
 }

	/**
	 * Function definition to be triggered before record is loaded.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.newRecord - New record
	 * @param {Record} scriptContext.oldRecord - Old record
	 * @param {string} scriptContext.type - Trigger type
	 * @Since 2015.2
	 */
	function beforeSubmit(scriptContext) {

	}

	/**
	 * Function definition to be triggered before record is loaded.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.newRecord - New record
	 * @param {Record} scriptContext.oldRecord - Old record
	 * @param {string} scriptContext.type - Trigger type
	 * @Since 2015.2
	 */
	function afterSubmit(scriptContext) {
		var type=	scriptContext.type;
    	if (scriptContext.type == scriptContext.UserEventType.CREATE) {
    		var currRecord = scriptContext.newRecord;
			var RecordId = currRecord.id;
			var CurrentMileage  = currRecord.getValue({fieldId: 'custrecord_advs_mil_rep_curre_mile'});
			var StartingMileage = currRecord.getValue({fieldId: 'custrecord_advs_mil_rep_star_mil'});
    	
            var LeaseId         = currRecord.getValue({fieldId: 'custrecord_advs_mil_rep_lea_num'});
            var VinId           = currRecord.getValue({fieldId: 'custrecord_advs_mil_rep_vin'});
            var MileAgeDriven = "" ;

            var fieldsToUpdateOnLease = {};
                fieldsToUpdateOnLease['custrecord_advs_l_a_actual_mil'] = CurrentMileage ;
            
            if(CurrentMileage && StartingMileage){
                fieldsToUpdateOnLease['custrecord_advs_l_a_mileage'] = StartingMileage;
				CurrentMileage = CurrentMileage*1; 
				StartingMileage = StartingMileage*1;
                MileAgeDriven = (CurrentMileage-StartingMileage)*1; 
            }
            
            if(MileAgeDriven){
                fieldsToUpdateOnLease['custrecord_advs_l_a_driven_mileage'] = MileAgeDriven ;
            }
                if(LeaseId){
                        record.submitFields({
                            type: 'customrecord_advs_lease_header',
                            id: LeaseId,
                            values: fieldsToUpdateOnLease,
                            options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                            }
                        });
                  }
                  if(VinId && CurrentMileage){
                    record.submitFields({
                        type: 'customrecord_advs_vm',
                        id: VinId,
                        values: {"custrecord_advs_vm_mileage":CurrentMileage},
                        options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                        }
                    });
                  }
		}
        
		
	}

	return {
		beforeLoad: beforeLoad,
		beforeSubmit: beforeSubmit,
		afterSubmit: afterSubmit
	};

});
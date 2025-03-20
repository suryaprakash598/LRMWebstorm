/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log', 'N/runtime'], function(record, log, runtime) {
    
    function beforeSubmit(context) {
        if (context.type !== context.UserEventType.CREATE && context.type !== context.UserEventType.EDIT) return;

        var poRecord = context.newRecord;
		 var _newLocation = poRecord.getValue({fieldId:'location'});
      var _newLocationtemp = poRecord.getValue({fieldId:'custbody_advs_original_loc_to_update'});
      
		log.debug('_newLocation',_newLocation); 
      log.debug('_newLocationtemp',_newLocationtemp); 
        var newLocation = _newLocationtemp; // Replace with the desired Location ID

        // Update header location
        poRecord.setValue({ fieldId: 'location', value: newLocation });

        var lineCount = poRecord.getLineCount({ sublistId: 'item' });

        for (var i = 0; i < lineCount; i++) {
            poRecord.setSublistValue({
                sublistId: 'item',
                fieldId: 'location',
                line: i,
                value: newLocation
            });
 
        }
    } 

    return { beforeSubmit:beforeSubmit };
});

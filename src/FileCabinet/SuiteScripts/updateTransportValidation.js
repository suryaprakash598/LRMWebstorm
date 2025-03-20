/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/ui/dialog'], function (dialog) {
    var oldValue = {}; // Store old values when form loads

    function pageInit(context) {
        var currentRecord = context.currentRecord;
        
        // Store initial values of relevant fields
        oldValue.truckStatus = currentRecord.getValue({ fieldId: 'custpage_tpt_truckstatus' });
        oldValue.modulestatus = currentRecord.getValue({ fieldId: 'custpage_tpt_modulestatus' });
    }

    function saveRecord(context) {
        var currentRecord = context.currentRecord;
        
        var newTruckStatus = currentRecord.getValue({ fieldId: 'custpage_tpt_truckstatus' });
        var newModuleStatus = currentRecord.getValue({ fieldId: 'custpage_tpt_modulestatus' });

        // Check if truck status changed and if "Location To" is updated accordingly
         if (newModuleStatus ==11) {  //newModuleStatus ==10 ||
			if (oldValue.truckStatus == newTruckStatus ) {
                dialog.alert({
                    title: 'Validation Error',
                    message: 'You must change "Truck Status" when "Status" is changed to In-Transit Closed Out.'
                });
                return false; // Prevents form submission
            }
        }
        
        return true;
    }

    return {
        pageInit: pageInit,
        saveRecord: saveRecord
    };
});

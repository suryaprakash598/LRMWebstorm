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


        let lineCount = currentRecord.getLineCount({ sublistId: 'custpage_notes_sublist' });

        for (let i = 0; i < lineCount - 1; i++) { // Exclude last row (new row)
            let col1 = currentRecord.getSublistValue({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_date', line: i });
            let col2 = currentRecord.getSublistValue({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_notes', line: i });

            if (col2!='') {
                // Disable existing lines if they have data
               // currentRecord.getSublistField({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_date', line: i }).isDisabled = true;
                currentRecord.getSublistField({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_notes', line: i }).isDisabled = true;
            }
        }
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

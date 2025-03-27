/*******************************************************************************
{{ScriptHeader}} *
 * Company:                  {{Company}}
 * Author:                   {{Name}} - {{Email}}
 * File:                     {{ScriptFileName}}
 * Script:                   {{ScriptTitle}}
 * Script ID:                {{ScriptID}}
 * Version:                  1.0
 *
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 *
 ******************************************************************************/

define(['N/runtime', 'N/ui/dialog', 'N/record', 'N/search', 'N/log','N/url', 'N/https'], function(
  /** @type import('N/runtime')}   **/ runtime,
  /** @type import('N/ui/dialog')} **/ dialog,
  /** @type import('N/record')}    **/ record,
  /** @type import('N/search')}    **/ search,
  /** @type import('N/log')}       **/ log,
  /** @type import('N/log')}       **/ url,
  /** @type import('N/log')}       **/ https
) {

  /**
   * context.currentRecord
   * context.sublistId
   * context.fieldId
   * context.line
   * context.column
   *
   * @type {import('N/types').EntryPoints.Client.fieldChanged}
   */
   var _currentRecord = '';
   var oldValue = {}; // Store old values when form loads
   function pageInit(context)
   {
	   _currentRecord = context.currentRecord;
       //== new one for reason collections
        var Collections = _currentRecord.getValue({fieldId:"custpage_collections"});
        var ReasonForCollections = _currentRecord.getField({fieldId:"custpage_reason_fr_collec"});
        if(Collections == 2 || Collections == "2"){
            ReasonForCollections.isDisabled = false;
        }
        else{
            ReasonForCollections.isDisabled = true;
        }
      //== new one for reason collections
	  oldValue.truckStatus = _currentRecord.getValue({ fieldId: 'custpage_ofr_truckstatus' });
        oldValue.modulestatus = _currentRecord.getValue({ fieldId: 'custpage_ofr_status' });

       let lineCount = _currentRecord.getLineCount({ sublistId: 'custpage_termination_notes_sublist' });

       for (let i = 0; i < lineCount - 1; i++) { // Exclude last row (new row)
           let col1 = _currentRecord.getSublistValue({ sublistId: 'custpage_termination_notes_sublist', fieldId: 'custsublist_termination_date', line: i });
           let col2 = _currentRecord.getSublistValue({ sublistId: 'custpage_termination_notes_sublist', fieldId: 'custsublist_termination_notes', line: i });

           if (col2!='') {
               // Disable existing lines if they have data
               // currentRecord.getSublistField({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_date', line: i }).isDisabled = true;
               _currentRecord.getSublistField({ sublistId: 'custpage_termination_notes_sublist', fieldId: 'custsublist_termination_notes', line: i }).isDisabled = true;
           }
       }
       disableUserNotesSublist(_currentRecord);
   }
   function disableUserNotesSublist(_currentRecord)
   {
       let lineCount = _currentRecord.getLineCount({ sublistId: 'custpage_notes_sublist' });

       for (let i = 0; i < lineCount - 1; i++) { // Exclude last row (new row)
           let col1 = _currentRecord.getSublistValue({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_date', line: i });
           let col2 = _currentRecord.getSublistValue({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_notes', line: i });

           if (col2!='') {
               // Disable existing lines if they have data
               // currentRecord.getSublistField({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_date', line: i }).isDisabled = true;
               _currentRecord.getSublistField({ sublistId: 'custpage_notes_sublist', fieldId: 'custsublist_notes', line: i }).isDisabled = true;
           }
       }
   }
  function fieldChanged(context) {
    // no return value
	try{
		var currentRecord = context.currentRecord;
		if(context.fieldId=='custpage_repocompany')
		{ 
			currentRecord.setValue({fieldId:'custpage_putout',value:new Date(),ignoreFieldChange:true});
		}
        if(context.fieldId=='custpage_collections'){
            var Collections = currentRecord.getValue({fieldId:"custpage_collections"});
            var ReasonForCollections = currentRecord.getField({fieldId:"custpage_reason_fr_collec"});
            if(Collections == 2 || Collections == "2"){
                ReasonForCollections.isDisabled = false;
            }
            else{
                ReasonForCollections.isDisabled = true;
            }
        }
	}catch(e)
	{
		log.debug('error',e.toString());
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

        var CurrentRecord = scriptContext.currentRecord;
        var CurrentRecordType = scriptContext.currentRecord.type;

        var CollectionsVal = CurrentRecord.getValue({ fieldId: "custpage_collections"  });
        var ReasonsCollectionsVal = CurrentRecord.getValue({ fieldId: "custpage_reason_fr_collec"  });
        if((CollectionsVal == 2 || CollectionsVal == "2") && (ReasonsCollectionsVal == null || ReasonsCollectionsVal == "" || ReasonsCollectionsVal == undefined)){
           alert('Please Provide a reason for Collection');
           return false;
        }
		
		var newTruckStatus = CurrentRecord.getValue({ fieldId: 'custpage_ofr_truckstatus' });
        var newModuleStatus = CurrentRecord.getValue({ fieldId: 'custpage_ofr_status' });

        // Check if truck status changed and if "Location To" is updated accordingly
         if (newModuleStatus ==39 || newModuleStatus ==46) {
			if (oldValue.truckStatus == newTruckStatus ) {
                dialog.alert({
                    title: 'Validation Error',
                    message: 'You must change "Truck Status" when "Status" is changed to Redeemed / Repo Closed Out.'
                });
                return false; // Prevents form submission
            }
        }
        return true;
    }
  function getlastlocation(vin)
  {
	  
	  var suiteletURL = url.resolveScript({
                    scriptId: 'customscript_get_goldstar_data',
                    deploymentId: 'customdeploy_get_goldstar_data',
                    returnExternalUrl: false,
                    params: {
                        'custpage_vin': vin,
                    }
                });
                
                https.get.promise({
                    url: suiteletURL
                }).then(function (response) {
                    log.debug('response',response.body);
					var data = JSON.parse(response.body);
					var locations = data[0].lat +" , "+ data[0].lng;
					_currentRecord.setValue({fieldId:'custpage_location_goldstar',value:locations,ignoreFieldChange:true});
                  _currentRecord.setValue({fieldId:'custpage_odometer',value:data[0].odometer,ignoreFieldChange:true});
                  console.log('response',response);
                }).catch(function (reason) {
                    log.debug("failed to send email", reason)
                     
                });
  }
  function sendlastlocation(vin)
  {
	  try{
		  var coordinates = _currentRecord.getValue({fieldId:'custpage_location_goldstar'});
		  var repocompany = _currentRecord.getValue({fieldId:'custpage_repocompany'});
		  if(repocompany!='' && coordinates!=''){
			  var suiteletURL = url.resolveScript({
                    scriptId: 'customscriptsend_coordinates_to_repocomp',
                    deploymentId: 'customdeploysend_coordinates_to_repocomp',
                    returnExternalUrl: false,
                    params: {
                        'custpage_coordinates': coordinates,
                        'custpage_repocompany': repocompany
                    }
                });
				https.get({
                    url: suiteletURL
                });
				
				window.close();
		  }else{
			  alert(" Please choose Repo Company and get Location from Goldstar");
		  }
		   
		 
	  }catch(e)
	  {
		  log.debug('error',e.toString());
	  }
	   
  }

   
  return {
	  'pageInit':pageInit,
    'fieldChanged': fieldChanged ,
    'saveRecord': saveRecord,
	'getlastlocation':getlastlocation,
	'sendlastlocation':sendlastlocation
  };

});

/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/runtime', 'N/file', 'N/encode','N/url', 'N/redirect', 'N/url', 'N/format'],
		/**
		 * @param {record} record
		 * @param {search} search
		 * @param {serverWidget} serverWidget
		 */
		function(record, search, serverWidget, runtime, file, encode,ur, redirect, url, format) {

	/**
	 * Definition of the Suitelet script trigger point.
	 *
	 * @param {Object} context
	 * @param {ServerRequest} context.request - Encapsulation of the incoming request
	 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
	 * @Since 2015.2
	 */
	function onRequest(scriptContext) {
		var request = scriptContext.request;
		var response = scriptContext.response;
		if(request.method == "GET") {
			var form        = serverWidget.createForm({title:"Physical Location",hideNavBar:true}); 
			var VehicleID   = request.parameters.custparam_vinid;   
			
            var CustSubsi = '', VEhLocation = ''; 
			var VinLookup = search.lookupFields({
				type: 'customrecord_advs_vm',
				id: VehicleID,
				columns: ['custrecord_advs_physical_loc_ma']
			});
 
			
			if(VinLookup.custrecord_advs_physical_loc_ma[0] != null && VinLookup.custrecord_advs_physical_loc_ma[0] != undefined){
                var VEhLocation = VinLookup.custrecord_advs_physical_loc_ma[0].value;
            }
 
            
            var locfld      = form.addField({id:"custpage_physical_location", label:"Location", type:serverWidget.FieldType.SELECT, source: "customlistadvs_list_physicallocation"});
            var vinfld      = form.addField({id:"custpage_vin_id", label:"VIN ID", type:serverWidget.FieldType.TEXT});
            vinfld.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
            if(VEhLocation){
                locfld.defaultValue = VEhLocation;
            }  if(VehicleID){
                vinfld.defaultValue = VehicleID;
            }
 
    form.addSubmitButton({id: 'custpage_update_location', label: 'UPDATE'});

    response.writePage(form);
    }else{
 
		var LocId        = request.parameters.custpage_physical_location; 
		var VinId        = request.parameters.custpage_vin_id; 
			if(VinId)
			{
				record.submitFields({type:'customrecord_advs_vm',id:VinId,values:{custrecord_advs_physical_loc_ma:LocId},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
			}
			var onclickScript=" <html><body> <script type='text/javascript'>" +
			"try{debugger;" ;  
			onclickScript+="window.parent.location.reload();";	 
			onclickScript+="window.close();;";
			onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";
			 response.write(onclickScript);
	}
}

    return {
		onRequest: onRequest
	};

});
/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 Feb 2019     EVT2018_02
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function userEventBeforeLoad(type, form, request){ 
  
	if(type == "view"){

		var RecordId	=	nlapiGetRecordId();
		var vin = nlapiGetFieldValue('name');
      var suiteletUrl = nlapiResolveURL('SUITELET', 'customscript_advs_inventory_report', 'customdeploy_advs_inventory_report');
        suiteletUrl+='&custpara_vinid='+RecordId;
      var script = "var w = 800, h = 400; " +
                     "var left = (screen.width - w) / 2; " +
                     "var top = (screen.height - h) / 2; " +
                     "window.open('" + suiteletUrl + "', '_blank', " +
                     "'width=' + w + ',height=' + h + ',left=' + left + ',top=' + top + " +
                     "',resizable=yes,scrollbars=yes');";
      
      var url='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2603&deploy=1&custpara_vinid='+RecordId;
		form.addButton("custpage_veh_dash", "Vehicle Dashboard",script);

		//form.setScript("customscript_advs_csat_vehicle_dashboard");
		//form.setScript("customscript_advs_csat_vehicle_master");
       }

	 
}

 

/**
 * Module Description
 *
 * Version    Date            Author           Remarks
 * 1.00       25 Aug 2018     EVT11
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
/**
 * Module Description
 *
 * Version    Date            Author           Remarks
 * 1.00       05 Apr 2016     ultimus_03
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){

	if(request.getMethod() == 'GET'){


		var custparam_date = request.getParameter('custparam_date');
		var vinID			 = request.getParameter('custparam_id');

		// var custparam_id = request.getParameter('custparam_id');
		// var vinID			 = request.getParameter('vinID');
		// nlapiLogExecution('DEBUG', 'custparam_date', custparam_date);
		// 	nlapiLogExecution('DEBUG', 'vinID', vinID);

                  nlapiLogExecution('ERROR', 'custparam_date', custparam_date);
                  nlapiLogExecution('ERROR', 'vinID', vinID);



		if(custparam_date !=null && custparam_date !='' && custparam_date !=undefined){

		}else{
			custparam_date = nlapiDateToString(new Date());
		}

		var vinNumber	=	"";
		if(vinID !=null && vinID !='' && vinID !=undefined){
			vinNumber	=	nlapiLookupField("customrecord_advs_vm", vinID, "name");
		}
		nlapiLogExecution('ERROR', 'custparam_date', custparam_date);
                  nlapiLogExecution('ERROR', 'vinNumber', vinNumber);


		/*

		 */


		// var search_1 = nlapiLoadSearch('', 'customsearch2645');//Search id 927 in Volvo Sandbox A
		// search_1.addFilter(new nlobjSearchFilter('trandate', null, 'onorbefore', custparam_date));
		// if(vinNumber !=null && vinNumber !='' && vinNumber !=undefined){
		// 	search_1.addFilter(new nlobjSearchFilter('serialnumber', null, 'is', vinNumber));
		// }
		// var run_1 = search_1.runSearch();
		// var col_1 = run_1.getColumns();
		// var start = 0,end = 1000,index= 1000;
		// var VinSData	=	new Array();
		// while(index == 1000){
		// 	var rs = run_1.getResults(start, end);
		// 	for(var i=0;i<rs.length;i++){
		// 		var rec = rs[i];
		// 		var VinText	=	rec.getText(col_1[0]);
		// 		var Amount	=	rec.getValue(col_1[1])*1;

		// 		VinSData[VinText]	=	new Array();
		// 		VinSData[VinText]["Amnt"]	=	Amount*1;
		// 	}
		// 	start = end; end = start + 1000; index = rs.length;
		// }


		var form = nlapiCreateForm('Vehicle Inventory Cost');
		form.setScript('customscript_advs_csf_vehicle_valuation_');
		var date_fld = form.addField('custpage_date', 'date', 'As Of Date');
		date_fld.setDefaultValue(custparam_date);


		var html_fld = form.addField('custpage_html', 'inlinehtml', '');

		html_fld.setLayoutType('outsidebelow');
		var html="",html_excel="";
		html +="<style>";
		html +="#table_headers {";
		html +='font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;';
		html +="border-collapse: collapse; border:1;";
		html +="width: 100%;";
		html +="}";
		html +="#table_headers td, #customers th {";
		html +="border: 1px solid #ddd;";
		html +="padding: 6px;";
		html +="}";

		html +="#table_headers tr:nth-child(even){background-color: #f2f2f2;}";

		html +="#table_headers tr:hover {background-color: #ddd;}";

		html +="#table_headers th {";
		html +="padding-top: 8px;";
		html +="padding-bottom: 8px;";
		html +="text-align: left;";
		html +="background-color: #D8D8D8;";
		html +="color: white;";
		html +="font-size: small;";
		html +="background-color: crimson;";
		html +="}";
		html +="</style>";


		html +="<table id='table_headers'>";//
		html +="<tr>" +
		"<th>&nbsp;&nbsp;MODEL</th>" +
		"<th>&nbsp;&nbsp;SUBSIDIARY</th>" +
		"<th>&nbsp;&nbsp;LOCATION</th>" +
		"<th>&nbsp;&nbsp;VIN</th>" +
		"<th>&nbsp;&nbsp;INBOUND DATE</th>" +
		//"<th>&nbsp;&nbsp;AGE (IN DAYS)</th>" +
		"<th>&nbsp;&nbsp;BASE COST</th>" +
		"<th>&nbsp;&nbsp;ADDITIONAL CHARGES</th>" +
		// "<th>&nbsp;&nbsp;MISC</th>" +
		"<th>&nbsp;&nbsp;LANDED COST</th>" +
//		"<th>STOCK<br/>(IN UINTS)</th>" +



		"</tr>";

		html_excel +="<table border='1'>";//
		html_excel +="<tr>" +
		"<th>&nbsp;&nbsp;MODEL</th>" +
		"<th>&nbsp;&nbsp;SUBSIDIARY</th>" +
		"<th>&nbsp;&nbsp;LOCATION</th>" +
		"<th>&nbsp;&nbsp;VIN</th>" +
		"<th>&nbsp;&nbsp;INBOUND DATE</th>" +
//		"<th>&nbsp;&nbsp;AGE (IN DAYS)</th>" +
		"<th>&nbsp;&nbsp;BASE COST</th>" +
		"<th>&nbsp;&nbsp;ADDITIONAL CHARGES</th>" +
		// "<th>&nbsp;&nbsp;MISC</th>" +
		"<th>&nbsp;&nbsp;LANDED COST</th>" +
//		"<th>STOCK(IN UINTS)</th>" +

		"</tr>";

		var land_cost_details_url = nlapiResolveURL('SUITELET', 'customscript_advs_ssf_landed_cost_import', 'customdeploy_advs_ssf_landed_cost_import');// Ignore this if you want
		var search = nlapiLoadSearch('', 'customsearch_machine_inventory_report');//Search id 927 in Volvo Sandbox A
		search.addFilter(new nlobjSearchFilter('trandate', null, 'onorbefore', custparam_date));
		if(vinNumber !=null && vinNumber !='' && vinNumber !=undefined){
			search.addFilter(new nlobjSearchFilter('serialnumber', null, 'is', vinNumber));
		}
		var run = search.runSearch();
		var col = run.getColumns();
		var start = 0,end = 1000,index= 1000;
		while(index == 1000){
			var rs = run.getResults(start, end);
			for(var i=0;i<rs.length;i++){
				var rec = rs[i];
				var item = rec.getValue(col[0]);
				var item_text = rec.getText(col[0]);
                var Subsidiary = rec.getText(col[1]);
                var Location = rec.getText(col[2]);
                var Vin = rec.getValue(col[3]);
				var vehicle_inbound_date = rec.getValue(col[4]);
				// var age_in_days = rec.getValue(col[5]);
				var vehicle_base_cost = rec.getValue(col[5]);
				var additional_charges = rec.getValue(col[6]);
                var vehicle_landed_cost = rec.getValue(col[7]);
				var stock_in_units = rec.getValue(col[8]);

				var MischAmnt	=	0;
				// if(VinSData[Vin] != null && VinSData[Vin] != undefined){
				// 	MischAmnt	=	VinSData[Vin]["Amnt"]*1;
				// }else{

				// }
				// MischAmnt	=	MischAmnt*1;
				// MischAmnt	=	MischAmnt.toFixed(2);


				vehicle_landed_cost	=	vehicle_landed_cost*1;
				vehicle_landed_cost+=MischAmnt*1;
				vehicle_landed_cost	=	vehicle_landed_cost*1;
				vehicle_landed_cost	=	vehicle_landed_cost.toFixed(2);

				var land_cost_details_url_post = land_cost_details_url+'&custparam_item='+item+'&custparam_date='+custparam_date+'&custparam_serial_number='+Vin;
				html +="<tr><td>&nbsp;&nbsp;&nbsp;"+item_text+"</td>" +

				"<td>"+Subsidiary+"</td>" +
				"<td>"+Location+"</td>" +
				"<td>"+Vin+"</td>" +
				"<td>"+vehicle_inbound_date+"</td>" +
//				"<td>"+age_in_days+"</td>" +
				"<td>"+vehicle_base_cost+"</td>" +
				"<td><a href='"+land_cost_details_url_post+"' target='_blank'>"+additional_charges+"</a></td>" +
//				"<td>"+additional_charges+"</a></td>" +
				// "<td>"+MischAmnt+"</td>" +
				"<td>"+vehicle_landed_cost+"</td>" +
//				"<td>"+stock_in_units+"</td>" +

				"</tr>";

				html_excel +="<tr><td>&nbsp;&nbsp;&nbsp;"+item_text+"</td>" +
				"<td>"+Subsidiary+"</td>" +
				"<td>"+Location+"</td>" +
				"<td>"+Vin+"</td>" +
				"<td>"+vehicle_inbound_date+"</td>" +
//				"<td>"+age_in_days+"</td>" +
				"<td>"+vehicle_base_cost+"</td>" +
				"<td>"+additional_charges+"</td>" +
				// "<td>"+MischAmnt+"</td>" +
				"<td>"+vehicle_landed_cost+"</td>" +
//				"<td>"+stock_in_units+"</td>" +

				"</tr>";
			}
			start = end; end = start + 1000; index = rs.length;
		}
		var ia2obj =[];// getReturnedVinFromLease(vinNumber);
		for(var jk=0;jk<ia2obj.length;jk++)
		{
			
			html +="<tr><td>&nbsp;&nbsp;&nbsp;"+item_text+"</td>" + 
				"<td>"+ia2obj[jk].Subsidiary+"</td>" +
				"<td>"+ia2obj[jk].location+"</td>" +
				"<td>"+vinNumber+"</td>" +
				"<td>"+ia2obj[jk].dateinboundia2+"</td>" + 
				"<td>"+ia2obj[jk].currentcost+"</td>" +
				"<td>0</td>" +
				 // "<td><a href='"+land_cost_details_url_post+"' target='_blank'>"+additional_charges+"</a></td>" +
 				 "<td>0</td>" + 
				"</tr>";
		}
		html +="</table>";
		html_excel +="</table>";
		html_fld.setDefaultValue(html);
		var context = nlapiGetContext();
		context.setSessionObject('custpage_veh_inv_deta', html_excel);
		form.addSubmitButton('Export');
		response.writePage(form);
	}else{
		var context = nlapiGetContext();
		var export_html = context.getSessionObject('custpage_veh_inv_deta');
		var files = nlapiCreateFile('Landed Cost Report.xls', 'EXCEL', nlapiEncrypt(export_html,'base64'));
		response.setContentType('EXCEL', 'Landed Cost Report.xls', 'inline');
		response.write(files.getValue());
	}
}
function getReturnedVinFromLease(vinname)
{
	try{
		var ncfar_assetSearch = nlapiSearchRecord("customrecord_ncfar_asset",null,
		[
		   ["name","is",vinname], 
		   "AND", 
		   ["custrecord_advs_disposal_ia","noneof","@NONE@"]
		], 
		[
		   new nlobjSearchColumn("altname"), 
		   new nlobjSearchColumn("custrecord_assetlocation"), 
		   new nlobjSearchColumn("custrecord_assetsubsidiary"), 
		   new nlobjSearchColumn("custrecord_assetcost"), 
		   new nlobjSearchColumn("custrecord_assetcurrentcost"), 
		   new nlobjSearchColumn("custrecord_assetlifetime"), 
		   new nlobjSearchColumn("custrecord_advs_disposal_ia"), 
		   new nlobjSearchColumn("datecreated","CUSTRECORD_ADVS_DISPOSAL_IA",null)
		]
		);
		
		var arr=[];
		if(ncfar_assetSearch && ncfar_assetSearch.length)
		{
			var obj={};
			obj.name=ncfar_assetSearch[0].getValue('altname');
			obj.Subsidiary=ncfar_assetSearch[0].getText('custrecord_assetsubsidiary');
			obj.location=ncfar_assetSearch[0].getText('custrecord_assetlocation');
			obj.currentcost=ncfar_assetSearch[0].getValue('custrecord_assetcurrentcost');
			obj.ia2=ncfar_assetSearch[0].getValue('custrecord_advs_disposal_ia');
			obj.ia2Text=ncfar_assetSearch[0].getText('custrecord_advs_disposal_ia');
			obj.dateinboundia2=ncfar_assetSearch[0].getValue("datecreated","CUSTRECORD_ADVS_DISPOSAL_IA",null);
			 arr.push(obj);
		}
		return arr;
	}catch(e)
	{
		nlapiLogExecution('error','Error',e.toString());
	}
}
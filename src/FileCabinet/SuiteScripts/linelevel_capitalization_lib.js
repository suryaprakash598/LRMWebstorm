/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       12 Aug 2019     shash
 *
 */
function ValidateforCapitalization(){
	var module     =  nlapiGetFieldValue("custbody_advs_module_name");
	if(module == '2' || module == 2){
		var Model  =   '';
		var VinID	=	nlapiGetFieldValue("custbody_so_stockunit");
		if(VinID){
			Model  =   nlapiLookupField('customrecord_stock_book', VinID, 'custrecord_bus_model')
		}
	}else{
		var VinID	=	nlapiGetFieldValue("custbody_advs_st_service_equipment");    	 
	}
	var LocI	=	nlapiGetFieldValue("location");
	var ReqTranID	=	nlapiGetRecordId();
	var Remarks	=	nlapiGetFieldValue("memo");
	var cost	=	nlapiGetFieldValue("total");
	var InvNumb	=	nlapiGetFieldValue("custbody_advs_stock_unit_vin");
	var InvoiceDate = nlapiGetFieldValue("trandate");
	var capiMEmo	=	nlapiGetFieldValue("custbody_advs_capitalization_memo");
	if(!capiMEmo){
		capiMEmo	=	Remarks;
	}
	
	var existCapitalizeId = FindExistCapitalization(ReqTranID,InvoiceDate);
	if(existCapitalizeId){
		
	}else{
		var postcapirec = nlapiCreateRecord("customrecord_advs_cap_rec", {recordmode:'dynamic'});
		postcapirec.setFieldValue("custrecord_advs_c_r_cin",VinID );
		if(module == '2' || module == 2){
			postcapirec.setFieldValue("custrecord_advs_c_r_model",Model );
		 }
		postcapirec.setFieldValue("custrecord_advs_c_r_cost", cost);
		postcapirec.setFieldValue("custrecord_advs_c_r_remark", capiMEmo);
		postcapirec.setFieldValue("custrecord_advs_c_r_trans", ReqTranID);
		postcapirec.setFieldValue("custrecord_advs_v_c_location", LocI);
		postcapirec.setFieldValue("custrecord_advs_c_r_force_inv_date", InvoiceDate); 
		postcapirec.setFieldText("custrecord_advs_v_c_inventory_number",InvNumb);
		if(nlapiGetRecordType() == 'vendorbill'){
		   postcapirec.setFieldValue("custrecord_advs_veh_cap_cus_cap_type",2);//Outside Vendor Prep	
	   }else{
		   postcapirec.setFieldValue("custrecord_advs_veh_cap_cus_cap_type",1);//Dealer Prep
	   }
		var CapiREc = nlapiSubmitRecord(postcapirec,true,true);	
	}
	var ScriptCount = getScheduleScriptCount();
	nlapiLogExecution('ERROR','ScriptCount',ScriptCount);
	if(ScriptCount == 0){
		nlapiScheduleScript("customscript_advs_scaa_post_capitializat", "customdeploy_advs_scaa_post_capitializat");	
	}
}

function FindExistCapitalization(recID,ForceInvoiceDate){
	var search	= nlapiCreateSearch("customrecord_advs_cap_rec", 
			[

			 ["custrecord_advs_c_r_trans","anyof",recID]
			 ,"AND",
			 ["isinactive","is","F"]
			], 
			[
				new nlobjSearchColumn("internalid", null, null),
				new nlobjSearchColumn("custrecord_advs_a_c_transfer_1", null, null),
				new nlobjSearchColumn("custrecord_advs_c_r_first_inve_adjustmen", null, null),
			]);
	var run	= search.runSearch();
	var cols = run.getColumns();
	var CapitalizeId = '';
	run.forEachResult(function(rec){
		var IntId =	rec.getValue("internalid", null, null);
		var TransferOrder =	rec.getValue("custrecord_advs_a_c_transfer_1", null, null);
		var InventoryTransfer =	rec.getValue("custrecord_advs_c_r_first_inve_adjustmen", null, null);
		var Update = 'T';
		if(TransferOrder){
			Update = 'F';
		}else if(InventoryTransfer){
			Update = 'F';
		}else{
			Update = 'T';
		}
		if(Update == 'T'){
			var fields = ['custrecord_advs_c_r_is_done','custrecord_advs_c_r_force_inv_date','custrecord_advs_c_r_date',
						  'custrecord_advs_c_r_is_failed','custrecord_advs_c_r_error_message'];
			var values = ['F',ForceInvoiceDate,ForceInvoiceDate,'F',''];
			nlapiSubmitField('customrecord_advs_cap_rec', IntId, fields, values, true);
		}
		CapitalizeId = IntId;
		return true;
	});
	return CapitalizeId;
}

function getScheduleScriptCount(){
	var SearchSchedule = nlapiCreateSearch("scheduledscriptinstance",
			[
			   ["status","anyof","PENDING","PROCESSING"]
			], 
			[
			   new nlobjSearchColumn("status"), 
			   new nlobjSearchColumn("percentcomplete")
			]
			);

	SearchSchedule.addFilter(new nlobjSearchFilter('scriptid', 'script', 'is', 'customscript_advs_scaa_post_capitializat'));	
	var ResultSchedule=SearchSchedule.runSearch();
	var Count = 0;
	ResultSchedule.forEachResult(function(rec) {
		Count++;
		return true;
	});
	return Count;
}

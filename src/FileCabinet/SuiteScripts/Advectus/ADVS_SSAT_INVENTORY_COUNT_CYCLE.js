/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       09 May 2020     Anirudh Tyagi
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){

	if(request.getMethod() == "GET"){
		
	}else{
		
		var Flag		=	request.getParameter("custparam_flag");
		var RecordId	=	request.getParameter("custparam_recordId");
		
		if(Flag	==	1 || Flag == "1"){
			
			nlapiScheduleScript("customscript_advs_scat_add_items_inv_cyc", "customdeploy_advs_scat_add_items_inv_cyc", null);
			
			response.write(RecordId);
			
		}else if(Flag == "2" || Flag == 2){
			
			
		}else if(Flag == "3" || Flag == 3){
			
			var Fields	=	new Array();
			Fields.push("custrecord_advs_annual_progress_status");
			Fields.push("custrecord_advs_annual_stock_status");
			
			var Values	=	new Array();
			Values.push("3");
			Values.push("3");
			
			nlapiSubmitField("customrecord_advs_at_annual_stock_take", RecordId, Fields, Values, null);
			
			response.write("Inventory Count Successfully cancelled.");
		}
		
	}
	
}


function CheckSchedulePercentage(ScriptId){
	
	ScriptId		=	ScriptId.toString();
	
	var SearchSchedule = nlapiCreateSearch("scheduledscriptinstance",
			[
			   ["status","anyof","PENDING","PROCESSING","RETRY"]
			], 
			[
			   new nlobjSearchColumn("status"), 
			   new nlobjSearchColumn("percentcomplete")
			]
			);

	SearchSchedule.addFilter(new nlobjSearchFilter('scriptid', 'script', 'is', ScriptId));

	
	
	var ResultSchedule=SearchSchedule.runSearch();
	var ColSchedule=ResultSchedule.getColumns();
	var sc_staus='',sc_per_comp='';
	
	ResultSchedule.forEachResult(function(rec) {
		
		sc_staus		=	rec.getValue(ColSchedule[0]);
		sc_per_comp		=	rec.getValue(ColSchedule[1]);
		
		return true;
	});
	
	nlapiLogExecution("ERROR", "sc_staus", sc_staus);
	
	if(sc_staus!=''){
		
		try {
			setTimeout(function() {
				CheckSchedulePercentage(ScriptId);	
			}, 8000);	
		} catch (e) {
			// TODO: handle exception
		}
		
		
	}else{
		
	}
	
	
	
	return sc_staus;
}
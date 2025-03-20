/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 May 2020     Anirudh Tyagi
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){

	if(request.getMethod() == "GET"){
	
		var InventoryId			=	request.getParameter("custparam_inv_id");
		var CountType			=	request.getParameter("custparam_count_type");
		
		var form				=	nlapiCreateForm("");
		
		var InvCountFld			=	form.addField("custpage_inv_count", "select", "Inv. Count ID", "customrecord_advs_at_annual_stock_take");
		InvCountFld.setDisplayType("inline");
		InvCountFld.setDefaultValue(InventoryId);
		
		var InvCountFld			=	form.addField("custpage_inv_count_type", "select", "Inv. Count Type", "customlist_advs_at_inv_count_type");
		InvCountFld.setDisplayType("inline");
		InvCountFld.setDefaultValue(CountType);
		
		var PageNumberFld		=	form.addField("custpage_page_no", "integer", "Page #").setDisplayType("hidden");;
		
		var PrintAllFld			=	form.addField("custpage_print_all", "checkbox", "Print All");
		
//		PageNumberFld.setMandatory(true);
		
		
		form.addSubmitButton("Print");
		form.setScript('customscript_advs_csat_annual_stock');
		response.writePage(form);
	}else{
		
		var InventoryId			=	request.getParameter("custpage_inv_count");
		var PageNumber			=	request.getParameter("custpage_page_no");
		var CountType			=	request.getParameter("custpage_inv_count_type");
		var PrintAll			=	request.getParameter("custpage_print_all");
		
		if(PrintAll == "T"){
			
		}else{
			
			if(PageNumber){
				
			}else{
			
				throw nlapiCreateError("Please Enter Page #", "Please Enter Page #", null);
				return false;
			}			
		}
		
		var onclickScript=" <html><body> <script type='text/javascript'>" +
		"try{" +
		"var InventoryId='"+InventoryId+"';" +
		"var PageNumber='"+PageNumber+"';" +
		"var CountType='"+CountType+"';" +
		"var PrintAll='"+PrintAll+"';" +
		"";

		onclickScript+="" +
		"window.parent.OpenNewDiscWindow(InventoryId,PageNumber, CountType, PrintAll);";
		onclickScript+="window.parent.closePopup();";
		onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";
		response.write(onclickScript);
		
	}
	
	
}
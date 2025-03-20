/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       18 Feb 2020     Advectus
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
	if(type=="view"){
		form.setScript("customscript_advs_csaa_rental_header");
//	    form.addButton('custpage_button_print', 'Print', 'print_document('+nlapiGetRecordId()+')');	

		var status		=	nlapiGetFieldValue("custrecord_advs_l_h_status");
		var status		=	nlapiGetFieldValue("custrecord_advs_l_h_status");
		
		if (status == 1  ||status == '1'  ) {
//			form.addButton('custpage_button_confirm', 'Confirm', 'confirmAction('+nlapiGetRecordId()+')');
		  }
		
		var contType	=	nlapiGetFieldValue("custrecord_advs_contract_type");
		if(contType == 1){
                form.addButton("custpage_payment", "Print Scheduled Payment", "leasePayment("+nlapiGetRecordId()+")");
        }
      

		var Assigned	=	nlapiGetFieldValue("custrecord_advs_r_h_no_o_as_line")*1;
		if(Assigned>0){
			
			form.addButton("custpage_addons", "Add on", "addons("+nlapiGetRecordId()+")");
			form.addButton("custpage_confirm", "Confirm..", "Confirm("+nlapiGetRecordId()+")");
			
		}
		
		if(status == "5" || status == 5){
           var VinId		=	nlapiGetFieldValue("custrecord_advs_la_vin_bodyfld");
           var Lessee		=	nlapiGetFieldValue("custrecord_advs_l_h_customer_name");
	//		form.addButton("custpage_return", "Return", "returnstock("+nlapiGetRecordId()+")");	
          addhtmlButtons(form,nlapiGetRecordId());
			// form.addButton("custpage_lease_account_stm", "Lease Account Statement", "buyoutOpen("+nlapiGetRecordId()+",1)"); // Moved TO Header Html Button
          var payoff = form.addButton("custpage_buyout", "Pay-Off", "buyoutOpen("+nlapiGetRecordId()+",2,"+Lessee+","+VinId+")");
		}
			
		form.addButton("custpage_la_pdf", "Lease Agreement", "functionLA(" + nlapiGetRecordId() + ")");
		// form.addButton("custpage_la_savesearh", "Lease Agreement-History", "searchhistoy(" + nlapiGetRecordId() + ")"); // Moved TO Header Html Button
		
		var executed	=	nlapiGetFieldValue("custrecord_advs_r_h_no_of_exec_lines")*1;
      var executedStatus	=	nlapiGetFieldValue("custrecord_advs_l_h_status");
//
//		if(executedStatus == 6 || executedStatus == '6'){
////			form.addButton("custpage_future_pay", "Future Pay", "futurepay("+nlapiGetRecordId()+")");	
//			          
//          if(contType == 1){
//            form.addButton("custpage_return", "Return", "returnstocklease("+nlapiGetRecordId()+")");	
//            form.addButton("custpage_buyout", "Buyout", "buyoutOpen("+nlapiGetRecordId()+",1)");	
//				////lease
//          }else{
//            			form.addButton("custpage_return", "Return", "returnstock("+nlapiGetRecordId()+")");	
//            			form.addButton("custpage_buyout", "Buyout", "buyoutOpen("+nlapiGetRecordId()+",2)");	
//            	/// renral
//          }
//		}
		
	if(Assigned >0 || executed>0){
		form.addButton("custpage_change","Change Unit #","changeveh("+nlapiGetRecordId()+")");
		
		form.addButton("custpage_cpi","CPI","addCpi("+nlapiGetRecordId()+")");
	}
		
		var AddonsAvail	=	checkForAddons(nlapiGetRecordId());
		if(AddonsAvail=="T"){
			var Message	=	"Script is in Progress..Please refresh after sometimes...";
			AddDueFld(form,Message);
		}
		
		
		if(status==6){
			var ProcessingBack	=	searchHeaderList(nlapiGetRecordId());
			
//			if((ConfirmInvoice) && (ProcessingBack!="T")){
////				form.addButton("custpage_return", "Return", "returnstock("+recid+")");
//			}else{
			if(ProcessingBack=="T"){
				var Message	=	"Return Process is in Progress..!! Please refresh after Sometime.";
				AddDueFld(form,Message);
			}
				
//			}
			
			
		}
		
		var sublistC	=	nlapiGetLineItemCount("recmachcustrecord_advs_r_p_head_link");
		
		if(contType == 1 || contType =="1"){}else{
			
		}
	}
 
	if(type=="copy"){
		var recID		=	request.getParameter("id");
		if(recID != null && recID != undefined && recID != ""){
			
			nlapiSetFieldValue("custrecord_advs_l_h_status", 1);
			nlapiSetFieldValue("custrecord_advs_r_h_confirm_inv", "");
			
			var createrecord	=	nlapiLoadRecord("customrecord_advs_rental_header", recID);
			var LineCount	=	createrecord.getLineItemCount("recmachcustrecord_advs_r_h_header_link");
			for(var f=1;f<=LineCount;f++){
				var Model	=	createrecord.getLineItemValue("recmachcustrecord_advs_r_h_header_link", "custrecord_advs_r_h_modell", f);
				var PAyfreq	=	createrecord.getLineItemValue("recmachcustrecord_advs_r_h_header_link", "custrecord_advs_r_h_paymnt_freq", f);
				var cust	=	createrecord.getLineItemValue("recmachcustrecord_advs_r_h_header_link", "custrecord_advs_r_h_customers", f);
				var loc		=	createrecord.getLineItemValue("recmachcustrecord_advs_r_h_header_link", "custrecord_advs_r_h_locations", f);
				var StDate	=	createrecord.getLineItemValue("recmachcustrecord_advs_r_h_header_link", "custrecord_advs_r_h_strt_dt", f);
				var amount	=	createrecord.getLineItemValue("recmachcustrecord_advs_r_h_header_link", "custrecord_advs_r_c_cont_amount", f)*1;
				
				
				
				nlapiSelectNewLineItem("recmachcustrecord_advs_r_h_header_link");
				nlapiSetCurrentLineItemValue("recmachcustrecord_advs_r_h_header_link", "custrecord_advs_r_h_modell", Model);
				nlapiSetCurrentLineItemValue("recmachcustrecord_advs_r_h_header_link", "custrecord_advs_r_h_stock_status", 7);
				nlapiSetCurrentLineItemValue("recmachcustrecord_advs_r_h_header_link", "custrecord_advs_r_h_strt_dt", StDate);
				nlapiSetCurrentLineItemValue("recmachcustrecord_advs_r_h_header_link", "custrecord_advs_r_h_paymnt_freq", PAyfreq);
				nlapiSetCurrentLineItemValue("recmachcustrecord_advs_r_h_header_link", "custrecord_advs_r_h_customers", cust);
				nlapiSetCurrentLineItemValue("recmachcustrecord_advs_r_h_header_link", "custrecord_advs_r_h_locations", loc);
				nlapiSetCurrentLineItemValue("recmachcustrecord_advs_r_h_header_link", "custrecord_advs_r_c_cont_amount", amount);
				nlapiCommitLineItem("recmachcustrecord_advs_r_h_header_link");
				
				
//				createrecord.selectNewLineItem("recmachcustrecord_advs_r_h_header_link");
				
				
			}
			
		}
		
		
		
	}
	if(type=="create"){
		var fldDis	=	nlapiGetField("custrecord_advs_r_h_type_of_lease");
		if(fldDis){
			fldDis.setDisplayType("normal");
		}
		form.addButton("custpage_createus", "Create Customer", "createCus("+nlapiGetRecordId()+")");
	}
	
	if(type == "create" && request){
		
	
		
		var vinID	=	request.getParameter("param_vin");
		var custID	=	request.getParameter("custparam_customer");
		var soID	=	request.getParameter("custparam_soid");
		var locID	=	request.getParameter("custparam_location");
		
		if(vinID != null && vinID != undefined && vinID != ""){
//			nlapiSetFieldValue("custrecord_advs_r_a_vm", vinID);
			nlapiSetFieldValue("custrecord_advs_la_vin_bodyfld", vinID);
			
			if(custID != null && custID != undefined && custID != ""){
				nlapiSetFieldValue("custrecord_advs_l_h_customer_name", custID);
			}
			
			if(soID != null && soID != undefined && soID != ""){
				nlapiSetFieldValue("custrecord_advs_sales_order", soID);
			}
			
			if(locID != null && locID != undefined && locID != ""){
				nlapiSetFieldValue("custrecord_advs_r_h_location", locID);
			}
//			nlapiSetFieldValue("custrecord_advs_r_h_customer_name", custID);
			
		}
		
	
	}
	
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
function userEventBeforeSubmit(type){
 
	if(type == "create"|| type == "edit"){
		
		
		
		var RevenuePer	=	nlapiGetFieldValue("custrecord_advs_r_h_rev_share_per");
		var status	=	nlapiGetFieldValue("custrecord_advs_l_h_status");
		// var ContarctType	=	nlapiGetFieldValue("custrecord_advs_contract_type");
		
		RevenuePer		=	parseFloat(RevenuePer);
		RevenuePer		=	RevenuePer*1;
		
		var RentalTable	=	"recmachcustrecord_advs_r_h_headerr_link";
		
		var RentalCount	=	nlapiGetLineItemCount(RentalTable);
		
		var TotalInvoiceAmount	=	0, RevenueShareAmount	=	0;
		
		for(var R=1; R<=RentalCount; R++){
			
			var InvoiceLink	=	nlapiGetLineItemValue(RentalTable, "custrecord_advs_r_h_transactions", R);
			
			if(InvoiceLink){
				
				var InvoiceAmt	=	nlapiGetLineItemValue(RentalTable, "custrecord_advs_r_h_rent_inv_amt", R);
				
				if(InvoiceAmt){
					
					TotalInvoiceAmount	=	(TotalInvoiceAmount*1)	+	(InvoiceAmt*1);
					
					if(RevenuePer){
						
						var LineShareAmount	=	(((InvoiceAmt*1)*RevenuePer)/100);
						nlapiSetLineItemValue(RentalTable, "custrecord_advs_r_h_rev_share_amt", R, LineShareAmount);
					}
				}				
			}			
		}
		
		if(RevenuePer > 0){
			
			RevenueShareAmount	=	(((TotalInvoiceAmount*1)*RevenuePer)/100);			
			RevenueShareAmount	=	RevenueShareAmount*1;
			RevenueShareAmount	=	RevenueShareAmount.toFixed(2);
			
			nlapiSetFieldValue("custrecord_advs_r_h_amt_paid_till_date", RevenueShareAmount, false, true);
		}
		
		
		if(status == 1){
//			createREgularLines();
		}
		
		
	}
	
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function userEventAfterSubmit(type){
	if(type=="create"){
		var newRec	=	nlapiGetNewRecord();
		var getID	=	newRec.getFieldValue("id");
		var ContType	=	newRec.getFieldValue("custrecord_advs_contract_type");
		
		nlapiLogExecution("DEBUG", "ContType", ContType);
		if(ContType == "1"){
			var Name	=	"Lease - "+getID+"";
			
			/*var loadR	=	nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
			loadR.setFieldValue("name", Name);
			nlapiSubmitRecord(loadR, true, true);*/
			
			nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), "name", Name, true);
		}
		
	}
	
	if(type =="create" || type == "edit"){
		var recId	=	nlapiGetRecordId();
		var newRec	=	nlapiGetNewRecord();
		var ContType	=	newRec.getFieldValue("custrecord_advs_lease_option_list");
		if(ContType == 1 || ContType =="1"){
		var recMach	=	"recmachcustrecord_advs_lea_header_link";
		var lines	=	newRec.getLineItemCount(recMach);
		
		// for(var i=1;i<=lines;i++){
		// 	var vinStat	=	newRec.getLineItemValue(recMach, "custrecord_advs_lea_stock_status", i);
		// 	var vinID	=	newRec.getLineItemValue(recMach, "custrecord_advs_lea_vin_stk_stock", i);
		// 	if((vinStat == 6 || vinStat == 8) && vinID ){
		// 		var submitFld	=	["custrecord_advs_vm_reservation_status","custrecord_advs_vm_lea_hea"];
		// 		var submitFldV	=	[13,recId];
		// 		nlapiSubmitField("customrecord_advs_vm", vinID, submitFld, submitFldV);
			
		// 	}
		// 	/*if(vinID && recId){
		// 		nlapiSubmitField('customrecord_advs_rental_header',recId,'custrecord_advs_la_vin_bodyfld',vinID);
		// 	}*/
		// }
	}
	}
}

function checkForAddons(recid) {
	var Available_aa	=	"F";
/*	var search_aa	=	nlapiCreateSearch("customrecord_advs_add_addons_parent", [
	          	 	                                                      ["isinactive","is","F"]
	          	 	                                                      ,"AND",
	          	 	                                                      ["custrecord_advs_a_a_p_r_h_","anyof",recid]
	          	 	                                                      ,"AND",
	          	 	                                                      ["custrecord_advs_a_a_p_stage","anyof",1]

	          	 	                                                      ], [
	          	 	                                                          new nlobjSearchColumn("internalid", null, null),

	          	 	                                                          ]); 
	 var run_aa	=	search_aa.runSearch();
	var cols_aa	=	run_aa.getColumns();
	run_aa.forEachResult(function(rec_aa){

		Available_aa	=	"T";
		return true;
	}); */


	return Available_aa;
}

function AddDueFld(form,Message) {

	var FieldMsgObj = form.addField('custpage_htmfld_11','inlinehtml','');
	var html	=	"";
	html+="" +
	"<table width='800px' align='left' >" +
	"<tr>" +
	"<td bgcolor='#FF0000' align ='left' style='font-size: 20px;'>" +
	"<b>"+Message+"</b>" +
	"</td>" +
	"</tr>" +
	"</table>" +
	"<style>" +
	".bgontabbottom{" +
	"	align : left !important;" +
	"}" +
	"</style>" +
	"";
	FieldMsgObj.setLayoutType('outsideabove');
	FieldMsgObj.setDefaultValue(html);

}
function searchHeaderList(recid) {
	var Available_a	=	"F";
	var search_a	=	nlapiCreateSearch("customrecord_advs_return_temp_par", [
	          	 	                                                      ["isinactive","is","F"]
	          	 	                                                      ,"AND",
	          	 	                                                      ["custrecord_advs_r_t_p_rent__head","anyof",recid]
	          	 	                                                      ,"AND",
	          	 	                                                      ["custrecord_advs_r_t_p_stage","anyof",1]

	          	 	                                                      ], [
	          	 	                                                          new nlobjSearchColumn("internalid", null, null),

	          	 	                                                          ]);
	var run_a	=	search_a.runSearch();
	var cols_a	=	run_a.getColumns();
	run_a.forEachResult(function(rec_a){

		Available_a	=	"T";
		return true;
	});


	return Available_a;
}
function createREgularLines(){
	//1. Loan 2.Loan with Extra payment 3. Lease with Residual 4. Lease with extra payment and Residual
	var eventType					=	nlapiGetFieldValue("custrecord_advs_lease_option_list");
	
	if(eventType == 1){
//		createREgularLinesLoan();
	}
	
/*	nlapiLogExecution("error","eventType",eventType);
	if(eventType == '1'){
		createREgularLinesLoan();
	}else if(eventType == '2'){
		createREgularLinesNew();
	}
	else if(eventType == '3'){
		createREgularLinesNew()
	}else if(eventType == '4'){
		createREgularLinesNew()
	}else if(eventType == '5'){
		var override = nlapiGetFieldValue('custrecord_advs_su_override_sc_payment');
		if(override == 'T'){
			createREgularLinesNewOverride();
		}else{
			createREgularLinesNew();
		}
		
	}else if(eventType == '6'){
		createREgularLinesFlexi()
	}
	else{
		createREgularLinesLoan();
	}*/
}


function createREgularLinesFlexi(){
	var recMach	=	"recmachcustrecord_advs_f_l_s_cnt_head";
	var lineC	=	nlapiGetLineItemCount(recMach);
	var LoanAmount	=	nlapiGetFieldValue("custrecord_advs_r_a_loan_amount");
	var InterestRate	=	nlapiGetFieldValue("custrecord_advs_r_annual_interest_rate");
	var Status						=	nlapiGetFieldValue("custrecord_advs_l_h_status");//custrecord_advs_l_h_status
	var Start_date					=	nlapiGetFieldValue("custrecord_advs_l_a_pay_st_date");
	var Lease_date					=	nlapiGetFieldValue("custrecord_advs_r_h_start_date");
	
	if(Status ==1){
	
	if(InterestRate){
		InterestRate	=	parseFloat(InterestRate);
		InterestRate	=	InterestRate*1;
	}
	var mon_t	=	1;
	var days_t	=	"";
	
	var same	=	0;
	if(Lease_date==Start_date){
//		Break_up=Break_up-1;
		same++;
	}
	
	var rec_s_id	=	"recmachcustrecord_advs_lea_lc_c_link";//custrecord_advs_lea_lc_c_link
	var RecCount	=	nlapiGetLineItemCount(rec_s_id);

	for(var k=1;k<=RecCount;k++){
		nlapiRemoveLineItem(rec_s_id, 1);
	}
	var PrincipCumm	=	0;
	var interestCum	=	0;
	var beginingBalance	=	0;
	var EndBalanceCum	=	0;
	var suEndingBalance = 0;
	var suinterestCum =0;
	var suinterest =0;
	var residualDetails = [];
	var check = false;
	var dd=1;
	for(var i=1;i<=lineC;i++){
		var NoSched		=	nlapiGetLineItemValue(recMach, "custrecord_advs_f_l_s_schedules", i)*1;
		var amount		=	nlapiGetLineItemValue(recMach, "custrecord_advs_f_l_s_amount", i)*1;
		
		var per_installment	=	amount;
		
		
		var ActualInterest	=	InterestRate/100;
		ActualInterest		=	ActualInterest*1;
//		ActualInterest		=	ActualInterest/12;
		ActualInterest		=	ActualInterest*1;
		var TempActualinterest	=	(ActualInterest*amount);
		var TotalSchedule	=	((amount+TempActualinterest)/per_installment);
		var Break_up	=	TotalSchedule*1;
		if(Status ==1){
			var LeaseRegPay					=	amount*1;
			var TempX	=	0;
			var TempY	=	0;
			
			
			var totalPayment	=	LeaseRegPay;
			
			interestCum	=	interestCum*1;
			
		
			for(var d=1;d<=NoSched ;d++){
				if(dd==1){	
					TempX+=LoanAmount;
					beginingBalance	=	LoanAmount;
				}else{
//					beginingBalance	=	EndBalanceCum;
				}
				
				var Interest		=	TempActualinterest;
				Interest			=	Interest*1;
				
				var Principal		=	totalPayment-Interest;
				Principal			=	Principal*1;
				Principal 			= 	Principal.toFixed(2);
				var EndingBalance	=	0;
				if(totalPayment == beginingBalance){
					 EndingBalance	=	beginingBalance-totalPayment;					
				}else{
					 EndingBalance	=	beginingBalance-totalPayment;
					
				}
			
				interestCum	= (interestCum+Interest);
				
				nlapiSelectNewLineItem(rec_s_id);
				if(dd==1 ){

					nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);

				}else{					
					if(days_t!=''){

						Start_date=nlapiStringToDate(Start_date);
						Start_date=nlapiAddDays(Start_date, days_t);
						Start_date=nlapiDateToString(Start_date);
					}else if(mon_t!=''){
						Start_date=nlapiStringToDate(Start_date);
						Start_date=nlapiAddMonths(Start_date,mon_t);
						Start_date=nlapiDateToString(Start_date);
					}else{
						
					}
					nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);
				}
				
			
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_down_paying',totalPayment );
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_int', Interest);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_prin', Principal);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_cumulative_int', interestCum);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lea_r_p_sche_pay', LeaseRegPay);//custrecord_advs_r_p_sche_pay
				
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_beg_bal', beginingBalance);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_end_bal', EndingBalance);
				
//				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_extra_payments', ExtraPay);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_narration',dd);
				nlapiCommitLineItem(rec_s_id);
				
				beginingBalance	=	EndingBalance;
				
				
				dd++;
			}
			
			if(i == lineC){
				nlapiSetFieldValue("custrecord_advs_r_h_end_date", Start_date);
				nlapiSetFieldValue("custrecord_advs_total_intrest_fa", interestCum);
			}
			
		}
	}
}
}

/**
 * If override checkbox checked then, first payment's interest should be as per entered and scheduled payment as per entered
 */
function createREgularLinesNewOverride(){

	
	//1. Loan 2.Loan with Extra payment 3. Lease with Residual 4. Lease with extra payment and Residual
	//6. Lease with Irregular Payments
	var eventType					=	nlapiGetFieldValue("custrecord_advs_lease_event");
	var newLoanAmt = '';
	var InterestRate				=	nlapiGetFieldValue("custrecord_advs_r_annual_interest_rate");
	var Status						=	nlapiGetFieldValue("custrecord_advs_l_h_status");
	var LoanAmount					=	nlapiGetFieldValue("custrecord_advs_r_a_loan_amount")*1;	
	var Start_date					=	nlapiGetFieldValue("custrecord_advs_l_a_pay_st_date");
	var Lease_date					=	nlapiGetFieldValue("custrecord_advs_r_h_start_date");
	var Frequency					=	nlapiGetFieldValue("custrecord_advs_r_h_pay_freq");
	var per_installment				=	nlapiGetFieldValue("custrecord_advs_r_a_scheduled_pay")*1;
	var NoSched						=	nlapiGetFieldValue("custrecord_advs_r_a_sch_num_f_pay")*1;
	
	var ExtraPay					=	nlapiGetFieldValue("custrecord_advs_r_a_opt_extr_pay")*1;
	var prePayEmi					= 	nlapiGetFieldValue("custrecord_advs_extra_amount_fa")*1;
	var prePayTillMonths			= 	(nlapiGetFieldValue("custrecord_advs_ptrepay_months")||0)*1;
	var firstInterest				= 	nlapiGetFieldValue("custrecord_advs_su_first_interest");
	var scheduledPay				= 	nlapiGetFieldValue("custrecord_advs_r_a_scheduled_pay");
	
	 ExtraPay += nlapiGetFieldValue("custrecord_advs_r_a_opt_extr_pay_2") * 1;
	 ExtraPay += nlapiGetFieldValue("custrecord_advs_r_a_opt_extr_pay_3") * 1;
	
	if(eventType == '4' || eventType == '2' || eventType == '5'){
		NoSched = NoSched+prePayTillMonths;
	}
	if(InterestRate){
		InterestRate	=	parseFloat(InterestRate);
		InterestRate	=	InterestRate*1;
	}
	
	var ActualInterest	=	InterestRate/100;
	ActualInterest		=	ActualInterest*1;
	ActualInterest		=	ActualInterest/12;
	ActualInterest		=	ActualInterest*1;
	var TempActualinterest	=	(ActualInterest*LoanAmount);
	
	var TotalSchedule	=	((LoanAmount+TempActualinterest)/per_installment);
	var Break_up	=	TotalSchedule*1;
	
	var mon_t	=	1;
	var days_t	=	"";
	
	var same	=	0;
	if(Lease_date==Start_date){
//		Break_up=Break_up-1;
		same++;
	}
	
	if(Status ==1){
		var LeaseRegPay					=	per_installment*1;
		var TempX	=	0;
		var TempY	=	0;
		var rec_s_id	=	"recmachcustrecord_advs_lea_lc_c_link";
		var RecCount	=	nlapiGetLineItemCount(rec_s_id);
		for(var k=1;k<=RecCount;k++){
			nlapiRemoveLineItem(rec_s_id, 1);
		}
		var PrincipCumm	=	0;
		var interestCum	=	0;
		var beginingBalance	=	0;
		var EndBalanceCum	=	0;
		var suEndingBalance = 0;
		var suinterestCum =0;
		var suinterest =0;
		var residualDetails = [];
		var check = false;
		for(var d=1;d<=NoSched ;d++){
			if(d==1){	
				TempX+=LoanAmount;
				beginingBalance	=	LoanAmount;
			}else{
//				beginingBalance	=	EndBalanceCum;
			}
			nlapiLogExecution('ERROR','eventType ---NEW-->',eventType+'prePayTillMonths'+prePayTillMonths);
			if(eventType == '3' ){
				
			}
			else if((eventType == '2' || eventType == '4' ||  eventType == '5')&& prePayTillMonths >0){
				LeaseRegPay=(1*prePayEmi);
				prePayTillMonths--;
				check = true;
			
			}else if((eventType == '2'|| eventType == '4' ||  eventType == '5')&& prePayTillMonths <=0 &&newLoanAmt == '' && !check){
				newLoanAmt = scheduledPay;//calculateSchPayment(eventType,beginingBalance,d);
				per_installment = newLoanAmt;
				LeaseRegPay =	per_installment*1;
				
//				if(eventType == '5'){
//					
//				 var annualIntereNew = (InterestRate*1)/100;
//				 var diffDays = getDaysToFistPayment();
//				 if(diffDays>31){
//				 var newbeginingBalance = getAmountFinanced(newLoanAmt,annualIntereNew,diffDays); 
//				  beginingBalance =   (1*newbeginingBalance)+beginingBalance;
//				 }
//				}
				
				
				//if(eventType != '5')
				//nlapiSetFieldValue('custrecord_advs_r_a_scheduled_pay',per_installment);
			}
			if(scheduledPay && prePayTillMonths <=0 && !check){
				
				LeaseRegPay=(1*scheduledPay);
			}
			check =false;
			var totalPayment	=	LeaseRegPay;
//			if(beginingBalance<=LeaseRegPay){
//				totalPayment	=	beginingBalance;
//			}
			
			
			
			if(ExtraPay >0 && NoSched != d){
				totalPayment	+=	ExtraPay;
			}else{
				ExtraPay	=	0;
			}

			
			
			PrincipCumm			=	PrincipCumm*1;
			interestCum			=	interestCum*1;
			beginingBalance		=	beginingBalance*1;
			totalPayment		=	totalPayment*1;
			
//			if( eventType == '5' && d==1){
//				var diffDays = getDaysToFistPayment();
//				  var annualIntereNew = annualIntere/100;
//				  var newMonthPayAmt = getAmountFinanced(tempSchValNew,annualIntereNew,diffDays); 
//				
//				beginingBalance		=	(beginingBalance*1+newMonthPayAmt);
//				totalPayment		=	totalPayment*1;
//			}
			var Naration		=	d.toString();
			var Interest		=	(beginingBalance*ActualInterest);
			Interest			=	Interest*1;
			//Interest			=	Interest.toFixed(2);
			Interest			=	Interest*1;
			if(d == 1 && firstInterest){
				Interest			=	1*firstInterest;
				// if(eventType == '5'  && d==1){
				// 	nlapiLogExecution('ERROR','SHRINI NEW INTEREST>',Interest);
				// 	var diffDays = getDaysToFistPayment();
				// 	Interest =firstInterest + ((diffDays*firstInterest)/30);
				//
				// 	nlapiLogExecution('ERROR',diffDays+'SHRINI NEW INTEREST>',Interest);
				// }
			}
			var Principal		=	totalPayment-Interest;
			Principal			=	Principal*1;
			Principal 			= 	Principal.toFixed(2);
			
			interestCum	= (interestCum+Interest);
			PrincipCumm	+= Principal;
			PrincipCumm		=	PrincipCumm*1;
			var EndingBalance	=0;
			if(d == 34 || d == 35 || d=='36'){
				nlapiLogExecution("ERROR", "CHECK->EndingBalance",EndingBalance +"==>"+beginingBalance+"=>"+totalPayment+"=>"+Principal);
			}
			if(totalPayment == beginingBalance){
				 EndingBalance	=	beginingBalance-totalPayment;
				
				
			}else{
				 EndingBalance	=	beginingBalance-Principal;
				
			}
			if(d == 34 || d == 35){
				nlapiLogExecution("ERROR", "CHECK2->EndingBalance",EndingBalance +"==>"+beginingBalance+"=>"+totalPayment+"=>"+Principal);
			}
			nlapiLogExecution("ERROR", "Interest",Interest +"==>"+interestCum+"=>"+ActualInterest+"=>"+Principal);
			nlapiSelectNewLineItem(rec_s_id);
			if(d==1 ){

				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);

			}else{					
				if(days_t!=''){

					Start_date=nlapiStringToDate(Start_date);
					Start_date=nlapiAddDays(Start_date, days_t);
					Start_date=nlapiDateToString(Start_date);
				}else if(mon_t!=''){
					Start_date=nlapiStringToDate(Start_date);
					Start_date=nlapiAddMonths(Start_date,mon_t);
					Start_date=nlapiDateToString(Start_date);
				}else{
					
				}
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);
			}
			
		
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_down_paying',totalPayment );
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_int', Interest.toFixed(2));
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_prin', Principal);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_cumulative_int', interestCum);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lea_r_p_sche_pay', LeaseRegPay);
			
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_beg_bal', beginingBalance);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_end_bal', EndingBalance);
			
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_extra_payments', ExtraPay);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_narration',d);
			nlapiCommitLineItem(rec_s_id);
			
			beginingBalance	=	EndingBalance;
			
			
			if(NoSched == d && (eventType == '3' || eventType == '4' || eventType == '5')){
				
				
				//------------
				suinterest = ActualInterest;
				suinterestCum = interestCum;
				suEndingBalance = EndingBalance;
				//--------------------------Residual Calculation-----------------
				if(beginingBalance != 0){
				var Interest		=	(EndingBalance*ActualInterest);
				var residualAmt = Interest+EndingBalance;
				interestCum = interestCum+Interest;
				
				nlapiSelectNewLineItem(rec_s_id);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_down_paying',0);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_int', Interest);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_prin', 0);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_cumulative_int', interestCum);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lea_r_p_sche_pay', 0);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_residual_amt', residualAmt);
				
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_beg_bal', EndingBalance);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_end_bal', 0);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_extra_payments', 0);
				
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_narration',parseInt(++d));
				nlapiCommitLineItem(rec_s_id);
				nlapiSetFieldValue("custrecord_advs_r_h_end_date", Start_date);
				nlapiSetFieldValue("custrecord_advs_total_intrest_fa", interestCum);
				nlapiSetFieldValue("custrecord_advs_r_a_sch_residual_amt", residualAmt);
				}
				//------------------------------------------------------------------
			}
			if(eventType == '2'){
				nlapiSetFieldValue("custrecord_advs_r_h_end_date", Start_date);
				nlapiSetFieldValue("custrecord_advs_total_intrest_fa", interestCum);
				
			}

			/*tempPrincipal				=	TempX-TempY;
			nlapiLogExecution("ERROR", "tempPrincipal",tempPrincipal );
			var MultiplyPrincipalFull		=	tempPrincipal;
			MultiplyPrincipalFull			=	MultiplyPrincipalFull*1;

			nlapiLogExecution("ERROR", "MultiplyPrincipalFull",MultiplyPrincipalFull );
			var TotalInterest				=	(ActualInterest*MultiplyPrincipalFull);
			TotalInterest					=	Number(TotalInterest);
			TotalInterest					=	TotalInterest*1;
			nlapiLogExecution("ERROR", "TotalInterest",TotalInterest );
			var Principal					=	LeaseRegPay-TotalInterest;
			Principal						=	Principal*1;
			TempY+=Principal;

			TotalInterest					=	TotalInterest.toFixed(2);
			Principal						=	Principal.toFixed(2);


			nlapiSelectNewLineItem(rec_s_id);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_down_paying',LeaseRegPay );
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_int', TotalInterest);
			nlapiCommitLineItem(rec_s_id);
			if(d==1 ){

				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);

			}else{					
				if(days_t!=''){

					Start_date=nlapiStringToDate(Start_date);
					Start_date=nlapiAddDays(Start_date, days_t);
					Start_date=nlapiDateToString(Start_date);
				}else if(mon_t!=''){
					Start_date=nlapiStringToDate(Start_date);
					Start_date=nlapiAddMonths(Start_date,mon_t);
					Start_date=nlapiDateToString(Start_date);
				}else{
					
				}
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);
			}						
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_down_paying',LeaseRegPay );//per_installment
			

			// Venu
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_prin', Principal);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_int', TotalInterest);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_liab', tempPrincipal);
			var Naration	=	d.toString();
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_narration',d);
//			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_payment_type',1);				
			nlapiCommitLineItem(rec_s_id);*/
		}
		
	/*	var d	=	1;
//		for(var d=1;d<=Break_up ;d++){
		var DoneLoop	= "F";	
		while(DoneLoop == "F"){


			if(d==1){
				LeaseRegPay	=	LeaseRegPay*2;	
				TempX+=PrincipalFullAmount;



			}else{

			}
			LeaseRegPay					=	per_installment*1;
			LeaseRegPay	=	LeaseRegPay*1;
			LeaseRegPay	=	LeaseRegPay.toFixed(2);

			tempPrincipal				=	TempX-TempY;
			nlapiLogExecution("ERROR", "tempPrincipal",tempPrincipal );
			var MultiplyPrincipalFull		=	tempPrincipal;
			MultiplyPrincipalFull			=	MultiplyPrincipalFull*1;

			nlapiLogExecution("ERROR", "MultiplyPrincipalFull",MultiplyPrincipalFull );
			var TotalInterest				=	(ActualInterest*MultiplyPrincipalFull);
			TotalInterest					=	Number(TotalInterest);
			TotalInterest					=	TotalInterest*1;
			nlapiLogExecution("ERROR", "TotalInterest",TotalInterest );
			var Principal					=	LeaseRegPay-TotalInterest;
			Principal						=	Principal*1;
			TempY+=Principal;

			TotalInterest					=	TotalInterest.toFixed(2);
			Principal						=	Principal.toFixed(2);


			nlapiSelectNewLineItem(rec_s_id);


			if(d==1 ){

				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);

			}else{					
				if(days_t!=''){

					Start_date=nlapiStringToDate(Start_date);
					Start_date=nlapiAddDays(Start_date, days_t);
					Start_date=nlapiDateToString(Start_date);
				}else if(mon_t!=''){
					Start_date=nlapiStringToDate(Start_date);
					Start_date=nlapiAddMonths(Start_date,mon_t);
					Start_date=nlapiDateToString(Start_date);
				}else{
					
				}
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);
			}						
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_down_paying',LeaseRegPay );//per_installment
			

			// Venu
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_prin', Principal);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_int', TotalInterest);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_liab', tempPrincipal);
			var Naration	=	d.toString();
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_narration',d);
//			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_payment_type',1);				
			nlapiCommitLineItem(rec_s_id);

			if(tempPrincipal<per_installment){
				DoneLoop="T";
			}
			d++;
		}*/

	}
	

}



function createREgularLinesNew(){
	
	//1. Loan 2.Loan with Extra payment 3. Lease with Residual 4. Lease with extra payment and Residual
	//6. Lease with Irregular Payments
	var eventType					=	nlapiGetFieldValue("custrecord_advs_lease_event");
	var newLoanAmt = '';
	var InterestRate				=	nlapiGetFieldValue("custrecord_advs_r_annual_interest_rate");
	var Status						=	nlapiGetFieldValue("custrecord_advs_l_h_status");
	var LoanAmount					=	nlapiGetFieldValue("custrecord_advs_r_a_loan_amount")*1;	
	var Start_date					=	nlapiGetFieldValue("custrecord_advs_l_a_pay_st_date");
	var Lease_date					=	nlapiGetFieldValue("custrecord_advs_r_h_start_date");
	var Frequency					=	nlapiGetFieldValue("custrecord_advs_r_h_pay_freq");
	var per_installment				=	nlapiGetFieldValue("custrecord_advs_r_a_scheduled_pay")*1;
	var NoSched						=	nlapiGetFieldValue("custrecord_advs_r_a_sch_num_f_pay")*1;
	
	var ExtraPay					=	nlapiGetFieldValue("custrecord_advs_r_a_opt_extr_pay")*1;
	var prePayEmi					= 	nlapiGetFieldValue("custrecord_advs_extra_amount_fa")*1;
	var prePayTillMonths			= 	nlapiGetFieldValue("custrecord_advs_ptrepay_months")*1;
	
	 ExtraPay += nlapiGetFieldValue("custrecord_advs_r_a_opt_extr_pay_2") * 1;
	 ExtraPay += nlapiGetFieldValue("custrecord_advs_r_a_opt_extr_pay_3") * 1;
	
	if(eventType == '4' || eventType == '2' || eventType == '5'){
		NoSched = NoSched+prePayTillMonths;
	}
	if(InterestRate){
		InterestRate	=	parseFloat(InterestRate);
		InterestRate	=	InterestRate*1;
	}
	
	var ActualInterest	=	InterestRate/100;
	ActualInterest		=	ActualInterest*1;
	ActualInterest		=	ActualInterest/12;
	ActualInterest		=	ActualInterest*1;
	var TempActualinterest	=	(ActualInterest*LoanAmount);
	
	var TotalSchedule	=	((LoanAmount+TempActualinterest)/per_installment);
	var Break_up	=	TotalSchedule*1;
	
	var mon_t	=	1;
	var days_t	=	"";
	
	var same	=	0;
	if(Lease_date==Start_date){
//		Break_up=Break_up-1;
		same++;
	}
	
	if(Status ==1){

		
		var LeaseRegPay					=	per_installment*1;
		var TempX	=	0;
		var TempY	=	0;



		var rec_s_id	=	"recmachcustrecord_advs_lea_lc_c_link";
		var RecCount	=	nlapiGetLineItemCount(rec_s_id);

		for(var k=1;k<=RecCount;k++){
			nlapiRemoveLineItem(rec_s_id, 1);
		}

		nlapiLogExecution("ERROR", "ActualInterest",ActualInterest +"==>"+Break_up);
		
		var PrincipCumm	=	0;
		var interestCum	=	0;
		var beginingBalance	=	0;
		var EndBalanceCum	=	0;
		var suEndingBalance = 0;
		var suinterestCum =0;
		var suinterest =0;
		var residualDetails = [];
		var check = false;
		for(var d=1;d<=NoSched ;d++){
			if(d==1){	
				TempX+=LoanAmount;
				beginingBalance	=	LoanAmount;
			}else{
//				beginingBalance	=	EndBalanceCum;
			}
			if(eventType == '3' ){
				
			}
			else if((eventType == '2' || eventType == '4' ||  eventType == '5')&& prePayTillMonths >0){
				LeaseRegPay=(1*prePayEmi);
				prePayTillMonths--;
				check =true;
			}else if((eventType == '2'|| eventType == '4' ||  eventType == '5')&& prePayTillMonths <=0 &&newLoanAmt == ''  && !check){
				newLoanAmt = calculateSchPayment(eventType,beginingBalance,d);
				per_installment = newLoanAmt;
				LeaseRegPay =	per_installment*1;
				
				if(eventType == '5'){
					
				 var annualIntereNew = (InterestRate*1)/100;
				 var diffDays = getDaysToFistPayment();
				 if(diffDays>30){
					 var newbeginingBalance =newLoanAmt;
				// var newbeginingBalance = getAmountFinanced(newLoanAmt,annualIntereNew,diffDays); 
				 // beginingBalance =   (1*newbeginingBalance)+beginingBalance;
				 }
				}
				
				
				//if(eventType != '5')
				nlapiSetFieldValue('custrecord_advs_r_a_scheduled_pay',per_installment);
			}
			
			var totalPayment	=	LeaseRegPay;
			if(beginingBalance<=LeaseRegPay){
				totalPayment	=	beginingBalance;
			}
			
			
			
			if(ExtraPay >0 && NoSched != d){
				totalPayment	+=	ExtraPay;
			}else{
				ExtraPay	=	0;
			}

			
			
			PrincipCumm			=	PrincipCumm*1;
			interestCum			=	interestCum*1;
			beginingBalance		=	beginingBalance*1;
			totalPayment		=	totalPayment*1;
			
//			if( eventType == '5' && d==1){
//				var diffDays = getDaysToFistPayment();
//				  var annualIntereNew = annualIntere/100;
//				  var newMonthPayAmt = getAmountFinanced(tempSchValNew,annualIntereNew,diffDays); 
//				
//				beginingBalance		=	(beginingBalance*1+newMonthPayAmt);
//				totalPayment		=	totalPayment*1;
//			}
			var Naration		=	d.toString();
			var Interest		=	(beginingBalance*ActualInterest);
			Interest			=	Interest*1;
			//Interest			=	Interest.toFixed(2);
			Interest			=	Interest*1;

			if(eventType == '5'  && d==1){
				nlapiLogExecution('ERROR','SHRINI NEW INTEREST>',Interest);
				var diffDays = getDaysToFistPayment();
				if(diffDays >30) {
					diffDays = diffDays-30;
					Interest = Interest + ((diffDays * Interest) / 30);
				}
				nlapiLogExecution('ERROR',diffDays+'SHRINI NEW INTEREST>',Interest);
			}
			
			var Principal		=	totalPayment-Interest;
			Principal			=	Principal*1;
			
			interestCum	= (interestCum+Interest);
			PrincipCumm	+= Principal;
			PrincipCumm		=	PrincipCumm*1;
			
			if(totalPayment == beginingBalance){
				var EndingBalance	=	beginingBalance-totalPayment;
				
				
			}else{
				var EndingBalance	=	beginingBalance-Principal;
				
			}
		
			
			nlapiLogExecution("ERROR", "Interest",Interest +"==>"+interestCum+"=>"+ActualInterest+"=>"+Principal);
			nlapiSelectNewLineItem(rec_s_id);
			if(d==1 ){

				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);

			}else{					
				if(days_t!=''){

					Start_date=nlapiStringToDate(Start_date);
					Start_date=nlapiAddDays(Start_date, days_t);
					Start_date=nlapiDateToString(Start_date);
				}else if(mon_t!=''){
					Start_date=nlapiStringToDate(Start_date);
					Start_date=nlapiAddMonths(Start_date,mon_t);
					Start_date=nlapiDateToString(Start_date);
				}else{
					
				}
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);
			}
			
		
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_down_paying',totalPayment );
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_int', Interest);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_prin', Principal);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_cumulative_int', interestCum);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lea_r_p_sche_pay', LeaseRegPay);
			
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_beg_bal', beginingBalance);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_end_bal', EndingBalance);
			
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_extra_payments', ExtraPay);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_narration',d);
			nlapiCommitLineItem(rec_s_id);
			
			beginingBalance	=	EndingBalance;
			
			
			if(NoSched == d && (eventType == '3' || eventType == '4' || eventType == '5')){
				
				
				//------------
				suinterest = ActualInterest;
				suinterestCum = interestCum;
				suEndingBalance = EndingBalance;
				//--------------------------Residual Calculation-----------------
				var Interest		=	(EndingBalance*ActualInterest);
				var residualAmt = Interest+EndingBalance;
				interestCum = interestCum+Interest;
			
				nlapiSelectNewLineItem(rec_s_id);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_down_paying',0);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_int', Interest);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_prin', 0);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_cumulative_int', interestCum);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lea_r_p_sche_pay', 0);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_residual_amt', residualAmt);
				
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_beg_bal', EndingBalance);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_end_bal', 0);
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_extra_payments', 0);
				
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_narration',parseInt(++d));
				nlapiCommitLineItem(rec_s_id);
				nlapiSetFieldValue("custrecord_advs_r_h_end_date", Start_date);
				nlapiSetFieldValue("custrecord_advs_total_intrest_fa", interestCum);
				nlapiSetFieldValue("custrecord_advs_r_a_sch_residual_amt", residualAmt);
				//------------------------------------------------------------------
			}
			if(eventType == '2'){
				nlapiSetFieldValue("custrecord_advs_r_h_end_date", Start_date);
				nlapiSetFieldValue("custrecord_advs_total_intrest_fa", interestCum);
				
			}

			/*tempPrincipal				=	TempX-TempY;
			nlapiLogExecution("ERROR", "tempPrincipal",tempPrincipal );
			var MultiplyPrincipalFull		=	tempPrincipal;
			MultiplyPrincipalFull			=	MultiplyPrincipalFull*1;

			nlapiLogExecution("ERROR", "MultiplyPrincipalFull",MultiplyPrincipalFull );
			var TotalInterest				=	(ActualInterest*MultiplyPrincipalFull);
			TotalInterest					=	Number(TotalInterest);
			TotalInterest					=	TotalInterest*1;
			nlapiLogExecution("ERROR", "TotalInterest",TotalInterest );
			var Principal					=	LeaseRegPay-TotalInterest;
			Principal						=	Principal*1;
			TempY+=Principal;

			TotalInterest					=	TotalInterest.toFixed(2);
			Principal						=	Principal.toFixed(2);


			nlapiSelectNewLineItem(rec_s_id);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_down_paying',LeaseRegPay );
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_int', TotalInterest);
			nlapiCommitLineItem(rec_s_id);
			if(d==1 ){

				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);

			}else{					
				if(days_t!=''){

					Start_date=nlapiStringToDate(Start_date);
					Start_date=nlapiAddDays(Start_date, days_t);
					Start_date=nlapiDateToString(Start_date);
				}else if(mon_t!=''){
					Start_date=nlapiStringToDate(Start_date);
					Start_date=nlapiAddMonths(Start_date,mon_t);
					Start_date=nlapiDateToString(Start_date);
				}else{
					
				}
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);
			}						
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_down_paying',LeaseRegPay );//per_installment
			

			// Venu
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_prin', Principal);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_int', TotalInterest);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_liab', tempPrincipal);
			var Naration	=	d.toString();
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_narration',d);
//			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_payment_type',1);				
			nlapiCommitLineItem(rec_s_id);*/
		}
		
	/*	var d	=	1;
//		for(var d=1;d<=Break_up ;d++){
		var DoneLoop	= "F";	
		while(DoneLoop == "F"){


			if(d==1){
				LeaseRegPay	=	LeaseRegPay*2;	
				TempX+=PrincipalFullAmount;



			}else{

			}
			LeaseRegPay					=	per_installment*1;
			LeaseRegPay	=	LeaseRegPay*1;
			LeaseRegPay	=	LeaseRegPay.toFixed(2);

			tempPrincipal				=	TempX-TempY;
			nlapiLogExecution("ERROR", "tempPrincipal",tempPrincipal );
			var MultiplyPrincipalFull		=	tempPrincipal;
			MultiplyPrincipalFull			=	MultiplyPrincipalFull*1;

			nlapiLogExecution("ERROR", "MultiplyPrincipalFull",MultiplyPrincipalFull );
			var TotalInterest				=	(ActualInterest*MultiplyPrincipalFull);
			TotalInterest					=	Number(TotalInterest);
			TotalInterest					=	TotalInterest*1;
			nlapiLogExecution("ERROR", "TotalInterest",TotalInterest );
			var Principal					=	LeaseRegPay-TotalInterest;
			Principal						=	Principal*1;
			TempY+=Principal;

			TotalInterest					=	TotalInterest.toFixed(2);
			Principal						=	Principal.toFixed(2);


			nlapiSelectNewLineItem(rec_s_id);


			if(d==1 ){

				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);

			}else{					
				if(days_t!=''){

					Start_date=nlapiStringToDate(Start_date);
					Start_date=nlapiAddDays(Start_date, days_t);
					Start_date=nlapiDateToString(Start_date);
				}else if(mon_t!=''){
					Start_date=nlapiStringToDate(Start_date);
					Start_date=nlapiAddMonths(Start_date,mon_t);
					Start_date=nlapiDateToString(Start_date);
				}else{
					
				}
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);
			}						
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_down_paying',LeaseRegPay );//per_installment
			

			// Venu
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_prin', Principal);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_int', TotalInterest);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_liab', tempPrincipal);
			var Naration	=	d.toString();
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_narration',d);
//			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_payment_type',1);				
			nlapiCommitLineItem(rec_s_id);

			if(tempPrincipal<per_installment){
				DoneLoop="T";
			}
			d++;
		}*/

	}
	
}

function createREgularLinesLoan(){
	
	//1. Loan 2.Loan with Extra payment 3. Lease with Residual 4. Lease with extra payment and Residual
	var eventType					=	nlapiGetFieldValue("custrecord_advs_lease_option_list");
	var newLoanAmt = '';
	var InterestRate				=	nlapiGetFieldValue("custrecord_advs_l_annual_interest_rate");
	var Status						=	nlapiGetFieldValue("custrecord_advs_l_h_status");
	var LoanAmount					=	nlapiGetFieldValue("custrecord_advs_l_a_loan_amount")*1;	
	var Start_date					=	nlapiGetFieldValue("custrecord_advs_l_a_pay_st_date");
	var Lease_date					=	nlapiGetFieldValue("custrecord_advs_l_h_start_date");
	var Frequency					=	nlapiGetFieldValue("custrecord_advs_l_h_pay_freq");
	var per_installment				=	nlapiGetFieldValue("custrecord_advs_l_a_scheduled_pay")*1;
	var NoSched						=	nlapiGetFieldValue("custrecord_advs_l_a_sch_num_f_pay")*1;
	var ExtraPay					=	nlapiGetFieldValue("custrecord_advs_l_a_opt_extr_pay")*1;
	var prePayEmi					= 	nlapiGetFieldValue("custrecord_advs_l_a_opt_extr_pay")*1;
	var prePayTillMonths			= 	0;
	
	if(InterestRate){
		InterestRate	=	parseFloat(InterestRate);
		InterestRate	=	InterestRate*1;
	}
	
	var ActualInterest	=	InterestRate/100;
	ActualInterest		=	ActualInterest*1;
	ActualInterest		=	ActualInterest/12;
	ActualInterest		=	ActualInterest*1;
	var TempActualinterest	=	(ActualInterest*LoanAmount);
	
	var TotalSchedule	=	((LoanAmount+TempActualinterest)/per_installment);
	var Break_up	=	TotalSchedule*1;
	
	var mon_t	=	1;
	var days_t	=	"";
	
	var same	=	0;
	if(Lease_date==Start_date){
//		Break_up=Break_up-1;
		same++;
	}
	
	if(Status ==1){
		var LeaseRegPay					=	per_installment*1;
		var TempX	=	0;
		var TempY	=	0;
		var rec_s_id	=	"recmachcustrecord_advs_lm_lc_c_link";
		var RecCount	=	nlapiGetLineItemCount(rec_s_id);

		for(var k=1;k<=RecCount;k++){
			nlapiRemoveLineItem(rec_s_id, 1);
		}

		nlapiLogExecution("ERROR", "ActualInterest",ActualInterest +"==>"+Break_up);
		
		var PrincipCumm	=	0;
		var interestCum	=	0;
		var beginingBalance	=	0;
		var EndBalanceCum	=	0;
		var suEndingBalance = 0;
		var suinterestCum =0;
		var suinterest =0;
		var residualDetails = [];
		for(var d=1;d<=NoSched ;d++){
			if(d==1){	
				TempX+=LoanAmount;
				beginingBalance	=	LoanAmount;
			}else{
//				beginingBalance	=	EndBalanceCum;
			}

			var totalPayment	=	LeaseRegPay;
			if(beginingBalance<=LeaseRegPay){
				totalPayment	=	beginingBalance;
			}
			
			if(ExtraPay >0 && NoSched != d){
				totalPayment	+=	ExtraPay;
			}else{
				ExtraPay	=	0;
			}
			

			
			
			PrincipCumm			=	PrincipCumm*1;
			interestCum			=	interestCum*1;
			beginingBalance		=	beginingBalance*1;
			totalPayment		=	totalPayment*1;
			
			var Naration		=	d.toString();
			var Interest		=	(beginingBalance*ActualInterest);
			Interest			=	Interest*1;
			Interest			=	Interest.toFixed(2);
			Interest			=	Interest*1;
			
			var Principal		=	totalPayment-Interest;
			Principal			=	Principal*1;
			
			interestCum	= (interestCum+Interest);
			PrincipCumm	+= Principal;
			PrincipCumm		=	PrincipCumm*1;
			
			if(totalPayment == beginingBalance){
				var EndingBalance	=	beginingBalance-totalPayment;
				
				
			}else{
				var EndingBalance	=	beginingBalance-Principal;
				
			}
		
			
			nlapiLogExecution("ERROR", "Interest",Interest +"==>"+interestCum+"=>"+ActualInterest+"=>"+Principal);
			nlapiSelectNewLineItem(rec_s_id);
			if(d==1 ){

				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);

			}else{					
				if(days_t!=''){

					Start_date=nlapiStringToDate(Start_date);
					Start_date=nlapiAddDays(Start_date, days_t);
					Start_date=nlapiDateToString(Start_date);
				}else if(mon_t!=''){
					Start_date=nlapiStringToDate(Start_date);
					Start_date=nlapiAddMonths(Start_date,mon_t);
					Start_date=nlapiDateToString(Start_date);
				}else{
					
				}
				nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_date', Start_date);
			}
			
		
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_down_paying',totalPayment );
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_int', Interest);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_reg_pay_reg_prin', Principal);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_cumulative_int', interestCum);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_sche_pay', LeaseRegPay);
			
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_beg_bal', beginingBalance);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_end_bal', EndingBalance);
			
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_r_p_extra_payments', ExtraPay);
			nlapiSetCurrentLineItemValue(rec_s_id, 'custrecord_advs_lm_lc_c_narration',d);
			nlapiCommitLineItem(rec_s_id);
			
			beginingBalance	=	EndingBalance;
			
			
			if(NoSched == d){
				nlapiSetFieldValue("custrecord_advs_r_h_end_date", Start_date);
				nlapiSetFieldValue("custrecord_advs_total_intrest_fa", interestCum);
			}
		}
	}
}
function addhtmlButtons(form,LeaseId){
	var HtmlField	=	form.getField("custrecord_advs_l_h_lease_stm_hstry_html");
	var html	=	"" +
	"<html>" +
	"<head>" ;
	html+="<meta name='viewport' content='width=device-width, initial-scale=1'>";
	html+="<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>"+
	"</head>";

	  html+="<div style='    display: inline-flex;flex-wrap: wrap;'>";
	
		html+="<div>"+
		"<input type='button' class='btn_proceed11' value='Lease Account Statement' title='Lease Account Statement' onclick='buyoutOpen("+nlapiGetRecordId()+","+1+");' />" +
		"</div>";
        html+="<div>"+
        "<input type='button' class='btn_proceed11' value='Lease statement History' title='Generate Lease statement History' onclick='searchhistoy("+nlapiGetRecordId()+");' />" +
        "</div>";

	html+="</div>";

	html+="</html>";

	html += CSSSHA();
	HtmlField.setDefaultValue(html);
}
function CSSSHA(){

	var CssString	=	"<style type='text/css'>" +
	"@import url(https://fonts.googleapis.com/css?family=Open+Sans);"+

	"body{" +
	"background: #f2f2f2;" +
	"font-family: 'Open Sans', sans-serif;" +
	"}" +

	".search {" +
	"width: 100%;" +
	"position: relative;" +
	"display: flex;" +
	"}" +

   
	".searchTerm {" +
	"padding: 10px;" +
	"font-size: 17px;" +
	"border: 1px solid grey;" +
	"float: left;" +
	"width: 80%;" +
	"background: #f1f1f1;" +
	"}" +

	".searchTerm:focus{" +
	"color: #00B4CC;" +
	"}" +

	".searchButton {" +
	" float: left;" +
	" width: 20%;" +
	"padding: 10px;" +
	"background: #2196F3;" +
	"color: white;" +
	"font-size: 17px;" +
	"border: 1px solid grey;" +
	"cursor: pointer;" +
	"border-left: none;" +
	"}" +
	".searchButton:hover{" +
	" background: #0b7dda;" +
	"}" +

	/*Resize the wrap to see the search bar change!*/
	".wrap{" +
	"width: 30%;" +
	"position: absolute;" +
	"top: 20%;" +
	"left: 50%;" +
	"transform: translate(-50%, -50%);" +
	"}" +
	".fieldset_info{" +
	"" +
	"}" +
	".div_cust_info{" +
	"width: 500px;" +
	"font-size: 23px;" +
	"font-weight: bold;" +
	"}" +
	".btn_proceed11{" +
	"background-color: Blue;" +
	"border: none;" +
	"color: white;" +
	"padding: 5px;" +
	"text-align: center;" +
	"text-decoration: none;" +
	"display: inline-block;" +
	"font-size: 16px;" +
	"margin: 4px 2px;" +
	"cursor: pointer;" +
	"border-radius: 12px;" +
//	"margin-left:40%;"; +
//	"margin-top:20px;" +
	"}" +
	".div_float{" +
	"margin-left:40%;" +
	"margin-top:20px;" +
	"}" +
  "._2img_01{" +
    "width:30px;" +
      "}" +
	"</style>";
	return CssString;

}
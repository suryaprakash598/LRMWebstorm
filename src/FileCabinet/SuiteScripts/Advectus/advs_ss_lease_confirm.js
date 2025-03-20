/**
 * Module Description
 *
 * Version    Date            Author           Remarks
 * 1.00       03 Aug 2023     ADVS-Ashbaqa
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){
	if(request.getMethod()== "GET"){
		var form	=	nlapiCreateForm("");
		var recId	=	request.getParameter("requestID");

		var recFldObj	=	form.addField("custpage_rec","select","Rec #","customrecord_advs_lease_header");
		recFldObj.setDefaultValue(recId);
		recFldObj.setDisplayType("hidden");


		var dateFldObj	=	form.addField("custpage_date","date","Date");
		dateFldObj.setMandatory(true);


		form.addSubmitButton("Submit");

		response.writePage(form);

	}else{
		var recId	=	request.getParameter("custpage_rec");
		var dateS	=	request.getParameter("custpage_date");

		PostRegInvoiceKal(recId,dateS);

		var onclickScript=" <html><body> <script type='text/javascript'>" +
			"try{" +

			"";
		onclickScript+="window.parent.location.reload();";
		onclickScript+="window.parent.closePopup();";
		onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";

		response.write(onclickScript);
	}
}

function PostRegInvoiceKal(headerID,TodayD){
	var headerFld	=	new Array();
	headerFld.push("custrecord_advs_l_h_customer_name");
	headerFld.push("custrecord_advs_l_h_location");
	headerFld.push("custrecord_advs_l_h_charge_tax");
	headerFld.push("custrecord_advs_l_h_pay_freq");
	headerFld.push("custrecord_advs_l_h_mileage_plan");
	headerFld.push("custrecord_advs_l_h_mileage_est");


	headerFld.push("custrecord_advs_l_a_tot_eqp_price");
	headerFld.push("custrecord_advs_l_a_admin_gp_fee");
	headerFld.push("custrecord_advs_l_a_down_payment");




	var headerREc	=	nlapiLoadRecord("customrecord_advs_lease_header", headerID, {recordmode:"dynamic"});
	var customer	=	headerREc.getFieldValue("custrecord_advs_l_h_customer_name");//headerREc.custrecord_advs_l_h_customer_name;
	var Location	=	headerREc.getFieldValue("custrecord_advs_l_h_location");//headerREc.custrecord_advs_l_h_location;
	var Charge		=	headerREc.getFieldValue("custrecord_advs_l_h_charge_tax");//headerREc.custrecord_advs_l_h_charge_tax;
	var TaxCode		=	headerREc.getFieldValue("custrecord_advs_l_h_tax_code");//headerREc.custrecord_advs_l_h_tax_code;
	var Frequency	=	headerREc.getFieldValue("custrecord_advs_l_h_pay_freq");//headerREc.custrecord_advs_l_h_pay_freq;
	var TaxRate		=	headerREc.getFieldValue("custrecord_advs_c_h_tx_rate");//headerREc.custrecord_advs_c_h_tx_rate;


	var EqpPrice		=	headerREc.getFieldValue("custrecord_advs_l_a_tot_eqp_price");//headerREc.custrecord_advs_l_a_tot_eqp_price*1;
	var AdminFee		=	headerREc.getFieldValue("custrecord_advs_l_a_tot_eqp_price");//headerREc.custrecord_advs_l_a_tot_eqp_price*1;
	var downPay			=	headerREc.getFieldValue("custrecord_advs_l_a_down_payment");//headerREc.custrecord_advs_l_a_down_payment*1;

	/*var headerREc	=	nlapiLookupField("customrecord_advs_lease_header", headerID, headerFld);
	var customer	=	headerREc.custrecord_advs_l_h_customer_name;
	var Location	=	headerREc.custrecord_advs_l_h_location;
	var Charge		=	headerREc.custrecord_advs_l_h_charge_tax;
	var TaxCode		=	headerREc.custrecord_advs_l_h_tax_code;
	var Frequency	=	headerREc.custrecord_advs_l_h_pay_freq;
	var TaxRate		=	headerREc.custrecord_advs_c_h_tx_rate;
	
	
	var EqpPrice		=	headerREc.custrecord_advs_l_a_tot_eqp_price*1;
	var AdminFee		=	headerREc.custrecord_advs_l_a_admin_gp_fee*1;
	var downPay			=	headerREc.custrecord_advs_l_a_down_payment*1;*/

	/*var	TaxRate	=	0;
	if(TaxCode){
		TaxRate	=	nlapiLookupField("taxgroup",TaxCode,"rate");
		
	}*/
	var recmach	=	"recmachcustrecord_advs_lea_header_link";
	var lines	=	headerREc.getLineItemCount(recmach);
	var vinData	=	[];
	for(var i=1;i<=lines;i++){
		var vinId	=	headerREc.getLineItemValue(recmach, "custrecord_advs_lea_vin_stk_stock", i);
		var stat	=	headerREc.getLineItemValue(recmach, "custrecord_advs_lea_stock_status", i);
		if(stat == 6 || stat == 8){
//			var obj	=	{};
//			obj.vinId	=	vinId;
			vinData.push(vinId);
		}
	}
	var totVin	=	vinData.length;

	if(!TaxRate){TaxRate	=	7;}


	var setupData   = invoiceTypeSearch();


	var globalFld	=	new Array();
	globalFld.push("custrecord_advs_glo_set_renatkl_item");
	globalFld.push("custrecord_advs_g_s_admin_fee");
	globalFld.push("custrecord_advs_g_s_down_pay_item");
	globalFld.push("custrecord_advs_g_s_principal");
	globalFld.push("custrecord_advs_g_s_int_item");
	globalFld.push("custrecord_advs_g_s_damage_fee");
	globalFld.push("custrecord_advs_g_s_tol_chrge");
	var GlobalREc	=	nlapiLookupField("customrecord_advs_global_setting", 1, globalFld);
	var REntalItem	=	GlobalREc.custrecord_advs_glo_set_renatkl_item;
	var AdminItem	=	GlobalREc.custrecord_advs_g_s_admin_fee;
	var DownItem	=	GlobalREc.custrecord_advs_g_s_down_pay_item;
	var PrincipItem			=	GlobalREc.custrecord_advs_g_s_principal;
	var InterestItem		=	GlobalREc.custrecord_advs_g_s_int_item;
	var DamageItem			=	GlobalREc.custrecord_advs_g_s_damage_fee;
	var tollItem			=	GlobalREc.custrecord_advs_g_s_tol_chrge;

	nlapiLogExecution("DEBUG", "PrincipItem", PrincipItem);
	var invoiceID	="";
	var nexInvDate	=	"";





	var search	=	nlapiCreateSearch("customrecord_advs_lm_lease_card_child",
		[
	
			 ["custrecord_advs_lm_lc_c_link","anyof",headerID],
		      "AND", 
		      ["custrecord_advs_lm_lc_c_narration","equalto","1"]
		],
		[
			new nlobjSearchColumn("custrecord_advs_r_p_sche_pay"),
			new nlobjSearchColumn("custrecord_advs_lm_lc_c_down_paying"),
			new nlobjSearchColumn("custrecord_advs_reg_pay_reg_prin"),
			new nlobjSearchColumn("custrecord_advs_reg_pay_reg_int"),
			new nlobjSearchColumn("internalid"),
			new nlobjSearchColumn("custrecord_advs_lm_lc_c_date"),
			new nlobjSearchColumn("custrecord_advs_lea_vin_stk_stock","custrecord_advs_r_p_leas_chld"),

		]
	);
	nlapiLogExecution("DEBUG", "invoiceCreated", "SAE");
	var run	=	search.runSearch();
	var col	=	run.getColumns();
	var invoiceCreated	=	"F";


	run.forEachResult(function(rec){
		var PrincipleAmount	=	rec.getValue("custrecord_advs_reg_pay_reg_prin")*1;
		var IntAmount		=	rec.getValue("custrecord_advs_reg_pay_reg_int")*1;
		var IntId			=	rec.getValue("internalid");
		var TranDate		=	rec.getValue("custrecord_advs_lm_lc_c_date");
		var vinID			=	rec.getValue("custrecord_advs_lea_vin_stk_stock","custrecord_advs_r_p_leas_chld");

		nexInvDate		=	nlapiAddMonths(nlapiStringToDate(TranDate), 1);

	/*	var InvoiceREc	=	nlapiCreateRecord("invoice");
		InvoiceREc.setFieldValue("entity", customer);
//      InvoiceREc.setFieldValue("customform", "198");
//		InvoiceREc.setFieldText("customform", "ADVS Contract Invoice");
		InvoiceREc.setFieldValue("trandate", TranDate);
		InvoiceREc.setFieldValue("location", Location);
//		InvoiceREc.setFieldValue("department", 7);
//		InvoiceREc.setFieldValue("custbody_advs_rental_head_link", headerID);
//		InvoiceREc.setFieldValue("custbody_advs_type_of_payment", 1);
		if(TaxCode){
			InvoiceREc.setFieldValue("istaxable", "T");
			InvoiceREc.setFieldValue("taxitem", TaxCode);
			InvoiceREc.setFieldValue("taxrate", TaxRate);

		}*/


		var InvoiceREc	=	nlapiCreateRecord("invoice");
		InvoiceREc.setFieldValue("entity", customer);
		InvoiceREc.setFieldValue("trandate", TodayD);
		InvoiceREc.setFieldValue("location", Location);
		InvoiceREc.setFieldValue("custbody_advs_lease_head", headerID);


			var sp_Princ	=	PrincipleAmount;
			var sp_inter	=	IntAmount;
			var vinId	=	vinID;

			InvoiceREc.selectNewLineItem("item");
			InvoiceREc.setCurrentLineItemValue("item", "item", PrincipItem);
			InvoiceREc.setCurrentLineItemValue("item", "quantity", 1);
			InvoiceREc.setCurrentLineItemValue("item", "rate", sp_Princ);
			InvoiceREc.setCurrentLineItemValue("item", "description", "Principle");
			InvoiceREc.setCurrentLineItemValue("item", "amount", sp_Princ);
	
			InvoiceREc.setCurrentLineItemValue("item", "custcol_advs_st_applied_to_vin",vinId);
			InvoiceREc.commitLineItem("item");

			InvoiceREc.selectNewLineItem("item");
			InvoiceREc.setCurrentLineItemValue("item", "item", InterestItem);
			InvoiceREc.setCurrentLineItemValue("item", "quantity", 1);
			InvoiceREc.setCurrentLineItemValue("item", "memo", "Interest");
			InvoiceREc.setCurrentLineItemValue("item", "description", "Interest");
			InvoiceREc.setCurrentLineItemValue("item", "rate", sp_inter);
			InvoiceREc.setCurrentLineItemValue("item", "amount", sp_inter);
		/*	if(TaxCode){
				InvoiceREc.setCurrentLineItemValue("item", "istaxable", "T");
//				InvoiceREc.setCurrentLineItemValue("item", "taxcode",TaxCode);
			}*/
			InvoiceREc.setCurrentLineItemValue("item", "custcol_advs_st_applied_to_vin",vinId);

			InvoiceREc.commitLineItem("item");




		invoiceID	=	nlapiSubmitRecord(InvoiceREc, true, true);

		nlapiLogExecution("DEBUG", "invoiceID", IntId+"=>"+invoiceID);
		nlapiSubmitField("customrecord_advs_lm_lease_card_child", IntId, "custrecord_advs_r_p_invoice", invoiceID);

		invoiceCreated	=	"T";
		return true;
	});

	nlapiLogExecution("DEBUG", "invoiceID", invoiceID);

	var adminInvoice	=	"";var downInvoice	=	"";
	/*if(AdminFee>0 && AdminItem){
		var InvoiceREc	=	nlapiCreateRecord("invoice");
		InvoiceREc.setFieldValue("entity", customer);
      InvoiceREc.setFieldValue("customform", 198);
      
//		InvoiceREc.setFieldText("customform", "ADVS Contract Invoice");
		InvoiceREc.setFieldValue("trandate", TodayD);
//		InvoiceREc.setFieldValue("terms", 4);
		InvoiceREc.setFieldValue("location", Location);
//		InvoiceREc.setFieldValue("department", 7);
		InvoiceREc.setFieldValue("custbody_advs_rental_head_link", headerID);
		
		InvoiceREc.selectNewLineItem("item");
		InvoiceREc.setCurrentLineItemValue("item", "item", AdminItem);
		InvoiceREc.setCurrentLineItemValue("item", "quantity", 1);
		InvoiceREc.setCurrentLineItemValue("item", "rate", AdminFee);
		InvoiceREc.setCurrentLineItemValue("item", "amount", AdminFee);

		InvoiceREc.commitLineItem("item");
	
		
		 adminInvoice	=	nlapiSubmitRecord(InvoiceREc, true, true);
		
	}*/

	if(downPay>0 && DownItem){/*
		var InvoiceREc	=	nlapiCreateRecord("invoice");
		InvoiceREc.setFieldValue("entity", customer);
//      InvoiceREc.setFieldValue("customform", 198);
		InvoiceREc.setFieldText("customform", "ADVS Contract Invoice");
//		InvoiceREc.setFieldValue("trandate", TodayD);
//		InvoiceREc.setFieldValue("terms", 4);
		InvoiceREc.setFieldValue("location", Location);
//		InvoiceREc.setFieldValue("department", 7);
//		InvoiceREc.setFieldValue("custbody_advs_rental_head_link", headerID);
//		InvoiceREc.setFieldValue("custbody_advs_type_of_payment", 2);
		if(TaxCode){
			InvoiceREc.setFieldValue("istaxable", "T");
			InvoiceREc.setFieldValue("taxitem", TaxCode);
			InvoiceREc.setFieldValue("taxrate", TaxRate);
		}

		InvoiceREc.selectNewLineItem("item");
		InvoiceREc.setCurrentLineItemValue("item", "item", DownItem);
		InvoiceREc.setCurrentLineItemValue("item", "quantity", 1);
		InvoiceREc.setCurrentLineItemValue("item", "rate", downPay);
		InvoiceREc.setCurrentLineItemValue("item", "amount", downPay);
		if(TaxCode){
			InvoiceREc.setCurrentLineItemValue("item", "istaxable", "T");
//			InvoiceREc.setCurrentLineItemValue("item", "taxcode",TaxCode);
		}

		InvoiceREc.commitLineItem("item");

		downInvoice	=	nlapiSubmitRecord(InvoiceREc, true, true);

	*/}

	///Damage Fee

	var damageInv="";
	/*var search_d	=	nlapiCreateSearch("customrecord_advs_damage_fee",
			[
			   ["custrecord_advs_d_f_lease_link","anyof",headerID], 
			   "AND", 
			   ["custrecord_advs_d_f_date","onorbefore","today"]
			], 
			[
			   new nlobjSearchColumn("custrecord_advs_d_f_date"), 
			   new nlobjSearchColumn("custrecord_advs_d_f_amount"),
			   new nlobjSearchColumn("custrecord_advs_d_f_remarks"),
			   new nlobjSearchColumn("internalid"),
			]
			);
	var run_d	=	search_d.runSearch();
	var col_d	=	run_d.getColumns();
	run_d.forEachResult(function(rec_d){
		var TranDate		=	rec_d.getValue("custrecord_advs_d_f_date");
		var DamageFee		=	rec_d.getValue("custrecord_advs_d_f_amount")*1;
		var IntId			=	rec_d.getValue("internalid");
		var REmark			=	rec_d.getValue("custrecord_advs_d_f_remarks");
		
		var InvoiceREc	=	nlapiCreateRecord("invoice");
		InvoiceREc.setFieldValue("entity", customer);
      InvoiceREc.setFieldValue("customform", 198);
//		InvoiceREc.setFieldText("customform", "ADVS Contract Invoice");
		InvoiceREc.setFieldValue("trandate", TranDate);
		InvoiceREc.setFieldValue("location", Location);
//		InvoiceREc.setFieldValue("department", 7);
		InvoiceREc.setFieldValue("custbody_advs_rental_head_link", headerID);
		InvoiceREc.setFieldValue("memo", REmark);
		
		InvoiceREc.selectNewLineItem("item");
		InvoiceREc.setCurrentLineItemValue("item", "item", DamageItem);
		InvoiceREc.setCurrentLineItemValue("item", "quantity", 1);
		InvoiceREc.setCurrentLineItemValue("item", "rate", DamageFee);
		InvoiceREc.setCurrentLineItemValue("item", "amount", DamageFee);
		InvoiceREc.commitLineItem("item");
		
		
		 damageInv	=	nlapiSubmitRecord(InvoiceREc, true, true);
		
		nlapiSubmitField("customrecord_advs_damage_fee", IntId, "custrecord_advs_d_f_invoice", damageInv);

		return true;
	});*/

	/*	///Toll Charge
        var tollInv	=	"";
        var search_d_t	=	nlapiCreateSearch("customrecord_advs_toll_details",
                [
                   ["custrecord_advs_toll_rental_cont_link","anyof",headerID],
                   "AND",
                   ["custrecord_advs_toll_date","onorbefore","today"]
                ],
                [
                   new nlobjSearchColumn("custrecord_advs_toll_date"),
                   new nlobjSearchColumn("custrecord_advs_toll_amount"),
                   new nlobjSearchColumn("custrecord_advs_toll_violation_no"),
                   new nlobjSearchColumn("internalid"),
                ]
                );
        var run_d_t	=	search_d_t.runSearch();
        var col_d_t	=	run_d_t.getColumns();
        run_d_t.forEachResult(function(rec_d_t){
            var TranDate		=	rec_d_t.getValue("custrecord_advs_toll_date");
            var tollFee			=	rec_d_t.getValue("custrecord_advs_toll_amount")*1;
            var IntId			=	rec_d_t.getValue("internalid");
            var REmark			=	rec_d_t.getValue("custrecord_advs_toll_violation_no");

            var InvoiceREc	=	nlapiCreateRecord("invoice");
            InvoiceREc.setFieldValue("entity", customer);
    //      InvoiceREc.setFieldValue("customform", 198);
            InvoiceREc.setFieldText("customform", "ADVS Contract Invoice");
    //		InvoiceREc.setFieldValue("trandate", TranDate);
            InvoiceREc.setFieldValue("location", Location);
    //		InvoiceREc.setFieldValue("department", 7);
    //		InvoiceREc.setFieldValue("custbody_advs_rental_head_link", headerID);
            InvoiceREc.setFieldValue("memo", REmark);

            InvoiceREc.selectNewLineItem("item");
            InvoiceREc.setCurrentLineItemValue("item", "item", tollItem);
            InvoiceREc.setCurrentLineItemValue("item", "quantity", 1);
            InvoiceREc.setCurrentLineItemValue("item", "rate", tollFee);
            InvoiceREc.setCurrentLineItemValue("item", "amount", tollFee);
            InvoiceREc.commitLineItem("item");


             tollInv	=	nlapiSubmitRecord(InvoiceREc, true, true);

            nlapiSubmitField("customrecord_advs_toll_details", IntId, "custrecord_advs_t_d_invoice_link", tollInv);

            return true;
        });*/



	var recmach	=	"recmachcustrecord_advs_lea_header_link";
	var headerrec	=	nlapiLoadRecord("customrecord_advs_lease_header", headerID);
	var customer	=	headerrec.getFieldValue("custrecord_advs_r_h_customer_name");
	var location	=	headerrec.getFieldValue("custrecord_advs_r_h_location");
	headerrec.setFieldValue("custrecord_advs_l_h_status", 5);
	headerrec.setFieldValue("custrecord_advs_l_h_invoice_date", TodayD);
//	headerrec.setFieldValue("custrecord_advs_l_h_invoice_date", TodayD);
	headerrec.setFieldValue("custrecord_advs_l_a_down_invoie", downInvoice);
//	headerrec.setFieldValue("custrecord_advs_r_a_admin_invoice", adminInvoice);
	headerrec.setFieldValue("custrecord_advs_l_h_next_bill", nexInvDate);




	var lineCount	=	headerrec.getLineItemCount(recmach);
	for(var f=1;f<=lineCount;f++){
		headerrec.selectLineItem("recmachcustrecord_advs_lea_header_link", f);
		headerrec.setCurrentLineItemValue("recmachcustrecord_advs_lea_header_link", "custrecord_advs_lea_stock_status",8);
		headerrec.commitLineItem("recmachcustrecord_advs_lea_header_link");
	}


	/*if(invoiceID){
		headerrec.selectNewLineItem("recmachcustrecord_advs_r_h_headerr_link");
		headerrec.setCurrentLineItemValue("recmachcustrecord_advs_r_h_headerr_link", "custrecord_advs_r_h_transactions", invoiceID);
		headerrec.commitLineItem("recmachcustrecord_advs_r_h_headerr_link");
	}
	
	if(adminInvoice){
		headerrec.selectNewLineItem("recmachcustrecord_advs_r_h_headerr_link");
		headerrec.setCurrentLineItemValue("recmachcustrecord_advs_r_h_headerr_link", "custrecord_advs_r_h_transactions", adminInvoice);
		headerrec.commitLineItem("recmachcustrecord_advs_r_h_headerr_link");
	}
	if(downInvoice){
		headerrec.selectNewLineItem("recmachcustrecord_advs_r_h_headerr_link");
		headerrec.setCurrentLineItemValue("recmachcustrecord_advs_r_h_headerr_link", "custrecord_advs_r_h_transactions", downInvoice);
		headerrec.commitLineItem("recmachcustrecord_advs_r_h_headerr_link");
	}
	if(damageInv){
		headerrec.selectNewLineItem("recmachcustrecord_advs_r_h_headerr_link");
		headerrec.setCurrentLineItemValue("recmachcustrecord_advs_r_h_headerr_link", "custrecord_advs_r_h_transactions", damageInv);
		headerrec.commitLineItem("recmachcustrecord_advs_r_h_headerr_link");
	}
	if(tollInv){
		headerrec.selectNewLineItem("recmachcustrecord_advs_r_h_headerr_link");
		headerrec.setCurrentLineItemValue("recmachcustrecord_advs_r_h_headerr_link", "custrecord_advs_r_h_transactions", tollInv);
		headerrec.commitLineItem("recmachcustrecord_advs_r_h_headerr_link");
	}*/
	// nlapiSubmitRecord(headerrec, true, true);
}

function divideAmounts(number,n){
	var values = [];
	var times = n;
	while(times > 0){
		values.push(Math.floor(number / n));
		times--;
	}
	return values;


}

function invoiceTypeSearch(){
	var setupDataVal   =   [];

	var customrecord_advs_st_invoice_typeSearchObj	= nlapiCreateSearch("customrecord_advs_st_invoice_type",
		[
			["isinactive","is","F"]
		],[
			new nlobjSearchColumn("internalid"),
			new nlobjSearchColumn("custrecord_advs_i_v_rent_item"),
			new nlobjSearchColumn("custrecord_advs_inv_type_sbtype"),
		])

	customrecord_advs_st_invoice_typeSearchObj.runSearch().forEachResult(function(result){
		var subType    =   result.getValue({name:"custrecord_advs_inv_type_sbtype"});
		setupDataVal[subType] = new Array();
		setupDataVal[subType]["id"]    = result.getValue({name:"internalid"});
		setupDataVal[subType]["regularitem"]  = result.getValue({name:"custrecord_advs_i_v_rent_item"});



		nlapiLogExecution("DEBUG","subType",subType);

		return true;
	});

	return setupDataVal;
}
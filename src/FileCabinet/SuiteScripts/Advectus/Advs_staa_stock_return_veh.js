/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       14 Oct 2019     Advectus
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
var MileageMaint	=	"3296";
function suitelet(request, response){
	if(request.getMethod()=="GET"){
		var reqid			=	request.getParameter("requestID");
		var reqexistid		=	request.getParameter("requestexistID");
//		var reqid			=	6;
		nlapiLogExecution("DEBUG", "reqid", reqid);
		if(reqid != null && reqid != undefined && reqid !=""){
			var form		=	nlapiCreateForm("",true);

			var group1	=	form.addFieldGroup("custpage_group1", " ");
			var group2	=	form.addFieldGroup("custpage_group2", " ");

			var tempID	=	"";
			if(reqexistid != null && reqexistid != undefined && reqexistid !=""){
				tempID	=	reqexistid;
			}else{
				var Trec	=	nlapiCreateRecord("customrecord_advs_return_temp_par");
				tempID	=	nlapiSubmitRecord(Trec); 
			}

			var LookFld	=	new Array();
			LookFld.push("");


			// var REcidFld	=	form.addField("custpage_recid", "select", "REcid", "customrecord_advs_rental_header");
			// REcidFld.setDefaultValue(reqid);
			// REcidFld.setDisplayType("hidden");

			var REcidTempFld	=	form.addField("custpage_temp_recid", "select", "REcid", "customrecord_advs_return_temp_par");
			REcidTempFld.setDefaultValue(tempID);
			REcidTempFld.setDisplayType("hidden");


			var sublist	=	form.addSubList("custpage_sublist", "list", "Stock #");
			sublist.addField("custlist_mark", "checkbox", "Mark");
			sublist.addField("custlist_add_othricon", "text", "Addons").setDisplayType("inline");
			sublist.addField("custlist_add_repicon", "text", "Repair").setDisplayType("inline");
			sublist.addField("custlist_stock_id", "select", "Rental Line", "customrecord_advs_lea_rental_child").setDisplayType("inline");
			sublist.addField("custlist_fleet", "text", "Stock #");
			sublist.addField("custlist_vin_id", "select", "Vin NO", "customrecord_advs_vm").setDisplayType("inline");
			sublist.addField("custlist_stck_tmp_id", "select", "TempID", "customrecord_advs_return_temp_child").setDisplayType("hidden");

			sublist.addField("custlist_open_invoice", "currency", "Open Invoice").setDisplayType("inline");

			sublist.addField("custlist_strtmmileage", "integer", "Start Hmr");
			sublist.addField("custlist_endmmileage", "integer", "End Hmr").setDisplayType("entry");

			sublist.addField("custlist_mainttilldate", "float", "Maintenance Charged");
			sublist.addField("custlist_maintper", "float", "Extra. Rate").setDisplayType("entry");

			sublist.addField("custlist_netamnt", "currency", "Net Amount").setDisplayType("entry");

			sublist.addField("custlist_fuel_level_s", "select", "Start Fuel Level","customlist_advs_st_fuel_level").setDisplayType("inline");
			sublist.addField("custlist_fuel_level_e", "select", "End Fuel Level","customlist_advs_st_fuel_level").setDisplayType("entry");

			sublist.addField("custlist_fuel_charges", "currency", "Fuel Charges").setDisplayType("entry");



			sublist.addField("custlist_actual_maintenence", "float", "Extra Charge").setDisplayType("entry");
			sublist.addField("custlist_actual_charge", "currency", "Difference").setDisplayType("hidden");


			sublist.addField("custlist_totaddons", "currency", "Addon Total").setDisplayType("disabled");




			returnStock(reqid);
			var OpenInvoicesARR	=	openInvoicd(reqid);

			populateSublist(sublist,reqid,tempID,OpenInvoicesARR);
			var Deposited	=	FetchDeposit(reqid);




			if(Deposited>0){
				Deposited	=	Deposited*1;
			}else{
				Deposited	=	0;
			}
			var depTempFld	=	form.addField("custpage_dep_currcey", "Currency", "Deposited");
			depTempFld.setDefaultValue(Deposited);
			depTempFld.setDisplayType("hidden");


			var headerFld	=	new Array();
			headerFld.push("custrecord_advs_allowed_per_mile");
			headerFld.push("custrecord_advs_con_fuel_c_pe");

			headerFld.push("custrecord_advs_r_h_last_in_date");
			headerFld.push("custrecord_advs_r_h_start_date");



			// var headerREc	=	nlapiLookupField("customrecord_advs_rental_header", reqid, headerFld);
			// var allowedP	=	headerREc.custrecord_advs_allowed_per_mile*1;
			// var fuelchrg	=	headerREc.custrecord_advs_con_fuel_c_pe*1;
			// var LastInv		=	headerREc.custrecord_advs_r_h_last_in_date;
			// var stDate		=	headerREc.custrecord_advs_r_h_start_date;
			
			// if(!LastInv){
			// 	LastInv	=	stDate
			// }

			// var	todayD	=	new Date();

			// var allowedFld	=	form.addField("custpage_allowedp", "currency", "ALLOWED PER MILE");
			// allowedFld.setDefaultValue(allowedP);
			// allowedFld.setDisplayType("hidden");

// 			var fuelFld	=	form.addField("custpage_alwdflch", "currency", "FuelCharges");
// 			fuelFld.setDefaultValue(fuelchrg);
// 			fuelFld.setDisplayType("hidden");

// 			var lastInvFld	=	form.addField("custpage_last_in", "date", "Last Invoice Date",null,"custpage_group1");
// 			lastInvFld.setDefaultValue(LastInv);
// //			fuelFld.setDisplayType("hidden");

			// var RetDaFld	=	form.addField("custpage_return_date", "date", "Return Date",null,"custpage_group1");
			// RetDaFld.setLayoutType('midrow', 'startcol');
//			fuelFld.setDefaultValue(nla);
//			fuelFld.setDisplayType("hidden");
			// RetDaFld.setMandatory(true)

			

			var htmlfld	=	form.addField("custpage_html", "inlinehtml", " ",null,"custpage_group2");



			// var Monthly	=	0;var Weekly=0;var Daily=0;
			// var search_i	=	nlapiCreateSearch("customrecord_advs_lea_rental_child",
			// 		[
			// 		 ["custrecord_advs_r_h_header_link","anyof",reqid]
			// 		 ], 
			// 		 [
			// 		//   new nlobjSearchColumn("custitem_advs_r_d_rate","CUSTRECORD_ADVS_R_H_MODELL","max"), 
			// 		  new nlobjSearchColumn("custitem_advs_rent_month_rate","CUSTRECORD_ADVS_R_H_MODELL","max"), 
			// 		  new nlobjSearchColumn("custitem_advs_rental_weekly_rate","CUSTRECORD_ADVS_R_H_MODELL","max").setSort()
			// 		  ]
			// );

			// var run_i	=	search_i.runSearch();
			// var cols_i	=	run_i.getColumns();
			// run_i.forEachResult(function(record) {
			// 	Monthly	=	record.getValue("custitem_advs_rent_month_rate","CUSTRECORD_ADVS_R_H_MODELL","max")*1;
			// 	Weekly	=	record.getValue("custitem_advs_rental_weekly_rate","CUSTRECORD_ADVS_R_H_MODELL","max")*1;
			// 	// Daily	=	record.getValue("custitem_advs_r_d_rate","CUSTRECORD_ADVS_R_H_MODELL","max")*1;

			// 	return true;
			// });
			
			Monthly	=	300;
			Weekly	=	42;
			Daily	=	10;
			
			

			var mnthlyFld	=	form.addField("custpage_mnthly", "currency", "Monthly Rate");
			mnthlyFld.setDefaultValue(Monthly);
			mnthlyFld.setDisplayType("hidden");
			var weeklyFld	=	form.addField("custpage_weekly", "currency", "Weekly Rate");
			weeklyFld.setDefaultValue(Weekly);
			weeklyFld.setDisplayType("hidden");
			var dailyFld	=	form.addField("custpage_daily", "currency", "Daily Rate");
			dailyFld.setDefaultValue(Daily);
			dailyFld.setDisplayType("hidden");

			var html	=	"";
			html+="<table class='maintable'>" +
			"<tr><th></th><th>Rate</th><th>Units</th><th>Amount</th></tr>" +

			"<tr><td class='labeltd'>Month</td><td><input type='text' name='custpage_mnth_rate' id = 'custpage_mnth_rate' value="+Monthly+" class ='setinputsize' onChange='mychangefuntion();'>" +
			"</td><td><input type='text' name='custpage_mnth_tot' id = 'custpage_mnth_tot' value='0' class ='setinputsize' disabled></td>" +
			"<td><input type='text' name='custpage_mnth_amnt' id = 'custpage_mnth_amnt' value='0' class ='setinputsize' disabled></td></tr>" +


			"<tr><td class='labeltd'>Week</td><td><input type='text' name='custpage_week_rate' id = 'custpage_week_rate' value="+Weekly+" class ='setinputsize' onChange='mychangefuntion();'>" +
			"</td><td><input type='readonly' name='custpage_week_tot' id = 'custpage_week_tot' value='0' class ='setinputsize' disabled></td>" +
			"<td><input type='inline' name='custpage_week_amnt' id = 'custpage_week_amnt' value='0' class ='setinputsize' disabled></td></tr>" +

			"<tr><td class='labeltd'>Day</td><td><input type='text' name='custpage_day_rate' id = 'custpage_day_rate' value="+Daily+" class ='setinputsize' onChange='mychangefuntion();'>" +
			"</td><td><input type='readonly' name='custpage_day_tot' id = 'custpage_day_tot' value='0' class ='setinputsize' disabled></td>" +
			"<td><input type='inline' name='custpage_day_amnt' id = 'custpage_day_amnt' value='0' class ='setinputsize' disabled></td></tr>" +


			"<tr><td colspan=3 class='labeltd'>Total</td><td><input type='text' name ='custpage_alltot' id = 'custpage_alltot' value='0' disabled></td></tr>" +
			"<table>";


			html+=StyleCss();

			htmlfld.set
			htmlfld.setDefaultValue(html);
			htmlfld.setLayoutType('startrow', 'startrow');

//			form.addButton("custpage_addons", "Addons", "clickAddons()");
			form.addSubmitButton("Confirm Return");
			form.setScript("customscript_advs_csaa_stock_return_veh");
			response.writePage(form);
		}else{

		}

	}else{
		var headerID		=	request.getParameter("custpage_recid");
		var LineCount		=	request.getLineItemCount("custpage_sublist");
		var reqexistid		=	request.getParameter("custpage_temp_recid");
		var reqstockL		=	request.getLineItemCount("custpage_sublist");


		fetchSetup(reqexistid);
//		findAddons(headerID);
		var group	=	"recmachcustrecord_advs_r_t_c_header";

		var headerFld	=	new Array();
		headerFld.push("custrecord_advs_r_h_customer_name");
		headerFld.push("custrecord_advs_r_h_location");
		headerFld.push("custrecord_advs_r_h_tax_code");
		headerFld.push("custrecord_advs_r_h_pay_freq");
		headerFld.push("custrecord_advs_r_h_mileage_plan");
		headerFld.push("custrecord_advs_r_h_mileage_est");
		headerFld.push("custrecord_advs_r_h_sales_rep");


		var headerREc	=	nlapiLookupField("customrecord_advs_rental_header", headerID, headerFld);
		var customer	=	headerREc.custrecord_advs_r_h_customer_name;
		var Location	=	headerREc.custrecord_advs_r_h_location;
		var Charge		=	headerREc.custrecord_advs_r_h_tax_code;
		var TaxCode		=	headerREc.custrecord_advs_r_h_tax_code;
		var Frequency	=	headerREc.custrecord_advs_r_h_pay_freq;
		var MileageP	=	headerREc.custrecord_advs_r_h_mileage_plan;
		var MileageEst	=	headerREc.custrecord_advs_r_h_mileage_est;
		var salerep		=	headerREc.custrecord_advs_r_h_sales_rep;



		var DataStock		=	new  Array();
		var CreditArr	=	new  Array();


		var invoiceArray	=	new Array();
		var MemoArray		=	new Array();

		var uniqueInvoicestock	=	new Array();
		var uniqueMemostock	=	new Array();

		for(var m=1;m<=reqstockL;m++){

			var Mark		=	request.getLineItemValue("custpage_sublist", "custlist_mark", m);
			var StockIDD	=	request.getLineItemValue("custpage_sublist", "custlist_stock_id", m);
			var EndMil		=	request.getLineItemValue("custpage_sublist", "custlist_endmmileage", m)*1;
			var Addons		=	request.getLineItemValue("custpage_sublist", "custlist_totaddons", m)*1;
			var ActCharge	=	request.getLineItemValue("custpage_sublist", "custlist_actual_charge", m)*1;
			var Netamnt		=	request.getLineItemValue("custpage_sublist", "custlist_netamnt", m)*1;
			var VinId		=	request.getLineItemValue("custpage_sublist", "custlist_vin_id", m);


			var Netamnt		=	request.getLineItemValue("custpage_sublist", "custlist_netamnt", m)*1;
			var Endfuel		=	request.getLineItemValue("custpage_sublist", "custlist_fuel_level_e", m);

			var FuelCharge		=	request.getLineItemValue("custpage_sublist", "custlist_fuel_charges", m)*1;



			if(Mark=="T"){

				if(Netamnt>0){
					/*var CreditID	="";
					if(issueMEMo>0){
						 CreditID	=	postCredit(customer,salerep,Location,headerID,Netamnt,StockIDD);
					}*/

					
					
					if(invoiceArray[StockIDD] != null && invoiceArray[StockIDD] != undefined){

					}else{
						invoiceArray[StockIDD]	=	new Array();
						invoiceArray[StockIDD]["EndMil"]	=	EndMil;
						invoiceArray[StockIDD]["Addons"]	=	Addons;
						invoiceArray[StockIDD]["ActCharge"]	=	ActCharge;
						invoiceArray[StockIDD]["Netamnt"]	=	Netamnt;
						invoiceArray[StockIDD]["VinId"]		=	VinId;
						invoiceArray[StockIDD]["Endfuel"]		=	Endfuel;
						invoiceArray[StockIDD]["FuelCharge"]		=	FuelCharge;



					}

					if(uniqueInvoicestock.indexOf(StockIDD)==-1){
						uniqueInvoicestock.push(StockIDD)
					}
				}else{

					if(uniqueMemostock.indexOf(StockIDD)==-1){
						uniqueMemostock.push(StockIDD);
					}
					if(MemoArray[StockIDD] != null && MemoArray[StockIDD] != undefined){

					}else{
						MemoArray[StockIDD]	=	new Array();
						MemoArray[StockIDD]["EndMil"]	=	EndMil;
						MemoArray[StockIDD]["Addons"]	=	Addons;
						MemoArray[StockIDD]["ActCharge"]	=	ActCharge;
						MemoArray[StockIDD]["Netamnt"]	=	Netamnt;
						MemoArray[StockIDD]["VinId"]		=	VinId;
						MemoArray[StockIDD]["Endfuel"]		=	Endfuel;
					}


//					var InvoiceID	=	PostInvoice2(customer,Location,Netamnt,headerID,StockIDD);//InvoiceByline(headerID,StockIDD);

					

					/*if(DataStock[StockIDD] != null && StockIDD != undefined){

					}else{
						DataStock[StockIDD]	=	new Array();
						DataStock[StockIDD]["idinv"]	=	InvoiceID;
						DataStock[StockID]["Mileage"]	=	EndMil*1
					}*/

				}



			}
		}
		
		nlapiLogExecution("DEBUG", "InvoiceREc", uniqueInvoicestock.length);

		var invID=	"";
		if(uniqueInvoicestock.length>0){
			nlapiLogExecution("DEBUG", "InvoiceREc", "InvoiceREc");

			var InvoiceREc	=	nlapiCreateRecord("invoice");
			InvoiceREc.setFieldValue("entity", customer);
			InvoiceREc.setFieldText("customform", "ADVS Lease Invoice");
			InvoiceREc.setFieldValue("memo", "Return");
			InvoiceREc.setFieldValue("location", Location);

			var globalFld	=	new Array();
			globalFld.push("custrecord_advs_glo_set_renatkl_item");
			var GlobalREc	=	nlapiLookupField("customrecord_advs_global_setting", 1, globalFld);
			var REntalItem	=	GlobalREc.custrecord_advs_glo_set_renatkl_item;

			for(var f=0;f<=uniqueInvoicestock.length;f++){

				var stckID	=	uniqueInvoicestock[f];
				var St_id	=	stckID;
				if(invoiceArray[stckID] != null && invoiceArray[stckID] != undefined){
					var EndMil		=	invoiceArray[stckID]["EndMil"];
					var Addons		=	invoiceArray[stckID]["Addons"]*1;
					var ActCharge	=	invoiceArray[stckID]["ActCharge"]*1;
					var Netamnt		=	invoiceArray[stckID]["Netamnt"];
					var AppliedVin		=	invoiceArray[stckID]["VinId"];
					var FuelCharge		=	invoiceArray[stckID]["FuelCharge"]*1;


					nlapiLogExecution("DEBUG", "ActCharge", ActCharge+"=>"+FuelCharge);

					ActCharge	=	ActCharge;
					if(Addons>0){


						if(DataArray[St_id] != null && DataArray[St_id] != undefined){
							var stckLength	=	DataArray[St_id].length;
							nlapiLogExecution("DEBUG", "stckLength", stckLength);
							for(var h=0;h<stckLength;h++){
								if(DataArray[St_id][h] != null && DataArray[St_id][h] != undefined){
									var ItemG		=	DataArray[St_id][h]["Item"];
									var St_currency	=	DataArray[St_id][h]["Currency"]*1;
									var Comments	=	DataArray[St_id][h]["Comments"];


									nlapiLogExecution("DEBUG", "St_currency@@", St_currency);
									if(ItemG){
										if(St_currency<=0){
											St_currency	=	St_currency*-1;
										}
										InvoiceREc.selectNewLineItem("item");
										InvoiceREc.setCurrentLineItemValue("item", "item", ItemG);
										InvoiceREc.setCurrentLineItemValue("item", "custcol_advs_st_contract_vin", AppliedVin);
										// InvoiceREc.setCurrentLineItemValue("item", "custcol_advs_rental_child", St_id);
										InvoiceREc.setCurrentLineItemValue("item", "istaxable", "F");
										InvoiceREc.setCurrentLineItemValue("item", "description", Comments);


										InvoiceREc.setCurrentLineItemValue("item", "quantity", 1);
										InvoiceREc.setCurrentLineItemValue("item", "rate", St_currency);
										InvoiceREc.setCurrentLineItemValue("item", "amount", St_currency);
										InvoiceREc.commitLineItem("item");
									}


								}
							}

						}
					}

					InvoiceREc.selectNewLineItem("item");
					InvoiceREc.setCurrentLineItemValue("item", "item", MileageMaint);
					InvoiceREc.setCurrentLineItemValue("item", "quantity", 1);
					InvoiceREc.setCurrentLineItemValue("item", "rate", ActCharge);
					InvoiceREc.setCurrentLineItemValue("item", "amount", ActCharge);
					InvoiceREc.setCurrentLineItemValue("item", "custcol_advs_st_contract_vin", AppliedVin);
					// InvoiceREc.setCurrentLineItemValue("item", "custcol_advs_rental_child", St_id);
					InvoiceREc.commitLineItem("item");

					if(FuelCharge >0){
						InvoiceREc.selectNewLineItem("item");
						InvoiceREc.setCurrentLineItemValue("item", "item", 4460);

						InvoiceREc.setCurrentLineItemValue("item", "description", "FuelCharge");
						InvoiceREc.setCurrentLineItemValue("item", "quantity", 1);
						InvoiceREc.setCurrentLineItemValue("item", "rate", FuelCharge);
						InvoiceREc.setCurrentLineItemValue("item", "amount", FuelCharge);
						InvoiceREc.setCurrentLineItemValue("item", "custcol_advs_st_contract_vin", AppliedVin);
						// InvoiceREc.setCurrentLineItemValue("item", "custcol_advs_rental_child", St_id);
						InvoiceREc.commitLineItem("item");
					}

				}else{

				}
			}

			nlapiLogExecution("DEBUG", "ActCharge", "beforeSubmi");
			
			var InvoiceREc	=	nlapiSubmitRecord(InvoiceREc,true,true);

			nlapiLogExecution("DEBUG", "InvoiceREcID", InvoiceREc);
			invID	=	InvoiceREc;

		}


		////Credit MEMO

		var MEMOID=	"";
		if(uniqueMemostock.length>0){
			nlapiLogExecution("DEBUG", "MME", "MEMO");


			var creditmemo_1 = nlapiCreateRecord('creditmemo', {recordmode : 'dynamic'});
			creditmemo_1.setFieldValue('entity', customer);
			creditmemo_1.setFieldValue('tobeemailed', 'F');
			creditmemo_1.setFieldValue('trandate', nlapiDateToString(new Date()));
			creditmemo_1.setFieldValue('salesrep', salerep);
			creditmemo_1.setFieldValue('location', Location);
			creditmemo_1.setFieldValue('istaxable', 'F');

			// creditmemo_1.setFieldValue('custbody_advs_rental_head_link', headerID);





			var globalFld	=	new Array();
			globalFld.push("custrecord_advs_glo_set_renatkl_item");
			var GlobalREc	=	nlapiLookupField("customrecord_advs_global_setting", 1, globalFld);
			var REntalItem	=	GlobalREc.custrecord_advs_glo_set_renatkl_item;

			for(var f=0;f<=uniqueMemostock.length;f++){

				var stckID	=	uniqueMemostock[f];
				var St_id	=	stckID;
				if(MemoArray[stckID] != null && MemoArray[stckID] != undefined){
					var EndMil		=	MemoArray[stckID]["EndMil"];
					var Addons		=	MemoArray[stckID]["Addons"]*1;
					var ActCharge	=	MemoArray[stckID]["ActCharge"]*1;
					var Netamnt		=	MemoArray[stckID]["Netamnt"];
					var AppliedVin	=	MemoArray[stckID]["VinId"];


					ActCharge	=	ActCharge*1;
					if(Addons>0){
						if(DataArray[St_id] != null && DataArray[St_id] != undefined){
							var stckLength	=	DataArray[St_id].length;
							nlapiLogExecution("DEBUG", "stckLength", stckLength);
							for(var h=0;h<stckLength;h++){
								if(DataArray[St_id][h] != null && DataArray[St_id][h] != undefined){
									var ItemG		=	DataArray[St_id][h]["Item"];
									var St_currency	=	DataArray[St_id][h]["Currency"]*1;
									var Comments		=	DataArray[St_id][h]["Comments"];

									if(ItemG){
										nlapiLogExecution("DEBUG", "ItemG", ItemG);
										creditmemo_1.selectNewLineItem("item");
										creditmemo_1.setCurrentLineItemValue("item", "item", ItemG);
										creditmemo_1.setCurrentLineItemValue("item", "custcol_advs_st_contract_vin", AppliedVin);
										// creditmemo_1.setCurrentLineItemValue("item", "custcol_advs_rental_child", St_id);
										creditmemo_1.setCurrentLineItemValue("item", "price", "-1");
										creditmemo_1.setCurrentLineItemValue("item", "istaxable", "F");
										creditmemo_1.setCurrentLineItemValue("item", "description", Comments);

										creditmemo_1.setCurrentLineItemValue("item", "quantity", 1);
										creditmemo_1.setCurrentLineItemValue("item", "rate", St_currency);
										creditmemo_1.setCurrentLineItemValue("item", "amount", St_currency);
										creditmemo_1.commitLineItem("item");

									}

								}
							}

						}
					}

					creditmemo_1.selectNewLineItem("item");
					creditmemo_1.setCurrentLineItemValue("item", "item", MileageMaint);
					creditmemo_1.setCurrentLineItemValue("item", "quantity", 1);
					creditmemo_1.setCurrentLineItemValue("item", "rate", ActCharge);
					creditmemo_1.setCurrentLineItemValue("item", "amount", ActCharge);


//					creditmemo_1.setCurrentLineItemValue('item', 'custcol_advs_stock_no', headerID);
					// creditmemo_1.setCurrentLineItemValue('item', 'custcol_advs_rental_child', stckID);
					creditmemo_1.setCurrentLineItemValue('item', 'custcol_advs_st_contract_vin', AppliedVin);

					creditmemo_1.setCurrentLineItemValue('item', 'istaxable', 'F');
					creditmemo_1.commitLineItem('item');


				}else{

				}


			}


			var credit_momo_id = nlapiSubmitRecord(creditmemo_1, true, true);
			MEMOID		=	credit_momo_id;

		}


		var recmach	=	"recmachcustrecord_advs_r_h_header_link";
		var headerrec	=	nlapiLoadRecord("customrecord_advs_rental_header", headerID);
		var customer	=	headerrec.getFieldValue("custrecord_advs_r_h_customer_name");
		var location	=	headerrec.getFieldValue("custrecord_advs_r_h_location");
//		headerrec.setFieldValue("custrecord_advs_rental_status", 8);
		/*headerrec.setFieldValue("custrecord_advs_r_h_invoice_date", InvoiceDate);
		headerrec.setFieldValue("custrecord_advs_r_h_last_in_date", InvoiceDate);
		headerrec.setFieldValue("custrecord_advs_r_h_next_bill", NextInvoice);*/



		var lineCount	=	headerrec.getLineItemCount(recmach);
		for(var f=1;f<=lineCount;f++){
			var vinID	=	headerrec.getLineItemValue(recmach, "custrecord_advs_r_h_vin_stk_stock", f);
			var StockID	=	headerrec.getLineItemValue(recmach, "id", f);
			if(uniqueInvoicestock.indexOf(StockID)==-1){}else{

//				var InvoiceT	=	DataStock[StockID]["idinv"];
				headerrec.selectLineItem(recmach, f);
				// headerrec.setCurrentLineItemValue(recmach, "custrecord_advs_r_h_return_invoices", invID);
//				headerrec.setCurrentLineItemValue(recmach, "custrecord_advs_r_h_invc_dates", InvoiceDate);

				headerrec.setCurrentLineItemValue(recmach, "custrecord_advs_r_h_stock_status", 10);
				if(invoiceArray[StockID] != null && invoiceArray[StockID] != undefined){		//var EndMil		=	invoiceArray[stckID]["EndMil"];

					var tMileageDiff	=	invoiceArray[StockID]["EndMil"]*1;
					var tEndfuelDiff	=	invoiceArray[StockID]["Endfuel"]*1;

					if(tMileageDiff){
						headerrec.setCurrentLineItemValue(recmach, "custrecord_advs_r_c_end_mileage", tMileageDiff);
					}
					
					if(tEndfuelDiff){
						headerrec.setCurrentLineItemValue(recmach, "custrecord_advs_l_c_end_fuel_l", tEndfuelDiff);
					}
					
				}


				headerrec.commitLineItem(recmach);
			}

			//MEMO
			if(uniqueMemostock.indexOf(StockID)==-1){}else{

//				var InvoiceT	=	DataStock[StockID]["idinv"];
				headerrec.selectLineItem(recmach, f);
				// headerrec.setCurrentLineItemValue(recmach, "custrecord_advs_r_h_return_invoices", MEMOID);
//				headerrec.setCurrentLineItemValue(recmach, "custrecord_advs_r_h_invc_dates", InvoiceDate);

				headerrec.setCurrentLineItemValue(recmach, "custrecord_advs_r_h_stock_status", 10);
				if(invoiceArray[StockID] != null && invoiceArray[StockID] != undefined){		//var EndMil		=	invoiceArray[stckID]["EndMil"];

					var tMileageDiff	=	invoiceArray[StockID]["EndMil"]*1;
					headerrec.setCurrentLineItemValue(recmach, "custrecord_advs_r_c_end_mileage", tMileageDiff);
				}


				headerrec.commitLineItem(recmach);
			}
		}

		if(invID){
			headerrec.selectNewLineItem("recmachcustrecord_advs_r_h_headerr_link");
			headerrec.setCurrentLineItemValue("recmachcustrecord_advs_r_h_headerr_link", "custrecord_advs_r_h_transactions", invID);
			headerrec.setCurrentLineItemValue("recmachcustrecord_advs_r_h_headerr_link", "custrecord_advs_r_h_i_type", 3);

			headerrec.commitLineItem("recmachcustrecord_advs_r_h_headerr_link");
		}



		if(MEMOID){
			headerrec.selectNewLineItem("recmachcustrecord_advs_r_h_headerr_link");
			headerrec.setCurrentLineItemValue("recmachcustrecord_advs_r_h_headerr_link", "custrecord_advs_r_h_transactions", MEMOID);
			headerrec.setCurrentLineItemValue("recmachcustrecord_advs_r_h_headerr_link", "custrecord_advs_r_h_i_type", 4);

			headerrec.commitLineItem("recmachcustrecord_advs_r_h_headerr_link");
		}


		var FinalCount	=	headerrec.getLineItemCount(recmach);
		var statcount	=	0;
		for(var f=1;f<=FinalCount;f++){
			var Status	=	headerrec.getLineItemValue(recmach, "custrecord_advs_r_h_stock_status", f);
			if(Status==10){
				statcount++;
			}

		}

		if(statcount==FinalCount){
			headerrec.setFieldValue("custrecord_advs_rental_status", 8);
		}

		nlapiSubmitRecord(headerrec);

		/*	var loadREcord		=	nlapiLoadRecord("customrecord_advs_return_temp_par",reqexistid);
		loadREcord.setFieldValue("custrecord_advs_r_t_p_stage", 2);

		loadREcord.setFieldValue("custrecord_advs_r_t_p_rent__head",headerID);
		nlapiSubmitRecord(loadREcord);*/

//		nlapiSubmitField("customrecord_advs_return_temp_par", reqexistid, "custrecord_advs_r_t_p_stage", 1);

		/*var AllowRecord	=	"F";
		var StockArray	=	new Array();


		var lookFld	=	new Array();
//		lookFld.push("custrecord_advs_r_h_no_mnth");
		lookFld.push("custrecord_advs_r_h_invoice_date");

		var headREc		=	nlapiLookupField("customrecord_advs_rental_header", headerID, lookFld);
		var Month		=	2
		var InvDate		=	headREc.custrecord_advs_r_h_invoice_date;

		if(!InvDate){
			throw nlapiCreateError("111", "Please Enter Invoice Date");
		}
		var convDate	=	nlapiStringToDate(InvDate);
		var invoiceTime	=	convDate.getTime();
		var AddDate		=	nlapiAddMonths(convDate, Month);
		var ExactEnd	=	AddDate.getTime();

		var Today		=	new Date();
		var TodayTime	=	Today.getTime();


		var MonthDiff	=	diff_months(convDate, Today);
		var VinArr      =   [];



		for(var	i=1;i<=LineCount;i++){
			var vin			=	request.getLineItemValue("custpage_sublist", "custlist_vin_id", i);
			var Stock		=	request.getLineItemValue("custpage_sublist", "custlist_stock_id", i);
			var Mark		=	request.getLineItemValue("custpage_sublist", "custlist_mark", i);
			if(Mark=="T"){
				var InvoiceDate	=	nlapiDateToString(new Date());

				var FldUpdate	=	new Array();
				FldUpdate.push("custrecord_advs_r_h_stock_status");
				FldUpdate.push("custrecord_advs_stock_start_date");
				FldUpdate.push("custrecord_advs_stock_sent_for_status_ch");
				FldUpdate.push("custrecord_advs_stock_invoice_date");


				var FldUpdateval	=	new Array();
				FldUpdateval.push(4);
				FldUpdateval.push(InvoiceDate);
				FldUpdateval.push("T");				
				FldUpdateval.push(InvoiceDate);

				nlapiSubmitField("customrecord_advs_r_h_rental_child", Stock, FldUpdate, FldUpdateval);


				if(StockArray.indexOf(Stock)==-1){
					StockArray.push(Stock);
				}

				AllowRecord	=	"T";
			}
			VinArr.push(vin);
		}
		if(AllowRecord=="T"){
			var CreatedInvoice	=	"";
			if(StockArray.length>0){
				if(ExactEnd > TodayTime){
					 CreatedInvoice	=		PostInvoice(headerID,StockArray,MonthDiff);
				}

			}

			if(CreatedInvoice){
				var RecRent	=	nlapiLoadRecord("customrecord_advs_rental_header", headerID);
				RecRent.setFieldValue("custrecord_advs_r_h_status", 2);

				var Group	=	"recmachcustrecord_advs_r_h_invoice";
				RecRent.selectNewLineItem(Group);
				RecRent.setCurrentLineItemValue(Group, "custrecord_advs_h_i_transactions", CreatedInvoice);
				RecRent.commitLineItem(Group);

				nlapiSubmitRecord(RecRent);



				var FldUpdate	=	new Array();
				FldUpdate.push("custrecord_advs_r_h_status");		
				FldUpdate.push("custrecord_advs_r_h_return_invoice");

				var FldUpdateval	=	new Array();
				FldUpdateval.push(4);
				FldUpdateval.push(CreatedInvoice);

				nlapiSubmitField("customrecord_advs_rental_header", headerID, FldUpdate, FldUpdateval);
				for(var i=0;i<VinArr.length;i++){
				    nlapiSubmitField('customrecord_advs_vm',VinArr[i],'custrecord_advs_vm_vehicle_status',2);
				}

			}

//			var FldUpdate	=	new Array();
//			FldUpdate.push("custrecord_advs_r_h_status");
//			
//			var FldUpdateval	=	new Array();
//			FldUpdateval.push(2);
//			
//			nlapiSubmitField("customrecord_advs_rental_header", headerID, FldUpdate, FldUpdateval);
			nlapiScheduleScript("customscript_advs_scaa_stock_vehicle_sta", "customdeploy_advs_scaa_stock_vehicle_sta");


		}*/


		nlapiScheduleScript("customscript_advs_scaa_rent_change_vehic", "customdeploy_advs_scaa_rent_change_vehic");
		nlapiScheduleScript("customscript_advs_scaa_rental_return_pro", "customdeploy_advs_scaa_rental_return_pro");
		var onclickScript=" <html><body> <script type='text/javascript'>" +
		"try{" +
		"";

		onclickScript+="window.parent.location.reload();";
		onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";

		response.write(onclickScript);

	}
}

function PostInvoice(headerID,StockArr,MonthDiff) {

	var headerFld	=	new Array();
	headerFld.push("custrecord_advs_r_h_billing_cstomer");
	headerFld.push("custrecord_advs_r_h_location");
	headerFld.push("custrecord_advs_r_h_tot_amount");

	var headerREc		=	nlapiLookupField("customrecord_advs_rental_header", headerID, headerFld);
	var customer		=	headerREc.custrecord_advs_r_h_billing_cstomer;
	var Location		=	headerREc.custrecord_advs_r_h_location;
	var TotalAmount		=	headerREc.custrecord_advs_r_h_tot_amount*1;

	var InvoiceREc	=	nlapiCreateRecord("invoice");
	InvoiceREc.setFieldValue("entity", customer);
	InvoiceREc.setFieldText("customform", "ADVS Lease Invoice");
	InvoiceREc.setFieldValue("memo", "Return");
	InvoiceREc.setFieldValue("location", Location);

	var globalFld	=	new Array();
	globalFld.push("custrecord_advs_glo_set_renatkl_item");
	var GlobalREc	=	nlapiLookupField("customrecord_advs_global_setting", 1, globalFld);
	var REntalItem	=	GlobalREc.custrecord_advs_glo_set_renatkl_item;

//	var search	=	nlapiCreateSearch("customrecord_advs_r_h_rental_child", [
//	["isinactive","is","F"]
//	,"AND",
//	["custrecord_advs_r_h_header_link","anyof",headerID]
//	,"AND",
//	["internalid","anyof",StockArr]

//	], [
//	new nlobjSearchColumn("internalid", null, null),
//	new nlobjSearchColumn("custrecord_advs_r_h_vin_stk_stock", null, null),
//	new nlobjSearchColumn("custrecord_advs_stock_invoice_amount", null, null),
////	new nlobjSearchColumn("", null, null),
//	]);

//	var run		=	search.runSearch();
//	var cols	=	run.getColumns();
//	run.forEachResult(function(recp) {

//	(Invoice amount * tax) * number of previous invoicea created
//	var rate		=	recp.getValue(cols[2])*1;
//	var AppliedVin	=	recp.getValue(cols[1]);
	if(REntalItem){
		InvoiceREc.selectNewLineItem("item");
		InvoiceREc.setCurrentLineItemValue("item", "item", REntalItem);
//		InvoiceREc.setCurrentLineItemValue("item", "custcol_advs_st_applied_to_vin", AppliedVin);

		MonthDiff	=MonthDiff*1;
		var rateNew	=	(TotalAmount*0.07);
		rateNew		=	rateNew*1;
		rateNew		=	rateNew/MonthDiff;
		rateNew		=	rateNew	*1;


		InvoiceREc.setCurrentLineItemValue("item", "quantity", 1);
		InvoiceREc.setCurrentLineItemValue("item", "rate", TotalAmount);
		InvoiceREc.setCurrentLineItemValue("item", "amount", TotalAmount);

		if(rateNew>0){
			InvoiceREc.setCurrentLineItemValue("item", "taxrate1", rateNew+"%");
		}

		InvoiceREc.commitLineItem("item");
	}


//	return true;
//	});
	var InvoiceREc	=	nlapiSubmitRecord(InvoiceREc,true,true);

	return InvoiceREc;
}


function populateSublist(sublist,reqid,reqexistid,OpenInvoicesARR) {

	var FindExiststck	=	findExistId(reqexistid);

	var search	=	nlapiCreateSearch("customrecord_advs_lea_rental_child", [
	          	 	                                                         ["isinactive","is","F"]
	          	 	                                                         ,"AND",
	          	 	                                                         ["custrecord_advs_lea_header_link","anyof",reqid]
//	          	 	                                                         ,"AND",
//	          	 	                                                         ["custrecord_advs_r_h_stock_status","anyof",8]
	          	 	                                                        //  ,"AND",
	          	 	                                                        //  ["custrecord_advs_r_h_return_invoices","anyof","@NONE@"]

	          	 	                                                         ], [
	          	 	                                                             new nlobjSearchColumn("internalid", null, null),
	          	 	                                                            //  new nlobjSearchColumn("custrecord_advs_lea_vin_stk_stock", null, null),
	          	 	                                                             new nlobjSearchColumn("custrecord_advs_lea_header_link", null, null),
	          	 	                                                             new nlobjSearchColumn("custrecord_advs_lea_vin_stk_stock", null, null), 

	          	 	                                                             new nlobjSearchColumn("custrecord_advs_lea_start_mileage", null, null),
	          	 	                                                            //  new nlobjSearchColumn("custrecord_advs_m_pper_mile", "custrecord_advs_l_c_mileage_plan", null),
	          	 	                                                            //  new nlobjSearchColumn("custrecord_advs_s_tf_level", null, null),
	          	 	                                                            //  new nlobjSearchColumn("custrecord_advs_l_c_end_fuel_l", null, null),

	          	 	                                                             ]);
	var run	=	search.runSearch();
	var cols	=	run.getColumns();
	var linenum	=	1;
	run.forEachResult(function(rec){
		var Stock_interID	=	rec.getValue("internalid", null, null);
		var StartMileage	=	rec.getValue("custrecord_advs_lea_start_mileage", null, null);
		// var PerMile			=	rec.getValue("custrecord_advs_m_pper_mile", "custrecord_advs_l_c_mileage_plan", null)*1;

		// var StartFLevl	=	rec.getValue("custrecord_advs_s_tf_level", null, null);
		// var endFLvl		=	rec.getValue("custrecord_advs_l_c_end_fuel_l", null, null);
		var vinId		=	rec.getValue("custrecord_advs_lea_vin_stk_stock", null, null);

		if(tExistStck.indexOf(Stock_interID)==-1){

		}else{
			sublist.setLineItemValue("custlist_mark", linenum, "T");
		}
		sublist.setLineItemValue("custlist_stock_id", linenum, Stock_interID);
		sublist.setLineItemValue("custlist_vin_id", linenum, rec.getValue("custrecord_advs_r_h_vin_stk_stock", null, null));
		sublist.setLineItemValue("custlist_fleet", linenum, rec.getValue("custrecord_advs_r_h_rental_stock_no", null, null));
		sublist.setLineItemValue("custlist_fleet", linenum, rec.getValue("custrecord_advs_r_h_rental_stock_no", null, null));

		// sublist.setLineItemValue("custlist_fuel_level_s", linenum,StartFLevl);
		// sublist.setLineItemValue("custlist_fuel_level_e", linenum, endFLvl);


		// if(OpenInvoicesARR[Stock_interID] != undefined && OpenInvoicesARR[Stock_interID] != null){
		// 	var Amount	=	OpenInvoicesARR[Stock_interID]["Amount"];
		// 	Amount	=	Amount*1;
		// 	sublist.setLineItemValue("custlist_open_invoice", linenum, Amount);
		// }








		if(dataMilInvoiced[Stock_interID] != undefined && dataMilInvoiced[Stock_interID] != null){
			var Mil	=	dataMilInvoiced[Stock_interID]["Mil"]*1;
			Mil		=	Mil.toString();
			sublist.setLineItemValue("custlist_mainttilldate", linenum, Mil);

		}
		sublist.setLineItemValue("custlist_strtmmileage", linenum, StartMileage);
		// sublist.setLineItemValue("custlist_maintper", linenum, PerMile);

		if(dataAddonInvoiced[Stock_interID] != undefined && dataAddonInvoiced[Stock_interID] != null){
			var AddonsAmount	=	dataAddonInvoiced[Stock_interID]["Mil"]*1;

			sublist.setLineItemValue("custlist_totaddons", linenum, AddonsAmount);

		}

		var html	=	"<a href= '#' onclick='addAddons2("+Stock_interID+");'><img style='display:inline-block;vertical-allign:middle;zoom:1; height:22px; width:22px;' src='/uirefresh/img/customicon/customicon22.svg'></a>";
		sublist.setLineItemValue("custlist_add_othricon", linenum, html);


		var htmlrep	=	"" +
		"<a onclick='OpenRepaiOrder("+reqid+","+Stock_interID+","+vinId+")'>" +
		"<img href='#' src='/uirefresh/img/customicon/customicon28.svg'>" +
		"</a>";
		sublist.setLineItemValue("custlist_add_repicon", linenum, htmlrep);



		linenum++;
		return true;
	});
}

function Days_diff( date1, date2 ) {

	date1=nlapiStringToDate(date1);
	date2=nlapiStringToDate(date2);
	//Get 1 day in milliseconds
	var one_day=1000*60*60*24;

	// Convert both dates to milliseconds
	var date1_ms = date1.getTime();
	var date2_ms = date2.getTime();

	// Calculate the difference in milliseconds
	var difference_ms = date2_ms - date1_ms;
	//take out milliseconds
	difference_ms = difference_ms/1000;
	var seconds = Math.floor(difference_ms % 60);
	difference_ms = difference_ms/60; 
	var minutes = Math.floor(difference_ms % 60);
	difference_ms = difference_ms/60; 
	var hours = Math.floor(difference_ms % 24);  
	var days = Math.floor(difference_ms/24);

	return days;
}
function diff_months(dt2, dt1) 
{

	var diff =(dt2.getTime() - dt1.getTime()) / 1000;
	diff /= (60 * 60 * 24 * 7 * 4);
	return Math.abs(Math.round(diff));

}

var tExistStck	=	new Array();
var dataAddonInvoiced	=	new Array();
function findExistId(reqexist) {
	var search_p	=	nlapiCreateSearch("customrecord_advs_ret_addon_select", [
	            	 	                                                         ["isinactive","is","F"]
	            	 	                                                         ,"AND",
	            	 	                                                         ["custrecord_advs_r_a_s_head_par","anyof",reqexist]
	            	 	                                                         ], [
	            	 	                                                             new nlobjSearchColumn("internalid", null, null),
	            	 	                                                             new nlobjSearchColumn("custrecord_advs_r_a_s_stock", null, null),
	            	 	                                                             new nlobjSearchColumn("custrecord_advs_r_a_s_amnt_addons", null, null),

	            	 	                                                             ]);
	var run_p	=	search_p.runSearch();
	var cols_p	=	run_p.getColumns();
	run_p.forEachResult(function(record) {
		var Esid	=	record.getValue(cols_p[1]);
		var Amount	=	record.getValue(cols_p[2])*1;
		if(tExistStck.indexOf(Esid)==-1){
			tExistStck.push(Esid);
		}

		if(dataAddonInvoiced[Esid] != null && dataAddonInvoiced[Esid] != undefined){
			var tempAmnt	=	dataAddonInvoiced[Esid]["Mil"]*1;
			dataAddonInvoiced[Esid]["Mil"]	=	(tempAmnt+Amount);
		}else{
			dataAddonInvoiced[Esid]			=	new Array();
			dataAddonInvoiced[Esid]["Mil"]	=	Amount;
		}
		return true;
	});
}

function FetchDeposit(recid) {
// 	var NAmount	=	0;
// 	var search_p	=	nlapiCreateSearch("customrecord_advs_r_h_rental_header_depo", [
// 	            	 	                                                               ["isinactive","is","F"]
// 	            	 	                                                               ,"AND",
// 	            	 	                                                               ["custrecord_advs_r_h_rental_hdr","anyof",recid]
// 	            	 	                                                               ,"AND",
// 	            	 	                                                               ["custrecord_advs_r_h_cust_deposit","noneof","@NONE@"]
// 	            	 	                                                               ], [
// //new nlobjSearchColumn("internalid", null, null),
// new nlobjSearchColumn("custrecord32164", null, "sum"),
// ]);
// 	var run_p	=	search_p.runSearch();
// 	var cols_p	=	run_p.getColumns();
// 	run_p.forEachResult(function(record) {

// 		NAmount	=	record.getValue("custrecord32164", null, "sum")*1;
// 		return true;
// 	});
// 	return NAmount;
}

var dataMilInvoiced	=	new Array();
function returnStock(recid) {
	var invoices_f	=	nlapiCreateSearch("invoice", [
	              	 	                              ["type","anyof","CustInvc"]
	              	 	                              ,"AND",
	              	 	                              ["mainline","is","F"]
	              	 	                            //   ,"AND",
	              	 	                            //   ["custbody_advs_rental_head_link","anyof",recid]
	              	 	                            //   ,"AND",
	              	 	                              ], [
	              	 	                                  new nlobjSearchColumn("item", null, "group"),
	              	 	                                  new nlobjSearchColumn("amount", null, "sum"),
	              	 	                                //   new nlobjSearchColumn("custcol_advs_rental_child", null, "group"),

	              	 	                                  ]);
	var run_f			=	invoices_f.runSearch();
	var cols_f			=	run_f.getColumns();
	run_f.forEachResult(function(recdf) {

		var Item	=	recdf.getValue("item", null, "group");
		var Amount	=	recdf.getValue("amount", null, "sum")*1;
		// var LChild	=	recdf.getValue("custcol_advs_rental_child", null, "group");

		if(MileageMaint==Item){
			if(dataMilInvoiced[LChild] != null && dataMilInvoiced[LChild] != undefined){

			}else{
				dataMilInvoiced[LChild]			=	new Array();
				dataMilInvoiced[LChild]["Mil"]	=	Amount;
			}

		}

		return true;
	});

}
function postCredit(customer,salerep,Location,headerID,StockIDD) {
	StockIDD	=	StockIDD*1;
	StockIDD	=	StockIDD*-1;
	var creditmemo_1 = nlapiCreateRecord('creditmemo', {recordmode : 'dynamic'});
	creditmemo_1.setFieldValue('entity', customer);
	creditmemo_1.setFieldValue('tobeemailed', 'F');
	creditmemo_1.setFieldValue('trandate', nlapiDateToString(new Date()));
	creditmemo_1.setFieldValue('salesrep', salerep);
	creditmemo_1.setFieldValue('location', Location);
	creditmemo_1.setFieldValue('istaxable', 'F');

	// creditmemo_1.setFieldValue('custbody_advs_rental_head_link', headerID);
	creditmemo_1.selectNewLineItem('item');
	creditmemo_1.setCurrentLineItemValue('item', 'item',MileageMaint);
	creditmemo_1.setCurrentLineItemValue('item', 'rate', issueMEMo);
	creditmemo_1.setCurrentLineItemValue('item', 'custcol_advs_stock_no', headerID);
	// creditmemo_1.setCurrentLineItemValue('item', 'custcol_advs_rental_child', StockIDD);

	creditmemo_1.setCurrentLineItemValue('item', 'istaxable', 'F');


	creditmemo_1.commitLineItem('item');
	var credit_momo_id = nlapiSubmitRecord(creditmemo_1, true, true);

	return credit_momo_id;
}

function PostInvoice2(customer,Location,TotalAmount,headid,stockid) {



	var InvoiceREc	=	nlapiCreateRecord("invoice");
	InvoiceREc.setFieldValue("entity", customer);
	InvoiceREc.setFieldText("customform", "ADVS Lease Invoice");
	InvoiceREc.setFieldValue("memo", "Return");
	InvoiceREc.setFieldValue("location", Location);

	var globalFld	=	new Array();
	globalFld.push("custrecord_advs_glo_set_renatkl_item");
	var GlobalREc	=	nlapiLookupField("customrecord_advs_global_setting", 1, globalFld);
	var REntalItem	=	GlobalREc.custrecord_advs_glo_set_renatkl_item;

	if(REntalItem){
		InvoiceREc.selectNewLineItem("item");
		InvoiceREc.setCurrentLineItemValue("item", "item", REntalItem);


		InvoiceREc.setCurrentLineItemValue("item", "quantity", 1);
		InvoiceREc.setCurrentLineItemValue("item", "rate", TotalAmount);
		InvoiceREc.setCurrentLineItemValue("item", "amount", TotalAmount);


		InvoiceREc.commitLineItem("item");
	}


//	return true;
//	});
	var InvoiceREc	=	nlapiSubmitRecord(InvoiceREc,true,true);

	return InvoiceREc;
}

var DataArray	=	new Array();
function fetchSetup(header) {
	var search_fm	=	nlapiCreateSearch("customrecord_advs_ret_addon_select", [
	             	 	                                                         ["isinactive","is","F"]
//	             	 	                                                         ,"AND",
//	             	 	                                                         ["custrecord_advs_a_s_add_type","anyof",2]
	             	 	                                                         ,"AND",
	             	 	                                                         ["custrecord_advs_r_a_s_head_par","anyof",header]

	             	 	                                                         ], [
	             	 	                                                             new nlobjSearchColumn("internalid", null, null),
	             	 	                                                             new nlobjSearchColumn("custrecord_advs_r_a_s_addons", null, null),
	             	 	                                                             new nlobjSearchColumn("custrecord_advs_a_s_add_type", "custrecord_advs_r_a_s_addons", null),
	             	 	                                                             new nlobjSearchColumn("custrecord_advs_a_s_item", "custrecord_advs_r_a_s_addons", null),
	             	 	                                                             new nlobjSearchColumn("custrecord_advs_a_s_curr", "custrecord_advs_r_a_s_addons", null),
	             	 	                                                             new nlobjSearchColumn("custrecord_advs_r_a_s_comments", null, null),
	             	 	                                                             new nlobjSearchColumn("custrecord_advs_r_a_s_stock", null, null),
	             	 	                                                             new nlobjSearchColumn("custrecord_advs_r_a_s_amnt_addons", null, null),

	             	 	                                                             ]);

	var run_fm	=	search_fm.runSearch();
	var cols_fm	=	run_fm.getColumns();
	var count	=	0;
	run_fm.forEachResult(function(rec_fm) {
		var NameT				=	rec_fm.getValue("internalid", null, null);
		var AddTtpe				=	rec_fm.getValue("custrecord_advs_a_s_add_type", "custrecord_advs_r_a_s_addons", null);
		var Item				=	rec_fm.getValue("custrecord_advs_a_s_item", "custrecord_advs_r_a_s_addons", null);
		var Currency			=	rec_fm.getValue("custrecord_advs_a_s_curr", "custrecord_advs_r_a_s_addons", null);
		var IntID				=	rec_fm.getValue("custrecord_advs_r_a_s_addons", null, null);		
		var Comments			=	rec_fm.getValue("custrecord_advs_r_a_s_comments", null, null);
		var StckId				=	rec_fm.getValue("custrecord_advs_r_a_s_stock", null, null);
		var addedCurrency		=	rec_fm.getValue("custrecord_advs_r_a_s_amnt_addons", null, null)*1;

		if(DataArray[StckId] != null && DataArray[StckId] != undefined){
			count	=	DataArray[StckId].length;
		}else{
			count	=	0;
			DataArray[StckId]	=	new Array();

		}
		DataArray[StckId][count]				=	new Array();
		DataArray[StckId][count]["NameT"]		=	NameT;
		DataArray[StckId][count]["Item"]		=	Item;
		DataArray[StckId][count]["Currency"]	=	addedCurrency;
		DataArray[StckId][count]["Comments"]	=	Comments;



		return true;
	});
}

var dataArrayStck	=	new Array();

function findAddons(stock) {

	var search	=	nlapiCreateSearch("customrecord_advs_addons_stock_sh", [
	          	 	                                                        ["isinactive","is","F"]
	          	 	                                                        ,"AND",
	          	 	                                                        ["custrecord_advs_a_o_s_header_link.custrecord_advs_r_h_header_link","anyof",stock]
	          	 	                                                        ,"AND",
	          	 	                                                        ["custrecord_advs_a_o_st_item","noneof","@NONE@"]
//	          	 	                                                        ,"AND",
//	          	 	                                                        ["custrecord_advs_a_o_s_ad_type","anyof",1,3]

	          	 	                                                        ], [
	          	 	                                                            new nlobjSearchColumn("internalid", null,null),
	          	 	                                                            new nlobjSearchColumn("custrecord_advs_a_o_s_add_name", null,null),
	          	 	                                                            new nlobjSearchColumn("custrecord_advs_a_o_s_ad_type", null,null),
	          	 	                                                            new nlobjSearchColumn("custrecord_advs_a_o_st_item", null,null),
	          	 	                                                            new nlobjSearchColumn("custrecord_advs_a_o_s_currency", null,null),
	          	 	                                                            new nlobjSearchColumn("custrecord_advs_a_o_s_header_link", null,null),

	          	 	                                                            ]);
	var runC	=	search.runSearch();
	var colsC	=	runC.getColumns();
	var Count	=	0;
	runC.forEachResult(function(recod) {
		var St_id		=	recod.getValue(colsC[5]);
		var St_name		=	recod.getValue(colsC[1]);
		var St_item		=	recod.getValue(colsC[3]);
		var St_currency	=	recod.getValue(colsC[4])*1;

		if(dataArrayStck[St_id] != null && dataArrayStck[St_id] !=undefined){
			Count	=	dataArrayStck[St_id].length;
		}else{
			Count	=	0;
			dataArrayStck[St_id]	=	new Array();
		}

		dataArrayStck[St_id][Count]	=	new Array();
		dataArrayStck[St_id][Count]["St_item"]		=	St_item;
		dataArrayStck[St_id][Count]["St_currency"]	=	St_currency;

		return true;
	});
}

function StyleCss(){

	var style = "";

	style+="<style>" +
	".maintable{" +
	"border-collapse:collapse;width:75%;border:1px solid;" +
	"}" +
	".maintable th {" +
	"border: 1px solid #ddd;"+
	"background-color: #607799;"+ //#808080
//	"padding-top: 20px;"+
	"font-weight: bold;"+
	"text-align: left;"+
	"font-size: 15px;" +
//	"cellpadding :50;" +
	"color: white" +
	"table-layout:fixed;" +
	"padding:10px;"+
	"}" +
	".maintable td {" +
	"border-collapse:collapse;border:1px solid;" +
	"padding:5px;"+
	"}" +
	".setinputsize{" +
//	"width:100%;" +
//	"padding: 10px;" +
	"margin: 0px;" +
	"display: block;" +

	"}" +
	".labeltd{" +
	"font-weight: bold;"+
	"}" +



	"</style>" ;

	return style;

}
function openInvoicd(headerID){
// 	var tempOpInv	=	new Array();
// 	var searchL	=	nlapiCreateSearch("invoice",
// 			[
// 			 ["type","anyof","CustInvc"], 
// 			 "AND", 
// 			//  ["custbody_advs_rental_head_link","anyof",headerID], 
// 			//  "AND", 
// 			 ["mainline","is","F"], 
// 			 "AND", 
// 			 ["taxline","is","F"]
// 			 ,"AND",
// 			 ["status","noneof","CustInvc:E","CustInvc:V","CustInvc:B"]
// 			 ], 
// 			 [
// //new nlobjSearchColumn("internalid"), 
// //new nlobjSearchColumn("amountremaining"), 
// // new nlobjSearchColumn("custcol_advs_rental_child",null,"group"), 
// new nlobjSearchColumn("amount",null,"sum")
// ]
// 	);
// 	var run_i	=	searchL.runSearch();

// 	run_i.forEachResult(function(recod_i) {
// 		// var St_id			=	recod_i.getValue("custcol_advs_rental_child",null,"group");
// 		var RentAmnt		=	recod_i.getValue("amount",null,"sum");

// 		tempOpInv[St_id]	=	new Array();
// 		tempOpInv[St_id]["Amount"]	=	RentAmnt;


// 		return true;
// 	});
// 	return tempOpInv;
}
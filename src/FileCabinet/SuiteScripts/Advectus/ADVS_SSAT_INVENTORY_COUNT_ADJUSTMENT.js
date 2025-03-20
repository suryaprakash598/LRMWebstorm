/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 May 2020     Anirudh Tyagi
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

		var form				=	nlapiCreateForm("Inventory Count Adjustment Screen");

		var FieldGroup1			=	form.addFieldGroup("custpage_field1", "Details");

		var InvCountIdFld		=	form.addField("custpage_inv_count_id", "text", "Inv. Count ID", null, "custpage_field1");
		InvCountIdFld.setDisplayType("hidden");
//		InvCountIdFld.setDefaultValue(InventoryId);

		var InvCountFld			=	form.addField("custpage_inv_count_adv_id", "select", "Inv. Count ID", null, "custpage_field1");
		InvCountFld.addSelectOption("", "");
//		InvCountFld.setDisplayType("hidden");

		var InvAjdCheckFld		=	form.addField("custpage_inv_check_fld", "checkbox", "Inv Check").setDisplayType("hidden");
		InvAjdCheckFld.setDefaultValue("T");

		var TakeSearch = nlapiCreateSearch("customrecord_advs_at_annual_stock_take",
				[
				 ["isinactive","is","F"], 
				 "AND", 
				 ["custrecord_advs_annual_batch_created","is","T"], 
				 "AND", 
				 ["custrecord_advs_annual_progress_status","anyof","2"]
				 ], 
				 [
				  new nlobjSearchColumn("name").setSort(false), 
				  new nlobjSearchColumn("internalid") 				  
				  ]
		);
		var TRun	=	TakeSearch.runSearch();
		var TCol	=	TRun.getColumns();
		TRun.forEachResult(function (TRes){

			InvCountFld.addSelectOption(TRes.getValue(TCol[1]), TRes.getValue(TCol[0]));

			return true;
		});

		var CountGroupFld		=	form.addField("custpage_inv_count_grp", "multiselect", "Count Group", "customlist_advs_count_group", "custpage_field1");
		CountGroupFld.setDisplayType("inline");

		var MinCostFld			=	form.addField("custpage_inv_mini_cost", "currency", "Minimum Cost", null, "custpage_field1");
		MinCostFld.setDisplayType("inline");

		var StatusFld			=	form.addField("custpage_status", "select", "Status", "customlist_advs_at_stock_take_status", "custpage_field1");
		StatusFld.setDisplayType("inline");

		var TotalLinesFld		=	form.addField("custpage_total_lines", "integer", "Total Lines", null, "custpage_field1");
		TotalLinesFld.setDisplayType("inline");

		var ItemsCountFld		=	form.addField("custpage_items_counted", "integer", "Items Counted", null, "custpage_field1");
		ItemsCountFld.setDisplayType("inline");

		var ItemsamntCountFld		=	form.addField("custpage_items_tot_price", "currency", "Total Discrepancy Value", null, "custpage_field1");
		ItemsamntCountFld.setDisplayType("inline");

		var ItemsDiscrFld		=	form.addField("custpage_items_discrepancy", "integer", "With Discrepancy", null, "custpage_field1");
		ItemsDiscrFld.setDisplayType("hidden");

		var LocationFld			=	form.addField("custpage_location", "select", "Location", "location", "custpage_field1");
		LocationFld.setDisplayType("inline");

		var StartDateFld		=	form.addField("custpage_start_date", "date", "Start Date", null, "custpage_field1");
		StartDateFld.setDisplayType("inline");

		var CountTypeFld		=	form.addField("custpage_count_type", "select", "Count Type", "customlist_advs_at_inv_count_type", "custpage_field1");
		CountTypeFld.setDisplayType("inline");

		var SubsidiaryFld		=	form.addField("custpage_subsidiary", "select", "Subsidiary", "subsidiary", "custpage_field1");
		SubsidiaryFld.setDisplayType("inline");

		var AccountFld			=	form.addField("custpage_account", "select", "Adjustment Account", "account", "custpage_field1");
		AccountFld.setMandatory(true);				

		var InvAdjustmentFld	=	form.addField("custpage_inv_adjustment", "select", "Inventory Adjustment Link", "transaction", "custpage_field1");
		InvAdjustmentFld.setDisplayType("inline");


		if(InventoryId){

			InvCountFld.setDefaultValue(InventoryId);

			var CreateSearch	=	nlapiCreateSearch("customrecord_advs_at_annual_stock_take",
					[
					 ["isinactive", "is", "F"],
					 "AND",
					 ["custrecord_advs_annual_progress_status", "anyof", "2"],
					 "AND",
					 ["internalid", "anyof", InventoryId]
					 ],
					 [
					  new nlobjSearchColumn("internalid", null, null),
					  new nlobjSearchColumn("custrecord_advs_annual_location", null, null),
					  new nlobjSearchColumn("custrecord_advs_annual_count_group", null, null),
					  new nlobjSearchColumn("custrecord_advs_annual_min_average_price", null, null),
					  new nlobjSearchColumn("custrecord_advs_annual_count_type", null, null),
					  new nlobjSearchColumn("custrecord_advs_annual_start_date", null, null),
					  new nlobjSearchColumn("custrecord_advs_annual_progress_status", null, null),
					  new nlobjSearchColumn("custrecord_advs_annual_subsidiary", null, null)
					  ]
			);
			var CRun	=	CreateSearch.runSearch();
			var CCol	=	CRun.getColumns();
			var LocationVal		=	"",	CountGroupVal	=	"",	CountTypeVal	=	"",	StatusVal	=	"";
			var StartDateVal	=	"", SubsidiaryId	=	"", MinimumPrice	=	"";
			var InvInternalId	=	"";
			CRun.forEachResult(function (CRes){

				InvInternalId	=	CRes.getValue(CCol[0]);
				LocationVal		=	CRes.getValue(CCol[1]);
				CountGroupVal	=	CRes.getValue(CCol[2]);
				MinimumPrice	=	CRes.getValue(CCol[3]);
				CountTypeVal	=	CRes.getValue(CCol[4]);
				StartDateVal	=	CRes.getValue(CCol[5]);
				StatusVal		=	CRes.getValue(CCol[6]);
				SubsidiaryId	=	CRes.getValue(CCol[7]);
				return true;
			});


			if(InvInternalId){

				var CountGroup		=	new Array();

				if(CountGroupVal){

					CountGroup		=	CountGroupVal.split(",");
					CountGroupFld.setDefaultValue(CountGroup);
				}

				var AdjustSearch = nlapiCreateSearch("customrecord_advs_st_inv_count_adjust",
						[
						 ["custrecord_st_i_c_a_phy_batch","anyof",InvInternalId]
						 ], 
						 [
						  new nlobjSearchColumn("internalid",null,"COUNT").setSort(false), 
						  new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("CASE WHEN {custrecord_advs_st_i_c_a_inv_count_done} = 'T' THEN 1 ELSE 0 END"), 
						  new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("CASE WHEN {custrecord_st_i_c_a_n_diff} < 0  THEN 1 WHEN {custrecord_st_i_c_a_n_diff} > 0 THEN 1 ELSE 0 END")
						  ]
				);
				var ARun	=	AdjustSearch.runSearch();
				var ACol	=	ARun.getColumns();

				var TotalLinesCount	=	0, ItemLineCount	=	0, DiscLineCount	=	0;
				ARun.forEachResult(function (ARes){

					TotalLinesCount	=	ARes.getValue(ACol[0]);
					ItemLineCount	=	ARes.getValue(ACol[1]);
					DiscLineCount	=	ARes.getValue(ACol[2]);

					return true;
				});

//				TotalLinesFld.setDefaultValue(TotalLinesCount);
//				ItemsCountFld.setDefaultValue(ItemLineCount);
				ItemsDiscrFld.setDefaultValue(DiscLineCount*1);

				LocationFld.setDefaultValue(LocationVal);
				CountTypeFld.setDefaultValue(CountTypeVal);
				StartDateFld.setDefaultValue(StartDateVal);
				MinCostFld.setDefaultValue(MinimumPrice);
				StatusFld.setDefaultValue(StatusVal);
				InvCountFld.setDefaultValue(InvInternalId);
				SubsidiaryFld.setDefaultValue(SubsidiaryId);

				if(SubsidiaryId){

					var Account	=	nlapiLookupField("subsidiary", SubsidiaryId, "custrecord_advs_at_adjustment_account");

					if(Account){
						AccountFld.setDefaultValue(Account);
					}else{
						AccountFld.setDefaultValue("1438");	
					}
				}

				////getItems

				var BinDataArray	=	new Array();

				var search_ch = nlapiCreateSearch("customrecord_advs_st_inv_count_adjust",
						[
						 ["isinactive", "is", "F"],
						 "AND",
						 [
						  ["custrecord_st_i_c_a_n_diff","greaterthan","0"],
						  "OR",
						  ["custrecord_st_i_c_a_n_diff","lessthan","0"]
						  ], 
						  "AND", 
						  ["custrecord_st_i_c_a_phy_batch","anyof",InvInternalId],
						  "AND",
						  ["custrecord_st_i_c_a_phy_batch.custrecord_advs_annual_progress_status", "anyof", "2"]
						 ], 
						 [
						  new nlobjSearchColumn("custrecord_st_i_c_a_item_bin",null,"group"),
						  new nlobjSearchColumn("custrecord_st_i_c_a_item",null,"group"), 
						  ]
				);

				var CRun_ch	=	search_ch.runSearch();
				var CCol_ch	=	CRun_ch.getColumns();
				var itemsArraay	= new Array(),binArray = new Array();
				
				CRun_ch.forEachResult(function (CRes_ch){
					var ItemID	=	CRes_ch.getValue(CCol_ch[1]);
					var BinId	=	CRes_ch.getValue(CCol_ch[0]);

					if(itemsArraay.indexOf(ItemID)==-1){
						itemsArraay.push(ItemID);
					}

					if(binArray.indexOf()==-1){
						binArray.push(BinId);
					}

					return true;
				});

				if(itemsArraay.length>0){
					var search_it =	nlapiCreateSearch("inventoryitem",
							[
							 ["type","anyof","InvtPart"], 
							 "AND", 
							 ["internalid","anyof",itemsArraay], 
							 "AND", 
							 ["inventorylocation","anyof",LocationVal], 
							 "AND", 
							 ["binnumber.internalid","anyof",binArray]
							 ], 
							 [
							  new nlobjSearchColumn("internalid",null,"group"), 
							  new nlobjSearchColumn("binonhandavail",null,"sum"), 	//binonhandavail
							  new nlobjSearchColumn("internalid","binnumber","group"), 
//							  new nlobjSearchColumn("binonhandcount")
							  ]
					);
					var CRun_it	=	search_it.runSearch();
					var CCol_it	=	CRun_it.getColumns();					
					var start = 0, end = 1000,index = 1000;
					while(index == 1000){
						var rs = CRun_it.getResults(start, end);
						for(var i=0;i<rs.length;i++){
							var CRes_it = rs[i];
							var itemID		=	CRes_it.getValue(CCol_it[0]);
							var AvailQty	=	CRes_it.getValue(CCol_it[1])*1;
							var BinNumber	=	CRes_it.getValue(CCol_it[2])*1;

							if(BinDataArray[itemID] != null && BinDataArray[itemID] != undefined){
								if(BinDataArray[itemID][BinNumber] != null && BinDataArray[itemID][BinNumber] != undefined){

								}else{
									BinDataArray[itemID][BinNumber]	=	new Array();
									BinDataArray[itemID][BinNumber]["Qty"]	=	AvailQty;
								}

							}else{
								BinDataArray[itemID]			=	new Array();
								BinDataArray[itemID][BinNumber]	=	new Array();
								BinDataArray[itemID][BinNumber]["Qty"]	=	AvailQty;
							}
						}
						start = end ; end = start +1000; index = rs.length;
					}
					
/*					CRun_it.forEachResult(function (CRes_it){
						var itemID		=	CRes_it.getValue("internalid",null,"group");
						var AvailQty	=	CRes_it.getValue("binonhandavail",null,"sum")*1;
						var BinNumber	=	CRes_it.getValue("internalid","binnumber","group")*1;

						if(BinDataArray[itemID] != null && BinDataArray[itemID] != undefined){
							if(BinDataArray[itemID][BinNumber] != null && BinDataArray[itemID][BinNumber] != undefined){

							}else{
								BinDataArray[itemID][BinNumber]	=	new Array();
								BinDataArray[itemID][BinNumber]["Qty"]	=	AvailQty;
							}

						}else{
							BinDataArray[itemID]			=	new Array();
							BinDataArray[itemID][BinNumber]	=	new Array();
							BinDataArray[itemID][BinNumber]["Qty"]	=	AvailQty;
						}


						return true;
					});*/

				}



				var SublistFld		=	form.addSubList("custpage_sublist", "list", "Item List");
				SublistFld.addField("custpage_s_no", "text", "S.No.");				
				SublistFld.addField("custpage_item", "select", "Item", "item").setDisplayType("inline");
				SublistFld.addField("custpage_display_name", "text", "Display Name");
				SublistFld.addField("custpage_units", "text", "Units");
				SublistFld.addField("custpage_avail_qty", "text", "Avail. Qty");
				SublistFld.addField("custpage_bin_avail_qty", "float", "Bin Avail. Qty");
				SublistFld.addField("custpage_avail_qty_hidden", "text", "Avail. Qty").setDisplayType("hidden");
				SublistFld.addField("custpage_count_qty", "text", "Count").setDisplayType("inline");
				SublistFld.addField("custpage_disc", "text", "Discrepancy").setDisplayType("inline");
				SublistFld.addField("custpage_hidden_disc", "text", "Hidden Discrepancy").setDisplayType("hidden");
				SublistFld.addField("custpage_bin", "select", "Bin", "bin");//setDisplayType("inline");
				SublistFld.addField("custpage_binid", "text", "Binid").setDisplayType("inline");				


				var AdjFld	=	SublistFld.addField("custpage_disc_hidden", "text", "Adj. Qty").setDisplayType("entry");

				if(CountTypeVal == 2 || CountTypeVal == "2"){

					SublistFld.addField("custpage_pref_bin_qty", "text", "Preferred Bin Qty").setDisplayType("disabled");
					SublistFld.addField("custpage_pref_bin_qty_hidden", "text", "Preferred Bin Qty").setDisplayType("hidden");
					SublistFld.addField("custpage_inline_html_text", "text", "Remarks").setDisplayType("inline");
				}

				SublistFld.addField("custpage_adjust_price", "currency", "Actual Unit Cost").setDisplayType("inline");
				SublistFld.addField("custpage_anualcost", "currency", "Annual Unit Cost").setDisplayType("hidden");

				SublistFld.addField("custpage_inv_adjust", "select", "Physical Stock Take", "customrecord_advs_st_inv_count_adjust").setDisplayType("hidden");

				var CreateSearch = nlapiCreateSearch("customrecord_advs_st_inv_count_adjust",
						[
						 ["isinactive", "is", "F"],
						 "AND",
						 [
						  ["custrecord_st_i_c_a_n_diff","greaterthan","0"],
						  "OR",
						  ["custrecord_st_i_c_a_n_diff","lessthan","0"]
						  ], 
						  "AND", 
						  ["custrecord_st_i_c_a_phy_batch","anyof",InvInternalId],
						  "AND",
						  ["custrecord_st_i_c_a_phy_batch.custrecord_advs_annual_progress_status", "anyof", "2"]
						 ], 
						 [
						  new nlobjSearchColumn("custrecord_st_i_c_a_item_bin"),
						  new nlobjSearchColumn("custrecord_st_i_c_a_item"), 
						  new nlobjSearchColumn("custrecord_st_i_c_a_display_name"),
						  new nlobjSearchColumn("custrecord_st_i_c_a_unit_type"),
						  new nlobjSearchColumn("custrecord_st_i_c_a_bin_on_hand_avail"), 
						  new nlobjSearchColumn("custrecord_st_i_c_a_location"), 
						  new nlobjSearchColumn("custrecord_st_i_c_a_sugg_unit_cost"),
						  new nlobjSearchColumn("internalid").setSort(),
						  new nlobjSearchColumn("custrecord_st_i_c_a_take_1"),						   
						  new nlobjSearchColumn("custrecord_st_i_c_a_n_diff"),
						  new nlobjSearchColumn("custrecord_st_i_c_a_pref_bin_qty"),
						  new nlobjSearchColumn("custrecord_st_i_c_a_actual_unit_cost")//11


						  ]
				);

				var Count	=	0
				var CRun	=	CreateSearch.runSearch();
				var CCol	=	CRun.getColumns();
				var AmountLine	=	0;
				CRun.forEachResult(function (CRes){
					Count++;

					var Bin				=	CRes.getValue(CCol[0]);
					var Item			=	CRes.getValue(CCol[1]);
					var DisplayName		=	CRes.getValue(CCol[2]);
					var UnitType		=	CRes.getValue(CCol[3]);
					var AvailQty		=	CRes.getValue(CCol[4]);
					var AdjPrice		=	CRes.getValue(CCol[6]);
					AdjPrice			=	AdjPrice*1;
					var PhyRecId		=	CRes.getValue(CCol[7]);
					var CountLine		=	CRes.getValue(CCol[8]);
//					CountLine			=	CountLine*1;
					var DiscLine		=	CRes.getValue(CCol[9]);
//					DiscLine			=	DiscLine*1;
					var PrefBinQty		=	CRes.getValue(CCol[10]);
					var actualUnitCost	=	CRes.getValue(CCol[11])*1;


					AdjPrice	=	actualUnitCost;

					SublistFld.setLineItemValue("custpage_bin", 			Count, Bin);
					SublistFld.setLineItemValue("custpage_binid", 			Count, Bin);


					SublistFld.setLineItemValue("custpage_s_no", 			Count, Count*1);
					SublistFld.setLineItemValue("custpage_adjust_price", 	Count, AdjPrice);
					SublistFld.setLineItemValue("custpage_item", 			Count, Item);
					SublistFld.setLineItemValue("custpage_display_name", 	Count, DisplayName);
					SublistFld.setLineItemValue("custpage_units", 			Count, UnitType);
					SublistFld.setLineItemValue("custpage_avail_qty", 		Count, AvailQty);
					SublistFld.setLineItemValue("custpage_avail_qty_hidden",Count, AvailQty);
					SublistFld.setLineItemValue("custpage_anualcost",		Count, actualUnitCost)

					if(CountLine){
						SublistFld.setLineItemValue("custpage_count_qty",Count, CountLine);	
					}

					if(DiscLine){
						SublistFld.setLineItemValue("custpage_disc",Count, DiscLine);
						SublistFld.setLineItemValue("custpage_hidden_disc",Count, DiscLine);						
						SublistFld.setLineItemValue("custpage_disc_hidden",Count, DiscLine);	
					}

					if(CountTypeVal == 2 || CountTypeVal == "2"){
						SublistFld.setLineItemValue("custpage_pref_bin_qty", 			Count, PrefBinQty);
						SublistFld.setLineItemValue("custpage_pref_bin_qty_hidden", 	Count, PrefBinQty);

						if((DiscLine*(-1)) > PrefBinQty){
							SublistFld.setLineItemValue("custpage_inline_html_text", 	Count, "<span style='color:blue;font-weight:bold'>Please Adjust the Quantity in Adj. Qty field. Preferred Bin have only upto Quantity "+PrefBinQty+".</span>");
						}

					}

					SublistFld.setLineItemValue("custpage_inv_adjust", 		Count, PhyRecId);

					var QtyAvail	=	0;
					if(BinDataArray[Item] != null && BinDataArray[Item] != undefined){
						if(BinDataArray[Item][Bin] != null && BinDataArray[Item][Bin] != undefined){
							QtyAvail	=	BinDataArray[Item][Bin]["Qty"]*1;

						}
					}
					QtyAvail	=	QtyAvail*1;
					SublistFld.setLineItemValue("custpage_bin_avail_qty", 		Count, QtyAvail);

					AmountLine+=AdjPrice;
					return true;
				});	


				var search_c	=	nlapiCreateSearch("customrecord_advs_st_inv_count_adjust",
						[
						 ["isinactive","is","F"], 
						 "AND", 
						 ["custrecord_st_i_c_a_item","noneof","@NONE@"]
						 ,"AND",
						 ["custrecord_st_i_c_a_phy_batch","anyof",InventoryId]
						 ], 
						 [
						  new nlobjSearchColumn("custitem_advs_st_vehicle_make","CUSTRECORD_ST_I_C_A_ITEM","GROUP").setSort(false), 
						  new nlobjSearchColumn("custrecord_st_i_c_a_bin_on_hand_avail",null,"SUM"), 
						  new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("ROUND({custrecord_st_i_c_a_bin_on_hand_avail}*{custrecord_st_i_c_a_actual_unit_cost},2)"), 
						  new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("case when {custrecord_st_i_c_a_rough_sheet} = 'T' then 0 else 1 end"), 
						  new nlobjSearchColumn("custrecord_st_i_c_a_take_1",null,"SUM"), 
						  new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("ROUND({custrecord_st_i_c_a_take_1}*{custrecord_st_i_c_a_actual_unit_cost},2)"), 
						  new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("case when {custrecord_st_i_c_a_take_1} is not NULL then 1else 0 end"), 
						  new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("ROUND({custrecord_st_i_c_a_take_1}*{custrecord_st_i_c_a_actual_unit_cost},2)-ROUND({custrecord_st_i_c_a_bin_on_hand_avail}*{custrecord_st_i_c_a_actual_unit_cost},2)")
						  ]
				);
				var run_c	=	search_c.runSearch();
				var cols_c	=	run_c.getColumns();
				var beforeCountLi	=	0;var afterCountLi	=	0;var Difference	=	0;
				run_c.forEachResult(function(rec_c){
					beforeCountLi	+=	rec_c.getValue(cols_c[3])*1;
					afterCountLi	+=	rec_c.getValue(cols_c[6])*1;
					Difference	+=	rec_c.getValue(cols_c[7])*1;

					return true;
				});

				TotalLinesFld.setDefaultValue(beforeCountLi);
				ItemsCountFld.setDefaultValue(afterCountLi);
				ItemsamntCountFld.setDefaultValue(Difference);
				ItemsDiscrFld.setDefaultValue(Count);

				if(Count > 0)
					form.addSubmitButton("CONFIRM");
				form.addButton("custpage_void_cycle", "VOID", "VoidCycle("+InvInternalId+")");
				form.addButton("custpage_cancel_count", "CANCEL", "cancelCycle("+InvInternalId+")");
				form.addButton("custpage_export_count", "Export", "exportData("+InvInternalId+")");
			}		
		}

		form.setScript('customscript_advs_csat_annual_stock');
		response.writePage(form);
	}else{

		var InvForm			=	nlapiGetContext().getSetting("SCRIPT", "custscript_advs_at_inv_adj_form");

		var Subsidiary		=	request.getParameter("custpage_subsidiary");
		var AccountNo		=	request.getParameter("custpage_account");
		var Location		=	request.getParameter("custpage_location");
		var InventoryCId	=	request.getParameter("custpage_inv_count_adv_id");



		var SublistName		=	"custpage_sublist";

		var LineCount		=	request.getLineItemCount(SublistName);

		var RecordObj		=	nlapiCreateRecord("inventoryadjustment", {recordmode:"dynamic"});
		RecordObj.setFieldValue("customform", InvForm);
		RecordObj.setFieldValue("subsidiary", Subsidiary);
		RecordObj.setFieldValue("account", AccountNo);
		RecordObj.setFieldValue("adjlocation", Location);
		RecordObj.setFieldValue("custbody_advs_at_inv_count", InventoryCId);		

		var AdjLineCount	=	0;
		for(var i=1; i<=LineCount; i++){

			var ItemLink	=	request.getLineItemValue(SublistName, "custpage_item", i);
			var Bin			=	request.getLineItemValue(SublistName, "custpage_bin", i);
			var AdjQty		=	request.getLineItemValue(SublistName, "custpage_disc_hidden", i);
			AdjQty			=	AdjQty*1;
			var EstCost		=	request.getLineItemValue(SublistName, "custpage_adjust_price", i);
			var Anualcost	=	request.getLineItemValue(SublistName, "custpage_anualcost", i);

			EstCost			=	EstCost*1;
			Anualcost       =   Anualcost*1;
			if(AdjQty != 0){

				RecordObj.selectNewLineItem('inventory');	              	  
				RecordObj.setCurrentLineItemValue('inventory', 'item', ItemLink);
				RecordObj.setCurrentLineItemValue('inventory', 'adjustqtyby', AdjQty);
				RecordObj.setCurrentLineItemValue('inventory', 'location', Location);

				nlapiLogExecution('ERROR','ItemLink',ItemLink+'-Location-'+Location+'-AdjQty-'+AdjQty+'-Bin-'+Bin);

				if(AdjQty > 0){
					RecordObj.setCurrentLineItemValue('inventory', 'unitcost', EstCost);
				}

				var bodySubRecord	=	RecordObj.editCurrentLineItemSubrecord('inventory', 'inventorydetail');

				if(bodySubRecord	==	'' || bodySubRecord	==	null || bodySubRecord	==	undefined){

					bodySubRecord	=	RecordObj.createCurrentLineItemSubrecord('inventory', 'inventorydetail');
					bodySubRecord.selectNewLineItem('inventoryassignment');

					if(AdjQty <= 0 ){
						nlapiLogExecution('ERROR','Inside','Inside')
						bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'binnumber', Bin);
						bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'quantity', AdjQty);
					}else{
						nlapiLogExecution('ERROR','else','Inside@@else')

						bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'binnumber', Bin);
						bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'quantity', AdjQty);
						bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'unitcost', Anualcost);

					}

					bodySubRecord.commitLineItem('inventoryassignment');
					bodySubRecord.commit();
				}

				RecordObj.commitLineItem('inventory', false);

				AdjLineCount++;
			}

		}

		if(AdjLineCount > 0){

			var InvAdjustment	=	nlapiSubmitRecord(RecordObj, true, true);

			if(InvAdjustment){

				var Fields	=	new Array();
				Fields.push("custrecord_advs_annual_inventory_adjust");
				Fields.push("custrecord_advs_annual_progress_status");
				Fields.push("custrecord_advs_annual_stock_status");	

				var Values	=	new Array();
				Values.push(InvAdjustment);
				Values.push("8");
				Values.push("2");

				nlapiSubmitField("customrecord_advs_at_annual_stock_take", InventoryCId, Fields, Values);
			}				
		}	
		nlapiSetRedirectURL("RECORD", "customrecord_advs_at_annual_stock_take", InventoryCId, null, null);
	}

}
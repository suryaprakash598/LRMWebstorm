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
		var PageId				=	request.getParameter("custparam_page");		
		var form				=	nlapiCreateForm("Inventory Count Recording Screen");		
		var FieldGroup1			=	form.addFieldGroup("custpage_field1", "Cycle Count Details");
		var InvCountIdFld		=	form.addField("custpage_inv_count_id", "text", "Inv. Count ID", null, "custpage_field1");
		InvCountIdFld.setDisplayType("hidden");

		var InvCountFld			=	form.addField("custpage_inv_count", "select", "Inv. Count ID", null, "custpage_field1");
		InvCountFld.addSelectOption("", "");

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

		var PageFld	= form.addField("custpage_inv_count_page", "integer", "Page", null, "custpage_field1");
		PageFld.setDefaultValue(PageId);

		var CountGroupFld =	form.addField("custpage_inv_count_grp", "multiselect", "Count Group", "customlist_advs_count_group", "custpage_field1");
		CountGroupFld.setDisplayType("inline");

		var LocationFld = form.addField("custpage_location", "select", "Location", "location", "custpage_field1");
		LocationFld.setDisplayType("inline");

		var StartDateFld = form.addField("custpage_start_date", "date", "Start Date", null, "custpage_field1");
		StartDateFld.setDisplayType("inline");

		var CountTypeFld = form.addField("custpage_count_type", "select", "Count Type", "customlist_advs_at_inv_count_type", "custpage_field1");
		CountTypeFld.setDisplayType("inline");

		var StatusFld =	form.addField("custpage_status_select", "select", "Status", "customlist_advs_at_stock_take_status", "custpage_field1");
		StatusFld.setDisplayType("inline");

		if(InventoryId)
			InvCountFld.setDefaultValue(InventoryId);

		if(InventoryId && PageId){
			PageId				=	PageId*1;			
			var CurrentRec		=	nlapiCreateRecord("customrecord_advs_st_current_date_time", {recordmode:"dynamic"});
			var CurrentDate		=	CurrentRec.getFieldValue("custrecord_st_current_date");			
			var User			=	nlapiGetUser();			

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
							new nlobjSearchColumn("custrecord_advs_annual_progress_status", null, null)
							]
			);
			var CRun	=	CreateSearch.runSearch();
			var CCol	=	CRun.getColumns();
			var LocationVal		=	"",	CountGroupVal	=	"",	CountTypeVal	=	"",	StatusVal	=	"";
			var StartDateVal	=	"";
			var InvInternalId	=	"";
			CRun.forEachResult(function (CRes){				
				InvInternalId	=	CRes.getValue(CCol[0]);
				LocationVal		=	CRes.getValue(CCol[1]);
				CountGroupVal	=	CRes.getValue(CCol[2]);
				CountTypeVal	=	CRes.getValue(CCol[4]);
				StartDateVal	=	CRes.getValue(CCol[5]);
				StatusVal		=	CRes.getValue(CCol[6]);
				return true;
			});

			var FieldGroup2	= form.addFieldGroup("custpage_field2", "Count Details");
			form.addField("custpage_count_date_select", "date", "Count Date", null, "custpage_field2").setDisplayType("inline").setDefaultValue(CurrentDate);
			form.addField("custpage_count_by_select", "select", "Count By", "employee", "custpage_field2").setDisplayType("entry").setMandatory(true).setDefaultValue(User);
			form.addField("custpage_assist_by", "select", "Assist By", "employee", "custpage_field2").setDisplayType("entry").setMandatory(true).setDefaultValue(User);

			var SublistFld = form.addSubList("custpage_sublist", "list", "Item List", "custpage_field2");
			SublistFld.addField("custpage_s_no", "text", "Line #.");
			var BinFld = SublistFld.addField("custpage_bin", "select", "Bin", "bin").setDisplayType("inline");
			var ItemFld = SublistFld.addField("custpage_item", "select", "Item", "item").setDisplayType("inline");
			SublistFld.addField("custpage_display_name", "text", "Display Name");
			SublistFld.addField("custpage_units", "text", "Units");
			SublistFld.addField("custpage_avail_qty", "text", "Avail. Qty").setDisplayType("hidden");
			SublistFld.addField("custpage_avail_qty_hidden", "text", "Avail. Qty").setDisplayType("hidden");
			SublistFld.addField("custpage_count_qty", "text", "Count").setDisplayType("entry");			
			SublistFld.addField("custpage_inv_adjust", "select", "Physical Stock Take", "customrecord_advs_st_inv_count_adjust").setDisplayType("hidden");
			SublistFld.addField("custpage_inv_count_notes", "textarea", "Notes").setDisplayType("entry");
			SublistFld.addField("custpage_countdate", "date", "Count Date", null).setDisplayType("inline");
			SublistFld.addField("custpage_countby", "select", "Count By", "employee").setDisplayType("inline");
			SublistFld.addField("custpage_status", "select", "Status","customlist_advs_inv_count_stock_status").setDisplayType("entry");
			SublistFld.addField("custpage_status_hidden", "select", "Status Hidden","customlist_advs_inv_count_stock_status").setDisplayType("hidden");
			SublistFld.addField("custpage_disc", "text", "Disc").setDisplayType("hidden");
			SublistFld.addField("custpage_disc_hidden", "text", "Hidden Disc").setDisplayType("hidden");
			if(InvInternalId){				
				LocationFld.setDefaultValue(LocationVal);
				CountTypeFld.setDefaultValue(CountTypeVal);
				StartDateFld.setDefaultValue(StartDateVal);
				StatusFld.setDefaultValue(StatusVal);
				InvCountFld.setDefaultValue(InvInternalId);

				var CreateSearch = nlapiCreateSearch("customrecord_advs_st_inv_count_adjust",
						[
							["isinactive", "is", "F"],
							"AND",
							["custrecord_st_i_c_a_page_no","equalto",PageId], 
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
//								new nlobjSearchColumn("displayname","custrecord_st_i_c_a_item"),
//								new nlobjSearchColumn("stockunit","custrecord_st_i_c_a_item"),
								new nlobjSearchColumn("custrecord_st_i_c_a_bin_on_hand_avail"), 
								new nlobjSearchColumn("custrecord_st_i_c_a_location"), 
								new nlobjSearchColumn("custrecord_st_i_c_a_sugg_unit_cost"),
								new nlobjSearchColumn("internalid").setSort(),
								new nlobjSearchColumn("custrecord_st_i_c_a_take_1"),						   
								new nlobjSearchColumn("custrecord_st_i_c_a_n_diff"),
								new nlobjSearchColumn("custrecord_st_i_c_a_count_date"),
								new nlobjSearchColumn("custrecord_st_i_c_a_employee"),
								new nlobjSearchColumn("custrecord_st_i_c_a_notes"),
								new nlobjSearchColumn("custrecord_st_i_c_a_count_group"),
								new nlobjSearchColumn("custrecord_st_i_c_a_line_number"),
								new nlobjSearchColumn("custrecord_st_i_c_a_stock_status"),
								]
				);

				var Count	=	0,BlankLines = 0;
				var CRun	=	CreateSearch.runSearch();
				var CCol	=	CRun.getColumns();
				CRun.forEachResult(function (CRes){
					Count++;					
					var Bin				=	CRes.getValue(CCol[0]);
					var Item			=	CRes.getValue(CCol[1]);
					var DisplayName		=	CRes.getValue(CCol[2]);
					var UnitType		=	CRes.getValue(CCol[3]);
					var AvailQty		=	CRes.getValue(CCol[4]);
					var PhyRecId		=	CRes.getValue(CCol[7]);
					var CountLine		=	CRes.getValue(CCol[8]);
					var DiscLine		=	CRes.getValue(CCol[9]);
					var CountDate		=	CRes.getValue(CCol[10]);
					var CountBy			=	CRes.getValue(CCol[11]);
					var Notes			=	CRes.getValue(CCol[12]);								
					var CountGroup		=	CRes.getValue(CCol[13]);
					var LineNumber		=	CRes.getValue('custrecord_st_i_c_a_line_number')*1;
					var StockStatus		=	CRes.getValue('custrecord_st_i_c_a_stock_status');
//					StockStatus = StockStatus.toFixed(0);
					CountGroupFld.setDefaultValue(CountGroup);

					SublistFld.setLineItemValue("custpage_s_no",Count, LineNumber.toFixed(0));
					SublistFld.setLineItemValue("custpage_bin",Count, Bin);
					if(!Bin){
						BlankLines++;
					}
					SublistFld.setLineItemValue("custpage_item",Count, Item);
					SublistFld.setLineItemValue("custpage_display_name",Count, nlapiEscapeXML(DisplayName));
					SublistFld.setLineItemValue("custpage_units",Count, UnitType);
					SublistFld.setLineItemValue("custpage_avail_qty",Count, AvailQty);
					SublistFld.setLineItemValue("custpage_avail_qty_hidden",Count, AvailQty);

					if(CountLine){
						SublistFld.setLineItemValue("custpage_count_qty",Count, CountLine);	
					}

					if(DiscLine){
						SublistFld.setLineItemValue("custpage_disc",Count, DiscLine);
						SublistFld.setLineItemValue("custpage_disc_hidden",Count, DiscLine);	
					}

					if(Notes){
						SublistFld.setLineItemValue("custpage_inv_count_notes",Count, nlapiEscapeXML(Notes));
					}

					if(CountDate){
						SublistFld.setLineItemValue("custpage_countdate",Count, CountDate);
					}

					if(CountBy){
						SublistFld.setLineItemValue("custpage_countby",Count, CountBy);	
					}
					if(StockStatus){
						SublistFld.setLineItemValue("custpage_status",Count,StockStatus);					
						SublistFld.setLineItemValue("custpage_status_hidden",Count,StockStatus);
					}
					SublistFld.setLineItemValue("custpage_inv_adjust",Count, PhyRecId);					
					return true;
				});

				if((Count > 0)){
					form.addSubmitButton("Submit");
				}
				if(BlankLines > 0){
					form.addButton('custpage_insert_item','Add Item',"insertItem('"+PageId+"','"+InventoryId+"','"+LocationVal+"')");
				}
			}	
		}

		form.setScript('customscript_advs_csat_annual_stock');
		response.writePage(form);
	}else{

		var InternalId	=	request.getParameter('custpage_inv_count');		
		var CountDate	=	request.getParameter('custpage_count_date_select');
		var CountBy		=	request.getParameter('custpage_count_by_select');
		var LineCount	=	request.getLineItemCount('custpage_sublist');
		var SublistName	=	"custpage_sublist";

		var fields = [];
		var values = [];
		for(var j=1; j<=LineCount; 	j++){				
			var SublistLineId =	request.getLineItemValue(SublistName, "custpage_inv_adjust", j);
			var CountQty = request.getLineItemValue(SublistName, "custpage_count_qty", j);
			var AvailQty = request.getLineItemValue(SublistName, "custpage_avail_qty", j);
			var HideDiscQty = request.getLineItemValue(SublistName, "custpage_disc", j);
			var DiscQty	= (CountQty*1)-(AvailQty*1);
			var Notes =	request.getLineItemValue(SublistName, "custpage_inv_count_notes", j);
			var ItemId = request.getLineItemValue(SublistName, "custpage_item", j);
			var Status = request.getLineItemValue(SublistName, "custpage_status", j);
			if((SublistLineId*1)&&(ItemId)&&(CountQty)){
				nlapiLogExecution('ERROR','CountQty',CountQty+'@DiscQty@'+DiscQty+'@CountDate@'+CountDate+'@CountBy@'+CountBy+'@Notes@'+Notes);
				fields.push('custrecord_st_i_c_a_take_1');
				values.push(CountQty);
				fields.push('custrecord_st_i_c_a_n_diff');
				values.push(DiscQty);
				fields.push('custrecord_advs_st_i_c_a_inv_count_done');
				values.push('T');
				if(DiscQty == 0){
					fields.push('custrecord_st_i_c_a_stock_status');
					values.push("1");
				}else if((DiscQty != 0)&&(DiscQty)&&(CountQty)){
					fields.push('custrecord_st_i_c_a_stock_status');
					values.push("2");
				}
				if(CountDate){
					fields.push('custrecord_st_i_c_a_count_date');
					values.push(CountDate);
				}
				if(CountBy){
					fields.push('custrecord_st_i_c_a_employee');
					values.push(CountBy);
				}
				if(Notes){
					fields.push('custrecord_st_i_c_a_notes');
					values.push(Notes);
				}else{
					fields.push('custrecord_st_i_c_a_notes');
					values.push("");
				}
				nlapiSubmitField('customrecord_advs_st_inv_count_adjust',SublistLineId,fields,values);
				
				Notes	=	"";
				CountBy	=	"";
			}
		}
		nlapiSetRedirectURL("RECORD", "customrecord_advs_at_annual_stock_take", InternalId, null, null);
	}

}
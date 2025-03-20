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

	var InventoryId			=	request.getParameter("custparam_inv_id");
	var CountType			=	request.getParameter("custparam_count_type");
	var PageId				=	request.getParameter("custparam_page");
	var PrintAll			=	request.getParameter("custparam_print_all");
	PageId					=	PageId*1;

	var Html				=	"";
	var HtmlHeader			=	"";

	if(PrintAll == "T"){

		var takeSearch = nlapiCreateSearch("customrecord_advs_at_annual_stock_take",
				[
				 ["isinactive","is","F"],
				 "AND",
				 ["internalid", "anyof", InventoryId]
				 ], 
				 [			   
				  new nlobjSearchColumn("name"),
				  new nlobjSearchColumn("namenohierarchy","CUSTRECORD_ADVS_ANNUAL_LOCATION",null), 			     
				  new nlobjSearchColumn("custrecord_advs_annual_count_group"), 
				  new nlobjSearchColumn("custrecord_advs_annual_start_date"), 			    
				  new nlobjSearchColumn("custrecord_advs_annual_page_count"),
				  new nlobjSearchColumn("custrecord_advs_annual_count_type"),
				  new nlobjSearchColumn("namenohierarchy","custrecord_advs_annual_subsidiary",null),
				  ]
		);
		var tRun	=	takeSearch.runSearch();
		var tCol	=	tRun.getColumns();

		var InvCountName	=	"",	InvCountLocation	=	"",	InvCountGroup	=	"",	InvCountPage	=	"",	InvCountDate	=	"";
		var InvCountType	=	"";
		var InvCountGroupId	=	"",InvSubsidiary = "";
		tRun.forEachResult(function (tRes){

			InvCountName		=	tRes.getValue("name");
			InvCountLocation	=	tRes.getValue("namenohierarchy","CUSTRECORD_ADVS_ANNUAL_LOCATION",null);
			InvCountGroup		=	tRes.getText("custrecord_advs_annual_count_group");
			InvCountGroupId		=	tRes.getValue("custrecord_advs_annual_count_group");
			InvCountDate		=	tRes.getValue("custrecord_advs_annual_start_date");
			InvCountPage		=	tRes.getValue("custrecord_advs_annual_page_count");
			InvCountType		=	tRes.getText("custrecord_advs_annual_count_type");
			InvSubsidiary	=	tRes.getValue("namenohierarchy","custrecord_advs_annual_subsidiary",null);
			return true;
		});

		var AdjustSearch = nlapiCreateSearch("customrecord_advs_st_inv_count_adjust",
				[
				 ["custrecord_st_i_c_a_phy_batch","anyof",InventoryId],
				 "AND",
				 ["custrecord_st_i_c_a_count_group","noneof","@NONE@"]
				 ], 
				 [
				  new nlobjSearchColumn("custrecord_st_i_c_a_count_group", null, "GROUP")
				  ]
		);
		var ARun	=	AdjustSearch.runSearch();
		var ACol	=	ARun.getColumns();

		var ArrayGroupCountId	=	[], 	ArrayGroupCountName	=	[];
		ARun.forEachResult(function (ARes){
			if(ARes.getValue(ACol[0])){
				ArrayGroupCountId.push(ARes.getValue(ACol[0]));
				ArrayGroupCountName.push(ARes.getText(ACol[0]));	
			}
			return true;
		});

		if(ArrayGroupCountId.length > 0){

//			for(var S=0; S<ArrayGroupCountId.length; S++){

				Html+=prepareHeader(InvCountLocation, InvCountType, InvCountName, InvCountDate, ArrayGroupCountName,InvSubsidiary);

				if(CountType == "1" || CountType == 1){

					Html+="" ;
					Html+="<table width='100%'>" ;
					var AdjustSearch = nlapiCreateSearch("customrecord_advs_st_inv_count_adjust",
							[
							 ["custrecord_st_i_c_a_phy_batch","anyof",InventoryId],
							 "AND",
							 ["isinactive","is","F"]
/*							 [["custrecord_st_i_c_a_count_group", "anyof", ArrayGroupCountId[S]],
								 "OR",
								 ["custrecord_st_i_c_a_count_group", "anyof", "@NONE@"]]*/
							 ], 
							 [
							  new nlobjSearchColumn("custrecord_st_i_c_a_item_bin"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_item"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_display_name"), 
//							  new nlobjSearchColumn("custrecord_st_i_c_a_unit_type"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_bin_on_hand_avail"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_take_1"),
//							  new nlobjSearchColumn("custrecord_st_i_c_a_notes"),
							  new nlobjSearchColumn("custrecord_st_i_c_a_line_number").setSort(false),
							  new nlobjSearchColumn("custrecord_st_i_c_a_page_no"),
//							  new nlobjSearchColumn("custrecord_st_i_c_a_stock_status")
							  ]
					);
					var ARun	=	AdjustSearch.runSearch();
					var ACol	=	ARun.getColumns();
					var J=0;
					var IndexMain = 1000,StartMainIndex = 0,EndMainIndex = 1000;
					while(IndexMain == 1000){
						var Result = ARun.getResults(StartMainIndex, EndMainIndex);
						for(var i=0;i<Result.length;i++){
							var ARes = Result[i];
							if(J == 0){
								Html+=prepareSubHeading();
							}

							if(J%35 == 0 && J!= 0){
								Html+="</table>";

								Html+="<pbr/>";
								Html+=prepareHeader(InvCountLocation, InvCountType, InvCountName, InvCountDate, ArrayGroupCountName,InvSubsidiary);
//								Html+=prepareSubHeading();
								Html+="<table width='100%' font-size = '9px'>";
								Html+=prepareSubHeading();
							}
							var Diff = (ARes.getValue('custrecord_st_i_c_a_bin_on_hand_avail')*1)-(ARes.getValue('custrecord_st_i_c_a_take_1')*1);
							var ItemId = ARes.getValue('custrecord_st_i_c_a_item');
							if((Diff == 0)&&(ItemId)){
								Html+="<tr border-bottom='1' font-size = '10px'>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_page_no'))+"</td>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_line_number'))+"</td>";
								Html+="<td align='left' ></td>" +
								"<td align='left'></td>" +
								"<td align='left'></td>" +
								"<td align='center'></td>" +
								"<td align='center' colspan='2'></td>" +
								"</tr>";
							}else{
								
								Html+="<tr border-bottom='1' font-size = '10px'>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_page_no'))+"</td>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_line_number'))+"</td>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getText('custrecord_st_i_c_a_item_bin'))+"</td>" +
								"<td align='left'>"+nlapiEscapeXML(ARes.getText('custrecord_st_i_c_a_item'))+"</td>" +
								"<td align='left'>"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_display_name'))+"</td>" +
//								"<td align='center'>"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_unit_type'))+"</td>" +
//								"<td align='center'>"+nlapiEscapeXML(ARes.getValue(ACol[4]))+"</td>" +
//								"<td align='center'></td>" +
								"<td align='center'></td>" +
								"<td align='center' colspan='2'></td>" +
								"</tr>";
							}

							J++;						
						}
						IndexMain = Result.length;
						StartMainIndex = EndMainIndex;
						EndMainIndex = StartMainIndex + 1000;
					}
					Html+="</table>";
				}else if(CountType == "2" || CountType == 2){
					Html+="" ;
					Html+="<table width='100%'>" ;
					var AdjustSearch = nlapiCreateSearch("customrecord_advs_st_inv_count_adjust",
							[
							 ["custrecord_st_i_c_a_phy_batch","anyof",InventoryId],
							 "AND",
							 ["isinactive","is","F"]
/*							 [["custrecord_st_i_c_a_count_group", "anyof", ArrayGroupCountId[S]],
								 "OR",
								 ["custrecord_st_i_c_a_count_group", "anyof", "@NONE@"]]*/
							 ], 
							 [
							  new nlobjSearchColumn("custrecord_st_i_c_a_item_bin"), 
//							  new nlobjSearchColumn("custrecord_st_i_c_a_alternate_bins"),
							  new nlobjSearchColumn("custrecord_st_i_c_a_item"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_display_name"), 
//							  new nlobjSearchColumn("custrecord_st_i_c_a_unit_type"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_bin_on_hand_avail"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_take_1"), 
//							  new nlobjSearchColumn("custrecord_st_i_c_a_notes"),
							  new nlobjSearchColumn("custrecord_st_i_c_a_line_number").setSort(false),
							  new nlobjSearchColumn("custrecord_st_i_c_a_page_no"),
//							  new nlobjSearchColumn("custrecord_st_i_c_a_stock_status")
							  ]
					);
					var ARun = AdjustSearch.runSearch();
					var ACol = ARun.getColumns();
					var J=0;
					var Index = 1000,StartIndex = 0,EndIndex = 1000;
					while(Index == 1000){
						var Result = ARun.getResults(StartIndex, EndIndex);
						for(var i=0;i<Result.length;i++){
							var ARes = Result[i];
							if(J == 0){
								Html+=prepareSubHeading();
							}

							if(J%35 == 0 && J!= 0){
								Html+="</table>";

								Html+="<pbr/>";
								Html+=prepareHeader(InvCountLocation, InvCountType, InvCountName, InvCountDate, ArrayGroupCountName,InvSubsidiary);
//								Html+=prepareSubHeading();
								Html+="<table width='100%' font-size = '9px'>";
								Html+=prepareSubHeading();

							}
							var Diff = (ARes.getValue('custrecord_st_i_c_a_bin_on_hand_avail')*1)-(ARes.getValue('custrecord_st_i_c_a_take_1')*1);
							var ItemId = ARes.getValue('custrecord_st_i_c_a_item');
							nlapiLogExecution('ERROR','Line Number',ARes.getValue('custrecord_st_i_c_a_line_number')+'@ItemId@'+ItemId+'@Diff@'+Diff);
							if((Diff == 0)&&(ItemId)){
								Html+="<tr border-bottom='1' font-size = '10px'>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_page_no'))+"</td>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_line_number'))+"</td>";
								Html+="<td align='left' ></td>" +
								"<td align='left'></td>" +
								"<td align='left'></td>" +
								"<td align='center'></td>" +
								"<td align='center' colspan='2'></td>" +
								"</tr>";
							}else{
								Html+="<tr border-bottom='1' font-size = '10px'>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_page_no'))+"</td>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_line_number'))+"</td>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getText('custrecord_st_i_c_a_item_bin'))+"</td>" +
								"<td align='left'>"+nlapiEscapeXML(ARes.getText('custrecord_st_i_c_a_item'))+"</td>" +
								"<td align='left'>"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_display_name'))+"</td>" +
//								"<td align='center'>"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_unit_type'))+"</td>" +
//								"<td align='center'>"+nlapiEscapeXML(ARes.getValue(ACol[4]))+"</td>" +
//								"<td align='center'></td>" +
								"<td align='center'></td>" +
								"<td align='center' colspan='2'></td>" +
								"</tr>";	
							}
							J++;
						}
						Index = Result.length;
						StartIndex = EndIndex;
						EndIndex = StartIndex + 1000;
					}
					Html+="</table>";
				}

/*				if(S == (ArrayGroupCountId.length-1)){

				}else{
					Html+="<pbr/>";
				}*/

//			}

			var PrintTitle	=	"Print Inv. Count";
			var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
			xml += "<pdf>";
			xml += "<head>";
			xml += "<meta name='title' value='"+PrintTitle+"'/>";
			xml	+="<meta charset='utf-8' />";
			xml += "<macrolist><macro id='nlheader'>";	
			xml += "</macro>";
			xml+='<macro id="myfooter">';
			xml+='<table align="center" width="100%" > <tr> <td align="center"></td> </tr></table>';
			xml += "</macro>";
			xml += "</macrolist>";
//			xml += styleHtml;
			xml += "</head>";
			xml += "<body size='A4' font-size='10' class='text' header='nlheader' header-height='.2cm' footer='myfooter' footer-height='.8cm' style='margin-right:-8mm; margin-left:-8mm;'>";
			xml += Html;
			xml += "</body>";
			xml += "</pdf>";

			var file = nlapiXMLToPDF(xml);
			response.setContentType('PDF', ""+InvCountName+"_Inventory Count.PDF", 'inline');
			response.write(file.getValue());

		}else{

			var takeSearch = nlapiCreateSearch("customrecord_advs_at_annual_stock_take",
					[
					 ["isinactive","is","F"],
					 "AND",
					 ["internalid", "anyof", InventoryId]
					 ], 
					 [			   
					  new nlobjSearchColumn("name"),
					  new nlobjSearchColumn("namenohierarchy","CUSTRECORD_ADVS_ANNUAL_LOCATION",null), 			     
					  new nlobjSearchColumn("custrecord_advs_annual_count_group"), 
					  new nlobjSearchColumn("custrecord_advs_annual_start_date"), 			    
					  new nlobjSearchColumn("custrecord_advs_annual_page_count"),
					  new nlobjSearchColumn("custrecord_advs_annual_count_type"),
					  new nlobjSearchColumn("namenohierarchy","custrecord_advs_annual_subsidiary",null),
					  ]
			);
			var tRun	=	takeSearch.runSearch();
			var tCol	=	tRun.getColumns();

			var InvCountName	=	"",	InvCountLocation	=	"",	InvCountGroup	=	"",	InvCountPage	=	"",	InvCountDate	=	"";
			var InvCountType	=	"";
			var InvCountGroupId	=	"",InvSubsidiary = '';
			tRun.forEachResult(function (tRes){

				InvCountName		=	tRes.getValue("name");
				InvCountLocation	=	tRes.getValue("namenohierarchy","CUSTRECORD_ADVS_ANNUAL_LOCATION",null);
				InvCountGroup		=	tRes.getText("custrecord_advs_annual_count_group");
				InvCountGroupId		=	tRes.getValue("custrecord_advs_annual_count_group");
				InvCountDate		=	tRes.getValue("custrecord_advs_annual_start_date");
				InvCountPage		=	tRes.getValue("custrecord_advs_annual_page_count");
				InvCountType		=	tRes.getText("custrecord_advs_annual_count_type");
				InvSubsidiary	=	tRes.getValue("namenohierarchy","custrecord_advs_annual_subsidiary",null);
				return true;
			});

			InvCountType			=	InvCountType.toUpperCase();

			Html+="<table width='100%'>" +
			"<tr>" +
			"<td><b>Subsidiary / Location</b></td>" +
			"<td>: "+nlapiEscapeXML(InvSubsidiary)+" / "+nlapiEscapeXML(InvCountLocation)+"</td>" +
			"<td></td>" +
			"<td></td>" +
			"<td><b>"+InvCountType+" COUNT</b></td>" +
			"<td>Page <pagenumber/> of &nbsp;<totalpages/></td>" +
			"</tr>" +

			"<tr>" +
			"<td><b>Inv Count ID</b></td>" +
			"<td>: "+nlapiEscapeXML(InvCountName)+"</td>" +
			"<td></td>" +
			"<td></td>" +
			"<td>Counted By:</td>" +
			"<td></td>" +
			"</tr>" +

			"<tr>" +
			"<td><b>Start Date</b></td>" +
			"<td>: "+nlapiEscapeXML(InvCountDate)+"</td>" +
			"<td></td>" +
			"<td></td>" +
			"<td>Counted On:</td>" +
			"<td></td>" +
			"</tr>" +

			"<tr>" +
			"<td><b>Count Group</b></td>" +
			"<td>: "+nlapiEscapeXML(InvCountGroup)+"</td>" +
			"<td></td>" +
			"<td></td>" +
			"<td></td>" +
			"<td></td>" +
			"</tr>" +				
			"</table>";

			var PrintTitle	=	"Print Inv. Count";
			var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
			xml += "<pdf>";
			xml += "<head>";
			xml += "<meta name='title' value='"+PrintTitle+"'/>";
			xml	+="<meta charset='utf-8' />";
			xml += "<macrolist><macro id='nlheader'>";	
			xml += "</macro>";
			xml+='<macro id="myfooter">';
			xml+='<table align="center" width="100%" > <tr> <td align="center"></td> </tr></table>';
			xml += "</macro>";
			xml += "</macrolist>";
//			xml += styleHtml;
			xml += "</head>";
			xml += "<body size='A4' font-size='10' class='text' header='nlheader' header-height='.2cm' footer='myfooter' footer-height='.8cm' style='margin-right:-8mm; margin-left:-8mm;'>";
			xml += Html;
			xml += "</body>";
			xml += "</pdf>";

			var file = nlapiXMLToPDF(xml);
			response.setContentType('PDF', ""+InvCountName+"_Inventory Count.PDF", 'inline');
			response.write(file.getValue());

		}

	}else{

		var takeSearch = nlapiCreateSearch("customrecord_advs_at_annual_stock_take",
				[
				 ["isinactive","is","F"],
				 "AND",
				 ["internalid", "anyof", InventoryId]
				 ], 
				 [			   
				  new nlobjSearchColumn("name"),
				  new nlobjSearchColumn("namenohierarchy","CUSTRECORD_ADVS_ANNUAL_LOCATION",null), 			     
				  new nlobjSearchColumn("custrecord_advs_annual_count_group"), 
				  new nlobjSearchColumn("custrecord_advs_annual_start_date"), 			    
				  new nlobjSearchColumn("custrecord_advs_annual_page_count"),
				  new nlobjSearchColumn("custrecord_advs_annual_count_type"),
				  new nlobjSearchColumn("namenohierarchy","custrecord_advs_annual_subsidiary",null),
				  ]
		);
		var tRun	=	takeSearch.runSearch();
		var tCol	=	tRun.getColumns();

		var InvCountName	=	"",	InvCountLocation	=	"",	InvCountGroup	=	"",	InvCountPage	=	"",	InvCountDate	=	"";
		var InvCountType	=	"",InvSubsidiary = "";
		tRun.forEachResult(function (tRes){

			InvCountName		=	tRes.getValue("name");
			InvCountLocation	=	tRes.getValue("namenohierarchy","CUSTRECORD_ADVS_ANNUAL_LOCATION",null);
			InvCountGroup		=	tRes.getText("custrecord_advs_annual_count_group");
			InvCountDate		=	tRes.getValue("custrecord_advs_annual_start_date");
			InvCountPage		=	tRes.getValue("custrecord_advs_annual_page_count");
			InvCountType		=	tRes.getText("custrecord_advs_annual_count_type");
			InvSubsidiary	=	tRes.getValue("namenohierarchy","custrecord_advs_annual_subsidiary",null);
			return true;
		});

		var AdjustSearch = nlapiCreateSearch("customrecord_advs_st_inv_count_adjust",
				[
				 ["custrecord_st_i_c_a_phy_batch","anyof",InventoryId],
				 "AND",
				 ["custrecord_st_i_c_a_page_no","equalto", PageId],
				 "AND",
				 ["custrecord_st_i_c_a_count_group","noneof","@NONE@"]
				 ], 
				 [
				  new nlobjSearchColumn("custrecord_st_i_c_a_count_group", null, "GROUP")
				  ]
		);
		var ARun	=	AdjustSearch.runSearch();
		var ACol	=	ARun.getColumns();

		var ArrayGroupCountId	=	[], 	ArrayGroupCountName	=	[];
		ARun.forEachResult(function (ARes){

			ArrayGroupCountId.push(ARes.getValue(ACol[0]));
			ArrayGroupCountName.push(ARes.getText(ACol[0]));

			return true;
		});


		if(ArrayGroupCountId.length > 0){

			for(var S=0; S<ArrayGroupCountId.length; S++){

				Html+=prepareHeader(InvCountLocation, InvCountType, InvCountName, InvCountDate, ArrayGroupCountName[S]);

				if(CountType == "1" || CountType == 1){
					Html+="<br/>" 
						Html+="<table width='100%'>" ;
					var AdjustSearch = nlapiCreateSearch("customrecord_advs_st_inv_count_adjust",
							[
							 ["custrecord_st_i_c_a_phy_batch","anyof",InventoryId], 
							 "AND", 
							 ["custrecord_st_i_c_a_page_no","equalto", PageId]
							 ], 
							 [
							  new nlobjSearchColumn("custrecord_st_i_c_a_item_bin"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_item"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_display_name"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_unit_type"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_bin_on_hand_avail"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_take_1"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_notes"),
							  new nlobjSearchColumn("custrecord_st_i_c_a_page_no"),
							  new nlobjSearchColumn("custrecord_st_i_c_a_line_number").setSort(false),
							  new nlobjSearchColumn("custrecord_st_i_c_a_stock_status"),
							  ]
					);
					var ARun =	AdjustSearch.runSearch();
					var ACol =	ARun.getColumns();
					var J=0;
					var Index = 1000,StartIndex = 0,EndIndex = 1000;
					while(Index == 1000){
						var Result = ARun.getResults(StartIndex, EndIndex);
						for(var i=0;i<Result.length;i++){
							var ARes = Result[i];
							if(J == 0){
								Html+=prepareSubHeading();
							}

							if(J%35 == 0 && J!= 0){
								Html+="</table>";
								Html+="<pbr/>";
								Html+=prepareHeader(InvCountLocation, InvCountType, InvCountName, InvCountDate, ArrayGroupCountName[S],InvSubsidiary);
//								Html+=prepareSubHeading();
								Html+="<table width='100%' font-size = '9px'>";
								Html+=prepareSubHeading();
							}
							var Diff = (ARes.getValue('custrecord_st_i_c_a_bin_on_hand_avail')*1)-(ARes.getValue('custrecord_st_i_c_a_take_1')*1);
							var ItemId = ARes.getValue('custrecord_st_i_c_a_item');
							if((Diff == 0)&&(ItemId)){
								Html+="<tr border-bottom='1' font-size = '10px'>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_page_no'))+"</td>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_line_number'))+"</td>";
								Html+="<td align='left' ></td>" +
								"<td align='left'></td>" +
								"<td align='left'></td>" +
								"<td align='center'></td>" +
								"<td align='center' colspan='2'></td>" +
								"</tr>";
							}else{
								Html+="<tr border-bottom='1' font-size = '10px'>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_page_no'))+"</td>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_line_number'))+"</td>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getText('custrecord_st_i_c_a_item_bin'))+"</td>" +
								"<td align='left'>"+nlapiEscapeXML(ARes.getText('custrecord_st_i_c_a_item'))+"</td>" +
								"<td align='left'>"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_display_name'))+"</td>" +
//								"<td align='center'>"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_unit_type'))+"</td>" +
//								"<td align='center'>"+nlapiEscapeXML(ARes.getValue(ACol[4]))+"</td>" +
//								"<td align='center'></td>" +
								"<td align='center'></td>" +
								"<td align='center' colspan='2'></td>" +
								"</tr>";	
							}
							J++;
						}
						Index = Result.length;
						StartIndex = EndIndex;
						EndIndex = StartIndex + 1000;
					}

					Html+="</table>";

				}else if(CountType == "2" || CountType == 2){
					Html+="<br/>" ;
					Html+="<table width='100%'>" ;

					var AdjustSearch = nlapiCreateSearch("customrecord_advs_st_inv_count_adjust",
							[
							 ["custrecord_st_i_c_a_phy_batch","anyof",InventoryId], 
							 "AND", 
							 ["custrecord_st_i_c_a_page_no","equalto", PageId]
							 ], 
							 [
							  new nlobjSearchColumn("custrecord_st_i_c_a_item_bin"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_alternate_bins"),
							  new nlobjSearchColumn("custrecord_st_i_c_a_item"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_display_name"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_unit_type"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_bin_on_hand_avail"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_take_1"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_notes"),
							  new nlobjSearchColumn("custrecord_st_i_c_a_page_no"),
							  new nlobjSearchColumn("custrecord_st_i_c_a_line_number").setSort(false),
							  new nlobjSearchColumn("custrecord_st_i_c_a_stock_status")
							  ]
					);
					var ARun = AdjustSearch.runSearch();
					var ACol = ARun.getColumns();
					var J=0;
					var Index = 1000,StartIndex = 0,EndIndex = 1000;
					while(Index == 1000){
						var Result = ARun.getResults(StartIndex, EndIndex);
						for(var i=0;i<Result.length;i++){
							var ARes = Result[i];
							if(J == 0){
								Html+=prepareSubHeading();
							}

							if(J%35 == 0 && J!= 0){
								Html+="</table>";

								Html+="<pbr/>";
								Html+=prepareHeader(InvCountLocation, InvCountType, InvCountName, InvCountDate, ArrayGroupCountName[S],InvSubsidiary);
//								Html+=prepareSubHeading();
								Html+="<table width='100%' font-size = '9px'>";
								Html+=prepareSubHeading();
							}
							var Diff = (ARes.getValue('custrecord_st_i_c_a_bin_on_hand_avail')*1)-(ARes.getValue('custrecord_st_i_c_a_take_1')*1);
							var ItemId = ARes.getValue('custrecord_st_i_c_a_item');
							if((Diff == 0)&&(ItemId)){
								Html+="<tr border-bottom='1' font-size = '10px'>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_page_no'))+"</td>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_line_number'))+"</td>";
								Html+="<td align='left' ></td>" +
								"<td align='left'></td>" +
								"<td align='left'></td>" +
								"<td align='center'></td>" +
								"<td align='center' colspan='2'></td>" +
								"</tr>";
							}else{
								Html+="<tr border-bottom='1' font-size = '10px'>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_page_no'))+"</td>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_line_number'))+"</td>";
								Html+="<td align='left' >"+nlapiEscapeXML(ARes.getText('custrecord_st_i_c_a_item_bin'))+"</td>" +
								"<td align='left'>"+nlapiEscapeXML(ARes.getText('custrecord_st_i_c_a_item'))+"</td>" +
								"<td align='left'>"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_display_name'))+"</td>" +
//								"<td align='center'>"+nlapiEscapeXML(ARes.getValue('custrecord_st_i_c_a_unit_type'))+"</td>" +
//								"<td align='center'>"+nlapiEscapeXML(ARes.getValue(ACol[4]))+"</td>" +
//								"<td align='center'></td>" +
								"<td align='center'></td>" +
								"<td align='center' colspan='2'></td>" +
								"</tr>";	
							}
							J++;
						}
						Index = Result.length;
						StartIndex = EndIndex;
						EndIndex = StartIndex + 1000;
					}
					Html+="</table>";
				}

				if(S == (ArrayGroupCountId.length-1)){

				}else{
					Html+="<pbr/>";
				}
			}

			var PrintTitle	=	"Print Inv. Count";
			var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
			xml += "<pdf>";
			xml += "<head>";
			xml += "<meta name='title' value='"+PrintTitle+"'/>";
			xml	+="<meta charset='utf-8' />";
			xml += "<macrolist><macro id='nlheader'>";	
			xml += "</macro>";
			xml+='<macro id="myfooter">';
			xml+='<table align="center" width="100%" > <tr> <td align="center"></td> </tr></table>';
			xml += "</macro>";
			xml += "</macrolist>";
//			xml += styleHtml;
			xml += "</head>";
			xml += "<body size='A4' font-size='10' class='text' header='nlheader' header-height='.2cm' footer='myfooter' footer-height='.8cm' style='margin-right:-8mm; margin-left:-8mm;'>";
			xml += Html;
			xml += "</body>";
			xml += "</pdf>";

			var file = nlapiXMLToPDF(xml);
			response.setContentType('PDF', ""+InvCountName+"_Inventory Count.PDF", 'inline');
			response.write(file.getValue());

		}else{

			var takeSearch = nlapiCreateSearch("customrecord_advs_at_annual_stock_take",
					[
					 ["isinactive","is","F"],
					 "AND",
					 ["internalid", "anyof", InventoryId]
					 ], 
					 [			   
					  new nlobjSearchColumn("name"),
					  new nlobjSearchColumn("namenohierarchy","CUSTRECORD_ADVS_ANNUAL_LOCATION",null), 			     
					  new nlobjSearchColumn("custrecord_advs_annual_count_group"), 
					  new nlobjSearchColumn("custrecord_advs_annual_start_date"), 			    
					  new nlobjSearchColumn("custrecord_advs_annual_page_count"),
					  new nlobjSearchColumn("custrecord_advs_annual_count_type"),
					  new nlobjSearchColumn("namenohierarchy","custrecord_advs_annual_subsidiary",null), 
					  ]
			);
			var tRun	=	takeSearch.runSearch();
			var tCol	=	tRun.getColumns();

			var InvCountName	=	"",	InvCountLocation	=	"",	InvCountGroup	=	"",	InvCountPage	=	"",	InvCountDate	=	"";
			var InvCountType	=	"";
			var InvCountGroupId	=	"",InvSubsidiary = "";
			tRun.forEachResult(function (tRes){

				InvCountName		=	tRes.getValue("name");
				InvCountLocation	=	tRes.getValue("namenohierarchy","CUSTRECORD_ADVS_ANNUAL_LOCATION",null);
				InvCountGroup		=	tRes.getText("custrecord_advs_annual_count_group");
				InvCountGroupId		=	tRes.getValue("custrecord_advs_annual_count_group");
				InvCountDate		=	tRes.getValue("custrecord_advs_annual_start_date");
				InvCountPage		=	tRes.getValue("custrecord_advs_annual_page_count");
				InvCountType		=	tRes.getText("custrecord_advs_annual_count_type");
				InvSubsidiary	=	tRes.getValue("namenohierarchy","custrecord_advs_annual_subsidiary",null);
				return true;
			});

			InvCountType			=	InvCountType.toUpperCase();

			Html+="<table width='100%'>" +
			"<tr>" +
			"<td><b>Subsidiary / Location</b></td>" +
			"<td>: "+nlapiEscapeXML(InvSubsidiary)+" / "+nlapiEscapeXML(InvCountLocation)+"</td>" +
			"<td></td>" +
			"<td></td>" +
			"<td><b>"+InvCountType+" COUNT</b></td>" +
			"<td>Page <pagenumber/> of &nbsp;<totalpages/></td>" +
			"</tr>" +

			"<tr>" +
			"<td><b>Inv Count ID</b></td>" +
			"<td>: "+nlapiEscapeXML(InvCountName)+"</td>" +
			"<td></td>" +
			"<td></td>" +
			"<td>Counted By: / Assist By:</td>" +
			"<td></td>" +
			"</tr>" +

			"<tr>" +
			"<td><b>Start Date</b></td>" +
			"<td>: "+nlapiEscapeXML(InvCountDate)+"</td>" +
			"<td></td>" +
			"<td></td>" +
			"<td>Counted On:</td>" +
			"<td></td>" +
			"</tr>" +

			"<tr>" +
			"<td><b>Count Group</b></td>" +
			"<td>: "+nlapiEscapeXML(InvCountGroup)+"</td>" +
			"<td></td>" +
			"<td></td>" +
			"<td>Signature : </td>" +
			"<td></td>" +
			"</tr>" +				
			"</table>";

			var PrintTitle	=	"Print Inv. Count";
			var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
			xml += "<pdf>";
			xml += "<head>";
			xml += "<meta name='title' value='"+PrintTitle+"'/>";
			xml	+="<meta charset='utf-8' />";
			xml += "<macrolist><macro id='nlheader'>";	
			xml += "</macro>";
			xml+='<macro id="myfooter">';
			xml+='<table align="center" width="100%" > <tr> <td align="center"></td> </tr></table>';
			xml += "</macro>";
			xml += "</macrolist>";
//			xml += styleHtml;
			xml += "</head>";
			xml += "<body size='A4' font-size='10' class='text' header='nlheader' header-height='.2cm' footer='myfooter' footer-height='.8cm' style='margin-right:-8mm; margin-left:-8mm;'>";
			xml += Html;
			xml += "</body>";
			xml += "</pdf>";

			var file = nlapiXMLToPDF(xml);
			response.setContentType('PDF', ""+InvCountName+"_Inventory Count.PDF", 'inline');
			response.write(file.getValue());
		}
	}
}

function prepareHeader(InvCountLocation,InvCountType,InvCountName,InvCountDate,ArrayGroupCountName,InvSubsidiary){
	var Html = "";
	Html+="<table width='100%'>" +
	"<tr>" +
	"<td><b>Subsidiary / Location</b></td>" +
	"<td>: "+nlapiEscapeXML(InvSubsidiary)+" / "+nlapiEscapeXML(InvCountLocation)+"</td>" +
	"<td></td>" +
	"<td></td>" +
	"<td><b>"+InvCountType+" COUNT</b></td>" +
	"<td>Page <pagenumber/> of &nbsp;<totalpages/></td>" +
	"</tr>" +

	"<tr>" +
	"<td><b>Inv Count ID</b></td>" +
	"<td>: "+nlapiEscapeXML(InvCountName)+"</td>" +
	"<td></td>" +
	"<td></td>" +
	"<td>Counted By: / Assist By:</td>" +
	"<td></td>" +
	"</tr>" +

	"<tr>" +
	"<td><b>Start Date</b></td>" +
	"<td>: "+nlapiEscapeXML(InvCountDate)+"</td>" +
	"<td></td>" +
	"<td></td>" +
	"<td>Counted On:</td>" +
	"<td></td>" +
	"</tr>" +

	"<tr>" +
	"<td></td>" +
	"<td></td>" +
	"<td></td>" +
	"<td></td>" +
	"<td>Signature : </td>" +
	"<td></td>" +
	"</tr>" +				
	"</table>";
	
	Html+="<table width='100%'>" +
	"<tr>" +
	"<td><b>Count Group</b></td>" +
	"<td colspan='4'>: "+nlapiEscapeXML(ArrayGroupCountName.slice(1,45))+"</td>" +
	"</tr>" +				
	"</table>";
	return Html;
}

function prepareSubHeading(){
	var Html = ""
//		Html+="<table width='100%' >" +
		Html+="<tr>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
//		"<td align='left'>&nbsp;</td>" +
//		"<td align='left'>&nbsp;</td>" +
//		"<td align='left'>&nbsp;</td>" +
		"<td align='left' colspan='2'>&nbsp;</td>" +
		"</tr>" +

		"<tr>" +
		"<td align='left'><b><u>Page #</u></b></td>" +
		"<td align='left'><b><u>Line #</u></b></td>" +
		"<td align='left'><b><u>Bin</u></b></td>" +
		"<td align='left'><b><u>Item Name</u></b></td>" +
		"<td align='left'><b><u>Display Name</u></b></td>" +
//		"<td align='center'><b><u>Units</u></b></td>" +
//		"<td align='center'><b><u>Available Qty</u></b></td>" +
		"<td align='center'><b><u>Count</u></b></td>" +
//		"<td align='center'><b><u>Status</u></b></td>" +
		"<td align='center' colspan='2'><b><u>Notes</u></b></td>" +
		"</tr>";
//	"</table>";
	return Html;
}
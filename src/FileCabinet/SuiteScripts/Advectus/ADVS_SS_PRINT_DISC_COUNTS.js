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

	var InventoryId		=	request.getParameter("custparam_inv_id");
	var CountType		=	request.getParameter("custparam_count_type");
	var PageId			=	request.getParameter("custparam_page");
	var PrintAll		=	request.getParameter("custparam_print_all");
	PageId				=	PageId*1;

    var Html = "";
    var Htmlexcel = '';
	var HtmlHeader		=	"";

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

		var InvCountName	=	"",	InvCountLocation	=	"",	InvCountGroup	=	"",	InvCountPage	=	"",	InvCountDate	=	"", InvSubsidiary = "";
		var InvCountType	=	"";
		var InvCountGroupId	=	"";

		tRun.forEachResult(function (tRes){

			InvCountName		=	tRes.getValue("name");
			InvCountLocation	=	tRes.getValue("namenohierarchy","CUSTRECORD_ADVS_ANNUAL_LOCATION",null);
			InvCountGroup		=	tRes.getText("custrecord_advs_annual_count_group");
			InvCountGroupId		=	tRes.getValue("custrecord_advs_annual_count_group");
			InvCountDate		=	tRes.getValue("custrecord_advs_annual_start_date");
			InvCountPage		=	tRes.getValue("custrecord_advs_annual_page_count");
            InvCountType 		= 	tRes.getText("custrecord_advs_annual_count_type");
            InvSubsidiary 		=	tRes.getValue("namenohierarchy","custrecord_advs_annual_subsidiary",null);

			return true;
		});

		var AdjustSearch = nlapiCreateSearch("customrecord_advs_st_inv_count_adjust",
			[
				[
					["custrecord_st_i_c_a_n_diff", "isnotempty", null], 
					"OR", 
					["custrecord_st_i_c_a_n_diff", "notequalto", "0"]
				],
				"AND",
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

			ArrayGroupCountId.push(ARes.getValue(ACol[0]));
			ArrayGroupCountName.push(ARes.getText(ACol[0]));

			return true;
		});

		nlapiLogExecution("ERROR", "ArrayGroupCountId", ArrayGroupCountId);

		if(ArrayGroupCountId.length > 0){

//			for(var S=0; S<ArrayGroupCountId.length; S++){
			var Title = 'Inventory Count Discrepancy Report';
			Html+=addTitle(Title);
			Html+=prepareHeader(InvSubsidiary+ ' / '+InvCountLocation, InvCountType, InvCountName, InvCountDate, ArrayGroupCountName);

			if(CountType == "1" || CountType == 1){

				Html+="" ;

				Html+="<table width='100%'>" ;
				var AdjustSearch = nlapiCreateSearch("customrecord_advs_st_inv_count_adjust",
					[
						["custrecord_st_i_c_a_phy_batch", "anyof", InventoryId],
						"AND", 
						["custrecord_st_i_c_a_item", "noneof", "@NONE@"],
						"AND", 
						["isinactive","is","F"],
						"AND", 
						//  ["custrecord_st_i_c_a_count_group", "anyof", ArrayGroupCountId[S]]
						//  ,
						//  "AND", 
						[
							["custrecord_st_i_c_a_n_diff", "isnotempty", null], 
							"OR", 
							["custrecord_st_i_c_a_n_diff","notequalto","0"]
						]
					], 
					[
						new nlobjSearchColumn("custrecord_st_i_c_a_item_bin").setSort(), 
						new nlobjSearchColumn("custrecord_st_i_c_a_item"), 
						new nlobjSearchColumn("custrecord_st_i_c_a_display_name"), 
						new nlobjSearchColumn("custrecord_st_i_c_a_unit_type"), 
						new nlobjSearchColumn("custrecord_st_i_c_a_bin_on_hand_avail"), 
						new nlobjSearchColumn("custrecord_st_i_c_a_take_1"), 
						new nlobjSearchColumn("custrecord_st_i_c_a_notes"),
						new nlobjSearchColumn("custrecord_st_i_c_a_n_diff"), 
						new nlobjSearchColumn("formulacurrency").setFormula("CASE WHEN{custrecord_st_i_c_a_n_diff}>0 THEN round({custrecord_st_i_c_a_n_diff} * {custrecord_st_i_c_a_actual_unit_cost},2) ELSE round({custrecord_st_i_c_a_n_diff} * {custrecord_st_i_c_a_actual_unit_cost},2) END"),
						new nlobjSearchColumn("averagecost","custrecord_st_i_c_a_item"),
					]
				);
				var ARun	=	AdjustSearch.runSearch();
				var ACol	=	ARun.getColumns();
				var J		=	0;
				var DiscrepencyTotalPositive = 0;
				var DiscrepencyTotalNegative = 0;
				var NetAdjustmentValueTotalPositive = 0;
				var NetAdjustmentValueTotalNegative = 0;
				var AvailableQuantity = 0;
				var AvailableCount = 0;
                var start = 0; var end = 1000; var index = 1000;
                Htmlexcel = '<Table>';
                Htmlexcel += '<Row>';
                Htmlexcel += '<Cell><Data ss:Type="String">Bin</Data></Cell>';
                Htmlexcel += '<Cell><Data ss:Type="String">Part Name</Data></Cell>';
                Htmlexcel += '<Cell><Data ss:Type="String">Display Name</Data></Cell>';
                Htmlexcel += '<Cell><Data ss:Type="String">On Hand Qty</Data></Cell>';
                Htmlexcel += '<Cell><Data ss:Type="String">Count</Data></Cell>';
                Htmlexcel += '<Cell><Data ss:Type="String">Discrepency</Data></Cell>';
                Htmlexcel += '<Cell><Data ss:Type="String">Net Adjustment Value </Data></Cell>';
                Htmlexcel += '</Row>';
                
				while(index	==1000){
					var rs = ARun.getResults(start, end);
					nlapiLogExecution('ERROR','rs.length',rs.length);
                    for (var ns = 0; ns < rs.length; ns++) {
                        var ARes = rs[ns];
					
                        var CountQty = ARes.getValue('custrecord_st_i_c_a_take_1');
                        var AvailQty = ARes.getValue('custrecord_st_i_c_a_bin_on_hand_avail');
                        var ItemCost = ARes.getValue("averagecost", "custrecord_st_i_c_a_item");
                        if (!AvailQty) { AvailQty = 0 };
                        if (!ItemCost) { ItemCost = 0 };
                        var PrintQty = ARes.getValue("custrecord_st_i_c_a_n_diff");
                        //var TotCost = (ItemCost*1)*(PrintQty*1);
                        var TotCost = (ARes.getValue('formulacurrency') * 1);
                        if (TotCost) { TotCost = TotCost.toFixed(2); }
						nlapiLogExecution("ERROR",'TotCost',TotCost);
                        if (TotCost !== 0) {
                            if (J == 0) {
                                Html += prepareSubHeading();
                            }

                            if (J % 35 == 0 && J != 0) {
                                Html += "</table>";

                                Html += "<pbr/>";
                                Html += prepareHeader(InvSubsidiary + ' / ' + InvCountLocation, InvCountType, InvCountName, InvCountDate, ArrayGroupCountName);
                                Html += "<table width='100%' font-size = '9px'>";
                                Html += prepareSubHeading();
                            

                            }
                            Html += "<tr border-bottom='1' font-size = '10px'>";
                            Html += "<td align='left' >" + nlapiEscapeXML(ARes.getText(ACol[0])) + "</td>" +
							"<td align='left'>" + nlapiEscapeXML(ARes.getText(ACol[1])) + "</td>" +
							"<td align='left'>" + nlapiEscapeXML(ARes.getValue(ACol[2])) + "</td>" +
							"<td align='center'>" + nlapiEscapeXML(ARes.getValue(ACol[4])) + "</td>" +
							"<td align='center'>" + nlapiEscapeXML(ARes.getValue(ACol[5])) + "</td>" +
							"<td align='center'>" + PrintQty + "</td>" +
							"<td align='center'>" + TotCost + "</td>" +
							"<td align='center'>" + nlapiEscapeXML(ARes.getValue(ACol[6])) + "</td>" +
							"</tr>";
                            
							Htmlexcel += "<Row>" +
							"<Cell><Data ss:Type='String'>" + nlapiEscapeXML(ARes.getText(ACol[0])) + "</Data></Cell>" +
							"<Cell><Data ss:Type='String'>" + nlapiEscapeXML(ARes.getText(ACol[1])) + "</Data></Cell>" +
							"<Cell><Data ss:Type='String'>" + nlapiEscapeXML(ARes.getValue(ACol[2])) + "</Data></Cell>" +
							"<Cell><Data ss:Type='Number'>" + nlapiEscapeXML(ARes.getValue(ACol[4])) + "</Data></Cell>" +
							"<Cell><Data ss:Type='Number'>" + nlapiEscapeXML(ARes.getValue(ACol[5])) + "</Data></Cell>" +
							"<Cell><Data ss:Type='Number'>" + PrintQty + "</Data></Cell>" +
							"<Cell><Data ss:Type='Number'>" + TotCost + "</Data></Cell>" +
							"<Cell><Data ss:Type='String'>" + nlapiEscapeXML(ARes.getValue(ACol[6])) + "</Data></Cell>" +
							"</Row>";
                            var DiscrepencyValue 	= (ARes.getValue(ACol[7]) * 1);
                            var NetAdjustmentValue 	= TotCost * 1;
                            AvailableQuantity 	+= (ARes.getValue(ACol[4]) * 1);
                            AvailableCount 		+= (ARes.getValue(ACol[5]) * 1);


                            if (DiscrepencyValue > 0) {
                                DiscrepencyTotalPositive += (DiscrepencyValue * 1);
                            } else {
                                var temp = (DiscrepencyValue) * (-1);
                                DiscrepencyTotalNegative += (temp * 1);
                            }

                            if (NetAdjustmentValue > 0) {
                                NetAdjustmentValueTotalPositive += (NetAdjustmentValue * 1);
                            } else {
                                var temp = (NetAdjustmentValue) * (-1);
                                NetAdjustmentValueTotalNegative += (temp * 1);

                            }

                            J++;
                        }
					}
					start = end; end = start + 1000; index = rs.length;
                }
                Htmlexcel += '</Table>';

				var DiscrepencyTotal 		= DiscrepencyTotalPositive - DiscrepencyTotalNegative;
				var NetAdjustmentValueTotal = NetAdjustmentValueTotalPositive - NetAdjustmentValueTotalNegative;
				Html+=prepareSubFooter(DiscrepencyTotal, NetAdjustmentValueTotal, AvailableQuantity, AvailableCount);

				Html+=prepareSubFooterLine();

				Html+="</table>";

			}else if(CountType == "2" || CountType == 2){


				Html+="" ;

				Html+="<table width='100%'>" ;
				var AdjustSearch = nlapiCreateSearch("customrecord_advs_st_inv_count_adjust",
					[
						["custrecord_st_i_c_a_phy_batch","anyof",InventoryId],
						"AND",
						["custrecord_st_i_c_a_count_group", "anyof", ArrayGroupCountId]
					], 
					[
						new nlobjSearchColumn("custrecord_st_i_c_a_item_bin").setSort(false), 
						new nlobjSearchColumn("custrecord_st_i_c_a_alternate_bins"),
						new nlobjSearchColumn("custrecord_st_i_c_a_item").setSort(false), 
						new nlobjSearchColumn("custrecord_st_i_c_a_display_name"), 
						new nlobjSearchColumn("custrecord_st_i_c_a_unit_type"), 
						new nlobjSearchColumn("custrecord_st_i_c_a_bin_on_hand_avail"), 
						new nlobjSearchColumn("custrecord_st_i_c_a_take_1"), 
						new nlobjSearchColumn("custrecord_st_i_c_a_notes")
					]
				);
				var ARun	=	AdjustSearch.runSearch();
				var ACol	=	ARun.getColumns();
				var J		=	0;
				ARun.forEachResult(function (ARes){
					if(J == 0){
						Html	+=	prepareSubHeading();
					}

					if(J%35 == 0 && J!= 0){
						Html	+=	"</table>";

						Html	+=	"<pbr/>";
						Html	+=	prepareHeader(InvSubsidiary+ ' / '+InvCountLocation, InvCountType, InvCountName, InvCountDate, ArrayGroupCountName[S]);
						Html	+=	"<table width='100%' font-size = '9px'>";
						Html	+=	prepareSubHeading();

					}

					Html	+=	"<tr border-bottom='1' font-size = '10px'>" +
					"<td align='left'>"+nlapiEscapeXML(ARes.getText(ACol[0]))+"</td>" +
					"<td align='left'>"+nlapiEscapeXML(ARes.getText(ACol[2]))+"</td>" +
					"<td align='center'>"+nlapiEscapeXML(ARes.getValue(ACol[4]))+"</td>" +
					"<td align='center'>"+nlapiEscapeXML(ARes.getValue(ACol[5]))+"</td>" +
					"<td align='center'></td>" +
					"<td align='center'></td>" +

					"</tr>";

					J++;

					return true;
				});

				Html	+=	"</table>";
			}

			var PrintTitle	=	"Print Discrepancy Count";
			var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE html PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
			xml += 	"<pdf>";
			xml += 	"<head>";
			xml += 	"<meta name='title' value='"+PrintTitle+"'/>";
			xml	+=	"<meta charset='utf-8' />";
			xml += 	"<macrolist><macro id='nlheader'>";	
			xml += 	"</macro>";
			xml	+=	'<macro id="myfooter">';
			xml	+=	'<table align="center" width="100%" > <tr> <td align="center"></td> </tr></table>';
			xml += 	"</macro>";
			xml += 	"</macrolist>";
			xml += 	"</head>";
			xml += 	"<body size='A4' font-size='10' class='text' header='nlheader' header-height='.2cm' footer='myfooter' footer-height='.8cm' style='margin-right:-8mm; margin-left:-8mm;'>";
			xml += 	Html;
			xml += 	"</body>";
            xml += 	"</pdf>";
            
            exportToExcel(Htmlexcel, InvCountName + '_Inventory Count');

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

			var InvCountName	=	"",	InvCountLocation	=	"",	InvCountGroup	=	"",	InvCountPage	=	"",	InvCountDate	=	"", InvSubsidiary = "";
			var InvCountType	=	"";
			var InvCountGroupId	=	"";
			tRun.forEachResult(function (tRes){

				InvCountName		=	tRes.getValue("name");
				InvCountLocation	=	tRes.getValue("namenohierarchy","CUSTRECORD_ADVS_ANNUAL_LOCATION",null);
				InvCountGroup		=	tRes.getText("custrecord_advs_annual_count_group");
				InvCountGroupId		=	tRes.getValue("custrecord_advs_annual_count_group");
				InvCountDate		=	tRes.getValue("custrecord_advs_annual_start_date");
				InvCountPage		=	tRes.getValue("custrecord_advs_annual_page_count");
				InvCountType		=	tRes.getText("custrecord_advs_annual_count_type");
                InvSubsidiary = tRes.getValue("namenohierarchy", "custrecord_advs_annual_subsidiary", null);
                
				return true;
			});

			InvCountType			=	InvCountType.toUpperCase();

			Html+="<table width='100%'>" +
			"<tr>" +
			"<td><b>Subsidiary / Location</b></td>" +
			"<td>: "+InvSubsidiary+ ' / '+nlapiEscapeXML(InvCountLocation)+"</td>" +
			"<td></td>" +
			//"<td></td>" +
			"<td><b>"+InvCountType+" COUNT</b></td>" +
			"<td>Page <pagenumber/> of &nbsp;<totalpages/></td>" +
			"</tr>" +

			"<tr>" +
			"<td><b>Count Group</b></td>" +
			"<td>: "+nlapiEscapeXML(InvCountGroup)+"</td>" +
			"<td></td>" +
			//"<td></td>" +
			"<td></td>" +
			"<td></td>" +
			"</tr>" +				
			"</table>";

			var PrintTitle	=	"Print Discrepancy Count";
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
				  new nlobjSearchColumn("custrecord_advs_annual_count_type")
				  ]
		);
		var tRun	=	takeSearch.runSearch();
		var tCol	=	tRun.getColumns();

		var InvCountName	=	"",	InvCountLocation	=	"",	InvCountGroup	=	"",	InvCountPage	=	"",	InvCountDate	=	"";
		var InvCountType	=	"";
		tRun.forEachResult(function (tRes){

			InvCountName		=	tRes.getValue("name");
			InvCountLocation	=	tRes.getValue("namenohierarchy","CUSTRECORD_ADVS_ANNUAL_LOCATION",null);
			InvCountGroup		=	tRes.getText("custrecord_advs_annual_count_group");
			InvCountDate		=	tRes.getValue("custrecord_advs_annual_start_date");
			InvCountPage		=	tRes.getValue("custrecord_advs_annual_page_count");
			InvCountType		=	tRes.getText("custrecord_advs_annual_count_type");

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
				 // new nlobjSearchColumn("custrecord_st_i_c_a_count_group", null, "GROUP")
                   				  new nlobjSearchColumn("custrecord_st_i_c_a_count_group", null, "null")

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
                                ["custrecord_st_i_c_a_phy_batch", "anyof", InventoryId],
                              "AND", 
                            ["custrecord_st_i_c_a_item", "noneof", "@NONE@"],
                            "AND", 
                            ["isinactive","is","F"],   
							 "AND", 
							 ["custrecord_st_i_c_a_page_no","equalto", PageId],
							 "AND", 
							 [["custrecord_st_i_c_a_n_diff","isnotempty",null], 
							 "OR", 
							 ["custrecord_st_i_c_a_n_diff","notequalto","0"]
							 ]], 
							 [
							  new nlobjSearchColumn("custrecord_st_i_c_a_item_bin").setSort(), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_item"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_display_name"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_unit_type"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_bin_on_hand_avail"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_take_1"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_notes"),
							  new nlobjSearchColumn("custrecord_st_i_c_a_n_diff"), 
							  //new nlobjSearchColumn("formulacurrency").setFormula("CASE WHEN{custrecord_st_i_c_a_n_diff}>0 THEN {custrecord_st_i_c_a_n_diff} * {custrecord_st_i_c_a_actual_unit_cost} END").setSort(true)
                              new nlobjSearchColumn("formulacurrency").setFormula("CASE WHEN{custrecord_st_i_c_a_n_diff}>0 THEN round({custrecord_st_i_c_a_n_diff} * {custrecord_st_i_c_a_actual_unit_cost},2) ELSE round({custrecord_st_i_c_a_n_diff} * {custrecord_st_i_c_a_actual_unit_cost},2) END")
						  
							  ]
					);
					var ARun	=	AdjustSearch.runSearch();
					var ACol	=	ARun.getColumns();
					var J=0;
					var start=0;var end=1000;var index=1000;
					while(index	==1000){
						var rs = ARun.getResults(start, end);
						for(var ns=0;ns<rs.length;ns++){
							var ARes = rs[ns];
							
							if(J == 0){
								Html+=prepareSubHeading();
							}

							if(J%35 == 0 && J!= 0){
								Html+="</table>";

								Html+="<pbr/>";
								Html+=prepareHeader(InvCountLocation, InvCountType, InvCountName, InvCountDate, ArrayGroupCountName[S]);
//								Html+=prepareSubHeading();
								Html+="<table width='100%' font-size = '9px'>";
								Html+=prepareSubHeading();

							}
							Html+="<tr border-bottom='1' font-size = '10px'>";
							Html+="<td align='left'>"+nlapiEscapeXML(ARes.getText(ACol[0]))+"</td>" +
							"<td align='left'>"+nlapiEscapeXML(ARes.getText(ACol[1]))+"</td>" +
							"<td align='left'>"+nlapiEscapeXML(ARes.getValue(ACol[2]))+"</td>" +
							"<td align='center'>"+nlapiEscapeXML(ARes.getValue(ACol[3]))+"</td>" +
							"<td align='center'>"+nlapiEscapeXML(ARes.getValue(ACol[4]))+"</td>" +
							"<td align='center'>"+nlapiEscapeXML(ARes.getValue(ACol[5]))+"</td>" +
							"<td align='center'>"+nlapiEscapeXML(ARes.getValue(ACol[6]))+"</td>" +
							"<td align='center'>"+nlapiEscapeXML(ARes.getValue(ACol[7]))+"</td>" +
							"<td align='center'>"+nlapiEscapeXML(ARes.getValue(ACol[8]))+"</td>" +

							"</tr>";

							J++;
						}
						start = end; end = start + 1000; index = rs.length;
					}
					
//					ARun.forEachResult(function (ARes){

						
//
//						return true;
//					});

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
							  new nlobjSearchColumn("custrecord_st_i_c_a_item_bin").setSort(), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_alternate_bins"),
							  new nlobjSearchColumn("custrecord_st_i_c_a_item"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_display_name"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_unit_type"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_bin_on_hand_avail"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_take_1"), 
							  new nlobjSearchColumn("custrecord_st_i_c_a_notes")
							  ]
					);
					var ARun	=	AdjustSearch.runSearch();
					var ACol	=	ARun.getColumns();
					var J=0;
					ARun.forEachResult(function (ARes){

						if(J == 0){
							Html+=prepareSubHeading();
						}

						if(J%35 == 0 && J!= 0){
							Html+="</table>";

							Html+="<pbr/>";
							Html+=prepareHeader(InvCountLocation, InvCountType, InvCountName, InvCountDate, ArrayGroupCountName[S]);
//							Html+=prepareSubHeading();
							Html+="<table width='100%' font-size = '9px'>";
							Html+=prepareSubHeading();

						}
						Html+="<tr border-bottom='1' font-size = '10px'>" +
						"<td align='left'>"+nlapiEscapeXML(ARes.getText(ACol[0]))+"</td>" +
						"<td align='left'>"+nlapiEscapeXML(ARes.getText(ACol[2]))+"</td>" +
						"<td align='left'>"+nlapiEscapeXML(ARes.getValue(ACol[3]))+"</td>" +
						"<td align='center'>"+nlapiEscapeXML(ARes.getValue(ACol[4]))+"</td>" +
						"<td align='center'>"+nlapiEscapeXML(ARes.getValue(ACol[5]))+"</td>" +
						"<td align='center'></td>" +
						"<td align='center'></td>" +
						"</tr>";

						J++;

						return true;
					});

					Html+="</table>";
				}

				if(S == (ArrayGroupCountId.length-1)){

				}else{
					Html+="<pbr/>";
				}
			}

			var PrintTitle	=	"Print Discrepancy Count";
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
					  new nlobjSearchColumn("custrecord_advs_annual_count_type")

					  ]
			);
			var tRun	=	takeSearch.runSearch();
			var tCol	=	tRun.getColumns();

			var InvCountName	=	"",	InvCountLocation	=	"",	InvCountGroup	=	"",	InvCountPage	=	"",	InvCountDate	=	"";
			var InvCountType	=	"";
			var InvCountGroupId	=	"";
			tRun.forEachResult(function (tRes){

				InvCountName		=	tRes.getValue("name");
				InvCountLocation	=	tRes.getValue("namenohierarchy","CUSTRECORD_ADVS_ANNUAL_LOCATION",null);
				InvCountGroup		=	tRes.getText("custrecord_advs_annual_count_group");
				InvCountGroupId		=	tRes.getValue("custrecord_advs_annual_count_group");
				InvCountDate		=	tRes.getValue("custrecord_advs_annual_start_date");
				InvCountPage		=	tRes.getValue("custrecord_advs_annual_page_count");
				InvCountType		=	tRes.getText("custrecord_advs_annual_count_type");

				return true;
			});

			InvCountType			=	InvCountType.toUpperCase();

			Html+="<table width='100%'>" +
			"<tr>" +
			"<td><b>Location</b></td>" +
			"<td>: "+nlapiEscapeXML(InvCountLocation)+"</td>" +
			"<td></td>" +
			"<td></td>" +
			"<td><b>"+InvCountType+" COUNT</b></td>" +
			"<td>Page <pagenumber/> of &nbsp;<totalpages/></td>" +
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

			var PrintTitle	=	"Print Discrepancy Count";
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

function exportToExcel(html,fileName) {
    // XML content of the file
    var xmlString = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>'; 
    xmlString += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ';
    xmlString += 'xmlns:o="urn:schemas-microsoft-com:office:office" ';
    xmlString += 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
    xmlString += 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" ';
    xmlString += 'xmlns:html="http://www.w3.org/TR/REC-html40">'; 

    xmlString += '<Worksheet ss:Name="Sheet1">'; 
    xmlString += html;
    xmlString += '</Worksheet></Workbook>';



    //create file
    var xlsFile = nlapiCreateFile(fileName+'.xls', 'EXCEL', nlapiEncrypt(xmlString, 'base64'));

    // folder id in which the file will be saved
    // xlsFile.setFolder(2730);

    //save file
    // var fileID = nlapiSubmitFile(xlsFile);
}


function addTitle(Title){
	var Html = "";
	Html+="<p align='center' style='font-size:15px;'><b>" + Title

	+"</b></p>";
	return Html;
}
function prepareHeader(InvCountLocation,InvCountType,InvCountName,InvCountDate,ArrayGroupCountName){
	var Html = "";
	Html+="<table width='100%'>" +
	"<tr>" +
	"<td><b>Subsidiary / Location</b></td>" +
	"<td>: "+nlapiEscapeXML(InvCountLocation)+"</td>" +
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
	// "<td>Counted By:</td>" +
	"<td></td>" +
	"</tr>" +

	"<tr>" +
	"<td><b>Start Date</b></td>" +
	"<td>: "+nlapiEscapeXML(InvCountDate)+"</td>" +
	"<td></td>" +
	"<td></td>" +
	// "<td>Counted On:</td>" +
	"<td></td>" +
	"</tr>" +

	"<tr>" +
	"<td><b>Count Group</b></td>" +
	"<td colspan='5'>: "+nlapiEscapeXML(ArrayGroupCountName.length>45? ArrayGroupCountName.slice(0, 45) + '...' : ArrayGroupCountName )+"</td>" +
	//"<td></td>" +
	//"<td></td>" +
	//"<td></td>" +
	//"<td></td>" +
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
//		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"</tr>" +

		"<tr>" +
		"<td align='left'><b><u>Bin</u></b></td>" +
		"<td align='left'><b><u>Part Name</u></b></td>" +
		"<td align='left'><b><u>Display Name</u></b></td>" +
//		"<td align='center'><b><u>Units</u></b></td>" +
		"<td align='center'><b><u>On Hand Qty</u></b></td>" +
		"<td align='center'><b><u>Count</u></b></td>" +
		"<td align='center'><b><u>Discrepency</u></b></td>" +
		"<td align='center'><b><u>Net Adjustment Value</u></b></td>" +
		"<td align='center'><b><u>Notes</u></b></td>" +
		"</tr>";
//	"</table>";
	return Html;
}

function prepareSubFooter(DiscrepencyTotal, NetAdjustmentValueTotal, AvailableQuantity, AvailableCount){
	var Html = ""
//		Html+="<table width='100%' >" +
		Html+="<tr>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"<td align='left'>&nbsp;</td>" +
		"</tr>" +

		"<tr>" +
		"<td align='left'></td>" +
		"<td align='left'></td>" +
		"<td align='left'></td>" +
		"<td align='center'></td>" +
		"<td align='center'><b><u>Total:"+AvailableQuantity+"</u></b></td>" +
		"<td align='center'><b><u>Total:"+AvailableCount+"</u></b></td>" +
		"<td align='center'><b><u>Total:"+DiscrepencyTotal+"</u></b></td>" +
		"<td align='center'><b><u>Total:"+(NetAdjustmentValueTotal*1).toFixed(2)+"</u></b></td>" +
		"<td align='center'></td>" +
		"</tr>";
//	"</table>";
	return Html;
}

function prepareSubFooterLine(DiscrepencyTotal, NetAdjustmentValueTotal, AvailableQuantity, AvailableCount){
	var Html = ""
//		Html+="<table width='100%' >" +
		Html+="<tr>" +
		"<td align='left'></td>" +
		"<td align='left'></td>" +
		"<td align='left'></td>" +
		"<td align='left'></td>" +
		"<td align='left'></td>" +
		"<td align='left'></td>" +
		"<td align='left'></td>" +
		"<td align='left'></td>" +
		"<td align='left'></td>" +
		"</tr>" +

		"<tr>" +
		"<td align='left'></td>" +
		"<td align='left'></td>" +
		"<td align='left'></td>" +
		"<td align='center'></td>" +
		"<td align='center'></td>" +
		"<td align='center'></td>" +
		"<td align='center'></td>" +
		"<td align='center'><b><u>Approved By:</u></b></td>" +
		"<td align='center'></td>" +
		"</tr>";
//	"</table>";
	return Html;
}
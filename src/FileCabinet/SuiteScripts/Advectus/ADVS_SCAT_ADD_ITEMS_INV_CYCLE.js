/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       09 May 2020     Anirudh Tyagi
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function scheduled(type) {
	
	var CreateSearch	=	nlapiCreateSearch("customrecord_advs_at_annual_stock_take",
			[
			 ["isinactive", "is", "F"],
			 "AND",
			 ["custrecord_advs_annual_progress_status", "anyof", "1"],
			 "AND",
			 ["custrecord_advs_annual_inventory_adjust", "anyof", "@NONE@"]
			 ],
			[
			 new nlobjSearchColumn("internalid", null, null),
			 new nlobjSearchColumn("custrecord_advs_annual_location", null, null),
			 new nlobjSearchColumn("custrecord_advs_annual_count_group", null, null),
			 new nlobjSearchColumn("custrecord_advs_annual_min_average_price", null, null),
			 new nlobjSearchColumn("custrecord_advs_annual_count_type", null, null),
			 new nlobjSearchColumn("custrecord_advs_lo_warehouse_location", "custrecord_advs_annual_location", null)
			 ]
	);
	var CRun	=	CreateSearch.runSearch();
	var CCol	=	CRun.getColumns();
	CRun.forEachResult(function (CRes){
		
		var InternalId	=	CRes.getValue(CCol[0]);
		var LocationId	=	CRes.getValue(CCol[1]);
		var CountGroup	=	CRes.getValue(CCol[2]);
		var AvgPrice	=	CRes.getValue(CCol[3]);
		var CountType	=	CRes.getValue(CCol[4]);
		var WareHouseLocation = CRes.getValue(CCol[5]);
		var SplitGroup	=	new Array();
		if(CountGroup){		
			SplitGroup	=	CountGroup.split(",");			
		}
		
		if(CountType == "2" || CountType == 2){

			var itemSearch = nlapiCreateSearch("inventoryitem",
					[
					 ["type","anyof","InvtPart"], 
					 "AND", 
					 ["isserialitem","is","F"], 
					 "AND", 
					 ["locationquantityonhand","greaterthan","0"], 
					 "AND", 
					 ["custitem_advs_inventory_type","anyof","2"], 
					 "AND", 
					 ["isinactive","is","F"], 
					 "AND", 
					 ["inventorylocation.isinactive","is","F"], 
					 "AND", 
					 ["inventorylocation","anyof", LocationId], 
					 "AND", 
					 ["inventorylocation.makeinventoryavailable","is","T"],  
					 "AND", 
					 ["binnumber.location","anyof", LocationId]
//					 "AND", 
//					 ["binonhandavail","greaterthan","0"]
					 ], 
					 [
					  new nlobjSearchColumn("binnumber").setSort(false),
					  new nlobjSearchColumn("itemid").setSort(false),
					  new nlobjSearchColumn("internalid"), 
					  new nlobjSearchColumn("inventoryLocation",null,null), 
					  new nlobjSearchColumn("internalid", "binnumber"), 
					  new nlobjSearchColumn("binonhandcount"), 
					  new nlobjSearchColumn("locationaveragecost"),
					  new nlobjSearchColumn("displayname"),
					  new nlobjSearchColumn("saleunit"),
					  new nlobjSearchColumn("preferredbin"),
					  new nlobjSearchColumn("custrecord_advs_at_count_group", "binnumber", null).setSort(false),
					  new nlobjSearchColumn("lastpurchaseprice"),
					  ]
			);
			
			var Filters	=	new Array();

			// if(AvgPrice){
			// 	Filters.push(new nlobjSearchFilter("custrecord_advs_annual_min_average_price", null, "greaterthan", AvgPrice));
			// }
			
			if(SplitGroup.length > 0){
				Filters.push(new nlobjSearchFilter("custrecord_advs_at_count_group", "binnumber", "anyof", SplitGroup));
			}

			if(Filters.length > 0){
				itemSearch.addFilters(Filters);
			}
			
			var IRun	=	itemSearch.runSearch();
			var ICol	=	IRun.getColumns();

			var RecentIndex	=	1000,	StartIndex	=	0,	EndIndex	=	1000;	

			var UniqueItemArray		=	new Array();
			var ItemArray			=	new Array();
						
			while(RecentIndex == 1000){

				var Result		=	IRun.getResults(StartIndex, EndIndex);

				for(var i=0;i<Result.length;i++){

					var ExpRes = Result[i];

					var ItemName	=	ExpRes.getValue("internalid");
					var Location	=	ExpRes.getValue("inventoryLocation");
					var BinNo		=	ExpRes.getValue("internalid", "binnumber");
					var BinOnHand 	=	ExpRes.getValue("binonhandcount");
					BinOnHand		=	BinOnHand*1;
					var LocAvgCost	=	ExpRes.getValue("locationaveragecost");
					var lastPurchasePrice =	ExpRes.getValue("lastpurchaseprice");
					LocAvgCost		=	LocAvgCost*1;
					if(LocAvgCost){
						LocAvgCost = LocAvgCost;
					}else{
						LocAvgCost = lastPurchasePrice;
					}
					var DisplayName	=	ExpRes.getValue("displayname");
					var UnitType	=	ExpRes.getText("saleunit");
					var PreferredB	=	ExpRes.getValue("preferredbin");
					var AlternateB	=	ExpRes.getValue("binnumber");
					var BCountGroup	=	ExpRes.getValue("custrecord_advs_at_count_group", "binnumber");
					
					if(SplitGroup.length > 0){
						
						if(PreferredB == "T"){

							if(SplitGroup.indexOf(BCountGroup) != -1){
								
								if(UniqueItemArray.indexOf(ItemName) == -1){
									
									UniqueItemArray.push(ItemName);
									
									ItemArray[ItemName]					=	new Array();
									ItemArray[ItemName]["Location"]		=	Location;
									ItemArray[ItemName]["BinNo"]		=	BinNo;
									ItemArray[ItemName]["BinOnHand"]	=	BinOnHand;
									ItemArray[ItemName]["LocAvgCost"]	=	LocAvgCost;
									ItemArray[ItemName]["DisplayName"]	=	DisplayName;
									ItemArray[ItemName]["UnitType"]		=	UnitType;
									ItemArray[ItemName]["PrefBin"]		=	BinOnHand;
									ItemArray[ItemName]["AlternateB"]	=	"";
									ItemArray[ItemName]["CountGroup"]	=	BCountGroup;
									
								}else{
									
									ItemArray[ItemName]["BinOnHand"]	=	(BinOnHand*1)	+	(ItemArray[ItemName]["BinOnHand"]*1);
									ItemArray[ItemName]["BinNo"]		=	BinNo;
									ItemArray[ItemName]["PrefBin"]		=	BinOnHand;	
									ItemArray[ItemName]["CountGroup"]	=	BCountGroup;
								}
							}							
						}else{
							
							if(UniqueItemArray.indexOf(ItemName) == -1){
								
								UniqueItemArray.push(ItemName);							
								
								ItemArray[ItemName]					=	new Array();
								ItemArray[ItemName]["Location"]		=	Location;
								ItemArray[ItemName]["BinOnHand"]	=	BinOnHand;
								ItemArray[ItemName]["LocAvgCost"]	=	LocAvgCost;
								ItemArray[ItemName]["DisplayName"]	=	DisplayName;
								ItemArray[ItemName]["UnitType"]		=	UnitType;
								ItemArray[ItemName]["AlternateB"]	=	AlternateB;	
							}else{
								
								var AlternateBinValue				=	ItemArray[ItemName]["AlternateB"];
								
								if(!AlternateBinValue){							
									ItemArray[ItemName]["AlternateB"]	=	AlternateB ;
								}else{
									ItemArray[ItemName]["AlternateB"]	=	ItemArray[ItemName]["AlternateB"]+", "+AlternateB ;
								}
								
								ItemArray[ItemName]["BinOnHand"]		=	(BinOnHand*1)	+	(ItemArray[ItemName]["BinOnHand"]*1);
							}
						}

					}else{
					
						if(PreferredB == "T"){
							
							if(UniqueItemArray.indexOf(ItemName) == -1){
								
								UniqueItemArray.push(ItemName);
								
								ItemArray[ItemName]					=	new Array();
								ItemArray[ItemName]["Location"]		=	Location;
								ItemArray[ItemName]["BinNo"]		=	BinNo;
								ItemArray[ItemName]["BinOnHand"]	=	BinOnHand;
								ItemArray[ItemName]["LocAvgCost"]	=	LocAvgCost;
								ItemArray[ItemName]["DisplayName"]	=	DisplayName;
								ItemArray[ItemName]["UnitType"]		=	UnitType;
								ItemArray[ItemName]["PrefBin"]		=	BinOnHand;
								ItemArray[ItemName]["AlternateB"]	=	"";
								ItemArray[ItemName]["CountGroup"]	=	BCountGroup;
								
							}else{
								
								ItemArray[ItemName]["BinOnHand"]	=	(BinOnHand*1)	+	(ItemArray[ItemName]["BinOnHand"]*1);
								ItemArray[ItemName]["BinNo"]		=	BinNo;
								ItemArray[ItemName]["PrefBin"]		=	BinOnHand;	
								ItemArray[ItemName]["CountGroup"]	=	BCountGroup;
							}
							
						}else{
							
							if(UniqueItemArray.indexOf(ItemName) == -1){
								
								UniqueItemArray.push(ItemName);							
								
								ItemArray[ItemName]					=	new Array();
								ItemArray[ItemName]["Location"]		=	Location;
								ItemArray[ItemName]["BinOnHand"]	=	BinOnHand;
								ItemArray[ItemName]["LocAvgCost"]	=	LocAvgCost;
								ItemArray[ItemName]["DisplayName"]	=	DisplayName;
								ItemArray[ItemName]["UnitType"]		=	UnitType;
								ItemArray[ItemName]["AlternateB"]	=	AlternateB;
							}else{
								
								var AlternateBinValue				=	ItemArray[ItemName]["AlternateB"];
								
								if(!AlternateBinValue){							
									ItemArray[ItemName]["AlternateB"]	=	AlternateB ;
								}else{
									ItemArray[ItemName]["AlternateB"]	=	ItemArray[ItemName]["AlternateB"]+", "+AlternateB ;
								}
								
								ItemArray[ItemName]["BinOnHand"]		=	(BinOnHand*1)	+	(ItemArray[ItemName]["BinOnHand"]*1);
							}						
						}
					}					
				}

				RecentIndex		=	Result.length;
				StartIndex		=	EndIndex;
				EndIndex		=	StartIndex + 1000;				
			}	

			var SeqCount = 1,	PagesNo	= 1, PreviousCountGroup	= "",Count = 0;
			if(UniqueItemArray.length > 0 ){
			
				var RecObj		=	nlapiLoadRecord("customrecord_advs_at_annual_stock_take", InternalId, {recordmode:"dynamic"});			
				var SublistName	=	"recmachcustrecord_st_i_c_a_phy_batch";
				
				for(var i=0; i<UniqueItemArray.length; i++){
					
					var ItemName	=	UniqueItemArray[i];
					
					if(ItemArray[ItemName] != null && ItemArray[ItemName] != undefined){

						var ItemName	=	ItemName;
						var Location	=	ItemArray[ItemName]["Location"];
						var BinNo		=	ItemArray[ItemName]["BinNo"];
						var BinOnHand 	=	ItemArray[ItemName]["BinOnHand"];
						BinOnHand		=	BinOnHand*1;
						var LocAvgCost	=	ItemArray[ItemName]["LocAvgCost"];
						LocAvgCost		=	LocAvgCost*1;
						var DisplayName	=	ItemArray[ItemName]["DisplayName"];
						var UnitType	=	ItemArray[ItemName]["UnitType"];
						var AlternateB	=	ItemArray[ItemName]["AlternateB"];
						var PreferredB	=	ItemArray[ItemName]["PrefBin"];
						PreferredB		=	PreferredB*1;
						var CountGroup	=	ItemArray[ItemName]["CountGroup"];
						
						if(PreferredB){
							if(SeqCount > 1){								
								if(SeqCount%35 == 1){								
									PagesNo++;
								}
							}
							
							RecObj.selectNewLineItem(SublistName);
							RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_page_no", PagesNo);
							RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_line_number", SeqCount);
							if(ItemName){
								RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_item", ItemName);	
							}
							
							if(DisplayName){
								RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_display_name", DisplayName);	
							}
							
							if(UnitType){
								RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_unit_type", UnitType);	
							}
							
							if(Location){
								RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_location", Location);	
							}
							
							if(BinNo){
								RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_item_bin", BinNo);	
							}
							
							if(BinOnHand){
								RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_bin_on_hand_avail", BinOnHand);	
							}
							
							if(LocAvgCost){
								RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_actual_unit_cost", LocAvgCost);
								RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_sugg_unit_cost", LocAvgCost);
								RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_actual_total_cost", LocAvgCost);
							}
							
							if(AlternateB){
								RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_alternate_bins", AlternateB);	
							}
							
							if(PreferredB){
								RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_pref_bin_qty", PreferredB);	
							}
							
							if(CountGroup){
								RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_count_group", CountGroup);
							}													
							RecObj.commitLineItem(SublistName);
							PreviousCountGroup	=	CountGroup;
							SeqCount++;
							LineNumber++;
						}
					}				
				}
				
				RecObj.setFieldValue("custrecord_advs_annual_page_count", PagesNo);
				RecObj.setFieldValue("custrecord_advs_annual_progress_status", "2");
				RecObj.setFieldValue("custrecord_advs_annual_message", "");
				nlapiSubmitRecord(RecObj, true, true);
			}else{

				var RecObj	= nlapiLoadRecord("customrecord_advs_at_annual_stock_take", InternalId, {recordmode:"dynamic"});
				RecObj.setFieldValue("custrecord_advs_annual_message", "No items were found according to your criteria.");
				nlapiSubmitRecord(RecObj, true, true);
			}			
		}else if(CountType == "1" || CountType == 1){

			var RecObj		=	nlapiLoadRecord("customrecord_advs_at_annual_stock_take", InternalId, {recordmode:"dynamic"});			
			var SublistName	=	"recmachcustrecord_st_i_c_a_phy_batch";

			var itemSearch = nlapiCreateSearch("inventoryitem",
					[
					 ["type","anyof","InvtPart"], 
					 "AND", 
					 ["isserialitem","is","F"], 
					 "AND", 
					 ["locationquantityonhand","greaterthan","0"], 
					 "AND", 
					 ["custitem_advs_inventory_type","anyof","2"], 
					 "AND", 
					 ["isinactive","is","F"], 
					 "AND", 
					 ["inventorylocation.isinactive","is","F"], 
					 "AND", 
					 ["inventorylocation","anyof", LocationId], 
					 "AND", 
					 ["inventorylocation.makeinventoryavailable","is","T"], 
//					 "AND", 
//					 ["preferredbin","is","T"], 
					 "AND", 
					 ["binnumber.location","anyof", LocationId],
					 "AND", 
					 ["binonhandcount","greaterthan","0"]
					 ], 
					 [
					  new nlobjSearchColumn("binnumber").setSort(false),
					  new nlobjSearchColumn("itemid").setSort(false),
					  new nlobjSearchColumn("internalid"), 
					  new nlobjSearchColumn("inventoryLocation",null,null), 
					  new nlobjSearchColumn("internalid", "binnumber"), 
					  new nlobjSearchColumn("binonhandcount"), 
					  new nlobjSearchColumn("locationaveragecost"),
					  new nlobjSearchColumn("displayname"),
					  new nlobjSearchColumn("saleunit"),
					  new nlobjSearchColumn("custrecord_advs_at_count_group", "binnumber", null).setSort(false),
					  new nlobjSearchColumn("lastpurchaseprice"),
					  ]
			);

			var Filters	=	new Array();

			if(AvgPrice){
				Filters.push(new nlobjSearchFilter("custrecord_advs_annual_min_average_price", null, "greaterthan", AvgPrice));
			}
			
			if(SplitGroup.length > 0){
				Filters.push(new nlobjSearchFilter("custrecord_advs_at_count_group", "binnumber", "anyof", SplitGroup));
			}

			if(Filters.length > 0){
				itemSearch.addFilters(Filters);
			}

			var IRun	=	itemSearch.runSearch();
			var ICol	=	IRun.getColumns();

			var RecentIndex	=	1000,	StartIndex	=	0,	EndIndex	=	1000;	

			var SeqCount	=	1,	PagesNo		=	1, PreviousCountGroup	=	"", FlagForLines	=	"F";
			while(RecentIndex == 1000){

				var Result		=	IRun.getResults(StartIndex, EndIndex);

				for(var i=0;i<Result.length;i++){

					var ExpRes = Result[i];

					var ItemName	=	ExpRes.getValue("internalid");
					nlapiLogExecution('DEBUG', 'ItemNameval', ItemName);
					var Location	=	ExpRes.getValue("inventoryLocation");
					nlapiLogExecution('DEBUG', 'Locationval', Location);
					var BinNo		=	ExpRes.getValue("internalid", "binnumber");
					var BinOnHand 	=	ExpRes.getValue("binonhandcount");
					BinOnHand		=	BinOnHand*1;
					var LocAvgCost	=	ExpRes.getValue("locationaveragecost");
					var lastPurchasePrice =	ExpRes.getValue("lastpurchaseprice");
					LocAvgCost		=	LocAvgCost*1;
					if(LocAvgCost){
						LocAvgCost = LocAvgCost;
					}else{
						LocAvgCost = lastPurchasePrice;
					}
					LocAvgCost		=	LocAvgCost*1;
					var DisplayName	=	ExpRes.getValue("displayname");
					var UnitType	=	ExpRes.getText("saleunit");
					var CountGroup	=	ExpRes.getValue("custrecord_advs_at_count_group", "binnumber");
					
					if(SeqCount > 1){						
						if(SeqCount%35 == 1){
							PagesNo++;
						}
					}

					RecObj.selectNewLineItem(SublistName);
					RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_page_no", PagesNo);
					RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_line_number", SeqCount);
					if(ItemName){
						RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_item", ItemName);	
					}
					
					if(DisplayName){
						RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_display_name", DisplayName);	
					}
					
					if(UnitType){
						RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_unit_type", UnitType);	
					}
					
					if(Location){
						RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_location", Location);	
					}
					
					if(BinNo){
						RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_item_bin", BinNo);	
					}
					
					if(BinOnHand){
						RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_bin_on_hand_avail", BinOnHand);	
					}
					
					if(LocAvgCost){
						RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_actual_unit_cost", LocAvgCost);
						RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_sugg_unit_cost", LocAvgCost);
						RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_actual_total_cost", LocAvgCost);
					}
					
					if(CountGroup){
						RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_count_group", CountGroup);
					}
					
					RecObj.commitLineItem(SublistName);

					PreviousCountGroup	=	CountGroup;
					
					SeqCount++;
					
					FlagForLines = "T";
				}

				RecentIndex		=	Result.length;
				StartIndex		=	EndIndex;
				EndIndex		=	StartIndex + 1000;				
			}	

			if(WareHouseLocation == 'T'){
				var NewPages = 550;
			}else{
				var NewPages = 30;
			}
//			if(SeqCount > 10000){
				var StartLine = (SeqCount*1);
				var ModLines = (SeqCount*1)%35;
				if(ModLines > 0){
					var RemainingLines = 35 - (ModLines*1);	
				}else{
					var RemainingLines = 0;
				}
				var AddLines = (NewPages*35)+(RemainingLines*1);
				var TotalLines = (StartLine*1)+(AddLines*1);
				var LastLine = (TotalLines*1)-1;
				for(var k=StartLine;k<TotalLines;k++){
					if((k%35 == 1)){
						PagesNo++;
					}
					RecObj.selectNewLineItem(SublistName);
					RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_page_no", PagesNo);
					RecObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_line_number", k);
//					RecordObj.setCurrentLineItemValue(SublistName, "custrecord_st_i_c_a_count_group", CountGrp);
					RecObj.commitLineItem(SublistName,true);
				}
//			}
			
			if(FlagForLines == "F"){
				RecObj.setFieldValue("custrecord_advs_annual_message", "No items were found according to your criteria.");
			}else{
				RecObj.setFieldValue("custrecord_advs_annual_message", "");
			}
			
			RecObj.setFieldValue("custrecord_advs_annual_page_count", PagesNo);
			RecObj.setFieldValue("custrecord_advs_annual_progress_status", "2");
			nlapiSubmitRecord(RecObj, true, true);
		}
		
		return true;		
	});
	
	
	function mySorting(a,b) { 
		a = a[1];
		b = b[1];
		return a == b ? 0 : (a < b ? -1 : 1)
	}
	
}
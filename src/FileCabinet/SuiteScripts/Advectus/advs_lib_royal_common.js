/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       24 Jun 2021     Advectus
 *
 */

var oneTime	=	0;
var globalLp	=	0;
var PriceSetupExist	=	"";var specialPExist=	"F";
function fetchPricing(Part,PriceLevel,Customer,SubsiMkp,HomeLoc,LocMain,CustomerBasePrice,VendorMArgin,
		PartSubgpMargin,LociMArkup,BasePrice,specialPEnable,PrefVEnd,PartSubgp,BrandP,ListPriceold,AMarginCost){

	var ItemId	=	Part;
	var Psgp	=	PartSubgp;
	if(!AMarginCost){
		AMarginCost	=	1;
	}


	var MultyID			=	"";
	var RebatePlus		=	"";	
	var Availability	=	0;

	
	/*var PromotionPrice	=	"0";
	if(PromotionArray[ItemId] != null && PromotionArray[ItemId] != undefined){
		PromotionPrice	=	PromotionArray[ItemId]*1;
	}
	PromotionPrice		=	PromotionPrice*1;
	PromotionPrice		=	PromotionPrice.toFixed(2);
	PromotionPrice		=	PromotionPrice*1;*/
	
//	nlapiLogExecution("DEBUG", "PromotionPrice11", PromotionPrice);

	if(PrefVEnd){
		if(ArrayRebatePrice[PrefVEnd] != null && ArrayRebatePrice[PrefVEnd] != undefined){		
			MultyID		=	ArrayRebatePrice[PrefVEnd]["MultyID"];
			RebatePlus		=	ArrayRebatePrice[PrefVEnd]["RebatePlus"];	
			Availability++;
		}
		var vendorPEr	=	"";
		if(ArrayRebatevendorPrice[PrefVEnd] != null && ArrayRebatevendorPrice[PrefVEnd] != undefined){		
			vendorPEr		=	ArrayRebatevendorPrice[PrefVEnd];
			Availability++;
		}
		
		
//		if(PromotionPrice >0){
//			Availability	=	0;
//		}
		
		nlapiLogExecution("DEBUG", "Availability", Availability);
		if(Availability>=2){
			ListPrice	=	0;
			if(oneTime == 0){
				var pricinginfo	=	createSOCheck(Customer,LocMain,ItemId,9);
				var ListPrice	=	pricinginfo.price;
				globalLp	=	ListPrice;
				oneTime++;
			}



			nlapiLogExecution("DEBUG", "ListPrice", ListPrice+"=>"+PrefVEnd+"=>"+globalLp);

			var BasePrice	=	globalLp;
			var VBasePrice	=	BasePrice;

			var CustRebatePerc		=	parseFloat(MultyID);
			var tempcustprice		=	((BasePrice*CustRebatePerc)/100);
			tempcustprice			=	tempcustprice*1;
//			tempcustprice			=	tempcustprice.toFixed(2);
			tempcustprice			=	tempcustprice*1;
			if(RebatePlus==1){
				tempcustprice			=	tempcustprice+BasePrice;
			}else{
				tempcustprice			=	BasePrice-tempcustprice;
			}

			tempcustprice			=	tempcustprice*1;
			tempcustprice			=	tempcustprice.toFixed(2);

			tempcustprice			=	tempcustprice*1;

			var VendorRebatePerc	=	parseFloat(vendorPEr);
			var vendorMArkup		=	((VBasePrice*VendorRebatePerc)/100);
			vendorMArkup			=	vendorMArkup*1;

			var differenceB			=	VBasePrice-tempcustprice;
			differenceB				=	differenceB*1;

			var vendorRebate		= 	differenceB+vendorMArkup;
			vendorRebate			=	vendorRebate*1;
			vendorRebate			=	vendorRebate.toFixed(2);
			vendorRebate			=	vendorRebate*1;
			
			var tempREceive			=	((tempcustprice*VendorRebatePerc)/100);
			tempREceive				=	tempREceive*1;
			tempREceive				=	tempREceive.toFixed(2);
			tempREceive				=	tempREceive*1;

			var RebateREceive		=	differenceB+tempREceive;
			RebateREceive			=	RebateREceive*1;

			vendorRebateGlob	=	vendorRebate;
			rebrecv	=	RebateREceive;

			var retParam	=	tempcustprice+"$rat$"+tempcustprice+"$rat$"+"REBT";
			return retParam;
		}

	}
	////Special Price

	if(Availability <2){

		var Priority	=	0;
		var SpecialItemID	=	"";
		if(ArrayForItemPrice[ItemId] != null && ArrayForItemPrice[ItemId] != undefined){
			SpecialItemID	=	ArrayForItemPrice[ItemId];
			Priority++;
		}else if(PricebyGroup[Psgp] != null && PricebyGroup[Psgp] != undefined){
			SpecialItemID	=	PricebyGroup[Psgp];
			Priority++;
		}else if(PricebyBrand[BrandP] != null && PricebyBrand[BrandP] != undefined){
			SpecialItemID	=	PricebyBrand[BrandP];
			Priority++;
		}



		if(Priority == 0){
			SpecialItemID	=	SpOnlyArr[0];
		}

		if(PricebyPLevel[ItemId]!= null && PricebyPLevel[ItemId] != undefined){
			
			var spPriceLEvel	=	PricebyPLevel[ItemId]["Plevel"];
			var SetupID			=	PricebyPLevel[ItemId]["SetupID"];
			if(spPriceLEvel){
//				nlapiSetCurrentLineItemValue("item", "price", spPriceLEvel, true, true);
				PriceSetupExist	=	spPriceLEvel;
				Priority++;
				SpecialItemID	=SetupID;
				var pricinginfo	=	createSOCheck(Customer,LocMain,ItemId,spPriceLEvel);
				var ListPrice	=	pricinginfo.price;
				BasePrice		=	ListPrice;

			}
		}else if(PricebySBSPPLevel[Psgp] != null && PricebySBSPPLevel[Psgp] != undefined){
			var spPriceLEvel	=	PricebySBSPPLevel[Psgp]["Plevel"];
			var SetupID			=	PricebySBSPPLevel[Psgp]["SetupID"];
			if(spPriceLEvel){
//				nlapiSetCurrentLineItemValue("item", "price", spPriceLEvel, true, true);
				PriceSetupExist	=	spPriceLEvel;
				Priority++;
				SpecialItemID	=SetupID;
				var pricinginfo	=	createSOCheck(Customer,LocMain,ItemId,spPriceLEvel);
				var ListPrice	=	pricinginfo.price;
				BasePrice		=	ListPrice;

			}
		}else if(PricebyBrandPLevel[BrandP] != null && PricebyBrandPLevel[BrandP] != undefined){
			var spPriceLEvel	=	PricebyBrandPLevel[BrandP]["Plevel"];
			var SetupID			=	PricebyBrandPLevel[BrandP]["SetupID"];
			if(spPriceLEvel){
//				nlapiSetCurrentLineItemValue("item", "price", spPriceLEvel, true, true);
				PriceSetupExist	=	spPriceLEvel;
				Priority++;
				SpecialItemID	=SetupID;
				var pricinginfo	=	createSOCheck(Customer,LocMain,ItemId,spPriceLEvel);
				var ListPrice	=	pricinginfo.price;
				BasePrice		=	ListPrice;

			}
		}

		nlapiLogExecution("DEBUG", "specialPEnable", specialPEnable+"=>"+SpecialItemID+"=>"+PriceSetupExist);
		if(specialPEnable == "T"){
		if(SpecialItemID*1 >= 1){
				var lookFld	=	["custrecord_st_c_p_p_calc_price","custrecord_advs_c_p_p_disc","custrecord_advs_c_p_p_markup_add"];
				var lookRec	=	nlapiLookupField("customrecord_advs_st_cust_part_pricing", SpecialItemID, lookFld);
				var SpPrice		  =		lookRec.custrecord_st_c_p_p_calc_price;
				var SpPriceDis    =    lookRec.custrecord_advs_c_p_p_disc;
				var addMarkup    =    lookRec.custrecord_advs_c_p_p_markup_add;
				
				if(addMarkup != "T"){
					var BasePr   	  =   BasePrice*1;

					if(SpPriceDis){
						SpPriceDis	=	parseFloat(SpPriceDis);
					}
					SpPriceDis		=	SpPriceDis*1;

					nlapiLogExecution("DEBUG", "SpPriceDis@@@", SpPriceDis+"=>"+SpPrice+"=>"+BasePr);
					if(SpPrice>0){
						SpecialPriceTotal	=	SpPrice;
						var NewSPPrice	=	SpPrice;
						
						specialPExist=	"T";
						specialPID	="";
						NewSPPrice	=	findServiceMarginCost(SpPrice,SubsiMkp);
						var retParam	=	SpPrice+"$rat$"+NewSPPrice+"$rat$"+"SPRICE";
						return retParam;

						/*if((PromotionPrice > 0) && (PromotionPrice < NewSPPrice)){

							

						}else{
							specialPExist=	"T";
							var retParam	=	SpPrice+"$rat$"+NewSPPrice+"$rat$"+"SPRICE";
							return retParam;
							
						}*/


					}else{
//						if((SpPriceDis>0) && (BasePr>0)){
						if(BasePr>0){

							var CalcAmnt	=	((BasePr*SpPriceDis)/100);
							CalcAmnt		=	CalcAmnt*1;

							var Miinus	=	(BasePr+CalcAmnt);
							Miinus			=	Miinus*1
							Miinus		=	Miinus.toFixed(2);
							Miinus		=	Miinus*1;

							var NewSPPrice	=	Miinus;
							specialPExist=	"T";
							specialPID	="";
							NewSPPrice	=	findServiceMarginCost(Miinus,SubsiMkp);
							var retParam	=	Miinus+"$rat$"+NewSPPrice+"$rat$"+"SPRICE";
							return retParam;
							
							/*nlapiLogExecution("DEBUG", "PromotionPrice@@@", PromotionPrice+"=>"+SpPriceDis+"=>"+BasePr+"=>"+NewSPPrice);
							if((PromotionPrice > 0) && (PromotionPrice < NewSPPrice)){

							

							}else{
								specialPExist=	"T";
								NewSPPrice	=	findServiceMarginCost(Miinus,SubsiMkp);
								var retParam	=	Miinus+"$rat$"+NewSPPrice+"$rat$"+"SPRICE";
								return retParam;
								

								
							}*/

						}
					}
				}else{
					nlapiLogExecution("DEBUG", "PriceSetupExist", PriceSetupExist);
					if(PriceSetupExist){
						//////// Part and Plevel

						var ItemId	=	Part;
						var Psgp	=	PartSubgp;


						var MultyID			=	"";
						var RebatePlus		=	"";	
						var Availability	=0;

						var BaseRate	=	BasePrice;
						if(PriceLevel != null && PriceLevel != undefined && PriceLevel != ""){
							BaseRate	=	CustomerBasePrice
						}else{
							PriceLevel	=	1;
						}
						
						PriceLevel=	PriceSetupExist;
						
						var pricinginfo	=	createSOCheck(Customer,LocMain,ItemId,PriceLevel);
						var ListPrice	=	pricinginfo.price;
						
						BaseRate		=	ListPrice;
						var OrderAmount	=	0;

						nlapiLogExecution("DEBUG", "pricinginfo", pricinginfo+"=>"+pricinginfo.price);
						nlapiLogExecution("DEBUG", "BaseRateSpprice", BaseRate+"==>"+Part+"==>"+PriceLevel+"=>"+CustomerBasePrice);
						if(BaseRate){

//							alert(PriceLevel+"==>"+"Validate");	
							var NewPrice	=0;
							/*var search	=	nlapiCreateSearch("customrecord_advs_p_pricing_buffer", [
								          	 	                                                         ["custrecord_advs_p_p_b_part","anyof",Itemval]
								          	 	                                                         ,"AND",
								          	 	                                                         ["isinactive","is","F"]
								          	 	                                                         ], [
								          	 	                                                             new nlobjSearchColumn("custrecord_advs_p_p_calc_new_price", null, null)
								          	 	                                                             ]);
								var run		=	search.runSearch();
								var cols	=	run.getColumns();
								run.forEachResult(function(record) {
									NewPrice	=	record.getValue("custrecord_advs_p_p_calc_new_price", null, null)*1;
									return true;
								});*/

							NewPrice					=	BaseRate;
							NewPrice					=	NewPrice*1;
//							alert(NewPrice);


							var ManufMarkup				=	VendorMArgin;

							var SubGpMarkup				=	PartSubgpMargin;


//							var ManufMarkup				=	nlapiGetCurrentLineItemValue(type, "custcol_advs_manu_margin");
//							var SubGpMarkup				=	nlapiGetCurrentLineItemValue(type, "custcol_advs_subgp_margin");
							var LocationM				=	LociMArkup;
							var Location				=	LocMain;
//							var ABCCatego				=	nlapiGetCurrentLineItemValue(type, "custcol_advs_abc_markup");

							//Manufacturer
							var ManufacturerplusPrice	=0;
							if(ManufMarkup){
								var tempManuMarkup			=	parseFloat(ManufMarkup);
								tempManuMarkup				=	tempManuMarkup*1;
								var DiscAmount				=	CalculateQuantityDiscPortionU(tempManuMarkup,0,NewPrice);
								DiscAmount					=	DiscAmount*1;

								ManufacturerplusPrice	    =	DiscAmount;
								ManufacturerplusPrice		=	ManufacturerplusPrice*1;
								ManufacturerplusPrice		=	ManufacturerplusPrice.toFixed(2);
								ManufacturerplusPrice		=	ManufacturerplusPrice*1;

							}

							///Subgroup
							var SBGpplusPrice	=	0;
							if(SubGpMarkup){
								var tempSubgroupMarkup			=	parseFloat(SubGpMarkup);
								tempSubgroupMarkup				=	tempSubgroupMarkup*1;
								var DiscAmount					=	CalculateQuantityDiscPortionU(tempSubgroupMarkup,0,NewPrice);
								DiscAmount						=	DiscAmount*1;

								SBGpplusPrice					=	DiscAmount;
							}


							///LocationMp
							var locplusPrice	=0;
							if(LocationM){
								var tempLocMarkup				=	parseFloat(LocationM);
								tempLocMarkup					=	tempLocMarkup*1;
								var DiscAmount					=	CalculateQuantityDiscPortionU(tempLocMarkup,0,NewPrice);
								DiscAmount						=	DiscAmount*1;

								locplusPrice		=	DiscAmount;
								locplusPrice		=	locplusPrice*1;
								locplusPrice		=	locplusPrice.toFixed(2);
								locplusPrice		=	locplusPrice*1;
							}


							///ABCMp
							var tempabcMarkup				=	parseFloat(AMarginCost);
							tempabcMarkup					=	tempabcMarkup*1;
							var DiscAmount					=	CalculateQuantityDiscPortionU(tempabcMarkup,0,NewPrice);
							DiscAmount						=	DiscAmount*1;

							var AbcplusPrice	=	DiscAmount;
							AbcplusPrice		=	AbcplusPrice*1;
							AbcplusPrice		=	AbcplusPrice.toFixed(2);
							AbcplusPrice		=	AbcplusPrice*1;


//							alert(AbcplusPrice+"==>"+locplusPrice+"==>"+ManufacturerplusPrice+"==>"+SBGpplusPrice);
							nlapiLogExecution("DEBUG", "AbcplusSpPrice", AbcplusPrice+"==>"+locplusPrice+"==>"+ManufacturerplusPrice+"==>"+SBGpplusPrice);

							OrderAmount	=	(AbcplusPrice+locplusPrice+ManufacturerplusPrice+SBGpplusPrice+NewPrice);
							OrderAmount		=	OrderAmount*1;
							OrderAmount		=	OrderAmount.toFixed(2);
							OrderAmount		=	OrderAmount*1;
							var FrontConterAmount	=	OrderAmount;

//							alert("OrderAmount==>"+OrderAmount);
							


							var ServiceMargin	=	SubsiMkp;
							if(ServiceMargin){
								ServiceMargin		=	parseFloat(ServiceMargin);

								if(ServiceMargin>0){
									var DiscAmount					=	CalculateQuantityDiscPortionU(OrderAmount,0,ServiceMargin);
									DiscAmount						=	DiscAmount*1;

									DiscAmount		=	DiscAmount.toFixed(2);
									DiscAmount		=	DiscAmount*1;

									var NewAmount		=	DiscAmount+OrderAmount;
									NewAmount		=	NewAmount*1;
									NewAmount		=	NewAmount.toFixed(2);
									NewAmount		=	NewAmount*1;


									var BAckCounterAmount	=	NewAmount;
									nlapiLogExecution("DEBUG", "BAckCounterSPAmount", DiscAmount+"==>"+NewAmount+"==>"+OrderAmount+"=>"+ServiceMargin);
									if(OrderAmount>0){
										OrderAmount	=	NewAmount;
//										nlapiSetCurrentLineItemValue("item", "rate", NewAmount, true, true);
									}
								}else{
									if(OrderAmount>0){
//										OrderAmount	=	OrderAmount;
//										nlapiSetCurrentLineItemValue("item", "rate", OrderAmount, true, true);
									}
								}
							}else{
								if(OrderAmount>0){
//									OrderAmount	=	OrderAmount;
//									nlapiSetCurrentLineItemValue("item", "rate", OrderAmount, true, true);
								}
							}
							specialPExist=	"T";
							var retParam	=	FrontConterAmount+"$rat$"+BAckCounterAmount+"$rat$"+"MARKP";
							return retParam;
						}else{
							var retParam	=	0+"$rat$"+0+"$rat$"+"MARKP";
							return retParam;
						}
					}else{
						var retParam	=	0+"$rat$"+0+"$rat$"+"NONE";
						return retParam;
		/*				if(PromotionPrice > 0){

							var retParam	=	PromotionPrice+"$rat$"+PromotionPrice+"$rat$"+"PROMO";
							return retParam;
						}else{
							var retParam	=	0+"$rat$"+0+"$rat$"+"NONE";
							return retParam;
						}*/
					}
				}
				
				
			
		}else{

			
			
			
		}
	}else{
		var retParam	=	0+"$rat$"+0+"$rat$"+"NONE";
		return retParam;
//		if(PromotionPrice > 0){
//
//			var retParam	=	PromotionPrice+"$rat$"+PromotionPrice+"$rat$"+"PROMO";
//			return retParam;
//		}else{
//			var retParam	=	0+"$rat$"+0+"$rat$"+"NONE";
//			return retParam;
//		}
	}


	}else{
		var retParam	=	0+"$rat$"+0+"$rat$"+"NONE";
		return retParam;
	/*	if(PromotionPrice > 0){

			var retParam	=	PromotionPrice+"$rat$"+PromotionPrice+"$rat$"+"PROMO";
			return retParam;
		}else{
			var retParam	=	0+"$rat$"+0+"$rat$"+"NONE";
			return retParam;
		}*/
	}




}




function fetchPricingLevel(Part,PriceLevel,Customer,SubsiMkp,HomeLoc,LocMain,CustomerBasePrice,VendorMArgin,
		PartSubgpMargin,LociMArkup,BasePrice,specialPEnable,PrefVEnd,PartSubgp,BrandP,ListPriceold,AMarginCost){

	var ItemId	=	Part;
	var Psgp	=	PartSubgp;
	if(!AMarginCost){
		AMarginCost	=	1;
	}


	var MultyID			=	"";
	var RebatePlus		=	"";	
	var Availability	=0;

	var BaseRate	=	BasePrice;
	if(PriceLevel != null && PriceLevel != undefined && PriceLevel != ""){
		BaseRate	=	CustomerBasePrice
	}else{
		PriceLevel	=	1;
	}
	var OrderAmount	=	0;


	nlapiLogExecution("DEBUG", "BaseRate", BaseRate+"==>"+Part+"==>"+PriceLevel+"=>"+CustomerBasePrice+"=>"+AMarginCost);
	if(BaseRate){

//		alert(PriceLevel+"==>"+"Validate");	
		var NewPrice	=0;
		/*var search	=	nlapiCreateSearch("customrecord_advs_p_pricing_buffer", [
			          	 	                                                         ["custrecord_advs_p_p_b_part","anyof",Itemval]
			          	 	                                                         ,"AND",
			          	 	                                                         ["isinactive","is","F"]
			          	 	                                                         ], [
			          	 	                                                             new nlobjSearchColumn("custrecord_advs_p_p_calc_new_price", null, null)
			          	 	                                                             ]);
			var run		=	search.runSearch();
			var cols	=	run.getColumns();
			run.forEachResult(function(record) {
				NewPrice	=	record.getValue("custrecord_advs_p_p_calc_new_price", null, null)*1;
				return true;
			});*/

		NewPrice					=	BaseRate;
		NewPrice					=	NewPrice*1;
//		alert(NewPrice);


		var ManufMarkup				=	VendorMArgin;

		var SubGpMarkup				=	PartSubgpMargin;


//		var ManufMarkup				=	nlapiGetCurrentLineItemValue(type, "custcol_advs_manu_margin");
//		var SubGpMarkup				=	nlapiGetCurrentLineItemValue(type, "custcol_advs_subgp_margin");
		var LocationM				=	LociMArkup;
		var Location				=	LocMain;
//		var ABCCatego				=	nlapiGetCurrentLineItemValue(type, "custcol_advs_abc_markup");

		//Manufacturer
		var ManufacturerplusPrice	=0;
		if(ManufMarkup){
			var tempManuMarkup			=	parseFloat(ManufMarkup);
			tempManuMarkup				=	tempManuMarkup*1;
			var DiscAmount				=	CalculateQuantityDiscPortionU(tempManuMarkup,0,NewPrice);
			DiscAmount					=	DiscAmount*1;

			ManufacturerplusPrice	    =	DiscAmount;
			ManufacturerplusPrice		=	ManufacturerplusPrice*1;
			ManufacturerplusPrice		=	ManufacturerplusPrice.toFixed(2);
			ManufacturerplusPrice		=	ManufacturerplusPrice*1;

		}

		///Subgroup
		var SBGpplusPrice	=	0;
		if(SubGpMarkup){
			var tempSubgroupMarkup			=	parseFloat(SubGpMarkup);
			tempSubgroupMarkup				=	tempSubgroupMarkup*1;
			var DiscAmount					=	CalculateQuantityDiscPortionU(tempSubgroupMarkup,0,NewPrice);
			DiscAmount						=	DiscAmount*1;

			SBGpplusPrice					=	DiscAmount;
		}


		///LocationMp
		var locplusPrice	=0;
		if(LocationM){
			var tempLocMarkup				=	parseFloat(LocationM);
			tempLocMarkup					=	tempLocMarkup*1;
			var DiscAmount					=	CalculateQuantityDiscPortionU(tempLocMarkup,0,NewPrice);
			DiscAmount						=	DiscAmount*1;

			locplusPrice		=	DiscAmount;
			locplusPrice		=	locplusPrice*1;
			locplusPrice		=	locplusPrice.toFixed(2);
			locplusPrice		=	locplusPrice*1;
		}
		

		///ABCMp
		var tempabcMarkup				=	parseFloat(AMarginCost);
		tempabcMarkup					=	tempabcMarkup*1;
		var DiscAmount					=	CalculateQuantityDiscPortionU(tempabcMarkup,0,NewPrice);
		DiscAmount						=	DiscAmount*1;

		var AbcplusPrice	=	DiscAmount;
		AbcplusPrice		=	AbcplusPrice*1;
		AbcplusPrice		=	AbcplusPrice.toFixed(2);
		AbcplusPrice		=	AbcplusPrice*1;


//		alert(AbcplusPrice+"==>"+locplusPrice+"==>"+ManufacturerplusPrice+"==>"+SBGpplusPrice);
		nlapiLogExecution("DEBUG", "AbcplusPrice", AbcplusPrice+"==>"+locplusPrice+"==>"+ManufacturerplusPrice+"==>"+SBGpplusPrice);

		OrderAmount	=	(AbcplusPrice+locplusPrice+ManufacturerplusPrice+SBGpplusPrice+NewPrice);
		OrderAmount		=	OrderAmount*1;
		OrderAmount		=	OrderAmount.toFixed(2);
		OrderAmount		=	OrderAmount*1;
		var FrontConterAmount	=	OrderAmount;

//		alert("OrderAmount==>"+OrderAmount);


		var ServiceMargin	=	SubsiMkp;
		if(ServiceMargin){
			ServiceMargin		=	parseFloat(ServiceMargin);

			if(ServiceMargin>0){
				var DiscAmount					=	CalculateQuantityDiscPortionU(OrderAmount,0,ServiceMargin);
				DiscAmount						=	DiscAmount*1;

//				DiscAmount		=	DiscAmount.toFixed(2);
//				DiscAmount		=	DiscAmount*1;

				var NewAmount		=	DiscAmount+OrderAmount;
				NewAmount		=	NewAmount*1;
				NewAmount		=	NewAmount.toFixed(2);
				NewAmount		=	NewAmount*1;


				var BAckCounterAmount	=	NewAmount;
				nlapiLogExecution("DEBUG", "BAckCounterAmount", DiscAmount+"==>"+NewAmount+"==>"+OrderAmount+"=>"+ServiceMargin);
				if(OrderAmount>0){
					OrderAmount	=	NewAmount;
//					nlapiSetCurrentLineItemValue("item", "rate", NewAmount, true, true);
				}
			}else{
				if(OrderAmount>0){
//					OrderAmount	=	OrderAmount;
//					nlapiSetCurrentLineItemValue("item", "rate", OrderAmount, true, true);
				}
			}
		}else{
			if(OrderAmount>0){
//				OrderAmount	=	OrderAmount;
//				nlapiSetCurrentLineItemValue("item", "rate", OrderAmount, true, true);
			}
		}
		var retParam	=	FrontConterAmount+"$rat$"+BAckCounterAmount;
		return retParam;
	}else{
		var retParam	=	0+"$rat$"+0;
		return retParam;
	}





}

var vendorRebateGlob	=	0;
var rebrecv	=	0;
function fetchPricingOper(Part,PriceLevel,Customer,SubsiMkp,HomeLoc,LocMain,CustomerBasePrice,VendorMArgin,
		PartSubgpMargin,LociMArkup,BasePrice,specialPEnable,PrefVEnd,PartSubgp,BrandP,ListPriceP,AMarginCost){

	var ItemId	=	Part;
	var Psgp	=	PartSubgp;
	
	specialPExist=	"F";
	 vendorRebateGlob	=	0;
	 rebrecv	=	0;


	var MultyID			=	"";
	var RebatePlus		=	"";	
	var Availability	=	0;

	
	var PromotionPrice	=	"0";
	if(PromotionArray[ItemId] != null && PromotionArray[ItemId] != undefined){
		PromotionPrice	=	PromotionArray[ItemId]*1;
	}
	PromotionPrice		=	PromotionPrice*1;
	PromotionPrice		=	PromotionPrice.toFixed(2);
	PromotionPrice		=	PromotionPrice*1;
	
	nlapiLogExecution("DEBUG", "PromotionPrice11", PromotionPrice);

	if(PrefVEnd){
		if(ArrayRebatePrice[PrefVEnd] != null && ArrayRebatePrice[PrefVEnd] != undefined){		
			MultyID		=	ArrayRebatePrice[PrefVEnd]["MultyID"];
			RebatePlus		=	ArrayRebatePrice[PrefVEnd]["RebatePlus"];	
			Availability++;
		}
		var vendorPEr	=	"";
		if(ArrayRebatevendorPrice[PrefVEnd] != null && ArrayRebatevendorPrice[PrefVEnd] != undefined){		
			vendorPEr		=	ArrayRebatevendorPrice[PrefVEnd];
			Availability++;
		}
		
		
		if(PromotionPrice >0){
			Availability	=	0;
		}
		
		nlapiLogExecution("DEBUG", "Availability", Availability);
		if(Availability>=2){
			 var ListPrice	=	ListPriceP;
			 var globalLp	=	ListPrice;
			/*if(oneTime == 0){
				var pricinginfo	=	ListPrice*;//createSOCheck(Customer,LocMain,ItemId,9);
				var ListPrice	=	pricinginfo.price;
				globalLp	=	ListPrice;
				oneTime++;
			}*/



			nlapiLogExecution("DEBUG", "ListPrice", ListPrice+"=>"+PrefVEnd+"=>"+globalLp);

			var BasePrice	=	globalLp;
			var VBasePrice	=	BasePrice;

			var CustRebatePerc		=	parseFloat(MultyID);
			var tempcustprice		=	((BasePrice*CustRebatePerc)/100);
			tempcustprice			=	tempcustprice*1;
//			tempcustprice			=	tempcustprice.toFixed(2);
			tempcustprice			=	tempcustprice*1;
			if(RebatePlus==1){
				tempcustprice			=	tempcustprice+BasePrice;
			}else{
				tempcustprice			=	BasePrice-tempcustprice;
			}

			tempcustprice			=	tempcustprice*1;
			tempcustprice			=	tempcustprice.toFixed(2);

			tempcustprice			=	tempcustprice*1;

			var VendorRebatePerc	=	parseFloat(vendorPEr);
			var vendorMArkup		=	((VBasePrice*VendorRebatePerc)/100);
			vendorMArkup			=	vendorMArkup*1;

			var differenceB			=	VBasePrice-tempcustprice;
			differenceB				=	differenceB*1;

			var vendorRebate		= 	differenceB+vendorMArkup;
			vendorRebate			=	vendorRebate*1;
			vendorRebate			=	vendorRebate.toFixed(2);
			vendorRebate			=	vendorRebate*1;
			
			var tempREceive			=	((tempcustprice*VendorRebatePerc)/100);
			tempREceive				=	tempREceive*1;
			tempREceive				=	tempREceive.toFixed(2);
			tempREceive				=	tempREceive*1;

			var RebateREceive		=	differenceB+tempREceive;
			RebateREceive			=	RebateREceive*1;

			vendorRebateGlob	=	vendorRebate;
			rebrecv	=	RebateREceive;

			var retParam	=	tempcustprice+"$rat$"+tempcustprice+"$rat$"+"REBT";
			return retParam;
		}

	}
	////Special Price

	if(Availability <2 && PromotionPrice<=0){

		var Priority	=	0;
		var SpecialItemID	=	"";
		if(ArrayForItemPrice[ItemId] != null && ArrayForItemPrice[ItemId] != undefined){
			SpecialItemID	=	ArrayForItemPrice[ItemId];
			Priority++;
		}else if(PricebyGroup[Psgp] != null && PricebyGroup[Psgp] != undefined){
			SpecialItemID	=	PricebyGroup[Psgp];
			Priority++;
		}else if(PricebyBrand[BrandP] != null && PricebyBrand[BrandP] != undefined){
			SpecialItemID	=	PricebyBrand[BrandP];
			Priority++;
		}



		if(Priority == 0){
			SpecialItemID	=	SpOnlyArr[0];
		}

		if(PricebyPLevel[ItemId]!= null && PricebyPLevel[ItemId] != undefined){
			var spPriceLEvel	=	PricebyPLevel[ItemId];
			if(spPriceLEvel){
//				nlapiSetCurrentLineItemValue("item", "price", spPriceLEvel, true, true);
				PriceSetupExist	=	spPriceLEvel;
				Priority = 0;
				SpecialItemID	=0;

			}
		}

		nlapiLogExecution("DEBUG", "specialPEnable", specialPEnable+"=>"+SpecialItemID+"=>"+PriceSetupExist);
		if(specialPEnable == "T"){
		if(SpecialItemID*1 >= 1){
				var lookFld	=	["custrecord_st_c_p_p_calc_price","custrecord_advs_c_p_p_disc"];
				var lookRec	=	nlapiLookupField("customrecord_advs_st_cust_part_pricing", SpecialItemID, lookFld);
				var SpPrice		  =		lookRec.custrecord_st_c_p_p_calc_price;
				var SpPriceDis    =    lookRec.custrecord_advs_c_p_p_disc;
				var BasePr   	  =   BasePrice*1;

				if(SpPriceDis){
					SpPriceDis	=	parseFloat(SpPriceDis);
				}
				SpPriceDis		=	SpPriceDis*1;

				if(SpPrice>0){
					SpecialPriceTotal	=	SpPrice;
					var NewSPPrice	=	SpPrice;

					if((PromotionPrice > 0) && (PromotionPrice < NewSPPrice)){

						specialPID	="";
						NewSPPrice	=	findServiceMarginCost(PromotionPrice,SubsiMkp);
						var retParam	=	PromotionPrice+"$rat$"+NewSPPrice+"$rat$"+"PROMO";
						return retParam;

					}else{
						specialPExist=	"T";
						var retParam	=	SpPrice+"$rat$"+NewSPPrice+"$rat$"+"SPRICE";
						return retParam;
						

						
					}


				}else{
					if((SpPriceDis>0) && (BasePr>0)){

						var CalcAmnt	=	((BasePr*SpPriceDis)/100);
						CalcAmnt		=	CalcAmnt*1;

						var Miinus	=	(BasePr+CalcAmnt);
						Miinus			=	Miinus*1
						Miinus		=	Miinus.toFixed(2);

						var NewSPPrice	=	Miinus;

						if((PromotionPrice > 0) && (PromotionPrice < NewSPPrice)){

							specialPID	="";
							NewSPPrice	=	findServiceMarginCost(PromotionPrice,SubsiMkp);
							var retParam	=	PromotionPrice+"$rat$"+NewSPPrice+"$rat$"+"PROMO";
							return retParam;

						}else{
							specialPExist=	"T";
							var retParam	=	SpPrice+"$rat$"+NewSPPrice+"$rat$"+"SPRICE";
							return retParam;
							

							
						}

					}
				}
			
		}else{

			nlapiLogExecution("DEBUG", "PriceSetupExist@@", PriceSetupExist+"=>"+PromotionPrice);
			if((PriceSetupExist) &&  (PromotionPrice <=0)){
				//////// Part and Plevel

				var ItemId	=	Part;
				var Psgp	=	PartSubgp;


				var MultyID			=	"";
				var RebatePlus		=	"";	
				var Availability	=0;

				var BaseRate	=	BasePrice;
				if(PriceLevel != null && PriceLevel != undefined && PriceLevel != ""){
					BaseRate	=	CustomerBasePrice
				}else{
					PriceLevel	=	1;
				}
				
				PriceLevel=	PriceSetupExist;
				
				var pricinginfo	=	createSOCheck(Customer,LocMain,ItemId,PriceLevel);
				var ListPrice	=	pricinginfo.price;
				
				BaseRate		=	CustomerBasePrice;
				var OrderAmount	=	0;


//				nlapiLogExecution("DEBUG", "BaseRate", BaseRate+"==>"+Part+"==>"+PriceLevel+"=>"+CustomerBasePrice);
				if(BaseRate){

//					alert(PriceLevel+"==>"+"Validate");	
					var NewPrice	=0;
					/*var search	=	nlapiCreateSearch("customrecord_advs_p_pricing_buffer", [
						          	 	                                                         ["custrecord_advs_p_p_b_part","anyof",Itemval]
						          	 	                                                         ,"AND",
						          	 	                                                         ["isinactive","is","F"]
						          	 	                                                         ], [
						          	 	                                                             new nlobjSearchColumn("custrecord_advs_p_p_calc_new_price", null, null)
						          	 	                                                             ]);
						var run		=	search.runSearch();
						var cols	=	run.getColumns();
						run.forEachResult(function(record) {
							NewPrice	=	record.getValue("custrecord_advs_p_p_calc_new_price", null, null)*1;
							return true;
						});*/

					NewPrice					=	BaseRate;
					NewPrice					=	NewPrice*1;
//					alert(NewPrice);


					var ManufMarkup				=	VendorMArgin;

					var SubGpMarkup				=	PartSubgpMargin;


//					var ManufMarkup				=	nlapiGetCurrentLineItemValue(type, "custcol_advs_manu_margin");
//					var SubGpMarkup				=	nlapiGetCurrentLineItemValue(type, "custcol_advs_subgp_margin");
					var LocationM				=	LociMArkup;
					var Location				=	LocMain;
//					var ABCCatego				=	nlapiGetCurrentLineItemValue(type, "custcol_advs_abc_markup");

					//Manufacturer
					var ManufacturerplusPrice	=0;
					if(ManufMarkup){
						var tempManuMarkup			=	parseFloat(ManufMarkup);
						tempManuMarkup				=	tempManuMarkup*1;
						var DiscAmount				=	CalculateQuantityDiscPortionU(tempManuMarkup,0,NewPrice);
						DiscAmount					=	DiscAmount*1;

						ManufacturerplusPrice	    =	DiscAmount;
						ManufacturerplusPrice		=	ManufacturerplusPrice*1;
						ManufacturerplusPrice		=	ManufacturerplusPrice.toFixed(2);
						ManufacturerplusPrice		=	ManufacturerplusPrice*1;

					}

					///Subgroup
					var SBGpplusPrice	=	0;
					if(SubGpMarkup){
						var tempSubgroupMarkup			=	parseFloat(SubGpMarkup);
						tempSubgroupMarkup				=	tempSubgroupMarkup*1;
						var DiscAmount					=	CalculateQuantityDiscPortionU(tempSubgroupMarkup,0,NewPrice);
						DiscAmount						=	DiscAmount*1;

						SBGpplusPrice					=	DiscAmount;
					}


					///LocationMp
					var locplusPrice	=0;
					if(LocationM){
						var tempLocMarkup				=	parseFloat(LocationM);
						tempLocMarkup					=	tempLocMarkup*1;
						var DiscAmount					=	CalculateQuantityDiscPortionU(tempLocMarkup,0,NewPrice);
						DiscAmount						=	DiscAmount*1;

						locplusPrice		=	DiscAmount;
						locplusPrice		=	locplusPrice*1;
						locplusPrice		=	locplusPrice.toFixed(2);
						locplusPrice		=	locplusPrice*1;
					}


					///ABCMp
					var tempabcMarkup				=	parseFloat(AMarginCost);
					tempabcMarkup					=	tempabcMarkup*1;
					var DiscAmount					=	CalculateQuantityDiscPortionU(tempabcMarkup,0,NewPrice);
					DiscAmount						=	DiscAmount*1;

					var AbcplusPrice	=	DiscAmount;
					AbcplusPrice		=	AbcplusPrice*1;
					AbcplusPrice		=	AbcplusPrice.toFixed(2);
					AbcplusPrice		=	AbcplusPrice*1;


//					alert(AbcplusPrice+"==>"+locplusPrice+"==>"+ManufacturerplusPrice+"==>"+SBGpplusPrice);
//					nlapiLogExecution("DEBUG", "AbcplusPrice", AbcplusPrice+"==>"+locplusPrice+"==>"+ManufacturerplusPrice+"==>"+SBGpplusPrice);

					OrderAmount	=	(AbcplusPrice+locplusPrice+ManufacturerplusPrice+SBGpplusPrice+NewPrice);
					OrderAmount		=	OrderAmount*1;
					OrderAmount		=	OrderAmount.toFixed(2);
					OrderAmount		=	OrderAmount*1;
					var FrontConterAmount	=	OrderAmount;

//					alert("OrderAmount==>"+OrderAmount);


					var ServiceMargin	=	SubsiMkp;
					if(ServiceMargin){
						ServiceMargin		=	parseFloat(ServiceMargin);

						if(ServiceMargin>0){
							var DiscAmount					=	CalculateQuantityDiscPortionU(OrderAmount,0,ServiceMargin);
							DiscAmount						=	DiscAmount*1;

//							DiscAmount		=	DiscAmount.toFixed(2);
//							DiscAmount		=	DiscAmount*1;

							var NewAmount		=	DiscAmount+OrderAmount;
							NewAmount		=	NewAmount*1;
							NewAmount		=	NewAmount.toFixed(2);
							NewAmount		=	NewAmount*1;


							var BAckCounterAmount	=	NewAmount;
//							nlapiLogExecution("DEBUG", "BAckCounterAmount", DiscAmount+"==>"+NewAmount+"==>"+OrderAmount+"=>"+ServiceMargin);
							if(OrderAmount>0){
								OrderAmount	=	NewAmount;
//								nlapiSetCurrentLineItemValue("item", "rate", NewAmount, true, true);
							}
						}else{
							if(OrderAmount>0){
//								OrderAmount	=	OrderAmount;
//								nlapiSetCurrentLineItemValue("item", "rate", OrderAmount, true, true);
							}
						}
					}else{
						if(OrderAmount>0){
//							OrderAmount	=	OrderAmount;
//							nlapiSetCurrentLineItemValue("item", "rate", OrderAmount, true, true);
						}
					}
					var retParam	=	FrontConterAmount+"$rat$"+BAckCounterAmount+"$rat$"+"MARKP";
					return retParam;
				}else{
					var retParam	=	0+"$rat$"+0+"$rat$"+"MARKP";
					return retParam;
				}
			}else{
				if(PromotionPrice > 0){

					var retParam	=	PromotionPrice+"$rat$"+PromotionPrice+"$rat$"+"PROMO";
					return retParam;
				}else{
			
				}
			}
			
			
		}
	}else{
		if(PromotionPrice > 0){

			var retParam	=	PromotionPrice+"$rat$"+PromotionPrice+"$rat$"+"PROMO";
			return retParam;
		}else{
			
		}
	}


	}else{
		if(PromotionPrice > 0){

			var retParam	=	PromotionPrice+"$rat$"+PromotionPrice+"$rat$"+"PROMO";
			return retParam;
		}else{
		
		}
	}
	
	

	var BaseRate	=	BasePrice;
	if(BaseRate && PromotionPrice <= 0){

//		alert(PriceLevel+"==>"+"Validate");	
		var NewPrice	=0;
		/*var search	=	nlapiCreateSearch("customrecord_advs_p_pricing_buffer", [
			          	 	                                                         ["custrecord_advs_p_p_b_part","anyof",Itemval]
			          	 	                                                         ,"AND",
			          	 	                                                         ["isinactive","is","F"]
			          	 	                                                         ], [
			          	 	                                                             new nlobjSearchColumn("custrecord_advs_p_p_calc_new_price", null, null)
			          	 	                                                             ]);
			var run		=	search.runSearch();
			var cols	=	run.getColumns();
			run.forEachResult(function(record) {
				NewPrice	=	record.getValue("custrecord_advs_p_p_calc_new_price", null, null)*1;
				return true;
			});*/

		NewPrice					=	BaseRate;
		NewPrice					=	NewPrice*1;
//		alert(NewPrice);


		var ManufMarkup				=	VendorMArgin;

		var SubGpMarkup				=	PartSubgpMargin;


//		var ManufMarkup				=	nlapiGetCurrentLineItemValue(type, "custcol_advs_manu_margin");
//		var SubGpMarkup				=	nlapiGetCurrentLineItemValue(type, "custcol_advs_subgp_margin");
		var LocationM				=	LociMArkup;
		var Location				=	LocMain;
//		var ABCCatego				=	nlapiGetCurrentLineItemValue(type, "custcol_advs_abc_markup");

		nlapiLogExecution("DEBUG", "ManufMarkup@@", AMarginCost+"==>"+LocationM+"==>"+ManufMarkup+"==>"+SubGpMarkup+"=>"+BaseRate+"=>"+NewPrice);

		
		//Manufacturer
		var ManufacturerplusPrice	=0;
		if(ManufMarkup){
			var tempManuMarkup			=	parseFloat(ManufMarkup);
			tempManuMarkup				=	tempManuMarkup*1;
			var DiscAmount				=	CalculateQuantityDiscPortionU(tempManuMarkup,0,NewPrice);
			DiscAmount					=	DiscAmount*1;

			ManufacturerplusPrice	    =	DiscAmount;
			ManufacturerplusPrice		=	ManufacturerplusPrice*1;
			ManufacturerplusPrice		=	ManufacturerplusPrice.toFixed(2);
			ManufacturerplusPrice		=	ManufacturerplusPrice*1;

		}

		///Subgroup
		var SBGpplusPrice	=	0;
		if(SubGpMarkup){
			var tempSubgroupMarkup			=	parseFloat(SubGpMarkup);
			tempSubgroupMarkup				=	tempSubgroupMarkup*1;
			var DiscAmount					=	CalculateQuantityDiscPortionU(tempSubgroupMarkup,0,NewPrice);
			DiscAmount						=	DiscAmount*1;

			SBGpplusPrice					=	DiscAmount;
		}


		///LocationMp
		var locplusPrice	=0;
		if(LocationM){
			var tempLocMarkup				=	parseFloat(LocationM);
			tempLocMarkup					=	tempLocMarkup*1;
			var DiscAmount					=	CalculateQuantityDiscPortionU(tempLocMarkup,0,NewPrice);
			DiscAmount						=	DiscAmount*1;

			locplusPrice		=	DiscAmount;
			locplusPrice		=	locplusPrice*1;
			locplusPrice		=	locplusPrice.toFixed(2);
			locplusPrice		=	locplusPrice*1;
		}


		///ABCMp
		var tempabcMarkup				=	parseFloat(AMarginCost);
		tempabcMarkup					=	tempabcMarkup*1;
		var DiscAmount					=	CalculateQuantityDiscPortionU(tempabcMarkup,0,NewPrice);
		DiscAmount						=	DiscAmount*1;

		var AbcplusPrice	=	DiscAmount;
		AbcplusPrice		=	AbcplusPrice*1;
		AbcplusPrice		=	AbcplusPrice.toFixed(2);
		AbcplusPrice		=	AbcplusPrice*1;


//		alert(AbcplusPrice+"==>"+locplusPrice+"==>"+ManufacturerplusPrice+"==>"+SBGpplusPrice);
		nlapiLogExecution("DEBUG", "AbcplusPrice", AbcplusPrice+"==>"+locplusPrice+"==>"+ManufacturerplusPrice+"==>"+SBGpplusPrice+"=>"+BaseRate+"=>"+NewPrice);

		OrderAmount	=	(AbcplusPrice+locplusPrice+ManufacturerplusPrice+SBGpplusPrice+NewPrice);
		OrderAmount		=	OrderAmount*1;
		OrderAmount		=	OrderAmount.toFixed(2);
		OrderAmount		=	OrderAmount*1;
		var FrontConterAmount	=	OrderAmount;

//		alert("OrderAmount==>"+OrderAmount);


		var ServiceMargin	=	SubsiMkp;
		if(ServiceMargin){
			ServiceMargin		=	parseFloat(ServiceMargin);

			if(ServiceMargin>0){
				var DiscAmount					=	CalculateQuantityDiscPortionU(OrderAmount,0,ServiceMargin);
				DiscAmount						=	DiscAmount*1;

//				DiscAmount		=	DiscAmount.toFixed(2);
//				DiscAmount		=	DiscAmount*1;

				var NewAmount		=	DiscAmount+OrderAmount;
				NewAmount		=	NewAmount*1;
				NewAmount		=	NewAmount.toFixed(2);
				NewAmount		=	NewAmount*1;


				var BAckCounterAmount	=	NewAmount;
				nlapiLogExecution("DEBUG", "BAckCounterAmount", DiscAmount+"==>"+NewAmount+"==>"+OrderAmount+"=>"+ServiceMargin);
				if(OrderAmount>0){
					OrderAmount	=	NewAmount;
//					nlapiSetCurrentLineItemValue("item", "rate", NewAmount, true, true);
				}
			}else{
				if(OrderAmount>0){
//					OrderAmount	=	OrderAmount;
//					nlapiSetCurrentLineItemValue("item", "rate", OrderAmount, true, true);
				}
			}
		}else{
			if(OrderAmount>0){
//				OrderAmount	=	OrderAmount;
//				nlapiSetCurrentLineItemValue("item", "rate", OrderAmount, true, true);
			}
		}
		var retParam	=	FrontConterAmount+"$rat$"+BAckCounterAmount;
		return retParam;
	}else{
		var retParam	=	0+"$rat$"+0;
		return retParam;
	}




}

function CalculateQuantityDiscPortionU(Portion,Quant,Amount) {

	if(Portion == "" || Portion == " "){
		Portion	=	0;
	}else{
		Portion	=	parseFloat(Portion);
	}

	var LineAmount		=	((Amount*1)*Portion)/100;
	LineAmount			=	LineAmount*1;
//	LineAmount			=	LineAmount.toFixed(5);

	return LineAmount;
}


function GetSpecialPrice(Customer,Location){

	CustID		=	Customer;
	LocationId	=	Location;

	var ArrayItems		=	new Array();
	var ArrayMultipli	=	new Array();

	var BrandIdArr		=	new Array();
	var BrandMulti	=	new Array();

	var SubGPArr		=	new Array();
	var SBGPMulti	=	new Array();

	var RebatePart	=	new Array();
	var Rebateprice	=	new Array();
	var Rebateplus	=	new Array();

	var RebatePart_ad	=	new Array();
	var Rebateprice_ad	=	new Array();

	var json = "";

	var ArrayItems		=	new Array();
	var ArrayMultipli	=	new Array();

	var BrandIdArr		=	new Array();
	var BrandMulti	=	new Array();

	var SubGPArr		=	new Array();
	var SBGPMulti	=	new Array();

	var sppriceArr	=	new Array();

	var priceLvlArr		=	new Array();
	var priceLvlMulti	=	new Array();
	var priceLvlMultiID	=	new Array();
		
	var BrandPLevel			=	new Array();
	var BrandPLevelID		=	new Array();
	var BrandPLevelMultiID		=	new Array();
	
	
	var SubGpPLevel			=	new Array();
	var SubGpPLevelID		=	new Array();
	var SubGpPLevelMultiID		=	new Array();

	var SearchPricing	= nlapiCreateSearch("customrecord_advs_st_cust_part_pricing",
			[

			 ["custrecord_st_c_p_p_head_link","noneof","@NONE@"], 
			 "AND", 
			 ["custrecord_st_c_p_p_head_link.custrecord_st_c_s_p_customer","anyof",CustID], 
			 "AND", 
			 ["isinactive","is","F"], 
			 "AND", 
			 ["custrecord_st_c_p_p_head_link.isinactive","is","F"]
//			 ,"AND", 
//			 ["custrecord_st_c_p_p_location","anyof",LocationId]
			 ,"AND", 
			 [["custrecord_advs_p_p_expiry_date","onorafter","today"],"OR",["custrecord_advs_p_p_expiry_date","isempty",""]]
			 ], 
			 [
			  new nlobjSearchColumn("custrecord_st_c_p_p_part_number"), 
			  new nlobjSearchColumn("custrecord_advs_c_p_p_brand"), 
			  new nlobjSearchColumn("custrecord_advs_c_p_p_sb_gp"), 
			  new nlobjSearchColumn("custrecord_adcs_p_p_p_is_sp_price"), 
			  new nlobjSearchColumn("internalid").setSort(true),
			  new nlobjSearchColumn("custrecord_advs_c_p_p_level"), 
			  ]
	);
	var start	=	0;var end	=	1000;var index	=	1000;
	while(index==1000){
		var ResultPricing	=	SearchPricing.runSearch();
//		ResultPricing.forEachResult(function(recPri) {
		var rs	=	ResultPricing.getResults(start, end);
		for(var p=0;p<rs.length;p++){
			var recPri	=	rs[p];
			var ItemID		=	recPri.getValue("custrecord_st_c_p_p_part_number");
			var Brand		=	recPri.getValue("custrecord_advs_c_p_p_brand");
			var Sbgp		=	recPri.getValue("custrecord_advs_c_p_p_sb_gp");
			var Multip		=	recPri.getValue("internalid");
			var isspprice	=	recPri.getValue("custrecord_adcs_p_p_p_is_sp_price");

			var Multip		=	recPri.getValue("internalid");
			var pLevel		=	recPri.getValue("custrecord_advs_c_p_p_level");

			if((ItemID) && (!pLevel)){
				if(ArrayItems.indexOf(ItemID) == -1){
					ArrayItems.push(ItemID);
					ArrayMultipli.push(Multip);
				}

			}

			if(ItemID && pLevel){
				var TempIndex	=	ItemID;
				priceLvlArr.push(TempIndex);
				priceLvlMulti.push(pLevel);
				priceLvlMultiID.push(Multip);
			}
			
			if(Brand && pLevel){
				var TempIndex	=	Brand;
				BrandPLevel.push(TempIndex);
				BrandPLevelID.push(pLevel);
				BrandPLevelMultiID.push(Multip);
				
			}
			
			if(Sbgp && pLevel){
				var TempIndex	=	Sbgp;
				SubGpPLevel.push(TempIndex);
				SubGpPLevelID.push(pLevel);
				SubGpPLevelMultiID.push(Multip);
			}
			

			if((Brand) && (!pLevel)){
				Brand	=	Brand.split(",");
				for(var g=0;g<Brand.length;g++){
					if(BrandIdArr.indexOf(Brand[g]) == -1){
						BrandIdArr.push(Brand[g]);
						BrandMulti.push(Multip);
					}
				}

			}
			/*if(Sbgp){
				if(SubGPArr.indexOf(Sbgp) == -1){
					SubGPArr.push(Sbgp);
					SBGPMulti.push(Multip);
				}
			}
			 */
			if((Sbgp) && (!pLevel)){
				Sbgp	=	Sbgp.split(",");
				for(var g=0;g<Sbgp.length;g++){
					if(SubGPArr.indexOf(Sbgp[g]) == -1){
						SubGPArr.push(Sbgp[g]);
						SBGPMulti.push(Multip);
					}
				}

			}

			if(isspprice == "T"){
				sppriceArr.push(Multip);
			}


		}
		index	=	rs.length;
		end=end+1000;
		start=end;
	}
	/*	return true;
	});*/
	json+= '{';

	json+= '"Pricing_Bypart": [';

	if(ArrayItems.length >=1 ){
		for(var H=0; H<ArrayItems.length;H++){
			json+= '{';				           
			json+= '"PartID":'+'"'+ArrayItems[H]+'"'
			+","+'"MultiID":'+'"'+ArrayMultipli[H]+'"';

			if(H == (ArrayItems.length-1))  
				json+='}';
			else
				json+='},';
		}
	}
	json+= '],';

	/////Brand
	json+= '"Pricing_ByBrand": [';

	if(BrandIdArr.length >=1 ){
		for(var H=0; H<BrandIdArr.length;H++){
			json+= '{';				           
			json+= '"Brand":'+'"'+BrandIdArr[H]+'"'
			+","+'"MultiID":'+'"'+BrandMulti[H]+'"';

			if(H == (BrandIdArr.length-1))  
				json+='}';
			else
				json+='},';
		}
	}
	json+= '],';

	//// Subgp

	json+= '"Pricing_ByGroup": [';

	if(SubGPArr.length >=1 ){
		for(var H=0; H<SubGPArr.length;H++){
			json+= '{';				           
			json+= '"SubGP":'+'"'+SubGPArr[H]+'"'
			+","+'"MultiID":'+'"'+SBGPMulti[H]+'"';

			if(H == (SubGPArr.length-1))  
				json+='}';
			else
				json+='},';
		}
	}
	json+= '],';


	//// Special P

	json+= '"Pricing_BySpecial": [';

	if(sppriceArr.length >=1 ){
		for(var H=0; H<sppriceArr.length;H++){
			json+= '{';				           
			json+= '"MultiID":'+'"'+sppriceArr[H]+'"';

			if(H == (sppriceArr.length-1))  
				json+='}';
			else
				json+='},';
		}
	}
	json+= '],';

	json+= '"Pricing_ByPLevel": [';

	if(priceLvlArr.length >=1 ){
		for(var H=0; H<priceLvlArr.length;H++){
			json+= '{';				           
			json+= '"SubGP":'+'"'+priceLvlArr[H]+'"'
			+","+'"MultiID":'+'"'+priceLvlMulti[H]+'"'
			+","+'"SetupID":'+'"'+priceLvlMultiID[H]+'"';
			
			
			if(H == (priceLvlArr.length-1))  
				json+='}';
			else
				json+='},';
		}
	}
	json+= '],';

	

	json+= '"Pricing_ByBrandPLevel": [';

	if(BrandPLevel.length >=1 ){
		for(var H=0; H<BrandPLevel.length;H++){
			json+= '{';				           
			json+= '"SubGP":'+'"'+BrandPLevel[H]+'"'
			+","+'"MultiID":'+'"'+BrandPLevelID[H]+'"'
			+","+'"SetupID":'+'"'+BrandPLevelMultiID[H]+'"';
			
			if(H == (BrandPLevel.length-1))  
				json+='}';
			else
				json+='},';
		}
	}
	json+= '],';
	
	json+= '"Pricing_ByPsubGpPLevel": [';

	if(SubGpPLevel.length >=1 ){
		for(var H=0; H<SubGpPLevel.length;H++){
			json+= '{';				           
			json+= '"SubGP":'+'"'+SubGpPLevel[H]+'"'
			+","+'"MultiID":'+'"'+SubGpPLevelID[H]+'"'
			+","+'"SetupID":'+'"'+SubGpPLevelMultiID[H]+'"';
			
			if(H == (SubGpPLevel.length-1))  
				json+='}';
			else
				json+='},';
		}
	}
	json+= '],';
	

	////Rebate Customer Group

	var SearchRebPricing	= nlapiCreateSearch("customrecord_advs_royal_rebate",
			[ 
			 ["custrecord_advs_r_r_customer","anyof",CustID], 
			 "AND", 
			 ["isinactive","is","F"]
			 ], 
			 [
			  new nlobjSearchColumn("custrecord_advs_r_c_r_vendor").setSort(true),
			  new nlobjSearchColumn("custrecord_advs_r_r_price"),
			  new nlobjSearchColumn("custrecord_advs_r_c_r_plus_min")
			  ]
	);

	var ResultRebPricing	=	SearchRebPricing.runSearch();

	var RebatePart	=	new Array();
	var Rebateprice	=	new Array();
	var Rebateplus	=	new Array();
	var start_r	=	0;var end_r	=	1000;var index_r	=	1000;
	while(index_r==1000){
//		ResultPricing.forEachResult(function(recPri) {
		var rs_r	=	ResultRebPricing.getResults(start_r, end_r);
		for(var p=0;p<rs_r.length;p++){
			var recPrireb		=	rs_r[p];
			var VendorID			=	recPrireb.getValue("custrecord_advs_r_c_r_vendor");
			var Multip			=	recPrireb.getValue("custrecord_advs_r_r_price");
			var plusminus		=	recPrireb.getValue("custrecord_advs_r_c_r_plus_min");

			if(RebatePart.indexOf(VendorID) == -1){
				RebatePart.push(VendorID);
				Rebateprice.push(Multip);
				Rebateplus.push(plusminus);
			}

		}
		index_r		=	rs_r.length;
		end_r		=	end_r+1000;
		start_r		=	end_r;
	}

	/*	return true;
	});*/

	json+= '"Rebate_Details": [';

	if(RebatePart.length >=1 ){
		for(var H=0; H<RebatePart.length;H++){
			json+= '{';				           
			json+= '"vendID":'+'"'+RebatePart[H]+'"'
			+","+'"MultiID":'+'"'+Rebateprice[H]+'"'
			+","+'"RebatePlus":'+'"'+Rebateplus[H]+'"';

			if(H == (RebatePart.length-1))  
				json+='}';
			else
				json+='},';
		}
	}
	json+= '],';


	/////////Vendor Pricing Rate

	var SearchPricing_ad	= nlapiCreateSearch("customrecord_advs_royal_vendor_rebate",
			[ 
			 [
			  [
			   ['custrecord_advs_r_v_r_st_date','onorbefore','today'],
			   'AND',
			   ['custrecord_advs_r_v_r_end_date','onorafter','today']
			   ],
			   'OR',
			   ['custrecord_advs_r_v_r_st_date','isempty',null],
			   'OR',
			   [
			    ['custrecord_advs_r_v_r_end_date','isempty',null],
			    'AND',
			    ['custrecord_advs_r_v_r_st_date','onorbefore','today']
			    ]
			  ]
			 ,"AND",				
			 ["custrecord_advs_r_v_r_vendor.isinactive","is","F"]
			 ,"AND",				
			 ["custrecord_advs_r_v_r_vendor","noneof","@NONE@"]
			 ,"AND",				
			 ["custrecord_advs_r_v_r_vendor","noneof","@NONE@"] 
			 ,"AND", 
			 ["isinactive","is","F"]
			 ], 
			 [
			  new nlobjSearchColumn("custrecord_advs_r_v_r_vendor").setSort(true),
			  new nlobjSearchColumn("custrecord_advs_r_v_r_percentage"),
			  ]
	);

	var ResultRebPricing_ad	=	SearchPricing_ad.runSearch();

	var RebatePart_ad	=	new Array();
	var Rebateprice_ad	=	new Array();
	var start_r_ad	=	0;var end_r_ad	=	1000;var index_r_ad	=	1000;
	while(index_r_ad ==1000){
//		ResultPricing.forEachResult(function(recPri) {
		var rs_r_ad	=	ResultRebPricing_ad.getResults(start_r_ad, end_r_ad);
		for(var p=0;p<rs_r_ad.length;p++){
			var recPrireb		=	rs_r_ad[p];
			var ItemID			=	recPrireb.getValue("custrecord_advs_r_v_r_vendor");
			var Multip			=	recPrireb.getValue("custrecord_advs_r_v_r_percentage");

			if(RebatePart_ad.indexOf(ItemID) == -1){
				RebatePart_ad.push(ItemID);
				Rebateprice_ad.push(Multip);
			}

		}
		index_r_ad		=	rs_r_ad.length;
		end_r_ad		=	end_r_ad+1000;
		start_r_ad		=	end_r_ad;
	}

	/*	return true;
	});*/

	json+= '"Rebate_vendor_Details": [';

	if(RebatePart_ad.length >=1 ){
		for(var H=0; H<RebatePart_ad.length;H++){
			json+= '{';				           
			json+= '"PartID":'+'"'+RebatePart_ad[H]+'"'
			+","+'"MultiID":'+'"'+Rebateprice_ad[H]+'"';

			if(H == (RebatePart_ad.length-1))  
				json+='}';
			else
				json+='},';
		}
	}
	json+= '],';

	
//////Fetch Promotional Price


	var Search_p	= nlapiCreateSearch("customrecord_advs_promotional_price",
			[ 
//			 ["custrecord_advs_p_p_cust","anyof",CustID], 
//			 "AND", 
			 ["isinactive","is","F"]
			 ,"AND",
			 ["custrecord_advs_p_p_s_date","onorbefore","today"]
			 ,"AND",
			 ["custrecord_advs_p_p_end_date","onorafter","today"]
			 ], 
			 [
			  new nlobjSearchColumn("custrecord_advs_p_p_part").setSort(true),
			  new nlobjSearchColumn("custrecord_advs_p_p_price"),
			  ]
	);

	var Result_p	=	Search_p.runSearch();

	var PromPartArr	=	new Array();
	var PromPriceAr	=	new Array();

	var start_r	=	0;var end_r	=	1000;var index_r	=	1000;
	while(index_r==1000){
		var rs_r	=	Result_p.getResults(start_r, end_r);
		for(var p=0;p<rs_r.length;p++){
			var recPrireb		=	rs_r[p];
			var PartID			=	recPrireb.getValue("custrecord_advs_p_p_part");
			var Price			=	recPrireb.getValue("custrecord_advs_p_p_price")*1;

			Price		=	Price.toFixed(2);
			Price		=	Price*1;
			
			if(PromPartArr.indexOf(PartID) == -1){
				PromPartArr.push(PartID);
				PromPriceAr.push(Price);
			}

		}
		index_r		=	rs_r.length;
		end_r		=	end_r+1000;
		start_r		=	end_r;
	}



	json+= '"Promotional_Price": [';

	if(PromPartArr.length >=1 ){
		for(var H=0; H<PromPartArr.length;H++){
			json+= '{';				           
			json+= '"PartID":'+'"'+PromPartArr[H]+'"'
			+","+'"PPrice":'+'"'+PromPriceAr[H]+'"';

			if(H == (PromPartArr.length-1))  
				json+='}';
			else
				json+='},';
		}
	}
	json+= ']';

	json+= '}';

	fetchFunction(json)
}
var ArrayForItemPrice		=	new Array();
var PricebyBrand			=	new Array();
var PricebyGroup			=	new Array();
var ArrayRebatePrice		=	new Array();
var ArrayRebatevendorPrice	=	new Array();
var SpOnlyArr	=	new Array();
var PricebyPLevel	=	new Array();
var PromotionArray	=	new Array();

var PricebyBrandPLevel	=	new Array();
var PricebySBSPPLevel	=	new Array();

function fetchFunction(xmlText){

	var json = JSON.parse(xmlText); 
	nlapiLogExecution("DEBUG", "json", json+"=>"+xmlText)

	///By Part Number
	ArrayForItemPrice	=	new Array();
	var count = json.Pricing_Bypart.length;
	if(count!=0){

		for(var m=0;m<count;m++){
			var NPArt 	= json.Pricing_Bypart[m].PartID;
			var MultyID = json.Pricing_Bypart[m].MultiID;

			ArrayForItemPrice[NPArt]	=	MultyID;

		}
	}

	///By Part Brand
	PricebyBrand	=	new Array();
	var count = json.Pricing_ByBrand.length;
	if(count!=0){

		for(var m=0;m<count;m++){
			var NPArt 	= json.Pricing_ByBrand[m].Brand;
			var MultyID = json.Pricing_ByBrand[m].MultiID;

			PricebyBrand[NPArt]	=	MultyID;

		}
	}

	///By Group
	PricebyGroup	=	new Array();
	var count = json.Pricing_ByGroup.length;
	if(count!=0){

		for(var m=0;m<count;m++){
			var NPArt 	= json.Pricing_ByGroup[m].SubGP;
			var MultyID = json.Pricing_ByGroup[m].MultiID;

			PricebyGroup[NPArt]	=	MultyID;

		}
	}

	///By Price Level
	PricebyPLevel	=	new Array();
	var countPLevel	=	json.Pricing_ByPLevel.length;
	if(countPLevel!=0){

		for(var m=0;m<countPLevel;m++){
			var NPArt 	= json.Pricing_ByPLevel[m].SubGP;
			var MultyID = json.Pricing_ByPLevel[m].MultiID;
			var SetupID = json.Pricing_ByPLevel[m].SetupID;
			PricebyPLevel[NPArt]	=	new Array();
			PricebyPLevel[NPArt]["Plevel"]	=	MultyID;
			PricebyPLevel[NPArt]["SetupID"]	=	SetupID;
			

		}
	}
	
	
	PricebyBrandPLevel	=	new Array();
	var countPLevel	=	json.Pricing_ByBrandPLevel.length;
	if(countPLevel!=0){
		for(var m=0;m<countPLevel;m++){
			var NPArt 	= json.Pricing_ByBrandPLevel[m].SubGP;
			var MultyID = json.Pricing_ByBrandPLevel[m].MultiID;
			var SetupID = json.Pricing_ByBrandPLevel[m].SetupID;
			
			
			
			PricebyBrandPLevel[NPArt]	=	new Array();
			PricebyBrandPLevel[NPArt]["Plevel"]	=	MultyID;
			PricebyBrandPLevel[NPArt]["SetupID"]	=	SetupID;

		}
	}
	
	PricebySBSPPLevel	=	new Array();
	var countPLevel	=	json.Pricing_ByPsubGpPLevel.length;
	if(countPLevel!=0){
		for(var m=0;m<countPLevel;m++){
			var NPArt 	= json.Pricing_ByPsubGpPLevel[m].SubGP;
			var MultyID = json.Pricing_ByPsubGpPLevel[m].MultiID;
			var SetupID = json.Pricing_ByPsubGpPLevel[m].SetupID;
			
			Pricing_ByPsubGpPLevel[NPArt]	=	new Array();
			Pricing_ByPsubGpPLevel[NPArt]["Plevel"]	=	MultyID;
			Pricing_ByPsubGpPLevel[NPArt]["SetupID"]	=	SetupID;

		}
	}
	

	var countReb = json.Rebate_Details.length;
	if(countReb!=0){

		for(var m=0;m<countReb;m++){
			var NPArt 		= json.Rebate_Details[m].vendID;
			var MultyID 	= json.Rebate_Details[m].MultiID;
			var RebatePlus 	= json.Rebate_Details[m].RebatePlus;


			ArrayRebatePrice[NPArt]					=	new Array();
			ArrayRebatePrice[NPArt]["MultyID"]		=	MultyID;
			ArrayRebatePrice[NPArt]["RebatePlus"]	=	RebatePlus;
//			alert(ArrayForItemPrice[NPArt]);
		}
	}


	var countReb = json.Rebate_vendor_Details.length;
	if(countReb!=0){

		for(var m=0;m<countReb;m++){
			var NPArt 	= json.Rebate_vendor_Details[m].PartID;
			var MultyID = json.Rebate_vendor_Details[m].MultiID;

			ArrayRebatevendorPrice[NPArt]	=	MultyID;
//			alert(ArrayForItemPrice[NPArt]);
		}
	}

	SpOnlyArr	=	new Array();
	var countReb = json.Pricing_BySpecial.length;
	if(countReb!=0){

		for(var m=0;m<countReb;m++){
			var NPArt 		= json.Pricing_BySpecial[m].MultiID;
			SpOnlyArr.push(NPArt);
		}
	}
	
	var PromotionLength = json.Promotional_Price.length;
	if(PromotionLength!=0){

		for(var m=0;m<PromotionLength;m++){
			var NPArt 		= json.Promotional_Price[m].PartID;
			var PriceM	 	= json.Promotional_Price[m].PPrice;

			PromotionArray[NPArt]	=	PriceM;
		}
	}


}

function createSOCheck(Customer,LocMain,Part,PriceLevel){
	var rec = {};
	var RecordObj=nlapiCreateRecord("cashsale", {recordmode:'dynamic'});
//	RecordObj.setFieldText('customform', Form);
	RecordObj.setFieldValue('entity', Customer);
//	RecordObj.setFieldValue('department', Department); 
	RecordObj.setFieldValue('location', LocMain);
//	RecordObj.setFieldValue('shipaddresslist', Addressid);
	RecordObj.selectNewLineItem('item');
//	RecordObj.setCurrentLineItemValue('item', 'custcol_advs_selected_inventory_type', 2); // Parts
	RecordObj.setCurrentLineItemValue('item', 'item', Part);
	RecordObj.setCurrentLineItemValue('item', 'quantity', 1);
	RecordObj.setCurrentLineItemValue('item', 'price', PriceLevel);
	rec.price = RecordObj.getCurrentLineItemValue('item', 'rate');
	return rec;
}

function findServiceMarginCost(OrderAmount,SubsiMkp){
	OrderAmount	=	OrderAmount*1;
	var ServiceMargin	=	SubsiMkp;
	var NewAmount	=	0;
	if(ServiceMargin){
		ServiceMargin		=	parseFloat(ServiceMargin);

		if(ServiceMargin>0){
			var DiscAmount					=	CalculateQuantityDiscPortionU(OrderAmount,0,ServiceMargin);
			DiscAmount						=	DiscAmount*1;

			NewAmount		=	(DiscAmount+OrderAmount);
			NewAmount		=	NewAmount*1;
			NewAmount		=	NewAmount.toFixed(2);
			NewAmount		=	NewAmount*1;


		}else{
			NewAmount	=	OrderAmount;
		}
	}else{
		NewAmount	=	OrderAmount;
	}
	return NewAmount;
}

var LocMarginF	=	new Array();
function getHomeBranch(homeBranchLoc,item_para){
	var search_a	=	nlapiCreateSearch("customrecord_advs_abc_analysis", [
	            	 	                                                     ["isinactive","is","F"]
	            	 	                                                     ,"AND",
	            	 	                                                     ["custrecord_advs_abc_location","anyof",homeBranchLoc]
	            	 	                                                     ,"AND",
	            	 	                                                     ["custrecord_advs_abc_item","anyof",item_para]
	            	 	                                                     ], [
	            	 	                                                         new nlobjSearchColumn("custrecord_advs_abc_cat_margin", "custrecord_abc_category_itemchild", null),
	            	 	                                                        new nlobjSearchColumn("custrecord_advs_abc_item",null, null)
	            	 	                                                         ]);
	var run_a			=	search_a.runSearch();
	var cols_a			=	run_a.getColumns();
	run_a.forEachResult(function(record_a){
		var PArtL	=	record_a.getValue("custrecord_advs_abc_item", null, null);
		var MarginC	=	record_a.getValue("custrecord_advs_abc_cat_margin", "custrecord_abc_category_itemchild", null);
		AMarginCost	=	MarginC;
		
		LocMarginF[PArtL]	=	new Array();
		LocMarginF[PArtL]["MarginC"]	=	MarginC;
		return true;
	});
}
function getEmpRoleDetailsForCorporate(){
          var UserROle = nlapiGetRole();
		  var UserName = nlapiGetUser();
		  var UserLocation  = nlapiGetLocation();
          var DefaultLocation = "",UpdateLocation = 'F';
  			var Fields = ["custrecord_advs_equipment_roles","custrecord_advs_service_parts_role","custrecord_advs_set_location_based_on_em"]
			var RolesLookup = nlapiLookupField('customrecord_advs_global_setting', 1,Fields);
			var PartsServiceroles = RolesLookup.custrecord_advs_service_parts_role;
			var Equiproles = RolesLookup.custrecord_advs_equipment_roles;
			var EmployeeList = RolesLookup.custrecord_advs_set_location_based_on_em;
			if(EmployeeList){
				var SplitEmployeeList = EmployeeList.split(",");
				for(var i=0;i<SplitEmployeeList.length;i++){
					var Emp = SplitEmployeeList[i];
					if(Emp == UserName){
						UpdateLocation = 'T';
						break;
					}
				}
			}

			if(UpdateLocation =='T'){
				if(Equiproles){
					var SplitRole = Equiproles.split(",");			
					for(var i=0;i<SplitRole.length;i++){
						var Equipmentrole = SplitRole[i];
						if(Equipmentrole == UserROle){
							DefaultLocation = 7;
							break;
						}
					}
				}

				if(PartsServiceroles){
					var PartsServiceSplitRole = PartsServiceroles.split(",");
					for(var i=0;i<PartsServiceSplitRole.length;i++){
						var Servicerole = PartsServiceSplitRole[i];
						if(Servicerole == UserROle){
							DefaultLocation = UserLocation;
							break;
						}
					}
				}
				if(DefaultLocation){
					//nlapiSetFieldValue("location",DefaultLocation);
				}
			}

		return DefaultLocation;
}

function validateLineDept(){
	var lineC	=	nlapiGetLineItemCount("item");
	for(var m=1;m<=lineC;m++){
		var deptLine	=	nlapiGetLineItemValue("item", "department", m);
		if(!deptLine){
			var getInvDept	=	nlapiGetLineItemValue("item", "custcol_advs_dept_frm_inv_typ", m);
			if(getInvDept){
				nlapiSelectLineItem("item", m);
				nlapiSetCurrentLineItemValue("item", "department", getInvDept);
				nlapiCommitLineItem("item");
			}
		}
	}
}  

function SearchOperationCodesTest(RecordId, SalesOrderObj, GlobalDepartment, CauseVal, CorrectionVal, MecId, DocNumber, 
		VINLink, RefNO,Comments,Complaint,Memo,RemarksBody,AppName,AppPhone,AppEmail,serLoca,DriverName,
		DriverPhone,Delmethod,isInternal,AdvsCreatedFrom,billCustTerms,Customer,Location,OrderId,SalesType){


	var homeBranchLoc	=	"";var hasSpPrice=	"F";
	var custFld		=	["custentity_advs_home_branch","custentity_advs_spcl_p_enabled"]
	var	custRec		=	nlapiLookupField("customer", Customer, custFld);
	homeBranchLoc	=	custRec.custentity_advs_home_branch;
	hasSpPrice		=	custRec.custentity_advs_spcl_p_enabled;

	var MarkupLoc	=	nlapiLookupField("location", Location, "custrecord_advs_location_margin");
	if(homeBranchLoc){
		MarkupLoc	=	nlapiLookupField("location", homeBranchLoc, "custrecord_advs_location_margin");

	}
	var VISVINVal = SalesOrderObj.getFieldText("custbody_advs_st_service_equipment");

	var Cause 		=	CauseVal;
	var Correction	=	CorrectionVal;
	var Mechanic	=	MecId;
	var DocumentN	=	DocNumber;
	var Vin			=	VINLink;

	var CSearch = nlapiCreateSearch("customrecord_advs_create_temp_child",
			[
				["custrecord_advs_t_c_head","anyof",RecordId], 
				"AND",
				["isinactive","is","F"], 
				"AND",
				["custrecord_advs_t_c_operation_code.custrecord_st_o_p_m_task_code","noneof","@NONE@"]
				], 
				[
					new nlobjSearchColumn("custrecord_st_o_p_m_task_code","custrecord_advs_t_c_operation_code",null),
					new nlobjSearchColumn("custrecord_advs_t_c_inv_type", null, null),
					new nlobjSearchColumn("custrecord_advs_t_c_labor", null, null),
					new nlobjSearchColumn("custrecord_advs_t_c_operation_desc", null, null),
					new nlobjSearchColumn("custrecord_advs_t_c_labor_rate", null, null),
					new nlobjSearchColumn("custrecord_advs_t_c_labor_quantity", null, null),
					new nlobjSearchColumn("custrecord_advs_t_c_quantity", null, null),			 
					new nlobjSearchColumn("name","custrecord_advs_t_c_operation_code",null).setSort(),
					new nlobjSearchColumn("custrecord_advs_t_c_operation_code", null, null),
					new nlobjSearchColumn("custrecord_advs_t_c_goal_hours", null, null),
					new nlobjSearchColumn("custrecord_advs_t_c_part", null, null),
					new nlobjSearchColumn("custrecord_advs_c_t_d_cause", null, null),
					new nlobjSearchColumn("custrecord_advs_c_t_d_c_tech", null, null),
					new nlobjSearchColumn("custrecord_advs_c_t_d_primary_code", null, null),
					new nlobjSearchColumn("custrecord_advs_o_m_dont_create_task","custrecord_advs_t_c_operation_code",null),
					new nlobjSearchColumn("custrecord_advs_c_t_complaint", null, null),//15
					new nlobjSearchColumn("custrecord_advs_c_t_d_p_assco", null, null),//16
					new nlobjSearchColumn("custrecord_advs_t_c_labor", null, null),//17
					]
	);
	var CRun	=	CSearch.runSearch();
	var CCol	=	CRun.getColumns();
	var OperationCodeForRepair	=	"";

	var parentCodeTask	=	new Array();
	var BangPart = nlapiLookupField('customrecord_advs_global_setting', 1, 'custrecord_advs_gs_bang_part_wo');
	CRun.forEachResult(function (CRes){

		var ServiceCode	=	CRes.getValue(CCol[0]);
		var InveType 	=	CRes.getValue(CCol[1]);
		var BangQuant   =   (CRes.getValue(CCol[6])*1);
		var Quantity	=	(CRes.getValue(CCol[5])*1) * (CRes.getValue(CCol[6])*1);
		Quantity		=	Quantity*1;
		var GoalHours	=	(CRes.getValue(CCol[6])*1) * (CRes.getValue(CCol[9])*1);
		GoalHours		=	GoalHours*1;
		var Description	=	CRes.getValue(CCol[3]);
		var	OperationCode	=	 CRes.getValue(CCol[7]);
		var OperationCodeId	=	CRes.getValue(CCol[8]);
		var ORderQuantity	=	(CRes.getValue(CCol[6])*1);
		var CauseTxt		=	CRes.getValue(CCol[11]);
		var TechID			=	CRes.getValue(CCol[12]);
		var PrimaryC		=	CRes.getValue(CCol[13]);
		var DontCreat		=	CRes.getValue(CCol[14]);
		var complaintt		=	CRes.getValue(CCol[15]);
		var PartAssi		=	CRes.getValue(CCol[16]);
		var VisOpration		=	CRes.getValue(CCol[17]);

		SalesOrderObj.setFieldValue('otherrefnum',RefNO);
		SalesOrderObj.setFieldValue('custbody_advs_service_quote_memo',Comments);
		SalesOrderObj.setFieldValue('custbody_advs_complaints',Complaint);

		SalesOrderObj.setFieldValue('memo',Memo);
		SalesOrderObj.setFieldValue('custbody_advs_dka_remarks_invoice',RemarksBody);
		SalesOrderObj.setFieldValue('custbody_advs_service_apprname',AppName);
		SalesOrderObj.setFieldValue('custbody_advs_service_apprphone',AppPhone);
		SalesOrderObj.setFieldValue('custbody_advs_service_appremail',AppEmail);

		SalesOrderObj.setFieldValue('custbody_advs_service_shop_loc',serLoca);
		SalesOrderObj.setFieldValue('custbody_advs_driver_name',DriverName);
		SalesOrderObj.setFieldValue('custbody_advs_driver_phone',DriverPhone);

//		SalesOrderObj.setFieldValue('custbody_advs_so_tb_order_type',Delmethod);
		SalesOrderObj.setFieldValue('custbody_advs_is_internal_order',isInternal);
		SalesOrderObj.setFieldValue('custbody_advs_created_from',AdvsCreatedFrom);
		SalesOrderObj.setFieldValue('custbody_advs_billing_customer_terms',billCustTerms);


		SalesOrderObj.selectNewLineItem("item");
		SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_selected_inventory_type", CRes.getValue(CCol[1])*1);
		SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_task_item", CRes.getValue(CCol[2])*1);
		SalesOrderObj.setCurrentLineItemValue("item", "item", CRes.getValue(CCol[2])*1);
		SalesOrderObj.setCurrentLineItemValue("item", "description", Description);
		SalesOrderObj.setCurrentLineItemValue("item", "quantity", Quantity);
		SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_goal_hours", GoalHours);

		if(InveType == '3' || InveType == 3 ){
			SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_repair_job_quantity", ORderQuantity);
		}else{
			SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_repair_job_quantity", "");
		}
		SalesOrderObj.setCurrentLineItemValue("item", "price", -1);
		//SalesOrderObj.setCurrentLineItemValue("item", "rate", CRes.getValue(CCol[4])*1);

		if((VISVINVal == 'VIS VIN')&&(VisOpration == 28856)){
			SalesOrderObj.setCurrentLineItemValue("item", "rate", "0.00");
		}else{
			SalesOrderObj.setCurrentLineItemValue("item", "rate", CRes.getValue(CCol[4])*1);
		}
		var RepairTaskId	="";
		if(DontCreat != "T"){
			RepairTaskId = CreateRepairTask(CauseTxt, Correction, TechID, DocumentN, Description, ServiceCode, Vin,
					OperationCode, OperationCodeId, GoalHours,ORderQuantity,complaintt,OrderId,SalesType);
			if(RepairTaskId){
				RepairtaskAry.push(RepairTaskId);
			}
			parentCodeTask[OperationCodeId]	       =	new Array();
			parentCodeTask[OperationCodeId]["id"]	=	RepairTaskId;
		}else{
			if(parentCodeTask[PrimaryC] != null && parentCodeTask[PrimaryC] != undefined){
				RepairTaskId	=	parentCodeTask[PrimaryC]["id"]
			}
		}

		SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_temp_rep_task123", RepairTaskId);
		if(RepairTaskId)
			SalesOrderObj.commitLineItem("item");

		var PartAssociate = CRes.getValue(CCol[10]);

		if(PartAssociate){

			var TempVal = PartAssociate.toString();
			var Split	=	TempVal.split('\\');
			var Length = Split.length;
			for(var R=0;R<Length;R++){
				var Description = Split[R];
				if(BangPart){
					SalesOrderObj.selectNewLineItem("item");
					SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_selected_inventory_type",2);
					SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_task_item",BangPart);
					SalesOrderObj.setCurrentLineItemValue("item", "item", BangPart);
					SalesOrderObj.setCurrentLineItemValue("item", "description", Description);
					SalesOrderObj.setCurrentLineItemValue("item", "quantity", BangQuant);
//					SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_repair_task_link", RepairTaskId);
//					SalesOrderObj.setCurrentLineItemValue("item", "department", GlobalDepartment);
					SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_temp_rep_task123", RepairTaskId);
					SalesOrderObj.commitLineItem("item");
				}

			}

		}

		if(PartAssi){

			var TempVal = PartAssi.toString();
			var Split	=	TempVal.split(',');
			var Length 	= Split.length;

			var PartsArrL	=	new Array();
			for(var R=0;R<Length;R++){
				var PartIDLi = Split[R];
				if(PartIDLi){
					PartsArrL.push(PartIDLi);
				}
			}

			if(PartsArrL.length >0){
				var searchL	=	nlapiCreateSearch("inventoryitem",
						[
							["type","anyof","InvtPart"]
							,"AND",
							["internalid","anyof",PartsArrL]
							], 
							[
								new nlobjSearchColumn("internalid"), 
								new nlobjSearchColumn("custitem_advs_part_brand"), 
								new nlobjSearchColumn("custitem_advs_st_parts_sub_group"), 
								new nlobjSearchColumn("custrecord_advs_p_s_g_margin","CUSTITEM_ADVS_ST_PARTS_SUB_GROUP",null), 
								new nlobjSearchColumn("baseprice"), 
								new nlobjSearchColumn("vendor"),
								new nlobjSearchColumn("pricelevel","pricing",null), 
								new nlobjSearchColumn("unitprice","pricing",null),
								new nlobjSearchColumn("custentity_advs_manu_fac_margin","preferredVendor",null)

								]
				);
				var runP	=	searchL.runSearch();
				var colsp	=	runP.getColumns();
				var PartsByPricelevel	=	new Array();
				runP.forEachResult(function(recp){
					var Pid			=	recp.getValue("internalid");
					var P_Brand		=	recp.getValue("custitem_advs_part_brand");
					var P_SbGp		=	recp.getValue("custitem_advs_st_parts_sub_group");
					var P_Sb_Marg	=	recp.getValue("custrecord_advs_p_s_g_margin","CUSTITEM_ADVS_ST_PARTS_SUB_GROUP",null);
					var Bsp			=	recp.getValue("baseprice");
					var Vendor		=	recp.getValue("vendor");
					var PLevel		=	recp.getValue("pricelevel","pricing",null);
					var UnitPrice	=	recp.getValue("unitprice","pricing",null);
					var ManufMarg	=	recp.getValue("custentity_advs_manu_fac_margin","preferredVendor",null);



					if(PartsByPricelevel[Pid] != null && PartsByPricelevel[Pid] != undefined){
						if(PartsByPricelevel[Pid][PLevel] != null && PartsByPricelevel[Pid][PLevel] != undefined){

						}else{
							PartsByPricelevel[Pid][PLevel]	=	new Array();
							PartsByPricelevel[Pid][PLevel]["Brand"]			=	P_Brand;
							PartsByPricelevel[Pid][PLevel]["P_SbGp"]		=	P_SbGp;
							PartsByPricelevel[Pid][PLevel]["Bsp"]			=	Bsp;
							PartsByPricelevel[Pid][PLevel]["Vendor"]		=	Vendor;
							PartsByPricelevel[Pid][PLevel]["UnitPrice"]		=	UnitPrice;
							PartsByPricelevel[Pid][PLevel]["P_Sb_Marg"]		=	P_Sb_Marg;
							PartsByPricelevel[Pid][PLevel]["ManufMarg"]		=	ManufMarg;
						}

					}else{
						PartsByPricelevel[Pid]	=	new Array();
						PartsByPricelevel[Pid][PLevel]	=	new Array();
						PartsByPricelevel[Pid][PLevel]["Brand"]			=	P_Brand;
						PartsByPricelevel[Pid][PLevel]["P_SbGp"]		=	P_SbGp;
						PartsByPricelevel[Pid][PLevel]["Bsp"]			=	Bsp;
						PartsByPricelevel[Pid][PLevel]["Vendor"]		=	Vendor;
						PartsByPricelevel[Pid][PLevel]["UnitPrice"]		=	UnitPrice;
						PartsByPricelevel[Pid][PLevel]["P_Sb_Marg"]		=	P_Sb_Marg;

						PartsByPricelevel[Pid][PLevel]["ManufMarg"]		=	ManufMarg;
					}

					return true
				});

				var CustPLevel		=	SalesOrderObj.getFieldValue("custbody_advs_st_cust_price_level");
				var homeBranchLoc	=	SalesOrderObj.getFieldValue("custbody_advs_cust_home_branch");
				var subsiMkp		=	SalesOrderObj.getFieldValue("custbody_advs_serv_cost_margin");
				getHomeBranch(homeBranchLoc,PartsArrL);

				for(var R=0;R<Length;R++){
					var PartIDLi = Split[R];
					if(PartIDLi){
						if(PartsByPricelevel[PartIDLi] != null && PartsByPricelevel[PartIDLi] != undefined){
							var AMarginCost	=	0;
							if(LocMarginF[PartIDLi] != null && LocMarginF[PartIDLi] != undefined){
								AMarginCost	=	LocMarginF[PartIDLi]["MarginC"];
							}


							if(PartsByPricelevel[PartIDLi][CustPLevel] != null && PartsByPricelevel[PartIDLi][CustPLevel] != undefined){
								var PartBrand	=	PartsByPricelevel[PartIDLi][CustPLevel]["Brand"];
								var PartSubGP	=	PartsByPricelevel[PartIDLi][CustPLevel]["P_SbGp"];
								var BasePrice	=	PartsByPricelevel[PartIDLi][CustPLevel]["Bsp"];
								var Vendor		=	PartsByPricelevel[PartIDLi][CustPLevel]["Vendor"];
								var UnitPrice	=	PartsByPricelevel[PartIDLi][CustPLevel]["UnitPrice"];
								var PartSubGpMkp=	PartsByPricelevel[PartIDLi][CustPLevel]["P_Sb_Marg"];
								var ManufMarg	=	PartsByPricelevel[PartIDLi][CustPLevel]["ManufMarg"];

								if(PartsByPricelevel[PartIDLi][9] != null && PartsByPricelevel[PartIDLi][9] != undefined){
									var ListPrice	=	PartsByPricelevel[PartIDLi][9]["UnitPrice"];
								}else{
									var ListPrice	=	0;
								}


								var getPriceL	    =	fetchPricingOper(PartIDLi,CustPLevel,Customer,subsiMkp,homeBranchLoc,Location,
										UnitPrice,ManufMarg,PartSubGpMkp,MarkupLoc,UnitPrice,hasSpPrice,Vendor,PartSubGP,PartBrand,ListPrice,AMarginCost);

								if(getPriceL){
									var splitgetPriceL	=	getPriceL.split("$rat$");
									var PartsAmountSp		=	splitgetPriceL[0];
									var servAmntSp		=	splitgetPriceL[1];
									var PriceTypeL		=	splitgetPriceL[2];


								}else{

									var PartsAmountSp	=	0;
									var servAmntSp		=	0;
									var PriceTypeL		=	"";
								}
							}


							SalesOrderObj.selectNewLineItem("item");
							SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_selected_inventory_type",2);
							SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_task_item",PartIDLi);
							SalesOrderObj.setCurrentLineItemValue("item", "item", PartIDLi);
							SalesOrderObj.setCurrentLineItemValue("item", "quantity", BangQuant);
//							SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_repair_task_link", RepairTaskId);
//							SalesOrderObj.setCurrentLineItemValue("item", "department", GlobalDepartment);
							SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_temp_rep_task123", RepairTaskId);
							SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_is_associated_p", "T");


							SalesOrderObj.setCurrentLineItemValue("item", "price", "-1");
							SalesOrderObj.setCurrentLineItemValue("item", "rate", servAmntSp);
							SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_original_price", servAmntSp);

							if(PriceTypeL == "PROMO"){

								SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_prom_price", "T");
							}else if(PriceTypeL == "REBT"){

								SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_rebate_vendor_price", servAmntSp);
								SalesOrderObj.setCurrentLineItemValue("item", "price", -1);
								SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_t_l_rebate_addede", "T");
								SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_special_price_added", "T");
								SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_var_approved_status", 1);

								SalesOrderObj.setCurrentLineItemValue("item", "custrecord_advs_p_s_b_c_r_r", rebrecv);

							}else{
								if(specialPExist == "T"){

									SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_special_price_added", "T");
								}
							}
							SalesOrderObj.commitLineItem("item");

						}

					}
				}
//				var GetPrice	=	fetchPricingOperation(item_para,);
			}


			/*for(var R=0;R<Length;R++){
				var PartIDLi = Split[R];
				if(PartIDLi){
					SalesOrderObj.selectNewLineItem("item");
					SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_selected_inventory_type",2);
					SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_task_item",PartIDLi);
					SalesOrderObj.setCurrentLineItemValue("item", "item", PartIDLi);
					SalesOrderObj.setCurrentLineItemValue("item", "quantity", BangQuant);
//					SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_repair_task_link", RepairTaskId);
					SalesOrderObj.setCurrentLineItemValue("item", "department", GlobalDepartment);
					SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_temp_rep_task123", RepairTaskId);
					SalesOrderObj.setCurrentLineItemValue("item", "custcol_advs_is_associated_p", "T");

					SalesOrderObj.commitLineItem("item");
				}

			}*/

		}


		return true;
	});
}


function SearchFormMappingTest(FormReferen){

	var RecordSearch = nlapiCreateSearch("customrecord_advs_form_mapping",
			[
				["custrecord_advs_fm_record_ref","is",FormReferen], 
				"AND", 
				["isinactive","is","F"]
				], 
				[
					new nlobjSearchColumn("custrecord_advs_fm_transaction_form_id", null, null),
					new nlobjSearchColumn("custrecord_advs_fm_default_department", null, null),
					new nlobjSearchColumn("custrecord_advs_fm_module_name", null, null)
					]
	);
	var RRun	=	RecordSearch.runSearch();
	var RCol	=	RRun.getColumns();
	var RepairForm	=	"",	Department	=	"",	ModuleName	=	"";
	RRun.forEachResult(function (RRes){

		RepairForm	=	RRes.getValue(RCol[0]);
		Department	=	RRes.getValue(RCol[1]);
		ModuleName	=	RRes.getValue(RCol[2]);

		return true;
	});


	return RepairForm+"##ANIR#"+Department+"##ANIR#"+ModuleName+"##ANIR#";
}




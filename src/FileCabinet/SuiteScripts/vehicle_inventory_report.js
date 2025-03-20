/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       30 Aug 2019     EVT2018_02
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response) {

  if (request.getMethod() == "GET") {

    var form = nlapiCreateForm('', true);

    var custPara = request.getParameter("custid_para"); 
    var vinPara = request.getParameter("custpara_vinid");
    
	 var custPara = request.getParameter("custid_para");
    var CustFld = form.addField("custpage_custfld", "select", "Customer", "customer");
    CustFld.setDisplayType('hidden');
	
	var vinFld = form.addField("custpage_vinfld", "select", "VIN", "customrecord_advs_vm");
    vinFld.setDisplayType('hidden');
	
	var Year,Make,Modelde,VIN,vinname,busmodel='',Plate='';
	var filters= [];

	 nlapiLogExecution('error','vinPara',vinPara);
		filters=[
         
			["isinactive", "is", "F"]
		] 
	 
	
	  
	var vmSearch = nlapiCreateSearch("customrecord_advs_vm",
     filters,
      [
        new nlobjSearchColumn("name"),  
        new nlobjSearchColumn("internalid"),  
		new nlobjSearchColumn("custrecord_advs_vm_model"),  
      ]
    );
    if (vinPara) {
      vinFld.setDefaultValue(vinPara);
      vmSearch.addFilter(new nlobjSearchFilter("internalid", null, "anyof", vinPara));
    }
    var ModelImage1 = "",ModelImag2="",ModelImag3="",ModelImag4="",StockImage1="",StockImage2="",StockImage3="",StockImage4="";
    var runn = vmSearch.runSearch();
    var colm = runn.getColumns();
    runn.forEachResult(function (vmrec) {
		nlapiLogExecution('error','vmrec',JSON.stringify(vmrec));
      vinname = vmrec.getValue(colm[0]); 
	  VIN = vmrec.getValue(colm[0]);
      Modelde = vmrec.getValue(colm[2]);  
      IntId = vmrec.getValue(colm[1]);  
	  busmodel = vmrec.getValue(colm[2]);
	  busmodelText = vmrec.getText(colm[2]); 
	   
      return true;
    });
           
   var html = '';
    
	  ///////////////////////////////////////////////////SECOND ROW//////////////////////////////////////////////////////////////////////////////
	   html+="<table width='100%' align='center' style='margin-top:30px;'>" +
      "<tr>" +  
      "<td><table class='table101' width='100%'>" +
       "<tr style='text-align:center; font-size:14px; cellpadding:15px; background-color:#607799;color:white;'><td><b>Inventory Cost & Profitability</b></td></tr>" +
      "</table></td>" +
      "</tr>" + 
      "<tr>" +
      "<td> " ;
	  html +="<style>";
		html +="#table_headers {";
		html +='font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;';
		html +="border-collapse: collapse; border:1;";
		html +="width: 90%;";
		html +="margin-left: 4%;";
		html +="}";
		html +="#table_headers td, #customers th {";
		html +="border: 1px solid #ddd;";
		html +="padding: 6px;";
		html +="}";
		html +="#table_headers tr:nth-child(even){background-color: #f2f2f2;}";
		html +="#table_headers tr:hover {background-color: #ddd;}";
		html +="#table_headers th {";
		html +="padding-top: 8px;";
		html +="padding-bottom: 8px;";
		html +="text-align: left;";
		html +="background-color: #D8D8D8;";
		html +="color: white;";
		html +="font-size: small;";
		html +="background-color: #607799;";
		html +="}";
		html +="</style>";


		html +="<table id='table_headers'>";//
		html +="<tr>" +
		"<th>&nbsp;&nbsp;MODEL</th>" + 
		"<th>&nbsp;&nbsp;LOCATION</th>" +
		"<th>&nbsp;&nbsp;VIN</th>" +
		"<th>&nbsp;&nbsp;INBOUND DATE</th>" +
		"<th>&nbsp;&nbsp;AGE (IN DAYS)</th>" +
		"<th>STOCK</th>" +
		"<th>&nbsp;&nbsp;BASE COST</th>" +
		// "<th>&nbsp;&nbsp;Pre Fulfillment Cost</th>" +
		"<th>&nbsp;&nbsp;ADDITIONAL CHARGES</th>" +
		"<th>&nbsp;&nbsp;MISC</th>" +
		"<th>&nbsp;&nbsp;LANDED COST/COGS</th>" +
		/* "<th>&nbsp;&nbsp;SALES</th>" +
		"<th>&nbsp;&nbsp;PROFIT</th>" +
		"<th>&nbsp;&nbsp;PROFIT %</th>" + */
		"</tr>";
		var custparam_date = nlapiDateToString(new Date());
		var land_cost_details_url = nlapiResolveURL('SUITELET', 'customscript_advs_ssf_landed_cost_import', 'customdeploy_advs_ssf_landed_cost_import');// Ignore this if you want 
		 var vehicle_landed_cost1=0;
		  nlapiLogExecution('ERROR','VIN',VIN)
			var landedcostcheck = parseInt(findlandedcostifzero(VIN));
			 nlapiLogExecution('ERROR','landedcostcheck',landedcostcheck)
			var rs=[];
			if(landedcostcheck!=0)
			{
				 rs= findlandedcostmax(VIN)
			}
			if(landedcostcheck==0){vehicle_landed_cost1=0;}
			var _sales = salesrate(IntId);
			for(var i=0;i<rs.length;i++){
				var rec = rs[i];
				//var recID	=	rec.getId();
				var item = rec.item;
				var item_text = rec.itemtext;
				var Location = rec.location;
				var locationid = rec.locationid;
				var Vin = rec.vin;
				var vehicle_inbound_date = rec.inbounddate; 
				var vehicle_base_cost = rec.basecost;
				var additional_charges = rec.additional_charges;
				var vehicle_landed_cost = rec.cogs;
				var sales = _sales.toFixed(2);
				var stock_in_units = rec.qty;
				if(sales!=0){
					stock_in_units = parseFloat(rec.qty) -1;
				}
				var profit=0;
				var profitpercentage=0;
				var InboundDate = nlapiStringToDate(vehicle_inbound_date);
				var FilterDate = nlapiStringToDate(custparam_date);
				var AgeInDays = Math.round((FilterDate-InboundDate)/(1000*60*60*24));
				var MischAmnt	=	0;

				MischAmnt	=	MischAmnt*1;
				MischAmnt	=	MischAmnt.toFixed(2);


				vehicle_landed_cost	=	vehicle_landed_cost*1;
				vehicle_landed_cost+=MischAmnt*1;
				vehicle_landed_cost	=	vehicle_landed_cost*1;
				vehicle_landed_cost	=	vehicle_landed_cost.toFixed(2);
				if(sales!=0){
					profit = (sales-vehicle_landed_cost).toFixed(2);
					profitpercentage = ((profit/sales)*100).toFixed(2);
				}
				  
				var land_cost_details_url_post = land_cost_details_url+'&custparam_item='+item+'&custparam_date='+custparam_date+'&custparam_serial_number='+Vin;
				if(locationid==2){
					continue;
				}
				html +="<tr><td>&nbsp;&nbsp;&nbsp;"+item_text+"</td>" +

				"<td>"+Location+"</td>" +
				"<td>"+Vin+"</td>" +
				"<td>"+vehicle_inbound_date+"</td>" +
				"<td>"+AgeInDays+"</td>" +
				"<td>"+stock_in_units+"</td>" +
				"<td>"+vehicle_base_cost+"</td>" +
				// "<td>"+vehicle_base_cost+"</td>" +
				"<td><a href='"+land_cost_details_url_post+"' target='_blank'>"+additional_charges+"</a></td>" +
				"<td>"+MischAmnt+"</td>" +
				"<td>"+vehicle_landed_cost+"</td>" +
				/* "<td>"+sales+"</td>" +
				"<td>"+profit+"</td>" +
				"<td>"+profitpercentage+"</td>" + */
				
				"</tr>";
			}
			 
	  html +="</table>";
	  
	  
	  html +="</td>" +
      "</tr></table>"; 
	  
	  
    var HmtlFld1 = form.addField('custpage_html', 'inlinehtml', '');
    HmtlFld1.setDefaultValue(html);
   
    // form.addButton("custpage_refresh", "Refresh", "onRefresh(" + custPara + "," + vinPara + ")");
   // form.setScript("customscript_advs_cssl_vehicle_dashboard");
    //form.setScript("customscript_advs_cs_vehicle_db");
    response.writePage(form);

  }

}

function findlandedcostifzero(vin)
{
	nlapiLogExecution('error','vin findlandedcostifzero',vin);
	try{
		var transactionSearch = nlapiSearchRecord("transaction",null,
		[
		   ["posting","is","T"], 
		   /*  "AND", 
		   ["account","anyof","470","509","510","511"],   */
		   "AND", 
		   ["serialnumber","startswith",vin]
		], 
		[
		   new nlobjSearchColumn("serialnumbercost",null,"SUM")
		]
		);
		var isZero=0;
		for(var i=0;i<transactionSearch.length;i++)
		{
			nlapiLogExecution('error','chck1',transactionSearch[i].getValue("serialnumbercost",null,"SUM"))
			isZero = transactionSearch[i].getValue("serialnumbercost",null,"SUM");
		}
		nlapiLogExecution('error','isZero findlandedcostifzero',isZero);
		return isZero;
	}catch(e)
	{
		nlapiLogExecution('error','Error',e.toString());
	}
}
function findlandedcostmax(vin)
{
	try{
		nlapiLogExecution('error','vin',vin);
		 var transactionSearch = nlapiSearchRecord("transaction",null,
			[
			   ["posting","is","T"], 
			   /*  "AND", 
			   ["account","anyof","470","509","510","511"],   */
			   "AND", 
			   ["serialnumber","is",vin]
			], 
			[
			   new nlobjSearchColumn("item"), 
			   new nlobjSearchColumn("locationnohierarchy"), 
			   new nlobjSearchColumn("serialnumber"), 
			   new nlobjSearchColumn("trandate").setSort(true), 
			   new nlobjSearchColumn("trandate").setSort(true), 
			   new nlobjSearchColumn("formulacurrency1").setFormula("{serialnumbercost}-({serialnumbercost}-{amount})"), 
			   new nlobjSearchColumn("formulacurrency2").setFormula("{serialnumbercost}-{amount}"), 
			   new nlobjSearchColumn("serialnumbercost"), 
			   new nlobjSearchColumn("formulacurrency3").setFormula("sum/* comment */({serialnumbercost})  OVER(PARTITION BY {name}     ORDER BY {internalid}     ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)"), 
			   new nlobjSearchColumn("serialnumberquantity"), 
			   new nlobjSearchColumn("formulatext4").setFormula("{CUSTCOL_ADVS_VIN_LINK.name}"), 
			   new nlobjSearchColumn("type"), 
			   new nlobjSearchColumn("tranid"), 
			   new nlobjSearchColumn("trandate").setSort(true), 
			   new nlobjSearchColumn("createdfrom"), 
			   //new nlobjSearchColumn("custrecord_bus_body_number","CUSTBODY_ADVS_STOCK_UNIT_NO",null), 
			  // new nlobjSearchColumn("custrecord_bus_body_number","CUSTBODY_SO_STOCKUNIT",null)
			  /* ,
			   new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("CASE WHEN {account}='428' THEN {quantity} ELSE 0 END")  */
  
			]
			);
			var arr=[];
			if(transactionSearch && transactionSearch.length>0){
				for(var lc=0;lc<transactionSearch.length;lc++)
				{
					var obj = {};
					obj.item=transactionSearch[lc].getValue("item");
					obj.itemtext=transactionSearch[lc].getText("item");
					obj.locationid=transactionSearch[lc].getValue("locationnohierarchy");
					obj.location=transactionSearch[lc].getText("locationnohierarchy");
					obj.vin=transactionSearch[lc].getValue("serialnumber");
					obj.inbounddate=transactionSearch[lc].getValue("trandate");
					obj.basecost=transactionSearch[lc].getValue("formulacurrency1");
					obj.prefulfillmentcost=transactionSearch[lc].getValue("formulacurrency1");
					obj.additional_charges=parseFloat(transactionSearch[lc].getValue("formulacurrency2")||0);
					obj.cogs=Math.abs(transactionSearch[lc].getValue("serialnumbercost"));
					obj.qty=transactionSearch[lc].getValue("serialnumberquantity");
					arr.push(obj);
				}
			}
			nlapiLogExecution('error','arr',arr);
			return arr;
	}catch(e)
	{
		nlapiLogExecution('error','Error in max',e.toString());
	}
}

function salesrate(vinname)
{
	try{
		var transactionSearch = nlapiSearchRecord("transaction",null,
		[
		   /* ["account","anyof","428","431","308","467","463","468","315"], 
		   "AND",  */
		   ["posting","is","T"], 
			"AND",  
			[["custcol_advs_st_equip_sales","anyof",vinname],
			"OR",
			["custcol_advs_st_vin_purchase","anyof",vinname]]
			
			
		], 
		[
		   
		    
		   new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("CASE WHEN {account} in ('4020 Sales : School Bus New') THEN {quantity} ELSE 0 END"), 
		   new nlobjSearchColumn("formulacurrency1",null,"SUM").setFormula("CASE WHEN {account} in ('4020 Sales : School Bus New') THEN {amount} ELSE 0 END"), 
		   new nlobjSearchColumn("amount",null,"SUM"), 
		   new nlobjSearchColumn("discountamount",null,"SUM"), 
		   new nlobjSearchColumn("formulacurrency2",null,"SUM").setFormula("CASE WHEN {account} in ('5020 Cost of Goods Sold : COGS School Bus New') THEN {amount} ELSE 0 END")
		]
		);
		 
		var _salesrate = 0;
		for(var sr=0;sr<transactionSearch.length;sr++)
		{
			_salesrate = Math.abs(transactionSearch[sr].getValue("amount",null,"SUM"));
		}
		return _salesrate;
	}catch(e)
	{
		nlapiLogExecution('error','Error in salesrate',e.toString());
		return 0;
	}
}
 
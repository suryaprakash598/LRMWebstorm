/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/format', 'N/log', 'N/record', 'N/runtime', 'N/search','N/ui/serverWidget','N/error','N/redirect','./advs_lib_rental_leasing','./advs_lib_util'],
    /**
     * @param {format} format
     * @param {log} log
     * @param {record} record
     * @param {runtime} runtime
     * @param {search} search
     */
    function(format, log, record, runtime, search,serverWidget,error,redirect,lib_rental,libUtil) {

        /**
         * Definition of the Suitelet script trigger point.
         *
         * @param {Object} context
         * @param {ServerRequest} context.request - Encapsulation of the incoming request
         * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
         * @Since 2015.2
         */
        function onRequest(context) {
            var request		=	context.request;
            var response	=	context.response;
            if(request.method == "GET"){
                var dealID	=	request.parameters.recordid; // // Custparam_stockID
                var form	=	serverWidget.createForm({title:"Return"});

                var Lookfld	=	["custrecord_advs_lm_lc_vin"];

                var stockFldObj	= form.addField({id:"custpage_con_head", type:serverWidget.FieldType.SELECT, label:"Contract #", source:"customrecord_advs_lease_header"});
                stockFldObj.defaultValue=dealID;
                stockFldObj.updateDisplayType({displayType:"hidden"});

                var totalLineObj	=	form.addField({id:"custpage_totallines", type:serverWidget.FieldType.INTEGER, label:"totalLine"});
                totalLineObj.updateDisplayType({displayType:"hidden"});

                /*var vinFldObj	=	form.addField({id:"custpage_vin_list", type:serverWidget.FieldType.SELECT, label:"Vin #", source:null});
                getVinDetails(dealID,vinFldObj);*/

                var StockInfo		=	getStockDetails(dealID);
                var RemainAmntData	=	getOpeninvoiceAmount(dealID);
                var ItemsData	    =	getOtherItemsL();
                var pendingtoPay	=	getPendingPay(dealID);




                var htmlfld	    =	form.addField({id:"custpage_html", type:"inlinehtml", label:" "});
                var html_data	=	"";

                html_data+="<html>" +
                    "	<head>" +
                    "	<title></title>" +
                    "<link rel='stylesheet' href='https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css'>"+
                    "<link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200' />"+
                    "<link rel='stylesheet' href='https://tstdrv1064792.app.netsuite.com/core/media/media.nl?id=120820&c=TSTDRV1064792&h=PLy3ZDB260H7MOkzDqbUTpjPz-nYNRKSR-yblG5PO8_zXwtq&_xt=.css'>"+

                    "<script src='https://code.jquery.com/jquery-1.12.4.js'></script>"+
                    "<script src='https://code.jquery.com/ui/1.12.1/jquery-ui.js'></script>"+

                    "<script src='https://7402429-sb1.app.netsuite.com/core/media/media.nl?id=9500&c=7402429_SB1&h=Hr13HJj6CWwhXk698LP6dlQ2HvNwWL5zsQPAftRwXFouu9e1&_xt=.js'></script>"+

                    "<style>" +
                    ".ShaBold{" +
                    "font-weight:bold;" +
                    "}" +

                    ".switch {"+
                    "  position: relative;"+
                    "  display: inline-block;"+
                    "  width: 60px;"+
                    "  height: 28px;"+
                    "}"+
                    ""+
                    ".switch input { "+
                    "  opacity: 0;"+
                    "  width: 0;"+
                    "  height: 0;"+
                    "}"+
                    ""+
                    ".slider {"+
                    "  position: absolute;"+
                    "  cursor: pointer;"+
                    "  top: 0;"+
                    "  left: 0;"+
                    "  right: 0;"+
                    "  bottom: 0;"+
                    "  background-color: #ccc;"+
                    "  -webkit-transition: .4s;"+
                    "  transition: .4s;"+
                    "}"+
                    ""+
                    ".slider:before {"+
                    "  position: absolute;"+
                    "  content: '';"+
                    "  height: 20px;"+
                    "  width: 20px;"+
                    "  left: 6px;"+
                    "  bottom: 4px;"+
                    "  background-color: white;"+
                    "  -webkit-transition: .4s;"+
                    "  transition: .4s;"+
                    "}"+
                    ""+
                    "input:checked + .slider {"+
                    "  background-color: #2196F3;"+
                    "}"+
                    ""+
                    "input:focus + .slider {"+
                    "  box-shadow: 0 0 1px #2196F3;"+
                    "}"+
                    ""+
                    "input:checked + .slider:before {"+
                    "  -webkit-transform: translateX(26px);"+
                    "  -ms-transform: translateX(26px);"+
                    "  transform: translateX(26px);"+
                    "}"+
                    ""+
                    "/* Rounded sliders */"+
                    ".slider.round {"+
                    "  border-radius: 34px;"+
                    "}"+
                    ""+
                    ".slider.round:before {"+
                    "  border-radius: 50%;"+
                    "}" +
                    ".hidediv{" +
                    "display:none;" +
                    "}" +
                    "" +
                    ".material-symbols-outlined {"+
                    "font-variation-settings:"+
                    "'FILL' 0,"+
                    "'wght' 400,"+
                    "'GRAD' 0,"+
                    " 'opsz' 24"+
                    "}"+
                    ".itemlines{font-size:8pt;}" +
                    ".removeicon{margin-top:8%;}"+


                    "</style>" +
                    "	<script>" +

                    "$(function() {" +
                    "var icons = {"+
                    "header: '1',"+
                    "activeHeader: '1'"+
                    "};"+

                    "		    $( '#accordion  > div' ).accordion({" +
                    "		      collapsible: true," +
                    "			  icons: icons," +
                    "			  heightStyle: 'content'," +
                    "			  active:true" +
                    "		    });" +
                    "		  } );"+
                    "		</script>";

                /*html_data+="<script>" +
                        "function doAdding(line){" +
                        "alert('Welcome');" +
                        "var SelectedItem	=	document.getElementById('item_list_'+line+'').value;" +
                        "var ItemDesc		=	document.getElementById('item_desc_'+line+'').value;" +
                        "var ItemRate		=	document.getElementById('item_rate_'+line+'').value;" +
                        "if(SelectedItem){" +
                        "alert('SelectedItem')" +
    //					"var content	=	<li id='item_list_li_1' name='item_list_li_1'>;" +
                        "content+= '<div class='form-row'>';"+
                        "content+='<div class='form-wrapper'>';"+
                        "content+='<p>Item Name</p>';"+
                        "content+='</div>';"+

                        "content+='<div class='form-wrapper'>';"+
                        "content+='<p>Description</p>';"+
                        "content+='</div>';"+

                        "content+='<div class='form-wrapper'>';"+
                        "content+='<p>Rate</p>';"+
                        "content+='</div>';"+

                        "content+='<div class='form-wrapper'>';"+
                        "content+='<a href='#'>Remove</a>';"+
                        "content+='</div>';"+

                        "content+='</div>';"+	//Row End
    //					"content+=</li>"+
                        "" +
    //					"document.getElementById('selecteddata_'+line+').appendChild(content);" +
                        "}else{" +
                        "alert('Please select Item.');" +
                        "return false;" +
                        "}" +
                        "" +
                        "}" +
                        "" +
                        "" +
                        "" +
                        "</script>" ;*/

                html_data+="<div id='accordion' style='width:100%;' class='main_css'>";
//			html_data+="<div>" ;

                var allLines	=	0;

                var RemainAmount	=	0;
                if(RemainAmntData[dealID] != null && RemainAmntData[dealID] != undefined){
                    RemainAmount	=	RemainAmntData[dealID]["Rem"]*1;
                }
                RemainAmount	=	RemainAmount*1;
                RemainAmount	=	RemainAmount.toFixed(2);
                RemainAmount	=	RemainAmount*1;

                pendingtoPay	=	pendingtoPay*1;
                pendingtoPay	=	pendingtoPay.toFixed(2);
                pendingtoPay	=	pendingtoPay*1;

                var buyoutOffered	=	(pendingtoPay+RemainAmount);

                buyoutOffered	=	buyoutOffered*1;
                buyoutOffered	=	buyoutOffered.toFixed(2);
                buyoutOffered	=	buyoutOffered*1;


                var m	=	0;

// 			for(var m=0;m<StockInfo.length;m++){

// 				if(StockInfo[m] != null && StockInfo[m] != undefined){
// 					var vinID			=	StockInfo[m].vinId;
// 					var AssetValue		=	StockInfo[m].AssetValue;
// 					var CurrentBkVal	=	StockInfo[m].CurrentBkVal;
// 					var TotDepAmount	=	StockInfo[m].TotDepAmount;
// 					var deposit			=	StockInfo[m].deposit;
// 					var vinName			=	StockInfo[m].vinName;
// 					var REntChID		=	StockInfo[m].id;
// 					var FACard			=	StockInfo[m].FACard;

// 					var FaLeaseAcc		=	StockInfo[m].FaLeaseAcc;
// 					var FaLeaseDepAcc	=	StockInfo[m].FaLeaseDepAcc;

// 					var loanAmount		=	StockInfo[m].loanAmount;
// 					var residual		=	StockInfo[m].residual;
// 					var downpay			=	StockInfo[m].downpay;

// 					var taxcode			=	StockInfo[m].taxcode;



// 					loanAmount	=	loanAmount*1;

// 					residual	=	residual*1;
// 					downpay		=	downpay*1;

// 					var TaxRate	=	"7";
// 					if(taxcode){
// //						TaxRate	=	nlapiLookupField("taxgroup",taxcode,"rate");
// 						var TaxRec	=	search.lookupFields({
// 							type:"taxgroup",
// 							id:taxcode,
// 							columns:["rate"]

// 						});
// //						var TaxRate	=	"";
// 						if(TaxRec["rate"] != null && TaxRec["rate"] != undefined){
// 							TaxRate	= TaxRec["rate"];
// 						}

// 						TaxRate	=	parseFloat(TaxRate);
// 					}
// 					TaxRate	=	TaxRate*1;

// 					var FinalTax	=	((TaxRate/100)+1);
// 					FinalTax	=	FinalTax*1;FinalTax	=	FinalTax.toFixed(2);
// 					FinalTax	=	FinalTax*1;

// 					var totalLeaseAmnt	=	((loanAmount*FinalTax)+downpay);



// //					log.debug("StockInfo",StockInfo[m]);

// 					CurrentBkVal	=	CurrentBkVal*1;
// 					CurrentBkVal	=	CurrentBkVal.toFixed(2);
// 					CurrentBkVal	=	CurrentBkVal*1;
// 					deposit	=	deposit*1;

// 					var PurPayable	=	((totalLeaseAmnt-downpay)+residual);
// 					PurPayable	=	PurPayable*1;


// 					var NetPaywithTax	=	(PurPayable+RemainAmount);
// 					NetPaywithTax		=	NetPaywithTax*1;
// 					NetPaywithTax		=	NetPaywithTax.toFixed(2);
// 					NetPaywithTax		=	NetPaywithTax*1;


// 					var NetPayM	=	(NetPaywithTax/FinalTax);
// 					NetPayM	=	NetPayM*1;
// 					NetPayM	=	NetPayM.toFixed(2);
// 					NetPayM	=	NetPayM*1;


                html_data+="<div>" +
                    "<h3 class='accordion-header'>" +
                    // ""+vinName+""+
                    "</h3>	" +
                    "<div>"+

                    "<div class='form-row'>"+
                    /*	"<div class='form-wrapper hidediv'>"+
                        "<label for=''>Asset</label>"+
                        // "<input type='text' id='custpage_asset_value"+m+"' name='custpage_asset_value"+m+"' class='form-control'  fdprocessedid='8y5s7m' value="+AssetValue+" readonly>"+

                        "</div>"+

                        "<div class='form-wrapper hidediv'>"+
                        "<label for=''>Depreciation</label>"+
                        // "<input type='text' id='custpage_dep_value"+m+"' id='custpage_dep_value"+m+"' class='form-control'  fdprocessedid='cbnn8' value="+TotDepAmount+" readonly>"+
                        "</div>"+

                        "<div class='form-wrapper hidediv'>"+
                        "<label for=''>Book Value</label>"+
                        // "<input type='text' id='custpage_book_value"+m+"' name='custpage_book_value"+m+"' class='form-control'  fdprocessedid='cbnn8' value="+CurrentBkVal+" readonly>"+
                        "</div>"+*/

                    /*"<div class='form-wrapper'>"+
                    "<label for=''>Lease Receivable</label>"+
                    // "<input type='text' id='custpage_lease_receiv"+m+"' name='custpage_lease_receiv"+m+"' class='form-control'  fdprocessedid='cbnn8' value="+totalLeaseAmnt+" readonly>"+
                    "</div>"+*/

                    /*"<div class='form-wrapper'>"+
                    "<label for=''>Residual</label>"+
                    // "<input type='text' id='custpage_lease_rsidual"+m+"' name='custpage_lease_rsidual"+m+"' class='form-control'  fdprocessedid='cbnn8' value="+residual+" readonly>"+
                    "</div>"+*/

                    /*	"<div class='form-wrapper'>"+
                        "<label for=''>Less Deposit</label>"+
                        // "<input type='text' class='form-control'  fdprocessedid='cbnn8' value="+downpay+" readonly>"+
                        "</div>"+*/

                    /*"<div class='form-wrapper'>"+
                    "<label for=''>Vehicle Net</label>"+
                    // "<input type='text' class='form-control'  fdprocessedid='cbnn8' value="+PurPayable+" readonly>"+
                    "</div>"+*/

                    "<div class='form-wrapper'>"+
                    "<label for=''>Unpaid Receivable</label>"+
                    // "<input type='text' class='form-control'  fdprocessedid='cbnn8' value="+RemainAmount+" readonly>"+
                    "<input type='text' id='custpage_lease_receiv' name='custpage_lease_receiv' class='form-control'  fdprocessedid='cbnn8' value="+RemainAmount+" readonly>"+
                    "</div>"+

                    "<div class='form-wrapper'>"+
                    "<label for=''>Schd Remain Payment</label>"+
                    "<input type='text' id='custpage_lease_pend_pay' name='custpage_lease_pend_pay' class='form-control'  fdprocessedid='cbnn8' value="+pendingtoPay+" readonly>"+
                    "</div>"+
                    "<div class='form-wrapper'>"+
                    "<label for=''> Return Value</label>"+
                    "<input type='text' class='form-control' id='custpage_buyout_offer' name='custpage_buyout_offer'  fdprocessedid='cbnn8' value="+buyoutOffered+" onChange='onchangeBuyout();'>"+
                    "</div>"+

                    "<div class='form-wrapper'>"+
                    "<label for=''>Add on charges</label>"+
                    "<input type='text' id='custpage_addons' name='custpage_addons' class='form-control'  fdprocessedid='cbnn8' value='0' readonly>"+
                    "</div>"+


                    "<div class='form-wrapper'>"+
                    "<label for=''>Net Payable</label>"+
                    "<input type='text' id='custpage_netamount' name='custpage_netamount' class='form-control'  fdprocessedid='cbnn8' value='"+buyoutOffered+"' readonly>"+
                    "</div>"+

                    "</div>"+	///// Row end
                    "<div class='form-row'>"+

                    /*"<div class='form-wrapper'>"+
                    "<label for=''>Net Payable</label>"+
                    // "<input type='text' class='form-control'  fdprocessedid='cbnn8' value="+NetPayM+" readonly>"+
                    "</div>"+*/

                    /*"<div class='form-wrapper'>"+
                    "<label for=''>Net Payable with Tax</label>"+
                    // "<input type='text' class='form-control' id='custpage_net_pay_with_tax_"+m+"' name='custpage_net_pay_with_tax_"+m+"'  fdprocessedid='cbnn8' value="+NetPaywithTax+" readonly>"+
                    "</div>"+*/

                    /*"<div class='form-wrapper'>"+
                    "<label for=''>Pay off Charges</label>"+
                    // "<input type='text' id='custpage_lease_payoff_charg_"+m+"' id='custpage_lease_payoff_charg_"+m+"' class='form-control'  fdprocessedid='cbnn8' value=0 readonly>"+
                    "</div>"+*/

                    /*	"<div class='form-wrapper'>"+
                        "<label for=''>Payoff charges With tax</label>"+
                        // "<input type='text' id='custpage_lease_payoff_w_tx_"+m+"' name='custpage_lease_payoff_w_tx_"+m+"' class='form-control'  fdprocessedid='cbnn8' value=0 readonly>"+
                        "</div>"+*/

                    /*"<div class='form-wrapper'>"+
                    "<label for=''>Pay off with Tax</label>"+
                    // "<input type='text' id='custpage_lease_payoff_"+m+"' name='custpage_lease_payoff_"+m+"' class='form-control'  fdprocessedid='cbnn8' value="+PurPayable+" readonly>"+
                    "</div>"+*/



                    /*"<div class='form-wrapper hidediv'>"+
                    "<label for=''>Rent Bal.</label>"+
                    // "<input type='text' class='form-control'  fdprocessedid='cbnn8' value="+RemainAmount+" readonly>"+
                    "</div>"+*/


                    /*"<div class='form-wrapper hidediv'>"+
                    "<label for=''>Margin</label>"+
                    "<input type='text' class='form-control' id='custpage_st_vin_markup_"+m+"' name='custpage_st_vin_markup_"+m+"' onchange='onMarkupChange("+m+");' fdprocessedid='cbnn8' value='0'>"+
                    "</div>"+*/

                    /*"<div class='form-wrapper hidediv'>"+
                    "<label for=''>Sell @</label>"+
                    // "<input type='text' class='form-control' id='custpage_st_vin_selling_"+m+"' name='custpage_st_vin_selling_"+m+"'  fdprocessedid='cbnn8' value="+NetPayM+">"+
                    "</div>"+*/

                    "</div>"+		////Row End

                    "<div class='form-row'>"+

                    "<div class='form-wrapper1'>"+
                    "<label for=''></label>"+
                    "<input type='button' class='form-addbutton' value='Add' " +
                    "onClick='doAdding("+m+");'>" +
                    //					"onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '/SuiteScripts/Advectus 2.0/advs_csaa_stock_buyout_screen';var entryPointRequire = require.config(rConfig);entryPointRequire(['/SuiteScripts/Advectus 2.0/advs_csaa_stock_buyout_screen'], function (mod) {if (!!window) {}mod.doAdding("+m+");}); return false;\">"+
                    //					">"+
                    "</div>"+

                    "<div class='form-wrapper'>"+
                    "<label for=''>Select Item</label>"+

                    "<select id='item_list_"+m+"' name='item_list_"+m+"' class='form-control' onchange='onItemSelect("+m+");'>"+
                    "<option value=''></option>";

                for(var k=0;k<ItemsData.length;k++){
                    if(ItemsData[k] != null && ItemsData[k] != undefined){
                        var ItemID		=	ItemsData[k].id;
                        var ItemName	=	ItemsData[k].name;
                        var ItemDesc	=	ItemsData[k].desc;
                        var BaseP		=	ItemsData[k].baseP;
                        if(!ItemDesc){ItemDesc="";}

                        html_data+="<option value='"+ItemID+"' desc='"+ItemDesc+"' baseP='"+BaseP+"'>"+ItemName+"</option>"

                    }
                }
                // "<option value='volvo'>Volvo</option>"+
                // "<option value='saab'>Saab</option>"+
                // "<option value='opel'>Opel</option>"+
                // "<option value='audi'>Audi</option>"+


                html_data+="</select>" +

                    "</div>"+

                    "<div class='form-wrapper'>"+
                    "<label for=''>Description</label>"+
                    "<input type='text' class='form-control' id='item_desc_"+m+"' name='item_desc_"+m+"'  fdprocessedid='cbnn8'>"+
                    "</div>"+


                    "<div class='form-wrapper'>"+
                    "<label for=''>Rate</label>"+
                    "<input type='currency' class='form-control' id='item_rate_"+m+"' name='item_rate_"+m+"'  fdprocessedid='cbnn8'>"+
                    "</div>"+




                    "</div>"+		////Row End


                    "<div class='form-row'>"+
                    "<ul id='selecteddata_"+m+"' name='selecteddata_"+m+"' class='ul_class'>" +
                    "" +

                    "</ul>" +
                    "<input type='hidden' id='custpage_total_ul_"+m+"' name='custpage_total_ul_"+m+"' value=0 >"+
                    "</div>";

                /*html_data+="<div class='_2sr-o'>" +
                "<div class='I6yQz'></div>" ;
                html_data+="<div class='_1ir1J'><label class='switch'>  " +
                "<input type='checkbox' id='checkbox_id_sha_"+m+"' name='checkbox_id_sha_"+m+"' onclick='MarkCheckPackage("+m+")' />" +
                "" +
                "<span class='slider round'></span></label>" +
                "<input type='hidden' id='custpage_selected_package"+m+"' name='custpage_selected_package"+m+"' value='0'/> " +
                // "<input type='hidden' id='stock_line_id_"+m+"' name='stock_line_id_"+m+"' value='"+REntChID+"'/>"+
                // "<input type='hidden' id='custpage_selected_vin_"+m+"' name='custpage_selected_vin_"+m+"' value='"+vinID+"'/>"+
                // "<input type='hidden' id='custpage_vin_fa"+m+"' name='custpage_vin_fa"+m+"' value='"+FACard+"'/>"+
                // "<input type='hidden' id='custpage_tax_rate"+m+"' name='custpage_tax_rate"+m+"' value='"+FinalTax+"'/>"+

                // "<input type='hidden' id='custpage_vin_fa_ass_acc"+m+"' name='custpage_vin_fa_ass_acc"+m+"' value='"+FaLeaseAcc+"'/>"+
                // "<input type='hidden' id='custpage_vin_fa_de_ass_acc"+m+"' name='custpage_vin_fa_de_ass_acc"+m+"' value='"+FaLeaseDepAcc+"'/>"+



//					obj.FaLeaseAcc		=	FaLeaseAcc;
//					obj.FaLeaseDepAcc	=	FaLeaseDepAcc;
                /!*"<input type='hidden' id='custpage_selected_package_time"+j+"' name='custpage_selected_package_time"+j+"' value='"+PackTime+"'/>"+
                        "<input type='hidden' id='custpage_selected_package_name"+j+"' name='custpage_selected_package_name"+j+"' value='"+packageName+"'/>"+
                        "<input type='hidden' id='custpage_selected_package_desc"+j+"' name='custpage_selected_package_desc"+j+"' value='"+PackDescrip+"'/>"+
                        "<input type='hidden' id='package_package_id_"+j+"' name='package_package_id_"+j+"' value='"+PacId+"'/>"+

                        "<input type='hidden' id='package_sysid_"+j+"' name='package_sysid_"+j+"' value='"+Syscode+"'/>"+
                        "<input type='hidden' id='package_assem_id_"+j+"' name='package_assem_id_"+j+"' value='"+Asscode+"'/>"+
                        "<input type='hidden' id='package_comp_id_"+j+"' name='package_comp_id_"+j+"' value='"+compc+"'/>"+
                 *!/"</div>" ;*/

                html_data+="</div>";
                html_data+="</div>";
                html_data+="</div>";
                allLines++;
// 				}
// 			}

                // totalLineObj.defaultValue=allLines;

//			html_data+="</div>";
                html_data+="</div>";

                html_data+="</head>";
                html_data+="</html>";


//			html_data+=StyleCSS();
                htmlfld.defaultValue = html_data;

                /*

                var AssetFldObj	=	form.addField({
                    id:"custpage_assetfld",
                    type:serverWidget.FieldType.CURRENCY,
                    label:"Asset Value"
                });
                var depreFldObj	=	form.addField({
                    id:"custpage_depre_fld",
                    type:serverWidget.FieldType.CURRENCY,
                    label:"Depreciation Value"
                });
                var bookFldObj	=	form.addField({
                    id:"custpage_book_value",
                    type:serverWidget.FieldType.CURRENCY,
                    label:"Current Book Value"
                });

                var depositFldObj	=	form.addField({
                    id:"custpage_deposit",
                    type:serverWidget.FieldType.CURRENCY,
                    label:"Deposit"
                });

                var payableFldObj	=	form.addField({
                    id:"custpage_payable",
                    type:serverWidget.FieldType.CURRENCY,
                    label:"Rental Vehicle Purchase Payable"
                });

                var payableOpenFldObj	=	form.addField({
                    id:"custpage_open_payable",
                    type:serverWidget.FieldType.CURRENCY,
                    label:"Rental Vehicle Purchase Payable"
                });

                var netPayFldObj	=	form.addField({
                    id:"custpage_net_payable",
                    type:serverWidget.FieldType.CURRENCY,
                    label:"Net Payable"
                });



                var StockInfo		=	getStockDetails(dealID);
                var RemainAmount	=	getOpeninvoiceAmount(dealID);
                RemainAmount	=	RemainAmount*1;
                RemainAmount	=	RemainAmount*1;

                log.debug("StockInfo",StockInfo);
                if(StockInfo[0] != null && StockInfo[0] != undefined){
                    var vinID			=	StockInfo[0].vinId;
                    var AssetValue		=	StockInfo[0].AssetValue;
                    var CurrentBkVal	=	StockInfo[0].CurrentBkVal;
                    var TotDepAmount	=	StockInfo[0].TotDepAmount;
                    var deposit			=	StockInfo[0].deposit;

                    deposit			=	deposit*1;
                    CurrentBkVal	=	CurrentBkVal*1;


                    AssetFldObj.defaultValue=AssetValue;
                    depreFldObj.defaultValue=TotDepAmount;
                    bookFldObj.defaultValue=CurrentBkVal;


                    depositFldObj.defaultValue=deposit;

                    var PurPayable	=	(CurrentBkVal-deposit);
                    PurPayable	=	PurPayable*1;

                    payableFldObj.defaultValue=PurPayable;
                    payableOpenFldObj.defaultValue=RemainAmount;


                    var NetPayM	=	(PurPayable+RemainAmount);
                    netPayFldObj.defaultValue=NetPayM;


                }
                 */
                form.addSubmitButton({
                    label:"Submit"
                })
                response.writePage(form);
            }else{
                var contId		=	request.parameters.custpage_con_head;

                var setupData   = lib_rental.invoiceTypeSearch();

                var netAmount		=	request.parameters.custpage_netamount;
                var addonsAmount	=	request.parameters.custpage_addons;
                var netPayable		=	request.parameters.custpage_buyout_offer;

                var AdditionalItems	=	[];

                var i	=	0;
                var AttionalLines	=	request.parameters['custpage_total_ul_'+i+''];
                log.debug("AttionalLines",AttionalLines);
                var status	=	contId;
                if(AttionalLines>0){
                    for(var m=0;m<AttionalLines;m++){
                        var itemID		=	request.parameters["custpage_item_sel_id_"+i+"_"+m+""];
                        var itemDesc	=	request.parameters["custpage_item_sel_desc"+i+"_"+m+""];
                        var Rate		=	request.parameters["custpage_item_sel_rate"+i+"_"+m+""];
                        log.debug("itemIDLoop",itemID+"=>"+itemDesc+"=>"+i+"=>"+m);
                        if(CheckAnd(itemID)){
                            var index	=	0;
                            if(AdditionalItems[status] != null && AdditionalItems[status] != undefined){
                                index	=	AdditionalItems[status].length;
                            }else{
                                AdditionalItems[status]	=	new Array();
                            }
                            AdditionalItems[status][index]	=	new Array();
                            AdditionalItems[status][index]["itemID"]	=	itemID;
                            AdditionalItems[status][index]["itemDesc"]	=	itemDesc;
                            AdditionalItems[status][index]["Rate"]	=	Rate;
                        }


                    }
                }

                var invoiceGlbl    =   "";
                try{

                    var script = runtime.getCurrentScript();
                    var OtherItems = script.getParameter('custscript_advs_r_buy_item');


                    var today   =   new Date();

                    var headerFld	=	new Array();
                    headerFld.push("custrecord_advs_l_h_customer_name");
                    headerFld.push("custrecord_advs_l_h_location");
                    headerFld.push("custrecord_advs_l_h_subsidiary");
                    headerFld.push("custrecord_advs_la_vin_bodyfld");
                    headerFld.push("custrecord_advs_l_a_loan_amount");
                    headerFld.push("custrecord_advs_lease_su_model");

                    var headerREc	=	search.lookupFields({type:"customrecord_advs_lease_header", id:contId, columns:headerFld});
                    var customer	=	""; var Location	=	""; var subsiID	="";
                    var vinID	=	"";var loanAmount   =   0;var VinModel  =   "";
                    if(headerREc["custrecord_advs_l_h_customer_name"] != null && headerREc["custrecord_advs_l_h_customer_name"] != undefined){
                        customer	= headerREc["custrecord_advs_l_h_customer_name"][0].value;
                    }
                    if(headerREc["custrecord_advs_l_h_subsidiary"] != null && headerREc["custrecord_advs_l_h_subsidiary"] != undefined){
                        subsiID	= headerREc["custrecord_advs_l_h_subsidiary"][0].value;
                    }
                    if(headerREc["custrecord_advs_l_h_location"] != null && headerREc["custrecord_advs_l_h_location"] != undefined){
                        Location	= headerREc["custrecord_advs_l_h_location"][0].value;
                    }
                    if(headerREc["custrecord_advs_la_vin_bodyfld"] != null && headerREc["custrecord_advs_la_vin_bodyfld"] != undefined){
                        vinID	= headerREc["custrecord_advs_la_vin_bodyfld"][0].value;
                    }
                    if(headerREc["custrecord_advs_l_a_loan_amount"] != null && headerREc["custrecord_advs_l_a_loan_amount"] != undefined){
                        loanAmount	= headerREc["custrecord_advs_l_a_loan_amount"];
                    }
                    if(headerREc["custrecord_advs_lease_su_model"] != null && headerREc["custrecord_advs_lease_su_model"] != undefined){
                        VinModel	= headerREc["custrecord_advs_lease_su_model"][0].value;
                    }


                    // log.debug("setupData[libUtil.rentalinvoiceType.lease_buyout][id]",setupData[libUtil.rentalinvoiceType.lease_buyout]["id"]);
                    // log.debug("setupData[libUtil.rentalinvoiceType.lease_buyout][buyout]",setupData[libUtil.rentalinvoiceType.lease_buyout]["buyout"]);
                  
                    var invRec	=	record.create({type:"invoice", isDynamic:true});
                    invRec.setText({fieldId:"customform",text:"ADVS Lease Invoice"});
                    invRec.setValue({fieldId:"entity",value:customer});
                    invRec.setValue({fieldId:"subsidiary",value:subsiID});
                    invRec.setValue({fieldId:"location",value:Location});
                    invRec.setValue({fieldId:"custbody_advs_lease_head",value:contId});
                    invRec.setValue({fieldId:"custbody_advs_invoice_type",value: setupData[libUtil.rentalinvoiceType.lease_return]["id"]});

                    // log.debug("BUY",libUtil.rentalinvoiceType.lease_return);
                    // log.debug("BUYITEM",setupData[libUtil.rentalinvoiceType.lease_return]["buyout"]);
                  log.debug("netPayable",netPayable);
                    if(netPayable>0){
                        invRec.selectNewLine({
                            sublistId: "item"
                        });
                        invRec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "item",
                            value:setupData[libUtil.rentalinvoiceType.lease_return]["regularitem"]
                        });
                        invRec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "quantity",
                            value: 1
                        });
                        invRec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "rate",
                            value: netPayable
                        });
                        invRec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "amount",
                            value: netPayable
                        });

                        invRec.commitLine({
                            sublistId: 'item'
                        });
                    }
                     log.debug("contId",contId);
                    var stockID	=	contId;
                    if(AdditionalItems[stockID] != null && AdditionalItems[stockID] != undefined){
                        var AdditionalLength	=	AdditionalItems[stockID].length;
                        log.debug("AdditionalLength",AdditionalLength);
                        for(var j=0;j<AdditionalLength;j++){
                            var ItemID		=	AdditionalItems[stockID][j]["itemID"];
                            var itemDesc	=	AdditionalItems[stockID][j]["itemDesc"];
                            var ItemRt		=	AdditionalItems[stockID][j]["Rate"];
                            ItemRt	=	ItemRt*1;
                            log.debug("ItemID",ItemID);
                            log.debug("itemDesc",itemDesc);
                            log.debug("ItemRt",ItemRt);
                            invRec.selectNewLine({
                                sublistId: "item"
                            });
                            invRec.setCurrentSublistValue({
                                sublistId: "item",
                                fieldId: "item",
                                value: ItemID
                            });
                            invRec.setCurrentSublistValue({
                                sublistId: "item",
                                fieldId: "memo",
                                value: itemDesc
                            });
                            invRec.setCurrentSublistValue({
                                sublistId: "item",
                                fieldId: "quantity",
                                value: 1
                            });
                            invRec.setCurrentSublistValue({
                                sublistId: "item",
                                fieldId: "rate",
                                value: ItemRt
                            });
                            invRec.setCurrentSublistValue({
                                sublistId: "item",
                                fieldId: "amount",
                                value: ItemRt
                            });

                            invRec.commitLine({
                                sublistId: 'item'
                            });

                        }
                    }


                    var RetInvoice	=   invRec.save({ignoreMandatoryFields:true,enableSourcing:true});
                      log.debug("RetInvoice",RetInvoice);
                    invoiceGlbl =   RetInvoice;
                    log.debug("RetInvoice",subsiID+Location+VinModel+contId+setupData);
                    var InvAdjAcc   =   postInvAdj(record,subsiID,Location,loanAmount,today,"",VinModel,format,contId,setupData);
                        log.debug("InvAdjAcc",InvAdjAcc);
                    // var JRID	=	postJournal(record,JournalPostData,InvoiceID,Location,FAMARR,format);

                    record.submitFields({
                        type:"customrecord_advs_vm",
                        id:vinID,
                        values:{
                            "custrecord_advs_vm_reservation_status":libUtil.vmstatus.available,
                            "custrecord_advs_vm_rental_header":"",
                            "custrecord_advs_vm_rent_child":"",
                            "custrecord_advs_vm_subsidary":subsiID,
                            "custrecord_advs_vm_location_code":Location,
                        }
                    })

                    var recmach	=	"recmachcustrecord_advs_lea_header_link";

                    var recmach_inv	=	"recmachcustrecord_advs_lea_header_link";

                    var headerrec	=	record.load({type:"customrecord_advs_lease_header", id:contId});

                    headerrec.setValue({fieldId:"custrecord_advs_l_h_status",value:libUtil.leaseStatus.return});

                    headerrec.setValue({fieldId:"custrecord_advs_l_h_return_invoice",value:RetInvoice});
                    headerrec.setValue({fieldId:"custrecord_advs_f_a_inv_adj",value:InvAdjAcc});



                    var linesCount = headerrec.getLineCount({sublistId:recmach});
                    for(var mi=0;mi<linesCount;mi++){
                        var LineID	=	headerrec.getSublistValue({sublistId:"recmachcustrecord_advs_lea_header_link", fieldId:"id", line:mi});


                        headerrec.setSublistValue({sublistId: recmach,fieldId: 'custrecord_advs_lea_stock_status',value: 10,line:mi});
                        // headerrec.setSublistValue({sublistId: recmach,fieldId: 'custrecord_advs_r_h_return_invoices',value: RetInvoice,line:mi});



                    }
                    headerrec.save({ignoreMandatoryFields: true,enableSourcing: true});



                    var onclickScript=" <html><body> <script type='text/javascript'>" +
                        "try{" +
                        "";

                    onclickScript+="window.parent.location.reload();";
                    onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";

                    response.write(onclickScript);
                    // redirect.toRecord({type: "customrecord_advs_lease_header", id: contId});
                }catch(e){

                    log.error("e",e.message);

                    if(invoiceGlbl){
                        record.delete({type:"invoice",id:invoiceGlbl});
                    }
                    var errorObj = error.create({
                        code: e,
                        message: e.message
                    });

                    throw errorObj.code + '\n\n' + errorObj.message;
                    return false;
                }

                /*log.debug("selectStock",selectStock);

                for(var k=0;k<selectStock.length;k++){
                    var stockID	=	selectStock[k];

                    if(AdditionalItems[stockID] != null && AdditionalItems[stockID] != undefined){
                        var AdditionalLength	=	AdditionalItems[stockID].length;
                        log.debug("AdditionalLength",AdditionalLength);
                        for(var j=0;j<AdditionalLength;j++){
                            var ItemID		=	AdditionalItems[stockID][j]["itemID"];
                            var itemDesc	=	AdditionalItems[stockID][j]["itemDesc"];
                            var ItemRt		=	AdditionalItems[stockID][j]["Rate"];


                        }
                    }
                }*/


            }
        }

        function postInvAdj(record,subsi,LocID,newValue,trandate,Memo,ModelID,format,contId,setupData){

            var headerFld	=	new Array();
            headerFld.push("custrecord_advs_l_h_customer_name");
            headerFld.push("custrecord_advs_l_h_location");
            headerFld.push("custrecord_advs_l_h_subsidiary");
            headerFld.push("custrecord_advs_la_vin_bodyfld");
            headerFld.push("custrecord_advs_l_a_loan_amount");
            headerFld.push("custrecord_advs_lease_su_model");




            var headerREc	=	search.lookupFields({type:"customrecord_advs_lease_header", id:contId, columns:headerFld});
            var vinName	=	"";

            if(headerREc["custrecord_advs_la_vin_bodyfld"] != null && headerREc["custrecord_advs_la_vin_bodyfld"] != undefined){
                vinName	= headerREc["custrecord_advs_la_vin_bodyfld"][0].value;
            }

            var DateC   =   trandate;
            var invRec  =   record.create({
                type:"inventoryadjustment",
                isDynamic: true,
            });
            invRec.setValue({fieldId:"subsidiary",value:subsi});
            invRec.setValue({fieldId:"account",value:setupData[libUtil.rentalinvoiceType.lease_return]["returnadjAcc"]} );  //  returnadjAcc
            invRec.setValue({fieldId:"trandate",value:DateC});
            invRec.setValue({fieldId:"adjlocation",value:LocID});
            invRec.setValue({fieldId:"memo",value:Memo});
//             invRec.setValue({fieldId:"custbody_advs_truck_vin_header_trans",value:vinID});

            invRec.selectNewLine({
                sublistId:"inventory"
            });
            invRec.setCurrentSublistValue({
                sublistId:"inventory",
                fieldId:"item",
                value:ModelID
            });
            invRec.setCurrentSublistValue({
                sublistId:"inventory",
                fieldId:"adjustqtyby",
                value:"1"
            });
            invRec.setCurrentSublistValue({
                sublistId:"inventory",
                fieldId:"location",
                value:LocID
            });

            invRec.setCurrentSublistValue({
                sublistId:"inventory",
                fieldId:"unitcost",
                value:newValue
            });

            /* invRec.setCurrentSublistValue({
                 sublistId:"inventory",
                 fieldId:"custcol_advs_vehicle_type",
                 value:NewStatus
             });*/

            var invDetail = invRec.getCurrentSublistSubrecord({
                 sublistId: 'inventory',
                 fieldId: 'inventorydetail'
             });
             invDetail.selectNewLine({
                 sublistId: 'inventoryassignment'
             });
             invDetail.setCurrentSublistValue({
                 sublistId: 'inventoryassignment',
                 fieldId: 'receiptinventorynumber',
                 value: vinName
             });
             invDetail.commitLine({
                 sublistId: 'inventoryassignment'
             });


            invRec.commitLine({
                sublistId: 'inventory'
            });

            var recordId2 = invRec.save({
                enableSourcing:true,
                ignoreMandatoryFields:true
            });

            return recordId2;
        }

        function postJournal(record,JournalPostData,InvoiceID,Location,FAMARR,format){

            var Today	=	new Date();

            var formattedDateString = format.format({
                value:Today,
                type: format.Type.DATE
            });


            var DefVal	=	"186.53";
            DefVal	=	DefVal*1;
            var j_record =		record.create({
                type:"journalentry",
                isDynamic:true
            });

//		j_record.setValue({fieldId:"trandate",value:journalDate});
            j_record.setValue({fieldId:"subsidiary",value:3});
            j_record.setValue({fieldId:"custbody_advs_created_from",value:InvoiceID});

            for(var m=0;m<JournalPostData.length;m++){

                /*JourObj.AssetV		=	AssetV;
                JourObj.depRec		=	depRec;
                JourObj.BookValue	=	BookValue;
                JourObj.FAAsset	=	FAAsset;*/

                if(JournalPostData[m] != null && JournalPostData[m] != undefined){
                    var AssetV			=	JournalPostData[m].AssetV;
                    var depRec			=	JournalPostData[m].depRec;
                    var BookValue		=	JournalPostData[m].BookValue;
                    var FAAsset			=	JournalPostData[m].FAAsset;
                    var FaLeaseAcc		=	JournalPostData[m].FaLeaseAcc;
                    var FaLeaseDepAcc	=	JournalPostData[m].FaLeaseDepAcc;

                    BookValue	=	BookValue*1;




                    var LastAmount	=	(BookValue-DefVal)





                    CreateLine(j_record,FaLeaseAcc,0,BookValue,"","",Location,FAAsset);
                    CreateLine(j_record,FaLeaseDepAcc,DefVal,0,"","",Location,FAAsset);

                    CreateLine(j_record,507,LastAmount,0,"","",Location,FAAsset);
//				CreateLine(j_record,FaLeaseAcc,0,BookValue,"","",Location);

//				CreateLine(j_record,ConsumAcc,0,CreditAmount,S_DeptID,entity,S_LocID);
                }


            }

            var JrIds    =    j_record.save({
                ignoreMandatoryFields:true,
                enableSourcing:true
            });

            for(var k=0;k<FAMARR.length;k++){
                var FAMID	=	FAMARR[k];

                if(FAMID){
                    record.submitFields({
                        type:"customrecord_advs_lm_fixed_asset_master",
                        id:FAMID,
                        values:{
                            "custrecord_advs_f_am_sale_invoice":InvoiceID,
                            "custrecord_advs_lm_fa_is_closed":true,
                            "custrecord_advs_lm_fa_last_dep_date":formattedDateString,
                            "custrecord_advs_lm_fa_depre_amount":DefVal,

                        }
                    })
                }

            }

            return JrIds;
        }
        function CreateLine(j_record,AccountId,debit,credit,department,entity,LocID,FAAsset){

            debit	=	debit*1;
            credit	=	credit*1;

            log.debug("debit",debit+"=>"+credit+"=>"+AccountId+"=>"+department+"=>"+entity+"=>"+LocID);
            j_record.selectNewLine({
                sublistId: 'line'
            });
            j_record.setCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'account',
                value: AccountId
            });
            if(credit>0){
                j_record.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'credit',
                    value: credit
                });
            }else if(debit>0){
                j_record.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'debit',
                    value: debit
                });
            }
            if(department){
                j_record.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'department',
                    value: department
                });
            }

            if(entity != null && entity != undefined && entity != ""){
                j_record.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'entity',
                    value: entity
                });
            }
            if(LocID){
                j_record.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'location',
                    value: LocID
                });
            }

            if(FAAsset){
                j_record.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'custcol_advs_fa_no',
                    value: FAAsset
                });
            }

            j_record.commitLine({
                sublistId: 'line'
            });
        }

        function getStockDetails(dealID){
            var StockInfoArr	=	new Array();

            var customrecord_advs_lm_lease_cardSearchObj = search.create({
                type: "customrecord_advs_lea_rental_child",
                filters:
                    [
                        ["custrecord_advs_lea_header_link","anyof",dealID]
                        ,"AND",
                        ["custrecord_advs_lea_vin_stk_stock","anyof",8]
                        ,"AND",
                        ["custrecord_advs_lea_vin_stk_stock","noneof","@NONE@"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        // 			  search.createColumn({name: "custrecord_advs_lea_vin_stk_stock", label: "VIN"}),
                        // 			//   search.createColumn({name: "custrecord_advs_deposit_amount",join:"custrecord_advs_r_h_header_link", label: "Lease Security Deposit"}),
                        //   search.createColumn({name: "custrecord_advs_lc_c_fa_card_link", label: "FA Card Link"}),
                        //   search.createColumn({
                        // 	  name: "custrecord_advs_lm_fa_asset_value",
                        // 	  join: "custrecord_advs_lc_c_fa_card_link",
                        // 	  label: "Asset Value"
                        //   }),
                        //   search.createColumn({
                        // 	  name: "custrecord_advs_lm_fa_depre_amount",
                        // 	  join: "custrecord_advs_lc_c_fa_card_link",
                        // 	  label: "Total Depreciation Amount"
                        //   }),
                        //   search.createColumn({
                        // 	  name: "custrecord_advs_lm_fa_asset_value_curren",
                        // 	  join: "custrecord_advs_lc_c_fa_card_link",
                        // 	  label: "Current Book Value"
                        //   }),
                        //   search.createColumn({
                        // 	  name: "custrecord_advs_lm_fa_lease_account",
                        // 	  join: "custrecord_advs_lc_c_fa_card_link",
                        // 	  label: "Current Book Value"
                        //   }),
                        //   search.createColumn({
                        // 	  name: "custrecord_advs_lm_fa_accu_depre_account",
                        // 	  join: "custrecord_advs_lc_c_fa_card_link",
                        // 	  label: "Current Book Value"
                        //   }),
                        //   search.createColumn({name: "custrecord_advs_r_a_loan_amount",join:"custrecord_advs_r_h_header_link", label: "Lease Security Deposit"}),
                        //   search.createColumn({name: "custrecord_advs_r_a_sch_residual_amt",join:"custrecord_advs_r_h_header_link", label: "Lease Security Deposit"}),
                        //   search.createColumn({name: "custrecord_advs_r_a_down_payment",join:"custrecord_advs_r_h_header_link", label: "Down Payment"}),


                    ]
            });
            // var searchResultCount = customrecord_advs_lm_lease_cardSearchObj.runPaged().count;

            // customrecord_advs_lm_lease_cardSearchObj.run().each(function(result){
            // 	var vinId		=	result.getValue({name: "custrecord_advs_lea_vin_stk_stock", label: "VIN"});
            // 	var vinName		=	result.getText({name: "custrecord_advs_lea_vin_stk_stock", label: "VIN"});
            // 	var Rentch		=	result.getValue({
            // 		name: "internalid",
            // 		sort: search.Sort.ASC,
            // 		label: "Name"
            // 	});
            // 	// var AssetValue	=	result.getValue({
            // 	name: "custrecord_advs_lm_fa_asset_value",
            // 	join: "custrecord_advs_lc_c_fa_card_link",
            // 	label: "Asset Value"
            // })*1;
            // var CurrentBkVal	=	result.getValue({
            // 	name: "custrecord_advs_lm_fa_asset_value_curren",
            // 	join: "custrecord_advs_lc_c_fa_card_link",
            // 	label: "Current Book Value"
            // })*1;
            // var TotDepAmount	=	result.getValue({
            // 	name: "custrecord_advs_lm_fa_depre_amount",
            // 	join: "custrecord_advs_lc_c_fa_card_link",
            // 	label: "Total Depreciation Amount"
            // })*1;

            // var FaLeaseAcc	=	result.getValue({
            // 	name: "custrecord_advs_lm_fa_lease_account",
            // 	join: "custrecord_advs_lc_c_fa_card_link",
            // 	label: "Total Depreciation Amount"
            // });

            // var FaLeaseDepAcc	=	result.getValue({
            // 	name: "custrecord_advs_lm_fa_accu_depre_account",
            // 	join: "custrecord_advs_lc_c_fa_card_link",
            // 	label: "Total Depreciation Amount"
            // });

            // var FACard		=	result.getValue({
            // 	name: "custrecord_advs_lc_c_fa_card_link",

            // 	label: "FA Card"
            // });

            // var loanAmount		=	result.getValue({name: "custrecord_advs_r_a_loan_amount",join:"custrecord_advs_r_h_header_link", label: "Loan amount"})*1;
            // var depositAmnt		=	result.getValue({name: "custrecord_advs_deposit_amount",join:"custrecord_advs_r_h_header_link", label: "Lease Security Deposit"});
            // var reidualamnt		=	result.getValue({name: "custrecord_advs_r_a_sch_residual_amt",join:"custrecord_advs_r_h_header_link", label: "Loan amount"})*1;
            // var downPay			=	result.getValue({name: "custrecord_advs_r_a_down_payment",join:"custrecord_advs_r_h_header_link", label: "Loan amount"})*1;

            // var taxCode			=	result.getValue({name: "custrecord_advs_r_h_tax_code",join:"custrecord_advs_r_h_header_link", label: "Loan amount"})*1;


            // var finalBookVal	=	(AssetValue-TotDepAmount);

            // var obj	=	{}
            // obj.vinId			=	vinId;
            // obj.AssetValue		=	AssetValue;
            // obj.CurrentBkVal	=	finalBookVal;
            // obj.TotDepAmount	=	TotDepAmount;
            // obj.deposit			=	depositAmnt;
            // obj.vinName			=	vinName;
            // obj.vinName			=	vinName;
            // obj.id				=	Rentch;
            // obj.FACard			=	FACard;
            // obj.FaLeaseAcc		=	FaLeaseAcc;
            // obj.FaLeaseDepAcc	=	FaLeaseDepAcc;

            // obj.loanAmount		=	loanAmount;
            // obj.residual		=	reidualamnt;
            // obj.downpay			=	downPay;
            // obj.taxcode			=	taxCode;





            // 	StockInfoArr.push(obj);
            // 	return true;
            // });

            return StockInfoArr;
        }

        function getVinDetails(dealID,vinFldObj){
            vinFldObj.addSelectOption({
                value : '',
                text : ''
            });

            var customrecord_advs_lm_lease_cardSearchObj = search.create({
                type: "customrecord_advs_lea_rental_child",
                filters:
                    [
                        ["custrecord_advs_lea_header_link","anyof",dealID]
                        ,"AND",
                        ["custrecord_advs_lea_stock_status","noneof",5]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_advs_lea_vin_stk_stock",
                            sort: search.Sort.ASC
                        }),



                    ]
            });
            var searchResultCount = customrecord_advs_lm_lease_cardSearchObj.runPaged().count;

            customrecord_advs_lm_lease_cardSearchObj.run().each(function(result){
                var vinId		=	result.getValue({name: "custrecord_advs_lea_vin_stk_stock", label: "VIN"});
                var vinName		=	result.getText({name: "custrecord_advs_lea_vin_stk_stock", label: "VIN"});



                vinFldObj.addSelectOption({
                    value : vinId,
                    text : vinName
                });

                return true;
            });


        }

        function getPendingPay(dealID){
            var PendingAmount	=	0;
            var pendingSearch = search.create({
                type: "customrecord_advs_lm_lease_card_child",
                filters:
                    [
                        ["custrecord_advs_lm_lc_c_link","anyof",dealID],
                        "AND",
                        ["custrecord_advs_r_p_invoice","anyof","@NONE@"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_advs_lm_lc_c_down_paying",
                            summary: "SUM",
                            label: "Total Amount"
                        })
                    ]
            });
            pendingSearch.run().each(function(result){
                PendingAmount+=result.getValue({
                    name: "custrecord_advs_lm_lc_c_down_paying",
                    summary: "SUM",
                    label: "Total Amount"


                })*1;
                return true;
            });

            return PendingAmount;
        }

        function getOpeninvoiceAmount(dealID){
            var VinWiseRemaining	=	new Array();
            var invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                    ["type","anyof","CustInvc"],
//				 "AND",
//				 ["status","anyof","CustInvc:A","CustInvc:D"],
                    "AND",
                    ["custbody_advs_lease_head","anyof",dealID]
                    ,"AND",
                    ["mainline","is","F"]
                    ,"AND",
                    ["taxline","is","F"]
                ],
                columns:
                    [
                        search.createColumn({
                            name: "amountremaining",
                            summary: "SUM",
                            label: "Amount Remaining"
                        }),
                        search.createColumn({
                            name: "amount",
                            summary: "SUM",
                            label: "Amount"
                        }),

                        search.createColumn({
                            name: "custbody_advs_lease_head",
                            summary: "GROUP",
                            label: "RENT CH"
                        })


                    ]
            });
            var searchResultCount = invoiceSearchObj.runPaged().count;

            invoiceSearchObj.run().each(function(result){
                var Rentalchild	=	result.getValue({
                    name: "custbody_advs_lease_head",
                    summary: "GROUP",
                    label: "RENT CH"
                });

                var AmountRem	=	result.getValue({

                    name: "amount",
                    summary: "SUM",
                    label: "Amount Remaining"

                });
                AmountRem	=	AmountRem*1;

                if(VinWiseRemaining[Rentalchild] != null && VinWiseRemaining[Rentalchild] != undefined){

                }else{
                    VinWiseRemaining[Rentalchild] =	new Array();
                    VinWiseRemaining[Rentalchild]["Rem"] =	AmountRem;
                }

                return true;
            });

            return VinWiseRemaining;
        }

        function getOtherItemsL(){
            var ItemsArr	=	new Array();
            var itemSearchObj = search.create({
                type: "item",
                filters:
                    [
                        ["custitem_advs_inventory_type","anyof","11"],
                        "AND",
                        ["isinactive","is","F"]
                    ],
                columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal ID"}),
                        search.createColumn({name: "itemid", sort: search.Sort.ASC, label: "Name"}),
                        search.createColumn({name: "salesdescription", label: "Description"}),
                        search.createColumn({name: "baseprice", label: "Description"})
                    ]
            });
            var searchResultCount = itemSearchObj.runPaged().count;

            itemSearchObj.run().each(function(result){
                var ItemId	=	result.getValue({name: "internalid", label: "Internal ID"});
                var ItemName	=	result.getValue({name: "itemid", sort: search.Sort.ASC, label: "Name"});
                var ItemDesc	=	result.getValue({name: "salesdescription", label: "Description"});
                var basePrice	=	result.getValue({name: "baseprice", label: "Description"});
                if(!basePrice){basePrice=0;}

                var obj		=	{};
                obj.id		=	ItemId;
                obj.name		=	ItemName;
                obj.desc		=	ItemDesc;
                obj.baseP	=	basePrice;

                ItemsArr.push(obj);
                return true;
            });

            return ItemsArr;
        }

        function CheckAnd(String) {

            if(String == "" || String == " " || String == null || String == undefined || String == "null" || String == "undefined"){

                return false;

            }else{
                return true;
            }

        }

        return {
            onRequest: onRequest
        };

    });


function StyleCSS(){
    var style= "";
    style+="</style>" +
        ".main_css{" +
        "border:" +
        "}" +
        "</style>";

    return style;
}
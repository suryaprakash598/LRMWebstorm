/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/currentRecord','N/search'], function (currentRecord,search) {
	function pageInit(scriptContext) {
	}
    function markAllCheckboxes() {
        var rec = currentRecord.get();
        //var fieldIds = ['custpage_checkbox1', 'custpage_checkbox2', 'custpage_checkbox3', 'custpage_checkbox4'];
		var _fields = dynamicFields();
		var fieldIds = Object.keys(_fields[0]);
        fieldIds.forEach(fieldId => {
            rec.setValue({
                fieldId: fieldId,
                value: true // Mark checkbox
            });
        });
    }

    function unmarkAllCheckboxes() {
        var rec = currentRecord.get();
       // var fieldIds = ['custpage_checkbox1', 'custpage_checkbox2', 'custpage_checkbox3', 'custpage_checkbox4'];
var _fields = dynamicFields();
		var fieldIds = Object.keys(_fields[0]);
        fieldIds.forEach(fieldId => {
            rec.setValue({
                fieldId: fieldId,
                value: false // Unmark checkbox
            });
        });
    }
  function dynamicFields()
	{
		try{
			var arr=[];
			var obj={};
			var obj1={};
			var obj2={};
			var obj3={};
			var obj4={};
			var customrecord_filters_setupSearchObj = search.create({
		   type: "customrecord_filters_setup",
		   filters:
		   [
			  ["isinactive","is","F"], 
			  "AND", 
			  ["custrecord_field_display","is","T"]
		   ],
		   columns:
		   [
			  "custrecord_field_id",
			  "custrecord_field_label",
			  "custrecord_advs_filters_class"
		   ]
		});
		var searchResultCount = customrecord_filters_setupSearchObj.runPaged().count; 
		customrecord_filters_setupSearchObj.run().each(function(result){
		   // .run().each has a limit of 4,000 results
		   var fieldid = result.getValue({name:'custrecord_field_id'});
		   var fieldLabel = result.getValue({name:'custrecord_field_label'});
		   var fieldGroup = result.getText({name:'custrecord_advs_filters_class'});
		   if(fieldGroup=='Inventory'){
			   obj['custpage'+fieldid.toLowerCase()] = fieldLabel;
		   }
		   else if(fieldGroup=='Reposession'){
			   obj['custpage'+fieldid.toLowerCase()] = fieldLabel;
		   }
		   else if(fieldGroup=='Auction'){
			   obj['custpage'+fieldid.toLowerCase()] = fieldLabel;
		   }
		   else if(fieldGroup=='Delivery Board'){
			   obj['custpage'+fieldid.toLowerCase()] = fieldLabel;
		   }
		   else if(fieldGroup=='Transport'){
			   obj['custpage'+fieldid.toLowerCase()] = fieldLabel;
		   }
		   
		   return true;
		});
			arr.push(obj); 
		return arr;
		}catch(e)
		{
			log.debug('error',e.toString());
		}
	}
function fields()
	{
		var arr=[];
		var obj={};
		
		obj["custpage_vin_1"] = "VIN DROPDOWN";
		obj["custpage_vin_ff_2"] = "VIN TEXT";
		obj["custpage_model_3"] = "MODEL";
		obj["custpage_location_4"] = "LOCATION";
		obj["custpage_status_5"] = "STATUS";
		obj["custpage_salesrep_filter_6"] = "SALESREP";
		obj["custpage_softhold_status_7"] = "SOFTHOLD";
		obj["custpage_mileage_8"] = "MILEAGE";
		obj["custpage_bucket_9"] = "BUCKET";
		obj["custpage_bucket_child_10"] = "BUCKET CHILD";
		obj["custpage_freq_11"] = "FREQUENCY"; 
		obj["custpage_vin_repo_12"] = "VIN";
		obj["custpage_repostatus_13"] = "REPO STATUS";
		obj["custpage_location_repo_14"] = "LOCATION"; 
		obj["custpage_model_repo_15"] = "MODEL"; 
		obj["custpage_mileage_repo_16"] = "MILEAGE"; 
		obj["custpage_company_repo_17"] = "REPO COMPANY"; 
		obj["custpage_dateassigned_repo_18"] = "DATE ASSIGNED";  
		obj["custpage_vin_auction_19"] = "VIN"; 
		obj["custpage_status_auction_20"] = "STATUS"; 
		obj["custpage_location_auction_21"] = "LOCATION"; 
		obj["custpage_date_auction_22"] = "Auction Date"; 
		obj["custpage_condition_auction_23"] = "CONDITION"; 
		obj["custpage_cleaned_auction_24"] = "CLEANED";  
		obj["custpage_vin_db_25"] = "VIN"; 
		obj["custpage_customer_db_26"] = "CUSTOMER"; 
		obj["custpage_salesrep_db_27"] = "SALESREP"; 
		obj["custpage_truckready_db_28"] = "TRUCK READY"; 
		obj["custpage_washed_db_29"] = "WASHED"; 
		obj["custpage_mcoo_db_30"] = "MC/OO";  
		obj["custpage_claim_ins_31"] = "CLAIM"; 
		obj["custpage_stock_ins_32"] = "STOCK"; 
		obj["custpage_unitcondition_ins_33"] = "UNIT CONDITION"; 
		
		arr.push(obj); 
		return arr;
	}
    return {
        markAllCheckboxes: markAllCheckboxes,
        unmarkAllCheckboxes: unmarkAllCheckboxes,
		 pageInit: pageInit
    };
});

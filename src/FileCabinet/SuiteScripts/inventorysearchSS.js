/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search','N/runtime'],
    /**
     * @param{record} record
     * @param{search} search
     */
    (record, search,runtime) => {
    /**
     * Defines the Suitelet script trigger point.
     * @param {Object} scriptContext
     * @param {ServerRequest} scriptContext.request - Incoming request
     * @param {ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    const onRequest = (scriptContext) => {
        try {
            //GET PARAMETERS TO STORE AUTHORIZATION DETAILS
            var request = scriptContext.request;
            var response = scriptContext.response;
            var flag = request.parameters.flag;
			var currScriptObj = runtime.getCurrentScript();
        var UserObj = runtime.getCurrentUser();
        var UserSubsidiary = UserObj.subsidiary;
        var UserLocation = UserObj.location;
        var Userid = UserObj.id;
            log.debug('flag', flag);
            if (flag == 'inventorysearch') {
				var resultsArray = [];
				var locationsArray = [];
				var modelsArray = [];
				var statusesArray = [];
				var vinsArray = [];
				
				 var vmSearchObj = search.create({
					type: "customrecord_advs_vm",
					filters: [
					  ["isinactive", "is", "F"],
					  "AND",
					  ["custrecord_advs_vm_reservation_status", "anyof", "15", "19", "20", "21", "22", "23", "24", "48"],
					  /*  "AND",
					  ["custrecord_vehicle_master_bucket", "noneof", "@NONE@"], */ //TO SHOW ALL VINS EVEN IF BUCKET NOT ASSOCIATED
					  "AND",
					  ["custrecord_advs_vm_subsidary", "anyof", UserSubsidiary]
					],
					columns: [
					  search.createColumn({
						name: "internalid"
					  }),
					  search.createColumn({
						name: "name",
						sort: search.Sort.ASC,
						label: "Name"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_model",
						label: "Model"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_vehicle_brand",
						label: "Make"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_location_code",
						label: "Location"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_transmission_type",
						label: "Transmission Type"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_model_year",
						label: "Year of Manufacturing"
					  }),
					  search.createColumn({
						name: "custrecord_vehicle_master_bucket",
						label: "Year of Manufacturing"
					  }),
					  search.createColumn({
						name: "custrecord_advs_em_serial_number",
						label: "Truck Unit"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_reservation_status",
						label: "RESERVATION STATUS"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_mileage",
						label: "HMR"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_engine_serial_number",
						label: "Engine Serial Number"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_customer_number",
						label: "Customer"
					  }),
					  search.createColumn({
						name: "custrecord_advs_customer",
						label: "CUSTOMER SOFTHOLD"
					  }),
					  search.createColumn({
						name: "salesrep",
						join: "custrecord_advs_customer",
						label: "SALES REP",
					  }),
					  search.createColumn({
						name: "custrecord_reservation_hold",
						label: "SOFTHOLD STATUS"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_soft_hld_sale_rep",
						label: "SOFT HOLD SALESREP"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_exterior_color",
						label: "Exterior Color"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_date_truck_ready",
						label: "Date Truck Ready"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_date_truck_lockedup",
						label: "Date Truck Locked up"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_aging",
						label: "Aging"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_date_on_site",
						label: "Date On Site"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_soft_hold_date",
						label: "Soft Hold"
					  }),
					   search.createColumn({
						name: "custrecord_advs_sleeper_size_ms"
					  }),
					  search.createColumn({
						name: "custrecord_advs_apu_ms_tm"
					  }),
					  search.createColumn({
						name: "custrecord_advs_beds_ms_tm"
					  }),
					  search.createColumn({
						name: "custrecord_advs_title_rest_ms_tm"
					  }),
					  search.createColumn({
						name: "custrecord_advs_lease_inventory_delboard"
					  }),
					  search.createColumn({
						name: "custrecord_deposit_count"
					  }),
					  search.createColumn({
						name: "custrecord_deposit_balance"
					  }),
					  search.createColumn({
						name: "custrecord_advs_tm_truck_ready"
					  }),
					  search.createColumn({
						name: "custrecord_advs_tm_washed"
					  }),
					  search.createColumn({
						name: "custrecord_advs_single_bunk"
					  }),
					  search.createColumn({
						name: "custrecord_advs_transport_"
					  }),
					  search.createColumn({
						name: "custrecord_advs_inspected"
					  }),
					  search.createColumn({
						name: "custrecord_advs_approved_repair"
					  }),
					  search.createColumn({
						name: "custrecord_advs_picture_1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_admin_notes"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_body_style"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_eta"
					  }),
					  search.createColumn({
						name: "custrecord_advs_notes_ms_tm"
					  }),
					  search.createColumn({
						name: "custrecord_advs_aging_contract"
					  }),
					  search.createColumn({
						name: "custrecord_is_old_vehicle"
					  }),
					  search.createColumn({
						name: "custrecord_is_discount_applied"
					  }),
					  search.createColumn({
						name: "custrecord_v_master_buclet_hidden"
					  }),
					  search.createColumn({
						name: "custrecord_advs_vm_vehicle_type"
					  }),
					  //FROM HERE SOFTHOLD FIELDS
					  search.createColumn({
						name: "custrecord_advs_deposit_inception"
					  }),
					  search.createColumn({
						name: "custrecord_advs_deposit_discount"
					  }),
					  search.createColumn({
						name: "custrecord_advs_net_dep_tm"
					  }),
					  search.createColumn({
						name: "custrecord_advs_payment_inception"
					  }),
					  search.createColumn({
						name: "custrecord_advs_net_paym_tm"
					  }),
					  search.createColumn({
						name: "custrecord_advs_total_inception"
					  }),
					  search.createColumn({
						name: "custrecord_advs_buck_terms1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_payment_2_131"
					  }),
					  search.createColumn({
						name: "custrecord_advs_payment_14_25"
					  }),
					  search.createColumn({
						name: "custrecord_advs_payment_26_37"
					  }),
					  search.createColumn({
						name: "custrecord_advs_payment_38_49"
					  }),
					  search.createColumn({
						name: "custrecord_advs_pur_option"
					  }),
					  search.createColumn({
						name: "custrecord_advs_contract_total"
					  }),
					  search.createColumn({
						name: "custrecord_advs_registration_fees_bucket"
					  }),
					  search.createColumn({
						name: "custrecord_advs_grand_total_inception"
					  }),

					  search.createColumn({
						name: "custrecord_advs_deposit_inception1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_deposit_discount1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_payment_inception_1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_total_inception1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_buck_terms1_1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_payment_2_131_1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_payment_14_25_1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_payment_26_37_1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_payment_38_49_1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_pur_option_1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_contract_total_1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_registration_fe_bucket_1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_grand_total_inception_1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_bucket_1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_bucket_2"
					  }),
					  search.createColumn({
						name: "custrecord_advs_cab_config1"
					  }),
					  search.createColumn({
						name: "custrecord_advs_aging_days_ready"
					  }),
					  search.createColumn({
						name: "custrecord_advs_physical_loc_ma"
					  })

					]
				  });
				  
				  vmSearchObj.run().each(function (result) {
					var recordObj = {};

					// **Loop through all columns dynamically**
					var columns = vmSearchObj.columns;
					for (var i = 0; i < columns.length; i++) {
						var columnName = columns[i].name;
						var columnLabel = columnName; // Use label if available
						recordObj[columnLabel] = result.getValue(columnName);
						recordObj[columnLabel+'_text'] = result.getText(columnName)||'';
					}

					resultsArray.push(recordObj);

					// **Push unique values to respective arrays**
					if (recordObj["custrecord_advs_vm_location_code"] && !locationsArray.some(loc => loc.id == recordObj["custrecord_advs_vm_location_code"])) {
						locationsArray.push({'id':recordObj["custrecord_advs_vm_location_code"],'name':recordObj["custrecord_advs_vm_location_code_text"]});
					}
					if (recordObj["custrecord_advs_vm_model"] && !modelsArray.some(mod => mod.id == recordObj["custrecord_advs_vm_model"])) {
						modelsArray.push({'id':recordObj["custrecord_advs_vm_model"],'name':recordObj["custrecord_advs_vm_model_text"]});
					}
					if (recordObj["custrecord_advs_vm_reservation_status"] && !statusesArray.some(status => status.id == recordObj["custrecord_advs_vm_reservation_status"])) {
						statusesArray.push({'id':recordObj["custrecord_advs_vm_reservation_status"],'name':recordObj["custrecord_advs_vm_reservation_status_text"]});
					}
					if (recordObj["name"] && !vinsArray.some(vin => vin.id == recordObj["internalid"])) {
						vinsArray.push({'id':recordObj["internalid"],'name':recordObj["name"]});
					}

					return true; // Continue iteration
				});
				var inventorysearcharr = [{
					'resultsArray':resultsArray,
					'locationsArray':locationsArray,
					'modelsArray':modelsArray,
					'statusesArray':statusesArray,
					'vinsArray':vinsArray,
			
				}];
				
                scriptContext.response.write(JSON.stringify(inventorysearcharr)); 
            }
			else if(flag == 2){ //individual order info
				try{
					 
					  }
				catch(e)
				{
					log.debug('error',e.toString());
				}
			}
			 

        } catch (e) {
            log.debug('error', e.toString())
        }
    }
       return {
        onRequest
    }

});
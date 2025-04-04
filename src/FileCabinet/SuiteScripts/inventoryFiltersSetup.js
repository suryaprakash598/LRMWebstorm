/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/runtime', 'N/record', 'N/search'], (serverWidget, runtime, record, search) => {
	function onRequest(context) {
		if (context.request.method === 'GET') {
			// Create the form
			var userObj = runtime.getCurrentUser();
			var from = context.request.parameters.from;
			var empid = userObj.id;
			log.debug('empid', empid);
			var script_id = context.request.parameters.scriptId
			log.debug('script_id', script_id);
			let form = serverWidget.createForm({
				title: 'Filters Setup'
			});



			if (script_id == 'customscript_delivery_board_dashboard') {
				form.addFieldGroup({
					id: 'custpage_deliveryboard',
					label: 'Delivery Board Filters'
				});
				/*form.addFieldGroup({
                    id: 'custpage_insurance_claim',
                    label: 'Insurance Claim Filters'
                });*/
			}

			if (script_id == 'customscriptadvs_ss_paidinfull') {
				form.addFieldGroup({
					id: 'custpage_paidinfull',
					label: 'Paid In Filters'
				});
			}

			if (script_id == 'customdeploy_advs_available_inventory') {
				form.addFieldGroup({
					id: 'custpage_inventory',
					label: 'Inventory Filters'
				});
			}

			if (script_id == 'customdeploy_auction_dashboard_sheet') {
				form.addFieldGroup({
					id: 'custpage_auction',
					label: 'Auction Filters'
				});
			}

			if (script_id == 'customscript_repossession_dashboard_shee') {
				form.addFieldGroup({
					id: 'custpage_reposession',
					label: 'Reposession Filters'
				});
			}



			if (script_id == 'customscript_advs_transport_dashboard') {
				form.addFieldGroup({
					id: 'custpage_transport',
					label: 'Transport Filters'
				});
			}
			if (script_id == 'customscript_delivery_board_dashboard') {
				form.addFieldGroup({
					id: 'custpage_delivery_board',
					label: 'Delivery Board Filters'
				});
			}


			// Add checkboxes with labels
			// var _fields = fields();
			var _fields = dynamicFields();


			var keys = Object.keys(_fields[0]);
			var keysAll = [];
			if (script_id == 'customscript_delivery_board_dashboard') {

				var keys3 = Object.keys(_fields[3]);
				for (var l = 0; l < keys3.length; l++) {
					form.addField({
						id: keys3[l],
						type: serverWidget.FieldType.CHECKBOX,
						label: _fields[3][keys3[l]],
						container: 'custpage_deliveryboard'
					});
					//keysAll.push(keys3[l]);
					var numb = keys3[l];
					var resn = numb.substring(numb.lastIndexOf('_') + 1);
					keysAll[resn] = keys3[l];
				}
			}

			if (script_id == 'customdeploy_advs_available_inventory') {

				for (var i = 0; i < keys.length; i++) {
					form.addField({
						id: keys[i],
						type: serverWidget.FieldType.CHECKBOX,
						label: _fields[0][keys[i]],
						container: 'custpage_inventory'
					});
					var numb = keys[i];
					var resn = numb.substring(numb.lastIndexOf('_') + 1);
					keysAll[resn] = keys[i];
				}


			}

			if (script_id == 'customdeploy_auction_dashboard_sheet') {


				var keys2 = Object.keys(_fields[2]);
				for (var k = 0; k < keys2.length; k++) {
					form.addField({
						id: keys2[k],
						type: serverWidget.FieldType.CHECKBOX,
						label: _fields[2][keys2[k]],
						container: 'custpage_auction'
					});
					//keysAll.push(keys2[k]);
					var numb = keys2[k];
					var resn = numb.substring(numb.lastIndexOf('_') + 1);
					keysAll[resn] = keys2[k];
				}



			}

			if (script_id == 'customscript_repossession_dashboard_shee') {

				var keys1 = Object.keys(_fields[1]);
				for (var j = 0; j < keys1.length; j++) {
					form.addField({
						id: keys1[j],
						type: serverWidget.FieldType.CHECKBOX,
						label: _fields[1][keys1[j]],
						container: 'custpage_reposession'
					});
					//keysAll.push(keys1[j]);
					var numb = keys1[j];
					var resn = numb.substring(numb.lastIndexOf('_') + 1);
					keysAll[resn] = keys1[j];
				}

			}

			if (script_id == 'customscript_advs_transport_dashboard') {
				var keys4 = Object.keys(_fields[4]);
				for (var m = 0; m < keys4.length; m++) {
					form.addField({
						id: keys4[m],
						type: serverWidget.FieldType.CHECKBOX,
						label: _fields[4][keys4[m]],
						container: 'custpage_transport'
					});
					//keysAll.push(keys4[m]);
					var numb = keys4[m];
					var resn = numb.substring(numb.lastIndexOf('_') + 1);
					keysAll[resn] = keys4[m];
				}
			}

			if (script_id == 'customscriptadvs_ss_paidinfull') {
				var keys5 = Object.keys(_fields[5]);
				for (var m = 0; m < keys5.length; m++) {
					form.addField({
						id: keys5[m],
						type: serverWidget.FieldType.CHECKBOX,
						label: _fields[5][keys5[m]],
						container: 'custpage_transport'
					});
					//keysAll.push(keys5[m]);
					var numb = keys5[m];
					var resn = numb.substring(numb.lastIndexOf('_') + 1);
					keysAll[resn] = keys5[m];
				}
			}


			var empobj = form.addField({
				id: 'custpage_current_emp',
				type: serverWidget.FieldType.TEXT,
				label: 'Employee'
			});
			empobj.updateDisplayType({
				displayType: serverWidget.FieldDisplayType.HIDDEN
			});
			empobj.defaultValue = empid;

			var fromobj = form.addField({
				id: 'custpage_current_from',
				type: serverWidget.FieldType.TEXT,
				label: 'From'
			});
			fromobj.updateDisplayType({
				displayType: serverWidget.FieldDisplayType.HIDDEN
			});
			fromobj.defaultValue = from;
			var fromscriptobj = form.addField({
				id: 'custpage_current_fromscript',
				type: serverWidget.FieldType.TEXT,
				label: 'FromScript'
			});
			fromscriptobj.updateDisplayType({
				displayType: serverWidget.FieldDisplayType.HIDDEN
			});
			fromscriptobj.defaultValue = script_id;
			if (empid) {
				var filterField =
					script_id == 'customscript_advs_transport_dashboard' ?
						'custentity_tran_filters_chosen' :
						script_id == 'customdeploy_advs_available_inventory' ?
							'custentity_inventory_filters_chosen' :
							script_id == 'customscript_repossession_dashboard_shee' ?
								'custentity_repo_filters_chosen' :
								script_id == 'customdeploy_auction_dashboard_sheet' ?
									'custentity_auct_filters_chosen' :
									script_id == 'customscriptadvs_ss_paidinfull' ?
										'custentity_paid_filters_chosen' :
										script_id == 'customscript_delivery_board_dashboard' ?
											'custentity_dboard_filters_chosen' :
											null;
				log.debug('filterField', filterField);
				if (filterField) {
					var data = search.lookupFields({
						type: 'employee',
						id: empid,
						columns: [filterField]
					});

					if (data[filterField] && data[filterField].length) {
						log.debug('keysAll', keysAll);
						var indes = JSON.parse(data[filterField]);
						log.debug('indes', indes);

						for (var i = 0; i < indes.length; i++) {
							var _fieldid = keysAll[indes[i]];

							if (_fieldid) {
								var fieldobj = form.getField({
									id: _fieldid
								});
								if (fieldobj) {
									fieldobj.defaultValue = 'T';
								}
							}
						}
					}
				}
			}
			////////////////////////////////////


			// Add a submit button
			form.addSubmitButton({
				label: 'Submit'
			});
			form.addButton({
				id: 'custpage_mark_all',
				label: 'Mark All',
				functionName: 'markAllCheckboxes'
			});

			form.addButton({
				id: 'custpage_unmark_all',
				label: 'Unmark All',
				functionName: 'unmarkAllCheckboxes'
			});

			// Attach client script
			form.clientScriptModulePath = './client_mark_all.js';

			// Display form
			context.response.writePage(form);
		}
		else if (context.request.method === 'POST') {
			// Read checked values
			//var _fields = fields();
			var _fields = dynamicFields();
			var keys = Object.keys(_fields[0]);
			var keys1 = Object.keys(_fields[1]);
			var keys2 = Object.keys(_fields[2]);
			var keys3 = Object.keys(_fields[3]);
			var keys4 = Object.keys(_fields[4]);
			var keys5 = Object.keys(_fields[5]);
			let checkedValues = {};
			var arr = [];
			for (var i = 0; i < keys.length; i++) {
				var chboxval = context.request.parameters[keys[i]] === 'T' ? '1' : '0';
				if (chboxval == 1) {
					checkedValues["cb_" + keys[i]] = (context.request.parameters[keys[i]] === 'T' ? '1' : '0')
					var numb = keys[i];
					var resn = numb.substring(numb.lastIndexOf('_') + 1);
					arr.push(resn * 1);
				}
			}
			for (var j = 0; j < keys1.length; j++) {
				var chboxval = context.request.parameters[keys1[j]] === 'T' ? '1' : '0';

				if (chboxval == 1) {
					checkedValues["cb_" + keys1[j]] = (context.request.parameters[keys1[j]] === 'T' ? '1' : '0')
					var numb = keys1[j];
					var resn = numb.substring(numb.lastIndexOf('_') + 1);
					arr.push(resn * 1);
					//arr.push(j);
				}
			}
			for (var k = 0; k < keys2.length; k++) {
				var chboxval = context.request.parameters[keys2[k]] === 'T' ? '1' : '0';

				if (chboxval == 1) {
					checkedValues["cb_" + keys2[k]] = (context.request.parameters[keys2[k]] === 'T' ? '1' : '0')
					var numb = keys2[k];
					var resn = numb.substring(numb.lastIndexOf('_') + 1);
					arr.push(resn * 1);
					//arr.push(j);
				}
			}
			for (var kl = 0; kl < keys3.length; kl++) {
				var chboxval = context.request.parameters[keys3[kl]] === 'T' ? '1' : '0';

				if (chboxval == 1) {
					checkedValues["cb_" + keys3[kl]] = (context.request.parameters[keys3[kl]] === 'T' ? '1' : '0')
					var numb = keys3[kl];
					var resn = numb.substring(numb.lastIndexOf('_') + 1);
					arr.push(resn * 1);
					//arr.push(j);
				}
			}
			for (var km = 0; km < keys4.length; km++) {
				var chboxval = context.request.parameters[keys4[km]] === 'T' ? '1' : '0';

				if (chboxval == 1) {
					checkedValues["cb_" + keys4[km]] = (context.request.parameters[keys4[km]] === 'T' ? '1' : '0')
					var numb = keys4[km];
					var resn = numb.substring(numb.lastIndexOf('_') + 1);
					arr.push(resn * 1);
					//arr.push(j);
				}
			}

			for (var km = 0; km < keys5.length; km++) {
				var chboxval = context.request.parameters[keys4[km]] === 'T' ? '1' : '0';

				if (chboxval == 1) {
					checkedValues["cb_" + keys5[km]] = (context.request.parameters[keys5[km]] === 'T' ? '1' : '0')
					var numb = keys5[km];
					var resn = numb.substring(numb.lastIndexOf('_') + 1);
					arr.push(resn * 1);
					//arr.push(j);
				}
			}
			var empid = context.request.parameters.custpage_current_emp
			var fromid = context.request.parameters.custpage_current_from
			var fromscriptid = context.request.parameters.custpage_current_fromscript;
			log.debug('fromscriptid', fromscriptid);
			//////////////////////////
			if (empid) {
				var filterField =
					fromscriptid == 'customscript_advs_transport_dashboard' ?
						'custentity_tran_filters_chosen' :
						fromscriptid == 'customdeploy_advs_available_inventory' ?
							'custentity_inventory_filters_chosen' :
							fromscriptid == 'customscript_repossession_dashboard_shee' ?
								'custentity_repo_filters_chosen' :
								fromscriptid == 'customdeploy_auction_dashboard_sheet' ?
									'custentity_auct_filters_chosen' :
									fromscriptid == 'customscriptadvs_ss_paidinfull' ?
										'custentity_paid_filters_chosen' :
										fromscriptid == 'customscript_delivery_board_dashboard' ?
											'custentity_dboard_filters_chosen' :
											null;
				log.debug('filterField', filterField);
				if (filterField) {
					record.submitFields({
						type: 'employee',
						id: empid,
						values: {
							[filterField]: JSON.stringify(arr)
						},
						options: {
							enableSourcing: false,
							ignoreMandatoryFields: true
						}
					});
				}
			}



			////////////////////
			// if(empid)
			// {
			// 	record.submitFields({type:'employee',id:empid,values:{custentity_inventory_filters_chosen:JSON.stringify(arr)},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
			// }
			// Log results
			log.debug('arr Values:', arr);
			log.debug('Checkbox Values:', checkedValues);
			if (fromscriptid == 'customscript_advs_transport_dashboard') {
				context.response.write('<script>window.opener.location.href = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2627&deploy=1&whence=&filters=' + JSON.stringify(arr) + '";window.close();</script>')
			} else if (fromscriptid == 'customdeploy_advs_available_inventory') {
				context.response.write('<script>window.opener.location.href = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2638&deploy=1&whence=&filters=' + JSON.stringify(arr) + '";window.close();</script>')
			} else if (fromscriptid == 'customscript_repossession_dashboard_shee') {
				context.response.write('<script>window.opener.location.href = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2636&deploy=1&whence=&filters=' + JSON.stringify(arr) + '";window.close();</script>')
			} else if (fromscriptid == 'customscriptadvs_ss_paidinfull') {
				context.response.write('<script>window.opener.location.href = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2644&deploy=1&whence=&filters=' + JSON.stringify(arr) + '";window.close();</script>')
			} else if (fromscriptid == 'customscript_delivery_board_dashboard') {
				context.response.write('<script>window.opener.location.href = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2630&deploy=1&whence=&filters=' + JSON.stringify(arr) + '";window.close();</script>')
			}
			/*if (fromid == 1) {
                context.response.write('<script>window.opener.location.href = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2638&deploy=1&whence=&filters=' + JSON.stringify(arr) + '";window.close();</script>')
            } else {
                context.response.write('<script>window.opener.location.href = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2638&deploy=1&whence=&filters=' + JSON.stringify(arr) + '";window.close();</script>')
            }*/

			// Return response
			//context.response.write(`<h3>Submitted Values:</h3><pre>${JSON.stringify(checkedValues, null, 2)}</pre>`);
		}
	}

	function dynamicFields() {
		try {
			var arr = [];
			var obj = {};
			var obj1 = {};
			var obj2 = {};
			var obj3 = {};
			var obj4 = {};
			var obj5 = {};
			var customrecord_filters_setupSearchObj = search.create({
				type: "customrecord_filters_setup",
				filters: [
					["isinactive", "is", "F"],
					"AND",
					["custrecord_field_display", "is", "T"]
				],
				columns: [
					"custrecord_field_id",
					"custrecord_field_label",
					"custrecord_advs_filters_class"
				]
			});
			var searchResultCount = customrecord_filters_setupSearchObj.runPaged().count;
			customrecord_filters_setupSearchObj.run().each(function (result) {
				// .run().each has a limit of 4,000 results
				var fieldid = result.getValue({
					name: 'custrecord_field_id'
				});
				var fieldLabel = result.getValue({
					name: 'custrecord_field_label'
				});
				var fieldGroup = result.getText({
					name: 'custrecord_advs_filters_class'
				});
				if (fieldGroup == 'Inventory') {
					obj['custpage' + fieldid.toLowerCase()] = fieldLabel;
				} else if (fieldGroup == 'Reposession') {
					obj1['custpage' + fieldid.toLowerCase()] = fieldLabel;
				} else if (fieldGroup == 'Auction') {
					obj2['custpage' + fieldid.toLowerCase()] = fieldLabel;
				} else if (fieldGroup == 'Delivery Board') {
					obj3['custpage' + fieldid.toLowerCase()] = fieldLabel;
				} else if (fieldGroup == 'Transport') {
					obj4['custpage' + fieldid.toLowerCase()] = fieldLabel;
				} else if (fieldGroup == 'Paid In Full') {
					obj5['custpage' + fieldid.toLowerCase()] = fieldLabel;
				}


				return true;
			});
			arr.push(obj);
			arr.push(obj1);
			arr.push(obj2);
			arr.push(obj3);
			arr.push(obj4);
			arr.push(obj5);
			log.debug('arr', arr);
			return arr;
		} catch (e) {
			log.debug('error', e.toString());
		}
	}

	function fields() {
		var arr = [];
		var obj = {};

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

		var obj1 = {};
		obj1["custpage_vin_repo_12"] = "VIN";
		obj1["custpage_repostatus_13"] = "REPO STATUS";
		obj1["custpage_location_repo_14"] = "LOCATION";
		obj1["custpage_model_repo_15"] = "MODEL";
		obj1["custpage_mileage_repo_16"] = "MILEAGE";
		obj1["custpage_company_repo_17"] = "REPO COMPANY";
		obj1["custpage_dateassigned_repo_18"] = "DATE ASSIGNED";

		var obj2 = {};
		obj2["custpage_vin_auction_19"] = "VIN";
		obj2["custpage_status_auction_20"] = "STATUS";
		obj2["custpage_location_auction_21"] = "LOCATION";
		obj2["custpage_date_auction_22"] = "Auction Date";
		obj2["custpage_condition_auction_23"] = "CONDITION";
		obj2["custpage_cleaned_auction_24"] = "CLEANED";

		var obj3 = {};
		obj3["custpage_vin_db_25"] = "VIN";
		obj3["custpage_customer_db_26"] = "CUSTOMER";
		obj3["custpage_salesrep_db_27"] = "SALESREP";
		obj3["custpage_truckready_db_28"] = "TRUCK READY";
		obj3["custpage_washed_db_29"] = "WASHED";
		obj3["custpage_mcoo_db_30"] = "MC/OO";

		var obj4 = {};
		obj4["custpage_claim_ins_31"] = "CLAIM";
		obj4["custpage_stock_ins_32"] = "STOCK";
		obj4["custpage_unitcondition_ins_33"] = "UNIT CONDITION";

		var obj5 = {};
		obj5["custpage_transfer_type_34"] = "TRANSFER TYPE";
		obj5["custpage_lessee_35"] = "LESSEE";
		obj5["custpage_vin_36"] = "VIN";
		obj5["custpage_fifstatus_38"] = "PIF STATUS";

		arr.push(obj);
		arr.push(obj1);
		arr.push(obj2);
		arr.push(obj3);
		arr.push(obj4);
		arr.push(obj5);
		return arr;
	}
	return {
		onRequest
	};
});
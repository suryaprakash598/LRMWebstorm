/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/currentRecord', 'N/log', 'N/record', 'N/runtime', 'N/search', './advs_lib_rental_leasing.js', './advs_lib_util.js', 'N/ui/message', 'N/redirect', 'N/format'],
	/**
	 * @param{currentRecord} currentRecord
	 * @param{log} log
	 * @param{record} record
	 * @param{runtime} runtime
	 * @param{search} search
	 */
	(currentRecord, log, record, runtime, search, liblease, libUtil, message, redirect, format) => {

		/**
		 * Defines the function definition that is executed before record is loaded.
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.newRecord - New record
		 * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
		 * @param {Form} scriptContext.form - Current form
		 * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
		 * @since 2015.2
		 */
		const beforeLoad = (scriptContext) => {
			var type = scriptContext.type;
			var request = scriptContext.request;

			if (type == "view") {
				var curRec = scriptContext.newRecord;
				var TranDate = new Date();
				// TranDate =format.format({type:format.Type.DATE,value:TranDate});
				var LbDate = curRec.getValue({ fieldId: "custrecord_advs_l_h_ins_lia_exp_dt" });
				LbDate = new Date(LbDate);
				// if(LbDate){
				//     LbDate   =  format.format({type:format.Type.DATE,value:LbDate});
				// }
				var RegDate = curRec.getValue({ fieldId: "custrecord_advs_l_h_reg_exp_date" });
				RegDate = new Date(RegDate);
				// if(RegDate){
				//     RegDate  =  format.format({type:format.Type.DATE,value:RegDate});
				// }


				if (LbDate < TranDate) {
					scriptContext.form.addPageInitMessage({
						type: message.Type.INFORMATION,
						title: "<b style='display:none;'>Liability!</b>",
						message: "<b style='background-color:red;font-size:18px;color:black;'>Liability already expired.</b>"
					});
				}
				if (RegDate < TranDate) {
					scriptContext.form.addPageInitMessage({
						type: message.Type.INFORMATION,
						title: "<b style='display:none;'>Registration!</b>",
						message: "<b style='background-color:Orange;font-size:18px;color:black;'>Registration already expired.</b>"
					});
				}
			}







			if (type == "create" || type == "edit") {
				var form = scriptContext.form;
				var curRec = scriptContext.newRecord;
				var status = curRec.getValue({ fieldId: "custrecord_advs_l_h_status" });
				liblease.calculateInvLines(scriptContext);
			}
			if (type == "view") {
				var form = scriptContext.form;
				var curRec = scriptContext.newRecord;
				var status = curRec.getValue({ fieldId: "custrecord_advs_l_h_status" });
				var assignedL = curRec.getValue({ fieldId: "custrecord_advs_l_h_no_o_as_line" });
				var vinBodyFld = curRec.getValue({ fieldId: "custrecord_advs_la_vin_bodyfld" });
				var cpcEnable = curRec.getValue({ fieldId: "custrecord_advs_l_a_cpc" });
				var cpcid = curRec.getValue({ fieldId: "custrecord_advs_l_a_curr_cps" });

				var driven = curRec.getValue({ fieldId: "custrecord_advs_l_a_driven_mileage" }) * 1;
				var actual = curRec.getValue({ fieldId: "custrecord_advs_l_a_actual_mil" }) * 1;
				var mileLimit = curRec.getValue({ fieldId: "custrecord_advs_l_a_l_m_limit" }) * 1;

				var repoLink = curRec.getValue({ fieldId: "custrecord_advs_l_a_ofr_link" });
				var famLink = curRec.getValue({ fieldId: "custrecord_advs_l_h_fixed_ass_link" });
				var modelID = curRec.getValue({ fieldId: "custrecord_advs_lease_su_model" });
				var vinName = curRec.getText({ fieldId: "custrecord_advs_la_vin_bodyfld" });
				var insuranceclaim = curRec.getValue({ fieldId: "custrecord_insurance_claim" });
				var istotalloss = curRec.getValue({ fieldId: "custrecord_is_lease_total_loss" });
				var totallossstatus = curRec.getValue({ fieldId: "custrecord_advs_l_h_status" });
				var liabilityexpiration = curRec.getValue({ fieldId: "custrecord_advs_l_h_ins_lia_exp_dt" });
				var physicalexpiration = curRec.getValue({ fieldId: "custrecord_advs_l_h_ins_phy_dam_exp" });
				var today = new Date();
				if (liabilityexpiration != '') {
					log.debug('liabilityexpiration', liabilityexpiration);
				}
				if (physicalexpiration != '') {
					log.debug('physicalexpiration', physicalexpiration);
				}
				log.debug('today', today);
				if (insuranceclaim != '') {
					scriptContext.form.addPageInitMessage({
						type: message.Type.INFORMATION,
						title: "<b style='display:none;'>!</b>",
						message: "<b style='font-size:18px;color:black;'>This truck is on potential insurance claim.</b>"
					});
				}
				if (istotalloss) {
					scriptContext.form.addPageInitMessage({
						type: message.Type.ERROR,
						title: "<b style='display:none;'>!</b>",
						message: "<b style='font-size:18px;color:black;'>This truck is on total loss.</b>"
					});
				}
				if (istotalloss && totallossstatus != 8) {
					var recid = curRec.id;
					form.addButton({
						id: "custpage_button_totalloss",
						label: "Total Loss",
						functionName: "updateTotalLoss(" + recid + "," + vinBodyFld + ")"
					});
				}


				var recid = curRec.id;
				var isdocsigncompleted = '';//isDocusignCompleted(recid)
				var isAdobesignCompleted = isAdobeSignCompleted(recid);

				if (vinBodyFld) {
					if ((status == 1) && (isAdobesignCompleted >= 1)) {
						// form.addButton({id:"custpage_search_vin",label:"Search Vin",functionName:"searchVinview("+recid+")"});

						if (vinName && modelID) {
							var vehicleAvailability = liblease.getinventoryAvailability(vinName, modelID);
							var inventoryLoc = vehicleAvailability.location;
							var inventoryNum = vehicleAvailability.inventorynumber;

							if(inventoryLoc && inventoryNum){
							form.addButton({
								id: "custpage_button_confirm",
								label: "Confirm",
								functionName: "confirmAction(" + recid + ")"
							});
							}else{
								showMessageOnLoad(scriptContext,"Vehicle is not available in Inventory");
							}

						}



					}
					/*if ((libUtil.leaseStatus.draft == status) && (!famLink)) {
						form.addButton({
							id: "custpage_fam_asset",
							label: "FAM",
							functionName: "createFam(" + recid + ")"
						});

					}*/
				}

				form.addButton({ id: "custpage_del_check", label: "Delivery Checklist", functionName: "DeliveryChecklistAction(" + recid + ")" });



				if ((libUtil.leaseStatus.active == status) && (driven > mileLimit)) {
					form.addButton({ id: "custpage_change_sche", label: "Change Schedule", functionName: "modifyschedule(" + recid + ")" });
				}
				if ((libUtil.leaseStatus.active == status)) {
					if (cpcEnable == true || cpcEnable == "true") {
						//form.addButton({id:"custpage_cpc_close",label:"END CPC",functionName:"removeCPC("+recid+","+cpcid+")"});

						/*scriptContext.form.addPageInitMessage({
							type: message.Type.ERROR,
							title: "<b style='display:none;'>!</b>",
							message: "<b style='font-size:18px;color:black;'>This Customer is on CPC.</b>"
						});*/
					} else {
						//form.addButton({id:"custpage_cpc_add",label:"Start CPC",functionName:"addCPC("+recid+")"});
					}

					form.addButton({ id: "custpage_return", label: "Return", functionName: "returnCall(" + recid + ")" });
					var model = ""; var brand = ""; var location = "";
					if (vinBodyFld) {
						var fields = ['custrecord_advs_vm_model', 'custrecord_advs_vm_vehicle_brand', 'custrecord_advs_vm_location_code', 'internalid'];
						var SearchObj = search.lookupFields({
							type: 'customrecord_advs_vm',
							id: vinBodyFld,
							columns: fields
						});
						model = SearchObj['custrecord_advs_vm_model'][0].value;
						brand = SearchObj['custrecord_advs_vm_vehicle_brand'][0].value;
						location = SearchObj['custrecord_advs_vm_location_code'][0].value;
					}
					form.addButton({ id: "custpage_swap", label: "Swap", functionName: "swapBtn(" + recid + "," + vinBodyFld + "," + model + "," + brand + "," + location + ")" });

					if (!repoLink) {
						form.addButton({ id: "custpage_repo", label: "Repo", functionName: "createRepo(" + recid + "," + vinBodyFld + ")" });

					} else {
						scriptContext.form.addPageInitMessage({
							type: message.Type.INFORMATION,
							title: "<b style='display:none;'>!</b>",
							message: "<b style='font-size:18px;color:black;'>This Vehicle is on OFR.</b>"
						});
					}
				}
				form.clientScriptModulePath = "./advs_cs_lease_agreement_n.js";
			}
			if (type == "create" || type == "copy") {
				if (request != null && request != undefined && request != "") {

					var paramBucket = request.parameters.param_buckt;
					var param_vin = request.parameters.param_vin;
					var softHoldCust = request.parameters.custparam_soft_hold_cus; //750;//
					var softHoldCus_sales_rep = request.parameters.custpara_sof_hold_salesrep;
					var curRec = scriptContext.newRecord;
					if (paramBucket != null && paramBucket != undefined && paramBucket != "") {

						curRec.setValue({ fieldId: "custrecord_advs_l_h_buc_link", value: paramBucket })
					}
					if (softHoldCust != null && softHoldCust != undefined && softHoldCust != "") {
						//var curRec  =   scriptContext.newRecord;
						curRec.setValue({ fieldId: "custrecord_advs_l_h_customer_name", value: softHoldCust });
						curRec.setValue({ fieldId: "custrecord_advs_l_h_location", value: 1 });
					}
					/* if(softHoldCus_sales_rep != null && softHoldCus_sales_rep != undefined && softHoldCus_sales_rep != ""){
						var LocationToSet = "";
						var SearchObj = search.lookupFields({ type: 'employee',id: softHoldCus_sales_rep, columns: "location" });
						if(SearchObj['location'] != null && SearchObj['location'] != undefined){
						   LocationToSet   =   SearchObj['location'][0].value;
						}
						log.debug("LocationToSet ",LocationToSet);
						if(LocationToSet){
						  curRec.setValue({ fieldId:"custrecord_advs_l_h_location", value:LocationToSet});
						}
					} */

					//SURYA TO UPDATE INCEPTION VALUES 
					var VinNo = param_vin //curRec.getValue({fieldId:"custrecord_advs_la_vin_bodyfld"}); 
					log.debug('VinNo', VinNo);
					if (VinNo) {

						var fields = ['custrecord_advs_deposit_inception', 'custrecord_advs_deposit_discount',
                                      'custrecord_advs_payment_inception', 'custrecord_advs_payment_discount', 
                                      'custrecord_advs_total_inception','custrecord_advs_contract_total',
									  'custrecord_advs_net_paym_tm','custrecord_advs_net_dep_tm','custrecord_advs_pay_inc_disc'];
						var SearchObj = search.lookupFields({
							type: 'customrecord_advs_vm',
							id: VinNo,
							columns: fields
						});
						log.debug('SearchObj', SearchObj);
						var depositInception = SearchObj.custrecord_advs_deposit_inception
						var depositDisc = SearchObj.custrecord_advs_deposit_discount
						var payIncep = SearchObj.custrecord_advs_payment_inception
						var payDisc = SearchObj.custrecord_advs_payment_discount
						var totalIncep = SearchObj.custrecord_advs_total_inception
                      var vincontracttotal =  SearchObj.custrecord_advs_contract_total
                      var netpaymentinc =  SearchObj.custrecord_advs_net_paym_tm
                      var netdepinc =  SearchObj.custrecord_advs_net_dep_tm
                      var paydiscn =  SearchObj.custrecord_advs_pay_inc_disc
						log.debug('totalIncep', totalIncep);
						if (payIncep && payDisc) {
							payIncep = (payIncep * 1) - (payDisc * 1)
							curRec.setValue({ fieldId: "custrecord_advs_l_h_pay_incep", value: payIncep });
							curRec.setValue({ fieldId: "custrecord_advs_l_h_pay2_13", value: payIncep });
							curRec.setValue({ fieldId: "custrecord_advs_l_h_pay_14_25", value: payIncep });
							curRec.setValue({ fieldId: "custrecord_advs_l_h_pay_26_37", value: payIncep });
							curRec.setValue({ fieldId: "custrecord_advs_l_h_pay_38_49", value: payIncep });
						}
						if (depositDisc) {
							curRec.setValue({ fieldId: "custrecord_advs_ss_deposit_disc_lease", value: depositDisc });
						}
						if(netdepinc)
						{
							curRec.setValue({ fieldId: "custrecord_advs_net_dep_", value: netdepinc });
						}
						if(paydiscn)
						{
							curRec.setValue({ fieldId: "custrecord_advs_payment_disc", value: paydiscn });
						}
						if(netpaymentinc)
						{
							curRec.setValue({ fieldId: "custrecord_advs_net_payment", value: netpaymentinc });
						}
						if (totalIncep) {
							curRec.setValue({ fieldId: "custrecord_advs_l_h_tot_ince", value: totalIncep });
							curRec.setValue({ fieldId: "custrecord_advs_l_h_pur_opti", value: totalIncep * 1 });
							curRec.setValue({ fieldId: "custrecord_advs_l_h_cont_total", value: vincontracttotal * 1 });
						}

					}
					//SURYA TO UPDATE INCEPTION VALUES 
				}
			}

			if (type == "edit") {
				var request = scriptContext.request;
				if (request != null && request != undefined && request != "") {
					var isReturn = request.parameters.isfromdash;

					log.debug("isReturn", isReturn)
					if (isReturn == "T" || isReturn == true || isReturn == "true") {
						var currec = scriptContext.newRecord;
						fetchforReturn(scriptContext);
					}
				}
			}
			if (type == "view") {
				var form = scriptContext.form;
				var curRec = scriptContext.newRecord;
				var recid = curRec.id;
				var repoLink = curRec.getValue({ fieldId: "custrecord_advs_l_a_ofr_link" });
				var vinBodyFld = curRec.getValue({ fieldId: "custrecord_advs_la_vin_bodyfld" });
				if (repoLink != '') {
					//REPOSESSION BUTTON
					form.addButton({ id: "custpage_repo_button", label: "Reposession", functionName: "reposession(" + recid + "," + vinBodyFld + "," + repoLink + ")" });
				}
			}
		}
		/**
		 * Defines the function definition that is executed before record is submitted.
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.newRecord - New record
		 * @param {Record} scriptContext.oldRecord - Old record
		 * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
		 * @since 2015.2
		 */
		const beforeSubmit = (scriptContext) => {
			var type = scriptContext.type;
			var newRec = scriptContext.newRecord;
			if (type == "create" || type == "edit") {

				var status = newRec.getValue({ fieldId: "custrecord_advs_l_h_status" });
				if (status == 1 || status == "1") {
					// liblease.calcStockLines(scriptContext);
					// liblease.createREgularLines(scriptContext);
					var VinNo = newRec.getValue({ fieldId: "custrecord_advs_la_vin_bodyfld" });
					//BEFORE GENERATING LINES 
					var fields = ['custrecord_advs_deposit_inception', 
					'custrecord_advs_deposit_discount', 'custrecord_advs_payment_inception',
					'custrecord_advs_payment_discount', 'custrecord_advs_total_inception',
					'custrecord_advs_net_paym_tm',
									'custrecord_advs_net_dep_tm',
									'custrecord_advs_pay_inc_disc',
									'custrecord_advs_contract_total'
					];
					var SearchObj = search.lookupFields({
						type: 'customrecord_advs_vm',
						id: VinNo,
						columns: fields
					});
					log.debug('SearchObj before submit', SearchObj);
					var depositInception = SearchObj.custrecord_advs_deposit_inception
					var depositDisc = SearchObj.custrecord_advs_deposit_discount
					var payIncep = SearchObj.custrecord_advs_payment_inception
					var payDisc = SearchObj.custrecord_advs_payment_discount
					var totalIncep = SearchObj.custrecord_advs_total_inception
					var netpayince = SearchObj.custrecord_advs_net_paym_tm
					var netdepince = SearchObj.custrecord_advs_net_dep_tm
					var payincdisc = SearchObj.custrecord_advs_pay_inc_disc
					var _conttotal = SearchObj.custrecord_advs_contract_total

					if (payIncep && payDisc) {
						payIncep = (payIncep * 1) - (payDisc * 1)
						newRec.setValue({ fieldId: "custrecord_advs_l_h_pay_incep", value: payIncep });
						newRec.setValue({ fieldId: "custrecord_advs_l_h_pay2_13", value: payIncep });
						newRec.setValue({ fieldId: "custrecord_advs_l_h_pay_14_25", value: payIncep });
						newRec.setValue({ fieldId: "custrecord_advs_l_h_pay_26_37", value: payIncep });
						newRec.setValue({ fieldId: "custrecord_advs_l_h_pay_38_49", value: payIncep });
					}
					if (depositDisc) {
						newRec.setValue({ fieldId: "custrecord_advs_ss_deposit_disc_lease", value: depositDisc });
					}
					if (payincdisc) {
						newRec.setValue({ fieldId: "custrecord_advs_payment_disc", value: payincdisc });
					}
					if (netpayince) {
						newRec.setValue({ fieldId: "custrecord_advs_net_payment", value: netpayince });
					}
					if (netdepince) {
						newRec.setValue({ fieldId: "custrecord_advs_net_dep_", value: netdepince });
					}
					if (totalIncep) {
						newRec.setValue({ fieldId: "custrecord_advs_l_h_tot_ince", value: totalIncep });
						
					}
					var terms = newRec.getValue({fieldId:'custrecord_advs_l_h_terms'});
					
					var purchasetotal = ((netpayince*1) + (netdepince*1));
					var contracttotal = (((terms*1)*(netpayince*1))+(netdepince*1));
					if(totalIncep){
						newRec.setValue({ fieldId: "custrecord_advs_l_h_pur_opti", value: totalIncep });
					}
					/* if(contracttotal){
						newRec.setValue({ fieldId: "custrecord_advs_l_h_cont_total", value: contracttotal });
					} */
					if (_conttotal) {
						newRec.setValue({ fieldId: "custrecord_advs_l_h_cont_total", value: _conttotal });
						
					}
					
					//BEFORE GENERATING LINES 



					liblease.createREgularLines(scriptContext);
				}
				liblease.calculateInvLines(scriptContext);
				if (type == "edit") {
					var oldRec = scriptContext.oldRecord;
					var oldRetType = oldRec.getValue({ fieldId: "custrecord_advs_l_a_return_type" });
					var returnType = newRec.getValue({ fieldId: "custrecord_advs_l_a_return_type" });
					if ((returnType) && (oldRetType != returnType)) {
						newRec.setValue("custrecord_advs_l_h_status", libUtil.leaseStatus.return);
					}
				}
				if (type == "create") {
					var LeaseVin = newRec.getValue({ fieldId: 'custrecord_advs_la_vin_bodyfld' });
					if (LeaseVin) {
						getDeliveryBoardData(LeaseVin, newRec);
					}
				}
			}
			if (type == "create" || type == "edit") {
				log.debug("type", type)
				// var newRec  =   scriptContext.newRecord;
				var VinNo = newRec.getValue({ fieldId: "custrecord_advs_la_vin_bodyfld" });
				if (false) { //VinNo

					var fields = ['custrecord_advs_deposit_inception', 
									'custrecord_advs_deposit_discount', 
									'custrecord_advs_payment_inception', 
									'custrecord_advs_payment_discount',
									'custrecord_advs_total_inception',
									'custrecord_advs_net_paym_tm',
									'custrecord_advs_net_dep_tm',
									'custrecord_advs_pay_inc_disc'
								];
					var SearchObj = search.lookupFields({
						type: 'customrecord_advs_vm',
						id: VinNo,
						columns: fields
					});
					var depositInception = SearchObj.custrecord_advs_deposit_inception
					var depositDisc = SearchObj.custrecord_advs_deposit_discount
					var payIncep = SearchObj.custrecord_advs_payment_inception
					var payDisc = SearchObj.custrecord_advs_payment_discount
					var totalIncep = SearchObj.custrecord_advs_total_inception
					var netpayince = SearchObj.custrecord_advs_net_paym_tm
					var netdepince = SearchObj.custrecord_advs_net_dep_tm
					var payincdisc = SearchObj.custrecord_advs_pay_inc_disc

					if (payIncep && payDisc) {
						payIncep = (payIncep * 1) - (payDisc * 1)
						newRec.setValue({ fieldId: "custrecord_advs_l_h_pay_incep", value: payIncep });
						newRec.setValue({ fieldId: "custrecord_advs_l_h_pay2_13", value: payIncep });
						newRec.setValue({ fieldId: "custrecord_advs_l_h_pay_14_25", value: payIncep });
						newRec.setValue({ fieldId: "custrecord_advs_l_h_pay_26_37", value: payIncep });
					}
					if (depositDisc) {
						newRec.setValue({ fieldId: "custrecord_advs_ss_deposit_disc_lease", value: depositDisc });
					}
					if (payincdisc) {
						newRec.setValue({ fieldId: "custrecord_advs_payment_disc", value: payincdisc });
					}
					if (netpayince) {
						newRec.setValue({ fieldId: "custrecord_advs_net_payment", value: netpayince });
					}
					if (netdepince) {
						newRec.setValue({ fieldId: "custrecord_advs_net_dep_", value: netdepince });
					}
					if (totalIncep) {
						newRec.setValue({ fieldId: "custrecord_advs_l_h_tot_ince", value: totalIncep });
						newRec.setValue({ fieldId: "custrecord_advs_l_h_pur_opti", value: totalIncep });
					}

				}

			}
			if (type == "create") {
				var VinNo = newRec.getValue({ fieldId: "custrecord_advs_la_vin_bodyfld" });
				if (VinNo) {

					var dep_del_boardSearchObj = search.create({
						type: "customrecord_advs_vm_inv_dep_del_board",
						filters:
							[
								["custrecord_advs_in_dep_vin", "anyof", VinNo],
								"AND",
								["isinactive", "is", "F"]
							],
						columns:
							[
								search.createColumn({ name: "custrecord_advs_in_dep_name", label: "Name" }),
								search.createColumn({ name: "custrecord_advs_in_dep_mc_oo", label: "MC/OO" }),
								search.createColumn({ name: "internalid", label: "Internal ID" })
							]
					});
					var searchResultCount = dep_del_boardSearchObj.runPaged().count;
					log.debug("dep_del_boardSearchObj result count", searchResultCount);


					dep_del_boardSearchObj.run().each(function (result) {
						var McooFld = result.getValue({
							name: 'custrecord_advs_in_dep_mc_oo'
						});
						var SubmitId;
						if (McooFld == "1") {
							SubmitId = "1"
						}
						if (McooFld == "2") {
							SubmitId = "2"
						}
						if (SubmitId) {
							newRec.setValue({ fieldId: "custrecord_advs_liability_type_f", value: SubmitId });
						}

						return true;
					});




				}
			}
		}

		/**
		 * Defines the function definition that is executed after record is submitted.
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.newRecord - New record
		 * @param {Record} scriptContext.oldRecord - Old record
		 * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
		 * @since 2015.2
		 */
		const afterSubmit = (scriptContext) => {
			var User = runtime.getCurrentUser();
			var UserId = User.id;
			var type = scriptContext.type;
			var newRec = scriptContext.newRecord;
			var NewRecId = newRec.id;

			if (type == "create") {
				var vinId = newRec.getValue({ fieldId: "custrecord_advs_la_vin_bodyfld" });
				var rentalId = newRec.id;
				if (vinId) {
					record.submitFields({
						type: "customrecord_advs_vm", id: vinId, values: {
							"custrecord_advs_vm_lea_hea": rentalId
						}
					});
					//STOPPING THIS AND CHANGING STATUS ON CONFIM
					//"custrecord_advs_vm_reservation_status":libUtil.vmstatus.lease
				}
			}
			if (type == "edit") {


				var oldRec = scriptContext.oldRecord;
				var oldStatus = oldRec.getValue({ fieldId: "custrecord_advs_l_h_status" });
				var status = newRec.getValue({ fieldId: "custrecord_advs_l_h_status" });
				var vinId = newRec.getValue({ fieldId: "custrecord_advs_la_vin_bodyfld" });
				var famLink = newRec.getValue({ fieldId: "custrecord_advs_l_h_fixed_ass_link" }) || "";
				if ((status == libUtil.leaseStatus.return) && (status != oldStatus)) {
					record.submitFields({
						type: "customrecord_advs_vm",
						id: vinId,
						values: {
							"custrecord_advs_vm_reservation_status": libUtil.vmstatus.available,
							"custrecord_advs_vm_lea_hea": "",
							"custrecord_advs_truck_master_status":7 //ADDING BY SURYA TO SET DISPOSED
						}
					});


					redirect.toSuitelet({
						scriptId: 'customscript_advs_ss_dahb_open_new_scree',
						deploymentId: 'customdeploy_advs_ss_dahb_open_new_scree',
						parameters: {
							custparam_type: 1
						}
					});

				}

				if ((status == libUtil.leaseStatus.active) && (status != oldStatus)) {

					record.submitFields({
						type: "customrecord_advs_vm",
						id: vinId,
						values: {
							"custrecord_advs_fam_asset_link": famLink,
							"custrecord_advs_t_tinv_type": 2
						}
					});

				}


				var NewPlatenumber = newRec.getValue({ fieldId: "custrecord_advs_l_h_veh_plate" });

				if (NewPlatenumber) {
					var OldPlatenumber = oldRec.getValue({ fieldId: "custrecord_advs_l_h_veh_plate" });

					var DateRecObj = record.create({
						type: "customrecord_advs_st_current_date_time",
						isDynamic: true
					});

					var CurrentDate = DateRecObj.getValue({
						fieldId: "custrecord_st_current_date"
					});
					var CurrentTime = DateRecObj.getValue({
						fieldId: "custrecord_st_current_time"
					});
					var CurrentDateTime = DateRecObj.getText({
						fieldId: "custrecord_st_current_date_time"
					});

					// log.error("CurrentDateTime-> ", CurrentDateTime);


					if (NewRecId) {
						var LeaseAgreementObj = record.load({
							type: "customrecord_advs_lease_header",
							id: NewRecId,
							isDynamic: true
						});

						LeaseAgreementObj.setValue({
							fieldId: "custrecord_advs_l_plate_filled_by",
							value: UserId
						});
						LeaseAgreementObj.setValue({
							fieldId: "custrecord_advs_l_plate_filled_date",
							value: CurrentDateTime
						});

						LeaseAgreementObj.setValue({
							fieldId: "custrecordadvs_l_old_plate_no",
							value: OldPlatenumber
						});

						LeaseAgreementObj.save({
							enableSourcing: true,
							ignoreMandatoryFields: true
						});
						//
						var PlateHistoryRecObj = record.create({
							type: 'customrecord_advs_plate_no_history',
							isDynamic: true
						});

						PlateHistoryRecObj.setValue({
							fieldId: "custrecord_advs_vm_link",
							value: vinId
						});
						PlateHistoryRecObj.setValue({
							fieldId: "custrecord_advs_np_his",
							value: NewPlatenumber
						});
						PlateHistoryRecObj.setValue({
							fieldId: "custrecord_advs_op_his",
							value: OldPlatenumber
						});
						PlateHistoryRecObj.setValue({
							fieldId: "custrecord_advs_ub_his",
							value: UserId
						});
						PlateHistoryRecObj.setValue({
							fieldId: "custrecord_advs_dt_his",
							value: CurrentDateTime
						});

						var PlateHistoryRecId = PlateHistoryRecObj.save({
							enableSourcing: true,
							ignoreMandatoryFields: true
						});
						log.debug("vinId-> " + vinId, "NewPlatenumber-> " + NewPlatenumber + ", PlateHistoryRecId-> " + PlateHistoryRecId);
					}


				}



			}
			log.debug('type',type);
			if (type == "xedit" ){ //|| type == "xedit"
				var leaserec =   record.load({
					type: "customrecord_advs_lease_header",
					id: NewRecId,
					isDynamic: true
				});
				var status = leaserec.getValue({ fieldId: "custrecord_advs_l_h_status" });
				var vinId = leaserec.getValue({ fieldId: "custrecord_advs_la_vin_bodyfld" });
				log.debug('vinId',vinId);
				if(status==7){//terminated
					var lesseename = leaserec.getValue({ fieldId: "custrecord_advs_l_h_customer_name" });
					var titlerest = leaserec.getValue({ fieldId: "custrecord_advs_title_rest" });
					var purchaseprice = leaserec.getValue({ fieldId: "custrecord_advs_l_h_pur_opti" });
					var catalogue = findCatalogueWithVin(vinId)
					var paidinfullobj = {};
					paidinfullobj.custrecord_advs_status_pif = 1;
					paidinfullobj.custrecord_advs_pif_vin = vinId;
					paidinfullobj.custrecord_advs_lessee_name_pif = lesseename;
					paidinfullobj.custrecord_advs_pif_lease = NewRecId;
					paidinfullobj.custrecord_advs_title_res_pif = titlerest;
					paidinfullobj.custrecord_advs_purchase_pif = purchaseprice;
					paidinfullobj.custrecord_advs_catalog_numb_pif = catalogue;
					createPaidInFullRecord(paidinfullobj);
				}
			}
		}
		function fetchforReturn(scriptContext) {
			var currec = scriptContext.newRecord;
			var id = currec.id;

			var form = scriptContext.form;


			form.removeButton("customize")

		}
		function isDocusignCompleted(recid) {
			try {
				var customrecord_docusign_envelope_statusSearchObj = search.create({
					type: "customrecord_docusign_envelope_status",
					filters:
						[
							["custrecord_docusign_recordid", "is", recid],
							"AND",
							["custrecord_docusign_recordtype", "startswith", "customrecord_advs_lease_header"],
							"AND",
							["custrecord_docusign_status", "is", "completed"],
							"AND",
							["isinactive", "is", "F"]
						],
					columns:
						[
							"name",
							"id",
							"custrecord_docusign_status"
						]
				});
				var searchResultCount = customrecord_docusign_envelope_statusSearchObj.runPaged().count;
				return searchResultCount;

			} catch (e) {
				log.debug('error', e.toString());
			}
		}
		function isAdobeSignCompleted(recid) {
			try {
				var customrecord_echosign_agreementSearchObj = search.create({
					type: "customrecord_echosign_agreement",
					filters:
						[
							["custrecord_echosign_parent_record", "is", recid],
							"AND",
							["custrecord_echosign_status", "anyof", "3"]
						],
					columns:
						[
							"name",
							"internalid"
						]
				});
				var searchResultCount = customrecord_echosign_agreementSearchObj.runPaged().count;
				log.debug("customrecord_echosign_agreementSearchObj result count", searchResultCount);

				var searchResultCount = customrecord_echosign_agreementSearchObj.runPaged().count;
				return searchResultCount;

			} catch (e) {
				log.debug('error', e.toString());
			}
		}
		function showMessageOnLoad(scriptContext, messagedisp) {
			scriptContext.form.addPageInitMessage({
				type: message.Type.ERROR,
				title: "<b style='display:none;'>!</b>",
				message: "<b style='font-size:18px;color:black;'>" + messagedisp + "</b>"
			});
		}
		function getDeliveryBoardData(LeaseVin, newRec) {
			var del_boardSearchObj = search.create({
				type: "customrecord_advs_vm_inv_dep_del_board",
				filters:
					[
						["custrecord_advs_in_dep_vin", "anyof", LeaseVin],
						"AND",
						["isinactive", "is", "F"]
					],
				columns:
					[
						search.createColumn({ name: "custrecord_advs_in_dep_registration_fee", label: "Registration Fee" }),
						search.createColumn({ name: "custrecord_advs_in_dep_title_fee", label: "Title Fee" }),
						search.createColumn({ name: "custrecord_advs_in_dep_pickup_fee", label: "Pickup Fee" })
					]
			});
			var RecMach = 'recmachcustrecord_advs_l_o_f_lease_link';
			var RegItem = '5190', TitleFeeItem = '5191', PickupFeeItem = '5189';
			del_boardSearchObj.run().each(function (result) {
				var RegFee = result.getValue({
					name: 'custrecord_advs_in_dep_registration_fee'
				});
				var TitleFee = result.getValue({
					name: 'custrecord_advs_in_dep_title_fee'
				});
				var PickupFee = result.getValue({
					name: 'custrecord_advs_in_dep_pickup_fee'
				});
				if (RegFee > 0) {
					newRec.insertLine({ sublistId: RecMach, line: 0 });
					newRec.setSublistValue({
						sublistId: RecMach,
						fieldId: "custrecord_advs_l_o_f_item",
						line: 0,
						value: RegItem
					});
					newRec.setSublistValue({
						sublistId: RecMach,
						fieldId: "custrecord_advs_l_o_f_rate",
						line: 0,
						value: RegFee
					});
				}
				if (TitleFee > 0) {
					newRec.insertLine({ sublistId: RecMach, line: 0 });
					newRec.setSublistValue({
						sublistId: RecMach,
						fieldId: "custrecord_advs_l_o_f_item",
						line: 0,
						value: TitleFeeItem
					});
					newRec.setSublistValue({
						sublistId: RecMach,
						fieldId: "custrecord_advs_l_o_f_rate",
						line: 0,
						value: TitleFee
					});
				}
				if (PickupFee > 0) {
					newRec.insertLine({ sublistId: RecMach, line: 0 });
					newRec.setSublistValue({
						sublistId: RecMach,
						fieldId: "custrecord_advs_l_o_f_item",
						line: 0,
						value: PickupFeeItem
					});
					newRec.setSublistValue({
						sublistId: RecMach,
						fieldId: "custrecord_advs_l_o_f_rate",
						line: 0,
						value: PickupFee
					});
				}
				return true;
			});
		}
		function findCatalogueWithVin(vin){
			try{
				var customrecord_advs_title_dashboardSearchObj = search.create({
					type: "customrecord_advs_title_dashboard",
					filters:
						[
							["custrecord_advs_td_vin","anyof",vin],
							"AND",
							["isinactive","is","F"]
						],
					columns:
						[
							"custrecord_advs_td_catalog_number",
							"internalid"
						]
				});
				var searchResultCount = customrecord_advs_title_dashboardSearchObj.runPaged().count;
				 var catalogueid  =0;
				customrecord_advs_title_dashboardSearchObj.run().each(function(result){
					// .run().each has a limit of 4,000 results
					catalogueid = result.getValue({ name: 'internalid' });
					return true;
				});
				return catalogueid;
			}catch (e){log.debug('error in findcatalogue',e.toString())}
		}
		function createPaidInFullRecord(obj){
			try{
				log.debug('obj in createPaidInFullRecord',obj);
				var exists = findExistingPaidinFullRecord(obj.custrecord_advs_pif_vin,obj.custrecord_advs_pif_lease);
				if(exists==0){
					const rec = record.create({ type: 'customrecord_advs_paid_in_full',isDynamic:true });
					rec.setValue('custrecord_advs_status_pif', obj.custrecord_advs_status_pif);
					rec.setValue('custrecord_advs_pif_vin', obj.custrecord_advs_pif_vin);
					rec.setValue('custrecord_advs_lessee_name_pif',obj.custrecord_advs_lessee_name_pif);
					rec.setValue('custrecord_advs_pif_lease', obj.custrecord_advs_pif_lease);
					rec.setValue('custrecord_advs_purchase_pif', obj.custrecord_advs_purchase_pif);
					rec.setValue('custrecord_advs_catalog_numb_pif', obj.custrecord_advs_catalog_numb_pif);
					rec.setValue('custrecord_advs_title_res_pif', obj.custrecord_advs_title_res_pif);
					// rec.setValue('custrecord_advs_sales_tax_pif', req.parameters.custpage_sales_tax);
					// rec.setValue('custrecord_advs_pif_bos', req.parameters.custpage_bos_date);
					// rec.setValue('custrecord_advs_date_sent_pif', req.parameters.custpage_date_sent);
					// rec.setValue('custrecord_advs_transfer_type_pif', req.parameters.custpage_transfer_type);
					// rec.setValue('custrecord_advs_track_num_pif', req.parameters.custpage_tracking);

					const recId = rec.save();
				}


			}catch (e){
				log.debug('error in createPaidInFullRecord',e.toString());
			}
		}
		function findExistingPaidinFullRecord(vin,lease)
		{
			try{
				var customrecord_advs_paid_in_fullSearchObj = search.create({
					type: "customrecord_advs_paid_in_full",
					filters:
						[
							["custrecord_advs_pif_vin","anyof",vin],
							"AND",
							["custrecord_advs_pif_lease","anyof",lease],
							"AND",
							["isinactive","is","F"]
						],
					columns:
						[
							"internalid"
						]
				});
				var searchResultCount = customrecord_advs_paid_in_fullSearchObj.runPaged().count;
				 return searchResultCount;
			}catch (e)
			{
				log.debug('error',e.toString());
			}
		}
		return { beforeLoad, beforeSubmit, afterSubmit }

	});//
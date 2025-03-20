/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/runtime', 'N/file', 'N/encode','N/url', 'N/redirect', 'N/url', 'N/format'],
		/**
		 * @param {record} record
		 * @param {search} search
		 * @param {serverWidget} serverWidget
		 */
		function(record, search, serverWidget, runtime, file, encode,ur, redirect, url, format) {

	/**
	 * Definition of the Suitelet script trigger point.
	 *
	 * @param {Object} context
	 * @param {ServerRequest} context.request - Encapsulation of the incoming request
	 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
	 * @Since 2015.2
	 */
	function onRequest(scriptContext) {
		var request = scriptContext.request;
		var response = scriptContext.response;
		if(request.method == "GET") {
			var form        = serverWidget.createForm({title:"Create Deposit",hideNavBar:true});
			var VehicleIDpop   = request.parameters.vinid;
			var DepositIncp = request.parameters.depinception;
			var PaymentIncp = request.parameters.Paymentincept;			         	
			var VehicleID1   = request.parameters.custparam_vinid;           
			var custId1     = request.parameters.custparam_custid;

			if(VehicleIDpop){
				var VehicleID = VehicleIDpop
			}else{
				var VehicleID = VehicleID1
			}
			var CustSubsi = '', VEhLocation = ''; 
			var VinLookup = search.lookupFields({
				type: 'customrecord_advs_vm',
				id: VehicleID,
				columns: ['custrecord_advs_vm_subsidary', 
					'custrecord_advs_vm_location_code', 
					'custrecord_advs_vm_customer_number', 
					'custrecord_advs_vm_date_truck_ready']
			});


			if(VinLookup.custrecord_advs_vm_subsidary[0] != null && VinLookup.custrecord_advs_vm_subsidary[0] != undefined){
				var CustSubsi   = VinLookup.custrecord_advs_vm_subsidary[0].value;
			}

			if(VinLookup.custrecord_advs_vm_location_code[0] != null && VinLookup.custrecord_advs_vm_location_code[0] != undefined){
				var VEhLocation = VinLookup.custrecord_advs_vm_location_code[0].value;
			}

			if(VinLookup.custrecord_advs_vm_customer_number[0] != null && VinLookup.custrecord_advs_vm_customer_number[0] != undefined){
				var VEhCustId = VinLookup.custrecord_advs_vm_customer_number[0].value;
			}

			if(VinLookup.custrecord_advs_vm_date_truck_ready[0] != null && VinLookup.custrecord_advs_vm_date_truck_ready[0] != undefined){
				var VEhpurchaseBillDate = VinLookup.custrecord_advs_vm_date_truck_ready[0].value;
			}
			var dboardobj = getDeliveryBoardData(VehicleID);
			var remainbal = dboardobj.remainbal;
			var deliveryrecid = dboardobj.recid;
			var totalinceptionSP = dboardobj.totalinception;
			var salesId = '';
			if(VEhCustId){
				var CustomerLookup = search.lookupFields({
					type: 'customer',
					id: VEhCustId,
					columns: ['salesrep']
				});

				if(CustomerLookup.salesrep[0] != null && CustomerLookup.salesrep[0] != undefined){
					salesId = CustomerLookup.salesrep[0].value;
				}
			}

			var Customerfld = form.addField({id:"custpage_create_deposit_customer", label:"Customer", type:serverWidget.FieldType.SELECT, source: "customer"});
			Customerfld.isMandatory = true;
			if(VEhCustId){
				Customerfld.defaultValue = VEhCustId
			}
			Customerfld.updateBreakType({
				breakType: serverWidget.FieldBreakType.STARTROW
			});


			var Vinfld      = form.addField({id:"custpage_create_deposit_vinid", label:"Vin", type:serverWidget.FieldType.SELECT, source: "customrecord_advs_vm"});
			Vinfld.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
			if(VehicleID){
				Vinfld.defaultValue = VehicleID;
			}

			var Datefld      = form.addField({id:"custpage_create_deposit_date", label:"Purchase Bill Date", type:serverWidget.FieldType.DATE});
			Datefld.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
			if(VEhpurchaseBillDate){
				Datefld.defaultValue = VEhpurchaseBillDate;
			}

			var locfld      = form.addField({id:"custpage_create_deposit_location", label:"Location", type:serverWidget.FieldType.SELECT, source: "location"});
			locfld.updateDisplayType({displayType: serverWidget.FieldDisplayType.DISABLED});
			if(VEhLocation){
				locfld.defaultValue = VEhLocation;
			}

			var Subsifld  =   form.addField({id:"custpage_create_deposit_subsidiary", label:"Subsidiary", type:serverWidget.FieldType.SELECT, source: "subsidiary"});
			if(CustSubsi){
				Subsifld.defaultValue = CustSubsi;
			}
			Subsifld.isMandatory = true;

			var SalesRepfld  =   form.addField({id:"custpage_create_deposit_salesrep", label:"Sales Rep", type:serverWidget.FieldType.SELECT, source: 'employee'});
			if(salesId){
				SalesRepfld.defaultValue = salesId;
			}
			var SalesQuotefld  =   form.addField({id:"custpage_create_sales_quote", label:"Sales Quote", type:serverWidget.FieldType.CHECKBOX});
			SalesQuotefld.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
			
			var registrationFeesfld  =   form.addField({id:"custpage_create_deposit_registrationfee", label:"Registration Fee", type:serverWidget.FieldType.CURRENCY});
			//registrationFeesfld.isMandatory = true;
			registrationFeesfld.updateBreakType({
				breakType: serverWidget.FieldBreakType.STARTCOL
			});
			
			var titleFeesfld  =   form.addField({id:"custpage_create_deposit_titlefee", label:"Title Fee", type:serverWidget.FieldType.CURRENCY});
			//titleFeesfld.isMandatory = true;
			
			
			
			var pickupFeefld  =   form.addField({id:"custpage_create_deposit_pickupfee", label:"Pickup Fee", type:serverWidget.FieldType.CURRENCY});
			//pickupFeefld.isMandatory = true;
			
			
			
			var Amountfld  =   form.addField({id:"custpage_create_deposit_amount", label:"Deposit Amount", type:serverWidget.FieldType.CURRENCY});
			Amountfld.isMandatory = true;
			

			var DepositInc  =   form.addField({id:"custpage_create_deposit_inception", label:"Deposit Inception", type:serverWidget.FieldType.CURRENCY});
			DepositInc.updateDisplayType({displayType: serverWidget.FieldDisplayType.DISABLED});
			DepositInc.updateBreakType({
				breakType: serverWidget.FieldBreakType.STARTCOL
			});
			if(DepositIncp){
				DepositInc.defaultValue = DepositIncp;
			}
			var PaymentInc =   form.addField({id:"custpage_create_payment_inception", label:"Payment Inception", type:serverWidget.FieldType.CURRENCY});
			PaymentInc.updateDisplayType({displayType: serverWidget.FieldDisplayType.DISABLED});
			if(PaymentIncp){
				PaymentInc.defaultValue = PaymentIncp;
			}

			var TotalInceptionFld = form.addField({
				id:"custpage_create_depo_total_inception",
				label:"Total Inception",
				type:serverWidget.FieldType.CURRENCY
			});
			TotalInceptionFld.updateDisplayType({displayType: serverWidget.FieldDisplayType.DISABLED});
			
			var RemainingBalFld = form.addField({
				id:"custpage_create_depo_remaining_bal",
				label:"Remaining Balance",
				type:serverWidget.FieldType.CURRENCY
			});
			RemainingBalFld.defaultValue = remainbal;
			RemainingBalFld.updateDisplayType({displayType: serverWidget.FieldDisplayType.DISABLED});
			
			var deliverybFld = form.addField({
				id:"custpage_create_depo_devbrecid",
				label:"Delivery Board",
				type:serverWidget.FieldType.TEXT
			});
			deliverybFld.defaultValue = deliveryrecid;
			deliverybFld.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
			
			
			
			if(!DepositIncp){DepositIncp = 0}
			if(!PaymentIncp){PaymentIncp = 0}
			var totalInceptionValue = (DepositIncp*1)+(PaymentIncp*1);
			log.debug('deliveryrecid'+deliveryrecid,'totalinceptionSP'+totalinceptionSP+'deliveryrecid-->'+(deliveryrecid!=''));
			if(deliveryrecid!=''){ 
				TotalInceptionFld.defaultValue = totalinceptionSP;
			}else{
				TotalInceptionFld.defaultValue = totalInceptionValue;
			}
			

			form.addSubmitButton({id: 'custpage_create_button', label: 'SUBMIT'});
			 form.clientScriptModulePath = "./cs_customer_deposit.js";
			response.writePage(form);
		}else{

			var Customerid   = request.parameters.custpage_create_deposit_customer;
			var SubsiId      = request.parameters.custpage_create_deposit_subsidiary;
			var LocId        = request.parameters.custpage_create_deposit_location;
			var AmountValue  = request.parameters.custpage_create_deposit_amount;
			var VinId        = request.parameters.custpage_create_deposit_vinid;
			var SalesrepID   = request.parameters.custpage_create_deposit_salesrep;
			var SalesQuote   = request.parameters.custpage_create_sales_quote;
			var purchaseBillDate   = request.parameters.custpage_create_deposit_date;
			var depositIncep = request.parameters.custpage_create_deposit_inception;
			var PaymentIncep = request.parameters.custpage_create_payment_inception;
			var totalinceptionvalSP = request.parameters.custpage_create_depo_total_inception;
			var registratioFee = request.parameters.custpage_create_deposit_registrationfee||0;
			var TitleFee = request.parameters.custpage_create_deposit_titlefee||0;
			var PickupFee = request.parameters.custpage_create_deposit_pickupfee||0;
			var RemainingBal = request.parameters.custpage_create_depo_remaining_bal;
			log.debug('totalinceptionvalSP',totalinceptionvalSP); 
			var CreateDeposit = record.create({type: 'customerdeposit', isDynamic: true});
			CreateDeposit.setValue({fieldId: 'customer', value: Customerid});
			CreateDeposit.setValue({fieldId: 'custbody_advs_vin_create_deposit', value: VinId});
			CreateDeposit.setValue({fieldId: 'payment', value: AmountValue});
			CreateDeposit.setValue({fieldId: 'subsidiary', value: SubsiId});
			CreateDeposit.setValue({fieldId: 'custbody_registration_fee', value: registratioFee});
			CreateDeposit.setValue({fieldId: 'custbody_title_fee', value: TitleFee});
			CreateDeposit.setValue({fieldId: 'custbody_pickup_fee', value: PickupFee});
			CreateDeposit.setValue({fieldId: 'custbody_remaining_balance', value: RemainingBal});
			var CreateDepositID = CreateDeposit.save({enableSourcing: true, ignoreMandatoryFields: true});

			/*			if(Customerid){
				var paymentRec = record.create({type: "customerpayment", isDynamic: true});
				paymentRec.setValue({fieldId: "customer", value: Customerid});
				// paymentRec.setValue({fieldId: "subsidiary", value: to_subsi});
				paymentRec.setValue({fieldId: "trandate", value: Today});
				paymentRec.setValue({fieldId: "payment", value: AmountValue});
				var paymentID = paymentRec.save({enableSourcing: true, ignoreMandatoryFields: true});
			}*/


			if(CreateDepositID){
				var delboarobj = getDeliveryBoardData(VinId);
				var DelBoardId = delboarobj.recid;
				log.debug('DelBoardId',DelBoardId);
				var DepositValue = 0; 
				var TotalInceptionValue = totalinceptionvalSP//(depositIncep*1)+(PaymentIncep*1);
				TotalInceptionValue = TotalInceptionValue*1;
				TotalInceptionValue = TotalInceptionValue.toFixed(2);
				//TotalInceptionValue = (TotalInceptionValue*1)+((TitleFee*1)+(PickupFee*1)+(registratioFee*1));
				if(DelBoardId){
					var DepoRecord = record.load({
						type: 'customrecord_advs_vm_inv_dep_del_board',
						id: DelBoardId,
						isDynamic: true
						});
					DepositValue = DepoRecord.getValue({fieldId: 'custrecord_advs_in_dep_deposit'});
				}else{
					var DepoRecord = record.create({type: 'customrecord_advs_vm_inv_dep_del_board', isDynamic: true});
					if(VinId){
						DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_vin', value: VinId});
					}
					if(LocId){
						DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_location', value: LocId});
					}
					if(depositIncep){
						DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_inception', value: depositIncep});
					}
					if(PaymentIncep){
						DepoRecord.setValue({fieldId: 'custrecord_advs_in_payment_inception', value: PaymentIncep});
					}
					if(SalesrepID){
						DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_sales_rep', value: SalesrepID});
					}
					DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_tot_lease_incepti', value: TotalInceptionValue});
					DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_registration_fee', value: registratioFee});
					DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_title_fee', value: TitleFee});
					DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_pickup_fee', value: PickupFee});
				}
				log.debug('DepositValue',DepositValue);
				log.debug('AmountValue',AmountValue);
				var TotalDeposit = (DepositValue*1)+(AmountValue*1);
				TotalDeposit = TotalDeposit*1;
				TotalDeposit = TotalDeposit.toFixed(2);
				
				//ADDING FEES
				
					log.debug('TotalDeposit',TotalDeposit);
					log.debug('TotalInceptionValue',TotalInceptionValue);
				var BalanceValue = (TotalInceptionValue*1)-(TotalDeposit*1);
				BalanceValue = BalanceValue*1;
				BalanceValue = BalanceValue.toFixed(2);
				log.debug('BalanceValue',BalanceValue);
				if(Customerid){
					DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_name', value: Customerid});
				}
				if(AmountValue){
					DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_deposit', value: TotalDeposit});
				}
				if(CreateDepositID){
					DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_trans_link', value: CreateDepositID});
				}
				DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_balance', value: BalanceValue});  
				var DepoRecordID = DepoRecord.save({enableSourcing: true, ignoreMandatoryFields: true});
			}

			if(DepoRecordID){
				record.submitFields({
					type: 'customrecord_advs_vm',
					id: VinId,
					values: {'custrecord_advs_lease_inventory_delboard': true},
					options: {
						enableSourcing: true,
						ignoreMandatoryFields: true
					}
				});
			}


			var onclickScript = " <html><body> <script type='text/javascript'>";

			onclickScript += "try{";

			onclickScript += "window.opener.location.reload();"
				onclickScript += "window.close()"; //window.close();
			onclickScript += "}catch(e){}</script></body></html>";



			response.write(onclickScript);
		}
	}

	function getDeliveryBoardData(VinId){
		var RecordId = '';
		var obj={};
		obj.recid = RecordId;
		obj.remainbal = 0;
		var SearchObj = search.create({
			type: 'customrecord_advs_vm_inv_dep_del_board',
			filters:[
				['isinactive','is','F'],
				'AND',
				['custrecord_advs_in_dep_balance','greaterthan',0],
				'AND',
				['custrecord_advs_in_dep_vin','anyof',VinId]
			],
			columns: [
				'internalid',
				"custrecord_advs_in_dep_balance",
				"custrecord_advs_in_dep_tot_lease_incepti"
			]
		});
		SearchObj.run().each(function (result) { 
			RecordId = result.getValue('internalid');
			var remainbalance = result.getValue('custrecord_advs_in_dep_balance');
			var TotalInceptionValue = result.getValue('custrecord_advs_in_dep_tot_lease_incepti');
			obj.recid = RecordId;
			obj.remainbal = remainbalance;
			obj.totalinception = TotalInceptionValue;
			return true;
		});
		log.debug('obj',obj);
		return obj;
	}
	return {
		onRequest: onRequest
	};

});
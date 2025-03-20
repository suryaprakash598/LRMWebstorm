/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Sep 2015     EVTL_L002
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type){ 
var ptptype  = nlapiGetFieldValue('custpage_ptp_type');
var cardfield = nlapiGetField('custpage_credit_cards'); // specifiy the internalId of the Memo field
cardfield.setDisplayType('hidden'); 
}


function clientFieldChange(type, name){
	var deal_id = nlapiGetFieldValue('custpage_select');
	var title = nlapiGetFieldValue('custpage_title');
	var date = nlapiGetFieldValue('custpage_date');
	var ptp = nlapiGetFieldValue('custpage_ptp_amount');
	var critical = nlapiGetFieldValue('custpage_critical');
	var bro_promise = nlapiGetFieldValue('custpage_broken_promise');
	var gps_fld = nlapiGetFieldValue('custpage_gps_fld');
	var ofe_fld = nlapiGetFieldValue('custpage_ofe_fld');
	var impounded_fld = nlapiGetFieldValue('custpage_impounded_fld');
	var ofr_id = nlapiGetFieldValue('custpage_ofr_link');
	var lease_pay = nlapiGetFieldValue('custpage_lease_pay_off');
	var ptp_flag = nlapiGetFieldValue('custpage_ptpflag');		// 
	
	if(ofr_id == null || ofr_id == 'null'){
		ofr_id='';
	}
	var customer = nlapiGetFieldValue('custpage_entity');
	var assign = nlapiGetFieldValue('custpage_assigned_to');
	var deal_no = nlapiGetFieldValue('custpage_deal_id');
	var temp = nlapiGetFieldValue('custpage_temp');
	var insurance_flag = nlapiGetFieldValue('custpage_insurance_fld');
	var insurance_no = nlapiGetFieldValue('custpage_insurance_no');
	if(name == 'custpage_select')
	{		
		if(deal_id != null && deal_id != '' && deal_id != undefined)
		{
			var url = nlapiResolveURL('SUITELET', 'customscript_ssst_create_task_pop_up', 'customdeploy_ssst_create_task_pop_up', null);
			setWindowChanged(window, false);
			window.location =  url+'&deal_id='+deal_id+'&title='+title+'&date='+date+'&ptp='+ptp+'&critical='+critical+'&bro_promise='+bro_promise+'&custparam_cust='+customer+'&assigned='+assign+'&deal_no='+deal_no+'&custparam_cust='+temp+'&gps_fld='+gps_fld+'&ofe_fld='+ofe_fld+'&impounded_fld='+impounded_fld+'&ofr_id='+ofr_id+'&lease_pay='+lease_pay+'&insurance_claim='+insurance_flag+'&insurance_claim_id='+insurance_no+'&cutparam_ptp='+ptp_flag+'';
		}
	}
	if(name =='custpage_insurance_fld'){
//		if(insurance_flag == 'T'){
			critical = 'T';
			gps_fld = 'F';
			ofe_fld = 'F';
			impounded_fld = 'F';
			lease_pay='F';
			bro_promise = 'F';
			var url = nlapiResolveURL('SUITELET', 'customscript_ssst_create_task_pop_up', 'customdeploy_ssst_create_task_pop_up', null);
			setWindowChanged(window, false);
			window.location =  url+'&deal_id='+deal_id+'&title='+title+'&date='+date+'&ptp='+ptp+'&critical='+critical+'&bro_promise='+bro_promise+'&custparam_cust='+customer+'&assigned='+assign+'&deal_no='+deal_no+'&custparam_cust='+temp+'&gps_fld='+gps_fld+'&ofe_fld='+ofe_fld+'&impounded_fld='+impounded_fld+'&ofr_id='+ofr_id+'&lease_pay='+lease_pay+'&insurance_claim='+insurance_flag+'&insurance_claim_id='+insurance_no+'&cutparam_ptp='+ptp_flag+'';
//		}
	}
	if(name == 'custpage_broken_promise'){
		if(bro_promise == 'T'){
			critical = 'T';
			gps_fld = 'F';
			ofe_fld = 'F';
			impounded_fld = 'F';
			lease_pay='F';
			insurance_flag = 'F';
			var url = nlapiResolveURL('SUITELET', 'customscript_ssst_create_task_pop_up', 'customdeploy_ssst_create_task_pop_up', null);
			setWindowChanged(window, false);
			window.location =  url+'&deal_id='+deal_id+'&title='+title+'&date='+date+'&ptp='+ptp+'&critical='+critical+'&bro_promise='+bro_promise+'&custparam_cust='+customer+'&assigned='+assign+'&deal_no='+deal_no+'&custparam_cust='+temp+'&gps_fld='+gps_fld+'&ofe_fld='+ofe_fld+'&impounded_fld='+impounded_fld+'&ofr_id='+ofr_id+'&lease_pay='+lease_pay+'&insurance_claim='+insurance_flag+'&insurance_claim_id='+insurance_no+'&cutparam_ptp='+ptp_flag+'';
		}
	}
	if(name == 'custpage_gps_fld'){
		if(gps_fld == 'T'){
			critical = 'T';
			bro_promise = 'F';
			ofe_fld = 'F';
			impounded_fld = 'F';
			lease_pay='F';
			insurance_flag = 'F';
			var url = nlapiResolveURL('SUITELET', 'customscript_ssst_create_task_pop_up', 'customdeploy_ssst_create_task_pop_up', null);
			setWindowChanged(window, false);
			window.location =  url+'&deal_id='+deal_id+'&title='+title+'&date='+date+'&ptp='+ptp+'&critical='+critical+'&bro_promise='+bro_promise+'&custparam_cust='+customer+'&assigned='+assign+'&deal_no='+deal_no+'&custparam_cust='+temp+'&gps_fld='+gps_fld+'&ofe_fld='+ofe_fld+'&impounded_fld='+impounded_fld+'&ofr_id='+ofr_id+'&lease_pay='+lease_pay+'&insurance_claim='+insurance_flag+'&insurance_claim_id='+insurance_no+'&cutparam_ptp='+ptp_flag+'';
		}
	}
	if(name == 'custpage_ptp_amount'){
		if(ptp != null && ptp !='' && ptp >0){
			critical = 'T';
			bro_promise = 'F';
			ofe_fld = 'F';
			impounded_fld = 'F';
			gps_fld = 'F';
			lease_pay='F';
			insurance_flag = 'F';
			var url = nlapiResolveURL('SUITELET', 'customscript_ssst_create_task_pop_up', 'customdeploy_ssst_create_task_pop_up', null);
			setWindowChanged(window, false);
			window.location =  url+'&deal_id='+deal_id+'&title='+title+'&date='+date+'&ptp='+ptp+'&critical='+critical+'&bro_promise='+bro_promise+'&custparam_cust='+customer+'&assigned='+assign+'&deal_no='+deal_no+'&custparam_cust='+temp+'&gps_fld='+gps_fld+'&ofe_fld='+ofe_fld+'&impounded_fld='+impounded_fld+'&ofr_id='+ofr_id+'&lease_pay='+lease_pay+'&insurance_claim='+insurance_flag+'&insurance_claim_id='+insurance_no+'&cutparam_ptp='+ptp_flag+'';
		}
	}
	if(name == 'custpage_ofe_fld'){
		if(ofe_fld == 'T'){
			critical = 'T';
			bro_promise = 'F';
			gps_fld = 'F';
			impounded_fld = 'F';
			lease_pay='F';
			insurance_flag = 'F';
			var url = nlapiResolveURL('SUITELET', 'customscript_ssst_create_task_pop_up', 'customdeploy_ssst_create_task_pop_up', null);
			setWindowChanged(window, false);
			window.location =  url+'&deal_id='+deal_id+'&title='+title+'&date='+date+'&ptp='+ptp+'&critical='+critical+'&bro_promise='+bro_promise+'&custparam_cust='+customer+'&assigned='+assign+'&deal_no='+deal_no+'&custparam_cust='+temp+'&gps_fld='+gps_fld+'&ofe_fld='+ofe_fld+'&impounded_fld='+impounded_fld+'&ofr_id='+ofr_id+'&lease_pay='+lease_pay+'&insurance_claim='+insurance_flag+'&insurance_claim_id='+insurance_no+'&cutparam_ptp='+ptp_flag+'';
		}
	}
	if(name == 'custpage_impounded_fld'){
		if(impounded_fld == 'T'){
			critical = 'T';
			gps_fld = 'F';
			ofe_fld = 'F';
			bro_promise = 'F';
			lease_pay='F';
			insurance_flag = 'F';
			var url = nlapiResolveURL('SUITELET', 'customscript_ssst_create_task_pop_up', 'customdeploy_ssst_create_task_pop_up', null);
			setWindowChanged(window, false);
			window.location =  url+'&deal_id='+deal_id+'&title='+title+'&date='+date+'&ptp='+ptp+'&critical='+critical+'&bro_promise='+bro_promise+'&custparam_cust='+customer+'&assigned='+assign+'&deal_no='+deal_no+'&custparam_cust='+temp+'&gps_fld='+gps_fld+'&ofe_fld='+ofe_fld+'&impounded_fld='+impounded_fld+'&ofr_id='+ofr_id+'&lease_pay='+lease_pay+'&insurance_claim='+insurance_flag+'&insurance_claim_id='+insurance_no+'&cutparam_ptp='+ptp_flag+'';
		}
	}
	
	if(name == 'custpage_lease_pay_off'){
		if(lease_pay == 'T'){
			critical = 'T';
			gps_fld = 'F';
			ofe_fld = 'F';
			bro_promise = 'F';
			impounded_fld = 'F';
			insurance_flag = 'F';
			var url = nlapiResolveURL('SUITELET', 'customscript_ssst_create_task_pop_up', 'customdeploy_ssst_create_task_pop_up', null);
			setWindowChanged(window, false);
			window.location =  url+'&deal_id='+deal_id+'&title='+title+'&date='+date+'&ptp='+ptp+'&critical='+critical+'&bro_promise='+bro_promise+'&custparam_cust='+customer+'&assigned='+assign+'&deal_no='+deal_no+'&custparam_cust='+temp+'&gps_fld='+gps_fld+'&ofe_fld='+ofe_fld+'&impounded_fld='+impounded_fld+'&ofr_id='+ofr_id+'&lease_pay='+lease_pay+'&insurance_claim='+insurance_flag+'&insurance_claim_id='+insurance_no+'&cutparam_ptp='+ptp_flag+'';
		}
	}
	
	if(name=='custpage_ptp_type')
	{
		debugger;
		var ptptype  = nlapiGetFieldValue('custpage_ptp_type');
		if(ptptype==2){
			var cardfield = nlapiGetField('custpage_credit_cards'); // specifiy the internalId of the Memo field
			cardfield.setDisplayType('normal',true);
			//NS.jQuery('#custpage_credit_cards').toggle();
		}else{
			var cardfield = nlapiGetField('custpage_credit_cards'); // specifiy the internalId of the Memo field
			cardfield.setDisplayType('hidden');
		}
		
	}
}

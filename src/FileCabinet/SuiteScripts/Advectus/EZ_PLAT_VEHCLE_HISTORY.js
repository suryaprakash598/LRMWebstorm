/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Oct 2015     ultimus_03
 *
 */

/**
 * @param {nlobjPortlet} portletObj Current portlet object
 * @param {Number} column Column position index: 1 = left, 2 = middle, 3 = right
 * @returns {Void}
 */
function portletName(portletObj, column, entityid) {

	portletObj.setTitle('Vehicle History');

	var Licence_Number = nlapiLookupField('customer', entityid, 'custentity_advs_driver_license');

	var role = nlapiGetRole();
	var RFR_Permission='F';
	if(false/* role !=null && role !='' && role !=undefined */){
		var fil = new Array();
		var col = new Array();
		fil.push(new nlobjSearchFilter('custrecord_advs_sett_role', null, 'anyof', role));
		col.push(new nlobjSearchColumn('custrecord_advs_tam_rfr_permission', null, null));
		var search = nlapiCreateSearch('customrecord_advs_role_setting', fil, col);
		var run = search.runSearch();
		var cl = run.getColumns();
		run.forEachResult(function(rec) {
			RFR_Permission = rec.getValue(cl[0]);
			return true;
		});
	}

	var entityid_arr=new Array();
	if(Licence_Number !=null && Licence_Number !='' && Licence_Number !=undefined){
		var ar_filter = new Array();
		ar_filter[0] = new nlobjSearchFilter('custentity_advs_driver_license', null, 'is', Licence_Number);
		var ar_column = new Array();
		ar_column[0] = new nlobjSearchColumn('internalid');
		var search = nlapiCreateSearch('customer', ar_filter, ar_column);
		var run  = search.runSearch();
		var col = run.getColumns();
		var flag_count=0;
		run.forEachResult(function (res){
			entityid_arr.push(res.getValue(col[0]));
			flag_count++;
			return true;
		});
		if(flag_count ==0){
			entityid_arr.push(entityid*1);
		}
	}else{
		entityid_arr.push(entityid*1);
	}

//	For Insurance Flag
	var insurance_flag=0;
//	var user = nlapiGetUser();
//	if(user == 4){
	var insurance_filter = new Array();
	var insurance_col = new Array();
	insurance_filter.push(new nlobjSearchFilter('custrecord_advs_l_h_customer_name', null, 'anyof', entityid));
	//insurance_filter.push(new nlobjSearchFilter('custrecord_insurance_card_link', null, 'noneof', '@NONE@'));
	insurance_col.push(new nlobjSearchColumn('internalid'));
	var insurance_search = nlapiCreateSearch('customrecord_advs_lease_header', insurance_filter, insurance_col);
	var insurance_run = insurance_search.runSearch();
	var ins_col = insurance_run.getColumns();
	insurance_run.forEachResult(function(rec) {
		insurance_flag++;
		return true;
	});
	  var search=nlapiLoadSearch('customrecord_advs_lease_header', 'customsearch_ssmm_cus_360_vehiclehealth1');
	search.addFilter(new nlobjSearchFilter('custrecord_advs_l_h_customer_name',null,'anyof',entityid_arr));
	var run=search.runSearch();
	var cols=run.getColumns();  
	var vehicle_health=new Array();
	var vehicle_health_count=0;
	  run.forEachResult(function(rec) {
		vehicle_health[vehicle_health_count]=new Array();
		vehicle_health[vehicle_health_count]['gps_no']=rec.getValue(cols[0]);
		vehicle_health[vehicle_health_count]['last_gps_loc']=rec.getText(cols[1]);
		vehicle_health[vehicle_health_count]['last_lof']=rec.getValue(cols[2]);
		vehicle_health[vehicle_health_count]['current_mileage']=rec.getValue(cols[2]);
		vehicle_health[vehicle_health_count]['avg_mileage']=rec.getValue(cols[3]);
		vehicle_health[vehicle_health_count]['vin']=rec.getValue(cols[4]);

		vehicle_health[vehicle_health_count]['lic_plate_num']=rec.getValue(cols[5]);
		vehicle_health[vehicle_health_count]['make_model_year']=rec.getText(cols[6]);
		vehicle_health[vehicle_health_count]['mileage_record_on']=0;//rec.getValue(cols[8]);
		vehicle_health[vehicle_health_count]['plate_expiration']=''//rec.getValue(cols[9]);
		vehicle_health[vehicle_health_count]['stock_num']=rec.getValue(cols[12]);
		vehicle_health[vehicle_health_count]['image']=rec.getText(cols[8]);
		vehicle_health[vehicle_health_count]['cust_image']=rec.getText(cols[11]);
		vehicle_health[vehicle_health_count]['internalId']=rec.getValue(cols[10]);
		vehicle_health[vehicle_health_count]['custrecord_advs_vm_passtime_enabled']='T'//rec.getValue(cols[16]);
		vehicle_health[vehicle_health_count]['custrecord_advs_pass_time_veh_status']='Enabled'//rec.getText(cols[17]);
		if(rec.getValue(cols[10])!=null&&rec.getValue(cols[10])!=""&&rec.getValue(cols[10])!='null'){
			vehicle_health[vehicle_health_count]['next_lof']='';//rec.getValue(cols[11]);
		}else{
			if(rec.getValue(cols[1])!=''&&rec.getValue(cols[1])!=null&&rec.getValue(cols[2])!='null'){
				vehicle_health[vehicle_health_count]['next_lof']=''//nlapiDateToString(nlapiAddDays(nlapiStringToDate(rec.getValue(cols[2])),90));
			}
		}
		vehicle_health_count++;
		return true;
	});  

	var html="";


	html+=	"<style>";
	html+=".button_abhi {" +
	"		   border: 0px solid #0298FA;" +
	"		   background: #0298FA;" +
	"		   padding: 10px 15px;" +
	"		   -webkit-border-radius: 5px;" +
	"		   -moz-border-radius: 5px;" +
	"		   border-radius: 5px;" +
//	"		   -webkit-box-shadow: rgba(255,255,255,0.4) 0 1px 0, inset rgba(255,255,255,0.4) 0 1px 0;" +
//	"		   -moz-box-shadow: rgba(255,255,255,0.4) 0 1px 0, inset rgba(255,255,255,0.4) 0 1px 0;" +
//	"		   box-shadow: rgba(255,255,255,0.4) 0 1px 0, inset rgba(255,255,255,0.4) 0 1px 0;" +
//	"		   text-shadow: #7ea4bd 0 1px 0;" +
	"		   color: #ffffff;" +
	"		   font-size: 13px;" +
	"		   font-family: helvetica, serif;" +
	"		   text-decoration: none;" +
	"		   vertical-align: middle;" +
	"		   }" +
	"		.button_abhi:hover {" +
	"		   border: 1px solid #3aa03a;" +
	"		   text-shadow: #1e4158 0 1px 0;" +
	"		   background: #3aa03a;" +
	"		   color: #ffffff;" +
	"		   }" +
	"		.button_abhi:active {" +
	"		   text-shadow: #1e4158 0 1px 0;" +
	"		   border: 1px solid #0a3c59;" +
	"		   background: #3aa03a;" +
	"		   color: #ffffff;" +
	"		   }";	
//	}else
//	{

	html+=".button123abhi {" +
	"		   border: 0px solid #0a3c59;" +
	"		   background: #ff9900;" +
	"		   padding: 10px 15px;" +
	"		   -webkit-border-radius: 5px;" +
	"		   -moz-border-radius: 5px;" +
	"		   border-radius: 5px;" +
	"		   color: #fffff;" +
	"		   font-size: 13px;" +
	"		   font-family: helvetica, serif;" +
	"		   text-decoration: none;" +
	"		   vertical-align: middle;" +
	"		   }" +
	"		.button123abhi:hover {" +
	"		   border: 1px solid #3aa03a;" +
	"		   text-shadow: #1e4158 0 1px 0;" +
	"		   background: #3aa03a;" +
	"		   color: #ffffff;" +
	"		   }" +
	"		.button123abhi:active {" +
	"		   text-shadow: #1e4158 0 1px 0;" +
	"		   border: 1px solid #0a3c59;" +
	"		   background: #3aa03a;" +
	"		   color: #ffffff;" +
	"		   }";	

	html+=".tdnum {"+
	"color: #000000;"+
	"font-size: 18px;"+
	"width: 30px;"+
	"font-weight: bold;"+
	"text-align: center;"+
	"padding: 3px 7px;"+
//	"border-right: 1px solid #CCCCCC;"+
	"white-space: nowrap;"+
	"align:center;"+
	"}"+	
	".tdtext{"+
	"color: #ffffff;"+
	"text-align: center;"+
	"font-size: 12px;"+
	"padding-left: 5px;"+
	"height: 20px;"+
	"white-space: nowrap;"+
//	"border-right: 1px solid #CCCCCC;"+
	"}"+
	".afmt{"+
	"font-family: Arial,Helvetica,sans-serif;"+
//	"color: #255599;" +
	"text-decoration:none;"+
	"}"+
	".afmt1{"+
	"font-family: Arial,Helvetica,sans-serif;"+
	"color: #ff9900 !important;" +
	"text-decoration:none;"+
	"}"+
	".rightborder{"+
	"border-right: 2px solid #CCCCCC;"+
	"}"+
	"</style>"+
	"<script>"+
	"function popupCenter(pageURL, title,w,h) {"+
	"var left = (screen.width/2)-(w/2);"+
	"var top = (screen.height/2)-(h/2);"+
	"var targetWin = window.open (pageURL, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);"+
	"} "+
	"</script>";	   	

	var task = nlapiResolveURL('SUITELET', 'customscript_ssst_create_task_pop_up', 'customdeploy_ssst_create_task_pop_up', null);
	task += '&custparam_cust='+entityid;
	var ptp_task = nlapiResolveURL('SUITELET', 'customscript_ssst_create_task_pop_up', 'customdeploy_ssst_create_task_pop_up', null);
	ptp_task += '&custparam_cust='+entityid+'&cutparam_ptp=T';

	var email = nlapiResolveURL('SUITELET', 'customscript_ez_ssat_email_pop_up', 'customdeploy_ez_ssat_email_pop_up', null);
	email+= '&custparam_customer_id='+entityid;



	 var ar_filter = new Array();
	ar_filter[0] = new nlobjSearchFilter('internalid', 'custrecord_advs_l_h_customer_name', 'anyof', entityid);
	var search = nlapiLoadSearch('customrecord_advs_lease_header', 'customsearch_deal_list_ofr_flag');
	search.addFilters(ar_filter);
	var run = search.runSearch();
	var col = run.getColumns();
	var ofr_chk_rec=0;
	var internalID = [];
	run.forEachResult(function (res){
		internalID[ofr_chk_rec] = res.getValue(col[0]);
		ofr_chk_rec++;
		return true;
	}); 
	var ofr='';
	var ofr_color_flag='F';
	var single_deal_id = '';
	if(false){//ofr_chk_rec == 1
		var deal_c_id = internalID[0];
		single_deal_id = deal_c_id;
		if(deal_c_id !=null && deal_c_id !=''){
			var o_fil = new Array();
			var o_col = new Array();
			o_fil.push(new nlobjSearchFilter('custrecord_ofr_stock_no', null, 'anyof', deal_c_id));
//			Hem
			var ofr_status = [10,11];
			o_fil.push(new nlobjSearchFilter('custrecord_advs_ofr_ofrstatus', null, 'noneof',ofr_status));
			o_col.push(new nlobjSearchColumn('internalid'));
			var o_seaRch = nlapiCreateSearch('customrecord_lms_ofr_', o_fil, o_col);
			var o_run = o_seaRch.runSearch();
			var o_cc = o_run.getColumns();
			var ofr_deal_id='';
			o_run.forEachResult(function(rec_o) {
				ofr_deal_id = rec_o.getValue(o_cc[0]);
				return true;
			});
			if(ofr_deal_id !=null && ofr_deal_id !=''){
				ofr = nlapiResolveURL('RECORD', 'customrecord_lms_ofr_',ofr_deal_id, 'edit');
				ofr_color_flag='T';
			}else{
				ofr = nlapiResolveURL('RECORD', 'customrecord_lms_ofr_',null, 'create');
				ofr+= '&entityid='+entityid+'&deal_id='+deal_c_id;
			}
		}

	}else{
		ofr = 'www.netsuite.com';//nlapiResolveURL('SUITELET', 'customscript_ez_ssat_flag_ofr', 'customdeploy_ez_ssat_flag_ofr', null);
		ofr+= '&entityid='+entityid+'&ofr=T';
	}
//	ofr+= '&entityid='+entityid+'&ofr=T';

	var impounded = 'www.netsuite.com';//nlapiResolveURL('SUITELET', 'customscript_ez_ssat_flag_ofr', 'customdeploy_ez_ssat_flag_ofr', null);
	impounded+= '&entityid='+entityid+'&impounded=T';

	var repair_ord = 'www.netsuite.com';//nlapiResolveURL('SUITELET', 'customscript_ez_ssat_ro_customer', 'customdeploy_ez_ssat_ro_customer', null);
	repair_ord+='&entityid='+entityid;

	var repo =  'www.netsuite.com';//nlapiResolveURL('SUITELET', 'customscript_ez_ssat_deal_link', 'customdeploy_ez_ssat_deal_link', null);
	repo+='&entityid='+entityid;

	var insurance_url = 'www.netsuite.com';//nlapiResolveURL('SUITELET', 'customscript_advs_ssf_insurance_deal_sel', 'customdeploy_advs_ssf_insurance_deal_sel');
	insurance_url = insurance_url+'&custparam_customer='+entityid;

	var deal_list_Url = 'www.netsuite.com';//nlapiResolveURL('SUITELET', 'customscript_ez_cust_cust_deal_list', 'customdeploy_ez_ssat_cust_deal_list');
	deal_list_Url = deal_list_Url+'&custparam_cust_id='+entityid;
	//custparam_cust_id
	html +="<table width='100%'>" +
	"<tr><td class=border_bottom;><a href='#' onclick=\"window.open('"+deal_list_Url+"', '_blank')\" class='button_abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>Deal List</a></td>" +
	"<td class=border_bottom;><a href='#' onclick=\"window.open('"+task+"', '_blank')\" class='button_abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>Create Task</a></td>"+
	"<td class=border_bottom;><a href='#' onclick=\"window.open('"+ptp_task+"', '_blank')\" class='button_abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>PTP Task</a></td>";

	if(insurance_flag == 0){
		html +="<td class=border_bottom;><a href='#' onclick=\"window.open('"+insurance_url+"', '_blank')\" class='button_abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>Insurance Claim</a></td>";
	}else{
		html +="<td class=border_bottom;><a href='#' onclick=\"window.open('"+insurance_url+"', '_blank')\" class='button123abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>Insurance Claim</a></td>";
	}

	//	"<td class=border_bottom;><input type=button onClick=window.open('"+email+"', '_blank', 'width=1100,height=500,left=00,top=50') value='Communicate'></td>";
	html +="<td class=border_bottom; ><a href='#' onclick=\"window.open('"+email+"', '_blank', 'width=1100,height=500,left=00,top=50')\" class='button_abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>Communicate</a></td> " ;

	if(RFR_Permission =='T'){
		if(ofr_color_flag == 'T'){
			html+="<td class=border_bottom; ><a href='#' onclick=\"window.open('"+ofr+"', '_blank')\" class='button123abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>RFR</a></td> ";
		}else{
			html+="<td class=border_bottom;><a href='#' onclick=\"window.open('"+ofr+"', '_blank')\" class='button_abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>RFR</a></td> ";
		}

		// For cancel Repo
		/* var ofr_cancel_searh = nlapiLoadSearch('customrecord_lms_ofr_', 'customsearch_advs_ssf_ofr_search_for_can');
		if(entityid !=null && entityid !='' && entityid !=undefined){
			ofr_cancel_searh.addFilter(new nlobjSearchFilter('custrecord_ofr_customer', null, 'anyof', entityid));
		}
		var ofr_cancel_run = ofr_cancel_searh.runSearch();
		var ofr_can_col = ofr_cancel_run.getColumns();
		var ofr_cancel_internal_id = '';
		ofr_cancel_run.forEachResult(function(ofr_rec_cancel) {
			ofr_cancel_internal_id = ofr_rec_cancel.getValue(ofr_can_col[0]);
			return true;
		});
		if(ofr_cancel_internal_id !=null && ofr_cancel_internal_id !='' && ofr_cancel_internal_id !=undefined){
			var ofr_cancel = nlapiResolveURL('RECORD', 'customrecord_lms_ofr_',ofr_cancel_internal_id,'edit');
			html+="<td class=border_bottom; ><a href='#' onclick=\"window.open('"+ofr_cancel+"', '_blank')\" class='button123abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>Cancel RFR</a></td> ";
		} */
	}
	if(single_deal_id !=null && single_deal_id !=''){
		// For GPS Inactive
		var gps_inactive_link = nlapiLookupField('customrecord_advs_lease_header', single_deal_id, 'custrecord580');
		if(gps_inactive_link !=null && gps_inactive_link !='' && gps_inactive_link !=undefined && gps_inactive_link !='null'){
			var gps_url = 'www.netsuite.com';//nlapiResolveURL('RECORD', 'task', gps_inactive_link, 'view');
//			html +="<td><button type='button' onclick=\"window.open('"+gps_url+"', '_blank')\" style='background-color:#0099FF'>Cancel GPS Inactive</button></td>";
			html+="<td class=border_bottom; ><a href='#' onclick=\"window.open('"+gps_url+"', '_blank')\" class='button123abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>Cancel GPS Inactive</a></td> ";
		}
		// For Cancel Out Of State
		var out_of_st_task_link = nlapiLookupField('customrecord_advs_lease_header', single_deal_id, 'custrecord_out_of_st_task_link');
		if(out_of_st_task_link !=null && out_of_st_task_link !='' && out_of_st_task_link !=undefined && out_of_st_task_link !='null'){
			var gps_url = nlapiResolveURL('RECORD', 'task', out_of_st_task_link, 'view');
			html+="<td class=border_bottom;><a href='#' onclick=\"window.open('"+gps_url+"', '_blank')\" class='button123abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>Cancel Out Of State</a></td> ";
		}
	}
	var impouned_task_link = '';
	/* var deal_search = nlapiLoadSearch('customrecord_advs_lease_header', 'customsearch_deal_search_for_customer');
	deal_search.addFilter(new nlobjSearchFilter('custrecord_advs_l_h_customer_name', null, 'anyof', entityid));
	var deal_run = deal_search.runSearch();
	var deal_col =deal_run.getColumns();
	deal_run.forEachResult(function(deal_rec) {
		var deal_id = deal_rec.getValue(deal_col[0]);
		if(impouned_task_link != null &&  impouned_task_link !='' && impouned_task_link !=undefined)
		{
		}else{
			if(deal_id !=null && deal_id !='' && deal_id !=undefined){
				impouned_task_link = nlapiLookupField('customrecord_advs_lease_header', deal_id, 'custrecord626');
			}
		}

		return true;
	}); */

	if(impouned_task_link != null &&  impouned_task_link !='' && impouned_task_link !=undefined)
	{
		var url = 'www.netsuite.com';//nlapiResolveURL('RECORD', 'task', impouned_task_link, 'view');
		html+="<td class=border_bottom ><a href='#' onclick=\"window.open('"+url+"', '_blank')\" class='button123abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>Flag Impounded</a></td>";
	}
//	html+="<td class=border_bottom;><a href='/app/accounting/transactions/custpymt.nl?entity="+entityid+"' target='_blank' class='button1'>Accept Payment</a></td>" +
	html+="<td class=border_bottom; ><a href='#' onclick=\"window.open('"+repair_ord+"', '_blank')\" class='button_abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>Repair Order</a></td>";

    var urlDpp = ''; 
    var CurrentUserr = nlapiGetUser();
    var DPPAllow = 'F'//nlapiLookupField('employee', CurrentUserr, 'custentity_advs_dpp');
   
    if(DPPAllow == 'F' || DPPAllow == false || DPPAllow == 'false'){
	
	html +="<td class=border_bottom;><a href='#' onclick=\"window.alert('You dont have a permission to create DPP')\" class='button_abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>DPP</a></td>";

    }
 else{
    urlDpp+= 'www.netsuite.com';//nlapiResolveURL('SUITELET', 'customscript_advs_staa_deferred_payment_','customdeploy_advs_staa_deferred_payment_');
	urlDpp+="&custparam_custid="+entityid+"";
	html +="<td class=border_bottom;><a href='#' onclick=\"window.open('"+urlDpp+"', '_blank')\" class='button_abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>DPP</a></td>";

 }
	// Open Order
	var Open_ro_count = 0;
	/* var Open_search = nlapiLoadSearch('', 'customsearch_openro_ceo_dashboard');
	Open_search.addFilter(new nlobjSearchFilter('entity', null, 'anyof', entityid));
	var Open_rum = Open_search.runSearch();
	var Open_col = Open_rum.getColumns();
	Open_rum.forEachResult(function(rec) {
		Open_ro_count++;
		return true;
	}); */
	if(Open_ro_count > 0){
		var Open_url = 'www.netsuite.com';//nlapiResolveURL('SUITELET', 'customscript_advs_open_ro_ceo_customer_d', 'customdeploy_advs_open_ro_ceo_customer_d');
		Open_url = Open_url+'&entity_id='+entityid;
		html+="<td class=border_bottom; ><a href='#' onclick=\"window.open('"+Open_url+"', '_blank')\" class='button123abhi' style='color:white;margin-top: 2cm;padding: 10px 15px;'>Open Order</a></td>";
	}
	html+="</tr>" +
	"<tr><td> &nbsp;</td></tr>" +

	"</table>";
	var mark_for_bad_his='F';
	if(entityid !=null && entityid !=''){
		mark_for_bad_his = 'F'//nlapiLookupField('customer', entityid, 'custentity_advs_repoed_customer');
	}
	if(mark_for_bad_his =='T'){
		html +="<table>";
		html+="<tr><td width=100% colspan='2' style='color:red;'>Marked Customer For Bad History</td></tr>";
		html +="</table>";
	}
	//BAD DEBT STARTS HERE
	var mark_for_bad_debt='F';
	if(entityid !=null && entityid !=''){
		mark_for_bad_debt = 'F'//nlapiLookupField('customer', entityid, 'custentity46');
	}
	if(mark_for_bad_debt =='T'){
		html +="<table>";
		html+="<tr><td width=100% colspan='2' style='color:red;'>Marked Customer For Bad Debt Write Off</td></tr>";
		html +="</table>";
	}
	//BAD DEBT ENDS HERE
	html+="<table width='100%' border='1' style='border-collapse:collapse; font-family: monospace;'>";
	html +="<tr style = 'background-color:#607799;color:white;'>" +
	"<th style='font-weight:700; text-align:center;'>VIN</th>" +
	"<th style= 'font-weight:700; text-align:center;'>Lease #</th>" +
	"<th style='font-weight:700; text-align:center;'>Plate #</th>" +
	"<th style='font-weight:700; text-align:center;'>Make/Model/Year</th>" +
	// "<th style='font-weight:700; text-align:center;'>PassTime Installed</th>" +
	// "<th style='font-weight:700; text-align:center;'>PassTime Status</th>" +
	"<th style='font-weight:700; text-align:center;'>Current Mileage</th></tr>";
	for(var i=0;i<vehicle_health_count;i++){
		//"+vehicle_health[i]['vin']+"
		var veh_id = vehicle_health[i]['internalId'];
		var veh_url = nlapiResolveURL('RECORD', 'customrecord_advs_vm', veh_id, 'view');
		html +="<tr><th style='color:#255599; font-weight:600; text-align:center;'><a href='"+veh_url+"' target='_blank'>"+vehicle_health[i]['vin']+"</a></th>" +
		"<th style='color:#255599; font-weight:600; text-align:center;'>"+vehicle_health[i]['stock_num']+"</th>" +
		"<th style='color:#255599; font-weight:600; text-align:center;'>"+vehicle_health[i]['lic_plate_num']+"</th>" +
		"<th style='color:#255599; font-weight:600; text-align:center;'>"+vehicle_health[i]['make_model_year']+"</th>" +
		//"<th style='color:#255599; font-weight:600; text-align:center;'>"+vehicle_health[i]['custrecord_advs_vm_passtime_enabled']+"</th>" +
		//"<th style='color:#255599; font-weight:600; text-align:center;'>"+vehicle_health[i]['custrecord_advs_pass_time_veh_status']+"</th>" +
		 "<th style='color:#255599; font-weight:600; text-align:center;'>"+vehicle_health[i]['current_mileage']+"</th></tr>";
//		"<th style='color:#255599; font-weight:600; text-align:center;'>"+vehicle_health[i]['last_lof']+"</th></tr>";


	}
	portletObj.setTitle('Active Contracts Information');

/* var cur_deal_id = new Array();
	var cur_deal_name = new Array();
	var cur_deal_subsi=new Array();var cur_deal_subsi_far=new Array();
	var deal_url = new Array();
	var fin_amt = new Array();  */
	// To Display From Dash Board customer Collection
	  var deal_search = nlapiLoadSearch('customrecord_advs_lease_header', 'customsearch_deal_search_for_customer');
	deal_search.addFilter(new nlobjSearchFilter('custrecord_advs_l_h_customer_name', null, 'anyof', entityid_arr));
	var deal_run = deal_search.runSearch();
	var deal_col =deal_run.getColumns();
	var cur_deal_id = new Array();
	var cur_deal_name = new Array();
	var cur_deal_subsi=new Array();var cur_deal_subsi_far=new Array();
	var deal_url = new Array();
	var fin_amt = new Array(); 
	deal_run.forEachResult(function(deal_rec) {

		var deal_id_b = deal_rec.getValue(deal_col[0]);
		cur_deal_id.push(deal_rec.getValue(deal_col[0]));
		var stock_url=nlapiResolveURL('RECORD','customrecord_advs_lease_header',deal_rec.getValue(deal_col[0]),'VIEW');
		deal_url.push(stock_url);
		cur_deal_name.push(deal_rec.getValue(deal_col[1]));
		cur_deal_subsi.push(deal_rec.getValue(deal_col[2]));
		cur_deal_subsi_far.push(deal_rec.getValue(deal_col[3]));
		
		if(deal_id_b !=null && deal_id_b !='' && deal_id_b !=undefined){
			var finance_deal =nlapiCreateSearch("customrecord_advs_lease_header",
					[
					 ["internalid","anyof",deal_id_b], 
					/*  "AND", 
					 ["custrecord_advs_accured_cred_memo.mainline","is","T"]
					 ,"AND", 
					 ["custrecord_advs_st_sales_channel","anyof","6","10"] */
					 ], 
					 [
					  new nlobjSearchColumn("internalid",null,null), 
					  //new nlobjSearchColumn("custrecord_advs_accured_cred_memo",null,null), 
					  //new nlobjSearchColumn("amount","CUSTRECORD_ADVS_ACCURED_CRED_MEMO",null)
					  ]
			);
//			finance_deal.addFilter(new nlobjSearchFilter('custrecord_advs_st_finance_deal_link', null, 'anyof', deal_id_b));
			var finance_run = finance_deal.runSearch();
			var finance_Col = finance_run.getColumns();
			finance_run.forEachResult(function(fin_rec) {

				var fin_amt_deal = 0//fin_rec.getValue(finance_Col[2])*-1;
				
				
				nlapiLogExecution('ERROR', 'fin', fin_amt_deal);
				if ( fin_amt_deal!= 0){
					fin_amt[deal_id_b] = fin_amt_deal;
				} else {
					fin_amt[deal_id_b] = 0;
				}
				return true;
			});	
		}
		return true;
	});
	// Past Due From Collection
	var past_due = [];var past_days=[];
	if(false){//cur_deal_id !=null && cur_deal_id !='' && cur_deal_id !=undefined && cur_deal_id.length > 0
		var past_coll = nlapiLoadSearch('', 'customsearch_advs_amount_due_and_due_day');
		past_coll.addFilter(new nlobjSearchFilter('entity', null, 'anyof', entityid));
		past_coll.addFilter(new nlobjSearchFilter('custbody_advs_lease_head', null, 'anyof', cur_deal_id));
		var past_run = past_coll.runSearch();
		var past_c = past_run.getColumns();
		past_run.forEachResult(function(rec) {
			var dea = rec.getValue(past_c[0]);
			past_days[dea] = rec.getValue(past_c[1]);
			past_due[dea] = rec.getValue(past_c[2]);

			return true;
		});
	}
	var pay_in_30_days = new Array(); var amt_365=[],tot_amt=[];
	if(false){//cur_deal_id !=null && cur_deal_id !='' && cur_deal_id !=undefined
		var pay_search = nlapiLoadSearch('transaction', 'customsearch807');
		//pay_search.addFilter(new nlobjSearchFilter('custbody_lease_card_link',null,'anyof', cur_deal_id));
		var pay_run = pay_search.runSearch();
		var pay_col = pay_run.getColumns();

		pay_run.forEachResult(function(rec) {
			var age_in_days = rec.getValue(pay_col[2]);
			var deal_id = rec.getValue(pay_col[0]);
			var amt_paid = 0//rec.getValue(pay_col[1])*1;
			if(age_in_days < 30){
				if(pay_in_30_days[deal_id] != undefined && pay_in_30_days[deal_id] !=null && pay_in_30_days[deal_id] !=''){
					var amt = pay_in_30_days[deal_id]*1;
					amt = amt + amt_paid;
					pay_in_30_days[deal_id] = amt;
				}else{
					pay_in_30_days[deal_id] = amt_paid;
				}

			}
			if(age_in_days < 365){
				if(amt_365[deal_id] != undefined && amt_365[deal_id] !=null && amt_365[deal_id] !=''){
					var amt = amt_365[deal_id]*1;
					amt = amt + amt_paid;
					amt_365[deal_id] = amt;
				}else{
					amt_365[deal_id] = amt_paid;
				}
			}
			if(tot_amt[deal_id] != undefined && tot_amt[deal_id] !=null && tot_amt[deal_id] !=''){
				var amt = tot_amt[deal_id]*1;
				amt = amt + amt_paid;
				tot_amt[deal_id] = amt;
			}else{
				tot_amt[deal_id] = amt_paid;
			}
			return true;
		});
	}
  
	var Balance_URL = 'www.netsuite.com';//nlapiResolveURL('SUITELET', 'customscript_advs_ssf_tot_blnce_dash', 'customdeploy_advs_ssf_tot_blnce_dash');
	html +="</table><br/>";
	html +="<table width='100%' border='1' style='border-collapse:collapse;'>";
	html +="<tr style = 'background-color:#607799;color:white'><th style=' font-weight:600; font-size:12px; text-align:center' width='10%'>Lease #</th>" +
	"<th style='font-weight:600; font-size:12px; text-align:center' width='10%'>Subsidiary</th>" +
	"<th style='font-weight:600; font-size:12px; text-align:center' width='10%'>Total Due</th>" +
	"<th style='font-weight:600; font-size:12px; text-align:center' width='10%'>Past Due</th>" +

	"<th style='font-weight:600; font-size:12px; text-align:center' width='10%'>No. of Days<br/>Past Due</th>" +
//	"<th style='font-weight:600; font-size:12px; text-align:center' width='10%'>Total Paid in<br/>Last 30 Days</th>" +
//	"<th style='font-weight:600; font-size:12px; text-align:center' width='10%'>Total Paid in<br/>Last 12 Months</th>" +
	"<th style='font-weight:600; font-size:12px; text-align:center' width='10%'>Total Credit Balance</th>" +
	"<th style='font-weight:600; font-size:12px; text-align:center' width='10%'>Total Unapplied<br/>Payments</th>" +
	"<th style='font-weight:600; font-size:12px; text-align:center' width='10%'>Total ACH/CC/CHECK<br/>Bounced<br/> Amount</th>" +
	"<th style='font-weight:600; font-size:12px; text-align:center' width='10%'>Total ACH/CC/CHECK<br/>Bounced<br/>No. of Times</th>" +
	"<th style='font-weight:600; font-size:12px; text-align:center' width='10%'>Consecutive<br/>Offeder</th>" +

	"</tr>";


	var Total_credit_amount =[];



//	var Credit_Search = nlapiLoadSearch('transaction', 'customsearch1025'); 
//	Hem Modified : 7th July 2017	

	 var Credit_Search = nlapiCreateSearch("transaction",
			[
/* ["custbody_advs_type_of_payment","noneof","7","14","12"], 
"AND", 
["account","anyof","574"], 
"AND",  */
["type","anyof","CustCred"], 
"AND", 
["mainline","is","T"],
"AND", 
["posting","is","T"],
"AND", 
["amountremaining","notequalto","0.00"]
], 
[
 new nlobjSearchColumn("custbody_advs_lease_head",null,"GROUP"), //commetig
 new nlobjSearchColumn("amountremaining",null,"SUM")
 ]
	);

	if(false){//cur_deal_id.length > 0 && cur_deal_id !=null && cur_deal_id !='' && cur_deal_id !=undefined
		Credit_Search.addFilter(new nlobjSearchFilter('custbody_advs_lease_head', null, 'anyof', cur_deal_id));
	} else {
		Credit_Search.addFilter(new nlobjSearchFilter('internalidnumber', null, 'equalto', "0"));
	}



	var Credit_run = Credit_Search.runSearch();
	var Credit_Col = Credit_run.getColumns();
	Credit_run.forEachResult(function(rec) {
		var deal_id = rec.getValue(Credit_Col[0]);
		if (rec.getValue(Credit_Col[1])*1 <= 0){
			Total_credit_amount[deal_id] = 0;
		} else {
			Total_credit_amount[deal_id] = rec.getValue(Credit_Col[1])*-1;
		}
		return true;
	});

	var total_due_far =nlapiCreateSearch("transaction",
			[
			 /* ["custbody_advs_type_of_payment","noneof","12","7"], 
			 "AND", 
			 ["account","anyof","574"], 
			 "AND",  */
			 [[["type","anyof","CashRfnd","CustDep","CustPymt"],"AND",["mainline","is","F"]],"OR",[["type","anyof","CustCred","CustInvc"],"AND",["mainline","is","T"]]], 
			 "AND", 
			 ["customer.internalid","anyof",entityid],
			 "AND", 
			 ["posting","is","T"]

			 ], 
			 [
			  new nlobjSearchColumn("internalid","customer","GROUP"), 
			  new nlobjSearchColumn("subsidiary",null,"GROUP"), 
			  new nlobjSearchColumn("amount",null,"SUM"),
			  // new nlobjSearchColumn("custbody_advs_lease_head",null,"GROUP")
			  ]
	);
	var run_far = total_due_far.runSearch();
	var col_far = run_far.getColumns();
	var total_due_new_far = new Array();
	run_far.forEachResult(function(rec) {
		var temp_subsidiary = rec.getValue(col_far[1]);
		var deal_t = rec.getValue(col_far[3]);
//		total_due_new_far[deal_t] = rec.getValue(col_far[2]);
		nlapiLogExecution('ERROR', 'CHECKViki', rec.getValue(col_far[2])*1 +'<------------------>'+fin_amt[deal_t]);
		if(fin_amt[deal_t] !=null && fin_amt[deal_t] !=undefined && fin_amt[deal_t] !=''){
			total_due_new_far[deal_t] = rec.getValue(col_far[2])*1 + fin_amt[deal_t]*1;
		}else{
			total_due_new_far[deal_t] = rec.getValue(col_far[2])*1;
		}
		return true;
	});
	var total_unapplied_payments = new Array();
	var total_ach_amount = new Array(), total_ach_count = new Array(); var off_list =  new Array();
	if(cur_deal_id.length > 0){


		var transactionSearch = nlapiCreateSearch("transaction",
				[
				 /* ["custbody_advs_type_of_payment","noneof","7","14","12"], 
				 "AND",  */
				 ["account","anyof","574"], 
				 "AND", 
				 [[["type","anyof","CustDep","CustPymt"],"AND",["mainline","is","F"]]], 
				 "AND", 
				 ["custbody_advs_lease_head","anyof",cur_deal_id], 
				 "AND", 
				 ["amountremaining","notequalto","0.00"],
				 "AND", 
				 ["posting","is","T"]
				 ], 
				 [
				  new nlobjSearchColumn("custbody_advs_lease_head",null,"GROUP"), 
				  new nlobjSearchColumn("amountremaining",null,"SUM")
				  ]
		);

 
		var run = transactionSearch.runSearch();
		var col = run.getColumns();
		run.forEachResult(function(rec) {
			var deal_id_temp = rec.getValue(col[0]);
			total_unapplied_payments[deal_id_temp] = rec.getValue(col[1])*-1;
			return true;
		});
		nlapiLogExecution('ERROR', 'AAAAAA', 'AAAAAAAAAAAA'); 
		nlapiLogExecution('ERROR', 'BBBBBBBBBB', 'BBBBBBBBBBBBBBBBB');
		var offnders_list = nlapiCreateSearch("customrecord_advs_lm_lease_card_child",
				[
				/*  ["custrecord_advs_lm_lc_c_link.custrecord_deal_status","noneof","1","6"], 
				 "AND", */
				 ["custrecord_advs_lm_lc_c_down_paying","greaterthan","0.00"], 
				 "AND",  
				 ["count(internalid)","greaterthan","1"],
				 "AND",
				 ["custrecord_advs_lm_lc_c_link","anyof",cur_deal_id],
				 "AND",
				 ["custrecord_advs_lm_lc_c_date","before","today"]
				 ], 
				 [
				  new nlobjSearchColumn("custrecord_advs_lm_lc_c_link",null,"GROUP"), 
				  new nlobjSearchColumn("internalid",null,"COUNT"), 
				  new nlobjSearchColumn("custrecord_advs_lm_lc_c_down_paying",null,"SUM")
				  ]
		);
		var off_Search = offnders_list.runSearch();
		var off_col = off_Search.getColumns();
		off_Search.forEachResult(function(rec) {
			var deal_id = rec.getValue(off_col[0]);
			off_list[deal_id] = rec.getValue(off_col[1]);
			return true;
		});
		nlapiLogExecution('ERROR', 'CCCCCCCCCCC', 'CCCCCCCCCCCCCCCCCCC');
	}



	var Total_credit_amount_final =0;
	for(var i=0;i<cur_deal_id.length;i++){
		var deal = cur_deal_id[i];
		var credit_flip = 0;
		var credit_flip30 = 0;
		var credit_flip120 = 0;
		credit_flip = ''//nlapiLookupField('customrecord_advs_lease_header', deal, 'custrecord81');
		if ((credit_flip == null)&&(credit_flip == '')&& (credit_flip == undefined)){
			credit_flip = 0;
		}
		var deal_date='';			
		deal_date = nlapiLookupField('customrecord_advs_lease_header', deal, 'custrecord_advs_l_h_start_date');

		if ((deal_date == null)&&(deal_date == '')&& (deal_date == undefined)){
			credit_flip30 = 0;
			credit_flip120 = 0;
		} else {
			var day_diff=0;
			var date = new Date;
			var date2 = nlapiDateToString(date);
			if(deal_date!='' && date2!=''){
				day_diff=Days_diff(deal_date, date2);	
			}else{
				day_diff=0;
			}

			if (day_diff !=0) {
				if (day_diff <= 30){
					credit_flip30 = - credit_flip*1;
					credit_flip = credit_flip30;
				}
				else
				{
					credit_flip120 = - credit_flip*1;
					credit_flip = credit_flip120;
				}}

		}


		var amt_30=0;
		if(pay_in_30_days[deal] !=null && pay_in_30_days[deal] != undefined && pay_in_30_days[deal] !=''){
			amt_30 = pay_in_30_days[deal];
		}

		amt_30 = amt_30*1 + credit_flip30*1;



		var amt_365_c=0;
		if(amt_365[deal] !=null && amt_365[deal] != undefined && amt_365[deal] !=''){
			amt_365_c = amt_365[deal];
		}

		amt_365_c = amt_365_c*1 + credit_flip30*1 + credit_flip120*1 ;


		var amt_total=0;
		if(tot_amt[deal] !=null && tot_amt[deal] != undefined && tot_amt[deal] !=''){
			amt_total = tot_amt[deal];
		}
		amt_total = amt_total*1 + credit_flip*1;


		var tot_ctedit=0,tot_ctedit_minus=0;
		if(Total_credit_amount[deal] !=null && Total_credit_amount[deal] != undefined && Total_credit_amount[deal] !=''){
			tot_ctedit =Total_credit_amount[deal];
			tot_ctedit_minus =Total_credit_amount[deal];
			Total_credit_amount_final += tot_ctedit*1;
		}
		var Balance_Credit = Balance_URL+'&custparam_deal_id='+deal+'&custparam_payment_type='+4;
 

		//past Due and past days
		var past_due_T = '',past_days_T = '';


		if(past_due[deal] !=null && past_due[deal] !=undefined && past_due[deal] !=''){
			past_due_T = past_due[deal];
		}else{
			past_due_T =0;
		}
		if(past_days[deal] !=null && past_days[deal] !=undefined && past_days[deal] !=''){
			past_days_T = past_days[deal];
		}else{
			past_days_T = 0;
		}
		var temp_total_due = 0;
		if(total_due_new_far[deal] !=null && total_due_new_far[deal] !='' && total_due_new_far[deal] !=undefined){
			temp_total_due = total_due_new_far[deal];
		}

		var temp_total_unapplied_payments = 0;
		if(total_unapplied_payments[deal] !=null && total_unapplied_payments[deal] !='' && total_unapplied_payments[deal] !=undefined){
			temp_total_unapplied_payments = total_unapplied_payments[deal];
		}

		var temp_ach_amount = 0,temp_ach_count = 0;
		if(total_ach_amount[deal] !=null && total_ach_amount[deal] !='' && total_ach_amount[deal] !=undefined){
			temp_ach_amount = total_ach_amount[deal];
		}
		if(total_ach_count[deal] !=null && total_ach_count[deal] !='' && total_ach_count[deal] !=undefined){
			temp_ach_count = total_ach_count[deal];
		}
		var offender_flag ='FALSE';
		if(off_list[deal] !=null && off_list[deal] !='' && off_list[deal] !=undefined){
			offender_flag ='TRUE';
		} 
		html +="<tr><th style='color:#255599; font-weight:800; text-align:center'><a href='"+deal_url[i]+"' target='_blank'>"+cur_deal_name[i]+"</a></th>" +

		"<th style='color:#255599; font-weight:800; text-align:center'>"+cur_deal_subsi[i]+"</th>" +
		"<th style='color:#255599; font-weight:800; text-align:center'>"+temp_total_due+"</th>" +
		"<th style='color:#255599; font-weight:800; text-align:center'>"+numberWithCommas(past_due_T)+"</th>" +

		"<th style='color:#255599; font-weight:800; text-align:center'>"+past_days_T+"</th>";
 
		html +=	"<th style='color:#255599; font-weight:800; text-align:center'>"+numberWithCommas(tot_ctedit_minus.toFixed(2))+"</th>";
 

		html +="<th style='color:#255599; font-weight:800; text-align:center'>"+numberWithCommas(temp_total_unapplied_payments.toFixed(2))+"</th>" +
		"<th style='color:#255599; font-weight:800; text-align:center'>"+numberWithCommas(temp_ach_amount.toFixed(2))+"</th>" +
		"<th style='color:#255599; font-weight:800; text-align:center'>"+numberWithCommas(temp_ach_count)+"</th>" +
		"<th style='color:#255599; font-weight:800; text-align:center'>"+offender_flag+"</th>" +
		"</tr>";
 
	 } 
	html+=	""+
	"</table><br/>";

 var Total_credit_amount_final=0;
	var Balance_URL_Cust = 'www.netsuite.com'//nlapiResolveURL('SUITELET', 'customscript_advs_ssf_tot_blnce_dash', 'customdeploy_advs_ssf_tot_blnce_dash');
	Balance_URL_Cust = Balance_URL_Cust+'&custparam_customer_id='+entityid+'&custparam_payment_type='+4;
	html +="<table>"; 
	html +="<tr><th style='color:#255599; font-weight:800; text-align:center'> Total Credit : </th><th style='color:#255599; font-weight:800; text-align:left'>"+numberWithCommas(Total_credit_amount_final.toFixed(2))+"</th></tr>";
  
	html +="</table>";

	html +="</table>";
	portlet.setHtml( html );
}

function numberWithCommas(x) {
	if(x !=null && x !='' && x !=undefined){
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}else{
		return 0;
	}

}

function Days_diff( date1, date2 ) {

	date1=nlapiStringToDate(date1);
	date2=nlapiStringToDate(date2);
	//Get 1 day in milliseconds
	var one_day=1000*60*60*24;

	// Convert both dates to milliseconds
	var date1_ms = date1.getTime();
	var date2_ms = date2.getTime();

	// Calculate the difference in milliseconds
	var difference_ms = date2_ms - date1_ms;
	//take out milliseconds
	difference_ms = difference_ms/1000;
	var seconds = Math.floor(difference_ms % 60);
	difference_ms = difference_ms/60; 
	var minutes = Math.floor(difference_ms % 60);
	difference_ms = difference_ms/60; 
	var hours = Math.floor(difference_ms % 24);  
	var days = Math.floor(difference_ms/24);

	return days;
}
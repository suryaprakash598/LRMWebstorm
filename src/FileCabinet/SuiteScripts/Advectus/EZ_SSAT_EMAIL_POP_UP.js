/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       16 Jul 2015     EVTL_L002
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){
		
	if(request.getMethod() == 'GET')
	{
		try
		{
		var cust_id = request.getParameter('custparam_customer_id');
		var para_subject = request.getParameter('subject_temp');
		var isfromIns = request.getParameter('subject_from_ins');
		
		var form = nlapiCreateForm('Email Setup', true);
		
		form.addSubmitButton('Send');
		form.addButton('custpage_print', 'Print/Preview', 'print()');
		form.addButton('custpage_reset', 'Reset', 'reset_button()');
		form.addButton('custpage_cancel', 'Cancel', 'cancel()');
		//form.setScript('customscript_ez_csat_email_button');
          // form.setScript('customscript_ez_csat_email_button');
		form.setScript('customscript_ez_csat_email_sent');
		
		var fldGrp = form.addFieldGroup('fldgroup','Field Group');
		fldGrp.setShowBorder(false);
		fldGrp.setSingleColumn(true);
		if(isfromIns=='T')
		{
		var select = form.addField('custpage_temp', 'select', 'Template', 'customrecordcustrecord_ins_temp_name', 'fldgroup').setMandatory(true);
			
		}else{
			var select = form.addField('custpage_temp', 'select', 'Template', null, 'fldgroup').setMandatory(true);
			select.addSelectOption('', '');
			var column = new Array();
			column[0] = new nlobjSearchColumn('custrecord_ez_temp_name');
			column[1] = new nlobjSearchColumn('internalid');
			
			var search = nlapiCreateSearch('customrecord_advs_email_template', null, column);
			var run = search.runSearch();
			var col = run.getColumns();
			var temp_names = [];
			var internal_id = [];
			run.forEachResult(function (res){
				temp_names.push(res.getValue(col[0]));
				internal_id.push(res.getValue(col[1]));
				return true;
			});
			
			for(var i=0; i<internal_id.length; i++)
			{
				select.addSelectOption(internal_id[i], temp_names[i]);
			}
			
		}
		
		var subject = form.addField('custpage_subject', 'text', 'Subject', null, 'fldgroup').setMandatory(true);
		var cust_name = form.addField('custpage_name', 'text', 'Customer Name', null, 'fldgroup').setMandatory(true).setDisplayType('disabled');
		var cust_email = form.addField('custpage_email', 'email', 'To', null, 'fldgroup').setMandatory(true);//.setDisplayType('disabled');
		var Cc = form.addField('custpage_cc', 'email', 'Cc',null, 'fldgroup');
		var Bcc = form.addField('custpage_bcc', 'email', 'Bcc',null, 'fldgroup');
		var select_deal = form.addField('custpage_deal', 'select', 'Deal', null, 'fldgroup').setMandatory(true);
//		select_deal.addSelectOption('', '');
		var Deal_fld_st=form.addField('custpage_deal_status', 'text', 'Deal Status', null, 'fldgroup');
		
//		fldGrp.setSingleColumn(true);
//		fldGrp.setShowBorder(false);
		
//		var sublist = form.addSubList('custpage_sublist', 'inlineeditor', 'Select People to copy');
//		var copy =sublist.addField('custpage_email1', 'select', 'Copy Others', 'entity');
//		var copy_email = sublist.addField('custpage_copy_email', 'email', 'Email').setMandatory(true);
//		var cc = sublist.addField('custpage_cc', 'checkbox', 'Cc');
//		var bcc = sublist.addField('custpage_bcc', 'checkbox', 'Bcc');
//		cc.setDefaultValue('T');
		
		
		var temp_field = form.addField('custpage_field', 'text', 'TEMP ID').setDisplayType('hidden');
		temp_field.setDefaultValue(cust_id);
		
		
		var cust_filter = new Array();
		cust_filter[0] = new nlobjSearchFilter('internalid', null, 'is', cust_id);
		
		var cust_column = new Array();
		cust_column[0] = new nlobjSearchColumn('altname');
		cust_column[1] = new nlobjSearchColumn('email');
		
		var search = nlapiCreateSearch('customer', cust_filter, cust_column);
		var run = search.runSearch();
		var col = run.getColumns();
		var customer_name = '';
		var email = '';
		run.forEachResult(function (res){
			customer_name = res.getValue(col[0]);
			email = res.getValue(col[1]);
			return true;
		});
		cust_name.setDefaultValue(customer_name);
		cust_email.setDefaultValue(email);
		
		
		if(customer_name != null && customer_name != '' && customer_name != undefined)
		{
			var deal = [], internalID = [];
			var i=0;
			
			var ar_filter = new Array();
			ar_filter[0] = new nlobjSearchFilter('internalid', 'custrecord_advs_l_h_customer_name', 'anyof', cust_id);
			
			var column = new Array();
			column[1] = new nlobjSearchColumn('name');
			column[0] = new nlobjSearchColumn('internalid');
			
			var search = nlapiCreateSearch('customrecord_advs_lease_header', ar_filter, column);
			search.addFilters(ar_filter);
			
			var run = search.runSearch();
			var col = run.getColumns();			
			run.forEachResult(function (res){
				internalID[i] = res.getValue(col[0]);
				deal[i] = res.getValue(col[1]);
				i++;
				return true;
			});
			
			for(var j=0; j<i; j++)
			{
				select_deal.addSelectOption(internalID[j], deal[j]);
			}
		}
		
		var msg = form.addField('custpage_msg', 'richtext', 'Message', null, 'fldgroup');
//		msg.setDisplayType('inline');
		var template_id = request.getParameter('custparam_temp_id');
		select.setDefaultValue(template_id);
		
		if(template_id != '' && template_id != null && template_id != undefined)
		{
			var filter = new Array();
			filter[0] = new nlobjSearchFilter('internalid', null, 'is', template_id);
			
			var search = nlapiSearchRecord('customrecord_advs_email_template', 'customsearch_ssat_template_search', filter, null);

			var temp_name = ''; 
			var temp_body = '';
			var cust_data = '';
			var veh_data = '';
			var contact_data = '';
			var contract_data = '';
			var header = '';
			var footer = '';
			var temp_subject = '';
			for(var i=0;search!=null&&i<search.length;i++){
				var res=search[i];
				var col=res.getAllColumns();
				temp_name = res.getValue(col[0]);
				temp_body = res.getValue(col[1]);
				cust_data = res.getValue(col[2]);
				veh_data = res.getValue(col[3]);
				contact_data = res.getValue(col[4]);
				contract_data = res.getValue(col[5]);
				header = res.getValue(col[6]);
				footer = res.getValue(col[7]);
				temp_subject = res.getValue(col[8]);
			}
			var message_body = header+' '+temp_body+' '+footer;
			msg.setDefaultValue( message_body);
			subject.setDefaultValue(temp_subject);
		}	
		
		var deal_id = request.getParameter('deal_id');
		if(deal_id != null && deal_id != '' && deal_id != undefined)
		{
			select_deal.setDefaultValue(deal_id);
			
			var record = nlapiLoadRecord('customrecord_advs_lease_header', deal_id);
			var status_nam = record.getFieldText('custrecord_advs_l_h_status');
			
			
			Deal_fld_st.setDisplayType('disabled').setDefaultValue(status_nam); 
			
			subject.setDefaultValue(para_subject);
		}
		
			
		}catch(e)
		{
			nlapiLogExecution('ERROR', 'INFO', e.message);
		}
		
		response.writePage(form);
	}
	else
	{
		try{
		 
		var temp_id = request.getParameter('custpage_temp');
		var customer_id = request.getParameter('custpage_field');
		var email = request.getParameter('custpage_email');
		var recepient = request.getParameter('custpage_email');
		var cc = request.getParameter('custpage_cc');
		var bcc = request.getParameter('custpage_bcc');
		var subject = request.getParameter('custpage_subject');
		var deal_id=request.getParameter('custpage_deal');
		var deal_msg=request.getParameter('custpage_msg');
		
		nlapiLogExecution('ERROR', 'email', email);
		
		var filter = new Array();
		filter[0] = new nlobjSearchFilter('internalid', null, 'is', temp_id);
		
		var search = nlapiSearchRecord('customrecord_advs_email_template', 'customsearch_ssat_template_search', filter, null);

		var temp_name = ''; 
		var temp_body = '';
		var cust_data = '';
		var veh_data = '';
		var contact_data = '';
		var contract_data = '';
		var insurance_data = '';
		var license_data = '';
		var header = '';
		var footer = '';
//		var subject = '';
		for(var i=0;search!=null&&i<search.length;i++){
			var res=search[i];
			var col=res.getAllColumns();
			temp_name = res.getValue(col[0]);
			temp_body = res.getValue(col[1]);
			cust_data = res.getValue(col[2]);
			veh_data = res.getValue(col[3]);
			contact_data = res.getValue(col[4]);
			contract_data = res.getValue(col[5]);
			insurance_data = res.getValue(col[9]);
			license_data = res.getValue(col[10]);
			header = res.getValue(col[6]);
			footer = res.getValue(col[7]);
//			subject = res.getValue(col[8]);
		}
		
		var html='';
		var cust_name = '';
		var address1 = '';
		var address2 = '';
		var city = '';
		var county = '';
		var state = '';
		var country = '';
		var zipcode = '';
		var phone = '';
		if(cust_data == 'T')
		{
			var filter = new Array();
			filter[0] = new nlobjSearchFilter('internalid', null, 'is', customer_id);			
			var search = nlapiSearchRecord('customer','customsearch_advs_mm_customer_data_email', filter);
			for(var i=0;search!=null&&i<search.length;i++){
				var res=search[i];
				var col=res.getAllColumns();
				cust_name = res.getValue(col[0]);
				address1 = res.getValue(col[1]);
				address2 = res.getValue(col[2]);
				city = res.getValue(col[3]);
				county = res.getValue(col[4]);
				state = res.getValue(col[5]);
				country = res.getValue(col[7]);
				zipcode = res.getValue(col[6]);
				phone = res.getValue(col[9]);
			}			
			html+="<br/>" +
					"<table>" +
					"<tr>" +
					"<td>"+cust_name+"</td>" +
					"</tr>" +
					"<tr> " +
					"<td>"+address1+" "+address2+"</td>" +
					"</tr>" +
					"<tr> " +
					"<td>"+city+" "+county+" "+state+"</td>" +
					"</tr>" +
					"<tr> " +
					"<td>"+country+" "+zipcode+"</td>" +
					"</tr>" +
					"<tr>" +
					"<td>Phone # "+phone+"</td>"+
					"</tr>" +
					"</table>";
		}
		nlapiLogExecution('ERROR', 'test1', 'test1');
		var vin = '';
		if(veh_data == 'T')
		{
			if(deal_id!=null&&deal_id!='null'&&deal_id!=""){
				var fil_deal=[];
				var col_deal=[];
				fil_deal[0]=new nlobjSearchFilter('internalid',null,'is',deal_id);
				col_deal[0]=new nlobjSearchColumn('name');
				col_deal[1]=new nlobjSearchColumn('custrecord_advs_la_vin_bodyfld');
				// col_deal[2]=new nlobjSearchColumn('custrecord_advs_lm_lc_make');
				col_deal[2]=new nlobjSearchColumn('custrecord_advs_l_h_model');
				// col_deal[4]=new nlobjSearchColumn('custrecord_advs_lm_lc_model_year');
				// col_deal[5]=new nlobjSearchColumn('custrecord_advs_vm_license_no_compressed','custrecord_advs_la_vin_bodyfld');
				col_deal[3]=new nlobjSearchColumn('custrecord_advs_vm_license_no_compressed','custrecord_advs_la_vin_bodyfld');
				var search_deal=nlapiSearchRecord('customrecord_advs_lease_header',null,fil_deal,col_deal);
				if(search_deal!=null&&search_deal!=""&&search_deal!='null'){
					html+="<br/>" +
							"<table>" +
							"<tr> " +
							"<td>Stock#: "+search_deal[0].getValue(col_deal[0])+"</td>" +
							"</tr>" +
							"<tr> " +
							"<td>VIN#: "+search_deal[0].getText(col_deal[1])+"</td>" +
							"</tr>" +
							"<tr> " +
							// "<td>Make/Model/Year/License # : "+/* search_deal[0].getText(col_deal[2])+" / " +*/search_deal[0].getText(col_deal[3])/* +" / "+search_deal[0].getValue(col_deal[4])+" / " */+search_deal[0].getValue(col_deal[5])+"</td>" +
							"<td>Make/Model/Year/License # : "+search_deal[0].getText(col_deal[2])+" / " +search_deal[0].getValue(col_deal[3])+"</td>" +
							"</tr>" +
							"<tr>" +
							"</tr>" +
							"</table>";
				}
			}
		}
		
		if(contact_data == 'T')
		{
			
		}

		if(contract_data == 'T')
		{
			
		}
		nlapiLogExecution('ERROR', 'test2', 'test2');
		if(insurance_data == 'T')
		{
			var filter = new Array();
			filter[0] = new nlobjSearchFilter('internalid', null, 'is', customer_id);
			
			var column = new Array();
			column[0] = new nlobjSearchColumn('custentity_cust_ins_policy_number');
			column[1] = new nlobjSearchColumn('custentity_cust_ins_exp_date');
			column[2] = new nlobjSearchColumn('custentity_cust_ins_insurance_comp');
			column[3] = new nlobjSearchColumn('custentity_cust_ins_phone');
			column[4] = new nlobjSearchColumn('custentity_cust_insurance_agent');
			column[5] = new nlobjSearchColumn('custentity_cust_ins_agent_phone_number');
			
			var search = nlapiCreateSearch('customer', filter, column);
			var run = search.runSearch();
			var col = run.getColumns();
			run.forEachResult(function (res){
				
				html+="<br/>" +
				"<table>" +
				"<tr>" +
				"<td> Insurance Policy # : "+res.getValue(col[0])+"</td>" +
				"</tr>" +
				"<tr> " +
				"<td>Insurance Cancel Date : "+res.getValue(col[1])+"</td>" +
				"</tr>" +
				"<tr> " +
				"<td>Insurance Company : "+res.getValue(col[2])+"</td>" +
				"</tr>" +
				"<tr> " +
				"<td>Insurance Company Phone # : "+res.getValue(col[3])+"</td>" +
				"</tr>" +
				"<tr> " +
				"<td>Insurance Agent : "+res.getValue(col[4])+"</td>" +
				"</tr>" +
				"<tr> " +
				"<td>Insurance Agent Phone # : "+res.getValue(col[5])+"</td>" +
				"</tr>" +
				"</table>";
				return false;
			});
		}
		nlapiLogExecution('ERROR', 'test3', 'test3');
		if(license_data=='T'){
			var filter = new Array();
			filter[0] = new nlobjSearchFilter('internalid', null, 'is', customer_id);			
			var search = nlapiSearchRecord('customer','customsearch_advs_mm_customer_data_email', filter);
			for(var i=0;search!=null&&i<search.length;i++){
				var res=search[i];
				var col=res.getAllColumns();
				html+="<br/>" +
						"<table>" +
						"	<tr>" +
						"		<td>Driver License # : "+res.getValue(col[10])+"</td>" +
						"	</tr>" +
						"	<tr>" +
						"		<td>State Issuing License : "+res.getText(col[11])+"</td>" +
						"	</tr>" +
						"	<tr>" +
						"		<td>License Expiry Date : "+res.getValue(col[12])+"</td>" +
						"	</tr>" +
						"</table>";
			}
		}
		
		var message_body = header+' '+html+' <br/><br/>'+temp_body+' '+footer;
		nlapiLogExecution('debug','message_body',message_body);
		nlapiLogExecution('debug','deal_msg',deal_msg);
					/* if(!message_body){
						} */
						message_body = deal_msg;
					nlapiLogExecution('debug','message_body',message_body);
		var user_id = nlapiGetUser();
		var records_merge=new Object();
		records_merge['entity'] = customer_id;
 
		if((cc != '' && cc != null && cc != undefined) && (bcc != '' && bcc != null && bcc != undefined))
		{
			nlapiSendEmail(user_id, customer_id, subject, message_body, cc, bcc, records_merge, null);
			SendEmailHistory(deal_id,customer_id,subject,message_body)
			
		}else if((bcc != '' && bcc != null && bcc != undefined) && (cc == '' && cc == null && cc == undefined))
		{
			nlapiSendEmail(user_id, customer_id, subject, message_body, null, bcc, records_merge, null);
			SendEmailHistory(deal_id,customer_id,subject,message_body)
		}
		else if((bcc == '' && bcc == null && bcc == undefined) && (cc != '' && cc != null && cc != undefined))
		{
			nlapiSendEmail(user_id, customer_id, subject, message_body, cc, null, records_merge, null);
			SendEmailHistory(deal_id,customer_id,subject,message_body)
		}
		else
		{
			nlapiSendEmail(user_id, email, subject, message_body, null, null, records_merge, null);
			SendEmailHistory(deal_id,customer_id,subject,message_body)
		}
		
		var form = nlapiCreateForm('Mail Sent Successfully', true);
		//form.setScript('customscript_ez_csat_email_sent');
		var onclickScript=" <html><body> <script type='text/javascript'>" ;

				onclickScript+="try{" ;
				
				onclickScript+= 'window.open("", "_self", "");' ;
				
				//onclickScript+=window.close();
				onclickScript+="window.close()";//window.close();
				onclickScript+="}catch(e){alert(e.toString())}</script></body></html>";
			//	scriptContext.response.write(onclickScript);
		response.write(onclickScript);
		}catch(e)
		{
			nlapiLogExecution('ERROR', 'e in main', e.toString());
		}
	}
function SendEmailHistory(leaseid,receipients,subject,message_body)
{
	try{
		var recobj = nlapiCreateRecord('customrecord_collection_dash_email_hist')
	recobj.setFieldValue('custrecord_email_history_lease',leaseid);
	recobj.setFieldValue('custrecord_email_history_receipients',receipients);
	recobj.setFieldValue('custrecord_email_history_subject',subject);
	recobj.setFieldValue('custrecord_email_history_message',message_body);
	var id  =nlapiSubmitRecord(recobj,true,true);
	return id;
	}catch(e)
	{
		nlapiLogExecution('ERROR', 'e', e.toString());
	}
	
}	
}
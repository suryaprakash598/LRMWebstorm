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
function suitelet(request, response) {

    if (request.getMethod() == 'GET') {
        try {
            var repoid = request.getParameter('repo'); 

            var form = nlapiCreateForm('Email Setup', true);

            form.addSubmitButton('Send');

            form.setScript('customscript_ez_csat_email_sent');

            var fldGrp = form.addFieldGroup('fldgroup', 'Field Group');
            fldGrp.setShowBorder(false);
            fldGrp.setSingleColumn(true);
			
            var select = form.addField('custpage_temp_termination', 'select', 'Template', 'customrecord_termination_email_template', 'fldgroup').setMandatory(true);
              
            var _repoid = form.addField('custpage_repoid', 'text', 'OFR ID', null, 'fldgroup').setMandatory(true);
            var subject = form.addField('custpage_subject', 'text', 'Subject', null, 'fldgroup').setMandatory(true);
            var cust_name = form.addField('custpage_name', 'SELECT', 'Customer Name', 'customer', 'fldgroup').setMandatory(true).setDisplayType('disabled');
            var cust_email = form.addField('custpage_email', 'email', 'To', null, 'fldgroup').setMandatory(true); //.setDisplayType('disabled');
            var Cc = form.addField('custpage_cc', 'email', 'Cc', null, 'fldgroup');
            var msg = form.addField('custpage_msg', 'richtext', 'Message', null, 'fldgroup');
            var VinTextField = form.addField('custpage_vin_text', 'text', 'Vin', null, 'fldgroup').setDisplayType('hidden');
			nlapiLogExecution('debug','repoid',repoid);
			_repoid.setDefaultValue(repoid);
			_repoid.setDisplayType('hidden');
			if(repoid)
			{
				var lms_ofr_Search = nlapiSearchRecord("customrecord_lms_ofr_",null,
					[
					   ["internalid","anyof",repoid]
					], 
					[
					   new nlobjSearchColumn("custrecord_ofr_customer"), 
					   new nlobjSearchColumn("email","CUSTRECORD_OFR_CUSTOMER",null),
                       new nlobjSearchColumn("custrecord_ofr_vin"), 
					]
					);
					var customer = '';
					var email='';
                    var VinText = '';
					if(lms_ofr_Search && lms_ofr_Search.length)
					{
						for(var i=0;i<lms_ofr_Search.length;i++)
						{
							customer = lms_ofr_Search[i].getValue('custrecord_ofr_customer');
							email = lms_ofr_Search[i].getValue("email","CUSTRECORD_OFR_CUSTOMER");
                            VinText = lms_ofr_Search[i].getText('custrecord_ofr_vin');
						}
					}
					cust_name.setDefaultValue (customer);
					cust_email.setDefaultValue (email);
                    VinTextField.setDefaultValue(VinText);
			}
        } catch (e) {
            nlapiLogExecution('ERROR', 'INFO', e.message);
        }

        response.writePage(form);
    } else {
        var temp_id = request.getParameter('custpage_temp_termination');
        var customer_id = request.getParameter('custpage_field');
        var email = request.getParameter('custpage_email');
        var recepient = request.getParameter('custpage_email');
        var cc = request.getParameter('custpage_cc');
        var bcc = request.getParameter('custpage_bcc');
        var subject = request.getParameter('custpage_subject');
        var repo_id = request.getParameter('custpage_repoid');
        var msgbox  = request.getParameter('custpage_msg');

        nlapiLogExecution('ERROR', 'email', email);
        nlapiLogExecution('ERROR', 'repo_id', repo_id);
        nlapiLogExecution('ERROR', 'temp_id', temp_id);

        var repoRecObj = nlapiLoadRecord('customrecord_lms_ofr_', repo_id);
		var VinText = repoRecObj.getFieldText("custrecord_ofr_vin");
        var customerText = repoRecObj.getFieldText("custrecord_ofr_customer");
        var customerId = repoRecObj.getFieldValue("custrecord_ofr_customer");

        var CustomerFields		=	new Array();
        CustomerFields.push("firstname");
        CustomerFields.push("lastname");
        
        var customerRec		=	nlapiLookupField("customer", customerId, CustomerFields);
        var firstName		=	customerRec.firstname;
        var lastname		=	customerRec.lastname;

        var filter = new Array();
        filter[0] = new nlobjSearchFilter('internalid', null, 'is', temp_id);

        var search = nlapiSearchRecord('customrecord_termination_email_template', 'customsearch_termination_email_template', filter, null);
		 nlapiLogExecution('ERROR', 'search.length', search.length);
         
        var temp_body = ''; 
        var temp_subject = ''; 
        var message_body = '';
        var temp_mid = '';
        var temp_end_c = '';
      
        temp_body=" Vin :"+VinText+"<br/><br/>"
        for (var i = 0; search != null && i < search.length; i++) {
            var res = search[i];
            var col = res.getAllColumns();
            temp_subject = res.getValue(col[0]);
            temp_body = res.getValue(col[1]); 
            temp_mid = res.getValue(col[2]); 
            temp_end_c = res.getValue(col[3]); 
        }

        var html = '';

        //message_body+=  "<b>"+customerText+"</b><br/><br/>"+temp_body+"<br/><mark>"+temp_mid+"</mark><br/><br/>"+"Vin: <b>"+VinText+"</b><br/><br/>"+temp_end_c+"<br/><b>LRM Leasing</b>" ;
        message_body= msgbox;//nlapiEscapeXML(msgbox);
        var user_id = nlapiGetUser();
        var records_merge = new Object();
        records_merge['customrecord_lms_ofr_'] = repo_id;
		//nlapiRequestURL(url,postdata,headers,callback,method)
		//var resobj = nlapiRequestURL('https://8760954.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1654&deploy=1&compid=8760954&ns-at=AAEJ7tMQQUzQbQxnO8QyfddM7M7SBs35Gm0RxMRMkmaNKOfdI-A&ofrid='+repo_id)
		//nlapiLogExecution('ERROR', 'fileid', resobj.getBody());
		//var objres = '';//JSON.parse(resobj.getBody());
		var fileobj ='';// nlapiLoadFile(objres.file);
        if ((cc != '' && cc != null && cc != undefined) && (bcc != '' && bcc != null && bcc != undefined)) {
            nlapiSendEmail(user_id, email, temp_subject, message_body, cc, bcc, records_merge, fileobj);
			//nlapiSendEmail(from,to,subject,body,cc,bcc,records,files)

        } else if ((bcc != '' && bcc != null && bcc != undefined) && (cc == '' && cc == null && cc == undefined)) {
            nlapiSendEmail(user_id, email, temp_subject, message_body, null, bcc, records_merge, fileobj);
        } else if ((bcc == '' && bcc == null && bcc == undefined) && (cc != '' && cc != null && cc != undefined)) {
            nlapiSendEmail(user_id, email, temp_subject, message_body, cc, null, records_merge, fileobj);
        } else {
            nlapiSendEmail(user_id, email, temp_subject, message_body, null, null, records_merge, fileobj);
        }
      
        nlapiSubmitField('customrecord_lms_ofr_',repo_id,"custrecord_followup_letter","T"); //ABD
      
        var form = nlapiCreateForm('Mail Sent Successfully', true);
        //form.setScript('customscript_ez_csat_email_sent');
        var onclickScript = " <html><body> <script type='text/javascript'>";

        onclickScript += "try{";

        onclickScript += "window.close()"; //window.close();
        onclickScript += "}catch(e){}</script></body></html>";
        //	scriptContext.response.write(onclickScript);
        response.write(onclickScript);
    }
}
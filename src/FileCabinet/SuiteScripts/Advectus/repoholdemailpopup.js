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
			
            var select = form.addField('custpage_temp_hold', 'select', 'Template', 'customrecord_hold_email_template', 'fldgroup').setMandatory(true);
              
            var _repoid = form.addField('custpage_repoid', 'text', 'OFR ID', null, 'fldgroup').setMandatory(true);
            var subject = form.addField('custpage_subject', 'text', 'Subject', null, 'fldgroup').setMandatory(true);
            var cust_name = form.addField('custpage_name', 'SELECT', 'Customer Name', 'customer', 'fldgroup').setMandatory(true).setDisplayType('disabled');
            var cust_email = form.addField('custpage_email', 'email', 'To', null, 'fldgroup').setMandatory(true); //.setDisplayType('disabled');
            var Cc = form.addField('custpage_cc', 'email', 'Cc', null, 'fldgroup');
            var msg = form.addField('custpage_msg', 'richtext', 'Message', null, 'fldgroup');
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
					   new nlobjSearchColumn("custrecord_repo_company_email","CUSTRECORD_ADVS_REPO_COMPANY",null)
					]
					);
					var customer = '';
					var email='';
					if(lms_ofr_Search && lms_ofr_Search.length)
					{
						for(var i=0;i<lms_ofr_Search.length;i++)
						{
							customer = lms_ofr_Search[i].getValue('custrecord_ofr_customer');
							email = lms_ofr_Search[i].getValue("custrecord_repo_company_email","CUSTRECORD_ADVS_REPO_COMPANY");
						}
					}
					cust_name.setDefaultValue (customer);
					cust_email.setDefaultValue (email);
			}
        } catch (e) {
            nlapiLogExecution('ERROR', 'INFO', e.message);
        }

        response.writePage(form);
    } else {
        var temp_id = request.getParameter('custpage_temp_hold');
        var customer_id = request.getParameter('custpage_field');
        var email = request.getParameter('custpage_email');
        var recepient = request.getParameter('custpage_email');
        var cc = request.getParameter('custpage_cc');
        var bcc = request.getParameter('custpage_bcc');
        var subject = request.getParameter('custpage_subject');
        var repo_id = request.getParameter('custpage_repoid');

        nlapiLogExecution('ERROR', 'email', email);
        nlapiLogExecution('ERROR', 'repo_id', repo_id);
        nlapiLogExecution('ERROR', 'temp_id', temp_id);

        if(repo_id){
            var filterss = new Array();
            var columnn = new Array();
            filterss.push(["internalid", "is", repo_id]);
            columnn[0] = new nlobjSearchColumn('custrecord_ofr_customer');
            columnn[1] = new nlobjSearchColumn('custrecord_ofr_vin');
            columnn[2] = new nlobjSearchColumn('custrecord_ofr_year');
            columnn[3] = new nlobjSearchColumn('custrecord_ofr_make');
            columnn[4] = new nlobjSearchColumn('custrecord_ofr_model');
            columnn[5] = new nlobjSearchColumn('custrecord_advs_ofr_color');
            columnn[6] = new nlobjSearchColumn('custrecord_advs_repo_company');
            
    
            var repoSearch = nlapiCreateSearch('customrecord_lms_ofr_', filterss, columnn);
                var run = repoSearch.runSearch();
                var col = run.getColumns();
                var temp_subject = '';
                var temp_body = '';
                var temp_customer = '';
                var temp_stock = '';
                var temp_year = '';
                var temp_make = '';
                var temp_model = '';
                var temp_color = '';
                var temp_repo_company = '';
                var Overallsub = '';
                var OverallBody = '';
                run.forEachResult(function (res){
                    temp_customer = res.getText(col[0]);
                    temp_stock = res.getText(col[1]);
                    var lsttemp_stock = temp_stock.slice(-6);
                    temp_year = res.getText(col[2]);
                    temp_make = res.getText(col[3]);
                    temp_model = res.getText(col[4]);
                    temp_color = res.getText(col[5]);
                    temp_repo_company = res.getText(col[6]);
    
                    Overallsub = "OFR:  "+temp_customer+" Stock # : "+lsttemp_stock+"";
                    OverallBody = "Authorization to Repossess and or Transport <br/>Att: "+temp_repo_company+"<br/>Year: "+temp_year+"<br/>Make: "+temp_make+"<br/>Color:"+temp_color+"<br/>Vin: "+temp_stock+"<br/>"+
                    "<br/>Lessee's Name: "+temp_customer+"<br/>"+
                    "This document serves as your authorization to act as an agent of LRM Leasing Company Inc. (&quot;LRM Leasing Co.&quot;) to collect, recover, and/or transport the above-listed equipment and lessee vehicle(s).LRM Leasing Co. affirms that it is the true and lawful owner of the referenced equipment and vehicles."+
                    "LRM Leasing Co. affirms that it is the true and lawful owner of the referenced equipment and vehicles. LRM Leasing Co. agrees to indemnify and hold you, your company, its affiliates, employees, and agents harmless "+
                    "from and against all claims, damages, losses, and actions, including reasonable attorney fees, that result from or arise out of your efforts to collect, recover, and/or transport the equipment and vehicles as "+
                    "authorized by this agreement. This indemnification does not apply to claims, damages, losses, or actions caused by negligence, misconduct, or unauthorized acts committed by you, your company, its affiliates, employees, or agents. "+
                    "It is expressly understood that nothing in this agreement shall be construed to authorize you or your "+
                    "company to violate any applicable city, county, or state laws or regulations during the performance of your duties under this authorization.<br/><br/><br/>"+
                    "Regards,<br/><br/>"+ 
                    "LRM Leasing Management";
                    
                    return true;
                });
        }

        var filter = new Array();
        filter[0] = new nlobjSearchFilter('internalid', null, 'is', temp_id);

        var search = nlapiSearchRecord('customrecord_hold_email_template', 'customsearch_template_search_hold', filter, null);
		 nlapiLogExecution('ERROR', 'search.length', search.length);
         
        var temp_body = ''; 
        var temp_subject = ''; 
        //		var subject = '';
        for (var i = 0; search != null && i < search.length; i++) {
            var res = search[i];
            var col = res.getAllColumns();
            temp_body = res.getValue(col[0]); 
            
            temp_subject = res.getValue(col[1]);
        }

        var html = '';

        var message_body =  temp_body ;

        var user_id = nlapiGetUser();
        var records_merge = new Object();
        records_merge['customrecord_lms_ofr_'] = repo_id;
		//nlapiRequestURL(url,postdata,headers,callback,method)
		var resobj = nlapiRequestURL('https://8760954.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1654&deploy=1&compid=8760954&ns-at=AAEJ7tMQQUzQbQxnO8QyfddM7M7SBs35Gm0RxMRMkmaNKOfdI-A&ofrid='+repo_id)
		nlapiLogExecution('ERROR', 'fileid', resobj.getBody());
		var objres = JSON.parse(resobj.getBody());
		var fileobj = nlapiLoadFile(objres.file);
        if ((cc != '' && cc != null && cc != undefined) && (bcc != '' && bcc != null && bcc != undefined)) {
            nlapiSendEmail(user_id, email, Overallsub, OverallBody, cc, bcc, records_merge, fileobj);
			//nlapiSendEmail(from,to,subject,body,cc,bcc,records,files)

        } else if ((bcc != '' && bcc != null && bcc != undefined) && (cc == '' && cc == null && cc == undefined)) {
            nlapiSendEmail(user_id, email, Overallsub, OverallBody, null, bcc, records_merge, fileobj);
        } else if ((bcc == '' && bcc == null && bcc == undefined) && (cc != '' && cc != null && cc != undefined)) {
            nlapiSendEmail(user_id, email, Overallsub, OverallBody, cc, null, records_merge, fileobj);
        } else {
            nlapiSendEmail(user_id, email, Overallsub, OverallBody, null, null, records_merge, fileobj);
        }

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
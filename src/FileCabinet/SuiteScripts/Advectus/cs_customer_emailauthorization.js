/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/search', 'N/url','N/currentRecord','N/https'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     */
    function (record, runtime, search, url,currentRecord,https) {

    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {

        var CurrentRecord = scriptContext.currentRecord;
			window.addEventListener('beforeunload', function (e) {
						e.preventDefault();
						e.returnValue = '';
						//e.stopPropagation();
					}); 
    }
	function fieldChanged(scriptContext)
	{
		if(scriptContext.fieldId=='custpage_template')
		{
			var emaildata = getemaildata();
			var CurrentRecord = scriptContext.currentRecord;
			CurrentRecord.setValue({fieldId:'custpage_template_subject',value:emaildata.emailsubject,ignoreFieldChange:true});
			CurrentRecord.setValue({fieldId:'custpage_template_message',value:emaildata.emailbody,ignoreFieldChange:true});
		}
	}
    function saveRecord(scriptContext) {
       
    }

    function getParameterFromURL(param) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == param) {
                return decodeURIComponent(pair[1]);
            }
        }
        return (false);
    }

    function popupCenter(stock) {
        var title = '';
        var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1644&deploy=1&repo=' + stock;
        var left = (screen.width / 2) - (500 / 2);
        var top = (screen.height / 2) - (500 / 2);
        var targetWin = window.open(url, title);

    }
	function approvejob(estid)
	{
		//alert('approve');
		var CurrentRecord =  currentRecord.get();
        var LineCount = CurrentRecord.getLineCount({
            sublistId: "custpage_sublist"
        });
		var arr=[];
		for(var i=0;i<LineCount;i++)
		{
			var ismarked = CurrentRecord.getSublistValue({sublistId:'custpage_sublist',fieldId:'cust_mark',line:i});
			var item = CurrentRecord.getSublistValue({sublistId:'custpage_sublist',fieldId:'cust_job_item',line:i});
			var itemid = CurrentRecord.getSublistValue({sublistId:'custpage_sublist',fieldId:'cust_job_item_id',line:i});
			var jobval = CurrentRecord.getSublistValue({sublistId:'custpage_sublist',fieldId:'cust_job_jobval',line:i});
			if(ismarked)
			{
				arr.push({
					'item':itemid,
					'job':jobval
				})
			}
		}
		if(arr.length<=0)
		{
			alert('Please select atleast one job');
			return false;
		}
		 var dataFromRestlet = https.post({
                url: 'https://8760954.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1663&deploy=1&compid=8760954&ns-at=AAEJ7tMQbL5LaWEXJw9abU_hqWVy7bwuKsK5WrhIKmkNi1PBELE&estimateid='+estid+'&operation=approve&topost=T&data='+JSON.stringify(arr)
            });
             console.log(dataFromRestlet.body);
			var body=JSON.parse(dataFromRestlet.body)
			if(body.success)
			{
				alert('Thankyou!! Your jobs are approved and proceed further');
				
				//window.location.close();
				window.open('', '_self', ''); window.close();
			} 
			
		//record.submitFields({type:'estimate',id:estid,values:{custbody_approve_reject_data:JSON.stringify(arr)},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
	}

	function rejectjob(estid)
	{
		//alert('reject');
		var CurrentRecord =  currentRecord.get();
        var LineCount = CurrentRecord.getLineCount({
            sublistId: "custpage_sublist"
        });
		var arr=[]; var rr=[];
		for(var i=0;i<LineCount;i++)
		{
			var ismarked = CurrentRecord.getSublistValue({sublistId:'custpage_sublist',fieldId:'cust_mark',line:i});
			var item = CurrentRecord.getSublistValue({sublistId:'custpage_sublist',fieldId:'cust_job_item',line:i});
			var itemid = CurrentRecord.getSublistValue({sublistId:'custpage_sublist',fieldId:'cust_job_item_id',line:i});
			var jobval = CurrentRecord.getSublistValue({sublistId:'custpage_sublist',fieldId:'cust_job_jobval',line:i});
			var rejectreason = CurrentRecord.getSublistValue({sublistId:'custpage_sublist',fieldId:'cust_job_rejectreason',line:i});
			if(ismarked)
			{
				arr.push({
					'item':itemid,
					'job':jobval,
					'rr':rejectreason
				});
				rr.push(rejectreason);
			}
		}
		if(arr.length<=0)
		{
			alert('Please select atleast one job');
			return false;
		}
		if(arr.length!=rr.length)
		{
			alert('Please Enter Reject reason for job');
			return false;
		}
		 var dataFromRestlet = https.post({
                url: 'https://8760954.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1663&deploy=1&compid=8760954&ns-at=AAEJ7tMQbL5LaWEXJw9abU_hqWVy7bwuKsK5WrhIKmkNi1PBELE&estimateid='+estid+'&operation=reject&topost=T&data='+JSON.stringify(arr)
            });
             console.log(dataFromRestlet.body);
			var body=JSON.parse(dataFromRestlet.body)
			if(body.success)
			{
				alert('Thankyou!! Your jobs are Rejected and proceed further');
				
				//window.location.close();
				window.open('', '_self', ''); window.close();
			} 
	}
	function getemaildata()
	{
		 var customrecord_operation_authorization_temSearchObj = search.create({
			   type: "customrecord_operation_authorization_tem",
			   filters:
			   [
				  ["isinactive","is","F"]
			   ],
			   columns:
			   [
				  "name",
				  "custrecord_authjob_email_subject",
				  "custrecord_authjob_email_body"
			   ]
			});
			var searchResultCount = customrecord_operation_authorization_temSearchObj.runPaged().count;
			log.debug("customrecord_operation_authorization_temSearchObj result count",searchResultCount);
			var emailsubject='';
			var emailbody='';
			customrecord_operation_authorization_temSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
			  emailsubject =  result.getValue({name:'custrecord_authjob_email_subject'});
			  emailbody =  result.getValue({name:'custrecord_authjob_email_body'});
			   return true;
			});
			var obj={};
			obj.emailsubject =emailsubject;
			obj.emailbody =emailbody;
			return obj;
	}
    return {
        pageInit: pageInit, 
        saveRecord: saveRecord,
		fieldChanged:   fieldChanged,
		approvejob:approvejob,
		rejectjob:rejectjob
    };

});
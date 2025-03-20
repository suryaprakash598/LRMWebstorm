/*******************************************************************************
{{ScriptHeader}} *
 * Company:                  {{Company}}
 * Author:                   {{Name}} - {{Email}}
 * File:                     {{ScriptFileName}}
 * Script:                   {{ScriptTitle}}
 * Script ID:                {{ScriptID}}
 * Version:                  1.0
 *
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 *
 ******************************************************************************/

define(['N/runtime',  'N/record', 'N/search', 'N/log','N/ui/serverWidget'], function(
  /** @type {import('N/runtime')} 		**/ runtime,
  /** @type {import('N/record')}  		**/ record,
  /** @type {import('N/search')}  		**/ search,
  /** @type {import('N/log')}     		**/ log,
  /** @type {import('N/serverWidget')}  **/ serverWidget
) {

  /**
   * context.request
   * context.response
   *
   * @type {import('N/types').EntryPoints.Suitelet.onRequest}
   */
  function onRequest(context) {
	   try{
		    var request 	=   context.request;
            var response    =   context.response;
		    var form =   serverWidget.createForm({title:"History"});
			var leaseid = request.parameters.custparam_recid;
			
			var tasksublist = addSublist(form, "custpage_subtabtask", "Tasks",false,'trans');
			//var notessublist = addSublist(form, "custpage_subtabnotes", "Notes",false,'trans');
			var emailsublist = addSublist(form, "custpage_subtabemails", "Emails",false,'trans');
			
			var tasksObj = getTasks(leaseid);
			addTaskSublistFields(tasksublist);
			addTasksLines(tasksObj,tasksublist)
			
			var emailsObj = getEmails(leaseid);
			addEmailSublistFields(emailsublist);
			addEmailLines(emailsObj,emailsublist)
			
			
			
			
			
			
			response.writePage(form);
	   }catch(e)
	   {
		   log.debug('error',e.toString());
	   }
  }
function addSublist(form, tabId, tabLabel,requiredTaskinfo,type) {
            form.addTab({ id: tabId, label: tabLabel });

            var sublist = form.addSublist({
                id: "custpage_sublist_" + tabId,
                type: serverWidget.SublistType.LIST,
                label: " ",
                tab: tabId
            }); 
           
			return sublist;
        }
function addTaskSublistFields(sublist){ 

	sublist.addField({
		id: 'cust_fi_list_title',
		type: serverWidget.FieldType.TEXT,
		label: 'Title'
	});
	 
	/*sublist.addField({
		id: 'cust_fi_list_status',
		type: serverWidget.FieldType.TEXT,
		label: 'Status'
	});*/
	sublist.addField({
		id: 'cust_fi_list_startdate',
		type: serverWidget.FieldType.TEXT,
		label: 'Start Date'
	});
	sublist.addField({
		id: 'cust_fi_list_message',
		type: serverWidget.FieldType.TEXT,
		label: 'Message'
	});

}
function getTasks(leaseid){
	try{
      log.debug('leaseid',leaseid);
		var taskSearchObj = search.create({
		   type: "task",
		   filters:
		   [
			  ["status","anyof","PROGRESS","NOTSTART","COMPLETE"], 
			  "AND", 
			  ["custevent_advs_lease_link","anyof",leaseid]
		   ],
		   columns:
		   [
			  "title",
			  "priority",
			  "status",
			  "startdate",
			  "duedate",
			  "accesslevel",
			  "assigned",
			  "company",
			  "message",
			  "custevent_advs_task_critical",
			  "custevent_advs_mm_task_type",
			  "custevent_task_impounded",
			  "custevent_task_lease_pay_off",
			  "custevent_advs_broken_promis",
			  "custevent_advs_tbf_is_frm_dash",
			  "custevent_advs_crm_remark"
		   ]
		});
		var searchResultCount = taskSearchObj.runPaged().count;
		log.debug("taskSearchObj result count",searchResultCount);
		 return taskSearchObj;

		 
	}catch(e)
	{
		log.debug('error',e.toString());
	}
}
function addTasksLines(tasksObj,sublist){
			try{
				var count=0;
				tasksObj.run().each(function(result){
			    
				var name = result.getValue({
					name: 'title'
				});
				var status = result.getValue({
					name: 'status'
				});
				var startdate = result.getValue({
					name: 'startdate'
				});
				var message = result.getValue({
					name: 'message'
				});
				sublist.setSublistValue({id:"cust_fi_list_title",line:count,value:name});
				//sublist.setSublistValue({id:"cust_fi_list_status",line:count,value:status});
				sublist.setSublistValue({id:"cust_fi_list_startdate",line:count,value:startdate});
				sublist.setSublistValue({id:"cust_fi_list_message",line:count,value:message||' '});
				count++;
				return true;
				});
			}catch(e)
			{
				log.debug('error',e.toString());
			}
		}
function addEmailSublistFields(sublist){
	sublist.addField({
		id: 'cust_fi_list_receipient',
		type: serverWidget.FieldType.TEXT,
		label: 'Receipient'
	});
	sublist.addField({
		id: 'cust_fi_list_datesent',
		type: serverWidget.FieldType.TEXT,
		label: 'Date'
	});
	 
	sublist.addField({
		id: 'cust_fi_list_subject',
		type: serverWidget.FieldType.TEXT,
		label: 'Subject'
	});
	sublist.addField({
		id: 'cust_fi_list_emailmessage',
		type: serverWidget.FieldType.TEXTAREA,
		label: 'Message'
	});
} 
function getEmails(leaseid){
	var customrecord_collection_dash_email_histSearchObj = search.create({
   type: "customrecord_collection_dash_email_hist",
   filters:
   [
      ["custrecord_email_history_lease","anyof",leaseid]
   ],
   columns:
   [
      "custrecord_email_history_lease",
      "created",
      "custrecord_email_history_receipients",
      "custrecord_email_history_message",
      "custrecord_email_history_subject"
   ]
});
 return customrecord_collection_dash_email_histSearchObj;
}
function addEmailLines(emailsObj,sublist){
			try{
				var count1=0;
				emailsObj.run().each(function(result){
			    
				var Receipient = result.getText({
					name: 'custrecord_email_history_receipients'
				});
				var message = result.getValue({
					name: 'custrecord_email_history_message'
				});
				var subject = result.getValue({
					name: 'custrecord_email_history_subject'
				});
				var created = result.getValue({
					name: 'created'
				});
				sublist.setSublistValue({id:"cust_fi_list_receipient",line:count1,value:Receipient});
				sublist.setSublistValue({id:"cust_fi_list_emailmessage",line:count1,value:message});
				sublist.setSublistValue({id:"cust_fi_list_subject",line:count1,value:subject});
				sublist.setSublistValue({id:"cust_fi_list_datesent",line:count1,value:created});
				count1++;
				return true;
				});
			}catch(e)
			{
				log.debug('error',e.toString());
			}
		}

 return {
    'onRequest': onRequest
  };

});

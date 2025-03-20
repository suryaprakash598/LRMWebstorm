/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *@NAmdConfig ./configuration.json
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url','underscore','N/config','N/file'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (record, runtime, search, serverWidget, url,underscore,config,file) => {
    /**
     * Defines the Suitelet script trigger point.
     * @param {Object} scriptContext
     * @param {ServerRequest} scriptContext.request - Incoming request
     * @param {ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    const onRequest = (scriptContext) => {

        var request = scriptContext.request;
        var response = scriptContext.response;
        log.debug('request.method', request.method);
        if (request.method == "GET") {
            var form = serverWidget.createForm({
                title: "Approval Estimate Jobs"
            });
			var info = config.load({type:config.Type.COMPANY_INFORMATION});
			var logoid =info.getValue({fieldId:'formlogo'});
			log.debug({title:'Current company Info', details:logoid});
			
            var currScriptObj = runtime.getCurrentScript();

            var estimateID = request.parameters.estimateid || '';
            var soid = request.parameters.soid || '';
            var isFromClient = request.parameters.toGet || 'F';
            //log.debug('estimateID', estimateID);

            var scriptId = currScriptObj.id;
            var deploymentId = currScriptObj.deploymentId;
			if(soid){
				var data =searchForSOJobsAssociated(soid);
				 var jobdatafield = form.addField({
						id : 'custpage_jobs_data',
						type : serverWidget.FieldType.INLINEHTML,
						label : 'jobs'
					});
					sethtmltable(jobdatafield,data,logoid);
				 var sublist = form.addSublist({
                        id: "custpage_sublist",
                        type: serverWidget.SublistType.LIST,
                        label: "List"
						
                    });
					 
                    //sublist.addMarkAllButtons();
                    //addFields(sublist,isFromClient);
                    //addData(sublist, data,isFromClient);
			}
           

            form.addButton({
                id: '_approve',
                label: 'Submit',
                functionName: 'approvejob(' + soid + ')'
            });
            form.clientScriptModulePath = "./cs_approvejobsfromEmail.js";
            response.writePage(form);
        }
		else {
            var topost = scriptContext.request.parameters.topost || '';
            var estimateid = scriptContext.request.parameters.estimateid || '';
            var soid = scriptContext.request.parameters.soid || '';
            var data = scriptContext.request.parameters.data || [];
            var operation = scriptContext.request.parameters.operation || '';
			var customer = '';
			var vin='';
            log.debug('topost', topost);
            log.debug('soid', soid);
            log.debug('data', data);
			 var pdata = JSON.parse(data);
			 var itemData = [];
            if (soid) { 

                var objRecord = record.load({
                    type: 'salesorder',
                    id: soid,
                    isDynamic: !0
                });
				customer = objRecord.getValue({fieldId:'entity'});
				vin = objRecord.getText({fieldId:'custbody_advs_st_service_equipment'});
                var count = objRecord.getLineCount({
                    sublistId: 'item'
                });
                log.debug('count', count);
				
                for (var k = 0; k < count; k++) {
                    objRecord.selectLine({
                        sublistId: 'item',
                        line: k
                    });
                    var item = objRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item'
                    });
					var itemtype = objRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_advs_selected_inventory_type'
                    });
                    var rjob = objRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_advs_job_code'//custcol_advs_repair_task_link
                    });
					var linejobname = objRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_advs_line_job_name'//custcol_advs_repair_task_link
                    });
                    for (var i = 0; i < pdata.length; i++) {

                        if (linejobname == pdata[i].jobname ) {//&& rjob == pdata[i].job
						
                            var approved = false;
                            var rejected = false;
							var status = 0;
                            if (pdata[i].jobstatus == 'approve') {
                                approved = true;
								status=1;
                            }
                            if (pdata[i].jobstatus == 'reject') {
                                rejected = true;
								status=2;
                            }
							 var itemName = objRecord.getCurrentSublistValue({
										sublistId: 'item',
										fieldId: 'item_display'
									}); 
									var itemAmount = objRecord.getCurrentSublistValue({
										sublistId: 'item',
										fieldId: 'amount'
									});
									var jobidtemp = objRecord.getCurrentSublistValue({
										sublistId: 'item',
										fieldId: 'custcol_advs_st_temp_task_id'
									});
									var obj={};
									obj.itemName =itemName;
									obj.itemAmount =itemAmount;
									obj. status   =status;
									obj. jobname   =linejobname;
									obj. itemtype   =itemtype;
									obj. jobidtemp   =jobidtemp;
									itemData.push(obj); 
									pdata[i].itemName = itemName;
									pdata[i].itemAmount = itemAmount;
									pdata[i].status = status;
									pdata[i].jobidtemp = jobidtemp;
                            objRecord.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_is_cust_approved_job',
                                value: approved,
                                ignoreFieldChange: true
                            });
                            objRecord.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcolis_cust_rejected_job',
                                value: rejected,
                                ignoreFieldChange: true
                            });
                            objRecord.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_job_approval_status',
                                value: status,
                                ignoreFieldChange: true
                            });
                            objRecord.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_job_reject_reason',
                                value: pdata[i].rr,
                                ignoreFieldChange: true
                            });

                        }
                    }
                    objRecord.commitLine({
                        sublistId: 'item'
                    });
                }

                objRecord.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: !0
                });
				//CREATE HISTORY RECORD
			 log.debug('pdata',pdata);
					 for(var j=0;j<pdata.length;j++){
						  var recobj = record.create({type:'customrecord_operation_authorization_his',isDynamic:!0});
						//objRecord.setValue({fieldId:'item',value:true,ignoreFieldChange:true});
						recobj.setValue({fieldId:'custrecord_authorization_type',value:2});  //external 
					    recobj.setValue({fieldId:'custrecord_authorize_operation_notes',value:pdata[j].RejectReason});
						recobj.setValue({fieldId:'custrecord_authorize_operation_method',value:4});
						recobj.setValue({fieldId:'custrecord_authorization_customer',value:customer});
						recobj.setValue({fieldId:'custrecord_authorization_date_time',value:new Date()});
						recobj.setValue({fieldId:'custrecord_operation_authorization_vin',value:vin});
						
						recobj.setValue({fieldId:'custrecord_authorize_operation_status',value:pdata[j].status}); 
						recobj.setValue({fieldId:'custrecord_salesorder',value:soid});
						recobj.setValue({fieldId:'custrecord_authorization_jobname',value:pdata[j].jobname});
						var sublist ='recmachcustrecord_authhis_operation_parent';
						
						 for (var i = 0; i < itemData.length; i++) {
							// log.debug('itemData[i].jobname == pdata[j].jobname',(itemData[i].jobname == pdata[j].jobname));
							 if(itemData[i].jobname == pdata[j].jobname){
								 if(itemData[i].itemtype==9 ||itemData[i].itemtype==19 || itemData[i].itemtype==4){
									 continue;
								 }
								 recobj.selectNewLine({sublistId:sublist});
								recobj.setCurrentSublistValue({sublistId:sublist,fieldId:'custrecord_authhis_operation_name',value:itemData[i].itemName,ignoreFieldChange:true});
								recobj.setCurrentSublistValue({sublistId:sublist,fieldId:'custrecord_authhis_operation_price',value:itemData[i].itemAmount,ignoreFieldChange:true});
								recobj.setCurrentSublistValue({sublistId:sublist,fieldId:'custrecord_authhis_operation_apprstatus',value:true,ignoreFieldChange:true});
								//recobj.setCurrentSublistValue({sublistId:sublist,fieldId:'custrecord_authorize_operation_status',value:itemData[i].status,ignoreFieldChange:true}); 
								//recobj.setCurrentSublistValue({sublistId:sublist,fieldId:'custrecord_salesorder',value:soid,ignoreFieldChange:true});
								//recobj.setCurrentSublistValue({sublistId:sublist,fieldId:'custrecord_authorization_jobname',value:itemData[i].linejobname,ignoreFieldChange:true});
								recobj.commitLine({sublistId:sublist});
							 }
							
						}
					
                   var id= recobj.save();
				   if(pdata[j].jobidtemp!=''){
				   record.submitFields({type:'customrecord_advs_task_record',id:pdata[j].jobidtemp,values:{custrecord_advs_job_approval_status:pdata[j].status},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
					 }
					 }
                   
                //record.submitFields({type:'customrecord_advs_task_record',id:,values:{custrecord_is_cust_approved:true},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
            }

            var obj = {};
            obj.success = true;
			obj.data = pdata;
            scriptContext.response.write(JSON.stringify(obj));

        }
    }

    function searchForJobsAssociated(estimateID) {
        try {
            var estimateSearchObj = search.create({
                type: "estimate",
                filters: [
                    ["type", "anyof", "Estimate"],
                    "AND",
                    ["mainline", "is", "F"],
                    "AND",
                    ["custcol_advs_selected_inventory_type", "anyof", "3", "2"],
                    "AND",
                    ["internalid", "anyof", estimateID]
                ],
                columns: [
                    "item",
                    "quantity",
                    "amount",
                    "custcol_advs_job_code",
                    "custcol_advs_temp_rep_task123",
                    "custcol_job_approval_status",
                    "custcol_job_reject_reason",
                    search.createColumn({
                        name: "custrecord_st_o_p_m_description",
                        join: "CUSTCOL_ADVS_JOB_CODE"
                    })
                ]
            });
            var arr = [];
            var searchResultCount = estimateSearchObj.runPaged().count;
            log.debug("estimateSearchObj result count", searchResultCount);
            estimateSearchObj.run().each(function (result) {
                var obj = {};
                obj.item = result.getValue({
                    name: 'item'
                });
                obj.itemText = result.getText({
                    name: 'item'
                });
                obj.jobcodeval = result.getValue({
                    name: 'custcol_advs_job_code'
                });
                obj.jobcodeText = result.getText({
                    name: 'custcol_advs_job_code'
                });
                obj.jobdesc = result.getValue({
                    name: "custrecord_st_o_p_m_description",
                    join: "CUSTCOL_ADVS_JOB_CODE"
                });
				obj.approvalStatus = result.getValue({
                    name: 'custcol_job_approval_status'
                });
				obj.RejectReason = result.getValue({
                    name: 'custcol_job_reject_reason'
                });
                arr.push(obj);
                return true;
            });
          //  log.debug('arr', arr);
            return arr;

        } catch (e) {
            log.debug('error', e.toString());
        }
    }
	function searchForSOJobsAssociated(soid) {
        try {
            var estimateSearchObj = search.create({
                type: "salesorder",
                filters: [
                    ["type", "anyof", "SalesOrd"],
                    "AND",
                    ["mainline", "is", "F"],
                   /*  "AND",
                    ["custcol_advs_selected_inventory_type", "anyof", "3", "2"], */
                    "AND",
                    ["internalid", "anyof", soid]
                ],
                columns: [
                    "item",
                    "quantity",
                    "amount",
                    "custcol_advs_job_code",
                    "custcol_advs_temp_rep_task123",
                    "custcol_job_approval_status",
                    "custcol_job_reject_reason",
                    "custcol_advs_line_job_name",
					"custcol_advs_st_temp_task_id",
                    search.createColumn({
                        name: "custrecord_st_o_p_m_description",
                        join: "CUSTCOL_ADVS_JOB_CODE"
                    })
                ]
            });
            var arr = [];
            var searchResultCount = estimateSearchObj.runPaged().count;
            log.debug("estimateSearchObj result count", searchResultCount);
            estimateSearchObj.run().each(function (result) {
                var obj = {};
                obj.item = result.getValue({
                    name: 'item'
                });
                obj.itemText = result.getText({
                    name: 'item'
                });
                obj.jobcodeval = result.getValue({
                    name: 'custcol_advs_job_code'
                });
                obj.jobcodeText = result.getText({
                    name: 'custcol_advs_job_code'
                });
                obj.jobdesc = result.getValue({
                    name: "custrecord_st_o_p_m_description",
                    join: "CUSTCOL_ADVS_JOB_CODE"
                });
				obj.approvalStatus = result.getValue({
                    name: 'custcol_job_approval_status'
                });
				obj.RejectReason = result.getValue({
                    name: 'custcol_job_reject_reason'
                });
				obj.jobname = result.getValue({
                    name: 'custcol_advs_line_job_name'
                });
				obj.amount = result.getValue({
                    name: 'amount'
                });
				obj.jobid = result.getValue({
                    name: 'custcol_advs_st_temp_task_id'
                });
                arr.push(obj);
                return true;
            });
            //log.debug('arr', arr);
            return arr;

        } catch (e) {
            log.debug('error', e.toString());
        }
    }

    function addFields(sublist,isFromClient) {
		
        sublist.addField({
            id: "cust_mark",
            type: serverWidget.FieldType.CHECKBOX,
            label: "Mark"
        });
        sublist.addField({
            id: "cust_job_item",
            type: serverWidget.FieldType.TEXT,
            label: "Item"
        })
        sublist.addField({
            id: "cust_job_item_id",
            type: serverWidget.FieldType.TEXT,
            label: "Item"
        }).updateDisplayType({
            displayType: "hidden"
        });
        sublist.addField({
            id: "cust_job_jobval",
            type: serverWidget.FieldType.TEXT,
            label: "JOBval"
        }).updateDisplayType({
            displayType: "hidden"
        });
        sublist.addField({
            id: "cust_job_job",
            type: serverWidget.FieldType.TEXT,
            label: "JOB"
        })
        sublist.addField({
            id: "cust_job_desc",
            type: serverWidget.FieldType.TEXT,
            label: "Description"
        })
        sublist.addField({
            id: "cust_job_stats",
            type: serverWidget.FieldType.SELECT,
            label: "Status",
            source: 'customlist_approve_job_status'
        }).updateDisplayType({
            displayType: "entry"
        });
        sublist.addField({
            id: "cust_job_rejectreason",
            type: serverWidget.FieldType.TEXT,
            label: "Reject Reason"
        }).updateDisplayType({
            displayType: "entry"
        });

    }

    function addData(sublist, data,isFromClient) {
        try {
            for (var i = 0; i < data.length; i++) {
                sublist.setSublistValue({
                    id: "cust_job_item",
                    line: i,
                    value: data[i].itemText
                });
                sublist.setSublistValue({
                    id: "cust_job_item_id",
                    line: i,
                    value: data[i].item||''
                });
                sublist.setSublistValue({
                    id: "cust_job_job",
                    line: i,
                    value: data[i].jobname//jobcodeText||' '
                });
                sublist.setSublistValue({
                    id: "cust_job_jobval",
                    line: i,
                    value: data[i].jobcodeval||0
                })
                sublist.setSublistValue({
                    id: "cust_job_desc",
                    line: i,
                    value: data[i].jobdesc||' '
                });
				if(data[i].approvalStatus!=''){
					sublist.setSublistValue({
                    id: "cust_job_stats",
                    line: i,
                    value: data[i].approvalStatus||''
					});
				} 
				sublist.setSublistValue({
                    id: "cust_job_rejectreason",
                    line: i,
                    value: data[i].RejectReason||' '
                });
				 
				 
            }
        } catch (e) {
            log.debug('error', e.toString());
			 
        }
    }
    function sethtmltable(fieldobj,data,logoid)
	{
		 var groupData = underscore.groupBy(data,'jobname');
				var jobsnames =  Object.keys(groupData);
				var fileurl='#';
				if(logoid){
					var fileobj = file.load({id:logoid});
					fileurl = fileobj.url;
					
				}
				var htl='';
				htl+='<table><tr><td><img src="'+fileurl+'" width="350px" height="60px" style="margin-left: 150%;margin-top: -80px;"></td></tr></table>';
				htl+='<table class="summarysection"><tr><td colspan="4"><b>Shop supplies:</b></td><td>10</td></tr><tr><td colspan="4"><b>Tax:</b></td><td>10</td></tr><tr><td colspan="4"><b>Core Charges:</b></td><td>10</td></tr></table>'
				htl+='<table class="jobsdata" style="width:100%;border-collapse: collapse">';
				
				for(var k=0;k<jobsnames.length;k++)
				{
					var jobitems = groupData[jobsnames[k]];
					//console.log('jobitems',jobitems);
					if(jobsnames[k]!=""){
						if(jobitems[0].approvalStatus==1){
							htl+="<tr class='jobline' data-jobid="+jobitems[0].jobid+"><th colspan='3' style='background-color:#bdbbb7' class='jobname'>"+jobsnames[k]+"</th><th style='background-color:#bdbbb7'>Status <select class='group-dropdown' disabled><option value=''></option><option value='approve' selected>Approve</option><option value='reject'>Reject</option></select></th><th style='background-color:#bdbbb7;'><input style='display:none;' type='text' class='reject_reason'></th><th style='background-color:#bdbbb7;display:none;'><input class='joblevelbox' type='checkbox' name='approvereject' id='approvereject'></th></tr>";
						}else if(jobitems[0].approvalStatus==2){
							htl+="<tr class='jobline' data-jobid="+jobitems[0].jobid+"><th colspan='3' style='background-color:#bdbbb7' class='jobname'>"+jobsnames[k]+"</th><th style='background-color:#bdbbb7'>Status <select class='group-dropdown'><option value=''></option><option value='approve'>Approve</option><option value='reject' selected>Reject</option></select></th><th style='background-color:#bdbbb7;'><input style='display:none;' type='text' class='reject_reason'></th><th style='background-color:#bdbbb7;display:none;'><input class='joblevelbox' type='checkbox' name='approvereject' id='approvereject'></th></tr>";
						}else{
							
						htl+="<tr class='jobline' data-jobid="+jobitems[0].jobid+"><th colspan='3' style='background-color:#bdbbb7' class='jobname'>"+jobsnames[k]+"</th><th style='background-color:#bdbbb7'>Status <select class='group-dropdown'><option value=''></option><option value='approve'>Approve</option><option value='reject'>Reject</option></select></th><th style='background-color:#bdbbb7;'><input style='display:none;' type='text' class='reject_reason'></th><th style='background-color:#bdbbb7;display:none;'><input class='joblevelbox' type='checkbox' name='approvereject' id='approvereject'></th></tr>";
						}
						htl+='<tr><th>Job</th><th>Description</th><th>Status</th><th>Complaint & Cause</th><th>Notes</th></tr>';
						for(var i=0;i<jobitems.length;i++)
						{
							 htl+='<tr><td colspan="2" class="item" data-item='+jobitems[i].item+'>'+jobitems[i].itemText+'</td>';
							 htl+="<td><select class='group-dropdown'><option value=''></option><option value='approve'>Approve</option><option value='reject'>Reject</option></select></td>";
							 htl+='<td class="amount">'+jobitems[i].amount+'</td>';
							 htl+='<td><input type="text" name="notes" id="notes"></td></tr>';
								  
						}
					}
					
				}
				
				htl+=`<style>
       .jobsdata table {
            width: 100%;
            border-collapse: collapse;
            font-family: Arial, sans-serif;
        }
       .jobsdata th, .jobsdata td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .jobsdata .group-dropdown {
            width: 150px;
            padding: 8px;
            border-radius: 8px; /* Rounded corners */
            border: 1px solid #ccc; /* Border color */
            font-size: 14px; /* Text size */
            font-family: Arial, sans-serif; /* Font family */
            background-color: #f9f9f9; /* Light background */
            color: #333; /* Text color */
            cursor: pointer; /* Pointer cursor on hover */
            transition: all 0.3s ease; /* Smooth transition */
        }
       .jobsdata  .group-dropdown:hover {
            border-color: #007bff; /* Border color on hover */
            background-color: #e9f7ff; /* Background color on hover */
        }
       .jobsdata  .group-dropdown:focus {
            outline: none; /* Remove outline when focused */
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Focus shadow */
        }
       .jobsdata .group-header {
            background-color: #f2f2f2;
        }
       .jobsdata h2 {
            font-family: 'Arial', sans-serif;
            color: #333;
        }
		/* .summarysection, .jobsdata{
			display:inline-flex;
		} */
		.summarysection{
			float:right;
			width:20%;
			background:grey;
			padding:10px;
			margin-botton:20px;
		}
		.summarysection td{
			padding-bottom:10px;
			padding-right:50px;
		}
    </style>`;
	htl+=`<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script><script>$(document).ready(function(){jQuery('.group-dropdown').change(function(){debugger;
   var selectedVal =  jQuery(this).val();
    if(selectedVal=='reject'){
        jQuery(this).parent('th').parent('tr').find('input').show()
    }else{
		jQuery(this).parent('th').parent('tr').find('input').hide()
	}
});jQuery('#custpage_sublist_pane').hide();});</script>;
`;
				htl+='</table>';
				fieldobj.defaultValue = htl;
	}
	return {
        onRequest
    }

});
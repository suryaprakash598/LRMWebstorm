/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/format','N/email'],
    /**
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (runtime, search, serverWidget, url, format,email) => {
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
        if (request.method == "GET") {
			var from = request.parameters.from;
            var form = serverWidget.createForm({
                title: "Email PTP",
				hideNavBar:true
            }); 
			var emailtype = form.addField({
				id: 'cust_email_type_ptp',
				type: serverWidget.FieldType.SELECT,
				label: 'PTP Type',
				source:'customlist_advs_ptp_type'
			});
			emailtype.defaultValue=from;
			form.addField({
				id: 'cust_email_template',
				type: serverWidget.FieldType.SELECT,
				label: 'Email Template',
				source:'customrecord_advs_ptp_email_template'
			});
			var fromField = form.addField({
				id: 'cust_subl_from',
				type: serverWidget.FieldType.TEXT,
				label: ' From'
			});
          fromField.defaultValue=from;
			fromField.updateDisplayType({
				displayType : serverWidget.FieldDisplayType.HIDDEN
			});
            // addSublist(form, "custpage_subtab_insur_fut", "0-7 days", false);  
			/* if(from==1)addSublist(form, "custpage_subtab_ptp_failed", "PTP Failed",false);
               if(from==2) addSublist(form, "custpage_subtab_today", "PTP Today",false);
               if(from==3) addSublist(form, "custpage_subtab_future", "PTP Future",false);  */ 
			   addSublist(form, "custpage_subtab_ptp", "PTP",false);
			   
				addSubmitButtons(form, "custbtn_sendemail", "Send Email");
				form.clientScriptModulePath = "SuiteScripts/Advectus/cs_insurance_dashboard.js";
             if(from=='ptp')
			 {
				 response.writePage(form);
				 return true;
			 }

            var Stock_link = url.resolveRecord({
                recordType: 'customrecord_advs_lease_header',
                isEditMode: false
            });
            var customerUrl = url.resolveRecord({
                recordType: 'customer',
                isEditMode: false
            });
            var taskUrl = url.resolveRecord({
                recordType: 'task',
                isEditMode: false
            });
            var create_task_link = url.resolveScript({
                scriptId: 'customscript_ssst_create_task_pop_up',
                deploymentId: 'customdeploy_ssst_create_task_pop_up'
            });

            var create_notes_link = url.resolveScript({
                scriptId: 'customscript_advs_ss_create_task_for_col',
                deploymentId: 'customdeploy_advs_ss_create_task_for_col'
            });

            var url_email = url.resolveScript({
                scriptId: 'customscript_ez_ssat_email_pop_up',
                deploymentId: 'customdeploy_ez_ssat_email_pop_up'
            });
 

            var count_all_amount = 0,
            count_all = 0;
			/* var count_0_7_amount    =   '',count_0_7=0;
			var count_8_14_amount    =   '',count_8_14=0;
			 var count_15_30_amount    =   '',count_15_30=0;
			 var count_31_60_amount    =   '',count_31_60=0;
			  var count_60_plus_amount    =   '',count_60_plus=0; */
var ptpTaskDetails = getPtpTaskDetails(1);
log.debug('ptpTaskDetails',ptpTaskDetails);
var pasttask_ptp = ptpTaskDetails[0].pasttask;
 var currenttask_ptp = ptpTaskDetails[0].currenttask;
        var futuretask_ptp = ptpTaskDetails[0].futuretask;
			/* if(from==1){
				pasttask_ptp =[];
				futuretask_ptp =[];
			}else if(from==2){
				currenttask_ptp =[];
				futuretask_ptp =[];
			}else if(from==3){
				pasttask_ptp =[];
				currenttask_ptp =[];
			}
             */
       
 var ptppast_Sublistid = "custpage_sublist_custpage_subtab_ptp";
        var sublist_ptp_past = form.getSublist({
          id: ptppast_Sublistid
        });
        var count_ptp_past_amount = 0,
          count_ptp_past = 0;

        var ptptoday_Sublistid = "custpage_sublist_custpage_subtab_ptp";
        var sublist_ptp_today = form.getSublist({
          id: ptptoday_Sublistid
        });
        var count_ptp_today_amount = 0,
          count_ptp_today = 0;

        var ptpfuture_Sublistid = "custpage_sublist_custpage_subtab_ptp";
        var sublist_ptp_fut = form.getSublist({
          id: ptpfuture_Sublistid
        });
        var count_ptp_fut_amount = 0,
          count_ptp_fut = 0;

       /*  var all_Sublistid = "custpage_sublist_custpage_subtab_all";
        var sublist_all = form.getSublist({
          id: all_Sublistid
        }); */
        var count_all_amount = 0,
          count_all = 0;
        var count_ptp_past = 0;
        for (var i = 0; i < pasttask_ptp.length; i++) {
          var ptptaskdata = pasttask_ptp[i];

          var company = ptptaskdata.company;
          var companyid = ptptaskdata.companyid;
          var leaseid = ptptaskdata.leaseid;
          var fullName = ptptaskdata.fullName;
          var mobileValue = ptptaskdata.mobilePhone;
          var duedate = ptptaskdata.dueDate;
          var ptpName = ptptaskdata.taskTitle;
          var ptpDate = ptptaskdata.dateCreated;
          var taskType = ptptaskdata.taskType;
          var ageInDays = ptptaskdata.ageInDays;
          var ptpTask = ptptaskdata.id;
          var amount = ptptaskdata.amount;
          var leasenum = ptptaskdata.leasenum;
          var assigned = ptptaskdata.assigned||' ';
          var payvia = ptptaskdata.payvia ||' ' ;
          var remarks = ptptaskdata.remarks||' ' ;
          var lastpaiddate = ptptaskdata.lastpaiddate || "";
          var status = ptptaskdata.status || ' ';

          amount = amount * 1;

          var stock_carr = Stock_link + '&id=' + leaseid;
          var taskArUrl = taskUrl + '&id=' + ptpTask;
          var CustDashLink = "<a href=\"https://8760954.app.netsuite.com/app/center/card.nl?sc=-69&entityid=" + company + "\" target=\"_blank\">DASH</a>";
          //var naccountStatementurl = naccountStatement + "&Custparam_curecid=" + leaseid;
          //var accountStatement = '<a href="' + encodeURI(naccountStatementurl) + '" target="_blank"><i class="fa fa-print" title="Lease Account Statement"></i></a>';
          var create_task_link1 = create_task_link + '&custparam_cust=' + company + '&deal_id=' + leaseid; //colle_id
          var n_url_email = url_email + '&custparam_customer_id=' + company + '&deal_id=' + leaseid;
          var stockREcLink = '<a href="' + encodeURI(stock_carr) + '" target="_blank">' + encodeURI(leasenum) + '</a>';
          var custLinkArr = customerUrl + '&id=' + company;
          var CustRecLink = '<a href="' + encodeURI(custLinkArr) + '" target="_blank">' + fullName + '</a>';
          var taskArUrlLink = '<a href="' + encodeURI(taskArUrl) + '" target="_blank">' + ptpName + '</a>';


          // var lastinvoicedate  = deal_data_arr[leaseid]['lastinvoicedate'] || '';
          var duedays = "0";
          var totalDue = "0";
          var totaldueinvoice = "0";
          
           
           sublist_ptp_past.setSublistValue({
            id: "cust_fi_list_open_task",
            line: count_ptp_past,
            value: taskArUrlLink
          }); 
		  sublist_ptp_past.setSublistValue({
            id: 'cust_fi_list_ptpamtone',
            line: count_ptp_past,
            value: amount
          });
		   sublist_ptp_past.setSublistValue({
            id: 'cust_fi_list_ptpdateone',
            line: count_ptp_past,
            value: ptpDate
          }); 
		  sublist_ptp_past.setSublistValue({
            id: 'cust_fi_list_type',
            line: count_ptp_past,
            value: payvia
          });
		  sublist_ptp_past.setSublistValue({
            id: 'cust_fi_list_assined_to',
            line: count_ptp_past,
            value: assigned
          }); 
		  sublist_ptp_past.setSublistValue({
            id: 'cust_fi_list_message',
            line: count_ptp_past,
            value: remarks
          }); 
		  
		  sublist_ptp_past.setSublistValue({
            id: 'cust_fi_list_status',
            line: count_ptp_past,
            value: status
          });
		  sublist_ptp_past.setSublistValue({
            id: "cust_fi_list_customer",
            line: count_ptp_past,
            value: company
          });
		  sublist_ptp_past.setSublistValue({
            id: "cust_fi_list_customer_id",
            line: count_ptp_past,
            value: companyid
          });
		  
		  sublist_ptp_past.setSublistValue({
            id: "cust_fi_list_stock_no",
            line: count_ptp_past,
            value: stockREcLink
          });
           
		   
           
         
          count_ptp_past_amount += amount;
          count_ptp_past++;
        }

        for (var i = 0; i < currenttask_ptp.length; i++) {
          var ptptaskdata = currenttask_ptp[i];

          var company = ptptaskdata.company;
          var companyid = ptptaskdata.companyid;
          var leaseid = ptptaskdata.leaseid;
          var fullName = ptptaskdata.fullName;
          var mobileValue = ptptaskdata.mobilePhone;
          var duedate = ptptaskdata.dueDate;
          var ptpName = ptptaskdata.taskTitle;
          var ptpDate = ptptaskdata.dateCreated;
          var taskType = ptptaskdata.taskType;
          var ageInDays = ptptaskdata.ageInDays;
          var ptpTask = ptptaskdata.id;
          var amount = ptptaskdata.amount;
          var leasenum = ptptaskdata.leasenum;
          var lastpaiddate = ptptaskdata.lastpaiddate || "";
		  
		   
          var assigned = ptptaskdata.assigned||' ';
          var payvia = ptptaskdata.payvia ||' ' ;
          var remarks = ptptaskdata.remarks||' ' ; 
          var status = ptptaskdata.status || ' ';
		  

          amount = amount * 1;

          var stock_carr = Stock_link + '&id=' + leaseid;
          var taskArUrl = taskUrl + '&id=' + ptpTask;
          var CustDashLink = "<a href=\"https://8760954.app.netsuite.com/app/center/card.nl?sc=-69&entityid=" + company + "\" target=\"_blank\">DASH</a>";
          //var naccountStatementurl = naccountStatement + "&Custparam_curecid=" + leaseid;
          //var accountStatement = '<a href="' + encodeURI(naccountStatementurl) + '" target="_blank"><i class="fa fa-print" title="Lease Account Statement"></i></a>';
          var create_task_link1 = create_task_link + '&custparam_cust=' + company + '&deal_id=' + leaseid; //colle_id
          var n_url_email = url_email + '&custparam_customer_id=' + company + '&deal_id=' + leaseid;
          var stockREcLink = '<a href="' + encodeURI(stock_carr) + '" target="_blank">' + encodeURI(leasenum) + '</a>';
          var custLinkArr = customerUrl + '&id=' + company;
          var CustRecLink = '<a href="' + encodeURI(custLinkArr) + '" target="_blank">' + fullName + '</a>';
			var taskArUrlLink = '<a href="' + encodeURI(taskArUrl) + '" target="_blank">' + ptpName + '</a>';

          // var lastinvoicedate  = deal_data_arr[leaseid]['lastinvoicedate'] || '';
          var duedays = "0";
          var totalDue = "0";
          var totaldueinvoice = "0";
         
		 sublist_ptp_today.setSublistValue({
            id: "cust_fi_list_open_task",
            line: count_ptp_today,
            value: taskArUrlLink
          });
		  sublist_ptp_today.setSublistValue({
            id: 'cust_fi_list_ptpamtone',
            line: count_ptp_today,
            value: amount
          });
		   sublist_ptp_today.setSublistValue({
            id: 'cust_fi_list_ptpdateone',
            line: count_ptp_today,
            value: ptpDate
          }); 
		  sublist_ptp_today.setSublistValue({
            id: 'cust_fi_list_type',
            line: count_ptp_today,
            value: payvia
          });
		  sublist_ptp_today.setSublistValue({
            id: 'cust_fi_list_assined_to',
            line: count_ptp_today,
            value: assigned
          }); 
		  sublist_ptp_today.setSublistValue({
            id: 'cust_fi_list_message',
            line: count_ptp_today,
            value: remarks
          }); 
		  
		  sublist_ptp_today.setSublistValue({
            id: 'cust_fi_list_status',
            line: count_ptp_today,
            value: status
          });
		  sublist_ptp_today.setSublistValue({
            id: "cust_fi_list_customer",
            line: count_ptp_today,
            value: company
          });
		  sublist_ptp_today.setSublistValue({
            id: "cust_fi_list_customer_id",
            line: count_ptp_today,
            value: companyid
          });
		  
		  sublist_ptp_today.setSublistValue({
            id: "cust_fi_list_stock_no",
            line: count_ptp_today,
            value: stockREcLink
          });
            
          count_ptp_today_amount += amount;
          count_ptp_today++;
        }

        for (var i = 0; i < futuretask_ptp.length; i++) {
          var ptptaskdata = futuretask_ptp[i];

          var company = ptptaskdata.company;
          var companyid = ptptaskdata.companyid;
          var leaseid = ptptaskdata.leaseid;
          var fullName = ptptaskdata.fullName;
          var mobileValue = ptptaskdata.mobilePhone;
          var duedate = ptptaskdata.dueDate;
          var ptpName = ptptaskdata.taskTitle;
          var ptpDate = ptptaskdata.dateCreated;
          var taskType = ptptaskdata.taskType;
          var ageInDays = ptptaskdata.ageInDays;
          var ptpTask = ptptaskdata.id;
          var amount = ptptaskdata.amount;
          var leasenum = ptptaskdata.leasenum;
          var lastpaiddate = ptptaskdata.lastpaiddate || "";
			 var assigned = ptptaskdata.assigned||' ';
          var payvia = ptptaskdata.payvia ||' ' ;
          var remarks = ptptaskdata.remarks||' ' ; 
          var status = ptptaskdata.status || ' ';
		  
          amount = amount * 1;

          var stock_carr = Stock_link + '&id=' + leaseid;
          var taskArUrl = taskUrl + '&id=' + ptpTask;
          var CustDashLink = "<a href=\"https://8760954.app.netsuite.com/app/center/card.nl?sc=-69&entityid=" + company + "\" target=\"_blank\">DASH</a>";
          //var naccountStatementurl = naccountStatement + "&Custparam_curecid=" + leaseid;
          //var accountStatement = '<a href="' + encodeURI(naccountStatementurl) + '" target="_blank"><i class="fa fa-print" title="Lease Account Statement"></i></a>';
          var create_task_link1 = create_task_link + '&custparam_cust=' + company + '&deal_id=' + leaseid; //colle_id
          var n_url_email = url_email + '&custparam_customer_id=' + company + '&deal_id=' + leaseid;
          var stockREcLink = '<a href="' + encodeURI(stock_carr) + '" target="_blank">' + encodeURI(leasenum) + '</a>';
          var custLinkArr = customerUrl + '&id=' + company;
          var CustRecLink = '<a href="' + encodeURI(custLinkArr) + '" target="_blank">' + fullName + '</a>';
var taskArUrlLink = '<a href="' + encodeURI(taskArUrl) + '" target="_blank">' + ptpName + '</a>';

          // var lastinvoicedate  = deal_data_arr[leaseid]['lastinvoicedate'] || '';
          var duedays = "0";
          var totalDue = "0";
          var totaldueinvoice = "0";
           
			sublist_ptp_fut.setSublistValue({
            id: "cust_fi_list_open_task",
            line: count_ptp_fut,
            value: taskArUrlLink
          });
		  sublist_ptp_fut.setSublistValue({
            id: 'cust_fi_list_ptpamtone',
            line: count_ptp_fut,
            value: amount
          });
		   sublist_ptp_fut.setSublistValue({
            id: 'cust_fi_list_ptpdateone',
            line: count_ptp_fut,
            value: ptpDate
          }); 
		  sublist_ptp_fut.setSublistValue({
            id: 'cust_fi_list_type',
            line: count_ptp_fut,
            value: payvia
          });
		  sublist_ptp_fut.setSublistValue({
            id: 'cust_fi_list_assined_to',
            line: count_ptp_fut,
            value: assigned
          }); 
		  sublist_ptp_fut.setSublistValue({
            id: 'cust_fi_list_message',
            line: count_ptp_fut,
            value: remarks
          }); 
		  
		  sublist_ptp_fut.setSublistValue({
            id: 'cust_fi_list_status',
            line: count_ptp_fut,
            value: status
          });
		  sublist_ptp_fut.setSublistValue({
            id: "cust_fi_list_customer",
            line: count_ptp_fut,
            value: company
          });
		  sublist_ptp_fut.setSublistValue({
            id: "cust_fi_list_customer_id",
            line: count_ptp_fut,
            value: companyid
          });
		  
		  sublist_ptp_fut.setSublistValue({
            id: "cust_fi_list_stock_no",
            line: count_ptp_fut,
            value: stockREcLink
          });
		  
          count_ptp_fut_amount += amount;
          count_ptp_fut++;
        }


             

            response.writePage(form);
        }
		
		else{
			 
			 
			 var _emailtemplate = scriptContext.request.parameters.cust_email_template;
			 var from = scriptContext.request.parameters.cust_subl_from;
			/* if(from==1){var sublistid = 'custpage_sublist_custpage_subtab_ptp'} 
			 if(from==2){var sublistid = 'custpage_sublist_custpage_subtab_ptp_failed'}
			 if(from==3){var sublistid = 'custpage_sublist_custpage_subtab_future'}  */
			 var sublistid = 'custpage_sublist_custpage_subtab_ptp'
            var count = scriptContext.request.getLineCount({
                group: sublistid
            });
			log.debug('count',count);
            var arr = [];
			var emaildetails = emailTemplate(_emailtemplate);
            for (var i = 0; i < count; i++) {

                var ismarked = scriptContext.request.getSublistValue({
                    group: sublistid,
                    name: 'cust_fi_list_mark',
                    line: i
                });
				log.debug('ismarked',ismarked);
                if (ismarked == 'T') {
					var vin='';
					var PTPDATE='';
					var PTPAMOUNT='';
                    var obj = {};
                    /* var internalId = context.request.getSublistValue({
                        group: 'custpage_subtab_insur_fut',
                        name: 'custpage_id',
                        line: i
                    }); */
                    var entityId = scriptContext.request.getSublistValue({
                        group: sublistid,
                        name: 'cust_fi_list_customer_id',
                        line: i
                    });
					var entityName = scriptContext.request.getSublistValue({
                        group: sublistid,
                        name: 'cust_fi_list_customer',
                        line: i
                    });
					/* var entityName = scriptContext.request.getSublistValue({
                        group: sublistid,
                        name: 'cust_fi_list_customer',
                        line: i
                    }); */
					/*  vin = scriptContext.request.getSublistValue({
                        group: sublistid,
                        name: 'cust_fi_list_serial',
                        line: i
                    }); */
					 PTPDATE = scriptContext.request.getSublistValue({
                        group: sublistid,
                        name: 'cust_fi_list_ptpdateone',
                        line: i
                    });
					 PTPAMOUNT = scriptContext.request.getSublistValue({
                        group: sublistid,
                        name: 'cust_fi_list_ptpamtone',
                        line: i
                    });
					
					var custemail = search.lookupFields({type:'customer',id:entityId,columns:['email']});
					log.debug('custemail',custemail);
                    obj.custid = entityId; 
					var body = emaildetails.body;
					body = body.replace('@CUSTOMER@',entityName||'');
					// body = body.replace('@VIN@',vin||'');
					body = body.replace('@PTPDATE@',PTPDATE||'');
					body = body.replace('@PTPAMOUNT@',PTPAMOUNT||'');
					email.send({
							author: 6,
							recipients: custemail.email,
							subject: emaildetails.subject,
							body: body
						});
                   // arr.push(obj);
                }
            }
			//var url	=	"https://7250637-sb1.app.netsuite.com/app/accounting/transactions/estimate.nl?id="+id+"&whence=";
				var onclickScript=" <html><body> <script type='text/javascript'>" ;

				onclickScript+="try{" ;
				//onclickScript+="var Url		=	'"+url+"';" ;
				// onclickScript+="window.opener.location=Url;window.close();";
				onclickScript+="window.close()";//window.close();
				onclickScript+="}catch(e){}</script></body></html>";
				scriptContext.response.write(onclickScript);
		}
    }
	function emailTemplate(_emailtemplate)
	{
		var customrecord_email_templates_setupSearchObj = search.create({
		   type: "customrecord_advs_ptp_email_template",
		   filters:
		   [
			  ["internalid","is",_emailtemplate]
		   ],
		   columns:
		   [
			  "custrecord_ptp_template_subject",
			  "custrecord_ptp_template_body",
			  search.createColumn({
				 name: "custrecord_ptp_template_name",
				 sort: search.Sort.ASC
			  })
		   ]
		});
		var searchResultCount = customrecord_email_templates_setupSearchObj.runPaged().count;
		log.debug("customrecord_email_templates_setupSearchObj result count",searchResultCount);
		var subject ='';
		var body='';
		var obj={};
		customrecord_email_templates_setupSearchObj.run().each(function(result){
		   // .run().each has a limit of 4,000 results
		   obj.subject = result.getValue({name:'custrecord_ptp_template_subject'});
		  obj. body = result.getValue({name:'custrecord_ptp_template_body'});
		   return true;
		});
	return obj;
		 
	}
    function addSublist(form, tabId, tabLabel, requiredTaskinfo) {
        form.addTab({
            id: tabId,
            label: tabLabel
        });

        var sublist = form.addSublist({
            id: "custpage_sublist_" + tabId,
            type: serverWidget.SublistType.LIST,
            label: " ",
            tab: tabId
        }); 
		sublist.addMarkAllButtons()
        addSublistFields(sublist, requiredTaskinfo);
    }

    function addSublistFields(sublist) {

        sublist.addField({
            id: 'cust_fi_list_mark',
            type: serverWidget.FieldType.CHECKBOX,
            label: 'Mark'
        }); 
		 
        sublist.addField({
        id: 'cust_fi_list_open_task',
        type: serverWidget.FieldType.TEXT,
        label: 'PTP Link'
      });
      
      sublist.addField({
        id: 'cust_fi_list_customer_id',
        type: serverWidget.FieldType.TEXT,
        label: 'Customer ID',
      });
	  sublist.addField({
        id: 'cust_fi_list_customer',
        type: serverWidget.FieldType.TEXT,
        label: 'Customer Name',
      });
	  sublist.addField({
        id: 'cust_fi_list_assined_to',
        type: serverWidget.FieldType.TEXT,
        label: 'Assigned To',
      });
      sublist.addField({
        id: 'cust_fi_list_status',
        type: serverWidget.FieldType.TEXT,
        label: 'Status',
      });
	  sublist.addField({
        id: 'cust_fi_list_type',
        type: serverWidget.FieldType.TEXT,
        label: 'PTP Type',
      });
      
      
      sublist.addField({
        id: 'cust_fi_list_ptpamtone',
        type: serverWidget.FieldType.TEXT,
        label: 'PTP AMT',
      });
      sublist.addField({
        id: 'cust_fi_list_ptpdateone',
        type: serverWidget.FieldType.TEXT,
        label: 'PTP DATE',
      });
      sublist.addField({
        id: 'cust_fi_list_message',
        type: serverWidget.FieldType.TEXT,
        label: 'Notes'
      });
       

      sublist.addField({
        id: 'cust_fi_list_stock_no',
        type: serverWidget.FieldType.TEXT,
        label: 'Lease #'
      });
 

    }
    

    function addFormButtons(form, id, label, functionCall) {
        form.addButton({
            id: id,
            label: label,
            functionName: functionCall
        });
    }
	function addSubmitButtons(form, id, label) {
        form.addSubmitButton({
			label : 'Send Email'
		});
    }
	function getPtpTaskDetails(ptptype) {
      var pastTasks_ptp = [];
      var currentTasks_ptp = [];
      var futureTasks_ptp = [];

      var taskSearchObj = search.create({
        type: "task",
        filters: 
          [
			/* ["status", "anyof", "PROGRESS", "NOTSTART"],
			"OR",
			["custevent_advs_ptp_status","anyof",""] */
			
			 
			 [
				 ["status","anyof","PROGRESS","NOTSTART"],
				 "OR",
				 ["custevent_advs_ptp_status","anyof","1","2","3"]
			 ],
			 
          "AND",
          ["custevent_advs_lease_link", "noneof", "@NONE@"], "AND",
          ["custevent_advs_mm_task_type", "anyof", "2"], "AND",
          ["custevent_advs_ptp_type_filter", "anyof", ptptype], "AND",
          ["company", "noneof", "@NONE@"]
        ],
        columns: [
          search.createColumn({
            name: "internalid",
            label: "internalid"
          }),
          search.createColumn({
            name: "company",
            label: "Company"
          }),
          search.createColumn({
            name: "custevent_advs_lease_link",
            label: "Lease Card Link"
          }),
          search.createColumn({
            name: "formulatext",
            formula: "{companycustomer.firstname} || ' ' || {companycustomer.lastname}",
            label: "Formula (Text)"
          }),
          search.createColumn({
            name: "mobilephone",
            join: "companyCustomer",
            label: "Mobile Phone"
          }),
          search.createColumn({
            name: "duedate",
            label: "Due Date"
          }),
		  search.createColumn({
            name: "custevent_advs_broken_promis",
            label: "Broken Promise"
          }),
          search.createColumn({
            name: "title",
            label: "Task Title"
          }),
          search.createColumn({
            name: "createddate",
            label: "Date Created"
          }),
          search.createColumn({
            name: "duedate",
            label: "Due Date"
          }),
          search.createColumn({
            name: "custevent_advs_mm_task_type",
            label: "Task Type"
          }),
		  search.createColumn({
            name: "custevent_advs_ptp_type",
            label: "Payment Via"
          }),
		  search.createColumn({
            name: "custevent_advs_crm_remark",
            label: "Remarks"
          }),
		  search.createColumn({
            name: "assigned",
            label: "Assigned"
          }), 
		  search.createColumn({
            name: "status",
            label: "status"
          }),
          search.createColumn({
            name: "formulanumeric",
            formula: "TRUNC(SYSDATE) - TRUNC({duedate})",
            label: "Age in Days"
          }),
          search.createColumn({
            name: "custevent_advs_ptp_amount",
            label: "PTP Amount"
          }),
          search.createColumn({
            name: "custrecord_advs_l_a_last_pay_date",
            join: "custevent_advs_lease_link",
            label: "last pay"
          }),

        ]
      });

      var resultSet = taskSearchObj.run();
      var start = 0;
      var end = 1000;
      do {
        var results = resultSet.getRange({
          start: start,
          end: end
        });
        results.forEach(function (result) {
          var taskDetails = {
            id: result.getValue({
              name: "internalid"
            }),
            company: result.getText({
              name: "company"
            }),
			companyid: result.getValue({
              name: "company"
            }),
            leaseid: result.getValue({
              name: "custevent_advs_lease_link"
            }),
            leasenum: result.getText({
              name: "custevent_advs_lease_link"
            }),
            fullName: result.getValue({
              name: "formulatext",
              label: "Full Name"
            }),
            mobilePhone: result.getValue({
              name: "mobilephone",
              join: "companyCustomer"
            }),
            dueDate: result.getValue({
              name: "duedate"
            }),
			brokenpromise: result.getValue({
              name: "custevent_advs_broken_promis"
            }),
            taskTitle: result.getValue({
              name: "title"
            }),
            dateCreated: result.getValue({
              name: "createddate"
            }),
            taskType: result.getValue({
              name: "custevent_advs_mm_task_type"
            }),
            ageInDays: parseInt(result.getValue({
              name: "formulanumeric",
              label: "Age in Days"
            }), 10),
            amount: result.getValue({
              name: "custevent_advs_ptp_amount"
            }),
			assigned: result.getText({
              name: "assigned"
            }),
			payvia: result.getText({
              name: "custevent_advs_ptp_type"
            }),
			status: result.getText({
              name: "status"
            }),
			remarks: result.getValue({
              name: "custevent_advs_crm_remark"
            }),
            lastpaiddate: result.getValue({
              name: "custrecord_advs_l_a_last_pay_date",
              join: "custevent_advs_lease_link"
            }),

          };
          if (taskDetails.ageInDays < 0) {
            futureTasks_ptp.push(taskDetails);
          } else if (taskDetails.ageInDays === 0) {
            currentTasks_ptp.push(taskDetails);
          } else {
            pastTasks_ptp.push(taskDetails);
          }
        });
        start += 1000;
        end += 1000;
      } while (results.length > 0);

      var postTask = [];
      var posttaskObj = {};
      posttaskObj.pasttask = {};
      posttaskObj.currenttask = {};
      posttaskObj.futuretask = {};
      posttaskObj.pasttask = pastTasks_ptp;
      posttaskObj.currenttask = currentTasks_ptp;
      posttaskObj.futuretask = futureTasks_ptp;

      postTask.push(posttaskObj);

      return postTask;
    }
	
    return {
        onRequest
    }

});
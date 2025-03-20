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
            var form = serverWidget.createForm({
                title: "Email Insurance Expiring",
				hideNavBar:true
            }); 
			form.addField({
				id: 'cust_email_template',
				type: serverWidget.FieldType.SELECT,
				label: 'Email Template',
				source:'customrecordcustrecord_ins_temp_name'
			});
            addSublist(form, "custpage_subtab_insur_fut", "Insurance Expiring 0-5", false);  
			
            //addFormButtons(form, "custbtn_sendemail", "Send Email", "sendemail");
            addSubmitButtons(form, "custbtn_sendemail", "Send Email");
			 form.clientScriptModulePath = "SuiteScripts/Advectus/cs_insurance_dashboard.js";
            var search_c = search.load({
                id: 'customsearch_advs_tam_st_collection_da_2'
            });

            var deal_data_arr = [];
            var dealLengthArray = [];

            var pageSize = 1000; // Number of results to fetch per page
            var pageIndex = 0; // Initial page index

            do {
                var resultSet = search_c.runPaged({
                    pageSize: pageSize,
                    pageIndex: pageIndex
                });
                resultSet.pageRanges.forEach(function (pageRange) {
                    var currentPage = resultSet.fetch({
                        index: pageRange.index
                    });
                    currentPage.data.forEach(function (result) {
                        var dealId = result.getValue('internalid');
                        dealLengthArray.push(dealId);

                        var dueDate = result.getValue({
                            name: 'custrecord_advs_l_h_ins_lia_exp_dt'
                        });
 

                        // Calculate the age in days
                        var today = new Date();
                        var dueDateTime = new Date(dueDate);
                        var differenceInTime = today.getTime() - dueDateTime.getTime();
                        var ageInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

                        if (deal_data_arr.hasOwnProperty(dealId)) {}
                        else {
                            deal_data_arr[dealId] = {
                                'id': result.getValue({
                                    name: 'internalid'
                                }),
                                'customerid': result.getValue({
                                    name: 'custrecord_advs_l_h_customer_name'
                                }),
                                'leasenum': result.getValue({
                                    name: 'name'
                                }),
                                'cust_altname': result.getValue({
                                    name: 'altname',
                                    join: "CUSTRECORD_ADVS_L_H_CUSTOMER_NAME"
                                }),
                                'customermobile': result.getValue({
                                    name: 'mobilephone',
                                    join: "CUSTRECORD_ADVS_L_H_CUSTOMER_NAME"
                                }),
                                'customeraltmobile': result.getValue({
                                    name: 'altphone',
                                    join: "CUSTRECORD_ADVS_L_H_CUSTOMER_NAME"
                                }),
                                'vehiclebrand': result.getValue({
                                    name: 'custrecord_advs_vm_vehicle_brand',
                                    join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
                                }),
                                'vinmodel': result.getValue({
                                    name: 'custrecord_advs_vm_model',
                                    join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
                                }),
                                'tasklink': result.getValue({
                                    name: 'custrecord_advs_task_link'
                                }),
                                'task_date': result.getValue({
                                    name: 'createddate',
                                    join: "CUSTRECORD_ADVS_TASK_LINK"
                                }),
                                 
                                'duedate': dueDate,
                                'ageindays': ageInDays,
                                 
                                'due_amount': result.getValue({
                                    name: 'custrecord_advs_l_a_ttl_amnt_du_frm_invo'
                                }),
                                'lastinvoicedate': result.getValue({
                                    name: 'custrecord_advs_l_h_lst_inv_date'
                                }),
                                'totaldueinvoice': result.getValue({
                                    name: 'custrecord_advs_l_a_ttl_amnt_du_frm_invo'
                                }), 
                                'insurExpiration': result.getValue({
                                    name: 'custrecord_advs_l_h_ins_lia_exp_dt'
                                }),

                            };
                        }

                    });
                });
                pageIndex++; // Move to the next page
            } while (pageIndex < resultSet.pageRanges.length);

            if (dealLengthArray.length > 0) {
                //Get Total Due
                /**
                 * Create a search to find transactions based on specific criteria
                 */
                var transactionSearch = search.create({
                    type: search.Type.TRANSACTION,
                    filters: [

                        [
                            [
                                ["type", "anyof", "CashRfnd", "CustDep", "CustPymt"], "AND", ["mainline", "is", "F"]
                            ],
                            "OR",
                            [
                                ["type", "anyof", "CustCred", "CustInvc"], "AND", ["mainline", "is", "T"]
                            ]
                        ],
                        "AND",
                        ["custbody_advs_lease_head", "anyof", dealLengthArray],
                        "AND",
                        ["amount", search.Operator.GREATERTHAN, "0.00"]
                    ],
                    columns: [
                        search.createColumn({
                            name: "internalid",
                            summary: search.Summary.GROUP,
                            join: "customer"
                        }),
                        search.createColumn({
                            name: "subsidiary",
                            summary: search.Summary.GROUP
                        }),
                        search.createColumn({
                            name: "amount",
                            summary: search.Summary.SUM
                        }),
                        search.createColumn({
                            name: "custbody_advs_lease_head",
                            summary: search.Summary.GROUP
                        })
                    ]
                });

                var searchResult = transactionSearch.run();
                var pageSize = 1000;
                var startIndex = 0;
                var endIndex = pageSize;
                var index = pageSize;

                do {
                    var searchResultSet = searchResult.getRange({
                        start: startIndex,
                        end: endIndex
                    });
                    var numResults = searchResultSet.length;

                    for (var i = 0; i < numResults; i++) {
                        var result = searchResultSet[i];
                        var dealId = result.getValue({
                            name: "custbody_advs_lease_head",
                            summary: search.Summary.GROUP
                        });

                        if (deal_data_arr.hasOwnProperty(dealId)) {
                            deal_data_arr[dealId]['totalDue'] = result.getValue({
                                name: "amount",
                                summary: search.Summary.SUM
                            });
                        }

                    }

                    index = numResults;
                    startIndex = endIndex;
                    endIndex += pageSize;

                } while (index == pageSize);

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

            var insurexp_Sublistid = "custpage_sublist_custpage_subtab_insur";
            var insuexpired_sublist = form.getSublist({
                id: insurexp_Sublistid
            });
            var insu_expired_Count = 0;
            var insu_expired_count_amount = 0;

            var insurexpiring_Sublistid = "custpage_sublist_custpage_subtab_insur_fut";
            var insuexpiring_sublist = form.getSublist({
                id: insurexpiring_Sublistid
            });
            var insu_expiring_Count = 0;
            var insu_expiring_count_amount = 0;

            var all_Sublistid = "custpage_sublist_custpage_subtab_all";
            var sublist_all = form.getSublist({
                id: all_Sublistid
            });
            var count_all_amount = 0,
            count_all = 0;
			var count_0_7_amount    =   '',count_0_7=0;
			var count_8_14_amount    =   '',count_8_14=0;
			 var count_15_30_amount    =   '',count_15_30=0;
			 var count_31_60_amount    =   '',count_31_60=0;
			  var count_60_plus_amount    =   '',count_60_plus=0;

            for (var i = 0; i < dealLengthArray.length; i++) {
                var deal_id = dealLengthArray[i];

                if (deal_data_arr[deal_id] != null && deal_data_arr[deal_id] != undefined) {
                    var days = deal_data_arr[deal_id].ageindays;
                    days = days * 1;

                    var custID = deal_data_arr[deal_id]['customerid'];
                    log.debug("custID", custID);

                    var due_amount_local = deal_data_arr[deal_id]["due_amount"] * 1;
                    var CustDashLink = "<a href=\"https://system.na2.netsuite.com/app/center/card.nl?sc=-69&entityid=" + deal_data_arr[deal_id]['customerid'] + "\" target=\"_blank\">DASH</a>";

                    var stock_carr = Stock_link + '&id=' + deal_id;

                    var stockREcLink = '<a href="' + encodeURI(stock_carr) + '" target="_blank">' + encodeURI(deal_data_arr[deal_id]['leasenum']) + '</a>';

                    var custLinkArr = customerUrl + '&id=' + deal_data_arr[deal_id]['customerid'];
                    var CustRecLink = '<a href="' + encodeURI(custLinkArr) + '" target="_blank">' + deal_data_arr[deal_id]['cust_altname'] + '</a>';

                    var create_task_link1 = create_task_link + '&custparam_cust=' + deal_data_arr[deal_id]['customerid'] + '&deal_id=' + deal_id; //colle_id
                    var n_url_email = url_email + '&custparam_customer_id=' + deal_data_arr[deal_id]['customerid'] + '&deal_id=' + deal_id;

                    var createnotesLink = create_notes_link + '&custparam_cust=' + deal_data_arr[deal_id]['customerid'] + '&deal_id=' + deal_id + '&from_notes=T'; //colle_id
                    var mobileValue = deal_data_arr[deal_id]['customermobile'] || '';
                    var duedate = deal_data_arr[deal_id]['duedate'] || '';
                    var lastinvoicedate = deal_data_arr[deal_id]['lastinvoicedate'] || '';
                    var duedays = deal_data_arr[deal_id]['ageindays'] || '0';
                    var totalDue = deal_data_arr[deal_id]['totalDue'] || '';
                    var totaldueinvoice = deal_data_arr[deal_id]['totaldueinvoice'] || ''; 
                    var insurExpiration = deal_data_arr[deal_id].insurExpiration || "";
 
                    

                    if (insurExpiration) { //
                        var today = format.format({
                            type: format.Type.DATE,
                            value: new Date()
                        });
                        var insurFormat = format.parse({
                            type: format.Type.DATE,
                            value: insurExpiration
                        });
                        var todayFormat = format.parse({
                            type: format.Type.DATE,
                            value: today
                        });

                        var todayTime = todayFormat.getTime();
                        var insurTime = insurFormat.getTime();

                        var differenceInTime = insurTime - todayTime;
                        var insuranceDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
                        // log.debug("insuranceDays",insuranceDays);
                        /* if (insurTime < todayTime) {
                            insuexpired_sublist.setSublistValue({
                                id: "cust_fi_list_dashboard",
                                line: insu_expired_Count,
                                value: CustDashLink
                            });
                            insuexpired_sublist.setSublistValue({
                                id: "cust_fi_list_stock_no",
                                line: insu_expired_Count,
                                value: stockREcLink
                            });
                            insuexpired_sublist.setSublistValue({
                                id: "cust_fi_list_customer",
                                line: insu_expired_Count,
                                value: CustRecLink
                            });
                            insuexpired_sublist.setSublistValue({
                                id: 'cust_fi_list_cre_task',
                                line: insu_expired_Count,
                                value: '<a href=' + create_task_link1 + ' target=\'_blank\' >Create Task</a>'
                            });
                            insuexpired_sublist.setSublistValue({
                                id: 'cust_fi_list_customer_mail',
                                line: insu_expired_Count,
                                value: "<a href=" + n_url_email + " target=\"_blank\">Email</a>"
                            });
                            insuexpired_sublist.setSublistValue({
                                id: 'cust_fi_list_create_notes',
                                line: insu_expired_Count,
                                value: "<a href=" + createnotesLink + " target=\"_blank\">Create Notes</a>"
                            });
                            if (mobileValue)
                                insuexpired_sublist.setSublistValue({
                                    id: 'cust_fi_list_mobile',
                                    line: insu_expired_Count,
                                    value: mobileValue
                                });
                            insuexpired_sublist.setSublistValue({
                                id: 'cust_fi_list_due_date',
                                line: insu_expired_Count,
                                value: duedate
                            });
                            insuexpired_sublist.setSublistValue({
                                id: 'cust_fi_last_pay_date',
                                line: insu_expired_Count,
                                value: lastinvoicedate
                            });
                            insuexpired_sublist.setSublistValue({
                                id: 'cust_fi_list_days_due',
                                line: insu_expired_Count,
                                value: duedays
                            });
                            insuexpired_sublist.setSublistValue({
                                id: 'cust_fi_list_total_due',
                                line: insu_expired_Count,
                                value: totalDue
                            });
                            insuexpired_sublist.setSublistValue({
                                id: 'cust_fi_list_due_as_of_today',
                                line: insu_expired_Count,
                                value: totaldueinvoice
                            });
                            insu_expired_Count++;
                            insu_expired_count_amount += due_amount_local;
                        } */
                        if (insuranceDays > 0 && insuranceDays <= 5) {
                            insuexpiring_sublist.setSublistValue({
                                id: "cust_fi_list_dashboard",
                                line: insu_expiring_Count,
                                value: CustDashLink
                            });
                            insuexpiring_sublist.setSublistValue({
                                id: "cust_fi_list_stock_no",
                                line: insu_expiring_Count,
                                value: stockREcLink
                            });
                            insuexpiring_sublist.setSublistValue({
                                id: "cust_fi_list_customer_id",
                                line: insu_expiring_Count,
                                value: deal_data_arr[deal_id]['customerid']
                            }); 
							insuexpiring_sublist.setSublistValue({
                                id: "cust_fi_list_customer",
                                line: insu_expiring_Count,
                                value: CustRecLink
                            });
                            
                            if (mobileValue)
                                insuexpiring_sublist.setSublistValue({
                                    id: 'cust_fi_list_mobile',
                                    line: insu_expiring_Count,
                                    value: mobileValue
                                });
                            insuexpiring_sublist.setSublistValue({
                                id: 'cust_fi_list_due_date',
                                line: insu_expiring_Count,
                                value: duedate
                            });
                            insuexpiring_sublist.setSublistValue({
                                id: 'cust_fi_last_pay_date',
                                line: insu_expiring_Count,
                                value: lastinvoicedate
                            });
                            insuexpiring_sublist.setSublistValue({
                                id: 'cust_fi_list_days_due',
                                line: insu_expiring_Count,
                                value: duedays
                            });
                            insuexpiring_sublist.setSublistValue({
                                id: 'cust_fi_list_total_due',
                                line: insu_expiring_Count,
                                value: totalDue
                            });
                            insuexpiring_sublist.setSublistValue({
                                id: 'cust_fi_list_due_as_of_today',
                                line: insu_expiring_Count,
                                value: totaldueinvoice
                            });
                            insu_expiring_Count++;
                            insu_expiring_count_amount += due_amount_local;
                        }
                    }
					 if(days <= 7) {
						  count_0_7++;
						count_0_7_amount =   insurExpiration;
					 }else if(days >=8 && days <=14){
						 count_8_14++;
						 count_8_14_amount =   insurExpiration;
					 }else if(days >=15 && days <=30){
						  count_15_30++;
						  count_15_30_amount =   insurExpiration;
					 }else if(days >=31 && days <=60){
						  count_31_60++;
						  count_31_60_amount =   insurExpiration;
					 }else if(days >60){
						 count_60_plus++;
						 count_60_plus_amount =   insurExpiration;
					 }
					 

                }
            }

             

            response.writePage(form);
        }
		
		else{
			 
			 var _emailtemplate = scriptContext.request.parameters.cust_email_template;
            var count = scriptContext.request.getLineCount({
                group: 'custpage_sublist_custpage_subtab_insur_fut'
            });
			log.debug('count',count);
            var arr = [];
			var emaildetails = emailTemplate(_emailtemplate);
            for (var i = 0; i < count; i++) {

                var ismarked = scriptContext.request.getSublistValue({
                    group: 'custpage_sublist_custpage_subtab_insur_fut',
                    name: 'cust_fi_list_mark',
                    line: i
                });
				log.debug('ismarked',ismarked);
                if (ismarked == 'T') {
                    var obj = {};
                    /* var internalId = context.request.getSublistValue({
                        group: 'custpage_subtab_insur_fut',
                        name: 'custpage_id',
                        line: i
                    }); */
                    var entityId = scriptContext.request.getSublistValue({
                        group: 'custpage_sublist_custpage_subtab_insur_fut',
                        name: 'cust_fi_list_customer_id',
                        line: i
                    });
					var custemail = search.lookupFields({type:'customer',id:entityId,columns:['email']});
					log.debug('custemail',custemail);
                    obj.custid = entityId; 
					email.send({
							author: 6,
							recipients: custemail.email,
							subject: emaildetails.subject,
							body: emaildetails.body
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
		   type: "customrecordcustrecord_ins_temp_name",
		   filters:
		   [
			  ["internalid","is",_emailtemplate]
		   ],
		   columns:
		   [
			  "custrecord_ins_temp_subject",
			  "custrecord_ins_temp_temp_body",
			  search.createColumn({
				 name: "custrecord_ins_temp_name",
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
		   obj.subject = result.getValue({name:'custrecord_ins_temp_subject'});
		  obj. body = result.getValue({name:'custrecord_ins_temp_temp_body'});
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

        addSublistFields(sublist, requiredTaskinfo);
    }

    function addSublistFields(sublist, requiredTaskinfo) {

        sublist.addField({
            id: 'cust_fi_list_mark',
            type: serverWidget.FieldType.CHECKBOX,
            label: 'Mark'
        }); 
		sublist.addField({
            id: 'cust_fi_list_dashboard',
            type: serverWidget.FieldType.TEXT,
            label: 'Cust Dash'
        });
        sublist.addField({
            id: 'cust_fi_list_stock_no',
            type: serverWidget.FieldType.TEXT,
            label: 'Lease #'
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
         /*sublist.addField({
            id: 'cust_fi_list_cre_task',
            type: serverWidget.FieldType.TEXT,
            label: 'Create Task'
        });
        sublist.addField({
            id: 'cust_fi_list_customer_mail',
            type: serverWidget.FieldType.TEXT,
            label: 'E-Mail Button'
        }); 
        sublist.addField({
            id: 'cust_fi_list_create_notes',
            type: serverWidget.FieldType.TEXT,
            label: 'Notes'
        });
        sublist.addField({
            id: 'cust_fi_list_mobile',
            type: serverWidget.FieldType.TEXT,
            label: 'Mobile #'
        });*/
        sublist.addField({
            id: 'cust_fi_list_due_date',
            type: serverWidget.FieldType.DATE,
            label: 'Due Date'
        });
        sublist.addField({
            id: 'cust_fi_last_pay_date',
            type: serverWidget.FieldType.DATE,
            label: 'Last Payment Date'
        });

        sublist.addField({
            id: 'cust_fi_list_days_due',
            type: serverWidget.FieldType.TEXT,
            label: 'Due Days'
        });
        sublist.addField({
            id: 'cust_fi_list_total_due',
            type: serverWidget.FieldType.CURRENCY,
            label: 'Total Due'
        }).updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        });
        sublist.addField({
            id: 'cust_fi_list_due_as_of_today',
            type: serverWidget.FieldType.CURRENCY,
            label: 'Due As Of Today (Total Due)'
        });

        if (requiredTaskinfo) {
            sublist.addField({
                id: 'cust_fi_task_cr_title',
                type: serverWidget.FieldType.TEXTAREA,
                label: 'Task Title'
            });
            sublist.addField({
                id: 'cust_fi_task_cr_date',
                type: serverWidget.FieldType.TEXT,
                label: 'Task Created Date'
            });

            sublist.addField({
                id: 'cust_fi_app_remarks',
                type: serverWidget.FieldType.TEXTAREA,
                label: 'Remarks'
            });
        }

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

    return {
        onRequest
    }

});
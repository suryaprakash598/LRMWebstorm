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
                title: "Email",
				hideNavBar:true
            }); 
			var emailbucket = form.addField({
				id: 'cust_email_type',
				type: serverWidget.FieldType.SELECT,
				label: 'Buckets',
				source:'customlist_collection_dash_email_days'
			});
           emailbucket.defaultValue=from;
			form.addField({
				id: 'cust_email_template',
				type: serverWidget.FieldType.SELECT,
				label: 'Email Template',
				source:'customrecord_col_temp_name'
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
			if(from==1)addSublist(form, "custpage_subtab_0_7", "0 - 7 Days",false);
               if(from==2) addSublist(form, "custpage_subtab_8_14", "8 - 14 Days",false);
               if(from==3) addSublist(form, "custpage_subtab_15_30", "15 - 30 Days",false);
               if(from==4) addSublist(form, "custpage_subtab_31_60", "31 - 60 Days",false);
               if(from==5) addSublist(form, "custpage_subtab_60_plus", "60+ Days",false);
            //addFormButtons(form, "custbtn_sendemail", "Send Email", "sendemail");
            addSubmitButtons(form, "custbtn_sendemail", "Send Email");
			 form.clientScriptModulePath = "SuiteScripts/Advectus/cs_insurance_dashboard.js";
            var search_c = search.load({
                id: 'customsearch_advs_tam_st_collection_dash'
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

                       /*  var dueDate = result.getValue({
                            name: 'custrecord_advs_l_h_ins_lia_exp_dt'
                        }); */
						 var dueDate =   result.getValue({name:'custrecord_advs_invoice_due_date'});

                            var ptpdate =   result.getValue({name:"startdate",join:'custrecord_advs_pro_to_pay_tas'});

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
								 
								  'serialnumber': result.getValue({
									name: "custrecord_advs_em_serial_number",
									join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
								  }),
                                'tasklink': result.getValue({
                                    name: 'custrecord_advs_task_link'
                                }),
                                'task_date': result.getValue({
                                    name: 'createddate',
                                    join: "CUSTRECORD_ADVS_TASK_LINK"
                                }),
								'ptp_date': ptpdate,
								  'ptp_amount': result.getValue({
									name: 'custrecord_advs_ptp_amount'
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
			  var zero_7_Sublistid    =   "custpage_sublist_custpage_subtab_0_7";
                var sublist_0_7 = form.getSublist({ id: zero_7_Sublistid });
                var count_0_7_amount    =   0,count_0_7=0;

                var eight_14_Sublistid    =   "custpage_sublist_custpage_subtab_8_14";
                var sublist_8_14 = form.getSublist({ id: eight_14_Sublistid });
                var count_8_14_amount    =   0,count_8_14=0;

                var fifteen_30_Sublistid    =   "custpage_sublist_custpage_subtab_15_30";
                var sublist_15_30 = form.getSublist({ id: fifteen_30_Sublistid });
                var count_15_30_amount    =   0,count_15_30=0;

                var thirty1_60_Sublistid    =   "custpage_sublist_custpage_subtab_31_60";
                var sublist_31_60 = form.getSublist({ id: thirty1_60_Sublistid });
                var count_31_60_amount    =   0,count_31_60=0;

                var sixtyplus_Sublistid    =   "custpage_sublist_custpage_subtab_60_plus";
                var sublist_60_plus = form.getSublist({ id: sixtyplus_Sublistid });
                var count_60_plus_amount    =   0,count_60_plus=0;


            var count_all_amount = 0,
            count_all = 0;
			/* var count_0_7_amount    =   '',count_0_7=0;
			var count_8_14_amount    =   '',count_8_14=0;
			 var count_15_30_amount    =   '',count_15_30=0;
			 var count_31_60_amount    =   '',count_31_60=0;
			  var count_60_plus_amount    =   '',count_60_plus=0; */

            for (var i = 0; i < dealLengthArray.length; i++) {
                var deal_id = dealLengthArray[i];

                if (deal_data_arr[deal_id] != null && deal_data_arr[deal_id] != undefined) {
                    var days = deal_data_arr[deal_id].ageindays;
                    days = days * 1;

                    var custID = deal_data_arr[deal_id]['customerid'];
                    log.debug("custID", custID);
					
					var serialnumber = deal_data_arr[deal_id]['serialnumber']|| ' ';
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
					var ptpDate = deal_data_arr[deal_id].ptp_date || " ";
					var ptp_amount = deal_data_arr[deal_id].ptp_amount || "0";
 
                    if(days <= 7 && from==1) {
                            sublist_0_7.setSublistValue({id:"cust_fi_list_dashboard",line:count_0_7,value:CustDashLink});
                            sublist_0_7.setSublistValue({id:"cust_fi_list_stock_no",line:count_0_7,value:stockREcLink});
                            // sublist_0_7.setSublistValue({id:"cust_fi_list_acc_stmt",line:count_0_7,value:accountStatement});
                            sublist_0_7.setSublistValue({id:"cust_fi_list_customer_id",line:count_0_7,value:custID});
                            sublist_0_7.setSublistValue({id:"cust_fi_list_customer",line:count_0_7,value:CustRecLink});
                            sublist_0_7.setSublistValue({id:'cust_fi_list_cre_task',line:  count_0_7,value: '<a href='+create_task_link1+' target=\'_blank\' >Create Task</a>'});
                            sublist_0_7.setSublistValue({id:'cust_fi_list_customer_mail',line: count_0_7 ,value: "<a href="+n_url_email+" target=\"_blank\">Email</a>"});
                            sublist_0_7.setSublistValue({id:'cust_fi_list_create_notes',line: count_0_7 ,value: "<a href="+createnotesLink+" target=\"_blank\">Create Notes</a>"});
                            if(mobileValue)
                                sublist_0_7.setSublistValue({id:'cust_fi_list_mobile',line: count_0_7 ,value: mobileValue});
                            sublist_0_7.setSublistValue({id:'cust_fi_list_due_date',line: count_0_7 ,value: duedate});
                            sublist_0_7.setSublistValue({id:'cust_fi_last_pay_date',line: count_0_7 ,value: lastinvoicedate});
                            sublist_0_7.setSublistValue({id:'cust_fi_list_days_due',line: count_0_7 ,value: duedays});
							
                            sublist_0_7.setSublistValue({id:'cust_fi_list_serial',line: count_0_7 ,value: serialnumber}); 
                            sublist_0_7.setSublistValue({id:'cust_fi_list_ptpdateone',line: count_0_7 ,value: ptpDate}); 
                            sublist_0_7.setSublistValue({id:'cust_fi_list_ptpamtone',line: count_0_7 ,value: ptp_amount}); 
                      if(totalDue!=''){
                        sublist_0_7.setSublistValue({id:'cust_fi_list_total_due',line: count_0_7 ,value: totalDue});
                      }
                            if(totaldueinvoice){
                                sublist_0_7.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_0_7 ,value: totaldueinvoice});
                            }
                          
                            count_0_7++;
                            count_0_7_amount += due_amount_local;

                        }
						else if((days >=8 && days <=14) &&  from==2){
                            sublist_8_14.setSublistValue({id:"cust_fi_list_dashboard",line:count_8_14,value:CustDashLink});
                            sublist_8_14.setSublistValue({id:"cust_fi_list_stock_no",line:count_8_14,value:stockREcLink});
                            // sublist_8_14.setSublistValue({id:"cust_fi_list_acc_stmt",line:count_8_14,value:accountStatement});							
                            sublist_8_14.setSublistValue({id:"cust_fi_list_customer_id",line:count_8_14,value:custID});
                            sublist_8_14.setSublistValue({id:"cust_fi_list_customer",line:count_8_14,value:CustRecLink});
                            sublist_8_14.setSublistValue({id:'cust_fi_list_cre_task',line:  count_8_14,value: '<a href='+create_task_link1+' target=\'_blank\' >Create Task</a>'});
                            sublist_8_14.setSublistValue({id:'cust_fi_list_customer_mail',line: count_8_14 ,value: "<a href="+n_url_email+" target=\"_blank\">Email</a>"});
                            sublist_8_14.setSublistValue({id:'cust_fi_list_create_notes',line: count_8_14 ,value: "<a href="+createnotesLink+" target=\"_blank\">Create Notes</a>"});
                            if(mobileValue)
                                sublist_8_14.setSublistValue({id:'cust_fi_list_mobile',line: count_8_14 ,value: mobileValue});
                            sublist_8_14.setSublistValue({id:'cust_fi_list_due_date',line: count_8_14 ,value: duedate});
                            sublist_8_14.setSublistValue({id:'cust_fi_last_pay_date',line: count_8_14 ,value: lastinvoicedate});
                            sublist_8_14.setSublistValue({id:'cust_fi_list_days_due',line: count_8_14 ,value: duedays});
							if(totalDue)
                            sublist_8_14.setSublistValue({id:'cust_fi_list_total_due',line: count_8_14 ,value: totalDue});
							if(totaldueinvoice)
                            sublist_8_14.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_8_14 ,value: totaldueinvoice});
                            sublist_8_14.setSublistValue({id:'cust_fi_list_serial',line: count_8_14 ,value: serialnumber});
                            sublist_8_14.setSublistValue({id:'cust_fi_list_ptpdateone',line: count_8_14 ,value: ptpDate});
                            sublist_8_14.setSublistValue({id:'cust_fi_list_ptpamtone',line: count_8_14 ,value: ptp_amount});
                            count_8_14++;
                            count_8_14_amount+= due_amount_local;
                        }
						else if((days >=15 && days <=30) &&  from==3){
                            sublist_15_30.setSublistValue({id:"cust_fi_list_dashboard",line:count_15_30,value:CustDashLink});
                            sublist_15_30.setSublistValue({id:"cust_fi_list_stock_no",line:count_15_30,value:stockREcLink});
                            // sublist_15_30.setSublistValue({id:"cust_fi_list_acc_stmt",line:count_15_30,value:accountStatement});
                            sublist_15_30.setSublistValue({id:"cust_fi_list_customer_id",line:count_15_30,value:custID});
                            sublist_15_30.setSublistValue({id:"cust_fi_list_customer",line:count_15_30,value:CustRecLink});
                            sublist_15_30.setSublistValue({id:'cust_fi_list_cre_task',line:  count_15_30,value: '<a href='+create_task_link1+' target=\'_blank\' >Create Task</a>'});
                            sublist_15_30.setSublistValue({id:'cust_fi_list_customer_mail',line: count_15_30 ,value: "<a href="+n_url_email+" target=\"_blank\">Email</a>"});
                            sublist_15_30.setSublistValue({id:'cust_fi_list_create_notes',line: count_15_30 ,value: "<a href="+createnotesLink+" target=\"_blank\">Create Notes</a>"});
                            if(mobileValue)
                                sublist_15_30.setSublistValue({id:'cust_fi_list_mobile',line: count_15_30 ,value: mobileValue});
                            sublist_15_30.setSublistValue({id:'cust_fi_list_due_date',line: count_15_30 ,value: duedate});
                            sublist_15_30.setSublistValue({id:'cust_fi_last_pay_date',line: count_15_30 ,value: lastinvoicedate});
                            sublist_15_30.setSublistValue({id:'cust_fi_list_days_due',line: count_15_30 ,value: duedays});
                            sublist_15_30.setSublistValue({id:'cust_fi_list_serial',line: count_15_30 ,value: serialnumber});
                            sublist_15_30.setSublistValue({id:'cust_fi_list_ptpdateone',line: count_15_30 ,value: ptpDate});
                            sublist_15_30.setSublistValue({id:'cust_fi_list_ptpamtone',line: count_15_30 ,value: ptp_amount});
							if(totalDue)
                            sublist_15_30.setSublistValue({id:'cust_fi_list_total_due',line: count_15_30 ,value: totalDue});
							if(totaldueinvoice)
                            sublist_15_30.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_15_30 ,value: totaldueinvoice});
                            count_15_30++;
                            count_15_30_amount+= due_amount_local;
                        }
						else if((days >=31 && days <=60) &&  from==4){
                            sublist_31_60.setSublistValue({id:"cust_fi_list_dashboard",line:count_31_60,value:CustDashLink});
                            sublist_31_60.setSublistValue({id:"cust_fi_list_stock_no",line:count_31_60,value:stockREcLink});
                            // sublist_31_60.setSublistValue({id:"cust_fi_list_acc_stmt",line:count_31_60,value:accountStatement});
                            sublist_31_60.setSublistValue({id:"cust_fi_list_customer_id",line:count_31_60,value:custID});
                            sublist_31_60.setSublistValue({id:"cust_fi_list_customer",line:count_31_60,value:CustRecLink});
                            sublist_31_60.setSublistValue({id:'cust_fi_list_cre_task',line:  count_31_60,value: '<a href='+create_task_link1+' target=\'_blank\' >Create Task</a>'});
                            sublist_31_60.setSublistValue({id:'cust_fi_list_customer_mail',line: count_31_60 ,value: "<a href="+n_url_email+" target=\"_blank\">Email</a>"});
                            sublist_31_60.setSublistValue({id:'cust_fi_list_create_notes',line: count_31_60 ,value: "<a href="+createnotesLink+" target=\"_blank\">Create Notes</a>"});
                            if(mobileValue)
                                sublist_31_60.setSublistValue({id:'cust_fi_list_mobile',line: count_31_60 ,value: mobileValue});
                            sublist_31_60.setSublistValue({id:'cust_fi_list_due_date',line: count_31_60 ,value: duedate});
                            sublist_31_60.setSublistValue({id:'cust_fi_last_pay_date',line: count_31_60 ,value: lastinvoicedate});
                            sublist_31_60.setSublistValue({id:'cust_fi_list_days_due',line: count_31_60 ,value: duedays});
							if(totalDue)
                            sublist_31_60.setSublistValue({id:'cust_fi_list_total_due',line: count_31_60 ,value: totalDue});
							if(totaldueinvoice)
                            sublist_31_60.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_31_60 ,value: totaldueinvoice});
                            sublist_31_60.setSublistValue({id:'cust_fi_list_ptpdateone',line: count_31_60 ,value: ptpDate});
                            sublist_31_60.setSublistValue({id:'cust_fi_list_serial',line: count_31_60 ,value: serialnumber});
                            sublist_31_60.setSublistValue({id:'cust_fi_list_ptpamtone',line: count_31_60 ,value: ptp_amount});
                            count_31_60++;
                            count_31_60_amount+= due_amount_local;
                        }
						else if(days >60 &&  from==5){
                            sublist_60_plus.setSublistValue({id:"cust_fi_list_dashboard",line:count_60_plus,value:CustDashLink});
                            sublist_60_plus.setSublistValue({id:"cust_fi_list_stock_no",line:count_60_plus,value:stockREcLink});
                            // sublist_60_plus.setSublistValue({id:"cust_fi_list_acc_stmt",line:count_60_plus,value:accountStatement});
                            sublist_60_plus.setSublistValue({id:"cust_fi_list_customer_id",line:count_60_plus,value:custID});
                            sublist_60_plus.setSublistValue({id:"cust_fi_list_customer",line:count_60_plus,value:CustRecLink});
                            sublist_60_plus.setSublistValue({id:'cust_fi_list_cre_task',line:  count_60_plus,value: '<a href='+create_task_link1+' target=\'_blank\' >Create Task</a>'});
                            sublist_60_plus.setSublistValue({id:'cust_fi_list_customer_mail',line: count_60_plus ,value: "<a href="+n_url_email+" target=\"_blank\">Email</a>"});
                            sublist_60_plus.setSublistValue({id:'cust_fi_list_create_notes',line: count_60_plus ,value: "<a href="+createnotesLink+" target=\"_blank\">Create Notes</a>"});
                            if(mobileValue)
                                sublist_60_plus.setSublistValue({id:'cust_fi_list_mobile',line: count_60_plus ,value: mobileValue});
                            sublist_60_plus.setSublistValue({id:'cust_fi_list_due_date',line: count_60_plus ,value: duedate});
                            sublist_60_plus.setSublistValue({id:'cust_fi_last_pay_date',line: count_60_plus ,value: lastinvoicedate});
                            sublist_60_plus.setSublistValue({id:'cust_fi_list_days_due',line: count_60_plus ,value: duedays});
                            sublist_60_plus.setSublistValue({id:'cust_fi_list_total_due',line: count_60_plus ,value: totalDue});
                            sublist_60_plus.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_60_plus ,value: totaldueinvoice});
                            sublist_60_plus.setSublistValue({id:'cust_fi_list_serial',line: count_60_plus ,value: serialnumber});
                            sublist_60_plus.setSublistValue({id:'cust_fi_list_ptpdateone',line: count_60_plus ,value: ptpDate});
                            sublist_60_plus.setSublistValue({id:'cust_fi_list_ptpamtone',line: count_60_plus ,value: ptp_amount});
                            count_60_plus++;
                            count_60_plus_amount+= due_amount_local;
                        }

                    
					 /* if(days <= 7) {
						  count_0_7++;
						//count_0_7_amount =   insurExpiration;
					 }else if(days >=8 && days <=14){
						 count_8_14++;
						// count_8_14_amount =   insurExpiration;
					 }else if(days >=15 && days <=30){
						  count_15_30++;
						 // count_15_30_amount =   insurExpiration;
					 }else if(days >=31 && days <=60){
						  count_31_60++;
						 // count_31_60_amount =   insurExpiration;
					 }else if(days >60){
						 count_60_plus++;
						// count_60_plus_amount =   insurExpiration;
					 } */
					 

                }
            }

             

            response.writePage(form);
        }
		
		else{
			 
			 var _emailtemplate = scriptContext.request.parameters.cust_email_template;
			 var from = scriptContext.request.parameters.cust_subl_from;
			 if(from==1){var sublistid = 'custpage_sublist_custpage_subtab_0_7'}
			 if(from==2){var sublistid = 'custpage_sublist_custpage_subtab_8_14'}
			 if(from==3){var sublistid = 'custpage_sublist_custpage_subtab_15_30'}
			 if(from==4){var sublistid = 'custpage_sublist_custpage_subtab_31_60'}
			 if(from==5){var sublistid = 'custpage_sublist_custpage_subtab_60_plus'}
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
					var entityName = scriptContext.request.getSublistValue({
                        group: sublistid,
                        name: 'cust_fi_list_customer_id',
                        line: i
                    });
					 vin = scriptContext.request.getSublistValue({
                        group: sublistid,
                        name: 'cust_fi_list_serial',
                        line: i
                    });
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
					body = body.replace('@VIN@',vin||'');
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
		   type: "customrecord_col_temp_name",
		   filters:
		   [
			  ["internalid","is",_emailtemplate]
		   ],
		   columns:
		   [
			  "custrecord_col_temp_subject",
			  "custrecord_col_temp_template_body",
			  search.createColumn({
				 name: "custrecord_col_temp_name",
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
		   obj.subject = result.getValue({name:'custrecord_col_temp_subject'});
		  obj. body = result.getValue({name:'custrecord_col_temp_template_body'});
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
         
        sublist.addField({
            id: 'cust_fi_list_mobile',
            type: serverWidget.FieldType.TEXT,
            label: 'Mobile #'
        });
		sublist.addField({
        id: 'cust_fi_list_serial',
        type: serverWidget.FieldType.TEXT,
        label: 'VIN',
      });
	  sublist.addField({
        id: 'cust_fi_list_ptpamtone',
        type: serverWidget.FieldType.TEXT,
        label: 'PTP AMT 1',
      });
      sublist.addField({
        id: 'cust_fi_list_ptpdateone',
        type: serverWidget.FieldType.TEXT,
        label: 'PTP DATE 1',
      });
      sublist.addField({
        id: 'cust_fi_list_ptpamounttwo',
        type: serverWidget.FieldType.TEXT,
        label: 'PTP AMT 2',
      });

      sublist.addField({
        id: 'cust_fi_list_ptpdatetwo',
        type: serverWidget.FieldType.TEXT,
        label: 'PTP DATE 2',
      });
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
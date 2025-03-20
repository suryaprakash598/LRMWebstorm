/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *@NAmdConfig ./configuration.json
 */
 define(['N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/format',
    './advs_lib_rental_leasing.js','underscore'
  ],
  /**
   * @param{runtime} runtime
   * @param{search} search
   * @param{serverWidget} serverWidget
   */
  (runtime, search, serverWidget, url, format, libleasing,underscore) => {
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
          title: "Collection Dashboard"
        });
        var inlineHTML = form.addField({
          id: "custpage_inlinehtml",
          type: serverWidget.FieldType.INLINEHTML,
          label: " "
        });
        inlineHTML.defaultValue = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';

        addSublist(form,  "custpage_subtab_0_7", "0 - 7 Days", false, 'trans');
        addSublist(form,  "custpage_subtab_8_14", "8 - 14 Days", false, 'trans');
        addSublist(form,  "custpage_subtab_15_30", "15 - 30 Days", false, 'trans');
        addSublist(form,  "custpage_subtab_31_60", "31 - 60 Days", false, 'trans');
        addSublist(form,  "custpage_subtab_60_plus", "60+ Days", false, 'trans');
        addSublist(form,  "custpage_subtab_all", "All", false, 'trans');
        addSublist1(form, "custpage_subtab_ptp_past", "PTP Failed", true, 'ptp');
        addSublist1(form, "custpage_subtab_ptp_today", "PTP today", true, 'ptp');
        addSublist1(form, "custpage_subtab_ptp_fut", "PTP Future", true, 'ptp'); 
        addSublist(form,  "custpage_subtab_cpc", "CPC", false, 'cpc'); 
		
        addFormButtons(form, "custbtn_0_7", "Send Email Lease", "sendemail1");
        addFormButtons(form, "custbtn_0_7", "Send Email PTP", "sendemail1ptp");
       /*  addFormButtons(form, "custbtn_8_14", "Send Email 8-14", "sendemail_8_14");
        addFormButtons(form, "custbtn_15_30", "Send Email 15-30", "sendemail_15_30");
        addFormButtons(form, "custbtn_30_60", "Send Email 30-60", "sendemail_30_60");
        addFormButtons(form, "custbtn_60_plus", "Send Email 60+", "sendemail_60_plus"); */
 
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

              var dueDate = result.getValue({
                name: 'custrecord_advs_invoice_due_date'
              }) || ' ';

              var ptpdate = result.getValue({
                name: "startdate",
                join: 'custrecord_advs_pro_to_pay_tas'
              });

              var lbdate =  result.getValue({
                name: "custrecord_advs_l_h_ins_lia_exp_dt",
              });
              var rddate = result.getValue({
                name: "custrecord_advs_l_h_reg_exp_date",
              });

             // log.debug("rddate001",rddate)


              var todayy = new Date();
              

              var lastpayment=result.getValue({
                name: 'custrecord_advs_l_h_lst_inv_date'
              });

              if (lastpayment) {
                var lastPaymentDate = new Date(lastpayment);
                var timeDifference = todayy - lastPaymentDate;
                var differenceInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                //log.debug("Difference in days:", differenceInDays);
            }  
              // Calculate the age in days
              var today = new Date();

              var dueDateTime = new Date(dueDate);
              var differenceInTime = today.getTime() - dueDateTime.getTime();
              var ageInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

              if (deal_data_arr.hasOwnProperty(dealId)) {

              } else {
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
                  'ptp_task': result.getValue({
                    name: 'custrecord_advs_pro_to_pay_tas'
                  }),
                  'ptp_taskName': result.getText({
                    name: 'custrecord_advs_pro_to_pay_tas'
                  }),
                  'broken_pro': result.getValue({
                    name: 'custrecord_advs_bro_pro_link'
                  }),
                  'broken_promise_name': result.getText({
                    name: 'custrecord_advs_bro_pro_link'
                  }),
                  'broken_promise_date': result.getValue({
                    name: "startdate",
                    join: 'custrecord_advs_bro_pro_link'
                  }),
                  'ptp_date': ptpdate,
                  'ptp_amount': result.getValue({
                    name: 'custrecord_advs_ptp_amount'
                  }),
                  'duedate': dueDate,
                  'ageindays': ageInDays,
                  'ofrlink': result.getValue({
                    name: 'custrecord_advs_l_a_ofr_link'
                  }),
                  'ofr_taskid': result.getValue({
                    name: "custrecord_advs_ofr_task",
                    join: 'custrecord_advs_l_a_ofr_link'
                  }),
                  'ofr_task_name': result.getText({
                    name: "custrecord_advs_ofr_task",
                    join: 'custrecord_advs_l_a_ofr_link'
                  }),
                  'ofr_date': result.getValue({
                    name: "custrecord_ofr_date",
                    join: 'custrecord_advs_l_a_ofr_link'
                  }),
                  'due_amount': result.getValue({
                    name: 'custrecord_advs_l_a_ttl_amnt_du_frm_invo'
                  }),
                  'lastinvoicedate': result.getValue({
                    name: 'custrecord_advs_l_h_lst_inv_date'
                  }),
                  'totaldueinvoice': result.getValue({
                    name: 'custrecord_advs_l_a_ttl_amnt_du_frm_invo'
                  }),

                  'cpcId': result.getValue({
                    name: 'custrecord_advs_l_a_curr_cps'
                  }),
                  'cpcdate': result.getValue({
                    name: "custrecord_advs_cpc_date",
                    join: 'custrecord_advs_l_a_ttl_amnt_du_frm_invo'
                  }),

                  'insurExpiration': result.getValue({
                    name: 'custrecord_advs_l_h_ins_lia_exp_dt'
                  }),
				  'companyname': result.getValue({
                    name: 'custrecord_advs_lease_comp_name_fa'
                  }),
				  'leaseinceptiondate': result.getValue({
                    name: 'custrecord_advs_l_h_start_date'
                  }),
                  'lbdate':lbdate,
                  'rddate': rddate,
                  'differenceInDays':differenceInDays
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

        var ptpTaskDetails = getPtpTaskDetails();
		var totalduedata = getTotalDue();
		var balanceduedata = getbalancegreater30days();
		var lastpaymentdata = getLastPaymentAmountOfCustomer();
		var nooflatepaymentsdata = getnooflatepayments();
		var brokenpromisesdata = getbrokenpromises();
		var multiptpdata = getptpamountanddata();
		var trailingAmountdata = trailingPayment30DaysAll();
		/* log.debug('totalduedata',totalduedata);
		log.debug('balanceduedata',balanceduedata);
		log.debug('lastpaymentdata',lastpaymentdata);
		log.debug('nooflatepaymentsdata',nooflatepaymentsdata);
		log.debug('brokenpromisesdata',brokenpromisesdata); */
		//log.debug('multiptpdata',multiptpdata);
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
        var create_history_link = url.resolveScript({
          scriptId: 'customscript_collection_dash_history',
          deploymentId: 'customdeploy_collection_dash_history'
        });

        var create_notes_link = url.resolveScript({
          scriptId: 'customscript_advs_ss_create_task_for_col',
          deploymentId: 'customdeploy_advs_ss_create_task_for_col'
        });

        var url_email = url.resolveScript({
          scriptId: 'customscript_ez_ssat_email_pop_up',
          deploymentId: 'customdeploy_ez_ssat_email_pop_up'
        });
        var naccountStatement = url.resolveScript({
          scriptId: 'customscript_advs_lease_payoff_summary',
          deploymentId: 'customdeploy_advs_lease_payoff_summary'
        });

        
        var cpc_Sublistid = "custpage_sublist_custpage_subtab_cpc";
        var cpc_sublist = form.getSublist({
          id: cpc_Sublistid
        });
        var cpc_Count = 0;
        var cpc_count_amount = 0;


        var zero_7_Sublistid = "custpage_sublist_custpage_subtab_0_7";
        var sublist_0_7 = form.getSublist({
          id: zero_7_Sublistid
        });
        var count_0_7_amount = 0,
          count_0_7 = 0;

        var eight_14_Sublistid = "custpage_sublist_custpage_subtab_8_14";
        var sublist_8_14 = form.getSublist({
          id: eight_14_Sublistid
        });
        var count_8_14_amount = 0,
          count_8_14 = 0;

        var fifteen_30_Sublistid = "custpage_sublist_custpage_subtab_15_30";
        var sublist_15_30 = form.getSublist({
          id: fifteen_30_Sublistid
        });
        var count_15_30_amount = 0,
          count_15_30 = 0;

        var thirty1_60_Sublistid = "custpage_sublist_custpage_subtab_31_60";
        var sublist_31_60 = form.getSublist({
          id: thirty1_60_Sublistid
        });
        var count_31_60_amount = 0,
          count_31_60 = 0;

        var sixtyplus_Sublistid = "custpage_sublist_custpage_subtab_60_plus";
        var sublist_60_plus = form.getSublist({
          id: sixtyplus_Sublistid
        });
        var count_60_plus_amount = 0,
          count_60_plus = 0;


        var ptppast_Sublistid = "custpage_sublist_custpage_subtab_ptp_past";
        var sublist_ptp_past = form.getSublist({
          id: ptppast_Sublistid
        });
        var count_ptp_past_amount = 0,
          count_ptp_past = 0;

        var ptptoday_Sublistid = "custpage_sublist_custpage_subtab_ptp_today";
        var sublist_ptp_today = form.getSublist({
          id: ptptoday_Sublistid
        });
        var count_ptp_today_amount = 0,
          count_ptp_today = 0;

        var ptpfuture_Sublistid = "custpage_sublist_custpage_subtab_ptp_fut";
        var sublist_ptp_fut = form.getSublist({
          id: ptpfuture_Sublistid
        });
        var count_ptp_fut_amount = 0,
          count_ptp_fut = 0;

        var all_Sublistid = "custpage_sublist_custpage_subtab_all";
        var sublist_all = form.getSublist({
          id: all_Sublistid
        });
        var count_all_amount = 0,
          count_all = 0;




        for (var i = 0; i < dealLengthArray.length; i++) {
          var deal_id = dealLengthArray[i];

          if (deal_data_arr[deal_id] != null && deal_data_arr[deal_id] != undefined) {
            var days = deal_data_arr[deal_id].ageindays;
            days = Math.abs(days * 1);

            var custID = deal_data_arr[deal_id]['customerid'];
            var serialnumber = deal_data_arr[deal_id]['serialnumber']|| ' ';
			var companyname = deal_data_arr[deal_id]['companyname']||' ';
			var leaseinceptiondate = deal_data_arr[deal_id]['leaseinceptiondate']||' ';

            var RDdate   = deal_data_arr[deal_id]['rddate']||'';
            var LBdate   = deal_data_arr[deal_id]['lbdate']||'';
            var noofdays = deal_data_arr[deal_id]['differenceInDays'] || ' ';

            // log.debug("RDdate", RDdate);
            // log.debug("LBdate", LBdate);

            var due_amount_local = deal_data_arr[deal_id]["due_amount"] * 1;
            var CustDashLink = "<a href=\"https://8760954.app.netsuite.com/app/center/card.nl?sc=-69&entityid=" + deal_data_arr[deal_id]['customerid'] + "\" target=\"_blank\">DASH</a>";
            var stock_carr = Stock_link + '&id=' + deal_id;
			var leasestatment = '<a href="#" onclick="searchhistoy('+deal_id+')"><i class="fa fa-history" style="font-size:24px" aria-hidden="true"></i>  </a>';
            var stockREcLink = '<a href="' + encodeURI(stock_carr) + '" target="_blank">' + encodeURI(deal_data_arr[deal_id]['leasenum']) + '</a>';
            var naccountStatementurl = naccountStatement + "&Custparam_curecid=" + deal_id;
            var accountStatement = '<a href="#" onclick="openstatement(\'' + encodeURI(naccountStatementurl) + '\')"><i class="fa fa-print" title="Lease Account Statement"></i></a>';
            var custLinkArr = customerUrl + '&id=' + deal_data_arr[deal_id]['customerid'];
            var CustRecLink = '<a href="' + encodeURI(custLinkArr) + '" target="_blank">' + deal_data_arr[deal_id]['cust_altname'] + '</a>';
            var create_task_link1 = create_task_link + '&custparam_cust=' + deal_data_arr[deal_id]['customerid'] + '&deal_id=' + deal_id; //colle_id
            var create_history_link1 = create_history_link + '&custparam_recid=' + deal_id; //colle_id
            var n_url_email = url_email + '&custparam_customer_id=' + deal_data_arr[deal_id]['customerid'] + '&deal_id=' + deal_id;
            var createnotesLink = create_notes_link + '&custparam_cust=' + deal_data_arr[deal_id]['customerid'] + '&deal_id=' + deal_id + '&from_notes=T'; //colle_id
            var mobileValue = deal_data_arr[deal_id]['customermobile'] || ' ';
            var duedate = deal_data_arr[deal_id]['duedate'] || ' ';
            var lastinvoicedate = deal_data_arr[deal_id]['lastinvoicedate'] || ' ';

            var duedays = deal_data_arr[deal_id]['ageindays'] || '0';
            var totalDue = deal_data_arr[deal_id]['totalDue'] || '';
            var totaldueinvoice = deal_data_arr[deal_id]['totaldueinvoice'] || '';
            var broken_promise_name = deal_data_arr[deal_id]['broken_promise_name'] || '';
            var ofrtaskLink = deal_data_arr[deal_id].ofr_taskid || "";
            var ofrtaskName = deal_data_arr[deal_id].ofr_task_name || "";
            var ofrDate = deal_data_arr[deal_id].ofr_date || "";
            var ptpTask = deal_data_arr[deal_id].ptp_task || "";
            var ptpDate = deal_data_arr[deal_id].ptp_date || " ";
            var ptp_amount = deal_data_arr[deal_id].ptp_amount || "0";
            var ptpName = deal_data_arr[deal_id].ptp_taskName || "";
            var b_prom_date = deal_data_arr[deal_id].broken_promise_date || "";
            var cpcId = deal_data_arr[deal_id].cpcId || "";
            var cpcdate = deal_data_arr[deal_id].cpcdate || "";
            var insurExpiration = deal_data_arr[deal_id].insurExpiration || "";
            var ofrlink = deal_data_arr[deal_id].ofrlink;
            var broken_pro = deal_data_arr[deal_id].broken_pro;

			var totaldue =underscore.findWhere(totalduedata,{'customer':custID});
			var balancedue =underscore.findWhere(balanceduedata,{'customer':custID});
			var lastpayment =underscore.findWhere(lastpaymentdata,{'customer':custID});
			var nooflatepayments =underscore.findWhere(nooflatepaymentsdata,{'customer':custID,'lease':deal_id});
			var noofbrokenpromises =underscore.findWhere(brokenpromisesdata,{'customer':custID});
			var multiptpdetails =underscore.where(multiptpdata,{'lease':deal_id});
			var scriptObj = runtime.getCurrentScript();
			var goven = scriptObj.getRemainingUsage();
			//log.debug('goven',goven);
			
			var filteredData = trailingAmountdata.filter(function(obj) {
					return (obj.leaseid === deal_id && obj.customer === custID);
				});
				var totalAmount = filteredData.reduce(function(sum, obj) {
							return sum + parseFloat(obj.amount);
						}, 0);
			var thirtydaystrailing = totalAmount;//trailingPayment30Days(custID,deal_id);
			var thirtydaystrailinglink = '<a href="https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2577&deploy=1&customer='+custID+'&leaseid='+deal_id+'" target="_blank">'+thirtydaystrailing+'</a>';
			//log.debug('multiptpdetails',multiptpdetails);
            if (days <= 7) {
                if(LBdate){
                    sublist_0_7.setSublistValue({
                        id: "cust_fi_list_lib_date",
                        line: count_0_7,
                        value: LBdate
                      });

                }
                 if(RDdate){
                    sublist_0_7.setSublistValue({
                        id: "cust_fi_list_reg_date",
                        line: count_0_7,
                        value: RDdate
                      });

                 }

                sublist_0_7.setSublistValue({
                id: "cust_fi_list_no_of_days",
                line: count_0_7,
                value: noofdays
                });

              sublist_0_7.setSublistValue({
                id: "cust_fi_list_dashboard",
                line: count_0_7,
                value: CustDashLink
              });
              sublist_0_7.setSublistValue({
                id: "cust_fi_list_stock_no",
                line: count_0_7,
                value: stockREcLink
              }); 
			  sublist_0_7.setSublistValue({
                id: "cust_fi_list_serial",
                line: count_0_7,
                value: serialnumber
              });
			  sublist_0_7.setSublistValue({
                id: "cust_fi_list_company",
                line: count_0_7,
                value: companyname
              });
			  sublist_0_7.setSublistValue({
                id: "cust_fi_list_phone",
                line: count_0_7,
                value: mobileValue
              });
			  if(multiptpdetails.length==1){
				   sublist_0_7.setSublistValue({
					id: "cust_fi_list_ptpamtone",
					line: count_0_7,
					value: ptp_amount
				  }); 
				  sublist_0_7.setSublistValue({
					id: "cust_fi_list_ptpdateone",
					line: count_0_7,
					value: ptpDate
				  });
			  }else if(multiptpdetails.length>1){
				   sublist_0_7.setSublistValue({
					id: "cust_fi_list_ptpamtone",
					line: count_0_7,
					value: ptp_amount
				  }); 
				  sublist_0_7.setSublistValue({
					id: "cust_fi_list_ptpdateone",
					line: count_0_7,
					value: ptpDate
				  });
				   sublist_0_7.setSublistValue({
					id: "cust_fi_list_ptpamounttwo",
					line: count_0_7,
					value: multiptpdetails[1].ptpamount
				  }); 
				  sublist_0_7.setSublistValue({
					id: "cust_fi_list_ptpdatetwo",
					line: count_0_7,
					value: multiptpdetails[1].ptpdate
				  });
				  
			  }
			 
			  sublist_0_7.setSublistValue({
                id: "cust_fi_list_next_pay_date",
                line: count_0_7,
                value: duedate
              });
			  sublist_0_7.setSublistValue({
                id: "cust_fi_list_last_payment_date",
                line: count_0_7,
                value: lastinvoicedate
              });
			  sublist_0_7.setSublistValue({
                id: "cust_fi_list_lease_inception_date",
                line: count_0_7,
                value: leaseinceptiondate
              });
              sublist_0_7.setSublistValue({
                id: "cust_fi_list_acc_stmt",
                line: count_0_7,
                value: accountStatement
              });
			  sublist_0_7.setSublistValue({
                id: "cust_fi_list_stmt_his",
                line: count_0_7,
                value: leasestatment
              });
              sublist_0_7.setSublistValue({
                id: "cust_fi_list_customer",
                line: count_0_7,
                value: CustRecLink
              });
              sublist_0_7.setSublistValue({
                id: 'cust_fi_list_cre_task',
                line: count_0_7,
                value: '<a href=' + create_task_link1 + ' target=\'_blank\' >Create PTP</a>'
              });
              sublist_0_7.setSublistValue({
                id: 'cust_fi_list_customer_mail',
                line: count_0_7,
                value: "<a href=" + n_url_email + " target=\"_blank\">Email</a>"
              });
              sublist_0_7.setSublistValue({
                id: 'cust_fi_list_create_notes',
                line: count_0_7,
                value: "<a href=" + createnotesLink + " target=\"_blank\">Create Notes</a>"
              });
              if (mobileValue)
                sublist_0_7.setSublistValue({
                  id: 'cust_fi_list_mobile',
                  line: count_0_7,
                  value: mobileValue
                });
              //sublist_0_7.setSublistValue({id:'cust_fi_list_due_date',line: count_0_7 ,value: duedate});
              //sublist_0_7.setSublistValue({id:'cust_fi_last_pay_date',line: count_0_7 ,value: lastinvoicedate});
              //sublist_0_7.setSublistValue({id:'cust_fi_list_days_due',line: count_0_7 ,value: duedays});
			  if(totaldue){
				   sublist_0_7.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_0_7 ,value: totaldue.amount});
			  }
			  if(balancedue){
				   sublist_0_7.setSublistValue({id:'cust_fi_list_balance_due',line: count_0_7 ,value: balancedue.amount});
			  }
			  if(lastpayment){
				   sublist_0_7.setSublistValue({id:'cust_fi_list_last_payment_amount',line: count_0_7 ,value: lastpayment.amount});
			  }
			  if(nooflatepayments){
				   sublist_0_7.setSublistValue({id:'cust_fi_list_number_of_late_payments',line: count_0_7 ,value: nooflatepayments.countofdocs});
			  }
			  if(noofbrokenpromises){
				   sublist_0_7.setSublistValue({id:'cust_fi_list_broken_promises',line: count_0_7 ,value: noofbrokenpromises.countofdocs});
			  }
			  if(thirtydaystrailing){
				   sublist_0_7.setSublistValue({id:'cust_fi_list_trailing_paid',line: count_0_7 ,value: thirtydaystrailinglink});
			  }
              
              // sublist_0_7.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_0_7 ,value: totaldueinvoice});
              sublist_0_7.setSublistValue({
                id: 'cust_fi_list_history',
                line: count_0_7,
                value: "<a href=" + create_history_link1 + " target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a></a>"
              });
              count_0_7++;
              count_0_7_amount += due_amount_local;

            }
			else if (days >= 8 && days <= 14) {
                sublist_8_14.setSublistValue({
                    id: "cust_fi_list_no_of_days",
                    line: count_8_14,
                    value: noofdays
                    });
    

                if(LBdate){
                    sublist_8_14.setSublistValue({
                        id: "cust_fi_list_lib_date",
                        line: count_8_14,
                        value: LBdate
                      });

                }
                 if(RDdate){
                    sublist_8_14.setSublistValue({
                        id: "cust_fi_list_reg_date",
                        line: count_8_14,
                        value: RDdate
                      });

                 }

              sublist_8_14.setSublistValue({
                id: "cust_fi_list_dashboard",
                line: count_8_14,
                value: CustDashLink
              });
              sublist_8_14.setSublistValue({
                id: "cust_fi_list_stock_no",
                line: count_8_14,
                value: stockREcLink
              });
			  sublist_8_14.setSublistValue({
                id: "cust_fi_list_serial",
                line: count_8_14,
                value: serialnumber
              });
			  sublist_8_14.setSublistValue({
                id: "cust_fi_list_company",
                line: count_8_14,
                value: companyname
              });
			  sublist_8_14.setSublistValue({
                id: "cust_fi_list_phone",
                line: count_8_14,
                value: mobileValue
              });
			 /*  sublist_8_14.setSublistValue({
                id: "cust_fi_list_ptpamtone",
                line: count_8_14,
                value: ptp_amount
              });
			  sublist_8_14.setSublistValue({
                id: "cust_fi_list_ptpdateone",
                line: count_8_14,
                value: ptpDate
              }); */
			  if(multiptpdetails.length==1){
				   sublist_8_14.setSublistValue({
					id: "cust_fi_list_ptpamtone",
					line: count_8_14,
					value: ptp_amount
				  }); 
				  sublist_8_14.setSublistValue({
					id: "cust_fi_list_ptpdateone",
					line: count_8_14,
					value: ptpDate
				  });
			  }else if(multiptpdetails.length>1){
				   sublist_8_14.setSublistValue({
					id: "cust_fi_list_ptpamtone",
					line: count_8_14,
					value: ptp_amount
				  }); 
				  sublist_8_14.setSublistValue({
					id: "cust_fi_list_ptpdateone",
					line: count_8_14,
					value: ptpDate
				  });
				   sublist_8_14.setSublistValue({
					id: "cust_fi_list_ptpamounttwo",
					line: count_8_14,
					value: multiptpdetails[1].ptpamount
				  }); 
				  sublist_8_14.setSublistValue({
					id: "cust_fi_list_ptpdatetwo",
					line: count_8_14,
					value: multiptpdetails[1].ptpdate
				  });
				  
			  }
			  sublist_8_14.setSublistValue({
                id: "cust_fi_list_next_pay_date",
                line: count_8_14,
                value: duedate
              });
			  sublist_8_14.setSublistValue({
                id: "cust_fi_list_last_payment_date",
                line: count_8_14,
                value: lastinvoicedate
              });
			  sublist_8_14.setSublistValue({
                id: "cust_fi_list_lease_inception_date",
                line: count_8_14,
                value: leaseinceptiondate
              });
              sublist_8_14.setSublistValue({
                id: "cust_fi_list_acc_stmt",
                line: count_8_14,
                value: accountStatement
              });
			  sublist_8_14.setSublistValue({
                id: "cust_fi_list_stmt_his",
                line: count_8_14,
                value: leasestatment
              });
              sublist_8_14.setSublistValue({
                id: "cust_fi_list_customer",
                line: count_8_14,
                value: CustRecLink
              });
              sublist_8_14.setSublistValue({
                id: 'cust_fi_list_cre_task',
                line: count_8_14,
                value: '<a href=' + create_task_link1 + ' target=\'_blank\' >Create PTP</a>'
              });
              sublist_8_14.setSublistValue({
                id: 'cust_fi_list_customer_mail',
                line: count_8_14,
                value: "<a href=" + n_url_email + " target=\"_blank\">Email</a>"
              });
              sublist_8_14.setSublistValue({
                id: 'cust_fi_list_create_notes',
                line: count_8_14,
                value: "<a href=" + createnotesLink + " target=\"_blank\">Create Notes</a>"
              });
              if (mobileValue)
                sublist_8_14.setSublistValue({
                  id: 'cust_fi_list_mobile',
                  line: count_8_14,
                  value: mobileValue
                });
              //sublist_8_14.setSublistValue({id:'cust_fi_list_due_date',line: count_8_14 ,value: duedate});
              // sublist_8_14.setSublistValue({id:'cust_fi_last_pay_date',line: count_8_14 ,value: lastinvoicedate});
              //sublist_8_14.setSublistValue({id:'cust_fi_list_days_due',line: count_8_14 ,value: duedays});
              //sublist_8_14.setSublistValue({id:'cust_fi_list_total_due',line: count_8_14 ,value: totalDue});
              //sublist_8_14.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_8_14 ,value: totaldueinvoice});
			  if(totaldue){
				   sublist_8_14.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_8_14 ,value: totaldue.amount});
			  }
			  if(balancedue){
				   sublist_8_14.setSublistValue({id:'cust_fi_list_balance_due',line: count_8_14 ,value: balancedue.amount});
			  }
			   if(lastpayment){
				   sublist_8_14.setSublistValue({id:'cust_fi_list_last_payment_amount',line: count_8_14 ,value: lastpayment.amount});
			  }
			  if(nooflatepayments){
				   sublist_8_14.setSublistValue({id:'cust_fi_list_number_of_late_payments',line: count_8_14 ,value: nooflatepayments.countofdocs});
			  }
			  if(noofbrokenpromises){
				   sublist_8_14.setSublistValue({id:'cust_fi_list_broken_promises',line: count_8_14 ,value: noofbrokenpromises.countofdocs});
			  }
			  if(thirtydaystrailing){
				   sublist_8_14.setSublistValue({id:'cust_fi_list_trailing_paid',line: count_8_14 ,value: thirtydaystrailinglink});
			  }
              sublist_8_14.setSublistValue({
                id: 'cust_fi_list_history',
                line: count_8_14,
                value: "<a href=" + create_history_link1 + " target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a></a>"
              });
              count_8_14++;
              count_8_14_amount += due_amount_local;
            }
			else if (days >= 15 && days <= 30) {
                sublist_15_30.setSublistValue({
                    id: "cust_fi_list_no_of_days",
                    line: count_15_30,
                    value: noofdays
                    });
    
                
                if(LBdate){
                    sublist_15_30.setSublistValue({
                        id: "cust_fi_list_lib_date",
                        line: count_15_30,
                        value: LBdate
                      });

                }
                 if(RDdate){
                    sublist_15_30.setSublistValue({
                        id: "cust_fi_list_reg_date",
                        line: count_15_30,
                        value: RDdate
                      });

                 }

              sublist_15_30.setSublistValue({
                id: "cust_fi_list_dashboard",
                line: count_15_30,
                value: CustDashLink
              });
              sublist_15_30.setSublistValue({
                id: "cust_fi_list_stock_no",
                line: count_15_30,
                value: stockREcLink
              });
			  sublist_15_30.setSublistValue({
                id: "cust_fi_list_serial",
                line: count_15_30,
                value: serialnumber
              });
			  sublist_15_30.setSublistValue({
                id: "cust_fi_list_company",
                line: count_15_30,
                value: companyname
              });
			  sublist_15_30.setSublistValue({
                id: "cust_fi_list_phone",
                line: count_15_30,
                value: mobileValue
              });
			  /* sublist_15_30.setSublistValue({
                id: "cust_fi_list_ptpamtone",
                line: count_15_30,
                value: ptp_amount
              });
			   sublist_15_30.setSublistValue({
                id: "cust_fi_list_ptpdateone",
                line: count_15_30,
                value: ptpDate
              }); */
			  
			  if(multiptpdetails.length==1){
				   sublist_15_30.setSublistValue({
					id: "cust_fi_list_ptpamtone",
					line: count_15_30,
					value: ptp_amount
				  }); 
				  sublist_15_30.setSublistValue({
					id: "cust_fi_list_ptpdateone",
					line: count_15_30,
					value: ptpDate
				  });
			  }else if(multiptpdetails.length>1){
				   sublist_15_30.setSublistValue({
					id: "cust_fi_list_ptpamtone",
					line: count_15_30,
					value: ptp_amount
				  }); 
				  sublist_15_30.setSublistValue({
					id: "cust_fi_list_ptpdateone",
					line: count_15_30,
					value: ptpDate
				  });
				   sublist_15_30.setSublistValue({
					id: "cust_fi_list_ptpamounttwo",
					line: count_15_30,
					value: multiptpdetails[1].ptpamount
				  }); 
				  sublist_15_30.setSublistValue({
					id: "cust_fi_list_ptpdatetwo",
					line: count_15_30,
					value: multiptpdetails[1].ptpdate
				  });
				  
			  }
			  sublist_15_30.setSublistValue({
                id: "cust_fi_list_next_pay_date",
                line: count_15_30,
                value: duedate
              });
			  sublist_15_30.setSublistValue({
                id: "cust_fi_list_last_payment_date",
                line: count_15_30,
                value: lastinvoicedate
              });
			  sublist_15_30.setSublistValue({
                id: "cust_fi_list_lease_inception_date",
                line: count_15_30,
                value: leaseinceptiondate
              });
              sublist_15_30.setSublistValue({
                id: "cust_fi_list_acc_stmt",
                line: count_15_30,
                value: accountStatement
              });
			  sublist_15_30.setSublistValue({
                id: "cust_fi_list_stmt_his",
                line: count_15_30,
                value: leasestatment
              });
              sublist_15_30.setSublistValue({
                id: "cust_fi_list_customer",
                line: count_15_30,
                value: CustRecLink
              });
              sublist_15_30.setSublistValue({
                id: 'cust_fi_list_cre_task',
                line: count_15_30,
                value: '<a href=' + create_task_link1 + ' target=\'_blank\' >Create PTP</a>'
              });
              sublist_15_30.setSublistValue({
                id: 'cust_fi_list_customer_mail',
                line: count_15_30,
                value: "<a href=" + n_url_email + " target=\"_blank\">Email</a>"
              });
              sublist_15_30.setSublistValue({
                id: 'cust_fi_list_create_notes',
                line: count_15_30,
                value: "<a href=" + createnotesLink + " target=\"_blank\">Create Notes</a>"
              });
              if (mobileValue)
                sublist_15_30.setSublistValue({
                  id: 'cust_fi_list_mobile',
                  line: count_15_30,
                  value: mobileValue
                });
              // sublist_15_30.setSublistValue({id:'cust_fi_list_due_date',line: count_15_30 ,value: duedate});
              //sublist_15_30.setSublistValue({id:'cust_fi_last_pay_date',line: count_15_30 ,value: lastinvoicedate});
              //sublist_15_30.setSublistValue({id:'cust_fi_list_days_due',line: count_15_30 ,value: duedays});
              //sublist_15_30.setSublistValue({id:'cust_fi_list_total_due',line: count_15_30 ,value: totalDue});
              //sublist_15_30.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_15_30 ,value: totaldueinvoice});
			  if(totaldue){
				   sublist_15_30.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_15_30 ,value: totaldue.amount});
			  }
			  if(balancedue){
				   sublist_15_30.setSublistValue({id:'cust_fi_list_balance_due',line: count_15_30 ,value: balancedue.amount});
			  }
			  if(lastpayment){
				   sublist_15_30.setSublistValue({id:'cust_fi_list_last_payment_amount',line: count_15_30 ,value: lastpayment.amount});
			  }
			   if(nooflatepayments){
				   sublist_15_30.setSublistValue({id:'cust_fi_list_number_of_late_payments',line: count_15_30 ,value: nooflatepayments.countofdocs});
			  }
			  if(noofbrokenpromises){
				   sublist_15_30.setSublistValue({id:'cust_fi_list_broken_promises',line: count_15_30 ,value: noofbrokenpromises.countofdocs});
			  }
			  if(thirtydaystrailing){
				   sublist_15_30.setSublistValue({id:'cust_fi_list_trailing_paid',line: count_15_30 ,value: thirtydaystrailinglink});
			  }
              sublist_15_30.setSublistValue({
                id: 'cust_fi_list_history',
                line: count_15_30,
                value: "<a href=" + create_history_link1 + " target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a></a>"
              });
              count_15_30++;
              count_15_30_amount += due_amount_local;
            } 
			else if (days >= 31 && days <= 60) {

                sublist_31_60.setSublistValue({
                    id: "cust_fi_list_no_of_days",
                    line: count_31_60,
                    value: noofdays
                    });
    

                  
                if(LBdate){
                    sublist_31_60.setSublistValue({
                        id: "cust_fi_list_lib_date",
                        line: count_31_60,
                        value: LBdate
                      });

                }
                 if(RDdate){
                    sublist_31_60.setSublistValue({
                        id: "cust_fi_list_reg_date",
                        line: count_31_60,
                        value: RDdate
                      });

                 }


              sublist_31_60.setSublistValue({
                id: "cust_fi_list_dashboard",
                line: count_31_60,
                value: CustDashLink
              });
              sublist_31_60.setSublistValue({
                id: "cust_fi_list_stock_no",
                line: count_31_60,
                value: stockREcLink
              });
			  sublist_31_60.setSublistValue({
                id: "cust_fi_list_serial",
                line: count_31_60,
                value: serialnumber
              });
			  sublist_31_60.setSublistValue({
                id: "cust_fi_list_company",
                line: count_31_60,
                value: companyname
              });
			  sublist_31_60.setSublistValue({
                id: "cust_fi_list_phone",
                line: count_31_60,
                value: mobileValue
              });
			 /*  sublist_31_60.setSublistValue({
                id: "cust_fi_list_ptpamtone",
                line: count_31_60,
                value: ptp_amount
              });
			   sublist_31_60.setSublistValue({
                id: "cust_fi_list_ptpdateone",
                line: count_31_60,
                value: ptpDate
              }); */
			   if(multiptpdetails.length==1){
				   sublist_31_60.setSublistValue({
					id: "cust_fi_list_ptpamtone",
					line: count_31_60,
					value: ptp_amount
				  }); 
				  sublist_31_60.setSublistValue({
					id: "cust_fi_list_ptpdateone",
					line: count_31_60,
					value: ptpDate
				  });
			  }else if(multiptpdetails.length>1){
				   sublist_31_60.setSublistValue({
					id: "cust_fi_list_ptpamtone",
					line: count_31_60,
					value: ptp_amount
				  }); 
				  sublist_31_60.setSublistValue({
					id: "cust_fi_list_ptpdateone",
					line: count_31_60,
					value: ptpDate
				  });
				   sublist_31_60.setSublistValue({
					id: "cust_fi_list_ptpamounttwo",
					line: count_31_60,
					value: multiptpdetails[1].ptpamount
				  }); 
				  sublist_31_60.setSublistValue({
					id: "cust_fi_list_ptpdatetwo",
					line: count_31_60,
					value: multiptpdetails[1].ptpdate
				  });
				  
			  }
			  sublist_31_60.setSublistValue({
                id: "cust_fi_list_next_pay_date",
                line: count_31_60,
                value: duedate
              });
			  sublist_31_60.setSublistValue({
                id: "cust_fi_list_last_payment_date",
                line: count_31_60,
                value: lastinvoicedate
              });
			  sublist_31_60.setSublistValue({
                id: "cust_fi_list_lease_inception_date",
                line: count_31_60,
                value: leaseinceptiondate
              });
              sublist_31_60.setSublistValue({
                id: "cust_fi_list_acc_stmt",
                line: count_31_60,
                value: accountStatement
              });
			  sublist_31_60.setSublistValue({
                id: "cust_fi_list_stmt_his",
                line: count_31_60,
                value: leasestatment
              });
              sublist_31_60.setSublistValue({
                id: "cust_fi_list_customer",
                line: count_31_60,
                value: CustRecLink
              });
              sublist_31_60.setSublistValue({
                id: 'cust_fi_list_cre_task',
                line: count_31_60,
                value: '<a href=' + create_task_link1 + ' target=\'_blank\' >Create PTP</a>'
              });
              sublist_31_60.setSublistValue({
                id: 'cust_fi_list_customer_mail',
                line: count_31_60,
                value: "<a href=" + n_url_email + " target=\"_blank\">Email</a>"
              });
              sublist_31_60.setSublistValue({
                id: 'cust_fi_list_create_notes',
                line: count_31_60,
                value: "<a href=" + createnotesLink + " target=\"_blank\">Create Notes</a>"
              });
              if (mobileValue)
                sublist_31_60.setSublistValue({
                  id: 'cust_fi_list_mobile',
                  line: count_31_60,
                  value: mobileValue
                });
              //sublist_31_60.setSublistValue({id:'cust_fi_list_due_date',line: count_31_60 ,value: duedate});
              //sublist_31_60.setSublistValue({id:'cust_fi_last_pay_date',line: count_31_60 ,value: lastinvoicedate});
              //sublist_31_60.setSublistValue({id:'cust_fi_list_days_due',line: count_31_60 ,value: duedays});
              //sublist_31_60.setSublistValue({id:'cust_fi_list_total_due',line: count_31_60 ,value: totalDue});
              //sublist_31_60.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_31_60 ,value: totaldueinvoice});
              sublist_31_60.setSublistValue({
                id: 'cust_fi_list_history',
                line: count_31_60,
                value: "<a href=" + create_history_link1 + " target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a></a>"
              });
			  if(totaldue){
				   sublist_31_60.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_31_60 ,value: totaldue.amount});
			  }
			  if(balancedue){
				   sublist_31_60.setSublistValue({id:'cust_fi_list_balance_due',line: count_31_60 ,value: balancedue.amount});
			  }
			  if(lastpayment){
				   sublist_31_60.setSublistValue({id:'cust_fi_list_last_payment_amount',line: count_31_60 ,value: lastpayment.amount});
			  }
			  if(nooflatepayments){
				   sublist_31_60.setSublistValue({id:'cust_fi_list_number_of_late_payments',line: count_31_60 ,value: nooflatepayments.countofdocs});
			  }
			  if(noofbrokenpromises){
				   sublist_31_60.setSublistValue({id:'cust_fi_list_broken_promises',line: count_31_60 ,value: noofbrokenpromises.countofdocs});
			  }
			   if(thirtydaystrailing){
				   sublist_31_60.setSublistValue({id:'cust_fi_list_trailing_paid',line: count_31_60 ,value: thirtydaystrailinglink});
			  }
              count_31_60++;
              count_31_60_amount += due_amount_local;
            } 
			else if (days > 60) {
                
                sublist_60_plus.setSublistValue({
                    id: "cust_fi_list_no_of_days",
                    line: count_60_plus,
                    value: noofdays
                    });
    

                if(LBdate){
                    sublist_60_plus.setSublistValue({
                        id: "cust_fi_list_lib_date",
                        line: count_60_plus,
                        value: LBdate
                      });

                }
                 if(RDdate){
                    sublist_60_plus.setSublistValue({
                        id: "cust_fi_list_reg_date",
                        line: count_60_plus,
                        value: RDdate
                      });

                 }

              sublist_60_plus.setSublistValue({
                id: "cust_fi_list_dashboard",
                line: count_60_plus,
                value: CustDashLink
              });
              sublist_60_plus.setSublistValue({
                id: "cust_fi_list_stock_no",
                line: count_60_plus,
                value: stockREcLink
              });
			  sublist_60_plus.setSublistValue({
                id: "cust_fi_list_serial",
                line: count_60_plus,
                value: serialnumber
              });
			  sublist_60_plus.setSublistValue({
                id: "cust_fi_list_company",
                line: count_60_plus,
                value: companyname
              });
			  sublist_60_plus.setSublistValue({
                id: "cust_fi_list_phone",
                line: count_60_plus,
                value: mobileValue
              });
			  /* sublist_60_plus.setSublistValue({
                id: "cust_fi_list_ptpamtone",
                line: count_60_plus,
                value: ptp_amount
              });
			   sublist_60_plus.setSublistValue({
                id: "cust_fi_list_ptpdateone",
                line: count_60_plus,
                value: ptpDate
              }); */
			   if(multiptpdetails.length==1){
				   sublist_60_plus.setSublistValue({
					id: "cust_fi_list_ptpamtone",
					line: count_60_plus,
					value: ptp_amount
				  }); 
				  sublist_60_plus.setSublistValue({
					id: "cust_fi_list_ptpdateone",
					line: count_60_plus,
					value: ptpDate
				  });
			  }else if(multiptpdetails.length>1){
				   sublist_60_plus.setSublistValue({
					id: "cust_fi_list_ptpamtone",
					line: count_60_plus,
					value: ptp_amount
				  }); 
				  sublist_60_plus.setSublistValue({
					id: "cust_fi_list_ptpdateone",
					line: count_60_plus,
					value: ptpDate
				  });
				   sublist_60_plus.setSublistValue({
					id: "cust_fi_list_ptpamounttwo",
					line: count_60_plus,
					value: multiptpdetails[1].ptpamount
				  }); 
				  sublist_60_plus.setSublistValue({
					id: "cust_fi_list_ptpdatetwo",
					line: count_60_plus,
					value: multiptpdetails[1].ptpdate
				  });
				  
			  }
			  sublist_60_plus.setSublistValue({
                id: "cust_fi_list_next_pay_date",
                line: count_60_plus,
                value: duedate
              });
			  sublist_60_plus.setSublistValue({
                id: "cust_fi_list_last_payment_date",
                line: count_60_plus,
                value: lastinvoicedate
              });
			   sublist_60_plus.setSublistValue({
                id: "cust_fi_list_lease_inception_date",
                line: count_60_plus,
                value: leaseinceptiondate
              });
              sublist_60_plus.setSublistValue({
                id: "cust_fi_list_acc_stmt",
                line: count_60_plus,
                value: accountStatement
              });
			   sublist_60_plus.setSublistValue({
                id: "cust_fi_list_stmt_his",
                line: count_60_plus,
                value: leasestatment
              });
              sublist_60_plus.setSublistValue({
                id: "cust_fi_list_customer",
                line: count_60_plus,
                value: CustRecLink
              });
              sublist_60_plus.setSublistValue({
                id: 'cust_fi_list_cre_task',
                line: count_60_plus,
                value: '<a href=' + create_task_link1 + ' target=\'_blank\' >Create PTP</a>'
              });
              sublist_60_plus.setSublistValue({
                id: 'cust_fi_list_customer_mail',
                line: count_60_plus,
                value: "<a href=" + n_url_email + " target=\"_blank\">Email</a>"
              });
              sublist_60_plus.setSublistValue({
                id: 'cust_fi_list_create_notes',
                line: count_60_plus,
                value: "<a href=" + createnotesLink + " target=\"_blank\">Create Notes</a>"
              });
              if (mobileValue)
                sublist_60_plus.setSublistValue({
                  id: 'cust_fi_list_mobile',
                  line: count_60_plus,
                  value: mobileValue
                });
              //sublist_60_plus.setSublistValue({id:'cust_fi_list_due_date',line: count_60_plus ,value: duedate});
              //sublist_60_plus.setSublistValue({id:'cust_fi_last_pay_date',line: count_60_plus ,value: lastinvoicedate});
              // sublist_60_plus.setSublistValue({id:'cust_fi_list_days_due',line: count_60_plus ,value: duedays});
              //sublist_60_plus.setSublistValue({id:'cust_fi_list_total_due',line: count_60_plus ,value: totalDue});
              //sublist_60_plus.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_60_plus ,value: totaldueinvoice});
              sublist_60_plus.setSublistValue({
                id: 'cust_fi_list_history',
                line: count_60_plus,
                value: "<a href=" + create_history_link1 + " target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a></a>"
              });
			  if(totaldue){
				   sublist_60_plus.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_60_plus ,value: totaldue.amount});
			  }
			  if(balancedue){
				   sublist_60_plus.setSublistValue({id:'cust_fi_list_balance_due',line: count_60_plus ,value: balancedue.amount});
			  }
			  if(lastpayment){
				   sublist_60_plus.setSublistValue({id:'cust_fi_list_last_payment_amount',line: count_60_plus ,value: lastpayment.amount});
			  }
			   if(nooflatepayments){
				   sublist_60_plus.setSublistValue({id:'cust_fi_list_number_of_late_payments',line: count_60_plus ,value: nooflatepayments.countofdocs});
			  }
			  if(noofbrokenpromises){
				   sublist_60_plus.setSublistValue({id:'cust_fi_list_broken_promises',line: count_60_plus ,value: noofbrokenpromises.countofdocs});
			  }
			  if(thirtydaystrailing){
				   sublist_60_plus.setSublistValue({id:'cust_fi_list_trailing_paid',line: count_60_plus ,value: thirtydaystrailinglink});
			  }
              count_60_plus++;
              count_60_plus_amount += due_amount_local;
            }
 
            if (cpcId) {

                cpc_sublist.setSublistValue({
                    id: "cust_fi_list_no_of_days",
                    line: cpc_Count,
                    value: noofdays
                    });
                      
                if(LBdate){
                    cpc_sublist.setSublistValue({
                        id: "cust_fi_list_lib_date",
                        line: cpc_Count,
                        value: LBdate
                      });

                }
                 if(RDdate){
                    cpc_sublist.setSublistValue({
                        id: "cust_fi_list_reg_date",
                        line: cpc_Count,
                        value: RDdate
                      });

                 }

              cpc_sublist.setSublistValue({
                id: "cust_fi_list_dashboard",
                line: cpc_Count,
                value: CustDashLink
              });
              cpc_sublist.setSublistValue({
                id: "cust_fi_list_stock_no",
                line: cpc_Count,
                value: stockREcLink
              });
              cpc_sublist.setSublistValue({
                id: "cust_fi_list_acc_stmt",
                line: cpc_Count,
                value: accountStatement
              });
			   cpc_sublist.setSublistValue({
                id: "cust_fi_list_stmt_his",
                line: cpc_Count,
                value: leasestatment
              });
			  cpc_sublist.setSublistValue({
                id: "cust_fi_list_serial",
                line: cpc_Count,
                value: serialnumber
              });
			  cpc_sublist.setSublistValue({
                id: "cust_fi_list_company",
                line: cpc_Count,
                value: companyname
              });
			   cpc_sublist.setSublistValue({
                id: "cust_fi_list_phone",
                line: cpc_Count,
                value: mobileValue
              });
			  /* cpc_sublist.setSublistValue({
                id: "cust_fi_list_ptpamtone",
                line: cpc_Count,
                value: ptp_amount
              });
			   cpc_sublist.setSublistValue({
                id: "cust_fi_list_ptpdateone",
                line: cpc_Count,
                value: ptpDate
              }); */
			  if(multiptpdetails.length==1){
				   cpc_sublist.setSublistValue({
					id: "cust_fi_list_ptpamtone",
					line: cpc_Count,
					value: ptp_amount
				  }); 
				  cpc_sublist.setSublistValue({
					id: "cust_fi_list_ptpdateone",
					line: cpc_Count,
					value: ptpDate
				  });
			  }else if(multiptpdetails.length>1){
				   cpc_sublist.setSublistValue({
					id: "cust_fi_list_ptpamtone",
					line: cpc_Count,
					value: ptp_amount
				  }); 
				  cpc_sublist.setSublistValue({
					id: "cust_fi_list_ptpdateone",
					line: cpc_Count,
					value: ptpDate
				  });
				   cpc_sublist.setSublistValue({
					id: "cust_fi_list_ptpamounttwo",
					line: cpc_Count,
					value: multiptpdetails[1].ptpamount
				  }); 
				  cpc_sublist.setSublistValue({
					id: "cust_fi_list_ptpdatetwo",
					line: cpc_Count,
					value: multiptpdetails[1].ptpdate
				  });
				  
			  }
			  cpc_sublist.setSublistValue({
                id: "cust_fi_list_next_pay_date",
                line: cpc_Count,
                value: duedate
              });
			  cpc_sublist.setSublistValue({
                id: "cust_fi_list_last_payment_date",
                line: cpc_Count,
                value: lastinvoicedate
              });
			  cpc_sublist.setSublistValue({
                id: "cust_fi_list_lease_inception_date",
                line: cpc_Count,
                value: leaseinceptiondate
              });
              cpc_sublist.setSublistValue({
                id: "cust_fi_list_customer",
                line: cpc_Count,
                value: CustRecLink
              });
              cpc_sublist.setSublistValue({
                id: 'cust_fi_list_cre_task',
                line: cpc_Count,
                value: '<a href=' + create_task_link1 + ' target=\'_blank\' >Create PTP</a>'
              });
              cpc_sublist.setSublistValue({
                id: 'cust_fi_list_customer_mail',
                line: cpc_Count,
                value: "<a href=" + n_url_email + " target=\"_blank\">Email</a>"
              });
              cpc_sublist.setSublistValue({
                id: 'cust_fi_list_create_notes',
                line: cpc_Count,
                value: "<a href=" + createnotesLink + " target=\"_blank\">Create Notes</a>"
              });
              if (mobileValue)
                cpc_sublist.setSublistValue({
                  id: 'cust_fi_list_mobile',
                  line: cpc_Count,
                  value: mobileValue
                });
              // cpc_sublist.setSublistValue({id:'cust_fi_list_due_date',line: cpc_Count ,value: duedate});
              //cpc_sublist.setSublistValue({id:'cust_fi_last_pay_date',line: cpc_Count ,value: lastinvoicedate});
              //cpc_sublist.setSublistValue({id:'cust_fi_list_days_due',line: cpc_Count ,value: duedays});
              //cpc_sublist.setSublistValue({id:'cust_fi_list_total_due',line: cpc_Count ,value: totalDue});
              //cpc_sublist.setSublistValue({id:'cust_fi_list_due_as_of_today',line: cpc_Count ,value: totaldueinvoice});
              cpc_sublist.setSublistValue({
                id: 'cust_fi_list_history',
                line: cpc_Count,
                value: "<a href=" + create_history_link1 + " target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a></a>"
              });
			  if(totaldue){
				  cpc_sublist.setSublistValue({id:'cust_fi_list_due_as_of_today',line: cpc_Count ,value: totaldue.amount});
			  }
			  if(balancedue){
				   cpc_sublist.setSublistValue({id:'cust_fi_list_balance_due',line: cpc_Count ,value: balancedue.amount});
			  }
			  if(lastpayment){
				   cpc_sublist.setSublistValue({id:'cust_fi_list_last_payment_amount',line: cpc_Count ,value: lastpayment.amount});
			  }
			  if(nooflatepayments){
				   cpc_sublist.setSublistValue({id:'cust_fi_list_number_of_late_payments',line: cpc_Count ,value: nooflatepayments.countofdocs});
			  }
			  if(noofbrokenpromises){
				   cpc_sublist.setSublistValue({id:'cust_fi_list_broken_promises',line: cpc_Count ,value: noofbrokenpromises.countofdocs});
			  }
			  if(thirtydaystrailing){
				   cpc_sublist.setSublistValue({id:'cust_fi_list_trailing_paid',line: cpc_Count ,value: thirtydaystrailinglink});
			  }
              cpc_Count++;
              cpc_count_amount += due_amount_local;
            }

            sublist_all.setSublistValue({
                id: "cust_fi_list_no_of_days",
                line: count_all,
                value: noofdays
                });

                if(LBdate){
                    sublist_all.setSublistValue({
                        id: "cust_fi_list_lib_date",
                        line: count_all,
                        value: LBdate
                      });

                }
                 if(RDdate){
                    sublist_all.setSublistValue({
                        id: "cust_fi_list_reg_date",
                        line: count_all,
                        value: RDdate
                      });

                 }


            sublist_all.setSublistValue({
              id: "cust_fi_list_dashboard",
              line: count_all,
              value: CustDashLink
            });
            sublist_all.setSublistValue({
              id: "cust_fi_list_stock_no",
              line: count_all,
              value: stockREcLink
            });
            sublist_all.setSublistValue({
              id: "cust_fi_list_acc_stmt",
              line: count_all,
              value: accountStatement
            });
			sublist_all.setSublistValue({
                id: "cust_fi_list_stmt_his",
                line: count_all,
                value: leasestatment
              });
			sublist_all.setSublistValue({
                id: "cust_fi_list_serial",
                line: count_all,
                value: serialnumber
              });
			  sublist_all.setSublistValue({
                id: "cust_fi_list_company",
                line: count_all,
                value: companyname
              }); 
			  sublist_all.setSublistValue({
                id: "cust_fi_list_phone",
                line: count_all,
                value: mobileValue
              });
			  /* sublist_all.setSublistValue({
                id: "cust_fi_list_ptpamtone",
                line: count_all,
                value: ptp_amount
              });
			   sublist_all.setSublistValue({
                id: "cust_fi_list_ptpdateone",
                line: count_all,
                value: ptpDate
              }); */
			  if(multiptpdetails.length==1){
				   sublist_all.setSublistValue({
					id: "cust_fi_list_ptpamtone",
					line: count_all,
					value: ptp_amount
				  }); 
				  sublist_all.setSublistValue({
					id: "cust_fi_list_ptpdateone",
					line: count_all,
					value: ptpDate
				  });
			  }else if(multiptpdetails.length>1){
				   sublist_all.setSublistValue({
					id: "cust_fi_list_ptpamtone",
					line: count_all,
					value: ptp_amount
				  }); 
				  sublist_all.setSublistValue({
					id: "cust_fi_list_ptpdateone",
					line: count_all,
					value: ptpDate
				  });
				   sublist_all.setSublistValue({
					id: "cust_fi_list_ptpamounttwo",
					line: count_all,
					value: multiptpdetails[1].ptpamount
				  }); 
				  sublist_all.setSublistValue({
					id: "cust_fi_list_ptpdatetwo",
					line: count_all,
					value: multiptpdetails[1].ptpdate
				  });
				  
			  }
			  sublist_all.setSublistValue({
                id: "cust_fi_list_next_pay_date",
                line: count_all,
                value: duedate
              });

			  sublist_all.setSublistValue({
                id: "cust_fi_list_last_payment_date",
                line: count_all,
                value: lastinvoicedate
              });
			  sublist_all.setSublistValue({
                id: "cust_fi_list_lease_inception_date",
                line: count_all,
                value: leaseinceptiondate
              });
            sublist_all.setSublistValue({
              id: "cust_fi_list_customer",
              line: count_all,
              value: CustRecLink
            });
            sublist_all.setSublistValue({
              id: 'cust_fi_list_cre_task',
              line: count_all,
              value: '<a href=' + create_task_link1 + ' target=\'_blank\' >Create PTP</a>'
            });
            sublist_all.setSublistValue({
              id: 'cust_fi_list_customer_mail',
              line: count_all,
              value: "<a href=" + n_url_email + " target=\"_blank\">Email</a>"
            });
            sublist_all.setSublistValue({
              id: 'cust_fi_list_create_notes',
              line: count_all,
              value: "<a href=" + createnotesLink + " target=\"_blank\">Create Notes</a>"
            });
            if (mobileValue)
              sublist_all.setSublistValue({
                id: 'cust_fi_list_mobile',
                line: count_all,
                value: mobileValue
              });
            //sublist_all.setSublistValue({id:'cust_fi_list_due_date',line: count_all ,value: duedate||' '});
            //sublist_all.setSublistValue({id:'cust_fi_last_pay_date',line: count_all ,value: lastinvoicedate||' '});
            // sublist_all.setSublistValue({id:'cust_fi_list_days_due',line: count_all ,value: duedays});
            //sublist_all.setSublistValue({id:'cust_fi_list_total_due',line: count_all ,value: totalDue});
            //sublist_all.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_all ,value: totaldueinvoice});
            sublist_all.setSublistValue({
              id: 'cust_fi_list_history',
              line: count_all,
              value: "<a href=" + create_history_link1 + " target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a></a>"
            });
			if(totaldue){
				   sublist_all.setSublistValue({id:'cust_fi_list_due_as_of_today',line: count_all ,value: totaldue.amount});
			  }
			  if(balancedue){
				   sublist_all.setSublistValue({id:'cust_fi_list_balance_due',line: count_all ,value: balancedue.amount});
			  }
			  if(lastpayment){
				   sublist_all.setSublistValue({id:'cust_fi_list_last_payment_amount',line: count_all ,value: lastpayment.amount});
			  }
			  if(nooflatepayments){
				   sublist_all.setSublistValue({id:'cust_fi_list_number_of_late_payments',line: count_all ,value: nooflatepayments.countofdocs});
			  }
			  if(noofbrokenpromises){
				   sublist_all.setSublistValue({id:'cust_fi_list_broken_promises',line: count_all ,value: noofbrokenpromises.countofdocs});
			  }
			  if(thirtydaystrailing){
				   sublist_all.setSublistValue({id:'cust_fi_list_trailing_paid',line: count_all ,value: thirtydaystrailinglink});
			  }
            count_all++;
            count_all_amount += due_amount_local;

          }
        }

        var pasttask_ptp = ptpTaskDetails[0].pasttask;
        var currenttask_ptp = ptpTaskDetails[0].currenttask;
        var futuretask_ptp = ptpTaskDetails[0].futuretask;

        var count_ptp_past = 0;
        for (var i = 0; i < pasttask_ptp.length; i++) {
          var ptptaskdata = pasttask_ptp[i];

          var company = ptptaskdata.company;
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
          var naccountStatementurl = naccountStatement + "&Custparam_curecid=" + leaseid;
          var accountStatement = '<a href="' + encodeURI(naccountStatementurl) + '" target="_blank"><i class="fa fa-print" title="Lease Account Statement"></i></a>';
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
          if (deal_data_arr[leaseid] != null && deal_data_arr[leaseid] != undefined) {
            duedays = deal_data_arr[leaseid]['ageindays'] || '0';
            totalDue = deal_data_arr[leaseid]['totalDue'] || '0';
            totaldueinvoice = deal_data_arr[leaseid]['totaldueinvoice'] || '0';
          }

           
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
          var naccountStatementurl = naccountStatement + "&Custparam_curecid=" + leaseid;
          var accountStatement = '<a href="' + encodeURI(naccountStatementurl) + '" target="_blank"><i class="fa fa-print" title="Lease Account Statement"></i></a>';
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
          if (deal_data_arr[leaseid] != null && deal_data_arr[leaseid] != undefined) {
            duedays = deal_data_arr[leaseid]['ageindays'] || '0';
            totalDue = deal_data_arr[leaseid]['totalDue'] || '0';
            totaldueinvoice = deal_data_arr[leaseid]['totaldueinvoice'] || '0';
          }
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
          var naccountStatementurl = naccountStatement + "&Custparam_curecid=" + leaseid;
          var accountStatement = '<a href="' + encodeURI(naccountStatementurl) + '" target="_blank"><i class="fa fa-print" title="Lease Account Statement"></i></a>';
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
          if (deal_data_arr[leaseid] != null && deal_data_arr[leaseid] != undefined) {
            duedays = deal_data_arr[leaseid]['ageindays'] || '0';
            totalDue = deal_data_arr[leaseid]['totalDue'] || '0';
            totaldueinvoice = deal_data_arr[leaseid]['totaldueinvoice'] || '0';
          }
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
            id: "cust_fi_list_stock_no",
            line: count_ptp_fut,
            value: stockREcLink
          });
		   
          count_ptp_fut_amount += amount;
          count_ptp_fut++;
        }


        var count_lease_a = 0; // Initial value for count_lease_a
        var ofr_count_a = 0; // Initial value for ofr_count_a
        var imp_count_a = 0; // Initial value for imp_count_a
        var ptp_count_a_past = 0; // Initial value for ptp_count_a_past
        var ptp_count_a = 0; // Initial value for ptp_count_a
        var ptp_count_a_feat = 0; // Initial value for ptp_count_a_feat
        var tempData = [];
        var obj;

        obj = {};
        obj.name = "0-7 Days";
        obj.y = count_lease_a;
        obj.sliced = true;
        obj.selected = true;
        tempData.push(obj);

        obj = {};
        obj.name = "8-14 Days";
        obj.y = ofr_count_a;
        tempData.push(obj);

        obj = {};
        obj.name = "15-30 Days";
        obj.y = imp_count_a;
        tempData.push(obj);

        obj = {};
        obj.name = "30-60 Days";
        obj.y = ptp_count_a_past;
        tempData.push(obj);

        obj = {};
        obj.name = "60+";
        obj.y = ptp_count_a;
        tempData.push(obj);

        obj = {};
        obj.name = "PTP Future";
        obj.y = ptp_count_a_feat;
        tempData.push(obj);

        var html_fld = form.addField({
          id: 'custpage_summary',
          type: 'inlinehtml',
          label: ' '
        });
        var table = "<link rel='stylesheet' href='https://system.netsuite.com/c.TSTDRV1064792/suitebundle178234/Agenda%20New/Customer_message_css.css'>" +
          "<script>" +
          "function popupCenter(pageURL, title,w,h) {" +
          "var left = (screen.width/2)-(w/2);" +
          "var top = (screen.height/2)-(h/2);" +
          "var targetWin = window.open (pageURL, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);" +
          "}" +
          "</script>" +
          "<div class='main-content'><div class='main-content-left'><div>" +
          "<table class=\"bordered\" width='200px !important'>" +
          "<tr><th width='70%'></th>" +
          "<th>Count</th>" +
          "<th>Amount</th></tr>";

        var count_lease_amount = 0;
        var imp_count_amount = 0;
        // Rows for different categories of data
        var rows = [{
            name: "0-7 Days",
            count: count_0_7,
            amount: count_0_7_amount.toFixed(2)
          },
          {
            name: "8-14 Days",
            count: count_8_14,
            amount: count_8_14_amount.toFixed(2)
          },
          {
            name: "15-30 Days",
            count: count_15_30,
            amount: count_15_30_amount.toFixed(2)
          },
          {
            name: "31-60 Days",
            count: count_31_60,
            amount: count_31_60_amount.toFixed(2)
          },
          {
            name: "60++ Days",
            count: count_60_plus,
            amount: count_60_plus_amount.toFixed(2)
          },
          {
            name: "PTP Failed",
            count: count_ptp_past,
            amount: "0.00"
          },
          {
            name: "PTP Today",
            count: count_ptp_today,
            amount: "0.00"
          },
          {
            name: "PTP Future",
            count: count_ptp_fut,
            amount: "0.00"
          },
          {
            name: "CPC",
            count: cpc_Count,
            amount: "0.00"
          },
           
        ];

        // Construct table rows
        rows.forEach(function (row) {
          table += "<tr><th>" + row.name + "</th>" +
            "<th style='text-align:center;font-size:12px'>" + row.count + "</th>" +
            "<th style='text-align:center;font-size:12px'>" + row.amount + "</th></tr>";
        });

        table += "</table></div></div>";

        table += generateHtmlTop(tempData);
        table += "</div>";
        html_fld.defaultValue = table;

        response.writePage(form);
      }
    }

    function addSublist(form, tabId, tabLabel, requiredTaskinfo, type) {
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

      addSublistFields(sublist, requiredTaskinfo, type);
    }
	function addSublist1(form, tabId, tabLabel, requiredTaskinfo, type) {
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

      addSublistFields1(sublist, requiredTaskinfo, type);
    }
    function addSublistFields(sublist, requiredTaskinfo, type) {

      sublist.addField({
        id: 'cust_fi_list_dashboard',
        type: serverWidget.FieldType.TEXT,
        label: 'Cust Dash'
      });
      sublist.addField({
        id: 'cust_fi_list_cre_task',
        type: serverWidget.FieldType.TEXT,
        label: 'Create PTP'
      });
      sublist.addField({
        id: 'cust_fi_list_create_notes',
        type: serverWidget.FieldType.TEXT,
        label: 'Notes'
      });
      sublist.addField({
        id: 'cust_fi_list_acc_stmt',
        type: serverWidget.FieldType.TEXT,
        label: 'A/c STMT'
      });
      sublist.addField({
        id: 'cust_fi_list_stmt_his',
        type: serverWidget.FieldType.TEXT,
        label: 'STMT HISTORY'
      });
      sublist.addField({
        id: 'cust_fi_list_customer',
        type: serverWidget.FieldType.TEXT,
        label: 'Customer Name',
      });
      sublist.addField({
        id: 'cust_fi_list_company',
        type: serverWidget.FieldType.TEXT,
        label: 'Company Name',
      });
      sublist.addField({
        id: 'cust_fi_list_phone',
        type: serverWidget.FieldType.TEXT,
        label: 'Phone 1',
      });
      sublist.addField({
        id: 'cust_fi_list_phonetwo',
        type: serverWidget.FieldType.TEXT,
        label: 'Phone 2',
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
        id: 'cust_fi_list_next_pay_date',
        type: serverWidget.FieldType.TEXT,
        label: 'Next Payment',
      });
      sublist.addField({
        id: 'cust_fi_list_balance_due',
        type: serverWidget.FieldType.TEXT,
        label: 'Balance Due > 30 days',
      });
      sublist.addField({
        id: 'cust_fi_list_due_as_of_today',
        type: serverWidget.FieldType.CURRENCY,
        label: 'Total Due'
      });
      sublist.addField({
        id: 'cust_fi_list_trailing_paid',
        type: serverWidget.FieldType.TEXT,
        label: 'Trailing 30 Days Paid',
      });
      sublist.addField({
        id: 'cust_fi_list_last_payment_amount',
        type: serverWidget.FieldType.TEXT,
        label: 'Last Pay Amount',
      });
	sublist.addField({
        id: 'cust_fi_list_no_of_days',
        type: serverWidget.FieldType.TEXT,
        label: 'No of Days',
      });
      sublist.addField({
        id: 'cust_fi_list_last_payment_date',
        type: serverWidget.FieldType.TEXT,
        label: 'Last Pay Date',
      });
      sublist.addField({
        id: 'cust_fi_list_lease_inception_date',
        type: serverWidget.FieldType.TEXT,
        label: 'Lease Inception Date',
      });
      sublist.addField({
        id: 'cust_fi_list_number_of_late_payments',
        type: serverWidget.FieldType.TEXT,
        label: 'No. of Late Payments',
      });

      sublist.addField({
        id: 'cust_fi_list_broken_promises',
        type: serverWidget.FieldType.TEXT,
        label: 'No. of Broken Promises',
      });

      sublist.addField({
        id: 'cust_fi_list_lib_date',
        type: serverWidget.FieldType.DATE,
        label: 'LB Date',
      }).updateDisplayType({
        displayType: serverWidget.FieldDisplayType.HIDDEN
    });

      sublist.addField({
        id: 'cust_fi_list_reg_date',
        type: serverWidget.FieldType.DATE,
        label: 'REG Date',
      }).updateDisplayType({
        displayType: serverWidget.FieldDisplayType.HIDDEN
    });


      sublist.addField({
        id: 'cust_fi_list_stock_no',
        type: serverWidget.FieldType.TEXT,
        label: 'Lease #'
      });


 

    }
	function addSublistFields1(sublist, requiredTaskinfo, type) { 
	
	  sublist.addField({
        id: 'cust_fi_list_open_task',
        type: serverWidget.FieldType.TEXT,
        label: 'PTP Link'
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
    function CheckAnd(String) {
      if (String != null && String != undefined && String != '' && String != 'null' && String != 'undefined') {
        return 1;
      } else {
        return 0;
      }
    }
    function generateHtmlTop(tempData) {
      var vmSearch = search.create({
        type: "customrecord_advs_vm",
        filters: [
          ["custrecord_advs_vm_reservation_status", "anyof", "1"],
        ],
        columns: [
          search.createColumn({
            name: "internalid",
            summary: "COUNT"
          })
        ]
      });
      var AvailableVehicle = 0;
      vmSearch.run().each(function (rec) {
        AvailableVehicle = rec.getValue({
          name: "internalid",
          summary: "COUNT"
        });
        return true;
      });
      var vmSearchObj = InventorySearch()
      var pageSize = 1000;
      var pageId = 0;
      var searchObj = vmSearchObj.runPaged({
        pageSize: pageSize,
      });
      var searchObj = vmSearchObj.runPaged({
        pageSize: pageSize,
      });


      var pageCount = Math.ceil(searchObj.count / pageSize);
      // Set pageId to correct value if out of index
      if (!pageId || pageId == '' || pageId < 0)
        pageId = 0;
      else if (pageId >= pageCount)
        pageId = pageCount - 1;


      var addResults = [{}];
      if (searchObj.count > 0) {
        addResults = fetchSearchResult(searchObj, pageId);
      } else {
        var addResults = [{}];
      }
      log.debug('searchObj.count', searchObj.count);
      var _inventoyCount = addResults.length || 0;
      AvailableVehicle = _inventoyCount; 
	  
      var leaseSearch = search.create({
        type: "customrecord_advs_vm",
        filters: [
          ["custrecord_advs_vm_reservation_status", "anyof", "13"], "AND",
          ["custrecord_vehicle_master_bucket", "noneof", "@NONE@"]
        ],
        columns: [
          search.createColumn({
            name: "internalid",
            summary: "COUNT"
          })
        ]
      });

      var leaseSearchResults = leaseSearch.run();
      var leaseSearchResult = leaseSearchResults.getRange(0, 1000);
      var Leasecount = leaseSearchResult.length > 0 ? leaseSearchResult[0].getValue({
        name: 'internalid',
        summary: 'COUNT'
      }) : 0;

      var REgularamnt = 0;
      var irRegularAmnt = 0;
      var otherCharges = 0;

      var invSearch2 = search.create({
        type: "invoice",
        filters: [
          ["type", "anyof", "CustInvc"],
          "AND",
          ["mainline", "is", "T"],
        ],
        columns: [
          search.createColumn({
            name: "formulacurrency1",
            summary: "SUM",
            formula: "CASE WHEN {custbody_advs_invoice_type.internalid} = 1 THEN {amountremaining} ELSE 0 END "
          }),
        ]
      });

      invSearch2.run().each(function (resin) {
        REgularamnt = parseFloat(resin.getValue({
          name: "formulacurrency1",
          summary: "SUM"
        })) || 0;
        return true;
      })

      

      var StringFyData = JSON.stringify(tempData);

      var html = "";

      html += "<div class='main-content-right'>";
      html += "<div>";
      html += "<div class='container'>";

      html += "<div class='tile wide resource'>";
      html += "<div class='header'>";
      html += "<div class='left'>";
      html += "<div class='count'>" + AvailableVehicle + "</div>";
      //      html+="<div class='title'>Available</div>";
      html += "<div class='title'><a href='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1198&deploy=1&compid=8760954&whence=' class='title' target='_blank' style='color: white;text-decoration:none;'>Available</a></div>";
      html += "</div>";
      html += "<div class='right'>";
      html += "<div class='count'>" + Leasecount + "</div>";
      //      html+="<div class='title'>On Lease</div>";
      html += "<div class='title'><a href='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1709&deploy=1' class='title' target='_blank' style='color: white;text-decoration:none;'>On Lease</a></div>";
      html += "</div>";

      html += "</div>";
      html += "<div class='body'>";
      html += "<div class='title'>Vehicles Info</div>";
      html += "</div>";
      html += "</div>";

      html += "<div class='tile job'>";
      html += "<div class='header'>";
      html += "<div class='count amntcnt'>" + REgularamnt + "</div>";
      /*html+="<div class='title'>Jobs</div>";*/
      html += "</div>";
      html += "<div class='body'>";
      //      html+="<div class='title'>Regular Due</div>";
      html += "<div class='title'><a href='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1707&deploy=1' class='title' target='_blank' style='color:green;text-decoration:none;'>Regular Due</a></div>";
      html += "</div>";
      html += "</div>"; 

      html += "</div>";

      html += "</div>";


      html += "</div>"; 
      html += "<style>";
      html += ".main-content{";
      html += "width: 100%;";
      html += "display:flex;";
      //	html+="border:1px solid black;";
      html += "}";
      html += ".main-content-left{";
      html += "width: 35%;";
      //	html+="border:1px solid black;";
      html += "}";
      html += ".main-content-right{";
      html += "width: 75%;";
      //	html+="border:1px solid black;";
      html += "}";

      html += ".highcharts-figure,";
      html += ".highcharts-data-table table {";
      html += "min-width: 200px;";
      html += "max-width: 400px;";
      html += "margin: 1em auto;";
      html += "}";

      html += ".highcharts-data-table table {";
      html += "font-family: Verdana, sans-serif;";
      html += "border-collapse: collapse;";
      html += "border: 1px solid #ebebeb;";
      /* margin: 10px auto;*/
      html += "text-align: center;";
      html += "width: 30%;";
      html += "max-width: 200px;";
      html += "}";

      html += ".highcharts-data-table caption {";

      html += "padding: 1em 0;";
      html += "font-size: 11pt;";
      html += "color: #555;";
      html += "}";

      html += ".highcharts-data-table th {";
      html += "font-weight: 100;";
      /*padding: 0.5em;*/
      html += "}";

      html += ".highcharts-data-table td,";
      html += ".highcharts-data-table th,";
      html += ".highcharts-data-table caption {";
      html += "padding: 0.5em;";
      html += "}";

      html += ".highcharts-data-table thead tr,";
      html += ".highcharts-data-table tr:nth-child(even) {";
      html += "background: #f8f8f8;";
      html += "}";

      html += ".highcharts-data-table tr:hover {";
      html += "background: #f1f7ff;";
      html += "}";

      html += "input[type='number'] {";
      html += "min-width: 50px;";
      html += "}";

      html += "@import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600');";
      html += "@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css');";

      html += "* {";
      html += "font-family: 'Open Sans', sans-serif;";
      html += "font-size:12px;";
      html += "}";


      html += ".container {";
      //	html+="margin: 50px 0 0 100px;";
      html += "}";

      html += ".tile {";
      html += "width:135px;";
      html += "height:180px;";
      html += "border-radius:4px;";
      html += "box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.15);";
      html += "margin-top:20px;";
      html += "margin-left:20px;";
      html += "float:left;";
      html += "}";

      html += ".tile.wide {";
      html += "width: 325px;";
      html += "}";

      html += ".tile .header {";
      html += "height:120px;";
      html += "background-color:#f4f4f4;";
      html += "border-radius: 4px 4px 0 0;";
      html += "color:white;";
      html += "font-weight:300;";
      html += "}";

      html += ".tile.wide .header .left, .tile.wide .header .right {";
      html += "	width:160px;";
      html += "float:left;";
      html += "}";

      html += ".tile .header .count {";
      html += "font-size: 48px;";
      html += "text-align:center;";
      html += "padding:10px 0 0;";
      html += "}.amntcnt{font-size:15pt !important;padding: 32px 12px !important;}";

      html += ".tile .header .title {";
      html += "font-size: 20px;";
      html += "text-align:center;";
      html += "}";

      html += ".tile .body {";
      html += "height:60px;";
      html += "border-radius: 0 0 4px 4px;";
      html += "color:#333333;";
      html += "background-color:white;";
      html += "}";

      html += ".tile .body .title {";
      html += "text-align:center;";
      html += "font-size:20px;";
      html += "padding-top:2%;";
      html += "}";

      html += ".tile.wide .body .title {";
      html += "padding:4%;";
      html += "}";

      html += ".tile.job .header {";
      html += "background: linear-gradient(to bottom right, #609931, #87bc27);";
      html += "}.blue{background:linear-gradient(to bottom right, lightblue, lightblue) !important;}";

      html += ".tile.job  .body {";
      html += "color: #609931;";
      html += "}";

      html += ".tile.resource .header {";
      html += "background: linear-gradient(to bottom right, #ef7f00, #f7b200);";
      html += "}";

      html += ".tile.resource  .body {";
      html += "color: #ef7f00;";
      html += "}";

      html += ".tile.quote .header {";
      html += "background: linear-gradient(to bottom right, #1f6abb, #4f9cf2);";
      html += "}";

      html += ".tile.quote  .body {";
      html += "color: #1f6abb;";
      html += "}";

      html += ".tile.invoice .header {";
      html += "background: linear-gradient(to bottom right, #0aa361, #1adc88);";
      html += "}";

      html += ".tile.invoice  .body {";
      html += "	color: #0aa361;";
      html += "}";

      html += "</style>";
      html += "<script>";
      // Data retrieved from https://netmarketshare.com
      html += "Highcharts.chart('container', {";
      html += "chart: {";
      html += "plotBackgroundColor: null,";
      html += "plotBorderWidth: null,";
      html += "plotShadow: false,";
      html += "type: 'pie'";
      html += "},";
      html += "title: {";
      html += "text: '',";
      html += "align: 'left'";
      html += "},";
      html += "tooltip: {";
      html += "	pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'";
      html += "},";
      html += "accessibility: {";
      html += "point: {";
      html += "valueSuffix: '%'";
      html += "}";
      html += "},";
      html += "plotOptions: {";
      html += "pie: {";
      html += "allowPointSelect: true,";
      html += "cursor: 'pointer',";
      html += "dataLabels: {";
      html += "enabled: true,";
      html += "				format: '<b>{point.name}</b>: {point.percentage:.1f}%'";
      /*html+="				format: '<b>{point.name}</b>: {point.y}'";*/
      html += "			}";
      html += "		}";
      html += "	},";
      html += "	series: [{";
      html += "		name: 'Brands',";
      html += "		colorByPoint: true,";
      
      html += "		data: " + StringFyData + "";
      html += "}]";
      html += "});";
	html+=`function searchhistoy(id)
	{
		debugger;
      /*  var suiteletURL = url.resolveScript({
			scriptId:'customscript_advs_lease_agree_history',
			deploymentId: 'customdeploy_advs_lease_agree_history',
			 
        }); */
		var suiteletURL = "/app/site/hosting/scriptlet.nl?script=customscript_advs_lease_agree_history&deploy=1&compid=8760954&curREc="+id+"&ifrmcntnr=T";
		//suiteletURL +="&curREc="+id;
		window.open(suiteletURL, "_blank",  "width=450, height=450" );
	}`;
	html+=`function openstatement(url)
	{
		debugger;
      
		var suiteletURL =  url;
		window.open(suiteletURL, "_blank",  "width=850, height=450" );
	}`;
      html += "</script>";

      return html;
    }
    function addFormButtons(form, id, label, functionCall) {
      form.addButton({
        id: id,
        label: label,
        functionName: functionCall + '()'
      });
    }
    function InventorySearch() {
      var vmSearchObj = search.create({
        type: "customrecord_advs_vm",
        filters: [
          // ["custrecord_advs_vm_reservation_status", "anyof", "1"], "AND",
          ["custrecord_advs_vm_reservation_status", "anyof", "15", "19", "20", "21", "22", "23", "24"], "AND",
          ["custrecord_vehicle_master_bucket", "noneof", "@NONE@"]
        ],
        columns: [
          search.createColumn({
            name: "internalid",
          }),
          search.createColumn({
            name: "name",
            sort: search.Sort.ASC,
            label: "Name"
          }),
          search.createColumn({
            name: "custrecord_advs_vm_model",
            label: "Model"
          }),
          /* search.createColumn({
            name: "custrecord_advs_lease_comp_name_fa",
            label: "Company Name"
          }), */
          search.createColumn({
            name: "custrecord_advs_vm_vehicle_brand",
            label: "Make"
          }),
          search.createColumn({
            name: "custrecord_advs_vm_location_code",
            label: "Location"
          }),
          search.createColumn({
            name: "custrecord_advs_vm_transmission_type",
            label: "Transmission Type"
          }),
          search.createColumn({
            name: "custrecord_advs_vm_model_year",
            label: "Year of Manufacturing"
          }),
          search.createColumn({
            name: "custrecord_vehicle_master_bucket",
            label: "Year of Manufacturing"
          }),
          search.createColumn({
            name: "cseg_advs_sto_num",
            label: "STOCK (SEGMENT)"
          }),
          search.createColumn({
            name: "custrecord_advs_vm_reservation_status",
            label: "RESERVATION STATUS"
          }),
          search.createColumn({
            name: "custrecord_advs_vm_mileage",
            label: "HMR"
          }),
          search.createColumn({
            name: "custrecord_advs_vm_engine_serial_number",
            label: "Engine Serial Number"
          }),
          search.createColumn({
            name: "custrecord_advs_vm_customer_number",
            label: "Customer"
          }),
          search.createColumn({
            name: "custrecord_advs_vm_soft_hld_sale_rep",
            label: "SOFT HOLD SALESREP"
          }),
          search.createColumn({
            name: "custrecord_advs_vm_exterior_color",
            label: "Exterior Color"
          }),
          search.createColumn({
            name: "custrecord_advs_vm_date_truck_ready",
            label: "Date Truck Ready"
          }),
          search.createColumn({
            name: "custrecord_advs_vm_date_truck_lockedup",
            label: "Date Truck Locked up"
          }),
          search.createColumn({
            name: "custrecord_advs_vm_aging",
            label: "Aging"
          }),
          search.createColumn({
            name: "custrecord_advs_vm_date_on_site",
            label: "Date On Site"
          }),

          search.createColumn({
            name: "custrecord_advs_in_dep_trans_link",
            join: "CUSTRECORD_ADVS_IN_DEP_VIN",
            label: "Deposit Link"
          }),

          search.createColumn({
            name: "custrecord_advs_in_dep_sales_rep",
            join: "CUSTRECORD_ADVS_IN_DEP_VIN",
            label: "Sales Rep"
          })
        ]
      });



      return vmSearchObj;
    }
    var uniqueBucket = [];
    var bucketData = [];
    function fetchSearchResult(pagedData, pageIndex) {

      var searchPage = pagedData.fetch({
        index: pageIndex
      });

      var vmDataResults = new Array();
      searchPage.data.forEach(function (result) {

        var vinId = result.getValue({
          name: "internalid"
        });
        var vinText = result.getValue({
          name: "name"
        });
        var modelId = result.getValue({
          name: "custrecord_advs_vm_model"
        });
        var vehicleBrand = result.getValue({
          name: "custrecord_advs_vm_vehicle_brand"
        });
        var locId = result.getValue({
          name: "custrecord_advs_vm_location_code"
        });
        var modelYr = result.getValue({
          name: "custrecord_advs_vm_model_year"
        });
        var bucketId = result.getValue({
          name: "custrecord_vehicle_master_bucket"
        });
        var stockdt = result.getValue({
          name: "cseg_advs_sto_num"
        });
        var Statusdt = result.getValue({
          name: "custrecord_advs_vm_reservation_status"
        });
        var Mileagedt = result.getValue({
          name: "custrecord_advs_vm_mileage"
        });
        var Transdt = result.getValue({
          name: "custrecord_advs_vm_transmission_type"
        });
        var Enginedt = result.getValue({
          name: "custrecord_advs_vm_engine_serial_number"
        });
        var Customerdt = result.getValue({
          name: "custrecord_advs_vm_customer_number"
        });
        var salesrepdt = result.getValue({
          name: "custrecord_advs_vm_soft_hld_sale_rep"
        });
        var extclrdt = result.getValue({
          name: "custrecord_advs_vm_exterior_color"
        });
        var DateTruckRdydt = result.getValue({
          name: "custrecord_advs_vm_date_truck_ready"
        });
        var DateTruckLockupdt = result.getValue({
          name: "custrecord_advs_vm_date_truck_lockedup"
        });
        var DateTruckAgingdt = result.getValue({
          name: "custrecord_advs_vm_aging"
        });
        var DateOnsitedt = result.getValue({
          name: "custrecord_advs_vm_date_on_site"
        });

        var invdepositLink = result.getValue({
          name: "custrecord_advs_in_dep_trans_link",
          join: "CUSTRECORD_ADVS_IN_DEP_VIN",
        });

        var InvSales = result.getValue({
          name: "custrecord_advs_in_dep_sales_rep",
          join: "CUSTRECORD_ADVS_IN_DEP_VIN"
        });

        var obj = {};
        obj.id = vinId;
        obj.vinName = vinText;
        obj.modelid = modelId;
        obj.brand = vehicleBrand;
        obj.locid = locId;
        obj.modelyr = modelYr;
        obj.bucketId = bucketId;
        obj.stockdt = stockdt;
        obj.Statusdt = Statusdt;
        obj.Mileagedt = Mileagedt;
        obj.Transdt = Transdt;
        obj.Enginedt = Enginedt;
        obj.Customerdt = Customerdt;
        obj.salesrepdt = salesrepdt;
        obj.extclrdt = extclrdt;
        obj.DateTruckRdydt = DateTruckRdydt;
        obj.DateTruckLockupdt = DateTruckLockupdt;
        obj.DateTruckAgingdt = DateTruckAgingdt;
        obj.DateOnsitedt = DateOnsitedt;
        obj.invdepositLink = invdepositLink;
        obj.InvSales = InvSales;


        if (bucketId) {
          if (uniqueBucket.indexOf(bucketId) == -1) {
            uniqueBucket.push(bucketId);
          }
        }
        vmDataResults.push(obj);
      });

      if (uniqueBucket.length > 0) {

        var bucketCalcSearchFilters = [
          ["isinactive", "is", "F"],
          "AND",
          ["custrecord_bucket_calc_parent_link", "anyof", uniqueBucket]
        ];



        var bucketCalcSearch = search.create({
          type: "customrecord_bucket_calculation_location",
          filters: bucketCalcSearchFilters,
          columns: [
            search.createColumn({
              name: "name",
              sort: search.Sort.ASC,
              label: "Name"
            }),
            search.createColumn({
              name: "internalid",
              label: "ID"
            }),
            search.createColumn({
              name: "custrecord_advs_b_c_c_model",
              label: "Model"
            }),
            search.createColumn({
              name: "custrecord_bucket_calc_parent_link",
              label: "Parent Link"
            }),
            search.createColumn({
              name: "custrecord_advs_b_c_c_dep_inception",
              label: "Deposit Inception"
            }),
            search.createColumn({
              name: "custrecord_advs_b_c_c_pay_incep",
              label: "Payment Inception"
            }),
            search.createColumn({
              name: "custrecord_advs_b_c_c_ttl_incep",
              label: "Total Inception"
            }),
            search.createColumn({
              name: "custrecord_advs_b_c_c_terms",
              label: "Terms"
            }),
            search.createColumn({
              name: "custrecord_advs_b_c_c_pay_2_13",
              label: "Payments 2-13"
            }),
            search.createColumn({
              name: "custrecord_advs_b_c_c_pay_14",
              label: "Payments 14-25"
            }),
            search.createColumn({
              name: "custrecord_advs_b_c_c_26_37",
              label: "Payments 26_37"
            }),
            search.createColumn({
              name: "custrecord_advs_b_c_c_pay_38_49",
              label: "Payments 38_49"
            }),
            search.createColumn({
              name: "custrecord_advs_b_c_c_pur_option",
              label: "Purchase Option"
            }),
            search.createColumn({
              name: "custrecord_advs_b_c_chld_freq",
              label: "Frequency"
            }),
            search.createColumn({
              name: "custrecord_advs_buc_chld_sales_channel",
              label: "Sales channel"
            }),
            search.createColumn({
              name: "custrecord_advs_b_c_c_cont_tot",
              label: "Sales channel"
            })

          ]
        });

        bucketCalcSearch.run().each(function (result) {
          var bucketId = result.getValue({
            name: "custrecord_bucket_calc_parent_link"
          });
          var buckidCh = result.getValue({
            name: "internalid"
          });

          var depositIncep = result.getValue({
            name: "custrecord_advs_b_c_c_dep_inception"
          });
          var payIncep = result.getValue({
            name: "custrecord_advs_b_c_c_pay_incep"
          });
          var ttlIncep = result.getValue({
            name: "custrecord_advs_b_c_c_ttl_incep"
          });
          var terms = result.getValue({
            name: "custrecord_advs_b_c_c_terms"
          })
          var Sch_2_13 = result.getValue({
            name: "custrecord_advs_b_c_c_pay_2_13"
          }) * 1;
          var Sch_14_26 = result.getValue({
            name: "custrecord_advs_b_c_c_pay_14"
          }) * 1;
          var Sch_26_37 = result.getValue({
            name: "custrecord_advs_b_c_c_26_37"
          }) * 1;
          var Sch_38_49 = result.getValue({
            name: "custrecord_advs_b_c_c_pay_38_49"
          }) * 1;
          var purOption = result.getValue({
            name: "custrecord_advs_b_c_c_pur_option"
          }) * 1;
          var contTot = result.getValue({
            name: "custrecord_advs_b_c_c_cont_tot"
          }) * 1;
          var FREQ = result.getValue({
            name: "custrecord_advs_b_c_chld_freq"
          });
          var saleCh = result.getValue({
            name: "custrecord_advs_buc_chld_sales_channel"
          });

          var index = 0;
          if (bucketData[bucketId] != null && bucketData[bucketId] != undefined) {
            index = bucketData[bucketId].length;
          } else {
            bucketData[bucketId] = new Array();
          }
          bucketData[bucketId][index] = new Array();
          bucketData[bucketId][index]["id"] = buckidCh;
          bucketData[bucketId][index]["DEPINSP"] = depositIncep;
          bucketData[bucketId][index]["PAYINSP"] = payIncep;
          bucketData[bucketId][index]["TTLINSP"] = ttlIncep;
          bucketData[bucketId][index]["TRMS"] = terms;
          bucketData[bucketId][index]["2_13"] = Sch_2_13;
          bucketData[bucketId][index]["14_26"] = Sch_14_26;
          bucketData[bucketId][index]["26_37"] = Sch_26_37;
          bucketData[bucketId][index]["26_37"] = Sch_26_37;
          bucketData[bucketId][index]["38_49"] = Sch_38_49;
          bucketData[bucketId][index]["purOptn"] = purOption;
          bucketData[bucketId][index]["conttot"] = contTot;
          bucketData[bucketId][index]["freq"] = FREQ;
          bucketData[bucketId][index]["saleCh"] = saleCh;
          //log.debug('bucketData',bucketData);
          return true;
        });
      }

      return vmDataResults;
    }
    function getPtpTaskDetails() {
      var pastTasks_ptp = [];
      var currentTasks_ptp = [];
      var futureTasks_ptp = [];

      var taskSearchObj = search.create({
        type: "task",
        filters: [
          ["status", "anyof", "PROGRESS", "NOTSTART"],
          "AND",
          ["custevent_advs_lease_link", "noneof", "@NONE@"], "AND",
          ["custevent_advs_mm_task_type", "anyof", "2"], "AND",
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
	function getTotalDue()	{
		try{
			var arr=[];
			var invoiceSearchObj = search.create({
				   type: "invoice", 
				   filters:
				   [
					  ["type","anyof","CustInvc"], 
					  "AND", 
					  ["status","anyof","CustInvc:A"], 
					  "AND", 
					  ["mainline","is","T"]
				   ],
				   columns:
				   [
					  search.createColumn({
						 name: "amountremaining",
						 summary: "SUM"
					  }),
					  search.createColumn({
						 name: "custbody_advs_lease_head",
						 summary: "GROUP"
					  }),
					  search.createColumn({
						 name: "entity",
						 summary: "GROUP"
					  })
				   ]
				});
				var searchResultCount = invoiceSearchObj.runPaged().count;
				log.debug("invoiceSearchObj result count",searchResultCount);
				invoiceSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				   var obj={};
				   
				   obj.amount = result.getValue({
						 name: "amountremaining",
						 summary: "SUM"
					  }); 
					  obj.lease = result.getValue({
						 name: "custbody_advs_lease_head",
						 summary: "GROUP"
					  }); 
					  obj.customer = result.getValue({
						 name: "entity",
						 summary: "GROUP"
					  });
				   
				   
				   
				   arr.push(obj);
				   return true;
				});
			return arr;
			 
		}catch(e)
		{
			
		}
	}
	function getbalancegreater30days()	{
		try{
			var invoiceSearchObj = search.create({
				   type: "invoice", 
				   filters:
				   [
					  ["type","anyof","CustInvc"], 
					  "AND", 
					  ["status","anyof","CustInvc:A"], 
					  "AND", 
					  ["trandate","onorafter","thirtydaysago"], 
					  "AND", 
					  ["mainline","is","T"]
				   ],
				   columns:
				   [
					  search.createColumn({
						 name: "entity",
						 summary: "GROUP"
					  }),
					  search.createColumn({
						 name: "custbody_advs_lease_head",
						 summary: "GROUP"
					  }),
					  search.createColumn({
						 name: "tranid",
						 summary: "GROUP"
					  }),
					  search.createColumn({
						 name: "amount",
						 summary: "SUM"
					  })
				   ]
				});
				var searchResultCount = invoiceSearchObj.runPaged().count;
				log.debug("invoiceSearchObj result count",searchResultCount);
				var arr=[];
				invoiceSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				   var obj={};
				   obj.customer = result.getValue({
						 name: "entity",
						 summary: "GROUP"
					  });
					 obj.lease = result.getValue({
						 name: "custbody_advs_lease_head",
						 summary: "GROUP"
					  });
					  obj.amount = result.getValue({
						 name: "amount",
						 summary: "SUM"
					  });
					  arr.push(obj);
				   return true;
				});
				 return arr;
		}catch(e)
		{
			log.debug('error',e.toString());
		}
	}
	function getLastPaymentAmountOfCustomer()	{
		try{
			var customerpaymentSearchObj = search.create({
			   type: "customerpayment", 
			   filters:
			   [
				  ["type","anyof","CustPymt"], 
				  "AND", 
				  ["mainline","is","T"]
			   ],
			   columns:
			   [
				  search.createColumn({
					 name: "trandate",
					 summary: "MAX"
				  }),
				  search.createColumn({
					 name: "entity",
					 summary: "GROUP"
				  }),
				  search.createColumn({
					 name: "amount",
					 summary: "SUM"
				  }),
				  search.createColumn({
					 name: "custbody_advs_lease_head",
					 summary: "GROUP"
				  })
			   ]
			});
			var searchResultCount = customerpaymentSearchObj.runPaged().count;
			log.debug("customerpaymentSearchObj result count",searchResultCount);
			var arr=[];
			customerpaymentSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
			   var obj={};
			   obj.customer = result.getValue({
					 name: "entity",
					 summary: "GROUP"
				  }); 
				  obj.lease = result.getValue({
					 name: "custbody_advs_lease_head",
					 summary: "GROUP"
				  }); 
				  obj.amount = result.getValue({
					 name: "amount",
					 summary: "SUM"
				  });
				  
				  arr.push(obj);
				  
			   return true;
			});
			 return arr;
		}catch(e)
		{
			log.debug('error',e.toString())
		}
	}
	function getnooflatepayments()	{
		try{
			var invoiceSearchObj = search.create({
				   type: "invoice", 
				   filters:
				   [
					  ["type","anyof","CustInvc"], 
					  "AND", 
					  ["mainline","is","T"], 
					  "AND", 
					  ["custbody_advs_invoice_type","anyof","13"]
				   ],
				   columns:
				   [
					  search.createColumn({
						 name: "entity",
						 summary: "GROUP"
					  }),
					  search.createColumn({
						 name: "custbody_advs_lease_head",
						 summary: "GROUP"
					  }),
					  search.createColumn({
						 name: "tranid",
						 summary: "COUNT"
					  }),
					  search.createColumn({
						 name: "amount",
						 summary: "SUM"
					  })
				   ]
				});
				var searchResultCount = invoiceSearchObj.runPaged().count;
				log.debug("invoiceSearchObj result count",searchResultCount);
				var arr=[];
				
				invoiceSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				   var obj={};
				   obj.customer = result.getValue({
						 name: "entity",
						 summary: "GROUP"
					  }); 
					obj.lease = result.getValue({
						 name: "custbody_advs_lease_head",
						 summary: "GROUP"
					  });
					obj.countofdocs = result.getValue({
						 name: "tranid",
						 summary: "COUNT"
					  });
					  obj.amount = result.getValue({
						 name: "amount",
						 summary: "SUM"
					  });
					  arr.push(obj);
				   return true;
				});
				 return arr;
		}catch(e)
		{
			log.debug('error',e.toString());
		}
	}
	function getbrokenpromises()	{
		try{
			var taskSearchObj = search.create({
				   type: "task",
				   filters:
				   [
					  ["custevent_advs_broken_promis","is","T"]
				   ],
				   columns:
				   [
					  search.createColumn({
						 name: "internalid",
						 summary: "COUNT"
					  }),
					  search.createColumn({
						 name: "custevent_advs_lease_link",
						 summary: "GROUP"
					  }),
					  search.createColumn({
						 name: "company",
						 summary: "GROUP"
					  })
				   ]
				});
				var searchResultCount = taskSearchObj.runPaged().count;
				log.debug("taskSearchObj result count",searchResultCount);
				var arr=[];
				taskSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				   var obj={};
				   obj.countofdocs = result.getValue({
						 name: "internalid",
						 summary: "COUNT"
					  });
					  
					  obj.lease = result.getValue({
						 name: "custevent_advs_lease_link",
						 summary: "GROUP"
					  });
					  obj.customer = result.getValue({
						 name: "company",
						 summary: "GROUP"
					  });
					  arr.push(obj);
				   return true;
				});
				 return arr; 
		}catch(e)
		{
				log.debug('error',e.toString());
		}
	}
	function get30daystrailing()	{
		try{
			var invoiceSearchObj = search.create({
				   type: "invoice",
				   settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
				   filters:
				   [
					  ["type","anyof","CustInvc"], 
					  "AND", 
					  ["status","anyof","CustInvc:B"]
				   ],
				   columns:
				   [
					  search.createColumn({
						 name: "entity",
						 summary: "GROUP"
					  }),
					  search.createColumn({
						 name: "daysopen",
						 summary: "AVG"
					  }),
					  search.createColumn({
						 name: "custbody_advs_lease_head",
						 summary: "GROUP"
					  })
				   ]
				});
				var searchResultCount = invoiceSearchObj.runPaged().count;
				log.debug("invoiceSearchObj result count",searchResultCount);
				invoiceSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				   return true;
				});
				 
		}catch(e)
		{
			log.debug('error',e.toString());
		}
	}
	function trailingPayment30DaysAll()
	{
		try{
			var invoiceSearchObj = search.create({
			   type: "invoice", 
			   filters:
			   [
				  ["type","anyof","CustInvc"], 
				  "AND", 
				  ["custbody_advs_lease_head","noneof","@NONE@"], 
				  "AND", 
				  ["formulanumeric: CASE WHEN (ROUND({today} - {trandate})) >= 0 AND (ROUND({today} - {trandate})) <= 30 THEN 1 ELSE 0 END","equalto","1"], 
				  "AND", 
				  ["mainline","is","T"]
			   ],
			   columns:
			   [
				  "custbody_advs_lease_head",
				  "entity",
				  "tranid",
				  "amount"
			   ]
			});
			var searchResultCount = invoiceSearchObj.runPaged().count; 
			var arrlease = [];
			invoiceSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
			   var obj = {};
			   obj.customer = result.getValue({name:'entity'});
			   obj.amount = result.getValue({name:'amount'});
			   obj.leaseid = result.getValue({name:'custbody_advs_lease_head'});
			   arrlease.push(obj);
			   return true;
			});
			return arrlease;
		}catch(e)
		{
			log.debug('error in trailingPayment30Days',e.toString());
		}
	}
	function trailingPayment30Days(customerid,leaseid){
		try{
			var invoiceSearchObj = search.create({
			   type: "invoice", 
			   filters:
			   [
				  ["name","anyof",customerid], 
				  "AND", 
				  ["mainline","is","T"], 
				  "AND", 
				  ["taxline","is","F"], 
				  "AND", 
				  ["shipping","is","F"], 
				  "AND", 
				  ["type","anyof","CustInvc"],  
				    "AND", 
				  ["custbody_advs_lease_head","anyof",leaseid],
				  "AND",
				  ["formulanumeric: CASE WHEN (ROUND({today} - {trandate})) >= 0 AND (ROUND({today} - {trandate})) <= 30 THEN 1 ELSE 0 END","equalto","1"]
			   ],
			   columns:
			   [
			   search.createColumn({
					 name: "amount",
					 summary: "SUM",
					 label: "Amount"
				  })
				 /*  "tranid",
				  "amount",
				  "trandate",
				  search.createColumn({
					 name: "formulanumeric",
					 formula: "CASE WHEN (ROUND({today} - {trandate})) >= 0 AND (ROUND({today} - {trandate})) <= 30 THEN ROUND({today} - {trandate}) ELSE 0 END"
				  }) */
			   ]
			});
			var searchResultCount = invoiceSearchObj.runPaged().count;
			log.debug("invoiceSearchObj result count",searchResultCount);
			var amount30days = 0;
			invoiceSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
			   amount30days = result.getValue({
					 name: "amount",
					 summary: "SUM" 
				  });
			   return true;
			});
			return amount30days; 
		}catch(e)
		{
			log.debug('error',e.toString());
		}
	}
    function getptpamountanddata(){
		try{
			var taskSearchObj = search.create({
				   type: "task",
				   filters:
				   [
					  ["custevent_advs_lease_link","noneof","@NONE@"], 
					  "AND", 
					  ["custevent_advs_ptp_amount","isnotempty",""], 
					  "AND", 
					  ["custevent_advs_ptp_payment_date","isnotempty",""]
				   ],
				   columns:
				   [
					  "custevent_advs_lease_link",
					  "custevent_advs_ptp_amount",
					  "custevent_advs_ptp_payment_date"
				   ]
				});
				var searchResultCount = taskSearchObj.runPaged().count;
				log.debug("taskSearchObj result count",searchResultCount);
				var arr=[];
				
				taskSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				   var obj={};
				   obj.lease = result.getValue({name:'custevent_advs_lease_link'});
				   obj.ptpamount = result.getValue({name:'custevent_advs_ptp_amount'});
				   obj.ptpdate = result.getValue({name:'custevent_advs_ptp_payment_date'});
				   arr.push(obj);
				   return true;
				});
				 return arr;
		}catch(e)
		{
			log.debug('error',e.toString());
		}
	}
	return {
      onRequest
    }

  });
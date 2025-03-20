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
			addSubmitButtons(form)
			form.addField({
				id: 'cust_email_template',
				type: serverWidget.FieldType.SELECT,
				label: 'Email Template',
				source:'customrecordcustrecord_ins_temp_name'
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
            if(from==1){
				addSublist(form, "custpage_subtab_insur_exp", "Insurance Expired", false);
			}else if(from==2){addSublist(form, "custpage_subtab_insur_tillthree", "1-3 Days", false);}
            else if(from==3){addSublist(form, "custpage_subtab_insur_tillseven", "4-7 Days", false);}
            else if(from==4){addSublist(form, "custpage_subtab_insur_tillfourteen", "8-14 Days", false);}
            else if(from==5){addSublist(form, "custpage_subtab_insur_afterfifteen", "15+ Days", false);}
             
            
			
			var expiredLiablityData = getExpriredLiablility();
			var expiredPhysicalDamData = getExpriredPhysicalExp();
			
				 
            //addFormButtons(form, "custbtn_insu_expiring", "Send Email Insurance Expiring", "sendemailinsu_expiring");
			 //form.clientScriptModulePath = "SuiteScripts/Advectus/cs_insurance_dashboard.js";
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
								'companyname': result.getValue({
                                    name: 'custrecord_advs_lease_comp_name_fa'
                                }), 
								'vinserial': result.getText({
                                    name: 'custrecord_advs_la_vin_bodyfld'
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
								'lbroker': result.getValue({
                                    name: 'custrecord_advs_l_h_ins_bro'
                                }),
								'dbroker': result.getValue({
                                    name: 'custrecord_advs_l_h_phy_dam_ins_bro'
                                }),
								'lbphone': result.getValue({
                                    name: 'custrecord_advs_l_h_ins_phone'
                                }),
								'dbphone': result.getValue({
                                    name: 'custrecord_advs_l_h_phy_dam_pho'
                                }),
								'phydamageExpiration': result.getValue({
                                    name: 'custrecord_advs_l_h_ins_phy_dam_exp'
                                }),
								'cpcstartdate': result.getValue( search.createColumn({
												 name: "custrecord_advs_cpc_date",
												 join: "CUSTRECORD_ADVS_L_A_CURR_CPS"
											  }))

                            };
                        }

                    });
                });
                pageIndex++; // Move to the next page
            } while (pageIndex < resultSet.pageRanges.length); 


				//LINKS TO DISPLAY
				 
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
				 
			//LINKS TO DISPLAY
			if(from==1){
				  var insurexp_Sublistid = "custpage_sublist_custpage_subtab_insur_exp";
				var insuexpired_sublist = form.getSublist({
					id: insurexp_Sublistid
				}); 
			}else if(from==2){
				var insurexp_Sublistid1to3 = "custpage_sublist_custpage_subtab_insur_tillthree";
            var insuexpired_sublist1to3 = form.getSublist({
                id: insurexp_Sublistid1to3
            });
			}
			else if(from==3){
			var insurexp_Sublistid3to7 = "custpage_sublist_custpage_subtab_insur_tillseven";
            var insuexpired_sublist3to7 = form.getSublist({
                id: insurexp_Sublistid3to7
            });
			}
			else if(from==4){
			var insurexp_Sublistid8to14 = "custpage_sublist_custpage_subtab_insur_tillfourteen";
            var insuexpired_sublist8to14 = form.getSublist({
                id: insurexp_Sublistid8to14
            }); 
			}
			else if(from==5){
            var insurexpiring_Sublistid = "custpage_sublist_custpage_subtab_insur_afterfifteen";
            var insuexpiring_sublist = form.getSublist({
                id: insurexpiring_Sublistid
            }); 
			}
			var insurecancel_Sublistid = "custpage_sublist_custpage_subtab_insur_cancel";
            var insuecancelled_sublist = form.getSublist({
                id: insurecancel_Sublistid
            });
			
			var insureclaim_Sublistid = "custpage_sublist_custpage_subtab_insur_claim";
            var insueclaim_sublist = form.getSublist({
                id: insureclaim_Sublistid
            });
			 
          
			
			
             
            var count_all_amount = 0,
            count_all = 0;
			var count_0_7_amount    =   '',count_0_7=0;
			var count_8_14_amount    =   '',count_8_14=0;
			 var count_15_30_amount    =   '',count_15_30=0;
			 var count_31_60_amount    =   '',count_31_60=0;
			  var count_60_plus_amount    =   '',count_60_plus=0;

			var  insu_expired_Count = 0;
			var  insu_expiring_Count = 0;
			var  insu_expiring_Count4to7 = 0;
			var  insu_expiring_Count8to14 = 0;
			var  insu_expiring_Count15plus = 0;

            for (var i = 0; i < dealLengthArray.length; i++) {
                var deal_id = dealLengthArray[i];

                if (deal_data_arr[deal_id] != null && deal_data_arr[deal_id] != undefined) {
                    var days = deal_data_arr[deal_id].ageindays;
                    days = days * 1;

                    var custID = deal_data_arr[deal_id]['customerid'];
                     
                    var due_amount_local = deal_data_arr[deal_id]["due_amount"] * 1;
                    var CustDashLink = "<a href=\"https://system.na2.netsuite.com/app/center/card.nl?sc=-69&entityid=" + deal_data_arr[deal_id]['customerid'] + "\" target=\"_blank\">DASH</a>";

                    var stock_carr        	 = Stock_link + '&id=' + deal_id;
                    var stockREcLink      	 = '<a href="' + encodeURI(stock_carr) + '" target="_blank">' + encodeURI(deal_data_arr[deal_id]['leasenum']) + '</a>';
                    var custLinkArr       	 = customerUrl + '&id=' + deal_data_arr[deal_id]['customerid'];
                    var CustRecLink       	 = '<a href="' + encodeURI(custLinkArr) + '" target="_blank">' + deal_data_arr[deal_id]['cust_altname'] + '</a>';
                    var create_task_link1 	 = create_task_link + '&custparam_cust=' + deal_data_arr[deal_id]['customerid'] + '&deal_id=' + deal_id; //colle_id
                    var n_url_email       	 = url_email + '&custparam_customer_id=' + deal_data_arr[deal_id]['customerid'] + '&deal_id=' + deal_id+'&subject_from_ins=T';

                    var createnotesLink      = create_notes_link + '&custparam_cust=' + deal_data_arr[deal_id]['customerid'] + '&deal_id=' + deal_id + '&from_notes=T'; //colle_id
                    var mobileValue          = deal_data_arr[deal_id]['customermobile'] || '';
                    var duedate              = deal_data_arr[deal_id]['duedate'] || '';
                    var lastinvoicedate      = deal_data_arr[deal_id]['lastinvoicedate'] || '';
                    var duedays              = deal_data_arr[deal_id]['ageindays'] || '0';
                    var totalDue             = deal_data_arr[deal_id]['totalDue'] || '';
                    var totaldueinvoice      = deal_data_arr[deal_id]['totaldueinvoice'] || ''; 
                    var insurExpiration      = deal_data_arr[deal_id].insurExpiration || "";
                    var LiabBroker           = deal_data_arr[deal_id].lbroker || " ";
                    var DamageBroker         = deal_data_arr[deal_id].dbroker || " ";
                    var _vinserial           = deal_data_arr[deal_id].vinserial || " ";
                    var _lbphone             = deal_data_arr[deal_id].lbphone || "";
                    var _dbphone             = deal_data_arr[deal_id].dbphone || "";
                    var _phydamageExpiration = deal_data_arr[deal_id].phydamageExpiration || "";
                    var _cpcstartdate 		 = deal_data_arr[deal_id].cpcstartdate || "";
                    var _companyname 		 = deal_data_arr[deal_id].companyname || "";
 
					var create_history_link = url.resolveScript({scriptId:'customscript_collection_dash_history', deploymentId:'customdeploy_collection_dash_history'});
                    var create_history_link1 = create_history_link+'&custparam_recid='+deal_id;//colle_id
		

                    if (insurExpiration) {  
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
						 if ((insurTime < todayTime )&& from==1) { 
						
							insuexpired_sublist.setSublistValue({
                                id: "cust_fi_list_vin",
                                line: insu_expired_Count,
                                value: _vinserial.substr(_vinserial.length - 6)
                            });
							insuexpired_sublist.setSublistValue({
                                id: "cust_fi_cpcstartdate",
                                line: insu_expired_Count,
                                value: _cpcstartdate ||' '
                            });
							insuexpired_sublist.setSublistValue({
                                id: "cust_fi_list_customer_id",
                                line: insu_expired_Count,
                                value: custID ||' '
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
                                id: "cust_fi_list_customer_one",
                                line: insu_expired_Count,
                                value: CustRecLink
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
                            insuexpired_sublist.setSublistValue({
                                    id: 'cust_fi_liability_broker',
                                    line: insu_expired_Count,
                                    value: LiabBroker
                                });
                            insuexpired_sublist.setSublistValue({
                                id: 'cust_fi_damage_broker',
                                line: insu_expired_Count,
                                value: DamageBroker
                            });
                            insuexpired_sublist.setSublistValue({
                                id: 'cust_fi_broker_phone',
                                line: insu_expired_Count,
                                value: _lbphone||' '
                            });
                            insuexpired_sublist.setSublistValue({
                                id: 'cust_fi_damage_phone',
                                line: insu_expired_Count,
                                value: _dbphone||' '
                            });
                            insuexpired_sublist.setSublistValue({
                                id: 'cust_fi_exipiration_date',
                                line: insu_expired_Count,
                                value: insurExpiration
                            });
                            insuexpired_sublist.setSublistValue({
                                id: 'cust_fi_damage_expiration',
                                line: insu_expired_Count,
                                value: _phydamageExpiration
                            });
							insuexpired_sublist.setSublistValue({id:'cust_fi_list_history',line: insu_expired_Count ,value: "<a href="+create_history_link1+" target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a></a>"});
                            insu_expired_Count++;
                            
                        }
						
                        if ((insuranceDays >= 0 && insuranceDays <= 3) && from==2) {
                            /* insuexpired_sublist1to3.setSublistValue({
                                id: "cust_fi_list_dashboard",
                                line: insu_expiring_Count,
                                value: CustDashLink
                            }); */
							
                            insuexpired_sublist1to3.setSublistValue({
                                 id: "cust_fi_list_vin",
                                line: insu_expiring_Count,
                                value: _vinserial.substr(_vinserial.length - 6)
                            });
							insuexpired_sublist1to3.setSublistValue({
                                id: "cust_fi_list_customer_id",
                                line: insu_expiring_Count,
                                value: custID ||' '
                            });
                            insuexpired_sublist1to3.setSublistValue({
                                id: "cust_fi_list_customer",
                                line: insu_expiring_Count,
                                value: CustRecLink
                            });
                            
                            insuexpired_sublist1to3.setSublistValue({
                                id: 'cust_fi_list_customer_mail',
                                line: insu_expiring_Count,
                                value: "<a href=" + n_url_email + " target=\"_blank\">Email</a>"
                            });
                            insuexpired_sublist1to3.setSublistValue({
                                id: 'cust_fi_list_create_notes',
                                line: insu_expiring_Count,
                                value: "<a href=" + createnotesLink + " target=\"_blank\">Create Notes</a>"
                            });
                            insuexpired_sublist1to3.setSublistValue({
                                    id: 'cust_fi_liability_broker',
                                    line: insu_expiring_Count,
                                    value: LiabBroker
                                });
                            insuexpired_sublist1to3.setSublistValue({
                                id: 'cust_fi_damage_broker',
                                line: insu_expiring_Count,
                                value: DamageBroker
                            });
                            insuexpired_sublist1to3.setSublistValue({
                                id: 'cust_fi_broker_phone',
                                line: insu_expiring_Count,
                                value: _lbphone||' '
                            });
                            insuexpired_sublist1to3.setSublistValue({
                                id: 'cust_fi_damage_phone',
                                line: insu_expiring_Count,
                                value: _dbphone||' '
                            });
                            insuexpired_sublist1to3.setSublistValue({
                                id: 'cust_fi_exipiration_date',
                                line: insu_expiring_Count,
                                value: insurExpiration||' '
                            });
                            insuexpired_sublist1to3.setSublistValue({
                                id: 'cust_fi_damage_expiration',
                                line: insu_expiring_Count,
                                value: _phydamageExpiration ||' '
                            });
							insuexpired_sublist1to3.setSublistValue({id:'cust_fi_list_history',line: insu_expiring_Count ,value: "<a href="+create_history_link1+" target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a></a>"});
                            
                            insu_expiring_Count++; 
                        }
						if ((insuranceDays > 3 && insuranceDays <= 7) && from==3) {
                            
                            insuexpired_sublist3to7.setSublistValue({
                                 id: "cust_fi_list_vin",
                                line: insu_expiring_Count4to7,
                                value: _vinserial.substr(_vinserial.length - 6)
                            });
							insuexpired_sublist3to7.setSublistValue({
                                id: "cust_fi_list_customer_id",
                                line: insu_expiring_Count4to7,
                                value: custID ||' '
                            });
                            insuexpired_sublist3to7.setSublistValue({
                                id: "cust_fi_list_customer",
                                line: insu_expiring_Count4to7,
                                value: CustRecLink
                            });
                            
                            insuexpired_sublist3to7.setSublistValue({
                                id: 'cust_fi_list_customer_mail',
                                line: insu_expiring_Count4to7,
                                value: "<a href=" + n_url_email + " target=\"_blank\">Email</a>"
                            });
                            insuexpired_sublist3to7.setSublistValue({
                                id: 'cust_fi_list_create_notes',
                                line: insu_expiring_Count4to7,
                                value: "<a href=" + createnotesLink + " target=\"_blank\">Create Notes</a>"
                            });
                            insuexpired_sublist3to7.setSublistValue({
                                    id: 'cust_fi_liability_broker',
                                    line: insu_expiring_Count4to7,
                                    value: LiabBroker
                                });
                            insuexpired_sublist3to7.setSublistValue({
                                id: 'cust_fi_damage_broker',
                                line: insu_expiring_Count4to7,
                                value: DamageBroker
                            });
                            insuexpired_sublist3to7.setSublistValue({
                                id: 'cust_fi_broker_phone',
                                line: insu_expiring_Count4to7,
                                value: _lbphone ||' '
                            });
                            insuexpired_sublist3to7.setSublistValue({
                                id: 'cust_fi_damage_phone',
                                line: insu_expiring_Count4to7,
                                value: _dbphone||' '
                            });
                            insuexpired_sublist3to7.setSublistValue({
                                id: 'cust_fi_exipiration_date',
                                line: insu_expiring_Count4to7,
                                value: insurExpiration
                            });
                            insuexpired_sublist3to7.setSublistValue({
                                id: 'cust_fi_damage_expiration',
                                line: insu_expiring_Count4to7,
                                value: _phydamageExpiration
                            });
							insuexpired_sublist3to7.setSublistValue({id:'cust_fi_list_history',line: insu_expiring_Count4to7 ,value: "<a href="+create_history_link1+" target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a></a>"});
                            
                            insu_expiring_Count4to7++; 
                        }
						if ((insuranceDays > 7 && insuranceDays <= 14) && from==4) {
                             
                            insuexpired_sublist8to14.setSublistValue({
                                id: "cust_fi_list_vin",
                                line: insu_expiring_Count8to14,
                                value: _vinserial.substr(_vinserial.length - 6)
                            });
							insuexpired_sublist8to14.setSublistValue({
                                id: "cust_fi_list_customer_id",
                                line: insu_expiring_Count8to14,
                                value: custID ||' '
                            });
                            insuexpired_sublist8to14.setSublistValue({
                                id: "cust_fi_list_customer",
                                line: insu_expiring_Count8to14,
                                value: CustRecLink
                            });
                            
                            insuexpired_sublist8to14.setSublistValue({
                                id: 'cust_fi_list_customer_mail',
                                line: insu_expiring_Count8to14,
                                value: "<a href=" + n_url_email + " target=\"_blank\">Email</a>"
                            });
                            insuexpired_sublist8to14.setSublistValue({
                                id: 'cust_fi_list_create_notes',
                                line: insu_expiring_Count8to14,
                                value: "<a href=" + createnotesLink + " target=\"_blank\">Create Notes</a>"
                            });
                            insuexpired_sublist8to14.setSublistValue({
                                    id: 'cust_fi_liability_broker',
                                    line: insu_expiring_Count8to14,
                                    value: LiabBroker
                                });
                            insuexpired_sublist8to14.setSublistValue({
                                id: 'cust_fi_damage_broker',
                                line: insu_expiring_Count8to14,
                                value: DamageBroker
                            });
                            insuexpired_sublist8to14.setSublistValue({
                                id: 'cust_fi_broker_phone',
                                line: insu_expiring_Count8to14,
                                value: _lbphone
                            });
                            insuexpired_sublist8to14.setSublistValue({
                                id: 'cust_fi_damage_phone',
                                line: insu_expiring_Count8to14,
                                value: _dbphone
                            });
                            insuexpired_sublist8to14.setSublistValue({
                                id: 'cust_fi_exipiration_date',
                                line: insu_expiring_Count8to14,
                                value: insurExpiration
                            });
                            insuexpired_sublist8to14.setSublistValue({
                                id: 'cust_fi_damage_expiration',
                                line: insu_expiring_Count8to14,
                                value: _phydamageExpiration
                            });
							insuexpired_sublist8to14.setSublistValue({id:'cust_fi_list_history',line: insu_expiring_Count8to14 ,value: "<a href="+create_history_link1+" target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a></a>"});
                            
                            insu_expiring_Count8to14++; 
                        }
						if (insuranceDays >=15 && from==5) {
                             
                            insuexpiring_sublist.setSublistValue({
                                id: "cust_fi_list_vin",
                                line: insu_expiring_Count15plus,
                                value: _vinserial.substr(_vinserial.length - 6)
                            });
							insuexpiring_sublist.setSublistValue({
                                id: "cust_fi_list_customer_id",
                                line: insu_expiring_Count15plus,
                                value: custID ||' '
                            });
                            insuexpiring_sublist.setSublistValue({
                                id: "cust_fi_list_customer",
                                line: insu_expiring_Count15plus,
                                value: CustRecLink
                            });
                            
                            insuexpiring_sublist.setSublistValue({
                                id: 'cust_fi_list_customer_mail',
                                line: insu_expiring_Count15plus,
                                value: "<a href=" + n_url_email + " target=\"_blank\">Email</a>"
                            });
                            insuexpiring_sublist.setSublistValue({
                                id: 'cust_fi_list_create_notes',
                                line: insu_expiring_Count15plus,
                                value: "<a href=" + createnotesLink + " target=\"_blank\">Create Notes</a>"
                            });
                            insuexpiring_sublist.setSublistValue({
                                    id: 'cust_fi_liability_broker',
                                    line: insu_expiring_Count15plus,
                                    value: LiabBroker
                                });
                            insuexpiring_sublist.setSublistValue({
                                id: 'cust_fi_damage_broker',
                                line: insu_expiring_Count15plus,
                                value: DamageBroker
                            });
                            insuexpiring_sublist.setSublistValue({
                                id: 'cust_fi_broker_phone',
                                line: insu_expiring_Count15plus,
                                value: _lbphone||' '
                            });
                            insuexpiring_sublist.setSublistValue({
                                id: 'cust_fi_damage_phone',
                                line: insu_expiring_Count15plus,
                                value: _dbphone ||' '
                            });
                            insuexpiring_sublist.setSublistValue({
                                id: 'cust_fi_exipiration_date',
                                line: insu_expiring_Count15plus,
                                value: insurExpiration
                            });
                            insuexpiring_sublist.setSublistValue({
                                id: 'cust_fi_damage_expiration',
                                line: insu_expiring_Count15plus,
                                value: _phydamageExpiration
                            });
							insuexpiring_sublist.setSublistValue({id:'cust_fi_list_history',line: insu_expiring_Count15plus ,value: "<a href="+create_history_link1+" target=\"_blank\"><i class='fa fa-history' style='font-size:18px'></i></a></a>"});
                            
                            insu_expiring_Count15plus++; 
                        }
                    }
					  
					 

                }
            } 
            response.writePage(form);
        }
		else{
			var _emailtemplate = scriptContext.request.parameters.cust_email_template;
			 var from = scriptContext.request.parameters.cust_subl_from;
			 if(from==1){var sublistid = 'custpage_sublist_custpage_subtab_insur_exp'}
			 if(from==2){var sublistid = 'custpage_sublist_custpage_subtab_insur_tillthree'}
			 if(from==3){var sublistid = 'custpage_sublist_custpage_subtab_insur_tillseven'}
			 if(from==4){var sublistid = 'custpage_sublist_custpage_subtab_insur_tillfourteen'}
			 if(from==5){var sublistid = 'custpage_sublist_custpage_subtab_insur_afterfifteen'}
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
                    var obj = {}; 
                    var entityId = scriptContext.request.getSublistValue({
                        group: sublistid,
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
			 var onclickScript=" <html><body> <script type='text/javascript'>" ;

				onclickScript+="try{" ; 
				onclickScript+="window.close()"; 
				onclickScript+="}catch(e){}</script></body></html>";
				scriptContext.response.write(onclickScript);
		}
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
		 sublist.addMarkAllButtons(); 
        addSublistFields(sublist,tabId,requiredTaskinfo);
    }

    function addSublistFields(sublist,tabId, requiredTaskinfo) {
		
		{
			 sublist.addField({
            id: 'cust_fi_list_mark',
            type: serverWidget.FieldType.CHECKBOX,
            label: 'Mark'
        }); 
			sublist.addField({
            id: 'cust_fi_list_vin',
            type: serverWidget.FieldType.TEXT,
            label: 'Serial Number'
        });
        var stcknumerfld = sublist.addField({
            id: 'cust_fi_list_stock_no',
            type: serverWidget.FieldType.TEXT,
            label: 'Lease #'
        });
			stcknumerfld.updateDisplayType({
				displayType : serverWidget.FieldDisplayType.HIDDEN
			});
			
			var customeridFld = sublist.addField({
            id: 'cust_fi_list_customer_id',
            type: serverWidget.FieldType.TEXT,
            label: 'Customer ID'
        });
			customeridFld.updateDisplayType({
				displayType : serverWidget.FieldDisplayType.HIDDEN
			});
        sublist.addField({
            id: 'cust_fi_list_customer',
            type: serverWidget.FieldType.TEXT,
            label: 'Customer Name',
        }); 
		sublist.addField({
            id: 'cust_fi_list_customer_one',
            type: serverWidget.FieldType.TEXT,
            label: 'Customer Name1',
        });
		sublist.addField({
            id: 'cust_fi_list_customer_two',
            type: serverWidget.FieldType.TEXT,
            label: 'Customer Name2',
        }); 
         sublist.addField({
            id: 'cust_fi_list_customer_mail',
            type: serverWidget.FieldType.TEXT,
            label: 'E-Mail Button'
        }); 
       
        sublist.addField({
            id: 'cust_fi_liability_broker',
            type: serverWidget.FieldType.TEXT,
            label: 'LIABILITY CARRIER'
        });
		 sublist.addField({
            id: 'cust_fi_exipiration_date',
            type: serverWidget.FieldType.TEXT,
            label: 'LIABILITY EXPIRATION DATE'
        })
        sublist.addField({
            id: 'cust_fi_damage_broker',
            type: serverWidget.FieldType.TEXT,
            label: 'PHYSICAL CARRIER'
        });
		sublist.addField({
            id: 'cust_fi_damage_expiration',
            type: serverWidget.FieldType.TEXT,
            label: 'PHYSICAL EXPIRATION DATE'
        });
		sublist.addField({
            id: 'cust_fi_cpcstartdate',
            type: serverWidget.FieldType.TEXT,
            label: 'CPC Start Date'
        }); 
		 sublist.addField({
            id: 'cust_fi_list_create_notes',
            type: serverWidget.FieldType.TEXT,
            label: 'Notes'
        }); 
		sublist.addField({
            id: 'cust_fi_list_history',
            type: serverWidget.FieldType.TEXT,
            label: 'History'
        });
		}
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

        var leaseSearch = search.create({
            type: "customrecord_advs_lease_header",
            filters: [
                ["custrecord_advs_l_h_status", "anyof", "5"]
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
 
        html += "<style>";
        html += ".main-content{";
        html += "width: 100%;";
        html += "display:flex;"; 
        html += "}";
        html += ".main-content-left{";
        html += "width: 35%;";
        html += "}";
        html += ".main-content-right{";
        html += "width: 75%;";
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

        html += "</script>";

        return html;
    }

    function addFormButtons(form, id, label, functionCall) {
        form.addButton({
            id: id,
            label: label,
            functionName: functionCall
        });
    }
	function searchForCancelData(insuecancelled_sublist)
	{
		try{
			var customrecord_advs_lease_headerSearchObj = search.create({
			   type: "customrecord_advs_lease_header",
			   filters:
			   [
				  ["custrecord_advs_l_h_ins_cancel_date","within","thismonth"], 
				  "AND", 
				  ["isinactive","is","F"]
			   ],
			   columns:
			   [
					"name",
				  "custrecord_advs_l_h_customer_name",
				  "custrecord_advs_l_h_location",
				  "custrecord_advs_la_vin_bodyfld",
				  "custrecord_advs_l_h_ins_cancel_date",
				  "custrecord_advs_l_a_remaing_schedule"
			   ]
			});
			var searchResultCount = customrecord_advs_lease_headerSearchObj.runPaged().count;
			log.debug("customrecord_advs_lease_headerSearchObj result count",searchResultCount);
			var count = 0;
			var customerUrl = url.resolveRecord({
                recordType: 'customer',
                isEditMode: false
            });
            var taskUrl = url.resolveRecord({
                recordType: 'task',
                isEditMode: false
            });
			customrecord_advs_lease_headerSearchObj.run().each(function(result){
			   // .run().each has a limit of 4,000 results
			   var CustDashLink = "<a href=\"https://system.na2.netsuite.com/app/center/card.nl?sc=-69&entityid=" + result.getValue({name:'custrecord_advs_l_h_customer_name'})+ "\" target=\"_blank\">DASH</a>";
			   
			    var Stock_link = url.resolveRecord({
                recordType: 'customrecord_advs_lease_header',
                isEditMode: false
            });
			 var stock_carr = Stock_link + '&id=' + result.id;
			 var stockREcLink = '<a href="' + encodeURI(stock_carr) + '" target="_blank">' + encodeURI(result.getValue({name:'name'})) + '</a>';
			 
			 var custLinkArr = customerUrl + '&id=' +result.getValue({name:'custrecord_advs_l_h_customer_name'}) ;
                    var CustRecLink = '<a href="' + encodeURI(custLinkArr) + '" target="_blank">' + result.getText({name:'custrecord_advs_l_h_customer_name'})+ '</a>';
			   
			   insuecancelled_sublist.setSublistValue({
                                id: "cust_fi_list_dashboard",
                                line: count,
                                value: CustDashLink
                            });
			   insuecancelled_sublist.setSublistValue({
                                id: 'cust_fi_list_stock_no',
                                line: count,
                                value: stockREcLink
                            });
							insuecancelled_sublist.setSublistValue({
                                id: 'cust_fi_leseename',
                                line: count,
                                value: CustRecLink
                            }); insuecancelled_sublist.setSublistValue({
                                id: 'cust_fi_location',
                                line: count,
                                value: result.getText({name:'custrecord_advs_l_h_location'})
                            }); insuecancelled_sublist.setSublistValue({
                                id: 'cust_fi_vin',
                                line: count,
                                value: result.getText({name:'custrecord_advs_la_vin_bodyfld'})
                            }); insuecancelled_sublist.setSublistValue({
                                id: 'cust_fi_cancellation_date',
                                line: count,
                                value: result.getValue({name:'custrecord_advs_l_h_ins_cancel_date'})
                            }); insuecancelled_sublist.setSublistValue({
                                id: 'cust_fi_remaining_terms',
                                line: count,
                                value: result.getValue({name:'custrecord_advs_l_a_remaing_schedule'})||0
                            });  
							count++;
			   return true;
			});

			 
		}catch(e)
		{
			log.debug('error',e.toString())
		}
	}
	function searchForclaimData(insueclaim_sublist)
	{
		try{
			var customrecord_advs_insurance_claim_sheetSearchObj = search.create({
			   type: "customrecord_advs_insurance_claim_sheet",
			   filters:
			   [
				  ["isinactive","is","F"],
				  "AND",
				   ["custrecord_claim_settled","is","F"]
			   ],
			   columns:
			   [
				  "custrecord_ic_lease",
				  "custrecord_first_last_name",
				  "custrecord_ic_date_of_loss",
				  "custrecord_ic_description_accident",
				  "custrecord_ic_claim_field",
				  "custrecord_ic_filed_insurance_type",
				  "custrecord_ic_claim_number",
				  "custrecord_ic_adj_name_number",
				  "custrecord_ic_repairable_type",
				  "custrecord_ic_location_vehicle",
				  "custrecord_ic_notes",
				  "custrecord_tickler_followup",
				  "name"
			   ]
			});
			var searchResultCount = customrecord_advs_insurance_claim_sheetSearchObj.runPaged().count;
			log.debug("customrecord_advs_insurance_claim_sheetSearchObj result count",searchResultCount);
			var count=0;
			customrecord_advs_insurance_claim_sheetSearchObj.run().each(function(result){
				
				var Stock_link = url.resolveRecord({
					recordType: 'customrecord_advs_lease_header',
					isEditMode: false
				});
				var claim_link = url.resolveRecord({
					recordType: 'customrecord_advs_insurance_claim_sheet',
					isEditMode: false
				});
			 var stock_carr = Stock_link + '&id=' + result.getValue({name:'custrecord_ic_lease'});
			 var claim_carr = claim_link + '&id=' + result.id;
			 var stockREcLink = '<a href="' + encodeURI(stock_carr) + '" target="_blank">' + encodeURI(result.getText({name:'custrecord_ic_lease'})) + '</a>';
			 var claimREcLink = '<a href="' + encodeURI(claim_carr) + '" target="_blank">' + encodeURI(result.getValue({name:'name'})) + '</a>';
			 
			   // .run().each has a limit of 4,000 results
							insueclaim_sublist.setSublistValue({
                                id: "cust_fi_list_stock_no",
                                line: count,
                                value: stockREcLink//result.getText({name:'custrecord_ic_lease'})
                            });
							insueclaim_sublist.setSublistValue({
                                id: "cust_fi_ins_doc",
                                line: count,
                                value: claimREcLink//result.getValue({name:'name'})|| ' '
                            });
							insueclaim_sublist.setSublistValue({
                                id: "cust_fi_f_l_name",
                                line: count,
                                value: result.getValue({name:'custrecord_first_last_name'})
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_dateofloss",
                                line: count,
                                value: result.getValue({name:'custrecord_ic_date_of_loss'}) || ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_desc_accident",
                                line: count,
                                value: result.getValue({name:'custrecord_ic_description_accident'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_claim_filed",
                                line: count,
                                value: result.getText({name:'custrecord_ic_claim_field'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_ins_from",
                                line: count,
                                value: result.getText({name:'custrecord_ic_filed_insurance_type'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_name_number",
                                line: count,
                                value: result.getValue({name:'custrecord_ic_adj_name_number'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_repairable",
                                line: count,
                                value: result.getText({name:'custrecord_ic_repairable_type'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_veh_loc",
                                line: count,
                                value: result.getValue({name:'custrecord_ic_location_vehicle'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_notes",
                                line: count,
                                value: result.getValue({name:'custrecord_ic_notes'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_folowup",
                                line: count,
                                value: result.getValue({name:'custrecord_tickler_followup'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_editclaim",
                                line: count,
                                value: '<a href="#" onclick="editclaimsheet('+result.id+')"> <i class="fa fa-edit" style="color:blue;"</i></a>'
                            });
							count++;
			   return true;
			});
			 
		}catch(e)
		{
			log.debug('error',e.toString())
		}
	}
    function getExpriredLiablility()
	{
		try{
			var customrecord_advs_lease_headerSearchObj = search.create({
				   type: "customrecord_advs_lease_header",
				   filters:
				   [
					  ["isinactive","is","F"], 
					  "AND", 
					  ["custrecord_advs_l_h_ins_lia_exp_dt","notafter","today"], 
					  "AND", 
					  ["custrecord_advs_l_h_ins_lia_exp_dt","isnotempty",""]
				   ],
				   columns:
				   [
					  "name",
					  "custrecord_advs_l_h_ins_lia_exp_dt"
				   ]
				});
				var searchResultCount = customrecord_advs_lease_headerSearchObj.runPaged().count;
				//log.debug("customrecord_advs_lease_headerSearchObj result count",searchResultCount);
				var data = [];
				customrecord_advs_lease_headerSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				   var obj={};
				   obj.name = result.getValue({name:'name'});
				   obj.ExpiryDate = result.getValue({name:'custrecord_advs_l_h_ins_lia_exp_dt'});
				   data.push(obj);
				   return true;
				});
				return data;
		}catch(e)
		{
			log.debug('error',e.toString());
		}
	}
	function getExpriredPhysicalExp()
	{
		try{
			var customrecord_advs_lease_headerSearchObj = search.create({
				   type: "customrecord_advs_lease_header",
				   filters:
				   [
					  ["isinactive","is","F"], 
					  "AND", 
					  ["custrecord_advs_l_h_ins_phy_dam_exp","notafter","today"], 
					  "AND", 
					  ["custrecord_advs_l_h_ins_phy_dam_exp","isnotempty",""]
				   ],
				   columns:
				   [
					  "name",
					  "custrecord_advs_l_h_ins_phy_dam_exp"
				   ]
				});
				var searchResultCount = customrecord_advs_lease_headerSearchObj.runPaged().count;
				//log.debug("customrecord_advs_lease_headerSearchObj result count",searchResultCount);
				var data = [];
				customrecord_advs_lease_headerSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				   var obj={};
				   obj.name = result.getValue({name:'name'});
				   obj.ExpiryDate = result.getValue({name:'custrecord_advs_l_h_ins_phy_dam_exp'});
				   data.push(obj);
				   return true;
				});
				return data;
		}catch(e)
		{
			log.debug('error',e.toString())
		}
	}
	function calculateDates(numberofdays)
		{
			try{
				var _date = new Date();
				var year = _date.getFullYear();
				var month = _date.getMonth();
				var day = _date.getDate();
				var date = new Date(year, month, day);
					//log.debug('the original date is ' ,date);
					var newdate = new Date(date);  
				   newdate.setDate(newdate.getDate() - (numberofdays*1)); // minus the date
					var nd = new Date(newdate);
					var _year = nd.getFullYear();
					var _month = nd.getMonth()+1;
					var _day = nd.getDate();
					return _month+'/'+_day+'/'+_year;
			}catch(e)
			{
				log.debug('error',e.toString());
			}
		}
		function getTodayDate()
		{
				var _date = new Date();
				var year = _date.getFullYear();
				var month = _date.getMonth()+1;
				var day = _date.getDate();
				
				return month+'/'+day+'/'+year;
		}
		function getDaysData(startdate,nextdate)
		{
			try{
				log.debug('startdate'+startdate,'nextdate'+nextdate);
				var customrecord_advs_lease_headerSearchObj = search.create({
					   type: "customrecord_advs_lease_header",
					   filters:
					   [
						  ["isinactive","is","F"], 
						  "AND", 
						  ["custrecord_advs_l_h_ins_phy_dam_exp","within",startdate,nextdate], 
						  "AND", 
						  ["custrecord_advs_l_h_ins_phy_dam_exp","isnotempty",""]
					   ],
					   columns:
					   [
						  "name",
						  "custrecord_advs_l_h_ins_phy_dam_exp"
					   ]
					});
					var searchResultCount = customrecord_advs_lease_headerSearchObj.runPaged().count;
					log.debug("customrecord_advs_lease count with dates",searchResultCount);
					var arr = [];
					customrecord_advs_lease_headerSearchObj.run().each(function(result){
					   // .run().each has a limit of 4,000 results
					   var obj={};
					   obj.name = result.getValue({name:'name'});
					   obj.date = result.getValue({name:'custrecord_advs_l_h_ins_phy_dam_exp'});
					   arr.push(obj);
					   return true;
					});
			return arr;
			}catch(e)
			{
				log.debug('error',e.toString());
			}
		}
		function getDaysDataafter(startdate)
		{
			try{
				log.debug('startdate'+startdate);
				var customrecord_advs_lease_headerSearchObj = search.create({
					   type: "customrecord_advs_lease_header",
					   filters:
					   [
						  ["isinactive","is","F"], 
						  "AND", 
						  ["custrecord_advs_l_h_ins_phy_dam_exp","notafter",startdate], 
						  "AND", 
						  ["custrecord_advs_l_h_ins_phy_dam_exp","isnotempty",""]
					   ],
					   columns:
					   [
						  "name",
						  "custrecord_advs_l_h_ins_phy_dam_exp"
					   ]
					});
					var searchResultCount = customrecord_advs_lease_headerSearchObj.runPaged().count;
					log.debug("customrecord_advs_lease count with dates",searchResultCount);
					var arr = [];
					customrecord_advs_lease_headerSearchObj.run().each(function(result){
					   // .run().each has a limit of 4,000 results
					   var obj={};
					   obj.name = result.getValue({name:'name'});
					   obj.date = result.getValue({name:'custrecord_advs_l_h_ins_phy_dam_exp'});
					   arr.push(obj);
					   return true;
					});
			return arr;
			}catch(e)
			{
				log.debug('error',e.toString());
			}
		}
	function addSubmitButtons(form, id, label) {
        form.addSubmitButton({
			label : 'Send Email'
		});
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
    return {
        onRequest
    }

});
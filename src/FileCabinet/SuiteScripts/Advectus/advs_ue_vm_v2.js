/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/runtime', 'N/search', 'N/ui/message', 'N/record', 'N/email'],
    /**
     * @param{runtime} runtime
     */
    (runtime, search, message, record, email) => {


        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

            if (runtime.executionContext.toUpperCase() == 'USERINTERFACE') {
                var inline = scriptContext.form.addField({
                    id: 'custpage_attachmessage',
                    label: 'not shown',
                    type: 'INLINEHTML',
                });
                inline.defaultValue = "<script>jQuery(function($){ require(['/SuiteScripts/Advectus/advs_cs_vm_rec.js'], function(mod){ mod.pageInit();});});</script>";
                // inline.defaultValue = "<script>jQuery(function($){ require(['/SuiteBundles/Bundle 501162/advs_cs_vm_rec.js'], function(mod){ mod.pageInit();});});</script>";

                // if(scriptContext.type == "view"){
                //     var newRec  =   scriptContext.newRecord;
                //     var form    =   scriptContext.form;
                //     var id      =   newRec.id;
                //     form.addButton({id:"custpage_loc_t",label:"Parking Lot Transfer",functionName:"vehlocTrans("+id+")"});
                //     form.addButton({id:"custpage_loc_t",label:"InterCO Transfer",functionName:"vehInterCoTrans("+id+")"});


                //     var BudgetData = getRefurbishBudgetInfo(id);
                //     if(BudgetData){
                //     	var StringData = BudgetData.toString();
                //     	var SplitData = StringData.split('#advs#');
                //     	var EstimateAmt = SplitData[0];
                //     	var ActualAmt = SplitData[1];
                //     	var BudgetAmt = SplitData[2];
                //     	var ShowMessage = 'F',Message = '';
                //     	log.debug('EstimateAmt',EstimateAmt+'@BudgetAmt@'+BudgetAmt+'@ActualAmt@'+ActualAmt);
                //     	if((EstimateAmt*1) > (BudgetAmt*1)){
                //     		Message = 'The Estimate Amount is : $' +EstimateAmt+ ' exceeded the Refurbishment Budget : $ '+BudgetAmt +' .';
                //     	}else if((ActualAmt*1) > (BudgetAmt*1)){
                //     		Message = 'The Actual Amount is : $' +ActualAmt+ ' exceeded the Refurbishment Budget : $ '+BudgetAmt +' .';
                //     	}

                //     	if(Message){
                //     		scriptContext.form.addPageInitMessage({
                //     			type: message.Type.WARNING,
                //     			title: "<b style='display:none;'>!</b>",
                //     			message: "<b style='font-size:18px;color:black;'>"+Message+"</b>"
                //     		});
                //     	}
                //     }
                // }

                if (scriptContext.type == "view") {
                    var newRec = scriptContext.newRecord;
                    var form = scriptContext.form;
                    var id = newRec.id;
                    var form = scriptContext.form;
                    form.clientScriptModulePath = "./advs_cs_vm_rec.js";
                    var Vehsts = newRec.getValue({ fieldId: 'custrecord_advs_vm_reservation_status' });
                    if (Vehsts == 8 || Vehsts == '8' || Vehsts == 2 || Vehsts == '2') {

                    } else {
                        form.addButton({ id: "custpage_loc_t", label: "InterCO Transfer", functionName: "vehInterCoTrans(" + id + ")" });


                    }
                    form.addButton({ id: "custpage_dot", label: "DOT", functionName: "clickdot" });

                    var CustId = newRec.getValue({ fieldId: 'custrecord_advs_vm_customer_number' })
                    form.addButton({ id: "custpage_advs_create_deposit", label: "Create Deposit", functionName: 'depositcreation(' + id + ', ' + CustId + ')' });
                    form.addButton({ id: "custpage_physical_location", label: "Physical Location", functionName: 'updatephyLocation(' + id + ')' });
                    form.addButton({ id: "custpage_vendor_bill", label: "Vendor Bill", functionName: 'openVendorBillCreateMode(' + id + ')' });
                }

            }
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
            var User = runtime.getCurrentUser();
            var UserId = User.id;

            var CurrentRecord = scriptContext.newRecord;
            var OldRecord = scriptContext.oldRecord;
            var Type = scriptContext.type;

            var TruckMasterId = CurrentRecord.id;

            try {

                if (Type == "edit" || Type == "xedit") {

                    var year = OldRecord.getText({
                        fieldId: "custrecord_advs_vm_model_year"
                    });
                    var model = CurrentRecord.getValue({
                        fieldId: "custrecord_advs_vm_model"
                    });
					log.debug('model geeting',model);
					var OldRegiType = OldRecord.getValue({
                        fieldId: "custrecord_advs_reg_type"
                    });
                    var NewRegiType = CurrentRecord.getValue({
                        fieldId: "custrecord_advs_reg_type"
                    });
                    var CustomerId = CurrentRecord.getValue({
                        fieldId: "custrecord_advs_customer"
                    });
                    var VINNumb = CurrentRecord.getValue({
                        fieldId: "name"
                    });

                    var OldMileage = OldRecord.getValue({
                        fieldId: "custrecord_advs_vm_mileage"
                    });
                    var NewMileage = CurrentRecord.getValue({
                        fieldId: "custrecord_advs_vm_mileage"
                    });
                    log.debug('required data-->'+OldMileage+"NewMileage-->"+NewMileage+"year-->"+year);
                    log.error("CustomerId-> " + CustomerId, "OldRegiType-> " + OldRegiType+", TruckMasterId-> "+TruckMasterId);

                    var CustomerName = "N/A";

                    if (CustomerId) {

                        var customerSearchObj = search.create({
                            type: "customer",
                            filters:
                                [
                                    ["isinactive", "is", "F"],
                                    "AND",
                                    ["internalid", "anyof", CustomerId]
                                ],
                            columns:
                                [
                                    search.createColumn({ name: "altname", label: "Name" }),
                                    search.createColumn({ name: "companyname", label: "Company Name" }),
                                    search.createColumn({ name: "isperson", label: "Is Individual" }),
                                    search.createColumn({ name: "firstname", label: "First Name" }),
                                    search.createColumn({ name: "lastname", label: "Last Name" })
                                ]
                        });

                        customerSearchObj.run().each(function (result) {
                            var IsPerson = result.getValue({
                                name: "isperson"
                            });

                            if (IsPerson == "T" || IsPerson == "true" || IsPerson == true) {

                                var FirstName = result.getValue({
                                    name: "firstname"
                                });
                                var LastName = result.getValue({
                                    name: "lastname"
                                });

                                CustomerName = FirstName + " " + LastName;

                            } else {

                                var CompanyName = result.getValue({
                                    name: "companyname"
                                });

                                CustomerName = CompanyName
                            }

                            return true;
                        });
                    }



                    log.error("VINNumb-> " + VINNumb + ", OldRegiType-> " + OldRegiType, "NewRegiType-> " + NewRegiType + ", Type-> " + Type);

                    if (OldRegiType != NewRegiType) {

                        var EmailSubject = "Registration Type has been Changed for: " + CustomerName + ".";

                        var EmailBody = CreateACCEmailTemplate(CustomerName, VINNumb,TruckMasterId);

                        SendEmailToAccounting(UserId, EmailSubject, EmailBody);

                    }

                    if (OldMileage != NewMileage) {
                        var bucketdata = findbucketandchilde(year,NewMileage,model,TruckMasterId)||'';
                        log.debug('bucketdata',bucketdata);
                      if(bucketdata!=''){
                        CurrentRecord.setValue({
                            fieldId: "custrecord_vehicle_master_bucket",
                            value:bucketdata.childbucket
                        });
                        CurrentRecord.setValue({
                            fieldId: "custrecord_v_master_buclet_hidden",
                            value:bucketdata.childhidden
                        });
                      }
                        
                    }
                }

            } catch (err) {
                log.error("ERROR-> ", err.message);
            }


        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

            // var CurrentRecord = scriptContext.newRecord;
            // var vin  = CurrentRecord.getValue({
            //     fieldId : 'custrecord_advs_la_vin_bodyfld'
            // });
            // var CustomerId = CurrentRecord.getValue({
            //     fieldId : 'custrecord_advs_la_vin_bodyfld'
            // });
            // record.submitFields({
            //     type: "customrecord_advs_vm",
            //     id: vin,
            //     values: {
            //       'custrecord_advs_vm_customer_number': CustomerId,
            //     }
            //   });
            /* var CurrentRecord = scriptContext.newRecord;
                 var fam  = CurrentRecord.getValue({
                    fieldId : 'custrecord_advs_fam_asset_link'
                }) || '';
             var lease  = CurrentRecord.getValue({
                    fieldId : 'custrecord_advs_vm_lea_hea'
                })|| '';
             if(lease!='' && fam!=''){
                record.submitFields({
                    type: "customrecord_advs_lease_header",
                    id: lease,
                    values: {
                      'custrecord_advs_l_h_fixed_ass_link': fam,
                    }
                  });
             }*/
            var CurrentRecord = scriptContext.newRecord;

            var Recid = CurrentRecord.id;
            var recType = CurrentRecord.type;
            log.debug(" * Type * ", recType + " * Id * " + Recid)

            if (scriptContext.type == "create" || scriptContext.type == "edit") {
                var lastTitleId = CurrentRecord.getValue({ fieldId: 'custrecord_advs_em_serial_number'})
                var vinId = CurrentRecord.getValue({ fieldId: 'id'})
                var isTitleCreated = checkTitleCreated(vinId)
                if (isTitleCreated.internalid) {
                    log.debug(' * Title Created for VIN ID * ' , isTitleCreated.internalid);
                    //If Created update title received in title dashboard
                    var titleCreated = CurrentRecord.getValue({ fieldId: 'custrecord_advs_vm_is_title_recieved'})
                    log.debug(' titleCreated ' , titleCreated)
                    record.submitFields({
                        type: 'customrecord_advs_title_dashboard',
                        id: isTitleCreated.internalid,
                        values: {
                            'custrecord_advs_td_title_received': titleCreated,
                        },
                        options: {
                            enableSourcing: true,
                            ignoreMandatoryFields: false
                        }
                    });

                }else{
                    log.debug( ' isTitleCreated ' , isTitleCreated)
                    var titleRecord = record.create({type: 'customrecord_advs_title_dashboard'})
                    //Get data from global setting and submit again
                    var globalFields = search.lookupFields({
                        type: 'customrecord_advs_global_setting',
                        id: 1,
                        columns: ['custrecord_advs_gs_title_catalog_text', 'custrecord_advs_gs_title_number']
                    });
                    var titleName = globalFields.custrecord_advs_gs_title_catalog_text
                    var titleNumber = globalFields.custrecord_advs_gs_title_number
                    log.debug( ' titleName ' , titleName + ' titleNumber ' + titleNumber)
                    titleRecord.setValue({fieldId: 'custrecord_advs_td_catalog_number', value: titleName+titleNumber})
                    var nextTitleNumber = (titleNumber*1)+1 //Increment by 1 for next number

                    record.submitFields({
                        type: 'customrecord_advs_global_setting',
                        id: 1,
                        values: {
                            custrecord_advs_gs_title_number: nextTitleNumber
                        }
                    });

                    titleRecord.setValue({fieldId: 'custrecord_advs_td_vin', value: Recid})
                    var titleId = titleRecord.save()
                    log.debug(" * Customer Title Id * ", titleId)
                }
            }
            var newRecReservationSts = CurrentRecord.getValue({
                fieldId: 'custrecord_advs_vm_reservation_status'
            }) || '';

            if (newRecReservationSts == "13") {
                record.submitFields({
                    type: recType,
                    id: Recid,
                    values: {
                        'custrecord_advs_lease_inventory_delboard': false,
                    }
                });
            }
        }

        function checkTitleCreated(vinId){
            var customrecord_advs_title_dashboardSearchObj = search.create({
                type: "customrecord_advs_title_dashboard",
                filters:
                    [
                        ["custrecord_advs_td_vin","anyof",vinId]
                    ],
                columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal Id"}),

                    ]
            });
            var searchResultCount = customrecord_advs_title_dashboardSearchObj.runPaged().count;
            var titleArray = []
            var obj={}
            customrecord_advs_title_dashboardSearchObj.run().each(function(result){
                // .run().each has a limit of 4,000 results
                obj.internalid = result.getValue({ name: 'internalid'});
                obj.title = true
                titleArray.push(obj)
                return true;
            });
            return obj
        }

        function getRefurbishBudgetInfo(VinId) {
            var prepSearchObj = search.create({
                type: "customrecord_advs_vehicle_prep",
                filters:
                    [
                        [
                            [["custrecord_advs_v_p_invoice.mainline", "is", "T"],
                                "OR",
                                ["custrecord_advs_v_p_invoice", "anyof", "@NONE@"]],
                            "AND",
                            [["custrecord_advs_v_p_transaction.mainline", "is", "T"],
                                "OR", ["custrecord_advs_v_p_transaction", "anyof", "@NONE@"]],
                            'AND',
                            ['custrecord_advs_v_p_vin_id', 'anyof', VinId]
                        ]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_advs_v_p_vin_id",
                            summary: "GROUP",
                            label: "vin #"
                        }),
                        search.createColumn({
                            name: "amount",
                            join: "CUSTRECORD_ADVS_V_P_TRANSACTION",
                            summary: "SUM",
                            label: "Estimate"
                        }),
                        search.createColumn({
                            name: "amount",
                            join: "CUSTRECORD_ADVS_V_P_INVOICE",
                            summary: "SUM",
                            label: "Actual"
                        }),
                        search.createColumn({
                            name: "custrecord_refurbishment_budget",
                            join: "CUSTRECORD_ADVS_V_P_VIN_ID",
                            summary: "MAX",
                            label: "Refurbishment Budget"
                        })
                    ]
            });
            var DataObj = '';
            prepSearchObj.run().each(function (result) {
                var EstimateAmt = result.getValue({ name: 'amount', join: "CUSTRECORD_ADVS_V_P_TRANSACTION", summary: "SUM" });
                var ActualAmt = result.getValue({ name: 'amount', join: "CUSTRECORD_ADVS_V_P_INVOICE", summary: "SUM" });
                var BudgetAmt = result.getValue({ name: 'custrecord_refurbishment_budget', join: "CUSTRECORD_ADVS_V_P_VIN_ID", summary: "MAX" });
                DataObj = EstimateAmt + '#advs#' + ActualAmt + '#advs#' + BudgetAmt;
                return true;
            });
            return DataObj;

        }
        return { beforeLoad, beforeSubmit, afterSubmit }

        function CreateACCEmailTemplate(CustomerName, VINNumb,TruckMasterId) {

            var EmailBody = "";
            EmailBody += "<h3>Registration Type has been changed for Customer: " + CustomerName + "</h3>";

            var TruckMasterLink = "https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=129&id=" + TruckMasterId;


            var DateObj = record.create({
                type: "customrecord_advs_st_current_date_time",
            });

            var TodaysDate = DateObj.getValue({
                fieldId: "custrecord_st_current_date"
            });

            var NewFullDate = new Date(TodaysDate);

            var TodayDay = NewFullDate.getDay();
            var TodayDate = NewFullDate.getDate();
            var TodayMonth = NewFullDate.getMonth();
            var TodayYear = NewFullDate.getFullYear();

            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            var TodayDayName = days[TodayDay];
            var TodayMonthName = months[TodayMonth];

            var ThisDate = TodayDayName + ", " + TodayMonthName + " " + TodayDate + ", " + TodayYear;


            EmailBody += "<table width='80%'  border='1px solid black' style='border-collapse: collapse; font-family: sans-serif; ' >" +
                "<tr style='background-color: powderblue;'>" +
                "<td width='50%' style='border-left:1px solid black; padding:5px;'><b>Date: </b></td>" +
                "<td width='25%' style='border-left:1px solid black; padding:5px;'><b>Customer: </b></td>" +
                "<td width='25%' style='border-left:1px solid black; padding:5px;'><b>Vin Number: </b></td>" +
                "</tr>";

            EmailBody += "<tr>" +
                "<td style='border-left:1px solid black; padding:5px;'>" + ThisDate + "</td>" +
                "<td style='border-left:1px solid black; padding:5px;'>" + CustomerName + "</td>" +
                "<td style='border-left:1px solid black; padding:5px;'><a href='"+TruckMasterLink+"'>" + VINNumb + "</a></td>" +
                "</tr>";


            EmailBody += "</table>";


            return EmailBody;

        }

        function SendEmailToAccounting(UserId, EmailSubject, EmailBody) {


            try {

                var customrecord_advs_acc_team_email_cust_chSearchObj = search.create({
                    type: "customrecord_advs_acc_team_email_cust_ch",
                    filters:
                        [
                            ["isinactive", "is", "F"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({ name: "custrecord_advs_acc_team_email_employee", label: "Employee" })
                        ]
                });


                customrecord_advs_acc_team_email_cust_chSearchObj.run().each(function (result) {

                    var Employee = result.getValue({
                        name: "custrecord_advs_acc_team_email_employee"
                    });

                    email.send({
                        author: UserId,
                        body: EmailBody,
                        recipients: Employee,
                        subject: EmailSubject
                    });

                    return true;
                });



                log.error("SENT->", "EMAIL SENT SUCCESSFULLY!");

            } catch (err) {
                log.error("EMAIL_ERROR", err.message)
            }
        }
        function findbucketandchilde(year,mileage,model,vinid)
        {
            try{
				log.debug('model',model);
				var modelobj = search.lookupFields({type:'customrecord_advs_vm',id:vinid,columns:['custrecord_advs_vm_model']});
				var _model = modelobj.custrecord_advs_vm_model[0].value;
				log.debug('_model',_model);
                var customrecord_ez_bucket_calculationSearchObj = search.create({
                    type: "customrecord_ez_bucket_calculation",
                    filters:
                        [
                            /* ["custrecord_advs_b_c_c_model","anyof","6121"],  
							  "AND", */
                            ["name","haskeywords",year],
                            "AND",
                            ["formulanumeric: CASE        WHEN {custrecord_bucket_calc_parent_link.custrecord_advs_min_range_buck} <= "+mileage+"                   AND "+mileage+" <= {custrecord_bucket_calc_parent_link.custrecord_advs_max_range_buck}            THEN 1        ELSE 0 END","equalto","1"]
                        ],
                    columns:
                        [
                            "name",
                            "internalid",
                            search.createColumn({
                                name: "name",
                                join: "CUSTRECORD_BUCKET_CALC_PARENT_LINK"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_b_c_c_model",
                                join: "CUSTRECORD_BUCKET_CALC_PARENT_LINK"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_min_range_buck",
                                join: "CUSTRECORD_BUCKET_CALC_PARENT_LINK"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_max_range_buck",
                                join: "CUSTRECORD_BUCKET_CALC_PARENT_LINK"
                            }),
                            search.createColumn({
                                name: "internalid",
                                join: "CUSTRECORD_BUCKET_CALC_PARENT_LINK"
                            })
                        ]
                });
                var searchResultCount = customrecord_ez_bucket_calculationSearchObj.runPaged().count;
                log.debug("customrecord_ez_bucket_calculationSearchObj result count",searchResultCount);
                var childbucket = 0;
                var childhidden1 =[];
                var obj={};
                customrecord_ez_bucket_calculationSearchObj.run().each(function(result){
                    // .run().each has a limit of 4,000 results
                    obj. childbucket = result.getValue({name:'internalid'});
                    obj. model = result.getValue({
                                name: "custrecord_advs_b_c_c_model",
                                join: "CUSTRECORD_BUCKET_CALC_PARENT_LINK"
                            });
							// REMOVING MODEL COMPARISION AS LOUIS MENTIONED BUCKET DEPENDS ONLY ON MILEAGE AND YEAR
							if(obj.model){ //==_model
								childhidden1.push(result.getValue({
										name: "internalid",
										join: "CUSTRECORD_BUCKET_CALC_PARENT_LINK"
									}));
									obj.childhidden = childhidden1;
							}
                    
					
                    
                    return true;
                });
                return obj;
            }catch(e)
            {
                log.debug('error',e.toString());
            }
        }
    });

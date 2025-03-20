/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/search','N/format','N/currentRecord','./advs_lib_util.js',
        '/SuiteBundles/Bundle 527547/advs_lb_invoice_payment_calculation.js','N/record','N/task'],
    /**
     * @param{runtime} runtime
     * @param{search} search
     */
    (runtime, search,format,currentRecord,libutil,InvCalc,record,task ) => {

        const vehiclesList = (locId,type,freq,vinid,modelId,unitnum) => {

            var filteredIDs = [];
            filteredIDs.push(["custrecord_advs_vm_reservation_status","anyof","1"]);
            filteredIDs.push('AND');
            filteredIDs.push(["isinactive","is","F"]);
            filteredIDs.push('AND');
            filteredIDs.push(["custrecord_advs_vm_model","noneof","@NONE@"]);
            filteredIDs.push('AND');
            filteredIDs.push(["custrecord_advs_vm_vehicle_brand","noneof","@NONE@"]);
            filteredIDs.push('AND');
            filteredIDs.push(["custrecord_advs_vm_location_code","anyof",locId]);
            if(modelId){
                filteredIDs.push('AND');
                filteredIDs.push(["custrecord_advs_vm_model","anyof",modelId]);
            }
            if(vinid){
                filteredIDs.push('AND');
                filteredIDs.push(["internalid","anyof",vinid]);
            }
            /*if(type){
                filteredIDs.push('AND');
                filteredIDs.push(["custrecord_advs_vm_ren_lea_terms","anyof",type]);
            }*/
            if(unitnum){
                filteredIDs.push('AND');
                filteredIDs.push([["name","contains",unitnum],"OR",
                    ["custrecord_advs_vm_po_quote","contains",unitnum]
                    ,"OR", ["custrecord_advs_em_serial_number","contains",unitnum]]);

            }






            var vehicleSearch = search.create({
                type: "customrecord_advs_vm",
                filters:[filteredIDs],
                /*  [
                      ["custrecord_advs_vm_reservation_status","anyof","1"],
                      "AND",
                      ["isinactive","is","F"],
                      "AND",
                      ["custrecord_advs_vm_model","noneof","@NONE@"]
                      ,"AND",
                      ["custrecord_advs_vm_vehicle_brand","noneof","@NONE@"]
                      // ,"AND",
                      // ["custrecord_advs_vm_ren_lea_terms","anyof",type]
                      ,"AND",
                      ["custrecord_advs_vm_location_code","anyof",locId]
                  ]*/
                columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal ID"}),
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        search.createColumn({name: "custrecord_advs_vm_model", label: "Model"}),
                        search.createColumn({name: "custrecord_advs_vm_vehicle_brand", label: "Brand"}),
                        search.createColumn({name: "custrecord_advs_vm_ren_lea_terms", label: "Brand"}),
                        search.createColumn({name: "custitem_advs_pst_c",join:"custrecord_advs_vm_model"}),
                        search.createColumn({name: "custitem_advs_gst_ch",join:"custrecord_advs_vm_model"}),
                        search.createColumn({name: "custitem_advs_monthly_rate",join:"custrecord_advs_vm_model"}),
                        search.createColumn({name: "custitem_advs_daily_rate",join:"custrecord_advs_vm_model"}),
                        search.createColumn({name: "custitem_advs_weekly_rate",join:"custrecord_advs_vm_model"}),

                        search.createColumn({name: "custitem_advs_damage_rate",join:"custrecord_advs_vm_model"}),
                        search.createColumn({name: "custitem_advs_meter_rate",join:"custrecord_advs_vm_model"}),
                        search.createColumn({name: "custitem_advs_hours_rate",join:"custrecord_advs_vm_model"}),
                        search.createColumn({name: "custitem_advs_late_chrg",join:"custrecord_advs_vm_model"}),
                        // search.createColumn({name: "custitem_advs_pst_c",join:"custrecord_advs_vm_model"}),
                        // search.createColumn({name: "custitem_advs_gst_ch",join:"custrecord_advs_vm_model"}),

                        search.createColumn({name: "custitem_advs_miles_per_day",join:"custrecord_advs_vm_model"}),
                        search.createColumn({name: "custitem_advs_hrs_per_day",join:"custrecord_advs_vm_model"}),

                        search.createColumn({name: "custrecord_advs_em_serial_number", label: "Serial"}),

                    ]
            });
            /* if(modelId){
                 var modelfilt   =   search.createFilter({
                     name: "custrecord_advs_vm_model",
                      operator: search.Operator.ANYOF,
                     values: modelId
             });
                 vehicleSearch.filters.push(modelfilt);
         }
             if(vinid){
                 var modelfilt   =   search.createFilter({
                     name: "internalid",
                     operator: search.Operator.ANYOF,
                     values: vinid
                 });
                 vehicleSearch.filters.push(modelfilt);
             }
             if(unitnum){
                 var unitFilt1   =   search.createFilter({
                     name: "name",
                     operator: search.Operator.CONTAINS,
                     values: unitnum
                 });
                 var unitFilt2   =   search.createFilter({
                     name: "custrecord_advs_vm_po_quote",
                     operator: search.Operator.CONTAINS,
                     values: unitnum
                 });
                 var unitFilt3  =   search.createFilter({
                     name: "custrecord_advs_em_serial_number",
                     operator: search.Operator.CONTAINS,
                     values: unitnum
                 });
                 var combinedFilter = search.createFilter({
                     name:null,
                     filters: [unitFilt1, unitFilt2,unitFilt3],
                     operator: search.Operator.OR
                 });

                 vehicleSearch.filters.push(combinedFilter);
             }*/



            var vehiclesArr =   [];
            var pagedData = vehicleSearch.runPaged({pageSize: 1000});
            pagedData.pageRanges.forEach(function (pageRange) {
                var myPage = pagedData.fetch({index: pageRange.index});
                myPage.data.forEach(function (result) {
                    var vinId            = result.getValue({name: "internalid"});
                    var vinName          = result.getValue({name: "name"});
                    var modelID          = result.getValue({name: "custrecord_advs_vm_model"});
                    var BrandID          = result.getValue({name: "custrecord_advs_vm_vehicle_brand"});
                    var leaserent        = result.getValue({name: "custrecord_advs_vm_ren_lea_terms"});

                    var monthly     =   result.getValue({name: "custitem_advs_monthly_rate",join:"custrecord_advs_vm_model"});
                    var weekly      =   result.getValue({name: "custitem_advs_weekly_rate",join:"custrecord_advs_vm_model"});
                    var daily       =   result.getValue({name: "custitem_advs_daily_rate",join:"custrecord_advs_vm_model"});

                    var damage       =   result.getValue({name: "custitem_advs_damage_rate",join:"custrecord_advs_vm_model"});
                    var meter       =   result.getValue({name: "custitem_advs_meter_rate",join:"custrecord_advs_vm_model"});
                    var hrs         =   result.getValue({name: "custitem_advs_hours_rate",join:"custrecord_advs_vm_model"});
                    var late        =   result.getValue({name: "custitem_advs_late_chrg",join:"custrecord_advs_vm_model"});
                    var pst         =   "";//result.getValue({name: "custitem_advs_pst_c",join:"custrecord_advs_vm_model"});
                    var gst         =  "";// result.getValue({name: "custitem_advs_gst_ch",join:"custrecord_advs_vm_model"});

                    var milPday     =   result.getValue({name: "custitem_advs_miles_per_day",join:"custrecord_advs_vm_model"})*1;
                    var hrPday      =   result.getValue({name: "custitem_advs_hrs_per_day",join:"custrecord_advs_vm_model"})*1;

                    var serialNum   = result.getValue({name: "custrecord_advs_em_serial_number"});



                    var obj =   {};
                    obj.vinId       =   vinId;
                    obj.name        =   vinName;
                    obj.model     =   modelID;
                    obj.brand     =   BrandID;
                    obj.renttype     =   leaserent;
                    obj.monthly     =   monthly;
                    obj.weekly      =   weekly;
                    obj.daily       =   daily;
                    obj.damage      =   damage;
                    obj.meter       =   meter;
                    obj.hrs         =   hrs;
                    obj.late        =   late;
                    obj.pst        =   pst;
                    obj.gst        =   gst;

                    obj.milpday         =   milPday;
                    obj.hrpday          =   hrPday;

                    obj.serialnum          =   serialNum;



                    vehiclesArr.push(obj);

                });
            });

            return vehiclesArr;
        }

        const vehiclesListLease = (locId,type,freq,vinid,modelId,unitnum) => {
            var filteredIDs = [];
            filteredIDs.push(["custrecord_advs_vm_reservation_status","anyof","1"]);
            filteredIDs.push('AND');
            filteredIDs.push(["isinactive","is","F"]);
            filteredIDs.push('AND');
            filteredIDs.push(["custrecord_advs_vm_model","noneof","@NONE@"]);
            filteredIDs.push('AND');
            filteredIDs.push(["custrecord_advs_vm_vehicle_brand","noneof","@NONE@"]);
            filteredIDs.push('AND');
            filteredIDs.push(["custrecord_advs_vm_location_code","anyof",locId]);
            if(modelId){
                filteredIDs.push('AND');
                filteredIDs.push(["custrecord_advs_vm_model","anyof",modelId]);
            }
            if(vinid){
                filteredIDs.push('AND');
                filteredIDs.push(["internalid","anyof",vinid]);
            }
            /*if(type){
                filteredIDs.push('AND');
                filteredIDs.push(["custrecord_advs_vm_ren_lea_terms","anyof",type]);
            }*/
            if(unitnum){
                filteredIDs.push('AND');
                filteredIDs.push([["name","contains",unitnum],"OR",
                    ["custrecord_advs_vm_po_quote","contains",unitnum]
                    ,"OR", ["custrecord_advs_em_serial_number","contains",unitnum]]);

            }
            var vehicleSearch = search.create({
                type: "customrecord_advs_vm",
                filters:
                filteredIDs,
                columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal ID"}),
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        search.createColumn({name: "custrecord_advs_vm_model", label: "Model"}),
                        search.createColumn({name: "custrecord_advs_vm_vehicle_brand", label: "Brand"}),
                        search.createColumn({name: "custrecord_advs_vm_ren_lea_terms", label: "Brand"}),
                        // search.createColumn({name: "custitem_advs_pst_c",join:"custrecord_advs_vm_model"}),
                        // search.createColumn({name: "custitem_advs_gst_ch",join:"custrecord_advs_vm_model"}),
                        search.createColumn({name: "custitem_advs_monthly_rate",join:"custrecord_advs_vm_model"}),
                        search.createColumn({name: "custitem_advs_daily_rate",join:"custrecord_advs_vm_model"}),
                        search.createColumn({name: "custitem_advs_weekly_rate",join:"custrecord_advs_vm_model"}),
                        search.createColumn({name: "custrecord_advs_vm_last_direct_cost", label: "Brand"}),
                    ]
            });
            if(modelId){
                var modelfilt   =   search.createFilter({
                    name: "custrecord_advs_vm_model",
                    operator: search.Operator.ANYOF,
                    values: modelId
                });
                vehicleSearch.filters.push(modelfilt);
            }
            if(vinid){
                var modelfilt   =   search.createFilter({
                    name: "internalid",
                    operator: search.Operator.ANYOF,
                    values: vinid
                });
                vehicleSearch.filters.push(modelfilt);
            }


            var vehiclesArr =   [];
            var pagedData = vehicleSearch.runPaged({pageSize: 1000});
            pagedData.pageRanges.forEach(function (pageRange) {
                var myPage = pagedData.fetch({index: pageRange.index});
                myPage.data.forEach(function (result) {
                    var vinId            = result.getValue({name: "internalid"});
                    var vinName          = result.getValue({name: "name"});
                    var modelID          = result.getValue({name: "custrecord_advs_vm_model"});
                    var BrandID          = result.getValue({name: "custrecord_advs_vm_vehicle_brand"});
                    var leaserent        = result.getValue({name: "custrecord_advs_vm_ren_lea_terms"});
                    var vehicleCst       = result.getValue({name: "custrecord_advs_vm_last_direct_cost"})*1;

                    var monthly     =   result.getValue({name: "custitem_advs_monthly_rate",join:"custrecord_advs_vm_model"});
                    var weekly      =   result.getValue({name: "custitem_advs_daily_rate",join:"custrecord_advs_vm_model"});
                    var daily       =   result.getValue({name: "custitem_advs_weekly_rate",join:"custrecord_advs_vm_model"});

                    var amount  =   vehicleCst;


                    var obj =   {};
                    obj.vinId       =   vinId;
                    obj.name        =   vinName;
                    obj.model     =   modelID;
                    obj.brand     =   BrandID;
                    obj.renttype     =   leaserent;
                    obj.rate     =   amount;
                    vehiclesArr.push(obj);

                });
            });

            return vehiclesArr;
        }

        function RentalCustomerRate(custID,freq,vinid,modelId,SpecialModel){
            var RateDataArr   =   [];
            var ModelSearch = search.create({
                type: "customrecord_advs_r_c_s_rate",
                filters:
                    [
                        ["isinactive","is","F"]
                        ,"AND",
                        ["custrecord_advs_r_c_s_r_cust","anyof",custID]

                    ],
                columns:
                    [
                        search.createColumn({name: "internalid"}),
                        search.createColumn({name: "custrecord_advs_r_c_s_r_model"}),
                        // search.createColumn({name: "custrecord_advs_c_s_r_pst"}),
                        // search.createColumn({name: "custrecord_advs_r_c_s_r_gst"}),
                        search.createColumn({name: "custrecord_advs_r_c_s_r_monthy"}),
                        search.createColumn({name: "custrecord_advs_c_s_r_weekl"}),
                        search.createColumn({name: "custrecord_advs_r_c_s_daily"}),
                        search.createColumn({name: "custrecord_advs_r_c_s_r_dam"}),
                        search.createColumn({name: "custrecord_advs_r_c_s_r_meter"}),
                        search.createColumn({name: "custrecord_advs_r_c_s_r_hrs"}),
                        search.createColumn({name: "custrecord_advs_r_c_s_r_late_chrge"}),

                        search.createColumn({name: "custrecord_advs_r_c_s_r_hrs_p_day"}),
                        search.createColumn({name: "custrecord_advs_r_c_s_r_mil_p_day"}),

                    ]
            });
            if(CheckAnd(modelId)){
                var modelfilt   =   search.createFilter({
                    name: "custrecord_advs_r_c_s_r_model",
                    operator: search.Operator.ANYOF,
                    values: modelId
                });
                ModelSearch.filters.push(modelfilt);

            }
            ModelSearch.run().each(function(result){
                var id          =   result.getValue({name: "internalid"});
                var modelId     =   result.getValue({name: "custrecord_advs_r_c_s_r_model"});
                var modeltxt     =   result.getText({name: "custrecord_advs_r_c_s_r_model"});
                var pst         =  "";// result.getValue({name: "custrecord_advs_c_s_r_pst"});
                var Gst         =   "";//result.getValue({name: "custrecord_advs_r_c_s_r_gst"});
                var monthly     =   result.getValue({name: "custrecord_advs_r_c_s_r_monthy"})*1;
                var weekly      =   result.getValue({name: "custrecord_advs_c_s_r_weekl"})*1;
                var daily       =   result.getValue({name: "custrecord_advs_r_c_s_daily"})*1;
                var damage      =   result.getValue({name: "custrecord_advs_r_c_s_r_dam"})*1;
                var meter       =   result.getValue({name: "custrecord_advs_r_c_s_r_meter"})*1;
                var hrs         =   result.getValue({name: "custrecord_advs_r_c_s_r_hrs"})*1;
                var lateChrge   =   result.getValue({name: "custrecord_advs_r_c_s_r_late_chrge"})*1;

                var hrspDay     =   result.getValue({name: "custrecord_advs_r_c_s_r_hrs_p_day"})*1;
                var milpDay     =   result.getValue({name: "custrecord_advs_r_c_s_r_mil_p_day"})*1;

                if(!hrs){hrs=0;}


                RateDataArr[modelId] = new Array();
                RateDataArr[modelId]["month"] = monthly;
                RateDataArr[modelId]["weekly"] = weekly;
                RateDataArr[modelId]["daily"] = daily;
                RateDataArr[modelId]["damage"] = damage;
                RateDataArr[modelId]["meter"] = meter;
                RateDataArr[modelId]["hrs"] = hrs;
                RateDataArr[modelId]["lateChrge"] = lateChrge;
                RateDataArr[modelId]["pst"] = pst;
                RateDataArr[modelId]["gst"] = Gst;

                RateDataArr[modelId]["hpd"] = hrspDay;
                RateDataArr[modelId]["mpd"] = milpDay;


                var obj = {};
                obj.id = modelId;
                obj.name = modeltxt;
                SpecialModel.push(obj);
                return true;
            });
            return RateDataArr;
        }
        function createREgularLines(scriptContext){
            var curRec      =   scriptContext.newRecord;
            var eventType   =   curRec.getValue({
                fieldId:"custrecord_advs_lease_option_list"
            });

            generateRegularLines(scriptContext);


            /*  if(eventType == 1){
                  createREgularLinesLoan(scriptContext);
              }if(eventType == '2'){
                  createREgularLinesFlexi(scriptContext);
              }if(eventType == '3'){

              }*/

        }

        function calculateInvLines(scriptContext){
            InvCalc.calculateData();
        }

        function generateRegularLines(scriptContext){
            var curRec  =   currentRecord.get();
            var newRec  =   scriptContext.newRecord;

            var rec_s_id	=	"recmachcustrecord_advs_lm_lc_c_link";//custrecord_advs_lea_lc_c_link
            var RecCount	=	newRec.getLineCount({sublistId:rec_s_id});

            var deposit_inscep				=	newRec.getValue("custrecord_advs_l_h_depo_ince")*1;
            var pay_incep					=	newRec.getValue("custrecord_advs_l_h_pay_incep")*1;
            var tot_incep					=	newRec.getValue("custrecord_advs_l_h_tot_ince")*1;
            var terms					    =	newRec.getValue("custrecord_advs_l_h_terms")*1;
            var pay_2_13					=	newRec.getValue("custrecord_advs_l_h_pay2_13")*1;
            var pay_14_25					=	newRec.getValue("custrecord_advs_l_h_pay_14_25")*1;
            var pay_26_37					=	newRec.getValue("custrecord_advs_l_h_pay_26_37")*1;
            var pay_38_49					=	newRec.getValue("custrecord_advs_l_h_pay_38_49")*1;
            var purchaseOptn    			=	newRec.getValue("custrecord_advs_l_h_pur_opti")*1;
            var cont_Total					=	newRec.getValue("custrecord_advs_l_h_cont_total")*1;
            var Lease_date                          =   newRec.getValue("custrecord_advs_l_h_start_date");
            var Start_date					        =	newRec.getValue("custrecord_advs_l_a_pay_st_date");
            var Second_date					        =	newRec.getValue("custrecord_advs_second_payment_date");

            log.debug("Start_date",Start_date + ' Second_date ' + Second_date);

            var frequency					        =	newRec.getValue("custrecord_advs_l_h_frequency");

            log.debug("Start_date",Start_date);

            for(var k=0;k<RecCount;k++){
                newRec.removeLine({sublistId:rec_s_id, line:0});
            }

            terms = terms*1;

            var dd  =   1;var tempTotal = 0;
            for(var d=1;d<=terms ;d++){
                var scheduleAmount  =   0;
                if(d == 1){
                    scheduleAmount  =   pay_incep;
                }else if(d >= 2 && d<=13){
                    scheduleAmount  =   pay_2_13;
                }else if(d >= 14 && d<=25){
                    scheduleAmount  =   pay_14_25;
                }else if(d >= 26  && d<=37){
                    scheduleAmount  =   pay_26_37;
                }else if(d >= 38 && d<=49){
                    scheduleAmount  =   pay_38_49;
                }else{
                    scheduleAmount =pay_38_49;
                }
                tempTotal+=scheduleAmount;

                if(dd == 1){
                    Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                    log.debug("first line ",Start_date);

                }else if(dd == 2) {
                    Start_date  =   format.parse({type:format.Type.DATE,value:Second_date});
                }else {
                        if(frequency == libutil.frequency.weekly){

                            log.debug("weekly",Second_date);

                            // Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                            Start_date = addDaysToDate(Start_date, 7);
                            Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                            log.debug("weekly",Start_date);

                        }else if(frequency == libutil.frequency.monthly){
                            log.debug("monthly",Second_date);
                            // Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                            Start_date = addMonthsToDate(Start_date, 1);
                            Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                            log.debug("monthly",Start_date);
                        }else{
                            log.debug("ELSE",Second_date);
                            Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                            Start_date = addMonthsToDate(Second_date, 1);
                            Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                            log.debug("ELSE",Start_date);
                        }
                }

                // log.debug("finalDate",Start_date);

                newRec.insertLine({sublistId: rec_s_id, line: 0});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_date",line: 0,value: Start_date});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_sche_pay",line: 0,value: scheduleAmount});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_down_paying",line: 0,value: scheduleAmount});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_end_bal",line: 0,value: tempTotal});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_narration",line: 0,value: dd});

                if(d == terms) {
                    newRec.setValue({fieldId: "custrecord_advs_l_h_end_date", value: Start_date});
                }
                dd++;
            }

        }

        function createREgularLinesFlexi(scriptContext){
            var curRec  =   currentRecord.get();
            var newRec  =   scriptContext.newRecord;

            var recMach	=	"recmachcustrecord_advs_f_l_s_cnt_head";
            var lineC	=	newRec.getLineCount(recMach);
            var LoanAmount	=	newRec.getValue("custrecord_advs_l_a_loan_amount");
            var InterestRate	=	newRec.getValue("custrecord_advs_l_annual_interest_rate");
            var Status						=	newRec.getValue("custrecord_advs_l_h_status");//custrecord_advs_l_h_status
            var Start_date					=	newRec.getValue("custrecord_advs_l_a_pay_st_date");
            var Lease_date					=	newRec.getValue("custrecord_advs_l_h_start_date");
            var ExtraPay            =0;
            if(Status ==1){

                if(InterestRate){
                    InterestRate	=	parseFloat(InterestRate);
                    InterestRate	=	InterestRate*1;
                }
                var mon_t	=	1;
                var days_t	=	"";

                var same	=	0;
                if(Lease_date==Start_date){
//		Break_up=Break_up-1;
                    same++;
                }

                var rec_s_id	=	"recmachcustrecord_advs_lm_lc_c_link";//custrecord_advs_lea_lc_c_link
                var RecCount	=	newRec.getLineCount({sublistId:rec_s_id});

                for(var k=0;k<RecCount;k++){
                    newRec.removeLine({sublistId:rec_s_id, line:0});
                }
                var PrincipCumm	=	0;
                var interestCum	=	0;
                var beginingBalance	=	0;
                var EndBalanceCum	=	0;
                var suEndingBalance = 0;
                var suinterestCum =0;
                var suinterest =0;
                var residualDetails = [];
                var check = false;
                var dd=1;
                for(var i=0;i<lineC;i++){
                    var NoSched		=	newRec.getSublistValue({sublistId:recMach, fieldId:"custrecord_advs_f_l_s_schedules", line:i})*1;
                    var amount		=	newRec.getSublistValue({sublistId:recMach, fieldId:"custrecord_advs_f_l_s_amount", line:i})*1;

                    var per_installment	=	amount;


                    var ActualInterest	=	InterestRate/100;
                    ActualInterest		=	ActualInterest*1;
//		ActualInterest		=	ActualInterest/12;
                    ActualInterest		=	ActualInterest*1;
                    var TempActualinterest	=	(ActualInterest*amount);
                    var TotalSchedule	=	((amount+TempActualinterest)/per_installment);
                    var Break_up	=	TotalSchedule*1;
                    if(Status ==1){
                        var LeaseRegPay					=	amount*1;
                        var TempX	=	0;
                        var TempY	=	0;


                        var totalPayment	=	LeaseRegPay;

                        interestCum	=	interestCum*1;


                        for(var d=1;d<=NoSched ;d++){
                            if(dd==1){
                                TempX+=LoanAmount;
                                beginingBalance	=	LoanAmount;
                            }else{
//					beginingBalance	=	EndBalanceCum;
                            }

                            var Interest		=	TempActualinterest;
                            Interest			=	Interest*1;

                            var Principal		=	totalPayment-Interest;
                            Principal			=	Principal*1;
                            Principal 			= 	Principal.toFixed(2);
                            var EndingBalance	=	0;
                            if(totalPayment == beginingBalance){
                                EndingBalance	=	beginingBalance-totalPayment;
                            }else{
                                EndingBalance	=	beginingBalance-totalPayment;

                            }

                            interestCum	= (interestCum+Interest);

                            log.debug("Interest",Interest+"=>"+Principal);

                            newRec.insertLine({sublistId: rec_s_id, line: 0});


                            if(dd==1 ){
                                // newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_lm_lc_c_date",value:Start_date});
                                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_date",line: 0,value: Start_date});
                                // curRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_lm_lc_c_date",value:Start_date});
                            }else{
                                if(days_t!=''){



                                    log.debug("Start_date",Start_date);
                                    Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                                    Start_date = addDaysToDate(Start_date, days_t);
                                    Start_date  =   format.format({type:format.Type.DATE,value:Start_date});

                                }else if(mon_t!=''){
                                    log.debug("Start_date_mon_t",Start_date);
                                    // Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});

                                    Start_date = addMonthsToDate(Start_date, mon_t);
                                    log.debug("Start_date_mon_t@@@@",Start_date);
                                    // Start_date  =   format.format({type:format.Type.DATE,value:Start_date});

                                    Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                                    log.debug("Start_date_mon_t3333",Start_date);
                                }else{

                                }
                                // newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_lm_lc_c_date",value:Start_date});
                                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_date",line: 0,value: Start_date});
                            }

                            newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_down_paying",line: 0,value: totalPayment});
                            newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_reg_pay_reg_int",line: 0,value: Interest});
                            newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_reg_pay_reg_prin",line: 0,value: Principal});
                            newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_cumulative_int",line: 0,value:interestCum});
                            newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_sche_pay",line: 0,value: LeaseRegPay});
                            newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_beg_bal",line: 0,value: beginingBalance});
                            newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_end_bal",line: 0,value: EndingBalance});
                            newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_extra_payments",line: 0,value: ExtraPay});
                            newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_narration",line: 0,value: dd});

                            beginingBalance	=	EndingBalance;


                            dd++;
                        }

                        if(i == lineC){
                            newRec.setValue({fieldId:"custrecord_advs_l_h_end_date",value:Start_date});
                            newRec.setValue({fieldId:"custrecord_advs_lease_total_intrest_fa",value:interestCum});

                        }

                    }
                }
            }
        }



        function createREgularLinesLoan(scriptContext){
            var curRec  =   currentRecord.get();
            var newRec  =   scriptContext.newRecord;
            log.debug("newRec",newRec);
            var InterestRate    =   newRec.getValue("custrecord_advs_l_annual_interest_rate");
            var LoanAmount      =   newRec.getValue("custrecord_advs_l_a_loan_amount");
            var Start_date      =   newRec.getValue("custrecord_advs_l_a_pay_st_date");
            var per_installment =   newRec.getValue("custrecord_advs_l_a_scheduled_pay");
            var NoSched         =   newRec.getValue("custrecord_advs_l_a_sch_num_f_pay");
            var leaseId         =   "";//newRec.getValue("custrecord_advs_lea_header_link");
            var adminFee        =   newRec.getValue("custrecord_advs_l_a_admin_gp_fee");
            var vinId           =   newRec.getValue("custrecord_advs_la_vin_bodyfld");
            var ExtraPay         =0;

            /* var leaseFld    =   ["custrecord_advs_l_a_pay_st_date"];
             var LeaseRec            =   search.lookupFields({type:"customrecord_advs_lease_header",id:leaseId,columns:leaseFld});
             var Lease_date          =   LeaseRec["custrecord_advs_l_a_pay_st_date"];*/
            var Lease_date      =   newRec.getValue("custrecord_advs_l_h_start_date");




            if(InterestRate){
                InterestRate	=	parseFloat(InterestRate);
                InterestRate	=	InterestRate*1;
            }

            var ActualInterest	=	InterestRate/100;
            ActualInterest		=	ActualInterest*1;
            ActualInterest		=	ActualInterest/12;
            ActualInterest		=	ActualInterest*1;
            var TempActualinterest	=	(ActualInterest*LoanAmount);

            var TotalSchedule	=	((LoanAmount+TempActualinterest)/per_installment);
            var Break_up	=	TotalSchedule*1;

            log.debug("ActualInterest",LoanAmount +"==>"+TempActualinterest+"=>"+per_installment);
            var mon_t	=	1;
            var days_t	=	"";

            var same	=	0;
            if(Lease_date==Start_date){
                same++;
            }

            var LeaseRegPay = per_installment * 1;
            var TempX = 0;
            var TempY = 0;
            var rec_s_id = "recmachcustrecord_advs_lm_lc_c_link";
            var RecCount = newRec.getLineCount({sublistId:rec_s_id});

            var isSublistRecord = newRec.getSublist({sublistId:rec_s_id});
            log.debug("isSublistRecord",isSublistRecord);



            for (var k = 0; k < RecCount; k++) {
                newRec.removeLine({sublistId:rec_s_id,line:0});
            }
            log.debug("ActualInterest",ActualInterest +"==>"+Break_up);

            var PrincipCumm	=	0;
            var interestCum	=	0;
            var beginingBalance	=	0;

            for(var d=1;d<=NoSched ;d++){
                if(d==1){
                    TempX+=LoanAmount;
                    beginingBalance	=	LoanAmount;
                }else{
//				beginingBalance	=	EndBalanceCum;
                }

                var totalPayment	=	LeaseRegPay;
                if(beginingBalance<=LeaseRegPay){
                    totalPayment	=	beginingBalance;
                }

                if(ExtraPay >0 && NoSched != d){
                    totalPayment	+=	ExtraPay;
                }else{
                    ExtraPay	=	0;
                }

                PrincipCumm			=	PrincipCumm*1;
                interestCum			=	interestCum*1;
                beginingBalance		=	beginingBalance*1;
                totalPayment		=	totalPayment*1;

                var Naration		=	d.toString();
                var Interest		=	(beginingBalance*ActualInterest);
                Interest			=	Interest*1;
                Interest			=	Interest.toFixed(2);
                Interest			=	Interest*1;

                var Principal		=	totalPayment-Interest;
                Principal			=	Principal*1;

                interestCum	= (interestCum+Interest);
                PrincipCumm	+= Principal;
                PrincipCumm		=	PrincipCumm*1;

                if(totalPayment == beginingBalance){
                    var EndingBalance	=	beginingBalance-totalPayment;


                }else{
                    var EndingBalance	=	beginingBalance-Principal;

                }

                log.debug("Interest",Interest +"==>"+interestCum+"=>"+ActualInterest+"=>"+Principal);

                newRec.insertLine({sublistId: rec_s_id, line: 0});


                if(d==1 ){
                    // newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_lm_lc_c_date",value:Start_date});
                    newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_date",line: 0,value: Start_date});
                    // curRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_lm_lc_c_date",value:Start_date});
                }else{
                    if(days_t!=''){



                        log.debug("Start_date",Start_date);
                        Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                        Start_date = addDaysToDate(Start_date, days_t);
                        Start_date  =   format.format({type:format.Type.DATE,value:Start_date});

                    }else if(mon_t!=''){
                        log.debug("Start_date_mon_t",Start_date);
                        // Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});

                        Start_date = addMonthsToDate(Start_date, mon_t);
                        log.debug("Start_date_mon_t@@@@",Start_date);
                        // Start_date  =   format.format({type:format.Type.DATE,value:Start_date});

                        Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                        log.debug("Start_date_mon_t3333",Start_date);
                    }else{

                    }
                    // newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_lm_lc_c_date",value:Start_date});
                    newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_date",line: 0,value: Start_date});
                }

                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_down_paying",line: 0,value: totalPayment});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_reg_pay_reg_int",line: 0,value: Interest});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_reg_pay_reg_prin",line: 0,value: Principal});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_cumulative_int",line: 0,value:interestCum});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_sche_pay",line: 0,value: LeaseRegPay});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_beg_bal",line: 0,value: beginingBalance});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_end_bal",line: 0,value: EndingBalance});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_extra_payments",line: 0,value: ExtraPay});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_narration",line: 0,value: d});
                // newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_link",line: 0,value: leaseId});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_lease_vin",line: 0,value: vinId});





                /*newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_lm_lc_c_down_paying",value:totalPayment});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_reg_pay_reg_int",value:Interest});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_reg_pay_reg_prin",value:Principal});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_r_p_cumulative_int",value:interestCum});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_r_p_sche_pay",value:LeaseRegPay});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_r_p_beg_bal",value:beginingBalance});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_r_p_end_bal",value:EndingBalance});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_r_p_extra_payments",value:ExtraPay});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_lm_lc_c_narration",value:d});*/
                // newRec.commitLine({sublistId:rec_s_id});

                beginingBalance	=	EndingBalance;


                if(NoSched == d){
                    newRec.setValue({fieldId:"custrecord_advs_l_h_end_date",value:Start_date});
                    newRec.setValue({fieldId:"custrecord_advs_lease_total_intrest_fa",value:interestCum});

                    // nlapiSetFieldValue("custrecord_advs_r_h_end_date", Start_date);
                    // nlapiSetFieldValue("custrecord_advs_total_intrest_fa", interestCum);
                }
            }
        }
        function calcStockLines(scriptContext){
            var curRec      =   scriptContext.newRecord;
            var recMach =   "recmachcustrecord_advs_lea_header_link";
            var lines   =   curRec.getLineCount({sublistId:recMach});
            var BodyRate    =   0;
            for(var m=0;m<lines;m++){
                var lineRate    =   curRec.getSublistValue({sublistId:recMach,fieldId:"custrecord_advs_lea_rental_rates",line:m})*1;
                BodyRate+=lineRate;
            }
            curRec.setValue({fieldId:"custrecord_advs_l_a_tot_veh_lines",value:BodyRate});
        }

        function invoiceTypeSearch(){
            var setupDataVal   =   [];
            var customrecord_advs_st_invoice_typeSearchObj = search.create({
                type: "customrecord_advs_st_invoice_type",
                filters:
                    [
                        ["isinactive","is","F"]
                    ],
                columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal ID"}),
                        search.createColumn({name: "custrecord_advs_i_v_rent_item", label: "Rental Items"}),
                        search.createColumn({name: "custrecord_advs_inv_type_sbtype", label: "SubType"}),

                        search.createColumn({name: "custrecord_advs_i_t_mil_p_mn_itm", label: "SubType"}),
                        search.createColumn({name: "custrecord_advs_i_t_hr_pr_mn_item", label: "SubType"}),
                        search.createColumn({name: "custrecord_advs_i_t_dam_item", label: "SubType"}),
                        search.createColumn({name: "custrecord_advs_i_t_princi_item", label: "SubType"}),
                        search.createColumn({name: "custrecord_advs_i_t_int_item", label: "SubType"}),
                        search.createColumn({name: "custrecord_advs_i_t_toll_item", label: "SubType"}),
                        search.createColumn({name: "custrecord_advs_i_t_ret_adj_account", label: "SubType"}),
                        search.createColumn({name: "custrecord_advs_i_t_deposit", label: "SubType"}),
                        search.createColumn({name: "custrecord_advs_i_t_lae_fee", label: "SubType"}),



                    ]
            });
            customrecord_advs_st_invoice_typeSearchObj.run().each(function(result){
                var subType                             =   result.getValue({name:"custrecord_advs_inv_type_sbtype"});
                var SubtypeText                         =   result.getText({name: "custrecord_advs_inv_type_sbtype"});
                setupDataVal[subType]                   = new Array();
                setupDataVal[subType]["id"]             = result.getValue({name:"internalid"});
                setupDataVal[subType]["regularitem"]    = result.getValue({name:"custrecord_advs_i_v_rent_item"});

                setupDataVal[subType]["milpermnth"]     = result.getValue({name:"custrecord_advs_i_t_mil_p_mn_itm"});
                setupDataVal[subType]["hrpermnth"]      = result.getValue({name:"custrecord_advs_i_t_hr_pr_mn_item"});
                setupDataVal[subType]["damageitem"]     = result.getValue({name:"custrecord_advs_i_t_dam_item"});

                setupDataVal[subType]["principalItem"]  = result.getValue({name:"custrecord_advs_i_t_princi_item"});
                setupDataVal[subType]["interestItem"]   = result.getValue({name:"custrecord_advs_i_t_int_item"});
                setupDataVal[subType]["tollItem"]       = result.getValue({name:"custrecord_advs_i_t_toll_item"});
                setupDataVal[subType]["buyout"]         = result.getValue({name:"custrecord_advs_i_v_rent_item"});
                setupDataVal[subType]["returnadjAcc"]   = result.getValue({name:"custrecord_advs_i_t_ret_adj_account"});

                setupDataVal[subType]["downpay"]   = result.getValue({name:"custrecord_advs_i_t_deposit"});
                setupDataVal[subType]["pickuppayment"]   = result.getValue({name:"custrecord_advs_i_t_pickup_payment"});

                setupDataVal[subType]["latefeeper"]   = result.getValue({name:"custrecord_advs_i_t_lae_fee"});
                setupDataVal[subType]["payoff"]         = result.getValue({name:"custrecord_advs_i_v_rent_item"});

                // log.debug("subType", subType);
                // log.debug("subType", subType +" ==> "+SubtypeText);

                return true;
            });
            return setupDataVal;
        }
        function CheckAnd(String) {
            if(String	!=	null && String	!=	undefined && String	!=	'' && String	!=	'null' && String	!=	'undefined' ){
                return 1;
            }else{
                return 0;
            }
        }

        function calcLeaseLines(scriptContext){
            var curRec  =   currentRecord.get();
            var newRec  =   scriptContext.newRecord;
            log.debug("newRec",newRec);
            var InterestRate    =   newRec.getValue("custrecord_advs_l_c_an_interest");
            var LoanAmount      =   newRec.getValue("custrecord_advs_l_c_loa_amnt_tot");
            var Start_date      =   newRec.getValue("custrecord_advs_lea_strt_dt");
            var per_installment =   newRec.getValue("custrecord_advs_l_c_sched_paym");
            var NoSched         =   newRec.getValue("custrecord_advs_l_c_schd_no_pay");
            var leaseId         =   newRec.getValue("custrecord_advs_lea_header_link");
            var adminFee        =   newRec.getValue("custrecord_advs_l_c_admin_fee");
            var ExtraPay         =0;

            var leaseFld    =   ["custrecord_advs_l_a_pay_st_date"];
            var LeaseRec            =   search.lookupFields({type:"customrecord_advs_lease_header",id:leaseId,columns:leaseFld});
            var Lease_date          =   LeaseRec["custrecord_advs_l_a_pay_st_date"];





            if(InterestRate){
                InterestRate	=	parseFloat(InterestRate);
                InterestRate	=	InterestRate*1;
            }

            var ActualInterest	=	InterestRate/100;
            ActualInterest		=	ActualInterest*1;
            ActualInterest		=	ActualInterest/12;
            ActualInterest		=	ActualInterest*1;
            var TempActualinterest	=	(ActualInterest*LoanAmount);

            var TotalSchedule	=	((LoanAmount+TempActualinterest)/per_installment);
            var Break_up	=	TotalSchedule*1;

            log.debug("ActualInterest",LoanAmount +"==>"+TempActualinterest+"=>"+per_installment);
            var mon_t	=	1;
            var days_t	=	"";

            var same	=	0;
            if(Lease_date==Start_date){
                same++;
            }

            var LeaseRegPay = per_installment * 1;
            var TempX = 0;
            var TempY = 0;
            var rec_s_id = "recmachcustrecord_advs_r_p_leas_chld";
            var RecCount = newRec.getLineCount({sublistId:rec_s_id});

            var isSublistRecord = newRec.getSublist({sublistId:rec_s_id});
            log.debug("isSublistRecord",isSublistRecord);



            for (var k = 0; k < RecCount; k++) {
                newRec.removeLine({sublistId:rec_s_id,line:0});
            }
            log.debug("ActualInterest",ActualInterest +"==>"+Break_up);

            var PrincipCumm	=	0;
            var interestCum	=	0;
            var beginingBalance	=	0;

            for(var d=1;d<=NoSched ;d++){
                if(d==1){
                    TempX+=LoanAmount;
                    beginingBalance	=	LoanAmount;
                }else{
//				beginingBalance	=	EndBalanceCum;
                }

                var totalPayment	=	LeaseRegPay;
                if(beginingBalance<=LeaseRegPay){
                    totalPayment	=	beginingBalance;
                }

                if(ExtraPay >0 && NoSched != d){
                    totalPayment	+=	ExtraPay;
                }else{
                    ExtraPay	=	0;
                }

                PrincipCumm			=	PrincipCumm*1;
                interestCum			=	interestCum*1;
                beginingBalance		=	beginingBalance*1;
                totalPayment		=	totalPayment*1;

                var Naration		=	d.toString();
                var Interest		=	(beginingBalance*ActualInterest);
                Interest			=	Interest*1;
                Interest			=	Interest.toFixed(2);
                Interest			=	Interest*1;

                var Principal		=	totalPayment-Interest;
                Principal			=	Principal*1;

                interestCum	= (interestCum+Interest);
                PrincipCumm	+= Principal;
                PrincipCumm		=	PrincipCumm*1;

                if(totalPayment == beginingBalance){
                    var EndingBalance	=	beginingBalance-totalPayment;


                }else{
                    var EndingBalance	=	beginingBalance-Principal;

                }

                log.debug("Interest",Interest +"==>"+interestCum+"=>"+ActualInterest+"=>"+Principal);

                newRec.insertLine({sublistId: rec_s_id, line: 0});


                if(d==1 ){
                    // newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_lm_lc_c_date",value:Start_date});
                    newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_date",line: 0,value: Start_date});
                    // curRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_lm_lc_c_date",value:Start_date});
                }else{
                    if(days_t!=''){



                        log.debug("Start_date",Start_date);
                        Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                        Start_date = addDaysToDate(Start_date, days_t);
                        Start_date  =   format.format({type:format.Type.DATE,value:Start_date});

                    }else if(mon_t!=''){
                        log.debug("Start_date_mon_t",Start_date);
                        // Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});

                        Start_date = addMonthsToDate(Start_date, mon_t);
                        log.debug("Start_date_mon_t@@@@",Start_date);
                        // Start_date  =   format.format({type:format.Type.DATE,value:Start_date});

                        Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                        log.debug("Start_date_mon_t3333",Start_date);
                    }else{

                    }
                    // newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_lm_lc_c_date",value:Start_date});
                    newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_date",line: 0,value: Start_date});
                }

                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_down_paying",line: 0,value: totalPayment});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_reg_pay_reg_int",line: 0,value: Interest});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_reg_pay_reg_prin",line: 0,value: Principal});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_cumulative_int",line: 0,value:interestCum});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_sche_pay",line: 0,value: LeaseRegPay});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_beg_bal",line: 0,value: beginingBalance});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_end_bal",line: 0,value: EndingBalance});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_extra_payments",line: 0,value: ExtraPay});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_narration",line: 0,value: d});
                newRec.setSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_link",line: 0,value: leaseId});



                /*newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_lm_lc_c_down_paying",value:totalPayment});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_reg_pay_reg_int",value:Interest});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_reg_pay_reg_prin",value:Principal});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_r_p_cumulative_int",value:interestCum});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_r_p_sche_pay",value:LeaseRegPay});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_r_p_beg_bal",value:beginingBalance});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_r_p_end_bal",value:EndingBalance});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_r_p_extra_payments",value:ExtraPay});
                newRec.setCurrentSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_lm_lc_c_narration",value:d});*/
                // newRec.commitLine({sublistId:rec_s_id});

                beginingBalance	=	EndingBalance;


                if(NoSched == d){
                    newRec.setValue({fieldId:"custrecord_advs_lea_end_dt",value:Start_date});

                    // nlapiSetFieldValue("custrecord_advs_r_h_end_date", Start_date);
                    // nlapiSetFieldValue("custrecord_advs_total_intrest_fa", interestCum);
                }
            }

        }
        function addDaysToDate(originalDate, daysToAdd) {
            // Convert the original date string to a JavaScript Date object
            var date = new Date(originalDate);

            // Add the specified number of days
            date.setDate(date.getDate() + daysToAdd);

            // Format the new date as 'MM/DD/YYYY'
            var newDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

            return newDate;
        }


        function addMonthsToDate(originalDate, monthsToAdd) {
            // Convert the original date string to a JavaScript Date object
            var date = new Date(originalDate);

            // Add the specified number of months
            date.setMonth(date.getMonth() + monthsToAdd);

            // Handle edge cases when the day of the new date exceeds the maximum day of that month
            // For example, adding 1 month to January 31 should result in February 28 or 29.
            // This logic ensures the day is adjusted accordingly.
            var newMonth = date.getMonth();
            date.setDate(Math.min(new Date(date.getFullYear(), newMonth + 1, 0).getDate(), date.getDate()));

            // Format the new date as 'MM/DD/YYYY'
            var newDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

            return newDate;
        }

        function clientcalcamount(loanAmount,annualIntere,PayPerYr,PayinYr){
            if (annualIntere) {
                annualIntere = parseFloat(annualIntere);
                annualIntere = annualIntere * 1;
            }

            var PeriodicValue = annualIntere / PayPerYr;
            PeriodicValue = PeriodicValue * 1;
            PeriodicValue = PeriodicValue / 100;
            PeriodicValue = PeriodicValue * 1;

            var LoanPeriodic = loanAmount * PeriodicValue;
            LoanPeriodic = LoanPeriodic * 1;
            LoanPeriodic = LoanPeriodic * 1;

            var totalNointPeriod = PayinYr * PayPerYr;
            var Pow1 = (PeriodicValue + 1);
            var Pow2 = (totalNointPeriod * -1);

            var PowerVal = Math.pow(Pow1, Pow2);
            PowerVal = PowerVal * 1;
            PowerVal = 1 - PowerVal;
            var TempSchedVal = (LoanPeriodic / PowerVal);
            var tempSchValNew = TempSchedVal;
            TempSchedVal = TempSchedVal * 1;
            TempSchedVal = TempSchedVal.toFixed(2);
            TempSchedVal = TempSchedVal * 1;

            var postObj = {};
            postObj.amount      = TempSchedVal;
            postObj.totalpayments = totalNointPeriod;

            return postObj;
        }
        function getLeaseStockLines(rentHead){
            var stockLines  =   [];
            var search_stck =  search.create({type:"customrecord_advs_lea_rental_child",
                filters:[
                    ["isinactive","is","F"]
                    ,"AND",
                    ["custrecord_advs_lea_header_link","anyof",rentHead]
                ],
                columns:[
                    search.createColumn({name:"internalid"}),
                    search.createColumn({name:"custrecord_advs_lea_vin_stk_stock"}),
                ]
            });
            search_stck.run().each(function(result){
                var id      =   result.getValue({name:"internalid"});
                var vinID   =   result.getValue({name:"custrecord_advs_lea_vin_stk_stock"});

                var obj =   {};
                obj.id      = id;
                obj.vinid   = vinID;

                stockLines.push(obj);
                return true;
            });

            return stockLines;
        }
        function findRemainingSched(leaseId){
            var outStanding = 0;var remainSche  =   0;
            var TotalRegularPaid    =   0;var totalContract=0;
            var remainSchedule  =   0;var invoicedSchedule=0;

            var searchRegular = search.create({
                type: "customrecord_advs_lm_lease_card_child",
                filters:
                    [
                        ["isinactive","is","F"],
                        "AND",
                        ["custrecord_advs_lm_lc_c_link","anyof",leaseId]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "COUNT",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_r_p_sche_pay",
                            summary: "SUM",
                            label: "Scheduled Payment"
                        }),
                        search.createColumn({
                            name: "formulacurrency1",
                            summary: "SUM",
                            formula: "CASE WHEN {custrecord_advs_r_p_invoice} is NULL THEN {custrecord_advs_r_p_sche_pay} WHEN {custrecord_advs_r_p_invoice} = ' ' THEN {custrecord_advs_r_p_sche_pay} ELSE 0 END",
                            label: "Formula (Currency)"
                        }),
                        search.createColumn({
                            name: "formulacurrency2",
                            summary: "SUM",
                            formula: "CASE WHEN {custrecord_advs_r_p_invoice} is NULL THEN 0 WHEN {custrecord_advs_r_p_invoice} = ' ' THEN 0 ELSE {custrecord_advs_r_p_sche_pay} END",
                            label: "Formula (Currency)"
                        }),
                        search.createColumn({
                            name: "formulanumeric1",
                            summary: "SUM",
                            formula: "CASE WHEN {custrecord_advs_r_p_invoice} is NULL THEN 1 WHEN {custrecord_advs_r_p_invoice} = ' ' THEN 1 ELSE 0 END",
                            label: "Remain Schedule"
                        }),
                        search.createColumn({
                            name: "formulanumeric2",
                            summary: "SUM",
                            formula: "CASE WHEN {custrecord_advs_r_p_invoice} is NULL THEN 0 WHEN {custrecord_advs_r_p_invoice} = ' ' THEN 0 ELSE 1 END",
                            label: "Invoiced Schedule"
                        })
                    ]
            });
            searchRegular.run().each(function(result){
                remainSche          =   result.getValue({name: "internalid",summary: "COUNT"});
                totalContract       =   result.getValue({name: "custrecord_advs_r_p_sche_pay",summary: "SUM"});
                outStanding         =   result.getValue({name: "formulacurrency1",summary: "SUM"});
                TotalRegularPaid    =   result.getValue({name: "formulacurrency2",summary: "SUM"});

                remainSchedule    =   result.getValue({name: "formulanumeric1",summary: "SUM"});
                invoicedSchedule    =   result.getValue({name: "formulanumeric2",summary: "SUM"});


                log.debug("totalContract",totalContract+"=>"+outStanding+"=>"+outStanding+"=>"+TotalRegularPaid);
                return true;
            });
            var postData = {};
            postData.remainingSchedule  = remainSche;
            postData.outstanding        = outStanding;
            postData.TotalRegularPaid   = TotalRegularPaid;
            postData.totalContract      = totalContract;

            postData.remainScheduleterm      = remainSchedule;
            postData.invoicedSchedule      = invoicedSchedule;
            log.debug("postData",postData);
            return postData;
        }

        function getDateDifference(date1, date2) {
            try {
                // Parse the input dates
                var parsedDate1 = format.parse({ value: date1, type: format.Type.DATE });
                var parsedDate2 = format.parse({ value: date2, type: format.Type.DATE });

                // Calculate the difference in milliseconds
                var differenceMs = parsedDate2.getTime() - parsedDate1.getTime();

                // Convert milliseconds to days
                var differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

                return differenceDays;
            } catch (e) {
                log.error({
                    title: 'Error Calculating Date Difference',
                    details: e
                });
                return null;
            }
        }

        function getToll_Dam_cpc(leaseId){

            var toll        =   0;
            var damage      =   0;
            var cpc         =   0;
            var UnpaidTollsSearch = search.create({
                type: "customrecord_advs_lease_header",
                filters:
                    [
                        ["internalid","anyof",leaseId],
                        "AND",
                        [["formulanumeric: CASE WHEN {custrecord_advs_lea_tol_parking_charge.custrecord_advs_lea_t_p_c_invoice} is NULL THEN 0 WHEN {custrecord_advs_lea_tol_parking_charge.custrecord_advs_lea_t_p_c_invoice} = ' ' THEN 0 ELSE {custrecord_advs_lea_tol_parking_charge.custrecord_advs_lea_t_p_c_amount} END","greaterthan","0"]
                            ,"OR",
                            ["formulanumeric: CASE WHEN {custrecord_advs_lea_d_f_lease_link.custrecord_advs_lea_d_f_invoice} is NULL THEN 0 WHEN {custrecord_advs_lea_d_f_lease_link.custrecord_advs_lea_d_f_invoice} = ' ' THEN 0 ELSE {custrecord_advs_lea_d_f_lease_link.custrecord_advs_lea_d_f_amount} END","greaterthan","0"]
                            ,"OR",
                            ["formulanumeric: CASE WHEN {custrecord_advs_cpc_lease.custrecord_advs_cpc_invoice} is NULL THEN 0 WHEN {custrecord_advs_cpc_lease.custrecord_advs_cpc_invoice} = ' ' THEN 0 ELSE {custrecord_advs_cpc_lease.custrecord_advs_cpc_amount} END","greaterthan","0"]]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "formulacurrency1",
                            summary: "SUM",
                            formula: "CASE WHEN {custrecord_advs_lea_tol_parking_charge.custrecord_advs_lea_t_p_c_invoice} is NULL THEN 0 WHEN {custrecord_advs_lea_tol_parking_charge.custrecord_advs_lea_t_p_c_invoice} = ' ' THEN 0 ELSE {custrecord_advs_lea_tol_parking_charge.custrecord_advs_lea_t_p_c_amount} END",
                            label: "Formula (Currency)"
                        }),
                        search.createColumn({
                            name: "formulacurrency2",
                            summary: "SUM",
                            formula: "SUM(CASE WHEN {custrecord_advs_lea_d_f_lease_link.custrecord_advs_lea_d_f_invoice} is NULL THEN 0 WHEN {custrecord_advs_lea_d_f_lease_link.custrecord_advs_lea_d_f_invoice} = ' ' THEN 0 ELSE {custrecord_advs_lea_d_f_lease_link.custrecord_advs_lea_d_f_amount} END)",
                            label: "Formula (Currency)"
                        }),
                        search.createColumn({
                            name: "formulacurrency3",
                            summary: "SUM",
                            formula: "CASE WHEN {custrecord_advs_cpc_lease.custrecord_advs_cpc_invoice} is NULL THEN 0 WHEN {custrecord_advs_cpc_lease.custrecord_advs_cpc_invoice} = ' ' THEN 0 ELSE {custrecord_advs_cpc_lease.custrecord_advs_cpc_amount} END",
                            label: "Formula (Currency)"
                        })
                    ]
            });
            UnpaidTollsSearch.run().each(function(result){
                toll    =   result.getValue({name:"formulacurrency1", summary: "SUM"});
                damage    =   result.getValue({name:"formulacurrency2", summary: "SUM"});
                cpc    =   result.getValue({name:"formulacurrency3", summary: "SUM"});
                return true;
            });

            var postTolls   =   {};
            postTolls.toll = toll;
            postTolls.damage = damage;
            postTolls.cpc = cpc;
            return postTolls;
        }

        function getunPaidAmount(leaseid){

            var amountREmain    =   0;
            var invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                        ["type","anyof","CustInvc"],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["custbody_advs_lease_head","anyof",leaseid]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custbody_advs_lease_head",
                            summary: "GROUP",
                            label: "Invoice Type"
                        }),
                        search.createColumn({
                            name: "amountremaining",
                            summary: "SUM",
                            label: "Amount Remaining"
                        }),
                        search.createColumn({
                            name: "formulacurrency",
                            summary: "SUM",
                            formula: "CASE WHEN {item.custitem_advs_inventory_type} = 'Other Charges' THEN {amount} ELSE 0 END",
                            label: "Formula (Currency)"
                        })
                    ]
            });
            var searchResultCount = invoiceSearchObj.runPaged().count;
            invoiceSearchObj.run().each(function(result){

                var amount =   result.getValue({name:"amountremaining",summary:"SUM"});
                var LeaseLink   =   result.getValue({name:"custbody_advs_lease_head",summary:"GROUP"});

                amountREmain    =   amount;

                return true;
            });
            var postData    =   {};
            postData.amountREmain = amountREmain;
            return postData;

        }

        function getFormMapping(formName){

            var formMappingSearch = search.create({
                type: 'customrecord_advs_form_mapping',
                filters: [
                    ['isinactive', 'is', 'F'],
                    'AND',
                    ['custrecord_advs_fm_record_ref', 'is', formName]
                ],
                columns: [
                    'name',
                    'custrecord_advs_fm_std_record_ref',
                    'custrecord_advs_fm_entry_form_id',
                ]
            });

            var postJob = [];
            formMappingSearch.run().each(function(result) {
                var recordType = result.getValue('custrecord_advs_fm_std_record_ref');
                var formID = result.getValue('custrecord_advs_fm_entry_form_id');

                var obj = {};
                obj.recordtype = recordType;
                obj.fromid = formID;
                postJob.push(obj);

                return true;
            });

            return postJob;
        }

        function createInvoice(obj, setupData, libUtil) {

            try{


                var invoiceBody = obj.invoicebody;
                var linesData = obj.linesData;

                log.debug("invoiceBody",invoiceBody)
               log.debug("linesData",linesData)
                log.debug("invoiceBody.leaseid",invoiceBody.leaseid)

                // Create invoice record
                var InvoiceRec = record.create({ type: "invoice", isDynamic: true });
                InvoiceRec.setText({ fieldId: "customform", text: "ADVS Lease Invoice" });
                InvoiceRec.setValue({ fieldId: "entity", value: invoiceBody.customer });
                InvoiceRec.setValue({ fieldId: "subsidiary", value: invoiceBody.subsidiary });
                InvoiceRec.setValue({ fieldId: "location", value: invoiceBody.location });
                InvoiceRec.setValue({ fieldId: "custbody_advs_lease_head", value: invoiceBody.leaseid });
                InvoiceRec.setValue({ fieldId: "custbody_advs_invoice_type", value: invoiceBody.invoicetype });
                InvoiceRec.setValue({ fieldId: "trandate", value: invoiceBody.date });

                if(invoiceBody.pickupd1!=''){
                    InvoiceRec.setValue({ fieldId: "custbody_advs_pickuip_paydte_1", value: invoiceBody.pickupd1 });
                }
                if(invoiceBody.pickupd12=''){
                    InvoiceRec.setValue({ fieldId: "custbody_advs_pickup_dte_2", value: invoiceBody.pickupd2 });
                }



                // Loop through linesData to add line items
                linesData.forEach(function (line) {
                    InvoiceRec.selectNewLine({ sublistId: "item" });
                    InvoiceRec.setCurrentSublistValue({ sublistId: "item", fieldId: "item", value: line.item });
                    InvoiceRec.setCurrentSublistValue({ sublistId: "item", fieldId: "quantity", value: line.quantity });
                    InvoiceRec.setCurrentSublistValue({ sublistId: "item", fieldId: "rate", value: line.rate });
                    InvoiceRec.setCurrentSublistValue({ sublistId: "item", fieldId: "description", value: line.description });
                    InvoiceRec.setCurrentSublistValue({ sublistId: "item", fieldId: "amount", value: line.amount });
                    InvoiceRec.setCurrentSublistValue({ sublistId: "item", fieldId: "custcol_advs_st_applied_to_vin", value: line.custcol_advs_st_applied_to_vin });
                    InvoiceRec.commitLine({ sublistId: "item" });
                });

                // Save invoice
                var invoiceID = InvoiceRec.save({ ignoreMandatoryFields: true, enableSourcing: true });
                return invoiceID;
            }catch(e){
                log.error("ERROR ON Invoice Creation.",e.message);
            }

        }

        function getinventoryAvailability(VinName,VinModel){
            var searchinv   =   search.create({
                type:"inventorynumber",
                filters:[
                    ["quantityavailable","greaterthan","0"],
                    "AND",
                    ["inventorynumber","is",VinName],
                    "AND",
                    ["item","anyof",VinModel]
                ],
                columns:["internalid","location"]
            });
            var invenID ="";var invLoc ="";
            searchinv.run().each(function(rec){
                invenID =   rec.getValue("internalid");
                invLoc =   rec.getValue("location");

                return true;
            });

            var postObj = {};
            postObj.inventorynumber = invenID;
            postObj.location = invLoc;

            return postObj;
        }

        function getinventorycost(VinName,VinModel,VinAccount,invLoc){
            var search_vc = search.create({
                type: "transaction",
                filters:
                    [
                        ["posting","is","T"],
                        "AND",
                        ["serialnumber","isnotempty",""],
                        "AND",
                        ["item.custitem_advs_inventory_type","anyof","1"]
                        ,"AND",
                        ["account","anyof","1256","1257"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "item",
                            summary: "GROUP",
                            label: "Item"
                        }),
                        search.createColumn({
                            name: "subsidiary",
                            summary: "GROUP",
                            label: "Subsidiary"
                        }),
                        search.createColumn({
                            name: "location",
                            summary: "GROUP",
                            label: "Accounting Location"
                        }),
                        search.createColumn({
                            name: "serialnumber",
                            summary: "GROUP",
                            label: "Transaction Serial/Lot Number"
                        }),
                        search.createColumn({
                            name: "trandate",
                            summary: "MAX",
                            label: "Date"
                        }),
                        search.createColumn({
                            name: "formulacurrency",
                            summary: "SUM",
                            formula: "{serialnumbercost}-({serialnumbercost}-{amount})",
                            label: "Base Cost"
                        }),
                        search.createColumn({
                            name: "formulacurrency",
                            summary: "SUM",
                            formula: "{serialnumbercost}-{amount}",
                            label: "Additional Cost"
                        }),
                        search.createColumn({
                            name: "serialnumbercost",
                            summary: "SUM",
                            label: "Transaction Serial/Lot Number Amount"
                        })
                    ]
            });
            search_vc.filters = [
                search.createFilter({
                    name:"serialnumber",
                    operator:search.Operator.IS,
                    values:VinName
                }),
                search.createFilter({
                    name:"item",
                    operator:search.Operator.IS,
                    values:VinModel
                }),
                search.createFilter({
                    name:"account",
                    operator:search.Operator.IS,
                    values:VinAccount
                }),
                search.createFilter({
                    name:"location",
                    operator:search.Operator.IS,
                    values:invLoc
                }),
            ]
            var vinCost  =   0;var LastTranDate  =   "";
            var columns =   search_vc.columns;
            search_vc.run().each(function(recVin){
                vinCost =   recVin.getValue(columns[7]);
                LastTranDate =   recVin.getValue(columns[4]);
                return true;
            });

            var postObj = {};
            postObj.vehiclecost = vinCost;
            postObj.lasttrandate = LastTranDate;

            return postObj;
        }

        function createInventoryAdjustment(obj) {
            log.debug("obj",obj);

            try{

                var invoiceBody = obj.body;
                var linesData = obj.lines;


                log.debug("invoiceBody",invoiceBody);
                log.debug("linesData",linesData);

                log.debug("linesData",linesData.item);

                var invRec = record.create({
                    type: "inventoryadjustment",
                    isDynamic: true,
                });

                // log.debug('values', subsi + "->" + Account + "->" + LocID);
                invRec.setValue({fieldId: "subsidiary", value: invoiceBody.subsidiary});
                invRec.setValue({fieldId: "account", value: invoiceBody.account});
                invRec.setValue({fieldId: "trandate", value: invoiceBody.trandate});
                invRec.setValue({fieldId: "adjlocation", value: invoiceBody.location});
                if(invoiceBody.memo){
                    invRec.setValue({fieldId: "memo", value: invoiceBody.memo});
                }

                invRec.setValue({fieldId: "custbody_advs_st_vin_invoice", value: invoiceBody.vinid});
                invRec.setValue({fieldId: "custbody_advs_cust_track_id", value: invoiceBody.entityid});

                // Loop through linesData to add line items
                linesData.forEach(function (line) {
                    log.debug("Processing line item", line);

                    invRec.selectNewLine({ sublistId: "inventory" });
                    invRec.setCurrentSublistValue({ sublistId: "inventory", fieldId: "item", value: line.item });
                    invRec.setCurrentSublistValue({ sublistId: "inventory", fieldId: "adjustqtyby", value: Number(line.quantity) });
                    invRec.setCurrentSublistValue({ sublistId: "inventory", fieldId: "location", value: line.location });
                    invRec.setCurrentSublistValue({ sublistId: "inventory", fieldId: "custcol_advs_st_equipment_link", value: line.vinid });
                    if(line.vinsegment){
                        invRec.setCurrentSublistValue({
                            sublistId: "inventory",
                            fieldId: "cseg_advs_st_vin_se",
                            value: line.vinsegment
                        });
                    }
                    if(line.stocksegment){
                        invRec.setCurrentSublistValue({
                            sublistId: "inventory",
                            fieldId: "cseg_stock_num_seg_",
                            value: line.stocksegment
                        });
                    }

                    // Handle inventory number if present
                    if (line.inventorynumber) {
                        var invDetail = invRec.getCurrentSublistSubrecord({
                            sublistId: 'inventory',
                            fieldId: 'inventorydetail'
                        });
                        invDetail.selectNewLine({ sublistId: 'inventoryassignment' });
                        invDetail.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'issueinventorynumber',
                            value: line.inventorynumber
                        });
                        invDetail.commitLine({ sublistId: 'inventoryassignment' });
                    }

                    invRec.commitLine({ sublistId: 'inventory' });
                });

                var recordId = invRec.save({
                    enableSourcing:true,
                    ignoreMandatoryFields: true
                });

                return recordId;

            }catch(e){
                log.error("ERROR ON Adjustment Posting.",e.message);
            }
        }

        function createInventoryAdjustmentpositive(obj) {
            log.debug("obj",obj);

            try{

                var invoiceBody = obj.body;
                var linesData = obj.lines;

                var invRec = record.create({
                    type: "inventoryadjustment",
                    isDynamic: true,
                });

                // log.debug('values', subsi + "->" + Account + "->" + LocID);
                invRec.setValue({fieldId: "subsidiary", value: invoiceBody.subsidiary});
                invRec.setValue({fieldId: "account", value: invoiceBody.account});
                invRec.setValue({fieldId: "trandate", value: invoiceBody.trandate});
                invRec.setValue({fieldId: "adjlocation", value: invoiceBody.location});
                if(invoiceBody.memo){
                    invRec.setValue({fieldId: "memo", value: invoiceBody.memo});
                }

                invRec.setValue({fieldId: "custbody_advs_st_vin_invoice", value: invoiceBody.vinid});
                invRec.setValue({fieldId: "custbody_advs_cust_track_id", value: invoiceBody.entityid});

                // Loop through linesData to add line items
                linesData.forEach(function (line) {
                    log.debug("Processing line item", line);

                    invRec.selectNewLine({ sublistId: "inventory" });
                    invRec.setCurrentSublistValue({ sublistId: "inventory", fieldId: "item", value: line.item });
                    invRec.setCurrentSublistValue({ sublistId: "inventory", fieldId: "adjustqtyby", value: Number(line.quantity) });
                    invRec.setCurrentSublistValue({ sublistId: "inventory", fieldId: "location", value: line.location });
                    invRec.setCurrentSublistValue({ sublistId: "inventory", fieldId: "unitcost", value: line.amount });

                    invRec.setCurrentSublistValue({ sublistId: "inventory", fieldId: "custcol_advs_st_equipment_link", value: line.vinid });
                    if(line.vinsegment){
                        invRec.setCurrentSublistValue({
                            sublistId: "inventory",
                            fieldId: "cseg_advs_st_vin_se",
                            value: line.vinsegment
                        });
                    }
                    if(line.stocksegment){
                        invRec.setCurrentSublistValue({
                            sublistId: "inventory",
                            fieldId: "cseg_stock_num_seg_",
                            value: line.stocksegment
                        });
                    }

                    // Handle inventory number if present
                    if (line.inventorynumber) {
                        var invDetail = invRec.getCurrentSublistSubrecord({
                            sublistId: 'inventory',
                            fieldId: 'inventorydetail'
                        });
                        invDetail.selectNewLine({ sublistId: 'inventoryassignment' });
                        invDetail.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'receiptinventorynumber',
                            value: line.inventorynumber
                        });
                        invDetail.commitLine({ sublistId: 'inventoryassignment' });
                    }

                    invRec.commitLine({ sublistId: 'inventory' });
                });

                var adjustid = invRec.save({
                    enableSourcing:true,
                    ignoreMandatoryFields: true
                });
                log.debug("adjustid@@@",adjustid)


                return adjustid;

            }catch(e){
                log.error("ERROR ON Adjustment Posting.",e.message);
            }
        }
        function generateAssetValuesFromProposal(dataObj){
            // const assetSubsidiary = subsi;
            // const assetType = assetType;
            // const assetDesc = vinName || 'Auto Generated Asset';
            // const assetLifetime = assetLifeTime || 0;
            // const assetDeprPeriod = propRec.getValue('custrecord_propdeprperiod');
            // const assetDeprActive = propRec.getValue('custrecord_propdepractive');
            // const assetQty = propRec.getValue('custrecord_propquantity') || 1;
            // const propSrcTran = propRec.getValue('custrecord_propsourceid');
            // const currId = utilCurrency.getApplicableCurrency(assetSubsidiary);
            //
            // const childPropCost = this.getChildProposalCost(propRec.getId());
            const assetCost = dataObj.purchasecost;
            const assetRV = dataObj.currentvalue;
            const assetRVPerc = Math.round((assetRV / assetCost) * 100);

            const assetFieldValues = {
                altname                             : dataObj.name,
                custrecord_assettype                : dataObj.assettype,
                custrecord_assetaccmethod           : dataObj.depreciationmethod,
                // custrecord_assetresidualperc        : assetRVPerc,
                custrecord_assetresidualvalue       : dataObj.residual,
                custrecord_assetlifetime            : dataObj.assetlifetime || 0,
                custrecord_assetsubsidiary            : dataObj.subsidiaries,
                custrecord_assetlocation            : dataObj.location,
                custrecord_assetdepractive          : dataObj.depreciationactive,
                custrecord_ncfar_quantity           : 1,
                // custrecord_asset_propid             : propRec.getId(),
                custrecord_assetsourcetrn           : dataObj.tranid,
                custrecord_assetsourcetrnline       : 0,
                custrecord_assetinclreports         : dataObj.includereport,
                custrecord_assetrevisionrules       : dataObj.revisionrules,
                custrecord_assetdeprrules           : dataObj.depreciationrules,
                custrecord_assetdepartment          : dataObj.department,
                custrecord_assetserialno          : dataObj.name,
                custrecord_assetdeprstartdate          : dataObj.depreciationdate,



                // custrecord_assetdeprperiod          : assetDeprPeriod,
                // custrecord_assetcaretaker           : propRec.getValue('custrecord_propcaretaker'),
                // custrecord_assetsupplier            : propRec.getValue('custrecord_propsupplier'),
                // custrecord_assetdisposalitem        : propRec.getValue('custrecord_propdisposalitem'),
                // custrecord_assetmainacc             : propRec.getValue('custrecord_propmainacc'),
                // custrecord_assetdepracc             : propRec.getValue('custrecord_propdepracc'),
                // custrecord_assetdeprchargeacc       : propRec.getValue('custrecord_propdeprchargeacc'),
                // custrecord_assetwriteoffacc         : propRec.getValue('custrecord_propwriteoffacc'),
                // custrecord_assetwritedownacc        : propRec.getValue('custrecord_propwritedownacc'),
                // custrecord_assetdisposalacc         : propRec.getValue('custrecord_propdisposalacc'),
                // custrecord_assetmaintneedsinsp      : propRec.getValue('custrecord_propneedsinsp'),
                // custrecord_assetmaintinspinterval   : propRec.getValue('custrecord_propinspinterval'),
                // custrecord_assetmaintwarranty       : propRec.getValue('custrecord_propwarranty'),
                // custrecord_assetmaintwarrantyperiod : propRec.getValue('custrecord_propwarrantyperiod'),
                // custrecord_assetfinancialyear       : propRec.getValue('custrecord_propfinancialyear'),
                custrecord_assetcost                : dataObj.purchasecost,
                custrecord_assetcurrentcost         : dataObj.currentvalue,
                custrecord_assetbookvalue           : dataObj.currentvalue,
                custrecord_assetdescr               : dataObj.name,
                // custrecord_assetpurchaseorder       : propRec.getValue('custrecord_proppurchaseorder'),
                custrecord_assetpurchasedate        : dataObj.podate,
                // custrecord_assetsupplier            : propRec.getValue('custrecord_propsupplier'),
                // custrecord_storedeprhist            : true
                custrecord_vin:dataObj.vinid,
                custrecord_advs_fam_lease_link:dataObj.leaseId
            };

            return {
                assetFieldValues: assetFieldValues,
            };
        }
        function disposefam(famid,location){

            var today   =   new Date();
            var todaytime= today.getTime();
			 
			 var tranDate = format.parse({
                            value: new Date(),
                            type: format.Type.DATE
                        });
						
            var rec = record.load({
                type: "customrecord_ncfar_asset",
                id: famid
            });
			var subsId = rec.getValue({fieldId:'custrecord_assetsubsidiary'});
			var writeoffacount = rec.getValue({fieldId:'custrecord_assetwriteoffacc'});
			var Location = rec.getValue({fieldId:'custrecord_assetlocation'});
			var vinID = rec.getValue({fieldId:'custrecord_vin'});
			var VinModel = rec.getValue({fieldId:'custrecord_vin'});
			var bookValue = rec.getValue({fieldId:'custrecord_assetbookvalue'});
			var customer = '';//objRecord.getValue({fieldId:'custrecord_vin'});
			var Memo ='Returning Vehicle';  
            // Set new values
            rec.setValue({
                fieldId: 'custrecord_assetdisposaldate',
                value: new Date() // Ensure the format is a Date object
            });
            rec.setValue({
                fieldId: 'custrecord_assetdisposaltype',
                value: 2
            });
            rec.setValue({
                fieldId: 'custrecord_assetstatus',
                value: 4
            });

            // Save the record
            rec.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });
			 var vinSeg = "";
             var stockSeg = "";
			 var VinModel ='';
			if(vinID){
				var lookFld = ["custrecord_advs_vm_subsidary", "name", "cseg_advs_st_vin_se",
                            "cseg_advs_sto_num", "custrecord_advs_vm_last_direct_cost",
                            "custrecord_advs_vm_purchase_invoice_date", "custrecord_advs_vm_model", "custrecord_advs_vm_model.assetaccount"]

                        var lookRec = search.lookupFields({
                            type: "customrecord_advs_vm",
                            id: vinID,
                            columns: lookFld
                        });
                        var aDJaCC = "";

                       VinModel  = lookRec["custrecord_advs_vm_model"][0].value;
                        var subsi = lookRec["custrecord_advs_vm_subsidary"][0].value;

                       
                        if (lookRec['cseg_advs_st_vin_se'] != null && lookRec['cseg_advs_st_vin_se'] != undefined) {
                            vinSeg = lookRec["cseg_advs_st_vin_se"][0].value || "";
                        }
                        if (lookRec['cseg_advs_sto_num'] != null && lookRec['cseg_advs_sto_num'] != undefined) {
                            stockSeg = lookRec["cseg_advs_sto_num"][0].value || "";
                        }
						var vinName = lookRec["name"];
			}
			
			// var bookValue = getvehicleCurrentValue1(famid);
			
            var famprocessRec   =   record.create({
                type:"customrecord_fam_process"
            });
            var jsonobj = {}; // Initialize an empty object
            jsonobj.prmt = 4; // Add the "prmt" property
            jsonobj.recsToProc = {}; // Add the "recsToProc" property as an empty object
            // Add properties to "recsToProc"
            jsonobj.recsToProc[famid] = {
                date: todaytime,
                type: 2,
                qty: "1",
                loc:location
            };

            famprocessRec.setValue("custrecord_fam_procid","disposal");
            famprocessRec.setValue("custrecord_fam_procparams",JSON.stringify(jsonobj));
            var processid  =      famprocessRec.save({
                enableSourcing:true,
                ignoreMandatoryFields:true
            });
			
			if(processid)
			{
				//CREATE INVENTORY ADJUSTMENT
				var adj_obj = {
                            body: {
                                subsidiary: subsId,
                                account: writeoffacount,
                                trandate: tranDate,
                                location: Location,
                                adjlocation: Location,
                                memo: Memo,
                                vinid: vinID,
                                entityid: customer,
                            },
                            lines: [
                                {
                                    item: VinModel,
                                    quantity: "1",
                                    rate: 0,
                                    description: "FAM Disposal",
                                    vinid: vinID,
                                    location: Location,
                                    vinsegment: vinSeg,
                                    stocksegment: stockSeg,
                                    inventorynumber: vinName,
                                    amount: bookValue,
                                }
                            ]
                        };
				var disposalIAId = createInventoryAdjustmentpositive(adj_obj);
				if(disposalIAId)
				{
					record.submitFields({type:'customrecord_ncfar_asset',id:famid,values:{custrecord_advs_disposal_ia:disposalIAId},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
					record.submitFields({type:'customrecord_advs_vm',id:vinID,values:{custrecord_advs_t_tinv_type:1},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
				
				}
				var famlookobj = search.lookupFields({type:'customrecord_ncfar_asset',id:famid,columns:
									[
									'custrecord_assetcost','custrecord_advs_fam_lease_link',
									'custrecord_vin','custrecord_assetsourcetrn',
									'custrecord_advs_disposal_ia','custrecord_assetstatus'
									]});
									var originalcost = famlookobj["custrecord_assetcost"]; 
									var leaseid = famlookobj["custrecord_advs_fam_lease_link"][0].value; 
									var vin = famlookobj["custrecord_vin"][0].value; 
									var  ia2 ='';
									var  ia1 ='';
									var  status ='';
                        if (famlookobj['custrecord_assetsourcetrn'] != null && famlookobj['custrecord_assetsourcetrn'] != undefined) {
                             ia1 = famlookobj["custrecord_assetsourcetrn"][0].value || "";
                        }
						if (famlookobj['custrecord_advs_disposal_ia'] != null && famlookobj['custrecord_advs_disposal_ia'] != undefined) {
                            ia2 = famlookobj["custrecord_advs_disposal_ia"][0].value || "";
                        }
						if (famlookobj['custrecord_assetstatus'] != null && famlookobj['custrecord_assetstatus'] != undefined) {
                            status = famlookobj["custrecord_assetstatus"][0].text || "";
                        }
								var truckfamobj = {};
								truckfamobj.famid = famid;
								truckfamobj.originalcost = originalcost;
								truckfamobj.status = status;
								truckfamobj.leaseid = leaseid;
								truckfamobj.ia1 = ia1;
								truckfamobj.ia2 = ia2;
								truckfamobj.vin = vin;
								log.debug('truckfamobj',truckfamobj);
				FAMHistoryOnCURD(truckfamobj);
			}
            var mrTask = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: 'customscript_fam_disposeasset_mr', // Update with your Map/Reduce script ID
                deploymentId: 'customdeploy_fam_disposeasset_mr', // Update with your Map/Reduce deployment ID
                params: {
                    'custscript_dispose_procid': processid,
                }
            });
            var taskId = mrTask.submit();
			
            var postObj = {};
            postObj.processid = processid;
            postObj.taskid = taskId;

            // var postObj = {};
            //           postObj.processid = 1;
            //           postObj.taskid = 2;

            return postObj;
        }
		function getvehicleCurrentValue1(famid){
            var customrecord_ncfar_deprhistorySearchObj = search.create({
                type: "customrecord_ncfar_deprhistory",
                filters:
                    [
                        ["custrecord_deprhistasset","anyof",famid],
                        "AND",
                        ["custrecord_deprhisttype","anyof","2","7"],
                        "AND",
                        ["custrecord_deprhistcurrentage","equalto","0"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_deprhistamount",
                            summary: "SUM",
                            label: "Transaction Amount"
                        })
                    ]
            });
            var vehicleCurrentValue = 0;
            customrecord_ncfar_deprhistorySearchObj.run().each(function(result){
                vehicleCurrentValue = result.getValue({name: "custrecord_deprhistamount",
                    summary: "SUM"})
                return true;
            });
            return vehicleCurrentValue;
        }
        function disposeSaleFam(famid,location,CustomerId){

            var today   =   new Date();
            var todaytime= today.getTime();


            var rec = record.load({
                type: "customrecord_ncfar_asset",
                id: famid
            });

            // Set new values
            rec.setValue({
                fieldId: 'custrecord_assetdisposaldate',
                value: new Date() // Ensure the format is a Date object
            });
            rec.setValue({
                fieldId: 'custrecord_assetdisposaltype',
                value: 2
            });
            rec.setValue({
                fieldId: 'custrecord_assetstatus',
                value: 4
            });
            rec.setValue({
                fieldId: 'custrecord_assetdisposalitem',
                value: 24
            });
            rec.setValue({
                fieldId: 'custrecord_assetsalecustomer',
                value: CustomerId
            });
            rec.setValue({
                fieldId: 'custrecord_assetsaleamount',
                value: 20000
            });
            // Save the record
            rec.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });

            var SaleAmount = '20000';
            var famprocessRec   =   record.create({
                type:"customrecord_fam_process"
            });
            var jsonobj = {}; // Initialize an empty object
            jsonobj.prmt = 4; // Add the "prmt" property
            jsonobj.recsToProc = {}; // Add the "recsToProc" property as an empty object
            // Add properties to "recsToProc"
            jsonobj.recsToProc[famid] = {
                date: todaytime,
                type: 1,
                qty: "1",
                item: "24", // Fuel Surcharges
                cust: CustomerId,
                amt: SaleAmount,
                loc:location,
            };
            log.debug('jsonobj',jsonobj);
            famprocessRec.setValue("custrecord_fam_procid","disposal");
            famprocessRec.setValue("custrecord_fam_procparams",JSON.stringify(jsonobj));
            var processid  =      famprocessRec.save({
                enableSourcing:true,
                ignoreMandatoryFields:true
            });
            var mrTask = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: 'customscript_fam_disposeasset_mr', // Update with your Map/Reduce script ID
                deploymentId: 'customdeploy_fam_disposeasset_mr', // Update with your Map/Reduce deployment ID
                params: {
                    'custscript_dispose_procid': processid,
                }
            });
            var taskId = mrTask.submit();

            var postObj = {};
            postObj.processid = processid;
            postObj.taskid = taskId;

            return postObj;
        }
        function postforProcessFAM(dataobj){

            var recobj  =   record.create({type:"customrecord_advs_fam_temp_record"});
            recobj.setValue("custrecord_advs_fam_t_r_lease",dataobj.leaseid);
            recobj.setValue("custrecord_advs_fam_temp_rec",dataobj.fam);
            recobj.setValue("custrecord_advs_fam_process_link",dataobj.famprocessid);
            recobj.setValue("custrecord_advs_fam_temp_otherchrge",dataobj.othercharges);
            recobj.setValue("custrecord_advs_fam_temp_record",dataobj.famtaskid);
            recobj.setValue("custrecord_advs_fam_t_r_param",JSON.stringify(dataobj));


            var tempID    =     recobj.save({
                ignoreMandatoryFields:true,
                enableSourcing:true
            });

            return tempID;

        }
		function FAMHistoryOnCURD(dataobj){

            var recobj  =   record.create({type:"customrecord_advs_fam_history"});
            recobj.setValue("custrecord_fam_name",dataobj.famid);
            recobj.setValue("custrecord_fam_asset_originial_cost",dataobj.originalcost);
            recobj.setValue("custrecord_fam_asset_status",dataobj.status);
            recobj.setValue("custrecord_fam_lease",dataobj.leaseid);
            recobj.setValue("custrecord_fam_initial_adjustment",dataobj.ia1);
            recobj.setValue("custrecord_fam_return_adjustment",dataobj.ia2);
            recobj.setValue("custrecord_fam_vin_master",dataobj.vin);


            var tempID    =     recobj.save({
                ignoreMandatoryFields:true,
                enableSourcing:true
            });

            return tempID;

        }
        return {vehiclesList,
            RentalCustomerRate,
            vehiclesListLease,
            createREgularLines,
            calculateInvLines,
            createREgularLinesLoan,
            calcStockLines,
            invoiceTypeSearch,
            calcLeaseLines,
            clientcalcamount,
            createREgularLinesFlexi,
            getLeaseStockLines,
            generateRegularLines,
            addMonthsToDate,
            addDaysToDate,
            findRemainingSched,
            getDateDifference,
            getToll_Dam_cpc,
            getunPaidAmount,
            getFormMapping,
            getinventoryAvailability,
            getinventorycost,
            createInvoice,
            createInventoryAdjustment,
            generateAssetValuesFromProposal,
            disposefam,
            disposeSaleFam,
            postforProcessFAM,
            createInventoryAdjustmentpositive,
			getvehicleCurrentValue1,
			FAMHistoryOnCURD

        }

    });
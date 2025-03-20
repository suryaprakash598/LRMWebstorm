/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search','N/ui/serverWidget','N/url','N/redirect','N/format','./advs_lib_rental_leasing','./advs_lib_util'],

    (record, runtime, search,serverWidget,url,redirect,format,liblease,libutil) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            var request =   scriptContext.request;
            var response =   scriptContext.response;

            if(request.method == "GET") {
                var recid = request.parameters.recordid;

                var form    =   serverWidget.createForm({title:"Modify"});

                var leaseFld    =   form.addField({id:"custpage_lease_fld",type:serverWidget.FieldType.SELECT,source:"customrecord_advs_lease_header",label:"Lease #"});
                leaseFld.defaultValue = recid;

                var totalamntFld    =   form.addField({id:"custpage_ttl_cnt_amnt",
                    type:serverWidget.FieldType.CURRENCY,label:"Total Contract Amount"});
                var depositFld    =   form.addField({id:"custpage_depo_fld",
                    type:serverWidget.FieldType.CURRENCY,label:"Deposit"});
                var TotalREgulatCole    =   form.addField({id:"custpage_ttl_reg_col",
                    type:serverWidget.FieldType.CURRENCY,label:"Total Regular Collected"});
                var total_depo_regFld    =   form.addField({id:"custpage_ttl_reg_col_depo",
                    type:serverWidget.FieldType.CURRENCY,label:"Total Deposit+Regular"});
                var outstandFld    =   form.addField({id:"custpage_remain_oustanding",
                    type:serverWidget.FieldType.CURRENCY,label:"Remaining Outstanding"});

                var reviseamntFld    =   form.addField({id:"custpage_revised_amount",
                    type:serverWidget.FieldType.CURRENCY,label:"Revised Outstanding"});
                reviseamntFld.isMandatory =true;

                var revisedTermsFld    =   form.addField({id:"custpage_revised_terms",
                    type:serverWidget.FieldType.INTEGER,label:"Revised Terms"});
                revisedTermsFld.updateDisplayType({displayType:"disabled"});


                totalamntFld.updateDisplayType({displayType:"inline"});
                depositFld.updateDisplayType({displayType:"inline"});
                TotalREgulatCole.updateDisplayType({displayType:"inline"});
                total_depo_regFld.updateDisplayType({displayType:"inline"});
                leaseFld.updateDisplayType({displayType:"inline"});
                outstandFld.updateDisplayType({displayType:"inline"});


                var getRemainginSche        =   liblease.findRemainingSched(recid);
                var remingingSchedule   =   getRemainginSche.remainingSchedule;
                var outstanding         =   getRemainginSche.outstanding;
                var TotalRegularPaid    =   getRemainginSche.TotalRegularPaid;
                var totalContract       =   getRemainginSche.totalContract;

                outstanding = outstanding*1;TotalRegularPaid = TotalRegularPaid*1;totalContract = totalContract*1;


                var searchLook  =   search.lookupFields({type:"customrecord_advs_lease_header",
                    id:recid,columns:["custrecord_advs_l_a_outstand_sche","custrecord_advs_l_h_depo_ince"]});

                var depositAmnt =   searchLook.custrecord_advs_l_h_depo_ince;
                depositAmnt     =   depositAmnt*1;

                var DepPlusReg  =   (totalContract+depositAmnt);


                depositFld.defaultValue = depositAmnt;
                outstandFld.defaultValue = outstanding;
                totalamntFld.defaultValue = totalContract;
                TotalREgulatCole.defaultValue = TotalRegularPaid;
                total_depo_regFld.defaultValue = DepPlusReg;


                form.clientScriptModulePath = "./advs_cs_modify_schedules_fr_miles.js";
                form.addSubmitButton({label:"submit"});
                response.writePage(form);
            }else{
                var leaseId     =   request.parameters.custpage_lease_fld;
                var revisedamnt =   request.parameters.custpage_revised_amount;
                var terms       =   request.parameters.custpage_revised_terms;

                terms   =   terms*1;
                revisedamnt =   revisedamnt*1;

                var newRec  =   record.load({type:"customrecord_advs_lease_header",id:leaseId,isDynamic:true});
                var Start_date					                =	newRec.getValue("custrecord_advs_l_h_lst_inv_date");
                var frequency					                =	newRec.getValue("custrecord_advs_l_h_frequency");


                var rec_s_id	=	"recmachcustrecord_advs_lm_lc_c_link";
                var RegularLineCount    =   newRec.getLineCount({sublistId:rec_s_id});
                for(var k=RegularLineCount-1;k>=0;k--){
                    var invoiceId   =   newRec.getSublistValue({sublistId:rec_s_id,fieldId:"custrecord_advs_r_p_invoice",line:k});
                   if(invoiceId) {

                   }else{
                       newRec.removeLine({sublistId: rec_s_id, line: k});
                   }
                }
                var RegularLineCount    =   newRec.getLineCount({sublistId:rec_s_id});

                var dd      =   RegularLineCount;
                dd++;
                var tempTotal   =   0;
                for(var d=1;d<=terms ;d++){
                    if(frequency == libutil.frequency.weekly){
                        // Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                        Start_date = liblease.addDaysToDate(Start_date, 7);

                        Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                    }else if(frequency == libutil.frequency.monthly){
                        // Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                        Start_date = liblease.addMonthsToDate(Start_date, 1);
                        Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                    }else{
                        Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                        Start_date = liblease.addMonthsToDate(Start_date, 1);
                        Start_date  =   format.parse({type:format.Type.DATE,value:Start_date});
                    }

                    tempTotal+=revisedamnt;
                    newRec.selectNewLine({sublistId: rec_s_id, line: 0});
                    newRec.setCurrentSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_date",value: Start_date});
                    newRec.setCurrentSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_sche_pay",value: revisedamnt});
                    newRec.setCurrentSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_down_paying",value: revisedamnt});
                    newRec.setCurrentSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_r_p_end_bal",value: tempTotal});
                    newRec.setCurrentSublistValue({sublistId: rec_s_id,fieldId: "custrecord_advs_lm_lc_c_narration",value: dd});
                    newRec.commitLine({sublistId:rec_s_id});


                    if(d == terms) {
                        newRec.setValue({fieldId: "custrecord_advs_l_h_end_date", value: Start_date});
                    }
                    
                    dd++;
                }
                newRec.save({enableSourcing:true,ignoreMandatoryFields:true});



                var getRemainginSche        =   liblease.findRemainingSched(leaseId);
                var remainScheduleterm   =   getRemainginSche.remainScheduleterm;
                var invoicedSchedule   =   getRemainginSche.invoicedSchedule;
                var remainingSchedule   =   getRemainginSche.remainingSchedule;

                var headerrec	=	record.load({type:"customrecord_advs_lease_header", id:leaseId,isDynamic:true});
                headerrec.setValue({fieldId:"custrecord_advs_l_a_remaing_schedule",value:remainScheduleterm});
                headerrec.setValue({fieldId:"custrecord_advs_l_a_remaing_schedule",value:remainingSchedule});
                headerrec.save({enableSourcing:true,ignoreMandatoryFields:true});

                var onclickScript=" <html><body> <script type='text/javascript'>" +
                    "try{" +
                    "";
                onclickScript+="window.parent.location.reload();";
               onclickScript+="window.parent.closePopup();";
                onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";

                response.write(onclickScript);
            }
        }

     /*   function findRemainingSched(leaseId){
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
        }*/

        return {onRequest}

    });

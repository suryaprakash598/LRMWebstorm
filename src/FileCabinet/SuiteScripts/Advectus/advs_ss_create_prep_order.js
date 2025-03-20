/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, runtime, search, serverWidget) => {
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
                var vinID       = request.parameters.vinid;
                var templateID  = request.parameters.prepid;
                var form = serverWidget.createForm({title: "Staging"});
                var vinFldObj   =   form.addField({
                    id:"custpage_vin",
                    type:serverWidget.FieldType.SELECT,
                    label:"Vin #",
                    source:"customrecord_advs_vm"
                });
                vinFldObj.defaultValue = vinID;
                vinFldObj.updateDisplayType({displayType:"hidden"});

                var prepFldObj   =   form.addField({
                    id:"custpage_tempid",
                    type:serverWidget.FieldType.SELECT,
                    label:"Prep #",
                    source:"customrecord_advs_vehicle_prep"
                });
                prepFldObj.defaultValue = templateID;
                prepFldObj.updateDisplayType({displayType:"hidden"});

                var vinFld  =   ["custrecord_advs_vm_model","custrecord_advs_vm_location_code"];
                var vinSearch   =   search.lookupFields({type:"customrecord_advs_vm",id:vinID,columns:vinFld});
                var modelId     =   vinSearch["custrecord_advs_vm_model"][0].value || "";
                var locid     =   vinSearch["custrecord_advs_vm_location_code"][0].value || "";

                var locFldObj   =   form.addField({
                    id:"custpage_locfld",
                    type:serverWidget.FieldType.SELECT,
                    label:"Location #",
                    source:"location"
                });
                locFldObj.defaultValue = locid;
                locFldObj.isMandatory = true;

                var remarkFldObj   =   form.addField({
                    id:"custpage_remark",
                    type:serverWidget.FieldType.TEXTAREA,
                    label:"Remark"
                });
                remarkFldObj.isMandatory = true;


                form.addSubmitButton({label:"Submit"});
                response.writePage(form);
            }else{
                var vinId    =   request.parameters.custpage_vin;
                var prepid   =   request.parameters.custpage_tempid;
                var locId    =   request.parameters.custpage_locfld;
                var remark    =   request.parameters.custpage_remark;



                var vinFld  =   ["custrecord_advs_vm_model","custrecord_advs_vm_location_code"];
                var vinSearch   =   search.lookupFields({type:"customrecord_advs_vm",id:vinId,columns:vinFld});
                var modelId     =   vinSearch["custrecord_advs_vm_model"][0].value || "";

                var prepFld  =   ["custrecord_advs_v_p_packages","custrecord_advs_v_p_status"];
                var vinSearch   =   search.lookupFields({type:"customrecord_advs_vehicle_prep",id:prepid,columns:prepFld});
                var pkgId       =   "";
                var pkgName     =   "";
                if(vinSearch["custrecord_advs_v_p_packages"] != null && vinSearch["custrecord_advs_v_p_packages"] != undefined){
                    if(vinSearch["custrecord_advs_v_p_packages"][0] != null && vinSearch["custrecord_advs_v_p_packages"][0] != undefined){
                        pkgId       =   vinSearch["custrecord_advs_v_p_packages"][0].value || "";
                        pkgName     =   vinSearch["custrecord_advs_v_p_packages"][0].text || "";
                    }

                }

                var statusID     =   vinSearch["custrecord_advs_v_p_status"][0].value || "";
                var statusT     =   vinSearch["custrecord_advs_v_p_status"][0].text || "";

                var DocumentNumber	=	makeid();
                var locFld  =   ["custrecord_advs_internal_customer"];
                var locSearch   =   search.lookupFields({type:"location",id:locId,columns:locFld});
                var custId     =   locSearch["custrecord_advs_internal_customer"][0].value || "";
                log.debug("custId@@1000", custId);

                var taskName    =   statusT;
                var RepairId ="";
                if(pkgId){
                    getPackageLinesDetails(pkgId);
                    var PackWiseTaskId		=	new Array();
                    taskName    =   pkgName;

                        var PackIdTemp = pkgId
                        var PackName = CreateTaskArray[PackIdTemp]['Name'];
                        var PackDesc = CreateTaskArray[PackIdTemp]['Desc'];
                        var JobId	 = CreateTaskArray[PackIdTemp]['JobId'];

                        log.debug("PackName",PackName);
                        PackWiseTaskId[PackIdTemp] = CreateJobTask(PackName,PackDesc,DocumentNumber,JobId,"","",vinId,"",custId);
                }else{
                    var Runtimscript	=	runtime.getCurrentScript();
                    var laborItem		=	Runtimscript.getParameter("custscript_advs_default_labor");

                    var recordtas = record.create({type:'customrecord_advs_task_record',isDynamic:true});
                    recordtas.setValue('name',taskName);
                    recordtas.setValue('custrecord_advs_repair_no',DocumentNumber);
                    recordtas.setValue('custrecord_repair_task_no',taskName);
                    recordtas.setValue('custrecord_repair_desc',taskName);
                    recordtas.setValue('custrecord_advs_st_r_t_def_b_cust',custId);
                    recordtas.setValue('custrecord_ref_no',DocumentNumber);
                    // recordtas.setValue('custrecord_advs_repair_task_time',"60");

                    if(vinID){
                        recordtas.setValue('custrecord_advs_st_r_t_equ_link',vinId);
                    }

                    RepairId    =  recordtas.save({ignoreMandatoryFields:true,enableSourcing:true});
                }



                var salesRec =   record.create({type:"salesorder",isDynamic:true});
                salesRec.setText({fieldId:"customform",text:"ADVS Repair Order"});
                salesRec.setValue({fieldId:"entity",value:custId});
                salesRec.setValue({fieldId:"location",value:locId});
                salesRec.setValue({fieldId:"custbody_advs_module_name",value:3});
                salesRec.setValue({fieldId:"memo", value: remark});
                salesRec.setValue({fieldId:"custbody_advs_st_service_equipment",value:vinId});
                salesRec.setValue({fieldId:"custbody_advs_doc_no",value:DocumentNumber});
                // salesRec.setValue({fieldId:"department",value:101});

                salesRec.setValue({fieldId:"custbody_advs_prep_stat",value:statusID});
                salesRec.setValue({fieldId:"custbody_advs_tbf_vehicle_prep",value:prepid});
                salesRec.setValue({fieldId:"custbody_advs_st_capitalization",value:true});
                


                if(pkgId){
                    if(LinesArray.length >=1 ){

                        for(var PL=0;PL<LinesArray.length;PL++){

                            var LineInvType		=	LinesArray[PL]["Type"];
                            log.debug("@@LineInvType159", LineInvType);
                            var LineItem		=	LinesArray[PL]["Item"];
                            var LineQuant		=	LinesArray[PL]["Quant"];
                            var LineRate		=	LinesArray[PL]["Rate"];
                            var PackId			=	LinesArray[PL]["PackId"];
                            var FixedPrice		=	LinesArray[PL]["FixedP"];
                            var LiDesc			=	LinesArray[PL]["LiDesc"];
                            var TaskId			=	PackWiseTaskId[PackId];
                            if(TaskId != null && TaskId != undefined && TaskId != 0 && TaskId != "" && TaskId != " "){
                            }else{
                                TaskId	=	"";
                            }
                            RepairId    =TaskId;
                            log.debug("TaskId",TaskId)

                            salesRec.selectNewLine({sublistId:'item'});
                            salesRec.setCurrentSublistValue({sublistId:'item', fieldId:'custcol_advs_selected_inventory_type',value:LineInvType});
                            salesRec.setCurrentSublistValue({sublistId:'item', fieldId:'custcol_advs_task_item',value:LineItem});
                            salesRec.setCurrentSublistValue({sublistId:'item', fieldId:'item',value:LineItem});
                            salesRec.setCurrentSublistValue({sublistId:'item', fieldId:'description',value:LiDesc});
                            salesRec.setCurrentSublistValue({sublistId:'item', fieldId:'quantity',value:LineQuant});

                            if(FixedPrice == "T"){
                                var tempRate	=	salesRec.getCurrentLineItemValue({sublistId:"item",fieldId:"rate"});
                                if(tempRate=='' || tempRate==null || tempRate=='null'
                                    || tempRate=='undefined' || tempRate==undefined){
                                    salesRec.setCurrentSublistValue({sublistId:'item', fieldId:'rate',value:0});
                                }else{
                                }
                            }else{
                                salesRec.setCurrentSublistValue({sublistId:"item", fieldId:"price", value:"-1"});
                                if(LineRate=='' || LineRate==null || LineRate=='null'
                                    || LineRate=='undefined' || LineRate==undefined){
                                    salesRec.setCurrentSublistValue({sublistId:'item',fieldId:'rate',value:0});
                                }else{
                                    salesRec.setCurrentSublistValue({sublistId:'item', fieldId:'rate',value:LineRate});
                                }
                            }
                            salesRec.setCurrentSublistValue({sublistId:"item",fieldId: "custcol_advs_st_service_package_link",value:PackId});
                            salesRec.setCurrentSublistValue({sublistId:"item", fieldId:"custcol_advs_st_temp_task_id", value:TaskId});
                            salesRec.setCurrentSublistValue({sublistId:"item", fieldId:"custcol_advs_repair_task_link", value:TaskId});
                            salesRec.setCurrentSublistValue({sublistId:"item", fieldId:"custcol_advs_st_fixed_price_package",value: FixedPrice});
                            salesRec.setCurrentSublistValue({sublistId:"item", fieldId:"custcol_advs_st_fixed_rate_rate", value:LineRate});
                            salesRec.setCurrentSublistValue({sublistId:'item', fieldId:'custcol_advs_billing_cust',value:custId});
                            salesRec.commitLine({sublistId:'item'});
                        }

                    }
                }else{
                    salesRec.selectNewLine({sublistId:'item'});
                    salesRec.setCurrentSublistValue({sublistId:'item',fieldId:'custcol_advs_selected_inventory_type',value: 13});
                    salesRec.setCurrentSublistValue({sublistId:'item',fieldId:'custcol_advs_task_item',value:laborItem});
                    salesRec.setCurrentSublistValue({sublistId:'item',fieldId:'item',value:laborItem});
                    salesRec.setCurrentSublistValue({sublistId:'item',fieldId:'quantity',value:1});
                    var getRate =   salesRec.getCurrentSublistValue({sublistId:"item",fieldId:"rate"})*1;
                    if(getRate<=0){
                        salesRec.setCurrentSublistValue({sublistId:'item',fieldId:'rate',value:0});
                    }
                    if(RepairId){
                        salesRec.setCurrentSublistValue({sublistId:'item',fieldId:'custcol_advs_temp_rep_task123',value:RepairId});
                        salesRec.setCurrentSublistValue({sublistId:'item',fieldId:'custcol_advs_repair_task_link',value:RepairId});

                    }
                    salesRec.setCurrentSublistValue({sublistId:'item', fieldId:'custcol_advs_billing_cust',value:custId});
                    salesRec.commitLine({sublistId:"item"})
                }


               var soID =    salesRec.save({ignoreMandatoryFields:true,enableSourcing:true});

                record.submitFields({
                    type: "customrecord_advs_task_record",
                    id: RepairId,
                    values: {
                        'custrecord_advs_reapir_task_link': soID
                    }
                });

                record.submitFields({
                    type: "customrecord_advs_vehicle_prep",
                    id: prepid,
                    values: {
                        'custrecord_advs_v_p_transaction': soID
                    }
                });

                var onclickScript=" <html><body> <script type='text/javascript'>" +
                    "try{" ;

                onclickScript+="" +
                    "window.parent.location.reload();" ;
                onclickScript+="}catch(e){alert(e+' '+e.message);}</script></body></html>";
                response.write(onclickScript);
            }
        }

        function makeid()
        {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 30; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            //	alert(text);
            return text;
        }
        var LinesArray		=	new Array();
        var CreateTaskArray	=	new Array();
        var PackUniqueId	=	new Array();

        function getPackageLinesDetails(PackageIds) {
            LinesArray		=	new Array();
            var package_Search = search.create({
                type: "customrecord_advs_after_sale_package_bom",
                filters: [
                    ["custrecord_advs_asp_bom_pack_no", "anyof", PackageIds],
                    "AND",
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custrecord_advs_asp_bom_pack_no.isinactive", "is", "F"]
                ],
                columns: [
                    search.createColumn({name: "custrecord_advs_asp_bom_selected_invtype"}),
                    search.createColumn({name: "custrecord_advs_asp_bom_item"}),
                    search.createColumn({name: "custrecord_advs_asp_bom_desc"}),
                    search.createColumn({name: "custrecord_advs_asp_bom_quantity"}),
                    search.createColumn({name: "custrecord_advs_bom_item_cost"}),
                    search.createColumn({name: "custrecord_advs_a_s_p_b_discount"}),
                    search.createColumn({name: "custrecord_advs_bom_package_line_p"}),
                    search.createColumn({name: "custrecord_advs_bom_line_amount"}),
                    search.createColumn({name: "custrecord_advs_a_s_p_ac_amount"}),
                    search.createColumn({
                        name: "custrecord_advs_asp_time_req",
                        join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO"
                    }),
                    search.createColumn({name: "name", join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO"}),
                    search.createColumn({
                        name: "custrecord_advs_asp_package_desc",
                        join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO"
                    }),
                    search.createColumn({name: "custrecord_advs_asp_bom_pack_no"}),
                    search.createColumn({
                        name: "custrecord_advs_a_s_p_fixed_price",
                        join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO"
                    }),
                    search.createColumn({
                        name: "custrecord_advs_a_s_p_operation_code",
                        join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO"
                    }),
                ]
            });
            // var package_Result	=	package_Search.runSearch();
            var Count	=	0;
            // package_Result.forEachResult(function(recLine) {
            package_Search.run().each(function(recLine){

                var LineInvType		=	recLine.getValue({name:"custrecord_advs_asp_bom_selected_invtype"});
                var LineItem		=	recLine.getValue({name:"custrecord_advs_asp_bom_item"});
                var LineQuant		=	recLine.getValue({name:"custrecord_advs_asp_bom_quantity"});
                var LineRate		=	recLine.getValue({name:"custrecord_advs_bom_package_line_p"});
                var TimeReq			=	recLine.getValue({name:"custrecord_advs_asp_time_req",join:"CUSTRECORD_ADVS_ASP_BOM_PACK_NO"});
                var PackName		=	recLine.getValue({name:"name",join:"CUSTRECORD_ADVS_ASP_BOM_PACK_NO"});
                var PackDesc		=	recLine.getValue({name:"custrecord_advs_asp_package_desc",join:"CUSTRECORD_ADVS_ASP_BOM_PACK_NO"});
                var PackId			=	recLine.getValue({name:"custrecord_advs_asp_bom_pack_no"});
                var FixPrice		=	recLine.getValue({name:"custrecord_advs_a_s_p_fixed_price",join:"CUSTRECORD_ADVS_ASP_BOM_PACK_NO"});
                var JobId			=	recLine.getValue({name:"custrecord_advs_a_s_p_operation_code",join:"CUSTRECORD_ADVS_ASP_BOM_PACK_NO"});
                var JobIdT			=	recLine.getText({name:"custrecord_advs_a_s_p_operation_code",join:"CUSTRECORD_ADVS_ASP_BOM_PACK_NO"});
                var LineDesc		=	recLine.getValue({name:"custrecord_advs_asp_bom_desc"});


                LinesArray[Count]			=	new Array();
                LinesArray[Count]["Type"]	=	LineInvType;
                LinesArray[Count]["Item"]	=	LineItem;
                LinesArray[Count]["Quant"]	=	LineQuant;
                LinesArray[Count]["Rate"]	=	LineRate;
                LinesArray[Count]["PackId"]	=	PackId;
                LinesArray[Count]["FixedP"]	=	FixPrice;
                LinesArray[Count]["LiDesc"]	=	LineDesc;

                if(PackUniqueId.indexOf(PackId) == -1){

                    PackUniqueId.push(PackId);

                    CreateTaskArray[PackId]			=	new Array();
                    CreateTaskArray[PackId]['Name']	=	PackName;
                    CreateTaskArray[PackId]['Desc']	=	PackDesc;
                    CreateTaskArray[PackId]['Time']	=	TimeReq;
                    CreateTaskArray[PackId]['JobId']=	JobId;
                    CreateTaskArray[PackId]['JobIdT']=	JobIdT;


                }

                Count++;
                return true;
            });

        }
        function CreateJobTask(TaskName,TaskDesc,orderNo,JobId,OrderId,OrderType,EquipmentLink,Complaint,custID) {

            var	RecObj		=	record.create({type:"customrecord_advs_task_record",isDynamic:true});

            RecObj.setValue('custrecord_ref_no', orderNo);

            RecObj.setValue('custrecord_advs_repair_task_job_code', JobId);
            RecObj.setValue('name', TaskName);
            RecObj.setValue('custrecord_advs_repair_no', orderNo);
            RecObj.setValue('custrecord_repair_task_no', TaskName);
            RecObj.setValue('custrecord_repair_desc', TaskDesc);
            RecObj.setValue('custrecord_advs_st_r_t_equ_link', EquipmentLink);
            RecObj.setValue('custrecord_advs_repair_task_job_code', JobId);
            // RecObj.setValue('custrecord_advs_repait_task_job_type', 1);
            if(Complaint){
                RecObj.setValue('custrecord_advs_st_r_t_compalin',Complaint);
            }
            RecObj.setValue('custrecord_advs_st_r_t_work_ord_link', OrderId);
            RecObj.setValue('custrecord_advs_st_r_t_def_b_cust', custID);
           /* if(OrderId*1 >= 1) {
                if(OrderType.toLowerCase() == "salesorder"){
                    RecObj.setValue('custrecord_advs_st_r_t_work_ord_link', OrderId);
                }else{
                    RecObj.setFieldValue('custrecord_advs_st_r_t_quote_link', OrderId);
                }
            }*/

            var OpeId	=	  RecObj.save({ignoreMandatoryFields:true,enableSourcing:true});
            // var OpeId	=	 nlapiSubmitRecord(RecObj, true, true);

            return OpeId;
        }

        return {onRequest}

    });

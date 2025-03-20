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
            if(request.method == "GET"){
                var vinID   =   request.parameters.vinid;
                var form    =   serverWidget.createForm({title:"Staging"});

                if(vinID != null && vinID != undefined){
                    var vinFldObj   =   form.addField({
                        id:"custpage_vin",
                        type:serverWidget.FieldType.SELECT,
                        label:"Vin #",
                        source:"customrecord_advs_vm"
                    });
                    vinFldObj.defaultValue = vinID;
                    vinFldObj.updateDisplayType({displayType:"hidden"});

                    var vinFld  =   ["custrecord_advs_vm_model","custrecord_advs_vm_vehicle_brand"];
                    var vinSearch   =   search.lookupFields({type:"customrecord_advs_vm",id:vinID,columns:vinFld});
                    var modelId     =   vinSearch["custrecord_advs_vm_model"][0].value || "";
                    var brandID     =   vinSearch["custrecord_advs_vm_vehicle_brand"][0].value || "";
                    var stagingObj =   getstagingTempleate(modelId,brandID);


                    var sublist =   form.addSublist({id:"custpage_sublist",type:"list",label:"List"});
                    sublist.addMarkAllButtons();
                    sublist.addField({id:"custpage_mark",type:serverWidget.FieldType.CHECKBOX,label:"Mark"});
                    sublist.addField({id:"custpage_id",type:serverWidget.FieldType.SELECT,label:"Template",source:"customrecord_advs_veh_prep_template"}).updateDisplayType({displayType:"inline"});
                    sublist.addField({id:"custpage_mem",type:serverWidget.FieldType.TEXTAREA,label:"Memo"});
                    sublist.addField({id:"custpage_stat",type:serverWidget.FieldType.SELECT,label:"Status",source:"customrecordadvs_veh_prep_status"}).updateDisplayType({displayType:"inline"});
                    sublist.addField({id:"custpage_pkg",type:serverWidget.FieldType.SELECT,label:"Package",source:"customrecord_advs_after_sales_package"}).updateDisplayType({displayType:"inline"});

                    var lineNum =   0;
                    for(var m=0;m<stagingObj.length;m++){
                        var dataLine    =   stagingObj[m];
                        if(dataLine != null && dataLine != undefined){
                            var id    =   dataLine.id;
                            var memo  =   dataLine.memo;
                            var stat  =   dataLine.stat;
                            var pkgid =   dataLine.pkgid;
                            sublist.setSublistValue({id:"custpage_id",line:lineNum,value:id});
                            if(memo){
                                sublist.setSublistValue({id:"custpage_mem",line:lineNum,value:memo});
                            }
                            if(stat){
                                sublist.setSublistValue({id:"custpage_stat",line:lineNum,value:stat});
                            }
                            if(pkgid){
                                sublist.setSublistValue({id:"custpage_pkg",line:lineNum,value:pkgid});
                            }



                            lineNum++;
                        }
                    }

                    form.addSubmitButton({label:"Submit"})
                }
                
                response.writePage(form);
            }else{
                var vinId   =   request.parameters.custpage_vin;
                var line    =   request.getLineCount({group:"custpage_sublist"});

                var selectedTemplate    =   [];
                for(var i=0;i<line;i++){
                    var marked  =   request.getSublistValue({group:"custpage_sublist",name:"custpage_mark",line:i});
                    var id      =   request.getSublistValue({group:"custpage_sublist",name:"custpage_id",line:i});
                   if(marked == true || marked == "T") {
                       selectedTemplate.push(id);
                    }
                    }

                if(selectedTemplate.length>0){
                    getCheckListData(selectedTemplate);
                }


                // var vinRec  =   record.load({type:"customrecord_advs_vm",id:vinId,isDynamic:true});
                var recMach =   "recmachcustrecord_advs_v_p_c_head";
                for(var i=0;i<line;i++){
                    var marked  =   request.getSublistValue({group:"custpage_sublist",name:"custpage_mark",line:i});
                    var id      =   request.getSublistValue({group:"custpage_sublist",name:"custpage_id",line:i});
                    var stat    =   request.getSublistValue({group:"custpage_sublist",name:"custpage_stat",line:i});
                    var pkg     =   request.getSublistValue({group:"custpage_sublist",name:"custpage_pkg",line:i});
                    var memo    =   request.getSublistValue({group:"custpage_sublist",name:"custpage_mem",line:i});
                    if(marked == true || marked == "T"){

                        var vehPrepREc  =   record.create({type:"customrecord_advs_vehicle_prep",isDynamic:true});
                        vehPrepREc.setValue({fieldId:"custrecord_advs_v_p_temp_ref",value:id});
                        vehPrepREc.setValue({fieldId:"custrecord_advs_v_p_status",value:stat});
                        vehPrepREc.setValue({fieldId:"custrecord_advs_v_p_packages",value:pkg});
                        vehPrepREc.setValue({fieldId:"custrecord_advs_v_p_vin_id",value:vinId});
                        if(memo){
                            vehPrepREc.setValue({fieldId:"custrecord_advs_v_p_memo",value:memo});
                        }


                        if( selectedChecklistData[id] != null &&  selectedChecklistData[id] != undefined){
                            var chLength    =   selectedChecklistData[id].length;
                            for(var j=0;j<chLength;j++){

                                var prepStat    =     selectedChecklistData[id][j]["prepStat"];
                                var group       =     selectedChecklistData[id][j]["group"];
                                var remark      =     selectedChecklistData[id][j]["remark"];
                                var status      =     selectedChecklistData[id][j]["status"];
                                var name      =     selectedChecklistData[id][j]["name"];


                                vehPrepREc.selectNewLine({sublistId:recMach});
                                vehPrepREc.setCurrentSublistValue({sublistId:recMach,fieldId:"name",value:name});
                                vehPrepREc.setCurrentSublistValue({sublistId:recMach,fieldId:"custrecord_advs_v_p_ch_temp",value:id});
                                vehPrepREc.setCurrentSublistValue({sublistId:recMach,fieldId:"custrecord_advs_v_p_c_status",value:prepStat});
                                vehPrepREc.setCurrentSublistValue({sublistId:recMach,fieldId:"custrecord_advs_v_p_c_group",value:group});
                                vehPrepREc.setCurrentSublistValue({sublistId:recMach,fieldId:"custrecord_advs_v_p_c_stat_check",value:status});
                                if(memo){
                                    vehPrepREc.setCurrentSublistValue({sublistId:recMach,fieldId:"custrecord_advs_v_p_c_remar",value:remark});
                                }

                                vehPrepREc.commitLine({sublistId:recMach});
                            }

                        }



                        vehPrepREc.save({ignoreMandatoryFields:true,enableSourcing:true});

                        /*vinRec.selectNewLine({sublistId:recMach});
                        vinRec.setCurrentSublistValue({sublistId:recMach,fieldId:"custrecord_advs_v_p_temp_ref",value:id});
                        vinRec.setCurrentSublistValue({sublistId:recMach,fieldId:"custrecord_advs_v_p_status",value:stat});
                        vinRec.setCurrentSublistValue({sublistId:recMach,fieldId:"custrecord_advs_v_p_packages",value:pkg});
                        if(memo){
                            vinRec.setCurrentSublistValue({sublistId:recMach,fieldId:"custrecord_advs_v_p_memo",value:memo});
                        }

                        vinRec.commitLine({sublistId:recMach});*/
                    }
                }
                // vinRec.save({enableSourcing:true,ignoreMandatoryFields:true});

                var onclickScript=" <html><body> <script type='text/javascript'>" +
                    "try{" ;

                onclickScript+="" +
                    "window.parent.location.reload();" ;
                onclickScript+="}catch(e){alert(e+' '+e.message);}</script></body></html>";
                response.write(onclickScript);
            }
        }

        function getstagingTempleate(model,brand,year){
            var dataObj =   [];

            var filtersAdd =   [];
            filtersAdd.push(["isinactive","is","F"]);
/*            filtersAdd.push("AND");
            filtersAdd.push(["custrecord_advs_v_p_t_model","anyof",model]);
            filtersAdd.push("AND");
            filtersAdd.push(["custrecord_advs_v_p_t_make","anyof",brand]);*/


            var searchTemp  =   search.create({
                type: "customrecord_advs_veh_prep_template",
                filters:[filtersAdd],
                columns:[
                    search.createColumn({name:"internalid"}),
                    search.createColumn({name:"name"}),
                    search.createColumn({name:"custrecord_advs_v_p_t_model"}),
                    search.createColumn({name:"custrecord_advs_v_p_t_make"}),
                    search.createColumn({name:"custrecord_advs_v_p_t_memo"}),
                    search.createColumn({name:"custrecord_advs_ve_p_t_prep_stat",sort: search.Sort.ASC}),
                    search.createColumn({name:"custrecord_advs_v_p_t_packages"}),
                ]
            });
            searchTemp.run().each(function(result){
                var obj =   {};
                obj.id      =   result.getValue({name:"internalid"});
                obj.name    =   result.getValue({name:"name"});
                obj.model   =   result.getValue({name:"custrecord_advs_v_p_t_model"});
                obj.make    =   result.getValue({name:"custrecord_advs_v_p_t_make"});
                obj.memo    =   result.getValue({name:"custrecord_advs_v_p_t_memo"});
                obj.stat    =   result.getValue({name:"custrecord_advs_ve_p_t_prep_stat"});
                obj.pkgid   =   result.getValue({name:"custrecord_advs_v_p_t_packages"});

                dataObj.push(obj);

                return true;
            });
            return dataObj;
        }

        var selectedChecklistData   =[];
            function getCheckListData(templateIDArr){

            var searchPrepcheck = search.create({
                type: "customrecord_advs_prep_checklist",
                filters:
                    [
                        ["isinactive","is","F"]
                        ,"AND",
                        ["custrecord_advs_p_c_prep_template","anyof",templateIDArr]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        search.createColumn({name: "custrecord_advs_v_p_s_stat", label: "Vehicle Prep Status"}),
                        search.createColumn({name: "custrecord_advs_p_c_group", label: "Group"}),
                        search.createColumn({name: "custrecord_advs_p_c_remark", label: "Remark"}),
                        search.createColumn({name: "custrecord_advs_p_c_status", label: "Status"}),
                        search.createColumn({name: "custrecord_advs_p_c_prep_template", label: "Prep Template"})
                    ]
            });
            var searchResultCount = searchPrepcheck.runPaged().count;
            searchPrepcheck.run().each(function(result){

                var prepStat    =   result.getValue({name: "custrecord_advs_v_p_s_stat"});
                var group       =   result.getValue({name: "custrecord_advs_p_c_group"});
                var remark      =   result.getValue({name: "custrecord_advs_p_c_remark"});
                var status      =   result.getValue({name: "custrecord_advs_p_c_status"});
                var preptemp    =   result.getValue({name: "custrecord_advs_p_c_prep_template"});
                var checkName    =   result.getValue({name: "name"});

                var index   =   0;
                if(selectedChecklistData[preptemp] != null && selectedChecklistData[preptemp] != undefined){
                    index   =   selectedChecklistData[preptemp].length;
                }else{
                    selectedChecklistData[preptemp] = new Array();
                }
                selectedChecklistData[preptemp][index] = new Array();
                selectedChecklistData[preptemp][index]["prepStat"]  = prepStat;
                selectedChecklistData[preptemp][index]["group"]     = group;
                selectedChecklistData[preptemp][index]["remark"]    = remark;
                selectedChecklistData[preptemp][index]["status"]    = status;
                selectedChecklistData[preptemp][index]["name"]    = checkName;
                return true;
            });

        }

        return {onRequest}

    });
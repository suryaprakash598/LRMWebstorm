/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/currency', 'N/email', 'N/format', 'N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget'],
    /**
     * @param{currency} currency
     * @param{email} email
     * @param{format} format
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (currency, email, format, record, runtime, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            var request =   scriptContext.request;
            if(request.method == "GET"){
                var VehicleID   =   request.parameters.custparam_id;
                var form    =   serverWidget.createForm({
                    title:"Fixed Asset"
                });

                var NewDate =   new Date();
                var stringD =   format.format({
                    type:format.Type.DATE,
                    value:NewDate
                })

                var datefldObj  =   form.addField({
                    id:"custpage_date",
                    type:"date",
                    label:"Date"
                });
                datefldObj.isMandatory = true;
                datefldObj.defaultValue = stringD;


                var lastTranfldObj  =   form.addField({
                    id:"custpage_l_date",
                    type:"date",
                    label:"Last TranDate"
                });

                var locfldObj  =   form.addField({
                    id:"custpage_location",
                    type:"select",
                    label:"Location",
                    source:"location"
                });

                var modelfldObj  =   form.addField({
                    id:"custpage_model",
                    type:"select",
                    label:"Model",
                    source:"item"
                });

                var ValuefldObj  =   form.addField({
                    id:"custpage_current_c",
                    type:"currency",
                    label:"Current Value"
                });
                var memofldObj  =   form.addField({
                    id:"custpage_memo",
                    type:"textarea",
                    label:"MEMO"
                });
                var vinfldObj  =   form.addField({
                    id:"custpage_vin",
                    type:"select",
                    label:"Vin",
                    source:"customrecord_advs_vm"
                });

                var AccfldObj  =   form.addField({
                    id:"custpage_acc",
                    type:"select",
                    label:"Account",
                    source:null
                });


               locfldObj.updateDisplayType({
                    displayType:"inline"
                });
                modelfldObj.updateDisplayType({
                    displayType:"inline"
                });
                /*ValuefldObj.updateDisplayType({
                    displayType:"inline"
                });*/
                vinfldObj.updateDisplayType({
                    displayType:"inline"
                });
                lastTranfldObj.updateDisplayType({
                    displayType:"inline"
                });


                ValuefldObj.isMandatory = true;
                AccfldObj.isMandatory = true;


                vinfldObj.defaultValue  =   VehicleID;


                var lookFld =   ["name","custrecord_advs_vm_model",
                    ,"custrecord_advs_vm_location_code"
                    ,"custrecord_advs_vm_subsidary"
                ]

                var lookRec =   search.lookupFields({
                    type:"customrecord_advs_vm",
                    id:VehicleID,
                    columns:lookFld
                });

                var VinName     =   lookRec["name"];
                var VinModel    =   lookRec["custrecord_advs_vm_model"][0].value;
//                var VinAccount  =   lookRec["custrecord_advs_vm_model.assetaccount"][0].value;
                var vinLocID    =   lookRec["custrecord_advs_vm_location_code"][0].value;
                var vinSubsi    =   lookRec["custrecord_advs_vm_subsidary"][0].value;
               /* if(lookRec["custrecord_advs_vm_truck_trailer_categor.custrecord_advs_t_c_adjust_acc"][0] != null && lookRec["custrecord_advs_vm_truck_trailer_categor.custrecord_advs_t_c_adjust_acc"][0] != undefined){
                    aDJaCC       =   lookRec["custrecord_advs_vm_truck_trailer_categor.custrecord_advs_t_c_adjust_acc"][0].value;
                }*/
                   
                if(vinSubsi != null && vinSubsi != undefined && vinSubsi != ""){
                    var AccountList    =   getSubsiBasedAccounts(search,vinSubsi);
      
                    AccfldObj.addSelectOption({value:"",text:""});
                    for(var m=0;m<AccountList.length;m++){
                        var id       =   AccountList[m].id;
                        var name     =   AccountList[m].name;
      
                        AccfldObj.addSelectOption({value:id,text:name});
                    }
      
                  
                 }

                var aDJaCC  =   runtime.getCurrentScript().getParameter("custscript_advs_fa_to_inventory");

               
                log.debug("aDJaCC",aDJaCC)

                modelfldObj.defaultValue    =   VinModel;
                if(aDJaCC){
                 AccfldObj.defaultValue  =   aDJaCC;}
                locfldObj.defaultValue = vinLocID;
                var search_vc = search.create({
                    type: "transaction",
                    filters:
                        [
                            ["posting","is","T"],
                            "AND",
                            ["serialnumber","isnotempty",""],
                            "AND",
                            ["item.custitem_advs_inventory_type","anyof","1"]
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
                    })

                ]



                var vinCost  =   0;var LastTranDate  =   "";
                var columns =   search_vc.columns;
                search_vc.run().each(function(recVin){
                    vinCost =   recVin.getValue(columns[7]);
                    LastTranDate =   recVin.getValue(columns[4]);
                    return true;
                });


                lastTranfldObj.defaultValue =   LastTranDate;


                    form.addSubmitButton({
                        label:"Submit"
                    })

                form.clientScriptModulePath =   "./advs_cs_create_fa_to_inv.js"
                scriptContext.response.writePage(form);
            }else{
                // var VehicleID   =   request.parameters.custparam_id;
                var vinID       =   request.parameters.custpage_vin;
                var DateCre     =   request.parameters.custpage_date;
                var LocID       =   request.parameters.custpage_location;
                // var InvNum      =   request.parameters.custpage_invnum;
                var ModelID     =   request.parameters.custpage_model;
                var CValue      =   request.parameters.custpage_current_c;
                var Memo        =   request.parameters.custpage_memo;
                var Account      =   request.parameters.custpage_acc;



                var DateCPar  =   format.parse({
                    type:format.Type.DATE,
                    value:DateCre
                });

                var DateC  =   format.parse({
                    type:format.Type.DATE,
                    value:DateCPar
                });

                var lookFld =   ["custrecord_advs_vm_subsidary","name",
                    "custrecord_advs_st_vin_segment_ref","custrecord_advs_st_vin_segment_ref","custrecord_advs_vm_department"]

                var lookRec =   search.lookupFields({
                    type:"customrecord_advs_vm",
                    id:vinID,
                    columns:lookFld
                });
                var InvNum      =   lookRec["name"];
                var subsi       =   lookRec["custrecord_advs_vm_subsidary"][0].value;
                var vinSeg      =   lookRec["custrecord_advs_st_vin_segment_ref"];
                var stockSeg    =   lookRec["custrecord_advs_st_vin_segment_ref"];
                var vinDept  =   lookRec["custrecord_advs_vm_department"][0].value;


                var invRec  =   record.create({
                    type:"inventoryadjustment",
                    isDynamic: true,
                });


                invRec.setValue({fieldId:"subsidiary",value:subsi});
                invRec.setValue({fieldId:"account",value:Account});
                invRec.setValue({fieldId:"trandate",value:DateC});
                invRec.setValue({fieldId:"adjlocation",value:LocID});
                invRec.setValue({fieldId:"memo",value:Memo});
                invRec.setValue({fieldId:"department",value:vinDept});
                invRec.setValue({fieldId:"custbody_advs_st_vin_invoice",value:vinID});

                invRec.selectNewLine({
                    sublistId:"inventory"
                });
                invRec.setCurrentSublistValue({
                    sublistId:"inventory",
                    fieldId:"item",
                    value:ModelID
                });
                invRec.setCurrentSublistValue({
                    sublistId:"inventory",
                    fieldId:"adjustqtyby",
                    value:"1"
                });
                invRec.setCurrentSublistValue({
                    sublistId:"inventory",
                    fieldId:"location",
                    value:LocID
                });
                invRec.setCurrentSublistValue({
                    sublistId:"inventory",
                    fieldId:"unitcost",
                    value:CValue
                });


                invRec.setCurrentSublistValue({
                    sublistId:"inventory",
                    fieldId:"cseg_advs_st_vin_se",
                    value:vinSeg
                });
                invRec.setCurrentSublistValue({
                    sublistId:"inventory",
                    fieldId:"cseg_stock_num_seg_",
                    value:stockSeg
                });
                /*  inventory.setCurrentSublistValue({
                      sublistId:"inventory",
                      fieldId:"department",
                      value:"1"
                  });*/

                var invDetail = invRec.getCurrentSublistSubrecord({
                    sublistId: 'inventory',
                    fieldId: 'inventorydetail'
                });
                invDetail.selectNewLine({
                    sublistId: 'inventoryassignment'
                });
                invDetail.setCurrentSublistValue({
                    sublistId: 'inventoryassignment',
                    fieldId: 'receiptinventorynumber',
                    value: InvNum
                });
                invDetail.commitLine({
                    sublistId: 'inventoryassignment'
                });


                invRec.commitLine({
                    sublistId: 'inventory'
                });

                var recordId = invRec.save({
                    // enableSourcing:true,
                    ignoreMandatoryFields:true
                });

                var vmrec   =   record.load({
                    type:"customrecord_advs_vm",
                    id:vinID,
                    isDynamic:true
                });
                vmrec.setValue({
                    fieldId:"custrecord_advs_t_tinv_type",
                    value:1
                });
                vmrec.setValue({
                    fieldId:"custrecord_advs_vm_vehicle_status",
                    value:2
                });

                vmrec.setValue({
                    fieldId:"custrecord_advs_vm_reservation_status",
                    value:1
                });
                var recmach =   "recmachcustrecord_advs_f_a_transfer_info"  ;
                // vmrec.selectNewLine({sublistId:recmach});
                vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecord_advs_f_a_t_i_date",value:DateC});
                vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecord_advs_f_a_t_in_adj",value:recordId});
                vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecord_advs_f_a_t_i_memo",value:Memo});
                vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecord_advs_f_a_t_i_cost",value:CValue});
                vmrec.commitLine({sublistId:recmach})
                vmrec.save({
                    enableSourcing:true,
                    ignoreMandatoryFields:true
                });

                var onclickScript=" <html><body> <script type='text/javascript'>" +
                    "try{" +

                    "";
                onclickScript+="window.parent.location.reload();";
                onclickScript+="window.parent.closePopup();";
                onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";

                scriptContext.response.write(onclickScript);
            }
        }

        return {onRequest}

    });

    function getSubsiBasedAccounts(search,vinSubsi){
        var Data        = [];
        var accountSearchObj = search.create({
            type: "account",
            filters:
                [["isinactive","is","F"], 
                "AND", 
                ["subsidiary","anyof",vinSubsi],
                  "AND", 
                ["internalid","noneof","211"]],
            columns:
                [
                    search.createColumn({name: "internalid", label: "Internal ID"}),
                    search.createColumn({
                       name: "name",
                       sort: search.Sort.ASC,
                       label: "Name"
                    })
                ]
        });
 
        accountSearchObj.run().each(function(result){
 
            var id   = result.getValue({name: "internalid"});
            var name   = result.getValue({name: "name"});
 
            var obj  = {};
            obj.id           = id;
            obj.name         = name;
            Data.push(obj);
            return true;
        });
        return Data;
    }
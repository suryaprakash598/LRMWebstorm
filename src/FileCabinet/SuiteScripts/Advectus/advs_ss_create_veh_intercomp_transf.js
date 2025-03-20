/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/log', 'N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget','N/format','N/error'],
    /**
     * @param {log} log
     * @param {record} record
     * @param {runtime} runtime
     * @param {search} search
     * @param {serverWidget} serverWidget
     */
    function(log, record, runtime, search, serverWidget,format,error) {

        /**
         * Definition of the Suitelet script trigger point.
         *
         * @param {Object} context
         * @param {ServerRequest} context.request - Encapsulation of the incoming request
         * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
         * @Since 2015.2
         */
        function onRequest(context) {
            var request	=	context.request;
            if(context.request.method == "GET"){


                var VinID	=	request.parameters.s_id;

                var fieldLook   =   ["custrecord_advs_vm_vehicle_type","name","custrecord_advs_vm_model",
                    "custrecord_advs_vm_model.assetaccount","custrecord_advs_vm_subsidary","custrecord_advs_vm_lot"];
                var VinRec	=	search.lookupFields({
                    type:"customrecord_advs_vm",
                    id:VinID,
                    columns:fieldLook,

                });

                var VehicleType  	= "";
                if(VinRec["custrecord_advs_vm_vehicle_type"][0] != null && VinRec["custrecord_advs_vm_vehicle_type"][0] != undefined){
                    VehicleType  	=   VinRec["custrecord_advs_vm_vehicle_type"][0].value || "";
                }
                var vehicleLot  	= "";
                if(VinRec["custrecord_advs_vm_lot"][0] != null && VinRec["custrecord_advs_vm_lot"][0] != undefined){
                    vehicleLot  	=   VinRec["custrecord_advs_vm_lot"][0].value || "";
                }

                var VinModel  	=   VinRec["custrecord_advs_vm_model"][0].value;
                var VinAccount  =   VinRec["custrecord_advs_vm_model.assetaccount"][0].value;
                var VinName		  	=   VinRec["name"];

                var subsi  =   VinRec["custrecord_advs_vm_subsidary"][0].value;





                var form	=	serverWidget.createForm({
                    title:"Transfer"
                });
                var vinObjfld	=	form.addField({
                    id:"custpage_vin",
                    label:"Vin #",
                    type:"select",
                    source:"customrecord_advs_vm"
                });
                vinObjfld.defaultValue	=	VinID;
                vinObjfld.updateDisplayType({
                    displayType:"hidden"
                });

                var invNfldObj  =   form.addField({
                    id:"custpage_invnum",
                    type:"select",
                    label:"Inventory Number",
                    source:"inventorynumber"
                });
                var modelfldObj  =   form.addField({
                    id:"custpage_model",
                    type:"select",
                    label:"Model",
                    source:"item"
                });
                modelfldObj.updateDisplayType({
                    displayType:"hidden"
                });
                modelfldObj.defaultValue    =   VinModel;

                var AccfldObj  =   form.addField({
                    id:"custpage_acc",
                    type:"select",
                    label:"Account",
                    source:"account"
                });
                AccfldObj.updateDisplayType({
                    displayType:"hidden"
                });
                AccfldObj.defaultValue    =   VinAccount;

                var vinStatusObj	=	form.addField({
                    id:"custpage_statu_fld",
                    label:"VEHICLE STATUS TYPE",
                    type:"select",
                    source:"customlist_advs_vehicle_status"
                });
                vinStatusObj.updateDisplayType({
                    displayType:"hidden"
                });
                vinStatusObj.defaultValue	=	VehicleType;

                var subsiOldFld  =   form.addField({
                    id:"custpage_v_old_subsi",
                    type:"select",
                    label:"Subsidiary",
                    source:"subsidiary"
                });
                subsiOldFld.updateDisplayType({
                    displayType:"inline"
                });
                subsiOldFld.defaultValue = subsi;

                var locfldObj  =   form.addField({
                    id:"custpage_location",
                    type:"select",
                    label:"Location",
                    source:"location"
                });
               
                var lastTranfldObj  =   form.addField({
                    id:"custpage_l_date",
                    type:"date",
                    label:"Last TranDate"
                });
                lastTranfldObj.updateDisplayType({
                    displayType:"inline"
                });






                /* var ValuefldObj  =   form.addField({
                     id:"custpage_current_c",
                     type:"currency",
                     label:"Current Value"
                 });
                 ValuefldObj.updateDisplayType({
                     displayType:"inline"
                 });*/


                var DateFldObj	=	form.addField({
                    id:"custpage_date",
                    label:"Date",
                    type:"date",

                });
                DateFldObj.isMandatory=true;

                var tosubsifldObj  =   form.addField({
                    id:"custpage_to_subsi",
                    type:"select",
                    label:"To Subsidiary",
                    source:"subsidiary"
                });
                tosubsifldObj.isMandatory = true;

                var tolocfldObj  =   form.addField({
                    id:"custpage_to_location",
                    type:"select",
                    label:"To Location",
                    source:null
                });
                tolocfldObj.isMandatory = true;

                var todeptfldObj  =   form.addField({
                    id:"custpage_to_dep",
                    type:"select",
                    label:"To Department",
                    source:null
                });
                todeptfldObj.isMandatory = true;

                /* var new_costfld  =   form.addField({
                     id:"custpage_adj_val",
                     type:"currency",
                     label:"Adjustment Value"
                 });
                 new_costfld.isMandatory = true;*/


                /*var lotFld  =   form.addField({
                    id:"custpage_v_lot",
                    type:"select",
                    label:"LOT #"
                });
                lotFld.isMandatory = true;*/

                var memofldObj  =   form.addField({
                    id:"custpage_memo",
                    type:"textarea",
                    label:"MEMO"
                });

                /* var vinNewStatusObj	=	form.addField({
                     id:"custpage_statu_new",
                     label:"NEW VEHICLE STATUS TYPE",
                     type:"select",

                 });
                 vinNewStatusObj.isMandatory=true;
                 vinNewStatusObj.addSelectOption({
                     value : '',
                     text : ''
                 });
                 vinNewStatusObj.addSelectOption({
                     value : '1',
                     text : 'New Vehicle'
                 });
                 vinNewStatusObj.addSelectOption({
                     value : '2',
                     text : 'Used Vehicle'
                 });
                 vinNewStatusObj.addSelectOption({
                     value : '3',
                     text : 'Demo Vehicle'
                 });*/



                invNfldObj.updateDisplayType({
                    displayType:"hidden"
                });
                locfldObj.updateDisplayType({
                    displayType:"inline"
                });

                var NewDate =   new Date();
                var stringD =   format.format({
                    type:format.Type.DATE,
                    value:NewDate
                });

                DateFldObj.defaultValue	=	stringD;


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
                if(invLoc){
                    locfldObj.defaultValue=invLoc;
                    invNfldObj.defaultValue=invenID;

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
                            operator:search.Operator.ANYOF,
                            values:VinModel
                        }),
                        search.createFilter({
                            name:"account",
                            operator:search.Operator.ANYOF,
                            values:VinAccount
                        }),
                        search.createFilter({
                            name:"location",
                            operator:search.Operator.ANYOF,
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


                    lastTranfldObj.defaultValue  =   LastTranDate;
                }


                form.clientScriptModulePath = "./advs_cs_create_veh_inteco_transfer.js";
                form.addSubmitButton({
                    label:"Submit"
                })
                context.response.writePage(form);
            }else{
                var vinID       =   request.parameters.custpage_vin;
                var DateCre     =   request.parameters.custpage_date;
                var LocID       =   request.parameters.custpage_location;
                var InvNum      =   request.parameters.custpage_invnum;
                var ModelID     =   request.parameters.custpage_model;
                var CValue      =   request.parameters.custpage_current_c;
                var Memo        =   request.parameters.custpage_memo;

                var toSubsi       =   request.parameters.custpage_to_subsi;
                var toLoc       =   request.parameters.custpage_to_location;
                var lotSet       =   request.parameters.custpage_v_lot;
                var fromLot     = request.parameters.custpage_v_old_lot;
                var toDept     = request.parameters.custpage_to_dep





                var DateCPar  =   format.parse({
                    type:format.Type.DATE,
                    value:DateCre
                });

                var DateC  =   format.parse({
                    type:format.Type.DATE,
                    value:DateCPar
                });

                var lookFld =   ["custrecord_advs_vm_subsidary","name",'custrecord_advs_st_equi_last_work_order']

                var lookRec =   search.lookupFields({
                    type:"customrecord_advs_vm",
                    id:vinID,
                    columns:lookFld
                });
                var aDJaCC       = "";
                var subsi          =   lookRec["custrecord_advs_vm_subsidary"][0].value;
				if(lookRec["custrecord_advs_st_equi_last_work_order"]){
					 var lastworkorder    =   lookRec["custrecord_advs_st_equi_last_work_order"][0].value;
					 log.debug('lastworkorder',lastworkorder);
					 if(lastworkorder)
					 {
						  var lookwoRec =   search.lookupFields({
								type:"salesorder",
								id:lastworkorder,
								columns:['custbody_advs_st_capitalization']
							});
							var iscapitalized = lookwoRec['custbody_advs_st_capitalization'];
							log.debug('iscapitalized',iscapitalized);
					 }
				}
               
                var VinName          =   lookRec["name"];


                var data_posted_type=[],data_posted_id = [];
                var AdjustMentArr	=	new Array();
                var recordId1 = "";

                log.debug( 'LocID ' , LocID + ' toLoc ' +  toLoc)

                try {
                    if (LocID != toLoc) {

                        log.debug(' INSIDE')

                        var invRec = record.create({type: "intercompanytransferorder", isDynamic: true,});

                        var loadedRecord = record.load({
                            type: 'location',
                            id: LocID,
                            isDynamic: false // Set to true if you want to use dynamic mode
                        });

                        var fromLocationSubsidiary = loadedRecord.getValue({fieldId: 'subsidiary'});

                        log.debug( ' * fromLocationSubsidiary *' , fromLocationSubsidiary)

                        invRec.setText({fieldId: "customform", text: "ADVS Machine Transfer Order"});
                        invRec.setValue({fieldId: "subsidiary", value: fromLocationSubsidiary});

                        invRec.setValue({fieldId: "tosubsidiary", value: toSubsi});
                        invRec.setValue({fieldId: "location", value: LocID});
                        invRec.setValue({fieldId: "transferlocation", value: toLoc});
                        invRec.setValue({fieldId: "trandate", value: DateC});
                        invRec.setValue({fieldId: "orderstatus", value: "B"});
                      invRec.setValue({fieldId: "incoterm", value: 1});
                        invRec.setValue({fieldId: "custbody_advs_module_name", value:1});
                        invRec.setValue({fieldId: "department", value:toDept});
                        invRec.setValue({fieldId: "useitemcostastransfercost", value:true});



                        invRec.setValue({fieldId: "memo", value: Memo});

                        invRec.selectNewLine({
                            sublistId: "item"
                        });
                        invRec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "custcol_advs_selected_inventory_type",
                            value: 1
                        });
                        invRec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "item",
                            value: ModelID
                        });
                        invRec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "custcol_advs_task_item",
                            value: ModelID
                        });
                        invRec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "quantity",
                            value: "1"
                        });
                        invRec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "location",
                            value: LocID
                        });

                        invRec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "custcol2",
                            value: vinID
                        });
                        invRec.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "custcol_advs_truck_serial_number",
                            value: vinID
                        });

                        // create_Inv_Ad_Record.setCurrentLineItemValue('inventory', 'serialnumbers', vin_name);
                        var invDetail = invRec.getCurrentSublistSubrecord({
                            sublistId: 'item',
                            fieldId: 'inventorydetail'
                        });
                        invDetail.selectNewLine({
                            sublistId: 'inventoryassignment'
                        });
                        invDetail.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'issueinventorynumber',
                            value: InvNum
                        });
                        invDetail.commitLine({
                            sublistId: 'inventoryassignment'
                        });


                        invRec.commitLine({
                            sublistId: 'item'
                        });

                        recordId1 = invRec.save({
                            enableSourcing:true,
                            ignoreMandatoryFields: true
                        });

                        data_posted_type.push('intercompanytransferorder');
                        data_posted_id.push(recordId1);
                        log.debug( ' * data_posted_id *' , data_posted_id+"=>"+data_posted_type);

                        var Tra_record =  record.transform({
                            fromType: 'intercompanytransferorder',
                            fromId: recordId1,
                            toType: 'itemfulfillment'
                        });
                        Tra_record.setValue('trandate', DateC);
                        var Tra_record_post = Tra_record.save({enableSourcing:true,ignoreMandatoryFields:true});
                        data_posted_type.push('itemfulfillment');
                        data_posted_id.push(Tra_record_post);

                        var Tra_record =  record.transform({
                            fromType: 'intercompanytransferorder',
                            fromId: recordId1,
                            toType: 'itemreceipt'
                        });
                        Tra_record.setValue('trandate', DateC);
                        var Tra_record_post =  Tra_record.save({
                            enableSourcing:false,
                            ignoreMandatoryFields:true
                        });
                        data_posted_type.push('itemreceipt');
                        data_posted_id.push(Tra_record_post);


                        AdjustMentArr.push(recordId1);
                    }

                    log.debug('Outside' , vinID + ' * lotSet * ' +  lotSet + 'toLoc' + toLoc)

                    var vmrec   =   record.load({
                        type:"customrecord_advs_vm",
                        id:vinID,
                        isDynamic:true
                    });
                   
                    var lookFld =   ["custrecord_advs_st_default_customer"]
                    var lookRec =   search.lookupFields({
                        type:"subsidiary",
                        id:toSubsi,
                        columns:lookFld
                    });

                    var DefaultCustomer          =   lookRec["custrecord_advs_st_default_customer"][0].value;
                    log.debug("DefaultCustomer,",DefaultCustomer);
                    var vmrec   =   record.load({
                        type:"customrecord_advs_vm",
                        id:vinID,
                        isDynamic:true
                    });
                   
                    vmrec.setValue({fieldId:"custrecord_advs_vm_subsidary",value:toSubsi});
                    if(DefaultCustomer){
                      vmrec.setValue({fieldId:"custrecord_advs_vm_customer_number",value:DefaultCustomer});
                    }
                    vmrec.setValue({fieldId:"custrecord_advs_vm_location_code",value:toLoc});
                    vmrec.setValue({fieldId:"custrecord_advs_vm_lot",value:lotSet});
                    vmrec.setValue({fieldId:"custrecord_advs_vm_department",value:toDept});
					if(iscapitalized==true){
						                    vmrec.setValue({fieldId:"custrecord_advs_vm_reservation_status",value:19});//inshop

					}else{
						                    vmrec.setValue({fieldId:"custrecord_advs_vm_reservation_status",value:20});//inshop

					}


                    log.debug(' recordId1 ' , recordId1)

                    if(recordId1){
                        var recmach =   "recmachcustrecord_advs_v_p_l_t_vin"  ;
                        // vmrec.selectNewLine({sublistId:recmach});

                        vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecord_advs_v_p_l_t_trans",value:recordId1});
                        vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecordcustrecord_advs_v_p_l_from_loc",value:LocID});
                        vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecordcustrecord_advs_v_p_l_to_loc",value:toLoc});
                        if(fromLot){
                            vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecordcustrecord_advs_v_p_l_from_lot",value:fromLot});
                        }
                        vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecordcustrecord_advs_v_p_l_to_lot",value:lotSet});
                        vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecordcustrecord_advs_v_p_l_date",value:DateC});

                        vmrec.commitLine({sublistId:recmach})
                    }else{
                        var recmach =   "recmachcustrecord_advs_v_p_l_t_vin"  ;

                        vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecordcustrecord_advs_v_p_l_from_loc",value:LocID});
                        vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecordcustrecord_advs_v_p_l_to_loc",value:toLoc});
                        if(fromLot){
                            vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecordcustrecord_advs_v_p_l_from_lot",value:fromLot});
                        }
                        vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecordcustrecord_advs_v_p_l_to_lot",value:lotSet});
                        vmrec.setCurrentSublistValue({sublistId:recmach,fieldId:"custrecordcustrecord_advs_v_p_l_date",value:DateC});
                        vmrec.commitLine({sublistId:recmach})
                    }

                    vmrec.save({
                        enableSourcing:false,
                        ignoreMandatoryFields:true
                    });

                }catch(e){
                    log.error(e,e.message);
                   /* if(AdjustMentArr.length>0){
                        for(var i=0;i<AdjustMentArr.length;i++){
                            var IDAd	=	AdjustMentArr[i];
                            record.delete({
                                type:"inventoryadjustment",
                                id:IDAd
                            })
                        }
                    }*/

                    for(var i=data_posted_type.length;i<0;i--){
                        // nlapiDeleteRecord(data_posted_type[i], data_posted_id[i]);
                        record.delete({
                            type:data_posted_type[i],
                            id:data_posted_id[i]
                        })
                    }
                }
                var onclickScript=" <html><body> <script type='text/javascript'>" +
                    "try{" +

                    "";
                onclickScript+="window.parent.location.reload();";
               onclickScript+="window.parent.closePopup();";
                onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";

                context.response.write(onclickScript);
            }
        }

        return {
            onRequest: onRequest
        };

    });
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

                /*var custfldObj  =   form.addField({
                    id:"custpage_cust",
                    type:"select",
                    label:"Customer"
                }); custfldObj.addSelectOption({
                    value:"",
                    text:""
                });

                var addrfldObj  =   form.addField({
                    id:"custpage_cust_billing",
                    type:"select",
                    label:"Billing Address"
                });
                var addrshipfldObj  =   form.addField({
                    id:"custpage_cust_shipping",
                    type:"select",
                    label:"Shipping Address"
                });*/

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

                invNfldObj.updateDisplayType({
                    displayType:"inline"
                });
                locfldObj.updateDisplayType({
                    displayType:"inline"
                });
                modelfldObj.updateDisplayType({
                    displayType:"inline"
                });
                ValuefldObj.updateDisplayType({
                    displayType:"inline"
                });
                vinfldObj.updateDisplayType({
                    displayType:"inline"
                });
                lastTranfldObj.updateDisplayType({
                    displayType:"inline"
                });

                AccfldObj.isMandatory = true;
//                custfldObj.isMandatory = true;
                // addrfldObj.isMandatory = true;
                //addrshipfldObj.isMandatory = true;
                vinfldObj.defaultValue  =   VehicleID;



                var lookFld =   ["name","custrecord_advs_vm_model","custrecord_advs_vm_model.assetaccount",
                    "custrecord_advs_vm_tc.custrecord_advs_t_c_adjust_acc","custrecord_advs_vm_subsidary"]

                var lookRec =   search.lookupFields({
                    type:"customrecord_advs_vm",
                    id:VehicleID,
                    columns:lookFld
                });
                var aDJaCC       = "";

                var VinName     =   lookRec["name"];
                log.debug("VinName", VinName)
                var VinModel    =   lookRec["custrecord_advs_vm_model"][0].value;
                var VinAccount  =   lookRec["custrecord_advs_vm_model.assetaccount"][0].value;
                var vinSubsi  =   lookRec["custrecord_advs_vm_subsidary"][0].value;
                if(lookRec["custrecord_advs_vm_tc.custrecord_advs_t_c_adjust_acc"][0] != null && lookRec["custrecord_advs_vm_tc.custrecord_advs_t_c_adjust_acc"][0] != undefined){
                    aDJaCC       =   lookRec["custrecord_advs_vm_tc.custrecord_advs_t_c_adjust_acc"][0].value;
                }
                modelfldObj.defaultValue    =   VinModel;

                if(vinSubsi){/*
                    var searchC = search.create({
                        type:"customer",
                        filters:[["isinactive","is","F"]
                            // ,"AND",
                            // ["stage","anyof","customer"]
                            ,"AND",
                            ["msesubsidiary.internalid","anyof",vinSubsi]],
                        columns:[search.createColumn({name:"entityid"}),search.createColumn({name:"internalid"})]
                    });
                    
                    var ResultSet =   searchC.run();
                    var start  =   0;var end=  1000;var index  =   1000;
                    
                    while(index  ==  1000){
                        var rs   =   ResultSet.getRange({
                            start: start,
                            end: end
                         });
                         for(var i=0;i<rs.length;i++){
                            var recC =   rs[i];
                        var custID         =   recC.getValue({name:"internalid"});
                        var custentity   =   recC.getValue({name:"entityid"});

//                        custfldObj.addSelectOption({
//                            value:custID,
//                            text:custentity,
//                        });
//                        return true;
//                    });
                    }

                    start = end; end = start + 1000; index = rs.length;
                 }*/
                }

                if(vinSubsi != null && vinSubsi != undefined && vinSubsi != ""){
                    var AccountList    =   getSubsiBasedAccounts(search,vinSubsi);

                    AccfldObj.addSelectOption({value:"",text:""});
                    for(var m=0;m<AccountList.length;m++){
                        var id       =   AccountList[m].id;
                        var name     =   AccountList[m].name;

                        AccfldObj.addSelectOption({value:id,text:name});
                    }


                }

                if(aDJaCC){
                    AccfldObj.defaultValue  =   aDJaCC;
                }

                log.debug("VinModel",VinModel);
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

                log.debug("invenID",invenID+"=>"+invLoc);
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

                    ValuefldObj.defaultValue    =   vinCost;
                    lastTranfldObj.defaultValue  =   LastTranDate;
                    form.addSubmitButton({
                        label:"Submit"
                    })
                }




                form.clientScriptModulePath = "./advs_csaa_create_fa_ws.js";
                // form.clientScriptModulePath = "SuiteScripts/Advs 2.0/advs_csaa_create_fa_ws.js";

                // SuiteScripts : Advs 2.0
                scriptContext.response.writePage(form);

            }else {
                // var VehicleID   =   request.parameters.custparam_id;
                var vinID = request.parameters.custpage_vin;
                var DateCre = request.parameters.custpage_date;
                var LocID = request.parameters.custpage_location;
                var InvNum = request.parameters.custpage_invnum;
                var ModelID = request.parameters.custpage_model;
                var CValue = request.parameters.custpage_current_c;
                log.debug("CValue", CValue+"==>"+DateCre);
                var Memo = request.parameters.custpage_memo;
                var Account = request.parameters.custpage_acc;

                var CustID = request.parameters.custpage_cust;
                var Address = request.parameters.custpage_cust_billing;
                var shipAddre = request.parameters.custpage_cust_shipping;

                var DateCPar = format.parse({
                    type: format.Type.DATE,
                    value: DateCre
                });

                var DateC = format.parse({
                    type: format.Type.DATE,
                    value: DateCPar
                });

                var lookFld = ["custrecord_advs_vm_subsidary", "name", "custrecord_advs_st_vin_segment_ref",
                    "custrecord_advs_st_vin_segment_ref", "custrecord_advs_vm_last_direct_cost", "custrecord_advs_vm_purchase_invoice_date"]

                var lookRec = search.lookupFields({
                    type: "customrecord_advs_vm",
                    id: vinID,
                    columns: lookFld
                });
                var aDJaCC = "";


                var subsi = lookRec["custrecord_advs_vm_subsidary"][0].value;
                var vinSeg = lookRec["custrecord_advs_st_vin_segment_ref"];
                var stockSeg = lookRec["custrecord_advs_st_vin_segment_ref"];
                var vinName = lookRec["name"];
                var purChasecost = lookRec["custrecord_advs_vm_last_direct_cost"];
                var purChasedate = lookRec["custrecord_advs_vm_purchase_invoice_date"];

                var convPodate  =    format.parse({
                                    type: format.Type.DATE,
                                    value: purChasedate
                                });

                log.debug("convPodate",convPodate);

                purChasecost = purChasecost * 1;

                log.debug("DateC", DateC + "=>" + subsi + "=>CustID" + CustID);

                var recordTypeArr = [];var recordIdArr= [];
                try {


                    var invRec = record.create({
                        type: "inventoryadjustment",
                        isDynamic: true,
                    });

                    log.debug('values', subsi + "->" + Account + "->" + LocID);
                    invRec.setValue({fieldId: "subsidiary", value: subsi});
                    invRec.setValue({fieldId: "account", value: Account});
                    invRec.setValue({fieldId: "trandate", value: DateC});
                    invRec.setValue({fieldId: "adjlocation", value: LocID});
                    invRec.setValue({fieldId: "memo", value: Memo});
                    invRec.setValue({fieldId: "custbody_advs_st_vin_invoice", value: vinID});
                    invRec.setValue({fieldId: "custbody_advs_cust_track_id", value: CustID});
                    invRec.setValue({fieldId: "custbody_advs_address_bill", value: Address});
                    invRec.setValue({fieldId: "custbody_advs_ship_adress", value: shipAddre});

                    invRec.selectNewLine({
                        sublistId: "inventory"
                    });
                    invRec.setCurrentSublistValue({
                        sublistId: "inventory",
                        fieldId: "item",
                        value: ModelID
                    });
                    invRec.setCurrentSublistValue({
                        sublistId: "inventory",
                        fieldId: "adjustqtyby",
                        value: "-1"
                    });
                    invRec.setCurrentSublistValue({
                        sublistId: "inventory",
                        fieldId: "location",
                        value: LocID
                    });
                    //
                    invRec.setCurrentSublistValue({
                        sublistId: "inventory",
                        fieldId: "custcol_advs_st_equipment_link",
                        value: vinID
                    });
                    //cha
                    invRec.setCurrentSublistValue({
                        sublistId: "inventory",
                        fieldId: "cseg_advs_st_vin_se",
                        value: vinSeg
                    });
                    invRec.setCurrentSublistValue({
                        sublistId: "inventory",
                        fieldId: "cseg_stock_num_seg_",
                        value: stockSeg
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
                        fieldId: 'issueinventorynumber',
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
                        ignoreMandatoryFields: true
                    });

                    recordTypeArr.push("inventoryadjustment");
                    recordIdArr.push(recordId);


                    /**
                     *
                     * Create FAM
                     *
                     * */
                    var assetType = "1";
                    var residual = 0;
                    var depreMethod = "3";
                    var assetLifeTime = 0;

                    var famObj = {};
                    famObj.name = vinName;
                    famObj.assettype = assetType;
                    famObj.subsidiaries = subsi;
                    famObj.location = LocID;
                    famObj.purchasecost = purChasecost;
                    famObj.currentvalue = CValue;
                    famObj.residual = residual;
                    famObj.depreciationmethod = depreMethod;
                    famObj.assetlifetime = assetLifeTime;
                    famObj.vinid = vinID;
                    famObj.depreciationactive = 1;
                    famObj.tranid = recordId;
                    famObj.includereport = true;
                    famObj.revisionrules = 1;
                    famObj.depreciationrules = 2;
                    famObj.podate = convPodate;
                    famObj.department = 4;




                    const generatedValues = generateAssetValuesFromProposal(famObj)
                    const assetFieldValues = generatedValues.assetFieldValues;
                    const assetObj = record.create({
                        type: 'customrecord_ncfar_asset',
                        isDynamic: true
                    });

                    for (const fld in assetFieldValues) {
                        assetObj.setValue({
                            fieldId: fld,
                            value: assetFieldValues[fld]
                        });
                    }

                    const assetId = assetObj.save();
                    recordTypeArr.push("customrecord_ncfar_asset");
                    recordIdArr.push(assetId);

                    log.debug({title: 'Asset Created', details: 'Id: ' + assetId});






                    var vmrec = record.load({
                        type: "customrecord_advs_vm",
                        id: vinID,
                        isDynamic: true
                    });
                    vmrec.setValue({
                        fieldId: "custrecord_advs_t_tinv_type",
                        value: 2
                    });
                    vmrec.setValue({
                        fieldId: "custrecord_advs_vm_vehicle_status",
                        value: 3
                    });
                    vmrec.setValue({
                        fieldId:"custrecord_advs_fam_asset_link",
                        value:assetId
                    });
                    vmrec.setValue({
                        fieldId: "custrecord_advs_t_tinv_type",
                        value: 2
                    });

                    var recmach = "recmachcustrecord_advs_f_a_transfer_info";
                    vmrec.selectNewLine({sublistId: recmach});
                    vmrec.setCurrentSublistValue({
                        sublistId: recmach,
                        fieldId: "custrecord_advs_f_a_t_i_date",
                        value: DateC
                    });
                    vmrec.setCurrentSublistValue({
                        sublistId: recmach,
                        fieldId: "custrecord_advs_f_a_t_in_adj",
                        value: recordId
                    });
                    vmrec.setCurrentSublistValue({
                        sublistId: recmach,
                        fieldId: "custrecord_advs_f_a_t_i_memo",
                        value: Memo
                    });
                    vmrec.setCurrentSublistValue({
                        sublistId: recmach,
                        fieldId: "custrecord_advs_f_a_t_i_cost",
                        value: CValue
                    });
                    vmrec.commitLine({sublistId: recmach})
                    vmrec.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });


                }catch(e){
                    log.error("e",e.message);

                    for(var m=0;m<recordTypeArr.length;m++){
                        var recordTYpe = recordTypeArr[m];
                        var recId = recordIdArr[m];
                        record.delete({type:recordTYpe,id:recId});
                    }
                }



                var onclickScript=" <html><body> <script type='text/javascript'>" +
                    "try{" +

                    "";
                onclickScript+="window.parent.location.reload();";
                onclickScript+="var theWindow = window.parent.closePopup();" ;
                   
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
                ["subsidiary","anyof",vinSubsi]],
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
    };

    return {
        assetFieldValues: assetFieldValues,
    };
}
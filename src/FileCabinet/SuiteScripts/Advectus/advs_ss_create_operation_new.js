/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/format', 'N/log', 'N/record', 'N/redirect', 'N/runtime', 'N/search', 'N/ui/serverWidget','N/url','N/https','N/currentRecord'],
    /**
     * @param{format} format
     * @param{log} log
     * @param{record} record
     * @param{redirect} redirect
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (format, log, record, redirect, runtime, search, serverWidget,url,https,currentRecord) => {
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

            if (request.method === 'GET') {  

                const stage_1 = request.parameters.custparam_stage_1;
                const stage_2 = request.parameters.custparam_stage_2;
                const internalID = request.parameters.custparam_internalid;
                const record_id = request.parameters.custparam_record_id;

                var OrderId		=	request.parameters.custparam_ord_id;
                var DocNumber		=	request.parameters.custparam_doc_number;
                var EquipmentLink	=	request.parameters.custparam_mac_id;
                var RepType			=	request.parameters.custparam_rep_type;
                var Location		=	request.parameters.custparam_loc_id;
                var OrderType		=	request.parameters.custparam_ord_type;
                var labor_codes 	=	request.parameters.custparam_sub_lab_codes;
                var OrderDate		=	request.parameters.custparam_ordDate;
                var SUbsidiaryId	=	request.parameters.custparam_subsidiary;
                var Terms			=	request.parameters.custparam_terms;
                var Department		=	request.parameters.custparam_department;
                var Prom_Date		=	request.parameters.custparam_prom_date;
                var In_HMR			=	request.parameters.custparam_in_hmr;
                var In_Odometer		=	request.parameters.custparam_in_odometer;
                var In_Def			=	request.parameters.custparam_in_def;
                var Customer		=	request.parameters.custparam_customerid;
                var TruckUnit		=	request.parameters.custparam_truck_unit;
                var CreatedFrom		=	request.parameters.custparam_create_from;
                var SalesRep		=	request.parameters.custparam_salesrep;
                var OutSideSalesRep	=	request.parameters.custparam_outside_salesrep; 
                var reFerenceNO     =   request.parameters.custparam_refno;
                var Complaint       = request.parameters.custparam_complaint; 
                var Comments        = request.parameters.custparam_dropoff;  
                log.debug("reFerenceNO",reFerenceNO)
                
                if(record_id){
                    var loadRec = record.load({
                        type: 'customrecord_advs_create_temp_data',
                        id: record_id,
                        isDynamic: true 
                    });

//						Retrieve field values
                    var DocNumber = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_document'
                    });
                    var EquipmentLink = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_truck'
                    });
                    var Location = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_location'
                    });
                    var OrderType = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_order_type'
                    });
                    var OrderDate = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_order_date'
                    });
                    var SUbsidiaryId = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_subsidiary'
                    });
                    var Terms = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_terms'
                    });
                    var Prom_Date = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_promise_date'
                    });
                    var In_HMR = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_in_hmr'
                    });
                    var In_Odometer = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_in_odometer'
                    });
                    var In_Def = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_in_def'
                    });
                    var OrderId = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_order_id'
                    });
                    var Customer = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_customer'
                    });
                    var TruckUnit = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_truck_unit'
                    });
                    var CreatedFrom = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_created_from'
                    });
                    var SalesRep = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_sales_rep'
                    });
                    var OutSideSalesRep = loadRec.getValue({
                        fieldId: 'custrecord_advs_c_t_out_side_sales_rep'
                    });

                }

                var form = serverWidget.createForm({
                    title: 'Select Labor'
                });  


                var htmlField = form.addField({
                    id: 'custpage_html',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Html',
                    container: 'outsidebelow'
                });

                // Construct HTML string with hidden input fields
                var Htmlvalue = '';
                Htmlvalue += "<input type='hidden' name='custpage_order_date' id='custpage_order_date' value='" + OrderDate + "'/>";
                Htmlvalue += "<input type='hidden' name='custpage_subsidiary' id='custpage_subsidiary' value='" + SUbsidiaryId + "'/>";
                Htmlvalue += "<input type='hidden' name='custpage_terms' id='custpage_terms' value='" + Terms + "'/>";
                Htmlvalue += "<input type='hidden' name='custpage_department' id='custpage_department' value='" + Department + "'/>";
                Htmlvalue += "<input type='hidden' name='custpage_prom_date' id='custpage_prom_date' value='" + Prom_Date + "'/>";
                Htmlvalue += "<input type='hidden' name='custpage_in_hmr' id='custpage_in_hmr' value='" + In_HMR + "'/>";
                Htmlvalue += "<input type='hidden' name='custpage_in_odometer' id='custpage_in_odometer' value='" + In_Odometer + "'/>";
                Htmlvalue += "<input type='hidden' name='custpage_in_def' id='custpage_in_def' value='" + In_Def + "'/>";
                Htmlvalue += "<input type='hidden' name='custpage_order_customer' id='custpage_order_customer' value='" + Customer + "'/>";
                Htmlvalue += "<input type='hidden' name='custpage_truck_unit' id='custpage_truck_unit' value='" + TruckUnit + "'/>";
                Htmlvalue += "<input type='hidden' name='custpage_create_from' id='custpage_create_from' value='" + CreatedFrom + "'/>";
                Htmlvalue += "<input type='hidden' name='custpage_sales_rep' id='custpage_sales_rep' value='" + SalesRep + "'/>";
                Htmlvalue += "<input type='hidden' name='custpage_outside_salesrep' id='custpage_outside_salesrep' value='" + OutSideSalesRep + "'/>";

                htmlField.defaultValue = Htmlvalue;

                //------------------------------------------
                var ui =serverWidget; 
                var stg1 = form.addField({id:"custpage_stage1", type: ui.FieldType.CHECKBOX, label:"Stage 1"}).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var stg2 =form.addField({id:"custpage_stage2", type: ui.FieldType.CHECKBOX, label:"Stage 2"}).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                var customerName = form.addField({
                    id: 'custpage_order_customer',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Customer',
                    source: 'customer',
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.INLINE
                });

                var refno_fld = form.addField({
                    id: 'custpage_refno',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Reference no'
                });
                refno_fld.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                if(reFerenceNO){
                    refno_fld.defaultValue =reFerenceNO;
                }

                var dropOff_fld = form.addField({
                    id: 'custpage_dropoff',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'DropOff Comments'
                });
                dropOff_fld.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                if (Comments) {
                    dropOff_fld.defaultValue = Comments;
                } 

                var complaint_fld = form.addField({
                    id: 'custpage_complaintt',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'Complaint'
                });
                complaint_fld.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                if (Complaint) {
                    complaint_fld.defaultValue = Complaint;
                }


                var orderFld = form.addField({
                    id: 'custpage_order',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Transaction',
                    source: 'transaction',
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });


                var locationFld = form.addField({
                    id: 'custpage_location',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Location',
                    source: 'location',
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });


                var subsidiaryFld = form.addField({
                    id: 'custpage_subsidiary',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Subsidiary',
                    source: 'subsidiary',
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.INLINE
                });


                var ordTypeFld = form.addField({
                    id: 'custpage_ord_type',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Order Type',
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });


                var DocNumberFld = form.addField({
                    id: 'custpage_doc_num',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Document #',
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                var recordIdFld = form.addField({
                    id: 'custpage_record_id',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Record Id',
                    source: 'customrecord_advs_create_temp_data',
                    //displayType: serverWidget.FieldDisplayType.HIDDEN
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });


                var VinFld = form.addField({
                    id: 'custpage_truck_vin',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Vin #',
                    source: 'customrecord_advs_vm',
                    // displayType: serverWidget.FieldDisplayType.HIDDEN
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });


                var operatType_fld = form.addField({
                    id: 'custpage_list_ope_type',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Type',
                    source: 'customlist_advs_oper_type',
                    //displayType: serverWidget.FieldDisplayType.HIDDEN
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });


                var orderDate_fld = form.addField({
                    id: 'custpage_order_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'orderDate',
                    //displayType: serverWidget.FieldDisplayType.HIDDEN
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });


                var terms_fld = form.addField({
                    id: 'custpage_terms',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Terms',
                    source: 'term',
                    //displayType: serverWidget.FieldDisplayType.HIDDEN
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });


                var prom_Date_fld = form.addField({
                    id: 'custpage_prom_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'Promise Date',
                    //displayType: serverWidget.FieldDisplayType.HIDDEN
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });


                var inHmr_fld = form.addField({
                    id: 'custpage_in_hmr',
                    type: serverWidget.FieldType.FLOAT,
                    label: 'inHmr',
                    //displayType: serverWidget.FieldDisplayType.HIDDEN
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                var inOdometer_fld = form.addField({
                    id: 'custpage_in_odometer',
                    type: serverWidget.FieldType.FLOAT,
                    label: 'inOdometer',
                    //displayType: serverWidget.FieldDisplayType.HIDDEN
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                var inDef_fld = form.addField({
                    id: 'custpage_in_def',
                    type: serverWidget.FieldType.FLOAT,
                    label: 'inDef',
                    source: 'customlist_advs_oper_type',
                    //displayType: serverWidget.FieldDisplayType.HIDDEN
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });


                var createdFrom_fld = form.addField({
                    id: 'custpage_create_from',
                    type: serverWidget.FieldType.SELECT,
                    label: 'createdFrom',
                    source: 'transaction',
                    //displayType: serverWidget.FieldDisplayType.HIDDEN
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });


                var salesRep_fld = form.addField({
                    id: 'custpage_sales_rep',
                    type: serverWidget.FieldType.SELECT,
                    label: 'SalesRep',
                    source: 'employee',
                    //displayType: serverWidget.FieldDisplayType.HIDDEN
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });


                var outsideSalesRep_fld = form.addField({
                    id: 'custpage_outside_salesrep',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Outside SalesRep',
                    source: 'employee',
                    //displayType: serverWidget.FieldDisplayType.HIDDEN
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                var billingCustomer_fld = form.addField({
                    id: 'custpage_billingcustomer',
                    type: serverWidget.FieldType.SELECT,
                    label: 'billingCustomer',
                    source: 'customer',
                    //displayType: serverWidget.FieldDisplayType.HIDDEN
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });


                if(stage_1 == 'T' || stage_1 == true){
                    stg1.defaultValue = stage_1;
                }

                if(stage_2 == 'T' || stage_2 == true ){
                    stg2.defaultValue = stage_2;

                    form.addButton({
                        id : 'buttonid',
                        label : 'Back',
                        functionName: "back()"
                    });

                }


                if (record_id) {
                    recordIdFld.defaultValue = record_id;
                }  

                if(Customer){
                    customerName.defaultValue = Customer;
                } 

                if (Location) {
                    locationFld.defaultValue = Location;
                }  

                if(SUbsidiaryId){
                    subsidiaryFld.defaultValue = SUbsidiaryId;
                }

                if (OrderType) {
                    ordTypeFld.defaultValue = OrderType;
                } 

                if (OrderId) {
                    orderFld.defaultValue = OrderId;
                } 

                if (DocNumber) {
                    DocNumberFld.defaultValue = DocNumber;
                } 

                if (EquipmentLink) {
                    VinFld.defaultValue = EquipmentLink;
                } 

                if (OrderDate) {
                    orderDate_fld.defaultValue = OrderDate;
                } 

                if (Terms) {
                    terms_fld.defaultValue = Terms;
                }  

                if (Prom_Date) {
                    prom_Date_fld.defaultValue = Prom_Date;
                }   

                if (In_HMR) {
                    inHmr_fld.defaultValue = In_HMR;
                }  

                if (In_Odometer) {
                    inOdometer_fld.defaultValue = In_Odometer;
                }  

                if (In_Def) {
                    inDef_fld.defaultValue = In_Def;
                }  

                if (CreatedFrom) {
                    createdFrom_fld.defaultValue = CreatedFrom;
                }  

                if (SalesRep) {
                    salesRep_fld.defaultValue = SalesRep;
                }   

                if (OutSideSalesRep) {
                    outsideSalesRep_fld.defaultValue = OutSideSalesRep;
                }  

                // if (bilingCustomer) {
                    //     billingCustomer_fld.defaultValue = In_Def;
                    // } 


                operatType_fld.defaultValue = 1; // Setting default value
                operatType_fld.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED // Disabling field
                });



//					--Stage 1----------
                if(stage_1=='T'){ 
                    var sublist = form.addSublist({ id: 'custpage_sublst', type: 'list', label: 'Labor Codes' });
                    sublist.addMarkAllButtons();
                    sublist.addField({ id: 'custpage_chkbx', type: ui.FieldType.CHECKBOX, label: 'Select' }); 
                    sublist.addField({ id: 'custpage_item', type: ui.FieldType.TEXT, label: 'Item Code' }).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });
                    sublist.addField({ id: 'custpage_labor', type: ui.FieldType.SELECT, label: 'Labor',source:'item' }).updateDisplayType({ displayType: ui.FieldDisplayType.INLINE });
                    sublist.addField({ id: 'custpage_operation', type: ui.FieldType.SELECT, label: 'Operation Code',source:'customrecord_advs_st_labor_ob_code' }).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });
                    sublist.addField({ id: 'custpage_itemdesc', type: ui.FieldType.TEXT, label: 'Description' });
                    sublist.addField({ id:"custpage_labor_hours", type: ui.FieldType.TEXT, label: "Labor Hrs"}).updateDisplayType({ displayType: ui.FieldDisplayType.INLINE });
                    sublist.addField({id:"custpage_goal_hours", type: ui.FieldType.TEXT,label: "Goal Hrs"});
                    sublist.addField({id:"custpage_fixed", type: ui.FieldType.CHECKBOX, label:"Fixed"}).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });
                    sublist.addField({ id: 'custpage_labor_rate', type: ui.FieldType.TEXT, label: 'Labor rate' }).updateDisplayType({ displayType: ui.FieldDisplayType.INLINE });
                    var FixQty   = sublist.addField({id:"custpage_labor_quan", type: ui.FieldType.TEXT, label:"Quantity"}).updateDisplayType({ displayType: ui.FieldDisplayType.ENTRY });
                    var FixQtyhidden   = sublist.addField({id:"custpage_labor_quan_hidden", type: ui.FieldType.TEXT, label:"Quantity Hidden"}).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });
                    sublist.addField({id:"custpage_complaint", type: ui.FieldType.TEXTAREA,label: "COMPLAINT"}).updateDisplayType({ displayType: ui.FieldDisplayType.ENTRY });
                    sublist.addField({id:"custpage_cause",type: ui.FieldType.TEXTAREA,label: "CAUSE"}).updateDisplayType({ displayType: ui.FieldDisplayType.ENTRY });
                    sublist.addField({id:"custpage_correction",type: ui.FieldType.TEXTAREA,label: "CORRECTION"}).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });
                    sublist.addField({ id: 'custpage_internalid', type: ui.FieldType.TEXT, label: 'Internal Id' }).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });
                    sublist.addField({ id: 'custpage_invtype', type: ui.FieldType.SELECT, label: 'Inventory Type' , source:'customrecord_advs_inventory_type'}).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });
                    sublist.addField({
                        id: "custpage_mech",
                        type: serverWidget.FieldType.SELECT,
                        label: "Technician",
                        source: "customrecord_advs_mechanic"
                    }).updateDisplayType({ displayType: ui.FieldDisplayType.ENTRY });

                    loadAndRunLaborListSearch(sublist,Location,Customer,FixQty,ui); 

                    form.addSubmitButton({
                        label: 'Next'
                    });

                } 

//------Stage 2------------- 

                if(stage_2=='T'){ 

                    var sublist_2 = form.addSublist({ id: 'custpage_sublst2', type: 'list', label: 'Selected Lines' }); 

                    //sublist_2.addField({ id: 'custpage_item2', type: ui.FieldType.TEXT, label: 'Item Code' }).updateDisplayType({ displayType: ui.FieldDisplayType.INLINE });
                    sublist_2.addField({ id: 'custpage_labor2', type: ui.FieldType.SELECT, label: 'Labor',source:'item' }).updateDisplayType({ displayType: ui.FieldDisplayType.INLINE });
                    sublist_2.addField({ id: 'custpage_operation2', type: ui.FieldType.SELECT, label: 'Operation Code',source:'customrecord_advs_st_labor_ob_code' }).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });
                    sublist_2.addField({ id: 'custpage_itemdesc2', type: ui.FieldType.TEXT, label: 'Description' });
                    sublist_2.addField({ id:"custpage_labor_hours2", type: ui.FieldType.TEXT, label: "Labor Hrs"}).updateDisplayType({ displayType: ui.FieldDisplayType.INLINE });
                    sublist_2.addField({id:"custpage_goal_hours2", type: ui.FieldType.TEXT,label: "Goal Hrs"});//.setDisplayType("hidden");
                    //sublist_2.addField({id:"custpage_fixed2", type: ui.FieldType.CHECKBOX, label:"Fixed"});
                    sublist_2.addField({id:"custpage_labor_quan2", type: ui.FieldType.TEXT, label:"Quantity"}).updateDisplayType({ displayType: ui.FieldDisplayType.INLINE });;
                    // sublist_2.addField({id:"custpage_complaint2", type: ui.FieldType.TEXTAREA,label: "COMPLAINT"}).updateDisplayType({ displayType: ui.FieldDisplayType.ENTRY });
                    // sublist_2.addField({id:"custpage_cause2",type: ui.FieldType.TEXTAREA,label: "CAUSE"}).updateDisplayType({ displayType: ui.FieldDisplayType.ENTRY }); 
                    sublist_2.addField({
                        id: "custpage_operation_remove",
                        type: serverWidget.FieldType.TEXT,
                        label: "Remove"
                    });//.updateDisplayType({ displayType: ui.FieldDisplayType.INLINE });


					sublist_2.addField({
                        id: "custpage_lineid",
                        type: serverWidget.FieldType.TEXT,
                        label: "Line id"
                    }).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });

                    sublist_2.addField({ id: 'custpage_internalid2', type: ui.FieldType.TEXT, label: 'Internal Id' }).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });

					

                    form.addSubmitButton("Submit"); 


                    setSublist2Values(sublist_2,internalID,record_id,form);
                }


                form.clientScriptModulePath = './advs_cs_add_operations_new.js';

                scriptContext.response.writePage(form);

            }else{ 

                var stage_1 = request.parameters.custpage_stage1;
                var stage_2 = request.parameters.custpage_stage2;
                var record_id = request.parameters.custpage_record_id;



                var lineCount = request.getLineCount({ group: 'custpage_sublst' });
                var parameters	=	new Array();
                var LaborCodes	=	new Array();
                var internalIds = new Array();
                var TempRecordId	=	"";



                if(stage_1=='T'){    


                    //var ope_type		=	request.parameters.custpage_list_ope_type;
                    var OrderId			=	request.parameters.custpage_order;
                    var Location		=	request.parameters.custpage_location;
                    var OrderType		=	request.parameters.custpage_ord_type;
                    var DocNumber		=	request.parameters.custpage_doc_num;
                    var TruckLink		=	request.parameters.custpage_truck_vin;

                    var OrdrDate		=	request.parameters.custpage_order_date;
                    var SUbsidiaryId	=	request.parameters.custpage_subsidiary;
                    var Terms			=	request.parameters.custpage_terms;
                    var Department		=	request.parameters.custpage_department;
                    var Promise_Date		=	request.parameters.custpage_prom_date;
                    var In_HMR			=	request.parameters.custpage_in_hmr;
                    var In_Odometer		=	request.parameters.custpage_in_odometer;
                    var In_Def			=	request.parameters.custpage_in_def;
                    var Customer		=	request.parameters.custpage_order_customer;
                    var TruckUnit		=	request.parameters.custpage_truck_unit;
                    var CreatedFrom		=	request.parameters.custpage_create_from;
                    var SalesRep		=	request.parameters.custpage_sales_rep;
                    var OutSideSalesRep	=	request.parameters.custpage_outside_salesrep; 
                    var poRefNo         =   request.parameters.custpage_refno; 


                    if(OrdrDate){
                        var OrderDate = format.parse({
                            value: OrdrDate,
                            type: format.Type.DATE
                        }); 

                        if(Promise_Date){
                            var Prom_Date = format.parse({
                                value: Promise_Date,
                                type: format.Type.DATE
                            }); 
                        }
                    }

                    if(!record_id){ 
                        var temprecord = record.create({
                            type: 'customrecord_advs_create_temp_data',
                            isDynamic: true
                        });

                        // Set field values using the setValue method
                        temprecord.setValue({
                            fieldId: 'custrecord_advs_c_t_document',
                            value: DocNumber
                        });
                        temprecord.setValue({
                            fieldId: 'custrecord_advs_c_t_order_type',
                            value: OrderType
                        });
                        temprecord.setValue({
                            fieldId: 'custrecord_advs_c_t_location',
                            value: Location
                        });
                        temprecord.setValue({
                            fieldId: 'custrecord_advs_c_t_truck',
                            value: TruckLink
                        }); 

                        temprecord.setValue({
                            fieldId: 'custrecord_advs_c_t_order_date',
                            value: OrderDate
                        });
                        temprecord.setValue({
                            fieldId: 'custrecord_advs_c_t_subsidiary',
                            value: SUbsidiaryId
                        });
                        temprecord.setValue({
                            fieldId: 'custrecord_advs_c_t_terms',
                            value: Terms
                        }); 

                        if(Prom_Date){
                            temprecord.setValue({
                                fieldId: 'custrecord_advs_c_t_promise_date',
                                value: Prom_Date
                            });
                        }

                        temprecord.setValue({
                            fieldId: 'custrecord_advs_c_t_in_hmr',
                            value: In_HMR
                        });
                        temprecord.setValue({
                            fieldId: 'custrecord_advs_c_t_in_odometer',
                            value: In_Odometer
                        });
                        temprecord.setValue({
                            fieldId: 'custrecord_advs_c_t_in_def',
                            value: In_Def
                        });
                        temprecord.setValue({
                            fieldId: 'custrecord_advs_c_t_customer',
                            value: Customer
                        });
                        temprecord.setValue({
                            fieldId: 'custrecord_advs_c_t_created_from',
                            value: CreatedFrom
                        });
                        temprecord.setValue({
                            fieldId: 'custrecord_advs_c_t_sales_rep',
                            value: SalesRep
                        });
                        temprecord.setValue({
                            fieldId: 'custrecord_advs_c_t_out_side_sales_rep',
                            value: OutSideSalesRep
                        });




                    }else{
                        var temprecord = record.load({
                            type: 'customrecord_advs_create_temp_data',
                            id:record_id ,
                            isDynamic: true
                        });

                    }



                    for (var i = 0; i < lineCount; i++) {
                        var isSelected =request.getSublistValue({
                            group: 'custpage_sublst',
                            name: 'custpage_chkbx',
                            line: i
                        });

                        if (isSelected=='T'){

                            var intId = request.getSublistValue({
                                group: 'custpage_sublst',
                                name: 'custpage_internalid',
                                line: i
                            }); 

                            var Labor = request.getSublistValue({
                                group: 'custpage_sublst',
                                name: 'custpage_labor',
                                line: i
                            });

                            var OpCode = request.getSublistValue({
                                group: 'custpage_sublst',
                                name: 'custpage_operation',
                                line: i
                            });


                            var LaborDesc = request.getSublistValue({
                                group: 'custpage_sublst',
                                name: 'custpage_itemdesc',
                                line: i
                            }); 

                            var itemCode = request.getSublistValue({
                                group: 'custpage_sublst',
                                name: 'custpage_item',
                                line: i
                            }); 

                            var inventoryType = request.getSublistValue({
                                group: 'custpage_sublst',
                                name: 'custpage_invtype',
                                line: i
                            }); 

                            var laborRate = request.getSublistValue({
                                group: 'custpage_sublst',
                                name: 'custpage_labor_rate',
                                line: i
                            }); 

                            var goalHours = request.getSublistValue({
                                group: 'custpage_sublst',
                                name: 'custpage_goal_hours',
                                line: i
                            });  

                            var laborHours = request.getSublistValue({
                                group: 'custpage_sublst',
                                name: 'custpage_labor_hours',
                                line: i
                            });  

                            var causeL = request.getSublistValue({
                                group: 'custpage_sublst',
                                name: 'custpage_cause',
                                line: i
                            });   

                            var complaintL = request.getSublistValue({
                                group: 'custpage_sublst',
                                name: 'custpage_complaint',
                                line: i
                            });  

                            var correctionL = request.getSublistValue({
                                group: 'custpage_sublst',
                                name: 'custpage_correction',
                                line: i
                            });  

                            var quantity = request.getSublistValue({
                                group: 'custpage_sublst',
                                name: 'custpage_labor_quan',
                                line: i
                            });



                            var mechL = request.getSublistValue({
                                group: 'custpage_sublst',
                                name: 'custpage_mech',
                                line: i
                            });

                            log.debug("mechL",mechL)
                            log.debug("LaborDesc+itemCode+intId+inventoryType",LaborDesc+"-"+itemCode+"-"+intId+"-"+inventoryType) 
                            //internalIds.push(intId); 

                            //creating child record
                            var RecMach		=	"recmachcustrecord_advs_t_c_head"; 
                            temprecord.selectNewLine({
                                sublistId: 'recmachcustrecord_advs_t_c_head'
                            });

                            // Set values for the line item fields
                            // temprecord.setCurrentSublistValue({
                            //     sublistId: 'recmachcustrecord_advs_t_c_head',
                            //     fieldId: 'custrecord_advs_t_c_labor',
                            //     value: itemCode
                            // });

                            temprecord.setCurrentSublistValue({
                                sublistId: 'recmachcustrecord_advs_t_c_head',
                                fieldId: 'custrecord_advs_t_c_labor_rate',
                                value: laborRate
                            });

                            // temprecord.setCurrentSublistValue({
                            //     sublistId: 'recmachcustrecord_advs_t_c_head',
                            //     fieldId: 'custrecord_advs_t_c_operation_code',
                            //     value: itemCode
                            // });

                            temprecord.setCurrentSublistValue({
                                sublistId: 'recmachcustrecord_advs_t_c_head',
                                fieldId: 'custrecord_advs_t_c_inv_type',
                                value: inventoryType
                            }); 

                            temprecord.setCurrentSublistValue({
                                sublistId: 'recmachcustrecord_advs_t_c_head',
                                fieldId: 'custrecord_advs_t_c_labor',
                                value: Labor

                            });

                            temprecord.setCurrentSublistValue({
                                sublistId: 'recmachcustrecord_advs_t_c_head',
                                fieldId: 'custrecord_advs_t_c_operation_code',
                                value: OpCode
                            });

                            // temprecord.setCurrentSublistValue({
                            //     sublistId: 'recmachcustrecord_advs_t_c_head',
                            //     fieldId: 'custrecord_advs_t_c_part',
                            //     value: correctionL
                            // });

                            temprecord.setCurrentSublistValue({
                                sublistId: 'recmachcustrecord_advs_t_c_head',
                                fieldId: 'custrecord_advs_t_c_operation_desc',
                                value: LaborDesc
                            });

                            temprecord.setCurrentSublistValue({
                                sublistId: 'recmachcustrecord_advs_t_c_head',
                                fieldId: 'custrecord_advs_t_c_labor_quantity',
                                value: laborHours
                            });

                            temprecord.setCurrentSublistValue({
                                sublistId: 'recmachcustrecord_advs_t_c_head',
                                fieldId: 'custrecord_advs_t_c_goal_hours',
                                value: goalHours
                            });

                            temprecord.setCurrentSublistValue({
                                sublistId: 'recmachcustrecord_advs_t_c_head',
                                fieldId: 'custrecord_advs_t_c_quantity',
                                value: quantity
                            });
                            if(correctionL){
                                temprecord.setCurrentSublistValue({
                                    sublistId: 'recmachcustrecord_advs_t_c_head',
                                    fieldId: 'custrecord_advs_t_c_remarks',
                                    value: correctionL
                                });

                            }


                            temprecord.setCurrentSublistValue({
                                sublistId: 'recmachcustrecord_advs_t_c_head',
                                fieldId: 'custrecord_advs_c_t_d_cause',
                                value: causeL
                            });

                            temprecord.setCurrentSublistValue({
                                sublistId: 'recmachcustrecord_advs_t_c_head',
                                fieldId: 'custrecord_advs_c_t_d_c_tech',
                                value: mechL
                            });

                            temprecord.setCurrentSublistValue({
                                sublistId: 'recmachcustrecord_advs_t_c_head',
                                fieldId: 'custrecord_advs_c_t_complaint',
                                value: complaintL
                            });

                            // Commit the line item
                            temprecord.commitLine({
                                sublistId: 'recmachcustrecord_advs_t_c_head'
                            });

                        }


                    } 
                    // Save the record
                    var recordId = temprecord.save();


                    // log.debug("internalIds",internalIds)
                    parameters['custparam_stage_2']		    =	'T'; 
                    parameters['custparam_internalid']		=	intId; 
                    parameters['custparam_record_id']		=	recordId;
                    parameters['custparam_refno']		    =	poRefNo;




                    redirect.toSuitelet({
                        scriptId: 'customscript_advs_ss_create_operationnew',
                        deploymentId: 'customdeploy_advs_ss_create_operationnew',
                        parameters: parameters
                    });

                }
                if(stage_2=='T'){ 
                    var RefNO	=	request.parameters.custpage_refno; 
                    var Comments = request.parameters.custpage_dropoff;
                    var Complaint = request.parameters.custpage_complaintt;


                    try{
                        var LoadRec = record.load({
                            type: 'customrecord_advs_create_temp_data',
                            id: record_id,
                            isDynamic: true
                        });

                        var DocNumber = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_document'
                        });
                        var Location = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_location'
                        });
                        var VINLink = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_truck'
                        });
                        var TruckUnit = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_truck_unit'
                        });
                        var SalesType = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_order_type'
                        });
                        var OrderId = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_order_id'
                        });
                        var Customer = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_customer'
                        });
                        var ORderDate = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_order_date'
                        });
                        var PromiseDate = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_promise_date'
                        });
                        var Terms = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_terms'
                        });
                        var InHMR = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_in_hmr'
                        });
                        var InOdometer = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_in_odometer'
                        });
                        var InDef = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_in_def'
                        });
                        var CreatedFrom = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_created_from'
                        });
                        var SalesRep = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_sales_rep'
                        });
                        var OutSideSalesRep = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_out_side_sales_rep'
                        });
                        var billingCust = LoadRec.getValue({
                            fieldId: 'custrecord_advs_temp_billing_customer'
                        });
                        var VINLinkName = LoadRec.getText({
                            fieldId: 'custrecord_advs_c_t_truck'
                        });  

                        var Subsidary = LoadRec.getValue({
                            fieldId: 'custrecord_advs_c_t_subsidiary'
                        }); 
                        log.debug("OrderId+CreatedFrom1+Subsidary",CreatedFrom+"-"+CreatedFrom+"-"+Subsidary)
                        if (!OrderId && CreatedFrom) {
                            log.debug("OrderId+CreatedFrom",CreatedFrom+"-"+CreatedFrom)
                            var transformRecObj = record.transform({
                                fromType: record.Type.ESTIMATE,
                                fromId: CreatedFrom,
                                toType: record.Type.SALES_ORDER,
                                isDynamic: true
                            });
                        
                            // transformRecObj.setValue({
                            //     fieldId: 'custbody_advs_service_apprname',
                            //     value: ''
                            // });
                        
    
                        
                            // transformRecObj.setValue({
                            //     fieldId: 'custbody_advs_service_apprphone',
                            //     value: ''
                            // });
                        
                            // transformRecObj.setValue({
                            //     fieldId: 'custbody_advs_service_appremail',
                            //     value: ''
                            // });
                        
                            OrderId = transformRecObj.save({
                                enableSourcing: true,
                                ignoreMandatoryFields: true
                            }); 
                            log.debug("OrderId est1",OrderId)
                            
                        } 
                        var SalesOrderObj = "";

                        if (OrderId) {
                            log.debug("OrderId est",OrderId)
                            SalesOrderObj = record.load({
                                type: SalesType,
                                id: OrderId,
                                isDynamic: true
                            });

                            GlobalDepartment = SalesOrderObj.getValue({
                                fieldId: "department"
                            });
                        } else {
                            var FormReferen = "";
                            if (SalesType === "salesorder") {
                                FormReferen = "repairsalesorder";
                            } else {
                                FormReferen = "servicequote";
                            }

                            var FormMapping = SearchFormMapping(FormReferen);
                            if (FormMapping) {
                                var RepairForm = FormMapping.repairForm;
                                var Department = FormMapping.department;
                                var ModuleName = FormMapping.moduleName;
                                GlobalDepartment = Department;
                            }    
                            var Custdepart = ''; 

                            if (SalesRep) {
                                var employeeLookup = search.lookupFields({
                                    type: search.Type.EMPLOYEE,
                                    id: SalesRep,
                                    columns: ['department']
                                });
                            }

                            var custdepart = employeeLookup.department[0].value;

                            if (!Department && custdepart) {
                                Department = custdepart;
                                log.debug("Department",Department)
                            } 

                            var SalesOrderObj = record.create({
                                type: SalesType,
                                isDynamic: true
                            });

                            log.debug("creating record","creating record")
                            SalesOrderObj.setValue({
                                fieldId: 'entity',
                                value: Customer
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'customform',
                                value: RepairForm
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'custbody_advs_module_name',
                                value: ModuleName
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'custbody_advs_doc_no',
                                value: DocNumber
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'custbody_advs_wo_billing_customer',
                                value: Customer
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'otherrefnum',
                                value: RefNO
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'custbody_advs_service_quote_memo',
                                value: Comments
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'custbody_advs_complaints',
                                value: Complaint
                            });

                            SalesOrderObj.setText({
                                fieldId: 'custbody_advs_st_search_serial_number',
                                text: TruckUnit
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'custbody_advs_st_service_equipment',
                                value: VINLink
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'trandate',
                                value: ORderDate
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'custbody_promisedate',
                                value: PromiseDate
                            }); 

                            SalesOrderObj.setValue({
                                fieldId: 'subsidiary',
                                value: Subsidary
                            });

                            log.debug("creating record Location",Location)
                            SalesOrderObj.setValue({
                                fieldId: 'location',
                                value: Location
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'department',
                                value: Department
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'custbody_advs_department',
                                value: Department
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'terms',
                                value: Terms
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'custbody_advs_f_in_hmr',
                                value: InHMR
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'custbody_advs_st_def_in',
                                value: InDef
                            }); 
                            if(InOdometer){
                                SalesOrderObj.setValue({
                                    fieldId: 'custbody_advs_st_odometer_in',
                                    value: InOdometer
                                });
                            }


                            SalesOrderObj.setValue({
                                fieldId: 'createdfrom',
                                value: CreatedFrom
                            });

                            SalesOrderObj.setValue({
                                fieldId: 'custbody_advs_st_out_side_sal_rep',
                                value: OutSideSalesRep
                            });

                            
                        }

                        var MecId="";
                            var CauseVal="";
                            var Memo="";
                            var RemarksBody="";
                            var CorrectionVal="";
                            var Memo="";
                            var AppName="";
                            var AppPhone="";
                            var AppEmail="";
                            var servLoca="";
                            var driverName ="",driverPhone="",delivaryMethodVal="",AdvsCreatedfrmVal="",BillCustVal="",isInternalVal="";
                            log.debug("start SearchOperationCodes+CorrectionVal","SearchOperationCodes"+CorrectionVal)
                        //GetSpecialPrice(Customer,Location);
                        SearchOperationCodes(record_id, SalesOrderObj, GlobalDepartment, CauseVal, CorrectionVal, MecId, DocNumber,
                                VINLink, RefNO,Comments,Complaint,Memo,RemarksBody,AppName,AppPhone,AppEmail,servLoca,driverName,
                                driverPhone,delivaryMethodVal,isInternalVal,CreatedFrom,BillCustVal,Customer,Location,OrderId,SalesType);
                        var SAlesOrderID = SalesOrderObj.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });
                        log.debug("LineCOunt SAlesOrderID",SAlesOrderID);
                        var Change = 'F';

                        var SalesOrdObj = record.load({
                            type:SalesType ,
                            id: SAlesOrderID,
                            isDynamic: true
                        });

                        var LineCOunt = SalesOrdObj.getLineCount({
                            sublistId: 'item'
                        });

                        log.debug("LineCOunt",LineCOunt);

                        for (var j = 0; j < LineCOunt; j++) {
                            var TaskIdOri = SalesOrdObj.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_advs_repair_task_link',
                                line: j
                            });
                            var TempId = SalesOrdObj.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_advs_temp_rep_task123',
                                line: j
                            });
                            log.debug("TempId",TempId);
                            if (!TaskIdOri && (TempId > 0)) {
                                log.debug("TaskIdOri",TaskIdOri);
                                 SalesOrdObj.selectLine({
                                     sublistId: 'item',
                                     line: j
                                 });
                                log.debug("Line selected",TempId)
                                 SalesOrdObj.setCurrentSublistValue({
                                     sublistId: 'item',
                                     fieldId: 'custcol_advs_repair_task_link',
                                     value: TempId,
                                    ignoreFieldChange: true
                                 });
                                 SalesOrdObj.setCurrentSublistValue({
                                     sublistId: 'item',
                                     fieldId: 'custcol_advs_temp_rep_task123',
                                     value: '',
                                    ignoreFieldChange: true
                                 });
                                 SalesOrdObj.commitLine({
                                     sublistId: 'item',
                                 });
                            }
                        }
                        var salesOrderId = SalesOrdObj.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });
                    }catch (e) {
                        log.error({
                            title: 'E',
                            details: e.toString()
                        });
                    }
                    var JobForEdit = 0;
                    var onclickScript=" <html><body> <script type='text/javascript'>" +
                    "try{debugger;" +
                    "var RecordType='"+SalesType+"';" +
                    "var RecordId='"+SAlesOrderID+"';" +
                    "";

                    onclickScript+="" +
                    "window.parent.RefreshWindowShaApprove(RecordId,RecordType);";
                   onclickScript+="window.parent.closePopup();";
                    onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";
                    response.write(onclickScript);

                }
            }

        }

return {onRequest} 

function loadAndRunLaborListSearch(sublist,Location,Customer,FixQty,ui) { 


    var line = 0;
    var laborSearch = search.load({
        id: 'customsearch_advs_labor_master'
    });  

    // var inventoryTypeColumn = search.createColumn({
    //     name: 'custitem_advs_inventory_type'
    // });


    // // Add the new column to the search
    // laborSearch.columns=inventoryTypeColumn;

    laborSearch.run().each(function(result) {

        var internalid = result.id;

        var item = result.getValue({
            name: 'itemid'
        });  

        var operation = result.getValue({
            name: 'custitem_advs_st_job_code_6_digit'
        }); 

        var itemDisplayNAme = result.getValue({
            name: 'displayname'
        });
        // log.debug("item+itemDisplayNAme+internalid",item+"-"+itemDisplayNAme+"-"+internalid);  

        var laborhrs = result.getValue({
            name: 'custitem_advs_al_labor_flat_rate'
        }); 
        var goalhrs = result.getValue({
            name: 'custitem_advs_at_goal_hours'
        });   

        var invType = result.getValue({
            name: 'custitem_advs_inventory_type'
        });

        log.debug("laborhrs+goalhrs+invType",laborhrs+"-"+goalhrs+invType); 

        if (operation){
            var filters = [
                ["custitem_advs_inventory_type","anyof","3","4"],
                "AND",
                ["isinactive","is","F"],
                "AND",
                ["custitem_advs_st_job_code_6_digit","anyof", operation]
                ];

            var columns = [
                search.createColumn({ name: "internalid" }),
                search.createColumn({ name: "displayname" }),
                search.createColumn({ name: "custitem_advs_al_labor_flat_rate" }),
                search.createColumn({ name: "custitem_advs_inventory_type" }),
                search.createColumn({ name: "custitem_advs_st_job_code_6_digit" }),
                search.createColumn({ name: "custitem_advs_at_parts_associated" }),
                search.createColumn({ name: "custrecord_st_o_p_m_description", join: "custitem_advs_st_job_code_6_digit" }),
                search.createColumn({ name: "custrecord_st_o_p_m_labor_hours", join: "custitem_advs_st_job_code_6_digit" }),
                search.createColumn({ name: "custrecord_st_o_p_m_fixed", join: "custitem_advs_st_job_code_6_digit" }),
                search.createColumn({ name: "custrecord_st_o_p_m_roll_up", join: "custitem_advs_st_job_code_6_digit" }),
                search.createColumn({ name: "custrecord_st_o_p_m_operation_code", join: "custitem_advs_st_job_code_6_digit" }),
                search.createColumn({ name: "custrecord_advs_st_o_p_m_sec_opr_code", join: "custitem_advs_st_job_code_6_digit" }),
                search.createColumn({ name: "custrecord_st_o_p_m_fixed_quantity", join: "custitem_advs_st_job_code_6_digit" }),
                search.createColumn({ name: "custrecord_st_o_p_m_goal_hours", join: "custitem_advs_st_job_code_6_digit" }),
                search.createColumn({ name: "custitem_advs_st_labor_group" }),
                search.createColumn({ name: "custitem_advs_inventory_type" }),
                search.createColumn({ name: "custitem_advs_at_primary_code" })
                ];

            // Create the search object
            var itemSearch = search.create({
                type: "item",
                filters: filters,
                columns: columns
            });  
            searchResult= itemSearch.run();
            searchResult.each(function(result) {
                var TempQty = result.getValue({ name: "custrecord_st_o_p_m_labor_hours", join: "custitem_advs_st_job_code_6_digit" });
                var Rollup = result.getValue({ name: "custrecord_st_o_p_m_roll_up", join: "custitem_advs_st_job_code_6_digit" });
                var FixedQuan = result.getValue({ name: "custrecord_st_o_p_m_fixed_quantity", join: "custitem_advs_st_job_code_6_digit" });
                var GoalHours = result.getValue({ name: "custrecord_st_o_p_m_goal_hours", join: "custitem_advs_st_job_code_6_digit" });
                var LaborID = result.getValue("internalid");
                var LbrGroup = result.getValue("custitem_advs_st_labor_group");
                var ItemInType = result.getValue("custitem_advs_inventory_type");
                var checkfixed = result.getValue({ name: "custrecord_st_o_p_m_fixed", join: "custitem_advs_st_job_code_6_digit" });
                var HiddenCheck = (checkfixed === 'T'|| checkfixed === true) ? 'T' : 'F'; 
                if (GoalHours){
                    sublist.setSublistValue({
                        id: 'custpage_goal_hours',
                        line: line,
                        value: GoalHours
                    });
                } 

                // if (checkfixed === "T" || checkfixed== true){

                //     log.debug("checkfixed",checkfixed)
                //     FixQty.updateDisplayType({ displayType: ui.FieldDisplayType.ENTRY});
                //     sublist.setSublistValue({
                //         id: 'custpage_fixed',
                //         line: line,
                //         value: HiddenCheck
                //     }); 

                //     sublist.setSublistValue({
                //         id: 'custpage_labor_quan',
                //         line: line,
                //         value: FixedQuan
                //     });



                //     sublist.setSublistValue({
                //         id: 'custpage_labor_quan_hidden',
                //         line: line,
                //         value: FixedQuan
                //     });
                // } 
                // else{
                //     FixQty.updateDisplayType({ displayType: ui.FieldDisplayType.ENTRY});
                // }

                log.debug("GoalHours+checkfixed",GoalHours+checkfixed);

                var LabGP   = LbrGroup;
                var inventoryType = ItemInType;
                var SpecialDataExist = checkDiscountforLaborCategory(Location,Customer)
                var SplitByHash		= SpecialDataExist.split("#advs");
                var SpecialData		=	SplitByHash[0];
                var LocRate			=	SplitByHash[1];	

                var LaborPrice	=	0;
                if(SpecialData == "T"){

                    if(LabGP){
                        if(CateGData[LabGP] != null && CateGData[LabGP] != undefined){
                            var CategSP		=	CateGData[LabGP]["SpecPri"]*1;
                            var CategSPDisc	=	CateGData[LabGP]["DiscSpec"];
                            if(CategSP>0){
                                LaborPrice	=	CategSP
                            }else {
                                if((LocRate>0) && (CategSPDisc)){
                                    CategSPDisc  = parseFloat(CategSPDisc);
                                    var Totaldisc = ((LocRate*CategSPDisc)/100);
                                    Totaldisc   = Totaldisc*1;
                                    Totaldisc   = Totaldisc.toFixed(2);
                                    Totaldisc   = Totaldisc*1;
                                    LaborPrice	=	Totaldisc
                                }
                            }
                        }else{
                            if(spPerDis || SPprice){
                                if(SPprice>0){
                                    LaborPrice	=	SPprice
                                }else {
                                    if((LocRate>0) && (spPerDis)){
                                        CategSPDisc  = parseFloat(spPerDis);
                                        var Totaldisc = ((LocRate*spPerDis)/100);
                                        Totaldisc   = Totaldisc*1;
                                        Totaldisc   = Totaldisc.toFixed(2);
                                        Totaldisc   = Totaldisc*1;
                                        LaborPrice	=	Totaldisc
                                    }
                                }
                            }
                        }
                    }else{
                        if(spPerDis || SPprice){
                            if(SPprice>0){
                                LaborPrice	=	SPprice
                            }else {
                                if((LocRate>0) && (spPerDis)){
                                    CategSPDisc  = parseFloat(spPerDis);
                                    var Totaldisc = ((LocRate*spPerDis)/100);
                                    Totaldisc   = Totaldisc*1;
                                    Totaldisc   = Totaldisc.toFixed(2);
                                    Totaldisc   = Totaldisc*1;
                                    LaborPrice	=	Totaldisc
                                }
                            }
                        }
                    }
                    if(LaborPrice <= 0){
                        LaborPrice	=	LocRate;
                    }
                }else{
                    LaborPrice	=	LocRate;
                }

                log.debug("LaborPrice", LaborPrice+"@LocRate@"+LocRate);


                sublist.setSublistValue({
                    id: 'custpage_labor_rate',
                    line: line,
                    value: LaborPrice
                });


                //Count++;
                return true;
            });


        }
        if(invType) {
            sublist.setSublistValue({
                id: 'custpage_invtype',
                line: line,
                value: invType
            });
        }


        sublist.setSublistValue({
            id: 'custpage_internalid',
            line: line,
            value: internalid
        });

        sublist.setSublistValue({
            id: 'custpage_item',
            line: line,
            value: item
        }); 

        sublist.setSublistValue({
            id: 'custpage_labor',
            line: line,
            value: internalid
        });

        sublist.setSublistValue({
            id: 'custpage_operation',
            line: line,
            value: operation
        });

        sublist.setSublistValue({
            id: 'custpage_itemdesc',
            line: line,
            value: itemDisplayNAme
        }); 

        if(laborhrs){
            sublist.setSublistValue({
                id: 'custpage_labor_hours',
                line: line,
                value:laborhrs
            });
        }

        if(goalhrs){
            sublist.setSublistValue({
                id: 'custpage_goal_hours',
                line: line,
                value: goalhrs
            });
        }


        line++
        return true;
    });
}
        //---------   

function setSublist2Values(sublist_2,intId,record_id,form){ 
    var line = 0;
    var RecMach		=	"custrecord_advs_t_c_head";
    //----------------------------------


    //------------------------
    var laborSearchObj = search.create({
        type: "customrecord_advs_create_temp_data",
        filters:
            [
                ["internalid","anyof",record_id], 
                ], 

                columns:
                    [ 

						search.createColumn({
                            name: "internalid",
                            join: RecMach,
                            label: "Internal ID"
                        }),

                        search.createColumn({
                            name: "custrecord_advs_t_c_operation_code",
                            join: RecMach,
                            label: "Op Code"
                        }), 

                        search.createColumn({
                            name: "custrecord_advs_t_c_operation_desc",
                            join: RecMach,
                            label: "Desc"
                        }), 

                        search.createColumn({
                            name: "custrecord_advs_t_c_labor_quantity",
                            join: RecMach,
                            label: "labor hrs"
                        }), 

                        search.createColumn({
                            name: "custrecord_advs_t_c_goal_hours",
                            join: RecMach,
                            label: "goal hrs"
                        }), 

                        search.createColumn({
                            name: "custrecord_advs_t_c_quantity",
                            join: RecMach,
                            label: "qty"
                        }), 

                        search.createColumn({
                            name: "custrecord_advs_t_c_labor",
                            join: RecMach,
                            label: "Labor"
                        }),
                        //search.createColumn({name: "itemid"}),
                        ] 
    });   

    laborSearchObj.run().each(function(result) { 

		var lineid = result.getValue({
            name: "internalid",
            join: RecMach
        });

        var opCode = result.getValue({
            name: "custrecord_advs_t_c_operation_code",
            join: RecMach
        }); 

        var labor = result.getValue({
            name: "custrecord_advs_t_c_labor",
            join: RecMach
        });

        var operationDesc = result.getValue({
            name: "custrecord_advs_t_c_operation_desc",
            join: RecMach
        }); 

        var qty = result.getValue({
            name: "custrecord_advs_t_c_quantity",
            join: RecMach
        }); 

        var laborhrs = result.getValue({
            name: "custrecord_advs_t_c_labor_quantity",
            join: RecMach
        }); 

        var goalhrs = result.getValue({
            name: "custrecord_advs_t_c_goal_hours",
            join: RecMach
        });

          
        log.debug("operationDesc+opCode",operationDesc+opCode); 

		if(lineid){
			sublist_2.setSublistValue({
				id: 'custpage_lineid',
				line: line,
				value: lineid
			}); 
		}

        if(qty && laborhrs){
            sub2qty = laborhrs*qty
            sublist_2.setSublistValue({
                id: 'custpage_labor_quan2',
                line: line,
                value: sub2qty
            });
        }else{
            sublist_2.setSublistValue({
                id: 'custpage_labor_quan2',
                line: line,
                value: "0"
            });

        }


        // sublist_2.setSublistValue({
        //     id: 'custpage_item2',
        //     line: line,
        //     value: item
        // }); 

        sublist_2.setSublistValue({
            id: 'custpage_operation2',
            line: line,
            value: opCode
        });  

        sublist_2.setSublistValue({
            id: 'custpage_labor2',
            line: line,
            value: labor
        }); 

        sublist_2.setSublistValue({
            id: 'custpage_itemdesc2',
            line: line,
            value: operationDesc
        }); 

        if(laborhrs){
            sublist_2.setSublistValue({
                id: 'custpage_labor_hours2',
                line: line,
                value:laborhrs
            });
        }

        if(goalhrs){
            sublist_2.setSublistValue({
                id: 'custpage_goal_hours2',
                line: line,
                value: goalhrs
            });
        }  

		

        //var LinkRemo	=	"<a href='#'>Remove</a>";
       // var LinkRemo	=	"<a href='#' onclick=RemoveAddedline("+labor+","+opCode+","+record_id+"); return fasle;>Remove</a>";

        // var LinkRemo	=	"<a href='#' onclick="+RemoveAddedline(lineid)+" return false;>Remove</a>";
		//var LinkRemo = '<a href="#" onclick=RemoveAddedline('+lineid+')>Remove</a>';
       // var linkHtml = "<a href='#' onclick=\"RemoveAddedline('" + labor + "','" + opCode + "','" + record_id + "'); return false;\">Remove</a>";
		//var LinkRemo = "<a href='#' onclick=\"RemoveAddedline('" + lineid + "'); return true;\">Remove</a>";



        sublist_2.setSublistValue({
            id: 'custpage_operation_remove',
            line: line,
            value:'<a href="#" onclick="removeAddedline(' + lineid + ')">Remove</a>'
        });

        line++
        return true;
    }); 

} 

// function RemoveAddedline(lineid){
// log.error("lineid",lineid)
// 	var tempchild = record.delete({
// 		type:'customrecord_advs_create_temp_child',
// 		id: lineid,
// 	});
	

// }

        function SearchFormMapping(FormReferen) {
            var recordSearch = search.create({
                type: 'customrecord_advs_form_mapping',
                filters: [
                    ['custrecord_advs_fm_record_ref', 'is', FormReferen],
                    'AND',
                    ['isinactive', 'is', 'F']
                    ],
                    columns: [
                        search.createColumn({ name: 'custrecord_advs_fm_transaction_form_id' }),
                        search.createColumn({ name: 'custrecord_advs_fm_default_department' }),
                        search.createColumn({ name: 'custrecord_advs_fm_module_name' })
                        ]
            });

            var resultSet = recordSearch.run();

            var repairForm = "";
            var department = "";
            var moduleName = "";

            // Use resultSet.each instead of forEach
            resultSet.each(function (firstResult) {
                repairForm = firstResult.getValue({
                    name: 'custrecord_advs_fm_transaction_form_id'
                });
                department = firstResult.getValue({
                    name: 'custrecord_advs_fm_default_department'
                });
                moduleName = firstResult.getValue({
                    name: 'custrecord_advs_fm_module_name'
                });

                return false;
            });

            return {
                repairForm: repairForm,
                department: department,
                moduleName: moduleName
            };
        }

        function SearchOperationCodes(RecordId, SalesOrderObj, GlobalDepartment, CauseVal, CorrectionVal, MecId, DocNumber, 
                VINLink, RefNO,Comments,Complaint,Memo,RemarksBody,AppName,AppPhone,AppEmail,serLoca,DriverName,
                DriverPhone,Delmethod,isInternal,AdvsCreatedFrom,billCustTerms,Customer,Location,OrderId,SalesType){

            var parentCodeTask	=	new Array();
            var globalSetting = record.load({
                type: 'customrecord_advs_global_setting',
                id: 1,
                isDynamic: false 
            });


            var bangPart = globalSetting.getValue({
                fieldId: 'custrecord_advs_gs_bang_part_wo'
            });
            log.debug("bangPart",bangPart)
            var homeBranchLoc	=	"";var hasSpPrice=	"F";
            var customerSearch = search.lookupFields({
                type: search.Type.CUSTOMER,
                id: Customer,
                columns: ["custentity_advs_home_branch", "custentity_advs_spcl_p_enabled"]
            });

            var homeBranchLoc = customerSearch.custentity_advs_home_branch[0].value;
            var hasSpPrice = customerSearch.custentity_advs_spcl_p_enabled;
            log.debug("homeBranchLoc",homeBranchLoc)
            var locationSearch = search.lookupFields({
                type: search.Type.LOCATION,
                id: Location,
                columns: ["custrecord_advs_location_margin"]
            });

            var MarkupLoc = locationSearch.custrecord_advs_location_margin; 
            log.debug("MarkupLoc",MarkupLoc)
            if (homeBranchLoc) {
                var locationSearch = search.lookupFields({
                    type: search.Type.LOCATION,
                    id: homeBranchLoc,
                    columns: ["custrecord_advs_location_margin"]
                });

                var MarkupLoc = locationSearch.custrecord_advs_location_margin;
                log.debug("MarkupLoc1",MarkupLoc)
            }

            var VISVINVal = SalesOrderObj.getValue({
                fieldId: "custbody_advs_st_service_equipment"
            }); 
            log.debug("VISVINVal",VISVINVal)

            var Cause 		=	CauseVal;
            var Correction	=	CorrectionVal;
            var Mechanic	=	MecId;
            var DocumentN	=	DocNumber;
            var Vin			=	VINLink; 

            log.debug("customrecordSearch RecordId",RecordId)

            var customrecordSearch = search.create({
                type: "customrecord_advs_create_temp_child",
                filters: [
                    ["custrecord_advs_t_c_head","anyof",RecordId], 
                    "AND",
                    ["isinactive","is","F"], 
                    // "AND",
                    // ["custrecord_advs_t_c_operation_code.custrecord_st_o_p_m_task_code","noneof","@NONE@"]
                    ],
                    columns: [
                        search.createColumn({ name: "custrecord_st_o_p_m_task_code", join: "custrecord_advs_t_c_operation_code" }),
                        search.createColumn({ name: "custrecord_advs_t_c_inv_type" }),
                        search.createColumn({ name: "custrecord_advs_t_c_labor" }),
                        search.createColumn({ name: "custrecord_advs_t_c_operation_desc" }),
                        search.createColumn({ name: "custrecord_advs_t_c_labor_rate" }),
                        search.createColumn({ name: "custrecord_advs_t_c_labor_quantity" }),
                        search.createColumn({ name: "custrecord_advs_t_c_quantity" }),
                        search.createColumn({ name: "name", join: "custrecord_advs_t_c_operation_code",sort: search.Sort.ASC }),
                        search.createColumn({ name: "custrecord_advs_t_c_operation_code" }),
                        search.createColumn({ name: "custrecord_advs_t_c_goal_hours" }),
                        search.createColumn({ name: "custrecord_advs_t_c_part" }),
                        search.createColumn({ name: "custrecord_advs_c_t_d_cause" }),
                        search.createColumn({ name: "custrecord_advs_c_t_d_c_tech" }),
                        search.createColumn({ name: "custrecord_advs_c_t_d_primary_code" }),
                        search.createColumn({ name: "custrecord_advs_o_m_dont_create_task", join: "custrecord_advs_t_c_operation_code" }),
                        search.createColumn({ name: "custrecord_advs_c_t_complaint" }),
                        search.createColumn({ name: "custrecord_advs_c_t_d_p_assco" }),
                        search.createColumn({ name: "custrecord_advs_t_c_labor" }),
                        search.createColumn({ name: "custrecord_advs_c_t_d_c_tech" }),
                        search.createColumn({ name: "custrecord_advs_t_c_remarks" })
                        ]
            });
            var customrecordSearchResults = customrecordSearch.run();
            log.debug("customrecordSearchResults",customrecordSearchResults);

            customrecordSearchResults.each(function (result) {
                log.debug("result",result);
                var ServiceCode = result.getValue({ name: "custrecord_st_o_p_m_task_code", join: "custrecord_advs_t_c_operation_code" });
                var InveType = result.getValue({ name: "custrecord_advs_t_c_inv_type" });
                var BangQuant = result.getValue({ name: "custrecord_advs_t_c_quantity" });
                var Labor=result.getValue({ name: "custrecord_advs_t_c_labor" });
                var Quantity =  (result.getValue({ name: "custrecord_advs_t_c_labor_quantity" })) * (result.getValue({ name: "custrecord_advs_t_c_quantity" }));
                Quantity = Quantity * 1;
                log.debug("Quantity",Quantity);
                var GoalHours = result.getValue({ name: "custrecord_advs_t_c_goal_hours" }) * result.getValue({ name: "custrecord_advs_t_c_quantity" });
                GoalHours = GoalHours * 1;
                var Description = result.getValue({ name: "custrecord_advs_t_c_operation_desc" });
                // var OperationCode = result.getValue({ name: "custrecord_advs_t_c_operation_code" });
                var OperationCode = result.getText({ name: "custrecord_advs_t_c_operation_code" });
                var OperationCodeId = result.getValue({ name: "custrecord_advs_t_c_operation_code" });
                var ORderQuantity = result.getValue({ name: "custrecord_advs_t_c_quantity" });
                var CauseTxt = result.getValue({ name: "custrecord_advs_c_t_d_cause" });
                //var TechID="";
                var Correction = result.getValue({ name: "custrecord_advs_t_c_remarks" });
                var PrimaryC = result.getValue({ name: "custrecord_advs_c_t_d_primary_code" });
                var DontCreat = result.getValue({ name: "custrecord_advs_o_m_dont_create_task", join: "custrecord_advs_t_c_operation_code" });
                var complaintt = result.getValue({ name: "custrecord_advs_c_t_complaint" });
                var PartAssi = result.getValue({ name: "custrecord_advs_c_t_d_p_assco" });
                var VisOpration = result.getValue({ name: "custrecord_advs_t_c_labor" });
                var TechID = result.getValue({ name: "custrecord_advs_c_t_d_c_tech" });
                log.debug("TechID+OperationCode",TechID+"-"+OperationCode);

                log.debug("search","search");
                // Set header field values
                SalesOrderObj.setValue({
                    fieldId: 'otherrefnum',
                    value: RefNO
                }); 

                log.debug("RefNO",RefNO);
                SalesOrderObj.setValue({
                    fieldId: 'custbody_advs_service_quote_memo',
                    value: Comments
                }); 

                log.debug("Comments",Comments);
                SalesOrderObj.setValue({
                    fieldId: 'custbody_advs_complaints',
                    value: Complaint
                }); 
//					SalesOrderObj.setValue({
//					fieldId: 'custbody_advs_complaints',
//					value: Correction
//					});
                SalesOrderObj.setValue({
                    fieldId: 'memo',
                    value: Memo
                });
                SalesOrderObj.setValue({
                    fieldId: 'custbody_advs_dka_remarks_invoice',
                    value: RemarksBody
                });
                SalesOrderObj.setValue({
                    fieldId: 'custbody_advs_service_apprname',
                    value: AppName
                });
                SalesOrderObj.setValue({
                    fieldId: 'custbody_advs_service_apprphone',
                    value: AppPhone
                });
                SalesOrderObj.setValue({
                    fieldId: 'custbody_advs_service_appremail',
                    value: AppEmail
                });
                SalesOrderObj.setValue({
                    fieldId: 'custbody_advs_service_shop_loc',
                    value: serLoca
                });
                SalesOrderObj.setValue({
                    fieldId: 'custbody_advs_driver_name',
                    value: DriverName
                });
                SalesOrderObj.setValue({
                    fieldId: 'custbody_advs_driver_phone',
                    value: DriverPhone
                });
                log.debug("DriverPhone",DriverPhone);
                if(isInternal){
                    SalesOrderObj.setValue({
                        fieldId: 'custbody_advs_is_internal_order',
                        value: isInternal
                    });
                }
                log.debug("isInternal",isInternal);
                SalesOrderObj.setValue({
                    fieldId: 'custbody_advs_created_from',
                    value: AdvsCreatedFrom
                }); 

                log.debug("AdvsCreatedFrom",AdvsCreatedFrom);
                SalesOrderObj.setValue({
                    fieldId: 'custbody_advs_billing_customer_terms',
                    value: billCustTerms
                });
                log.debug("header set","header set")
//					Select a new line item and set line item values
                SalesOrderObj.selectNewLine({
                    sublistId: 'item'
                });

                log.debug(" set selectNewLine","set selectNewLine")
                if(InveType){
                    SalesOrderObj.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_advs_selected_inventory_type',
                        value:InveType
                    });}

                log.debug(" set selectNewLine1","set selectNewLine")
                if(Labor){
                    SalesOrderObj.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_advs_task_item',
                        value: Labor
                    });
                }
                if(Labor){
                    SalesOrderObj.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: Labor
                    }); 


                }
                if(Description){
                    SalesOrderObj.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'description',
                        value: Description
                    });}
                if(Quantity){
                    SalesOrderObj.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        value: Quantity
                    });
                }
                if(GoalHours){
                    SalesOrderObj.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_advs_goal_hours',
                        value: GoalHours
                    });
                }


                log.debug(" set subvalues"," set subvalues")
                if (InveType == '3' || InveType == 3) {
                    SalesOrderObj.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_advs_repair_job_quantity',
                        value: ORderQuantity
                    });
                } else {
                    SalesOrderObj.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_advs_repair_job_quantity',
                        value: ""
                    });
                }
//					SalesOrderObj.setCurrentSublistValue({
//					sublistId: 'item',
//					fieldId: 'rate',
//					value: -1
//					}); 

                log.debug("Customer search","Customer search")

                if (VISVINVal === 'VIS VIN' && VisOpration === 28856) {
                    SalesOrderObj.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'rate',
                        value: '0.00'
                    });
                } else {
                    var rateValue = result.getValue('custrecord_advs_t_c_labor_rate') * 1;
                    log.debug("rateValue",rateValue)
                    SalesOrderObj.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'rate',
                        value: rateValue
                    });
                } 
                const RepairtaskAry =[];
                var RepairTaskId	="";
                log.debug("DontCreat",DontCreat)
                if (DontCreat !== "T") {
                    RepairTaskId = CreateRepairTask(CauseTxt, Correction, TechID, DocumentN, Description, ServiceCode, Vin,
                            OperationCode, OperationCodeId, GoalHours, ORderQuantity, complaintt, OrderId, SalesType);
                    log.debug("RepairTaskId1",RepairTaskId)
                    if (RepairTaskId) {
                        RepairtaskAry.push(RepairTaskId);
                    }
                    parentCodeTask[OperationCodeId] = {
                            id: RepairTaskId
                    };
                } else {
                    if (parentCodeTask[PrimaryC] != null && parentCodeTask[PrimaryC] != undefined) {
                        RepairTaskId = parentCodeTask[PrimaryC].id;
                    }
                }

                log.debug("RepairTaskId2",RepairTaskId)
                if(RepairTaskId){
                    SalesOrderObj.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_advs_temp_rep_task123',
                        value: RepairTaskId
                    }); 

/*						SalesOrderObj.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_advs_repair_task_link',
                        value: RepairTaskId
                    });*/ 
                }


                SalesOrderObj.commitLine({
                    sublistId: 'item'
                }); 

                var PartAssociate = result.getValue({
                    name:'custrecord_advs_t_c_part'
                });
                log.debug("PartAssociate",PartAssociate)
                if (PartAssociate) {
                    var TempVal = PartAssociate.toString();
                    var Split = TempVal.split('\\');
                    var Length = Split.length;
                    for (var R = 0; R < Length; R++) {
                        var Description = Split[R];
                        if (bangPart) {
                            SalesOrderObj.selectNewLine({
                                sublistId: 'item'
                            });

                            SalesOrderObj.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_advs_selected_inventory_type',
                                value: 2
                            });

                            SalesOrderObj.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_advs_task_item',
                                value: bangPart
                            });

                            SalesOrderObj.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'item',
                                value: bangPart
                            });

                            SalesOrderObj.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'description',
                                value: Description
                            });

                            SalesOrderObj.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantity',
                                value: BangQuant
                            });
                            log.debug("RepairTaskId3",RepairTaskId)
                            // SalesOrderObj.setCurrentSublistValue({
                            //     sublistId: 'item',
                            //     fieldId: 'custcol_advs_temp_rep_task123',
                            //     value: RepairTaskId
                            // });

                            SalesOrderObj.commitLine({
                                sublistId: 'item'
                            });
                        }

                        log.debug('Description Value', Description);
                    }
                }
                log.debug('PartAssi Value', PartAssi);
                if (PartAssi) {
                    var TempVal = PartAssi.toString();
                    var Split = TempVal.split(',');
                    var Length = Split.length;

                    var PartsArrL = [];

                    for(var R=0;R<Length;R++){

                        var PartIDLi = Split[R];
                        if(PartIDLi){
                            PartsArrL.push(PartIDLi);
                        }

                    }

                    if(PartsArrL.length >0){
                        var searchL = search.create({
                            type: 'inventoryitem',
                            filters: [
                                ['type', 'anyof', 'InvtPart'],
                                'AND',
                                ['internalid', 'anyof', PartsArrL]
                                ],
                                columns: [
                                    search.createColumn({ name: 'internalid' }),
                                    search.createColumn({ name: 'custitem_advs_part_brand' }),
                                    search.createColumn({ name: 'custitem_advs_st_parts_sub_group' }),
                                    search.createColumn({ name: 'custrecord_advs_p_s_g_margin', join: 'CUSTITEM_ADVS_ST_PARTS_SUB_GROUP' }),
                                    search.createColumn({ name: 'baseprice' }),
                                    search.createColumn({ name: 'vendor' }),
                                    search.createColumn({ name: 'pricelevel', join: 'pricing' }),
                                    search.createColumn({ name: 'unitprice', join: 'pricing' }),
                                    search.createColumn({ name: 'custentity_advs_manu_fac_margin', join: 'preferredVendor' })
                                    ]
                        });

                        var runP = searchL.run();
                        var colsp = runP.columns;

                        var PartsByPricelevel = [];

                        runP.each(function(recp) {
                            var Pid = recp.getValue({ name: 'internalid' });
                            var P_Brand = recp.getValue({ name: 'custitem_advs_part_brand' });
                            var P_SbGp = recp.getValue({ name: 'custitem_advs_st_parts_sub_group' });
                            var P_Sb_Marg = recp.getValue({ name: 'custrecord_advs_p_s_g_margin', join: 'CUSTITEM_ADVS_ST_PARTS_SUB_GROUP' });
                            var Bsp = recp.getValue({ name: 'baseprice' });
                            var Vendor = recp.getValue({ name: 'vendor' });
                            var PLevel = recp.getValue({ name: 'pricelevel', join: 'pricing' });
                            var UnitPrice = recp.getValue({ name: 'unitprice', join: 'pricing' });
                            var ManufMarg = recp.getValue({ name: 'custentity_advs_manu_fac_margin', join: 'preferredVendor' });


                            if(PartsByPricelevel[Pid] != null && PartsByPricelevel[Pid] != undefined){
                                if(PartsByPricelevel[Pid][PLevel] != null && PartsByPricelevel[Pid][PLevel] != undefined){

                                }else{
                                    PartsByPricelevel[Pid][PLevel]	=	new Array();
                                    PartsByPricelevel[Pid][PLevel]["Brand"]			=	P_Brand;
                                    PartsByPricelevel[Pid][PLevel]["P_SbGp"]		=	P_SbGp;
                                    PartsByPricelevel[Pid][PLevel]["Bsp"]			=	Bsp;
                                    PartsByPricelevel[Pid][PLevel]["Vendor"]		=	Vendor;
                                    PartsByPricelevel[Pid][PLevel]["UnitPrice"]		=	UnitPrice;
                                    PartsByPricelevel[Pid][PLevel]["P_Sb_Marg"]		=	P_Sb_Marg;
                                    PartsByPricelevel[Pid][PLevel]["ManufMarg"]		=	ManufMarg;
                                }

                            }else{
                                PartsByPricelevel[Pid]	=	new Array();
                                PartsByPricelevel[Pid][PLevel]	=	new Array();
                                PartsByPricelevel[Pid][PLevel]["Brand"]			=	P_Brand;
                                PartsByPricelevel[Pid][PLevel]["P_SbGp"]		=	P_SbGp;
                                PartsByPricelevel[Pid][PLevel]["Bsp"]			=	Bsp;
                                PartsByPricelevel[Pid][PLevel]["Vendor"]		=	Vendor;
                                PartsByPricelevel[Pid][PLevel]["UnitPrice"]		=	UnitPrice;
                                PartsByPricelevel[Pid][PLevel]["P_Sb_Marg"]		=	P_Sb_Marg;

                                PartsByPricelevel[Pid][PLevel]["ManufMarg"]		=	ManufMarg;
                            }

                            return true; 
                        });

                        var CustPLevel = SalesOrderObj.getValue({
                            fieldId: 'custbody_advs_st_cust_price_level'
                        });

                        var homeBranchLoc = SalesOrderObj.getValue({
                            fieldId: 'custbody_advs_cust_home_branch'
                        });

                        var subsiMkp = SalesOrderObj.getValue({
                            fieldId: 'custbody_advs_serv_cost_margin'
                        });

                        getHomeBranch(homeBranchLoc,PartsArrL);
                        log.debug("getHomeBranch","getHomeBranch executed")

                        for(var R=0;R<Length;R++){
                            var PartIDLi = Split[R];
                            if(PartIDLi){
                                if(PartsByPricelevel[PartIDLi] != null && PartsByPricelevel[PartIDLi] != undefined){
                                    var AMarginCost	=	0;
                                    if(LocMarginF[PartIDLi] != null && LocMarginF[PartIDLi] != undefined){
                                        AMarginCost	=	LocMarginF[PartIDLi]["MarginC"];
                                    }


                                    if(PartsByPricelevel[PartIDLi][CustPLevel] != null && PartsByPricelevel[PartIDLi][CustPLevel] != undefined){
                                        var PartBrand	=	PartsByPricelevel[PartIDLi][CustPLevel]["Brand"];
                                        var PartSubGP	=	PartsByPricelevel[PartIDLi][CustPLevel]["P_SbGp"];
                                        var BasePrice	=	PartsByPricelevel[PartIDLi][CustPLevel]["Bsp"];
                                        var Vendor		=	PartsByPricelevel[PartIDLi][CustPLevel]["Vendor"];
                                        var UnitPrice	=	PartsByPricelevel[PartIDLi][CustPLevel]["UnitPrice"];
                                        var PartSubGpMkp=	PartsByPricelevel[PartIDLi][CustPLevel]["P_Sb_Marg"];
                                        var ManufMarg	=	PartsByPricelevel[PartIDLi][CustPLevel]["ManufMarg"];

                                        if(PartsByPricelevel[PartIDLi][9] != null && PartsByPricelevel[PartIDLi][9] != undefined){
                                            var ListPrice	=	PartsByPricelevel[PartIDLi][9]["UnitPrice"];
                                        }else{
                                            var ListPrice	=	0;
                                        }


                                        var getPriceL	    =	fetchPricingOper(PartIDLi,CustPLevel,Customer,subsiMkp,homeBranchLoc,Location,
                                                UnitPrice,ManufMarg,PartSubGpMkp,MarkupLoc,UnitPrice,hasSpPrice,Vendor,PartSubGP,PartBrand,ListPrice,AMarginCost);

                                        if(getPriceL){
                                            var splitgetPriceL	=	getPriceL.split("$rat$");
                                            var PartsAmountSp		=	splitgetPriceL[0];
                                            var servAmntSp		=	splitgetPriceL[1];
                                            var PriceTypeL		=	splitgetPriceL[2];


                                        }else{

                                            var PartsAmountSp	=	0;
                                            var servAmntSp		=	0;
                                            var PriceTypeL		=	"";
                                        }
                                    }
                                    SalesOrderObj.selectNewLine({
                                        sublistId: 'item'
                                    });

                                    SalesOrderObj.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'custcol_advs_selected_inventory_type',
                                        value: 2
                                    });

                                    SalesOrderObj.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'custcol_advs_task_item',
                                        value: PartIDLi
                                    });

                                    SalesOrderObj.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'item',
                                        value: PartIDLi
                                    });

                                    SalesOrderObj.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'quantity',
                                        value: BangQuant
                                    });

                                    // SalesOrderObj.setCurrentSublistValue({
                                    //     sublistId: 'item',
                                    //     fieldId: 'custcol_advs_repair_task_link',
                                    //     value: RepairTaskId
                                    // });

                                    // SalesOrderObj.setCurrentSublistValue({
                                    //     sublistId: 'item',
                                    //     fieldId: 'department',
                                    //     value: GlobalDepartment
                                    // });

                                    SalesOrderObj.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'custcol_advs_temp_rep_task123',
                                        value: RepairTaskId
                                    });
                                    log.debug("RepairTaskId4",RepairTaskId)
                                    SalesOrderObj.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'custcol_advs_is_associated_p',
                                        value: true
                                    });

                                    SalesOrderObj.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'price',
                                        value: -1
                                    });

                                    SalesOrderObj.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'rate',
                                        value: servAmntSp
                                    });

                                    SalesOrderObj.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'custcol_advs_original_price',
                                        value: servAmntSp
                                    });

                                    SalesOrderObj.commitLine({
                                        sublistId: 'item'
                                    });

                                    if (PriceTypeL == "PROMO") {
                                        SalesOrderObj.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'custcol_advs_prom_price',
                                            value: true
                                        });
                                    } else if (PriceTypeL == "REBT") {
                                        SalesOrderObj.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'custcol_advs_rebate_vendor_price',
                                            value: servAmntSp
                                        });
                                        SalesOrderObj.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'price',
                                            value: -1
                                        });
                                        SalesOrderObj.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'custcol_advs_t_l_rebate_addede',
                                            value: true
                                        });
                                        SalesOrderObj.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'custcol_advs_special_price_added',
                                            value: true
                                        });
                                        SalesOrderObj.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'custcol_advs_var_approved_status',
                                            value: 1
                                        });
                                        SalesOrderObj.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'custrecord_advs_p_s_b_c_r_r',
                                            value: rebrecv
                                        });
                                    } else {
                                        if (specialPExist == "T") {
                                            SalesOrderObj.setCurrentSublistValue({
                                                sublistId: 'item',
                                                fieldId: 'custcol_advs_special_price_added',
                                                value: true
                                            });
                                        }
                                    }

                                    SalesOrderObj.commitLine({
                                        sublistId: 'item'
                                    });
                                    log.debug("loop executed","loop executed")
                                }                    
                            }
                        }
                    }
                }

                return true;

            });    



        } 

        function CreateRepairTask(Cause, Correction, Mechanic, DocumentN, Description, ServiceCode, Vin, 
                OperationCode, OperationCodeId, GoalHours,orderqty,complaint,OrderId,SalesType){

            log.debug("CreateRepairTask","CreateRepairTask")
            var RecObj = record.create({
                type: 'customrecord_advs_task_record',
                isDynamic: true
            });

            RecObj.setValue({
                fieldId: 'custrecord_ref_no',
                value: DocumentN
            });
            RecObj.setValue({
                fieldId: 'name',
                value: OperationCode
            });
            RecObj.setValue({
                fieldId: 'custrecord_advs_repair_no',
                value: DocumentN
            });
            RecObj.setValue({
                fieldId: 'custrecord_repair_task_no',
                value: OperationCode
            });
            RecObj.setValue({
                fieldId: 'custrecord_repair_desc',
                value: Description
            });
            RecObj.setValue({
                fieldId: 'custrecord_st_p_t_f_dont_update_order',
                value: true
            });
            RecObj.setValue({
                fieldId: 'custrecord_advs_st_r_t_cause',
                value: Cause
            });
            RecObj.setValue({
                fieldId: 'custrecord_advs_st_r_t_compalin',
                value: complaint
            });
            RecObj.setValue({
                fieldId: 'custrecord_advs_st_r_t_correction',
                value: Correction
            });
            RecObj.setValue({
                fieldId: 'custrecord_advs_st_r_t_equ_link',
                value: Vin
            });
            RecObj.setValue({
                fieldId: 'custrecord_advs_repair_task_job_code',
                value: OperationCodeId
            });
            RecObj.setValue({
                fieldId: 'custrecord_advs_serv_task_code',
                value: ServiceCode
            });
            RecObj.setValue({
                fieldId: 'custrecord_advs_repait_task_job_type',
                value: 1
            });
            RecObj.setValue({
                fieldId: 'custrecord_advs_at_r_t_labor_time',
                value: GoalHours
            });
            RecObj.setValue({
                fieldId: 'custrecord_advs_job_qty_from_line',
                value: orderqty
            });


            if (SalesType === "estimate") {
                if (OrderId) {
                    RecObj.setValue({
                        fieldId: 'custrecord_advs_st_r_t_quote_link',
                        value: OrderId
                    });
                }
            } else if (SalesType === "salesorder") {
                if (OrderId) {
                    RecObj.setValue({
                        fieldId: 'custrecord_advs_st_r_t_work_ord_link',
                        value: OrderId
                    });
                }
            }

            var MecRecmach	=	"recmachcustrecord_advs_m_c_repair_task";
            if (Mechanic) {
                RecObj.setValue({
                    fieldId: 'custrecord_advs_tech_1',
                    value: Mechanic
                });

                RecObj.selectNewLine({
                    sublistId: MecRecmach
                });
                RecObj.setCurrentSublistValue({
                    sublistId: MecRecmach,
                    fieldId: 'custrecord_advs_m_c_mechanic',
                    value: Mechanic
                });
                RecObj.commitLine({
                    sublistId: MecRecmach
                });
            }
            var OpeId = RecObj.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });
            log.debug("CreateRepairTask OpeId",OpeId)
            return OpeId;



        }   

        function checkTaskEmptyStatus(WorkOrder){
            log.debug("checkTaskEmptyStatus WorkOrder",WorkOrder)

            taskSearch = search.create({
                type: 'customrecord_advs_task_record',
                filters: [
                    ['isinactive', 'is', 'F'],
                    'AND',
                    ['custrecord_st_r_t_status', 'noneof', '102', '1', '3', '2', '5', '8', '6', '9', '101'],
                    'AND',
                    ['custrecord_advs_st_r_t_work_ord_link.mainline', 'is', 'T'],
                    'AND',
                    ['custrecord_advs_st_r_t_work_ord_link.internalid', 'anyof', WorkOrder]
                    ],
                    columns: [
                        search.createColumn({
                            name: 'internalid',
                            summary: 'COUNT'
                        })
                        ]
            });
            var EmptyStatusCount	=	0;
            var LineNum             =   0;
            var JobRun1 = taskSearch.run();

            JobRun1.each(function (Res) {
                EmptyStatusCount = Res.getValue('internalid');
                return true;
                LineNum++
            });

            return EmptyStatusCount;


        }

        var LocMarginF	=[];
        function getHomeBranch(homeBranchLoc,item_para){

            var searchFilters = [
                ['isinactive', 'is', 'F'],
                'AND',
                ['custrecord_advs_abc_location', 'anyof', homeBranchLoc],
                'AND',
                ['custrecord_advs_abc_item', 'anyof', item_para]
                ];

            var searchColumns = [
                search.createColumn({
                    name: 'custrecord_advs_abc_cat_margin',
                    join: 'custrecord_abc_category_itemchild'
                }),
                search.createColumn({ name: 'custrecord_advs_abc_item' })
                ];

            var searchObj = search.create({
                type: 'customrecord_advs_abc_analysis',
                filters: searchFilters,
                columns: searchColumns
            });

            var searchResult = searchObj.run();

            searchResult.each(function(result) {
                var PArtL = result.getValue({
                    name: 'custrecord_advs_abc_item'
                });
                var MarginC = result.getValue({
                    name: 'custrecord_advs_abc_cat_margin',
                    join: 'custrecord_abc_category_itemchild'
                });

                LocMarginF[PArtL]	=	new Array();
                LocMarginF[PArtL]["MarginC"]	=	MarginC;
                return true;
            });

        } 
        var DataArray = new Array();
        var CateArray	= [];
        var CateGData	=	new Array();
        var spPerDis	=	"";var SPprice="";

        function checkDiscountforLaborCategory(reqLocation, customerpara) {
            var LocRate = 0;
            CateArray	= [];
            CateGData	= [];
            var specdataExist = "F";

            // Search for labor rate by location
            var by_locationSearch = search.create({
                type: "customrecord_advs_labor_rate_by_location",
                filters: [
                    ["custrecord_advs_lbr_price_by_loc", "anyof", reqLocation]
                    ],
                    columns: [
                        search.createColumn({ name: "custrecord_advs_lbr_price_by_loc_rate" })
                        ]
            });

            by_locationSearch.run().each(function(result) {
                LocRate = result.getValue({
                    name: "custrecord_advs_lbr_price_by_loc_rate"
                });
                return true;
            });

            // Search for labor pricing data
            var laborPricingSearch = search.create({
                type: "customrecord_advs_c_w_lab_pricing",
                filters: [
                    ["custrecord_advs_c_w_l_p_customer", "anyof", customerpara]
                    ],
                    columns: [
                        search.createColumn({ name: "custrecord_advs_c_w_l_p_special_price" }),
                        search.createColumn({ name: "custrecord_advs_c_w_l_p_disc_spec_" }),
                        search.createColumn({ name: "custrecord_advs_c_w_l_p_labor_category" })
                        ]
            });

            laborPricingSearch.run().each(function(result) {
                var CatId = result.getValue({
                    name: "custrecord_advs_c_w_l_p_labor_category"
                });
                var DiscSpec = result.getValue({
                    name: "custrecord_advs_c_w_l_p_disc_spec_"
                });
                var SpecPri = parseFloat(result.getValue({
                    name: "custrecord_advs_c_w_l_p_special_price"
                })) || 0;

                if (CatId) {
                    if (!CateArray.includes(CatId)) {
                        CateArray.push(CatId);
                    }

                    CateGData[CatId] = {
                            "DiscSpec": DiscSpec,
                            "SpecPri": SpecPri
                    };
                }

                if (!CatId) {
                    if (spPerDis >= 0 || SPprice >= 0) {
                        spPerDis = DiscSpec;
                        SPprice = SpecPri;
                    }
                }

                specdataExist = "T";
                return true; 
            });

            return specdataExist + "#advs" + LocRate;
        }


    });
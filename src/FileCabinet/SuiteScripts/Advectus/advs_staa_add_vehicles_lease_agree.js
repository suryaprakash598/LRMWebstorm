/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet

 */
define(['N/record', 'N/runtime', 'N/search','N/ui/serverWidget','./advs_lib_rental_leasing.js',
        './advs_lib_util.js'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     */
    (record, runtime, search,serverWidget,libFile,util) => {
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
                var recId   =   request.parameters.recid;

                var modelId     =   request.parameters.modelid;
                var vinid       =   request.parameters.vinid;
                var unitnum     =   request.parameters.unitnum;


                var form    =   serverWidget.createForm({title:"Add Vehicle"});

                var modelFldObj  =   form.addField({id:"custpage_model",label:"Model",
                    type:serverWidget.FieldType.SELECT,source:"item"});

                var vinFldObj  =   form.addField({id:"custpage_vin",label:"Vin #",type:serverWidget.FieldType.SELECT,source:"customrecord_advs_vm"});
                var unitFldObj  =   form.addField({id:"custpage_unitf",label:"Unit #",type:serverWidget.FieldType.TEXT});

                vinFldObj.updateBreakType({
                    breakType: serverWidget.FieldBreakType.STARTCOL
                });
                unitFldObj.updateBreakType({
                    breakType: serverWidget.FieldBreakType.STARTCOL
                });


                var recObj  =   form.addField({id:"custpage_recobj",label:"RecID",
                    type:serverWidget.FieldType.SELECT,source:"customrecord_advs_lease_header"})
                recObj.defaultValue = recId;
                recObj.updateDisplayType({displayType:"hidden"});

                if(vinid){
                    vinFldObj.defaultValue    =   vinid;
                }

                if(modelId){
                    modelFldObj.defaultValue    =   modelId;
                }
                if(unitnum){
                    unitFldObj.defaultValue    =   unitnum;
                }


                var FieldsLook  =   ["custrecord_advs_l_h_location","custrecord_advs_l_h_customer_name"];
                var RentalObj   =   search.lookupFields({type:"customrecord_advs_lease_header",id:recId,columns:FieldsLook})

                var LocationID  =   "";var RentType =   "";var freq =   "";var custId   =   "";
                if(RentalObj['custrecord_advs_l_h_customer_name'] != null && RentalObj['custrecord_advs_l_h_location'] != undefined){
                    LocationID = RentalObj['custrecord_advs_l_h_location'][0].value;
                }
                if(RentalObj['custrecord_advs_l_h_customer_name'] != null && RentalObj['custrecord_advs_l_h_customer_name'] != undefined){
                    custId = RentalObj['custrecord_advs_l_h_customer_name'][0].value;
                }


                var VehiclesData     =    libFile.vehiclesListLease(LocationID,"","",vinid,modelId,unitnum);


                var sublistObj  =   form.addSublist({id:"custpage_sublist",type:"list",label:"Vehicle List"});
                sublistObj.addField({id:"custpage_mark",type:serverWidget.FieldType.CHECKBOX,label:"Mark"});
                var vinlineObj   =    sublistObj.addField({id:"custpage_vinid",type:serverWidget.FieldType.SELECT,label:"Vin #",source:"customrecord_advs_vm"});
                vinlineObj.updateDisplayType({displayType:"inline"});
                var modellineObj   = sublistObj.addField({id:"custpage_model",type:serverWidget.FieldType.SELECT,label:"Model",source:"item"});
                modellineObj.updateDisplayType({displayType:"inline"});
                var brandlineObj    =   sublistObj.addField({id:"custpage_brand",type:serverWidget.FieldType.SELECT,label:"Brand",source:"customrecord_advs_brands"});
                brandlineObj.updateDisplayType({displayType:"inline"});
                var ratelineObj    =   sublistObj.addField({id:"custpage_rate_lin",type:serverWidget.FieldType.CURRENCY,label:"Rate"});
                ratelineObj.updateDisplayType({displayType:"entry"});

                var deposilineObj    =   sublistObj.addField({id:"custpage_rate_deposit",type:serverWidget.FieldType.CURRENCY,label:"DEPOSIT/DOWN PAYMENT"});
                deposilineObj.updateDisplayType({displayType:"entry"});

                var adminamntlineObj    =   sublistObj.addField({id:"custpage_admin_amnt",type:serverWidget.FieldType.CURRENCY,label:"Admin Fee"});
                adminamntlineObj.updateDisplayType({displayType:"entry"});

                var intrstlineObj    =   sublistObj.addField({id:"custpage_interest",type:serverWidget.FieldType.PERCENT,label:"ANNUAL INTERTEST %"});
                intrstlineObj.updateDisplayType({displayType:"entry"});

                var LoanPYrslineObj    =   sublistObj.addField({id:"custpage_lon_prd_yrs",type:serverWidget.FieldType.INTEGER,label:"LOAN PERIOD IN YEARS"});
                LoanPYrslineObj.updateDisplayType({displayType:"entry"});


                var resiperfldObj    =   sublistObj.addField({id:"custpage_sche_residu_per",type:serverWidget.FieldType.PERCENT,label:"Residual %"});
                resiperfldObj.updateDisplayType({displayType:"entry"});

                var resiamntfldObj    =   sublistObj.addField({id:"custpage_sche_residu_amnt",type:serverWidget.FieldType.CURRENCY,label:"Residual $"});
                resiamntfldObj.updateDisplayType({displayType:"entry"});

                var schedamountlinehtmlObj    =   sublistObj.addField({id:"custpage_sche_amnt_txt",type:serverWidget.FieldType.TEXT,label:"SCHEDULED AMOUNT"});
                schedamountlinehtmlObj.updateDisplayType({displayType:"inline"});

                var totalPayhtmlObj    =   sublistObj.addField({id:"custpage_sche_pay_tot",type:serverWidget.FieldType.TEXT,label:"Total Payment"});
                totalPayhtmlObj.updateDisplayType({displayType:"inline"});





                // var schedamountlineObj    =   sublistObj.addField({id:"custpage_sche_amnt",type:serverWidget.FieldType.CURRENCY,label:"SCHEDULED AMOUNT"});
                // schedamountlineObj.updateDisplayType({displayType:"disabled"});

             /*   var nopaylineObj    =   sublistObj.addField({id:"custpage_number_of_pay",type:serverWidget.FieldType.INTEGER,label:"NUMBER OF PAYMENT PER YEAR"});
                nopaylineObj.updateDisplayType({displayType:"entry"});

                var schednolineObj    =   sublistObj.addField({id:"custpage_sche_no_of_pay",type:serverWidget.FieldType.INTEGER,label:"SCHEDULED NUMBER OF PAYMENTS"});
                schednolineObj.updateDisplayType({displayType:"entry"});

                */





                var lineNum =   0;
                for(var i=0;i<VehiclesData.length;i++){
                    var vinId       =   VehiclesData[i].vinId;
                    var vinName     =   VehiclesData[i].name;
                    var model       =   VehiclesData[i].model;
                    var brand       =   VehiclesData[i].brand;

                    var rate  =   VehiclesData[i].rate;


                    sublistObj.setSublistValue({id:"custpage_vinid",line:lineNum,value:vinId});
                    sublistObj.setSublistValue({id:"custpage_model",line:lineNum,value:model});
                    sublistObj.setSublistValue({id:"custpage_brand",line:lineNum,value:brand});
                    rate       =    rate*1;
                    sublistObj.setSublistValue({id:"custpage_rate_lin",line:lineNum,value:rate});

                    var htmlSched   =  "<span id='custpage_schedamn_"+lineNum+"' name='custpage_schedamn_"+lineNum+"'></span>";
                    sublistObj.setSublistValue({id:"custpage_sche_amnt_txt",line:lineNum,value:htmlSched});

                    var htmltotSched   =  "<span id='custpage_sche_pay_tot"+lineNum+"' name='custpage_sche_pay_tot"+lineNum+"'></span>";
                    sublistObj.setSublistValue({id:"custpage_sche_pay_tot",line:lineNum,value:htmltotSched});



                    lineNum++;
                }


                form.clientScriptModulePath = "./advs_cs_add_vehicles_lease_agree.js";
                form.addSubmitButton("Submit");
                response.writePage(form);
            }
			else{
                var lines   =   request.getLineCount({group:"custpage_sublist"});
                var recId   =   request.parameters.custpage_recobj;

                var DataArray   =   new Array();
                for(var i=0;i<lines;i++){
                    var vinId       =   request.getSublistValue({group:"custpage_sublist",name:"custpage_vinid",line:i});
                    var modelid     =   request.getSublistValue({group:"custpage_sublist",name:"custpage_model",line:i});
                    var brandid     =   request.getSublistValue({group:"custpage_sublist",name:"custpage_brand",line:i});
                    var mark        =   request.getSublistValue({group:"custpage_sublist",name:"custpage_mark",line:i});
                    var rate        =   request.getSublistValue({group:"custpage_sublist",name:"custpage_rate_lin",line:i});


                    var deposi           =   request.getSublistValue({group:"custpage_sublist",name:"custpage_rate_deposit",line:i});
                    var interest         =   request.getSublistValue({group:"custpage_sublist",name:"custpage_interest",line:i});
                    var loanPrd          =   request.getSublistValue({group:"custpage_sublist",name:"custpage_lon_prd_yrs",line:i});


                    var resiPer          =   request.getSublistValue({group:"custpage_sublist",name:"custpage_sche_residu_per",line:i});
                    var resiamnt          =   request.getSublistValue({group:"custpage_sublist",name:"custpage_sche_residu_amnt",line:i});

                    var adminamnt          =   request.getSublistValue({group:"custpage_sublist",name:"custpage_admin_amnt",line:i});


                    if(resiPer){
                        resiPer =   parseFloat(resiPer);
                    }


                    if(mark == "T" || mark == true){
                        var obj =   {};
                        obj.vinId       =  vinId;
                        obj.modelid     =  modelid;
                        obj.brandid     =  brandid;
                        obj.brandid     =  brandid;
                        obj.rate     =  rate;

                        obj.deposi       =  deposi;
                        obj.interest     =  interest;
                        obj.loanPrd      =  loanPrd;

                        obj.resiPer      =  resiPer;
                        obj.resiamnt      =  resiamnt;
                        obj.adminamnt      =  adminamnt;



                        DataArray.push(obj);
                    }
                }

                var vinArray    =   [];var linesAdded   =   0;
                var recObj  =   record.load({type:"customrecord_advs_lease_header",id:recId,isDynamic:true});
                for(var i=0;i<DataArray.length;i++){
                    var Datline =   DataArray[i];

                    var modelId =   Datline.modelid;
                    var brandid =   Datline.brandid;
                    var vinId   =   Datline.vinId;
                    var rate   =   Datline.rate;

                    var deposit         =   Datline.deposi;
                    var annualIntere    =   Datline.interest;
                    var PayinYr         =   Datline.loanPrd;

                    var resiPer         =   Datline.resiPer;
                    var resiamnt         =   Datline.resiamnt;

                    var adminamnt         =   Datline.adminamnt;

                    if(annualIntere){
                        annualIntere = parseFloat(annualIntere);
                    }

                    rate    =   rate*1;
                    if(rate<0){
                        rate    =   0;
                    }


                    var LeaseRec    =   record.create({
                        type:"customrecord_advs_lea_rental_child",
                        isDynamic: true
                    });
                    LeaseRec.setValue({fieldId:"custrecord_advs_lea_header_link",value:recId});
                    LeaseRec.setValue({fieldId:"custrecord_advs_lea_vin_stk_stock",value:vinId});
                    LeaseRec.setValue({fieldId:"custrecord_advs_lea_stock_status",value:6});
                    LeaseRec.setValue({fieldId:"custrecord_advs_lea_sales_price",value:rate});

                    var loanAmount  =   (rate-deposit);

                    LeaseRec.setValue({fieldId:"custrecord_advs_l_c_dep_down_pay",value:deposit});
                    LeaseRec.setValue({fieldId:"custrecord_advs_l_c_loa_amnt_tot",value:loanAmount});
                    LeaseRec.setValue({fieldId:"custrecord_advs_l_c_an_interest",value:annualIntere});
                    LeaseRec.setValue({fieldId:"custrecord_advs_l_c_loan_p_yr",value:PayinYr});

                    LeaseRec.setValue({fieldId:"custrecord_advs_l_c_residual_per",value:resiPer});
                    LeaseRec.setValue({fieldId:"custrecord_advs_l_c_resi_value",value:resiamnt});

                    LeaseRec.setValue({fieldId:"custrecord_advs_l_c_admin_fee",value:adminamnt});




                    if(rate && deposit && annualIntere && PayinYr) {

                        var dataCalc = libFile.clientcalcamount(loanAmount, annualIntere, 12, PayinYr);

                        if (dataCalc != null && dataCalc != undefined) {
                            var amount = dataCalc.amount;
                            var totalpayments = dataCalc.totalpayments;
                            LeaseRec.setValue({fieldId: "custrecord_advs_l_c_schd_no_pay", value: totalpayments});
                            LeaseRec.setValue({fieldId: "custrecord_advs_l_c_sched_paym", value: amount});
                        }
                    }

                    LeaseRec.save({enableSourcing:true,ignoreMandatoryFields:true});
                    /* recObj.selectNewLine({sublistId:"recmachcustrecord_advs_lea_header_link"});
                     recObj.setCurrentSublistValue({sublistId:"recmachcustrecord_advs_lea_header_link",fieldId:"custrecord_advs_lea_vin_stk_stock",value:vinId});
                     recObj.setCurrentSublistValue({sublistId:"recmachcustrecord_advs_lea_header_link",fieldId:"custrecord_advs_lea_stock_status",value:6});
                     recObj.setCurrentSublistValue({sublistId:"recmachcustrecord_advs_lea_header_link",fieldId:"custrecord_advs_lea_sales_price",value:rate});
                     var loanAmount  =   (rate-deposit);

                     if(rate && deposit && annualIntere && PayinYr){

                         var dataCalc =  libFile.clientcalcamount(loanAmount,annualIntere,12,PayinYr);

                         if(dataCalc != null && dataCalc != undefined) {
                             var amount                       =   dataCalc.amount;
                             var totalpayments       =   dataCalc.totalpayments;

                             recObj.setCurrentSublistValue({sublistId:"recmachcustrecord_advs_lea_header_link",fieldId:"custrecord_advs_l_c_sched_paym",value:amount});
                             recObj.setCurrentSublistValue({sublistId:"recmachcustrecord_advs_lea_header_link",fieldId:"custrecord_advs_l_c_schd_no_pay",value:totalpayments});
                         }
                     }

                     recObj.setCurrentSublistValue({sublistId:"recmachcustrecord_advs_lea_header_link",fieldId:"custrecord_advs_l_c_dep_down_pay",value:deposit});
                     recObj.setCurrentSublistValue({sublistId:"recmachcustrecord_advs_lea_header_link",fieldId:"custrecord_advs_l_c_loa_amnt_tot",value:loanAmount});
                     recObj.setCurrentSublistValue({sublistId:"recmachcustrecord_advs_lea_header_link",fieldId:"custrecord_advs_l_c_an_interest",value:annualIntere});
                     recObj.commitLine({sublistId:"recmachcustrecord_advs_lea_header_link"});*/

                    vinArray.push(vinId);

                    linesAdded++;
                }

                if(linesAdded>0){
                    var recMach =   "recmachcustrecord_advs_lea_header_link";
                    var lines   =   recObj.getLineCount({sublistId:recMach});

                    recObj.setValue({fieldId:"custrecord_advs_r_h_status",value:2})
                    var rentalId =      recObj.save({enableSourcing:true,ignoreMandatoryFields:true});


                   /* for(var m=0;m<vinArray.length;m++){
                        var vinId   =   vinArray[m];
                        record.submitFields({type:"customrecord_advs_vm",id:vinId,values:{
                                "custrecord_advs_vm_lea_hea":rentalId,
                                "custrecord_advs_vm_reservation_status":util.vmstatus.rent
                            }});
                    }*/
                }


                var onclickScript=" <html><body> <script type='text/javascript'>" +
                    "try{" +

                    "";
                onclickScript+="window.parent.location.reload();";
                onclickScript+="var theWindow = window.parent.closePopup();" ;
                  
                onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";

                response.write(onclickScript);
            }
        }

        return {
			'onRequest': onRequest
			};

    });
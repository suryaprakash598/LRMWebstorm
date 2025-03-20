/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/record', 'N/redirect', 'N/search', 'N/url','N/ui/serverWidget','N/runtime','N/file','N/ui/serverWidget'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{redirect} redirect
 * @param{search} search
 * @param{url} url
 */
    (log, record, redirect, search, url,ui,runtime,file,serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
           var LeaseId = scriptContext.request.parameters.custpara_leaseId;
           var CustomerId = scriptContext.request.parameters.custpara_custId;
           
           var VinId = scriptContext.request.parameters.custpara_vinId;
           log.debug("CustomerId",CustomerId);
           log.debug("VinId",VinId);
         if (scriptContext.request.method === 'GET') {
            var curREc = scriptContext.request.parameters.curREc;
        
               var form = ui.createForm({title: 'Lease Pay-Off'});

               var LeaseInfo   =    form.addFieldGroup({id:"custpage_lease_header_grup",label:"Lessee and vehicle"});
            
               var PrimaryGroup   =    form.addFieldGroup({id:"custpage_primary",label:"Itemization"});
               var Description   =    form.addFieldGroup({id:"custpage_Description",label:"Balance"});


               var LeaseHeader =   form.addField({id:"custpage_lease_header",type:serverWidget.FieldType.SELECT,label:"Lease Agreement",source:"customrecord_advs_lease_header",container:"custpage_lease_header_grup"}).updateDisplayType({displayType:"inline"});
               var Lessee =   form.addField({id:"custpage_lease_lessee",type:serverWidget.FieldType.SELECT,label:"Lessee",source:"customer",container:"custpage_lease_header_grup"}).updateDisplayType({displayType:"inline"});
               var LeaseVin =   form.addField({id:"custpage_lease_vin",type:serverWidget.FieldType.SELECT,label:"Lease vin",source:"customrecord_advs_vm",container:"custpage_lease_header_grup"}).updateDisplayType({displayType:"inline"});

               var ReturnTypes    =   form.addField({id:"custpage_return_type",type:serverWidget.FieldType.SELECT,label:"Return Type",source:"customrecord_advs_return_type",container:"custpage_primary"});
               var LeaseReceivables =   form.addField({id:"custpage_lease_receivables",type:serverWidget.FieldType.CURRENCY,label:"Lease receivables",container:"custpage_primary"});
               var NonrefundDep =   form.addField({id:"custpage_non_refund_dep",type:serverWidget.FieldType.CURRENCY,label:"Non-refundable Deposit",container:"custpage_primary"});
               var PurchaseOption =   form.addField({id:"custpage_purchase_option",type:serverWidget.FieldType.CURRENCY,label:"Purchase Option",container:"custpage_primary"});
               var TotalAmount =   form.addField({id:"custpage_total_amount",type:serverWidget.FieldType.CURRENCY,label:"Total Amount",container:"custpage_primary"});

               var LeaseInstaPaid =   form.addField({id:"custpage_lease_insta_paid",type:serverWidget.FieldType.CURRENCY,label:"Lease Installments paid",container:"custpage_Description"});
               var NonRefundDep =   form.addField({id:"custpage_non_ref_dep_paid",type:serverWidget.FieldType.CURRENCY,label:"Non-refundable Deposit paid",container:"custpage_Description"});
               var AdvinstallPaid =   form.addField({id:"custpage_adv_insta_paid",type:serverWidget.FieldType.CURRENCY,label:"Advance Lease Installments Paid",container:"custpage_Description"});
               var RecBalDue =   form.addField({id:"custpage_lease_receivables_balancedue",type:serverWidget.FieldType.CURRENCY,label:"Lease receivables Balance Due",container:"custpage_Description"});
               var SalestaxRec =   form.addField({id:"custpage_sales_tax_receivable",type:serverWidget.FieldType.CURRENCY,label:"Sales tax on lease receivable balance due",container:"custpage_Description"});
               var Unpaid =   form.addField({id:"custpage_unpaid_lease_charges",type:serverWidget.FieldType.CURRENCY,label:"Unpaid lease charges",container:"custpage_Description"});
               var TotBalDue =   form.addField({id:"custpage_total_balance_due",type:serverWidget.FieldType.CURRENCY,label:"Total balance due",container:"custpage_Description"});

                if(LeaseId){
                    LeaseHeader.defaultValue=LeaseId;
                }
                if(CustomerId){
                    Lessee.defaultValue=CustomerId;
                }
                if(VinId){
                    LeaseVin.defaultValue=VinId;
                }
              
                form.addSubmitButton({
                    label: 'Submit Pay Off'
                });
    
                scriptContext.response.writePage(form);
            }
            else if (scriptContext.request.method === 'POST') {

                var LeaseId = scriptContext.request.parameters.custpage_lease_header;
                var Lessee = scriptContext.request.parameters.custpage_lease_lessee;
                var LeaseVin = scriptContext.request.parameters.custpage_lease_vin;
                var ReturnTypes = scriptContext.request.parameters.custpage_return_type;
                var LeaseReceivables = scriptContext.request.parameters.custpage_lease_receivables;
                var NonrefundDep = scriptContext.request.parameters.custpage_non_refund_dep;
                var PurchaseOption = scriptContext.request.parameters.custpage_purchase_option;
                var TotalAmount = scriptContext.request.parameters.custpage_total_amount;
                var NonrefundDeppaid = scriptContext.request.parameters.custpage_non_ref_dep_paid;
                var LeaseInstaPaid = scriptContext.request.parameters.custpage_lease_insta_paid;
                var AdvinstallPaid = scriptContext.request.parameters.custpage_adv_insta_paid;
                var RecBalDue = scriptContext.request.parameters.custpage_lease_receivables_balancedue;
                var SalestaxRec = scriptContext.request.parameters.custpage_sales_tax_receivable;
                var Unpaid = scriptContext.request.parameters.custpage_unpaid_lease_charges;
                var TotBalDue = scriptContext.request.parameters.custpage_total_balance_due;

                record.submitFields({
                    type:"customrecord_advs_lease_header",
                    id:LeaseId,
                    values:{
                        "custrecord_advs_l_h_status": 7,
                    }
                });


                var headerrec = record.create({type: 'customrecord_advs_lease_pay_off', isDynamic: true});
                headerrec.setValue({fieldId: 'custrecord_advs_pay_off_lease_header_lin', value: LeaseId});
                headerrec.setValue({fieldId: 'custrecord_advs_pay_off_lease_vin', value: LeaseVin});
                
                headerrec.setValue({ fieldId: "custrecord_advs_pay_off_lessee_lease", value: Lessee });

                if(ReturnTypes){

                    headerrec.setValue({ fieldId: "custrecord_advs_pay_off_return_type", value: ReturnTypes });
                }
                
                
                if(LeaseReceivables){
                    headerrec.setValue({ fieldId: "custrecord_advs_pay_off_lease_receivable", value: LeaseReceivables });    
                }
                
                if(NonrefundDep){
                    headerrec.setValue({ fieldId: "custrecord_advs_pay_off_non_ref_deposit", value: NonrefundDep });    
                }
                
                if(PurchaseOption){
                    headerrec.setValue({ fieldId: "custrecord_advs_pay_off_purchase_option", value: PurchaseOption });    
                }
                
                if(TotalAmount){
                    headerrec.setValue({ fieldId: "custrecord_advs_pay_off_total_amount", value: TotalAmount });    
                }
                
                if(LeaseInstaPaid ){
                    headerrec.setValue({ fieldId: "custrecord_advs_pay_off_lease_insta_paid", value: LeaseInstaPaid });    
                }
                
                if(AdvinstallPaid ){
                    headerrec.setValue({fieldId: "custrecord_advs_pay_off_adv_lease_paid", value: AdvinstallPaid });    
                }
                
                if(NonrefundDeppaid){
                    headerrec.setValue({ fieldId: "custrecord_advs_pay_off_non_ref_dep_paid", value: NonrefundDeppaid });    
                }
                
                if(AdvinstallPaid){
                    headerrec.setValue({ fieldId: "custrecord_advs_pay_off_adv_lease_paid", value: AdvinstallPaid });
    
                }
                                if(AdvinstallPaid){
                    headerrec.setValue({ fieldId: "custrecord_advs_pay_off_lease_recei_bal", value: AdvinstallPaid });    
                }
                
                if(SalestaxRec){
                    headerrec.setValue({ fieldId: "custrecord_advs_pay_off_sales_tax_on_lea", value: SalestaxRec });
    
                }
                                if(Unpaid){
                    headerrec.setValue({ fieldId: "custrecord_advs_pay_off_unpaid_lease_cha", value: Unpaid });
                    
                }
                if(TotBalDue){
                    headerrec.setValue({fieldId: "custrecord_advs_pay_off_tot_bal_due", value: TotBalDue });    
                }
                



                // var headerrec	=	record.load({type:"customrecord_advs_lease_header", id:LeaseId});

                // headerrec.setValue({fieldId:"custrecord_advs_l_h_status",value:6});

                // var recmach	=	"recmachcustrecord_advs_pay_off_lease_header_lin";
                // headerrec.selectNewLine({sublistId: recmach});
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_lease_vin", value: LeaseVin });
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_lessee_lease", value: Lessee });
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_return_type", value: ReturnTypes });
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_lease_receivable", value: LeaseReceivables });
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_non_ref_deposit", value: NonrefundDep });
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_purchase_option", value: PurchaseOption });
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_total_amount", value: TotalAmount });
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_lease_insta_paid", value: LeaseInstaPaid });
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_adv_lease_paid", value: AdvinstallPaid });
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_non_ref_dep_paid", value: NonrefundDeppaid });
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_adv_lease_paid", value: AdvinstallPaid });
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_lease_recei_bal", value: AdvinstallPaid });
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_sales_tax_on_lea", value: SalestaxRec });
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_unpaid_lease_cha", value: Unpaid });
                // headerrec.setCurrentSublistValue({sublistId: recmach, fieldId: "custrecord_advs_pay_off_tot_bal_due", value: TotBalDue });

                // headerrec.commitLine({sublistId: recmach});

                
                headerrec.save({ignoreMandatoryFields: true,enableSourcing: true});

                var onclickScript = " <html><body> <script type='text/javascript'>" +
                "try{" +
                "";
            onclickScript += "window.parent.location.reload();";
           onclickScript+="window.parent.closePopup();";
            onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";

            scriptContext.response.write(onclickScript);
                // redirect.redirect({
                //     url: redirectUrl
                // });
            }
        }

        return {onRequest}
        
    });

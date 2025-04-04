/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/search'],

    function(search) {
        
        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {
            var currentRecord = scriptContext.currentRecord;
            var Selstatus   =  currentRecord.getValue({fieldId:'custpage_changestatus'});
            var currentCustomer = currentRecord.getValue({fieldId:'custpage_change_customer'});
            if ((currentCustomer != null && currentCustomer != '' && currentCustomer != undefined) && (Selstatus==1)) {
              //  alert("i"+currentCustomer)
                var newcustField = currentRecord.getField({
                    fieldId: 'custpage_change_customer'
                });
                newcustField.isDisabled = true;
            } else {
                var newcustField = currentRecord.getField({
                    fieldId: 'custpage_change_customer'
                });
                newcustField.isDisabled = false;
            }
                
                            // if((Selstatus == 1) && (!currentCustomer)){

                            //     var newcustField = currentRecord.getField({
                            //         fieldId: 'custpage_change_customer'
                            //     });
                            //     newcustField.isDisabled = true;
                            // }

        }
    
        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {
                var currentRecord = scriptContext.currentRecord;
    
                 if(scriptContext.fieldId=='custpage_changestatus'){
                    var Selstatus   =  currentRecord.getValue({fieldId:'custpage_changestatus'});
                    var currentCustomer = currentRecord.getValue({fieldId:'custpage_change_customer'});
                    if ((currentCustomer != null && currentCustomer != '' && currentCustomer != undefined) && (Selstatus==1)) {
                      //  alert("i"+currentCustomer)
                        var newcustField = currentRecord.getField({
                            fieldId: 'custpage_change_customer'
                        });
                        newcustField.isDisabled = true;
                    } else {
                        var newcustField = currentRecord.getField({
                            fieldId: 'custpage_change_customer'
                        });
                        newcustField.isDisabled = false;
                    }
                }
    
    
          
                if(scriptContext.fieldId=='custpage_registration_fee' ||
                    scriptContext.fieldId=='custpage_titlefee' ||
                    scriptContext.fieldId=='custpage_pickupfee' ||
                    scriptContext.fieldId=='custpage_tax_amount'||
                    scriptContext.fieldId=='custpage_deposit_disco'||
                    scriptContext.fieldId=='custpage_payment_disco'||
                    scriptContext.fieldId=='custpage_pp_tax_amount'
                )
                {
                    var regFee = currentRecord.getValue({fieldId:'custpage_registration_fee'})||0;
                    var titleFee = currentRecord.getValue({fieldId:'custpage_titlefee'})||0;
                    var pickupFee = currentRecord.getValue({fieldId:'custpage_pickupfee'})||0;
                    var TaxAmount = currentRecord.getValue({fieldId:'custpage_tax_amount'})||0;
                    var depAmount = 0;//currentRecord.getValue({fieldId:'custpage_create_deposit_amount'})||0;
                    var DepositIncp = currentRecord.getValue({fieldId:'custpage_deposit_inception'})||0;
                    var PaymentIncp = currentRecord.getValue({fieldId:'custpage_payment_inception'})||0;
                    var Depdis      = currentRecord.getValue({fieldId:'custpage_deposit_disco'})||0;
                    var Paydis      = currentRecord.getValue({fieldId:'custpage_payment_disco'})||0;
                    var taxRate      = currentRecord.getValue({fieldId:'custpage_tax_code_fld'})||0;
                    var pptax      = currentRecord.getValue({fieldId:'custpage_pp_tax_amount'})||0;

                    var remainbal = 0;//currentRecord.getValue({fieldId:'custpage_create_depo_remaining_bal'})||0;
                    var delbaordid = 0;//currentRecord.getValue({fieldId:'custpage_create_depo_devbrecid'})||0;
                    if(!DepositIncp){DepositIncp = 0}
                    if(!PaymentIncp){PaymentIncp = 0}

                    
                    // if (DepositIncp > 0 && Depdis > 0) {
                    //     var dediscount = (DepositIncp * Depdis) / 100; 
                    //     DepositIncp    = DepositIncp - dediscount;
                    //    // alert(DepositIncp)

                    // }
                   
                    // if (PaymentIncp > 0 && Paydis > 0) {
                    // var Paymentdiscount = (PaymentIncp * Paydis) / 100; 
                    // PaymentIncp         = PaymentIncp - Paymentdiscount;
                    // //alert(PaymentIncp)
                    // }
                    DepositIncp=(DepositIncp*1)-(Depdis*1);
                    PaymentIncp=(PaymentIncp*1)-(Paydis*1);
					currentRecord.setValue({fieldId:'custpage_deposit_disco_net',value:DepositIncp,ignoreFieldChange:true});
					currentRecord.setValue({fieldId:'custpage_payment_inception_net',value:PaymentIncp,ignoreFieldChange:true});
                    var totalInceptionValue = (DepositIncp*1)+(PaymentIncp*1);
                    //var incepAmount = currentRecord.getValue({fieldId:'custpage_create_depo_total_inception'})||0;
                   //CALCULATING TAX IF DISCOUNTS APPLIED
					if(totalInceptionValue>0)
					{
						 var TaxPercent = taxRate / 100;
                                TaxPercent = TaxPercent*1;
                                var TaxAmount = (totalInceptionValue*1)*(TaxPercent*1);
                                TaxAmount = TaxAmount*1;
                                TaxAmount = TaxAmount.toFixed(2);
					}
				   if(delbaordid!=0){
                        var rembal = remainbal - depAmount;
                    }else {
                        var total = (regFee*1)+(titleFee*1)+(pickupFee*1)+(TaxAmount*1);//+(incepAmount*1);
                        var incpTotal = (regFee*1)+(titleFee*1)+(pickupFee*1)+(TaxAmount*1)+(totalInceptionValue*1);
                        var rembal = depAmount - incpTotal;
                       incpTotal = incpTotal + (pptax*1)
                        currentRecord.setValue({fieldId:'custpage_total_inception',value:incpTotal,ignoreFieldChange:true});
                    }
					currentRecord.setValue({fieldId:'custpage_tax_amount',value:TaxAmount,ignoreFieldChange:true});
					
                }

                if(scriptContext.fieldId == 'custpage_change_customer'){
                    var Customer = currentRecord.getValue({fieldId:'custpage_change_customer'});
                    var DepositIncp = currentRecord.getValue({fieldId:'custpage_deposit_inception'});
                    var DepositIncpNet = currentRecord.getValue({fieldId:'custpage_deposit_disco_net'});
                    var PaymentIncp = currentRecord.getValue({fieldId:'custpage_payment_inception'}); 
                    var PaymentIncpNet = currentRecord.getValue({fieldId:'custpage_payment_inception_net'}); 
                    // var TotalIncep = (DepositIncp*1)+(PaymentIncp*1);
					if(DepositIncpNet==0){
						DepositIncpNet = DepositIncp;
						currentRecord.setValue({fieldId:'custpage_deposit_disco_net',value:DepositIncpNet,ignoreFieldChange:true});
					}
					if(PaymentIncpNet==0){
						PaymentIncpNet = PaymentIncp;
						currentRecord.setValue({fieldId:'custpage_payment_inception_net',value:PaymentIncpNet,ignoreFieldChange:true});
					}
                    var TotalIncep = (DepositIncpNet*1)+(PaymentIncpNet*1);
                    TotalIncep = TotalIncep*1;
                    if(Customer){
                        var SearchObj = search.lookupFields({
                            type: 'customer',
                            id: Customer,
                            columns: ['taxitem']
                        });
                        var TaxCode = SearchObj.taxitem && SearchObj.taxitem.length > 0 ? SearchObj.taxitem[0].value : null;
                        if(TaxCode){
                            var lookupObj = search.lookupFields({
                            type: 'taxgroup',
                            id: TaxCode,
                            columns: ['rate']
                        });
                        var taxRate = lookupObj.rate;
                            currentRecord.setValue({fieldId:'custpage_tax_code_fld',value:taxRate,ignoreFieldChange:true});
                            if(TotalIncep > 0 && taxRate){
                                var TaxPercent = taxRate / 100;
                                TaxPercent = TaxPercent*1;
                                var TaxAmount = (TotalIncep*1)*(TaxPercent*1);
                                TaxAmount = TaxAmount*1;
                                TaxAmount = TaxAmount.toFixed(2);
								
								TotalIncep = (TotalIncep*1)+(TaxAmount*1);
                                currentRecord.setValue({fieldId:'custpage_tax_amount',value:TaxAmount,ignoreFieldChange:true});
                                currentRecord.setValue({fieldId:'custpage_total_inception',value:TotalIncep,ignoreFieldChange:true});
                                
                                
                            }
                        }
                    }
                }
        }
    
        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {
    
        }
    
        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(scriptContext) {
    
        }
    
        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {
    
        }
    
        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {
    
        }
    
        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(scriptContext) {
    
        }
    
        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {
    
        }
    
        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {
    
        }
    
        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {
    
        }
    
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
    /*        postSourcing: postSourcing,
            sublistChanged: sublistChanged,
            lineInit: lineInit,
            validateField: validateField,
            validateLine: validateLine,
            validateInsert: validateInsert,
            validateDelete: validateDelete,
            saveRecord: saveRecord*/
        };
        
    });
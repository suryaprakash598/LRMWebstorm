/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */

define(['N/search', 'N/log','N/record','N/format'], function(search, log,record,format) {

        function getInputData() {
                var searchreturn;
                try{
                        searchreturn  = search.load({
                                id: 'customsearch_advs_ach_pay_create'
                        });
                }catch(e){
                        searchreturn = null;
                        log.error({
                                title: 'getInputData Error',
                                details: e
                        });
                }
                return searchreturn;
        }

        function map(context) {
                try {
                        var searchResult = JSON.parse(context.value);
                        log.debug("searchResult",searchResult);
                        var customerId = searchResult.values["GROUP(entity)"].value;
                        var leaseHead = searchResult.values["GROUP(custbody_advs_lease_head)"].value;
                        var stock_noT = searchResult.values["GROUP(custbody_advs_lease_head)"].text;
                        var subsiId = searchResult.values["GROUP(custrecord_advs_l_h_subsidiary.CUSTBODY_ADVS_LEASE_HEAD)"].value;
                        var amount = searchResult.values["SUM(amountremaining)"];

                        log.debug("leaseHead",leaseHead);
                        var PPM = searchResult.values["GROUP(custentity_advs_primary_payment_method.customer)"].value || "";
                        var EFT_AVAILABLE = searchResult.values["GROUP(custentity_advs_tam_eft_available.customer)"];
                        var ccStatus = searchResult.values["GROUP(custentity_advs_cc_status.customer)"].value || "";

                        var currREcObj	=	record.create({
                                type:"customrecord_advs_st_current_date_time",
                                isDynamic:true
                        });
                        var dateVal	=	currREcObj.getValue({fieldId:"custrecord_st_current_date"});

                        var amount_to_charge	=	amount;
                        var paymentMethod	=	"7";
                        var PayThrough	=	"12";
                        var ProdEft	=	false;

                        var csPayDe =   {};

                        /*   if((EFT_AVAILABLE == "T" || EFT_AVAILABLE == true) && (PPM == 8)){
                                   paymentMethod	=	"7";
                                   PayThrough	=	"12";
                                   ProdEft	=	true;

                                 csPayDe =   getCsPayInfo(customerId);

                           }else if((ccStatus == 3) && (PPM == 7 || PPM == 6)){
                                   var customerInfo = getCustomerinfo(customerId);

                                   paymentMethod	=	customerInfo.cctype;
                                   PayThrough	=	"12";
                                   ProdEft	=	false;
                           }*/

                        log.debug(paymentMethod,PayThrough+"=>"+ProdEft+"=>"+amount_to_charge);
                        log.debug("csPayDe",csPayDe);
                        var AvailableV	=	findAchCreated(customerId, leaseHead,"ACH");
                        if(AvailableV != "T"){
                                var AchHeadId =      createAchRecordMi(leaseHead,amount_to_charge,customerId,paymentMethod,PayThrough,dateVal,ProdEft,
                                    "ACH",subsiId,csPayDe);

                                context.write({
                                        key: customerId,
                                        value: {
                                                leaseHead: leaseHead,
                                                amount: amount,
                                                AchHeadId: AchHeadId // Adding AchHeadId to the context value
                                        }
                                });
                        }



                } catch (e) {
                        log.error('Error occurred during mapping', e);
                }
        }

        function reduce(context) {

                var reduce_key = context.key;

                var customerId = context.key;
                for (var i = 0; i < context.values.length; i++) {
                        var Json_data_A = JSON.parse(context.values[i]);
                        var recid       = Json_data_A.AchHeadId;
                        var amount      = Json_data_A.amount;
                        var leaseHead   = Json_data_A.leaseHead;

                        if(recid){
                                // Process customer payment using AchHeadId
                                                        processCustomerPayment(customerId, amount, recid);
                        }



                }

        }

        function summarize(summary) {
                try {
                        summary.output.iterator().each(function(key, value) {
                                log.debug('Summarized Key: ' + key + ', Value: ' + value);
                                return true;
                        });
                } catch (e) {
                        log.error('Error occurred during summarization', e);
                }
        }

        function processCustomerPayment(customerId, totalAmount, AchHeadId) {
                try {
                        // Load the ACH record using AchHeadId
                        var achRecord = record.load({
                                type: 'customrecord_advs_tam_ach_head',
                                id: AchHeadId,
                                isDynamic:true
                        });

                        // Retrieve necessary information from the ACH record
                        var amountToCharge = achRecord.getValue({ fieldId: 'custrecord_advs_tam_ach_amount' });
                        var customerIdFromRecord = achRecord.getValue({ fieldId: 'custrecord_advs_tam_ach_cus_link' });
                        var Recmach = 'recmachcustrecord_advs_tam_ch_head_link';

                        var AppliedPayment = new Array();
                        var PaymentByInv = new Array();
                        var jj_count = 0;
                        if (customerIdFromRecord === customerId) {
                                var LineCount = achRecord.getLineCount(Recmach);

                                log.debug("LineCount",LineCount)

                                CreateLine(LineCount, achRecord, AppliedPayment, PaymentByInv, 0, AchHeadId);
                                for (var L = 0; L < LineCount; L++) {
                                        var InvIdLine = achRecord.getSublistValue(Recmach, 'custrecord_advs_ach_inv_link', L);
                                        InvIdLine = InvIdLine * 1;
                                        var PaymentIdF = PaymentByInv[InvIdLine]; //
                                }
                                achRecord.setValue('custrecord_advs_tam_ach_pay_proc', true);
                                // achRecord.setValue('custrecord_advs_tam_ach_pay_proc', 'T');
                                var payID   = achRecord.save({ ignoreMandatoryFields: true, enableSourcing: true });



                                jj_count++;
                        } else {
                                log.error('Customer ID mismatch', 'CustomerId: ' + customerId + ', CustomerId from record: ' + customerIdFromRecord);
                        }
                } catch (e) {
                        log.error('Error processing customer payment', e);
                }
        }


        function getCsPayInfo(customerId){
                var name_cs , name_on_card , Account_no , Routing_no , Acc_type , Sec_code , Pay_method_type = "";
                var customrecord_cs_payment_typeSearchObj = search.create({
                        type: "customrecord_fd_abp_saved_card",
                        filters:
                            [
                                    ["custrecord_sc_customer","anyof",customerId],
                                    "AND",
                                    ["custrecord_sc_default_card","is","T"],
                                    "AND",
                                    ["custrecord_sc_type","anyof","7"],
                                    "AND",
                                    ["isinactive","is","F"]
                            ],
                        columns:
                            [
                                    search.createColumn({
                                            name: "name",
                                            sort: search.Sort.ASC,
                                            label: "Name"
                                    }),
                                    search.createColumn({name: "custrecord_cs_name_on_card", label: "Name on Card / Account"}),
                                    search.createColumn({name: "custrecord_cs_account_number", label: "Account Number"}),
                                    search.createColumn({name: "custrecord_cs_routing_number", label: "Routing Number"}),
                                    search.createColumn({name: "custrecord_cs_account_type", label: "Account Type"}),
                                    search.createColumn({name: "custrecord_cs_sec_code", label: "SEC Code"}),
                                    search.createColumn({name: "custrecord_cs_type_payment_method", label: "Payment Method"}),
                                    search.createColumn({name: "internalid", label: "internalid"}),
                            ]
                });
                var searchResultCount = customrecord_cs_payment_typeSearchObj.runPaged().count;
                customrecord_cs_payment_typeSearchObj.run().each(function(result){

                        name_cs		   	=	result.getValue("internalid");
                        name_on_card    =    result.getValue("custrecord_cs_name_on_card");
                        Account_no      =    result.getValue("custrecord_cs_account_number");
                        Routing_no      =    result.getValue("custrecord_cs_routing_number");
                        Acc_type        =    result.getValue("custrecord_cs_account_type");
                        Sec_code        =    result.getValue("custrecord_cs_sec_code");
                        Pay_method_type =    result.getValue("custrecord_cs_type_payment_method");

                        /*       paymentMethod	=	"20";
                               PayThrough	=	"12";
                               ProdEft	=	true;*/

                        return true;
                });
                var obj = {};
                obj.name_cs =name_cs;
                obj.name_on_card =name_on_card;
                obj.Account_no =Account_no;
                obj.Routing_no =Routing_no;
                obj.Acc_type =Acc_type;
                obj.Sec_code =Sec_code;
                obj.Pay_method_type =Pay_method_type;
                // obj.paymentMethod =paymentMethod;
                // obj.PayThrough =PayThrough;
                // obj.ProdEft =ProdEft;

                return obj;
        }

        function createAchRecordMi(stockLink,Amount,customerId,paymentMethod,PayThrough,formattedTime,ProdEft,TamREf,subsiID,csPayDe){

                var now = new Date(formattedTime);
//		log.debug('now', now);
                var responseDate=format.parse({value:now,type:format.Type.DATE});


                var dateOnly =format.format({value:now,type:format.Type.DATE});
                log.debug('responseDate', responseDate+"=>"+dateOnly);

                var recordAch	=	record.create({
                        type:"customrecord_advs_tam_ach_head",
                        isDynamic:true
                });
                recordAch.setValue({fieldId:"custrecord_advs_tam_bt_st_number",value:stockLink});
                recordAch.setValue({fieldId:"custrecord_advs_tam_ach_st_number",value:stockLink});

                recordAch.setValue({fieldId:"custrecord_advs_tam_ach_amount",value:Amount});
                recordAch.setValue({fieldId:"custrecord_advs_tam_ach_cus_link",value:customerId});
                recordAch.setValue({fieldId:"custrecord_advs_tam_ach_payment_method",value:paymentMethod});
                recordAch.setValue({fieldId:"custrecord_advs_tam_ach_payment_through",value:PayThrough});
                recordAch.setValue({fieldId:"custrecord_advs_tam_payment_date",value:responseDate});
                recordAch.setValue({fieldId:"custrecord_advs_tam_production_link_eft",value:ProdEft});
                recordAch.setValue({fieldId:"custrecord_advs_tam_ref_number",value:TamREf});
                recordAch.setValue({fieldId:"custrecord_advs_tam_ach_lease_com",value:subsiID});
//		recordAch.setValue({fieldId:"custrecord_advs_tam_ach_pay_proc",value:true});
//		recordAch.setValue({fieldId:"custrecord_advs_tam_ach_inv_processed",value:true});
//		recordAch.setValue({fieldId:"custrecord_advs_tam_up_comp",value:true});
                /*        if(paymentMethod == "20" || paymentMethod == 20){
                                recordAch.setValue({fieldId:"custrecord_advs_ach_name",value:name_cs});
                                recordAch.setValue({fieldId:"custrecord_advs_ach_na_on_card",value:name_on_card});
                                recordAch.setValue({fieldId:"custrecord_advs_ach_acc_number",value:Account_no});
                                recordAch.setValue({fieldId:"custrecord_advs_advs_ach_routing_num",value:Routing_no});
                                recordAch.setValue({fieldId:"custrecord_advs_ach_acc_type",value:Acc_type});
                                recordAch.setValue({fieldId:"custrecord_advs_ach_sec_code",value:Sec_code});
                                recordAch.setValue({fieldId:"custrecord_advs_ach_pay_meth_type",value:Pay_method_type});
                        }*/

                /*  if(paytype){
                          recordAch.setValue({fieldId:"custrecord_advs_ach_hd_inv_type",value:paytype});
                  }*/


                attachAchInvoiceLines(recordAch,customerId,subsiID,stockLink,dateOnly,Amount);

                try{
                        var AchID =   recordAch.save({
                                ignoreMandatoryFields: true,
                                enableSourcing: true
                        });

                        return AchID;
                }catch(e){
                        var details	=	e+"=>"+e.message+"=>"+stockLink+"=>"+Amount+"=>"+customername
                            +"=>"+paymentMethod+"=>"+PayThrough+"=>"+formattedTime+"=>"+ProdEft+"=>"+TamREf;
                        log.error("ERRORdetails",details);
                }

        }

        function attachAchInvoiceLines(RecordObj, customerId, subsiID, stockLink, paymentDate, AmountDed) {
                var AmountAppliedFF = 0;
                var AmountRemainFF = AmountDed;

                var invoicesData = searchInvoicesForCustomer(customerId, subsiID, stockLink, paymentDate, "", AmountDed);
                var InvoiceLength = invoicesData.InvArrayByDate.length;

                log.debug("Invoice Length", InvoiceLength);

                if (InvoiceLength > 0) {
                        for (var i = 0; i < InvoiceLength; i++) {
                                if (AmountRemainFF <= 0) {
                                        break;
                                }

                                var ApplyInvId = invoicesData.InvArrayByDate[i];
                                var RemainAmount = invoicesData.InvAmountArray[i];

                                // Check if the invoice amount is greater than 0 before applying
                                if (RemainAmount <= 0) {
                                        continue;
                                }

                                // Calculate the amount to be applied to this invoice
                                var AmountToApply = Math.min(RemainAmount, AmountRemainFF);

                                // Update the remaining amount to be applied
                                AmountRemainFF -= AmountToApply;

                                log.debug("Applying Amount", {
                                        ApplyInvId: ApplyInvId,
                                        AmountApplied: AmountToApply,
                                        RemainingAmount: AmountRemainFF
                                });

                                // Create a line in the ACH record for this invoice
                                CreateLineInRecord(RecordObj, 'recmachcustrecord_advs_tam_ch_head_link', ApplyInvId, AmountToApply, 'F', invoicesData.InvDateArray[i]);
                        }
                }
        }


        function searchInvoicesForCustomer(CustomerId, subsiID, Stock_Link, payment_date, invType, AmountDed) {

                log.debug("paymentDate",payment_date+"=>"+Stock_Link);
                var filtersArr = new Array();
                filtersArr.push(["mainline","is","T"]);
                filtersArr.push("AND");
                filtersArr.push(["status","is","CustInvc:A"]);
                filtersArr.push("AND");
                filtersArr.push(["entity","anyof",CustomerId]);
                filtersArr.push("AND");
                filtersArr.push(["subsidiary","anyof",subsiID]);
                // filtersArr.push("AND");
                // filtersArr.push(["duedate","onorbefore",payment_date],"OR",["duedate","isempty",""]);
                filtersArr.push("AND");
                filtersArr.push(["amountremaining","greaterthan",0]);


                if (Stock_Link != null && Stock_Link != '' && Stock_Link != undefined) {
                        filtersArr.push("AND");
                        filtersArr.push(["custbody_advs_lease_head","anyof",Stock_Link]);
                }

                /*if (invType == 1 || invType == "1") {
                        searchFilters.push(search.createFilter({
                                name: 'custbody_advs_tam_from_reg_charges',
                                operator: search.Operator.IS,
                                values: 'T'
                        }));
                } else if (invType == 2 || invType == "2") {
                        searchFilters.push(search.createFilter({
                                name: 'custbody_advs_tam_for_other_charges',
                                operator: search.Operator.IS,
                                values: 'T'
                        }));
                }*/

                var invoiceSearch = search.create({
                        type: search.Type.INVOICE,
                        filters: filtersArr,
                        columns: [
                                search.createColumn({ name: 'internalid' }),
                                search.createColumn({ name: 'amount' }),
                                search.createColumn({ name: 'amountremaining' }),
                                search.createColumn({ name: 'trandate', sort: search.Sort.ASC })
                        ]
                });

                var InvArrayByDate = [];
                var InvAmountArray = [];
                var InvDateArray = [];
                var flag_rem_amount = 0;

                invoiceSearch.run().each(function(result) {
                        if (flag_rem_amount <= AmountDed) {
                                var InvoiceId = result.getValue('internalid');
                                var RemAmount = parseFloat(result.getValue('amountremaining'));
                                log.debug('InvoiceId', InvoiceId);
                                InvArrayByDate.push(InvoiceId);
                                InvAmountArray.push(RemAmount);
                                InvDateArray.push(result.getValue('trandate'));
                                flag_rem_amount += RemAmount;
                        }
                        return true;
                });

                log.debug("InvArrayByDate",InvArrayByDate);
                log.debug("InvAmountArray",InvAmountArray);
                log.debug("InvDateArray",InvDateArray);
                return {
                        InvArrayByDate: InvArrayByDate,
                        InvAmountArray: InvAmountArray,
                        InvDateArray: InvDateArray
                };
        }
        function getCustomerinfo(customerId){
                var cust_record = record.load({
                        type:"customer",
                        id:customerId,
                        isDynamic: true
                });
                var credit_card_count	=	cust_record.getLineCount({
                        sublistId:"creditcards"
                });

                var CCTYPE="";
                for(var j=0;j<credit_card_count;j++){
                        var def_credit = cust_record.getSublistValue({sublistId:'creditcards',fieldId: 'ccdefault',line:j});
                        if(def_credit == true){
                                CCTYPE=cust_record.getSublistValue({sublistId:'creditcards',fieldId: 'paymentmethod', line:j});
                                break;
                        }
                        else{
                        }
                }
                if(CCTYPE!=null){


                        if(CCTYPE=='VISA'){
                                CCTYPE=5;
                        }
                        if(CCTYPE=='Master Card')
                        {
                                CCTYPE=4;
                        }
                        if(CCTYPE=='American Express')
                        {
                                CCTYPE=6;
                        }
                        if(CCTYPE=='Discover')
                        {
                                CCTYPE=3;
                        }
                }

                var customerObj = {};
                customerObj.cctype = CCTYPE;

                return customerObj;
        }

        function CreateCalculationForLine(RemAmount, AmountDed) {
                var AmountApplied = Math.min(RemAmount, AmountDed);
                var AmountRemain = AmountDed - AmountApplied;
                var RemAmountRecord = RemAmount - AmountApplied;

                return AmountApplied + "#" + AmountRemain + "#" + RemAmountRecord;
        }
        function CreateLineInRecord(recordObj, sublistId, applyInvId, amountApplied, flag, invDate) {


                var responseDate=format.parse({value:invDate,type:format.Type.DATE});
                recordObj.selectNewLine({ sublistId: sublistId });
                recordObj.setCurrentSublistValue({ sublistId: sublistId, fieldId: 'custrecord_advs_ach_inv_link', value: applyInvId });
                recordObj.setCurrentSublistValue({ sublistId: sublistId, fieldId: 'custrecord_advs_tam_ch_chld_amount', value: amountApplied });
                // recordObj.setCurrentSublistValue({ sublistId: sublistId, fieldId: 'custrecord843', value: flag });
                recordObj.setCurrentSublistValue({ sublistId: sublistId, fieldId: 'custrecord_advs_ach_ch_date', value: responseDate });
                recordObj.commitLine({ sublistId: sublistId });
        }

        function CreateLine(LineCount, HeadRecordObj, AppliedPayment, PaymentByInv, flag, HeadId) {
                var payment_date = HeadRecordObj.getValue('custrecord_advs_tam_payment_date');
                var tam_ref_number = HeadRecordObj.getValue('custrecord_advs_tam_ref_number');
                var customer = HeadRecordObj.getValue('custrecord_advs_tam_ach_cus_link');
                var leaseHead = HeadRecordObj.getValue('custrecord_advs_tam_ach_st_number');
                var p_amount_cc = HeadRecordObj.getValue('custrecord_advs_tam_ach_amount') * 1;
                var Subsidiary = HeadRecordObj.getValue('custrecord_advs_tam_ach_lease_com');
                var is_production = HeadRecordObj.getValue('custrecord_advs_tam_production_link_eft');
                var Recmach = 'recmachcustrecord_advs_tam_ch_head_link';

                var PaymentRecord = record.create({ type: 'customerpayment', isDynamic: true });
                PaymentRecord.setValue('customer', customer);
                PaymentRecord.setValue('subsidiary', Subsidiary);
                PaymentRecord.setValue('custbody_advs_tam_ref_number', tam_ref_number);
                PaymentRecord.setValue('custbody_advs_lease_head', leaseHead);
                PaymentRecord.setValue('custbody_advs_ach_head_routing', HeadId);


                var AmountApplied = 0;
                var NOAPPLY = 'T';
                var CurrentInvId = [];

                for (var L = 0; L < LineCount; L++) {
                        var InvIdLine = HeadRecordObj.getSublistValue(Recmach, 'custrecord_advs_ach_inv_link', L);
                        var Amount = HeadRecordObj.getSublistValue(Recmach, 'custrecord_advs_tam_ch_chld_amount', L);
                        /*var AmountRemaining = nlapiLookupField('invoice', InvIdLine, 'amountremaining');*/

                        log.debug("InvIdLine",InvIdLine)
                        var fieldIds  = ["amountremaining"];
                        var fieldValues = search.lookupFields({
                                type: "invoice",
                                id: InvIdLine,
                                columns: fieldIds
                        });
                        var AmountRemaining = parseFloat(fieldValues.amountremaining);
                        if (AmountRemaining > 0) {
                                NOAPPLY = 'F';
                                if (PaymentRecord && AmountRemaining > 0.00) {
                                        PaymentRecord.setValue('trandate', payment_date);
                                        PaymentRecord.setValue('custbody_advs_payment_through', HeadRecordObj.getValue('custrecord_advs_tam_ach_payment_through'));
                                        PaymentRecord.setValue('paymentmethod', HeadRecordObj.getValue('custrecord_advs_tam_ach_payment_method'));

                                        var PaymentMethod = HeadRecordObj.getValue('custrecord_advs_tam_ach_payment_method');

                                        if (PaymentMethod == 20 || PaymentMethod == "20") {
                                                var AchName = HeadRecordObj.getValue('custrecord_advs_ach_name');
                                                if (AchName) {
                                                        PaymentRecord.setValue('custbody_cs_entity', customer);
                                                        PaymentRecord.setValue('custbody_cs_payment_type', AchName);
                                                        PaymentRecord.setValue('custbody_cs_name_on_account', HeadRecordObj.getValue('custrecord_advs_ach_na_on_card'));
                                                        PaymentRecord.setValue('custbody_cs_account_number_entry', HeadRecordObj.getValue('custrecord_advs_ach_acc_number'));
                                                        PaymentRecord.setValue('custbody_cs_routing_number', HeadRecordObj.getValue('custrecord_advs_advs_ach_routing_num'));
                                                        PaymentRecord.setValue('custbody_cs_account_type', HeadRecordObj.getValue('custrecord_advs_ach_acc_type'));
                                                        PaymentRecord.setValue('custbody_cs_sec_code', HeadRecordObj.getValue('custrecord_advs_ach_sec_code'));
                                                        PaymentRecord.setValue('custbody_cs_payment_method', HeadRecordObj.getValue('custrecord_advs_ach_pay_meth_type'));
                                                }
                                        }

                                        var payment_method = HeadRecordObj.getValue('custrecord_advs_tam_ach_payment_method');

                                        /*   if (payment_method != null && payment_method != '' && payment_method != undefined) {
                                                   var is_cre_checked = PaymentRecord.getValue('custbody_advs_tam_is_pay_meth');
                                                   PaymentRecord.setValue('chargeit', is_cre_checked == 'T' ? 'T' : 'F');
                                           }*/

                                        PaymentRecord.setValue('custbody_lease_card_link', HeadRecordObj.getValue('custrecord_advs_tam_ach_st_number'));

                                        var InvoicesCount = PaymentRecord.getLineCount('apply');

                                        for (var I = 0; I < InvoicesCount; I++) {
                                                var PayInvId = PaymentRecord.getSublistValue('apply', 'doc', I);

                                                log.debug("PayInvId",InvoicesCount+"=>"+PayInvId+"=>"+InvIdLine+"=>"+I+"=>"+AmountRemaining)
                                                if (PayInvId == InvIdLine) {
                                                        if (AmountRemaining > 0.00) {
                                                                AppliedPayment.push(InvIdLine);
                                                                CurrentInvId.push(InvIdLine);

                                                                PaymentRecord.selectLine({sublistId:"apply",line:I});
                                                                PaymentRecord.setCurrentSublistValue({sublistId:"apply",fieldId:"apply",value:true});
                                                                PaymentRecord.setCurrentSublistValue({sublistId:"apply",fieldId:"amount",value:Amount});
                                                                PaymentRecord.commitLine({sublistId:"apply"});

                                                                /*PaymentRecord.setSublistValue({sublistId:'apply', fieldId:'apply', line:I, value:'T'});
                                                                PaymentRecord.setSublistValue({sublistId:'apply',fieldId: 'amount', line:I, value:Amount});*/
                                                                AmountApplied = Amount * 1 + AmountApplied * 1;
                                                                break;
                                                        }
                                                }
                                        }
                                }
                        }
                }

                if (AmountApplied != p_amount_cc) {
                        AmountApplied = p_amount_cc;
                }

                if (PaymentRecord) {
                        PaymentRecord.setValue('payment', AmountApplied);
                        PaymentRecord.setValue('trandate', payment_date);
                        PaymentRecord.setValue('custbody_advs_tam_opening_cr_balance', 'T');
                        PaymentRecord.setValue('custbody_advs_payment_through', HeadRecordObj.getValue('custrecord_advs_tam_ach_payment_through'));
                        PaymentRecord.setValue('paymentmethod', HeadRecordObj.getValue('custrecord_advs_tam_ach_payment_method'));
                        // PaymentRecord.setValue('custbody_lease_card_link', HeadRecordObj.getValue('custrecord_advs_tam_ach_st_number'));

                        if(CurrentInvId.length >0){

                                var PayId	=	PaymentRecord.save({ignoreMandatoryFields:true,enableSourcing:true});
                                for(var C=0;C<CurrentInvId.length;C++){
                                        PaymentByInv[CurrentInvId[C]*1]  = PayId;
                                }
                        }

                        if (NOAPPLY == 'F' && AppliedPayment.length != LineCount) {
                                AmountApplied = 0;
                                CreateLine(LineCount, HeadRecordObj, AppliedPayment, PaymentByInv, 1, HeadId);
                        }
                }
        }

        var achData	=	new Array();
        function findAchCreated(customername,stock_no,REference){
                var DataExist	=	"F";
                var customrecord_advs_tam_ach_headSearchObj = search.create({
                        type: "customrecord_advs_tam_ach_head",
                        filters:
                            [
                                    ["created","on","today"]
                                    ,"AND",
                                    ["custrecord_advs_tam_ach_cus_link","anyof",customername]
                                    ,"AND",
                                    ["custrecord_advs_tam_ach_st_number","anyof",stock_no]
                                    ,"AND",
                                    ["custrecord_advs_tam_ref_number","is",REference]
                            ],
                        columns:
                            [
                                    search.createColumn({
                                            name: "custrecord_advs_tam_ach_st_number"
                                    }),
                                    search.createColumn({
                                            name: "custrecord_advs_tam_ach_cus_link"
                                    })
                            ]
                });
                var searchResultCount = customrecord_advs_tam_ach_headSearchObj.runPaged().count;
                customrecord_advs_tam_ach_headSearchObj.run().each(function(result){
                        // .run().each has a limit of 4,000 results
                        var stLink		=	result.getValue("custrecord_advs_tam_ach_st_number");
                        var customer	=	result.getValue("custrecord_advs_tam_ach_cus_link");

                        if(achData[customer] != null && achData[customer] != undefined){
                                if(achData[customer][stLink] != null && achData[customer][stLink] != undefined){

                                }else{
                                        achData[customer][stLink]	=	new Array();
                                }

                        }else{
                                achData[customer]			=	new Array();
                                achData[customer][stLink]	=	new Array();
                        }

                        DataExist	=	"T";
                        return true;
                });

                return DataExist;
        }


        return {
                getInputData: getInputData,
                map: map,
                reduce: reduce,
                summarize: summarize
        };

});

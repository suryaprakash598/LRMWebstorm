/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search','N/ui/serverWidget','./advs_lib_rental_leasing','./advs_lib_util','N/format'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     */
    (record, runtime, search,serverWidget,lib_rental,libUtil,format) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            var request   =   scriptContext.request;
            var response =   scriptContext.response;
            if(request.method == "GET"){
                var form	=	serverWidget.createForm({title:" "});
                var recId	=	request.parameters.requestID;


                PostRegInvoiceKal(recId);

                var onclickScript=" <html><body> <script type='text/javascript'>" +
                    "try{" +

                    "";
                onclickScript+="window.parent.location.reload();";
                onclickScript+="window.parent.closePopup();";
                onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";

                response.write(onclickScript);

                // form.addSubmitButton("Submit");

                // response.writePage(form);
            }else{
                /*     var recId	=	request.parameters.custpage_rec;
                     var dateS	=	request.parameters.custpage_date;

                     PostRegInvoiceKal(recId,dateS);

                     var onclickScript=" <html><body> <script type='text/javascript'>" +
                         "try{" +

                         "";
                     onclickScript+="window.parent.location.reload();";
                    onclickScript+="window.parent.closePopup();";
                     onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";
                     response.write(onclickScript);*/
            }
        }

        function PostRegInvoiceKal(headerID){

            var headerREc	=	record.load({type:"customrecord_advs_lease_header", id:headerID, isDynamic:true});
            var customer	=	headerREc.getValue("custrecord_advs_l_h_customer_name");//headerREc.custrecord_advs_l_h_customer_name;
            var customerText=	headerREc.getText("custrecord_advs_l_h_customer_name");
            var Location	=	headerREc.getValue("custrecord_advs_l_h_location");//headerREc.custrecord_advs_l_h_location;
            var subsId   	=	headerREc.getValue("custrecord_advs_l_h_subsidiary");//headerREc.custrecord_advs_l_h_location;
            var Charge		=	headerREc.getValue("custrecord_advs_l_h_charge_tax");//headerREc.custrecord_advs_l_h_charge_tax;
            var TaxCode		=	headerREc.getValue("custrecord_advs_l_h_tax_code");//headerREc.custrecord_advs_l_h_tax_code;
            var Frequency	=	headerREc.getValue("custrecord_advs_l_h_pay_freq");//headerREc.custrecord_advs_l_h_pay_freq;
            var TaxRate		=	headerREc.getValue("custrecord_advs_c_h_tx_rate");//headerREc.custrecord_advs_c_h_tx_rate;
            var EqpPrice		            =	headerREc.getValue("custrecord_advs_l_a_tot_eqp_price");//headerREc.custrecord_advs_l_a_tot_eqp_price*1;
            var AdminFee		            =	headerREc.getValue("custrecord_advs_l_a_tot_eqp_price");//headerREc.custrecord_advs_l_a_tot_eqp_price*1;
            var downPay			    =	headerREc.getValue("custrecord_advs_l_h_depo_ince")*1;//headerREc.custrecord_advs_l_a_down_payment*1;
            var payDate			            =	headerREc.getValue("custrecord_advs_l_a_pay_st_date");
            var pickuppayment			            =	headerREc.getValue("custrecord_advs_pick_pay_fee")||0;
            var pickupdate1			            =	headerREc.getValue("custrecord_advs_paymnt_adte")||'';
            var pickupdate2			            =	headerREc.getValue("custrecord_advs_pickup_date")||'';
            var vinID		                =	headerREc.getValue("custrecord_advs_la_vin_bodyfld");//headerREc.custrecord_advs_c_h_tx_rate;
            var firstInception		=	headerREc.getValue("custrecord_advs_l_h_pay_incep")*1;

            var terms		        =	headerREc.getValue("custrecord_advs_l_h_terms")*1;
            var leaseStart			            =	headerREc.getValue("custrecord_advs_l_h_start_date");
            var convleaseStart  =    format.parse({
                type: format.Type.DATE,
                value: leaseStart
            });

            var setupData   = lib_rental.invoiceTypeSearch();
            // var stockData   = lib_rental.getLeaseStockLines(headerID);

            var lookFld = ["custrecord_advs_vm_subsidary", "name", "cseg_advs_st_vin_se",
                "cseg_advs_sto_num", "custrecord_advs_vm_last_direct_cost",
                "custrecord_advs_vm_purchase_invoice_date","custrecord_advs_vm_model","custrecord_advs_vm_model.assetaccount"]

            var lookRec = search.lookupFields({
                type: "customrecord_advs_vm",
                id: vinID,
                columns: lookFld
            });
            var aDJaCC = "";

            var VinModel    =   lookRec["custrecord_advs_vm_model"][0].value;
            var subsi = lookRec["custrecord_advs_vm_subsidary"][0].value;

            var vinSeg = "";
            var stockSeg = "";
            if (lookRec['cseg_advs_st_vin_se'] != null && lookRec['cseg_advs_st_vin_se'] != undefined) {
                vinSeg = lookRec["cseg_advs_st_vin_se"][0].value || "";
            }
            if (lookRec['cseg_advs_sto_num'] != null && lookRec['cseg_advs_sto_num'] != undefined) {
                stockSeg = lookRec["cseg_advs_sto_num"][0].value|| "";
            }


            var vinName = lookRec["name"];
            var purChasecost = lookRec["custrecord_advs_vm_last_direct_cost"];
            var purChasedate = lookRec["custrecord_advs_vm_purchase_invoice_date"];
            var VinAccount  =   lookRec["custrecord_advs_vm_model.assetaccount"][0].value;

            var convPodate  =    format.parse({
                type: format.Type.DATE,
                value: purChasedate
            });



            var createdRecType = [];var createdRecId = [];
            try {
                var vehicleAvailability = lib_rental.getinventoryAvailability(vinName, VinModel);
                var inventoryLoc = vehicleAvailability.location;
                var inventoryNum = vehicleAvailability.inventorynumber;

                var vehicleValueData = lib_rental.getinventorycost(vinName, VinModel, VinAccount, inventoryLoc);
                var vehicleValue = vehicleValueData.vehiclecost;
				log.debug('vehicleValue',vehicleValue);

                var invoiceID = "";
                var nexInvDate = "";
                var _invoiceID = "";
                var invoicedDate = "";
                var tranDate = format.parse({
                    value: new Date(),
                    type: format.Type.DATE
                });
                invoicedDate = tranDate;

                var Memo = "FAM Conversion";
                var Account = runtime.getCurrentScript().getParameter("custscript_advs_veh_fam_account");
                var Address = "";
                var shipAddre = "";

                var adj_obj = {
                    body: {
                        subsidiary: subsId,
                        account: Account,
                        trandate: invoicedDate,
                        location: Location,
                        adjlocation: Location,
                        memo: Memo,
                        vinid: vinID,
                        entityid: customer,
                    },
                    lines: [
                        {
                            item: VinModel,
                            quantity: "-1",
                            rate: 0,
                            description: "FAM Conversion",
                            vinid: vinID,
                            location: Location,
                            vinsegment: vinSeg,
                            stocksegment: stockSeg,
                            inventorynumber: inventoryNum
                        }
                    ]
                };
                var adjustID = lib_rental.createInventoryAdjustment(adj_obj);

				log.debug('adjustID',adjustID);
                var assetId = "";
                if (adjustID) {
                    createdRecType.push("inventoryadjustment");
                    createdRecId.push(adjustID);
                    /**
                     *
                     * Create FAM
                     *
                     * */
                    var assetType = "1";
                    var residual = 6000;
                    var depreMethod = "3";
                    var assetLifeTime = terms;

                    var famObj = {};
                    famObj.name = vinName;
                    famObj.assettype = assetType;
                    famObj.subsidiaries = subsi;
                    famObj.location = Location;
                    famObj.purchasecost = (vehicleValue*1)// purChasecost;
                    famObj.currentvalue = ((vehicleValue*1)); //adding vehicle value with purchase cost on 300125
                    famObj.residual = residual;
                    famObj.depreciationmethod = depreMethod;
                    famObj.assetlifetime = assetLifeTime;
                    famObj.vinid = vinID;
                    famObj.depreciationactive = 1;
                    famObj.tranid = adjustID;
                    famObj.includereport = true;
                    famObj.revisionrules = 2;
                    famObj.depreciationrules = 1;
                    famObj.podate = convPodate;
                    famObj.department = 4;
                    famObj.depreciationdate = convleaseStart;
                    famObj.leaseId = headerID;

                    var generatedValues = lib_rental.generateAssetValuesFromProposal(famObj)
                    var assetFieldValues = generatedValues.assetFieldValues;
                    var assetObj = record.create({
                        type: 'customrecord_ncfar_asset',
                        isDynamic: true
                    });

                    for (const fld in assetFieldValues) {
                        assetObj.setValue({
                            fieldId: fld,
                            value: assetFieldValues[fld]
                        });
                    }

                    assetId = assetObj.save();
					log.debug('assetId',assetId);
					if(assetId)
					{
						if(true){
								 var Fields = [
								 'custrecord_assetsourcetrn',
								 'custrecord_assetcurrentcost',
								 'custrecord_assetbookvalue',
								 'custrecord_assetstatus',
								 'custrecord_assetcost'
								 ];
								var FamSearch = search.lookupFields({type:'customrecord_ncfar_asset',id:assetId,columns:Fields});
								//var FamSearch = nlapiLookupField('customrecord_ncfar_asset',assetId,Fields);
								 var InvAdjLink = FamSearch.custrecord_assetsourcetrn[0].value;
								 var CurrentCost = FamSearch.custrecord_assetcurrentcost;
								 var OriginalCost = FamSearch.custrecord_assetcost;
								 var CurrentNetValue = FamSearch.custrecord_assetbookvalue;
								 var AssetStatus = FamSearch.custrecord_assetstatus[0].value;
									log.debug('vehicleValue',vehicleValue);
								 if(InvAdjLink && AssetStatus == 6){
								 var AddedCost = /* (vehicleValue*1)+ */(OriginalCost*1);
								 // var AddedNetValue = (vehicleValue*1)+(CurrentNetValue*1);
								 var AddedNetValue = (vehicleValue*1)+(OriginalCost*1);
								 log.debug('AddedNetValue',AddedNetValue+'@AddedCost@'+AddedCost);
								 var fields = ['custrecord_assetcurrentcost'];//
								 var Values = [AddedCost];
                                   record.submitFields({type:'customrecord_ncfar_asset',id:assetId,values:{custrecord_assetcost:vehicleValue},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
								 record.submitFields({type:'customrecord_ncfar_asset',id:assetId,values:{custrecord_assetcurrentcost:vehicleValue},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
								// nlapiSubmitField('customrecord_ncfar_asset',assetId,fields,Values);
								 
								 var FieldsU = ['custrecord_assetbookvalue'];//
								 var ValuesU = [AddedNetValue];
								 record.submitFields({type:'customrecord_ncfar_asset',id:assetId,values:{custrecord_assetbookvalue:vehicleValue},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
								// nlapiSubmitField('customrecord_ncfar_asset',assetId,FieldsU,ValuesU);
									}
								}
								updateAssetValue(assetId,vehicleValue);
								var famlookobj = search.lookupFields({type:'customrecord_ncfar_asset',id:assetId,columns:
									[
									'custrecord_assetcost','custrecord_advs_fam_lease_link',
									'custrecord_vin','custrecord_assetsourcetrn',
									'custrecord_advs_disposal_ia','custrecord_assetstatus'
									]});
									var originalcost = famlookobj["custrecord_assetcost"]; 
									var leaseid = famlookobj["custrecord_advs_fam_lease_link"][0].value; 
									var vin = famlookobj["custrecord_vin"][0].value; 
									var  ia2 ='';
									var  ia1 ='';
									var  status ='';
                        if (famlookobj['custrecord_assetsourcetrn'] != null && famlookobj['custrecord_assetsourcetrn'] != undefined) {
                             ia1 = famlookobj["custrecord_assetsourcetrn"][0].value || "";
                        }
						if (famlookobj['custrecord_advs_disposal_ia'] != null && famlookobj['custrecord_advs_disposal_ia'] != undefined) {
                            ia2 = famlookobj["custrecord_advs_disposal_ia"][0].value || "";
                        }
						if (famlookobj['custrecord_assetstatus'] != null && famlookobj['custrecord_assetstatus'] != undefined) {
                            status = famlookobj["custrecord_assetstatus"][0].text || "";
                        }
								var truckfamobj = {};
								truckfamobj.famid = assetId;
								truckfamobj.originalcost = originalcost;
								truckfamobj.status = status;
								truckfamobj.leaseid = leaseid;
								truckfamobj.ia1 = ia1;
								truckfamobj.ia2 = ia2;
								truckfamobj.vin = vin;
								log.debug('truckfamobj',truckfamobj);
								var idtruck = lib_rental.FAMHistoryOnCURD(truckfamobj);
								log.debug('idtruck',idtruck);
					}
					
                    createdRecType.push("customrecord_ncfar_asset");
                    createdRecId.push(assetId);
					log.debug('createdRecType',createdRecType);
                }


                if (assetId && adjustID) {

                    log.debug("invoicetype",setupData[libUtil.rentalinvoiceType.lease_reqular]["id"]);
                    var obj = {
                        invoicebody: {
                            customer: customer,
                            date: payDate,
                            subsidiary: subsId,
                            location: Location,
                            leaseid: headerID,
                            invoicetype: setupData[libUtil.rentalinvoiceType.lease_reqular]["id"]
                        },
                        linesData: [
                            {
                                item: setupData[libUtil.rentalinvoiceType.lease_reqular]["principalItem"],
                                quantity: 1,
                                rate: firstInception,
                                description: "Lease Inception",
                                amount: firstInception,
                                custcol_advs_st_applied_to_vin: vinID
                            }
                        ]
                    };

                    log.debug("obj",obj)
                    invoiceID = lib_rental.createInvoice(obj, setupData, libUtil);
                    createdRecType.push("invoice");
                    createdRecId.push(invoiceID);
                    var depositAppli = "";
                    if(invoiceID){
                        var invoiceRec  =   search.lookupFields({
                            type:"invoice",
                            id:invoiceID,
                            columns:["tranid","total"]
                        });
                        var traindinv   =   invoiceRec.tranid;
                        var invoiceTot   =   invoiceRec.total;
                        invoiceTot  =   invoiceTot*1;

                        // Search for unapplied deposits
                        var depositSearch = search.create({
                            type: 'customerdeposit',
                            filters: [
                                ['custbody_advs_st_vin_invoice', 'anyof', vinID],
                                'AND',
                                ['mainline', 'is', 'T'],  // Filter for the mainline of the deposit record
                                'AND',
                                ['status', 'anyof', 'CustDep:A'],  // Filter for unapplied deposits
                                'AND',
                                ['name', 'anyof', customer]
                            ],
                            columns: ['internalid','amount']
                        });
                        var depositResults = depositSearch.run().getRange({ start: 0, end: 1000 });

                        log.debug("depositResults",depositResults);
                        // If deposits are found, apply them
                        if (depositResults.length > 0) {
                            depositResults.forEach(function (result) {
                                var depositId = result.getValue('internalid');
                                var depositAmount = parseFloat(result.getValue('amount'));  // Deposit amount


                                // log.debug("depositId",depositId);
                                // Transform deposit into a deposit application record
                                var depositApplicationRecord = record.transform({
                                    fromType: 'customerdeposit',
                                    fromId: depositId,
                                    toType: 'depositapplication',
                                    isDynamic: true
                                });

                                var lineCount = depositApplicationRecord.getLineCount({ sublistId: 'apply' });

                                var depositApplied = false;
                                // log.debug("depositId==>lineCount",lineCount);
                                for (var i = 0; i < lineCount; i++) {
                                    var referenceNumber = depositApplicationRecord.getSublistValue({ sublistId: 'apply', fieldId: 'refnum', line: i });
                                    //log.debug("referenceNumber",invoiceID+"=>"+referenceNumber);
                                    // Apply the deposit to the invoice if the reference number matches
                                    if (referenceNumber == invoiceID || traindinv == referenceNumber) {
                                        var applyAmount = Math.min(depositAmount, invoiceTot);

                                        depositApplicationRecord.selectLine({sublistId:"apply",line:i});
                                        depositApplicationRecord.setCurrentSublistValue({sublistId:"apply",fieldId:"apply",value:true});
                                        depositApplicationRecord.setCurrentSublistValue({sublistId:"apply",fieldId:"amount",value:invoiceTot});
                                        depositApplicationRecord.commitLine({sublistId:"apply"});
                                        /*depositApplicationRecord.setSublistValue({ sublistId: 'apply', fieldId: 'apply', line: i, value: true });// Apply the deposit to this line
                                        depositApplicationRecord.setSublistValue({ sublistId: 'apply', fieldId: 'amount', line: i, value: firstInception });*/ // Apply the full invoice amount
                                        depositAmount -= applyAmount;
                                        invoiceTot -= applyAmount;
                                        depositApplied = true;

                                        // If the deposit amount has been fully applied, exit loop
                                        if (depositAmount <= 0 || invoiceTot <= 0) {
                                            break;
                                        }
                                    }
                                }

                                log.debug("depositApplied",depositApplied);
                                // Submit the deposit application record if changes were made
                                if (depositApplied) {
                                    depositAppli  =  depositApplicationRecord.save({ enableSourcing: true, ignoreMandatoryFields: true });

                                    createdRecType.push("depositapplication");
                                    createdRecId.push(depositAppli);
                                    log.debug('Deposit applied', 'Deposit ' + depositId + ' has been successfully applied to invoice ' + invoiceID);
                                }
                            });
                        } else {
                            log.error('No deposit found', 'No deposit found for customer ' + customerText + ' with reference ' + invoiceID);
                        }
                    }


                    var depositInv = "";
                    // if (downPay > 0) {
                    //     var tranDate = format.parse({
                    //         value: payDate,
                    //         type: format.Type.DATE
                    //     });
                    //     log.debug("lease_deposit",setupData[libUtil.rentalinvoiceType.lease_deposit]["id"]);
                    //     var down_obj = {
                    //         invoicebody: {
                    //             customer: customer,
                    //             date: tranDate,
                    //             subsidiary: subsId,
                    //             location: Location,
                    //             leaseid: headerID,
                    //             invoicetype: setupData[libUtil.rentalinvoiceType.lease_deposit]["id"]
                    //         },
                    //         linesData: [
                    //             {
                    //                 item: setupData[libUtil.rentalinvoiceType.lease_deposit]["downpay"],
                    //                 quantity: 1,
                    //                 rate: downPay,
                    //                 description: "Deposit",
                    //                 amount: downPay,
                    //                 custcol_advs_st_applied_to_vin: vinID
                    //             }
                    //         ]
                    //     };
                    //     depositInv = lib_rental.createInvoice(down_obj, setupData, libUtil);

                    //     createdRecType.push("invoice");
                    //     createdRecId.push(depositInv);
                    // }

                    //CREATE PICKUP PAYMENT INVOICE
                    if((pickuppayment>0) && (setupData[libUtil.rentalinvoiceType.lease_reqular]["pickuppayment"])){
                        var _pickupdate2 = '';
                        var _pickupdate1 = '';
                        if(pickupdate1!=''){
                            _pickupdate1 = format.parse({
                                value: pickupdate1,
                                type: format.Type.DATE
                            });
                        }
                        if(pickupdate2!=''){
                            _pickupdate2 = format.parse({
                                value: pickupdate2,
                                type: format.Type.DATE
                            });
                        }


                        var ppobj = {
                            invoicebody: {
                                customer: customer,
                                date: invoicedDate,
                                pickupd1: _pickupdate1,
                                pickupd2: _pickupdate2,
                                subsidiary: subsId,
                                location: Location,
                                leaseid: headerID,
                                invoicetype: setupData[libUtil.rentalinvoiceType.lease_reqular]["id"]
                            },
                            linesData: [
                                {
                                    item: setupData[libUtil.rentalinvoiceType.lease_reqular]["pickuppayment"],
                                    quantity: 1,
                                    rate: pickuppayment,
                                    description: "Lease pickup payment",
                                    amount: pickuppayment,
                                    custcol_advs_st_applied_to_vin: vinID
                                }
                            ]
                        };
                        log.debug('ppobj',ppobj);
                        _invoiceID = lib_rental.createInvoice(ppobj, setupData, libUtil);
                        log.debug('invoiceID',_invoiceID);
                        createdRecType.push("invoice");
                        createdRecId.push(_invoiceID);
                    }


                    //CREATE PICKUP PAYMENT INVOICE
                    var otherFeeInvoice ="";
                    var otherChargesLines    =    getOtherFeeLine(headerID);
                    log.debug('otherChargesLines',otherChargesLines);
                    if(otherChargesLines.length >0){
                        var otherFeeOnj = {
                            invoicebody: {
                                customer: customer,
                                date: tranDate,
                                subsidiary: subsId,
                                location: Location,
                                leaseid: headerID,
                                invoicetype: setupData[libUtil.rentalinvoiceType.lease_otherfee]["id"]
                            },
                            linesData:otherChargesLines
                        };
                        log.debug('otherFeeOnj' ,otherFeeOnj);
                        otherFeeInvoice = lib_rental.createInvoice(otherFeeOnj, setupData, libUtil);

                        createdRecType.push("invoice");
                        createdRecId.push(otherFeeInvoice);
                    }

                    var getRemainginSche = findRemainingSched(headerID);

                    var remingingSchedule = getRemainginSche.remainingSchedule;
                    var outstanding = getRemainginSche.outstanding;

                    var recmach = "recmachcustrecord_advs_lea_header_link";
                    var headerrec = record.load({type: "customrecord_advs_lease_header", id: headerID, isDynamic: true});
                    var customer = headerrec.getValue("custrecord_advs_r_h_customer_name");
                    var location = headerrec.getValue("custrecord_advs_r_h_location");
                    headerrec.setValue("custrecord_advs_l_h_status", libUtil.leaseStatus.active);
                    headerrec.setValue("custrecord_advs_master_status", 4); //onlease

                    headerrec.setValue("custrecord_advs_l_a_remaing_schedule", remingingSchedule);
                    headerrec.setValue("custrecord_advs_l_a_outstand_sche", outstanding);
                    headerrec.setValue("custrecord_advs_l_h_lst_inv_date", invoicedDate);
                    headerrec.setValue("custrecord_advs_pay_ince", invoiceID);
                    headerrec.setValue("custrecord_advs_pickup_payment_inv", _invoiceID);


                    if (depositAppli) {
                        headerrec.setValue("custrecord_advs_l_a_down_invoie", depositAppli);
                    }

                    if (otherFeeInvoice) {
                        headerrec.setValue("custrecord_advs_l_a_other_fee_invoice", otherFeeInvoice);
                    }

                    //SET INVOICE ID TO FIRST NARRATION OF SCHEDULE PAYMENT START
                    var getLastPaymentLinkId = getPaymentScheduleLastNarration(headerID);
                    log.debug( ' getLastPaymentLinkId.length ' , getLastPaymentLinkId.length)

                    for (var i = 0; i < getLastPaymentLinkId.length; i++) {
                        var jsonData = getLastPaymentLinkId[i];
                        var internalId = jsonData.internalid
                        try {
                            log.debug( ' internalId.length ' , internalId + ' invoiceID ' + invoiceID)

                            var recmach2    =   "recmachcustrecord_advs_lm_lc_c_link";
                            var lineCount = headerrec.getLineCount(recmach2);
                            for (var f = 0; f < lineCount; f++) {
                                var narattion   =   headerrec.getSublistValue({sublistId:"recmachcustrecord_advs_lm_lc_c_link",
                                    fieldId:"custrecord_advs_lm_lc_c_narration",line:f})*1;
                                if(narattion == 1 || narattion == "1.0"){
                                    headerrec.selectLine({sublistId: "recmachcustrecord_advs_lm_lc_c_link", line: f});
                                    headerrec.setCurrentSublistValue({
                                        sublistId: "recmachcustrecord_advs_lm_lc_c_link",
                                        fieldId: "custrecord_advs_r_p_invoice",
                                        value: invoiceID
                                    });
                                    headerrec.commitLine({sublistId: "recmachcustrecord_advs_lm_lc_c_link"});
                                }

                            }
                        } catch (e) {
                            log.error('Error submitting record', e.message);
                        }
                    }
                    //SET INVOICE ID TO FIRST NARRATION OF SCHEDULE PAYMENT END

                    var lineCount = headerrec.getLineCount(recmach);
                    for (var f = 0; f < lineCount; f++) {
                        headerrec.selectLine({sublistId: "recmachcustrecord_advs_lea_header_link", line: f});
                        headerrec.setCurrentSublistValue({
                            sublistId: "recmachcustrecord_advs_lea_header_link",
                            fieldId: "custrecord_advs_lea_stock_status",
                            value: libUtil.leasechildstatus.active
                        });
                        headerrec.commitLine({sublistId: "recmachcustrecord_advs_lea_header_link"});
                    }
                    headerrec.setValue("custrecord_advs_l_h_fixed_ass_link", assetId);
                    headerrec.save({enableSourcing: true});

                }else{
                    log.error("ERROR","error on confirming");
                }


            }catch(e){
                log.error("ERROR",e.message);

                log.error("createdRecType",createdRecType+"=>>"+createdRecId);
                for(var m=0;m<createdRecType.length;m++){
                    var recordTYpe = createdRecType[m];
                    var recId = createdRecId[m];
                    record.delete({type:recordTYpe,id:recId});
                }
            }
// "custrecord_advs_vm_reservation_status":13 ,//lease
            record.submitFields({type:"customrecord_advs_vm",id:vinID,values:{

                    "custrecord_advs_truck_master_status":4 //onlease
                }});

        }

        function getPaymentScheduleLastNarration(headerID){
            var lastPaymentScheduleArray = new Array()
            var customrecord_advs_lm_lease_card_childSearchObj = search.create({
                type: "customrecord_advs_lm_lease_card_child",
                filters:
                    [
                        ["isinactive","is","F"],
                        "AND",
                        ["custrecord_advs_lm_lc_c_link","anyof",headerID],
                        "AND",
                        ["custrecord_advs_lm_lc_c_narration","equalto","1"],
                        "AND",
                        ["custrecord_advs_r_p_invoice","anyof","@NONE@"]
                    ],
                columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal ID"}),
                        search.createColumn({name: "custrecord_advs_lm_lc_c_narration", label: "Narration"}),
                        search.createColumn({name: "custrecord_advs_r_p_end_bal", label: "Ending Balance"}),
                        search.createColumn({name: "custrecord_advs_r_p_sche_pay", label: "Schedule Payment"}),
                        search.createColumn({name: "custrecord_advs_lm_lc_c_link", label: "Lease Link"}),
                    ]
            });
            var searchResultCount = customrecord_advs_lm_lease_card_childSearchObj.runPaged().count;
            log.debug("customrecord_advs_lm_lease_card_childSearchObj result count",searchResultCount);
            // var internalId = 0
            customrecord_advs_lm_lease_card_childSearchObj.run().each(function(result){
                // var internalId =   result.getValue({name: "internalid"});
                var obj = {}
                obj.internalid = result.getValue({name: "internalid"})
                obj.narration = result.getValue({name: "custrecord_advs_lm_lc_c_narration"})
                obj.endbalance = result.getValue({name: "custrecord_advs_r_p_end_bal"})
                obj.schpayment = result.getValue({name: "custrecord_advs_r_p_sche_pay"})
                obj.leaselink = result.getValue({name: "custrecord_advs_lm_lc_c_link"})
                lastPaymentScheduleArray.push(obj)
                return false;
            });

            return lastPaymentScheduleArray
        }

        function findRemainingSched(leaseId){
            var outStanding = 0;var remainSche  =   0;
            var searchRegular = search.create({
                type: "customrecord_advs_lm_lease_card_child",
                filters:
                    [
                        ["custrecord_advs_r_p_invoice","anyof","@NONE@"],
                        "AND",
                        ["custrecord_advs_lm_lc_c_link","anyof",leaseId]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "COUNT",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "custrecord_advs_r_p_sche_pay",
                            summary: "SUM",
                            label: "Scheduled Payment"
                        })
                    ]
            });
            searchRegular.run().each(function(result){
                remainSche =   result.getValue({name: "internalid",summary: "COUNT"});
                outStanding =   result.getValue({name: "custrecord_advs_r_p_sche_pay",summary: "SUM"});
                return true;
            });
            var postData = {};
            postData.remainingSchedule = remainSche;
            postData.outstanding = outStanding;
            return postData;
        }

        function getOtherFeeLine(leaseID){
            var otherLines  =   [];
            var customrecord_advs_lease_other_feeSearchObj = search.create({
                type: "customrecord_advs_lease_other_fee",
                filters:
                    [
                        ["custrecord_advs_l_o_f_lease_link","anyof",leaseID],
                        "AND",
                        ["isinactive","is","F"]
                    ],
                columns:
                    [
                        search.createColumn({name: "custrecord_advs_l_o_f_item", label: "Item #"}),
                        search.createColumn({name: "custrecord_advs_l_o_f_rate", label: "Rate"}),
                        search.createColumn({
                            name: "custrecord_advs_la_vin_bodyfld",
                            join: "CUSTRECORD_ADVS_L_O_F_LEASE_LINK",
                            label: "VIN"
                        })
                    ]
            });
            customrecord_advs_lease_other_feeSearchObj.run().each(function(result){
                var obj  =   {};
                obj.item = result.getValue({name: "custrecord_advs_l_o_f_item"});
                obj.rate = result.getValue({name: "custrecord_advs_l_o_f_rate"});
                obj.custcol_advs_st_applied_to_vin = result.getValue({name: "custrecord_advs_la_vin_bodyfld",join:"CUSTRECORD_ADVS_L_O_F_LEASE_LINK"});
                obj.quantity = 1;
                obj.description = "";
                obj.amount = result.getValue({name: "custrecord_advs_l_o_f_rate"});

                otherLines.push(obj);
                return true;
            });

            return otherLines;
        }
		function updateAssetValue(assetid,vehicleValue)
		{
			try{
				var customrecord_fam_assetvaluesSearchObj = search.create({
					   type: "customrecord_fam_assetvalues",
					   filters:
					   [
						  ["custrecord_slaveparentasset","anyof",assetid]
					   ],
					   columns:
					   [
						  "internalid"
					   ]
					});
					var searchResultCount = customrecord_fam_assetvaluesSearchObj.runPaged().count;
					log.debug("customrecord_fam_assetvaluesSearchObj result count",searchResultCount);
					customrecord_fam_assetvaluesSearchObj.run().each(function(result){
					   // .run().each has a limit of 4,000 results
					   var recid = result.getValue({name:'internalid'});
					  var recobj =  record.load({type:'customrecord_fam_assetvalues',id:recid,isDynamic:!0});
					  recobj.setValue({fieldId:'custrecord_slavepriornbv',value:vehicleValue,ignoreFieldChange:true});
					  recobj.save();
					   return true;
					});
			}catch(e)
			{
				log.debug('error',e.toString());
			}
		}
        return {onRequest}

    });
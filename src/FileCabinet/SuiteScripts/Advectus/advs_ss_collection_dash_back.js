/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search', 'N/url','./advs_lib_dashboard','./advs_lib_util.js'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (record, runtime, search,url,libDash,libUtil) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */

        const onRequest = (scriptContext) => {
            var request      =   scriptContext.request;
            var response    =   scriptContext.response;
            if(request.method == "GET"){
                var type = request.parameters.custparam_type;
                var custID = request.parameters.custparam_custid;
                var leaseID = request.parameters.custparam_leaseid;
                if(type == "1" || type == 1){

                    log.debug("custID",custID)
                   var InvoicesDetail   =    libDash.getInvoicesDetails(custID);

                    var outstandingData  =   libDash.getOutstandingbyCus(custID);
                    var getPaidData    =   libDash.getpaidamountbyCus(custID);
                    var tollData    =   libDash.getTollAmountbyCus(custID);
                    var otherChargeDat    =   libDash.getOtherChargebyCus(custID);
                    var taskdata    =   libDash.fetchTaskDatabyCust(custID);





                   var RegularLease =   libUtil.rentalinvoiceType.lease_reqular;
                    var RegularToll =   libUtil.rentalinvoiceType.lease_toll;

                    var regularCharge    =   0;var tollcharge    =   0;

                    var outStanding =   0;var remainSchedule=0;
                    var paidAmount=0;
                    var otherAmount =   0;
                    var ptpCount=0;var brokenCount=0;


                   if(InvoicesDetail[RegularLease] != null && InvoicesDetail[RegularLease] != undefined){
                        regularCharge    =   InvoicesDetail[RegularLease]["remain"];
                    }
                    if(tollData[custID] != null && tollData[custID] != undefined){
                        tollcharge    =   tollData[custID]["amount"];
                    }
                    if(outstandingData[custID] != null && outstandingData[custID] != undefined){
                        outStanding    =   outstandingData[custID]["amount"];
                    }
                    if(otherChargeDat[custID] != null && otherChargeDat[custID] != undefined){
                        otherAmount    =   otherChargeDat[custID]["amount"];
                    }
                    if(getPaidData[custID] != null && getPaidData[custID] != undefined){
                        paidAmount    =   getPaidData[custID]["amount"];
                    }
                        var ptpId   =   libUtil.tasktype.ptp;
                    var bPromise   =   libUtil.tasktype.brokenpromise;

                    if(taskdata[ptpId] != null && taskdata[ptpId] != undefined){
                        ptpCount    =   taskdata[ptpId]["count"];
                    }
                    if(taskdata[bPromise] != null && taskdata[bPromise] != undefined){
                        brokenCount    =   taskdata[bPromise]["count"];
                    }

                   var obj = {};
                    obj.regularCharge = regularCharge;
                    obj.tollcharge = tollcharge;
                    obj.outstanding = outStanding;
                    obj.otheramount = otherAmount;
                    obj.paidamount = paidAmount;

                    obj.ptpcount = ptpCount;
                    obj.brokencount = brokenCount;

                    var postData    =   [];
                    postData.push(obj);
                    var jsonObj	=	JSON.stringify(postData);
                    response.write(jsonObj);
                }else if(type == "2" || type == 2){
                    var uniqueLeaseArr  =   [];
                    var LeaseDataObj    =   libDash.getLeaseInformation(custID);
                    if(LeaseDataObj.length>0){
                        for(var m=0;m<LeaseDataObj.length;m++){

                            var LeasID  =   LeaseDataObj[m].id;
                            uniqueLeaseArr.push(LeasID);
                        }
                    }

                    var postData    =   [];
                    if(uniqueLeaseArr.length>0){
                       var outstandingData  =   libDash.getOutstandingbyLease(uniqueLeaseArr);
                        var getPaidData    =   libDash.getpaidamountbyLease(uniqueLeaseArr);
                        var tollData    =   libDash.getTollAmountbyLease(uniqueLeaseArr);
                        var otherChargeDat    =   libDash.getOtherChargebyLease(uniqueLeaseArr);



                        if(LeaseDataObj.length>0){
                            for(var m=0;m<LeaseDataObj.length;m++){

                                var LeasID      =   LeaseDataObj[m].id;
                                var LeaseName   =   LeaseDataObj[m].name;
                                var subsiID   =   LeaseDataObj[m].subsidiary;


                                // log.debug("LeasID",LeasID);

                                var outStanding =   0;var remainSchedule=0;
                                var paidAmount=0;var tollAmount=0;
                                var otherAmount =   0;
                                var invcount =   0;var futcount =   0;

                                if(outstandingData[LeasID] != null && outstandingData[LeasID] != undefined){
                                    outStanding = outstandingData[LeasID]["amount"];
                                    remainSchedule  = outstandingData[LeasID]["count"];
                                    invcount  = outstandingData[LeasID]["invcount"];
                                    futcount  = outstandingData[LeasID]["futcount"];
                                }
                                if(getPaidData[LeasID] != null && getPaidData[LeasID] != undefined){
                                    paidAmount = getPaidData[LeasID]["amount"];
                                }
                                if(tollData[LeasID] != null && tollData[LeasID] != undefined){
                                    tollAmount = tollData[LeasID]["amount"];
                                }
                                if(otherChargeDat[LeasID] != null && otherChargeDat[LeasID] != undefined){
                                    otherAmount = otherChargeDat[LeasID]["amount"];
                                }



                                var jsonData    =   {};
                                jsonData.id = LeasID;
                                jsonData.name = LeaseName;
                                jsonData.subsidiary = subsiID;
                                jsonData.outstanding = outStanding;
                                jsonData.remainschedule = remainSchedule;
                                jsonData.amount = paidAmount;
                                jsonData.tollamount = tollAmount;
                                jsonData.otheramount = otherAmount;

                                jsonData.invcount = invcount;
                                jsonData.futcount = futcount;


                                postData.push(jsonData);

                            }
                        }


                    }
                    var jsonObj	=	JSON.stringify(postData);
                    response.write(jsonObj);
                }else if(type == "3" || type == 3){
                    log.debug("leaseID",leaseID);
                    var invoiceData =   libDash.getLeaseInvoiceInfo(leaseID);

                    log.debug("invoiceData",invoiceData);

                    var jsonObj	=	JSON.stringify(invoiceData);
                    response.write(jsonObj);
                }



                // response.write("OK");
            }
        }

        return {onRequest}

    });

var inventoryVmData = [];
var inventoryBucketData = [];
var deliveryFilteredData = [];

function getInternalUrl(url) {
    var internalUrl = url;
    if (!!window.env && window.env == "SANDBOX") {
        console.log(window.env)
        var splittedUrl = url.split('&compid');
        console.log("Splitting URL" + splittedUrl)
        if (splittedUrl.length > 0) {
            internalUrl = splittedUrl[0];
        }

    }
    return internalUrl;
}

function getRequest(url, obj) {
    var result = '';
    jQuery.ajax({
        url: getInternalUrl(url),
        type: "get",
        data: obj,
        async: false,
        success: function (data) {
            result = data;
            ////console.log('result',result);
        },
        error: function (e) {
            // jQuery('#errModal').show();
            // jQuery('#errMsg').html(e);
            alert('Error')
        }
    });

    return result;
}

function openCity(evt, cityName) {
    var i,
        tabcontent,
        tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

jQuery(document).ready(function () {

    var obj = {};
    var url = "https://8760954.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1669&deploy=1&compid=8760954&ns-at=AAEJ7tMQ_VeJzTk5QeghEMsIjWmUjbX6DAigINkCxu0rCpxa_dM";
    var result = getRequest(url, obj);
    var addResults1 = JSON.parse(result);
    var addResults = addResults1[0].vmDataResults;
    var bucketData = addResults1[0].bucketDatat;
    var deliveryData = addResults1[0].deliverydata;
    var inventorySummary = addResults1[0].inventorysummary;
    var vins = [];
    inventoryVmData = addResults;
    inventoryBucketData = bucketData;
    deliveryFilteredData = deliveryData;
    console.log('bucketData', bucketData);
    showFilters(addResults, bucketData, deliveryData);
    inventoryTab(addResults, bucketData, vins);
    DeliveryTab(deliveryData);
    console.log('deliveryData', deliveryData);
    getHtmlContent(decodeURIComponent(inventorySummary));

});

function DeliveryTab(deliveryData) {

    var htmltable = "<table id='delivery' class='table table-striped table-fixed'>";

    htmltable += getDeliveryHeader();

    for (var m = 0; m < deliveryData.length; m++) {

        if (deliveryData[m] != null && deliveryData[m] != undefined) {
            htmltable += getDeliveryTableRow(
                deliveryData[m].deliverysalesrep, //deliverysalesrep,
                deliveryData[m].deliverylocation,
                deliveryData[m].deliveryDate,
                deliveryData[m].deliverycustomer,
                deliveryData[m].serialNumberTruckUnit,
                deliveryData[m]._gpsx2,
                deliveryData[m].deliverytruckready,
                deliveryData[m].deliveryWashed,
                deliveryData[m].depcleardelivery,
                /*'',
                deliveryData[m].deliverymsalesquote,
                deliveryData[m]._dlstate,
                deliveryData[m]._pptax,
                deliveryData[m].titlefee,
                deliveryData[m].deliveryinsurance,
                deliveryData[m]._regstate,
                deliveryData[m]._newlessee,
                deliveryData[m].deliverytotlease,
                deliveryData[m].deliverydeposit,
                deliveryData[m].deliverypupayment,
                deliveryData[m].deliverybalance,
                deliveryData[m].deliverycontract,
                deliveryData[m].deliverymcoo,

                deliveryData[m].deliveryclosedeal,
                deliveryData[m].deliveryVin*/




                // deliveryData[m].deliverynotes,
                // deliveryData[m].deliveryexception,
                // deliveryData[m].deliverydepolink,
                // deliveryData[m].deliverydepotext,
                // deliveryData[m].registrationfee,
                // deliveryData[m].pickupfee
            )
        }
    }
    htmltable += '</tbody>'
    htmltable += '</table>';
    // jQuery('#menu1').html(htmltable);
    jQuery('#datasectiondelivery').html(htmltable);

}

function addAdditionalFilters() {
    var depositInceptionFilter = getDepositInceptionValues();
    var paymentInceptionFilter = getPaymentInceptionValues();
    var totalInceptionFilter = getTotalInceptionValues();
    var termsFilter = getTermsValues();
    var htmltable = '';
    /*  htmltable += '<select id="filtersearchdepositinc" style="padding:4px;margin-right:10px;">';
     htmltable += '<option value="">Deposit Inception</option>';
     for (var kd = 0; kd < depositInceptionFilter.length; kd++) {
         htmltable += '<option value="' + kd + '">' + depositInceptionFilter[kd] + '</option>'
     }
     htmltable += '</select>';
     htmltable += '<select id="filtersearchpaymentinc" style="padding:4px;margin-right:10px;">';
     htmltable += '<option value="">Payment Inception</option>';
     for (var kp = 0; kp < paymentInceptionFilter.length; kp++) {
         htmltable += '<option value="' + kp + '">' + paymentInceptionFilter[kp]+ '</option>'
     }
     htmltable += '</select>';
     htmltable += '<select id="filtersearchtotalinc" style="padding:4px;margin-right:10px;">';
     htmltable += '<option value="">Total Inception</option>';
     for (var kt = 0; kt < totalInceptionFilter.length; kt++) {
         htmltable += '<option value="' + kt + '">' + totalInceptionFilter[kt] + '</option>'
     }
     htmltable += '</select>'; */
    htmltable += '<select id="filtersearchterms" style="padding:4px;margin-right:10px;display:none;">';
    htmltable += '<option value="">Terms</option>';
    for (var kte = 0; kte < termsFilter.length; kte++) {
        htmltable += '<option value="' + kte + '">' + termsFilter[kte] + '</option>'
    }
    htmltable += '</select>';
    $('#filterssearch').append(htmltable);
}

function showFilters(addResults, bucketData, deliveryData) {
    var vinsArr = avaialbleVins(addResults);
    var vinsDelArr = avaialbleDeliveryVins(deliveryData);
    var statusFilter = avaialbleStatus(addResults);
    var locationFilter = avaialbleLocations(addResults);
    var locationDelFilter = avaialbleDeliveryLocations(deliveryData);
    var SalesrepFilter = avaialbleSalesreps(addResults);
    var SalesrepDelFilter = avaialbleDeliverySalesreps(deliveryData);
    var DepositFilter = avaialbleDeposit(bucketData);
    var PaymentFilter = avaialblePayment(bucketData);
    console.log('PaymentFilter', PaymentFilter);
    console.log('DepositFilter', DepositFilter);
    var TotalIncFilter = avaialbleTotalInc(bucketData);
    console.log('TotalIncFilter', TotalIncFilter);

    //MONTHLY FILTERS
    var htmltable = '<div id="filterssearch" style="padding:50px;">'

    htmltable += '<select id="filtersearchvin" class="js-example-basic-single" style="padding:4px;margin-right:10px;">';
    htmltable += '<option value="">Vin Search</option>';
    for (var k = 0; k < vinsArr.length; k++) {
        htmltable += '<option value="' + vinsArr[k].vinid + '">' + vinsArr[k].vinName + '</option>'
    }
    htmltable += '</select>';

    htmltable += '<select id="filtersearchStatus" style="padding:4px;margin-right:10px;margin-left:10px;">';
    htmltable += '<option value="">Status search</option>';
    for (var k = 0; k < statusFilter.length; k++) {
        htmltable += '<option value="' + statusFilter[k].statusid + '">' + statusFilter[k].statusName + '</option>'
    }
    htmltable += '</select>';

    htmltable += '<select id="filtersearchlocation" style="padding:4px;margin-right:10px;">';
    htmltable += '<option value="">Location search</option>';
    for (var k = 0; k < locationFilter.length; k++) {
        htmltable += '<option value="' + locationFilter[k].locationid + '">' + locationFilter[k].locationName + '</option>'
    }
    htmltable += '</select>';

    htmltable += '<select id="filtersearchsalesrep" style="padding:4px;margin-right:10px;">';
    htmltable += '<option value="">Salesrep Search</option>';
    for (var k = 0; k < SalesrepFilter.length; k++) {
        htmltable += '<option value="' + SalesrepFilter[k].salesrepid + '">' + SalesrepFilter[k].salesrepName + '</option>'
    }
    htmltable += '</select>';


    htmltable += '<select id="filtersearchdeposit" style="padding:4px;margin-right:10px;display: none;" >';
    htmltable += '<option value="">Deposit Search</option>';
    for (var k = 0; k < DepositFilter.length; k++) {
        var dat = DepositFilter[k].arr;
        htmltable += '<option value="' + dat.depoid + '" data-bucketid="' + DepositFilter[k].ind + '">' + dat.depoamount + '</option>'
    }
    htmltable += '</select>';

    htmltable += '<select id="filtersearchpayment" style="padding:4px;margin-right:10px;display: none;">';
    htmltable += '<option value="">Payment Search</option>';
    for (var k = 0; k < PaymentFilter.length; k++) {
        var dat = PaymentFilter[k].arr;
        htmltable += '<option value="' + dat.payid + '" data-bucketid="' + PaymentFilter[k].ind + '">' + dat.payamount + '</option>'
    }
    htmltable += '</select>';

    htmltable += '<select id="filtersearchtotalinception" style="padding:4px;margin-right:10px;display: none;">';
    htmltable += '<option value="">Total Inception Search</option>';
    for (var k = 0; k < TotalIncFilter.length; k++) {
        var dat = TotalIncFilter[k].arr;
        htmltable += '<option value="' + dat.ttlid + '" data-bucketid="' + TotalIncFilter[k].ind + '">' + dat.ttlamount + '</option>'
    }
    htmltable += '</select>';

    htmltable += '<select id="frequency" style="padding:4px;display: none;"><option value="Monthly">Monthly</option><option value="Weekly">Weekly</option></select></div>';

    htmltable += '</div>';
    //MONTHLY FILTERS

    //WEEKLY FILTERS
    htmltable += '<div id="filterssearch1" style="padding:50px;display:none;" >'
    htmltable += '<select id="filtersearchvin1" style="padding:4px;margin-right:10px;">';
    htmltable += '<option value="">Vin Search</option>';
    for (var k = 0; k < vinsArr.length; k++) {
        htmltable += '<option value="' + vinsArr[k].vinid + '">' + vinsArr[k].vinName + '</option>'
    }
    htmltable += '</select>';
    htmltable += '<select id="filtersearchStatus1" style="padding:4px;margin-right:10px;">';
    htmltable += '<option value="">Status search</option>';
    for (var k = 0; k < statusFilter.length; k++) {
        htmltable += '<option value="' + statusFilter[k].statusid + '">' + statusFilter[k].statusName + '</option>'
    }
    htmltable += '</select>';

    htmltable += '<select id="filtersearchlocation1" style="padding:4px;margin-right:10px;">';
    htmltable += '<option value="">Location search</option>';
    for (var k = 0; k < locationFilter.length; k++) {
        htmltable += '<option value="' + locationFilter[k].locationid + '">' + locationFilter[k].locationName + '</option>'
    }
    htmltable += '</select>';

    htmltable += '<select id="filtersearchsalesrep1" style="padding:4px;margin-right:10px;">';
    htmltable += '<option value="">Salesrep search</option>';
    for (var k = 0; k < SalesrepFilter.length; k++) {
        htmltable += '<option value="' + SalesrepFilter[k].salesrepid + '">' + SalesrepFilter[k].salesrepName + '</option>'
    }
    htmltable += '</select>';

    htmltable += '<select id="frequency" style="padding:4px;"><option value="Monthly">Monthly</option><option value="Weekly">Weekly</option></select>';


    htmltable += '</div>';

    $('#filterssection').html(htmltable);
    //-------------------------------------------------

    var htmltable1 = '';
    htmltable1 += '<div id="filterssearchdelivery" style="padding:50px;" >'
    htmltable1 += '<select id="filtersearchvindelivery" style="padding:4px;margin-right:10px;">';
    htmltable1 += '<option value="">Vin Search</option>';
    for (var k = 0; k < vinsDelArr.length; k++) {
        htmltable1 += '<option value="' + vinsDelArr[k].vinid + '">' + vinsDelArr[k].vinName + '</option>'
    }
    htmltable1 += '</select>';


    htmltable1 += '<select id="filtersearchlocationdelivery" style="padding:4px;margin-right:10px;">';
    htmltable1 += '<option value="">Location search</option>';
    for (var k = 0; k < locationDelFilter.length; k++) {
        htmltable1 += '<option value="' + locationDelFilter[k].locationid + '">' + locationDelFilter[k].locationName + '</option>'
    }
    htmltable1 += '</select>';

    htmltable1 += '<select id="filtersearchsalesrepdelivery" style="padding:4px;margin-right:10px;">';
    htmltable1 += '<option value="">Salesrep search</option>';
    for (var k = 0; k < SalesrepDelFilter.length; k++) {
        htmltable1 += '<option value="' + SalesrepDelFilter[k].salesrepid + '">' + SalesrepDelFilter[k].salesrepName + '</option>'
    }
    htmltable1 += '</select>';
    htmltable1 += '</div>';
    $('#filterssectiondelivery').html(htmltable1);
}

function inventoryTab(addResults, bucketData, vins) {
    var lineNum = 0;
    //WEEKLY FILTERS
    console.log('addResults', addResults);
    var htmltable = "<table id='inventorymonthly' class='table table-fixed display'>";
    htmltable += gethtmlHeader('Monthly');
    var linenumber = 0;
    for (var m = 0; m < addResults.length; m++) {
        if (addResults[m] != null && addResults[m] != undefined) {
            var vinid = addResults[m].id;
            var vinName = addResults[m].vinName;
            var isdepositCreated = addResults[m].isdepositCreated;
            var model = addResults[m].modelid;
            var brand = addResults[m].brand;
            var locid = addResults[m].locid;
            var locIdval = addResults[m].locIdval;
            var modelyr = addResults[m].modelyr;
            var bucketId = addResults[m].bucketId;
            var bucketIdText = addResults[m].bucketIdText;
            var stockdt = addResults[m].stockdt;
            var Statusdtval = addResults[m].Statusdtval;
            var Statusdt = addResults[m].Statusdt;
            var Mileagedt = addResults[m].Mileagedt;
            var Transdt = addResults[m].Transdt;
            var Enginedt = addResults[m].Enginedt;
            var Customerdt = addResults[m].Customerdt;
            var salesrepdt = addResults[m].salesrepdt;
            var salesrepid = addResults[m].salesrepid;
            var extclrdt = addResults[m].extclrdt;
            var titleRestdt = addResults[m].titleRestdt;
            var DateTruckRdydt = addResults[m].DateTruckRdydt;
            var DateTruckLockupdt = addResults[m].DateTruckLockupdt;
            var DateTruckAgingdt = addResults[m].DateTruckAgingdt;
            var DateOnsitedt = addResults[m].DateOnsitedt;
            var invdepositLink = addResults[m].invdepositLink;
            var InvSales = addResults[m].InvSales;
            var sleepersize = addResults[m].sleepersize;
            var beds = addResults[m].beds;
            var istruckready = addResults[m].istruckready;
            var iswashed = addResults[m].iswashed;
            if (InvSales) {
                salesrepdt = InvSales;
            }


            var singlebunk = addResults[m].singlebunk;

            var Transport = addResults[m].Transport;
            var Inspected = addResults[m].Inspected;
            var Picture1 = addResults[m].Picture1;
            var ApprRepDate = addResults[m].ApprRepDate;
            var admin_notes = addResults[m].admin_notes;
            var body_style = addResults[m].body_style;
            var eta_ready = addResults[m].eta_ready;
            var notesms = addResults[m].notesms;
            var aging_contr = addResults[m].aging_contr;
            var bucketchildsIds = addResults[m].bucketchildsIds;
            var bucketchilds = addResults[m].bucketchilds;
            var incepdiscount = addResults[m].incepdiscount;
            var isOldVehicle = addResults[m].isOldVehicle;
            var isDiscounttoApply = addResults[m].isDiscounttoApply;
            var apu = addResults[m].apu;

            //SOFTHOLD VALUES
            var sh_depo_inception = addResults[m].sh_depo_inception;
            var sh_payment_inc = addResults[m].sh_payment_inc;
            var sh_net_depo_inception = addResults[m].sh_net_depo_inception;
            var sh_net_pay_inception = addResults[m].sh_net_pay_inception;
            var sh_total_inc = addResults[m].sh_total_inc;
            var sh_terms = addResults[m].sh_terms;
            var sh_payterm1 = addResults[m].sh_payterm1;
            var sh_payterm2 = addResults[m].sh_payterm2;
            var sh_payterm3 = addResults[m].sh_payterm3;
            var sh_payterm4 = addResults[m].sh_payterm4;
            var sh_purchase_option = addResults[m].sh_purchase_option;
            var sh_contract_total = addResults[m].sh_contract_total;
            var sh_reg_fee = addResults[m].sh_reg_fee;
            var sh_grandtotal = addResults[m].sh_grandtotal;

            var sh_depo_inception1 = addResults[m].sh_depo_inception1;
            var sh_payment_inc1 = addResults[m].sh_payment_inc1;
            var sh_total_inc1 = addResults[m].sh_total_inc1;
            var sh_terms1 = addResults[m].sh_terms1;
            var sh_payterm1_1 = addResults[m].sh_payterm1_1;
            var sh_payterm2_1 = addResults[m].sh_payterm2_1;
            var sh_payterm3_1 = addResults[m].sh_payterm3_1;
            var sh_payterm4_1 = addResults[m].sh_payterm4_1;
            var sh_purchase_option1 = addResults[m].sh_purchase_option1;
            var sh_contract_total1 = addResults[m].sh_contract_total1;
            var sh_reg_fee1 = addResults[m].sh_reg_fee1;
            var sh_grandtotal_1 = addResults[m].sh_grandtotal_1;
            var sh_bucket1 = addResults[m].sh_bucket1;
            var sh_bucket2 = addResults[m].sh_bucket2;
           // var reservationDate = addResults[m].reservationDate;
            var reservationDate = addResults[m].reservationDate;
            var softHoldstatusdt = addResults[m].softHoldstatusdt;
            var DateTruckRdydt = addResults[m].DateTruckRdydt;
            var DateTruckLockupdt = addResults[m].DateTruckLockupdt;
            var DateTruckAgingdt = addResults[m].DateTruckAgingdt;
            var DateOnsitedt = addResults[m].DateOnsitedt;
            var softHoldCustomerdt = addResults[m].softHoldCustomerdt;
            var softHoldageInDays = addResults[m].softHoldageInDays;
            var _resdate ='';
            if(reservationDate!=''){

                var today = new Date();
                var daysfid = calculateDays(reservationDate,today);
                //log.debug('daysfid',daysfid);
                if(daysfid!=0){
                    _resdate  =   "<span style='color:red;'>"+reservationDate+"</span>"
                }else{
                    _resdate = reservationDate ||'';
                }

            }

            if (bucketchilds && bucketchilds.length > 1) {
                var _bucketchilds = bucketchilds.split(',');
            } else {
                var _bucketchilds = []
            }

            var lengthBuck = 0;
            for (var jk = 0; jk < _bucketchilds.length; jk++) {
                if (bucketData[_bucketchilds[jk]] != null && bucketData[_bucketchilds[jk]] != undefined) {
                    var lengthBuck = bucketData[_bucketchilds[jk]].length;
                }
            }
            var obj = {};
            obj.vinid = vinid;
            obj.vinname = vinName;
            //vins.push(obj);

            //var datagrouped = _.groupBy(bucketData, 'bucketIdText');
            if (true) {
                //var lengthBuck = Object.keys(datagrouped);
                //console.log('datagrouped',datagrouped);
               // console.log('_bucketchilds', _bucketchilds);
                if (_bucketchilds.length) {
                    for (var k = 0; k < _bucketchilds.length; k++) {
                        //   debugger;
                        const foundObject = bucketData.find(objd => objd.id === _bucketchilds[k]);
                        var singlebucket = foundObject; //bucketData[_bucketchilds[k]];
                        console.log('singlebucket', singlebucket);
                        if (singlebucket.bucketIdText == bucketIdText) {
                            // for (var j = 0; j < singlebucket.length; j++) {
                            var bktId = singlebucket["id"];
                            var bktText = singlebucket["bucketIdText"];
                            var DEPINSP = singlebucket["DEPINSP"] * 1;
                            var PAYINSP = singlebucket["PAYINSP"] * 1;
                            var TTLINSP = singlebucket["TTLINSP"] * 1;
                            var TERMS = singlebucket["TRMS"] * 1;
                            var sec_2_13 = singlebucket["twotothirteen"] * 1;
                            var sec_14_26 = singlebucket["forteentotwentysix"] * 1;
                            var sec_26_37 = singlebucket["twosixtothreenseven"] * 1;
                            var sec_38_49 = singlebucket["threeeighttoforunine"] * 1;
                            var purOptn = singlebucket["purOptn"] * 1;
                            var contTot = singlebucket["conttot"] * 1;
                            var freq = singlebucket["freq"];
                            var saleCh = singlebucket["saleCh"];
                            var bucketchildname = singlebucket["bucketchildname"];
                            var regFeeBucket = singlebucket["regFeeBucket"]
                            if (salesrepid != '' && (bktId == sh_bucket1)) {

                                DEPINSP = sh_depo_inception;
                                PAYINSP = sh_payment_inc;
                                DEPINSP = sh_net_depo_inception;
                                PAYINSP = sh_net_pay_inception;
                                TTLINSP = sh_total_inc;
                                TERMS = sh_terms;
                                sec_2_13 = sh_payterm1;
                                sec_14_26 = sh_payterm2;
                                sec_26_37 = sh_payterm3;
                                sec_38_49 = sh_payterm4;
                                purOptn = sh_purchase_option;
                                contTot = sh_contract_total;


                            }
                            if (salesrepid != '' && (bktId == sh_bucket2)) {

                                DEPINSP = sh_depo_inception1;
                                PAYINSP = sh_payment_inc1;
                                TTLINSP = sh_total_inc1;
                                // DEPINSP = sh_net_depo_inception;
                                // PAYINSP = sh_net_pay_inception;
                                TERMS = sh_terms1;
                                sec_2_13 = sh_payterm1_1;
                                sec_14_26 = sh_payterm2_1;
                                sec_26_37 = sh_payterm3_1;
                                sec_38_49 = sh_payterm4_1;
                                purOptn = sh_purchase_option1;
                                contTot = sh_contract_total1;


                            }
                            if (true) {
                                DEPINSP = DEPINSP - incepdiscount;
                                TTLINSP = TTLINSP - incepdiscount;
                                purOptn = purOptn - incepdiscount;
                                contTot = contTot - incepdiscount;
                            }
                            if (freq == 'Monthly') {
                                if(Statusdtval!='')
                                htmltable += getTableRow(softHoldageInDays,softHoldCustomerdt,apu,DateTruckRdydt,DateTruckLockupdt,DateTruckAgingdt,DateOnsitedt,regFeeBucket,singlebunk,isdepositCreated, vinid, stockdt, Statusdtval, Statusdt, modelyr, Mileagedt, extclrdt, sleepersize, beds, titleRestdt, vinName, locid, locIdval, brand, Transdt, Enginedt, Customerdt, salesrepdt, DateTruckRdydt, DateTruckLockupdt, DateTruckAgingdt, DateOnsitedt, bktText, DEPINSP, PAYINSP, TTLINSP, TERMS, sec_2_13, sec_14_26, sec_26_37, sec_38_49, purOptn, contTot, freq, saleCh, model, bucketchildname, linenumber, istruckready, iswashed,_resdate,softHoldstatusdt)
                                linenumber++;
                            }

                            // }
                            //break;
                        }


                    }
                } else {
                    var bktId = '';
                    var bktText = '';
                    var DEPINSP = 0;
                    var PAYINSP = 0;
                    var TTLINSP = 0;
                    var TERMS = 0;
                    var sec_2_13 = 0;
                    var sec_14_26 = 0;
                    var sec_26_37 = 0;
                    var sec_38_49 = 0;
                    var purOptn = 0;
                    var contTot = 0;
                    var freq = '';
                    var saleCh = '';
                    var bucketchildname = '';
                    var regFeeBucket = '';
                    if(Statusdtval!=''){
                    htmltable += getTableRow(softHoldageInDays,softHoldCustomerdt,apu,DateTruckRdydt,DateTruckLockupdt,DateTruckAgingdt,DateOnsitedt,regFeeBucket,singlebunk,isdepositCreated, vinid, stockdt, Statusdtval, Statusdt, modelyr, Mileagedt, extclrdt, sleepersize, beds, titleRestdt, vinName, locid, locIdval, brand, Transdt, Enginedt, Customerdt, salesrepdt, DateTruckRdydt, DateTruckLockupdt, DateTruckAgingdt, DateOnsitedt, bktText, DEPINSP, PAYINSP, TTLINSP, TERMS, sec_2_13, sec_14_26, sec_26_37, sec_38_49, purOptn, contTot, freq, saleCh, model, bucketchildname, linenumber, istruckready, iswashed,_resdate,softHoldstatusdt)
                    }
                    linenumber++;
                }
            }
        }
    }
    htmltable += '</tbody>'
    htmltable += '</table>';
    htmltable += "<table id='inventoryweekly' class='table table-fixed display'>";
    htmltable += gethtmlHeader('Weekly');
    var linenumber = 0;
    for (var m = 0; m < addResults.length; m++) {
        if (addResults[m] != null && addResults[m] != undefined) {

            var vinid = addResults[m].id;
            var vinName = addResults[m].vinName;
            var isdepositCreated = addResults[m].isdepositCreated;
            var model = addResults[m].modelid;
            var brand = addResults[m].brand;
            var locid = addResults[m].locid;
            var locIdval = addResults[m].locIdval;
            var modelyr = addResults[m].modelyr;
            var bucketId = addResults[m].bucketId;
            var bucketIdText = addResults[m].bucketIdText;
            var stockdt = addResults[m].stockdt;
            var Statusdtval = addResults[m].Statusdtval;
            var Statusdt = addResults[m].Statusdt;
            var Mileagedt = addResults[m].Mileagedt;
            var Transdt = addResults[m].Transdt;
            var Enginedt = addResults[m].Enginedt;
            var Customerdt = addResults[m].Customerdt;
            var salesrepdt = addResults[m].salesrepdt;
            var extclrdt = addResults[m].extclrdt;
            var titleRestdt = addResults[m].titleRestdt;
            var DateTruckRdydt = addResults[m].DateTruckRdydt;
            var DateTruckLockupdt = addResults[m].DateTruckLockupdt;
            var DateTruckAgingdt = addResults[m].DateTruckAgingdt;
            var DateOnsitedt = addResults[m].DateOnsitedt;
            var invdepositLink = addResults[m].invdepositLink;
            var InvSales = addResults[m].InvSales;
            var sleepersize = addResults[m].sleepersize;
            var beds = addResults[m].beds;
            var istruckready = addResults[m].istruckready;
            var iswashed = addResults[m].iswashed;
            var reservationDate = addResults[m].reservationDate;
            var softHoldstatusdt = addResults[m].softHoldstatusdt;
            var DateTruckRdydt = addResults[m].DateTruckRdydt;
            var DateTruckLockupdt = addResults[m].DateTruckLockupdt;
            var DateTruckAgingdt = addResults[m].DateTruckAgingdt;
            var DateOnsitedt = addResults[m].DateOnsitedt;
            var _resdate ='';
            if(reservationDate!=''){

                var today = new Date();
                var daysfid = calculateDays(reservationDate,today);
               // log.debug('daysfid',daysfid);
                if(daysfid!=0){
                    _resdate  =   "<span style='color:red;'>"+reservationDate+"</span>"
                }else{
                    _resdate = reservationDate ||'';
                }

            }
            if (InvSales) {
                salesrepdt = InvSales;
            }
            var obj = {};
            obj.vinid = vinid;
            obj.vinname = vinName;
            var singlebunk = addResults[m].singlebunk;
            var Transport = addResults[m].Transport;
            var Inspected = addResults[m].Inspected;
            var Picture1 = addResults[m].Picture1;
            var ApprRepDate = addResults[m].ApprRepDate;
            var admin_notes = addResults[m].admin_notes;
            var body_style = addResults[m].body_style;
            var eta_ready = addResults[m].eta_ready;
            var notesms = addResults[m].notesms;
            var aging_contr = addResults[m].aging_contr;
            var bucketchildsIds = addResults[m].bucketchildsIds;
            var bucketchilds = addResults[m].bucketchilds;
            var incepdiscount = addResults[m].incepdiscount;
            var isOldVehicle = addResults[m].isOldVehicle;
            var isDiscounttoApply = addResults[m].isDiscounttoApply;
            var apu = addResults[m].apu;
            var softHoldCustomerdt = addResults[m].softHoldCustomerdt;
            var softHoldageInDays = addResults[m].softHoldageInDays;

            if (bucketchilds && bucketchilds.length > 1) {
                var _bucketchilds = bucketchilds.split(',');
            } else {
                var _bucketchilds = []
            }

            var lengthBuck = 0;
            for (var jk = 0; jk < _bucketchilds.length; jk++) {
                if (bucketData[_bucketchilds[jk]] != null && bucketData[_bucketchilds[jk]] != undefined) {
                    var lengthBuck = bucketData[_bucketchilds[jk]].length;
                }
            }
            //vins.push(obj);

            var datagrouped = _.groupBy(bucketData, 'bucketIdText');
            if (true) {
                var lengthBuck = Object.keys(datagrouped);
                if (_bucketchilds.length > 0) {

                    for (var k = 0; k < _bucketchilds.length; k++) {
                        // debugger;
                        const foundObject = bucketData.find(objd => objd.id === _bucketchilds[k]);
                        var singlebucket = foundObject; //bucketData[_bucketchilds[k]];
                        console.log('singlebucket', singlebucket);
                        if (singlebucket.bucketIdText == bucketIdText) {
                            // for (var j = 0; j < singlebucket.length; j++) {
                            var bktId = singlebucket["id"];
                            var bktText = singlebucket["bucketIdText"];
                            var DEPINSP = singlebucket["DEPINSP"] * 1;
                            var PAYINSP = singlebucket["PAYINSP"] * 1;
                            var TTLINSP = singlebucket["TTLINSP"] * 1;
                            var TERMS = singlebucket["TRMS"] * 1;
                            var sec_2_13 = singlebucket["twotothirteen"] * 1;
                            var sec_14_26 = singlebucket["forteentotwentysix"] * 1;
                            var sec_26_37 = singlebucket["twosixtothreenseven"] * 1;
                            var sec_38_49 = singlebucket["threeeighttoforunine"] * 1;
                            var purOptn = singlebucket["purOptn"] * 1;
                            var contTot = singlebucket["conttot"] * 1;
                            var freq = singlebucket["freq"];
                            var saleCh = singlebucket["saleCh"];
                            var bucketchildname = singlebucket["bucketchildname"];
                            var regFeeBucket = singlebucket["regFeeBucket"];
                            if (freq == 'Weekly') {
                                if(Statusdtval!=''){
                               // htmltable += getTableRow(softHoldageInDays,softHoldCustomerdt,apu,DateTruckRdydt,DateTruckLockupdt,DateTruckAgingdt,DateOnsitedt,regFeeBucket,singlebunk,isdepositCreated, vinid, stockdt, Statusdtval, Statusdt, modelyr, Mileagedt, extclrdt, sleepersize, beds, titleRestdt, vinName, locid, locIdval, brand, Transdt, Enginedt, Customerdt, salesrepdt, DateTruckRdydt, DateTruckLockupdt, DateTruckAgingdt, DateOnsitedt, bktText, DEPINSP, PAYINSP, TTLINSP, TERMS, sec_2_13, sec_14_26, sec_26_37, sec_38_49, purOptn, contTot, freq, saleCh, model, bucketchildname, linenumber, istruckready, iswashed,_resdate,softHoldstatusdt)
                                }
                                linenumber++;
                            }

                            // }

                        }

                        // break;
                    }
                } else {
                    var bktId = '';
                    var bktText = '';
                    var DEPINSP = 0;
                    var PAYINSP = 0;
                    var TTLINSP = 0;
                    var TERMS = 0;
                    var sec_2_13 = 0;
                    var sec_14_26 = 0;
                    var sec_26_37 = 0;
                    var sec_38_49 = 0;
                    var purOptn = 0;
                    var contTot = 0;
                    var freq = '';
                    var saleCh = '';
                    var bucketchildname = '';
                    var regFeeBucket = '';
                    if(Statusdtval!=''){

                   // htmltable += getTableRow(softHoldageInDays,softHoldCustomerdt,apu,DateTruckRdydt,DateTruckLockupdt,DateTruckAgingdt,DateOnsitedt,regFeeBucket,singlebunk,isdepositCreated, vinid, stockdt, Statusdtval, Statusdt, modelyr, Mileagedt, extclrdt, sleepersize, beds, titleRestdt, vinName, locid, locIdval, brand, Transdt, Enginedt, Customerdt, salesrepdt, DateTruckRdydt, DateTruckLockupdt, DateTruckAgingdt, DateOnsitedt, bktText, DEPINSP, PAYINSP, TTLINSP, TERMS, sec_2_13, sec_14_26, sec_26_37, sec_38_49, purOptn, contTot, freq, saleCh, model, bucketchildname, linenumber, istruckready, iswashed)
                    }
                    linenumber++;
                }
            }
        }
    }
    htmltable += '</tbody>'
    htmltable += '</table>';
    jQuery('#datasection').html(htmltable);
}

function getDeliveryTableRow(
    deliverysalesrep,
    deliverylocation,
    deliveryDate,
    deliverycustomer,
    serialNumberTruckUnit,
    _gpsx2,
    deliverytruckready,
    deliveryWashed,
    depcleardelivery,
    empty,
    deliverymsalesquote,
    _dlstate,
    _pptax,
    titlefee,
    deliveryinsurance,
    _regstate,
    _newlessee,
    deliverytotlease,
    deliverydeposit,
    deliverypupayment,
    deliverybalance,
    deliverycontract,
    deliverymcoo,
    deliveryclosedeal,
    deliveryVin,

    deliverynotes,
    deliveryexception,
    deliverydepolink,
    deliverydepotext,
    registrationfee,
    titlefee11,
    pickupfee




) {
    var deliveryWashed1 = deliveryWashed ? 'Yes' : 'No'
    var deliverymsalesquote1 = deliverymsalesquote ? 'Yes' : 'No'
    var deliverytruckready1 = deliverytruckready ? 'Yes' : 'No'
    var deliveryinsurance1 = deliveryinsurance ? 'Yes' : 'No'
    var depcleardelivery1 = depcleardelivery ? 'Yes' : 'No'
    var _newlessee1 = _newlessee ? 'Yes' : 'No'
    var _deliverytotlease = (deliverytotlease * 1) - (registrationfee * 1) - (titlefee * 1) - (pickupfee * 1);
    var _deliverybalance = (deliverytotlease * 1) - (deliverydeposit * 1);
    var html = "<tr>";
    html += "        <td>" + deliverysalesrep + "</td>";
    html += "        <td>" + deliverylocation + "</td>";
    html += "        <td>" + deliveryDate + "</td>";
    html += "        <td>" + deliverycustomer + "</td>";
    html += "        <td>" + serialNumberTruckUnit + "</td>";
    html += "        <td>" + _gpsx2 + "</td>";
    html += "        <td>" + deliverytruckready1 + "</td>";
    html += "        <td>" + deliveryWashed1 + "</td>";
    html += "        <td>" + depcleardelivery1 + "</td>";
    // html += "        <td></td>";
    /*html += "        <td>" + deliverymsalesquote1 + "</td>";
      html += "        <td>" + _dlstate + "</td>";
      html += "        <td>" + _pptax + "</td>";
      html += "        <td>" + titlefee + "</td>";
      html += "        <td>" + deliveryinsurance1 + "</td>";
      html += "        <td>" + _regstate + "</td>";
      html += "        <td>" + _newlessee1 + "</td>";
      html += "        <td>$" + addCommasnew(_deliverytotlease.toFixed(2)) + "</td>";
      html += "        <td>$" + addCommasnew((deliverydeposit*1).toFixed(2)) + "</td>";   // deliverydeposit
      html += "        <td>$" + addCommasnew((deliverypupayment*1).toFixed(2)) + "</td>"; // deliverypupayment
      html += "        <td>$" + addCommasnew(_deliverybalance.toFixed(2)) + "</td>";  // _deliverybalance
      html += "        <td>" + deliverycontract + "</td>";
      html += "        <td>" + deliverymcoo + "</td>";
      html += "        <td>" + deliveryclosedeal + "</td>";
      html += "        <td>" + deliveryVin + "</td>";

  */
    // html += "          // _deliverytotlease
    /*html += "        <td>$" + addCommasnew((registrationfee*1).toFixed(2)) + "</td>";   // registrationfee
    html += "        <td>$" + addCommasnew((titlefee*1).toFixed(2)) + "</td>";          // titlefee
    html += "        <td>$" + addCommasnew((pickupfee*1).toFixed(2)) + "</td>";         // pickupfee
    html += "        <td>$" + addCommasnew((deliverytotlease*1).toFixed(2)) + "</td>";  // deliverytotlease





    html += "        <td>" + deliverynotes + "</td>";*/
    // html += "        <td>" + deliveryexception + "</td>";
    // html +="        <td>"+deliverydepolink+"</td>";
    // html += "        <td>" + deliverydepotext + "</td>";

    html += "  </tr> ";

    return html;

}

function gethtmlHeader(freq) {
    var html = "<thead id='theadinventorymonthly'>";
    html += "      <tr>";
    html += "        <th>Open</th>";
    html += "        <th>Serial No</th>";
    html += "        <th>Status</th>";
    html += "        <th>Reservation Status</th>";
    html += "        <th>Reservation Date</th>";
    html += "        <th>Color</th>";
    html += "        <th>Year</th>";
    html += "        <th>Make</th>";
    html += "        <th>Model</th>";
    html += "        <th>Engine</th>";
    html += "        <th>Transmission</th>";
    html += "        <th>Mileage</th>";
    html += "        <th>Single Bunk</th>";
    html += "        <th>Total Inception</th>";
    html += "        <th>Deposit Inception</th>";
    html += "        <th>Payment Inception</th>";
    html += "        <th>Registration Fee</th>";
    html += "        <th>Tilte Restriction</th>";
    html += "        <th>Terms</th>";
    html += "        <th>Vin#</th>";
    html += "        <th>Location</th>";
    html += "        <th>Washed</th>";
    html += "        <th>Customer</th>";
    html += "        <th>Salesrep</th>";
    html += "        <th>Date On Site</th>";
    html += "        <th>Date Truck Ready</th>";
    html += "        <th>Date Truck LockedUP</th>";
    html += "        <th>Aging Date Truck Ready</th>";
    html += "        <th>Aging Date on Site</th>";
    html += "        <th>Deposit</th>";
    html += "        <th>Payment</th>";
    html += "        <th>Total Inception</th>";
    html += "        <th>Terms</th>";
    html += "        <th>Payments 2-13</th>";
    html += "        <th>Payments 14-25</th>";
    html += "        <th>Payments 26-37</th>";
    html += "        <th>Payments 38-49</th>";
    html += "        <th>Purchase Option</th>";
    html += "        <th>Contract Total</th>";
    html += "        <th>OnHold Customer</th>";
    html += "        <th>OnHold - Age in Days</th>";
    html += "        <th style='display: none;'>Sleeper Size</th>";
    html += "        <th style='display: none;'>Apu</th>";
    html += "        <th style='display: none;'>Beds</th>";
    html += "        <th >Bucket</th>";
    html += "      </tr>";
    html += "    </thead>";
    if (freq == 'Monthly') {
        html += "    <tbody id='inventorybodyMonthly'>";
    } else {
        html += "    <tbody id='inventorybodyWeekly'>";
    }

    return html;
}
function calculateDays(startDate, Newdate) {
    const start = new Date(startDate);
    var end = new Date(Newdate);
    const differenceInMs = end - start;
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    return differenceInDays;
}
function getTableRow(softHoldageInDays,softHoldCustomerdt,apu,DateTruckRdydt,DateTruckLockupdt,DateTruckAgingdt,DateOnsitedt,regFeeBucket,singlebunk,isdepositCreated, vinid, stock, Statusdtval, status, modelyear, Mileage, color, sleepersize, beds, titleRest, vin, location, locIdval, make, Transmission, engine, customer, salesrep, dtr, dtl, aging, dos, bktText, di, pi, ti, terms, sec_2_13, sec_14_26, sec_26_37, sec_38_49, purOptn, contTot, freq, saleCh, model, bucketchildname, linenumber, istruckready, iswashed,_resdate,softHoldstatusdt) {




    var html = getcolortr(isdepositCreated, vinid, Statusdtval, linenumber, freq, locIdval)
    var obj = colorsForInventory();
    if (freq == 'Monthly' && bktText!='') {
        html += "        <td><a href= '#' class='openaccordian' ><i class='fa fa-angle-down' style='font-size:36px;color:red'></i></a></td>";
    } else if(freq == 'Weekly' && bktText!=''){
        html += "        <td><a href= '#' class='openaccordianweekly' ><i class='fa fa-angle-down' style='font-size:36px;color:red'></i></a></td>";
    }
    else{
        html += " <td></td>";
    }
    istruckready = istruckready ? 'Yes' : '';
    iswashed = iswashed ? 'Yes' : '';
    //html += "        <td><a href= '#' class='openaccordian1' ><i class='fa fa-angle-down' style='font-size:36px;color:red'></i></a></td>";
    html += "        <td>" + stock + "</td>";
    console.log('stock',stock);
    if(status==undefined){status=''}
    if (Statusdtval == 22) {
        if (isdepositCreated == true && Statusdtval != 21) {
            html += "        <td style='background-color:" + obj.BackGroundColDeposit + " ;font-weight:bold !important;'>" + status + "</td>";
        } else {
            html += "        <td style='background-color:" + obj.BackGroundColEnroute + " ;font-weight:bold !important;'>" + status + "</td>";

        }

    }
    else if (Statusdtval == 20) {
        if (isdepositCreated == true && Statusdtval != 21) {
            html += "        <td style='background-color:" + obj.BackGroundColDeposit + " ;font-weight:bold !important;'>" + status + "</td>";
        } else {
            html += "        <td style='background-color:" + obj.BackGroundColInShop + " ;font-weight:bold !important;'>" + status + "</td>";
        }

    } else if (Statusdtval == 23) {
        if (isdepositCreated == true && Statusdtval != 21) {
            html += "        <td style='background-color:" + obj.BackGroundColDeposit + " ;font-weight:bold !important;'>" + status + "</td>";
        } else {
            html += "        <td style='background-color:" + obj.BackGroundColHold + " ;font-weight:bold !important;'>" + status + "</td>";
        }


    } else if (Statusdtval == 21) {

        html += "        <td style='background-color:" + obj.BackGroundColOnSite + " ;font-weight:bold !important;'>" + status + "</td>";

    } else if (Statusdtval == 19) {
        if (isdepositCreated == true && Statusdtval != 21) {
            html += "        <td style='background-color:" + obj.BackGroundColDeposit + " ;font-weight:bold !important;'>" + status + "</td>";
        } else {
            html += "        <td style='background-color:" + obj.BackGroundColReady + " ;font-weight:bold !important;'>" + status + "</td>";
        }


    } else if (Statusdtval == 24) {
        if (isdepositCreated == true && Statusdtval != 21) {
            html += "        <td style='background-color:" + obj.BackGroundColDeposit + " ;font-weight:bold !important;'>" + status + "</td>";
        } else {
            html += "        <td style='background-color:" + obj.BackGroundColSRD + " ;font-weight:bold !important;'>" + status + "</td>";
        }


    } else if (Statusdtval == 15) {
        if (isdepositCreated == true && Statusdtval != 21) {
            html += "        <td style='background-color:" + obj.BackGroundColDeposit + " ;font-weight:bold !important;'>" + status + "</td>";
        } else {
            html += "        <td style='background-color:" + obj.BackGroundColsoftHold + " ;font-weight:bold !important;'>" + status + "</td>";
        }

    }else{
        html += "        <td style='font-weight:bold !important;'>" + status + "</td>";
    }
    //console.log('isdepositCreated', isdepositCreated);

    html += "        <td>" + softHoldstatusdt + "</td>";
    html += "        <td>" + _resdate + "</td>";
    html += "        <td>" + color + "</td>";
    html += "        <td>" + modelyear + "</td>";
    html += "        <td>" + make + "</td>";
    html += "        <td>" + model + "</td>";
    html += "        <td>" + engine + "</td>";
    html += "        <td>" + Transmission + "</td>";
    html += "        <td>" + Mileage + "</td>";
    html += "        <td>" + singlebunk + "</td>";
    if (ti) {
        html += "        <td class='depositinception'>$" + addCommasnew(parseFloat(ti).toFixed(2)) + "</td>"; // di
    } else {
        html += "        <td class='depositinception'>$" + ti + "</td>"; // di
    }

    if (di) {
        html += "        <td class='depositinception'>$" + addCommasnew(parseFloat(di).toFixed(2)) + "</td>"; // di
    } else {
        html += "        <td class='depositinception'>$" + di + "</td>"; // di
    }

    if (pi) {
        html += "        <td class='depositinception'>$" + addCommasnew(parseFloat(pi).toFixed(2)) + "</td>"; // di
    } else {
        html += "        <td class='depositinception'>$" + pi + "</td>"; // di
    }
    html += "        <td>$" + regFeeBucket + "</td>";
    html += "        <td>" + titleRest + "</td>";
    html += "        <td class='terms'>" + terms + "</td>";
    html += "        <td>" + vin + "</td>";
    html += "        <td>" + location + "</td>";
    html += "        <td>" + iswashed + "</td>";
    html += "        <td>" + customer + "</td>";
    html += "        <td>" + salesrep + "</td>";
    html += "        <td>" + dos + "</td>";
    var _DateTruckAgingdt = calculateDays(DateTruckRdydt, new Date()) ||'';
    var _DateOnsiteAgingdt = calculateDays(DateOnsitedt, new Date())||'';
    html += "        <td>" + DateTruckRdydt + "</td>";
    html += "        <td>" + DateTruckLockupdt + "</td>";
    html += "        <td>" + _DateTruckAgingdt + "</td>";
    html += "        <td>" + _DateOnsiteAgingdt + "</td>";


    if (di) {
        html += "        <td class='depositinception'>$" + addCommasnew(parseFloat(di).toFixed(2)) + "</td>"; // di
    } else {
        html += "        <td class='depositinception'>$" + di + "</td>"; // di
    }
    if (pi) {
        html += "        <td class='depositinception'>$" + addCommasnew(parseFloat(pi).toFixed(2)) + "</td>"; // di
    } else {
        html += "        <td class='depositinception'>$" + pi + "</td>"; // di
    }
    if (ti) {
        html += "        <td class='depositinception'>$" + addCommasnew(parseFloat(ti).toFixed(2)) + "</td>"; // di
    } else {
        html += "        <td class='depositinception'>$" + ti + "</td>"; // di
    }

    html += "        <td class='terms'>" + terms + "</td>";
    html += "        <td>$" + addCommasnew(parseFloat(sec_2_13 || 0).toFixed(2)) + "</td>"; // sec_2_13
    html += "        <td>$" + addCommasnew(parseFloat(sec_14_26 || 0).toFixed(2)) + "</td>"; // sec_14_26
    html += "        <td>$" + addCommasnew(parseFloat(sec_26_37 || 0).toFixed(2)) + "</td>"; // sec_26_37
    html += "        <td>$" + addCommasnew(parseFloat(sec_38_49 || 0).toFixed(2)) + "</td>"; // sec_38_49
    html += "        <td>$" + addCommasnew(parseFloat(purOptn).toFixed(2)) + "</td>"; // purOptn
    html += "        <td>$" + addCommasnew(parseFloat(contTot).toFixed(2)) + "</td>"; // contTot
    html += "        <td>"+softHoldCustomerdt+"</td>";
    html += "        <td>"+softHoldageInDays+"</td>";
    html += "        <td style='display: none;'>" + sleepersize + "</td>";
    html += "        <td style='display: none;'>"+apu+"</td>";
    html += "        <td style='display: none;'>" + beds + "</td>";
    html += "        <td>" + bktText + "</td>";
  /*  html += "        <td>" + make + "</td>";
    html += "        <td>" + dtr + "</td>";
    html += "        <td>" + dtl + "</td>";
    html += "        <td>" + istruckready + "</td>";
    html += "        <td>" + freq + "</td>";
    html += "        <td>" + bucketchildname + "</td>";*/
    /* html += "        <td class='paymentinception'>$" + addCommasnew(pi.toFixed(2)) + "</td>";   // pi
    html += "        <td class='totalinception'>$" + addCommasnew(ti.toFixed(2)) + "</td>";   // ti */




    html += "  </tr> ";
    return html;

}

function getDeliveryHeader() {

    var html = "<thead id='theaddeliveryboard'>";
    html += "      <tr>";
    html += "        <th>Salesrep</th>";
    html += "        <th>Location</th>";
    html += "        <th>ETA</th>";
    html += "        <th>Name</th>";
    html += "        <th>Truck Unit#</th>";
    html += "        <th>GPS x2</th>";
    html += "        <th>Truck Ready</th>";
    html += "        <th>Washed</th>";
    html += "        <th>Approved For Delivery</th>";
    // html += "        <th>Cleared for Release</th>";
    /*html += "        <th>Lease Quote</th>";
    html += "        <th>State of Driver's License</th>";
    html += "        <th>Personal Property Tax Amount </th>";
    html += "        <th>Title Fee Amount</th>";
    html += "        <th>Insurance Application Received</th>";
    html += "        <th>Registration State</th>";
    html += "        <th>New Lessee</th>";
    html += "        <th>Total Lease Inception</th>";
    html += "        <th>Deposit</th>";
    html += "        <th>P/U payment</th>";
    html += "        <th>Balance</th>";
    html += "        <th>Contract</th>";
    html += "        <th>Operating Status</th>";
    html += "        <th>Days to close deal</th>";
    html += "        <th>VIN</th>";*/
    // html += "        <th>Lease Inception</th>";
    //  html += "        <th>Pickup Fee</th>";
    //html += "        <th>Notes</th>";
    // html += "        <th>Exceptions</th>";
    // html += "        <th>Deposit</th>";

    html += "      </tr>";
    html += "    </thead>";
    html += "    <tbody id='tbodydeliveryboard'>";

    return html;

}

function colorsForInventory() {
    var obj = {};
    obj.BackGroundColEnroute = '#'; //  '#7070e7' //"#0000FF";
    obj.BackGroundColInShop = '#'; //'#ecb755' //"#FFA500";
    obj.BackGroundColHold = '#'; // '#ea3a3a' //"#FF0000";
    obj.BackGroundColOnSite = '#'; //"grey";
    obj.BackGroundColReady = '#'; // '#9de79d' //"#008000";
    obj.BackGroundColSRD = '#'; // '#8B8000' //"#8B8000";
    obj.BackGroundColsoftHold = '#'; // '#FFFFFF' //"#8B8000";
    obj.BackGroundColDeposit = '#'; // '#FFFF00' //"#8B8000";

    obj.TextCol = "#000000";
    obj.TextColNeedassmnt = "#FFFFFF"
    obj.TextColredem = '#'; //  "#000000"

    return obj;
}

function getcolortr(isdepositCreated, vinid, Statusdtval, linenumber, freq, locIdval) {
    var obj = colorsForInventory();
    var status = Statusdtval;
    var html = "<tr>";
    if (freq == 'Monthly') {
        var id = 'custpage_sublistrow' + linenumber;
    } else {
        var id = 'custpage_sublistrowweekly' + linenumber;
    }

    if (status == 22) {
        html = "<tr data-vinid='" + vinid + "' data-statusid='" + status + "' data-locid='" + locIdval + "' id='" + id + "' >";
        //applycolor(obj.BackGroundColEnroute,obj.TextColNeedassmnt,L,sublist);
    } else if (status == 20) {
        html = "<tr data-vinid='" + vinid + "' data-statusid='" + status + "' data-locid='" + locIdval + "' id='" + id + "' >";
        //applycolor(obj.BackGroundColInShop,obj.TextColNeedassmnt,L,sublist);
    } else if (status == 23) {
        html = "<tr data-vinid='" + vinid + "' data-statusid='" + status + "' data-locid='" + locIdval + "' id='" + id + "' >";
        //applycolor(obj.BackGroundColHold,obj.TextColredem,L,sublist);
    } else if (status == 21) {
        html = "<tr data-vinid='" + vinid + "' data-statusid='" + status + "' data-locid='" + locIdval + "' id='" + id + "' >";
        //applycolor(obj.BackGroundColOnSite,obj.TextColredem,L,sublist);
    } else if (status == 19) {
        html = "<tr data-vinid='" + vinid + "' data-statusid='" + status + "' data-locid='" + locIdval + "' id='" + id + "' >";
        //applycolor(obj.BackGroundColReady,obj.TextColNeedassmnt,L,sublist);
    } else if (status == 24) {
        html = "<tr data-vinid='" + vinid + "' data-statusid='" + status + "' data-locid='" + locIdval + "' id='" + id + "' >";
        //applycolor(obj.BackGroundColSRD,obj.TextColNeedassmnt,L,sublist);
    } else if (status == 15) {
        html = "<tr data-vinid='" + vinid + "'  data-statusid='" + status + "' data-locid='" + locIdval + "' id='" + id + "' >";
        //applycolor(obj.BackGroundColSRD,obj.TextColNeedassmnt,L,sublist);
    }
    else  {
        html = "<tr data-vinid='" + vinid + "'  data-statusid='" + status + "' data-locid='" + locIdval + "' id='" + id + "' >";
        //applycolor(obj.BackGroundColSRD,obj.TextColNeedassmnt,L,sublist);
    }
    // console.log('isdepositCreated', isdepositCreated);

    if (isdepositCreated == true && status != 21) {
        html = "<tr data-vinid='" + vinid + "'  data-statusid='" + status + "' data-locid='" + locIdval + "' id='" + id + "' >";
    }
    return html;
}

function createVinFilter(vins) {
    var idss = vins.map(function ({
                                      vinid
                                  }) {
        return vinid
    });
    var _filtered = vins.filter(function ({
                                              vinid
                                          }, index) {
        return !idss.includes(vinid, index + 1);
    })
    var html = '';
    html += '<select id="vinsearch">';
    for (var vf = 0; vf < _filtered.length; vf++) {
        html += '<option id=' + _filtered[vf].vinid + '>' + _filtered[vf].vinname + '</option>';
    }
    html += '</select>';
    return html;
}

function avaialbleVins(addResults) {
    try {
        var arr = [];
        for (var i = 0; i < addResults.length; i++) {
            var obj = {};
            obj.vinid = addResults[i].id;
            obj.vinName = addResults[i].vinName;
            arr.push(obj)
        }
        return arr;
    } catch (e) {
        console.log(e);
    }
}

function avaialbleDeliveryVins(deliverydata) {
    try {
        var arr = [];
        for (var i = 0; i < deliverydata.length; i++) {
            var obj = {};
            obj.vinid = i;
            obj.vinName = deliverydata[i].deliveryVin;
            arr.push(obj)
        }
        return arr;
    } catch (e) {
        console.log(e);
    }
}

function avaialbleStatus(addResults) {
    try {
        var arr = [];
        for (var i = 0; i < addResults.length; i++) {
            var obj = {};
            obj.statusid = addResults[i].Statusdtval;
            obj.statusName = addResults[i].Statusdt;
            arr.push(obj)
        }
        var _arr = removeDuplicates(arr, 'statusid');
        return _arr;
    } catch (e) {
        console.log(e);
    }
}

function avaialbleLocations(addResults) {
    try {
        var arr = [];
        for (var i = 0; i < addResults.length; i++) {
            var obj = {};
            obj.locationid = addResults[i].locIdval;
            obj.locationName = addResults[i].locid;
            arr.push(obj)
        }
        var _arr = removeDuplicates(arr, 'locationid');
        return _arr;
    } catch (e) {
        console.log(e);
    }
}

function avaialbleDeliveryLocations(deliverydata) {
    try {
        var arr = [];
        for (var i = 0; i < deliverydata.length; i++) {
            var obj = {};
            obj.locationid = deliverydata[i].i;
            obj.locationName = deliverydata[i].deliverylocation;
            arr.push(obj)
        }
        var _arr = removeDuplicates(arr, 'locationName');
        return _arr;
    } catch (e) {
        console.log(e);
    }
}

function avaialbleSalesreps(addResults) {
    try {
        var arr = [];
        for (var i = 0; i < addResults.length; i++) {
            var obj = {};
            if (addResults[i].salesrepdt != '') {
                obj.salesrepid = addResults[i].salesrepid;
                obj.salesrepName = addResults[i].salesrepdt;
                arr.push(obj)
            }

        }
        var _arr = removeDuplicates(arr, 'salesrepid');
        return _arr;
    } catch (e) {
        console.log(e);
    }
}

function avaialbleDeliverySalesreps(deliverydata) {
    try {
        var arr = [];
        for (var i = 0; i < deliverydata.length; i++) {
            var obj = {};
            if (deliverydata[i].deliverysalesrep != '') {
                obj.salesrepid = deliverydata[i].i;
                obj.salesrepName = deliverydata[i].deliverysalesrep;
                arr.push(obj)
            }

        }
        var _arr = removeDuplicates(arr, 'salesrepName');
        return _arr;
    } catch (e) {
        console.log(e);
    }
}

function avaialbleDeposit(bucketData) {
    try {
        var arr = [];
        for (var i = 0; i < (bucketData.length / 2); i++) {
            var obj = {};
            if (bucketData[i].DEPINSP != '') {
                obj.depoamount = bucketData[i].DEPINSP;
                obj.depobucketId = bucketData[i].bucketId;
                obj.depoid = i;
                arr.push(obj)
            }

        }
        var _arr = removeDuplicates1(arr, 'depoamount', 'depobucketId');
        return _arr;
    } catch (e) {
        console.log(e);
    }
}

function avaialblePayment(bucketData) {
    try {
        var arr = [];
        for (var i = 0; i < (bucketData.length / 2); i++) {
            var obj = {};
            if (bucketData[i].PAYINSP != '') {
                obj.payamount = bucketData[i].PAYINSP;
                obj.paybucketId = bucketData[i].bucketId;
                obj.payid = i;
                arr.push(obj)
            }

        }
        var _arr = removeDuplicates1(arr, 'payamount', 'paybucketId');
        return _arr;
    } catch (e) {
        console.log(e);
    }
}

function avaialbleTotalInc(bucketData) {
    try {
        var arr = [];
        for (var i = 0; i < (bucketData.length / 2); i++) {
            var obj = {};
            if (bucketData[i].TTLINSP != '') {
                obj.ttlamount = bucketData[i].TTLINSP;
                obj.ttlbucketId = bucketData[i].bucketId;
                obj.ttlid = i;
                arr.push(obj)
            }

        }
        var _arr = removeDuplicates1(arr, 'ttlamount', 'ttlbucketId');
        return _arr;
    } catch (e) {
        console.log(e);
    }
}

function removeDuplicates(arr, id) {
    let newArray = [];
    let uniqueObject = {};

    for (let i in arr) {
        objTitle = arr[i][id];
        uniqueObject[objTitle] = arr[i];
    }
    console.log('uniqueObject', uniqueObject);
    for (i in uniqueObject) {
        newArray.push(uniqueObject[i]);
    }



    return newArray;
}

function removeDuplicates1(arr, id, bkt) {
    let newArray = [];
    let newArray1 = [];
    let uniqueObject = {};
    let uniqueObject1 = {};
    for (let i in arr) {
        if (bkt) {
            objTitle = arr[i][id] + "," + arr[i][bkt];
        } else {
            objTitle = arr[i][id];
        }

        uniqueObject1[objTitle] = arr[i];
    }
    for (let i in arr) {

        objTitle = arr[i][id];

        uniqueObject[objTitle] = arr[i];
    }
    console.log('uniqueObject', uniqueObject);
    console.log('uniqueObject1', uniqueObject1);
    for (i in uniqueObject1) {
        newArray1.push(i);
    }
    let groups = {};

    // Iterate over the input and group them by their value
    newArray1.forEach(item => {
        let [value, id] = item.split(',');

        // Initialize the group for this value if it doesn't exist
        if (!groups[value]) {
            groups[value] = [];
        }

        // Add the item to the respective group
        groups[value].push(id);
    });

    // Convert the groups object to an array of arrays (where each array contains grouped items)
    let result = Object.values(groups);
    for (var j = 0; j < result.length; j++) {
        for (i in uniqueObject) {
            if (result[j].indexOf(uniqueObject[i][bkt]) != -1) {
                newArray.push({
                    'arr': uniqueObject[i],
                    'ind': result[j]
                });
            }

        }
    }


    return newArray;
}

function getHtmlContent(inventorySummary) {

    jQuery('#menu2').html(inventorySummary);
    // return htmlContent;
}

function inventoryAccordian() {
    try {
        var multiplesArray = generateEvenNumbers(0, 500);; // generates [4, 8, 12, 16, 20]
        var arr = multiplesArray //[0,4,8,12,16,20,24,28,32,36];
        for (var i = 0; i < jQuery("[id^='custpage_sublistrow']").length; i++) {
            var id = 'custpage_sublistrow' + i;
            if (!arr.includes(i)) {
                jQuery('#' + id).hide();
            } else {
                continue;
            }
        }
        for (var i = 0; i < jQuery("[id^='custpage_sublistrowweekly']").length; i++) {
            var id = 'custpage_sublistrowweekly' + i;
            if (!arr.includes(i)) {
                jQuery('#' + id).hide();
            } else {
                continue;
            }
        }
    } catch (e) {
        alert('error' + e.message);
    }
}

function generateMultiplesOfFour(length) {
    const multiples = [];

    for (let i = 1; i <= length; i++) {
        multiples.push(i * 2);
    }

    return multiples;
}

function generateOddNumbers(start, end) {
    var oddNumbers = [];
    for (var i = start; i <= end; i++) {
        if (i % 2 !== 0) {
            oddNumbers.push(i);
        }
    }
    return oddNumbers;
}

function generateEvenNumbers(start, end) {
    const evenNumbers = [];
    for (var i = start; i <= end; i++) {
        if (i % 2 === 0) {
            evenNumbers.push(i);
        }
    }
    return evenNumbers;

}

function addCommasnew(x) {
    // alert(x)
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}
jQuery(document).ready(function () {
    //on load

    inventoryAccordian();
    //on load hide weekly table
    $("#inventoryweekly").hide();

    $("#filtersearchvin").on("change", function () {
        // debugger;
        displayAll();
        displayOnlyLocation();
        displayOnlyVin();
        displayOnlyStatus();
        displayLocationandstatus();
        displayLocationandvin();
        displayStatusandvin();
        displayStatusandvinandlocation();

        displaySalesrepandLocationandVin();
        displaySalesrepandLocationandStatus();
        displaySalesrepandVin();
        displaySalesrepandStatus();
        displaySalesrepandLocation();
        displayOnlySalesrep();

        displayPaymentIncandVin();
        $("#inventoryweekly").hide();
        inventoryAccordian();
    }); //for searching/filtering rows
    $("#filtersearchvin1").on("change", function () {
        displayAllW();
        displayOnlyVinW();
        displayOnlyLocationW();
        displayOnlyStatusW();
        displayLocationandstatusW();
        displayLocationandvinW();
        displayStatusandvinW();
        displayStatusandvinandlocationW();

        displaySalesrepandLocationandVinW();
        displaySalesrepandLocationandStatusW();
        displaySalesrepandVinW();
        displaySalesrepandStatusW();
        displaySalesrepandLocationW();
        displayOnlySalesrepW();

        $("#inventorymonthly").hide();
        inventoryAccordian();
    });
    $("#filtersearchStatus").on("change", function () {
        // debugger;
        var value = $(this).val();
        displayAll();
        displayOnlyLocation();
        displayOnlyVin();
        displayOnlyStatus();
        displayLocationandstatus();
        displayLocationandvin();
        displayStatusandvin();
        displayStatusandvinandlocation();

        displaySalesrepandLocationandVin();
        displaySalesrepandLocationandStatus();
        displaySalesrepandVin();
        displaySalesrepandStatus();
        displaySalesrepandLocation();
        displayOnlySalesrep();

        $("#inventoryweekly").hide();
        inventoryAccordian();

    });
    $("#filtersearchStatus1").on("change", function () {
        displayAllW();
        displayOnlyVinW();
        displayOnlyLocationW();
        displayOnlyStatusW();
        displayLocationandstatusW();
        displayLocationandvinW();
        displayStatusandvinW();
        displayStatusandvinandlocationW();
        displaySalesrepandLocationandVinW();
        displaySalesrepandLocationandStatusW();
        displaySalesrepandVinW();
        displaySalesrepandStatusW();
        displaySalesrepandLocationW();
        displayOnlySalesrepW();

        $("#inventorymonthly").hide();
        inventoryAccordian();
    }); //for searching/filtering rows
    $("#filtersearchlocation").on("change", function () {
        //debugger;
        displayAll();
        displayOnlyLocation();
        displayOnlyVin();
        displayOnlyStatus();

        displayLocationandstatus();
        displayLocationandvin();
        displayStatusandvin();
        displayStatusandvinandlocation();

        displaySalesrepandLocationandVin();
        displaySalesrepandLocationandStatus();
        displaySalesrepandVin();
        displaySalesrepandStatus();
        displaySalesrepandLocation();
        displayOnlySalesrep();

        $("#inventoryweekly").hide();
        inventoryAccordian();
    }); //for searching/filtering rows
    $("#filtersearchlocation1").on("change", function () {
        displayAllW();
        displayOnlyVinW();
        displayOnlyLocationW();
        displayOnlyStatusW();
        displayLocationandstatusW();
        displayLocationandvinW();
        displayStatusandvinW();
        displayStatusandvinandlocationW();

        displaySalesrepandLocationandVinW();
        displaySalesrepandLocationandStatusW();
        displaySalesrepandVinW();
        displaySalesrepandStatusW();
        displaySalesrepandLocationW();
        displayOnlySalesrepW();

        $("#inventorymonthly").hide();
        inventoryAccordian();
    }); //for searching/filtering rows
    $("#filtersearchsalesrep").on("change", function () {
        //debugger;
        displayAll();
        displayOnlyLocation();
        displayOnlyVin();
        displayOnlyStatus();
        displayOnlySalesrep();

        displayLocationandstatus();
        displayLocationandvin();
        displayStatusandvin();
        displayStatusandvinandlocation();

        displaySalesrepandLocationandVin();
        displaySalesrepandLocationandStatus();
        displaySalesrepandVin();
        displaySalesrepandStatus();
        displaySalesrepandLocation();
        displayOnlySalesrep();

        $("#inventoryweekly").hide();
        inventoryAccordian();
    }); //for searching/filtering rows
    $("#filtersearchsalesrep1").on("change", function () {
        displayAllW();
        displayOnlyVinW();
        displayOnlyLocationW();
        displayOnlyStatusW();
        displayLocationandstatusW();
        displayLocationandvinW();
        displayStatusandvinW();
        displayStatusandvinandlocationW();

        displaySalesrepandLocationandVinW();
        displaySalesrepandLocationandStatusW();
        displaySalesrepandVinW();
        displaySalesrepandStatusW();
        displaySalesrepandLocationW();
        displayOnlySalesrepW();

        $("#inventorymonthly").hide();
        inventoryAccordian();
    }); //for searching/filtering rows

    $(document).on("change", "#filtersearchdeposit", function () {
        //  debugger;
        displayAll();
        //hidenotrequired();

        displayOnlyLocation();
        displayOnlyVin();
        displayOnlyStatus();
        displayOnlySalesrep();
        showonlydepoinc();

        displayLocationandstatus();
        displayLocationandvin();
        displayStatusandvin();
        displayStatusandvinandlocation();


        $("#inventoryweekly").hide();
        inventoryAccordian();
    });
    $(document).on("change", "#filtersearchpayment", function () {
        // debugger;
        displayAll();
        //hidenotrequired();
        displayOnlyLocation();
        displayOnlyVin();
        displayOnlyStatus();
        displayOnlySalesrep();
        showonlypaymentinc();

        displayLocationandstatus();
        displayLocationandvin();
        displayStatusandvin();
        displayStatusandvinandlocation();

        displayPaymentIncandVin();

        $("#inventoryweekly").hide();
        inventoryAccordian();
    }); //for searching/filtering rows
    $(document).on("change", "#filtersearchtotalinception", function () {
        // debugger;
        displayAll();

        displayOnlyLocation();
        displayOnlyVin();
        displayOnlyStatus();
        displayOnlySalesrep();
        showonlytotalinc();

        displayLocationandstatus();
        displayLocationandvin();
        displayStatusandvin();
        displayStatusandvinandlocation();

        //displayPaymentIncandVin();

        //hidenotrequired();

        $("#inventoryweekly").hide();
        inventoryAccordian();
    }); //for searching/filtering rows
    $(document).on("change", "#filtersearchterms", function () {
        //debugger;
        displayAll();
        //hidenotrequired();
        showonlyterms();
        $("#inventoryweekly").hide();
        inventoryAccordian();
    }); //for searching/filtering rows
    $("#frequency").on("change", function () {

        var value = $(this).val();
        if (value == 'Monthly') {
            $("#inventorymonthly").show();
            $("#inventorybodyMonthly tr").filter(function () {
                $(this).toggle($(this).text().indexOf(value) > -1)
            });
            $("#inventoryweekly").hide();
            inventoryAccordian();
        } else if (value == 'Weekly') {
            $("#inventoryweekly").show();
            $("#inventorybodyWeekly tr").filter(function () {
                $(this).toggle($(this).text().indexOf(value) > -1)
            });
            $("#inventorymonthly").hide();
            inventoryAccordian();
        }

    }); //for searching/filtering rows
    $(document.body).on('click', '.openaccordian', function (e) {
        //$('.openaccordian').on('click',function (e) {
        //debugger;
        e.preventDefault();
        var myString = jQuery(this).parent('td').parent('tr').attr('id');
        var lastChar = myString.replace('custpage_sublistrow', '');
        for (var i = 0; i < 1; i++) {
            lastChar = ((lastChar * 1) + 1);
            var id = '#custpage_sublistrow' + (lastChar);
            jQuery(id).toggle();
            var id1 = id + ' .openaccordian';
            jQuery(id1).hide()
        }
    });
    $(document.body).on('click', '.openaccordianweekly', function (e) {
        //$('.openaccordianweekly').on('click',function (e) {
        // debugger;
        e.preventDefault();
        var myString = jQuery(this).parent('td').parent('tr').attr('id');

        var lastChar = myString.replace('custpage_sublistrowweekly', '');
        for (var i = 0; i < 1; i++) {
            lastChar = ((lastChar * 1) + 1);
            var id = '#custpage_sublistrowweekly' + (lastChar);
            jQuery(id).toggle();
            var id1 = id + ' .openaccordianweekly';
            jQuery(id1).hide()
        }
    });

    function displayAll() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchvin").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var addfilters = addfiltersvariables();
        jQuery('.hideline').show();
        jQuery('tr').removeClass('.hideline');
        if (statusVal == '' && vinVal == '' && locVal == '' && salesrepVal == '' &&
            addfilters.depositVal == 'Deposit Search' && addfilters.paymentVal == 'Payment Search' && addfilters.totalincVal == 'Total Inception Search' && addfilters.termsVal == 'Terms') { //&& depoincVal==''&& paymnetincVal==''&& totalincVal==''&& termsVal==''
            inventoryTab(inventoryVmData, inventoryBucketData)
        }
    }

    function D_displayAll() {
        var addfilters = adddeliveryfiltersvariables();
        if (addfilters.vinVal == 'Vin Search' && addfilters.locationVal == 'Location search' && addfilters.salesrepVal == 'Salesrep search') { //&& depoincVal==''&& paymnetincVal==''&& totalincVal==''&& termsVal==''
            DeliveryTab(deliveryFilteredData)
        }
    }

    function displayLocationandstatus() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var addfilters = addfiltersvariables();
        if (statusVal != '' && vinVal == '' && locVal != '' && salesrepVal == '' &&
            addfilters.depositVal == 'Deposit Search' && addfilters.paymentVal == 'Payment Search' && addfilters.totalincVal == 'Total Inception Search' && addfilters.termsVal == 'Terms') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.Statusdtval == statusVal && item.locIdval == locVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displayPaymentIncandVin() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var addfilters = addfiltersvariables();
        if (statusVal == '' && vinVal != '' && locVal == '' && salesrepVal == '' &&
            addfilters.depositVal == 'Deposit Search' && addfilters.paymentVal != 'Payment Search' && addfilters.totalincVal == 'Total Inception Search' && addfilters.termsVal == 'Terms') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.id == vinVal;
            });
            var tempbucketData = _.filter(inventoryBucketData, (item) => {
                return item.PAYINSP == addfilters.paymentVal;
            });
            inventoryTab(tempinvData, tempbucketData);

            /* jQuery('#inventorybodyMonthly tr').each(function(){
                if (jQuery( this ).css('display') != 'none'){
                    var text = jQuery(this).find('.paymentinception').text();
                    if(text != addfilters.paymentVal.trim()) {
                        jQuery(this).addClass('hideline');
                       jQuery(this).hide()
                    }
                }
            });  */

        }
    }

    function displayLocationandvin() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var addfilters = addfiltersvariables();
        if (statusVal == '' && vinVal != '' && locVal != '' && salesrepVal == '' &&
            addfilters.depositVal == 'Deposit Search' && addfilters.paymentVal == 'Payment Search' && addfilters.totalincVal == 'Total Inception Search' && addfilters.termsVal == 'Terms') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.id == vinVal && item.locIdval == locVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function D_displayLocationandvin() {
        var addfilters = adddeliveryfiltersvariables();
        if (addfilters.vinVal != 'Vin Search' && addfilters.locationVal != 'Location search' && addfilters.salesrepVal == 'Salesrep search') {
            var tempinvData = _.filter(deliveryFilteredData, (item) => {
                return item.deliveryVin == addfilters.vinVal && item.deliverylocation == addfilters.locationVal;
            });
            DeliveryTab(tempinvData)
        }
    }

    function displayStatusandvin() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var addfilters = addfiltersvariables();
        if (statusVal != '' && vinVal != '' && locVal == '' && salesrepVal == '' &&
            addfilters.depositVal == 'Deposit Search' && addfilters.paymentVal == 'Payment Search' && addfilters.totalincVal == 'Total Inception Search' && addfilters.termsVal == 'Terms') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.id == vinVal && item.Statusdtval == statusVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displayStatusandvinandlocation() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var addfilters = addfiltersvariables();
        if (statusVal != '' && vinVal != '' && locVal != '' && salesrepVal == '' &&
            addfilters.depositVal == 'Deposit Search' && addfilters.paymentVal == 'Payment Search' && addfilters.totalincVal == 'Total Inception Search' && addfilters.termsVal == 'Terms') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.id == vinVal && item.Statusdtval == statusVal && item.locIdval == locVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displayOnlyStatus() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var depositVal = $("#filtersearchdeposit option:selected").text();
        var paymentVal = $("#filtersearchpayment option:selected").text();
        var totalincVal = $("#filtersearchtotalinception option:selected").text();
        var termsVal = $("#filtersearchterms option:selected").text();
        if (statusVal != '' && vinVal == '' && locVal == '' && salesrepVal == '' &&
            depositVal == 'Deposit Search' && paymentVal == 'Payment Search' && totalincVal == 'Total Inception Search' && termsVal == 'Terms') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.Statusdtval == statusVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displayOnlyVin() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var depositVal = $("#filtersearchdeposit option:selected").text();
        var paymentVal = $("#filtersearchpayment option:selected").text();
        var totalincVal = $("#filtersearchtotalinception option:selected").text();
        var termsVal = $("#filtersearchterms option:selected").text();

        if (statusVal == '' && vinVal != '' && locVal == '' && salesrepVal == '' &&
            depositVal == 'Deposit Search' && paymentVal == 'Payment Search' && totalincVal == 'Total Inception Search' && termsVal == 'Terms') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.id == vinVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function D_displayOnlyVin() {
        var addfilters = adddeliveryfiltersvariables();
        if (addfilters.vinVal != 'Vin Search' && addfilters.locationVal == 'Location search' && addfilters.salesrepVal == 'Salesrep search') {
            var tempinvData = _.filter(deliveryFilteredData, (item) => {
                return item.deliveryVin == addfilters.vinVal;
            });
            DeliveryTab(tempinvData)
        }
    }

    function displayOnlyLocation() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var depositVal = $("#filtersearchdeposit option:selected").text();
        var paymentVal = $("#filtersearchpayment option:selected").text();
        var totalincVal = $("#filtersearchtotalinception option:selected").text();
        var termsVal = $("#filtersearchterms option:selected").text();
        if (statusVal == '' && vinVal == '' && locVal != '' && salesrepVal == '' &&
            depositVal == 'Deposit Search' && paymentVal == 'Payment Search' && totalincVal == 'Total Inception Search' && termsVal == 'Terms') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.locIdval == locVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function D_displayOnlyLocation() {
        var addfilters = adddeliveryfiltersvariables();
        if (addfilters.vinVal == 'Vin Search' && addfilters.locationVal != 'Location search' && addfilters.salesrepVal == 'Salesrep search') {
            var tempinvData = _.filter(deliveryFilteredData, (item) => {
                return item.deliverylocation == addfilters.locationVal;
            });
            DeliveryTab(tempinvData)
        }

    }

    function displayAllW() {
        var vinVal = $("#filtersearchvin1").val();
        var locVal = $("#filtersearchlocation1").val();
        var statusVal = $("#filtersearchvin1").val();
        var salesrepVal = $("#filtersearchsalesrep1").val();
        if (statusVal == '' && vinVal == '' && locVal == '' && salesrepVal == '') {
            inventoryTab(inventoryVmData, inventoryBucketData)
        }
    }

    function displayStatusandvinandlocationW() {
        var vinVal = $("#filtersearchvin1").val();
        var locVal = $("#filtersearchlocation1").val();
        var statusVal = $("#filtersearchStatus1").val();
        var salesrepVal = $("#filtersearchsalesrep1").val();
        if (statusVal != '' && vinVal != '' && locVal != '' && salesrepVal == '') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.id == vinVal && item.Statusdtval == statusVal && item.locIdval == locVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displayLocationandstatusW() {
        var vinVal = $("#filtersearchvin1").val();
        var locVal = $("#filtersearchlocation1").val();
        var statusVal = $("#filtersearchStatus1").val();
        var salesrepVal = $("#filtersearchsalesrep1").val();

        if (statusVal != '' && vinVal == '' && locVal != '' && salesrepVal == '') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.Statusdtval == statusVal && item.locIdval == locVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displayLocationandvinW() {
        var vinVal = $("#filtersearchvin1").val();
        var locVal = $("#filtersearchlocation1").val();
        var statusVal = $("#filtersearchStatus1").val();
        var salesrepVal = $("#filtersearchsalesrep1").val();

        if (statusVal == '' && vinVal != '' && locVal != '' && salesrepVal == '') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.id == vinVal && item.locIdval == locVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displayStatusandvinW() {
        var vinVal = $("#filtersearchvin1").val();
        var locVal = $("#filtersearchlocation1").val();
        var statusVal = $("#filtersearchStatus1").val();
        var salesrepVal = $("#filtersearchsalesrep1").val();
        if (statusVal != '' && vinVal != '' && locVal == '' && salesrepVal == '') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.id == vinVal && item.Statusdtval == statusVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displayOnlyStatusW() {
        var vinVal = $("#filtersearchvin1").val();
        var locVal = $("#filtersearchlocation1").val();
        var statusVal = $("#filtersearchStatus1").val();
        var salesrepVal = $("#filtersearchsalesrep1").val();
        if (statusVal != '' && vinVal == '' && locVal == '' && salesrepVal == '') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.Statusdtval == statusVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displayOnlyVinW() {
        var vinVal = $("#filtersearchvin1").val();
        var locVal = $("#filtersearchlocation1").val();
        var statusVal = $("#filtersearchStatus1").val();
        var salesrepVal = $("#filtersearchsalesrep1").val();
        if (statusVal == '' && vinVal != '' && locVal == '' && salesrepVal == '') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.id == vinVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displayOnlyLocationW() {
        var vinVal = $("#filtersearchvin1").val();
        var locVal = $("#filtersearchlocation1").val();
        var statusVal = $("#filtersearchStatus1").val();
        var salesrepVal = $("#filtersearchsalesrep1").val();
        if (statusVal == '' && vinVal == '' && locVal != '' && salesrepVal == '') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.locIdval == locVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displayOnlySalesrep() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var addfilters = addfiltersvariables();
        if (salesrepVal != '' && statusVal == '' && vinVal == '' && locVal == '' &&
            addfilters.depositVal == 'Deposit Search' && addfilters.paymentVal == 'Payment Search' && addfilters.totalincVal == 'Total Inception Search' && addfilters.termsVal == 'Terms') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.salesrepid == salesrepVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function D_displayOnlySalesrep() {
        var addfilters = adddeliveryfiltersvariables();
        if (addfilters.vinVal == 'Vin Search' && addfilters.locationVal == 'Location search' && addfilters.salesrepVal != 'Salesrep search') {
            var tempinvData = _.filter(deliveryFilteredData, (item) => {
                return item.deliverysalesrep == addfilters.salesrepVal;
            });
            DeliveryTab(tempinvData)
        }

    }

    function displaySalesrepandLocation() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var addfilters = addfiltersvariables();
        if (salesrepVal != '' && statusVal == '' && vinVal == '' && locVal != '' &&
            addfilters.depositVal == 'Deposit Search' && addfilters.paymentVal == 'Payment Search' && addfilters.totalincVal == 'Total Inception Search' && addfilters.termsVal == 'Terms') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.salesrepid == salesrepVal && item.locIdval == locVal;;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function D_displaySalesrepandLocation() {

        var addfilters = adddeliveryfiltersvariables();
        if (addfilters.vinVal == 'Vin Search' && addfilters.locationVal != 'Location search' && addfilters.salesrepVal != 'Salesrep search') {
            var tempinvData = _.filter(deliveryFilteredData, (item) => {
                return item.salesrepid == salesrepVal && item.deliverylocation == addfilters.locationVal;
            });
            DeliveryTab(tempinvData)
        }
    }

    function displaySalesrepandStatus() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var addfilters = addfiltersvariables();
        if (salesrepVal != '' && statusVal != '' && vinVal == '' && locVal == '' &&
            addfilters.depositVal == 'Deposit Search' && addfilters.paymentVal == 'Payment Search' && addfilters.totalincVal == 'Total Inception Search' && addfilters.termsVal == 'Terms') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.salesrepid == salesrepVal && item.Statusdtval == statusVal;;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displaySalesrepandVin() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var addfilters = addfiltersvariables();
        if (salesrepVal != '' && statusVal == '' && vinVal != '' && locVal == '' &&
            addfilters.depositVal == 'Deposit Search' && addfilters.paymentVal == 'Payment Search' && addfilters.totalincVal == 'Total Inception Search' && addfilters.termsVal == 'Terms') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.salesrepid == salesrepVal && item.id == vinVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function D_displaySalesrepandVin() {

        var addfilters = adddeliveryfiltersvariables();
        if (addfilters.vinVal != 'Vin Search' && addfilters.locationVal == 'Location search' && addfilters.salesrepVal != 'Salesrep search') {
            var tempinvData = _.filter(deliveryFilteredData, (item) => {
                return item.deliveryVin == addfilters.vinVal && item.deliverysalesrep == addfilters.salesrepVal;
            });
            DeliveryTab(tempinvData)
        }
    }

    function displaySalesrepandLocationandStatus() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var addfilters = addfiltersvariables();
        if (salesrepVal != '' && statusVal != '' && vinVal == '' && locVal != '' &&
            addfilters.depositVal == 'Deposit Search' && addfilters.paymentVal == 'Payment Search' && addfilters.totalincVal == 'Total Inception Search' && addfilters.termsVal == 'Terms') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.salesrepid == salesrepVal && item.Statusdtval == statusVal && item.locIdval == locVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displaySalesrepandLocationandVin() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var addfilters = addfiltersvariables();
        if (salesrepVal != '' && statusVal == '' && vinVal != '' && locVal != '' &&
            addfilters.depositVal == 'Deposit Search' && addfilters.paymentVal == 'Payment Search' && addfilters.totalincVal == 'Total Inception Search' && addfilters.termsVal == 'Terms') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.salesrepid == salesrepVal && item.id == vinVal && item.locIdval == locVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function D_displaySalesrepandLocationandVin() {
        var addfilters = adddeliveryfiltersvariables();
        if (addfilters.vinVal != 'Vin Search' && addfilters.locationVal != 'Location search' && addfilters.salesrepVal != 'Salesrep search') {
            var tempinvData = _.filter(deliveryFilteredData, (item) => {
                return item.deliveryVin == addfilters.vinVal && item.deliverysalesrep == addfilters.salesrepVal && item.deliverylocation == addfilters.locationVal;
            });
            DeliveryTab(tempinvData)
        }
    }

    function displayOnlySalesrepW() {
        var vinVal = $("#filtersearchvin1").val();
        var locVal = $("#filtersearchlocation1").val();
        var statusVal = $("#filtersearchStatus1").val();
        var salesrepVal = $("#filtersearchsalesrep1").val();
        if (salesrepVal != '' && statusVal == '' && vinVal == '' && locVal == '') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.salesrepid == salesrepVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displaySalesrepandLocationW() {
        var vinVal = $("#filtersearchvin1").val();
        var locVal = $("#filtersearchlocation1").val();
        var statusVal = $("#filtersearchStatus1").val();
        var salesrepVal = $("#filtersearchsalesrep1").val();
        if (salesrepVal != '' && statusVal == '' && vinVal == '' && locVal != '') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.salesrepid == salesrepVal && item.locIdval == locVal;;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displaySalesrepandStatusW() {
        var vinVal = $("#filtersearchvin1").val();
        var locVal = $("#filtersearchlocation1").val();
        var statusVal = $("#filtersearchStatus1").val();
        var salesrepVal = $("#filtersearchsalesrep1").val();
        if (salesrepVal != '' && statusVal != '' && vinVal == '' && locVal == '') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.salesrepid == salesrepVal && item.Statusdtval == statusVal;;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displaySalesrepandVinW() {
        var vinVal = $("#filtersearchvin1").val();
        var locVal = $("#filtersearchlocation1").val();
        var statusVal = $("#filtersearchStatus1").val();
        var salesrepVal = $("#filtersearchsalesrep1").val();
        if (salesrepVal != '' && statusVal == '' && vinVal != '' && locVal == '') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.salesrepid == salesrepVal && item.id == vinVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displaySalesrepandLocationandStatusW() {
        var vinVal = $("#filtersearchvin1").val();
        var locVal = $("#filtersearchlocation1").val();
        var statusVal = $("#filtersearchStatus1").val();
        var salesrepVal = $("#filtersearchsalesrep1").val();
        if (salesrepVal != '' && statusVal != '' && vinVal == '' && locVal != '') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.salesrepid == salesrepVal && item.Statusdtval == statusVal && item.locIdval == locVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function displaySalesrepandLocationandVinW() {
        var vinVal = $("#filtersearchvin1").val();
        var locVal = $("#filtersearchlocation1").val();
        var statusVal = $("#filtersearchStatus1").val();
        var salesrepVal = $("#filtersearchsalesrep1").val();
        if (salesrepVal != '' && statusVal == '' && vinVal != '' && locVal != '') {
            var tempinvData = _.filter(inventoryVmData, (item) => {
                return item.salesrepid == salesrepVal && item.id == vinVal && item.locIdval == locVal;
            });
            inventoryTab(tempinvData, inventoryBucketData)
        }
    }

    function filterFunction() {
        const input = document.getElementById("myInput");
        const filter = input.value.toUpperCase();
        const div = document.getElementById("myDropdown");
        const a = div.getElementsByTagName("a");
        for (let i = 0; i < a.length; i++) {
            txtValue = a[i].textContent || a[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    }

    function hidenotrequired() {

    }
    $("#filtersearchvindelivery").on("change", function () {
        // debugger;
        D_displayAll();
        D_displayOnlyVin();
        D_displayLocationandvin();
        D_displaySalesrepandVin();
        D_displaySalesrepandLocationandVin();
        /*
        D_displaySalesrepandLocation();
        D_displayOnlySalesrep();  */
    }); //for searching/filtering rows
    $("#filtersearchlocationdelivery").on("change", function () {
        //  debugger;
        D_displayAll();
        D_displayOnlyLocation();
        D_displayLocationandvin();
        D_displaySalesrepandLocation()
        D_displaySalesrepandLocationandVin();
        /*

        D_displaySalesrepandLocationandVin();
        D_displaySalesrepandVin();
        D_displaySalesrepandLocation();
        D_displayOnlySalesrep();  */
    });
    $("#filtersearchsalesrepdelivery").on("change", function () {
        // debugger;
        D_displayAll();
        D_displayOnlySalesrep();
        D_displaySalesrepandVin();
        D_displaySalesrepandLocation();
        D_displaySalesrepandLocationandVin();
        /*
         D_displaySalesrepandLocationandVin();
         D_displaySalesrepandVin();
         D_displaySalesrepandLocation();
         D_displayOnlySalesrep();  */
    });

    function showonlydepoinc() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var depoincVal = $("#filtersearchdeposit option:selected").text();
        var depositincattr = $("#filtersearchdeposit option:selected").attr('data-bucketid');
        var paymentVal = $("#filtersearchpayment option:selected").text();
        var totalincVal = $("#filtersearchtotalinception option:selected").text();
        var termsVal = $("#filtersearchterms option:selected").text();
        if (salesrepVal == '' && statusVal == '' && vinVal == '' && locVal == '' && depoincVal != 'Deposit Search' &&
            paymentVal == 'Payment Search' && totalincVal == 'Total Inception Search' && termsVal == 'Terms'
        ) {
            /*  jQuery('#inventorybodyMonthly tr').each(function(){
                 if (jQuery( this ).css('display') != 'none'){
                     var text = jQuery(this).find('.depositinception').text();
                     if(text != depoincVal.trim()) {
                        jQuery(this).hide()
                     }
                 }
             });  */
            var tempinvData = _.filter(inventoryVmData, (item) => {
                var _depositincattr = depositincattr.split(',');
                var flag = false;
                for (var j = 0; j < _depositincattr.length; j++) {
                    if (item.bucketId == _depositincattr[j]) {
                        flag = true
                    }
                }
                return flag; //item.bucketId == paymentincattr ;
            });
            console.log('tempinvData', tempinvData);
            var tempbucketData = _.filter(inventoryBucketData, (item) => {
                var _depositincattr = depositincattr.split(',');
                var flag = false;
                for (var j = 0; j < _depositincattr.length; j++) {

                    if (item.DEPINSP == depoincVal || item.bucketId == _depositincattr[j]) {
                        flag = true
                    }
                }
                return flag; //item.bucketId == paymentincattr ;
                // return item.PAYINSP ==  paymentincVal ||  item.bucketId ==  paymentincattr;
            });
            inventoryTab(tempinvData, tempbucketData);

        }
    }

    function showonlypaymentinc() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var depoincVal = $("#filtersearchdeposit option:selected").text();
        var paymentincVal = $("#filtersearchpayment option:selected").text();
        var paymentincattr = $("#filtersearchpayment option:selected").attr('data-bucketid');
        var totalincVal = $("#filtersearchtotalinception option:selected").text();
        var termsVal = $("#filtersearchterms option:selected").text();
        if (salesrepVal == '' && statusVal == '' && vinVal == '' && locVal == '' && depoincVal == 'Deposit Search' && paymentincVal != 'Payment Search' &&
            totalincVal == 'Total Inception Search' && termsVal == 'Terms') {
            /*  jQuery('#inventorybodyMonthly tr').each(function(){
                 if (jQuery( this ).css('display') != 'none'){
                     var text = jQuery(this).find('.paymentinception').text();
                     if(text != paymentincVal.trim()) {
                         jQuery(this).addClass('hideline');
                        jQuery(this).hide()
                     }
                 }
             });  */
            var tempinvData = _.filter(inventoryVmData, (item) => {
                var _paymentincattr = paymentincattr.split(',');
                var flag = false;
                for (var j = 0; j < _paymentincattr.length; j++) {
                    if (item.bucketId == _paymentincattr[j]) {
                        flag = true
                    }
                }
                return flag; //item.bucketId == paymentincattr ;
            });
            console.log('tempinvData', tempinvData);
            var tempbucketData = _.filter(inventoryBucketData, (item) => {
                var _paymentincattr = paymentincattr.split(',');
                var flag = false;
                for (var j = 0; j < _paymentincattr.length; j++) {

                    if (item.PAYINSP == paymentincVal || item.bucketId == _paymentincattr[j]) {
                        flag = true
                    }
                }
                return flag; //item.bucketId == paymentincattr ;
                // return item.PAYINSP ==  paymentincVal ||  item.bucketId ==  paymentincattr;
            });
            inventoryTab(tempinvData, tempbucketData);
        }
    }

    function showonlytotalinc() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var depoincVal = $("#filtersearchdeposit option:selected").text();
        var paymentincVal = $("#filtersearchpayment option:selected").text();
        var totalincVal = $("#filtersearchtotalinception option:selected").text();
        var totalincattr = $("#filtersearchtotalinception option:selected").attr('data-bucketid');
        var termsVal = $("#filtersearchterms option:selected").text();
        if (salesrepVal == '' && statusVal == '' && vinVal == '' && locVal == '' && depoincVal == 'Deposit Search' && paymentincVal == 'Payment Search' && totalincVal != 'Total Inception Search' && termsVal == 'Terms') {
            /* jQuery('#inventorybodyMonthly tr').each(function(){
                      if (jQuery( this ).css('display') != 'none'){
                          var text = jQuery(this).find('.totalinception').text();
                          if(text != totalincVal.trim()) {
                             jQuery(this).hide()
                          }
                      }
                  });  */
            var tempinvData = _.filter(inventoryVmData, (item) => {
                var _totalincattr = totalincattr.split(',');
                var flag = false;
                for (var j = 0; j < _totalincattr.length; j++) {
                    if (item.bucketId == _totalincattr[j]) {
                        flag = true
                    }
                }
                return flag; //item.bucketId == paymentincattr ;
            });
            console.log('tempinvData', tempinvData);
            var tempbucketData = _.filter(inventoryBucketData, (item) => {
                var _totalincattr = totalincattr.split(',');
                var flag = false;
                for (var j = 0; j < _totalincattr.length; j++) {

                    if (item.TTLINSP == totalincattr || item.bucketId == _totalincattr[j]) {
                        flag = true
                    }
                }
                return flag; //item.bucketId == paymentincattr ;
                // return item.PAYINSP ==  paymentincVal ||  item.bucketId ==  paymentincattr;
            });
            inventoryTab(tempinvData, tempbucketData);
        }
    }

    function showonlyterms() {
        var vinVal = $("#filtersearchvin").val();
        var locVal = $("#filtersearchlocation").val();
        var statusVal = $("#filtersearchStatus").val();
        var salesrepVal = $("#filtersearchsalesrep").val();
        var depoincVal = $("#filtersearchdepositinc option:selected").text();
        var paymentincVal = $("#filtersearchpaymentinc option:selected").text();
        var totalincVal = $("#filtersearchtotalinc option:selected").text();
        var termsVal = $("#filtersearchterms option:selected").text();
        if (salesrepVal == '' && statusVal == '' && vinVal == '' && locVal == '' && depoincVal == 'Deposit Inception' && paymentincVal == 'Payment Inception' && totalincVal == 'Total Inception' && termsVal != 'Terms') {
            jQuery('#inventorybodyMonthly tr').each(function () {
                if (jQuery(this).css('display') != 'none') {
                    var text = jQuery(this).find('.terms').text();
                    if (text != termsVal.trim()) {
                        jQuery(this).hide()
                    }
                }
            });
        }
    }

    function addfiltersvariables() {

        var depositVal = $("#filtersearchdeposit option:selected").text();
        var paymentVal = $("#filtersearchpayment option:selected").text();
        var totalincVal = $("#filtersearchtotalinception option:selected").text();
        var termsVal = $("#filtersearchterms option:selected").text();

        var obj = {};
        obj.depositVal = depositVal;
        obj.paymentVal = paymentVal;
        obj.totalincVal = totalincVal;
        obj.termsVal = termsVal;

        return obj;

    }

    function adddeliveryfiltersvariables() {

        var vinVal = $("#filtersearchvindelivery option:selected").text();
        var salesrepVal = $("#filtersearchsalesrepdelivery option:selected").text();
        var locationVal = $("#filtersearchlocationdelivery option:selected").text();

        var obj = {};
        obj.vinVal = vinVal;
        obj.salesrepVal = salesrepVal;
        obj.locationVal = locationVal;

        return obj;

    }
    addAdditionalFilters();

});
$(document).ready(function () {
    $('.js-example-basic-single').select2();
    // do the work...
    /* document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
        var table = th.closest('table');
        Array.from(table.querySelectorAll('tr:nth-child(n+1)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => table.appendChild(tr) );
    }))); */

    /* document.querySelectorAll('th').forEach(function(th) {
        th.addEventListener('click', function() {
            // var table = th.closest('table');
            var table = jQuery('#inventorybodyMonthly');
            var index = Array.from(th.parentNode.children).indexOf(th);
            th.asc = !th.asc;

            var datatosort = Array.from(jQuery('#inventorybodyMonthly tr'))
                .sort(function(rowA, rowB) {
                    var cellA = rowA.cells[index].innerText;
                    var cellB = rowB.cells[index].innerText;
                    return th.asc ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
                });
            jQuery('#inventorybodyMonthly').html('');
            datatosort  .forEach(function(tr) {
                table.append(tr);
            });
        });
    }); */
    document.querySelectorAll('#theadinventorymonthly th').forEach(function (th) {
        th.addEventListener('click', function () {
            // Find the table and the index of the column
            var tableBody = document.querySelector('#inventorybodyMonthly');
            var index = Array.from(th.parentNode.children).indexOf(th);
            var isAscending = th.classList.toggle('asc'); // Toggle ascending class

            // Get rows as an array
            var rows = Array.from(tableBody.querySelectorAll('tr'));

            // Sort rows based on the selected column
            rows.sort(function (rowA, rowB) {
                var cellA = rowA.cells[index].innerText.trim();
                var cellB = rowB.cells[index].innerText.trim();

                // Compare based on ascending or descending
                return isAscending ?
                    cellA.localeCompare(cellB) :
                    cellB.localeCompare(cellA);
            });

            // Clear the table body and re-append sorted rows
            tableBody.innerHTML = '';
            rows.forEach(function (row) {
                tableBody.appendChild(row);
            });

            // Update header classes for indicating sort order
            document.querySelectorAll('th').forEach(function (header) {
                header.classList.remove('asc', 'desc'); // Reset classes
            });
            th.classList.add(isAscending ? 'asc' : 'desc'); // Add appropriate class
        });
    });

    /* document.querySelectorAll('th').forEach(function(th) {
        th.addEventListener('click', function() {
            // var table = th.closest('table');
            var table = jQuery('#tbodydeliveryboard');
            var index = Array.from(th.parentNode.children).indexOf(th);
            th.asc = !th.asc;

            var datatosort = Array.from(jQuery('#tbodydeliveryboard tr'))
                .sort(function(rowA, rowB) {
                    var cellA = rowA.cells[index].innerText;
                    var cellB = rowB.cells[index].innerText;
                    return th.asc ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
                });
            jQuery('#tbodydeliveryboard').html('');
            datatosort  .forEach(function(tr) {
                table.append(tr);
            });
        });
    }); */
    document.querySelectorAll('#theaddeliveryboard th').forEach(function (th) {
        th.addEventListener('click', function () {
            // Find the table and the index of the column
            var tableBody = document.querySelector('#tbodydeliveryboard');
            var index = Array.from(th.parentNode.children).indexOf(th);
            var isAscending = th.classList.toggle('asc'); // Toggle ascending class

            // Get rows as an array
            var rows = Array.from(tableBody.querySelectorAll('tr'));

            // Sort rows based on the selected column
            rows.sort(function (rowA, rowB) {
                var cellA = rowA.cells[index].innerText.trim();
                var cellB = rowB.cells[index].innerText.trim();

                // Compare based on ascending or descending
                return isAscending ?
                    cellA.localeCompare(cellB) :
                    cellB.localeCompare(cellA);
            });

            // Clear the table body and re-append sorted rows
            tableBody.innerHTML = '';
            rows.forEach(function (row) {
                tableBody.appendChild(row);
            });

            // Update header classes for indicating sort order
            document.querySelectorAll('th').forEach(function (header) {
                header.classList.remove('asc', 'desc'); // Reset classes
            });
            th.classList.add(isAscending ? 'asc' : 'desc'); // Add appropriate class
        });
    });

});

function getCellValue(tr, idx) {
    return tr.children[idx].innerText || tr.children[idx].textContent
};

/* const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx)); */

function comparer(idx, asc) {
    return function (a, b) {
        var valueA = getCellValue(asc ? a : b, idx);
        var valueB = getCellValue(asc ? b : a, idx);

        if (valueA !== '' && valueB !== '' && !isNaN(valueA) && !isNaN(valueB)) {
            return valueA - valueB; // Numeric comparison
        } else {
            return valueA.toString().localeCompare(valueB); // String comparison
        }
    };
}

function getDepositInceptionValues() {
    var depoinc = [];
    jQuery('#inventorybodyMonthly tr').each(function () {
        if (jQuery(this).css('display') != 'none') {
            var text = jQuery(this).find('.depositinception').text();
            if (depoinc.indexOf(text) === -1) {
                depoinc.push(text);
            }
        }
    });
    return depoinc;
}

function getPaymentInceptionValues() {
    var payinc = [];
    jQuery('#inventorybodyMonthly tr').each(function () {
        if (jQuery(this).css('display') != 'none') {
            var text = jQuery(this).find('.paymentinception').text();
            if (payinc.indexOf(text) === -1) {
                payinc.push(text);
            }
        }

    });

    return payinc;
}

function getTotalInceptionValues() {
    var totalinc = [];
    jQuery('#inventorybodyMonthly tr').each(function () {
        if (jQuery(this).css('display') != 'none') {
            var text = jQuery(this).find('.totalinception').text();
            if (totalinc.indexOf(text) === -1) {
                totalinc.push(text);
            }
        }

    });
    return totalinc;
}

function getTermsValues() {
    var termsv = [];
    jQuery('#inventorybodyMonthly tr').each(function () {
        if (jQuery(this).css('display') != 'none') {
            var text = jQuery(this).find('.terms').text();
            if (termsv.indexOf(text) === -1) {
                termsv.push(text);
            }
        }

    });
    return termsv;
}
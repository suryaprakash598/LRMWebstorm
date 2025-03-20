/**
 * Module Description
 *
 * Version    Date            Author           Remarks
 * 1.00       25 Sep 2015     ULTIMUS02
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response) {

  if (request.getMethod() == 'GET') {
    var form = nlapiCreateForm('Create PTP', true);
    var customer = request.getParameter('custparam_cust');
    var Deal = request.getParameter('deal_id');
    var colle_id = request.getParameter('colle_id');
    var customerInfo = getAllStandardAddresses(customer);
    var gps_ = request.getParameter('gps_fld');
    var ofe_fld = request.getParameter('ofe_fld');
    var impounded = request.getParameter('impounded_fld');
    var insurance_flag = request.getParameter('insurance_claim');
    var insurance_No = request.getParameter('insurance_claim_id');

    var c_deal_id = request.getParameter('deal_id');
    var c_title = request.getParameter('title');
    var c_date = request.getParameter('date');
    var c_ptp = request.getParameter('ptp');
    var c_critical = request.getParameter('critical');
    var c_bro_promise = request.getParameter('bro_promise');
    var c_assigned = request.getParameter('assigned');
    var c_deal_no = request.getParameter('deal_no');
    var lease_pay = request.getParameter('lease_pay');


    var creditCardInfo = getcreditCardInformation(customer);

    form.setScript('customscript_advs_csat_create_pop_up');
    form.addFieldGroup('custpage_activity_type', 'Activity Type');
    var insurnce_fld = form.addField('custpage_insurance_no', 'text', 'Insurance No').setDisplayType('hidden');
    if (insurance_No != null && insurance_No != '' && insurance_No != undefined) {
      insurnce_fld.setDefaultValue(insurance_No);
    }
    var critical = form.addField('custpage_critical', 'checkbox', 'Is Critical', null, 'custpage_activity_type').setDisplayType('hidden');
    critical.setDefaultValue(c_critical);


    if (insurance_flag == 'T') {
      var insurance_fld = form.addField('custpage_insurance_fld', 'checkbox', 'Insurance', null, 'custpage_activity_type');
      //			insurance_fld.setDisplayType('disabled');
      if (insurance_fld != null && insurance_fld != '') {
        insurance_fld.setDefaultValue(insurance_flag);
        critical.setDefaultValue('T');
      }
    } else {
      var out_of_st_fld = form.addField('custpage_ofe_fld', 'checkbox', 'Out Of State', null, 'custpage_activity_type').setDisplayType('hidden');
      if (ofe_fld != null && ofe_fld != '') {
        out_of_st_fld.setDefaultValue(ofe_fld);
      }
      var impounded_fld = form.addField('custpage_impounded_fld', 'checkbox', 'Impounded', null, 'custpage_activity_type').setDisplayType('hidden');
      if (impounded != null && impounded != '') {
        impounded_fld.setDefaultValue(impounded);
      }
      var insurance_fld = form.addField('custpage_insurance_fld', 'checkbox', 'Insurance', null, 'custpage_activity_type').setDisplayType('hidden');
      if (insurance_fld != null && insurance_fld != '') {
        insurance_fld.setDefaultValue(insurance_flag);
      }
    }


    // For OFR
    var ofr_id = request.getParameter('ofr_id');
    if (ofr_id != null && ofr_id != '') {
      var ofr_fld = form.addField('custpage_ofr_link', 'select', 'OFR LINK', 'customrecord_lms_ofr_').setDisplayType('disabled');
      ofr_fld.setDefaultValue(ofr_id);
    } else {
      // Activity Type
      if (insurance_flag == 'T') {

      } else {
        //	var broken_promise=form.addField('custpage_broken_promise', 'checkbox', 'Broke Promise',null,'custpage_ptp_group');
        //	broken_promise.setDefaultValue(c_bro_promise);
        var gps_fld = form.addField('custpage_gps_fld', 'checkbox', 'GPS Disanged', null, 'custpage_activity_type').setDisplayType('hidden');
        if (gps_ != null && gps_ != '') {
          gps_fld.setDefaultValue(gps_);
        }


        var lease_pay_fld = form.addField('custpage_lease_pay_off', 'checkbox', 'Lease Pay Off', null, 'custpage_activity_type').setDisplayType('hidden');
        lease_pay_fld.setDefaultValue(lease_pay);



        // PTP Details
        form.addFieldGroup('custpage_ptp_group', 'PTP Info');
        var PTP_amount = form.addField('custpage_ptp_amount', 'currency', 'PTP Amount', null, 'custpage_ptp_group');
        PTP_amount.setDefaultValue(c_ptp);
      }

    }



    //Activity Detail

    var Title = form.addField('custpage_title', 'text', 'Title', null, 'custpage_ptp_group');
    Title.setMandatory(true);
    Title.setMaxLength(200);
    var fld_Date = form.addField('custpage_date', 'date', 'PTP Date', null, 'custpage_ptp_group');
    fld_Date.setMandatory(true);
    if (c_date == null || c_date == undefined || c_date == 'null' || c_date == '') {
      var dt = new Date();
      fld_Date.setDefaultValue(nlapiDateToString(dt));
    }

    form.addFieldGroup('custpage_ptp_group_two', 'PTP Data');
    var PTP_type = form.addField('custpage_ptp_type', 'select', 'PTP Type', 'customlist_advs_ptp_type', 'custpage_ptp_group');
    // PTP_amount1.setDefaultValue(c_ptp);

    var ccards_fld = form.addField('custpage_credit_cards', 'select', 'Cards', null, 'custpage_ptp_group');
    var ccdetailss = customerInfo[0].ccdetails;
    ccards_fld.addSelectOption( "","" );
 /*   for (var m = 0; m < ccdetailss.length; m++) {
      var ccnumber = ccdetailss[m].cardNumber;
      var cardid = ccdetailss[m].id;
      var cardType = ccdetailss[m].cardType;

      var concatCard = cardType + " " + ccnumber;

      ccards_fld.addSelectOption( cardid,concatCard );
    }*/

    for (var m = 0; m < creditCardInfo.length; m++) {
        var ccnumber = creditCardInfo[m].name;
        var cardid = creditCardInfo[m].id;
        var isdefault = creditCardInfo[m].isdefault;

        var concatCard = ccnumber;
        if(isdefault == true){
          ccards_fld.addSelectOption( cardid,concatCard ,true);
        }else{
          ccards_fld.addSelectOption( cardid,concatCard );
        }

      }



    form.addFieldGroup('custpage_activity_detail', 'Activity Detail');
    var context = nlapiGetContext();
    var user = context.getUser();
    var assigned_to = form.addField('custpage_assigned_to', 'select', 'Assigned To', 'employee', 'custpage_activity_detail');
    assigned_to.setDefaultValue(user);
    var status_fld = form.addField('custpage_status', 'select', 'Status', null, 'custpage_activity_detail');
    status_fld.addSelectOption('COMPLETE', 'Completed');
    status_fld.addSelectOption('PROGRESS', 'In Progress');
    status_fld.addSelectOption('NOTSTART', 'Not Started', true);
    var broken_promise = form.addField('custpage_broken_promise', 'checkbox', 'Broke Promise', null, 'custpage_activity_detail');
    if (insurance_flag == 'F' || insurance_flag == false) {
      broken_promise.setDefaultValue(c_bro_promise);
    }
    try {
      form.addField('custpage_message_ares', 'textarea', 'Message', null, 'custpage_activity_detail');
    } catch (e) {

    }

    nlapiLogExecution('ERROR', 'customer', customer);

    // Stock Detail
    form.addFieldGroup('custpage_stock_detail', 'Stock Detail');
    var entity = form.addField('custpage_entity', 'select', 'Company', 'customer', 'custpage_stock_detail');
    if (customer != null && customer != "" && customer != 'null' && customer != undefined && customer != 'undefined') {
      entity.setDefaultValue(customer);
      entity.setDisplayType('inline');
    }
    if (customer != null && customer != '' && customer != undefined) {
      var filter = new Array();
      filter[0] = new nlobjSearchFilter('internalid', 'custrecord_advs_l_h_customer_name', 'anyof', customer);

      var column = new Array();
      column[0] = new nlobjSearchColumn('name');
      column[1] = new nlobjSearchColumn('internalid');
      column[2] = new nlobjSearchColumn('custrecord_advs_l_h_status');
      var deal_no = [],
          internalid = [],
          deal_status = [];
      var k = 0;

      //NS Comments
      var search = nlapiCreateSearch('customrecord_advs_lease_header', filter, column);
      var run = search.runSearch();
      var col = run.getColumns();
      run.forEachResult(function (res) {
        deal_no[k] = res.getValue(col[0]);
        internalid[k] = res.getValue(col[1]);
        deal_status[k] = res.getValue(col[2]);
        k++;
        return true;
      });

    }

    var select = form.addField('custpage_select', 'select', 'Deal Number', null, 'custpage_stock_detail').setMandatory(true);
    select.addSelectOption('', '');
    var flag_for_Impound = 0;
    for (var l = 0; l < k; l++) {
      if (deal_status[l] == 2) {
        select.addSelectOption(internalid[l], deal_no[l], true);
      } else {
        select.addSelectOption(internalid[l], deal_no[l]);
      }
      //impounded_fld
      var deal_id_for_imp = internalid[l];
      if (deal_id_for_imp != null && deal_id_for_imp != '' && deal_id_for_imp != undefined) {
        var imp_task = ""; //nlapiLookupField('customrecord_advs_lease_header', deal_id_for_imp, 'custrecord626');
        if (imp_task != null && imp_task != '' && imp_task != undefined) {
          flag_for_Impound++;
        }
      }
      // nlapiLogExecution('ERROR', 'deal_id_for_imp', deal_id_for_imp);

    }
    if (insurance_flag == 'T') {
      select.setDisplayType('disabled');
    } else {
      // var broken_promise=form.addField('custpage_broken_promise', 'checkbox', 'Broke Promise',null,'custpage_activity_detail');
      //	broken_promise.setDefaultValue(c_bro_promise);
      if (flag_for_Impound != 0) {
        impounded_fld.setDisplayType('hidden');
      }
    }

    if (ofr_id != null && ofr_id != '') {
      select.setDisplayType('disabled');
    }
    var temp = form.addField('custpage_temp', 'text', 'Company');
    temp.setDefaultValue(customer);
    temp.setDisplayType('hidden');




    //NS Comments
    //var Deal_fld=form.addField('custpage_deal_id', 'select', 'Deal','customrecord_advs_lease_header');
    var Deal_fld = form.addField('custpage_deal_id', 'text', 'Deal');
    Deal_fld.setDisplayType('hidden');
    if (Deal != null && Deal != 'null' && Deal != "" && Deal != undefined) {
      Deal_fld.setDefaultValue(Deal);
    }
    // Added By Faruk
    var collection_fld = form.addField('custpage_cust_collection_stock_id', 'select', 'Collection Stock', 'customrecord_advs_customer_collection_st');
    collection_fld.setDisplayType('hidden');
    if (colle_id != null && colle_id != 'null' && colle_id != "" && colle_id != undefined) {
      //			collection_fld.setDefaultValue(colle_id);
    }
    if (c_deal_id != null && c_deal_id != '' && c_deal_id != undefined) {
      Deal_fld.setDefaultValue(c_deal_no);
      if (c_assigned != null && c_assigned != '') {
        assigned_to.setDefaultValue(c_assigned);
      }

      select.setDefaultValue(c_deal_id);
      entity.setDefaultValue(customer);


      Title.setDefaultValue(c_title);
      if (c_date != null && c_date != '' && c_date != undefined) {
        fld_Date.setDefaultValue(c_date);
      }
    }


    /**
     *
     * invoice Details*
     *
     * */



    var search = createUnpaidAmountByLeaseHeadSearch(Deal);

    var searchResults = search.runSearch().getResults(0, 1000); // Adjust the range as needed

    var openInvoiceDue = 0;
    for (var i = 0; i < searchResults.length; i++) {
      var result = searchResults[i];
      var unpaidAmount = result.getValue("amountremaining", null, "sum") * 1;

      openInvoiceDue += unpaidAmount;
    }

    var invoicedueFldObj = form.addField('custpage_invoice_due', 'currency', 'DUE AS OF TODAY', null, 'custpage_stock_detail');
    invoicedueFldObj.setDefaultValue(openInvoiceDue);
    invoicedueFldObj.setDisplayType("inline");

    form.addFieldGroup('custpage_invoices', 'Invoices');

    //     // var invoicecount=form.addField('custpage_invoice_count', 'text', 'Total Open Invoices#',null,'custpage_invoices');
    //     // invoicecount.setDisplayType("inline");
    //----------------------------------------------
    var invoiceNo = "";
    var tranDate = "";
    var totAmt = "";
    var RemainAmt = "";
    var Daysoverdue = "",
        invoiceType = "";
    var transsearch = getInvoiceForLeaseHeader(Deal);
    var transsearchResults = transsearch.runSearch().getResults(0, 1000);
    //nlapiLogExecution('ERROR', 'transsearch',transsearch);

    var lenn = transsearchResults.length;

    var htmlTable = '<table width="170%" style="margin-top: 10px;">';
    htmlTable += '<tr><td><table width="100%"><tr style="height: 25px;"><td style="background-color:#f98009;"><b>&nbsp;Invoices</b></td><td style="background-color:#f98009;" align="right"><b> # of Open Invoices:&nbsp;' + lenn + '&nbsp;</b></td></tr></table>';
    htmlTable += '<table width="100%" style="background-color:#D3D3D3;"><tr style="background-color:#f98009;"><th><b>Date</b></th><th><b>Invoice #</b></th><th><b>Invoice type</b></th><th><b>Days Overdue</b></th><th><b>Orig Amt</b></th><th><b>Amt Due</b></th><th><b>Amt Remaining</b></th></tr>';


    for (var i = 0; i < transsearchResults.length; i++) {
      var result = transsearchResults[i];
      invoiceNo = result.getValue("invoicenum");
      tranDate = result.getValue("trandate");
      totAmt = result.getValue("amount");
      RemainAmt = result.getValue("amountremaining");
      invoiceType = result.getText("custbody_advs_invoice_type");
      Daysoverdue = result.getValue("daysoverdue");

      htmlTable += '<tr>';
      htmlTable += '<td>' + tranDate + '</td>';
      htmlTable += '<td>' + invoiceNo + '</td>';
      htmlTable += '<td>' + invoiceType + '</td>';
      htmlTable += '<td>' + Daysoverdue + '</td>';
      htmlTable += '<td>$' + totAmt + '</td>';
      htmlTable += '<td>$' + totAmt + '</td>';
      htmlTable += '<td>$' + RemainAmt + '</td>';
      htmlTable += '</tr>';
    }
    htmlTable += '</table></td></tr></table>';
    var invoiceTablehtml = form.addField('custpage_invoice_table', 'inlinehtml', '', null, 'custpage_invoices');
    invoiceTablehtml.setDefaultValue(htmlTable);

    //---------------

    form.addSubmitButton('submit');

    response.writePage(form);
  }
  else
  {


    var start_date = request.getParameter('custpage_date');
    var Title = request.getParameter('custpage_title');
    var Customer = request.getParameter('custpage_entity');
    var Deal_id = request.getParameter('custpage_deal_id');
    var ptpType = request.getParameter('custpage_ptp_type');
    var creditcard = request.getParameter('custpage_credit_cards');
    // Activity
    var critical = request.getParameter('custpage_critical');
    var out_of_state = request.getParameter('custpage_ofe_fld');
    var impounded = request.getParameter('custpage_impounded_fld');
    var assigned_to = request.getParameter('custpage_assigned_to');
    var status = request.getParameter('custpage_status');
    var c_deal_id = request.getParameter('custpage_select');
    var message = request.getParameter('custpage_message_ares');
    var ofr_value = request.getParameter('custpage_ofr_link');
    var lease_pay_off = request.getParameter('custpage_lease_pay_off');
    var insurance = request.getParameter('custpage_insurance_fld');
    var insurance_no = request.getParameter('custpage_insurance_no');
    nlapiLogExecution('ERROR', 'ptpType', ptpType);
    var task_rec = nlapiCreateRecord('task', {
      recordmode: 'dynamic'
    });
    task_rec.setFieldValue('title', Title);
    var context = nlapiGetContext();
    var emp = context.getUser();
    task_rec.setFieldValue('title', Title);
    task_rec.setFieldValue('assigned', emp);
    task_rec.setFieldValue('custevent_advs_mm_task_type', 6);

    if (insurance_no != null && insurance_no != '' && insurance_no != undefined) {
      task_rec.setFieldValue('custevent_insurance_claim_link', insurance_no);
    }
    var st_date = new Date();
    task_rec.setFieldValue('startdate', nlapiDateToString(st_date));
    task_rec.setFieldValue('duedate', start_date);
    if (assigned_to != null && assigned_to != '') {
      task_rec.setFieldValue('assigned', assigned_to);
    }
    task_rec.setFieldValue('sendemail', 'F');
    task_rec.setFieldValue('company', Customer); //

    task_rec.setFieldValue('custevent_advs_lease_link', c_deal_id);
    if (critical != "" && critical != null) {
      task_rec.setFieldValue('custeventadvs_task_critical', critical);
    }
    if (impounded == 'T') {
      task_rec.setFieldValue('custevent_advs_mm_task_type', 1);
      task_rec.setFieldValue('custevent_task_impounded', 'T');
    }
    task_rec.setFieldValue('custevent_task_out_of_state', out_of_state);
    task_rec.setFieldValue('custevent_last_activity_date', nlapiDateToString(st_date));
    var user = nlapiGetUser();
    task_rec.setFieldValue('custevent_last_activity_done_by', user);
    task_rec.setFieldValue('message', message);
    task_rec.setFieldValue('custevent_insurance_task', insurance);

    if (ofr_value != null && ofr_value != '' && ofr_value != undefined) {
      //			task_rec.setFieldValue('custevent_ofr_linl_fld', ofr_value);
      task_rec.setFieldValue('custevent_advs_mm_task_type', 5);
    } else {
      var ptp = request.getParameter('custpage_ptp_amount');
      var broken_promise = request.getParameter('custpage_broken_promise');
      var gps_check = request.getParameter('custpage_gps_fld');
      if (ptp != "" && ptp != null && ptp != 0) {
        task_rec.setFieldValue('custevent_advs_ptp_amount', ptp);
        task_rec.setFieldValue('custeventadvs_task_critical', 'T');
        task_rec.setFieldValue('custevent_advs_mm_task_type', 2);
        task_rec.setFieldValue('custevent_advs_ptp_type', ptpType);
        task_rec.setFieldValue('custevent_advs_ptp_type_filter', ptpType);
        task_rec.setFieldValue('custevent_advs_abp_card_link', creditcard);
      } else {
        var dt = new Date();
        if (start_date == nlapiDateToString(dt)) {
          task_rec.setFieldValue('status', status);
        }
      }
      if (broken_promise != 'null' && broken_promise != "" && broken_promise != null) {
        task_rec.setFieldValue('custevent_advs_broken_promis', broken_promise);
        task_rec.setFieldValue('custevent_advs_mm_task_type', 4);
      }
      task_rec.setFieldValue('custevent_gps', gps_check);
      task_rec.setFieldValue('custevent_task_lease_pay_off', lease_pay_off);
    }
    try {
      var task_id = nlapiSubmitRecord(task_rec, true, true);
      nlapiLogExecution('ERROR', 'task_id', task_id);
    } catch (e) {
      nlapiLogExecution('ERROR', 'LOGGED MESSAGE', e.message);
    }


    var Html = "<script>window.close();</script>";
    response.write(Html);
  }

}


function createUnpaidAmountByLeaseHeadSearch(dealLengthArray) {
  var filters = [
    [
      [
        ["type", "anyof", ["CashRfnd", "CustDep", "CustPymt"]], "AND", ["mainline", "is", "F"]
      ],
      "OR",
      [
        ["type", "anyof", ["CustCred", "CustInvc"]], "AND", ["mainline", "is", "T"]
      ]
    ],
    "AND",
    ["custbody_advs_lease_head", "anyof", dealLengthArray],
    "AND",
    ["amountremaining", "greaterthan", "0.00"]
  ];

  var columns = [
    new nlobjSearchColumn("internalid", "customer", "group"),
    new nlobjSearchColumn("subsidiary", null, "group"),
    new nlobjSearchColumn("amountremaining", null, "sum"),
    new nlobjSearchColumn("custbody_advs_lease_head", null, "group")
  ];

  var search = nlapiCreateSearch("transaction", filters, columns);

  return search;
}

function getInvoiceForLeaseHeader(dealLengthArray) {
  var filters = [
    ["type", "anyof", "CustInvc", "CashRfnd", "CustDep", "CustPymt"],
    "AND",
    ["amountremaining", "greaterthan", "0.00"],
    "AND",
    ["custbody_advs_lease_head", "is", dealLengthArray]
  ];
  var columns = [
    new nlobjSearchColumn("invoicenum").setSort(true),
    new nlobjSearchColumn("trandate"),
    new nlobjSearchColumn("amount"),
    new nlobjSearchColumn("amountremaining"),
    new nlobjSearchColumn("custbody_advs_invoice_type"),
    new nlobjSearchColumn("daysoverdue"),
  ];
  var transactionSearch = nlapiCreateSearch("transaction", filters, columns);
  return transactionSearch;

}
function getAllStandardAddresses(customerId) {
  var customerAddresses = []; // Load the customer record
  var customerRecord =  nlapiLoadRecord('customer',customerId);
  var ccinfoArr = []; // Get the number of credit card entries associated with the customer
  var ccCount = customerRecord.getLineItemCount('creditcards');
  for (var i = 0; i < ccCount; i++) {
    var cardNumber=customerRecord.getLineItemValue('creditcards','ccnumber',i+1);
    var expirationDate=customerRecord.getLineItemValue('creditcards','ccexpiredate',i+1);
    var cardHolderName=customerRecord.getLineItemValue('creditcards','ccname',i+1);
    var cardInternalId=customerRecord.getLineItemValue('creditcards','internalid',i+1);
    var cardType=customerRecord.getLineItemText('creditcards','paymentmethod',i+1);


    var cc = {
      id: cardInternalId,
      cardholderName: cardHolderName,
      cardNumber: cardNumber,
      expirationDate: expirationDate,
      cardType: cardType
    };
    ccinfoArr.push(cc);
  } // log.debug("c  
  var postobj = {};
  var postArr = [];
  postobj.ccdetails = {};
  postobj.ccdetails = ccinfoArr;
  postArr.push(postobj);
  return postArr;
}

function getcreditCardInformation(customerId){
  var ccdata = [];
  var ccinforSearch = nlapiCreateSearch("customrecord_fd_abp_saved_card",
      [
        ["isinactive","is","F"],
        "AND",
        ["custrecord_sc_customer","anyof",customerId]
      ],
      [
        new nlobjSearchColumn("internalid"),
        new nlobjSearchColumn("name"),
        new nlobjSearchColumn("custrecord_sc_default_card")
      ]
  );
  var run = ccinforSearch.runSearch();
  run.forEachResult(function(res){
    var ccid    = res.getValue("internalid");
    var ccName  = res.getValue("name");
    var defaultcard  = res.getValue("custrecord_sc_default_card");
    if(defaultcard == "T"){
      defaultcard = true;
    }
    var obj = {};
    obj.id = ccid;
    obj.name = ccName;
    obj.isdefault = defaultcard;
    ccdata.push(obj);
    return true;
  });

  return ccdata;
}


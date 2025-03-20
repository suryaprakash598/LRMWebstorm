function openauthorizationhistory() {
  try {
    var vin = jQuery('#custpage_vin_number').text();
    var soid = jQuery('#custpage_open_order_docnumber').attr('data-recid');
    window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1744&deploy=1&vin=' + vin + '&soid=' + soid, width = "1000px", height = "150px")
  } catch (e) {
    log.debug('erronr in openauthorizationhistory', e.toString())
  }
}

function openprofitability() {
  try {
    var vin = jQuery('#profitability').toggle();

  } catch (e) {
    log.debug('erronr in openprofitability', e.toString())
  }
}

function openTicketDashboard() {

  var url = "/app/site/hosting/scriptlet.nl?script=customscript_ssst_service_dash_kanban" +
    "&deploy=customdeploy_ssst_service_dash_kanban";
  //window.open(url);
}

function openauthorization() {
  try {

    var soid = jQuery('#custpage_open_order_docnumber').attr('data-recid');
    window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1743&deploy=1&soid=' + soid, width = "200px", height = "150px")

  } catch (e) {
    console.log('error', e.toString());
  }
}

function authorizeViewOpen(jobnumber, operationnumber) {
  try {
    debugger;
    var arr = [];
    var total = 0;
    var len = jQuery('#div_content_id_' + operationnumber + ' table tbody tr').length;
    var vin = jQuery('#custpage_vin_number').text();
    var customer = jQuery('#customeronview').val();
    var customerid = jQuery('#custpage_customer_id').val();
    var _customerid = customer || customerid;
    var soid = jQuery('#custpage_open_order_docnumber').attr('data-recid');
    // for(var i=0;i<len;i++){
    jQuery('#div_content_id_' + operationnumber + ' .lines-container .line').each(function () {
      var obj = {};
      var lineid = jQuery(this).attr('id');
      var Linenumber = lineid.split('-')[1]
      // var item 	= jQuery('#line-'+(Linenumber)+'-field2').val();
      var item = jQuery('#line-' + (Linenumber) + '-field2').val();
      var rate = jQuery('#line-' + (Linenumber) + '-field4').val();
      var amount = jQuery('#line-' + (Linenumber) + '-field5').val();
      obj.item = item;
      obj.rate = rate;
      obj.amount = amount;
      arr.push(obj);
    })


    // }

    window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1743&deploy=1&vin=' + vin + '&cust=' + _customerid + '&soid=' + soid + '&data=' + encodeURIComponent(JSON.stringify(arr)), width = "200px", height = "150px")
  } catch (e) {
    console.log("erronr in authorizeViewOpen", e.toString());
  }
}

function authorizeCustomerViewOpen(jobnumber, operationnumber) {
  try {
    var arr = [];
    var total = 0;
    var len = jQuery('#div_content_id_' + operationnumber + ' table tbody tr').length;
    var vin = jQuery('#custpage_vin_number').text();
    for (var i = 0; i < len; i++) {
      var obj = {};

      var item = jQuery('#line-' + (i + 1) + '-field2').val();
      var rate = jQuery('#line-' + (i + 1) + '-field4').val();
      var amount = jQuery('#line-' + (i + 1) + '-field5').val();
      obj.item = item;
      obj.rate = rate;
      obj.amount = amount;
      arr.push(obj);

    }

    window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1748&deploy=1&vin=' + vin, width = "200px", height = "150px");
  } catch (e) {
    console.log("erronr in authorizeViewOpen", e.toString());
  }
}

function submitauthorizeOperation() {
  var datetime = jQuery('#datetime').val();
  var arr = [];
  var soid = getUrlParameter("soid");
  var jobname = '';
  jQuery('#service_data tbody tr').each(function name(params) {
    debugger;
    var obj = {};
    if (jQuery(this).find('th').text() != '') {
      jobname = jQuery(this).find('th').text();
    }
    obj.jobname = jobname;
    obj.item = jQuery(this).find('.item').text();
    obj.amount = jQuery(this).find('.amount').text();
    obj.ismarked = jQuery(this).find('input[type="checkbox"]').is(":checked")
    arr.push(obj)
  })
  var servicedata = jQuery('#operation_service_data').val();
  var customerdata = jQuery('#customerdata').val();
  var personauth = jQuery('#person-authorize').val();
  var phoneauth = jQuery('#phone-authorize').val();
  var textauth = jQuery('#text-authorize').val();
  var emailauth = jQuery('#email-authorize').val();
  var notes = jQuery('#notes').val();
  var amount = jQuery('#totalvaluetabletd').text();
  var vin = jQuery('#vinmaster').text();

  var obj = {};
  obj.dt = datetime;
  var linedata = arr; //JSON.parse(servicedata);
  //obj.servicedata = encodeURIComponent(JSON.stringify(linedata));
  obj.customerdata = customerdata;
  obj.personauth = personauth;
  obj.phoneauth = phoneauth;
  obj.textauth = textauth;
  obj.emailauth = emailauth;
  obj.notes = notes;
  obj.amount = amount;
  obj.vin = vin;
  obj.soid = soid;

  var url = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1745&deploy=1&flag=2&servicedata=" + encodeURIComponent(JSON.stringify(linedata)) + "&obj=" + JSON.stringify(obj);

  jQuery.get(url)
    .done(function (data) {
      debugger;
      console.log(data);
      if (data == 'success') {
        window.opener.document.getElementById('authorizestatus1').innerHTML = "<i class=\"fa fa-check-circle \" style='color:green;'></i>Authorized";
        //jQuery('#authorizestatus').text('Authorized');
        window.close();
      }

    });

}

function openauthorizationhistory1() {
  try {
    var vin = jQuery('#custpage_vin_number').text();
    var url = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1745&deploy=1&flag=3&vin=" + vin;
    jQuery.get(url)
      .done(function (data) {
        debugger;
        console.log(data);
        if (data == 'success') {
          window.opener.document.getElementById('authorizestatus1').innerHTML = "<i class=\"fa fa-check-circle \" style='color:green;'></i>Authorized";
          //jQuery('#authorizestatus').text('Authorized');
        }

      });
  } catch (e) {
    log.debug('error', e.toString())
  }
}
$(document).ready(function () {


  $("#lockkey").click(function () {
    $(this).hide();
  });
  debugger;
  $("#cancelbtn").click(function () {
    window.close();
  });
});

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
      jQuery('#errModal').show();
      jQuery('#errMsg').html(e);
    }
  });

  return result;
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var scriptID = getUrlParameter("script");
var _rlineCount = 0;
jQuery(document).ready(function (event) {
  var sectionCount = 0;
  var soid = getUrlParameter("soid");
  if (scriptID == 1743) {
    var url = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1745&deploy=1&flag=1&soid=" + soid;

    jQuery.get(url)
      .done(function (data) {
        debugger;
        var operationsdata = JSON.parse(data);
        var htl = '';
        var totalamount = 0;

        var option = '<option value="' + operationsdata[0].customerid + '" selected>' + operationsdata[0].customer + '</option>';
        console.log('operationsdata', operationsdata);
        jQuery('#vinmaster').text(operationsdata[0].vin);
        jQuery('#vinmaster').attr("data-id", operationsdata[0].vinid);
        jQuery('#customerdata').html(option);

        operationsdata.shift();
        var groupData = _.groupBy(operationsdata, 'jobname');
        var jobsnames = Object.keys(groupData);
        for (var k = 0; k < jobsnames.length; k++) {
          var jobitems = groupData[jobsnames[k]];
          console.log('jobitems', jobitems);
          if (jobsnames[k] != "") {
            htl += "<tr ><th colspan='3' style='background-color:#bdbbb7' class='jobname'>" + jobsnames[k] + "</th><th style='background-color:#bdbbb7;display:none;'><input class='joblevelbox' type='checkbox' name='approvereject' id='approvereject'></th></tr>";
            for (var i = 0; i < jobitems.length; i++) {
              //if(jobitems[i].jobname!=""){
              htl += '<tr><td class="item">' + jobitems[i].item + '</td><td class="amount">' + jobitems[i].amount + '</td><td style="display:none;"><input type="checkbox" name="approvereject" id="approvereject"></td></tr>';
              totalamount = totalamount + ((jobitems[i].amount) * 1);
              //}

            }
          }

        }

        jQuery('#totalvaluetabletd').text(totalamount);
        jQuery('#service_data tbody').html(htl);


      });


  }
  if (scriptID == 1744) {
    debugger;
    var vin = jQuery('#operation_service_vin').val();
    var soid = getUrlParameter("soid");
    var url = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1745&deploy=1&flag=3&vin=" + vin + '&soid=' + soid;

    jQuery.get(url)
      .done(function (data) {
        debugger;
        var operations = JSON.parse(data);
        var tablerow = '';
        // tablerow +='<tr><td>';
        // tablerow +='<table class="jobdata" style="width:100%; margin-bottom:20px;margin-left:20px;background-color:beige;" id="jobdata_'+i+'">'
        for (var i = 0; i < operations.length; i++) {

          tablerow += '<tr>';
          tablerow += '<td>' + operations[i].salesordertext + '</td>';
          tablerow += '<td>' + operations[i].vin + '</td>';
          tablerow += '<td>' + operations[i].customertext + '</td>';
          tablerow += '<td>' + operations[i].jobname + '</td>';
          tablerow += '<td>' + operations[i].jobitem + '</td>';
          tablerow += '<td>' + operations[i].jobprice + '</td>';
          tablerow += '<td>' + operations[i].notes + '</td>';
          tablerow += '<td>' + operations[i].operationmethodtext + '</td>';
          tablerow += '<td>' + operations[i].operationstatustext + '</td>';
          tablerow += '<td>' + operations[i].datetime + '</td>';
          tablerow += '</tr>';
        }
        // tablerow +='</td></tr>'
        jQuery('#operationbody').html(tablerow);
      });
  }
  if (scriptID == 1748) {
    debugger;
    var vin = jQuery('#operation_service_vin').val();
    var vin = jQuery('#operation_service_vin').val();
    var customer = getUrlParameter("customer");
    var customername = getUrlParameter("customername");
    /* var url =  "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1745&deploy=1&flag=1";
       
        jQuery.get(url)
            .done(function (data) {
				debugger;
                 var customerRes = JSON.parse(data);
				 var option='<option></option>';
                for (var lr = 0; lr < customerRes.length; lr++) {
                    var id = customerRes[lr].id;
                    var name = customerRes[lr].name;
                    option+='<option value='+id+'>'+name+'</option>'
                        
                }
					jQuery('#customerreceipient').html(option);
          });  */
    var option = '';
    option += '<option value=' + customer + ' selected>' + customername + '</option>'
    jQuery('#customerreceipient').html(option);
    var url = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1745&deploy=1&flag=emailtemplate";

    jQuery.get(url)
      .done(function (data) {
        debugger;
        var emailtemplates = JSON.parse(data);
        var option = '<option></option>';
        for (var lr = 0; lr < emailtemplates.length; lr++) {
          var id = emailtemplates[lr].id;
          var name = emailtemplates[lr].name;
          option += '<option value=' + id + '>' + name + '</option>'

        }
        jQuery('#emailtemplates').html(option);
      });
    jQuery('#emailtemplates').change(function () {
      var templateid = jQuery(this).val();
      var url = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1745&deploy=1&flag=emailtemplateid&templateid=" + templateid;

      jQuery.get(url)
        .done(function (data) {
          debugger;
          var emailtemplate = JSON.parse(data);

          jQuery('#emailsubject_customer').val(emailtemplate[0].subject);
          jQuery('#emailbody').text(emailtemplate[0].body);
        });

    });
    jQuery('#sendemailtocustomer').click(function (event) {
      event.preventDefault();
      var vin = getUrlParameter("vin");
      var customer = getUrlParameter("customer");
      var soid = getUrlParameter("soid");
      var templateid = jQuery('#emailtemplates').val();

      var url = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1745&deploy=1&flag=sendemail&templateid=" + templateid + "&vin=" + vin + "&customer=" + customer + "&soid=" + soid;
      jQuery.get(url)
        .done(function (data) {
          debugger;
          if (data == "success") {
            window.opener.close();
            window.close();
          }
        });
    });

  }
  if (scriptID == 1704 || scriptID == 'customscript_ssst_service_dashboard_2') {
    //OPEN REPORTS
    jQuery('.openreports').click(function () {
      window.open('https://8760954.app.netsuite.com/app/common/custom/custrecordentrylist.nl?rectype=131&whence=', '_blank');
      window.open('https://8760954.app.netsuite.com/app/common/custom/custrecordentrylist.nl?rectype=131&whence=', '_blank');
      window.open('https://8760954.app.netsuite.com/app/common/custom/custrecordentrylist.nl?rectype=131&whence=', '_blank');
      window.open('https://8760954.app.netsuite.com/app/common/custom/custrecordentrylist.nl?rectype=131&whence=', '_blank');
      window.open('https://8760954.app.netsuite.com/app/common/custom/custrecordentrylist.nl?rectype=131&whence=', '_blank');
    })

  }
  if (scriptID == 2567) {
    //OPEN REPORTS
    var vin = getUrlParameter("vin") || '';
    var datahis = getvihistorydetails(vin);

  }
  if (scriptID == 1704 || scriptID == 'customscript_ssst_service_dashboard_2') {
    var recid = getUrlParameter("recid") || '';
    if (recid != '') {
      jQuery('#printorder').show();
    }
    jQuery('#orderlistview').click(function () {
      var url = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1751&deploy=1&flag=1";

      jQuery.get(url)
        .done(function (data) {
          debugger;
          var serviceOrders = JSON.parse(data);
          var _html = '  <button type="button" class="btn btn-inverse-dark btn-fw  multiAddpopupButton" id="custpage_a_orderlist_close">Close</button> </div>";<table id="orderlistviewtable" class="table table-striped table-bordered" style="width:100%">';
          _html += '<thead><tr> <th style="display:none;">Internalid</th> <th>Document Number</th><th>Customer</th>  <th>Amount</th><th>VIN</th><th>Open</th></tr></thead><tbody>' //<th>Open</th>
          for (var j = 0; j < serviceOrders.length; j++) {
            _html += '<tr id="' + serviceOrders[j].internalid + '">'
            _html += '<td style="display:none;">SalesOrder #' + serviceOrders[j].internalid + '</td>'
            _html += '<td>SalesOrder #' + serviceOrders[j].docnumber + '</td>'
            _html += '<td>' + serviceOrders[j].entity + '</td>'
            _html += '<td>' + serviceOrders[j].amount + '</td>'
            _html += '<td>' + serviceOrders[j].vinText + '</td>'
            _html += '<td><a href="https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1704&deploy=1&whence=&recid=' + serviceOrders[j].internalid + '">View</a></td>'
            _html += '</tr>'
          }
          _html += '</tbody></table>'

          jQuery('#orderlistviewtbody').html(_html);
          console.log('serviceOrders', serviceOrders);
          //jQuery('#exampleModal').modal('show');
          // jQuery('#popup_orderlist').show();
          jQuery('#popup_package').html(_html);
          jQuery('#popup_package').show();
          new DataTable('#orderlistviewtable', {
            order: false
          });

          //jQuery('#orderlist-modal').modal('show');
          //jQuery('#customerdata').html(option)
        });

    });

    $(document).on('click', '#custpage_a_orderlist_close', function () {
      document.getElementById("popup_package").style.display = 'none';
    });

    jQuery('#printorder').click(function () {
      var _recid = getUrlParameter("recid");
      // $(document).on('click','#printorder' , function() {
      //alert('Function Clicked')
      /*  var isJobChecked = document.getElementById("print-job_data").value;
       var isqtyChecked = document.getElementById("print-qty_data").value;
       var ispriceChecked = document.getElementById("print-price_data").value;
       var isauthChecked = document.getElementById("print-auth").value;
       var ismsgChecked = document.getElementById("print-msg").value;
       var isappointChecked = document.getElementById("print-appoint").value; */
      /* var values = [];

				  // Find all hidden input fields within the div
				  $(".printf").each(function() { //:hidden[type='hidden']
					// Get the value of each hidden input field
                      var obj={};
					  if (jQuery(this).val() != '') {
						obj[$(this).attr('data-id')] = $(this).val(); 
                        obj.jobid =$(this).attr('data-jobid');  
						values.push(obj);
					  }
				  }); */
      var mainarr = [];
      jQuery('.lines-container .line').each(function () {
        jQuery(this).each(function () {
          debugger;
          var obj = {};
          jQuery(this).find('.printf').each(function () {
            if (jQuery(this).val() != '') {
              obj[jQuery(this).attr('data-id')] = jQuery(this).val();

            }
          })
          mainarr.push(obj)
        })
      })
      console.log('mainarr', mainarr);
      var recid = _recid;
      let url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1750&deploy=1&recid=' + recid +
        '&data=' + JSON.stringify(mainarr);

      let params = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=300,height=370,left=550,top=300,';
      window.open(url, "test", params);
    });

    $('#custpage_ticket_dashboard_click').click(function (event) {
		event.preventDefault();
      var _recid = getUrlParameter("recid");
      if (_recid) {
        var url = "/app/site/hosting/scriptlet.nl?script=customscript_ssst_service_dash_kanban" +
          "&deploy=customdeploy_ssst_service_dash_kanban";
        window.open(url);
      }

    });

    $('#custpage_customer_click').click(function () {
      openCustomerCard();
    });

    $('#custpage_vehicle_click').click(function () {
      openVehicleCard();
    });

    $('#custpage_last_order_click').click(function () {
      openLastOrder();
    });

  }
  if (scriptID == 1704 || scriptID == 'customscript_ssst_service_dashboard_2') {
    var recid = getUrlParameter("recid");
    if (recid) {
      var url = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1751&deploy=1&flag=2&soid=" + recid;

      jQuery.get(url)
        .done(function (data) {
          debugger;
          // event.preventDefault();
          var serviceOrder = JSON.parse(data);
          console.log('serviceOrder', serviceOrder);
          // jQuery('#search_text').val(serviceOrder[0].vintext);
          jQuery('#selected_vehicle_id').val(serviceOrder[0].vinid);
          jQuery('#custpage_vin_number').text(serviceOrder[0].vintext);
          jQuery('#customeronviewname').text(serviceOrder[0].entitytext);
          jQuery('#customeronview').val(serviceOrder[0].entity);
          jQuery('#customerlocationid').val(serviceOrder[0].location);
          jQuery('#customerdeptid').val(serviceOrder[0].department);
          jQuery('#customeronviewlocationname').text(serviceOrder[0].locationtext);
          jQuery('#customeronviewdepartmentname').text(serviceOrder[0].departmenttext);
          jQuery('#custpage_order_completed').html('<option selected>' + serviceOrder[0].workorderstatustext + '</option>');
          // jQuery('#search_customer_text').val(serviceOrder[0].entitytext);
          jQuery('#custpage_open_order_docnumber').text('#' + serviceOrder[0].tranid);
          jQuery('#custpage_open_order_docnumber').attr('data-recid', serviceOrder[0].sointernalid);
			if(serviceOrder[0].pointernalid){
				var potext = serviceOrder[0].potranid;
				console.log('potext',potext);
				potext = potext.split('Purchase Order ')[1];
				jQuery('#custpage_parts_requistion').text(potext );
				jQuery('#custpage_parts_requistion').attr('data-poid', serviceOrder[0].pointernalid);
			}
		  
          var vehcileBox = createTable(serviceOrder);
          jQuery('#custpage_cust_veh_details').html(vehcileBox);
          jQuery('#custpage_new').show();
          jQuery('#custpage_edit').show();
          jQuery('#custpage_save').hide();
          jQuery('#custpage_open_order_docnumer_main').show();
          jQuery('#custpage_parts_requistion_main').show();
          jQuery('#custpage_sublet_po_main').show();

          var Authorizationstatusobj = serviceOrder[4];
          var jobssections = _.groupBy(serviceOrder[2], 'name');
          console.log('jobssections', jobssections);
          var jobssectionsKeys = Object.keys(jobssections);
          var techsListArr = serviceOrder[3];
          var seactions = '';


          //SET SHOPSUPLIES AND CORE CHARGES
          var itemdatas = serviceOrder[1];
          var otherchargessections = _.groupBy(itemdatas, 'invtype');
          var keys = Object.keys(otherchargessections);
          var corechargesamounttoapply = 0;
          var shosuppliesamounttoapply = 0;
          debugger;
          for (var l = 0; l < keys.length; l++) {
            if (keys[l] == 9) {
              var corech = otherchargessections[keys[l]];
              for (var m = 0; m < corech.length; m++) {
                corechargesamounttoapply = corechargesamounttoapply + (corech[m].amount * 1);
              }
            }
            if (keys[l] == 19) {
              var shopss = otherchargessections[keys[l]];
              for (var n = 0; n < shopss.length; n++) {
                shosuppliesamounttoapply = shosuppliesamounttoapply + (shopss[n].amount * 1);
              }
            }
          }
          jQuery('#custpage_total_shop_supply').text('$' + (shosuppliesamounttoapply));
          jQuery('#custpage_total_core_charges').text('$' + (corechargesamounttoapply));
          //SET SHOPSUPLIES AND CORE CHARGES
          debugger;
          for (var i = 0; i < jobssectionsKeys.length; i++) {
            var jobs = jobssections[jobssectionsKeys[i]];
            var itemsArr = serviceOrder[1];
            var empIds = [jobssectionsKeys[i]];
            var filteredArray = itemsArr.filter(function (itm) {
              return empIds.indexOf(itm.joblinename) > -1;
            });
            for (let k = 0; k < filteredArray.length; k++) {
              for (let j = 0; j < jobs.length; j++) {
                if (filteredArray[k].jobuniqueid == jobs[j].jobuniqueid) {
                  filteredArray[k].statusID = jobs[j].statusID;
                  filteredArray[k].statusName = jobs[j].statusName;
                  filteredArray[k].jobinternalid = jobs[j].internalid;
                  filteredArray[k].technician = jobs[j].technician;
                  filteredArray[k].goalhours = jobs[j].goalhours;
                  filteredArray[k].cause = jobs[j].cause;
                  filteredArray[k].complaint = jobs[j].complaint;
                  filteredArray[k].correction = jobs[j].correction;
                  filteredArray[k].name = jobs[j].name;
                }
              }
            }
            if (Authorizationstatusobj.length) {
              for (var a = 0; a < Authorizationstatusobj.length; a++) {
                if (jobssectionsKeys[i] == Authorizationstatusobj[a].jobname) {
                  if (Authorizationstatusobj[a].authstatus == 1) {
                    seactions += createSection((i + 1), '', filteredArray, jobs, techsListArr, '#c7f6c7', 'Authorized') //[i]
                  } else if (Authorizationstatusobj[a].authstatus == 2) {
                    seactions += createSection((i + 1), '', filteredArray, jobs, techsListArr, '#eeb8b8', 'Declined') //[i]
                  } else {
                    seactions += createSection((i + 1), '', filteredArray, jobs, techsListArr, '#d7d7d7', 'Not Authorized') //[i]
                  }

                }

              }
            } else {
              seactions += createSection((i + 1), '', filteredArray, jobs, techsListArr, '#d7d7d7', 'Not Authorized')
            }


          }

          console.log('filteredArray-->', filteredArray);
          jQuery('#sections-container').html(seactions);
          tagOpenSidePanel();
          jQuery('.operationcontrols').hide();
          //afterVehicleSelectEvent();
          calculateLineAndHeader();
        });

      $(document).on('change', '[id$="-field3"],[id$="-field4"],[id$="-field6"]', function () {
        calculateLineAndHeader();
      });

    }
    jQuery(document).on('click', '#custpage_parts_requistion', function () {
      var soid = jQuery('#custpage_open_order_docnumber').attr('data-recid');
      var poid = jQuery('#custpage_parts_requistion').attr('data-poid');
	  if(poid){
		 var url = 'https://8760954.app.netsuite.com/app/accounting/transactions/purchord.nl?id='+poid+'&whence='; 
		 //window.location.href=url;
		 window.open(url,'_blank')
	  }
      else if (soid) {
        var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=562&deploy=1&custparam_ro_id=' + soid + '&fromservice=T&ifrmcntnr=T';
        let params = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1100,height=370,left=550,top=300,';
        window.open(url, "Purchase Order", params);

      }
    });

    jQuery(document).on('click', '#custpage_sublet_po', function () {
      var soid = jQuery('#custpage_open_order_docnumber').attr('data-recid');
      if (soid) {

        var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=269&deploy=1&compid=8760954&custparam_job=&custparam_reqid=' + soid + '&custparam_param=2&custparam_sw=1&ifrmcntnr=T';
        let params = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=370,left=550,top=300,';
        window.open(url, "Sublet Purchase Order", params);

      }
    });

    /* $('#ios-toggle').change(function() {
    	var linenumber = jQuery('#custpage_main_line_id').val();
    	if($(this).is(":checked")) {
    		jQuery('#line-'+linenumber+'-inc_job').val(1);  
    	}
    	        
    });
    $('#ios-toggle_1').change(function() {
    	var linenumber = jQuery('#custpage_main_line_id').val();
    	if($(this).is(":checked")) {
    		jQuery('#line-'+linenumber+'-inc_job').val(1);  
    	}       
    });$('#ios-toggle_2').change(function() {
    	var linenumber = jQuery('#custpage_main_line_id').val();
    	if($(this).is(":checked")) {
    		jQuery('#line-'+linenumber+'-inc_job').val(1);   //job
    	}else{
    		jQuery('#line-'+linenumber+'-inc_job').val(0);
    	} 
    });$('#ios-toggle_3').change(function() {
    	var linenumber = jQuery('#custpage_main_line_id').val();
    	if($(this).is(":checked")) {
    		jQuery('#line-'+linenumber+'-inc_job').val(1);   //include job
    	}       
    });$('#ios-toggle_4').change(function() {
    	var linenumber = jQuery('#custpage_main_line_id').val();
    	if($(this).is(":checked")) {
    		jQuery('#line-'+linenumber+'-inc_job').val(1);  //include price
    	}        
    });$('#ios-toggle_5').change(function() {
    	var linenumber = jQuery('#custpage_main_line_id').val();
    	if($(this).is(":checked")) {
    		jQuery('#line-'+linenumber+'-inc_job').val(1);  //include qty
    	}      
    });$('#ios-toggle_6').change(function() {
    	var linenumber = jQuery('#custpage_main_line_id').val();
    	if($(this).is(":checked")) {
    		jQuery('#line-'+linenumber+'-inc_job').val(1);  //include msg
    	}       
    });$('#ios-toggle_7').change(function() {
    	var linenumber = jQuery('#custpage_main_line_id').val();
    	if($(this).is(":checked")) {
    		jQuery('#line-'+linenumber+'-inc_job').val(1);  //include auth History
    	}     
    });$('#ios-toggle_8').change(function() {
    	var linenumber = jQuery('#custpage_main_line_id').val();
    	if($(this).is(":checked")) {
    		jQuery('#line-'+linenumber+'-inc_job').val(1);  //include Appointments
    	}       
    }); */
  }

  if (scriptID == 1743) {
    jQuery(document).ready(function (event) {
      var customer = getUrlParameter("cust");
      jQuery('#customerdata').val(customer).change();
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 16);
      jQuery('#datetime').val(formattedDate);
    });
  }

  jQuery('#custpage_new').click(function () {
    var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1704&deploy=1&whence=';
    window.location.href = url;
  });

  jQuery('#email-authorize').change(function () {
    var soid = getUrlParameter("soid");
    var vin = jQuery("#vinmaster").attr("data-id");
    var customer = jQuery("#customerdata").val();
    var customername = jQuery("#customerdata").text();
    let params = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=300,height=370,left=550,top=300,';
    window.open("https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1748&deploy=1&vin=" + vin + "&customer=" + customer + "&customername=" + customername + "&soid=" + soid, "Email Authorization", params);
  });
  $('[id^="custpage_a_close_vmechanic_"]').on('click', function () {

    var techIconId = this.id.split("custpage_a_close_mechanic_")[1];
    var popupId = "custpage_tech_popup_" + techIconId;

    var currentTooltip = document.getElementById(popupId);

    currentTooltip.style.display = 'none';
    currentTooltip.style.opacity = 0;
    document.querySelector('.tooltip-overlay').style.display = 'none';

  });


  $(document).on('click', '[id^="custpage_a_apply_vmechanic_"]', function () {

    var techIconId = this.id.split("custpage_a_apply_vmechanic_")[1];
    var popupId = "custpage_tech_popup_" + techIconId;
    var technician = jQuery('#fieldtech-' + techIconId).val();
    var currentTooltip = document.getElementById(popupId);
    jQuery('#section-' + techIconId + ' .lines-container .line').each(function () {
      var _id = jQuery(this).attr('id');
      var _lineType = jQuery(this).find('#' + _id + '-field1').val()
      if (_lineType == 3) {
        jQuery(this).find('#' + _id + '-field9').val(technician);
      }
    })
    currentTooltip.style.display = 'none';
    currentTooltip.style.opacity = 0;
    document.querySelector('.tooltip-overlay').style.display = 'none';

  });

});

function createTable(serviceOrder) {
  var lastservicedate = 0,
    email = '',
    mobilephone = '';
  var custvehiDetails = '';
  custvehiDetails += "    <table class='tooltip-table' style='margin-top: 5px;'> " +
    "      <tbody> " +
    "        <tr> " +
    "          <td class='backgroupColorADVS' style='width: 10%;'>Name</td> " +
    "          <td style='width: 30%;'>" + serviceOrder[0].entitytext + "</td> " +
    "          <td class='backgroupColorADVS' style='width: 10%;'>Make</td> " +
    "          <td style='width: 20%;'>" + serviceOrder[0].brandtext + "</td> " +
    "          <td class='backgroupColorADVS' style='width: 10%;'>Last Service</td> " +
    "          <td style='width: 30%;'>" + lastservicedate + "</td> " +
    "        </tr> " +
    "        <tr> " +
    "          <td class='backgroupColorADVS'>Email</td> " +
    "          <td>" + email + "</td> " +
    "          <td class='backgroupColorADVS'>Model</td> " +
    "          <td>" + serviceOrder[0].modeltext + "</td> " +
    "          <td class='backgroupColorADVS'>Equipment unit #</td> " +
    "          <td>" + serviceOrder[0].modeltext + "</td> " +
    "        </tr> " +
    "        <tr> " +
    "          <td class='backgroupColorADVS'>Phone</td> " +
    "          <td>" + serviceOrder[0].phone + "</td> " +
    "          <td class='backgroupColorADVS'>Model Year</td> " +
    "          <td>" + serviceOrder[0].modelyeartext + "</td> " +
    "          <td class='backgroupColorADVS'>Mileage</td> " +
    "          <td>" + serviceOrder[0].mileage + "</td> " +
    "        </tr> " +


    "      </tbody> " +
    "    </table> ";
  return custvehiDetails;
}
var corechargesamount = 0;

function createSection(seccount, jobname, rowdata, jobsinfo, techsListArr, bgcolor, authostatus) {
  var parts = 0;
  var labor = 0;
  var sublet = 0;
  var total = 0;
  var sectionHtml = '';
  console.log('rowdata', rowdata);
  //var technicaisn = jobsinfo.technician;
  //var techdata = JSON.parse(jQuery('#technicians-list').text())
  sectionHtml += ` <div class="section" id="section-${seccount}">  
                      
                                    <div class="section-header sectionheaderFontHeight" style="background-color: ${bgcolor}; font-weight: bold;">  
                    <span style="margin-left: 12px;">  
                    <i class="fa fa-chevron-up toggle-section"></i>  
                    </span>                      
                                        <input type="text" value="${jobsinfo[0].name}"  class="section-title sidepanelfontClass" id="job_title_${seccount}" name="job_title_${seccount}" style="margin-right:auto; padding:0px 25px;border: none !important;background: none !important;">
                                        `;
  //for(var i=0;i<technicaisn.length;i++){
  //sectionHtml+= `		<span style="font-size:15px;color:green;">${technicaisn[i].technicianName}</span>`;
  //}
  //sectionHtml+= `		<span style="font-size:15px;color:green;">${jobsinfo.statusName}</span>`;
  sectionHtml += `     <span style="margin-right: 35px; font-weight: bolder;display: flex;">
                                        <i class="fa fa-usd sidepanelfontClass" style="color:black; margin-top: 2px;"></i> 
                                        <div class="sidepanelfontClass" id="custpage_job_total_${seccount}" style="margin-left: 10px;">0</div> </span> 
                                          
                                        <span class="sidepanelfontClass" id="authorizestatus${seccount}"><i class="fa fa-check-circle " style="color:gray;"></i> ${authostatus} </span>  <span class="sidepanelfontClass"></span>  </div>  
                                        <div class="section-content table-sorter-wrapper col-lg-12 table-responsivetable-sorter-wrapper table-responsive" id="div_content_id_${seccount}">  
                                       <table class="table" style="width: 100%;">  
                                       
                                            <thead>  
                                                <tr style="border-left: 10px solid transparent;">  
                                                    <th class="mandatory thStyle">Type</th>  
                                                    <th class="thStyle">Item</th>  
                                                    <th class="mandatory thStyle">Quantity</th>  
                                                    <th class="mandatory thStyle">Goal Hours</th>  
                                                    <th class="thStyle">Rate</th>  
                                                    <th class="mandatory thStyle">Amount</th>  
                                                    <th class="thStyle">Discount</th>
                                                    <th class="thStyle">Tax</th>  
                                                    <th class="thStyle">Total</th>  
                                                    <th class="thStyle">Technician</th>  
                                                    <th class="thStyle">Status</th>  
                                                 
                                                    <th class="thStyle">Actions</th>
                                                    <th class="thStyle">View</th>  
                                                </tr>  
                                            </thead>  
                                            <tbody class="lines-container">    `;
  var labcorrection = ''
  var labcomplain = ''
  for (var i = 0; i < rowdata.length; i++) {
    if (rowdata[i].invtype != 19) {
      sectionHtml += createLine(seccount, rowdata[i], techsListArr); //,jobsinfo.internalid
      if (rowdata[i].invtype == "2") {
        parts = parts + (rowdata[i].amount * 1);
      } else if (rowdata[i].invtype == "3") {
        labor = labor + (rowdata[i].amount * 1);
      } else if (rowdata[i].invtype == "4") {
        sublet = sublet + (rowdata[i].amount * 1);
      }

    } else if (rowdata[i].invtype == 19) {
      //	jQuery('#custpage_total_shop_supply').text('$'(rowdata[i].amount*1));
    } else if (rowdata[i].invtype == 9) {
      corechargesamount = corechargesamount + (rowdata[i].amount * 1);
      //	jQuery('#custpage_total_core_charges').text('$'(corechargesamount));
    }

  }
  //if(rowdata[0].complaint){
  //	labcomplain = '';rowdata[0].complaint;
  //}
  //if(rowdata[0].correction){
  //	labcorrection = rowdata[0].correction;
  //}

  sectionHtml += ` </tbody>   
                                        </table>  
                                
                              
                                <div style="display: flex; padding: 5px; margin-top: 10px;" class="complaincefields">
                                <textarea style=" margin-right: 13px; width: 32%;" class="form-control tooltip-table textAreaPadding" id="custpage_complain_${seccount}" rows="2" placeholder="Complain"></textarea>
                                <textarea style=" margin-right: 13px;  width: 32%;display:none;" class="form-control tooltip-table textAreaPadding" id="custpage_cause_${seccount}" rows="2" placeholder="Cause"></textarea>
                                <textarea style=" width: 32%;" class="form-control tooltip-table textAreaPadding" id="custpage_correction_${seccount}" rows="2" placeholder="Correction"></textarea>
                                </div>
                                <br>
								<div id='techassigndivsection-${seccount}'> 
								 </div>
                                 <div style="display: flex; border-top: 1px solid #ebedf2;" class="operationcontrols">
                                
								<div class="badge bg-dark " style="display: flex; margin-left: 30px; font-weight:bold;" =""="">           
                                     <div class="badge bg-dark">               
                                     <span id="add-line" value="2" style="margin: 0px 0px 0px 0px;" class="add-line sidepanelfontClass">+ Part</span> 
                                     </div>
                                     </div>
                                     
                                     <div class="badge bg-dark " style="display: flex; margin-left: 30px; font-weight:bold;" =""="">           
                                     <div class="badge bg-dark">               
                                     <span id="add-line-3" value="3" style="margin: 0px 0px 0px 0px;" class="add-line sidepanelfontClass">+ labor</span> 
                                     </div>
                                     </div>
                                     
                                     <div class="badge bg-dark " style="display: flex; margin-left: 30px; font-weight:bold;" =""="">           
                                     <div class="badge bg-dark">               
                                     <span id="add-line-4" value="4" style="margin: 0px 0px 0px 0px;" class="add-line sidepanelfontClass">+ Sublet</span> 
                                     </div>
                                     </div>   
									 
										<i class=\"fa fa-plus add-line iconFontSize\" style='margin-left:30px;color:green; margin-top:15px;'></i>
										
										<i class=\"fa fa-trash delete-section iconFontSize\" style='color:red; margin-left:30px; margin-top: 15px;'></i>
										
									<span class="fa-stack fa-2x add-multiline" style="margin-left: 50px; cursor: pointer;" id=\"custpage_a_add_multy_${seccount}\">
									<i class="fas fa-plus fa-stack-1x iconFontSize" style="margin-top: -4px;margin-left: 13px;color: gray;"></i>
									<i class="fas fa-plus fa-stack-1x iconFontSize"></i>
									</span>
										
										
									<span class="fa-stack fa-2x delete-multiline" style="margin-left: 50px; cursor: pointer;" id=\"custpage_a_delete_multy_${seccount}\">
									<i class="fas fa-trash fa-stack-1x iconFontSize" style="margin-top: -4px;margin-left: 13px;color: red;"></i>
									<i class="fas fa-trash fa-stack-1x iconFontSize" style="color: #ed835c;"></i>
									</span>
									
									<div style="width: 150px; margin-top: 10px;" >
									<i class="fa-solid fa-screwdriver-wrench add-mechanic iconFontSize" id='custpage_tech_icon_${seccount}' style='color:black; margin-left:60px; cursor: pointer;'></i>
									<div id="custpage_tech_name_${seccount}" style="font-weight: bold; text-align: center;"></div>
									</div>
                            
                            </div>
                                    <div class='tooltip' id='custpage_tech_popup_${seccount}' style="height: 350px;"> 
                            
                            <div style="font-size: 17px;font-weight: bold;color: cornflowerblue;">Assigne Mechanic</div>
                                                        
                               <button type='button' class='btn btn-inverse-dark btn-fw' id='custpage_a_apply_vmechanic_${seccount}' style="margin-top: -20px; margin-left: 200px;">Apply</button>
                               <button type='button' class='btn btn-inverse-dark btn-fw' id='custpage_a_close_vmechanic_${seccount}' style="margin-top: -20px; margin-left: 26px;">Close</button>
                                                     
                            <br/>
                             <div class="dropdown-container">
                             <input type="hidden" id='custpage_mechanic_id_${seccount}'/>`;
  // <input type="text" class="dropdown-input" placeholder="Select Mechanic..." style='padding: 10px; width: 250px; margin-top: 27px;margin-left: 30px;' id='custpage_search_mechanic_${sectionCount}'>
  sectionHtml += `  <div class="dropdown-list1">`;


  sectionHtml += `     <select id=\"fieldtech-${seccount}\" class='inputStyle inputstyleWidth' style="padding: 10px  !important; width: -webkit-fill-available !important; border:none !important; background:none !important;"> `;
  sectionHtml += `<option value='' >Choose Technician</option>`;
  for (var i = 0; i < techsListArr.length; i++) {
    sectionHtml += `<option value='${techsListArr[i].id}' >${techsListArr[i].name}</option>`;
  }
  sectionHtml += `</select>
                                <!-- List items will be populated by JavaScript -->
								
                            </div>
                        </div>                                                        
                            </div>                       
                            <input type="hidden" id="custpage_tech_id_1">                        
                                </div>                                
                                </div>`;
  total = total + (parts * 1) + (labor * 1) + (sublet * 1);
  jQuery('#custpage_total_patrs_sum').text('$' + parts);
  jQuery('#custpage_total_lab_sum').text('$' + labor);
  jQuery('#custpage_total_sub_sum').text('$' + sublet);
  jQuery('#custpage_total_sub_total').text('$' + total);
  //calculateLineAndHeader();
  return sectionHtml;
}

function createLine(section, dataToSet, techsListArr) { //jobinternalid

  console.log('dataToSet', dataToSet);
  //Create job line
  var invType_L = "",
    itemNumber_L = "",
    Quantity_L = "",
    Rate_L = "",
    Amount_L = "",
    Discount_L = "",
    Tax_L = "",
    Total_L = "",
    itemId_L = "",
	itemAvail_L =0;

  var laborSelect = '',
    partSelect = '',
    subletSelect = '',
    coreSelect = '';
  var disabledattr = '';


  if (dataToSet != undefined && dataToSet != "" && dataToSet != "undefined" && dataToSet != "null" && dataToSet != null) {
    dataToSet = dataToSet;

    invType_L = dataToSet.invtype,
      itemNumber_L = dataToSet.itemName,
      Quantity_L = dataToSet.quantity,
      Rate_L = dataToSet.rate,
      Amount_L = dataToSet.amount, 
      Discount_L = 0,
      Tax_L = document.getElementById("custpage_job_tax_head").value,
      Total_L = dataToSet.amount,
      itemId_L = dataToSet.item,
	  itemAvail_L = dataToSet.backordered;
    var _jobinternalid = dataToSet.jobinternalid;
    var _jobuniqueid = dataToSet.jobuniqueid;
    var _goalhours = dataToSet.goalhours || 0;
    var statusName = dataToSet.statusName || '';
    var technician = dataToSet.technician || '';
    if (invType_L == 3) {
      var techname = technician[0].technicianName;
    } else {
      var techname = '';
    }

    if (invType_L == 2) {
      partSelect = 'selected';
      disabledattr = 'disabled';
    } else if (invType_L == 3) {
      laborSelect = 'selected';
      disabledattr = '';
    } else if (invType_L == 4) {
      subletSelect = 'selected';
      disabledattr = 'disabled';
    } else if (invType_L == 9) {
      coreSelect = 'selected';
      disabledattr = 'disabled';
    }
  }

  _rlineCount = _rlineCount + 1;
  //alert('_rlineCount'+_rlineCount);
  // lineCount++;
  const lineId = `line-${_rlineCount}`;
  // var techdata = JSON.parse(jQuery('#technicians-list').text())
  var stylebackcolor = "";
  if(itemAvail_L !=0 && itemAvail_L !=""){stylebackcolor = 'background-color:red'};
  var lineHtml = `  
                                <tr class=\"line\" id=\"${lineId}\" data-jobintid = \"${_jobinternalid}\" data-jobuniid = \"${_jobuniqueid}\" style="border-left: 10px solid transparent;${stylebackcolor}">  
                                     
                
                                <td style='border:none !important; background:none !important;'>
                                <select id=\"${lineId}-field1\" class='inputStyle inputstyleWidth' style="padding: 10px  !important; width: -webkit-fill-available !important; border:none !important; background:none !important;"> 
                <option value='3' ${laborSelect}>Labor</option>
                <option value='2' ${partSelect}>Parts</option>               
                <option value='4' ${subletSelect}>Sublet</option> 
				<option value='9' ${coreSelect}>Corecharge</option> 
                </select></td>  
                                <td><input type=\"text\" id=\"${lineId}-field2\" class=\"autocomplete inputStyle\" style='border:none !important; background:none !important; ' value="${itemNumber_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field3\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' value="${Quantity_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field10\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' value="${_goalhours}"></td>  
                               <td><input type=\"text\" id=\"${lineId}-field4\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' value="${Rate_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field5\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' disabled value="${Amount_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field6\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' value="${Discount_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field8\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' disabled value="${Tax_L}"></td>
                                <td><input type=\"text\" id=\"${lineId}-field7\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' disabled value="${Total_L}"></td> 
								 <td style='border:none !important; background:none !important;'>
                                <select id=\"${lineId}-field9\" class='inputStyle inputstyleWidth'  ${disabledattr} style="padding: 10px  !important; width: -webkit-fill-available !important; border:none !important; background:none !important;"> `;
  lineHtml += `<option value='' >Technician</option>`;
  for (var i = 0; i < techsListArr.length; i++) {
    if (techsListArr[i].name == techname) {
      lineHtml += `<option value='${techsListArr[i].id}' selected>${techsListArr[i].name}</option>`;
    } else {
      lineHtml += `<option value='${techsListArr[i].id}' >${techsListArr[i].name}</option>`;
    }

  }
  lineHtml += `</select></td>  `;
  if (statusName != '') {
    lineHtml += `  <td><input type=\"text\" id=\"${lineId}-field11\" style='border:none !important; background:none !important; color:green !important;' class='inputStyle inputstyleWidth' disabled value="${statusName}"></td>  `;

  } else {
    lineHtml += `  <td><input type=\"text\" id=\"${lineId}-field11\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' disabled value="${statusName}"></td>  `;
  }

  lineHtml += `<td style="width: 120px;"> 
                                    <span class=\"line-actions\">  
                                         <i class=\"fa fa-edit edit-line iconFontSize\" style='color:gray; margin-right:10px;'></i>  
                                        <i class=\"fa fa-check add-line-btn iconFontSize\" style='color:green; margin-right:10px;'></i>  
                                        <i class=\"fa fa-trash delete-line iconFontSize\" style='color:red;'></i>  
                                    </span>  
                                 </td> 
                                 <td><i class="fa fa-eye openSidepannel iconFontSize" id="${lineId}-openslide"></i></td>
                                 <input type="hidden" id="${lineId}-item_id" data-lineid="${lineId}" data-jobid="${_jobinternalid}" data-id="item" class="printf" value="${itemId_L}"/>
                                 <input type="hidden" id="${lineId}-job_id" value="${section}"/>
                                 <input type="hidden" value="" id="${lineId}-margin"/>
                                 <input type="hidden" value="" id="${lineId}-markup"/>
                                 <input type="hidden" value="" id="${lineId}-cost"/>
                                 <input type="hidden" value="" class="printf" data-lineid="${lineId}" data-jobid="${_jobinternalid}" data-id="partprice" id="${lineId}-disp_price"/>
                                 <input type="hidden" value="" class="printf" data-lineid="${lineId}" data-jobid="${_jobinternalid}" data-id="partnum" id="${lineId}-disp_part_num"/>
                                 <input type="hidden" value="" class="printf" data-lineid="${lineId}" data-jobid="${_jobinternalid}" data-id="partdesc" id="${lineId}-disp_desc"/>


                                <input type="hidden" class="printf" data-lineid="${lineId}" data-jobid="${_jobinternalid}" data-id="msg" value="" 					id="${lineId}-inc_msg"/> 
                                <input type="hidden" class="printf" data-lineid="${lineId}" data-jobid="${_jobinternalid}" data-id="auth" value="" 					id="${lineId}-inc_auth"/>
                                <input type="hidden" class="printf" data-lineid="${lineId}" data-jobid="${_jobinternalid}" data-id="apnt" value="" 					id="${lineId}-inc_appoint"/>
                                <input type="hidden" class="printf" data-lineid="${lineId}" data-jobid="${_jobinternalid}" data-id="job" value="" 					id="${lineId}-inc_job"/>
                                <input type="hidden" class="printf" data-lineid="${lineId}" data-jobid="${_jobinternalid}" data-id="qty" value="" 					id="${lineId}-inc_qty"/>
                                <input type="hidden" class="printf" data-lineid="${lineId}" data-jobid="${_jobinternalid}" data-id="price" value="" 					id="${lineId}-inc_price"/>   
								<input type="hidden" class="printf"  value="" data-lineid="${lineId}"  data-jobid="${_jobinternalid}" data-id="linetype" id="${lineId}-inc_linetype"/>   
								<input type="hidden"   value="${_jobuniqueid}" data-lineid="${lineId}"  data-jobid="${_jobinternalid}" data-id="jobcode" id="${lineId}-jobcode"/>   
								

                                </tr>  
                            `;

  return lineHtml;
}

function tagOpenSidePanel() {
  $('.openSidepannel').each(function () {
    const button = $(this);
    if (!button.data('event-attached')) {
      button.on('click', function () {
        $('#right-sidebar').addClass('open');
        var lineid = this.id.split("-")[1];

        var invType = document.getElementById("line-" + lineid + "-field1").value;
        var itemNumber = document.getElementById("line-" + lineid + "-field2").value;
        var line_quan = document.getElementById("line-" + lineid + "-field3").value;
        var linePrice = document.getElementById("line-" + lineid + "-field4").value;
        var marginValue = document.getElementById("line-" + lineid + "-margin").value;
        var markupValue = document.getElementById("line-" + lineid + "-markup").value;
        var costValue = document.getElementById("line-" + lineid + "-cost").value;
        var disp_price = document.getElementById("line-" + lineid + "-disp_price").value;
        var disp_part_num = document.getElementById("line-" + lineid + "-disp_part_num").value;
        var disp_desc = document.getElementById("line-" + lineid + "-disp_desc").value;

        var inc_msg = document.getElementById("line-" + lineid + "-inc_msg").value;
        var inc_auth = document.getElementById("line-" + lineid + "-inc_auth").value;
        var inc_appoint = document.getElementById("line-" + lineid + "-inc_appoint").value;
        var inc_job = document.getElementById("line-" + lineid + "-inc_job").value;
        var inc_qty = document.getElementById("line-" + lineid + "-inc_qty").value;
        var inc_price = document.getElementById("line-" + lineid + "-inc_price").value;
        var inc_linetpye = document.getElementById("line-" + lineid + "-inc_linetype").value;




        if (disp_part_num == "true") {
          disp_part_num = "checked";
        } else {
          disp_part_num = "";
        }

        if (disp_price == "true") {
          disp_price = "checked";
        } else {
          disp_price = "";
        }

        if (disp_desc == "true") {
          disp_desc = "checked";
        } else {
          disp_desc = "";
        }
        if (inc_msg == "true") {
          inc_msg = "checked";
        } else {
          inc_msg = "";
        }
        if (inc_auth == "true") {
          inc_auth = "checked";
        } else {
          inc_auth = "";
        }
        if (inc_appoint == "true") {
          inc_appoint = "checked";
        } else {
          inc_appoint = "";
        }
        if (inc_job == "true") {
          inc_job = "checked";
        } else {
          inc_job = "";
        }
        if (inc_qty == "true") {
          inc_qty = "checked";
        } else {
          inc_qty = "";
        }
        if (inc_price == "true") {
          inc_price = "checked";
        } else {
          inc_price = "";
        }
        if (inc_linetpye == "true") {
          inc_linetpye = "checked";
        } else {
          inc_linetpye = "";
        }



        var htmlStringToDisplay = "<input type='hidden' id='custpage_main_line_id' value='" + lineid + "'/>" +
          "<input type='hidden' id='custpage_main_line_type' value='" + invType + "'/>";

        if (invType == 2) {

          htmlStringToDisplay += `
                                <h2 class="thStyle" style="text-align: center;">Parts Summary</h2>         
                                <br/>
                                <br/>
                                <h2 class="thStyle" style="text-align: center;">${itemNumber}</h2>
                                
                                                
                                <table class='table' style="width: 90%;">  
                                       
                                            <thead>  
                                                <tr>  
                                                    <th class="thStyle">Cost</th>  
                                                    <th class="thStyle">Avi. Qty</th>  
                                                    <th class="thStyle" >Retail</th>                                                                                                        
                                                </tr>  
                                            </thead>  
                                            <tbody class="lines-container">
                                                <tr class=\"line\" >  
                                                    <td><input type=\"number\" id=\"slider_cost\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px; width: 100px !important;'  value='${costValue}'></td>
                                                    <td><input type=\"number\" id=\"slider_available\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px; width: 100px !important;' disabled value='${linePrice}'></td>
                                                    <td><input type=\"number\" id=\"slider_price\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px; width: 100px !important;'  value='${linePrice}'></td>
                                                </tr>
                                        </tbody>
                                </table>
                                
                                <div>
                                
                                <table class='table' style="width: 90%;">
                                <tr>
                                <th class="thStyle" style="width: 50%;">Mark Up %</th>
                                <th class="thStyle" style="width: 50%;"><input type=\"number\" id=\"slider_markup\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px;  width: 100px !important;'  value='${markupValue}'></th>
                                </tr>
                                </table>
                                
                                <table class='table' style="width: 90%;">
                                <tr>
                                <th class="thStyle" style="width: 50%;">Margin %</th>
                                <th class="thStyle" style="width: 50%;"><input type=\"number\" id=\"slider_margin\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px; width: 100px !important;'  value='${marginValue}'></th>
                                </tr>
                                </table>
                                
                                 <table class='table' style="width: 90%;">
                                <tr>
                                <th class="thStyle" style="width: 50%;">Display Price & Qty on estimate</th>
                                <th class="thStyle" style="width: 50%;">
                                <div class="switch-container">
                                    <input type="checkbox" id="ios-toggle" class="ios-checkbox" ${disp_price}>
                                    <label for="ios-toggle" class="ios-label"></label>
                                </div>
                                </th>
                                </tr>
                                
                                <tr>
                                <th class="thStyle" style="width: 50%;">Display Part Number on estimate</th>
                                <th class="thStyle" style="width: 50%;">
                                <div class="switch-container">
                                    <input type="checkbox" id="ios-toggle_1" class="ios-checkbox" ${disp_part_num}>
                                    <label for="ios-toggle_1" class="ios-label"></label>
                                </div>
                                </th>
                                </tr>
                                
                                <tr>
                                <th class="thStyle" style="width: 50%;">Display Description on estimate</th>
                                <th class="thStyle" style="width: 50%;">
                                <div class="switch-container">
                                    <input type="checkbox" id="ios-toggle_2" class="ios-checkbox" ${disp_desc}>
                                    <label for="ios-toggle_2" class="ios-label"></label>
                                </div>
                                </th>
                                </tr>                                
                                </table>
                                </div>
                                            `;
        } else if (invType == 3) {
          htmlStringToDisplay += `
                                <h2 class="thStyle" style="text-align: center; font-size: 20px !important;">Labor Summary</h2>   
                                <br/>
                                <br/>
                                <h2 class="thStyle" style="text-align: center;">${itemNumber}</h2>                            
                                <table class='table' style="width: 90%;">  
                                       
                                            <thead>  
                                                <tr>  
                                                    <th class="thStyle">Hours</th>  
                                                    <th class="thStyle">Rate</th>  
                                                    <th class="thStyle" >Total Cost</th>                                                                                                        
                                                </tr>  
                                            </thead>  
                                            <tbody class="lines-container">
                                                <tr class=\"line\" >  
                                                    <td><input type=\"number\" id=\"slider_quant\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px; width: 100px !important;'  disabled value='${line_quan}'></td>
                                                    <td><input type=\"number\" id=\"slider_price\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px; width: 100px !important;' disabled value='${linePrice}'></td>
                                                    <td><input type=\"number\" id=\"slider_cost\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px; width: 100px !important;'  value='${costValue}'></td>
                                                </tr>
                                        </tbody>
                                </table>
                                
                                <div>
                                
                                <table class='table' style="width: 90%;">
                                <tr>
                                <th class="thStyle" style="width: 50%;">Mark Up %</th>
                                <th class="thStyle" style="width: 50%;"><input type=\"number\" id=\"slider_markup\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px;  width: 100px !important;'  value='${markupValue}'></th>
                                </tr>
                                </table>
                                
                                <table class='table' style="width: 90%;">
                                <tr>
                                <th class="thStyle" style="width: 50%;">Margin %</th>
                                <th class="thStyle" style="width: 50%;"><input type=\"number\" id=\"slider_margin\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px; width: 100px !important;'  value='${marginValue}'></th>
                                </tr>
                                </table>
                                
                                 <table class='table' style="width: 90%;">
                                
                                <tr>
                                <th class="thStyle" style="width: 50%;">Display Hours on estimate</th>
                                <th class="thStyle" style="width: 50%;">
                                <div class="switch-container">
                                    <input type="checkbox" id="ios-toggle" class="ios-checkbox" ${disp_price}>
                                    <label for="ios-toggle" class="ios-label"></label>
                                </div>
                                </th>
                                </tr>
                                
                                <tr>
                                <th class="thStyle" style="width: 50%;">Display Notes on estimate</th>
                                <th class="thStyle" style="width: 50%;">
                                <div class="switch-container">
                                    <input type="checkbox" id="ios-toggle_1" class="ios-checkbox" ${disp_part_num}>
                                    <label for="ios-toggle_1" class="ios-label"></label>
                                </div>
                                </th>
                                </tr>   
                                
                                 
                                <tr>
                                <th class="thStyle" style="width: 50%;">Include Job</th>
                                <th class="thStyle" style="width: 50%;">
                                <div class="switch-container">
                                    <input type="checkbox" id="ios-toggle_l2" class="ios-checkbox" ${inc_job} >
                                    <label for="ios-toggle_l2" class="ios-label"></label>
                                </div>
                                </th>
                                </tr>

                                
                                <tr>
                                <th class="thStyle" style="width: 50%;">Include Price</th>
                                <th class="thStyle" style="width: 50%;">
                                <div class="switch-container">
                                    <input type="checkbox" id="ios-toggle_l3" class="ios-checkbox"  ${inc_price}>
                                    <label for="ios-toggle_l3" class="ios-label"></label>
                                </div>
                                </th>
                                </tr>   

                                
                                <tr>
                                <th class="thStyle" style="width: 50%;">Include Quantity</th>
                                <th class="thStyle" style="width: 50%;">
                                <div class="switch-container">
                                    <input type="checkbox" id="ios-toggle_l4" class="ios-checkbox" ${inc_qty}>
                                    <label for="ios-toggle_l4" class="ios-label"></label>
                                </div>
                                </th>
                                </tr>        
                                
                                
                                <tr style="display:none;">
                                <th class="thStyle" style="width: 50%;" >Include Messages</th>
                                <th class="thStyle" style="width: 50%;">
                                <div class="switch-container">
                                    <input type="checkbox" id="ios-toggle_l5" class="ios-checkbox" ${inc_msg} >
                                    <label for="ios-toggle_l5" class="ios-label"></label>
                                </div>
                                </th>
                                </tr>      
                                
                                   
                                <tr>
                                <th class="thStyle" style="width: 50%;">Include Authorization History</th>
                                <th class="thStyle" style="width: 50%;">
                                <div class="switch-container">
                                    <input type="checkbox" id="ios-toggle_l6" class="ios-checkbox" ${inc_auth} >
                                    <label for="ios-toggle_l6" class="ios-label"></label>
                                </div>
                                </th>
                                </tr>    
                                
                                <tr>
                                <th class="thStyle" style="width: 50%;">Include Appointments</th>
                                <th class="thStyle" style="width: 50%;">
                                <div class="switch-container">
                                    <input type="checkbox" id="ios-toggle_l7" class="ios-checkbox" ${inc_appoint} >
                                    <label for="ios-toggle_l7" class="ios-label"></label>
                                </div>
                                </th>
                                </tr>   
                                </table>
                                </div>
                            `;
        } else if (invType == 4) {
          htmlStringToDisplay += `
                                <h2 class="thStyle" style="text-align: center; font-size: 20px !important;">Sublet Summary</h2>   
                                <br/>
                                <br/>
                                <h2 class="thStyle" style="text-align: center;">${itemNumber}</h2>                            
                                <table class='table' style="width: 90%;">  
                                       
                                            <thead>  
                                                <tr>  
                                                    <th class="thStyle">Hours</th>  
                                                    <th class="thStyle">Rate</th>  
                                                    <th class="thStyle" >Total Cost</th>                                                                                                        
                                                </tr>  
                                            </thead>  
                                            <tbody class="lines-container">
                                                <tr class=\"line\" >  
                                                    <td><input type=\"number\" id=\"slider_quant\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px; width: 100px !important;'  disabled value='${line_quan}'></td>
                                                    <td><input type=\"number\" id=\"slider_price\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px; width: 100px !important;' disabled value='${linePrice}'></td>
                                                    <td><input type=\"number\" id=\"slider_cost\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px; width: 100px !important;'  value='${costValue}'></td>
                                                </tr>
                                        </tbody>
                                </table>
                                
                                <div>
                                
                                <table class='table' style="width: 90%;">
                                <tr>
                                <th class="thStyle" style="width: 50%;">Mark Up %</th>
                                <th class="thStyle" style="width: 50%;"><input type=\"number\" id=\"slider_markup\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px;  width: 100px !important;'  value='${markupValue}'></th>
                                </tr>
                                </table>
                                
                                <table class='table' style="width: 90%;">
                                <tr>
                                <th class="thStyle" style="width: 50%;">Margin %</th>
                                <th class="thStyle" style="width: 50%;"><input type=\"number\" id=\"slider_margin\" class=\"inputStyle sliderinput\" style='border-color: cornflowerblue;border-radius: 11px; width: 100px !important;'  value='${marginValue}'></th>
                                </tr>
                                </table>
                                
                                 <table class='table' style="width: 90%;">
                                
                                <tr>
                                <th class="thStyle" style="width: 50%;">Display Price & Qty on estimate</th>
                                <th class="thStyle" style="width: 50%;">
                                <div class="switch-container">
                                    <input type="checkbox" id="ios-toggle" class="ios-checkbox" ${disp_price}>
                                    <label for="ios-toggle" class="ios-label"></label>
                                </div>
                                </th>
                                </tr>
                                </table>
                                </div>
                            `;
        }

        document.getElementById("setting-content_1").innerHTML = htmlStringToDisplay;
        $(document).on('click', '.ios-checkbox', function () {
          debugger;
          var checkboxStatus = document.getElementById(this.id).checked;
          var lineId = document.getElementById("custpage_main_line_id").value;
          var lineType = document.getElementById("custpage_main_line_type").value;

          document.getElementById("line-" + lineId + "-inc_linetype").value = lineType;

          if (this.id == "ios-toggle" && lineType == 2) {
            document.getElementById("line-" + lineId + "-disp_price").value = checkboxStatus;
          } else if (this.id == "ios-toggle_1" && lineType == 2) {
            document.getElementById("line-" + lineId + "-disp_part_num").value = checkboxStatus;
          } else if (this.id == "ios-toggle_2" && lineType == 2) {
            document.getElementById("line-" + lineId + "-disp_desc").value = checkboxStatus;

          } else if (this.id == "ios-toggle_l2") {
            document.getElementById("line-" + lineId + "-inc_job").value = checkboxStatus;
          } else if (this.id == "ios-toggle_l3") {
            document.getElementById("line-" + lineId + "-inc_price").value = checkboxStatus;

          } else if (this.id == "ios-toggle_l4") {
            document.getElementById("line-" + lineId + "-inc_qty").value = checkboxStatus;

          } else if (this.id == "ios-toggle_l5") {
            document.getElementById("line-" + lineId + "-inc_msg").value = checkboxStatus;

          } else if (this.id == "ios-toggle_l6") {
            document.getElementById("line-" + lineId + "-inc_auth").value = checkboxStatus;

          } else if (this.id == "ios-toggle_l7") {
            document.getElementById("line-" + lineId + "-inc_appoint").value = checkboxStatus;

          }



        });

        $(document).on('change', '.sliderinput', function () {

          var fieldData = document.getElementById(this.id).value;

          var lineType = document.getElementById("custpage_main_line_type").value;

          document.getElementById("line-" + lineId + "-inc_linetype").value = lineType;
          var checkboxStatus = document.getElementById(this.id).checked;
          if (lineType == 2) {

            if (this.id == "slider_cost" || this.id == "slider_price") {

              var costValue = document.getElementById("slider_cost").value;
              var priceValue = document.getElementById("slider_price").value;
              var lineId = document.getElementById("custpage_main_line_id").value;

              if (costValue * 1 > 0 && priceValue * 1 > 0) {
                var marginPer = ((priceValue * 1 - costValue * 1) / priceValue * 1) * 100;
                var markUpPer = ((priceValue * 1 - costValue * 1) / costValue * 1) * 100;

                document.getElementById("slider_markup").value = markUpPer.toFixed(2);
                document.getElementById("slider_margin").value = marginPer.toFixed(2);
                document.getElementById("line-" + lineId + "-margin").value = marginPer.toFixed(2);
                document.getElementById("line-" + lineId + "-markup").value = markUpPer.toFixed(2);
                document.getElementById("line-" + lineId + "-field4").value = priceValue;
                document.getElementById("line-" + lineId + "-cost").value = costValue;

              }

              if (this.id == "ios-toggle") {
                document.getElementById("line-" + lineId + "-inc_qty_price").value = checkboxStatus;
              } else if (this.id == "ios-toggle_1") {
                document.getElementById("line-" + lineId + "-inc_partnumber").value = checkboxStatus;
              } else if (this.id == "ios-toggle_2") {
                document.getElementById("line-" + lineId + "-inc_partdesc").value = checkboxStatus;

              }


            }
          } else if (lineType == 3) {

            if (this.id == "slider_cost" || this.id == "slider_price") {

              var costValue = document.getElementById("slider_cost").value;
              var priceValue = document.getElementById("slider_price").value;
              var lineQuan = document.getElementById("slider_quant").value;
              var lineId = document.getElementById("custpage_main_line_id").value;

              if (costValue * 1 > 0 && priceValue * 1 > 0) {

                var CalpriceValue = priceValue * 1 * lineQuan * 1;

                var marginPer = ((CalpriceValue * 1 - costValue * 1) / CalpriceValue * 1) * 100;
                var markUpPer = ((CalpriceValue * 1 - costValue * 1) / costValue * 1) * 100;

                document.getElementById("slider_markup").value = markUpPer.toFixed(2);
                document.getElementById("slider_margin").value = marginPer.toFixed(2);

                document.getElementById("line-" + lineId + "-margin").value = marginPer.toFixed(2);
                document.getElementById("line-" + lineId + "-markup").value = markUpPer.toFixed(2);
                document.getElementById("line-" + lineId + "-cost").value = costValue;

              }

            }
          }

          // slider_available
          // slider_markup
          // slider_margin

        });

      });
      button.data('event-attached', true);
    }
  });
}

function calculateLineAndHeader() {

  var allsectionCollection = $('[id^=section-]');

  var TotalParts = 0,
    TotalLabor = 0,
    TotalSublet = 0,
    TotalTax = 0,
    TotalDiscount = 0;
  var partCost = 0;
  for (var f = 0; f < allsectionCollection.length; f++) {
    var allLinesCillection = $('#' + allsectionCollection[f].id + ' .lines-container .line').map(function () {
      return this.id;
    }).get().filter(function (id) {
      return id.startsWith('line-');
    });

    var headerTotal = 0;

    for (var l = 0; l < allLinesCillection.length; l++) {

      var lineType = document.getElementById('' + allLinesCillection[l] + '-field1').value;
      var lineQuan = document.getElementById('' + allLinesCillection[l] + '-field3').value;
      var lineRate = document.getElementById('' + allLinesCillection[l] + '-field4').value;
      var lineDisc = document.getElementById('' + allLinesCillection[l] + '-field6').value;
      var linetax = document.getElementById('' + allLinesCillection[l] + '-field8').value;
      partCost = document.getElementById('' + allLinesCillection[l] + '-cost').value;

      if (lineQuan > 0) {
        var tempCalc = (lineQuan * 1 * lineRate * 1) - lineDisc * 1;
        document.getElementById('' + allLinesCillection[l] + '-field5').value = lineQuan * 1 * lineRate * 1;

        TotalDiscount = TotalDiscount * 1 + lineDisc * 1;

        if (lineType == 2) {

          TotalParts = TotalParts * 1 + (lineQuan * 1 * lineRate * 1);
          TotalParts = TotalParts.toFixed(2);
        } else if (lineType == 3) {

          TotalLabor = TotalLabor * 1 + (lineQuan * 1 * lineRate * 1);
          TotalLabor = TotalLabor.toFixed(2);
        } else if (lineType == 4) {

          TotalSublet = TotalSublet * 1 + (lineQuan * 1 * lineRate * 1);
          TotalSublet = TotalSublet.toFixed(2);
        }

        if (linetax > 0) {

          TotalTax = TotalTax * 1 + (tempCalc * 1 * linetax * 1) / 100;
          TotalTax = TotalTax.toFixed(2);
          tempCalc = tempCalc * 1 + (tempCalc * 1 * linetax * 1) / 100;

        }

        document.getElementById('' + allLinesCillection[l] + '-field7').value = tempCalc;
        headerTotal = headerTotal * 1 + tempCalc * 1;
        headerTotal = headerTotal.toFixed(2);
      }
    }

    var sectionId = allsectionCollection[f].id.split("section-")[1];

    document.getElementById("custpage_job_total_" + sectionId).innerHTML = headerTotal;

  }

  var HeadDiscount = document.getElementById("custpage_job_disc_head").value;
  var HeadDiscountSym = document.getElementById("custpage_job_disc_head_symbol").innerHTML;

  HeadDiscountSym = HeadDiscountSym.split("" + HeadDiscount);

  if (HeadDiscountSym.length > 1) {
    HeadDiscountSym = HeadDiscountSym[1];
  } else {
    HeadDiscountSym = HeadDiscountSym[0];
  }
  var cost = 'line-2-cost'

  document.getElementById("custpage_total_patrs_sum").innerHTML = "$ " + TotalParts;
  document.getElementById("custpage_total_lab_sum").innerHTML = "$ " + TotalLabor;
  document.getElementById("custpage_total_sub_sum").innerHTML = "$ " + TotalSublet;

  //SURYA FOR PROFITABILITY
  document.getElementById("custpage_part_retail_price").innerHTML = "$ " + TotalParts;
  document.getElementById("custpage_labor_retail_price").innerHTML = "$ " + TotalLabor;
  document.getElementById("custpage_sublet_retail_price").innerHTML = "$ " + TotalSublet;

  document.getElementById("custpage_part_retail_cost").innerHTML = "$ " + partCost;

  var partcost = document.getElementById("custpage_part_retail_cost").innerText;
  var partprice = document.getElementById("custpage_part_retail_price").innerText;
  var laborprice = document.getElementById("custpage_labor_retail_price").innerText;
  var subletprice = document.getElementById("custpage_sublet_retail_price").innerText;

  var partprofit = 0;
  var laborprofit = 0;
  var subletprofit = 0;
  partprofit = (partprice.split(' ')[1] * 1) - (partcost.split(' ')[1] * 1);
  document.getElementById("custpage_part_retail_profit").innerHTML = "$ " + partprofit;
  document.getElementById("custpage_labor_retail_profit").innerHTML = "$ " + TotalLabor;
  document.getElementById("custpage_sublet_retail_profit").innerHTML = "$ " + TotalSublet;

  //SURYA FOR PROFITABILITY

  document.getElementById("custpage_total_sub_tax").innerHTML = "$ " + TotalTax;

  var subtotalAmount = (TotalSublet * 1 + TotalLabor * 1 + TotalParts * 1).toFixed(2);
  subtotalAmount = subtotalAmount * 1;

  document.getElementById("custpage_total_sub_total").innerHTML = "$ " + subtotalAmount;

  if (HeadDiscountSym == "$") {
    TotalDiscount = TotalDiscount * 1 + HeadDiscount * 1;
  } else {

    var tempDiscoCalc = ((subtotalAmount * 1) * (HeadDiscount * 1)) / 100;
    tempDiscoCalc = tempDiscoCalc.toFixed(2);
    tempDiscoCalc = tempDiscoCalc * 1;

    TotalDiscount = TotalDiscount * 1 + tempDiscoCalc * 1;
  }

  var shopSupplyPer = document.getElementById("custpage_job_shop_head").value;
  var shopSupplyglobal = document.getElementById("custpage_total_shop_supply").innerText;

  var shopSupplyAmount = 0;

  if (shopSupplyPer > 0) {
    shopSupplyAmount = (TotalLabor * 1 * shopSupplyPer) / 100;
  } else {
    shopSupplyAmount = 0;
  }

  document.getElementById("custpage_total_sub_discount").innerHTML = "$ " + TotalDiscount.toFixed(2);
  if (shopSupplyglobal != '') {

  } else {
    document.getElementById("custpage_total_shop_supply").innerHTML = "$ " + shopSupplyAmount.toFixed(2);
  }

  document.getElementById("custpage_total_grand").innerHTML = "$ " + (TotalSublet * 1 + TotalLabor * 1 + TotalParts * 1 + TotalTax * 1 + shopSupplyAmount * 1 - TotalDiscount * 1).toFixed(2);

}

function getvihistorydetails(vin) {
  try {
    $.ajax({
      url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
      dataType: 'json',
      type: 'POST',
      data: {
        'vinhistory': vin
      },
      success: function (data) {

        console.log('data', data);
        var datahis = data;
        var tooltipVehicle = '';
        for (var i = 0; i < datahis.length; i++) {
          tooltipVehicle += "<tr><td>" + datahis[i].trandate + "</td><td>" + datahis[i].doc + "</td><td>" + datahis[i].statusref + "</td><td>" + datahis[i].amount + "</td></tr>";
        }
        jQuery('#operationbody').html(tooltipVehicle);
      },
      error: function (xhr, status, error) {
        $('#loader-overlay').hide();
        console.debug('Error fetching autocomplete suggestions:', error);
      }
    });
  } catch (e) {
    log.debug('error', e.toString());
  }
}
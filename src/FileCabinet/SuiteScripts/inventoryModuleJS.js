var globalresultsArray = [];
$(document).ready(function () {
  createSelectBoxes();
  var columns = getInventoryColumns();
  var headerRow = $("#table-header");
  $.each(columns, function (index, col) {
    var th = $("<th>").text(col.name);
    headerRow.append(th);
  });

});

$(document).ready(function () {
  //https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2624&deploy=1
  $.get('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl', {
      script: 'customscript_inventory_search_ss',
      deploy: '1',
      flag: 'inventorysearch'
    })
    .done(function (data) {
      //console.log('data',data);
      var resultsdata = JSON.parse(data);

      globalresultsArray = resultsdata[0].resultsArray;
      console.log('resultsArray', resultsdata[0].resultsArray);
      /*console.log('modelsArray', resultsdata[0].modelsArray)
      console.log('statusesArray', resultsdata[0].statusesArray)
      console.log('vinsArray', resultsdata[0].vinsArray)
      console.log('locationsArray', resultsdata[0].locationsArray) */
      // Example usage:
      //renderTable(resultsdata[0].resultsArray) 
      var tableHTML = generateTableBody(resultsdata[0].resultsArray);
      document.getElementById("table-body").innerHTML = tableHTML;
      colorbackgroundtablerows();
      colortablecells();

    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.error("Error fetching data:", textStatus, errorThrown);
    });
});

function generateTableBody(resultsArray, key, value) {
  if (resultsArray.length === 0) return "<tbody><tr><td colspan='100%'>No Data Available</td></tr></tbody>";

  var tableBody = "<tbody>";

  // Get column sequence from the first result object
  var colids = getInventoryColumns();
  var columns = Object.keys(resultsArray[0]);
   
  // Generate rows dynamically  
  resultsArray.forEach(result => { 
    tableBody += '<tr>';
    colids.forEach(column => {
      let value = column.id ? result[column.id] || '' : '';
      var displayValue = (result[column.id + "_text"] != '' ? result[column.id + "_text"] : result[column.id]) || "";
      var linksobj = dynamiclinks();

      var vinid = result['internalid'];
      var bktId = result['custrecord_advs_bucket_1'];
      var Soft_hold_customer = result['custrecord_advs_customer'];
      var softHoldCus_sales_rep = result['custrecord_advs_vm_soft_hld_sale_rep'];
      var PAYINSP = result['custrecord_advs_payment_inception'];
      var DEPINSP = result['custrecord_advs_deposit_inception'];
      var TTLINSP = result['custrecord_advs_total_inception'];
      var TERMS = result['custrecord_advs_buck_terms1'];
      var sec_2_13 = result['custrecord_advs_payment_2_131'];
      var sec_14_26 = result['custrecord_advs_payment_14_25'];
      var sec_26_37 = result['custrecord_advs_payment_26_37'];
      var sec_38_49 = result['custrecord_advs_payment_38_49'];
      var purOptn = result['custrecord_advs_pur_option'];
      var contTot = result['custrecord_advs_contract_total'];

      if (column.id == 'linkquickdeal') {
        var qurl = linksobj.quickdeal.url;
        qurl += "&param_vin=" + vinid + "&param_buckt=" + bktId + "&custparam_soft_hold_cus=" + Soft_hold_customer + "&custpara_sof_hold_salesrep=" + softHoldCus_sales_rep;
        displayValue = '<a href="' + qurl + '" target="_blank"><img class="i_dashboard_gray" src="/uirefresh/img/dashboard.png" width="25px" height="20px"></a>'
      }
      if (column.id == 'linkcustomerdeposit') {
        displayValue = '<a href="#" onclick=depositcreation(' + Soft_hold_customer + ',' + vinid + ',' + DEPINSP + ',' + PAYINSP + ')><i class="fa fa-bank" style="color:blue;"></i></a>'
      }
      if (column.id == 'linksofthold') {
        // var qurl = linksobj.quickdeal.url;
        displayValue = '<a href="#"  onclick=softholdupdate(' + vinid + ',' + DEPINSP + ',' + PAYINSP + ',' + TTLINSP + ',' +
          TERMS + ',' + (sec_2_13 || 0) + ',' + (sec_14_26 || 0) + ',' +
          (sec_26_37 || 0) + ',' + (sec_38_49 || 0) + ',' + purOptn + ',' +
          contTot + ',' + bktId + ')><i class="fa fa-edit" style="color:blue;"></i></a>'
      }
      if (column.id == 'linkchangestatus') {
        displayValue = '<a href="#" onclick=changeStatus(' + vinid + ')><i class="fa fa-edit" style="color:blue;"></i></a>'
      }
	  if (column.id == 'name') {
		   var qurl = linksobj.vinlink.url;
		   qurl+='&id='+vinid;
        displayValue = '<a href="'+qurl+'" target="_blank">'+displayValue+' </a>'
      }
	  if (column.id == 'custrecord_advs_vm_mileage') {
			if(displayValue=='')
			{
				displayValue = '<a href="#" onclick=updateMileage(' + vinid + ')><i class="fa fa-edit" style="color:blue;"></i> </a>'
			}else{
				displayValue = '<a href="#" onclick=updateMileage(' + vinid + ')> '+displayValue+'</a>'
			}
        
      }
      tableBody += `<td>${displayValue}</td>`;
    });

    tableBody += '</tr>';
  });
 
  tableBody += "</tbody>";

  return tableBody;
}


/*
$(document).ready(function () {
    $.post('/app/site/hosting/scriptlet.nl', { script: 'YOUR_SCRIPT_ID', deploy: 'YOUR_DEPLOY_ID' })
        .done(function (data) {
            var columns = data.columns;
            var rows = data.rows;

            var headerRow = $("#table-header");
            $.each(columns, function (index, col) {
                var th = $("<th>").text(col);
                headerRow.append(th);
            });

            var tbody = $("#table-body");
            $.each(rows, function (index, row) {
                var tr = $("<tr>");
                $.each(columns, function (index, col) {
                    var td = $("<td>").text(row[col] || "");
                    tr.append(td);
                });
                tbody.append(tr);
            });
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error("Error fetching data:", textStatus, errorThrown);
        });
}); */

function getInventoryColumns() {
  var columnsArray = [{
      id: 'linkquickdeal',
      name: "Quick Deal"
    },
    {
      id: 'linkcustomerdeposit',
      name: "Customer Deposit"
    },
    {
      id: 'linksofthold',
      name: "Soft Hold"
    },
    {
      id: 'linkchangestatus',
      name: "Change Status"
    },
    {
      id: 'custrecord_advs_em_serial_number',
      name: "Stock #"
    },
    {
      id: 'custrecord_advs_vm_reservation_status',
      name: "Status"
    },
    {
      id: 'custrecord_reservation_hold',
      name: "Soft Hold Status"
    },
    {
      id: 'custrecord_advs_vm_exterior_color',
      name: "Color"
    },
    {
      id: 'custrecord_advs_vm_model_year',
      name: "Year"
    },
    {
      id: 'custrecord_advs_vm_model',
      name: "Model"
    },
    {
      id: 'custrecord_advs_vm_engine_serial_number',
      name: "Engine"
    },
    {
      id: 'custrecord_advs_vm_transmission_type',
      name: "Transmission"
    },
    {
      id: 'custrecord_advs_vm_mileage',
      name: "Mileage"
    },
    {
      id: 'custrecord_advs_physical_loc_ma',
      name: "Physical Location"
    },
    {
      id: 'custrecord_advs_title_rest_ms_tm',
      name: "Title Restriction"
    },
    {
      id: 'custrecord_advs_vm_body_style',
      name: "Body style"
    },
    {
      id: 'custrecord_advs_tm_truck_ready',
      name: "Truck Ready"
    },
    {
      id: 'custrecord_advs_tm_washed',
      name: "Washed"
    },
    {
      id: 'custrecord_advs_single_bunk',
      name: "Single Bunk"
    },
    {
      id: 'custrecord_advs_grand_total_inception',
      name: "Total Inception"
    },
    {
      id: 'custrecord_advs_deposit_inception',
      name: "Deposit Inception"
    },
    {
      id: 'custrecord_advs_payment_inception',
      name: "Payment Inception"
    },
    {
      id: 'custrecord_advs_buck_terms1',
      name: "Terms"
    },
    {
      id: 'custrecord_advs_notes_ms_tm',
      name: "Notes"
    },
    {
      id: 'name',
      name: "Vin #"
    },
    {
      id: 'custrecord_advs_transport_',
      name: "Transport"
    },
    {
      id: 'custrecord_advs_vm_date_on_site',
      name: "Date On Site"
    },
    {
      id: 'custrecord_advs_inspected',
      name: "Inspected"
    },
    {
      id: 'custrecord_advs_approved_repair',
      name: "Approved Repairs Date"
    },
    {
      id: 'custrecord_advs_vm_eta',
      name: "ETA Ready"
    },
    {
      id: 'custrecord_advs_picture_1',
      name: "Pictures"
    },
    {
      id: 'custrecord_advs_vm_customer_number',
      name: "Customer"
    },
    {
      id: '',
      name: "Soft Hold Customer"
    },
    {
      id: '',
      name: "Soft Hold - Age In Days"
    },
    {
      id: 'custrecord_advs_vm_soft_hld_sale_rep',
      name: "SalesRep"
    },
    {
      id: 'custrecord_advs_admin_notes',
      name: "Admin Notes"
    },
    {
      id: 'custrecord_advs_vm_date_truck_ready',
      name: "Date Truck Ready"
    },
    {
      id: 'custrecord_advs_vm_date_truck_lockedup',
      name: "Date Truck Locked Up"
    },
    {
      id: 'custrecord_advs_aging_days_ready',
      name: "Aging Date Truck Ready"
    },
    {
      id: '',
      name: "Aging Date On Site"
    },
    {
      id: 'custrecord_advs_aging_contract',
      name: "Aging Contract"
    },
    {
      id: 'custrecord_advs_grand_total_inception',
      name: "Total Inception"
    },
    {
      id: '',
      name: "Deposit"
    },
    {
      id: '',
      name: "Payment"
    },
    {
      id: '',
      name: "Terms"
    },
    {
      id: 'custrecord_advs_payment_2_131',
      name: "Payments 2-13"
    },
    {
      id: 'custrecord_advs_payment_14_25',
      name: "Payments 14-25"
    },
    {
      id: 'custrecord_advs_payment_26_37',
      name: "Payments 26-37"
    },
    {
      id: 'custrecord_advs_pur_option',
      name: "Purchase Option"
    },
    {
      id: 'custrecord_advs_contract_total',
      name: "Contract Total"
    },
    {
      id: 'custrecord_advs_sleeper_size_ms',
      name: "Sleeper Size"
    },
    {
      id: 'custrecord_advs_apu_ms_tm',
      name: "APU"
    },
    {
      id: 'custrecord_advs_beds_ms_tm',
      name: "Beds"
    },
    {
      id: 'custrecord_vehicle_master_bucket',
      name: "Bucket"
    }
  ];


  return columnsArray;
}

function dynamiclinks() {

  var linksobj = {};
  linksobj.quickdeal = {
    'url': 'https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=675'
  }
  linksobj.softhold = {
    'url': 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_softhold_inventory&deploy=1'
  }
  linksobj.vinlink = {
    'url': 'https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=129'
  }


  return linksobj;
}

function depositcreation(customer, vin, depinception, Paymentincept, title, w, h, ) {
  debugger;
  var url = 'https://8760954.app.netsuite.com/app/accounting/transactions/custdep.nl?whence=&entity=' + customer + '&custbody_advs_vin_create_deposit=' + vin;
  var left = (screen.width / 2) - (900 / 2);
  var top = (screen.height / 2) - (500 / 2);
  var targetWin = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');
}

function renderTable(resultsArrayp, startp, endp) {
  var resultsArray = JSON.parse(resultsArrayp);
  var page = startp || 1,
    pageSize = endp || 5;
  const tableBodyElement = document.getElementById('table-body');
  const paginationElement = document.getElementById('pagination');

  const totalPages = Math.ceil(resultsArray.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  tableBodyElement.innerHTML = generateTableBody(resultsArray.slice(start, end));

  let paginationHtml = '';
  for (let i = 1; i <= totalPages; i++) {
    paginationHtml += `<li class="page-item ${i === page ? 'active' : ''}">
	<a class="page-link" href="#" onclick="renderTable(${JSON.stringify(resultsArray)},${i}, ${pageSize})">${i}</a>
                           </li>`;
  }

  paginationElement.innerHTML = paginationHtml;
}

function openfiltersetup() {
  var userid = jQuery('#employee').val();
  var title = '';
  var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2604&deploy=1&user=' + userid + '&from=1';
  var left = (screen.width / 2) - (500 / 2);
  var top = (screen.height / 2) - (500 / 2);
  var targetWin = window.open(url, title, 'width=900, height=500, top=' + top + ', left=' + left);

}

// Function to filter based on a key-value match
function filterVehicles(arr, key, value) {
  return globalresultsArray.filter(vehicle => vehicle[key] == value);
}

function filterVehicles1(arr, filters) {
  return arr.filter(vehicle =>
    Object.entries(filters).every(([key, value]) => vehicle[key] == value)
  );
}
$(document).ready(function () {
  $(document).on('change', 'select', function () {
    var selectedValue = $(this).val(); // Get the selected value
    var selectedText = $(this).find("option:selected").text(); // Get selected text
    var selectBoxId = $(this).attr("name"); // Get the select box ID
    var fieldtofilter = filtersfields();
    var filterfield = fieldtofilter[selectBoxId];
    var filters = getSelectedFilters(); // Get selected filters
    console.log('filters', filters);
    var filteredResults = filterVehicles1(globalresultsArray, filters);
    var tableHTML = generateTableBody(filteredResults, filterfield, selectedValue);
    document.getElementById("table-body").innerHTML = '';
    document.getElementById("table-body").innerHTML = tableHTML;

  });
});

function filtersfields() {
  try {
    var obj = {};
    obj.customlistadvs_list_physicallocation = 'custrecord_advs_physical_loc_ma';
    obj.customrecord_advs_vm = 'internalid';
    obj.customlist_advs_ms_list_sleeper_size = 'custrecord_advs_sleeper_size_ms';
    obj.customlist712 = 'custrecord_advs_vm_transmission_type';
    return obj;
  } catch (e) {
    console.log('error', e.toString())
  }
}

function createSelectBoxes() {
  $.get('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl', {
      script: 'customscript_advs_invfilter_options',
      deploy: '1',
      flag: 'inventorysearch'
    })
    .done(function (data) {
      //console.log('data',data);
      var resultsdata = JSON.parse(data);
      var _resultsdata = resultsdata.customLists;
      const container = document.getElementById("selectBoxContainer");
      var alllists = Object.keys(_resultsdata);
      for (var i = 0; i < alllists.length; i++) {
        var list = _resultsdata[alllists[i]];

        // Create a div container for each select
        const div = document.createElement("div");
        div.className = "select-container col-md-4";


        // Create a label
        const label = document.createElement("label");
        label.textContent = alllists[i] + ": ";
        label.htmlFor = alllists[i];

        // Create a select element
        const select = document.createElement("select");
        select.id = alllists[i] + '_' + i;
        select.name = alllists[i];
        select.className = "form-control js-example-basic-single"
        // Create default "Select" option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "-- Select --";
        select.appendChild(defaultOption);

        // Loop through options in the object and add to select
        list.forEach(option => {
          const opt = document.createElement("option");
          opt.value = option.id;
          opt.textContent = option.name;
          select.appendChild(opt);
        });

        // Append label and select to div
        div.appendChild(label);
        div.appendChild(select);

        // Append div to container
        container.appendChild(div);

      }

      $('.js-example-basic-single').select2();
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error("Error fetching data:", textStatus, errorThrown);
    });
  return true;

}

function getSelectedFilters() {
  let filters = {};
  var fieldtofilter = filtersfields();
  $("select").each(function () {
    let key = $(this).attr("id"); // Get the select box ID as key
    let value = $(this).val(); // Get selected value
    var selectBoxId = $(this).attr("name"); // Get the select box ID 
    var filterfield = fieldtofilter[selectBoxId];
    if (value && value !== "-- Select --") { // Ignore empty selections
      filters[filterfield] = value;
    }
  });

  return filters;
}

function softholdupdate(pageURL, depinception, Paymentincept, TTLINSP, TERMS, sec_2_13, sec_14_26, sec_26_37, sec_38_49, purOptn, contTot, bktId) {
  var url = '/app/site/hosting/scriptlet.nl?script=customscript_softhold_inventory&deploy=1&vinid=' + pageURL + '&depinception=' + depinception + '&Paymentincept=' + Paymentincept + '&TTLINSP=' + TTLINSP + '&TERMS=' + TERMS + '&sec_2_13=' + sec_2_13 + '&sec_14_26=' + sec_14_26 + '&sec_26_37=' + sec_26_37 + '&sec_38_49=' + sec_38_49 + '&purOptn=' + purOptn + '&contTot=' + contTot + '&bktId=' + bktId;
  var left = (screen.width / 2) - (900 / 2);
  var top = (screen.height / 2) - (500 / 2);
  var targetWin = window.open(url, 'softhold', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');
}

function changeStatus(vinid, Status) {
  var left = (screen.width / 2) - (300 / 2);
  var top = (screen.height / 2);
  var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1712&deploy=1&vinid=' + vinid + '&status' + Status;
  var targetWin = window.open(url, 'changestatus', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,top=300,left=400,width=480,height=210');
}

function colorbackgroundtablerows() {
  $("table tbody tr").each(function () {
    let statusText = $(this).find("td:nth-child(7)").text().trim(); // Adjust column index 
    if (statusText === "En Route New") {
      $(this).css("background-color", "#ffcccb"); // Light Red
    } else if (statusText === "Soft Hold") {
      $(this).css("background-color", "#ffff99"); // Light Yellow
    }
  });
}

function colortablecells() {
  $("table tbody tr").each(function () {
    // Status Column (6th Column in your table)
    let statusCell = $(this).find("td:nth-child(6)");
    let statusText = statusCell.text().trim();

    if (statusText === "En Route New") {
      statusCell.css("background-color", "#d5eaf8"); // Light Red
    } else if (statusText === "Soft Hold") {
      statusCell.css("background-color", "#ffff99"); // Light Yellow
    }

    // Title Restriction Column (11th Column in your table)
    let titleCell = $(this).find("td:nth-child(15)");
    let titleText = titleCell.text().trim();

    if (titleText === "Yes") {
      titleCell.css("background-color", "#FFCCCB"); // Light Green
    } else if (titleText === "No") {
      //titleCell.css("background-color", "#FFA07A"); // Light Orange
    }
  });

}
function updateMileage(vinid) {
var left = (screen.width/2)-(300/2);
var top = (screen.height/2);
var url='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2594&deploy=1&vinid='+vinid;
var targetWin = window.open(url, 'updateMileage', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,top=300,left=400,width=480,height=210');
}
$(document).ready(function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		debugger;
        let targetTab = $(e.target).attr("href"); // Get the tab pane ID
        if (targetTab === "#repo") {
            window.location.href = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2626&deploy=1";
        } else if (targetTab === "#home") {
            window.location.href = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2623&deploy=1";
        } else if (targetTab === "#auction") {
            window.location.href = "https://example.com/auction";
        }
    });
});

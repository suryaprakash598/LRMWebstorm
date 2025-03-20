jQuery(document).ready(function () {
  fetchDataAgain();
  initializeSortable();
  jQuery(document).on("change", '#customerfilter', function () {

    jQuery('.board-portlet').show();
    jQuery('.portlet-card-list li').show();
    debugger;
    var selectedcustomer = $("#customerfilter option:selected").text();
    selectedcustomer = selectedcustomer.trim();
    if (selectedcustomer != 'Customer') {
      jQuery('.fa-user-o').each(function name(params) {
        var customer = jQuery(this).parent('div').text();
        if (customer.trim() == selectedcustomer) {

        } else {
          jQuery(this).parent('div').parent('div').parent('li').hide();
          jQuery('.portlet-card-list').each(function () {
            //console.log( jQuery(this).attr('id'), $(this).find('li:not([style*="display: none"])').length)
            if ($(this).find('li:not([style*="display: none"])').length == 0) {
              jQuery(this).parent('div').hide();
            }
          })

        }
      });
	  getOrderNumbers();
    }

  });
  jQuery(document).on("change", '#orderfilter', function () {

    jQuery('.board-portlet').show();
    jQuery('.portlet-card-list li').show();
    debugger;
    var selectedorder = $("#orderfilter option:selected").val();
    selectedorder = selectedorder.trim();
    if (selectedorder != 'Order') {
      jQuery('.ordernumber').each(function name(params) {
        var order = jQuery(this).text();
        if (order.trim() == selectedorder) {

        } else {
          jQuery(this).parent('div').parent('div').parent('li').hide();
          jQuery('.portlet-card-list').each(function () {
            //console.log( jQuery(this).attr('id'), $(this).find('li:not([style*="display: none"])').length)
            if ($(this).find('li:not([style*="display: none"])').length == 0) {
              jQuery(this).parent('div').hide();
            }
          })

        }
      });
    }

  });
  jQuery(document).on("change", '#technicianfilter', function () {

    jQuery('.board-portlet').show();
    jQuery('.portlet-card-list li').show();
    debugger;
    var selectedTechnician = $("#technicianfilter option:selected").text();
    selectedTechnician = selectedTechnician.trim();
    if (selectedTechnician != 'Technician') {
      jQuery('.techname').each(function name(params) {
        var technician = jQuery(this).text();
        if (technician.trim() == selectedTechnician) {

        } else {
          jQuery(this).parent('div').parent('div').parent('li').hide();
          jQuery('.portlet-card-list').each(function () {
            //console.log( jQuery(this).attr('id'), $(this).find('li:not([style*="display: none"])').length)
            if ($(this).find('li:not([style*="display: none"])').length == 0) {
              jQuery(this).parent('div').hide();
            }
          })

        }
      });
    }

  });
  jQuery(document).on("change", '#ordervinfilter', function () {
	  
    jQuery('.board-portlet').show();
    jQuery('.portlet-card-list li').show(); 
    var selectedTechnician = $("#ordervinfilter option:selected").text();
    selectedTechnician = selectedTechnician.trim();
    if (selectedTechnician != 'VIN') {
      jQuery('.vinnumbercls').each(function name(params) {
        var vinnumber = jQuery(this).text();
        if (vinnumber.trim() == selectedTechnician) {

        } else {
          jQuery(this).parent('div').parent('li').hide();
          jQuery('.portlet-card-list').each(function () {
            //console.log( jQuery(this).attr('id'), $(this).find('li:not([style*="display: none"])').length)
            if ($(this).find('li:not([style*="display: none"])').length == 0) {
              jQuery(this).parent('div').hide();
            }
          })

        }
      });
    }

  });
  jQuery(document).on("change", '#statusfilter', function () {
	  
    jQuery('.board-portlet').show();
    jQuery('.portlet-card-list li').show(); 
    var selectedStatus = $("#statusfilter").val();
    selectedStatus = selectedStatus.trim();
    if (selectedStatus != 0) {
       if(selectedStatus==1)
	   {
		      //jQuery('.internaltrucks').closest('.board-portlet').show()
		   jQuery('.externaltrucks').closest('.board-portlet').hide()
	   }else{
		   //jQuery('.externaltrucks').closest('.board-portlet').toggle()
		   jQuery('.internaltrucks').closest('.board-portlet').hide()
	   }
    }

  });
  
jQuery(document).on('click','.job-comment-popup',function(){
	debugger; 
var soid = jQuery(this).attr('data-recid');

      var _html = '';
       
        _html += '<textarea class="commentsonorder" placeholder="Enter your comments here..." style="width: 100%; height:100px; border: 1px solid #ccc;padding: 5px; font-size: 14px;"></textarea>';
        _html += '<br/><br/><input class="commentsordersubmit"  data-recid='+soid+' type="submit" value="Submit" style="background-color: green; color:white; border: none; padding: 5px; width: 100px; height: 40px; ">';
       // _html += '<div style="display:inline;padding-left:20px;"><button type="button" class="close-comment" style="background-color:#3e4b5; color: black; border: none; padding: 5px; width: 100px; height: 40px;">Close</button></div><br/><br/>';
		jQuery('#modelbodynotes').html(_html);
        jQuery('#mynotesModal').show();  
				  }); 
		 
});

 jQuery(document).on('click', '#notesmodelclose', function() {
  jQuery('#mynotesModal').hide(); 
});
jQuery(document).on('click', '.close-comment', function() {
  jQuery('#mynotesModal').hide(); 
}); 


jQuery(document).on('click', '.commentsordersubmit', function(e) {
  e.preventDefault(); 
  debugger;

  var salesOrderId = jQuery(this).attr('data-recid'); 
  console.log("salesOrderId", salesOrderId);

  var comment = jQuery('.commentsonorder').val();
  console.log("comment", comment);

  jQuery.ajax({
      url: '/app/site/hosting/scriptlet.nl?script=2559&deploy=1&compid=8760954&ns-at=AAEJ7tMQ2z58ss2ieqjEExdUkPIhTAVcQL3MRP8BMHmo3ko1uo4&custparam_so=' + salesOrderId + '&custparam_comment=' + encodeURIComponent(comment),
      method: 'POST',
      success: function(response) {
          alert('Comment added successfully!');  
          jQuery('#popup_package').hide();
          jQuery('#popup_package').html(''); 
      },
      error: function(xhr, status, error) {
          console.error('AJAX Error:', error);
      }
  });
});

function getInputSearch()
{
	try
	{
		var htmi='';
		htmi+='<input type="text" id="searchInput" placeholder="Search for VIN/ SO number. />'; 
		$('.textboxfilterdiv').html(htmi);
		
	}catch(e)
	{
		console.log('eroor',e.toString());
	}
}



function getTechnicians() {
  var arr = [];
  jQuery('.techname').each(function name(params) {
    if (jQuery(this).text().trim() != '') {
      arr.push(jQuery(this).text().trim());
    }

  })
  var uniq = arr.map(function (name) {
      return {
        count: 1,
        name: name
      }
    })
    .reduce(function (a, b) {
      a[b.name] = (a[b.name] || 0) + b.count
      return a
    }, {})

  var sorted = Object.keys(uniq).sort(function (a, b) {
    return uniq[a] < uniq[b]
  });


  var selecttechnicians = '<select id="technicianfilter" style="margin-left:20px;padding: 10px; border-radius: 10px;color: #151414;"><option>Technician</option>';
  for (var i = 0; i < sorted.length; i++) {
    selecttechnicians += '<option value=' + sorted[i].trim() + '>' + sorted[i].trim() + '</option>';
  }
  selecttechnicians += '</select>';
  $('.technicianfilterdiv').html(selecttechnicians);

}

function getOrderVINNumbers() {
  var arr = [];
  jQuery('.vinnumbercls').each(function name(params) {
	 // if (!$(this).parent('div').parent('li').attr('style').includes('display')) {
			arr.push(jQuery(this).text());
	  // }
  })
  var uniq = arr.map(function (name) {
      return {
        count: 1,
        name: name
      }
    })
    .reduce(function (a, b) {
      a[b.name] = (a[b.name] || 0) + b.count
      return a
    }, {})

  var sorted = Object.keys(uniq).sort(function (a, b) {
    return uniq[a] < uniq[b]
  });
  var selectorderss ='';
   selectorderss = '<select id="ordervinfilter" style="margin-left:20px;padding: 10px; border-radius: 10px;color: #151414;"><option>VIN</option>';
  for (var i = 0; i < sorted.length; i++) {
    selectorderss += '<option value=' + sorted[i].trim() + '>' + sorted[i] + '</option>';
  }
  selectorderss += '</select>';
  $('.vinfilterdiv').html(selectorderss);
  $('#ordervinfilter').select2();

}
function getStatusFilters()
{
	var selectorderss ='';
   selectorderss = '<select id="statusfilter" style="margin-left:20px;padding: 10px; border-radius: 10px;color: #151414;"><option value=0>Status</option>';
 
    selectorderss += '<option value=1>Internal Trucks</option>';
    selectorderss += '<option value=2>External Trucks</option>';
  
  selectorderss += '</select>';
  $('.statusfilterdiv').html(selectorderss);
}
function getOrderNumbers() {
  var arr = [];
  jQuery('.ordernumber').each(function name(params) {
	  console.log("$(this).parent('div').parent('div').parent('li').attr('style')",$(this).parent('div').parent('div').parent('li').attr('style'))
	  if (!$(this).parent('div').parent('div').parent('li').attr('style').includes('display')) {
			arr.push(jQuery(this).text());
	  }
  })
  var uniq = arr.map(function (name) {
      return {
        count: 1,
        name: name
      }
    })
    .reduce(function (a, b) {
      a[b.name] = (a[b.name] || 0) + b.count
      return a
    }, {})

  var sorted = Object.keys(uniq).sort(function (a, b) {
    return uniq[a] < uniq[b]
  });
  var selectorderss ='';
   selectorderss = '<select id="orderfilter" style="margin-left:20px;padding: 10px; border-radius: 10px;color: #151414;"><option>Order</option>';
  for (var i = 0; i < sorted.length; i++) {
    selectorderss += '<option value=' + sorted[i].trim() + '>salesorder #' + sorted[i] + '</option>';
  }
  selectorderss += '</select>';
  $('.orderfilterdiv').html(selectorderss);
  $('#orderfilter').select2();

}

function getCustomerNames() {
  var arr = [];
  jQuery('.fa-user-o').each(function name(params) {
    arr.push(jQuery(this).parent('div').text());
  })
  var uniq = arr.map(function (name) {
      return {
        count: 1,
        name: name
      }
    })
    .reduce(function (a, b) {
      a[b.name] = (a[b.name] || 0) + b.count
      return a
    }, {})

  var sorted = Object.keys(uniq).sort(function (a, b) {
    return uniq[a] < uniq[b]
  });

  var selectcustomers = '<select id="customerfilter" style="padding: 10px; border-radius: 10px;background: #eae2ec;color: #151414;"><option>Customer</option>';
  for (var i = 0; i < sorted.length; i++) {
    selectcustomers += '<option >' + sorted[i] + '</option>';
  }
  selectcustomers += '</select>';
  $('.customerfilterdiv').html(selectcustomers);
  //return sorted;
}

function initializeSortable() {
  console.log('A');
  $("[id^='portlet-card-list-']").sortable({
    connectWith: '[id^="portlet-card-list-"]',
    items: '.portlet-card',
    tolerance: 'pointer',
    update: function (event, ui) {
      console.log('Updated order:', this.id);
    },
    receive: function (event, ui) {
      console.log('Receive order:', this.id + '#' + ui.item[0].id);
      updateOrderStatus(this.id, ui.item[0].id);
    }
  }).disableSelection();
}

function fetchDataAgain() {
  $.ajax({
    url: '/app/site/hosting/scriptlet.nl?script=1670&deploy=1&compid=8760954&ns-at=AAEJ7tMQ2z58ss2ieqjEExdUkPIhTAVcQL3MRP8BMHmo3ko1uo4',
    method: 'POST',
    success: function (response) {

      $('#main_job_contan_advs').html(response);


      initializeSortable();
      getCustomerNames();
      getOrderNumbers();
      getTechnicians();
	  // getInputSearch();
	  getOrderVINNumbers();
	  getStatusFilters();
    },
    error: function (xhr, status, error) {
      console.error('AJAX Error:', error);
    }
  });
}

function updateOrderStatus(status, orderId) {
  $('#loader-overlay').show();
  $.ajax({
    url: '/app/site/hosting/scriptlet.nl?script=1670&deploy=1&compid=8760954&ns-at=AAEJ7tMQ2z58ss2ieqjEExdUkPIhTAVcQL3MRP8BMHmo3ko1uo4&custparam_status=' + status + '&custparam_order_id=' + orderId,
    method: 'POST',
    success: function (response) {
      showSuccessToast('top-center');
      fetchDataAgain();
      $('#loader-overlay').hide();
    },
    error: function (xhr, status, error) {
      showDangerToast('top-center');
      fetchDataAgain();
      $('#loader-overlay').hide();
      console.error('AJAX Error:', error);
    }
  });
}
$(document).ready(function() {
  debugger;
		$('#orderfilter').select2();
		
		jQuery(document) .on('click','.jobstatus',function(){
			var orderid = jQuery(this).attr('data-recid-clock');
			if(orderid)
			{
				$('#loader-overlay').show();
				  $.ajax({
					url: '/app/site/hosting/scriptlet.nl?script=1670&deploy=1&compid=8760954&ns-at=AAEJ7tMQ2z58ss2ieqjEExdUkPIhTAVcQL3MRP8BMHmo3ko1uo4&custparam_order_id=' + orderid,
					method: 'GET',
					success: function (response) {
					  //showSuccessToast('top-center');
					   console.log(JSON.parse(response));
					  // showmodelpopup(JSON.parse(response));
					  var objdata = JSON.parse(response);
					  var html='';
					 html+=' <table class="jobstatusdata" style="width:800px;"><tr style="background-color: #bcc5c5;"><th>Job Name</th><th>Job Description</th><th>Job Status</th><th>Labor Hours</th><th>Goal Hours</th><th>Actual Hours</th><th>Technician</th></tr>';
					  for(var i=0;i<objdata.length;i++)
						{
							html+='<tr><td>'+objdata[i].jobname+'</td><td>'+objdata[i].jobdesc+'</td><td>'+objdata[i].jobstatus+'</td><td>'+objdata[i].jobinvoicetime+'</td><td>'+objdata[i].joblabortime+'</td><td>'+objdata[i].jobactualtime+'</td><td>'+objdata[i].jobmechanic+'</td></tr>';
						}
						 html+='<style>';
						 html+='.jobstatusdata table{border-collapse: collapse;}, .jobstatusdata th, .jobstatusdata td {  border: 1px solid black;  }';
						 html+='</style>';
						 html+='</html>';
						jQuery('.modal-body').html(html);
						jQuery('#myclockModal').show();
					  $('#loader-overlay').hide();
					},
					error: function (xhr, status, error) {
					  //showDangerToast('top-center');
					   
					  $('#loader-overlay').hide();
					  console.error('AJAX Error:', error);
					}
				  });
			}
		});
		jQuery(document).on('click', '#clockmodelclose', function() {
		  jQuery('#myclockModal').hide(); 
		});
		/* jQuery(document).on('click', '.close-comment', function() {
		  jQuery('#mynotesModal').hide(); 
		});  */
	});
	 
	 function showmodelpopup(objdata)
	 {
		var html = ` <div class="modal" id="myclockModal">
				  <div class="modal-dialog">
					<div class="modal-content">

					  <!-- Modal Header -->
					  <div class="modal-header">
						<h4 class="modal-title">Modal Heading</h4>
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					  </div>

					  <!-- Modal body -->
					  <div class="modal-body">
						<table><tr><th>Job Name</th><th>Job Description</th><th>Job Status</th><th>Labor Hours</th></tr>
					  `;
					  
						for(var i=0;i<objdata.length;i++)
						{
							html+='<tr><td>'+objdata.jobname+'</td><td>'+objdata.jobdesc+'</td><td>'+objdata.jobstatus+'</td><td>'+objdata.joblabortime+'</td></tr>';
						}
					html+=` </table> </div>

					  <!-- Modal footer -->
					  <div class="modal-footer">
						<button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
					  </div>

					</div>
				  </div>
				</div>`;
				
	 }
        // Get the search input element
     /*    document.getElementById('searchInput').addEventListener('keyup', function() {
            // Get the input value
            const searchValue = this.value.toLowerCase();
            
            // Get all rows of the table
            const rows = document.querySelectorAll('#myTable tbody tr');
            
            // Loop through the rows and hide those that don't match the search value
            rows.forEach(function(row) {
                const cells = row.querySelectorAll('td');
                let found = false;
                
                // Loop through each cell in the row to check if it matches the search value
                cells.forEach(function(cell) {
                    if (cell.textContent.toLowerCase().includes(searchValue)) {
                        found = true;
                    }
                });
                
                // If a match is found, show the row; otherwise, hide it
                if (found) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }); */
   
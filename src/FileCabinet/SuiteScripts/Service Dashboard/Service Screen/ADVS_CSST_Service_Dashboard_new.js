/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/url', 'N/runtime'],
    /**
     * @param{currentRecord} currentRecord
     */
    function (currentRecord, url, runtime) {

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

        $(document).ready(function () {
			jQuery(document).on('click','#custpage_history_notrequired_tooltip1',function(){
				jQuery('#custpage_history_notrequired_tooltip1').toggle();
				jQuery('#custpage_history_notrequired_tooltip1').css('opacity',1);
			});
			
			 jQuery(document).on('click','#closematrix',function(){
				jQuery('#custpage_history_notrequired_tooltip1').hide();
				jQuery('#custpage_history_notrequired_tooltip1').css('opacity',0);
			}) 
			getTechnicians();
            var _recID = getUrlParameter("recid");
            if (_recID == '') {
                initAutocompleteVehicle();
                setDiscountAndTax();
                fetchOrderStatusData();
            } else {
                makefieldViewMode();
            }

            // Training start
            const trainingSteps = [{
                    id: 'search_text',
                    message: '<img src=\'https://8760954.app.netsuite.com/core/media/media.nl?id=4640&c=8760954&h=hOVnkhUkJlxiF1pyN-M-xif_-VbwypZKB5WC6IWXWlItXID6\' width="200px"/>',
                    heading: 'Search Vehicle'
                }, {
                    id: 'search_customer_text',
                    message: 'Can search by' +
                    '<ul>' +
                    '<li>Name</li>' +
                    '<li>Email</li>' +
                    '<li>Phone</li>' +
                    '</ul>' +
                    '',
                    heading: 'Search Customer'
                }, {
                    id: 'custpage_select_est_ord',
                    message: 'Enter a secure password. At least 8 characters. checking lots of data.' +
                    '<br/><b style="color:red;">checking lots of data</b>' +
                    '<br/>checking lots of data.' +
                    '<ul>' +
                    '<li>A</li>' +
                    '<li>B</li>' +
                    '<li>C</li>' +
                    '</ul>' +
                    '' +
                    '' +
                    '',
                    heading: 'Choose Order or Estimate'
                }, {
                    id: 'custpage_current_mileage',
                    message: 'Please enter Mileage here.',
                    heading: 'Mileage'
                }, {
                    id: 'custpage_current_po_num',
                    message: 'Please enter Mileage here.',
                    heading: 'Po Number'
                }, {
                    id: 'add-section',
                    message: 'Please enter Mileage here.',
                    heading: 'Add Job'
                }, {
                    id: 'add-package',
                    message: 'Please enter Mileage here.',
                    heading: 'Package'
                }, {
                    id: 'custpage_order_status_sel',
                    message: 'Please enter Mileage here.',
                    heading: 'Status'
                }, {
                    id: 'custpage_order_completed',
                    message: 'Please enter Mileage here.',
                    heading: 'Completed'
                }, {
                    id: 'custpage_order_location',
                    message: 'Please enter Mileage here.',
                    heading: 'Location'
                }, {
                    id: 'custpage_order_department',
                    message: 'Please enter Mileage here.',
                    heading: 'Department'
                }, {
                    id: 'custpage_vin_number',
                    message: 'Please enter Mileage here.',
                    heading: 'VIN'
                }, {
                    id: 'settings-trigger',
                    message: 'Thanks for using the Guide. I you want to watch again,, press button again.',
                    heading: 'Guide Complete'
                }

            ];

            var currentStep = 0;

            // Elements
            const modal = document.getElementById('trainingModal');
            const startTrainingButton = document.getElementById('settings-trigger');
            const stopTrainingButton = document.getElementById('settings-trigger');
            const prevButton = document.getElementById('prevButton');
            const nextButton = document.getElementById('nextButton');
            const stopButton = document.getElementById('stopButton');

            // Start Training Function
            function startTraining() {
                currentStep = 0;
                // $('#loader-overlay').show()
                highlightStep(currentStep);
                modal.style.display = 'block';
            }

            // Stop Training Function
            function stopTraining() {
                $('#loader-overlay').hide()
                clearHighlights();
                modal.style.display = 'none';
                // startTrainingButton.style.display = 'inline-block';
                //stopTrainingButton.style.display = 'none';
                currentStep = 0;
            }

            // Highlight current step and show modal
            function highlightStep(step) {
                clearHighlights();
                const field = document.getElementById(trainingSteps[step].id);
                field.classList.add('highlight');
                showModal(field, trainingSteps[step].message, trainingSteps[step].heading);
            }

            // Show Modal next to the current field
            function showModal(field, message, heading) {
                const rect = field.getBoundingClientRect();
                modal.querySelector('.modal-header').innerHTML = heading;
                modal.querySelector('.modal-body').innerHTML = message;

                modal.style.top = `${rect.top + window.scrollY}px`;

                var calculatedwidth = rect.left + field.offsetWidth + 20;

                if (window.innerWidth - 50 <= calculatedwidth) {
                    modal.style.left = `${rect.left + field.offsetWidth - 100}px`;
                } else {
                    modal.style.left = `${rect.left + field.offsetWidth + 20}px`;
                }

                modal.style.display = 'block';
                prevButton.disabled = currentStep === 0;
                nextButton.disabled = currentStep === trainingSteps.length - 1;

                console.log(currentStep);
                console.log(currentStep === 0);
            }

            // Clear field highlights
            function clearHighlights() {
                document.querySelectorAll('.highlight').forEach(field => {
                    field.classList.remove('highlight');
                });
            }

            // Navigation - Next and Previous
            nextButton.addEventListener('click', () => {
                nextStep();
            });

            function nextStep() {
                if (currentStep < trainingSteps.length - 1) {
                    currentStep++;
                    highlightStep(currentStep);
                }
            }

            prevButton.addEventListener('click', () => {
                prevStep();
            });

            function prevStep() {
                if (currentStep > 0) {
                    currentStep--;
                    highlightStep(currentStep);
                }
            }

            // Event Listeners
            startTrainingButton.addEventListener('click', startTraining);
            //stopTrainingButton.addEventListener('click', stopTraining);
            stopButton.addEventListener('click', stopTraining);

            // Training END


            $('#custpage_save').on('click', function () {
                SavetheDetails();
            });
            $('#custpage_edit').on('click', function () {
                enabletheDetails();
            });

            function SavetheDetails() {

                swal.fire({
                    title: 'Are you sure, you want to save this service ticket?',
                    text: 'You won\'t be able to revert this!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                }).then((result) => {
                    if (result.isConfirmed) {

                        var allsectionCollection = $('[id^=section-]');
						var _arrTech = [];
                        var vin = document.getElementById("selected_vehicle_id").value; 
						var salesorderid = jQuery('#custpage_open_order_docnumber').attr('data-recid');
                        var customer = document.getElementById("custpage_customer_id").value;
                        var department_main = document.getElementById("customerdeptid").value;
                        var department = document.getElementById("custpage_order_department").value||department_main;
                        //var department = document.getElementById("custpage_order_department").value;
                        var location_main = document.getElementById("customerlocationid").value;
                        var location = document.getElementById("custpage_order_location").value||location_main;
                        var mileageIn = document.getElementById("custpage_current_mileage").value;
                        var serviceWriter = document.getElementById("custpage_current_user_name").value;
                        var CreateDate = document.getElementById("custpage_current_date_time").value;
                        var poNumber = document.getElementById("custpage_current_po_num").value;
                        var appointment = document.getElementById("custpage_order_status_sel").value;
                        var completed = document.getElementById("custpage_order_completed").value;
                        var discountHead = document.getElementById("custpage_job_disc_head").value;
                        var taxHead = document.getElementById("custpage_job_tax_head").value
                            var shopSupply = document.getElementById("custpage_job_shop_head").value
                            var remark = ""; //document.getElementById("custpage_order_remark").value;
						

                        if (CheckORAND(vin, "OR") || CheckORAND(customer, "OR") || CheckORAND(department, "OR") || CheckORAND(location, "OR") || CheckORAND(mileageIn, "OR") || allsectionCollection.length == 0) {

                            var missingField = `<p class="sidepanelfontClass">Please check the following fields:</p>
                                    <ul style="color: #c45b5b;font-weight: bold;" class="sidepanelfontClass">`;

                            if (CheckORAND(vin, "OR")) {
                                missingField += `<li><b>VIN</b></li>`;
                            }

                            if (CheckORAND(customer, "OR")) {
                                missingField += `<li><b>Customer</b></li>`;
                            }

                            if (CheckORAND(department, "OR")) {
                                missingField += `<li><b>Department</b></li>`;
                            }

                            if (CheckORAND(location, "OR")) {
                                missingField += `<li><b>Location</b></li>`;
                            }

                            if (CheckORAND(mileageIn, "OR")) {
                                missingField += `<li><b>Mileage In</b></li>`;
                            }

                            if (allsectionCollection.length == 0) {
                                missingField += `<li><b>At least one JOB required to save Repair Order/Estimate.</b></li>`;
                            }

                            swal.fire({
                                title: 'Missing Information!',
                                html: `${missingField}`,
                                icon: 'error',
                                confirmButtonText: 'OK'
                            });

                        } else {

                            var TotalParts = 0,
                            TotalLabor = 0,
                            TotalSublet = 0,
                            TotalTax = 0,
                            TotalDiscount = 0;

                            var orderDetails = {};
                            var allJobs = new Array();
							var allLabors = new Array();
                            var dontAllowToSave = 0;
                            var errorMsgToShow = '<ul style="font-size: 14px;color: #c45b5b;font-weight: bold;">';

                            for (var f = 0; f < allsectionCollection.length; f++) {

                                var allLinesCillection = $('#' + allsectionCollection[f].id + ' .lines-container .line').map(function () {
                                    return this.id;
                                }).get().filter(function (id) {
                                    return id.startsWith('line-');
                                });

                                var sectionId = allsectionCollection[f].id;

                                var sectionIdSPlit = sectionId.split("section-")[1];

                                var jobDetails = `job_${f}`;

                                allJobs.push(jobDetails);

                                var allLinesCillection = $('#' + allsectionCollection[f].id + ' .lines-container .line').map(function () {
                                    return this.id;
                                }).get().filter(function (id) {
                                    return id.startsWith('line-');
                                });

                                var jobName = document.getElementById("job_title_" + sectionIdSPlit).value; 
                                if (allLinesCillection.length == 0) {
                                    dontAllowToSave = 1;
                                    errorMsgToShow += `<li><b class="sidepanelfontClass">Please add at least one line in job ${jobName}.</b></li>`;

                                } else {

                                    var missingLineData = `<li><b class="sidepanelfontClass">Please correct data in job ${jobName}.</b></li>`;
                                    var jobValidateAdd = 0;
                                    for (var l = 0; l < allLinesCillection.length; l++) {
                                        var missingLineDataExist = 0;
                                        var lineType = document.getElementById('' + allLinesCillection[l] + '-field1').value;
                                        var item_id = document.getElementById('' + allLinesCillection[l] + '-item_id').value;
                                        var lineQuan = document.getElementById('' + allLinesCillection[l] + '-field3').value;
                                        var lineRate = document.getElementById('' + allLinesCillection[l] + '-field4').value;

                                        var missingLineDataDetails = "";

                                        if (CheckORAND(lineType, "OR") || CheckORAND(lineQuan, "OR") || CheckORAND(lineRate, "OR") || CheckORAND(item_id, "OR")) {

                                            missingLineDataDetails = `<ul>
                                            <li><b class="sidepanelfontClass">Line ${l + 1}.</b>`;
                                            dontAllowToSave = 1;
                                            missingLineDataExist = 1;

                                            if (CheckORAND(lineType, "OR")) {
                                                missingLineDataDetails += `<b class="sidepanelfontClass"> Line Type </b>`;
                                            }

                                            if (CheckORAND(item_id, "OR")) {
                                                missingLineDataDetails += `<b class="sidepanelfontClass"> Item </b>`;
                                            }

                                            if (CheckORAND(lineQuan, "OR")) {
                                                missingLineDataDetails += `<b class="sidepanelfontClass">, Quantity </b>`;
                                            }

                                            if (CheckORAND(lineRate, "OR")) {
                                                missingLineDataDetails += `<b class="sidepanelfontClass">, Rate </b>`;
                                            }

                                            missingLineDataDetails += '</li></ul>';

                                        } else {}

                                        if (missingLineDataExist == 1) {
                                            if (jobValidateAdd == 0) {
                                                errorMsgToShow += missingLineData;
                                                jobValidateAdd = 1;
                                            }

                                            errorMsgToShow += missingLineDataDetails;
                                        }

                                    }

                                }

                            }

                            if (dontAllowToSave == 1) {
                                swal.fire({
                                    title: 'Missing Information!',
                                    html: `${errorMsgToShow}`,
                                    icon: 'error',
                                    confirmButtonText: 'OK'
                                });
                            } else {

                                orderDetails = {
                                    vin: vin,
                                    customer: customer,
									salesorderid:salesorderid,
                                    serviceWriter: serviceWriter,
                                    CreateDate: CreateDate,
                                    poNumber: poNumber,
                                    appointment: appointment,
                                    completed: completed,
                                    discountHead: discountHead,
                                    taxHead: taxHead,
                                    shopSupply: shopSupply,
                                    remark: remark,
                                    department: department,
                                    location: location,
                                    mileageIn: mileageIn
                                };

                                orderDetails.jobs = allJobs;

                                for (var f = 0; f < allsectionCollection.length; f++) {
									var uniCode = makeUniqueOrderCode();
                                    var allLinesCillection = $('#' + allsectionCollection[f].id + ' .lines-container .line').map(function () {
                                        return this.id;
                                    }).get().filter(function (id) {
                                        return id.startsWith('line-');
                                    });

                                    var headerTotal = 0;

                                    var sectionId = allsectionCollection[f].id;

                                    var sectionIdSPlit = sectionId.split("section-")[1];

                                    var complain = document.getElementById("custpage_complain_" + sectionIdSPlit).value;
                                    var cause = document.getElementById("custpage_cause_" + sectionIdSPlit).value;
                                    var correction = document.getElementById("custpage_correction_" + sectionIdSPlit).value;
                                    var jobName = document.getElementById("job_title_" + sectionIdSPlit).value;
                                    var mechanic = ''//document.getElementById("custpage_mechanic_id_" + sectionIdSPlit).value;
									var jobinternalid = jQuery("#job_title_"+ sectionIdSPlit).attr('data-jobid');
                                    var jobDetails = `job_${f}`;
                                    var jobDetails_1 = `job_${f+1}`;
									//alert('jobDetails'+jobDetails);
									$("tr[data-job="+jobDetails_1+"]").each(function(){debugger;
										var _obj={};
											_obj.job = jQuery(this).data('job');  
											_obj.jobcode = uniCode;
											_obj.technician = jQuery(this).find('select').val();
											_arrTech.push(_obj); 
									});
									//alert('_arrTech'+JSON.stringify(_arrTech));
                                    orderDetails[jobDetails] = {
                                        complain: complain,
                                        cause: cause,
                                        correction: correction,
                                        jobName: jobName,
                                        mechanic: mechanic,
                                        status: "",
										technicians:_arrTech,
                                        jobCode: uniCode,
										jobinternalid:jobinternalid 
                                    };

                                    // Add employees dynamically
                                    var jobs = [];

                                    for (var l = 0; l < allLinesCillection.length; l++) {

                                        var lineType   = document.getElementById('' + allLinesCillection[l] + '-field1').value;
                                        var itemNumber = document.getElementById('' + allLinesCillection[l] + '-field2').value;
                                        var lineQuan   = document.getElementById('' + allLinesCillection[l] + '-field3').value;
                                        var lineRate   = document.getElementById('' + allLinesCillection[l] + '-field4').value;
                                        var lineAmount = document.getElementById('' + allLinesCillection[l] + '-field5').value;
                                        var lineDisc   = document.getElementById('' + allLinesCillection[l] + '-field6').value;
                                        var lineTotal  = document.getElementById('' + allLinesCillection[l] + '-field7').value;
                                        var linetax    = document.getElementById('' + allLinesCillection[l] + '-field8').value;
                                        var linetechnician    = document.getElementById('' + allLinesCillection[l] + '-field9').value;
                                        var linegoalhrs    = document.getElementById('' + allLinesCillection[l] + '-field10').value;
                                        var margin = document.getElementById('' + allLinesCillection[l] + '-margin').value;
                                        var markup = document.getElementById('' + allLinesCillection[l] + '-markup').value;
                                        var cost = document.getElementById('' + allLinesCillection[l] + '-cost').value;
                                        var disp_price = document.getElementById('' + allLinesCillection[l] + '-disp_price').value;
                                        var disp_part_num = document.getElementById('' + allLinesCillection[l] + '-disp_part_num').value;
                                        var disp_desc = document.getElementById('' + allLinesCillection[l] + '-disp_desc').value;
                                        var item_id = document.getElementById('' + allLinesCillection[l] + '-item_id').value;
                                        var jobid  = jQuery('#' + allLinesCillection[l] + '-item_id').attr('data-jobid');
                                        var jobcode  = jQuery('#' + allLinesCillection[l] + '-jobcode').val();

                                        var jobLines = {
                                            lineType: lineType,
                                            itemNumber: itemNumber,
                                            lineQuan: lineQuan,
                                            lineRate: lineRate,
                                            lineAmount: lineAmount,
                                            lineDisc: lineDisc,
                                            lineTotal: lineTotal,
                                            linetax: linetax,
											goalhrs:linegoalhrs,
                                            margin: margin,
                                            markup: markup,
                                            cost: cost,
                                            disp_price: disp_price,
                                            disp_part_num: disp_part_num,
                                            disp_desc: disp_desc,
                                            item_id: item_id,
											complain:complain,
											cause:cause,
											correction:correction,
											jobid:jobid,
											jobcode:jobcode,
											technician:linetechnician
											
                                        };
                                        jobs.push(jobLines);

                                    }

                                    orderDetails[jobDetails].lines = jobs;
                                }
								var _spjobs = new Array();
								jQuery('.section').each(function(){
										var _spobj = {};
										
									  _spobj.jobName =  jQuery(this).find("input[id^='job_title_']").val();
									  _spobj.complain =  jQuery(this).find("[id^='custpage_complain_']").val();
									  _spobj.cause =  jQuery(this).find("[id^='custpage_cause_']").val();
									  _spobj.correction =  jQuery(this).find("[id^='custpage_correction_']").val();
										var _newArr = [];
										jQuery(this).find(".lines-container .line").each(function(){
											var _id = jQuery(this).attr('id');
											var _newobj = {};
										   _newobj.lineType         =  jQuery(this).find("#"+_id+"-field1").val(); 
											_newobj.item        	=  jQuery(this).find("#"+_id+"-field2").val();
											_newobj.lineQuan        =  jQuery(this).find("#"+_id+"-field3").val();
											_newobj.lineRate        =  jQuery(this).find("#"+_id+"-field4").val();
											_newobj.lineAmount      =  jQuery(this).find("#"+_id+"-field5").val();
											_newobj.lineDisc        =  jQuery(this).find("#"+_id+"-field6").val();
											_newobj.lineTotal       =  jQuery(this).find("#"+_id+"-field7").val();
											_newobj.linetax        	=  jQuery(this).find("#"+_id+"-field8").val(); 
											 _newobj.technician 	=  jQuery(this).find("#"+_id+"-field9").val(); 
											 _newobj.linegoalhrs 	=  jQuery(this).find("#"+_id+"-field10").val(); 
											 _newobj.itemid 		=  jQuery(this).find("#"+_id+"-item_id").val(); 
											 _newobj.itemavail 		=  jQuery(this).find("#"+_id+"-item_avail").val(); 
											 _newobj.jobid 			=  jQuery(this).find("#"+_id+"-item_id").attr('data-jobid'); 
											 _newobj.jobcode 		=  jQuery(this).find("#"+_id+"-jobcode").val(); 
											_newArr.push(_newobj)
											 
										});
										_spobj.lines = _newArr;
										_spjobs.push(_spobj)
									});
									orderDetails.spnewjobs = _spjobs;
								console.log('_spjobs',_spjobs);
                                $('#loader-overlay').show();
                                $.ajax({
                                    url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        'data_details': JSON.stringify(orderDetails),
                                        'action_type': 'service_order_estimate',
										'soid':salesorderid
                                    },

                                    success: function (data) {
                                        $('#loader-overlay').hide();

                                        console.log(data);

                                        var internalid = data.internalid,
                                        transactionType = data.type,
                                        transactionNumber = data.docunumer;

                                        var urlToOpen = "";

                                        if (transactionType == "salesorder") {
                                            // urlToOpen = "/app/accounting/transactions/salesord.nl?id=" + internalid;
                                            urlToOpen = "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1704&deploy=1&whence=&recid=" + internalid;
											jQuery('#custpage_open_order_docnumber').attr('data-recid',internalid)
                                            document.getElementById('custpage_open_order_docnumber').innerText = '#'+transactionNumber;
                                            document.getElementById('custpage_open_order_docnumer_main').style = "display:block";
                                            disableAllFieldsToMakeView();
                                        } else {
                                            transactionType = 'estimate';
                                            urlToOpen = "/app/accounting/transactions/estimate.nl?id=" + internalid;
                                            document.getElementById('custpage_open_quote_docnumber').innerText = transactionNumber;
                                            document.getElementById('custpage_open_quote_docnumer_main').style = "display:block";
                                        }

                                        //window.location.href = "/app/site/hosting/scriptlet.nl?script=customscript_ssst_service_dashboard_2&deploy=customdeploy_ssst_service_dashboard_2&id="+internalid+"ordertype="+transactionType;
                                        window.open(urlToOpen,'_self');

                                    }
                                });

                            }

                        }

                    }
                });

                // console.log(JSON.stringify(orderDetails, null, 2)); // Pretty-print the JSON
            }
            function disableAllFieldsToMakeView() {
                try {
                    jQuery('#custpage_save').hide();
                    jQuery('#custpage_edit').show();
                    jQuery('#custpage_new').show();
                    jQuery('.operationcontrols').hide();
                    jQuery('.mainoperations').hide();
                    jQuery('.line-actions').hide();

                    $(".line").find("input,button,textarea,select").attr("disabled", "disabled");
                    $(".complaincefields").find("input,button,textarea,select").attr("disabled", "disabled");
                } catch (e) {
                    log.debug('error', e.toString());
                }
            }
            function enabletheDetails() {
                try {
                    jQuery('#custpage_save').show();
                    jQuery('#custpage_edit').hide();
                    jQuery('#custpage_new').hide();
                    jQuery('.operationcontrols').show();
                    jQuery('.mainoperations').show();
                    jQuery('.line-actions').show();
					var cname = jQuery('#customeronviewname').text();
					var cval = jQuery('#customeronview').val();
					if(cval!='')
					{
						 jQuery('#custpage_customer_name').text(cname)
							jQuery('#custpage_customer_id').val(cval)
					}
					
                    $(".line").find("input,button,textarea,select").attr("disabled", false);
                    $(".complaincefields").find("input,button,textarea,select").attr("disabled", false);
                } catch (e) {
                    log.debug('error', e.toString());
                }
            }
            function getCurrentDateTime() {
                var now = new Date();
                var year = now.getFullYear();
                var month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                var day = String(now.getDate()).padStart(2, '0');
                var hours = String(now.getHours()).padStart(2, '0');
                var minutes = String(now.getMinutes()).padStart(2, '0');
                var seconds = String(now.getSeconds()).padStart(2, '0');

                return `${year}-${month}-${day} ${hours}:${minutes}`;
            }

            $('#custpage_current_date_time').val(getCurrentDateTime());

            // jQuery to handle changes in the datetime-local input
            $('#custpage_current_date_time').on('change', function () {
                var selectedDateTime = $(this).val();
                console.log('Selected Date and Time:', selectedDateTime);
            });

            var vinId = document.getElementById("selected_vehicle_id").value;

            if (vinId > 0) {
                afterVehicleSelectEvent();
            }

            let sectionCount = 0;
            let lineCount = 0;
			let lineTechCount = 0;

            let sectionCountPack = 100000;
            let lineCountPack = 100000;

            $(document).on('keydown', function (e) {

                if (document.getElementById("trainingModal").style.display == "block") {

                    if (event.key === 'ArrowRight') {
                        nextStep();
                    } else if (event.key === 'ArrowLeft') {
                        prevStep();
                    }

                }

                if (e.altKey && e.which === 74) {
                    createSection();
                }

                if (e.altKey && e.which === 83) {
                    SavetheDetails();
                }

                if (e.altKey && e.which === 80) {
                    CreatePackagePopup();
                }

                if (e.altKey && e.which === 65) {

                    if (document.getElementById("custpage_a_add_multi_page").style.display != "" && document.getElementById("custpage_a_add_multi_page").style.display != "none")
                        $('#custpage_a_add_multy_submit').click();

                }

                if (!e.shiftKey && e.altKey && e.which === 78) { // Alt + N


                    const activeSection = $('#sections-container .section:has(.line input:focus)').last();

                    if (activeSection.length) {
                        if (validateLine(activeSection.find('.line:last'))) {
                            activeSection.find('tbody').append(createLine(activeSection.attr('id')));
                            initAutocomplete(`#line-${lineCount}-field2`);
                            document.getElementById(`line-${lineCount}-field2`).focus();
                            appendLineCalcufield()
                        } else {
                            swal.fire(
                                'Error!',
                                'Please fill in all mandatory fields in the last line.',
                                'warning')
                        }
                    } else {

                        const currentSection = $('.section').last();

                        if (currentSection.length && validateLine(currentSection.find('.lines-container .line:last'))) {
                            currentSection.find('tbody').append(createLine(currentSection.attr('id')));
                            initAutocomplete(`#line-${lineCount}-field2`);

                            document.getElementById(`line-${lineCount}-field2`).focus();

                            tagOpenSidePanel();
                            appendLineCalcufield()
                        } else {
                            swal.fire(
                                'Error!',
                                'Please fill in all mandatory fields in the last line.',
                                'warning')
                        }

                    }
                }

                if (e.shiftKey && e.altKey && e.which === 78) { // shift + Alt + N

                    const activeSection = $('#sections-container .section:has(.line input:focus)').last();
                    var sectionid = activeSection.attr('id');
                    if (sectionid != undefined) {
                        document.getElementById("custpage_current_add_multy_sec_id").value = sectionid;
                        $('#custpage_a_add_multi_page').show();
                    }

                }

                if (!e.shiftKey && e.altKey && e.which === 77) {

                    const focusedElement = $(':focus');
                    if (focusedElement.length) {
                        const currentLine = focusedElement.closest('.line');
                        if (currentLine.length) {

                            swal.fire({
                                title: 'Are you sure you want to delete this line?',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    currentLine.remove();
                                    calculateLineAndHeader();
                                }
                            });

                        }
                    }
                }

                if (e.shiftKey && e.altKey && e.which === 77) {

                    const focusedElement = $(':focus');
                    if (focusedElement.length) {
                        const currentLine = focusedElement.closest('.line');
                        if (currentLine.length) {

                            swal.fire({
                                title: 'Are you sure you want to delete this job?',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const section = currentLine.closest('.section');
                                    section.remove();
                                    calculateLineAndHeader();
                                }
                            });

                        }
                    }
                }

                if (e.altKey && e.which === 86) {

                    const focusedElement = $(':focus');
                    if (focusedElement.length) {
                        var idOfField = focusedElement.attr('id');
                        if (idOfField.includes('line-')) {
                            var afterSplitData = idOfField.split("-");
                            var stringtoClick = "line-" + afterSplitData[1] + "-openslide";
                            try {
                                document.getElementById(stringtoClick).click();
                            } catch (err) {}
                        }
                    }
                }

                if (e.altKey && e.which === 67) {
                    try {
                        document.getElementsByClassName("settings-close")[0].click();
                    } catch (err) {}
                }

            });

            function createPackageSection(data) {

                var sectionHtml = "";
                for (var GH = 0; GH < data.length; GH++) {

                    var stringfyData = JSON.stringify(data[GH]);
                    sectionCountPack++;
                    const sectionId = `package-${sectionCountPack}`;
                    sectionHtml += ` <div class='package' id='${sectionId}' style="margin-top: 10px;">
                      
                                    <div class=\"section-header sectionheaderFontHeight\" style="background-color: #d7d7d7; font-weight: bold;">  
                    <span>  
                    <i class=\"fa fa-chevron-down toggle-section-package\" style="margin-left: 10px;"></i>  
                    </span>                      
                                        <input type=\"text\" value=\"${data[GH][0].packName}\" class=\"section-title sidepanelfontClass\" 
                                        style='margin-right:auto; padding:0px 25px;border: none !important;background: none !important; color:black !important;' disabled />                                                                             
                                        
                                        <input type="hidden" id="custpage_pack_seled_${sectionCountPack}" value="0"/>
                                        <input type="hidden" id="custpage_pack_name_${sectionCountPack}" value="${data[GH][0].packName}"/>
                                          
                                        <span style="width: 200px; display: flex; cursor: pointer;" id="custpage_pack_sel_${sectionCountPack}"><div style="color: black;" class="sidepanelfontClass">Select</div> </span>  
                                    </div> 
                                         
                                    <div class='section-content table-sorter-wrapper col-lg-12 table-responsivetable-sorter-wrapper col-lg-12 table-responsive' style="display: none;">  
                                       <table class='table' style="width: 90%;">  
                                       
                                            <thead>  
                                                <tr>  
                                                    <th class=\"thStyle\">Type</th>  
                                                    <th class="thStyle">Item</th>  
                                                    <th class=\"thStyle\" >Quantity</th>  
                                                    <th class="thStyle">Rate</th>  
                                                    <th class=\"thStyle\" >Amount</th>                                                                                                      
                                                    <th class="thStyle">Total</th>                                                   
                                                </tr>  
                                            </thead>  
                                            <tbody class=\"lines-container\"> 
                                            <input type="hidden" id="custpage_pack_line_count_${sectionCountPack}" value="${data[GH][0].packLen}"/>
                                            `;

                    for (var GL = 0; GL < data[GH][0].packLen; GL++) {
                        sectionHtml += `${createLinePackage(sectionId, data[GH], sectionCountPack, GL)}`;
                    }

                    sectionHtml += `      </tbody>
                                        </table>
                                        </div>
                                        </div>
                                    `;

                }

                return sectionHtml;
            }

            $(document).on('click', '#custpage_collapse_all', function () {
                toggeleAllSectionExplode(1);
            });

            $(document).on('click', '#custpage_fold_all', function () {
                toggeleAllSectionExplode(0);
            });
            function toggeleAllSectionExplode(expOrClo) {

                var allsectionCollection = $('[id^=section-]');

                for (var f = 0; f < allsectionCollection.length; f++) {

                    var sectionIdNumber = allsectionCollection[f].id.split("section-")[1];
                    var divIdString = "div_content_id_" + sectionIdNumber;

                    if (expOrClo == 1) {
                        document.getElementById(divIdString).style.display = "none";
                    } else {
                        document.getElementById(divIdString).style.display = "block";
                    }

                }
            }

            function createSection(fromPack, packNameDisp) {
                var isInternalCustomer = document.getElementById('custpage_isinternalcustomer').value;
                console.log('isInternalCustomer', isInternalCustomer);
                sectionCount++;
                const sectionId = `section-${sectionCount}`;

                var jobNameValue = `Job ${sectionCount}`;

                if (fromPack == 1) {
                    jobNameValue = packNameDisp;
                }

                var sectionHtml = ` <div class='section' id='${sectionId}'>
                      
                                    <div class=\"section-header sectionheaderFontHeight\" style="background-color: #d7d7d7; font-weight: bold;">  
                    <span style="margin-left: 12px;">  
                    <i class=\"fa fa-chevron-up toggle-section\"></i>  
                    </span>                      
                                        <input type=\"text\" value=\"${jobNameValue}\" class=\"section-title sidepanelfontClass\" id="job_title_${sectionCount}" name="job_title_${sectionCount}"
                                        style=\"margin-right:auto; padding:0px 25px;border: none !important;background: none !important;\">
                                        
                                        <span style="margin-right: 35px; font-weight: bolder;display: flex;">
                                        <i class=\"fa fa-usd sidepanelfontClass\" style='color:black; margin-top: 2px;'></i> 
                                        <div class='sidepanelfontClass' id='custpage_job_total_${sectionCount}' style="margin-left: 10px;"> </div> </span>
                                          
                                        <span class="sidepanelfontClass" id="authorizestatus${sectionCount}"><i class=\"fa fa-check-circle \" style='color:gray;'></i> Not Authorized </span>  `;
                if (isInternalCustomer == false) {
                    //sectionHtml += `<span class="sidepanelfontClass" ><button id="lockkey" onclick="authorizeViewOpen('${jobNameValue}','${sectionCount}')"><i class="fa-solid fa-lock"></i></button></span> `;
                } else {
                   // sectionHtml += `<span class="sidepanelfontClass" ><button id="requestcustomerscreen" onclick="authorizeCustomerViewOpen('${jobNameValue}','${sectionCount}')"><i class="fa-solid fa-lock"></i></button></span>  `;
                }

                sectionHtml += ` </div>
                                    
                                    

                                    <div class='section-content table-sorter-wrapper col-lg-12 table-responsivetable-sorter-wrapper table-responsive' id="div_content_id_${sectionCount}">  
                                       <table class='table' style="width: 100%;">  
                                       
                                            <thead>  
                                                <tr style="border-left: 10px solid transparent;">  
                                                    <th class=\"mandatory thStyle\">Type</th>  
                                                    <th class="thStyle">Item</th>  
                                                    <th class=\"mandatory thStyle\" >Quantity</th>  
                                                    <th class=\"mandatory thStyle\" >Goal Hrs</th>  
                                                    <th class="thStyle">Rate</th>  
                                                    <th class=\"mandatory thStyle\" >Amount</th>  
                                                    <th class="thStyle">Discount</th>
                                                    <th class="thStyle">Tax</th>  
                                                    <th class="thStyle">Total</th>  
                                                    <th class="thStyle">Technician</th>  
                                                 
                                                    <th class="thStyle">Actions</th>
                                                    <th class="thStyle">View</th>  
                                                </tr>  
                                            </thead>  
                                            <tbody class=\"lines-container\">  `;

                if (fromPack != 1 || fromPack == undefined) {

                   // sectionHtml += createLine(sectionId);
                }
				var techdata = JSON.parse(jQuery('#technicians-list').text())
                sectionHtml += ` </tbody>
                                        </table>  
                                
                              
                                <div style=\"display: flex; padding: 5px; margin-top: 10px;\" class="complaincefields">
                                <textarea style=\" margin-right: 13px; width: 32%;\" class=\"form-control tooltip-table textAreaPadding\" id=\"custpage_complain_${sectionCount}\" rows=\"2\"  placeholder=\"Customer Comment\"></textarea>
                                <textarea style=\" margin-right: 13px;  width: 32%;display:none;\" class=\"form-control tooltip-table textAreaPadding\" id=\"custpage_cause_${sectionCount}\" rows=\"2\"   placeholder=\"Cause\"></textarea>
                                <textarea style=" width: 32%;"  class=\"form-control tooltip-table textAreaPadding\" id=\"custpage_correction_${sectionCount}\" rows=\"2\"   placeholder=\"Technician Recommendation\"></textarea>
                                </div>
                                <br/>
								<div id='techassigndiv${sectionId}'>`;
								//sectionHtml += getTechAssignSections(sectionId);
							sectionHtml += `	</div>
                                
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
										
									<span class="fa-stack fa-2x add-multiline" style="margin-left: 50px; cursor: pointer;display:none;" id=\"custpage_a_add_multy_${sectionCount}\">
									<i class="fas fa-plus fa-stack-1x iconFontSize" style="margin-top: -4px;margin-left: 13px;color: gray;"></i>
									<i class="fas fa-plus fa-stack-1x iconFontSize"></i>
									</span>
										
										
									<span class="fa-stack fa-2x delete-multiline" style="margin-left: 50px; cursor: pointer;" id=\"custpage_a_delete_multy_${sectionCount}\">
									<i class="fas fa-trash fa-stack-1x iconFontSize" style="margin-top: -4px;margin-left: 13px;color: red;"></i>
									<i class="fas fa-trash fa-stack-1x iconFontSize" style="color: #ed835c;"></i>
									</span>
									
									<div style="width: 150px; margin-top: 10px;" >
									<i class="fa-solid fa-screwdriver-wrench add-mechanic iconFontSize" id='custpage_tech_icon_${sectionCount}' style='color:black; margin-left:60px; cursor: pointer;'></i>
									<div id="custpage_tech_name_${sectionCount}" style="font-weight: bold; text-align: center;"></div>
									</div>
                            
                            </div>
							
                            
                            <div class='tooltip' id='custpage_tech_popup_${sectionCount}' style="height: 350px;"> 
                            
                            <div style="font-size: 17px;font-weight: bold;color: cornflowerblue;">Assigne Mechanic</div>
                                                        
                               <button type='button' class='btn btn-inverse-dark btn-fw' id='custpage_a_apply_mechanic_${sectionCount}' style="margin-top: -20px; margin-left: 200px;">Apply</button>
                               <button type='button' class='btn btn-inverse-dark btn-fw' id='custpage_a_close_mechanic_${sectionCount}' style="margin-top: -20px; margin-left: 26px;">Close</button>
                                                     
                            <br/>
                             <div class="dropdown-container">
                             <input type="hidden" id='custpage_mechanic_id_${sectionCount}'/>`;
                             // <input type="text" class="dropdown-input" placeholder="Select Mechanic..." style='padding: 10px; width: 250px; margin-top: 27px;margin-left: 30px;' id='custpage_search_mechanic_${sectionCount}'>
                           sectionHtml += `  <div class="dropdown-list1">`;
							
							 
                            sectionHtml += `     <select id=\"fieldtech-${sectionId}\" class='inputStyle inputstyleWidth' style="padding: 10px  !important; width: -webkit-fill-available !important; border:none !important; background:none !important;"> `;
									sectionHtml += `<option value='' >Choose Technician</option>`; 
									for(var i=0;i<techdata.length;i++){
									sectionHtml += `<option value='${techdata[i].id}' >${techdata[i].name}</option>`; 
									}
								sectionHtml +=`</select>
                                <!-- List items will be populated by JavaScript -->
								
                            </div>
                        </div>                                                        
                            </div>                            
                            <input type="hidden" id="custpage_tech_id_${sectionCount}"/>                        
                                </div>                                
                                </div> 
								
                                
                            `;
                $('#sections-container').append(sectionHtml); 
				 
                if (fromPack != 1 || fromPack == undefined) {
                    initAutocomplete(`#line-${lineCount}-field2`);
                   // document.getElementById(`line-${lineCount}-field2`).focus();
                }

                mechanicAddCloseButton();
                appendLineCalcufield();
                calculateLineAndHeader();

                tagOpenSidePanel();
                
                 var options = [{id:'',name:''},{id:1,name:'shashank tyagi'},{id:2,name:'Anirudh tyagi'},{id:3,name:'Sharvan tyagi'},{id:4,name:'Peeyush tyagi'},{id:5,name:'Umesh tyagi'},{id:6,name:'Venu kumar'},{id:7,name:'Hem Jayaraman'},
                ]; 
				 //options = getTechnicians(options);
                console.log('options', options)
                function populateDropdown($dropdownList, options) {
                    $dropdownList.empty();
                    options.forEach(function (option) {
                        $dropdownList.append('<div class="dropdown-item" id="' + option.id + '">' + option.name + '</div>');
                    });
                }

                function filterDropdown($input, $dropdownList, options) {
                    var searchTerm = $input.val().toLowerCase();
                    var filteredOptions = options.filter(function (option) {
                        return option.name.toLowerCase().includes(searchTerm);
                    });
                    populateDropdown($dropdownList, filteredOptions);
                }

                // function AllSelectFieldActivate() {


                $('.dropdown-input').on('focus', function () {
                    var $dropdownList = $(this).siblings('.dropdown-list');
                    populateDropdown($dropdownList, options);
                    $dropdownList.show();
                });

                $('.dropdown-input').on('input', function () {
                    var $dropdownList = $(this).siblings('.dropdown-list');
                    filterDropdown($(this), $dropdownList, options);
                });

                $('.dropdown-input').on('blur', function () {
                    var $dropdownList = $(this).siblings('.dropdown-list');
                    setTimeout(function () {
                        $dropdownList.hide();
                    }, 200);
                });

                $(document).on('click', '.dropdown-item', function () {
                    var selectedValue = $(this).text();
                    var mechanicId = this.id;
                    var $input = $(this).closest('.dropdown-container').find('.dropdown-input');
                    var baseSectionId = $input.attr('id').split("custpage_search_mechanic_")[1];

                    if (mechanicId > 0) {
                        document.getElementById("custpage_tech_icon_" + baseSectionId).style.color = 'green';
                        document.getElementById("custpage_tech_name_" + baseSectionId).innerHTML = selectedValue;

                    } else {
                        document.getElementById("custpage_tech_icon_" + baseSectionId).style.color = 'black';
                        document.getElementById("custpage_tech_name_" + baseSectionId).innerHTML = '';
                    }

                    $input.val(selectedValue);
                    $("#custpage_mechanic_id_" + baseSectionId).val(mechanicId);

                    $(this).closest('.dropdown-list').hide();
                });
            }

            function mechanicAddCloseButton() {

                $('[id^="custpage_a_close_mechanic_"]').on('click', function () {

                    var techIconId = this.id.split("custpage_a_close_mechanic_")[1];
                    var popupId = "custpage_tech_popup_" + techIconId;

                    var currentTooltip = document.getElementById(popupId);

                    currentTooltip.style.display = 'none';
                    currentTooltip.style.opacity = 0;
                    document.querySelector('.tooltip-overlay').style.display = 'none';

                });

            }
				$(document).on('click', '[id^="custpage_a_apply_mechanic_"]',function () {

                    var techIconId = this.id.split("custpage_a_apply_mechanic_")[1];
                    var popupId = "custpage_tech_popup_" + techIconId;
					var technician = jQuery('#fieldtech-section-'+techIconId).val();
                    var currentTooltip = document.getElementById(popupId);
						jQuery('#section-'+techIconId+' .lines-container .line').each(function(){
								var _id = jQuery(this).attr('id');
								var _lineType = jQuery(this).find('#'+_id+'-field1').val()
								if(_lineType==3)
								{
									jQuery(this).find('#'+_id+'-field9').val(technician);
								}
						})
                    currentTooltip.style.display = 'none';
                    currentTooltip.style.opacity = 0;
                    document.querySelector('.tooltip-overlay').style.display = 'none';

                });

            function appendLineCalcufield() {

                $('[id$="-field3"],[id$="-field4"],[id$="-field6"]').on('change', function () {
                    calculateLineAndHeader();
                });
            }
$(document).on('change','[id$="custpage_job_shop_head"],[id$="custpage_job_disc_head"],[id$="custpage_job_disc_head_symbol"]', function () {

                    calculateLineAndHeader();

                });
            function setDiscountAndTax() {

                $(document).on('change','[id$="custpage_job_shop_head"],[id$="custpage_job_disc_head"],[id$="custpage_job_disc_head_symbol"]', function () {

                    calculateLineAndHeader();

                });

                $('[id^="custpage_job_tax_head"]').on('change', function () {
                    var changedFIeldId = this.id;

                    var allsectionCollection = $('[id^=section-]');

                    for (var f = 0; f < allsectionCollection.length; f++) {

                        var allLinesCillection = $('#' + allsectionCollection[f].id + ' .lines-container .line').map(function () {
                            return this.id;
                        }).get().filter(function (id) {
                            return id.startsWith('line-');
                        });
                        for (var l = 0; l < allLinesCillection.length; l++) {
                            document.getElementById('' + allLinesCillection[l] + '-field8').value = document.getElementById(changedFIeldId).value;
                        }

                    }

                    calculateLineAndHeader();
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
                            document.getElementById('' + allLinesCillection[l] + '-field5').value = parseFloat((lineQuan * 1 * lineRate * 1)).toFixed(2);

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

                            document.getElementById('' + allLinesCillection[l] + '-field7').value = parseFloat(tempCalc).toFixed(2);
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

                var shopSupplyAmount = 0;

                if (shopSupplyPer > 0) {
                    shopSupplyAmount = (TotalLabor * 1 * shopSupplyPer) / 100;
                } else {
                    shopSupplyAmount = 0;
                }

                document.getElementById("custpage_total_sub_discount").innerHTML = "$ " + TotalDiscount.toFixed(2);
                document.getElementById("custpage_total_shop_supply").innerHTML = "$ " + shopSupplyAmount.toFixed(2);

                document.getElementById("custpage_total_grand").innerHTML = "$ " + (TotalSublet * 1 + TotalLabor * 1 + TotalParts * 1 + TotalTax * 1 + shopSupplyAmount * 1 - TotalDiscount * 1).toFixed(2);

            }

            function createLinePackage(section, data, sectionCount, lineCount) {

                // console.log(data[lineCount]);

                const lineId = `line-${sectionCount}-${lineCount}`;
                var lineHtml = `
                                <tr class=\"line\" id=\"${lineId}\">  
                                 <input type="hidden" id="${lineId}-data" value='${JSON.stringify(data[lineCount]).replace(/'/g, '')}'/>                    
                                <td style='border:none !important; background:none !important; width: 80px !important;'>
                                <select id=\"${lineId}-field1\" class='inputStyle' style="padding: 10px  !important; width: -webkit-fill-available !important; border:none !important; background:none !important; " disabled> `;

                var laborSelect = '',
                partSelect = '',
                subletSelect = '';

                if (data[lineCount].invType == 2) {
                    partSelect = 'selected';
                } else if (data[lineCount].invType == 3) {
                    laborSelect = 'selected';
                } else if (data[lineCount].invType == 4) {
                    subletSelect = 'selected';
                }

                lineHtml += `   <option value='3' ${laborSelect}>Labor</option>
                                    <option value='2' ${partSelect}>Parts</option>
                                    <option value='4' ${subletSelect}>Sublet</option>`;
                lineHtml += ` </select>
                                </td>  
                                <td><input type=\"text\" id=\"${lineId}-field2\" class=\"inputStyle\" style='border:none !important; background:none !important; width: 200px !important;' disabled value='${data[lineCount].itemName}'></td>  
                                <td><input type=\"text\" id=\"${lineId}-field3\" style='border:none !important; background:none !important; width: 80px !important;' class='inputStyle' disabled value='${data[lineCount].quantity}'></td>  
                               <td><input type=\"text\" id=\"${lineId}-field4\" style='border:none !important; background:none !important; width: 80px !important;' class='inputStyle' disabled value='${data[lineCount].itemPrice}'></td>  
                                <td><input type=\"text\" id=\"${lineId}-field5\" style='border:none !important; background:none !important; width: 80px !important;' class='inputStyle' disabled value='${data[lineCount].lineAmount}'></td>                                                                  
                                <td><input type=\"text\" id=\"${lineId}-field7\" style='border:none !important; background:none !important; width: 80px !important;' class='inputStyle' disabled value='${data[lineCount].lineAmount}'></td>
                                <input type='hidden' id='${lineId}-item-id' value='${data[lineCount].itemId}'/>              
                                </tr>  
                            `;

                return lineHtml;

            }

            function createLine(section, dataToSet,linetype) {

                //Create job line
                var invType_L = "",
                itemNumber_L = "",
                Quantity_L = "",
                Rate_L = "",
                Amount_L = "",
                Discount_L = "",
                Tax_L = "",
                Total_L = "",
                GoalHrs_L = "",
                itemId_L = "",
				itemAvail_L ="";
				var disabledattr='';
                var laborSelect = '',
                partSelect = '',
                subletSelect = '';
                coreSelect = '';

                if (dataToSet != undefined && dataToSet != "" && dataToSet != "undefined" && dataToSet != "null" && dataToSet != null) {
                    dataToSet = JSON.parse(dataToSet);

                    invType_L = dataToSet.invType,
                    itemNumber_L = dataToSet.itemName,
                    Quantity_L = dataToSet.quantity,
                    Rate_L = dataToSet.itemPrice,
                    Amount_L = dataToSet.lineAmount,
                    Discount_L = 0,
                    Tax_L = 7;//document.getElementById("custpage_job_tax_head").value,
                    Total_L = dataToSet.lineAmount,
                    itemId_L = dataToSet.itemId;
                    itemAvail_L = dataToSet.itemAvail;

                    if (invType_L == 2) {
                        partSelect = 'selected';
						disabledattr ='disabled';
                    } else if (invType_L == 3) {
                        laborSelect = 'selected';
						disabledattr ='';
                    } else if (invType_L == 4) {
                        subletSelect = 'selected';
						disabledattr ='disabled';
                    } else if (invType_L == 9) {
                        coreSelect = 'selected';
						disabledattr ='disabled';
                    }
                }else{
					invType_L = linetype;
					  if (invType_L == 2) {
                        partSelect = 'selected';
						disabledattr ='disabled';
                    } else if (invType_L == 3) {
                        laborSelect = 'selected';
						disabledattr ='';
                    } else if (invType_L == 4) {
                        subletSelect = 'selected';
						disabledattr ='disabled';
                    }else if (invType_L == 9) {
                        coreSelect = 'selected';
						disabledattr ='disabled';
                    }
					 Tax_L = 7;
				}

                lineCount++;
                const lineId = `line-${lineCount}`;
				var techdata = JSON.parse(jQuery('#technicians-list').text())
                var lineHtml = `
                                <tr class=\"line\" id=\"${lineId}\" style="border-left: 10px solid transparent;">  
                                     
                
                                <td style='border:none !important; background:none !important;'>
                                <select id=\"${lineId}-field1\" class='inputStyle inputstyleWidth' style="padding: 10px  !important; width: -webkit-fill-available !important; border:none !important; background:none !important;"> 
                <option value='3' ${laborSelect}>Labor</option>
                <option value='2' ${partSelect}>Parts</option>               
                <option value='4' ${subletSelect}>Sublet</option> 
                <option value='9' ${coreSelect}>Corecharge</option> 
                </select></td>  
                                <td><input type=\"text\" id=\"${lineId}-field2\" class=\"autocomplete inputStyle\" style='border:none !important; background:none !important; ' value="${itemNumber_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field3\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' value="${Quantity_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field10\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' ${disabledattr} value="${GoalHrs_L}"></td>  
                               <td><input type=\"text\" id=\"${lineId}-field4\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' value="${Rate_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field5\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' disabled value="${Amount_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field6\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' value="${Discount_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field8\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' disabled value="${Tax_L}"></td>
                                <td><input type=\"text\" id=\"${lineId}-field7\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' disabled value="${Total_L}"></td>   
                                   
								<td style='border:none !important; background:none !important;'>
                                <select id=\"${lineId}-field9\" class='inputStyle inputstyleWidth' ${disabledattr} style="padding: 10px  !important; width: -webkit-fill-available !important; border:none !important; background:none !important;"> `;
									lineHtml += `<option value='' >Technician</option>`;
									for(var i=0;i<techdata.length;i++){
									lineHtml += `<option value='${techdata[i].id}' >${techdata[i].name}</option>`; 
									}
								lineHtml +=`</select></td>  
                <td style="width: 120px;"> 
                                    <span class=\"line-actions\">  
                                         <i class=\"fa fa-edit edit-line iconFontSize\" style='color:gray; margin-right:10px;'></i>  
                                        <i class=\"fa fa-check add-line-btn iconFontSize\" style='color:green; margin-right:10px;'></i>  
                                        <i class=\"fa fa-trash delete-line iconFontSize\" style='color:red;'></i>  
                                    </span>  
                                 </td> 
                                 <td><i class="fa fa-eye openSidepannel iconFontSize" id="${lineId}-openslide"></i></td>
                                 <input type="hidden" id="${lineId}-item_id" value="${itemId_L}"/>
                                 <input type="hidden" id="${lineId}-item_avail" value="${itemAvail_L}"/>
                                 <input type="hidden" value="" id="${lineId}-margin"/>
                                 <input type="hidden" value="" id="${lineId}-markup"/>
                                 <input type="hidden" value="" id="${lineId}-cost"/>
                                 <input type="hidden" value="" id="${lineId}-disp_price"/>
                                 <input type="hidden" value="" id="${lineId}-disp_part_num"/>
                                 <input type="hidden" value="" id="${lineId}-disp_desc"/>
								 
                                 <input type="hidden" value="" id="${lineId}-inc_msg"/>
                                <input type="hidden" value="" id="${lineId}-inc_auth"/>
                                <input type="hidden" value="" id="${lineId}-inc_appoint"/>
                                <input type="hidden" value="" id="${lineId}-inc_job"/>
                                <input type="hidden" value="" id="${lineId}-inc_qty"/>
                                <input type="hidden" value="" id="${lineId}-inc_price"/>


                                <input type="hidden" value="" id="${lineId}-print-job_data"/>
                                <input type="hidden" value="" id="${lineId}-print-qty_data"/>
                                <input type="hidden" value="" id="${lineId}-print-price_data"/>
                                <input type="hidden" value="" id="${lineId}-print-auth"/>
                                <input type="hidden" value="" id="${lineId}-print-msg"/>
                                <input type="hidden" value="" id="${lineId}-print-appoint"/>
                                </tr>  
                            `;

                return lineHtml;
            }
			function createcoreLine(section, dataToSet,linetype) {

                //Create job line
                var invType_L = "",
                itemNumber_L = "",
                Quantity_L = "",
                Rate_L = "",
                Amount_L = "",
                Discount_L = "",
                Tax_L = "",
                Total_L = "",
                GoalHrs_L = "",
                itemId_L = "";
				var disabledattr='';
                var laborSelect = '',
                partSelect = '',
                subletSelect = '';
                coreSelect = '';

                if (dataToSet != undefined && dataToSet != "" && dataToSet != "undefined" && dataToSet != "null" && dataToSet != null) {
                    dataToSet = JSON.parse(dataToSet);

                    invType_L = dataToSet.invType,
                    itemNumber_L = dataToSet.itemName,
                    Quantity_L = dataToSet.quantity,
                    Rate_L = dataToSet.itemPrice,
                    Amount_L = dataToSet.lineAmount,
                    Discount_L = 0,
                    Tax_L = 7;//document.getElementById("custpage_job_tax_head").value,
                    Total_L = dataToSet.lineAmount,
                    itemId_L = dataToSet.itemId;

                    if (invType_L == 2) {
                        partSelect = 'selected';
						disabledattr ='disabled';
                    } else if (invType_L == 3) {
                        laborSelect = 'selected';
						disabledattr ='';
                    } else if (invType_L == 4) {
                        subletSelect = 'selected';
						disabledattr ='disabled';
                    } else if (invType_L == 9) {
                        coreSelect = 'selected';
						disabledattr ='disabled';
                    }
                }else{
					invType_L = linetype;
					  if (invType_L == 2) {
                        partSelect = 'selected';
						disabledattr ='disabled';
                    } else if (invType_L == 3) {
                        laborSelect = 'selected';
						disabledattr ='';
                    } else if (invType_L == 4) {
                        subletSelect = 'selected';
						disabledattr ='disabled';
                    }else if (invType_L == 9) {
                        coreSelect = 'selected';
						disabledattr ='disabled';
                    }
					 Tax_L = 7;
				}

                lineCount++;
                const lineId = `line-${lineCount}`;
				var techdata = JSON.parse(jQuery('#technicians-list').text())
                var lineHtml = `
                                <tr class=\"line\" id=\"${lineId}\" style="border-left: 10px solid transparent;">  
                                     
                
                                <td style='border:none !important; background:none !important;'>
                                <select id=\"${lineId}-field1\" class='inputStyle inputstyleWidth' style="padding: 10px  !important; width: -webkit-fill-available !important; border:none !important; background:none !important;"> 
                <option value='3' ${laborSelect}>Labor</option>
                <option value='2' ${partSelect}>Parts</option>               
                <option value='4' ${subletSelect}>Sublet</option> 
                <option value='9' ${coreSelect}>Corecharge</option> 
                </select></td>  
                                <td><input type=\"text\" id=\"${lineId}-field2\" class=\"autocomplete inputStyle\" style='border:none !important; background:none !important; ' value="${itemNumber_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field3\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' value="${Quantity_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field10\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' ${disabledattr} value="${GoalHrs_L}"></td>  
                               <td><input type=\"text\" id=\"${lineId}-field4\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' value="${Rate_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field5\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' disabled value="${Amount_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field6\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' value="${Discount_L}"></td>  
                                <td><input type=\"text\" id=\"${lineId}-field8\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' disabled value="${Tax_L}"></td>
                                <td><input type=\"text\" id=\"${lineId}-field7\" style='border:none !important; background:none !important;' class='inputStyle inputstyleWidth' disabled value="${Total_L}"></td>   
								<td style='border:none !important; background:none !important;'>
                                <select id=\"${lineId}-field9\" class='inputStyle inputstyleWidth' ${disabledattr} style="padding: 10px  !important; width: -webkit-fill-available !important; border:none !important; background:none !important;"> `;
									lineHtml += `<option value='' >Technician</option>`;
									for(var i=0;i<techdata.length;i++){
									lineHtml += `<option value='${techdata[i].id}' >${techdata[i].name}</option>`; 
									}
								lineHtml +=`</select></td>  
                <td style="width: 120px;"> 
                                    <span class=\"line-actions\">  
                                         <i class=\"fa fa-edit edit-line iconFontSize\" style='color:gray; margin-right:10px;'></i>  
                                        <i class=\"fa fa-check add-line-btn iconFontSize\" style='color:green; margin-right:10px;'></i>  
                                        <i class=\"fa fa-trash delete-line iconFontSize\" style='color:red;'></i>  
                                    </span>  
                                 </td> 
                                 <td><i class="fa fa-eye openSidepannel iconFontSize" id="${lineId}-openslide"></i></td>
                                 <input type="hidden" id="${lineId}-item_id" value="${itemId_L}"/>
                                 <input type="hidden" value="" id="${lineId}-margin"/>
                                 <input type="hidden" value="" id="${lineId}-markup"/>
                                 <input type="hidden" value="" id="${lineId}-cost"/>
                                 <input type="hidden" value="" id="${lineId}-disp_price"/>
                                 <input type="hidden" value="" id="${lineId}-disp_part_num"/>
                                 <input type="hidden" value="" id="${lineId}-disp_desc"/>
								 
                                 <input type="hidden" value="" id="${lineId}-inc_msg"/>
                                <input type="hidden" value="" id="${lineId}-inc_auth"/>
                                <input type="hidden" value="" id="${lineId}-inc_appoint"/>
                                <input type="hidden" value="" id="${lineId}-inc_job"/>
                                <input type="hidden" value="" id="${lineId}-inc_qty"/>
                                <input type="hidden" value="" id="${lineId}-inc_price"/>


                                <input type="hidden" value="" id="${lineId}-print-job_data"/>
                                <input type="hidden" value="" id="${lineId}-print-qty_data"/>
                                <input type="hidden" value="" id="${lineId}-print-price_data"/>
                                <input type="hidden" value="" id="${lineId}-print-auth"/>
                                <input type="hidden" value="" id="${lineId}-print-msg"/>
                                <input type="hidden" value="" id="${lineId}-print-appoint"/>
                                </tr>  
                            `;

                return lineHtml;
            }
			function createTechLine(section, dataToSet) {
				var techdata = JSON.parse(jQuery('#technicians-list').text())
				var sectionnum = section.split('-')[1];
                lineTechCount++;
                const lineId = `linetech-${lineTechCount}`;
                var lineHtml = `
                                <tr class=\"line\" id=\"${lineId}\" data-job=\"job_${sectionnum}\"style="border-left: 10px solid transparent;">  
                                     
                
                                <td style='border:none !important; background:none !important;'>
                                <select id=\"${lineId}-field1\" class='inputStyle inputstyleWidth' style="padding: 10px  !important; width: -webkit-fill-available !important; border:none !important; background:none !important;">  `;
									for(var i=0;i<techdata.length;i++){
									lineHtml += `<option value='${techdata[i].id}' >${techdata[i].name}</option>`;
										  
									}
									
               lineHtml += ` </select></td>  
                                <td><i class=\"fa fa-plus add-line-tech iconFontSize\" style='margin-left:30px;color:green; margin-top:15px;'></i>
										
										<i class=\"fa fa-trash delete-tech-line iconFontSize\" style='color:red; margin-left:30px; margin-top: 15px;'></i></td>                                                              
                
                                 <input type="hidden" id="${lineId}-item_id" value=""/>
                                </tr>  
                            `;

                return lineHtml;
            }

            $(document).on('click', '#add-section', function () {
				var editmode = jQuery('#custpage_open_order_docnumber').attr('data-recid');
				var sections = jQuery('#sections-container div.section').length;
				if(editmode!=0){sectionCount = sections;}
                createSection();
            });

            $(document).on('click', '#add-package', function () {

                CreatePackagePopup();
            });

            function CreatePackagePopup() {

                $('#loader-overlay').show();

                var vinId = document.getElementById("selected_vehicle_id").value;

                $.ajax({
                    url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        'vinIdPack': vinId
                    },
                    success: function (data) {

                        const popup = $('#popup_package');
                        popup.empty();

                        var sectionHtml = " <div style='position: sticky;top : 0; background: #d7d7d7;'>  <button type='button' class='btn btn-gradient-success no-wrap ms-4  multiAddpopupButton' id='custpage_a_add_package_submit'>Add Package</button> " +
                            "   <button type='button' class='btn btn-inverse-dark btn-fw  multiAddpopupButton' id='custpage_a_add_package_close'>Close</button> </div>";

                        sectionHtml += createPackageSection(data);

                        popup.append(sectionHtml);

                        popup.show();

                        $('[id^=custpage_pack_sel_]').on('click', function () {

                            var packId = this.id;

                            var packageId = (this.id).split("custpage_pack_sel_")[1];

                            var packSelected = document.getElementById("custpage_pack_seled_" + packageId).value;

                            if (packSelected == 0 || packSelected == "") {
                                document.getElementById(packId).innerHTML = '<i class="fa fa-check-circle" style="color:green; margin-right: 20px;"></i> <div style="color: green;" class="sidepanelfontClass">Selected</div> ';
                                document.getElementById("custpage_pack_seled_" + packageId).value = packageId;
                            } else {
                                document.getElementById(packId).innerHTML = '<div style="color: black;" class="sidepanelfontClass">Select</div> ';
                                document.getElementById("custpage_pack_seled_" + packageId).value = 0;
                            }

                        });

                        $('#custpage_a_add_package_close').on('click', function () {
                            document.getElementById("popup_package").style.display = 'none';
                        });

                        $('#custpage_a_add_package_submit').on('click', function () {

                            swal.fire({
                                title: 'Are you sure you want to add Selected packages?',
                                text: 'Job will be created by Package, and all BOM will add in job.',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes'
                            }).then((result) => {
                                if (result.isConfirmed) {

                                    var selectedPackage = document.querySelectorAll('[id^="custpage_pack_sel_"]');

                                    for (var i = 0; i < selectedPackage.length; i++) {

                                        var packageId = (selectedPackage[i].id).split("custpage_pack_sel_")[1];
                                        var packSelected = document.getElementById("custpage_pack_seled_" + packageId).value;
                                        var packNameDisp = document.getElementById("custpage_pack_name_" + packageId).value;
                                        if (packSelected > 0) {

                                            createSection(1, packNameDisp);
                                            var packLineCount = document.getElementById("custpage_pack_line_count_" + packageId).value;
                                            for (var L = 0; L < packLineCount; L++) {
                                                var lineIdToCheck = "line-" + packageId + "-" + L + "-data";
                                                var selectedPackageLineData = document.getElementById(lineIdToCheck).value;

                                                var currentSection = $('#section-' + sectionCount);
                                                currentSection.find('tbody').append(createLine("", selectedPackageLineData));

                                            }

                                        }

                                    }
                                    tagOpenSidePanel();

                                    document.getElementById("popup_package").style.display = 'none';

                                    calculateLineAndHeader();

                                }
                            });

                        });

                        $('#loader-overlay').hide();
                    },
                    error: function (xhr, status, error) {
                        $('#loader-overlay').hide();
                        console.error('Error fetching autocomplete suggestions:', error);
                    }
                });

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

                            }
                             else if (invType == 3) {
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
                                </table>
                                </div>
                                            `;

                            }
                            else if (invType == 4) {

                                htmlStringToDisplay += `
                                <h2 class="thStyle" style="text-align: center;">Sublet Summary</h2>         
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
                                
                               
                                
                                                             
                                </table>
                                
                                </div>
                                            `;

                            } 

                            document.getElementById("setting-content_1").innerHTML = htmlStringToDisplay;

                            $(document).on('click', '.ios-checkbox', function () {

                                var checkboxStatus = document.getElementById(this.id).checked;

                                var lineId = document.getElementById("custpage_main_line_id").value;
                                var lineType = document.getElementById("custpage_main_line_type").value;

                                if (this.id == "ios-toggle") {
                                    document.getElementById("line-" + lineId + "-disp_price").value = checkboxStatus;
                                } else if (this.id == "ios-toggle_1") {
                                    document.getElementById("line-" + lineId + "-disp_part_num").value = checkboxStatus;
                                } else if (this.id == "ios-toggle_2") {
                                    document.getElementById("line-" + lineId + "-disp_desc").value = checkboxStatus;
                                }

                            });

                            $(document).on('change', '.sliderinput', function () {

                                var fieldData = document.getElementById(this.id).value;

                                var lineType = document.getElementById("custpage_main_line_type").value;

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

            $(document).on('click', '.add-line', function () {
                const section = $(this).closest('.section');
                if (validateLine(section.find('tbody .line:last'))) {
					var _linetype = jQuery(this).attr('value');
                    section.find('tbody').append(createLine(section.attr('id'),'',_linetype));
                    initAutocomplete(`#line-${lineCount}-field2`);
                    document.getElementById(`line-${lineCount}-field2`).focus();
                    tagOpenSidePanel();
                    appendLineCalcufield();
                } else {
                    swal.fire(
                        'Error!',
                        'Please fill all mandatory fields.',
                        'warning')
                }
            });
			
			$(document).on('click', '.add-line-tech', function () {
				
                const section = $(this).closest('.sectiontech');
                if (validateLine(section.find('tbody .line:last'))) {
                    section.find('tbody').append(createTechLine(section.attr('id')));
                    //initAutocomplete(`#linetech-${lineTechCount}-field1`);
                   // document.getElementById(`linetech-${lineTechCount}-field1`).focus(); 
                } else {
                    swal.fire(
                        'Error!',
                        'Please fill all mandatory fields.',
                        'warning')
                }
            });

            $(document).on('click', '.add-multiline', function () {
                const section = $(this).closest('.section');
                var sectionid = this.id;
                document.getElementById("custpage_current_add_multy_sec_id").value = "section-" + sectionid.split("custpage_a_add_multy_")[1];
                $('#custpage_a_add_multi_page').show();

            });

            $(document).on('click', '.add-mechanic', function () {
				var techIconId = this.id.split("custpage_tech_icon_")[1];
				 var sectionId = "techsection-" + techIconId;
				 
				 /* if(jQuery('#techassigndiv').text().trim() == ''){
					 var _sectionId = "section-" + techIconId;
					var _techsection = getTechAssignSections(_sectionId);
					jQuery('#techassigndivsection-'+techIconId).html(_techsection);
				} */
                 var techIconId = this.id.split("custpage_tech_icon_")[1];
                var popupId = "custpage_tech_popup_" + techIconId;

                var currentTooltip = document.getElementById(popupId);

                currentTooltip.style.display = 'block';
                currentTooltip.style.opacity = 1;
                document.querySelector('.tooltip-overlay').style.display = 'block'; 
				var element = '#'+sectionId;
				 jQuery(element).toggle();
				
            });

            $(document).on('click', '.delete-multiline', function () {

                swal.fire({
                    title: 'Are you sure you want to delete all lines?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                }).then((result) => {
                    if (result.isConfirmed) {

                        const section = $(this).closest('.section');

                        const lineCount = section.find('tr').length;
                        const contentData = section.find('tr');

                        const line_d = $(contentData).closest('tr');
                        line_d.remove();

                        var tableHeader = "<tr style=\"border-left: 10px solid transparent;\"> " +
                            "<th class=\"mandatory thStyle\">Type</th>   " +
                            "                                                    <th class=\"thStyle\">Item</th>   " +
                            "                                                    <th class=\"mandatory thStyle\" >Quantity</th>   " +
                            "                                                    <th class=\"thStyle\">Rate</th>   " +
                            "                                                    <th class=\"mandatory thStyle\" >Amount</th>   " +
                            "                                                    <th class=\"thStyle\">Discount</th> " +
                            "                                                    <th class=\"thStyle\">Tax</th>   " +
                            "                                                    <th class=\"thStyle\">Total</th>   " +
                            "                                                  " +
                            "                                                    <th class=\"thStyle\">Actions</th>  " +
                            "                                                    <th class=\"thStyle\">View</th>  " +
                            "                    </tr>";
                        section.find('thead').append(tableHeader);

                        calculateLineAndHeader();

                    }
                });

            });

            $(document).on('click', '.toggle-section', function () {
                const sectionContent = $(this).closest('.section').find('.section-content');
                sectionContent.slideToggle();
                $(this).toggleClass('fa-chevron-up fa-chevron-down');
            });

            $(document).on('click', '.toggle-section-package', function () {
                const sectionContent = $(this).closest('.package').find('.section-content');
                sectionContent.slideToggle();
                $(this).toggleClass('fa-chevron-down fa-chevron-up');
            });

            $(document).on('click', '.delete-section', function () {

                swal.fire({
                    title: 'Are you sure you want to delete this Job?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $(this).closest('.section').remove();
                        calculateLineAndHeader();
                    }
                });
            });

            $(document).on('click', '.delete-line', function () {
                const line = $(this).closest('tr');
                const section = line.closest('.section');
                const lineCount = section.find('tr').length;

                if (lineCount === 2) {

                    swal.fire({
                        title: 'This is the last line. Deleting it will remove the entire Job. Are you sure?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            section.remove();
                            calculateLineAndHeader();
                        }
                    });

                } else {

                    swal.fire({
                        title: 'Are you sure you want to delete this line?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            line.remove();
                            calculateLineAndHeader();
                        }
                    });

                }
            });
			 $(document).on('click', '.delete-tech-line', function () {
                const line = $(this).closest('tr');
                const section = line.closest('.sectiontech');
                const lineCount = section.find('tr').length;

                if (lineCount === 2) {

                    swal.fire({
                        title: 'This is the last line. Deleting it will remove the entire Job. Are you sure?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            section.remove();
                            //calculateLineAndHeader();
                        }
                    });

                } else {

                    swal.fire({
                        title: 'Are you sure you want to delete this line?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            line.remove();
                            //calculateLineAndHeader();
                        }
                    });

                }
            });
            $(document).on('click', '.edit-line', function () {
                const line = $(this).closest('tr');
                line.find('input').prop('disabled', false);
            });

            $(document).on('click', '.add-line-btn', function () {
                const line = $(this).closest('tr');
                if (validateLine(line)) {
                    line.find('input').prop('disabled', true);
                } else {

                    swal.fire(
                        'Error!',
                        'Please fill all mandatory fields.',
                        'warning')
                }
            });

            $(document).on('click', '#custpage_a_add_multy_submit', function () {

                swal.fire({
                    title: 'Are you sure you want to add all selected lines?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $('#loader-overlay').show();

                        document.querySelector('.popupMulti').style.display = 'none';

                        var vinId = document.getElementById("selected_vehicle_id").value;

                        $.ajax({
                            url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
                            dataType: 'json',
                            type: 'POST',
                            data: {
                                'vinIdDel': vinId,
                                'itemIdDel': 1
                            },
                            success: function (data) {

                                var secIdToSet = document.getElementById("custpage_current_add_multy_sec_id").value;
                                var currentSection = $('#' + secIdToSet);

                                for (var SL = 0; SL < data.items.length; SL++) {

                                    currentSection.find('tbody').append(createLine(secIdToSet));

                                    initAutocomplete(`#line-${lineCount}-field2`);

                                    document.getElementById(`line-${lineCount}-field2`).focus();

                                    var mainId = `line-${lineCount}-`;

                                    document.getElementById('' + mainId + 'field1').value = data.items[SL].type;
                                    document.getElementById('' + mainId + 'field2').value = data.items[SL].number;
                                    document.getElementById('' + mainId + 'field3').value = 1;
                                    document.getElementById('' + mainId + 'field4').value = data.items[SL].price;
                                    document.getElementById('' + mainId + 'field5').value = data.items[SL].price;
                                    document.getElementById('' + mainId + 'field6').value = 0;
                                    document.getElementById('' + mainId + 'field8').value = document.getElementById("custpage_job_tax_head").value || 0;
                                    document.getElementById('' + mainId + 'field7').value = data.items[SL].price;
                                    document.getElementById('' + mainId + 'item_id').value = data.items[SL].id;

                                    if (typeId == 2) {
                                        document.getElementById('' + mainId + 'cost').value = data.items[SL].price;

                                        var costAvg = data.items[SL].price;
                                        var baseprice = data.items[SL].price;

                                        costAvg = costAvg * 1;
                                        baseprice = baseprice * 1;

                                        console.log(costAvg + " baseprice->" + baseprice);

                                        if (costAvg != 0 && baseprice != 0) {

                                            var marginPer = ((baseprice * 1 - costAvg * 1) / baseprice * 1) * 100;
                                            var markUpPer = ((baseprice * 1 - costAvg * 1) / costAvg * 1) * 100;

                                            document.getElementById("" + mainId + "margin").value = marginPer.toFixed(2);
                                            document.getElementById("" + mainId + "markup").value = markUpPer.toFixed(2);

                                        } else {
                                            document.getElementById('' + mainId + 'margin').value = 0;
                                            document.getElementById('' + mainId + 'markup').value = 0;
                                        }

                                    } else {}

                                }
                                appendLineCalcufield();
                                calculateLineAndHeader();
                                tagOpenSidePanel();
                                $('#loader-overlay').hide();
                            },
                            error: function (xhr, status, error) {
                                $('#loader-overlay').hide();
                                console.error('Error fetching autocomplete suggestions:', error);
                            }
                        });

                    }
                });

            });

            function validateSection(section) {
                let valid = true;
                section.find('.line').each(function () {
                    if (!validateLine($(this))) {
                        valid = false;
                        return false;
                    }
                });
                return valid;
            }

            function validateLine(line) {
                try {
                    const field1 = line.find(`#${line.attr('id')}-field1`).val().trim();
                    const field3 = line.find(`#${line.attr('id')}-field3`).val().trim();
                    const field5 = line.find(`#${line.attr('id')}-field5`).val().trim();
                    return field1 !== '' && field3 !== '' && field5 !== '';
                } catch (e) {
                    return true;
                }

            }

            function initAutocomplete(selector) {

                try {

                    $(selector).autocomplete({

                        source: function (request, response) {

                            var mainSplit = selector.split('field2');

                            var mainId = mainSplit[0];
                            mainId = mainId.split('#')[1];
                            var typeId = document.getElementById('' + mainId + 'field1').value;

                            $('#loader-overlay').show();
                            $.ajax({
                                url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    'item_text': request.term,
                                    'item_type': typeId
                                },

                                success: function (data) {
                                    $('#loader-overlay').hide();

                                    console.log(data);

                                    if (data.length > 10) {
                                        showPopup(data, selector);
                                    } else {
                                        $('#popup').hide();
                                        response(data);
                                    }
                                }
                            });
                        },
                        minLength: 3,
                        delay: 300,
                        select: function (event, ui) {

                            console.log(ui);
							var corecharges = ui.item.values.custitem_advs_pa_core_charges;
								var corecharegeitem=0;
								if(corecharges.length>0)
								{
									corecharegeitem = corecharges[0].value;
								}
                            $(this).val(ui.item.values.itemid);
                            var mainSplit = this.id.split('field2');
                            var mainId = mainSplit[0];

                            var typeId = document.getElementById('' + mainId + 'field1').value;

                            document.getElementById('' + mainId + 'field3').value = ui.item.values.custitem_advs_al_labor_flat_rate;
                            document.getElementById('' + mainId + 'field4').value = ui.item.values.baseprice;
                            document.getElementById('' + mainId + 'field5').value = ui.item.values.baseprice;
                            document.getElementById('' + mainId + 'field6').value = 0;
                            document.getElementById('' + mainId + 'field8').value = document.getElementById("custpage_job_tax_head").value || 0;
                            document.getElementById('' + mainId + 'field7').value = ui.item.values.baseprice;
                            document.getElementById('' + mainId + 'field10').value = ui.item.values.custitem_advs_at_goal_hours;
                            document.getElementById('' + mainId + 'item_id').value = ui.item.id;

                            if (typeId == 2) {
                                // document.getElementById(''+mainId+'cost').value=ui.item.values.locationaveragecost;
                                document.getElementById('' + mainId + 'cost').value = ui.item.values.averagecost;

                                // var costAvg     =   ui.item.values.locationaveragecost;
                                var costAvg = ui.item.values.averagecost;
                                var baseprice = ui.item.values.baseprice;

                                costAvg = costAvg * 1;
                                baseprice = baseprice * 1;

                                console.log(costAvg + " baseprice->" + baseprice);

                                if (costAvg != 0 && baseprice != 0) {

                                    var marginPer = ((baseprice * 1 - costAvg * 1) / baseprice * 1) * 100;
                                    var markUpPer = ((baseprice * 1 - costAvg * 1) / costAvg * 1) * 100;

                                    document.getElementById("" + mainId + "margin").value = marginPer.toFixed(2);
                                    document.getElementById("" + mainId + "markup").value = markUpPer.toFixed(2);

                                } else {
                                    document.getElementById('' + mainId + 'margin').value = 0;
                                    document.getElementById('' + mainId + 'markup').value = 0;
                                }

                            } else {}
							var sectionid = jQuery('#' + mainId + 'field2').closest('tr').parents('.section').attr('id');
							addcorechargeitem(corecharegeitem,sectionid); 
                            return false;
                        }
                    }).autocomplete('instance')._renderItem = function (ul, item) {

                        var mainSplit = selector.split('field2');
                        var mainId = mainSplit[0];
                        mainId = mainId.split('#')[1];
                        var typeId = document.getElementById('' + mainId + 'field1').value;

                        if (typeId == 2) {
							var corecharges = item.values.custitem_advs_pa_core_charges;
								var corecharegeitem=0;
								if(corecharges.length>0)
								{
									corecharegeitem = corecharges[0].value;
								}
                            return $('<li>')
                            .append("<div style='display:flex; border-bottom-style: groove;border-bottom-color: currentcolor;'> " +
                                " " +
                                "<div style='width:200px;'> " +
                                "<div class='sidepanelfontClass'> " +
                                "" + item.values.displayname + "" +
                                "</div> " +
                                "<div style='font-weight: bold;' class='tooltip-table'> " +
                                "Item #  " + item.values.itemid + "" +
                                "</div> " +
                                "<div style='font-weight: bold;' class='tooltip-table'> " +
                                "Commited : " + item.values.locationquantitycommitted + " " +
                                "</div> " +
                                " " +
                                "</div> " +
                                "<div style='width:200px; text-align:right;'> " +
                                "<div style='font-weight: bold;' class='tooltip-table'> " +
                                "Retail : $" + item.values.baseprice + " " +
                                "</div> " +
                                " " +
                                "<div style='font-weight: bold;' class='tooltip-table'> " +
                                "Wholesale : $" + item.values.locationaveragecost + " " +
                                "</div> " +
                                " " +
                                "<div style='font-weight: bold;' class='tooltip-table availqty-color' data-available='"+(item.values.locationquantityonhand ||0)+"'> " +
                                "Available : " + item.values.locationquantityonhand + " " +
                                "</div> " + 
								
								"<div style='font-weight: bold;' class='tooltip-table'> " +
                                "CorechargeID : " + corecharegeitem + " " +
                                "</div> " +
                                " " +
                                " " +
                                "</div> " +
                                " " +
                                "</div>").appendTo(ul);
                        } else {
                            return $('<li>')
                            .append("<div style='display:flex; border-bottom-style: groove;border-bottom-color: currentcolor;'> " +
                                " " +
                                "<div style='width:200px;'> " +
                                "<div class='sidepanelfontClass'> " +
                                "" + item.values.displayname + "" +
                                "</div> " +
                                "<div style='font-weight: bold;' class='tooltip-table'> " +
                                "Item #  " + item.values.itemid + "" +
                                "</div> " +
                                " " +
                                "</div> " +
                                "<div style='width:200px; text-align:right;'> " +
                                "<div style=' font-weight: bold;' class='tooltip-table'> " +
                                "Retail : $" + item.values.baseprice + " " +
                                "</div> " +
                                " " +
                                " " +
                                " " +
                                "</div> " +
                                " " +
                                "</div>").appendTo(ul);
                        }

                        // "<div style='font-weight: bold; border-bottom: 2px solid gray; max-width: 500px; background: white; z-index: 888;'> " +
                        // "item # : "+item.values.itemid+"Desc :"+  item.values.displayname +"Price :"+  item.values.baseprice + "</div>"
                    };

                } catch (e) {}

            }

            function showPopup(data, lineid) {

                const popup = $('#popup');
                popup.empty();

                var htmlConnect = "";

                htmlConnect += "<input type='hidden' value='" + lineid + "' id='selected_id_to_set' />";
                htmlConnect += "<div class='tooltip-header'>Available Items</div>";

                var lineIdCount = 0;

                data.forEach(item => {
					var corecharges = item.values.custitem_advs_pa_core_charges;
					var corecharegeitem=0;
					if(corecharges.length>0)
					{
						corecharegeitem = corecharges[0].value;
					}
                    htmlConnect += " <input type='hidden'  id='custpage_line_item_" + lineIdCount + "' value='" + item.values.itemid + "' />" +
                    " <input type='hidden'  id='custpage_line_name_" + lineIdCount + "' value='" + item.values.displayname + "' />" +
                    " <input type='hidden'  id='custpage_line_price_" + lineIdCount + "' value='" + item.values.baseprice + "' />" +
                    " <input type='hidden'  id='custpage_line_item_id_" + lineIdCount + "' value='" + item.id + "' />" +
                    " <input type='hidden'  id='custpage_line_corecharge_id_" + lineIdCount + "' value='" + corecharegeitem + "' />" +
                    " <input type='hidden'  id='custpage_line_availability_" + lineIdCount + "' value='" + item.values.locationaveragecost + "' />" +
                    "" +
                    "" +
                    "<div id='" + lineIdCount + "' style='display:flex; border-bottom-style: groove;border-bottom-color: currentcolor;  cursor: pointer;' class='popup-item'>  " +
                    "                          " +
                    "                        <div class='popupleftsection'>  " +
                    "                        <div style='font-weight:bold;' class='sidepanelfontClass'>  " +
                    "                        " + item.values.displayname + "" +
                    "                        </div>  " +
                    "                        <div class='popupLinemargin tooltip-table'>  " +
                    "                        Item #  " + item.values.itemid + "  " +
                    "                        </div>  " +
                    "                        <div class='popupLinemargin tooltip-table'>  " +
                    "                        Commited : " + item.values.locationquantitycommitted + "" +
                    "                        </div>  " +
                    "                          " +
                    "                        </div>  " +
                    "                        <div class='popuprightsection' style='text-align:right;'>  " +
                    "                        <div style=' font-weight: bold;' class='tooltip-table'>  " +
                    "                        Retail : $" + item.values.baseprice + "  " +
                    "                        </div>  " +
                    "                          " +
                    "                        <div class='popupLinemargin tooltip-table'>  " +
                    "                        Wholesale :$"+(item.values.locationaveragecost ||0) +"  " +
                    "                        </div>  " +
                    "                          " +
                    "                        <div class='popupLinemargin tooltip-table availqty-color' data-available='"+(item.values.locationquantityonhand||0)+"'>  " +
                    "                        Available : "+ (item.values.locationquantityonhand||0)  + "" +
                    "                        </div>  " + 
					"                        <div class='popupLinemargin tooltip-table'>  " +
                    "                        CorechargeID : "+ (corecharegeitem)  + "" +
                    "                        </div>  " +
                    "                          " +
                    "                          " +
                    "                        </div>  " +
                    "                          " +
                    "                        </div>" +
                    "" +
                    "";
                    lineIdCount++;
                });

                htmlConnect += "</table>";

                popup.append(htmlConnect);

                popup.show();

            }

            $('body').on('click', '.popup-item', function () {

                var mainIdToSet = document.getElementById('selected_id_to_set').value;

                var mainSplit = mainIdToSet.split('field2');
                var mainId = mainSplit[0];
                mainId = mainId.split('#')[1];
				var mainlineid = mainId.split('-')[0];

                var itemId = document.getElementById('custpage_line_item_' + this.id).value;
                var itemName = document.getElementById('custpage_line_name_' + this.id).value;
                var itemPrice = document.getElementById('custpage_line_price_' + this.id).value;
                var itemIntId = document.getElementById('custpage_line_item_id_' + this.id).value;
                var itemcoreIntId = document.getElementById('custpage_line_corecharge_id_' + this.id).value;
					var availqty = jQuery(this).find('.availqty-color').data('available')
                document.getElementById('' + mainId + 'field2').value = itemId;
                document.getElementById('' + mainId + 'field3').value = 1;
                document.getElementById('' + mainId + 'field4').value = itemPrice;
                document.getElementById('' + mainId + 'field5').value = itemPrice;
                document.getElementById('' + mainId + 'field6').value = 0;
                document.getElementById('' + mainId + 'field7').value = itemPrice;
                document.getElementById('' + mainId + 'item_id').value = itemIntId;
                document.getElementById('' + mainId + 'item_avail').value = availqty;

                $('#popup').hide();
				if(availqty ==0)
				{
					jQuery('#' + mainlineid ).css('background-color','red');
				}
				var sectionid = jQuery('#' + mainId + 'field2').closest('tr').parents('.section').attr('id');
				addcorechargeitem(itemcoreIntId,sectionid);
            });

            $(document).click(function (event) {
                if (!$(event.target).closest('#popup, .autocomplete').length) {
                    $('#popup').hide();
                }

            });

            $(document).on('keypress', '.line input', function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                    $(this).closest('.line').find('.add-line-btn').click();
                    $(this).closest('.section').find('.add-line').click();

                }
            });

            $(document).on('keypress', '#custpage_search_item_text', function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                    $('#custpage_search_item_button').click();
                }
            });

            function makefieldViewMode() {

                $('.view-mode').on('click', function () {
                    var container = $(this).closest('.input-container');
                    $(this).hide();
                    container.find('.input-field').show().focus();
                    container.find('.dropdown-content').show();
                });

            }
 $('.view-mode').on('click', function () {
                    var container = $(this).closest('.input-container');
                    $(this).hide();
                    container.find('.input-field').show().focus();
                    container.find('.dropdown-content').show();
                });
            // Click outside to hide input field and show view mode
            $(document).on('click', function (event) {
                if (!$(event.target).closest('.input-container').length) {
                    $('.input-field').each(function () {
                        var container = $(this).closest('.input-container');
                        $(this).hide();
                        var value = $(this).val();
                        var suffix = container.data('suffix');
                        container.find('.view-mode').text(value + suffix).show();
                        container.find('.dropdown-content').hide();
                    });
                }
            });

            // Select dropdown option to change suffix
            $('.dropdown-option').on('click', function (event) {
                event.preventDefault();
                var container = $(this).closest('.input-container');
                var suffix = $(this).data('suffix');
                container.data('suffix', suffix);
                container.find('.dropdown-content').hide();
                container.find('.input-field').focus();
            });

            function makeUniqueOrderCode() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 60; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                return text;
            }
			function getTechAssignSections(sectionId)
			{
				var techassign = `<div class='sectiontech' id='tech${sectionId}' style='display:none;'><div style="display: flex; border-top: 1px solid #ebedf2;" class="technicians" >
								  <table class='table' style="width: 100%;">  
                                       
                                            <thead>  
                                                <tr style="border-left: 10px solid transparent;">  
                                                     
                                                    <th class="thStyle">Technician</th>  
                                                </tr>  
                                            </thead>  
											<tbody class=\"technicians_container\">`;
											  techassign += createTechLine(sectionId);
									 techassign += `		</tbody>
								</table>
							</div></div>`;
							return techassign;
			}
        function addcorechargeitem(itemId,section)
	{
		try{
			
			if(parseInt(itemId)!=0){
				debugger;
					//const currentSection = $('.section').last();
					var currentSection='';
					var sectionid = '';
                    if (section=='') { 
						 currentSection = $('.section').last();
                         sectionid=    currentSection.attr('id'); 
                    }else{
						 currentSection = $('#'+section);
						sectionid=section;
					} 
					
				var dataToSet = {};
				  dataToSet.invType = 9,
                  dataToSet.itemName='corecharge',
                  dataToSet.quantity=1,
                  dataToSet.itemPrice=10,
                  dataToSet.lineAmount=10, 
                  dataToSet.itemId = itemId;
				  const lineCount = currentSection.find('tr').length;
				  currentSection.find('tbody').append(createcoreLine(sectionid,JSON.stringify(dataToSet),9));
                    initAutocomplete(`#line-${lineCount}-field2`);
                    document.getElementById(`line-${lineCount}-field2`).focus();
                    tagOpenSidePanel();
                    appendLineCalcufield();
				//createLine(sectionid, dataToSet,9)
			}
			
		}catch(e)
		{
			log.debug('error',e.toString());
		}
	}
		
		});
	
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
    function fieldChanged(scriptContext) {}

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
    function postSourcing(scriptContext) {}

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {}

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {}

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
    function validateField(scriptContext) {}

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
    function validateLine(scriptContext) {}

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
    function validateInsert(scriptContext) {}

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
    function validateDelete(scriptContext) {}

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {}

	


    /**
     * Function to initialize autocomplete on the search field
     */
	 
    function initAutocompleteVehicle() {
        // Fetch data for autocomplete
        $('#search_text').on('input', function () {
            var searchText = $(this).val();

            if (searchText.length > 2) {
                //$('#loader-overlay').show();
                fetchDataBasedOninputString(searchText);
            }
        });

        $('#search_customer_text').on('input', function () {
            var searchText = $(this).val();

            if (searchText.length > 2) {
                //$('#loader-overlay').show();
                fetchCustomerBasedOninputString(searchText);
            }
        });

        $('#custpage_search_item_button').click(function () {
            var searchText = document.getElementById("custpage_search_item_text").value;

            if (searchText.length > 2) {
                fetchItemBasedOninputString(searchText);
            } else {
                swal.fire(
                    'Error!',
                    'Please enter at least 3 characters for search item.',
                    'warning')
            }
        });

        $('#custpage_search_button').click(function () {
            var searchText = document.getElementById("search_text").value;

            if (searchText.length > 2) {
                fetchDataBasedOninputString(searchText, 1);
            }
        });

        $('#custpage_vehicle_history_click').click(function () {
            openServiceHistory();
        });

        $('#custpage_ticket_dashboard_click').click(function () {
            openTicketDashboard();
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

    function fetchItemBasedOninputString(searchText) {
        $('#loadingIndicator_item_search').show();

        var item_type = document.getElementById("custpage_type_multi").value;

        if (item_type == undefined) {
            item_type = 2;
        }

        $.ajax({
            url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
            dataType: 'json',
            type: 'POST',
            data: {
                'item_text': searchText,
                'item_type': item_type
            },
            success: function (data) {
                $('#loadingIndicator_item_search').hide();

                console.log(data);
                var itemResult = "";

                itemResult += "<div class='table-sorter-wrapper col-lg-12 table-responsive'> " +
                "                      <table id='sortable-table-1' class='table'> " +
                "                        <thead> " +
                "                          <tr style='width: 100%'> " +
                "                            <th style='width: 10%' class='sidepanelfontClass'>#</th> " +
                "                            <th class='sortStyle ascStyle sidepanelfontClass' style='width: 15%'>Type<i class='mdi mdi-chevron-down' ></i></th> " +
                "                            <th class='sortStyle unsortStyle sidepanelfontClass' style='width: 15%'>Item<i class='mdi mdi-chevron-down'></i></th> " +
                "                            <th class='sortStyle unsortStyle sidepanelfontClass' style='width: 30%'>Description<i class='mdi mdi-chevron-down'></i></th> " +
                "                            <th class='sortStyle unsortStyle sidepanelfontClass' style='width: 15%'>Rate<i class='mdi mdi-chevron-down'></i></th> " +
                "                            <th class='sortStyle unsortStyle sidepanelfontClass' style='width: 5%'>Add<i class='mdi mdi-chevron-down'></i></th> " +
                "                          </tr> " +
                "                        </thead> " +
                "                        <tbody> ";

                for (var IL = 0; IL < data.length; IL++) {

                    if (data[IL].values.itemid) {

                        itemResult += "             " +
                        "           <tr> " +
                        "                            <td class='tooltip-table' style='font-weight: 600 !important;'>" + (IL * 1 + 1) + "</td> " +
                        "                            <td class='tooltip-table' style='width: 15%; overflow: hidden; font-weight: 600 !important;' >" + data[IL].values.custitem_advs_inventory_type[0].text + "</td> " +
                        "                            <td class='tooltip-table' style='width: 80px; max-width: 80px; font-weight: 600 !important; overflow:scroll;scrollbar-width: none;-ms-overflow-style: none;' > " + data[IL].values.itemid + "</td> " +
                        "                            <td class='tooltip-table' style='width: 100px; max-width: 100px; font-weight: 600 !important; overflow:scroll;scrollbar-width: none;-ms-overflow-style: none;' > " + data[IL].values.displayname + "</td> " +
                        "                            <td class='tooltip-table' style='width: 30px; font-weight: 600 !important; max-width: 30px; ' >" + data[IL].values.baseprice + "</td> " +
                        "                            <td class='tooltip-table' style='cursor: pointer;'><i class='mdi mdi-arrow-right-bold' id='custpage_add_" + IL + "'></i></td> " +
                        "                          </tr>" +
                        "<input type='hidden' id='custpae_item_id_" + IL + "' value='" + data[IL].values.internalid[0].value + "'/>" +
                        "<input type='hidden' id='custpae_item_desc_" + IL + "' value='" + data[IL].values.displayname + "'/>" +
                        "<input type='hidden' id='custpae_item_price_" + IL + "' value='" + data[IL].values.baseprice + "'/>" +
                        "<input type='hidden' id='custpae_item_type_" + IL + "' value='" + data[IL].values.custitem_advs_inventory_type[0].value + "'/>" +
                        "<input type='hidden' id='custpae_item_number_" + IL + "' value='" + data[IL].values.itemid + "'/>" +
                        "";

                    } else {

                        itemResult += "             " +
                        "           <tr> " +
                        "                            <td class='tooltip-table' style='font-weight: 600 !important;'>" + (IL * 1 + 1) + "</td> " +
                        "                            <td class='tooltip-table' style='width: 15%; font-weight: 600 !important; overflow: hidden;' >" + data[IL].values["GROUP(custitem_advs_inventory_type)"][0].text + "</td> " +
                        "                            <td class='tooltip-table' style='width: 80px; font-weight: 600 !important; max-width: 80px; overflow:scroll;scrollbar-width: none;-ms-overflow-style: none;' > " + data[IL].values["GROUP(itemid)"] + "</td> " +
                        "                            <td class='tooltip-table' style='width: 100px; font-weight: 600 !important; max-width: 100px; overflow:scroll;scrollbar-width: none;-ms-overflow-style: none;' > " + data[IL].values["GROUP(salesdescription)"] + "</td> " +
                        "                            <td class='tooltip-table' style='width: 30px; font-weight: 600 !important; max-width: 30px; ' >" + data[IL].values["GROUP(baseprice)"] + "</td> " +
                        "                            <td class='tooltip-table' style='cursor: pointer;'><i class='mdi mdi-arrow-right-bold' id='custpage_add_" + IL + "'></i></td> " +
                        "                          </tr>" +
                        "<input type='hidden' id='custpae_item_id_" + IL + "' value='" + data[IL].values["GROUP(internalid)"][0].value + "'/>" +
                        "<input type='hidden' id='custpae_item_desc_" + IL + "' value='" + data[IL].values["GROUP(salesdescription)"] + "'/>" +
                        "<input type='hidden' id='custpae_item_price_" + IL + "' value='" + data[IL].values["GROUP(baseprice)"] + "'/>" +
                        "<input type='hidden' id='custpae_item_type_" + IL + "' value='" + data[IL].values["GROUP(custitem_advs_inventory_type)"][0].value + "'/>" +
                        "<input type='hidden' id='custpae_item_number_" + IL + "' value='" + data[IL].values["GROUP(itemid)"] + "'/>" +
                        "";

                    }

                }

                itemResult += "                          </tbody> " +
                "                      </table> " +
                "                    </div>" +
                "";

                document.getElementById("custpage_item_result").innerHTML = itemResult;

                $(document).ready(function () {

                    if ($('#sortable-table-1').length) {
                        $('#sortable-table-1').tablesort();
                    }

                    $('[id^=custpage_add_]').on('click', function () {
                        $('#loadingIndicator_item_added').show();
                        var buttonId = $(this).attr('id');

                        var lineNumber = buttonId.replace(/^custpage_add_/, "");

                        var itemId = document.getElementById("custpae_item_id_" + lineNumber).value;
                        var itemDesc = document.getElementById("custpae_item_desc_" + lineNumber).value;
                        var itemPrice = document.getElementById("custpae_item_price_" + lineNumber).value;
                        var itemType = document.getElementById("custpae_item_type_" + lineNumber).value;
                        var vinId = document.getElementById("selected_vehicle_id").value;
                        var itemNumber = document.getElementById("custpae_item_number_" + lineNumber).value;

                        $.ajax({
                            url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
                            dataType: 'json',
                            type: 'POST',
                            data: {
                                'vinIdAdd': vinId,
                                'itemIdAdd': itemId,
                                'itemDescAdd': itemDesc,
                                'itemPriceAdd': itemPrice,
                                'itemTypeAdd': itemType,
                                'itemNumberAdd': itemNumber

                            },
                            success: function (data) {

                                setAllSelectedItemHTML(data);

                            },
                            error: function (xhr, status, error) {
                                $('#loadingIndicator_item_added').hide();
                                console.error('Error fetching autocomplete suggestions:', error);
                            }
                        });

                    });
                });

            },
            error: function (xhr, status, error) {
                console.error('Error fetching autocomplete suggestions:', error);
            }
        });

    }

    /**
     * After added item Create HTML and Handle delete START
     * @param data
     */

    function setAllSelectedItemHTML(data) {

        /**
         * Create HTML Table START
         * @type {string}
         */
        var htmlSelectedItems = "";

        htmlSelectedItems += "<div class='table-sorter-wrapper col-lg-12 table-responsive'> " +
        "                      <table id='sortable-table-2' class='table'> " +
        "                        <thead> " +
        "                          <tr style='width: 100%'> " +
        "                            <th style='width: 10%' class='sidepanelfontClass'>#</th> " +
        "                            <th class='sortStyle ascStyle sidepanelfontClass' style='width: 15%'>Type<i class='mdi mdi-chevron-down' ></i></th> " +
        "                            <th class='sortStyle unsortStyle sidepanelfontClass' style='width: 15%'>Item<i class='mdi mdi-chevron-down'></i></th> " +
        "                            <th class='sortStyle unsortStyle sidepanelfontClass' style='width: 30%'>Description<i class='mdi mdi-chevron-down'></i></th> " +
        "                            <th class='sortStyle unsortStyle sidepanelfontClass' style='width: 15%'>Rate<i class='mdi mdi-chevron-down'></i></th> " +
        "                            <th class='sortStyle unsortStyle sidepanelfontClass' style='width: 5%'>Delete<i class='mdi mdi-chevron-down'></i></th> " +
        "                          </tr> " +
        "                        </thead> " +
        "                        <tbody> ";

        for (var SL = 0; SL < data.items.length; SL++) {

            htmlSelectedItems += "                        <tr> " +
            "                            <td class='tooltip-table' style='font-weight: 600 !important;'>" + (SL * 1 + 1) + "</td> " +
            "                            <td class='tooltip-table' style='font-weight: 600 !important;'>" + data.items[SL].type + "</td> " +
            "                            <td class='tooltip-table' style='width: 80px; font-weight: 600 !important; max-width: 80px; overflow:scroll;scrollbar-width: none;-ms-overflow-style: none;'>" + data.items[SL].number + "</td> " +
            "                            <td class='tooltip-table' style='width: 100px; font-weight: 600 !important; max-width: 100px; overflow:scroll;scrollbar-width: none;-ms-overflow-style: none;'>" + data.items[SL].desc + "</td> " +
            "                            <td class='tooltip-table' style='font-weight: 600 !important;'>" + data.items[SL].price + "</td> " +
            "                            <td class='tooltip-table' id='custpage_delete_" + SL + "' style='cursor: pointer;'><i class='mdi mdi-delete-forever'></i></td> " +
            "                          </tr>" +
            "<input type='hidden' id='custpae_item_id_d_" + SL + "' value='" + data.items[SL].id + "'/>" +
            "";

        }

        htmlSelectedItems += "</tbody> " +
        "                      </table> " +
        "                    </div>";
        /**
         * Create HTML Table END
         * @type {string}
         */

        /**
         * Make Table sortable and Handle Delete Event START
         * @type {string}
         */
        document.getElementById("custpage_selected_item").innerHTML = htmlSelectedItems;

        $(document).ready(function () {

            if ($('#sortable-table-2').length) {
                $('#sortable-table-2').tablesort();
            }

            $('[id^=custpage_delete_]').on('click', function () {
                $('#loadingIndicator_item_added').show();
                var buttonId = $(this).attr('id');

                var lineNumber = buttonId.replace(/^custpage_delete_/, "");

                var itemId = document.getElementById("custpae_item_id_d_" + lineNumber).value;
                var vinId = document.getElementById("selected_vehicle_id").value;

                $.ajax({
                    url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        'vinIdDel': vinId,
                        'itemIdDel': itemId
                    },
                    success: function (data) {

                        setAllSelectedItemHTML(data);

                    },
                    error: function (xhr, status, error) {
                        $('#loadingIndicator_item_added').hide();
                        console.error('Error fetching autocomplete suggestions:', error);
                    }
                });

            });
        });

        /**
         * Make Table sortable and Handle Delete Event END
         * @type {string}
         */

        $('#loadingIndicator_item_added').hide();
    }

    function CheckORAND(data, cond) {

        if (cond == "OR") {

            if (data == "" || data == 0 || !data) {
                return true;
            } else {
                return false;
            }

        }

    }

    var orderStatusData = "";

    function fetchOrderStatusData() {

        $.ajax({
            url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
            dataType: 'json',
            type: 'POST',
            data: {
                'searchOrderStatus': 1
            },
            success: function (data) {

                orderStatusData = data;

                $('#custpage_order_status_sel').select2({
                    placeholder: "Select..",
                    allowClear: true,
                    width: 'resolve'
                }).on('select2:open', function () {
                    setTimeout(function () {
                        $('.select2-search__field').focus();
                    }, 0);
                });

                orderStatusData.forEach(option => {
                    if (option.id == 1) { //Incoming Trucks
                        const newOption = new Option(option.name, option.id, false, true);
                        $('#custpage_order_status_sel').append(newOption).trigger('change');
                    } else {
                        const newOption = new Option(option.name, option.id, false, false);
                        $('#custpage_order_status_sel').append(newOption).trigger('change');
                    }

                });

                $('#custpage_order_completed').select2({
                    placeholder: "Select..",
                    allowClear: true,
                    width: 'resolve'
                }).on('select2:open', function (e) {

                    setTimeout(function () {
                        $('.select2-search__field').focus();
                    }, 0);
                });

                orderStatusData.forEach(option => {
                    const newOption = new Option(option.name, option.id, false, false);
                    $('#custpage_order_completed').append(newOption).trigger('change');
                });

            },
            error: function (xhr, status, error) {
                console.error('Error fetching autocomplete suggestions:', error);
            }
        });

    }

    /**
     * After added item Create HTML and Handle delete END
     * @param data
     */

    function fetchDataBasedOninputString(searchText, fromButton) {

        $.ajax({
            url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
            dataType: 'json',
            type: 'POST',
            data: {
                'search_text': searchText
            },
            success: function (data) {
                // $('#loader-overlay').hide();

                if (fromButton == 1) {

                    if (data.length == 1) {
                        document.getElementById("selected_vehicle_id").value = data[0].internalid;

                        afterVehicleSelectEvent();

                    } else {
                        fromButton = 2;
                    }

                } else {

                    fromButton = 2;

                }

                if (fromButton == 2) {

                    var suggestions = data.map(function (item) {
                        return {
                            plateNum: item.plateNum,
                            value: item.internalid,
                            label: item.altname,
                            stockNo: item.stockNo,
                            entityid: item.entityid,
                        };
                    });
                    document.getElementById("custpage_no_of_result").innerHTML = suggestions.length + ' match';

                    if (suggestions.length == 1) {
                        document.getElementById("selected_vehicle_id").value = suggestions[0].value;
                        afterVehicleSelectEvent();
                    }

                    $('#search_text').autocomplete({
                        source: suggestions,
                        focus: function (event, ui) {
                            $('#search_text').val(ui.item.label);
                            return false;
                        },
                        select: function (event, ui) {
                            $('#search_text').val(ui.item.label);
                            $('#selected_vehicle_id').val(ui.item.value);
                            afterVehicleSelectEvent();
                            return false;
                        },
                        minLength: 3,
                        delay: 300
                    }).autocomplete("instance")._renderItem = function (ul, item) {
                        return $("<li>")
                        .append("<div style='font-weight: bold; border-bottom: 2px solid gray; max-width: 300px; background: white; z-index: 888;' class='tooltip-table'>Serial # : " + item.stockNo + "<br/>Unit # :" + item.plateNum + "<br>VIN # : " + item.label + "</div>")
                        .appendTo(ul);
                    };

                }

            },
            error: function (xhr, status, error) {
                console.error('Error fetching autocomplete suggestions:', error);
            }
        });

    } 
    function fetchCustomerBasedOninputString(searchText, fromButton) {

        $.ajax({
            url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
            dataType: 'json',
            type: 'POST',
            data: {
                'search_customer_text': searchText
            },
            success: function (data) {
                // $('#loader-overlay').hide();
                console.log('data', data)
                if (fromButton == 1) {

                    if (data.length == 1) {
                        document.getElementById("custpage_customer_id").value = data[0].internalid;
                        document.getElementById("custpage_isinternalcustomer").value = data[0].internalcustomer;

                        fetchOtherVehicleDetails(1);

                    } else {
                        fromButton = 2;
                    }

                } else {

                    fromButton = 2;

                }

                if (fromButton == 2) {

                    var suggestions = data.map(function (item) {
                        return {
                            plateNum: item.plateNum,
                            value: item.internalid,
                            label: item.altname,
                            stockNo: item.stockNo,
                            entityid: item.entityid,
                            internalcustomer: item.internalcustomer
                        };
                    });
                    document.getElementById("custpage_no_of_result").innerHTML = suggestions.length + ' match';

                    console.log('suggestions', suggestions);

                    if (suggestions.length == 1) {
                        document.getElementById("custpage_customer_id").value = suggestions[0].value;
                        document.getElementById("custpage_isinternalcustomer").value = suggestions[0].internalcustomer;
                        fetchOtherVehicleDetails(1);
                    }

                    $('#search_customer_text').autocomplete({
                        source: function (request, response) {
                            // Filter the results based on user input
                            var filteredResults = data.filter(function (item) {
                                return item.altname.toLowerCase().includes(request.term.toLowerCase()) ||
                                item.plateNum.toLowerCase().includes(request.term.toLowerCase()) ||
                                item.stockNo.toLowerCase().includes(request.term.toLowerCase());
                            });
                            // Map the filtered results to the format expected by jQuery UI Autocomplete
                            response($.map(filteredResults, function (item) {
                                    return {
                                        label: item.altname || item.plateNum || item.stockNo,
                                        value: item.altname || item.plateNum || item.stockNo,
                                        data: item // Include the full item data
                                    };
                                }));
                        },
                        focus: function (event, ui) {
                            $('#search_customer_text').val(ui.item.label);
                            return false;
                        },
                        select: function (event, ui) {

                            $('#search_customer_text').val(ui.item.label);
                            $('#custpage_customer_id').val(ui.item.data.internalid);
                            $('#selected_vehicle_id').val("");
                            setVINDataAsBLANK();
                            fetchOtherVehicleDetails(1);
                            return false;
                        },
                        minLength: 3,
                        delay: 300
                    }).autocomplete("instance")._renderItem = function (ul, item) {

                        return $("<li>")
                        .append("<div style='font-weight: bold; border-bottom: 2px solid gray; max-width: 300px; background: white; z-index: 888;' class='tooltip-table'>Phone # : " + item.data.stockNo + "<br/>Email Id :" + item.data.plateNum + "<br>Name : " + item.label + "</div>")
                        .appendTo(ul);
                    };

                }

            },
            error: function (xhr, status, error) {
                console.error('Error fetching autocomplete suggestions:', error);
            }
        });

    } 
    function afterVehicleSelectEvent() {
        document.getElementById("custpage_no_of_result").innerHTML = '1 match';
        var vinId = document.getElementById("selected_vehicle_id").value;
        $('#loader-overlay').show();
        if (vinId) {
            console.log("TYAGI 1")
            $.ajax({
                url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
                dataType: 'json',
                type: 'POST',
                data: {
                    'vinId': vinId
                },
                success: function (data) {

                    setDataAfterFetchForVIN(data,'',vinId);

                },
                error: function (xhr, status, error) {
                    $('#loader-overlay').hide();
                    console.error('Error fetching autocomplete suggestions:', error);
                }
            });
        } else {
            console.log("TYAGI 2")
            $('#loader-overlay').hide();
            setVINDataAsBLANK("");
        }

    } 
    function setVINDataAsBLANK() {
        console.log("TYAGI")
        document.getElementById("custpage_vehicle_tooltip").innerHTML = "";
        document.getElementById("custpage_cust_veh_details").innerHTML = "";
        document.getElementById("custpage_history_tooltip").innerHTML = "";
        document.getElementById("custpage_vin_number").innerHTML = "";
    } 
    function setDataAfterFetchForVIN(data, fromCustomer,vinId) {

        if (fromCustomer == 1) {
            var fullName = "",
            email = data[0].values.email || "",
            mobilephone = data[0].values.phone || "";

            var comments = data[0].values.comments || "",
            highAlert = data[0].values.highalert || "";

            if (data[0].values.isperson) {
                fullName = data[0].values.firstname || "" + " " + data[0].values.middlename || "" + " " + data[0].values.lastname || "";
            } else {
                fullName = data[0].values.companyname || "";
            }

        } else {
            var fullName = "",
            email = data[0].email || "",
            mobilephone = data[0].phone || "";

            var comments = data[0].comments || "",
            highAlert = data[0].highalert || "";

            if (data[0].isperson) {
                fullName = data[0].firstname || "" + " " + data[0].middlename || "" + " " + data[0].lastname || "";
            } else {
                fullName = data[0].companyname || "";
            }

            document.getElementById("custpage_customer_id").value = data[0].entityid;
        }

        var custvehiDetails = "";

        if (highAlert) {

            document.getElementById("custpage_main_notification").style.display = "flex";
            document.getElementById("custpage_customer_alert").innerHTML = highAlert;
        } else {
            document.getElementById("custpage_main_notification").style.display = "none";
            document.getElementById("custpage_customer_alert").innerHTML = "";
        }

        if (comments) {

            document.getElementById("custpage_main_comment_notification").style.display = "flex";
            document.getElementById("custpage_customer_comment").innerHTML = comments;
        } else {
            document.getElementById("custpage_main_comment_notification").style.display = "none";
            document.getElementById("custpage_customer_comment").innerHTML = "";
        }

        var tooltip = "";
        tooltip += "    <div class='tooltip-header'>Customer Details</div> " +
        "    <table class='tooltip-table'> " +
        "      <tbody> " +
        "        <tr> " +
        "          <td class='backgroupColorADVS'>Name</td> " +
        "          <td>" + fullName + "</td> " +
        "        </tr> " +
        "        <tr> " +
        "          <td class='backgroupColorADVS'>Email</td> " +
        "          <td>" + email + "</td> " +
        "        </tr> " +
        "        <tr> " +
        "          <td class='backgroupColorADVS'>Phone</td> " +
        "          <td>" + mobilephone + "</td> " +
        "        </tr> " +
        "      </tbody> " +
        "    </table> " +
        "  </div>";
        document.getElementById("custpage_customer_name").innerHTML = fullName;
        document.getElementById("custpage_customer_tooltip").innerHTML = tooltip;
		
		var tooltipmatrix = "";
        tooltipmatrix += "    <div class='tooltip-header'>Pricing Matrix</div> " +
        "    <table class='tooltip-table'> " +
        "      <tbody> " +
        "      <button id='closematrix'>close</button> " +
        "        <tr> " +
        "          <td class='backgroupColorADVS'>Name</td> " +
        "          <td>ADVS LABOR MATRIX</td> " +
        "        </tr> " +
        "        <tr> " +
        "          <td class='backgroupColorADVS'>Link</td> " +
        "          <td><a href='https://8760954.app.netsuite.com/app/common/custom/custrecordentrylist.nl?rectype=1716&whence=' , target='_blank'>View</a></td> " +
        "        </tr> " +
        "        <tr> " +
        "          <td class='backgroupColorADVS'>Name</td> " +
        "          <td>ADVS PRICING MATRIX</td> " +
        "        </tr> " +
		"        <tr> " +
        "          <td class='backgroupColorADVS'>Link</td> " +
        "          <td><a href='https://8760954.app.netsuite.com/app/common/custom/custrecordentrylist.nl?rectype=1717&whence=' , target='_blank'>View</a></td> " +
        "        </tr> " +
        "      </tbody> " +
        "    </table> " +
        "  </div>";
        //document.getElementById("custpage_customer_name").innerHTML = fullName;
        document.getElementById("custpage_history_notrequired_tooltip1").innerHTML = tooltipmatrix;

        if (fromCustomer == 1) {}
        else {

            var tooltipVehicle = "";

            var makeName = data[0].makename || "",
            fullname = data[0].fullname || "",
            modelyear = data[0].modelyear || "",
            platenum = data[0].platenum || "",
            mileage = data[0].mileage || "",
            subgrouptype = data[0].subgrouptype || "",
            lastservicedate = data[0].lastservicedate || "",
            department = data[0].department || "";
			 
			//var datahis = getvihistorydetails(vinId);
            tooltipVehicle += "" +
            "    <div class='tooltip-header'>Vehicle Details</div> " +
            "    <table class='tooltip-table'> " +
            "      <tbody> " +
            "        <tr> " +
            "          <td class='backgroupColorADVS'>Make</td> " +
            "          <td>" + makeName + "</td> " +
            "        </tr> " +

            "        <tr> " +
            "          <td class='backgroupColorADVS'>Model</td> " +
            "          <td>" + fullname + "</td> " +
            "        </tr> " +

            "        <tr> " +
            "          <td class='backgroupColorADVS'>Model Year</td> " +
            "          <td>" + modelyear + "</td> " +
            "        </tr> " +

            "        <tr> " +
            "          <td class='backgroupColorADVS'>Equipment unit #</td> " +
            "          <td>" + platenum + "</td> " +
            "        </tr> " +
            "        <tr> " +
            "          <td class='backgroupColorADVS'>Mileage</td> " +
            "          <td>" + mileage + "</td> " +
            "        </tr> " +
            "        <tr> " +
            "          <td class='backgroupColorADVS'>Sub Group</td> " +
            "          <td>" + subgrouptype + "</td> " +
            "        </tr> " +
            "        <tr> " +
            "          <td class='backgroupColorADVS'>Department</td> " +
            "          <td>" + department + "</td> " +
            "        </tr> " +
            "        <tr> " +
            "          <td class='backgroupColorADVS'>Service History</td> " +
            "          <td><a href='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2567&deploy=1&vin="+vinId+"' , target='_blank'>View</a></td> " +
            "        </tr> " +

            "      </tbody> " +
            "    </table> " +
            "  </div>";
			/* tooltipVehicle +=  "<div><table><tr><th>Date</th><th>Document No</th><th>Status</th><th>Amount</th></tr>";
			for(var i=0;i<datahis.length;i++)
			{
				 tooltipVehicle += "<tr><td>"+datahis[i].trandate+"</td><td>"+datahis[i].doc+"</td><td>"+datahis[i].statusref+"</td><td>"+datahis[i].amount+"</td></tr>" ;
			}
			tooltipVehicle += "</div>" ; */
            document.getElementById("custpage_vin_number").innerHTML = data[0].vinnumber;
            document.getElementById("custpage_vehicle_tooltip").innerHTML = tooltipVehicle;

            custvehiDetails += "    <table class='tooltip-table' style='margin-top: 5px;'> " +
            "      <tbody> " +
            "        <tr> " +
            "          <td class='backgroupColorADVS' style='width: 10%;'>Name</td> " +
            "          <td style='width: 30%;'>" + fullName + "</td> " +
            "          <td class='backgroupColorADVS' style='width: 10%;'>Make</td> " +
            "          <td style='width: 20%;'>" + makeName + "</td> " +
            "          <td class='backgroupColorADVS' style='width: 10%;'>Last Service</td> " +
            "          <td style='width: 30%;'>" + lastservicedate + "</td> " +
            "        </tr> " +
            "        <tr> " +
            "          <td class='backgroupColorADVS'>Email</td> " +
            "          <td>" + email + "</td> " +
            "          <td class='backgroupColorADVS'>Model</td> " +
            "          <td>" + fullname + "</td> " +
            "          <td class='backgroupColorADVS'>Equipment unit #</td> " +
            "          <td>" + platenum + "</td> " +
            "        </tr> " +
            "        <tr> " +
            "          <td class='backgroupColorADVS'>Phone</td> " +
            "          <td>" + mobilephone + "</td> " +
            "          <td class='backgroupColorADVS'>Model Year</td> " +
            "          <td>" + modelyear + "</td> " +
            "          <td class='backgroupColorADVS' style='display:none;'>Mileage</td> " +
            "          <td style='display:none;'>" + mileage + "</td> " +
            "        </tr> " +

            "      </tbody> " +
            "    </table> ";

            document.getElementById("custpage_cust_veh_details").innerHTML = custvehiDetails;
            document.getElementById("custpage_current_mileage").value = mileage;

            // fetchAttachmentDetails();
            fetchHistoryDetails();
            fetchOtherVehicleDetails();

        }

        $('#loader-overlay').hide();

    } 
	function getvihistorydetails(vin)
	{
		try{
			 $.ajax({
            url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
            dataType: 'json',
            type: 'POST',
            data: {
                'vinhistory': vin
            },
            success: function (data) {
				
					console.log('data',data);
					return data; 
            },
            error: function (xhr, status, error) {
                $('#loader-overlay').hide();
                console.debug('Error fetching autocomplete suggestions:', error);
            }
        });
		}catch(e)
		{
			log.debug('error',e.toString());
		}
	}
    function fetchOtherVehicleDetails(fromCust,customer) {
        $('#loadingIndicatorPill_other_vehicle').show();
        var customerId = document.getElementById("custpage_customer_id").value||0;
		 
			 
			 $.ajax({
            url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
            dataType: 'json',
            type: 'POST',
            data: {
                'customerId': customerId
            },
            success: function (data) {

                if ((data.length - 1) >= 1) {
                    document.getElementById("custpage_other_vehile_count_main").style.display = 'block';
                    document.getElementById("custpage_other_vehicle_count").innerHTML = '<i class="fas fa-truck-monster"></i> (' + (data.length * 1) + ')';

                    var tooltipOtherVehicle = "";

                    tooltipOtherVehicle += "    <div class='tooltip-header'>Other Vehicle owned by Customer</div> " +
                    "    <table class='tooltip-table'> " +
                    "      <thead> " +
                    "        <tr> " +
                    "          <th>VIN</th> " +
                    "          <th>Unit #</th> " +
                    "          <th>Serial #</th> " +
                    "          <th>Open order</th> " +
                    "          <th>Open Estimate</th> " +
                    "        </tr> " +
                    "      </thead> " +
                    "      <tbody> ";

                    for (var H = 0; H < data.length; H++) {

                        var name = data[H].name,
                        id = data[H].id,
                        engine = data[H].engine || "",
                           engineserial = data[H].engineserial || "",
                          
                        serial = data[H].serial || "",
                        order = data[H].order,
                        estimate = data[H].estimate;

                        tooltipOtherVehicle += "        <tr> " +
                        "          <td id='vin_other_" + id + "' style='cursor: pointer;'>" + name + "</td> " +
                        "          <td>" + engineserial + "</td> " + //engine
                        "          <td>" + serial + "</td> ";
                        if (order >= 1) {
                            tooltipOtherVehicle += "          <td style='font-weight:bold; color:red;'>" + order + "</td> ";
                        } else {
                            tooltipOtherVehicle += "          <td >" + order + "</td> ";
                        }

                        if (estimate >= 1) {
                            tooltipOtherVehicle += "          <td style='font-weight:bold; color:red;'>" + estimate + "</td> ";
                        } else {
                            tooltipOtherVehicle += "          <td >" + estimate + "</td> ";
                        }

                        tooltipOtherVehicle += "        </tr> ";

                    }

                    tooltipOtherVehicle += "      </tbody> " +
                    "    </table> " +
                    "  </div>";

                    document.getElementById("custpage_other_vehicle_tooltip").innerHTML = tooltipOtherVehicle;

                    appendOnClickVINSelect();

                } else {
                    document.getElementById("custpage_other_vehile_count_main").style.display = 'none';
                    document.getElementById("custpage_other_vehicle_count").innerHTML = '';
                    document.getElementById("custpage_other_vehicle_tooltip").innerHTML = "";
                }

            },
            error: function (xhr, status, error) {
                $('#loader-overlay').hide();
                console.debug('Error fetching autocomplete suggestions:', error);
            }
        });

        console.log(customerId);
        fetchLocationDepartmentData(customerId);

        $('#loadingIndicatorPill_other_vehicle').hide();

        if (fromCust == 1 && customerId!='') {

            $.ajax({
                url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
                dataType: 'json',
                type: 'POST',
                data: {
                    'customerIdForDetails': customerId
                },
                success: function (data) {
					//alert(data)
                    setDataAfterFetchForVIN(data, 1);
                },
                error: function (xhr, status, error) {
                    console.debug('Error fetching autocomplete suggestions:', error);
                }
            });

        }
			    
    } 
    function fetchLocationDepartmentData(customerId) {

        $.ajax({
            url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
            type: 'POST',
            dataType: 'json',
            data: {
                'customerId_loc_dep': customerId,
                'action_type': 'fetch_location_department'
            },

            success: function (data) {

                var locationData = data.location;

                $('#custpage_order_location').select2({
                    placeholder: "Select..",
                    allowClear: true,
                    width: 'resolve'
                }).on('select2:open', function () {
                    setTimeout(function () {
                        $('.select2-search__field').focus();
                    }, 0);
                });

                locationData.forEach(option => {
                    const newOption = new Option(option.name, option.id, false, false);
                    $('#custpage_order_location').append(newOption).trigger('change');
                });

                var defaultLocation = runtime.getCurrentUser().location;

                if (defaultLocation > 0) {
                    $('#custpage_order_location').val(defaultLocation).trigger('change');
                }

                var departmentData = data.department;

                $('#custpage_order_department').select2({
                    placeholder: "Select..",
                    allowClear: true,
                    width: 'resolve'
                }).on('select2:open', function () {
                    setTimeout(function () {
                        $('.select2-search__field').focus();
                    }, 0);
                });

                departmentData.forEach(option => {
                    const newOption = new Option(option.name, option.id, false, false);
                    $('#custpage_order_department').append(newOption).trigger('change');
                });

                var defDepartment = runtime.getCurrentUser().department;

                if (defDepartment > 0) {
                    $('#custpage_order_department').val(defDepartment).trigger('change');
                }

            }
        });

    } 
    function appendOnClickVINSelect() {

        $('[id^="vin_other_"]').on('click', function () {

            swal.fire({
                title: "Are you sure you want to select VIN # " + document.getElementById(this.id).innerHTML + ".",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                customClass: {
                    popup: 'swal2-popup',
                    title: 'swal2-title',
                    confirmButton: 'swal2-button',
                    content: 'swal2-content'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    var vinId = this.id.split("vin_other_")[1];

                    window.location.href = "/app/site/hosting/scriptlet.nl?script=customscript_ssst_service_dashboard_2&deploy=customdeploy_ssst_service_dashboard_2&custpage_vin_id=" + vinId;
                }
            });

        });

    } 
    function setAttachmentDetails(data) {

        var equipmentLen = data.length;

        var attchmentDetails = "";
        attchmentDetails += "    " +
        "    <table class='tooltip-table'> " +

        "                      <thead> " +
        "                        <tr> " +
        "                          <th>Serial VIN</th> " +
        "                          <th>Serial #</th> " +
        "                          <th>Model</th> " +
        "                          <th>Description 1</th> " +
        "                          <th>Description 2</th> " +
        "                           " +
        "                        </tr> " +
        "                      </thead> " +
        "      <tbody> ";

        for (var A = 0; A < equipmentLen; A++) {

            var serialvin = data[A].serialvin || "",
            serial = data[A].serial || "",
            model = data[A].fullname || "",
            desc1 = data[A].desc1 || "",
            desc2 = data[A].desc2 || "";

            attchmentDetails += "" +
            "        <tr> " +
            "          <td>" + serialvin + "</td> " +
            "          <td>" + serial + "</td> " +
            "          <td>" + model + "</td> " +
            "          <td>" + desc1 + "</td> " +
            "          <td>" + desc2 + "</td> " +
            "        </tr> " +
            "";

        }
        attchmentDetails += "      </tbody> " +
        "    </table> " +
        "  </div>";

        document.getElementById("custpage_attachment_details").innerHTML = attchmentDetails;
        $('#loadingIndicatorAttachment').hide();

    }
    function fetchAttachmentDetails() {

        var vinIdSerial = document.getElementById("selected_vehicle_id").value;
        $('#loadingIndicatorAttachment').show();
        $.ajax({
            url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
            dataType: 'json',
            type: 'POST',
            data: {
                'vinIdSerial': vinIdSerial
            },
            success: function (data) {
                setAttachmentDetails(data);
            },
            error: function (xhr, status, error) {
                $('#loader-overlay').hide();
                console.error('Error fetching autocomplete suggestions:', error);
            }
        });

    } 
    function openServiceHistory() { //it is replacing with ticket dashboard [keeping this for future use]

        var vinIdSerial = document.getElementById("selected_vehicle_id").value;

        if (CheckORAND(vinIdSerial, "OR")) {
            swal.fire(
                'Error!',
                'Please select Vehicle first.',
                'error')

        } else {

            var url = "/app/site/hosting/scriptlet.nl?script=customscript_advs_ss_vehicle_service_his" +
                "&deploy=customdeploy_advs_ss_vehicle_service_his&custpara_vin=" + vinIdSerial + "";

            window.open(url);

        }
    }
    function openTicketDashboard() {

        var url = "/app/site/hosting/scriptlet.nl?script=customscript_ssst_service_dash_kanban" +
            "&deploy=customdeploy_ssst_service_dash_kanban";
        window.open(url);
    } 
    function openCustomerCard() {

        var customerId = document.getElementById("custpage_customer_id").value;

        if (CheckORAND(customerId, "OR")) {
            swal.fire(
                'Error!',
                'Please select Vehicle/Customer first.',
                'error')

        } else {
            var url = "/app/common/entity/custjob.nl?id=" + customerId + "";

            window.open(url);
        }

    } 
    function openVehicleCard() {

        var vinIdSerial = document.getElementById("selected_vehicle_id").value;

        if (CheckORAND(vinIdSerial, "OR")) {
            swal.fire(
                'Error!',
                'Please select Vehicle first.',
                'error')

        } else {
            var urlVeh = url.resolveRecord({
                recordType: "customrecord_advs_vm",
                recordId: vinIdSerial
            });

            window.open(urlVeh);
        }
    } 
    function openLastOrder() {

        var orderId = document.getElementById("custpage_last_order").value;

        if (orderId == "") {
            swal.fire(
                'Error!',
                'Please select Vehicle first.',
                'error')

        } else {
            if (orderId == 0 || orderId == "0") {
                swal.fire(
                    'Error!',
                    'No workorder Found.',
                    'warning')
            } else {
                var urlVeh = url.resolveRecord({
                    recordType: "salesorder",
                    recordId: orderId
                });

                window.open(urlVeh);
            }
        }

    }
	function fetchHistoryDetails() {

        var vinForHist = document.getElementById("selected_vehicle_id").value;
        $('#loadingIndicatorPill').show();
        $.ajax({
            url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend',
            dataType: 'json',
            type: 'POST',
            data: {
                'vinForHist': vinForHist
            },
            success: function (data) {
                setHistoryDetails(data);
            },
            error: function (xhr, status, error) {
                $('#loader-overlay').hide();
                console.error('Error fetching autocomplete suggestions:', error);
            }
        });

    }
    function setHistoryDetails(data) {

        var historyLen = data.length;

        if (historyLen == 0) {
            document.getElementById("custpage_last_order").value = 0;
        }

        var tooltipSerHistory = "";

        tooltipSerHistory += "    <div class='tooltip-header'>Service History</div> " +
        "    <table class='table'> " +
        "      <thead> " +
        "        <tr> " +
        "          <th class='thStyle'>Date</th> " +
        "          <th class='thStyle'>Document #</th> " +
        "          <th class='thStyle'>Type</th> " +
        "          <th class='thStyle'>PO #</th> " +
        "          <th class='thStyle'>Sales Rep</th> " +
        "          <th class='thStyle'>Status</th> " +
        "        </tr> " +
        "      </thead> " +
        "      <tbody> ";

        for (var H = 0; H < historyLen; H++) {

            var trandate = data[H].trandate || "",
            memo = data[H].memo || "",
            status = data[H].status || "",
            tranid = data[H].tranid || "",
            firstname = data[H].firstname || "",
            middlename = data[H].middlename || "",
            lastname = data[H].lastname || "",
            Type = data[H].type || "",
            statusStandard = data[H].statusstandard;

            tooltipSerHistory += "        <tr class='line'> " +
            "          <td class='inputStyle inputstyleWidth'>" + trandate + "</td> " +
            "          <td class='inputStyle inputstyleWidth'>" + tranid + "</td> " +
            "          <td class='inputStyle inputstyleWidth'>" + Type + "</td> " +
            "          <td class='inputStyle inputstyleWidth'>" + memo + "</td> " +
            "          <td class='inputStyle inputstyleWidth'>" + firstname + " " + middlename + " " + lastname + "</td> " +
            "          <td class='inputStyle inputstyleWidth'>" + status + "</td> " +
            "        </tr> ";

            document.getElementById("custpage_last_order").value = data[H].id;

        }

        tooltipSerHistory += "      </tbody> " +
        "    </table> " +
        "  </div>";

        document.getElementById("custpage_history_tooltip").innerHTML = tooltipSerHistory;

        var arrayValueToIgnore = new Array();

        arrayValueToIgnore.push("Estimate:A");
        // arrayValueToIgnore.push("Estimate:X");
        arrayValueToIgnore.push("SalesOrd:A");
        arrayValueToIgnore.push("SalesOrd:D");
        arrayValueToIgnore.push("SalesOrd:F");
        arrayValueToIgnore.push("SalesOrd:E");
        arrayValueToIgnore.push("SalesOrd:B");

        var openOrderToolTip = "",
        openEstimateToolTip = "",
        NoOfOpenOrder = 0,
        NoOfOpenEstimate = 0;

        openEstimateToolTip += "    <div class='tooltip-header'>Open Estimate</div> " +
        "    <table class='tooltip-table'> " +
        "      <thead> " +
        "        <tr> " +
        "          <th>Date</th> " +
        "          <th>Document #</th> " +
        "          <th>Sales Rep</th> " +
        "        </tr> " +
        "      </thead> " +
        "      <tbody> ";

        openOrderToolTip += "    <div class='tooltip-header'>Open order</div> " +
        "    <table class='tooltip-table'> " +
        "      <thead> " +
        "        <tr> " +
        "          <th>Date</th> " +
        "          <th>Document #</th> " +
        "          <th>Sales Rep</th> " +
        "        </tr> " +
        "      </thead> " +
        "      <tbody> ";

        for (var H = 0; H < historyLen; H++) {

            var trandate = data[H].trandate || "",
            memo = data[H].memo || "",
            status = data[H].status || "",
            tranid = data[H].tranid || "",
            firstname = data[H].firstname || "",
            middlename = data[H].middlename || "",
            lastname = data[H].lastname || "",
            Type = data[H].type || "",
            statusStandard = data[H].statusstandard;

            if (Type == "SalesOrd") {

                if (arrayValueToIgnore.indexOf("SalesOrd:" + statusStandard) != -1) {

                    openOrderToolTip += " <tr> " +
                    "          <td>" + trandate + "</td> " +
                    "          <td>" + tranid + "</td> " +
                    "          <td>" + firstname + " " + middlename + " " + lastname + "</td> " +
                    "        </tr> ";
                    NoOfOpenOrder++;
                }
            } else {

                if (arrayValueToIgnore.indexOf("Estimate:" + statusStandard) != -1) {
                    openEstimateToolTip += " <tr> " +
                    "          <td>" + trandate + "</td> " +
                    "          <td>" + tranid + "</td> " +
                    "          <td>" + firstname + " " + middlename + " " + lastname + "</td> " +
                    "        </tr> ";
                    NoOfOpenEstimate++;
                }

            }

        }

        openEstimateToolTip += "      </tbody> " +
        "    </table> " +
        "  </div>";

        openOrderToolTip += "      </tbody> " +
        "    </table> " +
        "  </div>";

        if (NoOfOpenOrder > 0) {
            document.getElementById("custpage_open_order_count").innerHTML = 'Open order (' + NoOfOpenOrder + ')';
            document.getElementById("custpage_open_order_count_main").style.display = 'block'
        } else {
            document.getElementById("custpage_open_order_count_main").style.display = 'none'
        }

        document.getElementById("custpage_open_order_tooltip").innerHTML = openOrderToolTip;

        if (NoOfOpenEstimate > 0) {
            document.getElementById("custpage_open_quote_count").innerHTML = 'Open Estimate (' + NoOfOpenEstimate + ')';
            document.getElementById("custpage_open_quote_count_main").style.display = 'block'
        } else {
            document.getElementById("custpage_open_quote_count_main").style.display = 'none'
        }

        document.getElementById("custpage_open_quote_tooltip").innerHTML = openEstimateToolTip;
        $('#loadingIndicatorPill').hide();
    }
    function openauthorizationhistory() {
        try {
            window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1744&deploy=1', width = "200px", height = "150px")
        } catch (e) {
            log.debug('erronr in openauthorizationhistory', e.toString())
        }
    }
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
    function getTechnicians(options) {
        try {
			var arr =[];
			var  url= '/app/site/hosting/scriptlet.nl?script=customscript_ssst_ser_dashboard_backend&deploy=customdeploy_ssst_ser_dashboard_backend&getTechnicians=1';
			 jQuery.get(url)
            .done(function (data) {
                 jQuery('#technicians-list').text(data);
            }); 
		}catch(e)
		{
			console.log('error',e.toString())
		}
		 
    }

    return {
        pageInit: pageInit,

        afterVehicleSelectEvent: afterVehicleSelectEvent,
        fetchAttachmentDetails: fetchAttachmentDetails,
        setDataAfterFetchForVIN: setDataAfterFetchForVIN,
        setAttachmentDetails: setAttachmentDetails,
        fetchDataBasedOninputString: fetchDataBasedOninputString,
        initAutocompleteVehicle: initAutocompleteVehicle,
        openauthorizationhistory: openauthorizationhistory
        // fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        // validateLine: validateLine,
        // validateInsert: validateInsert,
        // validateDelete: validateDelete,
    ,
        saveRecord: saveRecord
    };

});
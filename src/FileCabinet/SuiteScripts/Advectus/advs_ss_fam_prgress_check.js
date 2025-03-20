/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/ui/serverWidget', 'N/runtime','N/search','N/format','N/url','./advs_lib_rental_leasing','./advs_lib_util'],
    function(record, serverWidget, runtime,search,format ,url,lib_rental,libUtil) {
        function onRequest(context) {
            if (context.request.method === 'GET') {
                var recordId = context.request.parameters.proc_id;

                var processtype = context.request.parameters.proc_type;
                if(recordId && processtype == "mapstatus"){
                    var scriptObj   =   runtime.getCurrentScript();

                    var scriptId = scriptObj.id;
                    var deploymentId = scriptObj.deploymentId;

                    var form = serverWidget.createForm({ title: "Progress Tracking Form" });

                    var progressField = form.addField({
                        id: 'custpage_progress',
                        type: serverWidget.FieldType.INLINEHTML,
                        label: 'Progress'
                    });

                    var progressHtml = getProgressHtml(recordId, scriptId, deploymentId);
                    progressField.defaultValue = progressHtml;

                    context.response.writePage(form);
                }else if(recordId && processtype == "processadjust"){

                    var advstemprrec = record.load({type:"customrecord_advs_fam_temp_record",id:recordId});
                    var famLink = advstemprrec.getValue("custrecord_advs_fam_temp_rec");
                    var processid = advstemprrec.getValue("custrecord_advs_fam_process_link");
                    var headerID = advstemprrec.getValue("custrecord_advs_fam_t_r_lease");
                    var otherCharges = advstemprrec.getValue("custrecord_advs_fam_temp_otherchrge");
                    var paramdata = advstemprrec.getValue("custrecord_advs_fam_t_r_param");

                    var jsonData = JSON.parse(paramdata);
                    var vehstatus   =  jsonData.vehstatus;
                    var leasestatus =  jsonData.leasestatus;
                    var returntype  =  jsonData.returntype;
                    var Description = jsonData.desc;

                    var FamREc  =   record.load({type:"customrecord_ncfar_asset",id:famLink});
                    var returnAdj   =   FamREc.getValue("custrecord_advs_fam_return_adj");
                    var writeoffacount   =   FamREc.getValue("custrecord_assetwriteoffacc");


                if((!returnAdj) && (Description == "Return charges")){
                    var bookValue = getvehicleCurrentValue(famLink);
                    if(bookValue >0) {
                        var headerREc = record.load({
                            type: "customrecord_advs_lease_header",
                            id: headerID,
                            isDynamic: true
                        });
                        var customer = headerREc.getValue("custrecord_advs_l_h_customer_name");//headerREc.custrecord_advs_l_h_customer_name;
                        var Location = headerREc.getValue("custrecord_advs_l_h_location");//headerREc.custrecord_advs_l_h_location;
                        var subsId = headerREc.getValue("custrecord_advs_l_h_subsidiary");//headerREc.custrecord_advs_l_h_location;
                        var vinID = headerREc.getValue("custrecord_advs_la_vin_bodyfld");//headerREc.custrecord_advs_c_h_tx_rate;
                        var Memo = "FAM Conversion";
                        var Account = runtime.getCurrentScript().getParameter("custscript_advs_veh_fam_account");
                        var Address = "";
                        var shipAddre = "";
                        var invoicedDate = "";
                        var tranDate = format.parse({
                            value: new Date(),
                            type: format.Type.DATE
                        });
                        invoicedDate = tranDate;
                        var lookFld = ["custrecord_advs_vm_subsidary", "name", "cseg_advs_st_vin_se",
                            "cseg_advs_sto_num", "custrecord_advs_vm_last_direct_cost",
                            "custrecord_advs_vm_purchase_invoice_date", "custrecord_advs_vm_model", "custrecord_advs_vm_model.assetaccount"]

                        var lookRec = search.lookupFields({
                            type: "customrecord_advs_vm",
                            id: vinID,
                            columns: lookFld
                        });
                        var aDJaCC = "";

                        var VinModel = lookRec["custrecord_advs_vm_model"][0].value;
                        var subsi = lookRec["custrecord_advs_vm_subsidary"][0].value;

                        var vinSeg = "";
                        var stockSeg = "";
                        if (lookRec['cseg_advs_st_vin_se'] != null && lookRec['cseg_advs_st_vin_se'] != undefined) {
                            vinSeg = lookRec["cseg_advs_st_vin_se"][0].value || "";
                        }
                        if (lookRec['cseg_advs_sto_num'] != null && lookRec['cseg_advs_sto_num'] != undefined) {
                            stockSeg = lookRec["cseg_advs_sto_num"][0].value || "";
                        }


                        var vinName = lookRec["name"];
                        var purChasecost = lookRec["custrecord_advs_vm_last_direct_cost"];
                        var purChasedate = lookRec["custrecord_advs_vm_purchase_invoice_date"];
                        var VinAccount = lookRec["custrecord_advs_vm_model.assetaccount"][0].value;


                        var adj_obj = {
                            body: {
                                subsidiary: subsId,
                                account: writeoffacount,
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
                                    quantity: "1",
                                    rate: 0,
                                    description: "FAM Conversion",
                                    vinid: vinID,
                                    location: Location,
                                    vinsegment: vinSeg,
                                    stocksegment: stockSeg,
                                    inventorynumber: vinName,
                                    amount: bookValue,
                                }
                            ]
                        };
                        var adjustID = lib_rental.createInventoryAdjustmentpositive(adj_obj);

                        record.submitFields({
                            type: "customrecord_ncfar_asset",
                            id: famLink,
                            values: {"custrecord_advs_fam_return_adj": adjustID}
                        });


                        record.submitFields({
                            type: "customrecord_advs_lease_header",
                            id: headerID,
                            values: {
                                "custrecord_advs_l_h_status": leasestatus,
                                // "custrecord_advs_l_h_return_invoice":ReturnInvoiceId
                            }
                        });

                        record.submitFields({
                            type: "customrecord_advs_vm",
                            id: vinID,
                            values: {
                                "custrecord_advs_vm_reservation_status": vehstatus,
                                "custrecord_advs_vm_rental_header": "",
                                "custrecord_advs_vm_rent_child": "",
                                "custrecord_advs_vm_subsidary": subsId,
                                "custrecord_advs_vm_location_code": Location,
                            }
                        });


                        var onclickScript = " <html><body> <script type='text/javascript'>" +
                            "try{" +
                            "";
                        onclickScript += "window.parent.location.reload();";
                        onclickScript+="window.parent.closePopup();";
                        onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";

                        context.response.write(onclickScript);

                    }
                    }else if(Description == 'Pay off charges'){
                        record.submitFields({
                            type: "customrecord_advs_lease_header",
                            id: headerID,
                            values: {
                                "custrecord_advs_l_h_status": leasestatus
                            }
                        });
                        var headerREc = record.load({
                            type: "customrecord_advs_lease_header",
                            id: headerID,
                            isDynamic: true
                        });
                        var vinID = headerREc.getValue("custrecord_advs_la_vin_bodyfld");
                        record.submitFields({
                            type: "customrecord_advs_vm",
                            id: vinID,
                            values: {
                                "custrecord_advs_vm_reservation_status": vehstatus,
                                "custrecord_advs_vm_rental_header": "",
                                "custrecord_advs_vm_rent_child": "",
                            }
                        });
                        var onclickScript = " <html><body> <script type='text/javascript'>" +
                        "try{" +
                        "";
                    onclickScript += "window.parent.location.reload();";
                  onclickScript+="window.parent.closePopup();";
                    onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";

                    context.response.write(onclickScript);
                    }
                else{
                    var onclickScript = " <html><body> <script type='text/javascript'>" +
                                           "try{" +
                                           "";
                                       onclickScript += "window.parent.location.reload();";
                                      onclickScript+="window.parent.closePopup();";
                                       onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";

                                       context.response.write(onclickScript);
                }
                }

            }
        }

        function getProgressHtml(recordId, scriptId, deploymentId) {
            var progressHtml = '';
            var processObjREc = getCompletedStages(recordId); // Get the number of completed stages
            var totalStages = processObjREc.total_stage ;
            var completedStages = processObjREc.completed_stage;
            var percentage = Math.round((completedStages / totalStages) * 100);

            // Progress bar and text
            progressHtml += '<div style="font-family: Arial, sans-serif; margin: 20px;">';
            progressHtml += '    <div style="font-size: 16px; margin-bottom: 10px;">' +
                            '        <strong>' + completedStages + '/' + totalStages + ' completed</strong>' +
                            '    </div>';
            progressHtml += '    <div style="background-color: #f3f3f3; border: 1px solid #ddd; border-radius: 5px; width: 100%; height: 30px; position: relative;">';
            progressHtml += '        <div style="background-color: #4caf50; height: 100%; width: ' + percentage + '%; border-radius: 5px;"></div>';
            progressHtml += '        <div style="position: absolute; width: 100%; text-align: center; line-height: 30px; color: white; font-weight: bold;">' + percentage + '%</div>';
            progressHtml += '    </div>';
            progressHtml += '    <div style="font-size: 14px; color: #ff0000; margin-top: 10px;">' +
                            '        <strong>Don\'t close or refresh the popup. FAM disposal is in progress.</strong>' +
                            '    </div>';
            progressHtml += '</div>';

            // Auto-refresh script
            progressHtml += '<script>setTimeout(function() { location.reload(); }, 5000);</script>';

            // Redirect script if all stages are completed
            if (completedStages >= totalStages) {
                var redirectUrl = getSuiteletUrl(recordId, scriptId, deploymentId);
                progressHtml += '<script>setTimeout(function() { window.location.href = "' + redirectUrl + '"; }, 2000);</script>';
            }

            return progressHtml;
        }
       function getProgressforContinueLease(){
            var ProgressHtml = "";

            ProgressHtml+='<div id="progressBarContainer" style="display: none;">';
            ProgressHtml+='  <div id="progressBar" style="width: 0%; background-color: green; height: 30px;"></div>';
            ProgressHtml+='</div>';
            ProgressHtml+='<p id="progressStatus" style="display: none;">Processing...</p>';
            ProgressHtml += '<script>setTimeout(function() { location.reload(); }, 5000);</script>';
            return ProgressHtml;
        }

        function showProgressBar() {
            document.getElementById('progressBarContainer').style.display = 'block';
            document.getElementById('progressStatus').style.display = 'block';
            updateProgressBar(0);
        }

        function updateProgressBar(percentage) {
            var progressBar = document.getElementById('progressBar');
            progressBar.style.width = percentage + '%';
        }

        function hideProgressBar() {
            document.getElementById('progressBarContainer').style.display = 'none';
            document.getElementById('progressStatus').style.display = 'none';
        }
        function getCompletedStages(recordId) {
            // Load the temporary record to get the process ID
            var advstemprrec = record.load({
                type: 'customrecord_advs_fam_temp_record',
                id: recordId
            });
            var processid = advstemprrec.getValue('custrecord_advs_fam_process_link');

            // Load the process record to get the JSON field with stage data
            var recordObj = record.load({
                type: 'customrecord_fam_process',
                id: processid
            });

            // Get the JSON field data and parse it
            var jsonData = recordObj.getValue('custrecord_fam_procstateval'); // Adjust field ID as necessary

            if(jsonData){
                var stageData = JSON.parse(jsonData);

                // Initialize counters
                var totalStages = 5;
                var completedStages = 0;
                var stage5Exists = false;

                log.debug(stageData.length);
                // Process the stage data
                stageData.forEach(function(item) {
                    if (item.stage === 5) {
                        stage5Exists = true;
                    }
                    if (item.status === 6 || item.status === 3) { // Assuming status 6 means completed
                        completedStages++;
                    }
                });

                // Prepare the result object
                var processObj = {
                    total_stage: totalStages,
                    completed_stage: completedStages,
                    stage_5_exists: stage5Exists
                };


            }else{
                // Prepare the result object
                var processObj = {
                    total_stage: 6,
                    completed_stage: 0,
                    stage_5_exists: true
                };
            }


            return processObj;
        }
        /*   function getCompletedStages(recordId) {

               log.debug("recordId",recordId)
               var advstemprrec = record.load({type:"customrecord_advs_fam_temp_record",id:recordId});
               var processid = advstemprrec.getValue("custrecord_advs_fam_process_link");

               // Load the record and determine the number of completed stages
               var recordObj = record.load({
                   type: 'customrecord_fam_process',
                   id: processid
               });

               var totalStages = recordObj.getValue("custrecord_fam_proctotstages")*1;
               var completedstage = recordObj.getValue("custrecord_fam_proccurrstage")*1;

               var processObj = {};
               processObj.total_stage = totalStages;
               processObj.completed_stage = completedstage;
               return processObj;
           }
   */
        function getSuiteletUrl(recordId,scriptId, deploymentId) {
            // Construct the Suitelet URL for redirection
            var param = {};
            param.proc_id = recordId;
            param.proc_type = "processadjust";
            param.ifrmcntnr = "T";
            var baseUrl = url.resolveScript({
                scriptId: scriptId,
                deploymentId: deploymentId,
                params:param
            });

            // log.debug("baseUrl",baseUrl)
            return baseUrl;
        }

        function getvehicleCurrentValue(famid){
            var customrecord_ncfar_deprhistorySearchObj = search.create({
                type: "customrecord_ncfar_deprhistory",
                filters:
                    [
                        ["custrecord_deprhistasset","anyof",famid],
                        "AND",
                        ["custrecord_deprhisttype","anyof","2","7"],
                        "AND",
                        ["custrecord_deprhistcurrentage","equalto","0"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_deprhistamount",
                            summary: "SUM",
                            label: "Transaction Amount"
                        })
                    ]
            });
            var vehicleCurrentValue = 0;
            customrecord_ncfar_deprhistorySearchObj.run().each(function(result){
                vehicleCurrentValue = result.getValue({name: "custrecord_deprhistamount",
                    summary: "SUM"})
                return true;
            });
            return vehicleCurrentValue;
        }

        return {
            onRequest: onRequest
        };
    });
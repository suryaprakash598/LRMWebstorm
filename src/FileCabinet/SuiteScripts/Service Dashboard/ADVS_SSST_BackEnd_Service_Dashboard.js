/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/query', 'N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget'],
    /**
     * @param{log} log
     * @param{query} query
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     */
    (log, query, record, runtime, search, serverWidget) => {
      /**
       * Defines the Suitelet script trigger point.
       * @param {Object} scriptContext
       * @param {ServerRequest} scriptContext.request - Incoming request
       * @param {ServerResponse} scriptContext.response - Suitelet response
       * @since 2015.2
       */
      const onRequest = (scriptContext) => {
  
        if (scriptContext.request.method == "POST") {
  
          var custparam_status = scriptContext.request.parameters.custparam_status;
          var custparam_order_id = scriptContext.request.parameters.custparam_order_id;

          var custparam_so = scriptContext.request.parameters.custparam_so;
          var custparam_comment = scriptContext.request.parameters.custparam_comment;
          log.debug("custparam_so",custparam_so)
          log.debug("custparam_comment",custparam_comment)
          if(custparam_so){
            var SalesRecObj = record.load({
                type: 'salesorder',
                id: custparam_so,
                isDynamic: true
            });
            SalesRecObj.setValue('custbody_advs_service_quote_memo',custparam_comment);
            var RecordId = SalesRecObj.save({enableSourcing: true,ignoreMandatoryFields: true});
            log.debug("RecordId",RecordId)
          }
  
  
          var form = serverWidget.createForm({
            title: 'service dashboard',
            hideNavBar: true
          });
  
  
  
          if (custparam_status != undefined && custparam_status != null && custparam_status.includes("portlet-card-list-")) {
            var htmlData = "";
            log.emergency("custparam_status", custparam_status.replace("portlet-card-list-", ""));
            var fieldsArray = new Array();
  
  
            fieldsArray["custbody_advs_st_work_order_status"] = custparam_status.replace("portlet-card-list-", "");
  
            record.submitFields({
              type: "salesorder",
              id: custparam_order_id.replace("list_", ""),
              values: fieldsArray
            });
  
            htmlData = "Success";
  
          } else {
  
            var SearchStatusSequence = search.create({
              type: "customrecord_advs_st_work_order_status",
              filters: [
                ["isinactive", "is", "F"]
              ],
              columns: [
                search.createColumn({
                  name: "custrecord_advs_st_w_o_s_sequence",
                  label: "Sequence",
                  sort: search.Sort.ASC
                }),
                search.createColumn({
                  name: "name",
                  label: "Name"
                }),
                search.createColumn({
                  name: "internalid",
                  label: "Internal ID"
                })
              ]
            });
  
            var StatusBySequence = new Array();
            var StatusDetails = new Array();
  
            SearchStatusSequence.run().each(function (result) {
  
              StatusBySequence.push(result.getValue({
                name: "internalid"
              }));
  
              StatusDetails[result.getValue({
                name: "internalid"
              })] = result.getValue({
                name: "name"
              });
              return true;
            });
  
  
            var queryString = "SELECT  " +
              "  BUILTIN_RESULT.TYPE_DATE(TRANSACTION.trandate) AS trandate,  " +
              "  BUILTIN_RESULT.TYPE_INTEGER(TRANSACTION.custbody_advs_st_vehicle_brand) AS custbody_advs_st_vehicle_brand,  " +
              "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_BRANDS.name) AS name,  " +
              "  BUILTIN_RESULT.TYPE_INTEGER(TRANSACTION.custbody_advs_st_model_year) AS custbody_advs_st_model_year,  " +
              "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_MODEL_YEAR.name) AS name_1,  " +
              "  BUILTIN_RESULT.TYPE_INTEGER(CUSTOMRECORD_ADVS_TASK_RECORD_SUB.custrecord_advs_tech_1) AS custrecord_advs_tech_1,  " +
              "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_TASK_RECORD_SUB.name) AS name_2,  " +
              "  BUILTIN_RESULT.TYPE_INTEGER(TRANSACTION.ID) AS ID,  " +
              "  BUILTIN_RESULT.TYPE_INTEGER(CUSTOMRECORD_ADVS_TASK_RECORD_SUB.ID) AS id_1,  " +
              "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_TASK_RECORD_SUB.custrecord_repair_desc) AS custrecord_repair_desc,  " +
              "  BUILTIN_RESULT.TYPE_STRING(TRANSACTION.tranid) AS tranid,  " +
              "  BUILTIN_RESULT.TYPE_STRING(Customer.altname) AS altname,  " +
              "  BUILTIN_RESULT.TYPE_INTEGER(TRANSACTION.entity) AS entity,  " +
              "  BUILTIN_RESULT.TYPE_INTEGER(TRANSACTION.custbody_advs_st_model) AS custbody_advs_st_model,  " +
              "  BUILTIN_RESULT.TYPE_STRING(item.fullname) AS fullname,  " +
              "  BUILTIN_RESULT.TYPE_INTEGER(TRANSACTION.custbody_advs_st_vin_invoice) AS custbody_advs_st_vin_invoice,  " +
              "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_VM.name) AS name_3,  " +
              "  BUILTIN_RESULT.TYPE_CURRENCY(TRANSACTION.foreigntotal, BUILTIN.CURRENCY(TRANSACTION.foreigntotal)) AS foreigntotal,  " +
              "  BUILTIN_RESULT.TYPE_INTEGER(TRANSACTION.custbody_advs_st_work_order_status) AS custbody_advs_st_work_order_status,  " +
              "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_ST_WORK_ORDER_STATUS.name) AS name_4,  " +
              "  BUILTIN_RESULT.TYPE_INTEGER(CUSTOMRECORD_ADVS_ST_WORK_ORDER_STATUS.custrecord_advs_st_w_o_s_sequence) AS custrecord_advs_st_w_o_s_sequence " +
              "FROM  " +
              "  TRANSACTION,  " +
              "  item,  " +
              "  CUSTOMRECORD_ADVS_MODEL_YEAR,  " +
              "  CUSTOMRECORD_ADVS_BRANDS,  " +
              "  CUSTOMRECORD_ADVS_VM,  " +
              "  CUSTOMRECORD_ADVS_ST_WORK_ORDER_STATUS,  " +
              "  (SELECT  " +
              "    CUSTOMRECORD_ADVS_TASK_RECORD.custrecord_advs_st_r_t_work_ord_link AS custrecord_advs_st_r_t_work_ord_link,  " +
              "    CUSTOMRECORD_ADVS_TASK_RECORD.custrecord_advs_st_r_t_work_ord_link AS custrecord_advs_st_r_t_work_ord_link_join,  " +
              "    CUSTOMRECORD_ADVS_TASK_RECORD.custrecord_advs_tech_1 AS custrecord_advs_tech_1,  " +
              "    CUSTOMRECORD_ADVS_MECHANIC.name AS name,  " +
              "    CUSTOMRECORD_ADVS_TASK_RECORD.ID AS ID,  " +
              "    CUSTOMRECORD_ADVS_TASK_RECORD.custrecord_repair_desc AS custrecord_repair_desc " +
              "  FROM  " +
              "    CUSTOMRECORD_ADVS_TASK_RECORD,  " +
              "    CUSTOMRECORD_ADVS_MECHANIC " +
              "  WHERE  " +
              "    CUSTOMRECORD_ADVS_TASK_RECORD.custrecord_advs_tech_1 = CUSTOMRECORD_ADVS_MECHANIC.ID(+) " +
              "  ) CUSTOMRECORD_ADVS_TASK_RECORD_SUB,  " +
              "  Customer,  " +
              "  transactionLine " +
              "WHERE  " +
              "  ((((((((TRANSACTION.custbody_advs_st_model = item.ID(+) AND TRANSACTION.custbody_advs_st_model_year = CUSTOMRECORD_ADVS_MODEL_YEAR.ID(+)) AND TRANSACTION.custbody_advs_st_vehicle_brand = CUSTOMRECORD_ADVS_BRANDS.ID(+)) AND TRANSACTION.custbody_advs_st_vin_invoice = CUSTOMRECORD_ADVS_VM.ID(+)) AND TRANSACTION.custbody_advs_st_work_order_status = CUSTOMRECORD_ADVS_ST_WORK_ORDER_STATUS.ID(+)) AND TRANSACTION.ID = CUSTOMRECORD_ADVS_TASK_RECORD_SUB.custrecord_advs_st_r_t_work_ord_link(+)) AND TRANSACTION.entity = Customer.ID(+)) AND TRANSACTION.ID = transactionLine.TRANSACTION)) " +
              "   AND ((transactionLine.mainline = 'T' AND TRANSACTION.custbody_advs_module_name IN ('3') AND TRANSACTION.TYPE IN ('SalesOrd'))) ";
  
  
            var resultSet = query.runSuiteQL({
              query: queryString
            });
  
            var results = resultSet.asMappedResults();
  
            var responseContent = results;
  
            var uniqueOrder = new Array();
            var allDataArray = new Array();
            var orderStatusWiseData = new Array();
            var orderStatusUniqueArr = new Array();
            var orderStatusNameArray = new Array();
  
            for (var l = 0; l < responseContent.length; l++) {
  
              var trandate = responseContent[l].trandate;
              var brandId = responseContent[l].custbody_advs_st_vehicle_brand;
              var brandName = responseContent[l].name;
              var modelYearId = responseContent[l].custbody_advs_st_model_year;
              var modelYearNa = responseContent[l].name_1;
              var tranIntId = responseContent[l].id;
              var jobId = responseContent[l].id_1;
              var jobName = responseContent[l].custrecord_repair_desc;
              var tranNumber = responseContent[l].tranid;
              var customerName = responseContent[l].altname;
              var customerId = responseContent[l].entity;
              var modelId = responseContent[l].custbody_advs_st_model;
              var modelName = responseContent[l].fullname;
              var vinId = responseContent[l].custbody_advs_st_vin_invoice;
              var vinNumber = responseContent[l].name_3;
              var amount = responseContent[l].foreigntotal;
              var orderStatusId = responseContent[l].custbody_advs_st_work_order_status;
              var orderStatusNa = responseContent[l].name_4;
              var sequence = responseContent[l].custrecord_advs_st_w_o_s_sequence;
  
              var techName = responseContent[l].name_2;
              var techId = responseContent[l].custrecord_advs_tech_1;
  
              if (orderStatusUniqueArr.indexOf(orderStatusId) == -1) {
                orderStatusUniqueArr.push(orderStatusId);
                orderStatusWiseData[orderStatusId] = new Array();
                orderStatusWiseData[orderStatusId].push(tranIntId);
  
                orderStatusNameArray[orderStatusId] = orderStatusNa;
  
              } else {
                if (orderStatusWiseData[orderStatusId].indexOf(tranIntId) == -1) {
                  orderStatusWiseData[orderStatusId].push(tranIntId);
                }
              }
  
  
  
              var len = 0;
  
              if (uniqueOrder.indexOf(tranIntId) == -1) {
                uniqueOrder.push(tranIntId);
  
                allDataArray[tranIntId] = new Array();
  
              } else {
  
                len = allDataArray[tranIntId].length;
              }
  
              allDataArray[tranIntId][len] = new Array();
  
              allDataArray[tranIntId][len]["trandate"] = trandate;
              allDataArray[tranIntId][len]["brandId"] = brandId;
              allDataArray[tranIntId][len]["brandName"] = brandName;
              allDataArray[tranIntId][len]["modelYearId"] = modelYearId;
              allDataArray[tranIntId][len]["modelYearNa"] = modelYearNa;
              allDataArray[tranIntId][len]["jobName"] = jobName;
              allDataArray[tranIntId][len]["tranNumber"] = tranNumber;
              allDataArray[tranIntId][len]["customerName"] = customerName;
              allDataArray[tranIntId][len]["customerId"] = customerId;
              allDataArray[tranIntId][len]["modelId"] = modelId;
              allDataArray[tranIntId][len]["modelName"] = modelName;
              allDataArray[tranIntId][len]["vinId"] = vinId;
              allDataArray[tranIntId][len]["vinNumber"] = vinNumber;
              allDataArray[tranIntId][len]["amount"] = amount;
              allDataArray[tranIntId][len]["orderStatusId"] = orderStatusId;
              allDataArray[tranIntId][len]["orderStatusNa"] = orderStatusNa;
              allDataArray[tranIntId][len]["sequence"] = sequence;
              allDataArray[tranIntId][len]["techName"] = techName;
              allDataArray[tranIntId][len]["techId"] = techId;
              allDataArray[tranIntId][len]["jobId"] = jobId;
            }
  
            // log.emergency("orderStatusWiseData",orderStatusWiseData);
  
            var htmlData = "";
  
			var statusArr =['Incoming Trucks','Customer C&A','Customer Pending Approval',
							'Customer Pending Repair','Customer Repair In Progress',
							'Repair Complete- Need to Invoice','Customer Waiting Payment'
							];
							var jobsfororder=[];
            for (var or = 0; or < StatusBySequence.length; or++) {
  
              var statusId = StatusBySequence[or];
  
              htmlData += "                  <div class='board-portlet' >" +
                "<div style='display: flex;'>";
  
              var statusName = StatusDetails[statusId] || " ";
  
              try {
                var orderLength = orderStatusWiseData[statusId].length;
              } catch (e) {
                var orderLength = 0;
              }
				
				if(statusArr.indexOf(statusName)!=-1){
					htmlData += "<div style='width: 70%;' class='externaltrucks'>" ;
					htmlData += "<h4 class='portlet-heading' style='font-size: 19px;margin: -2px;'>  " + statusName + "</h4>" +
					"</div>                    " ;
				}else{
					htmlData += "<div style='width: 70%;' class='internaltrucks'>" ;
					htmlData += "<h4 class='portlet-heading' style='font-size: 19px;margin: -2px;'>  " + statusName + "</h4>" +
					"</div> ";
				}
              
                htmlData += "<div style='margin-top:-15px;'>" +
                "                    <p class='task-number' style='color:black;' ><b>" + orderLength + " orders </b></p>" +
                "</div>                      " +
                "</div>" +
                "                    <ul id='portlet-card-list-" + statusId + "' class='portlet-card-list'>";
  
              for (var uOrder = 0; uOrder < orderLength; uOrder++) {
  
                var orderId = orderStatusWiseData[statusId][uOrder];
  
                var numberOfJobs = allDataArray[orderId].length;
  
                var trandate = allDataArray[orderId][0]["trandate"],
                  brandId = allDataArray[orderId][0]["brandId"],
                  brandName = allDataArray[orderId][0]["brandName"] || "",
                  modelYearId = allDataArray[orderId][0]["modelYearId"],
                  modelYearNa = allDataArray[orderId][0]["modelYearNa"] || "",
                  jobId = allDataArray[orderId][0]["jobId"] || "",
                  jobName = allDataArray[orderId][0]["jobName"],
                  tranNumber = allDataArray[orderId][0]["tranNumber"],
                  customerName = allDataArray[orderId][0]["customerName"],
                  customerId = allDataArray[orderId][0]["customerId"],
                  modelId = allDataArray[orderId][0]["modelId"],
                  modelName = allDataArray[orderId][0]["modelName"] || "",
                  vinId = allDataArray[orderId][0]["vinId"],
                  vinNumber = allDataArray[orderId][0]["vinNumber"],
                  amount = allDataArray[orderId][0]["amount"],
                  orderStatusId = allDataArray[orderId][0]["orderStatusId"],
                  orderStatusNa = allDataArray[orderId][0]["orderStatusNa"],
                  sequence = allDataArray[orderId][0]["sequence"],
                  techId = allDataArray[orderId][0]["techId"],
                  techName = allDataArray[orderId][0]["techName"] || "";
  
  
                htmlData += "<li class='portlet-card' id='list_" + orderId + "' style='padding: 5px 5px 5px 5px;'>" +
                  "<div class='progress'>" +
                  "<div class='progress-bar bg-gradient-success' role='progressbar' style='width: 50%' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100'></div>" +
                  "</div>" +
                  "<div>";
                  if(numberOfJobs > 1){
				  if(jobName=='' || jobName==null){jobName='';}
                      htmlData +="<h4 class='task-title' style='margin: 0px; font-size: 17px;'>" + jobName + "("+numberOfJobs+" more...)</h4>" +
                          "";
                 }else{
					 if(jobName=='' || jobName==null){jobName='';}
                     htmlData +="<h4 class='task-title' style='margin: 0px;  font-size: 17px;'>" + jobName + "</h4>" +
                         "";
                 }  //  26/112024-removed
  
                htmlData += "<div style='display: flex;'>" +
                  "<div class='badge badge-primary badge-pill' style='width: fit-content;'>" + orderId + "</div>" +
                  "<div class='badge badge-info badge-pill' style='width: fit-content;'>Info</div>" +
                  "<div class='badge badge-success badge-pill' style='width: fit-content;'>Success</div>" +
                  "<div class='badge badge-danger badge-pill' style='width: fit-content;'>Danger</div>" +
                  "</div>" +
                  "" +
  
                  "<div style='margin-top: 8px; font-weight: bold;' class='vinnumbercls'>" +
                  " <i class='fa fa-address-card-o' style='font-size: 17px; margin-left: 5px;'></i> " + vinNumber + "" +
                  "</div>" +
                  "<div style=' font-weight: bold;'>" +
                  " <i class='fa fa-car' style='font-size: 17px; margin-left: 5px;'></i> " + modelYearNa + " " + brandName + " " + modelName + "" +
                  "</div>" +
  
                  "<div style='font-weight: bold;'>" +
                  "<i class='fa fa-user-o' style='font-size: 17px; margin-left: 5px;'></i><span data-id=" + customerId + "> " + customerName + "</span>" +
                  "</div>" +
  
                  "<div style='font-weight: bold;' class>" +
                  "<i class='fa fa-wrench' style='font-size: 17px; margin-left: 5px;'></i><span class='techname' data-id=" + techId + "> " + techName + "</span>" +
                  "</div>" +
  
                  "<div style='font-weight: bold;'>" +
                  "<i class='fa fa-list' style='font-size: 17px; margin-left: 5px;'></i> <a class='ordernumber' href='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1704&deploy=1&whence=&recid=" + orderId + "' target='_blank' style='text-decoration: none;'>" + tranNumber + "</a>" +
                  "</div>" +
  
  
                  "<div class='d-flex align-items-center justify-content-between text-muted border-top py-3 mt-3'> " +
                  "<div style='display: flex;width: 100%; color: #728bc4 !important;'>" +
                  "                        <div class='image-grouped' style='width: 70%; margin-top: 18px;'>" +
                  "                         <i class=' fa fa-history' style='font-size: 20px;'></i>" +
                  "                         <i class=' fa fa-info' style='font-size: 20px; margin-left: 12px;'></i>" +
                  "                         <i class='fa fa-keyboard-o' style='font-size: 20px; margin-left: 12px;'></i>" +
                  // "<i class='fa fa-comment-o job-comment-popup' style='font-size: 20px; margin-left: 12px;' onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '/SuiteScripts/Service Dashboard/advs_cs_comments.js';var entryPointRequire = require.config(rConfig);entryPointRequire(['/SuiteScripts/Service Dashboard/advs_cs_comments.js'], function (mod) {if (!!window) {}mod.handleIconClick("+orderId+","+jobId+");}); return false;\"></i>"+
                  "                         <i class='fa fa-comment-o job-comment-popup' style='font-size: 20px; margin-left: 12px;' data-recid=" + orderId + "  ></i>" +
                  "                         <i class='fa fa-clock-o jobstatus' style='font-size: 20px; margin-left: 12px;' data-recid-clock="+orderId+"></i>" +
                  "                        </div>" +
                  "<div>" +
                  "                      <div class='wrapper d-flex align-items-center'> " +
                  "                        <p class='due-date' style='color:black;'><b>$ " + amount + "</b></p>" +
                  "                      </div> " +
                  "                    </div>" +
                  "</div>";

  
  
                htmlData += "                      </li>";
              }
  
              if (orderLength == 0) {
  
                htmlData += "                    <li></li>";
              }
  
              htmlData += "                    </ul>" +
                "                    " +
                "                  </div>";
  
				

  
  
            }
          }
  
  
          //job comments POPUP
		  htmlData +=`<div class="modal custom-modal" id="myclockModal">
				  <div class="modal-dialog modal-xl">
					<div class="modal-content">

					  <!-- Modal Header -->
					  <div class="modal-header">
						<h4 class="modal-title"></h4>
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					  </div>
					 
					  <!-- Modal body -->
					  <div class="modal-body">
						Modal body..
					  </div>
						 
					  <!-- Modal footer -->
					  <div class="modal-footer">
						<button type="button" class="btn btn-danger" id="clockmodelclose" data-bs-dismiss="modal">Close</button>
					  </div>

					</div>
				  </div>
				</div>`; 
          htmlData+=`<style>.custom-modal .modal-dialog {
  position: fixed;
  transform: none;
  margin: 0;
  width:1000px !important;
}
.jobstatusdata {
	border-collapse: collapse; 
    border: 1px solid black;
}
.jobstatusdata td,  
.jobstatusdata th { 
    border: 1px solid black; 
    padding: 8px; 
}

</style>`;
				htmlData+=`
              <script>  $(document).ready(function () {
  $('.jobstatus').on('click', function (event) {
    // Get the button's position
    const buttonOffset = $(this).offset();
    const buttonWidth = $(this).outerWidth();
    const buttonHeight = $(this).outerHeight();

    // Set modal's position dynamically
    $('#myclockModal .modal-dialog').css({
      top: buttonOffset.top + (buttonHeight-400) + 'px', // Below the button
      left: buttonOffset.left + buttonWidth / 2 + 'px' // Centered horizontally to button
    });
  });
});
                
           </script>     `;
				htmlData +=`<div class="modal notesmodel" id="mynotesModal">
				  <div class="modal-dialog">
					<div class="modal-content">

					  <!-- Modal Header -->
					  <div class="modal-header">
						<h4 class="modal-title"></h4>
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					  </div>

					  <!-- Modal body -->
					  <div class="modal-body" id="modelbodynotes">
						Modal body..
					  </div>

					  <!-- Modal footer -->
					  <div class="modal-footer">
						<button type="button" class="btn btn-danger" id="notesmodelclose" data-bs-dismiss="modal">Close</button>
					  </div>

					</div>
				  </div>
				</div>`;
  htmlData+=`<style>.notesmodel .modal-dialog {
  position: fixed;
  transform: none;
  margin: 0;
  width:500px !important;
}</style>`;
				htmlData+=`
              <script>  $(document).ready(function () {
  $('.job-comment-popup').on('click', function (event) {
    // Get the button's position
    const buttonOffset = $(this).offset();
    const buttonWidth = $(this).outerWidth();
    const buttonHeight = $(this).outerHeight();

    // Set modal's position dynamically
    $('#mynotesModal .modal-dialog').css({
      top: buttonOffset.top + (buttonHeight-400) + 'px', // Below the button
      left: buttonOffset.left + buttonWidth  + 'px' // Centered horizontally to button
    });
  });
});
                
           </script>     `;
  
          form.clientScriptModulePath = './advs_cs_comments.js';
          // scriptContext.response.write({output:JSON.stringify(results)});
          scriptContext.response.write({
            output: htmlData
          });
  
        }else if(scriptContext.request.method == "GET"){ 
			var custparam_order_id = scriptContext.request.parameters.custparam_order_id;
			if(custparam_order_id){
				var customrecord_advs_task_recordSearchObj = search.create({
				   type: "customrecord_advs_task_record",
				   filters:
				   [
					  ["custrecord_advs_st_r_t_work_ord_link","anyof",custparam_order_id], 
					  "AND", 
					  ["isinactive","is","F"]
				   ],
				   columns:
				   [
					  "name",
					  "custrecord_repair_desc",
					  "custrecord_advs_at_r_t_labor_time_1",
					  "custrecord_st_r_t_status",
                     "custrecord_advs_repair_task_time",
                     "custrecord_advs_st_r_t_actual",
					  search.createColumn({
						 name: "custrecord_advs_m_c_mechanic",
						 join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK"
					  })
				   ]
				});
				var searchResultCount = customrecord_advs_task_recordSearchObj.runPaged().count;
				log.debug("customrecord_advs_task_recordSearchObj result count",searchResultCount);
				var jobs =[];
				customrecord_advs_task_recordSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				   var obj={};
				   obj.jobname = result.getValue({name:'name'});
				   obj.jobdesc = result.getValue({name:'custrecord_repair_desc'});
				   obj.joblabortime = result.getValue({name:'custrecord_advs_at_r_t_labor_time_1'});
                  obj.jobactualtime = result.getValue({name:'custrecord_advs_st_r_t_actual'});
                  obj.jobinvoicetime = (result.getValue({name:'custrecord_advs_repair_task_time'})/60);
				   obj.jobstatus = result.getText({name:'custrecord_st_r_t_status'});
				   obj.jobmechanic = result.getText({
						 name: "custrecord_advs_m_c_mechanic",
						 join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK"
					  });
				   jobs.push(obj);
				   return true;
				});
				 scriptContext.response.write(JSON.stringify(jobs));
			}
			
			
		}
  
  
      }
  
      return {
        onRequest
      }
  
    });
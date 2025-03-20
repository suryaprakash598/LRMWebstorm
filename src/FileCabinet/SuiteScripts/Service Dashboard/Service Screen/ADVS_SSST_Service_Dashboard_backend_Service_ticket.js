/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search', 'N/log', 'N/record', 'N/query', 'N/file', 'N/cache'],

  (search, log, record, query, file, cache) => {
    /**
     * Defines the Suitelet script trigger point.
     * @param {Object} scriptContext
     * @param {ServerRequest} scriptContext.request - Incoming request
     * @param {ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    const onRequest = (scriptContext) => {

      if (scriptContext.request.method == "POST") {

        // log.emergency("A",scriptContext.request.body);

        var searchText = scriptContext.request.parameters.search_text;
        var vinId = scriptContext.request.parameters.vinId;
        var vinIdSerial = scriptContext.request.parameters.vinIdSerial;
        var vinForHist = scriptContext.request.parameters.vinForHist;
        var customerId = scriptContext.request.parameters.customerId;
        var item_text = scriptContext.request.parameters.item_text;
        var itemIdAdd = scriptContext.request.parameters.itemIdAdd;
        var itemIdDel = scriptContext.request.parameters.itemIdDel;
        var search_customer_text = scriptContext.request.parameters.search_customer_text;
        var customerDetails = scriptContext.request.parameters.customerIdForDetails;
        var searchOrderStatus = scriptContext.request.parameters.searchOrderStatus;
        var searchAvailableTech = scriptContext.request.parameters.searchAvailableTech;
        var searchOrderData_lines_job_clockin = scriptContext.request.parameters.searchOrderData_lines_job_clockin;
        var searchOrderData_lines_job_clockin_details = scriptContext.request.parameters.searchOrderData_lines_job_clockin_details;
        var vinIdPack = scriptContext.request.parameters.vinIdPack;
        var checkfornewChat = scriptContext.request.parameters.checkfornewChat;
        var vinhistory = scriptContext.request.parameters.vinhistory || 0;
        log.error('vinhistory', vinhistory);
        var data_details = scriptContext.request.parameters.data_details;
        var action_type = scriptContext.request.parameters.action_type;
        var soid = scriptContext.request.parameters.soid;

        var getTechnicians = scriptContext.request.parameters.getTechnicians;

        log.emergency("action_type", action_type);

        if (searchText != "" && searchText != null && searchText != undefined && searchText != "null" && searchText != "undefined") {

          var vehicleSearchObj = search.create({
            type: "customrecord_advs_vm",
            filters: [
              ["isinactive", "is", "F"],
              "AND",
              [
                [
                  ["custrecord_advs_vm_plate_no", "contains", searchText]
                ], "OR", [
                  ["name", "contains", searchText]
                ], "OR", [
                  ["custrecord_advs_em_serial_number", "contains", searchText]
                ], "OR", [
                  ["custrecord_advs_vm_engine_number", "contains", searchText]
                ], "OR", [
                  ["custrecord_advs_vm_customer_number.entityid", "contains", searchText]
                ]
              ]
            ],
            columns: [
              search.createColumn({
                name: "internalid",
                label: "Internal ID"
              }),
              search.createColumn({
                name: "name",
                label: "Name"
              }),
              search.createColumn({
                name: "custrecord_advs_vm_engine_number",
                label: "Serial #"
              }),
              search.createColumn({
                name: "custrecord_advs_em_serial_number",
                label: "Unit #"
              }),
              search.createColumn({
                name: "entityid",
                join: "custrecord_advs_vm_customer_number",
                label: "Entiry Id"
              })
            ]
          });

          var jData = new Array();
          vehicleSearchObj.run()
            .each(function (result) {

              var vinNum = result.getValue({
                name: "name"
              });
              var stockNo = result.getValue({
                name: "custrecord_advs_vm_engine_number"
              });
              var internalid = result.getValue({
                name: "internalid"
              });
              var plateNo = result.getValue({
                name: "custrecord_advs_em_serial_number"
              });
              var entityid = result.getValue({
                name: "entityid",
                join: "custrecord_advs_vm_customer_number"
              });

              var dataChunk = new Object();

              dataChunk["altname"] = vinNum;
              dataChunk["plateNum"] = plateNo;
              dataChunk["internalid"] = internalid;
              dataChunk["stockNo"] = stockNo;
              dataChunk["entityid"] = entityid;

              jData.push(dataChunk);

              if (jData.length <= 500) {
                return true;
              } else {
                return false;
              }

            });

          scriptContext.response.write({
            output: JSON.stringify(jData)
          });

        } else if (checkfornewChat == 1) {

          var dataTempObjmain = new Array();

          var tempDataObj = new Object();

          tempDataObj["user"] = 5;
          tempDataObj["chat"] = "yes";

          dataTempObjmain.push(tempDataObj);

          scriptContext.response.write({
            output: JSON.stringify(dataTempObjmain)
          });
        } else if (vinIdPack > 0) {

          var jData = new Array();
          var UniquePackage = new Array();

          var searchPackage = search.create({
            type: "customrecord_advs_after_sale_package_bom",
            filters: [
              ["custrecord_advs_asp_bom_pack_no.custrecord_advs_asp_package", "anyof", "2"],
              "AND",
              ["isinactive", "is", "F"],
              "AND",
              ["custrecord_advs_asp_bom_pack_no.isinactive", "is", "F"],
              "AND",
              ["custrecord_advs_asp_bom_pack_no.custrecord_advs_applicable_type", "anyof", "3"]
            ],
            columns: [
              search.createColumn({
                name: "custrecord_advs_asp_bom_pack_no",
                label: "Package Number"
              }),
              search.createColumn({
                name: "custrecord_advs_asp_bom_selected_invtype",
                label: "Inventory Type"
              }),
              search.createColumn({
                name: "custrecord_advs_asp_bom_item",
                label: "Item"
              }),
              search.createColumn({
                name: "custrecord_advs_asp_bom_desc",
                label: "Description"
              }),
              search.createColumn({
                name: "custrecord_advs_asp_bom_quantity",
                label: "Quantity"
              }),
              search.createColumn({
                name: "custrecord_advs_bom_item_cost",
                label: "item Cost(Per piece)"
              }),
              search.createColumn({
                name: "custrecord_advs_bom_item_fixed_price",
                label: "Fixed sales Price (Per piece) "
              }),
              search.createColumn({
                name: "custrecord_advs_a_s_p_b_discount",
                label: "Discount %"
              }),
              search.createColumn({
                name: "custrecord_advs_bom_package_line_p",
                label: "Package Item Price"
              }),
              search.createColumn({
                name: "custrecord_advs_bom_line_amount",
                label: "Package Line Amount"
              }),
              search.createColumn({
                name: "custrecord_advs_a_s_p_ac_amount",
                label: "Actual Amount"
              }),
              search.createColumn({
                name: "name",
                join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO",
                label: "Name"
              }),
              search.createColumn({
                name: "custrecord_advs_asp_package_desc",
                join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO",
                label: "Description"
              }),
              search.createColumn({
                name: "custrecord_advs_package_type",
                join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO",
                label: "Package Type"
              }),
              search.createColumn({
                name: "custrecord_advs_a_s_p_operation_code",
                join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO",
                label: "Operation Code"
              }),
              search.createColumn({
                name: "custrecord_advs_a_s_p_fixed_price",
                join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO",
                label: "Fixed Price"
              })
            ]
          });

          searchPackage.run()
            .each(function (result) {

              var lenData = 0;

              var packId = result.getValue({
                name: "custrecord_advs_asp_bom_pack_no"
              });

              if (UniquePackage.indexOf(packId) == -1) {

                UniquePackage.push(packId);
                jData[packId] = new Array();
                lenData = 0;

              } else {
                lenData = jData[packId].length;
              }

              jData[packId][lenData] = new Array();

              jData[packId][lenData]["packId"] = packId;
              jData[packId][lenData]["packDesc"] = result.getValue({
                name: "custrecord_advs_asp_package_desc",
                join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO"
              });
              jData[packId][lenData]["packName"] = result.getValue({
                name: "name",
                join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO"
              });
              jData[packId][lenData]["packType"] = result.getText({
                name: "custrecord_advs_package_type",
                join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO"
              });
              jData[packId][lenData]["operationCode"] = result.getValue({
                name: "custrecord_advs_a_s_p_operation_code",
                join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO"
              });
              jData[packId][lenData]["fixedPrice"] = result.getValue({
                name: "custrecord_advs_a_s_p_fixed_price",
                join: "CUSTRECORD_ADVS_ASP_BOM_PACK_NO"
              });

              jData[packId][lenData]["invType"] = result.getValue({
                name: "custrecord_advs_asp_bom_selected_invtype"
              });
              jData[packId][lenData]["invTypeName"] = result.getText({
                name: "custrecord_advs_asp_bom_selected_invtype"
              });

              jData[packId][lenData]["itemId"] = result.getValue({
                name: "custrecord_advs_asp_bom_item"
              });
              jData[packId][lenData]["itemName"] = result.getText({
                name: "custrecord_advs_asp_bom_item"
              });
              jData[packId][lenData]["bomDesc"] = result.getValue({
                name: "custrecord_advs_asp_bom_desc"
              });
              jData[packId][lenData]["quantity"] = result.getValue({
                name: "custrecord_advs_asp_bom_quantity"
              });
              jData[packId][lenData]["cost"] = result.getValue({
                name: "custrecord_advs_bom_item_cost"
              });
              jData[packId][lenData]["fixPrice"] = result.getValue({
                name: "custrecord_advs_bom_item_fixed_price"
              });

              jData[packId][lenData]["disc"] = result.getValue({
                name: "custrecord_advs_a_s_p_b_discount"
              });
              jData[packId][lenData]["itemPrice"] = result.getValue({
                name: "custrecord_advs_bom_package_line_p"
              });
              jData[packId][lenData]["lineAmount"] = result.getValue({
                name: "custrecord_advs_bom_line_amount"
              });
              jData[packId][lenData]["lineActuAmount"] = result.getValue({
                name: "custrecord_advs_a_s_p_ac_amount"
              });

              return true;
            });

          var dataToReturn = new Array();

          for (var f = 0; f < UniquePackage.length; f++) {

            var dataTempObjmain = new Object();

            var packId = UniquePackage[f];

            var packLen = jData[packId].length;

            for (var lenData = 0; lenData < packLen; lenData++) {

              var dataTempObj = new Object();
              dataTempObj["packId"] = jData[packId][lenData]["packId"];
              dataTempObj["packDesc"] = jData[packId][lenData]["packDesc"];
              dataTempObj["packName"] = jData[packId][lenData]["packName"];
              dataTempObj["packType"] = jData[packId][lenData]["packType"];
              dataTempObj["operationCode"] = jData[packId][lenData]["operationCode"];
              dataTempObj["fixedPrice"] = jData[packId][lenData]["fixedPrice"];
              dataTempObj["invType"] = jData[packId][lenData]["invType"];
              dataTempObj["invTypeName"] = jData[packId][lenData]["invTypeName"];
              dataTempObj["itemId"] = jData[packId][lenData]["itemId"];
              dataTempObj["itemName"] = jData[packId][lenData]["itemName"];
              dataTempObj["bomDesc"] = jData[packId][lenData]["bomDesc"];
              dataTempObj["quantity"] = jData[packId][lenData]["quantity"];
              dataTempObj["cost"] = jData[packId][lenData]["cost"];
              dataTempObj["fixPrice"] = jData[packId][lenData]["fixPrice"];
              dataTempObj["disc"] = jData[packId][lenData]["disc"];
              dataTempObj["itemPrice"] = jData[packId][lenData]["itemPrice"];
              dataTempObj["lineAmount"] = jData[packId][lenData]["lineAmount"];
              dataTempObj["lineActuAmount"] = jData[packId][lenData]["lineActuAmount"];
              dataTempObj["packLen"] = packLen;

              dataTempObjmain[lenData] = dataTempObj;

            }

            dataToReturn.push(dataTempObjmain);

          }

          scriptContext.response.write({
            output: JSON.stringify(dataToReturn)
          });

        } else if (searchOrderStatus == 1) {

          var SerachforStatus = search.create({
            type: "customrecord_advs_st_work_order_status",
            filters: [
              ["isinactive", "is", "F"]
            ],
            columns: [
              search.createColumn({
                name: "internalid",
                label: "Internal ID"
              }),
              search.createColumn({
                name: "name",
                label: "Name"
              }),
              search.createColumn({
                name: "custrecord_advs_st_w_o_s_sequence",
                label: "Sequence"
              })
            ]
          });
          var jData = new Array();

          var dataChunk = new Object();

          dataChunk["name"] = "";
          dataChunk["id"] = "";

          jData.push(dataChunk);

          SerachforStatus.run()
            .each(function (result) {

              var dataChunk = new Object();

              dataChunk["name"] = result.getValue({
                name: "name"
              });
              dataChunk["id"] = result.getValue({
                name: "internalid"
              });

              jData.push(dataChunk);

              return true;
            });

          scriptContext.response.write({
            output: JSON.stringify(jData)
          });

        } else if (searchAvailableTech == 1) {

          var SerachforStatus = search.create({
            type: "customrecord_advs_mechanic",
            filters: [
              ["isinactive", "is", "F"]
            ],
            columns: [
              search.createColumn({
                name: "internalid",
                label: "Internal ID"
              }),
              search.createColumn({
                name: "name",
                label: "Name"
              })
            ]
          });
          var jData = new Array();

          var dataChunk = new Object();

          dataChunk["name"] = "";
          dataChunk["id"] = "";

          jData.push(dataChunk);

          SerachforStatus.run()
            .each(function (result) {

              var dataChunk = new Object();

              dataChunk["name"] = result.getValue({
                name: "name"
              });
              dataChunk["id"] = result.getValue({
                name: "internalid"
              });

              jData.push(dataChunk);

              return true;
            });

          scriptContext.response.write({
            output: JSON.stringify(jData)
          });

        } else if (searchOrderData_lines_job_clockin == 1) {

          var orderId = scriptContext.request.parameters.orderId;

          var queryString = "";

          queryString += "SELECT " +
            // "    -- Sales Order Header Fields " +
            "    so.id AS id, " +
            "    so.tranid AS tranid, " +
            "    so.trandate AS trandate, " +
            "    so.entity AS customerId, " +
            "    customer.entityid AS customerName, " +

            // "    -- Sales Order Line Fields " +
            "   BUILTIN.DF(sol.custcol_advs_selected_inventory_type) AS itemType, " +
            "    sol.item AS itemId, " +
            "    item.itemid AS itemName, " +
            "    item.displayname AS itemdesc, " +
            "    sol.quantity AS quantity, " +
            "    sol.rate AS rate, " +
            "   sol.CUSTCOL_ADVS_REPAIR_TASK_LINK AS JobId,  " +
            "   JOB.name AS jobName, " +
            "   JOB.custrecord_advs_st_r_t_compalin AS complain, " +
            "   JOB.custrecord_advs_st_r_t_cause AS cause, " +
            "   JOB.custrecord_advs_st_r_t_correction AS correction," +
            "   JOB.custrecord_repair_desc AS jobDesc," +
            "   BUILTIN.DF(JOB.custrecord_st_r_t_status) AS jobSatus " +

            "FROM " +
            "    transaction AS so " +

            // "-- Join to Sales Order Lines " +
            "INNER JOIN " +
            "    transactionLine AS sol " +
            "    ON sol.transaction = so.id " +

            // "-- Join to Customer Table to get customer details " +
            "LEFT JOIN " +
            "    customer " +
            "    ON so.entity = customer.id " +

            // "-- Join to Item Table to get item details " +
            "LEFT JOIN " +
            "    item " +
            "    ON sol.item = item.id " +

            // "-- Join to Job Table to get job details " +
            "LEFT JOIN " +
            "    customrecord_advs_task_record AS JOB " +
            "    ON sol.CUSTCOL_ADVS_REPAIR_TASK_LINK = JOB.id " +

            "WHERE " +
            "    so.type = 'SalesOrd' " +
            "    AND sol.mainline = 'F' " +
            "    AND so.id = '" + orderId + "' " +
            "    AND sol.taxline = 'F' " +
            "ORDER BY " +
            "    so.trandate DESC," +
            "    so.tranid; ";

          var resultSet = query.runSuiteQL({
            query: queryString
          });
          var results = resultSet.asMappedResults();

          var responseContent = results;

          log.emergency("responseContent", responseContent)

          scriptContext.response.write({
            output: JSON.stringify(responseContent)
          });
        } else if (searchOrderData_lines_job_clockin_details == 1) {

          var orderId = scriptContext.request.parameters.orderId;
          var jobid = scriptContext.request.parameters.jobid;

          if (jobid == "NoJob") {
            jobid = "@NONE@";
          }

          var clockInOutSearchByJob = search.create({
            type: "customrecord_advs_at_clock_in_out",
            filters: [
              ["isinactive", "is", "F"],
              "AND",
              ["custrecord_advs_cio_sales_order_link", "anyof", orderId],
              "AND",
              ["custrecord_advs_cio_task_link", "anyof", jobid]
            ],
            columns: [
              search.createColumn({
                name: "custrecord_advs_cio_technician_name_1",
                label: "Mechanic Name 1"
              }),
              search.createColumn({
                name: "custrecord_advs_cio_clockin_date",
                label: "Clock In Date"
              }),
              search.createColumn({
                name: "custrecord_advs_cio_clockin_time",
                label: "Clock In Time"
              }),
              search.createColumn({
                name: "custrecord_advs_cio_clockout_date",
                label: "Clock Out Date"
              }),
              search.createColumn({
                name: "custrecord_advs_cio_clockout_time",
                label: "Clock Out Time"
              }),
              search.createColumn({
                name: "custrecord_advs_cio_in_out_status",
                label: "In/Out Status"
              }),
              search.createColumn({
                name: "custrecord_advs_cio_comments",
                label: "Comments"
              })
            ]
          });
          var jData = new Array();
          clockInOutSearchByJob.run()
            .each(function (result) {
              jData.push(result)
              return true;
            });

          log.emergency("jData", jData)

          scriptContext.response.write({
            output: JSON.stringify(jData)
          });
        } else if (search_customer_text != "" && search_customer_text != null && search_customer_text != undefined && search_customer_text != "null" && search_customer_text != "undefined") {

          var vehicleSearchObj = search.create({
            type: "customer",
            filters: [
              ["isinactive", "is", "F"],
              "AND",
              [
                [
                  ["entityid", "contains", search_customer_text]
                ], "OR", [
                  ["companyname", "contains", search_customer_text]
                ], "OR", [
                  ["email", "contains", search_customer_text]
                ], "OR", [
                  ["phone", "contains", search_customer_text]
                ], "OR", [
                  ["firstname", "contains", search_customer_text]
                ]
              ]
            ],
            columns: [
              search.createColumn({
                name: "internalid",
                label: "Internal ID"
              }),
              search.createColumn({
                name: "altname",
                label: "Name"
              }),
              search.createColumn({
                name: "phone",
                label: "Serial #"
              }),
              search.createColumn({
                name: "email",
                label: "Unit #"
              }),
              search.createColumn({
                name: "custentity_advs_is_internal_order",
                label: "Unit #"
              }),
            ]
          });

          var jData = new Array();
          vehicleSearchObj.run()
            .each(function (result) {

              var vinNum = result.getValue({
                name: "altname"
              });
              var stockNo = result.getValue({
                name: "phone"
              });
              var internalid = result.getValue({
                name: "internalid"
              });
              var plateNo = result.getValue({
                name: "email"
              });
              var entityid = result.getValue({
                name: "internalid"
              });
              var internalcustomer = result.getValue({
                name: "custentity_advs_is_internal_order"
              });

              var dataChunk = new Object();

              dataChunk["altname"] = vinNum;
              dataChunk["plateNum"] = plateNo;
              dataChunk["internalid"] = internalid;
              dataChunk["stockNo"] = stockNo;
              dataChunk["entityid"] = entityid;
              dataChunk["internalcustomer"] = internalcustomer;

              jData.push(dataChunk);

              if (jData.length <= 500) {
                return true;
              } else {
                return false;
              }

            });

          log.emergency("jData", jData);

          scriptContext.response.write({
            output: JSON.stringify(jData)
          });

        } else if (vinId > 0) {

          var queryString = "";

          queryString += "SELECT  " +
            "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_VM.name) AS vinnumber,  " +
            "  BUILTIN_RESULT.TYPE_STRING(Customer.email) AS email,  " +
            "  BUILTIN_RESULT.TYPE_STRING(Customer.id) AS entityid,  " +
            "  BUILTIN_RESULT.TYPE_STRING(Customer.firstname) AS firstname,  " +
            "  BUILTIN_RESULT.TYPE_DATE(CUSTOMRECORD_ADVS_VM.custrecord_advs_vm_last_service_date) AS lastservicedate,  " +
            "  BUILTIN_RESULT.TYPE_STRING(Customer.middlename) AS middlename,  " +
            "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_BRANDS.name) AS makename,  " +
            "  BUILTIN_RESULT.TYPE_STRING(item.fullname) AS fullname,  " +
            "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_VM.custrecord_advs_vm_mileage) AS mileage,  " +
            "  BUILTIN_RESULT.TYPE_STRING(department.name) AS department,  " +
            //"  BUILTIN_RESULT.TYPE_STRING(CUSTOMLISTADVS_SUBGROUP_TYPE_LIST_2.name) AS subgrouptype,  " +
            "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_MODEL_YEAR.name) AS modelyear,  " +
            "  BUILTIN_RESULT.TYPE_STRING(CUSTOMLIST_ADVS_ST_TYPE_OF_MASTER.name) AS type,  " +
            "  BUILTIN_RESULT.TYPE_STRING(Customer.lastname) AS lastname,  " +
            "  BUILTIN_RESULT.TYPE_STRING(Customer.phone) AS phone,  " +

            "  BUILTIN_RESULT.TYPE_STRING(Customer.comments) AS comments,  " +
            "  BUILTIN_RESULT.TYPE_STRING(Customer.custentity_eb_high_alert_comments) AS highalert,  " +

            "  BUILTIN_RESULT.TYPE_STRING(Customer.companyname) AS companyname,  " +
            "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_VM.custrecord_advs_em_serial_number) AS platenum,  " +
            "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_VM.custrecord_advs_vm_engine_number) AS enginenumb,  " +
            "  BUILTIN_RESULT.TYPE_BOOLEAN(Customer.isperson) AS isperson " +
            "FROM  " +
            "  CUSTOMRECORD_ADVS_VM,  " +
            "  CUSTOMRECORD_ADVS_MODEL_GROUP_LIST,  " +
            "  Customer,  " +
            "  department,  " +
            "  CUSTOMLIST_ADVS_ST_TYPE_OF_MASTER,  " +
            "  item,  " +
            "  CUSTOMRECORD_ADVS_MODEL_YEAR,  " +
            "  CUSTOMRECORD_ADVS_BRANDS  " +
            //"  CUSTOMLISTADVS_SUBGROUP_TYPE_LIST_2 " +
            "WHERE  " +
            "  ((((((((CUSTOMRECORD_ADVS_VM.custrecord_advs_model_model_group = CUSTOMRECORD_ADVS_MODEL_GROUP_LIST.ID(+) AND CUSTOMRECORD_ADVS_VM.custrecord_advs_vm_customer_number = Customer.ID(+)) AND CUSTOMRECORD_ADVS_VM.custrecord_advs_vm_department = department.ID(+)) AND CUSTOMRECORD_ADVS_VM.custrecord_advs_vm_master_type = CUSTOMLIST_ADVS_ST_TYPE_OF_MASTER.ID(+)) AND CUSTOMRECORD_ADVS_VM.custrecord_advs_vm_model = item.ID(+)) AND CUSTOMRECORD_ADVS_VM.custrecord_advs_vm_model_year = CUSTOMRECORD_ADVS_MODEL_YEAR.ID(+)) AND CUSTOMRECORD_ADVS_VM.custrecord_advs_vm_vehicle_brand = CUSTOMRECORD_ADVS_BRANDS.ID(+)) " +
            "" +
            ")) " +
            "   AND CUSTOMRECORD_ADVS_VM.ID IN ('" + vinId + "') ";

          var resultSet = query.runSuiteQL({
            query: queryString
          });
          var results = resultSet.asMappedResults();

          var responseContent = results;
          var Seq = 1;

          // log.emergency("responseContent",responseContent);

          scriptContext.response.write({
            output: JSON.stringify(responseContent)
          });
        } else if (vinIdSerial > 0) {

          // var queryString     =   "";
          //
          // queryString +="SELECT  " +
          //     "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_SERIALIZED_ITEMS_VIN.custrecord_s_i_item) AS model,  " +
          //     "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_SERIALIZED_ITEMS_VIN.custrecord_s_i_serial) AS serial,  " +
          //     "  BUILTIN_RESULT.TYPE_STRING(item.fullname) AS fullname,  " +
          //     // "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_SERIALIZED_ITEMS_VIN.custrecord_s_i_description_1) AS desc1,  " +
          //     // "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_SERIALIZED_ITEMS_VIN.custrecord_s_i_description_2) AS desc2,  " +
          //     "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_VM.name) AS serialvin " +
          //     "FROM  " +
          //     "  CUSTOMRECORD_ADVS_SERIALIZED_ITEMS_VIN,  " +
          //     "  item,  " +
          //     "  CUSTOMRECORD_ADVS_VM " +
          //     "WHERE  " +
          //     "  ((CUSTOMRECORD_ADVS_SERIALIZED_ITEMS_VIN.custrecord_s_i_serial_model = item.ID(+) AND CUSTOMRECORD_ADVS_SERIALIZED_ITEMS_VIN.custrecord_s_i_serial_vin = CUSTOMRECORD_ADVS_VM.ID(+))) " +
          //     "   AND CUSTOMRECORD_ADVS_SERIALIZED_ITEMS_VIN.custrecord_s_i_vin IN ("+vinIdSerial+") ";
          //
          //
          // var resultSet = query.runSuiteQL({ query: queryString });
          // var results = resultSet.asMappedResults();
          //
          // var responseContent = results;
          // var Seq     =   1;
          //
          // // log.emergency("responseContent",responseContent);

          var responseContent = {};

          scriptContext.response.write({
            output: JSON.stringify(responseContent)
          });

        } else if (vinForHist > 0) {

          var queryString = "";

          queryString += "SELECT  " +
            "  BUILTIN_RESULT.TYPE_DATE(TRANSACTION.trandate) AS trandate,  " +
            "  BUILTIN_RESULT.TYPE_STRING(TRANSACTION.memo) AS memo,  " +
            "  BUILTIN_RESULT.TYPE_STRING(TRANSACTION.TYPE) AS TYPE, " +
            "  BUILTIN_RESULT.TYPE_STRING(TRANSACTION.status) AS statusstandard, " +
            "  BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_ST_WORK_ORDER_STATUS.name) AS status,  " +
            "  BUILTIN_RESULT.TYPE_STRING(TRANSACTION.tranid) AS tranid,  " +
            "  BUILTIN_RESULT.TYPE_STRING(employee.firstname) AS firstname,  " +
            "  BUILTIN_RESULT.TYPE_STRING(employee.middlename) AS middlename,  " +
            "  BUILTIN_RESULT.TYPE_STRING(employee.lastname) AS lastname, " +
            "  BUILTIN_RESULT.TYPE_STRING(TRANSACTION.id) AS id  " +
            "FROM  " +
            "  TRANSACTION,  " +
            "  CUSTOMRECORD_ADVS_ST_WORK_ORDER_STATUS,  " +
            "  employee " +
            "WHERE  " +
            "  ((TRANSACTION.custbody_advs_st_work_order_status = CUSTOMRECORD_ADVS_ST_WORK_ORDER_STATUS.ID(+) AND TRANSACTION.employee = employee.ID(+))) " +
            "   AND ((TRANSACTION.custbody_advs_st_service_equipment IN ('" + vinForHist + "') AND TRANSACTION.TYPE IN ('SalesOrd','Estimate') AND TRANSACTION.custbody_advs_module_name IN ('3'))) ";

          var resultSet = query.runSuiteQL({
            query: queryString
          });
          var results = resultSet.asMappedResults();

          var responseContent = results;
          var Seq = 1;

          // log.emergency("responseContent",responseContent);

          scriptContext.response.write({
            output: JSON.stringify(responseContent)
          });

        } else if (customerId > 0) {

          log.emergency("customerId", customerId);

          var queryString = "";

          queryString += "  SELECT " +
            "                    BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_VM.name) AS vinname, " +
            "                        BUILTIN_RESULT.TYPE_STRING(TRANSACTION.tranid) AS tranid, " +
            "                        BUILTIN_RESULT.TYPE_DATE(TRANSACTION.trandate) AS trandate, " +
            "                        BUILTIN_RESULT.TYPE_STRING(TRANSACTION.status) AS status, " +
            "                          BUILTIN_RESULT.TYPE_STRING(TRANSACTION.TYPE) AS type, " +
            "                        BUILTIN_RESULT.TYPE_STRING(TransactionStatus.name) AS name_1 " +
            "                    FROM " +
            "                    TRANSACTION, " +
            "                        CUSTOMRECORD_ADVS_VM, " +
            "                        TransactionStatus " +
            "                    WHERE " +
            "                    ((TRANSACTION.custbody_advs_st_service_equipment = CUSTOMRECORD_ADVS_VM.ID(+) AND (TRANSACTION.TYPE = TransactionStatus.trantype(+) AND TRANSACTION.status = TransactionStatus.ID(+) AND TRANSACTION.customtype = TransactionStatus.trancustomtype(+)))) " +
            "                    AND (((NOT( " +
            "                        TRANSACTION.status IN ('Estimate:C', 'Estimate:X', 'Estimate:B', 'Estimate:Y', 'Estimate:V', 'SalesOrd:G', 'SalesOrd:C', 'SalesOrd:H', 'SalesOrd:Y') " +
            "                ) OR TRANSACTION.status IS NULL) AND TRANSACTION.TYPE IN ('Estimate', 'SalesOrd') AND CUSTOMRECORD_ADVS_VM.custrecord_advs_vm_customer_number IN ('" + customerId + "') AND TRANSACTION.custbody_advs_module_name IN ('3')))";

          var resultSet = query.runSuiteQL({
            query: queryString
          });
          var results = resultSet.asMappedResults();

          var VinWiseArray = new Array();
          var VinWiseDataArray = new Array();

          for (var T = 0; T < results.length; T++) {

            var vinname = results[T].vinname;
            var trantype = results[T].type;

            if (VinWiseArray.indexOf(vinname) == -1) {
              VinWiseArray.push(vinname);

              VinWiseDataArray[vinname] = new Array();

              VinWiseDataArray[vinname]["O"] = 0;
              VinWiseDataArray[vinname]["E"] = 0;
            }

            if (trantype == "SalesOrd") {
              VinWiseDataArray[vinname]["O"] = VinWiseDataArray[vinname]["O"] * 1 + 1;
            } else {
              VinWiseDataArray[vinname]["E"] = VinWiseDataArray[vinname]["E"] * 1 + 1;
            }

          }

          var queryString = "";

          queryString += "SELECT " +
            "                    BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_VM.name) AS name, " +
            "                        BUILTIN_RESULT.TYPE_INTEGER(CUSTOMRECORD_ADVS_VM.ID) AS id, " +
            "                        BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_VM.custrecord_advs_em_serial_number) AS serial, " +
            "                        BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_VM.custrecord_advs_vm_engine_number) AS engine, " +
            "                        BUILTIN_RESULT.TYPE_STRING(CUSTOMRECORD_ADVS_VM.custrecord_advs_vm_engine_serial_number) AS engineserial " +

            "                    FROM " +
            "                    CUSTOMRECORD_ADVS_VM " +
            "                    WHERE " +
            "                    (CUSTOMRECORD_ADVS_VM.custrecord_advs_vm_customer_number IN ('" + customerId + "')) AND" +
            "                    (CUSTOMRECORD_ADVS_VM.IsInactive = 'F')" +
            "                    ";

          var resultSet = query.runSuiteQL({
            query: queryString
          });
          var results = resultSet.asMappedResults();

          var AllVehicleDataArray = new Array();

          for (V = 0; V < results.length; V++) {

            var name = results[V].name,
              id = results[V].id,
              serial = results[V].serial,
              engine = results[V].engine,
              engineserial = results[V].engineserial,

              order = 0,
              estimate = 0;

            if (VinWiseArray.indexOf(name) != -1) {
              order = VinWiseDataArray[name]["O"];
              estimate = VinWiseDataArray[name]["E"];
            }

            var dataObj = new Object();

            dataObj["name"] = name;
            dataObj["id"] = id;
            dataObj["engine"] = engine;
            dataObj["engineserial"] = engineserial;

            dataObj["serial"] = serial;

            dataObj["order"] = order;
            dataObj["estimate"] = estimate;

            AllVehicleDataArray.push(dataObj);

          }

          //log.emergency("AllVehicleDataArray", AllVehicleDataArray);

          scriptContext.response.write({
            output: JSON.stringify(AllVehicleDataArray)
          });

        } else if (item_text != "" && item_text != null && item_text != undefined && item_text != "null" && item_text != "undefined") {

          var item_type = scriptContext.request.parameters.item_type;

          var search_pattern = "cust : recent";
          var patternCustExist = item_text.search(search_pattern);
          var noOfitem = 4000;

          var searchTop_patter = "cust : top";
          var patternCustTopExist = item_text.search(searchTop_patter);

          if (patternCustExist != -1) {
            noOfitem = item_text.split(search_pattern)[1];
          }

          if (patternCustTopExist != -1) {
            noOfitem = item_text.split(searchTop_patter)[1];
          }

          if (item_type == undefined || item_type == null || item_type == "") {
            item_type = 2;
          }

          log.emergency("item_type", item_type);

          if (patternCustExist != -1) {

            var itemSearchObj = search.create({
              type: "item",
              filters: [
                ["custitem_advs_inventory_type", "anyof", item_type],
				"AND",
                ["isinactive", "is", "F"],
                "AND",
                ["transaction.type", "anyof", "CustInvc"],
                "AND",
                ["transaction.mainline", "is", "F"],
                "AND",
                ["transaction.name", "anyof", "4088"]
              ],
              columns: [
                search.createColumn({
                  name: "internalid",
                  label: "Internal ID"
                }),
                search.createColumn({
                  name: "itemid",
                  label: "Name"
                }),
                search.createColumn({
                  name: "salesdescription",
                  label: "Description"
                }),
                search.createColumn({
                  name: "baseprice",
                  label: "Base Price"
                }),
                search.createColumn({
                  name: "custitem_advs_at_goal_hours",
                  label: "Goal Hours"
                }),
                search.createColumn({
                  name: "custitem_advs_al_labor_flat_rate",
                  label: "Labor Rate"
                }),
                search.createColumn({
                  name: "custitem_advs_inventory_type",
                  label: "Inventory Type"
                }),
                search.createColumn({
                  name: "trandate",
                  join: "transaction",
                  label: "Date",
                  sort: "DESC"
                }),
                search.createColumn({
                  name: "displayname",
                  label: "Description"
                })
              ]
            });

          } else if (patternCustTopExist != -1) {

            var itemSearchObj = search.create({
              type: "item",
              filters: [
                ["custitem_advs_inventory_type", "anyof", item_type],
				"AND",
                ["isinactive", "is", "F"],
                "AND",
                ["transaction.type", "anyof", "CustInvc"],
                "AND",
                ["transaction.mainline", "is", "F"],
                "AND",
                ["transaction.name", "anyof", "4088"]
              ],
              columns: [
                search.createColumn({
                  name: "internalid",
                  summary: "GROUP",
                  label: "Internal ID"
                }),
                search.createColumn({
                  name: "itemid",
                  summary: "GROUP",
                  label: "Name"
                }),
                search.createColumn({
                  name: "salesdescription",
                  summary: "GROUP",
                  label: "Description"
                }),
                search.createColumn({
                  name: "baseprice",
                  summary: "GROUP",
                  label: "Base Price"
                }),
                search.createColumn({
                  name: "custitem_advs_at_goal_hours",
                  summary: "GROUP",
                  label: "Goal Hours"
                }),
                search.createColumn({
                  name: "custitem_advs_al_labor_flat_rate",
                  summary: "GROUP",
                  label: "Labor Rate"
                }),
                search.createColumn({
                  name: "custitem_advs_inventory_type",
                  summary: "GROUP",
                  label: "Inventory Type"
                }),
                search.createColumn({
                  name: "quantity",
                  join: "transaction",
                  summary: "SUM",
                  label: "Quantity",
                  sort: "DESC"
                }),
                search.createColumn({
                  name: "salesdescription",
                  summary: "GROUP",
                  label: "Description"
                })
              ]
            });

          } else {

            if (item_type == 2) {

              var itemSearchObj = search.create({
                type: "item",
                filters: [
                  [
                    [
                      [
                        ["description", "contains", item_text]
                      ], "OR",
                      [
                        ["custitem_advs_st_additio_desc", "contains", item_text]
                      ], "OR",
                      [
                        ["custitem_advs_part_number", "contains", item_text]
                      ], "OR",
                      [
                        ["itemid", "contains", item_text]
                      ], "OR",
                      [
                        ["displayname", "contains", item_text]
                      ], "OR",
                      [
                        ["vendorname", "contains", item_text]
                      ], "OR",
                      [
                        ["salesdescription", "contains", item_text]
                      ]
                    ]
                  ],
                  "AND",
                  ["custitem_advs_inventory_type", "anyof", item_type],
				  "AND",
                ["isinactive", "is", "F"],
                  "AND",
                  ["inventorylocation", "anyof", "5"]
                ],
                columns: [
                  search.createColumn({
                    name: "internalid",
                    label: "Internal ID"
                  }),
                  search.createColumn({
                    name: "itemid",
                    label: "Name"
                  }),
                  search.createColumn({
                    name: "displayname",
                    label: "Description"
                  }),
                  search.createColumn({
                    name: "baseprice",
                    label: "Base Price"
                  }),
                  search.createColumn({
                    name: "custitem_advs_at_goal_hours",
                    label: "Goal Hours"
                  }), search.createColumn({
                    name: "custitem_advs_al_labor_flat_rate",
                    label: "Labor Rate"
                  }),
                  search.createColumn({
                    name: "custitem_advs_inventory_type",
                    label: "Inventory Type"
                  }),
                  search.createColumn({
                    name: "inventorylocation",
                    label: "Inventory Location"
                  }),
                  search.createColumn({
                    name: "locationaveragecost",
                    label: "Location Average Cost"
                  }),
                  search.createColumn({
                    name: "averagecost",
                    label: "Average Cost"
                  }),
                  search.createColumn({
                    name: "locationquantitycommitted",
                    label: "Location Committed"
                  }),
                  search.createColumn({
                    name: "locationquantityonhand",
                    label: "Location On Hand"
                  }),
                  search.createColumn({
                    name: "custitem_advs_pa_core_charges",
                    label: "Core Charges"
                  })
                ]
              });
            } else {

              var itemSearchObj = search.create({
                type: "item",
                filters: [
                  [
                    [
                      [
                        ["description", "contains", item_text]
                      ], "OR",
                      [
                        ["custitem_advs_st_additio_desc", "contains", item_text]
                      ], "OR",
                      [
                        ["custitem_advs_part_number", "contains", item_text]
                      ], "OR",
                      [
                        ["itemid", "contains", item_text]
                      ], "OR",
                      [
                        ["displayname", "contains", item_text]
                      ], "OR",
                      [
                        ["vendorname", "contains", item_text]
                      ], "OR",
                      [
                        ["salesdescription", "contains", item_text]
                      ]
                    ]
                  ],
                  "AND",
                  ["custitem_advs_inventory_type", "anyof", item_type],
				  "AND",
                ["isinactive", "is", "F"],
                ],
                columns: [
                  search.createColumn({
                    name: "internalid",
                    label: "Internal ID"
                  }),
                  search.createColumn({
                    name: "itemid",
                    label: "Name"
                  }),
                  search.createColumn({
                    name: "displayname",
                    label: "Description"
                  }),
                  search.createColumn({
                    name: "baseprice",
                    label: "Base Price"
                  }),
                  search.createColumn({
                    name: "custitem_advs_at_goal_hours",
                    label: "Goal Hours"
                  }),
                  search.createColumn({
                    name: "custitem_advs_al_labor_flat_rate",
                    label: "Labor Rate"
                  }),
                  search.createColumn({
                    name: "custitem_advs_pa_core_charges",
                    label: "Core Charges"
                  })
                ]
              });

            }

          }

          var items = new Array();

          var countExist = 0;

          var itemUniqueArray = new Array();

          itemSearchObj.run()
            .each(function (result) {

              if (patternCustExist != -1) {

                if (itemUniqueArray.indexOf(result.id) == -1) {

                  itemUniqueArray.push(result.id);

                  items.push(
                    result.toJSON());
                  countExist++;
                }
              } else if (patternCustTopExist != -1) {
                items.push(
                  result.toJSON());
                countExist++;
              } else {
                items.push(
                  result.toJSON());
                countExist++;
              }

              if (countExist >= noOfitem) {
                return false;
              } else {
                return true;
              }

            });

          log.emergency("items", items);

          scriptContext.response.write({
            output: JSON.stringify(items)
          });

        } else if (itemIdAdd > 0) {

          var myCache = cache.getCache({
            name: 'serviCeDash_' + vinId + "_" + userId,
            scope: cache.Scope.PUBLIC
          });

          log.emergency("myCache", myCache);

          var ExistingItem = myCache.get({
            key: 'items',
            loader: function () {
              return null;
            }
          });

          log.emergency("ExistingItem", ExistingItem);

          var dontParse = 0;

          if (ExistingItem == null || ExistingItem == "null" || ExistingItem == "") {
            dontParse = 1;
          } else {
            dontParse = 0;
          }

          var dataObj = new Object();
          dataObj["id"] = itemIdAdd;
          dataObj["desc"] = scriptContext.request.parameters.itemDescAdd;
          dataObj["type"] = scriptContext.request.parameters.itemTypeAdd;
          dataObj["price"] = scriptContext.request.parameters.itemPriceAdd;
          dataObj["number"] = scriptContext.request.parameters.itemNumberAdd;

          if (ExistingItem != null && ExistingItem != "null") {
            if (dontParse == 0) {
              ExistingItem = JSON.parse(ExistingItem);
            }
            log.emergency("ExistingItem->", ExistingItem);
            ExistingItem.items.push(dataObj);

            count++;
          } else {

            ExistingItem = {
              items: [dataObj]
            };

          }

          myCache.put({
            key: "items",
            value: ExistingItem || "null"
          });

          log.emergency("ExistingItem", ExistingItem);

          scriptContext.response.write({
            output: JSON.stringify(ExistingItem)
          });

        } else if (itemIdDel > 0) {

          var myCache = cache.getCache({
            name: 'serviCeDash_' + vinId + "_" + userId,
            scope: cache.Scope.PUBLIC
          });

          log.emergency("myCache", myCache);

          var ExistingItem = myCache.get({
            key: 'items',
            loader: function () {
              return null;
            }
          });

          log.emergency("ExistingItem", ExistingItem);

          ExistingItem = JSON.parse(ExistingItem);

          ExistingItem.items = ExistingItem.items.filter(item => item.id !== itemIdDel);

          myCache.put({
            key: "items",
            value: ExistingItem || "null"
          });

          log.emergency("ExistingItem", ExistingItem);

          scriptContext.response.write({
            output: JSON.stringify(ExistingItem)
          });

        } else if (customerDetails > 1) {

          var customerSearchObj = search.create({
            type: "customer",
            filters: [
              ["internalid", "anyof", customerDetails]
            ],
            columns: [
              search.createColumn({
                name: "email",
                label: "Email"
              }),
              search.createColumn({
                name: "phone",
                label: "Phone"
              }),
              search.createColumn({
                name: "comments",
                label: "Comments"
              }),
              search.createColumn({
                name: "internalid",
                label: "Internal ID"
              }),
              search.createColumn({
                name: "isperson",
                label: "Is Individual"
              }),
              search.createColumn({
                name: "companyname",
                label: "Company Name"
              }),
              search.createColumn({
                name: "firstname",
                label: "First Name"
              }),
              search.createColumn({
                name: "middlename",
                label: "Middle Name"
              }),
              search.createColumn({
                name: "lastname",
                label: "Last Name"
              }),
              search.createColumn({
                name: "custentity_advs_is_internal_order",
                label: "Last Name"
              }),
              search.createColumn({
                name: "custentity_eb_high_alert_comments",
                label: "highalert"
              })
            ]
          });

          var jData = new Array();
          customerSearchObj.run()
            .each(function (result) {

              jData.push(result);
              log.emergency("result", result);

              return false;

            });

          scriptContext.response.write({
            output: JSON.stringify(jData)
          });

        } else if (vinhistory) {
          try {
            log.error('vinhistory', vinhistory);
            var transactionSearchObj = search.create({
              type: "transaction",
              settings: [{
                "name": "consolidationtype",
                "value": "ACCTTYPE"
              }],
              filters: [
                ["custbody_advs_st_service_equipment", "anyof", vinhistory],
                "AND",
                ["mainline", "is", "T"],
                "AND",
                ["taxline", "is", "F"],
                "AND",
                ["shipping", "is", "F"]
              ],
              columns: [
                "trandate",
                "tranid",
                "statusref",
                "amount"
              ]
            });
            var searchResultCount = transactionSearchObj.runPaged()
              .count;
            log.debug("transactionSearchObj result count", searchResultCount);
            var arr = [];
            transactionSearchObj.run()
              .each(function (result) {
                // .run().each has a limit of 4,000 results
                var obj = {};
                obj.doc = result.getValue({
                  name: 'tranid'
                });
                obj.statusref = result.getValue({
                  name: 'statusref'
                });
                obj.trandate = result.getValue({
                  name: 'trandate'
                });
                obj.amount = result.getValue({
                  name: 'amount'
                });
                arr.push(obj);
                return true;
              });
            scriptContext.response.write({
              output: JSON.stringify(arr)
            });

          } catch (e) {
            log.debug('error', e.toString());
          }
        } else if (action_type == "service_order_estimate") {

          var sointernalid = soid;

          data_details = JSON.parse(data_details);
          log.error('data_details', data_details);
          var _spJobsArr = data_details.spnewjobs;
          var vin = data_details.vin;
          var customer = data_details.customer;
          var serviceWriter = data_details.serviceWriter;
          var CreateDate = data_details.CreateDate;
          var poNumber = data_details.poNumber;
          var appointment = data_details.appointment;
          var completed = data_details.completed;
          var discountHead = data_details.discountHead;
          var taxHead = data_details.taxHead;
          var shopSupply = data_details.shopSupply;
          var remark = data_details.remark,
            department = data_details.department,
            mileageIn = data_details.mileageIn,
            location = data_details.location;

          var uniqueDocId = makeUniqueOrderCode();
          var jobstoupdate = [];
          if (sointernalid == '' || sointernalid == 0) {

            var recTaskObj = record.create({
              type: "customrecord_advs_st_repair_task_head",
              isDynamic: true
            });
            recTaskObj.setValue({
              fieldId: "custrecord_st_r_t_h_doc_num",
              value: uniqueDocId
            });

            var recmachJob = "recmachcustrecord_st_r_t_h_head_link";
            getJobsCreatedWithHeaderRecord(_spJobsArr, recTaskObj, recmachJob, uniqueDocId, vin, jobCodeDocId);
            var jobHeadId = recTaskObj.save({
              enableSourcing: true,
              ignoreMandatoryFields: true
            });

            //log.emergency('jobHeadId',jobHeadId);
            var searchPackLinkage = search.create({
              type: "customrecord_advs_task_record",
              filters: [
                ["custrecord_st_r_t_h_head_link", "anyof", jobHeadId]
              ],
              columns: [
                search.createColumn({
                  name: "internalid",
                  label: "Internal ID"
                }),
                search.createColumn({
                  name: "custrecord_st_r_t_h_job_unique_id",
                  label: "job unique Id"
                }),
                search.createColumn({
                  name: "custrecord_advs_technician",
                  label: "job unique Id"
                })
              ]
            });

            searchPackLinkage.run()
              .each(function (resultjob) {
                var obj = {};
                obj.jobcode = resultjob.getValue({
                  name: "custrecord_st_r_t_h_job_unique_id"
                });
                obj.internalid = resultjob.getValue({
                  name: "internalid"
                });
                obj.technician = resultjob.getValue({
                  name: "custrecord_advs_technician"
                });

                for (var ii = 0; ii < _spJobsArr.length; ii++) {
                  var jobLines = _spJobsArr[ii].lines;
                  for (var jj = 0; jj < jobLines.length; jj++) {
                    if (obj.jobcode == jobLines[jj].jobcode) {
                      jobLines[jj].jobid = obj.internalid;
                    }
                  }
                }
                if (obj.technician) {
                  var techchildObj = record.create({
                    type: 'customrecord_advs_mech_clock_in_child',
                    isDynamic: !0
                  });
                  techchildObj.setValue({
                    fieldId: 'custrecord_advs_m_c_repair_task',
                    value: obj.internalid,
                    ignoreFieldChange: true
                  });
                  techchildObj.setValue({
                    fieldId: 'custrecord_advs_m_c_mechanic',
                    value: obj.technician,
                    ignoreFieldChange: true
                  });
                  var _id = techchildObj.save();
                  log.emergency('_id', _id);
                }

                return true;
              });
          }

          log.emergency('sointernalid', sointernalid);

          if (sointernalid != 0) {
            getJobsUpdatedRecord(_spJobsArr, sointernalid, vin);
            var recObj = record.load({
              type: record.Type.SALES_ORDER,
              id: sointernalid,
              isDynamic: !0
            });
          } else {
            var recObj = record.create({
              type: "salesorder",
              isDynamic: true
            });
            recObj.setValue({
              fieldId: "customform",
              value: 141
            });
            recObj.setValue({
              fieldId: "custbody_advs_module_name",
              value: 3
            });
            recObj.setValue({
              fieldId: "custbody_advs_doc_no",
              value: uniqueDocId
            });
            recObj.setValue({
              fieldId: "entity",
              value: customer
            });
            recObj.setValue({
              fieldId: "custbody_advs_st_service_equipment",
              value: vin
            });
            recObj.setValue({
              fieldId: "location",
              value: location
            });
            recObj.setValue({
              fieldId: "department",
              value: department
            });
          }

          recObj.setValue({
            fieldId: "custbody_advs_st_odometer_in",
            value: mileageIn
          });
          recObj.setValue({
            fieldId: "salesrep",
            value: 4
          });
          recObj.setValue({
            fieldId: "custbody_advs_service_quote_memo",
            value: remark
          });
          recObj.setValue({
            fieldId: "otherrefnum",
            value: poNumber
          });
          recObj.setValue({
            fieldId: "custbody_advs_st_work_order_status",
            value: 1 // appointment
          });

          var itemscount = recObj.getLineCount({
            sublistId: 'item'
          });

          for (var i = 0; i < itemscount; i++) {
            recObj.removeLine({
              sublistId: 'item',
              line: 0,
              ignoreRecalc: true
            });
          }
          var _discountOrder = 0;
          for (var k = 0; k < _spJobsArr.length; k++) {
            var _jobName = _spJobsArr[k].jobName;
            var jobLines = _spJobsArr[k].lines;
            log.error('jobLines', jobLines);
            for (var L = 0; L < jobLines.length; L++) {
              if (jobLines[L].lineType == 9) {
                continue;
              }
              var lineType = jobLines[L].lineType,
                itemNumber = jobLines[L].item,
                lineQuan = jobLines[L].lineQuan,
                lineRate = jobLines[L].lineRate,
                lineAmount = jobLines[L].lineAmount,
                lineDisc = jobLines[L].lineDisc,
                lineTotal = jobLines[L].lineTotal,
                linetax = jobLines[L].linetax,
                technician = jobLines[L].technician,
                item_id = jobLines[L].itemid;
              var lineDiscount = 0;
              lineDiscount += (jobLines[L].lineDisc * 1);
              var jobIdLink = '';
              var jobCodeDocId = jobLines[L].jobcode;
              var jobIdLink = jobLines[L].jobid;

              recObj.selectNewLine({
                sublistId: "item"
              });

              recObj.setCurrentSublistValue({
                sublistId: "item",
                fieldId: "custcol_advs_selected_inventory_type",
                value: lineType
              });

              recObj.setCurrentSublistValue({
                sublistId: "item",
                fieldId: "custcol_advs_task_item",
                value: item_id
              });
              recObj.setCurrentSublistValue({
                sublistId: "item",
                fieldId: "item",
                value: item_id
              });


              recObj.setCurrentSublistValue({
                sublistId: "item",
                fieldId: "quantity",
                value: lineQuan
              });

              recObj.setCurrentSublistValue({
                sublistId: "item",
                fieldId: "rate",
                value: lineRate
              });
              if (lineType == 3) {
                var _obj_ = {};
                _obj_.jobid = jobIdLink;
                _obj_.jobCodeDocId = jobCodeDocId;
                jobstoupdate.push(_obj_);
                recObj.setCurrentSublistValue({
                  sublistId: "item",
                  fieldId: "custcol_advs_st_temp_task_id",
                  value: jobIdLink
                });
                recObj.setCurrentSublistValue({
                  sublistId: "item",
                  fieldId: "custcol_job_unique_code_id",
                  value: jobCodeDocId
                });


              }
              recObj.setCurrentSublistValue({
                sublistId: "item",
                fieldId: "custcol_advs_line_job_name",
                value: _jobName
              });
              recObj.commitLine({
                sublistId: "item"
              });



            }

          }
          if (lineDiscount > 0) {
            recObj.setValue({
              fieldId: 'discountitem',
              value: 15,
              ignoreFieldChange: true
            });
            recObj.setValue({
              fieldId: 'discountrate',
              value: lineDiscount,
              ignoreFieldChange: true
            });
          }



          var orderId = recObj.save({
            enableSourcing: true,
            ignoreMandatoryFields: true
          });

          log.error('_spJobsArr', _spJobsArr);
          for (var jk = 0; jk < _spJobsArr.length; jk++) {
            var jobLines = _spJobsArr[jk].lines;
            for (var jL = 0; jL < jobLines.length; jL++) {
              if (jobLines[jL].lineType == 3) {

                record.submitFields({
                  type: 'customrecord_advs_task_record',
                  id: jobLines[jL].jobid,
                  values: {
                    custrecord_advs_st_r_t_work_ord_link: orderId
                  },
                  options: {
                    enableSourcing: !1,
                    ignoreMandatoryFields: !0
                  }
                });
              }

            }
          }
          //UPDATE SO LINES WITH JOB ID 
          if (orderId) {
            var updateSoObj = record.load({
              type: record.Type.SALES_ORDER,
              id: orderId,
              isDynamic: !0
            });
            var counts = updateSoObj.getLineCount({
              sublistId: 'item'
            });
            for (var i = 0; i < counts; i++) {
              var itemtype = updateSoObj.getSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_advs_selected_inventory_type',
                line: i
              });
              if (itemtype == 3) {
                for (var jk = 0; jk < jobstoupdate.length; jk++) {
                  var jobcode = updateSoObj.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_job_unique_code_id',
                    line: i
                  });
                  log.emergency('jobstoupdate[jk].jobCodeDocId-->' + jobstoupdate[jk].jobCodeDocId, 'jobcode-->' + jobcode);
                  if (jobstoupdate[jk].jobCodeDocId == jobcode) {
                    //custcol_advs_repair_task_link
                    updateSoObj.selectLine({
                      sublistId: 'item',
                      line: i
                    });
                    updateSoObj.setCurrentSublistValue({
                      sublistId: 'item',
                      fieldId: 'custcol_advs_repair_task_link',
                      value: jobstoupdate[jk].jobid,
                      ignoreFieldChange: true
                    });
                    updateSoObj.commitLine({
                      sublistId: 'item'
                    });
                  }
                }

              }
            }
            updateSoObj.save({
              enableSourcing: true,
              ignoreMandatoryFields: true
            });
          }

          //UPDATE SO LINES WITH JOB ID 
          var docso = search.lookupFields({
            type: search.Type.SALES_ORDER,
            id: orderId,
            columns: ['tranid']
          });
          var jData = {
            internalid: orderId,
            type: 'salesorder',
            docunumer: docso.tranid
          }

          scriptContext.response.write({
            output: JSON.stringify(jData)
          });
          log.emergency("orderId", orderId);

        } else if (action_type == "fetch_location_department") {
          var customerId = scriptContext.request.parameters.customerId_loc_dep;
          log.emergency("customerId->", customerId);
          var customerData = search.lookupFields({
            type: "customer",
            id: customerId,
            columns: ["subsidiary"]
          });

          var dataToReturn = {};

          var customerSubsidiary = customerData.subsidiary[0].value;

          var locationSearchObj = search.create({
            type: "location",
            filters: [
              ["subsidiary", "anyof", customerSubsidiary],
              "AND",
              ["isinactive", "is", "F"]
            ],
            columns: [
              search.createColumn({
                name: "namenohierarchy",
                label: "Name (no hierarchy)"
              }),
              search.createColumn({
                name: "internalid",
                label: "Internal ID"
              })
            ]
          });

          var locationData = new Array();

          var dataToPush = new Object();
          dataToPush["id"] = "";
          dataToPush["name"] = "";
          locationData.push(dataToPush);

          locationSearchObj.run()
            .each(function (result) {

              var dataToPush = new Object();

              dataToPush["id"] = result.getValue({
                name: "internalid"
              });
              dataToPush["name"] = result.getValue({
                name: "namenohierarchy"
              });

              locationData.push(dataToPush);
              return true;
            });

          dataToReturn.location = locationData;

          var departmentSearchObj = search.create({
            type: "department",
            filters: [
              ["subsidiary", "anyof", customerSubsidiary],
              "AND",
              ["isinactive", "is", "F"]
            ],
            columns: [
              search.createColumn({
                name: "namenohierarchy",
                label: "Name (no hierarchy)"
              }),
              search.createColumn({
                name: "internalid",
                label: "Internal ID"
              })
            ]
          });

          var departmentData = new Array();

          var dataToPush = new Object();
          dataToPush["id"] = "";
          dataToPush["name"] = "";
          departmentData.push(dataToPush);

          departmentSearchObj.run()
            .each(function (result) {

              var dataToPush = new Object();

              dataToPush["id"] = result.getValue({
                name: "internalid"
              });
              dataToPush["name"] = result.getValue({
                name: "namenohierarchy"
              });

              departmentData.push(dataToPush);

              return true;
            });

          dataToReturn.department = departmentData;

          log.emergency("dataToReturn", dataToReturn);

          scriptContext.response.write({
            output: JSON.stringify(dataToReturn)
          });
        } else if (getTechnicians == 1) {
          var customrecord_advs_mechanicSearchObj = search.create({
            type: "customrecord_advs_mechanic",
            filters: [
              ["isinactive", "is", "F"]
            ],
            columns: [
              "internalid",
              "name"
            ]
          });
          var searchResultCount = customrecord_advs_mechanicSearchObj.runPaged()
            .count;
          log.debug("customrecord_advs_mechanicSearchObj result count", searchResultCount);
          var arr = [];
          customrecord_advs_mechanicSearchObj.run()
            .each(function (result) {
              // .run().each has a limit of 4,000 results
              var obj = {};
              obj.id = result.getValue({
                name: 'internalid'
              });
              obj.name = result.getValue({
                name: 'name'
              });
              arr.push(obj);
              return true;
            });
          log.debug('arr', arr);
          scriptContext.response.write({
            output: JSON.stringify(arr)
          });

        } else {

          var body = JSON.parse(scriptContext.request.body);
          var base64Files = body.files;

          var vinId = body.vinId;
          var userId = body.userId;

          var myCache = cache.getCache({
            name: 'serviCeDash_' + vinId + "_" + userId,
            scope: cache.Scope.PUBLIC
          });

          // log.emergency("myCache",myCache);

          var ExistingImages = myCache.get({
            key: 'images',
            loader: function () {
              return null;
            }
          });

          // log.emergency("ExistingImages before",ExistingImages);

          var dontParse = 0;

          if (ExistingImages == null || ExistingImages == "null" || ExistingImages == "") {
            dontParse = 1;
          } else {
            dontParse = 0;
          }

          var count = 0;
          base64Files.forEach(function (base64File, index) {
            var base64Content = base64File.split(';base64,')
              .pop();
            var fileName = 'uploaded_image_' + new Date()
              .getTime() + '.png'; // Adjust the file extension as needed

            // log.emergency("fileName",fileName);

            var newFile = file.create({
              name: fileName,
              fileType: file.Type.PNGIMAGE,
              contents: base64Content,
              encoding: file.Encoding.BASE_64
            });

            newFile.folder = 405159; // Use the internal ID of the folder where you want to save the files
            var fileId = newFile.save();

            var urlString = file.load({
                id: fileId
              })
              .url;

            var dataObj = new Object();
            dataObj["id"] = fileId;
            dataObj["url"] = urlString;

            if (ExistingImages != null && ExistingImages != "null") {
              if (count == 0 && dontParse == 0) {
                ExistingImages = JSON.parse(ExistingImages);
              }

              ExistingImages.items.push(dataObj);

              count++;
            } else {

              ExistingImages = {
                items: [dataObj]
              };

            }

            log.debug('File Uploaded', 'File ID: ' + fileId);
          }); 
          myCache.put({
            key: "images",
            value: ExistingImages || "null"
          });

        }

      } else {
        var getTechnicians = scriptContext.request.parameters.getTechnicians;
        if (getTechnicians == 1) {
          var customrecord_advs_mechanicSearchObj = search.create({
            type: "customrecord_advs_mechanic",
            filters: [
              ["isinactive", "is", "F"]
            ],
            columns: [
              "internalid",
              "name"
            ]
          });
          var searchResultCount = customrecord_advs_mechanicSearchObj.runPaged()
            .count;
          log.debug("customrecord_advs_mechanicSearchObj result count", searchResultCount);
          var arr = [];
          customrecord_advs_mechanicSearchObj.run()
            .each(function (result) {
              // .run().each has a limit of 4,000 results
              var obj = {};
              obj.id = result.getValue({
                name: 'internalid'
              });
              obj.name = result.getValue({
                name: 'name'
              });
              arr.push(obj);
              return true;
            });
          log.debug('arr', arr);
          scriptContext.response.write({
            output: JSON.stringify(arr)
          });

        }

      }

    }

    function makeUniqueOrderCode() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 60; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
    }

    function getJobsCreatedWithHeaderRecord(_spJobsArr, recTaskObj, recmachJob, uniqueDocId, vin, jobCode) {
      try {
        for (var i = 0; i < _spJobsArr.length; i++) {
          var jobName = _spJobsArr[i].jobName;
          var complain = _spJobsArr[i].complain || '';
          var cause = _spJobsArr[i].cause || '';
          var correction = _spJobsArr[i].correction || '';
          var jobLines = _spJobsArr[i].lines;
          for (var j = 0; j < jobLines.length; j++) {
			  log.emergency('jobLines[j].linegoalhrs getJobsCreatedWithHeaderRecord',jobLines[j].linegoalhrs);
            if (jobLines[j].lineType != 3) {
              continue;
            }
            recTaskObj.selectNewLine({
              sublistId: recmachJob
            });

            recTaskObj.setCurrentSublistValue({
              sublistId: recmachJob,
              fieldId: "custrecord_advs_st_r_t_compalin",
              value: complain
            });

            recTaskObj.setCurrentSublistValue({
              sublistId: recmachJob,
              fieldId: "custrecord_advs_st_r_t_cause",
              value: cause
            });

            recTaskObj.setCurrentSublistValue({
              sublistId: recmachJob,
              fieldId: "custrecord_advs_st_r_t_correction",
              value: correction
            });

            recTaskObj.setCurrentSublistValue({
              sublistId: recmachJob,
              fieldId: "name",
              value: jobName
            });

            recTaskObj.setCurrentSublistValue({
              sublistId: recmachJob,
              fieldId: "custrecord_repair_desc",
              value: jobLines[j].item
            });
            if (jobLines[j].technician) {
              recTaskObj.setCurrentSublistValue({
                sublistId: recmachJob,
                fieldId: "custrecord_advs_technician",
                value: jobLines[j].technician
              });
            }

             recTaskObj.setCurrentSublistValue({
              sublistId: recmachJob,
              fieldId: "custrecord_advs_at_r_t_labor_time_1",
              value: jobLines[j].linegoalhrs
            }); 

            recTaskObj.setCurrentSublistValue({
              sublistId: recmachJob,
              fieldId: "custrecord_ref_no",
              value: uniqueDocId
            });

            recTaskObj.setCurrentSublistValue({
              sublistId: recmachJob,
              fieldId: "custrecord_advs_repair_no",
              value: uniqueDocId
            });

            recTaskObj.setCurrentSublistValue({
              sublistId: recmachJob,
              fieldId: "custrecord_advs_st_r_t_equ_link",
              value: vin
            });
            var _jobCode = makeUniqueOrderCode();
            recTaskObj.setCurrentSublistValue({
              sublistId: recmachJob,
              fieldId: "custrecord_st_r_t_h_job_unique_id",
              value: _jobCode
            });
            jobLines[j].jobcode = _jobCode;
            recTaskObj.commitLine({
              sublistId: recmachJob
            });
          }
        }

      } catch (e) {
        log.error('error', e.toString());
      }
    }

    function getJobsUpdatedRecord(_spJobsArr, sointernalid, vin) {
      try {
        for (var i = 0; i < _spJobsArr.length; i++) {
          var jobName = _spJobsArr[i].jobName;
          var complain = _spJobsArr[i].complain || '';
          var cause = _spJobsArr[i].cause || '';
          var correction = _spJobsArr[i].correction || '';
          var jobLines = _spJobsArr[i].lines; 
          for (var j = 0; j < jobLines.length; j++) {
            if (jobLines[j].lineType != 3) {
              continue;
            }
            log.error('jobLines[j].jobid', jobLines[j].jobid);
            log.error('jobLines[j].linegoalhrs getJobsUpdatedRecord', jobLines[j].linegoalhrs);
            if (jobLines[j].jobid) {
              var taskid = jobLines[j].jobid;
              var recTaskObj = record.load({
                type: 'customrecord_advs_task_record',
                id: taskid,
                isDynamic: !0
              });
              recTaskObj.setValue({
                fieldId: "custrecord_advs_st_r_t_compalin",
                value: complain
              });
              recTaskObj.setValue({
                fieldId: "custrecord_advs_st_r_t_cause",
                value: cause
              });
              recTaskObj.setValue({
                fieldId: "custrecord_advs_st_r_t_correction",
                value: correction
              });
              recTaskObj.setValue({
                fieldId: "name",
                value: jobName
              });
              recTaskObj.setValue({
                fieldId: "custrecord_repair_desc",
                value: (jobLines[j].item)
              });
              recTaskObj.setValue({
                fieldId: "custrecord_advs_technician",
                value: (jobLines[j].technician)
              });
               recTaskObj.setValue({
                fieldId: "custrecord_advs_at_r_t_labor_time_1",
                value: (jobLines[j].linegoalhrs)
              }); 
              recTaskObj.setValue({
                fieldId: "custrecord_st_r_t_h_job_unique_id",
                value: (jobLines[j].jobcode)
              });
               
              var id = recTaskObj.save();
              createTechnicianlineonEdit(id, jobLines[j].technician, sointernalid)
            }
			else if (jobLines[j].item != '') {
              var solookup = search.lookupFields({
                type: 'salesorder',
                id: sointernalid,
                columns: ['custbody_advs_doc_no']
              });
              var recTaskObj = record.create({
                type: 'customrecord_advs_task_record',
                isDynamic: !0
              });
              recTaskObj.setValue({
                fieldId: "custrecord_advs_st_r_t_compalin",
                value: complain
              });
              recTaskObj.setValue({
                fieldId: "custrecord_advs_st_r_t_cause",
                value: cause
              });
              recTaskObj.setValue({
                fieldId: "custrecord_advs_st_r_t_correction",
                value: correction
              });
              recTaskObj.setValue({
                fieldId: "name",
                value: jobName
              });
              recTaskObj.setValue({
                fieldId: "custrecord_repair_desc",
                value: (jobLines[j].item)
              });
              recTaskObj.setValue({
                fieldId: "custrecord_advs_technician",
                value: (jobLines[j].technician)
              });
			  //COMMENTING TO TEST OVERRIDE ISSUE GOAL HOURS
               recTaskObj.setValue({
                fieldId: "custrecord_advs_at_r_t_labor_time_1",
                value: (jobLines[j].linegoalhrs)
              }); 
              recTaskObj.setValue({
                fieldId: "custrecord_advs_st_r_t_work_ord_link",
                value: sointernalid
              });
              var _jobCode = makeUniqueOrderCode();
              recTaskObj.setValue({
                fieldId: "custrecord_st_r_t_h_job_unique_id",
                value: _jobCode
              });
              recTaskObj.setValue({
                fieldId: "custrecord_advs_st_r_t_equ_link",
                value: vin
              });
              recTaskObj.setValue({
                fieldId: "custrecord_advs_repair_no",
                value: solookup.custbody_advs_doc_no
              });
              recTaskObj.setValue({
                fieldId: "custrecord_ref_no",
                value: solookup.custbody_advs_doc_no
              });
              jobLines[j].jobcode = _jobCode;
              var injobid = recTaskObj.save();
              jobLines[j].jobid = injobid;
            }

          }
        }

      } catch (e) {
        log.error('error', e.toString());
      }
    }

    function createTechnicianlineonEdit(jobid, technician, soid) {
      try {
        var count = searchfortechnicians(jobid, soid);
        if (count == 0) {
          var techchildObj = record.create({
            type: 'customrecord_advs_mech_clock_in_child',
            isDynamic: !0
          });
          techchildObj.setValue({
            fieldId: 'custrecord_advs_m_c_repair_task',
            value: jobid,
            ignoreFieldChange: true
          });
          techchildObj.setValue({
            fieldId: 'custrecord_advs_m_c_mechanic',
            value: technician,
            ignoreFieldChange: true
          });
          var _id = techchildObj.save();
        }



      } catch (e) {
        log.debug('err', e.toString());
      }
    }

    function searchfortechnicians(jobid, soid) {
      try {
        var customrecord_advs_mech_clock_in_childSearchObj = search.create({
          type: "customrecord_advs_mech_clock_in_child",
          filters: [
            ["internalid", "anyof", jobid],
            "AND",
            ["isinactive", "is", "F"],
            "AND",
            ["custrecord_advs_m_c_sales_order", "anyof", soid]
          ],
          columns: [
            "internalid"
          ]
        });
        var searchResultCount = customrecord_advs_mech_clock_in_childSearchObj.runPaged()
          .count;
         
        return searchResultCount;
      } catch (e) {
        log.debug('error', e.toString())
      }
    }
    return {
      onRequest,
      makeUniqueOrderCode: makeUniqueOrderCode
    }

  });
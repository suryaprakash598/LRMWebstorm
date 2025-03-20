/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/format'],
    /**
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (runtime, search, serverWidget, url, format) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            var request = scriptContext.request;
            var response = scriptContext.response;
            if (request.method == "GET") {
                var form = serverWidget.createForm({
                    title: "Title Dashboard"
                })

                var locationParam = request.parameters.location;
                var statusParam = request.parameters.status;

                // Add a location filter to the form header
                var locationField = form.addField({
                    id: 'custpage_location_filter',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Location',
                    source:"location"
                });
                if (locationParam) {
                    locationField.defaultValue = locationParam;
                }

                var statusField = form.addField({
                    id: 'custpage_status_filter',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Status',
                    source: "customlist_advs_reservation_status"
                });
                if (statusParam) {
                    statusField.defaultValue = statusParam;
                }

                var inlineHTML = form.addField({
                    id: "custpage_inlinehtml",
                    type: serverWidget.FieldType.INLINEHTML,
                    label: " "
                })
                inlineHTML.defaultValue = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">';
                addSublist(form, "custpage_subtab_title_dash", "Title Collection", false)
                addSublist(form, "custpage_subtab_missing_title", "Missing Title", false)
                addSublist(form, "custpage_subtab_title_intransfer", "Titles In Transfer", false)
                addSublist(form, "custpage_subtab_liened_activetitle", "Liened Active Titles", false)

                //Add filter
                var filters = [
                    ["isinactive", "is", "F"]
                ];

                if (statusParam) {
                    filters.push("AND");
                    filters.push(["custrecord_advs_td_vin_status", "anyof", statusParam]);
                }

                if (locationParam) {
                    filters.push("AND");
                    filters.push(["custrecord_advs_td_vin_location", "anyof", locationParam]);
                }

                var customrecord_advs_title_dashboardSearchObj = search.create({
                    type: "customrecord_advs_title_dashboard",
                    filters:filters,
                    columns:
                        [
                            search.createColumn({name: "internalid", label: "Internal ID"}),
                            search.createColumn({name: "custrecord_advs_td_catalog_number", label: "Catalog Number"}),
                            search.createColumn({name: "custrecord_advs_td_title_received", label: "Title Received"}),
                            search.createColumn({name: "custrecord_advs_td_active_transfer", label: "Active Transfer"}),
                            search.createColumn({name: "custrecord_advs_td_date_sent_to_agency", label: "Date Sent To Agency (For Transfer )"}),
                            search.createColumn({name: "custrecord_advs_td_state_restriction", label: "State Restriction"}),
                            search.createColumn({name: "custrecord_advs_td_lien", label: "Lien"}),
                            search.createColumn({name: "custrecord_advs_td_title_state", label: "Title State"}),
                            search.createColumn({name: "custrecord_advs_td_vin", label: "VIN"}),
                            search.createColumn({name: "custrecord_advs_td_active_asset", label: "Active Asset"}),
                            search.createColumn({name: "custrecord_advs_td_type_of_sale", label: "Type Of Sale"}),
                            search.createColumn({name: "custrecord_advs_date_title_sent", label: "Date Title Sent"}),
                            search.createColumn({name: "custrecord_advs_method_of_shipment", label: "Method Of Shipment"}),
                            search.createColumn({name: "custrecord_advs_td_notes", label: "Notes"}),
                            search.createColumn({name: "custrecord_advs_td_vin_status", label: "Status"})
                        ]
                });

                var searchResultCount = customrecord_advs_title_dashboardSearchObj.runPaged().count;

                var title_length_array = []
                var pageSize = 1000
                var pageIndex = 0

                do {
                    var resultSet = customrecord_advs_title_dashboardSearchObj.runPaged({
                        pageSize: pageSize,
                        pageIndex: pageIndex
                    });
                    var all_title_array = []
                    resultSet.pageRanges.forEach(function (pageRange) {

                        var currentPage = resultSet.fetch({index: pageRange.index})

                        currentPage.data.forEach(function (result) {
                            var title_object = {}
                            var titleId = result.getValue('internalid')
                            title_object.title_id = result.getValue('internalid')
                            title_object.custrecord_advs_td_catalog_number = result.getValue('custrecord_advs_td_catalog_number')
                            title_object.custrecord_advs_td_title_received = result.getValue('custrecord_advs_td_title_received')
                            title_object.custrecord_advs_td_active_transfer = result.getValue('custrecord_advs_td_active_transfer')
                            // log.debug( ' custrecord_advs_td_active_transfer ' , result.getValue('custrecord_advs_td_active_transfer'))
                            title_object.custrecord_advs_td_date_sent_to_agency = result.getValue('custrecord_advs_td_date_sent_to_agency')
                            title_object.custrecord_advs_td_state_restriction = result.getValue('custrecord_advs_td_state_restriction')
                            title_object.custrecord_advs_td_lien = result.getValue('custrecord_advs_td_lien')
                            title_object.custrecord_advs_td_title_state = result.getValue('custrecord_advs_td_title_state')
                            title_object.custrecord_advs_td_vin = result.getValue('custrecord_advs_td_vin')
                            title_object.custrecord_advs_td_active_asset = result.getValue('custrecord_advs_td_active_asset')
                            title_object.custrecord_advs_td_type_of_sale = result.getValue('custrecord_advs_td_type_of_sale')
                            title_object.custrecord_advs_date_title_sent = result.getValue('custrecord_advs_date_title_sent')
                            title_object.custrecord_advs_method_of_shipment = result.getValue('custrecord_advs_method_of_shipment')
                            title_object.custrecord_advs_td_notes = result.getValue('custrecord_advs_td_notes')
                            title_object.custrecord_advs_td_vin_status = result.getValue('custrecord_advs_td_vin_status')
                            //var editUrl = "<a href='javascript:void(0);' onclick='openPopup(\"https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1723&id=" + titleId + "&e=T\");'>" +
                            //var editUrl = "<a target='_self' href='https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1723&id="+titleId+"&e=T'><i class='fa fa-pencil-alt' style='font-size:24px' aria-hidden='true'></i>  </a>";
                            var editUrl = "<i class='fa fa-pencil-alt' style='font-size:24px' aria-hidden='true' onclick='window.open(\"https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2576&deploy=1&custparam_id=" + titleId + "&custparam_edit=T\", \"EditPopup\", \"width=800,height=600,resizable=yes\");'></i>";
                            title_object.url = editUrl
                            title_length_array.push(title_object)
                            all_title_array.push(titleId)
                        });
                    });
                    pageIndex++; // Move to the next page
                } while (pageIndex < resultSet.pageRanges.length)
                //all_title_array
                var notesData = getNotesData(all_title_array)

                log.debug(' Notes Data Array ' , notesData)

                var missed_active_transfer_array = title_length_array.filter(item => item.custrecord_advs_td_active_transfer != 1) //1 is no in transfer list
                var intransfer_active_transfer_array = title_length_array.filter(item => item.custrecord_advs_td_active_transfer != 1) //1 is no in transfer list
                var liened_active_transfer_array = title_length_array.filter(item => item.custrecord_advs_td_lien != 4 && item.custrecord_advs_td_active_asset == 1)

                var totalData = title_length_array.length
                var missedData = missed_active_transfer_array.length
                var transferData = intransfer_active_transfer_array.length
                var linedData = liened_active_transfer_array.length

                var tableHTML = `
                    <table border="1" style="width: 50%; border-collapse: collapse; margin: 20px 0; font-size: 12px; text-align: left;border-radius: 10px;overflow: hidden;border: 2px solid #ddd;">
                        <tr style="background-color: #4CAF50; font-size: 12px; font-weight: bold;">
                            <th style="padding: 4px;border: 1px solid #fff;background-color: #f2f2f2;color: #607998;"><b></b></th>
                            <th style="padding: 4px;border: 1px solid #fff;background-color: #f2f2f2;color: #607998;"><b>Count</b></th>
                        </tr>
                        <tr>
                            <td style="padding: 4px;border: 1px solid #fff;background-color: #f2f2f2;color: #607998;"><b>Total Titles</b></td>
                            <td style="padding: 4px;border: 1px solid #fff;background-color: #f2f2f2;color: #607998;"><b>${totalData}</b></td>
                        </tr>
                        <tr>
                            <td style="padding: 4px;border: 1px solid #fff;background-color: #f2f2f2;color: #607998;"><b>Missed Titles</b></td>
                            <td style="padding: 4px;border: 1px solid #fff;background-color: #f2f2f2;color: #607998;"><b>${missedData}</b></td>
                        </tr>
                        <tr>
                            <td style="padding: 4px;border: 1px solid #fff;background-color: #f2f2f2;color: #607998;"><b>Titles In Transfer</b></td>
                            <td style="padding: 4px;border: 1px solid #fff;background-color: #f2f2f2;color: #607998;"><b>${transferData}</b></td>
                        </tr>
                        <tr>
                            <td style="padding: 4px;border: 1px solid #fff;background-color: #f2f2f2;color: #607998;"><b>Liened Active Titles</b></td>
                            <td style="padding: 4px;border: 1px solid #fff;background-color: #f2f2f2;color: #607998;"><b>${linedData}</b></td>
                        </tr>
                    </table>
                `;

                var tableField = form.addField({
                    id: 'custpage_table',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Title Data'
                });
                tableField.defaultValue = tableHTML;

                  form.addButton({
                    id: 'custpage_download_missing_title',
                    label: 'Download Title',
                    functionName: 'downloadAllTitle',
                });

                form.addButton({
                    id: 'custpage_download_missing_title',
                    label: 'Download Missing Title',
                    functionName: 'downloadMissingTitle',
                });

                form.addButton({
                    id: 'custpage_download_transfer_title',
                    label: 'Download Transfer Title',
                    functionName: 'downloadTransferTitle',
                });

                form.addButton({
                    id: 'custpage_download_liend_title',
                    label: 'Download Liend Title',
                    functionName: 'downloadLiendTitle',
                });

                //ALL TITLE SUBLIST
                var title_Sublistid = "custpage_sublist_custpage_subtab_title_dash"
                var title_sublist = form.getSublist({id: title_Sublistid})

                //TITLE MISSED SUBLIST
                var title_miss_SublistId = "custpage_sublist_custpage_subtab_missing_title"
                var title_miss_sublist = form.getSublist({id: title_miss_SublistId})

                //TITLE IN TRANSFER SUBLIST
                var title_intransfer_SublistId = "custpage_sublist_custpage_subtab_title_intransfer"
                var title_intransfer_sublist = form.getSublist({id: title_intransfer_SublistId})

                //LIENED ACTIVE IN TRANSFER SUBLIST
                var title_liened_SublistId = "custpage_sublist_custpage_subtab_liened_activetitle"
                var title_liened_sublist = form.getSublist({id: title_liened_SublistId})

                var all_title_line = 0;
                var missed_title_line = 0;
                var intransfer_title_line = 0;
                var liened_title_line = 0;

                //ALL TITLE LIST
                for (var i = 0; i < title_length_array.length; i++) {
                    var deal_id = title_length_array[i];
                    var notesArrayTitle = new Array()

                    var filtered_notes_title = notesData.filter(item => item.parentlink == deal_id.title_id)
                    filtered_notes_title.forEach(item => {
                        notesArrayTitle.push(item.notes,item.datetime);
                    });

                    title_sublist.setSublistValue({id: "cust_title_id", line: all_title_line, value: deal_id.title_id || ""})
                    title_sublist.setSublistValue({id: "cust_title_cat_num", line: all_title_line, value: deal_id.custrecord_advs_td_catalog_number || ""})
                    var title_received = 'No'
                    if(deal_id.custrecord_advs_td_title_received){
                        title_received = 'Yes'
                    }
                    title_sublist.setSublistValue({id: "cust_title_received", line: all_title_line, value: title_received})
                    if(deal_id.custrecord_advs_td_active_transfer){
                        title_sublist.setSublistValue({id: "cust_title_active_transfer", line: all_title_line, value: deal_id.custrecord_advs_td_active_transfer|| ""})
                    }
                    if(deal_id.custrecord_advs_td_date_sent_to_agency){
                        title_sublist.setSublistValue({id: "cust_title_date_sent_to_agency", line: all_title_line, value: deal_id.custrecord_advs_td_date_sent_to_agency || ""})
                    }
                    if(deal_id.custrecord_advs_td_state_restriction){
                        title_sublist.setSublistValue({id: "cust_title_state_restriction", line: all_title_line, value: deal_id.custrecord_advs_td_state_restriction || ""})
                    }
                    if(deal_id.custrecord_advs_td_lien){
                        title_sublist.setSublistValue({id: "cust_title_lien", line: all_title_line, value: deal_id.custrecord_advs_td_lien || ""})
                    }
                    if(deal_id.custrecord_advs_td_title_state){
                        title_sublist.setSublistValue({id: "cust_title_state", line: all_title_line, value: deal_id.custrecord_advs_td_title_state})
                    }
                    title_sublist.setSublistValue({id: "cust_title_vin", line: all_title_line, value: deal_id.custrecord_advs_td_vin || ""})
                    if(deal_id.custrecord_advs_td_active_asset){
                        title_sublist.setSublistValue({id: "cust_title_active_asset", line: all_title_line, value: deal_id.custrecord_advs_td_active_asset})

                    }
                    // log.debug('deal_id.custrecord_advs_td_type_of_sale ' , deal_id.custrecord_advs_td_type_of_sale)
                    if(deal_id.custrecord_advs_td_type_of_sale){
                        title_sublist.setSublistValue({id: "cust_title_type_of_sale", line: all_title_line, value: deal_id.custrecord_advs_td_type_of_sale})
                    }
                    if(deal_id.custrecord_advs_date_title_sent){
                        title_sublist.setSublistValue({id: "cust_title_title_sent", line: all_title_line, value: deal_id.custrecord_advs_date_title_sent})
                    }
                    if(deal_id.custrecord_advs_method_of_shipment){
                        title_sublist.setSublistValue({id: "cust_title_ship_method", line: all_title_line, value: deal_id.custrecord_advs_method_of_shipment || ""})
                    }

                    title_sublist.setSublistValue({id: "cust_title_notes", line: all_title_line, value: notesArrayTitle})

                    if(deal_id.custrecord_advs_td_vin_status){
                        title_sublist.setSublistValue({id: "cust_title_status", line: all_title_line, value: deal_id.custrecord_advs_td_vin_status || ""})
                    }
                    title_sublist.setSublistValue({id: "cust_title_edit", line: all_title_line, value: deal_id.url || ""})

                    all_title_line++;
                }

                //MISSED TITLE LIST
                for (var i = 0; i < missed_active_transfer_array.length; i++) {
                    var deal_id = missed_active_transfer_array[i];
                    var notesArrayMissed = []
                    var filtered_notes = notesData.filter(item => item.parentlink == deal_id.title_id)
                    filtered_notes.forEach(item => {
                        notesArrayMissed.push(item.notes,item.datetime);
                    });
                    title_miss_sublist.setSublistValue({id: "cust_title_id_missed", line: missed_title_line, value: deal_id.title_id || ""})
                    title_miss_sublist.setSublistValue({id: "cust_title_cat_num_missed", line: missed_title_line, value: deal_id.custrecord_advs_td_catalog_number || ""})
                    var title_received = 'No'
                    if(deal_id.custrecord_advs_td_title_received){
                        title_received = 'Yes'
                    }
                    title_miss_sublist.setSublistValue({id: "cust_title_received_missed", line: missed_title_line, value: title_received})
                    if(deal_id.custrecord_advs_td_active_transfer){
                        title_miss_sublist.setSublistValue({id: "cust_title_active_transfer_missed", line: missed_title_line, value: deal_id.custrecord_advs_td_active_transfer})
                    }
                    if(deal_id.custrecord_advs_td_date_sent_to_agency){
                        title_miss_sublist.setSublistValue({id: "cust_title_date_sent_to_agency_missed", line: missed_title_line, value: deal_id.custrecord_advs_td_date_sent_to_agency || ""})
                    }
                    if(deal_id.custrecord_advs_td_state_restriction){
                        title_miss_sublist.setSublistValue({id: "cust_title_state_restriction_missed", line: missed_title_line, value: deal_id.custrecord_advs_td_state_restriction})
                    }
                    if(deal_id.custrecord_advs_td_lien){
                        title_miss_sublist.setSublistValue({id: "cust_title_lien_missed", line: missed_title_line, value: deal_id.custrecord_advs_td_lien || ""})
                    }
                    if(deal_id.custrecord_advs_td_title_state){
                        title_miss_sublist.setSublistValue({id: "cust_title_state_missed", line: missed_title_line, value: deal_id.custrecord_advs_td_title_state || ""})
                    }
                    if(deal_id.custrecord_advs_td_vin){
                        title_miss_sublist.setSublistValue({id: "cust_title_vin_missed", line: missed_title_line, value: deal_id.custrecord_advs_td_vin || ""})
                    }
                    if(deal_id.custrecord_advs_td_active_asset){
                        title_miss_sublist.setSublistValue({id: "cust_title_active_asset_missed", line: missed_title_line, value: deal_id.custrecord_advs_td_active_asset})
                    }
                    if(deal_id.custrecord_advs_td_type_of_sale){
                        title_miss_sublist.setSublistValue({id: "cust_title_type_of_sale_missed", line: missed_title_line, value: deal_id.custrecord_advs_td_type_of_sale || ""})
                    }
                    if(deal_id.custrecord_advs_date_title_sent){
                        title_miss_sublist.setSublistValue({id: "cust_title_title_sent_missed", line: missed_title_line, value: deal_id.custrecord_advs_date_title_sent})
                    }
                    if(deal_id.custrecord_advs_method_of_shipment){
                        title_miss_sublist.setSublistValue({id: "cust_title_ship_method_missed", line: missed_title_line, value: deal_id.custrecord_advs_method_of_shipment || ""})
                    }

                    title_miss_sublist.setSublistValue({id: "cust_title_notes_missed", line: missed_title_line, value: notesArrayMissed || ""})

                    if(deal_id.custrecord_advs_td_vin_status){
                        title_miss_sublist.setSublistValue({id: "cust_title_status_missed", line: missed_title_line, value: deal_id.custrecord_advs_td_vin_status || ""})
                    }
                    title_miss_sublist.setSublistValue({id: "cust_title_edit_missed", line: missed_title_line, value: deal_id.url || ""})
                    // title_miss_sublist.setSublistValue({id: "cust_missed_title_id", line: missed_title_line, value: missed_deal_id.title_id || ""})
                    missed_title_line++
                }

                //IN TRANSFER TITLE LIST
                for (var i = 0; i < intransfer_active_transfer_array.length; i++) {
                    var deal_id = intransfer_active_transfer_array[i]
                    var notesArrayTransfer = []
                    var filtered_notes = notesData.filter(item => item.parentlink == deal_id.title_id)
                    filtered_notes.forEach(item => {
                        notesArrayTransfer.push(item.notes,item.datetime);
                    });
                    title_intransfer_sublist.setSublistValue({id: "cust_title_id_transfer", line: intransfer_title_line, value: deal_id.title_id || ""})
                    title_intransfer_sublist.setSublistValue({id: "cust_title_cat_num_transfer", line: intransfer_title_line, value: deal_id.custrecord_advs_td_catalog_number || ""})
                    var title_received = 'No'
                    if(deal_id.custrecord_advs_td_title_received){
                        title_received = 'Yes'
                    }
                    title_intransfer_sublist.setSublistValue({id: "cust_title_received_transfer", line: intransfer_title_line, value: title_received})
                    if(deal_id.custrecord_advs_td_active_transfer){
                        title_intransfer_sublist.setSublistValue({id: "cust_title_active_transfer_transfer", line: intransfer_title_line, value: deal_id.custrecord_advs_td_active_transfer})
                    }
                    if(deal_id.custrecord_advs_td_date_sent_to_agency){
                        title_intransfer_sublist.setSublistValue({id: "cust_title_date_sent_to_agency_transfer", line: intransfer_title_line, value: deal_id.custrecord_advs_td_date_sent_to_agency || ""})
                    }
                    if(deal_id.custrecord_advs_td_state_restriction){
                        title_intransfer_sublist.setSublistValue({id: "cust_title_state_restriction_transfer", line: intransfer_title_line, value: deal_id.custrecord_advs_td_state_restriction})
                    }
                    if(deal_id.custrecord_advs_td_lien){
                        title_intransfer_sublist.setSublistValue({id: "cust_title_lien_transfer", line: intransfer_title_line, value: deal_id.custrecord_advs_td_lien || ""})
                    }
                    if(deal_id.custrecord_advs_td_title_state){
                        title_intransfer_sublist.setSublistValue({id: "cust_title_state_transfer", line: intransfer_title_line, value: deal_id.custrecord_advs_td_title_state || ""})
                    }
                    if(deal_id.custrecord_advs_td_vin){
                        title_intransfer_sublist.setSublistValue({id: "cust_title_vin_transfer", line: intransfer_title_line, value: deal_id.custrecord_advs_td_vin || ""})
                    }
                    if(deal_id.custrecord_advs_td_active_asset){
                        title_intransfer_sublist.setSublistValue({id: "cust_title_active_asset_transfer", line: intransfer_title_line, value: deal_id.custrecord_advs_td_active_asset})

                    }
                    if(deal_id.custrecord_advs_td_type_of_sale){
                        title_intransfer_sublist.setSublistValue({id: "cust_title_type_of_sale_transfer", line: intransfer_title_line, value: deal_id.custrecord_advs_td_type_of_sale || ""})
                    }
                    if(deal_id.custrecord_advs_date_title_sent){
                        title_intransfer_sublist.setSublistValue({id: "cust_title_title_sent_transfer", line: intransfer_title_line, value: deal_id.custrecord_advs_date_title_sent})
                    }
                    if(deal_id.custrecord_advs_method_of_shipment){
                        title_intransfer_sublist.setSublistValue({id: "cust_title_ship_method_transfer", line: intransfer_title_line, value: deal_id.custrecord_advs_method_of_shipment || ""})
                    }
                    title_intransfer_sublist.setSublistValue({id: "cust_title_notes_transfer", line: intransfer_title_line, value: notesArrayTransfer || ""})
                    if(deal_id.custrecord_advs_td_vin_status){
                        title_intransfer_sublist.setSublistValue({id: "cust_title_status_transfer", line: intransfer_title_line, value: deal_id.custrecord_advs_td_vin_status || ""})
                    }
                    title_intransfer_sublist.setSublistValue({id: "cust_title_edit_transfer", line: intransfer_title_line, value: deal_id.url || ""})
                    // title_intransfer_sublist.setSublistValue({id: "cust_intransfer_title_cat_num", line: intransfer_title_line, value: missed_deal_id.custrecord_advs_td_catalog_number || ""})
                    intransfer_title_line++
                }

                //LIENED ACTIVE TITLE LIST
                for (var i = 0; i < liened_active_transfer_array.length; i++) {
                    var deal_id = liened_active_transfer_array[i]
                    var notesArrayLiened = []
                    var filtered_notes = notesData.filter(item => item.parentlink == deal_id.title_id)
                    filtered_notes.forEach(item => {
                        notesArrayLiened.push(item.notes,item.datetime);
                    });
                    title_liened_sublist.setSublistValue({id: "cust_title_id_liened", line: liened_title_line, value: deal_id.title_id || ""})
                    title_liened_sublist.setSublistValue({id: "cust_title_cat_num_liened", line: liened_title_line, value: deal_id.custrecord_advs_td_catalog_number || ""})
                    var title_received = 'No'
                    if(deal_id.custrecord_advs_td_title_received){
                        title_received = 'Yes'
                    }
                    title_liened_sublist.setSublistValue({id: "cust_title_received_liened", line: liened_title_line, value: title_received})
                    if(deal_id.custrecord_advs_td_active_transfer){
                        title_liened_sublist.setSublistValue({id: "cust_title_active_transfer_liened", line: liened_title_line, value: deal_id.custrecord_advs_td_active_transfer})
                    }
                    if(deal_id.custrecord_advs_td_date_sent_to_agency){
                        title_liened_sublist.setSublistValue({id: "cust_title_date_sent_to_agency_liened", line: liened_title_line, value: deal_id.custrecord_advs_td_date_sent_to_agency || ""})
                    }
                    // log.debug( ' deal_id.custrecord_advs_td_state_restriction lien >>>' , deal_id.custrecord_advs_td_state_restriction)
                    if(deal_id.custrecord_advs_td_state_restriction){
                        title_liened_sublist.setSublistValue({id: "cust_title_state_restriction_liened", line: liened_title_line, value: deal_id.custrecord_advs_td_state_restriction})
                    }

                    if(deal_id.custrecord_advs_td_lien){
                        title_liened_sublist.setSublistValue({id: "cust_title_lien_liened", line: liened_title_line, value: deal_id.custrecord_advs_td_lien || ""})
                    }
                    if(deal_id.custrecord_advs_td_title_state){
                        title_liened_sublist.setSublistValue({id: "cust_title_state_liened", line: liened_title_line, value: deal_id.custrecord_advs_td_title_state || ""})
                    }
                    if(deal_id.custrecord_advs_td_vin) {
                        title_liened_sublist.setSublistValue({id: "cust_title_vin_liened", line: liened_title_line, value: deal_id.custrecord_advs_td_vin || ""})
                    }
                    if(deal_id.custrecord_advs_td_active_asset){
                        title_liened_sublist.setSublistValue({id: "cust_title_active_asset_liened", line: liened_title_line, value: deal_id.custrecord_advs_td_active_asset || ""})
                    }
                    if(deal_id.custrecord_advs_td_type_of_sale){
                        title_liened_sublist.setSublistValue({id: "cust_title_type_of_sale_liened", line: liened_title_line, value: deal_id.custrecord_advs_td_type_of_sale || ""})
                    }
                    if(deal_id.custrecord_advs_date_title_sent){
                        title_liened_sublist.setSublistValue({id: "cust_title_title_sent_liened", line: liened_title_line, value: deal_id.custrecord_advs_date_title_sent})
                    }
                    if(deal_id.custrecord_advs_method_of_shipment){
                        title_liened_sublist.setSublistValue({id: "cust_title_ship_method_liened", line: liened_title_line, value: deal_id.custrecord_advs_method_of_shipment || ""})
                    }
                    title_liened_sublist.setSublistValue({id: "cust_title_notes_liened", line: liened_title_line, value: notesArrayLiened || ""})

                    if(deal_id.custrecord_advs_td_vin_status){
                        title_liened_sublist.setSublistValue({id: "cust_title_status_liened", line: liened_title_line, value: deal_id.custrecord_advs_td_vin_status || ""})
                    }
                    title_liened_sublist.setSublistValue({id: "cust_title_edit_liened", line: liened_title_line, value: deal_id.url || ""})
                    // title_liened_sublist.setSublistValue({id: "cust_liened_title_cat_num", line: liened_title_line, value: missed_deal_id.custrecord_advs_td_catalog_number || ""})
                    liened_title_line++
                }

                form.clientScriptModulePath = "SuiteScripts/Dashboard Files/advs_cs_title_dashboard.js";

                response.writePage(form)
            }
        }

        function getNotesData(all_title_array){
            var notesDataArray = []
            var customrecord_advs_title_notesSearchObj = search.create({
                type: "customrecord_advs_title_notes",
                filters:
                    [
                        ["isinactive","is","F"],
                        "AND",
                        ["custrecord_advs_title_parent_link","anyof",all_title_array]
                    ],
                columns:
                    [
                        search.createColumn({name: "custrecord_advs_title_date_time", label: "Date & Time"}),
                        search.createColumn({name: "custrecord_advs_title_notes", label: "Notes"}),
                        search.createColumn({name: "custrecord_advs_title_parent_link", label: "Parent Link"}),
                        search.createColumn({name: "internalid", label: "Internal Id"}),
                    ]
            });
            var searchResultCount = customrecord_advs_title_notesSearchObj.runPaged().count;
            log.debug("customrecord_advs_title_notesSearchObj result count",searchResultCount);
            customrecord_advs_title_notesSearchObj.run().each(function(result){
                // .run().each has a limit of 4,000 results
                var notesObject = {}
                notesObject.internalid = result.getValue('internalid')
                notesObject.parentlink = result.getValue('custrecord_advs_title_parent_link')
                notesObject.notes = result.getValue('custrecord_advs_title_notes')
                notesObject.datetime = result.getValue('custrecord_advs_title_date_time')
                notesDataArray.push(notesObject)
                return true;
            });

            return notesDataArray
        }

        function openEditRecord(recordId){
            log.debug('openEditRecord '+recordId);
        }

        function addSublist(form, tabId, tabLabel, requiredTaskinfo) {

            form.addTab({id: tabId, label: tabLabel})

            var sublist = form.addSublist({
                id: "custpage_sublist_" + tabId,
                type: serverWidget.SublistType.LIST,
                label: " ",
                tab: tabId
            })

            addSublistFields(sublist,tabId, requiredTaskinfo)
        }

        function addSublistFields(sublist,tabId, requiredTaskinfo) {
            //ALL TITLE LIST
            if(tabId == 'custpage_subtab_title_dash'){

                var internalIdOject = sublist.addField({id: 'cust_title_id', type: serverWidget.FieldType.TEXT, label: 'Internal Id'})
                internalIdOject.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN})

                sublist.addField({id: 'cust_title_cat_num', type: serverWidget.FieldType.TEXT, label: 'Catalog Number'})
                var titleRecieved = sublist.addField({id: 'cust_title_received', type: serverWidget.FieldType.TEXT, label: 'Title Received'})
                titleRecieved.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var activeTransfer = sublist.addField({id: 'cust_title_active_transfer', type: serverWidget.FieldType.SELECT, label: 'Active Transfer', source:'customlist_advs_act_trn_list'})
                activeTransfer.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_date_sent_to_agency', type: serverWidget.FieldType.DATE, label: 'Date Sent to Agency'})
                var stateRestriction = sublist.addField({id: 'cust_title_state_restriction', type: serverWidget.FieldType.SELECT, label: 'State Restriction', source:'customlist_advs_title_restriction_list'})
                stateRestriction.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var lean = sublist.addField({id: 'cust_title_lien', type: serverWidget.FieldType.SELECT, label: 'Lien', source:'customlist_advs_title_lien'})
                lean.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var state = sublist.addField({id: 'cust_title_state', type: serverWidget.FieldType.SELECT, label: 'State',source:'state'})
                state.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var vin = sublist.addField({id: 'cust_title_vin', type: serverWidget.FieldType.SELECT, label: 'VIN', source: 'customrecord_advs_vm'})
                vin.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var activeAsset = sublist.addField({id: 'cust_title_active_asset', type: serverWidget.FieldType.SELECT, label: 'Active Asset',source:'customlist_advs_active_asset'})
                activeAsset.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var typesale = sublist.addField({id: 'cust_title_type_of_sale', type: serverWidget.FieldType.SELECT, label: 'Type Of Sale',source:'customlist_advs_type_of_sales_advs'})
                typesale.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_title_sent', type: serverWidget.FieldType.DATE, label: 'Title Sent Date'})
                var shipmethod = sublist.addField({id: 'cust_title_ship_method', type: serverWidget.FieldType.SELECT, label: 'Ship Method', source:'customlist_advs_method_of_shipment'})
                shipmethod.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_notes', type: serverWidget.FieldType.TEXT, label: 'Title Notes'})
                var vehicleStatus = sublist.addField({id: 'cust_title_status', type: serverWidget.FieldType.SELECT, label: 'Status', source:"customlist_advs_reservation_status"})
                vehicleStatus.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_edit', type: serverWidget.FieldType.TEXT, label: 'Edit'})

            }
            //MISSED TITLE LIST
            if(tabId == 'custpage_subtab_missing_title'){
                var internalIdOject = sublist.addField({id: 'cust_title_id_missed', type: serverWidget.FieldType.TEXT, label: 'Internal Id'})
                internalIdOject.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN})

                sublist.addField({id: 'cust_title_cat_num_missed', type: serverWidget.FieldType.TEXT, label: 'Catalog Number'})
                var titleRecieved = sublist.addField({id: 'cust_title_received_missed', type: serverWidget.FieldType.TEXT, label: 'Title Received'})
                titleRecieved.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var activeTransfer = sublist.addField({id: 'cust_title_active_transfer_missed', type: serverWidget.FieldType.SELECT, label: 'Active Transfer',source:'customlist_advs_act_trn_list'})
                activeTransfer.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_date_sent_to_agency_missed', type: serverWidget.FieldType.DATE, label: 'Date Sent to Agency'})
                var stateRestriction = sublist.addField({id: 'cust_title_state_restriction_missed', type: serverWidget.FieldType.SELECT, label: 'State Restriction',source:'customlist_advs_title_restriction_list'})
                stateRestriction.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var lean = sublist.addField({id: 'cust_title_lien_missed', type: serverWidget.FieldType.SELECT, label: 'Lien',source:'customlist_advs_title_lien'})
                lean.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var state = sublist.addField({id: 'cust_title_state_missed', type: serverWidget.FieldType.SELECT, label: 'State',source:'state'})
                state.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var vin = sublist.addField({id: 'cust_title_vin_missed', type: serverWidget.FieldType.SELECT, label: 'VIN', source: 'customrecord_advs_vm'})
                vin.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var activeAsset = sublist.addField({id: 'cust_title_active_asset_missed', type: serverWidget.FieldType.SELECT, label: 'Active Asset', source: 'customlist_advs_active_asset'})
                activeAsset.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var typesale = sublist.addField({id: 'cust_title_type_of_sale_missed', type: serverWidget.FieldType.SELECT, label: 'Type Of Sale',source: 'customlist_advs_type_of_sales_advs'})
                typesale.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_title_sent_missed', type: serverWidget.FieldType.DATE, label: 'Title Sent Date'})

                var shipmethod = sublist.addField({id: 'cust_title_ship_method_missed', type: serverWidget.FieldType.SELECT, label: 'Ship Method',source: 'customlist_advs_method_of_shipment'})
                shipmethod.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_notes_missed', type: serverWidget.FieldType.TEXT, label: 'Title Notes'})
                var vehicleStatus = sublist.addField({id: 'cust_title_status_missed', type: serverWidget.FieldType.SELECT, label: 'Status', source:"customlist_advs_reservation_status"})
                vehicleStatus.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_edit_missed', type: serverWidget.FieldType.TEXT, label: 'Edit'})
            }
            // //IN TRANSFER TITLE LIST
            if(tabId == 'custpage_subtab_title_intransfer'){
                var internalIdOject = sublist.addField({id: 'cust_title_id_transfer', type: serverWidget.FieldType.TEXT, label: 'Internal Id'})
                internalIdOject.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN})

                sublist.addField({id: 'cust_title_cat_num_transfer', type: serverWidget.FieldType.TEXT, label: 'Catalog Number'})
                var titleRecieved = sublist.addField({id: 'cust_title_received_transfer', type: serverWidget.FieldType.TEXT, label: 'Title Received'})
                titleRecieved.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var activeTransfer = sublist.addField({id: 'cust_title_active_transfer_transfer', type: serverWidget.FieldType.SELECT, label: 'Active Transfer',source: 'customlist_advs_act_trn_list'})
                activeTransfer.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_date_sent_to_agency_transfer', type: serverWidget.FieldType.DATE, label: 'Date Sent to Agency'})
                var stateRestriction = sublist.addField({id: 'cust_title_state_restriction_transfer', type: serverWidget.FieldType.SELECT, label: 'State Restriction',source: 'customlist_advs_title_restriction_list'})
                stateRestriction.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var lean = sublist.addField({id: 'cust_title_lien_transfer', type: serverWidget.FieldType.SELECT, label: 'Lien',source: 'customlist_advs_title_lien'})
                lean.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var state = sublist.addField({id: 'cust_title_state_transfer', type: serverWidget.FieldType.SELECT, label: 'State',source: 'state'})
                state.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var vin = sublist.addField({id: 'cust_title_vin_transfer', type: serverWidget.FieldType.SELECT, label: 'VIN', source: 'customrecord_advs_vm'})
                vin.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var activeAsset = sublist.addField({id: 'cust_title_active_asset_transfer', type: serverWidget.FieldType.SELECT, label: 'Active Asset',source: 'customlist_advs_active_asset'})
                activeAsset.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var typesale = sublist.addField({id: 'cust_title_type_of_sale_transfer', type: serverWidget.FieldType.SELECT, label: 'Type Of Sale',source: 'customlist_advs_type_of_sales_advs'})
                typesale.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_title_sent_transfer', type: serverWidget.FieldType.DATE, label: 'Title Sent Date'})
                var shipmethod = sublist.addField({id: 'cust_title_ship_method_transfer', type: serverWidget.FieldType.SELECT, label: 'Ship Method',source: 'customlist_advs_method_of_shipment'})
                shipmethod.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_notes_transfer', type: serverWidget.FieldType.TEXT, label: 'Title Notes'})
                var vehicleStatus = sublist.addField({id: 'cust_title_status_transfer', type: serverWidget.FieldType.SELECT, label: 'Status', source:"customlist_advs_reservation_status"})
                vehicleStatus.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_edit_transfer', type: serverWidget.FieldType.TEXT, label: 'Edit'})
            }
            // //LIENED TITLE LIST
            if(tabId == 'custpage_subtab_liened_activetitle'){
                var internalIdOject  = sublist.addField({id: 'cust_title_id_liened', type: serverWidget.FieldType.TEXT, label: 'Internal Id'})
                internalIdOject.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN})

                sublist.addField({id: 'cust_title_cat_num_liened', type: serverWidget.FieldType.TEXT, label: 'Catalog Number'})
                var titleRecieved = sublist.addField({id: 'cust_title_received_liened', type: serverWidget.FieldType.TEXT, label: 'Title Received'})
                titleRecieved.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var activeTransfer = sublist.addField({id: 'cust_title_active_transfer_liened', type: serverWidget.FieldType.SELECT, label: 'Active Transfer',source: 'customlist_advs_act_trn_list'})
                activeTransfer.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_date_sent_to_agency_liened', type: serverWidget.FieldType.DATE, label: 'Date Sent to Agency'})
                var stateRestriction = sublist.addField({id: 'cust_title_state_restriction_liened', type: serverWidget.FieldType.SELECT, label: 'State Restriction',source: 'customlist_advs_title_restriction_list'})
                stateRestriction.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var lean = sublist.addField({id: 'cust_title_lien_liened', type: serverWidget.FieldType.SELECT, label: 'Lien',source: 'customlist_advs_title_lien'})
                lean.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var state = sublist.addField({id: 'cust_title_state_liened', type: serverWidget.FieldType.SELECT, label: 'State',source: 'state'})
                state.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var vin = sublist.addField({id: 'cust_title_vin_liened', type: serverWidget.FieldType.SELECT, label: 'VIN', source: 'customrecord_advs_vm'})
                vin.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var activeAsset = sublist.addField({id: 'cust_title_active_asset_liened', type: serverWidget.FieldType.SELECT, label: 'Active Asset',source: 'customlist_advs_active_asset'})
                activeAsset.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                var typesale = sublist.addField({id: 'cust_title_type_of_sale_liened', type: serverWidget.FieldType.SELECT, label: 'Type Of Sale',source: 'customlist_advs_type_of_sales_advs'})
                typesale.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_title_sent_liened', type: serverWidget.FieldType.DATE, label: 'Title Sent Date'})
                var shipmethod = sublist.addField({id: 'cust_title_ship_method_liened', type: serverWidget.FieldType.SELECT, label: 'Ship Method',source: 'customlist_advs_method_of_shipment'})
                shipmethod.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_notes_missed', type: serverWidget.FieldType.TEXT, label: 'Title Notes'})
                var vehicleStatus = sublist.addField({id: 'cust_title_status_liened', type: serverWidget.FieldType.SELECT, label: 'Status', source:"customlist_advs_reservation_status"})
                vehicleStatus.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})
                sublist.addField({id: 'cust_title_edit_liened', type: serverWidget.FieldType.TEXT, label: 'Edit'})
                // sublist.addField({id: 'cust_liened_title_id', type: serverWidget.FieldType.TEXT, label: 'Internal Id'})
                // sublist.addField({id: 'cust_liened_title_cat_num', type: serverWidget.FieldType.TEXT, label: 'Catalog Number'})
            }
        }

        return {
            onRequest
        }
    });
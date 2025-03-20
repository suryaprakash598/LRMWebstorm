/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/format', 'N/file'],
    /**
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (runtime, search, serverWidget, url, format, file) => {
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
                var downloadType = request.parameters.custparam_id;
                var statusParam = request.parameters.status;
                var locationParam = request.parameters.location;

                log.debug( ' downloadType ' , downloadType)
                var form = serverWidget.createForm({title: " Download Title Dashboard"})

                var filters = [
                    ["isinactive", "is", "F"]
                ];

                if(downloadType == 1 || downloadType == 2){
                    //ACTIVE TRANFER IS NOT "NO"
                    filters.push("AND");
                    filters.push(["custrecord_advs_td_active_transfer", "noneof", "1"]);
                }

                if(downloadType == 3){
                    //ACTIVE TRANFER IS NOT "NO"
                    filters.push("AND");
                    filters.push(["custrecord_advs_td_lien", "noneof", "4"]);
                    filters.push("AND");
                    filters.push(["custrecord_advs_td_active_asset", "anyof", "1"]);
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

                //Run once and store notes value START

                do {
                    var resultSet = customrecord_advs_title_dashboardSearchObj.runPaged({
                        pageSize: pageSize,
                        pageIndex: pageIndex
                    });
                    var all_title_array = []
                    resultSet.pageRanges.forEach(function (pageRange) {

                        var currentPage = resultSet.fetch({index: pageRange.index})
                        currentPage.data.forEach(function (result) {
                            var titleId = result.getValue('internalid')
                            all_title_array.push(titleId)
                        });
                    });
                    pageIndex++; // Move to the next page
                } while (pageIndex < resultSet.pageRanges.length)

                var notesData = getNotesData(all_title_array)

                //Run once and store notes value END

                var csvContent = "Catalog Number, Title Received, Active Transfer, Date Sent To Agency, State Restriction, Lien, Title State, VIN, Active Asset, Type Of Sale, Date Title Sent, Method Of Shipment, VIN Status, Notes\n"; // CSV headers

                do {
                    var resultSet = customrecord_advs_title_dashboardSearchObj.runPaged({
                        pageSize: pageSize,
                        pageIndex: pageIndex
                    });
                    resultSet.pageRanges.forEach(function (pageRange) {
                        var currentPage = resultSet.fetch({index: pageRange.index})
                        currentPage.data.forEach(function (result) {

                            var notesArrayTitle = new Array()
                            var titleId = result.getValue('internalid')

                            var filtered_notes_title = notesData.filter(item => item.parentlink == titleId)
                            filtered_notes_title.forEach(item => {
                                var combinedString = item.notes + ' ' + item.datetime;
                                notesArrayTitle.push(combinedString);
                            });

                            var catalogNumber = result.getValue('custrecord_advs_td_catalog_number');
                            var titleReceived = result.getValue('custrecord_advs_td_title_received');
                            var activeTransfer = result.getText('custrecord_advs_td_active_transfer');
                            var dateSentToAgency = result.getValue('custrecord_advs_td_date_sent_to_agency');
                            var stateRestriction = result.getText('custrecord_advs_td_state_restriction');
                            var lien = result.getText('custrecord_advs_td_lien');
                            var titleState = result.getText('custrecord_advs_td_title_state');
                            var vin = result.getText('custrecord_advs_td_vin');
                            var activeAsset = result.getText('custrecord_advs_td_active_asset');
                            var typeOfSale = result.getText('custrecord_advs_td_type_of_sale');
                            var dateTitleSent = result.getValue('custrecord_advs_date_title_sent');
                            var methodOfShipment = result.getText('custrecord_advs_method_of_shipment');
                            var notes = result.getValue('custrecord_advs_td_notes');
                            var vinStatus = result.getText('custrecord_advs_td_vin_status');
                            csvContent += ` ${catalogNumber}, ${titleReceived}, ${activeTransfer}, ${dateSentToAgency}, ${stateRestriction}, ${lien}, ${titleState}, ${vin}, ${activeAsset}, ${typeOfSale}, ${dateTitleSent}, ${methodOfShipment}, ${vinStatus}, ${notesArrayTitle}\n`;

                        });
                    });
                    pageIndex++; // Move to the next page
                } while (pageIndex < resultSet.pageRanges.length)

                var base64EncodedCSV = encodeURIComponent(csvContent);
                var dataUrl = "data:text/csv;charset=utf-8," + base64EncodedCSV;

                var html = `
                    <html>
                        <head>
                            <script type="text/javascript">
                                window.onload = function() {
                                    var downloadLink = document.getElementById("downloadLink");
                                    downloadLink.click();
                                    window.close();
                                }
                            </script>
                        </head>
                        <body>
                            <a id="downloadLink" href="${dataUrl}" download="Title_Dashboard_Data.csv" style="display:none;"></a>
                            <h3>Your CSV file will download automatically.</h3>
                        </body>
                    </html>
                `;

                response.write(html);
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



        return {
            onRequest
        }
    });
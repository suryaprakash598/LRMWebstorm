/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/file', 'N/record', 'N/redirect', 'N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url'],
    /**
 * @param{file} file
 * @param{record} record
 * @param{redirect} redirect
 * @param{runtime} runtime
 * @param{search} search
 * @param{serverWidget} serverWidget
 * @param{url} url
 */
    (file, record, redirect, runtime, search, ui, url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                var form = ui.createForm({
                    title: 'Summary Dashboard'
                });  
                var htmlContent = getHtmlContent();
                form.addField({
                    id: 'custpage_htmlcontent',
                    type: ui.FieldType.INLINEHTML,
                    label: 'HTML Content'
                }).defaultValue = htmlContent;
                scriptContext.response.writePage(form);
            }
        };
        function getHtmlContent(){
            var locationData = [];
            var bucketData = [];
            var statusData = [];

            //  location data
            var locationSearchObj = search.create({
                type: "location",
                filters: [
                ["isinactive", "is", "F"],
                "AND",
                ["custrecordadvs_loc_notallow_summary_dash", "is", "F"]
                ],
                columns: [
                    search.createColumn({name: "name", label: "Name"}),
                    search.createColumn({name: "internalid", label: "Internal ID"})
                ]
            });
            locationSearchObj.run().each(function(result){
                locationData.push({
                    id: result.getValue("internalid"),
                    name: result.getValue("name")
                });
                return true;
            });
            // bucket data
            var bucketSearchObj = search.create({
                type: "customrecord_ez_bucket_calculation",
                filters: [["isinactive", "is", "F"]],
                columns: [
                    search.createColumn({name: "name", label: "Name"}),
                    search.createColumn({name: "internalid", label: "Internal ID"})
                ]
            });
            bucketSearchObj.run().each(function(result){
                bucketData.push({
                    id: result.getValue("internalid"),
                    name: result.getValue("name")
                });
                return true;
            });
            //  status data
            var internalIds = ["23", "21", "20", "19", "22"];
            var statusSearchObj = search.create({
                type: "customlist_advs_reservation_status",
                filters: [ ["isinactive", "is", "F"],
                "AND",
                ["internalid","anyof",internalIds]
              ],
                columns: [
                    search.createColumn({name: "name", label: "Name"}),
                    search.createColumn({name: "internalId", label: "Internal ID"})
                ]
            });
            statusSearchObj.run().each(function(result){
                statusData.push({
                    id: result.getValue("internalId"),
                    name: result.getValue("name")
                });
                return true;
            });
            // from vm  location, status, and bucket
            var vehicleCount = {};
            //withoutlocation
            var vehcountobj = {};
            var vehicleSearchObj = search.create({
                type: "customrecord_advs_vm",
                filters: [["isinactive", "is", "F"]],
                columns: [
                    search.createColumn({name: "custrecord_advs_vm_location_code", label: "Location"}),
                    search.createColumn({name: "custrecord_advs_vm_reservation_status", label: "Truck Internal Status"}),
                    search.createColumn({name: "custrecord_vehicle_master_bucket", label: "Bucket Calculation"})
                ]
            });
            vehicleSearchObj.run().each(function(result){
                var location = result.getValue("custrecord_advs_vm_location_code");
                var status = result.getValue("custrecord_advs_vm_reservation_status");
                var bucket = result.getValue("custrecord_vehicle_master_bucket");
                if (!vehicleCount[location]) {
                    vehicleCount[location] = {};
                }
                if (!vehicleCount[location][status]) {
                    vehicleCount[location][status] = {};
                }
                if (!vehicleCount[location][status][bucket]) {
                    vehicleCount[location][status][bucket] = 0;
                }
                vehicleCount[location][status][bucket] += 1;
                return true;
            });
            vehicleSearchObj.run().each(function(result){
                var location = result.getValue("custrecord_advs_vm_location_code");
                var status = result.getValue("custrecord_advs_vm_reservation_status");
                var bucket = result.getValue("custrecord_vehicle_master_bucket");
                if (!vehcountobj[status]) {
                    vehcountobj[status] = {};
                }
                if (!vehcountobj[status][bucket]) {
                    vehcountobj[status][bucket] = 0;
                }
                vehcountobj[status][bucket] += 1;
                return true;
            });
               
            // Generate HTML content
            var htmlContent = "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>Lease Account Statement</title>\n" +
                "    <style>\n" +
                "        body { font-family: Arial, sans-serif; margin-top:10px; }\n" +
                "        .container { display: flex; width: 100%; }\n" +
                "        .left, .right { padding: 10px; }\n" +
                "        .left { flex: 50%; }\n" +
                "        .right { flex: 50%; }\n" +
                "        table { height: 50%; width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 12px; }\n" +
                "        td { padding: 5px; text-align:center; }\n" +
                "        th { padding: 2px; text-align: center; background-color: #f4b400; color: black; }\n" +
                "        .total-row { font-weight: bold; }\n" +
                "        .table-container { margin-bottom: 10px; }\n" +
                "        #piechart{flex: 50%;}\n"+
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "<div class=\"container\">\n" +
                "<div class=\"left\">\n";
               
                    htmlContent+=  " <div class=\"table-container\">\n" +
                "            <!-- <div class=\"section-title\"></div> -->\n" +
                "            <table>\n" +
                "                <thead>\n" +
                "                    <tr>\n" +
                "                        <th style=\"width:10%;text-align:left;\">Total</th>\n" ;
                bucketData.forEach(function(buck){
                    htmlContent+= "<th style=\"width:5%\">"+buck.name+"</th>\n" ;
                })
                htmlContent+="<th style=\"width:5%\">Total</th>\n" +
                "                    </tr>\n" +
                "                </thead>\n" +
                "                <tbody>\n" ;
                statusData.forEach(function(status, index) {
                    var style = (index % 2 !== 0) ? "background-color:#ADD8E6;" : "";
                    htmlContent += "<tr style=\"" + style + "\">\n" +
                        "<td style=\"text-align:left;\">" + status.name + "</td>\n";
                
                    var totalForStatus = 0;
                
                    // Iterate over bucketData for each status
                    bucketData.forEach(function(buck) {
                        var count = vehcountobj[status.id] && vehcountobj[status.id][buck.id] ? vehcountobj[status.id][buck.id] : 0;
                        htmlContent += "<td>" + count + "</td>\n";
                        totalForStatus += count;
                    });

                    htmlContent += "<td>" + totalForStatus + "</td>\n" +
                        "</tr>\n";
                });
                var grandTotal = 0;
                htmlContent += "<tr class=\"total-row\" style=\"background-color:#ADD8E6;\">\n" +
                    "<td style=\"text-align:left\">Total</td>\n";
                // Iterate over bucketData to calculate total counts
                bucketData.forEach(function(buck) {
                    var totalForBucket = 0;
                    statusData.forEach(function(status) {
                        totalForBucket += vehcountobj[status.id] && vehcountobj[status.id][buck.id] ? vehcountobj[status.id][buck.id] : 0;
                    });
                    grandTotal += totalForBucket;
                    htmlContent += "<td>" + totalForBucket + "</td>\n";
                });
            
    
            htmlContent += "<td>" + grandTotal + "</td>\n" +
                "</tr>\n" +
                "</tbody>\n" +
                "</table>\n" +
                "</div>\n";
       

            locationData.forEach(function(loc){
                htmlContent += "<div class=\"table-container\">\n" +
                    "<table>\n" +
                    "<thead>\n" +
                    "<tr>\n" +
                    "<th style=\"width:10%;text-align:left;\">" + loc.name + "</th>\n";

                bucketData.forEach(function(buck){
                    htmlContent += "<th style=\"width:5%\">" + buck.name + "</th>\n";
                });

                htmlContent += "<th style=\"width:5%\">Total</th>\n" +
                    "</tr>\n" +
                    "</thead>\n" +
                    "<tbody>\n";
            

                statusData.forEach(function(status, index){
                    var style = (index % 2 !== 0) ? "background-color:#ADD8E6;" : "";
                    htmlContent += "<tr style=\"" + style + "\">\n" +
                        "<td style=\"text-align:left;\">" + status.name + "</td>\n";

                     var totalForStatus = 0;
                     bucketData.forEach(function(buck){
                     var count;
                     if (vehicleCount[loc.id] && vehicleCount[loc.id][status.id] && vehicleCount[loc.id][status.id][buck.id]) {
                         count = vehicleCount[loc.id][status.id][buck.id];
                        } else {
                          count = 0;
                        }
                        htmlContent += "<td>" + count + "</td>\n";
                        totalForStatus += count;
                    });
                    htmlContent += "<td>" + totalForStatus + "</td>\n" +
                        "</tr>\n";          
                    });
                   
                // htmlContent += "<tr class=\"total-row\" style=\"background-color:#ADD8E6;\">\n" +
                //     "<td style=\"text-align:left\">Total</td>\n" +
                //     "<td > need  totalforbucket 1 </td>\n" +
                //     "<td > need totalforbucket 2 </td>\n" +
                //     "<td > need total of all totalForStatus </td>\n" +
                //     "</tr>\n" +
                //     "</tbody>\n" +
                //     "</table>\n" +
                //     "</div>\n";
               
            var totalBucketCounts = {};
            var grandTotal = 0;
    
            bucketData.forEach(function (buck) {
                var totalForBucket = 0;
    
                statusData.forEach(function (status) {
                    if (vehicleCount[loc.id] && vehicleCount[loc.id][status.id] && vehicleCount[loc.id][status.id][buck.id]) {
                        totalForBucket += vehicleCount[loc.id][status.id][buck.id];
                    }
                });
    
                totalBucketCounts[buck.id] = totalForBucket;
                grandTotal += totalForBucket;
            });
    
            htmlContent += "<tr class=\"total-row\" style=\"background-color:#ADD8E6;\">\n" +
                "<td style=\"text-align:left\">Total</td>\n";
    
            bucketData.forEach(function (buck) {
                htmlContent += "<td>" + totalBucketCounts[buck.id] + "</td>\n";
            });
    
            htmlContent += "<td>" + grandTotal + "</td>\n" +
                "</tr>\n" +
                "</tbody>\n" +
                "</table>\n" +
                "</div>\n";
        });
   //right-side container
    htmlContent+= "</div>\n"+
    "<div class=\"right\">\n" +
    " <div class=\"table-container\">\n" +
    "    <table>\n" +
    "        <thead>\n" +
    "            <tr>\n" +
    "                <th  style=\"width:10%;text-align:left;\">Total</th>\n" ;
    bucketData.forEach(function(buck){
        htmlContent+= "<th style=\"width:5%\">"+buck.name+"</th>\n" ;
    })
    htmlContent+= "<th style=\"width:5%\">Total</th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" ;
    statusData.forEach(function(status, index){
        var style = (index % 2 !== 0) ? "background-color:#ADD8E6;" : "";
        htmlContent += "<tr style=\"" + style + "\">\n" +
            "<td style=\"text-align:left;\">" + status.name + "</td>\n";
        htmlContent += "<td>0</td>\n" +
    "                <td>0</td>\n" +
    "                <td>0</td>\n" +
    "                <td>0</td>\n" +
    "                <td>0</td>\n" +
    "            </tr>\n" ;
})
htmlContent +=  "<tr class=\"total-row\" style=\"background-color:#ADD8E6;\">\n" +
    "                <td style=\"text-align:left\">TOTAL</td>\n" +
    "                <td>0</td>\n" +
    "                <td>0</td>\n" +
    "                <td>0</td>\n" +
    "                <td>0</td>\n" +
    "                <td>0</td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "    </div>\n" +
//pie_chart
    " <div class=\"table-container\">\n" +
    "    <div id=\"piechart\" >\n" +
    "    <script type=\"text/javascript\" src=\"https://www.gstatic.com/charts/loader.js\"></script>\n" +
    "    <script type=\"text/javascript\">\n" +
    "        // Load google charts\n" +
    "        google.charts.load('current', { 'packages': ['corechart'] });\n" +
    "        google.charts.setOnLoadCallback(drawChart);\n" +
    "        function drawChart() {\n" +
    "            var data = google.visualization.arrayToDataTable([\n" +
    "                ['year', 'no'],\n" +
    "                ['2020', 70],\n" +
    "                ['2019', 60],\n" +
    "                ['2018', 22],\n" +
    "                ['2017', 40],\n" +
    "                ['2016', 52],\n" +
    "                ['2015', 38]\n" +
    "            ]);\n" +
    "            // Optional; add a title and set the width and height of the chart\n" +
    "            var options = { 'title': 'AVAILABLE TRUCK FOR YEAR', 'width':700, 'height': 500 };\n" +
    "            // Display the chart inside the <div> element with id=\"piechart\"\n" +
    "            var chart = new google.visualization.PieChart(document.getElementById('piechart'));\n" +
    "            chart.draw(data, options);\n" +
    "        }\n" +
    "    </script>\n" +
    "</div>\n" +
    "</div>\n" +
"</div>\n" +
"</div>\n" +
"</body>\n" +
"</html>";  
         return htmlContent;
        }
        return {onRequest}
    });

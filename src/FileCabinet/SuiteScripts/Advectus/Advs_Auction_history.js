/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search', 'N/log'], function(search, log) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            var auctid = context.request.parameters.auctid;
            var auctData = getAuctionData(auctid);

            var html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>Auction Dashboard History</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
                    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
                </head>
                <body class="container mt-4">
                    <h2 class="text-center">History</h2>
<!--                    <button class="btn btn-primary mb-3" onclick="refreshData()">Refresh Data</button>-->
                    
                    <table class="table table-bordered table-striped">
                        <thead class="table">
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Field</th>
                                <th>OldValue</th>
                                <th>NewValue</th>
                                
                            </tr>
                        </thead>
                        <tbody id="dashboardTable">
                            ${generateTableRows(auctData)}
                        </tbody>
                    </table>

                    <script>
                        function refreshData() {
                            $.ajax({
                                url: window.location.href,
                                type: 'POST',
                                success: function(response) {
                                    var data = JSON.parse(response);
                                    var tableBody = '';
                                    if (data.length > 0) {
                                        data.forEach(function(row) {
                                            tableBody += '<tr>';
                                            tableBody += '<td>' + (row._date || '') + '</td>';
                                            tableBody += '<td>' + (row._newvalue || '') + '</td>'; 
                                            tableBody += '<td>' + (row._field || '') + '</td>'; 
                                            tableBody += '<td>' + (row._oldvalue || '') + '</td>'; 
                                            tableBody += '<td>' + (row._name || '') + '</td>';
                                            tableBody += '</tr>';
                                        });
                                    } else {
                                        tableBody = '<tr><td colspan="10" class="text-center">No Repossession data available.</td></tr>';
                                    }
                                    document.getElementById("dashboardTable").innerHTML = tableBody;
                                },
                                error: function() {
                                    alert("Error refreshing data.");
                                }
                            });
                        }
                    </script>
                </body>
                </html>
            `;

            context.response.write(html);
        } else if (context.request.method === 'POST') {
            // Handle AJAX request to refresh data
            var transportData = getRepoDashboardData();
            context.response.write(JSON.stringify(transportData));
        }
    }

    function getAuctionData(auctid) {
        var searchResults = [];
        var dashboardSearch = search.create({
            type: "customrecord_advs_vehicle_auction",
            filters:
                [
                    ["isinactive","is","F"],
                    "AND",
                    ["internalid","anyof",auctid],
                    "AND",
                    ["systemnotes.type","is","F"]
                    /* "AND",
                     ["systemnotes.field","anyof","CUSTRECORD_ADVS_TRANSPORT_FROMLOCATION","CUSTRECORD_ADVS_TRANSPORT_LOCATION_TO","CUSTRECORD_ADVS_TRANSPORT_COMP","CUSTRECORD_ADVS_TRANSPORT_STATUS_DASH"]*/
                ],
            columns:
                [
                    search.createColumn({
                        name: "date",
                        join: "systemNotes"
                    }),
                    search.createColumn({
                        name: "field",
                        join: "systemNotes"
                    }),
                    search.createColumn({
                        name: "newvalue",
                        join: "systemNotes"
                    }),
                    search.createColumn({
                        name: "oldvalue",
                        join: "systemNotes"
                    }),
                    search.createColumn({
                        name: "name",
                        join: "systemNotes"
                    })
                ]
        });
        var searchResultCount = dashboardSearch.runPaged().count;


        dashboardSearch.run().each(function(result) {
            searchResults.push({
                _date: result.getValue({
                    name: "date",
                    join: "systemNotes"
                }),
                _field: result.getText({
                    name: "field",
                    join: "systemNotes"
                }),
                _newvalue: result.getValue({
                    name: "newvalue",
                    join: "systemNotes"
                }),
                _oldvalue: result.getValue({
                    name: "oldvalue",
                    join: "systemNotes"
                }),
                _name: result.getText({
                    name: "name",
                    join: "systemNotes"
                })

            });
            return true;
        });

        return searchResults;
    }

    function generateTableRows(data) {
        if (data.length === 0) {
            return '<tr><td colspan="10" class="text-center">No Auction data available.</td></tr>';
        }

        return data.map(row => `
            <tr>
                <td>${row._date || ''}</td> 
                <td>${row._name || ''}</td> 
                <td>${row._field || ''}</td>  
                <td>${row._oldvalue || ''}</td> 
                <td>${row._newvalue || ''}</td> 
                
            </tr>
        `).join('');
    }

    return { onRequest: onRequest };
});

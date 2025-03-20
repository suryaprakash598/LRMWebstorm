/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search', 'N/log'], function(search, log) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            var transportNotes = getTransportNotes();

            // Generate HTML Response
            var html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>Transport Notes</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
                    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
                </head>
                <body class="container mt-4">
                    <h2 class="text-center">Transport Notes</h2>
<!--                    <button class="btn btn-primary mb-3" onclick="refreshData()">Refresh Data</button>-->
                    <table class="table table-bordered">
                        <thead class="table">
                            <tr>
                                <th>Date & Time</th>
                                <th>Notes</th>
                                <th>Created By</th>
                            </tr>
                        </thead>
                        <tbody id="notesTable">
                            ${generateTableRows(transportNotes)}
                        </tbody>
                    </table>

                    <script>
                        function refreshData() {
                            $.ajax({
                                url: window.location.href,
                                type: 'POST',
                                success: function(response) {
                                    var notes = JSON.parse(response);
                                    var tableBody = '';
                                    if (notes.length > 0) {
                                        notes.forEach(function(note) {
                                            tableBody += '<tr>';
                                            tableBody += '<td>' + (note.dateTime || 'N/A') + '</td>';
                                            tableBody += '<td>' + (note.notes || 'N/A') + '</td>';
                                            tableBody += '<td>' + (note.createdBy || 'N/A') + '</td>';
                                            tableBody += '</tr>';
                                        });
                                    } else {
                                        tableBody = '<tr><td colspan="3" class="text-center">No transport notes available.</td></tr>';
                                    }
                                    document.getElementById("notesTable").innerHTML = tableBody;
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
            // Handle AJAX Request to refresh data
            var transportNotes = getTransportNotes();
            context.response.write(JSON.stringify(transportNotes));
        }
    }

    function getTransportNotes() {
        var searchResults = [];
        var transportSearch = search.create({
            type: "customrecord_advs_transport_notes",
            filters: [["isinactive", "is", "F"], "AND", ["custrecord_advs_tpt_note_parent_link", "anyof", "503"]],
            columns: [
                search.createColumn({ name: "custrecord_advs_tpt_note_date_time", summary: "GROUP" }),
                search.createColumn({ name: "custrecord_advs_tpt_note_notes", summary: "MAX" }),
                search.createColumn({ name: "name", join: "systemNotes", summary: "GROUP" })
            ]
        });

        transportSearch.run().each(function(result) {
            searchResults.push({
                dateTime: result.getValue({ name: "custrecord_advs_tpt_note_date_time", summary: "GROUP" }),
                notes: result.getValue({ name: "custrecord_advs_tpt_note_notes", summary: "MAX" }),
                createdBy: result.getText({ name: "name", join: "systemNotes", summary: "GROUP" })
            });
            return true;
        });

        return searchResults;
    }

    function generateTableRows(data) {
        if (data.length === 0) {
            return '<tr><td colspan="3" class="text-center">No transport notes available.</td></tr>';
        }

        return data.map(note => `
            <tr>
                <td>${note.dateTime || 'N/A'}</td>
                <td>${note.notes || 'N/A'}</td>
                <td>${note.createdBy || 'N/A'}</td>
            </tr>
        `).join('');
    }

    return { onRequest: onRequest };
});

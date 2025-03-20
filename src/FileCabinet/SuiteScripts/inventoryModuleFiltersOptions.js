/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search'], (record, search) => {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            try {
                let responseData = {};

                // Array of Custom Lists to Fetch
                let customLists = [
                    'customlistadvs_list_physicallocation', 
                    'customrecord_advs_vm',
					'customlist_advs_reservation_status',
					'customlist_advs_color_list',
					'customlist712', //transmission
					'customlist_advs_color_list',
					'customlist_advs_truck_year',
					'customrecord_advs_engine_model',
					'customlist_advs_title_restriction_list',
					'customlist_advs_body_style',
					'customlist_advs_single_bunk',
					'customlist_advs_ms_list_sleeper_size',
					'customlist_advs_ms_apu_list',
					'customlist_advs_beds_list',
					
                ];
                
                // Fetch Custom List Values
                responseData.customLists = fetchCustomLists(customLists);

                // Fetch Custom Records
              //  responseData.customRecords = fetchCustomRecords('customrecord_example');

                context.response.write(JSON.stringify(responseData));
            } catch (error) {
                log.error({ title: 'Error', details: error });
                context.response.write(JSON.stringify({ error: error.message }));
            }
        }
    }

    /**
     * Fetch values from multiple custom lists
     */
    function fetchCustomLists(listIds) {
        let listData = {};
        listIds.forEach((listId) => {
            let searchResults = search.create({
                type: listId,
                columns: ['name', 'internalId']
            }).run().getRange({ start: 0, end: 1000 });

            listData[listId] = searchResults.map((result) => ({
                id: result.getValue('internalId'),
                name: result.getValue('name')
            }));
        });
        return listData;
    }

    /**
     * Fetch values from a custom record type
     */
    function fetchCustomRecords(recordType) {
        let records = [];
        let recordSearch = search.create({
            type: recordType,
            columns: ['internalId', 'name', 'custrecord_field1', 'custrecord_field2'] // Adjust fields as needed
        });

        let searchResults = recordSearch.run().getRange({ start: 0, end: 1000 });
        searchResults.forEach((result) => {
            records.push({
                id: result.getValue('internalId'),
                name: result.getValue('name'),
                field1: result.getValue('custrecord_field1'),
                field2: result.getValue('custrecord_field2')
            });
        });

        return records;
    }

    return { onRequest };
});

/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */
define(['N/record', 'N/search'], function(record, search) {

        function getInputData() {
                return search.load({
                        id: 'customsearch1561'
                });
        }

        function map(context) {
                try {
                        var result = JSON.parse(context.value);
                        var recordId = result.id;

                        record.delete({
                                type: 'customrecord_advs_vm',
                                id: recordId
                        });

                        log.audit('Deleted Record', 'ID: ' + recordId);
                } catch (e) {
                        log.error('Error Deleting Record', e);
                }
        }

        function summarize(summary) {
                log.audit('Map/Reduce Script Completed', {
                        totalProcessed: summary.inputSummary ? summary.inputSummary.resultCount : 0,
                        errors: summary.mapSummary.errors.length
                });
        }

        return {
                getInputData: getInputData,
                map: map,
                summarize: summarize
        };
});

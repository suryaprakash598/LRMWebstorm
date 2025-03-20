/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define([], function() {

    function pageInit(context) {
        // Nothing to do on page load
    }

    function fieldChanged(context) {

        if (context.fieldId === 'custpage_location_filter' || context.fieldId === 'custpage_status_filter') {
            var locationId = context.currentRecord.getValue({ fieldId: 'custpage_location_filter' });
            var statusId = context.currentRecord.getValue({ fieldId: 'custpage_status_filter' });
            var currentUrl = window.location.href;
            var newUrl = updateUrlParam(currentUrl, 'location', locationId);
            newUrl = updateUrlParam(newUrl, 'status', statusId);
            window.location.href = newUrl;
        }
    }
    function updateUrlParam(url, param, value) {
        var newUrl = new URL(url);
        newUrl.searchParams.set(param, value);
        return newUrl.toString();
    }
    function openPopup(url) {
        var width = 800;
        var height = 600;
        var left = (window.innerWidth / 2) - (width / 2);
        var top = (window.innerHeight / 2) - (height / 2);
        window.open(url, 'popup', 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
    }

    function downloadMissingTitle(){
        var suiteletUrl = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2596&deploy=1';
        suiteletUrl += '&custparam_id=1';
        window.open(suiteletUrl, '_blank');
    }

    function downloadTransferTitle(){
        var suiteletUrl = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2596&deploy=1';
        suiteletUrl += '&custparam_id=2';
        window.open(suiteletUrl, '_blank');
    }

    function downloadLiendTitle(){
        var suiteletUrl = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2596&deploy=1';
        suiteletUrl += '&custparam_id=3';
        window.open(suiteletUrl, '_blank');
    }

    function downloadAllTitle(){
        var suiteletUrl = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2596&deploy=1';
        suiteletUrl += '&custparam_id=4';
        window.open(suiteletUrl, '_blank');
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        openPopup:openPopup,
        downloadMissingTitle:downloadMissingTitle,
        downloadTransferTitle:downloadTransferTitle,
        downloadLiendTitle:downloadLiendTitle,
      downloadAllTitle:downloadAllTitle
    };
});

/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/record', 'N/runtime', 'N/url','/SuiteBundles/Bundle 555729/advs_lib/src/advs_lib_default_funtions_v2.js'],
/**
 * @param{record} record
 * @param{runtime} runtime
 * @param{url} url
 */
function(record, runtime, url,advsObj) {
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
        // alert("hi")

    }
  function handleIconClick(id,jobid){
    var paramObj = {
        'custparam_id':id,
        'custparam_jobid':jobid
        }
        var urlM = url.resolveScript({
            scriptId: 'customscript_advs_ss_comments_dashboard',
            deploymentId: 'customdeploy_advs_ss_comments_dashboard',
            params : paramObj
        });	

        var w=screen.width - 1100,h=250;
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;
        
    advsObj.injectModal();
		advsObj. openpopUpModal(urlM, 'Comments', h , w);

  }

      
       
      

    return {
        pageInit: pageInit,
        handleIconClick:handleIconClick
        // openCommentPopup:openCommentPopup
    };
    
});

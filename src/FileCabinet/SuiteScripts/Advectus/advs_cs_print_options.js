/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/https','N/url','N/record','N/format','N/currentRecord','N/search'],
/**
 * @param{format} format
 * @param{runtime} runtime
 * @param{serverWidget} serverWidget
 * @param{url} url
 * @param{xml} xml
 */
function(runtime,https,url,record,format,currentRecord,search){
    
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
    }


     function onChange(isChecked) {
        var JobOption    = document.getElementById("custpage_jobOption").checked;
        var PriceOption  = document.getElementById("custpage_priceOption").checked;
        var QtyOption    = document.getElementById("custpage_qtyOption").checked;

        var MsgOption      = document.getElementById("custpage_messagesOption").checked;
        var AuthHisOption  = document.getElementById("custpage_authHistoryOption").checked;
        var AppointOption  = document.getElementById("custpage_appointmentsOption").checked;

        var PArabObj = {
            "JobOption"   : JobOption,
            "PriceOption" :PriceOption,
            "qtyOption"   :QtyOption,

            "MsgOption"      :MsgOption,
            "AuthHisOption"  :AuthHisOption,
            "AppointOption"  :AppointOption,
        };

        var urlop = url.resolveScript({
            scriptId: "customscript_advs_ss_print_options",
            deploymentId: "customdeploy_advs_ss_print_options",
            params: PArabObj
        });
        setWindowChanged(window,false);
        window.location =   urlop;
    }
    

    // function onChangejob(isChecked) {
    //     checked
    //     //var isChecked=isChecked
    //     var toggle=isChecked
    //     // = document.getElementById("custpage_jobOption").value;
    //     alert(toggle)
    //     if (toggle) {
    //        alert("Toggle is ON");
    //         return "ON"; 
    //     } else {
    //         alert("Toggle is OFF");
    //         return "OFF";  
    //     }
    // }
    // function onChangePrice(isChecked) {
    //    var toggle = isChecked
    //    //document.getElementById("custpage_priceOption").value;
    //    alert(toggle )
    //     if (toggle) {
    //        alert("Toggle is ON");
    //         return "ON";  
    //     } else {
    //         alert("Toggle is OFF");
    //         return "OFF";  
    //     }
    // }
    // function onChangeQuantity(isChecked) {
    //    var toggle =isChecked
    //    //= document.getElementById("custpage_qtyOption").value;
    //    alert(toggle)
    //     if (toggle) {
    //        alert("Toggle is ON");
    //         return "ON";  
    //     } else {
    //         alert("Toggle is OFF");
    //         return "OFF"; 
    //     }
    // }


    return {
        pageInit: pageInit,
        onChange:onChange,
        // onChangePrice:onChangePrice,
        // onChangeQuantity:onChangeQuantity
       
    };
    
});

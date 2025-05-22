/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord','N/url','N/https','/SuiteBundles/Bundle 555729/advs_lib/src/advs_lib_default_funtions_v2.js'],
/**
 * @param{currentRecord} currentRecord
 */
function(currentRecord,url,https,advsObj) {
    
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
        // setTimeout(function() {
        //     var element =   document.getElementById("custom149txt");  //custom534txt
        //     console.log(element);
        //     element.addEventListener("click", onclickTab);

        // }, 500);
      setTimeout(function() {
       /*     var element =   document.getElementById("myBtnro");
           console.log(element);
            element.addEventListener("click", myFunction);*/
            var btns = document.querySelectorAll('input[id=myBtnro]');
            btns.forEach(function(bttn) {
                bttn.addEventListener('click', function(event){
                    var lineID  =   event.target.getAttribute("lineid");
                    var vinID   =   event.target.id;
                    var curRec  =   currentRecord.get();
                    var id       =   curRec.id;

                    var PArabObj = {
                        "vinid": id,
                        "ifrmcntnr":"T",
                        "prepid":lineID
                    };

                    var urlop = url.resolveScript({
                        scriptId: "customscript_advs_ss_create_prep_order",
                        deploymentId: "customdeploy_advs_ss_create_prep_order",
                        params: PArabObj
                    });

                    var Title = "Create Order";
                    var w = screen.width - 500, h = 350;

                    openModalDialog(urlop, Title, w, h);

                });
            });

          /*  btns.forEach(function(rec) {

                btn.addEventListener('click', event => {
                    console.log( event.target.id );

                });

            });*/
        }, 1000);

    }

    function onclickTab(){

        setTimeout(function() {
       /*     var element =   document.getElementById("myBtnro");
           console.log(element);
            element.addEventListener("click", myFunction);*/
            var btns = document.querySelectorAll('input[id=myBtnro]');
            btns.forEach(function(bttn) {
                bttn.addEventListener('click', function(event){
                    var lineID  =   event.target.getAttribute("lineid");
                    var vinID   =   event.target.id;
                    var curRec  =   currentRecord.get();
                    var id       =   curRec.id;

                    var PArabObj = {
                        "vinid": id,
                        "ifrmcntnr":"T",
                        "prepid":lineID
                    };

                    var urlop = url.resolveScript({
                        scriptId: "customscript_advs_ss_create_prep_order",
                        deploymentId: "customdeploy_advs_ss_create_prep_order",
                        params: PArabObj
                    });

                    var Title = "Create Order";
                    var w = screen.width - 500, h = 350;

                    openModalDialog(urlop, Title, w, h);

                });
            });

          /*  btns.forEach(function(rec) {

                btn.addEventListener('click', event => {
                    console.log( event.target.id );

                });

            });*/
        }, 2000);
    }
   function myFunction(event){
        var curRec  =   currentRecord.get();
        var id  =   curRec.id;

        alert(event.id);

        alert(id);

   }
  

   function clickdot( )
   {
     
    var dot= url.resolveScript({
        scriptId: "customscript_advs_ssab_annual_vehicle_re",
        deploymentId: "customdeploy_advs_ssab_annual_vehicle_re",
    });
    window.open(dot,"_blank");
   }


   function depositcreation(VinId, custId){ 

    var PArameter = {
        "custparam_vinid": VinId,
        "custparam_custid": custId,
      "ifrmcntnr":"T"
    };

    var suiteurl = url.resolveScript({
        scriptId: "customscript_advs_ss_create_deposit_pop",
        deploymentId: "customdeploy_advs_ss_create_deposit_pop",
        params: PArameter
    });

    var Title = "Create Deposit";
    var w = screen.width - 500, h = 450;

    openModalDialog(suiteurl, Title, w, h);

   }
   function updatephyLocation(VinId){ 

    var PArameter = {
        "custparam_vinid": VinId  ,
        "ifrmcntnr":"T"
    };

    var suiteurl = url.resolveScript({
        scriptId: "customscript_update_physical_location_vi",
        deploymentId: "customdeploy_update_physical_location_vi",
        params: PArameter
    });

    var Title = "Update Physical Location";
    var w = screen.width - 500, h = 450;

    //openModalDialog(suiteurl, Title, w, h);
advsObj.injectModal();
	advsObj. openpopUpModal(suiteurl, Title, h , w);
   }
                       



    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {

    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {

    }

    function openModalDialog(urlop,Title,w,h){
        Ext.onReady(function() {
            Ext.create('Ext.window.Window', {
                title: Title,
                /* height: Ext.getBody().getViewSize().height*(-100),
                 width: Ext.getBody().getViewSize().width*0.8,*/
                height: h,
                width: w+100,
//            minWidth:'730',
//            minHeight:'450',
                layout: 'fit',
                itemId : 'popUpWin',
                modal:true,
                shadow:true,
                resizable:true,
                constrainHeader:true,
                items: [{
                    xtype: 'box',
                    autoEl: {
                        tag: 'iframe',
                        src: urlop,
                        frameBorder:'0'
                    }
                }]
            }).show();
        });

    }
   function vehlocTrans(id){

       var PArabObj = {
           "s_id": id,
           "ifrmcntnr":"T",
       };

       var urlop = url.resolveScript({
           scriptId: "customscript_advs_ss_transfer_vehicle_lo",
           deploymentId: "customdeploy_advs_ss_transfer_vehicle_lo",
           params: PArabObj
       });

       var Title = "Transfer";
       var w = screen.width - 500, h = 350;

       openModalDialog(urlop, Title, w, h);
    }
	function vehInterCoTrans(id){

       var PArabObj = {
           "s_id": id,
           "ifrmcntnr":"T",
       };

       var urlop = url.resolveScript({
           scriptId: "customscript_advs_ss_create_veh_intercom",
           deploymentId: "customdeploy_advs_ss_create_veh_intercom",
           params: PArabObj
       });

       var Title = "Transfer";
       // var w = screen.width - 500, h = 450;

       // openModalDialog(urlop, Title, w, h);
          var w=screen.width - 350,h=450;
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;

        
advsObj.injectModal();
	advsObj. openpopUpModal(urlop, Title, h , w);

    }
	function openVendorBillCreateMode(id){

       var PArabObj = {
           "vin_id": id,
           "isfrom":"vin",
       };
		window.open("https://8760954.app.netsuite.com/app/accounting/transactions/vendbill.nl?cf=112&vin_id="+id+"&isfrom=vin&whence=");

    }
  
    return {
        pageInit: pageInit,
        // fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        // validateLine: validateLine,
        // validateInsert: validateInsert,
        // validateDelete: validateDelete,
        // saveRecord: saveRecord,
      myFunction        : myFunction,
      onclickTab        : onclickTab,
      openModalDialog   : openModalDialog,
      vehlocTrans       : vehlocTrans,
      vehInterCoTrans   : vehInterCoTrans,
      clickdot          : clickdot,
      depositcreation   : depositcreation,
      updatephyLocation   : updatephyLocation,
	  openVendorBillCreateMode:openVendorBillCreateMode
    };
    
});
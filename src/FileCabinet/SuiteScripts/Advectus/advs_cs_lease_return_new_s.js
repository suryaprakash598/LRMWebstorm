/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/url','jquery-ui','N/currentRecord','N/format'],
    /**
     * @param{runtime} runtime
     * @param{search} search
     */
    function(https, url,ui,currentRecord,format) {

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
            $(document).ready(function () {
                onPageInitFunctions();
            });
        }

        function onPageInitFunctions() {

            $('#otherreturncharges').on('change', function (event) {
                event.preventDefault();
                var othercharges = $('#otherreturncharges').val();
                console.log(othercharges);
            });
          
           $('#custpage_ret_type').on('change', function() {
                var selectedValue = $(this).val();
                if (selectedValue === '2') {
                   $('#hiddenRow').show();
                } else {
                   $('#hiddenRow').hide();
                }
             });
          
            $("#submitrec").on('click',function(event){
                event.preventDefault();
                // Show the loader overlay

                const formData = collectFormData();

                console.log("formData",formData);
                $('#loader-overlay').show();

                var urlpost = '/app/site/hosting/scriptlet.nl?script=customscript_advs_ss_lease_return_new_s2&deploy=customdeployadvs_ss_lease_return_new_s2&custparam_type=1';

                $.ajax({
                    url: urlpost,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({formData: formData }),
                    success: function(response) {
                        console.log(response)
                        doredirect(response);
                        $('#loader-overlay').hide();
                    },
                    error: function(response) {
                        // openTrafficBoard(response);
                        // Hide the loader overlay
                        $('#loader-overlay').hide();
                        alert('Error on Submission.');
                    }
                });


            });


        }

        function doredirect(getBody) {
            try {
                // Log the response to see its exact content
                console.log("Raw response:", getBody);

                // Extract JSON part from the response using a regular expression
                var jsonResponse = getBody.match(/\[.*\]/);
                if (!jsonResponse) throw new Error("JSON response not found");

                jsonResponse = jsonResponse[0];
                console.log("Extracted JSON:", jsonResponse);

                // Parse the JSON response
                var JSONData = JSON.parse(jsonResponse);

                // Log the parsed JSON
                console.log("Parsed JSON:", JSONData);

                if (JSONData && JSONData.length > 0) {
                    var tempid = JSONData[0].id;
                    if (tempid) {
                        var param = {};
                        param.proc_id = tempid;
                        param.proc_type = "mapstatus";
                        param.ifrmcntnr = "T";


                        var ur_ = url.resolveScript({
                            scriptId: "customscript_advs_fam_progress_check",
                            deploymentId: "customdeploy_advs_fam_progress_check",
                            params: param
                        });

                        setWindowChanged(window, false);
                        window.location = ur_;
                        
                    } else {
                        alert("Error: tempid is undefined or null.");
                    }
                } else {
                    alert("Error: JSONData is empty or undefined.");
                }
            } catch (error) {
                alert("Error: " + error.message);
                console.error("Error details:", error);
            }
        }


        function collectFormData(){

            var obj =   {};
            var curRec  =   currentRecord.get();
            var Lines = 0;
            var leaseid            = curRec.getValue("custpage_lease_id");
            var customerid         = curRec.getValue("custpage_customer");
            var vinid              = curRec.getValue("custpage_lease_vin");
            var flag               = curRec.getValue("custpage_flag");
            var returntype         = curRec.getValue("custpage_ret_type");
        /*     var vehicleCost        = curRec.getValue('vehiclecost');
            alert(vehicleCost); */

            // console.log(vehicleCost);
            obj.leaseid     =   leaseid;
            obj.customerid  =   customerid;
            obj.vinid       =   vinid;
            obj.flag        =   flag;
            obj.returntype  =   returntype;
            // obj.vehicleCost =   vehicleCost;

            var LinesLength        = curRec.getValue("custpage_total_ul_"); //document.getElementById("custpage_total_ul_").value;
            console.log("LinesLength"+LinesLength);
            var LinesObjArray    =   [];
            for (var i = 0; i < LinesLength*1; i++) { 
                var ItemRate = document.getElementById("custpage_item_sel_rate_" + i + "").value;
                var ItemDesc = document.getElementById("custpage_item_sel_desc_" + i + "").value;
                    var LineDataObj   =   {};
                    LineDataObj.ItemRate =   ItemRate;
                    LineDataObj.ItemDesc=   ItemDesc;
                    LinesObjArray.push(LineDataObj);
            }
            console.log("LinesObjArray"+LinesObjArray);
              obj.LinesData  =   LinesObjArray;
            return obj;
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
       function addLines(){
            var ItemDesc		=	document.getElementById('custpage_item_desc').value
            var ItemRate		=	document.getElementById('custpage_item_rate').value;
    
            var myUl = document.getElementById('selecteddata_other');
            var UiLength	=	document.querySelectorAll('#selecteddata_other li').length;
            var selecteddata 	= 0;
    
            if(ItemDesc && ItemRate){
                selecteddata++;
            }
    
            if(selecteddata>0){
                var liTag	=	document.createElement('li');
                liTag.innerHTML	="<div class='form-row2-summary' >"+
                    "<div class='form-wrapper-sum'><p>"+ItemDesc+"</p></div>"+
                    "<div class='form-wrapper-sum'><p>"+ItemRate+"</p></div>"+
                    "<div class='form-wrapper-sum removelink-sum'>"+
                    "<a href='#'  onClick=\"var rConfig = JSON.parse('{}');rConfig['context'] = '/SuiteScripts/Advectus/advs_cs_lease_return_new_s.js';var entryPointRequire = require.config(rConfig);entryPointRequire(['/SuiteScripts/Advectus/advs_cs_lease_return_new_s.js'], function (mod) {if (!!window) {}mod.removeLi("+UiLength+");}); return false;\" ><span class=\"material-symbols-outlined summaryrem\">\n" +
                    "x\n" +
                    "</span></a>"+
                    "</div>" +
                    "<input type='hidden' id='custpage_item_id_"+UiLength+"' name='custpage_item_id_"+UiLength+"' value='"+UiLength+"'>"+
                    "<input type='hidden' id='custpage_item_sel_desc_"+UiLength+"' name='custpage_item_sel_desc_"+UiLength+"' value='"+ItemDesc+"'>"+
                    "<input type='hidden' id='custpage_item_sel_rate_"+UiLength+"' name='custpage_item_sel_rate_"+UiLength+"' value='"+ItemRate+"'>"+
                    "</div>";
    
                liTag.id = "sel_item_li_"+UiLength+"";
    
                myUl.appendChild(liTag);
    
                var oldLength   =   document.getElementById("custpage_total_ul_").value;
                oldLength=oldLength*1;
                document.getElementById("custpage_total_ul_").value=(oldLength+1);

                document.getElementById('custpage_item_desc').value="";
                document.getElementById('custpage_item_rate').value="";
    
            }else{
                alert('Please enter Charges to Add');
            }
        }
         function showProgressDialog(Title, message)
        {
            try
            {
                Ext.MessageBox.show({
                    title: Title,
                    msg: message,
                    width:300,
                    wait:true,
                    waitConfig:{

                        interval:200,
                    }
                });
            }catch(e){

            }
        }
        function removeLi(uiLen){

            var listElements	=	document.querySelectorAll("#selecteddata_other li");
            var UiLength	=	document.querySelectorAll("#selecteddata_other li").length;
    
            var LiSelected	=	"sel_item_li_"+uiLen+"";
    
            for (var i = 0; i<UiLength; i++) {
                var getLiId	=	listElements[i];
                var liID	=	getLiId.id;
                var itemIDLi = document.getElementById(liID);
                if(liID == LiSelected){
                    itemIDLi.remove();
    
                }
            }
        }
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            onPageInitFunctions:onPageInitFunctions,
            doredirect:doredirect,
            showProgressDialog:showProgressDialog,
            addLines:addLines,
            removeLi:removeLi
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            // validateField: validateField,
            // validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            // saveRecord: saveRecord
        };

    });

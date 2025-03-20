/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/log', 'N/record', 'N/search','N/currentRecord','N/url','/SuiteBundles/Bundle 555729/advs_lib/src/advs_lib_default_funtions_v2.js'],
/**
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
function(log, record, search,currentRecord,url,advsObj) {
    
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

        //alert("hi");
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
        var currRecord =scriptContext.currentRecord;
        
        // var checkboxValue =currRecord.getCurrentSublistValue({
        //     fieldId: 'custpage_labor_quan'
        // }); 
        
          

        var checkboxValue = currRecord.getCurrentSublistValue({
            sublistId: 'custpage_sublst',
            fieldId: 'custpage_chkbx',
            //line: L
        });  

        //alert(checkboxValue);
        
        // if (scriptContext.sublistId === 'custpage_sublst') {

            if(scriptContext.fieldId =='custpage_chkbx'){
     
                   var fixedQuantity = currRecord.getCurrentSublistValue({
                    sublistId: 'custpage_sublst',
                    fieldId: 'custpage_labor_quan',
                   // value:fixedQuantity
                    //line: L
                }); 

                if((fixedQuantity == '' || fixedQuantity == null) && (checkboxValue == 'T' || checkboxValue == true)){
                    alert('Please enter quantity.');    
                    
                    var checkboxValue = currRecord.setCurrentSublistValue({
                        sublistId: 'custpage_sublst',
                        fieldId: 'custpage_chkbx',
                        value: false
                    }); 
                    return false;
               }
               
              
            }
            
            
            
            
        //    return false;
            
        // }

        return true;

        
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
        return true;
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
        return true;
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
        return true;
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
        return true;
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
        return true;
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
        return true;
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
        return true;
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
        var cR = scriptContext.currentRecord
        var stage1 = cR.getValue({
            fieldId: 'custpage_stage1',
        }); 
        
//         if(stage1 == 'T' || stage1 ==true){

//             var lineCount = cR.getLineCount({
//                 sublistId: 'custpage_sublst'
//             });
    
//             var anyChecked = false; 

//     for(var i=0;i<lineCount;i++){

//        var checkboxValue = cR.getCurrentSublistValue({
//                 sublistId: 'custpage_sublst',
//                 fieldId: 'custpage_chkbx',
//             });

//             var fixedQuantity = cR.getCurrentSublistValue({
//                 sublistId: 'custpage_sublst',
//                 fieldId: 'custpage_labor_quan',
//             }); 

//             if(checkboxValue=='T' || checkboxValue == true){
//                 anyChecked = true; 
               
//             }
//     }
           
//     if(anyChecked == 'F'|| anyChecked == false) {
//         alert('Please select a checkbox')
//       } 
//  return false;
//         }

return true;
    } 

    // function RemoveAddedline(LAborID, ChildID, RecordId) {
    //     alert("hello")
    //     log.error('delete record', 'delete record');
        
    //     // Construct Suitelet URL with parameters
    //     var suiteletScriptId = 'customscript_advs_staa_royal_punchayathi';
    //     var suiteletDeploymentId = 'customdeploy_advs_staa_royal_punchayathi';
    //     var params = {
    //         custparam_reqtype: '16',
    //         custparam_labid: LAborID,
    //         custparam_recid: RecordId,
    //         custparam_operid: ChildID
    //     };
    //     var suiteletUrl = url.resolveScript({
    //         scriptId: suiteletScriptId,
    //         deploymentId: suiteletDeploymentId,
    //         params: params
    //     });
    //     var response = https.get({
    //         url: UrlBack,
    //        // headers: headers,
    //         //params: params
    //     });
        
    //     // Log the response or further process it
    //     log.debug('GET Request Response', response.body);
    //     RefreshCUrrentScreenURL(response);


    // }
    
    // function RefreshCUrrentScreenURL(response) {
    //     if(response.getCode() == 200)
    //     {
    
      
    //         window.location.reload();
    
    //     }
    // }  

    function back(){
   //alert("hi")

   var currentRecordd  = currentRecord.get();
 
        var stage_1 = currentRecordd.getValue({
            fieldId: 'custpage_stage1'
        });

        //alert(stage_1);
        var stage_2 = currentRecordd.getValue({
            fieldId: 'custpage_stage2'
        }); 
        //alert(stage_2);
        var record_id = currentRecordd.getValue({
            fieldId: 'custpage_record_id'
        }); 

        var params = {
            custparam_stage_1: 'T',
            custparam_record_id: record_id,
            ifrmcntnr: 'T',
        }

        
//log.debug("stage_1+stage_2+record_id",stage_1+stage_2+record_id);
        var suiteletURL = url.resolveScript({
            scriptId: 'customscript_advs_ss_create_operationnew',
            deploymentId: 'customdeploy_advs_ss_create_operationnew',
            params: params

        }); 

        setWindowChanged(window, false);
            window.location		=	suiteletURL;

    
    }

    function removeAddedline(LAborID, ChildID, RecordId) {
        alert("hi");
        log.error('delete record', 'delete record');
        var suiteletURL = 'https://8760954.app.netsuite.com/app/common/scripting/script.nl?id=431';
        suiteletURL += '&custparam_reqtype=16';
       // suiteletURL += '&custparam_labid=' + LAborID;
       // suiteletURL += '&custparam_recid=' + RecordId;
        suiteletURL += '&custparam_operid=' + ChildID;
    
        var response = https.get({
            url: suiteletURL
        });
    
       advsObj.showProcessingMessage();
        response.then(function(res) {
            if (res.code == 200) {
               advsObj. hideProcessingMessage();
                window.location.reload();
            }
        });
    }
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        postSourcing: postSourcing,
        sublistChanged: sublistChanged,
        lineInit: lineInit,
        validateField: validateField,
        validateLine: validateLine,
        validateInsert: validateInsert,
        validateDelete: validateDelete,
        saveRecord: saveRecord,
        removeAddedline:removeAddedline,
        back:back
       // RefreshCUrrentScreenURL:RefreshCUrrentScreenURL,

    };
    
});
/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

function() {
    
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

            checkBackendData();

            function checkBackendData() {
                $.ajax({
                    url: '/app/site/hosting/scriptlet.nl?script=customscript_ssst_chat_backend_Service&deploy=customdeploy_ssst_chat_backend_Service',
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        'checkfornewChat': 1
                    },
                    success: function(data) {

                        console.log(data.allChats);

                        var allChats = data.allChats;

                        var htmlString  =   "";

                        for(var i = 0; i < allChats.length; i++) {


                            htmlString +=     `<div class='list-item'> 
                                 <div class='profile-image'>                                                       
                                   <div class='dot-indicator sm bg-success'></div>
                                   <img class=" rounded-circle" style="height: 35px; width: 35px;" src="https://8760954.app.netsuite.com/core/media/media.nl?id=1111&c=8760954&h=TlSGoEuU1pFb9whS7mo94s7shTvAjnDqV3CL4vuROBaf7zvy" alt="" />
                                 </div> 
                                 <p class='user-name' style="font-size: 14px;">${allChats[i].keyName}</p> 
                                 <p class='chat-time' style="font-size: 12px;">30min ago</p> 
                             <p class='chat-text' style="padding-left: 0px !important; font-size: 12px;"> Hello everyone, Iam happy to share with you our new company goals.. </p> 
                               </div> `;

                        }

                        document.querySelector("#allExistingChat").innerHTML = htmlString;

                    },
                    error: function(xhr, status, error) {
                        $('#loadingIndicator_item_added').hide();
                        console.error('Error fetching autocomplete suggestions:', error);
                    }
                });
            }

         //   setInterval(checkBackendData, 5000);
        });



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

    return {
        pageInit: pageInit
        // ,fieldChanged: fieldChanged,
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

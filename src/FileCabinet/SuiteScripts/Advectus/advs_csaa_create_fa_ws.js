/**
 *  @NModuleScope Public
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord','N/format','N/search'],
/**
 * @param{currentRecord} currentRecord
 */
function(currentRecord,format,search) {
    
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
        var name    =   scriptContext.fieldId;
        var CurREc  =   scriptContext.currentRecord;
        if(name == "custpage_date"){
            var CDate   =   CurREc.getValue({fieldId:"custpage_date"});
            var LDate   =   CurREc.getValue({fieldId:"custpage_l_date"});

            if(CDate){
                var formatCDate =   format.parse({
                    type:format.Type.DATE,
                    value:CDate
                });

                var Ctime   =   formatCDate.getTime();

                var formatLDate =   format.parse({
                    type:format.Type.DATE,
                    value:LDate
                });
                var LTtime   =   formatLDate.getTime();

                if(Ctime <= LTtime){
                    alert("Please enter after Last Transaction Date");
                    CurREc.setValue({fieldId:"custpage_date",value:""});
                }
            }



            // alert(Ctime+"=>"+LTtime);

           /* var DateCPar  =   format.parse({
                type:format.Type.DATE,
                value:DateCre
            });

            var DateC  =   format.parse({
                type:format.Type.DATE,
                value:DateCPar
            });*/
        }
        /* if(name == "custpage_cust"){
        	
            var CCustID   =   CurREc.getValue({fieldId:"custpage_cust"});
            var billAddObj  =   CurREc.getField({
                fieldId:"custpage_cust_billing"
            });
            var shipAddObj  =   CurREc.getField({
                fieldId:"custpage_cust_shipping"
            });


//            if(CCustID){
            	
                billAddObj.removeSelectOption({
                    value: null,
                });
                billAddObj.insertSelectOption({
                    value:"",
                    text:""
                });

                shipAddObj.removeSelectOption({
                    value: null,
                });
                shipAddObj.insertSelectOption({
                    value:"",
                    text:""
                });
                var CustMSearch = search.create({
                    type: "customer",
                    filters:
                        [
                            ["internalid","anyof",CCustID],
                            "AND",
                            ["isdefaultbilling","is","T"]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "addressinternalid",
                                join: "Address",
                                label: "Internal ID"
                            }),
                            search.createColumn({
                                name: "address",
                                join: "Address",
                                label: "Address"
                            }),
                            search.createColumn({
                                name: "isdefaultbilling",
                                join: "Address",
                                label: "Address"
                            }),
                            search.createColumn({
                                name: "isdefaultshipping",
                                join: "Address",
                                label: "Address"
                            }),

                        ]
                });
                CustMSearch.run().each(function(result){
                    var intId   =   result.getValue({
                        name: "addressinternalid",
                        join: "Address"});
                    var addText   =   result.getValue({
                        name: "address",
                        join: "Address"});
                    var shipC   =   result.getValue({
                        name: "isdefaultshipping",
                        join: "Address"});
                    var BillC   =   result.getValue({
                        name: "isdefaultbilling",
                        join: "Address"});

                      billAddObj.insertSelectOption({
                            value:intId,
                            text:addText
                        });
                   shipAddObj.insertSelectOption({
                            value:intId,
                            text:addText
                        });


                    return true;
                });

            }*/
//        else{
//                billAddObj.removeSelectOption({
//                    value: null,
//                });
//            }


//        }
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
        pageInit: pageInit,
        fieldChanged: fieldChanged,
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
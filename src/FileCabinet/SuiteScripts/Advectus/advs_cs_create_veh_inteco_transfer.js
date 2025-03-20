/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/runtime', 'N/ui/message','N/format','N/search'],
    /**
     * @param {currentRecord} currentRecord
     * @param {runtime} runtime
     * @param {message} message
     */
    function(currentRecord, runtime, message,format,search) {

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
            var name	=	scriptContext.fieldId;
            var CurrREc	=	scriptContext.currentRecord;
            /*       if(name == "custpage_statu_new"){

                       var OldValue	=	CurrREc.getValue({
                           fieldId:"custpage_statu_fld"
                       });

                       var getValue	=	CurrREc.getValue({
                           fieldId:"custpage_statu_new"
                       });

                       if(OldValue == getValue){
                           alert("Cannot Select Same VEHICLE STATUS TYPE");

                           CurrREc.setValue({
                               fieldId:"custpage_statu_new",
                               value:""
                           });
                       }
                   }*/

            if(name == "custpage_date"){
                var CDate   =   CurrREc.getValue({fieldId:"custpage_date"});
                var LDate   =   CurrREc.getValue({fieldId:"custpage_l_date"});

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
                        CurrREc.setValue({fieldId:"custpage_date",value:""});
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

            if(name == "custpage_to_subsi"){
                var tosubsi   =   CurrREc.getValue({fieldId:"custpage_to_subsi"});
                var fromSubsi = CurrREc.getValue({fieldId:"custpage_v_old_subsi"});



                var todeptfld = CurrREc.getField({
                    fieldId: 'custpage_to_dep'
                });
                todeptfld.removeSelectOption({
                    value: null,
                });
                todeptfld.insertSelectOption({
                    value: "",
                    text: ""
                });

                var tolocfld = CurrREc.getField({
                    fieldId: 'custpage_to_location'
                });
                tolocfld.removeSelectOption({
                    value: null,
                });
                tolocfld.insertSelectOption({
                    value: "",
                    text: ""
                });
                if(tosubsi){

                    var GetLotData  =   getLocData(tosubsi);
                    var GetDeptData  =   getDeptData(fromSubsi);

                    for(var m=0;m<GetLotData.length;m++){
                        if(GetLotData[m] != null && GetLotData[m] != undefined){
                            var id  =   GetLotData[m].id;
                            var name  =   GetLotData[m].name;
                            tolocfld.insertSelectOption({
                                value: id,
                                text: name
                            });
                        }


                    }

                    for(var m=0;m<GetDeptData.length;m++){
                        if(GetDeptData[m] != null && GetDeptData[m] != undefined){
                            var id  =   GetDeptData[m].id;
                            var name  =   GetDeptData[m].name;
                            todeptfld.insertSelectOption({
                                value: id,
                                text: name
                            });
                        }


                    }
                }


            }
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

        function getLocData(subsiId){
            var lotData =   [];
            var searchl  =   search.create({
                type:"location",
                filters:[
                    ["isinactive","is","F"]
                    ,"AND",
                    ["subsidiary","anyof",subsiId]
                ],
                columns:[search.createColumn({name:"internalid"}),
                    search.createColumn({name:"name"})]

            });
            searchl.run().each(function(result){
                var LotId   =   result.getValue({name:"internalid"});
                var LotN   =   result.getValue({name:"name"});

                var obj =   {};
                obj.id = LotId;
                obj.name = LotN;
                lotData.push(obj);

                return true;
            });

            return lotData;
        }

        function getDeptData(subsiId){
            var lotData =   [];
            var searchl  =   search.create({
                type:"department",
                filters:[
                    ["isinactive","is","F"]
                    ,"AND",
                    ["subsidiary","anyof",subsiId]
                ],
                columns:[search.createColumn({name:"internalid"}),
                    search.createColumn({name:"name"})]

            });
            searchl.run().each(function(result){
                var LotId   =   result.getValue({name:"internalid"});
                var LotN   =   result.getValue({name:"name"});

                var obj =   {};
                obj.id = LotId;
                obj.name = LotN;
                lotData.push(obj);

                return true;
            });

            return lotData;
        }
        return {
//        pageInit: pageInit,
            fieldChanged: fieldChanged,
//        postSourcing: postSourcing,
//        sublistChanged: sublistChanged,
//        lineInit: lineInit,
//        validateField: validateField,
//        validateLine: validateLine,
//        validateInsert: validateInsert,
//        validateDelete: validateDelete,
//        saveRecord: saveRecord,
            getLocData:getLocData,
            getDeptData:getDeptData
        };

    });
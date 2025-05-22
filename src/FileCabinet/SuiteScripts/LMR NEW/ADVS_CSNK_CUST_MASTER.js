/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/runtime', 'N/url', 'N/https', 'N/record',],
    /**
     * @param{currentRecord} currentRecord
     * @param{runtime} runtime
     */
    function (currentRecord, runtime, url, https, record) {

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
			var Mode = scriptContext.mode;
			if(Mode == 'create'){
				var RecObj = scriptContext.currentRecord;
				var FormName = RecObj.getText('customform');
              RecObj.setValue({
						fieldId: "isperson",
						value: "T"
					});
				if(FormName == 'Advs Customer Pop-Up Form'){
					RecObj.setValue('subsidiary','1')//LRM Leasing
				}
			}
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
            var CurrentRecord = scriptContext.currentRecord;
            var CustomerId = CurrentRecord.id;
            var FieldId = scriptContext.fieldId;

          if(CustomerId){
          
            var FirstName = CurrentRecord.getValue({
                fieldId: "firstname"
            });
            var LastName = CurrentRecord.getValue({
                fieldId: "lastname"
            });


            var CustomerName = FirstName + " " + LastName;

            // if (FieldId == "custentity_advs_reg_country") {

            //     var RegiCounty = CurrentRecord.getValue({
            //         fieldId: "custentity_advs_reg_country"
            //     });

            //     if (RegiCounty == 33 || RegiCounty == "33"
            //         || RegiCounty == 47 || RegiCounty == "47"
            //         || RegiCounty == 44 || RegiCounty == "44"
            //         || RegiCounty == 9 || RegiCounty == "9"
            //     ) {
            //         var URL = url.resolveScript({
            //             scriptId: "customscript_advs_ssnk_trkmstr_regtyp_nd",
            //             deploymentId: "customdeploy_advs_ssnk_trkmstr_regtyp_nd",
            //             params: {
            //                 "custparam_custname": CustomerName,
            //                 "custparam_custid": CustomerId,
            //                 "custparam_regicounty": RegiCounty,
            //                 "custparam_flag": "2"
            //             }
            //         });

  //           URL+="&ifrmcntnr=T";
  //   advsObj.injectModal();
	 // advsObj.openpopUpModal(URL,'County-Chnage POpup',500,700);

           
            //     }
            // }
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
			var RecObj = scriptContext.currentRecord;
			var FormName = RecObj.getText('customform');
			if(false){ // FormName == 'Advs Customer Pop-Up Form' //COMMENTING THIS AS WE CREATED MANADATORY CUSTOM FIELDS TO ENTER ADDRESS AND SCRIPT CREATES ADDRESS
				var Address = RecObj.getValue('addressbookaddress_text');
				if(!Address){
					alert('Please add an Address to save the Customer Master');
					return false;
				}
			}
            return true;
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
            saveRecord: saveRecord


        };

    });
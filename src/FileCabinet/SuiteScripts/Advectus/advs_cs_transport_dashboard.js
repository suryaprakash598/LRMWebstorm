/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/search', 'N/url'],
    /**
     * @param{currentRecord} currentRecord
     * @param{record} record
     * @param{search} search
     */
    function (record, runtime, search, url) {

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
            var CurrentRecord = scriptContext.currentRecord;
            var fieldId = scriptContext.fieldId;
            var LineNum = scriptContext.line;

            //advsObj.showProcessingMessage();
            //wrapsublistheaders();
           // advsObj.hideProcessingMessage();

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
            var fieldId = scriptContext.fieldId;
            var name = scriptContext.fieldId;
            if (name == "custpage_tpt_truckstatusf" ||
                name == "custpage_tpt_statusf" ||
                name == "custpage_tpt_flocf" ||
                name == "custpage_tpt_tlocf" ||
                name == "custpage_tpt_stockf"||
                name == "custpage_tpt_excludecomplete"
            ) {
                if(name == "custpage_tpt_excludecomplete")
                {
                    event.stopImmediatePropagation();
                    $("#custpage_sublist_transport_splits tr").filter(function() {
                        if($(this).find("td:contains('In - Transit Closed Out')").length > 0)
                        {
                        $(this).toggle();
                        }
                        return $(this).find("td:contains('In - Transit Closed Out')").length > 0;
                    }); // Example: Highlights rows in light red
                    return true;
                }
                var curRec = scriptContext.currentRecord;
                var paramfilters = curRec.getValue({
                    fieldId: 'custpage_filter_params'
                }) || [];
                var tpttstatus = curRec.getValue({
                    fieldId: 'custpage_tpt_truckstatusf'
                });
                var tptstatus = curRec.getValue({
                    fieldId: 'custpage_tpt_statusf'
                });
                var tptfloc = curRec.getValue({
                    fieldId: 'custpage_tpt_flocf'
                });
                var tpttloc = curRec.getValue({
                    fieldId: 'custpage_tpt_tlocf'
                });
                var tptstock = curRec.getValue({
                    fieldId: 'custpage_tpt_stockf'
                });

                setWindowChanged(window, false);
                document.location = url.resolveScript({
                    scriptId: getParameterFromURL('script'),
                    deploymentId: getParameterFromURL('deploy'),
                    params: {

                        'filters': paramfilters,
                        'tpttstatus': tpttstatus,
                        'tptstatus': tptstatus,
                        'tptfloc': tptfloc,
                        'tpttloc': tpttloc,
                        'tptstock': tptstock

                    }
                });
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

        function redirectToPage(newStartIndex) {

            var url = window.location.href;
            var separator = (url.indexOf('?') > -1) ? '&' : '?';
            window.location.href = url + separator + 'start=' + newStartIndex;
        }

        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };

        function getSuiteletPage(suiteletScriptId, suiteletDeploymentId, pageId) {
            var currenturl = window.location.href;
            console.log('url', url);

            document.location = replaceUrlParam(currenturl, 'page', pageId)
            /*  document.location = url.resolveScript({
                       scriptId : suiteletScriptId,
                           deploymentId : suiteletDeploymentId,
                   params : {
                           'page' : pageId
               }
           }); */
        }

        function replaceUrlParam(url, paramName, paramValue) {
            if (paramValue == null)
                paramValue = '';
            url = url.replace(/\?$/, '');
            var pattern = new RegExp('\\b(' + paramName + '=).*?(&|$)')
            if (url.search(pattern) >= 0) {
                return url.replace(pattern, '$1' + paramValue + '$2');
            }
            return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue
        }


        function getParameterFromURL(param) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == param) {
                    return decodeURIComponent(pair[1]);
                }
            }
            return (false);
        }

        function openfiltersetup(userid) {

            var title = '';
            var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2604&deploy=1&user=' + userid;
            var left = (screen.width / 2) - (500 / 2);
            var top = (screen.height / 2) - (500 / 2);
            var targetWin = window.open(url, title, 'width=900, height=500, top=' + top + ', left=' + left);

        }

        function togglefiltersbwntabs(CurrentRecord) {

            var filtersdata = CurrentRecord.getValue({
                fieldId: 'custpage_filter_params'
            });
            var filtersdataids = getfilters();
            var paramfilters = getUrlParameter("filters") || '[]';
            var _filters = JSON.parse(paramfilters)
            var fdata = JSON.parse(filtersdata);



        }

        function getfilters() {
            var fieldsdata = [];
            /*0*/
            fieldsdata.push('custpage_brand');
            /*1*/
            fieldsdata.push('custpage_vin');
            /*2*/
            fieldsdata.push('custpage_vin_ff');
            /*3*/
            fieldsdata.push('custpage_model');
            /*4*/
            fieldsdata.push('custpage_location');
            /*5*/
            fieldsdata.push('custpage_status');
            /*6*/
            fieldsdata.push('custpage_salesrep_filter'); //6
            /*7*/
            fieldsdata.push('custpage_softhold_status'); //7
            /*8*/
            fieldsdata.push('custpage_mileage'); //8
            /*9*/
            fieldsdata.push('custpage_bucket'); //9
            /*10*/
            fieldsdata.push('custpage_bucket_child'); //10
            /*11*/
            fieldsdata.push('custpage_freq'); //11
            /*12*/
            fieldsdata.push('custpage_repo_vin_fil'); //12
            /*13*/
            fieldsdata.push('custpage_repo_status_fld');
            /*14*/
            fieldsdata.push('custpage_repo_location');
            /*15*/
            fieldsdata.push('custpage_repo_model');
            /*16*/
            fieldsdata.push('custpage_repo_mileage');
            /*17*/
            fieldsdata.push('custpage_repo_company');
            /*18*/
            fieldsdata.push('custpage_repo_dateassigned');
            /*19*/
            fieldsdata.push('custpage_auc_vin');
            /*20*/
            fieldsdata.push('custpage_auc_status');
            /*21*/
            fieldsdata.push('custpage_auc_location');
            /*22*/
            fieldsdata.push('custpage_auc_date');
            /*23*/
            fieldsdata.push('custpage_auc_condition');
            /*24*/
            fieldsdata.push('custpage_auc_cleaned');
            /*25*/
            fieldsdata.push('custpage_db_vin');
            /*26*/
            fieldsdata.push('custpage_db_customer');
            /*27*/
            fieldsdata.push('custpage_db_salesrep');
            /*28*/
            fieldsdata.push('custpage_db_truckready');
            /*29*/
            fieldsdata.push('custpage_db_washed');
            /*30*/
            fieldsdata.push('custpage_db_mcoo');
            /*31*/
            fieldsdata.push('custpage_ins_status');
            /*32*/
            fieldsdata.push('custpage_deposit_filter');
            /*33*/
            fieldsdata.push('custpage_brand');




            return fieldsdata;
        }

        function resetFilters(userid) {
            var data = search.lookupFields({
                type: 'employee',
                id: userid,
                columns: ['custentity_inventory_filters_chosen']
            });
            var indes = JSON.parse(data.custentity_inventory_filters_chosen);
            window.location.href = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2627&deploy=1&whence=&filters=[' + indes + ']';
        }

        function wrapsublistheaders() {
            try {
                $(document).ready(function () {
                    $("#custpage_sublist_splits").each(function () {
                        var table = $(this);
                        table.find(".listheadertd").each(function (index) {
                            var maxWidth = 0;

                            // Loop through each corresponding <td> in the column
                            table.find(".uir-list-row-tr").each(function () {
                                var cell = $(this).find("td").eq(index);
                                var cellWidth = cell.outerWidth();
                                if (cellWidth > maxWidth) {
                                    maxWidth = cellWidth;
                                }
                            });

                            // Apply the max width to the corresponding <th>
                            $(this).css({
                                "max-width": maxWidth + "px",
                                "word-wrap": "break-word",
                                "white-space": "normal" // Allow wrapping
                            });
                        });
                    });
                    $("#custpage_sublist_repo_splits").each(function () {
                        var table = $(this);
                        table.find(".listheadertd").each(function (index) {
                            var maxWidth = 0;

                            // Loop through each corresponding <td> in the column
                            table.find(".uir-list-row-tr").each(function () {
                                var cell = $(this).find("td").eq(index);
                                var cellWidth = cell.outerWidth();
                                if (cellWidth > maxWidth) {
                                    maxWidth = cellWidth;
                                }
                            });

                            // Apply the max width to the corresponding <th>
                            $(this).css({
                                "max-width": maxWidth + "px",
                                "word-wrap": "break-word",
                                "white-space": "normal" // Allow wrapping
                            });
                        });
                    });
                    $("#custpage_sublist_auction_splits").each(function () {
                        var table = $(this);
                        table.find(".listheadertd").each(function (index) {
                            var maxWidth = 0;

                            // Loop through each corresponding <td> in the column
                            table.find(".uir-list-row-tr").each(function () {
                                var cell = $(this).find("td").eq(index);
                                var cellWidth = cell.outerWidth();
                                if (cellWidth > maxWidth) {
                                    maxWidth = cellWidth;
                                }
                            });

                            // Apply the max width to the corresponding <th>
                            $(this).css({
                                "max-width": maxWidth + "px",
                                "word-wrap": "break-word",
                                "white-space": "normal" // Allow wrapping
                            });
                        });
                    });
                    $("#custpage_sublist_auction_splits").each(function () {
                        var table = $(this);
                        table.find(".listheadertd").each(function (index) {
                            var maxWidth = 0;

                            // Loop through each corresponding <td> in the column
                            table.find(".uir-list-row-tr").each(function () {
                                var cell = $(this).find("td").eq(index);
                                var cellWidth = cell.outerWidth();
                                if (cellWidth > maxWidth) {
                                    maxWidth = cellWidth;
                                }
                            });

                            // Apply the max width to the corresponding <th>
                            $(this).css({
                                "max-width": maxWidth + "px",
                                "word-wrap": "break-word",
                                "white-space": "normal" // Allow wrapping
                            });
                        });
                    });
                    $("#custpage_sublist_deposit_delivery_splits").each(function () {
                        var table = $(this);
                        table.find(".listheadertd").each(function (index) {
                            var maxWidth = 0;

                            // Loop through each corresponding <td> in the column
                            table.find(".uir-list-row-tr").each(function () {
                                var cell = $(this).find("td").eq(index);
                                var cellWidth = cell.outerWidth();
                                if (cellWidth > maxWidth) {
                                    maxWidth = cellWidth;
                                }
                            });

                            // Apply the max width to the corresponding <th>
                            $(this).css({
                                "max-width": maxWidth + "px",
                                "word-wrap": "break-word",
                                "white-space": "normal" // Allow wrapping
                            });
                        });
                    });
                    $("#custpage_sublist_custpage_subtab_insur_claim_splits").each(function () {
                        var table = $(this);
                        table.find(".listheadertd").each(function (index) {
                            var maxWidth = 0;

                            // Loop through each corresponding <td> in the column
                            table.find(".uir-list-row-tr").each(function () {
                                var cell = $(this).find("td").eq(index);
                                var cellWidth = cell.outerWidth();
                                if (cellWidth > maxWidth) {
                                    maxWidth = cellWidth;
                                }
                            });

                            // Apply the max width to the corresponding <th>
                            $(this).css({
                                "max-width": maxWidth + "px",
                                "word-wrap": "break-word",
                                "white-space": "normal" // Allow wrapping
                            });
                        });
                    });
                });
            } catch (e) {
                log.debug('error', e.toString());
            }
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
            // saveRecord: saveRecord,
            openfiltersetup: openfiltersetup,
            resetFilters: resetFilters,
        };

    });
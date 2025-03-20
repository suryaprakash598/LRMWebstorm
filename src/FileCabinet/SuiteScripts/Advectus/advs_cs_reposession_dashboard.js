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
            try{
                var name = scriptContext.fieldId;
                if( name == "custpage_repo_destination" || name == "custpage_repo_collections" || name == "custpage_repo_year"|| name == "custpage_repo_stock"|| name == "custpage_repo_lessee"|| name == "custpage_repo_dateassigned"|| name == "custpage_repo_company"
                    || name == "custpage_repo_mileage"|| name == "custpage_repo_model"|| name == "custpage_repo_location"
                    || name == "custpage_repo_status_fld" || name == "custpage_repo_vin")

                {
                    var curRec = scriptContext.currentRecord;
                    var paramfilters = curRec.getValue({fieldId: 'custpage_filter_params'});

                    var Repostatus  =  curRec.getValue({fieldId: 'custpage_repo_status_fld'});
                    var RepoVin     =  curRec.getValue({fieldId: 'custpage_repo_vin'});
                    var RepoLoc     =  curRec.getValue({fieldId: 'custpage_repo_location'});
                    var RepoModel   =  curRec.getValue({fieldId: 'custpage_repo_model'});
                    var RepoMileage =  curRec.getValue({fieldId: 'custpage_repo_mileage'});
                    var RepoCompany =  curRec.getValue({fieldId: 'custpage_repo_company'});
                    var RepoDate    =  curRec.getValue({fieldId: 'custpage_repo_dateassigned'});

                    var Repocust    =  curRec.getValue({fieldId: 'custpage_repo_lessee'});
                    var Repostock    =  curRec.getValue({fieldId: 'custpage_repo_stock'});
                    var Repoyear    =  curRec.getValue({fieldId: 'custpage_repo_year'});
                    var Repocollec    =  curRec.getValue({fieldId: 'custpage_repo_collections'});
                    var Repodest    =  curRec.getValue({fieldId: 'custpage_repo_destination'});


                    setWindowChanged(window, false);
                    document.location = url.resolveScript({
                        scriptId: getParameterFromURL('script'),
                        deploymentId: getParameterFromURL('deploy'),
                        params: {
                            'filters':paramfilters,
                            'repo_sts':Repostatus,
                            'repo_vin':RepoVin   ,
                            'repo_loc':RepoLoc        ,
                            'repo_model':RepoModel         ,
                            'repo_mil':RepoMileage       ,
                            'repo_com':RepoCompany       ,
                            'repo_date':RepoDate          ,
                            'repo_cust':Repocust          ,
                            'repo_stock':Repostock          ,
                            'repo_year':Repoyear          ,
                            'repo_collec':Repocollec          ,
                            'repo_dest':Repodest

                        }
                    });
                }


            }catch (e)
            {
                log.debug('error',e.toString());
            }

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
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged
        };

    });
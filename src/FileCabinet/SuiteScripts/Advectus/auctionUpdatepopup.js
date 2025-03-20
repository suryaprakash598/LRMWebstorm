/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url','N/https'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (record, runtime, search, serverWidget, url,https) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            var request = scriptContext.request;
            var response = scriptContext.response;

            if (request.method == "GET") {
                var form = serverWidget.createForm({
                    title: "Auction",
                    hideNavBar: true
                });

                form.clientScriptModulePath =   "./advs_cs_action_popup.js"
                var currScriptObj = runtime.getCurrentScript();
                //https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1643&deploy=1&stock=66&unitvin=5203&ofrstatus=1&ofrdate=5/8/2024

                var auctionId = request.parameters.repo || '';
                var dataobj;
                if (auctionId) {
                    dataobj = ofrData(auctionId);
                }
                var scriptId = currScriptObj.id;
                var deploymentId = currScriptObj.deploymentId;
                //Check title restriction in vehicle master
                var vinId = dataobj[0].vin
                var vinFields = search.lookupFields({
                    type: 'customrecord_advs_vm',
                    id: vinId,
                    columns: ['custrecord_advs_title_rest_ms_tm']
                });

                var titleRestricted = vinFields.custrecord_advs_title_rest_ms_tm
                log.debug("scriptId", scriptId + "=>" + deploymentId + ' vinId ' + vinId + 'titleRestricted' + JSON.stringify(titleRestricted));

                var aLocFldsObject = form.addField({id: "custpage_locations", type: serverWidget.FieldType.SELECT, label: "Auction Location", source: "customrecord_advs_auction_loc"});
                aLocFldsObject.defaultValue=dataobj[0].aulocations;

                var truckstatusFldObj = form.addField({id: "custpage_auction_truckstatus", type: serverWidget.FieldType.SELECT, label: "Truck Status", source: "customlist_advs_reservation_status"})
                    .defaultValue=dataobj[0].truckmasterstatus;
					
				var statusFldObj = form.addField({id: "custpage_status", type: serverWidget.FieldType.SELECT, label: "Status", source: "customrecord_auction_status"})
                    .defaultValue=dataobj[0].austatus;

                var vinObject = form.addField({id: "custpage_vin", type: serverWidget.FieldType.SELECT, label: "Stock #", source: "customrecord_advs_vm"});
                vinObject.defaultValue=dataobj[0].vin;
                vinObject.updateDisplayType({displayType : serverWidget.FieldDisplayType.INLINE});

                var dateFldObj = form.addField({id: "custpage_date_auction", type: serverWidget.FieldType.DATE, label: "Auction Date"
                }).defaultValue=dataobj[0].audate

                var dateActionFldObj = form.addField({id: "custpage_till_date_auction", type: serverWidget.FieldType.INTEGER, label: "Days Till Action"
                })

                if(dataobj[0].daystillaction){
                    dateActionFldObj.defaultValue=dataobj[0].daystillaction
                }
                dateActionFldObj.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.DISABLED
                });

                var locationOfUnit = form.addField({id: "custpage_location_of_unit", type: serverWidget.FieldType.TEXT, label: "Location of Unit"
                }).defaultValue=dataobj[0].locationofunit

                var runnerCondition = form.addField({id: "custpage_runner_condition", type: serverWidget.FieldType.SELECT, label: "Condition", source:"customlist_advs_cond_list"
                }).defaultValue=dataobj[0].condition

                var acodesFldObj = form.addField({id: "custpage_active_codes", type: serverWidget.FieldType.SELECT, label: "Active Codes", source:"customlist_advs_active_code_list"
                }).defaultValue=dataobj[0].aucodes

                var cleanedFldObj = form.addField({id: "custpage_cleaned", type: serverWidget.FieldType.SELECT, label: "Cleaned", source:"customlist_advs_cleaned_list"
                }).defaultValue=dataobj[0].aucleaned

                var hasKeyFldObj = form.addField({id: "custpage_has_key", type: serverWidget.FieldType.SELECT, label: "Has Key", source:"customlist_advs_has_key_list"
                }).defaultValue=dataobj[0].haskey

                var conSignedFldObj = form.addField({id: "custpage_cont_signed", type: serverWidget.FieldType.SELECT, label: "Contract Signed", source:"customlist_advs_cont_sign_list"
                }).defaultValue=dataobj[0].issigned

                var titleRestFldObj = form.addField({id: "custpage_title_restriction", type: serverWidget.FieldType.SELECT, label: "Title Restricted", source:"customlist_advs_title_restriction_list"
                })
                titleRestFldObj.defaultValue=titleRestricted[0].value
                titleRestFldObj.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.INLINE
                });

                var titleFldObj = form.addField({id: "custpage_title_sent", type: serverWidget.FieldType.SELECT, label: "Title Sent", source:"customlist_advs_title_sent_list"
                }).defaultValue=dataobj[0].autitlesent

                var notesFldObj = form.addField({id: "custpage_auction_notes", type: serverWidget.FieldType.TEXTAREA, label: "Notes"
                }).defaultValue=dataobj[0].aunotes;

                var  aLocFldObj= form.addField({id: "custpage_location", type: serverWidget.FieldType.SELECT, label: "Auction Location", source: "location"
                })
                aLocFldObj.defaultValue=dataobj[0].aulocation;
                aLocFldObj.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.INLINE
                });
                //Hidden object are moved to bottom to be used later

                var repoFldObj = form.addField({id: "custpage_auction", type: serverWidget.FieldType.TEXT, label: "Auction"})//
                repoFldObj.defaultValue=auctionId;
                repoFldObj.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.HIDDEN
                });

                var nameFldObj = form.addField({id: "custpage_name", type: serverWidget.FieldType.TEXT, label: "Auction Name"})
                nameFldObj.defaultValue=dataobj[0].name;
                nameFldObj.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN})

                var runnerFldObj = form.addField({id: "custpage_runner", type: serverWidget.FieldType.CHECKBOX, label: "Runner"
                })
                runnerFldObj.defaultValue=dataobj[0].aurunner
                runnerFldObj.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.HIDDEN
                });

                var startsFldObj = form.addField({id: "custpage_starts", type: serverWidget.FieldType.TEXT, label: "Starts"
                })

                startsFldObj.defaultValue=dataobj[0].austarts
                startsFldObj.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.HIDDEN
                });

                var drivesFldObj = form.addField({id: "custpage_drives", type: serverWidget.FieldType.TEXT, label: "Drives"
                })
                drivesFldObj.defaultValue=dataobj[0].audrives
                drivesFldObj.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.HIDDEN
                });


                form.addSubmitButton('Update');
                response.writePage(form);
            }else{
                var auctionid = scriptContext.request.parameters.custpage_auction;
                var aname = scriptContext.request.parameters.custpage_name;
                var adate = scriptContext.request.parameters.custpage_date_auction;
                var astatus = scriptContext.request.parameters.custpage_status;
                var atruckstatus = scriptContext.request.parameters.custpage_auction_truckstatus;
                var alocation = scriptContext.request.parameters.custpage_location;
                var alocations = scriptContext.request.parameters.custpage_locations;
                log.debug(' alocations ' , alocations +'alocations' + alocations)
                var astarts = scriptContext.request.parameters.custpage_starts;
                var adrives = scriptContext.request.parameters.custpage_drives;
                var acodes = scriptContext.request.parameters.custpage_active_codes;
                var anotes = scriptContext.request.parameters.custpage_auction_notes;
                var arunner = scriptContext.request.parameters.custpage_runner;
                var acleaned = scriptContext.request.parameters.custpage_cleaned;
                var atitlesent = scriptContext.request.parameters.custpage_title_sent;
                var daystillaction = scriptContext.request.parameters.custpage_till_date_auction
                var locationofunit = scriptContext.request.parameters.custpage_location_of_unit
                var runnercondition = scriptContext.request.parameters.custpage_runner_condition
                var haskey = scriptContext.request.parameters.custpage_has_key
                var consigned =  scriptContext.request.parameters.custpage_cont_signed
                var titlerestriction = scriptContext.request.parameters.custpage_title_restriction
                var vinid = scriptContext.request.parameters.custpage_vin

                log.debug('auctionid',auctionid);
                var objj={
                    custrecord_auction_name:aname,
                    custrecord_auction_status:astatus,
                    custrecord_data_of_auction:adate,
                    custrecord_auction_location:alocation,
                    custrecord_advs_auc_loc_veh:alocations,
                    custrecord_auction_starts:astarts,
                    custrecord_auction_drives:adrives,
                    custrecord_auction_active_codes:acodes,
                    custrecord_auction_runner:arunner,
                    custrecord_auction_cleaned:acleaned,
                    custrecord_auction_title_sent:atitlesent,
                    custrecord_auction_notes:anotes,
                    custrecord_advs_days_till_auct:daystillaction,
                    custrecord_advs_loc_unit:locationofunit,
                    custrecord_advs_cond_:runnercondition,
                    custrecord_advs_has_key:haskey,
                    custrecord_advs_cont_sgined:consigned,
                    custrecord_advs_title_res_auct:titlerestriction

                };
                log.debug('objj',objj);
                try{
                    var recid = record.submitFields({type:'customrecord_advs_vehicle_auction',id:auctionid,values:
                        objj,
                        options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
						if(vinid){
							record.submitFields({type:'customrecord_advs_vm',id:vinid,values:{custrecord_advs_vm_reservation_status:atruckstatus},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
						}
                }catch(e)
                {
                    log.debug('error',e.toString());
                }


                var onclickScript=" <html><body> <script type='text/javascript'>" +
                    "try{debugger;" ;
                //onclickScript+="window.parent.getActive();";
                onclickScript+="window.opener.location.reload();";
                
                onclickScript+="window.close();;";
                onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";
                scriptContext.response.write(onclickScript);


            }
        }

        function ofrData(auctionid) {
            var customrecord_lms_ofr_SearchObj = search.create({
                type: "customrecord_advs_vehicle_auction",
                filters:
                    [
                        ["internalid", "anyof", auctionid]
                    ],
                columns:
                    [
                        "custrecord_auction_name",
                        "custrecord_auction_status",
                        "custrecord_data_of_auction",
                        "custrecord_auction_location",
                        "custrecord_auction_starts",
                        "custrecord_auction_drives",
                        "custrecord_auction_active_codes",
                        "custrecord_auction_runner",
                        "custrecord_auction_cleaned",
                        "custrecord_auction_title_sent",
                        "custrecord_auction_notes",
                        "custrecord_auction_vin",
                        "custrecord_advs_days_till_auct",
                        "custrecord_advs_has_key",
                        "custrecord_advs_cont_sgined",
                        "custrecord_advs_title_res_auct",
                        "custrecord_advs_loc_unit",
                        "custrecord_advs_cond_",
                        "custrecord_advs_auc_loc_veh",
						search.createColumn({
                  name: "custrecord_advs_vm_reservation_status",
                  join: "custrecord_auction_vin"
                })
                    ]
            });
            var searchResultCount = customrecord_lms_ofr_SearchObj.runPaged().count;
            var arr = [];
            customrecord_lms_ofr_SearchObj.run().each(function (result) {
                // .run().each has a limit of 4,000 results
                var obj = {};
                obj.name = result.getValue({name: 'custrecord_auction_name'})
                obj.auid = result.getValue({name: 'internalid'})
                obj.austatus = result.getValue({name: 'custrecord_auction_status'})
                obj.audate = result.getValue({name: 'custrecord_data_of_auction'})
                obj.aulocation = result.getValue({name: 'custrecord_auction_location'})
                obj.aulocations = result.getValue({name: 'custrecord_advs_auc_loc_veh'})
                obj.austarts = result.getValue({name: 'custrecord_auction_starts'})
                obj.audrives = result.getValue({name: 'custrecord_auction_drives'})
                obj.aucodes = result.getValue({name: 'custrecord_auction_active_codes'})
                obj.aurunner = result.getValue({name: 'custrecord_auction_runner'})
                obj.aucleaned = result.getValue({name: 'custrecord_auction_cleaned'})
                obj.autitlesent = result.getValue({name: 'custrecord_auction_title_sent'})
                obj.aunotes = result.getValue({name: 'custrecord_auction_notes'})
                obj.vin = result.getValue({name: 'custrecord_auction_vin'})
                obj.daystillaction = result.getValue({name: 'custrecord_advs_days_till_auct'})
                obj.haskey = result.getValue({name: 'custrecord_advs_has_key'})
                obj.issigned = result.getValue({name: 'custrecord_advs_cont_sgined'})
                obj.titlerestriction = result.getValue({name: 'custrecord_advs_title_res_auct'})
                obj.locationofunit = result.getValue({name: 'custrecord_advs_loc_unit'})
                obj.condition = result.getValue({name:'custrecord_advs_cond_'})
                obj.truckmasterstatus = result.getValue({
                  name: "custrecord_advs_vm_reservation_status",
                  join: "custrecord_auction_vin"
                })

                if( obj.aurunner ==false){ obj.aurunner ='F'}else if(obj.aurunner ==true){obj.aurunner ='T'}

                if( obj.aucleaned ==false){ obj.aucleaned ='F'}else if(obj.aucleaned ==true){obj.aucleaned ='T'}

                if( obj.autitlesent ==false){ obj.autitlesent ='F'}else if(obj.autitlesent ==true){obj.autitlesent ='T'}

                arr.push(obj);
                return true;
            });

            return arr;
        }

        return {
            onRequest
        }

    });
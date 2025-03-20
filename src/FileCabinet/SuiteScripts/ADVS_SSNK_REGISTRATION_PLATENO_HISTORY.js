/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/format'],
    /**
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (runtime, search, serverWidget, url, format) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (context) => {
            var Request = context.request;
            var Response = context.response;

            if (Request.method == "GET") {

                var form = serverWidget.createForm({
                    title: "History"
                });

                var LeaseId = Request.parameters.custparam_leaseid;

                log.error("LeaseId-> ", LeaseId);

                form.addSubtab({
                    id: 'custpage_tab_history',
                    label: " "
                });

                var SublistObj = form.addSublist({
                    id: 'custpage_sublist',
                    label: ' ',
                    tab: 'custpage_tab_history',
                    type: serverWidget.SublistType.LIST
                });

                var FillBy = SublistObj.addField({
                    id: 'custpage_plate_fill_by',
                    label: 'Plate Fill By',
                    type: serverWidget.FieldType.SELECT,
                    source: 'employee'
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.INLINE
                });

                var OldPlate = SublistObj.addField({
                    id: 'custpage_old_plate_no',
                    label: 'Old Plate',
                    type: serverWidget.FieldType.TEXT
                });
                var NewPlate = SublistObj.addField({
                    id: 'custpage_new_plate_no',
                    label: 'New Plate',
                    type: serverWidget.FieldType.TEXT
                });
                var FillDate = SublistObj.addField({
                    id: 'custpage_plate_fill_date',
                    label: 'Fill Date',
                    type: serverWidget.FieldType.TEXT
                });

                if (LeaseId) {
                    var customrecord_advs_lease_headerSearchObj = search.create({
                        type: "customrecord_advs_lease_header",
                        filters:
                            [
                                ["isinactive", "is", "F"],
                                "AND",
                                ["internalid", "anyof", LeaseId]
                            ],
                        columns:
                            [
                                search.createColumn({ name: "name", label: "ID" }),
                                search.createColumn({ name: "custrecord_advs_la_vin_bodyfld", label: "VIN" }),
                                search.createColumn({ name: "custrecord_advs_l_plate_filled_by", label: "Plate Filled by" }),
                                search.createColumn({ name: "custrecord_advs_l_plate_filled_date", label: "Plate filled date" }),
                                search.createColumn({ name: "custrecordadvs_l_old_plate_no", label: "Old plate No" }),
                                search.createColumn({ name: "custrecord_advs_l_h_veh_plate", label: "New plate No" })
                            ]
                    });
                    var count = 0;
                    customrecord_advs_lease_headerSearchObj.run().each(function (result) {

                        var FilledBy = result.getValue({
                            name: "custrecord_advs_l_plate_filled_by"
                        });
                        var OldPlateNo = result.getValue({
                            name: "custrecordadvs_l_old_plate_no"
                        });
                        var FilledDate = result.getValue({
                            name: "custrecord_advs_l_plate_filled_date"
                        });
                        var NewPlate = result.getValue({
                            name: "custrecord_advs_l_h_veh_plate"
                        });

                        if (FilledBy) {
                            SublistObj.setSublistValue({
                                id: "custpage_plate_fill_by",
                                line: count,
                                value: FilledBy
                            });
                        }
                        SublistObj.setSublistValue({
                            id: "custpage_old_plate_no",
                            line: count,
                            value: OldPlateNo || " "
                        });
                        SublistObj.setSublistValue({
                            id: "custpage_new_plate_no",
                            line: count,
                            value: NewPlate || " "
                        });
                        SublistObj.setSublistValue({
                            id: "custpage_plate_fill_date",
                            line: count,
                            value: FilledDate || " "
                        });

                        count++;
                        return true;
                    });
                }


                Response.writePage(form);
            }

        }

        return {
            onRequest
        }


    });
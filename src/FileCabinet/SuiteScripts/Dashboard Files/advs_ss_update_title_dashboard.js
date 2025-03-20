/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/format','N/record','N/file'],
    /**
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    (runtime, search, serverWidget, url, format, record,file) => {
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

                var form = serverWidget.createForm({title: "Edit Title Dashboard"})

                var recordId = request.parameters.custparam_id;
                var titleObject = getTitleObject(recordId)

                // Add form fields
                var internalId = form.addField({id: 'custpage_title_id', type: serverWidget.FieldType.SELECT, label: 'Title Id', source:"customrecord_advs_title_dashboard"});
                internalId.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE});
                internalId.defaultValue= titleObject.internalId

                var custrecord_advs_td_catalog_number = form.addField({id: 'custpage_title_catnumber', type: serverWidget.FieldType.TEXT, label: 'Catalog Number'});
                custrecord_advs_td_catalog_number.defaultValue= titleObject.custrecord_advs_td_catalog_number
                custrecord_advs_td_catalog_number.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE});

                var custrecord_advs_td_title_received = form.addField({id: 'custpage_title_received', type: serverWidget.FieldType.CHECKBOX, label: 'Title Received'});
                custrecord_advs_td_title_received.defaultValue= titleObject.custrecord_advs_td_title_received? 'T' : 'F'

                var custrecord_advs_td_active_transfer = form.addField({id: 'custpage_title_transfer', type: serverWidget.FieldType.SELECT, label: 'Title Transfer',source:"customlist_advs_act_trn_list"})
                custrecord_advs_td_active_transfer.defaultValue= titleObject.custrecord_advs_td_active_transfer

                var custrecord_advs_td_date_sent_to_agency = form.addField({id: 'custpage_title_sent_to_agency_date', type: serverWidget.FieldType.DATE, label: 'Date Sent To Agency'})
                custrecord_advs_td_date_sent_to_agency.defaultValue= titleObject.custrecord_advs_td_date_sent_to_agency

                var custrecord_advs_td_state_restriction = form.addField({id: 'custpage_title_state_restriction', type: serverWidget.FieldType.SELECT, label: 'State Restriction' ,source:"customlist_advs_title_restriction_list"})
                custrecord_advs_td_state_restriction.defaultValue= titleObject.custrecord_advs_td_state_restriction

                var custrecord_advs_td_lien = form.addField({id: 'custpage_title_lien', type: serverWidget.FieldType.SELECT, label: 'Lien', source:"customlist_advs_title_lien"})
                custrecord_advs_td_lien.defaultValue= titleObject.custrecord_advs_td_lien

                var custrecord_advs_td_title_state = form.addField({id: 'custpage_title_state', type: serverWidget.FieldType.SELECT, label: 'State',source:"state"})
                custrecord_advs_td_title_state.defaultValue= titleObject.custrecord_advs_td_title_state

                var custrecord_advs_td_vin = form.addField({id: 'custpage_title_vin', type: serverWidget.FieldType.SELECT, label: 'VIN',source:"customrecord_advs_vm"})
                custrecord_advs_td_vin.defaultValue= titleObject.custrecord_advs_td_vin
                custrecord_advs_td_vin.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE});

                var custrecord_advs_td_active_asset = form.addField({id: 'custpage_title_activeasset', type: serverWidget.FieldType.SELECT, label: 'Active Asset', source:"customlist_advs_active_asset"})
                custrecord_advs_td_active_asset.defaultValue= titleObject.custrecord_advs_td_active_asset

                var custrecord_advs_td_type_of_sale = form.addField({id: 'custpage_title_typeofsale', type: serverWidget.FieldType.SELECT, label: 'Type Of Sale',source:"customlist_advs_type_of_sales_advs"})
                custrecord_advs_td_type_of_sale.defaultValue= titleObject.custrecord_advs_td_type_of_sale

                var custrecord_advs_date_title_sent = form.addField({id: 'custpage_title_sent_date', type: serverWidget.FieldType.DATE, label: 'Date Title Sent'})
                custrecord_advs_date_title_sent.defaultValue= titleObject.custrecord_advs_date_title_sent

                var custrecord_advs_method_of_shipment = form.addField({id: 'custpage_title_ship_method', type: serverWidget.FieldType.SELECT, label: 'Ship Method',source:"customlist_advs_method_of_shipment"})
                custrecord_advs_method_of_shipment.defaultValue= titleObject.custrecord_advs_method_of_shipment

                var custrecord_advs_td_notes = form.addField({id: 'custpage_title_notes', type: serverWidget.FieldType.TEXT, label: 'Title Notes'})
                custrecord_advs_td_notes.defaultValue= titleObject.custrecord_advs_td_notes

                form.addTab({
                    id: 'custpage_file_upload_tab',
                    label: 'File Uploads'
                });

                var fileUpload = form.addField({
                    id: 'custpage_file_upload',
                    type: serverWidget.FieldType.FILE,
                    label: 'Upload Image or PDF'
                });

                var SublistObj = populateNotesSublist(form);
                populateNotesData(SublistObj,recordId);

                var systemNotesObject = populateSystemNoteSublist(form);
                populateSystemNotesData(systemNotesObject,recordId);

                var documentObject = populateDocumentSublist(form);
                populateDocumentSublistData(documentObject, recordId, file)

                form.addSubmitButton({label: 'Submit'});
                response.writePage(form)
            }else{
                var internalId = request.parameters.custpage_title_id
                var vinId = request.parameters.custpage_title_vin
                var titleReceived = request.parameters.custpage_title_received
                var uploadedFile = request.files.custpage_file_upload;

                log.debug(' VIN Id ' , vinId + ' received from custpage_title_id ' + titleReceived + ' for Id ' +internalId)

                var LineCount = scriptContext.request.getLineCount({
                    group: "custpage_notes_sublist"
                });
                var SublistId = 'custpage_notes_sublist';
                var childRec = 'recmachcustrecord_advs_title_parent_link';

                try {
                    if(internalId!=''){
                        var objRecord =  record.load({type:'customrecord_advs_title_dashboard',id:internalId,isDynamic:!0});
                    }else{
                        var objRecord =  record.create({type:'customrecord_advs_title_dashboard',isDynamic:!0});
                    }
                    var titleReceived = false

                    if(request.parameters.custpage_title_received == 'T'){
                        titleReceived = true;
                    }

                    objRecord.setValue({fieldId:'custrecord_advs_td_title_received',value:titleReceived,ignoreFieldChange:true});
                    objRecord.setValue({fieldId:'custrecord_advs_td_active_transfer',value:request.parameters.custpage_title_transfer,ignoreFieldChange:true});
                    objRecord.setText({fieldId:'custrecord_advs_td_date_sent_to_agency',text:request.parameters.custpage_title_sent_to_agency_date,ignoreFieldChange:true});
                    objRecord.setValue({fieldId:'custrecord_advs_td_state_restriction',value:request.parameters.custpage_title_state_restriction,ignoreFieldChange:true});
                    objRecord.setValue({fieldId:'custrecord_advs_td_lien',value:request.parameters.custpage_title_lien,ignoreFieldChange:true});
                    objRecord.setValue({fieldId:'custrecord_advs_td_title_state',value:request.parameters.custpage_title_state,ignoreFieldChange:true});
                    objRecord.setValue({fieldId:'custrecord_advs_td_active_asset',value:request.parameters.custpage_title_activeasset,ignoreFieldChange:true});
                    objRecord.setValue({fieldId:'custrecord_advs_td_type_of_sale',value:request.parameters.custpage_title_typeofsale,ignoreFieldChange:true});
                    objRecord.setText({fieldId:'custrecord_advs_date_title_sent',text:request.parameters.custpage_title_sent_date,ignoreFieldChange:true});
                    objRecord.setValue({fieldId:'custrecord_advs_method_of_shipment',value:request.parameters.custpage_title_ship_method,ignoreFieldChange:true});
                    objRecord.setValue({fieldId:'custrecord_advs_td_notes',value:request.parameters.custpage_title_notes,ignoreFieldChange:true});

                    var childLineCount = objRecord.getLineCount(childRec);

                    if(childLineCount > 0){
                        for(var j=childLineCount-1;j>=0;j--){
                            objRecord.removeLine({
                                sublistId: childRec,
                                line: j,
                            });
                        }
                    }

                    if(LineCount > 0){
                        for(var k=0;k<LineCount;k++){
                            var DateTime = scriptContext.request.getSublistValue({
                                group: SublistId,
                                name: 'custsublist_date',
                                line: k,
                            });
                            var Notes = scriptContext.request.getSublistValue({
                                group: SublistId,
                                name: 'custsublist_notes',
                                line: k,
                            });
                            if(DateTime && Notes){
                                objRecord.selectNewLine({
                                    sublistId: childRec
                                });
                                objRecord.setCurrentSublistValue({
                                    sublistId: childRec,
                                    fieldId: 'custrecord_advs_title_date_time',
                                    value: DateTime
                                })	;
                                objRecord.setCurrentSublistValue({
                                    sublistId: childRec,
                                    fieldId: 'custrecord_advs_title_notes',
                                    value: Notes
                                })	;

                                log.debug(' childRec ' , childRec + ' DateTime '  +DateTime + ' Notes '  +Notes)
                                objRecord.commitLine({ sublistId: childRec });
                            }
                        }
                    }
                    var title_id = objRecord.save()
                    log.debug(' title_id '+title_id)

                    if(title_id){
                        log.debug('vinId ' , vinId)
                        record.submitFields({
                            type:'customrecord_advs_vm',
                            id: vinId,
                            values: {
                                custrecord_advs_vm_is_title_recieved: titleReceived
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });

                    }

                    log.debug(' Uploaded File ' , uploadedFile)

                    if (uploadedFile) {
                        var folderId = 1600;
                        try {

                            var fileType = uploadedFile.fileType
                            log.debug(' Uploaded fileType ' , fileType)

                            if (fileType == 'pdf' || fileType == 'PDF') {
                                var fileObj = file.create({
                                    name: uploadedFile.name,
                                    fileType: file.Type.PDF,
                                    contents: uploadedFile.getContents(),
                                    folder: folderId
                                });

                                var fileId = fileObj.save();
                                log.debug('PDF File uploaded successfully. File ID: ' + fileId);
                                //Create record
                                var newRecord = record.create({type: 'customrecord_advs_title_doc_image', isDynamic: true});
                                newRecord.setValue({fieldId: 'custrecord_advs_doc', value: fileId});
                                newRecord.setValue({fieldId: 'custrecord_advs_title_parent_link1', value: title_id});
                                var createdRecordId = newRecord.save();
                                log.debug('Record Created', 'New record ID: ' + createdRecordId);
                            } else if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'JPGIMAGE') {
                                log.debug('Image File uploading... ')

                                var fileObj = file.create({
                                    name: uploadedFile.name,
                                    fileType: file.Type.JPGIMAGE,
                                    contents: uploadedFile.getContents(),
                                    folder: folderId,
                                    isOnline: true
                                });

                                var fileId = fileObj.save();
                                log.debug('Image File uploaded successfully. File ID: ' + fileId);
                                //Create record
                                var newRecord = record.create({type: 'customrecord_advs_title_doc_image', isDynamic: true});
                                newRecord.setValue({fieldId: 'custrecord_advs_image', value: fileId});
                                newRecord.setValue({fieldId: 'custrecord_advs_title_parent_link1', value: title_id});
                                var createdRecordId = newRecord.save();
                                log.debug('Record Created', 'New record ID: ' + createdRecordId);
                            } else {
                                throw new Error('Unsupported file type: ' + fileType);
                            }
                        } catch (e) {
                            log.error({
                                title: 'Error uploading file',
                                details: e
                            });
                        }
                    }

                    log.debug({title: 'Custom Record Updated', details: 'Record ID: ' + title_id});

                    var onclickScript=" <html><body> <script type='text/javascript'>" +
                        "try{debugger;" ;
                    onclickScript+="window.opener.location.reload();";
                    onclickScript+="window.close();;";
                    onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";
                    response.write(onclickScript);

                } catch (e) {
                    log.error({title: 'Error Updating Record', details: e.message});
                    response.write('Error updating the record.');
                }
            }

            function populateNotesSublist(form){

                var SublistObj = form.addSublist({
                    id: 'custpage_notes_sublist',
                    type: serverWidget.SublistType.INLINEEDITOR,
                    label: 'User Notes'
                });
                SublistObj.addField({
                    id: 'custsublist_date',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Date & Time'
                });
                SublistObj.addField({
                    id: 'custsublist_notes',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'Notes'
                });
                SublistObj.addField({
                    id: 'custsublist_record_id',
                    type: serverWidget.FieldType.SELECT,
                    source: 'customrecord_advs_title_dashboard',
                    label: 'RECORD Id'
                }).updateDisplayType({ displayType: "hidden" });
                return SublistObj;
            }

            function populateNotesData(SublistObj,titleId) {
                var Line = 0;
                var CurDate = new Date();
                var hours = CurDate.getHours(); // 0-23
                var minutes = CurDate.getMinutes(); // 0-59
                var seconds = CurDate.getSeconds(); // 0-59
                var timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                var DateValue = format.format({
                    value: CurDate,
                    type: format.Type.DATE
                })
                var dateTimeValue = DateValue+' '+timeString;
                if (titleId){
                    var SearchObj = search.create({
                        type: 'customrecord_advs_title_notes',
                        filters: [
                            ['isinactive', 'is', 'F'],
                            'AND',
                            ['custrecord_advs_title_parent_link', 'anyof', titleId]
                        ],
                        columns: [
                            'custrecord_advs_title_date_time',
                            'custrecord_advs_title_notes'
                        ]
                    });
                    SearchObj.run().each(function (result) {
                        SublistObj.setSublistValue({
                            id: "custsublist_date",
                            line: Line,
                            value: result.getValue('custrecord_advs_title_date_time') || ' '
                        });
                        SublistObj.setSublistValue({
                            id: "custsublist_notes",
                            line: Line,
                            value: result.getValue('custrecord_advs_title_notes') || ' '
                        });
                        SublistObj.setSublistValue({
                            id: "custsublist_record_id",
                            line: Line,
                            value: result.id
                        });
                        Line++;
                        return true;
                    });
                }
                SublistObj.setSublistValue({
                    id: "custsublist_date",
                    line: Line,
                    value: dateTimeValue
                });
            }

            function getTitleObject(id){
                var customrecord_advs_title_dashboardSearchObj = search.create({
                    type: "customrecord_advs_title_dashboard",
                    filters:
                        [
                            ["isinactive","is","F"],
                            "AND",
                            ["internalid","anyof",id]
                        ],
                    columns:
                        [
                            search.createColumn({name: "internalid"}),
                            search.createColumn({name: "custrecord_advs_td_catalog_number"}),
                            search.createColumn({name: "custrecord_advs_td_title_received"}),
                            search.createColumn({name: "custrecord_advs_td_active_transfer"}),
                            search.createColumn({name: "custrecord_advs_td_date_sent_to_agency"}),
                            search.createColumn({name: "custrecord_advs_td_state_restriction"}),
                            search.createColumn({name: "custrecord_advs_td_lien"}),
                            search.createColumn({name: "custrecord_advs_td_title_state"}),
                            search.createColumn({name: "custrecord_advs_td_vin"}),
                            search.createColumn({name: "custrecord_advs_td_active_asset"}),
                            search.createColumn({name: "custrecord_advs_td_type_of_sale"}),
                            search.createColumn({name: "custrecord_advs_date_title_sent"}),
                            search.createColumn({name: "custrecord_advs_method_of_shipment"}),
                            search.createColumn({name: "custrecord_advs_td_notes"})
                        ]
                });
                var searchResultCount = customrecord_advs_title_dashboardSearchObj.runPaged().count;
                log.debug("customrecord_advs_title_dashboardSearchObj result count",searchResultCount);
                var titleObject = {}
                customrecord_advs_title_dashboardSearchObj.run().each(function(result){
                    // .run().each has a limit of 4,000 results
                    titleObject.internalId = result.getValue('internalid')
                    titleObject.custrecord_advs_td_catalog_number = result.getValue('custrecord_advs_td_catalog_number')
                    titleObject.custrecord_advs_td_title_received = result.getValue('custrecord_advs_td_title_received')
                    titleObject.custrecord_advs_td_active_transfer =result.getValue('custrecord_advs_td_active_transfer')
                    titleObject.custrecord_advs_td_date_sent_to_agency = result.getValue('custrecord_advs_td_date_sent_to_agency')
                    titleObject.custrecord_advs_td_state_restriction = result.getValue('custrecord_advs_td_state_restriction')
                    titleObject.custrecord_advs_td_lien = result.getValue('custrecord_advs_td_lien')
                    titleObject.custrecord_advs_td_title_state = result.getValue('custrecord_advs_td_title_state')
                    titleObject.custrecord_advs_td_vin = result.getValue('custrecord_advs_td_vin')
                    titleObject.custrecord_advs_td_active_asset = result.getValue('custrecord_advs_td_active_asset')
                    titleObject.custrecord_advs_td_type_of_sale = result.getValue('custrecord_advs_td_type_of_sale')
                    titleObject.custrecord_advs_date_title_sent = result.getValue('custrecord_advs_date_title_sent')
                    titleObject.custrecord_advs_method_of_shipment = result.getValue('custrecord_advs_method_of_shipment')
                    titleObject.custrecord_advs_td_notes = result.getValue('custrecord_advs_td_notes')
                    return true;
                });

                return titleObject
            }

            function populateSystemNoteSublist(form){

                var SublistObj = form.addSublist({
                    id: 'custpage_systemnotes_sublist',
                    type: serverWidget.SublistType.LIST,
                    label: 'System Notes'
                });

                SublistObj.addField({id: 'custsublist_system_date', type: serverWidget.FieldType.TEXT, label: 'Date & Time'});
                SublistObj.addField({id: 'custsublist_system_newvalue', type: serverWidget.FieldType.TEXT, label: 'New Value'});
                SublistObj.addField({id: 'custsublist_system_setby', type: serverWidget.FieldType.TEXT, label: 'Set By'})
                SublistObj.addField({id: 'custsublist_system_role', type: serverWidget.FieldType.TEXT, label: 'Role'})
                return SublistObj;
            }

            function populateSystemNotesData(SublistObj,titleId) {
                if (titleId){
                    var customrecord_advs_title_dashboardSearchObj = search.create({
                        type: "customrecord_advs_title_dashboard",
                        filters:
                            [
                                ["isinactive","is","F"],
                                "AND",
                                ["internalid","anyof",titleId]
                            ],
                        columns:
                            [
                                search.createColumn({name: "date", join: "systemNotes", label: "Date"}),
                                search.createColumn({name: "role", join: "systemNotes", label: "Role"}),
                                search.createColumn({name: "name", join: "systemNotes", label: "Set by"}),
                                search.createColumn({name: "oldvalue", join: "systemNotes", label: "Old Value"}),
                                search.createColumn({name: "newvalue", join: "systemNotes", label: "New Value"})
                            ]
                    });
                    var searchResultCount = customrecord_advs_title_dashboardSearchObj.runPaged().count;
                    log.debug("customrecord_advs_title_dashboardSearchObj result count",searchResultCount);
                    var Line = 0;
                    customrecord_advs_title_dashboardSearchObj.run().each(function(result){
                        SublistObj.setSublistValue({
                            id: "custsublist_system_date",
                            line: Line,
                            value: result.getValue({name: "date", join: "systemNotes"}) || ''
                        });

                        SublistObj.setSublistValue({
                            id: "custsublist_system_newvalue",
                            line: Line,
                            value: result.getValue({name: "newvalue", join: "systemNotes"}) || ''
                        });

                        SublistObj.setSublistValue({
                            id: "custsublist_system_setby",
                            line: Line,
                            value: result.getText({name: "name", join: "systemNotes"}) || ''
                        });

                        SublistObj.setSublistValue({
                            id: "custsublist_system_role",
                            line: Line,
                            value: result.getText({name: "role", join: "systemNotes"}) || ''
                        });
                        Line++
                        return true;
                    });

                }
            }

            function populateDocumentSublist(form){

                var SublistObj = form.addSublist({
                    id: 'custpage_document_sublist',
                    type: serverWidget.SublistType.LIST,
                    label: 'Images And Document'
                });
                SublistObj.addField({
                    id: 'custsublist_file',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Document'
                });
                SublistObj.addField({
                    id: 'custsublist_imagefile',
                    type: serverWidget.FieldType.IMAGE,
                    label: 'Images'
                });
                return SublistObj;
            }

            function populateDocumentSublistData(SublistObj,titleId, file){
                if (titleId){
                    log.debug( ' populateDocumentSublistData ', titleId)
                    var documentObject = search.create({
                        type: "customrecord_advs_title_doc_image",
                        filters:
                            [
                                ["isinactive","is","F"],
                                "AND",
                                ["custrecord_advs_title_parent_link1","anyof",titleId]
                            ],
                        columns:
                            [
                                search.createColumn({name: "custrecord_advs_image", label: "Image"}),
                                search.createColumn({name: "custrecord_advs_doc", label: "Document"}),
                            ]
                    });
                    var searchResultCount = documentObject.runPaged().count;
                    log.debug("documentObject result count",searchResultCount);
                    var Line = 0;
                    documentObject.run().each(function(result){

                        var fileValue  = result.getValue({name: "custrecord_advs_doc"})
                        var imageValue  = result.getValue({name: "custrecord_advs_image"})

                        log.debug("image result",imageValue + ' fileValue ' + fileValue);
                        if(fileValue){
                            var fileId = file.load({id: fileValue});
                            var fileURL = fileId.url
                            log.debug("fileURL",fileURL);
                            var downloadLink = '<a href="' + fileURL + '" target="_blank">Download PDF</a>';
                            SublistObj.setSublistValue({id: "custsublist_file", line: Line, value: downloadLink});
                        }
                        if(imageValue) {
                            var imageFile = file.load({id: imageValue});
                            var imageUrl = imageFile.url
                            SublistObj.setSublistValue({id: "custsublist_imagefile", line: Line, value: imageUrl});
                        }


                        Line++
                        return true;
                    });

                }
            }
        }
        return {
            onRequest
        }
    });
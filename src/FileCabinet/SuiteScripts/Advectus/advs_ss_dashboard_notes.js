/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{serverWidget} serverWidget
 */
    (record, runtime, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            var request =   scriptContext.request;
            var response =   scriptContext.response;

            if(request.method == "GET"){
                var form    =   serverWidget.createForm({title:"Notes"});

                var TypetoEnter =   request.parameters.custparam_type;
                var recID      =   request.parameters.custparam_id;

                var AreaFld =   form.addField({id:"custpage_area",type:serverWidget.FieldType.TEXTAREA,label:"Enter Notes"});
                AreaFld.isMandatory = true;

                var RecTypeFld =   form.addField({id:"custpage_type",type:serverWidget.FieldType.TEXT,label:"Type"});
                RecTypeFld.defaultValue = TypetoEnter;
                RecTypeFld.updateDisplayType({displayType:"hidden"})

                var RecIdFld =   form.addField({id:"custpage_id",type:serverWidget.FieldType.TEXT,label:"Rec Id"});
                RecIdFld.defaultValue = recID;
                RecIdFld.updateDisplayType({displayType:"hidden"})

                response.writePage(form);
                form.addSubmitButton("Add");
            }else{
                var valueStore = request.parameters.custpage_area;
                var recType  = request.parameters.custpage_type;
                var recId    = request.parameters.custpage_id;

                recId   =   recId*1;

               /* var noteId = record.attach({
                    record: {
                        type: record.Type.CUSTOMER,
                        id: recId
                    },
                    recordField: 'comments', // Specify the field where the note should be attached
                    note: 'This is a user note for the customer.'
                });*/
                // log.debug("recId",recType+"=>"+recId);

                var note = record.create({type: "note"});
                note.setValue({fieldId: 'title', value: valueStore});
                note.setValue({fieldId: 'note', value: valueStore});
                note.setValue({fieldId: 'notetype', value: 7});
                note.setValue({fieldId: 'entity', value: recId});
                note.setValue({fieldId: 'direction', value: 1});
                note.save();

                /*var noteId = record.attach({
                    record: {
                        type: recType,
                        id: recId
                    },
                    recordField: 'comments', // Specify the field where the note should be attached
                    note:valueStore
                });*/


                var onclickScript=" <html><body> <script type='text/javascript'>" +
                    "try{" +
                    "";

                onclickScript+="window.parent.location.reload();";
                onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";

                response.write(onclickScript);
            }
        }

        return {onRequest}

    });

/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/render', 'N/runtime','N/email', 'N/search','N/redirect','N/record','./advs_lib_util','N/format','./advs_lib_rental_leasing'],
    /**
 * @param{render} render
 * @param{runtime} runtime
 * @param{search} search
 */
    (render, runtime,email, search,redirect,record,libutil,format,lib_rental) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
                var request =   scriptContext.request;
                if(request != null && request != undefined && request != ""){
                    var leaseId             =   request.parameters.leaseid;
                    var isfromdash =   request.parameters.isfromdash;

                    var newRec  =   scriptContext.newRecord;
                    log.debug("isfromdash",isfromdash)
                    if(isfromdash == true || isfromdash == "true"){
                        newRec.setValue({fieldId:"custrecord_advs_cpc_isfrom_dash",value:"T"});
                    }
                    newRec.setValue({fieldId:"custrecord_advs_cpc_lease",value:leaseId});


                }
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            var type    =       scriptContext.type;
            var newRec          =       scriptContext.newRecord;
            var recId  =   newRec.id;
            if(type == "create"){
                var leaseID =       newRec.getValue({fieldId:"custrecord_advs_cpc_lease"});
                var receipient =       newRec.getValue({fieldId:"custrecord_advs_cpc_insu_comp_name"});
                var emailtemplateid =       newRec.getValue({fieldId:"custrecord_cpc_email_template_fld"});
                var isFrmDash =       newRec.getValue({fieldId:"custrecord_advs_cpc_isfrom_dash"});

                if(leaseID){
                    record.submitFields({type:"customrecord_advs_lease_header",id:leaseID,
                        values:{"custrecord_advs_l_a_cpc":true,"custrecord_advs_l_a_curr_cps":recId}});
						var emailtempobj = record.load({type:'customrecord_cpc_email_template',id:emailtemplateid,isDynamic:!0});
						var subject = emailtempobj.getValue({fieldId:'custrecord_cpc_email_subject'});
						var body = emailtempobj.getValue({fieldId:'custrecord_cpc_email_body'});
						var senderId = 6; 
						email.send({
							author: senderId,
							recipients: receipient,
							subject: subject,
							body: body 
						});
                }
                if((leaseID) && (isFrmDash == true || isFrmDash == "T")){
                    redirect.toSuitelet({
                        scriptId: 'customscript_advs_ss_dahb_open_new_scree',
                        deploymentId: 'customdeploy_advs_ss_dahb_open_new_scree',
                        parameters: {
                            custparam_type: 1
                        }
                    });
                }

            }
            if(type == "edit"){
                var leaseID     =       newRec.getValue({fieldId:"custrecord_advs_cpc_lease"});
                var isFrmDash   =       newRec.getValue({fieldId:"custrecord_advs_cpc_isfrom_dash"});
                var status      =       newRec.getValue({fieldId:"custrecord_advs_cpc_status"});

                var days      =       newRec.getValue({fieldId:"custrecord_advs_cpc_no_days"})*1;
                var lateFee      =       newRec.getValue({fieldId:"custrecord_advs_cpc_late_fee"})*1;
                var invoiceLink      =       newRec.getValue({fieldId:"custrecord_advs_cpc_invoice"});

                var tranDateHead    =   format.parse({
                    value:new Date(),
                    type: format.Type.DATE
                });

                if(status == libutil.cpcstatus.close){
                    if(leaseID) {
                        if (!invoiceLink) {

                        var setupData = lib_rental.invoiceTypeSearch();

                        var FieldsLook = ["custrecord_advs_l_h_location",
                            "custrecord_advs_l_h_customer_name", "custrecord_advs_la_vin_bodyfld","custrecord_advs_l_h_subsidiary"];
                        var RentalObj = search.lookupFields({
                            type: "customrecord_advs_lease_header",
                            id: leaseID,
                            columns: FieldsLook
                        })

                        var LocationID = "";
                        var RentType = "";
                        var freq = "";
                        var custId = "";
                        var vinId = "";var subsi="";
                        if (RentalObj['custrecord_advs_l_h_customer_name'] != null && RentalObj['custrecord_advs_l_h_location'] != undefined) {
                            LocationID = RentalObj['custrecord_advs_l_h_location'][0].value;
                        }
                        if (RentalObj['custrecord_advs_l_h_customer_name'] != null && RentalObj['custrecord_advs_l_h_customer_name'] != undefined) {
                            custId = RentalObj['custrecord_advs_l_h_customer_name'][0].value;
                        }
                        if (RentalObj['custrecord_advs_la_vin_bodyfld'] != null && RentalObj['custrecord_advs_la_vin_bodyfld'] != undefined) {
                            vinId = RentalObj['custrecord_advs_la_vin_bodyfld'][0].value;
                        }
                            if (RentalObj['custrecord_advs_l_h_subsidiary'] != null && RentalObj['custrecord_advs_l_h_subsidiary'] != undefined) {
                                subsi = RentalObj['custrecord_advs_l_h_subsidiary'][0].value;
                            }



                        var invoiceAmount = (days * lateFee);

                        var InvoiceREc = record.create({type: "invoice", isDynamic: true});
                        InvoiceREc.setValue({fieldId: "entity", value: custId});
                        InvoiceREc.setValue({fieldId: "trandate", value: tranDateHead});
                            InvoiceREc.setValue({fieldId: "subsidiary", value: subsi});

                        InvoiceREc.setValue({fieldId: "location", value: LocationID});
                        InvoiceREc.setValue({fieldId: "custbody_advs_lease_head", value: leaseID});
                        InvoiceREc.setValue({
                            fieldId: "custbody_advs_invoice_type",
                            value: setupData[libutil.rentalinvoiceType.lease_cpc]["id"]
                        });

                        InvoiceREc.selectNewLine({sublistId: "item"});
                        InvoiceREc.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "item",
                            value: setupData[libutil.rentalinvoiceType.lease_cpc]["regularitem"]
                        });
                        InvoiceREc.setCurrentSublistValue({sublistId: "item", fieldId: "quantity", value: days});
                        InvoiceREc.setCurrentSublistValue({sublistId: "item", fieldId: "rate", value: lateFee});
                        InvoiceREc.setCurrentSublistValue({sublistId: "item", fieldId: "description", value: "CPC"});
                        // InvoiceREc.setCurrentSublistValue({sublistId:"item", fieldId:"amount", value:downPay});
                        InvoiceREc.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "custcol_advs_st_applied_to_vin",
                            value: vinId
                        });
                        InvoiceREc.commitLine({sublistId: "item"});


                        var CPCInvoice = InvoiceREc.save({ignoreMandatoryFields: true, enableSourcing: true});


                        var currRec   =   scriptContext.newRecord;
                        var recType =   currRec.type;
                        var recid =   currRec.id;

                            record.submitFields({type:recType,id:recid,
                                values:{"custrecord_advs_cpc_invoice":CPCInvoice}});
                    }

                        record.submitFields({type:"customrecord_advs_lease_header",id:leaseID,
                            values:{"custrecord_advs_l_a_cpc":false,"custrecord_advs_l_a_curr_cps":""}});

                    }
                }


                if((leaseID) && (isFrmDash == true || isFrmDash == "T")){
                    redirect.toSuitelet({
                        scriptId: 'customscript_advs_ss_dahb_open_new_scree',
                        deploymentId: 'customdeploy_advs_ss_dahb_open_new_scree',
                        parameters: {
                            custparam_type: 1
                        }
                    });
                }
            }


        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });

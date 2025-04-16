/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search', 'N/ui/serverWidget'], function(search, serverWidget) {

        function beforeLoad(context) {
                if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT ){
                        try{
                                var form = context.form;
                                var currentRecord = context.newRecord;
                               // var taxratepercent = 0;
                                var taxstate = 0;
                                var taxcity = '';
                                var taxcounty = '';
                                var taxitem = '';
                                var customer = currentRecord.getValue('custrecord_advs_l_h_customer_name') ||7;
                                var vin = currentRecord.getValue('custrecord_advs_la_vin_bodyfld');
                                log.debug('customer',customer);
                                if(customer){
                                        var customertaxcode =   search.lookupFields({type:'customer',id:customer,columns:['taxitem']});
                                        log.debug('customertaxcode',customertaxcode);
                                        if(customertaxcode.taxitem && customertaxcode.taxitem.length > 0){
                                                if(customertaxcode.taxitem[0].value){
                                                        var customertaxrate=  search.lookupFields({type:'taxgroup',id:customertaxcode.taxitem[0].value,columns:['state','city','county','itemid']});
                                                        //taxratepercent = customertaxrate.rate;
                                                        log.debug('customertaxrate',customertaxrate);
                                                        taxstate = customertaxrate.state;
                                                        taxcity = customertaxrate.city;
                                                        taxcounty = customertaxrate.county;
                                                        taxitem = customertaxrate.itemid;
                                                        log.debug('taxstate',taxstate);
                                                        if(taxstate){
                                                            var _stateid =     getStateInternalid(taxstate)||'';
                                                                log.debug('_stateid',_stateid);
                                                                if(_stateid){
                                                                        currentRecord.setValue({fieldId:'custrecord_advs_salestax_state',value:_stateid});
                                                                }

                                                        }
                                                        currentRecord.setValue({fieldId:'custrecord_advs_salestax_city',value:taxcity})
                                                        currentRecord.setValue({fieldId:'custrecord_advs_salestax_county',value:taxcounty})
                                                        //currentRecord.setValue({fieldId:'custrecord_advs_propert_tax_code',value:taxitem})

                                                }

                                        }
                                }
                               var _dbaordobj =  getDeliveryBoardData(vin);
                                log.debug('_dbaordobj',_dbaordobj);
                                currentRecord.setValue({fieldId:'custrecord_advs_title_fee',value:_dbaordobj.titlefee})
                                currentRecord.setValue({fieldId:'custrecord_advs_reg_fee',value:_dbaordobj.regfee})
                                currentRecord.setValue({fieldId:'custrecord_advs_inception_due',value:_dbaordobj.totalincep})
                                currentRecord.setValue({fieldId:'custrecord_advs_amount_paid',value:_dbaordobj.depositamt})
                                currentRecord.setValue({fieldId:'custrecord_advs_balcne_del_due',value:_dbaordobj.depositbalamt})
                        }catch (e)
                        {
                                log.debug('error',e.toString());
                        }
                }
                if (context.type !== context.UserEventType.VIEW) return;

                var form = context.form;
                var currentRecord = context.newRecord;
                var leaseId = currentRecord.id;
                var vinId = currentRecord.getValue('custrecord_advs_la_vin_bodyfld');
                var customer = currentRecord.getValue('custrecord_advs_l_h_customer_name');
                var taxratepercent = 0;
                if(customer){
                      var customertaxcode =   search.lookupFields({type:'customer',id:customer,columns:['taxitem']});
                      if(customertaxcode.taxitem && customertaxcode.taxitem.length > 0){
                              if(customertaxcode.taxitem[0].value){
                                      var customertaxrate=  search.lookupFields({type:'taxgroup',id:customertaxcode.taxitem[0].value,columns:['rate']});
                                      taxratepercent = customertaxrate.rate;
                              }

                      }
                }
                var html = '';

                // Run the Soft Hold Lookup search
                var softHoldSearch = search.create({
                        type: "customrecord_advs_inventory_soft_hold_lo",
                        filters: [
                                ["custrecord_advs_ishlf_vin", "anyof", vinId]
                        ],
                        columns: [
                                "custrecord_advs_ishlf_payment_inception",     // Lease payment 1
                                "custrecord_advs_ishlf_deposit_inception",     // Non-refundable deposit
                                "custrecord_personal_property_tax",            // Personal property taxes
                                "custrecord_advs_ishlf_tax_amount",            // Combined tax amount
                                "custrecord_advs_ishlf_total_inception",        // Total inception due
                            "custrecord_advs_ishlf_title_fee",
                            "custrecord_advs_ishlf_registration_fee",
                            "custrecord_net_deposit_inception",
                            "custrecord_net_payment_inception"
                        ]
                });
                        var totalBalanceFromDeposit = 0;
                softHoldSearch.run().each(function(result) {
                        var leasePay11 = parseFloat(result.getValue("custrecord_advs_ishlf_payment_inception")) || 0;
                        var leasePay1 = parseFloat(result.getValue("custrecord_net_payment_inception")) || 0;
                        var deposit2 = parseFloat(result.getValue("custrecord_advs_ishlf_deposit_inception")) || 0;
                        var deposit = parseFloat(result.getValue("custrecord_net_deposit_inception")) || 0;
                        var personalPropTax = parseFloat(result.getValue("custrecord_personal_property_tax")) || 0;
                        var taxAmount = parseFloat(result.getValue("custrecord_advs_ishlf_tax_amount")) || 0;
                        var totalInception = parseFloat(result.getValue("custrecord_advs_ishlf_total_inception")) || 0;
                        var titlefee = parseFloat(result.getValue("custrecord_advs_ishlf_title_fee")) || 0;
                        var regfee = parseFloat(result.getValue("custrecord_advs_ishlf_registration_fee")) || 0;

                        // Manually calculate tax breakdown (if needed), or assume flat breakdown like image
                        var leasePay1Tax =leasePay1* (taxratepercent/100);
                        var depositTax = deposit* (taxratepercent/100);

                        // Base amounts
                        var baseAmounts = [leasePay1, deposit, personalPropTax, titlefee, regfee];
                        var taxAmounts = [leasePay1Tax, depositTax, 0, 0, 0];
                        var totalAmounts = baseAmounts.map((base, i) => base + taxAmounts[i]);

                        var labels = [
                                "Lease payment 1",
                                "Non-refundable Deposit",
                                "Personal property taxes",
                                "Title processing fee",
                                "Registration assistance fee"
                        ];

                        html += '<br/><br/><table style="border-collapse: collapse; width: 100%;">';
                        html += '<tr style="background-color: #f2f2f2;">' +
                            '<th style="border: 1px solid #ccc; padding: 6px;">Lease Inception Due with Breakdown</th>' +
                            '<th style="border: 1px solid #ccc; padding: 6px;">Base Amount</th>' +
                            '<th style="border: 1px solid #ccc; padding: 6px;">Tax Amount</th>' +
                            '<th style="border: 1px solid #ccc; padding: 6px;">Total Amount</th>' +
                            '</tr>';

                        for (var i = 0; i < baseAmounts.length; i++) {
                                html += '<tr>' +
                                    '<td style="border: 1px solid #ccc; padding: 6px;">' + labels[i] + '</td>' +
                                    '<td style="border: 1px solid #ccc; padding: 6px;">' + (baseAmounts[i] > 0 ? '$ ' + baseAmounts[i].toFixed(2) : '-') + '</td>' +
                                    '<td style="border: 1px solid #ccc; padding: 6px;">' + (taxAmounts[i] > 0 ? '$ ' + taxAmounts[i].toFixed(2) : '-') + '</td>' +
                                    '<td style="border: 1px solid #ccc; padding: 6px;">' + (baseAmounts[i] > 0 ? '$ ' + totalAmounts[i].toFixed(2) : '-') + '</td>' +
                                    '</tr>';
                        }

                        // Add total row
                        html += '<tr style="font-weight:bold;">' +
                            '<td style="border-top: 2px solid #000; padding: 6px;">Total Inception Due</td>' +
                            '<td style="border-top: 2px solid #000; padding: 6px;">$ ' + baseAmounts.reduce((a, b) => a + b, 0).toFixed(2) + '</td>' +
                            '<td style="border-top: 2px solid #000; padding: 6px;">$ ' + taxAmounts.reduce((a, b) => a + b, 0).toFixed(2) + '</td>' +
                            '<td style="border-top: 2px solid #000; padding: 6px;">$ ' + totalAmounts.reduce((a, b) => a + b, 0).toFixed(2) + '</td>' +
                            '</tr>';
                        totalBalanceFromDeposit = totalAmounts.reduce((a, b) => a + b, 0);
                        html += '</table>';

                        return false; // stop after one record
                });
                // Run Customer Deposit Search
                var _depositAmount = 0;
                var depositSearch = search.create({
                        type: "customerdeposit",
                        settings: [{ name: "consolidationtype", value: "ACCTTYPE" }],
                        filters: [
                                ["type", "anyof", "CustDep"],
                                "AND",
                                ["custbody_advs_vin_create_deposit", "anyof", vinId]
                        ],
                        columns: [
                                search.createColumn({ name: "amount", summary: "SUM" })
                        ]
                });

                depositSearch.run().each(function(result) {
                        _depositAmount = parseFloat(result.getValue({ name: "amount", summary: "SUM" })) || 0;
                        return false; // only need one summary row
                });
                var totalAmounts = totalBalanceFromDeposit;
                // Calculate balance due
                // var balanceDue = totalAmounts.reduce((a, b) => a + b, 0) - depositAmount;
                var balanceDue = totalAmounts- (_depositAmount/2);

                // Add Payments Table
                html += '<br/><br/><table style="border-collapse: collapse; width: 100%;">';
                html += '<tr style="background-color: #f2f2f2;">' +
                    '<th style="text-align: left; border: 1px solid #ccc; padding: 6px;">Payments Made</th>' +
                    '<th style="border: 1px solid #ccc; padding: 6px;">Total Amount</th>' +
                    '</tr>';

                html += '<tr>' +
                    '<td style="padding: 6px;">Deposits paid in</td>' +
                    '<td style="padding: 6px; text-align: right;">' + ((_depositAmount/2) > 0 ? '$ ' + (_depositAmount/2).toFixed(2) : '-') + '</td>' +
                    '</tr>';

                html += '<tr style="font-weight: bold;">' +
                    '<td style="padding: 6px; border-top: 2px solid #000;">Balance Due at Delivery</td>' +
                    '<td style="padding: 6px; border-top: 2px solid #000; text-align: right;">$ ' + balanceDue.toFixed(2) + '</td>' +
                    '</tr>';

                html += '</table>';
                var leaseSearch = search.create({
                        type: "customrecord_advs_lease_header",
                        filters: [
                                ["internalid", "anyof", leaseId],
                                "AND",
                                ["isinactive", "is", "F"]
                        ],
                        columns: [
                                "custrecord_advs_l_h_pay2_13",
                                "custrecord_advs_l_h_pay_14_25",
                                "custrecord_advs_l_h_pay_26_37",
                                "custrecord_advs_l_h_pay_38_49",
                                "custrecord_advs_l_h_pur_opti",
                                search.createColumn({
                                        name: "custrecord_softhold_tax_amount",
                                        join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
                                })
                        ]
                });



                leaseSearch.run().each(function(result) {
                        var taxAmount = parseFloat(result.getValue({
                                name: "custrecord_softhold_tax_amount",
                                join: "CUSTRECORD_ADVS_LA_VIN_BODYFLD"
                        })) || 0;

                        var baseAmounts = [
                                parseFloat(result.getValue("custrecord_advs_l_h_pay2_13")) || 0,
                                parseFloat(result.getValue("custrecord_advs_l_h_pay_14_25")) || 0,
                                parseFloat(result.getValue("custrecord_advs_l_h_pay_26_37")) || 0,
                                parseFloat(result.getValue("custrecord_advs_l_h_pay_38_49")) || 0,
                                parseFloat(result.getValue("custrecord_advs_l_h_pur_opti")) || 0
                        ];

                        var labels = [
                                "Lease payments 2-13",
                                "Lease payments 14-25",
                                "Lease payments 26-37",
                                "Lease payments 38+",
                                "Purchase option (non-refundable deposit is applied towards balan)"
                        ];

                        html += '<table style="border-collapse: collapse; width: 100%;">';
                        html += '<tr style="background-color: #f2f2f2;">' +
                            '<th style="border: 1px solid #ccc; padding: 6px;">Lease Payments</th>' +
                            '<th style="border: 1px solid #ccc; padding: 6px;">Base Amount</th>' +
                            '<th style="border: 1px solid #ccc; padding: 6px;">Tax Amount</th>' +
                            '<th style="border: 1px solid #ccc; padding: 6px;">Total Amount</th>' +
                            '</tr>';

                        for (var i = 0; i < baseAmounts.length; i++) {
                                var base = baseAmounts[i];
                                var tax = base > 0 ? (base * (taxratepercent/100)) : 0;
                                var total = base + tax;

                                html += '<tr>' +
                                    '<td style="border: 1px solid #ccc; padding: 6px;">' + labels[i] + '</td>' +
                                    '<td style="border: 1px solid #ccc; padding: 6px;">' + (base > 0 ? '$ ' + base.toFixed(2) : '-') + '</td>' +
                                    '<td style="border: 1px solid #ccc; padding: 6px;">' + (tax > 0 ? '$ ' + tax.toFixed(2) : '-') + '</td>' +
                                    '<td style="border: 1px solid #ccc; padding: 6px;">' + (base > 0 ? '$ ' + total.toFixed(2) : '-') + '</td>' +
                                    '</tr>';
                        }

                        html += '</table>';
                        return false; // only one result expected
                });
                var field = form.addField({
                        id: 'custpage_lease_table',
                        type: serverWidget.FieldType.INLINEHTML,
                        label: 'Lease Payment Summary'
                });
                field.defaultValue = html;
        }
function getDeliveryBoardData(vin){
                try{
                        var customrecord_advs_vm_inv_dep_del_boardSearchObj = search.create({
                                type: "customrecord_advs_vm_inv_dep_del_board",
                                filters:
                                    [
                                            ["custrecord_advs_in_dep_vin","anyof",vin],
                                            "AND",
                                            ["isinactive","is","F"]
                                    ],
                                columns:
                                    [
                                            "custrecord_advs_in_dep_title_fee",
                                            "custrecord_advs_in_dep_registration_fee",
                                            "custrecord_advs_in_dep_tot_lease_incepti",
                                            "custrecord_advs_in_dep_deposit",
                                            "custrecord_advs_in_dep_balance"
                                    ]
                        });
                        var searchResultCount = customrecord_advs_vm_inv_dep_del_boardSearchObj.runPaged().count;
                          var dbaordobj={};
                        customrecord_advs_vm_inv_dep_del_boardSearchObj.run().each(function(result){
                                // .run().each has a limit of 4,000 results
                                dbaordobj.titlefee = result.getValue({name:'custrecord_advs_in_dep_title_fee'});
                                dbaordobj.regfee = result.getValue({name:'custrecord_advs_in_dep_registration_fee'});
                                dbaordobj.totalincep = result.getValue({name:'custrecord_advs_in_dep_tot_lease_incepti'});
                                dbaordobj.depositamt = result.getValue({name:'custrecord_advs_in_dep_deposit'});
                                dbaordobj.depositbalamt = result.getValue({name:'custrecord_advs_in_dep_balance'});
                                return true;
                        });
                        return dbaordobj;
                }catch (e)
                {
                        log.debug('error in getdeliveryboard',e.toString());
                }
}
function getStateInternalid(shortname){
        var searchObj = search.create({
                type: search.Type.STATE,
                filters: [{
                        name: 'shortname',
                        operator: search.Operator.IS,
                        values:shortname
                }],
                columns: ['fullname']
        })

        var searchResultSet = searchObj.run();
        var stateid = '';
        searchResultSet.each(function(searchResult){
                //console.log('resultid',searchResult.id)
                stateid = searchResult.id;
               // console.log(searchResult.getValue('fullname')) // returns the full name of the state
                return true;
        })
        return stateid;
}
        return {
                beforeLoad: beforeLoad
        };
});

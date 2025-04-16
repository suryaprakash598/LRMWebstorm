/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/record', 'N/search', 'N/ui/serverWidget', 'N/format'],
    /**
     * @param{log} log
     * @param{record} record
     * @param{search} search
     */
    (log, record, search, serverWidget, format) => {
      /**
       * Defines the Suitelet script trigger point.
       * @param {Object} scriptContext
       * @param {ServerRequest} scriptContext.request - Incoming request
       * @param {ServerResponse} scriptContext.response - Suitelet response
       * @since 2015.2
       */
      const onRequest = (scriptContext) => {

        let request = scriptContext.request;
        let response = scriptContext.response;
        if (request.method == "GET") {
         var _parametersObj =  getParameterValues(request);
          // var ExistsSoftHoldId = getSoftHoldLogId(vin);
          var softholddata = getSoftholdLogData(_parametersObj.vin);
          log.debug('softholddata', softholddata);
         var form = addFormandFields(_parametersObj,softholddata);
          addingHiddenFields(form,_parametersObj);
          addDipositSublist(form,_parametersObj);
          form.addSubmitButton({
            label: 'Submit',
          });
          form.clientScriptModulePath = "./advs_cs_softhold_inventory_popup.js";
          response.writePage(form);
        }
        else {
          var changedstatus = request.parameters.custpage_changestatus;
          var vinId = request.parameters.custpage_vin;
          var customer = request.parameters.custpage_change_customer;
          var salesrep = request.parameters.custpage_change_salesrep;
          var DepInception = request.parameters.custpage_deposit_inception;
          var Depdisc = request.parameters.custpage_deposit_disco;
          var PaymentInception = request.parameters.custpage_payment_inception;
          var TotalInception = request.parameters.custpage_total_inception;
          var RegFee = request.parameters.custpage_registration_fee;
          var TitleFee = request.parameters.custpage_titlefee;
          var PickupFee = request.parameters.custpage_pickupfee;
          var TaxAmount = request.parameters.custpage_tax_amount;
          var SalesQuote = request.parameters.custpage_sales_quote;
          var Paymentdisc = request.parameters.custpage_payment_disco;
          var NetPaymentdisc = request.parameters.custpage_payment_inception_net;
          var NetDepdisc = request.parameters.custpage_deposit_disco_net;
          var _ppTaxAmount = request.parameters.custpage_pp_tax_amount;

//SOFTHOLD EXTRA
          var terms = request.parameters.custpage_terms;
          var pay1 = request.parameters.custpage_pay1;
          var pay2 = request.parameters.custpage_pay2;
          var pay3 = request.parameters.custpage_pay3;
          var pay4 = request.parameters.custpage_pay4;
          var purOptn = request.parameters.custpage_puroptn;
          var contTot = request.parameters.custpage_conttot;
          var bktchosen = request.parameters.custpage_bucketchosen;


          log.debug('DepInception',DepInception);
          // log.debug(" Sales quote =>"+SalesQuote+""," SalesQuote =>"+SalesQuote);
          if (SalesQuote == "T" || SalesQuote == true || SalesQuote == "true") {
            SalesQuote = true;
          } else {
            SalesQuote = false;
          }
          if (!DepInception) {
            DepInception = 0;
          }
          if (!PaymentInception) {
            PaymentInception = 0;
          }
          if (!TotalInception) {
            TotalInception = 0;
          }
          if (!RegFee) {
            RegFee = 0;
          }
          if (!TitleFee) {
            TitleFee = 0;
          }
          if (!PickupFee) {
            PickupFee = 0;
          }
          if (!TaxAmount) {
            TaxAmount = 0;
          }


          var currentrec = record.create({
            type: "customrecord_advs_st_current_date_time"
          });
          var currentdate = currentrec.getValue({
            fieldId: "custrecord_st_current_date"
          });
          var formattedDate = format.parse({
            value: currentdate,
            type: format.Type.DATE
          });
          if (changedstatus == 1) {
            var softHoldRec = record.create({
              type: 'customrecord_advs_soft_hold_status_inven',
              isDynamic: true
            });
            softHoldRec.setValue({
              fieldId: "custrecord_advs_soft_hold_status",
              value: changedstatus
            });
            softHoldRec.setValue({
              fieldId: "custrecord_advs_soft_hold_custmmer",
              value: customer
            });
            softHoldRec.setValue({
              fieldId: "custrecord_advs_vm_soft_hold_status",
              value: vinId
            });
            softHoldRec.setValue({
              fieldId: "custrecord_advs_soft_hold_salesrep",
              value: salesrep
            });
            softHoldRec.setValue({
              fieldId: "custrecord_advs_soft_hold_status_date",
              value: formattedDate
            });
            var recordId = softHoldRec.save();

          } else {
            var invenSearchObj = search.create({
              type: "customrecord_advs_soft_hold_status_inven",
              filters: [
                ["custrecord_advs_vm_soft_hold_status", "anyof", vinId],
                "AND",
                ["custrecord_advs_soft_hold_status", "anyof", "1"]
              ],
              columns: [
                search.createColumn({
                  name: "internalid",
                  label: "internalid"
                }),
                search.createColumn({
                  name: "custrecord_advs_soft_hold_status",
                  label: "Soft Hold Status"
                }),
                search.createColumn({
                  name: "custrecord_advs_soft_hold_custmmer",
                  label: "Customer"
                }),
                search.createColumn({
                  name: "custrecord_advs_soft_hold_salesrep",
                  label: "Sales Rep"
                })
              ]
            });
            var searchResultCount = invenSearchObj.runPaged().count;
            // log.debug("invenSearchObjresultcount",searchResultCount);
            invenSearchObj.run().each(function (result) {
              var internalID = result.getValue({
                name: "internalid"
              })
              var sHrec = record.load({
                type: "customrecord_advs_soft_hold_status_inven",
                id: internalID,
                isDynamic: true
              });
              sHrec.setValue({
                fieldId: "custrecord_advs_soft_hold_status",
                value: 2
              });
              sHrec.setValue({
                fieldId: "custrecord_advs_soft_hold_custmmer",
                value: customer
              });
              sHrec.setValue({
                fieldId: "custrecord_advs_vm_soft_hold_status",
                value: vinId
              });
              sHrec.setValue({
                fieldId: "custrecord_advs_soft_hold_salesrep",
                value: salesrep
              });
              sHrec.setValue({
                fieldId: "custrecord_advs_soft_hold__rel_date",
                value: formattedDate
              });
              var _sHrec = sHrec.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
              });
              return true;
            });
            //REMOVE VIN REFERENCE IN DEPOSITS OF THIS VIN ON RELEASE
            var deposits = getDeposits(vinId, customer);
            if(changedstatus == 2){
              for (var d = 0; d < deposits.length; d++) {
                record.submitFields({
                  type: 'customerdeposit',
                  id: deposits[d].intid,
                  values: {
                    custbody_advs_vin_create_deposit: '',
                    custbody_apply_new_vin: true
                  },
                  options: {
                    enableSourcing: !1,
                    ignoreMandatoryFields: !0
                  }
                });
              }
              if (deposits.length) {
                var _deliveryrecid = getDeliveryBoardData(vinId);
                if (_deliveryrecid) {
                  //DELETE OR INACTIVATE OR ANYTHING ELSE
                  var featureRecord = record.delete({
                    type: 'customrecord_advs_vm_inv_dep_del_board',
                    id: _deliveryrecid,
                  });
                }
              }
            }

          }

          var today = "";
          if (changedstatus == 1) {
            //changedstatus =15;//softhold
            today = new Date();
          } else if (changedstatus == 2) {
            //changedstatus = 22;//enroute
            customer = '';
            changedstatus = '';
            salesrep = '';
            today = "";
            DepInception = '';
            PaymentInception = '';
            Depdisc = "";
            Paymentdisc = "";
            TotalInception = '';
            SalesQuote =false;
          }
          var tempchangedstatus = changedstatus;
          if (SalesQuote) {
            var deposits = getDeposits(vinId, customer);
            if(deposits && deposits.length>0){
              tempchangedstatus = 4;
              //changedstatus = 4;//Assigned

            }
          }
          log.debug('DepInception before updating vin',DepInception);
          var updatevinobj = {
            //'custrecord_advs_vm_reservation_status': changedstatus,
            'custrecord_reservation_hold': tempchangedstatus,//changedstatus,
            'custrecord_advs_customer': customer,
            'custrecord_advs_vm_soft_hld_sale_rep': salesrep,
            'custrecord_advs_vm_soft_hold_date': today,
            'custrecord_advs_deposit_inception': DepInception,
            'custrecord_advs_deposit_discount': Depdisc,
            'custrecord_advs_payment_inception': PaymentInception,
            'custrecord_advs_payment_discount': Paymentdisc,
            'custrecord_advs_total_inception': TotalInception,
            'custrecord_advs_vm_sales_quote_from_inv': SalesQuote,
            'custrecord_advs_net_paym_tm': NetPaymentdisc,
            'custrecord_advs_net_dep_tm': NetDepdisc,
            'custrecord_advs_pay_inc_disc': Paymentdisc,
            'custrecord_advs_buck_terms1': terms,
            'custrecord_advs_payment_2_131': NetPaymentdisc || pay1,
            'custrecord_advs_payment_14_25': NetPaymentdisc || pay2,
            'custrecord_advs_payment_26_37': NetPaymentdisc || pay3,
            'custrecord_advs_payment_38_49': NetPaymentdisc || pay4,
            'custrecord_advs_pur_option': ((NetDepdisc * 1) + (NetPaymentdisc * 1)), //TotalInception,

            'custrecord_advs_contract_total': ((NetDepdisc * 1) + ((NetPaymentdisc * 1) * (terms * 1))),
            'custrecord_advs_bucket_1': bktchosen
          }
          if(TaxAmount!=0){
            updatevinobj['custrecord_softhold_tax_amount'] = TaxAmount
          }
          record.submitFields({
            type: "customrecord_advs_vm",
            id: vinId,
            values:updatevinobj
          });
          log.debug('changedstatus', changedstatus);
          if (changedstatus == 1 ) { //|| changedstatus == 3 ||  changedstatus == 4
            var deposits = getDeposits('@NONE@', customer); //previously vin was 0 statically surya changed it to vin variable
            log.debug('deposits', deposits);
            for (var d = 0; d < deposits.length; d++) { //deposits.length
              record.submitFields({
                type: 'customerdeposit',
                id: deposits[d].intid,
                values: {
                  custbody_advs_vin_create_deposit: vinId,
                  custbody_apply_new_vin: false
                },
                options: {
                  enableSourcing: !1,
                  ignoreMandatoryFields: !0
                }
              });
            }
            var deposits = getDeposits(vinId, customer);
            log.debug('SalesQuote' + SalesQuote, 'deposits.length' + deposits.length);
            if (deposits.length > 0) //updating condition to check both cases
            {
              log.debug('inside deposit length');
              if (SalesQuote) {
                //CREATE OR UPDATE DELIVERY BOARD
                var vindata = search.lookupFields({
                  type: 'customrecord_advs_vm',
                  id: vinId,
                  columns: ['custrecord_advs_vm_location_code']
                });
                var dataobj = {};
                dataobj.customer = customer;
                dataobj.salesrep = salesrep;
                dataobj.DepInception = DepInception;
                dataobj.PaymentInception = PaymentInception;
                dataobj.TotalInception = TotalInception;
                dataobj.SalesQuote = SalesQuote;
                dataobj.RegFee = RegFee;
                dataobj.titlefee = TitleFee;
                dataobj.pickupfee = PickupFee;
                dataobj._ppTaxAmount = _ppTaxAmount;
                var LocId = vindata.custrecord_advs_vm_location_code[0].value;
                createDeliveryBoardRecord(dataobj, vinId, LocId, deposits);
              }

            }
          }

          var secondbkt = searchForBuckets(vinId, bktchosen);
          if (secondbkt) {
            searchAndUpdateSecondBucketData(vinId, secondbkt);
          }
          log.debug('all fields fees',
              {'RegFee':RegFee,
                'TitleFee':TitleFee,
                'PickupFee':PickupFee,
                'DepInception':DepInception,
                'PaymentInception':PaymentInception,
                'TotalInception':TotalInception

          });
          if ((RegFee * 1 > 0) || (TitleFee * 1 > 0) || (PickupFee * 1 > 0) ||
              (DepInception * 1 > 0) || (PaymentInception * 1 > 0) || (TotalInception * 1 > 0)) {
            let RecordId = getSoftHoldLogId(vinId);
            let RecordObj = '';
            if (RecordId) {
              RecordObj = record.load({
                type: 'customrecord_advs_inventory_soft_hold_lo',
                id: RecordId,
                isDynamic: true
              });
            } else {
              RecordObj = record.create({
                type: 'customrecord_advs_inventory_soft_hold_lo',
                isDynamic: true
              });
            }
            RecordObj.setValue({
              fieldId: 'custrecord_advs_ishlf_vin',
              value: vinId
            });
            RecordObj.setValue({
              fieldId: 'custrecord_advs_ishlf_registration_fee',
              value: RegFee
            });
            RecordObj.setValue({
              fieldId: 'custrecord_advs_ishlf_title_fee',
              value: TitleFee
            });
            RecordObj.setValue({
              fieldId: 'custrecord_advs_ishlf_pickup_fee',
              value: PickupFee
            });
            RecordObj.setValue({
              fieldId: 'custrecord_advs_ishlf_tax_amount',
              value: TaxAmount
            });
            RecordObj.setValue({
              fieldId: 'custrecord_advs_ishlf_deposit_inception',
              value: DepInception
            });
            RecordObj.setValue({
              fieldId: 'custrecord_advs_ishlf_payment_inception',
              value: PaymentInception
            });
            RecordObj.setValue({
              fieldId: 'custrecord_advs_ishlf_total_inception',
              value: TotalInception
            });
            RecordObj.setValue({
              fieldId: 'custrecord_advs_soft_hold_log_sales_quot',
              value: SalesQuote
            });
            if (_ppTaxAmount) {
              RecordObj.setValue({
                fieldId: 'custrecord_personal_property_tax',
                value: _ppTaxAmount
              });
            }
            if(Depdisc)
            {
              RecordObj.setValue({
                fieldId: 'custrecord_deposit_discount',
                value: Depdisc
              });
            }
            if(Paymentdisc)
            {
              RecordObj.setValue({
                fieldId: 'custrecord_payment_discount',
                value: Paymentdisc
              });
            }
            if(NetPaymentdisc)
            {
              RecordObj.setValue({
                fieldId: 'custrecord_net_payment_inception',
                value: NetPaymentdisc
              });
            }
            if(NetDepdisc)
            {
              RecordObj.setValue({
                fieldId: 'custrecord_net_deposit_inception',
                value: NetDepdisc
              });
            }


            RecordObj.save({
              enableSourcing: true,
              ignoreMandatoryFields: true
            });
          }
          let onclickScript = " <html><body> <script type='text/javascript'>" +
              "try{";
          onclickScript += "window.opener.location.reload();";
          onclickScript += "window.close();";
          onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";
          response.write(onclickScript);
        }
      }
      function createDeliveryBoardRecord(DataObj, vin, LocId, deposits) {
        try {
          log.debug('DataObj', DataObj);
          let DepoRecord = '';
          let ReservationStatus = '';
          let TotalInceptionValue = DataObj.TotalInception;
          DepoRecord = record.create({
            type: 'customrecord_advs_vm_inv_dep_del_board',
            isDynamic: true
          });
          if (vin) {
            DepoRecord.setValue({
              fieldId: 'custrecord_advs_in_dep_vin',
              value: vin
            });
          }
          if (LocId) {
            DepoRecord.setValue({
              fieldId: 'custrecord_advs_in_dep_location',
              value: LocId
            });
          }
          if (DataObj.DepInception) {
            DepoRecord.setValue({
              fieldId: 'custrecord_advs_in_dep_inception',
              value: DataObj.DepInception
            });
          }
          if (DataObj.PaymentInception) {
            DepoRecord.setValue({
              fieldId: 'custrecord_advs_in_payment_inception',
              value: DataObj.PaymentInception
            });
          }
          if (DataObj.salesrep) {
            DepoRecord.setValue({
              fieldId: 'custrecord_advs_in_dep_sales_rep',
              value: DataObj.salesrep
            });
          }
          if (DataObj._ppTaxAmount) {
            DepoRecord.setValue({
              fieldId: 'custrecord_advs_personal_prop_tax',
              value: DataObj._ppTaxAmount
            });
          }

          DepoRecord.setValue({
            fieldId: 'custrecord_advs_in_dep_tot_lease_incepti',
            value: DataObj.TotalInception
          }); //DataObj.TotIncep
          DepoRecord.setValue({
            fieldId: 'custrecord_advs_in_dep_registration_fee',
            value: DataObj.RegFee
          });
          DepoRecord.setValue({
            fieldId: 'custrecord_advs_in_dep_title_fee',
            value: DataObj.titlefee
          });
          DepoRecord.setValue({
            fieldId: 'custrecord_advs_in_dep_pickup_fee',
            value: DataObj.pickupfee
          });
          DepoRecord.setValue({
            fieldId: 'custrecord_advs_in_dep_pu_payment',
            value: DataObj.pickupfee
          });

          DepoRecord.setValue({
            fieldId: 'custrecord_advs_in_dep_sales_quote',
            value: DataObj.SalesQuote
          });
          //DepoRecord.setValue({fieldId: 'custrecord_advs_in_dep_truck_ready', value: DataObj.TruckReady});
          let TotalDeposit = deposits[deposits.length - 1].sumofamount; //read sum of total deposits;
          TotalDeposit = TotalDeposit * 1;
          TotalDeposit = TotalDeposit.toFixed(2);

          //ADDING FEES

          log.debug('TotalDeposit', TotalDeposit);
          log.debug('TotalInceptionValue', TotalInceptionValue);
          let BalanceValue = (TotalInceptionValue * 1) - (TotalDeposit * 1);
          BalanceValue = BalanceValue * 1;
          BalanceValue = BalanceValue.toFixed(2);
          log.debug('BalanceValue', BalanceValue);
          if (DataObj.customer) {
            DepoRecord.setValue({
              fieldId: 'custrecord_advs_in_dep_name',
              value: DataObj.customer
            });
          }
          if (TotalDeposit) {
            DepoRecord.setValue({
              fieldId: 'custrecord_advs_in_dep_deposit',
              value: TotalDeposit
            });
          }
          if (deposits[deposits.length - 1]) {
            DepoRecord.setValue({
              fieldId: 'custrecord_advs_in_dep_trans_link',
              value: deposits[deposits.length - 1].intid
            });
          }
          DepoRecord.setValue({
            fieldId: 'custrecord_advs_in_dep_balance',
            value: BalanceValue
          });
          let DepoRecordID = DepoRecord.save({
            enableSourcing: true,
            ignoreMandatoryFields: true
          });
        } catch (e) {
          log.debug('error in createDeliveryBoardRecord', e.toString());
        }
      }
      function getDeposits(vin, customer) {
        try {
          log.debug('customer in getDeposits', customer);
          log.debug('vin in getDeposits', vin);
          var customerdepositSearchObj = search.create({
            type: "customerdeposit",
            filters: [
              ["type", "anyof", "CustDep"],
              "AND",
              [
                ["custbody_advs_vin_create_deposit", "anyof", vin],
                "OR",
                ["custbody_apply_new_vin", "is", "T"]
              ],
              "AND",
              ["mainline", "is", "T"],
              "AND",
              ["name", "anyof", customer]
            ],
            columns: [
              "internalid",
              "tranid",
              "amount"
            ]
          });
          var searchResultCount = customerdepositSearchObj.runPaged().count;
          log.debug("customerdepositSearchObj result count", searchResultCount);
          var arr = [];
          var sumofamount1 = 0;
          customerdepositSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            var obj = {};

            obj.docnum = result.getValue({
              name: 'tranid'
            });
            obj.intid = result.getValue({
              name: 'internalid'
            });
            obj.amount = result.getValue({
              name: 'amount'
            });
            sumofamount1 = sumofamount1 + (obj.amount * 1)
            obj.sumofamount = sumofamount1;
            arr.push(obj);
            return true;
          });
          return arr;
        } catch (e) {
          log.debug('error', e.toString());
        }
      }
      function getDeliveryBoardData(VinId) {
        let RecordId = '';
        let SearchObj = search.create({
          type: 'customrecord_advs_vm_inv_dep_del_board',
          filters: [
            ['isinactive', 'is', 'F'],
            'AND',
            ['custrecord_advs_in_dep_balance', 'greaterthan', 0],
            'AND',
            ['custrecord_advs_in_dep_vin', 'anyof', VinId]
          ],
          columns: [
            'internalid'
          ]
        });
        SearchObj.run().each(function (result) {
          RecordId = result.getValue('internalid');
          return true;
        });
        return RecordId;
      }
      function getSoftHoldLogId(VinId) {
        let RecordId = '';
        let SearchObj = search.create({
          type: 'customrecord_advs_inventory_soft_hold_lo',
          filters: [
            ['isinactive', 'is', 'F'],
            'AND',
            ['custrecord_advs_ishlf_vin', 'anyof', VinId]
          ],
          columns: [
            'internalid'
          ]
        });
        SearchObj.run().each(function (result) {
          RecordId = result.getValue('internalid');
          return true;
        });
        return RecordId;
      }
      function searchForBuckets(vin, bktchosen) {
        try {
          var customrecord_advs_vmSearchObj = search.create({
            type: "customrecord_advs_vm",
            filters: [
              ["internalid", "anyof", vin],
              "AND",
              ["isinactive", "is", "F"]
            ],
            columns: [
              "custrecord_v_master_buclet_hidden"
            ]
          });
          var searchResultCount = customrecord_advs_vmSearchObj.runPaged().count;
          log.debug("customrecord_advs_vmSearchObj result count", searchResultCount);
          var btkneeddata = 0;
          customrecord_advs_vmSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            var bkts = result.getValue({
              name: 'custrecord_v_master_buclet_hidden'
            });
            var bktarr = bkts.split(',');
            log.debug('bktarr', bktarr);
            for (var i = 0; i < bktarr.length; i++) {
              if (bktarr[i] == bktchosen) {

              } else {
                btkneeddata = bktarr[i];
              }
            }
            return true;
          });
          return btkneeddata;
        } catch (e) {
          log.debug('error', e.toString())
        }
      }
      function searchAndUpdateSecondBucketData(vinid, secondbkt) {
        try {
          var customrecord_bucket_calculation_locationSearchObj = search.create({
            type: "customrecord_bucket_calculation_location",
            filters: [
              ["internalid", "anyof", secondbkt],
              "AND",
              ["isinactive", "is", "F"]
            ],
            columns: [
              "name",
              "id",
              "custrecord_advs_b_c_c_model",
              "custrecord_bucket_calc_parent_link",
              "custrecord_advs_b_c_c_dep_inception",
              "custrecord_advs_b_c_c_pay_incep",
              "custrecord_advs_b_c_c_ttl_incep",
              "custrecord_advs_b_c_c_terms",
              "custrecord_advs_b_c_c_pay_2_13",
              "custrecord_advs_b_c_c_pay_14",
              "custrecord_advs_b_c_c_26_37",
              "custrecord_advs_b_c_c_pay_38_49",
              "custrecord_advs_b_c_c_pur_option",
              "custrecord_advs_b_c_c_cont_tot",
              "custrecord_advs_b_c_chld_freq",
              "custrecord_advs_b_c_chld_buc_lin",
              "custrecord_advs_reg_fees_buck",
              "custrecord_advs_grand_tot_inc"
            ]
          });
          var searchResultCount = customrecord_bucket_calculation_locationSearchObj.runPaged().count;
          log.debug("customrecord_bucket_calculation_locationSearchObj result count", searchResultCount);
          customrecord_bucket_calculation_locationSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            record.submitFields({
              type: "customrecord_advs_vm",
              id: vinid,
              values: {
                //'custrecord_advs_vm_reservation_status': changedstatus,

                'custrecord_advs_deposit_inception1': result.getValue({
                  name: 'custrecord_advs_b_c_c_dep_inception'
                }),
                // 'custrecord_advs_deposit_discount1': result.getValue({name:'entity'}),
                'custrecord_advs_payment_inception_1': result.getValue({
                  name: 'custrecord_advs_b_c_c_pay_incep'
                }),
                // 'custrecord_advs_payment_discount1': result.getValue({name:'entity'}),
                'custrecord_advs_total_inception1': result.getValue({
                  name: 'custrecord_advs_b_c_c_ttl_incep'
                }),
                'custrecord_advs_buck_terms1_1': result.getValue({
                  name: 'custrecord_advs_b_c_c_terms'
                }),
                'custrecord_advs_payment_2_131_1': result.getValue({
                  name: 'custrecord_advs_b_c_c_pay_2_13'
                }),
                'custrecord_advs_payment_14_25_1': result.getValue({
                  name: 'custrecord_advs_b_c_c_pay_14'
                }),
                'custrecord_advs_payment_26_37_1': result.getValue({
                  name: 'custrecord_advs_b_c_c_26_37'
                }),
                'custrecord_advs_payment_38_49_1': result.getValue({
                  name: 'custrecord_advs_b_c_c_pay_38_49'
                }),
                'custrecord_advs_pur_option_1': result.getValue({
                  name: 'custrecord_advs_b_c_c_pur_option'
                }),
                'custrecord_advs_contract_total_1': result.getValue({
                  name: 'custrecord_advs_b_c_c_cont_tot'
                }),
                'custrecord_advs_bucket_2': secondbkt
              }
            });
            return true;
          });
        } catch (e) {
          log.debug('error', e.toString())
        }
      }
      function getSoftholdLogData(vinid) {
        try {
          log.debug('vinid', vinid);
          var customrecord_advs_inventory_soft_hold_loSearchObj = search.create({
            type: "customrecord_advs_inventory_soft_hold_lo",
            filters: [
              ["custrecord_advs_ishlf_vin", "anyof", vinid],
              "AND",
              ["isinactive", "is", "F"]
            ],
            columns: [
              "custrecord_advs_ishlf_title_fee",
              "custrecord_advs_ishlf_pickup_fee",
              "custrecord_personal_property_tax",
                "custrecord_advs_ishlf_tax_amount",
                "custrecord_advs_ishlf_total_inception",
                "custrecord_advs_ishlf_deposit_inception",
                "custrecord_advs_ishlf_payment_inception",
                "custrecord_advs_ishlf_registration_fee",
                "custrecord_net_payment_inception",
                "custrecord_net_deposit_inception",
            ]
          });
          var searchResultCount = customrecord_advs_inventory_soft_hold_loSearchObj.runPaged().count;
          log.debug("customrecord_advs_inventory_soft_hold_loSearchObj result count", searchResultCount);
          var obj = {};
          customrecord_advs_inventory_soft_hold_loSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results

            obj.titlefee = result.getValue({
              name: 'custrecord_advs_ishlf_title_fee'
            });
            obj.pickupfee = result.getValue({
              name: 'custrecord_advs_ishlf_pickup_fee'
            });
            obj.pptaxamount = result.getValue({
              name: 'custrecord_personal_property_tax'
            });
            obj.taxamount = result.getValue({
              name: 'custrecord_advs_ishlf_tax_amount'
            });
            obj._totalinception = result.getValue({
              name: 'custrecord_advs_ishlf_total_inception'
            });
            obj._depositinception = result.getValue({
              name: 'custrecord_advs_ishlf_deposit_inception'
            });
            obj._paymentinception = result.getValue({
              name: 'custrecord_advs_ishlf_payment_inception'
            });
            obj._registrationFee = result.getValue({
              name: 'custrecord_advs_ishlf_registration_fee'
            });
            obj._netpaymentinception = result.getValue({
              name: 'custrecord_net_payment_inception'
            });
            obj._netdepositinception = result.getValue({
              name: 'custrecord_net_deposit_inception'
            });
            return true;
          });
          log.debug('obj', obj);
          return obj;
        } catch (e) {
          log.debug('error', e.toString());
        }
      }
      function getParameterValues(request){
        try{
          var vin = request.parameters.vinid;
          var DepositIncp = request.parameters.depinception;
          var PaymentIncp = request.parameters.Paymentincept;
          var isTruckReady = request.parameters.istruckready;
          var TTLINSP = request.parameters.TTLINSP;
          var TERMS = request.parameters.TERMS;
          var sec_2_13 = request.parameters.sec_2_13;
          var sec_14_26 = request.parameters.sec_14_26;
          var sec_26_37 = request.parameters.sec_26_37;
          var sec_38_49 = request.parameters.sec_38_49;
          var purOptn = request.parameters.purOptn;
          var contTot = request.parameters.contTot;
          var bktId = request.parameters.bktId;
          var vinRecLookUp = search.lookupFields({
            type: 'customrecord_advs_vm',
            id: vin,
            columns: ['custrecord_advs_vm_reservation_status',
              'custrecord_advs_customer',
              'custrecord_advs_vm_soft_hld_sale_rep',
              'custrecord_advs_vm_sales_quote_from_inv',
              'custrecord_advs_deposit_discount',
              'custrecord_advs_payment_discount',
              'custrecord_v_master_buclet_hidden'
            ]
          });
          let status = vinRecLookUp.custrecord_advs_vm_reservation_status[0].value;
          let customer = '',
              salesrep = '',
              rfee = 0,
              buckid = 0;
          var _depodiscount = 0;
          var _paymentDiscount = 0;
          if (vinRecLookUp.custrecord_advs_deposit_discount) {
            _depodiscount = vinRecLookUp.custrecord_advs_deposit_discount;
          }
          if (vinRecLookUp.custrecord_advs_payment_discount) {
            _paymentDiscount = vinRecLookUp.custrecord_advs_payment_discount;
          }
          if (vinRecLookUp.custrecord_advs_customer && vinRecLookUp.custrecord_advs_customer.length) {
            customer = vinRecLookUp.custrecord_advs_customer[0].value;
          }
          if (vinRecLookUp.custrecord_advs_vm_soft_hld_sale_rep.length) {
            salesrep = vinRecLookUp.custrecord_advs_vm_soft_hld_sale_rep[0].value;
          }
          var salesQuotVal = vinRecLookUp.custrecord_advs_vm_sales_quote_from_inv;
          if (vinRecLookUp.custrecord_v_master_buclet_hidden.length) {
            buckid = vinRecLookUp.custrecord_v_master_buclet_hidden[0].value;
          }
          if (buckid) {
            var feeobj = search.lookupFields({
              type: 'customrecord_bucket_calculation_location',
              id: buckid,
              columns: ['custrecord_advs_reg_fees_buck']
            });
            if (feeobj.custrecord_advs_reg_fees_buck) {
              rfee = feeobj.custrecord_advs_reg_fees_buck;
            }
          }
          var obj = {};
          obj.vin         =vin;
          obj.DepositIncp =DepositIncp;
          obj.PaymentIncp =PaymentIncp;
          obj.isTruckReady=isTruckReady;
          obj.TTLINSP     =TTLINSP;
          obj.TERMS       =TERMS;
          obj.sec_2_13    =sec_2_13;
          obj.sec_14_26   =sec_14_26;
          obj.sec_26_37   =sec_26_37;
          obj.sec_38_49   =sec_38_49;
          obj.purOptn     =purOptn;
          obj.contTot     =contTot;
          obj.bktId       =bktId;
            obj.status = status;
            obj.customer = customer;
            obj.salesrep = salesrep;
            obj.rfee = rfee;
            obj.buckid = buckid;
            obj._depodiscount = _depodiscount;
            obj._paymentDiscount = _paymentDiscount;
            obj.salesQuotVal = salesQuotVal;
            return obj;
        }catch (e)
        {
          log.debug('error', e.toString());
        }
      }
      function addFormandFields(_parametersObj,softholddata){
          try{
              var form = serverWidget.createForm({
                  title: "Softhold",
                  hideNavBar: true,
                  hideURL: true
              });
              let vinFldObj = form.addField({
                  id: "custpage_vin",
                  type: serverWidget.FieldType.TEXT,
                  label: "Vin",
              }).updateDisplayType({
                  displayType: serverWidget.FieldDisplayType.HIDDEN
              });
              if (_parametersObj.vin) {
                  vinFldObj.defaultValue = _parametersObj.vin;
              }
              let vinFldObj1 = form.addField({
                  id: "custpage_vin_select",
                  type: serverWidget.FieldType.SELECT,
                  label: "Vin",
                  source: "customrecord_advs_vm"
              }).updateDisplayType({
                  displayType: serverWidget.FieldDisplayType.INLINE
              });
              if (_parametersObj.vin) {
                  vinFldObj1.defaultValue = _parametersObj.vin;
              }

              let CurrentstatusFldObj = form.addField({
                  id: "custpage_currstatus",
                  type: serverWidget.FieldType.SELECT,
                  label: "Current Status",
                  source: "customlist_advs_reservation_status"
              }).updateDisplayType({
                  displayType: serverWidget.FieldDisplayType.INLINE
              });

              if (_parametersObj.status) {
                  CurrentstatusFldObj.defaultValue = _parametersObj.status;
              }

              let statusFldObj = form.addField({
                  id: "custpage_changestatus",
                  type: serverWidget.FieldType.SELECT,
                  label: "Select Status",
                  source: "customlist_softhold_inventory"
              });
              statusFldObj.defaultValue = 1;

              let customerFldObj = form.addField({
                  id: "custpage_change_customer",
                  type: serverWidget.FieldType.SELECT,
                  label: "Customer",
                  source: "customer"
              });
              if (_parametersObj.customer) {
                  customerFldObj.defaultValue = _parametersObj.customer;
              }

              let employeeFldObj = form.addField({
                  id: "custpage_change_salesrep",
                  type: serverWidget.FieldType.SELECT,
                  label: "Salesrep",
                  source: "employee"
              });
              if (_parametersObj.salesrep) {
                  employeeFldObj.defaultValue = _parametersObj.salesrep;
              }
              let salesQuoteFldObj = form.addField({
                  id: "custpage_sales_quote",
                  type: serverWidget.FieldType.CHECKBOX,
                  label: "Lease Quote",
              });
              if (_parametersObj.salesQuotVal == "true" || _parametersObj.salesQuotVal == true || _parametersObj.salesQuotVal == "T") {
                  salesQuoteFldObj.defaultValue = "T";
              }
              let registrationFeesfld = form.addField({
                  id: "custpage_registration_fee",
                  label: "Registration Fee",
                  type: serverWidget.FieldType.CURRENCY
              });
              if (_parametersObj.rfee) {
                  registrationFeesfld.defaultValue = _parametersObj.rfee;
              }
              registrationFeesfld.updateBreakType({
                  breakType: serverWidget.FieldBreakType.STARTCOL
              });
              let pptaxAmountfld = form.addField({
                  id: "custpage_pp_tax_amount",
                  label: "Personal Property Tax Amount",
                  type: serverWidget.FieldType.CURRENCY
              });
              pptaxAmountfld.defaultValue = softholddata.pptaxamount;
              let titleFeesfld = form.addField({
                  id: "custpage_titlefee",
                  label: "Title Fee",
                  type: serverWidget.FieldType.CURRENCY
              });
              titleFeesfld.defaultValue = softholddata.titlefee;
              let pickupFeefld = form.addField({
                  id: "custpage_pickupfee",
                  label: "Pickup Fee",
                  type: serverWidget.FieldType.CURRENCY
              });
              pickupFeefld.defaultValue = softholddata.pickupfee;
              let taxCodefld = form.addField({
                  id: "custpage_tax_code_fld",
                  label: "Tax %",
                  type: serverWidget.FieldType.PERCENT
              });
              let taxAmountfld = form.addField({
                  id: "custpage_tax_amount",
                  label: "Tax Amount",
                  type: serverWidget.FieldType.CURRENCY
              });
              taxAmountfld.defaultValue= softholddata.taxamount;

              let DepositInc = form.addField({
                  id: "custpage_deposit_inception",
                  label: "Deposit Inception",
                  type: serverWidget.FieldType.CURRENCY
              });
              DepositInc.updateDisplayType({
                  displayType: serverWidget.FieldDisplayType.DISABLED
              });
              DepositInc.updateBreakType({
                  breakType: serverWidget.FieldBreakType.STARTCOL
              });


              if (_parametersObj.DepositIncp) {
                  DepositInc.defaultValue = (_parametersObj.DepositIncp*1) + ((_parametersObj. _depodiscount || 0)*1);
              }
              let DepositDisco = form.addField({
                  id: "custpage_deposit_disco",
                  label: "Deposit Discount",
                  type: serverWidget.FieldType.INTEGER
              });
              DepositDisco.defaultValue =_parametersObj. _depodiscount;

              let PaymentInc = form.addField({
                  id: "custpage_payment_inception",
                  label: "Payment Inception",
                  type: serverWidget.FieldType.CURRENCY
              });
              PaymentInc.updateDisplayType({
                  displayType: serverWidget.FieldDisplayType.DISABLED
              });

              if (_parametersObj.PaymentIncp) {
                  PaymentInc.defaultValue = (_parametersObj.PaymentIncp*1) + ((_parametersObj._paymentDiscount || 0)*1);
              }

              let Paymentdisco = form.addField({
                  id: "custpage_payment_disco",
                  label: "Payment Discount",
                  type: serverWidget.FieldType.INTEGER
              });
              Paymentdisco.defaultValue = _parametersObj._paymentDiscount;

              let DepositDiscoNet = form.addField({
                  id: "custpage_deposit_disco_net",
                  label: "Net Deposit Inception",
                  type: serverWidget.FieldType.INTEGER
              });
              let PaymentIncNet = form.addField({
                  id: "custpage_payment_inception_net",
                  label: "Net Payment Inception",
                  type: serverWidget.FieldType.CURRENCY
              });
              PaymentIncNet.updateDisplayType({
                  displayType: serverWidget.FieldDisplayType.DISABLED
              });
              DepositDiscoNet.updateDisplayType({
                  displayType: serverWidget.FieldDisplayType.DISABLED
              });
            PaymentIncNet.defaultValue =   softholddata._netpaymentinception
            DepositDiscoNet.defaultValue =   softholddata._netdepositinception

              let TotalInceptionFld = form.addField({
                  id: "custpage_total_inception",
                  label: "Total Inception",
                  type: serverWidget.FieldType.CURRENCY
              });
              TotalInceptionFld.updateDisplayType({
                  displayType: serverWidget.FieldDisplayType.DISABLED
              });

              let deliveryrecid = '';
              if (!_parametersObj.DepositIncp) {
                  _parametersObj.DepositIncp = 0
              }
              if (!_parametersObj.PaymentIncp) {
                  _parametersObj.PaymentIncp = 0
              }
              let totalInceptionValue = (_parametersObj.DepositIncp * 1) + (_parametersObj.PaymentIncp * 1);
              if (deliveryrecid != '') {
                  // TotalInceptionFld.defaultValue = totalinceptionSP;
              } else {
                  TotalInceptionFld.defaultValue = softholddata._totalinception;
                  // TotalInceptionFld.defaultValue = totalInceptionValue;
              }

        return form;

          }catch (e)
          {
              log.debug('error',e.toString())
          }
      }
      function addingHiddenFields(form,_parametersObj)
      {
        try{
          // AADING HIDDEN FIELDS TO TRANSFER TO VIN MASTER

          let TotalTermsFld = form.addField({
            id: "custpage_terms",
            label: "Terms",
            type: serverWidget.FieldType.TEXT
          });
          TotalTermsFld.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
          });
          TotalTermsFld.defaultValue = _parametersObj.TERMS;



          let TotalpayFld1 = form.addField({
            id: "custpage_pay1",
            label: "Payment1",
            type: serverWidget.FieldType.CURRENCY
          });
          TotalpayFld1.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
          });
          TotalpayFld1.defaultValue = _parametersObj.sec_2_13;

          let TotalpayFld2 = form.addField({
            id: "custpage_pay2",
            label: "Payment2",
            type: serverWidget.FieldType.CURRENCY
          });
          TotalpayFld2.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
          });
          TotalpayFld2.defaultValue = _parametersObj.sec_14_26;

          let TotalpayFld3 = form.addField({
            id: "custpage_pay3",
            label: "Payment3",
            type: serverWidget.FieldType.CURRENCY
          });
          TotalpayFld3.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
          });
          TotalpayFld3.defaultValue = _parametersObj.sec_26_37;

          let TotalpayFld4 = form.addField({
            id: "custpage_pay4",
            label: "Payment4",
            type: serverWidget.FieldType.CURRENCY
          });
          TotalpayFld4.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
          });
          TotalpayFld4.defaultValue = _parametersObj.sec_38_49;

          let TotalpurOptn = form.addField({
            id: "custpage_puroptn",
            label: "purOptn",
            type: serverWidget.FieldType.CURRENCY
          });
          TotalpurOptn.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
          });
          TotalpurOptn.defaultValue = _parametersObj.purOptn;

          let TotalcontTot = form.addField({
            id: "custpage_conttot",
            label: "contTot",
            type: serverWidget.FieldType.CURRENCY
          });
          TotalcontTot.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
          });
          TotalcontTot.defaultValue = _parametersObj.contTot;

          let Totalbkt = form.addField({
            id: "custpage_bucketchosen",
            label: "Bucket",
            type: serverWidget.FieldType.TEXT
          });
          Totalbkt.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
          });
          Totalbkt.defaultValue = _parametersObj.bktId;



          // AADING HIDDEN FIELDS TO TRANSFER TO VIN MASTER

        }catch (e)
        {
          log.debug('error',e.toString())
        }
      }
      function addDipositSublist(form,_parametersObj)
      {
        try{

          var Dsublist = form.addSublist({
            id: 'custpage_deposits_applied',
            type: serverWidget.SublistType.LIST,
            label: 'Deposits'
          });
          Dsublist.addField({
            id: "custpabe_int_id",
            type: serverWidget.FieldType.TEXT,
            label: "ID"
          })
          Dsublist.addField({
            id: "custpabe_doc_number",
            type: serverWidget.FieldType.TEXT,
            label: "Number"
          })
          Dsublist.addField({
            id: "custpabe_amount",
            type: serverWidget.FieldType.CURRENCY,
            label: "Amount"
          })
          if (_parametersObj.customer) {
            var deposits = getDeposits(_parametersObj.vin, _parametersObj.customer);
            for (var d = 0; d < deposits.length; d++) {
              Dsublist.setSublistValue({
                id: 'custpabe_int_id',
                line: d,
                value: deposits[d].intid
              });
              Dsublist.setSublistValue({
                id: 'custpabe_doc_number',
                line: d,
                value: deposits[d].docnum
              });
              Dsublist.setSublistValue({
                id: 'custpabe_amount',
                line: d,
                value: deposits[d].amount
              });
            }
          }
        }catch(e){
          log.debug('error',e.toString())
        }
      }
      return {
        onRequest
      }

    });
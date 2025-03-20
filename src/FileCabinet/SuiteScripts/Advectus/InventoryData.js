/*******************************************************************************
{{ScriptHeader}} *
 * Company:                  {{Company}}
 * Author:                   {{Name}} - {{Email}}
 * File:                     {{ScriptFileName}}
 * Script:                   {{ScriptTitle}}
 * Script ID:                {{ScriptID}}
 * Version:                  1.0
 *
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 *
 ******************************************************************************/
define(['N/runtime', 'N/record', 'N/search', 'N/log', 'N/ui/serverWidget'], function (
  /** @type {import('N/runtime')} 		**/
  runtime,
  /** @type {import('N/record')}  		**/
  record,
  /** @type {import('N/search')}  		**/
  search,
  /** @type {import('N/log')}     		**/
  log,
  /** @type {import('N/serverWidget')}  **/
  serverWidget
) {

  /**
   * context.request
   * context.response
   *
   * @type {import('N/types').EntryPoints.Suitelet.onRequest}
   */
  function onRequest(context) {

    try {
      var request = context.request;
      var response = context.response;

      var pageId = parseInt(request.parameters.page) || 0;

      var brandId = request.parameters.brand;
      var modelId = request.parameters.model;
      var locatId = request.parameters.locat;
      var bucketId = request.parameters.bucket;
      var freqId = request.parameters.freq;
      var vinID = request.parameters.unitvin || '';
      // log.debug('vinID', vinID);

      var Old_Vin_From_lease = request.parameters.custpara_old_vin; //custpara_old_vin
      var flagpara2 = request.parameters.custpara_flag_2;
      var LeaseHeaderId = request.parameters.custpara_lease_id;
      var iFrameCenter = request.parameters.ifrmcntnr;

      var vmSearchObj = InventorySearch(brandId, modelId, locatId, bucketId, freqId, vinID, LeaseHeaderId, iFrameCenter)
      var searchObj = vmSearchObj.runPaged({
        pageSize: 1000,
      });
      var count = vmSearchObj.runPaged().count;
      var mainarr = [];
      var addResults = {};
      log.debug('searchObj.count', count);
      if (count > 0) {
        addResults = fetchSearchResult(searchObj, pageId, freqId);
      } else {
        var addResults = {};
      }
      var invesumary = [];
      var deliveryData = deleiveryData();
      var inventorySummary = getHtmlContent();
      log.debug('inventorySummary', inventorySummary);
      invesumary.push(inventorySummary)
      addResults.deliverydata = deliveryData;
      addResults.inventorysummary = invesumary;
      mainarr.push(addResults);
      //log.debug('addResults',addResults);
      context.response.write(JSON.stringify(mainarr));
    } catch (e) {
      log.debug('error', e.toString())
    }
  }

  function InventorySearch(brandId, modelId, locatId, bucketId, freqId, vinID, LeaseHeaderId, iFrameCenter) {
    var vmSearchObj = search.create({
      type: "customrecord_advs_vm",
      filters: [
        // ["custrecord_advs_vm_reservation_status", "anyof", "1"], "AND",
        ["isinactive", "is", false], "AND",
        ["custrecord_advs_vm_reservation_status", "anyof", "15", "19", "20", "21", "22", "23"]
        /* "AND",
                        ["custrecord_advs_vm_subsidary", "anyof", UserSubsidiary] */
        /*"AND",
           ["custrecord_vehicle_master_bucket", "noneof", "@NONE@"] */
      ],
      columns: [
        search.createColumn({
          name: "internalid",
        }),
        search.createColumn({
          name: "name",
          sort: search.Sort.ASC,
          label: "Name"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_model",
          label: "Model"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_vehicle_brand",
          label: "Make"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_location_code",
          label: "Location"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_transmission_type",
          label: "Transmission Type"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_model_year",
          label: "Year of Manufacturing"
        }),
        search.createColumn({
          name: "custrecord_vehicle_master_bucket",
          label: "Year of Manufacturing"
        }),
        search.createColumn({
          name: "custrecord_advs_em_serial_number",
          label: "Truck Unit"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_reservation_status",
          label: "RESERVATION STATUS"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_mileage",
          label: "HMR"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_engine_serial_number",
          label: "Engine Serial Number"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_customer_number",
          label: "Customer"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_soft_hld_sale_rep",
          label: "SOFT HOLD SALESREP"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_exterior_color",
          label: "Exterior Color"
        }),
        search.createColumn({
          name: "custrecord_advs_title_rest_ms_tm",
          label: "Title Restriction"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_date_truck_ready",
          label: "Date Truck Ready"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_date_truck_lockedup",
          label: "Date Truck Locked up"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_aging",
          label: "Aging"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_date_on_site",
          label: "Date On Site"
        }),
        search.createColumn({
          name: "custrecord_is_deposit_created",
          label: "Deposit Created"
        }),
        search.createColumn({
          name: "custrecord_advs_sleeper_size_ms"
        }),
        search.createColumn({
          name: "custrecord_advs_apu_ms_tm"
        }),
        search.createColumn({
          name: "custrecord_advs_beds_ms_tm"
        }), search.createColumn({
          name: "custrecord_advs_tm_truck_ready"
        }), search.createColumn({
          name: "custrecord_advs_tm_washed"
        }),

        search.createColumn({
          name: "custrecord_advs_transport_"
        }),
        search.createColumn({
          name: "custrecord_advs_inspected"
        }),
        search.createColumn({
          name: "custrecord_advs_approved_repair"
        }),
        search.createColumn({
          name: "custrecord_advs_picture_1"
        }),
        search.createColumn({
          name: "custrecord_advs_admin_notes"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_body_style"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_eta"
        }),
        search.createColumn({
          name: "custrecord_advs_notes_ms_tm"
        }),
        search.createColumn({
          name: "custrecord_advs_aging_contract"
        }),

        search.createColumn({
          name: "custrecord_is_old_vehicle"
        }),
        search.createColumn({
          name: "custrecord_is_discount_applied"
        }),
        search.createColumn({
          name: "custrecord_v_master_buclet_hidden"
        }),
		 //FROM HERE SOFTHOLD FIELDS
            search.createColumn({
              name: "custrecord_advs_deposit_inception"
            }),
            search.createColumn({
              name: "custrecord_advs_deposit_discount"
            }),
            search.createColumn({
              name: "custrecord_advs_payment_inception"
            }),
            search.createColumn({
              name: "custrecord_advs_total_inception"
            }),
            search.createColumn({
              name: "custrecord_advs_buck_terms1"
            }),
            search.createColumn({
              name: "custrecord_advs_payment_2_131"
            }),
            search.createColumn({
              name: "custrecord_advs_payment_14_25"
            }),
            search.createColumn({
              name: "custrecord_advs_payment_26_37"
            }),
            search.createColumn({
              name: "custrecord_advs_payment_38_49"
            }),
            search.createColumn({
              name: "custrecord_advs_pur_option"
            }), 
            search.createColumn({
              name: "custrecord_advs_contract_total"
            }),
            search.createColumn({
              name: "custrecord_advs_registration_fees_bucket"
            }),
            search.createColumn({
              name: "custrecord_advs_grand_total_inception"
            }),
            
            search.createColumn({
              name: "custrecord_advs_deposit_inception1"
            }),
            search.createColumn({
              name: "custrecord_advs_deposit_discount1"
            }),
            search.createColumn({
              name: "custrecord_advs_payment_inception_1"
            }),
            search.createColumn({
              name: "custrecord_advs_total_inception1"
            }),
            search.createColumn({
              name: "custrecord_advs_buck_terms1_1"
            }),
            search.createColumn({
              name: "custrecord_advs_payment_2_131_1"
            }),
            search.createColumn({
              name: "custrecord_advs_payment_14_25_1"
            }),
            search.createColumn({
              name: "custrecord_advs_payment_26_37_1"
            }),
            search.createColumn({
              name: "custrecord_advs_payment_38_49_1"
            }),
            search.createColumn({
              name: "custrecord_advs_pur_option_1"
            }), 
            search.createColumn({
              name: "custrecord_advs_contract_total_1"
            }),
            search.createColumn({
              name: "custrecord_advs_registration_fe_bucket_1"
            }),
            search.createColumn({
              name: "custrecord_advs_grand_total_inception_1"
            }),
            search.createColumn({
              name: "custrecord_advs_bucket_1"
            }),
            search.createColumn({
              name: "custrecord_advs_bucket_2"
            })
        /* search.createColumn({
          name: "custrecord_advs_in_dep_trans_link",
          join: "CUSTRECORD_ADVS_IN_DEP_VIN",
          label: "Deposit Link"
        }),

        search.createColumn({
          name: "custrecord_advs_in_dep_sales_rep",
          join: "CUSTRECORD_ADVS_IN_DEP_VIN",
          label: "Sales Rep"
        }) */
      ]
    });

    if (brandId) {
      vmSearchObj.filters.push(search.createFilter({
        name: "custrecord_advs_vm_vehicle_brand",
        operator: search.Operator.ANYOF,
        values: brandId
      }))

    }
    if (modelId) {
      vmSearchObj.filters.push(search.createFilter({
        name: "custrecord_advs_vm_model",
        operator: search.Operator.ANYOF,
        values: modelId
      }))

    }
    if (locatId) {
      vmSearchObj.filters.push(search.createFilter({
        name: "custrecord_advs_vm_location_code",
        operator: search.Operator.ANYOF,
        values: locatId
      }))

    }
    if (bucketId) {
      vmSearchObj.filters.push(search.createFilter({
        name: "custrecord_vehicle_master_bucket",
        operator: search.Operator.ANYOF,
        values: bucketId
      }))

    }

    if (vinID != '') {
      // log.debug('vinID filters', vinID);
      vmSearchObj.filters.push(search.createFilter({
        name: "internalid",
        operator: search.Operator.IS,
        values: vinID
      }))

    }

    return vmSearchObj;
  }
  var bucketData = [];
  var uniqueBucket = [];
  var bucketchildsIds = [];
  var mileagetofilter = 0;

  function fetchSearchResult(pagedData, pageIndex, freqId) {


    var bucketDataTemp = [];
    var indarr = [];
    var vmDataResults = new Array();
    var searchPage = pagedData.fetch({
      index: 0
    });
    searchPage.data.forEach(function (result) {

      var vinId = result.getValue({
        name: "internalid"
      });
      var vinText = result.getValue({
        name: "name"
      });
      var modelId = result.getText({
        name: "custrecord_advs_vm_model"
      });
      var vehicleBrand = result.getText({
        name: "custrecord_advs_vm_vehicle_brand"
      });
      var locId = result.getText({
        name: "custrecord_advs_vm_location_code"
      });
      var locIdval = result.getValue({
        name: "custrecord_advs_vm_location_code"
      });
      var modelYr = result.getText({
        name: "custrecord_advs_vm_model_year"
      });
      var bucketIdText = result.getText({
        name: "custrecord_vehicle_master_bucket"
      });
      var bucketId = result.getValue({
        name: "custrecord_vehicle_master_bucket"
      });
      var bucketchilds = result.getValue({
        name: "custrecord_v_master_buclet_hidden"
      });
      var stockdt = result.getValue({
        name: "custrecord_advs_em_serial_number"
      });
      var Statusdt = result.getText({
        name: "custrecord_advs_vm_reservation_status"
      });
      var Statusdtval = result.getValue({
        name: "custrecord_advs_vm_reservation_status"
      });
      var Mileagedt = result.getValue({
        name: "custrecord_advs_vm_mileage"
      });
      mileagetofilter = Mileagedt;
      var Transdt = result.getText({
        name: "custrecord_advs_vm_transmission_type"
      });
      var Enginedt = result.getValue({
        name: "custrecord_advs_vm_engine_serial_number"
      });
      var Customerdt = result.getText({
        name: "custrecord_advs_vm_customer_number"
      });
      var salesrepid = result.getValue({
        name: "custrecord_advs_vm_soft_hld_sale_rep"
      });
      var salesrepdt = result.getText({
        name: "custrecord_advs_vm_soft_hld_sale_rep"
      });
      var extclrdt = result.getText({
        name: "custrecord_advs_vm_exterior_color"
      });
      var titleRestdt = result.getText({
        name: "custrecord_advs_title_rest_ms_tm"
      });
      var DateTruckRdydt = result.getValue({
        name: "custrecord_advs_vm_date_truck_ready"
      });
      var DateTruckLockupdt = result.getValue({
        name: "custrecord_advs_vm_date_truck_lockedup"
      });
      var DateTruckAgingdt = result.getValue({
        name: "custrecord_advs_vm_aging"
      });
      var DateOnsitedt = result.getValue({
        name: "custrecord_advs_vm_date_on_site"
      });
      var isdepositCreated = result.getValue({
        name: "custrecord_is_deposit_created"
      });
      var sleepersize = result.getText({
        name: "custrecord_advs_sleeper_size_ms"
      });
      var apu = result.getText({
        name: "custrecord_advs_apu_ms_tm"
      });
      var beds = result.getText({
        name: "custrecord_advs_beds_ms_tm"
      });
      var istruckready = result.getValue({
        name: "custrecord_advs_tm_truck_ready"
      });
      var iswashed = result.getValue({
        name: "custrecord_advs_tm_washed"
      });
      var singlebunk = result.getValue({
        name: "custrecord_advs_single_bunk"
      });
      var Transport = result.getValue({
        name: "custrecord_advs_transport_"
      });
      var Inspected = result.getValue({
        name: "custrecord_advs_inspected"
      });
      var ApprRepDate = result.getValue({
        name: "custrecord_advs_approved_repair"
      });
      var Picture1 = result.getValue({
        name: "custrecord_advs_picture_1"
      });

      var admin_notes = result.getValue({
        name: "custrecord_advs_admin_notes"
      });
      var body_style = result.getValue({
        name: "custrecord_advs_vm_body_style"
      });
      var eta_ready = result.getValue({
        name: "custrecord_advs_vm_eta"
      });
      var notesms = result.getValue({
        name: "custrecord_advs_notes_ms_tm"
      });
      var aging_contr = result.getValue({
        name: "custrecord_advs_aging_contract"
      });
      var isOldVehicle = result.getValue({
        name: "custrecord_is_old_vehicle"
      });
      var isDiscounttoApply = result.getValue({
        name: "custrecord_is_discount_applied"
      });
	  //SOFTHOLD FIELDS 
          var sh_depo_inception = result.getValue({
            name: "custrecord_advs_deposit_inception"
          });
          var sh_payment_inc = result.getValue({
            name: "custrecord_advs_payment_inception"
          });
          log.debug("total incep", result.getValue({
            name: "custrecord_advs_total_inception"
          }))
          var sh_total_inc = result.getValue({
            name: "custrecord_advs_total_inception"
          })||0;
          var sh_terms = result.getValue({
            name: "custrecord_advs_buck_terms1"
          });
          var sh_payterm1 = result.getValue({
            name: "custrecord_advs_payment_2_131"
          });var sh_payterm2 = result.getValue({
            name: "custrecord_advs_payment_14_25"
          });var sh_payterm3 = result.getValue({
            name: "custrecord_advs_payment_26_37"
          });var sh_payterm4 = result.getValue({
            name: "custrecord_advs_payment_38_49"
          });var sh_purchase_option = result.getValue({
            name: "custrecord_advs_pur_option"
          });var sh_contract_total = result.getValue({
            name: "custrecord_advs_contract_total"
          });var sh_reg_fee = result.getValue({
            name: "custrecord_advs_registration_fees_bucket"
          });
          var sh_grandtotal = result.getValue({
            name: "custrecord_advs_grand_total_inception"
          });
          
           var sh_depo_inception1 = result.getValue({
            name: "custrecord_advs_deposit_inception1"
          });
          var sh_payment_inc1 = result.getValue({
            name: "custrecord_advs_deposit_discount1"
          });
          /* log.debug("total incep", result.getValue({
            name: "custrecord_advs_payment_inception_1"
          })) */
          var sh_total_inc1 = result.getValue({
            name: "custrecord_advs_total_inception1"
          })||0;
          var sh_terms1 = result.getValue({
            name: "custrecord_advs_buck_terms1_1"
          });
          var sh_payterm1_1 = result.getValue({
            name: "custrecord_advs_payment_2_131_1"
          });var sh_payterm2_1 = result.getValue({
            name: "custrecord_advs_payment_14_25_1"
          });var sh_payterm3_1 = result.getValue({
            name: "custrecord_advs_payment_26_37_1"
          });var sh_payterm4_1 = result.getValue({
            name: "custrecord_advs_payment_38_49_1"
          });var sh_purchase_option1 = result.getValue({
            name: "custrecord_advs_pur_option_1"
          });var sh_contract_total1 = result.getValue({
            name: "custrecord_advs_contract_total_1"
          });var sh_reg_fee1 = result.getValue({
            name: "custrecord_advs_registration_fe_bucket_1"
          });
          var sh_grandtotal_1 = result.getValue({
            name: "custrecord_advs_grand_total_inception_1"
          });
          var sh_bucket1 = result.getValue({
            name: "custrecord_advs_bucket_1"
          });
          var sh_bucket2 = result.getValue({
            name: "custrecord_advs_bucket_2"
          });
      /*  var invdepositLink = result.getText({
         name: "custrecord_advs_in_dep_trans_link",
         join: "CUSTRECORD_ADVS_IN_DEP_VIN",
       });

       var InvSales = result.getText({
         name: "custrecord_advs_in_dep_sales_rep",
         join: "CUSTRECORD_ADVS_IN_DEP_VIN"
       }); */

      var obj = {};
      obj.id = vinId;
      obj.vinName = vinText;
      obj.modelid = modelId;
      obj.brand = vehicleBrand;
      obj.locid = locId;
      obj.locIdval = locIdval;
      obj.modelyr = modelYr;
      obj.bucketId = bucketId;
      obj.bucketIdText = bucketIdText;
      obj.stockdt = stockdt;
      obj.Statusdt = Statusdt;
      obj.Statusdtval = Statusdtval;
      obj.Mileagedt = Mileagedt;
      obj.Transdt = Transdt;
      obj.Enginedt = Enginedt;
      obj.Customerdt = Customerdt;
      obj.salesrepdt = salesrepdt;
      obj.salesrepid = salesrepid;
      obj.extclrdt = extclrdt;
      obj.titleRestdt = titleRestdt;
      obj.DateTruckRdydt = DateTruckRdydt;
      obj.DateTruckLockupdt = DateTruckLockupdt;
      obj.DateTruckAgingdt = DateTruckAgingdt;
      obj.DateOnsitedt = DateOnsitedt;
      obj.isdepositCreated = isdepositCreated;
      obj.sleepersize = sleepersize;
      obj.apu = apu;
      obj.beds = beds;
      obj.istruckready = istruckready;
      obj.iswashed = iswashed;
      /* obj.invdepositLink = invdepositLink;
      obj.InvSales = InvSales; */
      obj.singlebunk = singlebunk;
      obj.Transport = Transport;
      obj.Inspected = Inspected;
      obj.ApprRepDate = ApprRepDate;
      obj.Picture1 = Picture1;
      obj.admin_notes = admin_notes;
      obj.body_style = body_style;
      obj.eta_ready = eta_ready;
      obj.notesms = notesms;
      obj.aging_contr = aging_contr;
      obj.isOldVehicle = isOldVehicle;
      obj.isDiscounttoApply = isDiscounttoApply;
      obj.bucketchildsIds = bucketchildsIds;
      obj.bucketchilds = bucketchilds;

      obj.sh_depo_inception = sh_depo_inception;
      obj.sh_payment_inc = sh_payment_inc;
      obj.sh_total_inc = sh_total_inc;
      obj.sh_terms = sh_terms;
      obj.sh_payterm1 = sh_payterm1;
      obj.sh_payterm2 = sh_payterm2;
      obj.sh_payterm3 = sh_payterm3;
      obj.sh_payterm4 = sh_payterm4;
      obj.sh_purchase_option = sh_purchase_option;
      obj.sh_contract_total = sh_contract_total;
      obj.sh_reg_fee = sh_reg_fee;
      obj.sh_grandtotal = sh_grandtotal;

      obj.sh_depo_inception1 = sh_depo_inception1;
      obj.sh_payment_inc1 = sh_payment_inc1;
      obj.sh_total_inc1 = sh_total_inc1;
      obj.sh_terms1 = sh_terms1;
      obj.sh_payterm1_1 = sh_payterm1_1;
      obj.sh_payterm2_1 = sh_payterm2_1;
      obj.sh_payterm3_1 = sh_payterm3_1;
      obj.sh_payterm4_1 = sh_payterm4_1;
      obj.sh_purchase_option1 = sh_purchase_option1;
      obj.sh_contract_total1 = sh_contract_total1;
      obj.sh_reg_fee1 = sh_reg_fee1;
      obj.sh_grandtotal_1 = sh_grandtotal_1;
      obj.sh_bucket1 = sh_bucket1;
      obj.sh_bucket2 = sh_bucket2;

      if (bucketId) {
        if (uniqueBucket.indexOf(bucketId) == -1) {
          uniqueBucket.push(bucketId);
        }
      }

      var bucketchilds1 = bucketchilds.split(',');
      for (var io = 0; io < bucketchilds1.length; io++) {
        if (bucketchildsIds.indexOf(bucketchilds1[io]) == -1) {
          bucketchildsIds.push(bucketchilds1[io]);
        }
      }


      obj.incepdiscount = 0;
      if (bucketId) {
        var _discount = search.lookupFields({
          type: 'customrecord_ez_bucket_calculation',
          id: bucketId,
          columns: ['custrecord_discount']
        });
        _discount.custrecord_discount || 0;
        obj.incepdiscount = _discount.custrecord_discount || 0;
      }

      vmDataResults.push(obj);

      return true;

    });
    log.debug('bucketchildsIds', bucketchildsIds);
    log.debug('uniqueBucket.leng', uniqueBucket.length)
    if (uniqueBucket.length > 0) {

      var bucketCalcSearchFilters = [
        ["isinactive", "is", "F"],
        "AND",
        ["custrecord_bucket_calc_parent_link", "anyof", uniqueBucket]
      ];

      if (freqId) {
        bucketCalcSearchFilters.push("AND");
        bucketCalcSearchFilters.push(["custrecord_advs_b_c_chld_freq", "anyof", freqId]);
      }
      if (bucketchildsIds.length) {
        bucketCalcSearchFilters.push("AND");
        bucketCalcSearchFilters.push(["internalid", "anyof", bucketchildsIds]);
      }
      var bucketCalcSearch = search.create({
        type: "customrecord_bucket_calculation_location",
        filters: bucketCalcSearchFilters,
        columns: [
          search.createColumn({
            name: "name",
            sort: search.Sort.ASC,
            label: "Name"
          }),
          search.createColumn({
            name: "internalid",
            label: "ID"
          }),
          search.createColumn({
            name: "custrecord_advs_b_c_c_model",
            label: "Model"
          }),
          search.createColumn({
            name: "custrecord_bucket_calc_parent_link",
            label: "Parent Link"
          }),
          search.createColumn({
            name: "custrecord_advs_b_c_c_dep_inception",
            label: "Deposit Inception"
          }),
          search.createColumn({
            name: "custrecord_advs_b_c_c_pay_incep",
            label: "Payment Inception"
          }),
          search.createColumn({
            name: "custrecord_advs_b_c_c_ttl_incep",
            label: "Total Inception"
          }),
          search.createColumn({
            name: "custrecord_advs_b_c_c_terms",
            label: "Terms"
          }),
          search.createColumn({
            name: "custrecord_advs_b_c_c_pay_2_13",
            label: "Payments 2-13"
          }),
          search.createColumn({
            name: "custrecord_advs_b_c_c_pay_14",
            label: "Payments 14-25"
          }),
          search.createColumn({
            name: "custrecord_advs_b_c_c_26_37",
            label: "Payments 26_37"
          }),
          search.createColumn({
            name: "custrecord_advs_b_c_c_pay_38_49",
            label: "Payments 38_49"
          }),
          search.createColumn({
            name: "custrecord_advs_b_c_c_pur_option",
            label: "Purchase Option"
          }),
          search.createColumn({
            name: "custrecord_advs_b_c_chld_freq",
            label: "Frequency"
          }),
          search.createColumn({
            name: "custrecord_advs_buc_chld_sales_channel",
            label: "Sales channel"
          }),
          search.createColumn({
            name: "custrecord_advs_b_c_c_cont_tot",
            label: "Sales channel"
          })

        ]
      });
      log.debug('bucketCalcSearch count', bucketCalcSearch.runPaged().count)

      bucketCalcSearch.run().each(function (result) {
        var bucketId = result.getValue({
          name: "custrecord_bucket_calc_parent_link"
        });
        var bucketIdText = result.getText({
          name: "custrecord_bucket_calc_parent_link"
        });
        var buckidCh = result.getValue({
          name: "internalid"
        });

        var depositIncep = result.getValue({
          name: "custrecord_advs_b_c_c_dep_inception"
        });
        var payIncep = result.getValue({
          name: "custrecord_advs_b_c_c_pay_incep"
        });
        var ttlIncep = result.getValue({
          name: "custrecord_advs_b_c_c_ttl_incep"
        });
        var terms = result.getValue({
          name: "custrecord_advs_b_c_c_terms"
        })
        var Sch_2_13 = result.getValue({
          name: "custrecord_advs_b_c_c_pay_2_13"
        }) * 1;
        var Sch_14_26 = result.getValue({
          name: "custrecord_advs_b_c_c_pay_14"
        }) * 1;
        var Sch_26_37 = result.getValue({
          name: "custrecord_advs_b_c_c_26_37"
        }) * 1;
        var Sch_38_49 = result.getValue({
          name: "custrecord_advs_b_c_c_pay_38_49"
        }) * 1;
        var purOption = result.getValue({
          name: "custrecord_advs_b_c_c_pur_option"
        }) * 1;
        var contTot = result.getValue({
          name: "custrecord_advs_b_c_c_cont_tot"
        }) * 1;
        var FREQ = result.getText({
          name: "custrecord_advs_b_c_chld_freq"
        });
        var saleCh = result.getText({
          name: "custrecord_advs_buc_chld_sales_channel"
        });
        var bucketchildname = result.getValue({
          name: "name"
        });

        var index = 0;
        if (bucketData[bucketId] != null && bucketData[bucketId] != undefined) {
          index = bucketData[bucketId].length;
          log.debug('bucketData[bucketId]', bucketId);
        } else {
          bucketData[bucketId] = new Array();
        }

        bucketData[bucketId][index] = new Array();
        bucketData[bucketId][index]["id"] = buckidCh;
        bucketData[bucketId][index]["DEPINSP"] = depositIncep;
        bucketData[bucketId][index]["PAYINSP"] = payIncep;
        bucketData[bucketId][index]["TTLINSP"] = ttlIncep;
        bucketData[bucketId][index]["TRMS"] = terms;
        bucketData[bucketId][index]["2_13"] = Sch_2_13;
        bucketData[bucketId][index]["14_26"] = Sch_14_26;
        bucketData[bucketId][index]["26_37"] = Sch_26_37;
        bucketData[bucketId][index]["26_37"] = Sch_26_37;
        bucketData[bucketId][index]["38_49"] = Sch_38_49;
        bucketData[bucketId][index]["purOptn"] = purOption;
        bucketData[bucketId][index]["conttot"] = contTot;
        bucketData[bucketId][index]["freq"] = FREQ;
        bucketData[bucketId][index]["saleCh"] = saleCh;

        if (bucketId) {
          var objj = {};
          objj.bucketId = bucketId;
          objj.bucketIdText = bucketIdText;
          objj.id = buckidCh;
          objj.DEPINSP = depositIncep;
          objj.PAYINSP = payIncep;
          objj.TTLINSP = ttlIncep;
          objj.TRMS = terms;
          objj.twotothirteen = Sch_2_13 || '';
          objj.forteentotwentysix = Sch_14_26 || '';
          objj.twosixtothreenseven = Sch_26_37 || '';
          objj.twosixtothreenseven = Sch_26_37 || '';
          objj.threeeighttoforunine = Sch_38_49 || '';
          objj.purOptn = purOption;
          objj.conttot = contTot;
          objj.freq = FREQ;
          objj.saleCh = saleCh;
          objj.bucketchildname = bucketchildname;
          indarr.push(objj);
        }
        return true;
      });
    }
    var objres = {};
    objres.vmDataResults = vmDataResults || {};
    objres.bucketData = bucketData || {};
    objres.bucketDatat = indarr || {};
    return objres;
  }

  function deleiveryData() {
    try {
      var Deliveryboardsearch = search.create({
        type: "customrecord_advs_vm_inv_dep_del_board",
        filters: [
          ["isinactive", "is", "F"],
          "AND",
          ["custrecord_advs_in_dep_vin.custrecord_advs_vm_reservation_status", "noneof", "13"],
          "AND",
          // ["custrecord_advs_in_dep_sales_quote", "is", "T"],
          // "AND",
          ["custrecord_advs_in_dep_trans_link", "noneof", "@NONE@"]
        ],
        columns: [
          search.createColumn({
            name: "custrecord_advs_in_dep_location",
            label: "Location"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_name",
            label: "Name"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_sales_rep",
            label: "SALESMAN"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_eta",
            label: "ETA"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_days_close_deal",
            label: "Days To Close Deal "
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_insur_application",
            label: "Insurance Application"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_clear_delivery",
            label: "Cleared For Delivery"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_vin",
            label: "VIN"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_truck_ready",
            label: "Truck Ready"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_washed",
            label: "Washed"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_tot_lease_incepti",
            label: "Total lease Inception"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_deposit",
            label: "Deposit"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_pu_payment",
            label: "P/U Payment"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_balance",
            label: "Balance"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_mc_oo",
            label: "MC/OO"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_sales_quote",
            label: "Sales Quote"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_contract",
            label: "Contract"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_notes",
            label: "Notes"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_exceptions",
            label: "Exceptions"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_trans_link",
            label: "Deposit Link"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_registration_fee",
            label: "Registration Fee"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_title_fee",
            label: "Title Fee"
          }), search.createColumn({
            name: "custrecord_advs_in_dep_pickup_fee",
            label: "Pickup Fee"
          }),
        ]
      });


      var searchResultCount = Deliveryboardsearch.runPaged().count;
      var count = 0;
      var delivery = [];
      Deliveryboardsearch.run().each(function (result) {
        var obj = {};
        obj.deliverylocation = result.getText({
          name: 'custrecord_advs_in_dep_location'
        }) || '';
        obj.deliverycustomer = result.getText({
          name: 'custrecord_advs_in_dep_name'
        }) || '';

        obj.deliverysalesrep = result.getText({
          name: 'custrecord_advs_in_dep_sales_rep'
        }) || ' ';

        obj.deliveryDate = result.getValue({
          name: 'custrecord_advs_in_dep_eta'
        }) || ' ';

        obj.deliveryclosedeal = result.getValue({
          name: 'custrecord_advs_in_dep_days_close_deal'
        }) || ' ';
        obj.deliveryinsurance = result.getValue({
          name: 'custrecord_advs_in_dep_insur_application'
        }) || '';

        obj.depcleardelivery = result.getValue({
          name: 'custrecord_advs_in_dep_clear_delivery'
        }) || ' ';

        obj.deliveryVin = result.getText({
          name: 'custrecord_advs_in_dep_vin'
        }) || '';

        obj.deliverytruckready = result.getValue({
          name: 'custrecord_advs_in_dep_truck_ready'
        }) || '';
        obj.deliveryWashed = result.getValue({
          name: 'custrecord_advs_in_dep_washed'
        }) || '';

        obj.deliverytotlease = result.getValue({
          name: 'custrecord_advs_in_dep_tot_lease_incepti'
        }) || '';

        obj.deliverydeposit = result.getValue({
          name: 'custrecord_advs_in_dep_deposit'
        }) || '';

        obj.deliverypupayment = result.getValue({
          name: 'custrecord_advs_in_dep_pu_payment'
        }) || '';

        obj.deliverybalance = result.getValue({
          name: 'custrecord_advs_in_dep_balance'
        }) || '';

        obj.deliverymcoo = result.getText({
          name: 'custrecord_advs_in_dep_mc_oo'
        }) || '';

        obj.deliverymsalesquote = result.getValue({
          name: 'custrecord_advs_in_dep_sales_quote'
        }) || '';


        obj.deliverycontract = result.getText({
          name: 'custrecord_advs_in_dep_contract'
        }) || '';

        obj.deliverynotes = result.getValue({
          name: 'custrecord_advs_in_dep_notes'
        }) || '';

        obj.deliveryexception = result.getValue({
          name: 'custrecord_advs_in_dep_exceptions'
        }) || '';

        obj.deliverydepolink = result.getValue({
          name: 'custrecord_advs_in_dep_trans_link'
        }) || '';
        obj.deliverydepotext = result.getText({
          name: 'custrecord_advs_in_dep_trans_link'
        }) || '';

        obj.registrationfee = result.getValue({
          name: 'custrecord_advs_in_dep_registration_fee'
        }) || 0;
        obj.titlefee = result.getValue({
          name: 'custrecord_advs_in_dep_title_fee'
        }) || 0;
        obj.pickupfee = result.getValue({
          name: 'custrecord_advs_in_dep_pickup_fee'
        }) || 0;
        delivery.push(obj);
        count++;
        return true;
      });
      return delivery;
    } catch (e) {
      log.debug('error', e.toString());
    }
  }

  function getHtmlContent() {
    var locationData = [];
    var bucketData = [];
    var statusData = [];

    //  location data
    var locationSearchObj = search.create({
      type: "location",
      filters: [
        ["isinactive", "is", "F"],
        "AND",
        ["custrecordadvs_loc_notallow_summary_dash", "is", "F"]
      ],
      columns: [
        search.createColumn({
          name: "name",
          label: "Name"
        }),
        search.createColumn({
          name: "internalid",
          label: "Internal ID"
        })
      ]
    });
    locationSearchObj.run().each(function (result) {
      locationData.push({
        id: result.getValue("internalid"),
        name: result.getValue("name")
      });
      return true;
    });
    // bucket data
    var bucketSearchObj = search.create({
      type: "customrecord_ez_bucket_calculation",
      filters: [
        ["isinactive", "is", "F"]
      ],
      columns: [
        search.createColumn({
          name: "name",
          label: "Name"
        }),
        search.createColumn({
          name: "internalid",
          label: "Internal ID"
        })
      ]
    });
    bucketSearchObj.run().each(function (result) {
      bucketData.push({
        id: result.getValue("internalid"),
        name: result.getValue("name")
      });
      return true;
    });
    //  status data
    var internalIds = ["23", "21", "20", "19", "22"];
    var statusSearchObj = search.create({
      type: "customlist_advs_reservation_status",
      filters: [
        ["isinactive", "is", "F"],
        "AND",
        ["internalid", "anyof", internalIds]
      ],
      columns: [
        search.createColumn({
          name: "name",
          label: "Name"
        }),
        search.createColumn({
          name: "internalId",
          label: "Internal ID"
        })
      ]
    });
    statusSearchObj.run().each(function (result) {
      statusData.push({
        id: result.getValue("internalId"),
        name: result.getValue("name")
      });
      return true;
    });
    // from vm  location, status, and bucket
    var vehicleCount = {};
    //withoutlocation
    var vehcountobj = {};
    var vehicleSearchObj = search.create({
      type: "customrecord_advs_vm",
      filters: [
        ["isinactive", "is", "F"]
      ],
      columns: [
        search.createColumn({
          name: "custrecord_advs_vm_location_code",
          label: "Location"
        }),
        search.createColumn({
          name: "custrecord_advs_vm_reservation_status",
          label: "Truck Internal Status"
        }),
        search.createColumn({
          name: "custrecord_vehicle_master_bucket",
          label: "Bucket Calculation"
        })
      ]
    });
    vehicleSearchObj.run().each(function (result) {
      var location = result.getValue("custrecord_advs_vm_location_code");
      var status = result.getValue("custrecord_advs_vm_reservation_status");
      var bucket = result.getValue("custrecord_vehicle_master_bucket");
      if (!vehicleCount[location]) {
        vehicleCount[location] = {};
      }
      if (!vehicleCount[location][status]) {
        vehicleCount[location][status] = {};
      }
      if (!vehicleCount[location][status][bucket]) {
        vehicleCount[location][status][bucket] = 0;
      }
      vehicleCount[location][status][bucket] += 1;
      return true;
    });
    vehicleSearchObj.run().each(function (result) {
      var location = result.getValue("custrecord_advs_vm_location_code");
      var status = result.getValue("custrecord_advs_vm_reservation_status");
      var bucket = result.getValue("custrecord_vehicle_master_bucket");
      if (!vehcountobj[status]) {
        vehcountobj[status] = {};
      }
      if (!vehcountobj[status][bucket]) {
        vehcountobj[status][bucket] = 0;
      }
      vehcountobj[status][bucket] += 1;
      return true;
    });

    // Generate HTML content
    var htmlContent = "<!DOCTYPE html>\n" +
      "<html lang=\"en\">\n" +
      "<head>\n" +
      "    <meta charset=\"UTF-8\">\n" +
      "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
      "    <title>Lease Account Statement</title>\n" +
      "    <style>\n" +
      // "        body { font-family: Arial, sans-serif; margin-top:10px; }\n" +
      "        .containerdiv { display: flex; width: 100%; }\n" +
      "        .left, .right { padding: 10px; }\n" +
      "        .left { flex: 50%; }\n" +
      "        .right { flex: 50%; }\n" +
      "        .summdash { height: 50%; width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 12px; }\n" +
      "        .summdash td { padding: 5px; text-align:center; }\n" +
      "        .summdash th { padding: 2px; text-align: center; background-color: #f4b400; color: black; }\n" +
      "        .total-row { font-weight: bold; }\n" +
      "        .table-container { margin-bottom: 10px; }\n" +
      "        #piechart{flex: 50%;}\n" +
      "    </style>\n" +
      "</head>\n" +
      "<body>\n" +
      "<div class=\"containerdiv\">\n" +
      "<div class=\"left\">\n";

    htmlContent += " <div class=\"table-container\">\n" +
      "            <!-- <div class=\"section-title\"></div> -->\n" +
      "            <table class='summdash'>\n" +
      "                <thead>\n" +
      "                    <tr>\n" +
      "                        <th style=\"width:10%;text-align:left;\">Total</th>\n";
    bucketData.forEach(function (buck) {
      htmlContent += "<th style=\"width:5%\">" + buck.name + "</th>\n";
    })
    htmlContent += "<th style=\"width:5%\">Total</th>\n" +
      "                    </tr>\n" +
      "                </thead>\n" +
      "                <tbody>\n";
    statusData.forEach(function (status, index) {
      var style = (index % 2 !== 0) ? "background-color:#ADD8E6;" : "";
      htmlContent += "<tr style=\"" + style + "\">\n" +
        "<td style=\"text-align:left;\">" + status.name + "</td>\n";

      var totalForStatus = 0;

      // Iterate over bucketData for each status
      bucketData.forEach(function (buck) {
        var count = vehcountobj[status.id] && vehcountobj[status.id][buck.id] ? vehcountobj[status.id][buck.id] : 0;
        htmlContent += "<td>" + count + "</td>\n";
        totalForStatus += count;
      });

      htmlContent += "<td>" + totalForStatus + "</td>\n" +
        "</tr>\n";
    });
    var grandTotal = 0;
    htmlContent += "<tr class=\"total-row\" style=\"background-color:#ADD8E6;\">\n" +
      "<td style=\"text-align:left\">Total</td>\n";
    // Iterate over bucketData to calculate total counts
    bucketData.forEach(function (buck) {
      var totalForBucket = 0;
      statusData.forEach(function (status) {
        totalForBucket += vehcountobj[status.id] && vehcountobj[status.id][buck.id] ? vehcountobj[status.id][buck.id] : 0;
      });
      grandTotal += totalForBucket;
      htmlContent += "<td>" + totalForBucket + "</td>\n";
    });


    htmlContent += "<td>" + grandTotal + "</td>\n" +
      "</tr>\n" +
      "</tbody>\n" +
      "</table>\n" +
      "</div>\n";


    locationData.forEach(function (loc) {
      htmlContent += "<div class=\"table-container\">\n" +
        "<table class='summdash'>\n" +
        "<thead>\n" +
        "<tr>\n" +
        "<th style=\"width:10%;text-align:left;\">" + loc.name + "</th>\n";

      bucketData.forEach(function (buck) {
        htmlContent += "<th style=\"width:5%\">" + buck.name + "</th>\n";
      });

      htmlContent += "<th style=\"width:5%\">Total</th>\n" +
        "</tr>\n" +
        "</thead>\n" +
        "<tbody>\n";


      statusData.forEach(function (status, index) {
        var style = (index % 2 !== 0) ? "background-color:#ADD8E6;" : "";
        htmlContent += "<tr style=\"" + style + "\">\n" +
          "<td style=\"text-align:left;\">" + status.name + "</td>\n";

        var totalForStatus = 0;
        bucketData.forEach(function (buck) {
          var count;
          if (vehicleCount[loc.id] && vehicleCount[loc.id][status.id] && vehicleCount[loc.id][status.id][buck.id]) {
            count = vehicleCount[loc.id][status.id][buck.id];
          } else {
            count = 0;
          }
          htmlContent += "<td>" + count + "</td>\n";
          totalForStatus += count;
        });
        htmlContent += "<td>" + totalForStatus + "</td>\n" +
          "</tr>\n";
      });

      // htmlContent += "<tr class=\"total-row\" style=\"background-color:#ADD8E6;\">\n" +
      //     "<td style=\"text-align:left\">Total</td>\n" +
      //     "<td > need  totalforbucket 1 </td>\n" +
      //     "<td > need totalforbucket 2 </td>\n" +
      //     "<td > need total of all totalForStatus </td>\n" +
      //     "</tr>\n" +
      //     "</tbody>\n" +
      //     "</table>\n" +
      //     "</div>\n";

      var totalBucketCounts = {};
      var grandTotal = 0;

      bucketData.forEach(function (buck) {
        var totalForBucket = 0;

        statusData.forEach(function (status) {
          if (vehicleCount[loc.id] && vehicleCount[loc.id][status.id] && vehicleCount[loc.id][status.id][buck.id]) {
            totalForBucket += vehicleCount[loc.id][status.id][buck.id];
          }
        });

        totalBucketCounts[buck.id] = totalForBucket;
        grandTotal += totalForBucket;
      });

      htmlContent += "<tr class=\"total-row\" style=\"background-color:#ADD8E6;\">\n" +
        "<td style=\"text-align:left\">Total</td>\n";

      bucketData.forEach(function (buck) {
        htmlContent += "<td>" + totalBucketCounts[buck.id] + "</td>\n";
      });

      htmlContent += "<td>" + grandTotal + "</td>\n" +
        "</tr>\n" +
        "</tbody>\n" +
        "</table>\n" +
        "</div>\n";
    });
    //right-side container
    htmlContent += "</div>\n" +
      "<div class=\"right\">\n" +
      " <div class=\"table-container\">\n" +
      "    <table class='summdash'>\n" +
      "        <thead>\n" +
      "            <tr>\n" +
      "                <th  style=\"width:10%;text-align:left;\">Total</th>\n";
    bucketData.forEach(function (buck) {
      htmlContent += "<th style=\"width:5%\">" + buck.name + "</th>\n";
    })
    htmlContent += "<th style=\"width:5%\">Total</th>\n" +
      "            </tr>\n" +
      "        </thead>\n" +
      "        <tbody>\n";
    statusData.forEach(function (status, index) {
      var style = (index % 2 !== 0) ? "background-color:#ADD8E6;" : "";
      htmlContent += "<tr style=\"" + style + "\">\n" +
        "<td style=\"text-align:left;\">" + status.name + "</td>\n";
      htmlContent += "<td>0</td>\n" +
        "                <td>0</td>\n" +
        "                <td>0</td>\n" +
        "                <td>0</td>\n" +
        "                <td>0</td>\n" +
        "            </tr>\n";
    })
    htmlContent += "<tr class=\"total-row\" style=\"background-color:#ADD8E6;\">\n" +
      "                <td style=\"text-align:left\">TOTAL</td>\n" +
      "                <td>0</td>\n" +
      "                <td>0</td>\n" +
      "                <td>0</td>\n" +
      "                <td>0</td>\n" +
      "                <td>0</td>\n" +
      "            </tr>\n" +
      "        </tbody>\n" +
      "    </table>\n" +
      "    </div>\n" +
      //pie_chart
      " <div class=\"table-container\">\n" +
      "    <div id=\"piechart\" >\n" +
      "    <script type=\"text/javascript\" src=\"https://www.gstatic.com/charts/loader.js\"></script>\n" +
      "    <script type=\"text/javascript\">\n" +
      "        // Load google charts\n" +
      "        google.charts.load('current', { 'packages': ['corechart'] });\n" +
      "        google.charts.setOnLoadCallback(drawChart);\n" +
      "        function drawChart() {\n" +
      "            var data = google.visualization.arrayToDataTable([\n" +
      "                ['year', 'no'],\n" +
      "                ['2020', 70],\n" +
      "                ['2019', 60],\n" +
      "                ['2018', 22],\n" +
      "                ['2017', 40],\n" +
      "                ['2016', 52],\n" +
      "                ['2015', 38]\n" +
      "            ]);\n" +
      "            // Optional; add a title and set the width and height of the chart\n" +
      "            var options = { 'title': 'AVAILABLE TRUCK FOR YEAR', 'width':700, 'height': 500 };\n" +
      "            // Display the chart inside the <div> element with id=\"piechart\"\n" +
      "            var chart = new google.visualization.PieChart(document.getElementById('piechart'));\n" +
      "            chart.draw(data, options);\n" +
      "        }\n" +
      "    </script>\n" +
      "</div>\n" +
      "</div>\n" +
      "</div>\n" +
      "</div>\n" +
      "</body>\n" +
      "</html>";
    return encodeURIComponent(htmlContent);
  }

  return {
    'onRequest': onRequest
  };

});
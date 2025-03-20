/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope public
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/format'],
  /**
   * @param{record} record
   * @param{runtime} runtime
   * @param{search} search
   * @param{serverWidget} serverWidget
   */
  (record, runtime, search, serverWidget, url, format) => {
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

        var currScriptObj = runtime.getCurrentScript();

        // Parameters
        var pageSize = 10; // Set your preferred page size
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
        var scriptId = currScriptObj.id;
        var deploymentId = currScriptObj.deploymentId;

        // log.debug("scriptId",scriptId+"=>"+deploymentId);

        var startIndex = parseInt(request.parameters.start) || 0;
        if (flagpara2) { //
          var form = serverWidget.createForm({
            title: "Swap",
            hideNavBar: true
          });
        } else {
          var form = serverWidget.createForm({
            title: "Inventory"
          });
        }

        var filterGp = form.addFieldGroup({
          id: "custpage_fil_gp",
          label: "Filters"
        });
        var _inventoyCount = 0;



        var brandFldObj = form.addField({
          id: "custpage_brand",
          type: serverWidget.FieldType.SELECT,
          label: "Brand",
          source: "customrecord_advs_brands",
          container: "custpage_fil_gp"
        })
        /* .updateDisplayType({
                        displayType: "hidden"
                    }); */
        var modelFldObj = form.addField({
          id: "custpage_model",
          type: serverWidget.FieldType.SELECT,
          label: "Model",
          container: "custpage_fil_gp"
        });
        modelFldObj.addSelectOption({
          value: '',
          text: ''
        });
        var locFldObj = form.addField({
          id: "custpage_location",
          type: serverWidget.FieldType.SELECT,
          label: "Location",
          source: "Location",
          container: "custpage_fil_gp"
        });
        var bucketFldObj = form.addField({
          id: "custpage_bucket",
          type: serverWidget.FieldType.SELECT,
          label: "Bucket",
          source: "customrecord_ez_bucket_calculation",
          container: "custpage_fil_gp"
        })
        /* .updateDisplayType({
                        displayType: "hidden"
                    }); */
        var freqFldObj = form.addField({
          id: "custpage_freq",
          type: serverWidget.FieldType.SELECT,
          label: "Frequency",
          source: "customrecord_advs_st_frequency",
          container: "custpage_fil_gp"
        });
        var vinFldObj = form.addField({
          id: "custpage_vin",
          type: serverWidget.FieldType.SELECT,
          label: "Vin #",
          source: "customrecord_advs_vm",
          container: "custpage_fil_gp"
        });
        var OldVinFieldObj = form.addField({
          id: 'custpage_old_vin_id',
          type: serverWidget.FieldType.SELECT,
          label: "Old Vin #",
          source: "customrecord_advs_vm",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });
        var LeaseFieldObj = form.addField({
          id: 'custpage_old_lease_id',
          type: serverWidget.FieldType.SELECT,
          label: "Lease #",
          source: "customrecord_advs_lease_header",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });
        var IframeCenterFieldObj = form.addField({
          id: 'custpage_i_frame_obj',
          type: serverWidget.FieldType.TEXT,
          label: "IFrame Obj",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });
        var Flagpara2FieldObj = form.addField({
          id: 'custpage_flag_para_obj',
          type: serverWidget.FieldType.INTEGER,
          label: "Flag para #",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });

        var vmSearchObj = InventorySearch(brandId, modelId, locatId, bucketId, freqId, vinID, LeaseHeaderId, iFrameCenter, flagpara2, Old_Vin_From_lease, brandFldObj, modelFldObj, locFldObj, bucketFldObj, freqFldObj, vinFldObj, LeaseFieldObj, IframeCenterFieldObj, Flagpara2FieldObj, OldVinFieldObj)
        var searchObj = vmSearchObj.runPaged({
          pageSize: pageSize,
        });
        var searchObj = vmSearchObj.runPaged({
          pageSize: pageSize,
        });
        //	_inventoyCount = searchObj.count;
        /* var subTab = form.addSubtab({
                id: "custpage_veh_tab",
                label: "Inventory"//+searchObj.count
            }); */
        // log.debug("searchObj", pageSize + "==>" + searchObj.count);

        var pageCount = Math.ceil(searchObj.count / pageSize);
        // log.debug("searchObjCount", searchObj.count + "==>" + pageCount);

        // Set pageId to correct value if out of index
        if (!pageId || pageId == '' || pageId < 0)
          pageId = 0;
        else if (pageId >= pageCount)
          pageId = pageCount - 1;


        var addResults = [{}];
        if (searchObj.count > 0) {
          addResults = fetchSearchResult(searchObj, pageId, freqId);
        } else {
          var addResults = [{}];
        }
        log.debug('searchObj.count', searchObj.count);
        var _inventoyCount = addResults.length || 0;
        var subTab = form.addSubtab({
          id: "custpage_veh_tab",
          label: "Inventory(" + _inventoyCount + ")"
        });

        var subTab3 = form.addSubtab({
          id: "custpage_delivery_tab",
          label: "Delivery Board"
        });

        // Add drop-down and options to navigate to specific page
        var selectOptions = form.addField({
          id: 'custpage_pageid',
          label: 'Page Index',
          type: serverWidget.FieldType.SELECT,
          container: "custpage_veh_tab"
        });
        selectOptions.updateDisplayType({
          displayType: "hidden"
        })



        var html_fld = form.addField({
          id: 'custpage_custscript',
          type: 'inlinehtml',
          label: ' '
        });

        var inlineHTML = form.addField({
          id: "custpage_inlinehtml",
          type: serverWidget.FieldType.INLINEHTML,
          label: " "
        });
        inlineHTML.defaultValue = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';
        //var table = "<link rel='stylesheet' href='https://system.netsuite.com/c.TSTDRV1064792/suitebundle178234/Agenda%20New/Customer_message_css.css'>" +
        var sht = '';
        sht = "<script>" +
          "function popupCenter(pageURL, title,w,h) {debugger;" +
          "var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1644&deploy=1&repo='+pageURL;" +
          "var left = (screen.width/2)-(900/2);" +
          "var top = (screen.height/2)-(500/2);" +
          "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
          "}" +


          "function depositcreation(pageURL, title,w,h,) {debugger;" +
          "var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1649&deploy=1&vinid='+pageURL;" +
          "var left = (screen.width/2)-(900/2);" +
          "var top = (screen.height/2)-(500/2);" +
          "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
          "}" +


          "</script>";
        html_fld.defaultValue = sht;
        var sublist = form.addSublist({
          id: "custpage_sublist",
          type: serverWidget.SublistType.LIST,
          label: "List",
          tab: "custpage_veh_tab"
        });
        if (flagpara2) {
          sublist.addField({
            id: "cust_select_veh_card",
            type: serverWidget.FieldType.CHECKBOX,
            label: "Select Vehicle"
          });
        } else {
          sublist.addField({
            id: "cust_list_veh_card",
            type: serverWidget.FieldType.TEXT,
            label: "Quick Deal"
          }).updateDisplayType({
            displayType: "inline"
          });
        }

        sublist.addField({
          id: "cust_list_veh_delivey",
          type: serverWidget.FieldType.TEXT,
          label: "Create Deposit"
        }).updateDisplayType({
          displayType: "inline"
        });

        sublist.addField({
          id: "cust_select_checkbox_highlight",
          type: serverWidget.FieldType.CHECKBOX,
          label: "Mark"
        }).updateDisplayType({
          displayType: "hidden"
        });

        sublist.addField({
          id: "custpabe_m_stock",
          type: serverWidget.FieldType.SELECT,
          label: "Stock #",
          source: "customrecord_cseg_advs_sto_num"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_status",
          type: serverWidget.FieldType.SELECT,
          label: "Status",
          source: "customlist_advs_reservation_status"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_yr",
          type: serverWidget.FieldType.SELECT,
          label: "Model Yr",
          source: "customrecord_advs_model_year"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_mileage",
          type: serverWidget.FieldType.INTEGER,
          label: "Mileage"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_color",
          type: serverWidget.FieldType.SELECT,
          label: "Color",
          source: "customrecord_advs_st_interior_exte_color"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_vinid_link",
          type: serverWidget.FieldType.TEXT,
          label: "Vin #"
        })
        sublist.addField({
          id: "custpabe_vinid",
          type: serverWidget.FieldType.SELECT,
          label: "Vin #",
          source: "customrecord_advs_vm"
        }).updateDisplayType({
          displayType: "hidden"
        });
        sublist.addField({
          id: "custpabe_loc",
          type: serverWidget.FieldType.SELECT,
          label: "Location",
          source: "location"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_make",
          type: serverWidget.FieldType.SELECT,
          label: "Make",
          source: "customrecord_advs_brands"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_transmission",
          type: serverWidget.FieldType.SELECT,
          label: "Transmission",
          source: "customlist712"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_engine",
          type: serverWidget.FieldType.TEXT,
          label: "Engine"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_customer",
          type: serverWidget.FieldType.SELECT,
          label: "Customer",
          source: "customer"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_emp",
          type: serverWidget.FieldType.SELECT,
          label: "SalesRep",
          source: 'employee'
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_dtruck_ready",
          type: serverWidget.FieldType.DATE,
          label: "Date Truck Ready"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_dtruck_lockup",
          type: serverWidget.FieldType.DATE,
          label: "Date Truck Locked Up"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_aging",
          type: serverWidget.FieldType.INTEGER,
          label: "Aging"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_donsite",
          type: serverWidget.FieldType.DATE,
          label: "Date On Site"
        }).updateDisplayType({
          displayType: "inline"
        });

        sublist.addField({
          id: "custpabe_m_bkt_dep_incep",
          type: serverWidget.FieldType.CURRENCY,
          label: "Deposit Inception"
        });
        sublist.addField({
          id: "custpabe_m_bkt_pay_incep",
          type: serverWidget.FieldType.CURRENCY,
          label: "Payment Inception"
        });
        sublist.addField({
          id: "custpabe_m_bkt_ttl_incep",
          type: serverWidget.FieldType.CURRENCY,
          label: "Total Inception"
        });
        sublist.addField({
          id: "custpabe_m_bkt_terms",
          type: serverWidget.FieldType.INTEGER,
          label: "Terms"
        });
        sublist.addField({
          id: "custpabe_m_bkt_pay_13",
          type: serverWidget.FieldType.CURRENCY,
          label: "Payments 2-13"
        });
        sublist.addField({
          id: "custpabe_m_bkt_pay_25",
          type: serverWidget.FieldType.CURRENCY,
          label: "Payments 14-25"
        });
        sublist.addField({
          id: "custpabe_m_bkt_pay_37",
          type: serverWidget.FieldType.CURRENCY,
          label: "Payments 26-37"
        });
        sublist.addField({
          id: "custpabe_m_bkt_pay_49",
          type: serverWidget.FieldType.CURRENCY,
          label: "Payments 26-37"
        });
        sublist.addField({
          id: "custpabe_m_bkt_pur_opt",
          type: serverWidget.FieldType.CURRENCY,
          label: "Purchase Option"
        });
        sublist.addField({
          id: "custpabe_m_bkt_cont_tot",
          type: serverWidget.FieldType.CURRENCY,
          label: "Contract Total"
        });

        sublist.addField({
          id: "custpabe_model",
          type: serverWidget.FieldType.SELECT,
          label: "Model",
          source: "item"
        }).updateDisplayType({
          displayType: "inline"
        });

        sublist.addField({
          id: "custpabe_m_bkt_freq",
          type: serverWidget.FieldType.SELECT,
          label: "Frequency",
          source: "customrecord_advs_st_frequency"
        }).updateDisplayType({
          displayType: "inline"
        });

        sublist.addField({
          id: "custpabe_m_bkt_id",
          type: serverWidget.FieldType.SELECT,
          label: "Bucket Id",
          source: "customrecord_ez_bucket_calculation"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_bkt_ch_id",
          type: serverWidget.FieldType.SELECT,
          label: "Bucket Child",
          source: "customrecord_bucket_calculation_location"
        }).updateDisplayType({
          displayType: "inline"
        });

        sublist.addField({
          id: "custpabe_m_bkt_salesch",
          type: serverWidget.FieldType.SELECT,
          label: "Sales Channel"
        }).updateDisplayType({
          displayType: "hidden"
        });

        //Reposession sublist
        if (!flagpara2) {

          //CREATE FEILDS FOR INVENTORY DEPOSIT DELIVERY  
          var deliverysublist = createdeliverysublist(form);
        }




        // Run the search with paging
        // log.debug('vmSearchObj.filters', vmSearchObj.filters);
        // Add buttons to simulate Next & Previous
        if (pageId != 0) {
          sublist.addButton({
            id: 'custpage_previous',
            label: 'Previous',
            functionName: 'getSuiteletPage("' + scriptId + '", "' + deploymentId + '", ' + (pageId - 1) + ')'
          });
        }
        if (pageId != pageCount - 1) {
          sublist.addButton({
            id: 'custpage_next',
            label: 'Next',
            functionName: 'getSuiteletPage("' + scriptId + '", "' + deploymentId + '", ' + (pageId + 1) + ')'
          });
        }

        for (i = 0; i < pageCount; i++) {
          if (i == pageId) {
            selectOptions.addSelectOption({
              value: 'pageid_' + i,
              text: ((i * pageSize) + 1) + ' - ' + ((i + 1) * pageSize),
              isSelected: true
            });
          } else {
            selectOptions.addSelectOption({
              value: 'pageid_' + i,
              text: ((i * pageSize) + 1) + ' - ' + ((i + 1) * pageSize)
            });
          }
        }

        var vmData = [];



        var urlRes = url.resolveRecord({
          recordType: 'customrecord_advs_lease_header'
        });


        var lineNum = 0;
        for (var m = 0; m < addResults.length; m++) {
          if (addResults[m] != null && addResults[m] != undefined) {

            var vinid = addResults[m].id;
            var vinName = addResults[m].vinName;
            var model = addResults[m].modelid;
            var brand = addResults[m].brand;
            var locid = addResults[m].locid;
            var modelyr = addResults[m].modelyr;
            var bucketId = addResults[m].bucketId;
            var stockdt = addResults[m].stockdt;
            var Statusdt = addResults[m].Statusdt;
            var Mileagedt = addResults[m].Mileagedt;
            var Transdt = addResults[m].Transdt;
            var Enginedt = addResults[m].Enginedt;
            var Customerdt = addResults[m].Customerdt;
            var salesrepdt = addResults[m].salesrepdt;
            var extclrdt = addResults[m].extclrdt;
            var DateTruckRdydt = addResults[m].DateTruckRdydt;
            var DateTruckLockupdt = addResults[m].DateTruckLockupdt;
            var DateTruckAgingdt = addResults[m].DateTruckAgingdt;
            var DateOnsitedt = addResults[m].DateOnsitedt;
            var invdepositLink = addResults[m].invdepositLink;
            var InvSales = addResults[m].InvSales;

            if (InvSales) {
              salesrepdt = InvSales;
            }

            if (bucketData[bucketId] != null && bucketData[bucketId] != undefined) {
              var lengthBuck = bucketData[bucketId].length;

              for (var k = 0; k < lengthBuck; k++) {
                var bktId = bucketData[bucketId][k]["id"];
                var DEPINSP = bucketData[bucketId][k]["DEPINSP"] * 1;
                var PAYINSP = bucketData[bucketId][k]["PAYINSP"] * 1;
                var TTLINSP = bucketData[bucketId][k]["TTLINSP"] * 1;
                var TERMS = bucketData[bucketId][k]["TRMS"] * 1;
                var sec_2_13 = bucketData[bucketId][k]["2_13"] * 1;
                var sec_14_26 = bucketData[bucketId][k]["14_26"] * 1;
                var sec_26_37 = bucketData[bucketId][k]["26_37"] * 1;
                var sec_38_49 = bucketData[bucketId][k]["38_49"] * 1;
                var purOptn = bucketData[bucketId][k]["purOptn"] * 1;

                var contTot = bucketData[bucketId][k]["conttot"] * 1;
                var freq = bucketData[bucketId][k]["freq"];
                var saleCh = bucketData[bucketId][k]["saleCh"];

                sublist.setSublistValue({
                  id: "custpabe_vinid",
                  line: lineNum,
                  value: vinid
                });
                var urllink = 'https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=129&id=' + vinid;
                sublist.setSublistValue({
                  id: "custpabe_vinid_link",
                  line: lineNum,
                  value: '<a href="' + urllink + '">' + vinName + '</a>'
                });
                sublist.setSublistValue({
                  id: "custpabe_model",
                  line: lineNum,
                  value: model
                });
                if (brand) {
                  sublist.setSublistValue({
                    id: "custpabe_make",
                    line: lineNum,
                    value: brand
                  });
                }
                sublist.setSublistValue({
                  id: "custpabe_loc",
                  line: lineNum,
                  value: locid
                });
                if (modelyr) {
                  sublist.setSublistValue({
                    id: "custpabe_m_yr",
                    line: lineNum,
                    value: modelyr
                  });
                }

                sublist.setSublistValue({
                  id: "custpabe_m_stock",
                  line: lineNum,
                  value: stockdt
                });
                sublist.setSublistValue({
                  id: "custpabe_m_status",
                  line: lineNum,
                  value: Statusdt
                });
                sublist.setSublistValue({
                  id: "custpabe_m_mileage",
                  line: lineNum,
                  value: Mileagedt
                });
                if (Transdt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_transmission",
                    line: lineNum,
                    value: Transdt
                  });
                }
                if (Enginedt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_engine",
                    line: lineNum,
                    value: Enginedt
                  });
                }

                sublist.setSublistValue({
                  id: "custpabe_m_customer",
                  line: lineNum,
                  value: Customerdt
                });

                if (salesrepdt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_emp",
                    line: lineNum,
                    value: salesrepdt
                  });
                }

                if (extclrdt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_color",
                    line: lineNum,
                    value: extclrdt
                  });
                }
                if (DateTruckRdydt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_dtruck_ready",
                    line: lineNum,
                    value: DateTruckRdydt
                  });
                }
                if (DateTruckLockupdt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_dtruck_lockup",
                    line: lineNum,
                    value: DateTruckLockupdt
                  });
                }
                if (DateTruckAgingdt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_aging",
                    line: lineNum,
                    value: DateTruckAgingdt
                  });
                }
                if (DateOnsitedt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_donsite",
                    line: lineNum,
                    value: DateOnsitedt
                  });
                }

                sublist.setSublistValue({
                  id: "custpabe_m_bkt_id",
                  line: lineNum,
                  value: bucketId
                });
                sublist.setSublistValue({
                  id: "custpabe_m_bkt_ch_id",
                  line: lineNum,
                  value: bktId
                });
                sublist.setSublistValue({
                  id: "custpabe_m_bkt_dep_incep",
                  line: lineNum,
                  value: DEPINSP
                });
                sublist.setSublistValue({
                  id: "custpabe_m_bkt_pay_incep",
                  line: lineNum,
                  value: PAYINSP
                });
                sublist.setSublistValue({
                  id: "custpabe_m_bkt_ttl_incep",
                  line: lineNum,
                  value: TTLINSP
                });
                sublist.setSublistValue({
                  id: "custpabe_m_bkt_terms",
                  line: lineNum,
                  value: TERMS
                });
                sublist.setSublistValue({
                  id: "custpabe_m_bkt_pay_13",
                  line: lineNum,
                  value: sec_2_13
                });
                sublist.setSublistValue({
                  id: "custpabe_m_bkt_pay_25",
                  line: lineNum,
                  value: sec_14_26
                });
                sublist.setSublistValue({
                  id: "custpabe_m_bkt_pay_37",
                  line: lineNum,
                  value: sec_26_37
                });
                sublist.setSublistValue({
                  id: "custpabe_m_bkt_pay_49",
                  line: lineNum,
                  value: sec_38_49
                });
                sublist.setSublistValue({
                  id: "custpabe_m_bkt_pur_opt",
                  line: lineNum,
                  value: purOptn
                });
                sublist.setSublistValue({
                  id: "custpabe_m_bkt_cont_tot",
                  line: lineNum,
                  value: contTot
                });
                sublist.setSublistValue({
                  id: "custpabe_m_bkt_freq",
                  line: lineNum,
                  value: freq
                });
                if (saleCh) {
                  sublist.setSublistValue({
                    id: "custpabe_m_bkt_salesch",
                    line: lineNum,
                    value: saleCh
                  });
                }

                if (!flagpara2) {
                  sublist.setSublistValue({
                    id: 'cust_list_veh_card',
                    line: lineNum,
                    value: '<a href="' + urlRes + "&param_vin=" + vinid + "&param_buckt=" + bktId + "" + '" target="_blank"><img class=\"i_dashboard_gray\"  src=\"/uirefresh/img/dashboard.png"   width=\"25px\" height=\"20px\"/></a>'
                  });
                }

                if (invdepositLink) {


                } else {
                  sublist.setSublistValue({
                    id: 'cust_list_veh_delivey',
                    line: lineNum,
                    value: '<a href= "#" onclick=depositcreation(' + vinid + ')><i class="fa fa-bank" style="color:blue;"></i></a>'
                  });
                }


                if (invdepositLink) {
                  sublist.setSublistValue({
                    id: 'cust_select_checkbox_highlight',
                    line: lineNum,
                    value: 'T'
                  });

                }

                lineNum++;
              }
            }
          }
        }

        if (!flagpara2) {

        }
 
        form.clientScriptModulePath = "./advs_cs_available_veh_by_bucket.js";
        response.writePage(form);
      } else {

        var onclickScript = " <html><body> <script type='text/javascript'>" +
          "try{" +
          "";
        onclickScript += "window.parent.location.reload();";
        onclickScript += "var theWindow = window.parent.closePopup();" ;
         
        onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";

        scriptContext.response.write(onclickScript);

      }
    }
    var uniqueBucket = [];
    var bucketData = [];

    function fetchSearchResult(pagedData, pageIndex, freqId) {

      var searchPage = pagedData.fetch({
        index: pageIndex
      });

      var vmDataResults = new Array();
      searchPage.data.forEach(function (result) {

        var vinId = result.getValue({
          name: "internalid"
        });
        var vinText = result.getValue({
          name: "name"
        });
        var modelId = result.getValue({
          name: "custrecord_advs_vm_model"
        });
        var vehicleBrand = result.getValue({
          name: "custrecord_advs_vm_vehicle_brand"
        });
        var locId = result.getValue({
          name: "custrecord_advs_vm_location_code"
        });
        var modelYr = result.getValue({
          name: "custrecord_advs_vm_model_year"
        });
        var bucketId = result.getValue({
          name: "custrecord_vehicle_master_bucket"
        });
        var stockdt = result.getValue({
          name: "cseg_advs_sto_num"
        });
        var Statusdt = result.getValue({
          name: "custrecord_advs_vm_reservation_status"
        });
        var Mileagedt = result.getValue({
          name: "custrecord_advs_vm_mileage"
        });
        var Transdt = result.getValue({
          name: "custrecord_advs_vm_transmission_type"
        });
        var Enginedt = result.getValue({
          name: "custrecord_advs_vm_engine_serial_number"
        });
        var Customerdt = result.getValue({
          name: "custrecord_advs_vm_customer_number"
        });
        var salesrepdt = result.getValue({
          name: "custrecord_advs_vm_soft_hld_sale_rep"
        });
        var extclrdt = result.getValue({
          name: "custrecord_advs_vm_exterior_color"
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

        var invdepositLink = result.getValue({
          name: "custrecord_advs_in_dep_trans_link",
          join: "CUSTRECORD_ADVS_IN_DEP_VIN",
        });

        var InvSales = result.getValue({
          name: "custrecord_advs_in_dep_sales_rep",
          join: "CUSTRECORD_ADVS_IN_DEP_VIN"
        });

        var obj = {};
        obj.id = vinId;
        obj.vinName = vinText;
        obj.modelid = modelId;
        obj.brand = vehicleBrand;
        obj.locid = locId;
        obj.modelyr = modelYr;
        obj.bucketId = bucketId;
        obj.stockdt = stockdt;
        obj.Statusdt = Statusdt;
        obj.Mileagedt = Mileagedt;
        obj.Transdt = Transdt;
        obj.Enginedt = Enginedt;
        obj.Customerdt = Customerdt;
        obj.salesrepdt = salesrepdt;
        obj.extclrdt = extclrdt;
        obj.DateTruckRdydt = DateTruckRdydt;
        obj.DateTruckLockupdt = DateTruckLockupdt;
        obj.DateTruckAgingdt = DateTruckAgingdt;
        obj.DateOnsitedt = DateOnsitedt;
        obj.invdepositLink = invdepositLink;
        obj.InvSales = InvSales;


        if (bucketId) {
          if (uniqueBucket.indexOf(bucketId) == -1) {
            uniqueBucket.push(bucketId);
          }
        }
        vmDataResults.push(obj);
      });

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

        bucketCalcSearch.run().each(function (result) {
          var bucketId = result.getValue({
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
          var FREQ = result.getValue({
            name: "custrecord_advs_b_c_chld_freq"
          });
          var saleCh = result.getValue({
            name: "custrecord_advs_buc_chld_sales_channel"
          });

          var index = 0;
          if (bucketData[bucketId] != null && bucketData[bucketId] != undefined) {
            index = bucketData[bucketId].length;
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

          return true;
        });
      }

      return vmDataResults;
    }
    var deliveryVinArr = "";

    function createdeliverysublist(form) {
      var DepositDeliverysublist = form.addSublist({
        id: "custpage_sublist_deposit_delivery",
        type: serverWidget.SublistType.LIST,
        label: "List",
        tab: "custpage_delivery_tab"
      });


      var Locationfld = DepositDeliverysublist.addField({
        id: "cust_delivery_location",
        type: serverWidget.FieldType.SELECT,
        label: "Location",
        source: "location"
      });
      Locationfld.updateDisplayType({
        displayType: "inline"
      });

      var customerfld = DepositDeliverysublist.addField({
        id: "cust_delivery_custname",
        type: serverWidget.FieldType.SELECT,
        label: "Name",
        source: "customer"
      });
      customerfld.updateDisplayType({
        displayType: "inline"
      });

      var salerepfld = DepositDeliverysublist.addField({
        id: "cust_delivery_salesrep",
        type: serverWidget.FieldType.SELECT,
        label: "Sales Rep",
        source: "employee"
      });
      salerepfld.updateDisplayType({
        displayType: "inline"
      });


      var etadays = DepositDeliverysublist.addField({
        id: "cust_delivery_date",
        type: serverWidget.FieldType.DATE,
        label: "ETA"
      });
      etadays.updateDisplayType({
        displayType: "inline"
      });

      var closedealfld = DepositDeliverysublist.addField({
        id: "cust_delivery_close_deal",
        type: serverWidget.FieldType.TEXT,
        label: "Days To Close Deal"
      });
      closedealfld.updateDisplayType({
        displayType: "inline"
      });


      var insapplyFld = DepositDeliverysublist.addField({
        id: "cust_delivery_insurance_deal",
        type: serverWidget.FieldType.TEXT,
        label: "Insurance Application"
      });
      insapplyFld.updateDisplayType({
        displayType: "inline"
      });
      var cleardeliveryfld = DepositDeliverysublist.addField({
        id: "cust_delivery_clear_deliver",
        type: serverWidget.FieldType.TEXT,
        label: "Cleared For Delivery"
      });
      cleardeliveryfld.updateDisplayType({
        displayType: "inline"
      });

      var deliveryvinfld = DepositDeliverysublist.addField({
        id: "cust_delivery_vin",
        type: serverWidget.FieldType.SELECT,
        label: "VIN",
        source: "customrecord_advs_vm"
      });
      deliveryvinfld.updateDisplayType({
        displayType: "inline"
      });

      var truckreadyfld = DepositDeliverysublist.addField({
        id: "cust_delivery_truck_ready",
        type: serverWidget.FieldType.CHECKBOX,
        label: "Truck Ready"
      });
      truckreadyfld.updateDisplayType({
        displayType: "inline"
      });


      DepositDeliverysublist.addField({
        id: "cust_delivery_truck_wash",
        type: serverWidget.FieldType.CHECKBOX,
        label: "Washed"
      }).updateDisplayType({
        displayType: "inline"
      });

      DepositDeliverysublist.addField({
        id: "cust_delivery_total_lease",
        type: serverWidget.FieldType.CURRENCY,
        label: "Total Lease Inception"
      }).updateDisplayType({
        displayType: "inline"
      });


      DepositDeliverysublist.addField({
        id: "cust_delivery_deposit",
        type: serverWidget.FieldType.CURRENCY,
        label: "Deposit"
      }).updateDisplayType({
        displayType: "inline"
      });

      DepositDeliverysublist.addField({
        id: "cust_delivery_pu_payment",
        type: serverWidget.FieldType.CURRENCY,
        label: "P/U Payment"
      }).updateDisplayType({
        displayType: "inline"
      });

      DepositDeliverysublist.addField({
        id: "cust_delivery_balance",
        type: serverWidget.FieldType.CURRENCY,
        label: "Balance"
      }).updateDisplayType({
        displayType: "inline"
      });


      DepositDeliverysublist.addField({
        id: "cust_delivery_truck_mcoo",
        type: serverWidget.FieldType.TEXT,
        label: "MC/OO"
      }).updateDisplayType({
        displayType: "inline"
      });


      DepositDeliverysublist.addField({
        id: "cust_delivery_sales_quote",
        type: serverWidget.FieldType.CHECKBOX,
        label: "Sales Quote"
      }).updateDisplayType({
        displayType: "inline"
      });

      DepositDeliverysublist.addField({
        id: "cust_delivery_truck_contract",
        type: serverWidget.FieldType.SELECT,
        label: "Contract"
      }).updateDisplayType({
        displayType: "inline"
      });


      DepositDeliverysublist.addField({
        id: "cust_delivery_truck_notes",
        type: serverWidget.FieldType.TEXT,
        label: "Notes"
      }).updateDisplayType({
        displayType: "inline"
      });

      DepositDeliverysublist.addField({
        id: "cust_delivery_truck_exception",
        type: serverWidget.FieldType.TEXT,
        label: "Exceptions"
      }).updateDisplayType({
        displayType: "inline"
      });

      DepositDeliverysublist.addField({
        id: "cust_delivery_deposit_id",
        type: serverWidget.FieldType.TEXT,
        label: "Deposit"
      }).updateDisplayType({
        displayType: "inline"
      });



      var Deliveryboardsearch = search.create({
        type: "customrecord_advs_vm_inv_dep_del_board",
        filters: [
          ["isinactive", "is", "F"],
          "AND",
          ["custrecord_advs_in_dep_sales_quote", "is", "T"],
          "AND",
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
          })
        ]
      });


      var searchResultCount = Deliveryboardsearch.runPaged().count;
      var count = 0;

      Deliveryboardsearch.run().each(function (result) {

        var deliverylocation = result.getValue({
          name: 'custrecord_advs_in_dep_location'
        }) || '';
        var deliverycustomer = result.getValue({
          name: 'custrecord_advs_in_dep_name'
        }) || '';

        var deliverysalesrep = result.getValue({
          name: 'custrecord_advs_in_dep_sales_rep'
        }) || ' ';

        var deliveryDate = result.getValue({
          name: 'custrecord_advs_in_dep_eta'
        }) || ' ';

        var deliveryclosedeal = result.getValue({
          name: 'custrecord_advs_in_dep_days_close_deal'
        }) || ' ';
        var deliveryinsurance = result.getValue({
          name: 'custrecord_advs_in_dep_insur_application'
        }) || '';

        var depcleardelivery = result.getValue({
          name: 'custrecord_advs_in_dep_clear_delivery'
        }) || ' ';

        var deliveryVin = result.getValue({
          name: 'custrecord_advs_in_dep_vin'
        }) || '';

        //   if(deliveryVin){
        //     deliveryVinArr.push(deliveryVin)
        // //   }
        //   if(deliveryVinArr.indexOf(deliveryVin) == -1){
        // 	deliveryVinArr.push(deliveryVin);
        // }

        var deliverytruckready = result.getValue({
          name: 'custrecord_advs_in_dep_truck_ready'
        }) || '';
        var deliveryWashed = result.getValue({
          name: 'custrecord_advs_in_dep_washed'
        }) || '';

        var deliverytotlease = result.getValue({
          name: 'custrecord_advs_in_dep_tot_lease_incepti'
        }) || '';

        var deliverydeposit = result.getValue({
          name: 'custrecord_advs_in_dep_deposit'
        }) || '';

        var deliverypupayment = result.getValue({
          name: 'custrecord_advs_in_dep_pu_payment'
        }) || '';

        var deliverybalance = result.getValue({
          name: 'custrecord_advs_in_dep_balance'
        }) || '';

        var deliverymcoo = result.getValue({
          name: 'custrecord_advs_in_dep_mc_oo'
        }) || '';

        var deliverymsalesquote = result.getValue({
          name: 'custrecord_advs_in_dep_sales_quote'
        }) || '';


        var deliverycontract = result.getValue({
          name: 'custrecord_advs_in_dep_contract'
        }) || '';

        var deliverynotes = result.getValue({
          name: 'custrecord_advs_in_dep_notes'
        }) || '';

        var deliveryexception = result.getValue({
          name: 'custrecord_advs_in_dep_exceptions'
        }) || '';

        var deliverydepolink = result.getValue({
          name: 'custrecord_advs_in_dep_trans_link'
        }) || '';
        var deliverydepotext = result.getText({
          name: 'custrecord_advs_in_dep_trans_link'
        }) || '';




        if (deliverylocation) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_location",
            line: count,
            value: deliverylocation
          });
        }


        if (deliverycustomer) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_custname",
            line: count,
            value: deliverycustomer
          });
        }

        if (deliverysalesrep) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_salesrep",
            line: count,
            value: deliverysalesrep
          });
        }

        log.debug("deliveryDate", deliveryDate)
        if (deliveryDate) {

          var formattedFromDate = format.format({
            value: new Date(deliveryDate),
            type: format.Type.DATE
          });
          log.debug("formattedFromDate", formattedFromDate)

        }

        // if(deliveryDate){ 
        // DepositDeliverysublist.setSublistValue({
        //     id: "cust_delivery_date",
        //     line: count,
        //     value: deliveryDate
        // });
        // }

        if (deliveryclosedeal) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_close_deal",
            line: count,
            value: deliveryclosedeal
          });
        }

        if (deliveryinsurance) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_insurance_deal",
            line: count,
            value: deliveryinsurance
          });
        }

        if (depcleardelivery) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_clear_deliver",
            line: count,
            value: depcleardelivery
          });
        }


        if (deliveryVin) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_vin",
            line: count,
            value: deliveryVin
          });
        }


        if (deliverytruckready) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_truck_ready",
            line: count,
            value: 'T'
          });
        }



        if (deliveryWashed) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_truck_wash",
            line: count,
            value: 'T'
          });
        }



        if (deliverytotlease) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_total_lease",
            line: count,
            value: deliverytotlease
          });
        }


        if (deliverydeposit) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_deposit",
            line: count,
            value: deliverydeposit
          });
        }

        if (deliverypupayment) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_pu_payment",
            line: count,
            value: deliverypupayment
          });
        }

        if (deliverybalance) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_balance",
            line: count,
            value: deliverybalance
          });
        }


        if (deliverymcoo) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_truck_mcoo",
            line: count,
            value: deliverymcoo
          });
        }

        if (deliverymsalesquote) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_sales_quote",
            line: count,
            value: 'T'
          });
        }



        if (deliverynotes) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_truck_notes",
            line: count,
            value: deliverynotes
          });
        }

        if (deliverycontract) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_truck_contract",
            line: count,
            value: deliverycontract
          });
        }



        if (deliveryexception) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_truck_exception",
            line: count,
            value: deliveryexception
          });
        }


        var depurl = 'https://8760954.app.netsuite.com/app/accounting/transactions/transaction.nl?id=' + deliverydepolink;
        DepositDeliverysublist.setSublistValue({
          id: "cust_delivery_deposit_id",
          line: count,
          value: '<a href="' + depurl + '" target="_blank">' + deliverydepotext + '</a>'
        });



        count++;
        return true;
      });
      try {

      } catch (e) {
        log.debug('error', e.toString())
      }

    }

     function InventorySearch(brandId, modelId, locatId, bucketId, freqId, vinID, LeaseHeaderId, iFrameCenter, flagpara2, Old_Vin_From_lease, brandFldObj, modelFldObj, locFldObj, bucketFldObj, freqFldObj, vinFldObj, LeaseFieldObj, IframeCenterFieldObj, Flagpara2FieldObj, OldVinFieldObj) {
      var vmSearchObj = search.create({
        type: "customrecord_advs_vm",
        filters: [
          // ["custrecord_advs_vm_reservation_status", "anyof", "1"], "AND",
          ["custrecord_advs_vm_reservation_status", "anyof", "15", "19", "20", "21", "22", "23"], "AND",
          ["custrecord_vehicle_master_bucket", "noneof", "@NONE@"]
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
            name: "cseg_advs_sto_num",
            label: "STOCK (SEGMENT)"
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
            name: "custrecord_advs_in_dep_trans_link",
            join: "CUSTRECORD_ADVS_IN_DEP_VIN",
            label: "Deposit Link"
          }),

          search.createColumn({
            name: "custrecord_advs_in_dep_sales_rep",
            join: "CUSTRECORD_ADVS_IN_DEP_VIN",
            label: "Sales Rep"
          })
        ]
      });

      if (brandId) {
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_vm_vehicle_brand",
          operator: search.Operator.ANYOF,
          values: brandId
        }))
        brandFldObj.defaultValue = brandId;
      }
      if (modelId) {
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_vm_model",
          operator: search.Operator.ANYOF,
          values: modelId
        }))
        modelFldObj.defaultValue = modelId;
      }
      if (locatId) {
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_vm_location_code",
          operator: search.Operator.ANYOF,
          values: locatId
        }))
        locFldObj.defaultValue = locatId;
      }
      if (bucketId) {
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_vehicle_master_bucket",
          operator: search.Operator.ANYOF,
          values: bucketId
        }))
        bucketFldObj.defaultValue = bucketId;
      }
      if (freqId) {
        // bucketCalcSearch.filters.push(search.createFilter({name:"custrecord_advs_b_c_chld_freq",operator:search.Operator.ANYOF,values:freqId}))
        freqFldObj.defaultValue = freqId;
      }
      if (vinID != '') {
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "internalid",
          operator: search.Operator.IS,
          values: vinID
        }))
        vinFldObj.defaultValue = vinID;
      }
      if (LeaseHeaderId) {
        LeaseFieldObj.defaultValue = LeaseHeaderId;
      }
      if (iFrameCenter) {
        IframeCenterFieldObj.defaultValue = iFrameCenter;
      }
      if (flagpara2) {
        Flagpara2FieldObj.defaultValue = flagpara2;
      }
      if (Old_Vin_From_lease) {
        OldVinFieldObj.defaultValue = Old_Vin_From_lease;
      }

      var inventoryitemSearch = search.create({
        type: "inventoryitem",
        filters: [
          ["type", "anyof", "InvtPart"],
          "AND",
          ["custitem_advs_inventory_type", "anyof", "1"]
        ],
        columns: [
          search.createColumn({
            name: "internalid",
            label: "Internal ID"
          }),
          search.createColumn({
            name: "custitem_advs_inventory_type",
            label: "Inventory Type"
          }),
          search.createColumn({
            name: "itemid",
            sort: search.Sort.ASC,
            label: "Name"
          })
        ]
      });

      inventoryitemSearch.run().each(function (result) {

        var InternalId = result.getValue({
          name: "internalid"
        });
        var ItemName = result.getValue({
          name: "itemid"
        })
        //     log.debug("InternalId", InternalId);
        // log.debug("ItemName", ItemName);
        modelFldObj.addSelectOption({
          value: InternalId,
          text: ItemName
        });

        return true;
      });

      return vmSearchObj;
    }
    return {
      onRequest
    }
  });
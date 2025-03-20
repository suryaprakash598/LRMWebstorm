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

            var brandId   = request.parameters.brand;
            var modelId   = request.parameters.model;
            var locatId   = request.parameters.locat;
            var bucketId  = request.parameters.bucket;
            var freqId    = request.parameters.freq;
            var vinID     = request.parameters.unitvin || '';
			
            var status     		= request.parameters.status || '';
            var color     		= request.parameters.color || '';
            var transmission    = request.parameters.transmission || '';
            var salesrep     	= request.parameters.salesrep || '';
            var mileage     	= request.parameters.mileage || '';
            // log.debug('vinID', vinID);

            var Old_Vin_From_lease = request.parameters.custpara_old_vin; //custpara_old_vin
            var flagpara2          = request.parameters.custpara_flag_2;
            var LeaseHeaderId      = request.parameters.custpara_lease_id;
            var iFrameCenter       = request.parameters.ifrmcntnr;
            var scriptId           = currScriptObj.id;
            var deploymentId       = currScriptObj.deploymentId;

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
			var _inventoyCount =0;
            /* var subTab = form.addSubtab({
                id: "custpage_veh_tab",
                label: "Inventory"
            });  */
            
			
            var brandFldObj = form.addField({
                id: "custpage_brand",
                type: serverWidget.FieldType.SELECT,
                label: "Brand",
                source: "customrecord_advs_brands",
                container: "custpage_fil_gp"
            }).updateDisplayType({
                displayType: "hidden"
            }); 

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
            }).updateDisplayType({
                displayType: "hidden"
            });
            
            var bucketFldObj = form.addField({
                id: "custpage_bucket",
                type: serverWidget.FieldType.SELECT,
                label: "Bucket",
                source: "customrecord_ez_bucket_calculation",
                container: "custpage_fil_gp"
            })/* .updateDisplayType({
                displayType: "hidden"
            }); */
            var freqFldObj = form.addField({
                id: "custpage_freq",
                type: serverWidget.FieldType.SELECT,
                label: "Frequency",
                source: "customrecord_advs_st_frequency",
                container: "custpage_fil_gp"
            }).updateDisplayType({
                displayType: "hidden"
            });
            var vinFldObj = form.addField({
                id: "custpage_vin",
                type: serverWidget.FieldType.SELECT,
                label: "Vin #",
                source: "customrecord_advs_vm",
                container: "custpage_fil_gp"
            });
			var statusFldObj = form.addField({
                id: "custpage_status",
                type: serverWidget.FieldType.SELECT,
                label: "Status",
                source: "customlist_advs_reservation_status",
                container: "custpage_fil_gp"
            });
			var colorFldObj = form.addField({
                id: "custpage_color",
                type: serverWidget.FieldType.SELECT,
                label: "Color",
                source: "customlist_advs_color_list",
                container: "custpage_fil_gp"
            }).updateDisplayType({
                displayType: "hidden"
            });
			var mileageFldObj = form.addField({
                id: "custpage_mileage",
                type: serverWidget.FieldType.TEXT,
                label: "Mileage" ,
                container: "custpage_fil_gp"
            });
			var transmissionFldObj = form.addField({
                id: "custpage_transmission",
                type: serverWidget.FieldType.SELECT,
                label: "Transmission",
                source: "customlist712",
                container: "custpage_fil_gp"
            }).updateDisplayType({
                displayType: "hidden"
            });

			var salesrepFldObj = form.addField({
                id: "custpage_salesrep",
                type: serverWidget.FieldType.SELECT,
                label: "Salesrep",
                source: "employee",
                container: "custpage_fil_gp"
            }).updateDisplayType({
                displayType: "hidden"
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
			
			var colorcodingFieldObj = form.addField({
                id: 'custpage_colorcoding',
                type: serverWidget.FieldType.INLINEHTML,
                label: "Color",
                container: "custpage_fil_gp"
            });
			
			var htmlcolor = '';
				// htmlcolor +='<table class="colorcodingtable" style="margin-top: -8px;"><tr style="background-color:#e0c9c9;"><th><b>Color</b></th><th><b>Status</b></th></tr>';
				// 	htmlcolor +='<tr><td style="background-color:#9de79d;"></td><td><b>Ready</b></td></tr>';
				// 	htmlcolor +='<tr><td style="background-color:#7070e7;"></td><td><b>Enroute</b></td></tr>';
				// 	htmlcolor +='<tr><td style="background-color:#ecb755;"></td><td><b>Inshop</b></td></tr>';
				// 	htmlcolor +='<tr><td style="background-color:#ea3a3a;"></td><td><b>Hold</b></td></tr>';
				// 	htmlcolor +='<tr><td style="background-color:#8B8000;"></td><td><b>SRD</b></td></tr>';
				// 	htmlcolor +='</table>';
					
			//   htmlcolor +='<table class="colorcodingtable" style="margin-top: 10px;width: 211px;"><tr style="background-color:#e0c9c9;"><th><b>Color</b></th><th><b>Status</b></th></tr>';
			// 		htmlcolor +='<tr><td style="background-color:#ef4444;width: 80px;"></td><td><b>Need Assignment</b></td></tr>';
			// 		htmlcolor +='<tr><td style="background-color:#87CEEB;width: 80px;"></td><td><b>Enroute LRM</b></td></tr>';
			// 		htmlcolor +='<tr><td style="background-color:#87CEEB;width: 80px;"></td><td><b>Enroute JT</b></td></tr>';
			// 		htmlcolor +='<tr><td style="background-color:#9de79d;width: 80px;"></td><td><b>Enroute to Auction</b></td></tr>';
			// 		htmlcolor +='<tr><td style="background-color:#f1f167;width: 80px;"></td><td><b>Pending Redemption</b></td></tr>';
			// 		htmlcolor +='<tr><td style="background-color:#bd7ee4;width: 80px;"></td><td><b>Secured</b></td></tr>';
			// 		htmlcolor +='</table>';
				htmlcolor+='<style> #custpage_colorcoding_val {top: 94px;    position: absolute;    right: -76px;} .colorcodingtable {  border: 1px solid black;  border-collapse: collapse; width:180px;}  .colorcodingtable th{border: 1px solid black;  border-collapse: collapse;} .colorcodingtable td{border: 1px solid black;  border-collapse: collapse;}</style>'
				colorcodingFieldObj.defaultValue = htmlcolor;
			var vmSearchObj = InventorySearch(brandId,modelId,locatId,bucketId,freqId,vinID,LeaseHeaderId,iFrameCenter,flagpara2,Old_Vin_From_lease,brandFldObj,modelFldObj,locFldObj,bucketFldObj,freqFldObj,vinFldObj,LeaseFieldObj,IframeCenterFieldObj,Flagpara2FieldObj,OldVinFieldObj,status ,color ,transmission,salesrep,mileage,statusFldObj,colorFldObj,transmissionFldObj,salesrepFldObj,mileageFldObj  )
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

            var pageCount = Math.ceil(searchObj.count);
            // log.debug("searchObjCount", searchObj.count + "==>" + pageCount);

            // Set pageId to correct value if out of index
            if (!pageId || pageId == '' || pageId < 0)
                pageId = 0;
            else if (pageId >= pageCount)
                pageId = pageCount - 1;

           
			var addResults=[{}];
			if (searchObj.count > 0) {
                addResults = fetchSearchResult(searchObj, pageId, freqId);
            } else {
                var addResults = [{}];
            }
			log.debug('searchObj.count+addResults',searchObj.count+"-"+addResults);
			var _inventoyCount = addResults.length||0;
			var subTab = form.addSubtab({
                id: "custpage_veh_tab",
                label: "Inventory"
            }); 
			// var subTab1 = form.addSubtab({
            //     id: "custpage_repo_tab",
            //     label: "Reposession"
            // });
            
            var subTab2 = form.addSubtab({
                id: "custpage_auction_tab",
                label: "Auction"
            });
            // var collapsed = filterGp.isCollapsed;

            var subTab3 = form.addSubtab({
                id: "custpage_delivery_tab",
                label: "Delivery Board"
            });
			var subTab4 = form.addSubtab({
                id: "custpage_summary_tab",
                label: "Inventory Summary"
            });
			var subTab5 = form.addSubtab({
                id: "custpage_claim_tab",
                label: "Insurance Claim Sheet"
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

                "function openholdpop(pageURL, title,w,h) {debugger;" +
                "var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1655&deploy=1&repo='+pageURL;" +
                "var left = (screen.width/2)-(900/2);" +
                "var top = (screen.height/2)-(500/2);" +
                "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
                "}" +

                "function openterminationpop(pageURL, title,w,h) {debugger;" +
                "var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1656&deploy=1&repo='+pageURL;" +
                "var left = (screen.width/2)-(900/2);" +
                "var top = (screen.height/2)-(500/2);" +
                "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
                "}" +
				"function openauction(pageURL, title,w,h) {debugger;" +
                "var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1658&deploy=1&repo='+pageURL;" +
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
				"function editclaimsheet(id) {debugger;" +
                "var left = (screen.width/2)-(500/2);" +
                "var top = (screen.height/2)-(500/2);" +
                "var url='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1648&deploy=1&claim='+id;" +
                "var targetWin = window.open (url, width=500, height=500);" +
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
                type: serverWidget.FieldType.TEXT,
                label: "Color",
              //  source: "custrecord_advs_vm_exterior_color"// customrecord_advs_st_interior_exte_color
            }).updateDisplayType({
                displayType: "inline"
            });
			sublist.addField({
                id: "custpabe_m_sleepersize",
                type: serverWidget.FieldType.TEXT,
                label: "Sleeper Size", 
            }).updateDisplayType({
                displayType: "inline"
            });
			sublist.addField({
                id: "custpabe_m_apu",
                type: serverWidget.FieldType.TEXT,
                label: "APU", 
			}).updateDisplayType({
                displayType: "inline"
            });
			sublist.addField({
                id: "custpabe_m_beds",
                type: serverWidget.FieldType.TEXT,
                label: "Beds",
			}).updateDisplayType({
                displayType: "inline"
            });
			sublist.addField({
                id: "custpabe_m_titlerestriction",
                type: serverWidget.FieldType.TEXT,
                label: "Title Restiction"
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
                displayType: "hidden"
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
                //CREATE FEILDS FOR REPOSESSION SUBLIST
                var sublistrepo = createReposessionSublist(form);
                //CREATE FEILDS FOR AUCTION SUBLIST
              //  var auctionsublist = createAuctionSublist(form);
               // //addDatatoAuction(auctionsublist, vinID);
                //CREATE FEILDS FOR INVENTORY DEPOSIT DELIVERY  
              //  //var deliverysublist = createdeliverysublist(form);
				var summarydb = createsummarydashbaord(form);
			//	 // var insclaimsublist = createInsClaimSublist(form);
				//  searchForclaimData(insclaimsublist)
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

            // log.debug("searchObj.length", searchObj.length)
            /* if (searchObj.count > 0) {
                var addResults = fetchSearchResult(searchObj, pageId, freqId);
            } else {
                var addResults = [{}
                ];
            } */

            var urlRes = url.resolveRecord({
                recordType: 'customrecord_advs_lease_header'
            });

			log.debug('bucketData',bucketData);
            var lineNum = 0;
            for (var m = 0; m < addResults.length; m++) {
                log.error("addResults.length",addResults.length)
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
					
                    var sleepersize = addResults[m].sleepersize;
                    var apu = addResults[m].apu;
                    var beds = addResults[m].beds;
                    var titlerestriction = addResults[m].titlerestriction;
                    
                    if(InvSales){
                        salesrepdt = InvSales;
                    }

                    if (bucketData[bucketId] != null && bucketData[bucketId] != undefined) {
                        var lengthBuck = bucketData[bucketId].length;
						log.debug('lengthBuck',lengthBuck);
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
							var urllink='https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=129&id='+vinid;
							sublist.setSublistValue({
                                id: "custpabe_vinid_link",
                                line: lineNum,
                                value: '<a href="'+urllink+'">'+vinName+'</a>'
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
							if (sleepersize) {
                                sublist.setSublistValue({
                                    id: "custpabe_m_sleepersize",
                                    line: lineNum,
                                    value: sleepersize
                                });
                            }if (apu) {
                                sublist.setSublistValue({
                                    id: "custpabe_m_apu",
                                    line: lineNum,
                                    value: apu
                                });
                            }if (beds) {
                                sublist.setSublistValue({
                                    id: "custpabe_m_beds",
                                    line: lineNum,
                                    value: beds
                                });
                            }if (titlerestriction) {
                                sublist.setSublistValue({
                                    id: "custpabe_m_titlerestriction",
                                    line: lineNum,
                                    value: titlerestriction
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
                            if(saleCh){
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
                            
                            if(invdepositLink){
                            
                            
                            }else{
                                sublist.setSublistValue({
                                    id: 'cust_list_veh_delivey',
                                    line: lineNum,
                                    value: '<a href= "#" onclick=depositcreation('+ vinid+')><i class="fa fa-bank" style="color:blue;"></i></a>'
                                });
                            }
                            

                            if(invdepositLink){
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
                //Reposession search and add data to sublist
                var _filters = [];
                // log.debug('vinID', vinID);
                if (vinID != '') {
                    _filters.push([
                            ["custrecord_ofr_vin", "is", vinID]
                        ])
                }
                var customrecord_lms_ofr_SearchObj = search.create({
                    type: "customrecord_lms_ofr_",
                    filters: _filters,
                    columns:
                    [
                        "custrecord_chek_from_repo",
                        "custrecord_collections",
                        "custrecord_advs_ofr_color",
                        "custrecord_destination",
                        "custrecord_followup_letter",
                        "custrecord_ofr_make",
                        "custrecord_ofr_model",
                        "custrecord_ofr_customer",
                        "custrecord_ofr_date",
                        // "custrecord_advs_ofr_ofrstatus",
						 search.createColumn({name: "custrecord_advs_ofr_ofrstatus", label: "OFR Status",sort: search.Sort.ASC}),
                        "custrecord_advs_repo_company",
                        "custrecord_ofr_stock_no",
                        "custrecord_termination_date",
                        "custrecord_ofr_vin",
                        "custrecord_ofr_year",
                        "custrecord_location_for_transport",
                        "custrecord_last_location",
                        "custrecord_date_putout",
                        "custrecord_additional_info_remarks",
                        "custrecord_transport_company"

                    ]
                });
                var searchResultCount = customrecord_lms_ofr_SearchObj.runPaged().count;
                var arr = [];
                var count = 0;
                customrecord_lms_ofr_SearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results

                    var name = result.getText({
                        name: 'custrecord_ofr_customer'
                    }) || ' ';
                    var destination = result.getText({
                        name: 'custrecord_destination'
                    }) || ' ';
                    var make = result.getText({
                        name: 'custrecord_ofr_make'
                    }) || ' ';
                    var model = result.getText({
                        name: 'custrecord_ofr_model'
                    }) || ' ';
                    var ofrdate = result.getValue({
                        name: 'custrecord_ofr_date'
                    }) || ' ';
                    var stock = result.getText({
                        name: 'custrecord_ofr_stock_no'
                    }) || ' ';
                    var stockval = result.getValue({
                        name: 'custrecord_ofr_stock_no'
                    }) || ' ';
                    var tdate = result.getValue({
                        name: 'custrecord_termination_date'
                    }) || ' ';
                    var tdpdate = result.getValue({
                        name: 'custrecord_date_putout'
                    }) || ' ';
                    var vin = result.getText({
                        name: 'custrecord_ofr_vin'
                    }) || ' ';
                    var vinval = result.getValue({
                        name: 'custrecord_ofr_vin'
                    }) || ' ';
                    var year = result.getText({
                        name: 'custrecord_ofr_year'
                    }) || ' ';
                    var repocompany = result.getText({
                        name: 'custrecord_advs_repo_company'
                    }) || '';
                    var repocompanyval = result.getValue({
                        name: 'custrecord_advs_repo_company'
                    }) || '';
                    var Followup = result.getValue({
                        name: 'custrecord_followup_letter'
                    }) || ' ';
                    var Collections = result.getValue({
                        name: 'custrecord_collections'
                    }) || ' ';
                    var Status = result.getText({
                        name: 'custrecord_advs_ofr_ofrstatus'
                    }) || ' ';
                    var Statusval = result.getValue({
                        name: 'custrecord_advs_ofr_ofrstatus'
                    }) || '';
                    var locationTransport = result.getText({
                        name: 'custrecord_location_for_transport'
                    }) || ' ';
                    var lastlocation = result.getText({
                        name: 'custrecord_last_location'
                    }) || ' ';
					var transportCompany = result.getText({
                        name: 'custrecord_transport_company'
                    }) || ' ';
                    var notes = result.getValue({
                        name: 'custrecord_additional_info_remarks'
                    }) || ' ';
                    var ofrid = result.id;
                    var vinlink = '';
                    var leaseagrement = '';

                    /* var vinlink = url.resolveRecord({
                    recordType: 'customrecord_advs_vm',
                    recordId: vinval
                    }); */
                    vinlink = 'https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=129&id=' + vinval;
                    leaseagrement = 'https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=675&id=' + stockval;
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_edit",
                        line: count,
                        value: '<a href="#" onclick=popupCenter(' + stockval + ')> <i class="fa fa-edit" style="color:blue;"></i></a>'
                    });

                    if (tdate != ' ') {
                        sublistrepo.setSublistValue({
                            id: "custpage_repo_terminate_email",
                            line: count,
                            value: '<a href="#" onclick=openterminationpop(' + ofrid + ')> <i class="fa fa-envelope" aria-hidden="true" style="color:red"></i></a>'
                        });
                    }

                    if (repocompany != '') {

                        sublistrepo.setSublistValue({
                            id: "custpage_repo_hold_email",
                            line: count,
                            value: '<a href="#" onclick=openholdpop(' + ofrid + ')> <i class="fa fa-envelope" aria-hidden="true" style="color:orange"></i></a>'
                        });
                    }

                    sublistrepo.setSublistValue({
                        id: "custpage_repo_status",
                        line: count,
                        value: Statusval
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_lesee",
                        line: count,
                        value: name
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_leseedoc",
                        line: count,
                        value: stock //'<a href="' + leaseagrement + '">' + stock + '</a>'
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_vin",
                        line: count,
                        value: vin //'<a href="' + vinlink + '">' + vin + '</a>'
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_notes",
                        line: count,
                        value: notes
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_lastlocation",
                        line: count,
                        value: lastlocation
                    });
                    if (repocompanyval != '')
                        sublistrepo.setSublistValue({
                            id: "custpage_repo_repocompany",
                            line: count,
                            value: repocompanyval
                        });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_dateoutput",
                        line: count,
                        value: tdpdate
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_terminationdate",
                        line: count,
                        value: tdate
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_destination",
                        line: count,
                        value: destination
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_location_for_transport",
                        line: count,
                        value: locationTransport
                    });
                    if (Followup == true) {
                        sublistrepo.setSublistValue({
                            id: "custpage_repo_followupletter",
                            line: count,
                            value: '<img src="https://8760954.app.netsuite.com/core/media/media.nl?id=4644&c=8760954&h=EL8p2LAO88T5YeyN8HcQ1ZtGg-8KmScu4V05TJWCW0vuQX_I" width=30px; height=30px;/>'
                        });
                    } else {
                        sublistrepo.setSublistValue({
                            id: "custpage_repo_followupletter",
                            line: count,
                            value: Followup
                        });
                    }

                    sublistrepo.setSublistValue({
                        id: "custpage_repo_year",
                        line: count,
                        value: year
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_make",
                        line: count,
                        value: make
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_model",
                        line: count,
                        value: model
                    });
                    sublistrepo.setSublistValue({
                        id: "custpage_repo_current_odometer",
                        line: count,
                        value: ' '
                    });
					sublistrepo.setSublistValue({
                        id: "custpage_repo_transport_company",
                        line: count,
                        value: transportCompany
                    });
                    var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1644&deploy=1&repo=' + stockval;

                    // sublistrepo.setSublistValue({id:"custpage_repo_terminate_email",line:count,value:'<a href="#" onclick="openemailpopup("'+stockval+'")"><i class="fa fa-envelope" style="font-size:24px"></i></a>'});

                    count++;
                    return true;
                });
            }

         


            if (flagpara2) {
                form.addSubmitButton("Select Vehicle");
            }
            form.clientScriptModulePath = "./advs_cs_available_veh_by_bucket.js";
            response.writePage(form);
        } 
		else {
            var LeaseHeader = request.parameters.custpage_old_lease_id;
            var OldVinId = request.parameters.custpage_old_vin_id;

            var NewVinAssigned = "",
            CheckMark = "";
            var LineCount = request.getLineCount({
                group: "custpage_sublist"
            });
            for (var L = 0; L < LineCount; L++) {
                CheckMark = request.getSublistValue({
                    group: "custpage_sublist",
                    name: "cust_select_veh_card",
                    line: L
                })
                    if (CheckMark == true || CheckMark == 'true' || CheckMark == 'T') {
                        NewVinAssigned = request.getSublistValue({
                            group: "custpage_sublist",
                            name: "custpabe_vinid",
                            line: L
                        });
                        break;
                    }

        
            }
            record.submitFields({
                type: "customrecord_advs_lease_header",
                id: LeaseHeader,
                values: {
                    'custrecord_advs_la_vin_bodyfld': NewVinAssigned,
                }
            });

            record.submitFields({
                type: "customrecord_advs_vm",
                id: NewVinAssigned,
                values: {
                    'custrecord_advs_vm_reservation_status': 13,
                }
            });
            record.submitFields({
                type: "customrecord_advs_vm",
                id: OldVinId,
                values: {
                    'custrecord_advs_vm_reservation_status': 1,
                }
            });

            var onclickScript = " <html><body> <script type='text/javascript'>" +
                "try{" +
                "";
            onclickScript += "window.parent.location.reload();";
            onclickScript+="window.parent.closePopup();";
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
            log.error("searchPage",searchPage)

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
                var extclrdt = result.getText({
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
                
                var  invdepositLink = result.getValue({
                        name: "custrecord_advs_in_dep_trans_link",
                        join: "CUSTRECORD_ADVS_IN_DEP_VIN",
                });

                var InvSales    =  result.getValue({
                    name: "custrecord_advs_in_dep_sales_rep",
                    join: "CUSTRECORD_ADVS_IN_DEP_VIN"
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
				 var titlerestriction = result.getText({
                    name: "custrecord_advs_title_rest_ms_tm"
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
                obj.InvSales   = InvSales;
				
                obj.sleepersize   = sleepersize;
                obj.apu   = apu;
                obj.beds   = beds;
                obj.titlerestriction   = titlerestriction;
                

                if (bucketId) {
                    log.error("bucketId",bucketId)
                    if (uniqueBucket.indexOf(bucketId) == -1) {
                        uniqueBucket.push(bucketId);
                    }
                }
                vmDataResults.push(obj);
            });

            if (uniqueBucket.length > 0) {
                log.error("uniqueBucket.length",uniqueBucket.length)

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
                    columns:
                    [
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
					//log.debug('bucketData',bucketData);
                    return true;
                });
            }

            return vmDataResults;
        }
        function createReposessionSublist(form) {
            var sublistrepo = form.addSublist({
                id: "custpage_sublist_repo",
                type: serverWidget.SublistType.LIST,
                label: "List",
                tab: "custpage_repo_tab"
            }); 
            sublistrepo.displayType = serverWidget.SublistDisplayType.HIDDEN;
            sublistrepo.addField({
                id: "custpage_repo_edit",
                type: serverWidget.FieldType.TEXT,
                label: "Edit"
            })
            sublistrepo.addField({
                id: "custpage_repo_terminate_email",
                type: serverWidget.FieldType.TEXT,
                label: "Close"
            })
            sublistrepo.addField({
                id: "custpage_repo_hold_email",
                type: serverWidget.FieldType.TEXT,
                label: "Hold"
            })
            sublistrepo.addField({
                id: "custpage_repo_status",
                type: serverWidget.FieldType.SELECT,
                label: "Status",
                source: 'customlist_advs_ofr_status'
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_leseedoc",
                type: serverWidget.FieldType.TEXT,
                label: "Lesse#"
            })
            sublistrepo.addField({
                id: "custpage_repo_lesee",
                type: serverWidget.FieldType.TEXT,
                label: "Lesse"
            })

            sublistrepo.addField({
                id: "custpage_repo_vin",
                type: serverWidget.FieldType.TEXT,
                label: "VIN"
            })

            sublistrepo.addField({
                id: "custpage_repo_lastlocation",
                type: serverWidget.FieldType.TEXT,
                label: "Last Location"
            })
            sublistrepo.addField({
                id: "custpage_repo_repocompany",
                type: serverWidget.FieldType.SELECT,
                label: "Repo Company",
                source: "customrecord_repo_company"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_dateoutput",
                type: serverWidget.FieldType.TEXT,
                label: "Date Output"
            })
            sublistrepo.addField({
                id: "custpage_repo_terminationdate",
                type: serverWidget.FieldType.TEXT,
                label: "Termination Date"
            })

            sublistrepo.addField({
                id: "custpage_repo_followupletter",
                type: serverWidget.FieldType.TEXT,
                label: "FollowUp Letter"
            })

            sublistrepo.addField({
                id: "custpage_repo_notes",
                type: serverWidget.FieldType.TEXT,
                label: "Notes"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_destination",
                type: serverWidget.FieldType.TEXT,
                label: "Destination"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_location_for_transport",
                type: serverWidget.FieldType.TEXT,
                label: "Location For Transport"
            }).updateDisplayType({
                displayType: "inline"
            });

            sublistrepo.addField({
                id: "custpage_repo_year",
                type: serverWidget.FieldType.TEXT,
                label: "Year"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_make",
                type: serverWidget.FieldType.TEXT,
                label: "Make"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_model",
                type: serverWidget.FieldType.TEXT,
                label: "Model"
            }).updateDisplayType({
                displayType: "inline"
            });
            sublistrepo.addField({
                id: "custpage_repo_current_odometer",
                type: serverWidget.FieldType.TEXT,
                label: "Current Odometer"
            }).updateDisplayType({
                displayType: "inline"
            });
			sublistrepo.addField({
                id: "custpage_repo_transport_company",
                type: serverWidget.FieldType.TEXT,
                label: "Transport Company"
            }).updateDisplayType({
                displayType: "inline"
            });

            /* sublistrepo.addButton({
            id : 'custpage_hold_email',
            label : 'Hold Email',
            functionName : 'openholdpop()'
            });
            sublistrepo.addButton({
            id : 'custpage_termination_email',
            label : 'Termination Email',
            functionName : 'openterminationpop()'
            }); */
            return sublistrepo;
        }
        function createAuctionSublist(form) {
            var sublistauction = form.addSublist({
                id: "custpage_sublist_auction",
                type: serverWidget.SublistType.LIST,
                label: "List",
                tab: "custpage_auction_tab"
            });
            
            sublistauction.addField({
                id: "custpage_auction_name",
                type: serverWidget.FieldType.TEXT,
                label: "Name"
            })
			sublistauction.addField({
                id: "custpage_auction_status",
                type: serverWidget.FieldType.TEXT,
                label: "Status" 
            }) 
           /*  sublistauction.addField({
                id: "custpage_auction_leseedoc",
                type: serverWidget.FieldType.TEXT,
                label: "Lesse#"
            }) */
            sublistauction.addField({
                id: "custpage_auction_vin",
                type: serverWidget.FieldType.TEXT,
                label: "VIN"
            }) 
			sublistauction.addField({
                id: "custpage_auction_date",
                type: serverWidget.FieldType.TEXT,
                label: "Auction Date"
            })
			sublistauction.addField({
                id: "custpage_auction_location",
                type: serverWidget.FieldType.TEXT,
                label: "Location"
            })
			/* sublistauction.addField({
                id: "custpage_auction_location",
                type: serverWidget.FieldType.TEXT,
                label: "Location"
            }) */
			sublistauction.addField({
                id: "custpage_auction_starts",
                type: serverWidget.FieldType.TEXT,
                label: "Starts"
            });sublistauction.addField({
                id: "custpage_auction_drives",
                type: serverWidget.FieldType.TEXT,
                label: "Drives"
            });sublistauction.addField({
                id: "custpage_auction_acodes",
                type: serverWidget.FieldType.TEXT,
                label: "Active Codes"
            });sublistauction.addField({
                id: "custpage_auction_runner",
                type: serverWidget.FieldType.TEXT,
                label: "Runner"
            });sublistauction.addField({
                id: "custpage_auction_cleaned",
                type: serverWidget.FieldType.TEXT,
                label: "Cleaned"
            });sublistauction.addField({
                id: "custpage_auction_senttitle",
                type: serverWidget.FieldType.TEXT,
                label: "Title Sent"
            })
            sublistauction.addField({
                id: "custpage_auction_notes",
                type: serverWidget.FieldType.TEXT,
                label: "Notes"
            })
            sublistauction.addField({
                id: "custpage_auction_edit",
                type: serverWidget.FieldType.TEXT,
                label: "Edit"
            })
            return sublistauction;
        }
        function addDatatoAuction(sublistauction, vinID) {
            try {
                var _filters = [];
                // log.debug('vinID', vinID);
                if (vinID != '') {
                    _filters.push([
                            ["custrecord_ofr_vin", "is", vinID]
                        ])
                }
                var vehicle_auctionSearchObj = search.create({
                    type: "customrecord_advs_vehicle_auction",
                    filters: _filters,
                    columns:
                    [
                        "custrecord_auction_lease",
                        "custrecord_auction_vin",
                        "custrecord_auction_status",
                        "custrecord_auction_notes",
                        "custrecord_data_of_auction",
                        "custrecord_auction_location",
						"custrecord_auction_name",
						"custrecord_auction_runner",
						"custrecord_auction_cleaned",
						"custrecord_auction_title_sent",
						"custrecord_auction_starts",
						"custrecord_auction_drives",
						"custrecord_auction_active_codes"
                    ]
                });
                var searchResultCount = vehicle_auctionSearchObj.runPaged().count;
                // log.debug("customrecord_advs_vehicle_auctionSearchObj result count", searchResultCount);
                var count = 0;
                vehicle_auctionSearchObj.run().each(function (result) {
					
                          var acutName = result.getValue({
                            name: 'custrecord_auction_name'
                          }) || ' ';
						  var leaseName = result.getText({
                            name: 'custrecord_auction_lease'
                          }) || ' ';
                          var leaseVal = result.getValue({
                            name: 'custrecord_auction_lease'
                          }) || ' ';

                          var vinName = result.getText({
                            name: 'custrecord_auction_vin'
                          }) || ' ';
                          var vinVal = result.getValue({
                            name: 'custrecord_auction_vin'
                          }) || ' ';

                          var statusName = result.getText({
                            name: 'custrecord_auction_status'
                          }) || ' ';
                          var statusVal = result.getValue({
                            name: 'custrecord_auction_status'
                          }) || ' ';

                          var notesVal = result.getValue({
                            name: 'custrecord_auction_notes'
                          }) || ' ';

                          var dateofauction = result.getValue({
                            name: 'custrecord_data_of_auction'
                          }) || ' ';
                          var locationval = result.getValue({
                            name: 'custrecord_auction_location'
                          }) || ' ';
                          var locationText = result.getText({
                            name: 'custrecord_auction_location'
                          }) || ' ';
						var runner = result.getValue({
                            name: 'custrecord_auction_runner'
                          }) || ' ';
						  var Cleaned = result.getValue({
                            name: 'custrecord_auction_cleaned'
                          }) || ' ';
						  var tsent = result.getValue({
                            name: 'custrecord_auction_title_sent'
                          }) || ' ';
						  var starts = result.getValue({
                            name: 'custrecord_auction_starts'
                          }) || ' ';
						  var drives = result.getValue({
                            name: 'custrecord_auction_drives'
                          }) || ' ';
						  var activecodes = result.getValue({
                            name: 'custrecord_auction_active_codes'
                          }) || ' ';
						
                          var auctionid = result.id;
                          sublistauction.setSublistValue({
                            id: "custpage_auction_edit",
                            line: count,
                            value: '<a href="#" onclick=openauction(' + auctionid + ')> <i class="fa fa-edit" style="color:blue;"></i></a>'
                          });
  
                          sublistauction.setSublistValue({
                            id: "custpage_auction_status",
                            line: count,
                            value: statusName
                          });
                           sublistauction.setSublistValue({
                            id: "custpage_auction_name",
                            line: count,
                            value: acutName
                          }); 
                         /*  sublistauction.setSublistValue({
                            id: "custpage_auction_leseedoc",
                            line: count,
                            value: leaseName //'<a href="' + leaseagrement + '">' + stock + '</a>'
                          }); */
                          sublistauction.setSublistValue({
                            id: "custpage_auction_vin",
                            line: count,
                            value: vinName //'<a href="' + vinlink + '">' + vin + '</a>'
                          });
						  sublistauction.setSublistValue({
                            id: "custpage_auction_date",
                            line: count,
                            value: dateofauction //'<a href="' + vinlink + '">' + vin + '</a>'
                          });
						  sublistauction.setSublistValue({
                            id: "custpage_auction_location",
                            line: count,
                            value: locationText //'<a href="' + vinlink + '">' + vin + '</a>'
                          });
						  sublistauction.setSublistValue({
                            id: "custpage_auction_starts",
                            line: count,
                            value: starts 
                          });sublistauction.setSublistValue({
                            id: "custpage_auction_drives",
                            line: count,
                            value: drives 
                          });sublistauction.setSublistValue({
                            id: "custpage_auction_acodes",
                            line: count,
                            value: activecodes 
                          });sublistauction.setSublistValue({
                            id: "custpage_auction_runner",
                            line: count,
                            value: runner 
                          });sublistauction.setSublistValue({
                            id: "custpage_auction_cleaned",
                            line: count,
                            value: Cleaned 
                          });sublistauction.setSublistValue({
                            id: "custpage_auction_senttitle",
                            line: count,
                            value: tsent 
                          });
						  
                          sublistauction.setSublistValue({
                            id: "custpage_auction_notes",
                            line: count,
                            value: notesVal
                          }); 
                          count++;
                          return true;
				});
			}catch(e)
			{
				log.debug('error',e.toString())
			}
		}
        var deliveryVinArr = ""; 
        function createdeliverysublist(form){
            var DepositDeliverysublist = form.addSublist({
                id: "custpage_sublist_deposit_delivery",
                type: serverWidget.SublistType.LIST,
                label: "List",
                tab: "custpage_delivery_tab"
            });
           

          var Locationfld =   DepositDeliverysublist.addField({
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


           var etadays =  DepositDeliverysublist.addField({
                id: "cust_delivery_date",
                type: serverWidget.FieldType.DATE,
                label: "ETA"
            });
            etadays.updateDisplayType({
                displayType: "inline"
            });

           var closedealfld =  DepositDeliverysublist.addField({
                id: "cust_delivery_close_deal",
                type: serverWidget.FieldType.TEXT,
                label: "Days To Close Deal"
            });
            closedealfld.updateDisplayType({
                displayType: "inline"
            });

            
          var insapplyFld =   DepositDeliverysublist.addField({
                id: "cust_delivery_insurance_deal",
                type: serverWidget.FieldType.TEXT,
                label: "Insurance Application"
            });
            insapplyFld.updateDisplayType({
                displayType: "inline"
            });
          var cleardeliveryfld  = DepositDeliverysublist.addField({
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

           var truckreadyfld =  DepositDeliverysublist.addField({
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
                filters:
                [
                   ["isinactive","is","F"], 
                   "AND", 
                   ["custrecord_advs_in_dep_sales_quote","is","T"],
                   "AND", 
                   ["custrecord_advs_in_dep_trans_link","noneof","@NONE@"]
                ],
                columns:
                [
                   search.createColumn({name: "custrecord_advs_in_dep_location", label: "Location"}),
                   search.createColumn({name: "custrecord_advs_in_dep_name", label: "Name"}),
                   search.createColumn({name: "custrecord_advs_in_dep_sales_rep", label: "SALESMAN"}),
                   search.createColumn({name: "custrecord_advs_in_dep_eta", label: "ETA"}),
                   search.createColumn({name: "custrecord_advs_in_dep_days_close_deal", label: "Days To Close Deal "}),
                   search.createColumn({name: "custrecord_advs_in_dep_insur_application", label: "Insurance Application"}),
                   search.createColumn({name: "custrecord_advs_in_dep_clear_delivery", label: "Cleared For Delivery"}),
                   search.createColumn({name: "custrecord_advs_in_dep_vin", label: "VIN"}),
                   search.createColumn({name: "custrecord_advs_in_dep_truck_ready", label: "Truck Ready"}),
                   search.createColumn({name: "custrecord_advs_in_dep_washed", label: "Washed"}),
                   search.createColumn({name: "custrecord_advs_in_dep_tot_lease_incepti", label: "Total lease Inception"}),
                   search.createColumn({name: "custrecord_advs_in_dep_deposit", label: "Deposit"}),
                   search.createColumn({name: "custrecord_advs_in_dep_pu_payment", label: "P/U Payment"}),
                   search.createColumn({name: "custrecord_advs_in_dep_balance", label: "Balance"}),
                   search.createColumn({name: "custrecord_advs_in_dep_mc_oo", label: "MC/OO"}),
                   search.createColumn({name: "custrecord_advs_in_dep_sales_quote", label: "Sales Quote"}),
                   search.createColumn({name: "custrecord_advs_in_dep_contract", label: "Contract"}),
                   search.createColumn({name: "custrecord_advs_in_dep_notes", label: "Notes"}),
                   search.createColumn({name: "custrecord_advs_in_dep_exceptions", label: "Exceptions"}),
                   search.createColumn({name: "custrecord_advs_in_dep_trans_link", label: "Deposit Link"})
                ]
             });


             var searchResultCount = Deliveryboardsearch.runPaged().count;
                var count = 0;

                Deliveryboardsearch.run().each(function (result) {
					
                          var  deliverylocation = result.getValue({
                            name: 'custrecord_advs_in_dep_location'
                          }) || '';
                          var  deliverycustomer = result.getValue({
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
                          



                          if(deliverylocation){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_location",
                                line: count,
                                value: deliverylocation
                            });
                          }
                          

                        if(deliverycustomer){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_custname",
                                line: count,
                                value: deliverycustomer
                            });
                        }
                        
                        if(deliverysalesrep){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_salesrep",
                                line: count,
                                value: deliverysalesrep
                            });
                        }
                        
                            log.debug("deliveryDate", deliveryDate)
                            if(deliveryDate){

                                var formattedFromDate = format.format({value: new Date(deliveryDate), type: format.Type.DATE});
                                log.debug("formattedFromDate", formattedFromDate)

                            }

                        // if(deliveryDate){ 
                        // DepositDeliverysublist.setSublistValue({
                        //     id: "cust_delivery_date",
                        //     line: count,
                        //     value: deliveryDate
                        // });
                        // }

                        if(deliveryclosedeal){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_close_deal",
                                line: count,
                                value: deliveryclosedeal
                            });
                        }
                        
                        if(deliveryinsurance){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_insurance_deal",
                                line: count,
                                value: deliveryinsurance
                            });
                        }
                        
                        if(depcleardelivery){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_clear_deliver",
                                line: count,
                                value: depcleardelivery
                              });
                        }
                          

                        if(deliveryVin){
                        DepositDeliverysublist.setSublistValue({
                            id: "cust_delivery_vin",
                            line: count,
                            value: deliveryVin
                            });
                        }

                        
                    if(deliverytruckready){
                        DepositDeliverysublist.setSublistValue({
                            id: "cust_delivery_truck_ready",
                            line: count,
                            value: 'T'
                          });
                    }
                          

                        
                        if(deliveryWashed){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_truck_wash",
                                line: count,
                                value: 'T'
                              });
                        }
                          

                                                  
                        if(deliverytotlease){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_total_lease",
                                line: count,
                                value: deliverytotlease
                              });
                        }
                          

                        if(deliverydeposit){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_deposit",
                                line: count,
                                value: deliverydeposit
                              });
                        }
                          
                        if(deliverypupayment){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_pu_payment",
                                line: count,
                                value: deliverypupayment
                              });
                        }
                          
                        if(deliverybalance){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_balance",
                                line: count,
                                value: deliverybalance
                              });
                        }
                          
                        
                        if(deliverymcoo){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_truck_mcoo",
                                line: count,
                                value: deliverymcoo
                              });
                        }
                          
                          if(deliverymsalesquote){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_sales_quote",
                                line: count,
                                value: 'T'
                              });
                          }
                          
                          
                          
                          if(deliverynotes){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_truck_notes",
                                line: count,
                                value: deliverynotes
                              });
                            }

                        if(deliverycontract){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_truck_contract",
                                line: count,
                                value: deliverycontract
                            });
                        }
                          

                          
                        if(deliveryexception){
                            DepositDeliverysublist.setSublistValue({
                                id: "cust_delivery_truck_exception",
                                line: count,
                                value: deliveryexception
                            });
                        }

                        
                        var depurl='https://8760954.app.netsuite.com/app/accounting/transactions/transaction.nl?id='+deliverydepolink;
                        DepositDeliverysublist.setSublistValue({
                            id: "cust_delivery_deposit_id",
                            line: count,
                            value: '<a href="'+depurl+'" target="_blank">'+deliverydepotext+'</a>'
                        });

    
                        
                          count++;
                          return true;
				});
                try {    

            }catch(e)
			{
				log.debug('error',e.toString())
			}
          
        }
		function createsummarydashbaord(form)
		{
			try{
				var htmlContent = getHtmlContent();
				/* form.addField({
                id: "custpage_inlinetest",
                type: serverWidget.FieldType.TEXT,
                label: "Working",
				container: "custpage_summary_tab"
            }); */
				var inlineHTML = form.addField({
                id: "custpage_inlinehtml_sd",
                type: serverWidget.FieldType.INLINEHTML,
                label: " ",
				container: "custpage_summary_tab"
            });
			
           inlineHTML.defaultValue=htmlContent;
			}catch(e)
			{
				log.debug('error',e.toString())
			}
		}
		function getHtmlContent(){
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
                    search.createColumn({name: "name", label: "Name"}),
                    search.createColumn({name: "internalid", label: "Internal ID"})
                ]
            });
            locationSearchObj.run().each(function(result){
                locationData.push({
                    id: result.getValue("internalid"),
                    name: result.getValue("name")
                });
                return true;
            });
            // bucket data
            var bucketSearchObj = search.create({
                type: "customrecord_ez_bucket_calculation",
                filters: [["isinactive", "is", "F"]],
                columns: [
                    search.createColumn({name: "name", label: "Name"}),
                    search.createColumn({name: "internalid", label: "Internal ID"})
                ]
            });
            bucketSearchObj.run().each(function(result){
                bucketData.push({
                    id: result.getValue("internalid"),
                    name: result.getValue("name")
                });
                return true;
            });
            //  status data
            var internalIds = ["13"];
            var statusSearchObj = search.create({
                type: "customlist_advs_reservation_status",
                filters: [ ["isinactive", "is", "F"],
                "AND",
                ["internalid","anyof",internalIds]
              ],
                columns: [
                    search.createColumn({name: "name", label: "Name"}),
                    search.createColumn({name: "internalId", label: "Internal ID"})
                ]
            });
            statusSearchObj.run().each(function(result){
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
                filters: [["isinactive", "is", "F"]],
                columns: [
                    search.createColumn({name: "custrecord_advs_vm_location_code", label: "Location"}),
                    search.createColumn({name: "custrecord_advs_vm_reservation_status", label: "Truck Internal Status"}),
                    search.createColumn({name: "custrecord_vehicle_master_bucket", label: "Bucket Calculation"})
                ]
            });
            vehicleSearchObj.run().each(function(result){
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
            vehicleSearchObj.run().each(function(result){
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
                "        .container { display: flex; width: 100%; }\n" +
                "        .left, .right { padding: 10px; }\n" +
                "        .left { flex: 50%; }\n" +
                "        .right { flex: 50%; }\n" +
                "        .summdash { height: 50%; width: 80%; border-collapse: collapse; margin-bottom: 15px; font-size: 12px; }\n" +
                "        .summdash td { padding: 5px; text-align:center; }\n" +
                "        .summdash th { padding: 2px; text-align: center; background-color: #f4b400; color: black; }\n" +
                "        .total-row { font-weight: bold; }\n" +
                "        .table-container { margin-bottom: 10px; }\n" +
                "        #piechart{width:100%;max-width:600px; height:500px;}\n"+
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "<div class=\"container\">\n" +
                "<div class=\"left\">\n";
               
                    htmlContent+=  " <div class=\"table-container\">\n" +
                "            <!-- <div class=\"section-title\"></div> -->\n" +
                "            <table class='summdash'>\n" +
                "                <thead>\n" +
                "                    <tr>\n" +
                "                        <th style=\"width:10%;text-align:left;\">Total</th>\n" ;
                bucketData.forEach(function(buck){
                    htmlContent+= "<th style=\"width:5%\">"+buck.name+"</th>\n" ;
                })
                htmlContent+="<th style=\"width:5%\">Total</th>\n" +
                "                    </tr>\n" +
                "                </thead>\n" +
                "                <tbody>\n" ;
                statusData.forEach(function(status, index) {
                    var style = (index % 2 !== 0) ? "background-color:#ADD8E6;" : "";
                    htmlContent += "<tr style=\"" + style + "\">\n" +
                        "<td style=\"text-align:left;\">" + status.name + "</td>\n";
                
                    var totalForStatus = 0;
                
                    // Iterate over bucketData for each status
                    bucketData.forEach(function(buck) {
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
                bucketData.forEach(function(buck) {
                    var totalForBucket = 0;
                    statusData.forEach(function(status) {
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
       

            locationData.forEach(function(loc){
                htmlContent += "<div class=\"table-container\">\n" +
                    "<table class='summdash'>\n" +
                    "<thead>\n" +
                    "<tr>\n" +
                    "<th style=\"width:10%;text-align:left;\">" + loc.name + "</th>\n";

                bucketData.forEach(function(buck){
                    htmlContent += "<th style=\"width:5%\">" + buck.name + "</th>\n";
                });

                htmlContent += "<th style=\"width:5%\">Total</th>\n" +
                    "</tr>\n" +
                    "</thead>\n" +
                    "<tbody>\n";
            

                statusData.forEach(function(status, index){
                    var style = (index % 2 !== 0) ? "background-color:#ADD8E6;" : "";
                    htmlContent += "<tr style=\"" + style + "\">\n" +
                        "<td style=\"text-align:left;\">" + status.name + "</td>\n";

                     var totalForStatus = 0;
                     bucketData.forEach(function(buck){
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
   htmlContent+= "</div>\n"+  
"</div>\n" +
"</body>\n" +
"</html>";  
         return htmlContent;
        }

            
        
        function createInsClaimSublist(form)		{
			try{
				var sublistclaim = form.addSublist({
					id: "custpage_sublist_custpage_subtab_insur_claim",
					type: serverWidget.SublistType.LIST,
					label: "List",
					tab: "custpage_claim_tab"
				}); 
				sublistclaim.addButton({
					id : 'claimform',
					label : 'Claim',
					functionName:'opennewclaim()'
				});
				var edit = sublistclaim.addField({
				id: 'cust_fi_editclaim',
				type: serverWidget.FieldType.TEXT,
				label: 'EDIT'
			});
					sublistclaim.addField({
						id: 'cust_fi_list_stock_no',
						type: serverWidget.FieldType.TEXT,
						label: 'Lease #'
					});
					var insdoc = sublistclaim.addField({
						id: 'cust_fi_ins_doc',
						type: serverWidget.FieldType.TEXT,
						label: 'Claim #'
					});
					sublistclaim.addField({
						id: 'cust_fi_f_l_name',
						type: serverWidget.FieldType.TEXT,
						label: 'First and Last Name'
					});
					sublistclaim.addField({
						id: 'cust_fi_dateofloss',
						type: serverWidget.FieldType.TEXT,
						label: 'Date of Loss'
					});
					sublistclaim.addField({
						id: 'cust_fi_desc_accident',
						type: serverWidget.FieldType.TEXT,
						label: 'Description of Accident'
					});
					var claimFiled = sublistclaim.addField({
						id: 'cust_fi_claim_filed',
						type: serverWidget.FieldType.TEXT,
						label: 'Claim Filed'
					});
					var insFrom = sublistclaim.addField({
						id: 'cust_fi_ins_from',
						type: serverWidget.FieldType.TEXT,
						label: 'Insurance From'
					});
					
					var namenumber = sublistclaim.addField({
						id: 'cust_fi_name_number',
						type: serverWidget.FieldType.TEXT,
						label: 'Name and Number'
					});
					var repairable = sublistclaim.addField({
						id: 'cust_fi_repairable',
						type: serverWidget.FieldType.TEXT,
						label: 'Repairable'
					});
					var vehicleloc = sublistclaim.addField({
						id: 'cust_fi_veh_loc',
						type: serverWidget.FieldType.TEXT,
						label: 'Vehicle LOcation'
					});
					var vehicleloc = sublistclaim.addField({
						id: 'cust_fi_notes',
						type: serverWidget.FieldType.TEXTAREA,
						label: 'Notes'
					});
					var followup = sublistclaim.addField({
						id: 'cust_fi_folowup',
						type: serverWidget.FieldType.TEXT,
						label: 'Followup'
					});
					return sublistclaim;
			}catch(e)
			{
				log.debug('error',e.toString());
			}
		}
	    function searchForclaimData(insueclaim_sublist){
		try{
			var customrecord_advs_insurance_claim_sheetSearchObj = search.create({
			   type: "customrecord_advs_insurance_claim_sheet",
			   filters:
			   [
				  ["isinactive","is","F"],
				  "AND",
				   ["custrecord_claim_settled","is","F"]
			   ],
			   columns:
			   [
				  "custrecord_ic_lease",
				  "custrecord_first_last_name",
				  "custrecord_ic_date_of_loss",
				  "custrecord_ic_description_accident",
				  "custrecord_ic_claim_field",
				  "custrecord_ic_filed_insurance_type",
				  "custrecord_ic_claim_number",
				  "custrecord_ic_adj_name_number",
				  "custrecord_ic_repairable_type",
				  "custrecord_ic_location_vehicle",
				  "custrecord_ic_notes",
				  "custrecord_tickler_followup",
				  "name"
			   ]
			});
			var searchResultCount = customrecord_advs_insurance_claim_sheetSearchObj.runPaged().count;
			log.debug("customrecord_advs_insurance_claim_sheetSearchObj result count",searchResultCount);
			var count=0;
			customrecord_advs_insurance_claim_sheetSearchObj.run().each(function(result){
				
				var Stock_link = url.resolveRecord({
					recordType: 'customrecord_advs_lease_header',
					isEditMode: false
				});
				var claim_link = url.resolveRecord({
					recordType: 'customrecord_advs_insurance_claim_sheet',
					isEditMode: false
				});
			 var stock_carr = Stock_link + '&id=' + result.getValue({name:'custrecord_ic_lease'});
			 var claim_carr = claim_link + '&id=' + result.id;
			 var stockREcLink = '<a href="' + encodeURI(stock_carr) + '" target="_blank">' + encodeURI(result.getText({name:'custrecord_ic_lease'})) + '</a>';
			 var claimREcLink = '<a href="' + encodeURI(claim_carr) + '" target="_blank">' + encodeURI(result.getValue({name:'name'})) + '</a>';
			 
			   // .run().each has a limit of 4,000 results
							insueclaim_sublist.setSublistValue({
                                id: "cust_fi_list_stock_no",
                                line: count,
                                value: stockREcLink//result.getText({name:'custrecord_ic_lease'})
                            });
							insueclaim_sublist.setSublistValue({
                                id: "cust_fi_ins_doc",
                                line: count,
                                value: claimREcLink//result.getValue({name:'name'})|| ' '
                            });
							insueclaim_sublist.setSublistValue({
                                id: "cust_fi_f_l_name",
                                line: count,
                                value: result.getValue({name:'custrecord_first_last_name'})
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_dateofloss",
                                line: count,
                                value: result.getValue({name:'custrecord_ic_date_of_loss'}) || ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_desc_accident",
                                line: count,
                                value: result.getValue({name:'custrecord_ic_description_accident'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_claim_filed",
                                line: count,
                                value: result.getText({name:'custrecord_ic_claim_field'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_ins_from",
                                line: count,
                                value: result.getText({name:'custrecord_ic_filed_insurance_type'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_name_number",
                                line: count,
                                value: result.getValue({name:'custrecord_ic_adj_name_number'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_repairable",
                                line: count,
                                value: result.getText({name:'custrecord_ic_repairable_type'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_veh_loc",
                                line: count,
                                value: result.getValue({name:'custrecord_ic_location_vehicle'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_notes",
                                line: count,
                                value: result.getValue({name:'custrecord_ic_notes'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_folowup",
                                line: count,
                                value: result.getValue({name:'custrecord_tickler_followup'})|| ' '
                            });insueclaim_sublist.setSublistValue({
                                id: "cust_fi_editclaim",
                                line: count,
                                value: '<a href="#" onclick="editclaimsheet('+result.id+')"> <i class="fa fa-edit" style="color:blue;"</i></a>'
                            });
							count++;
			   return true;
			});
			 
		}catch(e)
		{
			log.debug('error',e.toString())
		}
	}      
	function InventorySearch(brandId,modelId,locatId,bucketId,freqId,vinID,LeaseHeaderId,iFrameCenter,flagpara2,Old_Vin_From_lease,brandFldObj,modelFldObj,locFldObj,bucketFldObj,freqFldObj,vinFldObj,LeaseFieldObj,IframeCenterFieldObj,Flagpara2FieldObj,OldVinFieldObj,status ,color ,transmission,salesrep,mileage,statusFldObj,colorFldObj,transmissionFldObj,salesrepFldObj,mileageFldObj  )
	{
		var vmSearchObj = search.create({
                type: "customrecord_advs_vm",
                filters: 
                [
                    ["custrecord_advs_vm_reservation_status", "anyof", "13"], "AND",
                    ["custrecord_vehicle_master_bucket", "noneof", "@NONE@"]
                ],
                columns:
                [
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
                     }),
					 search.createColumn({
                        name: "custrecord_advs_sleeper_size_ms"  
                    }),search.createColumn({
                        name: "custrecord_advs_apu_ms_tm"  
                    }),search.createColumn({
                        name: "custrecord_advs_beds_ms_tm"  
                    }),search.createColumn({
                        name: "custrecord_advs_title_rest_ms_tm"  
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
			//status ,color ,transmission,salesrep,mileage  
            if (vinID != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                        name: "internalid",
                        operator: search.Operator.IS,
                        values: vinID
                    }))
                vinFldObj.defaultValue = vinID;
            }
			if (status != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_reservation_status",
                        operator: search.Operator.IS,
                        values: status
                    }))
                statusFldObj.defaultValue = status;
            }
			if (color != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_exterior_color",
                        operator: search.Operator.IS,
                        values: color
                    }))
                colorFldObj.defaultValue = color;
            }
			if (transmission != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_transmission_type",
                        operator: search.Operator.IS,
                        values: transmission
                    }))
                transmissionFldObj.defaultValue = transmission;
            }
			if (mileage != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_mileage",
                        operator: search.Operator.IS,
                        values: mileage
                    }))
                mileageFldObj.defaultValue = mileage;
            }if (salesrep != '') {
                // log.debug('vinID filters', vinID);
                vmSearchObj.filters.push(search.createFilter({
                        name: "custrecord_advs_vm_soft_hld_sale_rep",
                        operator: search.Operator.IS,
                        values: salesrep
                    }))
                salesrepFldObj.defaultValue = salesrep;
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
                filters:
                [
                    ["type", "anyof", "InvtPart"],
                    "AND",
                    ["custitem_advs_inventory_type", "anyof", "1"]
                ],
                columns:
                [
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
                         
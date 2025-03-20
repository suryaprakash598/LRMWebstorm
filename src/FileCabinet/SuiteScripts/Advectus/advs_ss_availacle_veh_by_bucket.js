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
        var UserObj = runtime.getCurrentUser();
        var UserSubsidiary = UserObj.subsidiary;
        var UserLocation = UserObj.location;
        var Userid = UserObj.id;
        // Parameters
        var pageSize = 1000; // Set your preferred page size
        var pageId = parseInt(request.parameters.page) || 0;

        var filtersparam = request.parameters.filters || '[]';
        var brandId = request.parameters.brand;
        var modelId = request.parameters.model;
        var locatId = request.parameters.locat;
        var plocatId = request.parameters.plocat;
        var salesrepId = request.parameters.salesrepfilter;
        var depofilterId = request.parameters.depositfilter;
        var bucketId = request.parameters.bucket;
        var bucketChild = request.parameters.bucketchild;
        var freqId = request.parameters.freq || 3; // monthly
        var vinID = request.parameters.unitvin || '';
        var _vinText = request.parameters.unitvintext || '';
        var _statushold = request.parameters.statushold || '';
        var _invstatusFil = '';
        var invstock = request.parameters.invstock || '';
        var status = request.parameters.status || '';
        //log.debug('status from param',status);
        _invstatusFil = status;
        var color = request.parameters.color || '';
        var transmission = request.parameters.transmission || '';
        var salesrep = request.parameters.salesrep || '';
        var mileage = request.parameters.mileage || '';
        var ttlrest = request.parameters.ttlrest || '';
        var washed = request.parameters.washed || '';
        var singlebunk = request.parameters.singlebunk || '';
        var invterms = request.parameters.invterms || '';
        var invapu = request.parameters.invapu || '';
        var invbed = request.parameters.invbed || '';
        var sfcustomer = request.parameters.sfcustomer || '';
        var bodystyle = request.parameters.bodystyle || '';
        var invtransm = request.parameters.invtransm || '';
        var invyear = request.parameters.invyear || '';
        var invcolor = request.parameters.invcolor || '';
        var invtruckready = request.parameters.invtruckready || '';
        var invengine = request.parameters.invengine || '';
        var invsssize = request.parameters.invsssize || '';


        var repo_sts = request.parameters.repo_sts || '';
        var repo_vin = request.parameters.repo_vin || '';
        var repo_loc = request.parameters.repo_loc || '';
        var repo_model = request.parameters.repo_model || '';
        var repo_mil = request.parameters.repo_mil || '';
        var repo_com = request.parameters.repo_com || '';
        var repo_date = request.parameters.repo_date || '';
        var repo_cust = request.parameters.repo_cust || '';
        var repo_stock = request.parameters.repo_stock || '';
        var repo_year = request.parameters.repo_year || '';
        var repo_collec = request.parameters.repo_collec || '';
        var repo_dest = request.parameters.repo_dest || '';

        var auc_sts = request.parameters.auc_sts || '';
        var auc_condition = request.parameters.auc_condition || '';
        var auc_date = request.parameters.auc_date || '';
        var auc_cleaned = request.parameters.auc_cleaned || '';
        var auc_vin = request.parameters.auc_vin || '';
        var auc_loc = request.parameters.auc_loc || '';
        var auc_ttlsent = request.parameters.auc_ttlsent || '';
        var auc_ttlrest = request.parameters.auc_ttlrest || '';

        var DBVin = request.parameters.DBVin || '';
        var DBCustomer = request.parameters.DBCustomer || '';
        var DBSalesRep = request.parameters.DBSalesRep || '';
        var DBTruckReady = request.parameters.DBTruckReady || '';
        var DBWashed = request.parameters.DBWashed || '';
        var DBmc00 = request.parameters.DBmc00 || '';
        var DBClaim = request.parameters.DBClaim || '';
        var DBStock = request.parameters.DBStock || '';
        var DBUnitCondition = request.parameters.DBUnitCondition || '';
        var DBLocation = request.parameters.DBLocation || '';
        var DBContract = request.parameters.DBContract || '';
		
		
		var tpttstatus,tptstatus,tptfloc,tpttloc,tptstock ='';
		tpttstatus = request.parameters.tpttstatus || '';
		tptstatus = request.parameters.tptstatus || '';
		tptfloc = request.parameters.tptfloc || '';
		tpttloc = request.parameters.tpttloc || '';
		tptstock = request.parameters.tptstock || '';

        var ins_sts = request.parameters.ins_sts || '';
        var Inv_tab = request.parameters.inv_tab;
        var Rep_tab = request.parameters.rep_tab;
        var Auc_tab = request.parameters.auc_tab;
        var Del_tab = request.parameters.del_tab;
        var Ins_tab = request.parameters.ins_tab;
        if (Inv_tab == "true" || Inv_tab == true) {
          Inv_tab = "T"
        } else {
          Inv_tab = "F"
        }
        if (Rep_tab == "true" || Rep_tab == true) {
          Rep_tab = "T"
        } else {
          Rep_tab = "F"
        }
        if (Auc_tab == "true" || Auc_tab == true) {
          Auc_tab = "T"
        } else {
          Auc_tab = "F"
        }
        if (Del_tab == "true" || Del_tab == true) {
          Del_tab = "T"
        } else {
          Del_tab = "F"
        }
        if (Ins_tab == "true" || Ins_tab == true) {
          Ins_tab = "T"
        } else {
          Ins_tab = "F"
        }
        var Old_Vin_From_lease = request.parameters.custpara_old_vin; //custpara_old_vin
        var flagpara2 = request.parameters.custpara_flag_2;
        var LeaseHeaderId = request.parameters.custpara_lease_id;
        var iFrameCenter = request.parameters.ifrmcntnr;
        var scriptId = currScriptObj.id;
        var deploymentId = currScriptObj.deploymentId;

        var startIndex = parseInt(request.parameters.start) || 0;
        if (flagpara2) { //
          var form = serverWidget.createForm({
            title: "Swap",
            hideNavBar: true
          });
        } else {
          var form = serverWidget.createForm({
            title: " "
          });
        }

        var filterGp = form.addFieldGroup({
          id: "custpage_fil_gp",
          label: "Filters"
        });
        var filterGprepo = form.addFieldGroup({
          id: "custpage_fil_gp_repo",
          label: "Filters"
        });
        var filterGpauc = form.addFieldGroup({
          id: "custpage_fil_gp_auc",
          label: "Filters"
        });
        var filterGpdb = form.addFieldGroup({
          id: "custpage_fil_gp_db",
          label: "Filters"
        });
        var filterGpins = form.addFieldGroup({
          id: "custpage_fil_gp_ins",
          label: "Filters"
        });
        var filterGptpt = form.addFieldGroup({
          id: "custpage_fil_gp_tpt",
          label: "Filters"
        });
        var _inventoyCount = 0;
        /* var subTab = form.addSubtab({ id: "custpage_veh_tab", label: "Inventory" });  */

        var filterFldObj = form.addField({
          id: "custpage_filter_params",
          type: serverWidget.FieldType.TEXT,
          label: "filtersparam",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });
        filterFldObj.defaultValue = filtersparam;
        // Add an inline HTML field with JavaScript to hide the group
        var inlineHtmlField = form.addField({
          id: 'custpage_inlinehtml_hidefilters',
          type: serverWidget.FieldType.INLINEHTML,
          label: 'Inline Script'
        });

        // JavaScript to hide the field group before loading
        inlineHtmlField.defaultValue = "<script>document.addEventListener('DOMContentLoaded', function() { jQuery('#tr_fg_custpage_fil_gp_repo').closest('table').closest('tr').hide(); jQuery('#tr_fg_custpage_fil_gp_auc').closest('table').closest('tr').hide();jQuery('#tr_fg_custpage_fil_gp_db').closest('table').closest('tr').hide(); });</script>";



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
          source: null,
          container: "custpage_fil_gp"
        })
        /* .updateDisplayType({ displayType: "hidden" }); */
        sourceLocation(locFldObj, UserSubsidiary);
		
		var plocFldObj = form.addField({
          id: "custpage_physicallocation",
          type: serverWidget.FieldType.SELECT,
          label: "Physical Location",
          source: 'customlistadvs_list_physicallocation',
          container: "custpage_fil_gp"
        })
		
        var bucketFldObj = form.addField({
          id: "custpage_bucket",
          type: serverWidget.FieldType.SELECT,
          label: "Bucket",
          source: "customrecord_ez_bucket_calculation",
          container: "custpage_fil_gp"
        });
        var bucketChildFldObj = form.addField({
          id: "custpage_bucket_child",
          type: serverWidget.FieldType.SELECT,
          label: "Bucket Child",
          source: "customrecord_bucket_calculation_location",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });
        /* bucketChildFldObj.updateBreakType({
            breakType: serverWidget.FieldBreakType.STARTCOL
          }); */
        var freqFldObj = form.addField({
          id: "custpage_freq",
          type: serverWidget.FieldType.SELECT,
          label: "Frequency",
          source: "customrecord_advs_st_frequency",
          container: "custpage_fil_gp"
        });
        var mileageFldObj = form.addField({
          id: "custpage_mileage",
          type: serverWidget.FieldType.TEXT,
          label: "Mileage",
          container: "custpage_fil_gp"
        });
        mileageFldObj.updateDisplaySize({
          height: 60,
          width: 37
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

        //freqFldObj.defaultValue = 3 // for monthly
        /* .updateDisplayType({ displayType: "hidden" }); */
        var vinFldObj = form.addField({
          id: "custpage_vin",
          type: serverWidget.FieldType.SELECT,
          label: "Vin Dropdown list",
          source: "customrecord_advs_vm",
          container: "custpage_fil_gp"
        });

        // Add Inline HTML field to load Select2
        var inlineHtmlvindd = form.addField({
          id: 'custpage_inlinehtml_vindd',
          type: serverWidget.FieldType.INLINEHTML,
          label: ' '
        });
        var selectvinfield = '';
        selectvinfield += `<select class="js-example-basic-single" name="state">
  <option value="AL">Alabama</option>
  <option value="WY">Wyoming</option>
</select>
 
               <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
				
   
  
  
  `;


        inlineHtmlvindd.defaultValue = '' //selectvinfield;
        var vinfreeformFldObj = form.addField({
          id: "custpage_vin_ff",
          type: serverWidget.FieldType.TEXT,
          label: "Vin #",
          container: "custpage_fil_gp"
        });
        vinfreeformFldObj.updateDisplaySize({
          height: 60,
          width: 37
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
        var transmissionFldObj = form.addField({
          id: "custpage_transmission",
          type: serverWidget.FieldType.SELECT,
          label: "Transmission",
          source: "customlist712",
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

        var salesrepfld = form.addField({
          id: "custpage_salesrep_filter",
          type: serverWidget.FieldType.SELECT,
          label: "Salesrep",
          container: "custpage_fil_gp"
        });

        var statusHoldFldObj = form.addField({
          id: "custpage_softhold_status",
          type: serverWidget.FieldType.SELECT,
          label: "Soft Hold",
          source: "customlist_advs_reservation_hold",
          container: "custpage_fil_gp"
        });
        //INVENTORY FILTERS EXTRA  

        var invStockFldObj = form.addField({
          id: "custpage_inv_stock",
          type: serverWidget.FieldType.TEXT,
          label: "STOCK #",
          source: null,
          container: "custpage_fil_gp"
        });
        var invColorFldObj = form.addField({
          id: "custpage_inv_color",
          type: serverWidget.FieldType.SELECT,
          label: "COLOR",
          source: "customlist_advs_color_list",
          container: "custpage_fil_gp"
        });

        var invYearFldObj = form.addField({
          id: "custpage_inv_year",
          type: serverWidget.FieldType.SELECT,
          label: "Year",
          source: "customlist_advs_truck_year",
          container: "custpage_fil_gp"
        });

        var invEngineFldObj = form.addField({
          id: "custpage_inv_engine",
          type: serverWidget.FieldType.SELECT,
          label: "Engine",
          source: "customrecord_advs_engine_model",
          container: "custpage_fil_gp"
        });

        var invTransmissionFldObj = form.addField({
          id: "custpage_inv_transmission",
          type: serverWidget.FieldType.SELECT,
          label: "Transmission",
          source: "customlist712",
          container: "custpage_fil_gp"
        });

        var invTitleRestFldObj = form.addField({
          id: "custpage_inv_ttle_restr",
          type: serverWidget.FieldType.SELECT,
          label: "Title Restriction",
          source: "customlist_advs_title_restriction_list",
          container: "custpage_fil_gp"
        });

        var invBodyStyleFldObj = form.addField({
          id: "custpage_inv_body_style",
          type: serverWidget.FieldType.SELECT,
          label: "Body Style",
          source: "customlist_advs_body_style",
          container: "custpage_fil_gp"
        });

        var invTruckReadyFldObj = form.addField({
          id: "custpage_inv_truck_ready",
          type: serverWidget.FieldType.SELECT,
          label: "Truck Ready",
          source: null,
          container: "custpage_fil_gp"
        });
        invTruckReadyFldObj.addSelectOption({
          value: '',
          text: ''
        });
        invTruckReadyFldObj.addSelectOption({
          value: 0,
          text: 'No'
        });
        invTruckReadyFldObj.addSelectOption({
          value: 1,
          text: 'Yes'
        });

        var invWashedFldObj = form.addField({
          id: "custpage_inv_truck_washed",
          type: serverWidget.FieldType.SELECT,
          label: "Washed",
          source: null,
          container: "custpage_fil_gp"
        });
        invWashedFldObj.addSelectOption({
          value: '',
          text: ''
        });
        invWashedFldObj.addSelectOption({
          value: 0,
          text: 'No'
        });
        invWashedFldObj.addSelectOption({
          value: 1,
          text: 'Yes'
        });

        var invSingleBunkFldObj = form.addField({
          id: "custpage_inv_single_bunk",
          type: serverWidget.FieldType.SELECT,
          label: "Single Bunk",
          source: "customlist_advs_single_bunk",
          container: "custpage_fil_gp"
        });

        var invTermsFldObj = form.addField({
          id: "custpage_inv_terms",
          type: serverWidget.FieldType.TEXT,
          label: "Terms",
          source: null,
          container: "custpage_fil_gp"
        });
        var invsssizeFldObj = form.addField({
          id: "custpage_inv_sssize",
          type: serverWidget.FieldType.SELECT,
          label: "Sleeper Size",
          source: "customlist_advs_ms_list_sleeper_size",
          container: "custpage_fil_gp"
        });
        var invApuFldObj = form.addField({
          id: "custpage_inv_apu",
          type: serverWidget.FieldType.SELECT,
          label: "Apu",
          source: "customlist_advs_ms_apu_list",
          container: "custpage_fil_gp"
        });
        var invBedsFldObj = form.addField({
          id: "custpage_inv_beds",
          type: serverWidget.FieldType.SELECT,
          label: "Beds",
          source: "customlist_advs_beds_list",
          container: "custpage_fil_gp"
        });

        var invshCustomerFldObj = form.addField({
          id: "custpage_inv_sh_customer",
          type: serverWidget.FieldType.SELECT,
          label: "Softhold Customer",
          source: "customer",
          container: "custpage_fil_gp"
        });
        //INVENTORY FILTERS EXTRA  


        //////////////////REPOSESSION FILTERS//////////////////////////

        var RepostatusFldObj = form.addField({
          id: "custpage_repo_status_fld",
          type: serverWidget.FieldType.SELECT,
          label: "Repo Status",
          source: "customrecord_advs_ofr_status",
          container: "custpage_fil_gp_repo"
        });

        if (repo_sts != "" && repo_sts != undefined && repo_sts != null) {
          RepostatusFldObj.defaultValue = repo_sts
        }

        var RepoVinFldObj = form.addField({
          id: "custpage_repo_vin",
          type: serverWidget.FieldType.SELECT,
          label: "VIN",
          source: "customrecord_advs_vm",
          container: "custpage_fil_gp_repo"
        });
        if (repo_vin != "" && repo_vin != undefined && repo_vin != null) {
          RepoVinFldObj.defaultValue = repo_vin
        }

        var RepoLocFldObj = form.addField({
          id: "custpage_repo_location",
          type: serverWidget.FieldType.SELECT,
          label: "LOCATION",
          source: "location",
          container: "custpage_fil_gp_repo"
        });
        if (repo_loc != "" && repo_loc != undefined && repo_loc != null) {
          RepoLocFldObj.defaultValue = repo_loc
        }

        var RepoModelFldObj = form.addField({
          id: "custpage_repo_model",
          type: serverWidget.FieldType.SELECT,
          label: "MODEL",
          source: "item",
          container: "custpage_fil_gp_repo"
        });
        if (repo_model != "" && repo_model != undefined && repo_model != null) {
          RepoModelFldObj.defaultValue = repo_model
        }

        var RepoMileageFldObj = form.addField({
          id: "custpage_repo_mileage",
          type: serverWidget.FieldType.TEXT,
          label: "MILEAGE",
          container: "custpage_fil_gp_repo"
        });
        if (repo_mil != "" && repo_mil != undefined && repo_mil != null) {
          RepoMileageFldObj.defaultValue = repo_mil
        }

        var RepoCompanyFldObj = form.addField({
          id: "custpage_repo_company",
          type: serverWidget.FieldType.SELECT,
          label: "COMPANY",
          source: 'customrecord_repo_company',
          container: "custpage_fil_gp_repo"
        });
        if (repo_com != "" && repo_com != undefined && repo_com != null) {
          RepoCompanyFldObj.defaultValue = repo_com
        }
        var RepoDateFldObj = form.addField({
          id: "custpage_repo_dateassigned",
          type: serverWidget.FieldType.DATE,
          label: "DATE ASSIGNED",
          container: "custpage_fil_gp_repo"
        });
        if (repo_date != "" && repo_date != undefined && repo_date != null) {
          RepoDateFldObj.defaultValue = repo_date
        }

        //REPOSESSION EXTRA  




        var RepoLesseFldObj = form.addField({
          id: "custpage_repo_lessee",
          type: serverWidget.FieldType.SELECT,
          label: "Lesse",
          source: "customer",
          container: "custpage_fil_gp_repo"
        });
        if (repo_cust != "" && repo_cust != undefined && repo_cust != null) {
          RepoLesseFldObj.defaultValue = repo_cust
        }
        var RepoStockFldObj = form.addField({
          id: "custpage_repo_stock",
          type: serverWidget.FieldType.TEXT,
          label: "Stock #",
          //source: null,//'customrecord_advs_lease_header',
          container: "custpage_fil_gp_repo"
        });
        if (repo_stock != "" && repo_stock != undefined && repo_stock != null) {
          RepoStockFldObj.defaultValue = repo_stock
        }
        var RepoYearFldObj = form.addField({
          id: "custpage_repo_year",
          type: serverWidget.FieldType.SELECT,
          label: "Year",
          // source: "customlist_advs_truck_year",
          source: "customrecord_advs_model_year",
          container: "custpage_fil_gp_repo"
        });
        if (repo_year != "" && repo_year != undefined && repo_year != null) {
          RepoYearFldObj.defaultValue = repo_year
        }
        var RepoCollectionsFldObj = form.addField({
          id: "custpage_repo_collections",
          type: serverWidget.FieldType.SELECT,
          label: "Collections",
          source: null,
          container: "custpage_fil_gp_repo"
        });
        RepoCollectionsFldObj.addSelectOption({
          value: '',
          text: ''
        });
        RepoCollectionsFldObj.addSelectOption({
          value: 2,
          text: 'No'
        });
        RepoCollectionsFldObj.addSelectOption({
          value: 1,
          text: 'Yes'
        });
        if (repo_collec != "" && repo_collec != undefined && repo_collec != null) {
          RepoCollectionsFldObj.defaultValue = repo_collec
        }
        var RepoDestinationFldObj = form.addField({
          id: "custpage_repo_destination",
          type: serverWidget.FieldType.SELECT,
          label: "Destination",
          source: "customlist_advs_destination",
          container: "custpage_fil_gp_repo"
        });
        if (repo_dest != "" && repo_dest != undefined && repo_dest != null) {
          RepoDestinationFldObj.defaultValue = repo_dest
        }
        ///////////////////////////// //REPOSESSION FILTERS///////////////////

        /////////////////AUCTION FILTERS///////////////////////////////////
        var AuctionStatusFldObj = form.addField({
          id: "custpage_auc_status",
          type: serverWidget.FieldType.SELECT,
          label: "Auction status",
          source: "customrecord_auction_status",
          container: "custpage_fil_gp_auc"
        })
        var AuctionLocationFldObj = form.addField({
          id: "custpage_auc_location",
          type: serverWidget.FieldType.SELECT,
          label: "Location",
          source: "location",
          container: "custpage_fil_gp_auc"
        })
        var AuctionVinFldObj = form.addField({
          id: "custpage_auc_vin",
          type: serverWidget.FieldType.SELECT,
          label: "VIN",
          source: "customrecord_advs_vm",
          container: "custpage_fil_gp_auc"
        })
        var AuctionDateFldObj = form.addField({
          id: "custpage_auc_date",
          type: serverWidget.FieldType.DATE,
          label: "Date",
          source: null,
          container: "custpage_fil_gp_auc"
        })

        var AuctionCondtionFldObj = form.addField({
          id: "custpage_auc_condition",
          type: serverWidget.FieldType.SELECT,
          label: "CONDITION",
          source: "customlist_advs_cond_list",
          container: "custpage_fil_gp_auc"
        })
        var AuctionCleanedFldObj = form.addField({
          id: "custpage_auc_cleaned",
          type: serverWidget.FieldType.SELECT,
          label: "CLEANED",
          source: "customlist_advs_cleaned_list",
          container: "custpage_fil_gp_auc"
        })
        /* if (auc_sts != "" && auc_sts != undefined && auc_sts != null) {
          AuctionStatusFldObj.defaultValue = auc_sts
        } */

        var AuctionTtleSentFldObj = form.addField({
          id: "custpage_auc_ttl_sent",
          type: serverWidget.FieldType.SELECT,
          label: "Title Sent",
          source: "customlist_advs_title_sent_list",
          container: "custpage_fil_gp_auc"
        })
        /* if (auc_sts != "" && auc_sts != undefined && auc_sts != null) {
          AuctionTtleSentFldObj.defaultValue = auc_sts
        } */
        var AuctionttlRestrFldObj = form.addField({
          id: "custpage_auc_ttl_restriction",
          type: serverWidget.FieldType.SELECT,
          label: "Title Restriction",
          source: "customlist_advs_title_restriction_list",
          container: "custpage_fil_gp_auc"
        })
        /*  if (auc_sts != "" && auc_sts != undefined && auc_sts != null) {
           AuctionttlRestrFldObj.defaultValue = auc_sts
         } */

        /////////////////AUCTION FILTERS///////////////////////////////////

        ////////////////DELIVERY BOARD FILTERS/////////////////////////////
        var DboardVinFldObj = form.addField({
          id: "custpage_db_vin",
          type: serverWidget.FieldType.SELECT,
          label: "VIN",
          source: "customrecord_advs_vm",
          container: "custpage_fil_gp_db"
        })

        var DboardCustomerFldObj = form.addField({
          id: "custpage_db_customer",
          type: serverWidget.FieldType.SELECT,
          label: "CUSTOMER",
          source: "customer",
          container: "custpage_fil_gp_db"
        })

        var DboardClaimFldObj = form.addField({
          id: "custpage_db_claim",
          type: serverWidget.FieldType.SELECT,
          label: "CLAIM",
          source: "customrecord_advs_insurance_claim_sheet",
          container: "custpage_fil_gp_db"
        })

        var DboardStockFldObj = form.addField({
          id: "custpage_db_stock",
          type: serverWidget.FieldType.SELECT,
          label: "STOCK",
          source: "customrecord_advs_vm",
          container: "custpage_fil_gp_db"
        })

        var DboardUnitConditionFldObj = form.addField({
          id: "custpage_db_unit_condition",
          type: serverWidget.FieldType.SELECT,
          label: "UNIT CONDITION",
          source: "customlist_repairable_type",
          container: "custpage_fil_gp_db"
        })

        var DboardSalesrepFldObj = form.addField({
          id: "custpage_db_salesrep",
          type: serverWidget.FieldType.SELECT,
          label: "SALESREP",
          source: "employee",
          container: "custpage_fil_gp_db"
        })
        var DboardTruckReadyFldObj = form.addField({
          id: "custpage_db_truckready",
          type: serverWidget.FieldType.SELECT,
          label: "TRUCK READY",
          source: null,
          container: "custpage_fil_gp_db"
        })
        DboardTruckReadyFldObj.addSelectOption({
          value: '',
          text: ''
        });
        DboardTruckReadyFldObj.addSelectOption({
          value: '1',
          text: 'YES'
        });
        DboardTruckReadyFldObj.addSelectOption({
          value: '0',
          text: 'NO'
        });
        var DboardWashedFldObj = form.addField({
          id: "custpage_db_washed",
          type: serverWidget.FieldType.SELECT,
          label: "Washed",
          source: null,
          container: "custpage_fil_gp_db"
        })
        DboardWashedFldObj.addSelectOption({
          value: '',
          text: ''
        });
        DboardWashedFldObj.addSelectOption({
          value: '1',
          text: 'YES'
        });
        DboardWashedFldObj.addSelectOption({
          value: '0',
          text: 'NO'
        });
        var DboardMCOOFldObj = form.addField({
          id: "custpage_db_mcoo",
          type: serverWidget.FieldType.SELECT,
          label: "MC/OO",
          source: "customlist_advs_delivery_board_mcoo",
          container: "custpage_fil_gp_db"
        })


        var DboardSalesQuoteFldObj = form.addField({
          id: "custpage_db_sales_quote",
          type: serverWidget.FieldType.SELECT,
          label: "Sales Quote",
          source: null,
          container: "custpage_fil_gp_db"
        })
        DboardSalesQuoteFldObj.addSelectOption({
          value: '1',
          text: 'YES'
        });
        DboardSalesQuoteFldObj.addSelectOption({
          value: '0',
          text: 'NO'
        });

        var DboardContractFldObj = form.addField({
          id: "custpage_db_contract",
          type: serverWidget.FieldType.SELECT,
          label: "Contract",
          source: "customlist_advs_ss_deli_contract_field",
          container: "custpage_fil_gp_db"
        });
        if (DBContract != "" && DBContract != undefined && DBContract != null) {
          DboardContractFldObj.defaultValue = DBContract
        }

        var _DboardLocationFldObj = form.addField({
          id: "custpage_db_location",
          type: serverWidget.FieldType.SELECT,
          label: "Location",
          source: "location",
          container: "custpage_fil_gp_db"
        });
        if (DBLocation != "" && DBLocation != undefined && DBLocation != null) {
          _DboardLocationFldObj.defaultValue = DBLocation
        }


        ////////////////DELIVERY BOARD FILTERS/////////////////////////////
        var InsurStatusFldObj = form.addField({
          id: "custpage_ins_status",
          type: serverWidget.FieldType.SELECT,
          label: "Insurance Status",
          source: "customrecord_advs_claim_status",
          container: "custpage_fil_gp_ins"
        }).updateDisplayType({
          displayType: "hidden"
        });
        if (ins_sts != "" && ins_sts != undefined && ins_sts != null) {
          InsurStatusFldObj.defaultValue = ins_sts
        }
        var depositFld = form.addField({
          id: "custpage_deposit_filter",
          type: serverWidget.FieldType.SELECT,
          label: "Deposit",
          source: 'customlist_deposit_filter',
          container: "custpage_fil_gp_ins"
        }).updateDisplayType({
          displayType: "hidden"
        });
		//////////////////////TRANSPORT FILTERS///////////////////////
		transportFilters(form,tpttstatus,tptstatus,tptfloc,tpttloc,tptstock);
		//////////////////////TRANSPORT FILTERS///////////////////////

        var fieldsdata = [];


        fieldsdata.push('custpage_brand');
        fieldsdata.push('custpage_vin'); //1
        fieldsdata.push('custpage_vin_ff'); //2
        fieldsdata.push('custpage_model'); //3
        fieldsdata.push('custpage_location'); //4
        fieldsdata.push('custpage_status'); //5
        fieldsdata.push('custpage_salesrep_filter'); //6
        fieldsdata.push('custpage_softhold_status'); //7 
        fieldsdata.push('custpage_mileage'); //8
        fieldsdata.push('custpage_bucket'); //9
        fieldsdata.push('custpage_bucket_child'); //10
        fieldsdata.push('custpage_freq'); //11
        fieldsdata.push('custpage_repo_status'); //12
        fieldsdata.push('custpage_auc_status'); //13
        fieldsdata.push('custpage_ins_status'); //14
        fieldsdata.push('custpage_deposit_filter'); //15
        fieldsdata.push('custpage_brand'); //16
        var displayarr = [];
        // toggleInventoryFilters(form, fieldsdata, JSON.parse(filtersparam))
        var _fieldsdata = dynamicFields();
        toggleInventoryFilters(form, _fieldsdata, JSON.parse(filtersparam))




        var cuobj = record.create({
          type: 'customer',
          isDynamic: !0
        });
        var salesrefp = cuobj.getField('salesrep');
        var entityData = salesrefp.getSelectOptions();
        salesrepfld.addSelectOption({
          value: '',
          text: ''
        })

        for (var i = 0; i < entityData.length; i++) {
          var entityValues = entityData[i];
          salesrepfld.addSelectOption({
            value: entityValues.value,
            text: entityValues.text
          });
        }

        var colorcodingFieldObj = form.addField({
          id: 'custpage_colorcoding_repo',
          type: serverWidget.FieldType.INLINEHTML,
          label: "Color",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });

        var colorcodeInvFieldObj = form.addField({
          id: 'custpage_colorcoding_inv',
          type: serverWidget.FieldType.INLINEHTML,
          label: "Color Inv",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });
        var colorcodeAucFieldObj = form.addField({
          id: 'custpage_colorcoding_auc',
          type: serverWidget.FieldType.INLINEHTML,
          label: "Color Auc",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });
        var colorcodeDelFieldObj = form.addField({
          id: 'custpage_colorcoding_del',
          type: serverWidget.FieldType.INLINEHTML,
          label: "Color Del",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });
        var colorcodeInsFieldObj = form.addField({
          id: 'custpage_colorcoding_ins',
          type: serverWidget.FieldType.INLINEHTML,
          label: "Color Ins",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });

        getAuctionColCodes();
        getInsClaimColCodes();
        getRepoOfrColCodes();
        var CommonStyleRep = '<style> #custpage_colorcoding_repo_val {top: 94px;    position: absolute;    right: 18px;} .colorcodingtable {  border: 1px solid black;  border-collapse: collapse; width:180px;}  .colorcodingtable th{border: 1px solid black;  border-collapse: collapse;} .colorcodingtable td{border: 1px solid black;  border-collapse: collapse;}</style>';

        var CommonStyleInv = '<style> #custpage_colorcoding_inv_val {top: 94px;    position: absolute;    right: 18px;} .colorcodingtable {  border: 1px solid black;  border-collapse: collapse; width:180px;}  .colorcodingtable th{border: 1px solid black;  border-collapse: collapse;} .colorcodingtable td{border: 1px solid black;  border-collapse: collapse;}</style>';
        var CommonStyleAuc = '<style> #custpage_colorcoding_auc_val {top: 94px;    position: absolute;    right: 18px;} .colorcodingtable {  border: 1px solid black;  border-collapse: collapse; width:180px;}  .colorcodingtable th{border: 1px solid black;  border-collapse: collapse;} .colorcodingtable td{border: 1px solid black;  border-collapse: collapse;}</style>';
        var CommonStyleDel = '<style> #custpage_colorcoding_del_val {top: 94px;    position: absolute;    right: 18px;} .colorcodingtable {  border: 1px solid black;  border-collapse: collapse; width:180px;}  .colorcodingtable th{border: 1px solid black;  border-collapse: collapse;} .colorcodingtable td{border: 1px solid black;  border-collapse: collapse;}</style>';
        var CommonStyleIns = '<style> #custpage_colorcoding_ins_val {top: 94px;    position: absolute;    right: 18px;} .colorcodingtable {  border: 1px solid black;  border-collapse: collapse; width:180px;}  .colorcodingtable th{border: 1px solid black;  border-collapse: collapse;} .colorcodingtable td{border: 1px solid black;  border-collapse: collapse;}</style>';

        /*  var htmlcolorRep = '';
         htmlcolorRep +='<table class="colorcodingtable"><tr style="background-color:#e0c9c9;"><th><b>Color</b></th><th><b>Status</b></th></tr>';
         htmlcolorRep +='<tr><td style="background-color:#9de79d;"></td><td><b>Ready</b></td></tr>';
         htmlcolorRep +='<tr><td style="background-color:#7070e7;"></td><td><b>Enroute</b></td></tr>';
         htmlcolorRep +='<tr><td style="background-color:#ecb755;"></td><td><b>Inshop</b></td></tr>';
         htmlcolorRep +='<tr><td style="background-color:#ea3a3a;"></td><td><b>Hold</b></td></tr>';
         htmlcolorRep +='</table>';
         htmlcolorRep+=CommonStyleRep */

        var htmlcolorInv = '';
        htmlcolorInv += '<table class="colorcodingtable"><tr style="background-color:#e0c9c9;"><th><b>Color</b></th><th><b>Status</b></th></tr>';
        htmlcolorInv += '<tr><td style="background-color:#DFF8D8;"></td><td><b>Ready</b></td></tr>';
        htmlcolorInv += '<tr><td style="background-color:#ecb755;"></td><td><b>Inshop</b></td></tr>';
        htmlcolorInv += '<tr><td style="background-color:#DCDCDC;"></td><td><b>On Site</b></td></tr>';
        htmlcolorInv += '<tr><td style="background-color:#D8EBF8;"></td><td><b>Enroute New</b></td></tr>';
        htmlcolorInv += '<tr><td style="background-color:#D8EBF8;"></td><td><b>Enroute</b></td></tr>';
        htmlcolorInv += '<tr><td style="background-color:#F8D8D8;"></td><td><b>Poss Auction</b></td></tr>';
        htmlcolorInv += '<tr><td style="background-color:#F8D8D8;"></td><td><b>Hold</b></td></tr>';
        htmlcolorInv += '</table>';
        htmlcolorInv += CommonStyleInv

        var htmlcolorAuction = '';
        htmlcolorAuction += '<table class="colorcodingtable"><tr style="background-color:#e0c9c9;"><th><b>Color</b></th><th><b>Status</b></th></tr>';
        for (var StatusID in AuctionColorArr) {
          if (AuctionColorArr.hasOwnProperty(StatusID)) {
            var status = AuctionColorArr[StatusID];
            if (status) {
              htmlcolorAuction += '<tr><td style="background-color: ' + status['bgcolor'] + ' ;"></td><td><b>' + status['name'] + '</b></td></tr>';
            }
          }
        }
        htmlcolorAuction += '</table>';
        htmlcolorAuction += CommonStyleAuc

        var htmlcolorInsClaim = '';
        htmlcolorInsClaim += '<table class="colorcodingtable"><tr style="background-color:#e0c9c9;"><th><b>Color</b></th><th><b>Status</b></th></tr>';
        for (var StatusID in InsClaimColorArr) {
          if (InsClaimColorArr.hasOwnProperty(StatusID)) {
            var status = InsClaimColorArr[StatusID];
            if (status) {
              htmlcolorInsClaim += '<tr><td style="background-color: ' + status['bgcolor'] + ' ;"></td><td><b>' + status['name'] + '</b></td></tr>';
            }
          }
        }
        htmlcolorInsClaim += '</table>';
        htmlcolorInsClaim += CommonStyleIns

        var htmlcolorRepo = '';
        htmlcolorRepo += '<table class="colorcodingtable" style="height: 250px !important; overflow-y: scroll;    display: block;"><tr style="background-color:#e0c9c9;"><th><b>Color</b></th><th><b>Status</b></th></tr>';
        for (var StatusID in RepoOfrColorArr) {
          if (RepoOfrColorArr.hasOwnProperty(StatusID)) {
            var status = RepoOfrColorArr[StatusID];
            if (status) {
              htmlcolorRepo += '<tr><td style="background-color: ' + status['bgcolor'] + ' ;"></td><td><b>' + status['name'] + '</b></td></tr>';
            }
          }
        }
        htmlcolorRepo += '</table>';
        htmlcolorRepo += CommonStyleRep

        colorcodingFieldObj.defaultValue = htmlcolorRepo;
        colorcodeInvFieldObj.defaultValue = htmlcolorInv;
        colorcodeAucFieldObj.defaultValue = htmlcolorAuction;
        colorcodeInsFieldObj.defaultValue = htmlcolorInsClaim;

        var InvTbField = form.addField({
          id: "custpage_inv_tb",
          type: serverWidget.FieldType.CHECKBOX,
          label: "Inventory Tb",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });
        var RepTbField = form.addField({
          id: "custpage_rep_tb",
          type: serverWidget.FieldType.CHECKBOX,
          label: "Repossess Tb",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });
        var AucTbField = form.addField({
          id: "custpage_auc_tb",
          type: serverWidget.FieldType.CHECKBOX,
          label: "Auction Tb",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });
        var DelTbField = form.addField({
          id: "custpage_del_tb",
          type: serverWidget.FieldType.CHECKBOX,
          label: "Delivery Tb",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });
        var InsTbField = form.addField({
          id: "custpage_ins_tb",
          type: serverWidget.FieldType.CHECKBOX,
          label: "Insurance Tb",
          container: "custpage_fil_gp"
        }).updateDisplayType({
          displayType: "hidden"
        });

        InvTbField.defaultValue = Inv_tab
        RepTbField.defaultValue = Rep_tab
        AucTbField.defaultValue = Auc_tab
        DelTbField.defaultValue = Del_tab
        InsTbField.defaultValue = Ins_tab

        var vmSearchObj = InventorySearch(brandId, modelId, locatId, salesrepId, depofilterId, bucketId, freqId, bucketChild, vinID,
          _vinText, _statushold, LeaseHeaderId, iFrameCenter, flagpara2, Old_Vin_From_lease, ttlrest, washed, singlebunk, invterms, invapu, invbed, sfcustomer, bodystyle, invtransm, invyear, invcolor, invtruckready, invengine, invsssize, invstock,
          brandFldObj, modelFldObj, locFldObj, salesrepfld, depositFld, bucketFldObj, freqFldObj, vinFldObj, vinfreeformFldObj, LeaseFieldObj,
          IframeCenterFieldObj, Flagpara2FieldObj, OldVinFieldObj, _invstatusFil, color, transmission, salesrep,
          mileage, statusFldObj, colorFldObj, transmissionFldObj, salesrepFldObj, mileageFldObj, bucketChildFldObj,
          statusHoldFldObj, UserSubsidiary, invStockFldObj, invColorFldObj, invYearFldObj, invEngineFldObj, invTransmissionFldObj, invTitleRestFldObj,
          invBodyStyleFldObj, invTruckReadyFldObj, invWashedFldObj, invSingleBunkFldObj, invTermsFldObj,
          invsssizeFldObj, invApuFldObj, invBedsFldObj, invshCustomerFldObj, invStockFldObj,plocFldObj,plocatId)
        var searchObj = vmSearchObj.runPaged({
          pageSize: pageSize,
        });
        // var searchObj = vmSearchObj.runPaged({  pageSize: pageSize, });
        //	_inventoyCount = searchObj.count;
        /* var subTab = form.addSubtab({ id: "custpage_veh_tab", label: "Inventory" }); */ //+searchObj.count 
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
          var addResults = [];
        }
        var _inventoyCount = addResults.length || 0;

        var subTab = form.addSubtab({
          id: "custpage_veh_tab",
          label: "Inventory(" + _inventoyCount + ")"
        });
        var subTab1 = form.addSubtab({
          id: "custpage_repo_tab",
          label: "Reposession"
        });
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
        var subTab6 = form.addSubtab({
          id: "custpage_tpt_tab",
          label: "Transport"
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
        sht = '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>';
        sht += "<script>" +
          "function popupCenter(pageURL, title,w,h) {debugger;" +
          "var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1644&deploy=1&repo='+pageURL;" +
          "var left = (screen.width/2)-(900/2);" +
          "var top = (screen.height/2)-(500/2);" +
          "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
          "}" +

          "function openholdpop(pageURL, title,w,h) {debugger;" +
          "var url = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1655&deploy=1&repo='+pageURL;" +
          "var left = (screen.width/2)-(500/2);" +
          "var top = (screen.height/2)-(300/2);" +
          "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
          "}" +

          "function changeStatus(vinid,Status) {debugger;" +
          "var left = (screen.width/2)-(300/2);" +
          "var top = (screen.height/2);" +
          "var url='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1712&deploy=1&vinid='+vinid+'&status'+Status;" +
          "var targetWin = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,top=300,left=400,width=480,height=210');" +
          "}" +

          "function updateMileage(vinid) {debugger;" +
          "var left = (screen.width/2)-(300/2);" +
          "var top = (screen.height/2);" +
          "var url='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2594&deploy=1&vinid='+vinid;" +
          "var targetWin = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,top=300,left=400,width=480,height=210');" +
          "}" +

          "function openterminationpop(pageURL, title,w,h) {debugger;" +
          "var url = '/app/site/hosting/scriptlet.nl?script=1656&deploy=1&repo='+pageURL;" +
          "var left = (screen.width/2)-(900/2);" +
          "var top = (screen.height/2)-(500/2);" +
          "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
          "}" +
          "function openauction(pageURL, title,w,h) {debugger;" +
          "var url = '/app/site/hosting/scriptlet.nl?script=1658&deploy=1&repo='+pageURL;" +
          "var left = (screen.width/2)-(900/2);" +
          "var top = (screen.height/2)-(500/2);" +
          "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
          "}" +
          "function depositcreation_notusing(pageURL, depinception,Paymentincept,title,w,h,) {debugger;" +
          "var url = '/app/site/hosting/scriptlet.nl?script=1649&deploy=1&vinid='+pageURL+'&depinception='+depinception+'&Paymentincept='+Paymentincept;" +
          "var left = (screen.width/2)-(900/2);" +
          "var top = (screen.height/2)-(500/2);" +
          "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
          "}" +

          "function depositcreation(customer,vin, depinception,Paymentincept,title,w,h,) {debugger;" +
          "var url = 'https://8760954.app.netsuite.com/app/accounting/transactions/custdep.nl?whence=&entity='+customer+'&custbody_advs_vin_create_deposit='+vin;" +
          "var left = (screen.width/2)-(900/2);" +
          "var top = (screen.height/2)-(500/2);" +
          "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
          "}" +

          "function softholdupdate(pageURL,depinception,Paymentincept,TTLINSP,TERMS,sec_2_13,sec_14_26,sec_26_37,sec_38_49,purOptn,contTot,bktId ) {debugger;" +
          "var url = '/app/site/hosting/scriptlet.nl?script=customscript_softhold_inventory&deploy=1&vinid='+pageURL+'&depinception='+depinception+'&Paymentincept='+Paymentincept+'&TTLINSP='+TTLINSP+'&TERMS='+TERMS+'&sec_2_13='+sec_2_13+'&sec_14_26='+sec_14_26+'&sec_26_37='+sec_26_37+'&sec_38_49='+sec_38_49+'&purOptn='+purOptn+'&contTot='+contTot+'&bktId='+bktId;" +
          "var left = (screen.width/2)-(900/2);" +
          "var top = (screen.height/2)-(500/2);" +
          "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
          "}" +
          "function editclaimsheet(id) {debugger;" +
          "var left = (screen.width/2)-(500/2);" +
          "var top = (screen.height/2)-(500/2);" +
          "var url='/app/site/hosting/scriptlet.nl?script=1648&deploy=1&claim='+id;" +
          "var targetWin = window.open (url, width=500, height=500);" +
          "}" +
          "function edittransportsheet(id) {debugger;" +
          "var left = (screen.width/2)-(500/2);" +
          "var top = (screen.height/2)-(500/2);" +
          "var url='/app/site/hosting/scriptlet.nl?script=2615&deploy=1&transport='+id;" +
          "var targetWin = window.open (url, width=500, height=500);" +
          "}" +
          "function opendeliveryboard(depid, title,w,h) {debugger;" +
          "var url = '/app/site/hosting/scriptlet.nl?script=1713&deploy=1&custparam_id='+depid;" +
          "var left = (screen.width/2)-(900/2);" +
          "var top = (screen.height/2)-(500/2);" +
          "var targetWin = window.open (url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=500');" +
          "}" +
          "$(document).ready(function(){" +
          "  $('.openaccordian').click(function(){debugger;" +
          " var myString =  jQuery(this).parent('td').parent('tr').attr('id');" +

          "var lastChar = myString.replace('custpage_sublistrow','');" +
          "for(var i=0;i<1;i++){" +
          "lastChar =  ((lastChar*1)+1);" +
          "	var id='#custpage_sublistrow'+(lastChar);" +
          "	jQuery(id).toggle();" +
          "var id1 = id+' .openaccordian';" +
          "	jQuery(id1).hide()" +
          "}" +
          "  });" +
          "});" +

          "</script>";
        // sht+='<style>.uir-machine-headerrow, .uir-list-headerrow{white-space: nowrap !important;}</style>';
        //sht+='<script src="https://8760954.app.netsuite.com/core/media/media.nl?id=29052&c=8760954&h=ayzSPaogTGWy-dXa5xFTbLJGgV-IBR97B9xH3BIuO5iJ4Wde&_xt=.js"></script>';
        html_fld.defaultValue = sht;

        var sublist = form.addSublist({
          id: "custpage_sublist",
          type: serverWidget.SublistType.LIST,
          label: "List",
          tab: "custpage_veh_tab"
        });

        sublist.addField({
          id: "cust_list_open_accordian",
          type: serverWidget.FieldType.TEXT,
          label: "Open"
        }).updateDisplayType({
          displayType: "inline"
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
          label: "Customer Deposit"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "cust_list_soft_hold",
          type: serverWidget.FieldType.TEXT,
          label: "Soft Hold"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_changestatus",
          type: serverWidget.FieldType.TEXT,
          label: "Change Status"
        }).updateDisplayType({
          displayType: "inline"
        });
        // sublist.addField({ id: "custpabe_m_mileage_edit", type: serverWidget.FieldType.TEXT, label: "Mileage" }).updateDisplayType({ displayType: "inline" });
        sublist.addField({
          id: "cust_select_checkbox_highlight",
          type: serverWidget.FieldType.CHECKBOX,
          label: "Mark"
        }).updateDisplayType({
          displayType: "hidden"
        });
        sublist.addField({
          id: "custpabe_m_stock",
          type: serverWidget.FieldType.TEXT,
          label: "Stock #"
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
          id: "custpabe_m_softhold_status",
          type: serverWidget.FieldType.SELECT,
          label: "Soft Hold Status",
          source: "customlist_advs_reservation_hold"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_color",
          type: serverWidget.FieldType.TEXT,
          label: "Color",
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_yr",
          type: serverWidget.FieldType.SELECT,
          label: "Year",
          source: "customrecord_advs_model_year"
        }).updateDisplayType({
          displayType: "inline"
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
          id: "custpabe_m_engine",
          type: serverWidget.FieldType.TEXT,
          label: "Engine"
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
          id: "custpabe_m_mileage",
          type: serverWidget.FieldType.TEXT,
          label: "Mileage"
        }).updateDisplayType({
          displayType: "inline"
        });

        sublist.addField({
          id: "custpabe_loc",
          type: serverWidget.FieldType.SELECT,
          label: "Location",
          source: "location"
        }).updateDisplayType({
          displayType: "hidden"
        });

        sublist.addField({
          id: "custpabe_phyloc",
          type: serverWidget.FieldType.SELECT,
          label: "Physical Location",
          source: "customlistadvs_list_physicallocation"
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
          id: "custpabe_m_titlerestriction2",
          type: serverWidget.FieldType.TEXT,
          label: "Title Restiction 2"
        }).updateDisplayType({
          displayType: "hidden"
        });
        sublist.addField({
          id: "custpabe_m_body_style",
          type: serverWidget.FieldType.SELECT,
          label: "Body style",
          source: "customlist_advs_body_style"
        }).updateDisplayType({
          displayType: "inline"
        }); //new
        sublist.addField({
          id: "custpabe_m_is_truck_ready",
          type: serverWidget.FieldType.TEXT,
          label: "Truck Ready"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_is_washed",
          type: serverWidget.FieldType.TEXT,
          label: "Washed"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_single_bunk",
          type: serverWidget.FieldType.SELECT,
          label: "Single Bunk",
          source: "customlist_advs_single_bunk"
        }).updateDisplayType({
          displayType: "inline"
        }); //new
        sublist.addField({
          id: "custpabe_m_bkt_ttl_incep",
          type: serverWidget.FieldType.TEXT,
          label: "Total Inception"
        });
        sublist.addField({
          id: "custpabe_m_bkt_dep_incep",
          type: serverWidget.FieldType.TEXT,
          label: "Deposit Inception"
        });
        sublist.addField({
          id: "custpabe_m_bkt_pay_incep",
          type: serverWidget.FieldType.TEXT,
          label: "Payment Inception"
        });
        sublist.addField({
          id: "custpabe_m_bkt_terms",
          type: serverWidget.FieldType.INTEGER,
          label: "Terms"
        });
        sublist.addField({
          id: "custpabe_m_notes",
          type: serverWidget.FieldType.TEXTAREA,
          label: "Notes"
        }); //new
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
          id: "custpabe_transport",
          type: serverWidget.FieldType.TEXT,
          label: "Transport"
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
          id: "custpabe_inspected",
          type: serverWidget.FieldType.TEXT,
          label: "Inspected"
        }).updateDisplayType({
          displayType: "inline"
        }); //new
        sublist.addField({
          id: "custpabe_appr_rep_date",
          type: serverWidget.FieldType.DATE,
          label: "Approved Repairs Date"
        }).updateDisplayType({
          displayType: "inline"
        }); //new
        sublist.addField({
          id: "custpabe_eta_ready",
          type: serverWidget.FieldType.DATE,
          label: "ETA Ready"
        }).updateDisplayType({
          displayType: "inline"
        }); //new
        sublist.addField({
          id: "custpabe_pictures",
          type: serverWidget.FieldType.IMAGE,
          label: "Pictures"
        }); //new
        sublist.addField({
          id: "custpabe_m_customer",
          type: serverWidget.FieldType.SELECT,
          label: "Customer",
          source: "customer"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_softhold_customer",
          type: serverWidget.FieldType.SELECT,
          label: "Soft Hold Customer",
          source: "customer"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_softhold_days",
          type: serverWidget.FieldType.FLOAT,
          label: "Soft Hold - Age In Days",
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
          id: "custpabe_m_admin_notes",
          type: serverWidget.FieldType.TEXTAREA,
          label: "Admin Notes"
        }); //new
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
          label: "Aging Date Truck Ready"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_m_donsite_aging",
          type: serverWidget.FieldType.INTEGER,
          label: "Aging Date On Site"
        }).updateDisplayType({
          displayType: "inline"
        });
        sublist.addField({
          id: "custpabe_aging_contract",
          type: serverWidget.FieldType.DATE,
          label: "Aging Contract"
        }).updateDisplayType({
          displayType: "inline"
        }); //new
        sublist.addField({
          id: "custpabe_m_bkt_ttl_incep_2",
          type: serverWidget.FieldType.TEXT,
          label: "Total Inception"
        }); // new
        sublist.addField({
          id: "custpabe_m_bkt_dep",
          type: serverWidget.FieldType.TEXT,
          label: "Deposit"
        }); //new
        sublist.addField({
          id: "custpabe_m_bkt_pay",
          type: serverWidget.FieldType.TEXT,
          label: "Payment"
        }); //new
        sublist.addField({
          id: "custpabe_m_bkt_terms_2",
          type: serverWidget.FieldType.INTEGER,
          label: "Terms"
        }); //new
        sublist.addField({
          id: "custpabe_m_bkt_pay_13",
          type: serverWidget.FieldType.TEXT,
          label: "Payments 2-13"
        });
        sublist.addField({
          id: "custpabe_m_bkt_pay_25",
          type: serverWidget.FieldType.TEXT,
          label: "Payments 14-25"
        });
        sublist.addField({
          id: "custpabe_m_bkt_pay_37",
          type: serverWidget.FieldType.TEXT,
          label: "Payments 26-37"
        });
        sublist.addField({
          id: "custpabe_m_bkt_pay_49",
          type: serverWidget.FieldType.TEXT,
          label: "Payments 26-37"
        });
        sublist.addField({
          id: "custpabe_m_bkt_pur_opt",
          type: serverWidget.FieldType.TEXT,
          label: "Purchase Option"
        });
        sublist.addField({
          id: "custpabe_m_bkt_cont_tot",
          type: serverWidget.FieldType.TEXT,
          label: "Contract Total"
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
          id: "custpabe_m_bkt_id",
          type: serverWidget.FieldType.SELECT,
          label: "Bucket",
          source: "customrecord_ez_bucket_calculation"
        }).updateDisplayType({
          displayType: "inline"
        });
        // sublist.addField({ id: "custpabe_make", type: serverWidget.FieldType.SELECT, label: "Make", source: "customrecord_advs_brands"  }).updateDisplayType({ displayType: "inline" });
        sublist.addField({
          id: "custpabe_m_bkt_freq",
          type: serverWidget.FieldType.SELECT,
          label: "Frequency",
          source: "customrecord_advs_st_frequency"
        }).updateDisplayType({
          displayType: "hidden"
        });
        sublist.addField({
          id: "custpabe_m_bkt_ch_id",
          type: serverWidget.FieldType.SELECT,
          label: "Bucket Child",
          source: "customrecord_bucket_calculation_location"
        }).updateDisplayType({
          displayType: "hidden"
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
          var sublistrepo = createReposessionSublist(form, repo_sts);
          //CREATE FEILDS FOR AUCTION SUBLIST
          var auctionsublist = createAuctionSublist(form);
          addDatatoAuction(auctionsublist, auc_condition, auc_date, auc_cleaned,
            auc_loc, auc_vin, vinID, locatId, _vinText, auc_sts, auc_ttlsent, auc_ttlrest,
            AuctionCondtionFldObj, AuctionDateFldObj, AuctionStatusFldObj, AuctionCleanedFldObj,
            AuctionLocationFldObj, AuctionVinFldObj, AuctionTtleSentFldObj, AuctionttlRestrFldObj);
          //CREATE FEILDS FOR INVENTORY DEPOSIT DELIVERY
          var deliverysublist = createdeliverysublist(form, vinID, locatId, _vinText, DboardVinFldObj, DboardCustomerFldObj,
            DboardSalesrepFldObj, DboardTruckReadyFldObj, DboardWashedFldObj, DboardMCOOFldObj,
            DBVin, DBCustomer, DBSalesRep, DBTruckReady, DBWashed, DBmc00, DBClaim, DBStock,
            DBUnitCondition, DBContract, DBLocation, DboardClaimFldObj, DboardStockFldObj,
            DboardUnitConditionFldObj, DboardContractFldObj, _DboardLocationFldObj);
          var summarydb = createsummarydashbaord(form);
          var insclaimsublist = createInsClaimSublist(form);
          searchForclaimData(insclaimsublist, vinID, _vinText, ins_sts);
          var transportDboardFields = transportFields();
          var TransportsublistObj = renderFields(transportDboardFields, 'custpage_fil_gp_tpt', form);
		  var transportNotes = getTransportNotesData();
          var transportdata = getTransportLines(tpttstatus,tptstatus,tptfloc,tpttloc,tptstock);
          setTransportSublistData(transportdata, TransportsublistObj, transportDboardFields,transportNotes)
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

        var urlResStatus = url.resolveScript({
          scriptId: 'customscript_advs_ss_manager_dashboard_c',
          deploymentId: 'customdeploy_advs_ss_manager_dashboard_c',
          returnExternalUrl: false
        });

        var lineNum = 0;

        for (var m = 0; m < addResults.length; m++) {
          if (addResults[m] != null && addResults[m] != undefined) {

            var vinid = addResults[m].id;
            var vinName = addResults[m].vinName;
            //log.debug('vinName',vinName);
            var model = addResults[m].modelid;
            var brand = addResults[m].brand;
            var locid = addResults[m].locid;
            var phylocId = addResults[m].phylocId;
            var modelyr = addResults[m].modelyr;
            var bucketId = addResults[m].bucketId;
            var stockdt = addResults[m].stockdt;
            var Statusdt = addResults[m].Statusdt;
            var Mileagedt = addResults[m].Mileagedt || 0;
            var Transdt = addResults[m].Transdt;
            var Enginedt = addResults[m].Enginedt;
            var Customerdt = addResults[m].Customerdt;
            var softHoldCustomerdt = addResults[m].softHoldCustomerdt;
            var softHoldCus_sales_rep = addResults[m].softHoldCus_sales_rep
            var salesrepdt = addResults[m].salesrepdt;
            var softHoldstatusdt = addResults[m].softHoldstatusdt;
            var softholdageindays = addResults[m].softholdageindays;
            var extclrdt = addResults[m].extclrdt;
            var DateTruckRdydt = addResults[m].DateTruckRdydt;
            var DateTruckLockupdt = addResults[m].DateTruckLockupdt;
            var DateTruckAgingdt = addResults[m].DateTruckAgingdt;
            var DateOnsitedt = addResults[m].DateOnsitedt;
            var invdepositLink = addResults[m].invdepositLink;
            var InvSales = addResults[m].InvSales;
            var deliveryBoardBalance = addResults[m].deliveryBoardBalance;
            var deliveryboard = addResults[m].deliveryboard;
            var sleepersize = addResults[m].sleepersize;
            var apu = addResults[m].apu;
            var beds = addResults[m].beds;
            var titlerestriction = addResults[m].titlerestriction;
            var iswashed = addResults[m].iswashed;
            var istruckready = addResults[m].istruckready;

            var singlebunk = addResults[m].singlebunk;
            var Transport = addResults[m].Transport;
            var Inspected = addResults[m].Inspected;
            var Picture1 = addResults[m].Picture1;
            var ApprRepDate = addResults[m].ApprRepDate;
            var admin_notes = addResults[m].admin_notes;
            var body_style = addResults[m].body_style;
            var eta_ready = addResults[m].eta_ready;
            var notesms = addResults[m].notesms;
            var aging_contr = addResults[m].aging_contr;
            var bucketchildsIds = addResults[m].bucketchildsIds;
            var bucketchilds = addResults[m].bucketchilds;
            var incepdiscount = addResults[m].incepdiscount;
            var isOldVehicle = addResults[m].isOldVehicle;
            var isDiscounttoApply = addResults[m].isDiscounttoApply;
            //SOFTHOLD VALUES
            var sh_depo_inception = addResults[m].sh_depo_inception;
            var sh_payment_inc = addResults[m].sh_payment_inc;
            var sh_total_inc = addResults[m].sh_total_inc;
            var sh_terms = addResults[m].sh_terms;
            var sh_payterm1 = addResults[m].sh_payterm1;
            var sh_payterm2 = addResults[m].sh_payterm2;
            var sh_payterm3 = addResults[m].sh_payterm3;
            var sh_payterm4 = addResults[m].sh_payterm4;
            var sh_purchase_option = addResults[m].sh_purchase_option;
            var sh_contract_total = addResults[m].sh_contract_total;
            var sh_reg_fee = addResults[m].sh_reg_fee;
            var sh_grandtotal = addResults[m].sh_grandtotal;

            var sh_depo_inception1 = addResults[m].sh_depo_inception1;
            var sh_payment_inc1 = addResults[m].sh_payment_inc1;
            var sh_total_inc1 = addResults[m].sh_total_inc1;
            var sh_terms1 = addResults[m].sh_terms1;
            var sh_payterm1_1 = addResults[m].sh_payterm1_1;
            var sh_payterm2_1 = addResults[m].sh_payterm2_1;
            var sh_payterm3_1 = addResults[m].sh_payterm3_1;
            var sh_payterm4_1 = addResults[m].sh_payterm4_1;
            var sh_purchase_option1 = addResults[m].sh_purchase_option1;
            var sh_contract_total1 = addResults[m].sh_contract_total1;
            var sh_reg_fee1 = addResults[m].sh_reg_fee1;
            var sh_grandtotal_1 = addResults[m].sh_grandtotal_1;
            var sh_bucket1 = addResults[m].sh_bucket1;
            var sh_bucket2 = addResults[m].sh_bucket2;



            if (bucketchilds && bucketchilds.length > 1) {
              var _bucketchilds = bucketchilds.split(',');
            } else {
              var _bucketchilds = []
            }

            var lengthBuck = 0;
            for (var jk = 0; jk < _bucketchilds.length; jk++) {
              if (bucketData[_bucketchilds[jk]] != null && bucketData[_bucketchilds[jk]] != undefined) {
                var lengthBuck = bucketData[_bucketchilds[jk]].length;
              }
            }

            //log.debug('incepdiscount',incepdiscount);
            /* log.debug('bucketchilds',bucketchilds);
            log.debug('_bucketchilds.len',_bucketchilds.length); */

            if (_bucketchilds.length > 0) {
              var mileagepopup = '<a href="#" onclick=updateMileage(' + vinid + ')><i class="fa fa-edit" style="color:blue;"</i> </a>';
              var mileagepopupfordata = '<a href="#" onclick=updateMileage(' + vinid + ')>' + Mileagedt + ' </a>';
              for (var k = 0; k < _bucketchilds.length; k++) {
                //log.debug('bucketData[_bucketchilds[k]][0]',bucketData[_bucketchilds[k]][0]);
                var bucketchildsdata = bucketData[_bucketchilds[k]][0];
                // log.debug('bucketchildsdata["DEPINSP"]',bucketchildsdata["DEPINSP"])
                var bktId = bucketchildsdata["id"];
                var DEPINSP = bucketchildsdata["DEPINSP"] * 1;

                var PAYINSP = bucketchildsdata["PAYINSP"] * 1;
                var TTLINSP = bucketchildsdata["TTLINSP"] * 1;
                var TERMS = bucketchildsdata["TRMS"] * 1;
                var sec_2_13 = bucketchildsdata["2_13"] * 1;
                var sec_14_26 = bucketchildsdata["14_26"] * 1;
                var sec_26_37 = bucketchildsdata["26_37"] * 1;
                var sec_38_49 = bucketchildsdata["38_49"] * 1;
                var purOptn = bucketchildsdata["purOptn"] * 1;
                var contTot = bucketchildsdata["conttot"] * 1;
                var freq = bucketchildsdata["freq"];
                var saleCh = bucketchildsdata["saleCh"];




                if (true) {
                  DEPINSP = DEPINSP - incepdiscount;
                  TTLINSP = TTLINSP - incepdiscount;
                  purOptn = purOptn - incepdiscount;
                  contTot = contTot - incepdiscount;
                }

                if (softHoldstatusdt != '' && (bktId == sh_bucket1)) {

                  DEPINSP = sh_depo_inception;
                  PAYINSP = sh_payment_inc;
                  TTLINSP = sh_total_inc;
                  TERMS = sh_terms;
                  sec_2_13 = sh_payterm1;
                  sec_14_26 = sh_payterm2;
                  sec_26_37 = sh_payterm3;
                  sec_38_49 = sh_payterm4;
                  purOptn = sh_purchase_option;
                  contTot = sh_contract_total;


                }
                if (softHoldstatusdt != '' && (bktId == sh_bucket2)) {

                  DEPINSP = sh_depo_inception1;
                  PAYINSP = sh_payment_inc1;
                  TTLINSP = sh_total_inc1;
                  TERMS = sh_terms1;
                  sec_2_13 = sh_payterm1_1;
                  sec_14_26 = sh_payterm2_1;
                  sec_26_37 = sh_payterm3_1;
                  sec_38_49 = sh_payterm4_1;
                  purOptn = sh_purchase_option1;
                  contTot = sh_contract_total1;


                }
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

                sublist.setSublistValue({
                  id: "custpabe_loc",
                  line: lineNum,
                  value: locid
                });
                if (phylocId) {
                  sublist.setSublistValue({
                    id: "custpabe_phyloc",
                    line: lineNum,
                    value: phylocId
                  });
                }

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
                if (Mileagedt == 0) {
                  sublist.setSublistValue({
                    id: "custpabe_m_mileage",
                    line: lineNum,
                    value: mileagepopup
                  });
                } else {
                  sublist.setSublistValue({
                    id: "custpabe_m_mileage",
                    line: lineNum,
                    value: mileagepopupfordata
                  });
                }
                sublist.setSublistValue({
                  id: "custpabe_m_customer",
                  line: lineNum,
                  value: Customerdt
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
                if (softHoldCustomerdt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_softhold_customer",
                    line: lineNum,
                    value: softHoldCustomerdt
                  });
                }
                if (singlebunk) {
                  sublist.setSublistValue({
                    id: "custpabe_m_single_bunk",
                    line: lineNum,
                    value: singlebunk
                  });
                }
                if (Transport) {
                  sublist.setSublistValue({
                    id: "custpabe_transport",
                    line: lineNum,
                    value: Transport
                  });
                }
                if (Inspected) {
                  sublist.setSublistValue({
                    id: "custpabe_inspected",
                    line: lineNum,
                    value: Inspected
                  });
                }
                if (Picture1) {
                  sublist.setSublistValue({
                    id: "custpabe_pictures",
                    line: lineNum,
                    value: Picture1
                  });
                }
                if (ApprRepDate) {
                  sublist.setSublistValue({
                    id: "custpabe_appr_rep_date",
                    line: lineNum,
                    value: ApprRepDate
                  });
                }
                if (admin_notes) {
                  sublist.setSublistValue({
                    id: "custpabe_m_admin_notes",
                    line: lineNum,
                    value: admin_notes
                  });
                }
                if (body_style) {
                  sublist.setSublistValue({
                    id: "custpabe_m_body_style",
                    line: lineNum,
                    value: body_style
                  });
                }
                if (eta_ready) {
                  sublist.setSublistValue({
                    id: "custpabe_eta_ready",
                    line: lineNum,
                    value: eta_ready
                  });
                }
                if (notesms) {
                  sublist.setSublistValue({
                    id: "custpabe_m_notes",
                    line: lineNum,
                    value: notesms
                  });
                }
                if (aging_contr) {
                  sublist.setSublistValue({
                    id: "custpabe_aging_contract",
                    line: lineNum,
                    value: aging_contr
                  });
                }
                if (TTLINSP) {
                  sublist.setSublistValue({
                    id: "custpabe_m_bkt_ttl_incep_2",
                    line: lineNum,
                    value: "$" + addCommasnew(parseFloat(TTLINSP).toFixed(2))
                  });
                }
                if (DEPINSP) {
                  sublist.setSublistValue({
                    id: "custpabe_m_bkt_dep",
                    line: lineNum,
                    value: "$" + addCommasnew(parseFloat(DEPINSP).toFixed(2))
                  });
                }
                if (PAYINSP) {
                  sublist.setSublistValue({
                    id: "custpabe_m_bkt_pay",
                    line: lineNum,
                    value: "$" + addCommasnew(parseFloat(PAYINSP).toFixed(2))
                  });
                }
                if (TERMS) {
                  sublist.setSublistValue({
                    id: "custpabe_m_bkt_terms_2",
                    line: lineNum,
                    value: TERMS
                  });
                }
                if (softholdageindays) {
                  sublist.setSublistValue({
                    id: "custpabe_m_softhold_days",
                    line: lineNum,
                    value: softholdageindays
                  });
                }
                if (softHoldstatusdt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_softhold_status",
                    line: lineNum,
                    value: softHoldstatusdt
                  });
                }
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
                }
                if (apu) {
                  sublist.setSublistValue({
                    id: "custpabe_m_apu",
                    line: lineNum,
                    value: apu
                  });
                }
                if (beds) {
                  sublist.setSublistValue({
                    id: "custpabe_m_beds",
                    line: lineNum,
                    value: beds
                  });
                }
                if (titlerestriction) {
                  sublist.setSublistValue({
                    id: "custpabe_m_titlerestriction2",
                    line: lineNum,
                    value: titlerestriction
                  });
                }
                var titlerestrictionVal = "";
                if (titlerestriction == "Yes") {
                  titlerestrictionVal = '<a href="#" title="You can only lease to lessees with a valid drivers license in these states:  Arkansas, Florida, Georgia, Illinois, Indiana, Iowa, Kansas, Minnesota, Mississippi, Missouri, Michigan, Nebraska, New York, North Carolina, Ohio, Tennessee, Texas, Wisconsin.">YES</a>';
                } else if (titlerestriction == "No") {
                  titlerestrictionVal = 'No';
                }
                if (titlerestrictionVal != '') {
                  sublist.setSublistValue({
                    id: "custpabe_m_titlerestriction",
                    line: lineNum,
                    value: titlerestrictionVal
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
                if (istruckready) {
                  istruckready = istruckready ? "Yes" : "No";
                  sublist.setSublistValue({
                    id: "custpabe_m_is_truck_ready",
                    line: lineNum,
                    value: istruckready
                  });
                }
                if (iswashed) {
                  iswashed = iswashed ? "Yes" : "No";
                  sublist.setSublistValue({
                    id: "custpabe_m_is_washed",
                    line: lineNum,
                    value: iswashed
                  });
                }
                // if (DateTruckAgingdt) {  // removed by abdul
                if (DateTruckRdydt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_aging",
                    line: lineNum,
                    value: calculateDays(DateTruckRdydt, new Date())
                  });
                }
                if (DateOnsitedt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_donsite",
                    line: lineNum,
                    value: DateOnsitedt
                  });
                }
                if (DateOnsitedt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_donsite_aging",
                    line: lineNum,
                    value: calculateDays(DateOnsitedt, new Date())
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
                  value: "$" + addCommasnew(parseFloat(DEPINSP).toFixed(2))
                });
                sublist.setSublistValue({
                  id: "custpabe_m_bkt_pay_incep",
                  line: lineNum,
                  value: "$" + addCommasnew(parseFloat(PAYINSP).toFixed(2))
                });
                sublist.setSublistValue({
                  id: "custpabe_m_bkt_ttl_incep",
                  line: lineNum,
                  value: "$" + addCommasnew(parseFloat(TTLINSP).toFixed(2))
                });
                if (TERMS) {
                  sublist.setSublistValue({
                    id: "custpabe_m_bkt_terms",
                    line: lineNum,
                    value: TERMS
                  });
                }
                if (sec_2_13) {
                  sublist.setSublistValue({
                    id: "custpabe_m_bkt_pay_13",
                    line: lineNum,
                    value: "$" + addCommasnew(parseFloat(sec_2_13).toFixed(2))
                  });
                }
                if (sec_14_26) {
                  sublist.setSublistValue({
                    id: "custpabe_m_bkt_pay_25",
                    line: lineNum,
                    value: "$" + addCommasnew(parseFloat(sec_14_26).toFixed(2))
                  });
                }
                if (sec_26_37) {
                  sublist.setSublistValue({
                    id: "custpabe_m_bkt_pay_37",
                    line: lineNum,
                    value: "$" + addCommasnew(parseFloat(sec_26_37).toFixed(2))
                  });
                }
                if (sec_38_49) {
                  sublist.setSublistValue({
                    id: "custpabe_m_bkt_pay_49",
                    line: lineNum,
                    value: "$" + addCommasnew(parseFloat(sec_38_49).toFixed(2))
                  });
                }
                if (purOptn) {
                  sublist.setSublistValue({
                    id: "custpabe_m_bkt_pur_opt",
                    line: lineNum,
                    value: "$" + addCommasnew(parseFloat(purOptn).toFixed(2))
                  });
                }
                if (contTot) {
                  sublist.setSublistValue({
                    id: "custpabe_m_bkt_cont_tot",
                    line: lineNum,
                    value: "$" + addCommasnew(parseFloat(contTot).toFixed(2))
                  });
                }



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
                sublist.setSublistValue({
                  id: 'cust_list_open_accordian',
                  line: lineNum,
                  value: '<a href= "#" class="openaccordian" ><i class="fa fa-angle-down" style="font-size:36px;color:red"></i></a>'
                });
                if (!flagpara2) {
                  //if(Statusdt!=15){ //if softhold will not display icon
                  /* sublist.setSublistValue({ id: 'cust_list_veh_card', line: lineNum, value: '<a href="' + urlRes + "&param_vin=" + vinid + "&param_buckt=" + bktId + "" + '" target="_blank"><img class=\"i_dashboard_gray\"  src=\"/uirefresh/img/dashboard.png"   width=\"25px\" height=\"20px\"/></a>' }); */
                  var Soft_hold_customer = "";
                  if (softHoldCustomerdt) {
                    Soft_hold_customer = softHoldCustomerdt
                  }
                  // var VehicleCardValURL = '<a href="' + urlRes + "&param_vin=" + vinid + "&param_buckt=" + bktId + "" + '" target="_blank"><img class=\"i_dashboard_gray\"  src=\"/uirefresh/img/dashboard.png"   width=\"25px\" height=\"20px\"/></a>'
                  var VehicleCardValURL = '<a href="' + urlRes + "&param_vin=" + vinid + "&param_buckt=" + bktId + "&custparam_soft_hold_cus=" + Soft_hold_customer + "&custpara_sof_hold_salesrep=" + softHoldCus_sales_rep + '" target="_blank"><img class=\"i_dashboard_gray\"  src=\"/uirefresh/img/dashboard.png"   width=\"25px\" height=\"20px\"/></a>';
                  sublist.setSublistValue({
                    id: 'cust_list_veh_card',
                    line: lineNum,
                    value: VehicleCardValURL
                  });
                  // var ChangeStatusValURL =  '<a href="' + urlResStatus + "&param_vin=" + vinid + "&param_buckt=" + bktId + "" + '" target="_parent"><img class=\"i_dashboard_gray\"  src=\"/uirefresh/img/dashboard.png"   width=\"25px\" height=\"20px\"/></a>'
                  var ChangeStatusValURL = '<a href="#" onclick=changeStatus(' + vinid + ')><i class="fa fa-edit" style="color:blue;"</i> </a>';
                  sublist.setSublistValue({
                    id: 'custpabe_m_changestatus',
                    line: lineNum,
                    value: ChangeStatusValURL
                  });

                }
                //if(Soft_hold_customer){search.lookupFields({type:'customer',id:Soft_hold_customer,columns:['salesrep','location','department']});}
                if (!invdepositLink) { //
                  if (Statusdt != 15) { //if softhold will not display icon
                    var DepositCreationV = '<a href= "#" onclick=depositcreation(' + Soft_hold_customer + ',' + vinid + ',' + DEPINSP + ',' + PAYINSP + ')><i class="fa fa-bank" style="color:blue;"></i></a>';
                    sublist.setSublistValue({
                      id: 'cust_list_veh_delivey',
                      line: lineNum,
                      value: DepositCreationV
                    });
                  }
                } else if ((invdepositLink && deliveryBoardBalance > 0) || (Statusdt != "13")) {
                  var DepositCreation = '<a href= "#" onclick=depositcreation(' + Soft_hold_customer + ',' + vinid + ',' + DEPINSP + ',' + PAYINSP + ')><i class="fa fa-bank" style="color:blue;"></i></a>';
                  sublist.setSublistValue({
                    id: 'cust_list_veh_delivey',
                    line: lineNum,
                    value: DepositCreation
                  });
                }
                if (true) { //!invdepositLink SURYA IS REMOVING
                  sublist.setSublistValue({
                    id: 'cust_list_soft_hold',
                    line: lineNum,
                    value: '<a href= "#" onclick=softholdupdate(' + vinid + ',' + DEPINSP + ',' + PAYINSP + ',' + TTLINSP + ',' + TERMS + ',' + (sec_2_13 || 0) + ',' + (sec_14_26 || 0) + ',' + (sec_26_37 || 0) + ',' + (sec_38_49 || 0) + ',' + purOptn + ',' + contTot + ',' + bktId + ')><i class="fa fa-edit" style="color:blue;"></i></a>'
                  });

                }
                if (deliveryboard == true) {
                  sublist.setSublistValue({
                    id: 'cust_select_checkbox_highlight',
                    line: lineNum,
                    value: 'T'
                  });
                }

                lineNum++;
              }
            } else {
              var mileagepopup = '<a href="#" onclick=updateMileage(' + vinid + ')><i class="fa fa-edit" style="color:blue;"</i> </a>';
              var mileagepopupfordata = '<a href="#" onclick=updateMileage(' + vinid + ')>' + Mileagedt + ' </a>';
              for (var jk = 0; jk < 2; jk++) {

                //SETTING DATA FOR BUCKETS NOT ASSIGNED
                if (vinid) {
                  sublist.setSublistValue({
                    id: "custpabe_vinid",
                    line: lineNum,
                    value: vinid
                  });
                }


                var urllink = 'https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=129&id=' + vinid;

                sublist.setSublistValue({
                  id: "custpabe_vinid_link",
                  line: lineNum,
                  value: '<a href="' + urllink + '">' + vinName + '</a>'
                });
                var ChangeStatusValURL = '<a href="#" onclick=changeStatus(' + vinid + ')><i class="fa fa-edit" style="color:blue;"</i> </a>';
                sublist.setSublistValue({
                  id: 'custpabe_m_changestatus',
                  line: lineNum,
                  value: ChangeStatusValURL
                });
                if (model) {
                  sublist.setSublistValue({
                    id: "custpabe_model",
                    line: lineNum,
                    value: model
                  });
                }

                if (locid) {
                  sublist.setSublistValue({
                    id: "custpabe_loc",
                    line: lineNum,
                    value: locid
                  });
                }
                if (phylocId) {
                  sublist.setSublistValue({
                    id: "custpabe_phyloc",
                    line: lineNum,
                    value: phylocId
                  });
                }

                if (modelyr) {
                  sublist.setSublistValue({
                    id: "custpabe_m_yr",
                    line: lineNum,
                    value: modelyr
                  });
                }
                if (stockdt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_stock",
                    line: lineNum,
                    value: stockdt
                  });
                }
                if (Statusdt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_status",
                    line: lineNum,
                    value: Statusdt
                  });
                }

                if (Mileagedt == 0) {
                  sublist.setSublistValue({
                    id: "custpabe_m_mileage",
                    line: lineNum,
                    value: mileagepopup
                  });
                } else {
                  sublist.setSublistValue({
                    id: "custpabe_m_mileage",
                    line: lineNum,
                    value: mileagepopupfordata
                  });
                }
                if (Customerdt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_customer",
                    line: lineNum,
                    value: Customerdt
                  });
                }

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
                if (softHoldCustomerdt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_softhold_customer",
                    line: lineNum,
                    value: softHoldCustomerdt
                  });
                }
                if (singlebunk) {
                  sublist.setSublistValue({
                    id: "custpabe_m_single_bunk",
                    line: lineNum,
                    value: singlebunk
                  });
                }
                if (Transport) {
                  sublist.setSublistValue({
                    id: "custpabe_transport",
                    line: lineNum,
                    value: Transport
                  });
                }
                if (Inspected) {
                  sublist.setSublistValue({
                    id: "custpabe_inspected",
                    line: lineNum,
                    value: Inspected
                  });
                }
                if (Picture1) {
                  sublist.setSublistValue({
                    id: "custpabe_pictures",
                    line: lineNum,
                    value: Picture1
                  });
                }
                if (ApprRepDate) {
                  sublist.setSublistValue({
                    id: "custpabe_appr_rep_date",
                    line: lineNum,
                    value: ApprRepDate
                  });
                }
                if (admin_notes) {
                  sublist.setSublistValue({
                    id: "custpabe_m_admin_notes",
                    line: lineNum,
                    value: admin_notes
                  });
                }
                if (body_style) {
                  sublist.setSublistValue({
                    id: "custpabe_m_body_style",
                    line: lineNum,
                    value: body_style
                  });
                }
                if (eta_ready) {
                  sublist.setSublistValue({
                    id: "custpabe_eta_ready",
                    line: lineNum,
                    value: eta_ready
                  });
                }
                if (notesms) {
                  sublist.setSublistValue({
                    id: "custpabe_m_notes",
                    line: lineNum,
                    value: notesms
                  });
                }
                if (aging_contr) {
                  sublist.setSublistValue({
                    id: "custpabe_aging_contract",
                    line: lineNum,
                    value: aging_contr
                  });
                }
                /*  if(TTLINSP){
                     sublist.setSublistValue({ id: "custpabe_m_bkt_ttl_incep_2", line: lineNum, value: "$" + addCommasnew(TTLINSP.toFixed(2)) });
                 }
                 if(DEPINSP){
                     sublist.setSublistValue({ id: "custpabe_m_bkt_dep", line: lineNum, value: "$" + addCommasnew(DEPINSP.toFixed(2)) });
                 }
                 if(PAYINSP){
                     sublist.setSublistValue({ id: "custpabe_m_bkt_pay", line: lineNum, value: "$" + addCommasnew(PAYINSP.toFixed(2)) });
                 }
                 if(TERMS){
                     sublist.setSublistValue({ id: "custpabe_m_bkt_terms_2", line: lineNum, value: TERMS });
                 } */
                if (softholdageindays) {
                  sublist.setSublistValue({
                    id: "custpabe_m_softhold_days",
                    line: lineNum,
                    value: softholdageindays
                  });
                }
                if (softHoldstatusdt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_softhold_status",
                    line: lineNum,
                    value: softHoldstatusdt
                  });
                }
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
                }
                if (apu) {
                  sublist.setSublistValue({
                    id: "custpabe_m_apu",
                    line: lineNum,
                    value: apu
                  });
                }
                if (beds) {
                  sublist.setSublistValue({
                    id: "custpabe_m_beds",
                    line: lineNum,
                    value: beds
                  });
                }
                if (titlerestriction) {
                  sublist.setSublistValue({
                    id: "custpabe_m_titlerestriction2",
                    line: lineNum,
                    value: titlerestriction
                  });
                }
                var titlerestrictionVal = "";
                if (titlerestriction == "Yes") {
                  titlerestrictionVal = '<a href="#" title="You can only lease to lessees with a valid drivers license in these states:  Arkansas, Florida, Georgia, Illinois, Indiana, Iowa, Kansas, Minnesota, Mississippi, Missouri, Michigan, Nebraska, New York, North Carolina, Ohio, Tennessee, Texas, Wisconsin.">YES</a>';
                } else if (titlerestriction == "No") {
                  titlerestrictionVal = 'No';
                }
                if (titlerestrictionVal != '') {
                  sublist.setSublistValue({
                    id: "custpabe_m_titlerestriction",
                    line: lineNum,
                    value: titlerestrictionVal
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
                if (istruckready) {
                  istruckready = istruckready ? "Yes" : "No";
                  sublist.setSublistValue({
                    id: "custpabe_m_is_truck_ready",
                    line: lineNum,
                    value: istruckready
                  });
                }
                if (iswashed) {
                  iswashed = iswashed ? "Yes" : "No";
                  sublist.setSublistValue({
                    id: "custpabe_m_is_washed",
                    line: lineNum,
                    value: iswashed
                  });
                }
                // if (DateTruckAgingdt) {  // removed by abdul
                if (DateTruckRdydt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_aging",
                    line: lineNum,
                    value: calculateDays(DateTruckRdydt, new Date())
                  });
                }
                if (DateOnsitedt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_donsite",
                    line: lineNum,
                    value: DateOnsitedt
                  });
                }
                if (DateOnsitedt) {
                  sublist.setSublistValue({
                    id: "custpabe_m_donsite_aging",
                    line: lineNum,
                    value: calculateDays(DateOnsitedt, new Date())
                  });
                }
                lineNum++;
              }
            }

            //}
          }
        }

        if (!flagpara2) {
          //Reposession search and add data to sublist
          getReposessionNotesData();
          var customrecord_lms_ofr_SearchObj = search.create({
            type: "customrecord_lms_ofr_",
            filters: [
              ["isinactive", "is", "F"]
            ],
            columns: [
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
              search.createColumn({
                name: "custrecord_advs_ofr_ofrstatus",
                label: "OFR Status",
                sort: search.Sort.ASC
              }),
              "custrecord_advs_repo_company",
              "custrecord_ofr_stock_no",
              "custrecord_termination_date",
              "custrecord_ofr_vin",
              "custrecord_ofr_year",
              "custrecord_location_for_transport",
              "custrecord_last_location",
              "custrecord_date_putout",
              "custrecord_additional_info_remarks",
              "custrecord_transport_company",
              "custrecord_goldstar_odometer",
              "custrecord_goldstar_vehicle_coordinates",
              search.createColumn({
                name: "custrecord_advs_em_serial_number",
                join: "custrecord_ofr_vin"
              }),
              search.createColumn({
                name: "custrecord_advs_vm_reservation_status",
                join: "custrecord_ofr_vin"
              })
            ]
          });
          if (repo_vin != "" && repo_vin != undefined && repo_vin != null) {
            customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
              name: "custrecord_ofr_vin",
              operator: search.Operator.ANYOF,
              values: repo_vin
            }))
          }
          if (repo_loc != "" && repo_loc != undefined && repo_loc != null) {
            customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
              name: "custrecord_location_for_transport",
              operator: search.Operator.ANYOF,
              values: repo_loc
            }))
          }
          if (repo_mil != "" && repo_mil != undefined && repo_mil != null) {
            customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
              name: "custrecord_goldstar_odometer",
              operator: search.Operator.IS,
              values: repo_mil
            }))
          }

          if (repo_sts != "" && repo_sts != undefined && repo_sts != null) {
            customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
              name: "custrecord_advs_ofr_ofrstatus",
              operator: search.Operator.ANYOF,
              values: repo_sts
            }))
          }
          if (repo_cust != "" && repo_cust != undefined && repo_cust != null) {
            customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
              name: "custrecord_ofr_customer",
              operator: search.Operator.ANYOF,
              values: repo_cust
            }))
          }
          if (repo_stock != "" && repo_stock != undefined && repo_stock != null) {
            customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
              name: "custrecord_advs_em_serial_number",
              join: 'custrecord_ofr_vin',
              operator: search.Operator.CONTAINS,
              values: repo_stock
            }))
          }
          if (repo_year != "" && repo_year != undefined && repo_year != null) {
            customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
              name: "custrecord_ofr_year",
              operator: search.Operator.ANYOF,
              values: repo_year
            }))
          }
          if (repo_collec != "" && repo_collec != undefined && repo_collec != null) {
            customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
              name: "custrecord_collections",
              operator: search.Operator.ANYOF,
              values: repo_collec
            }))
          }
          if (repo_dest != "" && repo_dest != undefined && repo_dest != null) {
            customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
              name: "custrecord_destination",
              operator: search.Operator.ANYOF,
              values: repo_dest
            }))
          }
          if (repo_com != "" && repo_com != undefined && repo_com != null) {
            customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
              name: "custrecord_advs_repo_company",
              operator: search.Operator.ANYOF,
              values: repo_com
            }))
          }
          if (repo_date != "" && repo_date != undefined && repo_date != null) {
            customrecord_lms_ofr_SearchObj.filters.push(search.createFilter({
              name: "custrecord_date_putout",
              operator: search.Operator.ON,
              values: repo_date
            }))
          }

          var searchResultCount = customrecord_lms_ofr_SearchObj.runPaged().count;
          var arr = [];
          var count = 0;
          customrecord_lms_ofr_SearchObj.run().each(function (result) {
            var name = result.getText({
              name: 'custrecord_ofr_customer'
            }) || ' ';
            var Custo_name = result.getValue({
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
            var Collections = result.getText({
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
            var goldstar_odometer = result.getValue({
              name: 'custrecord_goldstar_odometer'
            }) || ' ';
            var goldstar_coordinates = result.getValue({
              name: 'custrecord_goldstar_vehicle_coordinates'
            }) || ' ';
            var TruckSerial = result.getValue({
              name: "custrecord_advs_em_serial_number",
              join: "custrecord_ofr_vin"
            }) || ' ';
            var TruckStatus = result.getValue({
              name: "custrecord_advs_vm_reservation_status",
              join: "custrecord_ofr_vin"
            }) || '';
            var ofrid = result.id;
            var leaseagrement = '';
            var vinlink = '';

            /* var vinlink = url.resolveRecord({ recordType: 'customrecord_advs_vm', recordId: vinval }); */
            vinlink = 'https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=129&id=' + vinval;
            leaseagrement = 'https://8760954.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=675&id=' + stockval;
            var CustomerLink = 'https://8760954.app.netsuite.com/app/common/entity/custjob.nl?id=' + Custo_name;

            var NotesRepArr = [];
            if (NoteDataforRep[ofrid] != null && NoteDataforRep[ofrid] != undefined) {
              var Length = NoteDataforRep[ofrid].length;
              for (var Len = 0; Len < Length; Len++) {
                if (NoteDataforRep[ofrid][Len] != null && NoteDataforRep[ofrid][Len] != undefined) {
                  var DateTime = NoteDataforRep[ofrid][Len]['DateTime'];
                  var Notes = NoteDataforRep[ofrid][Len]['Notes'];
                  var DataStore = DateTime + '-' + Notes;
                  NotesRepArr.push(DataStore);
                }
              }
            }

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
              id: "custpage_repo_truckstatus",
              line: count,
              value: TruckStatus
            });
            sublistrepo.setSublistValue({
              id: "custpage_repo_status",
              line: count,
              value: Statusval
            });
            sublistrepo.setSublistValue({
              id: "custpage_repo_lesee",
              line: count,
              value: '<a href="' + CustomerLink + '">' + name + '</a>'
            });
            sublistrepo.setSublistValue({
              id: "custpage_repo_stock_no",
              line: count,
              value: TruckSerial
            });
            sublistrepo.setSublistValue({
              id: "custpage_repo_leseedoc",
              line: count,
              value: stock
            });
            sublistrepo.setSublistValue({
              id: "custpage_repo_vin",
              line: count,
              value: vin
            });
            sublistrepo.setSublistValue({
              id: "custpage_repo_notes",
              line: count,
              value: notes
            });
            sublistrepo.setSublistValue({
              id: "custpage_repo_notes_time",
              line: count,
              value: NotesRepArr
            });
            sublistrepo.setSublistValue({
              id: "custpage_repo_lastlocation",
              line: count,
              value: lastlocation
            });
            if (repocompanyval != '') {
              sublistrepo.setSublistValue({
                id: "custpage_repo_repocompany",
                line: count,
                value: repocompanyval
              });
            }
            if (Collections) {
              sublistrepo.setSublistValue({
                id: "custpage_repo_collections_d",
                line: count,
                value: Collections
              });
            }
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
              var FollowUpImg = '<img src="https://8760954.app.netsuite.com/core/media/media.nl?id=4644&c=8760954&h=EL8p2LAO88T5YeyN8HcQ1ZtGg-8KmScu4V05TJWCW0vuQX_I" width=30px; height=30px;/>'
              sublistrepo.setSublistValue({
                id: "custpage_repo_followupletter",
                line: count,
                value: FollowUpImg
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
              value: goldstar_odometer || ' '
            });
            sublistrepo.setSublistValue({
              id: "custpage_repo_current_coordinates",
              line: count,
              value: goldstar_coordinates || ' '
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
        var surl = 'https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2604&deploy=1'
        form.addButton({
          id: 'custpage_open_filtersetup',
          label: 'Filters',
          functionName: 'openfiltersetup(' + Userid + ')'
        });
        form.addButton({
          id: 'custpage_clear_filters',
          label: 'Clear Filters',
          functionName: 'resetFilters(' + Userid + ')'
        });


        if (flagpara2) {
          form.addSubmitButton("Select Vehicle");
        }
        form.clientScriptModulePath = "./advs_cs_available_veh_by_bucket.js";
        response.writePage(form);
      } else {
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
        onclickScript += "window.parent.closePopup();";
        onclickScript += "}catch(e){alert(e+'   '+e.message);}</script></body></html>";

        scriptContext.response.write(onclickScript);

      }
    }
    var uniqueBucket = [];
    var bucketData = [];
    var bucketchildsIds = [];
    var mileagetofilter = 0;

    function fetchSearchResult(pagedData, pageIndex, freqId) {
      var vindiscountData = discountsetup();
      log.debug('vindiscountData', vindiscountData);
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
        var phylocId = result.getValue({
          name: "custrecord_advs_physical_loc_ma"
        });
        var modelYr = result.getValue({
          name: "custrecord_advs_vm_model_year"
        });
        var bucketId = result.getValue({
          name: "custrecord_vehicle_master_bucket"
        });
        // bucketchildsIds .push( result.getValue({ name: "custrecord_v_master_buclet_hidden" }));
        var bucketchilds = result.getValue({
          name: "custrecord_v_master_buclet_hidden"
        });
        var stockdt = result.getValue({
          name: "custrecord_advs_em_serial_number"
        });
        var Statusdt = result.getValue({
          name: "custrecord_advs_vm_reservation_status"
        });
        var Mileagedt = result.getValue({
          name: "custrecord_advs_vm_mileage"
        });
        mileagetofilter = Mileagedt;
        var Transdt = result.getValue({
          name: "custrecord_advs_vm_transmission_type"
        });
        var Enginedt = result.getValue({
          name: "custrecord_advs_vm_engine_serial_number"
        });
        var Customerdt = result.getValue({
          name: "custrecord_advs_vm_customer_number"
        });
        var softHoldCustomerdt = result.getValue({
          name: "custrecord_advs_customer"
        });
        var softHoldCus_sales_rep = result.getValue({
          name: "salesrep",
          join: "custrecord_advs_customer"
        });
        var softHoldstatusdt = result.getValue({
          name: "custrecord_reservation_hold"
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
        var invdepositLink = result.getValue({
          name: "custrecord_deposit_count"
        });
        var deliveryBoardBalance = parseFloat(result.getValue({
          name: "custrecord_deposit_balance"
        }));

        var InvSales = result.getValue({
          name: "custrecord_advs_vm_soft_hld_sale_rep"
        });
        var sleepersizeval = result.getValue({
          name: "custrecord_advs_sleeper_size_ms"
        });
        var sleepersize = result.getText({
          name: "custrecord_advs_sleeper_size_ms"
        });
        var apuval = result.getValue({
          name: "custrecord_advs_apu_ms_tm"
        });
        var apu = result.getText({
          name: "custrecord_advs_apu_ms_tm"
        });
        var bedsval = result.getValue({
          name: "custrecord_advs_beds_ms_tm"
        });
        var beds = result.getText({
          name: "custrecord_advs_beds_ms_tm"
        });
        var titlerestrictionval = result.getValue({
          name: "custrecord_advs_title_rest_ms_tm"
        });
        var titlerestriction = result.getText({
          name: "custrecord_advs_title_rest_ms_tm"
        });
        var istruckready = result.getValue({
          name: "custrecord_advs_tm_truck_ready"
        });
        var iswashed = result.getValue({
          name: "custrecord_advs_tm_washed"
        });
        var softHoldDateStr = result.getValue({
          name: "custrecord_advs_vm_soft_hold_date"
        });
        var vehicletype = result.getValue({
          name: "custrecord_advs_vm_vehicle_type"
        });

        var softHoldageInDays = 0;
        if (softHoldDateStr) {
          var softHoldDate = new Date(softHoldDateStr);
          var currentDate = new Date();
          var timeDiff = currentDate.getTime() - softHoldDate.getTime();
          softHoldageInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          softHoldageInDays = softHoldageInDays * 1;
          softHoldageInDays = softHoldageInDays + 1;
        }

        var deliveryboard = result.getValue({
          name: "custrecord_advs_lease_inventory_delboard"
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
        var sh_net_depo_inception = result.getValue({
          name: "custrecord_advs_net_dep_tm"
        });
        var sh_net_payment_inc = result.getValue({
          name: "custrecord_advs_net_paym_tm"
        });
        var sh_payment_inc = result.getValue({
          name: "custrecord_advs_payment_inception"
        });
        /* log.debug("total incep", result.getValue({
          name: "custrecord_advs_total_inception"
        })) */
        var sh_total_inc = result.getValue({
          name: "custrecord_advs_total_inception"
        }) || 0;
        var sh_terms = result.getValue({
          name: "custrecord_advs_buck_terms1"
        });
        var sh_payterm1 = result.getValue({
          name: "custrecord_advs_payment_2_131"
        });
        var sh_payterm2 = result.getValue({
          name: "custrecord_advs_payment_14_25"
        });
        var sh_payterm3 = result.getValue({
          name: "custrecord_advs_payment_26_37"
        });
        var sh_payterm4 = result.getValue({
          name: "custrecord_advs_payment_38_49"
        });
        var sh_purchase_option = result.getValue({
          name: "custrecord_advs_pur_option"
        });
        var sh_contract_total = result.getValue({
          name: "custrecord_advs_contract_total"
        });
        var sh_reg_fee = result.getValue({
          name: "custrecord_advs_registration_fees_bucket"
        });
        var sh_grandtotal = result.getValue({
          name: "custrecord_advs_grand_total_inception"
        });

        var sh_depo_inception1 = result.getValue({
          name: "custrecord_advs_deposit_inception1"
        });
        var sh_payment_inc1 = result.getValue({
          name: "custrecord_advs_payment_inception_1"
        });
        /* log.debug("total incep", result.getValue({
          name: "custrecord_advs_payment_inception_1"
        })) */
        var sh_total_inc1 = result.getValue({
          name: "custrecord_advs_total_inception1"
        }) || 0;
        var sh_terms1 = result.getValue({
          name: "custrecord_advs_buck_terms1_1"
        });
        var sh_payterm1_1 = result.getValue({
          name: "custrecord_advs_payment_2_131_1"
        });
        var sh_payterm2_1 = result.getValue({
          name: "custrecord_advs_payment_14_25_1"
        });
        var sh_payterm3_1 = result.getValue({
          name: "custrecord_advs_payment_26_37_1"
        });
        var sh_payterm4_1 = result.getValue({
          name: "custrecord_advs_payment_38_49_1"
        });
        var sh_purchase_option1 = result.getValue({
          name: "custrecord_advs_pur_option_1"
        });
        var sh_contract_total1 = result.getValue({
          name: "custrecord_advs_contract_total_1"
        });
        var sh_reg_fee1 = result.getValue({
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
        var cabconfig = result.getValue({
          name: "custrecord_advs_cab_config1"
        });
        var dayssinceready = result.getValue({
          name: "custrecord_advs_aging_days_ready"
        });




        // log.debug("Mileagedt", Mileagedt)
        var obj = {};
        obj.id = vinId;
        obj.vinName = vinText;
        obj.modelid = modelId;
        obj.brand = vehicleBrand;
        obj.locid = locId;
        obj.phylocId = phylocId;
        obj.modelyr = modelYr;
        obj.bucketId = bucketId;
        obj.stockdt = stockdt;
        obj.Statusdt = Statusdt;
        obj.Mileagedt = Mileagedt;
        obj.Transdt = Transdt;
        obj.Enginedt = Enginedt;
        obj.Customerdt = Customerdt;
        obj.softHoldCustomerdt = softHoldCustomerdt;
        obj.softHoldCus_sales_rep = softHoldCus_sales_rep;
        obj.salesrepdt = salesrepdt;
        obj.softHoldstatusdt = softHoldstatusdt;
        obj.softholdageindays = softHoldageInDays;
        obj.extclrdt = extclrdt;
        obj.DateTruckRdydt = DateTruckRdydt;
        obj.DateTruckLockupdt = DateTruckLockupdt;
        obj.DateTruckAgingdt = DateTruckAgingdt;
        obj.DateOnsitedt = DateOnsitedt;
        obj.invdepositLink = invdepositLink;
        obj.InvSales = InvSales;
        obj.deliveryBoardBalance = deliveryBoardBalance;
        obj.deliveryboard = deliveryboard;

        obj.sleepersize = sleepersize;
        obj.apu = apu;
        obj.beds = beds;
        obj.titlerestriction = titlerestriction;
        obj.istruckready = istruckready;
        obj.iswashed = iswashed;

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


        //SOFTHOLD FIELD OBJ 
        obj.sh_depo_inception = sh_net_depo_inception || sh_depo_inception;
        obj.sh_payment_inc = sh_net_payment_inc || sh_payment_inc;
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
        obj.cabconfig = cabconfig;
        obj.dayssinceready = dayssinceready;




        if (bucketId) {
          if (uniqueBucket.indexOf(bucketId) == -1) {
            uniqueBucket.push(bucketId);
          }
        }
        if (bucketchilds) {
          var bucketchilds1 = bucketchilds.split(',');
          for (var io = 0; io < bucketchilds1.length; io++) {
            if (bucketchildsIds.indexOf(bucketchilds1[io]) == -1) {
              bucketchildsIds.push(bucketchilds1[io]);
            }
          }

        }
        //vindiscountData
        /*1)	Model year = 2019 & Cab Config is 125.   Discount $300
			 2)	Model year = 2019 to 2020 & days since ready >75 days.  Discount is $500
			3)	Model = M2 & Location is Florida. Discount is $200.
			4)	Model = M2 & Location is Texas.  Discount is $100.
			5)	Mileage > 850,000 and Cab Config is 125 and year is 2018.  Discount is $400 */
        obj.incepdiscount = 0;
        for (var vd = 0; vd < vindiscountData.length; vd++) {

          if (modelYr == vindiscountData[vd].year && cabconfig == vindiscountData[vd].cabconfig && vindiscountData[vd].model == '' && vindiscountData[vd].mileage == '' && vindiscountData[vd].dayssinceready == '' && vindiscountData[vd].location == '') {
            // log.debug('case1')
            obj.incepdiscount = vindiscountData[vd].amount;
            break;
          } else if (modelYr == vindiscountData[vd].year && dayssinceready > vindiscountData[vd].dayssinceready && vindiscountData[vd].model == '' && vindiscountData[vd].mileage == '' && vindiscountData[vd].cabconfig == '' && vindiscountData[vd].location == '') {
            // log.debug('case2')
            obj.incepdiscount = vindiscountData[vd].amount;
            break;
          } else if (modelId == vindiscountData[vd].model && locId == vindiscountData[vd].location && vindiscountData[vd].dayssinceready == '' && vindiscountData[vd].mileage == '' && vindiscountData[vd].cabconfig == '' && vindiscountData[vd].year == '') {
            //log.debug('case3')
            obj.incepdiscount = vindiscountData[vd].amount;
            break;
          } else if (Mileagedt == vindiscountData[vd].mileage && modelYr == vindiscountData[vd].year && cabconfig == vindiscountData[vd].cabconfig && vindiscountData[vd].dayssinceready == '' && vindiscountData[vd].model == '' && vindiscountData[vd].cabconfig == '' && vindiscountData[vd].location == '') {
            //log.debug('case4')
            obj.incepdiscount = vindiscountData[vd].amount;
            break;
          }
        }
        //log.debug('obj.incepdiscount',obj.incepdiscount);
        if (true) { //bucketId

          // var discount = getGlobalDiscounts(
          //   vehicleBrand, modelYr, vehicletype, titlerestrictionval,
          //   sleepersizeval, bedsval, apuval, '', Transdt, singlebunk) //color
          // obj.incepdiscount = discount;
          // log.debug('discount', discount);
          // var _discount = search.lookupFields({type:'customrecord_ez_bucket_calculation',id:bucketId,columns:['custrecord_discount']});
          /*  var _discountreclink = search.lookupFields({type:'customrecord_bucket_calculation_location',id:bucketchildsIds[0],columns:['custrecord_bucket_discount']});
                      if(_discountreclink.custrecord_bucket_discount && _discountreclink.custrecord_bucket_discount.length)
                      {
                        var _discount = search.lookupFields({type:'customrecord_advs_disc_crit_list',id:_discountreclink.custrecord_bucket_discount[0].value,columns:['custrecord_advs_make','custrecord_truck_type','custrecord_discount_amount']});
                       log.debug('_discount',_discount);
                       log.debug('brand'+vehicleBrand,'vehicletype'+vehicletype);
                       if(_discount.custrecord_advs_make.length && _discount.custrecord_advs_make[0].value == vehicleBrand){
                             _discount.custrecord_discount_amount||0;
                            obj.incepdiscount =_discount.custrecord_discount_amount||0;
                       }else if(_discount.custrecord_truck_type.length && _discount.custrecord_truck_type[0].value == vehicletype)
                       {
                            _discount.custrecord_discount_amount||0;
                            obj.incepdiscount =_discount.custrecord_discount_amount||0;
                       }
                    } */
        }
        vmDataResults.push(obj);
      });
      //log.debug('bucketchildsIds',bucketchildsIds);
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
        //log.debug('bucketCalcSearchFilters',bucketCalcSearchFilters);
        /* if (mileagetofilter) {
            bucketCalcSearchFilters.push("AND");
            bucketCalcSearchFilters.push([
                "formulanumeric",
                "CASE WHEN {custrecord_bucket_calc_parent_link.custrecord_advs_min_range_buck} < " + mileagetofilter +
                " AND " + mileagetofilter + " < {custrecord_bucket_calc_parent_link.custrecord_advs_max_range_buck} THEN 1 ELSE 0 END",
                "equalto",
                "1"
            ]);
         }*/

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
            }),
            search.createColumn({
              name: "custrecord_bucket_discount",
              label: "Bucket Discount"
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
          //MODIFY HERE DEPOSIT INCEPTION WITH DISCOUNT
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
          var bucketDiscountLink = result.getValue({
            name: "custrecord_bucket_discount"
          });
          var discountval = 0;
          if (bucketId) {
            /* 	var _discount = search.lookupFields({type:'customrecord_ez_bucket_calculation',id:bucketId,columns:['custrecord_discount']});
                _discount.custrecord_discount||0;
                discountval =_discount.custrecord_discount||0; */
          }
          var index = 0;
          /*   if (bucketData[bucketId] != null && bucketData[bucketId] != undefined) {
                index = bucketData[bucketId].length;
            } else {
                bucketData[bucketId] = new Array();
            } */
          /* bucketData[bucketId][index] = new Array();
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
          bucketData[bucketId][index]["saleCh"] = saleCh; */
          //					log.debug('bucketData',bucketData);
          if (bucketData[buckidCh] != null && bucketData[buckidCh] != undefined) {
            index = bucketData[buckidCh].length;
          } else {
            bucketData[buckidCh] = new Array();
          }
          bucketData[buckidCh][index] = new Array();
          bucketData[buckidCh][index]["id"] = buckidCh;
          bucketData[buckidCh][index]["DEPINSP"] = depositIncep; //(depositIncep -discountval);
          bucketData[buckidCh][index]["PAYINSP"] = payIncep;
          bucketData[buckidCh][index]["TTLINSP"] = ttlIncep; //(ttlIncep-discountval);
          bucketData[buckidCh][index]["TRMS"] = terms;
          bucketData[buckidCh][index]["2_13"] = Sch_2_13;
          bucketData[buckidCh][index]["14_26"] = Sch_14_26;
          bucketData[buckidCh][index]["26_37"] = Sch_26_37;
          bucketData[buckidCh][index]["26_37"] = Sch_26_37;
          bucketData[buckidCh][index]["38_49"] = Sch_38_49;
          bucketData[buckidCh][index]["purOptn"] = purOption;
          bucketData[buckidCh][index]["conttot"] = contTot;
          bucketData[buckidCh][index]["freq"] = FREQ;
          bucketData[buckidCh][index]["saleCh"] = saleCh;
          //					log.debug('bucketData',bucketData);
          return true;
        });
      }

      return vmDataResults;
    }

    function getGlobalDiscounts(make, year, type, title, size, beds, apu, color, transmtype, singlebunk) {
      try {


        var _filters = [];

        if (make != '' && year != '' && type != '') {
          _filters.push(

            [
              ["custrecord_advs_make", "anyof", make],
              "AND",
              ["custrecord_advs_model_year", "anyof", year],
              "AND",
              ["custrecord_truck_type", "anyof", type]
            ]


          )

        }

        if (make != '' && year != '') {
          _filters.push("OR");
          _filters.push(
            [
              /* ["custrecord_truck_type", "anyof", '@NONE@'],
              "AND", */
              ["custrecord_advs_make", "anyof", make],
              "AND",
              ["custrecord_advs_model_year", "anyof", year]
            ]
          )
        }

        if (make != '' && type != '') {
          _filters.push("OR");
          _filters.push(
            [
              ["custrecord_advs_make", "anyof", make],
              "AND",
              ["custrecord_truck_type", "anyof", type],
              /* "AND",
              ["custrecord_advs_model_year", "anyof", '@NONE@'] */
            ]
          )

        }
        if (year != '' && type != '') {

          _filters.push("OR");
          _filters.push(
            [
              /* ["custrecord_advs_make", "anyof", '@NONE@'],
                  "AND", */
              ["custrecord_advs_model_year", "anyof", year],
              "AND",
              ["custrecord_truck_type", "anyof", type]
            ]
          )
        }

        if (make) {
          _filters.push("OR");
          _filters.push(
            [
              ["custrecord_advs_make", "anyof", make],
              "AND",
              ["custrecord_truck_type", "anyof", '@NONE@'],
              "AND",
              ["custrecord_advs_model_year", "anyof", '@NONE@']
            ]
          )
        }
        if (year) {
          _filters.push("OR");
          _filters.push(
            [
              ["custrecord_advs_make", "anyof", '@NONE@'],
              "AND",
              ["custrecord_truck_type", "anyof", '@NONE@'],
              "AND",
              ["custrecord_advs_model_year", "anyof", year]
            ]
          )
        }
        if (type) {
          _filters.push("OR");
          _filters.push(
            [
              ["custrecord_advs_make", "anyof", '@NONE@'],
              "AND",
              ["custrecord_truck_type", "anyof", type],
              "AND",
              ["custrecord_advs_model_year", "anyof", '@NONE@']
            ]
          )
        }
        /*  if(title)
                {
                    _filters.push("OR"); 
                    _filters.push(["custrecord_advs_tit_res", "anyof", title])      
                }
                 if(size)
                {
                    _filters.push("OR"); 
                    _filters.push(["custrecord_advs_sleeper_size", "anyof", size])      
                }
                 if(beds)
                {
                    _filters.push("OR"); 
                    _filters.push(["custrecord_advs_beds", "anyof", beds])      
                }
                 if(apu)
                {
                    _filters.push("OR"); 
                    _filters.push(["custrecord_advs_apu", "anyof", apu])      
                }
                 if(color)
                {
                    _filters.push("OR"); 
                    _filters.push(["custrecord_advs_vm_exterior_color1", "anyof", color])      
                      
                }  */
        /* if(color)
                {
                    _filters.push("OR"); 
                    _filters.push(["custrecord_advs_vm_exterior_color1", "is", color])      
                      
                } if(color)
                {
                    _filters.push("OR"); 
                    _filters.push(["custrecord_advs_vm_exterior_color1", "is", color])      
                      
                } */
        //log.debug('_filters', _filters);
        var customrecord_advs_disc_crit_listSearchObj = search.create({
          type: "customrecord_advs_disc_crit_list",
          filters: _filters,
          columns: [
            "custrecord_advs_make",
            "custrecord_advs_model_year",
            "custrecord_truck_type",
            "custrecord_advs_tit_res",
            "custrecord_advs_sleeper_size",
            "custrecord_advs_beds",
            "custrecord_advs_apu",
            "custrecord_discount_amount"
          ]
        });
        var searchResultCount = customrecord_advs_disc_crit_listSearchObj.runPaged().count;
        //log.debug("customrecord_advs_disc_crit_listSearchObj result count", searchResultCount);
        var discountamount = 0;
        customrecord_advs_disc_crit_listSearchObj.run().each(function (result) {
          // .run().each has a limit of 4,000 results
          discountamount = result.getValue({
            name: 'custrecord_discount_amount'
          });
          //log.debug('discountamount', discountamount);
          return true;
        });

        return discountamount;
      } catch (e) {
        log.debug('error', e.toString());
      }
    }

    function createReposessionSublist(form) {

      var sublistrepo = form.addSublist({
        id: "custpage_sublist_repo",
        type: serverWidget.SublistType.LIST,
        label: "List",
        tab: "custpage_repo_tab"
      });
      sublistrepo.addField({
        id: "custpage_repo_edit",
        type: serverWidget.FieldType.TEXT,
        label: "Edit"
      });
      sublistrepo.addField({
        id: "custpage_repo_truckstatus",
        type: serverWidget.FieldType.SELECT,
        label: "Truck Status",
        source: 'customlist_advs_reservation_status'
      }).updateDisplayType({
        displayType: "inline"
      });
      sublistrepo.addField({
        id: "custpage_repo_status",
        type: serverWidget.FieldType.SELECT,
        label: "Repo Status",
        source: 'customrecord_advs_ofr_status'
      }).updateDisplayType({
        displayType: "inline"
      });

      sublistrepo.addField({
        id: "custpage_repo_hold_email",
        type: serverWidget.FieldType.TEXT,
        label: "Hold Harmless"
      });
      sublistrepo.addField({
        id: "custpage_repo_leseedoc",
        type: serverWidget.FieldType.TEXT,
        label: "Lesse#"
      }).updateDisplayType({
        displayType: "hidden"
      });
      sublistrepo.addField({
        id: "custpage_repo_lesee",
        type: serverWidget.FieldType.TEXT,
        label: "Lesse Name"
      }).updateDisplayType({
        displayType: "inline"
      });
      sublistrepo.addField({
        id: "custpage_repo_stock_no",
        type: serverWidget.FieldType.TEXT,
        label: "Stock #"
      }).updateDisplayType({
        displayType: "inline"
      });
      sublistrepo.addField({
        id: "custpage_repo_vin",
        type: serverWidget.FieldType.TEXT,
        label: "VIN"
      }).updateDisplayType({
        displayType: "hidden"
      });
      sublistrepo.addField({
        id: "custpage_repo_termination_notes",
        type: serverWidget.FieldType.TEXTAREA,
        label: "Termination Notes"
      }).updateDisplayType({
        displayType: "inline"
      });
      sublistrepo.addField({
        id: "custpage_repo_location_for_transport",
        type: serverWidget.FieldType.TEXT,
        label: "Staged Location From" //Location For Transport
      }).updateDisplayType({
        displayType: "inline"
      });
      sublistrepo.addField({
        id: "custpage_repo_notes_time",
        type: serverWidget.FieldType.TEXTAREA,
        label: "Notes (Time stamp)"
      }).updateDisplayType({
        displayType: "inline"
      });




      sublistrepo.addField({
        id: "custpage_repo_lastlocation",
        type: serverWidget.FieldType.TEXT,
        label: "Last Known Location"
      });
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
        label: "Date Assigned (Output)"
      });
      sublistrepo.addField({
        id: "custpage_repo_terminationdate",
        type: serverWidget.FieldType.TEXT,
        label: "Termination Date"
      });
      sublistrepo.addField({
        id: "custpage_repo_terminate_email",
        type: serverWidget.FieldType.TEXT,
        label: "Send Termination Email"
      });
      sublistrepo.addField({
        id: "custpage_repo_followupletter",
        type: serverWidget.FieldType.TEXT,
        label: "FollowUp Letter"
      });
      sublistrepo.addField({
        id: "custpage_repo_collections_d",
        type: serverWidget.FieldType.TEXT,
        label: "Collections"
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
        label: "Last Recorded Mileage"
      }).updateDisplayType({
        displayType: "inline"
      });
      sublistrepo.addField({
        id: "custpage_repo_net_investment",
        type: serverWidget.FieldType.TEXT,
        label: "Net Investment"
      }).updateDisplayType({
        displayType: "inline"
      });
      sublistrepo.addField({
        id: "custpage_repo_notes",
        type: serverWidget.FieldType.TEXT,
        label: "Notes"
      }).updateDisplayType({
        displayType: "hidden"
      });
      sublistrepo.addField({
        id: "custpage_repo_current_coordinates",
        type: serverWidget.FieldType.TEXT,
        label: "Vehicle Coordinates"
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


      /* sublistrepo.addButton({ id : 'custpage_hold_email', label : 'Hold Email', functionName : 'openholdpop()' });
          sublistrepo.addButton({ id : 'custpage_termination_email', label : 'Termination Email', functionName : 'openterminationpop()' }); */
      return sublistrepo;
    }

    function createAuctionSublist(form) {
      var sublistauction = form.addSublist({
        id: "custpage_sublist_auction",
        type: serverWidget.SublistType.LIST,
        label: "List",
        tab: "custpage_auction_tab"
      });

      // sublistauction.addField({ id: "custpage_auction_name", type: serverWidget.FieldType.TEXT, label: "Name" })

      sublistauction.addField({
        id: "custpage_auction_truckstatus",
        type: serverWidget.FieldType.TEXT,
        label: "Truck Status"
      })
      sublistauction.addField({
        id: "custpage_auction_locations",
        type: serverWidget.FieldType.TEXT,
        label: "Auction Location"
      })
      sublistauction.addField({
        id: "custpage_auction_status",
        type: serverWidget.FieldType.TEXT,
        label: " Auction Status"
      });
      sublistauction.addField({
        id: "custpage_auction_stock_no",
        type: serverWidget.FieldType.TEXT,
        label: "Stock #"
      });
      sublistauction.addField({
        id: "custpage_auction_notes",
        type: serverWidget.FieldType.TEXT,
        label: "Notes"
      })
      /*sublistauction.addField({ id: "custpage_auction_leseedoc", type: serverWidget.FieldType.TEXT, label: "Lesse#" }) */
      sublistauction.addField({
        id: "custpage_auction_vin",
        type: serverWidget.FieldType.TEXT,
        label: "VIN"
      }).updateDisplayType({
        displayType: "hidden"
      });

      sublistauction.addField({
        id: "custpage_auction_date",
        type: serverWidget.FieldType.TEXT,
        label: "Date of Auction"
      })
      sublistauction.addField({
        id: "custpage_days_till_action",
        type: serverWidget.FieldType.TEXT,
        label: "Days Untill Action"
      })
      sublistauction.addField({
        id: "custpage_location_of_unit",
        type: serverWidget.FieldType.TEXT,
        label: "Location Of Unit"
      });
      sublistauction.addField({
        id: "custpage_auction_condition",
        type: serverWidget.FieldType.TEXT,
        label: "Condition"
      });
      sublistauction.addField({
        id: "custpage_auction_acodes",
        type: serverWidget.FieldType.TEXT,
        label: "Active Codes"
      });
      sublistauction.addField({
        id: "custpage_auction_cleaned",
        type: serverWidget.FieldType.TEXT,
        label: "Cleaned"
      });
      sublistauction.addField({
        id: "custpage_auction_haskey",
        type: serverWidget.FieldType.TEXT,
        label: "Has Key"
      });
      sublistauction.addField({
        id: "custpage_auction_cont_signed",
        type: serverWidget.FieldType.TEXT,
        label: "Contract Signed"
      });
      sublistauction.addField({
        id: "custpage_auction_title_restriction",
        type: serverWidget.FieldType.TEXT,
        label: "State Restriction"
      });
      sublistauction.addField({
        id: "custpage_auction_title_sent",
        type: serverWidget.FieldType.TEXT,
        label: "Title Sent"
      });

      sublistauction.addField({
        id: "custpage_auction_location",
        type: serverWidget.FieldType.TEXT,
        label: "Location"
      }).updateDisplayType({
        displayType: "hidden"
      })

      /*sublistauction.addField({ id: "custpage_auction_location", type: serverWidget.FieldType.TEXT, label: "Location" }) */
      // sublistauction.addField({ id: "custpage_auction_starts", type: serverWidget.FieldType.TEXT, label: "Starts"});
      // sublistauction.addField({ id: "custpage_auction_drives", type: serverWidget.FieldType.TEXT, label: "Drives" });
      // sublistauction.addField({ id: "custpage_auction_runner", type: serverWidget.FieldType.TEXT, label: "Runner" });
      // sublistauction.addField({ id: "custpage_auction_senttitle", type: serverWidget.FieldType.TEXT, label: "Title Sent" })
      sublistauction.addField({
        id: "custpage_auction_edit",
        type: serverWidget.FieldType.TEXT,
        label: "Edit"
      })
      return sublistauction;
    }

    function addDatatoAuction(sublistauction, auc_condition, auc_date, auc_cleaned,
      auc_loc, auc_vin, vinID, locatId, _vinText, auc_sts, auc_ttlsent, auc_ttlrest,
      AuctionCondtionFldObj, AuctionDateFldObj, AuctionStatusFldObj,
      AuctionCleanedFldObj, AuctionLocationFldObj, AuctionVinFldObj,
      AuctionTtleSentFldObj, AuctionttlRestrFldObj

    ) {
      try {
        /* log.debug('auc_vin in addDatatoAuction',auc_vin);
        log.debug('auc_ttlsent in addDatatoAuction',auc_ttlsent);
        log.debug('auc_ttlrest in addDatatoAuction',auc_ttlrest); */
        var vehicle_auctionSearchObj = search.create({
          type: "customrecord_advs_vehicle_auction",
          filters: [
            ["isinactive", "is", "F"]
          ],
          columns: [
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
            "custrecord_auction_active_codes",
            "custrecord_advs_days_till_auct",
            "custrecord_advs_has_key",
            "custrecord_advs_cont_sgined",
            "custrecord_advs_title_res_auct",
            "custrecord_advs_loc_unit",
            "custrecord_advs_cond_",
            "custrecord_advs_auc_loc_veh",
            search.createColumn({
              name: "custrecord_advs_em_serial_number",
              join: "custrecord_auction_vin"
            }),
            search.createColumn({
              name: "custrecord_advs_vm_reservation_status",
              join: "custrecord_auction_vin"
            }),
          ]
        });
        var searchResultCount = vehicle_auctionSearchObj.runPaged().count;
        var count = 0;

        if (auc_vin != "" && auc_vin != undefined && auc_vin != null) {
          vehicle_auctionSearchObj.filters.push(search.createFilter({
            name: "custrecord_auction_vin",
            operator: search.Operator.ANYOF,
            values: auc_vin
          }))
          AuctionVinFldObj.defaultValue = auc_vin
        }
        //log.debug('auc_loc inside function for filter',auc_loc)
        if (auc_loc != "" && auc_loc != undefined && auc_loc != null) {
          vehicle_auctionSearchObj.filters.push(search.createFilter({
            name: "custrecord_auction_location",
            operator: search.Operator.ANYOF,
            values: auc_loc
          }));

          AuctionLocationFldObj.defaultValue = auc_loc;
        }

        if (auc_sts != "" && auc_sts != undefined && auc_sts != null) {
          vehicle_auctionSearchObj.filters.push(search.createFilter({
            name: "custrecord_auction_status",
            operator: search.Operator.ANYOF,
            values: auc_sts
          }))
          AuctionStatusFldObj.defaultValue = auc_sts;
        }


        if (auc_condition != "" && auc_condition != undefined && auc_condition != null) {
          vehicle_auctionSearchObj.filters.push(search.createFilter({
            name: "custrecord_advs_cond_",
            operator: search.Operator.ANYOF,
            values: auc_condition
          }))
          AuctionCondtionFldObj.defaultValue = auc_condition;

        }
        if (auc_cleaned != "" && auc_cleaned != undefined && auc_cleaned != null) {
          vehicle_auctionSearchObj.filters.push(search.createFilter({
            name: "custrecord_auction_cleaned",
            operator: search.Operator.ANYOF,
            values: auc_cleaned
          }))
          AuctionCleanedFldObj.defaultValue = auc_cleaned;

        }
        if (auc_date != "" && auc_date != undefined && auc_date != null) {
          //log.debug("auc_date",auc_date);
          vehicle_auctionSearchObj.filters.push(search.createFilter({
            name: "custrecord_data_of_auction",
            operator: search.Operator.ON,
            values: auc_date
          }))
          AuctionDateFldObj.defaultValue = auc_date;

        }
        if (auc_ttlsent != "" && auc_ttlsent != undefined && auc_ttlsent != null) {
          vehicle_auctionSearchObj.filters.push(search.createFilter({
            name: "custrecord_auction_title_sent",
            operator: search.Operator.ANYOF,
            values: auc_ttlsent
          }))
          AuctionTtleSentFldObj.defaultValue = auc_ttlsent;

        }
        if (auc_ttlrest != "" && auc_ttlrest != undefined && auc_ttlrest != null) {
          vehicle_auctionSearchObj.filters.push(search.createFilter({
            name: "custrecord_advs_title_res_auct",
            operator: search.Operator.ANYOF,
            values: auc_ttlrest
          }))
          AuctionttlRestrFldObj.defaultValue = auc_ttlrest;

        }
        //log.debug('vehicle_auctionSearchObj',vehicle_auctionSearchObj.filters)

        vehicle_auctionSearchObj.run().each(function (result) {

          var acutName = result.getValue({
            name: 'custrecord_auction_name'
          }) || ' ';
          //log.debug('acutName',acutName);
          var leaseName = result.getText({
            name: 'custrecord_auction_lease'
          }) || ' ';
          var leaseVal = result.getValue({
            name: 'custrecord_auction_lease'
          }) || ' ';
          var auctstock = result.getValue({
            name: "custrecord_advs_em_serial_number",
            join: "custrecord_auction_vin"
          }) || '';
          var aucttruckstatus = result.getText({
            name: "custrecord_advs_vm_reservation_status",
            join: "custrecord_auction_vin"
          }) || '';

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
          var runner = result.getText({
            name: 'custrecord_auction_runner'
          }) || ' ';
          var Cleaned = result.getText({
            name: 'custrecord_auction_cleaned'
          }) || ' ';
          var tsent = result.getText({
            name: 'custrecord_auction_title_sent'
          }) || ' ';
          var starts = result.getValue({
            name: 'custrecord_auction_starts'
          }) || ' ';
          var drives = result.getValue({
            name: 'custrecord_auction_drives'
          }) || ' ';
          var activecodes = result.getText({
            name: 'custrecord_auction_active_codes'
          }) || ' ';

          var daystillaction = result.getValue({
            name: 'custrecord_advs_days_till_auct'
          }) || ' ';
          var haskey = result.getText({
            name: 'custrecord_advs_has_key'
          }) || ' ';
          var contsigned = result.getText({
            name: 'custrecord_advs_cont_sgined'
          }) || ' ';
          var titlerestriction = result.getText({
            name: 'custrecord_advs_title_res_auct'
          }) || ' ';
          var locationunit = result.getValue({
            name: 'custrecord_advs_loc_unit'
          }) || ' ';
          var condition = result.getText({
            name: 'custrecord_advs_cond_'
          }) || ' ';
          var actionlocation = result.getText({
            name: 'custrecord_advs_auc_loc_veh'
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
            id: "custpage_auction_truckstatus",
            line: count,
            value: aucttruckstatus
          });
          // sublistauction.setSublistValue({ id: "custpage_auction_name", line: count, value: acutName });
          /* sublistauction.setSublistValue({ id: "custpage_auction_leseedoc", line: count, value: leaseName //'<a href="' + leaseagrement + '">' + stock + '</a>' }); */
          sublistauction.setSublistValue({
            id: "custpage_auction_vin",
            line: count,
            value: vinName
          });
          sublistauction.setSublistValue({
            id: "custpage_auction_stock_no",
            line: count,
            value: auctstock
          });
          sublistauction.setSublistValue({
            id: "custpage_auction_date",
            line: count,
            value: dateofauction
          });

          sublistauction.setSublistValue({
            id: "custpage_days_till_action",
            line: count,
            value: daystillaction
          });
          sublistauction.setSublistValue({
            id: "custpage_location_of_unit",
            line: count,
            value: locationunit
          });
          sublistauction.setSublistValue({
            id: "custpage_auction_condition",
            line: count,
            value: condition
          });
          sublistauction.setSublistValue({
            id: "custpage_auction_acodes",
            line: count,
            value: activecodes
          });
          sublistauction.setSublistValue({
            id: "custpage_auction_cleaned",
            line: count,
            value: Cleaned
          });
          sublistauction.setSublistValue({
            id: "custpage_auction_haskey",
            line: count,
            value: haskey
          });
          sublistauction.setSublistValue({
            id: "custpage_auction_cont_signed",
            line: count,
            value: contsigned
          });
          sublistauction.setSublistValue({
            id: "custpage_auction_title_restriction",
            line: count,
            value: titlerestriction
          });
          sublistauction.setSublistValue({
            id: "custpage_auction_title_sent",
            line: count,
            value: tsent
          });
          sublistauction.setSublistValue({
            id: "custpage_auction_notes",
            line: count,
            value: notesVal
          });
          sublistauction.setSublistValue({
            id: "custpage_auction_location",
            line: count,
            value: locationText
          });
          sublistauction.setSublistValue({
            id: "custpage_auction_locations",
            line: count,
            value: actionlocation
          });


          // sublistauction.setSublistValue({ id: "custpage_auction_starts", line: count, value: starts });
          // sublistauction.setSublistValue({ id: "custpage_auction_drives", line: count, value: drives});
          // sublistauction.setSublistValue({ id: "custpage_auction_acodes", line: count, value: activecodes});
          // sublistauction.setSublistValue({ id: "custpage_auction_runner", line: count, value: runner });
          // sublistauction.setSublistValue({ id: "custpage_auction_cleaned", line: count, value: Cleaned });
          // sublistauction.setSublistValue({ id: "custpage_auction_senttitle", line: count, value: tsent });
          count++;
          return true;
        });
      } catch (e) {
        log.debug('error in addDatatoAuction', e.toString())
      }
    }
    var deliveryVinArr = "";

    function createdeliverysublist(form, vinID, locatId, _vinText, DboardVinFldObj, DboardCustomerFldObj,
      DboardSalesrepFldObj, DboardTruckReadyFldObj, DboardWashedFldObj,
      DboardMCOOFldObj, DBVin, DBCustomer, DBSalesRep, DBTruckReady,
      DBWashed, DBmc00, DBClaim, DBStock, DBUnitCondition, DBContract,
      DBLocation, DboardClaimFldObj, DboardClaimFldObj, DboardStockFldObj,
      DboardUnitConditionFldObj, DboardContractFldObj, _DboardLocationFldObj) {

      var DepositDeliverysublist = form.addSublist({
        id: "custpage_sublist_deposit_delivery",
        type: serverWidget.SublistType.LIST,
        label: "List",
        tab: "custpage_delivery_tab"
      });

      var Editfld = DepositDeliverysublist.addField({
        id: "cust_delivery_edit",
        type: serverWidget.FieldType.TEXT,
        label: "Edit",
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
        type: serverWidget.FieldType.TEXT,
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
        type: serverWidget.FieldType.CHECKBOX,
        label: "Insurance Application"
      });
      insapplyFld.updateDisplayType({
        displayType: "inline"
      });

      var cleardeliveryfld = DepositDeliverysublist.addField({
        id: "cust_delivery_clear_deliver",
        type: serverWidget.FieldType.CHECKBOX,
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
        id: "cust_delivery_lease_inception",
        type: serverWidget.FieldType.TEXT,
        label: "Lease Inception"
      }).updateDisplayType({
        displayType: "inline"
      });
      DepositDeliverysublist.addField({
        id: "cust_delivery_registration_fee",
        type: serverWidget.FieldType.TEXT,
        label: "Registartion Fee"
      }).updateDisplayType({
        displayType: "inline"
      });
      DepositDeliverysublist.addField({
        id: "cust_delivery_title_fee",
        type: serverWidget.FieldType.TEXT,
        label: "Title Fee"
      }).updateDisplayType({
        displayType: "inline"
      });
      DepositDeliverysublist.addField({
        id: "cust_delivery_pickup_fee",
        type: serverWidget.FieldType.TEXT,
        label: "Pickup Fee"
      }).updateDisplayType({
        displayType: "inline"
      });
      DepositDeliverysublist.addField({
        id: "cust_delivery_total_lease",
        type: serverWidget.FieldType.TEXT,
        label: "Total Lease Inception"
      }).updateDisplayType({
        displayType: "inline"
      });
      DepositDeliverysublist.addField({
        id: "cust_delivery_deposit",
        type: serverWidget.FieldType.TEXT,
        label: "Deposit"
      }).updateDisplayType({
        displayType: "inline"
      });
      DepositDeliverysublist.addField({
        id: "cust_delivery_pu_payment",
        type: serverWidget.FieldType.TEXT,
        label: "P/U Payment"
      }).updateDisplayType({
        displayType: "inline"
      });
      DepositDeliverysublist.addField({
        id: "cust_delivery_balance",
        type: serverWidget.FieldType.TEXT,
        label: "Balance"
      }).updateDisplayType({
        displayType: "inline"
      });
      DepositDeliverysublist.addField({
        id: "cust_delivery_truck_mcoo",
        type: serverWidget.FieldType.SELECT,
        label: "MC/OO",
        source: "customlist_advs_delivery_board_mcoo"
      }).updateDisplayType({
        displayType: "inline"
      });
      DepositDeliverysublist.addField({
        id: "cust_delivery_claim",
        type: serverWidget.FieldType.SELECT,
        label: "CLAIM",
        source: "customrecord_advs_insurance_claim_sheet"
      }).updateDisplayType({
        displayType: "inline"
      });
      DepositDeliverysublist.addField({
        id: "cust_delivery_stock",
        type: serverWidget.FieldType.SELECT,
        label: "STOCK",
        source: "customrecord_advs_vm"
      }).updateDisplayType({
        displayType: "inline"
      });
      DepositDeliverysublist.addField({
        id: "cust_delivery_unit_condition",
        type: serverWidget.FieldType.SELECT,
        label: "UNIT CONDITION",
        source: "customlist_repairable_type"
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
        type: serverWidget.FieldType.TEXT,
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
      // DepositDeliverysublist.addField({ id: "cust_delivery_truck_exception", type: serverWidget.FieldType.TEXT, label: "Exceptions" }).updateDisplayType({ displayType: "inline" });
      DepositDeliverysublist.addField({
        id: "cust_delivery_deposit_id",
        type: serverWidget.FieldType.TEXT,
        label: "Deposit"
      }).updateDisplayType({
        displayType: "hidden"
      });

      var Deliveryboardsearch = search.create({
        type: "customrecord_advs_vm_inv_dep_del_board",
        filters: [
          ["isinactive", "is", "F"],
          "AND",
          ["custrecord_advs_in_dep_vin.custrecord_advs_vm_reservation_status", "noneof", "13"],
          "AND",
          //["custrecord_advs_in_dep_sales_quote","is","T"],
          //"AND",
          ["custrecord_advs_in_dep_trans_link", "noneof", "@NONE@"],
          "AND",
          ["custrecord_advs_in_dep_trans_link.mainline", "is", "T"]
        ],
        columns: [
          search.createColumn({
            name: "internalid"
          }),
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
            name: 'custbody_advs_st_out_side_sal_rep',
            join: 'custrecord_advs_in_dep_trans_link',
            label: 'Sales Rep'
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_inception",
            label: "Deposit Inception"
          }),
          search.createColumn({
            name: "custrecord_advs_in_payment_inception",
            label: "Payment Inception"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_registration_fee",
            label: "Registartion Fee"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_title_fee",
            label: "Title Fee"
          }),
          search.createColumn({
            name: "custrecord_advs_in_dep_pickup_fee",
            label: "Pickup Fee"
          }),
          search.createColumn({
            name: 'custrecord_advs_tm_truck_ready',
            join: 'custrecord_advs_in_dep_vin',
            label: 'Truck Ready'
          }),
          search.createColumn({
            name: 'custrecord_advs_tm_washed',
            join: 'custrecord_advs_in_dep_vin',
            label: 'Washed'
          }),
          search.createColumn({
            name: 'custrecord_advs_vm_sales_quote_from_inv',
            join: 'custrecord_advs_in_dep_vin',
            label: 'Sales Quote Inventory'
          }),
          search.createColumn({
            name: "custrecord_advs_vm_soft_hld_sale_rep",
            join: "CUSTRECORD_ADVS_IN_DEP_VIN"
          }),
          search.createColumn({
            name: 'custrecord__advs_in_dep_claim',
            label: 'Claim'
          }),
          search.createColumn({
            name: 'custrecord_advs_in_dep_stock',
            label: 'Stock'
          }),
          search.createColumn({
            name: 'custrecord_advs_in_dep_unit_condition',
            label: 'Unit Condition'
          }),

        ]
      });

      if (DBVin != "" && DBVin != undefined && DBVin != null) {
        Deliveryboardsearch.filters.push(search.createFilter({
          name: "custrecord_advs_in_dep_vin",
          operator: search.Operator.ANYOF,
          values: DBVin
        }))
        DboardVinFldObj.defaultValue = DBVin;
      }
      /*  if (locatId != "" && locatId != undefined && locatId != null) {
         Deliveryboardsearch.filters.push(search.createFilter({
           name: "custrecord_advs_in_dep_location",
           operator: search.Operator.ANYOF,
           values: locatId
         }))
       } */
      if (DBCustomer != "" && DBCustomer != undefined && DBCustomer != null) {
        Deliveryboardsearch.filters.push(search.createFilter({
          name: "custrecord_advs_in_dep_name",
          operator: search.Operator.ANYOF,
          values: DBCustomer
        }))
        DboardCustomerFldObj.defaultValue = DBCustomer;
      }
      if (DBSalesRep != "" && DBSalesRep != undefined && DBSalesRep != null) {
        Deliveryboardsearch.filters.push(search.createFilter({
          name: "custrecord_advs_vm_soft_hld_sale_rep",
          join: "CUSTRECORD_ADVS_IN_DEP_VIN",
          operator: search.Operator.ANYOF,
          values: DBSalesRep
        }))
        DboardSalesrepFldObj.defaultValue = DBSalesRep;
      }
      if (DBTruckReady != "" && DBTruckReady != undefined && DBTruckReady != null) {
        if (DBTruckReady == 1) {
          Deliveryboardsearch.filters.push(search.createFilter({
            name: 'custrecord_advs_tm_truck_ready',
            join: 'custrecord_advs_in_dep_vin',
            operator: search.Operator.IS,
            values: true
          }))
        } else {
          Deliveryboardsearch.filters.push(search.createFilter({
            name: 'custrecord_advs_tm_truck_ready',
            join: 'custrecord_advs_in_dep_vin',
            operator: search.Operator.IS,
            values: false
          }))
        }
        DboardTruckReadyFldObj.defaultValue = DBTruckReady;
      }
      if (DBWashed != "" && DBWashed != undefined && DBWashed != null) {
        if (DBWashed == 1) {
          Deliveryboardsearch.filters.push(search.createFilter({
            name: 'custrecord_advs_tm_washed',
            join: 'custrecord_advs_in_dep_vin',
            operator: search.Operator.IS,
            values: true
          }))
        } else {
          Deliveryboardsearch.filters.push(search.createFilter({
            name: 'custrecord_advs_tm_washed',
            join: 'custrecord_advs_in_dep_vin',
            operator: search.Operator.IS,
            values: false
          }))
        }

        DboardWashedFldObj.defaultValue = DBWashed;
      }
      if (DBmc00 != "" && DBmc00 != undefined && DBmc00 != null) {
        Deliveryboardsearch.filters.push(search.createFilter({
          name: "custrecord_advs_in_dep_mc_oo",
          operator: search.Operator.ANYOF,
          values: DBmc00
        }))
        DboardMCOOFldObj.defaultValue = DBmc00;
      }

      if (DBClaim != "" && DBClaim != undefined && DBClaim != null) {
        Deliveryboardsearch.filters.push(search.createFilter({
          name: "custrecord__advs_in_dep_claim",
          operator: search.Operator.ANYOF,
          values: DBClaim
        }))
        DboardClaimFldObj.defaultValue = DBClaim;
      }
      if (DBStock != "" && DBStock != undefined && DBStock != null) {
        Deliveryboardsearch.filters.push(search.createFilter({
          name: "custrecord_advs_in_dep_stock",
          operator: search.Operator.ANYOF,
          values: DBStock
        }))
        DboardStockFldObj.defaultValue = DBStock;
      }
      if (DBUnitCondition != "" && DBUnitCondition != undefined && DBUnitCondition != null) {
        Deliveryboardsearch.filters.push(search.createFilter({
          name: "custrecord_advs_in_dep_unit_condition",
          operator: search.Operator.ANYOF,
          values: DBUnitCondition
        }))
        DboardUnitConditionFldObj.defaultValue = DBUnitCondition;
      }
      //log.debug('DBContract',DBContract);
      if (DBContract != "" && DBContract != undefined && DBContract != null) {
        Deliveryboardsearch.filters.push(search.createFilter({
          name: "custrecord_advs_in_dep_contract",
          operator: search.Operator.ANYOF,
          values: DBContract
        }))
        //log.debug('DboardContractFldObj',DboardContractFldObj);
        //DboardContractFldObj.defaultValue = DBContract;
      }
      // log.debug('DBLocation',DBLocation);
      if (DBLocation != "" && DBLocation != undefined && DBLocation != null) {
        Deliveryboardsearch.filters.push(search.createFilter({
          name: "custrecord_advs_in_dep_location",
          operator: search.Operator.ANYOF,
          values: DBLocation
        }))
        //log.debug('_DboardLocationFldObj',_DboardLocationFldObj);
        // _DboardLocationFldObj.defaultValue = DBLocation;
      }

      /*  if (_vinText != "" && _vinText != undefined && _vinText != null) {
         Deliveryboardsearch.filters.push(search.createFilter({
           name: "name",
           join: "custrecord_advs_in_dep_vin",
           operator: search.Operator.CONTAINS,
           values: _vinText
         }))
       } */
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
        }) || '';
        var deliveryDate = result.getValue({
          name: 'custrecord_advs_in_dep_eta'
        }) || '';
        var deliveryclosedeal = result.getValue({
          name: 'custrecord_advs_in_dep_days_close_deal'
        }) || ' ';
        var deliveryinsurance = result.getValue({
          name: 'custrecord_advs_in_dep_insur_application'
        }) || '';
        var depcleardelivery = result.getValue({
          name: 'custrecord_advs_in_dep_clear_delivery'
        }) || '';
        var deliveryVin = result.getValue({
          name: 'custrecord_advs_in_dep_vin'
        }) || '';
        var deliverytruckready = result.getValue({
          name: 'custrecord_advs_tm_truck_ready',
          join: 'custrecord_advs_in_dep_vin'
        }) || ''; //result.getValue({ name: 'custrecord_advs_in_dep_truck_ready' }) || '';
        var deliveryWashed = result.getValue({
          name: 'custrecord_advs_tm_washed',
          join: 'custrecord_advs_in_dep_vin'
        }) || ''; //result.getValue({ name: 'custrecord_advs_in_dep_washed' }) || '';
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
          name: 'custrecord_advs_vm_sales_quote_from_inv',
          join: 'custrecord_advs_in_dep_vin'
        }) || ''; //result.getValue({ name: 'custrecord_advs_in_dep_sales_quote' }) || '';
        var deliverycontract = result.getText({
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
        // var custDepositSalesrep  = result.getValue({name: 'custbody_advs_st_out_side_sal_rep',join: "custrecord_advs_in_dep_trans_link",})||"";
        var custDepositSalesrep = result.getValue({
          name: "custrecord_advs_vm_soft_hld_sale_rep",
          join: "CUSTRECORD_ADVS_IN_DEP_VIN"
        }) || "";
        var Depinternalid = result.getValue({
          name: 'internalid'
        });
        var DepopsitInception = result.getValue({
          name: 'custrecord_advs_in_dep_inception'
        }) * 1;
        var PayemntInception = result.getValue({
          name: 'custrecord_advs_in_payment_inception'
        }) * 1;
        var registrationFee = result.getValue({
          name: 'custrecord_advs_in_dep_registration_fee'
        }) * 1;
        var TitleFee = result.getValue({
          name: 'custrecord_advs_in_dep_title_fee'
        }) * 1;
        var PickupFee = result.getValue({
          name: 'custrecord_advs_in_dep_pickup_fee'
        }) * 1;
        var DepClaim = result.getValue({
          name: 'custrecord__advs_in_dep_claim'
        });
        var DepStock = result.getValue({
          name: 'custrecord_advs_in_dep_stock'
        });
        var DepUnitCondition = result.getValue({
          name: '	custrecord_advs_in_dep_unit_condition'
        });


        var TotalLeaseIncep = DepopsitInception + PayemntInception;

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
        if (custDepositSalesrep) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_salesrep",
            line: count,
            value: custDepositSalesrep
          });
        }
        /* log.debug("deliveryDate", deliveryDate);
        if(deliveryDate){
            var formattedFromDate = format.format({value: new Date(deliveryDate), type: format.Type.DATE});
            // log.debug("formattedFromDate", formattedFromDate)
        }*/
        if (deliveryDate) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_date",
            line: count,
            value: deliveryDate
          });
        }

        if (deliveryclosedeal) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_close_deal",
            line: count,
            value: deliveryclosedeal
          });
        }
        if (deliveryinsurance == true || deliveryinsurance == "true") {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_insurance_deal",
            line: count,
            value: 'T'
          });
        }
        if (depcleardelivery == true || depcleardelivery == "true") {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_clear_deliver",
            line: count,
            value: 'T'
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
        if (TotalLeaseIncep) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_lease_inception",
            line: count,
            value: "$" + addCommasnew(TotalLeaseIncep.toFixed(2))
          });
        }
        var totalleincep = deliverytotlease; //(TotalLeaseIncep*1)+(registrationFee*1)+(TitleFee*1)+(PickupFee*1);
        //log.debug('totalleincep',totalleincep);
        if (totalleincep) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_total_lease",
            line: count,
            value: "$" + addCommasnew(totalleincep)
          });
        }
        if (deliverydeposit) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_deposit",
            line: count,
            value: "$" + addCommasnew((deliverydeposit * 1).toFixed(2))
          });
        }
        if (deliverypupayment) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_pu_payment",
            line: count,
            value: "$" + addCommasnew(deliverypupayment.toFixed(2))
          });
        }
        // var balancevalue = TotalLeaseIncep - deliverydeposit;
        var balancevalue = deliverybalance;
        if (balancevalue) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_balance",
            line: count,
            value: "$" + addCommasnew((balancevalue * 1).toFixed(2))
          });
        }
        if (deliverymcoo) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_truck_mcoo",
            line: count,
            value: deliverymcoo
          });
        }
        if (DepClaim) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_claim",
            line: count,
            value: DepClaim
          });
        }
        if (DepStock) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_stock",
            line: count,
            value: DepStock
          });
        }
        if (DepUnitCondition) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_unit_condition",
            line: count,
            value: DepUnitCondition
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
        // if(deliveryexception){
        //     DepositDeliverysublist.setSublistValue({ id: "cust_delivery_truck_exception", line: count, value: deliveryexception  });
        // }
        DepositDeliverysublist.setSublistValue({
          id: "cust_delivery_edit",
          line: count,
          value: '<a href="#" onclick=opendeliveryboard(' + Depinternalid + ')> <i class="fa fa-edit" style="color:blue;"></i></a>'
        });

        var depurl = 'https://8760954.app.netsuite.com/app/accounting/transactions/transaction.nl?id=' + deliverydepolink;

        DepositDeliverysublist.setSublistValue({
          id: "cust_delivery_deposit_id",
          line: count,
          value: '<a href="' + depurl + '" target="_blank">' + deliverydepotext + '</a>'
        });
        if (registrationFee) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_registration_fee",
            line: count,
            value: registrationFee
          });
        }
        if (TitleFee) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_title_fee",
            line: count,
            value: TitleFee
          });
        }
        if (PickupFee) {
          DepositDeliverysublist.setSublistValue({
            id: "cust_delivery_pickup_fee",
            line: count,
            value: PickupFee
          });
        }

        count++;
        return true;
      });

    }

    function createsummarydashbaord(form) {
      try {
        var htmlContent = getHtmlContent();
        /* form.addField({ id: "custpage_inlinetest", type: serverWidget.FieldType.TEXT, label: "Working", container: "custpage_summary_tab" }); */
        var inlineHTML = form.addField({
          id: "custpage_inlinehtml_sd",
          type: serverWidget.FieldType.INLINEHTML,
          label: " ",
          container: "custpage_summary_tab"
        });
        inlineHTML.defaultValue = htmlContent;
      } catch (e) {
        log.debug('error in createsummarydashbaord', e.toString())
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
        "        .container { display: flex; width: 100%; }\n" +
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
        "<div class=\"container\">\n" +
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
      return htmlContent;
    }

    function createInsClaimSublist(form) {
      try {
        var sublistclaim = form.addSublist({
          id: "custpage_sublist_custpage_subtab_insur_claim",
          type: serverWidget.SublistType.LIST,
          label: "List",
          tab: "custpage_claim_tab"
        });
        sublistclaim.addButton({
          id: 'claimform',
          label: 'Claim',
          functionName: 'opennewclaim()'
        });
        sublistclaim.addField({
          id: 'cust_fi_editclaim',
          type: serverWidget.FieldType.TEXT,
          label: 'EDIT'
        });
       
		 sublistclaim.addField({
          id: 'cust_fi_truckstatus_claim',
          type: serverWidget.FieldType.TEXT,
          label: 'Truck Status'
        });
        sublistclaim.addField({
          id: 'cust_fi_status_claim',
          type: serverWidget.FieldType.TEXT,
          label: 'Claim Status'
        });
        sublistclaim.addField({
          id: 'cust_fi_f_l_name',
          type: serverWidget.FieldType.TEXT,
          label: 'Lesse Name'
        });
        sublistclaim.addField({
          id: 'cust_fi_list_stock_number',
          type: serverWidget.FieldType.TEXT,
          label: 'Stock #'
        });
		sublistclaim.addField({
          id: 'cust_fi_notes',
          type: serverWidget.FieldType.TEXTAREA,
          label: 'Notes'
        });
        sublistclaim.addField({
          id: 'cust_fi_list_lease_no',
          type: serverWidget.FieldType.TEXT,
          label: 'Lease #'
        }).updateDisplayType({
            displayType: "hidden"
          });
        sublistclaim.addField({
          id: 'cust_fi_dateofloss',
          type: serverWidget.FieldType.TEXT,
          label: 'Date of Loss'
        });
        sublistclaim.addField({
          id: 'cust_fi_desc_accident',
          type: serverWidget.FieldType.TEXT,
          label: 'Description of Claim'
        });
		 sublistclaim.addField({
          id: 'cust_fi_insurance_company',
          type: serverWidget.FieldType.TEXT,
          label: 'Insurance Company'
        });
        sublistclaim.addField({
          id: 'cust_fi_claim_filed',
          type: serverWidget.FieldType.TEXT,
          label: 'Claim Filed'
        });
       
        sublistclaim.addField({
          id: 'cust_fi_ins_doc',
          type: serverWidget.FieldType.TEXT,
          label: 'Claim #'
        });
        sublistclaim.addField({
          id: 'cust_fi_adjuster_name',
          type: serverWidget.FieldType.TEXT,
          label: 'Adjuster Name'
        });
        sublistclaim.addField({
          id: 'cust_fi_adjuster_phone',
          type: serverWidget.FieldType.TEXT,
          label: 'Adjuster Phone'
        });
        sublistclaim.addField({
          id: 'cust_fi_adjuster_email',
          type: serverWidget.FieldType.TEXT,
          label: 'Adjuster Email'
        });
        sublistclaim.addField({
          id: 'cust_fi_repairable',
          type: serverWidget.FieldType.TEXT,
          label: 'Unit Condition'
        });
        sublistclaim.addField({
          id: 'cust_fi_veh_loc',
          type: serverWidget.FieldType.TEXT,
          label: 'Unit Location'
        });
        sublistclaim.addField({
          id: 'cust_fi_in_tow_yard',
          type: serverWidget.FieldType.TEXT,
          label: 'In Tow Yard'
        });
        sublistclaim.addField({
          id: 'cust_fi_shop_contact',
          type: serverWidget.FieldType.TEXT,
          label: 'Shop Contact'
        });
        sublistclaim.addField({
          id: 'cust_fi_folowup',
          type: serverWidget.FieldType.TEXT,
          label: 'Next Followup'
        });
        // sublistclaim.addField({ id: 'cust_fi_ins_from',  type: serverWidget.FieldType.TEXT, label: 'Insurance From' });
        
        return sublistclaim;
      } catch (e) {
        log.debug('error in createInsClaimSublist', e.toString());
      }
    }

    function searchForclaimData(insueclaim_sublist, vinID, _vinText, ins_sts) {
      try {
        getInsuaranceNotesData();
        var ClaimSheetSearchObj = search.create({
          type: "customrecord_advs_insurance_claim_sheet",
          filters: [
            ["isinactive", "is", "F"],
            /* "AND",
             ["custrecord_claim_settled","is","F"]*/
          ],
          columns: [
            "custrecord_advs_ic_name",
            "custrecord_advs_claim_status",
            search.createColumn({
              name: 'custrecord_advs_em_serial_number',
              join: 'custrecord_advs_ic_vin_number'
            }),
			search.createColumn({
              name: 'custrecord_advs_vm_reservation_status',
              join: 'custrecord_advs_ic_vin_number'
            }),
            "custrecord_ic_date_of_loss",
            "custrecord_ic_description_accident",
            "custrecord_ic_claim_field",
            "custrecord_advs_ic_insurance_company",
            "custrecord_ic_adj_name_number",
            "custrecord_advs_ic_adjuster_phone",
            "custrecord_advs_ic_adjuster_email",
            "custrecord_ic_repairable_type",
            "custrecord_ic_location_vehicle",
            "custrecord_advs_ic_in_tow_yard",
            "custrecord_advs_ic_shop_contact_info",
            "custrecord_tickler_followup",
            "custrecord_ic_lease",
            "name"
          ]
        });
        if (vinID != "" && vinID != undefined && vinID != null) {
          ClaimSheetSearchObj.filters.push(search.createFilter({
            name: "custrecord_advs_ic_vin_number",
            operator: search.Operator.ANYOF,
            values: vinID
          }))
        }
        if (_vinText != "" && _vinText != undefined && _vinText != null) {
          ClaimSheetSearchObj.filters.push(search.createFilter({
            name: "name",
            join: "custrecord_advs_ic_vin_number",
            operator: search.Operator.CONTAINS,
            values: _vinText
          }))
        }
        if (ins_sts != "" && ins_sts != undefined && ins_sts != null) {
          ClaimSheetSearchObj.filters.push(search.createFilter({
            name: "custrecord_advs_claim_status",
            operator: search.Operator.ANYOF,
            values: ins_sts
          }))
        }
        var count = 0;
        ClaimSheetSearchObj.run().each(function (result) {

          var Stock_link = url.resolveRecord({
            recordType: 'customrecord_advs_lease_header',
            isEditMode: false
          });
          var claim_link = url.resolveRecord({
            recordType: 'customrecord_advs_insurance_claim_sheet',
            isEditMode: false
          });

          var stock_carr = Stock_link + '&id=' + result.getValue({
            name: 'custrecord_ic_lease'
          });
          var claim_carr = claim_link + '&id=' + result.id;
          var stockREcLink = '<a href="' + encodeURI(stock_carr) + '" target="_blank">' + encodeURI(result.getText({
            name: 'custrecord_ic_lease'
          })) + '</a>';
          var claimREcLink = '<a href="' + encodeURI(claim_carr) + '" target="_blank">' + encodeURI(result.getValue({
            name: 'name'
          })) + '</a>';

          var NotesArr = [];
          var ClaimId = result.id;
          if (NoteData[ClaimId] != null && NoteData[ClaimId] != undefined) {
            var Length = NoteData[ClaimId].length;
            for (var Len = 0; Len < Length; Len++) {
              if (NoteData[ClaimId][Len] != null && NoteData[ClaimId][Len] != undefined) {
                var DateTime = NoteData[ClaimId][Len]['DateTime'];
                var Notes = NoteData[ClaimId][Len]['Notes'];
                var DataStore = DateTime + '-' + Notes;
                NotesArr.push(DataStore);
              }
            }
          }

          insueclaim_sublist.setSublistValue({
            id: "cust_fi_f_l_name",
            line: count,
            value: result.getText('custrecord_advs_ic_name') || ' '
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_status_claim",
            line: count,
            value: result.getText({
              name: 'custrecord_advs_claim_status'
            }) || ' '
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_list_stock_number",
            line: count,
            value: result.getValue({
              name: 'custrecord_advs_em_serial_number',
              join: 'custrecord_advs_ic_vin_number'
            }) || ' '
          });
		  insueclaim_sublist.setSublistValue({
            id: "cust_fi_truckstatus_claim",
            line: count,
            value: result.getText({
              name: 'custrecord_advs_vm_reservation_status',
              join: 'custrecord_advs_ic_vin_number'
            }) || ' '
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_list_lease_no",
            line: count,
            value: stockREcLink
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_dateofloss",
            line: count,
            value: result.getValue('custrecord_ic_date_of_loss') || ' '
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_desc_accident",
            line: count,
            value: result.getValue({
              name: 'custrecord_ic_description_accident'
            }) || ' '
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_claim_filed",
            line: count,
            value: result.getText({
              name: 'custrecord_ic_claim_field'
            }) || ' '
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_insurance_company",
            line: count,
            value: result.getText({
              name: 'custrecord_advs_ic_insurance_company'
            }) || ' '
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_ins_doc",
            line: count,
            value: claimREcLink
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_adjuster_name",
            line: count,
            value: result.getValue({
              name: 'custrecord_ic_adj_name_number'
            }) || ' '
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_adjuster_phone",
            line: count,
            value: result.getValue({
              name: 'custrecord_advs_ic_adjuster_phone'
            }) || ' '
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_adjuster_email",
            line: count,
            value: result.getValue({
              name: 'custrecord_advs_ic_adjuster_email'
            }) || ' '
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_repairable",
            line: count,
            value: result.getText({
              name: 'custrecord_ic_repairable_type'
            }) || ' '
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_veh_loc",
            line: count,
            value: result.getValue({
              name: 'custrecord_ic_location_vehicle'
            }) || ' '
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_in_tow_yard",
            line: count,
            value: result.getText({
              name: 'custrecord_advs_ic_in_tow_yard'
            }) || ' '
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_folowup",
            line: count,
            value: result.getValue({
              name: 'custrecord_tickler_followup'
            }) || ' '
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_notes",
            line: count,
            value: NotesArr
          });
          insueclaim_sublist.setSublistValue({
            id: "cust_fi_editclaim",
            line: count,
            value: '<a href="#" onclick="editclaimsheet(' + result.id + ')"> <i class="fa fa-edit" style="color:blue;"</i></a>'
          });

          count++;
          return true;
        });

      } catch (e) {
        log.debug('error in searchForclaimData', e.toString())
      }
    }
    var NoteData = [];

    function getInsuaranceNotesData() {
      var InsuranceNotesSearchObj = search.create({
        type: "customrecord_advs_insurance_notes",
        filters: [
          ["isinactive", "is", "F"],
          "AND",
          ["custrecord_advs_inf_parent_link", "noneof", "@NONE@"],
          "AND",
          ["custrecord_advs_inf_parent_link.custrecord_claim_settled", "is", "F"]
        ],
        columns: [
          search.createColumn({
            name: "custrecord_advs_inf_date_time"
          }),
          search.createColumn({
            name: "custrecord_advs_inf_notes"
          }),
          search.createColumn({
            name: "custrecord_advs_inf_parent_link"
          })
        ]
      });
      var Len = 0;
      InsuranceNotesSearchObj.run().each(function (result) {
        var ClaimId = result.getValue('custrecord_advs_inf_parent_link');
        var DateTime = result.getValue('custrecord_advs_inf_date_time');
        var Notes = result.getValue('custrecord_advs_inf_notes');
        if (NoteData[ClaimId] != null && NoteData[ClaimId] != undefined) {
          Len = NoteData[ClaimId].length;
        } else {
          NoteData[ClaimId] = new Array();
          Len = 0;
        }
        NoteData[ClaimId][Len] = new Array();
        NoteData[ClaimId][Len]['DateTime'] = DateTime;
        NoteData[ClaimId][Len]['Notes'] = Notes;
        return true;
      });
    }
    var NoteDataforRep = [];

    function getReposessionNotesData() {
      var InsuranceNotesSearchObj = search.create({
        type: "customrecord_advs_repo_notes",
        filters: [
          ["isinactive", "is", "F"],
          "AND",
          ["custrecord_advs_repo_note_parent_link", "noneof", "@NONE@"]
        ],
        columns: [
          search.createColumn({
            name: "custrecord_advs_repo_note_date_time"
          }),
          search.createColumn({
            name: "custrecord_advs_repo_note_notes"
          }),
          search.createColumn({
            name: "custrecord_advs_repo_note_parent_link"
          })
        ]
      });
      var Len = 0;
      InsuranceNotesSearchObj.run().each(function (result) {
        var RepoId = result.getValue('custrecord_advs_repo_note_parent_link');
        var DateTime = result.getValue('custrecord_advs_repo_note_date_time');
        var Notes = result.getValue('custrecord_advs_repo_note_notes');
        if (NoteDataforRep[RepoId] != null && NoteDataforRep[RepoId] != undefined) {
          Len = NoteDataforRep[RepoId].length;
        } else {
          NoteDataforRep[RepoId] = new Array();
          Len = 0;
        }
        NoteDataforRep[RepoId][Len] = new Array();
        NoteDataforRep[RepoId][Len]['DateTime'] = DateTime;
        NoteDataforRep[RepoId][Len]['Notes'] = Notes;
        return true;
      });
    }

    function InventorySearch(brandId, modelId, locatId, salesrepId, depofilterId, bucketId,
      freqId, bucketChild, vinID, _vinText, _statushold, LeaseHeaderId, iFrameCenter, flagpara2,
      Old_Vin_From_lease, ttlrest, washed, singlebunk, invterms, invapu, invbed, sfcustomer, bodystyle, invtransm, invyear, invcolor, invtruckready, invengine, invsssize, invstock,
      brandFldObj, modelFldObj, locFldObj, salesrepfld, depositFld,
      bucketFldObj, freqFldObj, vinFldObj, vinfreeformFldObj, LeaseFieldObj,
      IframeCenterFieldObj, Flagpara2FieldObj, OldVinFieldObj, status, color, transmission,
      salesrep, mileage, statusFldObj, colorFldObj, transmissionFldObj, salesrepFldObj, mileageFldObj,
      bucketChildFldObj, statusHoldFldObj, UserSubsidiary, invStockFldObj, invColorFldObj, invYearFldObj, invEngineFldObj, invTransmissionFldObj, invTitleRestFldObj,
      invBodyStyleFldObj, invTruckReadyFldObj, invWashedFldObj, invSingleBunkFldObj, invTermsFldObj,
      invsssizeFldObj, invApuFldObj, invBedsFldObj, invshCustomerFldObj, invStockFldObj,plocFldObj,plocatId) {
      // log.debug('status',status);
      var vmSearchObj = search.create({
        type: "customrecord_advs_vm",
        filters: [
          ["isinactive", "is", "F"],
          "AND",
          ["custrecord_advs_vm_reservation_status", "anyof", "15", "19", "20", "21", "22", "23", "24", "48"],
          /*  "AND",
          ["custrecord_vehicle_master_bucket", "noneof", "@NONE@"], */ //TO SHOW ALL VINS EVEN IF BUCKET NOT ASSOCIATED
          "AND",
          ["custrecord_advs_vm_subsidary", "anyof", UserSubsidiary]
        ],
        columns: [
          search.createColumn({
            name: "internalid"
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
            name: "custrecord_advs_customer",
            label: "CUSTOMER SOFTHOLD"
          }),
          search.createColumn({
            name: "salesrep",
            join: "custrecord_advs_customer",
            label: "SALES REP",
          }),
          search.createColumn({
            name: "custrecord_reservation_hold",
            label: "SOFTHOLD STATUS"
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
            name: "custrecord_advs_vm_soft_hold_date",
            label: "Soft Hold"
          }),
          /*search.createColumn({  name: "custrecord_advs_in_dep_trans_link", join: "CUSTRECORD_ADVS_IN_DEP_VIN",  label: "Deposit Link" }),
           search.createColumn({  name: "custrecord_advs_in_dep_balance", join: "CUSTRECORD_ADVS_IN_DEP_VIN", label: "Deposit Balance" }),
           search.createColumn({ name: "custrecord_advs_in_dep_sales_rep", join: "CUSTRECORD_ADVS_IN_DEP_VIN", label: "Sales Rep"  }),*/
          search.createColumn({
            name: "custrecord_advs_sleeper_size_ms"
          }),
          search.createColumn({
            name: "custrecord_advs_apu_ms_tm"
          }),
          search.createColumn({
            name: "custrecord_advs_beds_ms_tm"
          }),
          search.createColumn({
            name: "custrecord_advs_title_rest_ms_tm"
          }),
          search.createColumn({
            name: "custrecord_advs_lease_inventory_delboard"
          }),
          search.createColumn({
            name: "custrecord_deposit_count"
          }),
          search.createColumn({
            name: "custrecord_deposit_balance"
          }),
          search.createColumn({
            name: "custrecord_advs_tm_truck_ready"
          }),
          search.createColumn({
            name: "custrecord_advs_tm_washed"
          }),
          search.createColumn({
            name: "custrecord_advs_single_bunk"
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
          search.createColumn({
            name: "custrecord_advs_vm_vehicle_type"
          }),
          //FROM HERE SOFTHOLD FIELDS
          search.createColumn({
            name: "custrecord_advs_deposit_inception"
          }),
          search.createColumn({
            name: "custrecord_advs_deposit_discount"
          }),
          search.createColumn({
            name: "custrecord_advs_net_dep_tm"
          }),
          search.createColumn({
            name: "custrecord_advs_payment_inception"
          }),
          search.createColumn({
            name: "custrecord_advs_net_paym_tm"
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
          }),
          search.createColumn({
            name: "custrecord_advs_cab_config1"
          }),
          search.createColumn({
            name: "custrecord_advs_aging_days_ready"
          }),
          search.createColumn({
            name: "custrecord_advs_physical_loc_ma"
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
	  if (plocatId) {
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_physical_loc_ma",
          operator: search.Operator.ANYOF,
          values: plocatId
        }))
        plocFldObj.defaultValue = plocatId;
      }
      if (salesrepId) {
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_vm_soft_hld_sale_rep",
          operator: search.Operator.IS,
          values: salesrepId
        }))
        salesrepfld.defaultValue = salesrepId;
      }
      if (depofilterId) {
        var deliverybaords = false;
        if (depofilterId == 1) {
          deliverybaords = true
        } else if (depofilterId == 2) {
          deliverybaords = false
        }
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_lease_inventory_delboard",
          operator: search.Operator.IS,
          values: deliverybaords
        }))
        depositFld.defaultValue = depofilterId;
      }
      if (bucketId) {
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_vehicle_master_bucket",
          operator: search.Operator.ANYOF,
          values: bucketId
        }))
        bucketFldObj.defaultValue = bucketId;
      }
      if (bucketChild) {
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_v_master_buclet_hidden",
          operator: search.Operator.ANYOF,
          values: bucketChild
        }))
        bucketChildFldObj.defaultValue = bucketChild;
      }
      if (freqId) {
        //vmSearchObj.filters.push(search.createFilter({name:"customrecord_bucket_calculation_location.custrecord_advs_b_c_chld_freq",operator:search.Operator.ANYOF,values:freqId}))
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
      if (_vinText != '') {
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "name",
          operator: search.Operator.CONTAINS,
          values: _vinText
        }))
        vinfreeformFldObj.defaultValue = _vinText;
      }
      if (status != '') {
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_vm_reservation_status",
          operator: search.Operator.ANYOF,
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
          operator: search.Operator.EQUALTO,
          values: mileage
        }))
        mileageFldObj.defaultValue = mileage;
      }
      if (salesrep != '') {
        // log.debug('vinID filters', vinID);
        /*vmSearchObj.filters.push(search.createFilter({  name: "custrecord_advs_vm_soft_hld_sale_rep", operator: search.Operator.IS, values: salesrep }))
        salesrepFldObj.defaultValue = salesrep;*/
      }
      if (_statushold != '') {
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_reservation_hold",
          operator: search.Operator.ANYOF,
          values: _statushold
        }))
        statusHoldFldObj.defaultValue = _statushold;
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
      //EXTRA FILTERS

      if (ttlrest != '') {
        //if(washed==0){washed == 'F';}else if(washed==1){washed == 'T';}
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_title_rest_ms_tm",
          operator: search.Operator.ANYOF,
          values: ttlrest
        }))
        invTitleRestFldObj.defaultValue = ttlrest;
      }
      if (washed != '') {
        var _washed = '';
        if (washed == 0) {
          _washed = 'F';
        } else if (washed == 1) {
          _washed = 'T';
        }
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_tm_washed",
          operator: search.Operator.IS,
          values: [_washed]
        }))
        invWashedFldObj.defaultValue = washed;
      }
      if (singlebunk != '') {
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_single_bunk",
          operator: search.Operator.ANYOF,
          values: singlebunk
        }))
        invSingleBunkFldObj.defaultValue = singlebunk;
      }
      if (invcolor != '') {
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_vm_exterior_color",
          operator: search.Operator.ANYOF,
          values: invcolor
        }))
        invColorFldObj.defaultValue = invcolor;
      }
      if (invyear != '') {
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_vm_model_year",
          operator: search.Operator.ANYOF,
          values: invyear
        }))
        invYearFldObj.defaultValue = invyear;
      }
      if (invbed != '') {
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_beds_ms_tm",
          operator: search.Operator.ANYOF,
          values: invbed
        }))
        invBedsFldObj.defaultValue = invbed;
      }
      if (invtruckready != '') {
        var _invtruckready = '';
        log.debug('invtruckready in filter1 ', invtruckready);
        log.debug('invtruckready in filter2 ', (invtruckready == 0));


        if (invtruckready == 0 || invtruckready == '0') {
          _invtruckready = 'F';
        } else if (invtruckready == 1) {
          _invtruckready = 'T';
        }
        log.debug('_invtruckready in filter ', _invtruckready);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_tm_truck_ready",
          operator: search.Operator.IS,
          values: [_invtruckready]
        }))
        invTruckReadyFldObj.defaultValue = invtruckready;
      }
      if (invapu != '') {
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_apu_ms_tm",
          operator: search.Operator.ANYOF,
          values: invapu
        }))
        invApuFldObj.defaultValue = invapu;
      }
      if (bodystyle != '') {
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_vm_body_style",
          operator: search.Operator.ANYOF,
          values: bodystyle
        }))
        invBodyStyleFldObj.defaultValue = bodystyle;
      }
      if (sfcustomer != '') {
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_customer",
          operator: search.Operator.ANYOF,
          values: sfcustomer
        }))
        invshCustomerFldObj.defaultValue = sfcustomer;
      }
      if (invtransm != '') {
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_vm_transmission_type",
          operator: search.Operator.ANYOF,
          values: invtransm
        }))
        invTransmissionFldObj.defaultValue = invtransm;
      }
      if (invsssize != '') {
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_sleeper_size_ms",
          operator: search.Operator.ANYOF,
          values: invsssize
        }))
        invsssizeFldObj.defaultValue = invsssize;
      }
      if (invstock != '') {
        // log.debug('vinID filters', vinID);
        vmSearchObj.filters.push(search.createFilter({
          name: "custrecord_advs_em_serial_number",
          operator: search.Operator.IS,
          values: invstock
        }))
        invStockFldObj.defaultValue = invstock;
      }
      /* if (invengine != '') {
          // log.debug('vinID filters', vinID);
          vmSearchObj.filters.push(search.createFilter({
            name: "custrecord_advs_sleeper_size_ms",
            operator: search.Operator.ANYOF,
            values: invengine
          }))
          invEngineFldObj.defaultValue = invengine;
        } */


      /* invStockFldObj,,,,,,
         ,,,,invTermsFldObj,
         ,,, */


      // ,,,invterms,,,,,,,, ,,




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
        modelFldObj.addSelectOption({
          value: result.getValue('internalId'),
          text: result.getValue('itemid')
        });
        return true;
      });

      return vmSearchObj;
    }

    function sourceLocation(LocationFieldObj, UserSubsidiary) { // Abdul
      LocationFieldObj.addSelectOption({
        value: "",
        text: ""
      });
      var locationSearchObj = search.create({
        type: "location",
        filters: [
          ["subsidiary", "anyof", UserSubsidiary]
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
        LocationFieldObj.addSelectOption({
          value: result.getValue('internalId'),
          text: result.getValue('name')
        });
        return true;
      });
    }

    function addCommasnew(x) {
      x = x.toString();
      var pattern = /(-?\d+)(\d{3})/;
      while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
      return x;
    }
    // Function to calculate the difference in days
    function calculateDays(startDate, Newdate) {
      const start = new Date(startDate);
      var end = new Date(Newdate);
      const differenceInMs = end - start;
      const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
      return differenceInDays;
    }
    var AuctionColorArr = new Array();

    function getAuctionColCodes() {
      var customrecord_auction_statusSearchObj = search.create({
        type: "customrecord_auction_status",
        filters: [
          ["isinactive", "is", "F"]
        ],
        columns: [
          search.createColumn({
            name: "internalid",
            label: "Internal ID"
          }),
          search.createColumn({
            name: "name",
            label: "Name"
          }),
          search.createColumn({
            name: "custrecord_advs_auction_bg_color",
            label: "Background color"
          }),
          search.createColumn({
            name: "custrecord_advs_auction_text_color",
            label: "Text color"
          })
        ]
      });

      customrecord_auction_statusSearchObj.run().each(function (result) {
        var StatusID = result.getValue('internalid');
        var name = result.getValue('name');
        var bgcolor = result.getValue('custrecord_advs_auction_bg_color');
        var textcolor = result.getValue('custrecord_advs_auction_text_color');
        if (AuctionColorArr[StatusID] != undefined && AuctionColorArr[StatusID] != null) {} else {
          AuctionColorArr[StatusID] = new Array;
          AuctionColorArr[StatusID]['name'] = name;
          AuctionColorArr[StatusID]['bgcolor'] = bgcolor;
          AuctionColorArr[StatusID]['textcolor'] = textcolor;
        }
        return true;
      });
    }
    var InsClaimColorArr = new Array();

    function getInsClaimColCodes() {
      var customrecord_auction_statusSearchObj = search.create({
        type: "customrecord_advs_claim_status",
        filters: [
          ["isinactive", "is", "F"]
        ],
        columns: [
          search.createColumn({
            name: "internalid",
            label: "Internal ID"
          }),
          search.createColumn({
            name: "name",
            label: "Name"
          }),
          search.createColumn({
            name: "custrecord_advs_claim_st_bg_color",
            label: "Background color"
          }),
          search.createColumn({
            name: "custrecord_advs_claim_st_text_color",
            label: "Text color"
          })
        ]
      });

      customrecord_auction_statusSearchObj.run().each(function (result) {
        var StatusID = result.getValue('internalid');
        var name = result.getValue('name');
        var bgcolor = result.getValue('custrecord_advs_claim_st_bg_color');
        var textcolor = result.getValue('custrecord_advs_claim_st_text_color');
        if (InsClaimColorArr[StatusID] != undefined && InsClaimColorArr[StatusID] != null) {} else {
          InsClaimColorArr[StatusID] = new Array;
          InsClaimColorArr[StatusID]['name'] = name;
          InsClaimColorArr[StatusID]['bgcolor'] = bgcolor;
          InsClaimColorArr[StatusID]['textcolor'] = textcolor;
        }
        return true;
      });
    }

    var RepoOfrColorArr = new Array();

    function getRepoOfrColCodes() {
      var customrecord_auction_statusSearchObj = search.create({
        type: "customrecord_advs_ofr_status",
        filters: [
          ["isinactive", "is", "F"]
        ],
        columns: [
          search.createColumn({
            name: "internalid",
            label: "Internal ID"
          }),
          search.createColumn({
            name: "name",
            label: "Name"
          }),
          search.createColumn({
            name: "custrecord_advs_ofr_st_bg_color",
            label: "Background color"
          }),
          search.createColumn({
            name: "custrecord_advs_ofr_st_text_color",
            label: "Text color"
          })
        ]
      });

      customrecord_auction_statusSearchObj.run().each(function (result) {
        var StatusID = result.getValue('internalid');
        var name = result.getValue('name');
        var bgcolor = result.getValue('custrecord_advs_ofr_st_bg_color');
        var textcolor = result.getValue('custrecord_advs_ofr_st_text_color');
        if (RepoOfrColorArr[StatusID] != undefined && RepoOfrColorArr[StatusID] != null) {} else {
          RepoOfrColorArr[StatusID] = new Array;
          RepoOfrColorArr[StatusID]['name'] = name;
          RepoOfrColorArr[StatusID]['bgcolor'] = bgcolor;
          RepoOfrColorArr[StatusID]['textcolor'] = textcolor;
        }
        return true;
      });
    }

    function toggleInventoryFilters(form, fields, displayarr) {
      try {
        //log.debug('fields', fields);
        for (var i = 0; i < fields.length; i++) {
          //log.debug('fields[i]',fields[i]);
          let field = form.getField({
            id: fields[i]
          }); // Retrieve the field by ID 
          if (field) {
            field.updateDisplayType({
              displayType: serverWidget.FieldDisplayType.HIDDEN
            });
          }


          for (var j = 0; j < displayarr.length; j++) {
            if (displayarr[j] == i) {
              //log.debug('fields[i]',fields[i]);
              let field = form.getField({
                id: fields[i]
              }); // Retrieve the field by ID 
              if (field) {
                field.updateDisplayType({
                  displayType: serverWidget.FieldDisplayType.NORMAL
                });
              }

            }
          }

        }


      } catch (e) {
        log.debug('error in toggleInventoryFilters', e.toString());
      }
    }

    function dynamicFields() {
      try {
        var arr = [];
        var obj = {};
        var newarr = [];
        var customrecord_filters_setupSearchObj = search.create({
          type: "customrecord_filters_setup",
          filters: [
            ["isinactive", "is", "F"],
            "AND",
            ["custrecord_field_display", "is", "T"]
          ],
          columns: [
            "custrecord_field_id",
            "custrecord_field_label",
            "custrecord_advs_filters_class"
          ]
        });
        var searchResultCount = customrecord_filters_setupSearchObj.runPaged().count;
        customrecord_filters_setupSearchObj.run().each(function (result) {
          // .run().each has a limit of 4,000 results
          var fieldid = result.getValue({
            name: 'custrecord_field_id'
          });
          var fieldLabel = result.getValue({
            name: 'custrecord_field_label'
          });
          var fieldGroup = result.getText({
            name: 'custrecord_advs_filters_class'
          });
          if (fieldGroup == 'Inventory') {
            obj['custpage' + fieldid.toLowerCase()] = fieldLabel;
            newarr.push('custpage' + fieldid.toLowerCase())
          } else if (fieldGroup == 'Reposession') {
            obj['custpage' + fieldid.toLowerCase()] = fieldLabel;
            newarr.push('custpage' + fieldid.toLowerCase())
          } else if (fieldGroup == 'Auction') {
            obj['custpage' + fieldid.toLowerCase()] = fieldLabel;
            newarr.push('custpage' + fieldid.toLowerCase())
          } else if (fieldGroup == 'Delivery Board') {
            obj['custpage' + fieldid.toLowerCase()] = fieldLabel;
            newarr.push('custpage' + fieldid.toLowerCase())
          }


          return true;
        });
        arr.push(obj);

        //log.debug('newarr',newarr);
        return newarr;
      } catch (e) {
        log.debug('error dynamicFields', e.toString());
      }
    }

    function discountsetup() {
      try {
        var customrecord_advs_disc_crit_listSearchObj = search.create({
          type: "customrecord_advs_disc_crit_list",
          filters: [
            ["isinactive", "is", "F"]
          ],
          columns: [
            "custrecord_advs_make", //model
            "custrecord_advs_model_year",
            "custrecord_advs_vm_mileage1",
            "custrecord_advs_cab_config",
            "custrecord_advs_days_since_ready",
            "custrecord_advs_location_disc",
            "custrecord_discount_amount"
          ]
        });
        var searchResultCount = customrecord_advs_disc_crit_listSearchObj.runPaged().count;
        log.debug("customrecord_advs_disc_crit_listSearchObj result count", searchResultCount);
        var discountData = [];
        customrecord_advs_disc_crit_listSearchObj.run().each(function (result) {
          // .run().each has a limit of 4,000 results
          var obj = {};
          obj.model = result.getValue({
            name: 'custrecord_advs_make'
          });
          obj.year = result.getValue({
            name: 'custrecord_advs_model_year'
          });
          obj.mileage = result.getValue({
            name: 'custrecord_advs_vm_mileage1'
          });
          obj.cabconfig = result.getValue({
            name: 'custrecord_advs_cab_config'
          });
          obj.dayssinceready = result.getValue({
            name: 'custrecord_advs_days_since_ready'
          });
          obj.location = result.getValue({
            name: 'custrecord_advs_location_disc'
          });
          obj.amount = result.getValue({
            name: 'custrecord_discount_amount'
          });
          discountData.push(obj);
          return true;
        });
        return discountData;
      } catch (e) {
        log.debug('error', e.toString());
      }
    }

    function transportFields() {
      try {
        var arr = [
		{
            "fieldlabel": "Edit",
            "fieldid": "custpage_tpt_edit",
            "fieldtype": "TEXT",
            "fieldsource": "",
            "rolerestiction": "",
            "displaytype": "NORMAL",

          }, {
            "fieldlabel": "Truck Status id",
            "fieldid": "custpage_tpt_truckstatus",
            "fieldtype": "TEXT",
            "fieldsource": "",
            "rolerestiction": "",
            "displaytype": "HIDDEN",

          },
          {
            "fieldlabel": "Truck Status",
            "fieldid": "custpage_tpt_truckstatus_text",
            "fieldtype": "TEXT",
            "fieldsource": "",
            "rolerestiction": "",
            "displaytype": "NORMAL",

          },
          {
            "fieldlabel": "Status id",
            "fieldid": "custpage_tpt_modulestatus",
            "fieldtype": "TEXT",
            "fieldsource": "",
            "rolerestiction": "",
            "displaytype": "HIDDEN",

          },
          {
            "fieldlabel": "Status",
            "fieldid": "custpage_tpt_modulestatus_text",
            "fieldtype": "TEXT",
            "fieldsource": "",
            "rolerestiction": "",
            "displaytype": "NORMAL",

          },
          {
            "fieldlabel": "Stock #",
            "fieldid": "custpage_tpt_stock",
            "fieldtype": "TEXT",
            "fieldsource": "",
            "rolerestiction": "",
            "displaytype": "NORMAL",

          },
          {
            "fieldlabel": "Notes",
            "fieldid": "custpage_tpt_notes",
            "fieldtype": "TEXT",
            "fieldsource": "",
            "rolerestiction": "",
            "displaytype": "NORMAL",

          },
          {
            "fieldlabel": "Location From",
            "fieldid": "custpage_tpt_locationfrom",
            "fieldtype": "TEXT",
            "fieldsource": "",
            "rolerestiction": "",
            "displaytype": "NORMAL",

          },
          {
            "fieldlabel": "Location To",
            "fieldid": "custpage_tpt_locationto",
            "fieldtype": "TEXT",
            "fieldsource": "location",
            "rolerestiction": "",
            "displaytype": "NORMAL",

          },
          {
            "fieldlabel": "Date Assigned",
            "fieldid": "custpage_tpt_dateassigned",
            "fieldtype": "TEXT",
            "fieldsource": "",
            "rolerestiction": "",
            "displaytype": "NORMAL",

          },
          {
            "fieldlabel": "Date Onsite",
            "fieldid": "custpage_tpt_onsite",
            "fieldtype": "TEXT",
            "fieldsource": "",
            "rolerestiction": "",
            "displaytype": "NORMAL",

          },
          {
            "fieldlabel": "VIN",
            "fieldid": "custpage_tpt_vin",
            "fieldtype": "TEXT",
            "fieldsource": "",
            "rolerestiction": "",
            "displaytype": "HIDDEN",

          },
		  {
            "fieldlabel": "TPTID",
            "fieldid": "custpage_tpt_id",
            "fieldtype": "TEXT",
            "fieldsource": "",
            "rolerestiction": "",
            "displaytype": "HIDDEN",

          }
        ];
        return arr;
      } catch (e) {
        log.debug('error', e.toString());
      }
    }
    var FieldIDARR = [];

    function renderFields(fieldsarr, fieldgroup, form) {

      try {
        var Transportsublist = form.addSublist({
          id: "custpage_sublist_transport",
          type: serverWidget.SublistType.LIST,
          label: "List",
          tab: "custpage_tpt_tab"
        });
        for (var i = 0; i < fieldsarr.length; i++) {
          try {

            if (fieldsarr[i].rolerestiction == '' || role == fieldsarr[i].rolerestiction) {
              var fieldsobja = Transportsublist.addField({
                id: fieldsarr[i].fieldid,
                type: serverWidget.FieldType[fieldsarr[i].fieldtype],
                label: fieldsarr[i].fieldlabel,
                source: fieldsarr[i].fieldsource,
                //container: fieldgroup
              });


              FieldIDARR.push(fieldsobja);

              /* if (fieldsarr[i].displaytype != '') {
                fieldsobja.updateDisplayType({
                  displayType: serverWidget.FieldDisplayType[fieldsarr[i].displaytype]
                }); //displaytype
              } */
              if (fieldsarr[i].displaytype == 'HIDDEN') {
                fieldsobja.updateDisplayType({
                  displayType: serverWidget.FieldDisplayType.HIDDEN
                });
              }
              if (fieldsarr[i].displaytype == 'DISABLED') {
                fieldsobja.updateDisplayType({
                  displayType: serverWidget.FieldDisplayType.DISABLED
                });
              }


            }

          } catch (e) {
            log.debug('error' + fieldsarr[i].fieldid, e.toString());
          }
        }

        // return FieldIDARR;
        return Transportsublist;
      } catch (e) {
        log.debug('errr', e.toString())
      }
    }

    function setTransportSublistData(data, sublist, fields,transportNotes) {
      try {
		  log.debug('data',data);
        var arrkeys = Object.keys(data[0]);
        var count = 0;

        for (var f = 0; f < data.length; f++) {
          for (var t = 0; t < arrkeys.length; t++) {
            if (data[f][arrkeys[t]] != '') {
				if(arrkeys[t] =='custpage_tpt_notes')
				{
					var tptid = data[f]['custpage_tpt_id'];
					 
					var NotestptArr = [];
					if (transportNotes[tptid] != null && transportNotes[tptid] != undefined) {
					  var Length = transportNotes[tptid].length;
					  for (var Len = 0; Len < Length; Len++) {
						if (transportNotes[tptid][Len] != null && transportNotes[tptid][Len] != undefined) {
						  var DateTime = transportNotes[tptid][Len]['DateTime'];
						  var Notes = transportNotes[tptid][Len]['Notes'];
						  var DataStore = DateTime + '-' + Notes;
						  NotestptArr.push(DataStore);
						}
					  }
					}
					sublist.setSublistValue({
					id: arrkeys[t],
					line: count,
					value: NotestptArr
				  });
				}else{
					sublist.setSublistValue({
					id: arrkeys[t],
					line: count,
					value: data[f][arrkeys[t]]
				  });
				}
              
            }

          }

          count++;
        }


      } catch (e) {
        log.debug('error', e.toString());
      }
    }

    function getTransportLines(tpttstatus,tptstatus,tptfloc,tpttloc,tptstock) {
      try {
        var transportSObj = search.create({
          type: "customrecord_advs_transport_dashb",
          filters: [
            ["isinactive", "is", "F"]
            /*"AND",
            ["custrecord_advs_transport_status_dash", "noneof", "11"]*/
          ],
          columns: [
            "custrecord_advs_truck_status_transport",
            "custrecord_advs_transport_status_dash",
            "custrecord_advs_stock_number_transport",
            "custrecord_advs_transport_notes",
            "custrecord_advs_transport_fromlocation",
            "custrecord_advs_transport_location_to",
            "custrecord_advs_date_assigned_transport",
            "custrecord_advs_date_on_site_transpo",
            "custrecord_vin_link",
            "internalid"
          ]
        });
		log.debug('tpttstatus',tpttstatus);
		 if (tpttstatus != '') { 
				transportSObj.filters.push(search.createFilter({
				  name: "custrecord_advs_truck_status_transport",
				  operator: search.Operator.ANYOF,
				  values: tpttstatus
				})) 
		 }
		 if (tptstatus != '') { 
				transportSObj.filters.push(search.createFilter({
				  name: "custrecord_advs_transport_status_dash",
				  operator: search.Operator.ANYOF,
				  values: tptstatus
				})) 
		 }
		 if (tptfloc != '') { 
				transportSObj.filters.push(search.createFilter({
				  name: "custrecord_advs_transport_fromlocation",
				  operator: search.Operator.ANYOF,
				  values: tptfloc
				})) 
		 }
		 if (tpttloc != '') { 
				transportSObj.filters.push(search.createFilter({
				  name: "custrecord_advs_transport_location_to",
				  operator: search.Operator.ANYOF,
				  values: tpttloc
				})) 
		 }
		 if (tptstock != '') { 
				transportSObj.filters.push(search.createFilter({
				  name: "custrecord_advs_stock_number_transport",
				  operator: search.Operator.IS,
				  values: tptstock
				})) 
		 }
        var searchResultCount = transportSObj.runPaged().count;
        log.debug("transportSObj result count", searchResultCount);
        var transarr = [];
        transportSObj.run().each(function (result) {
          // .run().each has a limit of 4,000 results
          var obj = {};

          obj.custpage_tpt_edit = '<a href="#" onclick="edittransportsheet(' + result.id + ')"> <i class="fa fa-edit" style="color:blue;"</i></a>';
          obj.custpage_tpt_truckstatus = result.getValue({
            name: 'custrecord_advs_truck_status_transport'
          }) || '';
          obj.custpage_tpt_truckstatus_text = result.getText({
            name: 'custrecord_advs_truck_status_transport'
          }) || '';
          obj.custpage_tpt_modulestatus = result.getValue({
            name: 'custrecord_advs_transport_status_dash'
          }) || '';
          obj.custpage_tpt_modulestatus_text = result.getText({
            name: 'custrecord_advs_transport_status_dash'
          }) || '';
          obj.custpage_tpt_stock = result.getValue({
            name: 'custrecord_advs_stock_number_transport'
          }) || '';
          obj.custpage_tpt_notes = result.getValue({
            name: 'custrecord_advs_transport_notes'
          }) || '';
          obj.custpage_tpt_locationfrom = result.getText({
            name: 'custrecord_advs_transport_fromlocation'
          }) || '';
          obj.custpage_tpt_locationto = result.getText({
            name: 'custrecord_advs_transport_location_to'
          }) || '';
          obj.custpage_tpt_dateassigned = result.getValue({
            name: 'custrecord_advs_date_assigned_transport'
          }) || '';
          obj.custpage_tpt_onsite = result.getValue({
            name: 'custrecord_advs_date_on_site_transpo'
          }) || '';
          obj.custpage_tpt_vin = result.getValue({
            name: 'custrecord_vin_link'
          }) || '';
		  obj.custpage_tpt_id = result.id || '';
          transarr.push(obj);
          return true;
        });
       // log.debug('transarr', transarr);
        return transarr;
      } catch (e) {
        log.debug('error', e.toString());
      }
    }

	function transportFilters(form,tpttstatus,tptstatus,tptfloc,tpttloc,tptstock)
	{
		try{
			var tptTruckStatusFldObj = form.addField({
			  id: "custpage_tpt_truckstatusf",
			  type: serverWidget.FieldType.SELECT,
			  label: "Truck Status",
			  source: "customlist_advs_reservation_status",
			  container: "custpage_fil_gp_tpt"
			});
			if (tpttstatus != "" && tpttstatus != undefined && tpttstatus != null) {
			  tptTruckStatusFldObj.defaultValue = tpttstatus
			}
			var tptStatusFldObj = form.addField({
			  id: "custpage_tpt_statusf",
			  type: serverWidget.FieldType.SELECT,
			  label: "Status",
			  source: "customlist_advs_transport_status_list",
			  container: "custpage_fil_gp_tpt"
			});
			if (tptstatus != "" && tptstatus != undefined && tptstatus != null) {
			  tptStatusFldObj.defaultValue = tptstatus
			}
			var tptfromlocFldObj = form.addField({
			  id: "custpage_tpt_flocf",
			  type: serverWidget.FieldType.SELECT,
			  label: "From Location",
			  source: "customlistadvs_list_physicallocation",
			  container: "custpage_fil_gp_tpt"
			});
			if (tptfloc != "" && tptfloc != undefined && tptfloc != null) {
			  tptfromlocFldObj.defaultValue = tptfloc
			}
			var tpttolocFldObj = form.addField({
			  id: "custpage_tpt_tlocf",
			  type: serverWidget.FieldType.SELECT,
			  label: "To Location",
			  source: "customlistadvs_list_physicallocation",
			  container: "custpage_fil_gp_tpt"
			});
			if (tpttloc != "" && tpttloc != undefined && tpttloc != null) {
			  tptfromlocFldObj.defaultValue = tpttloc
			}
			var tptstockFldObj = form.addField({
			  id: "custpage_tpt_stockf",
			  type: serverWidget.FieldType.TEXT,
			  label: "Stock",
			  source: "",
			  container: "custpage_fil_gp_tpt"
			});
			if (tptstock != "" && tptstock != undefined && tptstock != null) {
			  tptstockFldObj.defaultValue = tptstock
			}
		}catch(e){
			log.debug('error',e.toString());
		}
	}
	function getTransportNotesData() {
		var NoteDataforRep =[];
      var InsuranceNotesSearchObj = search.create({
        type: "customrecord_advs_transport_notes",
        filters: [
          ["isinactive", "is", "F"],
          "AND",
          ["custrecord_advs_tpt_note_parent_link", "noneof", "@NONE@"]
        ],
        columns: [
          search.createColumn({
            name: "custrecord_advs_tpt_note_date_time"
          }),
          search.createColumn({
            name: "custrecord_advs_tpt_note_notes"
          }),
          search.createColumn({
            name: "custrecord_advs_tpt_note_parent_link"
          })
        ]
      });
      var Len = 0;
      InsuranceNotesSearchObj.run().each(function (result) {
        var tptId = result.getValue('custrecord_advs_tpt_note_parent_link');
        var DateTime = result.getValue('custrecord_advs_tpt_note_date_time');
        var Notes = result.getValue('custrecord_advs_tpt_note_notes');
        if (NoteDataforRep[tptId] != null && NoteDataforRep[tptId] != undefined) {
          Len = NoteDataforRep[tptId].length;
        } else {
          NoteDataforRep[tptId] = new Array();
          Len = 0;
        }
        NoteDataforRep[tptId][Len] = new Array();
        NoteDataforRep[tptId][Len]['DateTime'] = DateTime;
        NoteDataforRep[tptId][Len]['Notes'] = Notes;
        return true;
      });
	 // log.debug('NoteDataforRep',NoteDataforRep);
	  return NoteDataforRep;
    }

    return {
      onRequest
    }
  });
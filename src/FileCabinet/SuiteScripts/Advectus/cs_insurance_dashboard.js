/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
 define(['N/error','N/url','N/currentRecord','N/format'],
    function (error,url,currentRecord,format) {
	function pageInit(context)
	{
    colorStatus(context);
    var sublistIds = [
        "custpage_sublist_custpage_subtab_60_plus",
        "custpage_sublist_custpage_subtab_0_7",
        "custpage_sublist_custpage_subtab_8_14",
        "custpage_sublist_custpage_subtab_15_30",
        "custpage_sublist_custpage_subtab_31_60",
        "custpage_sublist_custpage_subtab_all",
        "custpage_sublist_custpage_subtab_cpc"
    ]; 
    sublistIds.forEach(function(sublistId) {
        processSublist(context,sublistId);
    });
	}

    function colorStatus(context){
       // try{
           var record = context.currentRecord;
            var sublist="custpage_sublist_custpage_subtab_insur_claim";
            var lineCount = record.getLineCount({ sublistId:sublist});
            var obj = colorsForInventory();
            var colsToColor = 2;
            for (var L = 0; L < lineCount; L++) {
              var status = record.getSublistValue({sublistId: sublist,fieldId:"cust_fi_status_claim",line: L});//custpabe_m_status
                 if(status=="Pending Claim"){
                    applycolor( obj.BackGroundColPendingClaim, obj.TextCol,L,sublist,colsToColor);
                 }
                 else if(status=="Open Claim"){
                    applycolor(obj.BackGroundColOpenClaim, obj.TextCol,L,sublist,colsToColor);
                 } else if(status=="Closed Claim"){
                    applycolor( obj.BackGroundColClaimClosed, obj.TextCol,L,sublist,colsToColor);
                 }
            }
            for (var L = 0; L < lineCount; L++) {
              var yard = record.getSublistValue({sublistId: sublist,fieldId:"cust_fi_in_tow_yard",line: L});
                 if(yard=="Yes"){
                    colsToColor=15
                    applycolor( obj.yard,obj.TextCol,L,sublist,colsToColor);
                 }
                }
       // }catch(e)
        //{
        ////    log.debug('error',e.toString())
       // }
    }
    function applycolor(BackGroundCol,TextCol,L,elementid,colsToColor){
        var trDom = document.getElementById(elementid+'row' + L);
        var trDomChild = trDom.children;
            for (var t = 0; t < (trDomChild.length); t++) {
                    var tdDom = trDomChild[t];
                    var CheckField = tdDom.style.display;
                    if (CheckField != 'none') {
                        var StringToSet = "";
                        if (BackGroundCol != "" && BackGroundCol != " ") {
                            StringToSet += "background-color:" + BackGroundCol + "!important;font-weight:bold !important;";
                        }
                        if (TextCol != "" && TextCol != " ") {
                            //StringToSet += "color:" + TextCol + "!important; font-weight:bold !important;";
                        }
                        if (StringToSet != "" && StringToSet != " ") {
                            if(t==colsToColor){
                                tdDom.setAttribute('style', '' + StringToSet + '');
                            }
                        }
                    }
            }
    }
    function colorsForInventory() {
        var obj = {};
        obj.BackGroundColPendingClaim = "#ffc6ce"; // Light Pink
        obj.BackGroundColOpenClaim    = "#d5eaf8"; // Light Orange
        obj.BackGroundColWaitingForRepair = "#ffff00"; // Yellow
        obj.BackGroundColPendingPayment = "#d5eaf8"; // Light Blue
        obj.BackGroundColClaimClosed = "#d0cece"; // Grey
    
        obj.TextCol = "#000000"; // Default Text Color
        obj.yard = "#FF0000";
        return obj;
    }

    function processSublist(context,sublistId) {
        var record = context.currentRecord;
        var COuntt = record.getLineCount({ sublistId });
        var BackGroundCol = "red";
        var TranDate = new Date();

        for (var L = 0; L < COuntt; L++) {
            var lb_date = record.getSublistValue({
                sublistId: sublistId,
                fieldId: 'cust_fi_list_lib_date', 
                line: L
            });
    
            lb_date = new Date(lb_date);
    
            if (lb_date && lb_date < TranDate) {
                var trDom = document.getElementById(sublistId + 'row' + L);
                if (trDom) {
                    var trDomChild = trDom.children;
    
                    for (var t = 0; t < (trDomChild.length - 1); t++) {
                        var tdDom = trDomChild[t];
                        var CheckField = tdDom.style.display;
    
                        if (CheckField !== 'none') {
                            var StringToSet = "";
                            if (BackGroundCol) {
                                StringToSet += `color:${BackGroundCol}!important;font-weight:bold!important;`;
                            }
    
                            if (StringToSet) {
                                tdDom.setAttribute('style', StringToSet);
                            }
                        }
                    }
                }
            }
        }
    }

	function fieldChanged(context) {
		// no return value
		if(context.fieldId =='cust_email_type'){
			var currentRecord = context.currentRecord;
			var email_type = currentRecord.getValue({fieldId:'cust_email_type'});
			if(email_type){
				var suiteletURL = url.resolveScript({
					scriptId:'customscript_collection_dashboard_email',
					deploymentId: 'customdeploy_collection_dashboard_email' 
				});
			suiteletURL =suiteletURL+'&from='+email_type;
              window.addEventListener('beforeunload', function (event) {
  event.stopImmediatePropagation();
});
			window.open(suiteletURL, "_self", "width=550,height=510")
			}
			
		}
		if(context.fieldId =='cust_email_type_ptp'){
			var currentRecord = context.currentRecord;
			var email_type = currentRecord.getValue({fieldId:'cust_email_type_ptp'});
			if(email_type){
				var suiteletURL = url.resolveScript({
					scriptId:'customscript_advs_collection_ptp_email',
					deploymentId: 'customdeploy_advs_collection_ptp_email' 
				});
			suiteletURL =suiteletURL+'&from='+email_type;
			window.open(suiteletURL, "_self", "width=550,height=510")
			}
			
		}
	  }
    function sendemailinsu_expiring() {
		 var suiteletURL = url.resolveScript({
			scriptId:'customscript_advs_ss_expiring_ins_email',
			deploymentId: 'customdeploy_advs_ss_expiring_ins_email' 
        });
		suiteletURL =suiteletURL+'&from=1'
		window.open(suiteletURL, "_blank", "width=550,height=510")
       //window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1228&deploy=1' ,'_blank' ,"toolbar=no, scrollbars=yes,resizable=yes , left=500, width=800, height=400")
    }
	function sendemail1() {
		 var suiteletURL = url.resolveScript({
			scriptId:'customscript_collection_dashboard_email',
			deploymentId: 'customdeploy_collection_dashboard_email' 
        });
		suiteletURL =suiteletURL+'&from=0'
		window.open(suiteletURL, "_blank", "width=550,height=510")
       //window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1228&deploy=1' ,'_blank' ,"toolbar=no, scrollbars=yes,resizable=yes , left=500, width=800, height=400")
    }
	function sendemail1ptp() {
		 var suiteletURL = url.resolveScript({
			scriptId:'customscript_advs_collection_ptp_email',
			deploymentId: 'customdeploy_advs_collection_ptp_email' 
        });
		suiteletURL =suiteletURL+'&from=ptp'
		window.open(suiteletURL, "_blank", "width=550,height=510")
       //window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1228&deploy=1' ,'_blank' ,"toolbar=no, scrollbars=yes,resizable=yes , left=500, width=800, height=400")
    }
	function sendemail_8_14() {
		 var suiteletURL = url.resolveScript({
			scriptId:'customscript_collection_dashboard_email',
			deploymentId: 'customdeploy_collection_dashboard_email' 
        });
		suiteletURL =suiteletURL+'&from=2'
		window.open(suiteletURL, "_blank", "width=550,height=510")
       //window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1228&deploy=1' ,'_blank' ,"toolbar=no, scrollbars=yes,resizable=yes , left=500, width=800, height=400")
    }function sendemail_15_30() {
		 var suiteletURL = url.resolveScript({
			scriptId:'customscript_collection_dashboard_email',
			deploymentId: 'customdeploy_collection_dashboard_email' 
        });
		suiteletURL =suiteletURL+'&from=3'
		window.open(suiteletURL, "_blank", "width=550,height=510")
       //window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1228&deploy=1' ,'_blank' ,"toolbar=no, scrollbars=yes,resizable=yes , left=500, width=800, height=400")
    }function sendemail_30_60() {
		 var suiteletURL = url.resolveScript({
			scriptId:'customscript_collection_dashboard_email',
			deploymentId: 'customdeploy_collection_dashboard_email' 
        });
		suiteletURL =suiteletURL+'&from=4'
		window.open(suiteletURL, "_blank", "width=550,height=510")
       //window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1228&deploy=1' ,'_blank' ,"toolbar=no, scrollbars=yes,resizable=yes , left=500, width=800, height=400")
    }function sendemail_60_plus() {
		 var suiteletURL = url.resolveScript({
			scriptId:'customscript_collection_dashboard_email',
			deploymentId: 'customdeploy_collection_dashboard_email' 
        });
		suiteletURL =suiteletURL+'&from=5'
		window.open(suiteletURL, "_blank", "width=550,height=510")
       //window.open('https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1228&deploy=1' ,'_blank' ,"toolbar=no, scrollbars=yes,resizable=yes , left=500, width=800, height=400")
    }

	function opennewclaim()
	{
		debugger;
       var suiteletURL = url.resolveScript({
			scriptId:'customscript_advs_claim_entry_sheet',
			deploymentId: 'customdeploy_advs_claim_entry_sheet',
			 
        });
		window.open(suiteletURL, "_blank",  "width=1000, height=500" );
	}
	function sendExpiredEmail()
	{
		try{
			 var suiteletURL = url.resolveScript({
					scriptId:'customscript_insurance_dashboard_email_b',
					deploymentId: 'customdeploy_insurance_dashboard_email_b', 
				});
				suiteletURL += '&from=1';
		window.open(suiteletURL, "_blank",  "width=1000, height=500" );
		}catch(e)
		{
			log.debug('error',e.toString())
		}
	}
	function send1to3Email()
	{
		try{
			 var suiteletURL = url.resolveScript({
					scriptId:'customscript_insurance_dashboard_email_b',
					deploymentId: 'customdeploy_insurance_dashboard_email_b', 
				});
				suiteletURL += '&from=2';
		window.open(suiteletURL, "_blank",  "width=1000, height=500" );
		}catch(e)
		{
			log.debug('error',e.toString())
		}
	}
	function send4to7Email()
	{
		try{
			 var suiteletURL = url.resolveScript({
					scriptId:'customscript_insurance_dashboard_email_b',
					deploymentId: 'customdeploy_insurance_dashboard_email_b', 
				});
				suiteletURL += '&from=3';
		window.open(suiteletURL, "_blank",  "width=1000, height=500" );
		}catch(e)
		{
			log.debug('error',e.toString())
		}
	}
	function send8to14Email()
	{
		try{
			 var suiteletURL = url.resolveScript({
					scriptId:'customscript_insurance_dashboard_email_b',
					deploymentId: 'customdeploy_insurance_dashboard_email_b', 
				});
				suiteletURL += '&from=4';
		window.open(suiteletURL, "_blank",  "width=1000, height=500" );
		}catch(e)
		{
			log.debug('error',e.toString())
		}
	}function send15plusEmail()
	{
		try{
			 var suiteletURL = url.resolveScript({
					scriptId:'customscript_insurance_dashboard_email_b',
					deploymentId: 'customdeploy_insurance_dashboard_email_b', 
				});
				suiteletURL += '&from=5';
		window.open(suiteletURL, "_blank",  "width=1000, height=500" );
		}catch(e)
		{
			log.debug('error',e.toString())
		}
	}
	function searchhistoy(id)
	{
		debugger;
       var suiteletURL = url.resolveScript({
			scriptId:'customscript_advs_lease_agree_history',
			deploymentId: 'customdeploy_advs_lease_agree_history',
			 
        });
		suiteletURL +="&curREc="+id;
		window.open(suiteletURL, "_blank",  "width=1000, height=500" );
	}
   window.addEventListener('beforeunload', function (event) {
  event.stopImmediatePropagation();
});
    return { 
	 pageInit: pageInit,
	 fieldChanged:   fieldChanged,
        sendemailinsu_expiring: sendemailinsu_expiring,
      opennewclaim:opennewclaim,
	  sendemail1:sendemail1,
	  sendemail1ptp:sendemail1ptp,
	  sendemail_8_14:sendemail_8_14,
	  sendemail_15_30:sendemail_15_30,
	  sendemail_30_60:sendemail_30_60,
	  sendemail_60_plus:sendemail_60_plus,
	  sendExpiredEmail:sendExpiredEmail,
	  send1to3Email:send1to3Email,
	  send4to7Email:send4to7Email,
	  send8to14Email:send8to14Email,
	  send15plusEmail:send15plusEmail,
	  searchhistoy:searchhistoy
	  
    };
});
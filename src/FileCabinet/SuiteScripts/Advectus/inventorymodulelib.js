/**
 * @NApiVersion 2.1
 */
define(['N/ui/serverWidget','/SuiteBundles/Bundle 555729/advs_lib/src/advs_lib_default_funtions_v2.js'],
    
    (serverWidget,advsObj) => {

        const jsscriptlib = (form) => {
                var html_fld = form.addField({
                        id: 'custpage_custscript_module',
                        type: 'inlinehtml',
                        label: ' '
                });

                var inlineHTML = form.addField({
                        id: "custpage_inlinehtml_module",
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
                    "function changeRStatus(vinid,Status) {debugger;" +
                    "var left = (screen.width/2)-(300/2);" +
                    "var top = (screen.height/2);" +
                    "var url='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2646&deploy=1&vinid='+vinid+'&status='+Status;" +
                    "var targetWin = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,top=300,left=400,width=480,height=210');" +
                    "}" +
                    "function openAuctionNotes(auctid) {debugger;" +
                    "var left = (screen.width/2)-(300/2);" +
                    "var top = (screen.height/2);" +
                    "var url='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2650&deploy=1&auctid='+auctid;" +
                    "var targetWin = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,top=300,left=400,width=780,height=510');" +
                    "}" +
                    "function openRepoNotes(ofrid) {debugger;" +
                    "var left = (screen.width/2)-(300/2);" +
                    "var top = (screen.height/2);" +
                    "var url='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2648&deploy=1&ofrid='+ofrid;" +
                    "var targetWin = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,top=300,left=400,width=780,height=510');" +
                    "}" +
                    "function openTerminationNotes(ofrid) {debugger;" +
                    "var left = (screen.width/2)-(300/2);" +
                    "var top = (screen.height/2);" +
                    "var url='https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2647&deploy=1&ofrid='+ofrid;" +
                    "var targetWin = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,top=300,left=400,width=780,height=510');" +
                    "}" +
                    "function openRepoHistory(id) {debugger;" +
                    "var left = (screen.width/2)-(500/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var url='/app/site/hosting/scriptlet.nl?script=2649&deploy=1&ifrmcntnr=T&ofrid='+id;" +
                    "var targetWin = window.open (url,'notes' ,'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=700,top=200,left=200');" +
                    "}" +
                    "function openauctionHistory(id) {debugger;" +
                    "var left = (screen.width/2)-(500/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var url='/app/site/hosting/scriptlet.nl?script=2651&deploy=1&ifrmcntnr=T&auctid='+id;" +
                    "var targetWin = window.open (url,'notes' ,'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=700,top=200,left=200');" +
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
                    "function shownotesinventorysheet(id) {debugger;" +
                    "var left = (screen.width/2)-(500/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var url='/app/site/hosting/scriptlet.nl?script=2645&deploy=1&ifrmcntnr=T&vin='+id;" +
                    "var targetWin = window.open (url,'notes' ,'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=700, height=300,top=300,left=200');" +
                    "}" +
                    "function shownotestransportsheet(id) {debugger;" +
                    "var left = (screen.width/2)-(500/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var url='/app/site/hosting/scriptlet.nl?script=2639&deploy=1&ifrmcntnr=T&transport='+id;" +
                    "var targetWin = window.open (url,'notes' ,'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=700, height=300,top=300,left=200');" +
                    "}" +
                    "function showhistorytransportsheet(id) {debugger;" +
                    "var left = (screen.width/2)-(500/2);" +
                    "var top = (screen.height/2)-(500/2);" +
                    "var url='/app/site/hosting/scriptlet.nl?script=2640&deploy=1&ifrmcntnr=T&transport='+id;" +
                    "var targetWin = window.open (url,'notes' ,'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=700,top=200,left=200');" +
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

        }


        return {jsscriptlib}

    });

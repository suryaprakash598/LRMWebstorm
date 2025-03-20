/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord','N/url','N/https','N/email'],
/**
 * @param{currentRecord} currentRecord
 * @param{runtime} runtime
 * @param{search} search
 */
function(currentRecord,url,https,email) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
		 
		jQuery('#custpage_send_email').attr('style','background-color: #c2cbc8 !important;top:860px !important;left:800px !important;position:absolute !important;color:white;padding:8px 30px !important;'); 
		  
		jQuery('#custpage_print_template').attr('style','background-color : #c2cbc8 !important;position:absolute !important;left:915px !important;top:860px !important;color:white;padding:8px 30px !important;'); 
		 

    }

      
    function saveRecord(scriptContext) {

    }


    function openModalDialog(urlop,Title,w,h){
        Ext.onReady(function() {
            Ext.create('Ext.window.Window', {
                title: Title,
                /* height: Ext.getBody().getViewSize().height*(-100),
                 width: Ext.getBody().getViewSize().width*0.8,*/
                height: h,
                width: w,
//            minWidth:'730',
//            minHeight:'450',
                layout: 'fit',
                itemId : 'popUpWin',
                modal:true,
                shadow:true,
                resizable:true,
                constrainHeader:true,
                items: [{
                    xtype: 'box',
                    autoEl: {
                        tag: 'iframe',
                        src: urlop,
                        frameBorder:'0'
                    }
                }]
            }).show();
        });

    }

    
    function calcFlexitotal(){
        var curRec  =   currentRecord.get();
        var flexiMac             =   "recmachcustrecord_advs_f_l_s_cnt_head";
        var curRec                      =   currentRecord.get();
        var schedules                   =    curRec.getLineCount({sublistId:flexiMac});

            var allSchedules = 0;var schedulesAmount=0;
            for(var m=0;m<schedules;m++){
                var lineSchedule    = curRec.getSublistValue({sublistId:flexiMac,fieldId:"custrecord_advs_f_l_s_schedules",line:m})*1;
                var lineamount      = curRec.getSublistValue({sublistId:flexiMac,fieldId:"custrecord_advs_f_l_s_amount",line:m})*1;
                    var tempTotal   =   lineSchedule*lineamount;
                    allSchedules+=lineSchedule;
                schedulesAmount+=tempTotal;
           }
            curRec.setValue({fieldId:"custrecord_advs_l_a_loan_amount",value:schedulesAmount});
            curRec.setValue({fieldId:"custrecord_advs_l_a_sch_num_f_pay",value:allSchedules});

    }

    
	function reposession(id,vin,repo){
        var PArabObj = {
           // "ifrmcntnr":"T",
            "custpara_stock":id,
            "custpara_vinid":vin,
            "custpara_repo":repo 

        };

        var urlop = url.resolveScript({
            scriptId: "customscript_advs_repossession_dashboard",
            deploymentId: "customdeploy_advs_repossession_dashboard",
            params: PArabObj
        });

        var Title = "Repossession";
        var w = screen.width - 200, h = 500;
window.open(urlop,'_blank');
       // openModalDialog(urlop, Title, w, h);
    }
	function printTemplate()
	{
		window.print();
	}
	function sendEmail()
	{
		try{
			var curRec      =   currentRecord.get();
			 var _body = curRec.getValue({fieldId:'custpage_htmlcontent'});
			 var recipientId = curRec.getValue({fieldId:'custpage_lesse'}); 
			 var recipientName = curRec.getText({fieldId:'custpage_lesse'}); 
			 
			email.send({
				author: 6,
				recipients: recipientId,
				subject: 'Lease Account Statement',
				body: _body 
			});
			alert('Email is sent to'+recipientName);
		}catch(e)
		{
			alert('Email Not Sent'+e.toString());
		}
		 
			
	}

    

    return {
        pageInit: pageInit, 
        printTemplate:printTemplate, 
		sendEmail:sendEmail
    };
    
});
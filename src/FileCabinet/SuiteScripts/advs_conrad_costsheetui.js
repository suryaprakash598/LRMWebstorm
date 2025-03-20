/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget','N/url'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, runtime, search, serverWidget,url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            var request    = scriptContext.request;
            var response   = scriptContext.response;

            if(request.method == "GET"){
                var form    =   serverWidget.createForm({title:"Repossession Dashboard",hideNavBar:false});

                var currScriptObj   =   runtime.getCurrentScript();  
                var stock  =   request.parameters.custpara_stock||''; 
				var userObj = runtime.getCurrentUser();
				var role =  userObj.role;
							 			
				 var apparatusfields = getApparatusChargesFields();
				 for(var i=0;i<apparatusfields.length;i++)
				 {
					 try{
						 
							if(apparatusfields[i].rolerestiction=='' || role== apparatusfields[i].rolerestiction)
							{
								form.addField({
								  id: apparatusfields[i].fieldid,
								  type: serverWidget.FieldType[apparatusfields[i].fieldtype],
								  label: apparatusfields[i].fieldlabel,
								  source:apparatusfields[i].fieldsource
								});
							}
						 
					 }catch(e)
					 {
						 log.debug('error',e.toString());
					 }
				 }
				 response.writePage(form);
			}
		}
		 function getApparatusChargesFields()
		 {
			 try{
				 var apparatusFields =
				 
				 [
					 {
						 "fieldlabel" 		:"Mfg Chassis",
						 "fieldid" 			:"custpage_mfg_chassis",
						 "fieldtype"		:"TEXT",
						 "fieldsource"		:"",
						 "rolerestiction"	:""
					 }, 
					 {
						 "fieldlabel" 		:"Mfg Chassis Handling",
						 "fieldid" 			:"custpage_mfg_chassis_handling",
						 "fieldtype"		:"TEXT",
						 "fieldsource"		:"",
						 "rolerestiction"	:""
					 },
					  
					 {
						 "fieldlabel" 		:"Mfg Body",
						 "fieldid" 			:"custpage_mfg_body",
						 "fieldtype"		:"TEXT",
						 "fieldsource"		:"",
						 "rolerestiction"	:""
					 },
					 
					 {
						 "fieldlabel" 		:"Mfg Aerial Handling",
						 "fieldid" 			:"custpage_mfg_aerial_handling",
						 "fieldtype"		:"TEXT",
						 "fieldsource"		:"",
						 "rolerestiction"	:""
					 },
					 
					 {
						 "fieldlabel" 		:"Mfg Options",
						 "fieldid" 			:"custpage_mfg_options",
						 "fieldtype"		:"TEXT",
						 "fieldsource"		:"",
						 "rolerestiction"	:""
					 },
					 
					 {
						 "fieldlabel" 		:"Mfg Admin Fees",
						 "fieldid" 			:"custpage_mfg_admin_fees",
						 "fieldtype"		:"TEXT",
						 "fieldsource"		:"",
						 "rolerestiction"	:""
					 },
					 
					 {
						 "fieldlabel" 		:"Mfg Surcharge",
						 "fieldid" 			:"custpage_mfg_admin_fees",
						 "fieldtype"		:"TEXT",
						 "fieldsource"		:"",
						 "rolerestiction"	:""
					 }, 
					 
					 {
						 "fieldlabel" 		:"Dealer (Net) Before Discounts",
						 "fieldid" 			:"custpage_dealer_before_discounts",
						 "fieldtype"		:"TEXT",
						 "fieldsource"		:"",
						 "rolerestiction"	:""
					 },
					 
					 {
						 "fieldlabel" 		:"Dealer Discount",
						 "fieldid" 			:"custpage_dealer_discount",
						 "fieldtype"		:"TEXT",
						 "fieldsource"		:"",
						 "rolerestiction"	:""
					 },
					 
					 {
						 "fieldlabel" 		:"Mfg Discount",
						 "fieldid" 			:"custpage_mfg_discount",
						 "fieldtype"		:"TEXT",
						 "fieldsource"		:"",
						 "rolerestiction"	:""
					 },
					 
					 {
						 "fieldlabel" 		:"Total Discount",
						 "fieldid" 			:"custpage_total_discount",
						 "fieldtype"		:"TEXT",
						 "fieldsource"		:"",
						 "rolerestiction"	:""
					 },
					 
					 {
						 "fieldlabel" 		:"Total Discount",
						 "fieldid" 			:"custpage_total_discount",
						 "fieldtype"		:"TEXT",
						 "fieldsource"		:"",
						 "rolerestiction"	:""
					 },
					
				 
				 
				 ];
				  
				return apparatusFields;
				 
				 
				 
			 }catch(e)
			 {
				 log.debug('error',e.toString());
			 }
		 }
		 
		 

        return {onRequest}

    });
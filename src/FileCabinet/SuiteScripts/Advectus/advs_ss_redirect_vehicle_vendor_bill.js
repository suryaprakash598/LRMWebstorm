/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 Oct 2021     Advectus
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){
	var form = nlapiCreateForm(' Advs Truck Vendor Bill', false); 

	var advsRecordReference= 'vendorbill'; 
	var fil = [];
	var col = [];

	fil.push(new nlobjSearchFilter('custrecord_advs_fm_record_ref', null, 'is', advsRecordReference));
	col.push(new nlobjSearchColumn('name'));
	col.push(new nlobjSearchColumn('custrecord_advs_fm_transaction_form_id'));
	col.push(new nlobjSearchColumn('custrecord_advs_fm_std_record_ref'));
	var search = nlapiSearchRecord('customrecord_advs_form_mapping',null, fil, col);

	var parameterfm='',recType = '',isfrom='';
	if(search!=null){
		if(search.length ==1){	
			recType		=	search[0].getValue('custrecord_advs_fm_std_record_ref');
			parameterfm	= 	search[0].getValue(col[1]);
          isfrom='vin';
		}
	}
	var Param	=	new Array();
	Param["cf"]	=	parameterfm;	
  Param["isfrom"]	=	isfrom;	
  
	nlapiSetRedirectURL("RECORD", recType, null, null, Param);
}
/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       06 Jun 2024     Rekha P
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type){
	if(type  == 'edit'){
        var internalId = nlapiGetFieldValue("id");
		
		var userId = nlapiGetUser();
	
        
         var checkUserLoggedIn = isUserLoggedIn(internalId)
		
         var checkCurrentUserLoggedInData = isCurrentUserLoggedIn(internalId,userId)

        if(checkCurrentUserLoggedInData.length > 0){
            var checkCurrentUserLoggedIn = checkCurrentUserLoggedInData[0].currentUserLoggedIn
            var currentUserLoggedName = checkCurrentUserLoggedInData[0].employeeName
        }else{
            var checkCurrentUserLoggedIn = false
            var currentUserLoggedName = ''
        }


     
        if(checkUserLoggedIn == true){
            if(checkCurrentUserLoggedIn == true){
                alert('Currently You are Editing The Order! Please Continue!')
            }else{
                alert(' User '+ currentUserLoggedName +' Already Editing The Order! Please wait...')
                var recordId = nlapiGetRecordId();
                var recordType = nlapiGetRecordType();
                var url = nlapiResolveURL('RECORD', recordType, recordId, 'VIEW');
                window.location.href = url
            }

        }
        if(checkUserLoggedIn == false && checkCurrentUserLoggedIn == false){
            var newRecord = nlapiCreateRecord('customrecord_advs_check_order_login_stat');
            newRecord.setFieldValue('custrecord_advs_check_data_orderno', internalId);
            newRecord.setFieldValue('custrecord_advs_check_data_is_clocked_in', 'T');
            newRecord.setFieldValue('custrecord_advs_check_data_employee_logg', userId);
            var recordId = nlapiSubmitRecord(newRecord);
        }
    } 
	
}




function isUserLoggedIn(internalId){

    var customrecord_advs_check_order_login_statSearch = nlapiCreateSearch("customrecord_advs_check_order_login_stat",
        [
            ["isinactive","is","F"],
            "AND",
            ["custrecord_advs_check_data_orderno","anyof",internalId],
            // "AND",
            // ["custrecord_advs_check_data_logged_date","within","today"],
            "AND",
            ["custrecord_advs_check_data_is_clocked_in","is","T"],
            "AND",
            ["custrecord_advs_check_data_is_clocked_ou","is","F"]
        ],
        [
            new nlobjSearchColumn("internalid")

        ]
    );

    var Run = customrecord_advs_check_order_login_statSearch.runSearch();
    var isLoggedIn = false;
    Run.forEachResult(function(result){
        isLoggedIn = true
        return true;
    });
	
    return isLoggedIn;
}

function isCurrentUserLoggedIn(internalId,userId){
	
    var customrecord_advs_check_order_login_statSearch = nlapiCreateSearch("customrecord_advs_check_order_login_stat",
        [
            ["isinactive","is","F"],
            "AND",
            ["custrecord_advs_check_data_orderno","anyof",internalId],
            "AND",
            ["custrecord_advs_check_data_logged_date","within","today"],
            "AND",
            ["custrecord_advs_check_data_is_clocked_in","is","T"],
            "AND",
            ["custrecord_advs_check_data_is_clocked_ou","is","F"]
        ],
        [
            new nlobjSearchColumn("scriptid").setSort(false),
            new nlobjSearchColumn("custrecord_advs_check_data_orderno"),
            new nlobjSearchColumn("custrecord_advs_check_data_logged_date"),
            new nlobjSearchColumn("custrecord_advs_check_data_logged_time"),
            new nlobjSearchColumn("custrecord_advs_check_data_is_clocked_in"),
            new nlobjSearchColumn("custrecord_advs_check_data_is_clocked_ou"),
            new nlobjSearchColumn("custrecord_advs_check_data_employee_logg")
        ]
    );

    var Run = customrecord_advs_check_order_login_statSearch.runSearch();
    var currentUserLoggedIn = false;
    var userStatusArray=new Array()

    Run.forEachResult(function(result){
        var loggedInUser = result.getValue('custrecord_advs_check_data_employee_logg')
        var loggedInUserName = result.getText('custrecord_advs_check_data_employee_logg')
		// alert("loggedInUser" +loggedInUser+ "loggedInUserName: " +loggedInUserName )

        var obj={}
        obj.employeeId=loggedInUser
        obj.employeeName=loggedInUserName

        if(loggedInUser == userId){
            currentUserLoggedIn = true
            obj.currentUserLoggedIn = true
        }else{
            obj.currentUserLoggedIn = false
        }
        userStatusArray.push(obj)
        return true;
    });

    return userStatusArray;
}
/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/search','N/record','N/format'], function(runtime,search,record,format) {

    function execute(context) {
        var currentrec = record.create({type: "customrecord_advs_st_current_date_time"});  
        var recordId = currentrec.save();   
        var loadedRec = record.load({ type: "customrecord_advs_st_current_date_time", id: recordId  }); 
        var currentdate= loadedRec.getValue({ fieldId: "custrecord_st_current_date"}); 
        var currentTime=loadedRec.getValue({ fieldId: "custrecord_st_current_time" });

        var formattedDate = format.format({ value: currentdate,  type: format.Type.DATE });
        var formattedTime = format.format({ value: currentTime, type: format.Type.TIMEOFDAY });
        
         // var concat = formattedDate + ' ' + formattedTime;
        // log.debug("concat",concat)  
        var timeAsDate = new Date(currentTime);
        timeAsDate.setMinutes(timeAsDate.getMinutes() - 15);
        var submin = format.format({ value: timeAsDate, type: format.Type.TIMEOFDAY});

        var concat = formattedDate + ' ' + submin;
            
        var statSearchObj = search.create({
            type: "customrecord_advs_check_order_login_stat",
            filters:
            [
               ["isinactive","is","F"], 
               "AND", 
               ["custrecord_advs_check_data_logged_time","onorbefore",concat], 
               "AND", 
               ["custrecord_advs_check_data_is_clocked_ou","is","F"]
            ],
            columns:
            [
               
               search.createColumn({name: "internalid", label: "Internal Id"}),
            //    search.createColumn({name: "custrecord_advs_check_data_logged_date", label: "Logged In Date"}),
            //    search.createColumn({name: "custrecord_advs_check_data_logged_time", label: "Logged In Time"}),
            //    search.createColumn({name: "custrecord_advs_check_data_is_clocked_in", label: "Is Clocked In "}),
               search.createColumn({name: "custrecord_advs_check_data_is_clocked_ou", label: "Is Clocked Out"}),
            //    search.createColumn({name: "custrecord_advs_check_data_employee_logg", label: "Current Emplyee"})
            ]
         });
         var searchResultCount = statSearchObj.runPaged().count;
         log.debug("statSearchObj result count",searchResultCount);
         statSearchObj.run().each(function(result){

            var  internalid= result.getValue({ name: "internalid"});  
            // var orderNumber = result.getValue({ name: "custrecord_advs_check_data_orderno" });
            // var loggedInDate = result.getValue({ name: "custrecord_advs_check_data_logged_date" });
            // var loggedInTime = result.getValue({ name: "custrecord_advs_check_data_logged_time" });
            // var isClockedIn = result.getValue({ name: "custrecord_advs_check_data_is_clocked_in" });
            var isClockedOut = result.getValue({ name: "custrecord_advs_check_data_is_clocked_ou" });
            // var currentEmployee = result.getValue({ name: "custrecord_advs_check_data_employee_logg" });

           
            record.submitFields({ type: 'customrecord_advs_check_order_login_stat', id:internalid,
            values: {'custrecord_advs_check_data_is_clocked_ou': true},
            options: { enableSourcing: false,ignoreMandatoryFields: true} });
            return true;
         }); 
    }
    return {
        execute: execute
    };
});



// var timeComponents = formattedTime.split(':');
// var hours = parseInt(timeComponents[0], 10);
// var minutes = parseInt(timeComponents[1], 10);
// var timeAsDate = new Date();
// timeAsDate.setHours(hours);
// timeAsDate.setMinutes(minutes - 15); 


// var adjustedTime = format.format({
//     value: timeAsDate,
//     type: format.Type.TIMEOFDAY
// });
// log.debug("Adjusted Time", adjustedTime);





// function formatTimeWithAMPM(hours, minutes) {
//     var period = hours < 12 ? 'AM' : 'PM';
//     if (hours === 0) {
//         hours = 12;
//     } else if (hours > 12) {
//         hours = hours - 12;
//     }
//     return hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + period;
// }

// var adjustedTimeWithAMPM = formatTimeWithAMPM(hours, minutes);
// log.debug("Adjusted Time (with AM/PM)", adjustedTimeWithAMPM);
// var ampm = adjustedTime + ' ' + (hours < 12 ? 'AM' : 'PM');
// log.debug("Adjusted Time (with AM/PM)", ampm)
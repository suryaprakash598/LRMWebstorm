/**
 * @NApiVersion 2.1
 */
define(['N/query', 'N/record', 'N/runtime', 'N/search', 'N/format', 'N/file','N/crypto'],
    /**
     * @param{query} query
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     */
    (query, record, runtime, search, format, file,crypto) => {
        function getClockInDetails(requestBody){
            log.debug('requestBody'  , requestBody)
            const mechanic = requestBody.mechanic
            const allJobAssigned = getClockedInJob(mechanic)
            const alreadyClockedInJob = getAlreadyClockedInJob(search, mechanic)
            log.debug( ' alreadyClockedInJob ' , alreadyClockedInJob)
            var groupedJobsByOrder = groupJobsByOrder(search, allJobAssigned)
            var finalObject = {}
            finalObject.groupedJobs = groupedJobsByOrder
            // finalObject.allJobs = allJobAssigned
            finalObject.alreadyClockedInJob = alreadyClockedInJob
            finalObject.clockInExist = getDayInDetails(mechanic)
            log.debug('finalObject -> ',finalObject);
            return finalObject
        }
        function setClockOutDetails(requestBody){
            let finalObject = getFinalClockOutData(requestBody, record, search,file)
            return finalObject
        }

        function setclockIN(requestBody){

            var salesorderID = requestBody.salesid;
            var repairJob    = requestBody.repairid;
            var mecId       = requestBody.mechanic;
            var CurrentDate = requestBody.currentdate;
            var CurrentTime = requestBody.currenttime;
            var MechJobLink = requestBody.mechjobid;
            var ChildId = requestBody.childid;
            var ClockedId= requestBody.ClockInLink;

            log.debug('ClockedId' , ClockedId + 'MechJobLink' + MechJobLink + 'salesorderID' +salesorderID)

            if(ClockedId > 0) {
                var lastClockData = getFinalClockOutDataNew(requestBody, record, search, file)
                log.debug(' lastClockData' , lastClockData)
            }

            log.debug('requestBody' , JSON.stringify(requestBody) +  'ClockedId' + ClockedId)

            var currentRecord = record.create({type:'customrecord_advs_st_current_date_time',isDynamic:true});
            var CurrentDate = currentRecord.getValue('custrecord_st_current_date');
            var CurrentTime = currentRecord.getValue('custrecord_st_current_time');

            log.debug("CurrentDate",CurrentDate)

            var Recordcr	=	record.create({type:'customrecord_advs_at_clock_in_out',isDynamic:true});
            Recordcr.setValue({fieldId:'custrecord_advs_cio_sales_order_link', value:(salesorderID*1)});
            Recordcr.setValue({fieldId:'custrecord_advs_cio_task_link', value: (repairJob*1)});
            Recordcr.setValue({fieldId:'custrecord_advs_cio_hidden_job_link', value: (repairJob*1)});
            Recordcr.setValue({fieldId:'custrecord_advs_cio_technician_name_1', value: (mecId*1)});
            Recordcr.setText('custrecord_advs_cio_clockin_date', CurrentDate);
            Recordcr.setText('custrecord_advs_cio_clockin_time', CurrentTime);
            Recordcr.setValue({fieldId:'custrecord_advs_cio_in_out_status', value: '1'});

            if(CheckAnd(MechJobLink)){
                Recordcr.setValue({fieldId:'custrecord_advs_cio_job_mechanic_link', value: MechJobLink});
            }

            var RecId =     Recordcr.save({ignoreMandatoryFields:true,enableSourcing:true});

            if(CheckAnd(RecId)){
                log.debug('Recid' , RecId)
                // Update the field value using record.submitFields
                record.submitFields({

                    type: 'customrecord_advs_mech_clock_in_child',
                    id: ChildId,
                    values: {
                        custrecord_advs_m_c_clockin: RecId
                    }
                });
            }

            if(repairJob){
                var TaskRec =   record.load({type:"customrecord_advs_task_record",id:repairJob});
                TaskRec.setValue({fieldId:'custrecord_st_r_t_status', value: 2});
                TaskRec.save({ignoreMandatoryFields:true,enableSourcing:true});
            }


            var Response = 'Clock in successfully done at ' + CurrentTime +'';
            Response += lastClockData
            var finalObject = {}
            finalObject.Response = Response
            log.debug(' * Clock In Response  Final Object* ', finalObject)
            return finalObject

        }

        function getDayInDetails(mechanic){
            var currentRecord = record.create({type:'customrecord_advs_st_current_date_time',isDynamic:true});
            var todaysDate = currentRecord.getValue('custrecord_st_current_date');

            var formattedDate = format.format({
                value: todaysDate,
                type: format.Type.DATE
            });

            // custrecord_st_current_date
            var anyJobClockedInSearch = search.create({
                type: "customrecord_advs_tech_day_in",
                filters:
                    [
                        ["custrecord_advs_date_day_in","on",formattedDate],
                        "AND",
                        ["custrecord32174","anyof",mechanic]
                    ],
                columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal ID"})
                    ]
            });
            var clockinResultCount = anyJobClockedInSearch.runPaged().count;
            log.debug("anyJobClockedInSearch result count",clockinResultCount);
            var clockInExist = false;
            if(clockinResultCount > 0){
                clockInExist = true
            }
            return clockInExist;
        }

        function getClockedInJob(mechanic){

            log.debug(' * Get Data Mechanic *', mechanic)

            var currentRecord = record.create({type:'customrecord_advs_st_current_date_time',isDynamic:true});
            var todaysDate = currentRecord.getValue('custrecord_st_current_date');
            var todaysTime = currentRecord.getValue('custrecord_st_current_time');

            //Get Task Record and push all orders to array

            var TaskRecordSearchAllJobs = search.create({
                type: "customrecord_advs_task_record",
                filters:
                    [
                        ["custrecord_advs_m_c_repair_task.custrecord_advs_m_c_mechanic","anyof",mechanic],
                        "AND",
                        ["isinactive","is","F"],
                        "AND",
                        ["custrecord_advs_st_r_t_work_ord_link.mainline","is","T"],
                        "AND",
                        ["custrecord_advs_st_r_t_work_ord_link.custbody_advs_st_work_order_status","noneof","9"],
                        "AND",
                        ["custrecord_st_r_t_status","noneof","5"],
                        "AND",
                        ["custrecord_advs_m_c_repair_task.custrecord_advs_t_c_c_job_finished","is","F"],
                        "AND",
                        ["custrecord_advs_st_r_t_work_ord_link.status","noneof","SalesOrd:C","SalesOrd:G","SalesOrd:H","SalesOrd:A"]
                    ],
                columns:
                    [
                        search.createColumn({name: "custrecord_advs_st_r_t_work_ord_link"}),//order number
                    ]
            });
            var searchResultCountAllJobs = TaskRecordSearchAllJobs.runPaged().count;

            log.debug( ' All Job List Data Count' , searchResultCountAllJobs)

            var allOrderArray  = new Array()
            TaskRecordSearchAllJobs.run().each(function(result){
                let orderid           =   result.getValue({name:"custrecord_advs_st_r_t_work_ord_link"})
                allOrderArray.push(orderid);
                return true
            })

            log.debug( ' All Order Data Count' , allOrderArray)

            var TaskRecordSearch = search.create({
                type: "customrecord_advs_task_record",
                filters:
                    [
                        ["custrecord_advs_m_c_repair_task.custrecord_advs_m_c_mechanic","anyof",mechanic],
                        "AND",
                        ["custrecord_advs_st_r_t_work_ord_link","anyof",allOrderArray],
                        "AND",
                        ["isinactive","is","F"],
                        "AND",
                        ["custrecord_advs_st_r_t_work_ord_link.mainline","is","T"],
                        "AND",
                        // ["custrecord_advs_st_r_t_work_ord_link.custbody_advs_st_work_order_status","noneof","9"],
                        // ["custrecord_st_r_t_status","noneof","5"],
                        // "AND",
                        ["custrecord_advs_m_c_repair_task.custrecord_advs_t_c_c_job_finished","is","F"],
                        "AND",
                        ["custrecord_advs_st_r_t_work_ord_link.status","noneof","SalesOrd:C","SalesOrd:G","SalesOrd:H","SalesOrd:A"]
                    ],
                columns:
                    [
                        search.createColumn({name: "internalid"}),//internalId
                        search.createColumn({name: "custrecord_advs_st_r_t_work_ord_link"}),
                        search.createColumn({name: "entity",join: "CUSTRECORD_ADVS_ST_R_T_WORK_ORD_LINK"}),
                        search.createColumn({name: "custbody_advs_st_service_equipment",join: "CUSTRECORD_ADVS_ST_R_T_WORK_ORD_LINK"}),
                        search.createColumn({name: "custbody_advs_st_search_serial_number",join: "CUSTRECORD_ADVS_ST_R_T_WORK_ORD_LINK"}),
                        search.createColumn({name: "custrecord_advs_job_qty_from_line"}),
                        search.createColumn({name: "custrecord_advs_operation_number"}),
                        search.createColumn({name:"custrecord_advs_st_r_t_cause"}),
                        search.createColumn({name:"custrecord_advs_st_r_t_compalin"}),
                        search.createColumn({name:"custrecord_advs_st_r_t_correction"}),
                        search.createColumn({name: "name"}),//name
                        search.createColumn({name:"custrecord_repair_desc"}),
                        search.createColumn({name:"custrecord_advs_repait_task_job_type"}),
                        search.createColumn({name:"custrecord_advs_repair_task_time"}),
                        search.createColumn({name:"custrecord_advs_st_r_t_actual"}),
                        search.createColumn({name: "trandate",join: "CUSTRECORD_ADVS_ST_R_T_WORK_ORD_LINK"}),
                        search.createColumn({name:"custrecord_st_r_t_status"}),
                        search.createColumn({name: "custrecord_st_j_s_color_code",join: "custrecord_st_r_t_status"}),
                        search.createColumn({name: "custrecord_advs_m_c_clockin",join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK"}),
                        search.createColumn({name: "internalid",join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK"}),
                        search.createColumn({name:"custrecord_advs_at_r_t_labor_time", label: "Total Goal Hours"}),
                        // search.createColumn({name: "custrecord_advs_at_j_a_f_file",join: "CUSTRECORD_ADVS_AT_J_A_F_JOB",label: "File"})
                        //

                    ]
            });

            var searchResultCount = TaskRecordSearch.runPaged().count;

            log.debug("TaskRecordSearch result count >>>>>",searchResultCount);

            var ClockedInJob    =   new Array();

            TaskRecordSearch.run().each(function(result){
                let job_id          =   result.getValue({name: "internalid"})
                let order_id        =   result.getValue({name: "custrecord_advs_st_r_t_work_ord_link"})
                let order_name      =   result.getText({name: "custrecord_advs_st_r_t_work_ord_link"})
                let customer        =   result.getText({name: "entity",join: "custrecord_advs_st_r_t_work_ord_link"})
                let vin             =   result.getText({name: "custbody_advs_st_service_equipment",join: "CUSTRECORD_ADVS_ST_R_T_WORK_ORD_LINK"})
                let stock           =   result.getValue({name: "custbody_advs_st_search_serial_number",join: "custrecord_advs_st_r_t_work_ord_link"})
                let qty             =   result.getValue({name: "custrecord_advs_job_qty_from_line"})
                let operation_no    =   result.getValue({name: "custrecord_advs_operation_number"})
                let cause           =   result.getValue({name:"custrecord_advs_st_r_t_cause"})
                let complaint       =   result.getValue({name:"custrecord_advs_st_r_t_compalin"})
                let correction      =   result.getValue({name:"custrecord_advs_st_r_t_correction"})
                let job_name        =   result.getValue({name: "name"})
                let description     =   result.getValue({name:"custrecord_repair_desc"})
                let child_job       =   result.getValue({name:"custrecord_advs_repait_task_job_type"})
                // let goal_hour       =   result.getValue({name:"custrecord_advs_repair_task_time"})
                let goal_hour       =   result.getValue({name:"custrecord_advs_at_r_t_labor_time"})
                let actual_hour     =   result.getValue({name:"custrecord_advs_st_r_t_actual"})
                if(!actual_hour){actual_hour = 0}
                actual_hour = actual_hour*1;
                actual_hour = actual_hour.toFixed(2);
                actual_hour = actual_hour + ' Hr'
                let tran_date       =   result.getValue({name: "trandate",join: "custrecord_advs_st_r_t_work_ord_link"})
                let task_status     =   result.getText({name: "custrecord_st_r_t_status"})
                let task_status_id  =   result.getValue({name: "custrecord_st_r_t_status"})
                let task_color      =   result.getValue({name: "custrecord_st_j_s_color_code",join: "custrecord_st_r_t_status"})
                let clock_in_link   =   result.getValue({name: "custrecord_advs_m_c_clockin",join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK"})
                let clock_in_child_id   =   result.getValue({name: "internalid",join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK"})
                let image_value = getImageValue(order_id, search, job_id)

                var columns = ['custrecord_advs_cio_clockin_date', 'custrecord_advs_cio_clockin_time','custrecord_advs_cio_color_code'];
                var last_clock_date = ''
                var last_clock_time = ''
                var actual_time = ''
                var clockin_color = ''
                var goal_hr = ''
                var actual_time_hr = ''
                var actual_time_min = ''

                if(clock_in_link){
                    var lookupResult = search.lookupFields({
                        type: 'customrecord_advs_at_clock_in_out',
                        id: clock_in_link,
                        columns: columns
                    });
                    last_clock_date = lookupResult.custrecord_advs_cio_clockin_date
                    last_clock_time = lookupResult.custrecord_advs_cio_clockin_time
                    clockin_color = lookupResult.custrecord_advs_cio_color_code
                    goal_hr = 0

                    if(!goal_hr){goal_hr = 0}
                    goal_hr = goal_hr*1;
                    goal_hr = goal_hr.toFixed(2);
                    goal_hr = goal_hr + ' Hr'

                    var clock_date_time = last_clock_date + ' ' + last_clock_time
                    var current_date_time = todaysTime

                    // Convert the date and time string to a JavaScript Date object
                    const date = new Date(clock_date_time);
                    // Convert the date to PDT
                    const clock_date_time_converted = new Date(date.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
                    const current_date_time_converted = current_date_time
                    // Convert date strings to JavaScript Date objects
                    const date1 = new Date(clock_date_time_converted);
                    const date2 = new Date(current_date_time_converted);

                    // Calculate the time difference in milliseconds
                    const timeDifferenceMs = Math.abs(date2 - date1);

                    // Calculate hours, minutes, and seconds from the time difference
                    const hours = Math.floor(timeDifferenceMs / 3600000); // 1 hour = 3600000 milliseconds
                    const minutes = Math.floor((timeDifferenceMs % 3600000) / 60000); // 1 minute = 60000 milliseconds
                    const seconds = Math.floor((timeDifferenceMs % 60000) / 1000); // 1 second = 1000 milliseconds

                    var actual_time  = `${hours} hours, ${minutes} minutes`
                    actual_time_hr = `${hours}`
                    actual_time_min = `${minutes}`

                }else{

                }

                var obj =   {};
                if(order_id){
                    obj.job_id          =   job_id;
                    obj.order_id        =   order_id;
                    obj.order_name      =   order_name;
                    obj.customer        =   customer;
                    obj.vin             =   vin;
                    obj.stock           =   stock;
                    obj.qty             =   qty;
                    obj.operation_no    =   operation_no;
                    obj.cause           =   cause;
                    obj.complaint       =   complaint;
                    obj.correction      =   correction;
                    obj.job_name        =   job_name
                    obj.description     =   description
                    obj.child_job       =   child_job
                    obj.goal_hour_repair    =   goal_hour
                    obj.goal_hour       = goal_hr
                    obj.actual_hour     =   actual_hour
                    obj.tran_date       =   tran_date
                    obj.task_status     =   task_status
                    obj.task_color      =   task_color
                    obj.clock_in_link   =   clock_in_link
                    obj.clock_in_child_id   =   clock_in_child_id
                    obj.last_clockdate  =   last_clock_date
                    obj.last_clocktime  =   last_clock_time
                    obj.actual_time = actual_time
                    obj.image_available = image_value
                    obj.mechanic = mechanic
                    obj.clockin_color = clockin_color
                    obj.actual_time_hr = actual_time_hr
                    obj.actual_time_min =actual_time_min
                    obj.task_status_id = task_status_id
                    ClockedInJob.push(obj)
                }

                // .run().each has a limit of 4,000 results
                return true;
            });
            return ClockedInJob
        }

        function setAttachment(requestBody){

            var attachment = requestBody.attachment;
            var base64file  =requestBody.base64file;
            var repairJob    = requestBody.repairid;
            var base64Image  = requestBody.attachmentbase64;
            var fileTypeValue    = requestBody.fileType;
            var folderId = 540;
            try {
                for (const selectedFile of base64Image) {

                    const fileValue = selectedFile.attachmentbase64
                    const fileTypeValue = selectedFile.fileType.split('/')[1];
                    const fileName = selectedFile.fileName

                    var binaryImage = ''
                    if(fileTypeValue == 'pdf'){

                        log.debug('* Creating PDF File*');

                        binaryImage = file.create({
                            name: "Repair_Job_"+fileName + '_' + repairJob+".pdf",
                            fileType: file.Type.PDF,
                            contents: fileValue,
                            isOnline: true
                        });
                    } else if (fileTypeValue == 'jpg' || fileTypeValue == 'jpeg' || fileTypeValue == 'png') {
                        log.debug('* Creating JPG File *');
                        binaryImage = file.create({
                            name: "Repair_Job_"+fileName + '_' + repairJob+".png",
                            fileType: file.Type.JPGIMAGE, // Make sure this value is correct
                            contents: fileValue,
                            isOnline: true
                        });
                    } else {
                        throw new Error('Invalid fileTypeValue: ' + fileTypeValue);
                    }


                    binaryImage.folder = folderId;
                    var fileId = binaryImage.save();

                    log.debug( ' fileId ' , fileId)

                    var recordType = 'customrecord_advs_at_job_attach_files';
                    var newRecord = record.create({
                        type: recordType,
                        isDynamic: true
                    });

                    newRecord.setValue('custrecord_advs_at_j_a_f_job', repairJob);
                    newRecord.setValue('custrecord_advs_at_j_a_f_file', fileId);

                    var WorkOrder = newRecord.getValue('custrecord_advs_at_j_a_f_workorder');
                    var newRecordId = newRecord.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });

                    log.debug(' * NewRecordId * ' , newRecordId + ' * WorkOrder * ' + WorkOrder)

                    if(newRecordId && WorkOrder) {
                        record.attach({
                            record: {type: 'file',id: fileId},
                            to: {type: 'salesorder',id: WorkOrder}
                        });
                    }

                    log.debug('fileId' + fileId)
                }

                var Response = 'Attached Successfully!'
                var finalObject = {}
                finalObject.Response = Response
                return finalObject

            } catch (e) {
                log.debug('Unexpected Error', e.toString());
            }
        }

        function setMechanicRecommendation(requestBody){

            var attachment      = requestBody.attachment;
            var repairJob       = requestBody.repairid;
            var orderid         = requestBody.orderid;
            var base64Image     = requestBody.attachmentbase64;
            var fileTypeValue   = requestBody.fileType;
            var recommendation  = requestBody.recommendation;
            var folderId = 540;

            log.debug( ' * fileTypeValue * ' , fileTypeValue + ' * recommendation Job * ' +  recommendation)

            try {
                var binaryImage = ''
                if(fileTypeValue == 'pdf'){

                    log.debug('* Creating PDF File*');

                    binaryImage = file.create({
                        name: "Repair_Job_"+repairJob+".pdf",
                        fileType: file.Type.PDF,
                        contents: base64Image,
                        isOnline: true
                    });
                } else if (fileTypeValue == 'jpg' || fileTypeValue == 'jpeg' || fileTypeValue == 'png') {
                    log.debug('* Creating JPG File fot Technician Image*');
                    binaryImage = file.create({
                        name: "Repair_Job_" + repairJob + ".png",
                        fileType: file.Type.JPGIMAGE, // Make sure this value is correct
                        contents: base64Image,
                        isOnline: true
                    });
                } else {
                    throw new Error('Invalid fileTypeValue: ' + fileTypeValue);
                }

                binaryImage.folder = folderId;
                var fileId = binaryImage.save();

                log.debug( '  binaryImage ' + binaryImage)

                var currentRecord = record.create({type:'customrecord_advs_st_current_date_time',isDynamic:true});
                var CurrentDate = currentRecord.getValue('custrecord_st_current_date');
                var CurrentTime = currentRecord.getValue('custrecord_st_current_time');

                log.debug("CurrentDate",CurrentDate +  ' File Id' +  fileId)

                var recordType = 'customrecord_advs_st_tech_recomm';
                var newRecord = record.create({
                    type: recordType,
                    isDynamic: true
                });

                // Set field values
                newRecord.setValue('custrecord_tec_recomm_st_date', CurrentDate);
                newRecord.setValue('custrecord_tec_recomm_st_time', CurrentTime);
                if(recommendation){
                    newRecord.setValue('custrecord_tec_recomm_st_recommendation', recommendation);
                }
                newRecord.setValue('custrecord_tec_recomm_st_order_link', orderid);
                newRecord.setValue('custrecord_advs_tech_recom_image', fileId);

                var newRecordId = newRecord.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });

                log.debug('Recommendation Attached' , newRecordId)

                var Response = 'Attached Successfully!'
                var finalObject = {}
                finalObject.Response = Response
                return finalObject
            } catch (e) {
                log.debug('Unexpected Error', e.toString());
            }
        }

        function setCCCUpdate(requestBody){

            var repairJob       = requestBody.repairid;
            var cause     = requestBody.cause;
            var complaint   = requestBody.complaint;
            var correction  = requestBody.correction;
            var valuesToUpdate = {};

            valuesToUpdate['custrecord_advs_st_r_t_cause'] = cause;
            valuesToUpdate['custrecord_advs_st_r_t_compalin'] = complaint;
            valuesToUpdate['custrecord_advs_st_r_t_correction'] = correction;

            if(repairJob){
                record.submitFields({
                    type: 'customrecord_advs_task_record',
                    id: repairJob,
                    values: valuesToUpdate,
                    options: { enableSourcing: true, ignoreMandatoryFields: true }
                });
            }

            var Response = 'Updated CCC Successfully!'
            var finalObject = {}
            finalObject.Response = Response
            return finalObject
        }

        function getJobImages(requestBody){

            var repairjob = requestBody.repairjob;
            var jsonresponse = requestBody.jsonresponse

            var customrecord_advs_task_recordSearchObj = search.create({
                type: "customrecord_advs_task_record",
                filters:
                    [
                        ["internalid","anyof",repairjob],
                        "AND",
                        ["isinactive","is","F"]
                    ],
                columns:
                    [
                        search.createColumn({name: "custrecord_advs_at_j_a_f_file",join: "CUSTRECORD_ADVS_AT_J_A_F_JOB",label: "File"})
                    ]
            });
            var searchResultCount = customrecord_advs_task_recordSearchObj.runPaged().count;
            var JobImageArray    =   new Array();
            var JobPdfArray      =   new Array();
            log.debug("customrecord_advs_task_recordSearchObj result count",searchResultCount);

            customrecord_advs_task_recordSearchObj.run().each(function(result){
                let image_id          =   result.getValue({name: "custrecord_advs_at_j_a_f_file",join: "CUSTRECORD_ADVS_AT_J_A_F_JOB"})
                // Load the file to get the file object
                const fileObj = file.load({
                    id: image_id,
                });

                var type = fileObj.fileType

                if(type == 'PDF'){
                    var main_url = "https://tstdrv1064792.app.netsuite.com"
                    var url = main_url+fileObj.url
                    JobPdfArray.push(url)
                }else{
                    var main_url = "https://tstdrv1064792.app.netsuite.com"
                    var url = main_url+fileObj.url
                    JobImageArray.push(url)
                }

                // .run().each has a limit of 4,000 results
                return true;
            });
            var finalArrayObject = new Array()
            var obj = {}
            obj.imageValue = JobImageArray
            obj.pdfValue    =  JobPdfArray
            finalArrayObject.push(obj)
            log.debug('finalArrayObject' , finalArrayObject)

            if(jsonresponse == true || jsonresponse == 'true'){
                return obj
            }else{
                return finalArrayObject

            }
        }

        function setJobBreak(requestBody){

            var order = requestBody.order;
            var jobid = requestBody.jobid;
            var clockinid = requestBody.clockinid;
            var status = requestBody.status;
            var remark = requestBody.remark;
            var correction = requestBody.correction;
            var mechanic = requestBody.mechanic

            log.debug('clockinid' , clockinid  + 'order' + order + ' jobid ' + jobid + 'STATUS' + status + 'corection   ****' + correction + ' ** mechanic **' + mechanic)

            if(clockinid){
                var currentRecord = record.create({type:'customrecord_advs_st_current_date_time',isDynamic:true});
                var CurrentDate = currentRecord.getValue('custrecord_st_current_date');
                var CurrentTime = currentRecord.getValue('custrecord_st_current_time');

                var recordId = 'customrecord_advs_at_clock_in_out'; // Record type ID
                var clockRecord = record.load({type: recordId,id: clockinid});

                var technicianId = clockRecord.getValue({ fieldId: 'custrecord_advs_cio_technician_name_1' });
                var clockoutTask = clockRecord.getValue({ fieldId: 'custrecord_advs_cio_task_link' });
                var jobMechLink = clockRecord.getValue({ fieldId: 'custrecord_advs_cio_job_mechanic_link' });
                var salesRep = clockRecord.getValue({ fieldId: 'custrecord_advs_t_c_i_o_salesrep' });
                var orderText = clockRecord.getText({ fieldId: 'custrecord_advs_cio_sales_order_link' });
                var orderValue = clockRecord.getValue({ fieldId: 'custrecord_advs_cio_sales_order_link' });

                var salesRepText = clockRecord.getText({ fieldId: 'custrecord_advs_t_c_i_o_salesrep' });

                clockRecord.setValue({fieldId: 'custrecord_advs_cio_comments',value: remark});
                clockRecord.setValue({fieldId: 'custrecord_advs_cio_clockout_date',value: CurrentDate});
                clockRecord.setValue({fieldId: 'custrecord_advs_cio_clockout_time',value: CurrentTime});
                clockRecord.setValue({fieldId: 'custrecord_advs_cio_in_out_status',value: '2'});

                log.debug('technicianId' , technicianId  + 'clockoutTask' + clockoutTask + ' jobMechLink ' + jobMechLink
                    + 'salesRep' + salesRep + 'orderText   ****' + orderText + 'salesRepText ' + salesRepText)

                var recId = clockRecord.save({enableSourcing: true,ignoreMandatoryFields: true});

                log.debug(' * recId *' , recId)
                log.debug(' * jobMechLink *' , jobMechLink)

                if (jobMechLink) {
                    var mechClockInChildRecordId = 'customrecord_advs_mech_clock_in_child'; // Record type ID
                    var fieldId = 'custrecord_advs_m_c_clockin';
                    var fieldValue = recId;

                    record.submitFields({
                        type: mechClockInChildRecordId,
                        id: jobMechLink,
                        values: {
                            [fieldId]: fieldValue
                        },
                        options: {
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        }
                    });
                }
                log.debug(' * status *' , status + ' * clockoutTask * ' + clockoutTask)

                if (status && clockoutTask) {
                    var taskRecordType = 'customrecord_advs_task_record'; // Record type ID
                    var taskRecordId = clockoutTask;

                    var taskRecord = record.load({
                        type: taskRecordType,
                        id: taskRecordId
                    });

                    taskRecord.setValue({
                        fieldId: 'custrecord_st_r_t_status',
                        value: status
                    });

                    var oldRemark = taskRecord.getValue({
                        fieldId: 'custrecord_advs_at_r_t_clock_out_comment'
                    });

                    if (oldRemark) {
                        // If the old remark is not empty, concatenate with the new Remarks
                        oldRemark = oldRemark + "++" + remark;
                    } else {
                        // If the old remark is empty, directly assign the new Remarks
                        oldRemark = remark;
                    }

                    taskRecord.setValue({
                        fieldId: 'custrecord_advs_at_r_t_clock_out_comment',
                        value: oldRemark
                    });

                    taskRecord.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
                }
                // updateDuration(recId);

                if (technicianId) {
                    var mechanicRecordType = 'customrecord_advs_mechanic'; // Record type ID
                    var mechanicRecordId = technicianId;

                    record.submitFields({
                        type: mechanicRecordType,
                        id: mechanicRecordId,
                        values: {
                            'custrecord_advs_last_clock_in_id': recId
                        },
                        options: {
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        }
                    });
                }

                //Create technician clock in value

                var Recordcr	=	record.create({type:'customrecord_advs_at_clock_in_out',isDynamic:true});
                Recordcr.setValue({fieldId:'custrecord_advs_cio_sales_order_link', value:(orderValue)});
                Recordcr.setValue({fieldId:'custrecord_advs_cio_task_link', value: (jobid)});
                Recordcr.setValue({fieldId:'custrecord_advs_cio_hidden_job_link', value: (jobid)});
                Recordcr.setValue({fieldId:'custrecord_advs_cio_technician_name_1', value: mechanic});
                Recordcr.setText('custrecord_advs_cio_clockin_date', CurrentDate);
                Recordcr.setText('custrecord_advs_cio_clockin_time', CurrentTime);
                Recordcr.setValue({fieldId:'custrecord_advs_cio_in_out_status', value: '3'});
                Recordcr.setValue({fieldId:'custrecord_advs_cio_job_break', value: true});


                log.debug('* Recid after new create jobMechLink *' , jobMechLink)

                if(CheckAnd(jobMechLink)){
                    Recordcr.setValue({fieldId:'custrecord_advs_cio_job_mechanic_link', value: jobMechLink});
                }

                var RecId =     Recordcr.save({ignoreMandatoryFields:true,enableSourcing:true});

                log.debug('* Recid after new create *' , RecId)

                if(CheckAnd(jobMechLink)){
                    log.debug('* Recid after new create submit fields new*' , jobMechLink +  ' Record Id' + RecId)

                    // Update the field value using record.submitFields
                    record.submitFields({
                        type: 'customrecord_advs_mech_clock_in_child',
                        id: jobMechLink,
                        values: {
                            custrecord_advs_m_c_clockin: RecId
                        }
                    });
                }

                if(jobid){
                    var TaskRec =   record.load({type:"customrecord_advs_task_record",id:jobid});
                    // TaskRec.setValue({fieldId:'custrecord_st_r_t_status', value: 2});
                    TaskRec.save({ignoreMandatoryFields:true,enableSourcing:true});
                }

                var Response = 'Job Break Updated Successfully'
                var finalObject = {}
                finalObject.Response = Response
                return finalObject

            }else{
                var Response = 'Job Id Not Found'
                var finalObject = {}
                finalObject.Response = Response
                return finalObject

            }

        }
        // custrecord_advs_mech_password

        function getLogin(requestBody){
            log.debug('requestBody Login' , requestBody)
            var email = requestBody.email;
            var username = requestBody.username;
            var password = requestBody.password;

            var mech_id = 0;
            var mechanic_search = search.create({
                type: "customrecord_advs_mechanic",
                filters:
                    [
                        ["isinactive","is","F"],
                        "AND",
                        ["custrecord_advs_mech_username", "is", username],
                        "AND",
                        ["custrecord_advs_mech_password","is",password]
                    ],
                columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal ID"})
                    ]
            });

            mechanic_search.run().each(function(result){
                // .run().each has a limit of 4,000 results
                mech_id= result.getValue({name:'internalid'});
                return true;
            });

            log.debug('mech_id', mech_id)
            if (mech_id != 0) {

                var obj1 = {};
                var jsonDataArray = new Array();
                var customrecord_advs_mechanicSearchObj = search.create({
                    type: "customrecord_advs_mechanic",
                    filters:
                        [
                            ["isinactive", "is", "F"],
                            "AND",
                            ["custrecord_advs_mech_username", "is", username]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({ name: "custrecord_advs_mech_location", label: "Location" }),
                            search.createColumn({
                                name: "custrecord_advs_cio_clockin_date",
                                join: "CUSTRECORD_ADVS_LAST_CLOCK_IN_ID",
                                label: "Clock In Date"
                            }),
                            search.createColumn({
                                name: "custrecord_advs_cio_clockin_time",
                                join: "CUSTRECORD_ADVS_LAST_CLOCK_IN_ID",
                                label: "Clock In Time"
                            }),
                            search.createColumn({ name: "custrecord_advs_last_clock_in_id", label: "Last Clock In Id" }),
                            search.createColumn({ name: "name", label: "Name" }), //
                            search.createColumn({ name: "custrecord_advs_mech_subs", label: "Subsidiary" }),
                            search.createColumn({ name: "custrecord_advs_mech_location", label: "Location" }),
                            search.createColumn({ name: "custrecord_advs_mech_email", label: "Clock In Mechanic Email" }),
                            search.createColumn({ name: "custrecord_advs_mech_emp_link", label: "Employee Link" })
                        ]
                });
                var searchResultCount = customrecord_advs_mechanicSearchObj.runPaged().count;
                log.debug("customrecord_advs_mechanicSearchObj result count", searchResultCount);
                if (searchResultCount > 0) {
                    customrecord_advs_mechanicSearchObj.run().each(function (result) {
                        // .run().each has a limit of 4,000 results
                        var Obj = {}
                        Obj.mechanic = result.getValue({ name: 'internalid' });
                        Obj.location = result.getValue({ name: 'custrecord_advs_mech_location' });
                        Obj.locationtext = result.getText({ name: 'custrecord_advs_mech_location' });
                        Obj.lastdate = result.getValue({ name: "custrecord_advs_cio_clockin_date", join: "CUSTRECORD_ADVS_LAST_CLOCK_IN_ID" });
                        Obj.lasttime = result.getValue({ name: "custrecord_advs_cio_clockin_time", join: "CUSTRECORD_ADVS_LAST_CLOCK_IN_ID" });
                        Obj.lastclock = result.getValue({ name: "custrecord_advs_last_clock_in_id" });
                        Obj.mechanicname = result.getValue({ name: "name" });
                        Obj.subsidiary = result.getValue({ name: "custrecord_advs_mech_subs" });
                        Obj.email = result.getValue({ name: "custrecord_advs_mech_email" });
                        Obj.empId = result.getValue({ name: "custrecord_advs_mech_emp_link" });

                        jsonDataArray.push(Obj);
                        return true;
                    });
                    obj1.status = 200
                    obj1.data = jsonDataArray
                } else {
                    obj1.status = 'No Data Found'
                    obj1.data = jsonDataArray

                }

                log.debug('Mechnaic Data', obj1)
                return obj1
            } else {
                var obj1 = {};
                obj1.status = 404
                obj1.data = []
                log.debug('Mechnaic Data', obj1)
                return obj1

            }
        }

        function getAlreadyClockedInJob(search, mechanic){

            var lastClockedInData = new Array ()

            var customrecord_advs_at_toyota_clock_in_outSearchObj = search.create({
                type: "customrecord_advs_at_clock_in_out",
                filters:
                    [
                        ["custrecord_advs_cio_technician_name_1","anyof",mechanic],
                        "AND",
                        ["isinactive","is","F"],
                        "AND",
                        ["custrecord_advs_cio_clockin_date","isnotempty",""],
                        "AND",
                        ["custrecord_advs_cio_clockout_date","isempty",""],
                        "AND",
                        ["custrecord_advs_cio_clockin_time","isnotempty",""],
                        "AND",
                        ["custrecord_advs_cio_clockout_time","isempty",""]
                    ],
                columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal ID"}),
                        search.createColumn({name: "custrecord_advs_cio_task_description"}),
                        search.createColumn({name: "custrecord_advs_cio_clockin_date"}),
                        search.createColumn({name: "custrecord_advs_cio_clockin_time"}),
                        search.createColumn({name: "custrecord_advs_cio_sales_order_link"}),
                        search.createColumn({name: "custrecord_advs_cio_clockout_date"}),
                        search.createColumn({name: "custrecord_advs_cio_clockout_time"}),
                        search.createColumn({name: "custrecord_advs_cio_job_break"}),
                        search.createColumn({name: "custrecord_advs_cio_task_link"}),
                        search.createColumn({name: "custrecord_advs_cio_color_code"}),
                        search.createColumn({name: "custrecord_advs_cio_hidden_job_link"}),
                        search.createColumn({name: "custrecord_advs_at_r_t_labor_time", join:"custrecord_advs_cio_task_link"}),
                        search.createColumn({name: "custrecord_st_r_t_status", join:"custrecord_advs_cio_task_link"}),
                        search.createColumn({name: "custrecord_st_r_t_status", join:"custrecord_advs_cio_hidden_job_link"}),

                    ]
            });

            var searchResultCount = customrecord_advs_at_toyota_clock_in_outSearchObj.runPaged().count;

            log.debug("customrecord_advs_at_toyota_clock_in_outSearchObj result count",searchResultCount);

            customrecord_advs_at_toyota_clock_in_outSearchObj.run().each(function(result){
                var ObjJob ={}
                ObjJob.id= result.getValue({name:'internalid'});
                ObjJob.description =  result.getValue({name:"custrecord_advs_cio_task_description"})
                ObjJob.clockindate= result.getValue({name:'custrecord_advs_cio_clockin_date'})
                ObjJob.clockintime = result.getValue({name:"custrecord_advs_cio_clockin_time"})
                ObjJob.clockoutdate = result.getValue({name:"custrecord_advs_cio_clockout_date"})
                ObjJob.clockouttime = result.getValue({name:"custrecord_advs_cio_clockout_time"})
                ObjJob.workorderId = result.getValue({name:"custrecord_advs_cio_sales_order_link"})
                ObjJob.workordername = result.getText({name:"custrecord_advs_cio_sales_order_link"})
                ObjJob.jobbreak = result.getValue({name:"custrecord_advs_cio_job_break"})
                ObjJob.tasklink = result.getValue({name:"custrecord_advs_cio_task_link"})
                ObjJob.tasklinktext = result.getText({name:"custrecord_advs_cio_task_link"})

                ObjJob.taskcolor = result.getValue({name:"custrecord_advs_cio_color_code"})
                ObjJob.hiddenjob = result.getValue({name:"custrecord_advs_cio_hidden_job_link"})
                ObjJob.hiddenjobtext = result.getText({name:"custrecord_advs_cio_hidden_job_link"})


                ObjJob.labourtime = result.getValue({name: "custrecord_advs_at_r_t_labor_time", join:"custrecord_advs_cio_task_link"})
                ObjJob.jobstatus = result.getValue({name: "custrecord_st_r_t_status", join:"custrecord_advs_cio_task_link"})
                ObjJob.hiddenjobstatus = result.getValue({name: "custrecord_st_r_t_status", join:"custrecord_advs_cio_hidden_job_link"})
                ObjJob.jobstatustext = result.getText({name: "custrecord_st_r_t_status", join:"custrecord_advs_cio_task_link"})
                ObjJob.hiddenjobstatustext = result.getText({name: "custrecord_st_r_t_status", join:"custrecord_advs_cio_hidden_job_link"})

                //GET ONLY ONE AND RETURN
                lastClockedInData.push(ObjJob);
                // log.debug('ObjJob' , ObjJob)
                return true;
            });

            return lastClockedInData
        }

        function getStatusList(requestBody){

            var statusData = new Array ()

            var statusSearch = search.create({
                type: "customrecord_advs_st_job_status",
                filters:
                    [

                        ["isinactive","is","F"]
                    ],
                columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal ID"}),
                        search.createColumn({name: "name", label: "Name"})
                    ]
            });
            var searchResultCount = statusSearch.runPaged().count;

            log.debug("statusSearch result count",searchResultCount);

            var finalObject = {}
            statusSearch.run().each(function(result){
                var ObjStatus ={}
                ObjStatus.id= result.getValue({name:'internalid'});
                ObjStatus.name= result.getValue({name:'name'});

                statusData.push(ObjStatus);
                return true;
            });
            finalObject.JobStatus = statusData
            return finalObject
        }

        function setClockInDetails(requestBody){
            var mechanic = requestBody.mechanicId
            var currentRecord = record.create({type:'customrecord_advs_st_current_date_time',isDynamic:true});
            var CurrentDate = currentRecord.getValue('custrecord_st_current_date');
            var CurrentTime = currentRecord.getValue('custrecord_st_current_time');

            var formattedDate = format.format({
                value: CurrentDate,
                type: format.Type.DATE
            });
            var currentRecord = record.create({type:'customrecord_advs_tech_day_in',isDynamic:true});
            currentRecord.setValue({
                fieldId: "custrecord32174",
                value: mechanic
            });

            currentRecord.setText({
                fieldId: "custrecord_advs_date_day_in",
                text: formattedDate
            });

            currentRecord.setText({
                fieldId: "custrecord_advs_time",
                text: CurrentTime
            });
            var recordSaved = currentRecord.save();
            log.debug( ' recordSaved ' , recordSaved)
            if (recordSaved){
                var Response = 'Day In successful'
                var finalObject = {}
                finalObject.Response = Response
                return finalObject
            }else{
                var Response = 'Failed'
                var finalObject = {}
                finalObject.Response = Response
                return finalObject
            }

        }

        function getInventoryDetails(requestBody){
            var orderId = requestBody.orderId;
            log.debug("orderId -> ",orderId);
            var finalObject = {};
            var salesorderSearchObj = search.create({
                type: "salesorder",
                filters:
                    [
                        ["type","anyof","SalesOrd"],
                        "AND",
                        ["internalid","anyof",orderId]
                    ],
                columns:
                    [
                        search.createColumn({name: "custcol_ps_inventory_type", label: "Inventory Type"}),
                        search.createColumn({name: "custcol_advs_repair_task_link", label: "Repair Job"}),
                        search.createColumn({name: "custcol_advs_line_job_name", label: "Repair Job Line"}),
                        search.createColumn({name: "item", label: "Item"}),
                        search.createColumn({name: "custrecord_advs_st_r_t_compalin", join: "CUSTCOL_ADVS_REPAIR_TASK_LINK", label: "Complaint"}),
                        search.createColumn({name: "custrecord_advs_st_r_t_correction", join: "CUSTCOL_ADVS_REPAIR_TASK_LINK", label: "Correction (Writer)"}),
                        search.createColumn({name: "custrecord_advs_st_r_t_cause", join: "CUSTCOL_ADVS_REPAIR_TASK_LINK", label: "Cause"}),
                        search.createColumn({name: "custrecord_advs_at_r_t_clock_out_comment", join: "CUSTCOL_ADVS_REPAIR_TASK_LINK", label: "Clock Out Comments"}),
                        search.createColumn({name: "custbody_advs_st_service_equipment", label: "Equipment"}),
                        search.createColumn({name: "custbody_advs_st_model_invoice", label: "Model (Invoice)"}),
                        search.createColumn({name: "custbody_advs_st_plate_number", label: "Plate #"}),
                        search.createColumn({name: "subsidiary", label: "Subsidiary"}),
                        search.createColumn({name: "location", label: "Location"}),
                        search.createColumn({name: "department", label: "Department"}),
                        search.createColumn({name: "salesdescription", join: "item", label: "Description"}),
                        search.createColumn({name: "quantity", label: "Quantity"}),
                        search.createColumn({name: "unit", label: "Units"}),
                        search.createColumn({name: "custrecord_advs_at_r_t_labor_time", join: "CUSTCOL_ADVS_REPAIR_TASK_LINK", label: "Clock Out Comments"}),


                    ]
            });
            var searchResultCount = salesorderSearchObj.runPaged().count;
            log.debug("salesorderSearchObj result count",searchResultCount);

            var inventroyTypeList = new Array();
            var repairJobList = new Array();
            var dataCaptured = false;
            salesorderSearchObj.run().each(function(result){

                var repairJobId      = result.getValue({name: "custcol_advs_repair_task_link", label: "Repair Job"});
                var repairJobName           = result.getText({name: "custcol_advs_repair_task_link", label: "Repair Job"});
                var repairJobNameLine= result.getValue({name: "custcol_advs_line_job_name", label: "Repair Job Line"});

                var inventoryType    = result.getValue({name: "custcol_ps_inventory_type", label: "Inventory Type"});
                var cause            = result.getValue({name: "custrecord_advs_st_r_t_cause", join: "CUSTCOL_ADVS_REPAIR_TASK_LINK", label: "Cause"});
                var complaint        = result.getValue({name: "custrecord_advs_st_r_t_compalin", join: "CUSTCOL_ADVS_REPAIR_TASK_LINK", label: "Complaint"});
                var correction       = result.getValue({name: "custrecord_advs_st_r_t_correction", join: "CUSTCOL_ADVS_REPAIR_TASK_LINK", label: "Correction (Writer)"});
                var comments         = result.getValue({name: "custrecord_advs_at_r_t_clock_out_comment", join: "CUSTCOL_ADVS_REPAIR_TASK_LINK", label: "Clock Out Comments"});
                var item                    = result.getText({name: "item", label: "Item"});
                var desc             = result.getValue({name: "salesdescription", join: "item", label: "Description"});
                var qty              = result.getValue({name: "quantity", label: "Quantity"});
                var unit             = result.getValue({name: "unit", label: "Units"});
               var goalhr             = result.getValue({name: "custrecord_advs_at_r_t_labor_time", join: "CUSTCOL_ADVS_REPAIR_TASK_LINK", label: "Goal Hr"});
                log.debug( '  inventoryType ' , inventoryType + ' dataCaptured ' + dataCaptured + ' goalhr >> ' + goalhr)
                if (inventoryType){
                    if (!dataCaptured){
                        log.debug( '  inventoryType ' , inventoryType + ' not dataCaptured ' + dataCaptured)

                        finalObject.vin = result.getText({name: "custbody_advs_st_service_equipment", label: "Equipment"});
                        finalObject.modelid = result.getValue({name: "custbody_advs_st_model_invoice", label: "Model (Invoice)"});
                        finalObject.modelName = result.getText({name: "custbody_advs_st_model_invoice", label: "Model (Invoice)"});
                        finalObject.subsidiaryId = result.getValue({name: "subsidiary", label: "Subsidiary"});
                        finalObject.subsidiaryName = result.getText({name: "subsidiary", label: "Subsidiary"});
                        finalObject.locationId = result.getValue({name: "location", label: "Location"});
                        finalObject.locationname = result.getText({name: "location", label: "Location"});
                        finalObject.departmentId = result.getValue({name: "department", label: "Department"});
                        finalObject.departmentName = result.getText({name: "department", label: "Department"});
                        var plate = result.getValue({name: "custbody_advs_st_plate_number", label: "Plate #"});
                        if(plate	==	null || plate	==	undefined || plate	==	'null' || plate	==	'undefined' ){
                            plate = "";
                        }
                        finalObject.plate = plate;
                        dataCaptured = true;
                    }

                    log.debug( ' repairJobNameLine ' , repairJobNameLine )

                    if (repairJobNameLine){
                        var obj =   {};
                        obj.repairJobId = repairJobId;
                        obj.repairJobName = repairJobName
                        obj.repairJobNameLine = repairJobNameLine
                        obj.inventoryType = inventoryType;
                        obj.cause = cause;
                        obj.complaint = complaint;
                        obj.correction = correction;
                        obj.comments = comments;
                        obj.item = item;
                        obj.desc = desc;
                        obj.qty = qty;
                        obj.unit = unit;
                        obj.goalhr = goalhr;
                        repairJobList.push(obj);

                    }else{
                        var obj =   {};
                        obj.item = item;
                        obj.desc = desc;
                        obj.qty = qty;
                        obj.unit = unit;
                        obj.goalhr = goalhr;
                        obj.inventoryType = inventoryType;
                        inventroyTypeList.push(obj);
                    }
                }

                return true;
            });
            finalObject.inventroyTypeList = inventroyTypeList;
            log.debug( ' repairJobList Before' , repairJobList)
            finalObject.groupedJobList = groupRepairJobsWithHeader(repairJobList);
            return finalObject

        }

        function groupRepairJobsWithHeader(repairJobList) {
            log.debug('repairJobList' , repairJobList);
            const groupedJobs = [];
            const tempGrouped = {};
            repairJobList.forEach(job => {
                if (!tempGrouped[job.repairJobNameLine]) {
                    tempGrouped[job.repairJobNameLine] = [];
                }
                tempGrouped[job.repairJobNameLine].push(job);
            });
            for (let repairJobNameLine in tempGrouped) {
                groupedJobs.push({
                    jobName: repairJobNameLine,
                    jobDetails: tempGrouped[repairJobNameLine]
                });
            }

            return groupedJobs;
        }

        function getTechnicianRecommendation(requestBody){

            var orderId = requestBody.orderid;
            log.debug( ' orderId ' , orderId)
            var TechImageArray =  new Array()
            var customrecord_advs_st_tech_recommSearchObj = search.create({
                type: "customrecord_advs_st_tech_recomm",
                filters:
                    [
                        ["isinactive","is","F"],
                        "AND",
                        ["custrecord_tec_recomm_st_order_link","anyof",orderId]
                    ],
                columns:
                    [
                        search.createColumn({name: "custrecord_tec_recomm_st_recommendation", label: "Recommendation"}),
                        search.createColumn({name: "custrecord_advs_tech_recom_image", label: "Image"})
                    ]
            });
            var searchResultCount = customrecord_advs_st_tech_recommSearchObj.runPaged().count;
            log.debug("customrecord_advs_st_tech_recommSearchObj result count",searchResultCount);
            customrecord_advs_st_tech_recommSearchObj.run().each(function(result){
                let image_id          =   result.getValue({name: "custrecord_advs_tech_recom_image"})
                let recommendation          =   result.getValue({name: "custrecord_tec_recomm_st_recommendation"})
                // Load the file to get the file object
                log.debug(' Image Id' , image_id +  ' Recommendation ' + recommendation)
                const fileObj = file.load({id: image_id})

                var main_url = "https://8760954.app.netsuite.com/"
                var url = main_url+fileObj.url
                var obj = {}
                obj.url = url
                obj.recommendation =  recommendation
                TechImageArray.push(obj)
                return true;
            });

            return TechImageArray
        }


        return {
            getClockInDetails:getClockInDetails,
            setClockOutDetails:setClockOutDetails,
            setclockIN:setclockIN,
            getClockedInJob:getClockedInJob,
            getAlreadyClockedInJob:getAlreadyClockedInJob,
            setAttachment:setAttachment,
            setMechanicRecommendation:setMechanicRecommendation,
            setCCCUpdate:setCCCUpdate,
            getJobImages:getJobImages,
            setJobBreak:setJobBreak,
            getLogin:getLogin,
            getStatusList:getStatusList,
            setClockInDetails:setClockInDetails,
            getInventoryDetails:getInventoryDetails,
            getTechnicianRecommendation:getTechnicianRecommendation
        }

    });

function getUnAssignedJob(search){

    var customrecord_advs_task_recordSearchObj = search.create({
        type: "customrecord_advs_task_record",
        filters:
            [
                ["isinactive","is","F"],
                "AND",
                ["custrecord_advs_st_r_t_work_ord_link.status","noneof","RevArrng:R","SalesOrd:C","SalesOrd:G","SalesOrd:H"],
                "AND",
                ["custrecord_advs_st_r_t_work_ord_link","noneof","@NONE@"],
                "AND",
                ["custrecord_advs_st_r_t_work_ord_link.trandate","within","thisfiscalquartertodate"],
                "AND",
                ["custrecord_advs_st_r_t_work_ord_link.location","anyof","8"],
                "AND",
                ["custrecord_advs_st_r_t_work_ord_link.mainline","is","T"]
            ],
        columns:
            [
                search.createColumn({name: "internalid", label: "Internal ID",sort:search.Sort.DESC}),
                search.createColumn({name: "name", label: "name"}),
                search.createColumn({name: "custbody_advs_st_service_equipment",join: "custrecord_advs_st_r_t_work_ord_link",label: "VIN"}),
                search.createColumn({name: "custrecord_advs_st_r_t_work_ord_link", label: "Repair Task Link"}),
                search.createColumn({name: "internalid", join:"CUSTRECORD_ADVS_M_C_REPAIR_TASK",label: "Mech Job ID"}),
            ]
    });
    var searchResultCount = customrecord_advs_task_recordSearchObj.runPaged().count;
    log.debug("customrecord_advs_task_recordSearchObj result count",searchResultCount);

    var UnAssignedData    =   new Array();

    customrecord_advs_task_recordSearchObj.run().each(function(result){
        let job_id          =   result.getValue({name: "internalid", label: "Internal ID"})
        let name           =   result.getValue({name: "name", label: "Name"})
        let vin             =   result.getText({name: "custbody_advs_st_service_equipment",join: "custrecord_advs_st_r_t_work_ord_link"});
        let order           =   result.getText({name: "custrecord_advs_st_r_t_work_ord_link", label: "Repair Task Link"});
        let orderid           =   result.getValue({name: "custrecord_advs_st_r_t_work_ord_link", label: "Repair Task Link"});
        let mechJob           =   result.getValue({name: "internalid", join:"CUSTRECORD_ADVS_M_C_REPAIR_TASK",label: "Mech Job ID"});

        var obj =   {};
        obj.job_id          =   job_id;
        obj.name            =   name;
        obj.vin             =   vin;
        obj.order           =   order;
        obj.mechjobid           =   mechJob;
        obj.orderid           =   orderid;


        UnAssignedData.push(obj)
        // .run().each has a limit of 4,000 results
        return true;
    });
    log.debug("UnAssignedData",UnAssignedData)
    return UnAssignedData
}

function getFinalClockOutData(requestBody, record, search, file){

    var AlreadyClockId = requestBody.ClockInLink

    log.debug(' ** AlreadyClockId ** ' , AlreadyClockId)



    var imageData = requestBody.uploadedImageURLs
    log.debug('* Image Url *' , imageData)
    var Remarks = ''
    var RemarkList = ''
    var CurrentDate = requestBody.clockEDate
    var CurrentTime = requestBody.clockETime
    var Response = "", RecId = "";

    var currentRecord = record.create({type:'customrecord_advs_st_current_date_time',isDynamic:true});
    var CurrentDate = currentRecord.getValue('custrecord_st_current_date');
    var CurrentTime = currentRecord.getValue('custrecord_st_current_time');

    //log.debug('AlreadyClockId Text' + AlreadyClockId + 'CurrentDate' + CurrentDate + 'CurrentTime' + CurrentTime)

    var Record = record.load({type: 'customrecord_advs_at_clock_in_out',id: AlreadyClockId,isDynamic: true});

    var TechnicianId = Record.getValue({ fieldId: 'custrecord_advs_cio_technician_name_1' });
    var ClockoutTask = Record.getValue({ fieldId: 'custrecord_advs_cio_task_link' });
    var JobMechLink = Record.getValue({ fieldId: 'custrecord_advs_cio_job_mechanic_link' });

    Record.setValue('custrecord_advs_cio_comments', Remarks);
    if (RemarkList) {
        Record.setValue('custrecord_advs_mech_reamrks', RemarkList);
    }

    Record.setText('custrecord_advs_cio_clockout_date', CurrentDate);
    Record.setText('custrecord_advs_cio_clockout_time', CurrentTime);
    Record.setValue('custrecord_advs_cio_in_out_status', '2');

    var RecId = Record.save({enableSourcing: true,ignoreMandatoryFields: true});
    log.debug(' ** RecId ** ' , RecId + ' ** JobMechLink ** ' + JobMechLink)

    //Set job mechanic in child record
    if (JobMechLink) {
        record.submitFields({
            type: 'customrecord_advs_mech_clock_in_child',
            id: JobMechLink,
            values: {'custrecord_advs_m_c_clockin': RecId},
            options: {enableSourcing: true,ignoreMandatoryFields: true}
        });
    }

    log.debug(' ** RecId ** ' , RecId + ' ** TechnicianId ** ' + TechnicianId)

    if (ClockoutTask) {
        // Using search.lookupFields to get the field value
        var customrecordData = search.lookupFields({
            type: 'customrecord_advs_at_clock_in_out',
            id: RecId,
            columns: 'custrecord_advs_cio_duration'
        });

        var Auctual = customrecordData.custrecord_advs_cio_duration;
        Auctual = ((Auctual * 1) / 60);
        Auctual = parseFloat(Auctual).toFixed(2);

        var TaskRecObj = record.load({ type: 'customrecord_advs_task_record', id: ClockoutTask, isDynamic: true });
        var srt = TaskRecObj.getValue('custrecord_advs_at_r_t_labor_time');
        TaskRecObj.setValue('custrecord_advs_st_r_t_srt', srt);
        TaskRecObj.setValue('custrecord_st_r_t_status', 5)

        var ExistActual = TaskRecObj.getValue('custrecord_advs_st_r_t_actual');
        if (!ExistActual) {
            ExistActual = 0;
        }

        var TotalActual = parseFloat(ExistActual) + parseFloat(Auctual);
        TotalActual = parseFloat(TotalActual).toFixed(2);
        TaskRecObj.setValue('custrecord_advs_st_r_t_actual', TotalActual);
        TaskRecObj.setValue('custrecord_advs_st_r_t_correct', requestBody.remarkJobFinish);
        TaskRecObj.setValue('custrecord_advs_tech_correc_finijob', requestBody.correctionJobFinish);

        log.debug(' ** requestBody.remarkJobFinish ** ' , requestBody.remarkJobFinish + ' ** requestBody.correctionJobFinish ** ' + requestBody.correctionJobFinish)


        TaskRecObj.save({ enableSourcing: true, ignoreMandatoryFields: true });

    }

    return 'Clock out successfully done at' + CurrentTime;
}

function getFinalClockOutDataNew(requestBody, record, search){

    log.debug('Clock Stop DATA')

    var AlreadyClockId = requestBody.ClockInLink
    var Remarks = requestBody.remark
    var RemarkList = requestBody.remarkList
    var correction = requestBody.correction
    var OrderStatus = requestBody.status
    var repairid = requestBody.repairid
    var MechanicId = requestBody.mechanic

    log.debug('status' , OrderStatus +  ' Remarks ' + Remarks + ' RemarkList ' + RemarkList + ' correction ' + correction)


    var CurrentDate = requestBody.clockEDate
    var CurrentTime = requestBody.clockETime
    var Response = "", RecId = "";

    var currentRecord = record.create({type:'customrecord_advs_st_current_date_time',isDynamic:true});
    var CurrentDate = currentRecord.getValue('custrecord_st_current_date');
    var CurrentTime = currentRecord.getValue('custrecord_st_current_time');

    log.debug('AlreadyClockId Text New' , AlreadyClockId + 'CurrentDate' + CurrentDate + 'CurrentTime' + CurrentTime)

    var Record = record.load({type: 'customrecord_advs_at_clock_in_out',id: AlreadyClockId,isDynamic: true});

    var TechnicianId = Record.getValue({ fieldId: 'custrecord_advs_cio_technician_name_1' });
    var ClockoutTask = Record.getValue({ fieldId: 'custrecord_advs_cio_task_link' });
    var JobMechLink = Record.getValue({ fieldId: 'custrecord_advs_cio_job_mechanic_link' });
    var CustomerName = Record.getText({fieldId : "company"});


    log.debug(' * TechnicianId Text New * ' , TechnicianId + ' * ClockoutTask * ' + ClockoutTask + '* JobMechLink *' + JobMechLink)

    Record.setValue('custrecord_advs_cio_comments', Remarks);
    if (RemarkList) {
        Record.setValue('custrecord_advs_mech_reamrks', RemarkList);
    }

    Record.setText('custrecord_advs_cio_clockout_date', CurrentDate);
    Record.setText('custrecord_advs_cio_clockout_time', CurrentTime);
    Record.setValue('custrecord_advs_cio_in_out_status', '2'); //Clock out

    var RecId = Record.save({enableSourcing: true,ignoreMandatoryFields: true});

    //Set job mechanic in child record
    if (JobMechLink) {
        record.submitFields({
            type: 'customrecord_advs_mech_clock_in_child',
            id: JobMechLink,
            values: {'custrecord_advs_m_c_clockin': RecId},
            options: {enableSourcing: true,ignoreMandatoryFields: true}
        });
    }

    if (OrderStatus == "5" || OrderStatus == 5) {
        log.debug(' * OrderStatus New *' , OrderStatus)

        // var TechCount = searchForTechnician(ClockoutTask, MechanicId);
        var TaskRec = record.load({
            type: "customrecord_advs_task_record",
            id: ClockoutTask,
            isDynamic: true
        });

        // if (TechCount == 0) {
        TaskRec.setValue({
            fieldId: "custrecord_st_r_t_status",
            value: OrderStatus
        });
        // }

        var oldRemark = TaskRec.getValue({
            fieldId: "custrecord_advs_at_r_t_clock_out_comment"
        });

        if (CheckAnd(oldRemark)) {

        } else {
            oldRemark = "";
        }

        oldRemark = oldRemark + "++" + Remarks;

        TaskRec.setValue({
            fieldId: "custrecord_advs_at_r_t_clock_out_comment",
            value: oldRemark
        });

        if (RemarkList) {
            TaskRec.setValue({
                fieldId: "custrecord_advs_at_r_t_remarks_type",
                value: RemarkList
            });
        }

        if (correction) {
            TaskRec.setValue({
                fieldId: "custrecord_advs_st_r_t_correction",
                value: correction
            });
            TaskRec.setValue({
                fieldId: "custrecord_advs_st_r_t_correction_mecha",
                value: correction
            });
        }

        TaskRec.save({
            enableSourcing: true,
            ignoreMandatoryFields: true
        });

    } else {
        log.debug('Status New OrderStatus' , OrderStatus + 'ClockoutTask' + ClockoutTask)
        if(ClockoutTask){
            var TaskRec = record.load({
                type: "customrecord_advs_task_record",
                id: ClockoutTask,
                isDynamic: true
            });

            TaskRec.setValue({
                fieldId: "custrecord_st_r_t_status",
                value: OrderStatus
            });

            var oldRemark = TaskRec.getValue({
                fieldId: "custrecord_advs_at_r_t_clock_out_comment"
            });

            if (CheckAnd(oldRemark)) {

            } else {
                oldRemark = "";
            }

            oldRemark = oldRemark + "++" + Remarks;

            TaskRec.setValue({
                fieldId: "custrecord_advs_at_r_t_clock_out_comment",
                value: oldRemark
            });

            if (RemarkList) {
                TaskRec.setValue({
                    fieldId: "custrecord_advs_at_r_t_remarks_type",
                    value: RemarkList
                });
            }

            if (correction) {
                TaskRec.setValue({
                    fieldId: "custrecord_advs_st_r_t_correction",
                    value: correction
                });
                TaskRec.setValue({
                    fieldId: "custrecord_advs_st_r_t_correction_mecha",
                    value: correction
                });
            }

            TaskRec.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });
        }
        log.debug('TaskRec Saved RemarkList' , RemarkList)
    }
    log.debug('After save technician' , TechnicianId)

    //Named function to update time in record individually
    // updateDuration(RecId, record);
    //Set technician in data to mechanic table

    if(JobMechLink) {
        record.submitFields({
            type: 'customrecord_advs_mech_clock_in_child',
            id: JobMechLink,
            values: {'custrecord_advs_m_c_clockin': RecId},
            options: {enableSourcing: true,ignoreMandatoryFields: true}
        });
    }

    log.debug('After save ClockoutTask' , ClockoutTask)


    if (ClockoutTask) {
        // Using search.lookupFields to get the field value
        var customrecordData = search.lookupFields({
            type: 'customrecord_advs_at_clock_in_out',
            id: RecId,
            columns: 'custrecord_advs_cio_duration'
        });

        var Auctual = customrecordData.custrecord_advs_cio_duration;
        Auctual = ((Auctual * 1) / 60);
        Auctual = parseFloat(Auctual).toFixed(2);
        var TaskRecObj = record.load({ type: 'customrecord_advs_task_record', id: ClockoutTask, isDynamic: true });
        var srt = TaskRecObj.getValue('custrecord_advs_at_r_t_labor_time');
        TaskRecObj.setValue('custrecord_advs_st_r_t_srt', srt);
        // TaskRecObj.setValue('custrecord_st_r_t_status', 5)

        var ExistActual = TaskRecObj.getValue('custrecord_advs_st_r_t_actual');
        if (!ExistActual) {
            ExistActual = 0;
        }

        var TotalActual = parseFloat(ExistActual) + parseFloat(Auctual);
        TotalActual = parseFloat(TotalActual).toFixed(2);
        TaskRecObj.setValue('custrecord_advs_st_r_t_actual', TotalActual);

        TaskRecObj.save({ enableSourcing: true, ignoreMandatoryFields: true });
    }

    return 'Clock out successfully done at' + CurrentTime;
}

function updateDuration(RecId, record) {
    log.debug('Updating duration')
    var rec = record.load({
        type: 'customrecord_advs_at_clock_in_out',
        id: RecId,
        isDynamic: true,
    });

    var startdate = rec.getValue('custrecord_advs_cio_clockin_date');
    var enddate = rec.getValue('custrecord_advs_cio_clockout_date');
    var starttime = rec.getValue('custrecord_advs_cio_clockin_time');
    var Cstarttime = convert_AMPM_TO_HHMM(starttime);
    var endtime = rec.getValue('custrecord_advs_cio_clockout_time');
    var Cendtime = convert_AMPM_TO_HHMM(endtime);

    var sdate = format.parse({
        value: startdate,
        type: format.Type.DATE,
    });
    var S_MONTH = sdate.getMonth();
    var S_YEAR = sdate.getFullYear();
    var S_DATE = sdate.getDate();

    var S_TIME = Cstarttime.split(':');
    var S_Hour = S_TIME[0];
    var S_Min = S_TIME[1];

    var edate = format.parse({
        value: enddate,
        type: format.Type.DATE,
    });
    var E_MONTH = edate.getMonth();
    var E_YEAR = edate.getFullYear();
    var E_DATE = edate.getDate();

    var E_TIME = Cendtime.split(':');
    var E_Hour = E_TIME[0];
    var E_Min = E_TIME[1];

    var timeStart = new Date(S_YEAR, S_MONTH, S_DATE, S_Hour, S_Min, 0);
    var timeEnd = new Date(E_YEAR, E_MONTH, E_DATE, E_Hour, E_Min, 0);

    var difference = timeEnd.getTime() - timeStart.getTime();

    var x = difference / 1000;
    var seconds = x % 60;
    x /= 60;
    var minutes = x;

    rec.setValue('custrecord_advs_cio_duration_in_minute', minutes);
    var ClockRecId = rec.save({
        enableSourcing: true,
        ignoreMandatoryFields: true,
    });
}

function CheckAnd(String) {

    if(String	!=	null && String	!=	undefined && String	!=	'' && String	!=	'null' && String	!=	'undefined' ){
        return 1;
    }else{
        return 0;
    }

}

function convert_AMPM_TO_HHMM(time) {
    log.debug('time >>> ' , time)
    var hours = Number(time.match(/^(\d\d?)/)[1]);
    var minutes = Number(time.match(/:(\d\d?)/)[1]);
    var AMPM = time.match(/\s(AM|PM|am|pm)$/i)[1];

    if ((AMPM == 'PM' || AMPM == 'pm') && hours<12)
    {
        hours = hours+12;
    }
    else if ((AMPM == 'AM' || AMPM == "am") && hours==12)
    {
        hours = hours-12;
    }

    var sHours = hours.toString();

    var sMinutes = minutes.toString();

    if(hours<10)
    {
        sHours = "0" + sHours;
    }
    if(minutes<10) {
        sMinutes = "0" + sMinutes;
    }

    return sHours + ":" + sMinutes;

}

function getAllJob(search){

    var customrecord_advs_mech_clock_in_childSearchObj = search.create({
        type: "customrecord_advs_mech_clock_in_child",
        filters:
            [
                ["isinactive","is","F"],
                "AND",
                ["custrecord_advs_m_c_mechanic","anyof","5"],
                "AND",
                ["custrecord_advs_m_c_start_date","within","thisfiscalyeartodate"]
            ],
        columns:
            [
                search.createColumn({name: "internalid", label: "Internal Id"}),
                search.createColumn({name: "custrecord_advs_m_c_repair_task", label: "Repair Task"}),
                search.createColumn({name: "custrecord_advs_m_c_start_date", label: "Start Date", sort:search.Sort.DESC}),
                search.createColumn({name: "custrecord_advs_m_c_start_time", label: "Start Time"}),
                search.createColumn({name: "custrecord_advs_m_c_end_date", label: "End Date"}),
                search.createColumn({name: "custrecord_advs_m_c_end_time", label: "End Time"}),
                search.createColumn({name: "custrecord_advs_m_c_clockin", label: "Clock In Link"}),
                search.createColumn({name: "custrecord_advs_cio_sales_order_link",join: "CUSTRECORD_ADVS_M_C_CLOCKIN",label: "Service Order Link"}),
                search.createColumn({
                    name: "custrecord_advs_st_r_t_cause",
                    join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK",
                    label: "Cause"
                }),
                search.createColumn({
                    name: "custrecord_advs_st_r_t_compalin",
                    join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK",
                    label: "Complaint"
                }),
                search.createColumn({
                    name: "custrecord_advs_st_r_t_correction",
                    join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK",
                    label: "Correction"
                })
            ]
    });
    var searchResultCount = customrecord_advs_mech_clock_in_childSearchObj.runPaged().count;
    log.debug("customrecord_advs_mech_clock_in_childSearchObj result count",searchResultCount);
    var AllJobData    =   new Array();

    customrecord_advs_mech_clock_in_childSearchObj.run().each(function(result){
        // .run().each has a limit of 4,000 results
        var obj =   {};
        obj.id          =   result.getValue({name: "internalid", label: "Internal ID"});
        obj.repairtaskid  =   result.getValue({name: "custrecord_advs_m_c_repair_task"});
        obj.repairtasktext  =   result.getText({name: "custrecord_advs_m_c_repair_task"});
        obj.startdate   =   result.getValue({name: "custrecord_advs_m_c_start_date"});
        obj.starttime   =   result.getValue({name: "custrecord_advs_m_c_start_time"});
        obj.enddate     =   result.getValue({name: "custrecord_advs_m_c_end_date"});
        obj.endtime     =   result.getValue({name: "custrecord_advs_m_c_end_time"});
        obj.clockinid   =   result.getValue({name: "custrecord_advs_m_c_clockin"});
        obj.order       =   result.getText({name: "custrecord_advs_cio_sales_order_link",join: "CUSTRECORD_ADVS_M_C_CLOCKIN"});
        let clockin     =   result.getValue({name: "custrecord_advs_m_c_clockin"});
        if(clockin){
            obj.clockin     =   true
        }else{
            obj.clockin     =   false
        }
        obj.cause   =   result.getValue({name: "custrecord_advs_st_r_t_cause",join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK"});
        obj.complaint   =   result.getValue({name: "custrecord_advs_st_r_t_compalin",join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK"});
        obj.correction   =   result.getValue({name: "custrecord_advs_st_r_t_correction",join: "CUSTRECORD_ADVS_M_C_REPAIR_TASK"});

        AllJobData.push(obj)
        // .run().each has a limit of 4,000 results
        return true;
    });

    log.debug("AllJobData",AllJobData)
    return AllJobData
}

function getImageValue(orderid, search,job_id){
    var count = 0

    if(job_id) {
        var customrecord_advs_at_job_attach_filesSearchObj = search.create({
            type: "customrecord_advs_at_job_attach_files",
            filters:
                [
                    ["isinactive","is","F"],
                    "AND",
                    ["custrecord_advs_at_j_a_f_job","anyof",job_id]
                ],
            columns:
                [
                    search.createColumn({
                        name: "custrecord_advs_at_j_a_f_workorder",
                        summary: "COUNT",
                        label: "Work Order"
                    })
                ]
        });
        var searchResultCount = customrecord_advs_at_job_attach_filesSearchObj.runPaged().count;
        customrecord_advs_at_job_attach_filesSearchObj.run().each(function(result){
            // .run().each has a limit of 4,000 results
            count =   result.getValue({ name: "custrecord_advs_at_j_a_f_workorder",summary: "COUNT"})
            return true;
        });
    }
    return count
}

function groupJobsByOrder(search,allJobs) {
    // Initialize an empty array to hold grouped orders
    var groupedOrders = [];

    // Group by order_id and structure the result
    allJobs.forEach(function (job) {
        // Find if the current order_id already exists in groupedOrders
        var existingOrder = groupedOrders.find(function (order) {
            return order.order_id === job.order_id;
        });

        var customrecord_advs_at_clock_in_outSearchObj = search.create({
            type: "customrecord_advs_at_clock_in_out",
            filters:
                [
                    ["custrecord_advs_cio_sales_order_link","anyof",job.order_id],
                    "AND",
                    ["custrecord_advs_cio_task_link","anyof",job.job_id],
                    "AND",
                    ["custrecord_advs_cio_job_break","is","F"]
                ],
            columns:
                [
                    search.createColumn({
                        name: "custrecord_advs_cio_duration",
                        summary: "SUM",
                        label: "Duration"
                    })
                ]
        });
        var jobActiveMinutes = 0;
        // var searchResultCount = customrecord_advs_at_clock_in_outSearchObj.runPaged().count;
        customrecord_advs_at_clock_in_outSearchObj.run().each(function(result){
            // .run().each has a limit of 4,000 results
            var minutes = result.getValue({name: "custrecord_advs_cio_duration",summary: "SUM",label: "Duration"})
            jobActiveMinutes = minutes * 1
            if (minutes == ""){
                jobActiveMinutes = 0
            }
            return true;
        });
        var hoursAndMinutes = "00:00 Hr"
        var auctualTotalTimeConsumed = 0

        var hours = (job.actual_time_hr * 1) * 60
        var min = job.actual_time_min * 1

        auctualTotalTimeConsumed = hours + min
        if (job.task_status_id == 2 || job.task_status_id == "2"){
            jobActiveMinutes = jobActiveMinutes + hours + min
        }
        if (jobActiveMinutes > 0){

            const hours = Math.floor(jobActiveMinutes / 60);
            const minutes = (jobActiveMinutes % 60).toString().padStart(2, '0');

            hoursAndMinutes = hours + ':' + minutes + 'Hr'
        }

        var goalHrJob = job.goal_hour_repair * 1

        var goalHrJobInMins = 0
        if (goalHrJob > 0){

            var intHrs = parseInt(goalHrJob*1)
            var minutes = ((goalHrJob - intHrs))

            minutes = Math.round(minutes * 100)
            goalHrJobInMins = ((intHrs * 60) + minutes)

        }


        log.debug( ' job.order_name ' +  job.order_name)
        log.debug(' * active minutes *' , jobActiveMinutes )

        log.debug(' * assigned *' , goalHrJobInMins )


        var efficiencyPercentage = ((goalHrJobInMins / jobActiveMinutes) * 100).toFixed(2)

        if ((efficiencyPercentage == "NaN") || (efficiencyPercentage == "Infinity")){
            efficiencyPercentage = 0
        }
        if (goalHrJobInMins < jobActiveMinutes){
            efficiencyPercentage = efficiencyPercentage * -1
        }
        log.debug(' * efficiencyPercentage *' , efficiencyPercentage )

        var goalHoursInWholeNum = (job.goal_hour_repair * 1).toFixed(2);

        var convertedGoalTmStr = formatToTimeString(goalHoursInWholeNum * 1)

        if (!existingOrder) {
            // If order does not exist, create a new order object
            var newOrder = {
                order_id: job.order_id,
                order_name: job.order_name,
                customer: job.customer,
                stock: job.stock,
                jobs: [] // Initialize jobs array
            };

            // Push the current job into the jobs array
            newOrder.jobs.push({
                order_id: job.order_id,
                order_name: job.order_name,
                customer: job.customer,
                stock: job.stock,
                job_id: job.job_id,
                vin: job.vin,
                qty: job.qty,
                operation_no: job.operation_no,
                cause: job.cause,
                complaint: job.complaint,
                correction: job.correction,
                job_name: job.job_name,
                description: job.description,
                child_job: job.child_job,
                goal_hour_repair: convertedGoalTmStr,
                goal_hour: job.goal_hour,
                actual_hour: job.actual_hour,
                tran_date: job.tran_date,
                task_status: job.task_status,
                task_color: job.task_color,
                clock_in_link: job.clock_in_link,
                clock_in_child_id: job.clock_in_child_id,
                last_clockdate: job.last_clockdate,
                last_clocktime: job.last_clocktime,
                actual_time: job.actual_time,
                image_available: job.image_available,
                mechanic: job.mechanic,
                clockin_color: job.clockin_color,
                actual_time_hr: job.actual_time_hr,
                actual_time_min: job.actual_time_min,
                job_active_minutes: jobActiveMinutes,
                job_active_hours: hoursAndMinutes,
                job_efficiency_per : efficiencyPercentage,
                task_status_id: job.task_status_id
            });

            // Add the new order object to groupedOrders
            groupedOrders.push(newOrder);
        } else {
            // If the order already exists, just add the job to the existing jobs array
            existingOrder.jobs.push({
                order_id: job.order_id,
                order_name: job.order_name,
                customer: job.customer,
                stock: job.stock,
                job_id: job.job_id,
                vin: job.vin,
                qty: job.qty,
                operation_no: job.operation_no,
                cause: job.cause,
                complaint: job.complaint,
                correction: job.correction,
                job_name: job.job_name,
                description: job.description,
                child_job: job.child_job,
                goal_hour_repair: convertedGoalTmStr,
                goal_hour: job.goal_hour,
                actual_hour: job.actual_hour,
                tran_date: job.tran_date,
                task_status: job.task_status,
                task_color: job.task_color,
                clock_in_link: job.clock_in_link,
                clock_in_child_id: job.clock_in_child_id,
                last_clockdate: job.last_clockdate,
                last_clocktime: job.last_clocktime,
                actual_time: job.actual_time,
                image_available: job.image_available,
                mechanic: job.mechanic,
                clockin_color: job.clockin_color,
                actual_time_hr: job.actual_time_hr,
                actual_time_min: job.actual_time_min,
                job_active_minutes: jobActiveMinutes,
                job_active_hours: hoursAndMinutes,
                job_efficiency_per : efficiencyPercentage


            });
        }
    });

    return groupedOrders;
}

function formatToTimeString(number) {
    // Split the number into the integer and fractional parts
    let [hours, minutes] = number.toFixed(2).split(".");
    // Ensure the minutes are always two digits
    return `${hours}:${minutes.padEnd(2, "0")}`;
}
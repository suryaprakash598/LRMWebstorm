    /**
     * Module Description
     * 
     * Version    Date            Author           Remarks
     * 1.00       02 Aug 2023    Advectus
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
        if (type == "create") {
            var vinId = nlapiGetFieldValue("custrecord_advs_la_vin_bodyfld");
            // var ContType = nlapiGetFieldValue("custrecord_advs_contract_type");
            if (vinId) {
                var recMach = "recmachcustrecord_advs_lea_header_link";//recmachcustrecord_advs_r_h_header_link
                var vinFld = [ "custrecord_advs_vm_model" ];
                var vinRec = nlapiLookupField("customrecord_advs_vm", vinId, vinFld);
                var ModelId = vinRec.custrecord_advs_vm_model;

                nlapiSelectNewLineItem(recMach);
                nlapiSetCurrentLineItemValue(recMach,"custrecord_advs_lea_vin_stk_stock", vinId, true, true);
                nlapiSetCurrentLineItemValue(recMach,"custrecord_advs_lea_model",ModelId, true, true);
                nlapiSetCurrentLineItemValue(recMach,"custrecord_advs_lea_stock_status", 6, true, true);
                nlapiCommitLineItem(recMach);
            }
            
            
                setFirstPaymentDate();
            
            nlapiDisableField('custrecord_advs_lease_n_o_p_er_year', true);
        }

    }

    /**
     * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
     * @appliedtorecord recordType
     *   
     * @returns {Boolean} True to continue save, false to abort save
     */
    function clientSaveRecord(){

        return true;
    }

    function fieldChange(type,name,linenum) {
        if(name=="custrecord_advs_r_h_type_of_lease"){
            var LEaseType	=	nlapiGetFieldValue("custrecord_advs_r_h_type_of_lease");
            if (LEaseType==1) {
                var today	=	nlapiAddDays(new Date(), 2);
                var Textdate	=	nlapiDateToString(today);

                nlapiSetFieldValue("custrecord_advs_l_h_end_date", Textdate);
            }else{
                nlapiSetFieldValue("custrecord_advs_l_h_end_date", "");
            }
        }

          if (name == "custrecord_advs_limit_lease") {
            var limit = nlapiGetFieldValue("custrecord_advs_limit_lease");
            if (limit > 1000) {
                alert("Deductible cannot be greater than 1000");
                nlapiSetFieldValue("custrecord_advs_limit_lease", 1000); // Set the value to 1000
            }
        }
    //	debugger;

        if (name == 'custrecord_advs_lease_event' || name == 'custrecord_advs_l_su_override_sc_payment') {
            disableAndResetFields(type, name, linenum);
            if (name == 'custrecord_advs_lease_event'){
            /*	var EventTy	=	nlapiGetFieldValue("custrecord_advs_lease_event");
                if(EventTy == 6){
                    var fld	=	nlapiGetField("custrecord_advs_l_annual_interest_rate");
                    fld.setLabel("Interest Rate");
                }else{
                    var fld	=	nlapiGetField("custrecord_advs_l_annual_interest_rate");
                    fld.setLabel("Annual Interest Rate");
                }*/
                
            }
        }
        if (name == 'custrecord_advs_l_h_start_date') {
            setFirstPaymentDate();
        }
        if (name == 'custrecord_advs_lease_ptrepay_months') {
            var PayPerYr = nlapiGetFieldValue("custrecord_advs_lease_n_o_p_er_year") * 1;
            var PayinYr = nlapiGetFieldValue("custrecord_advs_l_a_loan_period_in_years") * 1;
            var schNoOfPay = PayPerYr * PayinYr;
            var prePayMonth = nlapiGetFieldValue("custrecord_advs_lease_ptrepay_months");
            nlapiSetFieldValue("custrecord_advs_l_a_sch_num_f_pay",(schNoOfPay - prePayMonth), false, false);
        }

        if (name == "custrecord_advs_l_a_tot_eqp_price" || name == "custrecord_advs_l_a_down_payment" || name == 'custrecord_advs_l_a_admin_gp_fee') {
            var TotalEquip = nlapiGetFieldValue("custrecord_advs_l_a_tot_eqp_price");
            var DownPayment = nlapiGetFieldValue("custrecord_advs_l_a_down_payment")*1;
            var adminFee = nlapiGetFieldValue("custrecord_advs_l_a_admin_gp_fee");
            var event = nlapiGetFieldValue("custrecord_advs_lease_option_list");
            if(event == 1 || event == "1"){
                TotalEquip = (TotalEquip * 1) + (adminFee * 1);
                var LoanAmount = (TotalEquip - DownPayment);
                LoanAmount = LoanAmount * 1;
                nlapiSetFieldValue("custrecord_advs_l_a_loan_amount", LoanAmount, true,true);
            }else{

            }

        }
        if (name == 'custrecord_advs_l_a_sch_num_f_pay'	&& (nlapiGetFieldValue("custrecord_advs_lease_event") == '3' || nlapiGetFieldValue("custrecord_advs_lease_event") == '4')) {
            createREgularLinesNew();
        }
        if (name == "custrecord_advs_l_a_loan_amount" || name == "custrecord_advs_l_annual_interest_rate" 
            || name == "custrecord_advs_lease_n_o_p_er_year" || name == "custrecord_advs_lease_n_o_p_er_year" 
                || name == "custrecord_advs_l_a_loan_period_in_years" || name=='custrecord_advs_l_a_pay_st_date'
                    || name=='custrecord_advs_r_a_opt_extr_pay'|| name=='custrecord_advs_r_a_opt_extr_pay_2'|| name=='custrecord_advs_r_a_opt_extr_pay_3') {

            doLoanAmountCalcProcess();
        }

    }

    function ValidateLine(type){
        if(type == "recmachcustrecord_advs_f_l_s_cnt_head"){
            var eventType	=	nlapiGetFieldValue("custrecord_advs_lease_event");
            
            if(eventType == 6 || eventType == "6"){
                var recMach	=	"recmachcustrecord_advs_f_l_s_cnt_head";
                var lineC	=	nlapiGetLineItemCount(recMach);
                
                try {
                    setTimeout(function() {
                        calculateSchedules();	
                    }, 100);	
                } catch (e) {
                    // TODO: handle exception
                }
            }
            
        }
        return true;
    }

    function calculateSchedules(){
        var recMach	=	"recmachcustrecord_advs_f_l_s_cnt_head";
        var lineC	=	nlapiGetLineItemCount(recMach);
        var loanAmount	=	nlapiGetFieldValue("custrecord_advs_l_a_loan_amount");
        
        var TotalAmount	=	0;
        
        for(var i=1;i<=lineC;i++){
            var schedule	=	nlapiGetLineItemValue(recMach, "custrecord_advs_f_l_s_schedules", i)*1;
            var amount		=	nlapiGetLineItemValue(recMach, "custrecord_advs_f_l_s_amount", i)*1;
            
            var Multi	=	(schedule*amount);
            Multi	=	Multi*1;
            TotalAmount+=Multi;
        }
        
        if(TotalAmount>loanAmount){
            alert("Please make sure Schedule amount cannot be more than Loan amount..!!");
            nlapiSelectLineItem(recMach, lineC);
        }
    }



    function doLoanAmountCalcProcess(){


        var loanAmount = nlapiGetFieldValue("custrecord_advs_l_a_loan_amount") * 1;
        var annualIntere = nlapiGetFieldValue("custrecord_advs_l_annual_interest_rate");
        var PayPerYr = nlapiGetFieldValue("custrecord_advs_lease_n_o_p_er_year") * 1;
        var PayinYr = nlapiGetFieldValue("custrecord_advs_l_a_loan_period_in_years") * 1;
        var suTotalNoOfYears = nlapiGetFieldValue("custrecord_advs_l_a_sch_num_f_pay") * 1;
        var eventType	=	nlapiGetFieldValue("custrecord_advs_lease_event");

        if (loanAmount && annualIntere && PayPerYr && PayinYr) {
            if (annualIntere) {
                annualIntere = parseFloat(annualIntere);
                annualIntere = annualIntere * 1;
            }
            console.log('loanAmount before-->' + loanAmount);
            var diffDays = getDaysToFistPayment();
            console.log('loanAmount diffDays-->' + diffDays);



            console.log('loanAmount -->' + loanAmount);
            var totalNointPeriod = PayinYr * PayPerYr;
            if (eventType == '3' && suTotalNoOfYears > 0) {
                totalNointPeriod = suTotalNoOfYears;
            }
            if (eventType == '5' && suTotalNoOfYears > 0) {
                totalNointPeriod = suTotalNoOfYears;
            }
            var PeriodicValue = annualIntere / PayPerYr;
            PeriodicValue = PeriodicValue * 1;
            PeriodicValue = PeriodicValue / 100;
            PeriodicValue = PeriodicValue * 1;

            var LoanPeriodic = loanAmount * PeriodicValue;
            LoanPeriodic = LoanPeriodic * 1;
    //		LoanPeriodic = LoanPeriodic.toFixed(2);
            LoanPeriodic = LoanPeriodic * 1;

    //		alert(loanAmount+"=>"+PeriodicValue+"=>"+LoanPeriodic);
            var Pow1 = (PeriodicValue + 1);
            var Pow2 = (totalNointPeriod * -1);
            console.log('Pow1 -->' + Pow1);
            console.log('Pow2 -->' + Pow2);

            var PowerVal = Math.pow(Pow1, Pow2);
            PowerVal = PowerVal * 1;
            PowerVal = 1 - PowerVal;
            console.log('PowerVal -->' + PowerVal);

    //		alert(Pow1+"=>"+Pow2+"=>"+PowerVal);
            var tempSchValNew = 0;
            var TempSchedVal = (LoanPeriodic / PowerVal);
            tempSchValNew = TempSchedVal;
            console.log('TempSchedVal -->' + TempSchedVal);
            TempSchedVal = TempSchedVal * 1;
            TempSchedVal = TempSchedVal.toFixed(2);
            TempSchedVal = TempSchedVal * 1;

            nlapiSetFieldValue("custrecord_advs_r_a_scheduled_pay_30days",
                    TempSchedVal, true, true);
            if (eventType == '5' ){
                var startDate 		= nlapiGetFieldValue('custrecord_advs_l_h_start_date');
                var firstPayDate 	= nlapiGetFieldValue('custrecord_advs_l_a_pay_st_date');
                var terms = 30;
                if(startDate && firstPayDate && diffDays>30){
                    var annualIntereNew = annualIntere/100;
                    var newMonthPayAmt = getAmountFinanced(tempSchValNew,annualIntereNew,diffDays); 
                    console.log('newMonthPayamt',newMonthPayAmt);
                    loanAmount+=newMonthPayAmt;
                    console.log('new loanAmount',loanAmount);
                    //----------------------------Re calc emi value---------------
                    var PeriodicValue = annualIntere / PayPerYr;
                    PeriodicValue = PeriodicValue * 1;
                    PeriodicValue = PeriodicValue / 100;
                    PeriodicValue = PeriodicValue * 1;

                    var LoanPeriodic = loanAmount * PeriodicValue;
                    LoanPeriodic = LoanPeriodic * 1;
                    // LoanPeriodic = LoanPeriodic.toFixed(2);
                    LoanPeriodic = LoanPeriodic * 1;

                    // alert(loanAmount+"=>"+PeriodicValue+"=>"+LoanPeriodic);
                    var Pow1 = (PeriodicValue + 1);
                    var Pow2 = (totalNointPeriod * -1);
                    console.log('Pow1 new -->' + Pow1);
                    console.log('Pow2 new -->' + Pow2);

                    var PowerVal = Math.pow(Pow1, Pow2);
                    PowerVal = PowerVal * 1;
                    PowerVal = 1 - PowerVal;
                    console.log('PowerVal -->' + PowerVal);

                    // alert(Pow1+"=>"+Pow2+"=>"+PowerVal);

                    TempSchedVal = (LoanPeriodic / PowerVal);
                    console.log('TempSchedVal -->' + TempSchedVal);
                    TempSchedVal = TempSchedVal * 1;
                    TempSchedVal = TempSchedVal.toFixed(2);
                    TempSchedVal = TempSchedVal * 1;

                }
            }
            nlapiSetFieldValue("custrecord_advs_l_a_scheduled_pay",
                    TempSchedVal, true, true);
            nlapiSetFieldValue("custrecord_advs_l_a_sch_num_f_pay",
                    totalNointPeriod, true, true);

    //		createREgularLinesNew();
        }


    }
    function getDaysToFistPayment() {
        var diffDays = 30;
        try {
            var fromDate = nlapiGetFieldValue('custrecord_advs_l_h_start_date');

            var toDate = nlapiGetFieldValue('custrecord_advs_l_a_pay_st_date');

            var date = new Date(fromDate)

            var date2 = new Date(toDate);

            diffDays = ((date2.getTime() - date.getTime()) / (60 * 60 * 24 * 1000));
            diffDays = diffDays+1;

        } catch (e) {

        }
        return diffDays;

    }
    function getAmountFinanced(firstSchdedPayment, apr, daysToFirstPayment) {
        debugger;
        var pr = (1 * apr) / 12;

        var daysTofirstPayment30 = daysToFirstPayment - 30;

        var temp = ((pr * daysTofirstPayment30)) * firstSchdedPayment;

        return temp;
    }
    function createREgularLinesNew() {
        debugger;
        var InterestRate = nlapiGetFieldValue("custrecord_advs_l_annual_interest_rate");
        var Status = nlapiGetFieldValue("custrecord_advs_l_h_status");
        var LoanAmount = nlapiGetFieldValue("custrecord_advs_l_a_loan_amount") * 1;
        var Start_date = nlapiGetFieldValue("custrecord_advs_l_a_pay_st_date");
        var Lease_date = nlapiGetFieldValue("custrecord_advs_l_h_start_date");
        var Frequency = nlapiGetFieldValue("custrecord_advs_r_h_pay_freq");
        var per_installment = nlapiGetFieldValue("custrecord_advs_l_a_scheduled_pay") * 1;
        var NoSched = nlapiGetFieldValue("custrecord_advs_l_a_sch_num_f_pay") * 1;
        var ExtraPay = nlapiGetFieldValue("custrecord_advs_r_a_opt_extr_pay") * 1;
        
        ExtraPay += nlapiGetFieldValue("custrecord_advs_r_a_opt_extr_pay_2") * 1;
        ExtraPay += nlapiGetFieldValue("custrecord_advs_r_a_opt_extr_pay_3") * 1;

        if (InterestRate) {
            InterestRate = parseFloat(InterestRate);
            InterestRate = InterestRate * 1;
        }

        var ActualInterest = InterestRate / 100;
        ActualInterest = ActualInterest * 1;
        ActualInterest = ActualInterest / 12;
        ActualInterest = ActualInterest * 1;
        var TempActualinterest = (ActualInterest * LoanAmount);

        var TotalSchedule = ((LoanAmount + TempActualinterest) / per_installment);
        var Break_up = TotalSchedule * 1;

        var mon_t = 1;
        var days_t = "";

        var same = 0;
        if (Lease_date == Start_date) {
            // Break_up=Break_up-1;
            same++;
        }

        if (Status == 1) {

            var LeaseRegPay = per_installment * 1;
            var TempX = 0;
            var TempY = 0;

            var rec_s_id = "recmachcustrecord_advs_lm_lc_c_link";
            var RecCount = nlapiGetLineItemCount(rec_s_id);

            // for(var k=1;k<=RecCount;k++){
            // nlapiRemoveLineItem(rec_s_id, 1);
            // }

            nlapiLogExecution("ERROR", "ActualInterest", ActualInterest + "==>"
                    + Break_up);

            var PrincipCumm = 0;
            var interestCum = 0;
            var beginingBalance = 0;
            var EndBalanceCum = 0;
            var suEndingBalance = 0;
            var suinterestCum = 0;
            var suinterest = 0;
            var residualDetails = [];
            for (var d = 1; d <= NoSched; d++) {
                if (d == 1) {
                    TempX += LoanAmount;
                    beginingBalance = LoanAmount;
                } else {
                    // beginingBalance = EndBalanceCum;
                }

                var totalPayment = LeaseRegPay;
                if (beginingBalance <= LeaseRegPay) {
                    totalPayment = beginingBalance;
                }

                if (ExtraPay > 0 && NoSched != d) {
                    totalPayment += ExtraPay;
                } else {
                    ExtraPay = 0;
                }
                
                

                PrincipCumm = PrincipCumm * 1;
                interestCum = interestCum * 1;
                beginingBalance = beginingBalance * 1;
                totalPayment = totalPayment * 1;

                var Naration = d.toString();
                var Interest = (beginingBalance * ActualInterest);
                Interest = Interest * 1;
                Interest = Interest.toFixed(2);
                Interest = Interest * 1;

                var Principal = totalPayment - Interest;
                Principal = Principal * 1;

                interestCum = (interestCum + Interest);

                PrincipCumm += Principal;
                PrincipCumm = PrincipCumm * 1;
                if (totalPayment == beginingBalance) {
                    var EndingBalance = beginingBalance - totalPayment;

                } else {
                    var EndingBalance = beginingBalance - Principal;

                }

    //			nlapiLogExecution("ERROR", "Interest", Interest + "==>"+ interestCum + "=>" + ActualInterest + "=>" + Principal);
                // nlapiSelectNewLineItem(rec_s_id);
                if (d == 1) {

                    // //nlapiSetCurrentLineItemValue(rec_s_id,
                    // 'custrecord_advs_lm_lc_c_date', Start_date);

                } else {
                    if (days_t != '') {

                        Start_date = nlapiStringToDate(Start_date);
                        Start_date = nlapiAddDays(Start_date, days_t);
                        Start_date = nlapiDateToString(Start_date);
                    } else if (mon_t != '') {
                        Start_date = nlapiStringToDate(Start_date);
                        Start_date = nlapiAddMonths(Start_date, mon_t);
                        Start_date = nlapiDateToString(Start_date);
                    } else {

                    }
                    // nlapiSetCurrentLineItemValue(rec_s_id,
                    // 'custrecord_advs_lm_lc_c_date', Start_date);
                }

                // nlapiSetCurrentLineItemValue(rec_s_id,
                // 'custrecord_advs_lm_lc_c_down_paying',totalPayment );
                // nlapiSetCurrentLineItemValue(rec_s_id,
                // 'custrecord_advs_reg_pay_reg_int', Interest);
                // nlapiSetCurrentLineItemValue(rec_s_id,
                // 'custrecord_advs_reg_pay_reg_prin', Principal);
                // nlapiSetCurrentLineItemValue(rec_s_id,
                // 'custrecord_advs_r_p_cumulative_int', interestCum);
                // nlapiSetCurrentLineItemValue(rec_s_id,
                // 'custrecord_advs_r_p_sche_pay', LeaseRegPay);

                // nlapiSetCurrentLineItemValue(rec_s_id,
                // 'custrecord_advs_r_p_beg_bal', beginingBalance);
                // nlapiSetCurrentLineItemValue(rec_s_id,
                // 'custrecord_advs_r_p_end_bal', EndingBalance);
                // nlapiSetCurrentLineItemValue(rec_s_id,
                // 'custrecord_advs_r_p_extra_payments', ExtraPay);
                // nlapiSetCurrentLineItemValue(rec_s_id,
                // 'custrecord_advs_lm_lc_c_narration',d);
                // nlapiCommitLineItem(rec_s_id);

                beginingBalance = EndingBalance;

    //			alert(Interest+"=>"+EndingBalance);
                if (NoSched == d) {
                    nlapiSetFieldValue("custrecord_advs_l_h_end_date", Start_date);

                    // ------------
                    suinterest = ActualInterest;
                    suinterestCum = interestCum;
                    suEndingBalance = EndingBalance;
                    // --------------------------Residual
                    // Calculation-----------------
                    var Interest = (EndingBalance * ActualInterest);
                    var residualAmt = Interest + EndingBalance;
                    interestCum = interestCum + Interest;

                    // nlapiSelectNewLineItem(rec_s_id);
                    // nlapiSetCurrentLineItemValue(rec_s_id,
                    // 'custrecord_advs_lm_lc_c_date', Start_date);
                    // nlapiSetCurrentLineItemValue(rec_s_id,
                    // 'custrecord_advs_lm_lc_c_down_paying',0);
                    // nlapiSetCurrentLineItemValue(rec_s_id,
                    // 'custrecord_advs_reg_pay_reg_int', Interest);
                    // nlapiSetCurrentLineItemValue(rec_s_id,
                    // 'custrecord_advs_reg_pay_reg_prin', 0);
                    // nlapiSetCurrentLineItemValue(rec_s_id,
                    // 'custrecord_advs_r_p_cumulative_int', interestCum);
                    // nlapiSetCurrentLineItemValue(rec_s_id,
                    // 'custrecord_advs_r_p_sche_pay', 0);
                    // nlapiSetCurrentLineItemValue(rec_s_id,
                    // 'custrecord_advs_r_p_residual_amt', residualAmt);

                    // nlapiSetCurrentLineItemValue(rec_s_id,
                    // 'custrecord_advs_r_p_beg_bal', EndingBalance);
                    // nlapiSetCurrentLineItemValue(rec_s_id,
                    // 'custrecord_advs_r_p_end_bal', 0);
                    // nlapiSetCurrentLineItemValue(rec_s_id,
                    // 'custrecord_advs_r_p_extra_payments', 0);

                    // nlapiSetCurrentLineItemValue(rec_s_id,
                    // 'custrecord_advs_lm_lc_c_narration',parseInt(++d));
                    // nlapiCommitLineItem(rec_s_id);

                    nlapiSetFieldValue("custrecord_advs_lease_total_intrest_fa",interestCum);
                    nlapiSetFieldValue("custrecord_advs_l_a_sch_residual_amt",residualAmt);
                    // ------------------------------------------------------------------
                }

            }

        }

    }

    function setFirstPaymentDate() {
        var eventType = nlapiGetFieldValue("custrecord_advs_lease_option_list");
        var startDate = nlapiGetFieldValue('custrecord_advs_l_h_start_date');

        var tr_date_obj = nlapiStringToDate(startDate);
        var due_date = nlapiAddMonths(tr_date_obj, 1);
        var newDate = nlapiDateToString(due_date)
        nlapiSetFieldValue('custrecord_advs_l_a_pay_st_date', newDate);

    }

    function disableAndResetFields(type, name, linenum) {

        nlapiDisableField('custrecord_advs_l_a_scheduled_pay', true);
        nlapiDisableField('custrecord_advs_lease_total_intrest_fa', true);

        var eventType = nlapiGetFieldValue("custrecord_advs_lease_event");

        if (eventType == '1') {

            nlapiSetFieldValue('custrecord_advs_lease_extra_amount_fa', '0');
            nlapiSetFieldValue('custrecord_advs_lease_ptrepay_months', '0');
            nlapiSetFieldValue('custrecord_advs_l_a_sch_residual_amt', '0');
            var ly = nlapiGetFieldValue('custrecord_advs_l_a_loan_period_in_years') * 1;
            var supayPerYer = nlapiGetFieldValue('custrecord_advs_lease_n_o_p_er_year') * 1;
            nlapiSetFieldValue('custrecord_advs_l_a_sch_num_f_pay', supayPerYer
                    * ly);
            nlapiDisableField('custrecord_advs_l_a_sch_num_f_pay', true);
            nlapiDisableField('custrecord_advs_l_a_sch_residual_amt', true);
            nlapiDisableField('custrecord_advs_lease_ptrepay_months', true);
            nlapiDisableField('custrecord_advs_lease_extra_amount_fa', true);

        } else if (eventType == '2') {

            nlapiSetFieldValue('custrecord_advs_l_a_sch_residual_amt', '0');
            var ly = nlapiGetFieldValue('custrecord_advs_l_a_loan_period_in_years') * 1;
            var supayPerYer = nlapiGetFieldValue('custrecord_advs_lease_n_o_p_er_year') * 1;
            nlapiSetFieldValue('custrecord_advs_l_a_sch_num_f_pay', supayPerYer
                    * ly);

            nlapiDisableField('custrecord_advs_l_a_sch_residual_amt', true);

            nlapiDisableField('custrecord_advs_l_a_sch_num_f_pay', false);

            nlapiDisableField('custrecord_advs_lease_ptrepay_months', false);
            nlapiDisableField('custrecord_advs_lease_extra_amount_fa', false);

        } else if (eventType == '3') {

            nlapiSetFieldValue('custrecord_advs_l_a_sch_residual_amt', '0');
            var ly = nlapiGetFieldValue('custrecord_advs_l_a_loan_period_in_years') * 1;
            var supayPerYer = nlapiGetFieldValue('custrecord_advs_lease_n_o_p_er_year') * 1;
            nlapiSetFieldValue('custrecord_advs_l_a_sch_num_f_pay', supayPerYer
                    * ly);

            nlapiDisableField('custrecord_advs_l_a_sch_num_f_pay', true);
            nlapiDisableField('custrecord_advs_l_a_sch_residual_amt', true);
            nlapiDisableField('custrecord_advs_lease_ptrepay_months', true);
            nlapiDisableField('custrecord_advs_lease_extra_amount_fa', true);
            nlapiDisableField('custrecord_advs_l_a_sch_num_f_pay', false);

        } else if (eventType == '4') {

            nlapiSetFieldValue('custrecord_advs_l_a_sch_residual_amt', '0');
            var ly = nlapiGetFieldValue('custrecord_advs_l_a_loan_period_in_years') * 1;
            var supayPerYer = nlapiGetFieldValue('custrecord_advs_lease_n_o_p_er_year') * 1;
            nlapiSetFieldValue('custrecord_advs_l_a_sch_num_f_pay', supayPerYer
                    * ly);

            nlapiDisableField('custrecord_advs_l_a_sch_num_f_pay', false);
            nlapiDisableField('custrecord_advs_l_a_sch_residual_amt', true);
            nlapiDisableField('custrecord_advs_lease_ptrepay_months', false);
            nlapiDisableField('custrecord_advs_lease_extra_amount_fa', false);

        } else if (eventType == '5') {
            var overrideChk = nlapiGetFieldValue('custrecord_advs_l_su_override_sc_payment') ;
            nlapiSetFieldValue('custrecord_advs_l_a_sch_residual_amt', '0');
            var ly = nlapiGetFieldValue('custrecord_advs_l_a_loan_period_in_years') * 1;
            var supayPerYer = nlapiGetFieldValue('custrecord_advs_lease_n_o_p_er_year') * 1;
            nlapiSetFieldValue('custrecord_advs_l_a_sch_num_f_pay', supayPerYer
                    * ly);
            if(overrideChk == 'F'){
                nlapiDisableField('custrecord_advs_l_a_sch_num_f_pay', false);
                nlapiDisableField('custrecord_advs_l_a_sch_residual_amt', true);
                nlapiDisableField('custrecord_advs_lease_ptrepay_months', false);
                nlapiDisableField('custrecord_advs_lease_extra_amount_fa', false);
                nlapiDisableField('custrecord_advs_l_a_sch_num_f_pay', false);
            }
            else{
                nlapiDisableField('custrecord_advs_l_a_scheduled_pay', false);
                nlapiDisableField('custrecord_advs_l_a_sch_num_f_pay', false);
                nlapiDisableField('custrecord_advs_l_a_sch_residual_amt', false);
                nlapiDisableField('custrecord_advs_lease_ptrepay_months', false);
                nlapiDisableField('custrecord_advs_lease_extra_amount_fa', false);
                nlapiDisableField('custrecord_advs_l_a_sch_num_f_pay', false);
            }
        } else if (eventType == '6') {

            nlapiSetFieldValue('custrecord_advs_l_a_sch_residual_amt', '0');
            var ly = nlapiGetFieldValue('custrecord_advs_l_a_loan_period_in_years') * 1;
            var supayPerYer = nlapiGetFieldValue('custrecord_advs_lease_n_o_p_er_year') * 1;
            nlapiSetFieldValue('custrecord_advs_l_a_sch_num_f_pay', supayPerYer
                    * ly);

            nlapiDisableField('custrecord_advs_l_a_sch_num_f_pay', false);
            nlapiDisableField('custrecord_advs_l_a_sch_residual_amt', true);
            nlapiDisableField('custrecord_advs_lease_ptrepay_months', false);
            nlapiDisableField('custrecord_advs_lease_extra_amount_fa', false);
            nlapiDisableField('custrecord_advs_l_a_scheduled_pay', false);
        }

    }

    function addstock(recid) {
        var url=nlapiResolveURL('SUITELET', 'customscript_advs_staa_add_stock_to_rent', 'customdeploy_advs_staa_add_stock_to_rent', null);
        url+="&requestID="+recid;
        var w=1000,h=500;
        ADVS_OpenPopupWindow(url, 'thepopup', w, h, 0, 0, 'Assign Units');
    }

    function Attachvin(recid) {

        var url=nlapiResolveURL('SUITELET', 'customscript_advs_staa_attach_vin_to_ren', 'customdeploy_advs_staa_attach_vin_to_ren', null);
        url+="&requestID="+recid;
        var w=1000,h=700;
        ADVS_OpenPopupWindow(url, 'thepopup', w, h, 0, 0, 'Allocate Vin');
    }

    function Confirm(recid) {
        var url	=	nlapiResolveURL("SUITELET", "customscript_advs_staa_rental_all_functi", "customdeploy_advs_staa_rental_all_functi");
        url+="&requestID="+recid;
        url+="&requesttype=1";


        showProcessingMessage();
        var PostUrl	=	nlapiRequestURL(url, null, null, RefreshCUrrentScreenURL, "GET");

    }
    function confirmAction(recid) {
        // var url	=	nlapiResolveURL("SUITELET", "customscript_advs_ss_lease_confirm", "customdeploy_advs_ss_lease_confirm");//
        var url	=	nlapiResolveURL("SUITELET", "customscript_advs_ss_lease_confirm_v2", "customdeploy_advs_ss_lease_confirm_v2");//
        //customdeploy_advs_ss_lease_confirm_v2
        url+="&requestID="+recid+"";
        var w=screen.width - 550,h=400;
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;

        ADVS_OpenPopupWindow(url, 'thepopup', w, h, 0, 0, 'Lease confirm', null);

    }

    function RefreshCUrrentScreenURL(response) {
    //	alert(response.getBody());
    //	alert(nlapiGetFieldValue("custpage_searchback"));


        if(response.getCode() == 200)
        {

            hideProcessingMessage();;

            window.location.reload();
        }
    }

    function stopLatefee(recid) {

        var url=nlapiResolveURL('SUITELET', 'customscript_advs_staa_rental_stop_latee', 'customdeploy_advs_staa_rental_stop_latee', null);
        url+="&requestID="+recid;
        var w=1000,h=500;
        ADVS_OpenPopupWindow(url, 'thepopup', w, h, 0, 0, 'Skip Late-Fee');

    }
    function print_document(recid){

        var url=nlapiResolveURL('SUITELET', 'customscript_advs_ssmm_deal_report_print', 'customdeploy_advs_ssmm_deal_report_print', null);
        url+="&stocknum="+recid;

        window.open(url);

    }

    function postLateFee(recid) {
        var url	=	nlapiResolveURL("SUITELET", "customscript_advs_staa_rental_all_functi", "customdeploy_advs_staa_rental_all_functi");
        url+="&requestID="+recid;
        url+="&requesttype=2";


        showProcessingMessage();;
        var PostUrl	=	nlapiRequestURL(url, null, null, RefreshCUrrentScreenURL, "GET");

    }
    function changeveh(id){

        var ChangeVehicle    =   nlapiResolveURL("SUITELET","customscriptadvs_scp_rental_change_veh","customdeployadvs_scp_rental_change_veh");
        ChangeVehicle += "&custparam_id="+id;
        ADVS_OpenPopupWindow(ChangeVehicle, 'thepopup', screen.width - 300, 350, 0, 0, 'Change Unit', null);

    }

    function futurepay(recid) {
        var url=nlapiResolveURL('SUITELET', 'customscript_advs_staa_rental_future_pay', 'customdeploy_advs_staa_rental_future_pay', null);
        url+="&requestID="+recid;
        var w=1000,h=500;
        ADVS_OpenPopupWindow(url, 'thepopup', w, h, 0, 0, 'Future Pay');
    }
    function addons(recid) {
        var CreateSubletPO	= nlapiResolveURL('SUITELET', 'customscript_advs_staa_add_addons_ffm_re', 'customdeploy_advs_staa_add_addons_ffm_re', null);
        CreateSubletPO		+="&requestID="+recid;

        var w=screen.width - 300,h=550;
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;

        ADVS_OpenPopupWindow(CreateSubletPO, 'thepopup', w, h, 0, 0, 'Addons', null);
    }
    function returnstock(id) {

 //       var CreateSubletPO	= nlapiResolveURL('SUITELET', 'customscript_advs_staa_stock_return_veh', 'customdeploy_advs_staa_stock_return_veh', null);
      var CreateSubletPO	= nlapiResolveURL('SUITELET', 'customscript_advs_ss_lease_return_v2', 'customdeploy_advs_ss_lease_return_v2', null); 
     CreateSubletPO		+="&Custparam_stockID="+id;

        var w=screen.width - 100,h=550;
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;

        ADVS_OpenPopupWindow(CreateSubletPO, 'thepopup', w, h, 0, 0, 'Return', null);

    }

    function buyoutOpen(id,type,Lessee,VinId) {
     
        if(type == 1){ 
			var  CreateSubletPO = nlapiResolveURL('SUITELET', 'customscript_advs_lease_payoff_summary', 'customdeploy_advs_lease_payoff_summary', null);
            CreateSubletPO		+="&Custparam_curecid="+id;
            setWindowChanged(window,true);
			var w = screen.width - 350, h = 600;
			injectModal();
			openpopUpModal(CreateSubletPO,'BuyOut',h,w)
            //window.open(CreateSubletPO,"_self");
             
        }else{ 
        //<=====updated on 25/07/2024
          
            var CreateSubletPO	= nlapiResolveURL('SUITELET', 'customscript_advs_ss_lease_return_new_s', 'customdeploy_advs_ss_lease_return_new_s', null);
            CreateSubletPO		+="&recordid="+id; 
            CreateSubletPO		+="&ifrmcntnr="+"T";
           CreateSubletPO		+="&custpara_flag="+type;
          // CreateSubletPO		+="&custpara_vinId="+VinId;
            var w=screen.width - 500,h=600;
            
			//var w = screen.width - 550, h = 690;
			injectModal();
			openpopUpModal(CreateSubletPO,'Pay Off',h,w)
          //===updated on 25/07/2024====>
          
             
        }


    }
    function addCpi(id) {


        var CreateSubletPO	= nlapiResolveURL('SUITELET', 'customscript_advs_staa_cpi_manual_creati', 'customdeploy_advs_staa_cpi_manual_creati', null);
        CreateSubletPO		+="&a_reqid="+id;

        var w=screen.width - 450,h=450;
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;

        ADVS_OpenPopupWindow(CreateSubletPO, 'thepopup', w, h, 0, 0, 'CPI', null);


    }

    function addPArts(id){



        var CreateSubletPO	= nlapiResolveURL('SUITELET', 'customscript_advs_staa_add_parts_for_con', 'customdeploy_advs_staa_add_parts_for_con', null);
        CreateSubletPO		+="&custparam_recid="+id;

        var w=screen.width - 450,h=600;
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;

        ADVS_OpenPopupWindow(CreateSubletPO, 'thepopup', w, h, 0, 0, 'Add Parts', null);
    }
    function returnPArts(recid){

        var CreateSubletPO	= nlapiResolveURL('SUITELET', 'customscript_advs_staa_rental_parts_retu', 'customdeploy_advs_staa_rental_parts_retu', null);
        CreateSubletPO		+="&custparam_recid="+recid;

        var w=screen.width - 450,h=600;
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;

        ADVS_OpenPopupWindow(CreateSubletPO, 'thepopup', w, h, 0, 0, 'Add Parts', null);
    }

    function creatMemo(id) {

        var CreateSubletPO	= nlapiResolveURL('SUITELET', 'customscript_advs_staa_rental_creait_mem', 'customdeploy_advs_staa_rental_creait_mem', null);
        CreateSubletPO		+="&requestID="+id;

        var w=screen.width - 300,h=550;
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;

        ADVS_OpenPopupWindow(CreateSubletPO, 'thepopup', w, h, 0, 0, 'Credit Memo', null);

    }
    function createCus(){
        var url	=	"https://8760954.app.netsuite.com/app/common/entity/custjob.nl?cf=86&whence=";
// https://8760954.app.netsuite.com/app/common/entity/custjob.nl?cf=86&whence=
        window.open(url,'_blank')
    }
    function leasePayment(recid) {

        var url = nlapiResolveURL('SUITELET',
                'customscript_advs_ss_print_lease_documen',
                'customdeploy_advs_ss_print_lease_documen', null);
        url += "&recId=" + recid;

        window.open(url, '_blank')

    }
    function returnstocklease(id) {

        var CreateSubletPO	= nlapiResolveURL('SUITELET', 'customscript_advs_staa_lease_return_veh', 'customdeploy_advs_staa_lease_return_veh', null);
        CreateSubletPO		+="&requestID="+id;

        var w=screen.width - 100,h=550;
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;

        ADVS_OpenPopupWindow(CreateSubletPO, 'thepopup', w, h, 0, 0, 'Return', null);

    }

    function functionLA(Id) {
   
    var url = nlapiResolveURL('SUITELET',
        'customscript_advs_sskt_la_bobby_joseph',
        'customdeploy_advs_sskt_la_bobby_joseph', null);
    url += "&custrecId=" + Id;
   
    window.open(url, '_blank')
      }
function searchhistoy(id){
    
    var searchhistory	= nlapiResolveURL('SUITELET',"customscript_advs_lease_agree_history","customdeploy_advs_lease_agree_history",null);
    searchhistory		+="&curREc="+id;

    var w=screen.width - 450,h=450;
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
    width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;

    ADVS_OpenPopupWindow(searchhistory, 'thepopup', w, h, 0, 0, 'Lease Statement History', null); //Lease Account Statement


}
function ADVS_OpenPopupWindow(url,name,w,h,left,right,title)
 {
	 try{
		 injectModal();
		 openpopUpModal(url, title, h , w);
	 }catch(e) 
	 {
		 nlapiLogExecution('error','error',e.toString());
	 }
 
 }
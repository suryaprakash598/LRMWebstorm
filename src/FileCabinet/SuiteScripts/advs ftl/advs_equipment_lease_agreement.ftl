<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
<pdf>
    <head>
        <link name="NotoSans" type="font" subtype="truetype" src="${nsfont.NotoSans_Regular}" src-bold="${nsfont.NotoSans_Bold}" src-italic="${nsfont.NotoSans_Italic}" src-bolditalic="${nsfont.NotoSans_BoldItalic}" bytes="2" />
        <#if .locale == "zh_CN">
            <link name="NotoSansCJKsc" type="font" subtype="opentype" src="${nsfont.NotoSansCJKsc_Regular}" src-bold="${nsfont.NotoSansCJKsc_Bold}" bytes="2" />
        <#elseif .locale == "zh_TW">
            <link name="NotoSansCJKtc" type="font" subtype="opentype" src="${nsfont.NotoSansCJKtc_Regular}" src-bold="${nsfont.NotoSansCJKtc_Bold}" bytes="2" />
        <#elseif .locale == "ja_JP">
            <link name="NotoSansCJKjp" type="font" subtype="opentype" src="${nsfont.NotoSansCJKjp_Regular}" src-bold="${nsfont.NotoSansCJKjp_Bold}" bytes="2" />
        <#elseif .locale == "ko_KR">
            <link name="NotoSansCJKkr" type="font" subtype="opentype" src="${nsfont.NotoSansCJKkr_Regular}" src-bold="${nsfont.NotoSansCJKkr_Bold}" bytes="2" />
        <#elseif .locale == "th_TH">
            <link name="NotoSansThai" type="font" subtype="opentype" src="${nsfont.NotoSansThai_Regular}" src-bold="${nsfont.NotoSansThai_Bold}" bytes="2" />
        </#if>
        <macrolist>
            <macro id="nlheader">
                <table style="width: 100%; font-size: 10pt;">
                    <tr>
                        <td align="left" style="font-size:15px;"><b>EQUIPMENT LEASE AGREEMENT</b></td>
                        <td align="left" style="font-size:15px;"><b>LRM Leasing Company, Inc.</b></td>
                    </tr>
                     <tr>
                <td align="left">Lease No: <span style="border-bottom: 1px solid #333333;">${record.name}</span></td>
                        <td align="left"><b></b></td>
                    </tr>
                    <tr>
                        <td align="left">Date: <span style="border-bottom: 1px solid #333333;">${record.custrecord_advs_l_h_start_date}</span></td>
                        <td align="left"><b></b></td>
                    </tr>
                    
                </table>


            </macro>
            <macro id="nlfooter">

            </macro>
        </macrolist>
        <style type="text/css">* {
            <#if .locale == "zh_CN">
                font-family: NotoSans, NotoSansCJKsc, sans-serif;
            <#elseif .locale == "zh_TW">
                font-family: NotoSans, NotoSansCJKtc, sans-serif;
            <#elseif .locale == "ja_JP">
                font-family: NotoSans, NotoSansCJKjp, sans-serif;
            <#elseif .locale == "ko_KR">
                font-family: NotoSans, NotoSansCJKkr, sans-serif;
            <#elseif .locale == "th_TH">
                font-family: NotoSans, NotoSansThai, sans-serif;
            <#else>
                font-family: NotoSans, sans-serif;
            </#if>
            }
            table {
                font-size: 9pt;
                table-layout: fixed;
            }
            th {
                font-weight: bold;
                font-size: 8pt;
                vertical-align: middle;
                padding: 5px 6px 3px;
                background-color: #e3e3e3;
                color: #333333;
            }
            td p { align:left }
            .fontsizecommon{
                font-size:10px;
            }
        </style>
    </head>
    <body header="nlheader" header-height="8%" footer="nlfooter" footer-height="5pt" padding="0.5in 0.5in 0.5in 0.5in" size="Letter">
        <table style="width: 100%; margin-top: 10px; border:1px;" class="fontsizecommon">
            <thead>
                <tr>
                    <th  colspan="100">LESSEE INFORMATION</th>
                </tr>
            </thead>
            <tr>
                <td  colspan="100">Lessee Name (Exact business name):</td>
            </tr>
            <tr style="padding-top:10px;">
                <td style="border-bottom: 1px solid #333333;" colspan="100">${record.custrecord_advs_l_h_customer_name}</td>
            </tr>
            <tr style="padding-top:10px;">
                <td colspan="100">Address:<span style="border-bottom: 1px solid #333333;">${record.custrecord_advs_l_h_customer_name.billaddressee}  <br/>${record.custrecord_advs_l_h_customer_name.billcity} <br/>${record.custrecord_advs_l_h_customer_name.billstate} <br/>${record.custrecord_advs_l_h_customer_name.billcountry}  ${record.custrecord_advs_l_h_customer_name.shipzip}</span></td>
            </tr>
            <tr style="padding-top:10px;">
                <td colspan="100"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>Street</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>City</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>Country</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>State</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>Zip</span></td>
            </tr>
             <tr style="padding-top:10px;">
                <td colspan="100">Phone:<span style="border-bottom: 1px solid #333333;">&nbsp;${record.custrecord_advs_l_h_customer_name.phone}&nbsp;</span>Email:<span style="border-bottom: 1px solid #333333;">&nbsp;${record.custrecord_advs_l_h_customer_name.email}&nbsp;</span>State Of Incorporation/Organisation:_________________________________</td>
            </tr>
            <tr style="padding-top:10px; padding-bottom:15px;">>
                <td style="border:1px;" colspan="3"></td>
                <td colspan="10">Corp.</td>
                <td style="border:1px;" colspan="3"></td>
                <td colspan="25">Limited Liability Corp ("LLC")</td>
                <td style="border:1px;" colspan="3"></td>
                <td colspan="15">Partnership</td>
                <td style="border:1px;" colspan="3"></td>
                <td colspan="25">Sole Proprietorship</td>
                <td style="border:1px;" colspan="3"></td>
                <td colspan="10">Other</td>
            </tr>
        </table>
        <table style="width: 100%; margin-top: 10px; border:1px;" class="fontsizecommon">
            <thead>
                <tr>
                    <th  colspan="100">DESCRIPTION OF LEASED EQUIPMENT (Include make, model and serial number.)</th>
                </tr>
            </thead>
        
            <tr style="padding-top:10px;">
                <td style="border-bottom: 1px solid #333333;" colspan="100"></td>
            </tr>

            <tr style="padding-top:10px;">
                <td colspan="100">____________________________________________________________________________________________________________________________________________________</td>
            </tr>
<tr style="padding-top:10px;">
                <td colspan="100"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>2022</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>Kenworth</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>T880 T880</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>${record.custrecord_advs_la_vin_bodyfld}</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span></span></td>
            </tr>
            <tr style="padding-top:10px;">
                <td colspan="100"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>YEAR</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>MAKE</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>MODEL</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>VIN#</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span></span></td>
            </tr>
             <tr style="padding-top:10px;">
                <td colspan="100">Equipment Location: _____________________________________</td>
            </tr>
            <tr style="padding-top:10px;">
                <td colspan="100">TOTAL LEASE AMOUNT: <span style="border-bottom: 1px solid #333333;">${record.custrecord_advs_r_a_loan_amount}</span></td>
            </tr>


            <tr style="padding-top:10px;">
                <td colspan="100">END OF LEASE PURCHASE OPTION PRICE: <span style="border-bottom: 1px solid #333333;">${record.custrecord_advs_r_a_sch_residual_amt}</span></td>
            </tr>
            <tr style="padding-top:10px;">
                <td colspan="100">TERM: <span style="border-bottom: 1px solid #333333;">${record.custrecord_advs_r_a_sch_num_f_pay}</span> months from First Rent Payment Date</td>
            </tr>
              <tr style="padding-top:10px;">
                <td colspan="100">FIRST RENT PAYMENT DATE: <span style="border-bottom: 1px solid #333333;">${record.custrecord_advs_l_a_pay_st_date}</span>, MATURITY DATE: <span style="border-bottom: 1px solid #333333;">${record.custrecord_advs_l_h_end_date}</span></td>
            </tr>
            <tr style="padding-top:10px;">
                <td colspan="100">Rent will be due in ARREARS on the <u>${record.custrecord_advs_l_h_next_bill?keep_before("/")}</u> day of each month</td>
            </tr>
            <tr style="padding-top:10px;">
                <td colspan="100">AMOUNT OF EACH MONTHLY PAYMENT: <span style="border-bottom: 1px solid #333333;">${record.custrecord_advs_r_a_scheduled_pay}</span>, plus Taxes</td>
            </tr>
            <tr style="padding-top:10px;">
                <td colspan="100">Non-Refundable SECURITY DEPOSIT: <span style="border-bottom: 1px solid #333333;">${record.custrecord_advs_r_a_down_payment}</span></td>
            </tr>

            <tr style="padding-top:10px;">
                <td colspan="100">AUTO PAY (ACH) REQUIRED. A 3% fee will be added to the monthly rent payment if auto pay is refused/cancelled at any time. A $35 fee will be assessed to stop or hold auto pay; five (5) days notice required. Unless Lessor consents, failure to continue autopay is an immediate Event of Default.</td>
            </tr>

            <tr style="padding-top:10px;">
                <td colspan="100">ADDITIONAL FEES: Insufficient funds (NSF) $35 Toll processing $20 per occurrence</td>
            </tr>

             <tr style="padding-top:10px;">
                <td colspan="100"><b>THIS LEASE IS NOW ABSOLUTE, UNCONDITIONAL AND MAY NOT BE CANCELLED OR TERMINATED BY YOU FOR ANY REASON.</b></td>
            </tr>

             <tr style="padding-top:10px;">
                <td colspan="100">By execution below, you authorize us to fill in any blanks above and to disburse the cost of the Equipment and associated costs.</td>
            </tr>
                    
            <tr style="padding-top:10px;">
                <td colspan="10">Payee:</td>
                <td colspan="30" style="border-bottom: 1px solid #333333;"></td>
                <td colspan="10">Payee:</td>
                <td colspan="30" style="border-bottom: 1px solid #333333;"></td>
                <td colspan="20"></td>
            </tr>
            <tr style="padding-top:20px; padding-bottom:10px;">
                <td colspan="10"></td>
                <td colspan="30" style="border-bottom: 1px solid #333333;"></td>
                <td colspan="10"></td>
                <td colspan="30" style="border-bottom: 1px solid #333333;"></td>
                <td colspan="20"></td>
            </tr>
        
        </table>




        <table style="width: 100%; margin-top: 10px; border:1px;" class="fontsizecommon">
            <thead>
                <tr>
                    <th  colspan="100">This is a binding contract. It cannot be cancelled and you must pay all the Rent. Read carefully before signing and consult a lawyer if you have any questions. You may request a copy of this Lease in larger type. Do not sign until you receive and read it.</th>
                </tr>
            </thead>
             
            <tr style="padding-top:10px;">
                <td colspan="10">Lessor:</td>
                <td colspan="30"></td>
                <td colspan="10">Lessee:</td>
                <td colspan="30"></td>
                <td colspan="20"></td>
            </tr>
             <tr style="padding-top:10px;">
                <td colspan="30">LRM Leasing Company, Inc.</td>
                <td colspan="10"></td>
                <td colspan="10" style="border-bottom: 1px solid #333333;"></td>
                <td colspan="15">Customer Name</td>
                <td colspan="35" style="border-bottom: 1px solid #333333;">${record.custrecord_advs_l_h_customer_name}..</td>
            </tr>
             <tr style="padding-top:10px;">
                <td colspan="10">By:</td>
                <td colspan="30" style="border-bottom: 1px solid #333333;"></td>
                <td colspan="10">By:</td>
                <td colspan="30" style="border-bottom: 1px solid #333333;"></td>
                <td colspan="20"></td>
            </tr> <tr style="padding-top:10px; padding-bottom:15px;">
                <td colspan="10">Title:</td>
                <td colspan="30" style="border-bottom: 1px solid #333333;"></td>
                <td colspan="10">Title:</td>
                <td colspan="30" style="border-bottom: 1px solid #333333;"></td>
                <td colspan="20"></td>
            </tr>
        
        </table>


        <p class="fontsizecommon">This Equipment Lease (this "Lease") has been written in "Plain English". When we use the words "you" or "your" we mean you, the Lessee, as shown above. When we use the words "we", "us" and "our" in this Lease, we mean LRM LEASING Company, INC., the Lessor. DO NOT SIGN IF YOU DO NOT UNDERSTAND YOUR OBLIGATIONS OR LIABILITIES UNDER THIS LEASE. The undersigned person warrants on behalf of the Lessee that he/she is duly authorized to sign and bind the Lessee to the terms of this Lease and other documents related to this Lease. You understand that certain of your obligations under this Lease begin before the Term commences and will be binding upon you, including the insurance requirements set forth in Section 9 below. You acknowledge that time is of the essence with respect to your obligations under this Lease. IF YOU REQUEST BEFORE SIGNING, YOU WILL BE PROVIDED A COPY OF THIS LEASE IN 11 POINT TYPE.</p>
        <p class="fontsizecommon">1. You want to acquire the use of above equipment ("Equipment", which term shall mean any and all items of Equipment) from the Supplier (as such term is defined in Article 2A of the Uniform Commercial Code ("UCC")) named above for the equipment cost ("Equipment Cost") as evidenced by the Supplier’s invoice. You want us to buy the Equipment and lease it to you or finance your acquisition of the Equipment. The Term commences on the earlier of the date you take delivery of the Equipment or the First Rent Payment Date and will continue for the number of months set forth above from the First Rent Payment Date.. You will pay all installation and delivery costs, unless such costs are included in the Equipment Cost. You agree to pay us monthly rent ("Rent"), in advance, for each month or any part thereof that this Lease is in effect. Unless we agree otherwise, you will deposit the first Rent payment with us when you sign this Lease. YOUR OBLIGATION TO PAY THE RENT AND OTHER AMOUNTS DUE UNDER THIS LEASE IS ABSOLUTE AND UNCONDITIONAL AND WILL CONTINUE IN FULL FORCE AND EFFECT REGARDLESS OF ANY DEFECT IN THE EQUIPMENT, ANY INABILITY TO USE THE EQUIPMENT OR ANY OTHER CIRCUMSTANCE WHATSOEVER AND IS NOT SUBJECT TO CANCELLATION, REDUCTION, SETOFF OR COUNTERCLAIM. If we do not receive your Rent or any other amounts owed within five (5) days after its due date, there will be a late fee equal to five percent (5%) of the late amount, provided that no late charge will exceed the maximum amount permitted by applicable law. We may charge you interim rent to cover the time between the date we make payment for the Equipment and the First Rent Payment Date calculated on a per diem basis (e.g. 1/30th of a monthly rent payment). You agree that any deposit or Security Deposit will not bear interest and that we may commingle it with other funds. You agree that we may apply the Security Deposit to any amount owed to us, and if we do you agree to restore the Security Deposit to its original amount. You may request the return of the Security Deposit after your obligations under this Lease have been met in full. You agree to allow us to adjust the Rent if the actual Equipment Cost varies from the amount we used to calculate the Rent. For purposes of perfection of a security interest in chattel paper under the UCC, only the counterpart of this Lease that bears our manually applied signature and is marked "Sole Original" by us will constitute the sole original counterpart of the original chattel paper for purposes of possession. No security interest in this Lease can be perfected by possession of any other counterpart, each of which will be deemed a duplicate original or copy for such purposes. Notwithstanding the foregoing, if this Lease is held by us or our assignee in electronic form in a secure vault, that electronic counterpart shall be the authoritative copy and only control of such authoritative copy, and not a paper counterpart, shall perfect the a security interest in this Lease. Electronic signatures and copies shall be valid and admissible in any action.</p>
        <p class="fontsizecommon">2. Your option to purchase the Equipment ("Purchase Option"), if any, is shown above as the End of Lease Purchase Option. You will have the option to purchase all (but not less than all) Equipment at the end of the Term, AS IS, WHERE IS and WITH ALL FAULTS for cash, only as provided herein. So long as neither an Event of Default nor an event that would be an Event of Default after passage of time, notice or both has occurred, you may purchase all but not less than all of the Equipment at the end of the Term upon not more than one hundred twenty (120) days nor less than sixty (60) days prior written notice to us, for a Purchase Option price equal to the amount shown above plus all applicable sales taxes and other amounts payable with respect to such sale and any and all other amounts due under the Lease. If the Purchase Option price is in excess of $100, it represents an amount we have agreed will be the fair market value of the Equipment at the end of the Term, and does not indicate that this is a financing instead of a lease. The Purchase Option is subject to our rights if an Event of Default has occurred at any time before the purchase is completed.</p>
        <p class="fontsizecommon">No more than one hundred and twenty (120) days and no less than sixty (60) days prior to the end of the Term, you shall give us written notice of your intention to either return the Equipment to us or purchase the Equipment by exercising the Purchase Option. Provided you have given such timely notice, you shall, at your cost, return the Equipment to us in the condition required by Section 5 of this Lease (along with all maintenance records, repair orders, license plates, registration certificates, titles and all similar documentation) in a manner and to a location designated by us, or remit the Purchase Option price. If you fail to so notify us or, having notified us, you either fail to return the Equipment at the end of the Term or if you fail to remit the Purchase Option price consistent with your notice, the Term will AUTOMATICALLY EXTEND ON A MONTH-TO-MONTH BASIS (the "holdover"), and you will pay to us an amount equal to the monthly Rent payment that was in effect during the last month of the original Term under the same terms and conditions as are described herein as holdover rent until all such Equipment has been returned to us as required by Section 5 of this Lease. You agree to continue to pay all Taxes during any holdover period. Nothing will relieve you from your obligations and the terms and conditions under this Lease during any holdover period and no payment of holdover rent shall relieve you of your obligation to return the Equipment upon the expiration or earlier cancellation or termination of the Lease. Such failure shall constitute an immediate Default, and we may terminate any holdover and pursue any remedies available to us at anytime without notice to you. If the Term is extended, the word "Term" will include the extended period.</p>
        <p class="fontsizecommon">3. WE ARE LEASING THE EQUIPMENT TO YOU "AS IS" AND WE MAKE NO (AND HEREBY DISCLAIM ANY AND ALL) EXPRESS OR IMPLIED WARRANTIES OF ANY KIND WITH RESPECT TO THE EQUIPMENT, INCLUDING, WITHOUT LIMITATION, WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. You alone selected the Supplier and the Equipment. You asked us to pay for it. We are not an agent of the Supplier. The Supplier is not allowed to waive or modify any term of this Lease. The Supplier (as defined in Article 2A of the UCC) may have provided warranties for the acquisition of the Equipment. You may contact the Supplier to get a statement of those warranties from the Supplier. You will settle any dispute regarding the Equipment's performance directly with the Supplier. If any portion of the Equipment is software, you acknowledge that we do not own the software and we have no responsibilities as to it. You assign to us as security any rights you may have under any license but we assume none of your obligations. Any software that is part of the Equipment will be licensed to you by the owner with no reduction in Rent.</p>
        <p class="fontsizecommon">4. You are responsible for all repair, maintenance and servicing of the Equipment.. You agree, at your expense, to use, maintain and keep the Equipment: (a) in good operating order in the manner for which it was designed and intended; (b) SOLELY FOR YOUR BUSINESS PURPOSES and not for consumer, personal, family or household purposes; (c) in accordance with Supplier recommendations; and (d) in compliance with all applicable laws, regulations and insurance requirements. You will obtain any permits, tags, inspections, licenses or similar items required by any such law, rule, regulation or decree. If any of the Equipment is a motor vehicle, (i) in no event will such vehicle be used for the transportation for hire of passengers or transportation of hazardous materials except with our prior written consent, (ii) you will comply and cause all persons operating such vehicles hereunder to comply with all applicable requirements of law relating to the registration, licensing, insurance, use and operation of the vehicle including operator's licensing requirements, (iii) you will pay all tolls when due; and (iv) you will comply with all conditions of the policies of insurance or any D.O.T. or other applicable law or regulation with respect to such vehicle. We or our agents may inspect the Equipment wherever located or used (and all maintenance records, repair orders, license plates, registration certificates, titles and all similar documentation) at your cost and expense; provided that no such restriction will apply if an Event of Default or an event which with lapse of time or notice, or both, would become an Event of Default has occurred and is continuing. You will at all times maintain the highest possible value and utility of such Equipment, allowing it be used for its original intended purpose. You will not modify or alter the Equipment without our prior written consent excepting regular maintenance. Ownership of all attachments, additions or replacements is automatically transferred to us. You will keep and use the Equipment only at the above location and will not remove the Equipment from such location or return it to us without our written consent; provided, that if the Equipment is a motor vehicle or trailer, it may be moved within the continental United States so long as it regularly returns to its designated location. You must keep the Equipment free and clear of any and all liens, encumbrances, mortgages, security interests, pledges, charges, tolls, or claims ("Liens") and will promptly, at your sole cost and expense, take such action as may be necessary or appropriate to discharge any such Lien except the respective rights of you and us under this Lease. If we place a GPS or other tracking device on the Equipment, you will not tamper with or remove it, nor will you tamper with any odometer or other device that tracks use of the Equipment. You agree to promptly notify us in writing of any loss or damage to the Equipment. If we determine that any part of the Equipment is lost, stolen, destroyed or damaged, you will, at our option: (a) replace the same with like equipment in good repair, acceptable to us, (b) place the Equipment in good working order so that the Equipment is of the same value, utility and marketability or (c) pay to us the Casualty Value in immediately-available funds. As used herein, "Casualty Value" means the sum of (i) any accrued and unpaid Rent, other payments or performance due; plus (ii) the sum of all future Payments that would be due hereunder through the end of the Term (or if during an extended term, one year); plus (iii) any other amounts we reasonably determine necessary for us to realize the benefit of our bargain. We may require that you perform option (c) whether all or only a portion of the Equipment experiences loss or destruction and we may apportion Casualty Value for partial losses in our discretion.</p>
        <p class="fontsizecommon">5. If you elect not to purchase the Equipment under Section 2 or upon the earlier termination or cancellation of this Lease, you agree to immediately deliver the Equipment to us in the same condition as when delivered capable of performing all functions, ordinary wear and tear excepted, at such location within the United States as we may instruct. You agree to pay all transportation and other expenses related to delivery, including disassembly, packing and such actions as are necessary to qualify the Equipment for all Supplier’s (or other authorized service representative’s) then available service contract or warranty and all applicable licenses or permits.</p>
        <p class="fontsizecommon">6. It will be an "Event of Default" if: you do not pay us as agreed when any amounts are due; you fail to perform any other term of this Lease, including without limitation the payment of tolls, taxes and insurance premiums; you sell, attempt to sell, transfer, sublease, rent or otherwise transfer possession of any of the Equipment or you assign or grant any rights, title or interests in, any of Equipment or this Lease without our prior written consent; you or any guarantor of your obligations dies, becomes insolvent, files for or is the subject of a proceeding in bankruptcy, reorganization or any similar law or breaches or repudiates this Lease or any guaranty of your obligations under this Lease; your primary business, ownership or management changes; you default under any contract with us or that we deem material to your business or financial condition; or you suffer a significant adverse change in your business or financial condition or otherwise give us good reason to believe you will be unable to perform this Lease. You agree that if an Event of Default has occurred, we may, in our sole discretion, do any or all of the following, each of which will be construed as cumulative, and no one of them as exclusive of the others: (a) proceed by appropriate court action or actions; (b) recover interest on any unpaid Rent or other payment from the date it was due until fully paid at the rate of the lesser of eighteen percent (18%) per annum or the highest rate permitted by law; (c) without further notice to you, cancel this Lease whereupon all of your rights to the use of the Equipment will absolutely cease and terminate, and you will deliver possession of the Equipment to us in accordance with Section 2 hereof (excluding any purchase option) and you will remain liable as herein provided; (d) whether or not this Lease is terminated, take possession of any or all of the Equipment wherever situated, and for such purpose, enter upon any premises without liability for so doing; (e) sell, dispose of, hold, use or lease (in full or partial satisfaction as the case may be) the Equipment; (f) declare the Casualty Value immediately due and payable, as liquidated damages for loss of bargain and not as a penalty; and (g) exercise any other right, remedy, election or recourse provided for in this Lease or which is available to us in law or equity. You acknowledge that an Event of Default hereunder will constitute an Event of Default under any other lease, loan or other agreement with us. Notwithstanding the foregoing or anything herein to the contrary, this Lease will not be so cross-defaulted or cross-collateralized if held by different Lessors who are not Affiliates. The term "Affiliate" as used herein means any person or entity which directly or indirectly beneficially owns or holds ten percent (10%) or more of any class of voting stock or other interest of such person or entity or directly or indirectly controls, is controlled by, or is under common control with such person where the term "control" means the power to direct or cause the direction of the management and policies of such person or entity, whether through the ownership of voting securities, by contract, or otherwise.</p>
        <p class="fontsizecommon">7. We own and have title to the Equipment at all times. This is a "true lease" and not a loan or installment sale, and in case this Lease is held by a court not to be a "true lease", you hereby grant us a security interest in the Equipment and all proceeds arising therefrom. If any portion of the Rent or other payments hereunder will be deemed interest and such interest exceeds the highest rate permitted by applicable law, such excess interest will be applied to your obligations to us or refunded if no obligations remain. You grant us power of attorney, and hereby authorize us (a) to file UCC financing statements and (b) list ourselves as owner and/or lienholder on any certificate of title, and to take any other actions we deem necessary to protect our interest, and we may charge you a fee to cover documentation and other costs, including all fees and charges incurred in connection with the titling and registration of any titled Equipment. If we request, you will title any titled Equipment in the appropriate state and you will name LRM LEASINF COMPANY, INC., its successors and assigns, or our designee, as owner and/or lienholder as we direct. The parties will have the rights and remedies of a lessor and lessee as if it were a "finance lease" under Article 2A of the UCC. You waive all rights and remedies under Sections 2A-508 through 2A-522 of Article 2A of the UCC, to the extent permitted by applicable law.</p>
        <p class="fontsizecommon">8. You agree to promptly pay and remit, or if we specify reimburse, and indemnify us for all sales, use, rental personal property, document or other taxes, interest, penalties, and administrative or governmental charges of any kind ("Taxes") relating to the leasing, ownership, purchase or use of the Equipment, including penalties and interest, provided, upon our request, you will properly file all reports and pay all Taxes and furnish us with evidence of compliance with this section. You will be responsible for maintaining registration of the Equipment and obtaining certificates of title or ownership satisfactory to us, which you will promptly deliver to us. We will be entitled to all tax benefits ("Tax Benefits"). You agree to indemnify and pay us for any loss of Tax Benefits, and interest and penalties, by paying an amount that causes the after-tax return or cash flows under this Lease to be the same if the loss had not occurred. This obligation to indemnify us shall continue even if Lease has ended.</p>
        <p class="fontsizecommon">9. You accept all risks of loss and damage to the Equipment commencing at the time of shipment of the Equipment. You will: (a) keep the Equipment insured against all risks (physical damage insurance) in amounts specified by us from time-to-time but in no event less than the greater of replacement value (special form replacement insurance) or the total of all rents under this Lease; and (b) at all times carry commercial liability insurance in amounts satisfactory to us but in no event less than $1,000,000 and with deductibles not to exceed $1,000. All insurance will be in form and with insurance companies satisfactory to us and we and our successors and/or assigns must be named lender loss payee and additional insured on all such insurance policies. All such insurance policies will provide for the giving of thirty (30) days notice to us prior to any alteration or cancellation thereof and will be in full force and effect from the time of shipment. You hereby appoint us as your attorney in fact to make claim for, receive payment of, and do all acts necessary to collect the proceeds of such insurance. You will provide us with acceptable certificates or other evidence of insurance that we request. If you fail to maintain such insurance, or fail to provide us with evidence of such insurance, we may, but are not obligated to, obtain insurance in such forms and amounts as we deem reasonable to protect our interests and we may make a profit on the provision of any such insurance. You agree that we are not a seller of insurance or in the insurance business. Any insurance proceeds received by us will be applied, at our sole and absolute discretion, to one of the options contemplated in Section 4. We will be under no duty to ascertain the existence of or to examine any such policy or to advise you in the event any such policy will not comply with the requirements hereof.</p>
        <p class="fontsizecommon">10. You may not sell, transfer, assign, sublease, rent or otherwise transfer possession of the Equipment or sell, transfer, or assign any rights, title or interests in the Equipment or this Lease without our prior written consent. We may sell or transfer our interests to another person ("Assignee"), who will then have all of our rights but none of our obligations. You agree to pay our Assignee all Rent and other amounts due hereunder without any defense, rights of offset or counterclaims, which will or could be asserted against such Assignee. You waive all defenses against such Assignee and will not hold or attempt to hold such Assignee liable for any of Lessor’s obligations.</p>
        <p class="fontsizecommon">11. You agree to defend, indemnify and hold us (and our owners, officers, employees, agents, and any successors and assigns) harmless from and against: (a) all claims, demands, suits and legal proceedings arising out of or related to this Lease or the Equipment, including: (i) the actual or alleged manufacture, purchase, financing, ownership, delivery, rejection, non-delivery, possession, use, transportation, storage, operation, maintenance, repair, return or disposition of the Equipment; (ii) patent, trademark or copyright infringement; or (iii) any alleged or actual default by you ("Actions"); and (b) any and all penalties, losses, liabilities (including the liability of you or us for negligence, tort and strict liability), damages, costs, court costs and any and all other expenses (including attorneys’ fees, judgments and amounts paid in settlement), incurred incident to, arising out of, or in any way connected with any Actions, this Lease or the Equipment. This indemnity will continue even after this Lease has ended.</p>
        <p class="fontsizecommon">12. You represent and warrant that neither you nor any other person who owns a controlling interest or otherwise controls you in any manner is listed on the Specially Designated Nationals and Blocked Persons Lists maintained by the Office of Foreign Assets Control ("OFAC") or other similar lists maintained by the federal government under any federal law or regulation regarding a person designated under Executive Order No. 13224 or similar lists and you are in compliance with any Bank Secrecy Act regulations and other federal regulations to prevent money laundering; (ii) you are duly organized in the state of organization set forth above; and are existing, in good standing and qualified to do business wherever necessary to carry on your present business and operations and to own its property; and (iii) this Lease, when entered into has been duly executed and authorized, requires no further shareholder, member, partner or other third party approval and is legal, valid, binding and enforceable against you. If requested by us, you will provide continuing periodic financial statements at intervals of not less than every year from the date hereof, which financial statements will consist of a balance sheet and a statement of earnings, such statements to be prepared in accordance with generally accepted accounting principles and you will also provide copies of annual state and federal tax returns and such other information as we may reasonably request. All such reports will be at your sole cost and expense.</p>
        <p class="fontsizecommon">13. This Lease and all documents executed in connection with this Lease will be governed by the laws of the State of Texas, including all matters of construction, validity and performance. You acknowledge that the parties have agreed to the terms of this Lease with the understanding that any action or proceeding regarding this Lease, the Equipment or any cause of action whatsoever arising from or related hereto will be maintained in the state or federal courts in Tarrant County, Texas and you hereby submit to jurisdiction and venue, waiving any claim of improper jurisdiction or venue or forum non conveniens, agreeing to accept service at your place of business in any such action. If any provision of this Lease is invalid, the remainder of this Lease will remain in effect. Nothing in this section will affect the right of any party to serve legal process in any other manner permitted by law or affect the right of any party to bring any action or proceeding in the courts of any other jurisdiction. This Lease may be executed in counterparts all of which will constitute one agreement. The exchange of signed copies by facsimile or electronic transmission will constitute effective execution and may be used in lieu of manually signed documents and qualify as authentic original signatures for purposes of enforcement thereof, including all matters of evidence and the "best evidence" rule. TO THE EXTENT PERMITTED BY APPLICABLE LAW, EACH PARTY TO THIS LEASE HEREBY WAIVES ALL RIGHT TO TRIAL BY JURY IN ANY ACTION ARISING HEREUNDER OR IN ANY WAY CONNECTED WITH THIS LEASE OR THE EQUIPMENT. You agree to pay our attorney’s fees if we use an attorney to enforce our rights (whether or not in court). Any notices required or permitted hereunder will be sent in writing to us or to you at the addresses set forth on the first page of this Lease or to any other address as may be specified by a party by a notice given as provided herein and will be sent by certified mail (return receipt requested), by a nationally recognized express courier service (such as Federal Express) or personally served. Each such notice will be deemed to be given when received upon deposit in any depository maintained by the United States Post Office, when deposited with a nationally recognized courier service or if personally served. You may not assign this Lease, it is binding on your heirs, successors and assigns. You acknowledge we are not a "merchant" under the UCC and you have had an opportunity to review this Lease with counsel of your choice and it will not be interpreted against us because we drafted it. The Equipment Cost may include fees and other amounts in addition to the invoice or offered cost of the Equipment and may not be the amount payable in cash if you purchase the Equipment. Fees may include profit and do not represent the actual cost or value of any service. This Lease contains the entire agreement of the parties (THERE ARE NO ORAL AGREEMENTS REGARDING THE EQUIPMENT) and may be not supplemented, or amended in any way except in a writing signed by the party agreeing to such change.</p>

        <table style="width: 100%; margin-top: 10px; border:1px;" class="fontsizecommon">
            <thead>
                <tr>
                    <th  colspan="100">GUARANTY READ CAREFULLY BEFORE SIGNING AND CONSULT A LAWYER IF YOU HAVE ANY QUESTIONS. THE UNDERSIGNED (“GUARANTOR”) (1) UNCONDITIONALLY GUARANTIES THE FULL AND PROMPT PERFORMANCE AND DISCHARGE OF ALL PRESENT AND FUTURE OBLIGATIONS OWED BY THE LESSEE UNDER THIS LEASE; AGREES THAT LESSOR MAY EXTEND, TRANSFER AND AMEND THIS LEASE AND TO BE BOUND BY ALL SUCH CHANGES; (3) WAIVES ALL NOTICES, INCLUDING NOTICES OF TRANSFER, DEMAND AND DEFAULT; AND (4) AGREES THE THAT LESSOR MAY PROCEED AGAINST GUARANTOR DIRECTLY AND SEPARATELY FROM THE LESSEE, EQUIPMENT, OR ANY OTHER GUARANTOR. ALL OBLIGATIONS HEREUNDER WILL BE JOINT AND SEVERAL. GUARANTOR AUTHORIZES LESSOR OR ITS DESIGNEE TO USE GUARANTOR CONSUMER OR OTHER CREDIT REPORTS FROM TIME TO TIME IN ITS CREDIT EVALUATION AND COLLECTION PROCESSES. GUARANTORCONSENTS TO SUIT IN THE COURTS OF THE STATE OF TEXAS , TARRANT COUNTY AND WAIVES TRIAL BY JURY. THIS GUARANTY WILL BE GOVERNED BY THE LAWS OF TEXAS .</th>
                </tr>
            </thead>
             <tr>
             
                <td colspan="100">For Individual Guarantor(s)</td>
            </tr>
            <tr style="padding-top:10px;">
                <td colspan="45" style="border-bottom: 1px solid #333333;"></td>
                <td colspan="10"></td>
                <td colspan="45" style="border-bottom: 1px solid #333333;"></td>
            </tr>
             
            <tr style="padding-top:10px;">
                <td colspan="45">Guarantor #1 (Print Name)</td>
                <td colspan="10"></td>
                <td colspan="45">Guarantor #2 (Print Name)</td>
            </tr>
           
            <tr style="padding-top:10px;">
                <td colspan="45" style="border-bottom: 1px solid #333333;">X</td>
                <td colspan="10"></td>
                <td colspan="45" style="border-bottom: 1px solid #333333;">X</td>
            </tr>

            <tr style="padding-top:10px;">
                <td colspan="45">Signature (Individually; No Titles) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date</td>
                <td colspan="10"></td>
                <td colspan="45">Signature (Individually; No Titles) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date</td>
            </tr>

            <tr style="padding-top:10px;">
                <td colspan="45">Printed Name:________________________________________</td>
                <td colspan="10"></td>
                <td colspan="45">Printed Name:________________________________________</td>
            </tr>
             <tr style="padding-top:10px;">
                <td colspan="45"><b>For Corporate Guarantor</b></td>
                <td colspan="10"></td>
                <td colspan="45"></td>
            </tr>
             <tr style="padding-top:10px;">
                <td colspan="45">____________________________________, Guarantor</td>
                <td colspan="10"></td>
                <td colspan="45"></td>
            </tr>
             <tr style="padding-top:10px;">
                <td colspan="45">By: ___________________________________</td>
                <td colspan="10"></td>
                <td colspan="45"></td>
            </tr>
            <tr style="padding-top:10px;padding-bottom:15px;">
                <td colspan="45">Printed name of signer:________________________________________</td>
                <td colspan="10"></td>
                <td colspan="45">Title:________________________________________</td>
            </tr>
        
        </table>
        <pbr/>
        
<table border="0" cellpadding="1" cellspacing="1" style="width:100%;"><tr>
	<td colspan='3' align='center'><span style='font-size:30px;'>LRM Leasing Reference Sheet</span></td>
	
	</tr>
	<tr>
	<td colspan='3' ><hr/></td>
	</tr>
	<tr>
	<td colspan='3'>Please provide 3 References (Friends/Family)</td>
	</tr>
    
	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
    <tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
    <tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td>Name</td>
	<td colspan='2'>_______________________________________________________</td>
	</tr>
	<tr>
	<td>Phone Number:</td>
	<td colspan='2'>_______________________________________________________</td>
	</tr>
	<tr>
	<td>Relationship:</td>
	<td colspan='2'>_______________________________________________________</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
    <tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
    <tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td>Name</td>
	<td colspan='2'>_______________________________________________________</td>
	</tr>
	<tr>
	<td>Phone Number:</td>
	<td colspan='2'>_______________________________________________________</td>
	</tr>
	<tr>
	<td>Relationship:</td>
	<td colspan='2'>_______________________________________________________</td>
	</tr>

	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
    <tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
    <tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td>Name</td>
	<td colspan='2'>_______________________________________________________</td>
	</tr>
	<tr>
	<td>Phone Number:</td>
	<td colspan='2'>_______________________________________________________</td>
	</tr>
	<tr>
	<td>Relationship:</td>
	<td colspan='2'>_______________________________________________________</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
    </table>
<pbr/>
 <table border="0" cellpadding="1" cellspacing="1" style="width:100%;"><tr>
	<td colspan='3' align='center'><span style='font-size:30px;'><b>ASSIGNMENT</b></span></td>
    
	
	
	</tr></table>
  
<p>
FOR VALUE RECEIVED, the undersigned (“Assignor”) hereby sells, assigns and transfers to 
TBK BANK, SSB (hereinafter referred to as "TRIUMPH"), its successors and assigns, that certain 
lease and/or rental agreement dated (hereinafter the "Paper") between 
LRM LEASING &nbsp; Company INC, as Lessor, and , as 
Lessee/Borrower (hereinafter the "Obligor"), together with all sums payable thereunder and all 
right, title and interest in and to all items of property therein described (the "Property"), and all 
other indebtedness of whatever type or kind which Assignor may have relating thereto, and all 
rights, powers and remedies relating thereto, with full right, power and authority in TRIUMPH to 
collect and discharge same, either in its own name or in Assignor's name.
</p><p>
Assignor hereby warrants, represents, and agrees that with respect to the Paper: (i) Assignor has 
good and marketable title thereto and to the Property and the right to sell, lease and/or transfer 
same; (ii) the Paper is a valid, binding and enforceable obligation of the Obligor arising out of a 
bona fide loan, lease and/or pledge of the Property in the ordinary course of business; (iii) it 
contains or describes the entire agreement of the parties thereto and all instruments or documents 
made or given in connection with the transaction(s) evidenced thereby; (iv) no representations, 
warranties, promises or inducements not expressly set forth in the Paper have been made or given; 
(v) the Paper creates or reserves valid, free and clear title to and/or Lessor's interest in the Property;
(vi) it and the Property are and will continue to be free of any claims, liens, encumbrances, 
defenses, offsets and counterclaims; (vii) all signatures thereon are genuine and were placed 
thereon by persons with full right, power, capacity and authority to so contract; (viii) the Paper 
will be paid and performed according to the terms thereof, and it is and will be enforceable against 
all parties thereto in accordance with its terms; (ix) Assignor has complied, and will continue to 
comply, with all applicable laws, rules or regulations having the force of law regarding transactions 
of the type evidenced thereby; (x) the Property has been delivered, accepted, installed, and insured 
and Assignor has and will perform its obligations to the Obligor with respect thereto; (xi) Assignor 
has remitted to the appropriate taxing authorities all sales, use or other taxes applicable to the 
transaction described in the Paper or has received from the Obligor and delivered to TRIUMPH 
all appropriate evidences of exemption from such taxes; (xii) there is still unpaid and owing 
thereon the sum total of the unmatured installments stipulated in and evidenced by the Paper, the 
payment of which will be made by Assignor upon demand if not paid by the Obligor when due, 
together with interest, attorneys' fees, Court costs and other expenses in connection therewith; (xii)
Assignor further represents, warrants and agrees that TRIUMPH has and will at all times continue 
to have a valid, enforceable and properly perfected first priority security interest in and/or first lien 
on the Property and subordinates to TRIUMPH all liens and/or encumbrances of any kind or nature 
which Assignor may now or hereafter have and/or assert against the Property.
Assignor expressly authorizes TRIUMPH to release, by operation of law or otherwise, and/or to 
compromise or adjust any and all rights against and/or grant extensions of time of payment to the 
Obligor or any other persons obligated on the Paper, and to substitute debtors, without notice to 
Assignor and without affecting Assignor&quote;s obligations hereunder. It is agreed that Assignor shall 
be fully liable for payment of all of Obligor&quote;s obligations under the Paper. Assignor hereby waives 
notice of acceptance hereof, presentment for payment, demand, notice of protest and dishonor, 
notice of default or nonpayment and notices of every kind and nature with respect to the Paper 
and/or any notes and/or any other documents or instruments given in connection therewith.</p>

<pbr/><p>
Assignor knowingly, voluntarily and intentionally waives any and all right to a trial by jury of any 
and all claims, defenses, counterclaims, cross-claims, set-off or recoupment claims arising either 
directly or indirectly in connection with, out of, or in any way related to this Assignment or the 
Paper and further waives any and all right to claim or recover any punitive or consequential 
damages or any damages other than or in addition to actual damages. <b>This Agreement and all 
transactions contemplated hereunder and/or evidenced hereby shall be governed by, 
construed under, and enforced in accordance with the internal laws of the State of Texas. 
Any suit, action or proceeding arising hereunder, or the interpretation, performance or 
breach hereof, shall, if Lessor so elects, be instituted in any Court sitting in Dallas County, 
Texas or, if none, any Court sitting in the State of Texas (the "<u>Acceptable Forums</u>"). Lessee 
agrees that the Acceptable Forums are convenient to it, and submits to the jurisdiction of the 
Acceptable Forums and waives any and all objections to jurisdiction or venue. Should such 
proceeding be initiated in any other forum, Lessee waives any right to oppose any motion or 
application made by Lessor to transfer such proceeding to an Acceptable Forum. All notices 
related hereto shall be in writing and personally delivered to an officer, partner or proprietor 
(as applicable) of the party receiving such notice or mailed to such party by regular mail or 
certified mail, return receipt requested, to the address for such party specified above or to such 
other address as may have been designated by such party by written notice delivered or mailed 
in the manner specified herein. THE PARTIES HEREBY WAIVE ANY AND ALL RIGHTS 
TO A JURY TRIAL OF ANY CLAIM, CAUSE OF ACTION, COUNTERCLAIM, 
CROSSCLAIM, DEFENSE OR OFFSET INVOLVING LESSEE, LESSOR OR ANY 
PERSON CLAIMING ANY RIGHT OR INTEREST ACQUIRED FROM, THROUGH OR 
UNDER ANY OF THEM; AND LESSEE FURTHER HEREBY WAIVES ANY AND ALL 
SPECIAL, EXEMPLARY, PUNITIVE AND CONSEQUENTIAL DAMAGES IN ANY WAY 
ARISING OUT OF OR RELATED TO THIS AGREEMENT AND/OR THE ACTS OR 
OMISSIONS OF LESSOR OR ANY ASSIGNEE. THIS WRITTEN AGREEMENT AND 
ALL OTHER DOCUMENTS EXECUTED IN CONNECTION HEREWITH REPRESENT 
THE FINAL AGREEMENT BETWEEN THE PARTIES AND MAY NOT BE 
CONTRADICTED BY EVIDENCE OF PRIOR, CONTEMPORANEOUS OR 
SUBSEQUENT ORAL AGREEMENTS OF THE 
</b></p><p><b>
PARTIES. THERE ARE NO UNWRITTEN ORAL AGREEMENTS BETWEEN THE 
PARTIES.</b> The terms of this Assignment may not be waived, altered, amended, modified, revoked 
or rescinded and all other prior or contemporaneous oral and written representations are merged 
herein.
</p>
<pbr/>
<table border="0" cellpadding="1" cellspacing="1" style="width:100%;"><tr>
	<td>IN WITNESS WHEREOF, Assignor hereby sets my\/our hand(s) and seal(s) the</td>
	<td>____day of ______________________________</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>LRM LEASING COMPANY<br />(Assignor)</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>By: ______________________________________<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;(DIRECTOR OF FINANCE)</td>
	</tr>
	<tr>
	<td>&nbsp; &nbsp;</td>
	<td>Printed Name:___________________________</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>Address:_________________________________<br /><br />__________________________________________</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>City,State,Zip</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td colspan='2' align='center'><span style='font-size:20pt;'><b>NOTICE, ACKNOWLEDGEMENT AND AGREEMENT</b></span></td>
	</tr>
	<tr>
	<td colspan='2' style='font-size:10pt;'>Lessee hereby acknowledges that Assignor has pledged, assigned and transferred to TRIUMPH, pursuant to this Assignment the Paper, all obligations of Lessee arising there from, and the Property, together with all certifications, guaranties and other documents executed in connection therewith (collectively, the &ldquo;Obligation Documents&rdquo;). Effective immediately and notwithstanding anything to the contrary in the Paper or Obligation Documents, Obligor shall upon receipt of written notice by TRIUMPH immediately make all payments due and to become due under the Paper or any of the other Obligation Documents to TRIUMPH at its address as follows:</td>
	
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td>__day of ______________________________</td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>__________________________________________<br />(Lessee)</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>By: ______________________________________<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;(Title)</td>
	</tr>
	<tr>
	<td>&nbsp; &nbsp;</td>
	<td>Printed Name:___________________________</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>Address:_________________________________<br /><br />__________________________________________</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>City,State,Zip</td>
	</tr></table>
    </body>
</pdf>
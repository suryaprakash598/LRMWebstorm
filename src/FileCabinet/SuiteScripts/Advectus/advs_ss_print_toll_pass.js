/**
 * Module Description
 *
 * Version    Date            Author           Remarks
 * 1.00       10 Jun 2019     Advectus
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){
    if(request.getMethod()=="GET"){
        var ReQID	=	request.getParameter("a_reqid");

        if(ReQID != null && ReQID != undefined && ReQID !=""){

            var CompanyInfo	=	nlapiLoadConfiguration("companyinformation");
            var pagelogo	=	CompanyInfo.getFieldValue("pagelogo");
            nlapiLogExecution("DEBUG", "LOGO", pagelogo);

            var Logo		=	nlapiLoadFile(pagelogo);
            var LogoUrl		=	Logo.getURL();

            var Addr1		=	"";
            var City		=	"";
            var State		=	"";
            var Zip			=	"";
            var Phone		=	"";
            var Fax			=	"";
            var docNum      =   "";
            var Line1		=	"";

            var invoiceDate="",stockNum="",plateNo="",Vin="";
            var CustAddr1="",custCity="",CustState="",custZip="",custPhone="",CustFax="",custName="";
            var invoiceSearch	=	nlapiCreateSearch("invoice",
                [
                    ["type","anyof","CustInvc"],
                    "AND",
                    ["mainline","is","T"],
                    "AND",
                    ["internalid","anyof",ReQID]
                ],
                [
                    new nlobjSearchColumn("trandate"),
                    new nlobjSearchColumn("formulatext").setFormula("CONCAT({customer.firstname}, CONCAT(' ', {customer.lastname}))"),
                    new nlobjSearchColumn("addressee","billingAddress",null),
                    new nlobjSearchColumn("billaddress1"),
                    new nlobjSearchColumn("state","billingAddress",null),
                    new nlobjSearchColumn("city","billingAddress",null),
                    new nlobjSearchColumn("phone","billingAddress",null),
                    new nlobjSearchColumn("zip","billingAddress",null),
                    new nlobjSearchColumn("country","billingAddress",null),
                    new nlobjSearchColumn("countrycode","billingAddress",null),
                    new nlobjSearchColumn("billaddress"),
                    new nlobjSearchColumn("iselimination","subsidiary",null),
                    new nlobjSearchColumn("namenohierarchy","subsidiary",null),
                    new nlobjSearchColumn("address1","subsidiary",null),
                    new nlobjSearchColumn("city","subsidiary",null),
                    new nlobjSearchColumn("state","subsidiary",null),
                    new nlobjSearchColumn("zip","subsidiary",null),
                    new nlobjSearchColumn("phone","subsidiary",null),
                    new nlobjSearchColumn("fax","subsidiary",null),
                    new nlobjSearchColumn("tranid",null,null)
                ]
            );
            var invoiceRun		=	invoiceSearch.runSearch();
            var invoiceCol		=	invoiceRun.getColumns();
            invoiceRun.forEachResult(function(recd) {
                Addr1			=	recd.getValue("address1","subsidiary",null);
                City			=	recd.getValue("city","subsidiary",null);
                State			=	recd.getValue("state","subsidiary",null);
                Zip			    =	recd.getValue("zip","subsidiary",null);
                Phone			=	recd.getValue("phone","subsidiary",null);
                Fax			    =	recd.getValue("fax","subsidiary",null);
                SubsiName		=	recd.getValue("namenohierarchy","subsidiary",null);

                invoiceDate	    =	recd.getValue("trandate");
                stockNum		=	''
                plateNo		    =	''
                Vin			    =	''

                var Addresee	=	recd.getValue("addressee","billingAddress",null);
                custName		=	recd.getValue("formulatext");
                CustAddr1		=	recd.getValue("billaddress1");
                custCity		=	recd.getValue("city","billingAddress",null);
                CustState		=	recd.getValue("state","billingAddress",null);
                custZip		    =	recd.getValue("zip","billingAddress",null);
                custPhone		=	recd.getValue("phone","billingAddress",null);
                CustFax		    =	recd.getValue("fax","billingAddress",null);
                docNum          =   recd.getValue("tranid",null,null);

                return true;
            });

            if(CheckOr(Addr1)){Addr1="";}if(CheckOr(City)){City="";}if(CheckOr(State)){State="";}if(CheckOr(Zip)){Zip="";}
            if(CheckOr(Phone)){Phone="";}if(CheckOr(Fax)){Fax="";}if(CheckOr(SubsiName)){SubsiName="";}if(CheckOr(invoiceDate)){invoiceDate="";}

            if(CheckOr(stockNum)){stockNum="";}if(CheckOr(plateNo)){plateNo="";}if(CheckOr(Vin)){Vin="";}if(CheckOr(custName)){custName="";}
            if(CheckOr(CustAddr1)){CustAddr1="";}if(CheckOr(custCity)){custCity="";}if(CheckOr(CustState)){CustState="";}if(CheckOr(custZip)){custZip="";}

            custName	=	nlapiEscapeXML(custName)
            CustAddr1	=	nlapiEscapeXML(CustAddr1)
            Addr1		=	nlapiEscapeXML(Addr1)
            City		=	nlapiEscapeXML(City)
            SubsiName	=	nlapiEscapeXML(SubsiName)
            State		=	nlapiEscapeXML(State)
            custCity	=	nlapiEscapeXML(custCity)
            CustState	=	nlapiEscapeXML(CustState)

            Line1		=	Addr1+", "+City+", "+State+", "+Zip;

            var CustAddress	=	custCity+", "+CustState+", "+custZip;
            var htmlHeader	=	"";

            htmlHeader+="<div class='f_size'>";
            htmlHeader+="<table width='100%'> ";
            htmlHeader+="<thead><tr><td style='width:70%'><img width='30%' height='30%' src='"+nlapiEscapeXML(LogoUrl)+"'/></td>" +
                "<td style='width:30%;'><b>"+SubsiName+"</b></td>" +
                "</tr>" +
                "<tr style='padding-top:10px;'><td align='center' colspan='2'><b>"+Line1+"</b></td></tr>" +
                "<tr><td></td><td align='center'><b><u>Phone:</u></b> "+Phone+"</td><td align='center'><b><u>Fax:</u></b> "+Fax+"</td></tr>" +
                "" +
                "</thead>" +
                "</table></div>";
            htmlHeader+="<table width='100%'>";
            htmlHeader+="<tr>";
            htmlHeader+="<td>";
            htmlHeader+="</td>";
            htmlHeader+="</tr>";
            htmlHeader+="<tr>";
            htmlHeader+="<td>";
            htmlHeader+="</td>";
            htmlHeader+="</tr>";
            htmlHeader+="<tr>";
            htmlHeader+="<td  width='80%' align='center' colspan='4' style='font-size:13pt'><b>";
            htmlHeader+="TOLLS STATEMENT"
            htmlHeader+="</b></td>";
            htmlHeader+="</tr>";
            htmlHeader+="</table>";

            var htmlStr = "<table width = '100%' class='tablelabel'>" +
                "<tr><td><b>Date</b></td><td>&nbsp;"+invoiceDate+"</td><td width='40%'></td><td><b>"+custName+"</b></td></tr>" +
                "<tr><td><b>Stock #</b></td><td>&nbsp;"+stockNum+"</td><td></td><td>"+CustAddr1+"</td></tr>" +
                "<tr><td><b>Plate #</b></td><td>&nbsp;"+plateNo+"</td><td></td><td rowspan='2'>"+CustAddress+"</td></tr>" +
                "<tr><td><b>VIN</b></td><td>&nbsp;"+Vin+"</td><td></td></tr>" +
                "<tr><td><b>Invoice #</b></td><td>&nbsp;"+docNum+"</td><td></td></tr>" ;
            htmlStr+="</table>";

            htmlStr+='<br/>';
            htmlStr+="<table width = '100%' class='tabledisc'>" +
                "<tr height='5%'><td border='1' style='border-right:none;'><b>Disclaimer</b></td><td border='1'>The tolls listed below are in reference to the invoice number above. These tolls may not reflect all tolls associated with your account. The $5.00 Handling Fee is added to each toll that <u>"+SubsiName+"</u> pays on the behalf of the driver. If you do not wish to incur the $5.00 fee, you must (a) use your own tag (b) have sufficient funds on your Tag.</td></tr>" +
                "</table>";
            htmlStr+='<br/>';
            htmlStr+="<table width = '100%' class='contentt'><thead>" +

                "<tr><th style='border-bottom:none; border-right:none;'>&nbsp;&nbsp;&nbsp;<b>Exit Date</b></th><th style='border-bottom:none; border-right:none;'>&nbsp;&nbsp;&nbsp;<b>Exit Time</b></th>" +
                "<th style='border-bottom:none; border-right:none;'>&nbsp;&nbsp;&nbsp;<b>Exit Name</b></th>" +
                "<th style='border-bottom:none; border-right:none;'>&nbsp;&nbsp;&nbsp;<b>Agency</b></th>" +
                "<th style='border-bottom:none; border-right:none;'>&nbsp;&nbsp;&nbsp;<b>Toll</b></th><th style='border-bottom:none; border-right:none;'>&nbsp;&nbsp;&nbsp;<b>Fee</b></th>" +
                "<th style='border-bottom:none;'>&nbsp;&nbsp;&nbsp;<b>Total</b></th></tr></thead>" ;

            var TollSearch	=	nlapiCreateSearch("customrecord_advs_toll_import",
                [
                    ["custrecord_advs_ti_veh_invoice_link","anyof",ReQID]
                ],
                [
                    new nlobjSearchColumn("custrecord_advs_ti_transaction_date"),
                    new nlobjSearchColumn("custrecord_advs_ti_exit_time"),
                    new nlobjSearchColumn("custrecord_advs_exit_plaza"),
                    new nlobjSearchColumn("custrecord_advs_exit_plaza"),
                    new nlobjSearchColumn("custrecord_advs_exit_plaza"),
                    new nlobjSearchColumn("custrecord_advs_ti_agency"),
                    new nlobjSearchColumn("custrecord_advs_ti_amount"),
                    new nlobjSearchColumn("custrecord_advs_ti_our_cost"),
                    new nlobjSearchColumn("custrecord_advs_ti_cash_cost"),
                    new nlobjSearchColumn("custrecord_advs_ti_cash_cost")
                ]
            );
            var TollRun		=	TollSearch.runSearch();
            var TollCol		=	TollRun.getColumns();
            var tollTotal	=	0,Feetotal=0;totaltot=0;
            TollRun.forEachResult(function(reco) {

                var ExitDate		=	reco.getValue(TollCol[0]);
                var ExitTime		=	reco.getValue(TollCol[1]);
                var ExitPlaza		=	reco.getValue(TollCol[3]);
                var Exitplazanew	=	reco.getValue(TollCol[4]);
                var Agency			=	reco.getValue(TollCol[5]);
                var Amount			=	reco.getValue(TollCol[6])*1;
                var TowerFee		=	reco.getValue(TollCol[7])*1;
                var FinalAmo		=	reco.getValue(TollCol[8])*1;
                var CahAmount		=	reco.getValue(TollCol[9])*1;

                if(ExitPlaza){
                    ExitPlaza	=	nlapiEscapeXML(ExitPlaza);
                }else{
                    ExitPlaza	=	"";
                }

                if(Agency){
                    Agency	=	nlapiEscapeXML(Agency);
                }else{
                    Agency	=	"";
                }
                if(CahAmount>0){
                    Amount	=	CahAmount;
                }

                htmlStr+="<tr><td class='noright'>"+ExitDate+"</td><td class='noright'>"+ExitTime+"</td><td class='noright'>"+ExitPlaza+"</td>" +
                    "<td class='noright'>"+Agency+"</td><td class='noright'>"+Amount+"</td>" +
                    "<td class='noright'>"+TowerFee+"</td><td class='nobottom'>"+FinalAmo+"</td></tr>" ;
                tollTotal+=Amount;
                Feetotal+=TowerFee;
                totaltot+=FinalAmo;
                return true;
            });

            tollTotal	=	tollTotal*1;
            tollTotal	=	tollTotal.toFixed(2);

            totaltot	=	totaltot*1;
            totaltot	=	totaltot.toFixed(2);

            htmlStr+="<tr><td class='claaRight'></td><td class='claaRight'></td><td class='claaRight'></td><td class='claaRight1'><b>Total</b></td><td class='claaRight2'><b>"+tollTotal+"</b></td><td class='claaRight2'><b>"+Feetotal+"</b></td><td class='claaRight3'><b>"+totaltot+"</b></td></tr>" ;
            htmlStr+="</table>";

            htmlStr+='<br/>';
            htmlStr+='<br/>';
            // htmlStr+="<table width = '100%' class='tabledisc'>" +
            //     "<tr height='3%'><td border='1' width='10%' style='border-right:none;'><b>Contact Info</b></td><td border='1'>If you have questions or need further assistance in regards to tolls on your account, please contact the Tolls department via <b><u>email:</u></b> <i>tolls@towerny.com</i> or <b><u>phone:</u></b> <i>(201) 414-9740</i>.</td></tr>" +
            //     "</table>";

            var style=callStyle();

            var xml  = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
            xml += "<pdf ><head>" ;
            xml += style;


            xml+='<meta name="title" value="Toll Invoice"/>';
            xml+='<macrolist>';
            xml+='<macro id="smallheader">';
            xml+=htmlHeader;
            xml+='</macro>';
            xml+='<macro id="myfooter">';
            xml += "<p align='right' style='font-size:10px'> Page <pagenumber/> of <totalpages/></p>";
            xml+='</macro></macrolist>';
            xml += "</head>";
            xml += "<body size='A4' font-size='10'  header ='smallheader' header-height='35mm' footer='myfooter' footer-height='10mm' style='margin-left:-5mm; margin-right:-5mm; margin-top:-5mm;' >\n\n";
            xml += htmlStr;
            xml += "</body></pdf>";

            var files = nlapiXMLToPDF(xml);
            files.setName("Toll Invoice.pdf");
            response.setContentType('PDF', 'Toll Invoice.pdf', 'inline');
            response.write(files.getValue());
        }
    }
}

function callStyle(){
    var str="<style>" +
        "body {font-family: Helvetica;}" +
        "#newTable1 {border-collapse:collapse; border:0.5; width:100%; margin-top:15px;}" +
        "#newTable1 th{font-size:10pt; border:0.5; font-weight:bold; align:center;}" +
        "#newTable1 td{font-size:9pt; border:0.5; align:center;}" +
        "#newTable2 {width:100%; margin-top:15px;}" +
        "#newTable2 th{font-size:9pt; font-weight:bold;}" +
        "#newTable2 td{font-size:9pt;}" +

        "table.tablelabel {" +
        "  border-collapse:separate;" +
        "font-size:10pt" +
        "}" +
        "table.tabledisc {" +
        "  border-collapse:collapse;" +
        "font-size:10pt" +
        "}" +
        "table.contentt th {" +
        "background-color:#bfbfbf;" +
        "font-size:10pt;" +
        "border:1px solid #000;" +
        "border-collapse:collapse;" +
        "font-weight:bold" +
        "border-bottom:none;  " +
        "}" +
        ".contentt  {" +
        "border-collapse:collapse;" +
        "}" +
        "td.collapsee {" +
        "border-collapse:collapse;" +
        "}" +

        ".contentt td {" +
        "font-size:10pt;" +
        "border:1px solid #000;" +
        "border-collapse:collapse;" +
        "}" +
        "td.claaRight{" +
        "border-bottom:none;  " +
        "border-left:none;" +
        "border-right:none;" +
        "}" +
        "td.noright{" +
        "border-bottom:none;  " +
        "border-right:none;" +
        "}" +
        "td.nobottom{" +
        "border-bottom:none;  " +
        "}" +
        "td.claaRight1{" +
        "border-right:none;" +
        "border:2px solid #000;" +
        "}" +
        "td.claaRight2{" +
        "border-right:none;" +
        "border:2px solid #000;" +
        "}" +
        "td.claaRight3{" +
        "border:2px solid #000;" +
        "}" +
        "th.nobottoma{" +
        "border-bottom:none;  " +
        "}" +
        "</style>";
    return str;
}

function CheckOr(String) {

    if(String	==	null || String	==	undefined || String	==	'' || String	==	'null' || String	==	'undefined' ){
        return 1;
    }else{
        return 0;
    }

}
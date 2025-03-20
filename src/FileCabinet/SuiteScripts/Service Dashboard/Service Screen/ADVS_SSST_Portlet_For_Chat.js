/**
 * @NApiVersion 2.x
 * @NScriptType Portlet
 */
define(['N/ui/serverWidget'], function(serverWidget) {

    function render(params) {
        var portlet = params.portlet;
        portlet.title = 'My Custom Inline HTML Portlet';
        
        var Url =   "https://8760954.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1708&deploy=1";

        var htmlContent	=	"";
        htmlContent+="<table width='100%' style='margin-top:-20px;'>" +
            "<tr>" +
            "<td width='100%'>"+
            "<iframe src='"+Url+"' id='iframebtn1' frameBorder='0' align='left' border='0' seamless='no' width='100%' height='150%' onLoad='resize(\"iframebtn1\")'></iframe>" +
            "</td>" +
            "</tr>" +
            "</table>";

        // Set the HTML content in the portlet
        portlet.html = htmlContent;
    }

    return {
        render: render
    };
});

/**
 * Module Description
 *
 * Version    Date            Author           Remarks
 * 1.00       19 Aug 2018     Nawaz Shareef
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){

    if(request.getMethod() == 'GET'){

        var s_id 		= request.getParameter('s_id');
        var vehicle_category       = request.getParameter('custparam_category');
        var vinId 		= request.getParameter('custparam_vin');

        // var vehicle_category       = 1

        nlapiLogExecution('ERROR', 's_id', s_id);
        nlapiLogExecution('ERROR', 'vehicle_category *', vehicle_category);
        nlapiLogExecution('ERROR', 'vinId * ', vinId);


        var form = nlapiCreateForm('Checklist');
        var vin_Id = form.addField('custpage_sales_id', 'text', 'Vin Master').setDisplayType('hidden');




        if(vinId != null && vinId != undefined && vinId != ''){
            vin_Id.setDefaultValue(vinId);

            var search = nlapiCreateSearch("customrecord_advs_car_checklist_ans_mst",
                [
                    ["custrecord_advs_car_chklst_ans_ms_vin_id","anyof",vinId]
                ],
                [
                    new nlobjSearchColumn("internalid").setSort(false)
                ]
            );

            var run = search.runSearch();
            var col = run.getColumns();
            var count = 0;
            var internalid = "";

            run.forEachResult(function(rec) {
                internalid = rec.getValue(col[0]);
                count++;
                return true;
            });

        }

        var htmlField = form.addField('custpage_html', 'inlinehtml', 'HTML');
        htmlField.setLayoutType("outsideabove");
        var html="";

        nlapiLogExecution('ERROR', 'count', count + ' * internalid * ' + internalid);

        if(count > 0){
            html += With_Data(internalid);
        }else{
            html += Without_Data(vehicle_category);
            var script = "function validateAndSubmit() { if (confirm('Once the details are submitted, no changes are allowed. Would you like to submit?')) { document.forms['main_form'].submit(); } }";
            form.addButton('custpage_submit_button', 'Submit', 'validateAndSubmit()');
            form.addField('custpage_client_script', 'inlinehtml').setDefaultValue('<script type="text/javascript">' + script + '</script>');
            // form.addSubmitButton('Submit');
        }

        html += "<style>"
            +".square {"
            +"  height: 10px;"
            +"  width: 10px;"
            +"}"

            +"table {"
            +"font-size: 10pt;"
            +"color: black;"
            +"line-height: 1.4;"
            +"}"

            +"#newTable {"
            +"background-color: #F1F1F1;" +
            "border-radius: 10px;" +
            "box-shadow: 10px 10px 15px grey;}"

            +"#newTable th{"
            +"font-weight: bold;"
            +"font-size:10pt;" +
            "height:10px;"
            +"color: #fff;" +
            "text-align: center;" +
            "border-radius: 5px;" +
            "background-color: #607799;"
            +"}"

            +".newImage {"
            +"border: 1px solid black;"
            +"border-radius: 4px;"
            +"padding: 5px;"
            +"}"

            +"#newTable td{"
            +"	font-size:14pt;"
            +"font-weight: bold;"
            +"}"

            +".container {"
            +"    display: block;"
            +"    position: relative;"
            +"    padding-left: 35px;"
            +"    margin-bottom: 12px;"
            +"    cursor: pointer;"
            +"    font-size: 22px;"
            +"    -webkit-user-select: none;"
            +"    -moz-user-select: none;"
            +"    -ms-user-select: none;"
            +"    user-select: none;"
            +"			}"

            +".container input {"
            +"  position: absolute;"
            +"  opacity: 0;"
            +"  cursor: pointer;"
            +"			}"

            +".checkmark1 {"
            +"  position: absolute;"
            +"  top: 0;"
            +"  left: 0;"
            +"  height: 25px;"
            +"  width: 25px;"
            +"  background-color: green;"
            +"			}"

            +".container:hover input ~ .checkmark1 {"
            +"  background-color: #ccc;"
            +"			}"

            +".container input:checked ~ .checkmark1 {"
            +"  background-color: green;"
            +"			}"

            +".checkmark1:after {"
            +"  content: '';"
            +"  position: absolute;"
            +"  display: none;"
            +"			}"

            +".container input:checked ~ .checkmark1:after {"
            +"  display: block;"
            +"			}"

            +".container .checkmark1:after {"
            +"  left: 9px;"
            +"  top: 5px;"
            +"  width: 5px;"
            +"  height: 10px;"
            +"  border: solid white;"
            +"  border-width: 0 3px 3px 0;"
            +"  -webkit-transform: rotate(45deg);"
            +"  -ms-transform: rotate(45deg);"
            +"    transform: rotate(45deg);"
            +"}"

            +".checkmark2 {"
            +"  position: absolute;"
            +"  top: 0;"
            +"  left: 0;"
            +"  height: 25px;"
            +"  width: 25px;"
            +"  background-color: yellow;"
            +"			}"

            +".container:hover input ~ .checkmark2 {"
            +"  background-color: #ccc;"
            +"			}"

            +".container input:checked ~ .checkmark2 {"
            +"  background-color: yellow;"
            +"			}"

            +".checkmark2:after {"
            +"  content: '';"
            +"  position: absolute;"
            +"  display: none;"
            +"			}"

            +".container input:checked ~ .checkmark2:after {"
            +"  display: block;"
            +"			}"

            +".container .checkmark2:after {"
            +"  left: 9px;"
            +"  top: 5px;"
            +"  width: 5px;"
            +"  height: 10px;"
            +"  border: solid black;"
            +"  border-width: 0 3px 3px 0;"
            +"  -webkit-transform: rotate(45deg);"
            +"  -ms-transform: rotate(45deg);"
            +"    transform: rotate(45deg);"
            +"}"

            +".checkmark3 {"
            +"  position: absolute;"
            +"  top: 0;"
            +"  left: 0;"
            +"  height: 25px;"
            +"  width: 25px;"
            +"  background-color: red;"
            +"			}"

            +".container:hover input ~ .checkmark3 {"
            +"  background-color: #ccc;"
            +"			}"

            +".container input:checked ~ .checkmark3 {"
            +"  background-color: red;"
            +"			}"

            +".checkmark3:after {"
            +"  content: '';"
            +"  position: absolute;"
            +"  display: none;"
            +"			}"

            +".container input:checked ~ .checkmark3:after {"
            +"  display: block;"
            +"			}"

            +".container .checkmark3:after {"
            +"  left: 9px;"
            +"  top: 5px;"
            +"  width: 5px;"
            +"  height: 10px;"
            +"  border: solid white;"
            +"  border-width: 0 3px 3px 0;"
            +"  -webkit-transform: rotate(45deg);"
            +"  -ms-transform: rotate(45deg);"
            +"    transform: rotate(45deg);"
            +"}"

            +"</style>";

        html += "<script type='text/javascript'>function clicknew(str,id){"+
            "document.getElementById(str+'_'+id).style.border = '2px solid black';" +
            "for(i=1;i<4;i++){" +
            "if(i!=id){" +
            "document.getElementById(str+'_'+i).style.border = '0';" +
            "}" +
            "}"+
            "}</script>";

        htmlField.setDefaultValue(html);


        // var fldimg1	=	form.addField("custpage_img1","file","Image 1");
        // fldimg1.setLayoutType("outsidebelow");

        // var fldimg2	=	form.addField("custpage_img2","file","Image 2");
        // fldimg2.setLayoutType("outsidebelow");

        // var fldimg3	=	form.addField("custpage_img3","file","Image 3");
        // fldimg3.setLayoutType("outsidebelow");

        // var fldimg4	=	form.addField("custpage_img4","file","Image 4");
        // fldimg4.setLayoutType("outsidebelow");

        response.writePage(form);
    } else{
        //Post Function
        var vinId 	= request.getParameter('custpage_sales_id');

        var search = nlapiCreateSearch("customrecord_advs_car_checklist_question",
            [
                ["isinactive","is","F"],
                "AND",
                ["custrecord_advs_checklist_type","is",1]
            ],
            [
                new nlobjSearchColumn("name"),
                new nlobjSearchColumn("custrecord_advs_question_category"),
                new nlobjSearchColumn("internalid").setSort(false)
            ]
        );

        var run = search.runSearch();
        var col = run.getColumns();
        var categoryArray = new Array();
        var categoryText = new Array();
        var ValueArray = new Array();
        var Internalids = new Array();
        var QuestionArr	=	[];

        run.forEachResult(function(rec) {
            var category = rec.getValue(col[1]);
            var question = rec.getValue(col[0]);

            var text = rec.getText(col[1]);
            var internalid = rec.getValue(col[2]);

            if(categoryArray.indexOf(category) == -1){
                categoryArray.push(category);
                categoryText.push(text);

                ValueArray[category] = new Array();
                ValueArray[category][0] = question;

                Internalids[category] = new Array();
                Internalids[category][0] = internalid;

            }else{
                var length = ValueArray[category].length;
                ValueArray[category][length] = question;

                var length = Internalids[category].length;
                Internalids[category][length] = internalid;
            }

            QuestionArr[internalid]	=	new Array();
            QuestionArr[internalid]["text"]	=	question;

            return true;
        });

        var AnswersArray = new Array();
        var jsonStorearr	=	new Array();


        for(var i=0;i<categoryArray.length;i++){
            for(var j=0;j<ValueArray[categoryArray[i]].length;j++){
                var internalid = Internalids[categoryArray[i]][j];
                var value = request.getParameter(internalid);
                AnswersArray[internalid] = value;
            }
        }

        var rec = nlapiCreateRecord('customrecord_advs_car_checklist_ans_mst');
        if(vinId){
            // rec.setFieldValue('custrecord_advs_car_chklst_ans_ms_sl_ord', sales_id);
            rec.setFieldValue('custrecord_advs_car_chklst_ans_ms_vin_id', vinId);

        }


        for(var i=0;i<categoryArray.length;i++){

            for(var j=0;j<ValueArray[categoryArray[i]].length;j++){
                var fetchAnswer	=	AnswersArray[Internalids[categoryArray[i]][j]];
                var Question	=	Internalids[categoryArray[i]][j];


                rec.selectNewLineItem('recmachcustrecord_advs_car_chcklst_parent_link');
                rec.setCurrentLineItemValue('recmachcustrecord_advs_car_chcklst_parent_link', 'custrecord_advs_car_chcklst_category', categoryArray[i]);
                rec.setCurrentLineItemValue('recmachcustrecord_advs_car_chcklst_parent_link', 'custrecord_advs_car_chcklst_question', Question);
                rec.setCurrentLineItemValue('recmachcustrecord_advs_car_chcklst_parent_link', 'custrecord_advs_car_chcklst_ans', fetchAnswer);
                rec.commitLineItem('recmachcustrecord_advs_car_chcklst_parent_link');

//				nlapiLogExecution("DEBUG", "fetchAnswer", fetchAnswer+"=>"+Qid+"=>"+Question);
                var Qid	=	"";
                if(QuestionArr[Question] != null && QuestionArr[Question] != undefined){
                    Qid	=	QuestionArr[Question]["text"];

                }

                if(fetchAnswer != null && fetchAnswer != undefined){

                    if((fetchAnswer == 3 || fetchAnswer == "3") && (Qid)){
                        var jsonObj	=	{};
                        jsonObj.cat			=	categoryText[i];
                        jsonObj.question			=	Qid;
                        jsonObj.answer	=	fetchAnswer;
                        jsonStorearr.push(jsonObj);
                    }

                }

            }
        }

        //Images
        var ImGfile1 = request.getFile('custpage_img1');
        var ImGfile2 = request.getFile('custpage_img2');
        var ImGfile3 = request.getFile('custpage_img3');
        var ImGfile4 = request.getFile('custpage_img4');


        var image1	=	"";
        if(ImGfile1 != null && ImGfile1 != undefined && ImGfile1 != ''){
            ImGfile1.setFolder('129');
            ImGfile1.setIsOnline(true);
            image1 = nlapiSubmitFile(ImGfile1);
        }
        var image2	=	"";
        if(ImGfile2 != null && ImGfile2 != undefined && ImGfile2 != ''){
            ImGfile2.setFolder('129');
            ImGfile2.setIsOnline(true);
            image2 = nlapiSubmitFile(ImGfile2);
        }

        var image3	=	"";
        if(ImGfile3 != null && ImGfile3 != undefined && ImGfile3 != ''){
            ImGfile3.setFolder('129');
            ImGfile3.setIsOnline(true);
            image3 = nlapiSubmitFile(ImGfile3);
        }
        var image4	=	"";
        if(ImGfile4 != null && ImGfile4 != undefined && ImGfile4 != ''){
            ImGfile4.setFolder('129');
            ImGfile4.setIsOnline(true);
            image4 = nlapiSubmitFile(ImGfile4);
        }

        var group	=	"recmachcustrecord_advs_d_p_i_v_hd_linnk";
        if(image1){
            rec.selectNewLineItem(group);
            if(vinId){
                rec.setCurrentLineItemValue(group, "custrecord_advs_parent_link", vinId);
            }
            rec.setCurrentLineItemValue(group, "custrecord_advs_dpiv_images", image1);
            rec.commitLineItem(group);

        }
        if(image2){
            rec.selectNewLineItem(group);
            if(vinId){
                rec.setCurrentLineItemValue(group, "custrecord_advs_parent_link", vinId);
            }
            rec.setCurrentLineItemValue(group, "custrecord_advs_dpiv_images", image2);
            rec.commitLineItem(group);
        }
        if(image3){
            rec.selectNewLineItem(group);
            if(vinId){
                rec.setCurrentLineItemValue(group, "custrecord_advs_parent_link", vinId);
            }
            rec.setCurrentLineItemValue(group, "custrecord_advs_dpiv_images", image3);
            rec.commitLineItem(group);
        }
        if(image4){
            rec.selectNewLineItem(group);
            if(vinId){
                rec.setCurrentLineItemValue(group, "custrecord_advs_parent_link", vinId);
            }
            rec.setCurrentLineItemValue(group, "custrecord_advs_dpiv_images", image4);
            rec.commitLineItem(group);
        }

        var answerID	=	"";
        try{
            answerID = nlapiSubmitRecord(rec);
        }catch (e) {
            nlapiLogExecution('ERROR', 'e', e.message);
        }

        var finaldata	=	[];
        var dataObject	=	{};

        dataObject.AnswerData	=	jsonStorearr;

        dataObject.AnswerID	=	answerID;
        finaldata.push(dataObject);

        var StringFyData	=	JSON.stringify(finaldata);


        var onclickScript=" <html><body> <script type='text/javascript'>" +
            "try{" +
            "" +
            //		"var answerCode	=	'"+answerID+"';" +
            "var answerCode	=	"+StringFyData+";" +
            "";
        onclickScript+="window.parent.RefreshWindowShaEdit(answerCode);";//Function Name
        onclickScript+="var theWindow = window.parent.closePopup();" ;
            
        onclickScript+="}catch(e){alert(e+'   '+e.message);}</script></body></html>";

        response.write(onclickScript);
    }

}

function Without_Data(vehicle_category){

    nlapiLogExecution("ERROR", " * Without_Data * vehicle_category * ", vehicle_category);

    var logo = nlapiEscapeXML("https://system.netsuite.com/core/media/media.nl?id=1518&c=TSTDRV1064792&h=c4fd06524f70f6e5a1c0&whence=");
    var interior = nlapiEscapeXML("https://8760954.app.netsuite.com/core/media/media.nl?id=2299&c=8760954&h=p6zT32hhg6dp9CIPOLPlkK9N0zdpHLukrNU9tCavPM9XimL3&fcts=20231215001143&whence=");
    var exterior = nlapiEscapeXML("https://8760954.app.netsuite.com/core/media/media.nl?id=2300&c=8760954&h=AeXVuSYqRt1TRHpDsmlzoqGFFI9_G4FqBBfBQuCcVh0plBBb&fcts=20231215001150&whence=");
    var engine = nlapiEscapeXML("https://8760954.app.netsuite.com/core/media/media.nl?id=2301&c=8760954&h=X9I7e4UPHm-XO7EXNYeWt7iYVy75yORH1rUus-WSqUdqSLJy&fcts=20231215001156&whence=");
    var undertruck = nlapiEscapeXML("https://8760954.app.netsuite.com/core/media/media.nl?id=2302&c=8760954&h=jUib0mb4WA1l3yvOCPmMg-hzFqaX6bhgFKjCeGnHwKT7mb6n&fcts=20231215001202&whence=");

    var Images = [interior,exterior,engine,undertruck];

    var search = nlapiCreateSearch("customrecord_advs_car_checklist_question",
        [
            ["isinactive","is","F"],
            "AND",
            ["custrecord_advs_checklist_type","is",1],
            "AND",
            ["custrecord_advs_car_check_vehicle_cat","anyof",vehicle_category]
        ],
        [
            new nlobjSearchColumn("name"),
            new nlobjSearchColumn("custrecord_advs_question_category"),
            new nlobjSearchColumn("internalid").setSort(false)
        ]
    );

    var run = search.runSearch();
    var col = run.getColumns();
    var categoryArray = new Array();
    var categoryText = new Array();
    var ValueArray = new Array();
    var Internalids = new Array();

    run.forEachResult(function(rec) {
        var category = rec.getValue(col[1]);
        var question = rec.getValue(col[0]);
        var text = rec.getText(col[1]);
        var internalid = rec.getValue(col[2]);

        if(categoryArray.indexOf(category) == -1){
            categoryArray.push(category);
            categoryText.push(text);


            ValueArray[category] = new Array();
            ValueArray[category][0] = question;

            Internalids[category] = new Array();
            Internalids[category][0] = internalid;

        }else{
            var length = ValueArray[category].length;
            ValueArray[category][length] = question;

            var length = Internalids[category].length;
            Internalids[category][length] = internalid;
        }

        return true;
    });

    var HTMLNew = "<table style='width:100%;'><tr>";

    for(var i=0;i<categoryArray.length;i++){

        HTMLNew += "<td style='height:600px; width:250px;'><table id='newTable' width='100%' height='100%' style='padding:15px;'><tr><th colspan='4'>"+categoryText[i]+"</th></tr>";
        if(Images[i]){
            HTMLNew += "<tr align='center' style='align:center;'><td align='center' colspan='4' style='align:center; width:150px;'><img class='newImage' width='150px' height='100px' src='"+Images[i]+"'/></td></tr>";
        }
        for(var j=0;j<ValueArray[categoryArray[i]].length;j++){
            HTMLNew +="<tr><td width='200px' style='font-size: 10px'>"+ValueArray[categoryArray[i]][j]+"</td><td><label class='container'><input id='alignment_1' name='"+Internalids[categoryArray[i]][j]+"' value='1' type='radio'><span class='checkmark1'></span></label></td><td><label class='container'><input id='alignment_1' value='2' name='"+Internalids[categoryArray[i]][j]+"' type='radio'><span class='checkmark2'></span></label></td><td><label class='container'><input id='alignment_3' value='3' name='"+Internalids[categoryArray[i]][j]+"' type='radio'><span class='checkmark3'></span></label></td></tr>";
        }
        HTMLNew += "<tr><td style='height:60px;'></td></tr></table></td>";
    }

    HTMLNew += "</tr></table>";

    return HTMLNew;
}

function With_Data(internalid){

    nlapiLogExecution("ERROR", " * With_Data * internalid * ", internalid);


    var logo = nlapiEscapeXML("https://system.netsuite.com/core/media/media.nl?id=1518&c=TSTDRV1064792&h=c4fd06524f70f6e5a1c0&whence=");
    var interior = nlapiEscapeXML("https://8760954.app.netsuite.com/core/media/media.nl?id=2299&c=8760954&h=p6zT32hhg6dp9CIPOLPlkK9N0zdpHLukrNU9tCavPM9XimL3&fcts=20231215001143&whence=");
    var exterior = nlapiEscapeXML("https://8760954.app.netsuite.com/core/media/media.nl?id=2300&c=8760954&h=AeXVuSYqRt1TRHpDsmlzoqGFFI9_G4FqBBfBQuCcVh0plBBb&fcts=20231215001150&whence=");
    var engine = nlapiEscapeXML("https://8760954.app.netsuite.com/core/media/media.nl?id=2301&c=8760954&h=X9I7e4UPHm-XO7EXNYeWt7iYVy75yORH1rUus-WSqUdqSLJy&fcts=20231215001156&whence=");
    var undertruck = nlapiEscapeXML("https://8760954.app.netsuite.com/core/media/media.nl?id=2302&c=8760954&h=jUib0mb4WA1l3yvOCPmMg-hzFqaX6bhgFKjCeGnHwKT7mb6n&fcts=20231215001202&whence=");

    var Images = [interior,exterior,engine,undertruck];

    var search = nlapiCreateSearch("customrecord_advs_car_checklist_ans_mst",
        [
            ["internalid","anyof",internalid]
        ],
        [
            new nlobjSearchColumn("custrecord_advs_car_chcklst_category","CUSTRECORD_ADVS_CAR_CHCKLST_PARENT_LINK",null),
            new nlobjSearchColumn("custrecord_advs_car_chcklst_question","CUSTRECORD_ADVS_CAR_CHCKLST_PARENT_LINK",null),
            new nlobjSearchColumn("custrecord_advs_car_chcklst_ans","CUSTRECORD_ADVS_CAR_CHCKLST_PARENT_LINK",null),
            new nlobjSearchColumn("internalid","CUSTRECORD_ADVS_CAR_CHCKLST_PARENT_LINK",null).setSort(false)
        ]
    );

    var categoryArray = new Array();
    var ValueArray = new Array();
    var AnswerArray = new Array();
    var categoryText = new Array();

    var run = search.runSearch();
    var col = run.getColumns();

    run.forEachResult(function(rec) {

        var category = rec.getValue(col[0]);
        var question = rec.getText(col[1]);
        var text = rec.getText(col[0]);
        var answer = rec.getValue(col[2]);

        if(categoryArray.indexOf(category) == -1){
            categoryArray.push(category);
            categoryText.push(text);

            ValueArray[category] = new Array();
            ValueArray[category][0] = question;

            AnswerArray[category] = new Array();
            AnswerArray[category][0] = answer;

        }else{
            var length = ValueArray[category].length;
            ValueArray[category][length] = question;

            var length = AnswerArray[category].length;
            AnswerArray[category][length] = answer;
        }

        return true;
    });

    var HTMLNew = "<table style='width:100%;'><tr>";

    var counterGreen = 0;
    var counterYellow = 0;
    var counterRed = 0;
    var GreenArray = new Array();
    var YellowArray = new Array();
    var RedArray = new Array();

    for(var i=0;i<categoryArray.length;i++){

        HTMLNew += "<td style='height:600px; width:250px;'><table id='newTable' width='100%' height='100%' style='padding:15px;'><tr><th colspan='4'>"+categoryText[i]+"</th></tr>";
        if(Images[i]){
            HTMLNew += "<tr align='center' style='align:center;'><td align='center' colspan='4' style='align:center; width:150px;'><img class='newImage' width='150px' height='100px' src='"+Images[i]+"'/></td></tr>";
        }
        for(var j=0;j<ValueArray[categoryArray[i]].length;j++){
            HTMLNew +="<tr><td width='200px' style='font-size: 10px'>"+ValueArray[categoryArray[i]][j]+"</td><td><label class='container'><input disabled='true' id='alignment_1' name='"+(i+"-"+j)+"' value='1' ";

            if(AnswerArray[categoryArray[i]][j] == 1){
                HTMLNew += "checked='checked'";
                counterGreen++;
            }

            HTMLNew +=" type='radio'><span class='checkmark1'></span></label></td><td><label class='container'><input disabled='true' id='alignment_1' value='2' ";

            if(AnswerArray[categoryArray[i]][j] == 2){
                HTMLNew += "checked='checked'";
                counterYellow++;
            }

            HTMLNew +=" name='"+(i+"-"+j)+"' type='radio'><span class='checkmark2'></span></label></td><td><label class='container'><input disabled='true' id='alignment_3' value='3' name='"+(i+"-"+j)+"' ";

            if(AnswerArray[categoryArray[i]][j] == 3){
                HTMLNew += "checked='checked'";
                counterRed++;
            }

            HTMLNew +=" type='radio'><span class='checkmark3'></span></label></td></tr>";
        }

        GreenArray[categoryArray[i]] =counterGreen;
        YellowArray[categoryArray[i]] =counterYellow;
        RedArray[categoryArray[i]] =counterRed;
        counterGreen=0;
        counterYellow=0;
        counterRed=0;

        HTMLNew += "<tr><td style='height:60px;'></td></tr></table></td>";
    }

    HTMLNew += "</tr></table>";
    return HTMLNew;
}
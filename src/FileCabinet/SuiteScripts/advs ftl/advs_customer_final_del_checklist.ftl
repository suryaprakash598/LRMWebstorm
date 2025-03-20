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
            <table class="header" style="width: 100%;font-size: 10pt;"><tr>
	<td style=" align:right ;width: 438px;white-space: nowrap;"><#if LOGO.logourl?length != 0><img src="${LOGO.logourl}" style="float: right; margin: 0px 7px; width: 130px; height: 60px;" /> </#if></td>
	<!-- <td align="right" style="width: 367px; font-size: 28pt;"><span class="title">Parts Order</span></td> --></tr></table>

<p><span style="font-size:16px;"><strong>&nbsp;<span style="font-family:NotoSans,sans-serif;">FINAL CUSTOMER DELIVERY CHECKLIST</span></strong></span></p>
        </macro>
    </macrolist>
    <style type="text/css">table { font-size: 9pt; table-layout: fixed; width: 100%; }
th { font-weight: bold; font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; background-color: #e3e3e3; color: #333333; padding-bottom: 10px; padding-top: 10px; }
td { padding: 4px 6px; }
b { font-weight: bold; color: #333333; }
</style>
</head>
<body header="nlheader" header-height="10%" padding="0.5in 0.5in 0.5in 0.5in" size="Letter">
    <br /><br /><span style="font-size:14px;"> <b>Name on lease:</b> ${record.custrecord_advs_l_h_customer_name} </span>

<table cellpadding="1" cellspacing="1" style="width:698.481px;"><tr>
	<td style="width: 41px;"><span style="font-size:14px;"><b>Year:</b></span></td>
	<td style="width: 44px; font-size:14px;">${record.custrecord_advs_la_vin_bodyfld.custrecord_advs_vm_model_year}</td>
	<td style="width: 38px;"><span style="font-size:14px;"><b>Make:</b></span></td>
	<td style="width: 64px;font-size:14px;">${record.custrecord_advs_la_vin_bodyfld.custrecord_advs_vm_vehicle_brand}</td>
	<td style="width: 48px;"><span style="font-size:14px;"><b>Model:</b></span></td>
	<td style="width: 56px;font-size:14px;">${record.custrecord_advs_la_vin_bodyfld.custrecord_advs_vm_model}</td>
	<td style="width: 86px;"><span style="font-size:14px;"><b>Transmission:</b></span></td>
	<td style="width: 42px;">&nbsp;</td>
	<td style="width: 65px;"><span style="font-size:14px;"><b>Mileage:</b></span></td>
	<td style="width: 66px;">&nbsp;</td>
	</tr></table>

<table style="border-collapse: collapse; height:30px;"><tr>
	<td style="width:10%; font-size:14px;"><b>VIN #:</b></td>
	<td style="height:30px">
	<table><tr>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(0, 1)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(1, 2)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(2, 3)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(3, 4)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(4, 5)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(5, 6)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(6, 7)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(7, 8)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(8, 9)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(9, 10)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(10, 11)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(11, 12)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(12, 13)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(13, 14)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(14, 15)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(15, 16)}</td>
		<td style="border: 1px solid black; height:30px;font-size:16px;">${record.custrecord_advs_la_vin_bodyfld?substring(16, 17)}</td>
		</tr></table>
	</td>
	</tr></table>
&nbsp;

<p>____________ All lights/signals on vehicle including but not limited to the marker, brake, turning, head,<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; tail, and reverse are working properly.</p>

<p>____________Truck is equipped with required safety equipment (triangles and fire extinguisher).</p>

<p>____________Tire tread depth is above DOT standard 4/32 for steer tires and 2/32 for drive tires.</p>

<p>____________Brake depth and shoes are acceptable.</p>

<p>____________No air leaks.</p>

<p>____________All fluids, including but not limited to coolant, oil, and clutch fluid, are full.</p>

<p>____________Air Conditioning in the front and rear cab are working properly.</p>

<p>____________Windshield wipers are working properly.</p>

<p>____________Doors and locks are working properly.</p>

<p>____________No audible surging from the engine was present.</p>

<p>____________Horns are working properly.</p>

<p>____________VIN on truck matches VIN on lease agreement.</p>

<p>____________Instrument panel is working properly with no indicators present.</p>

<p>____________The entire truck has been inspected by me from front to back, including but not limited to,<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;the radiator, the engine, tubes, and wheels. There were no visible fluids on the ground coming<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;from my truck, nor was there any visible fluid leaks coming from anywhere in or on the truck<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;that I inspected.</p>

<p>____________I test drove this vehicle with no issues noted at all.</p>

<p>____________I understand that 3rd party inspections were allowed and encouraged by LRM<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Leasing. I knowingly decided not to have a 3rd party inspect my truck before accepting delivery.</p>
&nbsp;

<p>I, acting on behalf of the Lessee, acknowledge that I have personally inspected or caused to be personally inspected to my satisfaction all items of Equipment described in the above Lease and that I am duly authorized on behalf of the Lessee to sign and bind the Lessee to the Lease.</p>
<br /><br /><br />&nbsp;
<p>Name:</p>
<br /><br />&nbsp;
<p>Date:</p>
<br /><br />&nbsp;
<p>Signature:<u>{{Int_es_:signer1:signature}}</u></p>
</body>
</pdf>
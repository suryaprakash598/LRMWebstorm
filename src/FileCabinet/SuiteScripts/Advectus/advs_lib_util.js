/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define(['N/runtime'],
    /**
     * @param{runtime} runtime
     */
    (runtime) => {
        var ADVSObject		=	{};
        ADVSObject.Scripts			=	{
            "rentalreturnCs":"SuiteScripts/Advectus 2.0/advs_csaa_rental_return.js",
            "rentRecCS":"SuiteScripts/Advectus 2.0/advs_cs_addons_rental_gen.js",
        };
        ADVSObject.vmstatus			=	{};
        ADVSObject.vmstatus			=	{
            "available" :21, //1 is inactivated so its equivalent is 21 enroute
            "sold" :2,
            "committed" :3,
            "pendingarrival" :4,
            "delivered" :5,
            "readyfordelivery" :6,
            "rent" :8,
            "outfordelivery" :10,
            "intransit" :12,
            "lease" :13,
            "notavailable" :14,
            "softhold" :15,
            "returntovendor" :16,
            "customerowned" :17,
            "repo":25,
        };
        ADVSObject.rentalinvoiceType			=	{};
        ADVSObject.rentalinvoiceType			=	{
            rental_regular :"1",
            rental_damage :"2",
            rental_return :"3",

            lease_reqular :"1",
            lease_damage :"2",
            lease_return :"3",
            lease_buyout :"4",
            lease_toll   :"5",
            lease_deposit   :"6",
            lease_cpc   :"7",
            lease_otherfee   :"8",
            lease_repofee : "10",
            lease_adminfee : "11",
            lease_earlyfee:"12",
            lease_latefee:"13",
            lease_payoffdepositfee:"14",
            lease_payoffremainingfee:"15",
        };
        ADVSObject.rentalheadStatus			=	{};
        ADVSObject.rentalheadStatus			=	{
            draft :"1",
            active :"5",
            return :"4",
            confirmed :"2",

        };
        ADVSObject.addonstype			=	{
            initial :"1",
            recurring :"3",
            return :"2",
        };
        ADVSObject.module			=	{
            vehicle :"1",
            part :"2",
            service :"3",
            rental :"4",
            lease :"5",
        };
        ADVSObject.rentlinestat			=	{
            return :"10",
        };

        ADVSObject.rentalvmMileType			=	{
            miles :"1",
            km :"2",
        };
        ADVSObject.leasechildstatus			=	{
            assigned :"6",
            active :"5",
            return :"10",
        };
        ADVSObject.leaseStatus			=	{
            draft :"1",
            confirmed :"2",
            cancelled :"3",
            return :"4",
            active :"5",
            customerpurchase :"6",
            terminated:"7"
        };
        ADVSObject.collectionDashObj			=	{
            Client :"/SuiteScripts/Advectus/advs_cs_collection_dashboard.js",

        };
        ADVSObject.forms			=	{
            ptpform:"94",
            paymenform:"163"
        }
        ADVSObject.tasktype			=	{
            impounded:"1",
            ptp:"2",
            underwriting:"3",
            brokenpromise:"4",
            ofr:"5",
            general:"6",
        }
        ADVSObject.frequency			=	{
            daily:"1",
            weekly:"2",
            monthly:"3",
        }
        ADVSObject.cpcstatus={
            open:"1",
            close:"2",
        }
        ADVSObject.customrecordtype={
            leasecard:"customrecord_advs_lease_header"
        }
        ADVSObject.ptpstatus={
            notstarted:"1",
            processed:"2",
            rejected:"3",
        }
        ADVSObject.TransactionForm			=	{
            leaseInvoice :"ADVS Lease Invoice",
        };

        return ADVSObject;

    });
({
    handleRadio: function (component, event) {                
        component.set("v.displaySection" ,  true); 
        component.set("v.isPaymentPlan" ,  true);
    },
    tabchange: function (component, event) {                
        component.set("v.compareTabselected" ,  "compareTabOpen");        
    },
    dispayMsg: function (component, event) {     
        component.set("v.ShowMoreMsg" ,  true);   
        component.find("showmore").set("v.class" , 'slds-hide');   
        component.find("showless").set("v.class" , 'slds-show');
    },
    hideMsg: function (component, event) {     
        component.set("v.ShowMoreMsg" ,  false);   
        component.find("showless").set("v.class" , 'slds-hide');   
        component.find("showmore").set("v.class" , 'slds-show');
    },
    doInit: function (component, event) { 
        var workspaceAPI = component.find("workspace");
        var tab=component.get("v.tabName")
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.setTabLabel({
                label: tab
            });
        })
        .catch(function(error) {
          //  console.log(error);
        });
    }
    ,
    
    loadOptions: function (component, event, helper) {
        var opts = [
            { value: "buy", label: "Buy Now" },
            { value: "nobuy", label: "Don't Buy Now" },   
            ];
       component.set("v.options1",opts);
      },
    
     loadOptions1: function (component, event, helper) {
            var opts = [
            { value: "buy", label: "Buy Now" },
            { value: "nobuy", label: "Don't Buy Now" },        
        ];
        component.set("v.options2",opts);

    },        
    
    
    handleRadio1: function (component, event) {                
        component.set("v.displaySection" ,  false);        
    },
    
    handleRadio2: function (component, event) {
        component.set("v.displayTax" ,  true);
        component.set("v.isTaxBenefit" ,  true);
        
    },
    handleRadio4: function (component, event) {
        component.set("v.displayTax" ,  false);
        
        
    },
    handleRadio3: function (component, event) 
    {
        component.set("v.TaxDeduction" ,  true);
        component.set("v.taxMonthly" ,  true);
    },
    handleRadio5: function (component, event) 
    {
        component.set("v.TaxDeduction" ,  false);
    },
    YearlyData: function (component, event) {
        
        var action = component.get("c.getData");
        var clientId = component.get("v.cid");  
        var Name = component.get("v.Name");
      //  alert(Name);
        var totalAmount = component.get("v.totalAmount");
     //   alert(totalAmount);
        var downPayment = component.get("v.downPayment");
      //  alert(downPayment);
        var installments = component.get("v.installments");
      //  alert(installments);
        var startDate = component.get("v.startDate");
     //   alert(startDate);
        var endDate = component.get("v.endDate");
     //   alert(endDate);
        var isTaxBenefit = component.get("v.isTaxBenefit");
      //  alert(isTaxBenefit);
        var isPaymentPlan = component.get("v.isPaymentPlan");
      //  alert(isPaymentPlan);
        var rainyDayMonths = component.get("v.rainyDayMonths");
      //  alert(rainyDayMonths);
        var taxContribution = component.get("v.taxContribution");
      //  alert(taxContribution);
         var taxMonthly = component.get("v.taxMonthly");
       // alert(taxMonthly);
        var taxDeduct = component.get("v.taxDeduct");
        action.setParams({
            "clientId": clientId,
            "name": Name,
            "totalAmount":totalAmount,
            "downPayment":downPayment,
            "installments":installments,
            "startDate":startDate,
            "endDate":endDate,
            "isTaxBenefit":isTaxBenefit,
            "isPaymentPlan":isPaymentPlan,
            "taxContribution":taxContribution,
            "taxMonthly":taxMonthly,
            "taxDeduct":taxDeduct,
            "rainyDayMonths":rainyDayMonths
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var ac = response.getReturnValue().response;            
                component.set("v.Tabledata",response.getReturnValue().response);
                var tabledata = component.get("v.Tabledata");
                tabledata = JSON.parse(tabledata);
                var displayMonthList = new Array();
                var monthlySavingList = new Array();
                var monthlyExpenseList = new Array();
                var monthlyIncomeList = new Array();
                var monthlyGoalTargetList = new Array();
                var monthlyCreditCardList = new Array();
                var monthlyTermDebtList = new Array();
                var displayAffordRainyDayFunds = new Array();
                var cashAvailableForPurchaseList = new Array();
                var downPayment = new Array();
                var installment = new Array();
                var networthAnalysisList = new Array();
                var yearlyList = new Array();
                var year = component.get("v.selectedYear");
                
                
                for(var i in tabledata.displayMonthList){
                    
                    if(tabledata.displayMonthList[i].substring(0,4) == year )
                        displayMonthList.push(tabledata.displayMonthList[i].substring(5));
                }
                component.set("v.displayMonthList",displayMonthList);
                
                
                for(var i in tabledata.monthlySavingList){
                    if(tabledata.monthlySavingList[i].substring(0,4) == year )
                        monthlySavingList.push(parseFloat(Math.floor(tabledata.monthlySavingList[i].substring(5)).toFixed(2)).toLocaleString());
                    
                }
                component.set("v.monthlySavingList",monthlySavingList);
                
                
                for(var i in tabledata.monthlyExpenseList){
                    if(tabledata.monthlyExpenseList[i].substring(0,4) == year )
                        monthlyExpenseList.push(parseFloat(Math.floor(tabledata.monthlyExpenseList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.monthlyExpenseList",monthlyExpenseList);
                
                
                for(var i in tabledata.monthlyIncomeList){
                    if(tabledata.monthlyIncomeList[i].substring(0,4) == year )
                        monthlyIncomeList.push(parseFloat(Math.floor(tabledata.monthlyIncomeList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.monthlyIncomeList",monthlyIncomeList);
                
                for(var i in tabledata.monthlyGoalTargetList){
                    if(tabledata.monthlyGoalTargetList[i].substring(0,4) == year )
                        monthlyGoalTargetList.push(parseFloat(Math.floor(tabledata.monthlyGoalTargetList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.monthlyGoalTargetList",monthlyGoalTargetList);
                
                for(var i in tabledata.monthlyCreditCardList){
                    if(tabledata.monthlyCreditCardList[i].substring(0,4) == year )
                        monthlyCreditCardList.push(parseFloat(Math.floor(tabledata.monthlyCreditCardList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.monthlyCreditCardList",monthlyCreditCardList);
                
                for(var i in tabledata.monthlyTermDebtList){
                    if(tabledata.monthlyTermDebtList[i].substring(0,4) == year )
                        monthlyTermDebtList.push(parseFloat(Math.floor(tabledata.monthlyTermDebtList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.monthlyTermDebtList",monthlyTermDebtList);
                
                
                for(var i in tabledata.displayAffordRainyDayFunds){
                    if(tabledata.displayAffordRainyDayFunds[i].substring(0,4) == year )
                        displayAffordRainyDayFunds.push(parseFloat(Math.floor(tabledata.displayAffordRainyDayFunds[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.displayAffordRainyDayFunds",displayAffordRainyDayFunds);
                
                
                for(var i in tabledata.cashAvailableForPurchaseList){
                    if(tabledata.cashAvailableForPurchaseList[i].substring(0,4) == year )
                        cashAvailableForPurchaseList.push(parseFloat(Math.floor(tabledata.cashAvailableForPurchaseList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.cashAvailableForPurchaseList",cashAvailableForPurchaseList);
                
                for(var i in tabledata.downPayment){
                    if(tabledata.downPayment[i].substring(0,4) == year )
                        downPayment.push(parseFloat(Math.floor(tabledata.downPayment[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.downPayments",downPayment);
                
                for(var i in tabledata.installment){
                    if(tabledata.installment[i].substring(0,4) == year )
                        installment.push(parseFloat(Math.floor(tabledata.installment[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.installment",installment);
                
                
                for(var i in tabledata.networthAnalysisList){
                    if(tabledata.networthAnalysisList[i].substring(0,4) == year )
                        networthAnalysisList.push(parseFloat(Math.floor(tabledata.networthAnalysisList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.networthAnalysisList",networthAnalysisList);
                
                var displayMonthRecommendList = new Array();
                var monthlySavingRecommendList = new Array();
                var monthlyExpenseRecommendList = new Array();
                var monthlyIncomeRecommendList = new Array();
                var monthlyGoalTargetRecommendList = new Array();
                var monthlyCreditCardRecommendList = new Array();
                var monthlyTermDebtRecommendList = new Array();
                var displayFutureAffordRainyDayFunds = new Array();
                var cashAvailableForPurchaseRecommendList = new Array();
                var downPaymentRec = new Array();
                var installmentRec = new Array();
                var networthAnalysisRecommendList = new Array();
                var yearlyListRec = new Array();
                var FutureTableselectedYear = component.get("v.FutureTableselectedYear");
                
                for(var i in tabledata.displayMonthRecommendList){
                    if(tabledata.displayMonthRecommendList[i].substring(0,4) == FutureTableselectedYear )
                        displayMonthRecommendList.push(tabledata.displayMonthRecommendList[i].substring(5));
                }
                component.set("v.displayMonthRecommendList",displayMonthRecommendList);
                
                
                for(var i in tabledata.monthlySavingRecommendList){
                    if(tabledata.monthlySavingRecommendList[i].substring(0,4) == FutureTableselectedYear )
                        monthlySavingRecommendList.push(parseFloat(Math.floor(tabledata.monthlySavingRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.monthlySavingRecommendList",monthlySavingRecommendList);
                
                
                for(var i in tabledata.monthlyExpenseRecommendList){
                    if(tabledata.monthlyExpenseRecommendList[i].substring(0,4) == FutureTableselectedYear )
                        monthlyExpenseRecommendList.push(parseFloat(Math.floor(tabledata.monthlyExpenseRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.monthlyExpenseRecommendList",monthlyExpenseRecommendList);
                
                
                for(var i in tabledata.monthlyIncomeRecommendList){
                    if(tabledata.monthlyIncomeRecommendList[i].substring(0,4) == FutureTableselectedYear )
                        monthlyIncomeRecommendList.push(parseFloat(Math.floor(tabledata.monthlyIncomeRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.monthlyIncomeRecommendList",monthlyIncomeRecommendList);
                
                for(var i in tabledata.monthlyGoalTargetRecommendList){
                    if(tabledata.monthlyGoalTargetRecommendList[i].substring(0,4) == FutureTableselectedYear )
                        monthlyGoalTargetRecommendList.push(parseFloat(Math.floor(tabledata.monthlyGoalTargetRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.monthlyGoalTargetRecommendList",monthlyGoalTargetRecommendList);
                
                for(var i in tabledata.monthlyCreditCardRecommendList){
                    if(tabledata.monthlyCreditCardRecommendList[i].substring(0,4) == FutureTableselectedYear )
                        monthlyCreditCardRecommendList.push(parseFloat(Math.floor(tabledata.monthlyCreditCardRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.monthlyCreditCardRecommendList",monthlyCreditCardRecommendList);
                
                for(var i in tabledata.monthlyTermDebtRecommendList){
                    if(tabledata.monthlyTermDebtRecommendList[i].substring(0,4) == FutureTableselectedYear )
                        monthlyTermDebtRecommendList.push(parseFloat(Math.floor(tabledata.monthlyTermDebtRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.monthlyTermDebtRecommendList",monthlyTermDebtRecommendList);
                
                
                for(var i in tabledata.displayFutureAffordRainyDayFunds){
                    if(tabledata.displayFutureAffordRainyDayFunds[i].substring(0,4) == FutureTableselectedYear )
                        displayFutureAffordRainyDayFunds.push(parseFloat(Math.floor(tabledata.displayFutureAffordRainyDayFunds[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.displayFutureAffordRainyDayFunds",displayFutureAffordRainyDayFunds);
                
                
                for(var i in tabledata.cashAvailableForPurchaseRecommendList){
                    if(tabledata.cashAvailableForPurchaseRecommendList[i].substring(0,4) == FutureTableselectedYear )
                        cashAvailableForPurchaseRecommendList.push(parseFloat(Math.floor(tabledata.cashAvailableForPurchaseRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.cashAvailableForPurchaseRecommendList",cashAvailableForPurchaseRecommendList);
                
                for(var i in tabledata.downPaymentRec){
                    if(tabledata.downPaymentRec[i].substring(0,4) == FutureTableselectedYear )
                        downPaymentRec.push(parseFloat(Math.floor(tabledata.downPaymentRec[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.downPaymentRec",downPaymentRec);
                
                for(var i in tabledata.installmentRec){
                    if(tabledata.installmentRec[i].substring(0,4) == FutureTableselectedYear )
                        installmentRec.push(parseFloat(Math.floor(tabledata.installmentRec[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.installmentRec",installmentRec);
                
                
                for(var i in tabledata.networthAnalysisRecommendList){
                    if(tabledata.networthAnalysisRecommendList[i].substring(0,4) == FutureTableselectedYear )
                        networthAnalysisRecommendList.push(parseFloat(Math.floor(tabledata.networthAnalysisRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                }
                component.set("v.networthAnalysisRecommendList",networthAnalysisRecommendList);
                
            }
        });
        $A.enqueueAction(action);
    },
    
    
    showResult: function (component, event,helper) 
    {
        component.find("Id_spinner").set("v.class" , 'slds-show');
        var action = component.get("c.getData");
        var clientId = component.get("v.cid");  
        var Name = component.get("v.Name");
      //  alert(Name);
        var totalAmount = component.get("v.totalAmount");
     //   alert(totalAmount);
        var downPayment = component.get("v.downPayment");
    //    alert(downPayment);
        var installments = component.get("v.installments");
     //   alert(installments);
        var startDate = component.get("v.startDate");
    //    alert(startDate);
        var endDate = component.get("v.endDate");
   //     alert(endDate);
        var isTaxBenefit = component.get("v.isTaxBenefit");
    //    alert('isTaxBenefit'+isTaxBenefit);
        var isPaymentPlan = component.get("v.isPaymentPlan");
   //     alert('isPaymentPlan'+isPaymentPlan);
        var rainyDayMonths = component.get("v.rainyDayMonths");
   //     alert(rainyDayMonths);
        var taxContribution = component.get("v.taxContribution");
   //     alert(taxContribution);
         var taxMonthly = component.get("v.taxMonthly");
   //     alert(taxMonthly); 
        var taxDeduct = component.get("v.taxDeduct");
  //      alert(taxDeduct); 
		helper.resetCompareHelper(component, event, helper);    //Reset Component Options
        
        action.setParams({
            "clientId": clientId,
            "name": Name,
            "totalAmount":totalAmount,
            "downPayment":downPayment,
            "installments":installments,
            "startDate":startDate,
            "endDate":endDate,
            "isTaxBenefit":isTaxBenefit,
            "isPaymentPlan":isPaymentPlan,
            "taxContribution":taxContribution,
            "taxMonthly":taxMonthly,
            "taxDeduct":taxDeduct,
            "rainyDayMonths":rainyDayMonths
        });
        action.setCallback(this, function(response) {
            try{
                var state = response.getState();
                if (state === "SUCCESS") {
                    
                    if(response.getReturnValue().response != 'Unable to process the request, please try after some time'){
                        component.set("v.Comparetab",true);  
                    }
                    
                    component.find("Id_spinner").set("v.class" , 'slds-hide');
                    
                    component.set("v.Tabledata",response.getReturnValue().response);
                    var tabledata = component.get("v.Tabledata");
                    tabledata = JSON.parse(tabledata);
                    if(tabledata.topMessage != null && tabledata.success ==true ){
                        
                        component.set("v.istrue",true);
                        component.set("v.istrue2",false);
                        component.set("v.istrue3",true);
                        component.set("v.Green",true);
                        component.set("v.Red",false);
                        component.set("v.istrue4",false);
                        component.set("v.istrue1",false);
                        component.set("v.topmsg",tabledata.topMessage);
                        component.set("v.topmsg1",tabledata.topMessage2);
                        component.set("v.resultMessage",tabledata.resultMessage);
                        component.set("v.purchaseEffectMsg",tabledata.purchaseEffectMsg);
                        
                    }
                    
                    else{
                        component.set("v.topMessage",tabledata.topMessage);
                        component.set("v.istrue",false);
                        component.set("v.istrue1",true);
                        component.set("v.istrue4",true);
                        component.set("v.Red",true);
                        component.set("v.Green",false);
                        component.set("v.istrue3",false);
                        component.set("v.istrue2",false);
                        component.set("v.buynowMsg",tabledata.buynowMsg);
                        component.set("v.notAbleToPayMsg",tabledata.notAbleToPayMsg);
                    }
                    // if(tabledata.topMessage != null){
                    if(tabledata.topMessage != null && tabledata.success ==false && tabledata.futureFlag ==true)
                    {
                      
                        var opts = [
                            { value: "buy", label: "Buy Now" },
                            { value: "nobuy", label: "Don't Buy Now" },
                            { value: "recommend", label: "Buy When Recommended" },
                        ];
                        component.set("v.topMessage3",tabledata.topMessage3);
                        component.set("v.afford1",true);
                        component.set("v.afford2",false); 
                        component.set("v.options1",opts);
                        component.set("v.options2",opts);
                    }
                          
                    else if(tabledata.topMessage != null && tabledata.success ==false && tabledata.futureFlag ==false)
                    {
                        component.set("v.afford2",true); 
                        component.set("v.afford1",false);
                    }
                    
                    var displayMonthList = new Array();
                    var monthlySavingList = new Array();
                    var monthlyExpenseList = new Array();
                    var monthlyIncomeList = new Array();
                    var monthlyGoalTargetList = new Array();
                    var monthlyCreditCardList = new Array();
                    var monthlyTermDebtList = new Array();
                    var displayAffordRainyDayFunds = new Array();
                    var cashAvailableForPurchaseList = new Array();
                    var downPayment = new Array();
                    var installment = new Array();
                    var networthAnalysisList = new Array();
                    var yearlyList = new Array();
                    
                    //if(tabledata.yearlyList[0] == tabledata.displayMonthList)
                    
                    
                    for(var i in tabledata.displayMonthList){
                        
                        if(tabledata.displayMonthList[i].substring(0,4) == tabledata.yearlyList[0] )
                            displayMonthList.push(tabledata.displayMonthList[i].substring(5));
                    }
                    component.set("v.displayMonthList",displayMonthList);
                    
                    
                    for(var i in tabledata.monthlySavingList){
                        if(tabledata.monthlySavingList[i].substring(0,4) == tabledata.yearlyList[0] )
                            monthlySavingList.push( parseFloat(Math.floor(tabledata.monthlySavingList[i].substring(5)).toFixed(2)).toLocaleString());
                        
                    }
                    component.set("v.monthlySavingList",monthlySavingList);
                    
                    
                    for(var i in tabledata.monthlyExpenseList){
                        if(tabledata.monthlyExpenseList[i].substring(0,4) == tabledata.yearlyList[0] )
                            monthlyExpenseList.push(parseFloat(Math.floor(tabledata.monthlyExpenseList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.monthlyExpenseList",monthlyExpenseList);
                    
                    
                    for(var i in tabledata.monthlyIncomeList){
                        if(tabledata.monthlyIncomeList[i].substring(0,4) == tabledata.yearlyList[0] )
                            monthlyIncomeList.push(parseFloat(Math.floor(tabledata.monthlyIncomeList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.monthlyIncomeList",monthlyIncomeList);
                    
                    for(var i in tabledata.monthlyGoalTargetList){
                        if(tabledata.monthlyGoalTargetList[i].substring(0,4) == tabledata.yearlyList[0] )
                            monthlyGoalTargetList.push(parseFloat(Math.floor(tabledata.monthlyGoalTargetList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.monthlyGoalTargetList",monthlyGoalTargetList);
                    
                    for(var i in tabledata.monthlyCreditCardList){
                        if(tabledata.monthlyCreditCardList[i].substring(0,4) == tabledata.yearlyList[0] )
                            monthlyCreditCardList.push(parseFloat(Math.floor(tabledata.monthlyCreditCardList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.monthlyCreditCardList",monthlyCreditCardList);
                    
                    for(var i in tabledata.monthlyTermDebtList){
                        if(tabledata.monthlyTermDebtList[i].substring(0,4) == tabledata.yearlyList[0] )
                            monthlyTermDebtList.push(parseFloat(Math.floor(tabledata.monthlyTermDebtList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.monthlyTermDebtList",monthlyTermDebtList);
                    
                    
                    for(var i in tabledata.displayAffordRainyDayFunds){
                        if(tabledata.displayAffordRainyDayFunds[i].substring(0,4) == tabledata.yearlyList[0] )
                            displayAffordRainyDayFunds.push(parseFloat(Math.floor(tabledata.displayAffordRainyDayFunds[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.displayAffordRainyDayFunds",displayAffordRainyDayFunds);
                    
                    
                    for(var i in tabledata.cashAvailableForPurchaseList){
                        if(tabledata.cashAvailableForPurchaseList[i].substring(0,4) == tabledata.yearlyList[0] )
                            cashAvailableForPurchaseList.push(parseFloat(Math.floor(tabledata.cashAvailableForPurchaseList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.cashAvailableForPurchaseList",cashAvailableForPurchaseList);
                    
                    for(var i in tabledata.downPayment){
                        if(tabledata.downPayment[i].substring(0,4) == tabledata.yearlyList[0] )
                            downPayment.push(parseFloat(Math.floor(tabledata.downPayment[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.downPayments",downPayment);
                    
                    for(var i in tabledata.installment){
                        if(tabledata.installment[i].substring(0,4) == tabledata.yearlyList[0] )
                            installment.push(parseFloat(Math.floor(tabledata.installment[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.installment",installment);
                    
                    
                    for(var i in tabledata.networthAnalysisList){
                        if(tabledata.networthAnalysisList[i].substring(0,4) == tabledata.yearlyList[0] )
                            networthAnalysisList.push(parseFloat(Math.floor(tabledata.networthAnalysisList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.networthAnalysisList",networthAnalysisList);
                    
                    for(var i in tabledata.yearlyList){
                        
                        yearlyList.push(tabledata.yearlyList[i]);
                    }
                    component.set("v.yearlyList",yearlyList);
                    
                    
                    var displayMonthRecommendList = new Array();
                    var monthlySavingRecommendList = new Array();
                    var monthlyExpenseRecommendList = new Array();
                    var monthlyIncomeRecommendList = new Array();
                    var monthlyGoalTargetRecommendList = new Array();
                    var monthlyCreditCardRecommendList = new Array();
                    var monthlyTermDebtRecommendList = new Array();
                    var displayFutureAffordRainyDayFunds = new Array();
                    var cashAvailableForPurchaseRecommendList = new Array();
                    var downPaymentRec = new Array();
                    var installmentRec = new Array();
                    var networthAnalysisRecommendList = new Array();
                    var yearlyListRec = new Array();
                    
                    for(var i in tabledata.displayMonthRecommendList){
                        if(tabledata.displayMonthRecommendList[i].substring(0,4) == tabledata.yearlyListRec[0] )
                            displayMonthRecommendList.push(tabledata.displayMonthRecommendList[i].substring(5));
                    }
                    component.set("v.displayMonthRecommendList",displayMonthRecommendList);
                    
                    
                    for(var i in tabledata.monthlySavingRecommendList){
                        if(tabledata.monthlySavingRecommendList[i].substring(0,4) == tabledata.yearlyListRec[0] )
                            monthlySavingRecommendList.push(parseFloat(Math.floor(tabledata.monthlySavingRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.monthlySavingRecommendList",monthlySavingRecommendList);
                    
                    
                    for(var i in tabledata.monthlyExpenseRecommendList){
                        if(tabledata.monthlyExpenseRecommendList[i].substring(0,4) == tabledata.yearlyListRec[0] )
                            monthlyExpenseRecommendList.push(parseFloat(Math.floor(tabledata.monthlyExpenseRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.monthlyExpenseRecommendList",monthlyExpenseRecommendList);
                    
                    
                    for(var i in tabledata.monthlyIncomeRecommendList){
                        if(tabledata.monthlyIncomeRecommendList[i].substring(0,4) == tabledata.yearlyListRec[0] )
                            monthlyIncomeRecommendList.push(parseFloat(Math.floor(tabledata.monthlyIncomeRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.monthlyIncomeRecommendList",monthlyIncomeRecommendList);
                    
                    for(var i in tabledata.monthlyGoalTargetRecommendList){
                        if(tabledata.monthlyGoalTargetRecommendList[i].substring(0,4) == tabledata.yearlyListRec[0] )
                            monthlyGoalTargetRecommendList.push(parseFloat(Math.floor(tabledata.monthlyGoalTargetRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.monthlyGoalTargetRecommendList",monthlyGoalTargetRecommendList);
                    
                    for(var i in tabledata.monthlyCreditCardRecommendList){
                        if(tabledata.monthlyCreditCardRecommendList[i].substring(0,4) == tabledata.yearlyListRec[0] )
                            monthlyCreditCardRecommendList.push(parseFloat(Math.floor(tabledata.monthlyCreditCardRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.monthlyCreditCardRecommendList",monthlyCreditCardRecommendList);
                    
                    for(var i in tabledata.monthlyTermDebtRecommendList){
                        if(tabledata.monthlyTermDebtRecommendList[i].substring(0,4) == tabledata.yearlyListRec[0] )
                            monthlyTermDebtRecommendList.push(parseFloat(Math.floor(tabledata.monthlyTermDebtRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.monthlyTermDebtRecommendList",monthlyTermDebtRecommendList);
                    
                    
                    for(var i in tabledata.displayFutureAffordRainyDayFunds){
                        if(tabledata.displayFutureAffordRainyDayFunds[i].substring(0,4) == tabledata.yearlyListRec[0] )
                            displayFutureAffordRainyDayFunds.push(parseFloat(Math.floor(tabledata.displayFutureAffordRainyDayFunds[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.displayFutureAffordRainyDayFunds",displayFutureAffordRainyDayFunds);
                    
                    
                    for(var i in tabledata.cashAvailableForPurchaseRecommendList){
                        if(tabledata.cashAvailableForPurchaseRecommendList[i].substring(0,4) == tabledata.yearlyListRec[0] )
                            cashAvailableForPurchaseRecommendList.push(parseFloat(Math.floor(tabledata.cashAvailableForPurchaseRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.cashAvailableForPurchaseRecommendList",cashAvailableForPurchaseRecommendList);
                    
                    for(var i in tabledata.downPaymentRec){
                        if(tabledata.downPaymentRec[i].substring(0,4) == tabledata.yearlyListRec[0] )
                            downPaymentRec.push(parseFloat(Math.floor(tabledata.downPaymentRec[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.downPaymentRec",downPaymentRec);
                    
                    for(var i in tabledata.installmentRec){
                        if(tabledata.installmentRec[i].substring(0,4) == tabledata.yearlyListRec[0] )
                            installmentRec.push(parseFloat(Math.floor(tabledata.installmentRec[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.installmentRec",installmentRec);
                    
                    
                    for(var i in tabledata.networthAnalysisRecommendList){
                        if(tabledata.networthAnalysisRecommendList[i].substring(0,4) == tabledata.yearlyListRec[0] )
                            networthAnalysisRecommendList.push(parseFloat(Math.floor(tabledata.networthAnalysisRecommendList[i].substring(5)).toFixed(2)).toLocaleString());
                    }
                    component.set("v.networthAnalysisRecommendList",networthAnalysisRecommendList);
                    
                    for(var i in tabledata.yearlyListRec){
                        yearlyListRec.push(tabledata.yearlyListRec[i]);
                    }
                    component.set("v.yearlyListRec",yearlyListRec);
                }
            }
            catch(e){
                let isAllValid = component.find('fields').reduce(function(isValidSoFar, inputCmp){
                    //display the error messages
                    inputCmp.showHelpMessageIfInvalid();
                    //check if the validity condition are met or not.
                    return isValidSoFar && inputCmp.checkValidity();
                },true);
                
            }
        });
        
        $A.enqueueAction(action);
    },
    
    openModel: function(component, event, helper) {        
        component.set("v.CurrentTable", true);  
    },
    
    openModel1: function(component, event, helper) {        
        component.set("v.FutureTable", true);   
    },
    
    closeModel: function(component, event, helper) {
        
        component.set("v.CurrentTable", false);
        component.set("v.FutureTable", false);
    },
    
    
})
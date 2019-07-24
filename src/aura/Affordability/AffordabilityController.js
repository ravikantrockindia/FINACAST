({
    
    
    handleRadio: function yesnoCheck(component, event) {                
        component.set("v.displaySection" ,  true);        
    },
    
    
    handleRadio1: function yesnoCheck(component, event) {                
        component.set("v.displaySection" ,  false);        
    },
    
    handleRadio2: function yesnoCheck(component, event) {
       component.set("v.displaySection1", true);
        
    },
    handleRadio3: function yesnoCheck(component, event) 
    {
        if (document.getElementById('yesCheck6').checked) {
            document.getElementById('ifYes5').style.visibility = 'visible';
        }
        else document.getElementById('ifYes5').style.visibility = 'hidden';
        
    },    
    showResult: function (component, event) 
    {
        
        var action = component.get("c.getData");
        var clientId = component.get("v.cid");  
        var Name = component.get("v.Name");
        var totalAmount = component.get("v.totalAmount");
        var downPayment = component.get("v.downPayment");
        var installments = component.get("v.installments");
        var startDate = component.get("v.startDate");
        var endDate = component.get("v.endDate");
        var isTaxBenefit = component.get("v.isTaxBenefit");
        var isPaymentPlan = component.get("v.isPaymentPlan");
        var rainyDayMonths = component.get("v.rainyDayMonths");
        console.log('zzxss'+clientId);
        
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
            "rainyDayMonths":rainyDayMonths
        });
        action.setCallback(this, function(response) {
            var ac = response.getReturnValue().response;            
            component.set("v.Tabledata",response.getReturnValue().response);
            var tabledata = component.get("v.Tabledata");
            tabledata = JSON.parse(tabledata);
            if(tabledata.topMessage != null && tabledata.success ==true ){
                
                component.set("v.istrue",true);
                component.set("v.istrue2",false);
                component.set("v.istrue3",true);
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
                component.set("v.istrue3",false);
                component.set("v.istrue2",false);
                component.set("v.buynowMsg",tabledata.buynowMsg);
                component.set("v.notAbleToPayMsg",tabledata.notAbleToPayMsg);
            }
           // if(tabledata.topMessage != null){
            if(tabledata.topMessage != null && tabledata.success ==false && tabledata.futureFlag ==true)
            {
              // alert('hey1');
                component.set("v.topMessage3",tabledata.topMessage3);
                component.set("v.afford1",true);
                component.set("v.afford2",false); 
            }
            else if(tabledata.topMessage != null && tabledata.success ==false && tabledata.futureFlag ==false)
            {
               // alert('hey00');
                component.set("v.afford2",true); 
                component.set("v.afford1",false);
                console.log('sssa'+component.get("v.afford2"));
            }
            
            console.log('sssss'+tabledata);
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
            
            for(var i in tabledata.displayMonthList){
                displayMonthList.push(tabledata.displayMonthList[i].substring(5));
            }
            component.set("v.displayMonthList",displayMonthList);
            
            
            for(var i in tabledata.monthlySavingList){
                monthlySavingList.push(tabledata.monthlySavingList[i].substring(5));
                
            }
            component.set("v.monthlySavingList",monthlySavingList);
            
            
            for(var i in tabledata.monthlyExpenseList){
                monthlyExpenseList.push(tabledata.monthlyExpenseList[i].substring(5));
            }
            component.set("v.monthlyExpenseList",monthlyExpenseList);
            
            
            for(var i in tabledata.monthlyIncomeList){
                monthlyIncomeList.push(tabledata.monthlyIncomeList[i].substring(5));
            }
            component.set("v.monthlyIncomeList",monthlyIncomeList);
            
            for(var i in tabledata.monthlyGoalTargetList){
                monthlyGoalTargetList.push(tabledata.monthlyGoalTargetList[i].substring(5));
            }
            component.set("v.monthlyGoalTargetList",monthlyGoalTargetList);
            
            for(var i in tabledata.monthlyCreditCardList){
                monthlyCreditCardList.push(tabledata.monthlyCreditCardList[i].substring(5));
            }
            component.set("v.monthlyCreditCardList",monthlyCreditCardList);
            
            for(var i in tabledata.monthlyTermDebtList){
                monthlyTermDebtList.push(tabledata.monthlyTermDebtList[i].substring(5));
            }
            component.set("v.monthlyTermDebtList",monthlyTermDebtList);
            
            
            for(var i in tabledata.displayAffordRainyDayFunds){
                displayAffordRainyDayFunds.push(tabledata.displayAffordRainyDayFunds[i].substring(5));
            }
            component.set("v.displayAffordRainyDayFunds",displayAffordRainyDayFunds);
            
            
            for(var i in tabledata.cashAvailableForPurchaseList){
                cashAvailableForPurchaseList.push(tabledata.cashAvailableForPurchaseList[i].substring(5));
            }
            component.set("v.cashAvailableForPurchaseList",cashAvailableForPurchaseList);
            
            for(var i in tabledata.downPayment){
                downPayment.push(tabledata.downPayment[i].substring(5));
            }
            component.set("v.downPayments",downPayment);
            
            for(var i in tabledata.installment){
                installment.push(tabledata.installment[i].substring(5));
            }
            component.set("v.installment",installment);
            
            
            for(var i in tabledata.networthAnalysisList){
                networthAnalysisList.push(tabledata.networthAnalysisList[i].substring(5));
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
                displayMonthRecommendList.push(tabledata.displayMonthRecommendList[i].substring(5));
            }
            component.set("v.displayMonthRecommendList",displayMonthRecommendList);
            
            
            for(var i in tabledata.monthlySavingRecommendList){
                monthlySavingRecommendList.push(tabledata.monthlySavingRecommendList[i].substring(5));
            }
            component.set("v.monthlySavingRecommendList",monthlySavingRecommendList);
            
            
            for(var i in tabledata.monthlyExpenseRecommendList){
                monthlyExpenseRecommendList.push(tabledata.monthlyExpenseRecommendList[i].substring(5));
            }
            component.set("v.monthlyExpenseRecommendList",monthlyExpenseRecommendList);
            
            
            for(var i in tabledata.monthlyIncomeRecommendList){
                monthlyIncomeRecommendList.push(tabledata.monthlyIncomeRecommendList[i].substring(5));
            }
            component.set("v.monthlyIncomeRecommendList",monthlyIncomeRecommendList);
            
            for(var i in tabledata.monthlyGoalTargetRecommendList){
                monthlyGoalTargetRecommendList.push(tabledata.monthlyGoalTargetRecommendList[i].substring(5));
            }
            component.set("v.monthlyGoalTargetRecommendList",monthlyGoalTargetRecommendList);
            
            for(var i in tabledata.monthlyCreditCardRecommendList){
                monthlyCreditCardRecommendList.push(tabledata.monthlyCreditCardRecommendList[i].substring(5));
            }
            component.set("v.monthlyCreditCardRecommendList",monthlyCreditCardRecommendList);
            
            for(var i in tabledata.monthlyTermDebtRecommendList){
                monthlyTermDebtRecommendList.push(tabledata.monthlyTermDebtRecommendList[i].substring(5));
            }
            component.set("v.monthlyTermDebtRecommendList",monthlyTermDebtRecommendList);
            
            
            for(var i in tabledata.displayFutureAffordRainyDayFunds){
                displayFutureAffordRainyDayFunds.push(tabledata.displayFutureAffordRainyDayFunds[i].substring(5));
            }
            component.set("v.displayFutureAffordRainyDayFunds",displayFutureAffordRainyDayFunds);
            
            
            for(var i in tabledata.cashAvailableForPurchaseRecommendList){
                cashAvailableForPurchaseRecommendList.push(tabledata.cashAvailableForPurchaseRecommendList[i].substring(5));
            }
            component.set("v.cashAvailableForPurchaseRecommendList",cashAvailableForPurchaseRecommendList);
            
            for(var i in tabledata.downPaymentRec){
                downPaymentRec.push(tabledata.downPaymentRec[i].substring(5));
            }
            component.set("v.downPaymentRec",downPaymentRec);
            
            for(var i in tabledata.installmentRec){
                installmentRec.push(tabledata.installmentRec[i].substring(5));
            }
            component.set("v.installmentRec",installmentRec);
            
            
            for(var i in tabledata.networthAnalysisRecommendList){
                networthAnalysisRecommendList.push(tabledata.networthAnalysisRecommendList[i].substring(5));
            }
            component.set("v.networthAnalysisRecommendList",networthAnalysisRecommendList);
            
            for(var i in tabledata.yearlyListRec){
                yearlyListRec.push(tabledata.yearlyListRec[i]);
            }
            component.set("v.yearlyListRec",yearlyListRec);
            console.log();
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
    showFinHealth : function(component) {
        var data;
        var offset;
        var d1 = new Array();
        var chartLabels = new Array();
        var chartDataSet = new Array();
        
        //redundant method
        var action = component.get("c.getData");  
        action.setParams({
            clId: "init"
        })
        action.setCallback(this, function(response) {
            component.set("v.data",response.getReturnValue().response);
            //use data attribute instead
            data= component.get("v.data");
            console.log("!!!!"+data);
            data = JSON.parse(data);
            if($A.util.isUndefinedOrNull(data) != true) {
                offset = data.offset;
                component.set("v.year", offset);
                var d1 = new Array();
                for(var i = 0 ; i < data.simulationData.profileData.financialHealthAnalysis.length ; i++){
                    d1.push([(offset+i), data.simulationData.profileData.financialHealthAnalysis[i].score]);
                    chartLabels.push(offset+i);
                    chartDataSet.push(data.simulationData.profileData.financialHealthAnalysis[i].score.toPrecision(2));
                }
                
                var greenGoalMsg=false;
                var greenGoalMsgCounter=-1;
                var diagnosis = data;
                var tafiScore = diagnosis.simulationData.profileData.financialHealthAnalysis[0];
                var messages = new Array();
                if(tafiScore.greenMessage != null && tafiScore.greenMessage != undefined){
                    messages.push({type:0, message:tafiScore.greenMessage});
                    if(tafiScore.greenMessage.indexOf("goal")>0){
                        greenGoalMsg=true;
                        greenGoalMsgCounter++;
                    }
                }
                if(tafiScore.redMessage != null && tafiScore.redMessage != undefined){
                    messages.push({type:1, message:tafiScore.redMessage});
                    if(tafiScore.redMessage.indexOf("goal")>0){
                        greenGoalMsg=false;
                        greenGoalMsgCounter++;
                    }
                }
                if(tafiScore.surviveMessage != null && tafiScore.surviveMessage != undefined){
                    messages.push({type:2, message:tafiScore.surviveMessage});
                }
                
                //set financial Health Message
                component.set("v.financialHealthMessage", messages);           
                component.set("v.score",chartDataSet[0]);
                component.set("v.data",data);
                
                var chartdata = component.get("v.chartDataObject");
                if(chartdata) {
                    chartData.destroy();
                }
                chartdata = {
                    labels: chartLabels,
                    datasets: [
                        {
                            label:'Your Financial Health Score',
                            data: chartDataSet,
                            borderColor:'rgba(62, 159, 222, 0.5)',
                            fill: true,
                            pointBackgroundColor: "#FFFFFF",
                            pointBorderWidth: 4,
                            pointHoverRadius: 5,
                            pointRadius: 3,
                            bezierCurve: true,
                            pointHitRadius: 10
                        }
                    ]
                }
                var something = component.find("financialHealthGraph");
                var ctx = component.find("financialHealthGraph").getElement();
                var lineChart = new Chart(ctx ,{
                    type: 'line',
                    data: chartdata,
                    options: {	
                        legend: {
                            position: 'bottom',
                            padding: 10,
                        },
                        scales: {xAxes: [{
                            gridLines: {
                                color: "rgba(0, 0, 0, .1)",
                            }
                        }],
                                 yAxes: [{
                                     gridLines: {
                                         color: "rgba(0, 0, 0, .1)",
                                     } ,ticks:{
                                         max: 10,
                                         min: 0,
                                         stepSize:1,
                                         callback: function(label, index, labels) {
                                             return Intl.NumberFormat().format(label);}
                                     }  
                                 }]
                                },
                        responsive: true
                    }
                }); 
                
                var scenario = component.get("v.scenario");
                if(scenario) {
                    var debtForecastAction = component.get('c.debtForecast');
                    $A.enqueueAction(debtForecastAction);
                    var shownetWorthDataAction = component.get('c.shownetWorthData');
                    $A.enqueueAction(shownetWorthDataAction);
                    var goalForecastAction = component.get('c.goalForecast');
                    $A.enqueueAction(goalForecastAction);
                }
            }
        });
        $A.enqueueAction(action); 
    },
    
})
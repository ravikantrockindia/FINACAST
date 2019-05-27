({

    
    handleRadio: function yesnoCheck(component, event) {                
        component.set("v.displaySection" ,  true);        
    },
    
    
    handleRadio1: function yesnoCheck(component, event) {                
        component.set("v.displaySection" ,  false);        
    },
    
    handleRadio2: function yesnoCheck(component, event) {
        if (document.getElementById('yesCheck2').checked) {
            document.getElementById('ifYes1').style.visibility = 'visible';
        }
        else document.getElementById('ifYes1').style.visibility = 'hidden';
        
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
        var action = component.get("c.ShowAffordabilityResult");
        var a9 = component.get("v.Name");
        var a1 = component.get("v.totalAmount");
        var a2 = component.get("v.downPayment");
        var a3 = component.get("v.installments");
        var a4 = component.get("v.startDate");
        var a5 = component.get("v.endDate");
        var a6 = component.get("v.isTaxBenefit");
        var a7 = component.get("v.isPaymentPlan");
        var a8 = component.get("v.rainyDayMonths");
        console.log(a9);
        console.log(a8);
        console.log(a1);
        console.log(a7);
        action.setParams({
            "name": a9,
            "totalAmount":a1,
            "downPayment":a2,
            "installments":a3,
            "startDate":a4,
            "endDate":a5,
            "isTaxBenefit":a6,
            "isPaymentPlan":a7,
            "rainyDayMonths":a8
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
        });
        
        $A.enqueueAction(action);
    },
    
    openModel: function(component, event, helper) {
        
        component.set("v.isOpen", true);
    },
     
    closeModel: function(component, event, helper) {
        
        component.set("v.isOpen", false);
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
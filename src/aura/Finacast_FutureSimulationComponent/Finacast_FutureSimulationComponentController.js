// Developed by Aditya Kaushal and	Karan Kehar , Winter 18

({
    doInit : function(component, event, helper) {
        if(window.location.pathname.includes("Future_Simulation_Container")){
             component.set("v.futureSim",true);
            if(!$A.util.isUndefinedOrNull(component.get("v.client"))){
           
            component.set("v.selectedClient",component.get("v.client").Id);
            console.log("v.selectedClient",component.get("v.client").Id);
            }
        }
    },
    
    changeClientData : function(component,event,helper){
        component.set("v.scenario",true);
        var params = event.getParam('arguments');
        component.set("v.selectedClient",component.get("v.client").Id);
        if(params) {
            console.log('params: ',params.changeData);
            component.set("v.data", params.changeData);
            if($A.util.isUndefinedOrNull(component.get("v.data")) != true) {
                helper.showFinHealth(component);
            }   
        }
        
    },
    //1. Financial Health Tab
    finHealth : function(component, event, helper) {
        if(!$A.util.isUndefinedOrNull(component.get("v.client"))){
        component.set("v.selectedClient",component.get("v.client").Id);
        }
        helper.showFinHealth(component);
    },
    
    //2. Debt Forecast Tab
    debtForecast : function(component, event, helper){
        helper.showDebtForecast(component);
    },	
    
    //3. Networth Tab
    shownetWorthData : function(component, event, helper) {
        helper.showNetworth(component);
    },
    
    //4. Goal Forecast Tab
    goalForecast : function(component, event, helper) {  
        helper.showGoalForecast(component);
    },
    
    //2.1 Previous Year Data Interest
    showYearlyInterestPrev : function (component, event, helper){
        helper.prevYearlyInterest(component);     
    },
    
    //2.2 Next Year Data Interest
    showYearlyInterestNext : function (component, event, helper){
        helper.nextYearlyInterest(component);
    },
    
    //2.3 Debt Analysis Messages
    showDebtAnalysis: function(component, event, helper){
        helper.debtAnalysis(component);
    },    
    
    //3.1 Networth for next year
    showNetWorthPrev:function(component,event,helper){
        helper.prevNetworth(component);
        
        /*
        if(currentYear==offset) {
            var htmlStringBuffer ="Your net worth for the year "+currentYear+" is " + currSymbol +parseFloat(objNetworthArr[currentYear-offset]);
        } else if(currentYear>=offset) {
            currentNetWorthYear=currentYear;
            length = objMainArr.yearlyData[0].length;
            var beginningProfileNetWorth = objMainArr.yearlyData[0][length-1];
            length = objMainArr.yearlyData[currentYear-offset].length;
            var profileNetWorth = objMainArr.yearlyData[currentYear-offset][length-1];
            var htmlStringBuffer ="";
			
            if(profileNetWorth > beginningProfileNetWorth) {
                var profileNetWorthChange = profileNetWorth - beginningProfileNetWorth;
                var increasePercent = parseFloat((parseFloat(profileNetWorthChange)/parseFloat(beginningProfileNetWorth))*100).toFixed(2);
                if(increasePercent<0){
                    increasePercent = increasePercent*-1;
                }
                htmlStringBuffer+="Between "+offset+" and "+currentYear+" your net worth increases by " + currSymbol + profileNetWorthChange.formatMoney()+". This is a "+increasePercent+"% increase";
            }else{
                var profileNetWorthChange = beginningProfileNetWorth - profileNetWorth ;
                var decreasePercent=parseFloat((parseFloat(profileNetWorthChange)/parseFloat(beginningProfileNetWorth))*100).toFixed(2);
                if(decreasePercent<0){
                    decreasePercent=decreasePercent*-1;
                }
                htmlStringBuffer+="Between "+offset+" and "+currentYear+" your net worth decrease by "+ currSymbol + profileNetWorthChange.formatMoney()+". This is a "+decreasePercent+"% decrease";
            }
        } else {
            alert("Sorry can not display previous year data");
        }
        */
    },
    
    //3.2 Networth for previous year
    showNetWorthNext:function(component,event,helper){
        helper.nextNetworth(component);
    },
    
    //1.1 Next Year Financial Health Score
    showYearlyScoreNext:function(component,event,helper){
        helper.showNextYearlyScore(component);
    },
    
    //1.2 Previous Year Financial Health Score
    showYearlyScorePrev:function(component,event,helper){
        helper.showPrevYearlyScore(component);
    },
    
    loadClientFutureSim : function(component, event, helper) {
        var data;
        var offset;
        var d1 = new Array();
        var chartLabels = new Array();
        var chartDataSet = new Array();
        var client= component.get("v.selectedClient");
        console.log('kkk'+client );
        if(!$A.util.isEmpty(client) && !$A.util.isUndefined(client) && client!= ""){
            var action = component.get("c.getData");  
            action.setParams({
                clId:client.toString()
            })
            
            console.log('ClientChanged: ' + client);
            action.setCallback(this, function(response) {   
                data = response.getReturnValue().response;
                console.log('Future Simulation Response on Change Client: ' + JSON.stringify(data));
                try {
                    data = JSON.parse(data);
                    offset = data.offset;
                    component.set("v.year", offset);
                    component.set("v.client",response.getReturnValue().clientAcc);
                    var d1 = new Array();
                    for(var i = 0 ; i < data.financialHealthAnalysis.length ; i++){
                        d1.push([(offset+i), data.financialHealthAnalysis[i].score]);
                        chartLabels.push(offset+i);
                        chartDataSet.push(data.financialHealthAnalysis[i].score.toPrecision(2));
                    }
                    
                    var greenGoalMsg=false;
                    var greenGoalMsgCounter=-1;
                    var diagnosis = data;
                    var tafiScore = diagnosis.financialHealthAnalysis[0];
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
                } catch(e) {
                    helper.showtoast2(component,event,helper);
                }
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
            });
            $A.enqueueAction(action);
        }
    },
    
    openHelpBox:function(component,event,helper){
        console.log("help");
        component.set("v.helpBox",true);
        console.log(component.get("v.helpBox"));
    },
    
    closeHelpBox:function(component,event,helper){
        console.log("close help box");
        component.set("v.helpBox",false);
        // component.get("v.seeHowBox",false);
        
    },
    
    openSeeHow:function(component,event,helper){
        var data=new Object();
        component.set('v.defaultAlertData',data);
        component.set('v.interestAlertData',data);
        console.log('open See How');
        component.set("v.seeHowBox",true);
        var type=event.target.id;
        if(type=='default'){
            helper.showDefaultAlertTable(component,event);
        }
        else if(type='interest'){
            helper.showInterestAlertTable(component,event);
            
        }
    },
    closeSeeHow:function(component,event,helper){
        component.set("v.seeHowBox",false);
    },
    opentest:function(component,event,helper){
        component.set("v.test",true);
    },
    changeClient :function(component,event,helper){
        console.log(component.find("inf1").get("v.value"));
    },
    
    
})
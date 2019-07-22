({
    showtoast : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type" : "error",
            "title": "Error!",
            "message": "Sorry can not display year data"
        });
        toastEvent.fire();
    },
    
    showtoast2 : function(component,event,helper) {
        var event = $A.get("e.force:showToast");
        event.setParams({
            "type" : "Error",
            "title" : "Insufficient Data!",
            "message" : "Insufficient data present for the user."
        });
        event.fire();
    },
    
    showFinHealth : function(component) {
        var data;
        var offset;
        var d1 = new Array();
        var chartLabels = new Array();
        var chartDataSet = new Array();
        
        //redundant method
        console.log('initially data in fsc: ',JSON.stringify(component.get("c.getData") ));
        var action = component.get("c.getData");  
        action.setParams({
            clId: "init"
        })
        action.setCallback(this, function(response) {
            try{
            //use data attribute instead
            data= component.get("v.data");
                console.log('data in setcallback: ', data);
            console.log("!!!!"+data);
            data = JSON.parse(data);
            console.log("!!!!"+data);
            if($A.util.isUndefinedOrNull(data) != true) {
                offset = data.offset;
                component.set("v.year", offset);
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
            }
            catch(e){
                
            }
        });
        $A.enqueueAction(action); 
    },
    
    showDebtForecast : function(component) {
        var data;
        var offset;
        var d1 = new Array();
        var chartLabels = new Array();
        var chartDataSet = new Array();
        //var action = component.get("c.print");  
        var shortTermYearlyInterest = new Array();
        var debtList = new Array();
        var debtList2 = new Array();
        var dataSeriesDebt = new Array();
        var selected ="All";
        var flag = true;
        var tempArray;
        var startYear = 0;
        var endYear = -1;
        
        //intially set the the values
        var data = component.get("v.data");
        offset = data.offset;
        var currentDebtsAnalysisYear = component.get("v.year");
        var longtermInterest = (parseFloat(data.debtAnalysis.yearlyData[currentDebtsAnalysisYear-offset].interestOnTermDebt));
        var shorttermInterest = (parseFloat(shortTermYearlyInterest[currentDebtsAnalysisYear-offset]));
        
        if(isNaN(longtermInterest)){
            longtermInterest = 0;
        }
        if(isNaN(shorttermInterest)) {
            shorttermInterest = 0;
        }
        component.set("v.longTermLoans", Math.round(longtermInterest));
        component.set("v.shortTermLoans", Math.round(shorttermInterest));
        
       // action.setCallback(this, function(response) {
            data = component.get("v.data");
            if($A.util.isUndefinedOrNull(data) != true) {
                offset = data.offset;
                
                for(var i=startYear; i<data.debtAnalysis.yearlyData.length; i++) {
                    
                    shortTermYearlyInterest[i] = data.debtAnalysis.yearlyData[i].interestOnDebt;    
                    tempArray = data.debtAnalysis.yearlyData[i].monthlyDebts[(data.debtAnalysis.yearlyData[i].monthlyDebts.length - 1)];
                    for(var j=0; j<tempArray.length; j++) {
                        for(var k=0; k<dataSeriesDebt.length; k++) { 
                            if(tempArray[j].name == dataSeriesDebt[k].label && (selected == 'All' || selected == dataSeriesDebt[k].label)){
                                if(tempArray[j].item.termDebt && tempArray[j].item.defaultedItem != undefined && tempArray[j].item.defaultedItem != null){
                                    dataSeriesDebt[k].data.push([(offset+i), (tempArray[j].item.currentValue+tempArray[j].item.defaultedItem.currentValue)]);
                                    flag = false;
                                    endYear = i;
                                    break;
                                } else {
                                    dataSeriesDebt[k].data.push([(offset+i), tempArray[j].item.currentValue]);
                                    flag = false;
                                    endYear = i;
                                    break;
                                }
                            }
                        }
                        if(flag) {
                            if (typeof(debtList2[tempArray[j].name]) == 'undefined') {
                                debtList.push({count: 1, name:tempArray[j].name});
                                debtList2[tempArray[j].name] = 1;
                            }
                            if(selected == 'All' || selected == tempArray[j].name) {
                                d1 = new Array();
                                if(tempArray[j].item.termDebt && tempArray[j].item.defaultedItem != undefined && tempArray[j].item.defaultedItem != null){
                                    d1.push([(offset+i), (tempArray[j].item.currentValue+tempArray[j].item.defaultedItem.currentValue)]);
                                } else {
                                    d1.push([(offset+i), tempArray[j].item.currentValue]);
                                }
                                dataSeriesDebt.push({data: d1, bars: {barWidth: 0.3, align:"center", show:true}, stack:true, shadowSize: 0, label: tempArray[j].name});
                                endYear = i;
                            }
                        }
                        flag = true;  
                    }
                }
                
                
                component.set("v.shortTermYearlyInterest", shortTermYearlyInterest);
                
                //make chart Label and set points
                if($A.util.isUndefinedOrNull(dataSeriesDebt[0]) != true) {
                    for(var i = 0; i<dataSeriesDebt[0].data.length; i++)
                    {
                        chartLabels[i] = dataSeriesDebt[0]["data"][i][0];
                        chartDataSet[i] = dataSeriesDebt[0]["data"][i][1];
                    }
                }
                //Chart plotting Starts here
                var chartdata = component.get("v.chartDataObject");
                if(chartdata) {
                    chartData.destroy();
                }
                chartdata = {
                    labels: chartLabels,
                    datasets: [
                        {
                            label:'Debt Forecast',
                            data: chartDataSet,
                            backgroundColor:'rgba(0, 0, 255, 0.3)'
                        }
                    ]
                }
                
                var ctx = component.find("debtForecastGraph").getElement();
                var lineChart = new Chart(ctx ,{
                    type: 'bar',
                    data: chartdata,
                    options: {	
                        
                        //format y axis
                        scales: { 
                            yAxes: [{
                                ticks: {
                                    suggestedMin: 0,    
                                    beginAtZero: true,
                                    callback: function(label, index, labels) {
                                        return Intl.NumberFormat('Yo', { 
                                            style: 'currency', currency: 'USD', minimumFractionDigits: 0, 
                                        }).format(label);
                                    }
                                }
                            }]
                        },
                        
                        legend: {
                            position: 'bottom',
                            padding: 1,
                        },
                        responsive: true
                    }
                });   
            }
       // }); 
        //$A.enqueueAction(action);
        var c = component.get('c.showDebtAnalysis');
        $A.enqueueAction(c);
    },
    
    showNetworth : function(component) {
        var dataSeries = new Array();
        var d1 = new Array();
        var d2 = new Array();
        var networthArray=new Array();
        var length;
        var diagnosis = component.get("v.data");
        var offset = diagnosis.offset;
        var debtsArray=new Array();
        var savingsArray=new Array();
        var tempArray = new Array();
        
        var action = component.get("c.print");
        
        action.setCallback(this, function(response) {
            console.log("diag",diagnosis.netWorthAnalysis.yearlyData.length);
            for(var i=0; i<diagnosis.netWorthAnalysis.yearlyData.length; i++){
                length = diagnosis.netWorthAnalysis.yearlyData[i].length;
                console.log("len",length);
                networthArray.push([diagnosis.netWorthAnalysis.yearlyData[i][length-1]]);
                // d1.push([(offset+i-0.15), diagnosis.netWorthAnalysis.yearlyData[i][length-1]]);
                d1.push(offset+i);
                d2.push(Math.floor(diagnosis.netWorthAnalysis.yearlyData[i][length-1]));
            }
            console.log("d1",d1);
            console.log("d2",d2);
            var chartdata = component.get("v.chartDataObject");
            if(chartdata) {
                chartData.destroy();
            }
            chartdata = {
                labels: d1,
                datasets: [
                    {
                        label:'Expected Goal Performance',
                        data: d2,
                        backgroundColor: 'rgba(0, 0, 255, 0.3)'
                    }
                    
                ]
            }
            
            
            var ctx = component.find("networth").getElement();
            var lineChart = new Chart(ctx ,{
                type: 'bar',
                data: chartdata,
                options: {
                    
                    scales: {                                               
                        yAxes: [{
                            ticks: {
                                suggestedMin: 0,    
                                beginAtZero: true,
                                callback: function(label, index, labels) {
                                    return Intl.NumberFormat('Yo', { 
                                        style: 'currency', currency: 'USD', minimumFractionDigits: 0, 
                                    }).format(label);
                                }
                            }
                        }]
                    },
                    
                    legend: {
                        position: 'bottom',
                        padding: 1,
                        labels: {
                            // This more specific font property overrides the global property
                            fontColor: 'black',
                            FontSize:32,
                            fontFamily:"Helvetica",
                        },                 
                    },
                    responsive: true
                }
            });
            var data = diagnosis;
            var yearlysum;
            for(var i=0; i<(data.debtAnalysis.yearlyData.length); i++) {
                tempArray = data.debtAnalysis.yearlyData[i].monthlyDebts[(data.debtAnalysis.yearlyData[i].monthlyDebts.length - 1)];
                yearlysum=0;
                for(var j=0; j<tempArray.length; j++){
                    yearlysum+=tempArray[j].item.currentValue;
                }
                debtsArray.push(yearlysum);
            }
            for(var i=0; i<(data.yearlySavings.length); i++){
                savingsArray.push(data.yearlySavings[i]);
            }
            
            var objSavingArr=savingsArray;
            var objDebtArr=debtsArray;
            var objNetworthArr=networthArray;
            var objMainArr=data.netWorthAnalysis;
            var   currentNetWorthYear = offset;      
            // currentNetWorthYear++;
            if(currentNetWorthYear == offset){
                component.set("v.totalSavings",(Math.floor(parseFloat(objSavingArr[currentNetWorthYear-offset]))).toLocaleString());
                component.set("v.totalDebts",(Math.floor(parseFloat(objDebtArr[currentNetWorthYear-offset]))).toLocaleString());
                component.set("v.networth",(Math.floor(parseFloat(objNetworthArr[currentNetWorthYear-offset]))).toLocaleString());
                component.set("v.year", currentNetWorthYear);           
            }            
            
            //total networth
            var beginningProfileNetWorth = data.netWorthAnalysis.yearlyData[0][length-1];
            length = diagnosis.netWorthAnalysis.yearlyData[currentNetWorthYear-offset].length;
            var profileNetWorth = diagnosis.netWorthAnalysis.yearlyData[currentNetWorthYear-offset][length-1];
            var NetworthMessageJS ="Your net worth for the year "+currentNetWorthYear+" is " + Math.ceil((networthArray[0]));
            console.log("NWM" + NetworthMessageJS);
            component.set("v.NetworthMessage", NetworthMessageJS);
        });
        $A.enqueueAction(action);
    },
    
    showGoalForecast : function(component) {
        //Variables
        var data;
        var offset;
        var d1 = new Array();
        var flag = true;
        var tempArray;
        var chartLabels = new Array();
        var chartDataSet = new Array();
        var goalAnalysisYear;
        var index = 0;
        var goalGraphYearCount = 5;
        var dataSeriesGoal = new Array();
        var dataSeriesDebt = new Array();
        var action = component.get("c.print");
        
        //Callback Function
        action.setCallback(this, function(response) {      
            var data = component.get("v.data");
            //data = JSON.parse(data);
            offset = data.offset;
            goalAnalysisYear=offset;
            
            if(data.goalAnalysis.yearlyData.length == 1){
                var offset2 = data.goalAnalysis.yearlyData[0].offset;
                for(var i=0; i<data.goalAnalysis.yearlyData[0].monthlyGoals.length; i++){
                    tempArray = data.goalAnalysis.yearlyData[0].monthlyGoals[i];
                    for(var j=0; j<tempArray.length; j++){
                        for(var k=0; k<dataSeriesGoal.length; k++){
                            if(tempArray[j].name == dataSeriesGoal[k].label){
                                dataSeriesGoal[k].data.push([(offset2+i), tempArray[j].value]);
                                flag = false;
                                break;
                            }
                        }
                        if(flag){
                            d1 = new Array();
                            d1.push([(offset2+i), tempArray[j].value]);
                            dataSeriesGoal.push({data: d1, bars: {barWidth: 0.6, align:"center", show:true}, stack:true, shadowSize: 0, label: tempArray[j].name});
                        }
                        flag = true;
                    }
                }
            } else {
                for(var i=(index*goalGraphYearCount); i<data.goalAnalysis.yearlyData.length; i++){
                    tempArray = data.goalAnalysis.yearlyData[i].yearlyGoals;
                    
                    for(var j=0; j<tempArray.length; j++){
                        for(var k=0; k<dataSeriesGoal.length; k++){
                            if(tempArray[j].name == dataSeriesGoal[k].label){
                                dataSeriesGoal[k].data.push([(offset+i), tempArray[j].value]);
                                flag = false;
                                break;
                            }
                        }
                        if(flag){
                            d1 = new Array();
                            d1.push([(offset+i), tempArray[j].value]);
                            dataSeriesGoal.push({data: d1, bars: {barWidth: 0.6, align:"center", show:true}, stack:true, shadowSize: 0, label: tempArray[j].name});
                        }
                        flag = true;
                    }
                }
            }
            
            console.log("dataSeriesGoal" + JSON.stringify(dataSeriesGoal));
            
            //create Data and Y-axis labels because data is dynamic
            var datasetArray=[];
            var labelsArray = [];             
            for(var j in dataSeriesGoal) {
                var tempArray={};
                tempArray["label"] = 'Goal Forecast ' + j;
                tempArray["data"]=[];
                tempArray["dataLabels"]=[];
                for(var i = 0; i<dataSeriesGoal[j].data.length; i++)
                {                   
                    tempArray["data"].push(dataSeriesGoal[j]["data"][i][1]);
                    tempArray["dataLabels"].push(dataSeriesGoal[j]["data"][i][0]);
                }
                tempArray["backgroundColor"] = 'rgba(0, '+j+20+', 255, 0.3)';
                datasetArray.push(tempArray);
                if(tempArray["dataLabels"].length > datasetArray[0]["dataLabels"].length || j==0){
                    labelsArray = [];
                    labelsArray = tempArray["dataLabels"];
                }
            }
            for(var kh=0; kh<(1 || dataSeriesGoal.length); kh++){
                if($A.util.isUndefinedOrNull(dataSeriesGoal[kh]) != true) {
                    if(dataSeriesGoal[kh].data.length<10){
                        for (var j=dataSeriesGoal[kh].data.length;j<10;j++){
                            var d1=new Array();
                            d1 = new Array();
                            dataSeriesGoal[kh].data.push([(offset+j), parseInt(0)]);
                        }
                    }
                    console.log("inside next for");
                }
            }
            //make chart Label and set points
            chartLabels = labelsArray;
            
            console.log("Data Set Array: " + JSON.stringify(datasetArray));
            console.log("Labels Array: " + JSON.stringify(labelsArray));
            
            //Lower Comments 
            var flagAllMeet=true;
            var goalArrPositive=new Array();
            var goalArrNegative=new Array();
            var controllerGoalForecastStatusArray = new Array();
            //analysis of goal
            for (var kh = 0; kh<data.goalAnalysis.yearlyData.length; kh++) {
                var elem = data.goalAnalysis.yearlyData[kh];
                for(var ss = 0; ss<elem.yearlyGoals.length; ss++) {
                    var item = [];
                    item = elem.yearlyGoals[ss];
                    var dateMY=item.targetDate.split("/");
                    
                    if((kh+offset) == dateMY[1] || (((kh+offset) == (dateMY[1]-1)) && (dateMY[0] == 1))){
                        if(item.onTrack == 1) {
                            goalArrPositive.push(item.name+","+dateMY[0]+","+dateMY[1]);
                        } else if(item.onTrack == 0) {
                            flagAllMeet = false;
                            goalArrNegative.push(item.name);
                        }
                    }
                    if(kh == (data.goalAnalysis.yearlyData.length-1) && (dateMY[1]>(kh+offset))) {
                        if(item.onTrack == 1) {
                            goalArrPositive.push(item.name+","+dateMY[0]+","+dateMY[1]);
                        } else if(item.onTrack == 0){
                            flagAllMeet = false;
                            goalArrNegative.push(item.name);
                        }
                    }
                }   
            }
            
            if(flagAllMeet) {
                console.log("You will have all goals on target at the end of " + (data.goalAnalysis.yearlyData.length + offset));
                controllerGoalForecastStatusArray.push("You will have all goals on target at the end of " + (data.goalAnalysis.yearlyData.length + offset) +".");
            } else {
                var pos = "";
                var neg = "";
                for (var kh = 0; kh<goalArrPositive.length; kh++) {
                    var arr = goalArrPositive[kh].split(",");
                    pos+="Goal "+arr[0]+" will be met in "+arr[1]+","+arr[2];
                    if(kh<(goalArrPositive.length-1)) {
                        pos+= ",";                            
                    }
                }
                
                for (var kh = 0; kh<goalArrNegative.length; kh++) {
                    neg+= "Goal "+goalArrNegative[kh];
                    if(kh<(goalArrNegative.length-1)) {
                        neg+= ",";
                    }
                }
                if(goalArrPositive.length>0) {
                    console.log("positiveArray: " + pos +".");
                    controllerGoalForecastStatusArray.push(pos);
                }   
                if(goalArrNegative.length>0) {
                    console.log("negativeArray: " + neg + " will not be met on time." );
                    controllerGoalForecastStatusArray.push(neg + " will not be met on time.");
                }
                component.set("v.goalForecastStatus", controllerGoalForecastStatusArray);
            }
            
            
            //Chart plotting Starts here
            var chartdata = component.get("v.chartDataObject");
            if(chartdata) {
                chartData.destroy();
            }
            chartdata = {
                labels: chartLabels,
                datasets: datasetArray
            }
            
            var ctx = component.find("goalForecastGraph").getElement();
            var lineChart = new Chart(ctx ,{
                type: 'bar',
                data: chartdata,
                options: {	
                    scales: { 
                        
                        xAxes: [{
                            stacked: true
                        }],
                        
                        yAxes: [{
                            stacked: true,
                            display: true,
                            ticks: {
                                suggestedMin: 0,    
                                beginAtZero: true,
                                callback: function(label, index, labels) {
                                    return Intl.NumberFormat('Yo', { 
                                        style: 'currency', currency: 'USD', minimumFractionDigits: 0, 
                                    }).format(label);
                                }
                            }
                        }]
                    },
                    legend: {
                        position: 'bottom',
                        padding: 1,
                    },
                    responsive: true
                }
            });            
        }); 
        $A.enqueueAction(action);
    },
    
    prevYearlyInterest : function(component) {
        var data = component.get("v.data");
        var offset = data.offset;
        var shortTermYearlyInterest = component.get("v.shortTermYearlyInterest");
        var currentDebtsAnalysisYear = component.get("v.year");
        
        var decide = 'prev';
        var currentDebtsAnalysisYear;
        var debtsAnalysisYear;
        var longtermInterest;
        var shorttermInterest;
        
        //parse interest rates if previous year
        if(decide=='prev') {
            currentDebtsAnalysisYear--;
            if(currentDebtsAnalysisYear>=offset) {
                debtsAnalysisYear = (currentDebtsAnalysisYear);
                longtermInterest = (parseFloat(data.debtAnalysis.yearlyData[currentDebtsAnalysisYear-offset].interestOnTermDebt));
                shorttermInterest = (parseFloat(shortTermYearlyInterest[currentDebtsAnalysisYear-offset]));
                component.set("v.year", currentDebtsAnalysisYear);
            } else {
                var event = $A.get("e.force:showToast");
                event.setParams({ "type" : "Error", "title" : "Info !", "message" : "Sorry can not display year data." });
                event.fire();
                currentDebtsAnalysisYear++;
                longtermInterest = component.get("v.longTermLoans");
                shorttermInterest = component.get("v.shortTermLoans");
            }   
        }
        
        component.set("v.longTermLoans", Math.round(longtermInterest));
        component.set("v.shortTermLoans",Math.round(shorttermInterest));
    },
    
    nextYearlyInterest : function(component) {
        var shortTermYearlyInterest = component.get("v.shortTermYearlyInterest");   
        var currentDebtsAnalysisYear = component.get("v.year");
        var data = component.get("v.data");
        var offset = data.offset;        
        var decide = 'next';
        
        var currentDebtsAnalysisYear;        
        var debtsAnalysisYear;
        var longtermInterest;
        var shorttermInterest;      
        
        if(decide=='next') {
            currentDebtsAnalysisYear++;
            if(currentDebtsAnalysisYear<=(offset+9)) {
                debtsAnalysisYear = currentDebtsAnalysisYear;
                longtermInterest = (parseFloat(data.debtAnalysis.yearlyData[currentDebtsAnalysisYear-offset].interestOnTermDebt));
                shorttermInterest = (parseFloat(shortTermYearlyInterest[currentDebtsAnalysisYear-offset]));
                component.set("v.year", currentDebtsAnalysisYear);
            } else {
                var event = $A.get("e.force:showToast");
                event.setParams({ "type" : "Error", "title" : "Info !", "message" : "Sorry can not display year data." });
                event.fire();
                currentDebtsAnalysisYear--;
                longtermInterest = component.get("v.longTermLoans");
                shorttermInterest = component.get("v.shortTermLoans");
            }
        }
        
        component.set("v.longTermLoans", Math.round(longtermInterest));
        component.set("v.shortTermLoans", Math.round(shorttermInterest));
    },
    
    debtAnalysis : function(component) {
        
        var data = component.get("v.data");
        var element = data.debtAnalysis;
        var messages = new Array();
        var shortTermFlag = 0, shortTermDefault = 0;
        var longTermFlag = 0, longTermDefault = 0;
        var interestAccumulated = 0;
        var selected = 'All';    
        var currSymbol='$';
        console.log("inside Debt analysis");
        if(selected == 'All') {
            shortTermFlag = parseInt(element.shortTermFlag);
            longTermFlag = parseInt(element.longTermFlag);
            if(longTermFlag > 0) {
                console.log('longTermFlag',longTermFlag);
                messages.push({type:"default",termDebt:true, message:"You are likely to default on one or more of your long term loan payments.",showSeeHow:true});
            } else {
                messages.push({type:"none", termDebt:true, message:"Congratulations! You are likely to pay off your long term loan commitments on time.",showSeeHow:false});
            }
            interestAccumulated = parseFloat(element.interestOnDebt).toFixed(2);
            console.log('1')
            if(shortTermFlag == 0){
                console.log('2')
                
                messages.push({type:"none",termDebt:false, message:"Congratulations! You are likely to meet all your short term loan commitments in the next 10 years and not incur any interest charge",showSeeHow:false});
            } else if(shortTermFlag == 1) {
                console.log('3')
                
                messages.push({type:"none",termDebt:false, message:"You are likely to meet the minimum payments on your short term loans and  credit cards",showSeeHow:false});
                messages.push({type:"interest",termDebt:false, message:"You are likely to incur an interest charge on your short term debt payments amounting to "+ currSymbol +interestAccumulated+" in next 10 years.",showSeeHow:true});
            } else {
                console.log('4')
                
                messages.push({type:"default",termDebt:false, message:"You are likely to default on one or more of your credit cards in next 10 years.",showSeeHow:true});                                              
                messages.push({type:"interest",termDebt:false, message:"In addition you are likely to incur an interest charge amounting to "+currSymbol+interestAccumulated+" in next 10 years for non term debts.",showSeeHow:true});
                
            }
            console.log('5')
            
        } else {
            var element2, element3, element4;
            for(var i=0; i<element.yearlyData.length; i++){
                element2 = element.yearlyData[i].monthlyDebts;
                for(var j=0; j<element2.length; j++){
                    element3 = element2[j];
                    for(var k=0; k<element3.length; k++){
                        element4 = element3[k];
                        if(element4.name == selected){
                            if(element4.item.termDebt){
                                longTermFlag++;
                                if(element4.item.paymentDefault){
                                    longTermDefault++;
                                }
                            } else {
                                shortTermFlag++;
                                if(element4.item.paymentDefault){
                                    shortTermDefault++;
                                }
                                interestAccumulated += element4.item.interestAccumulated;
                            }
                        }
                    }
                }
            }
            if(longTermFlag>0){
                if(longTermDefault > 0){
                    messages.push({termDebt:true, message:("You are likely to default on "+selected+" payments. <span onClick='showDefaultAlertTable(event, true);' style='float: none; cursor: pointer;'>(See How)</span>")});
                } else {
                    messages.push({termDebt:true, message:"Congratulations! You are likely to pay off your long term loan commitments on time."});
                }
            }
            
            if(shortTermFlag>0){
                if(shortTermDefault == 0 && interestAccumulated <= 0){
                    messages.push({termDebt:false, message:"Congratulations! You are likely to meet all your "+selected+" payments in the next 10 year payments and not incur any interest charge"});
                } else if(shortTermDefault == 0 && interestAccumulated > 0) {
                    messages.push({termDebt:false, message:"You are likely to meet the minimum payments on "+selected});
                    messages.push({termDebt:false, message:("You are likely to incur an interest charge on your "+selected+" payments amounting to "+ currSymbol +interestAccumulated.toFixed(2)+" in next 10 years.<span onClick='showInterestAlertTable(event);' style='float: none; cursor: pointer;'>(See How)</span>")});
                } else {
                    messages.push({termDebt:false, message:("You are likely to default on "+selected+" payments.  <span onClick='showDefaultAlertTable(event, false);' style='float: none; cursor: pointer;'>(See How)</span>")});
                    messages.push({termDebt:false, message:("In addition you are likely to incur an interest charge amounting to "+ currSymbol +interestAccumulated.toFixed(2)+" in next 10 years.<span onClick='showInterestAlertTable(event);' style='float: none; cursor: pointer;'>(See How)</span>")});
                }
            }
        }
        console.log('messages',messages);
        component.set("v.debtStatus", messages);
    },
    
    prevNetworth : function(component) {
        var debtsArray=new Array();
        var savingsArray=new Array();
        var tempArray = new Array();
        var data = component.get("v.data");
        var offset = data.offset;
        var currentNetWorthYear = component.get("v.year");   
        var diagnosis = data;
        var length;
        var networthArray = new Array();;
        
        for(var i=0; i<diagnosis.netWorthAnalysis.yearlyData.length; i++){
            length = diagnosis.netWorthAnalysis.yearlyData[i].length;
            networthArray.push([diagnosis.netWorthAnalysis.yearlyData[i][length-1]]);
            
        }
        
        var yearlysum=0;
        debtsArray=new Array();
        for(var i=0; i<(data.debtAnalysis.yearlyData.length); i++){
            tempArray = data.debtAnalysis.yearlyData[i].monthlyDebts[(data.debtAnalysis.yearlyData[i].monthlyDebts.length - 1)];
            yearlysum=0;
            for(var j=0; j<tempArray.length; j++){
                yearlysum+=tempArray[j].item.currentValue;
            }
            debtsArray.push(yearlysum);
        }
        for(var i=0; i<(data.yearlySavings.length); i++){
            savingsArray.push(data.yearlySavings[i]);
        }
        
        var objSavingArr=savingsArray;
        var objDebtArr=debtsArray;
        var objNetworthArr=networthArray;
        var objMainArr=data.netWorthAnalysis;
        
        currentNetWorthYear--;
        if(currentNetWorthYear>=offset){
            
            component.set("v.totalSavings",(Math.floor(parseFloat(objSavingArr[currentNetWorthYear-offset]))).toLocaleString());
            component.set("v.totalDebts",(Math.floor(parseFloat(objDebtArr[currentNetWorthYear-offset]))).toLocaleString());
            component.set("v.networth",(Math.floor(parseFloat(objNetworthArr[currentNetWorthYear-offset]))).toLocaleString());           
            component.set("v.year", currentNetWorthYear);
            
        } else {
            //alert("Sorry can not display previous year data");
            var event = $A.get("e.force:showToast");
            event.setParams({ "type" : "Error", "title" : "Info !", "message" : "Sorry can not display year data." });
            event.fire();
        }  
    },
    
    nextNetworth : function(component) {
        var debtsArray=new Array();
        var savingsArray=new Array();
        var tempArray = new Array();
        var data = component.get("v.data");
        var offset = data.offset;
        var currentNetWorthYear = component.get("v.year"); 
        var diagnosis = data;
        var length;
        var networthArray = new Array();
        
        for(var i=0; i<diagnosis.netWorthAnalysis.yearlyData.length; i++){
            length = diagnosis.netWorthAnalysis.yearlyData[i].length;
            networthArray.push([diagnosis.netWorthAnalysis.yearlyData[i][length-1]]);
            
        }
        
        var yearlysum=0;
        debtsArray=new Array();
        
        for(var i=0; i<(data.debtAnalysis.yearlyData.length); i++) {
            tempArray = data.debtAnalysis.yearlyData[i].monthlyDebts[(data.debtAnalysis.yearlyData[i].monthlyDebts.length - 1)];
            yearlysum=0;
            for(var j=0; j<tempArray.length; j++){
                yearlysum+=tempArray[j].item.currentValue;
            }
            debtsArray.push(yearlysum);
        }
        for(var i=0; i<(data.yearlySavings.length); i++){
            savingsArray.push(data.yearlySavings[i]);
        }
        
        var objSavingArr=savingsArray;
        var objDebtArr=debtsArray;
        var objNetworthArr=networthArray;
        var objMainArr=data.netWorthAnalysis;
        
        currentNetWorthYear++;
        if(currentNetWorthYear<=(offset+9)){
            component.set("v.totalSavings",(Math.floor(parseFloat(objSavingArr[currentNetWorthYear-offset]))).toLocaleString());
            component.set("v.totalDebts",(Math.floor(parseFloat(objDebtArr[currentNetWorthYear-offset]))).toLocaleString());
            component.set("v.networth",(Math.floor(parseFloat(objNetworthArr[currentNetWorthYear-offset]))).toLocaleString());
            
            component.set("v.year", currentNetWorthYear);           
        } else {
            //alert("Sorry can not display next year data");
            var event = $A.get("e.force:showToast");
            event.setParams({ "type" : "Error", "title" : "Info !", "message" : "Sorry can not display year data." });
            event.fire();
        }
    },
    
    showNextYearlyScore : function(component) {
        var data = component.get("v.data");
        var chartDataSet = new Array();
        var d1 = new Array();
        var offset = data.offset;
        var diagnosis = data;
        
        var currentNetWorthYear = component.get("v.year");
        for(var i = 0 ; i < data.financialHealthAnalysis.length ; i++){
            d1.push([(offset+i), data.financialHealthAnalysis[i].score]);
            chartDataSet.push(data.financialHealthAnalysis[i].score.toPrecision(2));
        }
        
        var greenGoalMsg=false;
        var greenGoalMsgCounter=-1;        
        var tafiScore = diagnosis.financialHealthAnalysis[currentNetWorthYear - offset]
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
        
        
        currentNetWorthYear++;
        
        if(currentNetWorthYear<=(offset+9)){
            component.set("v.score",((parseFloat(chartDataSet[currentNetWorthYear-offset]))));
            component.set("v.year", currentNetWorthYear);
            console.log(messages);
            component.set("v.financialHealthMessage", messages);
        }
        else {
            
            var event = $A.get("e.force:showToast");
            event.setParams({ "type" : "Error", "title" : "Info !", "message" : "Sorry can not display year data." });
            event.fire();
        }
    },
    
    showPrevYearlyScore : function(component) {
        var data = component.get("v.data");
        var chartDataSet = new Array();
        var d1 = new Array();
        var offset = data.offset;
        var diagnosis = data;
        var currentNetWorthYear = component.get("v.year");
        
        for(var i = 0 ; i < data.financialHealthAnalysis.length ; i++){
            d1.push([(offset+i), data.financialHealthAnalysis[i].score]);
            chartDataSet.push(data.financialHealthAnalysis[i].score.toPrecision(2));
        }
        
        var greenGoalMsg=false;
        var greenGoalMsgCounter=-1;       
        var tafiScore = diagnosis.financialHealthAnalysis[currentNetWorthYear - offset]
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
        
        currentNetWorthYear --;
        
        if(currentNetWorthYear>=offset){
            component.set("v.score",((parseFloat(chartDataSet[currentNetWorthYear-offset]))));
            component.set("v.year", currentNetWorthYear); 
            component.set("v.financialHealthMessage", messages);
        }
        else {
            
            
            var event = $A.get("e.force:showToast");
            event.setParams({
                "type" : "Error",
                "title" : "Info !",
                "message" : "Sorry can not display year data."
            });
            event.fire();
        }
        
    },
    
    showDefaultAlertTable:function(component,event){
    var data = component.get("v.data");
        console.log(data.debtAnalysis);
    var offset=data.offset;
    var termD=event.target.name;
        //alert('temDebt',termDebt)
	var debtData = new Array();
	var paymentOwed, difference;
	var item;
	for(var i=0; i<data.debtAnalysis.yearlyData.length; i++){
		paymentOwed = 0;
		difference = 0;

		for(var j=0; j<data.debtAnalysis.yearlyData[i].monthlyDebts.length; j++){
			for(var k=0; k<data.debtAnalysis.yearlyData[i].monthlyDebts[j].length; k++){
				item = data.debtAnalysis.yearlyData[i].monthlyDebts[j][k];
                console.log(item.item.termDebt.toString(), termD)
				if(item.item.termDebt.toString()== termD){
                    debugger;
                   // alert('yes')
                   console.log('yes')
					if(item.item.termDebt){
						paymentOwed += item.item.paymentDue;
						difference += item.item.difference;
                        //console.log(difference)
					
					} else {
                        debugger;
						paymentOwed += item.item.paymentDue;
						difference += item.item.difference;
                        console.log(difference)
					}
				}
			}
		}
        if(item.item.termDebt){
       // console.log(item.item.difference)
        }
		if(difference > 0){
            console.log('ddd')
			debtData.push({scale:(offset+i), owed: paymentOwed.toFixed(2), possible: (paymentOwed-difference).toFixed(2)});
		}
	}
       // alert(debtData)
	if(debtData.length > 0){
        component.set('v.defaultAlertData',debtData);
		
	}
},
    
    showInterestAlertTable: function(component, event){

        var diagnosis = component.get("v.data");
        console.log(diagnosis.debtAnalysis);
    var offset=diagnosis.offset;
    var termD=event.target.name;
	var data = new Array();
	
	var interest = 0;
	for(var i=0; i<diagnosis.debtAnalysis.yearlyData.length; i++){
			interest = parseFloat(diagnosis.debtAnalysis.yearlyData[i].interestOnDebt);
			if(interest > 0){
				data.push({scale:(offset+i), charge: interest.toFixed(2)});
			}
		}
	if(data.length > 0){
                component.set('v.interestAlertData',data);
	}
}
    
})
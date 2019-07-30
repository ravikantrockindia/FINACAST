({
    emptyCheck: function(component, obj){
        if($A.util.isUndefinedOrNull(obj.goalItems) || $A.util.isUndefinedOrNull(obj.goalsMet)){
            return true;
        }
           
        if(obj.length == 0 && obj.yearlyData.length == 0){
            return true;
        }
            return false;
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
         try{     
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
            
            //console.log("dataSeriesGoal" + JSON.stringify(dataSeriesGoal));
            
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
                }
            }
            //make chart Label and set points
            chartLabels = labelsArray;
            
            //console.log("Data Set Array: " + JSON.stringify(datasetArray));
            ///console.log("Labels Array: " + JSON.stringify(labelsArray));
            
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
               // console.log("You will have all goals on target at the end of " + (data.goalAnalysis.yearlyData.length + offset));
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
                    //console.log("positiveArray: " + pos +".");
                    controllerGoalForecastStatusArray.push(pos);
                }   
                if(goalArrNegative.length>0) {
                  //  console.log("negativeArray: " + neg + " will not be met on time." );
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
        
     }//end try
         catch(e){
             console.log('Goal Fore cast: ' + e.message);
         }
    },
})
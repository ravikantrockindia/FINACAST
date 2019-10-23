({

    generateChart : function(component, event, helper) {
     
        var offset;

                var tabledata = component.get("v.Tabledata");
                tabledata = JSON.parse(tabledata);
                
                var viewingOption=component.get("v.futureselectedValue");
                console.log('viewingOption1'+viewingOption);
                var objectDisplay ='';
                if(viewingOption=='buy'){
                    objectDisplay=tabledata.simulationData.avatarData;
                }else if(viewingOption=='nobuy'){
                    objectDisplay=tabledata.simulationData.profileData;
                }else if(viewingOption=='recommend'){
                    objectDisplay=tabledata.simulationData.recommendData;
                }
                offset = objectDisplay.offset;
                component.set("v.year", offset);
               

                var d1 = new Array();
                var chartLabels = new Array();
                var chartDataSet = new Array();
                var shortTermYearlyInterest = new Array();
                var debtList = new Array();
                var debtList2 = new Array();
                var dataSeriesDebt = new Array();
                var selected ="All";
                var flag = true;
                var tempArray;
                var startYear = 0;
                var endYear = -1;
                var index = 0;
                var goalGraphYearCount = 5;
                var dataSeriesGoal = new Array();
                var dataSeriesDebt = new Array();
                var goalAnalysisYear;
                goalAnalysisYear=offset;
                var tempArray;
                

             if(objectDisplay.goalAnalysis.yearlyData.length == 1){
                var offset2 = objectDisplay.goalAnalysis.yearlyData[0].offset;
                for(var i=0; i<objectDisplay.goalAnalysis.yearlyData[0].monthlyGoals.length; i++){
                    tempArray = objectDisplay.goalAnalysis.yearlyData[0].monthlyGoals[i];
                    for(var j=0; j<tempArray.length; j++){
                        for(var k=0; k<dataSeriesGoal.length; k++){
                            if(tempArray[j].name == dataSeriesGoal[k].label){
                                dataSeriesGoal[k].objectDisplay.push([(offset2+i), tempArray[j].value]);
                                flag = false;
                                break;
                            }
                        }
                        if(flag){
                            d1 = new Array();
                            d1.push([(offset2+i), tempArray[j].value]);
                          
                            dataSeriesGoal.push({objectDisplay: d1, bars: {barWidth: 0.6, align:"center", show:true}, stack:true, shadowSize: 0, label: tempArray[j].name});
                        }
                        flag = true;
                    }
                }
            } else {
                for(var i=(index*goalGraphYearCount); i<objectDisplay.goalAnalysis.yearlyData.length; i++){
                    tempArray = objectDisplay.goalAnalysis.yearlyData[i].yearlyGoals;
                    
                    for(var j=0; j<tempArray.length; j++){
                        for(var k=0; k<dataSeriesGoal.length; k++){
                            if(tempArray[j].name == dataSeriesGoal[k].label){
                                dataSeriesGoal[k].objectDisplay.push([(offset+i), tempArray[j].value]);
                                flag = false;
                                break;
                            }
                        }
                        if(flag){
                            d1 = new Array();
                            d1.push([(offset+i), tempArray[j].value]);
                            dataSeriesGoal.push({objectDisplay: d1, bars: {barWidth: 0.6, align:"center", show:true}, stack:true, shadowSize: 0, label: tempArray[j].name});
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
                for(var i = 0; i<dataSeriesGoal[j].objectDisplay.length; i++)
                {                   
                    tempArray["data"].push(dataSeriesGoal[j]["objectDisplay"][i][1]);
                    tempArray["dataLabels"].push(dataSeriesGoal[j]["objectDisplay"][i][0]);
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
                    if(dataSeriesGoal[kh].objectDisplay.length<10){
                        for (var j=dataSeriesGoal[kh].objectDisplay.length;j<10;j++){
                            var d1=new Array();
                            d1 = new Array();
                            dataSeriesGoal[kh].objectDisplay.push([(offset+j), parseInt(0)]);
                        }
                    }
                }
            }
        var moneyOwned=0;
        var moneytobepaid=0;
            //make chart Label and set points
            chartLabels = labelsArray;
        var dataPoints1=new Array();
            if($A.util.isUndefinedOrNull(dataSeriesGoal[0]) != true) {
                    for(var i = 0; i<dataSeriesGoal.length; i++)
                    {
                        var dataPoints=new Array();
                       // chartLabels[i] = dataSeriesGoal[0]["objectDisplay"][i][0];
                      //  chartDataSet[i] = dataSeriesGoal[0]["objectDisplay"][i][1];
                          moneyOwned += Math.floor(parseFloat(chartDataSet[i]));
                         moneytobepaid = Math.floor(parseFloat(chartDataSet[9]));
                        if(isNaN(moneytobepaid)){
                            moneytobepaid =0;
                        }
                       for(var j=0;j<dataSeriesGoal[i].objectDisplay.length;j++){
                         dataPoints.push({x: new Date(dataSeriesGoal[i].objectDisplay[j][0], 0) , y:dataSeriesGoal[i].objectDisplay[j][1]});
                     }
                     
                     var d = { type: "stackedColumn", toolTipContent: " {label} $: {y}", showInLegend:true, name:dataSeriesGoal[i].label,label:dataSeriesGoal[i].label ,yValueFormatString: "#,##0,.##K",dataPoints:dataPoints };
                     dataPoints1.push(d); 
                    }
                }
          component.set("v.moneyOwned",moneyOwned.toLocaleString());
                 component.set("v.moneytobepaid",moneytobepaid.toLocaleString());
            //console.log("Data Set Array: " + JSON.stringify(datasetArray));
            ///console.log("Labels Array: " + JSON.stringify(labelsArray));
            
            //Lower Comments 
            var flagAllMeet=true;
            var goalArrPositive=new Array();
            var goalArrNegative=new Array();
            var controllerGoalForecastStatusArray = new Array();
            //analysis of goal
            for (var kh = 0; kh<objectDisplay.goalAnalysis.yearlyData.length; kh++) {
                var elem = objectDisplay.goalAnalysis.yearlyData[kh];
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
                    if(kh == (objectDisplay.goalAnalysis.yearlyData.length-1) && (dateMY[1]>(kh+offset))) {
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
                controllerGoalForecastStatusArray.push("You will have all goals on target at the end of " + (objectDisplay.goalAnalysis.yearlyData.length + offset) +".");
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
                component.set("v.goalForecastStatus", controllerGoalForecastStatusArray[0]);
             //  debugger;
                var test = component.get("v.goalForecastStatus");
              //  console.log('Message-------'+test);
              //  console.log('controllerGoalForecastStatusArray-------'+controllerGoalForecastStatusArray);
            }
                
                
                var dps=new Array();
                for(var i=0; i<chartLabels.length; i++){
                    dps.push({x: new Date(chartLabels[i], 0) , y: chartDataSet[i],color: "lightgreen"});
                }
               
                var chart = new CanvasJS.Chart("chartContainer3.359", {
                                             height: 250, //in pixels
                width: 571,
            animationEnabled: true,
            title:{
                //text: "Debt Forecast",
                fontFamily: "arial black",
                fontColor: "#695A42"
            },
            dataPointWidth: 35,
            axisX: {
                interval: 1,
                intervalType: "year"
            },
            axisY:{
              //  valueFormatString:"#0K",
                gridColor: "#ffffff",
                tickColor: "#ffffff"
            },
            toolTip:{
                contentFormatter: function ( e ) {
                    var value = e.entries[0].dataPoint.y;
                    if(value > 999)
                    return Math.abs(value) > 999 ? Math.sign(value)*((Math.abs(value)/1000).toFixed(1)) + 'K' : Math.sign(value)*Math.abs(value)
                    else if(value < 10000000)
                     return Math.abs(value) > 999 ? Math.sign(value)*((Math.abs(value)/10000000).toFixed(1)) + 'M' : Math.sign(value)*Math.abs(value)
                      else if(value < 1000000000000)
                           return Math.abs(value) > 999 ? Math.sign(value)*((Math.abs(value)/1000000000000).toFixed(1)) + 'B' : Math.sign(value)*Math.abs(value)
                }  
            },
            data: dataPoints1
                   });
                   chart.render();
            
            
         
            
                   },
                       })
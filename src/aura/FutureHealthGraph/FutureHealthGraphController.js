({
    generateChart: function (component, event, helper) { 
        var offset;
        var Score = new Array();
        var Months = new Array();
        var chartLabels = new Array();
        var chartDataSet = new Array();
        
         var tabledata = component.get("v.Tabledata");
                tabledata = JSON.parse(tabledata);
               // console.log('Tata '+JSON.stringify(tabledata));
                var viewingOption=component.get("v.futureselectedValue");
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
                
                if($A.util.isUndefinedOrNull(tabledata) != true) {
                    for(var i = 0 ; i < objectDisplay.financialHealthAnalysis.length ; i++){
                        Score.push([(offset+i), objectDisplay.financialHealthAnalysis[i].score]);
                        chartLabels.push(offset+i);
                        chartDataSet.push(objectDisplay.financialHealthAnalysis[i].score.toPrecision(2));
                        Months.push( objectDisplay.financialHealthAnalysis[i].months);
                    }
                    
                }
                var diagnosis = objectDisplay;
                var greenGoalMsg=false;
                var greenGoalMsgCounter=-1;       
                var tafiScore = diagnosis.financialHealthAnalysis[0]
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

             //   console.log('Score'+Score);
             //   console.log('chartDataSet'+chartDataSet);
                component.set("v.YearList",chartLabels);       
                component.set("v.score",chartDataSet[0]);
                component.set("v.months",Months[0]);
                component.set("v.financialHealthMessage", messages);
                
                var financialscore=component.get("v.score");
                
                if (financialscore == 0.0){
                    component.set("v.istrue",true);
                    component.set("v.NotTrackexpense",true);
                    component.set("v.NotTrackcredit",true);
                    component.set("v.NotTrackloan",true);
                    component.set("v.NotTrackgoals",true);    
                    
                    
                }  
                else if (financialscore>0.0 && financialscore<2.0){
                    component.set("v.istrue",true);
                    component.set("v.Adviseexpense",true);
                    component.set("v.NotTrackcredit",true);
                    component.set("v.NotTrackloan",true);
                    component.set("v.NotTrackgoals",true);
                    
                }
                    else if (financialscore>2.0 && financialscore<2.25){
                        component.set("v.istrue",true);
                        component.set("v.Trackexpense",true);
                        component.set("v.NotTrackcredit",true);
                        component.set("v.Adviseloan",true);
                        component.set("v.NotTrackgoals",true);                                               
                    }
                        else if (financialscore>2.25 && financialscore<4.0){
                            component.set("v.istrue",true);
                            component.set("v.Trackexpense",true);
                            component.set("v.Advisecredit",true);
                            component.set("v.Trackloan",true);                            
                            component.set("v.NotTrackgoals",true);                            
                        }                
                            else if (financialscore>4.0 && financialscore<5.0){
                                component.set("v.istrue",true);
                                component.set("v.Trackexpense",true);
                                component.set("v.Trackcredit",true);
                                component.set("v.Trackloan",true);                               
                                component.set("v.Advisegoals",true);                                
                            }
                                else{
                                    component.set("v.istrue",true);
                                    component.set("v.Trackexpense",true);
                                    component.set("v.Trackcredit",true);
                                    component.set("v.Trackloan",true);                                    
                                    component.set("v.Trackgoals",true);     
                                }
                
                var gauge = {
                    //title:{text: "Financial Health"},
                    data : { y: chartDataSet[0]}, //gauge value change it
                    maximum : 10
                };
                
                var chart = new CanvasJS.Chart("chartContainer51");
                createGauge(chart);
                //Function for gauge
                function createGauge(chart){
                    //Caluculation of remaining parameters to render gauge with the help of doughnut
                    gauge.unoccupied = {
                        y: gauge.maximum - gauge.data.y , 
                        color: "#DEDEDE", 
                        toolTipContent: null, 
                        highlightEnabled: false,
                        click : function (){ gauge.unoccupied.exploded = true; }
                    }
                    gauge.data.click = function (){ gauge.data.exploded = true; };
                    if (financialscore>3.1 && financialscore<6.0)
                        if(!gauge.data.color)
                            gauge.data.color = "#FFFF00";
                    
                    //gauge.valueText = {text: gauge.data.y.toString(), verticalAlign :"center"};
                    
                    if (financialscore<3.0 )
                        if(!gauge.data.color)
                            gauge.data.color = "#8B0000";
                    
                    if (financialscore>6.0 )
                        if(!gauge.data.color)
                            gauge.data.color = "#008000	";
                    
                    var data = {
                        type: "doughnut",
                        innerRadius: 100,
                        dataPoints: [
                            {
                                y: gauge.maximum ,
                                color: "transparent",
                                toolTipContent: null
                            },
                            gauge.data,
                            gauge.unoccupied
                        ],
                    };            
                    if(!chart.options.data)
                        chart.options.data = [];
                    chart.options.data.push(data);
                    
                    if(gauge.title){
                        chart.options.title = gauge.title;
                    }
                    //For showing value
                    if(!chart.options.subtitles)
                        chart.options.subtitles = [];
                    chart.options.subtitles.push(gauge.valueText);
                    
                    chart.render();
                }
        
    },
    showNextYearlyScore : function(component, event, helper) {
        var data = component.get("v.Tabledata");
        data = JSON.parse(data);
                var data = component.get("v.Tabledata");
        data = JSON.parse(data);
        
         var viewingOption=component.get("v.futureselectedValue");
        var objectDisplay ='';
        if(viewingOption=='buy'){
            objectDisplay=data.simulationData.avatarData;
        }else if(viewingOption=='nobuy'){
            objectDisplay=data.simulationData.profileData;
        }else if(viewingOption=='recommend'){
            objectDisplay=data.simulationData.recommendData;
        }
        var chartDataSet = new Array();
        var Months = new Array();
        var offset = objectDisplay.offset;
        var diagnosis = objectDisplay;
        var currentNetWorthYear = component.get("v.year");
        
        for(var i = 0 ; i < objectDisplay.financialHealthAnalysis.length ; i++){
            //  d1.push([(offset+i), data.simulationData.profileData.financialHealthAnalysis[i].score]);
            chartDataSet.push(objectDisplay.financialHealthAnalysis[i].score.toPrecision(2));
            Months.push( objectDisplay.financialHealthAnalysis[i].months);
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
       // console.log('zzzzzzzzzz'+chartDataSet);
        currentNetWorthYear++;
        
        
        if(currentNetWorthYear<=(offset+9)){
            component.set("v.score",((parseFloat(chartDataSet[currentNetWorthYear-offset]))));
            component.set("v.months",((parseFloat(Months[currentNetWorthYear-offset]))));
            component.set("v.year", currentNetWorthYear);
            component.set("v.financialHealthMessage", messages);
            var gauge = {
                //title:{text: "Financial Health"},
                data : { y: ((parseFloat(chartDataSet[currentNetWorthYear-offset])))}, //gauge value change it
                maximum : 10
            };
            var financialscore=component.get("v.score");
            var chart = new CanvasJS.Chart("chartContainer51");
            createGauge(chart);
            //Function for gauge
            function createGauge(chart){
                //Caluculation of remaining parameters to render gauge with the help of doughnut
                gauge.unoccupied = {
                    y: gauge.maximum - gauge.data.y , 
                    color: "#DEDEDE", 
                    toolTipContent: null, 
                    highlightEnabled: false,
                    click : function (){ gauge.unoccupied.exploded = true; }
                }
                gauge.data.click = function (){ gauge.data.exploded = true; };
                if (financialscore>3.1 && financialscore<6.0)
                    if(!gauge.data.color)
                        gauge.data.color = "#FFFF00";
                
                //gauge.valueText = {text: gauge.data.y.toString(), verticalAlign :"center"};
                
                if (financialscore<3.0 )
                    if(!gauge.data.color)
                        gauge.data.color = "#8B0000";
                
                if (financialscore>6.0 )
                    if(!gauge.data.color)
                        gauge.data.color = "#008000	";
                
                var data = {
                    type: "doughnut",
                    innerRadius: 100,
                    dataPoints: [
                        {
                            y: gauge.maximum ,
                            color: "transparent",
                            toolTipContent: null
                        },
                        gauge.data,
                        gauge.unoccupied
                    ],
                };            
                if(!chart.options.data)
                    chart.options.data = [];
                chart.options.data.push(data);
                
                if(gauge.title){
                    chart.options.title = gauge.title;
                }
                //For showing value
                if(!chart.options.subtitles)
                    chart.options.subtitles = [];
                chart.options.subtitles.push(gauge.valueText);
                
                chart.render();
            }          
        }
        
    },
    showPrevYearlyScore : function(component) {
        var data = component.get("v.Tabledata");
        data = JSON.parse(data);
        
        var viewingOption=component.get("v.futureselectedValue");
        var objectDisplay ='';
        if(viewingOption=='buy'){
            objectDisplay=data.simulationData.avatarData;
        }else if(viewingOption=='nobuy'){
            objectDisplay=data.simulationData.profileData;
        }else if(viewingOption=='recommend'){
            objectDisplay=data.simulationData.recommendData;
        }
        var chartDataSet = new Array();
        var Months = new Array();
        var offset = objectDisplay.offset;
        var diagnosis = objectDisplay;
        var currentNetWorthYear = component.get("v.year");
        
        for(var i = 0 ; i < objectDisplay.financialHealthAnalysis.length ; i++){
            //  d1.push([(offset+i), data.simulationData.profileData.financialHealthAnalysis[i].score]);
            chartDataSet.push(objectDisplay.financialHealthAnalysis[i].score.toPrecision(2));
            Months.push( objectDisplay.financialHealthAnalysis[i].months);
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
            component.set("v.months",((parseFloat(Months[currentNetWorthYear-offset]))));
            component.set("v.year", currentNetWorthYear); 
            component.set("v.financialHealthMessage", messages);
            var gauge = {
                //title:{text: "Financial Health"},
                data : { y: ((parseFloat(chartDataSet[currentNetWorthYear-offset])))}, //gauge value change it
                maximum : 10
            };
            var financialscore=component.get("v.score");
            var chart = new CanvasJS.Chart("chartContainer51");
            createGauge(chart);
            //Function for gauge
            function createGauge(chart){
                //Caluculation of remaining parameters to render gauge with the help of doughnut
                gauge.unoccupied = {
                    y: gauge.maximum - gauge.data.y , 
                    color: "#DEDEDE", 
                    toolTipContent: null, 
                    highlightEnabled: false,
                    click : function (){ gauge.unoccupied.exploded = true; }
                }
                gauge.data.click = function (){ gauge.data.exploded = true; };
                if (financialscore>3.1 && financialscore<6.0)
                    if(!gauge.data.color)
                        gauge.data.color = "#FFFF00";
                
                //gauge.valueText = {text: gauge.data.y.toString(), verticalAlign :"center"};
                
                if (financialscore<3.0 )
                    if(!gauge.data.color)
                        gauge.data.color = "#8B0000";
                
                if (financialscore>6.0 )
                    if(!gauge.data.color)
                        gauge.data.color = "#008000	";
                
                var data = {
                    type: "doughnut",
                    innerRadius: 100,
                    dataPoints: [
                        {
                            y: gauge.maximum ,
                            color: "transparent",
                            toolTipContent: null
                        },
                        gauge.data,
                        gauge.unoccupied
                    ],
                };            
                if(!chart.options.data)
                    chart.options.data = [];
                chart.options.data.push(data);
                
                if(gauge.title){
                    chart.options.title = gauge.title;
                }
                //For showing value
                if(!chart.options.subtitles)
                    chart.options.subtitles = [];
                chart.options.subtitles.push(gauge.valueText);
                
                chart.render();
            }
            
        }
        
    },
})
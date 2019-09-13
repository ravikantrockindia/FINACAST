({
    
    showFinHealth : function(component) {
        var data;
        var offset;
        var d1 = new Array();
        var chartLabels = new Array();
        var chartDataSet = new Array();
        //console.log("inside child: " + JSON.stringify(component.get("v.data")));
        try{
            //console.log('inside try of fh');
            data= component.get("v.data");
            //console.log(" data.financialHealthAnalysis " +  data.financialHealthAnalysis);
            //data = JSON.parse(data);
            
            if($A.util.isUndefinedOrNull(data) != true) {
                //console.log("offset in hs: " + data.offset);
                offset = data.offset;
                component.set("v.year", offset);
                var d1 = new Array();
                for(var i = 0 ; i < data.financialHealthAnalysis.length ; i++){
                    d1.push([(offset+i), data.financialHealthAnalysis[i].score]);
                    chartLabels.push(offset+i);
                    chartDataSet.push(data.financialHealthAnalysis[i].score.toPrecision(2));
                }
                console.log('offset---'+offset);
                console.log('chartDataSet---'+chartDataSet);
                console.log('chartLabels---'+chartLabels);
                var greenGoalMsg=false;
                var greenGoalMsgCounter=-1;
                var diagnosis = data;
                var tafiScore = diagnosis.financialHealthAnalysis[0];
                var messages = new Array();
                //console.log('tafi health' + tafiScore);
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
                //component.set("v.data",data);
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
                
                var chart = new CanvasJS.Chart("chartContainer2179");
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
                    
                    if(!gauge.data.color )
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
                }
                chart.render();
            }
        }//end try
        catch(e){ 
            console.log('Erroe in FH ' + e.message  + ' Name '+ e.name + ' stack ' + e.stack);}
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
            //console.log(messages);
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
})
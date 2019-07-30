({
     emptyCheck: function(component, obj){
        if(obj.length == 0){
            return true;
        }
            return false;
    },
    
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
({
    doInit : function(component, event, helper) {
        
        var cummulativeGoalAmountArray = [];
        var expectedGoalAmountArray = [];
        var MonthNumberArray=[];           //x axis labels 
        var numberOfMonths;
        var expectedGoalAmount;
        var expectedGoalAmountPerMonth;
      /*  var label1 = component.get("v.gid");
        console.log("labwl"+ label1)
        component.set("v.chartId",label1+'1')  ;
        component.set("v.gid",label1  ); */
       /* var action = component.get("c.getGoalPerformance");  //actual goal contribution
        action.setParams({
            'goalId': label1});
        action.setCallback(this, function(response) {
            var tempArray = response.getReturnValue();            console.log(JSON.stringify(tempArray))*/
            var a1=new Array();
            var a2=new Array();
        console.log(JSON.parse(JSON.stringify(component.get("v.data"))))
        var d=JSON.parse(JSON.stringify(component.get("v.data")));
        for (var index = 0; index < d.length; index++ ){
            //for(var i=0;i<tempArray[2].length;i++){
            console.log(d)
                a1.push({label: d[index].dateMonth, y: d[index].values.actual})
           // }
            //for(var i=0;i<tempArray[2].length;i++){
                a2.push({label:d[index].dateMonth, y: d[index].values.expected})
            }
            console.log(JSON.stringify(a1), a2)
                    var chartId=component.get("v.chartId")

            var chart = new CanvasJS.Chart(chartId, {
                animationEnabled: true,
                axisY: {
		prefix: "$"
	},
                data: [{
                    type: "column",
                    name: "Actual Goal Performance",
                    legendText: "Actual Goal Performance",
                    showInLegend: true, 
                    dataPoints:a1
                },
                       {
                           type: "column",	
                           name: "Expected Goal Performance",
                           legendText: "Expected Goal Performance",
                           showInLegend: true,
                           dataPoints:a2
                       }]
            });
            chart.render();
            console.log(chart.get("data"))
            
            
                //console.log(JSON.stringify(tempArray))
            /* var chartdata = {
                labels: tempArray[2],
                datasets: [
                    {
                        label:'Expected Goal Performance',
                        data: tempArray[0],
                        backgroundColor: 'rgba(0, 0, 255, 1)'
                    },
                    {
                        label:'Actual Goal Performance',
                        data: tempArray[1],
                        backgroundColor: 'rgba(255, 0, 0, 1)'
                    }
                    
                ]
            }
            
            //Get the context of the canvas element we want to select
            var ctx = component.find("mychart").getElement();
            var lineChart = new Chart(ctx ,{
                type: 'bar',
                data: chartdata,
                options: {	
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
            });*/
                            /*component.set("v.currentAmt",  tempArray[3].toString()); 
            component.set("v.goalonTrack", tempArray[4][0]);
            component.set("v.goalName", tempArray[4][2].toString());
            component.set("v.goalStatus", tempArray[4][3].toString());
            component.set("v.increaseDate", tempArray[4][4]);
            component.set("v.isMonteCarloSimulation", tempArray[4][5]);
            console.log('track'+tempArray[4][0]+tempArray[4][1] );*/
                        /*component.set("v.goalnotonTrack", tempArray[4][1]);
                        component.set("v.goalStatus", tempArray[4][3].toString());
                        component.set("v.increaseDate", tempArray[4][4]);
                        component.set("v.goalonTrack", tempArray[4][0]);




        });    
        $A.enqueueAction(action);       */
    }
    
})
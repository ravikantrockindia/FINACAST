({
	  generateChart: function (component, event, helper) { 
        debugger;
        
            var financialscore=component.get("v.res");
            var containername= component.get("v.editrecidGoal");
            var gauge = {
                
                data : { y: financialscore }, //gauge value change it
                maximum : 100
            };
            
            var chart = new CanvasJS.Chart(containername);
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
                
                if (financialscore>=30 && financialscore<60)
                    if(!gauge.data.color)
                        gauge.data.color = "#ff8400";
                
                if (financialscore<30 )
                    if(!gauge.data.color)
                        gauge.data.color = "#8B0000";
                
                if (financialscore>=60 )
                    if(!gauge.data.color)
                        gauge.data.color = "#538f56";
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
        
        
        //end set callback
        
    }
})
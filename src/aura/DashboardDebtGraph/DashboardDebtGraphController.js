({
    generateChart : function(component, event, helper) {
        var chartLabels = new Array();
        var chartDataSet = new Array();
        
        //var id = component.get("v.recordId");
        var action = component.get("c.getDebtData");
        action.setParams({
            ClientId: component.get("v.recordId")
        })
        
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                console.log("dps----", data);
                var dps1=new Array();
                for(var e in data){
                    var dp=new Array();  
                    
                    console.log(data[e])                    
                    for( var key in data[e]["datapoints"]){
                        console.log(key)
                        var s=key.split(' ')
                        
                        dp.push({x: new Date(parseInt(s[1]),parseInt(s[0])-1), y:data[e]["datapoints"][key]});
                        
                    }
                    var d = {	type: "stackedColumn",	   showInLegend:true,   yValueFormatString: "$#,##0,.##K",
                             
                             name: data[e]["debtName"],dataPoints:dp
                            };
                    dps1.push(d);
                    
                }
                /*  var colr = ["#F5A52A","#1BCDD1","#8FAABB","#B08BEB","#3EA0DD","#23BFAA","#EC5657","#4661EE"];
                        debugger;
                        var dps=new Array();
                        var month;
                        for(var j=0;j<data.monthAmount.size;j++){
                           month =data[j].monthAmount.get(j);  
                        }
                        console.log("month----", month);
                        debugger;
                        for(var i=0;i<data.length;i++){
                            var mapIter = data[i].monthAmount.keys();
                             console.log("mapIter----", mapIter);
                        var canvasData = {
                            type: "stackedColumn",
                            showInLegend: "true",
                           color: colr[i],
                           name: data[i].loanName,
                            label: data[i].monthAmount
                           // layer: mapIter.next().value
                        };
                        
                            dps.push(canvasData);
                        }
                        debugger;
                        console.log("canvasData----",canvasData);*/
                // var o ={ type: "stackedColumn", dataPoints: [ { y: 111338 , label: "USA"}, ] };
                // var ob={ type: "stackedColumn", dataPoints: [ { y: 13505 , label: "UK"}, ] };
                
                
                // var dps =new Array();
                
                
                //dps.push(o);
                //dps.push(ob);
                
                console.log('dps: ' + JSON.stringify(dps1));  
                
                var chart = new CanvasJS.Chart("chartContainer111", {
                    theme: "light1", // "light2", "dark1", "dark2"
                    animationEnabled: true, // change to true	
                    toolTip: {
                        content: "{name}: {y}"      
                    },
                    legend:{
                        cursor: "pointer",
                        itemclick: function (e) {
                            if(typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                                e.dataSeries.visible = false;
                            }
                            else {
                                e.dataSeries.visible = true;
                            }
                            chart.render();
                        }
                    },
                    axisY:{
                        valueFormatString: "$#,##0,.##K",
                        
                        //  valueFormatString:"#0K",
                        gridColor: "#ffffff",
                        tickColor: "#ffffff"
                    },
                    data: dps1
                });
                
                chart.render();
                /*var xVal = dps.length + 1;
                        //var yVal = 100;	
                        var updateInterval = 1000;
                        
                        var updateChart = function () {
                                
                            //yVal = yVal +  Math.round(5 + Math.random() *(-5-5));
                            var i =0;
                                while(i<=data.chartLabels.length){
                            dps.push({label: data.chartLabels[i] , y: data.chartDataSet[i]});
                            data.chartDataSet[i+1];
                            i=+1;
                            chart.render();	
                    }
                            
                        }
                        setInterval(function(){updateChart()}, updateInterval); */
            }
            else if (state === "INCOMPLETE") {
                console.log('do something');
            }
        });
        $A.enqueueAction(action);
        
        
    },
    
})
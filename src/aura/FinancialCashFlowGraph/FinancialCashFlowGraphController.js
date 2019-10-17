({
	generateChart : function(component, event, helper) {
        var chartLabels = new Array();
        var chartDataSet = new Array();
        
        var id = component.get("v.recordId");
        var action = component.get("c.getTransctionLoanSavingAmount");
        action.setParams({
            clientId: component.get("v.recordId")
        })
        
        action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                       var data = response.getReturnValue();
                        
                        var dps =new Array();  
                       var dps1 =new Array();
                         
                        for( var key in data.cashInValue){
                            console.log('key-----', data.cashInValue[key]);
                     
                            dps.push({label: key, y:data.cashInValue[key]});
                            
                        }
                        for( var key in data.cashOutValue){
                          
                            dps1.push({label: key, y:data.cashOutValue[key] });  
                            
                        }
                  
              var chart = new CanvasJS.Chart("chartContainer1", {
            animationEnabled: true,
            title:{
            //    text: "Cash Flow"
            },
           axisY: {
                gridColor: "#ffffff",
                      tickColor: "#ffffff"
         	},
            axisX: {
		valueFormatString: "MMM YYYY",
                intervalType: "month"
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
            legend: {
                cursor:"pointer",
                //itemclick : toggleDataSeries
            },
            //toolTip: {
               // shared: false,
                //content: toolTipFormatter
            //},
            data: [{
                 
                type: "column",
                showInLegend: true,
                name: "Cash in",
                //valueFormatString: "MMM",
                color: "#49a2ad",
                dataPoints: dps1
            },
                   {
                       type: "column",
                       showInLegend: true,
                      // valueFormatString: "MMM",
                       name: "Cash out",
                       color: "#59c96f",
                       dataPoints: dps
                   },
                  ]
                   });
                   chart.render();
                   }
                   });
                    $A.enqueueAction(action);
                   }
})
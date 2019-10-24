({
    generateChart : function(component, event, helper) {
       
        var chartLabels = new Array();
        var chartDataSet = new Array();
        var txnId=component.get("v.Tid");
        
        var action = component.get("c.getTransction");
        action.setParams({
            AccountId: txnId
        })
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                
                var data = response.getReturnValue();
                
                var dps =new Array();  
                var dps1 =new Array();
                
                for( var key in data.cashInValue){
                    
                    dps.push({label: key, y:data.cashInValue[key]});
                    
                }
                
                for( var key in data.cashOutValue){
                    
                    dps1.push({label: key, y:data.cashOutValue[key] });  
                    
                }
                
                var chart = new CanvasJS.Chart("chartContainer", {
                                          height: 400, //in pixels
                    width:944,
                    animationEnabled: true,
                    title:{
                        //    text: "Cash Flow"
                    },
                    axisY: {
                       gridColor: "#ffffff",
                      tickColor: "#ffffff"
                    },
                    axisX: {
                        
                        valueFormatString: "MMM-YYYY" ,
                        
                        //	intervalType: "month",
                        //       interval:1,
                        
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
                        
                        name: "Cash out",
                        color: "#ff6038",
                        dataPoints: dps1
                    },
                           {
                               type: "column",
                               showInLegend: true, 
                               valueFormatString: "MMM-YYYY",
                               name: "Cash in",
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
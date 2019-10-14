({
	generateChart : function(component, event, helper) {
        debugger;
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
                            console.log('key-----cash', data.cashInValue[key]);
                            console.log('key'+key);
                            var sm=key.slice(0,2);
                            console.log('sm'+sm);
                            var sy=key.slice(-4);
                            console.log('sy'+sy);
                            var s=key.split(' ');
         						dps.push({label: key, y:data.cashInValue[key]});
                         
                          console.log('dpsgraph'+JSON.stringify(dps));
                        
                            
                        }
                        console.log('dpsgraph'+dps);
                        console.log('dpsgraph'+JSON.stringify(dps));
                        for( var key in data.cashOutValue){
                          
                            var s=key.split(' ')
                       
                             var sm=key.slice(0,2);
                            console.log('sm'+sm);
                            var sy=key.slice(-4);
                            console.log('sy'+sy);

                             dps1.push({label: key, y:data.cashOutValue[key] });  
						 
                            console.log('dps1graph'+JSON.stringify(dps1));
                          
                         
                            
                        }
                  console.log('dps1graph'+dps1)
                  console.log('dps1graph'+JSON.stringify(dps1));
              var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            title:{
            //    text: "Cash Flow"
            },
           axisY: {
             ///  valueFormatString: "#,##0,.##K"
               //suffix: "K",
		       //title: "Medals"interval: 1
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
            //   valueFormatString: "MM/YYYY",
                color: "#49a2ad",
                dataPoints: dps1
            },
                   {
                       type: "column",
                       showInLegend: true,
                    //   yValueFormatString: "#,##0,.##K",
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
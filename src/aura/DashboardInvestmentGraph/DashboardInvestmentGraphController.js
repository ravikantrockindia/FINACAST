({
    myAction : function(component, event, helper) {
        
    },
    
    generateChart: function (component, event, helper) { 
        var id = component.get("v.recordId");
        var action = component.get("c.getInvestmentdata");
        action.setParams({
            ClientId: component.get("v.recordId")
        })
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                console.log(JSON.stringify(data))
                var dps =new Array();  
                var dps1 =new Array();
                for( var key in data){
                    console.log(key)
                    var s=key.split(' ')
                    dps.push({x: new Date(parseInt(s[1]),parseInt(s[0])-1), y:data[key]});
                    
                }
                console.log('key-----',dps);
                
                CanvasJS.addColorSet("greenShades",
                                     [//colorSet Array
                                         
                                         "#faab87",
                                         "#008080",
                                         "#90EE90"                
                                     ]);
                var chart = new CanvasJS.Chart("chartInvestment", {
                    colorSet: "greenShades",
                    animationEnabled: true,  
                    title:{
                        //text: "Investment"
                    },
                    axisX: {
                        //  valueFormatString: "MMM YYYY"
                    },
                    axisY: {
                        //title: "Frequeny",
                        valueFormatString: "#,##0,.##K",
                        // suffix: "M",
                        tickColor: "#ffffff" , 
                        gridColor: "#edf4f5",   
                    },
                    data: [{
                        yValueFormatString: "#,##0,.##K",
                        //                        xValueFormatString: "MMM YYYY",
                        type: "area",
                        dataPoints: dps
                    }]
                });
                chart.render();
                
            }
            else{
                console.log('abc')
            }
        });
        $A.enqueueAction(action);
        
    }
})
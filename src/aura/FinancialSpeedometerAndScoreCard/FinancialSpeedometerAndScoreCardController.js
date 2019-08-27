({
    generateChart: function (component, event, helper) {    
        var jsonResponseJs;      
        var action = component.get("c.getData");
        action.setParams({
            id:  component.get('v.clientId')
        });
        action.setCallback(this, function(response){
            try{
                var g = response.getReturnValue();
                var state = response.getState();
                if(state==="SUCCESS"&& (!($A.util.isUndefinedOrNull(g)))) {
                    //check for client
                    if(!($A.util.isUndefinedOrNull(g.firstClient))) {
                        var s= g.firstClient;
                        
                    }
                    component.set("v.isPortalUser", g.isportalUser); 
                    //Health score comes here
                    jsonResponseJs = JSON.parse(g.responseData);
                    component.set('v.score', jsonResponseJs.score.toPrecision(2));
                    
                    component.set('v.months',jsonResponseJs.months);
                    var alertArray = [];
                    alertArray.push(jsonResponseJs.greenMessage);
                    alertArray.push(jsonResponseJs.surviveMessage);
                    alertArray.push(jsonResponseJs.redMessage);
                    component.set('v.alertMessages', alertArray);
                    
                }
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
                    else if (financialscore>=2.0 && financialscore<2.25){
                        component.set("v.istrue",true);
                        component.set("v.Trackexpense",true);
                        component.set("v.NotTrackcredit",true);
                        component.set("v.Adviseloan",true);
                        component.set("v.NotTrackgoals",true);
                        
                        
                    }
                        else if (financialscore>=2.25 && financialscore<4.0){
                            component.set("v.istrue",true);
                            component.set("v.Trackexpense",true);
                            component.set("v.Advisecredit",true);
                            component.set("v.Trackloan",true);
                            
                            component.set("v.NotTrackgoals",true);
                            
                        }
                
                            else if (financialscore>=4.0 && financialscore<5.0){
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
                    
                    data : { y: financialscore }, //gauge value change it
                    maximum : 10
                };
                
                var chart = new CanvasJS.Chart("chartContainer2");
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
                        gauge.data.color = "#ff8400";
                   
                    if (financialscore<3.0 )
                    if(!gauge.data.color)
                        gauge.data.color = "#8B0000";
                   
                    if (financialscore>6.0 )
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
            } 
            //end set callback
            
            catch(e)
            {
                
                console.log('Expectation Caught'+e);
                
            }
            
        });
        $A.enqueueAction(action); 
    },
    showDetails: function(component, event, helper) {
        component.set("v.showModal", true);
        
    }
})
({
	 generateChart: function (component, event, helper) {    
              var action1=component.get('c.getNamespace');
              action1.setCallback(this, function(response) {
              var state = response.getState();
              if (state === "SUCCESS") {
              component.set("v.NameSpace", response.getReturnValue());
                var ab =response.getReturnValue();
               var eve = $A.get("e.c:changeclientevent");
       	       eve.setParams({"idclient":component.get('v.recordId')
                      
                      }); 
        	eve.fire();
            }           
        });
        $A.enqueueAction(action1);
       
        
         var jsonResponseJs;      
       
        var action = component.get("c.getData");
     
       
        action.setParams({
            id:  component.get('v.recordId')
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
              component.set("v.istrue2",true);
              component.set("v.istrue5",true);
           component.set("v.istrue8",true);
                 component.set("v.istrue11",true);    
            
          
          } 
                else if (financialscore>0.0 && financialscore<2.0){
               component.set("v.istrue",true);
              component.set("v.istrue3",true);
                component.set("v.istrue5",true);
                component.set("v.istrue8",true);
                    component.set("v.istrue11",true);
          
          }
               else if (financialscore>2.0 && financialscore<2.25){
               component.set("v.istrue",true);
                   component.set("v.istrue1",true);
                   component.set("v.istrue5",true);
              component.set("v.istrue9",true);
                       component.set("v.istrue11",true);
                   
          
          }
                   else if (financialscore>2.25 && financialscore<4.0){
               component.set("v.istrue",true);
                component.set("v.istrue1",true);
              component.set("v.istrue6",true);
                  component.set("v.istrue7",true);
                 
               component.set("v.istrue11",true);
          
          }

                    else if (financialscore>4.0 && financialscore<5.0){
               component.set("v.istrue",true);
                component.set("v.istrue1",true);
              component.set("v.istrue4",true);
                  component.set("v.istrue7",true);
                 
               component.set("v.istrue12",true);
          
          }
                        else{
                             component.set("v.istrue",true);
                component.set("v.istrue1",true);
              component.set("v.istrue4",true);
                  component.set("v.istrue7",true);
                 
               component.set("v.istrue10",true);
                            
                            
                            
                        }
                
                var gauge = {
                                 //title:{text: "Financial Health"},
                                 
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
                                 if(!gauge.data.color)
                                 gauge.data.color = "#538f56";
                                 //gauge.valueText = {text: gauge.data.y.toString(), verticalAlign :"center"};
                                 
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
                
                console.log('Expe caught'+e);
              
            }
              
        });
         $A.enqueueAction(action); 
    },
     showDetails: function(component, event, helper) {
        component.set("v.showModal", true);

    }
})
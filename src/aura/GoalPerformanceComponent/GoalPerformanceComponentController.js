({
    
    generateChart : function(component, event) {
        
        var cummulativeGoalAmountArray = [];
        var expectedGoalAmountArray = [];
        var MonthNumberArray=[];           //x axis labels 
        var numberOfMonths;
        var expectedGoalAmount;
        var expectedGoalAmountPerMonth;
        var label1 = component.get("v.gid");
        console.log("labwl"+ label1)
        if($A.util.isUndefinedOrNull(label1))
        {
         label1 = component.get("v.recordId");
            
        component.set("v.gid",label1  ); 
        }
        var tempArray;
        var action = component.get("c.goalStatus");  //actual goal contribution
        action.setParams({
            'fingoalId': label1});
        action.setCallback(this, function(response) {
            tempArray = response.getReturnValue();
            
            var chartdata = {
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
            });
            component.set("v.currentAmt",  tempArray[3].toString()); 
            component.set("v.goalonTrack", tempArray[4][0]);
            component.set("v.goalnotonTrack", tempArray[4][1]);
            component.set("v.goalName", tempArray[4][2].toString());
            component.set("v.goalStatus", tempArray[4][3].toString());
            component.set("v.increaseDate", tempArray[4][4]);
            component.set("v.isMonteCarloSimulation", tempArray[4][5]);
            console.log('track'+tempArray[4][0]+tempArray[4][1] );
        });    
        $A.enqueueAction(action);       
    }
    
    
})
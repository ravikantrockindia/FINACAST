({
   
    
    //used for chart js
    generateChart : function(component, event) {
     	
        var cummulativeGoalAmountArray = [];
        var expectedGoalAmountArray = [];
        var MonthNumberArray=[];           //x axis labels
       
        var numberOfMonths;
        var expectedGoalAmount;
        var expectedGoalAmountPerMonth;
        var label = component.get("v.gid");

        label = 'a0G46000003x4b9EAA'
        var action = component.get("c.getGoalData");  //actual goal contribution
        action.setParams({
            'GoalId': label});
        action.setCallback(this, function(response) {
            var tempArray = response.getReturnValue();
            
            var goalContribution = tempArray.item.Goal_Contribution_Per_Month__c;
            numberOfMonths = tempArray.monthCount;
            expectedGoalAmount = tempArray.item.FinServ__TargetValue__c;
            
            var expectedGoalAmountPerMonth = expectedGoalAmount/numberOfMonths;
      
            for(var i=0; i<numberOfMonths; i++)
            {
                MonthNumberArray[i] = "Month "+(i+1);
            }
            
			 for(var i=0; i<numberOfMonths; i++){
                if(expectedGoalAmountArray.length == 0){
                    expectedGoalAmountArray.push(expectedGoalAmountPerMonth);
                    cummulativeGoalAmountArray.push(goalContribution);
                    continue;
                }
                var sum = expectedGoalAmountPerMonth + expectedGoalAmountArray[i-1];
                var sum2 = goalContribution + cummulativeGoalAmountArray[i-1];
                expectedGoalAmountArray.push(sum);
                cummulativeGoalAmountArray.push(sum2);
            }
            
            
            cummulativeGoalAmountArray.push(goalContribution);
            
            var chartdata = {
                labels: MonthNumberArray,
                datasets: [
                    {
                        label:'Actual Goal Performance',
                        data: cummulativeGoalAmountArray,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)'
                    },
                    {
                        label:'Expected Goal Performance',
                        data: expectedGoalAmountArray,
                        backgroundColor: 'rgba(0, 0, 255, 0.2)'
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
                    },
                    responsive: true
                }
            });
        });     
        
        $A.enqueueAction(action);       
    }        
})
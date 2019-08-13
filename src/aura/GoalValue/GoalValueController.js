({
    doInit : function(component, event, helper) {
        var action =component.get("c.getTotalGoal");
        action.setCallback(this,function(response) {
            var state=response.getState();
            var sum=0;
            if (state === "SUCCESS") {
                var goalList = response.getReturnValue(); 
                
                for (var i = 0; i < goalList.length; i++) { 
                    sum += goalList[i].FinServ__TargetValue__c;
                }
           
                
                if(sum < 9999) {
                    component.set("v.GoalTarget",sum);
                }
                
                else if(sum < 1000000) {
                    component.set("v.GoalTarget",Math.round(sum/1000) + " K"); 
                }
                    else if( sum < 10000000) {
                        component.set("v.GoalTarget",(sum/1000000).toFixed(2) + " M");
                    }
                
                        else  if(sum < 1000000000) {
                            component.set("v.GoalTarget",Math.round((sum/1000000)) + " M");
                        }
                
                            else if(sum < 1000000000000) {
                                component.set("v.GoalTarget",Math.round((sum/1000000000)) + " B");
                            }                
                
            }
            
        });
        $A.enqueueAction(action);
        
    }
})
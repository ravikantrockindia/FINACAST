({
    init : function(component , event,helper){
        console.log("dgxdgf",window.location.pathname);
    },
    
    createRetirementRecord : function(component, event, helper) {
        var getName = event.getSource().get("v.name"); 
        var cId = component.get("v.client");
        if (getName=="RetirementRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef  : "c:RetiremenGoal" ,  
                    componentAttributes: {
                        client : cId,
                        retirement : recordType         
                    }      
                });
                evt.fire();   
            });  
        }
        $A.enqueueAction(action);
    },
    
  
        
    
    createNonRetiremntRecord : function(component, event, helper) {
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name"); 
        if (getName=="NonRetirementRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef  : "c:Goalform" ,  
                    componentAttributes: {
                        
                        nonretirement : recordType         
                    }   
                });
                evt.fire();   
            });  
        }
        $A.enqueueAction(action);
    },
     
   
 
    onGoalClick: function(component,event,helper){
        var heading,subheading;
        var clickedGoalName = event.getSource().get("v.name");
        console.log('vxwghweg'+ event.getSource().get("v.name"));
        var isRetirement , isNonRetirement = true;
       if (clickedGoalName == "NonRetirementRecordType")
                            {
                               
                            heading = "NonRetirement";
                                
                            }
          else if (clickedGoalName == "RetirementRecordType")
                                {
                                   heading ="Retirement";
                                    isRetirement = true;
                                    isNonRetirement = false; 
                                }
         var cmpTarget = component.find('exampleModal');
        $A.util.addClass(cmpTarget, 'hideDiv');
        
        var action = component.get("c.getRecordType");
        action.setParams({
            recName : clickedGoalName
        });
        action.setCallback(this, function(response) {
            component.set("v.heading",heading);
            component.set("v.isRetirement",isRetirement);
            component.set("v.isNonRetirement",isNonRetirement);
            component.set("v.recordTypeId",response.getReturnValue());
            
        });
         $A.enqueueAction(action);
        
        
        
    }
})
({	
    doInit:function(component , event , helper){
        component.set("v.addGoals",false)
       
         
      //  helper.hideExampleModal(component);   
    },
    closeModel:function(component , event , helper){
        component.set("v.modalOpen",false)
    },
    
	viewGoal : function(component, event, helper) {
		var Id= component.get("v.ccid");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:GoalInfoTab",
            componentAttributes: {
                cid : component.get("v.cid"),
                namespace : component.get("v.namespace"),
                editrecidGoal:component.get("v.GoalId")
            }
        });
        evt.fire();
        var cmpTarget = component.find('exampleModal');
        
            console.log('the cross is : '+ cmpTarget );
            $A.util.addClass(cmpTarget, 'hideDiv');
            component.set("v.isActive",false);
            var saveIncomeEvent = component.getEvent("saveIncomeEvent");
            saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
            
            saveIncomeEvent.fire();
	},
    createGoal : function(component , event , helper){
        component.set("v.addGoals" , true);
        component.set("v.modalOpen",false);
        var cmpTarget = component.find('exampleModal');
        
            console.log('the cross is : '+ cmpTarget );
            $A.util.addClass(cmpTarget, 'hideDiv');
            component.set("v.isActive",false);
            var saveIncomeEvent = component.getEvent("saveIncomeEvent");
            saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
            
            saveIncomeEvent.fire();
    }
})
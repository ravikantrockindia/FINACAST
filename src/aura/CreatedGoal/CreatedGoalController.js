({	
    doInit:function(component , event , helper){
        component.set("v.createModal1",true);
        
        component.set("v.addGoals",false);
        // helper.hideExampleModal(component);   
    },
    viewGoal : function(component, event, helper) {
        
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
        var cmpTarget = component.find('exampleModal1');
        
        console.log('the cross is : '+ cmpTarget );
        $A.util.addClass(cmpTarget, 'hideDiv');
        component.set("v.isActive",false);
        var saveIncomeEvent = component.getEvent("saveIncomeEvent");
        saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
        
        saveIncomeEvent.fire();
    },
    
    close : function(component, event, helper) {
        
        
        var cmpTarget = component.find('exampleModal1');
        
        console.log('the cross is : '+ cmpTarget );
        $A.util.addClass(cmpTarget, 'hideDiv');
        component.set("v.isActive",false);
        var saveIncomeEvent = component.getEvent("saveIncomeEvent");
        saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
        
        saveIncomeEvent.fire();
    },
    createGoal : function(component , event , helper){
        
        debugger;
        /*var Id= component.get("v.cid");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:GoalModal",
            componentAttributes: {
                client : Id,
                namespace : namespace,
               // createModal1:true
            }
        });
        evt.fire();*/
        var cmpTarget = component.find('exampleModal1');
        
        console.log('the cross is : '+ cmpTarget );
        $A.util.addClass(cmpTarget, 'hideDiv');
        component.set("v.isActive",false);
        //  component.set("v.addGoals",true);
        var saveIncomeEvent = component.getEvent("openModal");
         saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
        
        saveIncomeEvent.fire();
        debugger;
    //  component.set("v.createModal",false);
       // component.destroy();
        /*var cmpTarget = component.find('exampleModal');
        
            console.log('the cross is : '+ cmpTarget );
            $A.util.addClass(cmpTarget, 'hideDiv');
            component.set("v.isActive",false);
            var saveIncomeEvent = component.getEvent("saveIncomeEvent");
            saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
            
            saveIncomeEvent.fire();*/
        
        
        
    }
})
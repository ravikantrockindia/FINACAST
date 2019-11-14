({
    
    doInit: function(component,event,helper){
         var action=component.get('c.getNamespace');
        console.log('id hello----------'+component.get('v.recordId'));
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.namespace", response.getReturnValue());
               
            }           
        });
        $A.enqueueAction(action);
    },
    
    financialSummary: function(component,event,helper){
        var Id= component.get("v.recordId");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:ClientDetail",
            componentAttributes: {
                recordId : Id,
                NameSpace : namespace
                
            }
        });
        evt.fire();
    },
    transactionHandler: function(component,event,helper){
        var Id= component.get("v.recordId");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:transactionHistory",
            componentAttributes: {
                clientId : Id,
                namespace : namespace
                
            }
        });
        evt.fire();
        
    },
   /* ClientInformHandler: function(component,event,helper){
        var Id= component.get("v.recordId");
        // var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToSObject");
        evt.setParams({
            "recordId": Id
        });
        
        evt.fire();
    },*/
    BudgetHandler: function(component,event,helper){
        
        var Id= component.get("v.recordId");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:Budget",
            componentAttributes: {
                cid : Id,
                namespace : namespace
            }
        });
        evt.fire();
        
    },
    ScenarioHandler: function(component,event,helper){
        var Id= component.get("v.recordId");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:Finacast_ScenarioParentComponent",
            componentAttributes: {
                cid : Id,
                namespace : namespace
            }
        });
        evt.fire();
    },
    /* GoalHandler: function(component,event,helper){
        var Id= component.get("v.ccid");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:Goalfinal",
            componentAttributes: {
                cid : Id,
                namespace : namespace
            }
        });
        evt.fire();
    },*/
    /* Goal Planning ----------*/
    GoalHandler: function(component,event,helper){
        var Id= component.get("v.recordId");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:GoalPlaning",
            componentAttributes: {
                cid : Id,
                namespace : namespace
            }
        });
        evt.fire();
        $A.get('e.force:refreshView').fire();
    },
    /* Goal Planning ----------*/
    AccountHandler: function(component,event,helper){
        var Id= component.get("v.recordId");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:Finacast_Accounts",
            componentAttributes: {
                recordId : Id,
                isAccount:true,
                namespace : namespace
            }
        });
        evt.fire();
    },
    FutureHandler: function(component,event,helper){
        var Id= component.get("v.recordId");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:Finacast_FS_ParentComponent",
            componentAttributes: {
                cid : Id,
                namespace : namespace
            }
        });
        evt.fire();
    },
    AffordHandler: function(component,event,helper){
        var Id= component.get("v.recordId");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:Affordability",
            componentAttributes: {
                cid : Id,
                
            }
        });
        evt.fire();
        $A.get('e.force:refreshView').fire();
    },
     HouseholdHandler: function(component,event,helper){
        var Id= component.get("v.recordId");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:relationshipMap",
            componentAttributes: {
                ID : Id
              //  isAccount:true,
              //  namespace : namespace
            }
        });
        evt.fire();
    },
 /*   childComponentEvent: function(component,event,helper){
        var id =event.getParam("idclient");
        component.set("v.ccid ", id);
        var namespace = event.getParam("NameSpace");   
        component.set("v.namespace ", namespace);
    }*/
    
})
({
    InitGraph : function(component, event, helper) {
        helper.doInit(component,helper);
    },
    handleComponentEvent : function(cmp, event,helper) {
        // Get value from Event
        var accRec = event.getParam("eTid");
        console.log('value return after component event fire'+accRec)
        //var res = cmp.get("v.Tid");         
        // set the handler attributes based on event data
        cmp.set("v.Tid", accRec);
         
        console.log('Value of transaction in parent'+cmp.get("v.Tid"))
        var action = cmp.get("c.getCashSummary");
        action.setParams({
            AccountId: cmp.get("v.Tid")
            
        })
        action.setCallback(this, function(response) {
            var apexResponse =  response.getReturnValue();
            cmp.set("v.data",apexResponse);
            
            })
        $A.enqueueAction(action);
        
        
    } ,
     
    handleTid : function(cmp, event,helper) {
        var budgeteve1 = cmp.get("v.Tid");     
        console.log('fghjkl' , budgeteve1);
        
        
    },
    
    handleComponentEventExpense : function(cmp, event) {
       /* var budgeteve1 = cmp.get("v.getExpenseBudgetId");;      
        console.log('fghjkl' , budgeteve1);
        var action = cmp.get("c.getTransaction");
        action.setParams({
            budgetId : budgeteve1
        });
        action.setCallback(this, function(response) {    
            var beve1 = response.getReturnValue();
            console.log('gdhj' , beve1);    
            cmp.set("v.addExpenseTrans" , beve1);
        });     
        $A.enqueueAction(action);*/
        
    },
    
})
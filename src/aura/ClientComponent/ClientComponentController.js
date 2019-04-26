({
    doInit: function(component, event) {        
        var action = component.get("c.getAccounts");
        action.setCallback(this, function(response) {
            component.set("v.ClientDetails", response.getReturnValue());
            console.log(response.getReturnValue());
        });     
        $A.enqueueAction(action);
    },
    
    onClickDelete : function(component,event,helper) {   
        var action2 = component.get("c.deleteClients");
        action2.setParams({
            'ClientId' : event.getSource().get('v.value')
        });
       
        action2.setCallback(this, function(response) {
             $A.get('e.force:refreshView').fire();
        });     
        $A.enqueueAction(action2);
    },
    
    
    loadClientGoals : function(component,event,helper) {
        var clientid = component.get("v.selItem2").val;
        component.set("v.clientId" , component.get("v.selItem2").val);
        console.log(clientid);
        var action = component.get("c.getClientGoals");
        action.setParams({
            'clientId' : clientid
        });
        
        action.setCallback(this, function(response) {
            console.log(response.getReturnValue());
            component.set("v.ClientDetails", response.getReturnValue()[0]);
            
            
        });     
        $A.enqueueAction(action);
        
        
        
    },
    onClickEdit : function(component,event,helper) {
        component.set("v.showModal",true);
    },
    onClickCreate : function(component,event,helper) {
       var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef  : "c:createclientcomponent"    
        });
        evt.fire(); 
    },

    
       handleLoad : function(component,event,helper) {
       },
     handleSuccess : function(component,event,helper) {
         $A.get('e.force:refreshView').fire();
       },
     handleSubmit : function(component,event,helper) {        
           
       },
    

})
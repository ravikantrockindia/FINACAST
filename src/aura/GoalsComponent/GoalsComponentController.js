({
    doInit: function(component, event) {        
        var action = component.get("c.getGoals");
        action.setCallback(this, function(response) {
            component.set("v.GoalDetails", response.getReturnValue()[0]);
            component.set("v.clientName", response.getReturnValue()[1][0]);
            component.set("v.clientId" , response.getReturnValue()[1][1]);
            console.log(response.getReturnValue());
        });     
        $A.enqueueAction(action);
    },
    
    handleClick : function (cmp, event) {
        var cId = cmp.get("v.clientId");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef: "c:GoalTypeSelectionComponent",
            componentAttributes: {
                client : cId
            }
        });      
        evt.fire();
    },
    
    NavigateToGoalPerformance : function(cmp, event) {
        
        
        var goalid = event.getSource().get('v.value');   //fetch the id of button pressed and set it to attribute
        console.log('gid'+ goalid);
        
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef: "c:GoalPerformanceComponent" ,
            componentAttributes: {
                "gid" : goalid,
                "currentAmt":"3000"
            }
        }); 
        console.log('evt'+evt);
        evt.fire();
    },
    
    onClickDelete : function(component,event,helper) {   
        var action2 = component.get("c.deleteGoals");
        action2.setParams({
            'goalId' : event.getSource().get('v.value')
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
            component.set("v.GoalDetails", response.getReturnValue()[0]);
            component.set("v.clientName", response.getReturnValue()[1][0]);
            
            
        });     
        $A.enqueueAction(action);
        
        
        
    },
    
       handleModalEditgoalCancel: function(component) {
        $A.get('e.force:refreshView').fire();  
    },
    onClickEdit : function(component,event,helper) {
        component.set("v.showModal",true);
        console.log(event.getSource().get("v.value"));
        component.set("v.editrecid",event.getSource().get("v.value"));
       },
    
       handleLoad : function(component,event,helper) {
       },
     handleSuccess : function(component,event,helper) {
         $A.get('e.force:refreshView').fire();
       },
     handleSubmit : function(component,event,helper) {
        
           
       },
    

})
({
    newGoal : function(component, event, helper) {
        component.set("v.newGoalButtonClicked",true)
        
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
                component.set("v.retirement",recordType); 
            });  
        }
        $A.enqueueAction(action);
    },
    
    createCarRecord : function(component, event, helper) {
        console.log("sg");
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name"); 
        helper.hideExampleModal(component, event, helper);
        if (getName=="CarRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                component.set("v.car",recordType);
                
                
            });  
        }
        $A.enqueueAction(action);
    },
    
    createWeddingRecord : function(component, event, helper) {
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name");
        var cId = component.get("v.client");
        helper.hideExampleModal(component, event, helper);
        if (getName=="WeddingRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                console.log("rctype"+recordType );
                component.set("v.wedding",recordType);
                
            });  
        }
        $A.enqueueAction(action);     
    },
    
    createEducationRecord : function(component, event, helper) {
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name"); 
        helper.hideExampleModal(component, event, helper);
        if (getName=="EducationRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                component.set("v.education",recordType);
                
            });  
        }
        $A.enqueueAction(action);
    },
    
    createVacationRecord : function(component, event) {
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name"); 
        helper.hideExampleModal(component, event, helper);
        if (getName=="VacationRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                component.set("v.vacation",recordType);
                
            });  
        }
        $A.enqueueAction(action);
        
    },
    
    
    createHomeImprovementRecord : function(component, event, helper) {
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name"); 
        helper.hideExampleModal(component, event, helper);
        if (getName=="HomeImprovementRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                component.set("v.homeimprovement",recordType);
                
            });  
        }
        $A.enqueueAction(action);
    },
    
    createHomeRecord : function(component, event, helper) {
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name"); 
        helper.hideExampleModal(component, event, helper);
        if (getName=="HomeRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                component.set("v.home",recordType);
                
            });  
        }
        $A.enqueueAction(action);
    },
    
    createOthergoalRecord : function(component, event, helper) {
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name"); 
        helper.hideExampleModal(component, event, helper);
        if (getName=="OtherGoalsRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                component.set("v.othergoals",recordType);
                
            });  
        }
        $A.enqueueAction(action);
    },
    
   
    closePopUp : function(component,event)
    {
        var homeEvent = $A.get("e.force:navigateToObjectHome");
        homeEvent.setParams({
            "scope": "FinServ__FinancialGoal__c"
        });
        homeEvent.fire();
        
    },
    
})
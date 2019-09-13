({
	 doInit: function(component, event, helper) {
       // alert(component.get("v.financialGoal.Id"))
       debugger;
        var cmpTarget = component.find('exampleModal');
        
    },
   
    /*init : function(component , event,helper){
        
        var getName = event.getSource().get("v.client.Name"); 
        console.log('ggggggggggggggggggg'+getName);
        var cId = component.get("v.client");
        console.log('hhhhhhhhhhhhhh'+cId);
    },
    
    createRetirementRecord : function(component, event, helper) {
        var getName = event.getSource().get("v.name"); 
        var cId = component.get("v.client");
        if (getName=="RetirementRecordType")
       
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                client : cId,
                recName : getName
               
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef  : "Finsol:RetirementGoal" ,  
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
    
    createCarRecord : function(component, event, helper) {
        console.log("sg");
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name"); 
        if (getName=="CarRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                component.set("v.car",recordType);
                console.log("car",component.get("v.car"));
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef  : "Finsol:Goalform" ,  
                    componentAttributes: {
                        
                        car : recordType         
                    }      
                });
                evt.fire();   
            });  
        }
        $A.enqueueAction(action);
    },
    
    createWeddingRecord : function(component, event, helper) {
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name");
       
        if (getName=="WeddingRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                console.log("rctype"+recordType );
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef  : "Finsol:Goalform" ,  
                    componentAttributes: {
                        
                        wedding : recordType         
                    }      
                });
                evt.fire();   
            });  
        }
        $A.enqueueAction(action);     
    },
    
    createEducationRecord : function(component, event, helper) {
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name"); 
        if (getName=="EducationRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef  : "Finsol:Goalform" ,  
                    componentAttributes: {
                        
                        education : recordType         
                    }      
                });
                evt.fire();   
            });  
        }
        $A.enqueueAction(action);
    },
    
    createVacationRecord : function(component, event) {
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name"); 
        if (getName=="VacationRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef  : "Finsol:Goalform" ,  
                    componentAttributes: {
                        
                        vacation : recordType         
                    }      
                });
                evt.fire();   
            });  
        }
        $A.enqueueAction(action);
        
    },
    
    
    createHomeImprovementRecord : function(component, event, helper) {
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name"); 
        if (getName=="HomeImprovementRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef  : "Finsol:Goalform" ,  
                    componentAttributes: {
                        
                        homeimprovement : recordType         
                    }   
                });
                evt.fire();   
            });  
        }
        $A.enqueueAction(action);
    },
    
    createHomeRecord : function(component, event, helper) {
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name"); 
        if (getName=="HomeRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef  : "Finsol:Goalform" ,  
                    componentAttributes: {
                        
                        home : recordType         
                    }      
                });
                evt.fire();   
            });  
        }
        $A.enqueueAction(action);
    },
    
    createOthergoalRecord : function(component, event, helper) {
        var cId = component.get("v.client");
        var getName = event.getSource().get("v.name"); 
        if (getName=="OtherGoalsRecordType")
        {
            var action = component.get("c.getRecordType");
            action.setParams({
                recName : getName
            });
            action.setCallback(this, function(response) {
                var recordType = response.getReturnValue();
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef  : "Finsol:Goalform" ,  
                    componentAttributes: {
                        
                        othergoals : recordType         
                    }      
                });
                evt.fire();   
            });  
        }
        $A.enqueueAction(action);
    },*/
    
    closePopUp : function(component,event,helper)
    {
       /*if(window.location.pathname.includes("Budget")){
            var cmpTarget = component.find('exampleModal');
            console.log('the cross is : '+ cmpTarget );
            $A.util.addClass(cmpTarget, 'hideDiv');
            component.set("v.isActive",false);
            var saveIncomeEvent = component.getEvent("saveIncomeEvent");
            saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
            
            saveIncomeEvent.fire();
        }
        else{ */
         helper.hideExampleModal(component);
        
         /*   var homeEvent = $A.get("e.force:navigateToComponent");
            homeEvent.setParams({
                componentDef : "Finsol:Goalfinal",
                componentAttributes: {
                    cId : component.get("v.cid")
        }
                
            });
            homeEvent.fire();*/
       
    },
     hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
        
    },
    
    onGoalClick: function(component,event,helper){
        var heading,subheading;
        var icon;
        console.log(component.get("v.client"))
        var clickedGoalName = event.getSource().get("v.name");
        component.set("v.recordTypeIdName",clickedGoalName);
        console.log('ghgcbhvhwvhwegfhwewe'+ event.getSource().get("v.name"));
        var isRetirement , isNonRetirement = true;
        if(clickedGoalName == "WeddingRecordType")
        {
            heading = "Wedding";
            subheading = "Finacast will help you plan your Wedding";
            var icon = $A.get("$Resource.WeddingIcon");
            component.set("v.icon",icon);
        }
        else if (clickedGoalName == "CarRecordType")
        {
            heading = "Car";
            subheading = "Finacast will help you plan your Car purchase";
            var icon = $A.get("$Resource.CarIcon");
            component.set("v.icon",icon);
        }
            else if (clickedGoalName == "VacationRecordType")
            {
                heading = "Vacation";
                subheading = "Finacast will help you plan your vacation";
                var icon = $A.get("$Resource.VacationIcon");
            	component.set("v.icon",icon);
                
            }
                else if (clickedGoalName == "EducationRecordType")
                {
                    heading = "Education";
                    subheading = "Finacast will help you plan your Education";
                    var icon = $A.get("$Resource.EducationIcon");
           			component.set("v.icon",icon);
                }
                    else if (clickedGoalName == "HomeRecordType")
                    {
                        heading = "Home";
                        subheading = "Finacast will help you plan your home";
                        var icon = $A.get("$Resource.HomeIcon");
            			component.set("v.icon",icon);
                    }
                        else if (clickedGoalName == "HomeImprovementRecordType")
                        {
                            heading = "Home Improvement";
                            subheading = "Finacast will help you plan your  Home Improvement";
                            var icon = $A.get("$Resource.HomeImprovementIcon");
            				component.set("v.icon",icon);
                        }
                            else if (clickedGoalName == "OtherGoalsRecordType")
                            {
                                heading = "Other Goals";
                                subheading = "Finacast will help you plan your Goals";
                                var icon = $A.get("$Resource.OtherGoalsIcon");
            					component.set("v.icon",icon);
                            }
                                else if (clickedGoalName == "RetirementRecordType")
                                {
                                    heading = "Retirement - Step 1";
                                    subheading = "Entering this information will help us understand if you are on track for retirement and help us recommend steps to keep you on track for retirement.";
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
            component.set("v.subheading",subheading);
            component.set("v.isRetirement",isRetirement);
            component.set("v.isNonRetirement",isNonRetirement);
            component.set("v.recordTypeId",response.getReturnValue());
            component.set("v.icon",icon);
            
        });
         $A.enqueueAction(action);
        
        
        
    }
})
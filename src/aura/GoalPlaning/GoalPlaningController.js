({
    doInit : function(component, event, helper) {
        if(!component.get("v.budgetScreen")){
            var workspaceAPI = component.find("workspace");
            var namespace = component.get("v.namespace");
            console.log('namespace value----'+ namespace);
            var tab=component.get("v.tabName")
            console.log('tab',tab)
            workspaceAPI.getFocusedTabInfo().then(function(response) {
                var focusedTabId = response.tabId;
                console.log('tab id',focusedTabId )
                workspaceAPI.setTabLabel({
                    label: tab
                });
            })
            .catch(function(error) {
                console.log(error);
            });  
        }
        var clntId = component.get("v.cid");
        component.set("v.addGoals",false);
        component.set("v.showModalGoal",false);
        var action = component.get("c.getTotalGoal");
        action.setParams({
            ClientId : clntId,
            budgetScreen:component.get("v.budgetScreen"),
            monthBudget: component.get("v.month"),
            
            
        });
        
        var recordTypeName;
        action.setCallback(this, function(response) {
            try {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var data = response.getReturnValue();
                    var list=JSON.stringify(data).replace(/Finsol__/g,"");
                    console.log('list of goal planning'+list);
                    
                    component.set("v.goalList",JSON.parse(list));
                    console.log("golalist in component"+component.get("v.goalList"));
                    console.log('ahjgdakakds'+component.get("v.goalList"));
                }
            }
            catch(e){
                
            }
        });
        
        $A.enqueueAction(action); 
        /*   if(component.get("v.budgetScreen")){
       var saveIncomeEvent = component.getEvent("saveIncomeEvent");
                saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
                saveIncomeEvent.fire();
        }*/
    },
    createGoal:function(component, event, helper) {
        component.set("v.addGoals" , true);
    },
    onClickEditGoals : function(component,event,helper) {
        var clnt = component.get("v.cid")
        var getName = event.getSource().get("v.value");
        
        var action = component.get("c.getRecordTypeIdbyName");
        //  component.set("v.editrecidGoal",event.getSource().get("v.value"));
        action.setParams({     
            objectName  : "FinServ__FinancialGoal__c",
            strRecordTypeName : getName,
            
        });
        
        action.setCallback(this, function(response) {
            
            component.set("v.showModalGoal",true);
            
            var recordTypeName = response.getReturnValue();
            console.log("record type",recordTypeName);
            //
            var heading,subheading;
            var icon;
            
            var isRetirement , isNonRetirement = true;
            if(recordTypeName == "WeddingRecordType")
            {
                heading = "Wedding";
                subheading = "Finacast will help you plan your Wedding";
                var icon = $A.get("$Resource.WeddingIcon");
                component.set("v.icon",icon);
                component.set("v.isNonRetirement",true); 
                component.set("v.isRetirement",false);
            }
            else if (recordTypeName == "CarRecordType")
            {
                heading = "Car";
                subheading = "Finacast will help you plan your Car purchase";
                var icon = $A.get("$Resource.CarIcon");
                component.set("v.icon",icon);
                component.set("v.isNonRetirement",true); 
                component.set("v.isRetirement",false);
            }
                else if (recordTypeName == "VacationRecordType")
                {
                    heading = "Vacation";
                    subheading = "Finacast will help you plan your vacation";
                    var icon = $A.get("$Resource.VacationIcon");
                    component.set("v.icon",icon);
                    component.set("v.isNonRetirement",true); 
                    component.set("v.isRetirement",false);
                    
                }
                    else if (recordTypeName == "EducationRecordType")
                    {
                        heading = "Education";
                        subheading = "Finacast will help you plan your Education";
                        var icon = $A.get("$Resource.EducationIcon");
                        component.set("v.icon",icon);
                        component.set("v.isNonRetirement",true); 
                        component.set("v.isRetirement",false);
                    }
                        else if (recordTypeName == "HomeRecordType")
                        {
                            heading = "Home";
                            subheading = "Finacast will help you plan your home";
                            var icon = $A.get("$Resource.HomeIcon");
                            component.set("v.icon",icon);
                            component.set("v.isNonRetirement",true); 
                            component.set("v.isRetirement",false);
                        }
                            else if (recordTypeName == "HomeImprovementRecordType")
                            {
                                heading = "Home Improvement";
                                subheading = "Finacast will help you plan your  Home Improvement";
                                var icon = $A.get("$Resource.HomeImprovementIcon");
                                component.set("v.icon",icon);
                                component.set("v.isNonRetirement",true); 
                                component.set("v.isRetirement",false);
                            }
                                else if (recordTypeName == "OtherGoalsRecordType")
                                {
                                    heading = "Other Goals";
                                    subheading = "Finacast will help you plan your Goals";
                                    var icon = $A.get("$Resource.OtherGoalsIcon");
                                    component.set("v.icon",icon);
                                    component.set("v.isNonRetirement",true); 
                                    component.set("v.isRetirement",false);
                                }
                                    else if (recordTypeName == "RetirementRecordType")
                                    {
                                        component.set("v.isRetirement",true);
                                        component.set("v.isNonRetirement",false);
                                    }
            
            //
            /* if(recordTypeName == "RetirementRecordType")
            {
                component.set("v.isRetirement",true);
                component.set("v.isNonRetirement",false);
            }
            else
            {
               component.set("v.isNonRetirement",true); 
               component.set("v.isRetirement",false);

            }  */
            component.set("v.heading",heading);
            
            component.set("v.editrecidGoal",event.getSource().get("v.value"));            
        });             
        $A.enqueueAction(action); 
    },
    onClickDeletegoals : function(component,event,helper) { 
        
        var retVal = confirm("Are you sure ?");
        if( retVal == true ) {
            var action2 = component.get("c.deleteGoals");
            action2.setParams({
                'goalId' : event.getSource().get('v.value')
            });
            
            action2.setCallback(this, function(response) {
                var saveIncomeEvent = component.getEvent("saveIncomeEvent");
                saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
                saveIncomeEvent.fire();
                var resultsToast = $A.get("e.force:showToast");
                resultsToast.setParams({
                    "title": "Delete Success!",
                    type: 'success',
                    "message": "Record has been deleted successfully"           
                });
                resultsToast.fire();
            });     
            $A.enqueueAction(action2);
            
            return true;
        } else {
            return false;
        }
        
    },
    viewGoal : function(component, event, helper) {
        var idx=event.getSource().get("v.value");
        component.set("v.editrecidGoal",idx);
        var clntId = component.get("v.cid");
        /* var action = component.get("c.getGoalDetail");
        action.setParams({
            'goalId' :idx,
            ClientId : clntId,
        });*/
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:GoalInfoTab",
            componentAttributes: {
                //  name:component.get("v.name"),
                editrecidGoal:component.get("v.editrecidGoal"),
                namespace:component.get("v.namespace"),
                cid:component.get("v.cid") 
            }
        });
        evt.fire();
        /*action.setCallback(this, function(response) {
            var state = response.getState();
            if(state==='SUCCESS'){
                var data=response.getReturnValue();
                var name=data[0].Name;
                component.set("v.name",name);
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef : "c:GoalInfoTab",
                    componentAttributes: {
                      //  name:component.get("v.name"),
                        editrecidGoal:component.get("v.editrecidGoal"),
                        namespace:component.get("v.namespace"),
                        cid:component.get("v.cid") 
                    }
                });
                evt.fire();
            }
        });     
        $A.enqueueAction(action);*/
        
        
    },
    
})
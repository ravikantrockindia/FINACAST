({
    doInit: function(component, event, helper){
        /*  var workspaceAPI = component.find("workspace");
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
        });   */
            
            // alert(component.get("v.recordId"))
            component.set("v.addGoals",false)
            component.set("v.showModalGoal",false);
                    var clntId = component.get("v.cid");

            /*console.log('-----------------s--s-----s-s-'+component.get("v.cid"));
            
            
            console.log('clntId',clnt);
            var clntId;
            
            if($A.util.isUndefinedOrNull(clnt) ){
                clntId = "init";
                
            }
            else
            {
                clntId = clnt;
            }
            console.log("sss"+clntId);*/
            
            var action = component.get("c.getGoals");
            action.setParams({
                ClientId : clntId,
                
            });
            action.setCallback(this, function(response) {
                try {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var data = response.getReturnValue();
                         
                        //component.set("v.addGoal",data.goalRecList);
                        var list=JSON.stringify(data).replace(/Finsol__/g,"")
                         
                        
                        component.set("v.addGoal",JSON.parse(list));
                     /*   component.set("v.GoalDetails", response.getReturnValue()[0]);
                        component.set("v.tGoal" , data.totalGoal);
                        component.set("v.selectedClient" , data.client.Id);
                        component.set("v.GoalsList", g.financialGoalList);
                        component.set("v.client",data.client); 
                        
                        component.set("v.clientName",data.client);
                        // console.log('the client is' , component.get("v.clientName"));
                        component.set("v.accountRecTypeName" , data.client.RecordType.DeveloperName);*/
                        
                        
                        
                        
                    }
                }
                catch(e){
                    
                    
                    
                }
            });
            $A.enqueueAction(action); 
            
            
        },
    
    
    createGoal : function(component , event , helper){
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
        
    }, 
    
})
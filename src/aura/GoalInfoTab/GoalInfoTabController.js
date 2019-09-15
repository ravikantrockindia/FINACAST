({	
    doInit: function(component, event, helper){
        
        
        var idx=component.get("v.editrecidGoal");
        var clntId = component.get("v.cid");
        var action = component.get("c.getGoalDetail");
        action.setParams({
            goalId :idx,
          //  ClientId : clntId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state==='SUCCESS'){
              
                var data=JSON.parse(JSON.stringify(response.getReturnValue()).replace(/Finsol__/g,""));
                console.log('data'+data);
                var name=data.finGoal.Name;
                component.set("v.name",name);
                var reqMonSaving=data.finGoal.Required_Monthly_Saving__c;
                component.set("v.reqMonSaving",reqMonSaving);  
                var startValue=data.finGoal.Start_Value__c;
                component.set("v.startValue",startValue);
                var AnnualGrowthRate=data.finGoal.Annual_Growth_Rate__c;
                component.set("v.AnnualGrowthRate",AnnualGrowthRate);
                var StartDate=data.finGoal.Start_Date__c;
                component.set("v.StartDate",StartDate);
                var Priority=data.finGoal.Goal_Priority__c;
                component.set("v.Priority",Priority);
                var AccountAssociated=data.finGoal.Associated_Account__r.Name;
                component.set("v.AccountAssociated",AccountAssociated);
                var AccountAssociatedType=data.finGoal.Associated_Account__r.Account_Type__c;
                component.set("v.AccountAssociatedType",AccountAssociatedType);
                var tarVal=data.finGoal.FinServ__TargetValue__c;
                component.set("v.tarVal",tarVal);
                var tarDate=data.finGoal.FinServ__TargetDate__c;
                component.set("v.tarDate",tarDate);
                var actualValue=data.actualValue;
                component.set("v.actualValue",actualValue);
                var tarVal=component.get("v.tarVal");
                console.log('target value',tarVal);
                
                var actualValue=component.get("v.actualValue");
                console.log('actual value',actualValue);
                var res=((actualValue/tarVal)*100);
                if(res>=0){
                    var integer = parseInt(res, 10);
                    console.log('res',integer);
                    component.set("v.res",integer);    
                }else{
                    var integer = 0;
                    console.log('res',integer);
                    component.set("v.res",integer);    
                }
                
                component.set("v.goalStatus",data.goalStatus);
                component.set("v.goalTrack",data.goalTrack);
                component.set("v.increaseDate",data.increasedDate);
                component.set("v.data",data.data);
                console.log(data.data);
                
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
            
        });    
        $A.enqueueAction(action);
        
        
    }
})

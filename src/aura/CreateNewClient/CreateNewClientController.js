({
    doInit:function(component,event,helper){
        try{
            var action=component.get('c.getNamespace');
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.namespace", response.getReturnValue());
                    
                }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action); 
            var workspaceAPI = component.find("workspace");
            var tab=component.get("v.tabName")
            console.log('tab',tab)
            workspaceAPI.getFocusedTabInfo().then(function(response) {
                var focusedTabId = response.tabId;
                console.log('tab id',focusedTabId )
                workspaceAPI.setTabLabel({
                    tabId: focusedTabId,
                    label: tab
                });
            })
            .catch(function(error) {
                console.log(error);
            });
            helper.getRecordTypeId(component);
        }catch(e){
            console.log(e.message);
        }
        
        
    },
    
    changeTabName:function(component,event,helper){
        try{
            var workspaceAPI = component.find("workspace");
            var tab=component.get("v.tabName")
            workspaceAPI.getFocusedTabInfo().then(function(response) {
                var focusedTabId = response.tabId;
                console.log('tab id',focusedTabId )
                workspaceAPI.setTabLabel({
                    tabId: focusedTabId,
                    label: tab
                });
            })
            .catch(function(error) {
                console.log(error);
            });
            
        }catch(e){
            console.log(e.message);
        }
        
    },
    selectStep1:function(component,event,helper){
        try{
            component.set("v.currentStep","1")
        }catch(e){
            console.log(e.message)
        }
    },
    selectStep2:function(component,event,helper){
        try{
            var recordId=component.get("v.accountRecordId");
            if( $A.util.isUndefinedOrNull(recordId) || recordId == ""){
                component.set("v.currentStep","1")
                var cmp=component.find("step1")
                $A.util.addClass(cmp, 'slds-is-active');
                var cmp=component.find("step2")
                $A.util.removeClass(cmp, 'slds-is-active');
                
                
                helper.showToast(component,"Error!","error","Please fill demographic information")
                
            }
            else{
                component.set("v.currentStep","2")
            }
        }catch(e){
            console.log(e.message)
        }
    },
    onstep:function(component,event,helper){
        var stepIndex = event.getParam('index');
        component.set("v.currentStep",2)
    },
    selectStep3:function(component,event,helper){
        var recordId=component.get("v.accountRecordId");
        if( $A.util.isUndefinedOrNull(recordId) || recordId == ""){
            helper.showToast(component,"Error!","error","Please fill demographic information")
            component.set("v.currentStep","1")
            var cmp=component.find("step1")
            $A.util.addClass(cmp, 'slds-is-active');
            var cmp=component.find("step3")
            $A.util.removeClass(cmp, 'slds-is-active');
            
            return;
            
        }
        component.set("v.currentStep","3")
    },
    selectStep4:function(component,event,helper){
        var recordId=component.get("v.accountRecordId");
        if( $A.util.isUndefinedOrNull(recordId) || recordId == ""){
            helper.showToast(component,"Error!","error","Please fill demographic information")
            component.set("v.currentStep","1")
            var cmp=component.find("step1")
            $A.util.addClass(cmp, 'slds-is-active');
            var cmp=component.find("step4")
            $A.util.removeClass(cmp, 'slds-is-active');
            
            return;
            
        }
        component.set("v.currentStep","4")
    },
    selectStep5:function(component,event,helper){
        var recordId=component.get("v.accountRecordId");
        if( $A.util.isUndefinedOrNull(recordId) || recordId == ""){
            helper.showToast(component,"Error!","error","Please fill demographic information")
            component.set("v.currentStep","1")
            var cmp=component.find("step1")
            $A.util.addClass(cmp, 'slds-is-active');
            var cmp=component.find("step5")
            $A.util.removeClass(cmp, 'slds-is-active');
            
            return;
            
        }
        component.set("v.currentStep","5")
    },
    
    onTabRefreshed : function(component, event, helper) {
        console.log("Tab Refreshed");
        var refreshedTabId = event.getParam("tabId");
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getTabInfo({
            tabId : refreshedTabId
        }).then(function(response) {
            console.log(response);    
        });
    }
    
})
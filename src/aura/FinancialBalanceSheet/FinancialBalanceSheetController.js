({
    doInit : function(component, event, helper) {  
        /* var workspaceAPI = component.find("workspace");
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
        }); */
        
        
        helper.getAllAccounts(component);
        
        var action=component.get('c.getRecordTypeIds');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data=response.getReturnValue();
                console.log(JSON.stringify(data))
                component.set("v.recordTypeIds", data);
                
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
        var action=component.get('c.getClient');
        action.setParams({
            ClientId: component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data=response.getReturnValue();
                console.log(JSON.stringify(data))
                component.set("v.client", data);
                
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
         
     
    },
    
    
        toggleSection : function(component, event, helper) {
        
        var sectionAuraId =event.getSource().get("v.name");;
        var sectionDiv = component.find(sectionAuraId);
        var sectionState =$A.util.hasClass(sectionDiv, 'slds-is-collapsed')
        
        if(sectionState){
            $A.util.removeClass(sectionDiv, 'slds-is-collapsed');
            $A.util.addClass(sectionDiv, 'slds-is-expanded');
            event.getSource().set("v.iconName",'utility:chevrondown');
            
        }
        else{
            $A.util.removeClass(sectionDiv, 'slds-is-expanded');
            $A.util.addClass(sectionDiv, 'slds-is-collapsed');
            event.getSource().set("v.iconName",'utility:chevronright');
            
        }
        
    },
    addnewaccount:function(component){
        component.set("v.showInModal",true);
    },
    onClickEdit:function(component,event){
        var name=event.getSource().get("v.name");
        var value=event.getSource().get("v.value");
        if(name=='CashEditButton'){
            var cashList=component.get("v.cash");
            component.set("v.accountTypeforEdit",'Cash');
            component.set("v.financialAccount", cashList[value]);
            component.set("v.isModalOpen", true);
            
        }
        if(name=='InvestmentEditButton'){
            var investmentList=component.get("v.investment");
            component.set("v.accountTypeforEdit",'Investment');
            component.set("v.financialAccount", investmentList[value]);
            component.set("v.isModalOpen", true);
            
        }
        if(name=='LoanEditButton'){
            var loanList=component.get("v.loan");
            component.set("v.accountTypeforEdit",'Loan');
            
            component.set("v.financialAccount", loanList[value]);
            var recordTypeIds=component.get("v.recordTypeIds")
            component.set("v.loadId",loanList[value].Id)
            for(var i=0;i<recordTypeIds.length;i++){             
                if(recordTypeIds[i].DeveloperName=='LoanAccount'){
                    component.set("v.recordTypeId",recordTypeIds[i].Id)
                    
                    
                }
            }
            component.set("v.isModalOpen", true);
            
        }
        if(name=='CreditEditButton'){
            var creditList=component.get("v.credit");
            component.set("v.accountTypeforEdit",'Credit');
            
            component.set("v.financialAccount", creditList[value]);
            component.set("v.isModalOpen", true);
            var recordTypeIds=component.get("v.recordTypeIds")
            for(var i=0;i<recordTypeIds.length;i++){             
                if(recordTypeIds[i].DeveloperName=='CreditCard'){
                    component.set("v.recordTypeId",recordTypeIds[i].Id)
                    
                }
            }
            
        }
    },
    onClickDelete:function(component,event,helper){
        if(confirm('Are you sure?')){
            var spinner = component.find("mySpinner");
            $A.util.removeClass(spinner, "slds-hide");
            $A.util.addClass(spinner, "slds-show");
            var name=event.getSource().get("v.name");
            var value=event.getSource().get("v.value");
            var id;
            if(name=='CashDeleteButton'){
                var cashList=component.get("v.cash");
                id=cashList[value].Id;
                
            }
            if(name=='InvestmentDeleteButton'){
                var investmentList=component.get("v.investment");
                id=investmentList[value].Id;
                
            }
            if(name=='LoanDeleteButton'){
                var loanList=component.get("v.loan");
                id=loanList[value].Id;
                
                
                
            }
            if(name=='CreditDeleteButton'){
                var creditList=component.get("v.credit");
                id=creditList[value].Id
            }
            
            var action=component.get('c.deleteFinAccout');
            action.setParams({
                finId: id
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var data=response.getReturnValue();
                    if(data){
                        helper.getAllAccounts(component);
                        $A.util.removeClass(spinner, "slds-show");
                        $A.util.addClass(spinner, "slds-hide");
                        $A.get('e.force:refreshView').fire();
                        
                        
                    }
                    else{
                        $A.util.removeClass(spinner, "slds-show");
                        $A.util.addClass(spinner, "slds-hide");
                        helper.showNotfication(component,'This account is linked to one or more goals. Unlink those goals before deleting this account.','error','Error!');
                        
                    }
                    
                }
                else if (state === "ERROR") {
                    $A.util.removeClass(spinner, "slds-show");
                    $A.util.addClass(spinner, "slds-hide");
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
        }
    },
    handleAccount:function(component,event,helper){
        var cmpEvent = component.getEvent("rTid");
        var eventSource= event.getSource();
        var txnId=eventSource.get("v.value");
        component.set("v.Tid",txnId);
        var cmpEvent = component.getEvent("rTid");
        cmpEvent.setParams( {
            "eTid" :  txnId
            
        } );
        cmpEvent.fire();
    }   
})
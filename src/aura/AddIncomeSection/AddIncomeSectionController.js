({
    doInit : function(component, event, helper) {
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
        
        $A.util.addClass(spinner, "slds-show");
        var action=component.get("c.getincome");
        action.setParams({ recordId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                if(response.getReturnValue().length==1 && !response.getReturnValue()[0].disabled ){
                    component.set("v.IncomeList",response.getReturnValue())
                    
                    component.find("skipNextButton").set("v.label",'Skip')
                    component.set("v.disabled",false)
                    
                }
                else{
                    component.set("v.IncomeList",response.getReturnValue())
                    component.find("skipNextButton").set("v.label",'Next')
                    component.set("v.disabled",true)
                    
                    
                }
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
            }
            else if (state === "INCOMPLETE") {
                // do something
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
    addNewIncome: function(component,event,helper){
        helper.createIncome(component)
        
        
    },
    saveIncomes:function(component,event,helper){
        debugger;
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
        
        $A.util.addClass(spinner, "slds-show");
        component.set("v.disabled",true);
        var incomes=new Array();
        var data=component.get("v.IncomeList")
        
        let isAllValid = component.find('fields').reduce(function(isValidSoFar, inputCmp){
            inputCmp.showHelpMessageIfInvalid();
            return isValidSoFar && inputCmp.checkValidity();
        },true);
        var isDateValid=helper.validateDate(component)
        if(!isDateValid){
            isAllValid=isDateValid
        }
        
        if(isAllValid){
            for (var e in data ){
                incomes.push(data[e]["income"]);
                
            }
            
            var action=component.get("c.saveIncome");
            action.setParams({ incomes : JSON.stringify(incomes)
                             });
            
            
            action.setCallback(this, function(response) {
                
                var state = response.getState();
                if (state === "SUCCESS") {
                    helper.showNotfication(component,"The record has been saved successfully.","success","Success!");  
                    
                    component.set("v.IncomeList",response.getReturnValue())
                    component.find("skipNextButton").set("v.label",'Next')
                    
                    $A.util.removeClass(spinner, "slds-show");
                    
                    $A.util.addClass(spinner, "slds-hide");
                    
                }
                else if (state === "INCOMPLETE") {
                    // do something
                }
                    else if (state === "ERROR") {
                        component.set("v.disabled",false)
                        helper.showNotfication(component,"The record cannot be saved. Please try again!","error","Error!");  
                        
                        var errors = response.getError();
                        if (errors) {
                            component.set("v.disabled",false)
                            $A.util.removeClass(spinner, "slds-show");
                            
                            $A.util.addClass(spinner, "slds-hide");
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
        else{
            component.set("v.disabled",false)
            $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
            
        }
    },
    backButton:function(component,event,helper){
        component.set("v.currentStep","3");
    },
    skipButton: function(component,event,helper){
        component.set("v.currentStep","5")
    },
    
    handleCancel: function(component,event,helper){
        var isDelete=confirm("You will lose all the saved data. Do you want to continue?")
        if(isDelete){
            var workspaceAPI = component.find("workspace");
            workspaceAPI.getFocusedTabInfo().then(function(response) {
                var focusedTabId = response.tabId;
                workspaceAPI.closeTab({tabId: focusedTabId});
            })
            .catch(function(error) {
                console.log(error);
            });
            var action=component.get("c.deleteRecords");
            action.setParams({ recordId : component.get("v.recordId") });
            
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    
                    
                }
                
                else if (state === "INCOMPLETE") {
                    // do something
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
        }  
    },
    deleteRow:function(component,event,helper){
        if(confirm("Do you want to delete this record?")){
            var value=event.getSource().get("v.value");
            var incomes=component.get("v.IncomeList")
            
            var Id=incomes[value]["income"]["Id"]
            var action=component.get("c.hello");
            action.setParams({ recordId : Id });
            
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    helper.showNotfication(component,"The record has been deleted successfully.","success","Success!");  
                    incomes.splice(value,1)
                    
                    
                    component.set("v.IncomeList",incomes)
                    if(incomes.length==0){
                        helper.createIncome(component)
                        
                        component.find("skipNextButton").set("v.label",'Skip')
                        
                    }
                    
                }
                
                else if (state === "INCOMPLETE") {
                    // do something
                }
                    else if (state === "ERROR") {
                        helper.showNotfication(component,"The record can't be deleted. Please try again!","error","Error!");  
                        
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
    editRow:function(component,event,helper){
        var value=event.getSource().get("v.value");
        var incomes=component.get("v.IncomeList")
        incomes[value]["disabled"]=false
        component.set("v.disabled",false)
        component.set("v.IncomeList",incomes)
    },
    onblur:function(component,event,helper){
        debugger;
        helper.validateDate(component)
    }
    
    
})
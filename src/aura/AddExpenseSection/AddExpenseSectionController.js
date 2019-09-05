({
    doInit : function(component, event, helper) {
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
        
        $A.util.addClass(spinner, "slds-show");
        var opts = [
            { value: "", label: "None" },
            { value: "Auto and Transportation", label: "Auto and Transportation" },
            { value: "Bills and Utilities", label: "Bills and Utilities" },
            { value: "Bussiness Expense", label: "Bussiness Expense" },
            { value: "Business Services", label: "Business Services" },
            { value: "Education", label: "Education" },
            { value: "Entertainment", label: "Entertainment" },
            { value: "Fees and Charges", label: "Fees and Charges" },
            { value: "Fee and Dining", label: "Fee and Dining" },
            { value: "Gifts and Donations", label: "Gifts and Donations" },
            { value: "Home", label: "Home" },
            { value: "Insurance", label: "Insurance" },
            { value: "Investment Expense", label: "Investment Expense" },
            { value: "Miscellaneous", label: "Miscellaneous" },
            { value: "Personal Care", label: "Personal Care" },
            { value: "Kids", label: "Kids" },
            { value: "Business", label: "Business" },
            { value: "Travel", label: "Travel" },
            { value: "Pets", label: "Pets" },
            { value: "Finance", label: "Finance" },
            { value: "Taxes", label: "Taxes" }
            
        ];
        component.set("v.options1",opts);
        var action=component.get("c.getExpense");
        action.setParams({ recordId : component.get("v.recordId") });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                if(response.getReturnValue().length==1  && !response.getReturnValue().disabled){
                    component.set("v.ExpenseList",response.getReturnValue())
                    component.set("v.disabled",false)
                    
                }
                else{
                    component.set("v.ExpenseList",response.getReturnValue())
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
    addNewExpense: function(component,event,helper){
        helper.createExpense(component, component.get("v.LastKey"))
        
        
    },
    saveExpenses:function(component,event,helper){
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
        
        $A.util.addClass(spinner, "slds-show");
        var expenses=new Array();
        component.set("v.disabled",true);
        
        var data=component.get("v.ExpenseList")
        
        component.set("v.ExpenseList",data)
        let isAllValid = component.find('fields').reduce(function(isValidSoFar, inputCmp){
            inputCmp.showHelpMessageIfInvalid();
            //check if the validity condition are met or not.
            return isValidSoFar && inputCmp.checkValidity();
        },true);
        
        for (var e in data ){
            if(data[e]["expense"]["isTaxBenefit"]){
                data[e]["showSection"]=true;
                var maxDeduction=data[e]["expense"]["maxDeduction"]
                if($A.util.isUndefinedOrNull(maxDeduction) || maxDeduction==""){
                    data[e]["expense"]["maxDeduction"]=0;
                }
            }
            else{
                data[e]["expense"]["maxDeduction"]=0;
                data[e]["expense"]["percentageContribution"]=0;
            }
        }
        component.set("v.ExpenseList",data)
        var tax=component.find("taxbenefit")
        if(!$A.util.isUndefinedOrNull(tax)){
            
            if(tax.length>0)  {
                for(var i=0;i<tax.length;i++){
                    var taxbenefitname=tax[i].get("v.name")
                    
                    if(taxbenefitname.includes(e.toString())){
                        
                        var isTaxBenefitValid=tax[i].get("v.validity").valid;
                        if(!isTaxBenefitValid){
                            isAllValid=isTaxBenefitValid
                            tax[i].showHelpMessageIfInvalid();
                        }
                        
                        
                    }
                }
            }
            else{
                var  isTaxBenefitValid=tax.get("v.validity").valid;
                if(!isTaxBenefitValid){
                    isAllValid=isTaxBenefitValid
                    tax.showHelpMessageIfInvalid();
                }
            }
        }
        var isDateValid=helper.validateDate(component)
        if(!isDateValid){
            isAllValid=isDateValid
        }
        for (var e in data ){
            expenses.push(data[e]["expense"]);
            
        }
        if(isAllValid){
            
            var action=component.get("c.saveExpense");
            action.setParams({ expenses : JSON.stringify(expenses)
                             });
            
            action.setCallback(this, function(response) {
                
                var state = response.getState();
                if (state === "SUCCESS") {
                    helper.showNotfication(component,"The record has been saved succcessfully","success","Success!");  
                    component.set("v.ExpenseList",response.getReturnValue())
                    $A.util.removeClass(spinner, "slds-show");
                    
                    $A.util.addClass(spinner, "slds-hide");
                    
                }
                else if (state === "INCOMPLETE") {
                    // do something
                }
                    else if (state === "ERROR") {
                        helper.showNotfication(component,"The record cannot be saved. Please try again!","error","Error!");  
                        
                        component.set("v.disabled",false)
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
        else{
            component.set("v.disabled",false);
            
            $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
        }
        
    },
    backButton:function(component,event,helper){
        component.set("v.currentStep","4");
    },
    skipButton: function(component,event,helper){
        var Id=component.get("v.recordId");
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.closeTab({tabId: focusedTabId});
        })
        .catch(function(error) {
            console.log(error);
        });
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
            pageReference : {
                "type": 'standard__recordPage',
                "attributes": {
                    "recordId": Id,
                    "actionName": "view"
                }
            },
            focus: true
        });
        
        
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
            var expenses=component.get("v.ExpenseList")
            var Id=expenses[value]["expense"]["Id"];
            var action=component.get("c.deleteExpense");
            action.setParams({ recordId : Id });
            action.setCallback(this, function(response) {
                var state = response.getState();
                console.log(state)
                if (state === "SUCCESS") {
                    helper.showNotfication(component,"The record has been deleted successfully.","success","Success!");  
                    expenses.splice(value,1);
                    component.set("v.ExpenseList",expenses)
                    if(expenses.length==0){
                        helper.createExpense(component)
                        
                        
                    }
                    
                    console.log(JSON.stringify(component.get("v.ExpenseList")))
                    
                }
                
                
                
                else if (state === "INCOMPLETE") {
                    // do something
                }
                    else if (state === "ERROR") {
                        helper.showNotfication(component,"The record cannot be deleted. Please try again!","error","Error!");  
                        
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
        var expenses=component.get("v.ExpenseList")
        expenses[value]["disabled"]=false;
        component.set("v.disabled",false)
        
        component.set("v.ExpenseList",expenses)
    },
    taxBenefitSection:function(component,event,helper){
        var value=event.getSource().get("v.value");
        var checked=event.getSource().get("v.checked");
        var expenses=component.get("v.ExpenseList")
        if(checked){
            expenses[value]["showSection"]=true;
            expenses[value]["expense"]["percentageContribution"]=""
            expenses[value]["expense"]["maxDeduction"]=""
            expenses[value]["expense"]["isMonthly"]=true
            
        }
        else{
            expenses[value]["expense"]["percentageContribution"]=""
            expenses[value]["expense"]["maxDeduction"]=""
            expenses[value]["expense"]["isMonthly"]=false
            expenses[value]["showSection"]=false;
            
        }
        
        component.set("v.ExpenseList",expenses)
        
    },
    sectionButton:function(component,event,helper){
        var value=event.getSource().get("v.value")
        var expenses=component.get("v.ExpenseList")
        var  showSection=expenses[value]["showSection"]
        expenses[value]["showSection"]=!showSection;
        component.set("v.ExpenseList",expenses)
        
    },
    onblur:function(component,event,helper){
        helper.validateDate(component)
    }
    
    
})
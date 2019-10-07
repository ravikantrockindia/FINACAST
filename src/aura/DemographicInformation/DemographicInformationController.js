({
    doInit:function(component,event,helper){
        try{
            
            var recordId=component.get("v.recordId");
            if(!($A.util.isUndefinedOrNull(recordId)||recordId=="")){
                var action=component.get("c.getContact");
                action.setParams({ recordId : component.get("v.recordId")});
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        component.find("dob").set("v.value", response.getReturnValue()[0].Birthdate);
                        component.find("email").set("v.value", response.getReturnValue()[0].Email);
                        component.find("phone").set("v.value", response.getReturnValue()[0].Phone);
                        component.find("gender").set("v.value",response.getReturnValue()[0].FinServ__Gender__c)
                        
                    }
                    
                    else if (state === "INCOMPLETE") {
                        // do something
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
        }
        catch(e){
            console.log(e.message)
        }
    },
    handleSuccess : function(component, event, helper) {
        try{
            var spinner = component.find("mySpinner");
            
            $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
            component.set("v.recordId",event.getParams().response.id)
            var action=component.get("c.updateContact");
            action.setParams({ recordId : component.get("v.recordId"),
                              phone: component.find("phone").get("v.value"),
                              email: component.find("email").get("v.value"),
                              gender: component.find("gender").get("v.value"),
                              dob: component.find("dob").get("v.value")
                             });
            
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    
                    
                }
                
                else if (state === "INCOMPLETE") {
                    // do something
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
            
            component.set("v.tabName", event.getParams().response.fields.Name.value)
            component.set("v.currentStep","2");
        }catch(e){
            console.log(e.message);
        }
        
        
    },
    handleError:function(component,event,helper){
        try{
            var spinner = component.find("mySpinner");
            $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
            var msg = "Record couldn't be saved. Please try again!"
            helper.showNotfication(component,msg,"error","Error!");    
            component.set("v.disabled",false)
        }catch(e){
            console.log(e.message)
        }
        
    },
    
    handleCancel: function(component,event,helper){
        
        try{
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
        }catch(e){
            console.log(e.message);
        }
    },
    
    handleSubmit: function(component,event,helper){
        try{
            var spinner = component.find("mySpinner");
            $A.util.removeClass(spinner, "slds-hide");
            
            $A.util.addClass(spinner, "slds-show");
            component.set("v.disabled",true)        
            var name=component.find("name").get("v.value")
            var category=component.find("category").get("v.value")
            var street=component.find("street").get("v.value")
            var dob=component.find("dob").get("v.value")
            var city=component.find("city").get("v.value")
            var state=component.find("state").get("v.value")
            var code=component.find("code").get("v.value")
            if ($A.util.isUndefinedOrNull(name) || name == "" ||  
                $A.util.isUndefinedOrNull(category) || category == "" || $A.util.isUndefinedOrNull(street) || 
                street ==""  || $A.util.isUndefinedOrNull(dob) || dob ==""  || $A.util.isUndefinedOrNull(city) || city ==""  
                || $A.util.isUndefinedOrNull(state) || state ==""  || $A.util.isUndefinedOrNull(code) || code =="" ){
                event.preventDefault();
                component.set("v.disabled",false)
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                var msg = "Please fill mandatory fields!"
                helper.showNotfication(component,msg,"error","Error!");    
            }
            else{
                var d=new Date()
                var dob=new Date(dob)
                //
                if(dob>d){
                   event.preventDefault();
                    component.set("v.disabled",false)
                    $A.util.removeClass(spinner, "slds-show");
                    
                    $A.util.addClass(spinner, "slds-hide");
                    var msg = "You cannot enter a future DoB!"
                    helper.showNotfication(component,msg,"error","Error!");
					return;
                }              
                //
                var timediff=new Date().getTime() - dob.getTime();
                if(timediff<0){
                    event.preventDefault();
                    component.set("v.disabled",false)
                    $A.util.removeClass(spinner, "slds-show");
                    
                    $A.util.addClass(spinner, "slds-hide");
                    var msg = "Age must be atleast 18!"
                    helper.showNotfication(component,msg,"error","Error!");
                }
                var yeardiff=new Number((new Date().getTime() - dob.getTime()) / 31536000000)
                console.log('yeardiff',yeardiff)
                if(yeardiff<18){
                    event.preventDefault();
                    component.set("v.disabled",false)
                    $A.util.removeClass(spinner, "slds-show");
                    
                    $A.util.addClass(spinner, "slds-hide");
                    var msg = "Age must be atleast 18 to proceed further!"
                    helper.showNotfication(component,msg,"error","Error!");  
                }
                
                
                
            }
        }catch(e){
            console.log(e.message)
        }
    },
    
})
({
    handleSuccess : function(component, event, helper) {
        try{
            var spinner = component.find("mySpinner");
            
            $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
            component.set("v.recordId",event.getParams().response.id)
            console.log(component.get("v.recordId"))
            
            // console.log(event.getParams().response.fields.Name.value)
            
            component.set("v.tabName", event.getParams().response.fields.Name.value)
            component.set("v.currentStep","2");
        }catch(e){
            console.log(e.message);
        }
        /*var navService = component.find("navService");
        // Sets the route to /lightning/o/Account/home
        var pageReference = {
            type: 'standard__recordPage',
            attributes: {
                 "recordId": component.get("v.recordId"),
           "objectApiName": "Account",
           "actionName": "view"
            }
        };
                navService.navigate(pageReference);*/
        
        
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
    /*  getMessage : function(component, event, helper) {
        //get method paramaters
       //// var params = event.getParam('arguments');
       // var fethAddress = component.get('c.handleSubmit');
       var isValidate=helper.validateData(component,event)
       if(isValidate){
           
           var x=component.find("form").submit();
           console.log(x);
           console.log(1);
           alert(' Profile Updated.')
       }
        else{
           var msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);  
        }
            
        
    },*/
    handleCancel: function(component,event,helper){
        
        /* var event = component.getEvent("CancelEvent");
        event.fire();*/
        /*var evt = $A.get("e.force:navigateToURL");
        evt.setParams({
            "url"  : "/lightning/n/My_Clients",
            
        });       
        evt.fire(); */
        // var event = component.getEvent("CancelEvent");
        // event.fire();
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
                console.log(component.get("v.recordId"))
                var action=component.get("c.deleteRecords");
                action.setParams({ recordId : component.get("v.recordId") });
                
                // Create a callback that is executed after 
                // the server-side action returns
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    // alert(state)
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
                // A client-side action could cause multiple events, 
                // which could trigger other events and 
                // other server-side action calls.
                // $A.enqueueAction adds the server-side action to the queue.
                $A.enqueueAction(action);
                
            }
        }catch(e){
            console.log(e.message);
        }
    },
    /* onTabClosed : function(component, event, helper) {
    var tabId = event.getParam("tabId");
    //alert("Tab with tabId of " + tabId + "was just closed.");
  },*/
    handleSubmit: function(component,event,helper){
        try{
            var spinner = component.find("mySpinner");
            $A.util.removeClass(spinner, "slds-hide");
            
            $A.util.addClass(spinner, "slds-show");
            console.log(component.get("v.recordTypeId"))
            component.set("v.disabled",true)        
            
            /*  var isValidate=helper.validateData(component,event)
        if(!isValidate)
        {
            event.preventDefault();
            var msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);      
        }*/
            var name=component.find("name").get("v.value")
            //console.log("name",name)
            var category=component.find("category").get("v.value")
            //console.log("category",category)
            var street=component.find("street").get("v.value")
            // console.log("street",street)
            var dob=component.find("dob").get("v.value")
            //console.log("dob",dob)
            var city=component.find("city").get("v.value")
            //console.log("city",city)
            var state=component.find("state").get("v.value")
            // console.log("state",state)
            var code=component.find("code").get("v.value")
            // console.log("code",code)
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
               
                //helper.validateDate(d, dob)
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
                /*const diffTime = d.getTime() - dob.getTime();
                const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365)); */
                console.log('yeardiff',yeardiff)
                if(yeardiff<18){
                    event.preventDefault();
                    component.set("v.disabled",false)
                    $A.util.removeClass(spinner, "slds-show");
                    
                    $A.util.addClass(spinner, "slds-hide");
                    var msg = "Age must be atleast 18!"
                    helper.showNotfication(component,msg,"error","Error!");  
                }
                
            }
        }catch(e){
            console.log(e.message)
        }
    },
    
})
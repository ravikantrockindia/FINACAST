({	 
    doInit:function(component,event,helper){
        try{
            
        var recordId=component.get("v.recordId");
            console.log(recordId);
          //  alert(recordId);
        if(!($A.util.isUndefinedOrNull(recordId)&&recordId=="")){
         var action=component.get("c.getContact");
                action.setParams({ recordId : component.get("v.recordId")});
                
                // Create a callback that is executed after 
                // the server-side action returns
                action.setCallback(this, function(response) {
                    var state = response.getState();
                 //    alert(state)
                    if (state === "SUCCESS") {
                        console.log(response.getReturnValue())
                        component.find("dob").set("v.value", response.getReturnValue()[0].Birthdate);
                                                component.find("email").set("v.value", response.getReturnValue()[0].Email);
                        component.find("phone").set("v.value", response.getReturnValue()[0].Phone);
                        component.find("gender").set("v.value",response.getReturnValue()[0].FinServ__Gender__c)

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
                // A client-side action could cause multiple events, 
                // which could trigger other events and 
                // other server-side action calls.
                // $A.enqueueAction adds the server-side action to the queue.
                $A.enqueueAction(action);
        }
        }
        catch(e){
            console.log(e.message)
        }
    },
    handleCancel : function(component, event, helper) {
        component.set("v.isEditTrue",false);
        component.set("v.isImageAvailable",false); 
        var DelCon=component.get("v.isFileSelected");
        if(DelCon===true){
            var action = component.get("c.DeleteLatestImage");
            var tFile=component.get("v.FinalVal");
            component.set("v.TempFinalVal",tFile);
            action.setParams({
                cid: component.get("v.recordId"),
            });
            $A.enqueueAction(action);
        }
         
    },
    handleSuccess:function(cmp,event,helper){
        try{
         var action=cmp.get("c.updateContact");
          //  alert('abc')
                action.setParams({ recordId : cmp.get("v.recordId"),
                                  phone: cmp.find("phone").get("v.value"),
                                  email: cmp.find("email").get("v.value"),
                                   gender: cmp.find("gender").get("v.value"),
                                  dob: cmp.find("dob").get("v.value")
                                 });
                
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
                            //$A.util.removeClass(spinner, "slds-show");
                            
                            //$A.util.addClass(spinner, "slds-hide");
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
                    cmp.set("v.isEditTrue", false);  

        }catch(e){
            console.log(e.message);
        }
    },
    handleSubmit: function(component,event,helper){
        var isValidate=helper.validateData(component,event)
        if(!isValidate)
        {
            event.preventDefault();
            var msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);      
        }
        var DelCon=component.get("v.isFileSelected");
        var DefaultImg=component.get("v.DefaultImg");
        var tChange="";
        if(DelCon===true){
            if(DefaultImg===true){
               var tChange=component.get("v.TempFinalVal");
                component.set("v.TempFinalVal",'');
           }else{
               var tChange=component.get("v.ResourceImage");
               component.set("v.TempFinalVal",tChange);
           }
            console.log('Final Image ' +tChange);
            component.set("v.FinalVal",tChange);
          //  component.set("v.TempFinalVal",'');
        }
        
    },
    
    handleFilesChange: function(component, event, helper) {
        var fileName = 'No File Selected..';
        if (event.getSource().get("v.files").length > 0) {
            fileName = event.getSource().get("v.files")[0]['name'];
        }
        component.set("v.fileName", fileName);
        component.set("v.isFileSelected",true);
        if (component.find("fileId").get("v.files").length > 0) {
            helper.uploadHelper(component, event);
        }
        else {
            alert('Please Select a Valid File');
        }
    },
    itemsChange:function(component,event,helper){
        helper.uploadHelper(component,event);
    },
})
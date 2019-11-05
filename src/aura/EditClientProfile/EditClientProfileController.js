({	 
    doInit:function(component,event,helper){
        try{
            
            var recordId=component.get("v.recordId");
            if(!($A.util.isUndefinedOrNull(recordId)&&recordId=="")){
                var action=component.get("c.getContact");
                action.setParams({ recordId : component.get("v.recordId")});
                
                // Create a callback that is executed after 
                // the server-side action returns
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        console.log(response.getReturnValue())
                        component.find("dob").set("v.value",response.getReturnValue()[0].Birthdate);
                        component.set("v.dob", response.getReturnValue()[0].Birthdate);
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
        console.log('handle success in edit client profile');
        try{
            
            var action=cmp.get("c.updateContact");
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
                
                if (state === "SUCCESS") {
                    
                    // cmp.set("v.isEditTrue", false);   
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
            cmp.set("v.isEditTrue", false);  
            
        }catch(e){
            console.log(e.message);
        }
        var DelCon=cmp.get("v.isFileSelected");
        var DefaultImg=cmp.get("v.DefaultImg");
        var tChange="";
        if(DelCon===true){
            if(DefaultImg===true){
                var tChange=cmp.get("v.TempFinalVal");
                cmp.set("v.TempFinalVal",'');
            }else{
                var tChange=cmp.get("v.ResourceImage");
                cmp.set("v.TempFinalVal",tChange);
            }
            cmp.set("v.FinalVal",tChange);
        }
    },
    handleSubmit: function(component,event,helper){
        console.log('handle submit in edit client profile');
        var isValidate=helper.validateData(component,event);
        if(!isValidate)
        {
            event.preventDefault();
            var msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);      
        }
        $A.get('e.force:refreshView').fire();
        /*var DelCon=component.get("v.isFileSelected");
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
            component.set("v.FinalVal",tChange);
        }*/
        
    },
    
    handleFilesChange: function(component, event, helper) {
        debugger;
        var fileName = 'No File Selected..';
        var filetype="";
        if (event.getSource().get("v.files").length > 0) {
            fileName = event.getSource().get("v.files")[0]['name'];
            filetype = event.getSource().get("v.files")[0].type;
            
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
    closeModel:function(component,event,helper){
        component.set("v.isEditTrue",false);
    },
    handleError:function(component,event,helper){
        console.log('In handle error')
    }
})
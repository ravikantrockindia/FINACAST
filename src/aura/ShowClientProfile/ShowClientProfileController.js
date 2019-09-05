({	
    doInit:function(component,event,helper){
        var action = component.get("c.getNameSpace");
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if( state === 'SUCCESS') {
                component.set("v.NameSpace", response.getReturnValue());
            } 
        });
        helper.fetchImage(component,event,helper);
         $A.enqueueAction(action);
          var recordId=component.get("v.recordId");
        if(!($A.util.isUndefinedOrNull(recordId)&&recordId=="")){
         var action=component.get("c.getContact");
                action.setParams({ recordId : component.get("v.recordId")});
                
                // Create a callback that is executed after 
                // the server-side action returns
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        component.set("v.dob", response.getReturnValue()[0].Birthdate);
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
    },
    itemsChange:function(component,event,helper){
        helper.fetchImage(component,event,helper);
    },
    handleProfile : function(component, event, helper) {
        component.set("v.isEditTrue",true);
        component.set("v.isImageAvailable",true);
        var cmpTarget = component.find('change');
        $A.util.removeClass(cmpTarget, "slds-hide"); 
    },
    closeModel:function(component,event,helper){
        component.set("v.isEditTrue",false);
        component.set("v.isImageAvailable",false);    
    }
})
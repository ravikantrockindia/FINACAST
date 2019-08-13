({
	validateData:function(component,event){
         var name=component.find("name").get("v.value")
        console.log("name",name)
        var category=component.find("category").get("v.value")
        console.log("category",category)
        var street=component.find("street").get("v.value")
        console.log("street",street)
        var dob=component.find("dob").get("v.value")         
        console.log("dob",dob)
        var city=component.find("city").get("v.value")
        console.log("city",city)
        var state=component.find("state").get("v.value")
        console.log("state",state)
        var code=component.find("code").get("v.value")
        console.log("code",code)
        if ($A.util.isUndefinedOrNull(name) || name == "" ||  
            $A.util.isUndefinedOrNull(category) || category == "" || $A.util.isUndefinedOrNull(street) || 
            street ==""  || $A.util.isUndefinedOrNull(dob) || dob =="" || $A.util.isUndefinedOrNull(city) || city ==""  
            || $A.util.isUndefinedOrNull(state) || state ==""  || $A.util.isUndefinedOrNull(code) || code =="" )
            
        {
           return false;     
        }
        return true;
    },
    showAlertEmptyInvalidVal : function(component,msg){
        console.log("inhelper");
        // component.set("v.errors", [{message:"Invalid field: " }]);
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "error",
            "title": "Error!",
            "message": msg
        });
        toastEvent.fire();
    },
    
    fetchImage:function(cmp,event,helper){
        var recordId = cmp.get("v.recordId");
        var action = cmp.get("c.getContents");
        action.setParams({ cid : recordId });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            var uploadedFiles = event.getParam("files");
            var retRes=JSON.stringify(response.getReturnValue()); 
            if(cmp.isValid() && state === 'SUCCESS') {
                
                cmp.set("v.contents", response.getReturnValue());
            } 
        });
        $A.enqueueAction(action);
    },
})
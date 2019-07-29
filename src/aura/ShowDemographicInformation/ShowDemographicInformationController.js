({
    handleUploadFinished: function (cmp, event,helper) {
        console.log('On File Upload!');
        helper.fetchImage(cmp,event,helper);
        // This will contain the List of File uploaded data and status
        /*var uploadedFiles = event.getParam("files");
        console.log(uploadedFiles);*/
    },
    handleSuccess:function(cmp,event,helper){
        cmp.set("v.isModalOpen", false);  
    },
    handleSave:function(com,event,helper){
      component.set("v.isModalOpen", false);  
     },
   openModel: function(component, event, helper) {
      // Set isModalOpen attribute to true
      component.set("v.isModalOpen", true);
   },
   closeModel: function(component, event, helper) {
      // Set isModalOpen attribute to false  
      component.set("v.isModalOpen", false);
   },
    handleCancel:function(component, event, helper) {
      // Set isModalOpen attribute to false  
      component.set("v.isModalOpen", false);
   },
   submitDetails: function(component, event, helper) {
        var childComponent = component.find("childCmp");
        var message = childComponent.messageMethod();
        component.set("v.isModalOpen", false);
    },
    handleSubmit: function(component,event,helper){
        var isValidate=helper.validateData(component,event)
        if(!isValidate)
        {
            event.preventDefault();
            var msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);      
        }
       
    },
    doInit:function(cmp,event,helper){
        console.log('In Do Init!');
        var action = cmp.get("c.getNameSpace");
         
        action.setCallback(this, function(response) {
            var state = response.getState();
             
            if( state === 'SUCCESS') {
                
                cmp.set("v.NameSpace", response.getReturnValue());
            } 
        });
        $A.enqueueAction(action);
        helper.fetchImage(cmp,event,helper);
        //var myAttribute = component.get("v.myAttribute");
         /*var action = cmp.get("c.getContents");
         action.setParams({ cid : cmp.get("0014600001eTE2zAAG") });

        action.setCallback(this, function(response) {
           var state = response.getState();
           var uploadedFiles = event.getParam("files");
           var retRes=JSON.stringify(response.getReturnValue()); 
          // console.log("return Value"+JSON.stringify(response.getReturnValue()));
           if(cmp.isValid() && state === 'SUCCESS') {
                
                cmp.set("v.contents", response.getReturnValue());
                //console.log('hey this is test msg');
           } 
       });
        $A.enqueueAction(action);*/
    },
    
    handleChange:function(cmp,event,helper){
        console.log('In Change Handler!');
        helper.fetchImage(cmp,event,helper);
    },
      // Set isModalOpen attribute to false
      //Add your code to call apex method or do some processing
      //component.set("v.isModalOpen", false);
    handleAdditionalInformation:function(cmp,event,helper){
        
    },
    handleLastInteraction:function(cmp,event,helper){
        
    },
    handleAssociatedHousehold:function(cmp,event,helper){
        
    }
});
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
                console.log('Namespace of showDemographic' + cmp.get("v.NameSpace"));
            } 
        });
       // console.log('Namespace of showDemographic' + cmp.get("v.NameSpace"));
		helper.fetchImage(cmp,event,helper);
        $A.enqueueAction(action);
        
         
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
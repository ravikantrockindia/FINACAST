({
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
        cmp.set("v.isEditTrue", false);  
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
        if(DelCon===true){
            var tChange=component.get("v.TempFinalVal");
            console.log('Final Image ' +tChange);
            component.set("v.FinalVal",tChange);
            component.set("v.TempFinalVal",'');
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
})
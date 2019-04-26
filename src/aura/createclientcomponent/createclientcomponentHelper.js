({
	successToast : function(component, event, helper) {
    var toastEvent = $A.get("e.force:showToast");
    toastEvent.setParams({
        type : "success",
        "title": "Success!",
        "message": "The record has been saved."
    });
    toastEvent.fire();
},
    errorToast : function(component, event, helper) {
    var toastEvent = $A.get("e.force:showToast");
    toastEvent.setParams({
        type : "error",
        "title": "Error!",
        "message": "Record can not be saved. Please try again"
    });
    toastEvent.fire();
}
})
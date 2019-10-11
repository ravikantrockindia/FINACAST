({
    closeModel : function(component, event, helper) {
        helper.hideExampleModal(component);
        
    },
    
    saveAndCloseBtn : function(component, event, helper) {

        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "title": "Save Success!",
            type: 'success',
            "message": "Scenario has been Saved"           
        });
        resultsToast.fire();   
        $A.get('e.force:refreshView').fire();
        helper.hideExampleModal(component);
    },
})
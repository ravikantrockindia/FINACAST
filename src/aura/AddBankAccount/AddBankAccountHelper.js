({
    getAccounts : function(component) {
        
        var action=component.get('c.returnBankAccount');
        action.setParams({ recordId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var spinner = component.find("mySpinner");
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                var list=JSON.stringify(response.getReturnValue());
                var list1= list.replace(/Finsol__/g,"")
                component.set("v.FinancialAccountList",JSON.parse(list1))
                
            }
            else if (state === "ERROR") {
                var spinner = component.find("mySpinner");
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
        
        $A.enqueueAction(action);
        
    },
    showNotfication : function(component,msg,type,title){
        try{
            component.find('notifLib').showToast({
                "title": title,
                "variant":type,
                "message": msg,
                "mode":"dismissable"
            });
            
        }catch(e){
            console.log(e.message)
        } 
    }
})
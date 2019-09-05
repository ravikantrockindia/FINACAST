({
    createExpense : function(component) {
        component.set("v.disabled",false)        
        var primaryOwner=component.get("v.recordId")
        var recordTypeId=component.get("v.recordTypeId")
        var action=component.get("c.addExpense");
        action.setParams({ recordId : primaryOwner });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {                
                var a=response.getReturnValue();
                
                
                var expenseList=component.get("v.ExpenseList");
                
                expenseList.push(a);
                component.set("v.ExpenseList", expenseList);
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
        $A.enqueueAction(action);
        
    },
    
    handleShowToast : function(component, event, helper) {
        component.find('notifLib').showToast({
            "title": "Error!",
            "variant":"error",
            "mode":"dismissable",
            "message": "The record has been updated successfully."
        });
    },
    
    showValidationMessage:function(component){
        var data=component.get("v.ExpenseList")
        
        for (var e in data ){
            if(data[e]["expense"]["Does_contribution_bring_tax_benifit__c"]){
                data[e]["showSection"]=true;
            }
        }
        component.set("v.ExpenseList",data)
        
    },
    validateDate: function(component){
        var data=component.get("v.ExpenseList")
        
        var isAllValid=true;
        var enddate=component.find('enddate');
        if(enddate.length>0){
            isAllValid = enddate.reduce(function(isValidSoFar, inputCmp){
                inputCmp.showHelpMessageIfInvalid();
                //check if the validity condition are met or not.
                return isValidSoFar && inputCmp.checkValidity();
            },true);
        }
        else{
            
            isAllValid =enddate.get("v.validity").valid
            enddate.showHelpMessageIfInvalid();
        }
        for (var e in data ){
            var startdate=data[e]["expense"]["startDate"]
            if($A.util.isUndefinedOrNull(startdate) || startdate==""){
                
                var dt=new Date();
                var date= dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();                
                data[e]["expense"]["startDate"]=date;
            }
        }
        component.set("v.ExpenseList",data)
        
        var startdate=component.find('startdate');
        
        
        if(enddate.length>0){
            for(var i=0;i<enddate.length;i++){
                var edate=enddate[i].get("v.value")
                var edateName=enddate[i].get("v.name")
                if(!($A.util.isUndefinedOrNull(edate) && edate=="")){
                    for(var j=0;j<startdate.length;j++){
                        var sdate=startdate[i].get("v.value")
                        var sdateName=startdate[i].get("v.name")
                        var edateIndex=edateName.split("_")[1]
                        var sdateIndex=sdateName.split("_")[1]
                        if(edateIndex==sdateIndex){
                            if(new Date(sdate)>new Date(edate)){
                                enddate[i].setCustomValidity("End date cannot be less than start date")
                                isAllValid=false
                            }
                            else{
                                enddate[i].setCustomValidity("")
                            }
                            enddate[i].reportValidity();
                            
                        }
                    }
                }
            }
        }
        else{
            var edate=enddate.get("v.value")
            if(!($A.util.isUndefinedOrNull(edate) && edate=="")){
                if(new Date(startdate.get("v.value"))>new Date(edate)){
                    enddate.setCustomValidity("End date cannot be less than start date")
                    isAllValid=false;
                    enddate.reportValidity();
                }
                else{
                    enddate.setCustomValidity("")
                    enddate.reportValidity();  
                }
                
                
            }
        }
        return isAllValid;
        
        
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
    }, 
    
})
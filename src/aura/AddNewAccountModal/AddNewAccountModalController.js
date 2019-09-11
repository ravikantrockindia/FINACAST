({
    
    onClickCancel: function(component, event, helper) {
        component.set("v.showInModal",false);
    },
    changeOption:function(component,event){
       //component.set("v.showInModal1",true)
       var value=component.get("v.value");
        if(value=='Loan'){
            var recordTypeIds=component.get("v.recordTypeIds")
                for(var i=0;i<recordTypeIds.length;i++){             
                    if(recordTypeIds[i].DeveloperName=='LoanAccount'){
                        component.set("v.recordTypeId",recordTypeIds[i].Id)
                    
                }
            }
        }
        if(value=='Credit'){
            var recordTypeIds=component.get("v.recordTypeIds")
                for(var i=0;i<recordTypeIds.length;i++){             
                    if(recordTypeIds[i].DeveloperName=='CreditCard'){
                        component.set("v.recordTypeId",recordTypeIds[i].Id)
                    
                }
            }
        }
    }
})
({
    sortData: function (cmp, fieldName, sortDirection) {
        var data = cmp.get("v.data");
        var reverse = sortDirection !== 'asc';
        
        data = Object.assign([],
                             data.sort(this.sortBy(fieldName, reverse ? -1 : 1))
                            );
        cmp.set("v.data", data);
    },
    sortBy: function (field, reverse, primer) {
        var key = primer
        ? function(x) {
            return primer(x[field]);
        }
        : function(x) {
            return x[field];
        };
        return function (a, b) {
            var A = key(a);
            var B = key(b);
            return reverse * ((A > B) - (B > A));
        };
    },
    
    getTransactions: function(component,event){
        var spinner =component.find("spinner");
        
        var action=component.get("c.retrieveTransactions");
        var clientId=component.get("v.clientId");
        var rowLimit=component.get("v.rowLimit");
        var rowOffSet=component.get("v.rowOffSet");
        var data=component.get("v.data");
        var subOption;
        if(component.get("v.subOptions").length>0){
            subOption=component.find("sub-options").get("v.value");
        }
        
        action.setParams({
            ClientId: clientId,
            rowLimit:rowLimit,
            rowOffset: rowOffSet,
            isDays: component.get("v.isRecentDays"),
            days: component.find("filterbydays").get("v.value"),
            isDateRange: component.get("v.isDateRange"),
            startDate : new Date(component.find("startDate").get("v.value")),
            endDate: new Date(component.find("endDate").get("v.value")),
            type :component.find("filterbytype").get("v.value"),
            option: component.find("options").get("v.value"),
            subOption: subOption
            
            
        });
        action.setCallback(component,function(response){
            var status=response.getState();
            if(status=="SUCCESS"){
                console.log(response.getReturnValue())
                component.set("v.data",data.concat(response.getReturnValue().transactionList) )
                component.set("v.rowOffSet",rowLimit+rowOffSet);
                if(rowLimit+rowOffSet>=response.getReturnValue().totalRecords){
                    component.set("v.enableInfiniteLoading",false);
                    
                }
                else{
                    component.set("v.enableInfiniteLoading",true);
                    
                    
                }
                if(!$A.util.isUndefinedOrNull(event)){
                    event.getSource().set("v.isLoading", false);
                }
                
                
                else{
                    if(!$A.util.isUndefinedOrNull(event)){
                        
                        event.getSource().set("v.isLoading", false);
                    }
                    
                }
            }
            $A.util.removeClass(spinner, 'slds-show');
            $A.util.addClass(spinner, 'slds-hide'); 
        });
        $A.enqueueAction(action);
        
    },
    handleShowNotice : function(component,variant,header,message) {
        component.find('notifLib').showToast({
            "variant":variant,
            "title":header,
            "message": message,

        });
    }
})
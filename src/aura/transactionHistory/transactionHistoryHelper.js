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
        var action=component.get("c.retrieveTransactions");
        var clientId=component.get("v.clientId");
        var rowLimit=component.get("v.rowLimit");
        var rowOffSet=component.get("v.rowOffSet");
        var data=component.get("v.data");
        var subOption;
        if(component.get("v.subOptions").length>0){
            subOption=component.find("sub-options").get("v.value");
        }
        
        console.log(component.find("v.isDateRange"))
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
                // component.set("v.totaldata", response.getReturnValue())
                component.set("v.data",data.concat(response.getReturnValue().transactionList) )
                // component.set("v.data", response.getReturnValue().transactionList)
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
                
            }
            else{
                if(!$A.util.isUndefinedOrNull(event)){
                    
                    event.getSource().set("v.isLoading", false);
                }
                
            }
        });
        $A.enqueueAction(action);
        
    },
    /* getmoreTransactions: function(component){
        var action=component.get("c.retrieveTransactions");
        var clientId=component.get("v.clientId")
        var rows=component.get("v.rowLimit")
        console.log(typeof rows)
        action.setParams({
            ClientId: clientId,
            rowLimit: component.get("v.rowLimit"),
            rowOffset: component.get("v.rowOffSet"),
            isDays: component.get("v.isRecentDays"),
            days: component.find("filterbydays").get("v.value"),
            
            isDateRange: component.find("v.isDateRange"),
            startDate : new Date(component.find("startDate").get("v.value")),
            endDate: new Date(component.find("endDate").get("v.value")),
            type :component.find("filterbytype").get("v.value"),
            
        });
        action.setCallback(component,function(response){
            var status=response.getState();
            if(status=="SUCCESS"){
                console.log(response.getReturnValue())
                // component.set("v.totaldata", response.getReturnValue())
                component.set("v.totalRows",response.getReturnValue().totalRecord); 
                component.set("v.data",data.concat( totalData.slice(offset,rowCount)))                
                if(response.getReturnValue().totalRecords<=rows){
                    component.set("v.enableInfiniteLoading",false);
                    
                    
                }
                else{
                    component.set("v.enableInfiniteLoading",true);
                    
                    
                }
                
            }
            else{
                
            }
        });
        $A.enqueueAction(action);
        
    }*/
})
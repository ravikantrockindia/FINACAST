({
    doInit: function(component,event,helper){
        
        var spinner =component.find("spinner");
        $A.util.removeClass(spinner, 'slds-hide');
        $A.util.addClass(spinner, 'slds-show');
        var workspaceAPI = component.find("workspace");
        var tab=component.get("v.tabName")
        
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.setTabLabel({
                label: tab
            });
        })
        .catch(function(error) {
            console.log(error);
        });
        var columns = [
            {label: 'Date', fieldName: 'FinServ__TransactionDate__c', type: 'date', sortable: true},
            
            {label: ' Description', fieldName: 'FinServ__Description__c', type: 'text', sortable: true},
            {label: 'Amount', fieldName: 'FinServ__Amount__c', type: 'currency', sortable: true},
            {label: 'Type', fieldName: 'FinServ__TransactionType__c', type: 'text', sortable: true} ];  
        component.set("v.columnList", columns);
        helper.getTransactions(component,event);
        
    },
    updateColumnSorting: function (cmp, event, helper) {
        var spinner =cmp.find("spinner");
        $A.util.removeClass(spinner, 'slds-hide');
        $A.util.addClass(spinner, 'slds-show');       
        setTimeout($A.getCallback(function() {
            var fieldName = event.getParam('fieldName');
            var sortDirection = event.getParam('sortDirection');
            cmp.set("v.sortedBy", fieldName);
            cmp.set("v.sortedDirection", sortDirection);
            helper.sortData(cmp, fieldName, sortDirection);
            $A.util.removeClass(spinner, 'slds-show');
            $A.util.addClass(spinner, 'slds-hide'); 
        }), 0);
    },
    
    loadMoreData:function(component,event,helper){
        event.getSource().set("v.isLoading", true);
        helper.getTransactions(component,event);
        
    },
    
    recentDays:function(component,event,helper){
        var changeValue = event.target.value;
        component.set("v.enableSearch",false);
        var moreoption=component.find('moreOptions');
        $A.util.removeClass(moreoption,"slds-hide");
        $A.util.addClass(moreoption,"slds-show");
        if(changeValue=='days'){
            
            component.set("v.isRecentDays", true);
            component.set("v.isDateRange",false);
            component.find("endDate").set("v.value","");
            component.find("startDate").set("v.value","");
            component.find("filterbytype").set("v.value","");
            component.find("options").set("v.value","");
            var empty=new Array();
            
            component.set("v.subOptions",empty )
            var spinner =component.find("spinner");
            $A.util.removeClass(spinner, 'slds-hide');
            $A.util.addClass(spinner, 'slds-show');       
            component.set("v.rowOffSet",0);
            component.set("v.rowLimit",20);
            var value=component.find("filterbydays").get("v.value");
            component.set("v.data",empty);
            
            helper.getTransactions(component);
            
            
        }
        else if(changeValue=='dateRange'){
            
            component.set("v.isRecentDays", false);
            component.find("filterbydays").set("v.value","")
            component.find("filterbytype").set("v.value","");
            component.find("options").set("v.value","");
            var empty=new Array();
            
            component.set("v.subOptions",empty )
            
            component.set("v.isDateRange",true)
            var spinner =component.find("spinner");
            $A.util.removeClass(spinner, 'slds-hide');
            $A.util.addClass(spinner, 'slds-show');       
            component.set("v.rowOffSet",0);
            component.set("v.rowLimit",20);
            var value=component.find("filterbydays").get("v.value");
            component.set("v.data",empty);
            
            helper.getTransactions(component);
            
        }
        
        console.log(component.get("v.isRecentDays"))
    },
    
    filter:function(component,event,helper){
        var spinner =component.find("spinner");
        $A.util.removeClass(spinner, 'slds-hide');
        $A.util.addClass(spinner, 'slds-show');       
        
        if(component.get("v.isRecentDays")){
            var value= component.find("filterbydays").get("v.value")
            if($A.util.isUndefinedOrNull(value) || value==""){
                $A.util.removeClass(spinner, 'slds-show');
                $A.util.addClass(spinner, 'slds-hide'); 
                helper.handleShowNotice(component,"error","Error!","Please select an option from Recent Days");
                return;
            }
            component.set("v.rowOffSet",0);
            component.set("v.rowLimit",20);
            var value=component.find("filterbydays").get("v.value");
            var empty=new Array();
            component.set("v.data",empty);
            
            
            
        }
        if(component.get("v.isDateRange")){
            var start= component.find("startDate").get("v.value")
            var end= component.find("endDate").get("v.value")
            
            if($A.util.isUndefinedOrNull(start) || start==""){
                $A.util.removeClass(spinner, 'slds-show');
                $A.util.addClass(spinner, 'slds-hide'); 
                helper.handleShowNotice(component,"error","Error!","Please enter Start date ");
                
                return;
            }
            if($A.util.isUndefinedOrNull(end) || end==""){
                $A.util.removeClass(spinner, 'slds-show');
                $A.util.addClass(spinner, 'slds-hide'); 
                helper.handleShowNotice(component,"error","Error!","Please enter End date");
                
                return;
            }
            if(start>end){
                $A.util.removeClass(spinner, 'slds-show');
                $A.util.addClass(spinner, 'slds-hide'); 
                helper.handleShowNotice(component,"error","Error!","Looks like you have selected Start Date greater than End Date");
                
                return;
            }
            component.set("v.rowOffSet",0);
            component.set("v.rowLimit",20);
            var value=component.find("filterbydays").get("v.value");
            var empty=new Array();
            component.set("v.data",empty);
            
        }
        helper.getTransactions(component);
        
    },
    handleRowAction: function (component, event) {
        var selectedRows = event.getParam('selectedRows');
        console.log(JSON.stringify(selectedRows))
        var rowIds=new Array();
        for(var i=0;i< selectedRows.length;i++){
            console.log(JSON.stringify(selectedRows[i]));
            rowIds.push(selectedRows[i].Id);
        }
        console.log(rowIds)
        if(rowIds.length>0){
            component.set("v.disabled",false);
        }
        else{
            component.set("v.disabled",true);
            
        }
        component.set("v.rowsToDelete",rowIds);
    },
    deleteTransaction:function(component,event,helper){
        var spinner =component.find("spinner");
        $A.util.removeClass(spinner, 'slds-hide');
        $A.util.addClass(spinner, 'slds-show');       
        var transactionIds=component.get("v.rowsToDelete");
        var action=component.get("c.deleteTransactions");
        
        action.setParams({
            transactionIds : transactionIds
            
        });
        action.setCallback(this,function(response){
            var status=response.getState();
            if(status=="SUCCESS"){
                var empty=new Array();
                component.set("v.data",empty);
                component.set("v.rowOffSet",0);
                component.set("v.rowLimit",20);
                helper.getTransactions(component);
                
            }
            
        });
        $A.enqueueAction(action);
    },
    
    filterWithOptions:function(component,event,helper){
        
        
        var clientId=component.get("v.clientId")
        var action=component.get("c.getSubOptions");
        
        console.log(component.find("v.isDateRange"))
        action.setParams({
            clientId: clientId,
            option: component.find("options").get("v.value")
            
            
        });
        action.setCallback(component,function(response){
            var status=response.getState();
            
            if(status=="SUCCESS"){
                console.log(response.getReturnValue())
                component.set("v.subOptions",response.getReturnValue() )
                if(component.get("v.subOptions").length>0){
                    debugger;
                    component.find("sub-options").set("v.value","");
                }               
                
                
                
            }
            else{
                
            }
        });
        $A.enqueueAction(action);
        
    },
    
})
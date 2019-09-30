({
    doInit: function(component,event,helper){
        
        var spinner =component.find("spinner");
        $A.util.removeClass(spinner, 'slds-hide');
        $A.util.addClass(spinner, 'slds-show');
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.setTabLabel({
                tabId: focusedTabId,
                label: "Transaction History"
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
        $A.util.removeClass(spinner, 'slds-show');
        
        $A.util.addClass(spinner, 'slds-hide');
        /* var action=component.get("c.allTransactions");
        var clientId=component.get("v.clientId")
        var rows=component.get("v.rowLimit")
        console.log(typeof rows)
        action.setParams({
            ClientId: clientId,
            
        });
        action.setCallback(this,function(response){
            var status=response.getState();
            if(status=="SUCCESS"){
                console.log(response.getReturnValue())
                component.set("v.totaldata", response.getReturnValue())
                component.set("v.totalRows",response.getReturnValue().length);  
                if(response.getReturnValue().length<=rows){
                    component.set("v.data", response.getReturnValue())
                    component.set("v.enableInfiniteLoading",false);
                    
                    
                }
                else{
                    component.set("v.enableInfiniteLoading",true);
                    
                    component.set("v.data", response.getReturnValue().slice(0,rows));
                    
                }
            }
            else{
                
            }
        });
        $A.enqueueAction(action);*/
        
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
            //  cmp.set('v.isLoading', false);
            $A.util.removeClass(spinner, 'slds-show');
            
            $A.util.addClass(spinner, 'slds-hide'); 
        }), 0);
    },
    
    loadMoreData:function(component,event,helper){
        event.getSource().set("v.isLoading", true);
        
        helper.getTransactions(component,event);
        
        /*var rows=component.get("v.rowLimit")
        var offset=component.get("v.rowOffSet")
        var rowCount=component.get("v.totalRows")
        var totalData=component.get("v.totaldata");
        var data=component.get("v.data");
        if(rows+offset>=rowCount){
            component.set("v.data",data.concat( totalData.slice(offset,rowCount)));
            component.set("v.enableInfiniteLoading",false);
            
        }
        else{
            component.set("v.data", data.concat( totalData.slice(offset,rows+offset)));
            component.set("v.rowOffSet",offset+rows);
            
        }*/
    },
    recentDays:function(component,event,helper){
        var changeValue = event.target.value;
        if(changeValue=='days'){
            
            component.set("v.isRecentDays", true);
            component.set("v.isDateRange",false);
            component.find("endDate").set("v.value","");
            component.find("startDate").set("v.value","");
            var spinner =component.find("spinner");
            $A.util.removeClass(spinner, 'slds-hide');
            $A.util.addClass(spinner, 'slds-show');       
            component.set("v.rowOffSet",0);
            component.set("v.rowLimit",20);
            var value=component.find("filterbydays").get("v.value");
            var empty=new Array();
            component.set("v.data",empty);
            
            helper.getTransactions(component);
            $A.util.removeClass(spinner, 'slds-show');
            
            $A.util.addClass(spinner, 'slds-hide');
            
        }
        else if(changeValue=='dateRange'){
            
            component.set("v.isRecentDays", false);
            component.find("filterbydays").set("v.value","")
            component.set("v.isDateRange",true)
            var spinner =component.find("spinner");
            $A.util.removeClass(spinner, 'slds-hide');
            $A.util.addClass(spinner, 'slds-show');       
            component.set("v.rowOffSet",0);
            component.set("v.rowLimit",20);
            var value=component.find("filterbydays").get("v.value");
            var empty=new Array();
            component.set("v.data",empty);
            
            helper.getTransactions(component);
            $A.util.removeClass(spinner, 'slds-show');
            
            $A.util.addClass(spinner, 'slds-hide');
        }
        
        console.log(component.get("v.isRecentDays"))
    },
    filter:function(component,event,helper){
        var spinner =component.find("spinner");
        $A.util.removeClass(spinner, 'slds-hide');
        $A.util.addClass(spinner, 'slds-show');       
        component.set("v.rowOffSet",0);
        component.set("v.rowLimit",20);
        var value=component.find("filterbydays").get("v.value");
        var empty=new Array();
        component.set("v.data",empty);
        
        helper.getTransactions(component);
        $A.util.removeClass(spinner, 'slds-show');
        
        $A.util.addClass(spinner, 'slds-hide');
        console.log(value)
        /* var action=component.get("c.transactionsfilterbydays");
        var clientId=component.get("v.clientId")
        var rows=component.get("v.rowLimit")
        console.log(typeof rows)
        action.setParams({
            ClientId: clientId,
            days : value
            
        });
        action.setCallback(this,function(response){
            var status=response.getState();
            if(status=="SUCCESS"){
                console.log(response.getReturnValue())
                component.set("v.totaldata", response.getReturnValue())
                component.set("v.totalRows",response.getReturnValue().length);  
                if(response.getReturnValue().length<=rows){
                    component.set("v.data", response.getReturnValue())
                    component.set("v.enableInfiniteLoading",false);
                    
                    
                }
                else{
                    component.set("v.enableInfiniteLoading",true);
                    
                    component.set("v.data", response.getReturnValue().slice(0,rows));
                    
                }
            }
            else{
                
            }
        });
        $A.enqueueAction(action);*/
        
    },
    handleRowAction: function (component, event) {
        var selectedRows = event.getParam('selectedRows');
        console.log(JSON.stringify(selectedRows))
        // var rows=component.get("v.rowsToDelete");
        var rowIds=new Array();
        for(var i=0;i< selectedRows.length;i++){
            console.log(JSON.stringify(selectedRows[i]));
            rowIds.push(selectedRows[i].Id);
        }
        // rows.push(selectedRow[0].Id);
        console.log(rowIds)
        if(rowIds.length>0){
            component.set("v.disabled",false);
        }
        else{
            component.set("v.disabled",true);
            
        }
        component.set("v.rowsToDelete",rowIds);
        // cmp.set('v.selectedRowsCount', selectedRows.length);
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
                $A.util.removeClass(spinner, 'slds-show');
                
                $A.util.addClass(spinner, 'slds-hide'); 
            }
            
        });
        $A.enqueueAction(action);
    },
    dateSearch:function(component,event,helper){
        var spinner =component.find("spinner");
        $A.util.removeClass(spinner, 'slds-hide');
        $A.util.addClass(spinner, 'slds-show');     
        var empty=new Array();
        component.set("v.data",empty);
        component.set("v.rowOffSet",0);
        component.set("v.rowLimit",20);
        helper.getTransactions(component);
        $A.util.removeClass(spinner, 'slds-show');
        
        $A.util.addClass(spinner, 'slds-hide'); 
        /*var action=component.get("c.transactionByDateRange");
        var clientId=component.get("v.clientId")
        var rows=component.get("v.rowLimit")
        console.log(typeof rows)
        debugger;
        console.log(typeof component.find("startDate").get("v.value"))
        console.log(new Date(component.find("endDate")))
        action.setParams({
            ClientId: clientId,
            startDate : new Date(component.find("startDate").get("v.value")),
            endDate: new Date(component.find("endDate").get("v.value"))
            
        });
        action.setCallback(this,function(response){
            var status=response.getState();
            if(status=="SUCCESS"){
                console.log(response.getReturnValue())
                component.set("v.totaldata", response.getReturnValue())
                component.set("v.totalRows",response.getReturnValue().length);  
                if(response.getReturnValue().length<=rows){
                    component.set("v.data", response.getReturnValue())
                    component.set("v.enableInfiniteLoading",false);
                    
                    
                }
                else{
                    component.set("v.enableInfiniteLoading",true);
                    
                    component.set("v.data", response.getReturnValue().slice(0,rows));
                    
                }
            }
            else{
                
            }
        });
        $A.enqueueAction(action);*/
    },
    
    filterByTransactionType:function(component,event, helper){
        var spinner =component.find("spinner");
        $A.util.removeClass(spinner, 'slds-hide');
        $A.util.addClass(spinner, 'slds-show');        // We use the setTimeout method here to simulate the async
        var empty=new Array();
        component.set("v.data",empty);
        component.set("v.rowOffSet",0);
        component.set("v.rowLimit",20);
        helper.getTransactions(component);
        $A.util.removeClass(spinner, 'slds-show');
        
        $A.util.addClass(spinner, 'slds-hide'); 
        /* var action=component.get("c.transactionByType");
        var clientId=component.get("v.clientId")
        var rows=component.get("v.rowLimit")
        console.log(typeof rows)
        debugger;
        console.log(typeof component.find("startDate").get("v.value"))
        console.log(new Date(component.find("endDate")))
        action.setParams({
            ClientId: clientId,
            type :component.find("filterbytype").get("v.value"),
            
        });
        action.setCallback(this,function(response){
            var status=response.getState();
            if(status=="SUCCESS"){
                console.log(response.getReturnValue())
                component.set("v.totaldata", response.getReturnValue())
                component.set("v.totalRows",response.getReturnValue().length);  
                if(response.getReturnValue().length<=rows){
                    component.set("v.data", response.getReturnValue())
                    component.set("v.enableInfiniteLoading",false);
                    
                    
                }
                else{
                    component.set("v.enableInfiniteLoading",true);
                    
                    component.set("v.data", response.getReturnValue().slice(0,rows));
                    
                }
            }
            else{
                
            }
        });
        $A.enqueueAction(action);*/
    },
    filterWithOptions:function(component,event,helper){
        var spinner =component.find("spinner");
        $A.util.removeClass(spinner, 'slds-hide');
        $A.util.addClass(spinner, 'slds-show');        // We use the setTimeout method here to simulate the async
        var empty=new Array();
        component.set("v.data",empty);
        component.set("v.rowOffSet",0);
        component.set("v.rowLimit",20);
        helper.getTransactions(component);
        var data=component.get("v.data");
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
                // component.set("v.totaldata", response.getReturnValue())
                component.set("v.subOptions",response.getReturnValue() )
                if(component.get("v.subOptions").length>0){
                    component.find("sub-options").set("v.value","");
                }                $A.util.removeClass(spinner, 'slds-show');
                
                $A.util.addClass(spinner, 'slds-hide'); 
                // component.set("v.data", response.getReturnValue().transactionList)
                
                
            }
            else{
                
            }
        });
        $A.enqueueAction(action);
        
    },
    filterWithSubOptions:function(component,event,helper){
        var spinner =component.find("spinner");
        $A.util.removeClass(spinner, 'slds-hide');
        $A.util.addClass(spinner, 'slds-show');        // We use the setTimeout method here to simulate the async
        var empty=new Array();
        component.set("v.data",empty);
        component.set("v.rowOffSet",0);
        component.set("v.rowLimit",20);
        helper.getTransactions(component);
        $A.util.removeClass(spinner, 'slds-show');
        
        $A.util.addClass(spinner, 'slds-hide'); 
    },
    
})
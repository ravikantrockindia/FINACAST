({
    closeModel: function(component, event, helper) {
        // Set isModalOpen attribute to false  
        component.set("v.closeModal", false);
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            console.log(JSON.stringify(response))
            var focusedTabId = response.parentTabId;
            workspaceAPI.refreshTab({
                tabId: focusedTabId,
                includeAllSubtabs: true
            });
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    doInit: function(component, event, helper) {
        var namespace=component.get("v.namespace");
        console.log('namespace doinit loan '+namespace);
        
        component.set('v.columns', [
            {label: 'Name', fieldName: namespace+'TransactionName__c',  type: 'text'},
            { 
            "label" :  'Transaction Date',
            "fieldName" : 'FinServ__TransactionDate__c',
            "sortable" : 'true',
            "type" :  'date',
            typeAttributes:{
            year: "numeric",
            month: "short",
            day: "2-digit",
            } ,
            },
            
            {label: 'Description', fieldName: 'FinServ__Description__c',  type: 'text'},
            {label: 'Amount', fieldName: 'FinServ__Amount__c',  type: 'currency'},
           {type: "button", typeAttributes: {
                iconName: 'utility:edit',
                label: '',
                name: 'Edit',
                title: 'Edit',
                disabled: false,
                value: 'test',
                name: 'edit',
                size:'medium',
                variant: {fieldName: 'variantValue'}
            }},
            {type: "button", typeAttributes: {
                iconName: 'utility:delete',
                label: '',
                name: 'Delete',
                title: 'Delete',
                disabled: false,
                size:'medium',
                value: 'test',
                name: 'delete',
                variant: {fieldName: 'variantValue'}
            }},  
            
        ]);     
            var budgeteve1 = component.get("v.getExpenseBudgetId");    
            var limit = component.get("v.initialRows");
            var action = component.get("c.getLoanTransactionlazy");
            action.setParams({
            financialAccountId : budgeteve1,
            rowOffset : 0,
            rowLimit :  limit
            });
            action.setCallback(this, function(response) {    
            var beve1 = response.getReturnValue().TransactionList;
            
            if(beve1.length >0){
                component.set("v.showDatatable",true);
                component.set("v.addExpenseTrans" , beve1);
                component.set("v.totalRows" , response.getReturnValue().totalRecords);
       
                }else{
                component.set("v.showDatatable",false);
                component.set("v.addExpenseTrans" , beve1);
                component.set("v.totalRows" , response.getReturnValue().totalRecords);
                
                }
            
        //    component.set("v.addExpenseTrans" , beve1);
        //    component.set("v.totalRows" , response.getReturnValue().totalRecords);
            });     
            $A.enqueueAction(action);
    },
            
      viewRecord : function(component, event, helper) {
       // var recId = event.getParam('row').Id;
        var actionName = event.getParam('action').name;
        if ( actionName == 'edit' ) {
            var recId= event.getParam('row').Id;
            
         

        component.set("v.showModalExpenseTransaction",true);
        component.set("v.editrecidTransactionExpense",recId);
        } 
        else if ( actionName == 'delete') {
            var retVal = confirm("Are you sure you want to delete this loan transaction?");
            if( retVal == true ) { 
          
        var action = component.get("c.deleteTransaction");
        action.setParams({
            'transactionId' :event.getParam('row').Id
        });
        
        action.setCallback(this, function(response) {      
            var resultsToast = $A.get("e.force:showToast");
            resultsToast.setParams({
                "title": "Delete Success!",
                type: 'success',
                "message": "Record has been deleted successfully"           
            });
            resultsToast.fire();
             helper.helperMethod(component);   
        });     
            $A.enqueueAction(action); 
            return true;
            }
            
            else{
            return false;
            }
            }
    },                    
    createExpenseTransactionRecord : function(component, event, helper) {   
        component.set("v.addExpenseTransaction",true);
        component.set("v.expenseTransaction",event.getSource().get("v.value"));
        component.set("v.isActive",true)
      
               
    },
     onClickEditExpenseTransaction : function(component,event,helper) {
         var recId=event.getSource().get("v.value");

        component.set("v.showModalExpenseTransaction",true);
        component.set("v.editrecidTransactionExpense",recId);
    },
    onClickDeleteTransaction : function(component,event,helper) {  
        
        var action2 = component.get("c.deleteTransaction");
       // var budgeteve1 = component.get("v.getExpenseBudgetId"); 
        action2.setParams({
            'transactionId' :event.getSource().get("v.value")
        });
        
        action2.setCallback(this, function(response) {      

            var resultsToast = $A.get("e.force:showToast");
            resultsToast.setParams({
                "title": "Delete Success!",
                type: 'success',
                "message": "Record has been deleted successfully"           
            });
            resultsToast.fire();
             helper.helperMethod(component);   
        });     
        $A.enqueueAction(action2);        
    },
     handleLoadMore : function(component,event,helper){
        if(!(component.get("v.currentCount") >= component.get("v.totalRows"))){
            //To display the spinner
            event.getSource().set("v.isLoading", true); 
            //To handle data returned from Promise function
            helper.loadData(component).then(function(data){ 
                var currentData = component.get("v.addExpenseTrans");
                var newData = currentData.concat(data);
                component.set("v.addExpenseTrans", newData);
                //To hide the spinner
                event.getSource().set("v.isLoading", false); 
            });
        }
    }       
})
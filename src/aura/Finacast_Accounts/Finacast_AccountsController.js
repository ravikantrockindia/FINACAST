({	
    doInit:function(component,event,helper){
        
        var workspaceAPI = component.find("workspace");
        var tab=component.get("v.tabName")
        console.log('tab',tab)
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            console.log('tab id',focusedTabId )
            workspaceAPI.setTabLabel({
                label: tab
            });
        })
        .catch(function(error) {
            console.log(error);
        });
        debugger;
        var clnt = component.get("v.recordId");
        var accRec = event.getParam("eTid");
      // alert('value return after component event fire'+accRec);  
        component.set("v.Tid", accRec); 
       
        var txnId=component.get("v.Tid");
     //   alert('txnId doinit parent'+txnId);
        //TO GET THE NAME OF FINANCIAL ACCOUNT //
        var action2 = component.get("c.getFinanaceAccountName");
        action2.setParams({
            AccountId: txnId
        });
        action2.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.name",response.getReturnValue());
            }
            
        });
        
        $A.enqueueAction(action2);
        
         helper.fetchTransactionList(component, event, helper);
        
    },
    ShowList:function(component, event, helper){
           var columns = [
            {label: 'Date', fieldName: 'FinServ__TransactionDate__c', type: 'date'}, 
            {label: ' Description', fieldName: 'FinServ__Description__c', type: 'text'},
            {label: 'Amount', fieldName: 'FinServ__Amount__c', type: 'currency' },
            {label: 'Type', fieldName: 'FinServ__TransactionType__c', type: 'text'},
            
            {		
                
                type: 'button-icon',
                fixedWidth: 40,
                typeAttributes: {
                    iconName: 'utility:edit',
                    name: 'edit', 
                    title: 'Edit',
                    variant: 'border-filled',
                    alternativeText: 'edit',
                    disabled: false
                }
            },
            
            {		
                
                type: 'button-icon',
                fixedWidth: 40,
                typeAttributes: {
                    iconName: 'utility:delete',
                    name: 'delete', 
                    title: 'Delete',
                    variant: 'border-filled',
                    alternativeText: 'Delete',
                    disabled: false
                }
            },
            
        ];  
            component.set("v.columnList", columns);
         helper.fetchTransactionList(component, event, helper);
    },
    
    viewRecord:function(component, event, helper){
        var actionName = event.getParam('action').name;
        var getId= event.getParam('row').Id;
        if ( actionName == 'edit' ) {
            
            component.set("v.TxnEditId",getId);
            component.set("v.isEditTransaction",true);

        } 
        else if ( actionName == 'delete') {
            if(confirm('Are you sure?')){
                var spinner = component.find("mySpinner");
                $A.util.removeClass(spinner, "slds-hide");
                $A.util.addClass(spinner, "slds-show");
                var clnt = component.get("v.recordId") 
                console.log('getName'+getId);
            	var action=component.get("c.DeleteFinanceAccountTransaction");
                
                    action.setParams({
                    FinanceAccountTxnId: getId
                    });
                
                    action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                    $A.util.removeClass(spinner, "slds-show");
                    $A.util.addClass(spinner, "slds-hide");
                    helper.fetchTransactionList(component,event,helper); 
                    }
                        else if (state === "ERROR") {
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
            }
        }
    },
 	
    addNewTransaction:function(component, event, helper){
        component.set("v.isAddNewTransaction",true);
    },
    hideExampleModal:function(component, event, helper){
        component.set("v.isAddNewTransaction",false);
        component.set("v.isEditTransaction",false);
    },
    saveAndCloseBtn : function(component, event, helper) {
        
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "title": "Save Success!",
            type: 'success',
            "message": "Transaction Has been Saved"           
        });
        resultsToast.fire();   
        component.set("v.isAddNewTransaction",false);
        
        helper.fetchTransactionList(component,event,helper); 
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-show");
        $A.util.addClass(spinner, "slds-hide");
    },
    handleSubmit : function(component, event, helper)
    { 
 
        var status1 = 0;
        
        var msg = "";
        
        var tdate = component.find("date").get("v.value");
        //  var tdest = component.find("dest").get("v.value");
        var type = component.find("type").get("v.value");
        var tamt = component.find("amt").get("v.value");
        var tname = component.find("name").get("v.value");
        
        if($A.util.isUndefinedOrNull(tname) || tname == ""|| $A.util.isUndefinedOrNull(type) || type == ""|| $A.util.isUndefinedOrNull(tdate) || tdate == "" ||   $A.util.isUndefinedOrNull(tamt) || tamt =="" )
        {
            status1 = 0;
            event.preventDefault();
            msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);       
        }
        else
        {
            status1 = 1;
        }
		 var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
        $A.util.addClass(spinner, "slds-show");
        
    },
    onSuccess:function(component, event, helper) { 
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "title": "Save Success!",
            type: 'success',
            "message": "Transaction Has been Updated!!"           
        });
        resultsToast.fire();  
        component.set("v.isEditTransaction",false);
        helper.fetchTransactionList(component,event,helper); 
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-show");
        $A.util.addClass(spinner, "slds-hide");
    },
    onSubmit:function(component, event, helper) { 
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
        $A.util.addClass(spinner, "slds-show");
    },
     handleLoadMore : function(component,event,helper){
        
         console.log('cc'+component.get("v.currentCount"));
         console.log('cc'+component.get("v.totalRows"));
        if(!(component.get("v.currentCount") >= component.get("v.totalRows"))){
            //To display the spinner
            event.getSource().set("v.isLoading", true); 
            //To handle data returned from Promise function
            helper.loadData(component).then(function(data){ 
                var currentData = component.get("v.data");
                var newData = currentData.concat(data);
                
                component.set("v.data", newData);
                console.log('new data with concate in loadmore'+component.get("v.data"));
                //To hide the spinner
                event.getSource().set("v.isLoading", false); 
            });
        }

     }
})
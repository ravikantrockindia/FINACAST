({	
    doInit:function(component,event,helper){
        debugger;
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
        var clnt = component.get("v.recordId");
        var accRec = event.getParam("eTid");
        console.log('value return after component event fire'+accRec);  
                 component.set("v.Tid", accRec); 
       
        var txnId=component.get("v.Tid");
   //   helper.handleComponentEventFinaId(component,event,helper);
   //   helper.handleComponentEvent(component,event,helper);
        if(txnId!=null){    
     		 helper.fetchTransactionList(component,event,helper);  
        }
        var action = component.get("c.getFinanaceAccountName");
        action.setParams({
            AccountId: txnId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.name",response.getReturnValue());
               
            }
               
        });
           
           $A.enqueueAction(action);
  
    },
    
    
     onClickEditTransaction:function(component, event, helper){
        
        var clnt = component.get("v.recordId")
        var getId = event.getSource().get("v.value");
        console.log('getName'+getId);
        component.set("v.TxnEditId",getId);
        component.set("v.isEditTransaction",true);
        
         
    },
    onClickDeleteTransaction:function(component, event, helper){
        
        var clnt = component.get("v.recordId")
        var getId = event.getSource().get("v.value");
        console.log('getName'+getId);
        var action=component.get("c.DeleteFinanceAccountTransaction");
        action.setParams({
            FinanceAccountTxnId: getId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
    		helper.fetchTransactionList(component,event,helper); 
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
    addNewTransaction:function(component, event, helper){
      // var txnId component.get("v.Tid");
         component.set("v.isAddNewTransaction",true);
         
    },
    hideExampleModal:function(component, event, helper){
         component.set("v.isAddNewTransaction",false);
        component.set("v.isEditTransaction",false);
    },
    saveAndCloseBtn : function(component, event, helper) {
        // Display a "toast" status message
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "title": "Save Success!",
            type: 'success',
            "message": "Transaction Has been Saved"           
        });
        resultsToast.fire();   
        component.set("v.isAddNewTransaction",false);
        
        helper.fetchTransactionList(component,event,helper); 
    },
     handleSubmit : function(component, event, helper)
    { 
        debugger;
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
    },
    onSubmit:function(component, event, helper) { 
        
    },
    summary:function(component, event, helper) { 
        debugger;
      $A.get('e.force:refreshView').fire();  
    },
})
({
    fetchTransactionList:function(component, event, helper){
        
        var limit = component.get("v.initialRows");
        console.log('ir'+limit);
       // var FAccountID=component.get('v.Tid');
         
        var action = component.get("c.getTotalRecords");
        
        action.setParams({
            AccountId: component.get('v.Tid'),
            rowOffset : 0,
            rowLimit :  limit
        });
        action.setCallback(this,function(response){
            var state = response.getState();
            
            if(state == "SUCCESS"){
                
                var accountlist = response.getReturnValue();
                if(accountlist.FinancialAccountList.length >0){
                    component.set("v.showDatatable",true);
                    console.log('accountlist'+accountlist.FinancialAccountList);
                    component.set("v.totalRows",accountlist.FinancialAccountTotalRecords);   
                    console.log('total rows'+component.get("v.totalRows"));
                    component.set("v.data",accountlist.FinancialAccountList);
                }else{
                    component.set("v.showDatatable",false);
                    console.log('accountlist'+accountlist.FinancialAccountList);
                    component.set("v.totalRows",accountlist.FinancialAccountTotalRecords);   
                    console.log('total rows'+component.get("v.totalRows"));
                    component.set("v.data",accountlist.FinancialAccountList);
                }
                
                
            }
        });
        
        var action3 = component.get("c.getFinanaceAccountOpenDate");
        action3.setParams({
            AccountId: component.get('v.Tid')
        });
        action3.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
              //  var tdate=component.get("v.todayDate");
                var date=response.getReturnValue();
             /*   if(date[0].FinServ__OpenDate__c!=null){
                    
                     var today = new Date(date[0].FinServ__OpenDate__c);
                     var datestart = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+(today.getDate()+1);
                    component.set("v.OpenDate",datestart);
                    console.log(component.get("v.OpenDate")+"Kishu")
                    
                }else{
                    component.set("v.OpenDate",tdate);
                }*/
                if(date!=null){
                    var today = new Date(date);
                     var datestart = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+(today.getDate()+1);
                    component.set("v.OpenDate",datestart);
                }
                
                
            }
            
        });
      //  alert("OpenDate"+component.get("v.OpenDate"));
        $A.enqueueAction(action);   
        $A.enqueueAction(action3);
    },
    showAlertEmptyInvalidVal : function(component,msg)
    {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "error",
            "title": "Error!",
            "message": msg
        });
        toastEvent.fire();
        
    },
            
    loadData : function(component){
        
        return new Promise($A.getCallback(function(resolve){
            var limit = component.get("v.initialRows");
            var offset = component.get("v.currentCount");
            var totalRows = component.get("v.totalRows");
            console.log('Total rows in load data',totalRows);
            if(limit + offset > totalRows){
                limit = totalRows - offset;
            }
            
            var action = component.get("c.getTotalRecords");
            action.setParams({
                AccountId: component.get('v.Tid'),
                rowOffset : offset,
                rowLimit :  limit
            });
            action.setCallback(this,function(response){
                var state = response.getState();
                var newData = response.getReturnValue().FinancialAccountList;
                console.log('new data in load Data Method'+newData);
                
                resolve(newData);
                var currentCount = component.get("v.currentCount");
                currentCount += component.get("v.initialRows");
                // set the current count with number of records loaded 
                component.set("v.currentCount",currentCount);
            });
            $A.enqueueAction(action);
        }));
    },
    
    onClickDeleteTransaction:function(component, event, helper){
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

},
    kk : function(component,event,helper){

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
({
    doInit : function(component, event, helper) {
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
        
        $A.util.addClass(spinner, "slds-show");
        var opts = [
            { value: "", label: "None" },
            { value: "Auto and Transportation", label: "Auto and Transportation" },
            { value: "Bills and Utilities", label: "Bills and Utilities" },
            { value: "Bussiness Expense", label: "Bussiness Expense" },
            { value: "Business Services", label: "Business Services" },
            { value: "Education", label: "Education" },
            { value: "Entertainment", label: "Entertainment" },
            { value: "Fees and Charges", label: "Fees and Charges" },
            { value: "Fee and Dining", label: "Fee and Dining" },
            { value: "Gifts and Donations", label: "Gifts and Donations" },
            { value: "Home", label: "Home" },
            { value: "Insurance", label: "Insurance" },
            { value: "Investment Expense", label: "Investment Expense" },
            { value: "Miscellaneous", label: "Miscellaneous" },
            { value: "Personal Care", label: "Personal Care" },
            { value: "Kids", label: "Kids" },
            { value: "Business", label: "Business" },
            { value: "Travel", label: "Travel" },
            { value: "Pets", label: "Pets" },
            { value: "Finance", label: "Finance" },
            { value: "Taxes", label: "Taxes" }
            
        ];
        component.set("v.options1",opts);
        var action=component.get("c.getExpense");
        action.setParams({ recordId : component.get("v.recordId") });
        
        // Create a callback that is executed after 
        // the server-side action returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            // alert(state)
            if (state === "SUCCESS") {
                
                // alert("From server: " + JSON.stringify(response.getReturnValue()));
                console.log(JSON.stringify(response.getReturnValue()))
                if(response.getReturnValue().length==0){
                    //alert(component.get("v.LastKey"))
                    helper.createIncome(component)
                    // component.find("skipNextButton").set("v.label",'Skip')
                    component.set("v.disabled",false)
                    
                }
                else{
                    component.set("v.ExpenseList",response.getReturnValue())
                    //  component.find("skipNextButton").set("v.label",'Next')
                    component.set("v.disabled",true)
                    
                    
                }
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                
                /* for(var e in component.get("v.ExpenseList")){
                    alert(e.index)
                }*/  
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
        
        // optionally set storable, abortable, background flag here
        
        // A client-side action could cause multiple events, 
        // which could trigger other events and 
        // other server-side action calls.
        // $A.enqueueAction adds the server-side action to the queue.
        $A.enqueueAction(action);
    },
    addExpense: function(component,event,helper){
        helper.createIncome(component, component.get("v.LastKey"))
        
        
    },
    saveExpenses:function(component,event,helper){
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
        
        $A.util.addClass(spinner, "slds-show");
        var expenses=new Array();
                component.set("v.disabled",true);

        var data=component.get("v.ExpenseList")
        
        
        /* console.log(data[e]["expense"]["Start_Date__c"])
            if(new Date(data[e]["expense"]["Start_Date__c"])>new Date(data[e]["expense"]["End_Date__c"])){
                console.log(e)
                var name='row_'+e+'_edate';
                var fields=component.find("enddate")
                console.log(fields.length)
                for(var i=0;i< fields.length;i++){
                    
                    if(fields[i].get("v.name")===name){
                        fields[i].set("v.validity",{valid:false, badInput :true});
                        fields[i].showHelpMessageIfInvalid();
                        
                    }
                }
            }
        }*/
        component.set("v.ExpenseList",data)
        console.log('expenseList',JSON.stringify(component.get("v.ExpenseList")))
        console.log(JSON.stringify(data))
        let isAllValid = component.find('fields').reduce(function(isValidSoFar, inputCmp){
            //display the error messages
            console.log("abc")
            inputCmp.showHelpMessageIfInvalid();
            //check if the validity condition are met or not.
            return isValidSoFar && inputCmp.checkValidity();
        },true);
        
        /* if(data.length>1){
            isAllValid = component.find('enddate').reduce(function(isValidSoFar, inputCmp){
                //display the error messages
                console.log("abc")
                inputCmp.showHelpMessageIfInvalid();
                //check if the validity condition are met or not.
                return isValidSoFar && inputCmp.checkValidity();
            },true);
        }
        else{
            var enddate=component.find('enddate');
            
            isAllValid =enddate.get("v.validity").valid
            
            //display the error messages
            console.log(isAllValid)
            enddate.showHelpMessageIfInvalid();
            enddate.setCustomValidity('My error message') ;
            //  console.log(enddate.get("v.validity").valid)
            enddate.reportValidity();
            
            
        }*/
        // var indices=[];
        for (var e in data ){
            console.log('a')
            if(data[e]["expense"]["Does_contribution_bring_tax_benifit__c"]){
                data[e]["showSection"]=true;
                var tax=component.find("taxbenefit")
                //  var taxbenefit=tax.get("v.value")
                if(tax.length>1)  {
                    for(var i=0;i<tax.length;i++){
                        var taxbenefitname=tax[i].get("v.name")
                        
                        if(taxbenefitname.includes(e.toString())){
                            
                            //  tax.setCustomValidity("Complete this field")
                            console.log(e)
                            isTaxBenefitValid=tax[i].get("v.validity").valid;
                            if(!isTaxBenefitValid){
                                isAllValid=isTaxBenefitValid
                                tax[i].showHelpMessageIfInvalid();
                            }
                            
                            
                        }
                    }
                }
                else{
                     isTaxBenefitValid=tax.get("v.validity").valid;
                            if(!isTaxBenefitValid){
                                isAllValid=isTaxBenefitValid
                                tax.showHelpMessageIfInvalid();
                            }
                }
            }
        }
        
        
        component.set("v.ExpenseList",data)
        
        var isDateValid=helper.validateDate(component)
        if(!isDateValid){
            isAllValid=isDateValid
        }
          for (var e in data ){
                //data[e]["disabled"]=true;
                //console.log(data[e]["disabled"]) 
                console.log('dataa',JSON.stringify(data[e]["expense"]))
                expenses.push(data[e]["expense"]);
                
            }
            console.log('expenseList',JSON.stringify(component.get("v.ExpenseList")))
            console.log(JSON.stringify(data))
            //component.set("v.ExpenseList",data)
        /*isAllValid = component.find('taxbenefit').reduce(function(isValidSoFar, inputCmp){
            //display the error messages
            console.log("abc")
            inputCmp.showHelpMessageIfInvalid();
            //check if the validity condition are met or not.
            return isValidSoFar && inputCmp.checkValidity();
        },true);*/
        
        /*if(data.length>1){
            isAllValid = component.find('taxbenefit').reduce(function(isValidSoFar, inputCmp){
                //display the error messages
                console.log("abc")
                inputCmp.showHelpMessageIfInvalid();
                //check if the validity condition are met or not.
                return isValidSoFar && inputCmp.checkValidity();
            },true);
        }
        else{
             var tax=component.find("taxbenefit")
             var taxbenefit=tax.get("v.value")
            if(!($A.util.isUndefinedOrNull(taxbenefit) && taxbenefit=="")){
                    tax.setCustomValidity("Complete this field")
                    isAllValid=false;
                    tax.reportValidity();
                }
                else{
                    tax.setCustomValidity("")
                    tax.reportValidity();  
                }
                
                
            
           /* var taxbenefit=component.find('taxbenefit');
            
            isAllValid =enddate.get("v.taxbenefit").valid
            
            //display the error messages
            console.log(isAllValid)
            enddate.showHelpMessageIfInvalid();
            enddate.setCustomValidity('My error message') ;
            //  console.log(enddate.get("v.validity").valid)
            enddate.reportValidity();
            
            
        }*/
        console.log(isAllValid)
        
        console.log('valid',isAllValid)
        if(isAllValid){
         
            var action=component.get("c.saveExpense");
            action.setParams({ expenses : JSON.stringify(expenses)
                             });
            
            // Create a callback that is executed after 
            // the server-side action returns
            action.setCallback(this, function(response) {
                
                var state = response.getState();
                alert(state)
                if (state === "SUCCESS") {
                     
                    component.set("v.ExpenseList",response.getReturnValue())
                     $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
                    
                }
                else if (state === "INCOMPLETE") {
                    // do something
                }
                    else if (state === "ERROR") {
                         component.set("v.disabled",false)
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
        else{
                    component.set("v.disabled",true);

            $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
        }
        console.log(expenses)
        console.log('expenses',JSON.stringify(expenses))
    },
    backButton:function(component,event,helper){
        if(!component.get("v.disabled")){
            
        }
        component.set("v.currentStep","4");
    },
    skipButton: function(component,event,helper){
        var Id=component.get("v.recordId");
        
        var navService = component.find("navService");
        // Sets the route to /lightning/o/Account/home
        var pageReference = {
            type: 'standard__recordPage',
            attributes: {
                "recordId": Id,
                "objectApiName": "Account",
                "actionName": "view"
            }
        };
        navService.navigate(pageReference);
    },
    
    handleCancel: function(component,event,helper){
        var isDelete=confirm("You will lose all the saved data. Do you want to continue?")
        if(isDelete){
            var workspaceAPI = component.find("workspace");
            workspaceAPI.getFocusedTabInfo().then(function(response) {
                var focusedTabId = response.tabId;
                workspaceAPI.closeTab({tabId: focusedTabId});
            })
            .catch(function(error) {
                console.log(error);
            });
            var action=component.get("c.deleteRecords");
            action.setParams({ recordId : component.get("v.recordId") });
            console.log('deleted')
            // Create a callback that is executed after 
            // the server-side action returns
            action.setCallback(this, function(response) {
                
                console.log(response)
                var state = response.getState();
                console.log(state)
                
                // alert(state)
                if (state === "SUCCESS") {
                    
                    // alert("From server: " + JSON.stringify(response.getReturnValue()))
                    
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
            // A client-side action could cause multiple events, 
            // which could trigger other events and 
            // other server-side action calls.
            // $A.enqueueAction adds the server-side action to the queue.
            $A.enqueueAction(action);
        }   
    },
    deleteRow:function(component,event,helper){
        if(confirm("Do you want to delete this record?"))
            console.log(event.getSource().get("v.value"));
        var value=event.getSource().get("v.value");
        console.log('index',value)
        var expenses=component.get("v.ExpenseList")
        //var index=record.index;
        //console.log(index)
        var Id=expenses[value]["expense"]["Id"];
        console.log(Id)
        console.log(expenses[value]["expense"]["Name"])
        var action=component.get("c.deleteExpense");
        action.setParams({ recordId : Id });
        
        // Create a callback that is executed after 
        // the server-side action returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log(state)
            if (state === "SUCCESS") {
                //alert("success")
                /* var i;
                for ( i = 0; i < expenses.length; i++) {
                    if (expenses[i]["expense"]["Id"] === Id) {
                        
                        
                        break;            
                    }
                }*/
                expenses.splice(value,1);
                console.log(JSON.stringify(expenses))
                component.set("v.ExpenseList",expenses)
                if(expenses.length==0){
                    //    component.set("v.LastKey",0)
                    helper.createIncome(component)
                    
                    component.find("skipNextButton").set("v.label",'Skip')
                    
                }
                
                console.log(JSON.stringify(component.get("v.ExpenseList")))
                // alert("From server: " + JSON.stringify(response.getReturnValue()));
                
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
        
        //expenses.splice(i,1)
        /* var i;
        for(i=0;i<expenses.length;i++){
            
            if(expenses[i]["index"]==value){
                if(expenses[i]["expense"]["Id"]!=null){
                    alert(expenses[i]["expense"]["Id"])
                    var Id=expenses[i]["expense"]["Id"]
                    var action=component.get("c.deleteExpense");
                    action.setParams({ recordId : Id });
                    
                    // Create a callback that is executed after 
                    // the server-side action returns
                    action.setCallback(this, function(response) {
                        var state = response.getState();
                        console.log(state)
                        if (state === "SUCCESS") {
                            alert("success")
                          
                            // alert("From server: " + JSON.stringify(response.getReturnValue()));
                            
                        }
                        
                        /* for(var e in component.get("v.ExpenseList")){
                    alert(e.index)
                }*/  
        
        /* else if (state === "INCOMPLETE") {
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
                    
                    
                }
                   expenses.splice(i,1)
                            console.log(i)
            }
              
        }*/
        
        
        
        
    },
    editRow:function(component,event,helper){
        console.log(event.getSource().get("v.value"));
        var value=event.getSource().get("v.value");
        var expenses=component.get("v.ExpenseList")
        expenses[value]["disabled"]=false;
        /* for(var i=0;i<expenses.length;i++){
            
            if(expenses[i]["index"]==value){
                expenses[i]["disabled"]=false;
            }
            
        }*/
        component.set("v.disabled",false)
        
        component.set("v.ExpenseList",expenses)
    },
    taxBenefitSection:function(component,event,helper){
        var value=event.getSource().get("v.value");
        //  alert(event.getSource().getLocalId())
        var checked=event.getSource().get("v.checked");
        var expenses=component.get("v.ExpenseList")
        if(checked){
            expenses[value]["showSection"]=true;
            expenses[value]["expense"]["What_of_contribution_bring_tax_benifit__c"]=""
            expenses[value]["expense"]["May_yearly_tax_deduction_allowed__c"]=""
            expenses[value]["expense"]["Does_tax_benifit_realize_really__c"]=true
            
            
        }
        else{
            expenses[value]["expense"]["What_of_contribution_bring_tax_benifit__c"]=""
            expenses[value]["expense"]["May_yearly_tax_deduction_allowed__c"]=""
            expenses[value]["expense"]["Does_tax_benifit_realize_really__c"]=false
            expenses[value]["showSection"]=false;
            
        }
        /* if(checked){
            for(var i=0;i<expenses.length;i++){
                
                if(expenses[i]["index"]==value){
                    expenses[i]["showSection"]=true;
                }
                
            }
        }
        else{
            for(var i=0;i<expenses.length;i++){
                
                if(expenses[i]["index"]==value){
                    expenses[i]["expense"]["Does_tax_benifit_realize_really__c"]=true;
                    
                    expenses[i]["showSection"]=false;
                }
                
            }
        }*/
        
        component.set("v.ExpenseList",expenses)
        console.log(JSON.stringify(expenses))
        
    },
    sectionButton:function(component,event,helper){
        var value=event.getSource().get("v.value")
        // alert(value)
        var expenses=component.get("v.ExpenseList")
        var  showSection=expenses[value]["showSection"]
        expenses[value]["showSection"]=!showSection;
        /* for(var i=0;i<expenses.length;i++){
            
            if(expenses[i]["index"]==value){
                var  showSection=expenses[i]["showSection"]
                expenses[i]["showSection"]=!showSection;
            }
            
        }*/
        component.set("v.ExpenseList",expenses)
        
    },
    onblur:function(component,event,helper){
        helper.validateDate(component)
    }
    
    
})
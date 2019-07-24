({
    doInit : function(component, event, helper) {
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
        
        $A.util.addClass(spinner, "slds-show");
        var action=component.get("c.getincome");
        action.setParams({ recordId : component.get("v.recordId") });
        
        // Create a callback that is executed after 
        // the server-side action returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                // alert("From server: " + JSON.stringify(response.getReturnValue()));
                if(response.getReturnValue().length==0){
                    //component.set("v.LastKey", 0)
                    //alert(component.get("v.LastKey"))
                    helper.createIncome(component)
                    component.find("skipNextButton").set("v.label",'Skip')
                    component.set("v.disabled",false)
                    
                }
                else{
                    component.set("v.IncomeList",response.getReturnValue())
                    // component.set("v.LastKey", response.getReturnValue().length)
                    component.find("skipNextButton").set("v.label",'Next')
                    component.set("v.disabled",true)
                    
                    
                }
                 $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                /* for(var e in component.get("v.IncomeList")){
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
    addIncome: function(component,event,helper){
        helper.createIncome(component)
        
        
    },
    saveIncomes:function(component,event,helper){
        
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
        
        $A.util.addClass(spinner, "slds-show");
        component.set("v.disabled",true);
        var incomes=new Array();
        var data=component.get("v.IncomeList")
        
        //var value=component.find('fields1').get("v.value")
        //alert(value)
        let isAllValid = component.find('fields').reduce(function(isValidSoFar, inputCmp){
            //display the error messages
            inputCmp.showHelpMessageIfInvalid();
            //check if the validity condition are met or not.
            return isValidSoFar && inputCmp.checkValidity();
        },true);
       var isDateValid=helper.validateDate(component)
       if(!isDateValid){
           isAllValid=isDateValid
       }
        console.log(isAllValid)
        
        //   allValid.set("v.errors", [{message:"Input not a number: "}]);
        
        //  alert(component.find("fields"))
        /* var fields=component.find("fields")
        console.log(fields.length)
        for(var i=0;i<fields.length;i++){
            var name=fields[i].get("v.name")
            console.log('before if',i + name)
            if ( $A.util.isUndefinedOrNull(name) || name=="" || !name.includes('date') || name==undefined) {
                
                console.log("in loop");
                console.log(name)
                fields.splice(i, 1); 
            }
            else{
                console.log("in else")
                console.log(name)
            }
        }
        for(var i=0;i<fields.length;i++){
            var name=fields[i].get("v.name")
            //  console.log(name)
            
            }
        console.log(fields.length)
        //alert(fields[0].get("v.name"))
        //  alert(fields[4].get("v.name"))
        // console.log(JSON.stringify(fields))
        // console.log(fields.length)
        var startDate;
        var endDate;
        
        /* for(var i=0;i< fields.length;i++){
            if(!($A.util.isUndefinedOrNull(name) || name=="")){
                if(name.includes("date")){
                    //console.log(name)
                    //console.log(fields[i])
                    if(name.includes("startdate")){
                        startDate=fields[i].get("v.value")
                    }
                    if(name.includes)
                        fields[i].setCustomValidity	("Input not a number: ");
                    fields[i].reportValidity();
                    
                    // console.log(fields[i].get("v.name"))
                }
                
            }
        }
        */
        /*   var index=[];
        
        if(isendDateValid){
            console.log('abc')
            for (var e in data ){
                var startdate=data[e]["income"]["Start_Date__c"]
                var edate=data[e]["income"]["End_Date__c"]
                console.log(startdate)
                if($A.util.isUndefinedOrNull(startdate) || startdate==""){
                    
                    var dt=new Date();
                    var date= dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
                    // date.format("yyyy/mm/dd");
                    console.log(date)
                    
                    data[e]["income"]["Start_Date__c"]=date;
                    
                    if(dt>new Date(edate)){
                        console.log('e')
                        index.push(e);
                        isAllValid=false;
                        isendDateValid=false;
                    }
                }
                else{
                    if(new Date(startdate)> new Date(edate)){
                        index.push(e);
                        isAllValid=false;
                        isendDateValid=false;
                    }
                }
                
            }
        }
        else{
            isAllValid=false;
            
            component.set("v.disabled",false)
        }*/
        //component.set("v.IncomeList",data)
       // console.log('incomeList',JSON.stringify(component.get("v.IncomeList")))
        //console.log(JSON.stringify(data))
        /*  if(!isendDateValid){
            console.log("a")
            console.log(index)
            for(var i=0; i<enddate.length;i++){
                for(var j=0;j<index.length;j++){
                    console.log(enddate[i].get("v.name"))
                    if(enddate[i].get("v.name").includes(index[j])){
                        console.log("a")
                        
                        enddate[i].setCustomValidity("abc")
                        enddate[i].reportValidity();
                    }
                    else{
                        enddate[i].setCustomValidity("")
                        
                    }
                    enddate[i].reportValidity();
                    
                }
            }
        }*/
        if(isAllValid){
            
            console.log('incomeList',JSON.stringify(component.get("v.IncomeList")))
            console.log(JSON.stringify(data))
            for (var e in data ){
                
                //data[e]["disabled"]=true;
               // console.log(data[e]["disabled"]) 
                console.log('dataa',JSON.stringify(data[e]["income"]))
                incomes.push(data[e]["income"]);
                
                }
            console.log('incomeList',JSON.stringify(component.get("v.IncomeList")))
            console.log(JSON.stringify(data))
            //component.set("v.IncomeList",data)
            var action=component.get("c.saveIncome");
            action.setParams({ incomes : JSON.stringify(incomes)
                             });
            
            // Create a callback that is executed after 
            // the server-side action returns
            action.setCallback(this, function(response) {
                
                var state = response.getState();
                alert(state)
                if (state === "SUCCESS") {
                    console.log(response.getReturnValue())
                    component.set("v.IncomeList",response.getReturnValue())
                     $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
                   // component.set("v.LastKey", response.getReturnValue().length)
                    
                }
                else if (state === "INCOMPLETE") {
                    // do something
                }
                    else if (state === "ERROR") {
                                    component.set("v.disabled",false)

                        var errors = response.getError();
                        if (errors) {
                             component.set("v.disabled",false)
              $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
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
            
            console.log(incomes)
            console.log('incomes',JSON.stringify(incomes))
        }
        else{
            component.set("v.disabled",false)
              $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
            
        }
    },
    backButton:function(component,event,helper){
        component.set("v.currentStep","3");
    },
    skipButton: function(component,event,helper){
        component.set("v.currentStep","5")
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
            
            // Create a callback that is executed after 
            // the server-side action returns
            action.setCallback(this, function(response) {
                var state = response.getState();
                console.log(state)
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
        if(confirm("Do you want to delete this record?")){
            console.log(event.getSource().get("v.value"));
            var value=event.getSource().get("v.value");
            var incomes=component.get("v.IncomeList")
            
            // alert(incomes[value]["income"]["Id"])
            var Id=incomes[value]["income"]["Id"]
            var action=component.get("c.hello");
            action.setParams({ recordId : Id });
            
            // Create a callback that is executed after 
            // the server-side action returns
            action.setCallback(this, function(response) {
                var state = response.getState();
                console.log(state)
                if (state === "SUCCESS") {
                    //  alert("success")
                    // alert("From server: " + JSON.stringify(response.getReturnValue()));
                    
                }
                
                /* for(var e in component.get("v.IncomeList")){
                    alert(e.index)
                }*/  
                
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
            
            
            
            incomes.splice(value,1)
            console.log(value)
            
            
            component.set("v.IncomeList",incomes)
            if(incomes.length==0){
                // component.set("v.LastKey",0)
                helper.createIncome(component)
                
                component.find("skipNextButton").set("v.label",'Skip')
                
            }
            console.log(component.get("v.IncomeList"))
        }
        
    },
    editRow:function(component,event,helper){
        console.log(event.getSource().get("v.value"));
        var value=event.getSource().get("v.value");
        var incomes=component.get("v.IncomeList")
        console.log(JSON.stringify(incomes[value]))
        incomes[value]["disabled"]=false
        /* for(var i=0;i<incomes.length;i++){
            
            if(incomes[i]["index"]==value){
                incomes[i]["disabled"]=false;
            }
            
        }*/
        component.set("v.disabled",false)
        component.set("v.IncomeList",incomes)
    },
    onblur:function(component,event,helper){
        helper.validateDate(component)
    }
    
    
})
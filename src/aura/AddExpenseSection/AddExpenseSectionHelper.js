({
    createExpense : function(component) {
        component.set("v.disabled",false)
        
        
        var primaryOwner=component.get("v.recordId")
        var recordTypeId=component.get("v.recordTypeId")
        var action=component.get("c.addExpense");
        action.setParams({ recordId : primaryOwner });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log(state)
            if (state === "SUCCESS") {
                // var incomeList=component.get("v.IncomeList");
                
                var a=response.getReturnValue();
                
                
                var expenseList=component.get("v.ExpenseList");
                
                expenseList.push(a);
                component.set("v.ExpenseList", expenseList);
                console.log(JSON.stringify(expenseList))
                
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
        $A.enqueueAction(action);
        
        // var data=component.get("v.ExpenseList")
        
        //var a= {"disabled":false,"expense":{"Id":null,"Primary_Owner__c":primaryOwner,"Name":"None","RecordTypeId":recordTypeId,"Yearly_growth__c":"","End_Date__c":"","Start_Date__c":"","Amount__c":"","Does_contribution_bring_tax_benifit__c":false,"Does_tax_benifit_realize_really__c":true,"May_yearly_tax_deduction_allowed__c":"","What_of_contribution_bring_tax_benifit__c":"","Priority__c":"None"},"showSection":false};
        // 
        
    },

    handleShowToast : function(component, event, helper) {
        component.find('notifLib').showToast({
            "title": "Error!",
            "variant":"error",
            "mode":"dismissable",
            "message": "The record has been updated successfully."
        });
    },
    
    showValidationMessage:function(component){
        var data=component.get("v.ExpenseList")
        
        for (var e in data ){
            console.log('a')
            if(data[e]["expense"]["Does_contribution_bring_tax_benifit__c"]){
                console.log('b')
                data[e]["showSection"]=true;
            }
        }
        component.set("v.ExpenseList",data)
        
    },
    validateDate: function(component){
        var data=component.get("v.ExpenseList")
        
        var isAllValid=true;
        var enddate=component.find('enddate');
        console.log(enddate)
        // var startdate=component.find('startdate');
        if(enddate.length>0){
            isAllValid = enddate.reduce(function(isValidSoFar, inputCmp){
                //display the error messages
                // console.log("abc")
                inputCmp.showHelpMessageIfInvalid();
                //check if the validity condition are met or not.
                return isValidSoFar && inputCmp.checkValidity();
            },true);
        }
        else{
            
            isAllValid =enddate.get("v.validity").valid
            
            //display the error messages
            console.log(isAllValid)
            enddate.showHelpMessageIfInvalid();
            //  enddate.setCustomValidity('My error message') ;
            //  console.log(enddate.get("v.validity").valid)
            // enddate.reportValidity();
            
            
        }
        for (var e in data ){
            var startdate=data[e]["expense"]["startDate"]
            console.log(startdate)
            if($A.util.isUndefinedOrNull(startdate) || startdate==""){
                
                var dt=new Date();
                var date= dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
                // date.format("yyyy/mm/dd");
                console.log(date)
                
                data[e]["expense"]["startDate"]=date;
            }
        }
        component.set("v.ExpenseList",data)
        
        var startdate=component.find('startdate');
        
        
        if(enddate.length>0){
            for(var i=0;i<enddate.length;i++){
                var edate=enddate[i].get("v.value")
                var edateName=enddate[i].get("v.name")
                console.log(edateName)
                if(!($A.util.isUndefinedOrNull(edate) && edate=="")){
                    for(var j=0;j<startdate.length;j++){
                        var sdate=startdate[i].get("v.value")
                        var sdateName=startdate[i].get("v.name")
                        console.log(sdateName)
                        var edateIndex=edateName.split("_")[1]
                        console.log('index', edateIndex)
                        var sdateIndex=sdateName.split("_")[1]
                        console.log('index',sdateIndex)
                        if(edateIndex==sdateIndex){
                            if(new Date(sdate)>new Date(edate)){
                                enddate[i].setCustomValidity("End date cannot be less than start date")
                                isAllValid=false
                            }
                            else{
                                enddate[i].setCustomValidity("")
                            }
                            enddate[i].reportValidity();
                            
                        }
                    }
                }
            }
        }
        else{
            var edate=enddate.get("v.value")
            if(!($A.util.isUndefinedOrNull(edate) && edate=="")){
                if(new Date(startdate.get("v.value"))>new Date(edate)){
                    enddate.setCustomValidity("End date cannot be less than start date")
                    isAllValid=false;
                    enddate.reportValidity();
                }
                else{
                    enddate.setCustomValidity("")
                    enddate.reportValidity();  
                }
                
                
            }
        }
        return isAllValid;
        
        
    },
   showNotfication : function(component,msg,type,title){
        //console.log("inhelper");
        try{
            // component.set("v.errors", [{message:"Invalid field: " }]);
            component.find('notifLib').showToast({
                "title": title,
                "variant":type,
                "message": msg,
                "mode":"dismissable"
            });
            
        }catch(e){
            console.log(e.message)
        } 
    }, 
    
})
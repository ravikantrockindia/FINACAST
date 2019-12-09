({
    
    doInit : function(component , event , helper){
        var namespace = component.get("v.namespace");
        var clientId=component.find("owner").get("v.value");
        var clientId=component.get("v.client");
        component.find("Id_spinner").set("v.class" , 'slds-show');
        
        component.find("owner").set("v.value",clientId);
        var getName = component.get("v.FinServ__PrimaryOwner__r.Name");
        
        if(!($A.util.isUndefinedOrNull(clientId) || clientId == "")){
            var action = component.get("c.dample");
            action.setParams({
                clientId : clientId
            });
            
            action.setCallback(this, function(a) {
                var state  = a.getState();
                var goals=a.getReturnValue();
                component.set("v.accountList",goals);
                component.find("Id_spinner").set("v.class" , 'slds-hide');
                
            }); 
            $A.enqueueAction(action); 
            
        }
    },
    onload:function(component,event,helper){
        var goalId = component.get("v.goalId");
        
        if(!($A.util.isUndefinedOrNull(goalId) || goalId == ""))
        {
            var namespace = component.get("v.namespace");
            var recUi = event.getParam("recordUi");
            //component.set("v.currentBal", recUi.record.fields[namespace+"Start_Value__c"].value)
            component.set("v.actualEmi",recUi.record.fields[namespace+"Required_Monthly_Saving__c"].value)
            var selectedAccount=component.get("v.selectedAccount");
            console.log(selectedAccount);
            if($A.util.isUndefinedOrNull(selectedAccount)||selectedAccount=="" ||selectedAccount=="None"){
                component.set("v.selectedAccount",recUi.record.fields[namespace+"Associated_Account__c"].value);
            }
            console.log(component.get("v.selectedAccount"));
            var targetValue= component.find("amount").get("v.value");
            if($A.util.isUndefinedOrNull(targetValue)||targetValue=="")
                component.find("amount").set("v.value",recUi.record.fields["FinServ__TargetValue__c"].value)
                var currentBal= component.get("v.currentBal");
            if($A.util.isUndefinedOrNull(currentBal)||currentBal=="")
                component.set("v.currentBal",recUi.record.fields[namespace+"Start_Value__c"].value)
                }
    },
    
    getCurrentAmt : function(component, event, helper)
    {	
        
        
        var associated=component.get("v.selectedAccount");
        
        if($A.util.isUndefinedOrNull(associated)||associated==""){
            
            component.find("strtvalue").set("v.fieldName",namespace+"Start_Value__c");
            component.find("strtvalue").set("v.value",null);
            
            return;
        }
        var action = component.get("c.getCurrentAmount");
        action.setParams
        ({
            "goalId":component.get("v.goalId"),
            "accId": associated,
            
        });
        
        action.setCallback(this, function(response) {
            
            component.find("strtvalue").set("v.value",response.getReturnValue());
            
            
            component.set("v.actualbalance", response.getReturnValue());
            
            
        });
        
        $A.enqueueAction(action);     
        
    },  
    
    cancelButton : function(component, event, helper) {
        
        helper.hideExampleModal(component);
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
    
    getChangeMonthlyConti : function(component, event, helper)
    {
        
        var msg  = "";
        var status1 = 1;
        var status2 = 1;
        var status3 = 1;
        
        var current=component.find("strtvalue").get("v.value");
        console.log(current);
        
        var target=component.find("amount").get("v.value");
        
        var tDate = component.find("tarDate").get("v.value");
        var associated = component.find("associateAcc").get("v.value");
        
        if(component.find("tarDate").get("v.value") <= component.get("v.newTarDate"))
        {
            component.set("v.buttonDisplay",false);
            component.set('v.setMsg','You will reach your goal on time');  
        }
        if(target != null && target <= 0)
        {
            console.log(target); status1 = 0;
            
        }
        else
        {
            status1 = 1;
        }
        var d = new Date();
        if(tDate != null && tDate.split("-")[0] <= d.getFullYear() || ( tDate != null && tDate.split("-")[0] == d.getFullYear() && tDate.split("-")[2] <= d.getMonth()))
        {
            status2 = 0;
            msg = "The planning date cannot be of current year or previous years.";
            helper.currentAmtError(component, event, helper, msg);   
        }
        else
        {
            status2 = 1 ;
        }
        console.log(component.get("v.actualbalance"));
        if((current > component.get("v.actualbalance") || current < 0) && component.get("v.actualbalance")!=null ) 
        {   
            status3 = 0;
            msg = "Invalid Current Amount";
            var namespace = component.get("v.namespace");
            // component.set("v.currentBal", component.get("v.actualbalance"));
            // component.find("strtvalue").set("v.fieldName",namespace+"Required_Monthly_Saving__c");
            component.find("strtvalue").set("v.value",component.get("v.actualbalance"));
            helper.currentAmtError(component, event, helper, msg);
            event.preventDefault();
            
        }
        else
        {
            status3 = 1;
        } 
        
        console.log(status1, status2, status3)
        if(status1 == 1 && status2 == 1 && status3 == 1 ) 
        {
            if(target == current || current == null)     
                // if(target == current || current == 0 || current == null)        
            {
                component.set("v.contribution" ,0);    
            } 
            else
            {
                var action = component.get("c.getMonthlyContri"); 
                action.setParams
                ({
                    "accId": associated,
                    "currAmt":current,
                    "target" : tDate,
                    "tAmt" : target
                });
                action.setCallback(this, function(response) {  
                    console.log(response.getReturnValue());
                    component.set("v.contribution", response.getReturnValue());
                    component.set("v.actualEmi",response.getReturnValue());
                });
                $A.enqueueAction(action); 
            }
        }
        else
        {
            component.set("v.contribution", 0);
        }   
        
    },
    onSuccessCall:function(component,event,helper){
        
        
        var updatedRecord = JSON.parse(JSON.stringify(event.getParams()));
        console.log(updatedRecord);
        console.log('onsuccess: ', JSON.stringify(updatedRecord.response.id));
        var retId=updatedRecord.response.id;
        component.set("v.viewGoalId",retId);
        // var icon=$A.get("$Resource.RetirementIcon");
        // component.set("v.icon",icon);
        //helper.hideExampleModal(component);
        
        // component.set("v.isActive",false);
        // component.set("v.createModal1",false);
        if(!component.get("v.editModal")){
            var cmpTarget = component.find('exampleModal');
            
            console.log('the cross is : '+ cmpTarget );
            $A.util.addClass(cmpTarget, 'hideDiv');
            component.set("v.createModal",true);
        }
        else{
            helper.hideExampleModal(component);
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
        }
        //	helper.hideExampleModal(component);
        
    },
    
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
    },
    
    handleSubmit : function(component, event, helper)
    { 
        var status1 = 0;
        var status2 = 0;
        var status3 = 0;
        debugger;
        var msg = "";
        var n = component.find("owner").get("v.value");
        console.log('hey1:-'+n)
        var priowner = component.get("v.client");
        console.log('hey2:-'+priowner)
        //console.log('hey1:-'+n)
        var priowner = component.get("v.client");
        //console.log('hey2:-'+priowner)
        var targetAmt = component.find("amount").get("v.value");
        console.log('hey3:-'+targetAmt)
        var targetDate = component.find("tarDate").get("v.value");
        //console.log('hey4:-'+targetDate)
        var bankAcc = component.find("associateAcc").get("v.value");
        //console.log('hey5:-'+bankAcc)
        var currAmt = component.find("strtvalue").get("v.value");
        //console.log('hey6:-'+currAmt)
        var goalPriority = component.find("priority").get("v.value");
        // console.log('hey7:-'+goalPriority)
        var contribution =  component.find("priority").get("v.value");
        //console.log('hey8:-'+contribution)
        
        //console.log('the data is :' + priowner , n,targetAmt,targetDate,bankAcc,currAmt,goalPriority , contribution);
        if ($A.util.isUndefinedOrNull(n) || n == "" ||  
            $A.util.isUndefinedOrNull(targetAmt) || targetAmt == "" || $A.util.isUndefinedOrNull(targetDate) || targetDate =="" || 
            $A.util.isUndefinedOrNull(bankAcc) || bankAcc == "" || 
            $A.util.isUndefinedOrNull(currAmt) || currAmt === "" ||
            (($A.util.isUndefinedOrNull(currAmt) || currAmt == "") /*&& currAmt != 0*/) ||
            $A.util.isUndefinedOrNull(goalPriority) || goalPriority =="" || $A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(contribution) || contribution == ""){
            status3 = 0;
            event.preventDefault();
            msg = "Please fill mandatory fields."
             helper.showAlertEmptyInvalidVal(component,msg);       
        }
        else{
            status3 = 1;
        }
        
        if( $A.util.isUndefinedOrNull(n) != true && $A.util.isUndefinedOrNull(targetAmt) != true && $A.util.isUndefinedOrNull(targetDate) != true && $A.util.isUndefinedOrNull(bankAcc) != true && $A.util.isUndefinedOrNull(currAmt) != true && $A.util.isUndefinedOrNull(goalPriority) != true && $A.util.isUndefinedOrNull(contribution) != true){
            if(n.length > 80 ){
                event.preventDefault();
                status1 = 0;
                msg = "•Name cannot be greater than 80 characters\n";    
            }
            else{
                status1 = 1;
            }
            
            if(targetAmt.length > 8 || targetAmt < 0 ){
                event.preventDefault();
                status2 = 0;
                msg = msg +"• How much do you want to save cannot be negative or exceed 8 digits\n"
                
            }
            else{
                status2 = 1;
            }
            helper.showAlertEmptyInvalidVal(component,msg);
            
        }
        
        if(status1 == 0 || status2 == 0 || status3 == 0)
        {
            event.preventDefault();
            return;
        }
        event.preventDefault();
        var namespace = component.get("v.namespace");
        var eventFields = event.getParam("fields");
        console.log("event",eventFields["FinServ__TargetValue__c"]);
        eventFields["FinServ__TargetValue__c"] = component.find("amount").get("v.value");
        console.log("event",eventFields["FinServ__TargetValue__c"]);
        eventFields[namespace+"Associated_Account__c"]=component.get("v.selectedAccount");
        console.log("event",eventFields[namespace+"Associated_Account__c"])
        component.find("non-retirement").submit(eventFields);
        var cmpTarget = component.find('exampleModal'); 
        
    },
    
    handleChangeMonthlyContribution : function(component, event, helper)
    {
        var msg = "Invalid Monthly Contribution";
        var status = 1;
        if(event.getSource().get("v.value") < 0 || event.getSource().get("v.value")=="")
        {
            helper.currentAmtError(component, event, helper,msg);
            component.set("v.contribution", 0 );
        }
       

        if(event.getSource().get("v.value") < component.get("v.actualEmi") )
        {
            if(event.getSource().get("v.value") ==  0 || event.getSource().get("v.value") == "") {
                component.set("v.buttonDisplay",false);
            }
            else {
                component.set("v.buttonDisplay",true);
                var targetDate = component.find("tarDate").get("v.value");  
                var targetAmount= component.find("amount").get("v.value");
                var current = component.find("strtvalue").get("v.value");
                var installment = component.find("goalContri").get("v.value");
                var months = (targetAmount-current)/installment;
                var getYear = months/12;
                var today = new Date();
                var newYear = today.getFullYear()+getYear;
                var newDate = Math.floor(newYear)+"-"+(targetDate.split("-"))[1]+"-"+(targetDate.split("-"))[2];
                component.set("v.newTarDate", newDate);
            }
        }
        if(event.getSource().get("v.value") >= component.get("v.actualEmi") )
        { 
            component.set("v.buttonDisplay",false);
            component.set('v.setMsg','You will reach your goal on time');
        } 
    },
    handleMonthlyContribution : function(component, event, helper)
    {   var namespace = component.get("v.namespace");
     component.find("goalContri").set("v.fieldName",namespace+"Required_Monthly_Saving__c");
     component.find("goalContri").set("v.value",  component.get("v.actualEmi"));
             component.set('v.setMsg','You will reach your goal on time');  

                 component.set("v.buttonDisplay",false);

    },
    
    handleTargetDate : function(component, event, helper)
    {
        component.set("v.tarDate",component.get("v.newTarDate"));
        component.set("v.buttonDisplay",false);
        component.set('v.setMsg','You will reach your goal on time');  
    },
    handleError : function(component, event, helper){
        console.log('In Error'); 
        console.log(event.getParams('error').errorCode);
        console.log(event.getParams('error').message);
    },
    
    changeEntity1 : function(component , event , helper){
        console.log('handle change');
        var clientId=component.get("v.client.Id");
        console.log('id'+clientId);
        
        
        if(!($A.util.isUndefinedOrNull(clientId) || clientId == ""))
        {
            
            
            console.log("the value is name" + clientId);
            var action = component.get("c.dample");
            action.setParams({
                clientId : clientId
            });
            
            action.setCallback(this, function(response) {
                var goals = response.getReturnValue();
                
                console.log('kk'+goals);
                component.set("v.accountList",goals);
            }); 
            $A.enqueueAction(action); 
            
        }
    } 
})

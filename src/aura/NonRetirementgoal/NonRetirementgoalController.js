({
    changeEntity : function(component, event, helper) {
       
        var action = component.get("c.dample"); 
        // method name i.e. getEntity should be same as defined in apex class
        // params name i.e. entityType should be same as defined in getEntity method
         var clientId=component.find("owner").get("v.value");
        console.log(clientId);
        action.setParams({
            clientId : clientId
        });
        action.setCallback(this, function(a){
            var state = a.getState(); // get the response state
            console.log(state);
            if(state == 'SUCCESS') {
                
                component.set('v.accountList', a.getReturnValue());
            }
            console.log(component.get('v.accountList'));
        });
        $A.enqueueAction(action);
    },
    doInit : function(component , event , helper){
        /*console.log("inside non retirement");
        component.set("v.goalId","a0G46000003zKyuEAE");
        component.set("v.wedding","01246000000Rki5AAC");*/
       // debugger;
       // 
       
        var clientId=component.get("v.client.Id");
        console.log('id'+clientId);
       component.find("owner").set("v.value",clientId);
        var getName = component.get("v.goalId");
        console.log(getName);
         if(!($A.util.isUndefinedOrNull(clientId) || clientId == ""))
        {
            

           console.log("the value is name" + clientId);
            var action = component.get("c.dample");
            action.setParams({
                clientId : clientId
            });
            /* console.log("the value is name" + getName);
            var action = component.get("c.getNonRetirementGoalRecord");
            action.setParams({
                goalsId : getName
            });*/
            action.setCallback(this, function(a) {
                var state  = a.getState();
                console.log('state',state);
                var goals=a.getReturnValue();
                console.log(goals);
                component.set("v.accountList",goals);
            }); 
            $A.enqueueAction(action); 
        /*if(!($A.util.isUndefinedOrNull(getName) || getName == ""))
        {
            

            console.log("the value is name" + getName);
            var action = component.get("c.getNonRetirementGoalRecord");
            action.setParams({
                goalsId : getName
            });
            action.setCallback(this, function(response) {
                var goals = response.getReturnValue();
                
                console.log("The goal records are:" + goals);
                console.log(goals.Associated_Account__c);
                 component.find("associateAcc").set("v.value", goals.Associated_Account__c);*/
              /* component.find("owner").set("v.value", goals.FinServ__PrimaryOwner__c);
                component.find("name").set("v.value", goals.Name);
                component.find("amount").set("v.value", goals.FinServ__TargetValue__c);
                component.find("tarDate").set("v.value", goals.FinServ__TargetDate__c);
                component.find("associateAcc").set("v.value", goals.Associated_Account__c);*/
               // component.set("v.currentBal", goals.Start_Value__c);
               /* component.find("priority").set("v.value", goals.Goal_Priority__c);
                component.find("goalContri").set("v.value", goals.Required_Monthly_Saving__c);*/
                
                // component.set("v.contribution",event.getSource().get("v.value"));
                // console.log("the contribution is : " + component.get("v.contribution"));
                
           /* }); 
            $A.enqueueAction(action);*/ 
        }
    },
    onload:function(component,event,helper){
      // debugger;
         var recUi = event.getParam("recordUi");
               component.set("v.currentBal", recUi.record.fields["Start_Value__c"].value)
          var selectedAccount=component.get("v.selectedAccount");
        console.log(selectedAccount);
        if($A.util.isUndefinedOrNull(selectedAccount)||selectedAccount=="" ||selectedAccount=="None"){
            		component.set("v.selectedAccount",recUi.record.fields["Associated_Account__c"].value);
            console.log(recUi.record.fields["Associated_Account__c"].value)
//component.find("associatedAcc").set("v.value",recUi.record.fields["Associated_Account__c"].value);
        }
        console.log(component.get("v.selectedAccount"));
        var targetValue= component.find("amount").get("v.value");
        if($A.util.isUndefinedOrNull(targetValue)||targetValue=="")
            component.find("amount").set("v.value",recUi.record.fields["FinServ__TargetValue__c"].value)
             var currentBal= component.get("v.currentBal");
        if($A.util.isUndefinedOrNull(currentBal)||currentBal=="")
            component.set("v.currentBal",recUi.record.fields["Start_Value__c"].value)
},
    
    getCurrentAmt : function(component, event, helper)
    {
        var currentAmt = component.find("strtvalue").get("v.value"); 
        
        var amt = component.find("amount").get("v.value"); 
        var tDate = component.find("tarDate").get("v.value"); 
       // var associated = component.find("associateAcc").get("v.value");
       var associated=component.get("v.selectedAccount");
        console.log(associated);
        if($A.util.isUndefinedOrNull(associated)||associated==""){
           // debugger;
            component.find("strtvalue").set("v.fieldName","Start_Value__c");
            component.find("strtvalue").set("v.value",null);
            console.log(component.find("strtvalue").get("v.value"));
            return;
        }
        var action = component.get("c.getCurrentAmount");
        action.setParams
        ({
            "accId": associated,
            "targetDate" : tDate,
            "targetAmt" : amt,
            "currentAmount" : currentAmt
        });
        
        action.setCallback(this, function(response) {
            console.log(response.getReturnValue());
            component.find("strtvalue").set("v.fieldName","Start_Value__c");
            component.find("strtvalue").set("v.value",response.getReturnValue().currentAmt);
            console.log(component.find("strtvalue").get("v.value"));
            component.set("v.currentBal", response.getReturnValue().currentAmt);
            console.log(component.find("strtvalue").get("v.value"));
            component.set("v.actualbalance", response.getReturnValue().currentAmt);
            component.set("v.contribution",response.getReturnValue().emi); 
            component.set("v.actualEmi",response.getReturnValue().emi);
            
        });
        
        $A.enqueueAction(action);     
        
    },  
    
    cancelButton : function(component, event, helper) {
        if(window.location.pathname.includes("Budget")){
            var cmpTarget = component.find('exampleModal');
            console.log('the cross is : '+ cmpTarget );
            $A.util.addClass(cmpTarget, 'hideDiv');
            component.set("v.isActive",false);
            var saveIncomeEvent = component.getEvent("saveIncomeEvent");
            saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
            // saveIncomeEvent.setParams("showModalIncome", false);
            saveIncomeEvent.fire();
        }
        else{
            var homeEvent = $A.get("e.force:navigateToObjectHome");
            homeEvent.setParams({
                "scope": "FinServ__FinancialGoal__c"
            });
            homeEvent.fire();
        }  
        
    },
    
    getChangeMonthlyConti : function(component, event, helper)
    {
       //debugger;
        var msg  = "";
        var status1 = 1;
        var status2 = 1;
        var status3 = 1;
        
        var current=component.find("strtvalue").get("v.value");
        console.log(current);
        //var current = component.get("v.currentBal"); 
       // var target = component.get("v.tarAmt"); 
       var target=component.find("amount").get("v.value");
        console.log('hh'+current);
        var tDate = component.find("tarDate").get("v.value");
        var associated = component.find("associateAcc").get("v.value");
        console.log(associated);
        if(component.find("tarDate").get("v.value") <= component.get("v.newTarDate"))
        {
            component.set("v.buttonDisplay",false);
            component.set('v.setMsg','You will reach your goal on time');  
        }
        if(target != null && target <= 0)
        {
           console.log(target); status1 = 0;
            //return;
           // msg = "Invalid Target Amount";
            //helper.currentAmtError(component, event, helper, msg);     
        }
        else
        {
            status1 = 1;
        }
        var d = new Date();
        if(tDate != null && tDate.split("-")[0] <= d.getFullYear() || ( tDate != null && tDate.split("-")[0] == d.getFullYear() && tDate.split("-")[2] <= d.getMonth()))
        {
            status2 = 0;
            msg = "Invalid Date. Target date cannot be less than current date. ";
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
            component.set("v.currentBal", component.get("v.actualbalance"));
            component.find("strtvalue").set("v.fieldName","Required_Monthly_Saving__c");
            component.find("strtvalue").set("v.value",component.get("v.actualbalance"));
            helper.currentAmtError(component, event, helper, msg);
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
                var action = component.get("c.getCurrentAmount"); 
                action.setParams
                ({
                    "accId": associated,
                    "targetDate" : tDate,
                    "targetAmt" : target,
                    "currentAmount" : current.toString()
                });
                action.setCallback(this, function(response) {  
                    console.log(response.getReturnValue().emi);
                    component.set("v.contribution", response.getReturnValue().emi);
                    component.set("v.actualEmi",response.getReturnValue().emi);
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
        
        if(window.location.pathname.includes("Budget")){
            var cmpTarget = component.find('exampleModal');
            console.log('the cross is : '+ cmpTarget );
            $A.util.addClass(cmpTarget, 'hideDiv');
            component.set("v.isActive",false);
            var saveIncomeEvent = component.getEvent("saveIncomeEvent");
            saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
            // saveIncomeEvent.setParams("showModalIncome", false);
            saveIncomeEvent.fire();
        }
        else
        {
            var record = event.getParam("response");
           
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
                "recordId": record.id
                
            });
            navEvt.fire();   
        }
        //helper.hideExampleModal(component);
    },
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
    },
    
    handleSubmit : function(component, event, helper)
    { 
        var status1 = 0;
        var status2 = 0;
        var status3 = 0;
        
        var msg = "";
       // var priowner = event.getParam('fields').FinServ__PrimaryOwner__c;
       // console.log(JSON.stringify(event.getParam('fields')));
      //  console.log(event.getParam('fields'));
      //  console.log(component.get("v.client.Id"));
        //var priowner = component.get("v.client.Id");
        var n = component.find("owner").get("v.value");
        console.log('hey1:-'+n)
        var priowner = component.get("v.client.Id");
        console.log('hey2:-'+priowner)
        var targetAmt = component.find("amount").get("v.value");
        console.log('hey3:-'+targetAmt)
        var targetDate = component.find("tarDate").get("v.value");
        console.log('hey4:-'+targetDate)
        var bankAcc = component.find("associateAcc").get("v.value");
        console.log('hey5:-'+bankAcc)
        var currAmt = component.find("strtvalue").get("v.value");
        console.log('hey6:-'+currAmt)
        var goalPriority = component.find("priority").get("v.value");
        console.log('hey7:-'+goalPriority)
        var contribution =  component.find("priority").get("v.value");
        console.log('hey8:-'+contribution)
        
        console.log('the data is :' + priowner , n,targetAmt,targetDate,bankAcc,currAmt,goalPriority , contribution);
        if ($A.util.isUndefinedOrNull(n) || n == "" ||  
            $A.util.isUndefinedOrNull(targetAmt) || targetAmt == "" || $A.util.isUndefinedOrNull(targetDate) || targetDate =="" || 
            $A.util.isUndefinedOrNull(bankAcc) || bankAcc == "" || 
            (($A.util.isUndefinedOrNull(currAmt) || currAmt == "") && currAmt != 0) ||
            $A.util.isUndefinedOrNull(goalPriority) || goalPriority =="" || $A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(contribution) || contribution == "")
        {
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
        }
              event.preventDefault();

  var eventFields = event.getParam("fields");
        console.log("event",eventFields["FinServ__TargetValue__c"]);
  eventFields["FinServ__TargetValue__c"] = component.find("amount").get("v.value");
        console.log("event",eventFields["FinServ__TargetValue__c"]);
        eventFields["Associated_Account__c"]=component.get("v.selectedAccount");
        console.log("event",eventFields["Associated_Account__c"])
        component.find("non-retirement").submit(eventFields);
        
        
 
    },
    
    handleChangeMonthlyContribution : function(component, event, helper)
    {
        var msg = "Invalid Monthly Contribution";
        var status = 1;
        if(event.getSource().get("v.value") < 0)
        {
            status = 0
            helper.currentAmtError(component, event, helper,msg);
            component.set("v.contribution", 0 );
        }
        else
        {
            status = 1;
        }
        if(event.getSource().get("v.value") < component.get("v.actualEmi") && status == 1 )
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
        if(event.getSource().get("v.value") >= component.get("v.actualEmi") && status == 1 )
        { 
            component.set("v.buttonDisplay",false);
            component.set('v.setMsg','You will reach your goal on time');
        } 
    },
    handleMonthlyContribution : function(component, event, helper)
    {
        component.find("goalContri").set("v.fieldName","Required_Monthly_Saving__c");
        component.find("goalContri").set("v.value",  component.get("v.actualEmi"));
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
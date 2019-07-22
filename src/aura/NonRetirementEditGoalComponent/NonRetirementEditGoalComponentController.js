({
    doinit : function(component , event , helper){
         /*console.log("inside non retirement");
        component.set("v.goalId","a0G46000003zKyuEAE");
        component.set("v.wedding","01246000000Rki5AAC");*/
        var getName = component.get("v.goalId");
        console.log("the value is " + getName);
        var action = component.get("c.getNonRetirementGoalRecord");
         action.setParams({
            goalsId : getName
        });
        action.setCallback(this, function(response) {
            var goals = response.getReturnValue();
            console.log("The goal records are:" + goals);
            component.find("owner").set("v.value", goals.FinServ__PrimaryOwner__c);
            component.find("name").set("v.value", goals.Name);
            component.find("amount").set("v.value", goals.FinServ__TargetValue__c);
            component.find("tarDate").set("v.value", goals.FinServ__TargetDate__c);
            component.find("associateAcc").set("v.value", goals.Associated_Account__c);
            component.find("strtvalue").set("v.value", goals.Start_Value__c);
            component.find("priority").set("v.value", goals.Goal_Priority__c);
            component.find("goalContri").set("v.value", goals.Required_Monthly_Saving__c);
            
           // component.set("v.contribution",event.getSource().get("v.value"));
           // console.log("the contribution is : " + component.get("v.contribution"));
            
        }); 
        $A.enqueueAction(action); 
    },
    
   getCurrentAmt : function(component, event, helper)
    {
        var currentAmt = component.find("strtvalue").get("v.value"); 
        var amt = component.find("amount").get("v.value"); 
        var tDate = component.find("tarDate").get("v.value"); 
        var associated = component.find("associateAcc").get("v.value"); 
        var action = component.get("c.getCurrentAmount");
        
        action.setParams
        ({
            "accId": associated,
            targetDate : tDate,
            targetAmt : amt,
            currentAmount : currentAmt
        });
        
        action.setCallback(this, function(response) {
            component.set("v.currentBal", response.getReturnValue().currentAmt);
            component.set("v.actualbalance", response.getReturnValue().currentAmt);
            component.set("v.contribution",response.getReturnValue().emi); 
            component.set("v.actualEmi",response.getReturnValue().emi);
            
        });
        
        $A.enqueueAction(action);     
        
    },  
    
    cancelButton : function(component, event, helper) {
if(window.location.pathname.includes("Budget"))
        {
         var cmpTarget = component.find('exampleModal');
        $A.util.addClass(cmpTarget, 'hideDiv');
        component.set("v.isActive",false);
		var saveIncomeEvent = component.getEvent("saveIncomeEvent");
        saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
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
        var msg  = "";
        var status1 = 1;
        var status2 = 1;
        var status3 = 1;
        
        var current = component.get("v.currentBal"); 
        console.log('the current balance is: ' +current);
        var target = component.get("v.tarAmt"); 
        var tDate = component.find("tarDate").get("v.value");
        var associated = component.find("associateAcc").get("v.value");
        
        if(component.find("tarDate").get("v.value") <= component.get("v.newTarDate"))
        {
            component.set("v.buttonDisplay",false);
            component.set('v.setMsg','You will reach your goal on time');  
        }
        if(target != null && target <= 0)
        {
            status1 = 0;
            msg = "Invalid Target Amount";
            helper.currentAmtError(component, event, helper, msg);     
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
        if(current > component.get("v.actualbalance") || current < 0) 
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
        
        if(status1 == 1 && status2 == 1 && status3 == 1 ) 
        {
            if(target == current || current == 0 || current == null)        
            {
                component.set("v.contribution" ,0);    
            } 
            else
            {
                var action = component.get("c.getCurrentAmount"); 
                action.setParams
                ({
                    "accId": associated,
                    targetDate : tDate,
                    targetAmt : target,
                    currentAmount : current.toString()
                });
                action.setCallback(this, function(response) {  
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
        var record = event.getParam("response");
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": record.id
            
        });
        navEvt.fire();   
        
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
        
        var priowner = component.find("owner").get("v.value");
      
        var n = component.find("name").get("v.value");
        var targetAmt = component.find("amount").get("v.value");
        var targetDate = component.find("tarDate").get("v.value");
        var bankAcc = component.find("associateAcc").get("v.value");
        var currAmt = component.find("strtvalue").get("v.value");
        var goalPriority = component.find("priority").get("v.value");
        var contribution = component.find("goalContri").get("v.value");
          console.log('priowner',priowner,'n',n,'targetAmt',targetAmt,'targetDate',targetDate,'bankAcc',bankAcc,'currAmt',currAmt,'goalPriority',goalPriority,'contribution',contribution);
        if($A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(n) || n == "" ||  $A.util.isUndefinedOrNull(targetAmt) || targetAmt == "" || $A.util.isUndefinedOrNull(targetDate) || targetDate =="" || $A.util.isUndefinedOrNull(bankAcc) || bankAcc == "" || $A.util.isUndefinedOrNull(currAmt) || currAmt == "" || $A.util.isUndefinedOrNull(goalPriority) || goalPriority =="" || $A.util.isUndefinedOrNull(contribution) || contribution == "")
        {
            status3 = 0;
            event.preventDefault();
            msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);       
        }
        else
        {
            status3 = 1;
        }
        
        if($A.util.isUndefinedOrNull(priowner) != true && $A.util.isUndefinedOrNull(n) != true && $A.util.isUndefinedOrNull(targetAmt) != true && $A.util.isUndefinedOrNull(targetDate) != true && $A.util.isUndefinedOrNull(bankAcc) != true && $A.util.isUndefinedOrNull(currAmt) != true && $A.util.isUndefinedOrNull(goalPriority) != true && $A.util.isUndefinedOrNull(contribution) != true)
        {
            if(n.length > 80 )
            {
                event.preventDefault();
                status1 = 0;
                msg = "•Name cannot be greater than 80 characters\n";    
            }
            else
            {
                status1 = 1;
            }
            
            if(targetAmt.length > 8 || targetAmt < 0 )
            {
                event.preventDefault();
                status2 = 0;
                msg = msg +"• How much do you want to save cannot be negative or exceed 8 digits\n"
                
            }
            else
            {
                status2 = 1;
            }
            
            
            helper.showAlertEmptyInvalidVal(component,msg);
            
        }
        
        if(status1 == 0 || status2 == 0 || status3 == 0)
        {
            event.preventDefault();
        }
        console.log("handle submit",status1, status2,status3);
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
    }
    
    
})
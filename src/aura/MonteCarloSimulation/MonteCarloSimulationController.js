({
    doInit :function(component, event, helper){  
        console.log("abc")
        console.log(component.get("v.childgid"))
        var action = component.get("c.getPicklistValues");
        
             
        
        action.setCallback(this, function(response){
            component.set("v.picklistValues", response.getReturnValue());
           console.log(JSON.stringify(response.getReturnValue()))
        });
        $A.enqueueAction(action); 
    },
    simulate : function(component, event, helper) {
         var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
                $A.util.addClass(spinner, "slds-show");

        var initialAmount = component.find("initialAmount").get("v.value");
        var annualSaving = component.find("annualSaving").get("v.value");
        var targetAmount = component.find("targetAmount").get("v.value");
        var volatility = component.find("volatility").get("v.value");
        var targetDate = component.find("targetDate").get("v.value");
        var riskProfile = component.find("riskProfile").get("v.value");
        console.log(riskProfile); 
        //var confidenceValues=[];
       // var map = new Map();
        
        console.log("Initial Amount: " + initialAmount);
        console.log(typeof(initialAmount));       
        console.log("target amount:" +targetAmount);
        console.log(typeof(targetAmount));        
                console.log(typeof(annualSaving));        
        console.log(typeof(volatility));        
        console.log(typeof(riskProfile));   
                console.log(typeof(targetDate));        
        console.log('data:',initialAmount,annualSaving,targetAmount,volatility,targetDate,riskProfile)

               var action = component.get("c.sample");
        action.setParams({
            goalinitialAmount : initialAmount,
            goaltargetAmount : targetAmount,
            goalMonthlySaving : annualSaving,
            goalTargetDate : targetDate,
            riskProfile : riskProfile,
            volatility : volatility
        });
        
        action.setCallback(this, function(response){
            var sdMap = response.getReturnValue();
            component.set("v.standardDeviationValueMap", sdMap);
            console.log("Returned Values: "+ JSON.stringify(sdMap));
              $A.util.removeClass(spinner, "slds-show");
                $A.util.addClass(spinner, "slds-hide");
        });
        $A.enqueueAction(action); 
    },
})
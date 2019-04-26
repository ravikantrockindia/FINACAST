({
    handleLoad : function(component,event, helper)
    {
        var birthDate = component.get("v.dob"); 
        var retirementYear = component.get("v.retirementAge");
        var income = component.get("v.retirementAnnualIncome");
        console.log("income",income);
        var inflation = component.get("v.inflationRate");
        console.log("inflation",inflation);
        var interest = component.get("v.roi");
        console.log("interest",interest);
        var after = component.get("v.yearsAfterRetirement");
        console.log("after",after);
        
        var action = component.get("c.getAmountMonth");
        action.setParams({
            desIncome : income,
            inflationRate : inflation.toString(),
            interestRate : interest.toString(), 
            yearsToLive : after.toString(), 
            retireAge : retirementYear.toString(),
            birth : birthDate
        });
        
        action.setCallback(this, function(response) {
            component.set("v.amtMonth",response.getReturnValue());
            console.log("value: ",response.getReturnValue());
        });
        $A.enqueueAction(action);
    },
    
    
    amtAndContri : function(component, event, helper)
    {
        var associated = component.find("associateAcc").get("v.value");
        var years = component.get("v.amtMonth.yearsTillRetirement");
        var target = component.find("amount").get("v.value");
        var interestRate = component.get("v.roi");
        var retDate = component.get("v.tarDate");
        var curAmt = component.find("currVal").get("v.value");
        console.log("interest",interestRate);
        console.log("associated",associated);
        console.log("years",years);
        console.log("target",target);
        var action = component.get("c.getAmtAndContri");  
        action.setParams
        ({
            "accId" : associated[0],
            tillRetirement : years.toString(),
            interest : interestRate.toString(),
            targetAmt : target.toString(),
            retireDate : retDate.toString(),
            current :  curAmt
        });
        action.setCallback(this, function(response) {
            component.set("v.currAndContri", response.getReturnValue());
            component.set("v.contribution", response.getReturnValue().monthlyContri);
            component.set("v.initialAmount", response.getReturnValue().currentAmt);
            component.set("v.initialEmi", response.getReturnValue().monthlyContri);
            console.log("response: ",response.getReturnValue());      
        });
        $A.enqueueAction(action);
        
    },
    
    getChangeMonthlyConti : function(component, event, helper)
    {
        var status = 1;
        var msg = "Invalid Current Amount";
        var curAmt = component.find("currVal").get("v.value");
        
        console.log(typeof curAmt);
        console.log(typeof target);
        
        if(curAmt > component.get("v.initialAmount") ||curAmt < 0)
        {
            status = 0
            helper.currentAmtError(component, event, helper,msg);
            component.set("v.contribution", 0 );
            
        }
        
        if(curAmt == target || curAmt > target || curAmt == 0 || status == 0)
        {
            component.set("v.contribution",0);
            
        }
        
        else
        {
            var associated = component.find("associateAcc").get("v.value");
            var years = component.get("v.amtMonth.yearsTillRetirement");
            var target = component.find("amount").get("v.value");
            var interestRate = component.get("v.roi");
            var retDate = component.get("v.tarDate");
            
            var action = component.get("c.getAmtAndContri");  
            action.setParams
            ({
                "accId" : associated[0],
                tillRetirement : years.toString(),
                interest : interestRate.toString(),
                targetAmt : target.toString(),
                retireDate : retDate.toString(),
                current :  curAmt.toString()
            });
            
            action.setCallback(this, function(response) {
                console.log(response.getReturnValue());
                component.set("v.contribution",response.getReturnValue().monthlyContri);
                component.set("v.initialEmi", response.getReturnValue().monthlyContri);
                
            });
            
            $A.enqueueAction(action);   
        }
    },
    
    backButton : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef  : "c:RetirementGoal",
            componentAttributes: {
                PrimaryOwner : component.get("v.owner"),
                GoalName : component.get("v.name"),
                birthDate : component.get("v.dob"),
                YearsLivingAfterRetirement : component.get("v.yearsAfterRetirement"),
                ExpectedInflationRate : component.get("v.inflationRate"),
                Retiring :component.get("v.retirementAge"),
                DesiredAnnualIncome :component.get("v.retirementAnnualIncome"),
                RateofReturnAfterRetirement :component.get("v.roi"),
                household : component.get("v.household")                
            }
        });
        
        evt.fire();    
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
    
    
    
    saveButton : function(component, event, helper) {
        var own = component.get("v.owner");
        console.log("own", own, typeof own);
        
        var n = component.get("v.name");
        console.log("name", n, typeof n);
        
        var birth = component.get("v.dob");
        console.log("birth", birth, typeof birth);
        
        var retire = component.get("v.yearsAfterRetirement");
        console.log("retire", retire, typeof retire);
        
        var rate = component.get("v.inflationRate");
        console.log("rate", rate, typeof rate);
        
        var rAge = component.get("v.retirementAge");
        console.log("rAge", rAge, typeof rAge);
        
        var retireIncome = component.get("v.retirementAnnualIncome");
        console.log("retireIncome", retireIncome, typeof retireIncome);
        
        var rateInterest = component.get("v.roi");
        console.log("rateInterest", rateInterest, typeof rateInterest);
        
        var amt = component.find("amount").get("v.value");
        console.log("amt", amt, typeof amt);
        
        var acc = component.find("associateAcc").get("v.value");
        console.log("acc", acc, typeof acc);
        
        var pri = component.find("priority").get("v.value");
        console.log("pri", pri, typeof pri);
        
        var contri = component.find("goalContri").get("v.value");
        console.log("contri", contri, typeof contri);
        
        var start = component.find("currVal").get("v.value");
        console.log("start", start, typeof start);
        
        var tar = component.find("rDate").get("v.value");
        console.log("tar", tar, typeof tar);
        
        var msg = "Please fill mandatory fields"
        if ($A.util.isUndefinedOrNull(acc) || acc == "" || $A.util.isUndefinedOrNull(amt) || amt == "" || 
            ((start == "" || $A.util.isUndefinedOrNull(start)) && start != 0)|| $A.util.isUndefinedOrNull(contri) || contri == "" || $A.util.isUndefinedOrNull(pri) || pri == "")
        {
            
            helper.currentAmtError(component, event, helper,msg);
            
        }
        
        else
        {
            var action = component.get("c.saveData");
            action.setParams
            ({ 
                owner : own[0],
                name : n,
                dob : birth,
                years : retire.toString(),
                inflationRate : rate,
                retireAge : rAge.toString(),
                income : retireIncome,
                returnRate : rateInterest,
                amount : amt.toString(),
                associatedAccount : acc[0],
                priority : pri.toString(),
                sValue : start.toString(),
                tDate : tar.toString(),
                contribution : contri.toString()
                
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                console.log('state',state);
                if (state == "SUCCESS") {
                    component.set("v.saveStatus",true);
                    var resp = response.getReturnValue();
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": resp
                        
                    });
                    navEvt.fire();
                }
                
                else if (state == "Error") {
                    var homeEvent = $A.get("e.force:navigateToObjectHome");
                    homeEvent.setParams({
                        "scope": "FinServ__FinancialGoal__c"
                    });
                    homeEvent.fire(); 
                    helper.successToast();
                }
            } );
            $A.enqueueAction(action);   
        }
    },
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
    },
    
    changeMonthlyContribution : function(component, event, helper)
    {
        
        var msg = "Invalid Monthly Contribution";
        var status = 1;
        if(event.getSource().get("v.value") < 0)
        {
            status = 0
            helper.currentAmtError(component, event, helper,msg);
            component.set("v.contribution", 0 );
        }
        if(event.getSource().get("v.value") < component.get("v.initialEmi") && status == 1 )
        {
            
            component.set("v.buttonDisplay",true);
            console.log("button status",component.get("v.buttonDisplay"));
            
            var retireDate = component.find("rDate").get("v.value");
            
            var target = component.find("amount").get("v.value");
            console.log("target ",target);
            var current = component.find("currVal").get("v.value");
            console.log("current ",current);
            var installment = component.find("goalContri").get("v.value");
            console.log("installment ",installment);
            
            var months = (target-current)/installment;
            console.log("months: ",months);
            var getYear = months/12;
            console.log("newYear ",getYear);
            var today = new Date();
            var newYear = today.getFullYear()+getYear;
            console.log("today.getFullYear()", today.getFullYear());
            console.log("newYear: ", newYear);
            
            
            var newDate = Math.floor(newYear)+"-"+(retireDate.split("-"))[1]+"-01";
            console.log("newDate: ",newDate);
            component.set("v.newTarDate", newDate);
        }
        if(event.getSource().get("v.value") ==  0 || event.getSource().get("v.value") == "") {
            component.set("v.buttonDisplay",false);
        }
            if(event.getSource().get("v.value") >= component.get("v.initialEmi") && status == 1 )
            {
                component.set("v.buttonDisplay",false);
                component.set('v.setMsg','You will reach your goal on time');
            }
        
    },
    
    handleMonthlyContribution : function(component, event, helper)
    { 
        component.find("goalContri").set("v.fieldName","Required_Monthly_Saving__c");
        component.find("goalContri").set("v.value", component.get("v.initialEmi"));
    },
    
    handleRetirementDate : function(component, event, helper)
    {
        
        component.set("v.tarDate",component.get("v.newTarDate"));
        component.set("v.buttonDisplay",false);
        component.set('v.setMsg','You will reach your goal on time');
        
    }
})
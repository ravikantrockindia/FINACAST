({
    doInit : function(component, event, helper) {
       
        
        var action = component.get("c.dample"); 
        var clientId=component.get("v.owner");
        console.log('ssDD'+clientId);
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
        var recUi = event.getParam("recordUi");
        console.log(recUi);        
        var selectedAccount=recUi.record.fields["Associated_Account__c"].value;
        console.log('hhh'+selectedAccount);
        
        var taxDeduction=recUi.record.fields["Does_the_contribution_bring_tax_benefit__c"].value;
        console.log("associated account",recUi.record.fields["Associated_Account__c"].value);
        console.log("current amount",recUi.record.fields["Start_Value__c"].value);
        console.log(taxDeduction)
        var selAcc=component.get("v.selectedAccount")
        if(selAcc==null ||selAcc==""){
            component.set("v.selectedAccount",selectedAccount);
        }
        if (taxDeduction){
            component.set("v.isTaxDeduction",true);
            component.set("v.getYes",true);
        }
        else{
            component.set("v.getNo",true);
            
        }
        var ismonthly=recUi.record.fields["Do_tax_benefits_realize_monthly__c"].value;
        console.log(ismonthly)
        if (ismonthly){
            component.set("v.isMonthly",true);
        }
        else{
            component.set("v.isMonthly",false);
            
        }
        
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
        console.log(associated[0]);
        action.setParams
        ({
            "accId" : associated,
            tillRetirement : years.toString(),
            interest : interestRate.toString(),
            targetAmt : target.toString(),
            retireDate : retDate.toString(),
            current :  curAmt
        });
        action.setCallback(this, function(response) {
            
            component.find("currVal").set("v.value", response.getReturnValue().currentAmt);
            component.find("goalContri").set("v.value", response.getReturnValue().monthlyContri);
            
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
                "accId" : associated,
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
                household : component.get("v.household"), 
                retirementGoalId:component.get("v.recordId")
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
    
    nextButton:function(component,event,helper){
        
    },
    
    
    saveButton : function(component, event, helper) {
        var recordId=component.get("v.recordId");
        console.log("record Id", recordId);
        var own = component.get("v.owner");
        console.log("own", own[0], typeof own);
        
        
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
        
        var isTaxDeduction=component.get("v.isTaxDeduction");
        console.log("isTaxDeduction",isTaxDeduction, typeof isTaxDeduction);
        var taxcontri=0;
        var maxdeduction=0;
        var ismonthly=true;
        if(isTaxDeduction){
            var ele = component.find("taxcontri")
            taxcontri = ele.get("v.value");
            console.log("taxcontri",taxcontri,typeof taxcontri);
            var maxDeduction=component.find("maxdeduction").get("v.value");
            console.log("maxdeduction",maxDeduction)
            
            var ismonthly=component.get("v.isMonthly")
            }
        
        
        
        
        var msg = "Please fill mandatory fields"
        if ($A.util.isUndefinedOrNull(acc) || acc == "" || $A.util.isUndefinedOrNull(amt) || amt == "" || 
            ((start == "" || $A.util.isUndefinedOrNull(start)) && start != 0)|| $A.util.isUndefinedOrNull(contri) || contri == "" || $A.util.isUndefinedOrNull(pri) || pri == "" ||((isTaxDeduction) && ($A.util.isUndefinedOrNull(taxcontri) || taxcontri=="")) )
        {
            
            helper.currentAmtError(component, event, helper,msg);
            
        }
        
        else
        {
            var action = component.get("c.saveData");
            action.setParams
            ({ 
                recordId:recordId,
                owner : own,
                name : n,
                dob : birth,
                years : retire.toString(),
                inflationRate : rate,
                retireAge : rAge.toString(),
                income : retireIncome,
                returnRate : rateInterest,
                amount : amt.toString(),
                associatedAccount : acc,
                priority : pri.toString(),
                sValue : start.toString(),
                tDate : tar.toString(),
                contribution : contri.toString(),
                isTaxDeduction: isTaxDeduction.toString(),
                taxPercentageContribution: taxcontri.toString(),
                maxDeduction:maxDeduction,
                isMonthly: ismonthly.toString()
                
                
                
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                console.log('state',state);
                if (state == "SUCCESS") {
                    component.set("v.saveStatus",true);
                    var resp = response.getReturnValue();
                    helper.hideExampleModal(component);
                     var homeEvent = $A.get("e.force:navigateToComponent");
            homeEvent.setParams({
                componentDef : "c:Goalfinal",
                componentAttributes: {
                   cid : component.get("v.cid")
        }
                
            }); 
            homeEvent.fire();
                    
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
        
    },
    handleRadio: function(component, event) {
        // component.set("v.displaySection" ,  true);
        
        console.log('handle')
        if(event.target.id=="yesCheck"){
            component.set("v.isTaxDeduction",true);
            
        }
        else if(event.target.id=="noCheck"){
            component.set("v.isTaxDeduction",false);
        }
    },
    handleIsMonthly: function(component, event){
        
        if(event.target.id=="yesMonthly"){
            
            component.set("v.isMonthly",true);
            
        }
        else if(event.target.id=="noMonthly"){
            
            component.set("v.isMonthly",false);
        }
    },
})
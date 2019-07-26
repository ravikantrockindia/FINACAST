({
    Acclist : function(component, event, helper) {
        
        var action = component.get("c.dample"); 
        var clientId=component.find("owner").get("v.value");
        console.log('ssDD'+clientId);
        action.setParams({
            clientId : clientId
        });
        action.setCallback(this, function(a){
            var state = a.getState();
            // get the response state
            console.log(state);
            if(state == 'SUCCESS') {
                
                component.set('v.Acclist', a.getReturnValue());
            }
            console.log(component.get('v.Acclist'));
        });
        $A.enqueueAction(action);
        
    },
    
    doInit : function(component,event,helper)
    {
        var clientId=component.find("owner").get("v.value");
        var clientId=component.get("v.client");
        console.log('id'+clientId);
        component.find("owner").set("v.value",clientId);
        var getName = component.get("v.FinServ__PrimaryOwner__r.Name");
        component.set("v.isMonthly",false);
        var gId = component.get("v.retirementGoalId");
        console.log("dgd");
       if(!($A.util.isUndefinedOrNull(clientId) || clientId == ""))
        {
         console.log("the value is name" + clientId);
            var action = component.get("c.dample");
            var associated = component.find("associateAcc").get("v.value");
        console.log('saanjfnjnjnj'+associated);
            action.setParams({
                clientId : clientId
              });
            
            action.setCallback(this, function(a) {
                var state  = a.getState();
                console.log('state',state);
                var goals=a.getReturnValue();
                console.log(goals);
                component.set("v.accountList",goals);
            }); 
            $A.enqueueAction(action); 
             }
			
        if(!($A.util.isUndefinedOrNull(gId) || gId == ""))
        {
            var action = component.get("c.getGoalData");
            action.setParams({
                goalId : component.get("v.retirementGoalId")
            });

        
         action.setCallback(this, function(a) {
                var state  = a.getState();
                console.log('state',state);
                var goals=a.getReturnValue();
             
            }); 
            $A.enqueueAction(action); 

        }
    
        var action = component.get("c.getDate");
        action.setParams({ 
            clientId : clientId
        });
        action.setCallback(this, function(response) {
            component.set("v.birthDate",response.getReturnValue());
            console.log('birthdate',component.get("v.birthDate"));
            console.log('resp: ',response.getReturnValue());
        });
        $A.enqueueAction(action); 
        },
    
    
    
    
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
    },
    
    showExampleModal : function(component, event, helper) {
        helper.showExampleModal(component);
    },
    
     nextButton : function(component, event, helper) {
        
        var status1 = 0;
        var status2 = 0;
        var status3 = 0;
        var status4 = 0;
        var status5 = 0;
        var status6 = 0;
        var status7 = 0;
        var status8 = 0;
        var status9 = 0;
        var priowner = component.find("owner").get("v.value");
        var n = component.find("name").get("v.value");
        console.log("name",n);
        var dateofbirth = component.find("birth").get("v.value");
        console.log("birth",dateofbirth);
        var afterRetire = component.find("afterRetirement").get("v.value");
        console.log("after retirement", afterRetire);
        var iRate = component.find("Rate").get("v.value");
        var rAge = component.find("retireAge").get("v.value");
        console.log("retire age",rAge);
        var retireincome = component.find("annualIncome").get("v.value");
        console.log("retirement income",retireincome)
        var rateofreturn = component.find("rateReturn").get("v.value");
        console.log("rate of return",rateofreturn);
        var msg = "";
        console.log("irate", iRate);
        console.log("rateofreturn",rateofreturn);
        console.log("status1",status1);
        console.log("status2",status2);
        if($A.util.isUndefinedOrNull(n) != true && $A.util.isUndefinedOrNull(afterRetire) != true && $A.util.isUndefinedOrNull(iRate) != true && $A.util.isUndefinedOrNull(rAge) != true && $A.util.isUndefinedOrNull(retireincome) != true && $A.util.isUndefinedOrNull(rateofreturn) != true)
        {
            if(n.length > 80 )
            {
                status1 = 0;
                msg = "•Name cannot be greater than 80 characters\n";    
            }
            else
            {
                status1 = 1;
            }
            
            if(afterRetire.length > 2 || afterRetire < 0 )
            {
                status2 = 0;
                msg = msg +"•years of living after retirement cannot exceed 2 digits or negative\n"
                
            }
            else
            {
                status2 = 1;
            }
            
             var roiSplit = rateofreturn.split(".");
            var iRateSplit = iRate.split(".");
            console.log("iRateSplit.length",iRateSplit.length);
            if(iRateSplit.length == 1 )
            {
                if(iRateSplit[0].length > 2 || iRateSplit[0] < 0 )
                    
                {
                    status3 = 0;
                    msg = msg + "•Inflation rate cannot be of more than 2 digits before decimal or negative\n";
                }
                else
                {
                    status3 = 1;
                }
            }
            else
            {
                status3 = 1;
            }
            
            
            if(iRateSplit.length == 2 )
            {
                if(iRateSplit[0].length > 2 || iRateSplit[0] < 0 || iRateSplit[1].length > 2 )
                    
                {
                    status4 = 0;
                    msg = msg + "•Inflation rate cannot be of more than 2 digits before and after decimal or negative\n";
                }
                else
                {
                    status4 = 1;
                }
            }
            
            
            
            
            if(rAge.length > 2 || rAge < 0)
            {
                status5 = 0;
                msg = msg + "•Retirement Age cannot exceed 2 digits or negative\n";
            }
            else
            {
                status5 = 1;
            }
            
            
            
            if(retireincome.length > 8 || retireincome < 0)
            {
                status6 = 0;
                msg = msg + "•Retirement Income cannot exceed 8 digits or negative\n";
            }
            else
            {
                status6 = 1;
            }
            
           
            
            if(roiSplit.length == 1)
            {
                if(roiSplit[0].length > 2 || roiSplit[0] < 0)
                { 
                    console.log("status 7 inside if",status7);
                    status7 = 0;
                    
                    msg = msg + "•Rate of return cannot exceed 2 digits before decimal or negative\n";
                }
                else
                {
                    console.log("status7", status7);
                    status7 = 1;
                }
            }
            
            
            if(roiSplit.length == 2)
            {
                if(roiSplit[0].length > 2 || roiSplit[0] < 0 || roiSplit[1].length > 2 )
                {
                    status8 = 0;
                    
                    msg = msg + "•Rate of return cannot exceed 2 digits before and after decimal or negative\n";
                }
                else
                {
                    status8 = 1;
                }
            }
            else
            {
                status8 = 1;
            }
            
            
           
        }
        
            
        if($A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(n) || n == "" ||  $A.util.isUndefinedOrNull(dateofbirth) || dateofbirth == "" || $A.util.isUndefinedOrNull(afterRetire) || afterRetire == "" || $A.util.isUndefinedOrNull(iRate) || iRate == "" || $A.util.isUndefinedOrNull(rAge) || rAge == "" || $A.util.isUndefinedOrNull(retireincome) || retireincome == "" || $A.util.isUndefinedOrNull(rateofreturn) || rateofreturn == "" )
        {
            status9 = 0;
            
            
        }
        else
        {
            status9 = 1;
        }
       
        if($A.util.isUndefinedOrNull(priowner) || priowner == "" ){
            console.log("null value present owner")
        }
        
        
        console.log(status1,status2,status3,status4,status5,status6,status7,status8,status9);
        if(status1 == 1 && status2 == 1 && status3 == 1 && status4 == 1 && status5 == 1 && status6 == 1 && status7 == 1 && status8 == 1 && status9 == 1)
        {
             var getDate = [];
            var birthDate = component.find("birth").get("v.value");
            getDate = birthDate.split("-");
            console.log('getdate'+getDate);
            console.log('birthDate'+birthDate);
            var retirementYear = component.find("retireAge").get("v.value");
            console
            var getYear = Number(getDate[0]);
             console.log('getYear'+getYear);
            var acclist = component.get("v.Acclist");
            var rYear = Number(getDate[0])+Number(retirementYear);
            console.log('rYear'+rYear);
            getDate[1]=getDate[1].length==1?"0"+getDate[1]:getDate[1];        
            var d = rYear+"-"+getDate[1]+"-01";
            console.log('dddd'+d);
              component.find("rDate").set("v.value",d);
            var today = new Date();
            console.log('today'+today);
            var recordId=component.get("v.retirementGoalId");
            console.log("acclist", acclist)
            if(rYear == (today.getFullYear()))
            {
                helper.showAlertEqualDate();
            }
            
            if(rYear < (today.getFullYear()))
            {
                helper.showAlertLessDate();
            }
            
           
            if(rYear > (today.getFullYear()))
            
            {
                
            
                
        var birthDate =component.find("birth").get("v.value");
        var retirementYear = component.find("retireAge").get("v.value");
        var income = component.find("annualIncome").get("v.value");
        console.log("income",income);
        var inflation = component.find("Rate").get("v.value");
        console.log("inflation",inflation);
        var interest = component.find("rateReturn").get("v.value");
        console.log("interest",interest);
        var after = component.find("afterRetirement").get("v.value");
        console.log("after",after); 
                
        
        var action = component.get("c.getAmountMonth");
        action.setParams({
            desIncome : income,
            inflationRate : inflation,
            interestRate : interest, 
            yearsToLive : after, 
            retireAge : retirementYear,
            birth : birthDate
        });
        action.setCallback(this, function(response) {
             //component.set("v.amtMonth",response.getReturnValue());
               component.find("amount").set("v.value", response.getReturnValue().retirementAmount);
             
            console.log("value: ",response.getReturnValue());
        });
        $A.enqueueAction(action);
            }
            
        }
     },
    
    amtAndContri : function(component, event, helper)
    {
        var associated = component.find("associateAcc").get("v.value");
        var years = component.find("retireAge").get("v.value");
        var target =component.find("amount").get("v.value");
        var interestRate = component.find("rateReturn").get("v.value");
        var retDate =component.find("rDate").get("v.value");
        var curAmt = component.find("currVal").get("v.value");
      
        console.log("interest",interestRate);
        console.log("associated",associated);
        console.log("years",years);
        console.log("target",target);
        console.log("curAmt",curAmt);
        console.log("retDate",retDate);
        var action = component.get("c.getAmtAndContri");  
        console.log(associated[0]);
        action.setParams
        ({
            "accId" : associated,
            tillRetirement : years,
            interest : interestRate,
            targetAmt : target,
            retireDate : retDate,
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
        var status = 0;
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
    
       
    
    cancelButton : function(component, event, helper) {
  
        
        helper.hideExampleModal(component);
    },
    
     saveButton : function(component, event, helper) {
        
        var recordId=component.get("v.retirementGoalId");
        console.log("record Id", recordId);
        var own =  component.find("owner").get("v.value"); 
        console.log("own", own, typeof own);
        
        
        var n =  component.find("name").get("v.value"); 
        console.log("name", n, typeof n);
        
        var birth =  component.find("birth").get("v.value");
        console.log("birth", birth, typeof birth);
        
        var retire =  component.find("afterRetirement").get("v.value");
        console.log("retire", retire, typeof retire);
        
        var rate = component.find("Rate").get("v.value");
        console.log("rate", rate, typeof rate);
        
        var rAge =component.find("retireAge").get("v.value"); 
        console.log("rAge", rAge, typeof rAge);
        
        var retireIncome =component.find("annualIncome").get("v.value");  
        console.log("retireIncome", retireIncome, typeof retireIncome);
        
        var rateInterest =  component.find("rateReturn").get("v.value");
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
        console.log("ismonthly",ismonthly, typeof ismonthly);
        if(isTaxDeduction){
            var ele = component.find("taxcontri")
            taxcontri = ele.get("v.value");
            console.log("taxcontri",taxcontri,typeof taxcontri);
            var maxDeduction=component.find("maxdeduction").get("v.value");
            console.log("maxdeduction",maxDeduction)
            
            var ismonthly=component.get("v.isMonthly")
            console.log("ismonthly",ismonthly, typeof ismonthly);
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
                tDate : tar,
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
                    console.log(resp)
                    helper.hideExampleModal(component);
                    
                }
                
                
                
            } );
            $A.enqueueAction(action);   
        }
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
    handleRadio: function(component, event) 
    {
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
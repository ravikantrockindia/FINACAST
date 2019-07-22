({
    Acclist : function(component, event, helper) {
               
        var action = component.get("c.dample"); 
        // method name i.e. getEntity should be same as defined in apex class
        // params name i.e. entityType should be same as defined in getEntity method
        var clientId=component.find("owner").get("v.value");
        console.log('ssDD'+clientId);
        action.setParams({
            clientId : clientId
        });
        action.setCallback(this, function(a){
            var state = a.getState(); // get the response state
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
        var gId = component.get("v.retirementGoalId");
        console.log("dgd");
        if(component.get("v.birthDate")!=null){
            console.log("birth date",component.get("v.birthDate"));
            component.find("birth").set("v.value",component.get("v.birthDate") ); }
        console.log(component.get("v.client"))
        if(component.get("v.client")!=null)
            component.find("owner").set("v.value",component.get("v.client.Id"));
        else{
             if(component.get("v.PrimaryOwner")!=null)
            component.find("owner").set("v.value",component.get("v.PrimaryOwner" ));
        }
       
        if(component.get("v.DesiredAnnualIncome")!=null)
            component.find("annualIncome").set("v.value",component.get("v.DesiredAnnualIncome"));
        if(component.get("v.RateofReturnAfterRetirement")!=null)
            component.find("rateReturn").set("v.value",component.get("v.RateofReturnAfterRetirement"));
        if(component.get("v.GoalName")!=null)
            component.find("name").set("v.value",component.get("v.GoalName"));
        if(component.get("v.YearsLivingAfterRetirement")!=null)
            component.find("afterRetirement").set("v.value",component.get("v.YearsLivingAfterRetirement"));
        if(component.get("v.ExpectedInflationRate")!=null)
            component.find("Rate").set("v.value",component.get("v.ExpectedInflationRate"));
        if(component.get("v.Retiring")!=null)
            component.find("retireAge").set("v.value",component.get("v.Retiring"));
        
        
        
        
        
        
        if(!($A.util.isUndefinedOrNull(gId) || gId == ""))
        {
            var action = component.get("c.getGoalData");
            action.setParams({
                goalId : component.get("v.retirementGoalId")
            });
            
            
            /* action.setCallback(this, function(response) {
            console.log("dgd",JSON.stringify(response.getReturnValue()));
            component.set("v.birthDate",response.getReturnValue().Date_Of_Birth__c);
			component.find("birth").set("v.value",response.getReturnValue().Date_Of_Birth__c.toString() );
            component.find("owner").set("v.value",response.getReturnValue().FinServ__PrimaryOwner__c.toString() );
             //component.set("v.PrimaryOwner",response.getReturnValue().OwnerId.toString());
            component.find("name").set("v.value",response.getReturnValue().Name.toString() );
            component.find("afterRetirement").set("v.value",response.getReturnValue().Years_Of_Living_After_Retirement__c.toString());
            component.find("Rate").set("v.value",response.getReturnValue().Expected_Inflation_Rate__c.toString() );
            component.find("retireAge").set("v.value",response.getReturnValue().Retirement_Age__c.toString() );
            component.find("annualIncome").set("v.value",response.getReturnValue().Desired_Annual_Income_For_Retirement__c.toString());
            component.find("rateReturn").set("v.value",response.getReturnValue().Rate_Of_Return_After_Retirement__c.toString());
            
            
            
        });
         $A.enqueueAction(action);*/
        }
        
        
        
    },
    getDateofBirth : function(component, event, helper)
    {	console.log('inside getDateofBirth()');
     // console.log(recUi.record.fields["Date_Of_Birth__c"].value);
     
     /* var dob=recUi.record.fields["Date_Of_Birth__c"].value;
       
         
     
        var cId = component.find("owner").get("v.value");
        console.log('cID: ',cId);
        console.log('cID[0]: ',cId[0]);
        var action = component.get("c.getDate");
        action.setParams({ 
            clientId : cId[0] 
        });
        action.setCallback(this, function(response) {
            component.set("v.birthDate",response.getReturnValue());
            console.log('birthdate',component.get("v.birthDate"));
            console.log('resp: ',response.getReturnValue());
        });
        $A.enqueueAction(action);*/
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
    
    nextButtons : function(component, event, helper) {
        component.set("v.sp", true);
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
            var roiSplit = rateofreturn.split(".");
            
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
            
            
            helper.showAlertEmptyVal(component, event, helper,msg);
        }
        
        if($A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(n) || n == "" ||  $A.util.isUndefinedOrNull(dateofbirth) || dateofbirth == "" || $A.util.isUndefinedOrNull(afterRetire) || afterRetire == "" || $A.util.isUndefinedOrNull(iRate) || iRate == "" || $A.util.isUndefinedOrNull(rAge) || rAge == "" || $A.util.isUndefinedOrNull(retireincome) || retireincome == "" || $A.util.isUndefinedOrNull(rateofreturn) || rateofreturn == "" )
        {
            status9 = 0;
            
            msg =  "•Please fill mandatory fields!!";
            
            helper.showAlertEmptyVal(component, event, helper,msg);
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
            var retirementYear = component.find("retireAge").get("v.value");
            var getYear = Number(getDate[0]);
            var acclist = component.get("v.Acclist");
            var rYear = Number(getDate[0])+Number(retirementYear);
            getDate[1]=getDate[1].length==1?"0"+getDate[1]:getDate[1];        
            var d = rYear+"-"+getDate[1]+"-01";
            var today = new Date();
            var recordId=component.get("v.retirementGoalId");
            console.log("accountlist", acclist)
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
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef  : "c:RetirementGoalScreen2",
                    componentAttributes: {
                        owner : priowner,
                        name : n,
                        dob : dateofbirth,
                        yearsAfterRetirement : afterRetire,
                        inflationRate : iRate,
                        retirementAge :rAge,
                        retirementAnnualIncome :retireincome,
                        roi :rateofreturn,
                        tarDate : d,
                        recordId:recordId,
                        accountList : acclist
                    }
                });
                evt.fire(); 
            } 
        }
    },
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
    },
    
    showExampleModal : function(component, event, helper) {
        helper.showExampleModal(component);
    },
})
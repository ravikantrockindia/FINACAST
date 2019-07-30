({
    
	doInit : function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
        var tab = component.get("v.tabName")
       // console.log('tab',tab)
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            //console.log('tab id',focusedTabId )
            workspaceAPI.setTabLabel({
                label: tab
            });
        })
        .catch(function(error) {
            console.log(error);
        });
        
        const defaultData = {"debugObj":[],"offset":2019,"debtAnalysis":{ "debtPayed": [], "debtItems": 0},"financialHealthAnalysis":[],"yearlySavings":[],"monthlySavingsTrack":[],"years":0,"goalAnalysis":{},"netWorthAnalysis":{},"monthOffset":{}};
        component.set("v.data2", defaultData);
		helper.showFieldsValue(component); 
        //console.log('in init : '+component.get('v.selectedValue'));
	},
    
     handleSuccess : function(component,event,helper) {
         //console.log('Goal Saved');
        component.set("v.recordName","");
        component.set("v.debtButtonStatus",false);  
        component.set("v.savingButtonStatus",false);
        component.set("v.goalButtonStatus",false);
        helper.showFieldsValue(component);
    },
    
    cancelButton : function(component,event) {
        component.set("v.recordName", "");
        component.set("v.goalButtonStatus",false);
        component.set("v.savingButtonStatus",false);
        component.set("v.debtButtonStatus",false);  
        component.set("v.manageScenarioStatus", false);
    },
    
    onEditButton : function(component,event,helper) {
        component.set("v.recordName", event.getSource().get("v.name"));
        if(component.get("v.recordName") == "goal button") {
            component.set("v.recordId",event.getSource().get("v.value"));
            component.set("v.goalButtonStatus",true);
        }
        if(component.get("v.recordName") == "loan button" ) {
            component.set("v.isLoan",true);
            component.set("v.recordId",event.getSource().get("v.value"));
            component.set("v.debtButtonStatus",true);
        }
        /*if(component.get("v.recordName") == "credit card button") {
            component.set("v.isLoan",false);
            component.set("v.recordId",event.getSource().get("v.value"));
            component.set("v.debtButtonStatus",true);
        }*/
        if(component.get("v.recordName") == "saving button") {
            component.set("v.recordId",event.getSource().get("v.value"));
            component.set("v.savingButtonStatus", true);
        }
        helper.showFieldsValue(component);
    },
    
    onDeleteButton : function(component,event,helper) {
        component.set("v.recordName", event.getSource().get("v.name"));
        //console.log('Scene id in delete' + component.get("v.scene"));
       // console.log('recANem' + event.getSource().get("v.name"));
        var recordId = event.getSource().get('v.value');
        var action = component.get("c.deleteRecord");
        action.setParams({
           // clientId : component.get("v.cid"),
            sceneId : component.get("v.scene"),
            recId : recordId,
          //  recType : component.get("v.recordName")
        });
        action.setCallback(this, function(response) {
            if(response.getState() == 'SUCCESS'){
                if(component.get("v.recordName") == "goal button") {
                    component.set("v.goal", response.getReturnValue());
                }
                if(component.get("v.recordName") == "loan button" ) {
                    component.set("v.loan", response.getReturnValue()); 
                }
                /*if(component.get("v.recordName") == "credit card button") {
                    component.set("v.creditcard", response.getReturnValue()); 
                }*/
                if(component.get("v.recordName") == "saving button") {
                    component.set("v.savings", response.getReturnValue()); 
                }
            }
            else{
                console.log('Not Delted');
            }
            helper.showFieldsValue(component);
        });
        $A.enqueueAction(action);
    },
    
    //to save income, expense, goal target amount, loan, savings, credit card amount on moving slider
    onClickSaveIcon : function(component,event,helper) {
        var recTypeName = event.getSource().get("v.name");
        var recId = event.getSource().get("v.value");
        if($A.util.isUndefinedOrNull(recId)) {
            recId = "init";
        }
        //console.log(component.get("v.expenseSlider"));
        var action = component.get("c.saveRecord")
        action.setParams({
            clientId : component.get("v.cid"),
            recType : recTypeName,
            sceneId : component.get("v.scene"),
            incomeAmount : component.get("v.incomeSlider"),
            expenseAmount : component.get("v.expenseSlider"),
            recordId : recId
        });
        action.setCallback(this, function(response) {
            if(recTypeName == "scenario") {
                helper.showFieldsValue(component);
            }
            if(recTypeName == "income save") {
                component.set("v.income", response.getReturnValue());
            }
            if(recTypeName == "expense save") {
                console.log('expeses success');
                console.log('resExp: ' + response.getReturnValue());
                component.set("v.expense", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
        helper.showFieldsValue(component);
    },
    
    //set value of attribute on changing the slider for income, expense, loan , saving, credit cards
    getIncomeSliderValue : function(component,event) {
        component.set("v.incomeSlider", event.getSource().get("v.value"));
    },
    
    getExpenseSliderValue : function(component,event) {
        console.log(event.getSource().get("v.value"));
        component.set("v.expenseSlider", event.getSource().get("v.value"));
    },
    
    //********************* model utilities come here ****************************/
     
    addGoalButton : function(component, event, helper) {
        var action = component.get("c.getRecordTypeId");
        action.setParams ({
            recName : event.getSource().get("v.name")
        });
        action.setCallback(this, function(response){
            component.set("v.recordTypeId",response.getReturnValue());
            component.set("v.recordName", event.getSource().get("v.name"));				//set recordName atttribute -- to use same editButton(), handleSubmit (), handleSuccess () for different records         
            component.set("v.recordId",'');												// set recordId attribute to blank -- to use recordId attribute for different records 
            component.set("v.goalButtonStatus",true);
            helper.showFieldsValue(component);
        });
        $A.enqueueAction(action);
    },
    
    addIncomeButton : function(component) {
        component.set("v.recordName", event.getSource().get("v.name"));				//set recordName atttribute -- to use same editButton(), handleSubmit (), handleSuccess () for different records         
        component.set("v.recordId",'');												// set recordId attribute to blank -- to use recordId attribute for different records 
    },
    
    addExpenseButton : function(component) {
        component.set("v.recordName", event.getSource().get("v.name"));				//set recordName atttribute -- to use same editButton(), handleSubmit (), handleSuccess () for different records         
        component.set("v.recordId",'');												// set recordId attribute to blank -- to use recordId attribute for different records 
    },
    
    addLoanButton : function(component, event) {
        var action = component.get("c.getRecordTypeId");
        action.setParams ({
            recName : event.getSource().get("v.name")
        });
        action.setCallback(this, function(response){
            component.set("v.recordTypeId",response.getReturnValue());
            component.set("v.recordName", event.getSource().get("v.name"));				//set recordName atttribute -- to use same editButton(), handleSubmit (), handleSuccess () for different records         
            component.set("v.isLoan",true);         
            component.set("v.recordId",'');												// set recordId attribute to blank -- to use recordId attribute for different records 
            component.set("v.debtButtonStatus",true); 
        });
        $A.enqueueAction(action);
    },
    

    addCardButton : function(component,event) {
        var action = component.get("c.getRecordTypeId");
        action.setParams ({
            recName : event.getSource().get("v.name")
        });
        action.setCallback(this, function(response){
            component.set("v.recordTypeId",response.getReturnValue());
            component.set("v.recordName", event.getSource().get("v.name"));				//set recordName atttribute -- to use same editButton(), handleSubmit (), handleSuccess () for different records         
            component.set("v.isLoan", false);
            component.set("v.recordId",'');												// set recordId attribute to blank -- to use recordId attribute for different records  
            component.set("v.debtButtonStatus",true);
        });
        $A.enqueueAction(action);
    },
    

    addSavingButton : function(component,event) {
        var action = component.get("c.getRecordTypeId");
        action.setParams ({
            recName : event.getSource().get("v.name")
        });
        action.setCallback(this, function(response){
            component.set("v.recordTypeId",response.getReturnValue());
            component.set("v.recordName", event.getSource().get("v.name"));				//set recordName atttribute -- to use same editButton(), handleSubmit (), handleSuccess () for different records         
            component.set("v.recordId",'');												// set recordId attribute to blank -- to use recordId attribute for different records 
            component.set("v.savingButtonStatus", true);
        });
        $A.enqueueAction(action);
    },
    
    // check type of saving accout and display fields 
    clickSavingTypeofAccount : function(component,event) {
        component.set("v.displayInterest", false);
        component.set("v.displayMaturityDate", false);
        if(event.getSource().get("v.value") == "Checking" || event.getSource().get("v.value") == "Savings" || 
           event.getSource().get("v.value") == "Money Market" || event.getSource().get("v.value") == "CD" || event.getSource().get("v.value") == "Brokerage") {
            component.set("v.displayInterest", true);
        }
        if(event.getSource().get("v.value") == "CD" ) {
            component.set("v.displayMaturityDate", true);
        }
    },
    
    //get current amount and monthly contribution for scenario goal
    onClickAssociatedAcc : function(component) {
        //console.log('account id: ',component.find("bankAccount").get("v.value"));
        if($A.util.isUndefinedOrNull(component.find("bankAccount").get("v.value")) || component.find("bankAccount").get("v.value") == "" ) {
            component.set("v.balance", "0");
            component.set("v.contribution","0");
        }
        if($A.util.isUndefinedOrNull(component.find("bankAccount").get("v.value")) != true || component.find("bankAccount").get("v.value") != "")
        {
            var action = component.get("c.getAmtContri");
            action.setParams ({
                accId : component.find("bankAccount").get("v.value"),
                currentAmt : component.find("currentAmount").get("v.value"),
                tarDate : component.find("targetDate").get("v.value"),
                tarAmt : component.find("targetAmount").get("v.value")
            });
            action.setCallback(this, function(response) {
                console.log('resp',response.getReturnValue().currentAmt);
                component.set("v.balance", response.getReturnValue().currentAmt)  
                component.set("v.contribution", response.getReturnValue().monthlyContri)
            });
            $A.enqueueAction(action);
        }
    },
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
    },
    
    showExampleModal : function(component, event, helper) {
        helper.showExampleModal(component);
    },
    
     handleSubmit : function(component, event,helper)
    {
        var msg;
        var status1;
        var status2;
        var status3;
        var status4;
        var status5;
        /****
         * check if mandatory field on goal is blank or not filled
         * **/
        if(component.get("v.recordName") == "goal button") {
            status1 = 0;
            status2 = 0;
            status3 = 0;
            status4 = 0;
            status5 = 0;
            console.log(component.find("owner").get("v.value"));
             console.log(component.find("goalType").get("v.value"));
            console.log(component.find("goalName").get("v.value"));
            console.log(component.find("targetAmount").get("v.value"));
            console.log(component.find("targetDate").get("v.value"));
            console.log(component.find("bankAccount").get("v.value"));
            console.log(component.find("currentAmount").get("v.value"));
            console.log(component.find("goalPriority").get("v.value"));
            console.log(component.find("contri").get("v.value"));
            if($A.util.isUndefinedOrNull(component.find("owner").get("v.value")) || component.find("owner").get("v.value") == "" ||
               $A.util.isUndefinedOrNull(component.find("goalType").get("v.value")) || component.find("goalType").get("v.value") == "" ||
               $A.util.isUndefinedOrNull(component.find("goalName").get("v.value")) || component.find("goalName").get("v.value") == "" ||
               $A.util.isUndefinedOrNull(component.find("targetAmount").get("v.value")) || component.find("targetAmount").get("v.value") == "" ||
               $A.util.isUndefinedOrNull(component.find("targetDate").get("v.value")) || component.find("targetDate").get("v.value") == "" ||
               $A.util.isUndefinedOrNull(component.find("bankAccount").get("v.value")) || component.find("bankAccount").get("v.value") == "" ||
               $A.util.isUndefinedOrNull(component.find("currentAmount").get("v.value")) || (component.find("currentAmount").get("v.value") == ""  &&  component.find("currentAmount").get("v.value") != 0) ||
               $A.util.isUndefinedOrNull(component.find("goalPriority").get("v.value")) || component.find("goalPriority").get("v.value") == ""||
               $A.util.isUndefinedOrNull(component.find("contri").get("v.value")) || component.find("contri").get("v.value") == "")
            {
                status1 = 1;
                event.preventDefault();
                msg = "Please fill mandatory fields.1";
                helper.showAlertValidation(component,msg);       
            }
            if(status1 != 1 ) {
                if((component.find("goalName").get("v.value")).length > 180 ) {
                    status2 = 1;
                    event.preventDefault();
                    msg = "•Name cannot be greater than 80 characters\n";    
                }
                else {
                    status2 = 0;
                }
                
                if((component.find("targetAmount").get("v.value")).length > 8 || (component.find("targetAmount").get("v.value")) < 0 )  {
                    event.preventDefault();
                    status3 = 1;
                    msg = msg +"•Amount That Need To Be Reached cannot be negative or exceed 8 digits\n"
                }
                else {
                    status3 = 0;
                }
                helper.showAlertValidation(component,msg);    
            }
        }
        
        if(component.get("v.recordName") == "debt button" ) {
            status1 = 0;
            status2 = 0;
            status3 = 0;
            status4 = 0;
            status5 = 0;
            if($A.util.isUndefinedOrNull(component.find("debtName").get("v.value")) || component.find("debtName").get("v.value") == "" ||
               $A.util.isUndefinedOrNull(component.find("debtAmount").get("v.value")) || component.find("debtAmount").get("v.value") == "" ||
               $A.util.isUndefinedOrNull(component.find("debtInterest").get("v.value")) || component.find("debtInterest").get("v.value") == "" ) {
                if(component.get("v.isLoan") == TRUE) {
                    if($A.util.isUndefinedOrNull(component.find("debtPayment").get("v.value")) || component.find("debtPayment").get("v.value") == "" ||
                       $A.util.isUndefinedOrNull(component.find("debtFrequency").get("v.value")) || component.find("debtFrequency").get("v.value") == "" )
                        event.preventDefault();
                    status1 = 1;
                    msg = "Please fill mandatory fields.2"
                    helper.showAlertValidation(component,msg); 
                }
                event.preventDefault();
                status2 = 1;
                msg = "Please fill mandatory fields.3"
                helper.showAlertValidation(component,msg);       
            }
            
            if(status1 != 1 && status2 != 1) {
                if((component.find("debtName").get("v.value")).length > 80) {
                    status3 = 1;
                    event.preventDefault();
                    msg = "Name cannot exceeds 80 characters"
                }
                var debtInt = (component.find("debtInterest").get("v.value")).split('.');
                if (debtInt.length == 1) {
                    if(debtInt[0].length > 2 || debtInt[0] < 0 ) {
                        status4 = 1;
                        msg = msg + "•Total Debt Amount cannot be negative or of more than 2 digits before decimal \n";
                    }
                    else {
                        status4 = 0;
                    }
                }
                else {
                    status4 = 0;
                }           
                if(debtInt.length == 2 ) {
                    if(debtInt[0].length > 2 || debtInt[0] < 0 || debtInt[1].length > 2 ) {
                        status5 = 1;
                        msg = msg + "•Total Debt Amount cannot be negative or of more than 2 digits before and after decimal \n";
                    }
                    else {
                        status5 = 0;
                    }
                }   
                if(status3 == 1|| status4 == 1 || status5 ==1) {
                    helper.showAlertValidation(component,msg);  
                }
            }
        }
        if(component.get("v.recordName") == "saving button") {
            status1 = 0;
            if($A.util.isUndefinedOrNull(component.find("savingName").get("v.value")) || component.find("savingName").get("v.value") == "" ||
               $A.util.isUndefinedOrNull(component.find("savingType").get("v.value")) || component.find("savingType").get("v.value") == "" ||
               $A.util.isUndefinedOrNull(component.find("currentAmount").get("v.value")) || component.find("currentAmount").get("v.value") == "" )
            {
                status1 = 1;
                event.preventDefault();
                msg = "Please fill mandatory fields.4"
                helper.showAlertValidation(component,msg); 
            }
            if((component.find("savingName").get("v.value")).length > 180 ) {
            if(status1 != 1) {
                event.preventDefault();
                msg = "Name cannot exceeds 80 characters."
                helper.showAlertValidation(component,msg);    
            }
            }
                  }
    },
    
    manageScenarioButton : function(component, event, helper) {     
        var action = component.get("c.getUserScenarios");
        component.set("v.manageScenarioStatus", true);
        component.set("v.isAddScenarioActive", true); 
    },
    
    onClickChangeScenario : function(component, event, helper) {
        console.log(component.find('scenarioList').get("v.value"));
        var s = component.find('scenarioList').get("v.value");
        
        component.set("v.scene", component.find('scenarioList').get("v.value"));
        helper.showFieldsValue(component,event);  
    },
    
    hideExampleModal : function(component) {
        component.set("v.manageScenarioStatus", false);
    },
    
     showExampleModal : function(component, event, helper) {
        component.set("v.manageScenarioStatus", true);
    },
    
     onScenarioAddButton : function(component) {
        component.set("v.addScenarioButtonStatus", true);
        component.set("v.isAddScenarioActive", false);			//to disable add another scenario button and after click save icon enable it 
    },
    
    onScenarioSaveIcon : function(component) {
        if(($A.util.isUndefinedOrNull(component.find("sceneName").get("v.value"))) != true && component.find("sceneName").get("v.value") !="" )
        {
            var action = component.get("c.saveRecord");
            action.setParams({
                recName : component.find("sceneName").get("v.value"),
                clientId : component.get("v.cid"),
                recType : 'scenario'
            });
            
            action.setCallback(this, function(response){ 
                console.log('resonse after save: ' + JSON.stringify(response.getReturnValue()));
                var state = response.getState();
                if(state == 'SUCCESS'){
                    component.set("v.addScenarioButtonStatus", false);
                    component.set("v.isAddScenarioActive", true);
                    component.set("v.scenario", response.getReturnValue());
                    //component.set("v.sceneId",component.get("v.scenario[0].Id"));
                    component.set("v.scene",component.get("v.scenario[0].Id"));
                }
                else{
                    console.log('failed');
                }
            });
            $A.enqueueAction(action);
        }   
    },
    
    onDoneScenarioButton : function(component) {
        component.set("v.manageScenarioStatus", false);
    },
    
    //new method
    onNewScenarioSaveSuccess : function(component) {
        console.log('Scenario Saving');
        if(($A.util.isUndefinedOrNull(component.find("sceneName").get("v.value"))) != true && component.find("sceneName").get("v.value") !="" )
        {
            var action = component.get("c.saveNewScenario");
            action.setParams({
                name : component.find("sceneName").get("v.value"),
                clientId : component.get("v.cid"),
            });
            
            action.setCallback(this, function(response){ 
                console.log('resonse after save: ' + JSON.stringify(response.getReturnValue()));
                var state = response.getState();
                if(state == 'SUCCESS'){
                    component.set("v.addScenarioButtonStatus", false);
                    component.set("v.isAddScenarioActive", true);
                    component.set("v.scenario", response.getReturnValue());
                    component.set("v.scene",component.get("v.scenario[0].Id"));
                }
                else{
                    console.log('failed');
                }
            });
            $A.enqueueAction(action);
        }   
    },
    
})
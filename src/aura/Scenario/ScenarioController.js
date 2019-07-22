/*
 * created by : avneet kaur
**/

({
    doInit : function(component,event,helper) {
        console.log('Inside Scenario Component');
        helper.showFieldsValue(component); 
    },
    
    /**
     * called from parent component
     * called when client is changed
     * **/
    
    changeFieldsValue : function(component,event, helper) {
        var params = event.getParam('arguments');					// if not , error on changing client
        if (params) {
            component.set("v.client",params.changeClient);
            component.set("v.scene",params.sceneId);
            helper.showFieldsValue(component);
            console.log('scene  in  change field : ',component.get("v.scene"));
        }
        helper.showFieldsValue(component);
    },
    
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
    },
    
    showExampleModal : function(component, event, helper) {
        helper.showExampleModal(component);
    },
    
    
    /**
     * to add goal for scenario
     * **/
    
    
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
    
    /**
     * to add income for scenario
     * **/
    addIncomeButton : function(component) {
        component.set("v.recordName", event.getSource().get("v.name"));				//set recordName atttribute -- to use same editButton(), handleSubmit (), handleSuccess () for different records         
        component.set("v.recordId",'');												// set recordId attribute to blank -- to use recordId attribute for different records 
    },
    
    /**
     * to add expense for scenario
     * **/
    addExpenseButton : function(component) {
        component.set("v.recordName", event.getSource().get("v.name"));				//set recordName atttribute -- to use same editButton(), handleSubmit (), handleSuccess () for different records         
        component.set("v.recordId",'');												// set recordId attribute to blank -- to use recordId attribute for different records 
    },
    
    //set v.loanButtonStatus, display loan form when add anther loan button is clicked
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
    
    /**
     * to add credit card for scenario
     * **/
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
    
    /**
     * to add savings for scenario
     * **/
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
    
    
    /***
     * called before goal or loan, saving is saved
     * **/
    
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
                msg = "Please fill mandatory fields.";
                helper.showAlertValidation(component,msg);       
            }
            if(status1 != 1 ) {
                if((component.find("goalName").get("v.value")).length > 80 ) {
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
                    msg = "Please fill mandatory fields."
                    helper.showAlertValidation(component,msg); 
                }
                event.preventDefault();
                status2 = 1;
                msg = "Please fill mandatory fields."
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
                msg = "Please fill mandatory fields."
                helper.showAlertValidation(component,msg); 
            }
            if(status1 != 1) {
                event.preventDefault();
                msg = "Name cannot exceeds 80 characters."
                helper.showAlertValidation(component,msg);    
            }
        }
    },
    
    /***
     * called when the record is saved
     * close the pop-up for record
     * ***/
    
    handleSuccess : function(component,event,helper) {
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
        if(component.get("v.recordName") == "credit card button") {
            component.set("v.isLoan",false);
            component.set("v.recordId",event.getSource().get("v.value"));
            component.set("v.debtButtonStatus",true);
        }
        if(component.get("v.recordName") == "saving button") {
            component.set("v.recordId",event.getSource().get("v.value"));
            component.set("v.savingButtonStatus", true);
        }
        helper.showFieldsValue(component);
    },
    
    onDeleteButton : function(component,event,helper) {
        component.set("v.recordName", event.getSource().get("v.name"));
        var recordId = event.getSource().get('v.value');
        var action = component.get("c.deleteRecord");
        action.setParams({
            clientId : component.get("v.client.Id"),
            sceneId : component.get("v.scene"),
            recId : recordId,
            recType : component.get("v.recordName")
        });
        action.setCallback(this, function(response) {
            if(component.get("v.recordName") == "goal button") {
                component.set("v.goal", response.getReturnValue());
            }
            if(component.get("v.recordName") == "loan button" ) {
                component.set("v.loan", response.getReturnValue()); 
            }
            if(component.get("v.recordName") == "credit card button") {
                component.set("v.creditcard", response.getReturnValue()); 
            }
            if(component.get("v.recordName") == "saving button") {
                component.set("v.savings", response.getReturnValue()); 
            }
        });
        $A.enqueueAction(action);
        helper.showFieldsValue(component)
    },
    
    /* onSavingEditButton : function(component,event) {
        component.set("v.recordId",event.getSource().get("v.value"));
        component.set("v.savingButtonStatus",true);
        
    },*/
    
    //to save income, expense, goal target amount, loan, savings, credit card amount on moving slider
    onClickSaveIcon : function(component,event,helper) {
        var recTypeName = event.getSource().get("v.name");
        var recId = event.getSource().get("v.value");
        if($A.util.isUndefinedOrNull(recId)) {
            recId = "init";
        }
        var action = component.get("c.saveRecord")
        action.setParams({
            clientId : component.get("v.client.Id"),
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
                component.set("v.expense", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
        helper.showFieldsValue(component);
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
        /*if(event.getSource().get("v.value") == "Retail Brokerage") {
           cost, margin, investment profile 
        }*/
        
    },
    
    //get current amount and monthly contribution for scenario goal
    onClickAssociatedAcc : function(component) {
        console.log('account id: ',component.find("bankAccount").get("v.value"));
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
    
    //set value of attribute on changing the slider for income, expense, loan , saving, credit cards
    getIncomeSliderValue : function(component,event) {
        component.set("v.incomeSlider",event.getSource().get("v.value"));
    },
    
    getExpenseSliderValue : function(component,event) {
        component.set("v.expenseSlider",event.getSource().get("v.value"));
    }
    
})
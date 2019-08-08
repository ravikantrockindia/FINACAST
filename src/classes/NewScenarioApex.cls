/********* Developer Name: Aditya Kaushal
* updated Date: July 5' 19
* provided new implementation *********/


public class NewScenarioApex {
    
    private static String requestEndpoint='https://mytafi.herokuapp.com/rest/service/getFutureSimulationsNew';
    
    //Parent wrapper Class
    public class UserAndScenarios{
        @AuraEnabled public Account userNameId;                                     		 // id and name from account
        @AuraEnabled public List<Scenario_Income__c> userScenarioIncome;            					 // income of user for scenario income
        @AuraEnabled public List<Scenario_Expense__c> userScenarioExpense;            				 // expense of user 
        @AuraEnabled public List<Scenario_Goal__c> userScenarioGoal;                // goal og user for scenario goal
        @AuraEnabled public List<Scenario__c> userScenario;                         		 // scenario of user
        @AuraEnabled public List<Scenario_Savings__c> userSceneSave;                         // list of scenario saving
        @AuraEnabled public List<Scenario_Debt__c> userScenarioLoan;                         // list of scenario Loan
        @AuraEnabled public Decimal totalGoalAmount;                                		 // total target amount of all goals of user 
        @AuraEnabled public Decimal totalIncomeAmount;                              		 // total income of user 
        @AuraEnabled public Decimal totalExpenseAmount;                              		 // total expense of user
        @AuraEnabled public Decimal totalSaveAmount;                                		 // total current amount of all savings of user 
        @AuraEnabled public Decimal totalLoanAmount;                                		 // total payment amount of all loans of user 
        @AuraEnabled public String scenarioId;                                      		 // scenario id for user
        @AuraEnabled public String response;                                      			 // response from web service
        @AuraEnabled public String primaryOwner;											 //get primaryMember id in case of household, or account id in case it is not household
        @AuraEnabled public List<Scenario__c> scenarioList;
    }
    
    @AuraEnabled
    public static UserAndScenarios getUserScenarios(String clientId, String sceneId) {
        String s2 = sceneId;
        List<sobject> emptyList = new List<sObject>();       
        List<Scenario__c> sceneList = new List<Scenario__c>();
        UserAndScenarios wrapper = new UserAndScenarios();
        
        try{
                       
            wrapper.userNameId = [select id,RecordTypeId, name from account where id =: clientId];         
            
            //give values to sceneId
            if(sceneId == 'init' || String.isEmpty(sceneId) || String.isBlank(sceneId)) {
                sceneList = [select Name, Id from Scenario__c where Client_Id__c = :clientId order by LastModifiedDate DESC]; 
                
                if(sceneList != null && sceneList.size()> 0) {
                    sceneId = sceneList.get(0).Id;  
                    wrapper.scenarioId = sceneId;
                    System.debug('inside if of has scene id' + sceneId);
                }
                else {
                    System.debug('inside else of has scene id' + s2);
                    //sceneId = 'No Scenario';  
                    //wrapper.scenarioId = '';
                    wrapper.scenarioId = s2;
                }
            }//end if
            else{
                wrapper.scenarioId = s2; 
            }
            
            wrapper.primaryOwner = clientId;
            
            //case1:   if a scenaroi exists
            if(sceneId != 'No Scenario' && sceneId != null) {
                Decimal totalAmount = 0;
                
                // 1. Create income list
                List<Scenario_Income__c> sceneIncomeList = [select Id, Name, Amount__c from Scenario_Income__c where Scenario_Id__c = :sceneId];  
                if(sceneIncomeList != null && sceneIncomeList.size() > 0) {
                    totalAmount = 0;
                    wrapper.userScenarioIncome = sceneIncomeList;
                    for(Scenario_Income__c incomeAmt : sceneIncomeList) {
                        if(incomeAmt.Amount__c != null) {
                            totalAmount += incomeAmt.Amount__c;    
                        }
                        else {
                            totalAmount += 0;
                        }
                    }
                    wrapper.totalIncomeAmount = totalAmount; 
                }//end income if

                
                // 2. search scenario expense and calculate total expense amount
                List<Scenario_Expense__c> sceneExpenseList = [select Id, Name, Amount__c from Scenario_Expense__c where Scenario_Id__c = :sceneId ];
                if(sceneExpenseList !=null && sceneExpenseList.size() > 0) {
                    totalAmount = 0;
                    wrapper.userScenarioExpense = sceneExpenseList;
                    for(Scenario_Expense__c expenseAmt : sceneExpenseList) {
                        if(expenseAmt.Amount__c != null) {
                            totalAmount += expenseAmt.Amount__c;             
                        }
                        else {
                            totalAmount += 0; 
                        }
                    }
                    wrapper.totalExpenseAmount = totalAmount;
                }//end expense if
                
                // 3. search scenario goals and calculate total goal amount
                List <Scenario_Goal__c> sceneGoal = [select name, Scenario_Target_Amount__c from Scenario_Goal__c where Scenario__c = :sceneId];
                if(sceneGoal != null && sceneGoal.size() > 0)   {
                    totalAmount = 0;
                    wrapper.userScenarioGoal = sceneGoal; 
                    for(Scenario_Goal__c goalAmt : sceneGoal){
                        if(goalAmt.Scenario_Target_Amount__c != Null)  {
                            totalAmount += goalAmt.Scenario_Target_Amount__c;
                        }
                        else {
                            totalAmount += 0;  
                        }
                    }
                    wrapper.totalGoalAmount = totalAmount;
                }//end goal if
                
                // 4. search scenario loans and calculate total loan amount
                List <Scenario_Debt__c> sceneLoan = [select Name, Current_Value__c, Payment_Amount__c, APR__c,Frequency__c from Scenario_Debt__c where Scenario_Id__c = :sceneId];
                if(sceneLoan != null && sceneLoan.size() > 0)   {
                    totalAmount = 0;
                    wrapper.userScenarioLoan = sceneLoan; 
                    for(Scenario_Debt__c loanAmt : sceneLoan){
                        if(loanAmt.Payment_Amount__c != Null) {
                            totalAmount += loanAmt.Payment_Amount__c;
                        }
                        else {
                            totalAmount += 0;
                        }
                    }
                    wrapper.totalLoanAmount = totalAmount;
                }//end loan if
                
                
                // 5. search scenario savinngs and calculate total saving amount
                List<Scenario_Savings__c> sceneSaveList = [select name, Current_Value__c, APY__c from Scenario_Savings__c where Scenario__c = :sceneId];
                if(sceneSaveList != null && sceneSaveList.size() > 0) {
                    totalAmount = 0;
                    wrapper.userSceneSave = sceneSaveList;
                    for(Scenario_Savings__c saveAmt : sceneSaveList) {
                        if(saveAmt.Current_Value__c != Null) {
                            totalAmount += saveAmt.Current_Value__c;
                        }
                        else {
                            totalAmount += 0;
                        }
                    }
                    wrapper.totalSaveAmount = totalAmount;
                }//end saving if
               
                
                // 6. List of iteration objects on the UI for name on select
                if(sceneList.size() > 0) {
                    wrapper.userScenario = sceneList;
                }
                else {
                    emptyList = new List<sObject>();
                    Scenario__c sc = new Scenario__c();
                    emptyList.add(sc);
                    wrapper.userScenario  = (List<Scenario__c>) emptyList;
                }
                
                // call to getRequestData for to send request data
                wrapper.scenarioList = [select Name, Id from Scenario__c where Client_Id__c = :clientId order by LastModifiedDate DESC]; 
                
                //call the build utility in Utility call to build scenario data
                String reqData = FinacastUtility.buildScenarioRequestData2(sceneId, clientId);
                wrapper.response = FinacastUtility.getCalloutResponseContents(requestEndpoint, 'POST', reqData);
                
                System.debug('Scenario Request data: ' + reqData);
                System.debug('Scenario Exists Response Data: ' + wrapper.response);
            }
            
            //case 2. no scenario when first time client scenario page in landed on
            else {
                System.debug('No Scenarios yet');
                emptyList = new List<sObject>();
                
                wrapper.userScenarioIncome = (List<Scenario_Income__c>) emptyList;
                wrapper.totalIncomeAmount = 0; 
                
                wrapper.userScenarioExpense = (List<Scenario_Expense__c>) emptyList;
                wrapper.totalExpenseAmount = 0; 
                
                wrapper.userSceneSave = (List<Scenario_Savings__c>) emptyList; 
                wrapper.totalSaveAmount = 0;
                
                wrapper.userScenarioLoan = (List<Scenario_Debt__c>) emptyList;
                wrapper.totalLoanAmount = 0;
                
				
                Scenario_Goal__c fGoal = new Scenario_Goal__c(Scenario_Target_Amount__c = 0);
                emptyList.add(fGoal);
                wrapper.userScenarioGoal = (List <Scenario_Goal__c>) emptyList;
                wrapper.totalGoalAmount = 0;
               
                emptyList = new List<sObject>();
                Scenario__c s = new Scenario__c(Name='');
                emptyList.add(s);
                wrapper.userScenario = (List<Scenario__c>) emptyList;
                
                wrapper.scenarioList = [select Name, Id from Scenario__c where Client_Id__c = :clientId order by LastModifiedDate DESC];
                system.debug('No Scenario response Wrappr: '+wrapper);
            }//end else
            
        }//end catch
        
        catch(Exception e){  
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }   
        return wrapper;  
    }//end init  
    
     @auraEnabled
    public static void saveNewScenario(String name, String clientId){
        try{
            Account clientAccount = [select name from Account where id = :clientId];
            
            //create Scenario
            Scenario__c scene = new Scenario__c();
            scene.Name = name;
            scene.Client_Id__c = clientId;
            insert scene; 
            
            String sceneId = scene.Id;
            
            //create income
            Scenario_Income__c scIncome = new Scenario_Income__c ();
            scIncome.Client_Id__c = clientId ;
            scIncome.Scenario_Id__c = sceneId;
            scIncome.Name= name + ' Income 1';
            date startDate = date.today();
            date endDate = startDate.addYears(10);
            scIncome.Start_Date__c = startDate;
            scIncome.End_Date__c = endDate;
            scIncome.Amount__c = 40000;
            insert scIncome;
            
            //create expense
            Scenario_Expense__c scExpense = new Scenario_Expense__c ();
            scExpense.Name = name + ' Expense 1';
            scExpense.Client_Id__c = clientId ;
            scExpense.Scenario_Id__c = sceneId;
            scExpense.Start_Date__c = startDate;
            scExpense.End_Date__c = endDate;
            scExpense.Amount__c = 5000; 
            insert scExpense;
            
            //create saving
            Scenario_Savings__c savings = new Scenario_Savings__c();
            savings.Client_Id__c = clientID;
            savings.Scenario__c = sceneId;
            savings.Name = name + ' Saving 1';
            savings.Current_Value__c = 200000;
            savings.APY__c = 6;
            savings.Start_Date__c= startDate;
            savings.End_Date__c = endDate;
            insert Savings;
            //bankAcc.put(sc.Id,savings);
            
            //create debt
            Scenario_Debt__c loan = new Scenario_Debt__c();
            loan.Client_Id__c = clientID;
            loan.Scenario_Id__c = sceneId;                 
            loan.Name = name + ' Loan 1';
            loan.APR__c = 3;
            loan.Current_Value__c = 500000;
            loan.Frequency__c = 'Monthly';
            loan.Start_Date__c = startDate;
            loan.End_Date__c = endDate;
            loan.Payment_Amount__c = 1000;
            insert loan;
            
            //crate goal
            Scenario_Goal__c sGoal = new Scenario_Goal__c();
            sGoal.Scenario_Target_Amount__c = 60000;
      
            sGoal.Scenario_Current_Amount__c = 10000;
            sGoal.Scenario_Monthly_Contribution__c =500;
            sGoal.Name = name + ' Goal 1';
            sGoal.Scenario__c = sceneId;
            //sGoal.Tax_Benefit__c = 'false';
            sGoal.Scenario_Goal_Type__c = 'Education';
            sGoal.Associated_Account__c = savings.Id;
            sGoal.Client_Id__c = clientId;
            sGoal.Scenario_Goal_Priority__c = 'Priority 1 (must have)';
            sGoal.Scenario_Target_Date__c = endDate;
            sGoal.Scenario_Start_Date__c = startDate;
            insert sGoal;

            return;
        }
        catch(exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return;
    }
    
    //Delete records
    @AuraEnabled
    public static List<sObject> deleteRecord (String recId, String sceneId ) {
        List<sObject> recordList = new List<sObject>();
        Id typeId;
        
        Id sId = recId;
        String recType = sId.getSObjectType().getDescribe().getName();
        //delete scenario and related data
        try{
            if(recType == 'scenario__c') {
                Scenario__c sceneDel = [select id from Scenario__c where id = :recId];
                
                List<Scenario_Goal__c> goalDel =[select id from Scenario_Goal__c where Scenario__c = :sceneDel.Id];
                delete goalDel;
                
                List<Scenario_Debt__c> debtDel = [select id from Scenario_Debt__c where  Scenario_Id__c = :sceneDel.Id];
                delete debtDel;
                
                List<Scenario_Savings__c> savingDel = [select id from Scenario_Savings__c where  Scenario__c = :sceneDel.Id];
                delete savingDel;
                
                List<Scenario_Income__c> sceneIncomeList = [select Id, Name, Amount__c from Scenario_Income__c where Scenario_Id__c = :sceneDel.Id]; 
                delete sceneIncomeList;
                
                List<Scenario_Expense__c> sceneExpenseList = [select Id, Name, Amount__c from Scenario_Expense__c where Scenario_Id__c = :sceneDel.Id]; 
                delete sceneExpenseList;
                
                delete sceneDel;
                
                List<Scenario__c> scList = [select id, name from Scenario__c where id = :recId];
                recordList = scList;
            }
            
            // delete scenario goals
            if(recType == 'Scenario_Goal__c') {
                Scenario_Goal__c goalDel = [select id from Scenario_Goal__c where id = :recId];
                delete goalDel;
                
                List<Scenario_Goal__c> goalList = [select Name, Scenario_Start_Date__c,Scenario_Goal_Priority__c,Scenario_Current_Amount__c,Scenario_Monthly_Contribution__c, Associated_Account__c,
                                                   Scenario_Target_Amount__c, 
                                                   Scenario_Target_Date__c from Scenario_Goal__c where Scenario__c = :sceneId ]; 
                recordList = goalList;
            }
            
            //delete scenario loan savings
            
            if(recType == 'Scenario_Debt__c') {
                Scenario_Debt__c debtDel = [select id from Scenario_Debt__c where id = :recId];
                delete debtDel;
                List<Scenario_Debt__c> updatedList = [select Name, Current_Value__c, Payment_Amount__c, APR__c,Frequency__c from Scenario_Debt__c where Scenario_Id__c = :sceneId];
                recordList = updatedList;
            }
            
            if(recType == 'Scenario_Savings__c') {
                Scenario_Savings__c savingDel = [select id from Scenario_Savings__c where id = :recId];
                Scenario_Goal__c gDel = [select id from Scenario_Goal__c where Associated_Account__c = :savingDel.Id];
                if(gDel != NULL)
                    delete gDel;
                
                delete savingDel;
                List<Scenario_Savings__c> updatedList = [select name, Current_Value__c, APY__c from Scenario_Savings__c where Scenario__c = :sceneId];
                recordList = updatedList;
            }
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return recordList;
    }
    //to save the scenario to  Scenario__c object -----> calling js function: onScenarioSaveIcon()
    
    @AuraEnabled
    public static List<sObject> saveRecord( String clientId, String recType, String sceneId, Decimal incomeAmount, Decimal expenseAmount, String recordId) {
        List<sObject> recordList = new List<sObject>();					
        
        try{
            //update scenaro income
            if(recType == 'income save') {
                if(recordId != 'init') {
                    Scenario_Income__c scIncome = [select Amount__c from Scenario_Income__c where id = :recordId];  
                    scIncome.Amount__c = incomeAmount;
                    System.debug('inceome init');
                    upsert scIncome;
                }
                List<Scenario_Income__c> sceneIncomeList = [select Id, Name, Amount__c from Scenario_Income__c where Scenario_Id__c = :sceneId];
                recordList = sceneIncomeList;
            }
            
            //update scenario expense
            if(recType == 'expense save') {
                if(recordId != 'init') {
                    Scenario_Expense__c scExpense = [select Amount__c from Scenario_Expense__c where id = :recordId];
                    system.debug('expense: ' + expenseAmount);
                    scExpense.Amount__c = expenseAmount;
                    upsert scExpense;   
                }
                List<Scenario_Expense__c> sceneExpenseList = [select Id, Name, Amount__c from Scenario_Expense__c where Scenario_Id__c = :sceneId];
                recordList = sceneExpenseList;
            }
            
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return recordList;
    }
    
    public class AmtContriWrapper {
        @AuraEnabled public Decimal currentAmt;
        @AuraEnabled public Decimal monthlyContri;
    }
    
    @AuraEnabled
    public static AmtContriWrapper getAmtContri (String accId, Decimal currentAmt, Date tarDate, Decimal tarAmt) {
        AmtContriWrapper wrapper = new AmtContriWrapper();
        Double iRate = 0;
        try{
            if (accId != null && accId != '')
            {
                Scenario_Savings__c savingAcc = [select Current_Value__c, APY__c, id from Scenario_Savings__c where id = :accId];
                Double bal = savingAcc.Current_Value__c; 
                if(savingAcc.APY__c != null)
                {
                    iRate = savingAcc.APY__c;
                }
                else 
                    iRate = 0; 
                
                list<Scenario_Goal__c> allAssocGoals = [select Associated_Account__c, Scenario_Monthly_Contribution__c, Scenario_Start_Date__c, Scenario_Target_Amount__c 
                                                        from Scenario_Goal__c where Associated_Account__c = :accId];
                
                Double totalEstimated = 0;
                Decimal remainingAmount = 0;
                Decimal growth=0;
                
                for(Scenario_Goal__c relgoal : allAssocGoals ) {
                    totalEstimated = totalEstimated + ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(relgoal.Scenario_Monthly_Contribution__c), relgoal.Scenario_Start_Date__c, date.today(),growth)).setScale(2,RoundingMode.HALF_UP)+ relgoal.Scenario_Target_Amount__c;
                }
                
                remainingAmount = bal - totalEstimated;
                if(remainingAmount < 0)
                {
                    remainingAmount = 0;    
                }
                double curr = Math.ceil( remainingAmount);       
                wrapper.currentAmt = Math.ceil( remainingAmount);
                system.debug('current amt'+wrapper.currentAmt);
                
                if(tarDate != null && tarAmt != null) {
                    Date targetDate = Date.valueOf(tarDate);
                    Decimal currentAmount;
                    if(currentAmt == null) {
                        currentAmount = curr;
                    }
                    else {
                        currentAmount = Double.valueOf(currentAmt);
                    }
                    
                    wrapper.monthlyContri = Math.ceil(getMonthlyContribution(currentAmount, tarAmt, targetDate, iRate ));
                }
                else {
                    wrapper.monthlyContri = 0;
                }
            } 
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return wrapper;
        
    }
    
    //to monthlyContribution called from apex function getAmtContri 
    public static Decimal getMonthlyContribution(Decimal currentAmount, Decimal tarAmt, Date targetDate, Double  iRate ) {
        Integer months = (((targetDate.year())*12)+targetDate.month()) - ((((date.today()).year())*12)+date.today().month());
        
        if(months < 0) {
            months = Math.abs(months);
        }
        Double installment = 0;
        Double growth = (Math.pow((1 + ( iRate / 100)), (1/12)))- 1;
        Decimal monContri;
        system.debug('tarAmt'+tarAmt);
        system.debug('currentAmount'+currentAmount);
        system.debug('months'+months);
        
        If (tarAmt > (currentAmount * (Math.pow((1 + growth),months))))
        { 
            If (growth > 0) {
                installment = ((tarAmt - currentAmount * (Math.pow((1 + growth), months))) * growth) / ((Math.pow((1 + growth), months)) - 1);
            } 
            Else {
                installment = (tarAmt - currentAmount) / months;
            }
            monContri = installment;
        }
        Else {
            monContri = installment;
        }
        
        return Math.ceil(monContri);   
    }
    
    
}
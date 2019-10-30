public class Finacast_ScenarioParentApex {
	
    //reuse the code of FFS Controller but seperate class/ / *Seperation of concerns *
    @auraEnabled
    public static Finacast_FS_ParentApex.WrapperResponse getData(String cid){
        System.debug('client id in parent Scenario: '+ cid);
        return Finacast_FS_ParentApex.getData(cid);
    }
    @auraEnabled
    public static List<Scenario__c> ScenarioData(String clientId){
        list<Scenario__c> ScenarioList = new list<Scenario__c>();
        ScenarioList = [select name from Scenario__c where Client_Id__c = :clientId];
        system.debug('ScenarioList'+ScenarioList);
        return ScenarioList;
    }
    
    @auraEnabled
    public static void deleteScenario(id ScenarioId) {
        
        Scenario__c  ScenarioItem = [Select id from Scenario__c  where id =:ScenarioId];
        delete ScenarioItem;
        
    }
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
            Id recTypeId = Schema.getGlobalDescribe().get('Budget__c').getDescribe().getRecordTypeInfosByName().get('Income Record Type').getRecordTypeId();
            list<Budget__C> incmeList = new list<Budget__c>();
            incmeList = [select name,Amount__c,Yearly_growth__c,Frequency__c,Start_Date__c,End_Date__c,Tax_Rate__c from budget__c where Primary_Owner__c =:clientId and RecordTypeId=:recTypeId ];
            Double TotalAmt = 0;
             Double incomeFrequency = 0;
            for(Budget__c inc: incmeList) {
               
                switch on inc.Frequency__c {
                            when 'Monthly' {
                                incomeFrequency += inc.Amount__c * 1;
                            }	
                            when 'Semi Monthly' {
                                incomeFrequency += inc.Amount__c * 2;
                            }
                            when 'Bi-Weekly' {
                                incomeFrequency +=inc.Amount__c *  2.16;
                            }
                            when 'Weekly' {
                                incomeFrequency +=inc.Amount__c * 4.33;
                            }
            }
               
            }
             system.debug('incomeFrequency'+incomeFrequency);
            Scenario_Income__c scIncome = new Scenario_Income__c ();
            scIncome.Client_Id__c = clientId ;
            scIncome.Scenario_Id__c = sceneId;
            scIncome.Name= name + ' Income 1';
            date startDate = date.today();
            date endDate = startDate.addYears(10);
            scIncome.Start_Date__c = startDate;
            scIncome.End_Date__c = endDate;
            scIncome.Amount__c = incomeFrequency;
            insert scIncome;
            
            //create expense
              Id recTypeId1 = Schema.getGlobalDescribe().get('Budget__c').getDescribe().getRecordTypeInfosByName().get('Expense Record Type').getRecordTypeId();
            list<Budget__C> expList = new list<Budget__c>();
            expList = [select name,Amount__c,Yearly_growth__c,Frequency__c,Start_Date__c,End_Date__c,Tax_Rate__c from budget__c where Primary_Owner__c =:clientId and RecordTypeId=:recTypeId1 ];
          
             Double expenseFrequency = 0;
            for(Budget__c inc: expList) {
               
               
                if(inc.Amount__c != Null){
                    expenseFrequency += inc.Amount__c;
                }
               
            }
             system.debug('expenseFrequency'+expenseFrequency);
            Scenario_Expense__c scExpense = new Scenario_Expense__c ();
            scExpense.Name = name + ' Expense 1';
            scExpense.Client_Id__c = clientId ;
            scExpense.Scenario_Id__c = sceneId;
            scExpense.Start_Date__c = startDate;
            scExpense.End_Date__c = endDate;
            scExpense.Amount__c = expenseFrequency; 
            insert scExpense;
            
            //create saving
            Id recTypeIdsaving = Schema.getGlobalDescribe().get('FinServ__FinancialAccount__c').getDescribe().getRecordTypeInfosByName().get('Savings Account').getRecordTypeId();
            list<FinServ__FinancialAccount__c> Facclist = new list<FinServ__FinancialAccount__c>();
            
            Facclist= [select name,Account_Type__c,FinServ__APY__c,FinServ__Balance__c,FinServ__PrimaryOwner__c	 from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:clientId AND RecordTypeId =:recTypeIdsaving];
            list<Scenario_Savings__c> savAcc = new list<Scenario_Savings__c>();
                Scenario_Savings__c savings = new Scenario_Savings__c();
            for(FinServ__FinancialAccount__c savingacc :Facclist ){
              savings = new Scenario_Savings__c();
            savings.Client_Id__c = savingacc.FinServ__PrimaryOwner__c;
            savings.Scenario__c = sceneId;
            savings.Name =  savingacc.name;
            savings.Current_Value__c = savingacc.FinServ__Balance__c;
            savings.APY__c = savingacc.FinServ__APY__c;
           // savings.Start_Date__c= startDate;
           // savings.End_Date__c = endDate;
            savAcc.add(savings);
            }
            
            insert savAcc;
            
            //create debt
            Id recTypeIdCredit = Schema.getGlobalDescribe().get('FinServ__FinancialAccount__c').getDescribe().getRecordTypeInfosByName().get('Loan Account').getRecordTypeId();
            list<FinServ__FinancialAccount__c> creditList = new list<FinServ__FinancialAccount__c>();           
            creditList= [select name,FinServ__LoanAmount__c,FinServ__APY__c,FinServ__PaymentFrequency__c,FinServ__PrimaryOwner__c,FinServ__PaymentAmount__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:clientId AND RecordTypeId =:recTypeIdCredit];
            list<Scenario_Debt__c> sceDebt = new list<Scenario_Debt__c>();
            
            
            for(FinServ__FinancialAccount__c credit :creditList ){
                Scenario_Debt__c loan = new Scenario_Debt__c();
                loan.Client_Id__c = credit.FinServ__PrimaryOwner__c;
                loan.Scenario_Id__c = sceneId;                 
                loan.Name = credit.name ;
                loan.APR__c = credit.FinServ__APY__c;
                loan.Current_Value__c = credit.FinServ__LoanAmount__c;
                loan.Frequency__c = credit.FinServ__PaymentFrequency__c;
           //   loan.Start_Date__c = startDate;
              //  loan.End_Date__c = endDate;
                loan.Payment_Amount__c = credit.FinServ__PaymentAmount__c;
                sceDebt.add(loan);
            }
           
            insert sceDebt;
            
            //crate goal
            List<FinServ__FinancialGoal__c> goalRecord = new List<FinServ__FinancialGoal__c>();
            goalRecord = [Select id,FinServ__PrimaryOwner__c ,Goal_Priority__c, Name, Start_Value__c , Required_Monthly_Saving__c ,Associated_Account__c,Start_Date__c,FinServ__TargetDate__c,FinServ__TargetValue__c,FinServ__ActualValue__c from FinServ__FinancialGoal__c where FinServ__PrimaryOwner__c=:clientId];
            list<Scenario_Goal__c> goalList = new list<Scenario_Goal__c>();

            for(FinServ__FinancialGoal__c goals :goalRecord ){
                Scenario_Goal__c sGoal = new Scenario_Goal__c();
            sGoal.Scenario_Target_Amount__c = goals.FinServ__TargetValue__c;
      
            sGoal.Scenario_Current_Amount__c = goals.Start_Value__c;
            sGoal.Scenario_Monthly_Contribution__c =goals.Required_Monthly_Saving__c;
            sGoal.Name = goals.name ;
            sGoal.Scenario__c = sceneId;
            //sGoal.Tax_Benefit__c = 'false';
            sGoal.Scenario_Goal_Type__c = 'Car';
            sGoal.Associated_Account__c = savings.Id;
            sGoal.Client_Id__c = clientId;
            sGoal.Scenario_Goal_Priority__c = goals.Goal_Priority__c;
            sGoal.Scenario_Target_Date__c = goals.FinServ__TargetDate__c;
            sGoal.Scenario_Start_Date__c = goals.Start_Date__c;
          goalList.add(sGoal) ;
            }            
            insert goalList;
		system.debug('goalList'+goalList);
            return;
        }
        catch(exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return;
    }
    
}
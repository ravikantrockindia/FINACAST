@istest
public class NewScenarioApexTest {
 
    @istest
    public static void TestUtility() {
        Account ac = new Account();
        ac.name = 'Test';
        ac.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        insert ac;
        
        Account hac = new Account();
        hac.name = 'Test2';
        hac.RecordTypeId =FinacastUtility.getRecordTypeId('Account' , 'IndustriesHousehold');
        //hac.RecordTypeId =Schema.SObjectType.Account.getRecordTypeInfosByName().get('IndustriesHousehold').getRecordTypeId();
        insert hac;
        
        AccountContactRelation acr = new AccountContactRelation();
        acr.accountid = hac.id;
        acr.contactid = [select id from contact where accountid =: ac.id].Id;
        acr.IsActive = true;
        acr.FinServ__PrimaryGroup__c = true;
        acr.FinServ__Rollups__c = 'All';
        acr.FinServ__Primary__c = true;
        insert acr;
        
        Scenario__c sc=new Scenario__c();
        sc.Client_Id__c=ac.Id;
        sc.Name = 'name';
        insert sc;
 
        Scenario_Expense__c scExpense = new Scenario_Expense__c ();
        scExpense.Name = 'Expense 1';
        scExpense.Client_Id__c = ac.id ;
        scExpense.Scenario_Id__c = sc.id;
        scExpense.Start_Date__c = system.today();
        scExpense.End_Date__c = system.today();
        //scExpense.RecordTypeId  = expenseRecId;
        scExpense.Amount__c = 200; 
        insert scExpense;
        
        Scenario_Income__c scIncome = new Scenario_Income__c ();
        scIncome.Client_Id__c = ac.id ;
        scIncome.Scenario_Id__c = sc.id;
        scIncome.Name= 'Income 1';
        //scIncome.RecordTypeId = incomeRecId;
        scIncome.Start_Date__c = system.today();
        scIncome.End_Date__c = system.today();
        scIncome.Amount__c = 300;
        insert scIncome;
        List<Scenario_Income__c> li=new List<Scenario_Income__c>();
        li.add(scIncome);
        
        Scenario_Income__c scIncome2 = new Scenario_Income__c ();
        scIncome2.Client_Id__c = hac.id ;
        scIncome2.Scenario_Id__c = sc.id;
        scIncome2.Name= 'Income 2';
        insert scIncome2;
        
        Scenario_Savings__c sceneSaveList=new Scenario_Savings__c();
        sceneSaveList.Name='sceneSaveList 1';
        sceneSaveList.Current_Value__c=400;
        sceneSaveList.APY__c=2.0;
        sceneSaveList.Scenario__c=sc.Id;
        
        insert sceneSaveList;
        
         Scenario_Savings__c savings = new Scenario_Savings__c();
            savings.Client_Id__c = ac.id;
            savings.Scenario__c = sc.id;
            savings.Name = 'Saving 1';
            savings.Current_Value__c = 200000;
            savings.APY__c = 6;
            savings.Start_Date__c= System.today();
            savings.End_Date__c =System.today();
            insert Savings;
        
        Scenario_Goal__c scGoal=new Scenario_Goal__c();
        scGoal.Client_Id__c=ac.Id;
        scGoal.Name='Goal 1';
        scGoal.Scenario_Target_Amount__c=100;
        scGoal.Scenario__c=sc.Id;
        scGoal.Scenario_Monthly_Contribution__c=500;
        scGoal.Scenario_Start_Date__c=system.today();
        scGoal.Scenario_Target_Amount__c=50000;
        scGoal.Associated_Account__c=savings.Id;
        insert scGoal;
        
        Scenario_Debt__c scLoan=new Scenario_Debt__c();
        scLoan.Client_Id__c=ac.Id;
        scLoan.Name='Loan 1';
        scLoan.Current_Value__c=200;
        scLoan.Payment_Amount__c=100;
        scLoan.APR__c=2.0;
        scLoan.Frequency__c='Monthly';
        scLoan.Scenario_Id__c=sc.Id;
        insert scLoan;
        
        NewScenarioApex.getAmtContri(Savings.id, 250, system.today(), 300);
        NewScenarioApex.getAmtContri(Savings.id, null, system.today(), 300);
        NewScenarioApex.getMonthlyContribution(252, 2, system.today(), 1);        
        NewScenarioApex.getUserScenarios(ac.id, sc.id);  
		 NewScenarioApex.deleteRecord(ac.id, sc.id);        
      //  NewScenarioApex.getUserScenarios(hac.id, sc.id);
        //NewScenarioApex.getUserScenarios(ac.id, 'init');
       // NewScenarioApex.getUserScenarios(hac.id, 'init');  
       NewScenarioApex.ScenarioData(ac.Id);      
        NewScenarioApex.saveRecord( ac.Id, 'scenario', sc.Id, 1200.00, 1000,scIncome.Id);
        NewScenarioApex.saveRecord( ac.Id, 'expense save', sc.Id, 1200.00, 1000,scIncome.Id);
       // NewScenarioApex.saveNewScenario('Ravi', ac.Id);
        
        System.assert(ac != null);
    }
    
     
    
}
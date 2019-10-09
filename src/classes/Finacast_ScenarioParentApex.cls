/********* Developer Name: Aditya Kaushal
* updated Date: July 5' 19
* provided new implementation *********/

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
    
}
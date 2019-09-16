@isTest
public class GoalPerformanceAndMonteCarloTest {
   @testsetup
    public static void data(){
        String namespace= NamespaceUtility.returnNamespace();
               
        
        Account ac = new Account();
        ac.name = 'Test3';
        ac.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        insert ac;
        
     
        FinServ__FinancialAccount__c savings1 = new FinServ__FinancialAccount__c();
        savings1.FinServ__PrimaryOwner__c = ac.Id;
        savings1.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c', 'SavingsAccount');
        savings1.Name = 'Test Savings 1';
        savings1.FinServ__Balance__c = 0;
        savings1.FinServ__APY__c = 3;   
        savings1.FinServ__LoanEndDate__c = Date.today();
        savings1.FinServ__FinancialAccountType__c = 'Savings';
        savings1.Account_Type__c = 'Savings';
        savings1.Max_yearly_tax_deduction_allowed__c =10;
        insert savings1;
        system.debug('typefin1'+savings1.RecordTypeId);
        
  
        
        FinServ__FinancialGoal__c goals1 = new  FinServ__FinancialGoal__c();
        goals1.FinServ__PrimaryOwner__c = ac.Id;
        goals1.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialGoal__c' , 'CarRecordType');
        goals1.Name = 'Test Goal 1';
        goals1.FinServ__TargetValue__c = 10000;
        goals1.FinServ__TargetDate__c = Date.today()+900;
        goals1.Start_Value__c = 2000;
        goals1.Start_Date__c = system.today();
        goals1.Goal_Priority__c = '1';
        goals1.Required_Monthly_Saving__c = 2000;
        goals1.Associated_Account__c = savings1.Id;
        insert goals1;
        
        
       
    }
    @isTest
    public static void getGoalsTest(){
        String clientId=[Select Id from Account where name='Test3' limit 1].Id;
       list<GoalPerformanceAndMonteCarlo.FinGoalWrapperClass> l= GoalPerformanceAndMonteCarlo.getGoals(clientId,false,'');
        System.assertEquals(1, l.size());
        
    }
    
     @isTest
    public static void getGoalsTest2(){
        String clientId=[Select Id from Account where name='Test3' limit 1].Id;
       list<GoalPerformanceAndMonteCarlo.FinGoalWrapperClass> l= GoalPerformanceAndMonteCarlo.getGoals(clientId,true,'Jan,2019');
     //   System.assertEquals(1, l.size());
        
    }
     @isTest
    public static void getGoalDetailTest(){
        String goalId=[Select Id from FinServ__FinancialGoal__c where name='Test Goal 1' limit 1].Id;
       GoalPerformanceAndMonteCarlo.FinGoalWrapperClass l= GoalPerformanceAndMonteCarlo.getGoalDetail(goalId);
        
    }
    
}
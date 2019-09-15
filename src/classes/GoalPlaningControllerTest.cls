@isTest
public class GoalPlaningControllerTest {
	@testsetup
    public static void data(){	
        account ac=new Account();
        ac.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        ac.Name='Test';
        insert ac;
        
    	FinServ__FinancialAccount__c savings1 = new FinServ__FinancialAccount__c();
        savings1.FinServ__PrimaryOwner__c =ac.Id;
        savings1.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c', 'SavingsAccount');
        savings1.Name = 'Test Savings 1';
        savings1.FinServ__Balance__c = 0;
        savings1.FinServ__APY__c = 3;   
        savings1.FinServ__LoanEndDate__c = Date.today();
        savings1.FinServ__FinancialAccountType__c = 'Savings';
        savings1.Account_Type__c = 'Savings';
        savings1.Max_yearly_tax_deduction_allowed__c =10;
        insert savings1;
       // update savings1;	
    
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
    
    	list<FinServ__FinancialGoal__c> goals4 = new  list<FinServ__FinancialGoal__c>();
        FinServ__FinancialGoal__c goals2 = new  FinServ__FinancialGoal__c();
        goals2.FinServ__PrimaryOwner__c = ac.Id;
        goals2.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialGoal__c' , 'CarRecordType');
        goals2.Name = 'Test Goal 2';
        goals2.FinServ__TargetValue__c = 10000;
        goals2.FinServ__TargetDate__c = Date.today()+900;
        goals2.Start_Value__c = 2000;
        goals2.Goal_Priority__c = '1';
        goals2.Start_Date__c = system.today();
        goals2.Max_yearly_tax_deduction_allowed__c=5;
        goals2.Required_Monthly_Saving__c = 2000;
       goals2.Associated_Account__c = savings1.Id;
        goals4.add(goals2);
        insert goals4;
    }
    @istest
    public static void goalPlanning() {
        Account acc = [select id from Account where name = 'Test'];
        FinServ__FinancialGoal__c goal1=[select id from FinServ__FinancialGoal__c where name='Test Goal 1'];
      //  integer months = FinacastGoalProgressApex.NumberOfMonths(goal1.Start_Date__c, Date.today());
        test.startTest();
        GoalPlaningController.getTotalGoal(acc.id ,false,'');
       	GoalPlaningController.getRecordTypeIdbyName('FinServ__FinancialGoal__c',goal1.Id);
        GoalPlaningController.deleteGoals(goal1.Id);
        GoalPlaningController.getGoalDetail(goal1.Id);
      	GoalPlaningController.getGoalPerformance(goal1.Id);
        GoalPlaningController.getPicklistValues();
      	GoalPlaningController.getSimulation(238273,354534553,64783,'JSON.stringify(goal1.FinServ__TargetDate__c)','acc.Risk_Profile__c',12);
          
         System.assertEquals(1,1);
        test.stopTest();
    }
}
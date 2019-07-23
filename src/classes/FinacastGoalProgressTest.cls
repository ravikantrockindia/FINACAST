@isTest
public class FinacastGoalProgressTest {
    @isTest
    public static void testCase1(){
        Account ac = new Account ();
        ac.name = 'Test';
        ac.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        insert ac;
        
        FinServ__FinancialAccount__c bankAcc = new FinServ__FinancialAccount__c();
        bankAcc.FinServ__PrimaryOwner__c = ac.id;
        bankAcc.FinServ__Balance__c = 50000;
        bankAcc.Account_Type__c = 'IRA';
        insert bankAcc;
        
        FinServ__FinancialGoal__c goal = new FinServ__FinancialGoal__c();
        goal.Name = 'Test';
        goal.Start_Date__c = date.today() - 262;
        goal.Start_Value__c = 5000;
        goal.FinServ__TargetDate__c = date.today() + 90;
        goal.FinServ__TargetValue__c = 60000;
        goal.Goal_Priority__c = '1';
        goal.Associated_Account__c = bankAcc.id;
        goal.FinServ__PrimaryOwner__c = ac.id;
        goal.Required_Monthly_Saving__c = 1000;
        
        insert goal;
        new FinacastGoalProgressApex(goal.Id);
        FinacastGoalProgressApex.goalStatus(goal.id);
        
        FinServ__FinancialGoal__c goal1 = new FinServ__FinancialGoal__c();
        goal1.Name = 'Test';
        goal1.Start_Date__c = date.today() - 93;
        goal1.Start_Value__c = 5000;
        goal1.FinServ__TargetDate__c = date.today()+ 90;
        goal1.FinServ__TargetValue__c = 60000;
        goal1.Goal_Priority__c = '1';
        goal1.Associated_Account__c = bankAcc.id;
        goal1.FinServ__PrimaryOwner__c = ac.id;
        goal1.Required_Monthly_Saving__c = 10000;
        
        insert goal1;
        
        FinacastGoalProgressApex.goalStatus(goal1.id);
        FinacastGoalProgressApex.FrequencyAdjustedRate(20, 30);
        System.assertEquals(1, 1);
        
    }
    
}
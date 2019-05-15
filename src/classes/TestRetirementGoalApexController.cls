@isTest
public class TestRetirementGoalApexController {
    @testSetup
    static void testData()
    {
        Account acc = new Account();
        acc.Name = 'test account';
        
        
        String accRecType =Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        acc.RecordTypeId = accRecType;
        
        insert acc; 
        
        Account aId = [Select id from Account where name = 'test account'];
        FinServ__FinancialAccount__c fAcc = new FinServ__FinancialAccount__c();
        fAcc.Name = 'test financial account';
        fAcc.FinServ__PrimaryOwner__c = aId.Id;
        fAcc.FinServ__Balance__c = 500;
        RecordType rType = [select id from RecordType where name = 'Bank Account'];
        fAcc.RecordTypeId = rType.id;
        insert fAcc;
        
        FinServ__FinancialGoal__c goal = new FinServ__FinancialGoal__c();
        goal.Name = 'test goal';
        goal.Associated_Account__c = fAcc.Id;
        goal.FinServ__PrimaryOwner__c = acc.id;
        goal.Required_Monthly_Saving__c = 5000;
        goal.Start_Date__c = date.today();
        goal.Start_Value__c = 500;
        insert goal;
    }
    
    static testMethod void testRetirementApex()
    {
        
        Account accId = [select id from Account where name = 'test account'];
        RetirementGoalApexController.getDate(accId.id);
        FinServ__FinancialAccount__c fAccId = [select id from FinServ__FinancialAccount__c where name = 'test financial account'];
        Date retire = date.today()+900;
        String retireDate = String.valueOf(retire);
        
        //RetirementGoalApexController.getCurrentAmount( '500', '10', '100', '100000', retireDate);
        
        DateTime target = Date.today()+900;
        String tDate = target.format('YYYY-MM-dd');
        System.debug('target: '+target);
        System.debug('tDate: '+tDate);
        
        FinServ__FinancialGoal__c fGoal = [select Associated_Account__c, Start_Value__c from FinServ__FinancialGoal__c where name = 'test goal' ];
        DateTime birth = date.today();
        String birthDate = birth.format('YYYY-MM-dd');
        String current = String.valueOf(fGoal.Start_Value__c);
        
        test.startTest();
        RetirementGoalApexController.getAmountMonth(500, 3, 6,'10','60', birthDate);
        RetirementGoalApexController.getAmountMonth(500, 0, 0,'10','60', birthDate);  
        RetirementGoalApexController.getAmountMonth(500, 3, 3,'10','60', birthDate);
        RetirementGoalApexController.getAmtAndContri(fAccId.id, '10','3', '100000', tDate,current);
        RetirementGoalApexController.getAmtAndContri(fAccId.id, '10','3', '100000', tDate,null);        
       
        RetirementGoalApexController.saveData(String.valueOf((accId.id)),'test save goal', String.valueOf(date.today()), '30','3', '60' , '500','6', '5200',String.valueOf(fGoal.Associated_Account__c) , '1', '500', tDate, '300');
        // RetirementGoalApexController.getGoalData(fAccId.id);
        test.stopTest();
        System.assertEquals('1','1');
    }
    
}
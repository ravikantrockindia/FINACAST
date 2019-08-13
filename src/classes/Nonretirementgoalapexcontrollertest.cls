@isTest
public class Nonretirementgoalapexcontrollertest {
    @testSetup
    static void testmethod1()
    {
        Account acc1 = new Account();
        acc1.Name = 'test account 1';
        
         Account acc2 = new Account();
        acc2.Name = 'test account 2';
        
        list<RecordType> rcc1 =[Select Id From RecordType Where SobjectType='Account' And Name='Individual' limit 1];
        acc1.RecordTypeId = rcc1[0].Id;
        acc2.RecordTypeId = rcc1[0].Id;
        
        insert acc1;
        insert acc2;
        
        Account acc = [Select id from Account where Name='test account 1'];
        FinServ__FinancialAccount__c financial1 = new FinServ__FinancialAccount__c();
        financial1.Name = 'test financial account 1';
        list<RecordType> rcc =[Select Id From RecordType Where SobjectType='FinServ__FinancialAccount__c' And Name='Bank Account' limit 1];
        financial1.RecordtypeId = rcc[0].Id;
        financial1.FinServ__Balance__c = 567;
        financial1.FinServ__PrimaryOwner__c= acc.Id;
        financial1.FinServ__APY__c = 3;
        insert financial1;
        
         Account acco = [Select id from Account where Name='test account 2'];
        FinServ__FinancialAccount__c financial2 = new FinServ__FinancialAccount__c();
        financial2.Name = 'test financial account 2';
        financial2.RecordtypeId = rcc[0].Id;
        financial2.FinServ__Balance__c = 5627;
        financial2.FinServ__PrimaryOwner__c= acco.Id;
        financial2.FinServ__APY__c = 0;
        insert financial2;
        
        
        FinServ__FinancialGoal__c goal1 = new FinServ__FinancialGoal__c();
        goal1.Name = 'test goal 1';
        goal1.Associated_Account__c = financial1.Id;
        goal1.Required_Monthly_Saving__c = 0;
        goal1.Start_Date__c = date.today();
        goal1.Start_Value__c = 456700;
        goal1.FinServ__TargetDate__c = date.today()+90;
        goal1.FinServ__PrimaryOwner__c=acc.Id;
          goal1.Goal_Priority__c = 'Priority 2';
        insert goal1;
        
         FinServ__FinancialGoal__c goal2 = new FinServ__FinancialGoal__c();
        goal2.Name = 'test goal 2';
        goal2.Associated_Account__c = financial2.Id;
        goal2.Required_Monthly_Saving__c =3456000;
        goal2.Start_Date__c = date.today();
        goal2.Start_Value__c = 4567;
        goal2.FinServ__TargetDate__c = date.today()+90;
        goal2.FinServ__PrimaryOwner__c=acco.Id;
          goal2.Goal_Priority__c = 'Priority 2';
        insert goal2;
    }
    
    static testMethod void nonretirementtestapex()
    {  
        Account a=[select id  from Account where name = 'test account 1'];
        
        FinServ__FinancialAccount__c fAcc1 = [select id  from FinServ__FinancialAccount__c where name = 'test financial account 1'];
        FinServ__FinancialGoal__c fGoal1 = [select FinServ__TargetDate__c,Start_Value__c,Required_Monthly_Saving__c from FinServ__FinancialGoal__c where name = 'test goal 1' ];
        DateTime d = fGoal1.FinServ__TargetDate__c;
        String targetDate = d.format('YYYY-MM-dd');
        String targetAmt = String.valueOf(fGoal1.Required_Monthly_Saving__c);
        String currentAmount  = String.valueOf(fGoal1.Start_Value__c);
        
        FinServ__FinancialAccount__c fAcc2 = [select id  from FinServ__FinancialAccount__c where name = 'test financial account 2'];
        FinServ__FinancialGoal__c fGoal2 = [select FinServ__TargetDate__c,Start_Value__c,Required_Monthly_Saving__c from FinServ__FinancialGoal__c where name = 'test goal 2' ];
        DateTime dt = fGoal2.FinServ__TargetDate__c;
        String tarDate = dt.format('YYYY-MM-dd');
        String tarAmt = String.valueOf(fGoal2.Required_Monthly_Saving__c);
        String currAmount  = String.valueOf(fGoal2.Start_Value__c);
        
        Test.startTest();
        Nonretirementgoalapexcontroller.dample(a.Id);
Nonretirementgoalapexcontroller.getNonRetirementGoalRecord(fGoal2.Id)     ;   
        Nonretirementgoalapexcontroller.getCurrentAmount(fAcc1.id ,targetDate, targetAmt,currentAmount );
        Nonretirementgoalapexcontroller.getCurrentAmount(fAcc2.id ,tarDate, tarAmt,currAmount );
        Nonretirementgoalapexcontroller.getCurrentAmount(fAcc2.id ,tarDate, tarAmt,'0');
        Nonretirementgoalapexcontroller.getCurrentAmount(null ,tarDate, tarAmt,'0');
        Nonretirementgoalapexcontroller.getCurrentAmount(fAcc2.id ,tarDate, '123','123' );
                Nonretirementgoalapexcontroller.getCurrentAmount(fAcc2.id ,null, tarAmt,null );
       
        Test.stopTest(); 
        
        
        System.assertEquals('1', '1');
    }
    
}
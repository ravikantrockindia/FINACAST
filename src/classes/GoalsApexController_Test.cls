@isTest(seeAlldata=True)
public class GoalsApexController_Test {
    @isTest
    public static void AddGoalsapex(){
        
        Account acc1 = new Account();
        acc1.Name= 'Test Account1';  
        acc1.OwnerId = UserInfo.getUserId();
        
        list<RecordType> rcc1 =[Select Id From RecordType Where SobjectType='Account' And Name='Individual' limit 1];
        if(rcc1.size()>0){
            acc1.RecordTypeId = rcc1[0].Id;
        }
        insert acc1;       
        
        
        FinServ__FinancialAccount__c financial1 = new FinServ__FinancialAccount__c();
        financial1.Name = 'Test Financial Account 1';
        //list<RecordType> rcc =[Select Id From RecordType Where SobjectType='FinServ__FinancialAccount__c' And Name='Loan Account' limit 1];
        //financial1.RecordtypeId = rcc[0].Id;
        financial1.FinServ__Balance__c = 4596;
        financial1.FinServ__PrimaryOwner__c= acc1.Id;
        financial1.FinServ__APY__c = 4;
        insert financial1;
        
        
        list<FinServ__FinancialGoal__c> Flist = new list<FinServ__FinancialGoal__c>();
        FinServ__FinancialGoal__c goal1 = new FinServ__FinancialGoal__c();
        goal1.Name = 'test goal 1';
        goal1.Required_Monthly_Saving__c = 5000;
        goal1.Associated_Account__c =financial1.id;
        goal1.Current_Goal_Amount__c = financial1.FinServ__Balance__c;
        goal1.Start_Date__c = System.today();
        goal1.Start_Value__c = 456;
        //goal1.Goal_Priority__c = 'Priority 2';
     
        goal1.FinServ__TargetDate__c = System.today()+90;
        goal1.FinServ__PrimaryOwner__c=acc1.Id;
        goal1.Goal_Priority__c = 'Priority 2';
        Flist.add(goal1);
        insert goal1;
        
        Client_Adviser_Configuration__c cAdvisor = new Client_Adviser_Configuration__c();
        cAdvisor.Client_Id__c = acc1.id ;
        insert cAdvisor ;
        
        
        
        
        //FinServ__FinancialAccount__c fAcc1 = [select id  from FinServ__FinancialAccount__c where name = 'Test Financial Account 1'];
        FinServ__FinancialGoal__c fGoal1 = [select id, FinServ__TargetDate__c,Start_Value__c,Required_Monthly_Saving__c ,FinServ__PrimaryOwner__c  from FinServ__FinancialGoal__c where name = 'test goal 1' ];
        GoalsApexController.deleteGoals(goal1.id);
        GoalsApexController.getClientGoals(acc1.id);
        GoalsApexController.getGoals() ;
        GoalsApexController.NumberOfMonths(system.today(), system.today());
        GoalsApexController.curentgoalestimation(500, system.today(), system.today());
        GoalsApexController.goalstatus = 56897;
        GoalsApexController.totalEstimated=555;
        //GoalsApexController.getCurrentAmount(goal1);
                
       
        BankAccountListApexController.getBank();
        BankAccountListApexController.getClientBank(acc1.id);
        BankAccountListApexController.deleteBankAccount(financial1.id);
        BankAccountListApexController.editData(financial1.id, financial1.id, 'facc', '7623872171', 'test', 345, 'abc@mirketa.com');
        
        GoalPerformanceApex.getGoalData(goal1.id);
        // GoalPerformanceApex.WrapperClass result = GoalPerformanceApex.getGoalData(fGoal1.id);
        //GoalsApexController.getGoals();
        // GoalsApexController.getClientGoals(acc1.id);
    } 
}
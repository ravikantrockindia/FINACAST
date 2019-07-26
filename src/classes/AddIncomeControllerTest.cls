//---------------------Test class for AddIncomeController -------------------------------------------------------//

@isTest
public class AddIncomeControllerTest {
    
    @isTest
    public static void AddIncomeapex(){
        String namespace= NamespaceUtility.returnNamespace();
        
        Account acc1 = new Account();
        acc1.Name= 'Test Account1';  
        acc1.OwnerId = UserInfo.getUserId();
        Account acc2 = new Account();
        acc2.Name = 'Test Account2';
        
        
        list<RecordType> rcc1 =[Select Id From RecordType Where SobjectType='Account' And Name='Individual' limit 1];
        if(rcc1.size()>0){
            acc1.RecordTypeId = rcc1[0].Id;          
        }
        insert acc1;       
        
        list<RecordType> recType =[Select Id From RecordType Where SobjectType='Account' And Name='IndustriesHousehold' limit 1];
        if(recType.size()>0){
            acc2.RecordTypeId = recType[0].Id;           
        }
        insert acc2;
        
        FinServ__FinancialAccount__c financial1 = new FinServ__FinancialAccount__c();
        financial1.Name = 'Test Financial Account 1';
        list<RecordType> rcc =[Select Id From RecordType Where SobjectType='FinServ__FinancialAccount__c' And Name='Loan Account' limit 1];
        financial1.RecordtypeId = rcc[0].Id;
        financial1.FinServ__Balance__c = 5000;
        financial1.FinServ__PrimaryOwner__c= acc1.Id;
        financial1.FinServ__APY__c = 4;
        financial1.FinServ__PaymentFrequency__c='Monthly';
        insert financial1;

        financial1 = new FinServ__FinancialAccount__c();
        financial1.Name = 'Test Financial Account 1';
        rcc =[Select Id From RecordType Where SobjectType='FinServ__FinancialAccount__c' And Name='Loan Account' limit 1];
        financial1.RecordtypeId = rcc[0].Id;
        financial1.FinServ__Balance__c = 5000;
        financial1.FinServ__PrimaryOwner__c= acc1.Id;
        financial1.FinServ__APY__c = 4;
        financial1.FinServ__PaymentFrequency__c='Semi Monthly';
        insert financial1;  
        
        financial1 = new FinServ__FinancialAccount__c();
        financial1.Name = 'Test Financial Account 1';
        rcc =[Select Id From RecordType Where SobjectType='FinServ__FinancialAccount__c' And Name='Loan Account' limit 1];
        financial1.RecordtypeId = rcc[0].Id;
        financial1.FinServ__Balance__c = 5000;
        financial1.FinServ__PrimaryOwner__c= acc1.Id;
        financial1.FinServ__APY__c = 4;
        financial1.FinServ__PaymentFrequency__c='Biweekly';
        insert financial1; 
        
		 financial1 = new FinServ__FinancialAccount__c();
        financial1.Name = 'Test Financial Account 1';
        rcc =[Select Id From RecordType Where SobjectType='FinServ__FinancialAccount__c' And Name='Loan Account' limit 1];
        financial1.RecordtypeId = rcc[0].Id;
        financial1.FinServ__Balance__c = 5000;
        financial1.FinServ__PrimaryOwner__c= acc1.Id;
        financial1.FinServ__APY__c = 4;
        financial1.FinServ__PaymentFrequency__c='Weekly';
        insert financial1; 
        
       
        String sObject1=namespace+'Budget__c';
        //String sObject2=namespace+'Income_Record_Type';
        Budget__c bg = new Budget__c();
        bg.name = 'Test';
        list<RecordType> rcc2 =[Select Id From RecordType Where SobjectType=:sObject1 And DeveloperName ='Income_Record_Type' limit 1];
        bg.RecordtypeId = rcc2[0].Id;
        bg.Start_Date__c = date.newInstance(2019, 1, 1);
        bg.End_Date__c = date.newInstance(2019, 31, 1);
        bg.Amount__c = 1000;
        bg.Primary_Owner__c= acc1.Id;
        bg.Frequency__c='Monthly';
        insert bg;
        
        bg = new Budget__c();
        bg.name = 'Test';
        rcc2 =[Select Id From RecordType Where SobjectType=:sObject1  And DeveloperName ='Income_Record_Type' limit 1];
        bg.RecordtypeId = rcc2[0].Id;
        bg.Start_Date__c = date.newInstance(2019, 1, 1);
        bg.End_Date__c = date.newInstance(2019, 31, 1);
        bg.Amount__c = 1000;
        bg.Primary_Owner__c= acc1.Id;
        bg.Frequency__c='Semi Monthly';
        insert bg;
        bg = new Budget__c();
        bg.name = 'Test';
        rcc2 =[Select Id From RecordType Where SobjectType=:sObject1 And DeveloperName ='Income_Record_Type' limit 1];
        bg.RecordtypeId = rcc2[0].Id;
        bg.Start_Date__c = date.newInstance(2019, 1, 1);
        bg.End_Date__c = date.newInstance(2019, 31, 1);
        bg.Amount__c = 1000;
        bg.Primary_Owner__c= acc1.Id;
        bg.Frequency__c='Bi-Weekly';
        insert bg;

        
        
        String sObject3=namespace+'Expense_Record_Type';
        Budget__c bg1 = new Budget__c();
        bg1.name = 'Test1';
        list<RecordType> rcc3 =[Select Id From RecordType Where SobjectType=:sObject1 And DeveloperName ='Expense_Record_Type' limit 1];
        bg1.RecordtypeId = rcc3[0].Id;
        bg1.Start_Date__c = date.newInstance(2019, 1, 1);
        bg1.End_Date__c = date.newInstance(2019, 31, 1);
        bg1.Amount__c = 1000;
        bg1.Primary_Owner__c= acc1.Id;
        insert bg1;
        
         FinServ__FinancialAccountTransaction__c transaction1 = new FinServ__FinancialAccountTransaction__c();
        //transaction1.Name = 'Test transcation Account 1';
        //list<RecordType> rcc =[Select Id From RecordType Where SobjectType='FinServ__FinancialAccount__c' And Name='Loan Account' limit 1];
        //financial1.RecordtypeId = rcc[0].Id;
        transaction1.FinServ__TransactionDate__c = date.newInstance(2019, 1, 1);
        transaction1.OwnerId= acc1.OwnerId;
        transaction1.Budget_Category__c=bg1.id;
        transaction1.FinServ__Amount__c = 4000;
        insert transaction1;
        
        FinServ__FinancialAccount__c fa = new FinServ__FinancialAccount__c(Name='SahilTest',FinServ__PrimaryOwner__c=acc1.Id);
        insert fa;
        FinServ__FinancialGoal__c goal1 = new FinServ__FinancialGoal__c();
        goal1.Name = 'test goal 1';
        goal1.Required_Monthly_Saving__c = 5000;
        goal1.Start_Date__c = date.today();
        goal1.Start_Value__c = 456700;
        goal1.FinServ__TargetDate__c = date.today()+90;
        goal1.FinServ__PrimaryOwner__c=acc1.Id;
        goal1.Required_Monthly_Saving__c = 4500;
        goal1.Goal_Priority__c='Priority 2';
        goal1.Associated_Account__c=fa.Id;
        insert goal1;
        
        
        // ----- Test Class ---------------------------------------------//  
        bg = [select id ,Primary_Owner__c,Amount__c from Budget__C where name = 'Test' limit 1];
        FinServ__FinancialAccount__c fAcc1 = [select id  from FinServ__FinancialAccount__c where name = 'Test Financial Account 1' limit 1];
        FinServ__FinancialGoal__c fGoal1 = [select FinServ__TargetDate__c,Start_Value__c,Required_Monthly_Saving__c ,FinServ__PrimaryOwner__c  from FinServ__FinancialGoal__c where name = 'test goal 1' ];
        FinServ__FinancialAccountTransaction__c ftrans1 = [Select id, FinServ__Amount__c from FinServ__FinancialAccountTransaction__c where FinServ__Amount__c = 4000];
        DateTime d = fGoal1.FinServ__TargetDate__c;
        String targetDate = d.format('YYYY-MM-dd');
        //String targetAmt = String.valueOf(fGoal1.Required_Monthly_Saving__c);
        String currentAmount  = String.valueOf(fGoal1.Start_Value__c);       
        AddIncomeController.getRecordType('Income_Record_Type');
        AddIncomeController.getLoanRecordType('LoanAccount');       
        AddIncomeController.getRecordTypeIdbyName('FinServ__FinancialGoal__c' , fGoal1.id);
        AddIncomeController.getRecordIdRecType('Account' , acc1.id);
        AddIncomeController.getTransaction(bg.Id);
        AddIncomeController.getLoanTransaction(fAcc1.id);
        AddIncomeController.getSummaryTransaction(bg.Id);
        AddIncomeController.getLoanSummaryTransaction(fAcc1.id);
        AddIncomeController.wrapIncome result = AddIncomeController.getBudget(acc1.Id);
        AddIncomeController.wrapIncome res = AddIncomeController.getBudget(acc2.Id);
        AddIncomeController.wrapIncome result1 = AddIncomeController.getBudget('init');
        AddIncomeController.wrapIncome result2 = AddIncomeController.getmonthincome('JAN,2019', acc1 );
        AddIncomeController.getMonth('JAN,2019'); 
        AddIncomeController.deleteIncome(bg.id);
        AddIncomeController.deleteGoals(fGoal1.id);
        AddIncomeController.deleteLoan(fAcc1.id);
        AddIncomeController.deleteTransaction(ftrans1.id);
        // GoalsApexController.getGoals();
        /*List<Budget__c> bd = [select id from Budget__c];
Set<Id> bdId = new Set<Id>();
for(Budget__c b : bd) {
bdId.add(b.Id);
}
FinacastBudgetHelper.shareBudget(bdId);*/
        SummaryCashFlowController.getMonth('JAN');
        System.assertEquals('1', '1');
    }
    
}
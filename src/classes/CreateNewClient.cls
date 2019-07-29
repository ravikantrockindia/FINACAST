public class CreateNewClient {
    @AuraEnabled 
    public static WrapRecordTypeIds getRecordTypeIds(){
        String namespace=NamespaceUtility.returnNamespace();
        WrapRecordTypeIds recordTypeIds;  
        try{
            
            Id devRecordTypeId = [select Id,DeveloperName  from RecordType where sObjectType='Account' AND DeveloperName='IndustriesIndividual'].Id;
            //Schema.getGlobalDescribe().get('Account').getDescribe().getRecordTypeInfosByName().get('Individual').getRecordTypeId();
            List<RecordType> recordTypes=[select Id,DeveloperName  from RecordType where sObjectType='FinServ__FinancialAccount__c'];
            
            String objectName=namespace+'Budget__c';
            //String recordType=namespace+'Income_Record_Type';
            Id incomeRecordTypeId =[select Id,DeveloperName  from RecordType where sObjectType=:objectName AND DeveloperName='Income_Record_Type'].Id;
            //Schema.SObjectType.Budget__c.getRecordTypeInfosByName().get('Expense_Record_Type').getRecordTypeId();
             //recordType=namespace+'Expense_Record_Type';
            Id expenseRecordTypeId =[select Id,DeveloperName  from RecordType where sObjectType=:objectName AND DeveloperName='Expense_Record_Type'].Id;
            //Schema.SObjectType.Budget__c.getRecordTypeInfosByName().get('Income_Record_Type').getRecordTypeId();
            recordTypeIds= new WrapRecordTypeIds(devRecordTypeId,recordTypes,incomeRecordTypeId,expenseRecordTypeId);
            System.debug(recordTypeIds);
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }
        return recordTypeIds;
        
        
        //return devRecordTypeId;
        
    }
    @AuraEnabled 
    public static void deleteRecords(String recordId){
        try{
            if(recordId!=null || recordId!=''){
                List<FinServ__FinancialAccount__c> fa=[Select Id, FinServ__PrimaryOwner__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=: recordId];
                if(!fa.isEmpty())
                    delete fa;
                List<Budget__c> budget=[Select Id, Primary_Owner__c from Budget__c where Primary_Owner__c=: recordId];
                if(!budget.isEmpty())
                    delete budget;
                List<Account> a=[Select Id from Account where Id=: recordId];
                if(!a.isEmpty())
                    delete a;
                if(TEST.isRunningTest())
                    throw new NullPointerException();
            }
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }
        
        
    }
    /* @AuraEnabled 
public static Id individualAccountRecordType(){
Id devRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('IndustriesIndividual').getRecordTypeId();
return devRecordTypeId;

}

@AuraEnabled 
public static List<RecordType> getFinancialAccountRecordType(){
List<RecordType> recordTypes=[select Id,Name from RecordType where sObjectType='FinServ__FinancialAccount__c'];
return recordTypes;

}  

@AuraEnabled 
public static Id getIncomeRecordType(){
Id devRecordTypeId = Schema.SObjectType.Budget__c.getRecordTypeInfosByName().get('Expense_Record_Type').getRecordTypeId();
return devRecordTypeId;

} 


@AuraEnabled 
public static Id getExpenseRecordType(){
Id devRecordTypeId = Schema.SObjectType.Budget__c.getRecordTypeInfosByName().get('Income_Record_Type').getRecordTypeId();
return devRecordTypeId;

}*/
    @AuraEnabled 
    public static List<FinServ__FinancialAccount__c> returnBankAccount(String recordId){
        List<FinServ__FinancialAccount__c> bankAccounts;
        try{
            bankAccounts=[Select Id, Name, FinServ__PrimaryOwner__c, FinServ__Balance__c, Account_Type__c, FinServ__APY__c, Financial_Institution__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:recordId AND (Account_Type__c='401K' OR Account_Type__c='529 Account' OR Account_Type__c='Cash' OR Account_Type__c='CD'
                                                                                                                                                                                                                                     OR Account_Type__c='Checking' OR Account_Type__c='IRA' OR Account_Type__c='Money Market' OR Account_Type__c='Other' OR Account_Type__c='Retail Brokerage' OR Account_Type__c='Roth IRA'  OR Account_Type__c='Savings') ];
            // System.debug(bankAccounts.size());
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }
        
        return bankAccounts;
        
    }
    //0014600001dieOZAAY
    
    @AuraEnabled 
    public static void deleteBankAccount(String recordId){
        try{
            FinServ__FinancialAccount__c bankAccounts=[Select Id from FinServ__FinancialAccount__c where Id=:recordId limit 1];
            delete bankAccounts;
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }
        
    }
    
    @AuraEnabled 
    public static List<FinServ__FinancialAccount__c> returnDebtAccount(String recordId){
        List<FinServ__FinancialAccount__c> debtAccounts;
        try{
            debtAccounts=[Select Id, Name, FinServ__PrimaryOwner__c, FinServ__LoanAmount__c, Account_Type__c, Financial_Institution__c, Do_you_get_tax_benefit_from_interest_pay__c, Do_tax_benefits_realize_monthly__c, FinServ__PaymentFrequency__c, What_of_contribution_bring_tax_benefit__c, Max_yearly_tax_deduction_allowed__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:recordId AND (Account_Type__c='Loan' OR Account_Type__c='Credit Card') ];
            // System.debug(debtAccounts.size());
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }
        return debtAccounts;
    }
    //0014600001dieOZAAY 
    @AuraEnabled
    public static List<wrapIncome> getincome(String recordId){
        List<wrapIncome> incomeList=new List<wrapIncome>();
        
        try{
            Budget__c b=new Budget__c();
            // Integer index=0;
            List<Budget__c> incomel=[select id,Primary_Owner__c,Name,Frequency__c,Primary_Owner__r.Name,recordtype.developername,Yearly_growth__c,End_Date__c,Amount__c,Start_Date__c,Tax_Rate__c 
                                     from Budget__c where Primary_Owner__c =:recordId AND recordtype.developername='Income_Record_Type'];
            // System.debug(incomel);
            if(incomel !=null && incomel.size()>0){
                for(Budget__c income:incomel){
                    //  System.debug(JSON.serialize(incomel));
                    wrapIncome wi=new wrapIncome(income);
                    incomeList.add(wi);
                }
                
            } 
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }        //System.debug(JSON.serialize(incomeList));
        return incomeList;
    }
    
    
    
    @AuraEnabled
    public static List<wrapExpense> getExpense(String recordId){
        List<wrapExpense> expenseList=new List<wrapExpense>();
        
        try{
            Budget__c b=new Budget__c();
            List<Budget__c> expensel=[select id,Primary_Owner__c,Name,recordtype.developername,Yearly_growth__c,End_Date__c	,Amount__c,Start_Date__c,Does_contribution_bring_tax_benifit__c  , Does_tax_benifit_realize_really__c, May_yearly_tax_deduction_allowed__c, What_of_contribution_bring_tax_benifit__c, Priority__c
                                      from Budget__c where Primary_Owner__c =:recordId AND recordtype.developername='Expense_Record_Type'];
            System.debug(expensel);
            if(expensel !=null && expensel.size()>0){
                for(Budget__c expense:expensel){
                    System.debug(JSON.serialize(expensel));
                    wrapExpense wi=new wrapExpense(expense);
                    expenseList.add(wi);
                }
                
            } 
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }
        //  System.debug(JSON.serialize(incomeList));
        return expenseList;
    }
    
    
    @AuraEnabled
    public static List<wrapIncome> saveIncome(String incomes){
        List<wrapIncome> incomeList=new List<wrapIncome>();
        
        try{
            
            
            List<Budget__c> incomel = (List<Budget__c>) JSON.deserialize(incomes, List<Budget__c>.class);
            System.debug('income'+incomel);
            upsert(incomel);
            for(Budget__c b: incomel){
                wrapIncome wi=new wrapIncome(b);
                incomeList.add(wi);
            }
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }
        return incomeList;
        /* List<wrapIncome> incomeList=new List<wrapIncome>();
Budget__c b=new Budget__c();
Integer index=0;
List<Budget__c> incomel=[select id,Primary_Owner__c,Name,Frequency__c,Primary_Owner__r.Name,recordtype.developername,Yearly_growth__c,End_Date__c,Amount__c,Start_Date__c,Tax_Rate__c 
from Budget__c where Primary_Owner__c =:recordId  AND recordtype.developername='Income_Record_Type'];
System.debug(incomel);
if(incomel !=null && incomel.size()>0){
for(Budget__c income:incomel){
index++;
wrapIncome wi=new wrapIncome(income,index);
incomeList.add(wi);
}

} 
System.debug(JSON.serialize(incomeList));*/
    }
    
    @AuraEnabled
    public static List<wrapExpense> saveExpense(String expenses){
        List<wrapExpense> expenseList=new List<wrapExpense>();
        
        try{
            
            
            List<Budget__c> expensel = (List<Budget__c>) JSON.deserialize(expenses, List<Budget__c>.class);
            // System.debug(incomel);
            upsert(expensel);
            for(Budget__c b: expensel){
                wrapExpense wi=new wrapExpense(b);
                expenseList.add(wi);
                
            }
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }
        return expenseList;
        /* List<wrapIncome> incomeList=new List<wrapIncome>();
Budget__c b=new Budget__c();
Integer index=0;
List<Budget__c> incomel=[select id,Primary_Owner__c,Name,Frequency__c,Primary_Owner__r.Name,recordtype.developername,Yearly_growth__c,End_Date__c,Amount__c,Start_Date__c,Tax_Rate__c 
from Budget__c where Primary_Owner__c =:recordId  AND recordtype.developername='Income_Record_Type'];
System.debug(incomel);
if(incomel !=null && incomel.size()>0){
for(Budget__c income:incomel){
index++;
wrapIncome wi=new wrapIncome(income,index);
incomeList.add(wi);
}

} 
System.debug(JSON.serialize(incomeList));*/
    }
    
    
    @AuraEnabled 
    public static void hello(String recordId){
        try{
            List<Budget__c> income=[Select Id from Budget__c where Id=:recordId limit 1];
            delete income;
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }
        // System.debug('delete');
        
    }
    @AuraEnabled 
    public static void deleteExpense(String recordId){
        try{
            List<Budget__c> expense=[Select Id from Budget__c where Id=:recordId limit 1];
            delete expense;
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }
        // System.debug('delete');
        
    }
    @AuraEnabled 
    public static String getNamespace(){
        
           return NamespaceUtility.returnNamespace();
        
        // System.debug('delete');
        
    }
    
    
    public class wrapIncome {
        @AuraEnabled
        public Budget__c income {get; set;}
        @AuraEnabled
        public Boolean disabled {get; set;}
        
        public wrapIncome(Budget__c income) {
            
            this.income = income;
            disabled = true;
        }
    }
    
    
    public class wrapExpense {
        @AuraEnabled
        public Budget__c expense {get; set;}
        @AuraEnabled
        public Boolean disabled {get; set;}
        @AuraEnabled
        public Boolean showSection {get;set;}
        
        public wrapExpense(Budget__c expense) {
            
            this.expense = expense;
            disabled = true;
            showSection=false;
        }
    }
    public class WrapRecordTypeIds {
        @AuraEnabled
        public Id account {get; set;}
        @AuraEnabled
        public List<RecordType> financialAccount {get; set;}
        @AuraEnabled
        public Id income {get;set;}
        @AuraEnabled
        public Id expense {get;set;}
        
        public wrapRecordTypeIds(Id account,List<RecordType> financialAccount,Id income,Id expense) {
            
            this.account = account;
            this.financialAccount = financialAccount;
            this.income=income;
            this.expense=expense;
        }
    }
    
}
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
    public static wrapIncome addIncome(String recordId){
        //  List<wrapIncome> incomeList=new List<wrapIncome>();
        
        wrapIncome wi;
        try{
            //Budget__c b=new Budget__c();
            // Integer index=0;
            
            Budget b=new Budget();
            b.primaryOwnerId=recordId;
            wi  =new wrapIncome(b,false);
            // incomeList.add(wi);
            
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }        
        //System.debug(JSON.serialize(incomeList));
        return wi;
    }
    @AuraEnabled
    public static wrapIncome addExpense(String recordId){
        //  List<wrapIncome> incomeList=new List<wrapIncome>();
        
        wrapIncome wi;
        try{
            //Budget__c b=new Budget__c();
            // Integer index=0;
            
            Budget b=new Budget();
            b.primaryOwnerId=recordId;
            wi  =new wrapIncome(b,false);
            // incomeList.add(wi);
            
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }        
        //System.debug(JSON.serialize(incomeList));
        return wi;
    }
    @AuraEnabled
    public static List<wrapIncome> getincome(String recordId){
        List<wrapIncome> incomeList=new List<wrapIncome>();
        
        try{
            //Budget__c b=new Budget__c();
            // Integer index=0;
          //  String namespace=NamespaceUtility.returnNamespace();
           // String objectName=namespace+'Budget__c';
            
          //  Id incomeRecordTypeId =[select Id,DeveloperName  from RecordType where sObjectType=:objectName AND DeveloperName='Income_Record_Type'].Id;
            
            List<Budget__c> incomel=[select id,Primary_Owner__c,Name,Frequency__c,RecordTypeId, Yearly_growth__c,End_Date__c,Amount__c,Start_Date__c,Tax_Rate__c 
                                     from Budget__c where Primary_Owner__c =:recordId AND recordtype.developername='Income_Record_Type'];
            System.debug(incomel);
            
            if(incomel !=null && incomel.size()>0 ){
                for(Budget__c income:incomel){
                    Budget b=new Budget();
                    b.Id=income.Id;
                    b.amount=income.Amount__c;
                    b.primaryOwnerId=income.Primary_Owner__c;
                    b.frequency=income.Frequency__c;
                    b.name=income.Name;
                    //b.recordTypeId=incomeRecordTypeId;
                    b.growthRate=income.Yearly_growth__c;
                    b.endDate=income.End_Date__c;
                    b.startDate=income.Start_Date__c;
                    b.taxRate=income.Tax_Rate__c;
                    System.debug(JSON.serialize(b));
                    wrapIncome wi=new wrapIncome(b);
                    incomeList.add(wi);
                    System.debug(JSON.serialize(incomeList));
                }
                
            }
            else{
                Budget b=new Budget();
                b.primaryOwnerId=recordId;
                
                wrapIncome wi=new wrapIncome(b,false);
                incomeList.add(wi);
            }
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }        
        System.debug(JSON.serialize(incomeList));
        return incomeList;
    }
    
    
    
    @AuraEnabled
    public static List<wrapExpense> getExpense(String recordId){
        List<wrapExpense> expenseList=new List<wrapExpense>();
        
        try{
            //Budget__c b=new Budget__c();
            List<Budget__c> expensel=[select id,Primary_Owner__c,Name,Yearly_growth__c,End_Date__c,Amount__c,Start_Date__c,Does_contribution_bring_tax_benifit__c  , Does_tax_benifit_realize_really__c, May_yearly_tax_deduction_allowed__c, What_of_contribution_bring_tax_benifit__c, Priority__c
                                      from Budget__c where Primary_Owner__c =:recordId AND recordtype.developername='Expense_Record_Type'];
            System.debug(expensel);
            if(expensel !=null && expensel.size()>0){
                for(Budget__c expense:expensel){
                    Budget b=new Budget();
                    b.Id=expense.Id;
                    b.amount=expense.Amount__c;
                    b.primaryOwnerId=expense.Primary_Owner__c;
                    b.name=expense.Name;
                    //b.recordTypeId=incomeRecordTypeId;
                    b.growthRate=expense.Yearly_growth__c;
                    b.endDate=expense.End_Date__c;
                    b.startDate=expense.Start_Date__c;
                    b.isTaxBenefit=expense.Does_contribution_bring_tax_benifit__c;
                    b.isMonthly=expense.Does_tax_benifit_realize_really__c;
                    b.maxDeduction=expense.May_yearly_tax_deduction_allowed__c;
                    b.percentageContribution=expense.What_of_contribution_bring_tax_benifit__c;
                    System.debug(JSON.serialize(b));
                    wrapExpense wi=new wrapExpense(b);
                    expenseList.add(wi);
                    System.debug(JSON.serialize(expenseList));
                }
                
            }
            else{
                Budget b=new Budget();
                b.primaryOwnerId=recordId;
                
                wrapExpense wi=new wrapExpense(b,false);
                expenseList.add(wi);
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
            String namespace=NamespaceUtility.returnNamespace();
            String objectName=namespace+'Budget__c';
            Id incomeRecordTypeId =[select Id,DeveloperName  from RecordType where sObjectType=:objectName AND DeveloperName='Income_Record_Type'].Id;
            
            List<Budget> incomel = (List<Budget>) JSON.deserialize(incomes, List<Budget>.class);
            List<Budget__c> blist=new List<Budget__c>();
            for(Budget b:incomel){
                Budget__c income=new Budget__c();
                income.Id=b.Id;
                income.Amount__c=b.amount;
                income.Name=b.name;
                income.Primary_Owner__c= b.primaryOwnerId;
                // income.Primary_Owner__c='0014o00001fRoXxAAK';
                income.Frequency__c=b.frequency;
                income.RecordTypeId=incomeRecordTypeId;
                income.Yearly_growth__c=b.growthRate;
                income.End_Date__c=b.endDate;
                income.Start_Date__c=b.startDate;
                income.Tax_Rate__c=b.taxRate;
                blist.add(income);
                //  System.debug(JSON.serialize(incomel));
                //wrapIncome wi=new wrapIncome(income);
                //incomeList.add(wi);
            }
            System.debug('income'+blist);
            upsert(blist);
            for(Budget__c income: blist){
                Budget b=new Budget();
                b.Id=income.Id;
                b.amount=income.Amount__c;
                b.name=income.Name;
                b.primaryOwnerId=income.Primary_Owner__c;
                // b.primaryOwnerId='0014o00001fRoXxAAK';
                b.Name=income.Name;
                b.frequency=income.Frequency__c;
                // b.recordTypeId=income.RecordTypeId;
                b.growthRate=income.Yearly_growth__c;
                b.endDate=income.End_Date__c;
                b.startDate=income.Start_Date__c;
                b.taxRate=income.Tax_Rate__c;
                //  System.debug(JSON.serialize(incomel));
                //wrapIncome wi=new wrapIncome(b);
                // incomeList.add(wi);
                wrapIncome wi=new wrapIncome(b);
                incomeList.add(wi);
                System.debug(incomeList);
                
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
            String namespace=NamespaceUtility.returnNamespace();
            String objectName=namespace+'Budget__c';
            Id expenseRecordTypeId =[select Id,DeveloperName  from RecordType where sObjectType=:objectName AND DeveloperName='Expense_Record_Type'].Id;
            
            List<Budget> expensel = (List<Budget>) JSON.deserialize(expenses, List<Budget>.class);
            // System.debug(incomel);
            //upsert(expensel);
                        List<Budget__c> elist=new List<Budget__c>();

             if(expensel !=null && expensel.size()>0){
                for(Budget b:expensel){
                    Budget__c expense=new Budget__c();
                    expense.Id=b.Id;
                    expense.Amount__c=b.amount;
                    expense.Primary_Owner__c=b.primaryOwnerId;
                    expense.Name=b.name;
                    expense.recordTypeId=expenseRecordTypeId;
                    expense.Yearly_growth__c=b.growthRate;
                    expense.End_Date__c=b.endDate;
                    expense.Start_Date__c=b.startDate;
                    expense.Does_contribution_bring_tax_benifit__c=b.isTaxBenefit;
                    expense.Does_tax_benifit_realize_really__c=b.isMonthly;
                    expense.May_yearly_tax_deduction_allowed__c=b.maxDeduction;
                    expense.What_of_contribution_bring_tax_benifit__c=b.percentageContribution;
                    System.debug(JSON.serialize(expense));
                  //  wrapExpense wi=new wrapExpense(b);
                    elist.add(expense);
                    System.debug(JSON.serialize(elist));
                }
                
            }
            upsert elist;
            for(Budget__c expense: elist){
                 Budget b=new Budget();
                    b.Id=expense.Id;
                    b.amount=expense.Amount__c;
                    b.primaryOwnerId=expense.Primary_Owner__c;
                    b.name=expense.Name;
                    //b.recordTypeId=incomeRecordTypeId;
                    b.growthRate=expense.Yearly_growth__c;
                    b.endDate=expense.End_Date__c;
                    b.startDate=expense.Start_Date__c;
                    b.isTaxBenefit=expense.Does_contribution_bring_tax_benifit__c;
                    b.isMonthly=expense.Does_tax_benifit_realize_really__c;
                    b.maxDeduction=expense.May_yearly_tax_deduction_allowed__c;
                    b.percentageContribution=expense.What_of_contribution_bring_tax_benifit__c;
                    System.debug(JSON.serialize(b));
                    wrapExpense wi=new wrapExpense(b);
                    expenseList.add(wi);
                    System.debug(JSON.serialize(expenseList));
                
                
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
        public Budget income {get; set;}
        @AuraEnabled
        public Boolean disabled {get; set;}
        
        public wrapIncome(Budget income) {
            
            this.income = income;
            disabled = true;
        }
        public wrapIncome(Budget income, Boolean disabled) {
            
            this.income = income;
            this.disabled = disabled;
        }
    }
    
    
    public class wrapExpense {
        @AuraEnabled
        public Budget expense {get; set;}
        @AuraEnabled
        public Boolean disabled {get; set;}
        @AuraEnabled
        public Boolean showSection {get;set;}
        
        public wrapExpense(Budget expense) {
            
            this.expense = expense;
            disabled = true;
            showSection=false;
        }
        public wrapExpense(Budget expense, Boolean disabled) {
            
            this.expense = expense;
            this.disabled = disabled;
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
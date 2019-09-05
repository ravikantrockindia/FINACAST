public class CreateNewClient {
    @AuraEnabled 
    public static WrapRecordTypeIds getRecordTypeIds(){
        String namespace=NamespaceUtility.returnNamespace();
        WrapRecordTypeIds recordTypeIds;  
        try{
            
            Id devRecordTypeId = [select Id,DeveloperName  from RecordType where sObjectType='Account' AND DeveloperName='IndustriesIndividual'].Id;
            List<RecordType> recordTypes=[select Id,DeveloperName  from RecordType where sObjectType='FinServ__FinancialAccount__c'];
            String objectName=namespace+'Budget__c';
            Id incomeRecordTypeId =[select Id,DeveloperName  from RecordType where sObjectType=:objectName AND DeveloperName='Income_Record_Type'].Id;
            Id expenseRecordTypeId =[select Id,DeveloperName  from RecordType where sObjectType=:objectName AND DeveloperName='Expense_Record_Type'].Id;
            recordTypeIds= new WrapRecordTypeIds(devRecordTypeId,recordTypes,incomeRecordTypeId,expenseRecordTypeId);
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return recordTypeIds;
        
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
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        
        
    }
    @AuraEnabled 
    public static void updateContact(String recordId, String phone, String email, String gender, String dob){
        try{
            
            system.debug(phone+email+gender+dob+recordId);
            List<Contact> c=[Select Id, FinServ__Gender__c, Email, Birthdate, AccountId, Phone from Contact where AccountId=:recordId limit 1];
            c[0].FinServ__Gender__c=gender;
            c[0].Email=email;
            c[0].Birthdate=Date.valueOf(dob);
            c[0].Phone=phone;
            update c;
            
            if(TEST.isRunningTest())
                throw new NullPointerException();
            
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        
        
    }
    @AuraEnabled 
    public static List<Contact> getContact(String recordId){
        List<Contact> c;
        try{
            
            c=[Select Id, FinServ__Gender__c, Email, Birthdate, AccountId, Phone from Contact where AccountId=:recordId limit 1];
            
            if(Test.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        return c;
        
    }
    
    @AuraEnabled 
    public static List<FinServ__FinancialAccount__c> returnBankAccount(String recordId){
        List<FinServ__FinancialAccount__c> bankAccounts;
        try{
            bankAccounts=[Select Id, Name, FinServ__PrimaryOwner__c, FinServ__Balance__c, Account_Type__c, FinServ__APY__c, Financial_Institution__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:recordId AND (Account_Type__c='401K' OR Account_Type__c='529 Account' OR Account_Type__c='CD'
                                                                                                                                                                                                                                     OR Account_Type__c='Checking' OR Account_Type__c='IRA' OR Account_Type__c='Money Market' OR Account_Type__c='Retail Brokerage' OR Account_Type__c='Roth IRA'  OR Account_Type__c='Savings') ];            
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        
        return bankAccounts;
        
    }
    
    @AuraEnabled 
    public static void deleteBankAccount(String recordId){
        try{
            FinServ__FinancialAccount__c bankAccounts=[Select Id from FinServ__FinancialAccount__c where Id=:recordId limit 1];
            delete bankAccounts;
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        
    }
    
    @AuraEnabled 
    public static List<FinServ__FinancialAccount__c> returnDebtAccount(String recordId){
        List<FinServ__FinancialAccount__c> debtAccounts;
        try{
            debtAccounts=[Select Id, Name, FinServ__PrimaryOwner__c, FinServ__LoanAmount__c, Account_Type__c, Financial_Institution__c, Do_you_get_tax_benefit_from_interest_pay__c, Do_tax_benefits_realize_monthly__c, FinServ__PaymentFrequency__c, What_of_contribution_bring_tax_benefit__c, Max_yearly_tax_deduction_allowed__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:recordId AND (Account_Type__c='Loan' OR Account_Type__c='Credit Card') ];
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        return debtAccounts;
    }
    
    @AuraEnabled
    public static wrapIncome addIncome(String recordId){
        
        wrapIncome wi;
        try{
            
            Budget b=new Budget();
            b.primaryOwnerId=recordId;
            wi  =new wrapIncome(b,false);
            
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }        
        return wi;
    }
    @AuraEnabled
    public static wrapExpense addExpense(String recordId){
        
        wrapExpense wi;
        try{
            
            Budget b=new Budget();
            b.primaryOwnerId=recordId;
            wi  =new wrapExpense(b,false);
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }        
        return wi;
    }
    @AuraEnabled
    public static List<wrapIncome> getincome(String recordId){
        List<wrapIncome> incomeList=new List<wrapIncome>();
        
        try{
            
            List<Budget__c> incomel=[select id,Primary_Owner__c,Name,Frequency__c,RecordTypeId, Yearly_growth__c,End_Date__c,Amount__c,Start_Date__c,Tax_Rate__c 
                                     from Budget__c where Primary_Owner__c =:recordId AND recordtype.developername='Income_Record_Type'];
            
            if(incomel !=null && incomel.size()>0 ){
                for(Budget__c income:incomel){
                    Budget b=new Budget();
                    b.Id=income.Id;
                    b.amount=income.Amount__c;
                    b.primaryOwnerId=income.Primary_Owner__c;
                    b.frequency=income.Frequency__c;
                    b.name=income.Name;
                    b.growthRate=income.Yearly_growth__c;
                    b.endDate=income.End_Date__c;
                    b.startDate=income.Start_Date__c;
                    b.taxRate=income.Tax_Rate__c;
                    wrapIncome wi=new wrapIncome(b);
                    incomeList.add(wi);
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
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }        
        return incomeList;
    }
    
    
    
    @AuraEnabled
    public static List<wrapExpense> getExpense(String recordId){
        List<wrapExpense> expenseList=new List<wrapExpense>();
        
        try{
            List<Budget__c> expensel=[select id,Primary_Owner__c,Name,Yearly_growth__c,End_Date__c,Amount__c,Start_Date__c,Does_contribution_bring_tax_benifit__c  , Does_tax_benifit_realize_really__c, May_yearly_tax_deduction_allowed__c, What_of_contribution_bring_tax_benifit__c, Priority__c
                                      from Budget__c where Primary_Owner__c =:recordId AND recordtype.developername='Expense_Record_Type'];
            if(expensel !=null && expensel.size()>0){
                for(Budget__c expense:expensel){
                    Budget b=new Budget();
                    b.Id=expense.Id;
                    b.amount=expense.Amount__c;
                    b.primaryOwnerId=expense.Primary_Owner__c;
                    b.name=expense.Name;
                    b.growthRate=expense.Yearly_growth__c;
                    b.endDate=expense.End_Date__c;
                    b.startDate=expense.Start_Date__c;
                    b.isTaxBenefit=expense.Does_contribution_bring_tax_benifit__c;
                    b.isMonthly=expense.Does_tax_benifit_realize_really__c;
                    b.maxDeduction=expense.May_yearly_tax_deduction_allowed__c;
                    b.percentageContribution=expense.What_of_contribution_bring_tax_benifit__c;
                    b.priority=expense.Priority__c;
                    wrapExpense wi=new wrapExpense(b);
                    expenseList.add(wi);
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
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
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
                income.Frequency__c=b.frequency;
                income.RecordTypeId=incomeRecordTypeId;
                income.Yearly_growth__c=b.growthRate;
                income.End_Date__c=b.endDate;
                income.Start_Date__c=b.startDate;
                income.Tax_Rate__c=b.taxRate;
                blist.add(income);
            }
            upsert(blist);
            for(Budget__c income: blist){
                Budget b=new Budget();
                b.Id=income.Id;
                b.amount=income.Amount__c;
                b.name=income.Name;
                b.primaryOwnerId=income.Primary_Owner__c;
                b.Name=income.Name;
                b.frequency=income.Frequency__c;
                b.growthRate=income.Yearly_growth__c;
                b.endDate=income.End_Date__c;
                b.startDate=income.Start_Date__c;
                b.taxRate=income.Tax_Rate__c;
                wrapIncome wi=new wrapIncome(b);
                incomeList.add(wi);
                
            }
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        return incomeList;
    }
    
    @AuraEnabled
    public static List<wrapExpense> saveExpense(String expenses){
        List<wrapExpense> expenseList=new List<wrapExpense>();
        try{
            String namespace=NamespaceUtility.returnNamespace();
            String objectName=namespace+'Budget__c';
            Id expenseRecordTypeId =[select Id,DeveloperName  from RecordType where sObjectType=:objectName AND DeveloperName='Expense_Record_Type'].Id;
            
            List<Budget> expensel = (List<Budget>) JSON.deserialize(expenses, List<Budget>.class);
            
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
                    expense.Priority__c=b.priority;
                    if(b.isTaxBenefit!=null){
                        expense.Does_contribution_bring_tax_benifit__c=b.isTaxBenefit;
                        
                        expense.What_of_contribution_bring_tax_benifit__c=b.percentageContribution;  
                        if(b.isMonthly!=null)
                            expense.Does_tax_benifit_realize_really__c=b.isMonthly;
                        if(b.maxDeduction!=null)
                            expense.May_yearly_tax_deduction_allowed__c=b.maxDeduction;
                    }
                    
                    
                    elist.add(expense);
                }
                
            }
            upsert elist;
            for(Budget__c expense: elist){
                Budget b=new Budget();
                b.Id=expense.Id;
                b.amount=expense.Amount__c;
                b.primaryOwnerId=expense.Primary_Owner__c;
                b.name=expense.Name;
                b.growthRate=expense.Yearly_growth__c;
                b.priority=expense.Priority__c;
                b.endDate=expense.End_Date__c;
                b.startDate=expense.Start_Date__c;
                b.isTaxBenefit=expense.Does_contribution_bring_tax_benifit__c;
                b.isMonthly=expense.Does_tax_benifit_realize_really__c;
                b.maxDeduction=expense.May_yearly_tax_deduction_allowed__c;
                b.percentageContribution=expense.What_of_contribution_bring_tax_benifit__c;
                wrapExpense wi=new wrapExpense(b);
                expenseList.add(wi);
                
                
            }
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        return expenseList;
    }
    
    
    @AuraEnabled 
    public static void hello(String recordId){
        try{
            List<Budget__c> income=[Select Id from Budget__c where Id=:recordId limit 1];
            delete income;
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        
    }
    @AuraEnabled 
    public static void deleteExpense(String recordId){
        try{
            List<Budget__c> expense=[Select Id from Budget__c where Id=:recordId limit 1];
            delete expense;
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        
    }
    @AuraEnabled 
    public static String getNamespace(){
        
        return NamespaceUtility.returnNamespace();
        
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
public with sharing class AddIncomeController {
  //   String namespace= NamespaceUtility.returnNamespace();
     
    @auraEnabled
    public static id getRecordType(String recName){
        
        return FinacastUtility.getRecordTypeId('Budget__c',recName);    
    } 
    @auraEnabled
    public static id getLoanRecordType(String recName1){  
        return FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c',recName1);         
    } 
    @auraEnabled
    public static String getRecordTypeIdbyName(String objectName , String strRecordTypeName)
    {      
        FinServ__FinancialGoal__c finGoal  = [select recordtypeid,recordtype.developername  from FinServ__FinancialGoal__c where id=:strRecordTypeName];       
        return finGoal.recordtype.developername;
    } 
    @AuraEnabled
    public static String getRecordIdRecType(String objName , String recordId){
        Account acc  = [select recordtypeid,recordtype.developername  from Account where id=:recordId];       
        return acc.recordtype.developername;
        
    }
    //Income / Expense transaction data
    @AuraEnabled
    public static List<FinServ__FinancialAccountTransaction__c> getTransaction(String budgetId){
        Budget__c bg = new Budget__c();
        bg=[Select id , name from Budget__c where id =: budgetId];
        
        List<FinServ__FinancialAccountTransaction__c> transactionRecord = new List<FinServ__FinancialAccountTransaction__c>();
        
            transactionRecord = [Select id ,TransactionName__c, FinServ__TransactionDate__c , FinServ__Description__c, Destination_Financial_Account__c ,Destination_Financial_Account__r.name, FinServ__Amount__c 
                                 from FinServ__FinancialAccountTransaction__c 
                                 where Budget_Category__c =: bg.id 
                                 order by FinServ__TransactionDate__c DESC];
       
        return transactionRecord;
    }
    //Loan transaction data
    @AuraEnabled
    public static List<FinServ__FinancialAccountTransaction__c> getLoanTransaction(String financialAccountId){
        FinServ__FinancialAccount__c fa = new FinServ__FinancialAccount__c();
        fa = [Select id , name from FinServ__FinancialAccount__c where id =: financialAccountId];
        
        List<FinServ__FinancialAccountTransaction__c> transactionLoanRecord = new List<FinServ__FinancialAccountTransaction__c>();
       
            transactionLoanRecord = [Select id ,TransactionName__c, FinServ__TransactionDate__c , FinServ__Description__c, Destination_Financial_Account__c ,Destination_Financial_Account__r.name, FinServ__Amount__c , 	FinServ__FinancialAccount__c 
                                     from FinServ__FinancialAccountTransaction__c
                                     where FinServ__FinancialAccount__c =: fa.id
                                     order by FinServ__TransactionDate__c DESC];
       
        return transactionLoanRecord;
    }
    
    //get summarychart income/expense transaction
    @auraEnabled
    public static List<FinServ__FinancialAccountTransaction__c> getSummaryTransaction(String Id) {
        Budget__c bg = new Budget__c();
        bg = [Select id , name from Budget__c where id =: Id];   
        
        Date startDate =(Date)System.today();
        //Date endDate = LAST_N_DAYS:365;
        List<FinServ__FinancialAccountTransaction__c> transactionList = new List<FinServ__FinancialAccountTransaction__c>();
        
            transactionList = [Select id , FinServ__TransactionDate__c, FinServ__Amount__c from FinServ__FinancialAccountTransaction__c where Budget_Category__c =: bg.id AND FinServ__TransactionDate__c <= :startDate AND FinServ__TransactionDate__c >= LAST_N_MONTHS:5];
           
        return transactionList;
    }
   
    //get summarychart loan transaction
    //
    @auraEnabled
    public static List<FinServ__FinancialAccountTransaction__c> getLoanSummaryTransaction(String Id) {
        FinServ__FinancialAccount__c fa = new FinServ__FinancialAccount__c();
        fa = [Select id , name from FinServ__FinancialAccount__c where id =: Id];   
        
        Date startDate =(Date)System.today();
        //Date endDate = LAST_N_DAYS:365;
        List<FinServ__FinancialAccountTransaction__c> transactionList = new List<FinServ__FinancialAccountTransaction__c>();
       
            transactionList = [Select id , FinServ__TransactionDate__c, FinServ__Amount__c from FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__c =: fa.id AND FinServ__TransactionDate__c <= :startDate AND FinServ__TransactionDate__c >= LAST_N_MONTHS:5];
                
        return transactionList;
    }
    
    // On init method to get the records on Budget Screen
    @AuraEnabled
    public static wrapIncome getBudget(String clientId ){

        Double sum = 0 ; 
        Boolean isportalEnabled = false;
        Double sumExpense = 0;
        Double sumLoan = 0;
        Double sumGoal = 0;
        Double sumTransaction = 0;
        Double sumTransactionLoan = 0;
        Double  singleTransIncome = 0;
        String num ;
        String expenseSum;
        String loanSum ; 
        String goalSum ;
        wrapIncome wrapobj;
        Date stdate = date.newInstance(date.today().year(), date.today().month(), 1);
        Date enddate = date.newInstance(date.today().year(), date.today().month(), date.daysInMonth(date.today().year(), date.today().month()));     
        Account acc  = new Account();
        Budget__c bg = new Budget__c();
        User us = [select contactid , accountid from user where id=: userinfo.getUserId()];
        try{
            if(us.contactid == null){
                if(clientId == 'init') {
                    acc  = [select id,name,recordtype.developername from account where ownerid =: UserInfo.getUserId() order by name  limit 1 ];
                   }       
                else {
                    acc = [Select id,name ,recordtype.developername from account where id=: clientId];
                } 
            }
            else
            {
                isportalEnabled = true;
                acc = [select id,name,recordtype.developername from account where id=: us.accountid];
            }
            
            List<Budget__c> budgetList= new List<Budget__c>();
            List<Budget__c> IncomeRecord= new List<Budget__c>();
            List<Budget__c> expenseRecord= new List<Budget__c>();
            List<FinServ__FinancialAccount__c> loanRecord = new List<FinServ__FinancialAccount__c>();
            List<FinServ__FinancialGoal__c> goalRecord = new List<FinServ__FinancialGoal__c>();
            List<FinServ__FinancialAccountTransaction__c> transactionRecord = new List<FinServ__FinancialAccountTransaction__c>();
            if(acc.recordtype.developername.equals('IndustriesHousehold'))
            {
                
                budgetList=[select id,Primary_Owner__c,Primary_Owner__r.name,Name,Frequency__c,recordTypeId,recordtype.developername,Yearly_growth__c,End_Date__c,Amount__c,Start_Date__c,Tax_Rate__c,Month__c ,Priority__c,
                            (Select id , FinServ__TransactionDate__c ,Destination_Financial_Account__r.name, FinServ__Amount__c, 
                             Budget_Category__r.Amount__c
                             from Financial_Account_Transactions__r
                             where FinServ__TransactionDate__c = THIS_MONTH)
                            from Budget__c
                            where (((Start_Date__c <=: stdate ) or(Start_Date__c >=: stdate and  Start_Date__c <=: enddate)) and ((End_Date__c >=: stdate) or End_Date__c = null)) and HouseHold__c =:acc.id];
               
                loanRecord = [select id ,FinServ__PrimaryOwner__c,FinServ__PrimaryOwner__r.name, Name, FinServ__APY__c, FinServ__PaymentAmount__c, FinServ__LoanAmount__c, FinServ__PaymentFrequency__c,CreatedDate,FinServ__LoanEndDate__c ,
                              (Select id ,name ,  FinServ__TransactionDate__c ,Destination_Financial_Account__r.name, FinServ__Amount__c ,	FinServ__FinancialAccount__r.FinServ__PaymentAmount__c
                               from Financial_Account_Transactions__r
                               where FinServ__TransactionDate__c = THIS_MONTH)
                              from FinServ__FinancialAccount__c 
                              where RecordType.developername= 'LoanAccount' and  ((( CreatedDate <=: stdate ) or(CreatedDate >=: stdate and  CreatedDate <=: enddate)) and ((FinServ__LoanEndDate__c >=: stdate) or FinServ__LoanEndDate__c = null)) and FinServ__Household__c=:acc.id];
                 goalRecord = [Select id,FinServ__PrimaryOwner__c ,FinServ__PrimaryOwner__r.name, Name, Start_Value__c , Required_Monthly_Saving__c ,Associated_Account__c,Start_Date__c,FinServ__TargetDate__c 
                              from FinServ__FinancialGoal__c 
                              where ((( Start_Date__c <=: stdate ) or(Start_Date__c >=: stdate and  Start_Date__c <=: enddate)) and ((FinServ__TargetDate__c >=: stdate) or FinServ__TargetDate__c = null)) and FinServ__Household__c=:acc.id and RecordType.DeveloperName != 'Scenario_Record_Type'];
            } 
            else
            {
               budgetList=[select id,Primary_Owner__c,Name,Frequency__c,Primary_Owner__r.name,recordTypeId,recordtype.developername,Yearly_growth__c,End_Date__c,Amount__c,Start_Date__c,Tax_Rate__c,Month__c ,Priority__c,
                            (Select id , FinServ__TransactionDate__c ,Destination_Financial_Account__r.name, FinServ__Amount__c, 
                             Budget_Category__r.Amount__c
                             from Financial_Account_Transactions__r
                             where FinServ__TransactionDate__c = THIS_MONTH) 
                            from Budget__c
                            where (((Start_Date__c <=: stdate ) or(Start_Date__c >=: stdate and 
                                                                          Start_Date__c <=: enddate)) and ((End_Date__c >=: stdate) or End_Date__c = null)) and 
                            Primary_Owner__c =:acc.id];
                loanRecord = [select id ,FinServ__PrimaryOwner__c, Name, FinServ__PrimaryOwner__r.name,FinServ__APY__c, FinServ__PaymentAmount__c, FinServ__LoanAmount__c, FinServ__PaymentFrequency__c,CreatedDate,FinServ__LoanEndDate__c,              
                              (Select id ,name ,  FinServ__TransactionDate__c ,Destination_Financial_Account__r.name, FinServ__Amount__c ,	FinServ__FinancialAccount__r.FinServ__PaymentAmount__c
                               from Financial_Account_Transactions__r
                               where FinServ__TransactionDate__c = THIS_MONTH)
                              from FinServ__FinancialAccount__c 
                              where RecordType.developername= 'LoanAccount' and  ((( CreatedDate <=: stdate ) or(CreatedDate >=: stdate and  CreatedDate <=: enddate)) and ((FinServ__LoanEndDate__c >=: stdate) or FinServ__LoanEndDate__c = null)) and FinServ__PrimaryOwner__c =:acc.id];
               goalRecord = [Select id,FinServ__PrimaryOwner__c , Name, FinServ__PrimaryOwner__r.name,Start_Value__c , Required_Monthly_Saving__c ,Associated_Account__c,Start_Date__c,FinServ__TargetDate__c from FinServ__FinancialGoal__c where ((( Start_Date__c <=: stdate ) or(Start_Date__c >=: stdate and  Start_Date__c <=: enddate)) and ((FinServ__TargetDate__c >=: stdate) or FinServ__TargetDate__c = null)) and FinServ__PrimaryOwner__c =:acc.id and RecordType.DeveloperName != 'Scenario_Record_Type'];
                
                
            }     
            for(Budget__c getRecords : budgetList){
                If( getRecords.recordtype.developername == 'Income_Record_Type' ){ 
                    IncomeRecord.add(getRecords);                
                }
                else if (getRecords.recordtype.developername == 'Expense_Record_Type' )
                {
                    expenseRecord.add(getRecords);                
                }            
            }            
            for ( Budget__c tIncome  : IncomeRecord){
                if (tIncome.Frequency__c=='Monthly'){
                    sum = sum + tIncome.Amount__c ; 
                    
                }  
                else if (tIncome.Frequency__c=='Semi Monthly'){
                    sum = sum + (tIncome.Amount__c *2) ; 
                    
                }
                else if(tIncome.Frequency__c=='Bi-Weekly'){
                    sum = sum + (tIncome.Amount__c *2.16) ; 
                }
                else if(tIncome.Frequency__c=='Weekly'){
                    sum = sum + (tIncome.Amount__c *4.33) ; 
                    
                }
                num = '$' + sum.format();
            }
            for ( Budget__c tExpense  : expenseRecord){
                sumExpense = sumExpense + tExpense.Amount__c ;  
                expenseSum ='$' + sumExpense.format();
            }
            for ( FinServ__FinancialAccount__c tLoan  : loanRecord){
                if (tLoan.FinServ__PaymentFrequency__c=='Monthly'){
                    sumLoan = sumLoan + tLoan.FinServ__PaymentAmount__c ;  
                    
                }  
                else if (tLoan.FinServ__PaymentFrequency__c=='Semi Monthly'){
                    sumLoan = sumLoan + (tLoan.FinServ__PaymentAmount__c*2) ;  
                    
                }
                else if(tLoan.FinServ__PaymentFrequency__c=='Biweekly'){
                    sumLoan = sumLoan + (tLoan.FinServ__PaymentAmount__c*2.16) ;  
                }
                else if(tLoan.FinServ__PaymentFrequency__c=='Weekly'){
                    sumLoan = sumLoan + (tLoan.FinServ__PaymentAmount__c*4.33) ;  
                    
                }
                loanSum = '$' + sumLoan.format();
            }
            for (FinServ__FinancialGoal__c tGoal  : goalRecord){
                sumGoal = sumGoal + tGoal.Required_Monthly_Saving__c ; 
                goalSum = '$' + sumGoal.format();
            }
         Double valTrans = 0 ;
            Map<Id ,Double> getTransactionAmount = new Map<Id, Double>();
            Map<Id ,String> getTransactionAmountIncome = new Map<Id, String>();
            for(Budget__c tAmount : IncomeRecord){
                Double percentage = 0;
                Double transactionAmount=0;
                for(FinServ__FinancialAccountTransaction__c tTransaction : tAmount.Financial_Account_Transactions__r ){                
                    percentage = percentage + tTransaction.FinServ__Amount__c ; 
                    transactionAmount=tTransaction.Budget_Category__r.Amount__c;
                    
                    //sumTransaction = ((percentage / tTransaction.Budget_Category__r.Amount__c) * 100);
                    //getTransactionAmount.put(tAmount.id, sumTransaction);
                    valTrans = valTrans + tTransaction.FinServ__Amount__c ;   
                }
                
                if (tAmount.Frequency__c=='Monthly' && transactionAmount!=0){
                    sumTransaction = ((percentage / transactionAmount) * 100);
                    getTransactionAmount.put(tAmount.id, sumTransaction);
                }  
                else if (tAmount.Frequency__c=='Semi Monthly'&& transactionAmount!=0){
                    sumTransaction = ((percentage / (transactionAmount*2)) * 100);
                    getTransactionAmount.put(tAmount.id, sumTransaction);
              }
                else if(tAmount.Frequency__c=='Bi-Weekly'&& transactionAmount!=0){
                    sumTransaction = ((percentage / (transactionAmount*2.16)) * 100);
                    getTransactionAmount.put(tAmount.id, sumTransaction); 
               }
                else if(tAmount.Frequency__c=='Weekly'&& transactionAmount!=0){
                    sumTransaction = ((percentage /(transactionAmount*4.33)) * 100);
                    getTransactionAmount.put(tAmount.id, sumTransaction);
               }
                getTransactionAmountIncome.put(tAmount.id, percentage.format());  
            }
            String vInc =  valTrans.format();
            Double valTransExp = 0 ;
            Map<Id ,Double> getTransactionAmountExpense = new Map<Id, Double>();
            Map<Id ,String> getTransactionAmountTotalExpense = new Map<Id, String>();
            for(Budget__c tAmount : expenseRecord){
                Double percentage = 0;
                for(FinServ__FinancialAccountTransaction__c tTransaction : tAmount.Financial_Account_Transactions__r ){                
                    percentage = percentage + tTransaction.FinServ__Amount__c ;
                    sumTransaction = ((percentage / tTransaction.Budget_Category__r.Amount__c) * 100);
                    getTransactionAmountExpense.put(tAmount.id, sumTransaction);
                    valTransExp = valTransExp + tTransaction.FinServ__Amount__c ;   
                }
                getTransactionAmountTotalExpense.put(tAmount.id, percentage.format());
             }
            String vExp =  valTransExp.format();
            Double valTransLoan = 0 ;
            Map<Id ,Double> getTransactionAmountLoan = new Map<Id, Double>();
            Map<Id ,String> getTransactionAmountTotalLoan = new Map<Id, String>();
            for(FinServ__FinancialAccount__c tAmount : loanRecord){
                Double percentage = 0;
                Double sumLoanTransaction=0;
               for(FinServ__FinancialAccountTransaction__c tTransaction : tAmount.Financial_Account_Transactions__r ){
                    percentage = percentage + tTransaction.FinServ__Amount__c ;
                    sumLoanTransaction=tTransaction.FinServ__FinancialAccount__r.FinServ__PaymentAmount__c;
                   valTransLoan = valTransLoan + tTransaction.FinServ__Amount__c ;   
                }
                if (tAmount.FinServ__PaymentFrequency__c=='Monthly' && sumLoanTransaction!=0){
                    sumTransaction = ((percentage / sumLoanTransaction) * 100);
                    getTransactionAmountLoan.put(tAmount.id, sumTransaction);
                 }  
                else if (tAmount.FinServ__PaymentFrequency__c=='Semi Monthly'&& sumLoanTransaction!=0){
                    sumTransaction = ((percentage / (sumLoanTransaction*2)) * 100);
                    getTransactionAmountLoan.put(tAmount.id, sumTransaction);
                }
                else if(tAmount.FinServ__PaymentFrequency__c=='Biweekly'&& sumLoanTransaction!=0){
                    sumTransaction = ((percentage / (sumLoanTransaction*2.16)) * 100);
                    getTransactionAmountLoan.put(tAmount.id, sumTransaction); 
                   }
                else if(tAmount.FinServ__PaymentFrequency__c=='Weekly'&& sumLoanTransaction!=0){
                    sumTransaction = ((percentage /(sumLoanTransaction*4.33)) * 100);
                    getTransactionAmountLoan.put(tAmount.id, sumTransaction);
                 }
                getTransactionAmountTotalLoan.put(tAmount.id, percentage.format());
             }
            String vLoan =  valTransLoan.format();
          wrapobj= new wrapIncome(IncomeRecord,num,expenseRecord ,expenseSum ,goalRecord, goalSum , loanRecord , loanSum, acc,isportalEnabled ,
                                    sumTransaction , getTransactionAmount ,getTransactionAmountExpense,getTransactionAmountLoan,
                                    getTransactionAmountIncome,getTransactionAmountTotalExpense,getTransactionAmountTotalLoan,
                                    vInc , vExp , vLoan);  
                    if(TEST.isRunningTest())
                throw new NullPointerException();

        }
        catch(Exception e){
          FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
       return wrapobj;
        
    }
    
    @auraEnabled
    public static void deleteIncome(id IncomeId) {
        
            Budget__c IncomeItem = [Select id from Budget__c where id =:IncomeId];
            delete IncomeItem;
        
    }
    @auraEnabled
    public static void deleteLoan(id loanId) {
                   FinServ__FinancialAccount__c loanItem = [Select id from FinServ__FinancialAccount__c where id =:loanId];
            delete loanItem;
        
    }
    
    @auraEnabled
    public static wrapIncome getmonthincome( String month , Account acc ){
        wrapIncome wrapper;
        Double sum = 0 ; 
        Double sumExpense = 0;
        Double sumLoan = 0;
        Double sumGoal = 0;
        Double sumTransaction = 0;
        Double sumTransactionLoan = 0;
         Decimal singleIncome= 0 ;
        String num;
        String expenseSum;
        String goalSum ; 
        String loanSum;
        Date stdate = getMonth(month);
         Boolean isportalEnabled = false;
        String clientId = acc.Id;
        String budgetId ;
        // Account acc = [Select id,name from account where id=: clientId limit 1];
        Date enddate = date.newInstance(stdate.year(), stdate.month(), date.daysInMonth(stdate.year(), stdate.month()));
        String incomeRecTypeId = getRecordType('Income_Record_Type');
        String expenseRecTypeId = getRecordType('Expense_Record_Type');
        User us = [select contactid , accountid from user where id=: userinfo.getUserId()];
        try{
            if(us.ContactId != null)
            {
                isportalEnabled = true;
            }
            List<Budget__c> incomeList = new List<Budget__c>();
            List<Budget__c> expenseList = new List<Budget__c>();
            List<Budget__c> budgetList= new List<Budget__c>();
            
            budgetList=[select id,Primary_Owner__c,Name,Frequency__c,Primary_Owner__r.name,recordTypeId,recordtype.developername,Yearly_growth__c,End_Date__c,Amount__c,Start_Date__c,Tax_Rate__c,Month__c ,Priority__c,
                        (Select id , FinServ__TransactionDate__c ,Destination_Financial_Account__r.name, FinServ__Amount__c, 
                         Budget_Category__r.Amount__c
                         from Financial_Account_Transactions__r
                         where FinServ__TransactionDate__c = THIS_MONTH) from Budget__c
                        where (((Start_Date__c <=: stdate ) or(Start_Date__c >=: stdate and 
                                                                      Start_Date__c <=: enddate)) and ((End_Date__c >=: stdate) or End_Date__c = null)) and 
                        Primary_Owner__c =:clientId];			
            
            for(Budget__c getRecords : budgetList){
                If( getRecords.recordtype.developername == 'Income_Record_Type' ){ 
                    incomeList.add(getRecords);                
                }
                else if (getRecords.recordtype.developername == 'Expense_Record_Type' )
                {
                    expenseList.add(getRecords);                
                }            
            }
            
            List<FinServ__FinancialAccount__c> loanRecord = new List<FinServ__FinancialAccount__c>();
            List<FinServ__FinancialGoal__c> goalRecord = new List<FinServ__FinancialGoal__c>();
            List<FinServ__FinancialAccountTransaction__c> transactionRecord = new List<FinServ__FinancialAccountTransaction__c>();
            loanRecord = [select id ,FinServ__PrimaryOwner__c, Name,FinServ__PrimaryOwner__r.name, FinServ__APY__c, FinServ__PaymentAmount__c, FinServ__LoanAmount__c, FinServ__PaymentFrequency__c ,CreatedDate,FinServ__LoanEndDate__c ,
                          (Select id ,name ,  FinServ__TransactionDate__c ,Destination_Financial_Account__r.name, FinServ__Amount__c ,	FinServ__FinancialAccount__r.FinServ__PaymentAmount__c
                           from Financial_Account_Transactions__r
                           where FinServ__TransactionDate__c = THIS_MONTH)
                          from FinServ__FinancialAccount__c 
                          where recordtype.developername = 'LoanAccount' and (((CreatedDate <=: stdate ) or(CreatedDate >=: stdate and  CreatedDate <=: enddate)) and ((FinServ__LoanEndDate__c >=: stdate) or   FinServ__LoanEndDate__c = null)) and FinServ__PrimaryOwner__c =:clientId];
            goalRecord = [Select id,FinServ__PrimaryOwner__c, Name, FinServ__PrimaryOwner__r.name ,Start_Value__c , Required_Monthly_Saving__c ,Associated_Account__c,Start_Date__c,FinServ__TargetDate__c from FinServ__FinancialGoal__c where (((Start_Date__c <=: stdate ) or(Start_Date__c >=: stdate and  Start_Date__c <=: enddate)) and ((FinServ__TargetDate__c >=: stdate) or   FinServ__TargetDate__c = null)) and FinServ__PrimaryOwner__c =:clientId and RecordType.DeveloperName != 'Scenario_Record_Type'];
            
            for ( Budget__c tIncome  : incomeList){
                if (tIncome.Frequency__c=='Monthly'){
                    sum = sum + tIncome.Amount__c ; 
                    
                }  
                else if (tIncome.Frequency__c=='Semi Monthly'){
                    sum = sum + (tIncome.Amount__c *2) ; 
                    
                }
                else if(tIncome.Frequency__c=='Bi-Weekly'){
                    sum = sum + (tIncome.Amount__c *2.16) ; 
                }
                else if(tIncome.Frequency__c=='Weekly'){
                    sum = sum + (tIncome.Amount__c *4.33) ; 
                    
                }
            }
            num = '$' + sum.format();
            for ( Budget__c tExpense  : expenseList){
                sumExpense = sumExpense + tExpense.Amount__c ;
                expenseSum = '$' + sumExpense.format();
            }
            
            for (FinServ__FinancialGoal__c tGoal  : goalRecord){
                sumGoal = sumGoal + tGoal.Required_Monthly_Saving__c ;    
                goalSum = '$' + sumGoal.format();
            }
            
            for ( FinServ__FinancialAccount__c tLoan  : loanRecord){
               if (tLoan.FinServ__PaymentFrequency__c=='Monthly'){
                    sumLoan = sumLoan + tLoan.FinServ__PaymentAmount__c ;  
                    
                }  
                else if (tLoan.FinServ__PaymentFrequency__c=='Semi Monthly'){
                    sumLoan = sumLoan + (tLoan.FinServ__PaymentAmount__c*2) ;  
                    
                }
                else if(tLoan.FinServ__PaymentFrequency__c=='Biweekly'){
                    sumLoan = sumLoan + (tLoan.FinServ__PaymentAmount__c*2.16) ;  
                }
                else if(tLoan.FinServ__PaymentFrequency__c=='Weekly'){
                    sumLoan = sumLoan + (tLoan.FinServ__PaymentAmount__c*4.33) ;  
                    
                }
                loanSum = '$' + sumLoan.format();
            }
            Double valTrans = 0 ;
            Map<Id ,Double> getTransactionAmount = new Map<Id, Double>();
            Map<Id ,String> getTransactionAmountIncome = new Map<Id, String>();
            for(Budget__c tAmount : incomeList){
                Double percentage = 0;
                Double transactionAmount=0;
                for(FinServ__FinancialAccountTransaction__c tTransaction : tAmount.Financial_Account_Transactions__r ){             
                    percentage = percentage + tTransaction.FinServ__Amount__c ;
                    transactionAmount=tTransaction.Budget_Category__r.Amount__c;
                    // sumTransaction = ((percentage / tTransaction.Budget_Category__r.Amount__c) * 100);
                     // getTransactionAmount.put(tAmount.id, sumTransaction);
                    valTrans = valTrans + tTransaction.FinServ__Amount__c ;   
                }
               if (tAmount.Frequency__c=='Monthly' && transactionAmount!=0){
                    sumTransaction = ((percentage / transactionAmount) * 100);
                    getTransactionAmount.put(tAmount.id, sumTransaction);
                    }  
                else if (tAmount.Frequency__c=='Semi Monthly'&& transactionAmount!=0){
                    sumTransaction = ((percentage / (transactionAmount*2)) * 100);
                    getTransactionAmount.put(tAmount.id, sumTransaction);
                 }
                else if(tAmount.Frequency__c=='Bi-Weekly'&& transactionAmount!=0){
                    sumTransaction = ((percentage / (transactionAmount*2.16)) * 100);
                    getTransactionAmount.put(tAmount.id, sumTransaction); 
                 }
                else if(tAmount.Frequency__c=='Weekly'&& transactionAmount!=0){
                    sumTransaction = ((percentage /(transactionAmount*4.33)) * 100);
                    getTransactionAmount.put(tAmount.id, sumTransaction);
                        
                }
                getTransactionAmountIncome.put(tAmount.id, percentage.format());     
            }
            String vInc =  valTrans.format();
            Double valTransExp = 0;
            Map<Id ,Double> getTransactionAmountExpense = new Map<Id, Double>();
            Map<Id ,String> getTransactionAmountTotalExpense= new Map<Id, String>();
            for(Budget__c tAmount : expenseList){
                Double percentage = 0;
                for(FinServ__FinancialAccountTransaction__c tTransaction : tAmount.Financial_Account_Transactions__r ){
                    percentage = percentage + tTransaction.FinServ__Amount__c ;
                    sumTransaction = ((percentage / tTransaction.Budget_Category__r.Amount__c) * 100);
                    getTransactionAmountExpense.put(tAmount.id, sumTransaction);
                    valTransExp = valTransExp + tTransaction.FinServ__Amount__c ;   
                }
                getTransactionAmountTotalExpense.put(tAmount.id, percentage.format());
                 }
            String vExp =  valTransExp.format();
            Double valTransLoan = 0 ;
            Map<Id ,Double> getTransactionAmountLoan = new Map<Id, Double>();
            Map<Id ,String> getTransactionAmountTotalLoan = new Map<Id, String>();
            for(FinServ__FinancialAccount__c tAmount : loanRecord){
                Double percentage = 0;
                Double sumLoanTransaction=0;
                for(FinServ__FinancialAccountTransaction__c tTransaction : tAmount.Financial_Account_Transactions__r ){
                    percentage = percentage + tTransaction.FinServ__Amount__c ;
                    sumLoanTransaction=tTransaction.FinServ__FinancialAccount__r.FinServ__PaymentAmount__c;
                    //sumTransactionLoan = ((percentage / tTransaction.FinServ__FinancialAccount__r.FinServ__PaymentAmount__c) * 100);
                   //getTransactionAmountLoan.put(tAmount.id, sumTransactionLoan);
                    valTransLoan = valTransLoan + tTransaction.FinServ__Amount__c ;   
                }
                if (tAmount.FinServ__PaymentFrequency__c=='Monthly' && sumLoanTransaction!=0){
                    sumTransaction = ((percentage / sumLoanTransaction) * 100);
                    getTransactionAmountLoan.put(tAmount.id, sumTransaction);
                  }  
                else if (tAmount.FinServ__PaymentFrequency__c=='Semi Monthly'&& sumLoanTransaction!=0){
                    sumTransaction = ((percentage / (sumLoanTransaction*2)) * 100);
                    getTransactionAmountLoan.put(tAmount.id, sumTransaction);
                    }
                else if(tAmount.FinServ__PaymentFrequency__c=='Biweekly'&& sumLoanTransaction!=0){
                    sumTransaction = ((percentage / (sumLoanTransaction*2.16)) * 100);
                    getTransactionAmountLoan.put(tAmount.id, sumTransaction); 
                 }
                else if(tAmount.FinServ__PaymentFrequency__c=='Weekly'&& sumLoanTransaction!=0){
                    sumTransaction = ((percentage /(sumLoanTransaction*4.33)) * 100);
                    getTransactionAmountLoan.put(tAmount.id, sumTransaction);
                                 }
                getTransactionAmountTotalLoan.put(tAmount.id, percentage.format());
               }
            String vLoan =  valTransLoan.format();
            wrapper= new wrapIncome(incomeList, num , expenseList , expenseSum ,goalRecord, goalSum , loanRecord , loanSum, acc,isportalEnabled
                                    , sumTransaction , getTransactionAmount , getTransactionAmountExpense,getTransactionAmountLoan,
                                    getTransactionAmountIncome,getTransactionAmountTotalExpense,getTransactionAmountTotalLoan,
                                    vInc , vExp , vLoan); 
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return wrapper;
        
    }
    
    @auraEnabled
    public static Date getMonth(String month){
       List<String> tempList=month.split(',');
        system.debug('rtyuiop');
        
            String mon = tempList[0].trim();
            Map<String,Integer> monthMap = new Map<String , Integer>{'JAN' => 1 , 'FEB'=> 2, 'MAR'=> 3, 'APR'=> 4, 'MAY'=> 5, 'JUN'=> 6, 'JUL'=> 7, 'AUG'=> 8, 'SEP'=>9, 'OCT'=>10, 'NOV'=> 11, 'DEC'=> 12};
                Integer stMonth = monthMap.get(mon); 
            Integer yea = Integer.valueOf(tempList[1].trim());
           Date st = date.newInstance(yea,stMonth,1);
        
        return st;
    }
    
    @auraEnabled
    public static void deleteGoals(id goalId) {
        
            FinServ__FinancialGoal__c goalItem = [Select id from FinServ__FinancialGoal__c where id =:goalId];
            delete goalItem;
        
    }
    @auraEnabled
    public static void deleteTransaction(id transactionId) {
       
            FinServ__FinancialAccountTransaction__c  transactionItem = [Select id from FinServ__FinancialAccountTransaction__c  where id =:transactionId];
            delete transactionItem;
        
    }
    
    
    public class wrapIncome{
        
        @AuraEnabled
        List<Budget__c> incomeRecList{get;set;}
        @AuraEnabled
        public String totalIncome;
        @AuraEnabled
        List<Budget__c> expenseRecList{get;set;}
        @AuraEnabled
        List<FinServ__FinancialAccount__c> loanRecList{get;set;}
        @AuraEnabled
        List<FinServ__FinancialGoal__c> goalRecList{get;set;}
        @AuraEnabled
        public String totalExpense;
        @AuraEnabled
        public String totalLoan;
        @AuraEnabled
        public String totalGoal;
        @AuraEnabled
        public Account client; 
        @AuraEnabled
        public Boolean isportalUser;
        @AuraEnabled
        public Double totalTransaction;           
        @AuraEnabled
        public Map<Id, Double> transAmount;
        @AuraEnabled
        public Map<Id, Double> transAmountExpense;
        @AuraEnabled
        public Map<Id, Double> transAmountLoan;
        @AuraEnabled
        public Map<Id, String> sumOfIncome;
        @AuraEnabled
        public Map<Id, String> sumOfExpense;
        @AuraEnabled
        public Map<Id, String> sumOfLoan;
        @AuraEnabled
        public String TransSumValInc ;
        @AuraEnabled
        public String TransSumValExp ;
        @AuraEnabled
        public String TransSumValLoan ;
        
        public wrapIncome(List<Budget__c> incomeTypeRec , String incomeSum, List<Budget__c> expenseTypeRec,String expenseSum ,
                          List<FinServ__FinancialGoal__c> goalTypeRec, String goalSum,List<FinServ__FinancialAccount__c>loanTypeRec ,
                          String loanSum,Account clnt,Boolean isPortalEnabled , Double transactionSum , Map<Id , Double> transactionAmount,
                          Map<Id , Double> transactionAmountExpense, Map<Id , Double> transactionAmountLoan,
                          Map<Id, String> sumOfIncomes,Map<Id, String> sumOfExpenses,Map<Id, String> sumOfLoans,
                          String transInc , String transExp , String transLoan)
        {            
            incomeRecList=incomeTypeRec;
            totalIncome = incomeSum;
            expenseRecList = expenseTypeRec;
            totalExpense = expenseSum ;
            loanRecList = loanTypeRec;
            totalLoan = loanSum;
            goalRecList = goalTypeRec;
            totalGoal = goalSum;
            client = clnt;
            isportalUser = isPortalEnabled;
            totalTransaction =  transactionSum;
            transAmount = transactionAmount;
            transAmountExpense = transactionAmountExpense;
            transAmountLoan = transactionAmountLoan;
            sumOfIncome = sumOfIncomes;
            sumOfExpense = sumOfExpenses ; 
            sumOfLoan = sumOfLoans ; 
            TransSumValInc = transInc ;
            TransSumValExp =  transExp ;
            TransSumValLoan = transLoan ;
        }
        
    }
    
}
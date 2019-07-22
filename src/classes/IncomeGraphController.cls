public with sharing class IncomeGraphController {
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
    
    @AuraEnabled
    public static wrapIncome getBudget(String clientId ){
        System.debug(clientId);
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
        
        User us = [select contactid , accountid from user where id=: userinfo.getuserid()];
        System.debug('client id =init'+us.contactid +'and account'+us.accountid);
        try{
            if(us.contactid == null){
                if(clientId == 'init') {
                    System.debug('client id =init');
                    acc  = [select id,name,recordtype.developername from account where ownerid =: UserInfo.getUserId() order by name  limit 1 ];
                     System.debug('client id =init'+acc.id);
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
                System.debug('budget list '+budgetList);
                
                loanRecord = [select id ,FinServ__PrimaryOwner__c,FinServ__PrimaryOwner__r.name, Name, APR__c, FinServ__PaymentAmount__c, FinServ__LoanAmount__c, FinServ__PaymentFrequency__c,CreatedDate,FinServ__LoanEndDate__c ,
                              (Select id ,name ,  FinServ__TransactionDate__c ,Destination_Financial_Account__r.name, FinServ__Amount__c ,	FinServ__FinancialAccount__r.FinServ__PaymentAmount__c
                               from Financial_Account_Transactions__r
                               where FinServ__TransactionDate__c = THIS_MONTH)
                              from FinServ__FinancialAccount__c 
                              where RecordType.developername= 'LoanAccount' and  ((( CreatedDate <=: stdate ) or(CreatedDate >=: stdate and  CreatedDate <=: enddate)) and ((FinServ__LoanEndDate__c >=: stdate) or FinServ__LoanEndDate__c = null)) and FinServ__Household__c=:acc.id];
                System.debug('loanRecord '+loanRecord);
                goalRecord = [Select id,FinServ__PrimaryOwner__c ,FinServ__PrimaryOwner__r.name, Name, Start_Value__c , Required_Monthly_Saving__c ,Associated_Account__c,Start_Date__c,FinServ__TargetDate__c 
                              from FinServ__FinancialGoal__c 
                              where ((( Start_Date__c <=: stdate ) or(Start_Date__c >=: stdate and  Start_Date__c <=: enddate)) and ((FinServ__TargetDate__c >=: stdate) or FinServ__TargetDate__c = null)) and FinServ__Household__c=:acc.id and RecordType.DeveloperName != 'Scenario_Record_Type'];
            } 
            else
            {
                System.debug('aa');
                budgetList=[select id,Primary_Owner__c,Name,Frequency__c,Primary_Owner__r.name,recordTypeId,recordtype.developername,Yearly_growth__c,End_Date__c,Amount__c,Start_Date__c,Tax_Rate__c,Month__c ,Priority__c,
                            (Select id , FinServ__TransactionDate__c ,Destination_Financial_Account__r.name, FinServ__Amount__c, 
                             Budget_Category__r.Amount__c
                             from Financial_Account_Transactions__r
                             where FinServ__TransactionDate__c = THIS_MONTH) 
                            from Budget__c
                            where (((Start_Date__c <=: stdate ) or(Start_Date__c >=: stdate and 
                                                                          Start_Date__c <=: enddate)) and ((End_Date__c >=: stdate) or End_Date__c = null)) and 
                            Primary_Owner__c =:acc.id];
                loanRecord = [select id ,FinServ__PrimaryOwner__c, Name, FinServ__PrimaryOwner__r.name,APR__c, FinServ__PaymentAmount__c, FinServ__LoanAmount__c, FinServ__PaymentFrequency__c,CreatedDate,FinServ__LoanEndDate__c,              
                              (Select id ,name ,  FinServ__TransactionDate__c ,Destination_Financial_Account__r.name, FinServ__Amount__c ,	FinServ__FinancialAccount__r.FinServ__PaymentAmount__c
                               from Financial_Account_Transactions__r
                               where FinServ__TransactionDate__c = THIS_MONTH)
                              from FinServ__FinancialAccount__c 
                              where RecordType.developername= 'LoanAccount' and  ((( CreatedDate <=: stdate ) or(CreatedDate >=: stdate and  CreatedDate <=: enddate)) and ((FinServ__LoanEndDate__c >=: stdate) or FinServ__LoanEndDate__c = null)) and FinServ__PrimaryOwner__c =:acc.id];
                System.debug('loan list '+loanRecord);
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
            System.debug('aaaaa');
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
                    System.debug(sumTransaction);
                }  
                else if (tAmount.Frequency__c=='Semi Monthly'&& transactionAmount!=0){
                    sumTransaction = ((percentage / (transactionAmount*2)) * 100);
                    getTransactionAmount.put(tAmount.id, sumTransaction);
                    System.debug(sumTransaction);
                    
                }
                else if(tAmount.Frequency__c=='Bi-Weekly'&& transactionAmount!=0){
                    sumTransaction = ((percentage / (transactionAmount*2.16)) * 100);
                    getTransactionAmount.put(tAmount.id, sumTransaction); 
                    System.debug(sumTransaction);
                    
                }
                else if(tAmount.Frequency__c=='Weekly'&& transactionAmount!=0){
                    sumTransaction = ((percentage /(transactionAmount*4.33)) * 100);
                    getTransactionAmount.put(tAmount.id, sumTransaction);
                    System.debug(sumTransaction);
                    
                    
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
                //System.debug('the percentage id for expense :'+ sumTransaction);
                System.debug('the map key and value for expense are:'+ getTransactionAmountTotalExpense );
            }
            String vExp =  valTransExp.format();
            Double valTransLoan = 0 ;
            Map<Id ,Double> getTransactionAmountLoan = new Map<Id, Double>();
            Map<Id ,String> getTransactionAmountTotalLoan = new Map<Id, String>();
            for(FinServ__FinancialAccount__c tAmount : loanRecord){
                System.debug('loan record');
                Double percentage = 0;
                Double sumLoanTransaction=0;
                System.debug('loan record Id'+tAmount.Id);
                System.debug(tAmount.Financial_Account_Transactions__r);
                for(FinServ__FinancialAccountTransaction__c tTransaction : tAmount.Financial_Account_Transactions__r ){
                    percentage = percentage + tTransaction.FinServ__Amount__c ;
                    sumLoanTransaction=tTransaction.FinServ__FinancialAccount__r.FinServ__PaymentAmount__c;
                    System.debug(percentage);
                    //sumTransactionLoan = ((percentage / tTransaction.FinServ__FinancialAccount__r.FinServ__PaymentAmount__c) * 100);
                    //getTransactionAmountLoan.put(tAmount.id, sumTransactionLoan);
                    
                    valTransLoan = valTransLoan + tTransaction.FinServ__Amount__c ;   
                }
                if (tAmount.FinServ__PaymentFrequency__c=='Monthly' && sumLoanTransaction!=0){
                    sumTransaction = ((percentage / sumLoanTransaction) * 100);
                    getTransactionAmountLoan.put(tAmount.id, sumTransaction);
                    System.debug(sumTransaction);
                }  
                else if (tAmount.FinServ__PaymentFrequency__c=='Semi Monthly'&& sumLoanTransaction!=0){
                    sumTransaction = ((percentage / (sumLoanTransaction*2)) * 100);
                    getTransactionAmountLoan.put(tAmount.id, sumTransaction);
                    System.debug(sumTransaction);
                    
                }
                else if(tAmount.FinServ__PaymentFrequency__c=='Biweekly'&& sumLoanTransaction!=0){
                    sumTransaction = ((percentage / (sumLoanTransaction*2.16)) * 100);
                    getTransactionAmountLoan.put(tAmount.id, sumTransaction); 
                    System.debug(sumTransaction);
                    
                }
                else if(tAmount.FinServ__PaymentFrequency__c=='Weekly'&& sumLoanTransaction!=0){
                    sumTransaction = ((percentage /(sumLoanTransaction*4.33)) * 100);
                    getTransactionAmountLoan.put(tAmount.id, sumTransaction);
                    System.debug(sumTransaction);
                    
                    
                }
                getTransactionAmountTotalLoan.put(tAmount.id, percentage.format());
                //  System.debug('the percentage id for loan is :'+ sumTransactionLoan);
                System.debug('the map key and value for loan are:'+ getTransactionAmountTotalLoan );
            }
            String vLoan =  valTransLoan.format();
            System.debug('aaaa');
            wrapobj= new wrapIncome(IncomeRecord,num,expenseRecord ,expenseSum ,goalRecord, goalSum , loanRecord , loanSum, acc,isportalEnabled ,
                                    sumTransaction , getTransactionAmount ,getTransactionAmountExpense,getTransactionAmountLoan,
                                    getTransactionAmountIncome,getTransactionAmountTotalExpense,getTransactionAmountTotalLoan,
                                    vInc , vExp , vLoan);  
                    System.debug('1'+wrapobj);

        }
        catch(Exception e){
            System.debug(e.getStackTraceString());
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        System.debug('2'+wrapobj);
        return wrapobj;
        
    }
    
}
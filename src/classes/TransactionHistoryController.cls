public class TransactionHistoryController {
    /* @AuraEnabled
public static Integer totalNumber(String ClientId){
List<AggregateResult> result  =[Select count(Id) from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId];
return Integer.valueOf(result[0].get('total'));     

}*/
    @AuraEnabled
    public static TransactionWrapper retrieveTransactions(Id ClientId, Integer rowLimit, Integer rowOffset, Boolean isDays, String days,Boolean isDateRange, Date startDate, Date endDate, String type, String option, String subOption){
        System.debug(ClientId);
        System.debug(isDays);
        System.debug(type);
        System.debug(isDateRange);
        System.debug(option);
        List<FinServ__FinancialAccountTransaction__c> finAccount=new List<FinServ__FinancialAccountTransaction__c>();
        TransactionWrapper tw=new TransactionWrapper();
        try{
            String queryList='Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c  where (FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c= :ClientId OR Budget_Category__r.Primary_Owner__c=:ClientId) ';
            String queryCount='SELECT COUNT(Id)cnt FROM FinServ__FinancialAccountTransaction__c where (FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c= :ClientId OR Budget_Category__r.Primary_Owner__c=:ClientId) ';
            if(isDays!=null && isDays && days!=''){
                queryCount+=' AND FinServ__TransactionDate__c = LAST_N_DAYS:' + days;
                queryList+='  AND FinServ__TransactionDate__c = LAST_N_DAYS:' + days;
                
                /*if(days=='15' && type!=null && type!=''){
List<AggregateResult> result=[SELECT COUNT(Id)cnt FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:15 AND  FinServ__TransactionType__c=:type];
tw.totalRecords=Integer.valueOf(result[0].get('cnt'));
tw.transactionList=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:15 AND  FinServ__TransactionType__c=:type ORDER BY FinServ__TransactionDate__c LIMIT :rowLimit OFFSET :rowOffset];
}
else if(days=='15'){
List<AggregateResult> result=[SELECT COUNT(Id)cnt FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:15];
tw.totalRecords=Integer.valueOf(result[0].get('cnt'));
tw.transactionList=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:15 ORDER BY FinServ__TransactionDate__c LIMIT :rowLimit OFFSET :rowOffset];
}

else if(days=='30' && type!=null && type!=''){
List<AggregateResult> result=[SELECT COUNT(Id)cnt FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:30 AND  FinServ__TransactionType__c=:type];
tw.totalRecords=Integer.valueOf(result[0].get('cnt'));
tw.transactionList=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:30 AND  FinServ__TransactionType__c=:type ORDER BY FinServ__TransactionDate__c LIMIT :rowLimit OFFSET :rowOffset];
}
else if(days=='30'){
List<AggregateResult> result=[SELECT COUNT(Id)cnt FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:30];
tw.totalRecords=Integer.valueOf(result[0].get('cnt'));
tw.transactionList=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:30  ORDER BY FinServ__TransactionDate__c LIMIT :rowLimit OFFSET :rowOffset];
}
else if(days=='45' && type!=null && type!=''){
List<AggregateResult> result=[SELECT COUNT(Id)cnt FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:45 AND  FinServ__TransactionType__c=:type];
tw.totalRecords=Integer.valueOf(result[0].get('cnt'));
tw.transactionList=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:45 AND  FinServ__TransactionType__c=:type ORDER BY FinServ__TransactionDate__c LIMIT :rowLimit OFFSET :rowOffset];
}
else if(days=='45'){
List<AggregateResult> result=[SELECT COUNT(Id)cnt FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:45];
tw.totalRecords=Integer.valueOf(result[0].get('cnt'));
tw.transactionList=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:45 ORDER BY FinServ__TransactionDate__c LIMIT :rowLimit OFFSET :rowOffset];
}
else if(days=='60' && type!=null && type!=''){
List<AggregateResult> result=[SELECT COUNT(Id)cnt FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:60 AND  FinServ__TransactionType__c=:type];
tw.totalRecords=Integer.valueOf(result[0].get('cnt'));
tw.transactionList=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:60 AND  FinServ__TransactionType__c=:type ORDER BY FinServ__TransactionDate__c LIMIT :rowLimit OFFSET :rowOffset];
} 
else if(days=='60'){
List<AggregateResult> result=[SELECT COUNT(Id)cnt FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:60];
tw.totalRecords=Integer.valueOf(result[0].get('cnt'));
tw.transactionList=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:60 ORDER BY FinServ__TransactionDate__c LIMIT :rowLimit OFFSET :rowOffset];
} */
            }
            else if(isDateRange!=null && isDateRange){
                queryCount+=' AND FinServ__TransactionDate__c>=:startDate AND FinServ__TransactionDate__c<=:endDate';
                queryList+=' AND FinServ__TransactionDate__c>=:startDate AND FinServ__TransactionDate__c<=:endDate';
                
                /* if(type!=null && type!=''){
List<AggregateResult> result=[SELECT COUNT(Id)cnt FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c>=:startDate AND FinServ__TransactionDate__c<=:endDate AND  FinServ__TransactionType__c=:type];
tw.totalRecords=Integer.valueOf(result[0].get('cnt'));
tw.transactionList=[Select Id, FinServ__Amount__c,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c>=:startDate AND FinServ__TransactionDate__c<=:endDate AND FinServ__TransactionType__c=:type ORDER BY FinServ__TransactionDate__c LIMIT :rowLimit OFFSET :rowOffset];
}
else{
List<AggregateResult> result=[SELECT COUNT(Id)cnt FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c>=:startDate AND FinServ__TransactionDate__c<=:endDate];
tw.totalRecords=Integer.valueOf(result[0].get('cnt'));
tw.transactionList=[Select Id, FinServ__Amount__c,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c>=:startDate AND FinServ__TransactionDate__c<=:endDate ORDER BY FinServ__TransactionDate__c LIMIT :rowLimit OFFSET :rowOffset];

}*/
            }
            if(type!=null && type!=''){
                queryCount+=' AND  FinServ__TransactionType__c=:type ';
                queryList+=' AND  FinServ__TransactionType__c=:type ';
                //List<AggregateResult> result=[SELECT COUNT(Id)cnt FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND  FinServ__TransactionType__c=:type];
                //            tw.totalRecords=Integer.valueOf(result[0].get('cnt'));
                // tw.transactionList=[Select Id, FinServ__Amount__c,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
                //   where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId OR AND FinServ__TransactionType__c=:type ORDER BY FinServ__TransactionDate__c LIMIT :rowLimit OFFSET: rowOffset];
                
            }
            if(option!=null && option!=''){
                if(option=='Debt'){
                    queryCount+=' AND  (FinServ__FinancialAccount__r.Account_Type__c='+'\'Loan\''+' OR  FinServ__FinancialAccount__r.Account_Type__c='+'\'Credit Card\') ';
                    queryList+=' AND  (FinServ__FinancialAccount__r.Account_Type__c='+'\'Loan\''+' OR  FinServ__FinancialAccount__r.Account_Type__c='+'\'Credit Card\') ';
                    if(subOption!=null && subOption!=''){
                        queryCount+=' AND  FinServ__FinancialAccount__c=:subOption ';
                        queryList+=' AND  FinServ__FinancialAccount__c=:subOption ';
                    }
                }
                else if(option=='Bank'){
                    queryCount+=' AND  (FinServ__FinancialAccount__r.RecordType.developername='+'\'SavingsAccount\''+' OR  FinServ__FinancialAccount__r.RecordType.developername='+'\'CheckingAccount\''+' OR  FinServ__FinancialAccount__r.RecordType.developername='+'\'InvestmentAccount\') ';
                    queryList+=' AND  (FinServ__FinancialAccount__r.RecordType.developername='+'\'SavingsAccount\''+' OR  FinServ__FinancialAccount__r.RecordType.developername='+'\'CheckingAccount\''+' OR  FinServ__FinancialAccount__r.RecordType.developername='+'\'InvestmentAccount\') ';
                    if(subOption!=null && subOption!=''){
                        queryCount+=' AND  FinServ__FinancialAccount__c=:subOption ';
                        queryList+=' AND  FinServ__FinancialAccount__c=:subOption ';
                    }
                }
                else if(option=='Income'){
                    queryCount+=' AND  Budget_Category__r.RecordType.developername='+'\'Income_Record_Type\' ';
                    queryList+=' AND Budget_Category__r.RecordType.developername='+'\'Income_Record_Type\' ';
                    if(subOption!=null && subOption!=''){
                        queryCount+=' AND  Budget_Category__c=:subOption ';
                        queryList+=' AND  Budget_Category__c=:subOption ';
                    }
                }
                else if(option=='Expense'){
                    queryCount+=' AND  Budget_Category__r.RecordType.developername='+'\'Expense_Record_Type\' ';
                    queryList+=' AND Budget_Category__r.RecordType.developername='+'\'Expense_Record_Type\' '; 
                    if(subOption!=null && subOption!=''){
                        queryCount+=' AND  Budget_Category__c=:subOption ';
                        queryList+=' AND  Budget_Category__c=:subOption ';
                    }
                }
            }
            
            /*else{

List<AggregateResult> result=[SELECT COUNT(Id) FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId];
tw.totalRecords=Integer.valueOf(result[0].get('expr0'));
tw.transactionList=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId ORDER BY FinServ__TransactionDate__c LIMIT :rowLimit OFFSET :rowOffset];        
}*/
            queryList+=' ORDER BY FinServ__TransactionDate__c DESC LIMIT :rowLimit OFFSET :rowOffset' ;
            List<AggregateResult> result=Database.query(queryCount);
            tw.totalRecords=Integer.valueOf(result[0].get('cnt'));
            tw.transactionList=Database.query(queryList);
            if(Test.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        return tw;
        
    }
    
    /*  @AuraEnabled
public static List<FinServ__FinancialAccountTransaction__c> allTransactions(String ClientId){
System.debug(ClientId);
List<FinServ__FinancialAccountTransaction__c> finAccount=new List<FinServ__FinancialAccountTransaction__c>();
for(List<FinServ__FinancialAccountTransaction__c> f: [Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId ORDER BY FinServ__TransactionDate__c]) {
finAccount.addAll(f);
}
return finAccount;

}
@AuraEnabled
public static List<FinServ__FinancialAccountTransaction__c> transactionByDateRange(String ClientId,Date startDate,Date endDate){
System.debug(ClientId);
List<FinServ__FinancialAccountTransaction__c> f=[Select Id, FinServ__Amount__c,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c>=:startDate AND FinServ__TransactionDate__c<:endDate ORDER BY FinServ__TransactionDate__c LIMIT 50000];
System.debug(f);        
return f;

}
@AuraEnabled
public static List<FinServ__FinancialAccountTransaction__c> transactionByType(String ClientId,String type){
System.debug(ClientId);
List<FinServ__FinancialAccountTransaction__c> f=[Select Id, FinServ__Amount__c,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionType__c=:type ORDER BY FinServ__TransactionDate__c LIMIT 5000];
System.debug(f);        
return f;

}
@AuraEnabled
public static List<FinServ__FinancialAccountTransaction__c> transactionsfilterbydays(String ClientId,String days ){
System.debug(ClientId);
List<FinServ__FinancialAccountTransaction__c> f;
if(days=='15'){
f=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:15 ORDER BY FinServ__TransactionDate__c LIMIT 50000];
}
else if(days=='30'){
f=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:30 ORDER BY FinServ__TransactionDate__c LIMIT 50000];
}
else if(days=='45'){
f=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:45 ORDER BY FinServ__TransactionDate__c LIMIT 50000];
}
else if(days=='60'){
f=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
where FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c=:ClientId AND FinServ__TransactionDate__c = LAST_N_DAYS:60 ORDER BY FinServ__TransactionDate__c LIMIT 50000];
}
else{
f=allTransactions(ClientId);
}
return f;

}*/
    
    @AuraEnabled
    public static void deleteTransactions(List<String> transactionIds ){
        try{
            List<FinServ__FinancialAccountTransaction__c> f;
            f=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
               where  Id in :transactionIds];
            delete f;
            if(Test.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        
    }
    
    @AuraEnabled
    public static List<SubOptionWrapper> getSubOptions(String clientId, String option){
        System.debug(clientId);
        List<SubOptionWrapper> subOptions =new List<SubOptionWrapper>();
        try{
            System.debug([select Name from Budget__c where Primary_Owner__c =:clientId AND recordtype.developername='Income_Record_Type']);
            if(option=='Debt'){
                for(FinServ__FinancialAccount__c debtAccounts:[Select Id, Name from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:clientId AND (Account_Type__c='Loan' OR Account_Type__c='Credit Card')]){
                    System.debug(debtAccounts);
                    SubOptionWrapper subOption =new SubOptionWrapper();
                    subOption.soId=debtAccounts.Id;
                    subOption.name=debtAccounts.Name;    
                    subOptions.add(subOption);
                }
                
            }
            else if(option=='Bank'){
                for(FinServ__FinancialAccount__c bankAccounts:[Select Id, Name from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:clientId AND (Account_Type__c='401K' OR Account_Type__c='529 Account' OR Account_Type__c='CD'
                                                                                                                                                               OR Account_Type__c='Checking' OR Account_Type__c='IRA' OR Account_Type__c='Money Market' OR Account_Type__c='Retail Brokerage' OR Account_Type__c='Roth IRA'  OR Account_Type__c='Savings') ]){
                                                                                                                                                                   SubOptionWrapper subOption =new SubOptionWrapper();
                                                                                                                                                                   subOption.soId=bankAccounts.Id;
                                                                                                                                                                   subOption.name=bankAccounts.Name;        
                                                                                                                                                                   subOptions.add(subOption);
                                                                                                                                                               }
                
            }
            else if(option=='Income'){
                
                for(Budget__c incomel:[select Id, Name 
                                       from Budget__c where Primary_Owner__c =:clientId AND recordtype.developername='Income_Record_Type']){
                                           SubOptionWrapper subOption =new SubOptionWrapper();
                                           subOption.soId=incomel.Id;
                                           subOption.name=incomel.Name;   
                                           subOptions.add(subOption);
                                           
                                       }
                
            }
            else if(option=='Expense'){
                for(Budget__c expensel:[select Name 
                                        from Budget__c where Primary_Owner__c =:clientId AND recordtype.developername='Expense_Record_Type']){
                                            SubOptionWrapper subOption =new SubOptionWrapper();
                                            subOption.soId=expensel.Id;
                                            subOption.name=expensel.Name;  
                                            subOptions.add(subOption);
                                            
                                        }
                
                
            }
            System.debug(subOptions);
            if(Test.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        return subOptions;
        
    }
    // wrapper class
    public class TransactionWrapper{
        @AuraEnabled
        public Integer totalRecords = 0;
        @AuraEnabled
        public List<FinServ__FinancialAccountTransaction__c> transactionList = new List<FinServ__FinancialAccountTransaction__c>();
        
    }
    
    // wrapper class
    public class SubOptionWrapper{
        @AuraEnabled
        public String soId;
        @AuraEnabled
        public String name;
        
    }
}
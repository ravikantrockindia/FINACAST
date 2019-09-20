public class AccountTabReport {       
     public class ObjectWrapper{
        @AuraEnabled public  Map<String, Decimal> cashInValue{get; set;}
        @AuraEnabled public  Map<String, Decimal> cashOutValue{get; set;}
        public ObjectWrapper( Map<String, Decimal> cashInValue,  Map<String, Decimal> cashOutValue ){
            this.cashInValue = cashInValue;
            this.cashOutValue = cashOutValue;
            
        }  
    }
    @auraEnabled
    public static ObjectWrapper getTransction(String AccountId ){  
        system.debug(AccountId);
        ObjectWrapper wrapAccountList;
        
   
        list<FinServ__FinancialAccountTransaction__c> fatList = new list<FinServ__FinancialAccountTransaction__c>();
        
        String monthYear;
       
        fatList= [select  id, FinServ__Amount__c,FinServ__TransactionDate__c, FinServ__TransactionType__c	 FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.id=:AccountId  AND FinServ__TransactionDate__c = LAST_N_MONTHS:12 ORDER BY FinServ__TransactionDate__c ];
        System.debug('fatList----' +fatList);
        Map<String, Decimal> cashIn = new Map<String, Decimal>(); 
        Map<String, Decimal> cashOut = new Map<String, Decimal>(); 
        
        Integer currentMonth = Date.today().month();
        system.debug('currentMonth'+currentMonth);
        Integer currentYear = Date.today().year();
        system.debug('currentYear'+currentYear);
        
        List<String> previousMonths=new List<String>();
        while(previousMonths.size()<12){
            if(currentMonth==1 && currentYear==Date.today().year()){
                currentYear=currentYear-1;
                currentMonth=12;
                String monthYearValue =  currentMonth +' '+currentYear;
                 system.debug('monthYearValue'+monthYearValue);
                previousMonths.add(monthYearValue);
               
            }
            else{
                String monthYearValue = (currentMonth-1) +' '+(currentYear);
                previousMonths.add(monthYearValue);
                currentMonth=currentMonth-1;
                
            }
        }
        for(Integer i=previousMonths.size()-1;i>=0;i--){
            cashOut.put(previousMonths[i],0); 
            cashIn.put(previousMonths[i],0);
        }
        for(FinServ__FinancialAccountTransaction__c stt : fatList){
            monthYear =  stt.FinServ__TransactionDate__c.month() +' '+stt.FinServ__TransactionDate__c.year();
            if(stt.FinServ__TransactionType__c=='Debit'){
                if(cashOut.containsKey(monthYear)){
                    Decimal totalamt=stt.FinServ__Amount__c+cashout.get(monthYear);
                    cashOut.put(monthYear,totalamt);
                }
               else{
                    cashOut.put(monthYear,stt.FinServ__Amount__c);
                }
            }
            else{
                if(cashIn.containsKey(monthYear)){
                    Decimal totalamt=stt.FinServ__Amount__c+cashIn.get(monthYear);
                    cashIn.put(monthYear,totalamt);
                }
                else{
                    cashIn.put(monthYear,stt.FinServ__Amount__c);
                }
            }
        }
        wrapAccountList = new ObjectWrapper(cashIn, cashout);
        system.debug('wrapAccountList'+wrapAccountList);
        return wrapAccountList;
    } 
    @auraEnabled
    public static List<FinServ__FinancialAccountTransaction__c> getTransctionList(String AccountId ){
        List<FinServ__FinancialAccountTransaction__c> ftl;
        try{
            ftl=[select  id, FinServ__Amount__c,FinServ__Description__c,FinServ__TransactionDate__c, FinServ__TransactionType__c	 FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.id=:AccountId ORDER BY FinServ__TransactionDate__c ];
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        return ftl;
    }
    @auraEnabled
    public static String getFinanaceAccountName(String AccountId ){
         
        List<FinServ__FinancialAccount__c> fl=new List<FinServ__FinancialAccount__c>();
        try{
            fl=[select name, (select id,name from Financial_Account_Transactions__r) from FinServ__FinancialAccount__c where id=:AccountId];
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        system.debug('name'+fl[0].name);
        return fl[0].name;
    }
    
    @auraEnabled
    public static void DeleteFinanceAccountTransaction(String FinanceAccountTxnId ){
        
        List<FinServ__FinancialAccountTransaction__c> fl=new List<FinServ__FinancialAccountTransaction__c>();
        try{
            fl=[select  id FROM FinServ__FinancialAccountTransaction__c where id =: FinanceAccountTxnId];
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        system.debug('name'+fl);
        delete fl;
    }
    
  
    
}
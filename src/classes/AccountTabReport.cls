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
       
        fatList= [select  id, FinServ__Amount__c,FinServ__TransactionDate__c, FinServ__TransactionType__c	 FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.id=:AccountId  AND (FinServ__TransactionDate__c = LAST_N_MONTHS:11 OR FinServ__TransactionDate__c= THIS_MONTH) ORDER BY FinServ__TransactionDate__c ];
        System.debug('fatList----' +fatList);
        Map<String, Decimal> cashIn = new Map<String, Decimal>(); 
        Map<String, Decimal> cashOut = new Map<String, Decimal>(); 
        
        Map<Integer,String> monthNameMap=new Map<Integer, String>{1 =>'January', 2=>'February', 3=>'March', 4=>'April', 5=>'May',
                                                                    6=>'June', 7=>'July', 8=>'August', 9=>'September',10=>'October',
                                                                    11=>'November', 12=>'December'};
                                                                        
                                                                        
      //  String cMonth=String.valueOf(Date.today().month());
      //  system.debug('cMonth'+cMonth
        Integer currentMonth = Date.today().month();
        DateTime dt = DateTime.now();
        String monthName = dt.format('MMMMM');
        System.debug('Month Name : ' + monthName);
       // system.debug('currentMonth'+currentMonth);
        Integer currentYear = Date.today().year();
      //  system.debug('currentYear'+currentYear);
        
        List<String> previousMonths=new List<String>();
        while(previousMonths.size()<6){
            if(monthName=='January' && currentYear==Date.today().year()){
                String monthYearValue =  monthName +' '+currentYear;
                //     system.debug('monthYearValue if'+monthYearValue);
                previousMonths.add(monthYearValue);
                currentYear=currentYear-1;
                currentMonth=12;
                monthName = monthNameMap.get(currentMonth);
                
            }
            else{
                String monthYearValue = monthName+' '+currentYear;
                system.debug('monthYearValue else'+monthYearValue);
                previousMonths.add(monthYearValue);
                currentMonth=currentMonth-1;
                monthName = monthNameMap.get(currentMonth);
                
                
            }
        //    system.debug('previous month value'+previousMonths);
        }
       system.debug('previous month value'+previousMonths);
        for(Integer i=previousMonths.size()-1;i>=0;i--){
            cashOut.put(previousMonths[i],0); 
            cashIn.put(previousMonths[i],0);
            
        }
        system.debug('cashout'+cashOut);
        system.debug('cashIn'+cashIn);
        for(FinServ__FinancialAccountTransaction__c stt : fatList){
            monthYear =  stt.FinServ__TransactionDate__c.month() +' '+stt.FinServ__TransactionDate__c.year();
            System.debug('month year----'+monthYear);
           	Integer mon=stt.FinServ__TransactionDate__c.month();
            String smon=monthNameMap.get(mon);
             //  monthYear =  stt.FinServ__TransactionDate__c.month() +' '+stt.FinServ__TransactionDate__c.year();
             monthYear = smon  +' '+stt.FinServ__TransactionDate__c.year();
            System.debug('month year----'+monthYear);
            if(stt.FinServ__TransactionType__c=='Debit'){
                if(cashOut.containsKey(monthYear)){
                    Decimal totalamt=stt.FinServ__Amount__c+cashout.get(monthYear);
                    system.debug('asdfgh DEBIT'+totalamt);
                    cashOut.put(monthYear,totalamt);
                }
              
            }
            else{
                if(cashIn.containsKey(monthYear)){
                    Decimal totalamt=stt.FinServ__Amount__c+cashIn.get(monthYear);
                    system.debug('credit'+totalamt);
                    cashIn.put(monthYear,totalamt);
                }
               
            }
        }
        wrapAccountList = new ObjectWrapper(cashIn, cashout);
        system.debug('wrapAccountList'+wrapAccountList);
        
        return wrapAccountList;
    } 
   // LAZY LOADING //
    @AuraEnabled
    public static FinancialAccountWrapper  getTotalRecords(String AccountId,Integer rowOffset,Integer rowLimit){
        
        FinancialAccountWrapper faw=new FinancialAccountWrapper();
        List<FinServ__FinancialAccountTransaction__c> result;
        try{
            faw.FinancialAccountList  =[Select Id,TransactionName__c,FinServ__Amount__c,FinServ__Description__c,FinServ__TransactionDate__c, FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.id=:AccountId  order by FinServ__TransactionDate__c DESC LIMIT :rowLimit OFFSET :rowOffset];
            faw.FinancialAccountTotalRecords=[Select COUNT() from FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.id=:AccountId];
       	 
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return faw; 

    }
    
    @auraEnabled
    public static List<FinServ__FinancialAccountTransaction__c> getTransctionList(String AccountId ,Integer rowLimit,Integer rowOffset){
        List<FinServ__FinancialAccountTransaction__c> ftl;
        try{
            ftl=[select  id,TransactionName__c, FinServ__Amount__c,FinServ__Description__c,FinServ__TransactionDate__c, FinServ__TransactionType__c	 FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.id=:AccountId ORDER BY FinServ__TransactionDate__c LIMIT :rowLimit OFFSET :rowOffset ];
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
    
    @auraEnabled
    public static List<FinServ__FinancialAccount__c> getFinanaceAccountOpenDate(String AccountId ){
         
        List<FinServ__FinancialAccount__c> fl=new List<FinServ__FinancialAccount__c>();
        try{
            fl=[select name, FinServ__OpenDate__c ,(select id,name from Financial_Account_Transactions__r) from FinServ__FinancialAccount__c where id=:AccountId];
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
         system.debug('opendate'+fl[0].FinServ__OpenDate__c);
        //return fl[0].FinServ__OpenDate__c;
        return fl;
    }
    public class FinancialAccountWrapper{
        @AuraEnabled
       // public List<FinServ__FinancialAccountTransaction__c> FinancialAccountTotalRecords = new List<FinServ__FinancialAccountTransaction__c>();
        public Integer FinancialAccountTotalRecords = 0;
        @AuraEnabled
        public List<FinServ__FinancialAccountTransaction__c> FinancialAccountList = new List<FinServ__FinancialAccountTransaction__c>();
        
    }
    
  
    
}
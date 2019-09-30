public class CashFlowGraphData {
    
    @auraEnabled
    public static ObjectWrapper getTransctionLoanSavingAmount( string clientId ){  
        ObjectWrapper wrapAccountList;
        
        list<FinServ__FinancialAccount__c> Facclist = new list<FinServ__FinancialAccount__c>();
        list<FinServ__FinancialAccountTransaction__c> fatList = new list<FinServ__FinancialAccountTransaction__c>();
        
        String monthYear;
        Facclist = [select id FROM FinServ__FinancialAccount__c where (Account_Type__c='Savings' OR Account_Type__c='Checking' OR Account_Type__c='CD' OR Account_Type__c='Money Market')AND FinServ__PrimaryOwner__c=:clientId];
        
        Set<Id> ids = new Set<Id>();
        for(FinServ__FinancialAccount__c idd : Facclist){    
            ids.add(idd.id);
        }
        fatList= [select  id, FinServ__Amount__c,FinServ__TransactionDate__c, FinServ__TransactionType__c	 FROM FinServ__FinancialAccountTransaction__c where FinServ__FinancialAccount__r.id IN :ids AND FinServ__TransactionDate__c = LAST_N_MONTHS:12 ORDER BY FinServ__TransactionDate__c ];
        System.debug('fatList----' +fatList);
        Map<String, Decimal> cashIn = new Map<String, Decimal>(); 
        Map<String, Decimal> cashOut = new Map<String, Decimal>(); 
        
        Integer currentMonth = Date.today().month();
        Integer currentYear = Date.today().year();
        List<String> previousMonths=new List<String>();
        while(previousMonths.size()<6){
            if(currentMonth==1 && currentYear==Date.today().year()){
                currentYear=currentYear-1;
                currentMonth=12;
                String monthYearValue =  currentMonth +' '+currentYear;
                previousMonths.add(monthYearValue);
            }
            else{
                String monthYearValue = currentMonth +' '+(currentYear);
                previousMonths.add(monthYearValue);
                currentMonth=currentMonth-1;
                
            }}
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
                
            }
            else{
                if(cashIn.containsKey(monthYear)){
                    Decimal totalamt=stt.FinServ__Amount__c+cashIn.get(monthYear);
                    cashIn.put(monthYear,totalamt);
                }
                
            }
        }
        wrapAccountList = new ObjectWrapper(cashIn, cashout);
        return wrapAccountList;
    } 
    
    public class ObjectWrapper{
        @AuraEnabled public  Map<String, Decimal> cashInValue{get; set;}
        @AuraEnabled public  Map<String, Decimal> cashOutValue{get; set;}
        public ObjectWrapper( Map<String, Decimal> cashInValue,  Map<String, Decimal> cashOutValue ){
            this.cashInValue = cashInValue;
            this.cashOutValue = cashOutValue;
            
        }  
    }
}
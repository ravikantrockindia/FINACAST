public class CashFolwGraphIncome {
     
    @auraEnabled
    public static ObjectWrapper getTransctionLoanSavingAmount( string clientId ){  
        ObjectWrapper wrapAccountList;
        
         Budget__c bg = new Budget__c();
        bg = [Select id , name from Budget__c where id =: clientId]; 
        list<FinServ__FinancialAccountTransaction__c> TransList = new list<FinServ__FinancialAccountTransaction__c>();
        
        String monthYear;
       // Facclist = [select id FROM Budget__c where Primary_Owner__c=:clientId];
        
      
        TransList = [Select id , FinServ__TransactionDate__c, FinServ__Amount__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c where Budget_Category__c =: bg.id AND FinServ__TransactionDate__c >= LAST_N_MONTHS:6];
       // TransList= [select  id, FinServ__Amount__c,FinServ__TransactionDate__c, FinServ__TransactionType__c	 FROM FinServ__FinancialAccountTransaction__c where Budget_Category__c IN :ids AND FinServ__TransactionDate__c = LAST_N_MONTHS:12 ORDER BY FinServ__TransactionDate__c ];
        System.debug('TransList----' +TransList);
        Map<String, Decimal> cashIn = new Map<String, Decimal>(); 
        Map<String, Decimal> cashOut = new Map<String, Decimal>(); 
        
        Integer currentMonth = Date.today().month();
        Integer currentYear = Date.today().year();
        List<String> previousMonths=new List<String>();
        while(previousMonths.size()<6){
            if(currentMonth==1 && currentYear==Date.today().year()){
               
                String monthYearValue =  currentMonth +' '+currentYear;
                previousMonths.add(monthYearValue);
                 currentYear=currentYear-1;
                currentMonth=12;
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
        for(FinServ__FinancialAccountTransaction__c stt : TransList){
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
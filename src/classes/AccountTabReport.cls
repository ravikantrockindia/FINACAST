public class AccountTabReport {       
    //get Cash Summary Transaction //Ravikant
    @auraEnabled    
    public static List<FinServ__FinancialAccountTransaction__c> getCashSummary(String AccountId) {
        System.debug('account ID '+AccountId);
        List<FinServ__FinancialAccountTransaction__c> transactionRecord = new List<FinServ__FinancialAccountTransaction__c>();
        Date startDate =(Date)System.today();
        transactionRecord = [Select id ,TransactionName__c, FinServ__TransactionDate__c , FinServ__Description__c, Destination_Financial_Account__c ,Destination_Financial_Account__r.name, FinServ__Amount__c 
                             from FinServ__FinancialAccountTransaction__c 
                             where FinServ__FinancialAccount__c=:AccountId AND FinServ__TransactionDate__c <= :startDate AND FinServ__TransactionDate__c >= LAST_N_MONTHS:5];
        System.debug('value of Transaction Record '+transactionRecord);
         
                        
        return transactionRecord;
    }
     @AuraEnabled
    public static String getNameSpace(){
        return NamespaceUtility.returnNamespace();
    }
    //End ravikant
}
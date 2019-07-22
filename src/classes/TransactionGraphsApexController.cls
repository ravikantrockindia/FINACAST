/****************************************Created by: Aditya Kaushal
This class returns transactiosn for a Financial account selected
Acts as an apex controller for Summary Graph on Financial Graph***********************************/
public class TransactionGraphsApexController {
    
    @auraEnabled
    public static List<FinServ__FinancialAccountTransaction__c> getTransaction(String Id) {
        
        //Date startDate =(Date)System.today();
        
        List<FinServ__FinancialAccountTransaction__c> transactionList = new List<FinServ__FinancialAccountTransaction__c>();
        
            transactionList = [Select id , FinServ__TransactionDate__c, FinServ__Amount__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c
                               where FinServ__FinancialAccount__c =: Id ];
            //AND FinServ__TransactionDate__c <= :startDate AND FinServ__TransactionDate__c >= LAST_N_MONTHS:5
        
        System.debug('transaction List' + transactionList);
        return transactionList;
    }
}
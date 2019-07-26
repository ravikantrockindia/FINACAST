public class GetTransction {
    
    @auraEnabled
    public static list<FinServ__FinancialAccount__c> getTransction(String transction, string clientId ){   
        Id recTypeId = Schema.getGlobalDescribe().get('FinServ__FinancialAccount__c').getDescribe().getRecordTypeInfosByName().get('Savings Account').getRecordTypeId();
        Id recTypeId1 = Schema.getGlobalDescribe().get('FinServ__FinancialAccount__c').getDescribe().getRecordTypeInfosByName().get('Loan Account').getRecordTypeId();
        list<FinServ__FinancialAccount__c> Facclist = new list<FinServ__FinancialAccount__c>();
        if(transction =='Saving'){
            Facclist= [select name from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:clientId AND RecordTypeId =:recTypeId];
        }
        if(transction =='Debt'){
            Facclist= [select name from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:clientId AND RecordTypeId =:recTypeId1];
        }
        system.debug('Facclist'+Facclist);
        return Facclist;
    }   
    
    @auraEnabled
    public static list<Budget__c> getBudget(String transction, string clientId ){ 
         String namespace=NamespaceUtility.returnNamespace();
        String objectName=namespace+'Budget__c';
        Id recTypeId = Schema.getGlobalDescribe().get(objectName).getDescribe().getRecordTypeInfosByName().get('Expense Record Type').getRecordTypeId();
        list<Budget__c> Facclist = new list<Budget__c>();
        if(transction =='Expense'){
            Facclist= [select name from Budget__c where Primary_Owner__c=:clientId AND RecordTypeId =:recTypeId];
        }
        system.debug('Facclist'+Facclist);
        return Facclist;
    } 
    
}
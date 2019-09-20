trigger UpdateFinancialAccountBalance on FinServ__FinancialAccountTransaction__c (after insert, after update,after delete) {
    Map<Id, FinServ__FinancialAccount__c> f;
    if(Trigger.isInsert || Trigger.isUpdate)
    f=new Map<ID, FinServ__FinancialAccount__c>([Select Id,FinServ__Balance__c ,FinServ__LoanAmount__c,Account_Type__c from FinServ__FinancialAccount__c where Id in (SELECT FinServ__FinancialAccount__c FROM FinServ__FinancialAccountTransaction__c where Id in: Trigger.newMap.keySet())]);
    else
            f=new Map<ID, FinServ__FinancialAccount__c>([Select Id,FinServ__Balance__c ,FinServ__LoanAmount__c,Account_Type__c from FinServ__FinancialAccount__c where Id in (SELECT FinServ__FinancialAccount__c FROM FinServ__FinancialAccountTransaction__c where Id in: Trigger.oldMap.keySet())]);

    if (Trigger.isInsert) {
        if(!f.isEmpty()){
            for (FinServ__FinancialAccountTransaction__c transactions: Trigger.new) {
                if(transactions.FinServ__TransactionType__c=='Credit'){
                    //FinServ__FinancialAccount__c acc=f.get(transactions.FinServ__FinancialAccount__c);
                    /*  if(acc.Account_Type__c=='Loan'|| acc.Account_Type__c=='Credit Card'){
f.get(transactions.FinServ__FinancialAccount__c).FinServ__Balance__c+=transactions.FinServ__Amount__c;

}*/
                    f.get(transactions.FinServ__FinancialAccount__c).FinServ__Balance__c+=transactions.FinServ__Amount__c;
                }
                else
                    f.get(transactions.FinServ__FinancialAccount__c).FinServ__Balance__c-=transactions.FinServ__Amount__c;
            }
        }
    }
    if (Trigger.isUpdate) {
        if(!f.isEmpty()){
            
            for(FinServ__FinancialAccountTransaction__c transactions: Trigger.new) {
                
                if(transactions.FinServ__TransactionType__c=='Credit'){
                    f.get(transactions.FinServ__FinancialAccount__c).FinServ__Balance__c-=Trigger.oldMap.get(transactions.Id).FinServ__Amount__c;
                    f.get(transactions.FinServ__FinancialAccount__c).FinServ__Balance__c+=transactions.FinServ__Amount__c;
                }
                else{
                    f.get(transactions.FinServ__FinancialAccount__c).FinServ__Balance__c+=Trigger.oldMap.get(transactions.Id).FinServ__Amount__c;
                    
                    f.get(transactions.FinServ__FinancialAccount__c).FinServ__Balance__c-=transactions.FinServ__Amount__c;
                }
            }
        }
    }
    if (Trigger.isDelete) {
        if(!f.isEmpty()){
            
            for(FinServ__FinancialAccountTransaction__c transactions: Trigger.old) {
                
                if(transactions.FinServ__TransactionType__c=='Credit'){
                    f.get(transactions.FinServ__FinancialAccount__c).FinServ__Balance__c-=Trigger.oldMap.get(transactions.Id).FinServ__Amount__c;
                }
                else{
                    f.get(transactions.FinServ__FinancialAccount__c).FinServ__Balance__c+=Trigger.oldMap.get(transactions.Id).FinServ__Amount__c;
                    
                }
            }
        }
    }
    System.debug(f);
    update f.values();
    
}
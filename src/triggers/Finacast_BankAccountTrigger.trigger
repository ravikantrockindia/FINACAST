trigger Finacast_BankAccountTrigger on FinServ__FinancialAccount__c (after insert,before insert , before delete , before update) {
    
    if(trigger.isinsert && trigger.isafter){
        FinacastBankAccountHelper.shareBankAccount(trigger.new);    
    }
    
    else if(trigger.isinsert && trigger.isbefore){   
        FinacastBankAccountHelper.updateOwnerforPortalBankAcc(trigger.new);
    }
    
    if(trigger.isDelete && trigger.isbefore){
        FinacastBankAccountHelper.deleteItem();
    }
    
}
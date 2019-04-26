trigger Finacast_BudgetTrigger on Budget__c (before insert , after insert ) {
    System.debug('outside if');
    if(trigger.isinsert && trigger.isafter){
        
        FinacastBudgetHelper.shareBudget(trigger.newMap.keySet());    
        FinacastBudgetHelper.householdAccount(trigger.newMap.keySet()); 
    }
    
}
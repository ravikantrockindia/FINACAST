trigger Finacast_GoalTrigger on FinServ__FinancialGoal__c (after insert,before insert) {
    
    if(trigger.isinsert && trigger.isafter){
        FinacastGoalHelper.shareGoal(trigger.new);    
    }
    
    else if(trigger.isinsert && trigger.isbefore){
        system.debug('dvdvdbbf');
        FinacastGoalHelper.updateOwnerforPortalGoals(trigger.new);
    }
    
    
    
}
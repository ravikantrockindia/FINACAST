trigger DeleteGoal on FinServ__FinancialAccount__c (before delete) {
/*
    List<FinServ__FinancialAccount__c>  finAccountList = [Select id,(SELECT Id FROM Financial_Goals__r)
                                                from FinServ__FinancialAccount__c where id IN :Trigger.Old];
    List<FinServ__FinancialGoal__c> FinGoalList = new List<FinServ__FinancialGoal__c>();
    
    for(FinServ__FinancialAccount__c finAccount: finAccountList) {
        List <FinServ__FinancialGoal__c> innerfinGoalList = finAccount.Financial_Goals__r;
        FinGoalList.addAll(innerfinGoalList);
    }
    System.debug(FinGoalList);*/
    //delete FinGoalList;
}
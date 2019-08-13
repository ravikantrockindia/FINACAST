public with sharing class  GoalTypeSelectionController {
    @auraEnabled
    public static id getRecordType(String recName)
    {
        Id recTypeid = Schema.SObjectType.FinServ__FinancialGoal__c.getRecordTypeInfosByDeveloperName().get(recName).getRecordTypeId();
        system.debug('AA'+rectypeid);
        return recTypeid;
    }
    
}
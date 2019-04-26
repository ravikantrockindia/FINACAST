/* Aditya Kaushal, Winter 18 */

    /* sets APY Values for Investment Record Types based on Model Portfolio */

trigger SetRiskProfile on FinServ__FinancialAccount__c (before insert, before update) {   
    for(FinServ__FinancialAccount__c ffa: trigger.new) {         
        if(ffa.recordtypeid == Schema.SObjectType.FinServ__FinancialAccount__c.getRecordTypeInfosByDeveloperName().get('InvestmentAccount').getRecordTypeId()){
            String goalriskProfile = ffa.FinServ__ModelPortfolio__c;            
            Model_Portfolio_Setting__mdt portfolio = [SELECT MasterLabel, Model_Portfolio_Percentage__c 
                                                      FROM Model_Portfolio_Setting__mdt where MasterLabel =: goalriskProfile];            
            ffa.FinServ__APY__c = portfolio.Model_Portfolio_Percentage__c;
        }          
    }
}
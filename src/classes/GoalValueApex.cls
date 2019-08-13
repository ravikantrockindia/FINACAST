public class GoalValueApex {
 @AuraEnabled
    public static List<FinServ__FinancialGoal__c> getTotalGoal(){
        List<FinServ__FinancialGoal__c> gl=new List<FinServ__FinancialGoal__c>();
        gl=[select id ,Name ,FinServ__TargetDate__c,FinServ__TargetValue__c from FinServ__FinancialGoal__c  Where createdById=:UserInfo.getUserId()];
          
        return gl;   
    }
}
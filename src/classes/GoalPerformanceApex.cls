public class GoalPerformanceApex {
    @AuraEnabled
    public static WrapperClass getGoalData(Id GoalId) {
        WrapperClass returnWrapperObject = new WrapperClass();
        try{
            FinServ__FinancialGoal__c GoalItem = [Select name, FinServ__TargetDate__c,
                                                  FinServ__TargetValue__c from 
                                                  FinServ__FinancialGoal__c where id =: GoalId];
            
            returnWrapperObject.item = GoalItem;    
            
            Date startDate =date.today();     
            Date endDate = GoalItem.FinServ__TargetDate__c;
            Integer numberOfMonths = startDate.monthsBetween(endDate);
            returnWrapperObject.monthCount = numberOfMonths;
            System.debug(returnWrapperObject);
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return returnWrapperObject;
    }
    
    public class WrapperClass {
        @AuraEnabled public FinServ__FinancialGoal__c item {get; set;}
        @AuraEnabled public Integer monthCount {get;set;}
    }
}
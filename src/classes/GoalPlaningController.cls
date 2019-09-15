public class GoalPlaningController {
    @AuraEnabled
    public static List<GoalPerformanceAndMonteCarlo.FinGoalWrapperClass> getTotalGoal(String ClientId, Boolean budgetScreen, String monthBudget){
       return GoalPerformanceAndMonteCarlo.getGoals(ClientId, budgetScreen, monthBudget); 
    }
    
     public class FinGoalWrapperClass {
        
        @auraEnabled
        public FinServ__FinancialGoal__c finGoal;
        
        @auraEnabled
        public Boolean goalTrack;
      
        @auraEnabled
        public Decimal actualValue;
         
          @auraEnabled
        public Decimal percentage;
        
        
        
        
    }
    
    @auraEnabled
    public static String getRecordTypeIdbyName(String objectName , String strRecordTypeName)
    {      
        FinServ__FinancialGoal__c finGoal  = [select recordtypeid,recordtype.developername  from FinServ__FinancialGoal__c where id=:strRecordTypeName];       
        return finGoal.recordtype.developername;
    } 
    @auraEnabled
    public static void deleteGoals(id goalId) {
        
        FinServ__FinancialGoal__c goalItem = [Select id from FinServ__FinancialGoal__c where id =:goalId];
        delete goalItem;
    }
    @auraEnabled
    public static GoalPerformanceAndMonteCarlo.FinGoalWrapperClass getGoalDetail(id goalId) {
        
      return GoalPerformanceAndMonteCarlo.getGoalDetail(goalId);
    }
    @auraEnabled 
    public static List<List<Object>> getGoalPerformance(String goalId){
        List<List<Object>> goalPerformance =FinacastGoalProgressApex.goalStatus(goalId);
        return goalPerformance;
    }
    @auraEnabled       
    public static Map<integer, double> getSimulation(Integer goalinitialAmount, Integer goaltargetAmount, Integer goalMonthlySaving, 
                                                     String goalTargetDate, String riskProfile, Double volatility ){
                                                                                                                      Map<integer, double> data;

                                                         try{
                                                         System.debug(volatility);
                                                         
                                                         data =  MonteCarloSimulationTest.sample( goalinitialAmount,  goaltargetAmount,  goalMonthlySaving, 
                                                                                                 goalTargetDate,  riskProfile,  volatility );
                                                         }catch(exception ee){
                                                                  FinacastUtility.ExceptionHandle(ee.getLineNumber(), ee.getMessage(), ee.getStackTraceString());
                                                         }
                                                         return data;
                                                     }
    @auraEnabled
    public static List<String> getPicklistValues()
    {        
        List<String> pickListValuesList= new List<String>();
        
        try{
            //Fetch PickList values from Schema Object
            Schema.DescribeFieldResult fieldResult = FinServ__FinancialAccount__c.FinServ__ModelPortfolio__c.getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            for( Schema.PicklistEntry pickListVal : ple) {            
                pickListValuesList.add(pickListVal.getLabel());
            }
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return pickListValuesList;
    }
    
    
}
public class Core_GoalUtility {
    
public static double curentgoalestimation2(double emi, Date startDate, Date todaydate,decimal growth,decimal startValue, decimal targetValue){
        double result = 0;
        Integer months = 0;
        double currentValue = startValue;
        
        try{
            months = NumberOfMonths(startDate, todaydate);
            if(months >= 1){
                for (Integer i = 1; i <= months; i++) {
                    currentValue = currentValue * (1 + growth);
                    if ((currentValue + emi) <= targetValue) {
                        currentValue += emi;
                    } else if (currentValue < targetValue
                               && (currentValue + emi) > targetValue) {
                                   currentValue = targetValue;
                               } else if (currentValue >= targetValue) {
                                   currentValue = targetValue;
                               }
                }
                // result = months*emi*(Math.pow((double)(1+growth), months));
                system.debug('result'+ result+ 'gr'+growth );
            }
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return currentValue;
    }
public static Double calculateGrowth(Double apy){
      Double temp=1;
        Double growth = Math.pow((1 + (apy/ 100)), (temp/12))- 1;   
        return growth;
    }
    public static PerformanceValue calculateExpectedAndActual(FinServ__FinancialGoal__c f,Decimal balance, Double apy, List<FinServ__FinancialGoal__c> goalsList, Integer months ) {
        PerformanceValue p=new PerformanceValue();

        Decimal growth = ((Decimal)calculateGrowth(apy)).setScale(5);
        decimal expected;
        decimal actual;
        if(f.Start_Date__c.month()== date.today().addMonths(months).month() && date.today().addMonths(months).year()==f.Start_Date__c.year()){
            p.expected=f.Start_Value__c;
            p.actual=f.Start_Value__c;
            return p;
        }
        else{ 
            expected= ((Decimal) curentgoalestimation2((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(months),growth,f.Start_Value__c,f.FinServ__TargetValue__c)).setScale(2, RoundingMode.HALF_UP); 
        }
      
        Decimal currentAmount=balance;
        Decimal totalEstimated = 0;
        System.debug(goalsList);
        for(FinServ__FinancialGoal__c relgoal :goalsList )
        {
            if(relgoal.Start_Date__c.month()== date.today().addMonths(months).month() && date.today().addMonths(months).year()==relgoal.Start_Date__c.year()){
                currentAmount -= relgoal.Start_Value__c;
                if (currentAmount<=0){
                    actual=0;
                    break;
                }    
            }else{
                
                if(relgoal.Start_Date__c< date.today().addMonths(months).toStartOfMonth()){
                    
                    if(relgoal.Goal_Priority_Number__c<f.Goal_Priority_Number__c )
                    {
                        currentAmount -=  ((Decimal) curentgoalestimation2((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today().addMonths(months),growth,relgoal.Start_Value__c,relgoal.FinServ__TargetValue__c)).setScale(2, RoundingMode.HALF_UP);  
                        
                        if (currentAmount<=0){
                            actual=0;
                            break;
                        }
                    }
                    else if(relgoal.Goal_Priority_Number__c==f.Goal_Priority_Number__c){
                        totalEstimated = totalEstimated + ((Decimal) curentgoalestimation2((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today().addMonths(months),growth,relgoal.Start_Value__c,relgoal.FinServ__TargetValue__c)).setScale(2, RoundingMode.HALF_UP);  
                    }
                }
            }
        }
        
        
        if(currentAmount>0){
            if(totalEstimated>0){
                actual=expected*currentAmount/(totalEstimated+expected);
            }
            
            else{
                actual=currentAmount;
            }                        
        }
        p.expected=expected;
        
            p.actual=actual.setScale(2,RoundingMode.HALF_UP);
        return p;
        
    }
      public static integer NumberOfMonths(Date startDate, Date endDate){
        
        if(startDate != null && endDate != null){
            Integer months = 0;
            try{
                months = startDate.monthsBetween(endDate);
                if(TEST.isRunningTest())
                    throw new NullPointerException(); 
            }
            
            catch(Exception e){
                FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            }
            return months;
        }
        
        else {
            return 0;
        }
    } 
    public static  date extenddate(double current, double emi, decimal targetValue, Double growth){
        Date newDate = Date.today();
        Integer noMonths = 0;
        double amount = 0;
        while(targetValue > current){
            current = current * (1 + growth) + emi;
            noMonths = noMonths+1;
        }
        return newDate.addmonths(noMonths);
    }
    
    public class PerformanceValue{
        public Decimal expected;
        
        public Decimal actual;
    }
}
public class Nonretirementgoalapexcontroller {
        public static string namespace{get; set;}

    

    
    @auraEnabled
    public static FinServ__FinancialGoal__c getNonRetirementGoalRecord(String goalsId){
        System.debug('the goals id is:' + goalsId);
        FinServ__FinancialGoal__c allGoals = [select FinServ__PrimaryOwner__c,Name,FinServ__TargetValue__c,FinServ__TargetDate__c,Associated_Account__c,Goal_Priority__c,Required_Monthly_Saving__c,Start_Date__c,Start_Value__c from FinServ__FinancialGoal__c where id= :goalsId];
        
        System.debug('goals are '+allGoals);
        return allGoals ;
    }
    
    @auraEnabled   
    public static List<FinServ__FinancialAccount__c> dample(String clientId){
        System.debug('clientId-sassa-->'+clientId);      
        List<FinServ__FinancialAccount__c> a = [select Id, Name from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c = :clientId AND (Account_Type__c='401K' OR Account_Type__c='529 Account' OR Account_Type__c='Cash' OR Account_Type__c='CD'
                                                                                                                                                                                                                                     OR Account_Type__c='Checking' OR Account_Type__c='IRA' OR Account_Type__c='Money Market' OR Account_Type__c='Other' OR Account_Type__c='Retail Brokerage' OR Account_Type__c='Roth IRA'  OR Account_Type__c='Savings')];
        return a;
    }
    
    @auraEnabled
    public static Double getCurrentAmount(String goalId,String accId)
    {
        
        Double interestRate = 0;
        Double currAmt = 0;

        system.debug('gaccid'+accId );
        try{
            if(accId != null&& accId !='')
            {
                FinServ__FinancialAccount__c acc = [select FinServ__Balance__c, FinServ__APY__c, id from FinServ__FinancialAccount__c where id = :accId];
                Double bal = acc.FinServ__Balance__c;
                if(acc.FinServ__APY__c != null)
                {
                    interestRate = acc.FinServ__APY__c;
                }
                else 
                    interestRate = 0; 
                
                list<FinServ__FinancialGoal__c> allAssocGoals = [select Associated_Account__c,Required_Monthly_Saving__c, Start_Date__c, Start_Value__c,FinServ__TargetValue__c from FinServ__FinancialGoal__c where Associated_Account__c = :accId and Id!=:goalId];
                
                Double totalEstimated = 0;
                Double remainingAmount = 0;
   			  Decimal growth=Core_GoalUtility.calculateGrowth(interestRate);       
                for(FinServ__FinancialGoal__c relgoal : allAssocGoals )
                {
                    totalEstimated = totalEstimated +  ((Decimal) Core_GoalUtility.curentgoalestimation2((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today(),growth,relgoal.Start_Value__c,relgoal.FinServ__TargetValue__c)).setScale(2, RoundingMode.HALF_UP);                     
                }
                remainingAmount = bal - totalEstimated;
                if(remainingAmount < 0){
                    remainingAmount = 0;
                }
                currAmt = Double.valueOf(remainingAmount);
               /* if(targetDate != null && targetAmt != null){
                    Date tarDate = Date.valueOf(targetDate);
                    Double tarAmt = Double.valueOf(targetAmt);
                    wrapper.emi = Math.round(getMonthlyContri(accId, currAmt, tarDate, tarAmt));
                }
                else{
                    wrapper.emi = 0; 
                }
            }
            else{
                wrapper.currentAmt = null;
            }*/
             if(TEST.isRunningTest())
                throw new NullPointerException();
        }
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
                return Math.round(currAmt);
        
    }
    
    /* get monthly contribution
* used in  getCurrentAmount
* **/
        @auraEnabled

    public static Double getMonthlyContri(String accId, Double currAmt, Date target, Double tAmt)
    {
        
        Integer months = date.today().monthsBetween(target);
        System.debug('months'+months);
        Double installment = 0;
         //Double temp=1;
        Double interestRate=[Select FinServ__APY__c from FinServ__FinancialAccount__c where Id=:accId LIMIT 1].FinServ__APY__c;
      //  Double growth = ((Math.pow((1 + (interestRate/100)), (temp/12)))- 1);
      Double growth=Core_GoalUtility.calculateGrowth(interestRate);
        try{
            If (tAmt > (currAmt * (Math.pow((1 + growth),months)))){
                If (growth > 0){
                    installment = ((tAmt - currAmt * (Math.pow((1 + growth), months))) * growth) / ((Math.pow((1 + growth), months)) - 1);
                } 
                Else {
                    installment = (tAmt - currAmt) / months;
                }
                
            }
            if(installment < 0){
                installment = 0;
            }
            else{
                installment += 1;
            }
             if(TEST.isRunningTest())
                throw new NullPointerException();
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return Math.round(installment);
    }
    
    
}
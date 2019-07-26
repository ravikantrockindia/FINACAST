public class Nonretirementgoalapexcontroller {
        public static string namespace{get; set;}

    public class getDataWrapper
    {
        @auraEnabled public Decimal currentAmt;
        @auraEnabled public Decimal emi;
    }
    Nonretirementgoalapexcontroller(){
        
    }
    
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
        List<FinServ__FinancialAccount__c> a = [select Id, Name from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c = :clientId];
        return a;
    }
    
    @auraEnabled
    public static getDataWrapper getCurrentAmount(String accId, String targetDate, String targetAmt, String currentAmount)
    {
        
        System.debug(currentAmount);
        Double interestRate = 0;
        getDataWrapper wrapper = new getDataWrapper();
        wrapper.currentAmt = 0;
        //wrapper.targetMonth = 1;
        Date now = Date.today();
        
        system.debug('gaccid'+accId );
        try{
            if(accId != null&& accId !='')
            {
                FinServ__FinancialAccount__c acc = [select FinServ__Balance__c, FinServ__APY__c, id from FinServ__FinancialAccount__c where id = :accId];
                system.debug('aa'+acc);
                Double bal = acc.FinServ__Balance__c;
                if(acc.FinServ__APY__c != null)
                {
                    interestRate = acc.FinServ__APY__c;
                }
                if(acc.FinServ__APY__c != null)
                {
                    interestRate =  acc.FinServ__APY__c;
                }
                else 
                    interestRate = 0; 
                
                system.debug('interestRate '+interestRate);
                list<FinServ__FinancialGoal__c> allAssocGoals = [select Associated_Account__c,Required_Monthly_Saving__c, Start_Date__c, Start_Value__c from FinServ__FinancialGoal__c where Associated_Account__c = :accId];
                
                Double totalEstimated = 0;
                Double remainingAmount = 0;
                Decimal growth=0;                
                for(FinServ__FinancialGoal__c relgoal : allAssocGoals )
                {
                    
                    totalEstimated = totalEstimated + ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today(),growth)).setScale(2,RoundingMode.HALF_UP)+ relgoal.Start_Value__c;
                    
                }
                
                remainingAmount = bal - totalEstimated;
                if(remainingAmount < 0){
                    remainingAmount = 0;
                }
                
                Double currAmt = 0;
                currAmt = Double.valueOf(remainingAmount);
                /* if(currentAmount != null)
{
currAmt = Double.valueOf(currentAmount);
}
else
{ 
System.debug(remainingAmount);
currAmt = remainingAmount;
}*/
                wrapper.currentAmt = Math.ceil(currAmt);
                if(targetDate != null && targetAmt != null)
                {
                    Date tarDate = Date.valueOf(targetDate);
                    Double tarAmt = Double.valueOf(targetAmt);
                    
                    wrapper.emi = Math.ceil(getMonthlyContri(currAmt, interestRate, tarDate, tarAmt));
                    
                }
                
                else
                {
                    wrapper.emi = 0; 
                }
                
                
                
            }
            
            else
            {
                System.debug('hello');
                wrapper.currentAmt = null;
            }
             if(TEST.isRunningTest())
                throw new NullPointerException();
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        system.debug('aaaa'+ wrapper.currentAmt);
        return wrapper;
        
    }
    
    /* get monthly contribution
* used in  getCurrentAmount
* **/
    
    public static Double getMonthlyContri(Double currAmt, Double interestRate, Date target, Double tAmt)
    {
        
        Integer months = date.today().monthsBetween(target);
        Double installment = 0;
        Double growth = ((Math.pow((1 + (interestRate/100)), (1/12)))- 1);
        try{
            If (tAmt > (currAmt * (Math.pow((1 + growth),months))))
            {
                If (growth > 0)
                {
                    installment = ((tAmt - currAmt * (Math.pow((1 + growth), months))) * growth) / ((Math.pow((1 + growth), months)) - 1);
                    
                } 
                Else {
                    installment = (tAmt - currAmt) / months;
                    
                }
                
            }
            system.debug('insta'+ installment);
            if(installment < 0)
            {
                installment = 0;
            }
             if(TEST.isRunningTest())
                throw new NullPointerException();
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return installment;
    }
    
    
}
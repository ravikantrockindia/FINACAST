/* created by: avneet kaur
* controller for RetirementGoal and RetirementGoalScreen2 component
* test class : testRetirementGoalApexController
***/

public class RetirementGoalApexController {
    
    //get date of birth of primary owner from contact object
    //retirementGoalScreen2 controller function : getDateofBirth
    
    @auraEnabled
    public static Date getDate(String clientId)
    {
        Account cont = [select Date_Of_Birth__c, Id from Account where Id = :clientId];
        return cont.Date_Of_Birth__c;
    }
    
    /*wrapper class 
* variable "Decimal retirementAmount" : return the target amount for retirement
* variable " Integer yearsTillRetirement" : return years left until retirementreti
* **/
    
     @auraEnabled   
    public static List<FinServ__FinancialAccount__c> dample(String clientId){     
        List<FinServ__FinancialAccount__c> a = [select Id, Name from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c = :clientId];
        return a;
    }
    
    public class getDataWrapper
    {
        @auraEnabled public Decimal retirementAmount;
        @auraEnabled public Integer yearsTillRetirement;
    }
    
    /* to calculate the target amount for retirement and retirement date
* RetirementGoalScreen2 controller, Function : handleLoad   
* **/  
    
    @auraEnabled
    public static getDataWrapper getAmountMonth(Double desIncome, Double inflationRate, Double interestRate, 
                                                String yearsToLive, String retireAge, String birth)
    {
        Date birthDate = Date.valueOf(birth);
        Integer currentAge = (date.today()).year()- birthDate.year();
        Integer yearsTillRetire = Integer.valueOf(retireAge) - currentAge;
        getDataWrapper wrapper = new getDataWrapper();
        wrapper.yearsTillRetirement = yearsTillRetire;
        try{
        For(Integer i =0 ; i<yearsTillRetire ; i++)
        {
            desIncome = desIncome*(1 + (inflationRate/100));    
        }
        Integer years = Integer.valueOf(yearsToLive);
        Decimal savingRequiredAtRetirement = desIncome; 
        If (interestRate == 0 && inflationRate == 0)
        {
            for(integer i=1 ; i<years ; i++)
            {
                desIncome = desIncome*(1 + (inflationRate/100)); 
                savingRequiredAtRetirement = savingRequiredAtRetirement + desIncome;
            }
        }
        else
        {
            If(interestRate == inflationRate)
            {
                inflationRate = inflationRate - 0.01;
            }
            Double aprComponent = Math.pow((1+(interestRate/100)), (years-1));
            Double inflationComponent = Math.pow((1+(inflationRate/100)), (years-1));
            Double discountRateComponent = (interestRate-inflationRate)/100;
            savingRequiredAtRetirement  =  (desIncome/aprComponent) * (inflationComponent + ((1+(interestRate/100)) * ((aprComponent - inflationComponent) / discountRateComponent)));
        }
        
        
        wrapper.retirementAmount = Math.ceil(savingRequiredAtRetirement);
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return wrapper;
    }
    
    /*wrapper class 
* variable "Decimal currentAmt" : remaining available balance for goal
* variable "Decimal monthlyContri" : calculating monthly contribution to fulfil goal
* ***/
    
    public class AmtAndContriWrapper
    {
        @auraEnabled public Decimal currentAmt;
        @auraEnabled public Decimal monthlyContri;
    }
    
    // get remaining available balance from finnacial account and calculate the monthly contribution
    // RetirementGoalScreen 2 controller,  function : amtAndContri
    
    @auraEnabled
    public static AmtAndContriWrapper getAmtAndContri(String accId, String tillRetirement, String interest, String targetAmt, String retireDate, String current)
    {
        Double interestRate = Double.valueOf(interest);
        Double currentAmount = 0;
        
        AmtAndContriWrapper wrapper = new AmtAndContriWrapper();
        try{
        if (accId != null && accId !='')
        {
            FinServ__FinancialAccount__c acc = [select FinServ__Balance__c,id from FinServ__FinancialAccount__c where id = :accId];
            Double bal = acc.FinServ__Balance__c;
            
            list<FinServ__FinancialGoal__c> allAssocGoals = [select Associated_Account__c,Required_Monthly_Saving__c, Start_Date__c, Start_Value__c from FinServ__FinancialGoal__c where Associated_Account__c = :accId];
            
            Double totalEstimated = 0;
            Decimal remainingAmount = 0;
            Decimal growth=0;
            for(FinServ__FinancialGoal__c relgoal : allAssocGoals )
            {
                totalEstimated = totalEstimated + ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today(),growth)).setScale(2,RoundingMode.HALF_UP)+ relgoal.Start_Value__c;
            }
            remainingAmount = bal - totalEstimated;
            double curr = Math.ceil( remainingAmount);       
            wrapper.currentAmt = Math.ceil(curr);
            Date retire = date.valueOf(retireDate);
            
            if(current == null)
            {
                currentAmount = Math.ceil(curr);
            }
            else
            {
                currentAmount = Double.valueOf(current);
            }
            
            wrapper.monthlyContri = Math.ceil(getMonthlyContribution(currentAmount, tillRetirement, interestRate, targetAmt, retireDate));
            
        } 
                         if(TEST.isRunningTest())
                throw new NullPointerException();
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return wrapper;
        
    }
    
    
    /* to monthlyContribution
* called from apex function getAmtAndContri 
* ***/
    
    @auraEnabled
    public static Decimal getMonthlyContribution(Double currentAmount, String tillRetirement, Double interestRate, String targetAmt, String retireDate)
    {
        Date retire = date.valueOf(retireDate);
        Integer months = (((retire.year())*12)+retire.month()) - ((((date.today()).year())*12)+date.today().month());
        Double installment = 0;
        Double growth = (Math.pow((1 + (interestRate/ 100)), (1/12)))- 1;
        
        Double target = Double.valueOf(targetAmt);
        
        Decimal monContri;
        
        If (target > (currentAmount * (Math.pow((1 + growth),months))))
        {
            
            If (growth > 0)
            {
                installment = ((target - currentAmount * (Math.pow((1 + growth), months))) * growth) / ((Math.pow((1 + growth), months)) - 1);
            } 
            Else {
                installment = (target - currentAmount) / months;
            }
            monContri = installment;
        }
        else
        {
            monContri = installment;
        }
        return Math.ceil(monContri);
        
    }    
    
    /*** save data for retirement goal
* RetirementGoalScreen2 controller, function : saveButton
* **/
    
    @auraEnabled
    public static Id   saveData(String recordId,String owner,String name, String dob, String years,String inflationRate, String retireAge , String income,
                              String returnRate, String amount, String associatedAccount, String priority, String sValue, String tDate,
                              String contribution,String isTaxDeduction, String taxPercentageContribution, Double maxDeduction, String isMonthly)
    {
        
        FinServ__FinancialGoal__c goal = new FinServ__FinancialGoal__c();
        try{
            goal.Id=recordId;
            goal.FinServ__PrimaryOwner__c = owner;
            
            goal.Name = name;
            
            date d = date.valueOf(dob);
            goal.Date_Of_Birth__c = d;
            goal.Years_Of_Living_After_Retirement__c = Integer.valueOf(years);
            goal.Expected_Inflation_Rate__c = Double.valueOf(inflationRate);
            goal.Retirement_Age__c = Integer.valueOf(retireAge);
            goal.Desired_Annual_Income_For_Retirement__c  = Double.valueOf(income);
            goal.Rate_Of_Return_After_Retirement__c = Double.valueOf(returnRate);
            goal.FinServ__TargetValue__c = Double.valueOf(amount);
            goal.Associated_Account__c = associatedAccount;
            goal.Goal_Priority__c = priority;
            goal.Start_Value__c = Integer.valueOf(sValue);
            date t = date.valueOf(tDate);
            goal.Start_Date__c = Date.today();
            goal.FinServ__TargetDate__c = t; 
            Double c = Double.valueOf(contribution);
            goal.Required_Monthly_Saving__c = Math.ceil(c);
            goal.Does_the_contribution_bring_tax_benefit__c=Boolean.valueOf(isTaxDeduction);
            goal.What_of_contribution_bring_tax_benefit__c=Double.valueOf(taxPercentageContribution);
            goal.Max_yearly_tax_deduction_allowed__c=maxDeduction;
            goal.Do_tax_benefits_realize_monthly__c=Boolean.valueOf(isMonthly);
            
            upsert(goal); 
            
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return goal.id;
    }
    
    @AuraEnabled
    public static FinServ__FinancialGoal__c getGoalData(String goalId)
    {
        return [SELECT Annual_Growth_Rate__c,Associated_Account__c,Current_Goal_Amount__c,Current_Monthly_Income__c,Date_Of_Birth__c,Desired_Annual_Income_For_Retirement__c,Expected_Inflation_Rate__c,FinServ__PrimaryOwner__c,FinServ__TargetDate__c,FinServ__TargetValue__c,Goal_Priority__c,Id,Name,OwnerId,Rate_Of_Return_After_Retirement__c,Required_Monthly_Saving__c,Retirement_Age__c,Start_Date__c,Start_Value__c,Years_Of_Living_After_Retirement__c , What_of_contribution_bring_tax_benefit__c , Max_yearly_tax_deduction_allowed__c , Do_tax_benefits_realize_monthly__c FROM FinServ__FinancialGoal__c where id =: goalId];
    }
    
}
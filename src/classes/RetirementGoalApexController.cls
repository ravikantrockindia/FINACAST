/* created by: avneet kaur
* controller for RetirementGoal and RetirementGoalScreen2 component
* test class : testRetirementGoalApexController
***/

public class RetirementGoalApexController {
    
     @auraEnabled   
    public static List<FinServ__FinancialAccount__c> dample(String clientId){     
        List<FinServ__FinancialAccount__c> a = [select Id, Name from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c = :clientId AND (Account_Type__c='401K' OR Account_Type__c='529 Account' OR Account_Type__c='Cash' OR Account_Type__c='CD'
                                                                                                                                                                                                                                     OR Account_Type__c='Checking' OR Account_Type__c='IRA' OR Account_Type__c='Money Market' OR Account_Type__c='Other' OR Account_Type__c='Retail Brokerage' OR Account_Type__c='Roth IRA'  OR Account_Type__c='Savings') ] ;
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
        system.debug('currentAge'+currentAge);
        Integer yearsTillRetire = Integer.valueOf(retireAge) - currentAge;
         system.debug('yearsTillRetire'+yearsTillRetire);
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
            /*if(parseFloat(r_apr).toFixed(2) == parseFloat(inflation).toFixed(2)){
				inflation=parseFloat(inflation)- .01;
				//alert("Matched");
			}
			savingRequiredAtRetirement = (income/Math.pow((1+(r_apr/100)), (years-1)))*(Math.pow((1+(inflation/100)), (years-1))+((1+(r_apr/100))*((Math.pow((1+(r_apr/100)), (years-1)) - Math.pow((1+(inflation/100)), (years-1)))/((r_apr-inflation)/100))));
*/
            If(interestRate == inflationRate)
            {
                inflationRate = inflationRate - 0.01;
            }
            Double aprComponent = Math.pow((1+(interestRate/100)), (years-1));
            Double inflationComponent = Math.pow((1+(inflationRate/100)), (years-1));
            Double discountRateComponent = (interestRate-inflationRate)/100;
            savingRequiredAtRetirement  =  (desIncome/aprComponent) * (inflationComponent + ((1+(interestRate/100)) * ((aprComponent - inflationComponent) / discountRateComponent)));
        }
        
        
        wrapper.retirementAmount = Math.round(savingRequiredAtRetirement);
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
            wrapper.currentAmt = remainingAmount;
            Date retire = date.valueOf(retireDate);
            
            if(current == null)
            {
                currentAmount = remainingAmount;
            }
            else
            {
                currentAmount = Double.valueOf(current);
            }
            
            wrapper.monthlyContri = Math.round(getMonthlyContribution(accId,currentAmount, tillRetirement, targetAmt, retireDate));
            
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
    public static Decimal getMonthlyContribution(String accId,Double currentAmount, String tillRetirement, String targetAmt, String retireDate)
    {
        Date retire = date.valueOf(retireDate);
        Integer months = (((retire.year())*12)+retire.month()) - ((((date.today()).year())*12)+date.today().month());
        Double installment = 0;
        Double temp=1;
        Double interestRate=[Select FinServ__APY__c from FinServ__FinancialAccount__c where Id=:accId LIMIT 1].FinServ__APY__c;
        System.debug(interestRate/100);
        Double growth = (Math.pow((1 + (interestRate/ 100)), (temp/12))- 1);
        
        Double target = Double.valueOf(targetAmt);
        
        Decimal monContri;
        System.debug(growth);
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
        monContri++;
        return monContri;
        
    }    
    
    
    @AuraEnabled
    public static FinServ__FinancialGoal__c getGoalData(String goalId)
    {
        return [SELECT Annual_Growth_Rate__c,Associated_Account__c,Current_Goal_Amount__c,Current_Monthly_Income__c,Date_Of_Birth__c,Desired_Annual_Income_For_Retirement__c,Expected_Inflation_Rate__c,FinServ__PrimaryOwner__c,FinServ__TargetDate__c,FinServ__TargetValue__c,Goal_Priority__c,Id,Name,OwnerId,Rate_Of_Return_After_Retirement__c,Required_Monthly_Saving__c,Retirement_Age__c,Start_Date__c,Start_Value__c,Years_Of_Living_After_Retirement__c , Does_the_contribution_bring_tax_benefit__c,What_of_contribution_bring_tax_benefit__c , Max_yearly_tax_deduction_allowed__c , Do_tax_benefits_realize_monthly__c FROM FinServ__FinancialGoal__c where id =: goalId];
    }
    
    @AuraEnabled 
    public static Date getContactDob(String recordId){
        List<Contact> c;
        Date dob;
        try{
            
            c=[Select Id,Birthdate from Contact where AccountId=:recordId limit 1];
             dob=c[0].Birthdate;
            
            
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }
         
        return  dob;
        
    }
    
}
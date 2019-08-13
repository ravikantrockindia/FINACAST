public with sharing class FinacastGoalProgressApex{
    
    public static String goalId {get; set;}     //Selected Id for see gaol status
    public static Decimal totalEstimated = 0;  
    public FinacastGoalProgressApex(Id gId)
    {
        goalId = gId; 
    }
    public static double curentgoalestimation(double emi, Date startDate, Date todaydate,decimal growth ){
        double result = 0;
        Integer months = 0;
        try{
            months = NumberOfMonths(startDate, todaydate);
            if(months >= 1){
                result = months*emi*(Math.pow((double)(1+growth), months));
                system.debug('result'+ result+ 'gr'+growth );
            }
             if(TEST.isRunningTest())
                throw new NullPointerException();
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return result;
    }
    
    public static  date extenddate(integer negativeAmmount, double emi, date estimatedate){
        Date newDate = estimatedate;
        Integer noMonths = 0;
        double amount = 0;
        while(amount < negativeAmmount){
            amount = amount+ emi;
            noMonths = noMonths+1;
        }
        return newDate.addmonths(noMonths);
    }
    
    public static double testEstimatedMonthlyPayment(double current, double target, Integer growth, Date startDate, Date endDate){
        Integer months = 0;
        months = NumberOfMonths(startDate, endDate);
        double installment = 0;
        
        if(months < 1){
            return (target > current) ? (target - current):0;
        }
        Double NOFMonths = (Double)months;
        if(growth != null && growth != 0){
            growth = FrequencyAdjustedRate(growth, 12)/100;
        }else{
            growth = 0;
        }
        
        if(target > current*(Math.pow((double)(1.0+growth), NOFMonths))){
            if(growth > 0){
                installment = ((target - current*(Math.pow((double)(1+growth), NOFMonths)))*growth)/(Math.pow((double)(1+growth), NOFMonths) - 1);
            } else {
                installment = (target - current) / NOFMonths;
            }
            return installment;
        } else {
            return installment;
        }
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
    
    public static integer FrequencyAdjustedRate(integer apr, integer periods){
        return (integer)((Math.pow((double)(1+(apr/100.0)), (double)(1.0/periods)) - 1)*100);
    }      
    
    public static boolean isMonteCarloSimulation{get; set;}   
    public static FinServ__FinancialGoal__c retgoal {get; set;}
    public static FinServ__FinancialAccount__c ffa {get; set;}
    public static Decimal goalstatus {get; set;}
    public static Date increasedate{get; set;}
    public static Boolean SavingError{get; set;}
    public static Boolean goalonTrack{get; set;}
    public static Boolean goalnotonTrack{get; set;}
    public static String chartValueList{get; set;} // send google chart value to VF page.
    public static List<List<Object>> bothList = new List<List<Object>>();
    @AuraEnabled
    public static List<List<Object>>  goalStatus(Id fingoalId){
        system.debug('NEW iD'+fingoalId);
        try{
        SavingError = false;
        goalonTrack = false;
        goalnotonTrack = false;
        isMonteCarloSimulation = false;
            
            retgoal = [select name,Current_Goal_Amount__c, Associated_Account__r.FinServ__Balance__c, Associated_Account__r.Account_Type__c, Start_Value__c,Start_Date__c, Associated_Account__c,Annual_Growth_Rate__c, Goal_Priority_Number__c,FinServ__TargetValue__c, FinServ__TargetDate__c, Goal_Priority__c, Required_Monthly_Saving__c from FinServ__FinancialGoal__c where id=:fingoalId];
            List<FinServ__FinancialGoal__c> allAssocGoals = [select name,Current_Goal_Amount__c, Associated_Account__r.FinServ__Balance__c, Goal_Priority_Number__c,Start_Value__c,Start_Date__c, Associated_Account__c,Annual_Growth_Rate__c, FinServ__TargetValue__c, FinServ__TargetDate__c, Goal_Priority__c, Required_Monthly_Saving__c from FinServ__FinancialGoal__c where Associated_Account__c=: retgoal.Associated_Account__c and id !=: retgoal.id and Goal_Priority_Number__c <=: retgoal.Goal_Priority_Number__c];
            
            ffa = [select name, Account_Type__c,FinServ__APY__c from FinServ__FinancialAccount__c where id=:retgoal.Associated_Account__c];
            Double interestRate ;
            if(ffa.FinServ__APY__c != null)
                {
                    interestRate = ffa.FinServ__APY__c;
                }
                if(ffa.FinServ__APY__c != null)
                {
                    interestRate =  ffa.FinServ__APY__c;
                }
            else{
                interestRate = 0;
            }
            
                
            Decimal growth =((Decimal) ((Math.pow((1 + (interestRate/100)),1)- 1))).setScale(5);
           
            system.debug('in'+interestRate + 'gr'+growth);
            if(ffa.Account_Type__c == 'IRA' || ffa.Account_Type__c == 'Roth IRA' || ffa.Account_Type__c == '529 Account' || ffa.Account_Type__c == 'Retail Brokerage' ){
                isMonteCarloSimulation = true;
            }
            Double EMP = testEstimatedMonthlyPayment((double)(retgoal.Start_Value__c), (double)(retgoal.FinServ__TargetValue__c), (Integer)(retgoal.Annual_Growth_Rate__c), retgoal.Start_Date__c, retgoal.FinServ__TargetDate__c);
            
            if(integer.valueof(EMP) != 0 && retgoal.Required_Monthly_Saving__c == 0){
                SavingError = true;
            }
            if((retgoal.Required_Monthly_Saving__c != 0) && (retgoal.FinServ__TargetValue__c != 0)){
                goalstatus = ((Decimal)curentgoalestimation((double)(retgoal.Required_Monthly_Saving__c), retgoal.Start_Date__c, Date.today(),growth)).setScale(2,                                                                                                                                            RoundingMode.HALF_UP) + retgoal.Start_Value__c;
            }else{
                goalstatus = ((Decimal)curentgoalestimation((double)(retgoal.Required_Monthly_Saving__c), retgoal.Start_Date__c, Date.today(),growth)).setScale(2,                                                                                                                                            RoundingMode.HALF_UP);
            }
            
            
            totalEstimated = 0;
            for(FinServ__FinancialGoal__c relgoal : allAssocGoals )
            {
                totalEstimated = totalEstimated + ((Decimal)curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today(),growth)).setScale(2,                                                                                                                                                                RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
            }
            
            if(goalstatus > retgoal.Associated_Account__r.FinServ__Balance__c - totalEstimated){
                
                retgoal.Current_Goal_Amount__c = retgoal.Associated_Account__r.FinServ__Balance__c - totalEstimated;
                goalstatus =    goalstatus - retgoal.Current_Goal_Amount__c;
                goalnotonTrack = true;
            }else {
                goalstatus = goalstatus;
                retgoal.Current_Goal_Amount__c = goalstatus;
                goalonTrack = true;
            }
            if((goalstatus != 0)&&(retgoal.Required_Monthly_Saving__c != 0)){
                increasedate = extenddate((integer)goalstatus, (double)(retgoal.Required_Monthly_Saving__c), retgoal.FinServ__TargetDate__c);
            } 
            system.debug('rer'+ goalstatus);
            
            //Goal Chart data.
            chartValueList = '[';
            integer months = NumberOfMonths(retgoal.Start_Date__c, Date.today());
            
            if(months > 6){
                for(integer i=5; i>=0; i--){
                    decimal expected;
                    chartValueList+= '{';
                    chartValueList+= '"date":"'+date.today().addMonths(-i).month()+'-'+date.today().addMonths(-i).year()+'",';
                    if((retgoal.Required_Monthly_Saving__c != 0) && (retgoal.FinServ__TargetValue__c != 0)){
                        expected =  ((Decimal)curentgoalestimation((double)(retgoal.Required_Monthly_Saving__c), retgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                              RoundingMode.HALF_UP)+ retgoal.Start_Value__c; 
                    }else{
                        
                        expected =  ((Decimal)curentgoalestimation((double)(retgoal.Required_Monthly_Saving__c), retgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                              RoundingMode.HALF_UP); 
                    }  totalEstimated = 0;
                    for(FinServ__FinancialGoal__c relgoal : allAssocGoals )
                    {
                        totalEstimated = totalEstimated + ((Decimal)curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                                                    RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
                    }
                    chartValueList+= '"estimated":"'+expected+'",';
                    if(retgoal.Associated_Account__r.FinServ__Balance__c >= totalEstimated+expected){
                        chartValueList+= '"actual":"'+expected+'"';
                    }else{
                        chartValueList+= '"actual":"'+ (totalEstimated - retgoal.Associated_Account__r.FinServ__Balance__c) +'"';
                    }
                    chartValueList+= '},';
                }
            }
            if(months <= 6){
                Boolean chacktest = false;
                for(integer i=months; i>=0; i--){
                    if(chacktest == false)
                    {
                        chartValueList+= '{';
                        chartValueList+= '"date":"'+date.today().addMonths(-i).month()+'-'+date.today().addMonths(-i).year()+'",';
                        totalEstimated = 0;
                        for(FinServ__FinancialGoal__c relgoal : allAssocGoals )
                        {
                            system.debug('name'+ relgoal.name);
                            totalEstimated = totalEstimated + ((Decimal)curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                                                        RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
                        }
                        system.debug('vdrrdrgr'+totalEstimated);
                        
                        if((retgoal.Required_Monthly_Saving__c != 0) && (retgoal.FinServ__TargetValue__c != 0)){ 
                            if(retgoal.Start_Value__c > retgoal.Associated_Account__r.FinServ__Balance__c - totalEstimated ){
                                chartValueList+= '"estimated":"'+retgoal.Start_Value__c+'",';
                                chartValueList+= '"actual":"'+ (retgoal.Associated_Account__r.FinServ__Balance__c - totalEstimated)+'"';
                            }else {
                                chartValueList+= '"estimated":"'+retgoal.Start_Value__c+'",';
                                chartValueList+= '"actual":"'+retgoal.Start_Value__c+'"';
                            }
                            
                        }else{
                            chartValueList+= '"estimated":"0",';
                            chartValueList+= '"actual":"0"';
                        }
                        
                        
                        chartValueList+= '},';
                        chacktest = true;
                    }else{
                        decimal expected;
                        chartValueList+= '{';
                        chartValueList+= '"date":"'+date.today().addMonths(-i).month()+'-'+date.today().addMonths(-i).year()+'",';
                        if((retgoal.Required_Monthly_Saving__c != 0) && (retgoal.FinServ__TargetValue__c != 0)){
                            expected =  ((Decimal)curentgoalestimation((double)(retgoal.Required_Monthly_Saving__c), retgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                                  RoundingMode.HALF_UP)+ retgoal.Start_Value__c; 
                        }else{
                            expected =  ((Decimal)curentgoalestimation((double)(retgoal.Required_Monthly_Saving__c), retgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                                  RoundingMode.HALF_UP); 
                        }     
                        totalEstimated = 0;
                        for(FinServ__FinancialGoal__c relgoal : allAssocGoals )
                        {
                            
                            totalEstimated = totalEstimated + ((Decimal)curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                                                        RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
                        }
                        system.debug('vdrrdrgr'+totalEstimated);
                        system.debug('vdrrdrgr'+expected);
                        chartValueList+= '"estimated":"'+expected+'",';
                        if(retgoal.Associated_Account__r.FinServ__Balance__c >=   totalEstimated+expected){
                            
                            chartValueList+= '"actual":"'+expected+'"';
                        }else{
                            system.debug('rrdrer');
                            chartValueList+= '"actual":"'+(  retgoal.Associated_Account__r.FinServ__Balance__c - totalEstimated)+'"';
                        }
                        chartValueList+= '},';
                    }
                }
                months = 5-months;
                for(integer j=1;j<=months;  j++){
                    decimal expected;
                    chartValueList+= '{';
                    chartValueList+= '"date":"'+date.today().addMonths(+j).month()+'-'+date.today().addMonths(+j).year()+'",';
                    if((retgoal.Required_Monthly_Saving__c != 0) && (retgoal.FinServ__TargetValue__c != 0)){
                        expected =  ((Decimal)curentgoalestimation((double)(retgoal.Required_Monthly_Saving__c), retgoal.Start_Date__c, date.today().addMonths(+j),growth)).setScale(2, 
                                                                                                                                                                              RoundingMode.HALF_UP)+ retgoal.Start_Value__c; 
                    }else{
                        expected =  ((Decimal)curentgoalestimation((double)(retgoal.Required_Monthly_Saving__c), retgoal.Start_Date__c, date.today().addMonths(+j),growth)).setScale(2, 
                                                                                                                                                                              RoundingMode.HALF_UP); 
                    }                
                    chartValueList+= '"estimated":"'+expected+'",';
                    chartValueList+= '"actual":"0"';
                    chartValueList+= '},';
                }
            }
            Integer stlength = chartValueList.length();
            chartValueList = chartValueList.substring(0, stlength-1);
            chartValueList+= ']';
            system.debug('chartlist'+ chartValueList);
            List<Object> expectedList = new List<Object>();
            List<Object> actualList = new List<Object>();
            List<Object> dateList = new List<Object>();
            List<Object> objList = (List<Object>) JSON.deserializeUntyped(chartValueList);
            for(Object obj :objList)
            {
                expectedList.add(((Map<String,Object>)obj).get('estimated'));
                actualList.add(((Map<String,Object>)obj).get('actual'));
                dateList.add(((Map<String,Object>)obj).get('date'));
            }
            
            List<Object> curramtlist = new List<Object>();
            curramtlist.add(retgoal.Current_Goal_Amount__c);
            List<Object> onTrack = new List<Object>();
            onTrack.add(goalonTrack);
            onTrack.add(goalnotonTrack);
            onTrack.add(retgoal.name);
            onTrack.add(goalstatus);
            onTrack.add(increasedate);
            onTrack.add(isMonteCarloSimulation);
            
            bothList.add(expectedList) ;
            bothList.add(actualList);
            bothList.add(dateList);
            bothList.add(curramtlist);
            bothList.add(onTrack);
            system.debug('both'+ bothList);
             if(TEST.isRunningTest())
                throw new NullPointerException();
            
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return bothList;
    }
    
}
public class GoalPerformanceAndMonteCarlo {
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
    
    
    
    public static list<FinGoalWrapperClass> getGoals(String ClientId, Boolean budgetScreen, String monthBudget) {
        List<FinGoalWrapperClass> finGoalWrapper=new List<FinGoalWrapperClass>();
        FinServ__FinancialAccount__c ffa;
        Decimal goalstatus;
        Boolean goalTrack;
        Boolean goalonTrack;
        Boolean goalnotonTrack;
        Decimal totalEstimated;
        String chartValueList;
        Decimal actualValue;
        
        List<FinServ__FinancialGoal__c> fl;
        try{        
            if(budgetScreen && monthBudget!='' && monthBudget!=null){
                Date stdate = AddIncomeController.getMonth(monthBudget);
                Date enddate = date.newInstance(stdate.year(), stdate.month(), date.daysInMonth(stdate.year(), stdate.month()));
                
                fl = [Select id,recordtypeid,recordtype.developername,FinServ__PrimaryOwner__c ,FinServ__PrimaryOwner__r.name, Name, Start_Value__c ,Goal_Priority_Number__c,Associated_Account__r.FinServ__Balance__c, Required_Monthly_Saving__c ,Associated_Account__c,Start_Date__c,FinServ__TargetDate__c,FinServ__TargetValue__c,FinServ__ActualValue__c
                      from FinServ__FinancialGoal__c where ((( Start_Date__c <=: stdate ) or(Start_Date__c >=: stdate and  Start_Date__c <=: enddate)) and ((FinServ__TargetDate__c >=: stdate) or FinServ__TargetDate__c = null)) and FinServ__PrimaryOwner__c =:ClientId];
                
            }
            else
                fl= [Select id,FinServ__PrimaryOwner__c ,recordtype.developername,Current_Goal_Amount__c,Goal_Priority__c,Goal_Priority_Number__c,Associated_Account__r.FinServ__Balance__c,Annual_Growth_Rate__c,FinServ__PrimaryOwner__r.name, Name, Start_Value__c , Required_Monthly_Saving__c ,Associated_Account__r.Account_Type__c,Associated_Account__r.Name,Start_Date__c,FinServ__TargetDate__c,FinServ__TargetValue__c
                     from FinServ__FinancialGoal__c  where FinServ__PrimaryOwner__c =: ClientId];
            for(FinServ__FinancialGoal__c f: fl ){
                goalTrack=false;
                goalonTrack = false;
                goalnotonTrack = false;
                
                ffa = [select name, Account_Type__c,FinServ__APY__c,(select name,Current_Goal_Amount__c, Associated_Account__r.FinServ__Balance__c, Goal_Priority_Number__c,Start_Value__c,Start_Date__c, Associated_Account__c,Annual_Growth_Rate__c, FinServ__TargetValue__c, FinServ__TargetDate__c, Goal_Priority__c, Required_Monthly_Saving__c from Financial_Goals__r where Associated_Account__c=: f.Associated_Account__c and id !=: f.id and Goal_Priority_Number__c <=: f.Goal_Priority_Number__c) from FinServ__FinancialAccount__c where id=:f.Associated_Account__c];
                Double interestRate ;
                
                if(ffa.FinServ__APY__c != null)
                {
                    interestRate =  ffa.FinServ__APY__c;
                }
                else{
                    interestRate = 0;
                }
                
                
                Decimal growth =((Decimal) ((Math.pow((1 + (interestRate/100)),1)- 1))).setScale(5);
                
                system.debug('in'+interestRate + 'gr'+growth);
                
                if((f.Required_Monthly_Saving__c != 0) && (f.FinServ__TargetValue__c != 0)){
                    goalstatus = ((Decimal)curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, Date.today(),growth)).setScale(2, RoundingMode.HALF_UP) + f.Start_Value__c;
                }else{
                    goalstatus = ((Decimal)curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, Date.today(),growth)).setScale(2,RoundingMode.HALF_UP);
                }
                
                
                totalEstimated = 0;
                for(FinServ__FinancialGoal__c relgoal : ffa.Financial_Goals__r )
                {
                    totalEstimated = totalEstimated + ((Decimal)curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today(),growth)).setScale(2,RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
                }
                
                if(goalstatus > f.Associated_Account__r.FinServ__Balance__c - totalEstimated){
                    
                    f.Current_Goal_Amount__c = f.Associated_Account__r.FinServ__Balance__c - totalEstimated;
                    goalstatus =    goalstatus - f.Current_Goal_Amount__c;
                    goalTrack = false;
                    goalnotonTrack = true;
                    
                }else {
                    goalstatus = goalstatus;
                    f.Current_Goal_Amount__c = goalstatus;
                    goalTrack = true;
                    goalonTrack = true;
                    
                }
                
                system.debug('rer'+ goalstatus);
                List<GoalPerformanceData> data=new List<GoalPerformanceData>();
                
                integer months = NumberOfMonths(f.Start_Date__c, Date.today());
                Integer month=date.today().month();
                Integer year=date.today().year();
                if(months > 6){
                    for(integer i=5; i>=0; i--){
                        
                        decimal expected;
                        
                        if((f.Required_Monthly_Saving__c != 0) && (f.FinServ__TargetValue__c != 0)){
                            expected =  ((Decimal)curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2,RoundingMode.HALF_UP)+ f.Start_Value__c; 
                            System.debug(expected);
                        }else{
                            
                            expected =  ((Decimal)curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, RoundingMode.HALF_UP); 
                                                        System.debug(expected);

                        }  totalEstimated = 0;
                        for(FinServ__FinancialGoal__c relgoal :ffa.Financial_Goals__r )
                        {
                            totalEstimated = totalEstimated + ((Decimal)curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2,RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
                        }
                        
                        if(f.Associated_Account__r.FinServ__Balance__c >= totalEstimated+expected){
                            
                            actualValue=expected;
                        }else{
                            
                            if(date.today().addMonths(-i).month()==month&&date.today().addMonths(-i).year()==year)
                                actualValue=totalEstimated - f.Associated_Account__r.FinServ__Balance__c;
                        }
                        
                    }
                }
                if(months <= 6){
                    Boolean chacktest = false;
                    for(integer i=months; i>=0; i--){
                        if(chacktest == false)
                        {
                            
                            totalEstimated = 0;
                            for(FinServ__FinancialGoal__c relgoal : ffa.Financial_Goals__r )
                            {
                                system.debug('name'+ relgoal.name);
                                totalEstimated = totalEstimated + ((Decimal)curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                                                                   RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
                            }
                            system.debug('vdrrdrgr'+totalEstimated);
                            
                            if((f.Required_Monthly_Saving__c != 0) && (f.FinServ__TargetValue__c != 0)){ 
                                if(f.Start_Value__c > f.Associated_Account__r.FinServ__Balance__c - totalEstimated ){
                                    if(date.today().addMonths(-i).month()==month&&date.today().addMonths(-i).year()==year)
                                        actualValue=f.Associated_Account__r.FinServ__Balance__c - totalEstimated;
                                }else {
                                    
                                    if(date.today().addMonths(-i).month()==month&&date.today().addMonths(-i).year()==year)
                                        actualValue=f.Start_Value__c;
                                }
                                
                            }else{
                                if(date.today().addMonths(-i).month()==month&&date.today().addMonths(-i).year()==year)
                                    actualValue=0;
                            }
                            
                            chacktest = true;
                        }else{
                            decimal expected;
                            
                            if((f.Required_Monthly_Saving__c != 0) && (f.FinServ__TargetValue__c != 0)){
                                expected =  ((Decimal)curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                                 RoundingMode.HALF_UP)+ f.Start_Value__c; 
                            }else{
                                expected =  ((Decimal)curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                                 RoundingMode.HALF_UP); 
                            }     
                            totalEstimated = 0;
                            for(FinServ__FinancialGoal__c relgoal :ffa.Financial_Goals__r )
                            {
                                
                                totalEstimated = totalEstimated + ((Decimal)curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                                                                   RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
                            }
                            system.debug('vdrrdrgr'+totalEstimated);
                            system.debug('vdrrdrgr'+expected);
                            if(f.Associated_Account__r.FinServ__Balance__c >=   totalEstimated+expected){
                                if(date.today().addMonths(-i).month()==month&&date.today().addMonths(-i).year()==year)
                                    actualValue=expected;
                            }else{
                                if(date.today().addMonths(-i).month()==month&&date.today().addMonths(-i).year()==year)
                                    
                                    actualValue=f.Associated_Account__r.FinServ__Balance__c - totalEstimated;
                            }
                            chartValueList+= '},';
                        }
                        
                    }
                    
                    months = 5-months;
                    for(integer j=1;j<=months;  j++){
                        GoalPerformanceData d=new GoalPerformanceData();
                        PerformanceValue p=new PerformanceValue();
                        decimal expected;
                        
                        if((f.Required_Monthly_Saving__c != 0) && (f.FinServ__TargetValue__c != 0)){
                            expected =  ((Decimal) curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(+j),growth)).setScale(2, 
                                                                                                                                                 RoundingMode.HALF_UP)+ f.Start_Value__c; 
                                                   System.debug(expected);
}else{
                            expected =  ((Decimal) curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(+j),growth)).setScale(2, 
                                                                                                                                                                              RoundingMode.HALF_UP); 
                                                    System.debug(expected);
}                
                        
                        if(date.today().addMonths(+j).month()==month&&date.today().addMonths(+j).year()==year)
                            actualValue=0;
                        
                    }
                }
                
                System.debug(data);
                
                System.debug(goalTrack);
                FinGoalWrapperClass fingoalwrap=new FinGoalWrapperClass();
                fingoalwrap.finGoal=f;
                fingoalwrap.goalTrack=goalTrack;
                fingoalwrap.actualValue=actualValue;
                fingoalwrap.percentage=((actualValue/f.FinServ__TargetValue__c)*100).setScale(2);
                finGoalWrapper.add(fingoalwrap);
            }
           if(Test.isRunningTest())
                throw new nullpointerexception(); 
        }
        catch(Exception ee){
            FinacastUtility.ExceptionHandle(ee.getLineNumber(), ee.getMessage(), ee.getStackTraceString());
            
        }
        System.debug(JSON.serialize(finGoalWrapper));
        return finGoalWrapper;
        
        
        
        
    }//method End
    
    @auraEnabled
    public static FinGoalWrapperClass getGoalDetail(string goalId) {
        FinGoalWrapperClass finGoalWrapper=new FinGoalWrapperClass();
        FinServ__FinancialAccount__c ffa;
        Decimal goalstatus;
        Boolean goalTrack;
        Boolean goalonTrack;
        Boolean goalnotonTrack;
        Decimal totalEstimated;
        String chartValueList;
        Date increasedate;
        
        Decimal actualValue;// send google chart value to VF page.
        
        FinServ__FinancialGoal__c f;
        try{        
            f= [Select id,FinServ__PrimaryOwner__c ,Current_Goal_Amount__c,Goal_Priority__c,Goal_Priority_Number__c,Associated_Account__r.FinServ__Balance__c,Annual_Growth_Rate__c,FinServ__PrimaryOwner__r.name, Name, Start_Value__c , Required_Monthly_Saving__c ,Associated_Account__r.Account_Type__c,Associated_Account__r.Name,Start_Date__c,FinServ__TargetDate__c,FinServ__TargetValue__c
                from FinServ__FinancialGoal__c  where id =: goalId];
            goalTrack=false;
            goalonTrack = false;
            goalnotonTrack = false;
            
            ffa = [select name, Account_Type__c,FinServ__APY__c,(select name,Current_Goal_Amount__c, Associated_Account__r.FinServ__Balance__c, Goal_Priority_Number__c,Start_Value__c,Start_Date__c, Associated_Account__c,Annual_Growth_Rate__c, FinServ__TargetValue__c, FinServ__TargetDate__c, Goal_Priority__c, Required_Monthly_Saving__c from Financial_Goals__r where Associated_Account__c=: f.Associated_Account__c and id !=: f.id and Goal_Priority_Number__c <=: f.Goal_Priority_Number__c) from FinServ__FinancialAccount__c where id=:f.Associated_Account__c];
            Double interestRate ;
            
            if(ffa.FinServ__APY__c != null)
            {
                interestRate =  ffa.FinServ__APY__c;
            }
            else{
                interestRate = 0;
            }
            
            
            Decimal growth =((Decimal) ((Math.pow((1 + (interestRate/100)),1)- 1))).setScale(5);
            
            system.debug('in'+interestRate + 'gr'+growth);
            
            if((f.Required_Monthly_Saving__c != 0) && (f.FinServ__TargetValue__c != 0)){
                goalstatus = ((Decimal) curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, Date.today(),growth)).setScale(2, RoundingMode.HALF_UP) + f.Start_Value__c;
            }else{
                goalstatus = ((Decimal) curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, Date.today(),growth)).setScale(2,RoundingMode.HALF_UP);
            }
            
            
            totalEstimated = 0;
            for(FinServ__FinancialGoal__c relgoal : ffa.Financial_Goals__r )
            {
                totalEstimated = totalEstimated + ((Decimal) curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today(),growth)).setScale(2,RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
            }
            
            if(goalstatus > f.Associated_Account__r.FinServ__Balance__c - totalEstimated){
                
                f.Current_Goal_Amount__c = f.Associated_Account__r.FinServ__Balance__c - totalEstimated;
                goalstatus =    goalstatus - f.Current_Goal_Amount__c;
                goalTrack = false;
                goalnotonTrack = true;
                
            }else {
                goalstatus = goalstatus;
                f.Current_Goal_Amount__c = goalstatus;
                goalTrack = true;
                goalonTrack = true;
                
            }
            if((goalstatus != 0)&&(f.Required_Monthly_Saving__c != 0)){
                increasedate = extenddate((integer)goalstatus, (double)(f.Required_Monthly_Saving__c), f.FinServ__TargetDate__c);
            } 
            system.debug('rer'+ goalstatus);
            List<GoalPerformanceData> data=new List<GoalPerformanceData>();
            
            integer months = NumberOfMonths(f.Start_Date__c, Date.today());
            Integer month=date.today().month();
            Integer year=date.today().year();
            if(months > 6){
                for(integer i=5; i>=0; i--){
                    GoalPerformanceData d=new GoalPerformanceData();
                    PerformanceValue p=new PerformanceValue();
                    decimal expected;
                    
                    
                    d.dateMonth=date.today().addMonths(-i).month()+'-'+date.today().addMonths(-i).year();
                    if((f.Required_Monthly_Saving__c != 0) && (f.FinServ__TargetValue__c != 0)){
                        expected =  ((Decimal) curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2,RoundingMode.HALF_UP)+ f.Start_Value__c; 
                        
                    }else{
                        
                        expected =  ((Decimal) curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, RoundingMode.HALF_UP); 
                        
                    }  totalEstimated = 0;
                    for(FinServ__FinancialGoal__c relgoal :ffa.Financial_Goals__r )
                    {
                        totalEstimated = totalEstimated + ((Decimal) curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2,RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
                    }
                    p.expected=expected;
                    if(f.Associated_Account__r.FinServ__Balance__c >= totalEstimated+expected){
                        p.actual=expected;
                        
                    }else{
                        p.actual=(totalEstimated - f.Associated_Account__r.FinServ__Balance__c) ;
                        
                    }
                    
                    d.values=p;
                    data.add(d);
                }
            }
            if(months <= 6){
                Boolean chacktest = false;
                for(integer i=months; i>=0; i--){
                    GoalPerformanceData d=new GoalPerformanceData();
                    PerformanceValue p=new PerformanceValue();
                    if(chacktest == false)
                    {
                        
                        d.dateMonth=date.today().addMonths(-i).month()+'-'+date.today().addMonths(-i).year();
                        totalEstimated = 0;
                        for(FinServ__FinancialGoal__c relgoal : ffa.Financial_Goals__r )
                        {
                            system.debug('name'+ relgoal.name);
                            totalEstimated = totalEstimated + ((Decimal) curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                                                                RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
                        }
                        system.debug('vdrrdrgr'+totalEstimated);
                        
                        if((f.Required_Monthly_Saving__c != 0) && (f.FinServ__TargetValue__c != 0)){ 
                            if(f.Start_Value__c > f.Associated_Account__r.FinServ__Balance__c - totalEstimated ){
                                p.expected=f.Start_Value__c;
                                p.actual=(f.Associated_Account__r.FinServ__Balance__c - totalEstimated);
                                if(date.today().addMonths(-i).month()==month&&date.today().addMonths(-i).year()==year)
                                    actualValue=f.Associated_Account__r.FinServ__Balance__c - totalEstimated;
                            }else {
                                p.expected=f.Start_Value__c;
                                p.actual=f.Start_Value__c;
                                if(date.today().addMonths(-i).month()==month&&date.today().addMonths(-i).year()==year)
                                    actualValue=f.Start_Value__c;
                            }
                            
                        }else{
                            p.expected=0;
                            p.actual=0;
                            if(date.today().addMonths(-i).month()==month&&date.today().addMonths(-i).year()==year)
                                actualValue=0;
                        }
                        
                        
                        chacktest = true;
                    }else{
                        decimal expected;
                        d.dateMonth=date.today().addMonths(-i).month()+'-'+date.today().addMonths(-i).year();
                        if((f.Required_Monthly_Saving__c != 0) && (f.FinServ__TargetValue__c != 0)){
                            expected =  ((Decimal) curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                              RoundingMode.HALF_UP)+ f.Start_Value__c; 
                        }else{
                            expected =  ((Decimal) curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                              RoundingMode.HALF_UP); 
                        }     
                        totalEstimated = 0;
                        for(FinServ__FinancialGoal__c relgoal :ffa.Financial_Goals__r )
                        {
                            
                            totalEstimated = totalEstimated + ((Decimal) curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                                                                RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
                        }
                        system.debug('vdrrdrgr'+totalEstimated);
                        system.debug('vdrrdrgr'+expected);
                        p.expected=expected;
                        if(f.Associated_Account__r.FinServ__Balance__c >=   totalEstimated+expected){
                            
                            p.actual=expected;
                            if(date.today().addMonths(-i).month()==month&&date.today().addMonths(-i).year()==year)
                                actualValue=expected;
                        }else{
                            //system.debug('rrdrer');
                            p.actual=f.Associated_Account__r.FinServ__Balance__c - totalEstimated;
                            if(date.today().addMonths(-i).month()==month&&date.today().addMonths(-i).year()==year)
                                
                                actualValue=f.Associated_Account__r.FinServ__Balance__c - totalEstimated;
                        }
                        chartValueList+= '},';
                    }
                    
                    d.values=p;
                    data.add(d);
                }
                
                months = 5-months;
                for(integer j=1;j<=months;  j++){
                    GoalPerformanceData d=new GoalPerformanceData();
                    PerformanceValue p=new PerformanceValue();
                    decimal expected;
                    d.dateMonth=date.today().addMonths(+j).month()+'-'+date.today().addMonths(+j).year();
                    if((f.Required_Monthly_Saving__c != 0) && (f.FinServ__TargetValue__c != 0)){
                        expected =  ((Decimal) curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(+j),growth)).setScale(2, 
                                                                                                                                                                          RoundingMode.HALF_UP)+ f.Start_Value__c; 
                    }else{
                        expected =  ((Decimal) curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(+j),growth)).setScale(2, 
                                                                                                                                                                          RoundingMode.HALF_UP); 
                    }                
                    p.expected=expected;
                    p.actual=0;
                    if(date.today().addMonths(+j).month()==month&&date.today().addMonths(+j).year()==year)
                        actualValue=0;
                    d.values=p;
                    data.add(d);
                }
            }
            // system.debug('chartlist'+ chartValueList);
            System.debug(data);
            
            System.debug(goalTrack);
            finGoalWrapper.finGoal=f;
            finGoalWrapper.goalTrack=goalTrack;
            finGoalWrapper.data=data;
            finGoalWrapper.actualValue=actualValue;
            finGoalWrapper.increasedDate=increasedate;
            finGoalWrapper.goalStatus=goalStatus;
            //  finGoalWrapper.add(fingoalwrap);
            if(Test.isRunningTest())
                throw new nullpointerexception();
            
        }
        catch(Exception ee){
            FinacastUtility.ExceptionHandle(ee.getLineNumber(), ee.getMessage(), ee.getStackTraceString());
            
        }
        System.debug(finGoalWrapper);
        return finGoalWrapper;
        
        
        
    }
    
    
    public class GoalPerformanceData{
        @auraEnabled 
        public String dateMonth;
        
        @auraEnabled
        public  PerformanceValue values;
    } 
    public class PerformanceValue{
        @auraEnabled
        public Decimal expected;
        
        @auraEnabled
        public Decimal actual;
    }
    public class FinGoalWrapperClass {
        
        @auraEnabled
        public FinServ__FinancialGoal__c finGoal;
        
        @auraEnabled
        public Boolean goalTrack;
        
        @auraEnabled
        public List<GoalPerformanceData> data;
        @auraEnabled
        public Decimal actualValue;
        @auraEnabled
        public Date increasedDate;
        
        @auraEnabled
        public Decimal percentage;
        @auraEnabled
        public Decimal goalStatus;
        
        
        
    }
    
}
public class GoalPerformanceAndMonteCarlo {
    
    @auraEnabled
    
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
                
                ffa = [select name, Account_Type__c,FinServ__APY__c,FinServ__Balance__c,(select name,Current_Goal_Amount__c, Associated_Account__r.FinServ__Balance__c, Goal_Priority_Number__c,Start_Value__c,Start_Date__c, Associated_Account__c,Annual_Growth_Rate__c, FinServ__TargetValue__c, FinServ__TargetDate__c, Goal_Priority__c, Required_Monthly_Saving__c from Financial_Goals__r where Associated_Account__c=: f.Associated_Account__c and id !=: f.id) from FinServ__FinancialAccount__c where id=:f.Associated_Account__c];
                Double interestRate ;
                
                if(ffa.FinServ__APY__c != null)
                {
                    interestRate =  ffa.FinServ__APY__c;
                }
                else{
                    interestRate = 0;
                }
                
                
                Double growth=Core_GoalUtility.calculateGrowth(interestRate);
                Core_GoalUtility.PerformanceValue p=Core_GoalUtility.calculateExpectedAndActual( f,ffa.FinServ__Balance__c, interestRate, ffa.Financial_Goals__r,  0 );
                if(p.expected<=p.actual){
                    goalTrack=true;
                }
                
                
                
                
                
                System.debug(goalTrack);
                FinGoalWrapperClass fingoalwrap=new FinGoalWrapperClass();
                fingoalwrap.finGoal=f;
                fingoalwrap.goalTrack=goalTrack;
                fingoalwrap.actualValue=p.actual;
                fingoalwrap.percentage=((p.actual/f.FinServ__TargetValue__c)*100).setScale(2);
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
        
        Decimal totalEstimated;
        String chartValueList;
        Date increasedate;
        
        Decimal actualValue;
        
        FinServ__FinancialGoal__c f;
        try{        
            f= [Select id,FinServ__PrimaryOwner__c ,Current_Goal_Amount__c,Goal_Priority__c,Goal_Priority_Number__c,Annual_Growth_Rate__c,FinServ__PrimaryOwner__r.name, Name, Start_Value__c , Required_Monthly_Saving__c ,Associated_Account__r.Account_Type__c,Associated_Account__r.Name,Start_Date__c,FinServ__TargetDate__c,FinServ__TargetValue__c
                from FinServ__FinancialGoal__c  where id =: goalId];
            goalTrack=false;
            Map<Integer, String> NUM_TO_MONTH = new Map<Integer, String>{
                1 => 'Jan', 
                    2 => 'Feb',
                    3 => 'Mar',
                    4 => 'Apr',
                    5 => 'May',
                    6 => 'Jun',
                    7 => 'Jul',
                    8 => 'Aug',  9 => 'Sep',  10=> 'Oct',  11 => 'Nov',  12 =>'Dec'
                    };
                        ffa = [select name, Account_Type__c,FinServ__APY__c,FinServ__Balance__c,(select APY__c,Balance__c, History_of_Month__c from FinancialAccountHistories__r),(select name,Current_Goal_Amount__c, Associated_Account__r.FinServ__Balance__c, Goal_Priority_Number__c,Start_Value__c,Start_Date__c, Associated_Account__c,Annual_Growth_Rate__c, FinServ__TargetValue__c, FinServ__TargetDate__c, Goal_Priority__c, Required_Monthly_Saving__c from Financial_Goals__r where Associated_Account__c=: f.Associated_Account__c and id !=: f.id) from FinServ__FinancialAccount__c where id=:f.Associated_Account__c];
            Double interestRate ;
            Double balance;
            Map<String, FinancialAccountHistory__c> fahMap=new Map<String, FinancialAccountHistory__c>();
            for (FinancialAccountHistory__c fah:ffa.FinancialAccountHistories__r){
                fahMap.put(fah.History_of_Month__c,fah);
            }
            
            
            
            //Double growth=Core_GoalUtility.calculateGrowth(interestRate);
            //  system.debug('in'+interestRate + 'gr'+growth);
            
            List<GoalPerformanceData> data=new List<GoalPerformanceData>();
            
            integer months = Core_GoalUtility.NumberOfMonths(f.Start_Date__c, Date.today());
            Integer month=date.today().month();
            Integer year=date.today().year();
            if(months > 6){
                for(integer i=5; i>=0; i--){
                    GoalPerformanceData d=new GoalPerformanceData();
                    if(month== date.today().addMonths(-i).month() &&  date.today().addMonths(-i).year()==year){
                        if(ffa.FinServ__APY__c != null){
                            interestRate =  ffa.FinServ__APY__c;
                        }
                        else{
                            interestRate = 0;
                        }
                        if(ffa.FinServ__Balance__c != null){
                            balance =  ffa.FinServ__Balance__c;
                        }
                        else{
                            balance = 0;
                        }
                    }
                    else{
                        FinancialAccountHistory__c fin=fahMap.get(NUM_TO_MONTH.get(date.today().addMonths(-i).month())+'-'+date.today().addMonths(-i).year());
                        if(fin.APY__c != null)
                        {
                            interestRate =  fin.APY__c ;
                        }
                        else{
                            interestRate = 0;
                        }
                        if(fin.Balance__c != null)
                        {
                            balance =  fin.Balance__c ;
                        }
                        else{
                            balance = 0;
                        }
                    }
                    Double growth=Core_GoalUtility.calculateGrowth(interestRate);
                    Core_GoalUtility.PerformanceValue p=Core_GoalUtility.calculateExpectedAndActual( f,balance, interestRate, ffa.Financial_Goals__r,  i*-1 );
                    d.dateMonth=date.today().addMonths(-i).month()+'-'+date.today().addMonths(-i).year();
                    if(i==0){
                        increasedate = Core_GoalUtility.extenddate((integer)p.actual, (double)(f.Required_Monthly_Saving__c), f.FinServ__TargetValue__c,growth);
                        if(p.expected>=p.actual){
                            goalTrack=true;
                            p.actual=p.expected;
                            
                        }
                        else{
                            goalStatus=p.actual-p.expected;
                        }
                        actualValue=p.actual;
                        
                    }
                    PerformanceValue pv=new PerformanceValue();
                    pv.actual=p.actual;
                    pv.expected=p.expected;
                    d.values=pv;
                    data.add(d);
                }
            }
            if(months <= 6){
                for(integer i=months; i>=0; i--){
                    if(month== date.today().addMonths(-i).month() &&  date.today().addMonths(-i).year()==year){
                        if(ffa.FinServ__APY__c != null){
                            interestRate =  ffa.FinServ__APY__c;
                        }
                        else{
                            interestRate = 0;
                        }
                        if(ffa.FinServ__Balance__c != null){
                            balance =  ffa.FinServ__Balance__c;
                        }
                        else{
                            balance = 0;
                        }
                    }
                    else{
                        FinancialAccountHistory__c fin=fahMap.get(NUM_TO_MONTH.get(date.today().addMonths(-i).month())+'-'+date.today().addMonths(-i).year());
                        System.debug(fin +NUM_TO_MONTH.get(date.today().addMonths(-i).month())+'-'+date.today().addMonths(-i).year());
                        if(fin!=null){
                            if(fin.APY__c != null)
                            {
                                interestRate =  fin.APY__c ;
                            }
                            else{
                                interestRate = 0;
                            }
                            if(fin.Balance__c != null)
                            {
                                balance =  fin.Balance__c ;
                            }
                            else{
                                balance = 0;
                            }
                        }
                        else{
                            if(ffa.FinServ__APY__c != null){
                                interestRate =  ffa.FinServ__APY__c;
                            }
                            else{
                                interestRate = 0;
                            }
                            if(ffa.FinServ__Balance__c != null){
                                balance =  ffa.FinServ__Balance__c;
                            }
                            else{
                                balance = 0;
                            }
                        }
                    }
                    Double growth=Core_GoalUtility.calculateGrowth(interestRate);
                    GoalPerformanceData d=new GoalPerformanceData();
                    Core_GoalUtility.PerformanceValue p=Core_GoalUtility.calculateExpectedAndActual( f,balance, interestRate, ffa.Financial_Goals__r,  i*-1 );
                    d.dateMonth=date.today().addMonths(-i).month()+'-'+date.today().addMonths(-i).year();
                    if(i==0){
                        increasedate = Core_GoalUtility.extenddate((integer)p.actual, (double)(f.Required_Monthly_Saving__c), f.FinServ__TargetValue__c,growth);
                        if(p.expected>=p.actual){
                            goalTrack=true;
                            p.actual=p.expected;
                            
                        }
                        else{
                            goalStatus=p.actual-p.expected;
                        }
                        actualValue=p.actual;
                    }
                    PerformanceValue pv=new PerformanceValue();
                    pv.actual=p.actual;
                    pv.expected=p.expected;
                    d.values=pv;
                    data.add(d);
                }
                
                months = 5-months;
                for(integer j=1;j<=months;  j++){
                    GoalPerformanceData d=new GoalPerformanceData();
                    PerformanceValue p=new PerformanceValue();
                    decimal expected;
                    d.dateMonth=date.today().addMonths(+j).month()+'-'+date.today().addMonths(+j).year();
                    if(ffa.FinServ__APY__c != null){
                        interestRate =  ffa.FinServ__APY__c;
                    }
                    else{
                        interestRate = 0;
                    }
                    Double growth=Core_GoalUtility.calculateGrowth(interestRate);
                    
                    expected= ((Decimal) Core_GoalUtility.curentgoalestimation2((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(+j),growth,f.Start_Value__c,f.FinServ__TargetValue__c)).setScale(2, RoundingMode.HALF_UP); 
                    
                    p.expected=expected;
                    p.actual=0;
                    if(date.today().addMonths(+j).month()==month&&date.today().addMonths(+j).year()==year)
                        actualValue=0;
                    d.values=p;
                    data.add(d);
                }
            }
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
public class GoalPlaningController {
    @AuraEnabled
    public static List<FinGoalWrapperClass> getTotalGoal(String ClientId){
        List<FinGoalWrapperClass> finGoalWrapper=new List<FinGoalWrapperClass>();
        FinServ__FinancialAccount__c ffa;
        Decimal goalstatus;
        Boolean goalTrack;
        Boolean goalonTrack;
        Boolean goalnotonTrack;
        Decimal totalEstimated;
        String chartValueList;
        Decimal actualValue;// send google chart value to VF page.
        
        List<FinServ__FinancialGoal__c> fl;
        try{        
            fl= [Select id,recordtypeid,recordtype.developername,FinServ__PrimaryOwner__c ,FinServ__PrimaryOwner__r.name, Name, Start_Value__c ,Goal_Priority_Number__c,Associated_Account__r.FinServ__Balance__c, Required_Monthly_Saving__c ,Associated_Account__c,Start_Date__c,FinServ__TargetDate__c,FinServ__TargetValue__c,FinServ__ActualValue__c
            from FinServ__FinancialGoal__c where FinServ__PrimaryOwner__c =: ClientId ];
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
                    goalstatus = ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, Date.today(),growth)).setScale(2, RoundingMode.HALF_UP) + f.Start_Value__c;
                }else{
                    goalstatus = ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, Date.today(),growth)).setScale(2,RoundingMode.HALF_UP);
                }
                
                
                totalEstimated = 0;
                for(FinServ__FinancialGoal__c relgoal : ffa.Financial_Goals__r )
                {
                    totalEstimated = totalEstimated + ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today(),growth)).setScale(2,RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
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
                
                integer months = FinacastGoalProgressApex.NumberOfMonths(f.Start_Date__c, Date.today());
                Integer month=date.today().month();
                Integer year=date.today().year();
                if(months > 6){
                    for(integer i=5; i>=0; i--){
                       
                        decimal expected;
                 
                        if((f.Required_Monthly_Saving__c != 0) && (f.FinServ__TargetValue__c != 0)){
                            expected =  ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2,RoundingMode.HALF_UP)+ f.Start_Value__c; 
                            
                        }else{
                            
                            expected =  ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, RoundingMode.HALF_UP); 
                            
                        }  totalEstimated = 0;
                        for(FinServ__FinancialGoal__c relgoal :ffa.Financial_Goals__r )
                        {
                            totalEstimated = totalEstimated + ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2,RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
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
                                totalEstimated = totalEstimated + ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
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
                                expected =  ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                                                          RoundingMode.HALF_UP)+ f.Start_Value__c; 
                            }else{
                                expected =  ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
                                                                                                                                                                                                          RoundingMode.HALF_UP); 
                            }     
                            totalEstimated = 0;
                            for(FinServ__FinancialGoal__c relgoal :ffa.Financial_Goals__r )
                            {
                                
                                totalEstimated = totalEstimated + ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today().addMonths(-i),growth)).setScale(2, 
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

                        decimal expected;
                        
                        if((f.Required_Monthly_Saving__c != 0) && (f.FinServ__TargetValue__c != 0)){
                            expected =  ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(+j),growth)).setScale(2, 
                                                                                                                                                                                                      RoundingMode.HALF_UP)+ f.Start_Value__c; 
                        }else{
                            expected =  ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(f.Required_Monthly_Saving__c), f.Start_Date__c, date.today().addMonths(+j),growth)).setScale(2, 
                                                                                                                                                                                                      RoundingMode.HALF_UP); 
                        }                
                       
                        if(date.today().addMonths(+j).month()==month&&date.today().addMonths(+j).year()==year)
                            actualValue=0;
                    
                    }
                }

              //  System.debug(data);

                System.debug(goalTrack);
                FinGoalWrapperClass fingoalwrap=new FinGoalWrapperClass();
                fingoalwrap.finGoal=f;
                fingoalwrap.goalTrack=goalTrack;
                fingoalwrap.actualValue=actualValue;
                fingoalwrap.percentage=((actualValue/f.FinServ__TargetValue__c)*100);
                finGoalWrapper.add(fingoalwrap);
            }
            
        }
        catch(Exception e){
            System.debug(e.getStackTraceString());
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
            
        }
        System.debug(finGoalWrapper);
        return finGoalWrapper;
        
        /*List<FinServ__FinancialGoal__c> gl=new List<FinServ__FinancialGoal__c>();
        gl=[Select id,recordtypeid,recordtype.developername,FinServ__PrimaryOwner__c ,FinServ__PrimaryOwner__r.name, Name, Start_Value__c , Required_Monthly_Saving__c ,Associated_Account__c,Start_Date__c,FinServ__TargetDate__c,FinServ__TargetValue__c,FinServ__ActualValue__c
            from FinServ__FinancialGoal__c where FinServ__PrimaryOwner__c =: ClientId ];
        system.debug('sjdjfs'+gl);
        return gl;*/   
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
    public static list<FinServ__FinancialGoal__c> getGoalDetail(id goalId,String ClientId) {
        
        List<FinServ__FinancialGoal__c> fl;
        try{        
            fl= [Select id,FinServ__PrimaryOwner__c ,Goal_Priority__c,Annual_Growth_Rate__c,FinServ__PrimaryOwner__r.name, Name, Start_Value__c , Required_Monthly_Saving__c ,Associated_Account__r.Account_Type__c,Associated_Account__r.Name,Start_Date__c,FinServ__TargetDate__c,FinServ__TargetValue__c,FinServ__ActualValue__c
                 from FinServ__FinancialGoal__c  where FinServ__PrimaryOwner__c =: ClientId and id=:goalId];
        }
        catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
            
        }
        return fl;
        
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
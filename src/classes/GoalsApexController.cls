public class GoalsApexController {
    
    public static Decimal goalstatus {get; set;}
    public static Decimal totalEstimated = 0;
    @auraEnabled
    public static List<List<Object>> getGoals() {
        List<Client_Adviser_Configuration__c> caConfigList = [select Adviser_Id__c,Client_Id__c,Client_Id__r.name  from Client_Adviser_Configuration__c where adviser_id__c =: UserInfo.getUserId() limit 1];
        Client_Adviser_Configuration__c caConfig = new Client_Adviser_Configuration__c();
        if(caConfigList.size()>0)
        {
            caConfig = caConfigList[0];
        }
        List<FinServ__FinancialGoal__c> retList = [Select id , Name, Associated_Account__r.FinServ__Balance__c,Current_Goal_Amount__c,FinServ__PrimaryOwner__r.name,Goal_Priority__c,Required_Monthly_Saving__c,Start_Value__c, Start_Date__c,Associated_Account__c, FinServ__TargetValue__c,FinServ__TargetDate__c
                                                   from FinServ__FinancialGoal__c where FinServ__PrimaryOwner__c =: caConfig.Client_Id__c ];
        List<String> clientName = new List<String>();
        clientName.add(caConfig.Client_Id__r.name);
        clientName.add(caConfig.Client_Id__c);
        List<List<Object>> returnObjList = new List<List<Object>>();
        try{
            for(FinServ__FinancialGoal__c fgoal : retList)
            {
                fgoal.Current_Goal_Amount__c =(Decimal) getCurrentAmount(fgoal)[0];
                fgoal.FinServ__Status__c = (String)getCurrentAmount(fgoal)[1];
            }
            
            
            returnObjList.add(retList);
            returnObjList.add(clientName);
        }
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return  returnObjList;
    }
    
    @auraEnabled
    public static void deleteGoals(id goalId) {
        try{
            if (Schema.sObjectType.FinServ__FinancialGoal__c.isDeletable()){
                FinServ__FinancialGoal__c goalItem = [Select id from FinServ__FinancialGoal__c where id =:goalId];
                
                delete goalItem;
            }
        }
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
    }
    
    
    @auraEnabled
    public static List<List<Object>> getClientGoals(String clientId) {
        List<List<Object>> returnObjList = new List<List<Object>>();
        
        try{
            List<FinServ__FinancialGoal__c> retList = [Select id , Name, Current_Goal_Amount__c,FinServ__PrimaryOwner__r.name, FinServ__TargetValue__c,FinServ__TargetDate__c
                                                       from FinServ__FinancialGoal__c where FinServ__PrimaryOwner__c =: clientId ];
            List<String> clientName = new List<String>();
            
            clientName.add([select id,name from account where id=: clientId ].name);
            clientName.add([select id,name from account where id=: clientId ].id);
            
            returnObjList.add(retList);
            returnObjList.add(clientName);
        }
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        return  returnObjList;
    }
    @AuraEnabled
    public static  List<Object> getCurrentAmount( FinServ__FinancialGoal__c retgoal )
    {
        system.debug('hh'+retgoal);
        String status;
        List<FinServ__FinancialGoal__c> allAssocGoals = New List<FinServ__FinancialGoal__c>();
         allAssocGoals = [select name,Current_Goal_Amount__c, Associated_Account__r.FinServ__Balance__c, Start_Value__c,Start_Date__c, Associated_Account__c,Annual_Growth_Rate__c, FinServ__TargetValue__c, FinServ__TargetDate__c, Goal_Priority__c, Required_Monthly_Saving__c from FinServ__FinancialGoal__c where Associated_Account__c=: retgoal.Associated_Account__c and id !=: retgoal.id and Goal_Priority__c <=: retgoal.Goal_Priority__c];
         system.debug('aa'+allAssocGoals);
        if((retgoal.Required_Monthly_Saving__c != 0) && (retgoal.FinServ__TargetValue__c != 0)){
            goalstatus = ((Decimal)curentgoalestimation((double)(retgoal.Required_Monthly_Saving__c), retgoal.Start_Date__c, Date.today())).setScale(2, 
                                                                                                                                                     RoundingMode.HALF_UP) + retgoal.Start_Value__c;
        }else{
            goalstatus = ((Decimal)curentgoalestimation((double)(retgoal.Required_Monthly_Saving__c), retgoal.Start_Date__c, Date.today())).setScale(2, 
                                                                                                                                                     RoundingMode.HALF_UP);
        }
        
        totalEstimated = 0;
        for(FinServ__FinancialGoal__c relgoal : allAssocGoals )
        {
            totalEstimated = totalEstimated + ((Decimal)curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today())).setScale(2, 
                                                                                                                                                                          RoundingMode.HALF_UP)+ relgoal.Start_Value__c; 
        }
        if(goalstatus > retgoal.Associated_Account__r.FinServ__Balance__c - totalEstimated){
            system.debug('retgoal.Associated_Account__r.FinServ__Balance__c');
            
            retgoal.Current_Goal_Amount__c = retgoal.Associated_Account__r.FinServ__Balance__c - totalEstimated;
            goalstatus =    goalstatus - retgoal.Current_Goal_Amount__c;
            status = 'Not On Track';
            
        }else {
            goalstatus = goalstatus;
            retgoal.Current_Goal_Amount__c = goalstatus;
            status = 'Track';
            
        }
        List<Object> retList = new List<Object>();
        try{
            retList.add(retgoal.Current_Goal_Amount__c);
            retlist.add(status);
        }
        Catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return retlist;
    }      
    public static double curentgoalestimation(double emi, Date startDate, Date todaydate ){
        double result = 0;
        Integer months = 0;
        try{
            months = NumberOfMonths(startDate, todaydate);
            if(months >= 1){
                result = months*emi;
            }
        }
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return result;
    }
    public static integer NumberOfMonths(Date startDate, Date endDate){
        
        if(startDate != null && endDate != null){
            Integer months = 0;
            try{
                months = startDate.monthsBetween(endDate);
                
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
    
    
    
}
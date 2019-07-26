/******* Developer Name: Aditya Kaushal
* Updated on July 5'19
* *******************************/
public class FinacastUtility {
    
    public static Id getRecordTypeId(String objectAPIName , String recordTypeName)
        
    {
        if(objectAPIName.split('__').size()==2){
        String namespace=NamespaceUtility.returnNamespace();
        objectAPIName=namespace+objectAPIName;
        }
        //system.debug('objectName'+objectName);
        return database.query('select id from recordtype where recordtype.developername =: recordTypeName and  SobjectType =:objectAPIName ' ).id;
    }
    
    // Pass in the endpoint to be used using the string url, request Type, and post data in any else pass 0
    public static String getCalloutResponseContents(String url, String requestName, String postData) {
        
        System.debug('postData: '+ postData+ 'requestName: '+ requestName);
        String userName = 'finacastapi';
        String password = 'mytafi@123';
        // Instantiate a new http object
        Http h = new Http();
        
        // Instantiate a new HTTP request, specify the method (GET) as well as the endpoint  
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setTimeout(20000);
        request.setMethod(requestName);
        System.debug(postData);
        
        if(requestName =='POST'){
            request.setHeader('Content-Type', 'application/json;charset=UTF-8');
            //Authenticate the org
            request.setHeader('Authorization', 'Basic '+ EncodingUtil.base64Encode(Blob.valueOf(username+':'+password)));
            //set request body
            request.setBody(postData);
        }
        
        // Send the request, and return a response
        HttpResponse response = h.send(request);
        
        //check Status and debug response
        System.debug('Status Code: ' + response.getStatusCode());
        System.debug('Response: ' + response.getBody());
        
        //return response
        return response.getBody();
    }
    
    
    @AuraEnabled
    public static void ExceptionHandle(Integer LineNumber, String Message,string StackTrace)
    {
        Exception_Details__c ex =new Exception_Details__c();
        ex.Message__c = Message;
        ex.Line_Number__c = LineNumber;
        ex.Stack_Trace__c = StackTrace;
        insert ex;  
    }
    
    
    //builds data for scenarios to make callout
    public static String buildScenarioRequestData2(List<Scenario_Income__c> incomeList1, List<Scenario_Expense__c> expenseList1 , List<Scenario_Savings__c> fAccList1, List<Scenario_Debt__c> debtAccList1, List<Scenario_Goal__c> goalList1, String sceneId, String clientId) {
        
        System.debug('inside Method create Client');      
        Boolean showClientLookup = false;
        Boolean fadeOut = false; 
        Boolean isSelected =false;
        Boolean cashFlowPopup;
        String setData;
        Map<string, String> accountNameMap = new  Map<string, String>();
        Map<string, String> categoryNameMap = new Map<string, String>();
        Map<string, String> CategoryMap2 = new Map<string, String>();
        List<Scenario_Income__c> incmeList = new List<Scenario_Income__c>();
        List<Scenario_Expense__c> expList = new List<Scenario_Expense__c>();
        
        //Store Household status here
        Boolean isHousehold = false;
        Account a = [select id, Name, RecordType.DeveloperName from Account where id =: clientId];
        if(a.RecordType.DeveloperName == 'IndustriesHousehold'){
            isHousehold = true;
        }
        
        /************ For Household Accounts ********/
        if(isHousehold){            
            List<account> householdMembersList = new List<Account>();
            //householdMembersList = [select id, name from FinServ__AccountAccountRelation__c where FinServ__RelatedAccount__c =: clientId];           
            system.debug('Inside Household');       
            String FSK ='a22955a47eff160d4ba3ee2bc35581818336cd8d3c73ea789b52c14d6eeba212c6a572097cbb1bf11e29422cefc2f89as';
            
            if(clientId != null && clientId != '' && FSK.length() > 0 && FSK != Null) {                 
                isSelected = false;
                cashFlowPopup = false;
                List<FinServ__FinancialAccount__c> FFDAList = new List<FinServ__FinancialAccount__c>();
                List<FinServ__FinancialAccount__c> FFAList = new List<FinServ__FinancialAccount__c>();
                
                try {               
                    System.debug('Inside try');
                    setData = '{"key":"'+FSK+'","formParams":"[';
                    
                    //double monthlyIncome = 0;                   
                    incmeList = [Select id, Name, Amount__c,Start_Date__c,End_Date__c,Frequency__c from Scenario_Income__c where client_ID__c =: clientId 
                                 and Scenario_Id__c = :sceneId ];
                    
                    System.debug('client Id: '+ clientId);
                    System.debug('Income List: ' + incmeList);
                    
                    //Create Income List
                    if(incmeList!=null && incmeList.size() > 0){
                        Integer i = 1;
                        for(Scenario_Income__c inc: incmeList) {
                            Double incomeAmount = 0;
                            Double incomeFrequency = 1;
                            switch on inc.Frequency__c {
                                when 'Monthly' {
                                    incomeFrequency = 1;
                                }   
                                when 'Semi Monthly' {
                                    incomeFrequency = 2;
                                }
                                when 'Bi-Weekly' {
                                    incomeFrequency = 2;
                                }
                                when 'Weekly' {
                                    incomeFrequency = 4;
                                }
                                when else {
                                    incomeFrequency = 1;
                                }
                            }
                            if(inc.Amount__c != Null){
                                incomeAmount = inc.Amount__c.round();
                            }
                            else {
                                incomeAmount = 0;
                            }
                            setData +='{';
                            setData +='\'id\':\'' + i + '\',';
                            setData +='\'type\':\'income\',';
                            setData +='\'name\':\''+inc.Name+'\',';
                            setData +='\'amount\':'+incomeAmount+',';
                            setData +='\'incomepopuppretax\':'+incomeAmount+',';
                            setData +='\'incomepopupfrequency\':\'' + incomeFrequency + '\',';
                            setData +='\'incomepopupgrowthrate\':\'0\',';
                            setData +='\'startdate\':\'' + inc.Start_Date__c.month() + '/' + inc.Start_Date__c.year() + '\',';
                            setData +='\'enddate\':\'' + inc.End_Date__c.month() + '/' + inc.End_Date__c.year() + '\'';
                            setData +='},';
                            CategoryMap2.put(inc.id, inc.Name.toUppercase());
                            categoryNameMap.put(inc.id, inc.Name);
                            ++i;
                        }//end of for
                    }//end of if
                    else {
                        String startdate = '1/2018';
                        String enddate = '12/2100';
                        setData +='{';
                        setData +='\'id\':\'1\',';
                        setData +='\'type\':\'income\',';
                        setData +='\'name\':\'income\',';
                        setData +='\'amount\':0,';
                        setData +='\'incomepopuppretax\':0,';
                        setData +='\'incomepopupfrequency\':\'1\',';
                        setData +='\'incomepopupgrowthrate\':\'0\',';
                        setData +='\'startdate\':\'' + startdate + '\',';
                        setData +='\'enddate\':\'' + enddate + '\'';
                        setData +='},';
                    }
                    
                    
                    System.debug('income here: ' + setData);
                    Integer flag = 0; 
                    Map<id, integer> FFAMap = new Map<id, integer>();
                    
                    //non Loan and Non credit accouts, i.e., savings and investment
                    FFAList = [Select id, Name, 
                               //Current_Value__c, 
                               FinServ__Balance__c, FinServ__APY__c from FinServ__FinancialAccount__c where
                               Account_Type__c != 'Loan' and Account_Type__c !='Credit Card' and
                               RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                               RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                               RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                               FinServ__Household__c =: clientId and Scenario_Id__c = :sceneId
                               limit 1000];
                    
                    System.debug('FFA List: '+FFAList.size());
                    
                    if(FFAList.size() > 0){
                        for(FinServ__FinancialAccount__c FFA : FFAList){
                            accountNameMap.put(FFA.Id, FFA.Name);
                            flag++;
                            FFAMap.put(FFA.Id, flag);
                            setData +='{';
                            setData +='\'id\':\''+flag+'\',';
                            setData +='\'type\':\'account\',';
                            setData +='\'accountype\':\'3\',';
                            setData +='\'name\':\''+FFA.Name+'\',';
                            if(FFA.FinServ__Balance__c == null){
                                FFA.FinServ__Balance__c = 0;
                            }
                            setData +='\'amount\':'+FFA.FinServ__Balance__c+',';
                            if(FFA.FinServ__APY__c == null){
                                FFA.FinServ__APY__c = 0;
                            }
                            setData +='\'APR\':'+FFA.FinServ__APY__c;
                            setData +='},';
                        }
                    }
                    
                    // Loan and debt accounts
                    System.debug('above');
                    FFDAList = [select id, Name, FinServ__APY__c, FinServ__Balance__c, FinServ__LoanAmount__c, FinServ__PrimaryOwner__c, Account_Type__c, FinServ__PaymentAmount__c
                                from FinServ__FinancialAccount__c where
                                (Account_Type__c = 'Loan' or
                                 Account_Type__c = 'Credit Card') AND
                                RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                                RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                                RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                                FinServ__Household__c =: clientId and Scenario_Id__c = :sceneId
                                limit 1000];
                    
                    /*********** NOTE: Outstanding Payment and Loan End Date *********/
                    
                    
                    System.debug('Debt Accounts: ' + FFDAList.size());
                    if(FFDAList.size() > 0){
                        for(FinServ__FinancialAccount__c FFDA : FFDAList){
                            accountNameMap.put(FFDA.Id, FFDA.Name);
                            flag++;
                            setData +='{';
                            setData +='\'id\':\''+flag+'\',';
                            setData +='\'type\':\'account\',';
                            
                            //term Loan
                            if(FFDA.Account_Type__c == 'Credit Card'){
                                setData +='\'accountype\':\'account_creditcard\',';
                                setData +='\'name\':\''+FFDA.Name+'\',';
                                
                                //fill which ever is not empty
                                if(FFDA.FinServ__LoanAmount__c != Null){
                                    setData +='\'amount\':'+FFDA.FinServ__LoanAmount__c+',';
                                }else {
                                    setData +='\'amount\':'+FFDA.FinServ__Balance__c+',';
                                }
                                
                            }else if(FFDA.Account_Type__c == 'Loan'){
                                setData +='\'accountype\':\'account_loan\',';
                                setData +='\'name\':\''+FFDA.Name+'\',';
                                setData +='\'amount\':'+FFDA.FinServ__PaymentAmount__c+',';
                                
                                setData +='\'endDate\':\''+Date.today().month()+'/'+Date.today().year()+'\',';
                                setData +='\'outstandingamt\':'+FFDA.FinServ__LoanAmount__c+',';
                            }
                            else{}
                            setData +='\'APR\':'+FFDA.FinServ__APY__c;
                            setData +='},';
                        }
                    }
                    //Goals Data
                    
                    List<FinServ__FinancialGoal__c> goalList = [select Start_Value__c,
                                                                //Account_Value__c, 
                                                                Name, 
                                                                Required_Monthly_Saving__c, Start_Date__c, FinServ__TargetValue__c,
                                                                Annual_Growth_Rate__c,  FinServ__TargetDate__c, Associated_Account__c, Goal_Priority__c 
                                                                from FinServ__FinancialGoal__c where
                                                                RecordType.DeveloperName !='Scenario_Goal_Record_Type' and
                                                                FinServ__Household__c =: clientId and Scenario_Id__c = :sceneId
                                                                limit 1000];
                    System.debug('Goal List: ' + goalList);
                    if(goalList.size() > 0){
                        for(FinServ__FinancialGoal__c goal : goalList){
                            Decimal growth=0;
                            flag++;
                            setData +='{';
                            setData +='\'id\':\''+flag+'\',';
                            setData +='\'type\':\'goals\',';
                            Decimal getcurrentEstimation = ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today(),growth)).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c;
                            //System.debug('Goal Estimation'+((Decimal)curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today())).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c);
                            setData +='\'currentamount\':\''+getcurrentEstimation+'\',';
                            setData +='\'name\':\''+goal.Name+'\',';
                            setData +='\'monthlycontribution\':'+goal.Required_Monthly_Saving__c+',';
                            setData +='\'startdate\':\''+goal.Start_Date__c.month()+'/'+goal.Start_Date__c.year()+'\',';
                            setData +='\'targetamount\':'+goal.FinServ__TargetValue__c+',';
                            setData +='\'priority\':'+goal.Goal_Priority__c+',';
                            setData +='\'growth\':'+goal.Annual_Growth_Rate__c+',';
                            setData +='\'targetdate\':\''+goal.FinServ__TargetDate__c.month()+'/'+goal.FinServ__TargetDate__c.year()+'\',';
                            setData +='\'savingid\':\''+FFAMap.get(goal.Associated_Account__c)+'\',';
                            setData +='\'startvalue\':\''+goal.Start_Value__c+'\'';
                            setData +='},';
                        }                   
                    } //end of if
                    
                    
                    //Create Expense Data
                    expList = [Select id, Name, Amount__c ,Start_Date__c, End_Date__c from Scenario_Expense__c where client_Id__c =: clientId  and Scenario_Id__c = :sceneId]; 
                    System.debug('Expense List: ' + expList);
                    double monthlyExpenses = 0;
                    //set expenses here    
                    if(expList!=null && expList.size() > 0){
                        Integer j=1;
                        for(Scenario_Expense__c e: expList) {
                            if(e.Amount__c != Null){
                                monthlyExpenses+= e.Amount__c;
                            } 
                            else {
                                monthlyExpenses += 0; 
                            }
                            setData +='{';
                            setData +='\'id\':\''+j+'\',';
                            setData +='\'type\':\''+e.Name+'\',';
                            if(monthlyExpenses != null){
                                setData +='\'amount\':'+monthlyExpenses+',';
                            }else{
                                setData +='\'amount\':0,';
                            }
                            setData +='\'startdate\':\'' + e.Start_Date__c.month() + '/' + e.Start_Date__c.year() + '\',';
                            setData +='\'enddate\':\'' + e.End_Date__c.month() + '/' + e.End_Date__c.year() + '\'';
                            setData +='}';
                            ++j;
                        }//end for
                    }//end if
                    else {
                        String startdate = '1/2018';
                        String enddate = '12/2100';
                        setData +='{';
                        setData +='\'id\':\'1\',';
                        setData +='\'type\':\'expenses\',';
                        setData +='\'amount\':0,';
                        setData +='\'startdate\':\'' + startdate + '\',';
                        setData +='\'enddate\':\'' + enddate + '\'';
                        setData +='}';
                    }
                    setData += ']"}';
                    
                    //clientData = setData;
                    System.debug('Client Data from Future Simulation: ' + setData);
                } //end of try            
                catch(Exception e){
                    System.debug('Exception' + e.getStackTraceString());
                    FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
                }
            }
            System.debug('HouseHold Request Data:' + setData);
            return setData;                                
        }
        //end of Household  
        
        
        
        
        //CASe 2: here
        /******** Normal non - Household Code goes here *******/
        else {              
            String FSK ='a22955a47eff160d4ba3ee2bc35581818336cd8d3c73ea789b52c14d6eeba212c6a572097cbb1bf11e29422cefc2f89as';
            
            if(clientId != null && clientId != '' && FSK.length() > 0 && FSK != Null) { 
                
                isSelected = false;
                cashFlowPopup = false;
                List<Scenario_Debt__c> FFDAList = new List<Scenario_Debt__c>();
                List<Scenario_Savings__c> FFAList = new List<Scenario_Savings__c>();
                
                try {                
                    System.debug('Inside try');
                    setData = '{"key":"'+FSK+'","formParams":"[';
                    
                    //-------->Incomes come here
                    incmeList = [Select id, Name, Amount__c,Start_Date__c,End_Date__c,Frequency__c from Scenario_Income__c where client_Id__c =: clientId and Scenario_Id__c = :sceneId]; 
                    System.debug('client Id: '+ clientId);
                    System.debug('Income List: ' + incmeList);
                    
                    //set monthly income here 
                    if(incmeList!=null && incmeList.size() > 0){
                        Integer i = 1;
                        for(Scenario_Income__c inc: incmeList) {
                            Double incomeAmount = 0;
                            Double incomeFrequency = 1;
                            switch on inc.Frequency__c {
                                when 'Monthly' {
                                    incomeFrequency = 1;
                                }   
                                when 'Semi Monthly' {
                                    incomeFrequency = 2;
                                }
                                when 'Bi-Weekly' {
                                    incomeFrequency = 2;
                                }
                                when 'Weekly' {
                                    incomeFrequency = 4;
                                }
                                when else {
                                    incomeFrequency = 1;
                                }
                            }
                            if(inc.Amount__c != Null){
                                incomeAmount = inc.Amount__c.round();
                            }
                            else {
                                incomeAmount = 0;
                            }
                            setData +='{';
                            setData +='\'id\':\'' + i + '\',';
                            setData +='\'type\':\'income\',';
                            setData +='\'name\':\''+inc.Name+'\',';
                            setData +='\'amount\':'+incomeAmount+',';
                            setData +='\'inctaxrate\':'+'0'+',';
                            setData +='\'incomepopuppretax\':'+incomeAmount+',';
                            setData +='\'incomepopupfrequency\':\'' + incomeFrequency + '\',';
                            setData +='\'incomepopupgrowthrate\':\'0\',';
                            setData +='\'startdate\':\'' + inc.Start_Date__c.month() + '/' + inc.Start_Date__c.year() + '\',';
                            setData +='\'enddate\':\'' + inc.End_Date__c.month() + '/' + inc.End_Date__c.year() + '\'';
                            setData +='},';
                            CategoryMap2.put(inc.id, inc.Name.toUppercase());
                            categoryNameMap.put(inc.id, inc.Name);
                            ++i;
                        }//end of for
                    }//end of if
                    else {
                        String startdate = '1/2018';
                        String enddate = '12/2100';
                        setData +='{';
                        setData +='\'id\':\'1\',';
                        setData +='\'type\':\'income\',';
                        setData +='\'name\':\'income\',';
                        setData +='\'amount\':0,';
                        setData +='\'incomepopuppretax\':0,';
                        setData +='\'incomepopupfrequency\':\'1\',';
                        setData +='\'incomepopupgrowthrate\':\'0\',';
                        setData +='\'startdate\':\'' + startdate + '\',';
                        setData +='\'enddate\':\'' + enddate + '\'';
                        setData +='},';
                    }
                    System.debug('income here: ' + setData);
                    
                    
                    
                    //------->Financial Acccounts
                    Integer flag = 0; 
                    Map<id, integer> FFAMap = new Map<id, integer>();
                    
                    // savings and investment
                    FFAList = [Select id, Name, Current_Value__c, 
                               //FinServ__Balance__c,
                               APY__c from Scenario_Savings__c where
                               Client_Id__c =: clientId  
                               AND Scenario__c = :sceneId
                               limit 1000];
                    
                    System.debug('FFA List: '+FFAList.size());
                    
                    if(FFAList.size() > 0){
                        for(Scenario_Savings__c FFA : FFAList){
                            accountNameMap.put(FFA.Id, FFA.Name);
                            flag++;
                            FFAMap.put(FFA.Id, flag);
                            setData +='{';
                            setData +='\'id\':\''+flag+'\',';
                            setData +='\'type\':\'account\',';
                            setData +='\'accountype\':\'3\',';
                            setData +='\'name\':\''+FFA.Name+'\',';
                            setData +='\'isTaxBenefit\':'+'false'+',';
                            if(FFA.Current_Value__c == null){
                                FFA.Current_Value__c = 0;
                            }
                            setData +='\'amount\':'+FFA.Current_Value__c+',';
                            if(FFA.APY__c == null){
                                FFA.APY__c = 0;
                            }
                            setData +='\'APR\':'+FFA.APY__c;
                            setData +='},';
                        }
                    }
                    
                    // Loan and debt accounts
                    System.debug('above' + FFAMap);
                    FFDAList = [select id, Name, APR__c,
                                //FinServ__Balance__c, 
                                Current_Value__c, Client_Id__c, Payment_Amount__c
                                from Scenario_Debt__c where
                                Client_Id__c =: clientId  
                                AND Scenario_Id__c = :sceneId
                                limit 1000];
                    
                    /*********** NOTE: Outstanding Payment and Loan End Date *********/
                    
                    System.debug('Debt Accounts: ' + FFDAList.size() + FFDAList);
                    if(FFDAList.size() > 0){
                        for(Scenario_Debt__c FFDA : FFDAList){
                            accountNameMap.put(FFDA.Id, FFDA.Name);
                            flag++;
                            setData +='{';
                            setData +='\'id\':\''+flag+'\',';
                            setData +='\'type\':\'account\',';
                            setData +='\'isTaxBenefit\':'+'false'+','; 
                            //term Loan
                            
                            /*   if(FFDA.Account_Type__c == 'Credit Card'){
setData +='\'accountype\':\'account_creditcard\',';
setData +='\'name\':\''+FFDA.Name+'\',';

//fill which ever is not empty
if(FFDA.FinServ__LoanAmount__c != Null){
setData +='\'amount\':'+FFDA.FinServ__LoanAmount__c+',';
}else {
setData +='\'amount\':'+FFDA.FinServ__Balance__c+',';
}

}else if(FFDA.Account_Type__c == 'Loan'){ */
                            
                            setData +='\'accountype\':\'account_loan\',';
                            setData +='\'name\':\''+FFDA.Name+'\',';
                            setData +='\'amount\':'+FFDA.Payment_Amount__c+',';
                            
                            setData +='\'startdate\':\''+Date.today().month()+'/'+Date.today().year()+'\',';
                            setData +='\'outstandingamt\':'+FFDA.Current_Value__c+',';
                            //  }
                            // else{}
                            setData +='\'APR\':'+FFDA.APR__c;
                            setData +='},';
                        }
                    }
                    
                    //----------->   Goals Data
                    
                    List<Scenario_Goal__c> goalList = [select Name, Associated_Account__c,
                                                       Scenario_Monthly_Contribution__c, Scenario_Start_Date__c, Scenario_Target_Amount__c,
                                                       Scenario_Current_Amount__c,Scenario_Goal_Priority__c,Scenario_Target_Date__c 
                                                       from Scenario_Goal__c where
                                                       Client_Id__c =: clientId and Scenario__c = :sceneId
                                                       limit 1000];
                    System.debug('Goal List: ' + goalList);
                    if(goalList.size() > 0){
                        for(Scenario_Goal__c goal : goalList){
                            System.debug('Gere0');
                            Decimal growth=0;
                            Decimal Annual_Growth_Rate = 0, startValue =0;
                            Integer Scenario_Goal_Priority = 1;
                            flag++;
                            setData +='{';
                            setData +='\'id\':\''+flag+'\',';
                            setData +='\'type\':\'goals\',';
                            System.debug('Gere');
                            Decimal getcurrentEstimation = ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(goal.Scenario_Monthly_Contribution__c), goal.Scenario_Start_Date__c, Date.today(), growth)).setScale(2, RoundingMode.HALF_UP) + goal.Scenario_Current_Amount__c;
                            System.debug('Goal Estimation'+ getcurrentEstimation);
                            setData +='\'currentamount\':\''+getcurrentEstimation+'\',';
                            setData +='\'name\':\''+goal.Name+'\',';
                            System.debug('Gere2');
                            setData +='\'monthlycontribution\':'+goal.Scenario_Monthly_Contribution__c+',';
                            setData +='\'startdate\':\''+goal.Scenario_Start_Date__c.month()+'/'+goal.Scenario_Start_Date__c.year()+'\',';
                            setData +='\'targetamount\':'+goal.Scenario_Target_Amount__c+',';
                            setData +='\'priority\':'+Scenario_Goal_Priority+',';
                            System.debug('Gere3');
                            setData +='\'growth\':'+Annual_Growth_Rate+',';
                            setData +='\'targetdate\':\''+goal.Scenario_Target_Date__c.month()+'/'+goal.Scenario_Target_Date__c.year()+'\',';
                            
                            setData +='\'savingid\':\''+FFAMap.get(goal.Associated_Account__c)+'\',';
                            
                            setData +='\'startvalue\':\''+goal.Scenario_Current_Amount__c+'\',';
                            setData +='\'isTaxBenefit\':'+'false';
                            setData +='},';
                        }                   
                    } //end of if
                    
                    
                    //-------------> expense List
                    expList = [Select id, Name, Amount__c, Start_Date__c, End_Date__c  from Scenario_Expense__c where client_Id__c =: clientId  and Scenario_Id__c = :sceneId];    
                    System.debug('Expense List: ' + expList);
                    double monthlyExpenses = 0;  
                    if(expList!=null && expList.size() > 0){
                        Integer j=1;
                        for(Scenario_Expense__c e: expList) {
                            if(e.Amount__c != Null){
                                monthlyExpenses+= e.Amount__c;
                            } 
                            else {
                                monthlyExpenses += 0; 
                            }
                            setData +='{';
                            setData +='\'id\':\''+j+'\',';
                            setData +='\'type\':\''+e.Name+'\',';
                            if(monthlyExpenses != null){
                                setData +='\'amount\':'+monthlyExpenses + ',';
                            }else{
                                setData +='\'amount\':0,';
                            }
                            setData +='\'startdate\':\'' + e.Start_Date__c.month() + '/' + e.Start_Date__c.year() + '\',';
                            setData +='\'enddate\':\'' + e.End_Date__c.month() + '/' + e.End_Date__c.year() + '\'';
                            setData +='}';
                            ++j;
                        }//end for
                    }//end if
                    else {
                        String startdate = '1/2018';
                        String enddate = '12/2100';
                        setData +='{';
                        setData +='\'id\':\'1\',';
                        setData +='\'type\':\'expenses\',';
                        setData +='\'amount\':0,';
                        setData +='\'startdate\':\'' + startdate + '\',';
                        setData +='\'enddate\':\'' + enddate + '\'';
                        setData +='}';
                    }
                    
                    setData += ']"}';
                    System.debug('Client Data from Future Simulation: ' + setData);
                } //end of try            
                catch(Exception e){
                    System.debug('Exception' + e.getStackTraceString());
                    FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
                }
            }
            System.debug('Scenario Non-HouseHold Request Data: ' + setData);
            return setData;
        }
    }
    
    
    
}
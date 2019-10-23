/******* Developer Name: Aditya Kaushal
* Updated on July 5'19
* *******************************/

public class FinacastUtility {
    
    public static Id getRecordTypeId(String objectAPIName , String recordTypeName) {
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
    
    public static void ExceptionHandle(Integer LineNumber, String Message,string StackTrace)
    {
        List<Exception_Details__c> listOfExceptionDetails = new List<Exception_Details__c>();
        Exception_Details__c ex =new Exception_Details__c();
        ex.Message__c = Message;
        ex.Line_Number__c = LineNumber;
        ex.Stack_Trace__c = StackTrace;
        listOfExceptionDetails.add(ex);
        insert listOfExceptionDetails;  
    }
    
    //builds data for scenarios to make callout
    public static String buildScenarioRequestData2(String sceneId, String clientId) {
        
        String setData;
        String FSK ='a22955a47eff160d4ba3ee2bc35581818336cd8d3c73ea789b52c14d6eeba212c6a572097cbb1bf11e29422cefc2f89as';
            
            if(clientId != null && clientId != '' && FSK.length() > 0 && FSK != Null) { 
  				Map<string, String> accountNameMap = new  Map<string, String>();
        Map<string, String> categoryNameMap = new Map<string, String>();
        Map<string, String> CategoryMap2 = new Map<string, String>();
        List<Scenario_Income__c> incmeList = new List<Scenario_Income__c>();
        List<Scenario_Expense__c> expList = new List<Scenario_Expense__c>();
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
                    FFDAList = [select id, Name, APR__c,Frequency__c,
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
                            Double loanFrequency = 0;
                            switch on FFDA.Frequency__c {
                                when 'Monthly' {
                                    loanFrequency = 1;
                                }   
                                when 'Semi Monthly' {
                                    loanFrequency = 2;
                                }
                                when 'Bi-Weekly' {
                                    loanFrequency = 2;
                                }
                                when 'Weekly' {
                                    loanFrequency = 4;
                                }
                                when else {
                                    loanFrequency = 1;
                                }
                            }
                            accountNameMap.put(FFDA.Id, FFDA.Name);
                            flag++;
                            setData +='{';
                            setData +='\'id\':\''+flag+'\',';
                            setData +='\'type\':\'account\',';
                            setData +='\'isTaxBenefit\':'+'false'+','; 
                            //term Loan
                            
                            setData +='\'accountype\':\'account_loan\',';
                            setData +='\'name\':\''+FFDA.Name+'\',';
                            setData +='\'amount\':'+FFDA.Payment_Amount__c+',';
                             setData +='\'loanfrequency\':\'' + loanFrequency + '\',';
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
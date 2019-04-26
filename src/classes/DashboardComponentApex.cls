/*************       Developer Name: Aditya Kaushal, Winter 18           *********/

public class DashboardComponentApex {
    
    public static List<Double> tempList = new List<Double>();
    public static Boolean isportalEnabled = false;
    public static String initialClient = '';
    public static String initialClientId = '';
    public static Boolean isHousehold = false;
    public static String clientData = '';
    public static String requestEndpoint='https://mytafi.herokuapp.com/rest/service/getFinacastHealthScoreNew';
    
    
    //Create client data
    @auraEnabled
    public static String createClientData(String clientId){
        
        //distinguish between first init and selected client and set client id
        if(clientId =='init'){
            clientId = initialClientId;
        }
        
        System.debug('inside Method create Client');              
        Boolean showClientLookup = false;
        Boolean fadeOut = false; 
        Boolean isSelected =false;
        Boolean cashFlowPopup;
        String setData;
        Map<string, String> accountNameMap = new  Map<string, String>();
        Map<string, String> categoryNameMap = new Map<string, String>();
        Map<string, String> CategoryMap2 = new Map<string, String>();
        List<Budget__c> incmeList = new List<Budget__c>();
        List<Budget__c> expList = new List<Budget__c>();        
        //String FSK ='a22955a47eff160d4ba3ee2bc35581818336cd8d3c73ea789b52c14d6eeba212c6a572097cbb1bf11e29422cefc2f89as';
        
        
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
                    incmeList = [Select id, Name, Amount__c,Income_Start_Date__c,Income_End_Date__c,Frequency__c from Budget__c where HouseHold__c =: clientId 
                                 and recordType.developerName = 'Income_Record_Type' ];
                    
                    System.debug('client Id: '+ clientId);
                    System.debug('Income List: ' + incmeList);
                    
                    //Create Income List
                    if(incmeList!=null && incmeList.size() > 0){
                        Integer i = 1;
                        for(Budget__c inc: incmeList) {
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
                            setData +='\'startdate\':\'' + inc.Income_Start_Date__c.month() + '/' + inc.Income_Start_Date__c.year() + '\',';
                            setData +='\'enddate\':\'' + inc.Income_End_Date__c.month() + '/' + inc.Income_End_Date__c.year() + '\'';
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
                               FinServ__Household__c =: clientId 
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
                    FFDAList = [select id, Name, APR__c, FinServ__Balance__c, FinServ__LoanAmount__c, FinServ__PrimaryOwner__c, Account_Type__c, FinServ__PaymentAmount__c
                                from FinServ__FinancialAccount__c where
                                (Account_Type__c = 'Loan' or
                                 Account_Type__c = 'Credit Card') AND
                                RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                                RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                                RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                                FinServ__Household__c =: clientId 
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
                            setData +='\'APR\':'+FFDA.APR__c;
                            setData +='},';
                        }
                    }
                    //Goals Data
                    
                    List<FinServ__FinancialGoal__c> goalList = [select Start_Value__c,
                                                                //Account_Value__c, 
                                                                Name, 
                                                                Required_Monthly_Saving__c, Start_Date__c, FinServ__TargetValue__c,
                                                                Annual_Growth_Rate__c, 	FinServ__TargetDate__c, Associated_Account__c, Goal_Priority__c 
                                                                from FinServ__FinancialGoal__c where
                                                                RecordType.DeveloperName !='Scenario_Goal_Record_Type' and
                                                                FinServ__Household__c =: clientId
                                                                limit 1000];
                    System.debug('Goal List: ' + goalList);
                    if(goalList.size() > 0){
                        for(FinServ__FinancialGoal__c goal : goalList){
                            
                            flag++;
                            setData +='{';
                            setData +='\'id\':\''+flag+'\',';
                            setData +='\'type\':\'goals\',';
                            Decimal getcurrentEstimation = ((Decimal)curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today())).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c;
                            System.debug('Goal Estimation'+((Decimal)curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today())).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c);
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
                    expList = [Select id, Name, Amount__c ,Income_Start_Date__c, Income_End_Date__c, Expense_Start_Date__c,Expense_End_Date__c from Budget__c where HouseHold__c =: clientId 
                               and recordType.developerName = 'Expense_Record_Type']; 
                    System.debug('Expense List: ' + expList);
                    double monthlyExpenses = 0;
                    //set expenses here    
                    if(expList!=null && expList.size() > 0){
                        Integer j=1;
                        for(Budget__c e: expList) {
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
                            setData +='\'startdate\':\'' + e.Income_Start_Date__c.month() + '/' + e.Income_Start_Date__c.year() + '\',';
                            setData +='\'enddate\':\'' + e.Income_End_Date__c.month() + '/' + e.Income_End_Date__c.year() + '\'';
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
                    
                    clientData = setData;
                    System.debug('Client Data from Future Simulation: ' + clientData);
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
        
        
        
        /******** Normal non - Household Code goes here *******/
        else {            	
            String FSK ='a22955a47eff160d4ba3ee2bc35581818336cd8d3c73ea789b52c14d6eeba212c6a572097cbb1bf11e29422cefc2f89as';
            
            if(clientId != null && clientId != '' && FSK.length() > 0 && FSK != Null) { 
                
                isSelected = false;
                cashFlowPopup = false;
                List<FinServ__FinancialAccount__c> FFDAList = new List<FinServ__FinancialAccount__c>();
                List<FinServ__FinancialAccount__c> FFAList = new List<FinServ__FinancialAccount__c>();
                
                try {                
                    System.debug('Inside try');
                    setData = '{"key":"'+FSK+'","formParams":"[';
                    
                    incmeList = [Select id, Name, Amount__c,Income_Start_Date__c,Income_End_Date__c,Frequency__c from Budget__c where Primary_Owner__c =: clientId 
                                 and recordType.developerName = 'Income_Record_Type' ]; 
                    System.debug('client Id: '+ clientId);
                    System.debug('Income List: ' + incmeList);
                    
                    //set monthly income here 
                    //Create Income List
                    if(incmeList!=null && incmeList.size() > 0){
                        Integer i = 1;
                        for(Budget__c inc: incmeList) {
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
                            else {                                incomeAmount = 0;
                            }
                            setData +='{';
                            setData +='\'id\':\'' + i + '\',';
                            setData +='\'type\':\'income\',';
                            setData +='\'name\':\''+inc.Name+'\',';
                            setData +='\'amount\':'+incomeAmount+',';
                            setData +='\'incomepopuppretax\':'+incomeAmount+',';
                            setData +='\'incomepopupfrequency\':\'' + incomeFrequency + '\',';
                            setData +='\'incomepopupgrowthrate\':\'0\',';
                            setData +='\'startdate\':\'' + inc.Income_Start_Date__c.month() + '/' + inc.Income_Start_Date__c.year() + '\',';
                            setData +='\'enddate\':\'' + inc.Income_End_Date__c.month() + '/' + inc.Income_End_Date__c.year() + '\'';
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
                               FinServ__PrimaryOwner__c =: clientId 
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
                    FFDAList = [select id, Name, APR__c, FinServ__Balance__c, FinServ__LoanAmount__c, FinServ__PrimaryOwner__c, Account_Type__c, FinServ__PaymentAmount__c
                                //Is_TERM_Debt__c,  PAYMENT_AMOUNT__c
                                from FinServ__FinancialAccount__c where
                                (Account_Type__c = 'Loan' or
                                 Account_Type__c = 'Credit Card') AND
                                RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                                RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                                RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                                FinServ__PrimaryOwner__c =: clientId 
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
                                
                                setData +='\'startdate\':\''+Date.today().month()+'/'+Date.today().year()+'\',';
                                setData +='\'outstandingamt\':'+FFDA.FinServ__LoanAmount__c+',';
                            }
                            else{}
                            setData +='\'APR\':'+FFDA.APR__c;
                            setData +='},';
                        }
                    }
                    //Goals Data
                    
                    List<FinServ__FinancialGoal__c> goalList = [select Start_Value__c,
                                                                //Account_Value__c, 
                                                                Name, 
                                                                Required_Monthly_Saving__c, Start_Date__c, FinServ__TargetValue__c,
                                                                Annual_Growth_Rate__c, 	FinServ__TargetDate__c, Associated_Account__c,Goal_Priority__c
                                                                from FinServ__FinancialGoal__c where
                                                                RecordType.DeveloperName !='Scenario_Goal_Record_Type' and
                                                                FinServ__PrimaryOwner__c =: clientId
                                                                limit 1000];
                    System.debug('Goal List: ' + goalList);
                    if(goalList.size() > 0){
                        for(FinServ__FinancialGoal__c goal : goalList){
                            
                            flag++;
                            setData +='{';
                            setData +='\'id\':\''+flag+'\',';
                            setData +='\'type\':\'goals\',';
                            Decimal getcurrentEstimation = ((Decimal)curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today())).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c;
                            System.debug('Goal Estimation'+((Decimal)curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today())).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c);
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
                    
                    expList = [Select id, Name, Amount__c, Income_Start_Date__c, Income_End_Date__c, Expense_Start_Date__c,Expense_End_Date__c from Budget__c where Primary_Owner__c =: clientId 
                               and recordType.developerName = 'Expense_Record_Type']; 
                    //set expenses here    
                    System.debug('Expense List: ' + expList);
                    double monthlyExpenses = 0;
                    //set expenses here    
                    if(expList!=null && expList.size() > 0){
                        Integer j=1;
                        for(Budget__c e: expList) {
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
                            setData +='\'startdate\':\'' + e.Income_Start_Date__c.month() + '/' + e.Income_Start_Date__c.year() + '\',';
                            setData +='\'enddate\':\'' + e.Income_End_Date__c.month() + '/' + e.Income_End_Date__c.year() + '\'';
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
                    clientData = setData;
                    System.debug('Client Data from Future Simulation: ' + clientData);
                } //end of try            
                catch(Exception e){
                    System.debug('Exception' + e.getStackTraceString());
                    FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
                }
            }
            System.debug('Non-HouseHold Request Data:' + setData);
            return setData;
        }
    }
    
    @auraEnabled
    public static String createClientData_bak(String clientId){
        
        //distinguish between first init and selected client and set client id
        if(clientId =='init'){
            clientId = initialClientId;
        }
        
        System.debug('inside Method create Client');              
        Boolean showClientLookup = false;
        Boolean fadeOut = false; 
        Boolean isSelected =false;
        Boolean cashFlowPopup;
        String setData;
        Map<string, String> accountNameMap = new  Map<string, String>();
        Map<string, String> categoryNameMap = new Map<string, String>();
        Map<string, String> CategoryMap2 = new Map<string, String>();
        List<Budget__c> incmeList = new List<Budget__c>();
        List<Budget__c> expList = new List<Budget__c>();        
        String FSK ='a22955a47eff160d4ba3ee2bc35581818336cd8d3c73ea789b52c14d6eeba212c6a572097cbb1bf11e29422cefc2f89as';
        
        
        /************ For Household Accounts ********/
        if(isHousehold){            
            List<account> householdMembersList = new List<Account>();
            //householdMembersList = [select id, name from FinServ__AccountAccountRelation__c where FinServ__RelatedAccount__c =: clientId];           
            system.debug('Inside Household');       
            
            if(clientId != null && clientId != '' && FSK.length() > 0 && FSK != Null) {                 
                isSelected = false;
                cashFlowPopup = false;
                List<FinServ__FinancialAccount__c> FFDAList = new List<FinServ__FinancialAccount__c>();
                List<FinServ__FinancialAccount__c> FFAList = new List<FinServ__FinancialAccount__c>();
                
                try {               
                    System.debug('Inside try');
                    setData = '{"key":"'+FSK+'","formParams":"[';
                    setData +='{';
                    double monthlyIncome = 0;
                    double monthlyExpenses = 0;                   
                    incmeList = [Select id, Name, Amount__c from Budget__c where HouseHold__c =: clientId 
                                 and recordType.developerName = 'Income_Record_Type' ]; 
                    expList = [Select id, Amount__c , Name from Budget__c where HouseHold__c =: clientId 
                               and recordType.developerName = 'Expense_Record_Type']; 
                    
                    System.debug('client Id: '+ clientId);
                    System.debug('Income List: ' + incmeList);
                    System.debug('Expense List: ' + expList);
                    
                    //set monthly income here 
                    if(incmeList.size() > 0){
                        for(Budget__c i: incmeList) {
                            if(i.Amount__c != Null){
                                monthlyIncome +=  i.Amount__c;
                                CategoryMap2.put(i.id, i.Name.toUppercase());
                                categoryNameMap.put(i.Id, i.Name);}
                            else { monthlyIncome += 0; }              
                        }//end of for
                    }//end of if
                    else {  
                        monthlyIncome = 0; }
                    
                    //set expenses here    
                    if(expList.size() > 0){
                        for(Budget__c e: expList) {
                            if(e.Amount__c != Null){
                                monthlyExpenses+= e.Amount__c;
                            } else { monthlyExpenses += 0; }
                        }//end for
                    }//end if
                    else {                        monthlyExpenses=0; }
                    
                    monthlyIncome = monthlyIncome.round();
                    
                    setData +='\'id\':\'1\',';
                    setData +='\'type\':\'income\',';
                    setData +='\'name\':\'income\',';
                    setData +='\'amount\':'+monthlyIncome+',';
                    setData +='\'incomepopuppretax\':7000,';
                    setData +='\'incomepopupfrequency\':\'1\',';
                    setData +='\'incomepopupgrowthrate\':\'0\'';
                    setData +='},';
                    
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
                               FinServ__Household__c =: clientId 
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
                            setData +='\'accountype\':\'1\',';
                            setData +='\'name\':\''+FFA.Name+'\',';
                            if(FFA.FinServ__Balance__c == null){ FFA.FinServ__Balance__c = 0;
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
                    FFDAList = [select id, Name, APR__c, FinServ__Balance__c, FinServ__LoanAmount__c, FinServ__PrimaryOwner__c, Account_Type__c
                                //Is_TERM_Debt__c,  PAYMENT_AMOUNT__c
                                from FinServ__FinancialAccount__c where
                                (Account_Type__c = 'Loan' or
                                 Account_Type__c = 'Credit Card') AND
                                RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                                RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                                RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                                FinServ__Household__c =: clientId 
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
                                setData +='\'amount\':'+FFDA.FinServ__LoanAmount__c+',';
                                
                                setData +='\'endDate\':\''+Date.today().addYears(1).month()+'/'+Date.today().addYears(1).year()+'\',';
                                setData +='\'outstandingamt\':'+FFDA.FinServ__LoanAmount__c+',';
                            }
                            else{}
                            setData +='\'APR\':'+FFDA.APR__c;
                            setData +='},';
                        }
                    }
                    //Goals Data
                    
                    List<FinServ__FinancialGoal__c> goalList = [select Start_Value__c,
                                                                //Account_Value__c, 
                                                                Name, 
                                                                Required_Monthly_Saving__c, Start_Date__c, FinServ__TargetValue__c,
                                                                Annual_Growth_Rate__c, 	FinServ__TargetDate__c, Associated_Account__c,Goal_Priority__c 
                                                                from FinServ__FinancialGoal__c where
                                                                RecordType.DeveloperName !='Scenario_Goal_Record_Type' and
                                                                FinServ__Household__c =: clientId
                                                                limit 1000];
                    System.debug('Goal List: ' + goalList);
                    if(goalList.size() > 0){
                        for(FinServ__FinancialGoal__c goal : goalList){
                            
                            flag++;
                            setData +='{';
                            setData +='\'id\':\''+flag+'\',';
                            setData +='\'type\':\'goals\',';
                            Decimal getcurrentEstimation = ((Decimal)curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today())).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c;
                            System.debug('Goal Estimation'+((Decimal)curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today())).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c);
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
                    
                    setData +='{';
                    setData +='\'id\':\'1\',';
                    setData +='\'type\':\'expenses\',';
                    if(monthlyExpenses != null){
                        setData +='\'amount\':'+monthlyExpenses;
                    }else{
                        setData +='\'amount\':0';
                    }
                    
                    setData +='}';
                    setData += ']"}';
                    clientData = setData;
                    System.debug('Client Data from Future Simulation: ' + clientData);
                } //end of try            
                catch(Exception ee){
                    System.debug('Exception' + ee.getStackTraceString());
                     FinacastUtility.ExceptionHandle(ee.getLineNumber(), ee.getMessage(), ee.getStackTraceString());
                }
            }
            System.debug('HouseHold Request Data:' + setData);
            return setData;                                
        }
        //end of Household  
        
        //for non Household accout
        else{
            if(clientId != null && clientId != '' && FSK.length() > 0 && FSK != Null) {             
                isSelected = false;
                cashFlowPopup = false;
                List<FinServ__FinancialAccount__c> FFDAList = new List<FinServ__FinancialAccount__c>();
                List<FinServ__FinancialAccount__c> FFAList = new List<FinServ__FinancialAccount__c>();
                
                try{             
                    System.debug('Inside try');
                    setData = '{"key":"'+FSK+'","formParams":"[';
                    setData +='{';
                    double monthlyIncome = 0;
                    double monthlyExpenses = 0;                
                    incmeList = [Select id, Name, Amount__c from Budget__c where Primary_Owner__c =: clientId 
                                 and recordType.developerName = 'Income_Record_Type' ]; 
                    expList = [Select id, Amount__c , Name from Budget__c where Primary_Owner__c =: clientId 
                               and recordType.developerName = 'Expense_Record_Type']; 
                    System.debug('client Id: '+ clientId);
                    System.debug('Income List: ' + incmeList);
                    System.debug('Expense List: ' + expList);
                    
                    //set monthly income here 
                    if(incmeList.size() > 0){
                        for(Budget__c i: incmeList) {
                            if(i.Amount__c != Null){
                                monthlyIncome +=  i.Amount__c;
                                CategoryMap2.put(i.id, i.Name.toUppercase());
                                categoryNameMap.put(i.Id, i.Name);}
                            else { monthlyIncome += 0; }              
                        }//end of for
                    }//end of if
                    else {  
                        monthlyIncome = 0; }
                    
                    //set expenses here    
                    if(expList.size() > 0){
                        for(Budget__c e: expList) {
                            if(e.Amount__c != Null){
                                monthlyExpenses+= e.Amount__c;
                            } else { monthlyExpenses += 0; }
                        }//end for
                    }//end if
                    else {
                        monthlyExpenses=0; }
                    
                    monthlyIncome = monthlyIncome.round();
                    
                    setData +='\'id\':\'1\',';
                    setData +='\'type\':\'income\',';
                    setData +='\'name\':\'income\',';
                    setData +='\'amount\':'+monthlyIncome+',';
                    setData +='\'incomepopuppretax\':7000,';
                    setData +='\'incomepopupfrequency\':\'1\',';
                    setData +='\'incomepopupgrowthrate\':\'0\'';
                    setData +='},';
                    
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
                               FinServ__PrimaryOwner__c =: clientId 
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
                            setData +='\'accountype\':\'1\',';
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
                    FFDAList = [select id, Name, APR__c, FinServ__Balance__c, FinServ__LoanAmount__c, FinServ__PrimaryOwner__c, Account_Type__c
                                //Is_TERM_Debt__c,  PAYMENT_AMOUNT__c
                                from FinServ__FinancialAccount__c where
                                (Account_Type__c = 'Loan' or
                                 Account_Type__c = 'Credit Card') AND
                                RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                                RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                                RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                                FinServ__PrimaryOwner__c =: clientId 
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
                                setData +='\'amount\':'+FFDA.FinServ__LoanAmount__c+',';
                                
                                //if end date is mentioned then use it else set it 1 year hence
                                /*if(FFDA.FinServ__LoanEndDate__c != Null){
setData +='\'endDate\':\''+FFDA.FinServ__LoanEndDate__c.month()+'/'+FFDA.FinServ__LoanEndDate__c.year()+'\',';
} else {
setData +='\'endDate\':\''+Date.today().addYears(1).month()+'/'+Date.today().addYears(1).year()+'\',';}
*/
                                setData +='\'endDate\':\''+Date.today().addYears(1).month()+'/'+Date.today().addYears(1).year()+'\',';
                                setData +='\'outstandingamt\':'+FFDA.FinServ__LoanAmount__c+',';
                            }
                            else{}
                            setData +='\'APR\':'+FFDA.APR__c;
                            setData +='},';
                        }
                    }
                    //Goals Data
                    
                    List<FinServ__FinancialGoal__c> goalList = [select Start_Value__c,
                                                                //Account_Value__c, 
                                                                Name, 
                                                                Required_Monthly_Saving__c, Start_Date__c, FinServ__TargetValue__c,
                                                                Annual_Growth_Rate__c, 	FinServ__TargetDate__c, Associated_Account__c, Goal_Priority__c 
                                                                from FinServ__FinancialGoal__c where
                                                                RecordType.DeveloperName !='Scenario_Goal_Record_Type' and
                                                                FinServ__PrimaryOwner__c =: clientId
                                                                limit 1000];
                    System.debug('Goal List: ' + goalList);
                    if(goalList.size() > 0){
                        for(FinServ__FinancialGoal__c goal : goalList){
                            
                            flag++;
                            setData +='{';
                            setData +='\'id\':\''+flag+'\',';
                            setData +='\'type\':\'goals\',';
                            Decimal getcurrentEstimation = ((Decimal)curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today())).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c;
                            System.debug('Goal Estimation'+((Decimal)curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today())).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c);
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
                    
                    setData +='{';
                    setData +='\'id\':\'1\',';
                    setData +='\'type\':\'expenses\',';
                    if(monthlyExpenses != null){
                        setData +='\'amount\':'+monthlyExpenses;
                    }else{
                        setData +='\'amount\':0';
                    }
                    
                    setData +='}';
                    setData += ']"}';
                    clientData = setData;
                } //end of try
                
                catch(Exception ee){
                    System.debug('Exception' + ee.getStackTraceString());
                     FinacastUtility.ExceptionHandle(ee.getLineNumber(), ee.getMessage(), ee.getStackTraceString());
                    
                }
            }
            return setData;
        } //method end
    }
    
    
    @auraEnabled
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
    
    @auraEnabled
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
    
    
    
    //Query Financial Goals
    @auraEnabled         
    public static list<FinServ__FinancialGoal__c> getGoals(String ClientId) {
        
        //when initialised
        User us = [select contactid , accountid from user where id=: userinfo.getUserId()];
        if(us.contactid == null){
            
            //in CRM
            if(ClientId=='init') {
                Account acc = [Select id, Name from account where OwnerId =: UserInfo.getUserId()  order by name  limit 1];
                initialClient = acc.Name;
                initialClientId = acc.id;
                System.debug('Initial Account Name:' + acc.Name);
                if(isHousehold){
                    return [Select id, Name, Start_Value__c,FinServ__TargetDate__c from 
                            FinServ__FinancialGoal__c where FinServ__Household__c =: initialClientId];
                }
                else{
                    return [Select id, Name, Start_Value__c,FinServ__TargetDate__c from 
                            FinServ__FinancialGoal__c where FinServ__PrimaryOwner__c =: acc.Id];
                }
            }//end of init
            
            //when client is selected
            else {                    
                if(isHousehold){
                    return [Select id, Name, Start_Value__c,FinServ__TargetDate__c from 
                            FinServ__FinancialGoal__c where FinServ__Household__c =: ClientId];
                }
                else{                           
                    return [Select id, Name, Start_Value__c,FinServ__TargetDate__c from 
                            FinServ__FinancialGoal__c where FinServ__PrimaryOwner__c =: ClientId];
                }
            }//when change cliet is use
        }
        
        //for Community Portal
        else
        {
            isportalEnabled = true;
            return [Select id, Name, Start_Value__c,FinServ__TargetDate__c from 
                    FinServ__FinancialGoal__c where FinServ__PrimaryOwner__c =: us.AccountId];
        }
        
    }//method End
    
    
    //Query Financial Accounts
    @auraEnabled   
    public static list<list<FinServ__FinancialAccount__c>> getAccounts(String ClientId) {
        
        list<FinServ__FinancialAccount__c> savingsAccountList = new list<FinServ__FinancialAccount__c>();
        list<FinServ__FinancialAccount__c> loanAccountList = new list<FinServ__FinancialAccount__c>();
        list<FinServ__FinancialAccount__c> creditAccountList = new list<FinServ__FinancialAccount__c>();
        list<list<FinServ__FinancialAccount__c>> listOfListFinancialAccounts = new list<list<FinServ__FinancialAccount__c>>();
        list<Double> netBalanceList = new list<Double>();
        Double netSaving = 0;
        Double netLoan = 0;
        Double netCredit = 0;
        list<FinServ__FinancialAccount__c> tempAccountList = new  list<FinServ__FinancialAccount__c> ();
        User us = [select contactid , accountid from user where id=: userinfo.getUserId()];
        try{
        if(us.contactid == null){
            //when initialised
            if(ClientId=='init') {
                Account acc = [Select id from account where OwnerId =: UserInfo.getUserId() order by name limit 1];
                //if household check
                if(isHousehold){
                    System.debug('inside goals init');
                    tempAccountList =[Select id, Name, FinServ__Balance__c, FinServ__LoanAmount__c, Account_Type__c, APR__c, FinServ__APY__c,
                                      FinServ__FinancialAccountType__c from FinServ__FinancialAccount__c where 
                                      RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                                      RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                                      RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                                      FinServ__Household__c =: acc.Id]; 
                    System.debug(tempAccountList);
                }
                //not household
                else{
                    tempAccountList =[Select id, Name, FinServ__Balance__c, FinServ__LoanAmount__c, Account_Type__c, APR__c, FinServ__APY__c,
                                      FinServ__FinancialAccountType__c from FinServ__FinancialAccount__c where 
                                      RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                                      RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                                      RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                                      FinServ__PrimaryOwner__c =: acc.Id];
                }           
            }//init ends
            
            //when client is selected
            else {
                //household is true and client is selected
                if(isHousehold){
                    tempAccountList = [Select id, Name,FinServ__Balance__c,FinServ__LoanAmount__c, FinServ__FinancialAccountType__c, 
                                       Account_Type__c, FinServ__APY__c, APR__c from  FinServ__FinancialAccount__c where
                                       RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                                       RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                                       RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                                       FinServ__Household__c =: ClientId];
                }
                //for non household Account
                else{ 
                    tempAccountList = [Select id, Name,FinServ__Balance__c,FinServ__LoanAmount__c, FinServ__FinancialAccountType__c, 
                                       Account_Type__c, FinServ__APY__c, APR__c from  FinServ__FinancialAccount__c where
                                       RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                                       RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                                       RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                                       FinServ__PrimaryOwner__c =: ClientId];
                }   
            }  
        }
        else{
            isportalEnabled = true;
            tempAccountList = [Select id, Name,FinServ__Balance__c, FinServ__LoanAmount__c, FinServ__FinancialAccountType__c, 
                               Account_Type__c, FinServ__APY__c, APR__c from  FinServ__FinancialAccount__c where
                               RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                               RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                               RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                               FinServ__PrimaryOwner__c =: us.AccountId];
            
        }
        
        //segregate account types as saving, credit, loans
        for(FinServ__FinancialAccount__c ffa: tempAccountList)
        {
            if(ffa.Account_Type__c =='Credit Card') {
                netCredit = netCredit + ffa.FinServ__Balance__c;
                creditAccountList.add(ffa); }
            else if(ffa.Account_Type__c =='Loan') {
                netLoan = netLoan + ffa.FinServ__LoanAmount__c;
                loanAccountList.add(ffa);}
            else {
                netSaving = netSaving + ffa.FinServ__Balance__c;
                savingsAccountList.add(ffa);}
        }
        
        //add netsaving, netloan, netcredit to the list
        netBalanceList.add(netSaving);
        netBalanceList.add(netCredit);
        netBalanceList.add(netLoan);
        
        tempList = netBalanceList;
        
        //add list to list
        listOfListFinancialAccounts.add(savingsAccountList);
        listOfListFinancialAccounts.add(creditAccountList);
        listOfListFinancialAccounts.add(loanAccountList);
    }
        catch(Exception e)
    {
        FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
    }
        //System.debug(listOfListFinancialAccounts);
        return listOfListFinancialAccounts;
        
    }//method End
    
    public class WrapperClass {
        
        @auraEnabled
        public List<List<FinServ__FinancialAccount__c>> financialAccountList;
        
        @auraEnabled
        public List<FinServ__FinancialGoal__c> financialGoalList;
        
        @auraEnabled
        public List<Double> balanceList;
        
        @AuraEnabled
        public Boolean isportalUser;
        
        @AuraEnabled
        public String firstClient;
        
        @AuraEnabled
        public String responseData;
        
    } //end of Wrapper class 
    
    @auraEnabled
    public static WrapperClass getData(String id) {
        WrapperClass wrapperObj = new WrapperClass();
        try{
        //set initial Client
        if(id=='init') {
            Account acc = [Select id, Name from account where OwnerId =: UserInfo.getUserId()  order by name  limit 1];
            initialClient = acc.Name;
            initialClientId = acc.id;
        }else{
            initialClientId = id;
        }
        
        //Store Household status here        
        Account a = [select id, Name, RecordType.DeveloperName from Account where id =: initialClientId];
        if(a.RecordType.DeveloperName == 'IndustriesHousehold'){
            isHousehold = true;
        }
        if(test.isRunningTest()){
            isHousehold = true;
        }
        
        wrapperObj.financialAccountList = DashboardComponentApex.getAccounts(id);
        wrapperObj.financialGoalList = DashboardComponentApex.getGoals(id);
        wrapperObj.balanceList = tempList;
        wrapperObj.isportalUser = isportalEnabled;
        wrapperObj.firstClient = initialClient;
        System.debug('Wrapper: ' + id);
        DashboardComponentApex.createClientData(id);
        if(!test.isRunningTest()){
        wrapperObj.responseData = FinacastUtility.getCalloutResponseContents(requestEndpoint, 'POST', clientData);
        }
        System.debug('Client Data: ' + clientData);
        System.debug('Response: ' + wrapperObj.responseData);
    }
    catch(Exception e)
    {
        FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
    }
        return wrapperObj;
    }//method end
    
}//Outer Class
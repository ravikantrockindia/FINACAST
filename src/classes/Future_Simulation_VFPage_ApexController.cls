/* Developer name: Aditya Kaushal 2018😎👑
                   Meghna Goel
    */

public with sharing class Future_Simulation_VFPage_ApexController{
    public string getData{get; set;}
    public integer rownum{get; set;}
    public String clientId{get; set;} // Client/Account Id
    public Boolean showClientLookup{get; set;} //Show Client lookup in edit mode of records.
    public Boolean fadeOut{get; set;}
    
    
    public List<Client_Adviser_Configuration__c> clientAdviser =
                                                    new List<Client_Adviser_Configuration__c>();
    
     public void setClientConfiguration(){
        clientAdviser = [Select Id, Name, Client_Id__c
                         //Client__r.Monthly_Income__c, 
                         //Client__r.Name,
                          from Client_Adviser_Configuration__c where Adviser_Id__c =: userinfo.getUserId() limit 1];
         System.debug('Client Adviser: ' + clientAdviser);
    }
    public Client_Adviser_Configuration__c getClientConfiguration(){
          return clientAdviser.size()>0?clientAdviser[0]:null;
    }

    public Future_Simulation_VFPage_ApexController(){
        clientId = '';
        showClientLookup = false;
        fadeOut = false;
        
        List<User> userList = [Select id, IsPortalEnabled, isActive, AccountId, contactId from user where id =: userinfo.getUserId() limit 1];
        System.debug('UserList: ' + userList);
        if(userList.size() > 0 && userList[0].IsPortalEnabled && userList[0].isActive){
            clientId = userList[0].AccountId;
        } 
        else {
            showClientLookup = true;
            setClientConfiguration();
            if(clientAdviser.size()>0)
            {
                if(clientAdviser[0].Client_Id__c != Null) {
                    clientId  = clientAdviser[0].Client_Id__c;
                }
            }  
        }
        
        if(clientId != null && clientId != '') { 
            rownum = 1;
            String FSK = 'a22955a47eff160d4ba3ee2bc35581818336cd8d3c73ea789b52c14d6eeba212c6a572097cbb1bf11e29422cefc2f89a';
            //we will setup this in custom meta data.
            
            System.debug('Here');
            if(FSK.length() != 0 && FSK != Null){    
                try{
                    String setData = '{"key":"'+ FSK + '","formParams":"[';
                    setData +='{';
                    double monthlyIncome;
                    double monthlyExpenses;
                    //user conId = [SELECT contactId from user where Id =:UserInfo.getUserId() limit 1];
                    List<Budget__c> incmeList = [Select Amount__c from Budget__c where Client__c =: clientId limit 1]; //get it via recordtype
                    List<Budget__c> expList = [Select Amount__c from Budget__c where Client__c =: clientId limit 1]; 
                    
                    if(incmeList.size() > 0 && incmeList[0].Amount__c != Null){
                       monthlyIncome =  incmeList[0].Amount__c;
                    }
                    else {
                        monthlyIncome = 0; 
                    }
                    if(expList.size() > 0 && expList[0].Amount__c != Null){
                       monthlyExpenses = expList[0].Amount__c;
                    }
                    else {
                        monthlyExpenses=0;
                    }
                    
                    monthlyIncome = monthlyIncome.round();
                    setData +='\'id\':\'1\',';
                    setData +='\'type\':\'income\',';
                    setData +='\'name\':\'income\',';
                    setData +='\'amount\':'+monthlyIncome+',';
                    setData +='\'incomepopuppretax\':7000,';
                    setData +='\'incomepopupfrequency\':\'1\',';
                    setData +='\'incomepopupgrowthrate\':\'0\'';
                    setData +='},';
                    Integer flag = 0; 
                    Map<id, integer> FFAMap = new Map<id, integer>();
                    
                    List<FinServ__FinancialAccount__c> FFAList =
                        [Select id, Name, 
                         //Current_Value__c,
                         FinServ__Balance__c,
                         APR__c from 
                         FinServ__FinancialAccount__c 
                         //where 
                         //Is_Debt_Account__c != true and 
                         //Client__c =: clientId 
                         limit 1];
                    
                    if(FFAList.size() > 0){
                        for(FinServ__FinancialAccount__c FFA : FFAList){
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
                            setData +='\'amount\':'+ FFA.FinServ__Balance__c + ',';
                            if(FFA.APR__c == null){
                                FFA.APR__c = 0;
                            }
                            setData +='\'APR\':'+FFA.APR__c;
                            setData +='},';
                        }
                    }
                    List<FinServ__FinancialAccount__c> FFDAList = 
                        [select Name, APR__c,
                         //Is_TERM_Debt__c, 
                         FinServ__Balance__c, FinServ__PaymentAmount__c 
                         from FinServ__FinancialAccount__c 
                         //where Is_Debt_Account__c = true and Client__c =: clientId 
                         limit 1];
                    if(FFDAList.size() > 0){
                        for(FinServ__FinancialAccount__c FFDA : FFDAList){
                            flag++;
                            setData +='{';
                            setData +='\'id\':\''+flag+'\',';
                            setData +='\'type\':\'account\',';
                            //term Loan
                            /*
                            if(FFDA.Is_TERM_Debt__c == false){
                                setData +='\'accountype\':\'account_creditcard\',';
                                setData +='\'name\':\''+FFDA.Name+'\',';
                                setData +='\'amount\':'+FFDA.CURRENT_VALUE__c+',';
                            }else{
                                setData +='\'accountype\':\'account_loan\',';
                                setData +='\'name\':\''+FFDA.Name+'\',';
                                setData +='\'amount\':'+FFDA.PAYMENT_AMOUNT__c+',';
                                setData +='\'endDate\':\''+Date.today().addYears(2).month()+'/'+Date.today().addYears(2).year()+'\',';
                                setData +='\'outstandingamt\':'+FFDA.CURRENT_VALUE__c+',';
                            }
                            */
                            setData +='\'APR\':'+FFDA.APR__c;
                            
                            setData +='},';
                        }
                    }
                    
                    //Goals Data
                    List<FinServ__FinancialGoal__c> goalList = [select Start_Value__c, 
                                                                //Account_Value__c, 
                                                                Name, 
                                                                Required_Monthly_Saving__c, Start_Date__c, 
                                                                FinServ__TargetValue__c,
                                                                Annual_Growth_Rate__c,
                                                                FinServ__TargetDate__c, Associated_Account__c 
                                                                from FinServ__FinancialGoal__c 
                                                                //where Client__c =: clientId 
                                                                limit 1];
                    if(goalList.size() > 0){
                        for(FinServ__FinancialGoal__c goal : goalList){
                            if(goal.Associated_Account__c != null && FFAMap.containsKey(goal.Associated_Account__c)){
                                flag++;
                                setData +='{';
                                setData +='\'id\':\''+flag+'\',';
                                setData +='\'type\':\'goals\',';
                                Decimal getcurrentEstimation = ((Decimal)curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today())).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c;
                                setData +='\'currentamount\':\''+getcurrentEstimation+'\',';
                                setData +='\'name\':\''+goal.Name+'\',';
                                setData +='\'monthlycontribution\':'+goal.Required_Monthly_Saving__c+',';
                                setData +='\'startdate\':\''+goal.Start_Date__c.month()+'/'+goal.Start_Date__c.year()+'\',';
                                setData +='\'targetamount\':'+goal.FinServ__TargetValue__c+',';
                                setData +='\'growth\':'+goal.Annual_Growth_Rate__c+',';
                                setData +='\'targetdate\':\''+goal.FinServ__TargetDate__c.month()+'/'+goal.FinServ__TargetDate__c.year()+'\',';
                                setData +='\'savingid\':\''+FFAMap.get(goal.Associated_Account__c)+'\',';
                                setData +='\'startvalue\':\''+goal.Start_Value__c+'\'';
                                setData +='},';
                            }
                        }
                    }
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
                    
                    /*FOR DEBUGGING*/
                    setData = '{\"key\":\"a22955a47eff160d4ba3ee2bc35581818336cd8d3c73ea789b52c14d6eeba212c6a572097cbb1bf11e29422cefc2f89a\",\"formParams\":\"[{\'id\':\'1\',\'type\':\'income\',\'name\':\'income\',\'amount\':666.0,\'incomepopuppretax\':7000,\'incomepopupfrequency\':\'1\',\'incomepopupgrowthrate\':\'0\'},{\'id\':\'1\',\'type\':\'account\',\'accountype\':\'1\',\'name\':\'CPC CHECKING-1\',\'amount\':3288.80,\'APR\':0.50},{\'id\':\'2\',\'type\':\'account\',\'accountype\':\'1\',\'name\':\'SEP-IRA\',\'amount\':28000.00,\'APR\':5.00},{\'id\':\'3\',\'type\':\'account\',\'accountype\':\'1\',\'name\':\'ROLLOVER IRA\',\'amount\':64041.05,\'APR\':0.00},{\'id\':\'4\',\'type\':\'account\',\'accountype\':\'1\',\'name\':\'ROLLOVER IRA-1\',\'amount\':64041.05,\'APR\':0.00},{\'id\':\'5\',\'type\':\'account\',\'accountype\':\'1\',\'name\':\'SEP-IRA-1\',\'amount\':23879.78,\'APR\':0.00},{\'id\':\'6\',\'type\':\'account\',\'accountype\':\'account_creditcard\',\'name\':\'VISA BUSINESS\',\'amount\':9583.01,\'APR\':17.90},{\'id\':\'7\',\'type\':\'account\',\'accountype\':\'account_loan\',\'name\':\'a05o000000RCOxK\',\'amount\':1.00,\'endDate\':\'11/2020\',\'outstandingamt\':1.00,\'APR\':10.00},{\'id\':\'8\',\'type\':\'account\',\'accountype\':\'account_loan\',\'name\':\'a05o000000RCOxP\',\'amount\':1.00,\'endDate\':\'11/2020\',\'outstandingamt\':1.00,\'APR\':10.00},{\'id\':\'9\',\'type\':\'account\',\'accountype\':\'account_loan\',\'name\':\'a05o000000RCOxU\',\'amount\':1.00,\'endDate\':\'11/2020\',\'outstandingamt\':1.00,\'APR\':10.00},{\'id\':\'10\',\'type\':\'account\',\'accountype\':\'account_creditcard\',\'name\':\'Mortgage\',\'amount\':330000.00,\'APR\':4.20},{\'id\':\'11\',\'type\':\'account\',\'accountype\':\'account_loan\',\'name\':\'Loan 1\',\'amount\':210.00,\'endDate\':\'11/2020\',\'outstandingamt\':9999.00,\'APR\':6.00},{\'id\':\'12\',\'type\':\'goals\',\'currentamount\':\'124051.05\',\'name\':\'Retirement 2\',\'monthlycontribution\':3530,\'startdate\':\'6/2017\',\'targetamount\':1250000,\'growth\':0.00,\'targetdate\':\'6/2045\',\'savingid\':\'3\',\'startvalue\':\'64041.05\'},{\'id\':\'13\',\'type\':\'goals\',\'currentamount\':\'64041.05\',\'name\':\'ABC\',\'monthlycontribution\':1000,\'startdate\':\'11/2018\',\'targetamount\':5000,\'growth\':0.00,\'targetdate\':\'11/2020\',\'savingid\':\'4\',\'startvalue\':\'64041.05\'},{\'id\':\'14\',\'type\':\'goals\',\'currentamount\':\'180000.00\',\'name\':\'Retirement\',\'monthlycontribution\':10000,\'startdate\':\'6/2017\',\'targetamount\':50000,\'growth\':5.00,\'targetdate\':\'12/2017\',\'savingid\':\'2\',\'startvalue\':\'10000\'},{\'id\':\'1\',\'type\':\'expenses\',\'amount\':400.0}]\"}';
                    HttpRequest req = new HttpRequest();
                    req.setTimeout(120000); // timeout in milliseconds
                    //req.setEndpoint('http://finacast.com/api/finacast/service/getFutureSimulations');
                    req.setEndpoint('http://50.62.58.10:12345/Finacast/api/finacast/service/getFutureSimulations');
                    req.setMethod('POST');
                    req.setHeader('content-type','application/json');
                    req.setBody(setData);
                    system.debug('amrit1'+setData);
                    Http h = new Http();
                   // HttpResponse res = h.send(req);
                    StaticResource scR = [Select body, name from StaticResource where Name = 'MockResponseFutureSim'];
                    //getData = res.getBody();
        getData = scR.body.toString();
                }
                catch(Exception ee)
                {
                    System.debug(ee.getStackTraceString());
                }
            }
        }
        else{
            fadeOut = true;
        }
   }   
    
    
    
   public double curentgoalestimation(double emi, Date startDate, Date todaydate ){
        double result = 0;
        Integer months = 0;
        months = NumberOfMonths(startDate, todaydate);
        if(months >= 1){
            result = months*emi;
        }
        return result;
    }
     public static integer NumberOfMonths(Date startDate, Date endDate){
        if(startDate != null && endDate != null){
        integer months = startDate.monthsBetween(endDate);
        return months;
        } else {
            return 0;
        }
    }        
}
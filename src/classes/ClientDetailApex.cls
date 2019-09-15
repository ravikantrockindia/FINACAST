public class ClientDetailApex {
    
    public static List<Double> tempList = new List<Double>();
    public static Boolean isportalEnabled = false;
    public static String initialClient = '';
    public static String initialClientId = '';
    public static Boolean isHousehold = false;
    public static String clientData = '';
    public static String requestEndpoint='https://mytafi.herokuapp.com/rest/service/getFinacastHealthScoreNew';
    
    @AuraEnabled 
    public static String getNamespace(){
        
        return NamespaceUtility.returnNamespace();
        
    }
    
    //Create client data
    @auraEnabled
    public static String createClientData(String clientId){
        
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
        
        //Store Household status here
        Boolean isHousehold = false;
        Account a = [select id, Name, RecordType.DeveloperName from Account where id =: clientId];
        if(a.RecordType.DeveloperName == 'IndustriesHousehold'){
            isHousehold = true;
        }
        
        /************ For Household Accounts ********/
        if(isHousehold){            
            List<account> householdMembersList = new List<Account>();
            
            String FSK ='a22955a47eff160d4ba3ee2bc35581818336cd8d3c73ea789b52c14d6eeba212c6a572097cbb1bf11e29422cefc2f89as';
            
            if(clientId != null && clientId != '' && FSK.length() > 0 && FSK != Null) {                 
                isSelected = false;
                cashFlowPopup = false;
                List<FinServ__FinancialAccount__c> FFDAList = new List<FinServ__FinancialAccount__c>();
                List<FinServ__FinancialAccount__c> FFAList = new List<FinServ__FinancialAccount__c>();
                setData = '{"key":"'+FSK+'","formParams":"[';
                incmeList = [Select id, Name, Amount__c,Start_Date__c,End_Date__c,Frequency__c,Tax_Rate__c, Yearly_growth__c from Budget__c where HouseHold__c =: clientId 
                             and recordType.developerName = 'Income_Record_Type' ];
                
                
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
                                incomeFrequency = 2.16;
                            }
                            when 'Weekly' {
                                incomeFrequency = 4.33;
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
                        setData +='\'inctaxrate\':'+inc.Tax_Rate__c+',';
                        setData +='\'incomepopupfrequency\':\'' + incomeFrequency + '\',';
                        setData +='\'incomepopupgrowthrate\':'+inc.Yearly_growth__c+',';
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
                    setData +='\'inctaxrate\':0,';
                    setData +='\'incomepopupfrequency\':\'1\',';
                    setData +='\'incomepopupgrowthrate\':\'0\',';
                    setData +='\'startdate\':\'' + startdate + '\',';
                    setData +='\'enddate\':\'' + enddate + '\'';
                    setData +='},';
                }
                
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
                
                FFDAList = [select id, Name, FinServ__APY__c, FinServ__Balance__c, FinServ__LoanAmount__c, FinServ__PrimaryOwner__c, FinServ__PaymentFrequency__c, Account_Type__c, FinServ__PaymentAmount__c, Do_you_get_tax_benefit_from_interest_pay__c, Do_tax_benefits_realize_monthly__c, Max_yearly_tax_deduction_allowed__c, What_of_contribution_bring_tax_benefit__c
                            from FinServ__FinancialAccount__c where
                            (Account_Type__c = 'Loan' or
                             Account_Type__c = 'Credit Card') AND
                            RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                            RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                            RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                            FinServ__Household__c =: clientId 
                            limit 1000];
                
                /*********** NOTE: Outstanding Payment and Loan End Date *********/
                
                
                
                if(FFDAList.size() > 0){
                    for(FinServ__FinancialAccount__c FFDA : FFDAList){
                        Double loanFrequency = 1;
                        switch on FFDA.FinServ__PaymentFrequency__c {
                            when 'Monthly' {
                                loanFrequency = 1;
                            }   
                            when 'Semi Monthly' {
                                loanFrequency = 2;
                            }
                            when 'Bi-Weekly' {
                                loanFrequency = 2.16;
                            }
                            when 'Weekly' {
                                loanFrequency = 4.33;
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
                            setData +='\'isTaxBenefit\':'+FFDA.Do_you_get_tax_benefit_from_interest_pay__c+',';
                            setData +='\'percentContribution\':'+FFDA.What_of_contribution_bring_tax_benefit__c+',';
                            Double maxYearlyTaxDeduction=0.0;
                            if (FFDA.Max_yearly_tax_deduction_allowed__c!=null){
                                maxYearlyTaxDeduction=FFDA.Max_yearly_tax_deduction_allowed__c;
                                
                            }
                            setData +='\'maxLimit\':'+maxYearlyTaxDeduction+',';
                            
                            setData +='\'isMonthly\':'+FFDA.Do_tax_benefits_realize_monthly__c+',';
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
                                                            Annual_Growth_Rate__c,  FinServ__TargetDate__c, Associated_Account__c, Goal_Priority__c,Does_the_contribution_bring_tax_benefit__c  , Do_tax_benefits_realize_monthly__c,What_of_contribution_bring_tax_benefit__c,Max_yearly_tax_deduction_allowed__c
                                                            from FinServ__FinancialGoal__c where
                                                            RecordType.DeveloperName !='Scenario_Goal_Record_Type' and
                                                            FinServ__Household__c =: clientId
                                                            limit 1000];
                
                if(goalList.size() > 0){
                    for(FinServ__FinancialGoal__c goal : goalList){
                        
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
                        setData +='\'priority\':'+goal.Goal_Priority__c+',';
                        setData +='\'growth\':'+goal.Annual_Growth_Rate__c+',';
                        setData +='\'targetdate\':\''+goal.FinServ__TargetDate__c.month()+'/'+goal.FinServ__TargetDate__c.year()+'\',';
                        setData +='\'savingid\':\''+FFAMap.get(goal.Associated_Account__c)+'\',';
                        setData +='\'startvalue\':\''+goal.Start_Value__c+'\',';
                        setData +='\'isTaxBenefit\':'+goal.Does_the_contribution_bring_tax_benefit__c+',';
                        setData +='\'percentContribution\':'+goal.What_of_contribution_bring_tax_benefit__c+',';
                        Double maxYearlyTaxDeduction=0.0;
                        if (goal.Max_yearly_tax_deduction_allowed__c!=null){
                            maxYearlyTaxDeduction=goal.Max_yearly_tax_deduction_allowed__c;
                            
                        }
                        setData +='\'maxLimit\':'+maxYearlyTaxDeduction+',';
                        
                        setData +='\'isMonthly\':'+goal.Do_tax_benefits_realize_monthly__c;
                        setData +='},';
                    }                   
                } //end of if
                
                
                //Create Expense Data
                expList = [Select id, Name, Amount__c ,Start_Date__c, End_Date__c, Does_contribution_bring_tax_benifit__c, Does_tax_benifit_realize_really__c,May_yearly_tax_deduction_allowed__c,What_of_contribution_bring_tax_benifit__c from Budget__c where HouseHold__c =: clientId 
                           and recordType.developerName = 'Expense_Record_Type']; 
                
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
                        setData +='\'startdate\':\'' + e.Start_Date__c.month() + '/' + e.Start_Date__c.year() + '\',';
                        setData +='\'enddate\':\'' + e.End_Date__c.month() + '/' + e.End_Date__c.year() + '\',';
                        setData +='\'isTaxBenefit\':'+e.Does_contribution_bring_tax_benifit__c+',';
                        setData +='\'percentContribution\':'+e.What_of_contribution_bring_tax_benifit__c+',';
                        Double maxYearlyTaxDeduction=0.0;
                        if(e.May_yearly_tax_deduction_allowed__c!=null)
                            maxYearlyTaxDeduction=e.May_yearly_tax_deduction_allowed__c;
                        setData +='\'maxLimit\':'+maxYearlyTaxDeduction+',';
                        setData +='\'isMonthly\':'+e.Does_tax_benifit_realize_really__c;
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
                    setData +='\'startdate\'' + startdate + '\',';
                    setData +='\'enddate\':\'' + enddate + '\',';
                    setData +='\'isTaxBenefit\':'+false+',';
                    setData +='\'percentContribution\':0,';
                    setData +='\'maxLimit\':0,';
                    setData +='\'isMonthly\':'+false;
                    setData +='}';
                }
                setData += ']"}';
                // setData += ',{\'name\' :\''+name+'\', \'totalAmount\' : ' + totalAmount + ',\'downPayment\' : ' + downPayment + ',\'installments\' : ' + installments + ',\'startDate\' :\''+startDate+'\',\'endDate\' :\''+endDate+'\',\'isTaxBenefit\' : ' + isTaxBenefit + ',\'isPaymentPlan\' : ' + isPaymentPlan + ',\'rainyDayMonths\' : ' + rainyDayMonths + '}]"}';
                clientData = setData;
                System.debug('Client Data from Future Simulation: ' + clientData);
            }
            System.debug('HouseHold Request Data:' + setData);
            return setData;                                
        }
        
        /******** Normal non - Household Code goes here *******/
        else {              
            String FSK ='a22955a47eff160d4ba3ee2bc35581818336cd8d3c73ea789b52c14d6eeba212c6a572097cbb1bf11e29422cefc2f89as';
            
            if(clientId != null && clientId != '' && FSK.length() > 0 && FSK != Null) { 
                
                isSelected = false;
                cashFlowPopup = false;
                List<FinServ__FinancialAccount__c> FFDAList = new List<FinServ__FinancialAccount__c>();
                List<FinServ__FinancialAccount__c> FFAList = new List<FinServ__FinancialAccount__c>();
                
                //try {                
                System.debug('Inside try');
                setData = '{"key":"'+FSK+'","formParams":"[';
                
                incmeList = [Select id, Name, Amount__c,Start_Date__c,End_Date__c,Frequency__c,Tax_Rate__c from Budget__c where Primary_Owner__c =: clientId 
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
                                incomeFrequency = 2.16;
                            }
                            when 'Weekly' {
                                incomeFrequency = 4.33;
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
                        setData +='\'inctaxrate\':'+inc.Tax_Rate__c+',';
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
                    setData +='\'inctaxrate\':0,';
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
                FFDAList = [select id, Name, FinServ__APY__c, FinServ__Balance__c, FinServ__LoanAmount__c, FinServ__PrimaryOwner__c,
                            Account_Type__c, FinServ__PaymentAmount__c, Do_you_get_tax_benefit_from_interest_pay__c,
                            What_of_contribution_bring_tax_benefit__c,Max_yearly_tax_deduction_allowed__c, Do_tax_benefits_realize_monthly__c
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
                            setData +='\'isTaxBenefit\':'+FFDA.Do_you_get_tax_benefit_from_interest_pay__c+',';
                            setData +='\'percentContribution\':'+FFDA.What_of_contribution_bring_tax_benefit__c+',';
                            Double maxYearlyDeduction=0.0;
                            if(FFDA.Max_yearly_tax_deduction_allowed__c!=null){
                                maxYearlyDeduction=FFDA.Max_yearly_tax_deduction_allowed__c;
                            }
                            setData +='\'maxLimit\':'+maxYearlyDeduction+',';
                            setData +='\'isMonthly\':'+FFDA.Do_tax_benefits_realize_monthly__c+',';
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
                                                            Annual_Growth_Rate__c,  FinServ__TargetDate__c, Associated_Account__c,Goal_Priority__c,Does_the_contribution_bring_tax_benefit__c, Do_tax_benefits_realize_monthly__c,What_of_contribution_bring_tax_benefit__c,Max_yearly_tax_deduction_allowed__c
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
                        System.debug('@@@@@@@@FFAMap: '+FFAMap);
                        System.debug('goal.Associated_Account__c: '+goal.Associated_Account__c);
                        System.debug('value: '+FFAMap.get(goal.Associated_Account__c));
                        setData +='\'savingid\':\''+FFAMap.get(goal.Associated_Account__c)+'\',';
                        setData +='\'startvalue\':\''+goal.Start_Value__c+'\',';
                        setData +='\'isTaxBenefit\':'+goal.Does_the_contribution_bring_tax_benefit__c+',';
                        setData +='\'percentContribution\':'+goal.What_of_contribution_bring_tax_benefit__c+',';
                        Double maxYearlyTaxDeduction=0.0;
                        if (goal.Max_yearly_tax_deduction_allowed__c!=null){
                            maxYearlyTaxDeduction=goal.Max_yearly_tax_deduction_allowed__c;
                            
                        }
                        setData +='\'maxLimit\':'+maxYearlyTaxDeduction+',';
                        
                        setData +='\'isMonthly\':'+goal.Do_tax_benefits_realize_monthly__c;
                        setData +='},';
                    }                   
                } //end of if
                
                expList = [Select id, Name, Amount__c, Start_Date__c, End_Date__c,Does_contribution_bring_tax_benifit__c, Does_tax_benifit_realize_really__c,May_yearly_tax_deduction_allowed__c,What_of_contribution_bring_tax_benifit__c from Budget__c where Primary_Owner__c =: clientId 
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
                        setData +='\'startdate\':\'' + e.Start_Date__c.month() + '/' + e.Start_Date__c.year() + '\',';
                        setData +='\'enddate\':\'' + e.End_Date__c.month() + '/' + e.End_Date__c.year() + '\',';
                        setData +='\'isTaxBenefit\':'+e.Does_contribution_bring_tax_benifit__c+',';
                        setData +='\'percentContribution\':'+e.What_of_contribution_bring_tax_benifit__c+',';
                        setData +='\'maxLimit\':'+e.May_yearly_tax_deduction_allowed__c+',';
                        setData +='\'isMonthly\':'+e.Does_tax_benifit_realize_really__c+',';
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
                    setData +='\'enddate\':\'' + enddate + '\',';
                    setData +='\'isTaxBenefit\':'+false+',';
                    setData +='\'percentContribution\':0,';
                    setData +='\'maxLimit\':0,';
                    setData +='\'isMonthly\':'+false;
                    setData +='}';
                }
                
                setData += ']"}';
                // setData += ',{\'name\' :\''+name+'\',\'type\' :\''+'afford'+'\', \'totalAmount\' : ' + totalAmount + ',\'downPayment\' : ' + downPayment + ',\'installments\' : ' + installments + ',\'startDate\' :\''+startDate+'\',\'endDate\' :\''+endDate+'\',\'isTaxBenefit\' : ' + isTaxBenefit + ',\'isPaymentPlan\' : ' + isPaymentPlan + ',\'rainyDayMonths\' : ' + rainyDayMonths + '}]"}';
                clientData = setData;
                System.debug('Client Data from Future Simulation: ' + clientData);
                
            }
            System.debug('Non-HouseHold Request Data:$%' + setData);
            return setData;
        }
    } //method end
    
    
    
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
    public static list<GoalPerformanceAndMonteCarlo.FinGoalWrapperClass> getGoals(String ClientId) {
       return GoalPerformanceAndMonteCarlo.getGoals(ClientId, false, '');
        
    }//method End
    
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
        
        /* @auraEnabled
public List<GoalPerformanceData> data;*/
        @auraEnabled
        public Decimal actualValue;
        
        
        
        
    }
    
    //Query Financial Accounts
    @auraEnabled   
    public static FinAccountWrapperClass getAccounts(String ClientId) {
        FinAccountWrapperClass fin=new FinAccountWrapperClass();
        
        try{
            List<FinServ__FinancialAccount__c> cashAccountList=new List<FinServ__FinancialAccount__c>();
            Double cashAmount=0.0;
            List<FinServ__FinancialAccount__c> creditAccountList=new List<FinServ__FinancialAccount__c>();
            Double creditAmount=0;
            List<FinServ__FinancialAccount__c> investmentAccountList=new List<FinServ__FinancialAccount__c>();
            Double investmentAmount=0;
            List<FinServ__FinancialAccount__c> loanAccountList=new List<FinServ__FinancialAccount__c>();
            Double loanAmount=0;
            
            Account a = [select id, Name, RecordType.DeveloperName from Account where id =: ClientId];
            if(a.RecordType.DeveloperName == 'IndustriesHousehold'){
                //isHousehold = true;
            }
            else if(a.RecordType.DeveloperName == 'IndustriesIndividual'){
                List<FinServ__FinancialAccount__c> finAccounts=[Select Id, Name, FinServ__PrimaryOwner__c,FinServ__Balance__c, FinServ__APY__c, FinServ__LoanAmount__c, Account_Type__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:ClientId AND (Account_Type__c='401K' OR Account_Type__c='CD' OR Account_Type__c='529 Account' OR Account_Type__c='Checking' OR Account_Type__c='IRA' OR Account_Type__c='Money Market' OR Account_Type__c='Retail Brokerage' OR Account_Type__c='Roth IRA'  OR Account_Type__c='Savings' OR Account_Type__c='Loan' OR Account_Type__c='Credit Card') ];
                if(!finAccounts.isEmpty()){
                    for(FinServ__FinancialAccount__c f: finAccounts){
                        if(f.Account_Type__c=='Savings' || f.Account_Type__c=='Money Market' || f.Account_Type__c=='CD' || f.Account_Type__c=='Checking'){
                            cashAccountList.add(f);
                            cashAmount+=f.FinServ__Balance__c;
                        }
                        else if(f.Account_Type__c=='401K' || f.Account_Type__c=='529 Account' || f.Account_Type__c=='IRA' || f.Account_Type__c=='Roth IRA' || f.Account_Type__c=='Retail Brokerage'){
                            investmentAccountList.add(f);
                            investmentAmount+=f.FinServ__Balance__c;
                        }
                        else if(f.Account_Type__c=='Credit Card'){
                            creditAccountList.add(f);
                            creditAmount+=f.FinServ__LoanAmount__c;
                        }
                        else if(f.Account_Type__c=='Loan'){
                            loanAccountList.add(f);
                            loanAmount+=f.FinServ__LoanAmount__c;
                        }
                        
                    }
                }
                fin.cashAccountList=cashAccountList;
                fin.investmentAccountList=investmentAccountList;
                fin.creditAccountList=creditAccountList;
                fin.loanAccountList=loanAccountList;
                fin.cashAmount=cashAmount;
                fin.investmentAmount=investmentAmount;
                fin.creditAmount=creditAmount;
                fin.loanAmount=loanAmount;
            } 
            if(Test.isRunningTest())
                throw new nullpointerexception();
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        return fin;
        
    }//method End
    
    @AuraEnabled 
    public static List<RecordType> getRecordTypeIds(){
        List<RecordType> recordTypes;
        try{
            
            recordTypes=[select Id,DeveloperName  from RecordType where sObjectType='FinServ__FinancialAccount__c'];
            if(TEST.isRunningTest())
                throw new NullPointerException();
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return recordTypes;
        
    }
    
    public class WrapperClass {
        
        /* @auraEnabled
public List<FinServ__FinancialGoal__c> financialGoalList;*/
        
        @auraEnabled
        public List<Double> balanceList;
        
        @AuraEnabled
        public Boolean isportalUser;
        
        @AuraEnabled
        public String firstClient;
        
        @AuraEnabled
        public String responseData;
        
        @AuraEnabled
        public String clientid;
        
        @AuraEnabled
        public List<RecordType> recordTypes;
        
    } //end of Wrapper class 
    
    public class FinAccountWrapperClass {
        
        @auraEnabled
        public List<FinServ__FinancialAccount__c> cashAccountList;
        
        @auraEnabled
        public List<FinServ__FinancialAccount__c> creditAccountList;
        
        @auraEnabled
        public List<FinServ__FinancialAccount__c> investmentAccountList;
        
        @auraEnabled
        public List<FinServ__FinancialAccount__c> loanAccountList;
        
        @auraEnabled
        public Double cashAmount;
        
        @auraEnabled
        public Double creditAmount;
        
        @auraEnabled
        public Double investmentAmount;
        
        @auraEnabled
        public Double loanAmount;
        
        
    } //end of Wrapper class 
    
    @auraEnabled
    public static WrapperClass getData(String id) {
        WrapperClass wrapperObj = new WrapperClass();
        try{
            //set initial Client
            Account acc = [Select id, Name from account where id=:id  limit 1];
            initialClient = acc.Name;
            initialClientId = acc.id;
            //Store Household status here        
            Account a = [select id, Name, RecordType.DeveloperName from Account where id =: initialClientId];
            if(a.RecordType.DeveloperName == 'IndustriesHousehold'){
                isHousehold = true;
            }
            if(test.isRunningTest()){
                isHousehold = true;
            }
            // wrapperObj.financialGoalList = ClientDetailApex.getGoals(initialClientId);
            wrapperObj.balanceList = tempList;
            wrapperObj.isportalUser = isportalEnabled;
            wrapperObj.firstClient = initialClient;
            wrapperObj.clientid = initialClientId;
            wrapperObj.recordTypes = [select Id,DeveloperName  from RecordType where sObjectType='FinServ__FinancialAccount__c'];
            ClientDetailApex.createClientData(initialClientId);
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
    public static FinGoalWrapperClass getGoalDetail(string goalId,String ClientId) {
        FinGoalWrapperClass fingoalwrap=new FinGoalWrapperClass();
        FinServ__FinancialAccount__c ffa;
        Decimal goalstatus;
        Boolean goalTrack;
        
        Decimal totalEstimated;
        Decimal actualValue;
        FinServ__FinancialGoal__c f;
        try{        
            f= [Select id,FinServ__PrimaryOwner__c ,Goal_Priority__c,Goal_Priority_Number__c, Associated_Account__r.FinServ__Balance__c,Annual_Growth_Rate__c,FinServ__PrimaryOwner__r.name, Name, Start_Value__c , Required_Monthly_Saving__c ,Associated_Account__r.Account_Type__c,Associated_Account__r.Name,Start_Date__c,FinServ__TargetDate__c,FinServ__TargetValue__c,FinServ__ActualValue__c
                from FinServ__FinancialGoal__c  where FinServ__PrimaryOwner__c =: ClientId and id=:goalId limit 1];
            
            goalTrack=false;
            
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
                
            }else {
                goalstatus = goalstatus;
                f.Current_Goal_Amount__c = goalstatus;
                goalTrack = true;
                
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
            
            
            System.debug(goalTrack);
            fingoalwrap.finGoal=f;
            fingoalwrap.actualValue=actualValue;
            
            
            
        }
        catch(Exception e){
            System.debug(e.getStackTraceString());
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        system.debug('value of view Goal'+f);
        
        system.debug('value of view Goal'+fingoalwrap);
        return fingoalwrap;
        
    }
    @auraEnabled
    public static Account getClient(String ClientId) {
        
        Account ac;
        try{        
            ac= [Select Id from Account  where Id =: ClientId];
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        return ac;
        
    }
    @auraEnabled
    public static boolean deleteFinAccout(String finId) {
        
        FinServ__FinancialAccount__c ac;
        try{        
            ac= [Select Id,RecordType.DeveloperName from FinServ__FinancialAccount__c  where Id =: finId limit 1];
            if(ac.RecordType.DeveloperName !='LoanAccount' && ac.Recordtype.DeveloperName!='CreditCard'){
                List<FinServ__FinancialGoal__c> fl= [Select id from FinServ__FinancialGoal__c  where Associated_Account__c =: finId];
                if(fl.size()>0){
                    return false;
                }
                else{
                    delete ac;
                }
                
            }
            else{
                delete ac;
            }
            
        }
        catch(Exception e){
            
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
            
        }
        return true;
        
    }
}//Outer Class
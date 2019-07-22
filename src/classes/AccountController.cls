public class AccountController {
    
    
    public static String columnList {get; set;}
    
    public static void getDisplayColumns()
    {
        try
        {
            string doInitColumns ='FinServ__ClientCategory__c,FinServ__TotalRevenue__c,AnnualRevenue';
            List<UserPrefr__c> getColumns = [Select Id, Manage_List_Column__c 
                                             FROM UserPrefr__c 
                                             WHERE Namespace__c = null and createdById=:UserInfo.getUserId()];
            if(getColumns!=null && getColumns.size()>0)
            {
                if(String.isEmpty(getColumns[0].Manage_List_Column__c))
                {
                    columnList = '';
                }
                else
                {
                    columnList = getColumns[0].Manage_List_Column__c;
                }
            }
            if(getColumns.size() <= 0)
            {
                columnList = doInitColumns;
            }
        }
        catch(exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
    }
    @AuraEnabled
    public static ResultWrapper ColumnSet1(String whereClause)
    {
        getDisplayColumns();
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType leadSchema = schemaMap.get('Account');
        Map<String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap();
        list<wrapperClass> lstFieldsetWrapper = new list<wrapperClass>();
        Set<String> setFieldsToQuery = new set<String>();
        set<string> NotReqiuredFields= new set<string>{'parentid','Createdbyid','id','isdeleted'};
            
            for (String fieldName: fieldMap.keySet()) 
        {    
            if(!NotReqiuredFields.contains(fieldName))
            {
                setFieldsToQuery.add(fieldName);
                
                Schema.DisplayType fielddataType = fieldMap.get(fieldName).getDescribe().getType();            
                
                String fieldLabel = fieldMap.get(fieldName).getDescribe().getLabel();
                
                lstFieldsetWrapper.add(new wrapperClass(fieldMap.get(fieldName).getDescribe().getName(),fieldLabel ,string.valueof(fielddataType)));
                
            }
        }
        string currentuser =UserInfo.getUserId();
        String queryString = 'Select  id, ';
        setFieldsToQuery.remove('id');
        queryString += String.join( new List<String>(setFieldsToQuery), ',');
        queryString.removeEnd(',');
        if(String.isempty(whereClause))
        {
            queryString += ' FROM  Account Where createdById=:currentuser' ;
        }
        else
        {
            queryString += ' FROM  Account '+whereClause +' AND createdById=:currentuser' ;
        }
        System.debug('queryString::'+queryString);
        list<SObject> lstSObject = Database.query(queryString);
        
        System.debug('columnList::'+columnList);        
        return new ResultWrapper(lstSObject,lstFieldsetWrapper,columnList);
        
    }    
    @AuraEnabled
    public static ResultWrapper ColumnSet()
    {
        getDisplayColumns();
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType leadSchema = schemaMap.get('Account');
        Map<String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap();
        list<wrapperClass> lstFieldsetWrapper = new list<wrapperClass>();
        Set<String> setFieldsToQuery = new set<String>();
        set<string> NotReqiuredFields= new set<string>{'parentid','Createdbyid','id','isdeleted'};
            
            for (String fieldName: fieldMap.keySet()) 
        {    
            if(!NotReqiuredFields.contains(fieldName))
            {
                setFieldsToQuery.add(fieldName);
                
                Schema.DisplayType fielddataType = fieldMap.get(fieldName).getDescribe().getType();            
                
                String fieldLabel = fieldMap.get(fieldName).getDescribe().getLabel();
                
                lstFieldsetWrapper.add(new wrapperClass(fieldMap.get(fieldName).getDescribe().getName(),fieldLabel ,string.valueof(fielddataType)));
                
            }
        }
        string currentuser =UserInfo.getUserId();
        String queryString = 'Select  id, ';
        setFieldsToQuery.remove('id');
        queryString += String.join( new List<String>(setFieldsToQuery), ',');
        queryString.removeEnd(',');
       
            queryString += ' FROM  Account Where createdById=:currentuser' ;
               
        System.debug('queryString::'+queryString);
        list<SObject> lstSObject = Database.query(queryString);
        
        System.debug('columnList::'+columnList);        
        return new ResultWrapper(lstSObject,lstFieldsetWrapper,columnList);
        
    }
    public class ResultWrapper {
        
        @AuraEnabled
        public list<SObject> lstSObject;
        @AuraEnabled
        public list<wrapperClass> lstFields;
        @AuraEnabled 
        public String columnsSaving;
        
        public ResultWrapper(list<SObject> lstSObject, list<wrapperClass> lstFields, String columnsSave ) {
            
            this.lstSObject = lstSObject;
            this.lstFields  = lstFields;
            this.columnsSaving  = columnsSave;
        }
    }
    
    
    
    public class wrapperClass{
        @AuraEnabled public String fieldName {get;set;}
        @AuraEnabled public String label {get;set;}
        @AuraEnabled public String type  {get;set;}
        
        public wrapperClass(String fieldName, String strLabel, String strType) {
            this.fieldName = fieldName;
            this.label = strLabel;
            this.type = strType;
        }
        
    }
    
    
    
    @AuraEnabled
    public static List<Account> getLimitedAccounts(String searchKeyword)
    {
        Map<String, Schema.SObjectField> objectFields = Schema.getGlobalDescribe().get('Account').getDescribe().fields.getMap();
        system.debug('aaa'+objectFields);
        List<String>  strList = new List<String>(objectFields.keySet());
        system.debug('strList'+strList);
        String s='';
        for(String str:strList)
        {
            if(s=='')
            {
                s=str;
            }
            else
            {
                s+=','+str;
            }
        }
        string currentuser =UserInfo.getUserId();
        String query='select '+ s + ' FROM  Account Where createdById=:currentuser AND name LIKE ' + '\''+searchKeyword+'%'+'\''; 
        system.debug('query'+query); 
        List<Account> accList=Database.query(query);
        system.debug('accList'+accList);
        return accList;
    }
    
/*    @AuraEnabled
    public static List<Account> findByName(String searchKey) 
    {
        system.debug('searchKey'+searchKey);
        String name = '%' + searchKey + '%';
        List<Account> accounts = [SELECT Id, name, Phone,FinServ__ClientCategory__c,FinServ__TotalRevenue__c,AnnualRevenue, CreatedDate FROM Account WHERE name LIKE :name and createdById=:UserInfo.getUserId()]; 
        system.debug('accountslist'+accounts);
        return accounts;
    }*/
    @AuraEnabled
    public static void saveColumns(String getSelectedColumns)
    {
        try
        {
            List<UserPrefr__c> columnView = [Select Id, Manage_List_Column__c 
                                             FROM UserPrefr__c 
                                             WHERE Namespace__c = null and createdById=:UserInfo.getUserId()];
            if(columnView!=null && columnView.size()>0){
                columnView[0].Manage_List_Column__c = getSelectedColumns;
                update columnView;
            }
            else{
                UserPrefr__c obj = new UserPrefr__c(Name=UserInfo.getUserId(),Manage_List_Column__c=getSelectedColumns);
                insert obj;
            }
        }
        catch(exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
    }
    
}
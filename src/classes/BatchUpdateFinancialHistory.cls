global class BatchUpdateFinancialHistory implements Database.Batchable<sObject>,Schedulable{
    String st;
    List<RecordType> recordtype=[Select  Id,DeveloperName from RecordType where sObjectType='FinancialAccountHistory__c'];
    public BatchUpdateFinancialHistory(){
        Schema.DescribeSObjectResult FAcc = FinServ__FinancialAccount__c.sObjectType.getDescribe();
        List<String> FAccFields =  new list<String>();
        set<string> notrequireField=new set<String>{'recordtypeid','ownerid'}; 
            for(string FAccField : FAcc.fields.getMap().keySet()){
                if(!notrequireField.contains(FAccField)){
                    FAccFields.add(FAccField);
                }
            }
        st=string.join(FAccFields,',');
        system.debug('success'); 
    }
    
    global Database.QueryLocator start(Database.BatchableContext bc) {
        
        return Database.getQueryLocator(
            'SELECT ' + st + ', RecordType.developername  FROM FinServ__FinancialAccount__c'
        );
    }
    global void execute(Database.BatchableContext bc, List<FinServ__FinancialAccount__c>  FinancialAcc){
        List<FinancialAccountHistory__c> FinancialAccountHistory = new List<FinancialAccountHistory__c>(); 
        
        
        List<String> fieldListApi = st.split(',');
        
        Map<String, Schema.SObjectField> objectFields = Schema.getGlobalDescribe().get('FinServ__FinancialAccount__c').getDescribe().fields.getMap();
       
        List<String>  strList = new List<String>(objectFields.keySet());
        
        for (FinServ__FinancialAccount__c FinancialAccount : FinancialAcc) {
            FinancialAccountHistory__c fah=new FinancialAccountHistory__c();
            
            for(String str:fieldListApi){
                if(objectFields.get(str).getDescribe().isUpdateable() ) {
                    if(str.startsWith('finserv__')){
                        String FahStr=str.substring(9);
                        fah.put(FahStr,FinancialAccount.get(str)); 
                    }
                    else{
                        fah.put(str,FinancialAccount.get(str));  
                    }
                }
                else{
                    // fah.put(str,FinancialAccount.get(str));  
                }
                
            }            
            DateTime dt = DateTime.now();    
            String monthName = dt.format('MMM-YYYY');
            fah.History_of_Month__c=monthName;
            fah.Financial_Account__c=FinancialAccount.Id;
            for(recordType rt:recordtype){
                String FArecType=FinancialAccount.RecordType.developername;
                if(FArecType.equals(rt.DeveloperName)){
                    fah.RecordTypeId=rt.Id;      
                } 
                else{
                    
                }
            }
            FinancialAccountHistory.add(fah);
            system.debug('success end'); 
            
        }
        if(Schema.sObjectType.FinancialAccountHistory__c.isCreateable()) {
            insert FinancialAccountHistory;
        }
        
    } 
    
    global void finish(Database.BatchableContext bc){
        
    } 
    global void execute(SchedulableContext ctx) {
        BatchUpdateFinancialHistory bufah=new BatchUpdateFinancialHistory();
        Database.ExecuteBatch(bufah,200);
    }
}
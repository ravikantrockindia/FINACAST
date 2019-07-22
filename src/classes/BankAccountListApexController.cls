public class BankAccountListApexController {
    @auraEnabled
    public static List<List<Object>> getBank() {
        List<List<Object>> returnObjList = new List<List<Object>>();
      
            List<Client_Adviser_Configuration__c> caConfigList = [select Adviser_Id__c,Client_Id__c,Client_Id__r.name  from Client_Adviser_Configuration__c where adviser_id__c =: UserInfo.getUserId() limit 1];
            Client_Adviser_Configuration__c caConfig = new Client_Adviser_Configuration__c();
            if(caConfigList.size()>0)
            {
                caConfig = caConfigList[0];
            }
            List<FinServ__FinancialAccount__c> retList = [Select id , Name, Account_Type__c,FinServ__PrimaryOwner__r.name, FinServ__CurrentPostedBalance__c, FinServ__APY__c,FinServ__PaymentAmount__c
                                                          from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c =: caConfig.Client_Id__c ];
            List<String> clientName = new List<String>();
            clientName.add(caConfig.Client_Id__r.name);
            clientName.add(caConfig.Client_Id__c);
            
            returnObjList.add(retList);
            returnObjList.add(clientName);
       
        return  returnObjList;
    }
    
    @auraEnabled
    public static void deleteBankAccount(id accId) {
            if (Schema.sObjectType.FinServ__FinancialAccount__c.isDeletable()){
                FinServ__FinancialAccount__c accItem = [Select id from FinServ__FinancialAccount__c where id =:accId];
                if (Schema.sObjectType.FinServ__FinancialAccount__c.isDeletable()){
                    delete accItem;
                }
            }
        
    }
    
    
    @auraEnabled
    public static List<List<Object>> getClientBank(String clientId) {
        List<List<Object>> returnObjList = new List<List<Object>>();
        
        
            List<FinServ__FinancialAccount__c> retList = [Select id , Name, Account_Type__c,FinServ__PrimaryOwner__r.name, FinServ__CurrentPostedBalance__c, FinServ__APY__c,FinServ__PaymentAmount__c
                                                          from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c =: clientId ];
            List<String> clientName = new List<String>();
            
            clientName.add([select id,name from account where id=: clientId ].name);
            clientName.add([select id,name from account where id=: clientId ].id);
            
            returnObjList.add(retList);
            returnObjList.add(clientName);
       
        return  returnObjList;
    }
    
    @auraEnabled
    public static void editData( String recId, String owner, String type, String phoneno, String name, Decimal cVal, String website)
    {
        
            List<FinServ__FinancialAccount__c> acc = [Select FinServ__PrimaryOwner__c,Account_Type__c, 
                                                      Bank_Phone_Number__c, Name,FinServ__CurrentPostedBalance__c, Website__c
                                                      from FinServ__FinancialAccount__c where id = :recId];
            System.debug('enter apex');
            System.debug('acc: '+acc);
            for(FinServ__FinancialAccount__c a : acc)
            {a.FinServ__PrimaryOwner__c = owner;
             
             a.Bank_Phone_Number__c = phoneno;
             a.FinServ__CurrentPostedBalance__c = cVal;
             a.Website__c = website;
            }
            System.debug('acc2: '+acc);
            update(acc);
        
    }
    
}
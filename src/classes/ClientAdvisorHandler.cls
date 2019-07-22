/***
* created by: avneet kaur
* handler for createClientAdvisorTrigger
* test class :TestClientAdvisorHandler
***/

public class ClientAdvisorHandler {
    
    //to create client advisor on inserting new account record
    
    public static void createClientAdvisor(List<Account> accCreateList)
    {       
        List<Client_Adviser_Configuration__c> caList=  new List<Client_Adviser_Configuration__c>();   
        for(Account acc : accCreateList)
        {
            Client_Adviser_Configuration__c caConfig = new Client_Adviser_Configuration__c();
            caConfig.Adviser_Id__c = acc.CreatedById;
            caConfig.Client_Id__c = acc.Id;
            caList.add(caConfig);
        }
        
            if (Schema.sObjectType.Client_Adviser_Configuration__c.isCreateable())
                insert caList; 
        
        
    }
    
    // to delete client advisor on deleting related account record
    
    public static void deleteClientAdvisor(List<Account> accDeleteList)
    {
        List<Id> accDelList = new  List<Id>();
        for(Account acc : accDeleteList)
        {
            accDelList.add(acc.Id);          
        }
       
            if (Schema.sObjectType.Client_Adviser_Configuration__c.isDeletable()) {
                
                List<Client_Adviser_Configuration__c> caDelList = [select id, name, Client_Id__c from Client_Adviser_Configuration__c where Client_Id__c In :accDelList];        
                
                delete caDelList;
            }
       
        
    }
}
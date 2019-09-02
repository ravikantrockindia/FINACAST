public class FetchImage {
    @AuraEnabled
    public static String fetchLatestImage(string cid) {
        attachment a=  [select id from attachment where ParentId=:cid Order by LAstMOdifiedDate desc limit 1];
        return a.Id;
    }
    @AuraEnabled
    public static String getNameSpace(){
        return NamespaceUtility.returnNamespace();
    }
     @AuraEnabled 
    public static List<Contact> getContact(String recordId){
         List<Contact> c;
        try{
            
           c=[Select Id, FinServ__Gender__c, Email, Birthdate, AccountId, Phone from Contact where AccountId=:recordId limit 1];
            
            
        }catch(Exception e){
            new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }
        return c;
        
    }
}
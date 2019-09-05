public class FetchImage {
    @AuraEnabled
    public static String fetchLatestImage(string cid) {
        List<attachment> a;
        try{
            a =  [select id from attachment where ParentId=:cid Order by LAstMOdifiedDate desc limit 1];
            
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        
        return a[0].Id;
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
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return c;
        
    }
}
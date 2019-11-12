public class FetchImage {
    @AuraEnabled
    public static String fetchLatestImage(string cid) {
        String aa;
        List<attachment> a;
        try{
            a =  [select id from attachment where ParentId=:cid Order by LAstMOdifiedDate desc limit 1];
            System.debug('a[0].Id'+a[0].Id);
            return a[0].Id;
        }catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        System.debug('aa'+aa);
        return aa;
        
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
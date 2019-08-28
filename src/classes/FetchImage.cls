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
}
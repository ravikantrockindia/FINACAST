public class insertImage {
@AuraEnabled
    public static List<ContentVersion> getContents(string cid) {
       // system.debug('kisgan'+cid);
        Set<Id> contentIds = new Set<Id>();

        for (ContentDocumentLink cont :[Select Id ,contentdocumentid from ContentDocumentlink where linkedentityid  =: cid]) {
            contentIds.add(cont.contentdocumentid);
        }
     //   system.debug('*----contentIds'+contentIds);
	/*	Account a = new account();
        a.id = cid;
        a.image_link__c= '/sfc/servlet.shepherd/version/download/06946000004R5b8AAC';
            update a;
*/
        return [SELECT Id,Title FROM ContentVersion WHERE ContentDocumentId IN :contentIds ORDER BY LastModifiedDate DESC LIMIT 1];
    }
    @AuraEnabled
    public static String getNameSpace(){
        return NamespaceUtility.returnNamespace();
    }
   
}
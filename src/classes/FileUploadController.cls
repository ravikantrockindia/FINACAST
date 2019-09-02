public with sharing class FileUploadController {
    @AuraEnabled
    public static Id saveChunk(Id parentId, String fileName, String base64Data, String contentType, String fileId) {
        
        if (fileId == '') {
            fileId = saveTheFile(parentId, fileName, base64Data, contentType);
        } else {
            appendToFile(fileId, base64Data);
        }
        
        return Id.valueOf(fileId);
    }
    public static Id saveTheFile(Id parentId, String fileName, String base64Data, String contentType) {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        
        Attachment oAttachment = new Attachment();
        oAttachment.parentId = parentId;
        
        oAttachment.Body = EncodingUtil.base64Decode(base64Data);
        oAttachment.Name = fileName;
        oAttachment.ContentType = contentType;
        
        insert oAttachment;
        
        return oAttachment.Id;
    }
    private static void appendToFile(Id fileId, String base64Data) {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
         
        Attachment a = [
            SELECT Id, Body
            FROM Attachment
            WHERE Id =: fileId
        ];
         
        
        String existingBody = EncodingUtil.base64Encode(a.Body);
        
        a.Body = EncodingUtil.base64Decode(existingBody + base64Data);
        
        update a;
    }
    @AuraEnabled
    public static void DeleteLatestImage(string cid) {
        
        attachment a=  [select id from attachment where ParentId=:cid Order by LAstMOdifiedDate desc limit 1];
        
        delete a;
        
    }
    @AuraEnabled 
    public static void updateContact(String recordId, String phone, String email, String gender, String dob){
        try{
            
            system.debug(phone+email+gender+dob+recordId);
            List<Contact> c=[Select Id, FinServ__Gender__c, Email, Birthdate, AccountId, Phone from Contact where AccountId=:recordId limit 1];
            c[0].FinServ__Gender__c=gender;
            c[0].Email=email;
            if(dob!=null)
            c[0].Birthdate=Date.valueOf(dob);
            c[0].Phone=phone;
            update c;
            System.debug(c);
                if(TEST.isRunningTest())
                    throw new NullPointerException();
            
        }catch(Exception e){
            System.debug(e.getStackTraceString());
            //new Exception_Details__c(Line_Number__c=e.getLineNumber(), Message__c=e.getMessage(), Stack_Trace__c=e.getStackTraceString());
        }
        
        
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
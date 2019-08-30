@isTest
private class FileUploadControllerTest {
 //@isTest
    
  /*  public static void test(){
        Test.startTest();
        Account a=new Account();
        a.name='test';
        insert a;
        
        blob file=  Blob.valueOf('sample text');
        Attachment Att=new Attachment(); 
        Att.Body= file;
        Att.Name = 'test Attachment';
        Att.ParentId = a.Id;
        String existingBody = EncodingUtil.base64Encode(Att.Body);
        
        Att.Body = EncodingUtil.base64Decode(existingBody + file.toString());
        
        insert Att;
        FileUploadController.saveChunk(a.Id,'Hello',file.toString(),'png','');
        FileUploadController.DeleteLatestImage(a.Id);
        FileUploadController.saveChunk(a.Id,'Hello',file.toString(),'png',Att.Id);
        Test.stopTest();
    } */
    public static testmethod void  saveChunk(){
        contact objContact =  new Contact(lastName='test contact');
        insert objContact ;
        
        blob file=  Blob.valueOf('sample text');
        Attachment objAttachment=new Attachment(); 
        objAttachment.Body= file;
        objAttachment.Name = 'test Attachment';
        objAttachment.ParentId = objContact.Id;
        insert objAttachment;
        
        FileUploadController.saveChunk(objContact.id,'testAttachment',file.toString(),'jpg',objAttachment.Id);
        FileUploadController.saveChunk(objContact.id,'testAttachment',file.toString(),'jpg','');
        FileUploadController.DeleteLatestImage(objContact.Id);
    }
    
    
}
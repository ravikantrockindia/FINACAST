@isTest
private class FileUploadControllerTest {
    @isTest
    public static void  saveChunk(){
        contact objContact =  new Contact(lastName='test contact');
        objContact.Birthdate=system.today();
        objContact.Email='abac@gmail.com';
        objContact.Phone='2345678923';
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
        FileUploadController.updateContact(objContact.id,'1234567890','abc@gmail.com','male','system.today()');
        FileUploadController.getContact(objContact.Id);

        System.assert(objContact !=null);
    }
    
    
}
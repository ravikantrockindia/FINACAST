@isTest
public class FileUploadControllerTest {
 @isTest
    public static void test(){
        Test.startTest();
         FileUploadController.saveChunk('0014o00001fRvurAAC','Hello','base64Data','png','');
        FileUploadController.DeleteLatestImage('0014o00001fRvurAAC');
        FileUploadController.saveChunk('0014o00001fRvurAAC','Hello','base64Data','png','00P4o000008Kj4m');
    	 
        
        
        
        Test.stopTest();
    }
}
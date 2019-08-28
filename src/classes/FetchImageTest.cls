@isTest
public class FetchImageTest {
    @isTest
    public static void test(){
        String cid='base64Data';
    	Account a=new Account();
        a.name='test';
        insert a;
        attachment b=new attachment();
         b.name='test2';
        b.Body=EncodingUtil.base64Decode(cid);
        b.ParentId=a.Id;
        insert b;
        FetchImage.fetchLatestImage(a.Id);
        FetchImage.getNameSpace();         
    }
}
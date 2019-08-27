@isTest
public class FetchImageTest {
    @isTest
    public static String test(){
        String cid='0014600001eRaKDAA0';
    	
        
        FetchImage.fetchLatestImage(cid);
        attachment a=  [select id from attachment where ParentId=:cid Order by LAstMOdifiedDate desc limit 1];
        return a.Id;
         
    }
}
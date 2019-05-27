@IsTest(SeeAllData = true)
public class LookupTest {
          public static testMethod void testm(){
 
          String objectName='Account';
          String fld_API_Text='Name';
          String fld_API_Val='OwnerId';
          Integer lim=2;
          String fld_API_Search='FinServ__BorrowingPriorities__c';
              String searchText='sdd';
              
              String objName1='Account';
         	  String text1='Name';
         	  String val1='10';
          
           Test.startTest();
           Lookup.searchDB(objectName,fld_API_Text,fld_API_Val, lim, fld_API_Search,searchText);
              Lookup.ResultWrapper r1  = new Lookup.ResultWrapper();
              r1.objName=objName1;
              r1.text=text1;
              r1.val=val1;
          
          Test.stopTest();   
          }
}
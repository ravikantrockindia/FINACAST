@IsTest(SeeAllData = true)
public class IndividualAccount_TriggerHandler2test {
 public static testMethod void testm(){
     List<Account>  a1 = new  List<Account>();
     Test.startTest();

      IndividualAccount_TriggerHandler2.createPublicGroup(a1)  ;
   Test.stopTest();   
      
    
  }
}
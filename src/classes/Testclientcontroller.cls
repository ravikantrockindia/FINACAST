@IsTest(SeeAllData = true)
public class Testclientcontroller {
    
      public static testMethod void testm(){
          
          String name='SAHILDALAL101';
          String firstname='SAHIL';
          String lastname='DALAL';
          String email='abc@gmail.com';
          
          Test.startTest();
          clientcontroller.saveData(name,firstname,lastname,email);
          
          Test.stopTest();
      /*Account a = new Account(Name='sahil');
          insert a;
          a.Name='Updated';
          update a;*/
      }
}
@IsTest(SeeAllData = true)
public class AffordabilityControllerTest {
public static testMethod void testm(){
         String name ='Sahil';
         Double totalAmount=32.2167; 
             Double downPayment=25.4546;
             Double installments=464.3456;
             String startDate='23';
             String endDate='4';
             Boolean isTaxBenefit =true;
             Boolean isPaymentPlan=true;
             Integer rainyDayMonths=5;
          
          Test.startTest();
     AffordabilityController.ShowAffordabilityResult(name,totalAmount,downPayment,installments,startDate,endDate,isTaxBenefit ,isPaymentPlan,rainyDayMonths);
 
 //      AffordabilityController.ShowAffordabilityResult.clientId='0014600001ZDL9HAAX';
          Test.stopTest();
}
}
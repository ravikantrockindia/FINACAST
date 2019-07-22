@isTest
public class MyClientFilterControllerTest 
{
    @isTest
    public static void testClientFilter()
    {
        
        MyClientFilterController.getObjectFieldsApex('account');
        MyClientFilterController.getGenuineObjectFieldsApex('account');
        MyClientFilterController.setExcludedFields('account');
        MyClientFilterController.getNamespace();
        
    }

}
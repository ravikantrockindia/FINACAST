@isTest
public class MyClientFilterControllerTest 
{
    @isTest
    public static void testClientFilter()
    {
        
        MyClientFilterController.Data_Wrapper dw = MyClientFilterController.getObjectFieldsApex('account');
        MyClientFilterController.getGenuineObjectFieldsApex('account');
        MyClientFilterController.setExcludedFields('account');
        MyClientFilterController.getNamespace();
        
        System.assert(dw != null);
    }

}
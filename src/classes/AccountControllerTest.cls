@isTest
public class AccountControllerTest 
{
     @istest
    public static void TestAffordablity() 
    {
        AccountController.ColumnSet();
        AccountController.getDisplayColumns();
        AccountController.getLimitedAccounts('s');
        AccountController.ResultWrapper rw = AccountController.ColumnSet1(' Where createdById=:currentuser');
        AccountController.saveColumns('name');
        AccountController.saveColumns('');
        System.assert(rw != null);
        
    }

}
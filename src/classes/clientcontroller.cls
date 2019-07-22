public class clientcontroller {
 @auraEnabled
    public static void saveData(String name, String firstname,String lastname , String email)
    {
        try{
        System.debug('apex controller');
        Account acc = new Account();
       
        acc.Name = name;
        
      
        if (Schema.sObjectType.Account.isCreateable())
        insert(acc); 
    }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
    }
}
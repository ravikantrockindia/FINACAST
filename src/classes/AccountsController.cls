public class AccountsController {
    @AuraEnabled
    public static List <Account> getAccounts() {
        return [SELECT id, name, Phone FROM Account ORDER BY createdDate ASC];
    }
    @auraEnabled
    public static void deleteClients(id ClientId) {
        try{
            if (Schema.sObjectType.Account.isDeletable()){
                Account clientItem = [Select id from Account where id =:ClientId];      
                if (Schema.sObjectType.Account.isDeletable())
                    delete clientItem;
            }
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
    }
}
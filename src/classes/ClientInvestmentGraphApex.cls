public class ClientInvestmentGraphApex {
@AuraEnabled
    public static List<FinServ__AssetsAndLiabilities__c> GetData(){
        List<FinServ__AssetsAndLiabilities__c> li= new List<FinServ__AssetsAndLiabilities__c>();
        li=[Select FinServ__Amount__c,FinServ__PrimaryOwner__c,FinServ__AssetsAndLiabilitiesType__c,Name,FinServ__OwnerType__c,FinServ__Description__c,FinServ__FinancialAccount__r.Name from FinServ__AssetsAndLiabilities__c Where createdById=:UserInfo.getUserId()];
        return li;
    }
}
public class RiskProfileController {

    @AuraEnabled
    public static void updateInvestmentAccount(String riskResult){
        List<FinServ__FinancialAccount__c> investmentAccount=new List<FinServ__FinancialAccount__c>([Select Id, FinServ__ModelPortfolio__c, Risk_Profile__c from  FinServ__FinancialAccount__c where RecordType.DeveloperName='InvestmentAccount']);
        List<FinServ__FinancialAccount__c> updatedInvestmentAccount=new List<FinServ__FinancialAccount__c>();
        System.debug(investmentAccount.size());
        if(investmentAccount.size()>0){
            for(FinServ__FinancialAccount__c account: investmentAccount){
                account.FinServ__ModelPortfolio__c='Very Aggressive';
                account.Risk_Profile__c='Very Aggressive (11.0%)';
                updatedInvestmentAccount.add(account);
            }
        }
        update updatedInvestmentAccount;
        
    }
}
public class ClientLookupController{

    public Account selectedClient;
    public String selectedClientName;
    public String selectedClientId;
        
    public Account getClient(){
        return selectedClient =new Account();
    }
    
    public void setSelectedClientName(String s){
        selectedClientName=s;
    }
    
    public String getSelectedClientName(){
        return selectedClientName;
    }
    
    public void setSelectedClientId(String s){
        selectedClientId=s;
    }
    
    public String getSelectedClientId (){
        return selectedClientId;
    }
    
    
   /* public pageReference clientData(){
      if(selectedClient.Id!= null)
      {
         Client_Adviser_Configuration__c clientAdviserConfig = new Client_Adviser_Configuration__c();
          Account accYodlee = new Account();
          clientAdviserConfig.Adviser_Id__c = userinfo.getUserId();
          clientAdviserConfig.Client__c = selectedClient.Account__c;
          accYodlee =[SELECT FinacastApp__Yodlee_User_Name__c, Id FROM Account where Id=:selectedClient.Id ];
          clientAdviserConfig.FinacastApp__Yodlee_Id__c = accYodlee.FinacastApp__Yodlee_User_Name__c;
          upsert clientAdviserConfig Adviser_Id__c;
      }
      String pageName = ApexPages.CurrentPage().getUrl();
        if (pageName !=null && pageName.trim() !='')
        {
          pageName = pageName.replaceFirst('/apex/','');
          pageName = EncodingUtil.urlEncode(pageName, 'UTF-8');
          string[] pageNameExtra = pageName.split('%3F',0);
          pageName = pageNameExtra[0];                     
        }
        pageReference pageRef =new pageReference('/apex/'+pageName);
        pageRef.setRedirect(true);
        return pageRef;
    }*/
    
}
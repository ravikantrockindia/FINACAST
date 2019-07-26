public class NamespaceUtility {
     public static String returnNamespace(){
      /*  string namespace='';
      List<Finsol_Custom_Setting__c> finsolCustomSetting= [SELECT Namespace__c FROM Finsol_Custom_Setting__c where Name='Finsol' limit 1];
        if(!finsolCustomSetting.isEmpty()){
        if(finsolCustomSetting[0].Namespace__c!=null)
            namespace=finsolCustomSetting[0].Namespace__c+'__';
        }*/
        return '';
    }

}
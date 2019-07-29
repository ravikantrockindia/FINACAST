public class Budget {
    @AuraEnabled
    public String Id{get; set;} 
     @AuraEnabled
    public Decimal amount {get; set;}
     @AuraEnabled
    public String primaryOwnerId {get; set;}
     @AuraEnabled
    public String name {get; set;}
     @AuraEnabled
    public String frequency {get; set;}
    
    //public String recordTypeId {get; set;}
     @AuraEnabled
    public Decimal growthRate {get; set;}
     @AuraEnabled
    public date startDate{ get; set;}
     @AuraEnabled
    public Date endDate{ get; set;}
     @AuraEnabled
    public Decimal taxRate {get; set;}
   
}
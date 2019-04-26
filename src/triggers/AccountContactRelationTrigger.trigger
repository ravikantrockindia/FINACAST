trigger AccountContactRelationTrigger on AccountContactRelation (after insert,after update) {
    if(Trigger.isafter && trigger.isInsert){
        List<Id> idList = new List<Id>();
        //list<AccountContactRelation> cdr = new list<AccountContactRelation>();
       // list<AccountContactRelation> acrLi = [select id,AccountId,ContactId,FinServ__Primary__c from AccountContactRelation ];
        for( AccountContactRelation acRel : trigger.new)
        {
            idList.add(acRel.id);
            //cdr.add(acRel);
        }
      AccountContactRelationTriggerHelper.insertGrpMemList(idList);
      //AccountContactRelationTriggerHelper.shareAccount(cdr);
    }
    
}
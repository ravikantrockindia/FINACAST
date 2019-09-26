trigger updateAssetsOnInsertionOfFinancialAccount on FinServ__FinancialAccount__c (after insert,before delete, after update) {
    if(Trigger.isInsert){
        List<FinServ__AssetsAndLiabilities__c> c=new List<FinServ__AssetsAndLiabilities__c>();
        for(FinServ__FinancialAccount__c fa:Trigger.new){
            if(Trigger.isInsert){
                FinServ__AssetsAndLiabilities__c ast=new FinServ__AssetsAndLiabilities__c();
                ast.FinServ__FinancialAccount__c=fa.Id;
                ast.Name=fa.Name;
                ast.FinServ__PrimaryOwner__c=fa.FinServ__PrimaryOwner__c;
                ast.FinServ__JointOwner__c=fa.FinServ__JointOwner__c;
                string type;
                String typeast=ast.FinServ__AssetsAndLiabilitiesType__c;   
                String  typefa=fa.Account_Type__c;
                if(typefa=='Savings' || typefa=='Cash'){
                    type='Cash';
                    ast.FinServ__AssetsAndLiabilitiesType__c=type;
                    ast.FinServ__Amount__c=fa.FinServ__Balance__c; 
                } else if(typefa=='401K' || typefa=='529 Account'){
                    type='Bonds';
                    ast.FinServ__AssetsAndLiabilitiesType__c=type;
                    ast.FinServ__Amount__c=fa.FinServ__Balance__c; 
                }else if(typefa=='CD' || typefa=='Checking'){
                    type='Stocks';
                    ast.FinServ__AssetsAndLiabilitiesType__c=type;
                    ast.FinServ__Amount__c=fa.FinServ__Balance__c; 
                }else{
                    type='Others';
                    ast.FinServ__AssetsAndLiabilitiesType__c=type;
                    ast.FinServ__Amount__c=fa.FinServ__Balance__c; 
                }
                
                c.add(ast);
            }
        }
        insert c;
    } 
    
    if(Trigger.isDelete){
        List<FinServ__AssetsAndLiabilities__c> asts_to_delete=[select Id from FinServ__AssetsAndLiabilities__c where FinServ__FinancialAccount__c in:trigger.oldMap.keySet()];
        System.debug('size'+asts_to_delete.size());
        delete asts_to_delete;
        
    } 
    
    if(Trigger.isUpdate){
    map<Id, FinServ__FinancialAccount__c> ObjMap = new map<Id, FinServ__FinancialAccount__c>();
    
    for(FinServ__FinancialAccount__c obj: Trigger.new)
    {
        if (obj.Id != Null)
        {
            ObjMap.put(obj.Id, obj);
        }
    }
    
    List<FinServ__AssetsAndLiabilities__c> ast = [SELECT Id,Name, FinServ__FinancialAccount__c,FinServ__AssetsAndLiabilitiesType__c FROM FinServ__AssetsAndLiabilities__c WHERE FinServ__FinancialAccount__c IN :ObjMap.KeySet()];
    List<FinServ__AssetsAndLiabilities__c> faUpdateList = new List<FinServ__AssetsAndLiabilities__c>();
    
    for(FinServ__AssetsAndLiabilities__c c: ast)
    {
    	FinServ__FinancialAccount__c obj = ObjMap.get(c.FinServ__FinancialAccount__c);
        c.FinServ__FinancialAccount__c = obj.Id;
        c.Name = obj.Name;
        c.FinServ__PrimaryOwner__c=obj.FinServ__PrimaryOwner__c;
                c.FinServ__JointOwner__c=obj.FinServ__JointOwner__c;
                string type;
                String typeast=c.FinServ__AssetsAndLiabilitiesType__c;   
                String  typefa=obj.Account_Type__c;
                if(typefa=='Savings' || typefa=='Cash'){
                    type='Cash';
                    c.FinServ__AssetsAndLiabilitiesType__c=type;
                    c.FinServ__Amount__c=obj.FinServ__Balance__c; 
                } else if(typefa=='401K' || typefa=='529 Account'){
                    type='Bonds';
                    c.FinServ__AssetsAndLiabilitiesType__c=type;
                    c.FinServ__Amount__c=obj.FinServ__Balance__c; 
                }else if(typefa=='CD' || typefa=='Checking'){
                    type='Stocks';
                    c.FinServ__AssetsAndLiabilitiesType__c=type;
                    c.FinServ__Amount__c=obj.FinServ__Balance__c; 
                }else{
                    type='Others';
                    c.FinServ__AssetsAndLiabilitiesType__c=type;
                    c.FinServ__Amount__c=obj.FinServ__Balance__c; 
                }
 
        faUpdateList.add(c);
    }
    
    if(faUpdateList.size() > 0)
    {
        update faUpdateList;
    }
        
    }
}